# create_zip.ps1
# Simple PowerShell script to create a ZIP archive of the SIMORA folder.

$projectFolder = Get-Location
$parent = Split-Path $projectFolder -Parent
$zipName = "SIMORA_v1.0.zip"
$zipPath = Join-Path $parent $zipName

Write-Host "Creating ZIP: $zipPath"

# Remove existing zip if exists
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Compress-Archive -Path "$projectFolder\*" -DestinationPath $zipPath -Force

if (Test-Path $zipPath) {
    Write-Host "ZIP berhasil dibuat:" $zipPath -ForegroundColor Green
} else {
    Write-Host "Gagal membuat ZIP." -ForegroundColor Red
}
