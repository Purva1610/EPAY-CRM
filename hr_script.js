document.addEventListener('DOMContentLoaded', function(){
        // ═══════════════════════════════════════════════════════════════════
        //  DATA STORE (localStorage)
        // ═══════════════════════════════════════════════════════════════════

        const DB_KEY = 'crm_hr_erp_data';

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
                    { id: 6, name: 'Raj Patel', email: 'raj@crm.com', role: 'employee', password: 'emp123',
                        avatar: 'R' },
                    { id: 7, name: 'Lisa Wong', email: 'lisa@crm.com', role: 'employee', password: 'emp123',
                        avatar: 'L' },
                ],
                employees: [{
                    id: 1,
                    name: 'Emily Chen',
                    email: 'emp@crm.com',
                    department: 'Engineering',
                    position: 'Senior Developer',
                    status: 'active',
                    joined: '2023-06-01',
                    phone: '+1 234 567 890',
                    dob: '1990-05-15',
                    gender: 'Female',
                    bloodGroup: 'A+',
                    maritalStatus: 'Single',
                    nationality: 'American',
                    personalEmail: 'emily@gmail.com',
                    officialEmail: 'emp@crm.com',
                    mobile: '+1 234 567 890',
                    alternate: '+1 234 567 891',
                    address: '123 Main St, NYC',
                    city: 'New York',
                    state: 'NY',
                    country: 'USA',
                    pin: '10001',
                    father: 'Robert Chen',
                    mother: 'Mary Chen',
                    spouse: '',
                    emergencyContact: 'John Doe',
                    emergencyRelation: 'Brother',
                    emergencyPhone: '+1 234 567 892',
                    pan: 'ABCDE1234F',
                    aadhaar: '1234 5678 9012',
                    uan: '123456789012',
                    pfNumber: 'PF123456',
                    esic: 'ESIC123',
                    bankName: 'Chase',
                    accountHolder: 'Emily Chen',
                    accountNumber: '1234567890',
                    ifsc: 'CHAS1234',
                    branch: 'NYC Main',
                    accountType: 'Savings',
                    upi: 'emily@upi',
                    salary: 85000,
                    ctc: 110000,
                    basic: 34000,
                    hra: 17000,
                    conveyance: 8000,
                    special: 26000,
                    grossEarnings: 85000,
                    pf: 4000,
                    esic: 1000,
                    professionalTax: 200,
                    tds: 8500,
                    totalDeduction: 13700,
                    netSalary: 71300,
                    designation: 'Senior Developer',
                    jobGrade: 'L5',
                    employmentType: 'Full Time',
                    reportingManager: 'Admin User',
                    probation: 90,
                    probationEnd: '2023-08-30',
                    confirmationDate: '2023-09-01',
                    employeeCode: 'EMP001',
                    employeeNumber: 'E001',
                    role: 'developer'
                }, {
                    id: 2,
                    name: 'Michael Torres',
                    email: 'michael@crm.com',
                    department: 'Sales',
                    position: 'Sales Manager',
                    status: 'active',
                    joined: '2022-11-15',
                    phone: '+1 345 678 901',
                    dob: '1988-08-20',
                    gender: 'Male',
                    bloodGroup: 'O+',
                    maritalStatus: 'Married',
                    nationality: 'American',
                    personalEmail: 'michael@gmail.com',
                    officialEmail: 'michael@crm.com',
                    mobile: '+1 345 678 901',
                    alternate: '+1 345 678 902',
                    address: '456 Oak Ave, LA',
                    city: 'Los Angeles',
                    state: 'CA',
                    country: 'USA',
                    pin: '90001',
                    father: 'Carlos Torres',
                    mother: 'Maria Torres',
                    spouse: 'Laura Torres',
                    emergencyContact: 'Laura Torres',
                    emergencyRelation: 'Spouse',
                    emergencyPhone: '+1 345 678 903',
                    pan: 'FGHIJ5678K',
                    aadhaar: '5678 9012 3456',
                    uan: '987654321098',
                    pfNumber: 'PF789012',
                    esic: 'ESIC456',
                    bankName: 'Wells Fargo',
                    accountHolder: 'Michael Torres',
                    accountNumber: '9876543210',
                    ifsc: 'WELL1234',
                    branch: 'LA Main',
                    accountType: 'Checking',
                    upi: 'michael@upi',
                    salary: 72000,
                    ctc: 95000,
                    basic: 28800,
                    hra: 14400,
                    conveyance: 7200,
                    special: 21600,
                    grossEarnings: 72000,
                    pf: 3500,
                    esic: 900,
                    professionalTax: 200,
                    tds: 7200,
                    totalDeduction: 11800,
                    netSalary: 60200,
                    designation: 'Sales Manager',
                    jobGrade: 'L4',
                    employmentType: 'Full Time',
                    reportingManager: 'Admin User',
                    probation: 60,
                    probationEnd: '2023-01-14',
                    confirmationDate: '2023-01-15',
                    employeeCode: 'EMP002',
                    employeeNumber: 'E002',
                    role: 'sales'
                }, {
                    id: 3,
                    name: 'Sarah Kim',
                    email: 'sarah@crm.com',
                    department: 'Marketing',
                    position: 'Marketing Lead',
                    status: 'active',
                    joined: '2023-09-10',
                    phone: '+1 456 789 012',
                    dob: '1992-11-25',
                    gender: 'Female',
                    bloodGroup: 'B+',
                    maritalStatus: 'Single',
                    nationality: 'American',
                    personalEmail: 'sarah@gmail.com',
                    officialEmail: 'sarah@crm.com',
                    mobile: '+1 456 789 012',
                    alternate: '+1 456 789 013',
                    address: '789 Pine St, SF',
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'USA',
                    pin: '94101',
                    father: 'David Kim',
                    mother: 'Linda Kim',
                    spouse: '',
                    emergencyContact: 'David Kim',
                    emergencyRelation: 'Father',
                    emergencyPhone: '+1 456 789 014',
                    pan: 'LMNOP9012Q',
                    aadhaar: '9012 3456 7890',
                    uan: '543210987654',
                    pfNumber: 'PF345678',
                    esic: 'ESIC789',
                    bankName: 'Bank of America',
                    accountHolder: 'Sarah Kim',
                    accountNumber: '5678901234',
                    ifsc: 'BOFA1234',
                    branch: 'SF Main',
                    accountType: 'Savings',
                    upi: 'sarah@upi',
                    salary: 68000,
                    ctc: 89000,
                    basic: 27200,
                    hra: 13600,
                    conveyance: 6800,
                    special: 20400,
                    grossEarnings: 68000,
                    pf: 3200,
                    esic: 800,
                    professionalTax: 200,
                    tds: 6800,
                    totalDeduction: 11000,
                    netSalary: 57000,
                    designation: 'Marketing Lead',
                    jobGrade: 'L4',
                    employmentType: 'Full Time',
                    reportingManager: 'Admin User',
                    probation: 60,
                    probationEnd: '2023-11-09',
                    confirmationDate: '2023-11-10',
                    employeeCode: 'EMP003',
                    employeeNumber: 'E003',
                    role: 'marketing'
                }, {
                    id: 4,
                    name: 'James Okafor',
                    email: 'james@crm.com',
                    department: 'Engineering',
                    position: 'DevOps Engineer',
                    status: 'pending',
                    joined: '2024-01-20',
                    phone: '+1 567 890 123',
                    dob: '1991-03-10',
                    gender: 'Male',
                    bloodGroup: 'AB+',
                    maritalStatus: 'Single',
                    nationality: 'Nigerian',
                    personalEmail: 'james@gmail.com',
                    officialEmail: 'james@crm.com',
                    mobile: '+1 567 890 123',
                    alternate: '+1 567 890 124',
                    address: '321 Elm St, Chicago',
                    city: 'Chicago',
                    state: 'IL',
                    country: 'USA',
                    pin: '60601',
                    father: 'Chidi Okafor',
                    mother: 'Ngozi Okafor',
                    spouse: '',
                    emergencyContact: 'Chidi Okafor',
                    emergencyRelation: 'Father',
                    emergencyPhone: '+1 567 890 125',
                    pan: 'QRSTU3456V',
                    aadhaar: '3456 7890 1234',
                    uan: '876543210987',
                    pfNumber: 'PF901234',
                    esic: 'ESIC012',
                    bankName: 'Citibank',
                    accountHolder: 'James Okafor',
                    accountNumber: '9012345678',
                    ifsc: 'CITI1234',
                    branch: 'Chicago Main',
                    accountType: 'Savings',
                    upi: 'james@upi',
                    salary: 65000,
                    ctc: 85000,
                    basic: 26000,
                    hra: 13000,
                    conveyance: 6500,
                    special: 19500,
                    grossEarnings: 65000,
                    pf: 3000,
                    esic: 700,
                    professionalTax: 200,
                    tds: 6500,
                    totalDeduction: 10400,
                    netSalary: 54600,
                    designation: 'DevOps Engineer',
                    jobGrade: 'L3',
                    employmentType: 'Full Time',
                    reportingManager: 'Admin User',
                    probation: 90,
                    probationEnd: '2024-04-19',
                    confirmationDate: '',
                    employeeCode: 'EMP004',
                    employeeNumber: 'E004',
                    role: 'developer'
                }, {
                    id: 5,
                    name: 'Priya Sharma',
                    email: 'priya@crm.com',
                    department: 'HR',
                    position: 'HR Coordinator',
                    status: 'active',
                    joined: '2023-04-05',
                    phone: '+1 678 901 234',
                    dob: '1993-07-12',
                    gender: 'Female',
                    bloodGroup: 'A-',
                    maritalStatus: 'Married',
                    nationality: 'Indian',
                    personalEmail: 'priya@gmail.com',
                    officialEmail: 'priya@crm.com',
                    mobile: '+1 678 901 234',
                    alternate: '+1 678 901 235',
                    address: '654 Cedar St, Dallas',
                    city: 'Dallas',
                    state: 'TX',
                    country: 'USA',
                    pin: '75201',
                    father: 'Ravi Sharma',
                    mother: 'Anita Sharma',
                    spouse: 'Vikram Singh',
                    emergencyContact: 'Vikram Singh',
                    emergencyRelation: 'Spouse',
                    emergencyPhone: '+1 678 901 236',
                    pan: 'UVWXY7890Z',
                    aadhaar: '7890 1234 5678',
                    uan: '210987654321',
                    pfNumber: 'PF567890',
                    esic: 'ESIC345',
                    bankName: 'Chase',
                    accountHolder: 'Priya Sharma',
                    accountNumber: '2345678901',
                    ifsc: 'CHAS5678',
                    branch: 'Dallas Main',
                    accountType: 'Savings',
                    upi: 'priya@upi',
                    salary: 58000,
                    ctc: 75000,
                    basic: 23200,
                    hra: 11600,
                    conveyance: 5800,
                    special: 17400,
                    grossEarnings: 58000,
                    pf: 2700,
                    esic: 600,
                    professionalTax: 200,
                    tds: 5800,
                    totalDeduction: 9300,
                    netSalary: 48700,
                    designation: 'HR Coordinator',
                    jobGrade: 'L3',
                    employmentType: 'Full Time',
                    reportingManager: 'Admin User',
                    probation: 60,
                    probationEnd: '2023-06-04',
                    confirmationDate: '2023-06-05',
                    employeeCode: 'EMP005',
                    employeeNumber: 'E005',
                    role: 'hr'
                }, {
                    id: 6,
                    name: 'Raj Patel',
                    email: 'raj@crm.com',
                    department: 'Sales',
                    position: 'Telecaller',
                    status: 'active',
                    joined: '2024-02-01',
                    phone: '+1 789 012 345',
                    dob: '1995-09-05',
                    gender: 'Male',
                    bloodGroup: 'O-',
                    maritalStatus: 'Single',
                    nationality: 'Indian',
                    personalEmail: 'raj@gmail.com',
                    officialEmail: 'raj@crm.com',
                    mobile: '+1 789 012 345',
                    alternate: '+1 789 012 346',
                    address: '987 Spruce St, Atlanta',
                    city: 'Atlanta',
                    state: 'GA',
                    country: 'USA',
                    pin: '30301',
                    father: 'Kumar Patel',
                    mother: 'Sita Patel',
                    spouse: '',
                    emergencyContact: 'Kumar Patel',
                    emergencyRelation: 'Father',
                    emergencyPhone: '+1 789 012 347',
                    pan: 'ABCDE5678F',
                    aadhaar: '5678 1234 9012',
                    uan: '654321098765',
                    pfNumber: 'PF234567',
                    esic: 'ESIC678',
                    bankName: 'Wells Fargo',
                    accountHolder: 'Raj Patel',
                    accountNumber: '3456789012',
                    ifsc: 'WELL5678',
                    branch: 'Atlanta Main',
                    accountType: 'Savings',
                    upi: 'raj@upi',
                    salary: 42000,
                    ctc: 55000,
                    basic: 16800,
                    hra: 8400,
                    conveyance: 4200,
                    special: 12600,
                    grossEarnings: 42000,
                    pf: 2000,
                    esic: 500,
                    professionalTax: 200,
                    tds: 4200,
                    totalDeduction: 6900,
                    netSalary: 35100,
                    designation: 'Telecaller',
                    jobGrade: 'L2',
                    employmentType: 'Full Time',
                    reportingManager: 'Michael Torres',
                    probation: 60,
                    probationEnd: '2024-04-01',
                    confirmationDate: '',
                    employeeCode: 'EMP006',
                    employeeNumber: 'E006',
                    role: 'telecaller'
                }, {
                    id: 7,
                    name: 'Lisa Wong',
                    email: 'lisa@crm.com',
                    department: 'Marketing',
                    position: 'Social Media Manager',
                    status: 'active',
                    joined: '2023-11-15',
                    phone: '+1 890 123 456',
                    dob: '1994-02-28',
                    gender: 'Female',
                    bloodGroup: 'AB-',
                    maritalStatus: 'Single',
                    nationality: 'American',
                    personalEmail: 'lisa@gmail.com',
                    officialEmail: 'lisa@crm.com',
                    mobile: '+1 890 123 456',
                    alternate: '+1 890 123 457',
                    address: '246 Birch St, Seattle',
                    city: 'Seattle',
                    state: 'WA',
                    country: 'USA',
                    pin: '98101',
                    father: 'Michael Wong',
                    mother: 'Jennifer Wong',
                    spouse: '',
                    emergencyContact: 'Michael Wong',
                    emergencyRelation: 'Father',
                    emergencyPhone: '+1 890 123 458',
                    pan: 'FGHIJ9012K',
                    aadhaar: '9012 5678 3456',
                    uan: '432109876543',
                    pfNumber: 'PF456789',
                    esic: 'ESIC901',
                    bankName: 'Bank of America',
                    accountHolder: 'Lisa Wong',
                    accountNumber: '4567890123',
                    ifsc: 'BOFA5678',
                    branch: 'Seattle Main',
                    accountType: 'Savings',
                    upi: 'lisa@upi',
                    salary: 55000,
                    ctc: 72000,
                    basic: 22000,
                    hra: 11000,
                    conveyance: 5500,
                    special: 16500,
                    grossEarnings: 55000,
                    pf: 2600,
                    esic: 600,
                    professionalTax: 200,
                    tds: 5500,
                    totalDeduction: 8900,
                    netSalary: 46100,
                    designation: 'Social Media Manager',
                    jobGrade: 'L3',
                    employmentType: 'Full Time',
                    reportingManager: 'Sarah Kim',
                    probation: 60,
                    probationEnd: '2024-01-14',
                    confirmationDate: '2024-01-15',
                    employeeCode: 'EMP007',
                    employeeNumber: 'E007',
                    role: 'socialmedia'
                }, ],
                shifts: [
                    { id: 1, name: 'Morning Shift', startTime: '09:00', endTime: '18:00', breakDuration: '60',
                        gracePeriod: '15', weeklyOff: 'Sunday', nightShift: false, shiftAllowance: 0,
                    status: 'active' },
                    { id: 2, name: 'Night Shift', startTime: '22:00', endTime: '06:00', breakDuration: '60',
                        gracePeriod: '15', weeklyOff: 'Monday', nightShift: true, shiftAllowance: 5000,
                    status: 'active' },
                ],
                leaveTypes: [
                    { id: 1, name: 'Casual Leave', code: 'CL', maxDays: 12, carryForward: true, encashment: true },
                    { id: 2, name: 'Sick Leave', code: 'SL', maxDays: 10, carryForward: false, encashment: false },
                    { id: 3, name: 'Earned Leave', code: 'EL', maxDays: 15, carryForward: true, encashment: true },
                    { id: 4, name: 'Maternity Leave', code: 'ML', maxDays: 180, carryForward: false,
                    encashment: false },
                    { id: 5, name: 'Paternity Leave', code: 'PL', maxDays: 15, carryForward: false,
                    encashment: false },
                    { id: 6, name: 'Comp Off', code: 'CO', maxDays: 5, carryForward: true, encashment: false },
                ],
                leaves: [
                    { id: 1, employeeId: 1, type: 'Casual Leave', startDate: '2026-08-10', endDate: '2026-08-12',
                        totalDays: 3, reason: 'Family event', status: 'approved', appliedDate: '2026-08-01',
                        approvedBy: 'Admin User' },
                    { id: 2, employeeId: 2, type: 'Sick Leave', startDate: '2026-08-05', endDate: '2026-08-05',
                        totalDays: 1, reason: 'Fever', status: 'pending', appliedDate: '2026-08-05',
                    approvedBy: '' },
                ],
                attendance: [
                    { id: 1, employeeId: 1, date: '2026-08-01', checkIn: '09:05', checkOut: '18:10',
                        totalHours: 9.08, status: 'present', lateMinutes: 5, overtimeHours: 0.17,
                    shift: 'Morning' },
                    { id: 2, employeeId: 2, date: '2026-08-01', checkIn: '08:55', checkOut: '18:00',
                        totalHours: 9.08, status: 'present', lateMinutes: 0, overtimeHours: 0,
                    shift: 'Morning' },
                    { id: 3, employeeId: 3, date: '2026-08-01', checkIn: '00:00', checkOut: '00:00',
                        totalHours: 0, status: 'absent', lateMinutes: 0, overtimeHours: 0, shift: 'Morning' },
                    { id: 4, employeeId: 4, date: '2026-08-01', checkIn: '09:00', checkOut: '18:05',
                        totalHours: 9.08, status: 'present', lateMinutes: 0, overtimeHours: 0.08,
                    shift: 'Morning' },
                    { id: 5, employeeId: 5, date: '2026-08-01', checkIn: '09:00', checkOut: '18:00',
                        totalHours: 9, status: 'present', lateMinutes: 0, overtimeHours: 0, shift: 'Morning' },
                    { id: 6, employeeId: 6, date: '2026-08-01', checkIn: '08:50', checkOut: '18:15',
                        totalHours: 9.42, status: 'present', lateMinutes: 0, overtimeHours: 0.25,
                    shift: 'Morning' },
                    { id: 7, employeeId: 7, date: '2026-08-01', checkIn: '09:10', checkOut: '18:20',
                        totalHours: 9.17, status: 'present', lateMinutes: 10, overtimeHours: 0.33,
                    shift: 'Morning' },
                ],
                requisitions: [
                    { id: 1, department: 'Engineering', position: 'Senior React Developer', vacancies: 2,
                        hiringManager: 'Admin User', recruiter: 'Priya Sharma', experience: '5+ years',
                        qualification: 'B.Tech', skills: 'React,TypeScript,Node.js', salaryRange: '80000-120000',
                        employmentType: 'Full Time', location: 'NYC', workMode: 'Hybrid', priority: 'High',
                        deadline: '2026-09-30', status: 'open' },
                    { id: 2, department: 'Sales', position: 'Sales Executive', vacancies: 3,
                        hiringManager: 'Michael Torres', recruiter: 'Priya Sharma', experience: '2+ years',
                        qualification: 'Any Graduate', skills: 'Communication,CRM', salaryRange: '40000-60000',
                        employmentType: 'Full Time', location: 'LA', workMode: 'Onsite', priority: 'Medium',
                        deadline: '2026-08-30', status: 'interviewing' },
                ],
                candidates: [
                    { id: 1, name: 'John Miller', mobile: '+1 234 567 999', email: 'john@email.com',
                        location: 'NYC', qualification: 'M.Tech', experience: '6 years', currentCompany: 'TechCorp',
                        currentSalary: 90000, expectedSalary: 110000, noticePeriod: '30 days',
                        skills: 'React,TS,Node', source: 'LinkedIn', recruiter: 'Priya Sharma',
                        status: 'interviewed', score: 85 },
                    { id: 2, name: 'Anna Kowalski', mobile: '+1 345 678 999', email: 'anna@email.com',
                        location: 'LA', qualification: 'MBA', experience: '4 years', currentCompany: 'SalesPro',
                        currentSalary: 55000, expectedSalary: 65000, noticePeriod: '15 days',
                        skills: 'Sales,CRM,LeadGen', source: 'Referral', recruiter: 'Priya Sharma',
                        status: 'shortlisted', score: 78 },
                ],
                interviews: [
                    { id: 1, candidateId: 1, position: 'Senior React Developer', round: 'Technical Round 1',
                        interviewer: 'Admin User', date: '2026-08-10', time: '10:00 AM', mode: 'Video',
                        technicalScore: 8, communicationScore: 7, domainScore: 9, problemSolvingScore: 8,
                        culturalFit: 7, overallScore: 7.8, recommendation: 'Proceed', status: 'completed' },
                ],
                onboarding: [
                    { id: 1, candidateId: 1, joiningDate: '2026-09-01', joiningLocation: 'NYC',
                        reportingManager: 'Admin User', employeeId: 8, documents: 'Pending', kyc: 'Pending',
                        bankDetails: 'Pending', emailCreated: false, erpAccount: false, laptopAssigned: false,
                        idCard: false, accessCard: false, trainingAssigned: false, orientation: false,
                        policyAcceptance: false, ndaSigned: false, bgv: false, completion: 15,
                    status: 'in-progress' },
                ],
                kpiTemplates: [
                    { id: 1, role: 'telecaller', name: 'Calls Per Day', target: 100, weightage: 25 },
                    { id: 2, role: 'telecaller', name: 'Conversion Rate', target: 20, weightage: 30 },
                    { id: 3, role: 'telecaller', name: 'Lead Qualification', target: 30, weightage: 20 },
                    { id: 4, role: 'telecaller', name: 'Call Quality', target: 90, weightage: 15 },
                    { id: 5, role: 'telecaller', name: 'Attendance', target: 95, weightage: 10 },
                    { id: 6, role: 'socialmedia', name: 'Content Posts', target: 20, weightage: 20 },
                    { id: 7, role: 'socialmedia', name: 'Engagement Rate', target: 5, weightage: 30 },
                    { id: 8, role: 'socialmedia', name: 'Follower Growth', target: 10, weightage: 20 },
                    { id: 9, role: 'socialmedia', name: 'Leads Generated', target: 5, weightage: 20 },
                    { id: 10, role: 'socialmedia', name: 'Brand Compliance', target: 95, weightage: 10 },
                    { id: 11, role: 'marketing', name: 'Leads Generated', target: 50, weightage: 25 },
                    { id: 12, role: 'marketing', name: 'Campaign ROI', target: 200, weightage: 30 },
                    { id: 13, role: 'marketing', name: 'Website Traffic', target: 10000, weightage: 20 },
                    { id: 14, role: 'marketing', name: 'Cost per Lead', target: 50, weightage: 15 },
                    { id: 15, role: 'marketing', name: 'Conversion Rate', target: 5, weightage: 10 },
                    { id: 16, role: 'developer', name: 'Sprint Velocity', target: 40, weightage: 20 },
                    { id: 17, role: 'developer', name: 'Code Quality', target: 85, weightage: 25 },
                    { id: 18, role: 'developer', name: 'Bug Resolution', target: 90, weightage: 20 },
                    { id: 19, role: 'developer', name: 'Documentation', target: 80, weightage: 15 },
                    { id: 20, role: 'developer', name: 'Team Collaboration', target: 85, weightage: 20 },
                    { id: 21, role: 'admin', name: 'Task Completion', target: 95, weightage: 30 },
                    { id: 22, role: 'admin', name: 'Vendor SLA', target: 90, weightage: 20 },
                    { id: 23, role: 'admin', name: 'Expense Control', target: 100, weightage: 20 },
                    { id: 24, role: 'admin', name: 'Asset Accuracy', target: 98, weightage: 15 },
                    { id: 25, role: 'admin', name: 'Compliance Score', target: 95, weightage: 15 },
                    { id: 26, role: 'hr', name: 'Time to Hire', target: 30, weightage: 20 },
                    { id: 27, role: 'hr', name: 'Offer Acceptance', target: 80, weightage: 20 },
                    { id: 28, role: 'hr', name: 'Employee Retention', target: 90, weightage: 25 },
                    { id: 29, role: 'hr', name: 'Training Completion', target: 85, weightage: 20 },
                    { id: 30, role: 'hr', name: 'Compliance', target: 98, weightage: 15 },
                ],
                performances: [
                    { id: 1, employeeId: 1, reviewer: 'Admin', date: '2026-07-15', rating: 4.5,
                        comments: 'Excellent technical skills and teamwork.', kpiScore: 88, overallScore: 4.5 },
                    { id: 2, employeeId: 2, reviewer: 'Admin', date: '2026-07-10', rating: 4.0,
                        comments: 'Strong sales performance, leadership.', kpiScore: 82, overallScore: 4.0 },
                    { id: 3, employeeId: 3, reviewer: 'HR Manager', date: '2026-06-28', rating: 3.5,
                        comments: 'Good creativity, needs more data-driven approach.', kpiScore: 75,
                    overallScore: 3.5 },
                    { id: 4, employeeId: 6, reviewer: 'Michael Torres', date: '2026-07-20', rating: 4.2,
                        comments: 'Excellent telecalling skills, high conversion.', kpiScore: 86,
                    overallScore: 4.2 },
                    { id: 5, employeeId: 7, reviewer: 'Sarah Kim', date: '2026-07-18', rating: 4.0,
                        comments: 'Great content creation, engagement improving.', kpiScore: 80,
                    overallScore: 4.0 },
                ],
                incentives: [
                    { id: 1, employeeId: 6, department: 'Sales', plan: 'Telecaller Incentive', kpi: 'Conversion',
                        target: 20, achievement: 26, achievementPct: 130, slab: 'A', rate: 500, amount: 6500,
                        status: 'approved', paymentStatus: 'paid', paymentDate: '2026-08-05' },
                    { id: 2, employeeId: 7, department: 'Marketing', plan: 'Social Media Bonus', kpi: 'Engagement',
                        target: 5, achievement: 6.5, achievementPct: 130, slab: 'A', rate: 300, amount: 3900,
                        status: 'pending', paymentStatus: 'unpaid', paymentDate: '' },
                ],
                grievances: [
                    { id: 1, employeeId: 3, category: 'Workplace', description: 'Need better lighting in cabin area.',
                        date: '2026-07-25', priority: 'Medium', assignedHR: 'Priya Sharma',
                    status: 'in-progress' },
                ],
                exitManagement: [
                    { id: 1, employeeId: 7, resignationDate: '2026-07-28', reason: 'Better opportunity',
                        lastWorkingDate: '2026-08-28', noticePeriod: 30, status: 'pending', managerApproval: false,
                        hrApproval: false, clearance: false, finalSettlement: false },
                ],
                assets: [
                    { id: 1, employeeId: 1, assetType: 'Laptop', assetName: 'MacBook Pro M2', serialNumber: 'MP12345',
                        assetTag: 'AST-001', purchaseDate: '2023-06-01', cost: 2400, warranty: '2025-06-01',
                        assignedDate: '2023-06-01', condition: 'Good', location: 'NYC Office',
                    status: 'assigned' },
                    { id: 2, employeeId: 2, assetType: 'Phone', assetName: 'iPhone 14', serialNumber: 'IP67890',
                        assetTag: 'AST-002', purchaseDate: '2023-11-15', cost: 999, warranty: '2024-11-15',
                        assignedDate: '2023-11-15', condition: 'Excellent', location: 'LA Office',
                    status: 'assigned' },
                ],
                expenses: [
                    { id: 1, employeeId: 3, category: 'Travel', expenseDate: '2026-07-20', amount: 450, gst: 45,
                        purpose: 'Client meeting', project: 'Q3 Marketing', costCenter: 'MKT-001',
                        paymentMode: 'Company Card', status: 'approved', submittedDate: '2026-07-21',
                        approvedBy: 'Admin' },
                ],
                announcements: [
                    { id: 1, title: 'Q3 All-Hands Meeting', category: 'Company',
                        message: 'Please join the Q3 all-hands meeting on Aug 15.',
                        priority: 'High', publishDate: '2026-08-01', expiryDate: '2026-08-16', readCount: 42,
                        acknowledgementRequired: true, acknowledgedEmployees: [] },
                ],
                trainings: [
                    { id: 1, employeeId: 1, skill: 'Kubernetes', trainingName: 'K8s Advanced',
                        provider: 'Pluralsight',
                        startDate: '2026-07-01', endDate: '2026-07-30', hours: 20, cost: 500, status: 'completed',
                        score: 92, certificate: 'K8S-2026-001' },
                    { id: 2, employeeId: 6, skill: 'Sales Techniques', trainingName: 'Advanced Telecalling',
                        provider: 'Sales Academy', startDate: '2026-08-01', endDate: '2026-08-15', hours: 15,
                        cost: 300,
                        status: 'in-progress', score: 0, certificate: '' },
                ],
                promotions: [
                    { id: 1, employeeId: 5, currentRole: 'HR Coordinator', currentGrade: 'L3',
                        proposedRole: 'HR Business Partner', proposedGrade: 'L4', performanceScore: 4.2,
                        skills: 'Recruitment,Employee Relations', experience: '3 years', certifications: 'SHRM-CP',
                        leadershipScore: 4.0, readiness: 'Ready', managerRecommendation: 'Highly Recommended',
                        hrRecommendation: 'Approved', status: 'approved', effectiveDate: '2026-09-01' },
                ],
                pips: [
                    { id: 1, employeeId: 3, manager: 'Admin', startDate: '2026-07-15', endDate: '2026-09-15',
                        performanceIssue: 'Missed campaign targets 2 consecutive months',
                        rootCause: 'Lack of data-driven approach',
                        improvementTarget: 'Increase conversion by 15%',
                        supportProvided: 'Mentoring, Data analytics training', weeklyReview: 'Weekly',
                        progressPct: 40,
                        status: 'in-progress' },
                ],
                helpdeskTickets: [
                    { id: 1, employeeId: 2, category: 'Payroll', subject: 'Salary discrepancy',
                        description: 'My August salary seems lower than expected.', priority: 'High',
                        assignedHR: 'Priya Sharma', status: 'in-progress', sla: '24 hours', resolution: '',
                        employeeRating: 0 },
                ],
                nextId: {
                    employee: 8,
                    user: 8,
                    shift: 3,
                    leaveType: 7,
                    leave: 3,
                    attendance: 8,
                    requisition: 3,
                    candidate: 3,
                    interview: 2,
                    onboarding: 2,
                    kpiTemplate: 31,
                    performance: 6,
                    incentive: 3,
                    grievance: 2,
                    exitManagement: 2,
                    asset: 3,
                    expense: 2,
                    announcement: 2,
                    training: 3,
                    promotion: 2,
                    pip: 2,
                    helpdeskTicket: 2
                }
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
            } catch (_) { return defaultDB(); }
        }

        function saveDB() { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

        let db = loadDB();
        let currentUser = db.users.find(u => u.role === 'admin');
        let currentPage = 'dashboard';

        // ─── HELPERS ──────────────────────────────────────────────────────

        function genId(collection) {
            const key = collection + 'Id';
            if (!db.nextId) db.nextId = {};
            if (!db.nextId[key]) db.nextId[key] = 1;
            return db.nextId[key]++;
        }

        function getEmployee(id) { return db.employees.find(e => e.id === id); }

        function getEmployeeName(id) { const e = getEmployee(id); return e ? e.name : 'Unknown'; }

        function formatDate(d) {
            if (!d) return '—';
            const dt = new Date(d);
            if (isNaN(dt)) return '—';
            return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        function todayStr() { return new Date().toISOString().slice(0, 10); }

        function toast(msg, type = 'info') {
            const container = document.getElementById('toastContainer');
            const icons = { info: 'fa-circle-info', success: 'fa-check-circle', error: 'fa-exclamation-circle',
                warning: 'fa-triangle-exclamation' };
            const el = document.createElement('div');
            el.className = `toast ${type}`;
            el.innerHTML =
                `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span><button class="toast-close"><i class="fas fa-xmark"></i></button>`;
            el.querySelector('.toast-close').addEventListener('click', () => el.remove());
            container.appendChild(el);
            setTimeout(() => { if (el.parentNode) el.remove(); }, 5000);
        }

        function showModal(html) {
            document.getElementById('modalContent').innerHTML = html;
            document.getElementById('modalOverlay').classList.add('open');
            const firstInput = document.querySelector('#modalContent input, #modalContent select, #modalContent textarea');
            if (firstInput) setTimeout(() => firstInput.focus(), 100);
        }

        function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }
        document.getElementById('modalOverlay').addEventListener('click', (e) => { if (e.target === e.currentTarget)
                closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

        // ─── SIDEBAR ──────────────────────────────────────────────────────

        const NAV_SECTIONS = [
            { group: 'Command Center', items: [
                    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
                    { id: 'ai', label: 'AI Command Center', icon: 'fa-robot' },
                ] },
            { group: 'Employee', items: [
                    { id: 'employees', label: 'Employee Master', icon: 'fa-users' },
                    { id: 'employee360', label: 'Employee 360°', icon: 'fa-user-circle' },
                    { id: 'documents', label: 'Documents', icon: 'fa-file-alt' },
                    { id: 'assets', label: 'Asset Assignment', icon: 'fa-laptop' },
                    { id: 'expenses', label: 'Employee Expenses', icon: 'fa-receipt' },
                ] },
            { group: 'Time & Attendance', items: [
                    { id: 'attendance', label: 'Attendance', icon: 'fa-calendar-check' },
                    { id: 'shifts', label: 'Shift Management', icon: 'fa-clock' },
                    { id: 'leaves', label: 'Leave Management', icon: 'fa-umbrella-beach' },
                ] },
            { group: 'Recruitment', items: [
                    { id: 'requisitions', label: 'Job Requisitions', icon: 'fa-briefcase' },
                    { id: 'candidates', label: 'Candidate Master', icon: 'fa-user-plus' },
                    { id: 'interviews', label: 'Interview Management', icon: 'fa-comments' },
                    { id: 'onboarding', label: 'Onboarding', icon: 'fa-rocket' },
                ] },
            { group: 'Performance', items: [
                    { id: 'kpi', label: 'KPI / Performance', icon: 'fa-chart-line' },
                    { id: 'appraisal', label: 'Appraisal', icon: 'fa-arrow-trend-up' },
                    { id: 'incentives', label: 'Incentive Management', icon: 'fa-coins' },
                    { id: 'promotions', label: 'Promotion & Career', icon: 'fa-arrow-up' },
                    { id: 'pip', label: 'PIP', icon: 'fa-triangle-exclamation' },
                ] },
            { group: 'HR Operations', items: [
                    { id: 'grievances', label: 'Grievance', icon: 'fa-scale-balanced' },
                    { id: 'exit', label: 'Exit Management', icon: 'fa-sign-out-alt' },
                    { id: 'helpdesk', label: 'HR Help Desk', icon: 'fa-headset' },
                    { id: 'announcements', label: 'Announcements', icon: 'fa-bullhorn' },
                ] },
            { group: 'Learning', items: [
                    { id: 'trainings', label: 'Training & Development', icon: 'fa-graduation-cap' },
                ] },
            { group: 'Reports', items: [
                    { id: 'reports', label: 'Report Engine', icon: 'fa-file-pdf' },
                ] },
        ];

        function renderSidebar() {
            const nav = document.getElementById('sidebarNav');
            let html = '';
            for (const sec of NAV_SECTIONS) {
                html += `<div class="nav-section">${sec.group}</div>`;
                for (const item of sec.items) {
                    const active = item.id === currentPage ? 'active' : '';
                    const count = getCount(item.id);
                    const badge = count > 0 ? `<span class="badge">${count}</span>` : '';
                    html +=
                        `<div class="nav-item ${active}" data-page="${item.id}"><i class="fas ${item.icon}"></i> ${item.label} ${badge}</div>`;
                }
            }
            nav.innerHTML = html;
            nav.querySelectorAll('.nav-item').forEach(el => {
                el.addEventListener('click', () => {
                    const id = el.dataset.page;
                    if (id) navigateTo(id);
                });
            });
            if (currentUser) {
                document.getElementById('sidebarAvatar').textContent = currentUser.avatar || currentUser.name[0];
                document.getElementById('sidebarName').textContent = currentUser.name;
                const roleMap = { admin: 'Administrator', hr: 'HR Manager', employee: 'Employee' };
                document.getElementById('sidebarRole').textContent = roleMap[currentUser.role] || 'Employee';
            }
            document.getElementById('logoutBtn').addEventListener('click', () => {
                toast('Admin session active.', 'info');
            });
        }

        function getCount(pageId) {
            const counts = {
                employees: db.employees?.length || 0,
                attendance: db.attendance?.length || 0,
                leaves: db.leaves?.filter(l => l.status === 'pending').length || 0,
                candidates: db.candidates?.length || 0,
                grievances: db.grievances?.filter(g => g.status === 'open' || g.status === 'in-progress').length || 0,
                helpdesk: db.helpdeskTickets?.filter(t => t.status === 'open' || t.status === 'in-progress').length || 0,
                requisitions: db.requisitions?.filter(r => r.status === 'open' || r.status === 'interviewing').length ||
                    0,
                performances: db.performances?.length || 0,
            };
            return counts[pageId] || 0;
        }

        // ─── NAVIGATION ──────────────────────────────────────────────────

        function navigateTo(page) {
            currentPage = page;
            renderSidebar();
            const titles = {
                dashboard: 'HR Dashboard',
                ai: 'AI Command Center',
                employees: 'Employee Master',
                employee360: 'Employee 360°',
                documents: 'Document Management',
                assets: 'Asset Assignment',
                expenses: 'Employee Expenses',
                attendance: 'Attendance Management',
                shifts: 'Shift Management',
                leaves: 'Leave Management',
                requisitions: 'Job Requisitions',
                candidates: 'Candidate Master',
                interviews: 'Interview Management',
                onboarding: 'Onboarding',
                kpi: 'KPI & Performance',
                appraisal: 'Appraisal',
                incentives: 'Incentive Management',
                promotions: 'Promotion & Career',
                pip: 'Performance Improvement Plan',
                grievances: 'Employee Grievance',
                exit: 'Exit Management',
                helpdesk: 'HR Help Desk',
                announcements: 'Announcements',
                trainings: 'Training & Development',
                reports: 'Report Engine'
            };
            document.getElementById('pageTitle').innerHTML =
                `${titles[page] || page.charAt(0).toUpperCase()+page.slice(1)} <small>${page === 'dashboard' ? 'overview' : 'management'}</small>`;

            const container = document.getElementById('pageContent');
            switch (page) {
                case 'dashboard':
                    renderDashboard(container);
                    break;
                case 'ai':
                    renderAI(container);
                    break;
                case 'employees':
                    renderEmployees(container);
                    break;
                case 'employee360':
                    renderEmployee360(container);
                    break;
                case 'documents':
                    renderDocuments(container);
                    break;
                case 'assets':
                    renderAssets(container);
                    break;
                case 'expenses':
                    renderExpenses(container);
                    break;
                case 'attendance':
                    renderAttendance(container);
                    break;
                case 'shifts':
                    renderShifts(container);
                    break;
                case 'leaves':
                    renderLeaves(container);
                    break;
                case 'requisitions':
                    renderRequisitions(container);
                    break;
                case 'candidates':
                    renderCandidates(container);
                    break;
                case 'interviews':
                    renderInterviews(container);
                    break;
                case 'onboarding':
                    renderOnboarding(container);
                    break;
                case 'kpi':
                    renderKPI(container);
                    break;
                case 'appraisal':
                    renderAppraisal(container);
                    break;
                case 'incentives':
                    renderIncentives(container);
                    break;
                case 'promotions':
                    renderPromotions(container);
                    break;
                case 'pip':
                    renderPIP(container);
                    break;
                case 'grievances':
                    renderGrievances(container);
                    break;
                case 'exit':
                    renderExit(container);
                    break;
                case 'helpdesk':
                    renderHelpdesk(container);
                    break;
                case 'announcements':
                    renderAnnouncements(container);
                    break;
                case 'trainings':
                    renderTrainings(container);
                    break;
                case 'reports':
                    renderReports(container);
                    break;
                default:
                    container.innerHTML = '<div class="empty-state"><i class="fas fa-compass"></i><h4>Page not found</h4></div>';
            }
        }

        // ─── DASHBOARD ────────────────────────────────────────────────────

        let chartInstances = {};

        function destroyCharts() {
            for (const key in chartInstances) {
                if (chartInstances[key]) {
                    chartInstances[key].destroy();
                    delete chartInstances[key];
                }
            }
        }

        function renderDashboard(container) {
            destroyCharts();
            const total = db.employees.length;
            const active = db.employees.filter(e => e.status === 'active').length;
            const pending = db.employees.filter(e => e.status === 'pending').length;
            const today = todayStr();
            const present = db.attendance.filter(a => a.date === today && a.status === 'present').length;
            const absent = db.attendance.filter(a => a.date === today && a.status === 'absent').length;
            const onLeave = db.attendance.filter(a => a.date === today && a.status === 'leave').length;
            const pendingLeaves = db.leaves.filter(l => l.status === 'pending').length;
            const openReqs = db.requisitions.filter(r => r.status === 'open' || r.status === 'interviewing').length;
            const openGrievances = db.grievances.filter(g => g.status === 'open' || g.status === 'in-progress').length;
            const totalPayroll = db.employees.reduce((sum, e) => sum + (e.netSalary || 0), 0);

            container.innerHTML = `
            <div class="stats-grid">
              <div class="stat-card"><div class="label"><i class="fas fa-users" style="color:var(--primary)"></i> Total Employees</div><div class="value">${total}</div><span class="change up">${active} active</span></div>
              <div class="stat-card"><div class="label"><i class="fas fa-calendar-check" style="color:var(--success)"></i> Today Present</div><div class="value">${present}</div><span class="change ${present > 0 ? 'up' : 'neutral'}">${absent} absent, ${onLeave} leave</span></div>
              <div class="stat-card"><div class="label"><i class="fas fa-umbrella-beach" style="color:var(--warning)"></i> Pending Leaves</div><div class="value">${pendingLeaves}</div><span class="change ${pendingLeaves > 0 ? 'down' : 'up'}">${pendingLeaves > 0 ? 'Needs approval' : 'All clear'}</span></div>
              <div class="stat-card"><div class="label"><i class="fas fa-briefcase" style="color:var(--secondary)"></i> Open Positions</div><div class="value">${openReqs}</div><span class="change up">${db.requisitions.filter(r=>r.status==='interviewing').length} interviewing</span></div>
              <div class="stat-card"><div class="label"><i class="fas fa-coins" style="color:var(--success)"></i> Monthly Payroll</div><div class="value">$${(totalPayroll/1000).toFixed(1)}K</div><span class="change up">${db.employees.length} employees</span></div>
              <div class="stat-card"><div class="label"><i class="fas fa-scale-balanced" style="color:var(--danger)"></i> Open Grievances</div><div class="value">${openGrievances}</div><span class="change ${openGrievances > 0 ? 'down' : 'up'}">${openGrievances > 0 ? 'Requires attention' : 'No issues'}</span></div>
            </div>

            <div class="chart-grid">
              <div class="chart-box"><h4><i class="fas fa-building"></i> Department Distribution</h4><canvas id="deptChart"></canvas></div>
              <div class="chart-box"><h4><i class="fas fa-calendar-day"></i> Attendance Today</h4><canvas id="attChart"></canvas></div>
            </div>

            <div class="ai-insight">
              <i class="fas fa-robot"></i>
              <div class="content">
                <div class="title">🤖 AI HR Insight</div>
                <div class="message" id="aiInsightMsg">Analyzing workforce data...</div>
              </div>
              <span class="badge-ai">Live</span>
            </div>

            <div class="section-header"><h2><i class="fas fa-clock"></i> Recent Activity</h2></div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Action</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    ${db.attendance.slice(-6).reverse().map(a => {
                      const emp = getEmployee(a.employeeId);
                      return `<tr><td><div class="cell-flex"><span class="avatar-sm ${a.status === 'present' ? 'green' : a.status === 'leave' ? 'orange' : 'red'}">${emp ? emp.name[0] : '?'}</span> ${emp ? emp.name : 'Unknown'}</div></td><td>${a.status === 'present' ? 'Checked in' : a.status === 'leave' ? 'On leave' : 'Absent'}</td><td>${formatDate(a.date)}</td><td><span class="status-badge ${a.status}">${a.status}</span></td></tr>`;
                    }).join('') || '<tr><td colspan="4" class="text-muted text-center">No recent activity</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;

            const insights = [];
            const pLeaves = db.leaves.filter(l => l.status === 'pending').length;
            if (pLeaves > 0) insights.push(`${pLeaves} leave requests pending approval.`);
            const lowPerf = db.performances.filter(p => p.rating < 3).length;
            if (lowPerf > 0) insights.push(`${lowPerf} employees have low performance ratings (<3).`);
            const nearExpiry = db.employees.filter(e => {
                if (!e.probationEnd) return false;
                const diff = (new Date(e.probationEnd) - new Date()) / (1000 * 60 * 60 * 24);
                return diff > 0 && diff < 30;
            });
            if (nearExpiry.length > 0) insights.push(`${nearExpiry.length} employees' probation ends in <30 days.`);
            const highPerf = db.performances.filter(p => p.rating >= 4.5).length;
            if (highPerf > 0) insights.push(`${highPerf} employees are high performers (≥4.5).`);
            if (insights.length === 0) insights.push('All metrics are stable. No critical alerts.');
            document.getElementById('aiInsightMsg').textContent = '🔍 ' + insights.join(' ');

            setTimeout(() => {
                const deptCtx = document.getElementById('deptChart');
                const attCtx = document.getElementById('attChart');
                if (deptCtx) {
                    const depts = {};
                    db.employees.forEach(e => { depts[e.department] = (depts[e.department] || 0) + 1; });
                    chartInstances.dept = new Chart(deptCtx, {
                        type: 'doughnut',
                        data: { labels: Object.keys(depts), datasets: [{ data: Object.values(depts),
                                backgroundColor: ['#10b981', '#0ea5e9', '#22c55e', '#eab308', '#ef4444',
                                    '#8b5cf6', '#f97316'
                                ] }] },
                        options: { responsive: true, maintainAspectRatio: true,
                            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } }
                    });
                }
                if (attCtx) {
                    const records = db.attendance.filter(a => a.date === today);
                    const statuses = { present: 0, absent: 0, leave: 0 };
                    records.forEach(a => { if (statuses[a.status] !== undefined) statuses[a.status]++; });
                    chartInstances.att = new Chart(attCtx, {
                        type: 'bar',
                        data: { labels: ['Present', 'Absent', 'Leave'], datasets: [{ data: [statuses.present,
                                statuses.absent, statuses.leave
                            ], backgroundColor: ['#22c55e', '#ef4444', '#eab308'] }] },
                        options: { responsive: true, maintainAspectRatio: true,
                            plugins: { legend: { display: false } },
                            scales: { y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } } },
                                x: { grid: { display: false } } } }
                    });
                }
            }, 150);
        }

        // ─── AI COMMAND CENTER ──────────────────────────────────────────

        function renderAI(container) {
            const insights = [];
            const telecallers = db.employees.filter(e => e.role === 'telecaller');
            for (const tc of telecallers) {
                const perf = db.performances.find(p => p.employeeId === tc.id);
                if (perf && perf.rating >= 4.0) {
                    insights.push(`📞 ${tc.name} has achieved ${perf.rating}/5 performance rating.`);
                }
                const inc = db.incentives.find(i => i.employeeId === tc.id && i.status === 'approved');
                if (inc && inc.achievementPct > 100) {
                    insights.push(`🏆 ${tc.name} achieved ${inc.achievementPct}% of target, earning $${inc.amount} incentive.`);
                }
            }
            const expiring = db.employees.filter(e => e.probationEnd && new Date(e.probationEnd) > new Date() && new Date(e
                .probationEnd) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
            if (expiring.length > 0) insights.push(`📄 ${expiring.length} employees' probation ends within 30 days.`);
            const highPerf = db.performances.filter(p => p.rating >= 4.5);
            if (highPerf.length > 0) insights.push(`⭐ ${highPerf.length} employees are high performers (≥4.5). Consider promotion.`);
            const today = todayStr();
            const present = db.attendance.filter(a => a.date === today && a.status === 'present').length;
            const total = db.employees.length;
            if (total > 0 && present / total < 0.7) {
                insights.push(`⚠️ Attendance is at ${Math.round(present/total*100)}% today. Below 70% threshold.`);
            }
            if (insights.length === 0) insights.push('✅ All metrics are healthy. No AI alerts.');

            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-robot" style="color:var(--primary)"></i> AI HR Command Center</h2></div>
            <div class="ai-insight" style="margin-bottom:24px;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);">
              <i class="fas fa-brain" style="font-size:32px;color:#34d399;"></i>
              <div class="content">
                <div class="title">🧠 AI Analytics Engine</div>
                <div class="message" style="font-size:14px;font-weight:400;line-height:1.7;">${insights.map(i => '• ' + i).join('<br>')}</div>
              </div>
            </div>

            <div class="section-header"><h2><i class="fas fa-chart-simple"></i> Predictive Insights</h2></div>
            <div class="stats-grid">
              <div class="stat-card"><div class="label"><i class="fas fa-user-graduate"></i> Promotion Ready</div><div class="value">${db.performances.filter(p=>p.rating>=4.2).length}</div><span class="change up">${total > 0 ? Math.round(db.performances.filter(p=>p.rating>=4.2).length/total*100) : 0}% of workforce</span></div>
              <div class="stat-card"><div class="label"><i class="fas fa-triangle-exclamation"></i> Attrition Risk</div><div class="value">${db.employees.filter(e=>e.status==='pending').length + db.grievances.filter(g=>g.status==='open').length}</div><span class="change down">Needs attention</span></div>
              <div class="stat-card"><div class="label"><i class="fas fa-calendar-alt"></i> Probation Ending</div><div class="value">${db.employees.filter(e=>e.probationEnd && new Date(e.probationEnd) > new Date() && new Date(e.probationEnd) < new Date(Date.now()+30*24*60*60*1000)).length}</div><span class="change up">Within 30 days</span></div>
              <div class="stat-card"><div class="label"><i class="fas fa-coins"></i> Incentive Eligible</div><div class="value">${db.incentives.filter(i=>i.status==='approved' && i.paymentStatus==='unpaid').length}</div><span class="change up">$${db.incentives.filter(i=>i.status==='approved' && i.paymentStatus==='unpaid').reduce((s,i)=>s+i.amount,0).toLocaleString()} total</span></div>
            </div>

            <div class="section-header"><h2><i class="fas fa-list"></i> Actionable Recommendations</h2></div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Recommendation</th><th>Category</th><th>Priority</th><th>Action</th></tr></thead>
                  <tbody>
                    ${db.performances.filter(p=>p.rating>=4.5).slice(0,3).map(p => {
                      const emp = getEmployee(p.employeeId);
                      return `<tr><td><strong>${emp ? emp.name : 'Unknown'}</strong> is ready for promotion (Rating: ${p.rating})</td><td>Promotion</td><td><span class="status-badge active">High</span></td><td><button class="btn btn-sm btn-primary" onclick="navigateTo('promotions')">View</button></td></tr>`;
                    }).join('')}
                    ${db.leaves.filter(l=>l.status==='pending').slice(0,2).map(l => {
                      const emp = getEmployee(l.employeeId);
                      return `<tr><td><strong>${emp ? emp.name : 'Unknown'}</strong> has a pending leave request (${l.type}, ${l.totalDays} days)</td><td>Leave</td><td><span class="status-badge pending">Medium</span></td><td><button class="btn btn-sm btn-primary" onclick="navigateTo('leaves')">Approve</button></td></tr>`;
                    }).join('')}
                    ${db.pips.filter(p=>p.status==='in-progress').slice(0,2).map(p => {
                      const emp = getEmployee(p.employeeId);
                      return `<tr><td><strong>${emp ? emp.name : 'Unknown'}</strong> is on PIP (${p.progressPct || 0}% progress)</td><td>PIP</td><td><span class="status-badge pending">High</span></td><td><button class="btn btn-sm btn-primary" onclick="navigateTo('pip')">Review</button></td></tr>`;
                    }).join('')}
                    ${(db.performances.filter(p=>p.rating>=4.5).length + db.leaves.filter(l=>l.status==='pending').length + db.pips.filter(p=>p.status==='in-progress').length) === 0 ? '<tr><td colspan="4" class="text-muted text-center">No outstanding recommendations. Everything is on track.</td></tr>' : ''}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        // ─── EMPLOYEE MASTER ─────────────────────────────────────────────

        function renderEmployees(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header">
              <h2><i class="fas fa-users"></i> Employee Master</h2>
              ${isAdmin ? `<button class="btn btn-primary" onclick="openAddEmployeeFull()"><i class="fas fa-plus"></i> Add Employee</button>` : ''}
            </div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Code</th><th>Name</th><th>Department</th><th>Position</th><th>Designation</th><th>Status</th><th>Joined</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.employees.map(e => `
                      <tr>
                        <td><span class="text-sm fw-600">${e.employeeCode || '—'}</span></td>
                        <td><div class="cell-flex"><span class="avatar-sm ${e.status === 'active' ? 'green' : e.status === 'pending' ? 'orange' : 'red'}">${e.name[0]}</span> ${e.name}</div></td>
                        <td>${e.department}</td>
                        <td>${e.position}</td>
                        <td>${e.designation || e.position}</td>
                        <td><span class="status-badge ${e.status}">${e.status}</span></td>
                        <td>${formatDate(e.joined)}</td>
                        ${isAdmin ? `<td>
                          <button class="btn btn-sm btn-primary" onclick="openEditEmployeeFull(${e.id})"><i class="fas fa-pen"></i></button>
                          <button class="btn btn-sm btn-danger" onclick="deleteEmployeeFull(${e.id})"><i class="fas fa-trash"></i></button>
                          <button class="btn btn-sm btn-success" onclick="viewEmployeeProfile(${e.id})"><i class="fas fa-eye"></i></button>
                        </td>` : ''}
                      </tr>
                    `).join('') || '<tr><td colspan="8" class="text-muted text-center">No employees found.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddEmployeeFull() {
            const deptOpts = ['Engineering', 'Sales', 'Marketing', 'HR', 'Design', 'Finance', 'Operations'].map(d =>
                `<option value="${d}">${d}</option>`).join('');
            const roleOpts = ['developer', 'telecaller', 'socialmedia', 'marketing', 'admin', 'hr', 'sales'].map(r =>
                `<option value="${r}">${r}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-user-plus"></i> Add Employee</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="empFullForm" onsubmit="saveEmployeeFull(event)">
              <div class="form-row">
                <div class="form-group"><label>Full Name <span class="required">*</span></label><input type="text" id="efName" required /></div>
                <div class="form-group"><label>Email <span class="required">*</span></label><input type="email" id="efEmail" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Department <span class="required">*</span></label><select id="efDept">${deptOpts}</select></div>
                <div class="form-group"><label>Position <span class="required">*</span></label><input type="text" id="efPos" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Designation</label><input type="text" id="efDesignation" /></div>
                <div class="form-group"><label>Role</label><select id="efRole">${roleOpts}</select></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Status</label><select id="efStatus"><option value="active">Active</option><option value="pending">Pending</option><option value="inactive">Inactive</option></select></div>
                <div class="form-group"><label>Joining Date</label><input type="date" id="efJoined" value="${todayStr()}" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Mobile</label><input type="text" id="efMobile" /></div>
                <div class="form-group"><label>Date of Birth</label><input type="date" id="efDob" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Gender</label><select id="efGender"><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                <div class="form-group"><label>Blood Group</label><select id="efBlood"><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option></select></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Salary (Annual)</label><input type="number" id="efSalary" value="50000" /></div>
                <div class="form-group"><label>CTC</label><input type="number" id="efCtc" value="65000" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Reporting Manager</label><input type="text" id="efManager" /></div>
                <div class="form-group"><label>Probation (days)</label><input type="number" id="efProbation" value="90" /></div>
              </div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Add Employee</button></div>
            </form>
          `);
        }

        function openEditEmployeeFull(id) {
            const e = getEmployee(id);
            if (!e) return toast('Employee not found', 'error');
            const deptOpts = ['Engineering', 'Sales', 'Marketing', 'HR', 'Design', 'Finance', 'Operations'].map(d =>
                `<option value="${d}" ${e.department===d?'selected':''}>${d}</option>`).join('');
            const roleOpts = ['developer', 'telecaller', 'socialmedia', 'marketing', 'admin', 'hr', 'sales'].map(r =>
                `<option value="${r}" ${e.role===r?'selected':''}>${r}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-user-edit"></i> Edit Employee</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="empFullForm" onsubmit="saveEmployeeFull(event, ${id})">
              <div class="form-row">
                <div class="form-group"><label>Full Name <span class="required">*</span></label><input type="text" id="efName" value="${e.name}" required /></div>
                <div class="form-group"><label>Email <span class="required">*</span></label><input type="email" id="efEmail" value="${e.email}" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Department <span class="required">*</span></label><select id="efDept">${deptOpts}</select></div>
                <div class="form-group"><label>Position <span class="required">*</span></label><input type="text" id="efPos" value="${e.position}" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Designation</label><input type="text" id="efDesignation" value="${e.designation || ''}" /></div>
                <div class="form-group"><label>Role</label><select id="efRole">${roleOpts}</select></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Status</label><select id="efStatus"><option value="active" ${e.status==='active'?'selected':''}>Active</option><option value="pending" ${e.status==='pending'?'selected':''}>Pending</option><option value="inactive" ${e.status==='inactive'?'selected':''}>Inactive</option></select></div>
                <div class="form-group"><label>Joining Date</label><input type="date" id="efJoined" value="${e.joined || todayStr()}" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Mobile</label><input type="text" id="efMobile" value="${e.mobile || ''}" /></div>
                <div class="form-group"><label>Date of Birth</label><input type="date" id="efDob" value="${e.dob || ''}" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Gender</label><select id="efGender"><option value="Male" ${e.gender==='Male'?'selected':''}>Male</option><option value="Female" ${e.gender==='Female'?'selected':''}>Female</option><option value="Other" ${e.gender==='Other'?'selected':''}>Other</option></select></div>
                <div class="form-group"><label>Blood Group</label><select id="efBlood"><option value="A+" ${e.bloodGroup==='A+'?'selected':''}>A+</option><option value="A-" ${e.bloodGroup==='A-'?'selected':''}>A-</option><option value="B+" ${e.bloodGroup==='B+'?'selected':''}>B+</option><option value="B-" ${e.bloodGroup==='B-'?'selected':''}>B-</option><option value="AB+" ${e.bloodGroup==='AB+'?'selected':''}>AB+</option><option value="AB-" ${e.bloodGroup==='AB-'?'selected':''}>AB-</option><option value="O+" ${e.bloodGroup==='O+'?'selected':''}>O+</option><option value="O-" ${e.bloodGroup==='O-'?'selected':''}>O-</option></select></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Salary (Annual)</label><input type="number" id="efSalary" value="${e.salary || 50000}" /></div>
                <div class="form-group"><label>CTC</label><input type="number" id="efCtc" value="${e.ctc || 65000}" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Reporting Manager</label><input type="text" id="efManager" value="${e.reportingManager || ''}" /></div>
                <div class="form-group"><label>Probation (days)</label><input type="number" id="efProbation" value="${e.probation || 90}" /></div>
              </div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Update Employee</button></div>
            </form>
          `);
        }

        function saveEmployeeFull(event, id) {
            event.preventDefault();
            const name = document.getElementById('efName').value.trim();
            const email = document.getElementById('efEmail').value.trim();
            const dept = document.getElementById('efDept').value;
            const pos = document.getElementById('efPos').value.trim();
            const designation = document.getElementById('efDesignation').value.trim() || pos;
            const role = document.getElementById('efRole').value;
            const status = document.getElementById('efStatus').value;
            const joined = document.getElementById('efJoined').value || todayStr();
            const mobile = document.getElementById('efMobile').value.trim();
            const dob = document.getElementById('efDob').value;
            const gender = document.getElementById('efGender').value;
            const bloodGroup = document.getElementById('efBlood').value;
            const salary = parseFloat(document.getElementById('efSalary').value) || 50000;
            const ctc = parseFloat(document.getElementById('efCtc').value) || 65000;
            const reportingManager = document.getElementById('efManager').value.trim() || 'Admin User';
            const probation = parseInt(document.getElementById('efProbation').value) || 90;
            if (!name || !email || !pos) return toast('Name, email and position required.', 'warning');

            const basic = Math.round(salary * 0.4);
            const hra = Math.round(salary * 0.2);
            const conveyance = Math.round(salary * 0.1);
            const special = salary - basic - hra - conveyance;
            const pf = Math.round(salary * 0.05);
            const esic = Math.round(salary * 0.01);
            const tds = Math.round(salary * 0.1);
            const totalDed = pf + esic + 200 + tds;
            const netSalary = salary - totalDed;

            if (id) {
                const idx = db.employees.findIndex(e => e.id === id);
                if (idx === -1) return toast('Employee not found', 'error');
                const old = db.employees[idx];
                db.employees[idx] = { ...old, name, email, department: dept, position: pos, designation, role, status,
                    joined, mobile, dob, gender, bloodGroup, salary, ctc, basic, hra, conveyance, special, pf, esic,
                    tds, totalDeduction: totalDed, netSalary, reportingManager, probation,
                    probationEnd: new Date(new Date(joined).getTime() + probation * 24 * 60 * 60 * 1000).toISOString()
                        .slice(0, 10) };
                const user = db.users.find(u => u.email === old.email);
                if (user) { user.name = name;
                    user.avatar = name[0]; }
                toast('Employee updated!', 'success');
            } else {
                const newEmp = {
                    id: genId('employee'),
                    name,
                    email,
                    department: dept,
                    position: pos,
                    designation,
                    role,
                    status,
                    joined,
                    mobile: mobile || '—',
                    dob: dob || '',
                    gender: gender || 'Male',
                    bloodGroup: bloodGroup || 'O+',
                    salary,
                    ctc,
                    basic,
                    hra,
                    conveyance,
                    special,
                    pf,
                    esic,
                    professionalTax: 200,
                    tds,
                    totalDeduction: totalDed,
                    netSalary,
                    reportingManager,
                    probation,
                    probationEnd: new Date(new Date(joined).getTime() + probation * 24 * 60 * 60 * 1000).toISOString()
                        .slice(0, 10),
                    confirmationDate: '',
                    employeeCode: 'EMP' + String(db.employees.length + 1).padStart(3, '0'),
                    employeeNumber: 'E' + String(db.employees.length + 1).padStart(3, '0'),
                    phone: mobile || '—',
                    personalEmail: email,
                    officialEmail: email,
                    maritalStatus: 'Single',
                    nationality: 'American',
                    address: '',
                    city: '',
                    state: '',
                    country: 'USA',
                    pin: '',
                    father: '',
                    mother: '',
                    spouse: '',
                    emergencyContact: '',
                    emergencyRelation: '',
                    emergencyPhone: '',
                    pan: '',
                    aadhaar: '',
                    uan: '',
                    pfNumber: '',
                    esic: '',
                    bankName: '',
                    accountHolder: name,
                    accountNumber: '',
                    ifsc: '',
                    branch: '',
                    accountType: 'Savings',
                    upi: '',
                    grossEarnings: salary,
                };
                db.employees.push(newEmp);
                db.users.push({ id: genId('user'), name, email, role: 'employee', password: 'emp123', avatar: name[0] });
                toast('Employee added!', 'success');
            }
            saveDB();
            closeModal();
            renderApp();
        }

        function deleteEmployeeFull(id) {
            if (!confirm('Delete this employee and all associated data?')) return;
            const emp = getEmployee(id);
            if (!emp) return toast('Not found', 'error');
            db.employees = db.employees.filter(e => e.id !== id);
            db.users = db.users.filter(u => u.email !== emp.email);
            db.attendance = db.attendance.filter(a => a.employeeId !== id);
            db.leaves = db.leaves.filter(l => l.employeeId !== id);
            db.performances = db.performances.filter(p => p.employeeId !== id);
            db.incentives = db.incentives.filter(i => i.employeeId !== id);
            db.grievances = db.grievances.filter(g => g.employeeId !== id);
            db.assets = db.assets.filter(a => a.employeeId !== id);
            db.expenses = db.expenses.filter(e => e.employeeId !== id);
            db.trainings = db.trainings.filter(t => t.employeeId !== id);
            db.promotions = db.promotions.filter(p => p.employeeId !== id);
            db.pips = db.pips.filter(p => p.employeeId !== id);
            saveDB();
            toast('Employee deleted.', 'info');
            renderApp();
        }

        function viewEmployeeProfile(id) {
            const e = getEmployee(id);
            if (!e) return toast('Not found', 'error');
            const perf = db.performances.filter(p => p.employeeId === id);
            const leaves = db.leaves.filter(l => l.employeeId === id);
            const incentives = db.incentives.filter(i => i.employeeId === id);
            const avgRating = perf.length ? (perf.reduce((s, p) => s + p.rating, 0) / perf.length).toFixed(1) : 'N/A';
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-user-circle"></i> ${e.name} — 360° Profile</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13.5px;">
              <div><strong>Employee Code:</strong> ${e.employeeCode || '—'}</div>
              <div><strong>Department:</strong> ${e.department}</div>
              <div><strong>Position:</strong> ${e.position}</div>
              <div><strong>Designation:</strong> ${e.designation || e.position}</div>
              <div><strong>Status:</strong> <span class="status-badge ${e.status}">${e.status}</span></div>
              <div><strong>Joined:</strong> ${formatDate(e.joined)}</div>
              <div><strong>Salary:</strong> $${e.salary?.toLocaleString() || '—'}</div>
              <div><strong>Net Pay:</strong> $${e.netSalary?.toLocaleString() || '—'}</div>
              <div><strong>Reporting Manager:</strong> ${e.reportingManager || '—'}</div>
              <div><strong>Probation End:</strong> ${formatDate(e.probationEnd)}</div>
              <div><strong>Avg Performance:</strong> ⭐ ${avgRating}</div>
              <div><strong>Leaves Taken:</strong> ${leaves.reduce((s,l)=>s+l.totalDays,0)} days</div>
              <div><strong>Incentives Earned:</strong> $${incentives.reduce((s,i)=>s+(i.status==='approved'?i.amount:0),0).toLocaleString()}</div>
              <div><strong>Email:</strong> ${e.email}</div>
              <div><strong>Mobile:</strong> ${e.mobile || '—'}</div>
            </div>
            <div class="form-actions"><button class="btn" onclick="closeModal()">Close</button></div>
          `);
        }

        // ─── EMPLOYEE 360° ─────────────────────────────────────────────

        function renderEmployee360(container) {
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-user-circle"></i> Employee 360° View</h2></div>
            <div class="filter-bar">
              <div class="filter-group"><label>Employee</label><select id="f360Emp" onchange="load360View()"><option value="">Select Employee</option>${db.employees.map(e => `<option value="${e.id}">${e.name} (${e.department})</option>`).join('')}</select></div>
              <div class="filter-actions"><button class="btn btn-primary" onclick="load360View()"><i class="fas fa-eye"></i> View</button></div>
            </div>
            <div id="360Content" class="text-muted text-center" style="padding:40px;">Select an employee to view their 360° profile.</div>
          `;
        }

        function load360View() {
            const id = parseInt(document.getElementById('f360Emp').value);
            if (!id) { document.getElementById('360Content').innerHTML =
                    '<div class="text-muted text-center" style="padding:40px;">Select an employee to view their 360° profile.</div>'; return; }
            const e = getEmployee(id);
            if (!e) return toast('Not found', 'error');
            const perf = db.performances.filter(p => p.employeeId === id);
            const leaves = db.leaves.filter(l => l.employeeId === id);
            const incentives = db.incentives.filter(i => i.employeeId === id);
            const trainings = db.trainings.filter(t => t.employeeId === id);
            const assets = db.assets.filter(a => a.employeeId === id);
            const avgRating = perf.length ? (perf.reduce((s, p) => s + p.rating, 0) / perf.length).toFixed(1) : 'N/A';
            const kpiScore = db.performances.find(p => p.employeeId === id)?.kpiScore || 'N/A';

            document.getElementById('360Content').innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
              <div class="stat-card"><div class="label">Avg Performance</div><div class="value">⭐ ${avgRating}</div></div>
              <div class="stat-card"><div class="label">KPI Score</div><div class="value">${kpiScore}</div></div>
              <div class="stat-card"><div class="label">Incentives</div><div class="value">$${incentives.reduce((s,i)=>s+(i.status==='approved'?i.amount:0),0).toLocaleString()}</div></div>
            </div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Category</th><th>Details</th><th>Status</th></tr></thead>
                  <tbody>
                    <tr><td><strong>Performance Reviews</strong></td><td>${perf.length} reviews, avg ${avgRating}</td><td>${perf.length > 0 ? '<span class="status-badge active">Completed</span>' : '<span class="status-badge pending">Pending</span>'}</td></tr>
                    <tr><td><strong>Leaves</strong></td><td>${leaves.reduce((s,l)=>s+l.totalDays,0)} days taken, ${leaves.filter(l=>l.status==='pending').length} pending</td><td>${leaves.length > 0 ? '<span class="status-badge active">Recorded</span>' : '<span class="status-badge inactive">None</span>'}</td></tr>
                    <tr><td><strong>Trainings</strong></td><td>${trainings.length} trainings, ${trainings.filter(t=>t.status==='completed').length} completed</td><td>${trainings.filter(t=>t.status==='in-progress').length > 0 ? '<span class="status-badge pending">In Progress</span>' : '<span class="status-badge active">Completed</span>'}</td></tr>
                    <tr><td><strong>Assets</strong></td><td>${assets.length} assigned</td><td>${assets.length > 0 ? '<span class="status-badge active">Assigned</span>' : '<span class="status-badge inactive">None</span>'}</td></tr>
                    <tr><td><strong>Incentives</strong></td><td>${incentives.filter(i=>i.status==='approved').length} approved, $${incentives.reduce((s,i)=>s+(i.status==='approved'?i.amount:0),0).toLocaleString()}</td><td>${incentives.some(i=>i.status==='pending') ? '<span class="status-badge pending">Pending</span>' : '<span class="status-badge active">Settled</span>'}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        // ─── DOCUMENTS ──────────────────────────────────────────────────

        function renderDocuments(container) {
            const docTypes = [
                { id: 'resume', label: 'Resume', icon: 'fa-file-pdf', color: 'blue' },
                { id: 'offer', label: 'Offer Letter', icon: 'fa-file-signature', color: 'green' },
                { id: 'appointment', label: 'Appointment Letter', icon: 'fa-user-tie', color: 'purple' },
                { id: 'aadhaar', label: 'Aadhaar', icon: 'fa-id-card', color: 'orange' },
                { id: 'pan', label: 'PAN Card', icon: 'fa-credit-card', color: 'red' },
                { id: 'bank', label: 'Bank Proof', icon: 'fa-building-columns', color: 'blue' },
                { id: 'degree', label: 'Education Certificates', icon: 'fa-graduation-cap', color: 'green' },
                { id: 'experience', label: 'Experience Certificate', icon: 'fa-briefcase', color: 'orange' },
                { id: 'relieving', label: 'Relieving Letter', icon: 'fa-handshake', color: 'red' },
                { id: 'nda', label: 'NDA / Agreement', icon: 'fa-file-contract', color: 'purple' },
                { id: 'promotion', label: 'Promotion Letter', icon: 'fa-arrow-up', color: 'green' },
                { id: 'pip', label: 'PIP Letter', icon: 'fa-triangle-exclamation', color: 'red' },
            ];
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-file-alt"></i> Document Management</h2></div>
            <div class="doc-grid">
              ${docTypes.map(d => `
                <div class="doc-card" onclick="openDocumentUpload('${d.id}')">
                  <i class="fas ${d.icon}"></i>
                  <h4>${d.label}</h4>
                  <p>Upload / manage</p>
                  <span class="badge-doc ${d.color}">HR</span>
                </div>
              `).join('')}
            </div>
            <div class="text-muted text-sm" style="margin-top:16px;"><i class="fas fa-info-circle"></i> Click any document type to upload or manage.</div>
          `;
        }

        function openDocumentUpload(type) {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-upload"></i> Upload ${type.replace(/-/g,' ')}</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="docUploadForm" onsubmit="saveDocumentUpload(event, '${type}')">
              <div class="form-group"><label>Employee</label><select id="docEmp">${empOpts}</select></div>
              <div class="form-group"><label>Document Number</label><input type="text" id="docNumber" /></div>
              <div class="form-row">
                <div class="form-group"><label>Issue Date</label><input type="date" id="docIssue" /></div>
                <div class="form-group"><label>Expiry Date</label><input type="date" id="docExpiry" /></div>
              </div>
              <div class="form-group"><label>Remarks</label><textarea id="docRemarks" rows="2"></textarea></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Upload</button></div>
            </form>
          `);
        }

        function saveDocumentUpload(event, type) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('docEmp').value);
            const number = document.getElementById('docNumber').value.trim();
            const issue = document.getElementById('docIssue').value;
            const expiry = document.getElementById('docExpiry').value;
            const remarks = document.getElementById('docRemarks').value.trim();
            toast(`Document "${type}" uploaded for ${getEmployeeName(empId)}.`, 'success');
            closeModal();
        }

        // ─── ASSETS ─────────────────────────────────────────────────────

        function renderAssets(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-laptop"></i> Asset Assignment</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddAsset()"><i class="fas fa-plus"></i> Assign Asset</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Asset Type</th><th>Asset Name</th><th>Serial</th><th>Condition</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.assets.map(a => {
                      const emp = getEmployee(a.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${a.assetType}</td>
                        <td>${a.assetName}</td>
                        <td><span class="text-sm">${a.serialNumber}</span></td>
                        <td><span class="status-badge ${a.condition === 'Good' || a.condition === 'Excellent' ? 'active' : 'pending'}">${a.condition}</span></td>
                        <td><span class="status-badge ${a.status === 'assigned' ? 'active' : 'inactive'}">${a.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-danger" onclick="deleteAsset(${a.id})"><i class="fas fa-trash"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="7" class="text-muted text-center">No assets assigned.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddAsset() {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-laptop"></i> Assign Asset</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="assetForm" onsubmit="saveAsset(event)">
              <div class="form-group"><label>Employee</label><select id="assetEmp">${empOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Asset Type</label><input type="text" id="assetType" placeholder="Laptop, Phone, etc." required /></div>
                <div class="form-group"><label>Asset Name</label><input type="text" id="assetName" placeholder="MacBook Pro M2" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Serial Number</label><input type="text" id="assetSerial" required /></div>
                <div class="form-group"><label>Asset Tag</label><input type="text" id="assetTag" placeholder="AST-001" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Purchase Date</label><input type="date" id="assetPurchase" /></div>
                <div class="form-group"><label>Cost ($)</label><input type="number" id="assetCost" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Condition</label><select id="assetCondition"><option value="Good">Good</option><option value="Excellent">Excellent</option><option value="Fair">Fair</option><option value="Poor">Poor</option></select></div>
                <div class="form-group"><label>Location</label><input type="text" id="assetLocation" placeholder="Office/Remote" /></div>
              </div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Assign Asset</button></div>
            </form>
          `);
        }

        function saveAsset(event) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('assetEmp').value);
            const assetType = document.getElementById('assetType').value.trim();
            const assetName = document.getElementById('assetName').value.trim();
            const serial = document.getElementById('assetSerial').value.trim();
            const tag = document.getElementById('assetTag').value.trim();
            const purchase = document.getElementById('assetPurchase').value;
            const cost = parseFloat(document.getElementById('assetCost').value) || 0;
            const condition = document.getElementById('assetCondition').value;
            const location = document.getElementById('assetLocation').value.trim();
            if (!assetType || !assetName || !serial) return toast('Please fill required fields.', 'warning');
            db.assets.push({
                id: genId('asset'),
                employeeId: empId,
                assetType,
                assetName,
                serialNumber: serial,
                assetTag: tag || 'AST-' + String(db.assets.length + 1).padStart(3, '0'),
                purchaseDate: purchase || todayStr(),
                cost,
                warranty: '',
                assignedDate: todayStr(),
                condition,
                location: location || 'Office',
                status: 'assigned'
            });
            saveDB();
            toast('Asset assigned!', 'success');
            closeModal();
            renderApp();
        }

        function deleteAsset(id) {
            if (!confirm('Remove this asset assignment?')) return;
            db.assets = db.assets.filter(a => a.id !== id);
            saveDB();
            toast('Asset removed.', 'info');
            renderApp();
        }

        // ─── EXPENSES ───────────────────────────────────────────────────

        function renderExpenses(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-receipt"></i> Employee Expenses</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddExpense()"><i class="fas fa-plus"></i> Add Expense</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Category</th><th>Amount</th><th>Purpose</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.expenses.map(x => {
                      const emp = getEmployee(x.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${x.category}</td>
                        <td><strong>$${x.amount.toLocaleString()}</strong></td>
                        <td class="text-sm">${x.purpose}</td>
                        <td><span class="status-badge ${x.status}">${x.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-danger" onclick="deleteExpense(${x.id})"><i class="fas fa-trash"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="6" class="text-muted text-center">No expenses recorded.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddExpense() {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
            const catOpts = ['Travel', 'Meals', 'Stationery', 'Communication', 'Transport', 'Other'].map(c =>
                `<option value="${c}">${c}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-receipt"></i> Add Expense</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="expenseForm" onsubmit="saveExpense(event)">
              <div class="form-group"><label>Employee</label><select id="expEmp">${empOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Category</label><select id="expCat">${catOpts}</select></div>
                <div class="form-group"><label>Date</label><input type="date" id="expDate" value="${todayStr()}" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Amount ($)</label><input type="number" id="expAmount" required /></div>
                <div class="form-group"><label>GST ($)</label><input type="number" id="expGst" value="0" /></div>
              </div>
              <div class="form-group"><label>Purpose</label><input type="text" id="expPurpose" required /></div>
              <div class="form-group"><label>Project / Cost Center</label><input type="text" id="expProject" /></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Submit</button></div>
            </form>
          `);
        }

        function saveExpense(event) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('expEmp').value);
            const category = document.getElementById('expCat').value;
            const date = document.getElementById('expDate').value;
            const amount = parseFloat(document.getElementById('expAmount').value) || 0;
            const gst = parseFloat(document.getElementById('expGst').value) || 0;
            const purpose = document.getElementById('expPurpose').value.trim();
            const project = document.getElementById('expProject').value.trim();
            if (!amount || !purpose) return toast('Amount and purpose required.', 'warning');
            db.expenses.push({
                id: genId('expense'),
                employeeId: empId,
                category,
                expenseDate: date || todayStr(),
                amount,
                gst,
                purpose,
                project: project || 'General',
                costCenter: '',
                paymentMode: 'Self',
                status: 'pending',
                submittedDate: todayStr(),
                approvedBy: ''
            });
            saveDB();
            toast('Expense submitted!', 'success');
            closeModal();
            renderApp();
        }

        function deleteExpense(id) {
            if (!confirm('Delete this expense?')) return;
            db.expenses = db.expenses.filter(x => x.id !== id);
            saveDB();
            toast('Expense deleted.', 'info');
            renderApp();
        }

        // ─── ATTENDANCE ─────────────────────────────────────────────────

        function renderAttendance(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            const today = todayStr();
            const records = db.attendance.filter(a => a.date === today);
            const empStatus = db.employees.map(e => {
                const r = records.find(a => a.employeeId === e.id);
                return { ...e, attStatus: r ? r.status : '—' };
            });
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-calendar-check"></i> Attendance · ${formatDate(today)}</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openMarkAttendanceFull()"><i class="fas fa-pen"></i> Mark Attendance</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Department</th><th>Check In</th><th>Check Out</th><th>Total Hours</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${empStatus.map(e => {
                      const r = records.find(a => a.employeeId === e.id);
                      return `<tr>
                        <td><div class="cell-flex"><span class="avatar-sm ${e.attStatus === 'present' ? 'green' : e.attStatus === 'leave' ? 'orange' : e.attStatus === '—' ? 'gray' : 'red'}">${e.name[0]}</span> ${e.name}</div></td>
                        <td>${e.department}</td>
                        <td>${r?.checkIn || '—'}</td>
                        <td>${r?.checkOut || '—'}</td>
                        <td>${r?.totalHours ? r.totalHours.toFixed(2) : '—'}</td>
                        <td><span class="status-badge ${e.attStatus === 'present' ? 'active' : e.attStatus === 'leave' ? 'pending' : e.attStatus === '—' ? 'inactive' : 'inactive'}">${e.attStatus}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-primary" onclick="openMarkAttendanceForEmp(${e.id})"><i class="fas fa-pen"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="7" class="text-muted text-center">No employees.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
            <div class="section-header"><h2><i class="fas fa-clock"></i> Recent History</h2></div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Date</th><th>Status</th><th>Hours</th></tr></thead>
                  <tbody>
                    ${db.attendance.slice(-10).reverse().map(a => {
                      const emp = getEmployee(a.employeeId);
                      return `<tr><td>${emp ? emp.name : 'Unknown'}</td><td>${formatDate(a.date)}</td><td><span class="status-badge ${a.status}">${a.status}</span></td><td>${a.totalHours ? a.totalHours.toFixed(2) : '—'}</td></tr>`;
                    }).join('') || '<tr><td colspan="4" class="text-muted text-center">No records.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openMarkAttendanceFull() {
            const today = todayStr();
            const empOpts = db.employees.map(e => {
                const existing = db.attendance.find(a => a.employeeId === e.id && a.date === today);
                return `<option value="${e.id}" ${existing ? 'disabled' : ''}>${e.name} ${existing ? '(already marked)' : ''}</option>`;
            }).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-pen"></i> Mark Attendance</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="attFullForm" onsubmit="saveAttendanceFull(event)">
              <div class="form-group"><label>Employee</label><select id="attEmp">${empOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Check In</label><input type="time" id="attIn" value="09:00" /></div>
                <div class="form-group"><label>Check Out</label><input type="time" id="attOut" value="18:00" /></div>
              </div>
              <div class="form-group"><label>Status</label><select id="attStatus"><option value="present">Present</option><option value="absent">Absent</option><option value="leave">On Leave</option></select></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
            </form>
          `);
        }

        function openMarkAttendanceForEmp(empId) {
            const today = todayStr();
            const emp = getEmployee(empId);
            if (!emp) return toast('Not found', 'error');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-pen"></i> Mark Attendance for ${emp.name}</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="attFullForm" onsubmit="saveAttendanceFull(event, ${empId})">
              <div class="form-row">
                <div class="form-group"><label>Check In</label><input type="time" id="attIn" value="09:00" /></div>
                <div class="form-group"><label>Check Out</label><input type="time" id="attOut" value="18:00" /></div>
              </div>
              <div class="form-group"><label>Status</label><select id="attStatus"><option value="present">Present</option><option value="absent">Absent</option><option value="leave">On Leave</option></select></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
            </form>
          `);
        }

        function saveAttendanceFull(event, empId) {
            event.preventDefault();
            const eid = empId || parseInt(document.getElementById('attEmp').value);
            const checkIn = document.getElementById('attIn').value;
            const checkOut = document.getElementById('attOut').value;
            const status = document.getElementById('attStatus').value;
            const today = todayStr();
            const existing = db.attendance.find(a => a.employeeId === eid && a.date === today);
            const totalHours = checkIn && checkOut ? (new Date(`1970-01-01T${checkOut}`) - new Date(`1970-01-01T${checkIn}`)) /
                (1000 * 60 * 60) : 0;
            if (existing) {
                existing.checkIn = checkIn;
                existing.checkOut = checkOut;
                existing.totalHours = totalHours;
                existing.status = status;
                toast('Attendance updated!', 'success');
            } else {
                db.attendance.push({
                    id: genId('attendance'),
                    employeeId: eid,
                    date: today,
                    checkIn: checkIn || '09:00',
                    checkOut: checkOut || '18:00',
                    totalHours: totalHours || 9,
                    status: status || 'present',
                    lateMinutes: 0,
                    overtimeHours: 0,
                    shift: 'Morning'
                });
                toast('Attendance recorded!', 'success');
            }
            saveDB();
            closeModal();
            renderApp();
        }

        // ─── SHIFTS ─────────────────────────────────────────────────────

        function renderShifts(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-clock"></i> Shift Management</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddShift()"><i class="fas fa-plus"></i> Add Shift</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Shift Name</th><th>Start</th><th>End</th><th>Break</th><th>Grace</th><th>Night</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.shifts.map(s => `
                      <tr>
                        <td><strong>${s.name}</strong></td>
                        <td>${s.startTime}</td>
                        <td>${s.endTime}</td>
                        <td>${s.breakDuration}m</td>
                        <td>${s.gracePeriod}m</td>
                        <td>${s.nightShift ? '✅' : '—'}</td>
                        <td><span class="status-badge ${s.status}">${s.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-danger" onclick="deleteShift(${s.id})"><i class="fas fa-trash"></i></button></td>` : ''}
                      </tr>
                    `).join('') || '<tr><td colspan="8" class="text-muted text-center">No shifts defined.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddShift() {
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-clock"></i> Add Shift</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="shiftForm" onsubmit="saveShift(event)">
              <div class="form-group"><label>Shift Name</label><input type="text" id="shiftName" required /></div>
              <div class="form-row">
                <div class="form-group"><label>Start Time</label><input type="time" id="shiftStart" value="09:00" /></div>
                <div class="form-group"><label>End Time</label><input type="time" id="shiftEnd" value="18:00" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Break Duration (min)</label><input type="number" id="shiftBreak" value="60" /></div>
                <div class="form-group"><label>Grace Period (min)</label><input type="number" id="shiftGrace" value="15" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Weekly Off</label><select id="shiftOff"><option value="Sunday">Sunday</option><option value="Monday">Monday</option><option value="Tuesday">Tuesday</option><option value="Wednesday">Wednesday</option><option value="Thursday">Thursday</option><option value="Friday">Friday</option><option value="Saturday">Saturday</option></select></div>
                <div class="form-group"><label>Night Shift</label><select id="shiftNight"><option value="false">No</option><option value="true">Yes</option></select></div>
              </div>
              <div class="form-group"><label>Shift Allowance ($)</label><input type="number" id="shiftAllowance" value="0" /></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Add Shift</button></div>
            </form>
          `);
        }

        function saveShift(event) {
            event.preventDefault();
            const name = document.getElementById('shiftName').value.trim();
            const start = document.getElementById('shiftStart').value;
            const end = document.getElementById('shiftEnd').value;
            const brk = parseInt(document.getElementById('shiftBreak').value) || 60;
            const grace = parseInt(document.getElementById('shiftGrace').value) || 15;
            const off = document.getElementById('shiftOff').value;
            const night = document.getElementById('shiftNight').value === 'true';
            const allowance = parseFloat(document.getElementById('shiftAllowance').value) || 0;
            if (!name || !start || !end) return toast('Please fill all fields.', 'warning');
            db.shifts.push({
                id: genId('shift'),
                name,
                startTime: start,
                endTime: end,
                breakDuration: brk,
                gracePeriod: grace,
                weeklyOff: off,
                nightShift: night,
                shiftAllowance: allowance,
                status: 'active'
            });
            saveDB();
            toast('Shift added!', 'success');
            closeModal();
            renderApp();
        }

        function deleteShift(id) {
            if (!confirm('Delete this shift?')) return;
            db.shifts = db.shifts.filter(s => s.id !== id);
            saveDB();
            toast('Shift deleted.', 'info');
            renderApp();
        }

        // ─── LEAVE MANAGEMENT ──────────────────────────────────────────

        function renderLeaves(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            const allLeaves = db.leaves;
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-umbrella-beach"></i> Leave Management</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddLeave()"><i class="fas fa-plus"></i> Apply Leave</button>` : ''}</div>
            <div class="tabs">
              <button class="tab active" data-filter="all" onclick="filterLeaves(this,'all')">All</button>
              <button class="tab" data-filter="pending" onclick="filterLeaves(this,'pending')">Pending</button>
              <button class="tab" data-filter="approved" onclick="filterLeaves(this,'approved')">Approved</button>
              <button class="tab" data-filter="rejected" onclick="filterLeaves(this,'rejected')">Rejected</button>
            </div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody id="leaveTableBody">
                    ${allLeaves.map(l => {
                      const emp = getEmployee(l.employeeId);
                      return `<tr data-status="${l.status}">
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${l.type}</td>
                        <td>${formatDate(l.startDate)}</td>
                        <td>${formatDate(l.endDate)}</td>
                        <td><strong>${l.totalDays}</strong></td>
                        <td class="text-sm">${l.reason}</td>
                        <td><span class="status-badge ${l.status}">${l.status}</span></td>
                        ${isAdmin ? `<td>
                          ${l.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="approveLeave(${l.id})"><i class="fas fa-check"></i></button>
                          <button class="btn btn-sm btn-danger" onclick="rejectLeave(${l.id})"><i class="fas fa-times"></i></button>` : ''}
                          <button class="btn btn-sm btn-danger" onclick="deleteLeave(${l.id})"><i class="fas fa-trash"></i></button>
                        </td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="8" class="text-muted text-center">No leave records.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function filterLeaves(btn, filter) {
            document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('#leaveTableBody tr').forEach(row => {
                const status = row.dataset.status;
                row.style.display = (filter === 'all' || status === filter) ? '' : 'none';
            });
        }

        function openAddLeave() {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
            const typeOpts = db.leaveTypes.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-umbrella-beach"></i> Apply Leave</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="leaveForm" onsubmit="saveLeave(event)">
              <div class="form-group"><label>Employee</label><select id="leaveEmp">${empOpts}</select></div>
              <div class="form-group"><label>Leave Type</label><select id="leaveType">${typeOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Start Date</label><input type="date" id="leaveStart" required /></div>
                <div class="form-group"><label>End Date</label><input type="date" id="leaveEnd" required /></div>
              </div>
              <div class="form-group"><label>Reason</label><textarea id="leaveReason" rows="2"></textarea></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Apply</button></div>
            </form>
          `);
        }

        function saveLeave(event) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('leaveEmp').value);
            const type = document.getElementById('leaveType').value;
            const start = document.getElementById('leaveStart').value;
            const end = document.getElementById('leaveEnd').value;
            const reason = document.getElementById('leaveReason').value.trim();
            if (!start || !end) return toast('Select dates.', 'warning');
            const days = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
            db.leaves.push({
                id: genId('leave'),
                employeeId: empId,
                type,
                startDate: start,
                endDate: end,
                totalDays: days,
                reason: reason || '—',
                status: 'pending',
                appliedDate: todayStr(),
                approvedBy: ''
            });
            saveDB();
            toast('Leave applied!', 'success');
            closeModal();
            renderApp();
        }

        function approveLeave(id) {
            const l = db.leaves.find(leave => leave.id === id);
            if (!l) return toast('Not found', 'error');
            l.status = 'approved';
            l.approvedBy = currentUser.name;
            saveDB();
            toast('Leave approved!', 'success');
            renderApp();
        }

        function rejectLeave(id) {
            const l = db.leaves.find(leave => leave.id === id);
            if (!l) return toast('Not found', 'error');
            l.status = 'rejected';
            saveDB();
            toast('Leave rejected.', 'info');
            renderApp();
        }

        function deleteLeave(id) {
            if (!confirm('Delete this leave record?')) return;
            db.leaves = db.leaves.filter(l => l.id !== id);
            saveDB();
            toast('Leave deleted.', 'info');
            renderApp();
        }

        // ─── REQUISITIONS ──────────────────────────────────────────────

        function renderRequisitions(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-briefcase"></i> Job Requisitions</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddRequisition()"><i class="fas fa-plus"></i> New Requisition</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Position</th><th>Department</th><th>Vacancies</th><th>Hiring Manager</th><th>Priority</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.requisitions.map(r => `
                      <tr>
                        <td><strong>${r.position}</strong></td>
                        <td>${r.department}</td>
                        <td>${r.vacancies}</td>
                        <td>${r.hiringManager}</td>
                        <td><span class="status-badge ${r.priority === 'High' ? 'active' : r.priority === 'Medium' ? 'pending' : 'inactive'}">${r.priority}</span></td>
                        <td><span class="status-badge ${r.status}">${r.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-primary" onclick="openEditRequisition(${r.id})"><i class="fas fa-pen"></i></button><button class="btn btn-sm btn-danger" onclick="deleteRequisition(${r.id})"><i class="fas fa-trash"></i></button></td>` : ''}
                      </tr>
                    `).join('') || '<tr><td colspan="7" class="text-muted text-center">No requisitions.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddRequisition() {
            const deptOpts = ['Engineering', 'Sales', 'Marketing', 'HR', 'Design', 'Finance', 'Operations'].map(d =>
                `<option value="${d}">${d}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-briefcase"></i> New Requisition</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="reqForm" onsubmit="saveRequisition(event)">
              <div class="form-row">
                <div class="form-group"><label>Position <span class="required">*</span></label><input type="text" id="reqPos" required /></div>
                <div class="form-group"><label>Department</label><select id="reqDept">${deptOpts}</select></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Vacancies</label><input type="number" id="reqVac" value="1" /></div>
                <div class="form-group"><label>Hiring Manager</label><input type="text" id="reqManager" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Experience</label><input type="text" id="reqExp" placeholder="3+ years" /></div>
                <div class="form-group"><label>Qualification</label><input type="text" id="reqQual" placeholder="B.Tech" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Salary Range</label><input type="text" id="reqSalary" placeholder="50000-80000" /></div>
                <div class="form-group"><label>Priority</label><select id="reqPriority"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Employment Type</label><select id="reqEmpType"><option value="Full Time">Full Time</option><option value="Part Time">Part Time</option><option value="Contract">Contract</option><option value="Intern">Intern</option></select></div>
                <div class="form-group"><label>Work Mode</label><select id="reqWorkMode"><option value="Onsite">Onsite</option><option value="Remote">Remote</option><option value="Hybrid">Hybrid</option></select></div>
              </div>
              <div class="form-group"><label>Skills</label><input type="text" id="reqSkills" placeholder="React, TypeScript, Node.js" /></div>
              <div class="form-group"><label>Deadline</label><input type="date" id="reqDeadline" /></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Create</button></div>
            </form>
          `);
        }

        function openEditRequisition(id) {
            const r = db.requisitions.find(item => item.id === id);
            if (!r) return toast('Not found', 'error');
            const deptOpts = ['Engineering', 'Sales', 'Marketing', 'HR', 'Design', 'Finance', 'Operations'].map(d =>
                `<option value="${d}" ${r.department===d?'selected':''}>${d}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-edit"></i> Edit Requisition</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="reqForm" onsubmit="saveRequisition(event, ${id})">
              <div class="form-row">
                <div class="form-group"><label>Position <span class="required">*</span></label><input type="text" id="reqPos" value="${r.position}" required /></div>
                <div class="form-group"><label>Department</label><select id="reqDept">${deptOpts}</select></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Vacancies</label><input type="number" id="reqVac" value="${r.vacancies}" /></div>
                <div class="form-group"><label>Hiring Manager</label><input type="text" id="reqManager" value="${r.hiringManager}" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Experience</label><input type="text" id="reqExp" value="${r.experience}" /></div>
                <div class="form-group"><label>Qualification</label><input type="text" id="reqQual" value="${r.qualification}" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Salary Range</label><input type="text" id="reqSalary" value="${r.salaryRange}" /></div>
                <div class="form-group"><label>Priority</label><select id="reqPriority"><option value="Low" ${r.priority==='Low'?'selected':''}>Low</option><option value="Medium" ${r.priority==='Medium'?'selected':''}>Medium</option><option value="High" ${r.priority==='High'?'selected':''}>High</option></select></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Employment Type</label><select id="reqEmpType"><option value="Full Time" ${r.employmentType==='Full Time'?'selected':''}>Full Time</option><option value="Part Time" ${r.employmentType==='Part Time'?'selected':''}>Part Time</option><option value="Contract" ${r.employmentType==='Contract'?'selected':''}>Contract</option><option value="Intern" ${r.employmentType==='Intern'?'selected':''}>Intern</option></select></div>
                <div class="form-group"><label>Work Mode</label><select id="reqWorkMode"><option value="Onsite" ${r.workMode==='Onsite'?'selected':''}>Onsite</option><option value="Remote" ${r.workMode==='Remote'?'selected':''}>Remote</option><option value="Hybrid" ${r.workMode==='Hybrid'?'selected':''}>Hybrid</option></select></div>
              </div>
              <div class="form-group"><label>Skills</label><input type="text" id="reqSkills" value="${r.skills}" /></div>
              <div class="form-group"><label>Status</label><select id="reqStatus"><option value="open" ${r.status==='open'?'selected':''}>Open</option><option value="interviewing" ${r.status==='interviewing'?'selected':''}>Interviewing</option><option value="closed" ${r.status==='closed'?'selected':''}>Closed</option></select></div>
              <div class="form-group"><label>Deadline</label><input type="date" id="reqDeadline" value="${r.deadline}" /></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Update</button></div>
            </form>
          `);
        }

        function saveRequisition(event, id) {
            event.preventDefault();
            const position = document.getElementById('reqPos').value.trim();
            const department = document.getElementById('reqDept').value;
            const vacancies = parseInt(document.getElementById('reqVac').value) || 1;
            const hiringManager = document.getElementById('reqManager').value.trim() || 'Admin';
            const experience = document.getElementById('reqExp').value.trim();
            const qualification = document.getElementById('reqQual').value.trim();
            const salaryRange = document.getElementById('reqSalary').value.trim();
            const priority = document.getElementById('reqPriority').value;
            const empType = document.getElementById('reqEmpType').value;
            const workMode = document.getElementById('reqWorkMode').value;
            const skills = document.getElementById('reqSkills').value.trim();
            const deadline = document.getElementById('reqDeadline').value;
            const status = document.getElementById('reqStatus')?.value || 'open';
            if (!position) return toast('Position required.', 'warning');

            if (id) {
                const idx = db.requisitions.findIndex(r => r.id === id);
                if (idx === -1) return toast('Not found', 'error');
                db.requisitions[idx] = { ...db.requisitions[idx], position, department, vacancies, hiringManager,
                    experience, qualification, salaryRange, priority, employmentType: empType, workMode, skills,
                    deadline, status };
                toast('Requisition updated!', 'success');
            } else {
                db.requisitions.push({
                    id: genId('requisition'),
                    department,
                    position,
                    vacancies,
                    hiringManager: hiringManager || 'Admin',
                    recruiter: 'HR',
                    experience: experience || '—',
                    qualification: qualification || '—',
                    skills: skills || '—',
                    salaryRange: salaryRange || '—',
                    employmentType: empType,
                    location: '—',
                    workMode,
                    priority,
                    deadline: deadline || '',
                    status: 'open'
                });
                toast('Requisition created!', 'success');
            }
            saveDB();
            closeModal();
            renderApp();
        }

        function deleteRequisition(id) {
            if (!confirm('Delete this requisition?')) return;
            db.requisitions = db.requisitions.filter(r => r.id !== id);
            saveDB();
            toast('Requisition deleted.', 'info');
            renderApp();
        }

        // ─── CANDIDATES ─────────────────────────────────────────────────

        function renderCandidates(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-user-plus"></i> Candidate Master</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddCandidate()"><i class="fas fa-plus"></i> Add Candidate</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Name</th><th>Position</th><th>Experience</th><th>Current Company</th><th>Status</th><th>Score</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.candidates.map(c => `
                      <tr>
                        <td><strong>${c.name}</strong></td>
                        <td>${c.position || '—'}</td>
                        <td>${c.experience}</td>
                        <td>${c.currentCompany}</td>
                        <td><span class="status-badge ${c.status === 'shortlisted' ? 'active' : c.status === 'interviewed' ? 'review' : c.status === 'offered' ? 'approved' : 'pending'}">${c.status}</span></td>
                        <td>${c.score || '—'}</td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-primary" onclick="openEditCandidate(${c.id})"><i class="fas fa-pen"></i></button><button class="btn btn-sm btn-danger" onclick="deleteCandidate(${c.id})"><i class="fas fa-trash"></i></button></td>` : ''}
                      </tr>
                    `).join('') || '<tr><td colspan="7" class="text-muted text-center">No candidates.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddCandidate() {
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-user-plus"></i> Add Candidate</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="candForm" onsubmit="saveCandidate(event)">
              <div class="form-row">
                <div class="form-group"><label>Full Name <span class="required">*</span></label><input type="text" id="candName" required /></div>
                <div class="form-group"><label>Email</label><input type="email" id="candEmail" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Mobile</label><input type="text" id="candMobile" /></div>
                <div class="form-group"><label>Location</label><input type="text" id="candLocation" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Experience</label><input type="text" id="candExp" placeholder="3+ years" /></div>
                <div class="form-group"><label>Current Company</label><input type="text" id="candCompany" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Current Salary</label><input type="number" id="candCurrSalary" /></div>
                <div class="form-group"><label>Expected Salary</label><input type="number" id="candExpSalary" /></div>
              </div>
              <div class="form-group"><label>Skills</label><input type="text" id="candSkills" placeholder="React, Node, etc." /></div>
              <div class="form-row">
                <div class="form-group"><label>Status</label><select id="candStatus"><option value="new">New</option><option value="shortlisted">Shortlisted</option><option value="interviewed">Interviewed</option><option value="rejected">Rejected</option><option value="offered">Offered</option></select></div>
                <div class="form-group"><label>Score</label><input type="number" id="candScore" min="0" max="100" /></div>
              </div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Add Candidate</button></div>
            </form>
          `);
        }

        function openEditCandidate(id) {
            const c = db.candidates.find(item => item.id === id);
            if (!c) return toast('Not found', 'error');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-edit"></i> Edit Candidate</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="candForm" onsubmit="saveCandidate(event, ${id})">
              <div class="form-row">
                <div class="form-group"><label>Full Name <span class="required">*</span></label><input type="text" id="candName" value="${c.name}" required /></div>
                <div class="form-group"><label>Email</label><input type="email" id="candEmail" value="${c.email}" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Mobile</label><input type="text" id="candMobile" value="${c.mobile}" /></div>
                <div class="form-group"><label>Location</label><input type="text" id="candLocation" value="${c.location}" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Experience</label><input type="text" id="candExp" value="${c.experience}" /></div>
                <div class="form-group"><label>Current Company</label><input type="text" id="candCompany" value="${c.currentCompany}" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Current Salary</label><input type="number" id="candCurrSalary" value="${c.currentSalary}" /></div>
                <div class="form-group"><label>Expected Salary</label><input type="number" id="candExpSalary" value="${c.expectedSalary}" /></div>
              </div>
              <div class="form-group"><label>Skills</label><input type="text" id="candSkills" value="${c.skills}" /></div>
              <div class="form-row">
                <div class="form-group"><label>Status</label><select id="candStatus"><option value="new" ${c.status==='new'?'selected':''}>New</option><option value="shortlisted" ${c.status==='shortlisted'?'selected':''}>Shortlisted</option><option value="interviewed" ${c.status==='interviewed'?'selected':''}>Interviewed</option><option value="rejected" ${c.status==='rejected'?'selected':''}>Rejected</option><option value="offered" ${c.status==='offered'?'selected':''}>Offered</option></select></div>
                <div class="form-group"><label>Score</label><input type="number" id="candScore" value="${c.score}" min="0" max="100" /></div>
              </div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Update</button></div>
            </form>
          `);
        }

        function saveCandidate(event, id) {
            event.preventDefault();
            const name = document.getElementById('candName').value.trim();
            const email = document.getElementById('candEmail').value.trim();
            const mobile = document.getElementById('candMobile').value.trim();
            const location = document.getElementById('candLocation').value.trim();
            const exp = document.getElementById('candExp').value.trim();
            const company = document.getElementById('candCompany').value.trim();
            const currSalary = parseFloat(document.getElementById('candCurrSalary').value) || 0;
            const expSalary = parseFloat(document.getElementById('candExpSalary').value) || 0;
            const skills = document.getElementById('candSkills').value.trim();
            const status = document.getElementById('candStatus').value;
            const score = parseInt(document.getElementById('candScore').value) || 0;
            if (!name) return toast('Name required.', 'warning');

            if (id) {
                const idx = db.candidates.findIndex(c => c.id === id);
                if (idx === -1) return toast('Not found', 'error');
                db.candidates[idx] = { ...db.candidates[idx], name, email, mobile, location, experience: exp,
                    currentCompany: company, currentSalary: currSalary, expectedSalary: expSalary, skills, status,
                    score };
                toast('Candidate updated!', 'success');
            } else {
                db.candidates.push({
                    id: genId('candidate'),
                    name,
                    email: email || '—',
                    mobile: mobile || '—',
                    location: location || '—',
                    qualification: '—',
                    experience: exp || '—',
                    currentCompany: company || '—',
                    currentSalary: currSalary,
                    expectedSalary: expSalary,
                    noticePeriod: '—',
                    skills: skills || '—',
                    source: 'Manual',
                    recruiter: currentUser.name,
                    status: status || 'new',
                    score: score || 0
                });
                toast('Candidate added!', 'success');
            }
            saveDB();
            closeModal();
            renderApp();
        }

        function deleteCandidate(id) {
            if (!confirm('Delete this candidate?')) return;
            db.candidates = db.candidates.filter(c => c.id !== id);
            saveDB();
            toast('Candidate deleted.', 'info');
            renderApp();
        }

        // ─── INTERVIEWS ─────────────────────────────────────────────────

        function renderInterviews(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-comments"></i> Interview Management</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddInterview()"><i class="fas fa-plus"></i> Schedule Interview</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Candidate</th><th>Position</th><th>Round</th><th>Date</th><th>Mode</th><th>Score</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.interviews.map(i => {
                      const cand = db.candidates.find(c => c.id === i.candidateId);
                      return `<tr>
                        <td>${cand ? cand.name : 'Unknown'}</td>
                        <td>${i.position}</td>
                        <td>${i.round}</td>
                        <td>${formatDate(i.date)}</td>
                        <td>${i.mode}</td>
                        <td>${i.overallScore || '—'}</td>
                        <td><span class="status-badge ${i.status === 'completed' ? 'active' : 'scheduled'}">${i.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-danger" onclick="deleteInterview(${i.id})"><i class="fas fa-trash"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="8" class="text-muted text-center">No interviews scheduled.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddInterview() {
            const candOpts = db.candidates.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-comments"></i> Schedule Interview</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="intForm" onsubmit="saveInterview(event)">
              <div class="form-group"><label>Candidate</label><select id="intCand">${candOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Position</label><input type="text" id="intPos" required /></div>
                <div class="form-group"><label>Round</label><input type="text" id="intRound" placeholder="Technical Round 1" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Date</label><input type="date" id="intDate" required /></div>
                <div class="form-group"><label>Time</label><input type="text" id="intTime" placeholder="10:00 AM" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Mode</label><select id="intMode"><option value="Video">Video</option><option value="In-Person">In-Person</option><option value="Phone">Phone</option></select></div>
                <div class="form-group"><label>Interviewer</label><input type="text" id="intInterviewer" /></div>
              </div>
              <div class="form-group"><label>Meeting Link</label><input type="text" id="intLink" placeholder="https://meet.google.com/..." /></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Schedule</button></div>
            </form>
          `);
        }

        function saveInterview(event) {
            event.preventDefault();
            const candId = parseInt(document.getElementById('intCand').value);
            const position = document.getElementById('intPos').value.trim();
            const round = document.getElementById('intRound').value.trim() || 'Initial';
            const date = document.getElementById('intDate').value;
            const time = document.getElementById('intTime').value.trim() || '10:00 AM';
            const mode = document.getElementById('intMode').value;
            const interviewer = document.getElementById('intInterviewer').value.trim() || 'HR';
            const link = document.getElementById('intLink').value.trim();
            if (!position || !date) return toast('Position and date required.', 'warning');
            db.interviews.push({
                id: genId('interview'),
                candidateId: candId,
                position,
                round,
                date,
                time,
                mode,
                interviewer,
                meetingLink: link || '—',
                technicalScore: 0,
                communicationScore: 0,
                domainScore: 0,
                problemSolvingScore: 0,
                culturalFit: 0,
                overallScore: 0,
                recommendation: 'Pending',
                status: 'scheduled'
            });
            saveDB();
            toast('Interview scheduled!', 'success');
            closeModal();
            renderApp();
        }

        function deleteInterview(id) {
            if (!confirm('Delete this interview?')) return;
            db.interviews = db.interviews.filter(i => i.id !== id);
            saveDB();
            toast('Interview deleted.', 'info');
            renderApp();
        }

        // ─── ONBOARDING ─────────────────────────────────────────────────

        function renderOnboarding(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-rocket"></i> Onboarding</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddOnboarding()"><i class="fas fa-plus"></i> Start Onboarding</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Candidate</th><th>Joining Date</th><th>Reporting Manager</th><th>Completion %</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.onboarding.map(o => {
                      const cand = db.candidates.find(c => c.id === o.candidateId);
                      return `<tr>
                        <td>${cand ? cand.name : 'Unknown'}</td>
                        <td>${formatDate(o.joiningDate)}</td>
                        <td>${o.reportingManager}</td>
                        <td><span style="font-weight:600;color:${o.completion >= 100 ? 'var(--success)' : 'var(--warning)'};">${o.completion || 0}%</span></td>
                        <td><span class="status-badge ${o.status === 'completed' ? 'active' : 'in-progress'}">${o.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-primary" onclick="updateOnboarding(${o.id})"><i class="fas fa-pen"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="6" class="text-muted text-center">No onboarding records.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddOnboarding() {
            const candOpts = db.candidates.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-rocket"></i> Start Onboarding</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="onboardForm" onsubmit="saveOnboarding(event)">
              <div class="form-group"><label>Candidate</label><select id="onboardCand">${candOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Joining Date</label><input type="date" id="onboardJoin" value="${todayStr()}" /></div>
                <div class="form-group"><label>Joining Location</label><input type="text" id="onboardLocation" placeholder="NYC Office" /></div>
              </div>
              <div class="form-group"><label>Reporting Manager</label><input type="text" id="onboardManager" /></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Start</button></div>
            </form>
          `);
        }

        function saveOnboarding(event) {
            event.preventDefault();
            const candId = parseInt(document.getElementById('onboardCand').value);
            const joinDate = document.getElementById('onboardJoin').value;
            const location = document.getElementById('onboardLocation').value.trim() || 'Office';
            const manager = document.getElementById('onboardManager').value.trim() || 'Admin';
            if (!candId || !joinDate) return toast('Select candidate and date.', 'warning');
            db.onboarding.push({
                id: genId('onboarding'),
                candidateId: candId,
                joiningDate: joinDate,
                joiningLocation: location,
                reportingManager: manager,
                employeeId: null,
                documents: 'Pending',
                kyc: 'Pending',
                bankDetails: 'Pending',
                emailCreated: false,
                erpAccount: false,
                laptopAssigned: false,
                idCard: false,
                accessCard: false,
                trainingAssigned: false,
                orientation: false,
                policyAcceptance: false,
                ndaSigned: false,
                bgv: false,
                completion: 15,
                status: 'in-progress'
            });
            saveDB();
            toast('Onboarding started!', 'success');
            closeModal();
            renderApp();
        }

        function updateOnboarding(id) {
            const o = db.onboarding.find(item => item.id === id);
            if (!o) return toast('Not found', 'error');
            const tasks = ['documents', 'kyc', 'bankDetails', 'emailCreated', 'erpAccount', 'laptopAssigned', 'idCard',
                'accessCard', 'trainingAssigned', 'orientation', 'policyAcceptance', 'ndaSigned', 'bgv'
            ];
            const statuses = tasks.map(t => {
                const val = o[t];
                if (typeof val === 'boolean') return val ? '✅' : '⬜';
                return val === 'Completed' ? '✅' : '⬜';
            });
            const completed = statuses.filter(s => s === '✅').length;
            const total = tasks.length;
            const pct = Math.round((completed / total) * 100);
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-rocket"></i> Onboarding Progress</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
              ${tasks.map((t, i) => `
                <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--gray-50);border-radius:6px;font-size:12.5px;">
                  <span style="font-size:16px;">${statuses[i]}</span>
                  <span>${t.replace(/([A-Z])/g,' $1').trim()}</span>
                  <button class="btn btn-xs btn-primary" onclick="toggleOnboardingTask(${id},'${t}')">Toggle</button>
                </div>
              `).join('')}
            </div>
            <div style="text-align:center;padding:12px;background:var(--gray-50);border-radius:8px;">
              <strong>Completion: ${pct}%</strong>
              <div style="background:var(--gray-200);border-radius:10px;height:6px;margin-top:6px;overflow:hidden;">
                <div style="width:${pct}%;height:100%;background:var(--primary);border-radius:10px;transition:width 0.4s ease;"></div>
              </div>
            </div>
            <div class="form-actions"><button class="btn btn-primary" onclick="closeModal()">Close</button></div>
          `);
        }

        function toggleOnboardingTask(id, task) {
            const o = db.onboarding.find(item => item.id === id);
            if (!o) return;
            if (typeof o[task] === 'boolean') {
                o[task] = !o[task];
            } else {
                o[task] = o[task] === 'Completed' ? 'Pending' : 'Completed';
            }
            const tasks = ['documents', 'kyc', 'bankDetails', 'emailCreated', 'erpAccount', 'laptopAssigned', 'idCard',
                'accessCard', 'trainingAssigned', 'orientation', 'policyAcceptance', 'ndaSigned', 'bgv'
            ];
            const completed = tasks.filter(t => {
                const val = o[t];
                if (typeof val === 'boolean') return val;
                return val === 'Completed';
            }).length;
            o.completion = Math.round((completed / tasks.length) * 100);
            if (o.completion === 100) o.status = 'completed';
            else o.status = 'in-progress';
            saveDB();
            updateOnboarding(id);
            toast('Task toggled!', 'success');
        }

        // ─── KPI / PERFORMANCE ─────────────────────────────────────────

        function renderKPI(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            const roles = ['developer', 'telecaller', 'socialmedia', 'marketing', 'admin', 'hr', 'sales'];
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-chart-line"></i> KPI & Performance</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddPerformance()"><i class="fas fa-plus"></i> Add Review</button>` : ''}</div>
            <div class="filter-bar">
              <div class="filter-group"><label>Role</label><select id="kpiRoleFilter" onchange="renderKPIView()"><option value="">All Roles</option>${roles.map(r => `<option value="${r}">${r}</option>`).join('')}</select></div>
              <div class="filter-actions"><button class="btn btn-primary" onclick="renderKPIView()"><i class="fas fa-refresh"></i> Refresh</button></div>
            </div>
            <div id="kpiViewContainer">
              ${renderKPIView()}
            </div>
          `;
        }

        function renderKPIView() {
            const roleFilter = document.getElementById('kpiRoleFilter')?.value || '';
            let templates = db.kpiTemplates;
            if (roleFilter) templates = templates.filter(k => k.role === roleFilter);
            const html = `
            <div class="section-header" style="margin-top:0;"><h3 style="font-size:16px;"><i class="fas fa-list"></i> KPI Templates (${templates.length})</h3></div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Role</th><th>KPI Name</th><th>Target</th><th>Weightage</th></tr></thead>
                  <tbody>
                    ${templates.map(k => `
                      <tr><td><span class="status-badge active">${k.role}</span></td><td>${k.name}</td><td>${k.target}</td><td>${k.weightage}%</td></tr>
                    `).join('') || '<tr><td colspan="4" class="text-muted text-center">No KPI templates found.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>

            <div class="section-header"><h3 style="font-size:16px;"><i class="fas fa-star"></i> Performance Reviews (${db.performances.length})</h3></div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Reviewer</th><th>Date</th><th>Rating</th><th>KPI Score</th><th>Comments</th></tr></thead>
                  <tbody>
                    ${db.performances.map(p => {
                      const emp = getEmployee(p.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${p.reviewer}</td>
                        <td>${formatDate(p.date)}</td>
                        <td><span style="color:${p.rating >= 4 ? 'var(--success)' : p.rating >= 3 ? 'var(--warning)' : 'var(--danger)'};font-weight:600;">${p.rating}</span></td>
                        <td>${p.kpiScore || '—'}</td>
                        <td class="text-sm">${p.comments || '—'}</td>
                      </tr>`;
                    }).join('') || '<tr><td colspan="6" class="text-muted text-center">No performance reviews.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
            return html;
        }

        function openAddPerformance() {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name} (${e.role})</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-star"></i> Add Performance Review</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="perfForm" onsubmit="savePerformance(event)">
              <div class="form-group"><label>Employee</label><select id="perfEmp">${empOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Rating (1-5) <span class="required">*</span></label><input type="number" id="perfRating" min="1" max="5" step="0.5" required /></div>
                <div class="form-group"><label>KPI Score</label><input type="number" id="perfKpi" min="0" max="100" /></div>
              </div>
              <div class="form-group"><label>Comments</label><textarea id="perfComments" rows="2"></textarea></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Save Review</button></div>
            </form>
          `);
        }

        function savePerformance(event) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('perfEmp').value);
            const rating = parseFloat(document.getElementById('perfRating').value);
            const kpiScore = parseInt(document.getElementById('perfKpi').value) || 0;
            const comments = document.getElementById('perfComments').value.trim();
            if (!rating || rating < 1 || rating > 5) return toast('Rating must be 1-5.', 'warning');
            db.performances.push({
                id: genId('performance'),
                employeeId: empId,
                reviewer: currentUser.name,
                date: todayStr(),
                rating,
                kpiScore,
                comments: comments || '—',
                overallScore: rating
            });
            saveDB();
            toast('Performance review saved!', 'success');
            closeModal();
            renderApp();
        }

        // ─── APPRAISAL ──────────────────────────────────────────────────

        function renderAppraisal(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-arrow-trend-up"></i> Appraisal</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddAppraisal()"><i class="fas fa-plus"></i> Initiate Appraisal</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Current Salary</th><th>Performance</th><th>Increment %</th><th>New Salary</th><th>Promotion</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.promotions.filter(p => p.status === 'approved' || p.status === 'pending').map(p => {
                      const emp = getEmployee(p.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>$${emp?.salary?.toLocaleString() || '—'}</td>
                        <td>${p.performanceScore || '—'}</td>
                        <td>${p.incrementPct || '—'}</td>
                        <td><strong>$${p.newSalary?.toLocaleString() || '—'}</strong></td>
                        <td>${p.proposedRole || '—'}</td>
                        <td><span class="status-badge ${p.status}">${p.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-success" onclick="approveAppraisal(${p.id})"><i class="fas fa-check"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="8" class="text-muted text-center">No appraisal records.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddAppraisal() {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name} (${e.department})</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-arrow-trend-up"></i> Initiate Appraisal</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="apprForm" onsubmit="saveAppraisal(event)">
              <div class="form-group"><label>Employee</label><select id="apprEmp">${empOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Performance Score <span class="required">*</span></label><input type="number" id="apprPerf" min="1" max="5" step="0.5" required /></div>
                <div class="form-group"><label>Increment %</label><input type="number" id="apprInc" min="0" max="100" value="10" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Promotion Role</label><input type="text" id="apprRole" placeholder="Senior Developer" /></div>
                <div class="form-group"><label>Effective Date</label><input type="date" id="apprDate" value="${new Date(Date.now()+30*24*60*60*1000).toISOString().slice(0,10)}" /></div>
              </div>
              <div class="form-group"><label>Manager Recommendation</label><textarea id="apprComments" rows="2"></textarea></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Initiate</button></div>
            </form>
          `);
        }

        function saveAppraisal(event) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('apprEmp').value);
            const perf = parseFloat(document.getElementById('apprPerf').value);
            const incPct = parseFloat(document.getElementById('apprInc').value) || 0;
            const role = document.getElementById('apprRole').value.trim();
            const date = document.getElementById('apprDate').value;
            const comments = document.getElementById('apprComments').value.trim();
            if (!perf || perf < 1 || perf > 5) return toast('Performance score 1-5.', 'warning');
            const emp = getEmployee(empId);
            if (!emp) return toast('Employee not found', 'error');
            const newSalary = Math.round(emp.salary * (1 + incPct / 100));
            db.promotions.push({
                id: genId('promotion'),
                employeeId: empId,
                currentRole: emp.position,
                currentGrade: emp.jobGrade || 'L3',
                proposedRole: role || emp.position,
                proposedGrade: emp.jobGrade || 'L3',
                performanceScore: perf,
                skills: emp.skills || '—',
                experience: '—',
                certifications: '—',
                leadershipScore: 4.0,
                readiness: 'Ready',
                managerRecommendation: comments || 'Recommended',
                hrRecommendation: 'Pending',
                status: 'pending',
                effectiveDate: date || todayStr(),
                incrementPct: incPct,
                newSalary: newSalary
            });
            saveDB();
            toast('Appraisal initiated!', 'success');
            closeModal();
            renderApp();
        }

        function approveAppraisal(id) {
            const p = db.promotions.find(item => item.id === id);
            if (!p) return toast('Not found', 'error');
            p.status = 'approved';
            p.hrRecommendation = 'Approved';
            const emp = getEmployee(p.employeeId);
            if (emp) {
                emp.salary = p.newSalary;
                emp.position = p.proposedRole || emp.position;
                emp.designation = p.proposedRole || emp.designation;
            }
            saveDB();
            toast('Appraisal approved!', 'success');
            renderApp();
        }

        // ─── INCENTIVES ─────────────────────────────────────────────────

        function renderIncentives(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-coins"></i> Incentive Management</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddIncentive()"><i class="fas fa-plus"></i> Add Incentive</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Plan</th><th>Target</th><th>Achievement</th><th>Achievement %</th><th>Amount</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.incentives.map(i => {
                      const emp = getEmployee(i.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${i.plan}</td>
                        <td>${i.target}</td>
                        <td>${i.achievement}</td>
                        <td><span style="color:${i.achievementPct >= 100 ? 'var(--success)' : 'var(--warning)'};">${i.achievementPct}%</span></td>
                        <td><strong>$${i.amount.toLocaleString()}</strong></td>
                        <td><span class="status-badge ${i.status}">${i.status}</span></td>
                        ${isAdmin ? `<td>
                          ${i.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="approveIncentive(${i.id})"><i class="fas fa-check"></i></button>` : ''}
                          <button class="btn btn-sm btn-danger" onclick="deleteIncentive(${i.id})"><i class="fas fa-trash"></i></button>
                        </td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="8" class="text-muted text-center">No incentives recorded.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddIncentive() {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-coins"></i> Add Incentive</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="incForm" onsubmit="saveIncentive(event)">
              <div class="form-group"><label>Employee</label><select id="incEmp">${empOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Plan</label><input type="text" id="incPlan" placeholder="Telecaller Incentive" required /></div>
                <div class="form-group"><label>KPI</label><input type="text" id="incKpi" placeholder="Conversion" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Target</label><input type="number" id="incTarget" required /></div>
                <div class="form-group"><label>Achievement</label><input type="number" id="incAchieve" required /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Rate ($ per unit)</label><input type="number" id="incRate" required /></div>
                <div class="form-group"><label>Amount ($)</label><input type="number" id="incAmount" required /></div>
              </div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Add Incentive</button></div>
            </form>
          `);
        }

        function saveIncentive(event) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('incEmp').value);
            const plan = document.getElementById('incPlan').value.trim();
            const kpi = document.getElementById('incKpi').value.trim();
            const target = parseFloat(document.getElementById('incTarget').value) || 0;
            const achieve = parseFloat(document.getElementById('incAchieve').value) || 0;
            const rate = parseFloat(document.getElementById('incRate').value) || 0;
            const amount = parseFloat(document.getElementById('incAmount').value) || 0;
            if (!plan || !kpi || target <= 0) return toast('Please fill all fields.', 'warning');
            const pct = target > 0 ? Math.round((achieve / target) * 100) : 0;
            db.incentives.push({
                id: genId('incentive'),
                employeeId: empId,
                department: getEmployee(empId)?.department || '—',
                plan,
                kpi,
                target,
                achievement: achieve,
                achievementPct: pct,
                slab: pct >= 100 ? 'A' : pct >= 75 ? 'B' : 'C',
                rate,
                amount,
                adjustment: 0,
                status: 'pending',
                paymentStatus: 'unpaid',
                paymentDate: ''
            });
            saveDB();
            toast('Incentive added!', 'success');
            closeModal();
            renderApp();
        }

        function approveIncentive(id) {
            const i = db.incentives.find(item => item.id === id);
            if (!i) return toast('Not found', 'error');
            i.status = 'approved';
            i.paymentStatus = 'unpaid';
            saveDB();
            toast('Incentive approved!', 'success');
            renderApp();
        }

        function deleteIncentive(id) {
            if (!confirm('Delete this incentive?')) return;
            db.incentives = db.incentives.filter(i => i.id !== id);
            saveDB();
            toast('Incentive deleted.', 'info');
            renderApp();
        }

        // ─── PROMOTIONS ─────────────────────────────────────────────────

        function renderPromotions(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-arrow-up"></i> Promotion & Career</h2></div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Current Role</th><th>Proposed Role</th><th>Performance</th><th>Readiness</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.promotions.map(p => {
                      const emp = getEmployee(p.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${p.currentRole}</td>
                        <td><strong>${p.proposedRole}</strong></td>
                        <td>${p.performanceScore}</td>
                        <td><span class="status-badge ${p.readiness === 'Ready' ? 'active' : 'pending'}">${p.readiness}</span></td>
                        <td><span class="status-badge ${p.status}">${p.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-success" onclick="approvePromotion(${p.id})"><i class="fas fa-check"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="7" class="text-muted text-center">No promotion records.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function approvePromotion(id) {
            const p = db.promotions.find(item => item.id === id);
            if (!p) return toast('Not found', 'error');
            p.status = 'approved';
            const emp = getEmployee(p.employeeId);
            if (emp) {
                emp.position = p.proposedRole;
                emp.designation = p.proposedRole;
                if (p.newSalary) emp.salary = p.newSalary;
            }
            saveDB();
            toast('Promotion approved!', 'success');
            renderApp();
        }

        // ─── PIP ────────────────────────────────────────────────────────

        function renderPIP(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-triangle-exclamation"></i> Performance Improvement Plan</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddPIP()"><i class="fas fa-plus"></i> Create PIP</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Manager</th><th>Start</th><th>End</th><th>Progress</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.pips.map(p => {
                      const emp = getEmployee(p.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${p.manager}</td>
                        <td>${formatDate(p.startDate)}</td>
                        <td>${formatDate(p.endDate)}</td>
                        <td><span style="font-weight:600;color:${p.progressPct >= 80 ? 'var(--success)' : p.progressPct >= 40 ? 'var(--warning)' : 'var(--danger)'};">${p.progressPct || 0}%</span></td>
                        <td><span class="status-badge ${p.status === 'completed' ? 'active' : 'in-progress'}">${p.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-primary" onclick="updatePIP(${p.id})"><i class="fas fa-plus"></i> Progress</button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="7" class="text-muted text-center">No PIP records.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddPIP() {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-triangle-exclamation"></i> Create PIP</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="pipForm" onsubmit="savePIP(event)">
              <div class="form-group"><label>Employee</label><select id="pipEmp">${empOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Manager</label><input type="text" id="pipManager" /></div>
                <div class="form-group"><label>Start Date</label><input type="date" id="pipStart" value="${todayStr()}" /></div>
              </div>
              <div class="form-group"><label>End Date</label><input type="date" id="pipEnd" value="${new Date(Date.now()+60*24*60*60*1000).toISOString().slice(0,10)}" /></div>
              <div class="form-group"><label>Performance Issue</label><textarea id="pipIssue" rows="2"></textarea></div>
              <div class="form-group"><label>Root Cause</label><input type="text" id="pipRoot" /></div>
              <div class="form-group"><label>Improvement Target</label><input type="text" id="pipTarget" /></div>
              <div class="form-group"><label>Support Provided</label><input type="text" id="pipSupport" /></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Create PIP</button></div>
            </form>
          `);
        }

        function savePIP(event) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('pipEmp').value);
            const manager = document.getElementById('pipManager').value.trim() || 'Admin';
            const start = document.getElementById('pipStart').value;
            const end = document.getElementById('pipEnd').value;
            const issue = document.getElementById('pipIssue').value.trim();
            const root = document.getElementById('pipRoot').value.trim();
            const target = document.getElementById('pipTarget').value.trim();
            const support = document.getElementById('pipSupport').value.trim();
            if (!start || !end) return toast('Dates required.', 'warning');
            db.pips.push({
                id: genId('pip'),
                employeeId: empId,
                manager,
                startDate: start,
                endDate: end,
                performanceIssue: issue || 'Performance concern',
                rootCause: root || '—',
                improvementTarget: target || '—',
                supportProvided: support || '—',
                weeklyReview: 'Weekly',
                progressPct: 0,
                status: 'in-progress'
            });
            saveDB();
            toast('PIP created!', 'success');
            closeModal();
            renderApp();
        }

        function updatePIP(id) {
            const p = db.pips.find(item => item.id === id);
            if (!p) return toast('Not found', 'error');
            const newPct = Math.min((p.progressPct || 0) + 20, 100);
            p.progressPct = newPct;
            if (newPct >= 100) p.status = 'completed';
            saveDB();
            toast(`PIP progress: ${newPct}%`, 'success');
            renderApp();
        }

        // ─── GRIEVANCES ─────────────────────────────────────────────────

        function renderGrievances(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-scale-balanced"></i> Employee Grievance</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddGrievance()"><i class="fas fa-plus"></i> Add Grievance</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Category</th><th>Description</th><th>Priority</th><th>Assigned HR</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.grievances.map(g => {
                      const emp = getEmployee(g.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${g.category}</td>
                        <td class="text-sm">${g.description}</td>
                        <td><span class="status-badge ${g.priority === 'High' ? 'danger' : g.priority === 'Medium' ? 'pending' : 'active'}">${g.priority}</span></td>
                        <td>${g.assignedHR || '—'}</td>
                        <td><span class="status-badge ${g.status}">${g.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-success" onclick="resolveGrievance(${g.id})"><i class="fas fa-check"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="7" class="text-muted text-center">No grievances.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddGrievance() {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
            const catOpts = ['Workplace', 'Harassment', 'Payroll', 'Leave', 'Policy', 'Manager', 'Other'].map(c =>
                `<option value="${c}">${c}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-scale-balanced"></i> Add Grievance</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="grievForm" onsubmit="saveGrievance(event)">
              <div class="form-group"><label>Employee</label><select id="grievEmp">${empOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Category</label><select id="grievCat">${catOpts}</select></div>
                <div class="form-group"><label>Priority</label><select id="grievPriority"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>
              </div>
              <div class="form-group"><label>Description</label><textarea id="grievDesc" rows="3" required></textarea></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Submit</button></div>
            </form>
          `);
        }

        function saveGrievance(event) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('grievEmp').value);
            const category = document.getElementById('grievCat').value;
            const priority = document.getElementById('grievPriority').value;
            const desc = document.getElementById('grievDesc').value.trim();
            if (!desc) return toast('Description required.', 'warning');
            db.grievances.push({
                id: genId('grievance'),
                employeeId: empId,
                category,
                description: desc,
                date: todayStr(),
                priority,
                assignedHR: currentUser.role === 'hr' || currentUser.role === 'admin' ? currentUser.name : 'HR',
                status: 'open'
            });
            saveDB();
            toast('Grievance submitted!', 'success');
            closeModal();
            renderApp();
        }

        function resolveGrievance(id) {
            const g = db.grievances.find(item => item.id === id);
            if (!g) return toast('Not found', 'error');
            g.status = 'resolved';
            g.resolutionDate = todayStr();
            saveDB();
            toast('Grievance resolved!', 'success');
            renderApp();
        }

        // ─── EXIT MANAGEMENT ───────────────────────────────────────────

        function renderExit(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-sign-out-alt"></i> Exit Management</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddExit()"><i class="fas fa-plus"></i> Register Resignation</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Resignation Date</th><th>Last Working Day</th><th>Reason</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.exitManagement.map(x => {
                      const emp = getEmployee(x.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${formatDate(x.resignationDate)}</td>
                        <td>${formatDate(x.lastWorkingDate)}</td>
                        <td class="text-sm">${x.reason}</td>
                        <td><span class="status-badge ${x.status}">${x.status}</span></td>
                        ${isAdmin ? `<td>
                          ${x.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="approveExit(${x.id})"><i class="fas fa-check"></i></button>` : ''}
                          <button class="btn btn-sm btn-danger" onclick="deleteExit(${x.id})"><i class="fas fa-trash"></i></button>
                        </td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="6" class="text-muted text-center">No exit records.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddExit() {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-sign-out-alt"></i> Register Resignation</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="exitForm" onsubmit="saveExit(event)">
              <div class="form-group"><label>Employee</label><select id="exitEmp">${empOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Resignation Date</label><input type="date" id="exitResignDate" value="${todayStr()}" /></div>
                <div class="form-group"><label>Last Working Day</label><input type="date" id="exitLastDay" value="${new Date(Date.now()+30*24*60*60*1000).toISOString().slice(0,10)}" /></div>
              </div>
              <div class="form-group"><label>Reason</label><textarea id="exitReason" rows="2"></textarea></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Register</button></div>
            </form>
          `);
        }

        function saveExit(event) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('exitEmp').value);
            const resignDate = document.getElementById('exitResignDate').value;
            const lastDay = document.getElementById('exitLastDay').value;
            const reason = document.getElementById('exitReason').value.trim() || 'Personal reasons';
            if (!resignDate || !lastDay) return toast('Dates required.', 'warning');
            db.exitManagement.push({
                id: genId('exitManagement'),
                employeeId: empId,
                resignationDate: resignDate,
                reason,
                lastWorkingDate: lastDay,
                noticePeriod: 30,
                status: 'pending',
                managerApproval: false,
                hrApproval: false,
                clearance: false,
                finalSettlement: false
            });
            saveDB();
            toast('Resignation registered!', 'success');
            closeModal();
            renderApp();
        }

        function approveExit(id) {
            const x = db.exitManagement.find(item => item.id === id);
            if (!x) return toast('Not found', 'error');
            x.status = 'approved';
            x.hrApproval = true;
            const emp = getEmployee(x.employeeId);
            if (emp) emp.status = 'inactive';
            saveDB();
            toast('Exit approved!', 'success');
            renderApp();
        }

        function deleteExit(id) {
            if (!confirm('Delete this exit record?')) return;
            db.exitManagement = db.exitManagement.filter(x => x.id !== id);
            saveDB();
            toast('Exit record deleted.', 'info');
            renderApp();
        }

        // ─── HELP DESK ──────────────────────────────────────────────────

        function renderHelpdesk(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-headset"></i> HR Help Desk</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddHelpdesk()"><i class="fas fa-plus"></i> New Ticket</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Category</th><th>Subject</th><th>Priority</th><th>Assigned HR</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.helpdeskTickets.map(t => {
                      const emp = getEmployee(t.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${t.category}</td>
                        <td>${t.subject}</td>
                        <td><span class="status-badge ${t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'pending' : 'active'}">${t.priority}</span></td>
                        <td>${t.assignedHR || '—'}</td>
                        <td><span class="status-badge ${t.status}">${t.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-success" onclick="resolveHelpdesk(${t.id})"><i class="fas fa-check"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="7" class="text-muted text-center">No tickets.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddHelpdesk() {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
            const catOpts = ['Salary', 'Attendance', 'Leave', 'Payroll', 'Documents', 'Policy', 'Benefits', 'Insurance',
                'Recruitment', 'Workplace', 'Grievance'
            ].map(c => `<option value="${c}">${c}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-headset"></i> New Ticket</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="hdForm" onsubmit="saveHelpdesk(event)">
              <div class="form-group"><label>Employee</label><select id="hdEmp">${empOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Category</label><select id="hdCat">${catOpts}</select></div>
                <div class="form-group"><label>Priority</label><select id="hdPriority"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>
              </div>
              <div class="form-group"><label>Subject</label><input type="text" id="hdSubject" required /></div>
              <div class="form-group"><label>Description</label><textarea id="hdDesc" rows="2"></textarea></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Create Ticket</button></div>
            </form>
          `);
        }

        function saveHelpdesk(event) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('hdEmp').value);
            const category = document.getElementById('hdCat').value;
            const priority = document.getElementById('hdPriority').value;
            const subject = document.getElementById('hdSubject').value.trim();
            const desc = document.getElementById('hdDesc').value.trim();
            if (!subject) return toast('Subject required.', 'warning');
            db.helpdeskTickets.push({
                id: genId('helpdeskTicket'),
                employeeId: empId,
                category,
                subject,
                description: desc || '—',
                priority,
                assignedHR: currentUser.role === 'hr' || currentUser.role === 'admin' ? currentUser.name : 'HR',
                status: 'open',
                sla: '24 hours',
                resolution: '',
                employeeRating: 0
            });
            saveDB();
            toast('Ticket created!', 'success');
            closeModal();
            renderApp();
        }

        function resolveHelpdesk(id) {
            const t = db.helpdeskTickets.find(item => item.id === id);
            if (!t) return toast('Not found', 'error');
            t.status = 'resolved';
            t.resolution = 'Resolved by ' + currentUser.name;
            saveDB();
            toast('Ticket resolved!', 'success');
            renderApp();
        }

        // ─── ANNOUNCEMENTS ─────────────────────────────────────────────

        function renderAnnouncements(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-bullhorn"></i> Announcements</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddAnnouncement()"><i class="fas fa-plus"></i> Post Announcement</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Title</th><th>Category</th><th>Message</th><th>Priority</th><th>Published</th><th>Read</th></tr></thead>
                  <tbody>
                    ${db.announcements.map(a => `
                      <tr>
                        <td><strong>${a.title}</strong></td>
                        <td>${a.category}</td>
                        <td class="text-sm">${a.message}</td>
                        <td><span class="status-badge ${a.priority === 'High' ? 'danger' : 'active'}">${a.priority}</span></td>
                        <td>${formatDate(a.publishDate)}</td>
                        <td>${a.readCount || 0}</td>
                      </tr>
                    `).join('') || '<tr><td colspan="6" class="text-muted text-center">No announcements.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddAnnouncement() {
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-bullhorn"></i> Post Announcement</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="annForm" onsubmit="saveAnnouncement(event)">
              <div class="form-group"><label>Title</label><input type="text" id="annTitle" required /></div>
              <div class="form-row">
                <div class="form-group"><label>Category</label><select id="annCat"><option value="Company">Company</option><option value="HR">HR</option><option value="IT">IT</option><option value="Events">Events</option></select></div>
                <div class="form-group"><label>Priority</label><select id="annPriority"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>
              </div>
              <div class="form-group"><label>Message</label><textarea id="annMsg" rows="3" required></textarea></div>
              <div class="form-row">
                <div class="form-group"><label>Publish Date</label><input type="date" id="annPublish" value="${todayStr()}" /></div>
                <div class="form-group"><label>Expiry Date</label><input type="date" id="annExpiry" value="${new Date(Date.now()+30*24*60*60*1000).toISOString().slice(0,10)}" /></div>
              </div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Post</button></div>
            </form>
          `);
        }

        function saveAnnouncement(event) {
            event.preventDefault();
            const title = document.getElementById('annTitle').value.trim();
            const category = document.getElementById('annCat').value;
            const priority = document.getElementById('annPriority').value;
            const msg = document.getElementById('annMsg').value.trim();
            const publish = document.getElementById('annPublish').value;
            const expiry = document.getElementById('annExpiry').value;
            if (!title || !msg) return toast('Title and message required.', 'warning');
            db.announcements.push({
                id: genId('announcement'),
                title,
                category,
                message: msg,
                priority,
                publishDate: publish || todayStr(),
                expiryDate: expiry || '',
                readCount: 0,
                acknowledgementRequired: true,
                acknowledgedEmployees: []
            });
            saveDB();
            toast('Announcement posted!', 'success');
            closeModal();
            renderApp();
        }

        // ─── TRAININGS ──────────────────────────────────────────────────

        function renderTrainings(container) {
            const isAdmin = currentUser.role === 'admin' || currentUser.role === 'hr';
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-graduation-cap"></i> Training & Development</h2>${isAdmin ? `<button class="btn btn-primary" onclick="openAddTraining()"><i class="fas fa-plus"></i> Add Training</button>` : ''}</div>
            <div class="table-wrap">
              <div class="table-scroll">
                <table>
                  <thead><tr><th>Employee</th><th>Training</th><th>Provider</th><th>Start</th><th>End</th><th>Score</th><th>Status</th>${isAdmin ? '<th>Actions</th>' : ''}</tr></thead>
                  <tbody>
                    ${db.trainings.map(t => {
                      const emp = getEmployee(t.employeeId);
                      return `<tr>
                        <td>${emp ? emp.name : 'Unknown'}</td>
                        <td>${t.trainingName}</td>
                        <td>${t.provider}</td>
                        <td>${formatDate(t.startDate)}</td>
                        <td>${formatDate(t.endDate)}</td>
                        <td>${t.score || '—'}</td>
                        <td><span class="status-badge ${t.status}">${t.status}</span></td>
                        ${isAdmin ? `<td><button class="btn btn-sm btn-danger" onclick="deleteTraining(${t.id})"><i class="fas fa-trash"></i></button></td>` : ''}
                      </tr>`;
                    }).join('') || '<tr><td colspan="8" class="text-muted text-center">No trainings.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        function openAddTraining() {
            const empOpts = db.employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
            showModal(`
            <div class="modal-header"><h3><i class="fas fa-graduation-cap"></i> Add Training</h3><button class="close" onclick="closeModal()">&times;</button></div>
            <form id="trainForm" onsubmit="saveTraining(event)">
              <div class="form-group"><label>Employee</label><select id="trainEmp">${empOpts}</select></div>
              <div class="form-row">
                <div class="form-group"><label>Training Name</label><input type="text" id="trainName" required /></div>
                <div class="form-group"><label>Provider</label><input type="text" id="trainProvider" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Start Date</label><input type="date" id="trainStart" value="${todayStr()}" /></div>
                <div class="form-group"><label>End Date</label><input type="date" id="trainEnd" value="${new Date(Date.now()+14*24*60*60*1000).toISOString().slice(0,10)}" /></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Hours</label><input type="number" id="trainHours" value="20" /></div>
                <div class="form-group"><label>Cost ($)</label><input type="number" id="trainCost" value="0" /></div>
              </div>
              <div class="form-group"><label>Skill</label><input type="text" id="trainSkill" /></div>
              <div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Add Training</button></div>
            </form>
          `);
        }

        function saveTraining(event) {
            event.preventDefault();
            const empId = parseInt(document.getElementById('trainEmp').value);
            const name = document.getElementById('trainName').value.trim();
            const provider = document.getElementById('trainProvider').value.trim() || 'Internal';
            const start = document.getElementById('trainStart').value;
            const end = document.getElementById('trainEnd').value;
            const hours = parseInt(document.getElementById('trainHours').value) || 20;
            const cost = parseFloat(document.getElementById('trainCost').value) || 0;
            const skill = document.getElementById('trainSkill').value.trim() || '—';
            if (!name) return toast('Training name required.', 'warning');
            db.trainings.push({
                id: genId('training'),
                employeeId: empId,
                skill,
                trainingName: name,
                provider,
                startDate: start || todayStr(),
                endDate: end || '',
                hours,
                cost,
                status: 'in-progress',
                score: 0,
                certificate: ''
            });
            saveDB();
            toast('Training added!', 'success');
            closeModal();
            renderApp();
        }

        function deleteTraining(id) {
            if (!confirm('Delete this training?')) return;
            db.trainings = db.trainings.filter(t => t.id !== id);
            saveDB();
            toast('Training deleted.', 'info');
            renderApp();
        }

        // ─── REPORT ENGINE ─────────────────────────────────────────────

        function renderReports(container) {
            container.innerHTML = `
            <div class="section-header"><h2><i class="fas fa-file-pdf"></i> Report Engine</h2></div>
            <div class="filter-bar">
              <div class="filter-group"><label>Report Type</label><select id="reportType" onchange="generateReport()">
                <option value="employee">Employee Master</option>
                <option value="attendance">Attendance Report</option>
                <option value="leave">Leave Report</option>
                <option value="performance">Performance Report</option>
                <option value="payroll">Payroll Report</option>
                <option value="recruitment">Recruitment Report</option>
                <option value="incentive">Incentive Report</option>
                <option value="training">Training Report</option>
                <option value="grievance">Grievance Report</option>
                <option value="exit">Exit Report</option>
              </select></div>
              <div class="filter-group"><label>From Date</label><input type="date" id="reportFrom" value="${new Date(Date.now()-90*24*60*60*1000).toISOString().slice(0,10)}" /></div>
              <div class="filter-group"><label>To Date</label><input type="date" id="reportTo" value="${todayStr()}" /></div>
              <div class="filter-group"><label>Department</label><select id="reportDept"><option value="">All</option>${['Engineering','Sales','Marketing','HR','Design','Finance','Operations'].map(d => `<option value="${d}">${d}</option>`).join('')}</select></div>
              <div class="filter-actions">
                <button class="btn btn-primary" onclick="generateReport()"><i class="fas fa-file-export"></i> Generate</button>
                <button class="btn btn-success" onclick="exportReportCSV()"><i class="fas fa-file-csv"></i> CSV</button>
                <button class="btn btn-warning" onclick="printReport()"><i class="fas fa-print"></i> Print</button>
              </div>
            </div>
            <div id="reportOutput" class="table-wrap">
              <div class="table-scroll">
                <table id="reportTable">
                  <thead><tr><th>Select a report type and click Generate.</th></tr></thead>
                  <tbody><tr><td class="text-muted text-center">Use the filters above to generate reports.</td></tr></tbody>
                </table>
              </div>
            </div>
          `;
        }

        function generateReport() {
            const type = document.getElementById('reportType').value;
            const from = document.getElementById('reportFrom').value;
            const to = document.getElementById('reportTo').value;
            const dept = document.getElementById('reportDept').value;
            let data = [];
            let headers = [];
            let title = '';

            switch (type) {
                case 'employee':
                    data = db.employees.filter(e => !dept || e.department === dept);
                    headers = ['ID', 'Name', 'Department', 'Position', 'Status', 'Salary', 'Joining'];
                    title = 'Employee Master Report';
                    break;
                case 'attendance':
                    data = db.attendance.filter(a => {
                        const d = a.date;
                        return (!from || d >= from) && (!to || d <= to);
                    }).map(a => ({ ...a, employeeName: getEmployeeName(a.employeeId) }));
                    headers = ['Employee', 'Date', 'Check In', 'Check Out', 'Hours', 'Status'];
                    title = 'Attendance Report';
                    break;
                case 'leave':
                    data = db.leaves.filter(l => {
                        const d = l.startDate;
                        return (!from || d >= from) && (!to || d <= to);
                    }).map(l => ({ ...l, employeeName: getEmployeeName(l.employeeId) }));
                    headers = ['Employee', 'Type', 'Start', 'End', 'Days', 'Status'];
                    title = 'Leave Report';
                    break;
                case 'performance':
                    data = db.performances.filter(p => {
                        const d = p.date;
                        return (!from || d >= from) && (!to || d <= to);
                    }).map(p => ({ ...p, employeeName: getEmployeeName(p.employeeId) }));
                    headers = ['Employee', 'Reviewer', 'Date', 'Rating', 'Comments'];
                    title = 'Performance Report';
                    break;
                case 'payroll':
                    data = db.employees.filter(e => !dept || e.department === dept);
                    headers = ['Name', 'Department', 'Salary', 'Net Pay', 'Status'];
                    title = 'Payroll Report';
                    break;
                case 'recruitment':
                    data = db.requisitions;
                    headers = ['Position', 'Department', 'Vacancies', 'Status', 'Priority'];
                    title = 'Recruitment Report';
                    break;
                case 'incentive':
                    data = db.incentives.map(i => ({ ...i, employeeName: getEmployeeName(i.employeeId) }));
                    headers = ['Employee', 'Plan', 'Achievement %', 'Amount', 'Status'];
                    title = 'Incentive Report';
                    break;
                case 'training':
                    data = db.trainings.map(t => ({ ...t, employeeName: getEmployeeName(t.employeeId) }));
                    headers = ['Employee', 'Training', 'Provider', 'Score', 'Status'];
                    title = 'Training Report';
                    break;
                case 'grievance':
                    data = db.grievances.map(g => ({ ...g, employeeName: getEmployeeName(g.employeeId) }));
                    headers = ['Employee', 'Category', 'Description', 'Priority', 'Status'];
                    title = 'Grievance Report';
                    break;
                case 'exit':
                    data = db.exitManagement.map(x => ({ ...x, employeeName: getEmployeeName(x.employeeId) }));
                    headers = ['Employee', 'Resignation Date', 'Last Day', 'Reason', 'Status'];
                    title = 'Exit Report';
                    break;
                default:
                    data = [];
                    headers = [];
            }

            const table = document.getElementById('reportTable');
            let html = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
            if (data.length === 0) {
                html += `<tr><td colspan="${headers.length || 1}" class="text-muted text-center">No records found.</td></tr>`;
            } else {
                for (const row of data) {
                    html += `<tr>${headers.map(h => {
                        const key = h.toLowerCase().replace(/ /g,'');
                        const val = row[key] ?? row[h] ?? '—';
                        return `<td>${val}</td>`;
                    }).join('')}</tr>`;
                }
            }
            html += '</tbody>';
            table.innerHTML = html;
            toast(`Report generated: ${title} (${data.length} records)`, 'success');
        }

        function exportReportCSV() {
            const table = document.getElementById('reportTable');
            let csv = '';
            const rows = table.querySelectorAll('tr');
            for (const row of rows) {
                const cols = row.querySelectorAll('th,td');
                const vals = Array.from(cols).map(c => c.textContent.trim());
                csv += vals.join(',') + '\n';
            }
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report_${todayStr()}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast('CSV exported!', 'success');
        }

        function printReport() {
            const content = document.getElementById('reportOutput').innerHTML;
            const win = window.open('', '_blank');
            win.document.write(`
            <html><head><title>Report</title>
            <style>body{font-family:'Inter','Segoe UI',sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;font-size:13px;}th,td{padding:8px 12px;border:1px solid #ddd;text-align:left;}th{background:#f1f5f9;}</style>
            </head><body><h2>HR Report</h2>${content}</body></html>
          `);
            win.document.close();
            win.print();
            toast('Print dialog opened.', 'info');
        }

        // ─── APP INIT ───────────────────────────────────────────────────

        document.getElementById('logoutBtn').addEventListener('click', () => {
            toast('Admin session active.', 'info');
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
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault();
                document.getElementById('globalSearch').focus(); }
        });

        document.getElementById('hamburgerBtn').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const hamburger = document.getElementById('hamburgerBtn');
            if (window.innerWidth <= 768 && sidebar.classList.contains('open') &&
                !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });

        function renderApp() {
            renderSidebar();
            navigateTo(currentPage);
        }

        // ─── GLOBAL EXPOSURE ────────────────────────────────────────────

        window.navigateTo = navigateTo;
        window.closeModal = closeModal;
        window.toast = toast;
        window.getEmployee = getEmployee;
        window.getEmployeeName = getEmployeeName;
        window.formatDate = formatDate;
        window.todayStr = todayStr;
        window.genId = genId;
        window.load360View = load360View;
        window.filterLeaves = filterLeaves;
        window.renderKPIView = renderKPIView;
        window.generateReport = generateReport;
        window.exportReportCSV = exportReportCSV;
        window.printReport = printReport;
        window.openAddEmployeeFull = openAddEmployeeFull;
        window.openEditEmployeeFull = openEditEmployeeFull;
        window.deleteEmployeeFull = deleteEmployeeFull;
        window.viewEmployeeProfile = viewEmployeeProfile;
        window.saveEmployeeFull = saveEmployeeFull;
        window.openDocumentUpload = openDocumentUpload;
        window.saveDocumentUpload = saveDocumentUpload;
        window.openAddAsset = openAddAsset;
        window.saveAsset = saveAsset;
        window.deleteAsset = deleteAsset;
        window.openAddExpense = openAddExpense;
        window.saveExpense = saveExpense;
        window.deleteExpense = deleteExpense;
        window.openMarkAttendanceFull = openMarkAttendanceFull;
        window.openMarkAttendanceForEmp = openMarkAttendanceForEmp;
        window.saveAttendanceFull = saveAttendanceFull;
        window.openAddShift = openAddShift;
        window.saveShift = saveShift;
        window.deleteShift = deleteShift;
        window.openAddLeave = openAddLeave;
        window.saveLeave = saveLeave;
        window.approveLeave = approveLeave;
        window.rejectLeave = rejectLeave;
        window.deleteLeave = deleteLeave;
        window.openAddRequisition = openAddRequisition;
        window.openEditRequisition = openEditRequisition;
        window.saveRequisition = saveRequisition;
        window.deleteRequisition = deleteRequisition;
        window.openAddCandidate = openAddCandidate;
        window.openEditCandidate = openEditCandidate;
        window.saveCandidate = saveCandidate;
        window.deleteCandidate = deleteCandidate;
        window.openAddInterview = openAddInterview;
        window.saveInterview = saveInterview;
        window.deleteInterview = deleteInterview;
        window.openAddOnboarding = openAddOnboarding;
        window.saveOnboarding = saveOnboarding;
        window.updateOnboarding = updateOnboarding;
        window.toggleOnboardingTask = toggleOnboardingTask;
        window.openAddPerformance = openAddPerformance;
        window.savePerformance = savePerformance;
        window.openAddAppraisal = openAddAppraisal;
        window.saveAppraisal = saveAppraisal;
        window.approveAppraisal = approveAppraisal;
        window.openAddIncentive = openAddIncentive;
        window.saveIncentive = saveIncentive;
        window.approveIncentive = approveIncentive;
        window.deleteIncentive = deleteIncentive;
        window.approvePromotion = approvePromotion;
        window.openAddPIP = openAddPIP;
        window.savePIP = savePIP;
        window.updatePIP = updatePIP;
        window.openAddGrievance = openAddGrievance;
        window.saveGrievance = saveGrievance;
        window.resolveGrievance = resolveGrievance;
        window.openAddExit = openAddExit;
        window.saveExit = saveExit;
        window.approveExit = approveExit;
        window.deleteExit = deleteExit;
        window.openAddHelpdesk = openAddHelpdesk;
        window.saveHelpdesk = saveHelpdesk;
        window.resolveHelpdesk = resolveHelpdesk;
        window.openAddAnnouncement = openAddAnnouncement;
        window.saveAnnouncement = saveAnnouncement;
        window.openAddTraining = openAddTraining;
        window.saveTraining = saveTraining;
        window.deleteTraining = deleteTraining;

        // Init
        renderApp();

        console.log('🚀 HR+ ERP System loaded with 40+ modules.');
        console.log(`📊 ${db.employees.length} employees, ${db.requisitions.length} requisitions, ${db.candidates.length} candidates, ${db.leaves.length} leaves, ${db.performances.length} performance reviews.`);
    });
    
