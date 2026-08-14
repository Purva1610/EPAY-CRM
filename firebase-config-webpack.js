/**
 * Firebase Configuration Webpack Plugin Helper
 * Provides utilities for injecting Firebase configuration at build time
 * 
 * Usage in webpack.config.js:
 * const { getFirebaseConfigPlugin } = require('./firebase-config-webpack');
 * 
 * plugins: [
 *   getFirebaseConfigPlugin(process.env.NODE_ENV)
 * ]
 */

const webpack = require('webpack');
require('dotenv').config();

/**
 * Load Firebase configuration from environment
 * Supports multiple sources with fallback chain
 */
const loadFirebaseConfig = (environment = process.env.NODE_ENV || 'development') => {
    // First, try to load from FIREBASE_CONFIG JSON
    if (process.env.FIREBASE_CONFIG) {
        try {
            return JSON.parse(process.env.FIREBASE_CONFIG);
        } catch (e) {
            console.warn('Failed to parse FIREBASE_CONFIG JSON:', e.message);
        }
    }

    // Fall back to individual environment variables
    const config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID || ''
    };

    // Log what we loaded
    console.log(`[Firebase Build] Loaded configuration for ${environment} environment`);
    console.log(`[Firebase Build] Project ID: ${config.projectId}`);
    console.log(`[Firebase Build] Auth Domain: ${config.authDomain}`);

    return config;
};

/**
 * Get webpack DefinePlugin configuration for Firebase settings
 * Injects configuration as global variables during build
 */
const getFirebaseConfigPlugin = (environment = 'development') => {
    const config = loadFirebaseConfig(environment);

    return new webpack.DefinePlugin({
        // Inject Firebase config as JSON
        'process.env.FIREBASE_CONFIG': JSON.stringify(JSON.stringify(config)),
        
        // Inject individual variables
        'process.env.FIREBASE_API_KEY': JSON.stringify(config.apiKey),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(config.authDomain),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(config.projectId),
        'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(config.storageBucket),
        'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(config.messagingSenderId),
        'process.env.FIREBASE_APP_ID': JSON.stringify(config.appId),
        'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(config.measurementId),
        
        // Inject environment name for runtime checks
        'process.env.NODE_ENV': JSON.stringify(environment),
        
        // Inject as global for runtime access
        '__ENV__': JSON.stringify(environment),
        '__FIREBASE_CONFIG__': JSON.stringify(config)
    });
};

/**
 * Example webpack configuration
 * Shows how to use this helper in webpack.config.js
 */
const exampleWebpackConfig = {
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

/**
 * Build-time environment validation
 * Ensures all required Firebase config is set before build
 */
const validateBuildEnvironment = (throwOnMissing = false) => {
    const requiredVars = [
        'FIREBASE_API_KEY',
        'FIREBASE_AUTH_DOMAIN',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_STORAGE_BUCKET',
        'FIREBASE_MESSAGING_SENDER_ID',
        'FIREBASE_APP_ID'
    ];

    const missing = requiredVars.filter(v => !process.env[v]);
    const warnings = requiredVars.filter(v => {
        const val = process.env[v];
        return val && (val.includes('_placeholder') || val.startsWith('YOUR_') || 
                      val.startsWith('PROD_') || val.startsWith('DEV_'));
    });

    if (missing.length > 0) {
        const message = `Missing Firebase configuration: ${missing.join(', ')}`;
        if (throwOnMissing) {
            throw new Error(message);
        } else {
            console.warn(`[Firebase Build] Warning: ${message}`);
        }
    }

    if (warnings.length > 0) {
        console.warn(`[Firebase Build] Using placeholder values for: ${warnings.join(', ')}`);
    }

    return {
        isValid: missing.length === 0,
        missing,
        warnings
    };
};

module.exports = {
    loadFirebaseConfig,
    getFirebaseConfigPlugin,
    validateBuildEnvironment,
    exampleWebpackConfig
};
