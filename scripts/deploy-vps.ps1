param(
  [string]$VpsHost = "204.216.157.94",
  [string]$User = "ubuntu",
  [string]$KeyPath = ".ssh-test.key"
)

$ErrorActionPreference = "Stop"
$release = "release-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$archive = "$release.tar.gz"

Write-Host "Building project..."
npm run build | Out-Host

Write-Host "Packing release..."
tar --exclude=node_modules --exclude=.postgres-data --exclude=.postgres-data-5433 --exclude=.logs --exclude=oracle-wallet --exclude=*.key -czf $archive .

Write-Host "Uploading release..."
scp -o StrictHostKeyChecking=no -i $KeyPath $archive "${User}@${VpsHost}:/tmp/$archive"

Write-Host "Extracting release..."
ssh -o StrictHostKeyChecking=no -i $KeyPath "${User}@${VpsHost}" "mkdir -p /opt/odontosis/releases/$release && tar -xzf /tmp/$archive -C /opt/odontosis/releases/$release"

Write-Host "Installing runtime dependencies..."
ssh -o StrictHostKeyChecking=no -i $KeyPath "${User}@${VpsHost}" "cd /opt/odontosis/releases/$release && npm ci --omit=dev"

Write-Host "Switching current release..."
ssh -o StrictHostKeyChecking=no -i $KeyPath "${User}@${VpsHost}" "ln -sfn /opt/odontosis/releases/$release /opt/odontosis/current"

Write-Host "Done. Restart service manually if environment is already configured."
