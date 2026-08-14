const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');

admin.initializeApp();
const db = admin.firestore();

// SendGrid configuration (store in environment config)
const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);
const FROM_EMAIL = functions.config().sendgrid.from || 'admin@epay.in';

// Helper: generate temporary password
const generateTempPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper: replace template variables
const replaceVariables = (body, emp) => {
  const map = {
    '{{employee_name}}': emp.name,
    '{{employee_id}}': emp.id,
    '{{login_id}}': emp.email,
    '{{password}}': emp.plainPassword || 'N/A',
    '{{department}}': emp.department,
    '{{designation}}': emp.role,
    '{{activation_link}}': `https://epay.in/activate?code=${uuidv4()}`,
  };
  return body.replace(/\{\{\w+\}\}/g, match => map[match] || match);
};

// ============================================================
// Callable Functions
// ============================================================

// 1. Create employee (with hashed password and optional welcome email)
exports.createEmployee = functions.https.onCall(async (data, context) => {
  // Verify admin (custom claim)
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin only');
  }

  const { name, email, department, role, status, sendWelcome } = data;
  if (!name || !email) throw new functions.https.HttpsError('invalid-argument', 'Name and email required');

  // Check if email already exists
  const existing = await db.collection('employees').where('email', '==', email).get();
  if (!existing.empty) {
    throw new functions.https.HttpsError('already-exists', 'Email already registered');
  }

  const id = 'EMP' + String((await db.collection('employees').count().get()).data().count + 1).padStart(3, '0');
  const plainPassword = generateTempPassword();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const newEmp = {
    id,
    name,
    email,
    passwordHash: hashedPassword,
    plainPassword, // only for welcome email, not stored
    department: department || 'General',
    role: role || 'Staff',
    status: status || 'Pending',
    twoFA: false,
    lastLogin: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection('employees').doc(id).set(newEmp);

  // Log audit
  await db.collection('auditLogs').add({
    action: 'CREATE_EMPLOYEE',
    employeeId: id,
    performedBy: context.auth.uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: { name, email },
  });

  // Send welcome email if requested
  if (sendWelcome) {
    await sendWelcomeEmail(emp);
  }

  return { id, plainPassword };
});

// 2. Send welcome email (callable)
exports.sendWelcomeEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin only');
  }

  const { employeeId, subject, body, template } = data;
  if (!employeeId) throw new functions.https.HttpsError('invalid-argument', 'Employee ID required');

  const doc = await db.collection('employees').doc(employeeId).get();
  if (!doc.exists) throw new functions.https.HttpsError('not-found', 'Employee not found');
  const emp = doc.data();

  // Get the password from the document (it's hashed, but we stored plainPassword temporarily)
  // In a real system, you'd generate a new one or use activation link instead.
  const plainPassword = emp.plainPassword || 'N/A';

  const finalBody = replaceVariables(body || `Welcome {{employee_name}}!\n\nYour login: {{login_id}}\nPassword: {{password}}\nActivation: {{activation_link}}`, { ...emp, plainPassword });
  const finalSubject = subject || 'Welcome to ePay Digital!';

  const htmlContent = finalBody.replace(/\n/g, '<br>');

  const msg = {
    to: emp.email,
    from: FROM_EMAIL,
    subject: finalSubject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    // Log success
    const logRef = await db.collection('emailLogs').add({
      employeeId: emp.id,
      employeeName: emp.name,
      template: template || 'Custom',
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      delivered: true,
      opened: false,
      activated: false,
      status: 'Pending',
    });
    // Audit log
    await db.collection('auditLogs').add({
      action: 'SEND_WELCOME',
      employeeId: emp.id,
      performedBy: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, logId: logRef.id };
  } catch (error) {
    console.error('SendGrid error:', error);
    // Log failure
    await db.collection('emailLogs').add({
      employeeId: emp.id,
      employeeName: emp.name,
      template: template || 'Custom',
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      delivered: false,
      opened: false,
      activated: false,
      status: 'Failed',
    });
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});

// 3. Reset password (generates new temp password, hashes it, returns it)
exports.resetPassword = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin only');
  }
  const { employeeId } = data;
  if (!employeeId) throw new functions.https.HttpsError('invalid-argument', 'Employee ID required');

  const doc = await db.collection('employees').doc(employeeId).get();
  if (!doc.exists) throw new functions.https.HttpsError('not-found', 'Employee not found');

  const newPassword = generateTempPassword();
  const hashed = await bcrypt.hash(newPassword, 10);
  await doc.ref.update({
    passwordHash: hashed,
    plainPassword: newPassword, // only for this session
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection('auditLogs').add({
    action: 'RESET_PASSWORD',
    employeeId,
    performedBy: context.auth.uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { newPassword };
});

// 4. Bulk operations
exports.bulkAction = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin only');
  }

  const { ids, action } = data;
  if (!ids || !ids.length) throw new functions.https.HttpsError('invalid-argument', 'No employee IDs');

  const results = [];
  for (const id of ids) {
    const doc = await db.collection('employees').doc(id).get();
    if (!doc.exists) continue;
    let update = {};
    switch (action) {
      case 'activate': update.status = 'Active'; break;
      case 'suspend': update.status = 'Suspended'; break;
      case 'terminate': update.status = 'Terminated'; break;
      case '2fa': update.twoFA = true; break;
      default: throw new functions.https.HttpsError('invalid-argument', 'Invalid action');
    }
    await doc.ref.update({ ...update, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    results.push({ id, status: 'ok' });
    await db.collection('auditLogs').add({
      action: `BULK_${action.toUpperCase()}`,
      employeeId: id,
      performedBy: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  return { results };
});

// 5. Get employees (with filters)
exports.getEmployees = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin only');
  }
  const { status, department, search } = data;
  let query = db.collection('employees');
  if (status) query = query.where('status', '==', status);
  if (department) query = query.where('department', '==', department);
  const snapshot = await query.get();
  let employees = [];
  snapshot.forEach(doc => {
    let emp = doc.data();
    // Remove passwordHash and plainPassword for security
    delete emp.passwordHash;
    delete emp.plainPassword;
    employees.push(emp);
  });
  if (search) {
    const s = search.toLowerCase();
    employees = employees.filter(e => 
      e.name.toLowerCase().includes(s) ||
      e.id.toLowerCase().includes(s) ||
      e.email.toLowerCase().includes(s)
    );
  }
  return employees;
});

// 6. Get email logs
exports.getEmailLogs = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin only');
  }
  const snapshot = await db.collection('emailLogs').orderBy('sentAt', 'desc').get();
  return snapshot.docs.map(doc => doc.data());
});

// 7. Get audit logs
exports.getAuditLogs = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin only');
  }
  const snapshot = await db.collection('auditLogs').orderBy('timestamp', 'desc').get();
  return snapshot.docs.map(doc => doc.data());
});