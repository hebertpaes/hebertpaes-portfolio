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

## Stack

- Next.js 16
- React 19
- Azure Static Web Apps
- Azure SQL (persistência de podcast/admin)
