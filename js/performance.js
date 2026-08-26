/**
 * Oxford Suites, Makati — Performance Management Module Controller
 * Handles 7-stage performance cycle, employee lists, goal view/revise/approval,
 * attendance & ratings, monitoring drill-down, and AJAX Fetch integration layer.
 */

// ============================================================================
// 1. PerformanceAPI: AJAX / Fetch Integration Client (Adheres to md/fetchajax.md)
// ============================================================================
const PerformanceAPI = {
    baseUrl: 'api/performance.php',

    async request(action, method = 'GET', payload = null) {
        const url = method === 'GET' && payload
            ? `${this.baseUrl}?action=${action}&${new URLSearchParams(payload)}`
            : `${this.baseUrl}?action=${action}`;

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (payload && method !== 'GET') {
            options.body = JSON.stringify(payload);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Server request failed');
            }
            return result.data;
        } catch (error) {
            console.error(`[PerformanceAPI Error] [${action}]:`, error);
            if (typeof window.showToast === 'function') {
                window.showToast(error.message || 'Network error occurred', 'error');
            }
            throw error;
        }
    },

    // 1. Get Goals List
    getGoals(filters = {}) {
        return this.request('get_goals', 'GET', filters);
    },

    // 2. Set / Create Goal & Insert into DB
    createGoal(data) {
        return this.request('create_goal', 'POST', data);
    },

    // 3. Update Goal Status (Approve / Reject)
    updateGoalStatus(goalId, status, supervisorNotes = null) {
        return this.request('update_goal_status', 'POST', {
            id: goalId,
            status: status,
            supervisor_notes: supervisorNotes
        });
    },

    // 4. Revise / Update Goal Objectives
    reviseGoal(goalId, updates = {}) {
        return this.request('revise_goal', 'POST', {
            id: goalId,
            ...updates
        });
    },

    // 5. Planning Tab Aggregate Data
    getPlanningData(filters = {}) {
        return this.request('get_planning_data', 'GET', filters);
    },

    // 6. Log Shift Milestone & Actual Metric into DB (Supabase)
    logMilestone(data) {
        return this.request('log_milestone', 'POST', data);
    },

    // 7. Dynamic Monitoring Stage Data & Real Staff Roster from Supabase
    getMonitoringData(filters = {}) {
        return this.request('get_monitoring_data', 'GET', filters);
    },

    // 8. General Tasks Matrix (Supervisor Standard Templates)
    getGeneralTasks(filters = {}) {
        return this.request('get_general_tasks', 'GET', filters);
    },

    createGeneralTask(data) {
        return this.request('create_general_task', 'POST', data);
    },

    updateGeneralTask(id, data) {
        return this.request('update_general_task', 'POST', { id, ...data });
    },

    deleteGeneralTask(id) {
        return this.request('delete_general_task', 'POST', { id });
    },

    // 9. Concrete Tasks (General + Specific Checklists & Completion)
    getGoalTasks(filters = {}) {
        return this.request('get_goal_tasks', 'GET', filters);
    },

    createSpecificTask(data) {
        return this.request('create_specific_task', 'POST', data);
    },

    completeTask(taskId, learnings, feedback, completedAt = null) {
        return this.request('complete_task', 'POST', {
            id: taskId,
            employee_learnings: learnings,
            employee_feedback: feedback,
            completed_at: completedAt || new Date().toISOString()
        });
    },

    addSupervisorTaskFeedback(taskId, accomplishment, coachingFeedback) {
        return this.request('add_supervisor_task_feedback', 'POST', {
            id: taskId,
            supervisor_accomplishment: accomplishment,
            supervisor_feedback: coachingFeedback
        });
    }
};

window.PerformanceAPI = PerformanceAPI;
window.dbGoals = [];
window.dbGeneralTasks = [];
window.dbGoalTasks = [];

// Dynamic Performance Roster State strictly matching users with performance goals
window.perfRoster = [
    {
        id: 'emp-101',
        name: 'Maria Santos',
        position: 'Front Desk Host',
        department: 'Front Office & Guest Experience',
        avatar: 'MS',
        avatarBg: 'bg-primary',
        attendance: { present: 22, absent: 1, total: 23, percentage: '95.6%' },
        managerRating: 4.6,
        customerRating: 4.8,
        goalsCount: 3,
        planningStatus: 'Approved',
        approvalStatus: 'Approved',
        monitoringProgress: 88,
        monitoringStatus: 'On Track',
        evaluationStatus: 'Pending Evaluation',
        reviewStatus: 'Pending Review',
        idpStatus: 'Active',
        cycleStatus: 'Q3 Active',
        goals: []
    },
    {
        id: 'emp-102',
        name: 'Chef Marco Rossi',
        position: 'Executive Sous Chef',
        department: 'Culinary & Kitchen Brigade',
        avatar: 'CR',
        avatarBg: 'bg-amber-600',
        attendance: { present: 23, absent: 0, total: 23, percentage: '100%' },
        managerRating: 4.9,
        customerRating: 4.9,
        goalsCount: 1,
        planningStatus: 'Approved',
        approvalStatus: 'Approved',
        monitoringProgress: 95,
        monitoringStatus: 'Exceeding',
        evaluationStatus: 'Pending Evaluation',
        reviewStatus: 'Pending Review',
        idpStatus: 'Active',
        cycleStatus: 'Q3 Active',
        goals: []
    }
];

// Active Goal Selected for View / Revise
window.selectedGoalContext = null;
window.selectedEmployeeContext = null;

// Initialize Performance Module
document.addEventListener('DOMContentLoaded', () => {
    initPerformanceViews();
});

async function initPerformanceViews() {
    await loadAndRenderPlanningGoals();
    renderApprovalRosterTable();
    renderMonitoringRosterTable();
    renderEvaluationRosterTable();
    renderReviewRosterTable();
    renderIDPRosterTable();
    renderCycleRosterTable();
    updateAllPerfStepperBadges();
}

function renderPerformanceSkeletons() {
    const pulseContainer = document.getElementById('emp-pulse-goals-container');
    if (pulseContainer && (!window.dbGoals || window.dbGoals.length === 0)) {
        pulseContainer.innerHTML = Array(3).fill(0).map(() => `
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 animate-pulse">
                <div class="flex items-center justify-between">
                    <div class="h-4 bg-slate-200 rounded-full w-24"></div>
                    <div class="h-3 bg-slate-100 rounded w-16"></div>
                </div>
                <div class="space-y-1.5">
                    <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div class="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-xl space-y-1.5">
                    <div class="h-3 bg-slate-200 rounded w-1/3"></div>
                    <div class="w-full bg-slate-200 h-1.5 rounded-full"></div>
                </div>
                <div class="space-y-1.5 pt-1">
                    <div class="h-9 bg-slate-100 rounded-xl"></div>
                    <div class="h-9 bg-slate-100 rounded-xl"></div>
                </div>
            </div>
        `).join('');
    }

    const goalsTbody = document.getElementById('goals-table-body');
    if (goalsTbody && (!window.dbGoals || window.dbGoals.length === 0)) {
        goalsTbody.innerHTML = Array(3).fill(0).map(() => `
            <tr class="animate-pulse border-b border-slate-100 text-xs">
                <td class="px-5 py-4"><div class="flex items-center space-x-3"><div class="w-9 h-9 rounded-full bg-slate-200"></div><div class="space-y-1.5"><div class="h-3.5 bg-slate-200 rounded w-28"></div><div class="h-2.5 bg-slate-100 rounded w-20"></div></div></div></td>
                <td class="px-5 py-4"><div class="space-y-1"><div class="h-3.5 bg-slate-200 rounded w-36"></div><div class="h-2.5 bg-slate-100 rounded w-20"></div></div></td>
                <td class="px-5 py-4"><div class="h-5 bg-slate-200 rounded w-24"></div></td>
                <td class="px-5 py-4"><div class="h-3.5 bg-slate-200 rounded w-20"></div></td>
                <td class="px-5 py-4"><div class="h-5 bg-slate-100 rounded w-12"></div></td>
                <td class="px-5 py-4"><div class="space-y-1"><div class="h-2.5 bg-slate-200 rounded w-16"></div><div class="w-full bg-slate-200 h-1.5 rounded-full"></div></div></td>
                <td class="px-5 py-4 text-center"><div class="h-5 bg-slate-200 rounded-full w-16 mx-auto"></div></td>
                <td class="px-5 py-4 text-right"><div class="h-7 bg-slate-200 rounded-lg w-20 ml-auto"></div></td>
            </tr>
        `).join('');
    }

    const genTasksTbody = document.getElementById('general-tasks-tbody');
    if (genTasksTbody && (!window.dbGeneralTasks || window.dbGeneralTasks.length === 0)) {
        genTasksTbody.innerHTML = Array(3).fill(0).map(() => `
            <tr class="animate-pulse border-b border-slate-100 text-xs">
                <td class="px-5 py-3.5"><div class="space-y-1"><div class="h-3.5 bg-slate-200 rounded w-36"></div><div class="h-2.5 bg-slate-100 rounded w-20"></div></div></td>
                <td class="px-5 py-3.5"><div class="h-3 bg-slate-100 rounded w-48"></div></td>
                <td class="px-5 py-3.5"><div class="h-3 bg-slate-200 rounded w-16"></div></td>
                <td class="px-5 py-3.5"><div class="h-4 bg-slate-100 rounded-full w-20"></div></td>
                <td class="px-5 py-3.5 text-right"><div class="h-6 bg-slate-200 rounded-lg w-16 ml-auto"></div></td>
            </tr>
        `).join('');
    }

    const tbodies = [
        'approve-goals-tbody',
        'monitoring-roster-tbody',
        'eval-roster-tbody',
        'review-roster-tbody',
        'idp-roster-tbody',
        'cycle-roster-tbody'
    ];

    tbodies.forEach(id => {
        const el = document.getElementById(id);
        if (el && (!window.perfRoster || window.perfRoster.length === 0)) {
            el.innerHTML = Array(3).fill(0).map(() => `
                <tr class="animate-pulse border-b border-slate-100 text-xs">
                    <td class="px-5 py-4"><div class="flex items-center space-x-3"><div class="w-9 h-9 rounded-full bg-slate-200"></div><div class="space-y-1.5"><div class="h-3.5 bg-slate-200 rounded w-32"></div><div class="h-2.5 bg-slate-100 rounded w-24"></div></div></div></td>
                    <td class="px-5 py-4"><div class="h-3.5 bg-slate-200 rounded w-24"></div></td>
                    <td class="px-5 py-4"><div class="h-3.5 bg-slate-200 rounded w-20"></div></td>
                    <td class="px-5 py-4"><div class="h-3.5 bg-slate-200 rounded w-28"></div></td>
                    <td class="px-5 py-4 text-right"><div class="h-6 bg-slate-200 rounded-lg w-20 ml-auto"></div></td>
                </tr>
            `).join('');
        }
    });
}
window.renderPerformanceSkeletons = renderPerformanceSkeletons;

/**
 * -------------------------------------------------------------
 * 1. ASYNC AJAX DATA LOADER & PLANNING STAGE RENDERER
 * -------------------------------------------------------------
 */
async function loadAndRenderPlanningGoals() {
    renderPerformanceSkeletons();
    try {
        // Fetch dynamic monitoring and planning data from Supabase backend
        try {
            const monRes = await PerformanceAPI.getMonitoringData();
            if (monRes && monRes.roster && monRes.roster.length > 0) {
                window.perfRoster = monRes.roster;
            }
        } catch (e) {
            console.warn('Fallback to standard planning goals:', e);
        }

        const data = await PerformanceAPI.getPlanningData();
        const goals = data.goals || [];
        const generalTasks = data.general_tasks || [];
        window.dbGoals = goals;
        window.dbGeneralTasks = generalTasks;

        // Reset goals on local employees
        window.perfRoster.forEach(emp => {
            emp.goals = [];
        });

        // Map DB goals to employees in perfRoster
        goals.forEach(g => {
            const empId = g.employee_id || 'emp-101';
            let emp = window.perfRoster.find(e => e.id === empId || e.id === ('emp-' + empId) || (e.id === 'emp-101' && (empId === 'emp-1' || empId === 'OXF-EMP-1001')) || (e.id === 'emp-102' && (empId === 'emp-2' || empId === 'OXF-SUP-2001')));
            
            if (!emp) {
                const isSup = (g.role === 'Supervisor' || g.role === 'supervisor');
                emp = {
                    id: empId,
                    name: isSup ? 'Chef Marco Rossi' : 'Maria Santos',
                    position: isSup ? 'Executive Sous Chef' : 'Front Desk Host',
                    department: g.department || (isSup ? 'Culinary & F&B' : 'Front Office & Guest Experience'),
                    avatar: isSup ? 'CM' : 'MS',
                    avatarBg: isSup ? 'bg-amber-600' : 'bg-primary',
                    attendance: { present: 23, absent: 0, total: 23, percentage: '100%' },
                    managerRating: 4.8,
                    customerRating: 4.9,
                    goals: []
                };
                window.perfRoster.push(emp);
            }

            if (emp) {
                emp.goals.push({
                    id: g.id,
                    title: g.title,
                    category: g.department,
                    kpi: g.target_metric,
                    weight: g.weight,
                    deliverables: g.evidence || 'Standard shift operational log verification',
                    targetDate: g.target_date,
                    status: g.status || 'Pending Approval',
                    supervisor_notes: g.supervisor_notes,
                    tasks: g.tasks || [],
                    general_tasks: g.general_tasks || [],
                    specific_tasks: g.specific_tasks || [],
                    task_progress: typeof g.task_progress === 'number' ? g.task_progress : (g.total_tasks ? Math.round((g.completed_tasks / g.total_tasks) * 100) : 0),
                    created_at: g.created_at
                });
            }
        });

        // Recalculate employee counts & status
        window.perfRoster.forEach(emp => {
            emp.goalsCount = emp.goals.length;
            const hasPending = emp.goals.some(g => g.status !== 'Approved');
            emp.planningStatus = hasPending ? 'Pending Approval' : (emp.goals.length > 0 ? 'Approved' : 'Draft');
            emp.approvalStatus = emp.planningStatus;
        });

        // Update Planning Hero KPI Cards
        const activeTargetsEl = document.getElementById('perf-plan-active-targets');
        if (activeTargetsEl) {
            activeTargetsEl.textContent = `${data.total_goals || goals.length} Active Targets`;
        }
        const weightAllocEl = document.getElementById('perf-plan-weight-alloc');
        if (weightAllocEl) {
            weightAllocEl.textContent = `${data.calibration || '100%'} Calibrated`;
        }

        // Render tables & employee dashboard views
        renderPlanningRosterTable();
        renderApprovalRosterTable();
        renderGeneralTasksTable();
        renderEmployeePulseGoals(goals);
        updateAllPerfStepperBadges();

    } catch (err) {
        console.warn('Fallback to local state rendering:', err);
        renderPlanningRosterTable();
        renderGeneralTasksTable();
        renderEmployeePulseGoals(window.dbGoals || []);
    }
}

/**
 * Render Employee's self-set objectives in "Shift Focus & My Pulse" with Task Checklists
 */
function renderEmployeePulseGoals(goals) {
    const container = document.getElementById('emp-pulse-goals-container');
    const countBadge = document.getElementById('emp-pulse-goals-count');
    if (!container) return;

    const allGoals = (goals && goals.length > 0) ? goals : (window.dbGoals || []);

    const userObj = window.currentUser || JSON.parse(localStorage.getItem('oxford_session_user') || '{}');
    const currentUserId = userObj.id || userObj.employee_code || 'emp-101';
    const currentRole = window.activePersonaRole || userObj.role || 'Associate';
    const isAssociate = (currentRole.toLowerCase() === 'associate' || currentRole.toLowerCase() === 'employee' || (typeof activePersonaKey !== 'undefined' && (activePersonaKey === 'associate' || activePersonaKey === 'employee')));
    
    let empGoals = allGoals.filter(g => {
        if (isAssociate) {
            return !g.employee_id || g.employee_id === 'emp-101' || g.employee_id === 'emp-1' || g.employee_id === 'OXF-EMP-1001' || g.employee_id === currentUserId || g.role === 'employee' || g.role === 'Associate';
        } else {
            return g.employee_id === currentUserId || g.employee_id === 'emp-102' || g.role === 'supervisor' || g.role === 'Supervisor';
        }
    });

    if (empGoals.length === 0 && allGoals.length > 0) {
        empGoals = allGoals;
    }

    if (countBadge) {
        countBadge.textContent = `${empGoals.length} Objective${empGoals.length === 1 ? '' : 's'}`;
    }

    const kpiGoalsRatio = document.getElementById('kpi-goals-ratio');
    if (kpiGoalsRatio) {
        const approvedCount = empGoals.filter(g => g.status === 'Approved').length;
        kpiGoalsRatio.textContent = `${approvedCount} of ${empGoals.length || 1} Done`;
    }

    // Check Pending Goals Limit (Max 2 Pending allowed for Employee)
    const pendingGoals = empGoals.filter(g => g.status !== 'Approved');
    const isBlockedFromSettingGoal = isAssociate && pendingGoals.length >= 2;

    const setGoalBtns = document.querySelectorAll('#btn-open-set-goal-overview, #btn-open-set-goal-perf, [data-action="set-goal"]');
    setGoalBtns.forEach(btn => {
        if (isBlockedFromSettingGoal) {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
            btn.setAttribute('title', 'Max 2 pending objectives allowed at a time. Please wait for supervisor approval.');
        } else {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
            btn.removeAttribute('title');
        }
    });

    if (empGoals.length === 0) {
        container.innerHTML = `
            <div class="col-span-full p-6 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                <div class="w-10 h-10 rounded-full bg-primary-50 text-primary flex items-center justify-center text-base mx-auto">
                    <i class="fas fa-bullseye"></i>
                </div>
                <h4 class="font-bold text-slate-800 text-xs">No Performance Objectives Set Yet</h4>
                <p class="text-[11px] text-slate-500 max-w-sm mx-auto">Draft your shift targets for Q3. Once submitted, your supervisor will review and calibrate them.</p>
                <button onclick="openModal('modal-create-goal')" ${isBlockedFromSettingGoal ? 'disabled' : ''} class="btn-primary px-3 py-1.5 text-xs font-bold inline-flex items-center space-x-1.5 shadow-2xs ${isBlockedFromSettingGoal ? 'opacity-50 cursor-not-allowed' : ''}">
                    <i class="fas fa-plus text-[10px]"></i>
                    <span>Set First Goal</span>
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = empGoals.map(g => {
        const isApproved = g.status === 'Approved';
        const isRevised = !!g.supervisor_notes || (g.updated_at && g.created_at && g.updated_at !== g.created_at);

        const tasks = g.tasks || [];
        const generalTasks = tasks.filter(t => t.task_type === 'general');
        const specificTasks = tasks.filter(t => t.task_type === 'specific');
        const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
        const totalTasksCount = tasks.length;
        const progressPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : (isApproved ? 50 : 0);

        return `
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between hover:border-primary/40 transition">
                <div class="space-y-2">
                    <div class="flex items-center justify-between gap-2 flex-wrap">
                        <div class="flex items-center space-x-1.5">
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-bold ${isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} flex items-center space-x-1">
                                <i class="fas ${isApproved ? 'fa-check-circle text-emerald-600' : 'fa-clock text-amber-600'}"></i>
                                <span>${g.status || 'Pending Approval'}</span>
                            </span>
                            ${isRevised ? `<span class="px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center space-x-0.5"><i class="fas fa-pen-to-square text-[7px]"></i><span>Revised</span></span>` : ''}
                        </div>
                        <span class="text-[10px] text-slate-400 font-mono">Target: ${g.target_date || 'Q3 2026'}</span>
                    </div>

                    <div>
                        <h4 class="font-bold text-slate-900 text-xs leading-snug">${g.title}</h4>
                        <p class="text-[10px] text-slate-500">${g.department || 'Front Office'}</p>
                    </div>

                    <!-- Dynamic Goal Progress based on Task Checklists -->
                    <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                        <div class="flex items-center justify-between text-[10px] font-bold">
                            <span class="text-slate-700 flex items-center space-x-1">
                                <i class="fas fa-chart-line text-primary text-[9px]"></i>
                                <span>Goal Progress Achieved</span>
                            </span>
                            <span class="font-mono text-primary">${progressPct}% (${completedTasksCount}/${totalTasksCount || 1} Done)</span>
                        </div>
                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div class="${progressPct >= 100 ? 'bg-emerald-500' : 'bg-primary'} h-1.5 rounded-full transition-all duration-500" style="width: ${progressPct}%"></div>
                        </div>
                    </div>

                    <!-- Action Checklists Section -->
                    <div class="space-y-2 pt-1">
                        <!-- General Tasks Checklist -->
                        <div class="space-y-1">
                            <div class="flex items-center justify-between text-[10px] font-bold text-slate-700">
                                <span class="flex items-center space-x-1">
                                    <i class="fas fa-list-check text-primary text-[9px]"></i>
                                    <span>General SOP Checklist (${generalTasks.filter(t => t.status === 'completed').length}/${generalTasks.length}):</span>
                                </span>
                            </div>
                            <div class="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-0.5">
                                ${generalTasks.length > 0 ? generalTasks.map(t => {
                                    const isDone = t.status === 'completed';
                                    const completedDateStr = t.completed_at ? new Date(t.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                                    return `
                                        <div class="p-2.5 rounded-xl border ${isDone ? 'bg-emerald-50/60 border-emerald-200/90 text-emerald-950 shadow-2xs' : 'bg-white border-slate-200 text-slate-800 hover:border-emerald-300'} text-[11px] space-y-1.5 transition">
                                            <div class="flex items-start justify-between gap-2">
                                                <label class="flex items-start space-x-2.5 cursor-pointer flex-1 select-none">
                                                    <input type="checkbox" ${isDone ? 'checked disabled' : `onchange="triggerTaskCompletionModal('${t.id}', '${g.id}', this)"`} class="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                                                    <span class="${isDone ? 'line-through text-slate-500 font-medium' : 'font-semibold text-slate-900'} leading-snug">${t.title}</span>
                                                </label>
                                                <div class="flex items-center space-x-1.5 flex-shrink-0">
                                                    ${isDone ? `
                                                        <span class="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                                                            ✓ Done ${completedDateStr ? `(${completedDateStr})` : ''}
                                                        </span>
                                                    ` : `
                                                        <button type="button" onclick="openCompleteTaskModal('${t.id}', '${g.id}')" class="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition inline-flex items-center space-x-1 shadow-2xs" title="Click to log reflections and complete task">
                                                            <i class="fas fa-feather-pointed text-[8px]"></i>
                                                            <span>Log Experience</span>
                                                        </button>
                                                        <span class="text-[9px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                                            Due: ${t.target_date}
                                                        </span>
                                                    `}
                                                </div>
                                            </div>
                                            ${t.employee_learnings ? `
                                                <div class="text-[10px] text-slate-700 bg-white p-2 rounded-lg border border-emerald-100 space-y-0.5 shadow-2xs">
                                                    <span class="font-bold text-emerald-900 text-[9px] flex items-center space-x-1">
                                                        <i class="fas fa-lightbulb text-emerald-600"></i><span>Learnings &amp; Growth Logged:</span>
                                                    </span>
                                                    <p class="italic text-slate-700 line-clamp-2">"${t.employee_learnings}"</p>
                                                </div>
                                            ` : ''}
                                        </div>
                                    `;
                                }).join('') : `<p class="text-[10px] text-slate-400 italic py-1">No general checklist assigned.</p>`}
                            </div>
                        </div>                        <!-- Specific Tasks Checklist -->
                        <div class="space-y-1 pt-1">
                            <div class="flex items-center justify-between text-[10px] font-bold text-slate-700">
                                <span class="flex items-center space-x-1">
                                    <i class="fas fa-bullseye text-purple-600 text-[9px]"></i>
                                    <span>Specific Action Tasks (${specificTasks.filter(t => t.status === 'completed').length}/${specificTasks.length}):</span>
                                </span>
                            </div>
                            <div class="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-0.5">
                                ${specificTasks.length > 0 ? specificTasks.map(t => {
                                    const isDone = t.status === 'completed';
                                    const completedDateStr = t.completed_at ? new Date(t.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                                    return `
                                        <div class="p-2.5 rounded-xl border ${isDone ? 'bg-emerald-50/60 border-emerald-200/90 text-emerald-950 shadow-2xs' : 'bg-purple-50/30 border-purple-200 text-slate-800 hover:border-purple-300'} text-[11px] space-y-1.5 transition">
                                            <div class="flex items-start justify-between gap-2">
                                                <label class="flex items-start space-x-2.5 cursor-pointer flex-1 select-none">
                                                    <input type="checkbox" ${isDone ? 'checked disabled' : `onchange="triggerTaskCompletionModal('${t.id}', '${g.id}', this)"`} class="mt-0.5 w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer">
                                                    <span class="${isDone ? 'line-through text-slate-500 font-medium' : 'font-semibold text-slate-900'} leading-snug">${t.title}</span>
                                                </label>
                                                <div class="flex items-center space-x-1.5 flex-shrink-0">
                                                    ${isDone ? `
                                                        <span class="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                                                            ✓ Done ${completedDateStr ? `(${completedDateStr})` : ''}
                                                        </span>
                                                    ` : `
                                                        <button type="button" onclick="openCompleteTaskModal('${t.id}', '${g.id}')" class="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-100/80 hover:bg-purple-200 text-purple-900 border border-purple-200 transition inline-flex items-center space-x-1 shadow-2xs" title="Click to log reflections and complete task">
                                                            <i class="fas fa-feather-pointed text-[8px]"></i>
                                                            <span>Log Experience</span>
                                                        </button>
                                                        <span class="text-[9px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                                                            Due: ${t.target_date}
                                                        </span>
                                                    `}
                                                </div>
                                            </div>
                                            ${t.employee_learnings ? `
                                                <div class="text-[10px] text-slate-700 bg-white p-2 rounded-lg border border-purple-100 space-y-0.5 shadow-2xs">
                                                    <span class="font-bold text-purple-900 text-[9px] flex items-center space-x-1">
                                                        <i class="fas fa-award text-purple-600"></i><span>Learnings &amp; Growth Logged:</span>
                                                    </span>
                                                    <p class="italic text-slate-700 line-clamp-2">"${t.employee_learnings}"</p>
                                                </div>
                                            ` : ''}
                                        </div>
                                    `;
                                }).join('') : `<p class="text-[10px] text-slate-400 italic py-1">No specific tasks created yet.</p>`}
                            </div>
                        </div>
                    </div>

                    ${g.supervisor_notes ? `
                        <div class="p-2 bg-purple-50/80 rounded-xl border border-purple-100 text-[10px] text-purple-900 space-y-0.5">
                            <span class="font-bold text-purple-800 flex items-center space-x-1">
                                <i class="fas fa-user-tie text-[9px]"></i><span>Supervisor Note:</span>
                            </span>
                            <p class="italic text-purple-950">${g.supervisor_notes}</p>
                        </div>
                    ` : ''}
                </div>

                <!-- Footer row -->
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span class="font-bold font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">${g.target_metric}</span>
                    <div class="flex items-center space-x-1.5">
                        <span class="text-[10px] text-slate-400 mr-1">${g.weight ? g.weight.split(' ')[0] : '20%'}</span>
                        <button onclick="openViewGoalModal('${g.id}')" class="text-slate-700 hover:text-slate-900 text-[10px] font-bold inline-flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 py-0.5 rounded-md transition shadow-2xs" title="View Full Details & Checklist">
                            <i class="fas fa-eye text-[9px] text-slate-500"></i>
                            <span>View</span>
                        </button>
                        <button onclick="openReviseGoalModal('${g.id}')" class="text-amber-700 hover:text-amber-900 text-[10px] font-bold inline-flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md transition shadow-2xs" title="Edit Objective">
                            <i class="fas fa-pen-to-square text-[9px]"></i>
                            <span>Edit</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
window.renderEmployeePulseGoals = renderEmployeePulseGoals;
window.loadAndRenderPlanningGoals = loadAndRenderPlanningGoals;

// ============================================================================
// Pagination State & Controllers
// ============================================================================
let planningCurrentPage = 1;
const planningPageSize = 5;
let generalTasksCurrentPage = 1;
const generalTasksPageSize = 5;
let monitoringCurrentPage = 1;
const monitoringPageSize = 5;

function setPlanningPage(page) {
    planningCurrentPage = page;
    renderPlanningRosterTable();
}
window.setPlanningPage = setPlanningPage;

function setGeneralTasksPage(page) {
    generalTasksCurrentPage = page;
    renderGeneralTasksTable();
}
window.setGeneralTasksPage = setGeneralTasksPage;

function setMonitoringPage(page) {
    monitoringCurrentPage = page;
    renderMonitoringRosterTable();
}
window.setMonitoringPage = setMonitoringPage;

function renderPaginationControls(containerId, currentPage, totalItems, pageSize, onPageFnName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    if (totalItems <= pageSize) {
        container.innerHTML = `
            <span class="text-slate-400 text-[11px]">Showing all ${totalItems} items</span>
            <div class="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">Page 1 of 1</div>
        `;
        return;
    }

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    let html = `
        <span class="text-slate-500 text-[11px]">Showing <strong>${startItem}-${endItem}</strong> of <strong>${totalItems}</strong> entries</span>
        <div class="flex items-center space-x-1.5">
            <button onclick="${onPageFnName}(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-bold transition flex items-center space-x-1 shadow-2xs">
                <i class="fas fa-chevron-left text-[9px]"></i><span>Prev</span>
            </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <button onclick="${onPageFnName}(${i})" class="w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${i === currentPage ? 'bg-primary text-white shadow-xs' : 'border border-slate-200 text-slate-700 hover:bg-slate-100'}">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="px-1 text-slate-400 text-xs">...</span>`;
        }
    }

    html += `
            <button onclick="${onPageFnName}(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-bold transition flex items-center space-x-1 shadow-2xs">
                <span>Next</span><i class="fas fa-chevron-right text-[9px]"></i>
            </button>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * -------------------------------------------------------------
 * 2. PLANNING STAGE (Defined Objectives, KPIs & Expected Outputs)
 * -------------------------------------------------------------
 */
function renderPlanningRosterTable() {
    const tbody = document.getElementById('goals-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    const allGoals = window.dbGoals || [];

    if (allGoals.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="p-8 text-center text-slate-400">
                    <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-2 text-slate-300">
                        <i class="fas fa-bullseye text-xl"></i>
                    </div>
                    <p class="font-bold text-slate-700 text-xs">No Performance Objectives Found</p>
                    <p class="text-[11px] text-slate-400">Click "Define New Objective" to create baseline goals for your team.</p>
                </td>
            </tr>
        `;
        renderPaginationControls('planning-pagination-container', 1, 0, planningPageSize, 'setPlanningPage');
        return;
    }

    const totalPages = Math.ceil(allGoals.length / planningPageSize);
    if (planningCurrentPage > totalPages) {
        planningCurrentPage = totalPages;
    }
    if (planningCurrentPage < 1) {
        planningCurrentPage = 1;
    }

    const startIdx = (planningCurrentPage - 1) * planningPageSize;
    const pageGoals = allGoals.slice(startIdx, startIdx + planningPageSize);

    // List paginated live objectives from Supabase
    pageGoals.forEach((goal, index) => {
        let emp = window.perfRoster.find(e => e.id === goal.employee_id || (e.id === 'emp-101' && (goal.employee_id === 'emp-1' || goal.employee_id === 'OXF-EMP-1001')) || (e.id === 'emp-102' && (goal.employee_id === 'emp-2' || goal.employee_id === 'OXF-SUP-2001')));
        if (!emp) {
            const isSup = (goal.role === 'Supervisor' || goal.role === 'supervisor');
            emp = {
                id: goal.employee_id || (isSup ? 'emp-102' : 'emp-101'),
                name: isSup ? 'Chef Marco Rossi' : 'Maria Santos',
                position: isSup ? 'Executive Sous Chef' : 'Front Desk Host',
                department: goal.department || (isSup ? 'Culinary & F&B' : 'Front Office & Guest Experience'),
                avatar: isSup ? 'CM' : 'MS',
                avatarBg: isSup ? 'bg-amber-600' : 'bg-primary'
            };
        }
        const isApproved = goal.status === 'Approved';
        const isRevised = !!goal.supervisor_notes || (goal.updated_at && goal.created_at && goal.updated_at !== goal.created_at);

        const tr = document.createElement('tr');
        tr.className = `hover:bg-slate-50/80 transition text-xs border-b border-slate-100 ${index === 0 ? 'bg-emerald-50/10' : ''}`;

        const tasks = goal.tasks || [];
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const totalTasks = tasks.length;
        const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (isApproved ? 50 : 0);

        tr.innerHTML = `
            <!-- 1. Employee Column -->
            <td class="px-5 py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg || 'bg-primary'} text-white font-bold text-xs flex items-center justify-center shadow-2xs flex-shrink-0">
                        ${emp.avatar || emp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-bold text-slate-900 text-xs leading-tight">${emp.name}</p>
                        <p class="text-[10px] text-slate-500 font-medium">${emp.position}</p>
                    </div>
                </div>
            </td>

            <!-- 2. Objective & Scope -->
            <td class="px-5 py-4">
                <div class="space-y-1 max-w-[240px]">
                    <div class="flex items-center space-x-1.5 flex-wrap">
                        <p class="font-bold text-slate-900 text-xs leading-snug">${goal.title}</p>
                        ${isRevised ? `<span class="px-1.5 py-0.2 rounded text-[8px] font-bold bg-purple-100 text-purple-700 border border-purple-200">Edited</span>` : ''}
                    </div>
                    <span class="text-[10px] font-bold text-primary bg-primary-50 px-2 py-0.5 rounded inline-block">${goal.department || emp.department}</span>
                </div>
            </td>

            <!-- 3. Target Metric / KPI -->
            <td class="px-5 py-4">
                <span class="text-primary font-bold font-mono text-[11px] bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 block w-fit">
                    ${goal.target_metric}
                </span>
            </td>

            <!-- 4. Target Date -->
            <td class="px-5 py-4 whitespace-nowrap">
                <span class="text-slate-700 font-mono text-xs font-semibold">
                    ${goal.target_date || 'Q3 2026'}
                </span>
            </td>

            <!-- 5. Weight -->
            <td class="px-5 py-4 whitespace-nowrap">
                <span class="text-slate-700 font-bold text-[11px] bg-slate-100 px-2 py-1 rounded-lg">
                    ${goal.weight ? goal.weight.split(' ')[0] : '20%'}
                </span>
            </td>

            <!-- 6. Checklist Progress -->
            <td class="px-5 py-4 min-w-[140px]">
                <div class="space-y-1">
                    <div class="flex items-center justify-between text-[10px] font-bold">
                        <span class="text-slate-600">${completedTasks}/${totalTasks} Done</span>
                        <span class="text-primary font-mono">${taskProgress}%</span>
                    </div>
                    <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div class="${taskProgress >= 100 ? 'bg-emerald-500' : 'bg-primary'} h-1.5 rounded-full transition-all duration-300" style="width: ${taskProgress}%"></div>
                    </div>
                </div>
            </td>

            <!-- 7. Status Badge (Pending / Approved) -->
            <td class="px-5 py-4 text-center whitespace-nowrap">
                ${isApproved ? `
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center space-x-1">
                        <i class="fas fa-check-circle text-emerald-600 text-[9px]"></i><span>Approved</span>
                    </span>
                ` : `
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 inline-flex items-center space-x-1">
                        <i class="fas fa-clock text-amber-600 text-[9px]"></i><span>Pending</span>
                    </span>
                `}
            </td>

            <!-- 8. Actions (Compact Icon Buttons with Tooltips) -->
            <td class="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                <button onclick="openViewGoalModal('${goal.id || emp.id}')" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center justify-center transition shadow-2xs" title="View Full Details & Checklist">
                    <i class="fas fa-eye text-xs"></i>
                </button>
                <button onclick="openReviseGoalModal('${goal.id || emp.id}')" class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center justify-center transition shadow-2xs" title="Edit / Revise Objective">
                    <i class="fas fa-pen-to-square text-xs"></i>
                </button>
                ${!isApproved ? `
                    <button onclick="approveGoalViaAPI('${goal.id}', '${emp.id}', this)" class="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center justify-center shadow-xs transition" title="Approve Objective">
                        <i class="fas fa-check text-xs"></i>
                    </button>
                ` : `
                    <span class="w-7 h-7 rounded-lg text-emerald-700 bg-emerald-50 border border-emerald-200 inline-flex items-center justify-center text-xs" title="Objective Approved & Locked">
                        <i class="fas fa-lock"></i>
                    </span>
                `}
            </td>
        `;

        tbody.appendChild(tr);
    });

    renderPaginationControls('planning-pagination-container', planningCurrentPage, allGoals.length, planningPageSize, 'setPlanningPage');
}
window.renderPlanningRosterTable = renderPlanningRosterTable;

/**
 * -------------------------------------------------------------
 * 2B. GENERAL TASKS MATRIX TABLE & CRUD CONTROLLER (Supervisor Hub)
 * -------------------------------------------------------------
 */
function renderGeneralTasksTable() {
    const tbody = document.getElementById('general-tasks-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const tasks = window.dbGeneralTasks || [];

    if (tasks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="p-8 text-center bg-white text-slate-500 text-xs">
                    <i class="fas fa-clipboard-list text-slate-400 text-xl mb-2 block"></i>
                    No general tasks defined yet. Click "Add General Task" to add standard checklist items.
                </td>
            </tr>
        `;
        renderPaginationControls('general-tasks-pagination-container', 1, 0, generalTasksPageSize, 'setGeneralTasksPage');
        return;
    }

    const totalPages = Math.ceil(tasks.length / generalTasksPageSize);
    if (generalTasksCurrentPage > totalPages) {
        generalTasksCurrentPage = totalPages;
    }
    if (generalTasksCurrentPage < 1) {
        generalTasksCurrentPage = 1;
    }

    const startIdx = (generalTasksCurrentPage - 1) * generalTasksPageSize;
    const pageTasks = tasks.slice(startIdx, startIdx + generalTasksPageSize);

    pageTasks.forEach(t => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50/80 transition text-xs border-b border-slate-100';

        tr.innerHTML = `
            <td class="px-5 py-3.5">
                <div class="space-y-1">
                    <p class="font-bold text-slate-900 text-xs">${t.title}</p>
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary">${t.category || 'Operational Excellence'}</span>
                </div>
            </td>
            <td class="px-5 py-3.5 max-w-sm">
                <p class="text-slate-600 text-[11px] leading-relaxed">${t.description || 'Standard hotel operating guideline verification.'}</p>
            </td>
            <td class="px-5 py-3.5">
                <span class="font-mono font-bold text-slate-800 text-[11px]">-${t.target_days_offset || 7} Days</span>
                <span class="text-[10px] text-slate-400 block">before goal target date</span>
            </td>
            <td class="px-5 py-3.5">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">${t.weight || 'Standard'}</span>
            </td>
            <td class="px-5 py-3.5 text-right space-x-1 whitespace-nowrap">
                <button onclick="openEditGeneralTaskModal('${t.id}')" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition">
                    <i class="fas fa-edit mr-1"></i>Edit
                </button>
                <button onclick="deleteGeneralTask('${t.id}', this)" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition">
                    <i class="fas fa-trash mr-1"></i>Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    renderPaginationControls('general-tasks-pagination-container', generalTasksCurrentPage, tasks.length, generalTasksPageSize, 'setGeneralTasksPage');
}
window.renderGeneralTasksTable = renderGeneralTasksTable;

function openCreateGeneralTaskModal() {
    document.getElementById('general-task-id').value = '';
    document.getElementById('general-task-title').value = '';
    document.getElementById('general-task-desc').value = '';
    document.getElementById('general-task-category').value = 'Operational Excellence';
    document.getElementById('general-task-days-offset').value = '7';
    document.getElementById('general-task-weight').value = 'Standard';
    document.getElementById('general-task-modal-badge').textContent = 'General Task Matrix';
    document.getElementById('general-task-modal-title').textContent = 'Add Standard General Task';
    openModal('modal-general-task');
}
window.openCreateGeneralTaskModal = openCreateGeneralTaskModal;

function openEditGeneralTaskModal(id) {
    const task = (window.dbGeneralTasks || []).find(t => t.id === id);
    if (!task) return;

    document.getElementById('general-task-id').value = task.id;
    document.getElementById('general-task-title').value = task.title || '';
    document.getElementById('general-task-desc').value = task.description || '';
    document.getElementById('general-task-category').value = task.category || 'Operational Excellence';
    document.getElementById('general-task-days-offset').value = task.target_days_offset || 7;
    document.getElementById('general-task-weight').value = task.weight || 'Standard';
    document.getElementById('general-task-modal-badge').textContent = 'Update Template';
    document.getElementById('general-task-modal-title').textContent = 'Edit General Task';
    openModal('modal-general-task');
}
window.openEditGeneralTaskModal = openEditGeneralTaskModal;

async function handleGeneralTaskSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const id = document.getElementById('general-task-id')?.value;
    const title = document.getElementById('general-task-title')?.value.trim();
    const description = document.getElementById('general-task-desc')?.value.trim();
    const category = document.getElementById('general-task-category')?.value;
    const daysOffset = parseInt(document.getElementById('general-task-days-offset')?.value || '7', 10);
    const weight = document.getElementById('general-task-weight')?.value;

    if (!title) {
        if (typeof showToast === 'function') showToast('Task title is required.', 'error');
        return;
    }

    const payload = {
        title,
        description,
        category,
        target_days_offset: daysOffset,
        weight
    };

    const submitBtn = document.getElementById('btn-save-general-task');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Saving Template...</span>';
    }

    try {
        if (id) {
            await PerformanceAPI.updateGeneralTask(id, payload);
            if (typeof showToast === 'function') showToast('General task updated successfully!', 'success');
        } else {
            await PerformanceAPI.createGeneralTask(payload);
            if (typeof showToast === 'function') showToast('General task added to matrix and assigned to active goals!', 'success');
        }
        closeModal('modal-general-task');
        await loadAndRenderPlanningGoals();
    } catch (err) {
        console.error('General task save error:', err);
        if (typeof showToast === 'function') showToast(err.message || 'Failed to save general task.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
        }
    }
}
window.handleGeneralTaskSubmit = handleGeneralTaskSubmit;

async function deleteGeneralTask(id, btnEl) {
    if (!confirm('Are you sure you want to remove this general task from the matrix?')) return;

    let origHtml = '';
    if (btnEl) {
        origHtml = btnEl.innerHTML;
        btnEl.disabled = true;
        btnEl.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Deleting...';
    }

    try {
        await PerformanceAPI.deleteGeneralTask(id);
        if (typeof showToast === 'function') showToast('General task removed from matrix.', 'success');
        await loadAndRenderPlanningGoals();
    } catch (err) {
        console.error('Delete general task error:', err);
        if (typeof showToast === 'function') showToast(err.message || 'Failed to delete general task.', 'error');
        if (btnEl) {
            btnEl.disabled = false;
            btnEl.innerHTML = origHtml;
        }
    }
}
window.deleteGeneralTask = deleteGeneralTask;

/**
 * -------------------------------------------------------------
 * 2C. SPECIFIC TASK MODAL & MULTI-TASK BUILDER HANDLERS
 * -------------------------------------------------------------
 */
function addSpecificTaskRow(initialData = {}) {
    const container = document.getElementById('specific-tasks-rows-container');
    if (!container) return;

    const goalDateVal = document.getElementById('specific-task-goal-target-date')?.value;
    let defaultTaskDate = initialData.target_date || '';
    if (!defaultTaskDate && goalDateVal) {
        const goalTime = new Date(goalDateVal).getTime();
        const defaultTaskTime = new Date(goalTime - (3 * 86400000));
        defaultTaskDate = defaultTaskTime.toISOString().split('T')[0];
    } else if (!defaultTaskDate) {
        defaultTaskDate = new Date().toISOString().split('T')[0];
    }

    const rowId = 'spec-task-row-' + Math.random().toString(36).substring(2, 9);
    const rowEl = document.createElement('div');
    rowEl.id = rowId;
    rowEl.className = 'specific-task-item-row p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-2.5 transition relative group';

    rowEl.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="font-bold text-slate-800 text-[11px] flex items-center space-x-1.5 specific-task-row-index">
                <span class="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">1</span>
                <span>Action Task Item</span>
            </span>
            <button type="button" onclick="removeSpecificTaskRow('${rowId}')" class="btn-remove-task-row text-slate-400 hover:text-rose-600 text-xs transition p-1" title="Remove this task field">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>

        <div class="space-y-1">
            <input type="text" class="task-row-title w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none bg-white" placeholder="Specific Task Title (e.g. Sommelier Pairing Practice Drill)" value="${initialData.title || ''}" required>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div class="space-y-1">
                <label class="font-bold text-slate-600 text-[10px]">Due Date * (Must be on/before goal target)</label>
                <input type="date" class="task-row-date w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none bg-white" value="${defaultTaskDate}" onchange="validateSpecificTaskRowDate(this)" required>
            </div>
            <div class="space-y-1">
                <label class="font-bold text-slate-600 text-[10px]">Task Instructions / Criteria</label>
                <input type="text" class="task-row-desc w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none bg-white" placeholder="e.g. Shadow Chef Marco on dinner shift" value="${initialData.description || ''}">
            </div>
        </div>
    `;

    container.appendChild(rowEl);
    updateSpecificTaskRowsIndexes();
}
window.addSpecificTaskRow = addSpecificTaskRow;

function removeSpecificTaskRow(rowId) {
    const container = document.getElementById('specific-tasks-rows-container');
    const rows = container?.querySelectorAll('.specific-task-item-row') || [];
    if (rows.length <= 1) {
        if (typeof showToast === 'function') showToast('At least one task field is required.', 'info');
        return;
    }
    const target = document.getElementById(rowId);
    if (target) {
        target.remove();
        updateSpecificTaskRowsIndexes();
    }
}
window.removeSpecificTaskRow = removeSpecificTaskRow;

function updateSpecificTaskRowsIndexes() {
    const container = document.getElementById('specific-tasks-rows-container');
    const rows = container?.querySelectorAll('.specific-task-item-row') || [];
    rows.forEach((r, idx) => {
        const badge = r.querySelector('.specific-task-row-index span:first-child');
        if (badge) badge.textContent = idx + 1;
        const removeBtn = r.querySelector('.btn-remove-task-row');
        if (removeBtn) {
            removeBtn.style.display = rows.length > 1 ? 'block' : 'none';
        }
    });

    const submitBtnText = document.getElementById('btn-save-specific-task-text');
    if (submitBtnText) {
        submitBtnText.textContent = rows.length > 1 ? `Assign (${rows.length}) Tasks to Objective` : `Assign Task to Objective`;
    }
}

function validateSpecificTaskRowDate(inputEl) {
    const goalDateVal = document.getElementById('specific-task-goal-target-date')?.value;
    if (!inputEl || !goalDateVal) return;

    const taskDate = new Date(inputEl.value);
    const goalDate = new Date(goalDateVal);

    if (taskDate > goalDate) {
        if (typeof showToast === 'function') showToast(`Task deadline cannot exceed objective target date (${goalDateVal}). Adjusted automatically.`, 'warning');
        inputEl.value = goalDateVal;
    }
}
window.validateSpecificTaskRowDate = validateSpecificTaskRowDate;

function openCreateSpecificTaskModal(goalId, empId) {
    const goal = (window.dbGoals || []).find(g => String(g.id) === String(goalId));
    if (!goal) return;

    document.getElementById('specific-task-goal-id').value = goal.id;
    document.getElementById('specific-task-employee-id').value = goal.employee_id || empId || 'emp-101';
    document.getElementById('specific-task-goal-target-date').value = goal.target_date || '';

    document.getElementById('specific-task-goal-title-display').textContent = goal.title;
    document.getElementById('specific-task-goal-date-display').textContent = goal.target_date || 'Q3 2026';
    
    const emp = (window.perfRoster || []).find(e => e.id === goal.employee_id);
    document.getElementById('specific-task-emp-name-display').textContent = emp ? emp.name : 'Associate';

    const container = document.getElementById('specific-tasks-rows-container');
    if (container) {
        container.innerHTML = '';
        addSpecificTaskRow();
    }

    openModal('modal-specific-task');
    setTimeout(() => {
        const firstTitle = container?.querySelector('.task-row-title');
        if (firstTitle) firstTitle.focus();
    }, 150);
}
window.openCreateSpecificTaskModal = openCreateSpecificTaskModal;

async function handleSpecificTaskSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const goalId = document.getElementById('specific-task-goal-id')?.value;
    const employeeId = document.getElementById('specific-task-employee-id')?.value;

    const container = document.getElementById('specific-tasks-rows-container');
    const rows = container?.querySelectorAll('.specific-task-item-row') || [];
    
    const tasks = [];
    rows.forEach(r => {
        const title = r.querySelector('.task-row-title')?.value.trim();
        const target_date = r.querySelector('.task-row-date')?.value;
        const description = r.querySelector('.task-row-desc')?.value.trim();
        if (title && target_date) {
            tasks.push({ title, target_date, description });
        }
    });

    if (tasks.length === 0) {
        if (typeof showToast === 'function') showToast('Please enter at least one task title and target due date.', 'error');
        return;
    }

    const submitBtn = document.getElementById('btn-save-specific-task');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Assigning Tasks...</span>';
    }

    const payload = {
        goal_id: goalId,
        employee_id: employeeId,
        tasks
    };

    try {
        await PerformanceAPI.createSpecificTask(payload);
        if (typeof showToast === 'function') showToast(`Successfully assigned ${tasks.length} specific action task${tasks.length === 1 ? '' : 's'} to Objective!`, 'success');
        closeModal('modal-specific-task');
        await loadAndRenderPlanningGoals();
    } catch (err) {
        console.error('Create specific task error:', err);
        if (typeof showToast === 'function') showToast(err.message || 'Failed to create specific tasks.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
        }
    }
}
window.handleSpecificTaskSubmit = handleSpecificTaskSubmit;

/**
 * -------------------------------------------------------------
 * 2D. EMPLOYEE TASK COMPLETION WITH AUTO-DETECTED DATE/TIME & LEARNINGS
 * -------------------------------------------------------------
 */
function openCompleteTaskModal(taskId, goalId) {
    let goal = (window.dbGoals || []).find(g => String(g.id) === String(goalId));
    if (!goal) {
        (window.perfRoster || []).forEach(emp => {
            if (!goal && emp.goals) {
                goal = emp.goals.find(g => String(g.id) === String(goalId));
            }
        });
    }

    let task = null;
    if (goal && goal.tasks) {
        task = goal.tasks.find(t => String(t.id) === String(taskId));
    }
    if (!task && goal && goal.general_tasks) {
        task = goal.general_tasks.find(t => String(t.id) === String(taskId));
    }
    if (!task && goal && goal.specific_tasks) {
        task = goal.specific_tasks.find(t => String(t.id) === String(taskId));
    }
    if (!task && window.dbGeneralTasks) {
        const gTask = window.dbGeneralTasks.find(t => String(t.id) === String(taskId));
        if (gTask) {
            task = {
                id: taskId,
                title: gTask.title,
                description: gTask.description,
                task_type: 'general',
                target_date: goal?.target_date || 'Q3 2026'
            };
        }
    }

    const idInput = document.getElementById('complete-task-id');
    const goalIdInput = document.getElementById('complete-task-goal-id');
    if (idInput) idInput.value = taskId;
    if (goalIdInput) goalIdInput.value = goalId || (goal?.id || '');

    const titleEl = document.getElementById('complete-task-title-display');
    const descEl = document.getElementById('complete-task-desc-display');
    const badgeEl = document.getElementById('complete-task-type-badge');
    const dueEl = document.getElementById('complete-task-due-badge');

    if (titleEl) titleEl.textContent = task?.title || 'Operational Task Checklist';
    if (descEl) descEl.textContent = task?.description || 'Follow standard operating procedures and hotel luxury guidelines.';
    if (badgeEl) badgeEl.textContent = task?.task_type === 'specific' ? 'Specific Action Task' : 'General SOP Checklist';
    if (dueEl) dueEl.textContent = `Target Due: ${task?.target_date || goal?.target_date || 'Q3 2026'}`;

    // Live Automatic Date & Time Detection
    const now = new Date();
    const dateFormatted = now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    const timeFormatted = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const detectedStr = `${dateFormatted} at ${timeFormatted} (Auto-Detected)`;
    
    const timeEl = document.getElementById('complete-task-detected-time');
    const isoEl = document.getElementById('complete-task-iso-timestamp');
    if (timeEl) timeEl.textContent = detectedStr;
    if (isoEl) isoEl.value = now.toISOString();

    const learningsEl = document.getElementById('complete-task-learnings');
    const feedbackEl = document.getElementById('complete-task-feedback');
    if (learningsEl) learningsEl.value = task?.employee_learnings || '';
    if (feedbackEl) feedbackEl.value = task?.employee_feedback || '';

    openModal('modal-complete-task');
    setTimeout(() => {
        if (learningsEl) learningsEl.focus();
    }, 100);
}
window.openCompleteTaskModal = openCompleteTaskModal;

async function handleTaskCompletionSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const taskId = document.getElementById('complete-task-id')?.value;
    const learnings = document.getElementById('complete-task-learnings')?.value.trim();
    const feedback = document.getElementById('complete-task-feedback')?.value.trim();
    const completedAt = document.getElementById('complete-task-iso-timestamp')?.value || new Date().toISOString();

    if (!learnings) {
        if (typeof showToast === 'function') showToast('Please record your key learnings and reflections.', 'error');
        const learningsField = document.getElementById('complete-task-learnings');
        if (learningsField) learningsField.focus();
        return;
    }

    const submitBtn = document.getElementById('btn-confirm-complete-task');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Submitting Learnings &amp; Updating KPI...</span>';
    }

    try {
        const res = await PerformanceAPI.completeTask(taskId, learnings, feedback, completedAt);
        if (typeof showToast === 'function') {
            showToast(`🎉 Task completed! Learnings logged and Goal Progress updated to ${res.goal_progress || 100}%!`, 'success');
        }
        closeModal('modal-complete-task');
        window.lastActiveTaskCheckbox = null;
        await loadAndRenderPlanningGoals();
        if (typeof loadAndRenderMonitoringData === 'function') {
            await loadAndRenderMonitoringData();
        }
    } catch (err) {
        console.error('Task completion error:', err);
        if (typeof showToast === 'function') showToast(err.message || 'Failed to submit task completion.', 'error');
        if (window.lastActiveTaskCheckbox) {
            window.lastActiveTaskCheckbox.checked = false;
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
        }
    }
}
window.handleTaskCompletionSubmit = handleTaskCompletionSubmit;

/**
 * -------------------------------------------------------------
 * 2E. SUPERVISOR TASK FEEDBACK & ACCOMPLISHMENTS MODAL
 * -------------------------------------------------------------
 */
function openSupervisorFeedbackModal(taskId) {
    let task = null;
    (window.dbGoals || []).forEach(g => {
        if (g.tasks) {
            const found = g.tasks.find(t => String(t.id) === String(taskId));
            if (found) task = found;
        }
    });

    if (!task) return;

    document.getElementById('super-feedback-task-id').value = taskId;
    document.getElementById('super-feedback-task-title').textContent = task.title;
    document.getElementById('super-feedback-learnings-text').textContent = task.employee_learnings ? `"${task.employee_learnings}"` : '(No learnings entered yet)';
    document.getElementById('super-feedback-feedback-text').textContent = task.employee_feedback ? `Feedback: "${task.employee_feedback}"` : '';

    document.getElementById('super-feedback-accomplishment').value = task.supervisor_accomplishment || '';
    document.getElementById('super-feedback-coaching').value = task.supervisor_feedback || '';

    openModal('modal-supervisor-task-feedback');
    setTimeout(() => {
        const coachingField = document.getElementById('super-feedback-coaching');
        if (coachingField) coachingField.focus();
    }, 150);
}
window.openSupervisorFeedbackModal = openSupervisorFeedbackModal;

async function handleSupervisorTaskFeedbackSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const taskId = document.getElementById('super-feedback-task-id')?.value;
    const accomplishment = document.getElementById('super-feedback-accomplishment')?.value.trim();
    const coaching = document.getElementById('super-feedback-coaching')?.value.trim();

    if (!coaching) {
        if (typeof showToast === 'function') showToast('Please enter coaching feedback.', 'error');
        const coachingField = document.getElementById('super-feedback-coaching');
        if (coachingField) coachingField.focus();
        return;
    }

    const submitBtn = document.getElementById('btn-save-super-feedback');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Recording Coaching...</span>';
    }

    try {
        await PerformanceAPI.addSupervisorTaskFeedback(taskId, accomplishment, coaching);
        if (typeof showToast === 'function') showToast('Supervisor coaching feedback & accomplishments recorded!', 'success');
        closeModal('modal-supervisor-task-feedback');
        await loadAndRenderPlanningGoals();
        if (typeof loadAndRenderMonitoringData === 'function') {
            await loadAndRenderMonitoringData();
        }
    } catch (err) {
        console.error('Supervisor feedback save error:', err);
        if (typeof showToast === 'function') showToast(err.message || 'Failed to save feedback.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
        }
    }
}
window.handleSupervisorTaskFeedbackSubmit = handleSupervisorTaskFeedbackSubmit;


/**
 * -------------------------------------------------------------
 * 3. SET PERFORMANCE OBJECTIVE AJAX SUBMISSION (handleGoalSubmit)
 * -------------------------------------------------------------
 */
async function handleGoalSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const titleInput = document.getElementById('goal-title-input');
    const catInput = document.getElementById('goal-cat-input');
    const dateInput = document.getElementById('goal-date-input');
    const kpiInput = document.getElementById('goal-kpi-input');
    const weightInput = document.getElementById('goal-weight-input');
    const evidenceInput = document.getElementById('goal-evidence-input');
    const scopeSelect = document.getElementById('goal-target-scope');
    const submitBtn = document.getElementById('btn-submit-create-goal');

    const title = titleInput ? titleInput.value.trim() : '';
    const department = catInput ? catInput.value.trim() : 'Front Office & Guest Experience';
    const targetDate = dateInput ? dateInput.value : '';
    const targetMetric = kpiInput ? kpiInput.value.trim() : '';
    const weight = weightInput ? weightInput.value : 'Medium Priority (20% Weight)';
    const evidence = evidenceInput ? evidenceInput.value.trim() : '';

    if (!title) {
        if (typeof showToast === 'function') showToast('Please provide an Objective Title.', 'error');
        if (titleInput) titleInput.focus();
        return;
    }

    if (!targetMetric) {
        if (typeof showToast === 'function') showToast('Please define a Target / Success Metric.', 'error');
        if (kpiInput) kpiInput.focus();
        return;
    }

    const isAssociate = (typeof activePersonaKey !== 'undefined' && (activePersonaKey === 'associate' || activePersonaKey === 'employee'));
    const currentUserId = window.currentUser?.id || (isAssociate ? 'emp-101' : 'emp-102');
    const currentRole = window.currentUser?.role || (isAssociate ? 'Associate' : 'Supervisor');

    const selectedOpt = scopeSelect && scopeSelect.selectedIndex >= 0 ? scopeSelect.options[scopeSelect.selectedIndex] : null;
    let employeeId = isAssociate ? currentUserId : (selectedOpt ? selectedOpt.value : currentUserId);
    let role = isAssociate ? 'Associate' : (selectedOpt ? (selectedOpt.getAttribute('data-role') || currentRole) : currentRole);
    const targetScope = selectedOpt ? (selectedOpt.getAttribute('data-scope') || 'single') : 'single';

    const payload = {
        employee_id: employeeId,
        target_scope: targetScope,
        role: role,
        title: title,
        department: department,
        target_date: targetDate || '2026-09-30',
        target_metric: targetMetric,
        weight: weight,
        evidence: evidence,
        status: 'Pending Approval'
    };

    // Button loading state
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Setting Objective...</span>';
    }

    try {
        const result = await PerformanceAPI.createGoal(payload);

        if (typeof showToast === 'function') {
            showToast(`Performance objective "${title}" successfully set and saved to database!`, 'success');
        }

        // Close modal & reset form
        if (typeof closeModal === 'function') {
            closeModal('modal-create-goal');
        }
        const form = document.getElementById('form-create-goal');
        if (form) form.reset();

        // Refresh Planning Tab & Employee Dashboard with Database Live State
        await loadAndRenderPlanningGoals();
        if (typeof loadLiveNotifications === 'function') {
            loadLiveNotifications(window.activePersonaRole || 'Supervisor');
        }

        // If user is supervisor/manager, switch to Planning tab; if Associate, stay on Shift Focus & My Pulse
        const isAssociate = (typeof activePersonaKey !== 'undefined' && (activePersonaKey === 'associate' || activePersonaKey === 'employee'));
        if (!isAssociate) {
            if (typeof switchSubTab === 'function') {
                switchSubTab('perf', 'plan');
            }
        }

    } catch (error) {
        console.error('Failed to create goal:', error);
        if (typeof showToast === 'function') {
            showToast(error.message || 'Failed to save performance goal to database.', 'error');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
    }
}

window.handleGoalSubmit = handleGoalSubmit;

function handleGoalScopeChange(selectEl) {
    if (!selectEl || selectEl.selectedIndex < 0) return;
    const opt = selectEl.options[selectEl.selectedIndex];
    const dept = opt.getAttribute('data-dept');
    if (dept) {
        const catSelect = document.getElementById('goal-cat-input');
        if (catSelect) {
            for (let i = 0; i < catSelect.options.length; i++) {
                if (catSelect.options[i].text.includes(dept) || dept.includes(catSelect.options[i].text)) {
                    catSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
}
window.handleGoalScopeChange = handleGoalScopeChange;

async function approveGoalViaAPI(goalId, empId, btnEl) {
    let origHtml = '';
    if (btnEl) {
        origHtml = btnEl.innerHTML;
        btnEl.disabled = true;
        btnEl.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i><span>Approving...</span>';
    }
    try {
        await PerformanceAPI.updateGoalStatus(goalId, 'Approved');
        if (typeof showToast === 'function') {
            showToast('Goal officially approved and locked for Q3!', 'success');
        }
        await loadAndRenderPlanningGoals();
        if (typeof loadLiveNotifications === 'function') {
            loadLiveNotifications(window.activePersonaRole || 'Associate');
        }
    } catch (err) {
        console.error('Goal approval error:', err);
        if (typeof showToast === 'function') {
            showToast(err.message || 'Failed to approve goal.', 'error');
        }
        if (btnEl) {
            btnEl.disabled = false;
            btnEl.innerHTML = origHtml;
        }
    }
}
window.approveGoalViaAPI = approveGoalViaAPI;

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
 * View / Revise Modal Actions with Live Supabase Sync
 */
function openViewGoalModal(targetId) {
    // Find goal in live dbGoals or roster
    let targetGoal = (window.dbGoals || []).find(g => String(g.id) === String(targetId) || String(g.employee_id) === String(targetId));
    let emp = (window.perfRoster || []).find(e => String(e.id) === String(targetId) || (e.goals && e.goals.some(g => String(g.id) === String(targetId))));

    if (!emp) {
        emp = {
            name: targetGoal?.employee_name || 'Maria Santos',
            position: 'Associate',
            department: targetGoal?.department || 'Front Office',
            attendance: { present: 22, absent: 1, percentage: '95.6%' },
            managerRating: 4.6,
            customerRating: 4.8,
            goals: targetGoal ? [targetGoal] : []
        };
    }

    const empNameEl = document.getElementById('view-modal-emp-name');
    const empPosEl = document.getElementById('view-modal-emp-pos');
    const attEl = document.getElementById('view-modal-attendance');
    const mgrRatEl = document.getElementById('view-modal-mgr-rating');
    const custRatEl = document.getElementById('view-modal-cust-rating');

    if (empNameEl) empNameEl.innerText = emp.name;
    if (empPosEl) empPosEl.innerText = `${emp.position || 'Associate'} · ${emp.department || targetGoal?.department || 'Oxford Suites'}`;
    if (attEl) attEl.innerText = emp.attendance ? `${emp.attendance.percentage} Attendance` : '96.5% Attendance';
    if (mgrRatEl) mgrRatEl.innerText = `⭐ ${(emp.managerRating || 4.6).toFixed(1)}`;
    if (custRatEl) custRatEl.innerText = `⭐ ${(emp.customerRating || 4.8).toFixed(1)}`;

    const container = document.getElementById('view-modal-goals-list');
    if (container) {
        container.innerHTML = '';
        const displayGoals = targetGoal ? [targetGoal] : (emp.goals || []);

        displayGoals.forEach((g, idx) => {
            const isApproved = (g.status === 'Approved');
            const tasks = g.tasks || [];
            const completedCount = tasks.filter(t => t.status === 'completed').length;
            const totalCount = tasks.length;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            const div = document.createElement('div');
            div.className = 'p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs';
            div.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900 text-sm">${idx + 1}. ${g.title}</span>
                    <span class="px-2.5 py-0.5 rounded-full font-bold text-[10px] ${isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        ${g.status || 'Pending Approval'}
                    </span>
                </div>
                <p class="text-slate-500 text-[11px]">Department: <strong>${g.department || 'Front Office'}</strong> &middot; Target Date: <strong>${g.target_date || 'Q3 2026'}</strong></p>
                <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/80">
                    <div>
                        <span class="text-slate-400 block text-[10px]">Target Metric:</span>
                        <strong class="text-primary text-xs">${g.target_metric || g.kpi || 'N/A'}</strong>
                    </div>
                    <div>
                        <span class="text-slate-400 block text-[10px]">Appraisal Weight:</span>
                        <strong class="text-slate-800 text-xs">${g.weight || 'Standard (20%)'}</strong>
                    </div>
                </div>
                ${g.evidence || g.deliverables ? `
                <div class="pt-1 text-[11px] text-slate-600">
                    <span>Deliverables & Evidence: <strong>${g.evidence || g.deliverables}</strong></span>
                </div>` : ''}
                ${g.supervisor_notes ? `
                <div class="pt-2 border-t border-slate-200/60 text-[11px] text-purple-900 bg-purple-50/70 p-2.5 rounded-xl">
                    <span class="font-bold block text-[10px] text-purple-700">Supervisor Coaching Notes:</span>
                    <span>${g.supervisor_notes}</span>
                </div>` : ''}

                <!-- Associated Action Tasks & Checklists -->
                <div class="pt-2 border-t border-slate-200/80 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-slate-800 text-[11px] flex items-center space-x-1.5">
                            <i class="fas fa-list-check text-primary"></i>
                            <span>Action Checklist (${completedCount}/${totalCount} Completed - ${progress}%):</span>
                        </span>
                        <button onclick="closeModal('modal-view-goal'); openCreateSpecificTaskModal('${g.id}', '${g.employee_id}')" class="text-primary hover:underline font-bold text-[10px] inline-flex items-center space-x-1">
                            <i class="fas fa-plus text-[8px]"></i>
                            <span>Add Specific Task</span>
                        </button>
                    </div>
                    <div class="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                        ${tasks.length > 0 ? tasks.map(t => {
                            const isDone = t.status === 'completed';
                            return `
                                <div class="p-2.5 rounded-xl border ${isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-white border-slate-200 text-slate-800'} text-[11px] flex items-start justify-between gap-2">
                                    <div class="space-y-0.5">
                                        <div class="flex items-center space-x-1.5">
                                            <span class="font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}">${t.title}</span>
                                            <span class="text-[9px] px-1.5 py-0.2 rounded font-bold ${t.task_type === 'specific' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}">${t.task_type === 'specific' ? 'Specific' : 'General'}</span>
                                        </div>
                                        <p class="text-[10px] text-slate-500">${t.description || ''}</p>
                                        ${t.employee_learnings ? `<p class="text-[10px] text-emerald-800 italic pt-0.5"><i class="fas fa-lightbulb mr-1 text-emerald-600"></i>Learnings: "${t.employee_learnings}"</p>` : ''}
                                    </div>
                                    <div class="text-right flex-shrink-0">
                                        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold ${isDone ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-100 text-amber-800'}">
                                            ${isDone ? '✓ Done' : `Due: ${t.target_date || 'Q3'}`}
                                        </span>
                                    </div>
                                </div>
                            `;
                        }).join('') : `<p class="text-[10px] text-slate-400 italic py-1">No action tasks assigned to this objective yet.</p>`}
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    openModal('modal-view-goal');
}

function openReviseGoalModal(targetId) {
    // 1. Locate goal by id or employee_id
    let targetGoal = (window.dbGoals || []).find(g => String(g.id) === String(targetId) || String(g.employee_id) === String(targetId));
    let emp = (window.perfRoster || []).find(e => String(e.id) === String(targetId) || (e.goals && e.goals.some(g => String(g.id) === String(targetId))));

    if (!targetGoal && emp && emp.goals && emp.goals[0]) {
        targetGoal = emp.goals[0];
    }
    if (!targetGoal && window.dbGoals && window.dbGoals[0]) {
        targetGoal = window.dbGoals[0];
    }
    if (!targetGoal) {
        if (typeof showToast === 'function') showToast('Goal not found for revision.', 'error');
        return;
    }

    const goalIdField = document.getElementById('revise-goal-id');
    const nameEl = document.getElementById('revise-modal-emp-name');
    const posEl = document.getElementById('revise-modal-emp-pos');
    const titleField = document.getElementById('revise-goal-title');
    const catField = document.getElementById('revise-goal-cat');
    const dateField = document.getElementById('revise-goal-date');
    const kpiField = document.getElementById('revise-goal-kpi');
    const weightField = document.getElementById('revise-goal-weight');
    const deliverField = document.getElementById('revise-goal-deliverables');

    if (goalIdField) goalIdField.value = targetGoal.id || targetId;
    if (nameEl) nameEl.innerText = emp?.name || targetGoal.employee_name || 'Maria Santos';
    if (posEl) posEl.innerText = `${emp?.position || 'Associate'} · ${targetGoal.department || 'Front Office'}`;
    
    if (titleField) titleField.value = targetGoal.title || '';
    if (catField && targetGoal.department) catField.value = targetGoal.department;
    if (dateField && targetGoal.target_date) dateField.value = targetGoal.target_date;
    if (kpiField) kpiField.value = targetGoal.target_metric || targetGoal.kpi || '';
    if (weightField && targetGoal.weight) weightField.value = targetGoal.weight;
    if (deliverField) deliverField.value = targetGoal.evidence || targetGoal.deliverables || '';

    // Configure 7. Calibration & Coaching Notes for Employee vs Supervisor
    const userObj = window.currentUser || JSON.parse(localStorage.getItem('oxford_session_user') || '{}');
    const currentRole = String(window.activePersonaRole || userObj.role || 'Associate').toLowerCase();
    const isAssociate = (currentRole === 'associate' || currentRole === 'employee' || (typeof activePersonaKey !== 'undefined' && (activePersonaKey === 'associate' || activePersonaKey === 'employee')));

    const notesField = document.getElementById('revise-goal-notes');
    const notesBadge = document.getElementById('badge-revise-notes-auth');
    const notesLabel = document.getElementById('label-revise-goal-notes');

    if (notesField) {
        notesField.value = targetGoal.supervisor_notes || '';

        if (isAssociate) {
            // Disabled & Read-only for Employee — only shows the supervisor's coaching notes
            notesField.disabled = true;
            notesField.readOnly = true;
            notesField.placeholder = "No supervisor coaching notes attached.";
            notesField.className = "w-full p-3 rounded-xl border border-purple-200 bg-purple-50/70 text-purple-950 text-xs font-medium cursor-not-allowed italic shadow-2xs focus:outline-none pointer-events-none select-none";
            if (notesLabel) notesLabel.textContent = "7. Supervisor Calibration & Coaching Note (Read Only)";
            if (notesBadge) {
                notesBadge.textContent = "Supervisor Note (Read Only)";
                notesBadge.className = "text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200";
            }
        } else {
            // Active & Editable for Supervisor
            notesField.disabled = false;
            notesField.readOnly = false;
            notesField.placeholder = "Add revision rationale, supervisor coaching notes, or check-in instructions...";
            notesField.className = "w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar transition";
            if (notesLabel) notesLabel.textContent = "7. Calibration & Coaching Notes (Optional)";
            if (notesBadge) {
                notesBadge.textContent = "Supervisor Only (Editable)";
                notesBadge.className = "text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800";
            }
        }
    }

    openModal('modal-revise-goal');
}

async function saveGoalRevision(event) {
    if (event) event.preventDefault();

    const goalId = document.getElementById('revise-goal-id')?.value;
    if (!goalId) {
        if (typeof showToast === 'function') showToast('Missing goal ID for update.', 'error');
        return;
    }

    const submitBtn = document.getElementById('btn-save-goal-revision');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Save & Update Objective';

    const isAssociate = (window.activePersonaRole === 'Associate' || (typeof activePersonaKey !== 'undefined' && (activePersonaKey === 'associate' || activePersonaKey === 'employee')));

    const updates = {
        title: document.getElementById('revise-goal-title')?.value.trim(),
        department: document.getElementById('revise-goal-cat')?.value,
        target_date: document.getElementById('revise-goal-date')?.value,
        target_metric: document.getElementById('revise-goal-kpi')?.value.trim(),
        weight: document.getElementById('revise-goal-weight')?.value,
        evidence: document.getElementById('revise-goal-deliverables')?.value.trim()
    };

    // Only supervisor is authorized to insert / edit calibration & coaching notes
    if (!isAssociate) {
        updates.supervisor_notes = document.getElementById('revise-goal-notes')?.value.trim();
    }

    if (!updates.title) {
        if (typeof showToast === 'function') showToast('Goal Title cannot be empty.', 'error');
        return;
    }
    if (!updates.target_metric) {
        if (typeof showToast === 'function') showToast('Target Metric is required.', 'error');
        return;
    }

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> Saving to Database...';
        }

        // Call AJAX endpoint to update database in Supabase
        await PerformanceAPI.reviseGoal(goalId, updates);

        // Close modal and refresh Planning roster & pulse cards
        closeModal('modal-revise-goal');
        await loadAndRenderPlanningGoals();
        if (typeof loadLiveNotifications === 'function') {
            loadLiveNotifications(window.activePersonaRole || 'Associate');
        }

        if (typeof showToast === 'function') {
            showToast('Performance goal objectives successfully revised & saved to database!', 'success');
        }
    } catch (err) {
        console.error('Failed to save goal revision:', err);
        if (typeof showToast === 'function') {
            showToast(err.message || 'Failed to save revisions to database.', 'error');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
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

    if (!window.dbGoals || window.dbGoals.length === 0) {
        container.innerHTML = `
            <div class="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-2 col-span-2">
                <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg mx-auto font-bold">
                    <i class="fas fa-clipboard-check"></i>
                </div>
                <h4 class="font-bold text-slate-800 text-sm">No Pending Goals for Approval</h4>
                <p class="text-xs text-slate-500">No performance goals have been submitted for supervisor calibration yet.</p>
            </div>
        `;
        return;
    }

    const pendingStaff = window.perfRoster.filter(e => e.approvalStatus !== 'Approved' && (e.goalsCount || 0) > 0);

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
        const att = emp.attendance || { present: 23, absent: 0, percentage: '100%' };
        const mgrRating = typeof emp.managerRating === 'number' ? emp.managerRating.toFixed(1) : '4.8';
        const custRating = typeof emp.customerRating === 'number' ? emp.customerRating.toFixed(1) : '4.9';

        div.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg || 'bg-primary'} text-white font-bold text-xs flex items-center justify-center">
                        ${emp.avatar || emp.name.slice(0, 2).toUpperCase()}
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
                    <span class="font-bold text-slate-800">${att.percentage} (${att.present}P / ${att.absent}A)</span>
                </div>
                <div>
                    <span class="text-slate-400 text-[10px] block">Historical Rating:</span>
                    <span class="font-bold text-amber-600">⭐ ${mgrRating} Mgr / ⭐ ${custRating} Cust</span>
                </div>
            </div>

            <div class="space-y-2 text-xs">
                <span class="font-bold text-slate-800 text-[11px] block">Proposed Objectives (${emp.goalsCount || 0}):</span>
                ${emp.goals.map(g => {
                    const isRevised = !!g.supervisor_notes || (g.updated_at && g.created_at && g.updated_at !== g.created_at);
                    const isApproved = (g.status === 'Approved');
                    return `
                        <div class="p-2.5 bg-slate-50/90 rounded-xl text-[11px] space-y-1.5 border border-slate-200/70">
                            <div class="flex justify-between items-center gap-2">
                                <div class="flex items-center space-x-1.5 truncate">
                                    <span class="font-semibold text-slate-900 truncate">${g.title}</span>
                                    ${isRevised ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex-shrink-0">Revised</span>` : ''}
                                </div>
                                <div class="flex items-center space-x-1.5 flex-shrink-0">
                                    <span class="font-mono text-primary font-bold">${g.kpi}</span>
                                    ${isApproved ? `
                                        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-0.5">
                                            <i class="fas fa-check-circle text-emerald-600"></i><span>Approved</span>
                                        </span>
                                    ` : `
                                        <button onclick="approveGoal('${g.id}')" class="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded-md shadow-2xs transition flex items-center space-x-0.5 cursor-pointer">
                                            <i class="fas fa-check text-[8px]"></i><span>Approve</span>
                                        </button>
                                    `}
                                </div>
                            </div>
                            ${g.supervisor_notes ? `
                                <div class="text-[10px] text-purple-800 bg-purple-50/80 px-2 py-0.5 rounded border border-purple-100 leading-tight italic">
                                    <span class="font-bold font-normal not-italic text-purple-900"><i class="fas fa-comment-dots mr-1"></i>Supervisor Note:</span> ${g.supervisor_notes}
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button onclick="openViewGoalModal('${emp.goals[0]?.id || emp.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
                    View Details
                </button>
                <button onclick="openReviseGoalModal('${emp.goals[0]?.id || emp.id}')" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition">
                    <i class="fas fa-pen-to-square mr-1"></i>Revise &amp; Notes
                </button>
                <button onclick="approveEmployeeGoals('${emp.id}')" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5">
                    <i class="fas fa-check-double text-[11px]"></i><span>Approve All (${emp.goalsCount || 0})</span>
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}
window.renderApprovalRosterTable = renderApprovalRosterTable;

/**
 * Approve all pending goals for a specific employee
 */
async function approveEmployeeGoals(empId) {
    const emp = (window.perfRoster || []).find(e => e.id === empId);
    const goalsToApprove = (window.dbGoals || []).filter(g => (g.employee_id === empId || (emp && emp.goals && emp.goals.some(eg => eg.id === g.id))) && g.status !== 'Approved');

    if (goalsToApprove.length === 0) {
        if (typeof showToast === 'function') showToast('All goals for this employee are already calibrated & approved.', 'info');
        return;
    }

    try {
        if (typeof showToast === 'function') showToast(`Calibrating & approving ${goalsToApprove.length} goal(s) for ${emp?.name || 'Associate'}...`, 'info');

        await Promise.all(goalsToApprove.map(g => PerformanceAPI.updateGoalStatus(g.id, 'Approved')));

        if (typeof showToast === 'function') {
            showToast(`🎉 Objectives successfully approved & locked for ${emp?.name || 'Associate'}!`, 'success');
        }

        await loadAndRenderPlanningGoals();
        if (typeof loadLiveNotifications === 'function') {
            loadLiveNotifications(window.activePersonaRole || 'Supervisor');
        }
    } catch (err) {
        console.error('Error approving employee goals:', err);
        if (typeof showToast === 'function') showToast(err.message || 'Failed to approve goals.', 'error');
    }
}
window.approveEmployeeGoals = approveEmployeeGoals;

/**
 * Approve a single goal by ID
 */
async function approveGoal(goalId) {
    try {
        await PerformanceAPI.updateGoalStatus(goalId, 'Approved');
        if (typeof showToast === 'function') {
            showToast('Goal objective calibrated & approved! 🎉', 'success');
        }
        await loadAndRenderPlanningGoals();
        if (typeof loadLiveNotifications === 'function') {
            loadLiveNotifications(window.activePersonaRole || 'Supervisor');
        }
    } catch (err) {
        console.error('Error approving goal:', err);
        if (typeof showToast === 'function') showToast(err.message || 'Failed to approve goal.', 'error');
    }
}
window.approveGoal = approveGoal;

/**
 * Bulk approve all pending goals across the department
 */
async function approveAllPendingGoals() {
    const pendingGoals = (window.dbGoals || []).filter(g => g.status !== 'Approved');

    if (pendingGoals.length === 0) {
        if (typeof showToast === 'function') showToast('No pending goals remaining for calibration.', 'info');
        return;
    }

    try {
        if (typeof showToast === 'function') showToast(`Approving all ${pendingGoals.length} pending objective(s)...`, 'info');

        await Promise.all(pendingGoals.map(g => PerformanceAPI.updateGoalStatus(g.id, 'Approved')));

        if (typeof showToast === 'function') {
            showToast('🎉 All Q3 Department Objectives Approved & Calibrated!', 'success');
        }

        await loadAndRenderPlanningGoals();
        if (typeof loadLiveNotifications === 'function') {
            loadLiveNotifications(window.activePersonaRole || 'Supervisor');
        }
    } catch (err) {
        console.error('Error bulk approving goals:', err);
        if (typeof showToast === 'function') showToast(err.message || 'Failed to approve all goals.', 'error');
    }
}
window.approveAllPendingGoals = approveAllPendingGoals;

/**
 * -------------------------------------------------------------
 * 3. MONITORING STAGE (Employee Roster with Dynamic Progress & Activity Stream)
 * -------------------------------------------------------------
 */

function calculateEmployeeProgress(emp) {
    if (emp.goals && emp.goals.length > 0) {
        let totalProgress = 0;
        let countedGoals = 0;

        emp.goals.forEach(g => {
            const tasks = g.tasks || [];
            if (tasks.length > 0) {
                const completed = tasks.filter(t => t.status === 'completed').length;
                totalProgress += Math.round((completed / tasks.length) * 100);
            } else if (g.status === 'Completed') {
                totalProgress += 100;
            } else if (g.status === 'Approved') {
                totalProgress += 75;
            } else {
                totalProgress += 30;
            }
            countedGoals++;
        });

        if (countedGoals > 0) {
            return Math.min(100, Math.round(totalProgress / countedGoals));
        }
    }

    return 80;
}

function autoCalculateAllMonitoringProgress() {
    let count = 0;
    (window.perfRoster || []).forEach(emp => {
        emp.monitoringProgress = calculateEmployeeProgress(emp);
        emp.monitoringStatus = emp.monitoringProgress >= 90 ? 'Exceeding' : (emp.monitoringProgress >= 70 ? 'On Track' : 'Needs Support');
        count++;
    });

    renderMonitoringRosterTable();

    if (typeof showToast === 'function') {
        showToast(`⚡ Recalculated Goal Progress from task completions for ${count} staff!`, 'success');
    }
}
window.autoCalculateAllMonitoringProgress = autoCalculateAllMonitoringProgress;

function renderMonitoringRosterTable() {
    const container = document.getElementById('monitoring-roster-tbody');
    if (!container) return;

    container.innerHTML = '';
    const deptFilter = document.getElementById('filter-monitoring-dept')?.value || 'all';

    let list = window.perfRoster || [];
    if (deptFilter !== 'all') {
        list = list.filter(e => e.department.toLowerCase() === deptFilter.toLowerCase());
    }

    if (list.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="p-8 text-center bg-white text-slate-500 text-xs">
                    No employee records found matching selected filter.
                </td>
            </tr>
        `;
        renderPaginationControls('monitoring-pagination-container', 1, 0, monitoringPageSize, 'setMonitoringPage');
        return;
    }

    const totalPages = Math.ceil(list.length / monitoringPageSize);
    if (monitoringCurrentPage > totalPages) {
        monitoringCurrentPage = totalPages;
    }
    if (monitoringCurrentPage < 1) {
        monitoringCurrentPage = 1;
    }

    const startIdx = (monitoringCurrentPage - 1) * monitoringPageSize;
    const pageList = list.slice(startIdx, startIdx + monitoringPageSize);

    pageList.forEach(emp => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition text-xs border-b border-slate-100';

        emp.monitoringProgress = calculateEmployeeProgress(emp);
        emp.monitoringStatus = emp.monitoringProgress >= 90 ? 'Exceeding' : (emp.monitoringProgress >= 70 ? 'On Track' : 'Needs Support');

        const progressColor = emp.monitoringProgress >= 90 ? 'bg-emerald-500' : (emp.monitoringProgress >= 70 ? 'bg-primary' : 'bg-amber-500');
        const att = emp.attendance || { present: 23, absent: 0, percentage: '100%' };
        const mgrRating = typeof emp.managerRating === 'number' ? emp.managerRating.toFixed(1) : '4.8';
        const custRating = typeof emp.customerRating === 'number' ? emp.customerRating.toFixed(1) : '4.9';

        tr.innerHTML = `
            <td class="px-5 py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg || 'bg-primary'} text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        ${emp.avatar || emp.name.slice(0, 2).toUpperCase()}
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
                    <span class="font-bold text-slate-800 text-xs block">${att.present} Present / ${att.absent} Absent</span>
                    <span class="text-[10px] text-emerald-700 font-bold">${att.percentage} Rate</span>
                </div>
            </td>
            <td class="px-5 py-4">
                <div class="space-y-1">
                    <div class="flex items-center space-x-1.5">
                        <span class="text-slate-400 text-[10px]">Manager:</span>
                        <span class="font-bold text-slate-900">⭐ ${mgrRating}</span>
                    </div>
                    <div class="flex items-center space-x-1.5">
                        <span class="text-slate-400 text-[10px]">Customer:</span>
                        <span class="font-bold text-amber-600">⭐ ${custRating}</span>
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
            <td class="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                <button onclick="toggleEmployeeMonitoringDetail('${emp.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
                    View Stream &amp; Tasks
                </button>
                <button onclick="openLogMilestoneModal('${emp.id}')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition inline-flex items-center space-x-1">
                    <i class="fas fa-plus text-[10px]"></i><span>Log KPI</span>
                </button>
                <button onclick="triggerEvaluationForEmployee('${emp.id}')" class="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary-dark transition flex items-center space-x-1 inline-flex">
                    <i class="fas fa-star-half-stroke"></i><span>Evaluate</span>
                </button>
            </td>
        `;

        container.appendChild(tr);
    });

    renderPaginationControls('monitoring-pagination-container', monitoringCurrentPage, list.length, monitoringPageSize, 'setMonitoringPage');
}
window.renderMonitoringRosterTable = renderMonitoringRosterTable;

function filterMonitoringByDept(dept) {
    const el = document.getElementById('filter-monitoring-dept');
    if (el) el.value = dept;
    renderMonitoringRosterTable();
}
window.filterMonitoringByDept = filterMonitoringByDept;

function toggleEmployeeMonitoringDetail(empId) {
    const emp = window.perfRoster.find(e => e.id === empId);
    if (!emp) return;
    window.selectedEmployeeContext = emp;
    
    const detailBox = document.getElementById('monitoring-employee-detail-card');
    if (detailBox) {
        document.getElementById('mon-detail-name').innerText = emp.name;
        document.getElementById('mon-detail-pos').innerText = `${emp.position} · ${emp.department} — Continuous Monitoring & Task Stream`;
        detailBox.classList.remove('hidden');
        
        // Render dynamic task accomplishments and activity stream
        renderEmployeeMonitoringStream(emp);
        detailBox.scrollIntoView({ behavior: 'smooth' });
    }

    if (typeof showToast === 'function') {
        showToast(`Loaded continuous shift stream & task matrix for ${emp.name}`, 'info');
    }
}
window.toggleEmployeeMonitoringDetail = toggleEmployeeMonitoringDetail;

let monitoringStreamFilter = 'all';
let monitoringStreamSearch = '';

function setMonitoringStreamFilter(filter) {
    monitoringStreamFilter = filter;
    ['all', 'pending', 'completed', 'specific', 'general'].forEach(f => {
        const btn = document.getElementById(`btn-stream-filter-${f}`);
        if (btn) {
            if (f === filter) {
                btn.className = 'px-2.5 py-1 rounded-lg font-bold text-[10px] bg-primary text-white shadow-2xs transition';
            } else {
                btn.className = 'px-2.5 py-1 rounded-lg font-bold text-[10px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition';
            }
        }
    });
    if (window.selectedEmployeeContext) {
        renderEmployeeMonitoringStream(window.selectedEmployeeContext);
    }
}
window.setMonitoringStreamFilter = setMonitoringStreamFilter;

function onMonitoringStreamSearch(query) {
    monitoringStreamSearch = (query || '').toLowerCase().trim();
    if (window.selectedEmployeeContext) {
        renderEmployeeMonitoringStream(window.selectedEmployeeContext);
    }
}
window.onMonitoringStreamSearch = onMonitoringStreamSearch;

function renderEmployeeMonitoringStream(emp) {
    const container = document.getElementById('timeline-stream-container');
    if (!container) return;

    container.innerHTML = '';
    const empGoals = emp.goals || [];

    if (empGoals.length === 0) {
        container.innerHTML = `
            <div class="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                <i class="fas fa-tasks text-slate-400 text-base mb-1 block"></i>
                No performance objectives assigned to this employee yet.
            </div>
        `;
        return;
    }

    const isSupervisor = (window.activePersonaRole !== 'Associate');

    empGoals.forEach(goal => {
        const allTasks = goal.tasks || [];
        
        // Filter tasks according to filter & search
        const filteredTasks = allTasks.filter(t => {
            if (monitoringStreamFilter === 'pending' && t.status === 'completed') return false;
            if (monitoringStreamFilter === 'completed' && t.status !== 'completed') return false;
            if (monitoringStreamFilter === 'specific' && t.task_type !== 'specific') return false;
            if (monitoringStreamFilter === 'general' && t.task_type !== 'general') return false;

            if (monitoringStreamSearch) {
                const searchStr = `${t.title} ${t.description || ''} ${t.employee_learnings || ''} ${t.employee_feedback || ''} ${t.supervisor_feedback || ''}`.toLowerCase();
                if (!searchStr.includes(monitoringStreamSearch)) return false;
            }
            return true;
        });

        const completedCount = allTasks.filter(t => t.status === 'completed').length;
        const totalCount = allTasks.length;
        const goalProgressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : (goal.status === 'Approved' ? 50 : 0);

        const goalCard = document.createElement('div');
        goalCard.className = 'p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3';

        goalCard.innerHTML = `
            <!-- Compact Goal Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div class="space-y-0.5">
                    <div class="flex items-center space-x-2 flex-wrap">
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold ${goal.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                            ${goal.status || 'Pending Approval'}
                        </span>
                        <h4 class="font-bold text-slate-900 text-xs">${goal.title}</h4>
                    </div>
                    <p class="text-[10px] text-slate-500 flex items-center space-x-2">
                        <span>Target Metric: <strong class="text-primary font-mono">${goal.target_metric}</strong></span>
                        <span>·</span>
                        <span>Due: <strong class="text-slate-700">${goal.target_date || 'Q3 2026'}</strong></span>
                    </p>
                </div>
                <div class="flex items-center space-x-3 flex-shrink-0">
                    <div class="text-right space-y-0.5">
                        <span class="text-[10px] font-bold text-slate-700">${goalProgressPct}% Completed</span>
                        <div class="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div class="${goalProgressPct >= 100 ? 'bg-emerald-500' : 'bg-primary'} h-1.5 rounded-full" style="width: ${goalProgressPct}%"></div>
                        </div>
                    </div>
                    ${isSupervisor ? `
                        <button onclick="openCreateSpecificTaskModal('${goal.id}', '${emp.id}')" class="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold rounded-lg transition inline-flex items-center space-x-1" title="Assign Specific Task">
                            <i class="fas fa-plus text-[8px]"></i>
                            <span>Add Task</span>
                        </button>
                    ` : ''}
                </div>
            </div>

            <!-- Task Items List -->
            <div class="space-y-2">
                ${filteredTasks.length === 0 ? `
                    <p class="text-[10px] text-slate-400 italic py-1 text-center bg-slate-50 rounded-xl p-2">
                        ${allTasks.length === 0 ? 'No tasks assigned to this objective yet.' : 'No tasks matching the selected filter.'}
                    </p>
                ` : filteredTasks.map(task => {
                    const isDone = task.status === 'completed';
                    const dateStr = task.completed_at ? new Date(task.completed_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : `Target: ${task.target_date}`;

                    return `
                        <div class="p-3 rounded-xl border ${isDone ? 'bg-emerald-50/40 border-emerald-200/70' : 'bg-slate-50 border-slate-200/70'} space-y-2 text-xs transition">
                            <div class="flex items-center justify-between flex-wrap gap-1.5">
                                <div class="flex items-center space-x-2">
                                    <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                        ${isDone ? '✓ Completed' : '⏳ Pending'}
                                    </span>
                                    <span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${task.task_type === 'specific' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'}">
                                        ${task.task_type === 'specific' ? 'Specific Action' : 'General SOP'}
                                    </span>
                                    <span class="font-bold text-slate-900 text-xs">${task.title}</span>
                                </div>
                                <span class="text-slate-400 font-mono text-[10px]">${dateStr}</span>
                            </div>

                            ${task.employee_learnings ? `
                                <div class="p-2 bg-white rounded-lg border border-emerald-100 text-[11px] space-y-0.5">
                                    <p class="font-bold text-emerald-900 text-[10px] flex items-center space-x-1">
                                        <i class="fas fa-lightbulb text-emerald-600 text-[9px]"></i>
                                        <span>Employee Learnings &amp; Reflections:</span>
                                    </p>
                                    <p class="text-slate-700 italic text-[11px] leading-relaxed">"${task.employee_learnings}"</p>
                                </div>
                            ` : ''}

                            ${task.employee_feedback ? `
                                <div class="p-2 bg-indigo-50/60 rounded-lg border border-indigo-100 text-[10px] space-y-0.5">
                                    <span class="font-bold text-indigo-950 flex items-center space-x-1">
                                        <i class="fas fa-comment-dots text-indigo-600 text-[9px]"></i>
                                        <span>Employee Feedback:</span>
                                    </span>
                                    <p class="text-slate-700 italic">"${task.employee_feedback}"</p>
                                </div>
                            ` : ''}

                            ${task.supervisor_accomplishment ? `
                                <div class="p-2 bg-amber-50 rounded-lg border border-amber-200/70 text-[10px] space-y-0.5">
                                    <span class="font-bold text-amber-900 flex items-center space-x-1">
                                        <i class="fas fa-trophy text-amber-600 text-[9px]"></i>
                                        <span>Accomplishment Recorded:</span>
                                    </span>
                                    <p class="text-slate-800 font-medium">${task.supervisor_accomplishment}</p>
                                </div>
                            ` : ''}

                            ${task.supervisor_feedback ? `
                                <div class="p-2 bg-purple-50 rounded-lg border border-purple-200/70 text-[10px] space-y-0.5">
                                    <span class="font-bold text-purple-900 flex items-center space-x-1">
                                        <i class="fas fa-user-check text-purple-600 text-[9px]"></i>
                                        <span>Supervisor Coaching &amp; Notes:</span>
                                    </span>
                                    <p class="text-slate-800">${task.supervisor_feedback}</p>
                                </div>
                            ` : ''}

                            <div class="flex items-center justify-end pt-1">
                                <button onclick="openSupervisorFeedbackModal('${task.id}')" class="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold rounded-lg transition inline-flex items-center space-x-1">
                                    <i class="fas fa-pen text-[8px]"></i>
                                    <span>${task.supervisor_feedback ? 'Edit Coaching / Accomplishment' : '+ Record Coaching & Accomplishments'}</span>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.appendChild(goalCard);
    });
}
window.renderEmployeeMonitoringStream = renderEmployeeMonitoringStream;

function openLogMilestoneModal(empId) {
    const emp = window.perfRoster.find(e => e.id === empId || e.id === ('emp-' + empId)) || window.perfRoster[0];
    if (!emp) return;

    window.selectedEmployeeContext = emp;

    const empIdField = document.getElementById('milestone-emp-id');
    const empNameEl = document.getElementById('milestone-emp-name');
    const empPosEl = document.getElementById('milestone-emp-pos');
    const goalSelect = document.getElementById('milestone-goal-select');

    if (empIdField) empIdField.value = emp.id;
    if (empNameEl) empNameEl.innerText = emp.name;
    if (empPosEl) empPosEl.innerText = `${emp.position} · ${emp.department}`;

    if (goalSelect) {
        goalSelect.innerHTML = '';
        const listGoals = (emp.goals && emp.goals.length > 0) ? emp.goals : (window.dbGoals || []);
        listGoals.forEach((g, idx) => {
            const opt = document.createElement('option');
            opt.value = g.id || idx;
            opt.textContent = `${idx + 1}. ${g.title} (${g.target_metric || g.kpi || 'Key Metric'})`;
            opt.dataset.kpi = g.target_metric || g.kpi || '';
            
            // Calculate goal's individual real progress
            const tasks = g.tasks || [];
            const done = tasks.filter(t => t.status === 'completed').length;
            const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : (typeof g.task_progress === 'number' ? g.task_progress : (g.milestoneProgress || g.progress || 0));
            opt.dataset.progress = progress;

            goalSelect.appendChild(opt);
        });
    }

    onMilestoneGoalChange();
    openModal('modal-log-milestone');
}
window.openLogMilestoneModal = openLogMilestoneModal;

function onMilestoneGoalChange() {
    const goalSelect = document.getElementById('milestone-goal-select');
    const actualMetricField = document.getElementById('milestone-actual-metric');
    const rangeEl = document.getElementById('milestone-progress-range');
    const valEl = document.getElementById('milestone-progress-val');

    if (goalSelect && goalSelect.selectedIndex >= 0) {
        const selectedOpt = goalSelect.options[goalSelect.selectedIndex];
        if (selectedOpt) {
            if (actualMetricField) {
                actualMetricField.placeholder = `Target was: ${selectedOpt.dataset.kpi || 'e.g. 95% Accuracy'}`;
            }
            const realProgress = parseInt(selectedOpt.dataset.progress || '0', 10);
            if (rangeEl) rangeEl.value = realProgress;
            if (valEl) valEl.textContent = `${realProgress}%`;
        }
    }
}
window.onMilestoneGoalChange = onMilestoneGoalChange;

function logAchievementPrompt() {
    const activeEmpId = window.selectedEmployeeContext?.id || 'emp-101';
    openLogMilestoneModal(activeEmpId);
}
window.logAchievementPrompt = logAchievementPrompt;

async function saveMilestoneLog(event) {
    if (event) event.preventDefault();

    const empId = document.getElementById('milestone-emp-id')?.value;
    const goalId = document.getElementById('milestone-goal-select')?.value;
    const milestoneTitle = document.getElementById('milestone-title')?.value.trim();
    const actualMetric = document.getElementById('milestone-actual-metric')?.value.trim();
    const progressVal = parseInt(document.getElementById('milestone-progress-range')?.value || '85', 10);
    const accomplishments = document.getElementById('milestone-accomplishments')?.value.trim();
    const challenges = document.getElementById('milestone-challenges')?.value.trim();
    const feedback = document.getElementById('milestone-feedback')?.value.trim();
    const supportingEvidence = document.getElementById('milestone-evidence')?.value.trim();
    const notes = document.getElementById('milestone-notes')?.value?.trim() || feedback;

    const emp = window.perfRoster.find(e => e.id === empId);
    if (!emp) return;

    const btn = document.getElementById('btn-save-milestone');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Saving to Supabase...';
    }

    try {
        // Save milestone & KPI progress dynamically to Supabase performance_monitoring table
        await PerformanceAPI.logMilestone({
            id: goalId,
            goal_id: goalId,
            employee_id: empId,
            milestone_title: milestoneTitle,
            actual_metric: actualMetric,
            progress: progressVal,
            accomplishments: accomplishments,
            challenges: challenges,
            feedback: feedback,
            supporting_evidence: supportingEvidence,
            notes: notes
        });

        if (emp.goals) {
            const targetGoal = emp.goals.find(g => String(g.id) === String(goalId));
            if (targetGoal) {
                targetGoal.milestoneProgress = progressVal;
                targetGoal.actualMetric = actualMetric;
                if (notes) targetGoal.supervisor_notes = notes;
            }
        }

        emp.monitoringProgress = calculateEmployeeProgress(emp);
        emp.monitoringStatus = emp.monitoringProgress >= 90 ? 'Exceeding' : (emp.monitoringProgress >= 75 ? 'On Track' : 'Needs Support');

        addMilestoneToTimeline(emp, {
            title: milestoneTitle,
            actualMetric: actualMetric,
            progress: progressVal,
            accomplishments: accomplishments,
            challenges: challenges,
            feedback: feedback,
            supportingEvidence: supportingEvidence,
            notes: notes
        });

        closeModal('modal-log-milestone');
        renderMonitoringRosterTable();

        if (typeof showToast === 'function') {
            showToast(`🎉 Shift monitoring log saved to Supabase for ${emp.name}!`, 'success');
        }

        if (typeof loadLiveNotifications === 'function') {
            loadLiveNotifications(window.activePersonaRole || 'Supervisor');
        }
    } catch (err) {
        console.error('Error saving milestone to Supabase:', err);
        if (typeof showToast === 'function') {
            showToast(err.message || 'Failed to save milestone to database.', 'error');
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-check text-[10px]"></i><span>Save Milestone &amp; Update KPI</span>';
        }
    }
}
window.saveMilestoneLog = saveMilestoneLog;

function addMilestoneToTimeline(emp, data) {
    const container = document.getElementById('timeline-stream-container');
    if (!container) return;

    const item = document.createElement('div');
    item.className = 'flex items-start space-x-3.5 group';
    item.innerHTML = `
        <div class="flex flex-col items-center self-stretch">
            <div class="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 mt-1 flex-shrink-0"></div>
            <div class="w-0.5 flex-1 bg-slate-200 my-1 min-h-[36px]"></div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 flex-1 hover:border-emerald-200 transition">
            <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">Shift Progress Log</span>
                <span class="text-[10px] text-slate-400 font-mono">Just Now</span>
            </div>
            
            <p class="font-bold text-slate-900 text-xs">${data.title}</p>
            
            <div class="flex items-center space-x-2 text-[10px]">
                <span class="font-bold text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">${data.actualMetric}</span>
                <span class="text-slate-400 font-semibold">&bull; Progress: <strong class="text-emerald-700">${data.progress}% Met</strong></span>
            </div>

            ${data.accomplishments ? `
            <div class="text-[11px] bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 text-amber-950">
                <span class="font-bold text-[10px] text-amber-800 flex items-center space-x-1 mb-0.5">
                    <i class="fas fa-trophy text-amber-600"></i>
                    <span>Accomplishment:</span>
                </span>
                <p class="leading-relaxed">${data.accomplishments}</p>
            </div>` : ''}

            ${data.challenges ? `
            <div class="text-[11px] bg-rose-50/70 p-2.5 rounded-xl border border-rose-200/80 text-rose-950">
                <span class="font-bold text-[10px] text-rose-800 flex items-center space-x-1 mb-0.5">
                    <i class="fas fa-triangle-exclamation text-rose-600"></i>
                    <span>Challenge / Obstacle:</span>
                </span>
                <p class="leading-relaxed">${data.challenges}</p>
            </div>` : ''}

            ${data.feedback ? `
            <div class="text-[11px] bg-purple-50/70 p-2.5 rounded-xl border border-purple-200/80 text-purple-950">
                <span class="font-bold text-[10px] text-purple-800 flex items-center space-x-1 mb-0.5">
                    <i class="fas fa-comments text-purple-600"></i>
                    <span>Coaching Feedback:</span>
                </span>
                <p class="leading-relaxed italic">"${data.feedback}"</p>
            </div>` : ''}

            ${data.supportingEvidence ? `
            <div class="pt-1 text-[11px] text-primary font-medium flex items-center space-x-1.5">
                <i class="fas fa-paperclip text-slate-400"></i>
                <span class="text-slate-500">Supporting Evidence:</span>
                <strong class="text-primary font-semibold">${data.supportingEvidence}</strong>
            </div>` : ''}
        </div>
    `;
    container.insertBefore(item, container.firstChild);
}

function generateAiFeedback() {
    const tone = document.getElementById('ai-feedback-tone')?.value || 'motivational';
    const outputField = document.getElementById('ai-generated-feedback-text');
    const btn = document.getElementById('btn-generate-ai-feedback');
    const emp = window.selectedEmployeeContext || window.perfRoster[0];

    if (!outputField) return;

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> Synthesizing Hospitality Intelligence...';
    }

    setTimeout(() => {
        let comment = '';
        if (tone === 'motivational') {
            comment = `Executive Recognition: ${emp.name} has demonstrated exemplary dedication to Oxford Suites 5-Star guest standards. Maintaining an attendance rating of ${(emp.attendance?.percentage || '100%')} and pacing ${emp.monitoringProgress || 88}% towards quarterly KPIs indicates strong readiness for senior shift leadership and sommelier cross-training.`;
        } else if (tone === 'constructive') {
            comment = `Development Calibration: ${emp.name} is performing steadily at ${emp.monitoringProgress || 85}% target progress. To consistently clear the +18% upsell target before Q3 close, recommend dedicated 1-on-1 coaching on French wine reserves and fast-turnover POS check-ins during Friday-Saturday dinner shifts.`;
        } else {
            comment = `Operational Alignment: Goal pacing currently sits at ${emp.monitoringProgress || 80}%. While customer sentiment remains positive at ⭐ ${(emp.customerRating || 4.9).toFixed(1)}, adherence to standard operating procedure benchmarks must be reinforced to ensure zero room turnover delays during peak check-in windows.`;
        }

        outputField.value = comment;
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sparkles mr-1.5"></i> Regenerate AI Insight';
        }
    }, 450);
}
window.generateAiFeedback = generateAiFeedback;

function applyAiFeedbackToNotes() {
    const feedback = document.getElementById('ai-generated-feedback-text')?.value;
    if (!feedback) {
        if (typeof showToast === 'function') showToast('Generate feedback first before applying.', 'info');
        return;
    }
    const emp = window.selectedEmployeeContext || window.perfRoster[0];
    addMilestoneToTimeline(emp, {
        title: 'Supervisor AI Continuous Coaching Note',
        actualMetric: 'Coaching Synchronized',
        progress: emp.monitoringProgress || 85,
        notes: feedback
    });
    closeModal('modal-ai-feedback');
    if (typeof showToast === 'function') {
        showToast('AI coaching feedback synchronized to employee stream! 🚀', 'success');
    }
}
window.applyAiFeedbackToNotes = applyAiFeedbackToNotes;

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
        const att = emp.attendance || { present: 23, absent: 0, percentage: '100%' };
        const mgrRating = typeof emp.managerRating === 'number' ? emp.managerRating.toFixed(1) : '4.8';
        const custRating = typeof emp.customerRating === 'number' ? emp.customerRating.toFixed(1) : '4.9';

        tr.innerHTML = `
            <td class="px-5 py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg || 'bg-primary'} text-white font-bold text-xs flex items-center justify-center">${emp.avatar || emp.name.slice(0, 2).toUpperCase()}</div>
                    <div>
                        <p class="font-bold text-slate-900 text-sm">${emp.name}</p>
                        <p class="text-[11px] text-slate-500">${emp.position} · <span class="text-primary font-bold">${emp.department}</span></p>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4 font-bold text-slate-800">${att.present}P / ${att.absent}A (${att.percentage})</td>
            <td class="px-5 py-4 font-bold text-amber-600">⭐ ${mgrRating} Mgr / ⭐ ${custRating} Cust</td>
            <td class="px-5 py-4">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${emp.evaluationStatus === 'Rated' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                    ${emp.evaluationStatus || 'Pending Evaluation'}
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
