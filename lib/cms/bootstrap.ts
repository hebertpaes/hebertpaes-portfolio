import type { ConnectionPool } from "mssql";

export async function ensureCmsSchema(pool: ConnectionPool) {
  await pool.request().batch(`
IF OBJECT_ID('dbo.cms_users', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.cms_users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;

IF OBJECT_ID('dbo.cms_role_assignments', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.cms_role_assignments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    role_name NVARCHAR(64) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_cms_role_assignments_user FOREIGN KEY (user_id) REFERENCES dbo.cms_users(id) ON DELETE CASCADE,
    CONSTRAINT UQ_cms_role_assignments UNIQUE (user_id, role_name)
  );
END;

IF OBJECT_ID('dbo.cms_categories', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.cms_categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    slug NVARCHAR(255) NOT NULL UNIQUE,
    description NVARCHAR(1000) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;

IF OBJECT_ID('dbo.cms_tags', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.cms_tags (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    slug NVARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;

IF OBJECT_ID('dbo.cms_posts', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.cms_posts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(300) NOT NULL,
    slug NVARCHAR(300) NOT NULL UNIQUE,
    excerpt NVARCHAR(1200) NULL,
    content NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(32) NOT NULL DEFAULT 'draft',
    author_user_id INT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_cms_posts_author FOREIGN KEY (author_user_id) REFERENCES dbo.cms_users(id)
  );
END;

IF OBJECT_ID('dbo.cms_post_categories', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.cms_post_categories (
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_cms_post_categories PRIMARY KEY (post_id, category_id),
    CONSTRAINT FK_cms_post_categories_post FOREIGN KEY (post_id) REFERENCES dbo.cms_posts(id) ON DELETE CASCADE,
    CONSTRAINT FK_cms_post_categories_category FOREIGN KEY (category_id) REFERENCES dbo.cms_categories(id) ON DELETE CASCADE
  );
END;

IF OBJECT_ID('dbo.cms_post_tags', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.cms_post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_cms_post_tags PRIMARY KEY (post_id, tag_id),
    CONSTRAINT FK_cms_post_tags_post FOREIGN KEY (post_id) REFERENCES dbo.cms_posts(id) ON DELETE CASCADE,
    CONSTRAINT FK_cms_post_tags_tag FOREIGN KEY (tag_id) REFERENCES dbo.cms_tags(id) ON DELETE CASCADE
  );
END;

IF OBJECT_ID('dbo.cms_media', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.cms_media (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    url NVARCHAR(2000) NOT NULL,
    alt_text NVARCHAR(600) NULL,
    mime_type NVARCHAR(200) NULL,
    size_bytes BIGINT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;

IF OBJECT_ID('dbo.cms_settings', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.cms_settings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    key_name NVARCHAR(255) NOT NULL UNIQUE,
    value NVARCHAR(MAX) NOT NULL,
    group_name NVARCHAR(120) NOT NULL DEFAULT 'general',
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
`);
}
