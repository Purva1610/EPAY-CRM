# RTDB Security Rules - Quick Reference Card

## Overview
Firebase Realtime Database security rules for ePay CRM presence data. Rules enforce authentication, user-scoped write access, and strict field validation.

---

## Key Rules at a Glance

### Root Level
```
.read: false      ← Deny all reads by default
.write: false     ← Deny all writes by default
```

### Presence Data (/presence)
```
.read: auth != null              ← All authenticated users can read
.write: false                    ← No direct writes allowed
```

### User Record (/presence/{userId})
```
.write: auth.uid === $userId     ← Only user can write their own record
.read: auth != null              ← All authenticated users can read
```

---

## Presence Record Structure

**REQUIRED**: All 6 fields must be present

```javascript
{
  "displayName": "John Doe",           // String: 1-255 chars
  "role": "admin",                     // String: One of 10 valid roles
  "loginTime": 1786648107305,          // Number: Unix timestamp (ms)
  "lastActivityTime": 1786648110305,   // Number: >= loginTime
  "online": true,                      // Boolean: true/false
  "status": "active"                   // String: active|away|idle|offline
}
```

---

## Field Validation Rules

| Field | Type | Constraints | Examples |
|-------|------|-------------|----------|
| **displayName** | String | 1-255 chars | "John Doe" |
| **role** | String | admin, accountant, affiliate, BDE, BDO, CFO, CGO, CMO, arrival_manager, assistant_manager | "admin" |
| **loginTime** | Number | Non-negative integer (Unix ms) | 1786648107305 |
| **lastActivityTime** | Number | >= loginTime (Unix ms) | 1786648110305 |
| **online** | Boolean | true or false | true |
| **status** | String | active, away, idle, offline | "active" |

---

## Common Operations

### ✅ ALLOWED

```javascript
// 1. User reading presence list (authenticated)
firebase.database().ref('presence').once('value');
// Result: ✓ Success

// 2. User reading specific presence record (authenticated)
firebase.database().ref('presence/user123').once('value');
// Result: ✓ Success

// 3. User writing their own record with valid data
firebase.database().ref('presence/user123').set({
  displayName: "John Doe",
  role: "admin",
  loginTime: Date.now(),
  lastActivityTime: Date.now(),
  online: true,
  status: "active"
});
// Result: ✓ Success

// 4. User updating their own field
firebase.database().ref('presence/user123/status').set('away');
// Result: ✓ Success
```

### ❌ DENIED

```javascript
// 1. Unauthenticated user reading presence
firebase.database().ref('presence').once('value');
// Result: ✗ Permission denied

// 2. User writing another user's record
firebase.database().ref('presence/user456').set({...});
// Result: ✗ Permission denied (if auth.uid !== 'user456')

// 3. User writing with missing field
firebase.database().ref('presence/user123').set({
  displayName: "John Doe",
  role: "admin",
  // Missing: loginTime, lastActivityTime, online, status
});
// Result: ✗ Validation failed

// 4. User writing with invalid role
firebase.database().ref('presence/user123').set({
  displayName: "John Doe",
  role: "superuser",  // Not in valid roles list
  loginTime: Date.now(),
  lastActivityTime: Date.now(),
  online: true,
  status: "active"
});
// Result: ✗ Validation failed

// 5. User writing with invalid status
firebase.database().ref('presence/user123').set({
  // ...
  status: "disconnected"  // Not in (active, away, idle, offline)
});
// Result: ✗ Validation failed

// 6. User writing with time travel (lastActivityTime < loginTime)
firebase.database().ref('presence/user123').set({
  // ...
  loginTime: 1786648110305,
  lastActivityTime: 1786648107305,  // Earlier than loginTime!
  // ...
});
// Result: ✗ Validation failed
```

---

## Error Messages and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Permission denied | Not authenticated or not authorized | Sign in with valid credentials |
| Validation failed | Invalid data format | Check all 6 fields are present and valid |
| "displayName" too long | > 255 characters | Truncate to 255 chars or less |
| "role" invalid | Not in approved list | Use one of 10 valid roles |
| "status" invalid | Not in (active, away, idle, offline) | Use one of 4 valid statuses |
| "lastActivityTime" too old | < loginTime | Ensure lastActivityTime >= loginTime |

---

## Firebase Console Deployment

### Quick Steps
1. Firebase Console → Realtime Database → Rules tab
2. Copy entire `firebase-rtdb-rules.json`
3. Paste into rules editor
4. Click "Publish"
5. Wait for "Published" confirmation

### Verification
```javascript
// After deployment, test:
1. Authenticated read: ✓ Works
2. Unauthenticated read: ✗ Denied
3. Owner write: ✓ Works
4. Non-owner write: ✗ Denied
5. Invalid data: ✗ Rejected
```

---

## Valid Role Values
```
admin
accountant
affiliate
BDE
BDO
CFO
CGO
CMO
arrival_manager
assistant_manager
```

---

## Valid Status Values
```
active   ← User actively using system
away     ← Idle 15+ minutes
idle     ← Idle but still connected
offline  ← User disconnected
```

---

## Integration with PresenceService

### Methods That Create/Update Records

```javascript
// recordLogin() - Creates new presence record
presenceService.recordLogin(userId, displayName, role, loginTime)
// Validation: All 6 fields set correctly

// recordActivity() - Updates lastActivityTime
presenceService.recordActivity(userId)
// Validation: lastActivityTime remains >= loginTime

// updateInactivityStatus() - Changes status after 15 mins
presenceService.updateInactivityStatus(userId)
// Validation: status changed to 'away'

// recordLogout() - Deletes presence record
presenceService.recordLogout(userId)
// Validation: Record removed from database
```

---

## Testing Checklist

- [ ] Authenticated user can read presence list
- [ ] Unauthenticated user cannot read presence list
- [ ] User can write their own presence record
- [ ] User cannot write another user's record
- [ ] Invalid role is rejected
- [ ] Invalid status is rejected
- [ ] Missing fields are rejected
- [ ] Extra fields are rejected
- [ ] lastActivityTime < loginTime is rejected
- [ ] displayName > 255 chars is rejected

---

## Monitoring

### In Firebase Console
```
Realtime Database → Realtime tab
├─ Read/Write operations count
├─ Database size
├─ Active connections
└─ Performance metrics
```

### Warning Signs
- Sudden spike in permission denied errors
- Validation failures increasing
- Unusually high read/write counts
- Database size growing unexpectedly

---

## Need Help?

### Quick Links
- Full Guide: `RTDB_SECURITY_RULES_GUIDE.md`
- Integration: `PRESENCE_SERVICE_RTDB_INTEGRATION.md`
- Deployment: `RTDB_DEPLOYMENT_CHECKLIST.md`
- Summary: `TASK_1_3_SUMMARY.md`

### Common Issues
1. "Permission denied" → Check auth credentials
2. "Validation failed" → Verify all 6 fields present
3. "Invalid role" → Use one of 10 approved roles
4. "Invalid status" → Use one of 4 approved statuses

---

## Timestamps

All timestamps are in **milliseconds** (Unix time):
```javascript
Date.now()              // Current time in milliseconds
1786648107305          // Example timestamp
```

To convert:
```javascript
// Get current timestamp
const now = Date.now();

// Convert to seconds if needed
const seconds = Math.floor(now / 1000);

// Convert back to milliseconds
const ms = seconds * 1000;
```

---

## Security Properties Guaranteed

✅ **Authentication Required** - All operations require valid Firebase auth  
✅ **User-Scoped Access** - Users only modify their own records  
✅ **Data Validation** - All field types and values enforced  
✅ **Temporal Integrity** - Time relationships maintained  
✅ **Enum Validation** - Only approved role and status values  
✅ **Schema Enforcement** - Exactly 6 required fields  

---

## Summary

**Readable By**: All authenticated users  
**Writable By**: Record owner only (auth.uid must match userId)  
**Structure**: Exactly 6 required fields  
**Validation**: All field types, lengths, and values enforced  
**Security**: Authentication + Authorization + Data Validation  

