# Sentinel Website Dark Approved Backup

Backup created after approving the dark integrated PCB background and before adding the light-mode toggle.

## Restore

From the repository root, run:

``powershell
Copy-Item -LiteralPath "docs\backups\sentinel-website-dark-approved-2026-06-03-114047\style.css" -Destination "apps\website\assets\css\style.css" -Force
Copy-Item -LiteralPath "docs\backups\sentinel-website-dark-approved-2026-06-03-114047\main.js" -Destination "apps\website\assets\js\main.js" -Force
Copy-Item -LiteralPath "docs\backups\sentinel-website-dark-approved-2026-06-03-114047\index.html" -Destination "apps\website\index.html" -Force
Copy-Item -LiteralPath "docs\backups\sentinel-website-dark-approved-2026-06-03-114047\background_integrated_v2.png" -Destination "apps\website\assets\brand\background_integrated_v2.png" -Force
Copy-Item -LiteralPath "docs\backups\sentinel-website-dark-approved-2026-06-03-114047\background_integrated_light.png" -Destination "apps\website\assets\brand\background_integrated_light.png" -Force
``
