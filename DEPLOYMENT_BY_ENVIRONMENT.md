# Firestore Security Rules - Environment-Specific Deployment

**Quick reference for deploying to each environment**

---

## Table of Contents

1. [Development Environment](#development-environment)
2. [Staging Environment](#staging-environment)
3. [Production Environment](#production-environment)

---

## Development Environment

**Project ID:** `epay-crm-dev`  
**Purpose:** Local development, testing, experimentation  
**Frequency:** Can deploy multiple times per day  
**Approval Required:** No  

### Prerequisites

```bash
# Install Firebase CLI (one-time)
npm install -g firebase-tools

# Login to Firebase (one-time)
firebase login

# Navigate to project directory
cd "c:\Users\Yashraj Sathe\OneDrive\Desktop\epay crm v1"
```

### Deployment Steps

**Method 1: Firebase Console (Quickest)**

```
1. Visit https://console.firebase.google.com
2. Click project dropdown → Select "epay-crm-dev"
3. Left sidebar → Firestore Database
4. Click "Rules" tab at top
5. Click "Edit Rules" button
6. Delete existing rules
7. Copy entire content from firestore.rules file
8. Paste into rule editor
9. Review changes in diff view
10. Click "Publish" button
11. Wait 30-60 seconds for "Rules published" message
12. Verify green checkmark next to rules
```

**Method 2: Firebase CLI**

```bash
# Validate syntax
firebase rules:test firestore.rules --project=epay-crm-dev

# Expected output should show: "✔ All tests passed"

# Deploy
firebase deploy --only firestore:rules --project=epay-crm-dev

# Expected output:
# i  firestore: checking firestore.rules for compilation errors...
# ✔  firestore: rules compiled successfully
# i  firestore: uploading rules...
# ✔  firestore: released new rules versions...
# Deploy complete!
```

### Verification

1. Open Firebase Console → Firestore Database → Rules
2. Confirm rules are shown (should match firestore.rules content)
3. Check timestamp (should be current time)
4. Run quick test in browser console:

```javascript
// In browser console after logging in as test user
firebase.auth().signOut().then(() => {
  // Try to access without auth - should fail
  return firebase.firestore().collection('users').doc('test').get();
}).catch(err => {
  console.log('Expected error:', err.message);
});

// After logging back in as test user
firebase.auth().signInWithEmailAndPassword('test@example.com', 'password')
  .then(() => {
    // Try to read own profile - should succeed
    const uid = firebase.auth().currentUser.uid;
    return firebase.firestore().collection('users').doc(uid).get();
  })
  .then(doc => {
    console.log('✓ Read own profile success:', doc.data());
  })
  .catch(err => {
    console.error('Read own profile failed:', err.message);
  });
```

### Troubleshooting Development

| Issue | Solution |
|-------|----------|
| Rules won't compile | Check firestore.rules syntax, look for brackets/parentheses errors |
| Permission denied for owner | Verify user document exists in Firestore with correct UID |
| Can deploy but can't access after | Clear browser cache: Ctrl+Shift+Delete, then reload page |

---

## Staging Environment

**Project ID:** `epay-crm-staging`  
**Purpose:** Pre-production testing, integration tests  
**Frequency:** 1-2 times per week  
**Approval Required:** Tech lead sign-off  

### Prerequisites

Same as development, plus:

```bash
# Verify access to staging project
firebase projects:list

# Output should show "epay-crm-staging" as available project
```

### Pre-Deployment Checklist

- [ ] Rules tested successfully in development
- [ ] All code changes committed to Git
- [ ] Integration tests ready to run
- [ ] Test data populated in staging database
- [ ] Team notified of upcoming deployment
- [ ] Backup taken of current staging rules

### Deployment Steps

**Via Firebase CLI (Recommended)**

```bash
# Set staging as active project
firebase use epay-crm-staging

# Validate rules for staging environment
firebase rules:test firestore.rules --project=epay-crm-staging

# If tests pass, deploy
firebase deploy --only firestore:rules --project=epay-crm-staging

# Verify deployment
firebase rules:list --project=epay-crm-staging
```

**Via Firebase Console**

```
1. Visit https://console.firebase.google.com
2. Project dropdown → Select "epay-crm-staging"
3. Firestore Database → Rules tab
4. Edit Rules → Clear and paste firestore.rules content
5. Review changes
6. Publish
```

### Testing After Deployment

Run comprehensive test suite:

```bash
# 1. Test authentication
- User can log in to staging app
- Unauthenticated access blocked
- Session persists across page reload

# 2. Test access control
- User can read own profile
- User cannot read other profiles
- Admin can read any profile
- User cannot change own role
- Admin can change user role

# 3. Test collections
- Authenticated user can read role_configs
- Only admin can read audit_logs
- Audit logs cannot be deleted
- User can create presence record
- Only owner can update presence

# 4. Test integrations
- Login flow works end-to-end
- Profile service reads/writes correctly
- RBAC service loads and applies rules
- Audit logging creates entries
```

### Verification Script

Run in browser console on staging app:

```javascript
async function testStagingRules() {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const results = {};

  try {
    // Sign out and test unauthenticated access
    await auth.signOut();
    try {
      await db.collection('users').doc('test').get();
      results['Unauthenticated blocked'] = '❌ FAIL - Should be blocked';
    } catch (e) {
      results['Unauthenticated blocked'] = '✓ PASS';
    }

    // Sign in as regular user
    const user = await auth.signInWithEmailAndPassword('user@example.com', 'password');
    results['User login'] = '✓ PASS';

    // Test reading own profile
    const ownProfile = await db.collection('users').doc(user.user.uid).get();
    results['User reads own profile'] = ownProfile.exists ? '✓ PASS' : '❌ FAIL';

    // Test reading role configs
    const roleConfig = await db.collection('role_configs').doc('admin').get();
    results['User reads role_configs'] = roleConfig.exists ? '✓ PASS' : '❌ FAIL';

    // Test cannot read other profile
    try {
      await db.collection('users').doc('other-user-id').get();
      results['User cannot read other profile'] = '❌ FAIL - Should be blocked';
    } catch (e) {
      results['User cannot read other profile'] = '✓ PASS';
    }

    console.table(results);
    return results;
  } catch (error) {
    console.error('Test error:', error);
    return results;
  }
}

testStagingRules();
```

### Rollback (if needed)

```bash
# Get list of previous rule versions
firebase rules:list --project=epay-crm-staging

# If major issues, restore from backup or previous version
firebase deploy --only firestore:rules --project=epay-crm-staging
```

---

## Production Environment

**Project ID:** `epay-crm-prod`  
**Purpose:** Live application serving real users  
**Frequency:** Weekly or as needed  
**Approval Required:** Tech lead + Security review  

### Pre-Deployment Requirements

**72 Hours Before:**
- [ ] Requirement review: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6 all met
- [ ] Rules validated in development environment
- [ ] All tests passing in development

**48 Hours Before:**
- [ ] Deploy to staging
- [ ] Run comprehensive test suite in staging
- [ ] No permission denied errors for valid operations
- [ ] Admin operations functioning
- [ ] Rate limiting operational

**24 Hours Before:**
- [ ] Create change request (CR) in JIRA/DevOps
- [ ] Get security review approval
- [ ] Get tech lead approval
- [ ] Schedule maintenance window (preferably 2-4 AM UTC for minimal user impact)
- [ ] Notify all teams of maintenance window
- [ ] Prepare rollback procedure

**Day of Deployment:**
- [ ] Assigned on-call engineer confirms availability
- [ ] Backup of current production rules taken
- [ ] Team in Slack #deployments channel

### Deployment Procedure

**Pre-Deployment Verification (20 minutes before)**

```bash
# 1. Verify correct project selected
firebase use epay-crm-prod

# 2. Final syntax check
firebase rules:test firestore.rules --project=epay-crm-prod

# 3. Verify connectivity
firebase projects:list

# Output should show epay-crm-prod selected
```

**Deployment (Execute during maintenance window)**

```bash
# Deploy with verbose output for troubleshooting
firebase deploy --only firestore:rules --project=epay-crm-prod --debug

# Watch output for:
# ✔ firestore: rules compiled successfully
# ✔ firestore: released new rules versions...
```

**Expected Output:**

```
=== Deploying to 'epay-crm-prod'...

i  firestore: checking firestore.rules for compilation errors...
✔  firestore: rules compiled successfully
i  firestore: uploading rules...
✔  firestore: released new rules versions...

Deploy complete!

Project Console: https://console.firebase.google.com/project/epay-crm-prod
```

### Post-Deployment Actions

**Immediate (First 5 minutes)**

```bash
# Verify deployment succeeded
firebase rules:list --project=epay-crm-prod

# Check Firebase Console
# https://console.firebase.google.com/project/epay-crm-prod
# - Navigate to Firestore Database → Rules
# - Verify rules displayed match firestore.rules
# - Check timestamp is recent
```

**First 30 Minutes - Active Monitoring**

- [ ] Monitor Firebase Console for errors
- [ ] Watch Crashlytics for new errors
- [ ] Check production app:
  - [ ] Login works
  - [ ] Portal access works
  - [ ] Profile reads work
  - [ ] Admin dashboard accessible
  - [ ] No unusual error messages

**First Hour - Metrics Check**

```javascript
// In Firebase Console → Monitoring
- Database read/write rates normal
- No spike in permission-denied errors
- No spike in authentication errors
- Error rate < 1%
```

**First 8 Hours - Continued Monitoring**

- [ ] Every 1 hour: Check error rates
- [ ] Every 1 hour: Verify user logins successful
- [ ] Every 1 hour: Confirm admin operations work
- [ ] Every 4 hours: Spot check audit logs
- [ ] Monitor late evening peak traffic

### Production Rollback Procedure

**If critical issue detected:**

```bash
# Step 1: Immediately stop accepting new deployments
# Step 2: Notify all teams in #deployments Slack channel
# Step 3: Decision point:
#   A) If can be fixed in rules → fix and re-deploy quickly
#   B) If needs backend changes → rollback

# To rollback:
firebase deploy --only firestore:rules --project=epay-crm-prod < backup-rules.txt
# OR contact Firebase Support to revert to previous version
```

**Rollback Approval:**
- Tech lead approval required
- Security team notified

**Post-Rollback:**
- [ ] Verify normal operations restored
- [ ] Monitor for 1 hour
- [ ] Create incident report
- [ ] Schedule post-mortem meeting
- [ ] Fix root cause before re-attempting deployment

### Production Change Log

Keep record of all production deployments:

```
Date: 2024-01-15
Time: 02:30 UTC
Version: 1.0.0
Changes: Initial production rules deployment
- Auth checks (Req 7.1)
- User profile access (Req 7.2)
- Role config management (Req 7.3)
- Audit log protection (Req 7.4)
- Presence validation (Req 7.5)
- Rate limiting (Req 7.6)
Status: ✓ Successful
Deployed By: John Doe
Verified By: Jane Smith
Issues: None
Notes: Smooth deployment, all tests passed
```

---

## Comparison Matrix

| Aspect | Development | Staging | Production |
|--------|-------------|---------|-----------|
| Project ID | epay-crm-dev | epay-crm-staging | epay-crm-prod |
| Data | Test data | Mirror of prod | Real user data |
| Deployment Frequency | Any time | 1-2x per week | Weekly or as needed |
| Approval Required | No | Tech lead | Tech lead + Security |
| Rollback | Manual | Manual | Manual + support |
| Monitoring | Casual | Active | 24/7 on-call |
| Backup Required | No | Recommended | Required |
| Maintenance Window | Not needed | Not needed | Required |
| Team Notification | Optional | Recommended | Required |

---

## Deployment Summary Commands

### Development
```bash
firebase deploy --only firestore:rules --project=epay-crm-dev
```

### Staging
```bash
firebase deploy --only firestore:rules --project=epay-crm-staging
firebase rules:list --project=epay-crm-staging
```

### Production
```bash
firebase deploy --only firestore:rules --project=epay-crm-prod --debug
firebase rules:list --project=epay-crm-prod
```

---

## Support & Escalation

| Scenario | Action | Escalate To |
|----------|--------|-------------|
| Deploy fails syntax check | Fix rules, validate locally | Team lead |
| Deploy fails, prod not affected | Investigate, try again | Tech lead |
| Deploy succeeds, permissions denied | Check user roles, troubleshoot | Tech lead + Security |
| Permission-denied spike during deploy | Rollback immediately | On-call engineer |
| Rollback fails | Contact Firebase Support | Firebase support |

---

**Last Updated:** 2024  
**Next Review:** Before next production deployment
