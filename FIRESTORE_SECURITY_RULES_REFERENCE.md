# Firestore Security Rules - Technical Reference

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Active  
**Requirements:** 7.1, 7.2, 7.3, 7.4, 7.5, 7.6

---

## Table of Contents

1. [Rules Architecture](#rules-architecture)
2. [Helper Functions](#helper-functions)
3. [Collection-Level Rules](#collection-level-rules)
4. [Access Control Patterns](#access-control-patterns)
5. [Testing Guidelines](#testing-guidelines)
6. [Common Scenarios](#common-scenarios)
7. [Performance Considerations](#performance-considerations)

---

## Rules Architecture

The Firestore Security Rules follow a hierarchical pattern:

```
Helper Functions (Authentication, Authorization)
    ↓
Collection Rules (Users, Role Configs, Audit Logs, etc.)
    ↓
Document-Level Validation
    ↓
Field-Level Validation
```

### Design Principles

1. **Deny by Default:** All access denied unless explicitly allowed
2. **Principle of Least Privilege:** Users get minimum required permissions
3. **Role-Based Access:** Access determined by user's role in profile document
4. **Immutable Audit Trail:** Audit logs cannot be deleted
5. **User-Scoped Data:** Users can only access their own data except where explicitly granted

---

## Helper Functions

### Authentication Functions

#### `isAuthenticated()`

**Purpose:** Verify user is logged in

**Returns:** Boolean

**Implementation:**
```firestore
function isAuthenticated() {
  return request.auth != null;
}
```

**Usage:** Gating all operations requiring authentication

**Example:**
```firestore
allow read: if isAuthenticated();  // Any logged-in user can read
```

**Requirements:** 7.1

---

#### `isAdmin()`

**Purpose:** Verify user is super-admin

**Returns:** Boolean

**Implementation:**
```firestore
function isAdmin() {
  return isAuthenticated() && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super-admin';
}
```

**Notes:**
- Performs document lookup to check user's role
- Returns false if user document doesn't exist
- Returns false if role is different from 'super-admin'

**Usage:** Gating admin operations

**Example:**
```firestore
allow write: if isAdmin();  // Only admins can write
```

**Performance Consideration:** This function reads from the database, which counts toward your read quota. Cache role in custom claims for high-frequency checks.

**Requirements:** 7.1, 7.3, 7.4

---

#### `isPortalAdmin()`

**Purpose:** Verify user has admin or portal admin role

**Returns:** Boolean

**Implementation:**
```firestore
function isPortalAdmin() {
  return isAuthenticated() && 
         (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super-admin', 'admin']);
}
```

**Usage:** Portal-level admin operations

**Example:**
```firestore
allow write: if isPortalAdmin();
```

**Requirements:** 7.1

---

### Authorization Functions

#### `isOwner(userId)`

**Purpose:** Check if authenticated user owns the document

**Parameters:**
- `userId` (string): The UID being accessed

**Returns:** Boolean

**Implementation:**
```firestore
function isOwner(userId) {
  return isAuthenticated() && request.auth.uid == userId;
}
```

**Usage:** User-scoped access control

**Example:**
```firestore
allow update: if isOwner(userId);  // User can only update own document
```

**Requirements:** 7.2, 7.5

---

### Validation Functions

#### `isValidUserProfile()`

**Purpose:** Validate user profile has all required fields and valid formats

**Returns:** Boolean

**Implementation:**
```firestore
function isValidUserProfile() {
  return request.resource.data.keys().hasAll(['uid', 'email', 'displayName', 'role']) &&
         request.resource.data.uid is string &&
         request.resource.data.email is string &&
         request.resource.data.displayName is string &&
         request.resource.data.role is string &&
         request.resource.data.email.matches('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
}
```

**Validates:**
- All required fields present
- Field types correct
- Email format valid (RFC 5322 basic pattern)

**Usage:** Profile creation and update validation

**Example:**
```firestore
allow create: if isAdmin() && isValidUserProfile();
```

**Requirements:** 7.2

---

#### `isValidRole()`

**Purpose:** Ensure only allowed roles are assigned

**Returns:** Boolean

**Implementation:**
```firestore
function isValidRole() {
  return request.resource.data.role in [
    'super-admin', 'admin', 'manager', 'staff', 'viewer'
  ];
}
```

**Allowed Roles:**
| Role | Description | Permissions |
|------|-------------|-------------|
| super-admin | Full system access | All operations |
| admin | Admin functions | User management, audit logs |
| manager | Team management | Team operations |
| staff | Standard user | Own data access |
| viewer | Read-only access | Read-only operations |

**Usage:** Role assignment validation

**Requirements:** 7.1

---

#### `checkAuthRateLimit()`

**Purpose:** Implement rate limiting for authentication attempts

**Returns:** Boolean

**Implementation:**
```firestore
function checkAuthRateLimit() {
  let now = request.time.toMillis();
  let oneMinuteAgo = now - (60 * 1000);
  
  let recentFailedAttempts = firestore.query(
    /databases/$(database)/documents/audit_logs
  ).where('action', '==', 'failed_login')
   .where('email', '==', request.resource.data.email)
   .where('timestamp', '>=', timestamp.date(oneMinuteAgo));
  
  return recentFailedAttempts.size() < 5;
}
```

**Behavior:**
- Counts failed login attempts in past 60 seconds
- Returns true if fewer than 5 attempts
- Returns false if 5+ attempts (blocks login)

**Note:** This is a sample implementation. Production rate limiting should be handled server-side in auth service.

**Requirements:** 7.5, 7.6

---

## Collection-Level Rules

### 1. Users Collection

**Path:** `/users/{userId}`

**Purpose:** Store user profile information with role-based access

**Document Schema:**
```javascript
{
  uid: string,              // User's authentication UID
  email: string,           // User's email address (unique)
  displayName: string,     // User's display name
  photoURL?: string,       // User's profile photo URL (optional)
  role: string,            // User's role (super-admin, admin, etc.)
  createdAt: timestamp,    // Account creation time
  lastLogin: timestamp,    // Last login timestamp
  isActive: boolean        // Account active status
}
```

**Access Rules:**

```firestore
match /users/{userId} {
  // Read: Owner or Admin
  allow read: if isOwner(userId) || isAdmin();
  
  // Update: Owner (except role) or Admin
  allow update: if (isOwner(userId) && 
                    request.resource.data.role == resource.data.role &&
                    request.resource.data.uid == resource.data.uid)
               || (isAdmin() && isValidRole());
  
  // Create: Admin only
  allow create: if isAdmin() && 
                   isValidUserProfile() && 
                   isValidRole();
  
  // Delete: Admin only
  allow delete: if isAdmin();
}
```

**Requirements:** 7.1, 7.2

---

### 2. Role Configs Collection

**Path:** `/role_configs/{roleId}`

**Purpose:** Define available roles and their permissions

**Document Schema:**
```javascript
{
  roleId: string,              // Role identifier
  displayName: string,         // Role display name
  description: string,         // Role description
  accessible_portals: array,   // List of portal IDs accessible
  accessible_features: array,  // List of feature IDs accessible
  createdAt: timestamp,        // Creation timestamp
  updatedAt: timestamp         // Last update timestamp
}
```

**Access Rules:**

```firestore
match /role_configs/{roleId} {
  // Read: All authenticated users
  allow read: if isAuthenticated();
  
  // Write: Admin only
  allow write: if isAdmin();
  
  // Create: Admin only with validation
  allow create: if isAdmin() &&
                   request.resource.data.keys().hasAll([
                     'roleId', 'accessible_portals', 'accessible_features'
                   ]);
  
  // Update: Admin only
  allow update: if isAdmin();
  
  // Delete: Admin only
  allow delete: if isAdmin();
}
```

**Example Document:**
```javascript
role_configs/admin
{
  roleId: "admin",
  displayName: "Administrator",
  description: "Full system access except super-admin functions",
  accessible_portals: [
    "admin.html",
    "user-management.html",
    "compliance-dashboard.html"
  ],
  accessible_features: [
    "user_management",
    "audit_logs",
    "role_config",
    "system_settings"
  ]
}
```

**Requirements:** 7.1, 7.3

---

### 3. Audit Logs Collection

**Path:** `/audit_logs/{logId}`

**Purpose:** Immutable record of all system events for compliance

**Document Schema:**
```javascript
{
  id: string,              // Unique log entry ID
  timestamp: timestamp,    // Server timestamp of event
  action: string,          // Action type (login, logout, role_change, etc.)
  userId: string,          // User performing the action
  targetUserId?: string,   // User affected by action (optional)
  email: string,          // Email of actor
  previousValue?: any,    // Previous value (for updates)
  newValue?: any,         // New value (for updates)
  reason?: string,        // Reason for action (optional)
  ipAddress?: string,     // IP address of request
  userAgent?: string,     // Browser user agent
  failureReason?: string  // Failure reason (for failed attempts)
}
```

**Access Rules:**

```firestore
match /audit_logs/{logId} {
  // Read: Admin only
  allow read: if isAdmin();
  
  // Write: Authenticated users (system-generated)
  allow write: if isAuthenticated() &&
                  request.resource.data.keys().hasAll([
                    'timestamp', 'action', 'userId'
                  ]) &&
                  request.resource.data.timestamp is timestamp &&
                  request.resource.data.action is string &&
                  request.resource.data.userId is string;
  
  // Create: Authenticated users
  allow create: if isAuthenticated() &&
                   request.resource.data.keys().hasAll([
                     'timestamp', 'action', 'userId'
                   ]);
  
  // Update: Limited to status changes
  allow update: if isAuthenticated() &&
                   (isOwner(resource.data.userId) || isAdmin());
  
  // Delete: NEVER allowed
  allow delete: if false;
}
```

**Audit Log Actions:**
- `login` - User login successful
- `logout` - User logout
- `failed_login` - Login attempt failed
- `role_change` - User role changed
- `user_create` - New user created
- `user_disable` - User account disabled
- `portal_access` - Portal accessed
- `data_export` - Data exported

**Requirements:** 7.1, 7.4

---

### 4. Failed Login Attempts Collection

**Path:** `/failed_login_attempts/{attemptId}`

**Purpose:** Track failed login attempts for rate limiting and security

**Document Schema:**
```javascript
{
  email: string,           // Email of login attempt
  timestamp: timestamp,    // When attempt occurred
  reason: string,         // Failure reason
  ipAddress?: string,     // IP address of attempt
  userAgent?: string      // Browser user agent
}
```

**Access Rules:**

```firestore
match /failed_login_attempts/{attemptId} {
  // Read: Admin only
  allow read: if isAdmin();
  
  // Write: Authenticated users
  allow write: if isAuthenticated();
  
  // Create: Authenticated users
  allow create: if isAuthenticated() &&
                   request.resource.data.keys().hasAll([
                     'email', 'timestamp', 'reason'
                   ]);
  
  // Delete: Admin only (for cleanup)
  allow delete: if isAdmin();
}
```

**Requirements:** 7.5, 7.6

---

### 5. Presence Collection

**Path:** `/presence/{userId}`

**Purpose:** Real-time user presence and activity tracking (Realtime Database)

**Document Schema:**
```javascript
{
  displayName: string,        // User's display name
  role: string,              // User's role
  loginTime: timestamp,      // When user logged in
  lastActivityTime: timestamp, // Last activity timestamp
  online: boolean,           // Current online status
  status: string             // Status: active, away, offline
}
```

**Access Rules:**

```firestore
match /presence/{userId} {
  // Read: All authenticated users
  allow read: if isAuthenticated();
  
  // Write: User can only write own presence
  allow write: if isOwner(userId) &&
                  request.resource.data.keys().hasAll([
                    'displayName', 'role', 'loginTime', 'lastActivityTime', 
                    'online', 'status'
                  ]) &&
                  request.resource.data.displayName is string &&
                  request.resource.data.role is string &&
                  request.resource.data.loginTime is timestamp &&
                  request.resource.data.lastActivityTime is timestamp &&
                  request.resource.data.online is bool &&
                  request.resource.data.status is string &&
                  request.resource.data.status in ['active', 'away', 'offline'];
  
  // Update: User can update own presence
  allow update: if isOwner(userId);
  
  // Delete: User can delete own presence on logout
  allow delete: if isOwner(userId);
}
```

**Requirements:** 7.5

---

### 6. Offline Queue Collection

**Path:** `/offline_queue/{userId}/{operationId}`

**Purpose:** Queue offline operations for sync when connectivity restored

**Document Schema:**
```javascript
{
  type: string,          // Operation type: create, update, delete
  collection: string,    // Target collection
  documentId: string,    // Target document ID
  data: object,          // Operation data
  status: string,        // Status: pending, synced, conflict, failed
  timestamp: timestamp,  // When operation was queued
  error?: string         // Error message if failed
}
```

**Access Rules:**

```firestore
match /offline_queue/{userId}/{operationId} {
  // Read: User can read own queue
  allow read: if isOwner(userId);
  
  // Write: User can write to own queue
  allow write: if isOwner(userId) &&
                  request.resource.data.keys().hasAll([
                    'type', 'collection', 'documentId', 'data', 'status', 'timestamp'
                  ]) &&
                  request.resource.data.type in ['create', 'update', 'delete'] &&
                  request.resource.data.status in ['pending', 'synced', 'conflict', 'failed'];
  
  // Create: User can create queue entries
  allow create: if isOwner(userId);
  
  // Update: User can update queue entry status
  allow update: if isOwner(userId);
  
  // Delete: User can delete processed entries
  allow delete: if isOwner(userId);
}
```

**Requirements:** 6.2

---

### 7. Sessions Collection

**Path:** `/sessions/{sessionId}`

**Purpose:** Session management and tracking

**Document Schema:**
```javascript
{
  userId: string,        // User's UID
  createdAt: timestamp,  // Session creation time
  expiresAt: timestamp,  // Session expiration time
  ipAddress?: string,    // IP address of session
  userAgent?: string,    // Browser user agent
  isActive: boolean      // Current session status
}
```

**Access Rules:**

```firestore
match /sessions/{sessionId} {
  // Read: User can read own sessions, admin reads all
  allow read: if (isAuthenticated() && request.auth.uid == resource.data.userId) ||
                 isAdmin();
  
  // Create: Authenticated users create sessions
  allow create: if isAuthenticated() &&
                   request.resource.data.userId == request.auth.uid &&
                   request.resource.data.keys().hasAll([
                     'userId', 'createdAt', 'expiresAt'
                   ]);
  
  // Update: User updates own, admin updates all
  allow update: if (isAuthenticated() && isOwner(resource.data.userId)) ||
                   isAdmin();
  
  // Delete: User deletes own, admin deletes all
  allow delete: if isOwner(resource.data.userId) || isAdmin();
}
```

**Requirements:** 4.4

---

## Access Control Patterns

### Pattern 1: User-Scoped Read Access

**Scenario:** User should only read their own documents

**Implementation:**
```firestore
allow read: if isOwner(userId);
```

**Example:**
```firestore
match /users/{userId} {
  allow read: if isOwner(userId);  // User only reads own profile
}
```

---

### Pattern 2: Owner Write with Admin Override

**Scenario:** User edits own document, but admin can override

**Implementation:**
```firestore
allow write: if isOwner(userId) || isAdmin();
```

**With Restrictions:**
```firestore
allow update: if (isOwner(userId) && 
                  request.resource.data.role == resource.data.role)  // Can't change own role
             || (isAdmin() && isValidRole());  // Admin can change role
```

**Example:**
```firestore
match /users/{userId} {
  allow update: if (isOwner(userId) && 
                    request.resource.data.role == resource.data.role)
               || (isAdmin() && isValidRole());
}
```

---

### Pattern 3: Read-Only for All Authenticated Users

**Scenario:** Public reference data available to all authenticated users

**Implementation:**
```firestore
allow read: if isAuthenticated();
allow write: if isAdmin();
```

**Example:**
```firestore
match /role_configs/{roleId} {
  allow read: if isAuthenticated();      // Anyone can read role config
  allow write: if isAdmin();             // Only admin can update
}
```

---

### Pattern 4: Admin-Only Collection

**Scenario:** Sensitive data accessible only to admins

**Implementation:**
```firestore
allow read, write: if isAdmin();
```

**Example:**
```firestore
match /audit_logs/{logId} {
  allow read: if isAdmin();
  allow write: if isAuthenticated();    // System-generated but created by auth service
  allow delete: if false;               // Never delete
}
```

---

### Pattern 5: Immutable Records

**Scenario:** Records created but never modified or deleted

**Implementation:**
```firestore
allow create: if isAuthenticated();
allow read: if isAuthenticated();
allow update, delete: if false;
```

**Example:**
```firestore
match /audit_logs/{logId} {
  allow create: if isAuthenticated() && hasRequiredFields();
  allow read: if isAdmin();
  allow update, delete: if false;
}
```

---

## Testing Guidelines

### Local Testing with Firebase Emulator

**Setup:**

```bash
# Install Firebase emulator
firebase init emulators
firebase emulators:start

# In browser console:
// Connect to emulator
firebase.initializeApp(firebaseConfig);

// Disable analytics
firebase.analytics().setAnalyticsCollectionEnabled(false);

// Connect to Firestore emulator
const db = firebase.firestore();
if (location.hostname === 'localhost') {
  db.useEmulator('localhost', 8080);
}
```

**Testing Authentication Scenarios:**

```javascript
// Test 1: Unauthenticated access denied
await firebase.auth().signOut();
try {
  await db.collection('audit_logs').doc('test').get();
  console.error('Should have failed - no auth');
} catch (e) {
  console.log('✓ Unauthenticated blocked:', e.message);
}

// Test 2: Owner can read own document
const user = await firebase.auth().createUserWithEmailAndPassword('test@example.com', 'password');
await db.collection('users').doc(user.user.uid).set({
  uid: user.user.uid,
  email: 'test@example.com',
  displayName: 'Test User',
  role: 'viewer'
});

const doc = await db.collection('users').doc(user.user.uid).get();
console.log('✓ Owner read success:', doc.data());

// Test 3: User cannot read other documents
try {
  await db.collection('users').doc('other-user-id').get();
  console.error('Should have failed - not owner');
} catch (e) {
  console.log('✓ Non-owner blocked:', e.message);
}
```

---

## Common Scenarios

### Scenario 1: Allow User to Update Profile Except Role

**Requirement:** User can update displayName and email but not their role

**Solution:**

```firestore
match /users/{userId} {
  allow update: if isOwner(userId) &&
                   request.resource.data.role == resource.data.role &&
                   request.resource.data.uid == resource.data.uid;
}
```

**JavaScript:**
```javascript
// This succeeds - changing displayName
await db.collection('users').doc(userId).update({
  displayName: 'New Name'
});

// This fails - trying to change role
try {
  await db.collection('users').doc(userId).update({
    role: 'admin'  // NOT ALLOWED
  });
} catch (e) {
  console.log('Role change blocked by security rules');
}
```

---

### Scenario 2: Admin Can Perform Operations on Any User

**Requirement:** Admin can view, edit, or delete any user account

**Solution:**

```firestore
match /users/{userId} {
  allow read: if isOwner(userId) || isAdmin();
  allow update: if isAdmin() && isValidRole();
  allow delete: if isAdmin();
}
```

---

### Scenario 3: Rate Limiting on Sensitive Operations

**Requirement:** Limit failed login attempts to 5 per minute per email

**Solution:**

In security rules:
```firestore
match /audit_logs/{logId} {
  allow create: if isAuthenticated() &&
                   checkAuthRateLimit() &&
                   request.resource.data.action == 'failed_login';
}
```

Best practice: Also implement server-side rate limiting in auth service.

---

### Scenario 4: Cascading Deletes with Audit Trail

**Requirement:** When user is deleted, record in audit logs

**Solution:**

```firestore
// Firestore rules prevent direct deletion from client
match /users/{userId} {
  allow delete: if false;  // No direct deletes
}

// Backend service handles deactivation and audit logging
// Step 1: Set isActive = false
// Step 2: Create audit log entry
// Step 3: Clear user sessions
```

---

## Performance Considerations

### 1. Read Operations and Quotas

**Issue:** Using `get()` in rules consumes read operations

```firestore
function isAdmin() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super-admin';
}
```

**This costs 1 read operation per request.**

**Solution:** Move role to Firebase Custom Claims

```javascript
// In backend/auth service
const customClaims = {
  role: 'super-admin'
};
admin.auth().setCustomUserClaims(uid, customClaims);

// In rules
function isAdmin() {
  return isAuthenticated() && request.auth.token.role == 'super-admin';
}
```

**Cost:** 0 read operations (token is already loaded)

---

### 2. Query Limitations

**Issue:** Security rules cannot perform complex queries on large datasets

**Scenario:** Checking if email is unique during signup

**Bad Approach (won't work):**
```firestore
function emailIsUnique() {
  return firestore.query(/databases/$(database)/documents/users)
    .where('email', '==', request.resource.data.email)
    .size() == 0;
}
```

**Solution:** Validate in backend

```javascript
// Client sends signup request
// Backend checks email uniqueness
// Backend creates user and profile
// Client receives confirmation
```

---

### 3. Collection vs. Subcollection

**Choice:** Store data in root collection vs. subcollection

**Root Collection:**
```firestore
/users/{userId}
/audit_logs/{logId}
/role_configs/{roleId}
```

**Subcollection:**
```firestore
/users/{userId}/activity/{activityId}
/users/{userId}/tokens/{tokenId}
```

**Rules for Root Collections:**
```firestore
match /users/{userId} {
  allow read: if isOwner(userId);
}
```

**Rules for Subcollections:**
```firestore
match /users/{userId}/activity/{activityId} {
  allow read: if isOwner(userId);
}
```

**Performance Trade-offs:**
| Approach | Read Performance | Write Performance | Query Flexibility |
|----------|-----------------|------------------|------------------|
| Root Collection | Good | Good | Excellent |
| Subcollection | Good | Good | Limited |

---

## Security Best Practices

1. **Always authenticate before authorization checks**
   ```firestore
   // ❌ BAD - Missing authentication check
   allow write: if isAdmin();
   
   // ✓ GOOD - Check authentication first
   allow write: if isAuthenticated() && isAdmin();
   ```

2. **Validate all incoming data**
   ```firestore
   // ✓ GOOD - Validate schema and types
   allow create: if request.resource.data.keys().hasAll(['email', 'role']) &&
                    request.resource.data.email is string &&
                    request.resource.data.role in ['admin', 'user'];
   ```

3. **Use custom claims for frequently accessed role data**
   ```firestore
   // ✓ GOOD - Uses token claim (no read cost)
   function isAdmin() {
     return request.auth.token.role == 'admin';
   }
   ```

4. **Implement immutable audit logs**
   ```firestore
   // ✓ GOOD - Audit logs cannot be modified or deleted
   allow delete: if false;
   allow update: if false;
   ```

5. **Separate public and private collections**
   ```firestore
   // ✓ GOOD - Public data in separate collection
   match /role_configs/{roleId} {
     allow read: if isAuthenticated();
   }
   ```

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024 | Initial technical reference document |

---

**End of Reference Document**
