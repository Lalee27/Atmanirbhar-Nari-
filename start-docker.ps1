# Aatmanirbhar Nari - Docker Setup Script (PowerShell)
# This script helps you start Docker services easily

Write-Host "`n" -ForegroundColor Green
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Aatmanirbhar Nari - Docker Setup              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n"

# Check if Docker daemon is running
try {
    docker ps | Out-Null
    Write-Host "✅ Docker daemon is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "`n📌 Please start Docker Desktop:" -ForegroundColor Yellow
    Write-Host "   1. Press Windows key and type 'Docker Desktop'" -ForegroundColor Yellow
    Write-Host "   2. Click to launch Docker Desktop" -ForegroundColor Yellow
    Write-Host "   3. Wait for it to fully start (check system tray)" -ForegroundColor Yellow
    Write-Host "   4. Run this script again" -ForegroundColor Yellow
    Write-Host "`n"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n"

# Navigate to project root
Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "🚀 Starting Docker services..." -ForegroundColor Green
Write-Host "`n"

# Start Docker containers
try {
    docker-compose up -d
} catch {
    Write-Host "`n❌ Failed to start Docker services" -ForegroundColor Red
    Write-Host "Please check docker-compose.yml and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n"
Write-Host "✅ Docker services started!" -ForegroundColor Green
Write-Host "`n"

Write-Host "📊 Services Status:" -ForegroundColor Cyan
docker-compose ps
Write-Host "`n"

Write-Host "🌐 Access your services:" -ForegroundColor Cyan
Write-Host "   Frontend:        http://localhost:3000" -ForegroundColor Green
Write-Host "   Backend API:     http://localhost:5000" -ForegroundColor Green
Write-Host "   MongoDB Admin:   http://localhost:8081" -ForegroundColor Green
Write-Host "   Login: admin / admin123" -ForegroundColor Green
Write-Host "`n"

Write-Host "📝 Useful Commands:" -ForegroundColor Cyan
Write-Host "   View logs:       docker-compose logs -f" -ForegroundColor Yellow
Write-Host "   Stop services:   docker-compose down" -ForegroundColor Yellow
Write-Host "   Restart services: docker-compose restart" -ForegroundColor Yellow
Write-Host "`n"

Read-Host "Press Enter to exit"
