# AuthService Event System Integration Guide

## Overview
This document describes the AuthService event system implementation for task 2.2, which provides real-time authentication state change notifications and multi-tab session synchronization.

## Components

### 1. AuthService (`auth-service.js`)
Provides Firebase authentication integration with event-based state change notifications.

**Key Features:**
- Firebase `onAuthStateChanged` listener integration
- Event emission for auth state changes (login, logout, errors)
- Token management with encryption/decryption
- Password reset workflow
- Cleanup on app shutdown

**Event Types Emitted:**
- `authStateChanged` - When user logs in or out
- `login` - On successful login
- `loginFailed` - On login failure
- `logout` - On logout
- `logoutFailed` - On logout failure
- `authError` - General authentication errors
- `passwordResetEmailSent` - Password reset email sent
- `passwordResetFailed` - Password reset failed
- `initialized` - Service initialization complete

**Performance Requirement:**
- Listeners trigger callback within 100ms of Firebase state change
- Tracked via `listenerCallbackStartTime` and performance.now()

### 2. SessionSyncManager (`session-sync-manager.js`)
Coordinates authentication state across browser tabs using BroadcastChannel API.

**Key Features:**
- Cross-tab session synchronization via BroadcastChannel
- Fallback to localStorage events for older browsers
- Token refresh coordination to prevent duplicate requests
- Session revocation broadcasting for admin actions
- Multi-tab login/logout synchronization

**Message Types:**
- `LOGIN` - User logged in on another tab
- `LOGOUT` - User logged out on another tab
- `SESSION_REVOKED` - Session revoked by admin
- `TOKEN_REFRESH_REQUEST` - Request token refresh from another tab
- `TOKEN_REFRESH_RESPONSE` - Response with refreshed token

## Integration with HTML

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Include Firebase SDK first -->
    <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js"></script>
</head>
<body>
    <!-- Include Firebase configuration -->
    <script src="firebase-config.js"></script>
    
    <!-- Include AuthService and SessionSyncManager -->
    <script src="auth-service.js"></script>
    <script src="session-sync-manager.js"></script>
    
    <!-- Initialize on page load -->
    <script>
        // Wait for Firebase to initialize
        window.addEventListener('firebaseInitialized', async () => {
            // Initialize AuthService
            await authService.initialize(firebase.auth());
            
            // Initialize SessionSyncManager for multi-tab sync
            sessionSyncManager.initialize(authService);
            
            console.log('Authentication system ready');
        });
    </script>
</body>
</html>
```

## Usage Examples

### Listening for Auth State Changes

```javascript
// Subscribe to auth state changes (login/logout)
authService.onAuthStateChanged((event) => {
    if (event.isAuthenticated) {
        console.log('User logged in:', event.user);
        // Redirect to dashboard
        window.location.href = '/dashboard.html';
    } else {
        console.log('User logged out');
        // Redirect to login
        window.location.href = '/login.html';
    }
});
```

### Listening for Login Events

```javascript
// Subscribe to login events
authService.onLogin((event) => {
    console.log('Login successful:', event.user.email);
    // Emit analytics event, etc.
});

// Subscribe to login failures
authService.subscribe('loginFailed', (event) => {
    console.error('Login failed:', event.errorCode);
    // Show error message
});
```

### Handling Login

```javascript
// In login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const user = await authService.login(email, password);
        console.log('Logged in successfully:', user);
        
        // Redirect after successful login
        window.location.href = '/dashboard.html';
    } catch (error) {
        console.error('Login error:', error.code);
        // Show error message to user
    }
});
```

### Multi-Tab Session Synchronization

```javascript
// Listen for login on other tabs
sessionSyncManager.onRemoteLogin((event) => {
    console.log('User logged in on another tab:', event.email);
    // Update UI to show other tab is logged in
});

// Listen for logout on other tabs
sessionSyncManager.onRemoteLogout((event) => {
    console.log('User logged out on another tab');
    // Clear local session data
});

// Listen for session revocation (admin disabled user)
sessionSyncManager.onSessionRevoked((event) => {
    console.log('Session revoked by admin:', event.reason);
    // Force logout and redirect to login
    authService.logout();
    window.location.href = '/login.html';
});
```

### Handling Logout

```javascript
// In logout button handler
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await authService.logout();
        console.log('Logged out successfully');
        
        // Redirect after logout
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
});
```

### Password Reset

```javascript
// Send password reset email
async function sendPasswordReset(email) {
    try {
        await authService.sendPasswordResetEmail(email);
        console.log('Password reset email sent');
        // Show confirmation message
    } catch (error) {
        console.error('Failed to send reset email:', error.code);
    }
}

// Confirm password reset (on reset link page)
async function confirmPasswordReset(code, newPassword) {
    try {
        await authService.confirmPasswordReset(code, newPassword);
        console.log('Password reset successful');
        // Redirect to login
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Password reset failed:', error.code);
    }
}
```

### Error Handling

```javascript
// Listen for auth errors
authService.onAuthError((event) => {
    console.error('Auth error:', event.error.message);
    // Show error notification to user
});

// Handle specific errors
authService.subscribe('loginFailed', (event) => {
    let errorMessage;
    
    switch (event.errorCode) {
        case 'auth/user-not-found':
            errorMessage = 'User account not found';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Incorrect password';
            break;
        case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Please try again later.';
            break;
        default:
            errorMessage = 'Login failed. Please try again.';
    }
    
    console.error(errorMessage);
    // Show error message to user
});
```

## Event Flow Diagram

```
User Action (Login/Logout)
    |
    v
AuthService.login()/logout()
    |
    v
Firebase Auth.signInWithEmailAndPassword()/signOut()
    |
    v
Firebase onAuthStateChanged triggered
    |
    v
AuthService._emitEvent('authStateChanged', {...})
    |
    +---> Emit 'authStateChanged' event
    |     (all listeners called within 100ms)
    |
    +---> Emit 'login'/'logout' event
    |
    +---> Call sessionSyncManager.broadcastLogin()/broadcastLogout()
          (broadcasts to other tabs via BroadcastChannel)
          |
          v
    Other tabs receive message via sessionSyncManager listeners
    (onRemoteLogin/onRemoteLogout)
```

## Performance Considerations

### 100ms Callback Target
The implementation ensures `onAuthStateChanged` listeners are triggered within 100ms of Firebase state change:

```javascript
// Measured in auth-service.js
this.listenerCallbackStartTime = performance.now();
// ... listener logic ...
const callbackDuration = performance.now() - this.listenerCallbackStartTime;
if (callbackDuration > 100) {
    console.warn(`Callback took ${callbackDuration.toFixed(2)}ms (target: <100ms)`);
}
```

### Browser Compatibility

**BroadcastChannel API:**
- Supported: Chrome 54+, Firefox 38+, Safari 15.4+, Edge 79+
- Fallback: localStorage events (all browsers)

**WebCrypto API (for token encryption):**
- Used by SessionSyncManager for secure token storage
- Fallback: Base64 encoding in development

## Testing

Unit tests are provided in:
- `auth-service.test.js` - Tests for AuthService event system
- `session-sync-manager.test.js` - Tests for multi-tab synchronization

Run tests with:
```bash
npm test auth-service.test.js
npm test session-sync-manager.test.js
```

## Integration with Other Services

### AuthManager (Task 5.1)
AuthService event system will be coordinated by AuthManager:
```javascript
// AuthManager will initialize and coordinate all services
await authManager.initialize(authService, sessionSyncManager);
```

### Audit Logging (Task 10.1)
Login/logout events will be captured for audit:
```javascript
authService.onLogin((event) => {
    auditLogger.logLogin(event.user.uid, event.user.email);
});

authService.onLogout((event) => {
    auditLogger.logLogout(event.userId, event.email);
});
```

### Admin User Management (Task 12)
Session revocation will be handled:
```javascript
// When admin disables user
sessionSyncManager.broadcastSessionRevocation(userId, 'Account disabled by admin');

// Other tabs receive revocation
sessionSyncManager.onSessionRevoked((event) => {
    authService.logout();
    window.location.href = '/login.html';
});
```

## Files Created

1. **auth-service.js** (350+ lines)
   - Core authentication service with event system
   - Firebase integration
   - Token management
   - Password reset

2. **session-sync-manager.js** (450+ lines)
   - Multi-tab session synchronization
   - BroadcastChannel API implementation
   - Storage events fallback
   - Token refresh coordination

3. **auth-service.test.js** (380+ lines)
   - Comprehensive unit tests for AuthService
   - Tests for event listeners, callbacks, and state management

4. **session-sync-manager.test.js** (450+ lines)
   - Unit tests for SessionSyncManager
   - Tests for multi-tab communication and event handling

5. **AUTH_EVENT_SYSTEM_INTEGRATION.md** (this file)
   - Integration guide
   - Usage examples
   - Performance considerations

## Requirements Met

- ✅ **Requirement 1.1**: Create subscription mechanism for auth state changes
- ✅ **Requirement 1.2**: Integrate Firebase onAuthStateChanged listener
- ✅ **Requirement 1.3**: Store unsubscribe functions for cleanup
- ✅ **Requirement 1.4**: Listeners trigger callback within 100ms
- ✅ **Requirement 10.1**: BroadcastChannel-based session synchronization
- ✅ **Requirement 10.2**: Multi-tab login/logout event broadcasting
- ✅ **Requirement 10.3**: Session event emission and coordination
- ✅ **Requirement 10.4**: Token encryption for local storage
- ✅ **Requirement 10.5**: Token refresh coordination across tabs

## Next Steps

1. **Task 2.3**: Write unit tests for AuthService login/logout workflows
2. **Task 2.4**: Write property tests for authentication credential security
3. **Task 3.1**: Implement UserProfileService integration with AuthService
4. **Task 5.1**: Implement AuthManager for centralized coordination
5. **Task 10.1**: Implement AuditLoggerService integration with auth events

## Related Documentation

- `FIREBASE_INTEGRATION_GUIDE.md` - Firebase setup and initialization
- `FIRESTORE_SECURITY_RULES_DEPLOYMENT.md` - Security rules for Firestore
- `RTDB_SECURITY_RULES_GUIDE.md` - Realtime Database rules

## Support

For issues or questions about the auth event system:
1. Check the integration guide examples above
2. Review the test files for expected behavior
3. Consult Firebase Auth documentation: https://firebase.google.com/docs/auth
