# ePay CRM - Getting Started Guide

Welcome to the ePay CRM project! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **[Node.js](https://nodejs.org/)** (v18 or higher)
2. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (for containerization)
3. **[Firebase CLI](https://firebase.google.com/docs/cli/)** (optional, for direct Firebase deployment)

## Quick Start (Windows)

### Method 1: Automated Setup (Recommended)

1. **Double-click** `START_HERE.bat` or run in PowerShell:
   ```powershell
   .\START_HERE.ps1
   ```

2. Follow the prompts to configure your Firebase credentials

3. Wait for the application to start

4. Visit **http://localhost:8080**

### Method 2: Manual Setup

```powershell
# 1. Navigate to the project directory
cd "C:\Users\Yashraj Sathe\OneDrive\Desktop\epay crm v1"

# 2. Create .env file from template
cp .env.example .env

# 3. Edit .env with your Firebase credentials
notepad .env

# 4. Build and start with Docker
docker compose up -d

# 5. View logs
docker compose logs -f
```

## Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Add a Web App to your project
4. Copy the configuration values to your `.env` file

### Required .env Variables

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.asia-southeast1.firebasedatabase.app
```

## Development Commands

### Using Docker (Recommended)

```bash
# Start the application
docker compose up -d

# View logs
docker compose logs -f

# Stop the application
docker compose down

# Restart the application
docker compose restart

# Rebuild and start
docker compose up -d --build
```

### Using npm (Alternative)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build:prod

# Run tests
npm test
```

## Project Structure

```
epay crm v1/
├── Dockerfile                    # Docker container definition
├── docker-compose.yml           # Docker Compose configuration
├── .dockerignore                # Files excluded from Docker build
├── .env                         # Environment variables (create from .env.example)
├── .env.example                 # Environment variable template
├── package.json                 # Node.js dependencies
├── index.html                   # Main application entry point
├── login.html                   # Login page
├── firebase-config.js           # Firebase configuration
├── auth-service.js              # Authentication service
├── scripts/
│   ├── build.js                 # Build script
│   ├── docker-build.sh          # Docker build helper
│   └── verify-build.ps1         # Windows build verification
├── .github/
│   └── workflows/
│       ├── ci-cd.yml            # CI/CD pipeline
│       └── security-scan.yml    # Daily security scan
└── DOCKER_README.md             # Detailed Docker documentation
```

## Testing

### Run Unit Tests

```bash
npm test
```

### Run Security Scan

```bash
npx trivy fs . --severity CRITICAL,HIGH
```

## Deployment

### To Firebase Hosting

```bash
# Build for production
npm run build:prod

# Deploy to Firebase
firebase deploy --only hosting
```

### To Docker Registry

```bash
# Build the image
docker build -t epay-crm:latest .

# Tag for registry
docker tag epay-crm:latest your-registry/epay-crm:latest

# Push to registry
docker push your-registry/epay-crm:latest
```

### CI/CD Pipeline

The project includes GitHub Actions CI/CD pipeline:
- Runs on push to main/develop branches
- Includes security scanning
- Automated dependency updates

## Troubleshooting

### Docker Not Running

```bash
# Check Docker status
docker info

# Restart Docker
docker run hello-world
```

### Port Already in Use

Edit `docker-compose.yml` and change port 8080 to another port:
```yaml
ports:
  - "8081:8080"  # Use host port 8081
```

### Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild
docker compose build --no-cache
```

## Documentation

- **[DOCKER_README.md](DOCKER_README.md)** - Detailed Docker documentation
- **[README-DOCKER-WIN.md](README-DOCKER-WIN.md)** - Windows-specific Docker guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide
- **[SETUP_SUMMARY.md](SETUP_SUMMARY.md)** - Setup overview

## Support

For issues:
1. Check the troubleshooting section above
2. Review Docker logs: `docker compose logs -f`
3. Check GitHub Actions logs for CI/CD issues
4. Review Firebase Console for backend issues

## Next Steps

1. [Configure Firebase](https://firebase.google.com/docs)
2. [Set up CI/CD](https://docs.github.com/en/actions)
3. [Deploy to production](DEPLOYMENT.md)
4. [Set up monitoring](https://firebase.google.com/docs/perf-mon)

Happy coding! 🚀