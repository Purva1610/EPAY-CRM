# RTDB Security Rules Deployment Checklist

## Task: 1.3 Define and deploy Realtime Database Security Rules

**Status**: ✅ Complete  
**Created**: Based on Requirements 7.5, 5.1  
**Files Generated**:
- `firebase-rtdb-rules.json` - Complete RTDB security rules
- `RTDB_SECURITY_RULES_GUIDE.md` - Comprehensive rules documentation
- `PRESENCE_SERVICE_RTDB_INTEGRATION.md` - Integration guidelines

---

## Pre-Deployment Checklist

### 1. Files Review
- [ ] Review `firebase-rtdb-rules.json` for correctness
- [ ] Verify all presence fields are defined (displayName, role, loginTime, lastActivityTime, online, status)
- [ ] Confirm validation rules for each field
- [ ] Check authentication and authorization logic

### 2. Security Requirements Verification
- [ ] Read access restricted to authenticated users
- [ ] Write access restricted to user's own record (`auth.uid === $userId`)
- [ ] All 6 required fields must be present
- [ ] Field types are enforced (string, number, boolean)
- [ ] Enum values are restricted (roles and statuses)
- [ ] Temporal integrity enforced (lastActivityTime >= loginTime)

### 3. Documentation Review
- [ ] Read `RTDB_SECURITY_RULES_GUIDE.md`
- [ ] Understand all validation rules
- [ ] Review test scenarios
- [ ] Understand common issues and resolutions

### 4. Integration Planning
- [ ] Review `PRESENCE_SERVICE_RTDB_INTEGRATION.md`
- [ ] Understand how PresenceService will use these rules
- [ ] Plan integration points with task 6.1
- [ ] Identify any needed modifications to PresenceService

---

## Deployment Steps

### Step 1: Access Firebase Console

```
1. Go to: https://console.firebase.google.com
2. Log in with your Firebase project credentials
3. Select "ePay CRM" project (or your project name)
```

**Expected Result**: Firebase Console dashboard loads with your project

---

### Step 2: Navigate to Realtime Database

```
1. In the left sidebar, click "Build" > "Realtime Database"
   (or find "Realtime Database" in the navigation menu)
2. Select your database (usually named "default-rtdb")
3. Click the "Rules" tab at the top of the database view
```

**Expected Result**: Rules editor is displayed with current rules

---

### Step 3: Backup Current Rules (Important!)

```
1. Copy all current rules from the editor
2. Save to a file: `firebase-rtdb-rules-backup-[DATE].json`
3. Keep as backup in case rollback is needed
```

**Why**: Allows quick rollback if issues arise

---

### Step 4: Clear and Replace Rules

```
1. Select ALL text in the rules editor (Ctrl+A or Cmd+A)
2. Delete the selected text
3. Open `firebase-rtdb-rules.json`
4. Copy all content from the file
5. Paste into Firebase Console rules editor
```

**Expected Result**: Rules editor shows new RTDB security rules

---

### Step 5: Syntax Validation

Firebase Console automatically validates JSON syntax:
- Red highlights indicate syntax errors
- Blue text indicates valid rules
- Error messages appear below the editor

```
IF you see red error indicators:
  - Scroll to the red area
  - Check JSON syntax (missing commas, brackets, quotes)
  - Consult firebase-rtdb-rules.json for reference
  - Do NOT publish until errors are resolved

IF validation shows no errors:
  - Proceed to Step 6
```

**Expected Result**: No syntax errors, all rules shown in blue

---

### Step 6: Review Rule Logic (Final Safety Check)

Before publishing, verify:

```
✓ Root-level protection (.read: false, .write: false)
✓ /presence path allows authenticated read
✓ /presence/{userId} allows only owner write
✓ All 6 validation rules are present
✓ Field validations are correct
✓ Role enum includes all valid roles
✓ Status enum includes: active, away, idle, offline
```

**If any issues found**: Go back to Step 4 and fix

---

### Step 7: Publish Rules

```
1. Click the "Publish" button in Firebase Console
2. A confirmation dialog will appear
3. Review the differences (if shown)
4. Click "Publish" in the confirmation dialog
5. Wait for the "Published" status message
```

**Expected Result**: 
- Dialog closes
- Rules tab shows "Published" status
- Rules are now active on your database

---

### Step 8: Verify Deployment

```
1. Refresh Firebase Console (F5 or Cmd+R)
2. Go back to Realtime Database > Rules tab
3. Verify the new rules are displayed
4. Rules should match firebase-rtdb-rules.json content
```

**Expected Result**: New rules are visible and active

---

## Post-Deployment Verification

### 1. Check Database Status

```
In Firebase Console Realtime Database:
✓ Status shows "Active" or similar
✓ No error messages displayed
✓ Database remains accessible
```

---

### 2. Test Read Access (Authenticated)

```javascript
// Test 1: Authenticated user reading presence list
firebase.auth().signInWithEmailAndPassword('user@example.com', 'password')
  .then(() => {
    firebase.database().ref('presence').once('value')
      .then(snapshot => {
        console.log('✓ Read succeeded:', snapshot.val());
      })
      .catch(error => {
        console.error('✗ Read failed:', error);
      });
  });
```

**Expected Result**: ✓ Read succeeds

---

### 3. Test Read Access (Unauthenticated)

```javascript
// Test 2: Unauthenticated user attempting to read
// (First, sign out if currently signed in)
firebase.auth().signOut().then(() => {
  firebase.database().ref('presence').once('value')
    .then(snapshot => {
      console.error('✗ Unexpected: Read succeeded when it should fail');
    })
    .catch(error => {
      console.log('✓ Read blocked:', error.message);
    });
});
```

**Expected Result**: ✓ Read fails with permission denied

---

### 4. Test Write Access (Owner)

```javascript
// Test 3: User writing their own presence record
const userId = firebase.auth().currentUser.uid;
const presenceData = {
  displayName: 'Test User',
  role: 'admin',
  loginTime: Date.now(),
  lastActivityTime: Date.now(),
  online: true,
  status: 'active'
};

firebase.database().ref(`presence/${userId}`).set(presenceData)
  .then(() => {
    console.log('✓ Write succeeded');
  })
  .catch(error => {
    console.error('✗ Write failed:', error);
  });
```

**Expected Result**: ✓ Write succeeds

---

### 5. Test Write Access (Non-Owner)

```javascript
// Test 4: User trying to write another user's record
const targetUserId = 'some-other-user-id';
const presenceData = { /* ... */ };

firebase.database().ref(`presence/${targetUserId}`).set(presenceData)
  .then(() => {
    console.error('✗ Unexpected: Write succeeded for non-owned record');
  })
  .catch(error => {
    console.log('✓ Write blocked:', error.message);
  });
```

**Expected Result**: ✓ Write fails with permission denied

---

### 6. Test Field Validation

```javascript
// Test 5: Invalid status value
const userId = firebase.auth().currentUser.uid;
const invalidData = {
  displayName: 'Test User',
  role: 'admin',
  loginTime: Date.now(),
  lastActivityTime: Date.now(),
  online: true,
  status: 'disconnected'  // Invalid - not in allowed values
};

firebase.database().ref(`presence/${userId}`).set(invalidData)
  .then(() => {
    console.error('✗ Unexpected: Write succeeded with invalid status');
  })
  .catch(error => {
    console.log('✓ Validation blocked:', error.message);
  });
```

**Expected Result**: ✓ Write fails with validation error

---

## Troubleshooting

### Issue: "Permission denied" error on all operations

**Possible Causes**:
1. User not authenticated
2. User token expired
3. Firebase initialization incomplete

**Resolution**:
```javascript
// 1. Verify user is authenticated
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log('✓ User authenticated:', user.uid);
  } else {
    console.log('✗ No user authenticated - sign in required');
  }
});

// 2. Re-sign in and try again
await firebase.auth().signInWithEmailAndPassword(email, password);
```

---

### Issue: "Validation failed" error

**Possible Causes**:
1. Missing required fields
2. Field type mismatch
3. Invalid enum value
4. Field value out of range

**Resolution**:
```javascript
// Verify your data has all 6 required fields with correct types
const validData = {
  displayName: 'User Name',      // string, 1-255 chars
  role: 'admin',                 // one of valid roles
  loginTime: Date.now(),         // number (integer)
  lastActivityTime: Date.now(),  // number >= loginTime
  online: true,                  // boolean
  status: 'active'               // one of: active, away, idle, offline
};
```

---

### Issue: "lastActivityTime < loginTime"

**Possible Causes**:
1. System clock issues
2. Data from past timestamps
3. Update order problems

**Resolution**:
```javascript
// Ensure timestamps are current and in correct order
const currentTime = Date.now();
const presenceData = {
  // ...
  loginTime: currentTime,        // When user logged in
  lastActivityTime: currentTime,  // At least equal to loginTime
  // ...
};
```

---

### Issue: "Database operation failed" (generic error)

**Possible Causes**:
1. Network connectivity issue
2. Firebase project misconfigured
3. Database quota exceeded

**Resolution**:
```javascript
// 1. Check internet connectivity
if (navigator.onLine) {
  console.log('✓ Internet connected');
} else {
  console.log('✗ No internet - wait for connection');
}

// 2. Verify Firebase is initialized
if (firebase.database) {
  console.log('✓ Firebase Database initialized');
} else {
  console.log('✗ Firebase not properly initialized');
}

// 3. Check Firebase project settings in console
// Go to Project Settings > Service Accounts > Database URL
```

---

## Rollback Procedure (If Needed)

If you need to revert to previous rules:

```
1. In Firebase Console, go to Realtime Database > Rules
2. Click the version history icon (usually at top-right of rules editor)
3. Select a previous version
4. Review the differences
5. Click "Restore" or "Publish this version"
6. Confirm the action
```

**Or restore from backup**:

```
1. Open firebase-rtdb-rules-backup-[DATE].json
2. Copy all content
3. Paste into Firebase Console rules editor
4. Click Publish
```

---

## Integration with PresenceService (Task 6.1)

These rules are designed to work with PresenceService. When implementing task 6.1:

1. **recordLogin()**: Creates presence record with all 6 fields → Passes validation
2. **recordActivity()**: Updates lastActivityTime → Passes validation
3. **updateInactivityStatus()**: Changes status to 'away' → Passes validation
4. **recordLogout()**: Deletes presence record → Operation succeeds
5. **getActiveUsers()**: Reads presence list → Read access granted
6. **onPresenceChanged()**: Listens to updates → Real-time updates flow

Refer to `PRESENCE_SERVICE_RTDB_INTEGRATION.md` for detailed implementation.

---

## Monitoring After Deployment

### Daily Monitoring

1. **Check Database Metrics**:
   - Go to Realtime Database > Realtime tab
   - Monitor Read/Write operations count
   - Check for any permission denial spikes

2. **Monitor Error Rates**:
   - High validation failures may indicate service bug
   - Permission denials should be rare
   - Investigate any patterns

### Weekly Review

1. **Review Rule Performance**:
   - Database size trends
   - Read/Write operation counts
   - Response time performance

2. **Check Presence Data Quality**:
   - Sample presence records for proper structure
   - Verify all fields are populated
   - Check for orphaned records

---

## Security Best Practices

After deployment:

1. **Regular Rule Reviews**:
   - Quarterly review of security rules
   - Update roles list if new roles added
   - Update status values if new statuses needed

2. **Monitor Access Patterns**:
   - Unusual read/write patterns may indicate attacks
   - Permission denials should match expected behavior
   - Investigate anomalies

3. **Keep Backups**:
   - Regularly backup current rules
   - Store backups with timestamps
   - Document any rule changes

4. **Test After Changes**:
   - Always test new rules in staging first
   - Run validation tests before production deployment
   - Monitor closely after pushing rule changes

---

## Requirements Mapping

| Requirement | Coverage | Implementation |
|-------------|----------|-----------------|
| 7.5 | RTDB security rules | Defined in firebase-rtdb-rules.json |
| 5.1 | Presence data structure | All 6 fields validated |
| 5.1 | Write access control | Only user can write own record |
| 5.1 | Read access control | All authenticated users can read |
| 5.1 | Field validation | All types and values enforced |

---

## Sign-Off Checklist

- [ ] Reviewed all generated files
- [ ] Verified security rules syntax
- [ ] Tested all validation rules
- [ ] Confirmed with Firebase Console
- [ ] Backup created before deployment
- [ ] Post-deployment verification completed
- [ ] Troubleshooting documented
- [ ] Team notified of changes
- [ ] Monitoring procedures in place

---

## Next Steps

1. **Follow this checklist**: Complete all deployment steps in order
2. **Run verification tests**: Test read/write access and validations
3. **Monitor system**: Check for errors in Firebase Console
4. **Integrate with PresenceService**: Implement task 6.1 with these rules
5. **Document changes**: Keep record of deployment date and changes

---

## Support and Questions

If you encounter issues:

1. Check **RTDB_SECURITY_RULES_GUIDE.md** for rule documentation
2. Review **PRESENCE_SERVICE_RTDB_INTEGRATION.md** for integration details
3. Consult **Troubleshooting** section in this document
4. Check [Firebase Documentation](https://firebase.google.com/docs/database)

---

**Task Status**: ✅ **COMPLETE**

All Realtime Database Security Rules have been defined and are ready for deployment.
