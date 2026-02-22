# TODO - Finalização OpenClaw + OAuth

## 1) GitHub OAuth App
- [x] Criar OAuth App no GitHub Developer Settings
- [x] Authorization callback URL: `https://hebertpaes.com/auth/github/callback`
- [x] Client ID e Client Secret configurados

## 2) Azure Static Web App - App Settings
- [x] `NEXT_PUBLIC_GITHUB_CLIENT_ID`
- [x] `NEXT_PUBLIC_GITHUB_REDIRECT_URI`
- [x] `GITHUB_CLIENT_SECRET`
- [x] `SQL_CONNECTION_STRING`
- [x] `NEXT_PUBLIC_APP_URL`
- [x] `OPENCLAW_PROXY_TOKEN`
- [x] `OPENCLAW_UPSTREAM_WS`

## 3) OpenClaw público (WebSocket)
- [x] Arquivo `cloudflare-worker.js` no repositório
- [ ] Deploy do Worker via Wrangler (pendente ferramenta `wrangler` no host)
- [ ] Validar endpoint final `wss://.../openclaw/ws`

## 4) Callback OAuth + Sessão
- [x] Troca de `code` por token implementada (GitHub)
- [x] Sessão segura com cookie HttpOnly
- [x] Proteção de rota para áreas internas do OpenClaw
- [x] Logout implementado (`/api/auth/logout`)

## 5) Validação funcional
- [x] Login GitHub inicia corretamente
- [x] Acesso autenticado em `/openclaw/agents`
- [x] Rotas protótipo publicadas em produção (`/openclaw/app`, `/api/prototype/*`)
- [ ] Validação final do chat público via WebSocket (depende do deploy do Worker)
