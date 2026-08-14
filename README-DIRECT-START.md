# ePay CRM - Direct Start (Without Docker)

This guide is for running your ePay CRM application **without Docker**.

## Prerequisites

You need to have **Node.js** installed on your system.

### Check if Node.js is installed

```powershell
node --version
npm --version
```

If these commands show version numbers, you're ready to go.

### Install Node.js (if not installed)

Download and install from: https://nodejs.org/

Choose the **LTS (Long Term Support)** version.

## Quick Start (Without Docker)

### Step 1: Install Dependencies

```powershell
npm install
```

### Step 2: Start the Application

```powershell
npm start
```

This will start a local web server on port 8080 and open your browser.

### Step 3: Access the Application

Open your browser and go to: **http://localhost:8080**

## Running Specific Environments

### Development Mode

```powershell
npm run start:dev
```

### Staging Mode

```powershell
npm run start:staging
```

### Production Mode

```powershell
npm run start:prod
```

## Build for Production

```powershell
npm run build:prod
```

This creates a production-ready build in the `dist/` directory.

## Running Tests

```powershell
npm test
```

## Direct File Access (No Server)

You can also run your CRM by directly opening the HTML files:

1. Navigate to your project folder
2. Double-click `index.html` or `login.html`
3. Your default browser will open the application

**Note:** Some features (like Firebase Realtime Database) may require a web server instead of direct file access.

## Troubleshooting

### "npm is not recognized"

**Solution:** Node.js is not installed or not in PATH.

1. Download Node.js from https://nodejs.org/
2. Install and restart your computer
3. Open a new PowerShell window

### "Cannot find module..."

**Solution:** Dependencies are not installed.

```powershell
npm install
```

### Port 8080 already in use

**Solution:** Change the port in `package.json`:

```json
"scripts": {
  "start": "http-server -p 3000 -o"
}
```

Then run:

```powershell
npm start
```

## Comparison: Docker vs Direct Start

| Feature | Docker | Direct Start |
|---------|--------|--------------|
| Isolation | Full (containers) | None |
| Dependencies | Bundled | System-wide |
| Firebase Emulator | Built-in | Requires separate setup |
| Cross-platform | Yes | Yes |
| Resource usage | Higher | Lower |
| Setup complexity | Medium | Easy |
| Best for | Team development | Quick testing |

## Next Steps

1. **Install Docker** (recommended for production):
   - See [DOCKER_INSTALLATION.md](DOCKER_INSTALLATION.md)

2. **Deploy to Firebase**:
   - See [DEPLOYMENT.md](DEPLOYMENT.md)

3. **Set up CI/CD**:
   - See [GETTING_STARTED.md](GETTING_STARTED.md)

## Support

For issues:
1. Check Node.js version: `node --version`
2. Check npm version: `npm --version`
3. Reinstall dependencies: `npm install`
4. Review error messages carefully