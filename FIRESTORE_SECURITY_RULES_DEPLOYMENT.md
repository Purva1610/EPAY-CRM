# Firestore Security Rules - Deployment Guide

**Document Version:** 1.0  
**Last Updated:** 2024  
**Requirements Covered:** 7.1, 7.2, 7.3, 7.4, 7.5, 7.6

---

## Table of Contents

1. [Overview](#overview)
2. [Security Rules Summary](#security-rules-summary)
3. [Deployment Methods](#deployment-methods)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Verification Steps](#verification-steps)
6. [Troubleshooting](#troubleshooting)
7. [Maintenance and Updates](#maintenance-and-updates)

---

## Overview

This document provides procedures and best practices for deploying Firestore Security Rules for the ePay CRM Firebase migration. The rules implement comprehensive authentication, authorization, and data validation to ensure:

- **Authentication enforcement** on all Firestore operations (Requirement 7.1)
- **User-scoped access control** for profile data (Requirement 7.2)
- **Role configuration management** with admin-only write access (Requirement 7.3)
- **Audit log protection** with admin read and system write access (Requirement 7.4)
- **Presence data validation** and user-scoped writes (Requirement 7.5)
- **Rate limiting** for authentication attempts (Requirement 7.6)

---

## Security Rules Summary

The `firestore.rules` file contains seven collections with specific access patterns:

### 1. **Users Collection** (Requirement 7.2)
- **Read Access:** Owner can read own profile; Admin can read any profile
- **Write Access:** Owner can update own profile (excluding role); Admin can create/update/delete
- **Validation:** Email format, required fields (uid, email, displayName, role)

### 2. **Role Configs Collection** (Requirement 7.3)
- **Read Access:** All authenticated users can read role configurations
- **Write Access:** Admin only (create, update, delete)
- **Validation:** Must include role, accessible_portals, accessible_features

### 3. **Audit Logs Collection** (Requirement 7.4)
- **Read Access:** Admin only
- **Write Access:** Authenticated users can create; No deletion allowed
- **Validation:** Required fields (timestamp, action, userId)

### 4. **Failed Login Attempts** (Requirement 7.5, 7.6)
- **Read Access:** Admin only
- **Write Access:** Authenticated users on failed attempt
- **Rate Limiting:** Max 10 auth attempts per user per minute

### 5. **Presence Collection** (Requirement 7.5)
- **Read Access:** All authenticated users
- **Write Access:** User can only write their own presence record
- **Validation:** Required fields with type checking (displayName, role, loginTime, lastActivityTime, online, status)

### 6. **Offline Queue Collection** (Requirement 6.2)
- **Read/Write:** User-scoped, user can only access their own queue
- **Operations:** create, update, delete with status tracking (pending, synced, conflict, failed)

### 7. **Sessions Collection** (Requirement 4.4)
- **Read Access:** User can read own sessions; Admin can read all
- **Write Access:** User can create and update own sessions; Admin can modify all
- **Validation:** Required fields (userId, createdAt, expiresAt)

---

## Deployment Methods

### Method 1: Firebase Console (Recommended for Non-Production)

**Best for:** Development, staging, testing environments

1. Open Firebase Console (console.firebase.google.com)
2. Select your ePay CRM project
3. Navigate to Firestore Database → Rules tab
4. Copy the entire content from `firestore.rules`
5. Paste into the Firebase Console Rules editor
6. Click "Publish" button
7. Confirm in the dialog that appears

**Advantages:**
- No CLI setup required
- Real-time validation feedback
- Can test rules before publishing

**Disadvantages:**
- Manual process
- No version control integration
- Not ideal for CI/CD pipelines

---

### Method 2: Firebase CLI (Recommended for Production)

**Best for:** Production environments, CI/CD pipelines, version-controlled deployments

#### Prerequisites

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Verify Installation:**
   ```bash
   firebase --version
   ```

3. **Login to Firebase:**
   ```bash
   firebase login
   ```
   - Opens browser for Google authentication
   - Grant permissions for Firebase project access

4. **Initialize Firebase Project (if not already done):**
   ```bash
   firebase init
   ```
   - Select "Firestore" option
   - Choose existing project (ePay CRM)
   - Confirm default configuration

---

## Step-by-Step Deployment

### Development Environment Deployment

**Using Firebase Console:**

1. Navigate to [Firebase Console](https://console.firebase.google.com)
2. Select ePay CRM Development project
3. Go to Firestore Database → Rules
4. Click "Edit rules" button
5. Clear existing rules (if any)
6. Copy entire content from `firestore.rules` file
7. Paste into editor
8. Review changes in diff view
9. Click "Publish" button
10. Wait for "Rules published" confirmation message (usually 30-60 seconds)
11. Verify rules are active (check timestamp)

**Using Firebase CLI:**

```bash
# Navigate to project root directory
cd "c:\Users\Yashraj Sathe\OneDrive\Desktop\epay crm v1"

# Validate rules syntax before deployment
firebase rules:test firestore.rules --project=epay-crm-dev

# Deploy rules to development Firebase project
firebase deploy --only firestore:rules --project=epay-crm-dev

# Expected output:
# === Deploying to 'epay-crm-dev'...
# i  firestore: checking firestore.rules for compilation errors...
# ✔  firestore: rules compiled successfully
# i  firestore: uploading rules...
# ✔  firestore: released new rules versions...
# Deploy complete!
```

---

### Staging Environment Deployment

```bash
# Validate rules for staging
firebase rules:test firestore.rules --project=epay-crm-staging

# Deploy to staging
firebase deploy --only firestore:rules --project=epay-crm-staging

# Verify deployment
firebase rules:list --project=epay-crm-staging
```

---

### Production Environment Deployment

**IMPORTANT:** Implement change control for production deployments.

```bash
# Validate rules for production
firebase rules:test firestore.rules --project=epay-crm-prod

# Deploy to production (with explicit project)
firebase deploy --only firestore:rules --project=epay-crm-prod

# Verify deployment was successful
firebase firestore:describe-indexes --project=epay-crm-prod

# To rollback to previous version if needed:
firebase rules:list --project=epay-crm-prod  # Get rule version IDs
# Contact Firebase Support to rollback to previous version
```

**Pre-Deployment Checklist for Production:**
- [ ] All tests pass in staging environment
- [ ] Security review completed
- [ ] Deployment window scheduled
- [ ] Rollback plan documented
- [ ] Team notified of maintenance window
- [ ] Backup of current rules created
- [ ] Change management approval obtained

---

## Verification Steps

### Verify Rules Deployment Success

1. **Check Firebase Console:**
   - Open Firebase Console
   - Navigate to Firestore → Rules
   - Confirm rules are published (shows green checkmark and timestamp)
   - Rules should show current rules content

2. **Check Via CLI:**
   ```bash
   firebase rules:list --project=epay-crm-dev
   
   # Output shows:
   # ✔  Successfully retrieved 1 rule version
   # 
   # Rules Version 1 (created 2024-01-15 10:30:45 UTC)
   # Enabled: true
   ```

3. **Test Access Patterns:**

   **Test 1: Unauthenticated access denied**
   ```javascript
   const db = firebase.firestore();
   db.collection('users').doc('test-uid').get()
     .catch(error => {
       console.log('Expected error:', error.message);
       // Should show: "Missing or insufficient permissions"
     });
   ```

   **Test 2: User can read own profile**
   ```javascript
   const currentUser = firebase.auth().currentUser;
   if (currentUser) {
     db.collection('users').doc(currentUser.uid).get()
       .then(doc => {
         console.log('Own profile read success:', doc.data());
       });
   }
   ```

   **Test 3: User cannot read other profiles**
   ```javascript
   db.collection('users').doc('other-user-uid').get()
     .catch(error => {
       console.log('Expected permission denied:', error.message);
     });
   ```

   **Test 4: Authenticated user can read role configs**
   ```javascript
   db.collection('role_configs').doc('admin').get()
     .then(doc => {
       console.log('Role config read success:', doc.data());
     });
   ```

   **Test 5: Only admin can write role configs**
   ```javascript
   db.collection('role_configs').doc('admin').update({ 
     accessible_portals: ['new-portal'] 
   })
     .then(() => {
       console.log('Admin can update role config');
     })
     .catch(error => {
       console.log('Non-admin gets permission denied:', error.message);
     });
   ```

### Validation Checklist

- [ ] Rules published successfully without errors
- [ ] Timestamp shows recent deployment
- [ ] Unauthenticated access is blocked
- [ ] Authenticated users can read public collections
- [ ] Users can read own profile documents
- [ ] Users cannot read other user profiles
- [ ] Admins can read audit logs
- [ ] Non-admins cannot read/write audit logs
- [ ] Rate limiting is in effect
- [ ] Presence data validation enforces required fields
- [ ] Firestore console shows no errors in test queries

---

## Troubleshooting

### Issue: Rules Validation Fails

**Symptom:** Error message during deployment: "Rules compilation failed"

**Solution:**
1. Check syntax in firestore.rules file
2. Verify all function definitions are complete
3. Ensure all collection paths are properly formatted
4. Validate file encoding (should be UTF-8)

**Example Error:**
```
Error parsing rules: Line 45: expected function call
```

**Fix:**
- Review line 45 and surrounding context
- Check for missing parentheses or brackets
- Verify function names are spelled correctly

---

### Issue: "Insufficient Permissions" Error After Deployment

**Symptom:** Users getting permission denied errors for expected operations

**Possible Causes:**
1. User role not set correctly in Firestore user profile
2. Role doesn't match roles listed in `isAdmin()` or `isPortalAdmin()` functions
3. User document missing required fields
4. Email validation regex too strict

**Solution:**
1. Verify user document structure in Firestore Console:
   ```
   users/{uid}
   - uid: "user-id"
   - email: "user@example.com"
   - displayName: "User Name"
   - role: "admin"  // Must match one of allowed roles
   ```

2. Check role configuration exists:
   ```
   role_configs/{roleId}
   - role: "admin"
   - accessible_portals: [...]
   - accessible_features: [...]
   ```

3. Temporarily enable debug logging:
   ```javascript
   firebase.firestore.setLogLevel('debug');
   ```

---

### Issue: Rate Limiting Not Working

**Symptom:** Users can attempt login more than allowed limit

**Possible Causes:**
1. failed_login_attempts collection doesn't exist or isn't being populated
2. Rate limit time window calculation incorrect
3. Email not stored in failed attempt records

**Solution:**
1. Verify `failed_login_attempts` collection exists
2. Check that login failures are being logged:
   ```javascript
   // Should create entry in failed_login_attempts
   await db.collection('failed_login_attempts').add({
     email: userEmail,
     timestamp: new Date(),
     reason: 'invalid_password'
   });
   ```

3. Manually test rate limiting:
   - Attempt 5+ logins with invalid password
   - Verify 6th attempt is rejected
   - Check audit_logs for failed attempts

---

### Issue: Rules Published but Not Taking Effect

**Symptom:** Rules seem to be ignored, old access patterns still work

**Possible Causes:**
1. Browser cache containing old compiled rules
2. Multiple Firebase apps initialized
3. Old security rules still cached in Firestore

**Solution:**
1. Clear browser cache and local storage:
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

2. Reload page completely:
   ```
   Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   ```

3. Verify rules version in console:
   ```bash
   firebase rules:list --project=epay-crm-dev
   ```

4. Wait 2-3 minutes for rules to propagate globally

---

### Issue: "Could not load firestore.rules" Error

**Symptom:** Firebase CLI cannot find the rules file

**Solution:**
1. Verify file exists at correct path:
   ```bash
   # Windows
   cd "c:\Users\Yashraj Sathe\OneDrive\Desktop\epay crm v1"
   dir firestore.rules
   
   # Should show file size and date
   ```

2. Ensure firestore.rules is in project root:
   - Not in a subdirectory
   - Filename exactly matches "firestore.rules"
   - No .txt or other extension

3. Check firebase.json includes firestore rules:
   ```json
   {
     "firestore": {
       "rules": "firestore.rules",
       "indexes": "firestore.indexes.json"
     }
   }
   ```

---

## Maintenance and Updates

### Updating Rules After Deployment

When security requirements change:

1. **Edit Rules Locally:**
   - Modify `firestore.rules` file in your editor
   - Document changes with comments including requirement number

2. **Test Changes:**
   ```bash
   firebase rules:test firestore.rules --project=epay-crm-dev
   ```

3. **Deploy to Dev/Staging First:**
   ```bash
   firebase deploy --only firestore:rules --project=epay-crm-dev
   firebase deploy --only firestore:rules --project=epay-crm-staging
   ```

4. **Verify in Staging Environment:**
   - Test all user roles
   - Test edge cases
   - Check audit logs for any issues

5. **Deploy to Production:**
   ```bash
   firebase deploy --only firestore:rules --project=epay-crm-prod
   ```

### Rule Version Control

**Best Practices:**

1. **Commit to Git:**
   ```bash
   git add firestore.rules
   git commit -m "feat: Update Firestore rules for requirement 7.2 - user profile access"
   ```

2. **Tag Production Releases:**
   ```bash
   git tag -a v1.0.0-rules -m "Firestore rules for production release 1.0.0"
   git push origin v1.0.0-rules
   ```

3. **Document Changes:**
   - Include requirement numbers in commit messages
   - Link to relevant design documents
   - Note any breaking changes

### Monitoring and Auditing

1. **Set Up Alerts:**
   - Monitor for permission-denied errors in Crashlytics
   - Alert on spike in "Insufficient Permissions" errors
   - Track rate-limit error increases

2. **Regular Audits:**
   - Review access patterns monthly
   - Audit sensitive operations (admin writes to audit_logs)
   - Check for unauthorized access attempts

3. **Performance Monitoring:**
   ```bash
   firebase firestore:describe-indexes --project=epay-crm-prod
   ```

---

## Appendix: CLI Reference

### Common Firebase CLI Commands

```bash
# Login to Firebase
firebase login

# List all projects
firebase projects:list

# Set default project
firebase use epay-crm-dev

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy to specific project
firebase deploy --only firestore:rules --project=epay-crm-prod

# Test rules locally
firebase rules:test firestore.rules

# List rule versions
firebase rules:list

# Get rules for specific project
firebase firestore:describe --project=epay-crm-dev

# Enable debug logging
firebase --debug deploy --only firestore:rules
```

---

## Support and Escalation

For issues beyond this troubleshooting guide:

1. **Check Firebase Status Page:** https://status.firebase.google.com
2. **Review Firebase Documentation:** https://firebase.google.com/docs/firestore/security/start
3. **Firebase Support:** https://firebase.google.com/support
4. **Community Forums:** https://stackoverflow.com/questions/tagged/firebase-security

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2024 | Initial deployment guide | ePay CRM Team |

---

**End of Document**
