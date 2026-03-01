import { getSqlPool, sql } from "@/lib/sql";

export type MarketplaceItem = {
  id: string;
  type: "produto" | "servico";
  title: string;
  description: string;
  priceLabel: string;
  category: string;
  active: boolean;
};

const seedItems: MarketplaceItem[] = [
  {
    id: "p1",
    type: "produto",
    title: "Pack de Templates de Vendas",
    description: "Scripts prontos para WhatsApp, Instagram e páginas de oferta.",
    priceLabel: "R$ 197",
    category: "Vendas",
    active: true,
  },
  {
    id: "p2",
    type: "produto",
    title: "Kit de Prompts IA Pro",
    description: "Biblioteca de prompts para marketing, atendimento e funis.",
    priceLabel: "R$ 297",
    category: "IA",
    active: true,
  },
  {
    id: "s1",
    type: "servico",
    title: "Mentoria Estratégica 1:1",
    description: "Sessão premium para posicionamento, oferta e escala de vendas.",
    priceLabel: "R$ 1.497",
    category: "Mentoria",
    active: true,
  },
  {
    id: "s2",
    type: "servico",
    title: "Implantação de Funil Completo",
    description: "Configuração ponta a ponta: captação, nurture e fechamento.",
    priceLabel: "R$ 4.900",
    category: "Implementação",
    active: true,
  },
];

const g = globalThis as typeof globalThis & {
  __marketplaceItemsMem?: MarketplaceItem[];
  __marketplaceOrdersMem?: any[];
};

function getMemItems() {
  if (!g.__marketplaceItemsMem) g.__marketplaceItemsMem = seedItems;
  return g.__marketplaceItemsMem;
}

function getMemOrders() {
  if (!g.__marketplaceOrdersMem) g.__marketplaceOrdersMem = [];
  return g.__marketplaceOrdersMem;
}

async function ensureTables() {
  const pool = await getSqlPool();
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'marketplace_items'
    )
    BEGIN
      CREATE TABLE dbo.marketplace_items (
        id NVARCHAR(64) NOT NULL PRIMARY KEY,
        item_type NVARCHAR(16) NOT NULL,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(1500) NOT NULL,
        price_label NVARCHAR(64) NOT NULL,
        category NVARCHAR(128) NOT NULL,
        active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END

    IF NOT EXISTS (
      SELECT * FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'marketplace_orders'
    )
    BEGIN
      CREATE TABLE dbo.marketplace_orders (
        id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        order_ref NVARCHAR(64) NOT NULL UNIQUE,
        item_id NVARCHAR(64) NOT NULL,
        buyer_name NVARCHAR(255) NOT NULL,
        buyer_email NVARCHAR(255) NOT NULL,
        buyer_phone NVARCHAR(64) NULL,
        status NVARCHAR(32) NOT NULL,
        provider NVARCHAR(32) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
      CREATE INDEX IX_marketplace_orders_email ON dbo.marketplace_orders (buyer_email);
      CREATE INDEX IX_marketplace_orders_item ON dbo.marketplace_orders (item_id);
    END
  `);
}

async function seedIfEmpty() {
  await ensureTables();
  const pool = await getSqlPool();
  const exists = await pool.request().query(`SELECT TOP 1 id FROM dbo.marketplace_items`);
  if (exists.recordset.length > 0) return;

  for (const item of seedItems) {
    await pool
      .request()
      .input("id", sql.NVarChar(64), item.id)
      .input("type", sql.NVarChar(16), item.type)
      .input("title", sql.NVarChar(255), item.title)
      .input("description", sql.NVarChar(1500), item.description)
      .input("price", sql.NVarChar(64), item.priceLabel)
      .input("category", sql.NVarChar(128), item.category)
      .input("active", sql.Bit, item.active ? 1 : 0)
      .query(`
        INSERT INTO dbo.marketplace_items (id, item_type, title, description, price_label, category, active)
        VALUES (@id, @type, @title, @description, @price, @category, @active)
      `);
  }
}

export async function listMarketplaceItems(type?: string) {
  try {
    await seedIfEmpty();
    const pool = await getSqlPool();
    const req = pool.request();
    let where = "WHERE active = 1";

    if (type === "produto" || type === "servico") {
      req.input("type", sql.NVarChar(16), type);
      where += " AND item_type = @type";
    }

    const result = await req.query(`
      SELECT id, item_type AS type, title, description, price_label AS priceLabel, category, active
      FROM dbo.marketplace_items
      ${where}
      ORDER BY item_type ASC, title ASC
    `);

    return result.recordset as MarketplaceItem[];
  } catch {
    const items = getMemItems();
    return (type === "produto" || type === "servico") ? items.filter((i) => i.type === type && i.active) : items.filter((i) => i.active);
  }
}

export async function createMarketplaceOrder(input: {
  itemId: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  provider: string;
}) {
  const orderRef = `ord_${crypto.randomUUID().slice(0, 12)}`;

  try {
    await ensureTables();
    const pool = await getSqlPool();
    await pool
      .request()
      .input("orderRef", sql.NVarChar(64), orderRef)
      .input("itemId", sql.NVarChar(64), input.itemId)
      .input("name", sql.NVarChar(255), input.name)
      .input("email", sql.NVarChar(255), input.email.toLowerCase())
      .input("phone", sql.NVarChar(64), input.phone || null)
      .input("status", sql.NVarChar(32), input.status)
      .input("provider", sql.NVarChar(32), input.provider)
      .query(`
        INSERT INTO dbo.marketplace_orders (order_ref, item_id, buyer_name, buyer_email, buyer_phone, status, provider)
        VALUES (@orderRef, @itemId, @name, @email, @phone, @status, @provider)
      `);
  } catch {
    getMemOrders().push({ orderRef, ...input, createdAt: new Date().toISOString() });
  }

  return orderRef;
}

export async function listMarketplaceItemsAdmin() {
  try {
    await seedIfEmpty();
    const pool = await getSqlPool();
    const result = await pool.request().query(`
      SELECT id, item_type AS type, title, description, price_label AS priceLabel, category, active
      FROM dbo.marketplace_items
      ORDER BY item_type ASC, title ASC
    `);
    return result.recordset as MarketplaceItem[];
  } catch {
    return getMemItems();
  }
}

export async function createMarketplaceItem(input: Omit<MarketplaceItem, "id"> & { id?: string }) {
  const item: MarketplaceItem = {
    id: input.id || `mk_${crypto.randomUUID().slice(0, 12)}`,
    type: input.type,
    title: input.title,
    description: input.description,
    priceLabel: input.priceLabel,
    category: input.category,
    active: input.active,
  };

  try {
    await ensureTables();
    const pool = await getSqlPool();
    await pool
      .request()
      .input("id", sql.NVarChar(64), item.id)
      .input("type", sql.NVarChar(16), item.type)
      .input("title", sql.NVarChar(255), item.title)
      .input("description", sql.NVarChar(1500), item.description)
      .input("price", sql.NVarChar(64), item.priceLabel)
      .input("category", sql.NVarChar(128), item.category)
      .input("active", sql.Bit, item.active ? 1 : 0)
      .query(`
        INSERT INTO dbo.marketplace_items (id, item_type, title, description, price_label, category, active)
        VALUES (@id, @type, @title, @description, @price, @category, @active)
      `);
  } catch {
    const items = getMemItems();
    items.push(item);
  }

  return item;
}

export async function updateMarketplaceItemActive(id: string, active: boolean) {
  try {
    await ensureTables();
    const pool = await getSqlPool();
    await pool.request().input("id", sql.NVarChar(64), id).input("active", sql.Bit, active ? 1 : 0).query(`
      UPDATE dbo.marketplace_items SET active = @active, updated_at = SYSUTCDATETIME() WHERE id = @id
    `);
  } catch {
    const items = getMemItems();
    const item = items.find((i) => i.id === id);
    if (item) item.active = active;
  }
}

export async function deleteMarketplaceItem(id: string) {
  try {
    await ensureTables();
    const pool = await getSqlPool();
    await pool.request().input("id", sql.NVarChar(64), id).query(`DELETE FROM dbo.marketplace_items WHERE id = @id`);
  } catch {
    const items = getMemItems();
    const idx = items.findIndex((i) => i.id === id);
    if (idx >= 0) items.splice(idx, 1);
  }
}

export async function getMarketplaceAdminOverview() {
  try {
    await ensureTables();
    const pool = await getSqlPool();
    const [totalsRes, funnelRes] = await Promise.all([
      pool.request().query(`
        SELECT
          COUNT(*) AS totalOrders,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingOrders,
          SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paidOrders
        FROM dbo.marketplace_orders
      `),
      pool.request().query(`
        SELECT TOP 8 item_id AS itemId, COUNT(*) AS orders
        FROM dbo.marketplace_orders
        GROUP BY item_id
        ORDER BY COUNT(*) DESC
      `),
    ]);

    const t = (totalsRes.recordset[0] || {}) as { totalOrders?: number; pendingOrders?: number; paidOrders?: number };
    return {
      totals: {
        totalOrders: Number(t.totalOrders || 0),
        pendingOrders: Number(t.pendingOrders || 0),
        paidOrders: Number(t.paidOrders || 0),
      },
      topItems: funnelRes.recordset as Array<{ itemId: string; orders: number }>,
    };
  } catch {
    return { totals: { totalOrders: 0, pendingOrders: 0, paidOrders: 0 }, topItems: [] as Array<{ itemId: string; orders: number }> };
  }
}
