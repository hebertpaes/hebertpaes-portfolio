#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/env.sh"

TAG="${1:-latest}"

az account set --subscription "${AZURE_SUBSCRIPTION_ID}"

ACR_LOGIN_SERVER=$(az acr show --name "${ACR_NAME}" --query loginServer -o tsv)
PG_HOST="${POSTGRES_SERVER_NAME}.postgres.database.azure.com"
DB_DJANGO="postgresql://${POSTGRES_ADMIN_USER}:${POSTGRES_ADMIN_PASSWORD}@${PG_HOST}:5432/${POSTGRES_DB}?sslmode=require"
DB_FASTAPI="postgresql+psycopg://${POSTGRES_ADMIN_USER}:${POSTGRES_ADMIN_PASSWORD}@${PG_HOST}:5432/${POSTGRES_DB}?sslmode=require"

az containerapp update \
  --name "${DJANGO_APP_NAME}" \
  --resource-group "${AZURE_RESOURCE_GROUP}" \
  --image "${ACR_LOGIN_SERVER}/django-cms:${TAG}" \
  --set-env-vars \
    POSTGRES_HOST="${PG_HOST}" \
    POSTGRES_DB="${POSTGRES_DB}" \
    POSTGRES_USER="${POSTGRES_ADMIN_USER}" \
    POSTGRES_PASSWORD="${POSTGRES_ADMIN_PASSWORD}" \
    DATABASE_URL="${DB_DJANGO}" \
    DJANGO_SECRET_KEY="${DJANGO_SECRET_KEY}" \
    DJANGO_DEBUG=false \
    DJANGO_ALLOWED_HOSTS="${DJANGO_ALLOWED_HOSTS}" \
    JWT_SIGNING_KEY="${JWT_SIGNING_KEY}" \
    REDIS_URL="${REDIS_URL}"

az containerapp update \
  --name "${FASTAPI_APP_NAME}" \
  --resource-group "${AZURE_RESOURCE_GROUP}" \
  --image "${ACR_LOGIN_SERVER}/fastapi-api:${TAG}" \
  --set-env-vars \
    POSTGRES_HOST="${PG_HOST}" \
    POSTGRES_DB="${POSTGRES_DB}" \
    POSTGRES_USER="${POSTGRES_ADMIN_USER}" \
    POSTGRES_PASSWORD="${POSTGRES_ADMIN_PASSWORD}" \
    DATABASE_URL="${DB_FASTAPI}" \
    JWT_SIGNING_KEY="${JWT_SIGNING_KEY}" \
    REDIS_URL="${REDIS_URL}"

echo "Deployment update complete for tag ${TAG}."
