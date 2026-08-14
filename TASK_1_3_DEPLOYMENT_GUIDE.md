# Task 1.3: Complete Deployment Guide
## Firebase Realtime Database Security Rules - Full Implementation & Deployment

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Deliverables Overview](#deliverables-overview)
3. [Complete Security Rules](#complete-security-rules)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Verification & Testing](#verification--testing)
6. [Integration with PresenceService](#integration-with-presenceservice)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting & Support](#troubleshooting--support)

---

## Executive Summary

**Task 1.3** completes the Firebase Infrastructure and Security Setup by defining and deploying comprehensive Realtime Database (RTDB) security rules. This task ensures:

- ✅ Secure access to presence data structure
- ✅ User-scoped write access (each user controls only their own record)
- ✅ Authenticated read access for all system users
- ✅ Field-level validation for all presence record attributes
- ✅ Data integrity constraints to prevent tampering

**Status**: COMPLETE AND READY FOR DEPLOYMENT

**Requirements Addressed**: 7.5, 5.1

**Files Included**:
1. `firebase-rtdb-rules.json` - Production-ready rules file
2. `RTDB_SECURITY_RULES_GUIDE.md` - Reference documentation
3. `PRESENCE_SERVICE_RTDB_INTEGRATION.md` - Integration guidelines
4. `RTDB_DEPLOYMENT_CHECKLIST.md` - Deployment procedure
5. `TASK_1_3_SUMMARY.md` - Executive summary
6. `TASK_1_3_DEPLOYMENT_GUIDE.md` - This comprehensive guide

---

## Deliverables Overview

### 1. Production-Ready Rules File

**File**: `firebase-rtdb-rules.json`

The rules file contains:
- Root-level protection (deny by default)
- `/presence` path configuration
- `/presence/{userId}` user-scoped access
- Complete field validations for 6 required fields
- Inline documentation for each rule section

**Key Features**:
- Authenticated read access to presence list
- User-scoped write access control
- Strict field type validation
- Enum restrictions for roles and statuses
- Temporal integrity constraints
- Schema enforcement (exactly 6 fields)

### 2. Security Rules Guide

**File**: `RTDB_SECURITY_RULES_GUIDE.md`

Comprehensive reference covering:
- Security architecture overview
- Rule structure and implementation
- Field-by-field validation specifications
- Security properties enforced
- Deployment instructions
- Testing procedures (6 test scenarios)
- Monitoring guidelines
- Troubleshooting guide

### 3. Integration Guide

**File**: `PRESENCE_SERVICE_RTDB_INTEGRATION.md`

Detailed integration documentation including:
- Presence record structure specification
- 9 complete method implementations with code examples
- Validation checklist for each operation
- Error handling and resolution
- Unit test template
- Security and performance considerations

### 4. Deployment Checklist

**File**: `RTDB_DEPLOYMENT_CHECKLIST.md`

Complete deployment procedure with:
- Pre-deployment checklist (4 sections)
- 8-step deployment process
- Post-deployment verification tests
- Rollback procedure
- Troubleshooting guide
- Monitoring procedures

### 5. Executive Summary

**File**: `TASK_1_3_SUMMARY.md`

Complete overview including:
- Architecture diagrams
- Field specifications table
- Security properties summary
- Requirements coverage mapping
- Integration timeline

---

## Complete Security Rules

### Rules File Structure

```json
{
  "rules": {
    "presence": {
      // ✓ All authenticated users can read
      ".read": "auth != null",
      
      // ✗ Prevent direct parent-level writes
      ".write": false,
      
      // User-specific records
      "{userId}": {
        // ✓ Only user owning record can write
        ".write": "auth.uid === $userId",
        
        // ✓ All authenticated users can read
        ".read": "auth != null",
        
        // ✓ Exactly 6 required fields
        ".validate": "newData.hasChildren([...6 fields...])",
        
        // ✓ Field validations (6 total)
        "displayName": { ".validate": "..." },
        "role": { ".validate": "..." },
        "loginTime": { ".validate": "..." },
        "lastActivityTime": { ".validate": "..." },
        "online": { ".validate": "..." },
        "status": { ".validate": "..." }
      }
    },
    
    // Root protection
    ".read": false,
    ".write": false
  }
}
```

### Field Validations Summary

```
displayName:
  - Type: String
  - Length: 1-255 characters
  - Requirement: Non-empty

role:
  - Type: String (Enum)
  - Valid: admin, accountant, affiliate, BDE, BDO, CFO, CGO, CMO, arrival_manager, assistant_manager
  - Requirement: Exact match to one value

loginTime:
  - Type: Number (Unix timestamp, milliseconds)
  - Range: >= 0
  - Requirement: Non-negative integer, no decimals

lastActivityTime:
  - Type: Number (Unix timestamp, milliseconds)
  - Range: >= loginTime
  - Requirement: Must be >= loginTime (prevents time travel)

online:
  - Type: Boolean
  - Valid: true or false
  - Requirement: Must be boolean

status:
  - Type: String (Enum)
  - Valid: active, away, idle, offline
  - Requirement: Exact match to one value
```

---

## Step-by-Step Deployment

### Phase 1: Preparation (Before Firebase Console)

#### Step 1.1: Verify Files Are Ready

```bash
✓ Check firebase-rtdb-rules.json exists
✓ Check all documentation files exist
✓ Review RTDB_SECURITY_RULES_GUIDE.md
✓ Review RTDB_DEPLOYMENT_CHECKLIST.md
```

#### Step 1.2: Prepare Backup Strategy

```bash
# Create a backup directory
mkdir -p backups/firebase-rules

# If you have existing rules, save them:
# (You'll do this in Firebase Console UI)
```

#### Step 1.3: Review Security Requirements

```bash
From RTDB_SECURITY_RULES_GUIDE.md:
✓ Authentication required for all operations
✓ User-scoped write access enforced
✓ Data integrity validated
✓ Temporal constraints checked
✓ Enum values restricted
✓ Schema enforced
```

---

### Phase 2: Firebase Console Deployment

#### Step 2.1: Access Firebase Console

```
URL: https://console.firebase.google.com
1. Sign in with Firebase credentials
2. Select "ePay CRM" project
3. Verify you're in the correct project
```

**Expected Result**: Firebase Console dashboard loads

---

#### Step 2.2: Navigate to Realtime Database

```
In Firebase Console:
1. Left sidebar → Click "Build"
2. Find "Realtime Database" (or "Database")
3. Select "default-rtdb" (or your database name)
4. Click "Rules" tab at the top
```

**Expected Result**: Rules editor is displayed with current rules

---

#### Step 2.3: Backup Current Rules

```
1. Select ALL text (Ctrl+A / Cmd+A)
2. Copy to clipboard
3. Create new file: firebase-rtdb-rules-backup-[TODAY'S DATE].json
4. Paste and save the backup
5. Keep this file for emergency rollback
```

**Why**: Allows quick recovery if deployment causes issues

**Example filename**:
```
firebase-rtdb-rules-backup-2025-02-20.json
```

---

#### Step 2.4: Clear Rules Editor

```
In Firebase Console Rules Editor:
1. Select ALL text (Ctrl+A / Cmd+A)
2. Delete all selected text
3. Verify editor is now empty
```

**Expected Result**: Blank rules editor

---

#### Step 2.5: Import New Rules

```
1. Open firebase-rtdb-rules.json in your text editor
2. Select ALL content (Ctrl+A / Cmd+A)
3. Copy to clipboard
4. Go to Firebase Console Rules editor
5. Paste the new rules (Ctrl+V / Cmd+V)
6. Verify all content is pasted
```

**Expected Result**: Rules editor displays new rules with proper syntax highlighting

---

#### Step 2.6: Validate Syntax

```
Firebase Console automatically validates:
- All text should be blue (valid syntax)
- No red highlighted areas
- No error messages below editor
```

**If errors appear**:
```
1. Identify the red highlighted area
2. Check for missing commas, brackets, quotes
3. Reference firebase-rtdb-rules.json for correct syntax
4. Fix the error
5. Re-validate (usually automatic)
```

**If validation passes**:
```
✓ No red error indicators
✓ All rules shown in blue
✓ Ready to publish
```

---

#### Step 2.7: Final Safety Review

Before publishing, verify:

```
✓ Root-level protection: ".read": false, ".write": false
✓ /presence path: ".read": "auth != null"
✓ /presence/{userId}: ".write": "auth.uid === $userId"
✓ All 6 field validations present:
  - displayName (string, 1-255)
  - role (enum, 10 values)
  - loginTime (number, >= 0)
  - lastActivityTime (number, >= loginTime)
  - online (boolean)
  - status (enum, 4 values)
✓ Schema validation: exactly 6 fields required
✓ All comments are properly formatted
```

**If anything is missing**: Go back to Step 2.5 and reimport

---

#### Step 2.8: Publish Rules

```
In Firebase Console Rules Editor:
1. Click the blue "Publish" button
2. A confirmation dialog appears
3. Review the differences (if shown)
4. Click "Publish" in the confirmation
5. Wait for "Published" status message
```

**Expected Result**:
- Dialog closes
- Rules tab shows "Published" status
- No error messages
- Rules are now active

---

### Phase 3: Verification (Post-Deployment)

#### Step 3.1: Verify Deployment Success

```
In Firebase Console Realtime Database:
1. Navigate back to Rules tab
2. Refresh the page (F5)
3. Verify new rules are displayed
4. Rules should match firebase-rtdb-rules.json
```

**Expected Result**: New rules visible and active

---

#### Step 3.2: Check Database Status

```
In Firebase Console:
1. Go to Realtime tab (next to Rules)
2. Check database status:
  ✓ Should show "Active" or similar
  ✓ No error messages
  ✓ Database remains accessible
```

---

#### Step 3.3: Test Basic Connectivity

```javascript
// Quick connectivity test in browser console
firebase.database().ref('presence').once('value')
  .then(snapshot => {
    console.log('✓ Database connection successful');
  })
  .catch(error => {
    console.error('✗ Database error:', error);
  });
```

---

---

## Verification & Testing

### Test Scenario 1: Authenticated Read Access

**Objective**: Verify authenticated users can read presence list

```javascript
// 1. Sign in user
firebase.auth().signInWithEmailAndPassword('user@example.com', 'password')
  .then(userCredential => {
    console.log('✓ User authenticated:', userCredential.user.uid);
    
    // 2. Attempt to read presence list
    return firebase.database().ref('presence').once('value');
  })
  .then(snapshot => {
    console.log('✓ Read succeeded');
    console.log('Presence data:', snapshot.val());
  })
  .catch(error => {
    console.error('✗ Read failed:', error.message);
  });
```

**Expected Result**: ✓ Read succeeds, presence data is returned

---

### Test Scenario 2: Unauthenticated Read Denied

**Objective**: Verify unauthenticated users cannot read

```javascript
// 1. Sign out to ensure no authentication
firebase.auth().signOut()
  .then(() => {
    console.log('Signed out');
    
    // 2. Attempt to read presence (should fail)
    return firebase.database().ref('presence').once('value');
  })
  .then(snapshot => {
    console.error('✗ Unexpected: Read succeeded when should fail');
  })
  .catch(error => {
    console.log('✓ Read correctly blocked:', error.message);
  });
```

**Expected Result**: ✗ Read fails with "permission denied"

---

### Test Scenario 3: User Can Write Own Record

**Objective**: Verify user can write their own presence record

```javascript
// 1. Get authenticated user
const userId = firebase.auth().currentUser.uid;

// 2. Prepare valid presence data
const presenceData = {
  displayName: 'Test User',
  role: 'admin',
  loginTime: Date.now(),
  lastActivityTime: Date.now(),
  online: true,
  status: 'active'
};

// 3. Attempt to write
firebase.database().ref(`presence/${userId}`).set(presenceData)
  .then(() => {
    console.log('✓ Write succeeded');
  })
  .catch(error => {
    console.error('✗ Write failed:', error.message);
  });
```

**Expected Result**: ✓ Write succeeds

---

### Test Scenario 4: User Cannot Write Other's Record

**Objective**: Verify user cannot modify another user's record

```javascript
// 1. Get current user ID
const currentUserId = firebase.auth().currentUser.uid;

// 2. Create target user ID (different from current)
const targetUserId = 'some-other-user-id-12345';

// 3. Prepare data
const presenceData = {
  displayName: 'Fake User',
  role: 'admin',
  loginTime: Date.now(),
  lastActivityTime: Date.now(),
  online: true,
  status: 'active'
};

// 4. Attempt to write (should fail)
firebase.database().ref(`presence/${targetUserId}`).set(presenceData)
  .then(() => {
    console.error('✗ Unexpected: Write succeeded for non-owned record');
  })
  .catch(error => {
    console.log('✓ Write correctly blocked:', error.message);
  });
```

**Expected Result**: ✗ Write fails with "permission denied"

---

### Test Scenario 5: Field Validation - Invalid Status

**Objective**: Verify invalid field values are rejected

```javascript
const userId = firebase.auth().currentUser.uid;

const invalidData = {
  displayName: 'Test User',
  role: 'admin',
  loginTime: Date.now(),
  lastActivityTime: Date.now(),
  online: true,
  status: 'disconnected'  // ✗ INVALID - not in allowed values
};

firebase.database().ref(`presence/${userId}`).set(invalidData)
  .then(() => {
    console.error('✗ Unexpected: Write succeeded with invalid status');
  })
  .catch(error => {
    console.log('✓ Validation correctly blocked:', error.message);
  });
```

**Expected Result**: ✗ Write fails with validation error

---

### Test Scenario 6: Missing Required Fields

**Objective**: Verify all 6 fields are required

```javascript
const userId = firebase.auth().currentUser.uid;

const incompleteData = {
  displayName: 'Test User',
  role: 'admin',
  loginTime: Date.now(),
  // ✗ MISSING: lastActivityTime, online, status
};

firebase.database().ref(`presence/${userId}`).set(incompleteData)
  .then(() => {
    console.error('✗ Unexpected: Write succeeded with missing fields');
  })
  .catch(error => {
    console.log('✓ Validation correctly blocked:', error.message);
  });
```

**Expected Result**: ✗ Write fails with validation error

---

### Complete Testing Script

```javascript
/**
 * Complete RTDB Rules Testing Suite
 * Run this in browser console after deployment
 */

const testResults = [];

async function runAllTests() {
  console.log('🚀 Starting RTDB Rules Testing Suite...\n');
  
  // Test 1: Authenticated read
  console.log('Test 1: Authenticated read access...');
  try {
    await firebase.auth().signInWithEmailAndPassword('admin@example.com', 'AdminPassword123');
    const snapshot = await firebase.database().ref('presence').once('value');
    console.log('✓ Test 1 PASSED: Authenticated read works');
    testResults.push({ test: 'Authenticated read', status: 'PASS' });
  } catch (error) {
    console.log('✗ Test 1 FAILED:', error.message);
    testResults.push({ test: 'Authenticated read', status: 'FAIL', error: error.message });
  }
  
  // Test 2: User can write own record
  console.log('\nTest 2: User can write own record...');
  try {
    const userId = firebase.auth().currentUser.uid;
    const data = {
      displayName: 'Admin User',
      role: 'admin',
      loginTime: Date.now(),
      lastActivityTime: Date.now(),
      online: true,
      status: 'active'
    };
    await firebase.database().ref(`presence/${userId}`).set(data);
    console.log('✓ Test 2 PASSED: Own record write works');
    testResults.push({ test: 'Own record write', status: 'PASS' });
  } catch (error) {
    console.log('✗ Test 2 FAILED:', error.message);
    testResults.push({ test: 'Own record write', status: 'FAIL', error: error.message });
  }
  
  // Test 3: Invalid status rejected
  console.log('\nTest 3: Invalid status value rejected...');
  try {
    const userId = firebase.auth().currentUser.uid;
    const data = {
      displayName: 'Admin User',
      role: 'admin',
      loginTime: Date.now(),
      lastActivityTime: Date.now(),
      online: true,
      status: 'invalid_status'  // Invalid
    };
    await firebase.database().ref(`presence/${userId}`).set(data);
    console.log('✗ Test 3 FAILED: Invalid status was accepted');
    testResults.push({ test: 'Invalid status rejected', status: 'FAIL', reason: 'Invalid status accepted' });
  } catch (error) {
    if (error.message.includes('validation')) {
      console.log('✓ Test 3 PASSED: Invalid status correctly rejected');
      testResults.push({ test: 'Invalid status rejected', status: 'PASS' });
    } else {
      console.log('✗ Test 3 FAILED:', error.message);
      testResults.push({ test: 'Invalid status rejected', status: 'FAIL', error: error.message });
    }
  }
  
  // Test 4: Missing fields rejected
  console.log('\nTest 4: Missing required fields rejected...');
  try {
    const userId = firebase.auth().currentUser.uid;
    const data = {
      displayName: 'Admin User',
      role: 'admin'
      // Missing: loginTime, lastActivityTime, online, status
    };
    await firebase.database().ref(`presence/${userId}`).set(data);
    console.log('✗ Test 4 FAILED: Incomplete data was accepted');
    testResults.push({ test: 'Missing fields rejected', status: 'FAIL', reason: 'Incomplete data accepted' });
  } catch (error) {
    if (error.message.includes('validation') || error.message.includes('child')) {
      console.log('✓ Test 4 PASSED: Missing fields correctly rejected');
      testResults.push({ test: 'Missing fields rejected', status: 'PASS' });
    } else {
      console.log('✗ Test 4 FAILED:', error.message);
      testResults.push({ test: 'Missing fields rejected', status: 'FAIL', error: error.message });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('TEST SUMMARY');
  console.log('='.repeat(50));
  testResults.forEach(result => {
    const icon = result.status === 'PASS' ? '✓' : '✗';
    console.log(`${icon} ${result.test}: ${result.status}`);
    if (result.error) console.log(`  Error: ${result.error}`);
    if (result.reason) console.log(`  Reason: ${result.reason}`);
  });
  
  const passCount = testResults.filter(r => r.status === 'PASS').length;
  console.log(`\nTotal: ${passCount}/${testResults.length} tests passed`);
}

// Run all tests
runAllTests();
```

---

## Integration with PresenceService

### Task 6.1: PresenceService Implementation

The RTDB rules are designed specifically for the PresenceService implementation (task 6.1). Each service method must comply with the security rules.

### Methods Integration

#### Method 1: recordLogin()

```javascript
// PresenceService method
async recordLogin(userId, displayName, role) {
  const presenceData = {
    displayName,           // Must be 1-255 chars
    role,                  // Must be valid role
    loginTime: Date.now(), // Current time (ms)
    lastActivityTime: Date.now(), // Same as loginTime initially
    online: true,          // User just logged in
    status: 'active'       // User is active
  };
  
  // This write will PASS if:
  // ✓ User is authenticated (auth.uid = userId)
  // ✓ All 6 fields present with correct types
  // ✓ Field values match validation rules
  
  return firebase.database()
    .ref(`presence/${userId}`)
    .set(presenceData);
}
```

#### Method 2: recordActivity()

```javascript
// PresenceService method
async recordActivity(userId) {
  const currentTime = Date.now();
  
  // This update will PASS if:
  // ✓ User is authenticated (auth.uid = userId)
  // ✓ currentTime >= loginTime (enforced by rule)
  
  return firebase.database()
    .ref(`presence/${userId}/lastActivityTime`)
    .set(currentTime);
}
```

#### Method 3: updateInactivityStatus()

```javascript
// PresenceService method
async updateInactivityStatus(userId) {
  // This update will PASS if:
  // ✓ User is authenticated (auth.uid = userId)
  // ✓ status value is one of: active, away, idle, offline
  
  return firebase.database()
    .ref(`presence/${userId}/status`)
    .set('away');
}
```

#### Method 4: recordLogout()

```javascript
// PresenceService method
async recordLogout(userId) {
  // This delete will PASS if:
  // ✓ User is authenticated (auth.uid = userId)
  
  return firebase.database()
    .ref(`presence/${userId}`)
    .remove();
}
```

#### Method 5: getActiveUsers()

```javascript
// PresenceService method
async getActiveUsers() {
  // This read will PASS if:
  // ✓ User is authenticated (auth != null)
  
  const snapshot = await firebase.database()
    .ref('presence')
    .once('value');
  
  // All returned records are validated by RTDB rules
  return snapshot.val() || {};
}
```

### Validation Compliance

When implementing PresenceService methods:

```
✓ Rule Check 1: Authentication
  - All operations require firebase.auth().currentUser

✓ Rule Check 2: User Ownership
  - Write operations use auth.uid as userId
  - Read operations don't have ownership requirement

✓ Rule Check 3: Field Validation
  - All 6 fields present for write/set operations
  - Field values match allowed types and values
  - Temporal constraint: lastActivityTime >= loginTime

✓ Rule Check 4: Data Structure
  - No extra fields added to presence record
  - Exactly 6 fields for valid record

✓ Rule Check 5: Value Constraints
  - displayName: 1-255 characters
  - role: one of 10 valid roles
  - status: one of 4 valid statuses
  - timestamps: non-negative integers
```

---

## Monitoring & Maintenance

### Daily Monitoring

#### 1. Check Firebase Console

```
In Firebase Console → Realtime Database:
1. Click "Realtime" tab
2. Monitor metrics:
   - Read operations count
   - Write operations count
   - Database size
   - Permission denials
```

**What to look for**:
- Unusual spikes in operation counts
- Increasing permission denial rate
- Database size growing unexpectedly

#### 2. Monitor Error Rates

```
Expected behavior:
- Permission denials: Low (only unauthorized attempts)
- Validation failures: Low (only malformed requests)
- Network errors: Minimal (normal connectivity)

Warning signs:
- High permission denial rate → Check auth implementation
- Increasing validation failures → Check PresenceService
- Frequent network errors → Check connectivity
```

### Weekly Monitoring

#### 1. Review Performance

```
Check:
- Average read response time
- Average write response time
- Database operation trends
- Presence record quality
```

#### 2. Verify Data Quality

```
Sample presence records:
✓ All 6 fields present
✓ Field values correct types
✓ No orphaned records
✓ Temporal constraints maintained
```

### Monthly Maintenance

#### 1. Rule Review

```
- Review RTDB security rules
- Check for any needed updates
- Verify alignment with requirements
```

#### 2. Documentation Update

```
- Update monitoring logs
- Document any issues encountered
- Record deployment changes
```

#### 3. Backup Rules

```
- Export current rules
- Save to dated backup file
- Store with previous backups
```

---

## Troubleshooting & Support

### Common Issues and Solutions

#### Issue 1: "Permission denied" errors

**Symptoms**:
- Users cannot write to presence
- Reads fail unexpectedly
- All operations return permission error

**Causes**:
1. User not authenticated
2. User UID doesn't match record key
3. Firebase initialization incomplete

**Resolution**:

```javascript
// 1. Verify user is authenticated
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log('✓ Authenticated as:', user.uid);
  } else {
    console.log('✗ Not authenticated - sign in required');
  }
});

// 2. Verify correct user ID is used
const userId = firebase.auth().currentUser.uid;
console.log('✓ User ID for RTDB:', userId);

// 3. Check Firebase initialization
if (firebase.database) {
  console.log('✓ Firebase Database initialized');
} else {
  console.log('✗ Firebase not properly initialized');
}
```

---

#### Issue 2: "Validation failed" errors

**Symptoms**:
- Writes fail with validation message
- Presence data not being created
- Field-level updates fail

**Causes**:
1. Missing required fields
2. Field type mismatch
3. Invalid enum values
4. Field value out of range

**Resolution**:

```javascript
// Check data structure before writing
const requiredFields = [
  'displayName',
  'role',
  'loginTime',
  'lastActivityTime',
  'online',
  'status'
];

const presenceData = {
  displayName: 'User Name',        // String, 1-255
  role: 'admin',                   // Valid role enum
  loginTime: Date.now(),           // Number
  lastActivityTime: Date.now(),    // Number >= loginTime
  online: true,                    // Boolean
  status: 'active'                 // Valid status enum
};

// Validate before writing
function validatePresenceData(data) {
  const errors = [];
  
  // Check all fields present
  requiredFields.forEach(field => {
    if (!(field in data)) {
      errors.push(`Missing field: ${field}`);
    }
  });
  
  // Check types
  if (typeof data.displayName !== 'string') {
    errors.push('displayName must be string');
  }
  if (data.displayName.length < 1 || data.displayName.length > 255) {
    errors.push('displayName must be 1-255 characters');
  }
  
  // Check role is valid
  const validRoles = ['admin', 'accountant', 'affiliate', 'BDE', 'BDO', 'CFO', 'CGO', 'CMO', 'arrival_manager', 'assistant_manager'];
  if (!validRoles.includes(data.role)) {
    errors.push(`role must be one of: ${validRoles.join(', ')}`);
  }
  
  // Check times are numbers
  if (typeof data.loginTime !== 'number' || typeof data.lastActivityTime !== 'number') {
    errors.push('loginTime and lastActivityTime must be numbers');
  }
  
  // Check temporal constraint
  if (data.lastActivityTime < data.loginTime) {
    errors.push('lastActivityTime must be >= loginTime');
  }
  
  // Check online is boolean
  if (typeof data.online !== 'boolean') {
    errors.push('online must be boolean');
  }
  
  // Check status is valid
  const validStatuses = ['active', 'away', 'idle', 'offline'];
  if (!validStatuses.includes(data.status)) {
    errors.push(`status must be one of: ${validStatuses.join(', ')}`);
  }
  
  return errors;
}

// Use validation before writing
const errors = validatePresenceData(presenceData);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
} else {
  // Write is safe to proceed
  firebase.database().ref(`presence/${userId}`).set(presenceData);
}
```

---

#### Issue 3: "Unauthenticated user" cannot access presence

**Symptoms**:
- Cannot read presence list
- Always get "permission denied"
- No data returned

**Causes**:
1. User not signed in
2. Auth token expired
3. Auth not initialized before RTDB access

**Resolution**:

```javascript
// 1. Ensure user is signed in first
async function accessPresence() {
  try {
    // Wait for authentication
    const user = firebase.auth().currentUser;
    if (!user) {
      console.log('No user - attempting sign in');
      await firebase.auth().signInWithEmailAndPassword(email, password);
    }
    
    // Now access presence
    const snapshot = await firebase.database().ref('presence').once('value');
    return snapshot.val();
  } catch (error) {
    console.error('Error:', error);
  }
}

// 2. Or use auth state listener
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    console.log('Authenticated - can now access presence');
    try {
      const snapshot = await firebase.database().ref('presence').once('value');
      console.log('Presence data:', snapshot.val());
    } catch (error) {
      console.error('Error reading presence:', error);
    }
  } else {
    console.log('Not authenticated - need to sign in');
  }
});
```

---

#### Issue 4: "lastActivityTime < loginTime" validation fails

**Symptoms**:
- Activity update fails
- Records show old times
- Temporal validation error

**Causes**:
1. System clock issues
2. Using incorrect timestamps
3. Time values from past

**Resolution**:

```javascript
// Use current time, not stored time
async function recordActivity(userId) {
  // ✗ WRONG - using old time
  // const activityTime = someStoredTime;
  
  // ✓ CORRECT - use current time
  const activityTime = Date.now();
  
  try {
    await firebase.database()
      .ref(`presence/${userId}/lastActivityTime`)
      .set(activityTime);
    console.log('✓ Activity recorded');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Verify timestamp logic
const loginTime = Date.now();
console.log('Login time:', loginTime);

// Wait a moment
await new Promise(resolve => setTimeout(resolve, 100));

const activityTime = Date.now();
console.log('Activity time:', activityTime);
console.log('Temporal constraint met:', activityTime >= loginTime); // Should be true
```

---

### Getting Help

**For rule syntax issues**:
- See: `RTDB_SECURITY_RULES_GUIDE.md`
- Check: Firebase documentation at https://firebase.google.com/docs/rules

**For integration issues**:
- See: `PRESENCE_SERVICE_RTDB_INTEGRATION.md`
- Check: Code examples for PresenceService methods

**For deployment issues**:
- See: `RTDB_DEPLOYMENT_CHECKLIST.md`
- Section: Troubleshooting (has detailed solutions)

**For monitoring**:
- Firebase Console → Realtime Database → Realtime tab
- Check: Performance metrics and operation counts

---

## Rollback Procedure

If you need to revert to previous rules:

### Option 1: Firebase Console Version History

```
1. In Firebase Console, go to Realtime Database
2. Click "Rules" tab
3. Look for version history button (clock icon or similar)
4. Select a previous version
5. Review differences
6. Click "Restore" or "Publish this version"
7. Confirm the action
```

### Option 2: Restore From Backup File

```
1. Open firebase-rtdb-rules-backup-[DATE].json
2. Copy all content
3. In Firebase Console Rules editor
4. Select all and delete
5. Paste backup content
6. Click "Publish"
```

### Option 3: Restore Original Rules (If Needed)

```
If you have the original rules before our deployment:
1. Follow Option 2 above
2. Use your saved backup file
3. Publish
```

---

## Next Steps

1. **Immediate**: Follow deployment checklist
2. **After deployment**: Run verification tests
3. **During task 6.1**: Implement PresenceService
4. **Post-implementation**: Monitor Firebase Console
5. **Ongoing**: Monthly rule reviews and backups

---

## Sign-Off Checklist

- [ ] All files reviewed and understood
- [ ] Backup created before deployment
- [ ] Rules deployed to Firebase Console
- [ ] Post-deployment verification completed
- [ ] All 6 tests passed successfully
- [ ] Monitoring procedures documented
- [ ] Team notified of deployment
- [ ] Integration with PresenceService planned

---

## Conclusion

Task 1.3 is complete with comprehensive RTDB security rules ready for deployment. All documentation, integration guides, and testing procedures are in place.

**Status**: ✅ **READY FOR DEPLOYMENT**

**Files**:
- ✅ firebase-rtdb-rules.json (production-ready)
- ✅ RTDB_SECURITY_RULES_GUIDE.md (reference)
- ✅ PRESENCE_SERVICE_RTDB_INTEGRATION.md (integration)
- ✅ RTDB_DEPLOYMENT_CHECKLIST.md (deployment)
- ✅ TASK_1_3_SUMMARY.md (executive summary)
- ✅ TASK_1_3_DEPLOYMENT_GUIDE.md (this guide)

**Proceed with Firebase Console deployment when ready.**

---

## Document Information

- **File**: TASK_1_3_DEPLOYMENT_GUIDE.md
- **Task**: 1.3 Define and deploy Realtime Database Security Rules
- **Requirements**: 7.5, 5.1
- **Status**: Complete
- **Version**: 1.0
- **Last Updated**: Current Session

