/**
 * Oxford Suites, Makati — Performance Management Module Controller
 * Handles 7-stage performance cycle, employee lists, goal view/revise/approval,
 * attendance & ratings, monitoring drill-down, and tab pending status guard.
 */

// Central Performance Roster State
window.perfRoster = [
    {
        id: 'emp-1',
        name: 'Maria Santos',
        position: 'Front Desk Host',
        department: 'Front Office',
        avatar: 'MS',
        avatarBg: 'bg-primary',
        attendance: { present: 22, absent: 1, total: 23, percentage: '95.6%' },
        managerRating: 4.6,
        customerRating: 4.8,
        goalsCount: 3,
        planningStatus: 'Approved', // 'Approved' | 'Pending Approval' | 'Draft'
        approvalStatus: 'Approved',
        monitoringProgress: 88,
        monitoringStatus: 'On Track',
        evaluationStatus: 'Rated',
        reviewStatus: 'Calibrated',
        idpStatus: 'Active',
        cycleStatus: 'Q3 Complete',
        goals: [
            {
                id: 'g-101',
                title: 'VIP Guest Check-in Experience & NPS Lift',
                category: 'Front Office & Guest Experience',
                kpi: 'NPS ≥ +92 Score',
                weight: '35% (Core)',
                deliverables: 'Medallia monthly review scores, Opera PMS check-in logs',
                targetDate: 'Aug 30, 2026',
                status: 'Approved'
            },
            {
                id: 'g-102',
                title: 'Fine Dining Upselling & Sommelier Pairing',
                category: 'Food & Beverage Service',
                kpi: '+18% Avg Check Lift',
                weight: '30% (Standard)',
                deliverables: 'Micros POS beverage and reserve vintage weekly reports',
                targetDate: 'Sep 15, 2026',
                status: 'Approved'
            },
            {
                id: 'g-103',
                title: 'HACCP Food Safety & Sanitation Compliance',
                category: 'Culinary & Kitchen Hygiene',
                kpi: '100% Audit Pass (0 Violations)',
                weight: '35% (Core)',
                deliverables: 'Daily cold-chain walk-in temperature logs and QA sign-off',
                targetDate: 'Sep 30, 2026',
                status: 'Approved'
            }
        ]
    },
    {
        id: 'emp-2',
        name: 'Juan Dela Cruz',
        position: 'Senior Concierge',
        department: 'Front Office',
        avatar: 'JC',
        avatarBg: 'bg-blue-600',
        attendance: { present: 23, absent: 0, total: 23, percentage: '100%' },
        managerRating: 4.8,
        customerRating: 4.9,
        goalsCount: 2,
        planningStatus: 'Approved',
        approvalStatus: 'Approved',
        monitoringProgress: 94,
        monitoringStatus: 'Ahead of Target',
        evaluationStatus: 'Rated',
        reviewStatus: 'Calibrated',
        idpStatus: 'Active',
        cycleStatus: 'Q3 Complete',
        goals: [
            {
                id: 'g-201',
                title: 'Executive Lounge Express Dispatch & Airport Transfer',
                category: 'Guest Relations',
                kpi: 'Transfer Turnaround < 10 mins',
                weight: '50%',
                deliverables: 'Lobby dispatch logs & limousine receipt verification',
                targetDate: 'Aug 31, 2026',
                status: 'Approved'
            },
            {
                id: 'g-202',
                title: 'VIP Guest Special Request Response Time',
                category: 'Concierge Protocol',
                kpi: 'Resolution Time < 5 mins',
                weight: '50%',
                deliverables: 'Opera PMS Butler log desk reports',
                targetDate: 'Sep 20, 2026',
                status: 'Approved'
            }
        ]
    },
    {
        id: 'emp-3',
        name: 'Marco Rossi',
        position: 'Executive Sous Chef',
        department: 'Culinary',
        avatar: 'MR',
        avatarBg: 'bg-amber-600',
        attendance: { present: 21, absent: 2, total: 23, percentage: '91.3%' },
        managerRating: 4.7,
        customerRating: 4.6,
        goalsCount: 2,
        planningStatus: 'Pending Approval',
        approvalStatus: 'Pending Approval',
        monitoringProgress: 72,
        monitoringStatus: 'Needs Attention',
        evaluationStatus: 'Pending Evaluation',
        reviewStatus: 'Pending Review',
        idpStatus: 'Pending IDP',
        cycleStatus: 'In Progress',
        goals: [
            {
                id: 'g-301',
                title: 'Banquet Menu Cost Optimization & Plate Margin Lift',
                category: 'Culinary Management',
                kpi: 'Food Cost ≤ 28%',
                weight: '50%',
                deliverables: 'Weekly ingredient yield audit & supplier invoices',
                targetDate: 'Sep 10, 2026',
                status: 'Pending Approval'
            },
            {
                id: 'g-302',
                title: 'Kitchen Staff HACCP Cross-Training Program',
                category: 'Safety & Training',
                kpi: '100% Station Certification',
                weight: '50%',
                deliverables: 'LMS hygiene completion certificates',
                targetDate: 'Sep 25, 2026',
                status: 'Pending Approval'
            }
        ]
    },
    {
        id: 'emp-4',
        name: 'Ana Reyes',
        position: 'F&B Server Lead',
        department: 'Food & Beverage',
        avatar: 'AR',
        avatarBg: 'bg-emerald-600',
        attendance: { present: 20, absent: 3, total: 23, percentage: '87.0%' },
        managerRating: 4.2,
        customerRating: 4.5,
        goalsCount: 2,
        planningStatus: 'Pending Approval',
        approvalStatus: 'Pending Approval',
        monitoringProgress: 65,
        monitoringStatus: 'In Progress',
        evaluationStatus: 'Pending Evaluation',
        reviewStatus: 'Pending Review',
        idpStatus: 'Pending IDP',
        cycleStatus: 'In Progress',
        goals: [
            {
                id: 'g-401',
                title: 'Breakfast Buffet Table Turnaround Efficiency',
                category: 'Restaurant Operations',
                kpi: 'Table Reset Time < 3 mins',
                weight: '60%',
                deliverables: 'Peak shift timing audits by F&B Manager',
                targetDate: 'Sep 05, 2026',
                status: 'Pending Approval'
            },
            {
                id: 'g-402',
                title: 'Beverage Upsell & Specialty Coffee Promotion',
                category: 'Sales & Service',
                kpi: '+15% Coffee Sales',
                weight: '40%',
                deliverables: 'POS daily item sales reports',
                targetDate: 'Sep 28, 2026',
                status: 'Pending Approval'
            }
        ]
    },
    {
        id: 'emp-5',
        name: 'Mark Tan',
        position: 'Housekeeping Supervisor',
        department: 'Housekeeping',
        avatar: 'MT',
        avatarBg: 'bg-indigo-600',
        attendance: { present: 23, absent: 0, total: 23, percentage: '100%' },
        managerRating: 4.9,
        customerRating: 4.7,
        goalsCount: 2,
        planningStatus: 'Approved',
        approvalStatus: 'Approved',
        monitoringProgress: 95,
        monitoringStatus: 'Ahead of Target',
        evaluationStatus: 'Rated',
        reviewStatus: 'Calibrated',
        idpStatus: 'Active',
        cycleStatus: 'Q3 Complete',
        goals: [
            {
                id: 'g-501',
                title: 'Guest Room Deep Cleaning Quality Rating',
                category: 'Housekeeping Quality',
                kpi: 'Inspection Pass ≥ 98%',
                weight: '50%',
                deliverables: 'Daily room inspector audit checklist',
                targetDate: 'Aug 28, 2026',
                status: 'Approved'
            },
            {
                id: 'g-502',
                title: 'Linen Inventory Management & Loss Control',
                category: 'Resource Management',
                kpi: 'Variance < 1.5%',
                weight: '50%',
                deliverables: 'Monthly linen count & laundry log',
                targetDate: 'Sep 18, 2026',
                status: 'Approved'
            }
        ]
    },
    {
        id: 'emp-6',
        name: 'Liza Soberano',
        position: 'Guest Relations Officer',
        department: 'Front Office',
        avatar: 'LS',
        avatarBg: 'bg-purple-600',
        attendance: { present: 22, absent: 1, total: 23, percentage: '95.6%' },
        managerRating: 4.4,
        customerRating: 4.8,
        goalsCount: 2,
        planningStatus: 'Pending Approval',
        approvalStatus: 'Pending Approval',
        monitoringProgress: 78,
        monitoringStatus: 'On Track',
        evaluationStatus: 'Pending Evaluation',
        reviewStatus: 'Pending Review',
        idpStatus: 'Pending IDP',
        cycleStatus: 'In Progress',
        goals: [
            {
                id: 'g-601',
                title: 'VIP Guest Preference Profiling & Loyalty Sign-ups',
                category: 'Guest Loyalty',
                kpi: '+25 New Members / mo',
                weight: '50%',
                deliverables: 'Loyalty system registration logs',
                targetDate: 'Sep 12, 2026',
                status: 'Pending Approval'
            },
            {
                id: 'g-602',
                title: 'Special Occasion In-Room Amenity Delivery',
                category: 'Guest Delight',
                kpi: '100% On-Time Delivery',
                weight: '50%',
                deliverables: 'Guest feedback cards & concierge log',
                targetDate: 'Sep 30, 2026',
                status: 'Pending Approval'
            }
        ]
    }
];

// Active Goal Selected for View / Revise
window.selectedGoalContext = null;
window.selectedEmployeeContext = null;

// Initialize Performance Module
document.addEventListener('DOMContentLoaded', () => {
    initPerformanceViews();
});

function initPerformanceViews() {
    renderPlanningRosterTable();
    renderApprovalRosterTable();
    renderMonitoringRosterTable();
    renderEvaluationRosterTable();
    renderReviewRosterTable();
    renderIDPRosterTable();
    renderCycleRosterTable();
    updateAllPerfStepperBadges();
}

/**
 * -------------------------------------------------------------
 * 1. PLANNING STAGE (Roster View with View/Revise/Approve)
 * -------------------------------------------------------------
 */
function renderPlanningRosterTable() {
    const tbody = document.getElementById('goals-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    window.perfRoster.forEach(emp => {
        const isApproved = emp.planningStatus === 'Approved';
        const statusBadge = isApproved
            ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1 justify-end">
                 <i class="fas fa-check-circle text-emerald-600"></i><span>Approved</span>
               </span>`
            : `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center space-x-1 justify-end">
                 <i class="fas fa-clock text-amber-600"></i><span>Pending Approval</span>
               </span>`;

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50/80 transition text-xs border-b border-slate-100';

        tr.innerHTML = `
            <td class="px-5 py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-2xs flex-shrink-0">
                        ${emp.avatar}
                    </div>
                    <div>
                        <p class="font-bold text-slate-900 text-sm leading-tight">${emp.name}</p>
                        <p class="text-[11px] text-slate-500 font-medium">${emp.position} · <span class="text-primary font-bold">${emp.department}</span></p>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4">
                <div class="space-y-0.5">
                    <span class="font-bold text-slate-800 text-xs block">${emp.attendance.present} Present / ${emp.attendance.absent} Absent</span>
                    <span class="text-[10px] text-slate-500 font-medium">Rate: <strong class="text-emerald-700">${emp.attendance.percentage}</strong></span>
                </div>
            </td>
            <td class="px-5 py-4">
                <div class="space-y-1">
                    <div class="flex items-center space-x-1 text-xs">
                        <span class="text-slate-400 font-semibold text-[10px]">Manager:</span>
                        <span class="font-bold text-slate-900">⭐ ${emp.managerRating.toFixed(1)}</span>
                    </div>
                    <div class="flex items-center space-x-1 text-xs">
                        <span class="text-slate-400 font-semibold text-[10px]">Customer:</span>
                        <span class="font-bold text-amber-600">⭐ ${emp.customerRating.toFixed(1)}</span>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4">
                <div class="space-y-1">
                    <p class="font-bold text-slate-900 text-xs">${emp.goalsCount} KPI Objectives Defined</p>
                    <p class="text-[10px] text-slate-500 truncate max-w-xs">${emp.goals[0] ? emp.goals[0].title : ''}</p>
                </div>
            </td>
            <td class="px-5 py-4 text-right">
                ${statusBadge}
            </td>
            <td class="px-5 py-4 text-right space-x-1 whitespace-nowrap">
                <button onclick="openViewGoalModal('${emp.id}')" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition" title="View Details">
                    <i class="fas fa-eye mr-1"></i>View
                </button>
                <button onclick="openReviseGoalModal('${emp.id}')" class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold transition" title="Revise Objectives">
                    <i class="fas fa-pen-to-square mr-1"></i>Revise
                </button>
                ${!isApproved ? `
                    <button onclick="approveEmployeeGoals('${emp.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition" title="Approve Objective">
                        <i class="fas fa-check mr-1"></i>Approve
                    </button>
                ` : `
                    <span class="px-2.5 py-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 rounded-lg border border-emerald-200">
                        <i class="fas fa-lock mr-1"></i>Locked
                    </span>
                `}
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function approveEmployeeGoals(empId) {
    const emp = window.perfRoster.find(e => e.id === empId);
    if (emp) {
        emp.planningStatus = 'Approved';
        emp.approvalStatus = 'Approved';
        emp.goals.forEach(g => g.status = 'Approved');
        
        renderPlanningRosterTable();
        renderApprovalRosterTable();
        updateAllPerfStepperBadges();

        if (typeof showToast === 'function') {
            showToast(`Approved performance goals for ${emp.name}!`, 'success');
        }
    }
}

function approveAllPendingGoals() {
    let approvedCount = 0;
    window.perfRoster.forEach(emp => {
        if (emp.planningStatus !== 'Approved') {
            emp.planningStatus = 'Approved';
            emp.approvalStatus = 'Approved';
            emp.goals.forEach(g => g.status = 'Approved');
            approvedCount++;
        }
    });

    renderPlanningRosterTable();
    renderApprovalRosterTable();
    updateAllPerfStepperBadges();

    if (typeof showToast === 'function') {
        showToast(`Successfully endorsed and approved all ${approvedCount} pending employee goals!`, 'success');
    }
}

/**
 * View / Revise Modal Actions
 */
function openViewGoalModal(empId) {
    const emp = window.perfRoster.find(e => e.id === empId);
    if (!emp) return;
    window.selectedEmployeeContext = emp;

    document.getElementById('view-modal-emp-name').innerText = emp.name;
    document.getElementById('view-modal-emp-pos').innerText = `${emp.position} · ${emp.department}`;
    document.getElementById('view-modal-attendance').innerText = `${emp.attendance.present} Present / ${emp.attendance.absent} Absent (${emp.attendance.percentage})`;
    document.getElementById('view-modal-mgr-rating').innerText = `⭐ ${emp.managerRating.toFixed(1)} / 5.0`;
    document.getElementById('view-modal-cust-rating').innerText = `⭐ ${emp.customerRating.toFixed(1)} / 5.0`;

    const container = document.getElementById('view-modal-goals-list');
    container.innerHTML = '';

    emp.goals.forEach((g, idx) => {
        const div = document.createElement('div');
        div.className = 'p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs';
        div.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 text-sm">${idx + 1}. ${g.title}</span>
                <span class="px-2 py-0.5 rounded-full font-bold text-[10px] ${g.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                    ${g.status}
                </span>
            </div>
            <p class="text-slate-500 text-[11px]">Category: <strong>${g.category || 'General'}</strong></p>
            <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/80">
                <div>
                    <span class="text-slate-400 block text-[10px]">KPI Formula:</span>
                    <strong class="font-mono text-primary text-xs">${g.kpi}</strong>
                </div>
                <div>
                    <span class="text-slate-400 block text-[10px]">Appraisal Weight:</span>
                    <strong class="text-slate-800 text-xs">${g.weight}</strong>
                </div>
            </div>
            <div class="pt-1 text-[11px] text-slate-600">
                <span>Deliverables & Evidence: <strong>${g.deliverables}</strong></span>
            </div>
        `;
        container.appendChild(div);
    });

    openModal('modal-view-goal');
}

function openReviseGoalModal(empId) {
    const emp = window.perfRoster.find(e => e.id === empId);
    if (!emp) return;
    window.selectedEmployeeContext = emp;

    document.getElementById('revise-modal-emp-name').innerText = emp.name;
    document.getElementById('revise-modal-emp-pos').innerText = `${emp.position} · ${emp.department}`;
    
    // Fill first goal as representative edit target
    const primaryGoal = emp.goals[0] || {};
    document.getElementById('revise-goal-title').value = primaryGoal.title || '';
    document.getElementById('revise-goal-kpi').value = primaryGoal.kpi || '';
    document.getElementById('revise-goal-deliverables').value = primaryGoal.deliverables || '';

    openModal('modal-revise-goal');
}

function saveGoalRevision(event) {
    if (event) event.preventDefault();
    const emp = window.selectedEmployeeContext;
    if (emp && emp.goals[0]) {
        emp.goals[0].title = document.getElementById('revise-goal-title').value;
        emp.goals[0].kpi = document.getElementById('revise-goal-kpi').value;
        emp.goals[0].deliverables = document.getElementById('revise-goal-deliverables').value;
        
        renderPlanningRosterTable();
        closeModal('modal-revise-goal');
        if (typeof showToast === 'function') {
            showToast(`Goal objectives updated for ${emp.name}!`, 'success');
        }
    }
}

/**
 * -------------------------------------------------------------
 * 2. APPROVAL STAGE (Pending Roster View)
 * -------------------------------------------------------------
 */
function renderApprovalRosterTable() {
    const container = document.getElementById('approval-cards-container');
    if (!container) return;

    container.innerHTML = '';
    const pendingStaff = window.perfRoster.filter(e => e.approvalStatus !== 'Approved');

    if (pendingStaff.length === 0) {
        container.innerHTML = `
            <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 col-span-2">
                <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mx-auto font-bold">
                    <i class="fas fa-shield-check"></i>
                </div>
                <h4 class="font-bold text-slate-900 text-sm">All Department Goals Calibrated & Approved!</h4>
                <p class="text-xs text-slate-600">Zero pending goal approvals remaining in Q3 performance planning cycle.</p>
            </div>
        `;
        return;
    }

    pendingStaff.forEach(emp => {
        const div = document.createElement('div');
        div.className = 'p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3';

        div.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg} text-white font-bold text-xs flex items-center justify-center">
                        ${emp.avatar}
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-900 text-sm">${emp.name}</h4>
                        <p class="text-[11px] text-slate-500">${emp.position} · <span class="text-primary font-bold">${emp.department}</span></p>
                    </div>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Awaiting Endorsement
                </span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                <div>
                    <span class="text-slate-400 text-[10px] block">Attendance Score:</span>
                    <span class="font-bold text-slate-800">${emp.attendance.percentage} (${emp.attendance.present}P / ${emp.attendance.absent}A)</span>
                </div>
                <div>
                    <span class="text-slate-400 text-[10px] block">Historical Rating:</span>
                    <span class="font-bold text-amber-600">⭐ ${emp.managerRating.toFixed(1)} Mgr / ⭐ ${emp.customerRating.toFixed(1)} Cust</span>
                </div>
            </div>

            <div class="space-y-1.5 text-xs">
                <span class="font-bold text-slate-800 text-[11px] block">Proposed Objectives (${emp.goalsCount}):</span>
                ${emp.goals.map(g => `
                    <div class="p-2 bg-slate-50/90 rounded-lg text-[11px] flex justify-between items-center border border-slate-100">
                        <span class="font-semibold text-slate-900 truncate pr-2">${g.title}</span>
                        <span class="font-mono text-primary font-bold flex-shrink-0">${g.kpi}</span>
                    </div>
                `).join('')}
            </div>

            <div class="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button onclick="openViewGoalModal('${emp.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
                    View Details
                </button>
                <button onclick="approveEmployeeGoals('${emp.id}')" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1">
                    <i class="fas fa-check"></i><span>Approve & Lock</span>
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}

/**
 * -------------------------------------------------------------
 * 3. MONITORING STAGE (Employee Roster with Position/Dept & Evaluate Action)
 * -------------------------------------------------------------
 */
function renderMonitoringRosterTable() {
    const container = document.getElementById('monitoring-roster-tbody');
    if (!container) return;

    container.innerHTML = '';
    const deptFilter = document.getElementById('filter-monitoring-dept')?.value || 'all';

    let list = window.perfRoster;
    if (deptFilter !== 'all') {
        list = list.filter(e => e.department.toLowerCase() === deptFilter.toLowerCase());
    }

    list.forEach(emp => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition text-xs border-b border-slate-100 cursor-pointer';

        let progressColor = 'bg-emerald-500';
        if (emp.monitoringProgress < 75) progressColor = 'bg-amber-500';
        if (emp.monitoringProgress < 68) progressColor = 'bg-rose-500';

        tr.innerHTML = `
            <td class="px-5 py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg} text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        ${emp.avatar}
                    </div>
                    <div>
                        <p class="font-bold text-slate-900 text-sm leading-tight">${emp.name}</p>
                        <span class="text-[10px] font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">${emp.position}</span>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4">
                <span class="font-semibold text-slate-700">${emp.department}</span>
            </td>
            <td class="px-5 py-4">
                <div class="space-y-0.5">
                    <span class="font-bold text-slate-800 text-xs block">${emp.attendance.present} Present / ${emp.attendance.absent} Absent</span>
                    <span class="text-[10px] text-emerald-700 font-bold">${emp.attendance.percentage} Rate</span>
                </div>
            </td>
            <td class="px-5 py-4">
                <div class="space-y-1">
                    <div class="flex items-center space-x-1.5">
                        <span class="text-slate-400 text-[10px]">Manager:</span>
                        <span class="font-bold text-slate-900">⭐ ${emp.managerRating.toFixed(1)}</span>
                    </div>
                    <div class="flex items-center space-x-1.5">
                        <span class="text-slate-400 text-[10px]">Customer:</span>
                        <span class="font-bold text-amber-600">⭐ ${emp.customerRating.toFixed(1)}</span>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4 min-w-[140px]">
                <div class="space-y-1">
                    <div class="flex justify-between text-[11px] font-bold">
                        <span class="text-slate-700">${emp.monitoringProgress}% Met</span>
                        <span class="text-slate-400">${emp.monitoringStatus}</span>
                    </div>
                    <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div class="${progressColor} h-2 rounded-full transition-all duration-300" style="width: ${emp.monitoringProgress}%"></div>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4 text-right space-x-1 whitespace-nowrap">
                <button onclick="toggleEmployeeMonitoringDetail('${emp.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
                    View Stream
                </button>
                <button onclick="triggerEvaluationForEmployee('${emp.id}')" class="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary-dark transition flex items-center space-x-1 inline-flex">
                    <i class="fas fa-star-half-stroke"></i><span>Evaluate</span>
                </button>
            </td>
        `;

        container.appendChild(tr);
    });
}

function filterMonitoringByDept(dept) {
    const el = document.getElementById('filter-monitoring-dept');
    if (el) el.value = dept;
    renderMonitoringRosterTable();
}

function toggleEmployeeMonitoringDetail(empId) {
    const emp = window.perfRoster.find(e => e.id === empId);
    if (!emp) return;
    
    if (typeof showToast === 'function') {
        showToast(`Loaded continuous monitoring stream for ${emp.name}`, 'info');
    }

    const detailBox = document.getElementById('monitoring-employee-detail-card');
    if (detailBox) {
        document.getElementById('mon-detail-name').innerText = emp.name;
        document.getElementById('mon-detail-pos').innerText = `${emp.position} · ${emp.department}`;
        detailBox.classList.remove('hidden');
        detailBox.scrollIntoView({ behavior: 'smooth' });
    }
}

function triggerEvaluationForEmployee(empId) {
    const emp = window.perfRoster.find(e => e.id === empId);
    if (emp) {
        window.selectedEmployeeContext = emp;
        switchSubTab('perf', 'eval');
        if (typeof showToast === 'function') {
            showToast(`Opened formal appraisal evaluation form for ${emp.name}`, 'info');
        }
    }
}

/**
 * -------------------------------------------------------------
 * 4. STAGES 4, 5, 6, 7 — EMPLOYEE LIST FIRST PATTERN
 * -------------------------------------------------------------
 */
function renderEvaluationRosterTable() {
    const container = document.getElementById('eval-roster-tbody');
    if (!container) return;
    container.innerHTML = '';

    window.perfRoster.forEach(emp => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition text-xs border-b border-slate-100';
        tr.innerHTML = `
            <td class="px-5 py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg} text-white font-bold text-xs flex items-center justify-center">${emp.avatar}</div>
                    <div>
                        <p class="font-bold text-slate-900 text-sm">${emp.name}</p>
                        <p class="text-[11px] text-slate-500">${emp.position} · <span class="text-primary font-bold">${emp.department}</span></p>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4 font-bold text-slate-800">${emp.attendance.present}P / ${emp.attendance.absent}A (${emp.attendance.percentage})</td>
            <td class="px-5 py-4 font-bold text-amber-600">⭐ ${emp.managerRating.toFixed(1)} Mgr / ⭐ ${emp.customerRating.toFixed(1)} Cust</td>
            <td class="px-5 py-4">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${emp.evaluationStatus === 'Rated' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                    ${emp.evaluationStatus}
                </span>
            </td>
            <td class="px-5 py-4 text-right">
                <button onclick="showEmployeeEvalDetail('${emp.id}')" class="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary-dark transition">
                    View Evaluation
                </button>
            </td>
        `;
        container.appendChild(tr);
    });
}

function showEmployeeEvalDetail(empId) {
    const emp = window.perfRoster.find(e => e.id === empId);
    if (!emp) return;
    document.getElementById('eval-roster-list-card')?.classList.add('hidden');
    const detail = document.getElementById('eval-detail-view-card');
    if (detail) {
        document.getElementById('eval-detail-emp-title').innerText = `${emp.name} — Formal Multi-Factor Appraisal`;
        detail.classList.remove('hidden');
        detail.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideEmployeeEvalDetail() {
    document.getElementById('eval-detail-view-card')?.classList.add('hidden');
    document.getElementById('eval-roster-list-card')?.classList.remove('hidden');
}

function renderReviewRosterTable() {
    const container = document.getElementById('review-roster-tbody');
    if (!container) return;
    container.innerHTML = '';

    window.perfRoster.forEach(emp => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition text-xs border-b border-slate-100';
        tr.innerHTML = `
            <td class="px-5 py-4 font-bold text-slate-900">${emp.name} (${emp.position})</td>
            <td class="px-5 py-4 text-slate-600">${emp.department}</td>
            <td class="px-5 py-4 font-bold text-emerald-600 text-sm">⭐ ${(emp.managerRating * 0.95).toFixed(2)} / 5.0</td>
            <td class="px-5 py-4">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${emp.reviewStatus === 'Calibrated' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                    ${emp.reviewStatus}
                </span>
            </td>
            <td class="px-5 py-4 text-right">
                <button onclick="switchSubTab('perf', 'idp')" class="px-3.5 py-1.5 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-xs hover:bg-indigo-700 transition">
                    Calibrate & IDP &rarr;
                </button>
            </td>
        `;
        container.appendChild(tr);
    });
}

function renderIDPRosterTable() {
    const container = document.getElementById('idp-roster-tbody');
    if (!container) return;
    container.innerHTML = '';

    window.perfRoster.forEach(emp => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition text-xs border-b border-slate-100';
        tr.innerHTML = `
            <td class="px-5 py-4 font-bold text-slate-900">${emp.name}</td>
            <td class="px-5 py-4 text-slate-500">${emp.position} · ${emp.department}</td>
            <td class="px-5 py-4 font-bold text-slate-800">70-20-10 Mapped</td>
            <td class="px-5 py-4">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">${emp.idpStatus}</span>
            </td>
            <td class="px-5 py-4 text-right">
                <button onclick="openRemedialBooksModal('maria')" class="px-3 py-1.5 bg-sage-dark text-white rounded-xl text-xs font-bold transition">
                    View IDP Plan
                </button>
            </td>
        `;
        container.appendChild(tr);
    });
}

function renderCycleRosterTable() {
    const container = document.getElementById('cycle-roster-tbody');
    if (!container) return;
    container.innerHTML = '';

    window.perfRoster.forEach(emp => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition text-xs border-b border-slate-100';
        tr.innerHTML = `
            <td class="px-5 py-4 font-bold text-slate-900">${emp.name}</td>
            <td class="px-5 py-4 text-slate-500">${emp.department}</td>
            <td class="px-5 py-4 font-bold text-emerald-700">+14.2% Growth Lift</td>
            <td class="px-5 py-4">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">Ready for Q4 Baseline</span>
            </td>
            <td class="px-5 py-4 text-right">
                <button onclick="switchSubTab('perf', 'plan'); showToast('Initiated Q4 planning cycle for ${emp.name}', 'success');" class="px-3.5 py-1.5 bg-primary text-white font-bold rounded-xl text-xs shadow-xs hover:bg-primary-dark transition">
                    Rollover to Q4
                </button>
            </td>
        `;
        container.appendChild(tr);
    });
}

/**
 * -------------------------------------------------------------
 * 5. STEPPER BADGES & PENDING GUARD NAVIGATION
 * Checks if current tab has pending items & displays ✅ checkmark if clear!
 * -------------------------------------------------------------
 */
function updateAllPerfStepperBadges() {
    const stages = ['plan', 'approve', 'monitor', 'eval', 'review', 'idp', 'cycle'];

    stages.forEach(stageKey => {
        const pendingCount = getStagePendingCount(stageKey);
        const item = document.querySelector(`.perf-step-item[data-step-key="${stageKey}"]`);
        const subnavPill = document.querySelector(`.subnav-perf[data-sub="${stageKey}"]`);

        if (item) {
            const bubble = item.querySelector('.perf-step-bubble');
            const sub = item.querySelector('.perf-step-sub');
            if (bubble) {
                if (pendingCount === 0) {
                    bubble.className = 'perf-step-bubble w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs transition';
                    bubble.innerHTML = '<i class="fas fa-check text-[9px]"></i>';
                    if (sub) sub.innerHTML = '<span class="text-emerald-600 font-bold">✅ Complete</span>';
                } else {
                    bubble.className = 'perf-step-bubble w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs transition';
                    bubble.innerHTML = `<span class="text-[10px]">${pendingCount}</span>`;
                    if (sub) sub.innerHTML = `<span class="text-amber-600 font-bold">${pendingCount} Pending</span>`;
                }
            }
        }

        if (subnavPill) {
            let checkSpan = subnavPill.querySelector('.subnav-status-icon');
            if (!checkSpan) {
                checkSpan = document.createElement('span');
                checkSpan.className = 'subnav-status-icon ml-1.5';
                subnavPill.appendChild(checkSpan);
            }
            if (pendingCount === 0) {
                checkSpan.innerHTML = '<i class="fas fa-check-circle text-emerald-500 text-[11px]" title="Stage Complete"></i>';
            } else {
                checkSpan.innerHTML = `<span class="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[9px] font-bold">${pendingCount}</span>`;
            }
        }
    });
}

function getStagePendingCount(stageKey) {
    if (stageKey === 'plan' || stageKey === 'approve') {
        return window.perfRoster.filter(e => e.approvalStatus !== 'Approved').length;
    }
    if (stageKey === 'eval') {
        return window.perfRoster.filter(e => e.evaluationStatus !== 'Rated').length;
    }
    if (stageKey === 'review') {
        return window.perfRoster.filter(e => e.reviewStatus !== 'Calibrated').length;
    }
    return 0;
}

/**
 * Tab Switch Function - Unrestricted navigation across all 7 stages anytime
 */
window.canSwitchSubTabWithGuard = function(currentStageKey, targetStageKey) {
    return true;
};
