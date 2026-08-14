# ErrorHandlerService - Quick Reference

## Overview
The ErrorHandlerService provides comprehensive Firebase error handling with:
- **Error Classification**: Identifies retriable vs permanent errors
- **Exponential Backoff Retry**: Automatic retry with configurable delays (100ms → 200ms → 400ms → ... up to 10s)
- **User-Friendly Messages**: Maps Firebase error codes to human-readable text
- **Network Detection**: Distinguishes network errors from API errors
- **Error Logging**: Integration with Firebase Crashlytics and custom monitoring

## Files
- `error-handler-service.js` - Main service implementation (~600 lines)
- `error-handler-service.test.simple.js` - Unit tests (40 tests, all passing)

## Quick Start

### 1. Import and Initialize
```javascript
// Get the singleton instance
const errorHandler = getErrorHandlerService();

// Or create new instance
const errorHandler = new ErrorHandlerService();

// Register callbacks (optional)
errorHandler.onErrorNotification((message, duration, level) => {
    // Show toast notification to user
    showToast(message, duration);
});

errorHandler.onErrorLogging((error, context) => {
    // Send to monitoring service
    firebase.crashlytics().recordError(error);
});
```

## API Reference

### Classification Methods

#### `isRetriableError(error) → boolean`
Returns true if error is transient (network timeout, rate limit, service unavailable)

```javascript
const error = { code: 'timeout', message: 'Request timeout' };
if (errorHandler.isRetriableError(error)) {
    // Can retry
}
```

#### `isPermanentError(error) → boolean`
Returns true if error will not succeed on retry (permission denied, invalid data, user not found)

```javascript
const error = { code: 'permission-denied', message: 'Access denied' };
if (errorHandler.isPermanentError(error)) {
    // Do not retry
}
```

#### `isNetworkError(error) → boolean`
Returns true if error is network-related (timeout, unavailable, offline)

```javascript
if (errorHandler.isNetworkError(error)) {
    // Show offline message
}
```

### Message Methods

#### `getErrorMessage(error) → string`
Returns user-friendly error message

```javascript
const message = errorHandler.getErrorMessage(
    { code: 'auth/user-not-found' }
); 
// Returns: "No user found with this email address"
```

### Error Handling

#### `handleError(error, context) → Object`
Classifies error, logs it, and triggers notifications

```javascript
const classification = errorHandler.handleError(error, {
    operationName: 'login',
    userId: 'user123'
});

// Returns:
{
    code: 'timeout',
    message: 'Timeout',
    isRetriable: true,
    isPermanent: false,
    isNetworkError: true,
    userMessage: 'Request timed out. Please check your internet...',
    context: { ... },
    timestamp: '2024-01-15T...'
}
```

### Retry Logic

#### `executeWithRetry(operation, options) → Promise<*>`
Executes async operation with exponential backoff retry

```javascript
const result = await errorHandler.executeWithRetry(
    async () => {
        return await firebase.firestore()
            .collection('users')
            .doc(userId)
            .get();
    },
    {
        maxRetries: 3,
        initialDelayMs: 100,
        maxDelayMs: 10000,
        onRetry: (error, attemptNumber, delayMs) => {
            console.log(`Retry attempt ${attemptNumber} in ${delayMs}ms`);
        }
    }
);
```

**Retry Schedule (with default config)**:
- Attempt 1: Immediate
- Attempt 2: After 100ms
- Attempt 3: After 200ms
- Attempt 4: After 400ms
- Max delay: 10 seconds

#### `calculateBackoffDelay(retryCount, initialDelay, maxDelay) → number`
Calculates exponential backoff delay

```javascript
const delay = errorHandler.calculateBackoffDelay(2, 100, 10000);
// Returns: 400 (100 * 2^2)
```

### Configuration

#### `getRetryConfig(operationType) → Object`
Gets pre-configured retry settings for common operations

```javascript
// Supported types:
const loginConfig = errorHandler.getRetryConfig('login');
// { maxRetries: 2, initialDelayMs: 100, maxDelayMs: 5000 }

const firestoreReadConfig = errorHandler.getRetryConfig('firestore-read');
// { maxRetries: 3, initialDelayMs: 100, maxDelayMs: 10000 }

const firestoreWriteConfig = errorHandler.getRetryConfig('firestore-write');
// { maxRetries: 3, initialDelayMs: 100, maxDelayMs: 10000 }

const tokenRefreshConfig = errorHandler.getRetryConfig('token-refresh');
// { maxRetries: 2, initialDelayMs: 500, maxDelayMs: 5000 }
```

## Error Classification

### Retriable Errors
These errors are transient and likely to succeed on retry:
- `network-error`, `timeout` - Network connectivity issues
- `auth/network-request-failed` - Firebase network error
- `auth/too-many-requests`, `error/too-many-requests` - Rate limiting
- `service-unavailable`, `unavailable`, `internal` - Temporary service issues
- `resource-exhausted`, `aborted`, `deadline-exceeded` - Transient conditions

### Permanent Errors
These errors will not succeed on retry:
- `auth/user-not-found`, `auth/wrong-password` - Authentication failures
- `auth/invalid-email`, `auth/user-disabled` - Invalid credentials
- `permission-denied`, `auth/permission-denied` - Authorization failures
- `invalid-argument`, `auth/invalid-argument` - Invalid request data
- `unauthenticated`, `auth/unauthenticated` - Authentication required

## User-Friendly Error Messages

Mapped error codes and messages:

| Firebase Error Code | User Message |
|---|---|
| `auth/user-not-found` | "No user found with this email address" |
| `auth/wrong-password` | "Incorrect password" |
| `auth/invalid-email` | "Invalid email address format" |
| `auth/user-disabled` | "This user account has been disabled" |
| `auth/too-many-requests` | "Too many failed login attempts. Please try again later" |
| `auth/network-request-failed` | "Network connection error. Please check your internet connection" |
| `permission-denied` | "You do not have permission to perform this action" |
| `not-found` | "The requested resource was not found" |

## Integration Examples

### Example 1: Login with Retry
```javascript
async function loginWithRetry(email, password) {
    const errorHandler = getErrorHandlerService();
    
    try {
        return await errorHandler.executeWithRetry(
            async () => authService.login(email, password),
            errorHandler.getRetryConfig('login')
        );
    } catch (error) {
        const classification = errorHandler.handleError(error, {
            operationName: 'login',
            userId: email
        });
        throw new Error(classification.userMessage);
    }
}
```

### Example 2: Firestore Read with Retry
```javascript
async function fetchUserProfile(userId) {
    const errorHandler = getErrorHandlerService();
    
    try {
        return await errorHandler.executeWithRetry(
            async () => {
                const doc = await firebase.firestore()
                    .collection('users')
                    .doc(userId)
                    .get();
                return doc.data();
            },
            errorHandler.getRetryConfig('firestore-read')
        );
    } catch (error) {
        errorHandler.handleError(error, {
            operationName: 'fetchUserProfile',
            userId: userId
        });
        throw error;
    }
}
```

### Example 3: Network-Aware Operation
```javascript
async function performOperation() {
    const errorHandler = getErrorHandlerService();
    
    try {
        return await someAsyncOperation();
    } catch (error) {
        if (errorHandler.isNetworkError(error)) {
            // Queue operation for retry when online
            offlineManager.queueOperation(operation);
            showNotification('Operation queued. Will sync when online.');
        } else if (errorHandler.isPermanentError(error)) {
            // Don't retry, show error to user
            showNotification(errorHandler.getErrorMessage(error));
        } else {
            // Retriable error, attempt retry
            const result = await errorHandler.executeWithRetry(
                someAsyncOperation,
                { maxRetries: 3, initialDelayMs: 100 }
            );
        }
    }
}
```

## Test Results

All 40 unit tests pass:

- **Error Classification** (11 tests)
  - isRetriableError: 7 tests
  - isPermanentError: 4 tests

- **Error Messages** (4 tests)
  - getErrorMessage: 4 tests

- **Exponential Backoff** (6 tests)
  - Correct calculation for retries 0-3
  - Max delay capping
  - Full sequence validation

- **Error Normalization** (4 tests)
  - Firebase error objects
  - Standard Error objects
  - String errors
  - Null/undefined handling

- **Network Error Detection** (4 tests)
  - Various network error types
  - Non-network error exclusion

- **Retry Configuration** (4 tests)
  - Different operation types
  - Default configuration

- **Async Retry Logic** (6 tests)
  - First attempt success
  - Multi-attempt success
  - Permanent error handling
  - Exhausted retries

- **Error Handling** (1 test)
  - Error classification

## Requirements Met

- **Requirement 9.1**: Error classification for retriable vs permanent errors
- **Requirement 9.2**: User-friendly error message mapping
- **Requirement 9.3**: Exponential backoff retry logic with configurable delays

## Notes

1. **Backward Compatible**: Works with existing Firebase SDK
2. **Singleton Pattern**: `getErrorHandlerService()` returns singleton instance
3. **Non-Blocking**: Async operations use promises, tests complete quickly
4. **Extensible**: Easy to add new error codes, messages, or retry configs
5. **Monitoring Ready**: Hooks for Firebase Crashlytics and custom monitoring

## Next Steps

1. Integrate ErrorHandlerService into AuthService for login/logout operations
2. Integrate into OfflineManager for queued operation retries
3. Integrate into UserProfileService for Firestore operations
4. Add error notification UI component (toast/modal)
5. Connect to Firebase Crashlytics for production monitoring
