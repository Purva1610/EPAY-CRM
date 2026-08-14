# PresenceService RTDB Integration Guide

## Overview

This document provides integration guidelines for the PresenceService to work with the Firebase Realtime Database security rules defined in `firebase-rtdb-rules.json`. This ensures that all presence operations comply with the security requirements.

## Presence Record Structure

The presence record stored in RTDB at `/presence/{userId}` must have exactly this structure:

```typescript
interface PresenceRecord {
  displayName: string;      // User's display name (1-255 chars)
  role: string;            // User's role (one of predefined roles)
  loginTime: number;       // Unix timestamp when user logged in (milliseconds)
  lastActivityTime: number; // Unix timestamp of last activity (milliseconds)
  online: boolean;         // Whether user is currently online
  status: string;          // Presence status: 'active' | 'away' | 'idle' | 'offline'
}
```

---

## Implementation Guidelines by Operation

### 1. recordLogin() Operation

**Requirements**: Must create a presence record with all 6 required fields

**Implementation**:
```javascript
async recordLogin(userId, displayName, role, loginTime) {
  const presenceData = {
    displayName: displayName,        // String, 1-255 chars
    role: role,                      // Must be valid role
    loginTime: loginTime,            // Unix timestamp (ms)
    lastActivityTime: loginTime,     // Same as loginTime on initial login
    online: true,                    // User just logged in
    status: 'active'                 // User is actively using system
  };
  
  try {
    await firebase.database()
      .ref(`presence/${userId}`)
      .set(presenceData);
    return { success: true };
  } catch (error) {
    // Handle validation errors (role not valid, displayName too long, etc.)
    return { success: false, error: error.message };
  }
}
```

**Validation Checks**:
- ✓ displayName: 1-255 characters
- ✓ role: Must be one of: admin, accountant, affiliate, BDE, BDO, CFO, CGO, CMO, arrival_manager, assistant_manager
- ✓ loginTime: Must be a non-negative integer (Unix timestamp in milliseconds)
- ✓ lastActivityTime: Initially equals loginTime
- ✓ online: Must be boolean true
- ✓ status: Initially set to 'active'

---

### 2. recordActivity() Operation

**Requirements**: Must update `lastActivityTime` without violating the constraint that `lastActivityTime >= loginTime`

**Implementation**:
```javascript
async recordActivity(userId) {
  const currentTime = Date.now();
  
  try {
    // Update only lastActivityTime
    await firebase.database()
      .ref(`presence/${userId}/lastActivityTime`)
      .set(currentTime);
    return { success: true };
  } catch (error) {
    // Possible reasons for failure:
    // 1. User doesn't own this record (permission denied)
    // 2. currentTime < loginTime (validation constraint)
    // 3. Database error
    return { success: false, error: error.message };
  }
}
```

**Validation Checks**:
- ✓ currentTime must be >= loginTime (enforced by RTDB rules)
- ✓ currentTime must be a non-negative integer
- ✓ Only the record owner (auth.uid) can update

---

### 3. updateInactivityStatus() Operation

**Requirements**: After 15 minutes of inactivity, update status to 'away' without changing other fields

**Implementation**:
```javascript
async updateInactivityStatus(userId, inactivityThresholdMs = 15 * 60 * 1000) {
  try {
    // Get current presence data to check inactivity duration
    const snapshot = await firebase.database()
      .ref(`presence/${userId}`)
      .once('value');
    
    if (!snapshot.exists()) {
      return { success: false, error: 'Presence record not found' };
    }
    
    const presenceData = snapshot.val();
    const timeSinceActivity = Date.now() - presenceData.lastActivityTime;
    
    if (timeSinceActivity >= inactivityThresholdMs) {
      // Update status to 'away' (only status, not other fields)
      await firebase.database()
        .ref(`presence/${userId}/status`)
        .set('away');
      return { success: true };
    } else {
      return { success: false, reason: 'User not inactive yet' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

**Validation Checks**:
- ✓ New status must be 'away' (one of: active, away, idle, offline)
- ✓ Only update the status field (don't touch other fields)
- ✓ Only the record owner can update

---

### 4. recordLogout() Operation

**Requirements**: Delete the presence record completely

**Implementation**:
```javascript
async recordLogout(userId) {
  try {
    await firebase.database()
      .ref(`presence/${userId}`)
      .remove();
    return { success: true };
  } catch (error) {
    // Possible reasons for failure:
    // 1. User doesn't own this record (permission denied)
    // 2. Database error
    return { success: false, error: error.message };
  }
}
```

**Validation Checks**:
- ✓ Only the record owner (auth.uid) can delete
- ✓ Deletion removes the entire record

---

### 5. getActiveUsers() Operation

**Requirements**: Query all presence records, filtering for online users

**Implementation**:
```javascript
async getActiveUsers() {
  try {
    // Read all presence records (all authenticated users have read access)
    const snapshot = await firebase.database()
      .ref('presence')
      .once('value');
    
    if (!snapshot.exists()) {
      return { success: true, users: [] };
    }
    
    const presenceMap = snapshot.val();
    const users = [];
    
    // Filter for online users and calculate time elapsed
    Object.entries(presenceMap).forEach(([userId, presenceData]) => {
      if (presenceData.online === true) {
        const timeElapsed = Date.now() - presenceData.loginTime;
        users.push({
          userId,
          ...presenceData,
          loginDurationMs: timeElapsed
        });
      }
    });
    
    return { success: true, users };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

**Validation Checks**:
- ✓ All authenticated users can read presence list
- ✓ Each record must have all 6 required fields (enforced by RTDB rules)
- ✓ Filter for online === true

---

### 6. getUserPresence(userId) Operation

**Requirements**: Fetch a single user's presence record

**Implementation**:
```javascript
async getUserPresence(userId) {
  try {
    const snapshot = await firebase.database()
      .ref(`presence/${userId}`)
      .once('value');
    
    if (!snapshot.exists()) {
      return { success: true, presence: null };
    }
    
    const presenceData = snapshot.val();
    const timeElapsed = Date.now() - presenceData.loginTime;
    
    return {
      success: true,
      presence: {
        userId,
        ...presenceData,
        loginDurationMs: timeElapsed
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

**Validation Checks**:
- ✓ All authenticated users can read individual records
- ✓ Record is automatically validated by RTDB rules

---

### 7. onPresenceChanged() Operation

**Requirements**: Subscribe to real-time presence updates

**Implementation**:
```javascript
onPresenceChanged(callback) {
  try {
    const presenceRef = firebase.database().ref('presence');
    
    // Listen for all presence changes
    presenceRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const presenceMap = snapshot.val();
        const users = [];
        
        Object.entries(presenceMap).forEach(([userId, presenceData]) => {
          users.push({
            userId,
            ...presenceData,
            loginDurationMs: Date.now() - presenceData.loginTime
          });
        });
        
        callback({ success: true, users });
      } else {
        callback({ success: true, users: [] });
      }
    });
    
    // Return unsubscribe function for cleanup
    return () => {
      presenceRef.off('value');
    };
  } catch (error) {
    callback({ success: false, error: error.message });
    return () => {};
  }
}
```

**Validation Checks**:
- ✓ All authenticated users can subscribe to presence changes
- ✓ Updates only include valid records (pre-validated by RTDB rules)

---

### 8. onDisconnect() Handler

**Requirements**: Set online=false when browser closes unexpectedly

**Implementation**:
```javascript
async setupOnDisconnectHandler(userId) {
  try {
    // Set up handler to execute when user disconnects
    const userPresenceRef = firebase.database()
      .ref(`presence/${userId}`);
    
    // When connection is lost, update online to false
    await userPresenceRef.child('online').onDisconnect().set(false);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

**Validation Checks**:
- ✓ Only modifies the 'online' field
- ✓ Updates to false (boolean)
- ✓ Executes only when connection is lost

---

### 9. cleanupOrphanedRecords() Operation

**Requirements**: Delete presence records older than 24 hours

**Implementation**:
```javascript
async cleanupOrphanedRecords(maxAgeMs = 24 * 60 * 60 * 1000) {
  try {
    const snapshot = await firebase.database()
      .ref('presence')
      .once('value');
    
    if (!snapshot.exists()) {
      return { success: true, deletedCount: 0 };
    }
    
    const presenceMap = snapshot.val();
    const cutoffTime = Date.now() - maxAgeMs;
    let deletedCount = 0;
    
    const updates = {};
    Object.entries(presenceMap).forEach(([userId, presenceData]) => {
      if (presenceData.loginTime < cutoffTime) {
        // Mark for deletion
        updates[`presence/${userId}`] = null;
        deletedCount++;
      }
    });
    
    if (deletedCount > 0) {
      // Batch update to delete all orphaned records
      await firebase.database().ref().update(updates);
    }
    
    return { success: true, deletedCount };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

**Validation Checks**:
- ✓ Can only be run by admin users (implement app-level check)
- ✓ Deletes records with loginTime older than 24 hours
- ✓ Uses batch update for efficiency

---

## Error Handling

### Common Errors and Resolution

| Error | Cause | Resolution |
|-------|-------|-----------|
| Permission denied | User doesn't own record or not authenticated | Ensure auth.uid matches userId |
| Validation failed | Field type/value invalid | Check all fields match requirements |
| displayName too long | String exceeds 255 characters | Truncate to 255 characters |
| Invalid role | Role not in predefined list | Use only valid roles |
| Invalid status | Status not in (active, away, idle, offline) | Use only valid statuses |
| lastActivityTime < loginTime | Time travel attempt | Ensure currentTime >= loginTime |

---

## Testing Presence Operations

### Unit Test Template

```javascript
describe('PresenceService with RTDB Rules', () => {
  let presenceService;
  let userId;
  let userAuth;
  
  beforeEach(async () => {
    // Initialize Firebase and authenticate
    await firebase.auth().signInWithEmailAndPassword(email, password);
    userAuth = firebase.auth().currentUser;
    userId = userAuth.uid;
    presenceService = new PresenceService();
  });
  
  afterEach(async () => {
    // Clean up
    await firebase.database().ref(`presence/${userId}`).remove();
    await firebase.auth().signOut();
  });
  
  test('recordLogin creates valid presence record', async () => {
    const result = await presenceService.recordLogin(
      userId,
      'Test User',
      'admin',
      Date.now()
    );
    expect(result.success).toBe(true);
    
    const snapshot = await firebase.database()
      .ref(`presence/${userId}`)
      .once('value');
    const data = snapshot.val();
    
    expect(data.displayName).toBe('Test User');
    expect(data.role).toBe('admin');
    expect(data.online).toBe(true);
    expect(data.status).toBe('active');
  });
  
  test('recordActivity updates lastActivityTime', async () => {
    await presenceService.recordLogin(userId, 'Test User', 'admin', Date.now());
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const result = await presenceService.recordActivity(userId);
    expect(result.success).toBe(true);
    
    const snapshot = await firebase.database()
      .ref(`presence/${userId}/lastActivityTime`)
      .once('value');
    const lastActivityTime = snapshot.val();
    
    expect(lastActivityTime).toBeGreaterThan(Date.now() - 1000);
  });
  
  test('getActiveUsers returns online users', async () => {
    await presenceService.recordLogin(userId, 'Test User', 'admin', Date.now());
    
    const result = await presenceService.getActiveUsers();
    expect(result.success).toBe(true);
    expect(result.users.length).toBeGreaterThan(0);
    
    const currentUser = result.users.find(u => u.userId === userId);
    expect(currentUser).toBeDefined();
    expect(currentUser.online).toBe(true);
  });
});
```

---

## Security Considerations

1. **Authentication Requirement**: All RTDB operations require valid Firebase authentication
2. **User-Scoped Access**: Users can only modify their own presence records
3. **Data Validation**: All field types and values are validated at the database level
4. **No Privilege Escalation**: Users cannot modify their own role via RTDB updates
5. **Temporal Integrity**: lastActivityTime cannot be manipulated to violate constraints

---

## Performance Considerations

1. **Read Performance**: All users can read presence data (O(n) for full list)
2. **Write Performance**: Single user can only write/update their own record
3. **Scaling**: Presence records grow linearly with number of online users
4. **Cleanup**: Run orphaned record cleanup during off-peak hours
5. **Listeners**: Use specific path listeners to minimize bandwidth

---

## References

- Firebase Realtime Database Documentation: https://firebase.google.com/docs/database
- RTDB Security Rules Reference: https://firebase.google.com/docs/rules
- ePay CRM Presence Service Task: 6.1 Implement PresenceService with RTDB Integration
