/**
 * Firebase Configuration and Initialization
 * Handles environment-based configuration loading for development, staging, and production
 * Provides centralized Firebase services initialization with error handling
 * 
 * Requirements: 14.1, 14.2, 14.3
 */

/**
 * Firebase configuration object
 * Loads from environment variables or falls back to defaults
 * Environment variables can be set via:
 * - .env file (for development, requires build tool support)
 * - process.env (in Node/build contexts)
 * - window.__FIREBASE_CONFIG__ (injected during deployment)
 * - Direct variable substitution at build time
 */
const getFirebaseConfig = () => {
    // Environment name for logging and config selection
    const environment = window.__ENV__ || process.env.NODE_ENV || 'development';
    
    // Try to load from injected config (set during deployment)
    if (window.__FIREBASE_CONFIG__) {
        console.info(`[Firebase] Loading config from injected environment (${environment})`);
        return window.__FIREBASE_CONFIG__;
    }
    
    // Try to load from process.env (build-time injection)
    if (typeof process !== 'undefined' && process.env && process.env.FIREBASE_CONFIG) {
        try {
            const config = JSON.parse(process.env.FIREBASE_CONFIG);
            console.info(`[Firebase] Loading config from process.env (${environment})`);
            return config;
        } catch (e) {
            console.warn('[Firebase] Failed to parse FIREBASE_CONFIG from process.env', e);
        }
    }
    
    // Environment-specific default configurations
    const defaultConfigs = {
        production: {
            apiKey: process.env.FIREBASE_API_KEY || "PROD_API_KEY",
            authDomain: process.env.FIREBASE_AUTH_DOMAIN || "epay-crm-prod.firebaseapp.com",
            projectId: process.env.FIREBASE_PROJECT_ID || "epay-crm-prod",
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "epay-crm-prod.appspot.com",
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "PROD_SENDER_ID",
            appId: process.env.FIREBASE_APP_ID || "PROD_APP_ID",
            measurementId: process.env.FIREBASE_MEASUREMENT_ID || "PROD_MEASUREMENT_ID"
        },
        staging: {
            apiKey: process.env.FIREBASE_API_KEY || "STAGING_API_KEY",
            authDomain: process.env.FIREBASE_AUTH_DOMAIN || "epay-crm-staging.firebaseapp.com",
            projectId: process.env.FIREBASE_PROJECT_ID || "epay-crm-staging",
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "epay-crm-staging.appspot.com",
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "STAGING_SENDER_ID",
            appId: process.env.FIREBASE_APP_ID || "STAGING_APP_ID",
            measurementId: process.env.FIREBASE_MEASUREMENT_ID || "STAGING_MEASUREMENT_ID"
        },
        development: {
            apiKey: process.env.FIREBASE_API_KEY || "DEV_API_KEY",
            authDomain: process.env.FIREBASE_AUTH_DOMAIN || "epay-crm-dev.firebaseapp.com",
            projectId: process.env.FIREBASE_PROJECT_ID || "epay-crm-dev",
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "epay-crm-dev.appspot.com",
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "DEV_SENDER_ID",
            appId: process.env.FIREBASE_APP_ID || "DEV_APP_ID",
            measurementId: process.env.FIREBASE_MEASUREMENT_ID || "DEV_MEASUREMENT_ID"
        }
    };
    
    const config = defaultConfigs[environment] || defaultConfigs.development;
    console.info(`[Firebase] Using ${environment} configuration`, { projectId: config.projectId });
    return config;
};

/**
 * Validates Firebase configuration for required fields
 * Throws error if essential configuration is missing
 */
const validateFirebaseConfig = (config) => {
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingFields = requiredFields.filter(field => !config[field] || config[field].startsWith('PROD_') || config[field].startsWith('DEV_') || config[field].startsWith('STAGING_'));
    
    if (missingFields.length > 0) {
        const warningMsg = `[Firebase] Configuration incomplete: missing or placeholder values for ${missingFields.join(', ')}. Please ensure environment variables are properly set.`;
        console.warn(warningMsg);
        // Don't throw - allow development to continue with placeholder values for testing
        return { valid: false, warnings: warningMsg };
    }
    
    return { valid: true, warnings: null };
};

/**
 * Initialize Firebase SDK and services
 * Sets up Auth, Firestore, and Realtime Database
 * Enables offline persistence for resilient operation
 */
const initializeFirebase = () => {
    try {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            throw new Error('Firebase SDK not loaded. Ensure firebase SDK is included in HTML before this script.');
        }
        
        // Get configuration from environment
        const firebaseConfig = getFirebaseConfig();
        
        // Validate configuration
        const validation = validateFirebaseConfig(firebaseConfig);
        
        // Initialize Firebase app
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.info('[Firebase] App initialized successfully');
        } else {
            console.info('[Firebase] App already initialized');
        }
        
        // Get Firebase services
        const auth = firebase.auth();
        const db = firebase.firestore();
        const realtimeDB = firebase.database();
        
        // Configure Firestore for production
        if (typeof db.settings === 'function') {
            db.settings({
                persistenceEnabled: true,
                cacheSizeBytes: 50 * 1024 * 1024 // 50MB cache (default is 40MB)
            });
        }
        
        // Enable offline persistence for Firestore
        // This allows read/write operations to continue offline
        // Changes are automatically synced when connectivity is restored
        db.enablePersistence({ experimentalForceOwningTab: false })
            .then(() => {
                console.info('[Firebase] Offline persistence enabled for Firestore');
            })
            .catch((err) => {
                if (err.code === 'failed-precondition') {
                    console.warn('[Firebase] Multiple tabs open - Firestore persistence disabled for this tab (only one tab can have persistence enabled)');
                } else if (err.code === 'unimplemented') {
                    console.warn('[Firebase] Browser does not support Firestore persistence - offline features will be limited');
                } else {
                    console.error('[Firebase] Error enabling persistence:', err);
                }
            });
        
        // Configure authentication
        auth.useDeviceLanguage();
        
        // Configure Realtime Database presence
        // Set up presence tracking for real-time user status
        const connectedRef = realtimeDB.ref('.info/connected');
        connectedRef.on('value', (snapshot) => {
            if (snapshot.val() === true) {
                // We're connected (or reconnected)
                console.debug('[Firebase] Connected to Realtime Database');
                // Trigger connectivity restored event
                window.dispatchEvent(new CustomEvent('firebaseConnected'));
            } else {
                // We're disconnected
                console.debug('[Firebase] Disconnected from Realtime Database');
                // Trigger connectivity lost event
                window.dispatchEvent(new CustomEvent('firebaseDisconnected'));
            }
        });
        
        // Log Firebase initialization state
        console.info('[Firebase] Initialization complete', {
            projectId: firebaseConfig.projectId,
            authDomain: firebaseConfig.authDomain,
            persistenceEnabled: validation.valid
        });
        
        return { auth, db, realtimeDB, firebaseConfig };
    } catch (error) {
        console.error('[Firebase] Initialization failed:', error);
        throw error;
    }
};

/**
 * Initialize Firebase when DOM is ready
 * Prevents race conditions if this script loads before Firebase SDK
 */
let firebaseServices = null;

const initializeWhenReady = () => {
    // Wait for Firebase SDK to be available
    if (typeof firebase === 'undefined') {
        setTimeout(initializeWhenReady, 100);
        return;
    }
    
    try {
        const services = initializeFirebase();
        firebaseServices = services;
        
        // Expose Firebase services globally for backward compatibility
        window.FirebaseServices = services;
        window.auth = services.auth;
        window.db = services.db;
        window.realtimeDB = services.realtimeDB;
        
        // Dispatch initialization complete event
        window.dispatchEvent(new CustomEvent('firebaseInitialized', { 
            detail: { 
                projectId: services.firebaseConfig.projectId,
                environment: window.__ENV__ || process.env.NODE_ENV || 'development'
            } 
        }));
        
        console.info('[Firebase] Ready for application use');
    } catch (error) {
        console.error('[Firebase] Failed to initialize:', error);
        // Dispatch initialization error event
        window.dispatchEvent(new CustomEvent('firebaseInitializationError', { 
            detail: { error: error.message } 
        }));
    }
};

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWhenReady);
} else {
    // DOM is already ready
    initializeWhenReady();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getFirebaseConfig,
        validateFirebaseConfig,
        initializeFirebase,
        getFirebaseServices: () => firebaseServices
    };
}