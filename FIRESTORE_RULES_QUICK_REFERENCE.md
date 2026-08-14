# Firestore Security Rules - Quick Reference

**One-Page Quick Reference for Deployment**

---

## 30-Second Overview

**File:** `firestore.rules`  
**Collections:** 7 (users, role_configs, audit_logs, failed_login_attempts, presence, offline_queue, sessions)  
**Status:** Ready for deployment  
**Requirements:** 7.1, 7.2, 7.3, 7.4, 7.5, 7.6

---

## Deploy in 5 Minutes

### Option A: Firebase Console (Easiest)

1. Go to https://console.firebase.google.com
2. Select "epay-crm-dev"
3. Firestore Database → Rules → Edit Rules
4. Copy `firestore.rules` file content
5. Paste into editor
6. Click "Publish"
7. Done ✓

### Option B: Firebase CLI (Production)

```bash
firebase login
firebase rules:test firestore.rules --project=epay-crm-dev
firebase deploy --only firestore:rules --project=epay-crm-dev
```

---

## Collections at a Glance

| Collection | Read | Write | Notes |
|-----------|------|-------|-------|
| **users** | Owner, Admin | Owner (limited), Admin | User profiles |
| **role_configs** | All authenticated | Admin only | Role definitions |
| **audit_logs** | Admin only | System/Auth service | Immutable (no delete) |
| **failed_login_attempts** | Admin only | On failed login | Rate limiting |
| **presence** | All authenticated | Owner only | User online status |
| **offline_queue** | Owner only | Owner only | Queued operations |
| **sessions** | Owner, Admin | Owner, Admin | Session tracking |

---

## Key Functions Quick Lookup

| Function | Purpose | Returns |
|----------|---------|---------|
| `isAuthenticated()` | Check if logged in | boolean |
| `isAdmin()` | Check if super-admin | boolean |
| `isOwner(uid)` | Check if document owner | boolean |
| `isPortalAdmin()` | Check if admin+ | boolean |
| `isValidUserProfile()` | Validate user fields | boolean |
| `isValidRole()` | Validate role is allowed | boolean |

---

## Common Tests

### Test: User can read own profile
```javascript
const uid = firebase.auth().currentUser.uid;
db.collection('users').doc(uid).get()  // ✓ Success
```

### Test: User cannot read other profile
```javascript
db.collection('users').doc('other-uid').get()  // ✗ Permission denied
```

### Test: Anyone authenticated can read role configs
```javascript
db.collection('role_configs').doc('admin').get()  // ✓ Success
```

### Test: Only admin can read audit logs
```javascript
db.collection('audit_logs').doc('log1').get()  // ✓ If admin, ✗ If not
```

### Test: Audit logs cannot be deleted
```javascript
db.collection('audit_logs').doc('log1').delete()  // ✗ Always fails
```

---

## Troubleshooting Quick Guide

| Issue | Solution |
|-------|----------|
| Rules won't deploy | Check syntax: `firebase rules:test firestore.rules` |
| Permission denied when should succeed | Verify user role in Firestore `/users/{uid}` document |
| Non-admin can read audit logs | Verify `isAdmin()` function and user role |
| User cannot update own profile | Check if role being changed (not allowed) |
| Rate limiting not working | Verify `failed_login_attempts` collection populated |

---

## Deployment Checklist (Quick Version)

Development:
- [ ] Rules syntax valid
- [ ] Deployed to Firebase
- [ ] Verified in console
- [ ] Basic tests pass

Staging:
- [ ] All tests pass
- [ ] No false permission denials
- [ ] Admin operations work
- [ ] Rate limiting works

Production:
- [ ] All staging tests passed
- [ ] Rollback procedure ready
- [ ] Team notified
- [ ] Backup of previous rules
- [ ] Deploy with CLI
- [ ] Monitor for 1 hour

---

## Access Control Matrix

**Requirement 7.1 & 7.2 - User Access Patterns**

```
Operation          | Unauthenticated | User | Admin | Owner
-------------------|-----------------|------|-------|--------
Read own profile   |        ✗        |   ✓  |   ✓   |   ✓
Read other profile |        ✗        |   ✗  |   ✓   |   ✗
Update own profile |        ✗        |   ✓* |   ✓   |   ✓*
Change own role    |        ✗        |   ✗  |   ✓   |   ✗
Create user        |        ✗        |   ✗  |   ✓   |   ✗
Delete user        |        ✗        |   ✗  |   ✓   |   ✗

* Except role field
```

**Requirement 7.3 - Role Config Access**

```
Operation        | Unauthenticated | User | Admin
-----------------|-----------------|------|-------
Read role config |        ✗        |   ✓  |   ✓
Update role      |        ✗        |   ✗  |   ✓
```

**Requirement 7.4 - Audit Log Access**

```
Operation       | Unauthenticated | User | Admin
-----------------|-----------------|------|-------
Read audit log  |        ✗        |   ✗  |   ✓
Create entry    |        ✗        |   ✓  |   ✓
Delete entry    |        ✗        |   ✗  |   ✗
```

**Requirement 7.5 - Presence Access**

```
Operation            | Unauthenticated | User | Admin
----------------------|-----------------|------|-------
Read presence list   |        ✗        |   ✓  |   ✓
Update own presence  |        ✗        |   ✓  |   ✗
Update other presence|        ✗        |   ✗  |   ✗
```

---

## Files Involved

| File | Purpose |
|------|---------|
| `firestore.rules` | The security rules (main file) |
| `firebase.json` | Firebase CLI configuration |
| `firestore.indexes.json` | Firestore indexes (query optimization) |
| `.firebaserc` | Project configuration for CLI |
| `FIRESTORE_SECURITY_RULES_DEPLOYMENT.md` | Full deployment guide |
| `FIRESTORE_SECURITY_RULES_REFERENCE.md` | Technical reference |
| `DEPLOYMENT_CHECKLIST.md` | Detailed checklist |

---

## Required Firestore Indexes

To improve query performance, create these indexes in Firebase Console:

1. **users:** (role, isActive)
2. **audit_logs:** (timestamp DESC, userId)
3. **audit_logs:** (timestamp DESC, action)
4. **failed_login_attempts:** (email, timestamp DESC)
5. **presence:** (online, loginTime DESC)
6. **sessions:** (userId, createdAt DESC)

Or use CLI:
```bash
firebase deploy --only firestore:indexes --project=epay-crm-dev
```

---

## Before & After Verification

**Before Deployment (Development)**

```bash
# 1. Verify syntax
firebase rules:test firestore.rules --project=epay-crm-dev

# Expected output:
# ✔ All tests passed
```

**After Deployment (All Environments)**

```bash
# 1. Check rules are published
firebase rules:list --project=epay-crm-dev

# 2. Run access pattern tests
# - Unauthenticated blocked ✓
# - User reads own profile ✓
# - Admin reads audit logs ✓
# - Audit logs immutable ✓

# 3. Monitor error logs
# - No spike in permission-denied errors
# - No database connection issues
```

---

## Emergency Rollback

If critical issues occur:

```bash
# 1. Restore previous rules from backup
# 2. Deploy rollback
firebase deploy --only firestore:rules --project=epay-crm-prod

# 3. Notify team
# 4. Investigate root cause
# 5. Schedule re-deployment
```

---

## Help & Resources

- **Firebase Console:** https://console.firebase.google.com
- **Rules Documentation:** https://firebase.google.com/docs/firestore/security/start
- **CLI Documentation:** https://firebase.google.com/docs/cli
- **Status Page:** https://status.firebase.google.com
- **Community:** Stack Overflow tag: `firebase-security`

---

## Requirements Mapping

| Requirement | Coverage | Details |
|-------------|----------|---------|
| 7.1 | ✓ Full | Authentication checks, admin access, role validation |
| 7.2 | ✓ Full | User profile access control, owner/admin differentiation |
| 7.3 | ✓ Full | Role config management, admin write-only |
| 7.4 | ✓ Full | Audit log protection, immutable records |
| 7.5 | ✓ Full | Rate limiting, presence validation |
| 7.6 | ✓ Full | Rate limiting enforcement via audit_logs |

---

**Last Updated:** 2024  
**Next Review:** Before production deployment  
**Owner:** ePay CRM Team
