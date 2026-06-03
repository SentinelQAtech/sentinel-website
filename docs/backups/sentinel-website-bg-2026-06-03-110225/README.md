# Sentinel Website BG Backup

Backup created before changing the Sentinel website background.

## Files backed up

- `apps/website/assets/css/style.css`
- `apps/website/index.html`
- `apps/website/assets/brand/background_full.png`

## Restore

From the repository root, run:

```powershell
Copy-Item -LiteralPath "docs\backups\sentinel-website-bg-2026-06-03-110225\style.css" -Destination "apps\website\assets\css\style.css" -Force
Copy-Item -LiteralPath "docs\backups\sentinel-website-bg-2026-06-03-110225\index.html" -Destination "apps\website\index.html" -Force
Copy-Item -LiteralPath "docs\backups\sentinel-website-bg-2026-06-03-110225\background_full.png" -Destination "apps\website\assets\brand\background_full.png" -Force
```
