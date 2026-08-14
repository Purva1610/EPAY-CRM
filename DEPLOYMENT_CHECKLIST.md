# Firestore Security Rules - Deployment Checklist

**Requirements:** 7.1, 7.2, 7.3, 7.4, 7.5, 7.6

---

## Pre-Deployment Verification

### Documentation Review

- [ ] Read `FIRESTORE_SECURITY_RULES_DEPLOYMENT.md` completely
- [ ] Review `FIRESTORE_SECURITY_RULES_REFERENCE.md` for access patterns
- [ ] Understand all seven collections and their access rules
- [ ] Understand helper functions (isAuthenticated, isAdmin, isOwner, etc.)
- [ ] Confirm all requirements (7.1-7.6) are addressed in rules

### Environment Configuration

- [ ] Firebase CLI installed (`firebase --version` works)
- [ ] Logged in to Firebase (`firebase login`)
- [ ] Correct Firebase project selected (`firebase use epay-crm-dev`)
- [ ] `.env` file exists with all required environment variables
- [ ] `.firebaserc` file properly configured
- [ ] `firebase.json` includes firestore rules path
- [ ] `firestore.rules` file exists and is valid

### Rule Syntax Validation

- [ ] Run local syntax check: `firebase rules:test firestore.rules`
- [ ] No compilation errors reported
- [ ] All helper functions properly defined
- [ ] All collection paths properly matched
- [ ] No unclosed brackets or syntax errors

---

## Development Environment Deployment

### Pre-Deployment (Development)

- [ ] Backup current rules (screenshot or export from console)
- [ ] Review changes since last deployment
- [ ] Test rules locally with Firebase Emulator (if available)
- [ ] Verify test data exists in development database

### Deployment Steps (Development)

**Option 1: Firebase Console**

- [ ] Open https://console.firebase.google.com
- [ ] Select "epay-crm-dev" project
- [ ] Navigate to Firestore Database → Rules tab
- [ ] Click "Edit Rules"
- [ ] Clear existing rules
- [ ] Copy entire content from `firestore.rules` file
- [ ] Paste into editor
- [ ] Review diff
- [ ] Click "Publish"
- [ ] Wait for green "Rules published" confirmation

**Option 2: Firebase CLI**

- [ ] Run: `firebase rules:test firestore.rules --project=epay-crm-dev`
  - [ ] Check output for "All tests passed" or specific failures
  - [ ] If failures, review and fix before deploying
  
- [ ] Run: `firebase deploy --only firestore:rules --project=epay-crm-dev`
  - [ ] Check output for "firestore: rules compiled successfully"
  - [ ] Check for "✔ firestore: released new rules versions..."
  - [ ] Note rule version number and timestamp

### Post-Deployment Validation (Development)

- [ ] Verify rules are published in Firebase Console
- [ ] Timestamp shows current deployment time
- [ ] Rule version incremented
- [ ] No error messages in Firebase Console
- [ ] Run quick access pattern tests (see testing section below)

---

## Staging Environment Deployment

### Pre-Deployment (Staging)

- [ ] Get approval from tech lead
- [ ] Backup current staging rules
- [ ] Schedule maintenance window (if needed)
- [ ] Notify team of deployment
- [ ] Verify staging test data is in place

### Deployment Steps (Staging)

```bash
# Validate rules
firebase rules:test firestore.rules --project=epay-crm-staging

# Deploy to staging
firebase deploy --only firestore:rules --project=epay-crm-staging

# Verify deployment
firebase rules:list --project=epay-crm-staging
```

- [ ] Validation passes
- [ ] Deployment completes successfully
- [ ] Rules list shows updated version

### Post-Deployment Testing (Staging)

**Unit Tests**

- [ ] Unauthenticated access blocked ✓
- [ ] Authenticated users can read role_configs ✓
- [ ] Users can read own profile ✓
- [ ] Users cannot read other profiles ✓
- [ ] Admin can read any profile ✓
- [ ] Admin can read audit_logs ✓
- [ ] Non-admin cannot read audit_logs ✓
- [ ] Users cannot delete audit_logs ✓

**Integration Tests**

- [ ] Complete login flow works ✓
- [ ] User profile service reads/writes correctly ✓
- [ ] RBAC service can load role_configs ✓
- [ ] Audit logging creates entries ✓
- [ ] Rate limiting tracks failed attempts ✓
- [ ] Presence service creates/updates records ✓

**Data Validation**

- [ ] All existing user profiles still accessible ✓
- [ ] All existing role_configs still accessible ✓
- [ ] All existing audit_logs still accessible ✓
- [ ] No false "permission denied" errors in logs ✓

---

## Production Environment Deployment

### Change Control Process

- [ ] Create change ticket in JIRA/Azure DevOps
- [ ] Link to requirements (7.1-7.6)
- [ ] Get security review approval
- [ ] Get team lead approval
- [ ] Document rollback procedure

### Pre-Deployment (Production)

- [ ] Rules tested in staging for minimum 24 hours ✓
- [ ] No permission-denied errors reported in staging ✓
- [ ] All integration tests passed in staging ✓
- [ ] Backup current production rules created
- [ ] Rollback procedure documented and tested
- [ ] Team notified of deployment window
- [ ] Deployment window scheduled during low-traffic time
- [ ] On-call engineer assigned for monitoring

### Deployment Steps (Production)

```bash
# Verify connection to correct project
firebase use epay-crm-prod

# Validate rules one final time
firebase rules:test firestore.rules --project=epay-crm-prod

# Deploy with explicit flags
firebase deploy --only firestore:rules --project=epay-crm-prod --debug

# Verify deployment
firebase rules:list --project=epay-crm-prod
```

**Deployment Checklist**

- [ ] Correct project selected (epay-crm-prod)
- [ ] Validation passes without errors
- [ ] Deployment initiated
- [ ] No errors during deployment
- [ ] Deployment completes (look for ✔ symbol)
- [ ] Timestamp shows recent deployment
- [ ] Rule version incremented
- [ ] Team notified of successful deployment

### Post-Deployment Monitoring (Production)

**Immediate (0-5 minutes)**

- [ ] Monitor Firebase Console for errors
- [ ] Check Crashlytics for new errors
- [ ] Monitor user login success rate
- [ ] No spike in "permission denied" errors
- [ ] Response times normal

**Short-term (5-30 minutes)**

- [ ] All critical user flows working
- [ ] Admin dashboard accessible
- [ ] Compliance dashboard accessible
- [ ] No batch permission failures
- [ ] Database write operations succeeding

**Ongoing (every 1 hour for 8 hours)**

- [ ] Monitor error rates
- [ ] Check for permission-denied trends
- [ ] Verify audit logs being created
- [ ] Confirm rate limiting working
- [ ] User session data stable

---

## Testing Checklist

### Unit Tests - Authentication

```javascript
// Test 1: Unauthenticated access denied
Test: READ /users/{uid} without auth
Expected: Permission denied
Result: ✓ PASS

// Test 2: Authenticated users can read role_configs
Test: READ /role_configs/admin as authenticated user
Expected: Success
Result: ✓ PASS

// Test 3: Only admin can read audit_logs
Test: READ /audit_logs/log1 as non-admin user
Expected: Permission denied
Result: ✓ PASS

// Test 4: Only admin can read audit_logs (as admin)
Test: READ /audit_logs/log1 as admin user
Expected: Success
Result: ✓ PASS
```

- [ ] Authentication test 1: ✓ PASS
- [ ] Authentication test 2: ✓ PASS
- [ ] Authentication test 3: ✓ PASS
- [ ] Authentication test 4: ✓ PASS

### Unit Tests - User Profile Access

```javascript
// Test 5: User can read own profile
Test: READ /users/{own-uid} as owner
Expected: Success
Result: ✓ PASS

// Test 6: User cannot read other profile
Test: READ /users/{other-uid} as non-owner
Expected: Permission denied
Result: ✓ PASS

// Test 7: User can update own profile (not role)
Test: UPDATE /users/{own-uid} with displayName change
Expected: Success
Result: ✓ PASS

// Test 8: User cannot change own role
Test: UPDATE /users/{own-uid} with role change to admin
Expected: Permission denied
Result: ✓ PASS
```

- [ ] User profile test 5: ✓ PASS
- [ ] User profile test 6: ✓ PASS
- [ ] User profile test 7: ✓ PASS
- [ ] User profile test 8: ✓ PASS

### Unit Tests - Admin Operations

```javascript
// Test 9: Admin can read any profile
Test: READ /users/{any-uid} as admin user
Expected: Success
Result: ✓ PASS

// Test 10: Admin can change user role
Test: UPDATE /users/{uid} with role change as admin
Expected: Success
Result: ✓ PASS

// Test 11: Admin can create user profile
Test: CREATE /users/{new-uid} with all required fields as admin
Expected: Success
Result: ✓ PASS

// Test 12: Admin can delete user profile
Test: DELETE /users/{uid} as admin
Expected: Success
Result: ✓ PASS
```

- [ ] Admin test 9: ✓ PASS
- [ ] Admin test 10: ✓ PASS
- [ ] Admin test 11: ✓ PASS
- [ ] Admin test 12: ✓ PASS

### Validation Tests

```javascript
// Test 13: Email format validation
Test: CREATE user with invalid email "notanemail"
Expected: Permission denied
Result: ✓ PASS

// Test 14: Invalid role rejected
Test: CREATE user with role: "invalid_role"
Expected: Permission denied
Result: ✓ PASS

// Test 15: Required fields enforced
Test: CREATE user without email field
Expected: Permission denied
Result: ✓ PASS

// Test 16: Audit log cannot be deleted
Test: DELETE /audit_logs/{logId}
Expected: Permission denied
Result: ✓ PASS
```

- [ ] Validation test 13: ✓ PASS
- [ ] Validation test 14: ✓ PASS
- [ ] Validation test 15: ✓ PASS
- [ ] Validation test 16: ✓ PASS

### Integration Tests

```javascript
// Test 17: Complete flow - new user
1. Create Firebase Auth user: user@example.com
2. Create Firestore user profile with role: viewer
3. User logs in
4. User can read own profile
5. User can read role_configs
6. User cannot read other profiles
7. Audit log entry created for login
Result: ✓ PASS

// Test 18: RBAC flow
1. Create user with role: viewer
2. Load role_configs/viewer
3. Check accessible_portals
4. Try to access restricted portal
5. Should be blocked or see access-denied
Result: ✓ PASS

// Test 19: Offline queue
1. Create offline queue entry for user
2. Verify user can read own queue entry
3. Verify non-owner cannot read
4. Update entry status
5. Delete processed entry
Result: ✓ PASS
```

- [ ] Integration test 17: ✓ PASS
- [ ] Integration test 18: ✓ PASS
- [ ] Integration test 19: ✓ PASS

---

## Rollback Procedure

**If Critical Issues Occur During Production Deployment**

### Decision Criteria

Rollback if:
- [ ] > 1% user login failures
- [ ] > 10 "permission denied" errors per minute for valid operations
- [ ] Database write operations consistently failing
- [ ] Admin operations not working
- [ ] Cannot be fixed within 30 minutes

### Rollback Steps

**Via Firebase Console:**

1. [ ] Open Firebase Console
2. [ ] Navigate to Firestore Database → Rules
3. [ ] Click "Edit Rules"
4. [ ] Restore previous rules from backup/screenshot
5. [ ] Click "Publish"
6. [ ] Wait for "Rules published" confirmation
7. [ ] Verify normal operations restored

**Via CLI:**

```bash
# Get previous rule version
firebase rules:list --project=epay-crm-prod

# Contact Firebase Support to rollback to specific version
# OR manually restore previous rules file
firebase deploy --only firestore:rules --project=epay-crm-prod
```

### Post-Rollback Actions

- [ ] Confirm normal operations restored
- [ ] Notify team of rollback
- [ ] Create incident report
- [ ] Schedule retrospective meeting
- [ ] Address root cause before re-deploying

---

## Sign-Off

### Development

- [ ] Deployed by: _________________ Date: _______
- [ ] Verified by: _________________ Date: _______

### Staging

- [ ] Deployed by: _________________ Date: _______
- [ ] Verified by: _________________ Date: _______
- [ ] Approved by: _________________ Date: _______

### Production

- [ ] Deployed by: _________________ Date: _______
- [ ] Verified by: _________________ Date: _______
- [ ] Approved by: _________________ Date: _______
- [ ] Monitoring assigned to: _________________ Duration: _______

---

## Post-Deployment Report

**Deployment Date:** _____________  
**Deployed By:** _____________  
**Environment:** _____________  

### Deployment Status

- [ ] Successful
- [ ] Successful with warnings (describe):

### Issues Encountered

- [ ] None
- [ ] Minor (describe):
- [ ] Major (describe, if major then rollback performed):

### Performance Impact

- [ ] None detected
- [ ] Minimal
- [ ] Significant (describe):

### User Feedback

- [ ] No issues reported
- [ ] Minor issues (describe):
- [ ] Major issues (describe):

### Notes

_Use this space for additional notes, observations, or recommendations for future deployments._

---

**End of Deployment Checklist**
