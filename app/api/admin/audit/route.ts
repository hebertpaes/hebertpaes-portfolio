import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, hasAdminSession } from "@/lib/auth-guard";
import { getSqlPool, sql } from "@/lib/sql";

type AuditBody = {
  action?: string;
  status?: "ok" | "warn";
  context?: string;
};

async function ensureAuditTable() {
  const pool = await getSqlPool();
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'admin_audit_log'
    )
    BEGIN
      CREATE TABLE dbo.admin_audit_log (
        id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        admin_login NVARCHAR(255) NOT NULL,
        action NVARCHAR(500) NOT NULL,
        status NVARCHAR(16) NOT NULL,
        context NVARCHAR(1000) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );

      CREATE INDEX IX_admin_audit_log_created_at ON dbo.admin_audit_log (created_at DESC);
      CREATE INDEX IX_admin_audit_log_admin_login ON dbo.admin_audit_log (admin_login);
    END
  `);
}

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const limitParam = Number(req.nextUrl.searchParams.get("limit") || "20");
  const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(limitParam, 100)) : 20;

  try {
    await ensureAuditTable();
    const pool = await getSqlPool();
    const result = await pool.request().input("limit", sql.Int, limit).query(`
      SELECT TOP (@limit)
        id,
        admin_login AS adminLogin,
        action,
        status,
        context,
        created_at AS createdAt
      FROM dbo.admin_audit_log
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ ok: true, items: result.recordset });
  } catch {
    return NextResponse.json({ ok: true, items: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as AuditBody | null;
  const action = String(body?.action || "").trim();
  const status = body?.status === "warn" ? "warn" : "ok";
  const context = String(body?.context || "").trim();

  if (!action) {
    return NextResponse.json({ ok: false, error: "action_required" }, { status: 400 });
  }

  const session = getSessionFromRequest(req);
  const adminLogin = session?.login || session?.email || "admin";

  try {
    await ensureAuditTable();
    const pool = await getSqlPool();
    await pool
      .request()
      .input("adminLogin", sql.NVarChar(255), adminLogin)
      .input("action", sql.NVarChar(500), action.slice(0, 500))
      .input("status", sql.NVarChar(16), status)
      .input("context", sql.NVarChar(1000), context ? context.slice(0, 1000) : null)
      .query(`
        INSERT INTO dbo.admin_audit_log (admin_login, action, status, context)
        VALUES (@adminLogin, @action, @status, @context)
      `);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "audit_write_failed" }, { status: 500 });
  }
}
