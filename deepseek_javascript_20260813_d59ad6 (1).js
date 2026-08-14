require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ============================================================
// 1. In‑Memory Data Store (replace with DB in production)
// ============================================================
let employees = [
  { id: 'EMP001', name: 'Rahul Sharma', email: 'rahul.sharma@epay.in', password: '$2a$10$abc123...', dept: 'Telecalling', role: 'Telecaller', status: 'Active', twoFA: true, lastLogin: '2026-08-13 10:42' },
  { id: 'EMP002', name: 'Priya Mehta', email: 'priya.mehta@epay.in', password: '$2a$10$def456...', dept: 'HR', role: 'HR Manager', status: 'Active', twoFA: true, lastLogin: '2026-08-13 09:15' },
  // ... add more as needed
];

// Email logs
let emailLogs = [];

// Audit logs
let auditLogs = [];

// ============================================================
// 2. Helper Functions
// ============================================================
const generateTempPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const hashPassword = async (plain) => {
  return await bcrypt.hash(plain, 10);
};

const verifyPassword = async (plain, hash) => {
  return await bcrypt.compare(plain, hash);
};

// JWT verification middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email function
const sendEmail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html,
  });
  return info;
};

// Replace template variables
const replaceVariables = (body, emp) => {
  const map = {
    '{{employee_name}}': emp.name,
    '{{employee_id}}': emp.id,
    '{{login_id}}': emp.email,
    '{{password}}': emp.plainPassword || 'N/A',
    '{{department}}': emp.dept,
    '{{designation}}': emp.role,
    '{{activation_link}}': `https://epay.in/activate?code=${uuidv4()}`,
  };
  return body.replace(/\{\{\w+\}\}/g, match => map[match] || match);
};

// ============================================================
// 3. Routes
// ============================================================

// --- Auth ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  // Hardcoded super admin (in production, check DB)
  const adminUser = { username: 'admin', passwordHash: await bcrypt.hash('admin123', 10) };
  const isValid = await verifyPassword(password, adminUser.passwordHash);
  if (username === 'admin' && isValid) {
    const token = jwt.sign({ username: 'admin', role: 'super_admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { username: 'admin' } });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// --- Employees ---
app.get('/api/employees', authenticate, (req, res) => {
  const { status, dept, search } = req.query;
  let filtered = employees;
  if (status) filtered = filtered.filter(e => e.status === status);
  if (dept) filtered = filtered.filter(e => e.dept === dept);
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(e =>
      e.name.toLowerCase().includes(s) ||
      e.id.toLowerCase().includes(s) ||
      e.email.toLowerCase().includes(s)
    );
  }
  res.json(filtered);
});

app.get('/api/employees/:id', authenticate, (req, res) => {
  const emp = employees.find(e => e.id === req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  res.json(emp);
});

app.post('/api/employees', authenticate, async (req, res) => {
  const { name, email, dept, role, status } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  const id = 'EMP' + String(employees.length + 1).padStart(3, '0');
  const plainPassword = generateTempPassword();
  const hashedPassword = await hashPassword(plainPassword);
  const newEmp = {
    id,
    name,
    email,
    password: hashedPassword,
    plainPassword, // only for welcome email, not stored
    dept: dept || 'General',
    role: role || 'Staff',
    status: status || 'Pending',
    twoFA: false,
    lastLogin: '—',
  };
  employees.push(newEmp);
  auditLogs.push({ action: 'CREATE_EMPLOYEE', employeeId: id, performedBy: req.user.username, timestamp: new Date() });
  res.status(201).json(newEmp);
});

app.put('/api/employees/:id', authenticate, async (req, res) => {
  const emp = employees.find(e => e.id === req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  const { name, email, dept, role, status, twoFA } = req.body;
  if (name) emp.name = name;
  if (email) emp.email = email;
  if (dept) emp.dept = dept;
  if (role) emp.role = role;
  if (status) emp.status = status;
  if (twoFA !== undefined) emp.twoFA = twoFA;
  auditLogs.push({ action: 'UPDATE_EMPLOYEE', employeeId: emp.id, performedBy: req.user.username, timestamp: new Date() });
  res.json(emp);
});

app.post('/api/employees/:id/reset-password', authenticate, async (req, res) => {
  const emp = employees.find(e => e.id === req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  const newPassword = generateTempPassword();
  emp.password = await hashPassword(newPassword);
  emp.plainPassword = newPassword;
  auditLogs.push({ action: 'RESET_PASSWORD', employeeId: emp.id, performedBy: req.user.username, timestamp: new Date() });
  res.json({ message: 'Password reset', newPassword });
});

// --- Bulk operations ---
app.post('/api/employees/bulk', authenticate, async (req, res) => {
  const { ids, action } = req.body;
  if (!ids || !ids.length) return res.status(400).json({ error: 'No employee IDs provided' });
  const results = [];
  for (const id of ids) {
    const emp = employees.find(e => e.id === id);
    if (!emp) continue;
    switch (action) {
      case 'activate':
        emp.status = 'Active';
        break;
      case 'suspend':
        emp.status = 'Suspended';
        break;
      case 'terminate':
        emp.status = 'Terminated';
        break;
      case 'reset':
        const newPassword = generateTempPassword();
        emp.password = await hashPassword(newPassword);
        emp.plainPassword = newPassword;
        break;
      case '2fa':
        emp.twoFA = true;
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    results.push({ id, status: 'ok' });
    auditLogs.push({ action: `BULK_${action.toUpperCase()}`, employeeId: id, performedBy: req.user.username, timestamp: new Date() });
  }
  res.json({ results });
});

// --- Welcome email ---
app.post('/api/employees/:id/send-welcome', authenticate, async (req, res) => {
  const emp = employees.find(e => e.id === req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });

  const { subject, body, template } = req.body;
  // If no custom body, use default template
  let finalBody = body || `Welcome {{employee_name}}!\n\nYour login: {{login_id}}\nPassword: {{password}}\nActivation: {{activation_link}}`;
  let finalSubject = subject || 'Welcome to ePay Digital!';

  const htmlContent = replaceVariables(finalBody, emp)
    .replace(/\n/g, '<br>');

  try {
    await sendEmail(emp.email, finalSubject, htmlContent);
    const logEntry = {
      id: 'WEL-' + String(emailLogs.length + 1).padStart(3, '0'),
      empId: emp.id,
      empName: emp.name,
      template: template || 'Custom',
      sent: new Date().toISOString(),
      delivered: true,
      opened: false,
      activated: false,
      status: 'Pending',
    };
    emailLogs.push(logEntry);
    auditLogs.push({ action: 'SEND_WELCOME', employeeId: emp.id, performedBy: req.user.username, timestamp: new Date() });
    res.json({ message: 'Email sent', log: logEntry });
  } catch (error) {
    console.error('Email error:', error);
    const logEntry = {
      id: 'WEL-' + String(emailLogs.length + 1).padStart(3, '0'),
      empId: emp.id,
      empName: emp.name,
      template: template || 'Custom',
      sent: new Date().toISOString(),
      delivered: false,
      opened: false,
      activated: false,
      status: 'Failed',
    };
    emailLogs.push(logEntry);
    res.status(500).json({ error: 'Failed to send email', log: logEntry });
  }
});

// --- Email logs ---
app.get('/api/email-logs', authenticate, (req, res) => {
  res.json(emailLogs);
});

// --- Audit logs ---
app.get('/api/audit-logs', authenticate, (req, res) => {
  res.json(auditLogs);
});

// ============================================================
// 4. Start Server
// ============================================================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});