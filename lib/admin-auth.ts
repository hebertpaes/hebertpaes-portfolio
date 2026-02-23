import crypto from "node:crypto";
import { getSqlPool, sql } from "@/lib/sql";

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export async function ensureAdminUsersTable() {
  const pool = await getSqlPool();
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'admin_users'
    )
    BEGIN
      CREATE TABLE dbo.admin_users (
        id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        email NVARCHAR(255) NOT NULL UNIQUE,
        display_name NVARCHAR(255) NULL,
        password_salt NVARCHAR(255) NOT NULL,
        password_hash NVARCHAR(255) NOT NULL,
        active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END
  `);
}

export async function bootstrapAdminFromEnv() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Administrador";
  if (!email || !password) return;

  await ensureAdminUsersTable();

  const pool = await getSqlPool();
  const existing = await pool
    .request()
    .input("email", sql.NVarChar(255), email)
    .query(`SELECT TOP 1 email FROM dbo.admin_users WHERE email = @email`);

  if (existing.recordset.length > 0) return;

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);

  await pool
    .request()
    .input("email", sql.NVarChar(255), email)
    .input("display_name", sql.NVarChar(255), name)
    .input("password_salt", sql.NVarChar(255), salt)
    .input("password_hash", sql.NVarChar(255), hash)
    .query(`
      INSERT INTO dbo.admin_users (email, display_name, password_salt, password_hash, active)
      VALUES (@email, @display_name, @password_salt, @password_hash, 1)
    `);
}

export async function validateAdminLogin(emailRaw: string, password: string) {
  const email = emailRaw.trim().toLowerCase();
  if (!email || !password) return null;

  await ensureAdminUsersTable();
  await bootstrapAdminFromEnv();

  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input("email", sql.NVarChar(255), email)
    .query(`
      SELECT TOP 1 email, display_name, password_salt, password_hash, active
      FROM dbo.admin_users
      WHERE email = @email
    `);

  const row = result.recordset[0] as
    | { email: string; display_name?: string; password_salt: string; password_hash: string; active: boolean }
    | undefined;

  if (!row || !row.active) return null;

  const candidateHash = hashPassword(password, row.password_salt);
  const ok = crypto.timingSafeEqual(Buffer.from(candidateHash), Buffer.from(row.password_hash));
  if (!ok) return null;

  return {
    email: row.email,
    name: row.display_name || "Administrador",
  };
}
