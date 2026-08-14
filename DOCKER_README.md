# ePay CRM - Docker Setup Guide

This guide explains how to run your ePay CRM application using Docker.

## What's Included

- **Dockerfile**: Container definition for Node.js + http-server
- **docker-compose.yml**: Complete environment with Firebase emulator
- **CI/CD Pipeline**: GitHub Actions with vulnerability scanning
- **Trivy Config**: Security scanning configuration

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed (for Windows)
- [GitHub Account](https://github.com) (for CI/CD)

**Note for Windows Users:**
- Docker Desktop on Windows uses `docker compose` (with space) instead of `docker-compose` (with hyphen)
- The examples in this guide use the correct `docker compose` syntax
- You can also use the PowerShell script `scripts\deploy-docker.ps1` for Windows

## Quick Start

### Option 1: Using Docker Compose (Recommended for Development)

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your Firebase credentials
# (see Firebase Configuration section below)

# Start the application
docker compose up -d

# View logs
docker compose logs -f

# Stop the application
docker compose down
```

### Option 2: Using Docker Directly

```bash
# Build the image
docker build -t epay-crm:latest .

# Run the container
docker run -d -p 8080:8080 --name epay-crm epay-crm:latest

# View logs
docker logs -f epay-crm

# Stop the container
docker stop epay-crm
docker rm epay-crm
```

## Firebase Configuration

Your `.env` file should contain:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
FIREBASE_DATABASE_URL=your_database_url

# Optional: Email & SMS Services
VITE_SENDGRID_API_KEY=your_sendgrid_key
VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_token
```

## Firebase Emulator Setup

The docker-compose.yml includes a Firebase emulator for local development:

```bash
# Start with emulator
docker-compose up -d firebase-emulator

# Access the emulator UI
# Firestore: http://localhost:8080
# Realtime Database: http://localhost:9000
# Auth: http://localhost:9099
# UI: http://localhost:4000
```

## Production Deployment

### Method 1: Direct to Firebase Hosting

```bash
# Build the production version
npm run build:prod

# Deploy to Firebase
firebase deploy --only hosting
```

### Method 2: Docker with Firebase Tools

```bash
# Create a deployment image
docker build -t epay-crm:prod .

# Run with production credentials
docker run -d \
  -p 8080:8080 \
  --name epay-crm-prod \
  -e NODE_ENV=production \
  -e FIREBASE_API_KEY=$FIREBASE_API_KEY \
  -e FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN \
  epay-crm:prod
```

## CI/CD Pipeline

### GitHub Actions Workflows

1. **ci-cd.yml**: Main CI/CD pipeline
   - Runs on push to main/develop
   - Runs on pull requests
   - Includes security scanning

2. **security-scan.yml**: Daily vulnerability scan
   - Runs at 6 AM UTC daily
   - Reports to GitHub Security tab

### Setup GitHub Actions

1. Create `.env.example` with placeholder values:

```env
# Firebase Configuration
FIREBASE_API_KEY=placeholder_api_key
FIREBASE_AUTH_DOMAIN=placeholder_domain
FIREBASE_PROJECT_ID=placeholder_project
```

2. Add repository secrets in GitHub:
   - `FIREBASE_TOKEN`: `firebase login:ci`
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID

3. Push to main branch to trigger deployment

## Security Scanning

### Using Trivy

```bash
# Install Trivy (if not using Docker)
# Windows (with Homebrew):
brew install trivy

# Scan the filesystem
trivy fs . --severity CRITICAL,HIGH

# Scan a Docker image
docker build -t epay-crm:latest .
trivy image epay-crm:latest --severity CRITICAL,HIGH
```

### Trivy Configuration

The `.trivy.yaml` file configures:
- Only show CRITICAL and HIGH severity issues
- Ignore unfixed vulnerabilities
- Exclude node_modules and build directories
- Output results to `trivy-results.txt`

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change the port in docker-compose.yml
   ports:
     - "8081:8080"  # Use host port 8081
   ```

2. **Firebase connection errors**
   - Verify Firebase credentials in `.env`
   - Check Firebase project is active
   - Ensure network allows outbound connections

3. **Build fails**
   ```bash
   # Clean build cache
   docker system prune -a
   
   # Rebuild
   docker build --no-cache -t epay-crm:latest .
   ```

4. **Container won't start**
   ```bash
   # Check logs
   docker-compose logs crm
   
   # Check environment variables
   docker-compose exec crm env
   ```

## Performance Optimization

1. **Use multi-stage builds** (in Dockerfile):
   ```dockerfile
   # Stage 1: Build
   FROM node:20-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   # Stage 2: Runtime
   FROM node:20-alpine
   WORKDIR /app
   COPY --from=build /app/node_modules ./node_modules
   COPY . .
   ```

2. **Optimize .dockerignore**:
   - Exclude node_modules
   - Exclude .git
   - Exclude IDE files
   - Exclude logs and temp files

3. **Use layer caching**:
   - Package.json is copied first
   - Dependencies are installed before app code
   - Changes to app code don't invalidate dependency cache

## Cost Considerations

### Firebase Free Tier (Spark Plan)
- 1 GB storage
- 10 GB/month bandwidth
- 50,000 reads/day
- 20,000 writes/day
- 100 connections/day

### Paid Plans (Flame/Blaze)
- Upgrade when you exceed free tier limits
- Monitor usage in Firebase Console
- Set up billing alerts

## Support

For issues:
- Check Docker logs: `docker-compose logs -f`
- Check Firebase Console for backend issues
- Review GitHub Actions logs for CI/CD issues

## Next Steps

1. [Deploy to Firebase Hosting](https://firebase.google.com/docs/hosting)
2. [Set up custom domain](https://firebase.google.com/docs/hosting/custom-domain)
3. [Configure SSL/HTTPS](https://firebase.google.com/docs/hosting/ssl-certificates)
4. [Set up monitoring](https://firebase.google.com/docs/perf-mon)