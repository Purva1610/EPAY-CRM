<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ePay Gallery - Franchise Admin Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        .sidebar-menu-item {
            transition: all 0.2s ease;
        }
        .sidebar-menu-item:hover, .sidebar-menu-item.active {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }
        .sidebar-menu-item.active {
            background-color: #2563eb;
            color: white;
            border-radius: 0.5rem;
        }
        .sidebar-menu-item.active:hover {
            background-color: #1d4ed8;
        }
    </style>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            dark: '#0f172a',
                            blue: '#2563eb',
                            light: '#f8fafc'
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50 text-gray-800 overflow-hidden h-screen flex">

    <!-- Sidebar -->
    <aside class="w-64 bg-[#0b132b] text-gray-300 flex flex-col h-full overflow-y-auto hidden md:flex flex-shrink-0 z-20">
        <div class="p-4 flex items-center gap-3 border-b border-gray-700">
            <div class="w-8 h-8 bg-white rounded flex items-center justify-center text-red-500 font-bold text-xl">e</div>
            <div>
                <h1 class="text-white font-bold text-lg leading-tight">Pay <span class="text-blue-500">Gallery</span></h1>
                <p class="text-xs text-gray-400">Franchise Admin Dashboard</p>
            </div>
        </div>

        <nav class="flex-1 p-3 space-y-1 text-sm font-medium">
            <a href="#" class="sidebar-menu-item active flex items-center gap-3 px-3 py-2.5 rounded-lg mb-4">
                <i class="fas fa-home w-5 text-center"></i>
                <span>Dashboard</span>
            </a>

            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-3">Franchise Management</div>
            <a href="#" class="sidebar-menu-item flex items-center justify-between px-3 py-2 rounded-lg">
                <div class="flex items-center gap-3"><i class="fas fa-file-signature w-5 text-center"></i> Franchise Applications</div>
                <i class="fas fa-chevron-right text-[10px]"></i>
            </a>
            <a href="#" class="sidebar-menu-item flex items-center justify-between px-3 py-2 rounded-lg">
                <div class="flex items-center gap-3"><i class="fas fa-store w-5 text-center"></i> Franchise Management</div>
                <i class="fas fa-chevron-right text-[10px]"></i>
            </a>
            <a href="#" class="sidebar-menu-item flex items-center justify-between px-3 py-2 rounded-lg">
                <div class="flex items-center gap-3"><i class="fas fa-map-marked-alt w-5 text-center"></i> Territory Management</div>
                <i class="fas fa-chevron-right text-[10px]"></i>
            </a>
            <a href="#" class="sidebar-menu-item flex items-center justify-between px-3 py-2 rounded-lg">
                <div class="flex items-center gap-3"><i class="fas fa-file-contract w-5 text-center"></i> Agreements & Documents</div>
                <i class="fas fa-chevron-right text-[10px]"></i>
            </a>
            <a href="#" class="sidebar-menu-item flex items-center justify-between px-3 py-2 rounded-lg">
                <div class="flex items-center gap-3"><i class="fas fa-id-card w-5 text-center"></i> KYC & Verification</div>
                <i class="fas fa-chevron-right text-[10px]"></i>
            </a>

            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-3">Gallery Management</div>
            <a href="#" class="sidebar-menu-item flex items-center justify-between px-3 py-2 rounded-lg">
                <div class="flex items-center gap-3"><i class="fas fa-images w-5 text-center"></i> Gallery Management</div>
                <i class="fas fa-chevron-right text-[10px]"></i>
            </a>
            
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-3">Operations</div>
            <a href="#" class="sidebar-menu-item flex items-center justify-between px-3 py-2 rounded-lg">
                <div class="flex items-center gap-3"><i class="fas fa-wallet w-5 text-center"></i> Finance & Commission</div>
                <i class="fas fa-chevron-right text-[10px]"></i>
            </a>
        </nav>

        <div class="p-4 border-t border-gray-700">
            <a href="#" class="flex items-center gap-3 text-sm text-gray-400 hover:text-white">
                <i class="fas fa-angle-double-left w-5 text-center"></i>
                <span>Collapse Menu</span>
            </a>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
        
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0 z-10">
            <div class="flex items-center w-96 relative">
                <i class="fas fa-search absolute left-3 text-gray-400"></i>
                <input type="text" placeholder="Search Franchise, Gallery, Manager, Transactions..." 
                       class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>
            <div class="flex items-center gap-5">
                <div class="flex items-center gap-4 text-gray-500">
                    <button class="relative hover:text-gray-700"><i class="fas fa-search"></i></button>
                    <button class="relative hover:text-gray-700">
                        <i class="far fa-bell"></i>
                        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full">15</span>
                    </button>
                    <button class="relative hover:text-gray-700">
                        <i class="far fa-comment-alt"></i>
                        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full">32</span>
                    </button>
                    <button class="hover:text-gray-700"><i class="far fa-question-circle"></i></button>
                </div>
                <div class="flex items-center gap-3 border-l pl-5">
                    <div class="text-right hidden md:block">
                        <p class="text-sm font-bold text-gray-800 leading-tight">Super Admin</p>
                        <p class="text-xs text-gray-500">ePay India</p>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=Super+Admin&background=0D8ABC&color=fff" alt="Profile" class="w-9 h-9 rounded-full border border-gray-200">
                </div>
            </div>
        </header>

        <!-- Scrollable Dashboard Content -->
        <div class="flex-1 overflow-y-auto p-6">
            
            <!-- Dashboard Controls -->
            <div class="flex justify-end items-center gap-3 mb-6">
                <div class="flex items-center gap-2 text-sm">
                    <span class="text-gray-500">Dashboard View</span>
                    <select class="border border-gray-300 rounded-md py-1 px-2 text-gray-700 bg-white focus:outline-none">
                        <option>Overall</option>
                    </select>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <span class="text-gray-500">Date Range</span>
                    <div class="border border-gray-300 rounded-md py-1 px-3 text-gray-700 bg-white flex items-center gap-2">
                        <span>01 May 2025 - 31 May 2025</span>
                        <i class="far fa-calendar-alt text-gray-400"></i>
                    </div>
                </div>
                <button class="bg-emerald-500 text-white p-1.5 rounded-md hover:bg-emerald-600"><i class="fas fa-filter"></i></button>
            </div>

            <!-- Dynamic KPIs -->
            <div id="kpi-grid" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <!-- KPI cards will be injected here by JS -->
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                <!-- Business Overview -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 col-span-1 lg:col-span-1">
                    <h3 class="text-sm font-bold text-gray-800 mb-4">Business Overview (This Month)</h3>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Sales</p>
                            <p class="text-sm font-bold text-gray-800">₹ 312.45 Cr</p>
                            <p class="text-[10px] text-emerald-500"><i class="fas fa-arrow-up"></i> 12.45%</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Orders</p>
                            <p class="text-sm font-bold text-gray-800">1,25,748</p>
                            <p class="text-[10px] text-emerald-500"><i class="fas fa-arrow-up"></i> 10.32%</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Customers</p>
                            <p class="text-sm font-bold text-gray-800">2,48,547</p>
                            <p class="text-[10px] text-emerald-500"><i class="fas fa-arrow-up"></i> 8.76%</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Average Order Value</p>
                            <p class="text-sm font-bold text-gray-800">₹ 2,485</p>
                            <p class="text-[10px] text-emerald-500"><i class="fas fa-arrow-up"></i> 5.43%</p>
                        </div>
                    </div>
                    <div class="h-48">
                        <canvas id="businessChart"></canvas>
                    </div>
                </div>

                <!-- Franchise Distribution Map (Stylized Placeholder for simplicity) -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 col-span-1 lg:col-span-1">
                    <h3 class="text-sm font-bold text-gray-800 mb-4">Franchise Distribution (India Map)</h3>
                    <div class="flex items-center h-56 relative">
                        <!-- Simulated Map Layout -->
                        <div class="w-1/2 flex items-center justify-center relative h-full">
                            <i class="fas fa-map-marked-alt text-6xl text-blue-100 absolute"></i>
                            <div class="grid grid-cols-2 gap-2 text-[10px] relative z-10 w-full text-center">
                                <div class="bg-blue-100 text-blue-800 rounded p-1">North</div>
                                <div class="bg-green-100 text-green-800 rounded p-1">East</div>
                                <div class="bg-yellow-100 text-yellow-800 rounded p-1">West</div>
                                <div class="bg-purple-100 text-purple-800 rounded p-1 mt-4 ml-4 col-span-2 w-1/2 mx-auto">South</div>
                            </div>
                        </div>
                        <div class="w-1/2 pl-4 text-xs space-y-3">
                            <div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-blue-500"></span>North</span> <span class="font-bold">268</span></div>
                            <div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-green-500"></span>South</span> <span class="font-bold">312</span></div>
                            <div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-teal-500"></span>East</span> <span class="font-bold">186</span></div>
                            <div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-yellow-500"></span>West</span> <span class="font-bold">248</span></div>
                            <div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-orange-500"></span>Central</span> <span class="font-bold">156</span></div>
                            <div class="flex justify-between items-center"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-red-500"></span>North East</span> <span class="font-bold">78</span></div>
                            <div class="pt-2 border-t mt-2 flex justify-between items-center font-bold"><span>Total</span> <span>1,248</span></div>
                        </div>
                    </div>
                </div>

                <!-- Top Performing States -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 col-span-1 lg:col-span-1">
                    <h3 class="text-sm font-bold text-gray-800 mb-4">Top Performing States (By Business Volume)</h3>
                    <div class="h-56">
                        <canvas id="statesChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Tables & Lists Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                <!-- Recently Added Franchise -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 col-span-1 lg:col-span-1">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-sm font-bold text-gray-800">Recently Added Franchise</h3>
                        <a href="#" class="text-xs text-blue-600 font-medium">View All</a>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="text-gray-500 border-b">
                                <tr>
                                    <th class="pb-2 font-medium">ID</th>
                                    <th class="pb-2 font-medium">Franchise Name</th>
                                    <th class="pb-2 font-medium">State</th>
                                    <th class="pb-2 font-medium">Applied On</th>
                                    <th class="pb-2 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody id="franchise-table-body" class="text-gray-700">
                                <!-- Populated by JS -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Pending Approvals -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 col-span-1 lg:col-span-1">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-sm font-bold text-gray-800">Pending Approvals</h3>
                        <a href="#" class="text-xs text-blue-600 font-medium">View All</a>
                    </div>
                    <ul id="approvals-list" class="space-y-4">
                        <!-- Populated by JS -->
                    </ul>
                </div>

                <!-- Alerts & Notifications -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 col-span-1 lg:col-span-1">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-sm font-bold text-gray-800">Recent Alerts & Notifications</h3>
                        <a href="#" class="text-xs text-blue-600 font-medium">View All</a>
                    </div>
                    <ul id="alerts-list" class="space-y-4">
                        <!-- Populated by JS -->
                    </ul>
                </div>
            </div>

            <!-- Bottom Status Cards -->
            <div id="status-cards" class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <!-- Populated by JS -->
            </div>

            <!-- Footer -->
            <footer class="text-center text-xs text-gray-400 py-4 mt-4 border-t border-gray-200 flex justify-between">
                <span>&copy; 2025 ePay India Ltd. All rights reserved.</span>
                <span>Version 2.1.0</span>
            </footer>

        </div>
    </main>

    <!-- Dynamic JavaScript Data & Rendering -->
    <script>
        // Data Structures
        const kpis = [
            { icon: 'fa-users', color: 'bg-blue-500', title: 'Total Franchise', value: '1,248', sub: '+32 this month', subClass: 'text-emerald-500' },
            { icon: 'fa-check-circle', color: 'bg-emerald-500', title: 'Active Franchise', value: '1,087', sub: '87.10% of total', subClass: 'text-emerald-500' },
            { icon: 'fa-hourglass-half', color: 'bg-orange-500', title: 'Pending Applications', value: '161', sub: 'Requires action', subClass: 'text-orange-500' },
            { icon: 'fa-store', color: 'bg-purple-500', title: 'Total Galleries', value: '3,586', sub: '+118 this month', subClass: 'text-emerald-500' },
            { icon: 'fa-check-square', color: 'bg-teal-500', title: 'Active Galleries', value: '2,985', sub: '83.24% of total', subClass: 'text-emerald-500' },
            { icon: 'fa-user-tie', color: 'bg-rose-500', title: 'Total Managers', value: '4,926', sub: '+203 this month', subClass: 'text-emerald-500' },
            
            { icon: 'fa-rupee-sign', color: 'bg-amber-500', title: 'Today\'s Transactions', value: '18,475', sub: '₹ 2.45 Cr', subClass: 'text-emerald-500' },
            { icon: 'fa-chart-bar', color: 'bg-blue-600', title: 'Monthly Transactions', value: '5,48,762', sub: '₹ 74.32 Cr', subClass: 'text-emerald-500' },
            { icon: 'fa-bullseye', color: 'bg-indigo-500', title: 'Total Business Volume', value: '₹ 312.45 Cr', sub: 'This Month', subClass: 'text-gray-500' },
            { icon: 'fa-money-bill-wave', color: 'bg-emerald-600', title: 'Total Revenue', value: '₹ 23.78 Cr', sub: 'This Month', subClass: 'text-gray-500' },
            { icon: 'fa-percentage', color: 'bg-orange-500', title: 'Commission Payable', value: '₹ 6.45 Cr', sub: 'Pending', subClass: 'text-orange-500' },
            { icon: 'fa-wallet', color: 'bg-red-500', title: 'Wallet Balance', value: '₹ 8.76 Cr', sub: 'Total in System', subClass: 'text-gray-500' }
        ];

        const recentFranchises = [
            { id: 'FRN1250', name: 'Sharma Digital Services', state: 'Rajasthan', date: '31 May 2025', status: 'Pending', statusColor: 'bg-orange-100 text-orange-700' },
            { id: 'FRN1249', name: 'Patel Online Services', state: 'Gujarat', date: '31 May 2025', status: 'Verification', statusColor: 'bg-blue-100 text-blue-700' },
            { id: 'FRN1248', name: 'Sai Digital Gallery', state: 'Madhya Pradesh', date: '30 May 2025', status: 'Pending', statusColor: 'bg-orange-100 text-orange-700' },
            { id: 'FRN1247', name: 'Kumar Digital Hub', state: 'Bihar', date: '30 May 2025', status: 'Verification', statusColor: 'bg-blue-100 text-blue-700' },
            { id: 'FRN1246', name: 'R.K. Services', state: 'West Bengal', date: '29 May 2025', status: 'Pending', statusColor: 'bg-orange-100 text-orange-700' }
        ];

        const pendingApprovals = [
            { icon: 'fa-id-card', color: 'text-red-500', text: 'KYC Verifications', count: 45 },
            { icon: 'fa-file-signature', color: 'text-blue-500', text: 'Agreement Signatures', count: 38 },
            { icon: 'fa-map-pin', color: 'text-purple-500', text: 'Gallery Inspections', count: 27 },
            { icon: 'fa-money-check-alt', color: 'text-emerald-500', text: 'Payment Confirmations', count: 31 },
            { icon: 'fa-user-check', color: 'text-orange-500', text: 'Manager Approvals', count: 18 }
        ];

        const alerts = [
            { icon: 'fa-file-contract', color: 'text-orange-500', bg: 'bg-orange-100', text: 'Agreement renewal pending for 23 Franchise', time: '1 hour ago' },
            { icon: 'fa-rupee-sign', color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Commission payout scheduled for today', time: '2 hours ago' },
            { icon: 'fa-inbox', color: 'text-blue-500', bg: 'bg-blue-100', text: 'New franchise application received (ID: FRN1250)', time: '3 hours ago' },
            { icon: 'fa-exclamation-circle', color: 'text-red-500', bg: 'bg-red-100', text: 'Gallery inspection pending in 15 locations', time: '5 hours ago' },
            { icon: 'fa-user-clock', color: 'text-purple-500', bg: 'bg-purple-100', text: 'Manager KYC expired for 12 users', time: '1 day ago' }
        ];

        const statusCards = [
            { icon: 'fa-headset', iconColor: 'text-blue-600', bg: 'bg-blue-50', title: 'Open Tickets', value: '82', valColor: 'text-blue-600' },
            { icon: 'fa-exclamation-triangle', iconColor: 'text-red-500', bg: 'bg-red-50', title: 'Overdue Tickets', value: '16', valColor: 'text-red-600' },
            { icon: 'fa-file-alt', iconColor: 'text-orange-500', bg: 'bg-orange-50', title: 'Expiring Agreements (30 Days)', value: '39', valColor: 'text-orange-600' },
            { icon: 'fa-id-badge', iconColor: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Expiring KYC (30 Days)', value: '28', valColor: 'text-emerald-600' },
            { icon: 'fa-graduation-cap', iconColor: 'text-indigo-600', bg: 'bg-indigo-50', title: 'Training Pending', value: '142 Managers', valColor: 'text-gray-800' }
        ];

        // Rendering Functions
        function renderKPIs() {
            const container = document.getElementById('kpi-grid');
            kpis.forEach(kpi => {
                const isPositive = kpi.sub.includes('+') || kpi.sub.includes('₹');
                const arrowHtml = isPositive && kpi.subClass.includes('emerald') ? `<i class="fas fa-arrow-up text-[10px]"></i> ` : '';
                container.innerHTML += `
                    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div class="${kpi.color} text-white w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                            <i class="fas ${kpi.icon} text-xl"></i>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 font-medium mb-1">${kpi.title}</p>
                            <h4 class="text-xl font-bold text-gray-800 leading-none mb-1">${kpi.value}</h4>
                            <p class="text-[10px] ${kpi.subClass} font-medium">${arrowHtml}${kpi.sub}</p>
                        </div>
                    </div>
                `;
            });
        }

        function renderTablesAndLists() {
            // Table
            const tbody = document.getElementById('franchise-table-body');
            recentFranchises.forEach(f => {
                tbody.innerHTML += `
                    <tr class="border-b border-gray-50 hover:bg-gray-50">
                        <td class="py-3 font-medium">${f.id}</td>
                        <td class="py-3">${f.name}</td>
                        <td class="py-3">${f.state}</td>
                        <td class="py-3">${f.date}</td>
                        <td class="py-3"><span class="px-2 py-1 rounded text-[10px] font-bold ${f.statusColor}">${f.status}</span></td>
                    </tr>
                `;
            });

            // Approvals
            const appList = document.getElementById('approvals-list');
            pendingApprovals.forEach(a => {
                appList.innerHTML += `
                    <li class="flex items-center justify-between text-xs">
                        <div class="flex items-center gap-3">
                            <div class="${a.color} w-6 text-center"><i class="fas ${a.icon} text-sm"></i></div>
                            <span class="text-gray-700 font-medium">${a.text}</span>
                        </div>
                        <span class="font-bold ${a.color}">${a.count}</span>
                    </li>
                `;
            });

            // Alerts
            const alertList = document.getElementById('alerts-list');
            alerts.forEach(a => {
                alertList.innerHTML += `
                    <li class="flex items-center justify-between text-xs">
                        <div class="flex items-center gap-3">
                            <div class="${a.bg} ${a.color} w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"><i class="fas ${a.icon} text-[10px]"></i></div>
                            <span class="text-gray-700 truncate w-48" title="${a.text}">${a.text}</span>
                        </div>
                        <span class="text-gray-400 whitespace-nowrap">${a.time}</span>
                    </li>
                `;
            });
            
            // Bottom Cards
            const statusContainer = document.getElementById('status-cards');
            statusCards.forEach(s => {
                statusContainer.innerHTML += `
                    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div class="${s.bg} ${s.iconColor} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="fas ${s.icon}"></i>
                        </div>
                        <div>
                            <p class="text-[10px] text-gray-500 font-medium mb-1">${s.title}</p>
                            <h4 class="text-lg font-bold ${s.valColor} leading-none">${s.value}</h4>
                        </div>
                    </div>
                `;
            });
        }

        // Initialize Charts via Chart.js
        function initCharts() {
            // Line Chart: Business Overview
            const ctxLine = document.getElementById('businessChart').getContext('2d');
            new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: ['01 May', '06 May', '11 May', '16 May', '21 May', '26 May', '31 May'],
                    datasets: [
                        {
                            label: 'Business Volume (₹)',
                            data: [20, 28, 22, 35, 25, 38, 30],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Transactions',
                            data: [15, 20, 15, 25, 20, 28, 20],
                            borderColor: '#10b981',
                            borderWidth: 2,
                            tension: 0.4,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top', labels: { boxWidth: 10, usePointStyle: true, font: {size: 10} } }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: {size: 9} } },
                        y: { type: 'linear', display: true, position: 'left', ticks: { font: {size: 9} }, title: {display: true, text: '₹ (in Cr)', font: {size: 9}} },
                        y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { font: {size: 9} }, title: {display: true, text: 'Transactions', font: {size: 9}} }
                    }
                }
            });

            // Horizontal Bar Chart: Top Performing States
            const ctxBar = document.getElementById('statesChart').getContext('2d');
            new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ['Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu', 'Rajasthan'],
                    datasets: [{
                        label: 'Volume (In Crores)',
                        data: [68.45, 45.32, 34.25, 28.75, 22.18],
                        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
                        borderRadius: 4,
                        barThickness: 8
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { grid: { borderDash: [2, 2] }, ticks: { font: {size: 10} }, title: {display: true, text: '(In Crores)', font: {size: 9}} },
                        y: { grid: { display: false }, ticks: { font: {size: 10} } }
                    }
                }
            });
        }

        // Run on load
        window.addEventListener('DOMContentLoaded', () => {
            renderKPIs();
            renderTablesAndLists();
            initCharts();
        });
    </script>
</body>
</html>