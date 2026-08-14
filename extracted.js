        // ============================================================
        //  DATA STORE (localStorage)
        // ============================================================
        const DB_KEY = 'crm_hr_data';

        function defaultDB() {
            return {
                users: [
                    { id: 1, name: 'Admin User', email: 'admin@crm.com', role: 'admin', password: 'admin123',
                        avatar: 'A' },
                    { id: 2, name: 'HR Manager', email: 'hr@crm.com', role: 'hr', password: 'hr123', avatar: 'H' },
                    { id: 3, name: 'Emily Chen', email: 'emp@crm.com', role: 'employee', password: 'emp123',
                        avatar: 'E' },
                    { id: 4, name: 'Michael Torres', email: 'michael@crm.com', role: 'employee', password: 'emp123',
                        avatar: 'M' },
                    { id: 5, name: 'Sarah Kim', email: 'sarah@crm.com', role: 'employee', password: 'emp123',
                        avatar: 'S' },
                ],
                employees: [
                    { id: 1, name: 'Emily Chen', email: 'emp@crm.com', department: 'Engineering',
                        position: 'Senior Developer', status: 'active', joined: '2023-06-01',
                    phone: '+1 234 567 890' },
                    { id: 2, name: 'Michael Torres', email: 'michael@crm.com', department: 'Sales',
                        position: 'Sales Manager', status: 'active', joined: '2022-11-15',
                    phone: '+1 345 678 901' },
                    { id: 3, name: 'Sarah Kim', email: 'sarah@crm.com', department: 'Marketing',
                        position: 'Marketing Lead', status: 'active', joined: '2023-09-10',
                    phone: '+1 456 789 012' },
                    { id: 4, name: 'James Okafor', email: 'james@crm.com', department: 'Engineering',
                        position: 'DevOps Engineer', status: 'pending', joined: '2024-01-20',
                    phone: '+1 567 890 123' },
                    { id: 5, name: 'Priya Sharma', email: 'priya@crm.com', department: 'HR',
                        position: 'HR Coordinator', status: 'active', joined: '2023-04-05',
                    phone: '+1 678 901 234' },
                    { id: 6, name: 'Alex Rivera', email: 'alex@crm.com', department: 'Design',
                        position: 'UI/UX Designer', status: 'inactive', joined: '2022-08-22',
                    phone: '+1 789 012 345' },
                ],
                tasks: [
                    { id: 1, title: 'Design new onboarding flow', description: 'Create a seamless onboarding experience for new hires.',
                        assignedTo: 1, assignedByName: 'Emily Chen', status: 'in progress', priority: 'high',
                        dueDate: '2026-08-15', createdBy: 'Admin' },
                    { id: 2, title: 'Q3 Sales Report', description: 'Compile and present Q3 sales performance metrics.',
                        assignedTo: 2, assignedByName: 'Michael Torres', status: 'pending', priority: 'medium',
                        dueDate: '2026-08-20', createdBy: 'Admin' },
                    { id: 3, title: 'Update employee handbook', description: 'Revise company policies and benefits section.',
                        assignedTo: 5, assignedByName: 'Priya Sharma', status: 'completed', priority: 'low',
                        dueDate: '2026-07-30', createdBy: 'HR Manager' },
                    { id: 4, title: 'OKR planning for Q4', description: 'Define objectives and key results for the next quarter.',
                        assignedTo: 3, assignedByName: 'Sarah Kim', status: 'pending', priority: 'high',
                        dueDate: '2026-09-01', createdBy: 'Admin' },
                    { id: 5, title: 'Fix login page bug', description: 'Resolve authentication issues on the employee portal.',
                        assignedTo: 4, assignedByName: 'James Okafor', status: 'in progress', priority: 'critical',
                        dueDate: '2026-08-10', createdBy: 'Admin' },
                ],
                attendance: [
                    { id: 1, employeeId: 1, date: '2026-08-01', status: 'present' },
                    { id: 2, employeeId: 2, date: '2026-08-01', status: 'present' },
                    { id: 3, employeeId: 3, date: '2026-08-01', status: 'absent' },
                    { id: 4, employeeId: 4, date: '2026-08-01', status: 'present' },
                    { id: 5, employeeId: 5, date: '2026-08-01', status: 'present' },
                    { id: 6, employeeId: 1, date: '2026-08-02', status: 'present' },
                    { id: 7, employeeId: 2, date: '2026-08-02', status: 'present' },
                    { id: 8, employeeId: 3, date: '2026-08-02', status: 'present' },
                    { id: 9, employeeId: 4, date: '2026-08-02', status: 'leave' },
                    { id: 10, employeeId: 5, date: '2026-08-02', status: 'present' },
                ],
                performance: [
                    { id: 1, employeeId: 1, reviewer: 'Admin', date: '2026-07-15', rating: 4.5,
                        comments: 'Excellent technical skills and teamwork.' },
                    { id: 2, employeeId: 2, reviewer: 'Admin', date: '2026-07-10', rating: 4.0,
                        comments: 'Strong sales performance, leadership.' },
                    { id: 3, employeeId: 3, reviewer: 'HR Manager', date: '2026-06-28', rating: 3.5,
                        comments: 'Good creativity, needs more data-driven approach.' },
                ],
                recruitment: [
                    { id: 1, position: 'Senior React Developer', department: 'Engineering', status: 'open',
                        applicants: 24, posted: '2026-07-01' },
                    { id: 2, position: 'Product Manager', department: 'Product', status: 'interviewing',
                        applicants: 18, posted: '2026-07-10' },
                    { id: 3, position: 'HR Business Partner', department: 'HR', status: 'closed', applicants: 12,
                        posted: '2026-06-15' },
                ],
                payroll: [
                    { id: 1, employeeId: 1, month: 'August 2026', salary: 8500, bonus: 500, deductions: 200,
                        net: 8800 },
                    { id: 2, employeeId: 2, month: 'August 2026', salary: 7200, bonus: 300, deductions: 150,
                        net: 7350 },
                    { id: 3, employeeId: 3, month: 'August 2026', salary: 6800, bonus: 200, deductions: 180,
                        net: 6820 },
                ],
                nextId: { employee: 7, task: 6, attendance: 11, performance: 4, recruitment: 4, payroll: 4 }
            };
        }

        function loadDB() {
            try {
                const raw = localStorage.getItem(DB_KEY);
                if (!raw) return defaultDB();
                const data = JSON.parse(raw);
                const def = defaultDB();
                for (const k in def) { if (!data[k]) data[k] = def[k]; }
                return data;
            } catch (e) {
                console.warn('Failed to load DB, using default.', e);
                return defaultDB();
            }
        }

        function saveDB() {
            localStorage.setItem(DB_KEY, JSON.stringify(db));
        }

        let db = loadDB();
        let currentUser = null;
        let currentPage = 'dashboard';

        // ============================================================
        //  HELPERS
        // ============================================================
        function genId(collection) {
            const key = collection + 'Id';
            if (!db.nextId) db.nextId = {};
            if (!db.nextId[key]) db.nextId[key] = 1;
            return db.nextId[key]++;
        }

        function getEmployeeName(id) {
            const e = db.employees.find(emp => emp.id === id);
            return e ? e.name : 'Unknown';
        }

        function getEmployee(id) { return db.employees.find(e => e.id === id); }

        function getUserByEmail(email) { return db.users.find(u => u.email === email); }

        function formatDate(d) {
            if (!d) return 'â€”';
            const dt = new Date(d);
            return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        function todayStr() { return new Date().toISOString().slice(0, 10); }

        function toast(msg, type = 'info') {
            const container = document.getElementById('toastContainer');
            const icons = { info: 'fa-circle-info', success: 'fa-check-circle', error: 'fa-exclamation-circle',
                warning: 'fa-triangle-exclamation' };
            const el = document.createElement('div');
            el.className = `toast ${type}`;
            el.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${msg}</span>
            <button class="toast-close"><i class="fas fa-xmark"></i></button>
          `;
            el.querySelector('.toast-close').addEventListener('click', () => el.remove());
            container.appendChild(el);
            setTimeout(() => { if (el.parentNode) el.remove(); }, 4000);
        }

        function showModal(html) {
            document.getElementById('modalContent').innerHTML = html;
            document.getElementById('modalOverlay').classList.add('open');
        }

        function closeModal() {
            document.getElementById('modalOverlay').classList.remove('open');
        }
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeModal();
        });

        // ============================================================
        //  AUTH
        // ============================================================
        function login(email, password) {
            email = email.trim().toLowerCase();
            const user = db.users.find(u => u.email.toLowerCase() === email && u.password === password);
            if (!user) {
                document.getElementById('loginError').textContent = 'Invalid email or password.';
                return false;
            }
            currentUser = user;
            document.getElementById('loginScreen').classList.add('hidden');
            renderApp();
            toast(`Welcome back, ${user.name}!`, 'success');
            return true;
        }

        function logout() {
            currentUser = null;
            document.getElementById('loginScreen').classList.remove('hidden');
            document.getElementById('loginError').textContent = '';
            document.getElementById('loginEmail').value = 'admin@crm.com';
            document.getElementById('loginPassword').value = 'admin123';
        }

        function resetData() {
            if (confirm('This will reset all data to default. Are you sure?')) {
                localStorage.removeItem(DB_KEY);
                db = defaultDB();
                saveDB();
                toast('Data reset to default. You can now log in.', 'success');
                document.getElementById('loginError').textContent = '';
                document.getElementById('loginEmail').value = 'admin@crm.com';
                document.getElementById('loginPassword').value = 'admin123';
            }
        }
        document.getElementById('resetDataBtn').addEventListener('click', resetData);

        // ============================================================
        //  RENDER ENGINE
        // ============================================================
        function renderApp() {
            if (!currentUser) {
                document.getElementById('loginScreen').classList.remove('hidden');
                return;
            }
            updateUserUI();
            navigateTo(currentPage);
            updateTaskBadge();
        }

        function updateUserUI() {
            if (!currentUser) return;
            document.getElementById('userAvatar').textContent = currentUser.avatar || currentUser.name[0];
            document.getElementById('userName').textContent = currentUser.name;
            document.getElementById('userRole').textContent =
                currentUser.role === 'admin' ? 'Administrator' :
                currentUser.role === 'hr' ? 'HR Manager' : 'Employee';
        }

        function updateTaskBadge() {
            const badge = document.getElementById('taskBadge');
            const pending = db.tasks.filter(t => t.status === 'pending' || t.status === 'in progress').length;
            badge.textContent = pending;
            badge.style.display = pending > 0 ? 'inline' : 'none';
        }

        function navigateTo(page) {
            currentPage = page;
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');

            const titles = {
                dashboard: 'Dashboard',
                employees: 'Employees',
                tasks: 'Tasks',
                attendance: 'Attendance',
                performance: 'Performance Reviews',
                recruitment: 'Recruitment',
                payroll: 'Payroll',
                documents: 'Documents'
            };
            document.getElementById('pageTitle').innerHTML =
                `${titles[page] || 'Dashboard'} <small>${page === 'dashboard' ? 'overview' : 'management'}</small>`;

            const container = document.getElementById('pageContent');
            switch (page) {
                case 'dashboard':
                    renderDashboard(container);
                    break;
                case 'employees':
                    renderEmployees(container);
                    break;
                case 'tasks':
                    renderTasks(container);
                    break;
                case 'attendance':
                    renderAttendance(container);
                    break;
                case 'performance':
                    renderPerformance(container);
                    break;
                case 'recruitment':
                    renderRecruitment(container);
                    break;
                case 'payroll':
                    renderPayroll(container);
                    break;
                case 'documents':
                    renderDocuments(container);
                    break;
                default:
                    container.innerHTML = '<p>Page not found.</p>';
            }
        }

        // ============================================================
        //  DASHBOARD
        // ============================================================
        function renderDashboard(container) {
            const totalEmp = db.employees.length;
            const activeEmp = db.employees.filter(e => e.status === 'active').length;
            const pendingTasks = db.tasks.filter(t => t.status === 'pending' || t.status === 'in progress').length;
            const openRoles = db.recruitment.filter(r => r.status === 'open' || r.status === 'interviewing').length;

            const today = todayStr();
            const todayAtt = db.attendance.filter(a => a.date === today);
            const presentToday = todayAtt.filter(a => a.status === 'present').length;

            container.innerHTML = `
            <div class="stats-grid">
              <div class="stat-card"><div class="label"><i class="fas fa-users" style="color:var(--primary)"></i> Total Employees</div><div class="value">${totalEmp}</div><span class="change up">+${activeEmp} active</span></div>
              <div class="stat-card"><div class="label"><i class="fas fa-tasks" style="color:var(--warning)"></i> Pending Tasks</div><div class="value">${pendingTasks}</div><span class="change ${pendingTasks > 0 ? 'down' : 'up'}">${pendingTasks > 0 ? 'Needs attention' : 'All clear'}</span></div>
              <div class="stat-card"><div class="label"><i class="fas fa-calendar-check" style="color:var(--success)"></i> Present Today</div><div class="value">${presentToday}/${todayAtt.length || totalEmp}</div><span class="change up">${Math.round((presentToday/(todayAtt.length||1))*100)}% attendance</span></div>
              <div class="stat-card"><div class="label"><i class="fas fa-user-plus" style="color:var(--secondary)"></i> Open Roles</div><div class="value">${openRoles}</div><span class="change up">${db.recruitment.filter(r=>r.status==='open').length} open</span></div>
            </div>

            <div class="chart-grid">
              <div class="chart-box"><h4><i class="fas fa-building"></i> Department Distribution</h4><canvas id="deptChart"></canvas></div>
              <div class="chart-box"><h4><i class="fas fa-chart-simple"></i> Task Status</h4><canvas id="taskChart"></canvas></div>
            </div>

            <div class="section-header"><h2><i class="fas fa-clock"></i> Recent Activity</h2></div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Action</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    ${db.attendance.slice(-5).reverse().map(a => {
                      const emp = getEmployee(a.employeeId);
                      return `<tr><td><div class="cell-flex"><span class="avatar-sm ${a.status === 'present' ? 'green' : a.status === 'leave' ? 'orange' : 'red'}">${emp ? emp.name[0] : '?'}</span> ${emp ? emp.name : 'Unknown'}</div></td><td>${a.status === 'present' ? 'Checked in' : a.status === 'leave' ? 'On leave' : 'Absent'}</td><td>${formatDate(a.date)}</td><td><span class="status-badge ${a.status}">${a.status}</span></td></tr>`;
                    }).join('') || '<tr><td colspan="4" class="text-muted text-center">No recent activity</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;

            setTimeout(() => {
                const deptCtx = document.getElementById('deptChart');
                const taskCtx = document.getElementById('taskChart');
                if (deptCtx) {
                    const depts = {};
                    db.employees.forEach(e => { depts[e.department] = (depts[e.department] || 0) + 1; });
                    new Chart(deptCtx, {
                        type: 'doughnut',
                        data: {
                            labels: Object.keys(depts),
                            datasets: [{ data: Object.values(depts), backgroundColor: ['#4f46e5', '#0ea5e9',
                                    '#22c55e', '#eab308', '#ef4444', '#8b5cf6'
                                ] }]
                        },
                        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
                    });
                }
                if (taskCtx) {
                    const statuses = { pending: 0, 'in progress': 0, completed: 0 };
                    db.tasks.forEach(t => { if (statuses[t.status] !== undefined) statuses[t.status]++; });
                    new Chart(taskCtx, {
                        type: 'bar',
                        data: {
                            labels: Object.keys(statuses).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
                            datasets: [{ data: Object.values(statuses), backgroundColor: ['#eab308', '#0ea5e9',
                                    '#22c55e'
                                ] }]
                        },
                        options: { responsive: true, plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } } }
                    });
                }
            }, 50);
        }

        // ============================================================
        //  EMPLOYEES
        // ============================================================
        function renderEmployees(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header">
              <h2><i class="fas fa-users"></i> Employee Directory</h2>
              ${isAdmin ? `<button class="btn btn-primary" onclick="openAddEmployee()"><i class="fas fa-plus"></i> Add Employee</button>` : ''}
            </div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Name</th><th>Department</th><th>Position</th><th>Status</th><th>Joined</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.employees.map(e => `
                      <tr>
                        <td><div class="cell-flex"><span class="avatar-sm ${e.status === 'active' ? 'green' : e.status === 'pending' ? 'orange' : 'red'}">${e.name[0]}</span> ${e.name}</div></td>
                        <td>${e.department}</td>
                        <td>${e.position}</td>
                        <td><span class="status-badge ${e.status}">${e.status}</span></td>
                        <td>${formatDate(e.joined)}</td>
                        ${isAdmin ? `<td>
                          <button class="btn btn-sm btn-primary" onclick="openEditEmployee(${e.id})"><i class="fas fa-pen"></i></button>
                          <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${e.id})"><i class="fas fa-trash"></i></button>
                        </td>` : ''}
                      </tr>
                    `).join('') || '<tr><td colspan="6" class="text-center text-muted">No employees found.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        // Employee CRUD
        function openAddEmployee() {
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-user-plus"></i> Add Employee</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="employeeForm" onsubmit="saveEmployee(event)">
              <div class="form-row">
                <div class="form-group"><label>Full Name</label><input type="text" id="empName" required /></div>
                <div class="form-group"><label>Email</label><input type="email" id="empEmail" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Department</label><input type="text" id="empDept" required /></div>
                <div class="form-group"><label>Position</label><input type="text" id="empPos" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Status</label><select id="empStatus"><option value="active">Active</option><option value="pending">Pending</option><option value="inactive">Inactive</option></select></div>
                <div class="form-group"><label>Phone</label><input type="text" id="empPhone" /></div>
              </div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Add Employee</button></div>
            </form>
          `);
        }

        function openEditEmployee(id) {
            const e = getEmployee(id);
            if (!e) return toast('Employee not found', 'error');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-user-edit"></i> Edit Employee</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="employeeForm" onsubmit="saveEmployee(event, ${id})">
              <div class="form-row">
                <div class="form-group"><label>Full Name</label><input type="text" id="empName" value="${e.name}" required /></div>
                <div class="form-group"><label>Email</label><input type="email" id="empEmail" value="${e.email}" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Department</label><input type="text" id="empDept" value="${e.department}" required /></div>
                <div class="form-group"><label>Position</label><input type="text" id="empPos" value="${e.position}" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Status</label><select id="empStatus"><option value="active" ${e.status==='active'?'selected':''}>Active</option><option value="pending" ${e.status==='pending'?'selected':''}>Pending</option><option value="inactive" ${e.status==='inactive'?'selected':''}>Inactive</option></select></div>
                <div class="form-group"><label>Phone</label><input type="text" id="empPhone" value="${e.phone || ''}" /></div>
              </div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Update Employee</button></div>
            </form>
          `);
        }

        function saveEmployee(event, id) {
            event.preventDefault();
            const name = document.getElementById('empName').value.trim();
            const email = document.getElementById('empEmail').value.trim();
            const dept = document.getElementById('empDept').value.trim();
            const pos = document.getElementById('empPos').value.trim();
            const status = document.getElementById('empStatus').value;
            const phone = document.getElementById('empPhone').value.trim();

            if (!name || !email || !dept || !pos) return toast('Please fill all required fields.', 'warning');

            if (id) {
                const idx = db.employees.findIndex(e => e.id === id);
                if (idx === -1) return toast('Employee not found', 'error');
                db.employees[idx] = { ...db.employees[idx], name, email, department: dept, position: pos, status,
                    phone };
                const user = db.users.find(u => u.email === db.employees[idx].email);
                if (user) user.name = name;
                toast('Employee updated!', 'success');
            } else {
                const newEmp = {
                    id: genId('employee'),
                    name,
                    email,
                    department: dept,
                    position: pos,
                    status,
                    joined: todayStr(),
                    phone: phone || 'â€”'
                };
                db.employees.push(newEmp);
                db.users.push({
                    id: genId('user'),
                    name,
                    email,
                    role: 'employee',
                    password: 'emp123',
                    avatar: name[0]
                });
                toast('Employee added!', 'success');
            }
            saveDB();
            closeModal();
            renderApp();
        }

        function deleteEmployee(id) {
            if (!confirm('Delete this employee and their user account?')) return;
            const emp = getEmployee(id);
            if (!emp) return toast('Not found', 'error');
            db.employees = db.employees.filter(e => e.id !== id);
            db.users = db.users.filter(u => u.email !== emp.email);
            db.tasks = db.tasks.filter(t => t.assignedTo !== id);
            db.attendance = db.attendance.filter(a => a.employeeId !== id);
            db.performance = db.performance.filter(p => p.employeeId !== id);
            db.payroll = db.payroll.filter(p => p.employeeId !== id);
            saveDB();
            toast('Employee deleted.', 'info');
            renderApp();
        }

        // ============================================================
        //  TASKS
        // ============================================================
        function renderTasks(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            const canAssign = isAdmin;

            let tasks = db.tasks;
            if (currentUser.role === 'employee') {
                const emp = db.employees.find(e => e.email === currentUser.email);
                if (emp) tasks = tasks.filter(t => t.assignedTo === emp.id);
            }

            container.innerHTML = `
            <div class="section-header">
              <h2><i class="fas fa-tasks"></i> Task Management</h2>
              ${canAssign ? `<button class="btn btn-primary" onclick="openAddTask()"><i class="fas fa-plus"></i> New Task</button>` : ''}
            </div>
            <div class="tabs">
              <button class="tab active" data-filter="all" onclick="filterTasks(this,'all')">All</button>
              <button class="tab" data-filter="pending" onclick="filterTasks(this,'pending')">Pending</button>
              <button class="tab" data-filter="in progress" onclick="filterTasks(this,'in progress')">In Progress</button>
              <button class="tab" data-filter="completed" onclick="filterTasks(this,'completed')">Completed</button>
            </div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Task</th><th>Assigned To</th><th>Status</th><th>Priority</th><th>Due Date</th>${canAssign ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody id="taskTableBody">
                    ${tasks.map(t => `
                      <tr data-status="${t.status}">
                        <td><strong>${t.title}</strong><br><span class="text-muted text-sm">${t.description || ''}</span></td>
                        <td>${t.assignedByName || getEmployeeName(t.assignedTo)}</td>
                        <td><span class="status-badge ${t.status.replace(' ','-')}">${t.status}</span></td>
                        <td><span class="status-badge ${t.priority === 'critical' ? 'danger' : t.priority === 'high' ? 'pending' : t.priority === 'medium' ? 'active' : 'inactive'}">${t.priority}</span></td>
                        <td>${formatDate(t.dueDate)}</td>
                        ${canAssign ? `<td>
                          <button class="btn btn-sm btn-primary" onclick="openEditTask(${t.id})"><i class="fas fa-pen"></i></button>
                          <button class="btn btn-sm btn-danger" onclick="deleteTask(${t.id})"><i class="fas fa-trash"></i></button>
                          <button class="btn btn-sm btn-success" onclick="updateTaskStatus(${t.id},'completed')"><i class="fas fa-check"></i></button>
                        </td>` : `<td><button class="btn btn-sm btn-success" onclick="updateTaskStatus(${t.id},'completed')"><i class="fas fa-check"></i> Done</button></td>`}
                      </tr>
                    `).join('') || '<tr><td colspan="6" class="text-center text-muted">No tasks found.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
            updateTaskBadge();
        }

        function filterTasks(btn, filter) {
            document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            const rows = document.querySelectorAll('#taskTableBody tr');
            rows.forEach(row => {
                const status = row.dataset.status;
                row.style.display = (filter === 'all' || status === filter) ? '' : 'none';
            });
        }

        function openAddTask() {
            const empOptions = db.employees.map(e =>
                `<option value="${e.id}">${e.name} (${e.department})</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-plus-circle"></i> New Task</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="taskForm" onsubmit="saveTask(event)">
              <div class="form-group"><label>Task Title</label><input type="text" id="taskTitle" required /></div>
              <div class="form-group"><label>Description</label><textarea id="taskDesc"></textarea></div>
              <div class="form-row">
                <div class="form-group"><label>Assigned To</label><select id="taskAssign">${empOptions}</select></div>
                <div class="form-group"><label>Priority</label><select id="taskPriority"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option><option value="critical">Critical</option></select></div>
              </div>
              <div class="form-group"><label>Due Date</label><input type="date" id="taskDue" required /></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Create Task</button></div>
            </form>
          `);
            const d = new Date();
            d.setDate(d.getDate() + 7);
            document.getElementById('taskDue').value = d.toISOString().slice(0, 10);
        }

        function openEditTask(id) {
            const t = db.tasks.find(task => task.id === id);
            if (!t) return toast('Task not found', 'error');
            const empOptions = db.employees.map(e =>
                `<option value="${e.id}" ${e.id===t.assignedTo?'selected':''}>${e.name} (${e.department})</option>`).join(
                '');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-edit"></i> Edit Task</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="taskForm" onsubmit="saveTask(event, ${id})">
              <div class="form-group"><label>Task Title</label><input type="text" id="taskTitle" value="${t.title}" required /></div>
              <div class="form-group"><label>Description</label><textarea id="taskDesc">${t.description || ''}</textarea></div>
              <div class="form-row">
                <div class="form-group"><label>Assigned To</label><select id="taskAssign">${empOptions}</select></div>
                <div class="form-group"><label>Priority</label><select id="taskPriority"><option value="low" ${t.priority==='low'?'selected':''}>Low</option><option value="medium" ${t.priority==='medium'?'selected':''}>Medium</option><option value="high" ${t.priority==='high'?'selected':''}>High</option><option value="critical" ${t.priority==='critical'?'selected':''}>Critical</option></select></div>
              </div>
              <div class="form-group"><label>Status</label><select id="taskStatus"><option value="pending" ${t.status==='pending'?'selected':''}>Pending</option><option value="in progress" ${t.status==='in progress'?'selected':''}>In Progress</option><option value="completed" ${t.status==='completed'?'selected':''}>Completed</option></select></div>
              <div class="form-group"><label>Due Date</label><input type="date" id="taskDue" value="${t.dueDate}" required /></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Update Task</button></div>
            </form>
          `);
        }

        function saveTask(event, id) {
            event.preventDefault();
            const title = document.getElementById('taskTitle').value.trim();
            const desc = document.getElementById('taskDesc').value.trim();
            const assignedTo = parseInt(document.getElementById('taskAssign').value);
            const priority = document.getElementById('taskPriority').value;
            const dueDate = document.getElementById('taskDue').value;
            const status = document.getElementById('taskStatus')?.value || 'pending';

            if (!title || !dueDate) return toast('Title and due date required.', 'warning');

            const assignedByName = getEmployeeName(assignedTo);

            if (id) {
                const idx = db.tasks.findIndex(t => t.id === id);
                if (idx === -1) return toast('Task not found', 'error');
                db.tasks[idx] = { ...db.tasks[idx], title, description: desc, assignedTo, assignedByName, priority,
                    dueDate, status };
                toast('Task updated!', 'success');
            } else {
                db.tasks.push({
                    id: genId('task'),
                    title,
                    description: desc,
                    assignedTo,
                    assignedByName,
                    status: 'pending',
                    priority,
                    dueDate,
                    createdBy: currentUser.name
                });
                toast('Task created!', 'success');
            }
            saveDB();
            closeModal();
            renderApp();
        }

        function deleteTask(id) {
            if (!confirm('Delete this task?')) return;
            db.tasks = db.tasks.filter(t => t.id !== id);
            saveDB();
            toast('Task deleted.', 'info');
            renderApp();
        }

        function updateTaskStatus(id, status) {
            const t = db.tasks.find(task => task.id === id);
            if (!t) return toast('Task not found', 'error');
            t.status = status;
            saveDB();
            toast(`Task marked as ${status}`, 'success');
            renderApp();
        }

        // ============================================================
        //  ATTENDANCE
        // ============================================================
        function renderAttendance(container) {
            const today = todayStr();
            const todayRecords = db.attendance.filter(a => a.date === today);

            const allEmp = db.employees;
            const empAttendance = allEmp.map(emp => {
                const rec = todayRecords.find(a => a.employeeId === emp.id);
                return { ...emp, status: rec ? rec.status : 'â€”' };
            });

            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';

            container.innerHTML = `
            <div class="section-header">
              <h2><i class="fas fa-calendar-check"></i> Attendance Â· ${formatDate(today)}</h2>
              ${isAdmin ? `<button class="btn btn-primary" onclick="openMarkAttendance()"><i class="fas fa-pen"></i> Mark Attendance</button>` : ''}
            </div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Department</th><th>Today's Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${empAttendance.map(e => `
                      <tr>
                        <td><div class="cell-flex"><span class="avatar-sm ${e.status === 'present' ? 'green' : e.status === 'leave' ? 'orange' : e.status === 'â€”' ? 'gray' : 'red'}">${e.name[0]}</span> ${e.name}</div></td>
                        <td>${e.department}</td>
                        <td><span class="status-badge ${e.status === 'present' ? 'active' : e.status === 'leave' ? 'pending' : e.status === 'â€”' ? 'inactive' : 'inactive'}">${e.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-primary" onclick="openMarkAttendanceFor(${e.id})"><i class="fas fa-pen"></i></button></td>` : ''}
                      </tr>
                    `).join('') || '<tr><td colspan="4" class="text-center text-muted">No employees.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
            <div class="section-header"><h2><i class="fas fa-clock"></i> Recent History</h2></div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    ${db.attendance.slice(-10).reverse().map(a => {
                      const emp = getEmployee(a.employeeId);
                      return `<tr><td>${emp ? emp.name : 'Unknown'}</td><td>${formatDate(a.date)}</td><td><span class="status-badge ${a.status}">${a.status}</span></td></tr>`;
                    }).join('') || '<tr><td colspan="3" class="text-center text-muted">No records.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openMarkAttendance() {
            const today = todayStr();
            const empOptions = db.employees.map(e => {
                const existing = db.attendance.find(a => a.employeeId === e.id && a.date === today);
                return `<option value="${e.id}" ${existing ? 'disabled' : ''}>${e.name} ${existing ? '(already marked)' : ''}</option>`;
            }).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-pen"></i> Mark Attendance</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="attendanceForm" onsubmit="saveAttendance(event)">
              <div class="form-group"><label>Employee</label><select id="attendanceEmp">${empOptions}</select></div>
              <div class="form-group"><label>Status</label><select id="attendanceStatus"><option value="present">Present</option><option value="absent">Absent</option><option value="leave">On Leave</option></select></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
            </form>
          `);
        }

        function openMarkAttendanceFor(empId) {
            const today = todayStr();
            const emp = getEmployee(empId);
            if (!emp) return toast('Employee not found', 'error');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-pen"></i> Mark Attendance for ${emp.name}</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="attendanceForm" onsubmit="saveAttendance(event, ${empId})">
              <div class="form-group"><label>Status</label><select id="attendanceStatus"><option value="present">Present</option><option value="absent">Absent</option><option value="leave">On Leave</option></select></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
            </form>
          `);
        }

        function saveAttendance(event, empId) {
            event.preventDefault();
            const employeeId = empId || parseInt(document.getElementById('attendanceEmp').value);
            const status = document.getElementById('attendanceStatus').value;
            const today = todayStr();

            const existing = db.attendance.find(a => a.employeeId === employeeId && a.date === today);
            if (existing) {
                existing.status = status;
                toast('Attendance updated!', 'success');
            } else {
                db.attendance.push({ id: genId('attendance'), employeeId, date: today, status });
                toast('Attendance recorded!', 'success');
            }
            saveDB();
            closeModal();
            renderApp();
        }

        // ============================================================
        //  PERFORMANCE
        // ============================================================
        function renderPerformance(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';

            container.innerHTML = `
            <div class="section-header">
              <h2><i class="fas fa-star"></i> Performance Reviews</h2>
              ${isAdmin ? `<button class="btn btn-primary" onclick="openAddReview()"><i class="fas fa-plus"></i> Add Review</button>` : ''}
            </div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Reviewer</th><th>Date</th><th>Rating</th><th>Comments</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.performance.map(p => {
                      const emp = getEmployee(p.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${p.reviewer}</td>
                        <td>${formatDate(p.date)}</td>
                        <td><span style="color:${p.rating >= 4 ? 'var(--success)' : p.rating >= 3 ? 'var(--warning)' : 'var(--danger)'};font-weight:600;">${p.rating}</span></td>
                        <td class="text-sm">${p.comments || 'â€”'}</td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-danger" onclick="deleteReview(${p.id})"><i class="fas fa-trash"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="6" class="text-center text-muted">No reviews yet.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddReview() {
            const empOptions = db.employees.map(e =>
                `<option value="${e.id}">${e.name} (${e.department})</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-star"></i> Add Performance Review</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="reviewForm" onsubmit="saveReview(event)">
              <div class="form-group"><label>Employee</label><select id="reviewEmp">${empOptions}</select></div>
              <div class="form-group"><label>Rating (1â€“5)</label><input type="number" id="reviewRating" min="1" max="5" step="0.5" required /></div>
              <div class="form-group"><label>Comments</label><textarea id="reviewComments"></textarea></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Save Review</button></div>
            </form>
          `);
        }

        function saveReview(event) {
            event.preventDefault();
            const employeeId = parseInt(document.getElementById('reviewEmp').value);
            const rating = parseFloat(document.getElementById('reviewRating').value);
            const comments = document.getElementById('reviewComments').value.trim();

            if (!rating || rating < 1 || rating > 5) return toast('Please enter a rating between 1 and 5.', 'warning');

            db.performance.push({
                id: genId('performance'),
                employeeId,
                reviewer: currentUser.name,
                date: todayStr(),
                rating,
                comments
            });
            saveDB();
            toast('Review added!', 'success');
            closeModal();
            renderApp();
        }

        function deleteReview(id) {
            if (!confirm('Delete this review?')) return;
            db.performance = db.performance.filter(p => p.id !== id);
            saveDB();
            toast('Review deleted.', 'info');
            renderApp();
        }

        // ============================================================
        //  RECRUITMENT
        // ============================================================
        function renderRecruitment(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';

            container.innerHTML = `
            <div class="section-header">
              <h2><i class="fas fa-user-plus"></i> Recruitment Pipeline</h2>
              ${isAdmin ? `<button class="btn btn-primary" onclick="openAddRecruitment()"><i class="fas fa-plus"></i> New Opening</button>` : ''}
            </div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Position</th><th>Department</th><th>Status</th><th>Applicants</th><th>Posted</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.recruitment.map(r => `
                      <tr>
                        <td><strong>${r.position}</strong></td>
                        <td>${r.department}</td>
                        <td><span class="status-badge ${r.status === 'open' ? 'active' : r.status === 'interviewing' ? 'review' : 'inactive'}">${r.status}</span></td>
                        <td>${r.applicants}</td>
                        <td>${formatDate(r.posted)}</td>
                        ${isAdmin ? `<td>
                          <button class="btn btn-sm btn-primary" onclick="openEditRecruitment(${r.id})"><i class="fas fa-pen"></i></button>
                          <button class="btn btn-sm btn-danger" onclick="deleteRecruitment(${r.id})"><i class="fas fa-trash"></i></button>
                        </td>` : ''}
                      </tr>
                    `).join('') || '<tr><td colspan="6" class="text-center text-muted">No openings.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddRecruitment() {
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-plus-circle"></i> New Opening</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="recruitForm" onsubmit="saveRecruitment(event)">
              <div class="form-row">
                <div class="form-group"><label>Position</label><input type="text" id="recruitPos" required /></div>
                <div class="form-group"><label>Department</label><input type="text" id="recruitDept" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Status</label><select id="recruitStatus"><option value="open">Open</option><option value="interviewing">Interviewing</option><option value="closed">Closed</option></select></div>
                <div class="form-group"><label>Applicants</label><input type="number" id="recruitApps" value="0" /></div>
              </div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Create Opening</button></div>
            </form>
          `);
        }

        function openEditRecruitment(id) {
            const r = db.recruitment.find(item => item.id === id);
            if (!r) return toast('Not found', 'error');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-edit"></i> Edit Opening</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="recruitForm" onsubmit="saveRecruitment(event, ${id})">
              <div class="form-row">
                <div class="form-group"><label>Position</label><input type="text" id="recruitPos" value="${r.position}" required /></div>
                <div class="form-group"><label>Department</label><input type="text" id="recruitDept" value="${r.department}" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Status</label><select id="recruitStatus"><option value="open" ${r.status==='open'?'selected':''}>Open</option><option value="interviewing" ${r.status==='interviewing'?'selected':''}>Interviewing</option><option value="closed" ${r.status==='closed'?'selected':''}>Closed</option></select></div>
                <div class="form-group"><label>Applicants</label><input type="number" id="recruitApps" value="${r.applicants}" /></div>
              </div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Update</button></div>
            </form>
          `);
        }

        function saveRecruitment(event, id) {
            event.preventDefault();
            const position = document.getElementById('recruitPos').value.trim();
            const department = document.getElementById('recruitDept').value.trim();
            const status = document.getElementById('recruitStatus').value;
            const applicants = parseInt(document.getElementById('recruitApps').value) || 0;

            if (!position || !department) return toast('Please fill all fields.', 'warning');

            if (id) {
                const idx = db.recruitment.findIndex(r => r.id === id);
                if (idx === -1) return toast('Not found', 'error');
                db.recruitment[idx] = { ...db.recruitment[idx], position, department, status, applicants };
                toast('Opening updated!', 'success');
            } else {
                db.recruitment.push({
                    id: genId('recruitment'),
                    position,
                    department,
                    status,
                    applicants,
                    posted: todayStr()
                });
                toast('Opening created!', 'success');
            }
            saveDB();
            closeModal();
            renderApp();
        }

        function deleteRecruitment(id) {
            if (!confirm('Delete this opening?')) return;
            db.recruitment = db.recruitment.filter(r => r.id !== id);
            saveDB();
            toast('Opening deleted.', 'info');
            renderApp();
        }

        // ============================================================
        //  PAYROLL
        // ============================================================
        function renderPayroll(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';

            container.innerHTML = `
            <div class="section-header">
              <h2><i class="fas fa-wallet"></i> Payroll</h2>
              ${isAdmin ? `<button class="btn btn-primary" onclick="openAddPayroll()"><i class="fas fa-plus"></i> Add Payroll</button>` : ''}
            </div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Month</th><th>Salary</th><th>Bonus</th><th>Deductions</th><th>Net Pay</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.payroll.map(p => {
                      const emp = getEmployee(p.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${p.month}</td>
                        <td>$${p.salary.toLocaleString()}</td>
                        <td>$${p.bonus.toLocaleString()}</td>
                        <td>$${p.deductions.toLocaleString()}</td>
                        <td><strong>$${p.net.toLocaleString()}</strong></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-danger" onclick="deletePayroll(${p.id})"><i class="fas fa-trash"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="7" class="text-center text-muted">No payroll records.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddPayroll() {
            const empOptions = db.employees.map(e =>
                `<option value="${e.id}">${e.name}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-wallet"></i> Add Payroll Record</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="payrollForm" onsubmit="savePayroll(event)">
              <div class="form-group"><label>Employee</label><select id="payrollEmp">${empOptions}</select></div>
              <div class="form-group"><label>Month</label><input type="text" id="payrollMonth" placeholder="e.g. August 2026" required /></div>
              <div class="form-row">
                <div class="form-group"><label>Salary ($)</label><input type="number" id="payrollSalary" required /></div>
                <div class="form-group"><label>Bonus ($)</label><input type="number" id="payrollBonus" value="0" /></div>
              </div>
              <div class="form-group"><label>Deductions ($)</label><input type="number" id="payrollDeductions" value="0" /></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Add Record</button></div>
            </form>
          `);
        }

        function savePayroll(event) {
            event.preventDefault();
            const employeeId = parseInt(document.getElementById('payrollEmp').value);
            const month = document.getElementById('payrollMonth').value.trim();
            const salary = parseFloat(document.getElementById('payrollSalary').value) || 0;
            const bonus = parseFloat(document.getElementById('payrollBonus').value) || 0;
            const deductions = parseFloat(document.getElementById('payrollDeductions').value) || 0;

            if (!month || salary <= 0) return toast('Please enter valid details.', 'warning');

            db.payroll.push({
                id: genId('payroll'),
                employeeId,
                month,
                salary,
                bonus,
                deductions,
                net: salary + bonus - deductions
            });
            saveDB();
            toast('Payroll record added!', 'success');
            closeModal();
            renderApp();
        }

        function deletePayroll(id) {
            if (!confirm('Delete this payroll record?')) return;
            db.payroll = db.payroll.filter(p => p.id !== id);
            saveDB();
            toast('Record deleted.', 'info');
            renderApp();
        }

        // ============================================================
        //  DOCUMENTS GENERATION (EXPANDED)
        // ============================================================
        function renderDocuments(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            if (!isAdmin) {
                container.innerHTML = `
              <div class="empty-state">
                <i class="fas fa-lock"></i>
                <h4>Access Restricted</h4>
                <p class="text-muted">Only HR and Admin can generate documents.</p>
              </div>
            `;
                return;
            }

            // List of document types with icon, color, and function
            const docTypes = [
                { id: 'interview', label: 'Interview Invitation', icon: 'fa-envelope', color: 'blue',
                desc: 'Invite candidate for interview' },
                { id: 'offer', label: 'Offer Letter', icon: 'fa-file-signature', color: 'primary',
                desc: 'Formal job offer' },
                { id: 'appointment', label: 'Appointment Letter', icon: 'fa-user-tie', color: 'green',
                    desc: 'Final employment contract' },
                { id: 'payslip', label: 'Payslip', icon: 'fa-wallet', color: 'orange', desc: 'Monthly salary statement' },
                { id: 'promotion', label: 'Promotion Letter', icon: 'fa-arrow-up', color: 'green',
                desc: 'Promotion notification' },
                { id: 'salary', label: 'Salary Adjustment', icon: 'fa-money-bill-wave', color: 'orange',
                    desc: 'Salary change notice' },
                { id: 'bonus', label: 'Bonus Award', icon: 'fa-gift', color: 'orange', desc: 'Performance bonus letter' },
                { id: 'verification', label: 'Employment Verification', icon: 'fa-check-circle', color: 'blue',
                    desc: 'Proof of employment' },
                { id: 'leave', label: 'Leave of Absence', icon: 'fa-calendar-alt', color: 'orange',
                desc: 'Leave approval letter' },
                { id: 'resignation', label: 'Acceptance of Resignation', icon: 'fa-handshake', color: 'red',
                    desc: 'Resignation acknowledgment' },
                { id: 'termination', label: 'Termination Letter', icon: 'fa-times-circle', color: 'red',
                    desc: 'Employment termination notice' },
            ];

            const cards = docTypes.map(d => `
            <div class="doc-card" onclick="openDocumentModal('${d.id}')">
              <i class="fas ${d.icon}"></i>
              <h4>${d.label}</h4>
              <p>${d.desc}</p>
              <span class="badge-doc ${d.color}">${d.id === 'payslip' ? 'Payroll' : 'HR'}</span>
            </div>
          `).join('');

            container.innerHTML = `
            <div class="section-header">
              <h2><i class="fas fa-file-pdf"></i> HR Documents Generator</h2>
              <span class="text-muted text-sm">Click any card to customize and generate</span>
            </div>
            <div class="doc-grid">
              ${cards}
            </div>
            <div class="text-muted text-sm" style="margin-top: 24px;">
              <i class="fas fa-info-circle"></i> Documents open in a new window. Use browser's print (Ctrl+P) to save as PDF.
            </div>
          `;
        }

        // ----- Document Modal Launcher -----
        function openDocumentModal(type) {
            // Build employee dropdown
            const empOptions = db.employees.map(e =>
                `<option value="${e.id}">${e.name} (${e.department})</option>`).join('');

            // Common fields: date, employee, job title, salary, company name, etc.
            // We'll create a generic form builder.
            let formHtml = '';
            let docTitle = '';
            let generateFn = '';

            switch (type) {
                case 'interview':
                    docTitle = 'Interview Invitation';
                    formHtml = `
                    <div class="form-group"><label>Date</label><input type="date" id="docDate" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Candidate Name</label><input type="text" id="docCandidate" placeholder="e.g. John Doe" required /></div>
                    <div class="form-group"><label>Job Title</label><input type="text" id="docJobTitle" placeholder="e.g. Software Engineer" required /></div>
                    <div class="form-group"><label>Company Name</label><input type="text" id="docCompany" value="Acme Corporation" required /></div>
                    <div class="form-row">
                      <div class="form-group"><label>Interview Date</label><input type="date" id="docInterviewDate" value="${new Date(Date.now()+7*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                      <div class="form-group"><label>Interview Time</label><input type="text" id="docInterviewTime" placeholder="10:00 AM EST" required /></div>
                    </div>
                    <div class="form-group"><label>Location / Link</label><input type="text" id="docLocation" placeholder="Zoom link or office address" required /></div>
                    <div class="form-group"><label>Interviewer(s)</label><input type="text" id="docInterviewers" placeholder="Jane Smith, VP Engineering" required /></div>
                    <div class="form-group"><label>HR Professional Name</label><input type="text" id="docHRName" value="${currentUser.name}" required /></div>
                    <div class="form-group"><label>Reply By Date</label><input type="date" id="docReplyDate" value="${new Date(Date.now()+3*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                  `;
                    generateFn = 'generateInterviewInvitation';
                    break;

                case 'offer':
                    docTitle = 'Offer Letter';
                    formHtml = `
                    <div class="form-group"><label>Date</label><input type="date" id="docDate" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Candidate Name</label><input type="text" id="docCandidate" placeholder="e.g. John Doe" required /></div>
                    <div class="form-group"><label>Job Title</label><input type="text" id="docJobTitle" placeholder="e.g. Software Engineer" required /></div>
                    <div class="form-group"><label>Company Name</label><input type="text" id="docCompany" value="Acme Corporation" required /></div>
                    <div class="form-group"><label>Manager Name</label><input type="text" id="docManager" placeholder="e.g. Sarah Lee" required /></div>
                    <div class="form-row">
                      <div class="form-group"><label>Salary Amount ($)</label><input type="number" id="docSalary" placeholder="85000" required /></div>
                      <div class="form-group"><label>Pay Frequency</label><select id="docPayFreq"><option value="Year">Year</option><option value="Hour">Hour</option></select></div>
                    </div>
                    <div class="form-group"><label>Benefits / Bonus</label><input type="text" id="docBenefits" placeholder="e.g. health insurance, 401k match" required /></div>
                    <div class="form-group"><label>Benefits Effective Date</label><input type="date" id="docBenefitsDate" value="${new Date(Date.now()+30*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>Start Date</label><input type="date" id="docStartDate" value="${new Date(Date.now()+14*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>Offer Expiration Date</label><input type="date" id="docExpireDate" value="${new Date(Date.now()+7*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>HR Professional Name</label><input type="text" id="docHRName" value="${currentUser.name}" required /></div>
                  `;
                    generateFn = 'generateOfferLetterCustom';
                    break;

                case 'appointment':
                    docTitle = 'Appointment Letter';
                    formHtml = `
                    <div class="form-group"><label>Date</label><input type="date" id="docDate" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Employee Name</label><input type="text" id="docEmployee" placeholder="e.g. John Doe" required /></div>
                    <div class="form-group"><label>Job Title</label><input type="text" id="docJobTitle" placeholder="e.g. Software Engineer" required /></div>
                    <div class="form-group"><label>Company Name</label><input type="text" id="docCompany" value="Acme Corporation" required /></div>
                    <div class="form-group"><label>Salary Amount ($)</label><input type="number" id="docSalary" placeholder="85000" required /></div>
                    <div class="form-group"><label>Probationary Period (days)</label><input type="number" id="docProbation" value="90" required /></div>
                    <div class="form-group"><label>Duties Summary</label><textarea id="docDuties" rows="2">Perform assigned tasks and collaborate with team.</textarea></div>
                    <div class="form-group"><label>Start Date</label><input type="date" id="docStartDate" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>HR Professional Name</label><input type="text" id="docHRName" value="${currentUser.name}" required /></div>
                  `;
                    generateFn = 'generateAppointmentLetterCustom';
                    break;

                case 'payslip':
                    docTitle = 'Payslip';
                    formHtml = `
                    <div class="form-group"><label>Employee</label><select id="docEmpSelect">${empOptions}</select></div>
                    <div class="form-group"><label>Pay Period Start</label><input type="date" id="docPeriodStart" value="${new Date(Date.now()-30*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>Pay Period End</label><input type="date" id="docPeriodEnd" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Pay Date</label><input type="date" id="docPayDate" value="${todayStr()}" required /></div>
                    <div class="form-row">
                      <div class="form-group"><label>Base Salary ($)</label><input type="number" id="docBaseSalary" placeholder="6000" required /></div>
                      <div class="form-group"><label>Overtime ($)</label><input type="number" id="docOvertime" value="0" /></div>
                    </div>
                    <div class="form-row">
                      <div class="form-group"><label>Bonus/Commission ($)</label><input type="number" id="docBonus" value="0" /></div>
                      <div class="form-group"><label>Federal Income Tax ($)</label><input type="number" id="docFedTax" placeholder="1200" required /></div>
                    </div>
                    <div class="form-row">
                      <div class="form-group"><label>State Income Tax ($)</label><input type="number" id="docStateTax" placeholder="400" required /></div>
                      <div class="form-group"><label>Health Insurance ($)</label><input type="number" id="docHealth" placeholder="200" required /></div>
                    </div>
                    <div class="form-row">
                      <div class="form-group"><label>401(k) Contribution ($)</label><input type="number" id="doc401k" placeholder="300" /></div>
                      <div class="form-group"><label>Other Deductions ($)</label><input type="number" id="docOtherDed" value="0" /></div>
                    </div>
                    <div class="form-group"><label>Account Last 4 Digits</label><input type="text" id="docAccount" placeholder="1234" /></div>
                    <div class="form-group"><label>Company Name</label><input type="text" id="docCompany" value="Acme Corporation" /></div>
                  `;
                    generateFn = 'generatePayslipCustom';
                    break;

                case 'promotion':
                    docTitle = 'Promotion Letter';
                    formHtml = `
                    <div class="form-group"><label>Date</label><input type="date" id="docDate" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Employee Name</label><input type="text" id="docEmployee" placeholder="e.g. John Doe" required /></div>
                    <div class="form-group"><label>New Job Title</label><input type="text" id="docNewTitle" placeholder="e.g. Senior Manager" required /></div>
                    <div class="form-group"><label>Company Name</label><input type="text" id="docCompany" value="Acme Corporation" required /></div>
                    <div class="form-group"><label>New Manager Name</label><input type="text" id="docManager" placeholder="e.g. Sarah Lee" required /></div>
                    <div class="form-group"><label>New Salary Amount ($)</label><input type="number" id="docSalary" placeholder="95000" required /></div>
                    <div class="form-group"><label>Effective Date</label><input type="date" id="docEffectiveDate" value="${new Date(Date.now()+7*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>HR Professional Name</label><input type="text" id="docHRName" value="${currentUser.name}" required /></div>
                  `;
                    generateFn = 'generatePromotionLetter';
                    break;

                case 'salary':
                    docTitle = 'Salary Adjustment Letter';
                    formHtml = `
                    <div class="form-group"><label>Date</label><input type="date" id="docDate" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Employee Name</label><input type="text" id="docEmployee" placeholder="e.g. John Doe" required /></div>
                    <div class="form-group"><label>Company Name</label><input type="text" id="docCompany" value="Acme Corporation" required /></div>
                    <div class="form-group"><label>New Salary Amount ($)</label><input type="number" id="docSalary" placeholder="88000" required /></div>
                    <div class="form-group"><label>Pay Frequency</label><select id="docPayFreq"><option value="Year">Year</option><option value="Hour">Hour</option></select></div>
                    <div class="form-group"><label>Effective Date</label><input type="date" id="docEffectiveDate" value="${new Date(Date.now()+14*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>Reason</label><input type="text" id="docReason" placeholder="e.g. annual performance review" required /></div>
                    <div class="form-group"><label>HR Professional Name</label><input type="text" id="docHRName" value="${currentUser.name}" required /></div>
                  `;
                    generateFn = 'generateSalaryAdjustment';
                    break;

                case 'bonus':
                    docTitle = 'Bonus Award Letter';
                    formHtml = `
                    <div class="form-group"><label>Date</label><input type="date" id="docDate" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Employee Name</label><input type="text" id="docEmployee" placeholder="e.g. John Doe" required /></div>
                    <div class="form-group"><label>Company Name</label><input type="text" id="docCompany" value="Acme Corporation" required /></div>
                    <div class="form-group"><label>Bonus Amount ($)</label><input type="number" id="docBonusAmount" placeholder="5000" required /></div>
                    <div class="form-group"><label>Pay Date</label><input type="date" id="docPayDate" value="${new Date(Date.now()+14*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>Performance Period</label><input type="text" id="docPeriod" placeholder="Q3 2026" required /></div>
                    <div class="form-group"><label>HR Professional Name</label><input type="text" id="docHRName" value="${currentUser.name}" required /></div>
                  `;
                    generateFn = 'generateBonusLetter';
                    break;

                case 'verification':
                    docTitle = 'Employment Verification Letter';
                    formHtml = `
                    <div class="form-group"><label>Date</label><input type="date" id="docDate" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Employee Name</label><input type="text" id="docEmployee" placeholder="e.g. John Doe" required /></div>
                    <div class="form-group"><label>Company Name</label><input type="text" id="docCompany" value="Acme Corporation" required /></div>
                    <div class="form-group"><label>Job Title</label><input type="text" id="docJobTitle" placeholder="e.g. Software Engineer" required /></div>
                    <div class="form-group"><label>Start Date</label><input type="date" id="docStartDate" value="${new Date(Date.now()-365*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>Employment Type</label><select id="docEmpType"><option value="Full-Time">Full-Time</option><option value="Part-Time">Part-Time</option></select></div>
                    <div class="form-group"><label>Salary ($)</label><input type="number" id="docSalary" placeholder="85000" required /></div>
                    <div class="form-group"><label>HR Phone</label><input type="text" id="docHRPhone" placeholder="+1 555 123 4567" required /></div>
                    <div class="form-group"><label>HR Email</label><input type="email" id="docHREmail" placeholder="hr@company.com" required /></div>
                    <div class="form-group"><label>HR Professional Name</label><input type="text" id="docHRName" value="${currentUser.name}" required /></div>
                  `;
                    generateFn = 'generateVerificationLetter';
                    break;

                case 'leave':
                    docTitle = 'Leave of Absence Letter';
                    formHtml = `
                    <div class="form-group"><label>Date</label><input type="date" id="docDate" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Employee Name</label><input type="text" id="docEmployee" placeholder="e.g. John Doe" required /></div>
                    <div class="form-group"><label>Company Name</label><input type="text" id="docCompany" value="Acme Corporation" required /></div>
                    <div class="form-group"><label>Reason</label><input type="text" id="docReason" placeholder="e.g. medical reasons" required /></div>
                    <div class="form-group"><label>Leave Start Date</label><input type="date" id="docLeaveStart" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Return Date</label><input type="date" id="docReturnDate" value="${new Date(Date.now()+30*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>Paid/Unpaid</label><select id="docPaidStatus"><option value="Paid">Paid</option><option value="Unpaid">Unpaid</option></select></div>
                    <div class="form-group"><label>Benefits Continuation</label><input type="text" id="docBenefitsCont" placeholder="e.g. health benefits continue" required /></div>
                    <div class="form-group"><label>HR Professional Name</label><input type="text" id="docHRName" value="${currentUser.name}" required /></div>
                  `;
                    generateFn = 'generateLeaveLetter';
                    break;

                case 'resignation':
                    docTitle = 'Acceptance of Resignation';
                    formHtml = `
                    <div class="form-group"><label>Date</label><input type="date" id="docDate" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Employee Name</label><input type="text" id="docEmployee" placeholder="e.g. John Doe" required /></div>
                    <div class="form-group"><label>Company Name</label><input type="text" id="docCompany" value="Acme Corporation" required /></div>
                    <div class="form-group"><label>Job Title</label><input type="text" id="docJobTitle" placeholder="e.g. Software Engineer" required /></div>
                    <div class="form-group"><label>Date Notice Given</label><input type="date" id="docNoticeDate" value="${new Date(Date.now()-7*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>Final Employment Date</label><input type="date" id="docFinalDate" value="${new Date(Date.now()+7*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>Final Pay Date</label><input type="date" id="docPayDate" value="${new Date(Date.now()+14*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>PTO Payout (if any)</label><input type="text" id="docPTO" placeholder="e.g. 5 days accrued" /></div>
                    <div class="form-group"><label>Company Property</label><input type="text" id="docProperty" placeholder="Laptop, badge, keys" required /></div>
                    <div class="form-group"><label>HR Professional Name</label><input type="text" id="docHRName" value="${currentUser.name}" required /></div>
                  `;
                    generateFn = 'generateResignationLetter';
                    break;

                case 'termination':
                    docTitle = 'Termination Letter';
                    formHtml = `
                    <div class="form-group"><label>Date</label><input type="date" id="docDate" value="${todayStr()}" required /></div>
                    <div class="form-group"><label>Employee Name</label><input type="text" id="docEmployee" placeholder="e.g. John Doe" required /></div>
                    <div class="form-group"><label>Company Name</label><input type="text" id="docCompany" value="Acme Corporation" required /></div>
                    <div class="form-group"><label>Job Title</label><input type="text" id="docJobTitle" placeholder="e.g. Software Engineer" required /></div>
                    <div class="form-group"><label>Reason (optional)</label><input type="text" id="docReason" placeholder="e.g. company restructuring" /></div>
                    <div class="form-group"><label>Final Pay Date</label><input type="date" id="docPayDate" value="${new Date(Date.now()+7*24*60*60*1000).toISOString().slice(0,10)}" required /></div>
                    <div class="form-group"><label>Company Property</label><input type="text" id="docProperty" placeholder="Laptop, badge, keys" required /></div>
                    <div class="form-group"><label>HR Professional Name</label><input type="text" id="docHRName" value="${currentUser.name}" required /></div>
                  `;
                    generateFn = 'generateTerminationLetter';
                    break;

                default:
                    toast('Unknown document type.', 'error');
                    return;
            }

            // Build modal with form
            const modalHtml = `
            <div class="modal-header">
              <h3><i class="fas fa-file-pdf"></i> ${docTitle}</h3>
              <button class="close" onclick="closeModal()">&times;</button>
            </div>
            <form id="docForm" onsubmit="event.preventDefault(); ${generateFn}();">
              ${formHtml}
              <div class="form-actions">
                <button type="button" class="btn" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary"><i class="fas fa-file-pdf"></i> Generate</button>
              </div>
            </form>
          `;
            showModal(modalHtml);
        }

        // ============================================================
        //  DOCUMENT GENERATION FUNCTIONS (each opens a new window)
        // ============================================================
        function openDocumentWindow(html, title) {
            const win = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
            if (!win) {
                toast('Please allow popups for this site.', 'warning');
                return;
            }
            win.document.write(`
            <!DOCTYPE html>
            <html>
            <head><title>${title}</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #1e293b; }
              .letterhead { border-bottom: 3px solid #4f46e5; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; }
              .letterhead h1 { color: #4f46e5; margin: 0; }
              .letterhead p { margin: 0; color: #64748b; }
              .content { line-height: 1.7; }
              .content h2 { color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
              .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 14px; color: #64748b; text-align: center; }
              .signature { margin-top: 40px; }
              .signature-line { display: inline-block; width: 200px; border-bottom: 1px solid #1e293b; margin-top: 40px; }
              table { width: 100%; border-collapse: collapse; margin: 16px 0; }
              table td, table th { padding: 8px 12px; border: 1px solid #e2e8f0; }
              table th { background: #f8fafc; font-weight: 600; }
              .print-btn { background: #4f46e5; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; margin-top: 20px; }
              @media print { .no-print { display: none; } }
            </style>
            </head>
            <body>
              ${html}
              <div class="no-print" style="text-align:center;margin-top:20px;">
                <button onclick="window.print()" class="print-btn"><i class="fas fa-print"></i> Print / Save as PDF</button>
                <button onclick="window.close()" class="print-btn" style="background:#64748b;margin-left:10px;">Close</button>
              </div>
            </body>
            </html>
          `);
            win.document.close();
        }

        // ----- Helper to get form values -----
        function getDocFormValues() {
            const get = (id) => document.getElementById(id)?.value || '';
            return {
                date: get('docDate'),
                candidate: get('docCandidate'),
                employee: get('docEmployee'),
                jobTitle: get('docJobTitle'),
                company: get('docCompany'),
                manager: get('docManager'),
                salary: get('docSalary'),
                payFreq: get('docPayFreq'),
                benefits: get('docBenefits'),
                benefitsDate: get('docBenefitsDate'),
                startDate: get('docStartDate'),
                expireDate: get('docExpireDate'),
                hrName: get('docHRName'),
                interviewDate: get('docInterviewDate'),
                interviewTime: get('docInterviewTime'),
                location: get('docLocation'),
                interviewers: get('docInterviewers'),
                replyDate: get('docReplyDate'),
                probation: get('docProbation'),
                duties: get('docDuties'),
                periodStart: get('docPeriodStart'),
                periodEnd: get('docPeriodEnd'),
                payDate: get('docPayDate'),
                baseSalary: get('docBaseSalary'),
                overtime: get('docOvertime'),
                bonus: get('docBonus'),
                fedTax: get('docFedTax'),
                stateTax: get('docStateTax'),
                health: get('docHealth'),
                '401k': get('doc401k'),
                otherDed: get('docOtherDed'),
                account: get('docAccount'),
                newTitle: get('docNewTitle'),
                effectiveDate: get('docEffectiveDate'),
                reason: get('docReason'),
                bonusAmount: get('docBonusAmount'),
                period: get('docPeriod'),
                empType: get('docEmpType'),
                hrPhone: get('docHRPhone'),
                hrEmail: get('docHREmail'),
                leaveStart: get('docLeaveStart'),
                returnDate: get('docReturnDate'),
                paidStatus: get('docPaidStatus'),
                benefitsCont: get('docBenefitsCont'),
                noticeDate: get('docNoticeDate'),
                finalDate: get('docFinalDate'),
                pto: get('docPTO'),
                property: get('docProperty'),
                empSelect: document.getElementById('docEmpSelect')?.value,
            };
        }

        // ----- Individual generation functions -----
        function generateInterviewInvitation() {
            const v = getDocFormValues();
            if (!v.candidate || !v.jobTitle || !v.company || !v.interviewDate || !v.interviewTime || !v.location || !v
                .interviewers || !v.hrName || !v.replyDate) {
                toast('Please fill all required fields.', 'warning');
                return;
            }
            const html = `
            <div class="letterhead">
              <div><h1>${v.company}</h1><p>Human Resources</p></div>
              <div style="text-align:right;"><p><strong>Date:</strong> ${formatDate(v.date)}</p></div>
            </div>
            <div class="content">
              <h2>Interview Invitation</h2>
              <p><strong>Subject:</strong> Interview Invitation â€“ ${v.jobTitle} at ${v.company}</p>
              <p>Dear ${v.candidate},</p>
              <p>Thank you for applying for the ${v.jobTitle} position at ${v.company}. We were impressed by your background and would like to invite you to an interview to discuss your qualifications further.</p>
              <p><strong>Interview Details:</strong></p>
              <ul>
                <li><strong>Date:</strong> ${formatDate(v.interviewDate)}</li>
                <li><strong>Time:</strong> ${v.interviewTime}</li>
                <li><strong>Location/Link:</strong> ${v.location}</li>
                <li><strong>Interviewer(s):</strong> ${v.interviewers}</li>
              </ul>
              <p>Please reply to this email by ${formatDate(v.replyDate)} to confirm your availability. If you require any accommodations for the interview, please let us know.</p>
              <div class="signature">
                <p>Sincerely,</p>
                <p><strong>${v.hrName}</strong><br>${v.company}</p>
              </div>
            </div>
            <div class="footer">This is a system-generated document.</div>
          `;
            openDocumentWindow(html, 'Interview Invitation - ' + v.candidate);
            toast('Interview invitation generated!', 'success');
            closeModal();
        }

        function generateOfferLetterCustom() {
            const v = getDocFormValues();
            if (!v.candidate || !v.jobTitle || !v.company || !v.manager || !v.salary || !v.benefits || !v.benefitsDate || !v
                .startDate || !v.expireDate || !v.hrName) {
                toast('Please fill all required fields.', 'warning');
                return;
            }
            const html = `
            <div class="letterhead">
              <div><h1>${v.company}</h1><p>Human Resources</p></div>
              <div style="text-align:right;"><p><strong>Date:</strong> ${formatDate(v.date)}</p></div>
            </div>
            <div class="content">
              <h2>Offer Letter</h2>
              <p>Dear ${v.candidate},</p>
              <p>We are thrilled to offer you the position of <strong>${v.jobTitle}</strong> at ${v.company}, reporting to ${v.manager}.</p>
              <p>Your starting base salary will be $${v.salary} per ${v.payFreq}, paid [Pay Frequency]. You will also be eligible for ${v.benefits} starting on ${formatDate(v.benefitsDate)}. Your expected start date is ${formatDate(v.startDate)}.</p>
              <p>This offer is contingent upon the successful completion of a background check. Please sign and return this letter by ${formatDate(v.expireDate)} to accept this offer.</p>
              <div class="signature">
                <p>Sincerely,</p>
                <p><strong>${v.hrName}</strong><br>${v.company}</p>
                <div class="signature-line"></div>
                <p style="margin-top:4px;">Signature: _____________________ Date: ___________</p>
              </div>
            </div>
            <div class="footer">This is a system-generated document.</div>
          `;
            openDocumentWindow(html, 'Offer Letter - ' + v.candidate);
            toast('Offer letter generated!', 'success');
            closeModal();
        }

        function generateAppointmentLetterCustom() {
            const v = getDocFormValues();
            if (!v.employee || !v.jobTitle || !v.company || !v.salary || !v.probation || !v.duties || !v.startDate || !v
                .hrName) {
                toast('Please fill all required fields.', 'warning');
                return;
            }
            const probEnd = new Date(v.startDate);
            probEnd.setDate(probEnd.getDate() + parseInt(v.probation));
            const html = `
            <div class="letterhead">
              <div><h1>${v.company}</h1><p>Human Resources</p></div>
              <div style="text-align:right;"><p><strong>Date:</strong> ${formatDate(v.date)}</p></div>
            </div>
            <div class="content">
              <h2>Appointment Letter</h2>
              <p>Dear ${v.employee},</p>
              <p>Following your acceptance of our offer, we are pleased to officially appoint you to the position of <strong>${v.jobTitle}</strong> at ${v.company}, effective ${formatDate(v.startDate)}.</p>
              <p><strong>Terms and Conditions of Employment:</strong></p>
              <ul>
                <li><strong>Compensation:</strong> Your base salary is $${v.salary} annually.</li>
                <li><strong>Probationary Period:</strong> You will be on a probationary period of ${v.probation} days, ending on ${formatDate(probEnd.toISOString())}.</li>
                <li><strong>Duties:</strong> You will be responsible for ${v.duties} and any other duties assigned by your manager.</li>
                <li><strong>Company Policies:</strong> Your employment is governed by the rules and regulations outlined in the Employee Handbook.</li>
              </ul>
              <p>Please sign a copy of this letter for your personnel file.</p>
              <div class="signature">
                <p>Sincerely,</p>
                <p><strong>${v.hrName}</strong><br>${v.company}</p>
                <div class="signature-line"></div>
                <p style="margin-top:4px;">Signature: _____________________ Date: ___________</p>
              </div>
            </div>
            <div class="footer">This is a system-generated document.</div>
          `;
            openDocumentWindow(html, 'Appointment Letter - ' + v.employee);
            toast('Appointment letter generated!', 'success');
            closeModal();
        }

        function generatePayslipCustom() {
            const v = getDocFormValues();
            const empId = v.empSelect;
            const emp = getEmployee(parseInt(empId));
            if (!emp) { toast('Please select an employee.', 'warning'); return; }
            // Use payroll data or form values
            const base = parseFloat(v.baseSalary) || 0;
            const overtime = parseFloat(v.overtime) || 0;
            const bonus = parseFloat(v.bonus) || 0;
            const fedTax = parseFloat(v.fedTax) || 0;
            const stateTax = parseFloat(v.stateTax) || 0;
            const health = parseFloat(v.health) || 0;
            const k401 = parseFloat(v['401k']) || 0;
            const otherDed = parseFloat(v.otherDed) || 0;
            const gross = base + overtime + bonus;
            const totalDed = fedTax + stateTax + health + k401 + otherDed;
            const net = gross - totalDed;

            const html = `
            <div class="letterhead">
              <div><h1>${v.company}</h1><p>Payroll Department</p></div>
              <div style="text-align:right;"><p><strong>Payslip</strong></p></div>
            </div>
            <div class="content">
              <h2>Salary Statement</h2>
              <p><strong>Employee:</strong> ${emp.name}</p>
              <p><strong>Pay Period:</strong> ${formatDate(v.periodStart)} - ${formatDate(v.periodEnd)}</p>
              <p><strong>Pay Date:</strong> ${formatDate(v.payDate)}</p>
              <table>
                <tr><th>Earnings</th><th>Amount ($)</th></tr>
                <tr><td>Base Salary (Regular)</td><td>${base.toFixed(2)}</td></tr>
                <tr><td>Overtime</td><td>${overtime.toFixed(2)}</td></tr>
                <tr><td>Bonus/Commission</td><td>${bonus.toFixed(2)}</td></tr>
                <tr><td><strong>Gross Pay</strong></td><td><strong>${gross.toFixed(2)}</strong></td></tr>
              </table>
              <table>
                <tr><th>Deductions</th><th>Amount ($)</th></tr>
                <tr><td>Federal Income Tax</td><td>${fedTax.toFixed(2)}</td></tr>
                <tr><td>State Income Tax</td><td>${stateTax.toFixed(2)}</td></tr>
                <tr><td>Health Insurance</td><td>${health.toFixed(2)}</td></tr>
                <tr><td>401(k) Contribution</td><td>${k401.toFixed(2)}</td></tr>
                <tr><td>Other Deductions</td><td>${otherDed.toFixed(2)}</td></tr>
                <tr><td><strong>Total Deductions</strong></td><td><strong>${totalDed.toFixed(2)}</strong></td></tr>
              </table>
              <p><strong>Net Pay:</strong> $${net.toFixed(2)} (Deposited to Account ending in ${v.account || '****'})</p>
            </div>
            <div class="footer">This is a computer-generated payslip.</div>
          `;
            openDocumentWindow(html, 'Payslip - ' + emp.name);
            toast('Payslip generated!', 'success');
            closeModal();
        }

        function generatePromotionLetter() {
            const v = getDocFormValues();
            if (!v.employee || !v.newTitle || !v.company || !v.manager || !v.salary || !v.effectiveDate || !v.hrName) {
                toast('Please fill all required fields.', 'warning');
                return;
            }
            const html = `
            <div class="letterhead">
              <div><h1>${v.company}</h1><p>Human Resources</p></div>
              <div style="text-align:right;"><p><strong>Date:</strong> ${formatDate(v.date)}</p></div>
            </div>
            <div class="content">
              <h2>Promotion Letter</h2>
              <p>Dear ${v.employee},</p>
              <p>In recognition of your outstanding performance and dedication, we are excited to promote you to the position of <strong>${v.newTitle}</strong>, effective ${formatDate(v.effectiveDate)}.</p>
              <p>In this new role, you will report directly to ${v.manager}. Your annual base salary will be increased to $${v.salary}. All other terms and conditions of your employment, including your benefits eligibility, will remain unchanged.</p>
              <p>Congratulations on this well-deserved advancement. We look forward to your continued success at ${v.company}.</p>
              <div class="signature">
                <p>Sincerely,</p>
                <p><strong>${v.hrName}</strong><br>${v.company}</p>
              </div>
            </div>
            <div class="footer">This is a system-generated document.</div>
          `;
            openDocumentWindow(html, 'Promotion Letter - ' + v.employee);
            toast('Promotion letter generated!', 'success');
            closeModal();
        }

        function generateSalaryAdjustment() {
            const v = getDocFormValues();
            if (!v.employee || !v.company || !v.salary || !v.effectiveDate || !v.reason || !v.hrName) {
                toast('Please fill all required fields.', 'warning');
                return;
            }
            const html = `
            <div class="letterhead">
              <div><h1>${v.company}</h1><p>Human Resources</p></div>
              <div style="text-align:right;"><p><strong>Date:</strong> ${formatDate(v.date)}</p></div>
            </div>
            <div class="content">
              <h2>Salary Adjustment Letter</h2>
              <p>Dear ${v.employee},</p>
              <p>We are writing to inform you of a change to your compensation. Effective ${formatDate(v.effectiveDate)}, your base salary will be increased to $${v.salary} per ${v.payFreq}.</p>
              <p>This adjustment reflects ${v.reason}. Your job title and all other terms of your employment remain the same.</p>
              <p>Thank you for your continued hard work and contributions to ${v.company}.</p>
              <div class="signature">
                <p>Sincerely,</p>
                <p><strong>${v.hrName}</strong><br>${v.company}</p>
              </div>
            </div>
            <div class="footer">This is a system-generated document.</div>
          `;
            openDocumentWindow(html, 'Salary Adjustment - ' + v.employee);
            toast('Salary adjustment letter generated!', 'success');
            closeModal();
        }

        function generateBonusLetter() {
            const v = getDocFormValues();
            if (!v.employee || !v.company || !v.bonusAmount || !v.payDate || !v.period || !v.hrName) {
                toast('Please fill all required fields.', 'warning');
                return;
            }
            const html = `
            <div class="letterhead">
              <div><h1>${v.company}</h1><p>Human Resources</p></div>
              <div style="text-align:right;"><p><strong>Date:</strong> ${formatDate(v.date)}</p></div>
            </div>
            <div class="content">
              <h2>Bonus Award Letter</h2>
              <p>Dear ${v.employee},</p>
              <p>Thank you for your exceptional contributions to ${v.company} over the past ${v.period}. In recognition of your efforts, we are pleased to award you a performance bonus of $${v.bonusAmount}.</p>
              <p>This amount will be included in your paycheck on ${formatDate(v.payDate)} and is subject to standard tax withholdings.</p>
              <p>We deeply appreciate your commitment to our team's goals.</p>
              <div class="signature">
                <p>Sincerely,</p>
                <p><strong>${v.hrName}</strong><br>${v.company}</p>
              </div>
            </div>
            <div class="footer">This is a system-generated document.</div>
          `;
            openDocumentWindow(html, 'Bonus Award - ' + v.employee);
            toast('Bonus letter generated!', 'success');
            closeModal();
        }

        function generateVerificationLetter() {
            const v = getDocFormValues();
            if (!v.employee || !v.company || !v.jobTitle || !v.startDate || !v.salary || !v.hrPhone || !v.hrEmail || !v
                .hrName) {
                toast('Please fill all required fields.', 'warning');
                return;
            }
            const html = `
            <div class="letterhead">
              <div><h1>${v.company}</h1><p>Human Resources</p></div>
              <div style="text-align:right;"><p><strong>Date:</strong> ${formatDate(v.date)}</p></div>
            </div>
            <div class="content">
              <h2>Employment Verification Letter</h2>
              <p>To Whom It May Concern:</p>
              <p>This letter is to verify the employment of <strong>${v.employee}</strong> at ${v.company}.</p>
              <p>${v.employee} has been employed with us since ${formatDate(v.startDate)} and currently holds the title of <strong>${v.jobTitle}</strong> on a ${v.empType} basis. Their current base salary is $${v.salary} per Year.</p>
              <p>Should you require any further information, please contact our Human Resources department at ${v.hrPhone} or ${v.hrEmail}.</p>
              <div class="signature">
                <p>Sincerely,</p>
                <p><strong>${v.hrName}</strong><br>${v.company}</p>
              </div>
            </div>
            <div class="footer">This is a system-generated document.</div>
          `;
            openDocumentWindow(html, 'Employment Verification - ' + v.employee);
            toast('Verification letter generated!', 'success');
            closeModal();
        }

        function generateLeaveLetter() {
            const v = getDocFormValues();
            if (!v.employee || !v.company || !v.reason || !v.leaveStart || !v.returnDate || !v.benefitsCont || !v.hrName) {
                toast('Please fill all required fields.', 'warning');
                return;
            }
            const html = `
            <div class="letterhead">
              <div><h1>${v.company}</h1><p>Human Resources</p></div>
              <div style="text-align:right;"><p><strong>Date:</strong> ${formatDate(v.date)}</p></div>
            </div>
            <div class="content">
              <h2>Leave of Absence Letter</h2>
              <p>Dear ${v.employee},</p>
              <p>This letter confirms the approval of your requested leave of absence for ${v.reason}, beginning on ${formatDate(v.leaveStart)}. Your expected date of return to work is ${formatDate(v.returnDate)}.</p>
              <p>During this period, your leave will be <strong>${v.paidStatus}</strong>. ${v.benefitsCont}.</p>
              <p>Please notify HR at least [Number] days before your expected return date to confirm your status.</p>
              <div class="signature">
                <p>Sincerely,</p>
                <p><strong>${v.hrName}</strong><br>${v.company}</p>
              </div>
            </div>
            <div class="footer">This is a system-generated document.</div>
          `;
            openDocumentWindow(html, 'Leave of Absence - ' + v.employee);
            toast('Leave letter generated!', 'success');
            closeModal();
        }

        function generateResignationLetter() {
            const v = getDocFormValues();
            if (!v.employee || !v.company || !v.jobTitle || !v.noticeDate || !v.finalDate || !v.payDate || !v.property || !
                v.hrName) {
                toast('Please fill all required fields.', 'warning');
                return;
            }
            const html = `
            <div class="letterhead">
              <div><h1>${v.company}</h1><p>Human Resources</p></div>
              <div style="text-align:right;"><p><strong>Date:</strong> ${formatDate(v.date)}</p></div>
            </div>
            <div class="content">
              <h2>Acceptance of Resignation</h2>
              <p>Dear ${v.employee},</p>
              <p>This letter formally acknowledges the receipt of your resignation from the position of <strong>${v.jobTitle}</strong> at ${v.company}, dated ${formatDate(v.noticeDate)}.</p>
              <p>As per your notice, your final day of employment will be ${formatDate(v.finalDate)}. Your final paycheck, including ${v.pto || 'any accrued but unused PTO'}, will be processed on ${formatDate(v.payDate)} via [Direct Deposit/Mailed Check].</p>
              <p>Please return all company property, including ${v.property}, to IT/HR by the end of your final day. We will follow up shortly to schedule a brief exit interview.</p>
              <p>We wish you the best in your future endeavors.</p>
              <div class="signature">
                <p>Sincerely,</p>
                <p><strong>${v.hrName}</strong><br>${v.company}</p>
              </div>
            </div>
            <div class="footer">This is a system-generated document.</div>
          `;
            openDocumentWindow(html, 'Resignation Acceptance - ' + v.employee);
            toast('Resignation letter generated!', 'success');
            closeModal();
        }

        function generateTerminationLetter() {
            const v = getDocFormValues();
            if (!v.employee || !v.company || !v.jobTitle || !v.payDate || !v.property || !v.hrName) {
                toast('Please fill all required fields.', 'warning');
                return;
            }
            const html = `
            <div class="letterhead">
              <div><h1>${v.company}</h1><p>Human Resources</p></div>
              <div style="text-align:right;"><p><strong>Date:</strong> ${formatDate(v.date)}</p></div>
            </div>
            <div class="content">
              <h2>Termination Letter</h2>
              <p>Dear ${v.employee},</p>
              <p>This letter is to formally notify you that your employment with ${v.company} is terminated, effective immediately, ${formatDate(v.date)}.</p>
              ${v.reason ? `<p>This decision is a result of ${v.reason}.</p>` : ''}
              <p>Your final paycheck for hours worked through today, along with any accrued PTO payout, will be [mailed to your address on file / deposited] on ${formatDate(v.payDate)}. Information regarding the continuation of your health benefits (COBRA) will be mailed to you under separate cover.</p>
              <p>Please immediately return all company property, including ${v.property}, to [Name/Department].</p>
              <div class="signature">
                <p>Sincerely,</p>
                <p><strong>${v.hrName}</strong><br>${v.company}</p>
              </div>
            </div>
            <div class="footer">This is a system-generated document.</div>
          `;
            openDocumentWindow(html, 'Termination Letter - ' + v.employee);
            toast('Termination letter generated!', 'success');
            closeModal();
        }

        // ============================================================
        //  NAVIGATION & EVENTS
        // ============================================================
        document.querySelectorAll('.nav-item').forEach(el => {
            el.addEventListener('click', () => {
                const page = el.dataset.page;
                if (page) navigateTo(page);
                document.getElementById('sidebar').classList.remove('open');
            });
        });

        document.getElementById('hamburgerBtn').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });

        document.getElementById('logoutBtn').addEventListener('click', logout);

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            login(email, password);
        });

        document.getElementById('globalSearch').addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();
            const rows = document.querySelectorAll('#pageContent table tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = !q || text.includes(q) ? '' : 'none';
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
            if (e.ctrlKey && e.key === 'k') { e.preventDefault();
                document.getElementById('globalSearch').focus(); }
        });

        // ============================================================
        //  INIT
        // ============================================================
        document.getElementById('loginEmail').value = 'admin@crm.com';
        document.getElementById('loginPassword').value = 'admin123';
        renderApp();

        console.log('ðŸš€ CRM+HR System loaded. Data:', db);
        console.log('ðŸ’¡ Use admin@crm.com / admin123 to login. If login fails, click "Reset Data".');
