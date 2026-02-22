import sql from "mssql";

const g = globalThis as typeof globalThis & { __sqlPool?: sql.ConnectionPool };

export async function getSqlPool() {
  const connectionString = process.env.SQL_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("SQL_CONNECTION_STRING não configurada");
  }

  if (g.__sqlPool) {
    if (g.__sqlPool.connected) return g.__sqlPool;
    if (g.__sqlPool.connecting) {
      await g.__sqlPool.connect();
      return g.__sqlPool;
    }
  }

  const pool = new sql.ConnectionPool(connectionString);
  g.__sqlPool = pool;
  await pool.connect();
  return pool;
}

export { sql };
