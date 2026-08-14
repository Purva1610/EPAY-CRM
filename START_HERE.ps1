#!/usr/bin/env pwsh

# ePay CRM Quick Start Script for Windows
# Run this script to get started quickly

Write-Host "============================================" -ForegroundColor Green
Write-Host "ePay CRM Quick Start" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Check if Docker is installed
Write-Host "[1/4] Checking Docker installation..." -ForegroundColor Cyan
$dockerExists = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerExists) {
    Write-Host "[ERROR] Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Docker is installed" -ForegroundColor Green

# Check if Docker is running
Write-Host "[2/4] Checking Docker status..." -ForegroundColor Cyan
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker daemon is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Docker is running" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
Write-Host "[3/4] Checking configuration..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Write-Host "[WARN] .env file not found!" -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        $createEnv = Read-Host "Would you like to create a .env file from template? (y/n)"
        if ($createEnv -eq "y" -or $createEnv -eq "Y") {
            Copy-Item ".env.example" ".env"
            Write-Host "[OK] Created .env file. Please edit it with your Firebase credentials." -ForegroundColor Green
            Write-Host ""
            Write-Host "Open .env in your editor and fill in your Firebase configuration:" -ForegroundColor Cyan
            Write-Host "  - FIREBASE_API_KEY" -ForegroundColor White
            Write-Host "  - FIREBASE_AUTH_DOMAIN" -ForegroundColor White
            Write-Host "  - FIREBASE_PROJECT_ID" -ForegroundColor White
            Write-Host "  - etc." -ForegroundColor White
            Write-Host ""
            Write-Host "Then run this script again or use: docker compose up -d" -ForegroundColor Cyan
            exit 0
        }
    } else {
        Write-Host "[ERROR] No .env file or template found!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[OK] .env file found" -ForegroundColor Green
}

Write-Host ""
Write-Host "[4/4] Starting application..." -ForegroundColor Cyan

# Check if docker-compose.yml exists
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "[ERROR] docker-compose.yml not found!" -ForegroundColor Red
    exit 1
}

# Build and start the application
Write-Host "Building and starting application with Docker Compose..." -ForegroundColor Cyan
docker compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to start application!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Application started successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Application is running at: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs:   docker compose logs -f" -ForegroundColor White
Write-Host "  Stop:        docker compose down" -ForegroundColor White
Write-Host "  Restart:     docker compose restart" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to view logs..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
docker compose logs -f