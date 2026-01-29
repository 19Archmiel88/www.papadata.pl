# scripts/install-dev.ps1
corepack enable
corepack prepare pnpm@9.15.4 --activate

pnpm install

# Playwright browsers (opcjonalnie)
pnpm dlx playwright install --with-deps

# If 'code' exists, install VS Code extensions from .vscode/extensions.json
if (Get-Command code -ErrorAction SilentlyContinue) {
  try {
    $exts = (Get-Content .vscode\extensions.json -Raw | ConvertFrom-Json).recommendations
    foreach ($e in $exts) {
      code --install-extension $e
    }
    Write-Host "VS Code extensions installed (via 'code' CLI)."
  } catch {
    Write-Host "Could not install extensions automatically: $_"
  }
} else {
  Write-Host "'code' CLI not found; skip installing VS Code extensions."
}
