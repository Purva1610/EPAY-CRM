# Firebase Configuration and Initialization Guide

## Overview

This guide covers the production-ready Firebase SDK initialization for ePay CRM with support for environment-based configuration (development, staging, production).

**Task Reference:** 1.1 Initialize Firebase SDK and configure environment loading

## Architecture

The Firebase initialization system has three main components:

### 1. **firebase-config.js** - Main Initialization
Primary entry point that:
- Loads Firebase configuration from multiple sources
- Validates configuration completeness
- Initializes Firebase App, Auth, Firestore, and Realtime Database
- Enables offline persistence
- Sets up connectivity monitoring
- Exposes services globally for backward compatibility

### 2. **firebase-config-loader.js** - Configuration Loader
Utility module that:
- Manages configuration loading from various sources
- Validates Firebase configuration
- Provides caching for repeated access
- Supports environment-aware defaults

### 3. **firebase-config-webpack.js** - Build-Time Injection
Webpack helper for:
- Build-time configuration injection
- Environment variable validation
- DefinePlugin configuration

## Getting Started

### Step 1: Set Up Environment Variables

```bash
# Copy the example environment file
npm run env:setup
```

This creates a `.env` file in the project root. Edit it with your Firebase project credentials:

```env
NODE_ENV=development

FIREBASE_API_KEY=AIzaSyD...
FIREBASE_AUTH_DOMAIN=epay-crm-dev.firebaseapp.com
FIREBASE_PROJECT_ID=epay-crm-dev
FIREBASE_STORAGE_BUCKET=epay-crm-dev.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
FIREBASE_MEASUREMENT_ID=G-XXXXXXXX
```

### Step 2: Get Firebase Credentials

Get your Firebase configuration from Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click Settings icon → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key" to download credentials
6. Copy the Web API configuration to your `.env` file

Or use the Web SDK snippet from Firebase Console:

1. Create a web app in Firebase project settings
2. Copy the configuration object
3. Extract and map values to environment variables

### Step 3: Include Firebase SDK

Add the Firebase SDK to your HTML before the configuration script:

```html
<!-- In login.html or any portal HTML file -->
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js"></script>

<!-- Initialize Firebase configuration -->
<script src="firebase-config.js"></script>

<!-- Other application scripts -->
<script src="auth-service.js"></script>
<script src="crm-engine.js"></script>
```

### Step 4: Verify Initialization

Firebase initialization provides lifecycle events you can listen to:

```javascript
// Listen for successful initialization
window.addEventListener('firebaseInitialized', (event) => {
    console.log('Firebase ready:', event.detail.projectId);
    // Start your application
});

// Listen for initialization errors
window.addEventListener('firebaseInitializationError', (event) => {
    console.error('Firebase init failed:', event.detail.error);
    // Handle initialization failure
});

// Listen for connectivity changes
window.addEventListener('firebaseConnected', () => {
    console.log('Connected to Firebase');
});

window.addEventListener('firebaseDisconnected', () => {
    console.log('Disconnected from Firebase');
});
```

## Configuration Sources (Priority Order)

Firebase configuration is loaded from the following sources in order:

1. **window.__FIREBASE_CONFIG__** - Injected during deployment (highest priority)
2. **process.env.FIREBASE_CONFIG** - JSON-stringified config from build system
3. **Individual environment variables** - FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, etc.
4. **Environment-specific defaults** - Placeholder values from config files

Each source is checked in order, and the first available source is used.

## Environment-Specific Configuration

### Development

```env
NODE_ENV=development
FIREBASE_AUTH_DOMAIN=epay-crm-dev.firebaseapp.com
FIREBASE_PROJECT_ID=epay-crm-dev
```

**Features:**
- Local development with real Firebase project
- Full logging and debug output
- Firestore offline persistence enabled
- Relaxed security rules for testing

### Staging

```env
NODE_ENV=staging
FIREBASE_AUTH_DOMAIN=epay-crm-staging.firebaseapp.com
FIREBASE_PROJECT_ID=epay-crm-staging
```

**Features:**
- Staging Firebase project
- Production-like configuration
- Security rules enforced
- Used for QA and pre-deployment testing

### Production

```env
NODE_ENV=production
FIREBASE_AUTH_DOMAIN=epay-crm-prod.firebaseapp.com
FIREBASE_PROJECT_ID=epay-crm-prod
```

**Features:**
- Production Firebase project
- Strict security rules
- Optimized performance settings
- Monitoring and error tracking enabled

## Using Webpack for Build-Time Injection

If using webpack or a build tool that supports DefinePlugin:

### webpack.config.js

```javascript
const { getFirebaseConfigPlugin } = require('./firebase-config-webpack');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: './src/index.js',
    output: {
        path: require('path').resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        getFirebaseConfigPlugin(process.env.NODE_ENV || 'development')
    ]
};
```

### Build Commands

```bash
# Development build
npm run build:dev

# Staging build
npm run build:staging

# Production build
npm run build:prod
```

## Configuration Validation

The initialization process validates configuration and reports issues:

```javascript
// Valid configuration
✓ projectId: epay-crm-dev
✓ authDomain: epay-crm-dev.firebaseapp.com
✓ All required fields present

// Missing configuration (warning)
⚠ Missing essential Firebase configuration: FIREBASE_API_KEY, FIREBASE_APP_ID
  Please set these environment variables.

// Placeholder configuration (warning)
⚠ Configuration incomplete: missing or placeholder values for apiKey, messagingSenderId
  Please ensure environment variables are properly set.
```

## Accessing Firebase Services

After initialization, Firebase services are available globally:

```javascript
// These are automatically set by firebase-config.js

// Authentication
firebase.auth()  // or window.auth
window.auth.currentUser
window.auth.signInWithEmailAndPassword(email, password)

// Firestore
firebase.firestore()  // or window.db
window.db.collection('users').get()

// Realtime Database
firebase.database()  // or window.realtimeDB
window.realtimeDB.ref('users').on('value', snapshot => {})

// Get all services
window.FirebaseServices
// {
//   auth,
//   db,
//   realtimeDB,
//   firebaseConfig
// }
```

## Offline Persistence

Firestore offline persistence is automatically enabled during initialization:

```javascript
// Firestore automatically caches data locally
// Queries and reads work offline with cached data
// Writes are queued and synced when connectivity is restored

// 50MB local cache is configured
// Cache behavior is optimized for web applications
```

### Handling Persistence Errors

The initialization handles common persistence errors:

```javascript
// Multiple tabs error (only one tab can enable persistence)
// → Persistence disabled for this tab
// → Other tabs can still use cached data

// Unsupported browser error
// → Persistence disabled
// → App continues with limited offline support

// Other errors
// → Logged to console
// → App continues normal operation
```

## Runtime Configuration

For runtime configuration changes (e.g., switching environments):

```javascript
// Get current Firebase configuration
const { config, source } = FirebaseConfigLoader.getEnvironmentConfig();
console.log('Using config from:', source);

// For testing: set custom configuration
FirebaseConfigLoader.setTestConfig({
    apiKey: 'test_key',
    authDomain: 'test.firebaseapp.com',
    projectId: 'test-project',
    // ... other fields
});

// Check validation status
const validation = FirebaseConfigLoader.getEnvironmentConfig();
console.log('Validation:', validation.validation);
```

## Troubleshooting

### Firebase SDK Not Loading

**Problem:** "Firebase SDK not loaded"

**Solution:**
- Ensure Firebase SDK scripts are loaded before firebase-config.js
- Check script order in HTML
- Verify Firebase CDN is accessible

```html
<!-- Correct order -->
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>
<script src="firebase-config.js"></script>
```

### Configuration Not Loading

**Problem:** Using placeholder values or "YOUR_*" values

**Solution:**
- Set environment variables in .env file
- Verify .env file is loaded (if using dotenv)
- Check environment variable names match exactly
- Verify values are not wrapped in quotes in .env

### Multiple Tabs Persistence Warning

**Problem:** "Multiple tabs open - persistence disabled for this tab"

**Solution:**
- This is expected behavior
- Persistence is enabled in one tab automatically
- Other tabs can still access cached data
- Not an error, just a limitation

### Connectivity Events Not Firing

**Problem:** firebaseConnected/firebaseDisconnected events not firing

**Solution:**
- Ensure Realtime Database is properly initialized
- Check that event listeners are registered before initialization
- Verify browser supports EventTarget interface
- Check Firebase Realtime Database rules allow read access to .info/connected

## Security Considerations

### Credentials Management

- **Never** commit .env file to version control
- Use .gitignore to exclude .env files:
  ```
  .env
  .env.local
  .env.*.local
  ```
- Rotate API keys regularly in Firebase Console
- Use Web API restrictions in Firebase Console for public API keys

### Build-Time Configuration

- Build outputs should not expose sensitive credentials
- Use separate configurations for different environments
- Validate credentials during build process
- Consider using secrets management services in production

### Client-Side Security

- Firebase Security Rules enforce authentication and authorization
- Client-side SDK handles credential security
- Encrypted local storage prevents token exposure
- Never log sensitive credentials

## Testing

### Test Firebase Configuration

```bash
npm run test:firebase-config
```

This runs validation checks on your configuration:
- Verifies all required fields are present
- Checks for placeholder values
- Validates environment variable setup
- Tests configuration loading from different sources

### Verify Initialization in Console

```javascript
// In browser console after page load
window.FirebaseServices
// Should show: { auth, db, realtimeDB, firebaseConfig }

// Check initialization status
window.FirebaseServices.auth.currentUser
// Should show current user or null

// Test Firestore connection
window.db.collection('test').get().then(snap => console.log('Firestore works'))
```

## Next Steps

After completing Firebase initialization (Task 1.1), proceed with:

1. **1.2** - Define and deploy Firestore Security Rules
2. **1.3** - Define and deploy Realtime Database Security Rules
3. **2.1** - Implement AuthService with Firebase Authentication integration
4. **3.1** - Implement UserProfileService with Firestore CRUD operations

## References

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Web SDK Guide](https://firebase.google.com/docs/web/setup)
- [Firestore Offline Persistence](https://firebase.google.com/docs/firestore/enable-offline)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)
- [Environment Variables with dotenv](https://github.com/motdotla/dotenv)
