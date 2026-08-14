// Example: Login
async function loginAdmin(username, password) {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    return data;
  }
  throw new Error('Login failed');
}

// Example: Send welcome email
async function sendWelcomeEmail(empId, subject, body, template) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/employees/${empId}/send-welcome`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ subject, body, template })
  });
  return res.json();
}