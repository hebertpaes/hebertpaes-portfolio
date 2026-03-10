# hebertpaes.com

Site oficial com hub OpenClaw, login OAuth, área admin e páginas de conteúdo.

## Produção

- Site: https://hebertpaes.com
- OpenClaw Hub: https://hebertpaes.com/openclaw
- Podcast: https://hebertpaes.com/podcast

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra: http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Healthcheck de autenticação

Valida rapidamente as rotas públicas e proteção de endpoints admin.

```bash
# local
npm run health:auth

# produção
BASE_URL=https://hebertpaes.com npm run health:auth
```

## CMS admin (/admin/cms)

O projeto agora inclui um módulo CMS com painel em `/admin/cms`, APIs REST em `/api/admin/cms/*` e bootstrap automático das tabelas SQL (`IF OBJECT_ID(...) IS NULL`) antes de cada operação CMS.

### Seções no painel

- Dashboard com estatísticas CMS
- Posts/Artigos (CRUD)
- Categorias e Tags
- Biblioteca de mídia
- Usuários e permissões (roles)
- Configurações do site
- Editor rich text com toolbar (Markdown/HTML snippets) + textarea fallback

### Endpoints

- `GET/POST /api/admin/cms/posts`
- `GET/PUT/DELETE /api/admin/cms/posts/:id`
- `GET/POST /api/admin/cms/categories`
- `GET/POST /api/admin/cms/tags`
- `GET/POST /api/admin/cms/media`
- `GET/POST /api/admin/cms/users`
- `GET/POST /api/admin/cms/settings`
- `GET /api/admin/cms/stats`

Todos os endpoints CMS admin exigem sessão admin válida (`hasAdminSession`).

### Healthcheck CMS

```bash
# local
npm run health:cms

# produção
BASE_URL=https://hebertpaes.com npm run health:cms
```

## Stack

- Next.js 16
- React 19
- Azure Static Web Apps
- Azure SQL (persistência de podcast/admin)
