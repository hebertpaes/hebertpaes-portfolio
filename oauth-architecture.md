# OAuth + OpenClaw Public Architecture

## Objetivo
Login funcional em `hebertpaes.com/login` com GitHub OAuth e chat OpenClaw público em `hebertpaes.com/openclaw`.

## Fluxo GitHub OAuth
1. Usuário clica em **Continuar com GitHub**.
2. Redireciona para GitHub com `client_id` + `redirect_uri`.
3. GitHub retorna para:
   - `https://hebertpaes.com/auth/github/callback?code=...`
4. Callback troca `code` por token (backend seguro).
5. Backend cria sessão segura (cookie HttpOnly) e redireciona para `/openclaw/agents`.

## Variáveis necessárias
- `NEXT_PUBLIC_GITHUB_CLIENT_ID`
- `NEXT_PUBLIC_GITHUB_REDIRECT_URI`
- `GITHUB_CLIENT_SECRET` (somente backend)
- `SQL_CONNECTION_STRING`

## WebSocket público OpenClaw
- Cloudflare Worker expõe: `/openclaw/ws`
- Worker encaminha para: `ws://74.235.188.0:18789`
- Autenticação por token (`OPENCLAW_PROXY_TOKEN`)

## Segurança mínima
- Nunca expor `GITHUB_CLIENT_SECRET` no frontend.
- Nunca salvar token em código-fonte.
- Usar secrets no Azure/Cloudflare.
- Rotacionar segredos após incidentes.
