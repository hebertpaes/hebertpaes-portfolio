#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
source "${SCRIPT_DIR}/env.sh"

az account set --subscription "${AZURE_SUBSCRIPTION_ID}"

TAG="${1:-$(date +%Y%m%d%H%M%S)}"

az acr build \
  --registry "${ACR_NAME}" \
  --image "django-cms:${TAG}" \
  --file "${ROOT_DIR}/django_cms/Dockerfile" \
  "${ROOT_DIR}"

az acr build \
  --registry "${ACR_NAME}" \
  --image "fastapi-api:${TAG}" \
  --file "${ROOT_DIR}/fastapi_api/Dockerfile" \
  "${ROOT_DIR}"

echo "Built and pushed tags: ${TAG}"
