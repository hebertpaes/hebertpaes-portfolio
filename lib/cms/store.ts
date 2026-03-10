import { getSqlPool, sql } from "@/lib/sql";
import { ensureCmsSchema } from "@/lib/cms/bootstrap";
import type { CmsCategory, CmsMedia, CmsPost, CmsPostStatus, CmsSetting, CmsStats, CmsTag, CmsUser } from "@/lib/cms/types";

type DbRow = Record<string, unknown>;

type PostInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  status?: CmsPostStatus;
  authorUserId?: number | null;
  categoryIds?: number[];
  tagIds?: number[];
};

function normalizeSlug(input: string) {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `item-${Date.now()}`;
}

function normalizeStatus(status: string | undefined): CmsPostStatus {
  return status === "published" ? "published" : "draft";
}

function asDate(value: unknown) {
  return value instanceof Date ? value.toISOString() : new Date(String(value || "")).toISOString();
}

function mapPost(row: DbRow): CmsPost {
  return {
    id: Number(row.id),
    title: String(row.title || ""),
    slug: String(row.slug || ""),
    excerpt: row.excerpt ? String(row.excerpt) : null,
    content: String(row.content || ""),
    status: normalizeStatus(String(row.status || "draft")),
    authorUserId: row.author_user_id === null || row.author_user_id === undefined ? null : Number(row.author_user_id),
    createdAt: asDate(row.created_at),
    updatedAt: asDate(row.updated_at),
    categories: [],
    tags: [],
  };
}

function mapCategory(row: DbRow): CmsCategory {
  return {
    id: Number(row.id),
    name: String(row.name || ""),
    slug: String(row.slug || ""),
    description: row.description ? String(row.description) : null,
    createdAt: asDate(row.created_at),
  };
}

function mapTag(row: DbRow): CmsTag {
  return {
    id: Number(row.id),
    name: String(row.name || ""),
    slug: String(row.slug || ""),
    createdAt: asDate(row.created_at),
  };
}

function mapMedia(row: DbRow): CmsMedia {
  return {
    id: Number(row.id),
    title: String(row.title || ""),
    url: String(row.url || ""),
    altText: row.alt_text ? String(row.alt_text) : null,
    mimeType: row.mime_type ? String(row.mime_type) : null,
    sizeBytes: row.size_bytes === null || row.size_bytes === undefined ? null : Number(row.size_bytes),
    createdAt: asDate(row.created_at),
  };
}

function mapUser(row: DbRow): CmsUser {
  const roles = String(row.roles_csv || "")
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);

  return {
    id: Number(row.id),
    name: String(row.name || ""),
    email: String(row.email || ""),
    active: Boolean(row.active),
    createdAt: asDate(row.created_at),
    roles,
  };
}

function mapSetting(row: DbRow): CmsSetting {
  return {
    id: Number(row.id),
    keyName: String(row.key_name || ""),
    value: String(row.value || ""),
    groupName: String(row.group_name || "general"),
    createdAt: asDate(row.created_at),
    updatedAt: asDate(row.updated_at),
  };
}

function sanitizeIds(input: number[] | undefined) {
  if (!input) return [];
  return Array.from(new Set(input.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)));
}

async function ensureReady() {
  const pool = await getSqlPool();
  await ensureCmsSchema(pool);
  return pool;
}

async function attachPostRelations(posts: CmsPost[]) {
  if (posts.length === 0) return posts;

  const pool = await ensureReady();
  const ids = posts.map((post) => post.id).join(",");

  const [categoryRows, tagRows] = await Promise.all([
    pool.request().query(`
      SELECT pc.post_id, c.id, c.name, c.slug
      FROM dbo.cms_post_categories pc
      JOIN dbo.cms_categories c ON c.id = pc.category_id
      WHERE pc.post_id IN (${ids})
    `),
    pool.request().query(`
      SELECT pt.post_id, t.id, t.name, t.slug
      FROM dbo.cms_post_tags pt
      JOIN dbo.cms_tags t ON t.id = pt.tag_id
      WHERE pt.post_id IN (${ids})
    `),
  ]);

  const byPost = new Map<number, CmsPost>();
  for (const post of posts) byPost.set(post.id, post);

  for (const row of categoryRows.recordset as DbRow[]) {
    const post = byPost.get(Number(row.post_id));
    if (!post) continue;
    post.categories.push({ id: Number(row.id), name: String(row.name || ""), slug: String(row.slug || "") });
  }

  for (const row of tagRows.recordset as DbRow[]) {
    const post = byPost.get(Number(row.post_id));
    if (!post) continue;
    post.tags.push({ id: Number(row.id), name: String(row.name || ""), slug: String(row.slug || "") });
  }

  return posts;
}

async function replacePostRelations(postId: number, categoryIds: number[], tagIds: number[]) {
  const pool = await ensureReady();

  await pool.request().input("postId", sql.Int, postId).query("DELETE FROM dbo.cms_post_categories WHERE post_id = @postId");
  await pool.request().input("postId", sql.Int, postId).query("DELETE FROM dbo.cms_post_tags WHERE post_id = @postId");

  for (const categoryId of categoryIds) {
    await pool
      .request()
      .input("postId", sql.Int, postId)
      .input("categoryId", sql.Int, categoryId)
      .query(`
        INSERT INTO dbo.cms_post_categories (post_id, category_id)
        SELECT @postId, @categoryId
        WHERE EXISTS (SELECT 1 FROM dbo.cms_categories WHERE id = @categoryId)
      `);
  }

  for (const tagId of tagIds) {
    await pool
      .request()
      .input("postId", sql.Int, postId)
      .input("tagId", sql.Int, tagId)
      .query(`
        INSERT INTO dbo.cms_post_tags (post_id, tag_id)
        SELECT @postId, @tagId
        WHERE EXISTS (SELECT 1 FROM dbo.cms_tags WHERE id = @tagId)
      `);
  }
}

export async function listCmsPosts() {
  const pool = await ensureReady();
  const result = await pool.request().query(`
    SELECT id, title, slug, excerpt, content, status, author_user_id, created_at, updated_at
    FROM dbo.cms_posts
    ORDER BY created_at DESC
  `);

  const posts = (result.recordset as DbRow[]).map(mapPost);
  return attachPostRelations(posts);
}

export async function getCmsPost(id: number) {
  const pool = await ensureReady();
  const result = await pool.request().input("id", sql.Int, id).query(`
    SELECT id, title, slug, excerpt, content, status, author_user_id, created_at, updated_at
    FROM dbo.cms_posts
    WHERE id = @id
  `);

  const row = (result.recordset as DbRow[])[0];
  if (!row) return null;

  const [post] = await attachPostRelations([mapPost(row)]);
  return post;
}

export async function createCmsPost(input: PostInput) {
  const pool = await ensureReady();
  const slug = normalizeSlug(input.slug || input.title);
  const status = normalizeStatus(input.status);

  const result = await pool
    .request()
    .input("title", sql.NVarChar(300), input.title)
    .input("slug", sql.NVarChar(300), slug)
    .input("excerpt", sql.NVarChar(1200), input.excerpt || null)
    .input("content", sql.NVarChar(sql.MAX), input.content)
    .input("status", sql.NVarChar(32), status)
    .input("authorUserId", sql.Int, input.authorUserId ?? null)
    .query(`
      INSERT INTO dbo.cms_posts (title, slug, excerpt, content, status, author_user_id)
      OUTPUT INSERTED.id
      VALUES (@title, @slug, @excerpt, @content, @status, @authorUserId)
    `);

  const createdId = Number((result.recordset as DbRow[])[0]?.id);
  await replacePostRelations(createdId, sanitizeIds(input.categoryIds), sanitizeIds(input.tagIds));

  return getCmsPost(createdId);
}

export async function updateCmsPost(id: number, input: PostInput) {
  const pool = await ensureReady();
  const existing = await getCmsPost(id);
  if (!existing) return null;

  const title = input.title || existing.title;
  const slug = normalizeSlug(input.slug || existing.slug || title);
  const excerpt = input.excerpt === undefined ? existing.excerpt : input.excerpt;
  const content = input.content || existing.content;
  const status = normalizeStatus(input.status || existing.status);
  const authorUserId = input.authorUserId === undefined ? existing.authorUserId : input.authorUserId;

  await pool
    .request()
    .input("id", sql.Int, id)
    .input("title", sql.NVarChar(300), title)
    .input("slug", sql.NVarChar(300), slug)
    .input("excerpt", sql.NVarChar(1200), excerpt || null)
    .input("content", sql.NVarChar(sql.MAX), content)
    .input("status", sql.NVarChar(32), status)
    .input("authorUserId", sql.Int, authorUserId ?? null)
    .query(`
      UPDATE dbo.cms_posts
      SET
        title = @title,
        slug = @slug,
        excerpt = @excerpt,
        content = @content,
        status = @status,
        author_user_id = @authorUserId,
        updated_at = SYSUTCDATETIME()
      WHERE id = @id
    `);

  await replacePostRelations(
    id,
    input.categoryIds === undefined ? existing.categories.map((category) => category.id) : sanitizeIds(input.categoryIds),
    input.tagIds === undefined ? existing.tags.map((tag) => tag.id) : sanitizeIds(input.tagIds)
  );

  return getCmsPost(id);
}

export async function deleteCmsPost(id: number) {
  const pool = await ensureReady();
  const result = await pool.request().input("id", sql.Int, id).query("DELETE FROM dbo.cms_posts WHERE id = @id");
  return result.rowsAffected[0] > 0;
}

export async function listCmsCategories() {
  const pool = await ensureReady();
  const result = await pool.request().query(`
    SELECT id, name, slug, description, created_at
    FROM dbo.cms_categories
    ORDER BY created_at DESC
  `);
  return (result.recordset as DbRow[]).map(mapCategory);
}

export async function createCmsCategory(input: { name: string; slug?: string; description?: string }) {
  const pool = await ensureReady();
  const slug = normalizeSlug(input.slug || input.name);

  const result = await pool
    .request()
    .input("name", sql.NVarChar(255), input.name)
    .input("slug", sql.NVarChar(255), slug)
    .input("description", sql.NVarChar(1000), input.description || null)
    .query(`
      INSERT INTO dbo.cms_categories (name, slug, description)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.slug, INSERTED.description, INSERTED.created_at
      VALUES (@name, @slug, @description)
    `);

  return mapCategory((result.recordset as DbRow[])[0]);
}

export async function listCmsTags() {
  const pool = await ensureReady();
  const result = await pool.request().query(`
    SELECT id, name, slug, created_at
    FROM dbo.cms_tags
    ORDER BY created_at DESC
  `);
  return (result.recordset as DbRow[]).map(mapTag);
}

export async function createCmsTag(input: { name: string; slug?: string }) {
  const pool = await ensureReady();
  const slug = normalizeSlug(input.slug || input.name);

  const result = await pool
    .request()
    .input("name", sql.NVarChar(255), input.name)
    .input("slug", sql.NVarChar(255), slug)
    .query(`
      INSERT INTO dbo.cms_tags (name, slug)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.slug, INSERTED.created_at
      VALUES (@name, @slug)
    `);

  return mapTag((result.recordset as DbRow[])[0]);
}

export async function listCmsMedia() {
  const pool = await ensureReady();
  const result = await pool.request().query(`
    SELECT id, title, url, alt_text, mime_type, size_bytes, created_at
    FROM dbo.cms_media
    ORDER BY created_at DESC
  `);
  return (result.recordset as DbRow[]).map(mapMedia);
}

export async function createCmsMedia(input: {
  title: string;
  url: string;
  altText?: string;
  mimeType?: string;
  sizeBytes?: number | null;
}) {
  const pool = await ensureReady();
  const result = await pool
    .request()
    .input("title", sql.NVarChar(255), input.title)
    .input("url", sql.NVarChar(2000), input.url)
    .input("altText", sql.NVarChar(600), input.altText || null)
    .input("mimeType", sql.NVarChar(200), input.mimeType || null)
    .input("sizeBytes", sql.BigInt, input.sizeBytes ?? null)
    .query(`
      INSERT INTO dbo.cms_media (title, url, alt_text, mime_type, size_bytes)
      OUTPUT INSERTED.id, INSERTED.title, INSERTED.url, INSERTED.alt_text, INSERTED.mime_type, INSERTED.size_bytes, INSERTED.created_at
      VALUES (@title, @url, @altText, @mimeType, @sizeBytes)
    `);

  return mapMedia((result.recordset as DbRow[])[0]);
}

export async function listCmsUsers() {
  const pool = await ensureReady();
  const result = await pool.request().query(`
    SELECT
      u.id,
      u.name,
      u.email,
      u.active,
      u.created_at,
      STRING_AGG(ra.role_name, ',') WITHIN GROUP (ORDER BY ra.role_name) AS roles_csv
    FROM dbo.cms_users u
    LEFT JOIN dbo.cms_role_assignments ra ON ra.user_id = u.id
    GROUP BY u.id, u.name, u.email, u.active, u.created_at
    ORDER BY u.created_at DESC
  `);

  return (result.recordset as DbRow[]).map(mapUser);
}

export async function createCmsUser(input: { name: string; email: string; roles?: string[]; active?: boolean }) {
  const pool = await ensureReady();
  const safeRoles = Array.from(
    new Set(
      (input.roles || ["editor"])
        .map((role) => role.trim().toLowerCase())
        .filter((role) => role.length > 0 && role.length <= 64)
    )
  );

  const result = await pool
    .request()
    .input("name", sql.NVarChar(255), input.name)
    .input("email", sql.NVarChar(255), input.email.toLowerCase())
    .input("active", sql.Bit, input.active === false ? 0 : 1)
    .query(`
      INSERT INTO dbo.cms_users (name, email, active)
      OUTPUT INSERTED.id
      VALUES (@name, @email, @active)
    `);

  const id = Number((result.recordset as DbRow[])[0]?.id);

  for (const role of safeRoles) {
    await pool
      .request()
      .input("userId", sql.Int, id)
      .input("roleName", sql.NVarChar(64), role)
      .query("INSERT INTO dbo.cms_role_assignments (user_id, role_name) VALUES (@userId, @roleName)");
  }

  const users = await listCmsUsers();
  return users.find((user) => user.id === id) || null;
}

export async function listCmsSettings() {
  const pool = await ensureReady();
  const result = await pool.request().query(`
    SELECT id, key_name, value, group_name, created_at, updated_at
    FROM dbo.cms_settings
    ORDER BY group_name ASC, key_name ASC
  `);
  return (result.recordset as DbRow[]).map(mapSetting);
}

export async function upsertCmsSetting(input: { keyName: string; value: string; groupName?: string }) {
  const pool = await ensureReady();

  await pool
    .request()
    .input("keyName", sql.NVarChar(255), input.keyName)
    .input("value", sql.NVarChar(sql.MAX), input.value)
    .input("groupName", sql.NVarChar(120), input.groupName || "general")
    .query(`
      MERGE dbo.cms_settings AS target
      USING (SELECT @keyName AS key_name, @value AS value, @groupName AS group_name) AS source
      ON target.key_name = source.key_name
      WHEN MATCHED THEN
        UPDATE SET
          value = source.value,
          group_name = source.group_name,
          updated_at = SYSUTCDATETIME()
      WHEN NOT MATCHED THEN
        INSERT (key_name, value, group_name)
        VALUES (source.key_name, source.value, source.group_name);
    `);

  const result = await pool
    .request()
    .input("keyName", sql.NVarChar(255), input.keyName)
    .query("SELECT id, key_name, value, group_name, created_at, updated_at FROM dbo.cms_settings WHERE key_name = @keyName");

  return mapSetting((result.recordset as DbRow[])[0]);
}

export async function getCmsStats(): Promise<CmsStats> {
  const pool = await ensureReady();
  const result = await pool.request().query(`
    SELECT
      (SELECT COUNT(1) FROM dbo.cms_posts) AS posts,
      (SELECT COUNT(1) FROM dbo.cms_posts WHERE status = 'published') AS published_posts,
      (SELECT COUNT(1) FROM dbo.cms_categories) AS categories,
      (SELECT COUNT(1) FROM dbo.cms_tags) AS tags,
      (SELECT COUNT(1) FROM dbo.cms_media) AS media,
      (SELECT COUNT(1) FROM dbo.cms_users) AS users,
      (SELECT COUNT(1) FROM dbo.cms_settings) AS settings
  `);

  const row = (result.recordset as DbRow[])[0] || {};
  return {
    posts: Number(row.posts || 0),
    publishedPosts: Number(row.published_posts || 0),
    categories: Number(row.categories || 0),
    tags: Number(row.tags || 0),
    media: Number(row.media || 0),
    users: Number(row.users || 0),
    settings: Number(row.settings || 0),
  };
}
