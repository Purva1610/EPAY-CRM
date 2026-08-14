#!/usr/bin/env node

/**
 * ePay CRM Build Script
 * Handles environment configuration and build validation
 * Usage: npm run build or NODE_ENV=production npm run build:prod
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';

console.log(`\n[Build] Starting build for ${environment} environment\n`);

// Required Firebase configuration variables
const requiredVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
];

// Validate Firebase configuration before build
const missing = requiredVars.filter(v => !process.env[v]);
const placeholders = requiredVars.filter(v => {
    const val = process.env[v];
    return val && (val.includes('_placeholder') || val.startsWith('YOUR_') || val.length < 10);
});

if (missing.length > 0) {
    console.error(`[Build] ✗ Error: Missing Firebase configuration: ${missing.join(', ')}`);
    console.error(`[Build] Set these environment variables before building.`);
    process.exit(1);
}

if (placeholders.length > 0 && environment === 'production') {
    console.error(`[Build] ✗ Error: Production build cannot use placeholder values: ${placeholders.join(', ')}`);
    process.exit(1);
}

if (placeholders.length > 0) {
    console.warn(`[Build] ⚠ Warning: Using placeholder values for: ${placeholders.join(', ')}`);
}

console.log(`[Build] ✓ Firebase configuration validated`);

// Create build output directory if it doesn't exist
const buildDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
    console.log(`[Build] ✓ Created build directory: ${buildDir}`);
}

// Generate Firebase config injection file
const configFile = path.join(buildDir, 'firebase-config-inject.js');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || '',
    databaseUrl: process.env.FIREBASE_DATABASE_URL || ''
};

const configInjectionCode = `// Auto-generated Firebase configuration injection
// Generated at: ${new Date().toISOString()}
// Environment: ${environment}

window.__ENV__ = '${environment}';
window.__FIREBASE_CONFIG__ = ${JSON.stringify(firebaseConfig)};

console.log('[Firebase Config Injection] Configuration injected for ${environment} environment');
console.log('[Firebase Config Injection] Project: ${firebaseConfig.projectId}');
`;

fs.writeFileSync(configFile, configInjectionCode);
console.log(`[Build] ✓ Generated configuration injection file: ${configFile}`);

// Generate build manifest
const manifestFile = path.join(buildDir, 'BUILD_MANIFEST.json');

const manifest = {
    buildTime: new Date().toISOString(),
    environment,
    firebaseProject: firebaseConfig.projectId,
    firebaseAuth: firebaseConfig.authDomain,
    version: require('../package.json').version,
    nodeVersion: process.version
};

fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
console.log(`[Build] ✓ Generated build manifest: ${manifestFile}`);

// Copy essential files to dist directory
const filesToCopy = [
    'firebase-config.js',
    'firebase-config-loader.js',
    'index.html',
    'login.html'
];

filesToCopy.forEach(file => {
    const src = path.join(__dirname, '..', file);
    const dest = path.join(buildDir, file);
    
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`[Build] ✓ Copied: ${file}`);
    }
});

// Create .env.production file with build configuration
const envProdFile = path.join(buildDir, '.env.production');

const envContent = `# Build-time Firebase configuration (${environment})
NODE_ENV=${environment}
FIREBASE_API_KEY=${process.env.FIREBASE_API_KEY}
FIREBASE_AUTH_DOMAIN=${process.env.FIREBASE_AUTH_DOMAIN}
FIREBASE_PROJECT_ID=${process.env.FIREBASE_PROJECT_ID}
FIREBASE_STORAGE_BUCKET=${process.env.FIREBASE_STORAGE_BUCKET}
FIREBASE_MESSAGING_SENDER_ID=${process.env.FIREBASE_MESSAGING_SENDER_ID}
FIREBASE_APP_ID=${process.env.FIREBASE_APP_ID}
FIREBASE_MEASUREMENT_ID=${process.env.FIREBASE_MEASUREMENT_ID || ''}
FIREBASE_DATABASE_URL=${process.env.FIREBASE_DATABASE_URL || ''}
`;

fs.writeFileSync(envProdFile, envContent);
console.log(`[Build] ✓ Generated build environment file: .env.production`);

// Build summary
console.log(`\n[Build] ✓ Build completed successfully`);
console.log(`[Build] Environment: ${environment}`);
console.log(`[Build] Output directory: ${buildDir}`);
console.log(`[Build] Firebase Project: ${firebaseConfig.projectId}`);
console.log(`\n[Build] Next steps:`);
console.log(`[Build]   1. Verify dist/ directory contains all necessary files`);
console.log(`[Build]   2. Deploy with: firebase deploy`);
console.log(`[Build]   3. Or serve locally with: npm start\n`);

process.exit(0);