$ErrorActionPreference = 'Stop'
param([int]$Port = 8000)

Write-Host "Iniciando servidor Rossy Resina Online en puerto $Port" -ForegroundColor Cyan

if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
  Write-Error "dotnet no está instalado o no está en PATH"
}

$sdks = & dotnet --list-sdks
if (-not $sdks) { Write-Error "No se encontraron SDKs de .NET" }
Write-Host "SDKs detectados:`n$sdks"

$env:PORT = $Port
Push-Location "$PSScriptRoot\backend"
try {
  & dotnet build --nologo | Write-Host
  Write-Host "Ejecutando servidor..." -ForegroundColor Green
  & dotnet run --project Backend.csproj --no-build --urls "http://127.0.0.1:$Port"
}
finally { Pop-Location }
