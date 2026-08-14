# AuthService Quick Reference

## Installation

```html
<script src="firebase-config.js"></script>
<script src="auth-service.js"></script>
```

## Basic Usage

### Get Service Instance
```javascript
const auth = getAuthService();
```

### Login
```javascript
try {
  const user = await auth.login('user@example.com', 'password123');
  console.log('Logged in:', user);
  // { uid, email, displayName, photoURL, authProvider, loginTime }
} catch (error) {
  console.error(error.code, error.message);
  // error.code: 'user-not-found', 'wrong-password', 'too-many-requests', etc.
}
```

### Check Authentication
```javascript
if (auth.isUserAuthenticated()) {
  const user = auth.getCurrentUser();
  console.log('User ID:', user.uid);
}
```

### Get Token
```javascript
const token = await auth.getToken();
// Returns valid token, refreshes if needed
```

### Logout
```javascript
await auth.logout();
console.log('Logged out');
```

### Listen to Auth Changes
```javascript
const unsubscribe = auth.onAuthStateChanged((state) => {
  if (state.isAuthenticated) {
    console.log('User signed in:', state.user.email);
  } else {
    console.log('User signed out');
  }
});

// Cleanup when done
unsubscribe();
```

### Password Reset
```javascript
// Send reset email
await auth.sendPasswordResetEmail('user@example.com');

// Complete reset (on reset page)
const email = await auth.confirmPasswordReset(resetCode, 'newPassword123');
console.log('Password reset for:', email);
```

## API Reference

### Methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `login(email, password)` | string, string | Promise<User> | Login with email/password |
| `logout()` | - | Promise<boolean> | Sign out user |
| `getCurrentUser()` | - | User \| null | Get current user object |
| `isUserAuthenticated()` | - | boolean | Check if logged in |
| `getToken()` | - | Promise<string> | Get valid auth token |
| `refreshToken()` | - | Promise<string> | Force token refresh |
| `sendPasswordResetEmail(email)` | string | Promise<void> | Send reset email |
| `confirmPasswordReset(code, password)` | string, string | Promise<string> | Complete password reset |
| `onAuthStateChanged(callback)` | Function | Function | Subscribe to auth changes |
| `destroy()` | - | void | Cleanup on app shutdown |

### User Object
```javascript
{
  uid: string,              // User ID
  email: string,            // User email
  displayName: string,      // Display name
  photoURL: string | null,  // Profile photo URL
  emailVerified: boolean,   // Email verified status
  authProvider: 'firebase', // Auth provider
  loginTime: string         // ISO timestamp of login
}
```

### Auth State Object
```javascript
{
  isAuthenticated: boolean, // Auth status
  user: User | null,        // User object or null
  timestamp: number         // Timestamp of change
}
```

### Error Codes
| Code | Message |
|------|---------|
| `user-not-found` | No user with this email |
| `wrong-password` | Incorrect password |
| `too-many-requests` | Too many failed attempts |
| `invalid-email` | Invalid email format |
| `user-disabled` | User account disabled |
| `weak-password` | Password too weak |
| `email-already-in-use` | Email already exists |
| `invalid-verification-code` | Invalid reset code |
| `expired-action-code` | Reset link expired |

## Common Patterns

### Initialize on Page Load
```javascript
// Show loading state
document.body.innerHTML = '<div class="loading">Loading...</div>';

// Wait for auth restoration
const auth = getAuthService();
auth.onAuthStateChanged((state) => {
  if (state.isAuthenticated) {
    // Show authenticated content
    location.href = '/dashboard.html';
  } else {
    // Show login form
    location.href = '/login.html';
  }
});
```

### Login Form Handler
```javascript
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const user = await getAuthService().login(email, password);
    console.log('Login successful');
    location.href = '/dashboard.html';
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
});
```

### Protected Content
```javascript
function ensureAuthenticated() {
  const auth = getAuthService();
  if (!auth.isUserAuthenticated()) {
    location.href = '/login.html?redirect=' + location.pathname;
    return false;
  }
  return true;
}

// Call on page load
if (!ensureAuthenticated()) {
  throw new Error('Not authenticated');
}
```

### Token-Protected API Calls
```javascript
async function callProtectedAPI(endpoint) {
  const token = await getAuthService().getToken();
  
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
}
```

### Auto-Logout on Token Expiration
```javascript
const auth = getAuthService();
auth.onAuthStateChanged((state) => {
  if (!state.isAuthenticated) {
    // Token expired or invalidated
    location.href = '/login.html?reason=session-expired';
  }
});
```

## Events

### DOM Events
Listen for auth changes across tabs/windows:

```javascript
window.addEventListener('crm:authStateChanged', (e) => {
  const { isAuthenticated, user } = e.detail;
  console.log('Auth state changed:', isAuthenticated);
});
```

### Firebase Events
Automatically connected:
- `firebaseConnected` - Connected to Firebase
- `firebaseDisconnected` - Disconnected from Firebase

## Debugging

### Enable Console Logging
```javascript
// AuthService logs to console with [AuthService] prefix
// Check browser DevTools Console for activity

// Check current state
const auth = getAuthService();
console.log('Is authenticated:', auth.isUserAuthenticated());
console.log('Current user:', auth.getCurrentUser());
console.log('Current token:', auth.authToken);
```

### Test in Browser
```javascript
// Open DevTools Console
const auth = getAuthService();
await auth.login('test@example.com', 'password123');
auth.isUserAuthenticated(); // true
auth.getCurrentUser();
await auth.logout();
auth.isUserAuthenticated(); // false
```

## Troubleshooting

### "Firebase SDK not loaded"
- Ensure Firebase SDK is loaded before auth-service.js
- Check script order in HTML

### "No token after login"
- Token is fetched asynchronously after login
- Use `await auth.getToken()` to get token
- Check browser storage for encrypted token

### "onAuthStateChanged not firing"
- Ensure callback is passed as function
- Check browser console for errors
- Verify Firebase is initialized

### "Too many failed attempts"
- Wait 15 minutes before retrying
- Check for account lockout in Firebase Console
- Verify email address and password

## Performance Tips

1. **Reuse singleton**: Call `getAuthService()` multiple times safely
2. **Cache user**: Store `getCurrentUser()` to avoid repeated calls
3. **Refresh proactively**: Token auto-refreshes, but can manually refresh if needed
4. **Clean up listeners**: Call unsubscribe when done
5. **Avoid polling**: Use event listeners instead of timers

## Security Reminders

- ✓ Never store passwords
- ✓ Always use HTTPS in production
- ✓ Validate tokens server-side
- ✓ Don't expose tokens to user
- ✓ Keep tokens encrypted in storage
- ✓ Use secure password reset links
- ✓ Implement rate limiting
- ✓ Log auth events for audit

## Next Steps

- See AUTH_SERVICE_IMPLEMENTATION.md for detailed docs
- Run tests with auth-service.test.html
- Integrate with UserProfileService (Task 3.1)
- Implement RBACService (Task 4.1)
