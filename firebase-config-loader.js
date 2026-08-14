/**
 * Firebase Configuration Loader
 * Handles loading Firebase configuration from various sources
 * Supports environment variables, build-time injection, and runtime configuration
 * 
 * Usage:
 * - In browser: ConfigLoader.getEnvironmentConfig()
 * - In build scripts: ConfigLoader.loadFromEnv() or ConfigLoader.loadFromFile(filePath)
 * - For testing: ConfigLoader.setTestConfig(config)
 */

const FirebaseConfigLoader = (() => {
    // Configuration cache
    let cachedConfig = null;
    let loadedEnvironment = null;

    /**
     * Load configuration from environment variables
     * Supports both individual env vars and JSON-stringified config
     */
    const loadFromEnv = () => {
        // Try to load complete config JSON first
        if (process.env.FIREBASE_CONFIG) {
            try {
                return JSON.parse(process.env.FIREBASE_CONFIG);
            } catch (e) {
                console.warn('Failed to parse FIREBASE_CONFIG JSON:', e);
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
            measurementId: process.env.FIREBASE_MEASUREMENT_ID
        };

        // Validate that at least essential fields are set
        const essentialFields = ['apiKey', 'authDomain', 'projectId'];
        const missingEssential = essentialFields.filter(field => !config[field]);
        
        if (missingEssential.length > 0) {
            throw new Error(`Missing essential Firebase configuration: ${missingEssential.join(', ')}. Please set these environment variables.`);
        }

        return config;
    };

    /**
     * Load configuration from .env file (Node.js environment)
     * Requires 'dotenv' package
     */
    const loadFromFile = (filePath = '.env') => {
        if (typeof require !== 'undefined') {
            try {
                // Try to load dotenv if available
                const dotenv = require('dotenv');
                const result = dotenv.config({ path: filePath });
                
                if (result.error) {
                    console.warn(`Warning: Could not load .env file from ${filePath}:`, result.error.message);
                    return null;
                }

                return loadFromEnv();
            } catch (e) {
                console.warn('dotenv not available. Falling back to environment variables.');
                return loadFromEnv();
            }
        }
        return null;
    };

    /**
     * Get environment-appropriate default configuration
     * Used as fallback when explicit config is not provided
     */
    const getEnvironmentDefaults = () => {
        const environment = typeof process !== 'undefined' && process.env.NODE_ENV || 'development';

        const defaults = {
            production: {
                apiKey: "prod_api_key_placeholder",
                authDomain: "epay-crm-prod.firebaseapp.com",
                projectId: "epay-crm-prod",
                storageBucket: "epay-crm-prod.appspot.com",
                messagingSenderId: "prod_sender_id_placeholder",
                appId: "prod_app_id_placeholder",
                measurementId: "prod_measurement_id_placeholder"
            },
            staging: {
                apiKey: "staging_api_key_placeholder",
                authDomain: "epay-crm-staging.firebaseapp.com",
                projectId: "epay-crm-staging",
                storageBucket: "epay-crm-staging.appspot.com",
                messagingSenderId: "staging_sender_id_placeholder",
                appId: "staging_app_id_placeholder",
                measurementId: "staging_measurement_id_placeholder"
            },
            development: {
                apiKey: "dev_api_key_placeholder",
                authDomain: "epay-crm-dev.firebaseapp.com",
                projectId: "epay-crm-dev",
                storageBucket: "epay-crm-dev.appspot.com",
                messagingSenderId: "dev_sender_id_placeholder",
                appId: "dev_app_id_placeholder",
                measurementId: "dev_measurement_id_placeholder"
            }
        };

        return defaults[environment] || defaults.development;
    };

    /**
     * Validate Firebase configuration
     * Returns validation result with details
     */
    const validateConfig = (config) => {
        const requiredFields = {
            apiKey: 'string',
            authDomain: 'string',
            projectId: 'string',
            storageBucket: 'string',
            messagingSenderId: 'string',
            appId: 'string'
        };

        const errors = [];
        const warnings = [];

        // Check required fields
        for (const [field, type] of Object.entries(requiredFields)) {
            if (!config[field]) {
                errors.push(`Missing required field: ${field}`);
            } else if (typeof config[field] !== type) {
                errors.push(`Invalid type for ${field}: expected ${type}, got ${typeof config[field]}`);
            } else if (config[field].includes('_placeholder') || config[field].startsWith('YOUR_') || 
                       config[field].startsWith('PROD_') || config[field].startsWith('DEV_')) {
                warnings.push(`${field} appears to be a placeholder value`);
            }
        }

        // Check optional fields
        if (config.measurementId && typeof config.measurementId !== 'string') {
            errors.push(`Invalid type for measurementId: expected string, got ${typeof config.measurementId}`);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    };

    /**
     * Get environment-aware configuration
     * Attempts to load from various sources in order of preference
     */
    const getEnvironmentConfig = () => {
        // Return cached config if available
        if (cachedConfig) {
            return { config: cachedConfig, source: loadedEnvironment };
        }

        let config = null;
        let source = 'unknown';

        // Try to load from window object (injected during deployment)
        if (typeof window !== 'undefined' && window.__FIREBASE_CONFIG__) {
            config = window.__FIREBASE_CONFIG__;
            source = 'window.__FIREBASE_CONFIG__ (injected)';
        }
        // Try to load from environment variables
        else if (typeof process !== 'undefined' && process.env) {
            try {
                config = loadFromEnv();
                source = 'process.env';
            } catch (e) {
                console.warn('Failed to load from environment variables:', e.message);
                config = getEnvironmentDefaults();
                source = 'defaults';
            }
        }
        // Fallback to defaults
        else {
            config = getEnvironmentDefaults();
            source = 'defaults';
        }

        // Validate configuration
        const validation = validateConfig(config);
        
        if (!validation.isValid) {
            console.error('Firebase configuration validation failed:', validation.errors);
        }
        
        if (validation.warnings.length > 0) {
            console.warn('Firebase configuration warnings:', validation.warnings);
        }

        // Cache the result
        cachedConfig = config;
        loadedEnvironment = source;

        return { config, source, validation };
    };

    /**
     * Set test configuration (for testing purposes)
     */
    const setTestConfig = (config) => {
        cachedConfig = config;
        loadedEnvironment = 'test';
        return true;
    };

    /**
     * Clear cached configuration
     */
    const clearCache = () => {
        cachedConfig = null;
        loadedEnvironment = null;
    };

    /**
     * Get current cache status
     */
    const getCacheStatus = () => {
        return {
            isCached: cachedConfig !== null,
            environment: loadedEnvironment
        };
    };

    // Public API
    return {
        loadFromEnv,
        loadFromFile,
        getEnvironmentDefaults,
        validateConfig,
        getEnvironmentConfig,
        setTestConfig,
        clearCache,
        getCacheStatus
    };
})();

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseConfigLoader;
}

if (typeof window !== 'undefined') {
    window.FirebaseConfigLoader = FirebaseConfigLoader;
}
