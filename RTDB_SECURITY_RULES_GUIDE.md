# Firebase Realtime Database Security Rules Guide

## Overview

This document outlines the security rules for the Firebase Realtime Database (RTDB) used in the ePay CRM system for managing real-time presence data. The rules enforce strict access control and data validation to ensure system integrity and security.

## Security Rules Architecture

### File Location
- **Rules File**: `firebase-rtdb-rules.json`
- **Format**: JSON with inline comments
- **Applicable Requirements**: 7.5, 5.1

## Rules Structure

### Root Level Protection
```
".read": false,
".write": false
```

All paths are protected by default. Specific permissions are granted only where needed.

---

## Presence Data Rules

### Path: `/presence`

#### Read Access
- **Rule**: `auth != null`
- **Description**: All authenticated users can read the entire presence list
- **Use Case**: Display active user list in the UI

#### Write Access
- **Rule**: `false` (disabled at parent level)
- **Description**: Direct writes to the presence parent are prevented

---

### Path: `/presence/{userId}`

#### Write Access (User-Scoped)
- **Rule**: `auth.uid === $userId`
- **Description**: Only the user corresponding to the userId can modify their own presence record
- **Security Benefit**: Prevents users from impersonating others or manipulating other users' presence data

#### Read Access
- **Rule**: `auth != null`
- **Description**: All authenticated users can read any presence record
- **Use Case**: Enable presence awareness across the system

#### Data Structure Validation
- **Validation Rule**: Presence records MUST contain exactly these 6 fields:
  1. `displayName` (string)
  2. `role` (string)
  3. `loginTime` (number)
  4. `lastActivityTime` (number)
  5. `online` (boolean)
  6. `status` (string)

---

## Field Validation Rules

### 1. displayName (String)
```
Validation: newData.isString() && newData.val().length > 0 && newData.val().length <= 255
```
- **Type**: String
- **Requirements**: Non-empty, max 255 characters
- **Example**: "John Doe", "Jane Smith"

### 2. role (String)
```
Validation: newData.isString() && (newData.val() === 'admin' || ... )
```
- **Type**: String (Enum)
- **Valid Values**:
  - `admin`
  - `accountant`
  - `affiliate`
  - `BDE`
  - `BDO`
  - `CFO`
  - `CGO`
  - `CMO`
  - `arrival_manager`
  - `assistant_manager`
- **Description**: Role must be one of the predefined roles
- **Example**: "admin", "accountant", "BDE"

### 3. loginTime (Number)
```
Validation: newData.isNumber() && newData.val() >= 0 && newData.val() === Math.floor(newData.val())
```
- **Type**: Integer (Unix timestamp in milliseconds)
- **Requirements**: Non-negative, whole number (no decimals)
- **Description**: Records the exact time when the user logged in
- **Example**: `1786648107305` (milliseconds since epoch)

### 4. lastActivityTime (Number)
```
Validation: newData.isNumber() && newData.val() >= 0 && newData.val() === Math.floor(newData.val()) && newData.val() >= root.child('presence').child($userId).child('loginTime').val()
```
- **Type**: Integer (Unix timestamp in milliseconds)
- **Requirements**: Non-negative, whole number, must be >= loginTime
- **Description**: Records the most recent activity timestamp; prevents time-travel attacks by ensuring it's always >= loginTime
- **Example**: `1786648110305` (must be >= loginTime)

### 5. online (Boolean)
```
Validation: newData.isBoolean()
```
- **Type**: Boolean
- **Valid Values**: `true` or `false`
- **Description**: Indicates whether the user is currently connected
- **Example**: `true` (user is online), `false` (user is offline)

### 6. status (String)
```
Validation: newData.isString() && (newData.val() === 'active' || newData.val() === 'away' || newData.val() === 'idle' || newData.val() === 'offline')
```
- **Type**: String (Enum)
- **Valid Values**:
  - `active` - User is actively using the system
  - `away` - User is idle for 15+ minutes
  - `idle` - User is idle but still online
  - `offline` - User is not connected
- **Description**: Presence status reflects user's activity level
- **Example**: "active", "away"

---

## Security Properties Enforced

### 1. Authentication Required
- Only authenticated Firebase users can read presence data
- Unauthenticated requests are denied

### 2. User-Scoped Write Access
- Users can only modify their own presence record
- Users cannot modify another user's presence record
- This prevents privilege escalation and data tampering

### 3. Data Integrity
- All 6 required fields must be present in each presence record
- Extra fields are rejected
- Field values must match their defined types and validation rules
- Invalid data is automatically rejected by Firebase

### 4. Temporal Integrity
- `lastActivityTime` cannot be earlier than `loginTime`
- This prevents inconsistent data states
- Helps detect and prevent tampered data

### 5. Enum Validation
- `role` values are restricted to valid CRM roles
- `status` values are restricted to valid presence statuses
- Invalid enum values are rejected

---

## Deployment Instructions

### Step 1: Access Firebase Console
1. Navigate to [Firebase Console](https://console.firebase.google.com)
2. Select your ePay CRM Firebase project

### Step 2: Navigate to Realtime Database
1. In the left sidebar, click **Realtime Database**
2. Select your database (usually named "default")
3. Click on the **Rules** tab at the top

### Step 3: Replace Existing Rules
1. Clear all existing rules
2. Copy the complete JSON from `firebase-rtdb-rules.json`
3. Paste the rules into the Firebase Console rule editor

### Step 4: Validate Rules
1. Firebase Console will automatically validate the JSON syntax
2. If errors are found, they'll be highlighted in red
3. Fix any syntax errors before proceeding

### Step 5: Publish Rules
1. Click the **Publish** button
2. Confirm the publication in the dialog that appears
3. Wait for the "Published" status message

### Step 6: Verify Deployment
1. Check that the rules are active in the Rules tab
2. The rule content should match your deployment
3. Rules take effect immediately upon publication

---

## Testing the Rules

### Test Scenario 1: Authorized User Write
```javascript
// User uid: "user123" writing their own presence record
const userId = "user123";
const data = {
  displayName: "John Doe",
  role: "admin",
  loginTime: Date.now(),
  lastActivityTime: Date.now(),
  online: true,
  status: "active"
};
firebase.database().ref(`presence/${userId}`).set(data);
// ✓ SUCCEEDS (user owns this record)
```

### Test Scenario 2: Unauthorized User Write
```javascript
// User uid: "user123" trying to write another user's record
const targetUserId = "user456";
const data = { /* ... */ };
firebase.database().ref(`presence/${targetUserId}`).set(data);
// ✗ FAILS (Permission denied - user does not own this record)
```

### Test Scenario 3: Invalid Status Value
```javascript
// Attempting to set invalid status value
const userId = "user123";
const data = {
  displayName: "John Doe",
  role: "admin",
  loginTime: Date.now(),
  lastActivityTime: Date.now(),
  online: true,
  status: "disconnected"  // Invalid - not in allowed values
};
firebase.database().ref(`presence/${userId}`).set(data);
// ✗ FAILS (Validation failed - status must be active, away, idle, or offline)
```

### Test Scenario 4: Missing Required Field
```javascript
// Attempting to write incomplete presence record
const userId = "user123";
const data = {
  displayName: "John Doe",
  role: "admin",
  loginTime: Date.now(),
  // Missing: lastActivityTime, online, status
};
firebase.database().ref(`presence/${userId}`).set(data);
// ✗ FAILS (Validation failed - missing required fields)
```

### Test Scenario 5: Unauthorized Read Attempt
```javascript
// Unauthenticated user attempting to read presence data
firebase.database().ref('presence').once('value');
// ✗ FAILS (Permission denied - user must be authenticated)
```

### Test Scenario 6: Authorized Read Access
```javascript
// Authenticated user reading presence data
firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
  firebase.database().ref('presence').once('value', (snapshot) => {
    console.log(snapshot.val()); // Lists all online users
  });
});
// ✓ SUCCEEDS (authenticated user can read presence list)
```

---

## Monitoring and Maintenance

### Monitoring Rules Performance
1. In Firebase Console, go to **Database → Realtime** tab
2. Check **Performance** metrics for:
   - Read/Write operations
   - Rule violation rates
   - Database size

### Common Issues and Resolutions

#### Issue: "Permission denied" on all writes
- **Cause**: User UID doesn't match the presence record key
- **Resolution**: Ensure the presence record key matches `auth.uid`

#### Issue: "Validation failed" errors
- **Cause**: Data doesn't match validation rules
- **Resolution**: Check field types and enum values against rules

#### Issue: lastActivityTime validation fails
- **Cause**: lastActivityTime is less than loginTime
- **Resolution**: Ensure lastActivityTime >= loginTime

#### Issue: Role validation fails
- **Cause**: Role value not in the allowed list
- **Resolution**: Use only valid roles: admin, accountant, affiliate, BDE, BDO, CFO, CGO, CMO, arrival_manager, assistant_manager

---

## Integration with Presence Service

The PresenceService (from task 6.1) will use these rules when:

1. **recordLogin()**: Creates a new presence record with all 6 required fields
2. **recordActivity()**: Updates `lastActivityTime` (must remain >= `loginTime`)
3. **updateInactivityStatus()**: Changes `status` to "away" after 15 minutes
4. **recordLogout()**: Deletes the presence record

Each operation must comply with the validation rules or will be rejected.

---

## Security Best Practices

1. **Principle of Least Privilege**: Users can only modify their own records
2. **Data Validation**: All fields are validated at the database level
3. **Authentication Requirement**: All operations require Firebase authentication
4. **Immutable Timestamps**: Temporal relationships (lastActivityTime >= loginTime) are enforced
5. **Schema Enforcement**: Exact field requirements prevent data corruption

---

## References

- Firebase Realtime Database Documentation: https://firebase.google.com/docs/database
- Firebase Security Rules: https://firebase.google.com/docs/rules
- ePay CRM Firebase Migration Spec: Requirements 7.5, 5.1
