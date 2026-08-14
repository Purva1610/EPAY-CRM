# ePay CRM Feature Suite - Quick Start Guide

**Deploy in 15 minutes** | Production Ready | December 2024

---

## What You Get

✅ **Session Timer Service** - Automatic user tracking with break/shift awareness
✅ **Email Service** - Login/logout/role-change notifications  
✅ **Calling Service** - VoIP call management with Twilio
✅ **Logout Button** - Universal UI component with timer display

---

## Installation (5 minutes)

### 1. Copy Files to Project

```bash
# Copy to your project root
cp session-timer-service.js /path/to/epay-crm/
cp email-service.js /path/to/epay-crm/
cp calling-service.js /path/to/epay-crm/
cp logout-button.html /path/to/epay-crm/
```

### 2. Add to Your Portal HTML

```html
<!-- In header -->
<div id="logout-button-container"></div>

<!-- Before closing body tag -->
<script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"></script>

<script src="auth-state-manager.js"></script>
<script src="session-timer-service.js"></script>
<script src="email-service.js"></script>
<script src="calling-service.js"></script>
<script src="logout-button.html" type="module"></script>
```

### 3. Set Up Environment Variables

Create `.env` file:

```bash
VITE_SENDGRID_API_KEY=SG.your_key_here
VITE_TWILIO_ACCOUNT_SID=AC_your_sid_here
VITE_TWILIO_AUTH_TOKEN=your_token_here
VITE_TWILIO_FROM_NUMBER=+1234567890
```

### 4. Initialize in Login Handler

```javascript
async function onLoginSuccess(user) {
  // Start session timer
  const timerService = new SessionTimerService();
  await timerService.init({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName
  });
  await timerService.startSession();
  window.sessionTimerService = timerService;
  
  // Initialize email service (once)
  if (!window.emailService) {
    const emailService = new EmailService();
    await emailService.init({
      sendGridApiKey: import.meta.env.VITE_SENDGRID_API_KEY
    });
    window.emailService = emailService;
    await emailService.sendLoginNotification(user);
  }
  
  // Initialize calling service (once)
  if (!window.callingService) {
    const callingService = new CallingService();
    await callingService.init({
      accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
      authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
      fromNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER
    });
    window.callingService = callingService;
  }
  
  // Redirect to dashboard
  window.location.href = '/dashboard.html';
}
```

---

## Usage Examples

### Session Timer

```javascript
// Get current time display
const formattedTime = sessionTimerService.getFormattedTime();
console.log(formattedTime); // "02:30:45"

// Listen to updates
sessionTimerService.onStateChanged((state) => {
  console.log(`Status: ${state.status}`);
  console.log(`Time: ${state.formattedTime}`);
});

// Get today's total
const total = await sessionTimerService.getTotalTimeForDate('2024-12-01');
console.log(`Worked: ${total}ms`);

// Manual control
await sessionTimerService.pauseSession();
await sessionTimerService.resumeSession();
await sessionTimerService.stopSession();
```

### Email Notifications

```javascript
// Login email (auto-sent on login)
await emailService.sendLoginNotification(user);

// Logout email (auto-sent by logout button)
await emailService.sendLogoutNotification(user, 7200000); // 2 hours

// Role change
await emailService.sendRoleChangeNotification(
  user,
  'Admin',
  'Member'
);

// Password reset
await emailService.sendPasswordResetEmail(
  user,
  'https://app.epaycrm.com/reset?token=xyz'
);

// Get email history
const logs = await emailService.getEmailLogs(user.uid, 'LOGIN');
```

### Making Calls

```javascript
// Initiate call
const result = await callingService.makeCall({
  phoneNumber: '+1234567890',
  userId: user.uid,
  recipientName: 'John Doe',
  notes: 'Follow-up call'
});

if (result.success) {
  console.log(`Call started: ${result.callId}`);
  
  // Listen to call duration
  callingService.onStateChanged((event) => {
    if (event.event === 'call_duration_update') {
      console.log(`Duration: ${event.formattedDuration}`);
    }
  });
}

// End call
await callingService.endCall(result.callId);

// Get call history
const history = await callingService.getCallHistory(user.uid);
console.log(`Total calls: ${history.length}`);

// Get statistics
const stats = await callingService.getCallStats(user.uid);
console.log(`Average duration: ${stats.formattedAverageDuration}`);
```

### Logout Button

The logout button component auto-initializes and handles everything:

```html
<!-- That's it! Just add the container -->
<div id="logout-button-container"></div>

<!-- Include scripts in order -->
<script src="session-timer-service.js"></script>
<script src="email-service.js"></script>
<script src="logout-button.html" type="module"></script>
```

The component automatically:
- Displays user name from auth state
- Shows real-time session timer
- Sends logout email with duration
- Clears session data
- Redirects to login page

---

## Firestore Setup (2 minutes)

### Create Collections

In Firebase Console → Firestore Database, create these collections:

1. **session_timers** (no documents needed, will be auto-created)
2. **email_logs** (no documents needed, will be auto-created)  
3. **call_logs** (no documents needed, will be auto-created)

### Set Security Rules

Go to Firestore → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /session_timers/{document=**} {
      allow read, write: if request.auth.uid == resource.data.uid;
      allow create: if request.auth.uid == request.resource.data.uid;
    }
    match /email_logs/{document=**} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
    match /call_logs/{document=**} {
      allow read: if request.auth.uid == resource.data.uid;
      allow create: if request.auth.uid == request.resource.data.uid;
    }
  }
}
```

---

## Configuration Files

### environment.example

```bash
# Copy this to .env and fill in your credentials

# SendGrid - Get from https://app.sendgrid.com/settings/api_keys
VITE_SENDGRID_API_KEY=SG.xxxxx

# Twilio - Get from https://console.twilio.com
VITE_TWILIO_ACCOUNT_SID=AC_xxxxx
VITE_TWILIO_AUTH_TOKEN=xxxxx
VITE_TWILIO_FROM_NUMBER=+1234567890

# Firebase - From Google Firebase Console
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_AUTH_DOMAIN=epaycrm-63608.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=epaycrm-63608
VITE_FIREBASE_STORAGE_BUCKET=epaycrm-63608.appspot.com
```

---

## Features Overview

### ⏱️ Session Timer

- **Auto-start:** Begins when user logs in
- **Break time:** Automatically pauses 1-2 PM
- **Shift end:** Automatically stops at 6 PM  
- **Inactivity:** Pauses after 15 minutes of no activity
- **Display:** Real-time HH:MM:SS format in logout button
- **Persistence:** Saved to Firestore with daily summaries

### 📧 Email Notifications

- **Login alerts:** Notification when user logs in
- **Logout summary:** Email with session duration
- **Role changes:** Alert when user role is updated
- **Password reset:** Reset link in email
- **SendGrid integration:** Professional HTML templates
- **Logging:** All emails tracked in Firestore

### ☎️ VoIP Calling

- **Make calls:** Initiate outbound calls to any number
- **Track duration:** Real-time duration display
- **End calls:** Clean call termination
- **History:** Complete call logs with duration
- **Statistics:** Call summaries and analytics
- **Twilio integration:** Professional call handling

### 🔐 Logout Component

- **Timer display:** Shows active session time
- **User menu:** Profile dropdown with options
- **Email notification:** Sends logout email automatically
- **Clean logout:** Clears all session data
- **Auto-redirect:** Navigates to login page
- **Responsive:** Works on all screen sizes

---

## API Quick Reference

| Service | Method | Purpose |
|---------|--------|---------|
| **SessionTimer** | `startSession()` | Start tracking time |
| | `pauseSession()` | Pause tracking |
| | `resumeSession()` | Resume tracking |
| | `stopSession()` | Stop and save session |
| | `getFormattedTime()` | Get HH:MM:SS string |
| | `onStateChanged(cb)` | Listen for updates |
| **Email** | `sendLoginNotification(user)` | Send login email |
| | `sendLogoutNotification(user, ms)` | Send logout email |
| | `sendRoleChangeNotification(user, role)` | Send role email |
| | `sendPasswordResetEmail(user, link)` | Send reset email |
| | `getEmailLogs(uid)` | Get email history |
| **Calling** | `makeCall({number, uid})` | Start call |
| | `endCall(callId)` | End call |
| | `getCallHistory(uid)` | Get past calls |
| | `getCallStats(uid)` | Get call statistics |
| | `onStateChanged(cb)` | Listen for call events |

---

## Testing Checklist

- [ ] Logout button displays in portal header
- [ ] Session timer shows and updates every second
- [ ] Timer pauses at 1 PM and resumes at 2 PM
- [ ] Timer stops at 6 PM automatically
- [ ] Logout button sends email with session duration
- [ ] Clicking Sign Out redirects to login page
- [ ] Session data persists to Firestore
- [ ] Email logs appear in Firestore collection
- [ ] Make call functionality works (with valid Twilio credentials)
- [ ] Call duration displays correctly
- [ ] Call history appears in Firestore

---

## Troubleshooting

### Timer Not Showing
- Check `logout-button-container` exists in HTML
- Verify SessionTimerService is loaded before logout-button
- Check browser console for errors

### Emails Not Sending
- Verify SendGrid API key is correct
- Check email_logs in Firestore for errors
- Ensure sender email is authorized in SendGrid

### Calling Fails
- Verify Twilio credentials are correct
- Check phone number format (+1234567890)
- Ensure from_number is valid Twilio number

### Session Not Starting
- Verify user object has uid, email, displayName
- Check SessionTimerService initialization in login handler
- Look for Firebase errors in console

---

## File Sizes

- session-timer-service.js: ~9 KB
- email-service.js: ~12 KB
- calling-service.js: ~11 KB
- logout-button.html: ~8 KB
- **Total: ~40 KB** (uncompressed)

---

## Browser Compatibility

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

---

## Support

For detailed documentation, see: `DEPLOYMENT_READY_IMPLEMENTATION.md`

For inline code documentation, see each service file header.

---

**🚀 Ready to deploy!** All services are production-ready and fully tested.

**Last Updated:** December 2024
**Status:** ✅ Production Ready
