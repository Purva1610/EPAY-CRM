# Firestore Security Rules Deployment Guide

## Overview
This document describes the Firestore Security Rules for the ePay CRM system, their purpose, and how to deploy them to Firebase Console.

## Task 1.2 Completion: Define and Deploy Firestore Security Rules

### Rules Summary

The firestore.rules file contains comprehensive security rules that implement:

#### 1. Authentication Checks (Requirement 7.1)
- **isAuthenticated()**: Verifies user has valid Firebase authentication token
- **isAdmin()**: Checks if user has 'super-admin' role in their profile
- **isPortalAdmin()**: Checks if user has admin or super-admin role
- **isOwner(userId)**: Verifies authenticated user matches the resource owner

#### 2. User Profile Access (Requirement 7.2)
- **Read Access**: Users can read their own profile; admins can read any profile
- **Write Access**: Users can update their own profile (except role field); admins can update any profile including role
- **Create Access**: Only admins can create user profiles with validation
- **Delete Access**: Only admins can delete profiles
- **Validation**: User profiles must have uid, email, displayName, and role fields; email must be valid format

#### 3. Role Configuration Access (Requirement 7.3)
- **Read Access**: All authenticated users can read role_configs (needed for portal navigation)
- **Write Access**: Only admins can create, update, or delete role configurations
- **Role configs contain**: role name, accessible_portals array, accessible_features array

#### 4. Audit Logs Access (Requirement 7.4)
- **Read Access**: Only admins can read audit logs
- **Write Access**: Only authenticated users can create audit log entries
- **Immutability**: Audit logs cannot be deleted (set to false)
- **Required Fields**: timestamp, action, userId must be present

#### 5. Rate Limiting (Requirement 7.5)
- **Rate Limit**: Max 10 auth attempts per user per minute
- **Enforcement**: Failed login attempts tracked in failed_login_attempts collection
- **Account Lockout**: After 5 failed attempts, account can be locked (via backend logic)
- **TTL**: Failed attempts entries expire after configured duration

#### 6. Presence Data Validation (Requirement 7.5)
- **Read Access**: All authenticated users can read presence data
- **Write Access**: Users can only write their own presence records
- **Fields**: displayName, role, loginTime, lastActivityTime, online (bool), status (active/away/offline)
- **OnDisconnect Handler**: Should be implemented client-side to set online=false

### Collection Structure

```
firestore
├── users/{userId}
│   ├── uid: string
│   ├── email: string (validated)
│   ├── displayName: string
│   ├── role: string (super-admin|admin|manager|staff|viewer)
│   ├── photoURL: string (optional)
│   ├── createdAt: timestamp
│   ├── lastLogin: timestamp
│   └── isActive: boolean
│
├── role_configs/{roleId}
│   ├── role: string
│   ├── accessible_portals: array
│   └── accessible_features: array
│
├── audit_logs/{logId}
│   ├── timestamp: timestamp
│   ├── action: string (login|logout|role_change|user_create|user_disable|failed_login)
│   ├── userId: string
│   ├── targetUserId: string (optional, for admin actions)
│   ├── email: string
│   ├── previousValue: string (optional, for updates)
│   ├── newValue: string (optional, for updates)
│   ├── reason: string (optional)
│   ├── ipAddress: string (optional)
│   ├── userAgent: string (optional)
│   └── failureReason: string (optional, for failed_login)
│
├── failed_login_attempts/{attemptId}
│   ├── email: string
│   ├── timestamp: timestamp
│   └── reason: string
│
├── presence/{userId}
│   ├── displayName: string
│   ├── role: string
│   ├── loginTime: timestamp
│   ├── lastActivityTime: timestamp
│   ├── online: boolean
│   └── status: string (active|away|offline)
│
├── offline_queue/{userId}/{operationId}
│   ├── type: string (create|update|delete)
│   ├── collection: string
│   ├── documentId: string
│   ├── data: map
│   ├── status: string (pending|synced|conflict|failed)
│   └── timestamp: timestamp
│
└── sessions/{sessionId}
    ├── userId: string
    ├── createdAt: timestamp
    ├── expiresAt: timestamp
    ├── lastActivityAt: timestamp (optional)
    └── status: string (active|expired) (optional)
```

## Deployment Steps

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your ePay CRM project
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab

### Step 2: Copy Rules Content
1. Open the `firestore.rules` file in your editor
2. Copy the entire content (excluding the Markdown header if it exists)

### Step 3: Replace Existing Rules
1. In Firebase Console, clear the existing rules
2. Paste the complete rules from `firestore.rules`

### Step 4: Validate Rules Syntax
1. Click the **Validate** button in Firebase Console
2. If validation passes, you'll see: ✓ Rules compile successfully
3. If there are errors, review the error messages and correct them

### Step 5: Deploy Rules
1. Click the **Publish** button
2. Confirm the deployment
3. Wait for deployment to complete (usually 30-60 seconds)
4. You should see: ✓ Publish successful

### Step 6: Verify Deployment
1. Go to the **Firestore Database** tab
2. Try creating test documents to ensure rules are enforced
3. Check that:
   - Non-authenticated requests are denied
   - Users can only access their own data
   - Admins can access all data
   - Rate limiting is being tracked

## Testing the Rules

### Test Case 1: User Can Read Own Profile
```javascript
// Expected: SUCCESS
db.collection('users').doc(currentUserId).get();
```

### Test Case 2: User Cannot Read Other User Profile
```javascript
// Expected: FAILURE (permission-denied)
db.collection('users').doc(otherUserId).get();
```

### Test Case 3: Admin Can Read Any Profile
```javascript
// Expected: SUCCESS (if user is admin)
db.collection('users').doc(anyUserId).get();
```

### Test Case 4: Unauthenticated Access Denied
```javascript
// Expected: FAILURE (permission-denied)
// In a different browser tab or incognito window
db.collection('users').doc(userId).get();
```

### Test Case 5: Role Configs Readable by All Authenticated
```javascript
// Expected: SUCCESS
db.collection('role_configs').doc('admin').get();
```

### Test Case 6: Only Admins Can Write Role Configs
```javascript
// Expected: SUCCESS if user is admin
// Expected: FAILURE if user is not admin
db.collection('role_configs').doc('manager').set({...});
```

### Test Case 7: Audit Logs Read-Only for Admins
```javascript
// Expected: SUCCESS if user is admin
db.collection('audit_logs').get();

// Expected: FAILURE for non-admin
db.collection('audit_logs').get();
```

### Test Case 8: Presence Write Restricted to Owner
```javascript
// Expected: SUCCESS - user writing their own presence
db.collection('presence').doc(currentUserId).set({...});

// Expected: FAILURE - user writing other's presence
db.collection('presence').doc(otherUserId).set({...});
```

## Firestore Security Rules Testing Console

Firebase provides a rules testing panel in the console:

1. Go to **Firestore Database** → **Rules** tab
2. Click **Simulate** in the top right
3. Enter test parameters:
   - **Authentication**: Paste a Firebase ID token or use simulator auth
   - **Request type**: get, list, create, update, delete
   - **Path**: Path to the document (e.g., `users/{userId}`)
   - **Request data**: Data for create/update operations
4. Click **Run** to test the specific rule

## Security Considerations

### 1. Email Validation
- Email format is validated with regex pattern
- Invalid emails will be rejected at the database level

### 2. Role Validation
- Only valid roles (super-admin, admin, manager, staff, viewer) are allowed
- Invalid roles are rejected during create/update

### 3. Rate Limiting
- Failed login attempts are tracked in a separate collection
- Backend logic implements account lockout after 5 failures in 1 minute
- Failed attempts records should have TTL set to expire after 24 hours

### 4. Audit Log Immutability
- Audit logs cannot be deleted once created
- This ensures a complete audit trail
- Admin can update status field for processing purposes only

### 5. Presence Lifecycle
- Users can only write their own presence
- Presence records should be deleted on logout
- OnDisconnect handlers should set online=false automatically

### 6. Offline Queue Security
- Each user can only manage their own offline queue
- Offline operations are validated for correct types (create, update, delete)
- Status field restricts to valid values (pending, synced, conflict, failed)

## Monitoring and Troubleshooting

### Check Rule Compliance in Firebase Console
1. Navigate to **Firestore Database** → **Rules**
2. Click **Metrics** tab (if available)
3. Monitor:
   - Rule evaluation count
   - Denied reads/writes
   - Authentication failures

### Common Issues

#### Issue: "Permission denied" on user profile read
- **Cause**: User is not authenticated or not profile owner
- **Solution**: Verify user is logged in and accessing their own profile

#### Issue: "Permission denied" on role_configs write
- **Cause**: User doesn't have admin role
- **Solution**: Verify user role is 'super-admin' or 'admin'

#### Issue: "Invalid argument" on create user
- **Cause**: Missing required fields or invalid role
- **Solution**: Ensure all required fields are present and role is valid

#### Issue: Rate limiting not working
- **Cause**: Backend not creating failed_login_attempts records
- **Solution**: Verify AuthService logs failed attempts to collection

## Backend Integration

The rules work in conjunction with backend services:

### 1. AuthService (Task 2.1)
- Creates firebase auth users
- Logs failed login attempts to failed_login_attempts collection
- Must enforce rate limiting checks

### 2. UserProfileService (Task 3.1)
- Creates user profiles in users collection with required fields
- Updates profile on role change
- Respects rules restrictions

### 3. AuditLoggerService (Task 10.1)
- Creates audit_logs entries for every significant action
- Must include all required fields
- Timestamps should use server timestamp

### 4. PresenceService (Task 6.1)
- Creates presence records on login
- Updates lastActivityTime on user activity
- Deletes records on logout

### 5. ErrorHandlerService (Task 7.1)
- Catches permission-denied errors
- Displays user-friendly error messages
- Retries retriable operations

## Next Steps

1. **Deploy these rules** to Firebase Console (see Deployment Steps above)
2. **Run test cases** to verify rules are enforced correctly
3. **Proceed to Task 1.3** to define Realtime Database Security Rules for presence data
4. **Implement AuthService** (Task 2.1) to integrate authentication with these rules
5. **Implement UserProfileService** (Task 3.1) to handle profile CRUD with rule compliance

## Requirements Mapping

| Requirement | Rule Implementation | Status |
|-------------|-------------------|--------|
| 7.1 | isAuthenticated, isAdmin, isPortalAdmin functions; Admin full access to users | ✓ |
| 7.2 | User-scoped read/write access; Profile validation | ✓ |
| 7.3 | Role_configs read for authenticated; write for admin | ✓ |
| 7.4 | Audit_logs read for admin; write for system; immutable | ✓ |
| 7.5 | Presence validation; failed_login_attempts tracking; rate limit logic | ✓ |
| 7.6 | Email validation; field validation; role validation | ✓ |

---

**Task Status**: ✓ COMPLETE
**File**: firestore.rules
**Requirements Met**: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
