# Azure-Ready Hybrid Python Platform (Django + FastAPI)

This folder scaffolds a production-oriented parallel Python platform for `hebertpaes-portfolio`, while keeping the existing Next.js app untouched.

## Architecture
- **Django (`django_cms`)**: admin CMS, auth/session/JWT endpoints, canonical ORM schema.
- **FastAPI (`fastapi_api`)**: high-throughput REST API under `/api` using SQLAlchemy.
- **Shared package (`shared`)**: centralized settings and Pydantic schemas.
- **Data layer**: shared PostgreSQL schema (`platform_*` tables) used by both services.
- **Cache/queue**: optional Redis.
- **Infra (`infra/azure`)**: Azure CLI scripts for provisioning + deployment.

## Folder Structure
```text
python-platform/
  django_cms/
  fastapi_api/
  shared/
  infra/
    azure/
    nginx/
  docker-compose.yml
  README.md
```

## Local Run (Docker Compose)
```bash
cd python-platform
cp .env.example .env
docker compose up --build
```

Services:
- Django: `http://localhost:8000/admin/`
- FastAPI health: `http://localhost:8001/health`
- FastAPI API: `http://localhost:8001/api/posts`
- Django JWT token endpoint: `http://localhost:8000/auth/jwt/token/`

## Django Notes
- Custom `User` model (`platform_users`) with role enum: `admin`, `editor`, `author`.
- CMS models: `Category`, `Tag`, `Post`, `MediaAsset`, `SiteSetting`.
- Admin site configured for all models.
- Session auth endpoints:
  - `POST /auth/session/login/`
  - `POST /auth/session/logout/`
- JWT endpoints:
  - `POST /auth/jwt/token/`
  - `POST /auth/jwt/refresh/`

## FastAPI Endpoints
- `GET /health`
- `GET/POST/PUT/DELETE /api/posts`
- `GET/POST/PUT/DELETE /api/categories`
- `GET/POST/PUT/DELETE /api/tags`
- `GET/POST/PUT/DELETE /api/media`
- `GET/POST/PUT/DELETE /api/users`
- `GET /api/settings`
- `PUT /api/settings/{key}` (upsert)

Write operations require a bearer token via a placeholder dependency hook (`require_bearer_token`) ready for real JWT verification integration.

## Azure Provisioning
From `python-platform/infra/azure`:
1. `cp env.template env.sh` and fill values.
2. `./01-provision.sh` to create:
   - Resource Group
   - Azure Database for PostgreSQL Flexible Server
   - Azure Container Registry
   - Log Analytics
   - Container Apps Environment
   - 2 Container Apps (`django`, `fastapi`)
3. `./02-build-push.sh <tag>` to build/push images to ACR.
4. `./03-deploy-update.sh <tag>` to roll out updates.

## DNS + Front Door Integration for hebertpaes.com
Recommended edge pattern:
1. Create one **Azure Front Door Standard/Premium** profile.
2. Add two origins:
   - Django Container App FQDN
   - FastAPI Container App FQDN
3. Create routing rules:
   - `/admin/*` and `/auth/*` -> Django origin
   - `/api/*` -> FastAPI origin
   - Keep existing Next.js frontend origin as default route (`/*`) during migration.
4. Add custom domains in Front Door:
   - `hebertpaes.com`
   - `www.hebertpaes.com`
5. In your DNS provider (Cloudflare or Azure DNS), create CNAME/ALIAS records to Front Door endpoint.
6. Enable managed TLS certificates in Front Door.
7. Add WAF policy and rate limits, then attach to routes.
8. Update Django `DJANGO_ALLOWED_HOSTS` to include production hostnames.

## Nginx Reverse Proxy Example
Sample config at `infra/nginx/reverse-proxy.conf`:
- `/admin` -> Django
- `/api` -> FastAPI

Use this when self-hosting ingress instead of Azure Front Door.

## Production Hardening Checklist
- Replace all default secrets in `.env`/`env.sh`.
- Move secrets into Azure Key Vault and inject into Container Apps.
- Lock PostgreSQL firewall/private networking.
- Add CI/CD with migration gates and smoke tests.
- Implement real JWT validation in FastAPI (`aud`, `iss`, signature verification).
