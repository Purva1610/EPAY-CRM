# ePay CRM - Docker Setup for Windows

This guide is specifically for Windows users setting up Docker for the ePay CRM project.

## Quick Start (Windows)

### Option 1: Run the Quick Start Script (Easiest)

Double-click or run in PowerShell:

```powershell
.\START_HERE.ps1
```

This script will:
1. Check if Docker is installed
2. Check if Docker is running
3. Create a `.env` file from template if needed
4. Build and start the application

### Option 2: Manual Setup

#### 1. Open PowerShell (as Administrator - optional)

#### 2. Navigate to your project directory

```powershell
cd "C:\Users\Yashraj Sathe\OneDrive\Desktop\epay crm v1"
```

#### 3. Create .env file (if it doesn't exist)

```powershell
cp .env.example .env
# Then edit .env with your Firebase credentials
```

#### 4. Build and run with Docker Compose

```powershell
docker compose up -d --build
```

#### 5. View logs

```powershell
docker compose logs -f
```

#### 6. Stop the application

```powershell
docker compose down
```

## Important: Docker Command Syntax on Windows

Docker Desktop on Windows uses `docker compose` (with space), NOT `docker-compose` (with hyphen).

**Correct (Windows):**
```powershell
docker compose up -d
docker compose logs -f
docker compose down
```

**Incorrect (Windows):**
```powershell
docker-compose up -d    # This will NOT work!
```

## Environment Configuration

### Required .env Variables

Your `.env` file must contain:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_actual_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.asia-southeast1.firebasedatabase.app

# Email (SendGrid)
VITE_SENDGRID_API_KEY=your_sendgrid_key

# SMS (Twilio)
VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_token
VITE_TWILIO_FROM_NUMBER=+1234567890
```

## Common PowerShell Commands

```powershell
# Build the image
docker compose build

# Start in detached mode (background)
docker compose up -d

# View logs in real-time
docker compose logs -f

# Stop containers
docker compose down

# Restart containers
docker compose restart

# Stop and remove everything
docker compose down

# Build and start
docker compose up -d --build

# Check container status
docker compose ps

# Run a one-off command
docker compose run crm npm run build
```

## Troubleshooting

### Error: "docker compose is not recognized"

**Solution:** Docker Desktop is not installed or not in PATH.

1. Download Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Install and restart your computer
3. Open a new PowerShell window

### Error: "Docker daemon is not running"

**Solution:** Docker Desktop is not running.

1. Open Docker Desktop from the Start menu
2. Wait for the Docker icon to turn green
3. Try the command again

### Error: "Cannot connect to the Docker daemon"

**Solution:** Docker Desktop service is not responding.

1. Right-click Docker Desktop icon in system tray
2. Select "Restart"
3. Wait for Docker to restart
4. Try the command again

### Port 8080 is already in use

**Solution:** Change the port in `docker-compose.yml`:

```yaml
ports:
  - "8081:8080"  # Use host port 8081 instead of 8080
```

### Build fails with "node: not found"

**Solution:** The Docker image cannot find Node.js.

1. Clean the build cache:
   ```powershell
   docker system prune -a
   ```
2. Rebuild:
   ```powershell
   docker compose build --no-cache
   ```

## Useful Docker Commands

```powershell
# List all containers
docker ps -a

# List all images
docker images

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# View Docker system info
docker info
```

## Windows-Specific Tips

1. **Use PowerShell**: The examples in this guide use PowerShell commands
2. **Run as Administrator**: Some Docker operations may require admin privileges
3. **WSL 2**: Ensure WSL 2 is enabled for better performance
4. **File Paths**: Use forward slashes in Docker commands, even on Windows

## Next Steps

1. Configure your `.env` file with Firebase credentials
2. Run `.\START_HERE.ps1` or `docker compose up -d`
3. Visit http://localhost:8080
4. Review `DOCKER_README.md` for more detailed information