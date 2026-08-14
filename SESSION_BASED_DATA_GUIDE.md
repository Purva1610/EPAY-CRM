# 🔐 Session-Based Data Management System for ePay CRM

## 📋 Overview

The ePay CRM now features a comprehensive **session-based data management system** that ensures all user data is organized, tracked, and saved according to individual user sessions. Every action, form submission, and data point is now scoped to the specific user session that created it.

## 🎯 Key Features

### **1. Automatic Session Management**
- **Auto-Initialization**: Sessions are automatically created when users visit any page
- **Session Persistence**: Sessions are maintained across page navigation and browser refreshes
- **Anonymous Support**: Guest users get anonymous sessions that can be upgraded to authenticated sessions
- **Smart Recovery**: Sessions are automatically restored from localStorage or Firebase

### **2. Complete Data Scoping**
All data is now organized by session context:
- **📝 Leads** → Saved with `sessionId`, `userId`, and session metadata
- **✈️ Travel Leads** → Scoped to session with full context tracking
- **📊 Form Data** → Each form submission is tagged with session info
- **👤 User Activities** → Every user action is logged with session context
- **⚙️ User Preferences** → Settings are saved per session/user

### **3. Comprehensive Activity Tracking**
Every user action is automatically tracked:
- Page visits and navigation
- Form submissions
- Login/logout events
- Data creation/modification
- Session duration and timing

### **4. Real-time Presence System**
- **🟢 Online Status**: Real-time user presence in Firebase Realtime Database
- **📍 Activity Monitoring**: Last activity time updates automatically
- **🔄 Cross-Tab Sync**: Presence syncs across multiple browser tabs
- **📱 Device Tracking**: Device and browser information captured

## 🏗️ Architecture

### **Session Data Structure**

Each session contains:
```javascript
{
  sessionId: "session_1234567890_abc123def",
  userId: "user@epay.in" | "anonymous_1234567890",
  email: "user@epay.in" | "anonymous@epay.in",
  role: "admin" | "guest" | "hr" | etc.,
  displayName: "User Name" | "Guest User",
  startTime: "2026-08-14T12:30:45.123Z",
  lastActivity: "2026-08-14T12:45:30.456Z",
  endTime: "2026-08-14T14:20:15.789Z", // When session ends
  duration: 6385, // Duration in seconds
  page: "/current-page.html",
  userAgent: "Mozilla/5.0...",
  deviceInfo: {
    platform: "Win32",
    browser: "Chrome",
    screen: { width: 1920, height: 1080 },
    viewport: { width: 1366, height: 768 },
    language: "en-US",
    cookiesEnabled: true
  },
  activities: [
    {
      type: "page_visit",
      timestamp: "2026-08-14T12:30:45.123Z",
      page: "/index.html",
      data: {}
    },
    {
      type: "lead_created",
      timestamp: "2026-08-14T12:35:20.456Z",
      page: "/index.html",
      data: { leadId: "abc123" }
    }
  ],
  data: {
    leads: [
      {
        // Lead data with session context
        sessionId: "session_1234567890_abc123def",
        userId: "user@epay.in",
        sessionData: {
          page: "/index.html",
          timestamp: "2026-08-14T12:35:20.456Z"
        },
        // ... original lead data
      }
    ],
    travelLeads: [ /* Travel leads with session context */ ],
    formData: {
      "contact_form": { /* Form data */ },
      "quote_form": { /* Form data */ }
    },
    userPreferences: {
      "user": { /* User preferences */ }
    },
    temporaryData: {
      /* Temporary session data */
    }
  }
}
```

## 🔥 Firebase Data Organization

### **Firestore Collections**

#### **1. `sessions` Collection**
Stores complete session information:
- **Document ID**: `sessionId`
- **Fields**: Complete session object with all metadata
- **Security**: Users can read/write their own sessions; admins can access all

#### **2. `leads` Collection**
Lead data with session context:
- **Document ID**: Auto-generated
- **Session Fields**: `sessionId`, `userId`, `sessionData`
- **Security**: Users can access leads from their sessions; admins can access all

#### **3. `travel_leads` Collection**
Travel leads with session context:
- **Document ID**: Auto-generated
- **Session Fields**: `sessionId`, `userId`, `sessionData`
- **Security**: Users can access travel leads from their sessions; admins can access all

### **Realtime Database Structure**

#### **`presence` Node**
Real-time user presence tracking:
```
presence/
  ├── user@epay.in/
  │   ├── displayName: "User Name"
  │   ├── role: "admin"
  │   ├── loginTime: 1692013445123
  │   ├── lastActivityTime: 1692013845123
  │   ├── online: true
  │   └── status: "active"
  ├── another@epay.in/
  │   └── ...
```

## 🚀 Implementation Details

### **Session Manager (session-manager.js)**

The `SessionManager` object provides comprehensive session management:

#### **Key Methods:**

```javascript
// Initialize session (auto-called on page load)
await SessionManager.init();

// Get current session
const session = SessionManager.getCurrentSession();

// Save data with session context
await SessionManager.saveData('key', value, 'category');

// Save lead with session context
await SessionManager.saveLead(leadData);

// Save travel lead with session context
await SessionManager.saveTravelLead(travelLeadData);

// Save form data
await SessionManager.saveFormData('formId', formData);

// Get form data
const formData = SessionManager.getFormData('formId');

// Add activity to session
SessionManager.addActivity('action_type', { metadata });

// End session (on logout)
await SessionManager.endSession();

// Get session statistics
const stats = SessionManager.getSessionStats();
```

### **Firebase Data Service Integration**

The `FirebaseDataService` now integrates with `SessionManager`:

```javascript
// All data operations automatically include session context
await FirebaseDataService.saveLead(leadData); // Auto-adds session info
await FirebaseDataService.saveTravelLead(travelLeadData); // Auto-adds session info
await FirebaseDataService.saveFormData('formId', formData); // Auto-adds session info

// Get session-scoped data
const leads = await FirebaseDataService.getLeads(); // Returns leads for current session
const sessionStats = FirebaseDataService.getSessionStats();
```

## 📊 Data Flow Diagram

```
User Action (Form Submit, Login, etc.)
        ↓
SessionManager detects action
        ↓
Adds session context (sessionId, userId, timestamp)
        ↓
Saves to appropriate Firebase collection
        ↓
Firestore: sessions/leads/travel_leads
        ↓
Realtime Database: presence
        ↓
Data is now permanently associated with user session
```

## 🔐 Security & Privacy

### **Session-Based Security**
- **User Isolation**: Users can only access their own session data
- **Admin Override**: Super-admins can access all session data
- **Anonymous Support**: Guest sessions are isolated and can be upgraded
- **Automatic Cleanup**: Old sessions are automatically managed

### **Data Privacy**
- **Session Scoping**: All data is tied to specific sessions
- **User Consent**: Session data follows user authentication state
- **Compliance**: Supports GDPR and data privacy requirements
- **Audit Trail**: Complete activity logging for compliance

## 🧪 Testing Session-Based Data

### **Test 1: Create Lead with Session Context**
1. Open `index.html`
2. Submit a lead form
3. Check Firebase Console → Firestore → `leads` collection
4. Verify lead has `sessionId`, `userId`, and `sessionData` fields
5. Check Firebase Console → Firestore → `sessions` collection
6. Verify session has the lead in `data.leads` array

### **Test 2: Session Persistence Across Pages**
1. Submit a form on `index.html`
2. Navigate to another page
3. Submit another form
4. Check that both forms have the same `sessionId`
5. Verify session activities include both page visits

### **Test 3: User Login Session Upgrade**
1. Visit site as guest (anonymous session)
2. Submit a form (anonymous session)
3. Login via staff portal
4. Check that session is upgraded with user info
5. Verify subsequent forms use authenticated session

### **Test 4: Real-time Presence**
1. Login as staff user
2. Check Firebase Console → Realtime Database → `presence`
3. Verify user appears with online status
4. Open another browser tab and login
5. Verify presence updates for multiple sessions
6. Logout from one tab and check presence updates

## 📱 Session Lifecycle

### **1. Session Creation**
- Triggered on first page visit
- Generates unique `sessionId`
- Captures device and browser info
- Creates anonymous session by default

### **2. Session Activity**
- Heartbeat updates every 30 seconds
- Activity tracking on user actions
- Page navigation logging
- Form submission tracking

### **3. Session Authentication**
- Login upgrades anonymous session to authenticated
- User info merged into session data
- Presence activated in Realtime Database
- Security permissions updated

### **4. Session Termination**
- Manual logout ends session
- Session duration calculated
- Final state saved to Firebase
- Presence removed from Realtime Database
- Local session data cleared

## 🛠️ Advanced Usage

### **Custom Session Listeners**
```javascript
// Listen to session events
SessionManager.addListener((event, data) => {
    switch(event) {
        case 'sessionInitialized':
            console.log('Session ready:', data.sessionId);
            break;
        case 'data_saved':
            console.log('Data saved:', data);
            break;
    }
});
```

### **Session Statistics**
```javascript
const stats = SessionManager.getSessionStats();
console.log('Session Duration:', stats.duration, 'seconds');
console.log('Activities:', stats.activitiesCount);
console.log('Leads Created:', stats.leadsCount);
console.log('Pages Visited:', stats.pagesVisited);
```

### **Manual Session Management**
```javascript
// Create custom session data
await SessionManager.saveData('customKey', customValue, 'temporaryData');

// Save user preferences
await SessionManager.savePreferences({ theme: 'dark', language: 'en' });

// Get user preferences
const prefs = SessionManager.getPreferences();
```

## 📈 Benefits of Session-Based Management

### **1. Complete Data Context**
- Every data point has full session context
- Complete audit trail for all user actions
- Device and browser information captured
- Timing and duration tracking

### **2. Enhanced Security**
- User data isolation by session
- Granular access control
- Automatic session cleanup
- Privacy compliance support

### **3. Better Analytics**
- Session-based user behavior analysis
- Conversion tracking per session
- Activity pattern recognition
- Device and browser usage stats

### **4. Improved User Experience**
- Seamless session persistence
- Cross-page data continuity
- Offline support with fallback
- Real-time presence features

## 🔄 Migration from localStorage

### **Before (localStorage only):**
```javascript
// Old way - no session context
localStorage.setItem('epay-leads', JSON.stringify(leads));
```

### **After (Session-based Firebase):**
```javascript
// New way - automatic session context
await FirebaseDataService.saveLead(leadData);
// Automatically includes: sessionId, userId, timestamp, device info
```

## 🚨 Troubleshooting

### **Session Not Initializing**
- Check browser console for errors
- Verify Firebase SDK is loaded
- Ensure `session-manager.js` is included
- Check Firebase credentials in `.env`

### **Data Not Saving with Session Context**
- Verify `SessionManager.init()` is called
- Check that `FirebaseDataService` is using session methods
- Ensure Firebase security rules allow writes
- Check browser console for Firebase errors

### **Presence Not Updating**
- Verify Realtime Database is enabled in Firebase
- Check security rules for presence node
- Ensure user is authenticated
- Check Firebase connection status

## 📝 Next Steps

### **1. Add Session Management to All Pages**
Include these scripts on every page:
```html
<script src="firebase-config.js"></script>
<script src="session-manager.js"></script>
```

### **2. Update All Data Operations**
Replace localStorage calls with session-based methods:
```javascript
// Replace
localStorage.setItem('key', value);

// With
await SessionManager.saveData('key', value, 'category');
```

### **3. Add Logout Handlers**
Implement proper session termination:
```javascript
async function handleLogout() {
    await SessionManager.endSession();
    // Clear other data and redirect
}
```

### **4. Monitor Session Data**
Use Firebase Console to monitor:
- Session creation and termination
- Data organization by session
- User activity patterns
- Presence status changes

---

**🎉 Your ePay CRM now has complete session-based data management! Every user action, form submission, and data point is properly scoped and organized by user session for enhanced security, analytics, and user experience.**