/**
 * Firestore Auto-Collection Initialization
 * 
 * Automatically creates required Firestore collections on first use
 * - session_timers
 * - email_logs
 * - call_logs
 * 
 * Call this before using any service
 */

class FirestoreInit {
    constructor() {
        this.collections = ['session_timers', 'email_logs', 'call_logs'];
        this.isInitialized = false;
    }

    /**
     * Initialize Firestore and auto-create collections
     */
    async init() {
        try {
            if (this.isInitialized) {
                console.info('[FirestoreInit] Already initialized');
                return true;
            }

            // Wait for Firebase
            await this._waitForFirebase();
            console.info('[FirestoreInit] Firebase loaded');

            // Get Firestore instance
            const db = firebase.firestore();
            
            // Auto-create collections by adding a temporary document
            for (const collectionName of this.collections) {
                try {
                    const collRef = db.collection(collectionName);
                    
                    // Check if collection exists by trying to query it
                    const snapshot = await collRef.limit(1).get();
                    
                    if (snapshot.empty) {
                        // Collection is empty or doesn't exist
                        // Add a temporary init document to create collection
                        await collRef.doc('_init').set({
                            initialized: true,
                            createdAt: new Date(),
                            version: '1.0'
                        });
                        
                        // Immediately delete the init document
                        await collRef.doc('_init').delete();
                        
                        console.info(`[FirestoreInit] ✅ Created collection: ${collectionName}`);
                    } else {
                        console.info(`[FirestoreInit] ✅ Collection exists: ${collectionName}`);
                    }
                } catch (err) {
                    console.warn(`[FirestoreInit] Warning for ${collectionName}:`, err.message);
                }
            }

            this.isInitialized = true;
            console.info('[FirestoreInit] ✅ All collections ready');
            return true;

        } catch (error) {
            console.error('[FirestoreInit] Initialization failed:', error);
            return false;
        }
    }

    /**
     * Wait for Firebase SDK to load
     */
    async _waitForFirebase() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Firebase SDK load timeout'));
            }, 10000);

            const check = () => {
                if (typeof firebase !== 'undefined' && firebase.firestore) {
                    clearTimeout(timeout);
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            
            check();
        });
    }

    /**
     * Get Firestore instance
     */
    getDb() {
        if (typeof firebase === 'undefined') {
            throw new Error('Firebase not initialized');
        }
        return firebase.firestore();
    }

    /**
     * Get collection reference
     */
    getCollection(name) {
        const db = this.getDb();
        return db.collection(name);
    }
}

// Create global instance
if (typeof window !== 'undefined') {
    window.firestoreInit = new FirestoreInit();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirestoreInit;
}
