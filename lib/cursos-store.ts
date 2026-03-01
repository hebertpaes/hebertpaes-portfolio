import { getSqlPool, sql } from "@/lib/sql";

export type CheckoutRecord = {
  checkoutId: string;
  courseId: string;
  name: string;
  email: string;
  provider: string;
  status: "pending" | "paid" | "failed";
  paymentUrl: string;
  paymentRef?: string | null;
};

async function ensureTables() {
  const pool = await getSqlPool();
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'course_checkouts'
    )
    BEGIN
      CREATE TABLE dbo.course_checkouts (
        checkout_id NVARCHAR(64) NOT NULL PRIMARY KEY,
        course_id NVARCHAR(64) NOT NULL,
        buyer_name NVARCHAR(255) NOT NULL,
        buyer_email NVARCHAR(255) NOT NULL,
        provider NVARCHAR(32) NOT NULL,
        status NVARCHAR(16) NOT NULL,
        payment_url NVARCHAR(2000) NOT NULL,
        payment_ref NVARCHAR(255) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
      CREATE INDEX IX_course_checkouts_email ON dbo.course_checkouts (buyer_email);
    END

    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'course_enrollments'
    )
    BEGIN
      CREATE TABLE dbo.course_enrollments (
        id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        checkout_id NVARCHAR(64) NOT NULL,
        course_id NVARCHAR(64) NOT NULL,
        student_name NVARCHAR(255) NOT NULL,
        student_email NVARCHAR(255) NOT NULL,
        status NVARCHAR(16) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
      CREATE UNIQUE INDEX UX_course_enrollments_checkout ON dbo.course_enrollments (checkout_id);
      CREATE INDEX IX_course_enrollments_email_course ON dbo.course_enrollments (student_email, course_id);
    END
  `);
}

export async function createCheckoutRecord(record: CheckoutRecord) {
  await ensureTables();
  const pool = await getSqlPool();
  await pool
    .request()
    .input("checkoutId", sql.NVarChar(64), record.checkoutId)
    .input("courseId", sql.NVarChar(64), record.courseId)
    .input("name", sql.NVarChar(255), record.name)
    .input("email", sql.NVarChar(255), record.email)
    .input("provider", sql.NVarChar(32), record.provider)
    .input("status", sql.NVarChar(16), record.status)
    .input("paymentUrl", sql.NVarChar(2000), record.paymentUrl)
    .input("paymentRef", sql.NVarChar(255), record.paymentRef || null)
    .query(`
      INSERT INTO dbo.course_checkouts (
        checkout_id, course_id, buyer_name, buyer_email, provider, status, payment_url, payment_ref
      ) VALUES (
        @checkoutId, @courseId, @name, @email, @provider, @status, @paymentUrl, @paymentRef
      )
    `);
}

export async function markCheckoutPaidAndEnroll(checkoutId: string) {
  await ensureTables();
  const pool = await getSqlPool();

  const result = await pool
    .request()
    .input("checkoutId", sql.NVarChar(64), checkoutId)
    .query(`
      SELECT TOP 1 checkout_id, course_id, buyer_name, buyer_email
      FROM dbo.course_checkouts
      WHERE checkout_id = @checkoutId
    `);

  const row = result.recordset[0] as
    | { checkout_id: string; course_id: string; buyer_name: string; buyer_email: string }
    | undefined;

  if (!row) return { ok: false, reason: "checkout_not_found" as const };

  await pool
    .request()
    .input("checkoutId", sql.NVarChar(64), checkoutId)
    .query(`
      UPDATE dbo.course_checkouts
      SET status = 'paid', updated_at = SYSUTCDATETIME()
      WHERE checkout_id = @checkoutId
    `);

  await pool
    .request()
    .input("checkoutId", sql.NVarChar(64), row.checkout_id)
    .input("courseId", sql.NVarChar(64), row.course_id)
    .input("name", sql.NVarChar(255), row.buyer_name)
    .input("email", sql.NVarChar(255), row.buyer_email)
    .query(`
      MERGE dbo.course_enrollments AS target
      USING (SELECT @checkoutId AS checkout_id) AS source
      ON target.checkout_id = source.checkout_id
      WHEN MATCHED THEN
        UPDATE SET status = 'active', updated_at = SYSUTCDATETIME()
      WHEN NOT MATCHED THEN
        INSERT (checkout_id, course_id, student_name, student_email, status)
        VALUES (@checkoutId, @courseId, @name, @email, 'active');
    `);

  return { ok: true };
}
