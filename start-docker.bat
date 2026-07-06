@echo off
REM Aatmanirbhar Nari - Quick Docker Setup Script
REM This script helps you start Docker services easily

echo.
echo ╔════════════════════════════════════════════════╗
echo ║  Aatmanirbhar Nari - Docker Setup              ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo ✅ Docker found
docker --version
echo.

REM Check if Docker daemon is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Desktop is not running!
    echo.
    echo 📌 Please start Docker Desktop:
    echo    1. Press Windows key + type "Docker Desktop"
    echo    2. Click to launch Docker Desktop
    echo    3. Wait for it to fully start (check system tray)
    echo    4. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Docker daemon is running
echo.

REM Navigate to project root
cd /d "%~dp0"
if errorlevel 1 (
    echo ❌ Failed to change directory
    pause
    exit /b 1
)

echo 🚀 Starting Docker services...
echo.
docker-compose up -d

if errorlevel 1 (
    echo ❌ Failed to start Docker services
    echo Please check docker-compose.yml and try again
    pause
    exit /b 1
)

echo.
echo ✅ Docker services started!
echo.
echo 📊 Services Status:
docker-compose ps
echo.

echo 🌐 Access your services:
echo.
echo   Frontend:        http://localhost:3000
echo   Backend API:     http://localhost:5000
echo   MongoDB Admin:   http://localhost:8081
echo   Login: admin / admin123
echo.

echo 📝 Useful Commands:
echo.
echo   View logs:       docker-compose logs -f
echo   Stop services:   docker-compose down
echo   Restart services: docker-compose restart
echo.

pause
