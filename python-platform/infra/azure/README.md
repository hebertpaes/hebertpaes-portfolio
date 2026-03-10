# Azure Deployment Scripts

## Files
- `env.template`: copy to `env.sh` and update values.
- `01-provision.sh`: creates Resource Group, Log Analytics, ACR, PostgreSQL Flexible Server, ACA environment, and both apps.
- `02-build-push.sh`: builds and pushes both images to ACR with a tag.
- `03-deploy-update.sh`: updates both container apps with a specific image tag.

## Usage
```bash
cd python-platform/infra/azure
cp env.template env.sh
chmod +x 01-provision.sh 02-build-push.sh 03-deploy-update.sh

./01-provision.sh
./02-build-push.sh 20260310
./03-deploy-update.sh 20260310
```

## Notes
- `env.sh` is intentionally excluded from versioning and should store production secrets.
- For scheduled jobs/backups, use Azure-native services such as Logic Apps, Azure Backup, or Azure Scheduler alternatives (for example, Automation/Functions timer triggers).
