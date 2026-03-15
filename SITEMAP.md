# Mapa do Site — hebertpaes.com

Atualizado em: 2026-03-14

## 1) Páginas públicas

- /
- /chat
- /ai-platform
- /noticias
- /cursos
- /cursos/[id]
- /cursos/checkout
- /cursos/checkout/sucesso
- /cursos/minha-area
- /marketplace
- /marketplace/checkout
- /marketplace/sucesso
- /podcast
- /dashboard
- /login

## 2) Área administrativa

- /admin
- /admin/login
- /admin/2fa
- /admin/dashboard
- /admin/cms

## 3) Hub OpenClaw

- /openclaw
- /openclaw/status
- /openclaw/agents
- /openclaw/sessions
- /openclaw/automations
- /openclaw/chat
- /openclaw/app

## 4) OAuth callbacks

- /auth/github/callback
- /auth/google/callback

## 5) APIs (internas)

### Admin
- /api/admin/login
- /api/admin/2fa/verify
- /api/admin/audit
- /api/admin/overview
- /api/admin/cursos/overview
- /api/admin/marketplace/overview
- /api/admin/marketplace/items

### CMS
- /api/admin/cms/stats
- /api/admin/cms/posts
- /api/admin/cms/posts/[id]
- /api/admin/cms/categories
- /api/admin/cms/tags
- /api/admin/cms/media
- /api/admin/cms/users
- /api/admin/cms/settings

### AI
- /api/ai/chat
- /api/ai/search
- /api/ai/research
- /api/ai/write
- /api/ai/code
- /api/ai/imagine
- /api/ai/guide
- /api/ai/agents
- /api/ai/multimodel

### Cursos
- /api/cursos/checkout
- /api/cursos/checkout/confirm
- /api/cursos/enrollments/me
- /api/cursos/webhook/payment

### Marketplace
- /api/marketplace/items
- /api/marketplace/orders

### OpenClaw
- /api/openclaw
- /api/openclaw/auth

### Prototype (telemetria/integração interna)
- /api/prototype/status
- /api/prototype/agents
- /api/prototype/sessions
- /api/prototype/automations
- /api/prototype/podcast

### Observabilidade
- /api/telemetry/web-vitals

## 6) Unificação feita nesta etapa

- Removidas rotas duplicadas de login:
  - /login/index.php
  - /login/index.py
- Mantida compatibilidade por redirecionamento permanente para `/login` em `next.config.ts`.
- Removido componente de homepage legado não utilizado:
  - `app/home-page-client.tsx`
- Criado sitemap técnico para buscadores:
  - `app/sitemap.ts`
