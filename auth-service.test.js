/**
 * Unit Tests for AuthService
 * Tests auth state listeners, event emission, and session management
 * 
 * Requirements: 1.1, 1.2, 1.3
 */

const AuthService = require('./auth-service.js');

describe('AuthService', () => {
    let authService;
    let mockFirebaseAuth;
    let mockUser;
    let mockUnsubscribe;

    beforeEach(() => {
        mockUnsubscribe = jest.fn();
        mockUser = {
            uid: 'test-user-123',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: null,
            emailVerified: false,
            isAnonymous: false,
            metadata: {},
            getIdToken: jest.fn().mockResolvedValue('test-token-123'),
            stsTokenManager: {
                expirationTime: Date.now() + 3600000
            }
        };

        mockFirebaseAuth = {
            useDeviceLanguage: jest.fn(),
            signInWithEmailAndPassword: jest.fn(),
            signOut: jest.fn(),
            sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
            confirmPasswordReset: jest.fn().mockResolvedValue('test@example.com'),
            verifyPasswordResetCode: jest.fn().mockResolvedValue('test@example.com'),
            currentUser: null,
            onAuthStateChanged: jest.fn()
        };

        global.firebase.auth = jest.fn(() => mockFirebaseAuth);

        authService = new AuthService();
    });

    afterEach(() => {
        authService.destroy();
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        test('should initialize with Firebase Auth instance', () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation((callback) => {
                setTimeout(() => callback(null), 0);
                return mockUnsubscribe;
            });

            authService.init();

            expect(authService.auth).toBe(mockFirebaseAuth);
            expect(mockFirebaseAuth.onAuthStateChanged).toHaveBeenCalled();
        });
    });

    describe('onAuthStateChanged listener', () => {
        test('should call callback immediately with current state', async () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            const callback = jest.fn();
            authService.onAuthStateChanged(callback);

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(callback).toHaveBeenCalledWith({
                isAuthenticated: false,
                user: null,
                timestamp: null
            });
        });

        test('should call callback when Firebase auth state changes', async () => {
            let firebaseCallback;
            mockFirebaseAuth.onAuthStateChanged.mockImplementation((cb) => {
                firebaseCallback = cb;
                return mockUnsubscribe;
            });
            authService.init();

            const callback = jest.fn();
            authService.onAuthStateChanged(callback);
            callback.mockClear();

            await firebaseCallback(mockUser);

            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    isAuthenticated: true,
                    user: expect.objectContaining({
                        uid: 'test-user-123',
                        email: 'test@example.com'
                    })
                })
            );
        });

        test('should return unsubscriber function', () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            const callback = jest.fn();
            const unsubscribe = authService.onAuthStateChanged(callback);

            expect(typeof unsubscribe).toBe('function');
        });

        test('should remove listener on unsubscribe', () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            const callback = jest.fn();
            const unsubscribe = authService.onAuthStateChanged(callback);
            unsubscribe();

            authService.emitAuthStateChanged();
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('user state', () => {
        test('should return null for current user when not authenticated', () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            expect(authService.getCurrentUser()).toBeNull();
            expect(authService.isUserAuthenticated()).toBe(false);
        });

        test('should return current user when authenticated', async () => {
            let firebaseCallback;
            mockFirebaseAuth.onAuthStateChanged.mockImplementation((cb) => {
                firebaseCallback = cb;
                return mockUnsubscribe;
            });
            authService.init();

            await firebaseCallback(mockUser);

            expect(authService.isUserAuthenticated()).toBe(true);
            expect(authService.getCurrentUser()).toEqual(
                expect.objectContaining({
                    uid: 'test-user-123',
                    email: 'test@example.com'
                })
            );
        });
    });

    describe('login/logout workflows', () => {
        test('should login with email and password', async () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            mockFirebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
                user: mockUser
            });
            authService.init();

            const result = await authService.login('test@example.com', 'password123');

            expect(mockFirebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(result).toEqual(
                expect.objectContaining({
                    uid: 'test-user-123',
                    email: 'test@example.com'
                })
            );
        });

        test('should throw on invalid email format', async () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            await expect(authService.login('invalid-email', 'password123')).rejects.toEqual(
                expect.objectContaining({
                    code: 'invalid-email'
                })
            );
        });

        test('should logout successfully', async () => {
            let firebaseCallback;
            mockFirebaseAuth.onAuthStateChanged.mockImplementation((cb) => {
                firebaseCallback = cb;
                return mockUnsubscribe;
            });
            mockFirebaseAuth.signOut.mockResolvedValue(undefined);
            authService.init();

            await firebaseCallback(mockUser);
            expect(authService.isUserAuthenticated()).toBe(true);

            await authService.logout();

            expect(mockFirebaseAuth.signOut).toHaveBeenCalled();
            expect(authService.getCurrentUser()).toBeNull();
            expect(authService.isUserAuthenticated()).toBe(false);
        });
    });

    describe('token management', () => {
        test('should get token when authenticated', async () => {
            let firebaseCallback;
            mockFirebaseAuth.onAuthStateChanged.mockImplementation((cb) => {
                firebaseCallback = cb;
                return mockUnsubscribe;
            });
            mockFirebaseAuth.currentUser = mockUser;
            authService.init();

            await firebaseCallback(mockUser);

            const token = await authService.getToken();
            expect(token).toBe('test-token-123');
        });

        test('should return null for token when not authenticated', async () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            const token = await authService.getToken();
            expect(token).toBeNull();
        });
    });

    describe('password reset', () => {
        test('should send password reset email', async () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            await authService.sendPasswordResetEmail('test@example.com');

            expect(mockFirebaseAuth.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
        });

        test('should confirm password reset', async () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            const result = await authService.confirmPasswordReset('reset-code-123', 'newpassword123');

            expect(mockFirebaseAuth.confirmPasswordReset).toHaveBeenCalledWith('reset-code-123', 'newpassword123');
            expect(result).toBe('test@example.com');
        });
    });

    describe('event emission', () => {
        test('should dispatch crm:authStateChanged custom event', () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            const eventListener = jest.fn();
            window.addEventListener('crm:authStateChanged', eventListener);

            authService.emitAuthStateChanged();

            expect(eventListener).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'crm:authStateChanged'
                })
            );

            window.removeEventListener('crm:authStateChanged', eventListener);
        });

        test('should handle listener errors gracefully', () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            const throwingListener = jest.fn().mockImplementation(() => {
                throw new Error('Listener error');
            });
            const normalListener = jest.fn();

            authService.onAuthStateChanged(throwingListener);
            authService.onAuthStateChanged(normalListener);

            const errorSpy = jest.spyOn(console, 'error').mockImplementation();
            authService.emitAuthStateChanged();
            errorSpy.mockRestore();

            expect(throwingListener).toHaveBeenCalled();
            expect(normalListener).toHaveBeenCalled();
        });
    });

    describe('cleanup', () => {
        test('should unsubscribe Firebase listeners on destroy', () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            authService.destroy();

            expect(mockUnsubscribe).toHaveBeenCalled();
        });

        test('should clear all auth state listeners', () => {
            mockFirebaseAuth.onAuthStateChanged.mockImplementation(() => mockUnsubscribe);
            authService.init();

            const listener = jest.fn();
            authService.onAuthStateChanged(listener);

            authService.destroy();

            authService.emitAuthStateChanged();
            expect(listener).not.toHaveBeenCalled();
        });
    });
});
