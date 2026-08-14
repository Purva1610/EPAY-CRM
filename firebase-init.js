/**
 * Firebase & CRM Services Initialization
 * 
 * Initializes:
 * 1. Firebase App
 * 2. Firestore (with auto-collection creation)
 * 3. EmailService
 * 4. CallingService
 * 5. SessionTimerService
 */

(async () => {
    try {
        console.info('[FirebaseInit] Starting initialization...');
        
        // 1. Wait for Firebase SDK
        await waitForFirebase();
        console.info('[FirebaseInit] ✅ Firebase SDK loaded');
        
        // 2. Initialize Firebase App
        const firebaseConfig = {
            apiKey: "AIzaSyCa9Ay3kJxJ_wNQjwLpTEYk_gHoGkk077U",
            authDomain: "epaycrm-63608.firebaseapp.com",
            databaseURL: "https://epaycrm-63608-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "epaycrm-63608",
            storageBucket: "epaycrm-63608.firebasestorage.app",
            messagingSenderId: "230938995927",
            appId: "1:230938995927:web:74cb545097857710e61492",
            measurementId: "G-N54NB91LY8"
        };
        
        firebase.initializeApp(firebaseConfig);
        console.info('[FirebaseInit] ✅ Firebase App initialized');
        
        // 3. Initialize Firestore with auto-collection creation
        if (typeof window.firestoreInit !== 'undefined') {
            const firestoreReady = await window.firestoreInit.init();
            if (firestoreReady) {
                console.info('[FirebaseInit] ✅ Firestore collections ready');
            } else {
                console.warn('[FirebaseInit] ⚠️ Firestore init had issues but continuing...');
            }
        }
        
        const db = firebase.firestore();
        const auth = firebase.auth();
        console.info('[FirebaseInit] ✅ Firestore & Auth initialized');
        
        // 4. Wait for services to be available
        await waitForService('EmailService', 3000);
        await waitForService('CallingService', 3000);
        console.info('[FirebaseInit] ✅ Services available');
        
        // 5. Initialize EmailService
        if (typeof window.EmailService !== 'undefined') {
            const emailService = new window.EmailService();
            const sendGridKey = getSendGridApiKey();
            
            await emailService.init({
                sendGridApiKey: sendGridKey,
                fromEmail: 'noreply@epaycrm.com',
                fromName: 'ePay CRM'
            });
            console.info('[FirebaseInit] ✅ EmailService initialized');
            window.emailService = emailService;
        }
        
        // 6. Initialize CallingService
        if (typeof window.CallingService !== 'undefined') {
            const callingService = new window.CallingService();
            await callingService.init({
                accountSid: getTwilioAccountSid(),
                authToken: getTwilioAuthToken(),
                fromNumber: getTwilioFromNumber()
            });
            console.info('[FirebaseInit] ✅ CallingService initialized');
            window.callingService = callingService;
        }
        
        // 7. Initialize SessionTimerService
        if (typeof window.SessionTimerService !== 'undefined') {
            const sessionTimerService = new window.SessionTimerService();
            await sessionTimerService.init({
                inactivityThresholdMs: 900000,
                breakStartHour: 13,
                breakEndHour: 14,
                shiftEndHour: 18
            });
            console.info('[FirebaseInit] ✅ SessionTimerService initialized');
            window.sessionTimerService = sessionTimerService;
        }
        
        // 8. Emit services ready event
        window.dispatchEvent(new CustomEvent('crm-services-ready', {
            detail: {
                firebase,
                db,
                auth,
                emailService: window.emailService,
                callingService: window.callingService,
                sessionTimerService: window.sessionTimerService,
                timestamp: new Date().toISOString()
            }
        }));
        
        console.info('[FirebaseInit] ✅✅✅ ALL SERVICES READY ✅✅✅');
        
    } catch (error) {
        console.error('[FirebaseInit] ❌ Initialization error:', error);
        window.dispatchEvent(new CustomEvent('crm-services-error', {
            detail: { 
                error: error.message,
                timestamp: new Date().toISOString()
            }
        }));
    }
})();

async function waitForFirebase() {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Firebase SDK load timeout (10s)'));
        }, 10000);
        
        const check = () => {
            if (typeof firebase !== 'undefined') {
                clearTimeout(timeout);
                resolve();
            } else {
                setTimeout(check, 100);
            }
        };
        
        check();
    });
}

async function waitForService(serviceName, timeoutMs = 3000) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        const check = () => {
            if (typeof window[serviceName] !== 'undefined') {
                resolve();
            } else if (Date.now() - startTime > timeoutMs) {
                console.warn(`[FirebaseInit] ${serviceName} not available after ${timeoutMs}ms, continuing anyway`);
                resolve();
            } else {
                setTimeout(check, 100);
            }
        };
        
        check();
    });
}

function getSendGridApiKey() {
    if (typeof process !== 'undefined' && process.env?.VITE_SENDGRID_API_KEY) {
        return process.env.VITE_SENDGRID_API_KEY;
    }
    if (typeof window !== 'undefined' && window.__ENV__?.VITE_SENDGRID_API_KEY) {
        return window.__ENV__.VITE_SENDGRID_API_KEY;
    }
    return null;
}

function getTwilioAccountSid() {
    if (typeof process !== 'undefined' && process.env?.VITE_TWILIO_ACCOUNT_SID) {
        return process.env.VITE_TWILIO_ACCOUNT_SID;
    }
    if (typeof window !== 'undefined' && window.__ENV__?.VITE_TWILIO_ACCOUNT_SID) {
        return window.__ENV__.VITE_TWILIO_ACCOUNT_SID;
    }
    return null;
}

function getTwilioAuthToken() {
    if (typeof process !== 'undefined' && process.env?.VITE_TWILIO_AUTH_TOKEN) {
        return process.env.VITE_TWILIO_AUTH_TOKEN;
    }
    if (typeof window !== 'undefined' && window.__ENV__?.VITE_TWILIO_AUTH_TOKEN) {
        return window.__ENV__.VITE_TWILIO_AUTH_TOKEN;
    }
    return null;
}

function getTwilioFromNumber() {
    if (typeof process !== 'undefined' && process.env?.VITE_TWILIO_FROM_NUMBER) {
        return process.env.VITE_TWILIO_FROM_NUMBER;
    }
    if (typeof window !== 'undefined' && window.__ENV__?.VITE_TWILIO_FROM_NUMBER) {
        return window.__ENV__.VITE_TWILIO_FROM_NUMBER;
    }
    return null;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { waitForFirebase, waitForService };
}
