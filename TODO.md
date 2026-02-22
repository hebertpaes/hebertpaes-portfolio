# TODO - Finalização OpenClaw + OAuth

## 1) GitHub OAuth App
- [ ] Criar OAuth App no GitHub Developer Settings
- [ ] Authorization callback URL: `https://hebertpaes.com/auth/github/callback`
- [ ] Copiar `Client ID` e `Client Secret`

## 2) Azure Static Web App - App Settings
- [ ] `NEXT_PUBLIC_GITHUB_CLIENT_ID`
- [x] `NEXT_PUBLIC_GITHUB_REDIRECT_URI`
- [ ] `GITHUB_CLIENT_SECRET`
- [x] `SQL_CONNECTION_STRING`

## 3) OpenClaw público (WebSocket)
- [x] Arquivo `cloudflare-worker.js` no repositório
- [ ] Deploy do Worker via Wrangler
- [ ] Secret `OPENCLAW_PROXY_TOKEN`
- [ ] (Opcional) Secret `OPENCLAW_UPSTREAM_WS`

## 4) Callback OAuth
- [x] Rota de callback criada (`/auth/github/callback`)
- [ ] Implementar troca de `code` por access token no backend
- [ ] Criar sessão segura

## 5) Validação final
- [ ] Login GitHub completo em `/login`
- [ ] Acesso autenticado em `/openclaw/agents`
- [ ] Chat OpenClaw público funcional
