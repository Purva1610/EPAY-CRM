# Docker Desktop Installation Guide for Windows

This guide will help you install Docker Desktop on Windows.

## Prerequisites

Before installing Docker Desktop, ensure your system meets these requirements:

### System Requirements

- **Operating System:** Windows 10 64-bit: Pro, Enterprise, or Education (Build 15063 or later)
- **CPU:** Virtualization support (Intel VT-x / AMD-V)
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** 10GB free space
- **BIOS:** Virtualization must be enabled in BIOS

### Check Virtualization Support

Open PowerShell and run:

```powershell
Get-VMHost
```

If you see an error about Hyper-V, virtualization may not be enabled.

## Installation Steps

### Step 1: Download Docker Desktop

1. Go to: https://www.docker.com/products/docker-desktop/
2. Click **Download for Windows**
3. Save the installer (`Docker Desktop Installer.exe`)

### Step 2: Install Docker Desktop

1. Double-click `Docker Desktop Installer.exe`
2. Follow the installation wizard
3. Check "Add Docker to system PATH" (recommended)
4. Click **Install**

### Step 3: Enable Hyper-V and WSL 2 (if prompted)

Docker Desktop requires:
- **Hyper-V** (Windows virtualization)
- **WSL 2** (Windows Subsystem for Linux)

The installer will prompt you to enable these. Click **Yes** to restart your computer.

### Step 4: Start Docker Desktop

1. After restart, open Docker Desktop from Start menu
2. First-time setup will begin automatically
3. Login to Docker Hub (optional) or click **Close**
4. Wait for Docker to start (icon turns green)

### Step 5: Verify Installation

Open PowerShell and run:

```powershell
docker --version
docker compose version
```

You should see version numbers.

Run the test container:

```powershell
docker run hello-world
```

You should see a "Hello from Docker!" message.

## Post-Installation Configuration

### Configure Docker Desktop

1. Right-click Docker Desktop icon in system tray
2. Select **Settings**
3. Configure:
   - **Resources**: CPU cores, Memory (RAM), Swap
   - **Docker Engine**: Advanced configuration
   - **General**: Start Docker Desktop when you log in

### Recommended Settings

- **Memory**: 4GB (adjust based on your system)
- **CPU**: 2 cores (adjust based on your system)
- **Disk image size**: 60GB

## Troubleshooting

### Docker Desktop Won't Start

**Error:** "WSL 2 installation is incomplete"

**Solution:**
1. Open PowerShell as Administrator
2. Run:
   ```powershell
   wsl --install
   ```
3. Restart your computer

### Virtualization Not Enabled

**Error:** "This PC does not support virtualization"

**Solution:**
1. Restart your computer
2. Enter BIOS/UEFI (usually F2, F10, or Del during startup)
3. Find "Virtualization Technology" or "VT-x"
4. Enable it
5. Save and exit

### Port Conflicts

**Error:** "Port 8080 is already in use"

**Solution:**
1. Change Docker Desktop port in Settings
2. Or use a different port in your `docker-compose.yml`

### Slow Performance

**Solutions:**
1. Enable WSL 2 integration
2. Use `.dockerignore` to exclude unnecessary files
3. Reduce memory allocation if system is low on RAM
4. Use Alpine-based images (smaller, faster)

## Uninstall Docker Desktop

### Method 1: Using Settings

1. Open Windows Settings
2. Go to Apps > Apps & Features
3. Find Docker Desktop
4. Click Uninstall

### Method 2: Using PowerShell

```powershell
# Uninstall Docker Desktop
winget uninstall Docker.DockerDesktop
```

## Alternative: Docker Toolbox (Old Windows)

If you're on Windows 7 or 8, use Docker Toolbox:

1. Download from: https://github.com/docker/toolbox/releases
2. Install Docker Toolbox
3. Use Docker Quickstart Terminal

**Note:** Docker Toolbox uses VirtualBox instead of Hyper-V.

## Next Steps

After installing Docker Desktop:

1. **Verify installation:**
   ```powershell
   docker --version
   docker run hello-world
   ```

2. **Start your CRM:**
   ```powershell
   cd "C:\Users\Yashraj Sathe\OneDrive\Desktop\epay crm v1"
   docker compose up -d
   ```

3. **Visit:** http://localhost:8080

## Support

- Docker Documentation: https://docs.docker.com/
- Docker Community Forum: https://forums.docker.com/
- Windows Subsystem for Linux: https://learn.microsoft.com/en-us/windows/wsl/

## Quick Check List

- [ ] Docker Desktop installed
- [ ] Docker starts successfully (green icon)
- [ ] `docker --version` shows version
- [ ] `docker run hello-world` works
- [ ] WSL 2 is installed (if on Windows 10/11)
- [ ] Virtualization is enabled in BIOS