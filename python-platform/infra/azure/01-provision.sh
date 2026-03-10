#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/env.sh"

az account set --subscription "${AZURE_SUBSCRIPTION_ID}"

az group create \
  --name "${AZURE_RESOURCE_GROUP}" \
  --location "${AZURE_LOCATION}"

az monitor log-analytics workspace create \
  --resource-group "${AZURE_RESOURCE_GROUP}" \
  --workspace-name "${LOG_ANALYTICS_NAME}" \
  --location "${AZURE_LOCATION}"

LOG_WORKSPACE_ID=$(az monitor log-analytics workspace show \
  --resource-group "${AZURE_RESOURCE_GROUP}" \
  --workspace-name "${LOG_ANALYTICS_NAME}" \
  --query customerId -o tsv)

LOG_WORKSPACE_KEY=$(az monitor log-analytics workspace get-shared-keys \
  --resource-group "${AZURE_RESOURCE_GROUP}" \
  --workspace-name "${LOG_ANALYTICS_NAME}" \
  --query primarySharedKey -o tsv)

az acr create \
  --resource-group "${AZURE_RESOURCE_GROUP}" \
  --name "${ACR_NAME}" \
  --sku Standard \
  --admin-enabled true

az postgres flexible-server create \
  --resource-group "${AZURE_RESOURCE_GROUP}" \
  --name "${POSTGRES_SERVER_NAME}" \
  --location "${AZURE_LOCATION}" \
  --admin-user "${POSTGRES_ADMIN_USER}" \
  --admin-password "${POSTGRES_ADMIN_PASSWORD}" \
  --sku-name "${POSTGRES_SKU}" \
  --storage-size "${POSTGRES_STORAGE_GB}" \
  --version 16 \
  --public-access all

az postgres flexible-server db create \
  --resource-group "${AZURE_RESOURCE_GROUP}" \
  --server-name "${POSTGRES_SERVER_NAME}" \
  --database-name "${POSTGRES_DB}"

az containerapp env create \
  --resource-group "${AZURE_RESOURCE_GROUP}" \
  --name "${ACA_ENV_NAME}" \
  --location "${AZURE_LOCATION}" \
  --logs-workspace-id "${LOG_WORKSPACE_ID}" \
  --logs-workspace-key "${LOG_WORKSPACE_KEY}"

ACR_LOGIN_SERVER=$(az acr show --name "${ACR_NAME}" --query loginServer -o tsv)
PG_HOST="${POSTGRES_SERVER_NAME}.postgres.database.azure.com"
DB_DJANGO="postgresql://${POSTGRES_ADMIN_USER}:${POSTGRES_ADMIN_PASSWORD}@${PG_HOST}:5432/${POSTGRES_DB}?sslmode=require"
DB_FASTAPI="postgresql+psycopg://${POSTGRES_ADMIN_USER}:${POSTGRES_ADMIN_PASSWORD}@${PG_HOST}:5432/${POSTGRES_DB}?sslmode=require"

az containerapp create \
  --name "${DJANGO_APP_NAME}" \
  --resource-group "${AZURE_RESOURCE_GROUP}" \
  --environment "${ACA_ENV_NAME}" \
  --ingress external \
  --target-port 8000 \
  --registry-server "${ACR_LOGIN_SERVER}" \
  --image "${ACR_LOGIN_SERVER}/django-cms:latest" \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars \
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

az containerapp create \
  --name "${FASTAPI_APP_NAME}" \
  --resource-group "${AZURE_RESOURCE_GROUP}" \
  --environment "${ACA_ENV_NAME}" \
  --ingress external \
  --target-port 8001 \
  --registry-server "${ACR_LOGIN_SERVER}" \
  --image "${ACR_LOGIN_SERVER}/fastapi-api:latest" \
  --min-replicas 1 \
  --max-replicas 5 \
  --env-vars \
    POSTGRES_HOST="${PG_HOST}" \
    POSTGRES_DB="${POSTGRES_DB}" \
    POSTGRES_USER="${POSTGRES_ADMIN_USER}" \
    POSTGRES_PASSWORD="${POSTGRES_ADMIN_PASSWORD}" \
    DATABASE_URL="${DB_FASTAPI}" \
    JWT_SIGNING_KEY="${JWT_SIGNING_KEY}" \
    REDIS_URL="${REDIS_URL}"

echo "Provisioning complete."
echo "Django app: ${DJANGO_APP_NAME}"
echo "FastAPI app: ${FASTAPI_APP_NAME}"
