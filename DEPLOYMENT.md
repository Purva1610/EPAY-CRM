# Firebase Deployment with Docker

This guide explains how to deploy your ePay CRM to Firebase using Docker.

## Prerequisites

1. **Firebase Project**: Create a project at [Firebase Console](https://console.firebase.google.com/)
2. **Firebase Service Account Key**: Download JSON from Firebase Console → Settings → Service Accounts → Generate New Private Key
3. **Docker**: Installed on your machine
4. **Firebase CLI** (optional, for local testing)

## Quick Deploy

### Method 1: Direct Docker Deploy (Recommended for Production)

```bash
# Build the Docker image
docker build -t epay-crm:latest .

# Run with Firebase config
docker run -d ^
  -p 8080:8080 ^
  --name epay-crm ^
  -e FIREBASE_API_KEY=your_api_key ^
  -e FIREBASE_AUTH_DOMAIN=your_auth_domain ^
  -e FIREBASE_PROJECT_ID=your_project_id ^
  -e FIREBASE_STORAGE_BUCKET=your_storage_bucket ^
  -e FIREBASE_MESSAGING_SENDER_ID=your_sender_id ^
  -e FIREBASE_APP_ID=your_app_id ^
  epay-crm:latest
```

For Windows PowerShell, use backticks instead of backslashes:

### Method 2: Using docker-compose

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your Firebase credentials

# Start with Firebase emulator (development)
docker compose up -d

# For production, comment out firebase-emulator service and adjust ports
```

## CI/CD Deployment

### GitHub Actions Deployment

1. **Add secrets to your GitHub repository**:
   - `FIREBASE_TOKEN`: Generate with `firebase login:ci`
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `DOCKER_REGISTRY_TOKEN`: GitHub PAT for package registry

2. **Push to main branch** or use workflow dispatch to trigger deployment

### Manual Firebase Deploy

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build the project
npm run build:prod

# Deploy
firebase deploy --only hosting
```

## Dockerfile Customization

The provided Dockerfile uses `node:20-alpine` for a lightweight image. To customize:

```dockerfile
# For production with environment-specific config
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy environment file
COPY .env.${NODE_ENV} .env

# Copy your build artifacts
COPY dist/ ./dist
```

## Security Best Practices

1. **Never commit .env files** to version control
2. **Use Docker secrets** for sensitive data in production
3. **Scan images** with Trivy before deployment
4. **Use multi-stage builds** to reduce attack surface
5. **Run containers as non-root** user

## Monitoring

```bash
# Check container status
docker ps

# View logs
docker logs -f epay-crm

# Health check
curl http://localhost:8080/
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs epay-crm

# Check environment variables
docker exec -it epay-crm env
```

### Firebase connection issues
- Verify Firebase credentials are correct
- Check firewall rules allow outbound connections
- Ensure Firebase project is active

### Port conflicts
```bash
# Change host port in docker-compose.yml
ports:
  - "8081:8080"  # Maps host 8081 to container 8080
```

## Cost Optimization

1. **Use Firebase Spark Plan** for development
2. **Set up billing alerts** in Firebase Console
3. **Use Cloud Firestore in Datastore mode** for better pricing
4. **Implement database rules** to limit unauthorized access

## Scaling

For production scaling:

1. **Firebase Hosting**: Auto-scales with Google's CDN
2. **Cloud Functions**: Use for server-side logic
3. **Cloud Run**: Deploy Docker containers as stateless services
4. **Database**: Consider Firestore for better scalability

## Support

For issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)