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
    },

    deleteTask(taskId) {
        return this.request('delete_task', 'POST', { id: taskId });
    },

    resetTask(taskId) {
        return this.request('reset_task', 'POST', { id: taskId });
    },

    // 10. Evaluation & Multi-Factor Appraisal (Database Driven)
    getEvaluations(filters = {}) {
        return this.request('get_evaluations', 'GET', filters);
    },

    getEvaluation(employeeId) {
        return this.request('get_evaluation', 'GET', { employee_id: employeeId });
    },

    submitAppraisal(data) {
        return this.request('submit_appraisal', 'POST', data);
    },

    submitSelfAssessment(data) {
        return this.request('submit_self_assessment', 'POST', data);
    },

    calibrateEvaluation(data) {
        return this.request('calibrate_evaluation', 'POST', data);
    },

    setNeedsTraining(data) {
        return this.request('set_needs_training', 'POST', data);
    },

    incrementRetryCount(data) {
        return this.request('set_needs_training', 'POST', data);
    },

    retryPlan(data) {
        return this.request('retry_plan', 'POST', data);
    },

    // 11. Delete and Bulk Delete Goals
    deleteGoal(id) {
        return this.request('delete_goal', 'POST', { id });
    },

    bulkDeleteGoals(ids) {
        return this.request('bulk_delete_goals', 'POST', { ids });
    },

    // 12. Supervisors List from Database
    getSupervisors() {
        return this.request('get_supervisors', 'GET');
    },

    // 13. Award XP into XP Ledger
    awardPerformanceXP(employeeId, points, evalId, reason = 'Performance Kudos') {
        return this.request('award_performance_xp', 'POST', {
            employee_id: employeeId,
            points: points,
            eval_id: evalId,
            reason: reason
        });
    },

    // 14. Mark Goal as Completed
    markGoalCompleted(employeeId, goalId = null) {
        return this.request('mark_goal_completed', 'POST', {
            employee_id: employeeId,
            goal_id: goalId
        });
    },

    // 15. Training Programs & Needs
    getTrainingPrograms() {
        return this.request('get_training_programs', 'GET');
    },

    getTrainingNeeds() {
        return this.request('get_training_needs', 'GET');
    },

    assignFormalCurriculum(data) {
        return this.request('assign_formal_training', 'POST', data);
    },

    // 16. Continue to Final 1-on-1 Evaluation (Sets retry_count = 4)
    continueToFinalEvaluation(employeeId, goalId = null) {
        return this.request('continue_to_final_evaluation', 'POST', {
            employee_id: employeeId,
            goal_id: goalId
        });
    },

    // 17. Mark Performance Goal as Failed
    markGoalFailed(goalId, employeeId = null) {
        return this.request('mark_goal_failed', 'POST', {
            goal_id: goalId,
            employee_id: employeeId
        });
    }
};

window.PerformanceAPI = PerformanceAPI;
window.dbGoals = [];
window.dbGeneralTasks = [];
window.dbEvaluations = [];
window.dbGoalTasks = [];
window.dbTrainingNeeds = [];
window.dbTrainingPrograms = [];

/**
 * Universal safe helper to get dbEvaluations as an Array
 */
function getDbEvaluations() {
    if (Array.isArray(window.dbEvaluations)) return window.dbEvaluations;
    if (window.dbEvaluations && Array.isArray(window.dbEvaluations.evaluations)) return window.dbEvaluations.evaluations;
    if (window.dbEvaluations && Array.isArray(window.dbEvaluations.data)) return window.dbEvaluations.data;
    if (window.dbEvaluations && typeof window.dbEvaluations === 'object') {
        const values = Object.values(window.dbEvaluations).filter(v => v && typeof v === 'object' && (v.employee_id || v.id));
        if (values.length > 0) return values;
    }
    return [];
}
window.getDbEvaluations = getDbEvaluations;

/**
 * Universal safe helper to update or push evaluation record in dbEvaluations
 */
function updateDbEvaluationRecord(record) {
    if (!record || !record.employee_id) return;
    if (!Array.isArray(window.dbEvaluations)) {
        window.dbEvaluations = getDbEvaluations();
    }
    const idx = window.dbEvaluations.findIndex(ev => isSameEmployee(ev.employee_id, record.employee_id));
    if (idx >= 0) {
        window.dbEvaluations[idx] = Object.assign({}, window.dbEvaluations[idx], record);
    } else {
        window.dbEvaluations.push(record);
    }
}
window.updateDbEvaluationRecord = updateDbEvaluationRecord;

/**
 * Get active training need record for employee from training_needs
 */
function getEmployeeTrainingNeed(empId) {
    if (!Array.isArray(window.dbTrainingNeeds) || window.dbTrainingNeeds.length === 0) return null;
    const list = window.dbTrainingNeeds.filter(tn => isSameEmployee(tn.employee_id, empId) || isSameEmployee(tn.employeeId, empId));
    if (list.length === 0) return null;
    // Prioritize active In Training records
    const active = list.find(tn => tn.status === 'In Training' || tn.status === 'In Progress' || tn.status === 'Identified');
    return active || list[list.length - 1];
}
window.getEmployeeTrainingNeed = getEmployeeTrainingNeed;

/**
 * Check if employee is currently flagged for Needs Training or enrolled in training_needs
 */
function isEmployeeInTraining(empId) {
    const empGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, empId));
    const hasInTrainingGoal = empGoals.some(g => !!g.in_training);
    const hasNeedsTrainingGoal = empGoals.some(g => !!g.needs_training);
    const tn = getEmployeeTrainingNeed(empId);
    if (hasInTrainingGoal || hasNeedsTrainingGoal) return true;
    if (tn && (tn.status === 'In Training' || tn.status === 'Identified' || tn.status === 'In Progress')) return true;
    return false;
}
window.isEmployeeInTraining = isEmployeeInTraining;

/**
 * Check if employee has a recorded score / completed training in training_needs
 */
function isEmployeeTrainingScored(empId) {
    const tn = getEmployeeTrainingNeed(empId);
    if (!tn) return false;
    const currentScore = parseFloat(tn.current_score || tn.currentScore || 0);
    const status = (tn.status || '').toLowerCase();
    return currentScore > 0 || status === 'resolved' || status === 'completed' || status === 'passed';
}
window.isEmployeeTrainingScored = isEmployeeTrainingScored;

/**
 * Get max retry_count for employee
 */
function getEmployeeRetryCount(empId) {
    const empGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, empId));
    return empGoals.reduce((max, g) => Math.max(max, parseInt(g.retry_count || 0)), 0);
}
window.getEmployeeRetryCount = getEmployeeRetryCount;

/**
 * Check if employee's active goal is permanently Failed
 */
function isEmployeeGoalFailed(empId) {
    const empGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, empId));
    return empGoals.some(g => (g.status || '').toLowerCase() === 'failed');
}
window.isEmployeeGoalFailed = isEmployeeGoalFailed;

window.planningStatusFilter = 'pending';
window.planningSearchQuery = '';
window.approvedSearchQuery = '';
window.monitoringSearchQuery = '';
window.evalSearchQuery = '';
window.reviewSearchQuery = '';
window.idpSearchQuery = '';
window.cycleSearchQuery = '';

// Universal Reusable Action Confirmation Modal Helper
window.showActionConfirmModal = function({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed with this action?',
    confirmBtnText = 'Confirm',
    confirmBtnClass = 'btn-primary',
    iconClass = 'fas fa-triangle-exclamation',
    iconContainerClass = 'bg-amber-100 text-amber-700',
    onConfirm = null
} = {}) {
    const modal = document.getElementById('modal-action-confirmation');
    if (!modal) {
        if (confirm(message)) {
            if (typeof onConfirm === 'function') onConfirm();
        }
        return;
    }
    const titleEl = document.getElementById('confirm-modal-title');
    const msgEl = document.getElementById('confirm-modal-message');
    const iconEl = document.getElementById('confirm-modal-icon');
    const iconContEl = document.getElementById('confirm-modal-icon-container');
    const proceedBtn = document.getElementById('btn-proceed-action-confirm');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (iconEl) iconEl.className = iconClass;
    if (iconContEl) iconContEl.className = `w-12 h-12 rounded-2xl ${iconContainerClass} flex items-center justify-center text-xl font-bold mx-auto`;
    if (proceedBtn) {
        proceedBtn.textContent = confirmBtnText;
        proceedBtn.className = `${confirmBtnClass} px-4 py-2 text-xs font-bold flex-1 shadow-xs`;
        proceedBtn.onclick = function() {
            closeModal('modal-action-confirmation');
            if (typeof onConfirm === 'function') onConfirm();
        };
    }
    openModal('modal-action-confirmation');
};

// Stage Navigation and Cross-Stage Filter Helper
window.searchEmployeeInStage = function(stageKey, employeeName) {
    switchSubTab('perf', stageKey);
    setTimeout(() => {
        let inputId = '';
        let searchFunc = null;
        if (stageKey === 'monitor') {
            inputId = 'search-monitoring-emp';
            searchFunc = window.onMonitoringEmployeeSearch;
        } else if (stageKey === 'eval') {
            inputId = 'search-eval-emp';
            searchFunc = window.onEvalEmployeeSearch;
        } else if (stageKey === 'review') {
            inputId = 'search-review-emp';
            searchFunc = window.onReviewEmployeeSearch;
        } else if (stageKey === 'idp') {
            inputId = 'search-idp-emp';
            searchFunc = window.onIDPEmployeeSearch;
        } else if (stageKey === 'cycle') {
            inputId = 'search-cycle-emp';
            searchFunc = window.onCycleEmployeeSearch;
        }
        if (inputId) {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = employeeName || '';
                if (typeof searchFunc === 'function') {
                    searchFunc(employeeName || '');
                }
            }
        }
    }, 150);
};

// Dynamic Supervisors loader
window.loadSupervisorsForModal = async function() {
    try {
        const select = document.getElementById('goal-target-scope');
        if (!select) return;
        const res = await PerformanceAPI.getSupervisors();
        if (res && Array.isArray(res) && res.length > 0) {
            select.innerHTML = res.map(s => `
                <option value="${s.id}" data-scope="single" data-name="${s.name}" data-dept="${s.department}" data-role="${s.role}">
                    ${s.name} (${s.role} · ${s.position || s.department})
                </option>
            `).join('');
            select.innerHTML += `
                <option value="dept" data-scope="dept" data-name="Entire Department" data-dept="Front Office" data-role="Associate">Entire Department Team</option>
                <option value="property" data-scope="property" data-name="Hotel-wide Benchmark" data-dept="Hotel Operations" data-role="Associate">Hotel-wide Benchmark (All Staff)</option>
            `;
        }
    } catch (e) {
        console.warn('Supervisors load note:', e);
    }
};


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
        selfRating: 0.0,
        managerRating: 0.0,
        supervisorRating: 0.0,
        customerRating: 0.0,
        goalsCount: 3,
        planningStatus: 'Approved',
        approvalStatus: 'Approved',
        monitoringProgress: 0,
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
        selfRating: 0.0,
        managerRating: 0.0,
        supervisorRating: 0.0,
        customerRating: 0.0,
        goalsCount: 1,
        planningStatus: 'Approved',
        approvalStatus: 'Approved',
        monitoringProgress: 0,
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
    // 1. Instant local render so user sees objectives immediately without waiting for network
    if (window.dbGoals && window.dbGoals.length > 0) {
        renderEmployeePulseGoals(window.dbGoals);
    }
    renderPlanningRosterTable();
    renderApprovalRosterTable();
    renderMonitoringRosterTable();
    renderEvaluationRosterTable();
    renderReviewRosterTable();
    renderIDPRosterTable();
    renderCycleRosterTable();
    updateAllPerfStepperBadges();

    if (typeof loadSupervisorsForModal === 'function') {
        loadSupervisorsForModal().catch(() => {});
    }

    // 2. Fetch all dynamic data in parallel for maximum speed
    await loadAndRenderPlanningGoals();
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

    const evalTbody = document.getElementById('eval-roster-tbody');
    if (evalTbody && (!window.perfRoster || window.perfRoster.length === 0)) {
        evalTbody.innerHTML = Array(3).fill(0).map(() => `
            <tr class="animate-pulse border-b border-slate-100 text-xs">
                <td class="px-5 py-4"><div class="flex items-center space-x-3"><div class="w-9 h-9 rounded-full bg-slate-200"></div><div class="space-y-1.5"><div class="h-3.5 bg-slate-200 rounded w-28"></div><div class="h-2.5 bg-slate-100 rounded w-20"></div></div></div></td>
                <td class="px-5 py-4"><div class="h-5 bg-slate-100 rounded-full w-24"></div></td>
                <td class="px-5 py-4"><div class="space-y-1"><div class="h-2.5 bg-slate-200 rounded w-16"></div><div class="w-full bg-slate-200 h-1.5 rounded-full"></div></div></td>
                <td class="px-5 py-4"><div class="h-5 bg-slate-200 rounded w-16"></div></td>
                <td class="px-5 py-4"><div class="h-5 bg-slate-200 rounded w-16"></div></td>
                <td class="px-5 py-4 text-center"><div class="h-5 bg-slate-200 rounded-full w-16 mx-auto"></div></td>
                <td class="px-5 py-4 text-right"><div class="h-7 bg-slate-200 rounded-lg w-20 ml-auto"></div></td>
            </tr>
        `).join('');
    }

    const tbodies = [
        'approve-goals-tbody',
        'monitoring-roster-tbody',
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
 * 1. ASYNC AJAX DATA LOADER & PLANNING STAGE RENDERER (PARALLEL FETCH)
 * -------------------------------------------------------------
 */
async function loadAndRenderPlanningGoals() {
    renderPerformanceSkeletons();
    try {
        // High-speed parallel fetch of all performance data
        const [planResult, monResult, evalResult, needsResult] = await Promise.allSettled([
            PerformanceAPI.getPlanningData(),
            PerformanceAPI.getMonitoringData(),
            PerformanceAPI.getEvaluations(),
            PerformanceAPI.getTrainingNeeds()
        ]);

        const data = planResult.status === 'fulfilled' && planResult.value ? planResult.value : {};
        const goals = data.goals || [];
        const generalTasks = data.general_tasks || [];
        window.dbGoals = goals;
        window.dbGeneralTasks = generalTasks;

        // Apply monitoring roster if available
        if (monResult.status === 'fulfilled' && monResult.value?.roster && Array.isArray(monResult.value.roster)) {
            monResult.value.roster.forEach(dynEmp => {
                const existing = (window.perfRoster || []).find(e => isSameEmployee(e.id, dynEmp.id));
                if (existing) {
                    Object.assign(existing, dynEmp);
                } else {
                    window.perfRoster.push(dynEmp);
                }
            });
        }

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
            const hasPending = emp.goals.some(g => {
                const st = (g.status || '').toLowerCase();
                return st !== 'approved' && st !== 'completed' && st !== 'failed';
            });
            const allFailed = emp.goals.length > 0 && emp.goals.every(g => (g.status || '').toLowerCase() === 'failed');
            emp.planningStatus = allFailed ? 'Failed' : (hasPending ? 'Pending Approval' : (emp.goals.length > 0 ? 'Approved' : 'Draft'));
            emp.approvalStatus = emp.planningStatus;
        });

        // Parse evaluations data
        if (evalResult.status === 'fulfilled' && evalResult.value) {
            const evalData = evalResult.value;
            const evList = Array.isArray(evalData) ? evalData : (Array.isArray(evalData?.evaluations) ? evalData.evaluations : (Array.isArray(evalData?.data) ? evalData.data : []));
            window.dbEvaluations = evList;

            (window.perfRoster || []).forEach(emp => {
                const ev = evList.find(rec => isSameEmployee(emp.id, rec.employee_id)) || emp.evaluationRecord;
                if (ev) {
                    emp.evaluationRecord = ev;
                    const selfScore = (ev.self_evaluation !== undefined && ev.self_evaluation !== null && parseFloat(ev.self_evaluation) > 0)
                        ? parseFloat(ev.self_evaluation)
                        : ((ev.self_rating !== undefined && ev.self_rating !== null && parseFloat(ev.self_rating) > 0)
                            ? parseFloat(ev.self_rating)
                            : (emp.selfRating || 0.0));
                    const supScore = (ev.supervisor_rating !== undefined && ev.supervisor_rating !== null && parseFloat(ev.supervisor_rating) > 0)
                        ? parseFloat(ev.supervisor_rating)
                        : (emp.supervisorRating || 0.0);
                    emp.selfRating = selfScore || 0.0;
                    emp.supervisorRating = supScore;
                    emp.managerRating = supScore;
                    emp.evaluationStatus = ev.status || (supScore > 0 ? 'Rated' : (selfScore ? 'Self-Reviewed' : 'Pending Evaluation'));
                    if (ev.tier_label) emp.tierLabel = ev.tier_label;
                }
            });
        }

        // Parse training needs data
        if (needsResult.status === 'fulfilled' && needsResult.value) {
            const needsData = needsResult.value;
            const needsList = Array.isArray(needsData) ? needsData : (Array.isArray(needsData?.data) ? needsData.data : []);
            window.dbTrainingNeeds = needsList;
        }

        // Update Planning Hero KPI Cards
        const activeTargetsEl = document.getElementById('perf-plan-active-targets');
        if (activeTargetsEl) {
            activeTargetsEl.textContent = `${data.total_goals || goals.length} Active Targets`;
        }
        const weightAllocEl = document.getElementById('perf-plan-weight-alloc');
        if (weightAllocEl) {
            weightAllocEl.textContent = `${data.calibration || '100%'} Calibrated`;
        }

        // Fast render of active objectives and tables
        renderEmployeePulseGoals(goals);
        renderPlanningRosterTable();
        renderApprovalRosterTable();
        renderMonitoringRosterTable();
        renderGeneralTasksTable();
        renderEvaluationRosterTable();
        renderReviewRosterTable();
        renderIDPRosterTable();
        renderCycleRosterTable();
        updateAllPerfStepperBadges();

    } catch (err) {
        console.warn('Fallback to local state rendering:', err);
        renderEmployeePulseGoals(window.dbGoals || []);
        renderPlanningRosterTable();
        renderGeneralTasksTable();
        renderEvaluationRosterTable();
        renderReviewRosterTable();
        renderIDPRosterTable();
        renderCycleRosterTable();
        updateAllPerfStepperBadges();
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
    const currentUserId = (userObj.id || userObj.employee_code || (typeof activePersonaKey !== 'undefined' && activePersonaKey === 'supervisor' ? 'emp-102' : 'emp-101')).toLowerCase().trim();
    const currentRole = window.activePersonaRole || userObj.role || 'Associate';
    const isAssociate = (currentRole.toLowerCase() === 'associate' || currentRole.toLowerCase() === 'employee' || (typeof activePersonaKey !== 'undefined' && (activePersonaKey === 'associate' || activePersonaKey === 'employee')));

    let empGoals = allGoals.filter(g => {
        const goalEmpId = (g.employee_id || '').toLowerCase().trim();
        if (currentUserId === 'emp-101') {
            return goalEmpId === 'emp-101' || goalEmpId === 'emp-1' || goalEmpId === 'oxf-emp-1001';
        } else if (currentUserId === 'emp-102') {
            return goalEmpId === 'emp-102' || goalEmpId === 'emp-2' || goalEmpId === 'oxf-sup-2001';
        } else {
            return goalEmpId === currentUserId;
        }
    });

    const totalGoalCount = empGoals.length;
    const completedOrApprovedCount = empGoals.filter(g => {
        const st = (g.status || '').toLowerCase();
        return st === 'approved' || st === 'completed' || st === 'passed';
    }).length;

    if (countBadge) {
        countBadge.textContent = `${totalGoalCount}/2 Objectives`;
    }

    const kpiGoalsRatio = document.getElementById('kpi-goals-ratio');
    if (kpiGoalsRatio) {
        kpiGoalsRatio.textContent = `${completedOrApprovedCount} of ${totalGoalCount} Passed (${totalGoalCount}/2 Set)`;
    }

    // Fetch prescribed LMS list if not cached yet
    if ((!window.dynamicLmsState || !window.dynamicLmsState.prescribed) && !window._fetchingPulsePrescribed) {
        window._fetchingPulsePrescribed = true;
        fetch(`api/lms.php?action=get_prescribed&employee=${encodeURIComponent(currentUserId)}`)
            .then(res => res.json())
            .then(json => {
                if (json.success && Array.isArray(json.data)) {
                    if (!window.dynamicLmsState) window.dynamicLmsState = {};
                    window.dynamicLmsState.prescribed = json.data;
                    renderEmployeePulseGoals(empGoals);
                }
            })
            .catch(e => console.error('Error fetching prescribed LMS for goals:', e))
            .finally(() => window._fetchingPulsePrescribed = false);
    }

    // Fetch evaluations list if not cached yet
    if ((!window.dbEvaluations || window.dbEvaluations.length === 0) && !window._fetchingPulseEvals) {
        window._fetchingPulseEvals = true;
        fetch('api/performance.php?action=get_evaluations')
            .then(res => res.json())
            .then(json => {
                const evList = Array.isArray(json.data) ? json.data : (Array.isArray(json.data?.evaluations) ? json.data.evaluations : (Array.isArray(json.evaluations) ? json.evaluations : []));
                if (evList.length > 0) {
                    window.dbEvaluations = evList;
                    renderEmployeePulseGoals(empGoals);
                }
            })
            .catch(e => console.error('Error fetching evaluations for pulse goals:', e))
            .finally(() => window._fetchingPulseEvals = false);
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
                <p class="text-[11px] text-slate-500 max-w-sm mx-auto">Draft your shift targets for Q3. Once submitted, your supervisor will review and calibrate them. (Max Capacity: 2 Objectives)</p>
                <button onclick="openModal('modal-create-goal')" ${isBlockedFromSettingGoal ? 'disabled' : ''} class="btn-primary px-3 py-1.5 text-xs font-bold inline-flex items-center space-x-1.5 shadow-2xs ${isBlockedFromSettingGoal ? 'opacity-50 cursor-not-allowed' : ''}">
                    <i class="fas fa-plus text-[10px]"></i>
                    <span>Set First Goal</span>
                </button>
            </div>
        `;
        return;
    }

    const evalRec = getDbEvaluations().find(ev => {
        const evEmpId = (ev.employee_id || '').toLowerCase().trim();
        return evEmpId === currentUserId ||
            (currentUserId === 'emp-101' && (evEmpId === 'emp-1' || evEmpId.includes('101') || evEmpId.includes('maria'))) ||
            (currentUserId === 'emp-102' && (evEmpId === 'emp-2' || evEmpId.includes('102') || evEmpId.includes('antonio') || evEmpId.includes('marco')));
    });


    container.innerHTML = empGoals.map((g, idx) => {
        const statusLower = (g.status || '').toLowerCase();
        const isFailed = statusLower.includes('fail') || statusLower.includes('retake') || statusLower.includes('remediat') || statusLower.includes('disapprov') || statusLower.includes('not met');
        const isApproved = statusLower === 'approved' || statusLower === 'completed' || statusLower === 'passed';
        const isRevised = !!g.supervisor_notes || (g.updated_at && g.created_at && g.updated_at !== g.created_at);

        let statusBadgeHtml = '';
        if (isFailed) {
            statusBadgeHtml = `
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center space-x-1 shadow-2xs">
                    <i class="fas fa-times-circle text-rose-600 text-[9px]"></i>
                    <span>Status: Failed (Remediation)</span>
                </span>
            `;
        } else if (statusLower === 'completed') {
            statusBadgeHtml = `
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 inline-flex items-center space-x-1 shadow-2xs">
                    <i class="fas fa-circle-check text-indigo-600 text-[9px]"></i>
                    <span>Status: Completed</span>
                </span>
            `;
        } else if (g.in_training || g.needs_training) {
            statusBadgeHtml = `
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center space-x-1 shadow-2xs">
                    <i class="fas fa-graduation-cap text-amber-700 text-[9px]"></i>
                    <span>Status: In Training</span>
                </span>
            `;
        } else if (statusLower === 'approved') {
            statusBadgeHtml = `
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center space-x-1 shadow-2xs">
                    <i class="fas fa-check-circle text-emerald-600 text-[9px]"></i>
                    <span>Status: Approved & Active</span>
                </span>
            `;
        } else {
            statusBadgeHtml = `
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center space-x-1 shadow-2xs">
                    <i class="fas fa-clock text-amber-600 text-[9px]"></i>
                    <span>Status: Pending Approval</span>
                </span>
            `;
        }

        // Check for prescribed LMS document linked to this goal or employee
        const prescribedList = (window.dynamicLmsState && window.dynamicLmsState.prescribed) || window.dbPrescribedLms || [];
        const matchedLms = prescribedList.find(p => {
            if (p.goal_id && String(p.goal_id) === String(g.id)) return true;
            if (g.lms_id && String(p.lms_id) === String(g.lms_id)) return true;
            return false;
        });

        const lmsTitle = matchedLms ? (matchedLms.document_title || matchedLms.title) : (g.lms_title || g.lms_doc_title || g.prescribed_lms);
        const lmsDocId = matchedLms ? (matchedLms.lms_id || matchedLms.id) : (g.lms_id || '');

        let lmsBannerHtml = '';
        if (lmsTitle) {
            const lmsStatus = matchedLms ? (matchedLms.status || 'Enrolled') : 'Enrolled';
            const isLmsFailed = lmsStatus.toLowerCase().includes('fail') || lmsStatus.toLowerCase().includes('retake');
            const isLmsPassed = lmsStatus.toLowerCase().includes('pass') || lmsStatus.toLowerCase().includes('complet');

            lmsBannerHtml = `
                <div class="p-2.5 bg-blue-50/80 rounded-xl border border-blue-200/90 flex items-center justify-between text-[11px] gap-2 shadow-2xs mt-1">
                    <div class="flex items-center space-x-2 truncate">
                        <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-2xs">
                            <i class="fas fa-book-bookmark"></i>
                        </div>
                        <div class="truncate">
                            <div class="flex items-center space-x-1.5">
                                <span class="text-[9px] font-extrabold text-blue-700 uppercase tracking-wider">Prescribed LMS Handbook</span>
                                ${isLmsPassed ? '<span class="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Passed</span>' : (isLmsFailed ? '<span class="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">Failed / Needs Retake</span>' : '<span class="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">' + lmsStatus + '</span>')}
                            </div>
                            <span class="font-bold text-slate-900 truncate block text-xs mt-0.5">${lmsTitle}</span>
                        </div>
                    </div>
                    <button type="button" onclick="switchPillar('pillar-training'); if(typeof openBookReader === 'function') openBookReader('${lmsDocId}');"
                        class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] flex-shrink-0 shadow-2xs transition flex items-center space-x-1">
                        <i class="fas fa-book-open text-[9px]"></i>
                        <span>Read SOP</span>
                    </button>
                </div>
            `;
        }

        let evalBannerHtml = '';
        if (evalRec) {
            const tierLabel = evalRec.tier_label || 'Appraised';
            const evalStatus = evalRec.status || 'Calibrated';
            const evalScore = parseFloat(evalRec.calibrated_score || evalRec.supervisor_rating || 0);
            const evalScoreStr = evalScore > 0 ? `⭐ ${evalScore.toFixed(2)} / 5.0` : 'Pending Rating';
            
            evalBannerHtml = `
                <div class="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center justify-between text-[11px] gap-2 shadow-2xs mt-1">
                    <div class="flex items-center space-x-2 truncate">
                        <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-2xs">
                            <i class="fas fa-award"></i>
                        </div>
                        <div class="truncate">
                            <div class="flex items-center space-x-1.5">
                                <span class="text-[9px] font-extrabold text-emerald-800 uppercase tracking-wider">Formal Evaluation &amp; Tier</span>
                                <span class="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">${evalStatus}</span>
                            </div>
                            <span class="font-bold text-slate-900 truncate block text-xs mt-0.5">${tierLabel} <span class="text-emerald-700 font-mono text-[10px]">(${evalScoreStr})</span></span>
                        </div>
                    </div>
                </div>
            `;
        }

        const tasks = g.tasks || [];
        const generalTasks = tasks.filter(t => t.task_type === 'general');
        const specificTasks = tasks.filter(t => t.task_type === 'specific');
        const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
        const totalTasksCount = tasks.length;
        const progressPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : (g.status === 'Completed' ? 100 : 0);

        return `
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between hover:border-primary/40 transition">
                <div class="space-y-2">
                    <div class="flex items-center justify-between gap-2 flex-wrap">
                        <div class="flex items-center space-x-1.5">
                            ${statusBadgeHtml}
                            ${isRevised ? `<span class="px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center space-x-0.5"><i class="fas fa-pen-to-square text-[7px]"></i><span>Revised</span></span>` : ''}
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-[9px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">${idx + 1}/2</span>
                            <span class="text-[10px] text-slate-400 font-mono">Target: ${g.target_date || 'Q3 2026'}</span>
                        </div>
                    </div>

                    <div>
                        <h4 class="font-bold text-slate-900 text-xs leading-snug">${g.title}</h4>
                        <p class="text-[10px] text-slate-500">${g.department || 'Front Office'}</p>
                    </div>

                    ${evalBannerHtml}
                    ${lmsBannerHtml}


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
                            <div class="${progressPct >= 100 ? 'bg-emerald-500' : (isFailed ? 'bg-rose-500' : 'bg-primary')} h-1.5 rounded-full transition-all duration-500" style="width: ${progressPct}%"></div>
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
            const lmsInfo = checkLmsTaskProgress(t, g.employee_id);
            return `
                                        <div class="p-2.5 rounded-xl border ${isDone ? 'bg-emerald-50/60 border-emerald-200/90 text-emerald-950 shadow-2xs' : 'bg-purple-50/30 border-purple-200 text-slate-800 hover:border-purple-300'} text-[11px] space-y-1.5 transition">
                                            <div class="flex items-start justify-between gap-2">
                                                <label class="flex items-start space-x-2.5 cursor-pointer flex-1 select-none">
                                                    <input type="checkbox" ${isDone ? 'checked disabled' : `onchange="triggerTaskCompletionModal('${t.id}', '${g.id}', this)"`} class="mt-0.5 w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer">
                                                    <div class="space-y-0.5">
                                                        <span class="${isDone ? 'line-through text-slate-500 font-medium' : 'font-semibold text-slate-900'} leading-snug block">${t.title}</span>
                                                        ${lmsInfo.isLmsTask ? `
                                                            <div class="flex items-center space-x-1.5 pt-0.5">
                                                                <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${lmsInfo.canComplete ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-900 border border-amber-200'}" title="${lmsInfo.canComplete ? 'LMS progress 100% complete' : 'Must reach 100% progress in LMS before checking done'}">
                                                                    <i class="fas fa-book-open text-[8px]"></i>
                                                                    <span>LMS: ${lmsInfo.progress}%</span>
                                                                    ${!lmsInfo.canComplete ? '<span class="text-[8px] font-extrabold text-amber-700">(Req: 100%)</span>' : '<i class="fas fa-check text-[8px] text-emerald-600 ml-0.5"></i>'}
                                                                </span>
                                                                ${!lmsInfo.canComplete && lmsInfo.lmsId ? `
                                                                    <button type="button" onclick="openBookReader('${lmsInfo.lmsId}')" class="text-primary hover:underline font-bold text-[9px] inline-flex items-center space-x-0.5">
                                                                        <i class="fas fa-book-reader"></i>
                                                                        <span>Read SOP &rarr;</span>
                                                                    </button>
                                                                ` : ''}
                                                            </div>
                                                        ` : ''}
                                                    </div>
                                                </label>
                                                <div class="flex items-center space-x-1.5 flex-shrink-0">
                                                    ${isDone ? `
                                                        <span class="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                                                             Done ${completedDateStr ? `(${completedDateStr})` : ''}
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
                        ${(g.status === 'Completed' || statusLower === 'completed') ? `
                            <button disabled class="text-slate-400 text-[10px] font-bold inline-flex items-center space-x-1 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md cursor-not-allowed opacity-50 shadow-2xs" title="Performance objective is completed. Self evaluation is finalized.">
                                <i class="fas fa-lock text-[9px]"></i>
                                <span>Self Evaluation</span>
                            </button>
                        ` : `
                            <button onclick="openEmployeeSelfEvalModal('${g.id}', '${g.employee_id || currentUserId}')" class="text-purple-700 hover:text-purple-900 text-[10px] font-bold inline-flex items-center space-x-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-md transition shadow-2xs" title="Submit Self Evaluation Rating & Reflections">
                                <i class="fas fa-user-pen text-[9px] text-purple-600"></i>
                                <span>Self Evaluation</span>
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
window.renderEmployeePulseGoals = renderEmployeePulseGoals;

function openEmployeeSelfEvalModal(goalId, empId) {
    const goal = (window.dbGoals || []).find(g => String(g.id) === String(goalId));
    const targetEmpId = empId || goal?.employee_id || 'emp-101';
    const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, targetEmpId));

    const goalIdInput = document.getElementById('self-eval-goal-id');
    const empIdInput = document.getElementById('self-eval-emp-id');
    const goalTitleEl = document.getElementById('self-eval-goal-title');
    const metricEl = document.getElementById('self-eval-target-metric');
    const ratingInput = document.getElementById('self-eval-rating-input');
    const previewEl = document.getElementById('self-eval-score-preview');
    const notesInput = document.getElementById('self-eval-notes-input');

    if (goalIdInput) goalIdInput.value = goalId || '';
    if (empIdInput) empIdInput.value = targetEmpId;
    if (goalTitleEl) goalTitleEl.textContent = goal ? goal.title : 'Performance Objective';
    if (metricEl) metricEl.textContent = goal ? goal.target_metric : 'CSAT > 90%';

    const currentScore = (evalRec?.self_evaluation !== undefined && evalRec?.self_evaluation !== null && parseFloat(evalRec.self_evaluation) > 0)
        ? parseFloat(evalRec.self_evaluation)
        : ((evalRec?.self_rating !== undefined && evalRec?.self_rating !== null && parseFloat(evalRec.self_rating) > 0)
            ? parseFloat(evalRec.self_rating)
            : 1.0);
    if (ratingInput) ratingInput.value = currentScore;
    if (previewEl) previewEl.textContent = `⭐ ${currentScore.toFixed(2)} / 5.0`;

    if (typeof openModal === 'function') {
        openModal('modal-submit-self-evaluation');
    }
}
window.openEmployeeSelfEvalModal = openEmployeeSelfEvalModal;

async function handleEmployeeSelfEvalSubmit(event) {
    if (event) event.preventDefault();

    const goalId = document.getElementById('self-eval-goal-id')?.value;
    const empId = document.getElementById('self-eval-emp-id')?.value || 'emp-101';
    const rating = parseFloat(document.getElementById('self-eval-rating-input')?.value || '4.5');
    const notes = document.getElementById('self-eval-notes-input')?.value || '';

    showActionConfirmModal({
        title: 'Submit Self Evaluation',
        message: `Submit a self evaluation rating of ⭐ ${rating.toFixed(2)} / 5.0 for this performance objective? This will be recorded directly into your calibration record.`,
        confirmBtnText: 'Submit Self Evaluation',
        confirmBtnClass: 'btn-primary bg-purple-600 hover:bg-purple-700 text-white',
        iconClass: 'fas fa-user-pen',
        iconContainerClass: 'bg-purple-100 text-purple-700',
        onConfirm: async () => {
            const btn = document.getElementById('btn-submit-self-eval');
            const origHtml = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Submitting...</span>';
            }

            try {
                const res = await PerformanceAPI.submitSelfAssessment({
                    employee_id: empId,
                    goal_id: goalId,
                    self_evaluation: rating,
                    notes: notes
                });

                if (typeof showToast === 'function') {
                    showToast(`⭐ Self evaluation of ${rating.toFixed(2)}/5.0 submitted successfully!`, 'success');
                }

                if (typeof closeModal === 'function') {
                    closeModal('modal-submit-self-evaluation');
                }

                // Update dbEvaluations in memory
                updateDbEvaluationRecord({
                    employee_id: empId,
                    self_evaluation: rating,
                    status: 'Self-Reviewed'
                });

                await loadAndRenderPlanningGoals();
                renderEvaluationRosterTable();
                renderReviewRosterTable();
            } catch (err) {
                console.error('Self evaluation error:', err);
                if (typeof showToast === 'function') {
                    showToast(err.message || 'Failed to submit self evaluation.', 'error');
                }
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = origHtml;
                }
            }
        }
    });
}
window.handleEmployeeSelfEvalSubmit = handleEmployeeSelfEvalSubmit;

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
    let allGoals = window.dbGoals || [];

    // Filter by search query
    if (window.planningSearchQuery && window.planningSearchQuery.trim()) {
        const q = window.planningSearchQuery.toLowerCase().trim();
        allGoals = allGoals.filter(g => {
            const title = (g.title || '').toLowerCase();
            const dept = (g.department || '').toLowerCase();
            const metric = (g.target_metric || '').toLowerCase();
            let emp = window.perfRoster.find(e => isSameEmployee(e.id, g.employee_id));
            const empName = emp ? emp.name.toLowerCase() : '';
            return title.includes(q) || dept.includes(q) || metric.includes(q) || empName.includes(q);
        });
    }

    // Filter by status dropdown (pending / approved / completed / failed / all)
    if (window.planningStatusFilter && window.planningStatusFilter !== 'all') {
        const sf = window.planningStatusFilter.toLowerCase();
        if (sf === 'pending') {
            allGoals = allGoals.filter(g => {
                const st = (g.status || '').toLowerCase();
                return st !== 'approved' && st !== 'completed' && st !== 'failed';
            });
        } else if (sf === 'approved') {
            allGoals = allGoals.filter(g => (g.status || '').toLowerCase() === 'approved');
        } else if (sf === 'completed') {
            allGoals = allGoals.filter(g => (g.status || '').toLowerCase() === 'completed');
        } else if (sf === 'failed') {
            allGoals = allGoals.filter(g => (g.status || '').toLowerCase() === 'failed');
        }
    }

    if (allGoals.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="p-8 text-center text-slate-400">
                    <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-2 text-slate-300">
                        <i class="fas fa-bullseye text-xl"></i>
                    </div>
                    <p class="font-bold text-slate-700 text-xs">No Performance Objectives Found</p>
                    <p class="text-[11px] text-slate-400">Click "Define Objective" to create baseline goals for your team.</p>
                </td>
            </tr>
        `;
        renderPaginationControls('planning-pagination-container', 1, 0, planningPageSize, 'setPlanningPage');
        updateStage1BulkDeleteState();
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
        const goalStatus = (goal.status || '').toLowerCase();
        const isCompleted = goalStatus === 'completed';
        const isApproved = goalStatus === 'approved';
        const isFailed = goalStatus === 'failed';
        const isRevised = !!goal.supervisor_notes || (goal.updated_at && goal.created_at && goal.updated_at !== goal.created_at);

        const tr = document.createElement('tr');
        tr.className = `hover:bg-slate-50/80 transition text-xs border-b border-slate-100 ${index === 0 ? 'bg-emerald-50/10' : ''}`;

        const tasks = goal.tasks || [];
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const totalTasks = tasks.length;
        const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (isCompleted ? 100 : 0);

        tr.innerHTML = `
            <!-- Checkbox Column -->
            <td class="px-4 py-4 text-center">
                <input type="checkbox" class="stage1-goal-checkbox rounded border-slate-300 text-primary focus:ring-primary" value="${goal.id}" onchange="updateStage1BulkDeleteState()">
            </td>

            <!-- 1. Employee Column -->
            <td class="px-5 py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg || 'bg-primary'} text-white font-bold text-xs flex items-center justify-center shadow-2xs flex-shrink-0">
                        ${emp.avatar || emp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-bold text-slate-900 text-xs leading-tight max-w-[150px] truncate" title="${emp.name}">${emp.name}</p>
                        <p class="text-[10px] text-slate-500 font-medium max-w-[150px] truncate" title="${emp.position}">${emp.position}</p>
                    </div>
                </div>
            </td>

            <!-- 2. Objective & Scope -->
            <td class="px-5 py-4">
                <div class="space-y-1 max-w-[240px]">
                    <div class="flex items-center space-x-1.5 flex-wrap">
                        <p class="font-bold text-slate-900 text-xs leading-snug line-clamp-2" title="${goal.title}">${goal.title}</p>
                        ${isRevised ? `<span class="px-1.5 py-0.2 rounded text-[8px] font-bold bg-purple-100 text-purple-700 border border-purple-200">Edited</span>` : ''}
                    </div>
                    <span class="text-[10px] font-bold text-primary bg-primary-50 px-2 py-0.5 rounded inline-block max-w-[200px] truncate" title="${goal.department || emp.department}">${goal.department || emp.department}</span>
                </div>
            </td>

            <!-- 3. Target Metric / KPI -->
            <td class="px-5 py-4">
                <span class="text-primary font-bold font-mono text-[11px] bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 block w-fit max-w-[180px] truncate" title="${goal.target_metric}">
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
                        <div class="${taskProgress >= 100 ? 'bg-emerald-500' : (isFailed ? 'bg-rose-500' : 'bg-primary')} h-1.5 rounded-full transition-all duration-300" style="width: ${taskProgress}%"></div>
                    </div>
                </div>
            </td>

            <!-- 7. Status Badge (Pending / Approved / Completed / Failed) -->
            <td class="px-5 py-4 text-center whitespace-nowrap">
                ${isFailed ? `
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center space-x-1">
                        <i class="fas fa-times-circle text-rose-600 text-[9px]"></i><span>Failed</span>
                    </span>
                ` : (isCompleted ? `
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 inline-flex items-center space-x-1">
                        <i class="fas fa-circle-check text-indigo-600 text-[9px]"></i><span>Completed</span>
                    </span>
                ` : (isApproved ? `
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center space-x-1">
                        <i class="fas fa-check-circle text-emerald-600 text-[9px]"></i><span>Approved</span>
                    </span>
                ` : `
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 inline-flex items-center space-x-1">
                        <i class="fas fa-clock text-amber-600 text-[9px]"></i><span>Pending</span>
                    </span>
                `))}
            </td>

            <!-- 8. Actions -->
            <td class="px-5 py-4 text-right space-x-1 whitespace-nowrap">
                <button onclick="openViewGoalModal('${goal.id || emp.id}')" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center justify-center transition shadow-2xs" title="View Full Details">
                    <i class="fas fa-eye text-xs"></i>
                </button>
                ${(isApproved || isCompleted || isFailed) ? `
                    <button disabled class="w-7 h-7 rounded-lg bg-slate-100 text-slate-300 inline-flex items-center justify-center cursor-not-allowed opacity-40 shadow-2xs" title="Revise disabled for approved, completed, or failed goals">
                        <i class="fas fa-pen-to-square text-xs"></i>
                    </button>
                ` : `
                    <button onclick="openReviseGoalModal('${goal.id || emp.id}')" class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center justify-center transition shadow-2xs" title="Edit / Revise Objective">
                        <i class="fas fa-pen-to-square text-xs"></i>
                    </button>
                `}
                <button onclick="confirmDeleteGoal('${goal.id}', '${(goal.title || '').replace(/'/g, "\\'")}')" class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 inline-flex items-center justify-center transition shadow-2xs" title="Delete Objective">
                    <i class="fas fa-trash text-xs"></i>
                </button>
                ${isFailed ? `
                    <span class="w-7 h-7 rounded-lg text-rose-700 bg-rose-50 border border-rose-200 inline-flex items-center justify-center text-xs" title="Objective Permanently Failed">
                        <i class="fas fa-times"></i>
                    </span>
                ` : ((isApproved || isCompleted) ? `
                    <span class="w-7 h-7 rounded-lg text-emerald-700 bg-emerald-50 border border-emerald-200 inline-flex items-center justify-center text-xs" title="${isCompleted ? 'Objective Completed' : 'Objective Approved & Locked'}">
                        <i class="fas ${isCompleted ? 'fa-circle-check' : 'fa-lock'}"></i>
                    </span>
                ` : `
                    <button onclick="confirmApproveSingleGoal('${goal.id}', '${emp.id}', '${(goal.title || '').replace(/'/g, "\\'")}')" class="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center justify-center shadow-xs transition" title="Approve Objective">
                        <i class="fas fa-check text-xs"></i>
                    </button>
                `)}
            </td>
        `;

        tbody.appendChild(tr);
    });

    renderPaginationControls('planning-pagination-container', planningCurrentPage, allGoals.length, planningPageSize, 'setPlanningPage');
    updateStage1BulkDeleteState();
}
window.renderPlanningRosterTable = renderPlanningRosterTable;

// Stage 1 Filter & Search Handlers
window.filterPlanningByStatus = function(status) {
    window.planningStatusFilter = status;
    planningCurrentPage = 1;
    renderPlanningRosterTable();
};

window.onPlanningGoalsSearch = function(query) {
    window.planningSearchQuery = query;
    planningCurrentPage = 1;
    renderPlanningRosterTable();
};

// Stage 1 Bulk Delete and Single Delete Handlers
window.toggleSelectAllStage1 = function(checked) {
    const checkboxes = document.querySelectorAll('.stage1-goal-checkbox');
    checkboxes.forEach(cb => { cb.checked = checked; });
    updateStage1BulkDeleteState();
};

window.updateStage1BulkDeleteState = function() {
    const checkboxes = document.querySelectorAll('.stage1-goal-checkbox:checked');
    const count = checkboxes.length;
    const btn = document.getElementById('btn-stage1-bulk-delete');
    const countEl = document.getElementById('stage1-selected-count');
    if (countEl) countEl.textContent = count;
    if (btn) {
        if (count > 0) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    }
    const selectAllCb = document.getElementById('stage1-select-all');
    const allCbs = document.querySelectorAll('.stage1-goal-checkbox');
    if (selectAllCb) {
        selectAllCb.checked = allCbs.length > 0 && count === allCbs.length;
    }
};

window.confirmDeleteGoal = function(goalId, goalTitle = 'Objective') {
    showActionConfirmModal({
        title: 'Delete Performance Objective',
        message: `Are you sure you want to delete "${goalTitle}"? This will permanently remove this goal and its associated tasks.`,
        confirmBtnText: 'Delete Objective',
        confirmBtnClass: 'btn-danger bg-rose-600 hover:bg-rose-700 text-white',
        iconClass: 'fas fa-trash-can',
        iconContainerClass: 'bg-rose-100 text-rose-700',
        onConfirm: async () => {
            try {
                await PerformanceAPI.deleteGoal(goalId);
                showToast('Performance objective deleted successfully.', 'success');
                await loadAndRenderPlanningGoals();
            } catch (err) {
                console.error('Delete goal error:', err);
                showToast(err.message || 'Failed to delete goal', 'error');
            }
        }
    });
};

window.confirmBulkDeleteStage1 = function() {
    const selected = Array.from(document.querySelectorAll('.stage1-goal-checkbox:checked')).map(cb => cb.value);
    if (selected.length === 0) return;

    showActionConfirmModal({
        title: 'Bulk Delete Objectives',
        message: `Are you sure you want to delete ${selected.length} selected objective(s)?`,
        confirmBtnText: `Delete ${selected.length} Goals`,
        confirmBtnClass: 'btn-danger bg-rose-600 hover:bg-rose-700 text-white',
        iconClass: 'fas fa-trash-can',
        iconContainerClass: 'bg-rose-100 text-rose-700',
        onConfirm: async () => {
            try {
                await PerformanceAPI.bulkDeleteGoals(selected);
                showToast(`${selected.length} objectives deleted successfully.`, 'success');
                await loadAndRenderPlanningGoals();
            } catch (err) {
                console.error('Bulk delete error:', err);
                showToast(err.message || 'Failed to delete goals', 'error');
            }
        }
    });
};

window.confirmApproveSingleGoal = function(goalId, empId, goalTitle = 'Objective') {
    showActionConfirmModal({
        title: 'Approve Performance Objective',
        message: `Approve "${goalTitle}" and lock it into the performance baseline?`,
        confirmBtnText: 'Approve Goal',
        confirmBtnClass: 'btn-primary bg-emerald-600 hover:bg-emerald-700 text-white',
        iconClass: 'fas fa-check-circle',
        iconContainerClass: 'bg-emerald-100 text-emerald-700',
        onConfirm: async () => {
            try {
                await PerformanceAPI.updateGoalStatus(goalId, 'Approved');
                showToast(`Goal approved and locked into baseline!`, 'success');
                await loadAndRenderPlanningGoals();
            } catch (err) {
                console.error('Approve error:', err);
                showToast(err.message || 'Failed to approve goal', 'error');
            }
        }
    });
};

window.confirmApproveAllPendingGoals = function() {
    const pendingGoals = (window.dbGoals || []).filter(g => g.status !== 'Approved' && g.status !== 'Completed');
    if (pendingGoals.length === 0) {
        showToast('All goals are already approved!', 'info');
        return;
    }

    showActionConfirmModal({
        title: 'Approve All Pending Goals',
        message: `Are you sure you want to approve all ${pendingGoals.length} pending performance goals?`,
        confirmBtnText: `Approve All (${pendingGoals.length})`,
        confirmBtnClass: 'btn-primary bg-emerald-600 hover:bg-emerald-700 text-white',
        iconClass: 'fas fa-check-double',
        iconContainerClass: 'bg-emerald-100 text-emerald-700',
        onConfirm: async () => {
            try {
                for (const g of pendingGoals) {
                    await PerformanceAPI.updateGoalStatus(g.id, 'Approved');
                }
                showToast(`All ${pendingGoals.length} pending goals have been approved!`, 'success');
                await loadAndRenderPlanningGoals();
            } catch (err) {
                console.error('Approve all error:', err);
                showToast(err.message || 'Failed to approve all goals', 'error');
            }
        }
    });
};


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
                    <p class="font-bold text-slate-900 text-xs max-w-[200px] truncate" title="${t.title}">${t.title}</p>
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary">${t.category || 'Operational Excellence'}</span>
                </div>
            </td>
            <td class="px-5 py-3.5 max-w-sm">
                <p class="text-slate-600 text-[11px] leading-relaxed line-clamp-2" title="${t.description || 'Standard hotel operating guideline verification.'}">${t.description || 'Standard hotel operating guideline verification.'}</p>
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

/**
 * Check if a task is linked to an LMS Prescription and whether it has achieved 100% progress
 */
function checkLmsTaskProgress(task, empId = null) {
    if (!task) return { isLmsTask: false, canComplete: true, progress: 100 };

    const desc = task.description || '';
    const title = task.title || '';
    let lmsId = task.lms_id || null;

    if (!lmsId) {
        const match = desc.match(/\[LMS:([^\]]+)\]/i);
        if (match) {
            lmsId = match[1].trim();
        }
    }

    // Also check if task title matches an LMS document
    if (!lmsId && (title.toLowerCase().includes('lms') || title.toLowerCase().includes('handbook') || title.toLowerCase().includes('sop:'))) {
        const docs = window.dynamicLmsState?.documents || [];
        const matchedDoc = docs.find(d => {
            const cleanTitle = title.toLowerCase().replace('complete lms:', '').replace('lms:', '').trim();
            return d.title.toLowerCase().includes(cleanTitle) || cleanTitle.includes(d.title.toLowerCase());
        });
        if (matchedDoc) {
            lmsId = matchedDoc.id;
        }
    }

    if (!lmsId) {
        return { isLmsTask: false, canComplete: true, progress: 100 };
    }

    // Find employee ID
    const targetEmpId = empId || task.employee_id || window.selectedEvalEmpId || 'emp-101';
    
    // Look up in prescribed list
    const prescribedList = window.dynamicLmsState?.prescribed || [];
    const record = prescribedList.find(p => isSameEmployee(p.employee, targetEmpId) && String(p.lms_id) === String(lmsId));

    const progress = record ? (parseInt(record.progress, 10) || 0) : 0;
    const status = (record?.status || '').toLowerCase();
    const isPassed = progress >= 100 || status === 'passed' || status === 'completed' || status.includes('cert');

    return {
        isLmsTask: true,
        lmsId: lmsId,
        lmsTitle: record?.document_title || title,
        canComplete: isPassed,
        progress: progress,
        status: record?.status || 'Pending'
    };
}
window.checkLmsTaskProgress = checkLmsTaskProgress;

function triggerTaskCompletionModal(taskId, goalId, checkboxEl) {
    let goal = (window.dbGoals || []).find(g => String(g.id) === String(goalId));
    let task = null;
    if (goal && goal.tasks) task = goal.tasks.find(t => String(t.id) === String(taskId));
    if (!task && goal && goal.specific_tasks) task = goal.specific_tasks.find(t => String(t.id) === String(taskId));
    if (!task) {
        (window.dbGoals || []).forEach(g => {
            if (!task && g.tasks) {
                const found = g.tasks.find(t => String(t.id) === String(taskId));
                if (found) { task = found; if (!goal) goal = g; }
            }
        });
    }

    const lmsInfo = checkLmsTaskProgress(task, goal?.employee_id);
    if (lmsInfo.isLmsTask && !lmsInfo.canComplete) {
        if (checkboxEl) checkboxEl.checked = false;
        if (typeof showToast === 'function') {
            showToast(`⚠️ LMS 100% Progress Required: You must complete the LMS Handbook ("${task?.title || 'Prescribed Module'}") with 100% progress before completing this task! (Current LMS Progress: ${lmsInfo.progress}%)`, 'warning');
        }
        return;
    }

    if (checkboxEl) {
        window.lastActiveTaskCheckbox = checkboxEl;
        checkboxEl.checked = false; // keep unchecked until modal submission is confirmed
    }
    openCompleteTaskModal(taskId, goalId);
}
window.triggerTaskCompletionModal = triggerTaskCompletionModal;

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
    if (!task) {
        (window.dbGoals || []).forEach(g => {
            if (!task && g.tasks) {
                const found = g.tasks.find(t => String(t.id) === String(taskId));
                if (found) {
                    task = found;
                    if (!goal) goal = g;
                }
            }
        });
    }

    const lmsInfo = checkLmsTaskProgress(task, goal?.employee_id);
    if (lmsInfo.isLmsTask && !lmsInfo.canComplete) {
        if (window.lastActiveTaskCheckbox) window.lastActiveTaskCheckbox.checked = false;
        if (typeof showToast === 'function') {
            showToast(`⚠️ LMS 100% Progress Required: You must reach 100% progress in LMS ("${task?.title || 'Prescribed Module'}") before completing this task! Current progress: ${lmsInfo.progress}%.`, 'warning');
        }
        return;
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

    // Double check LMS progress before submitting API
    let task = null;
    (window.dbGoals || []).forEach(g => {
        if (!task && g.tasks) {
            const found = g.tasks.find(t => String(t.id) === String(taskId));
            if (found) task = found;
        }
    });

    const lmsInfo = checkLmsTaskProgress(task);
    if (lmsInfo.isLmsTask && !lmsInfo.canComplete) {
        if (typeof showToast === 'function') {
            showToast(`⚠️ LMS 100% Progress Required: You must reach 100% in LMS before completing this task! (Current progress: ${lmsInfo.progress}%)`, 'warning');
        }
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

    // Requirement 0: 1 Max in-progress goal constraint check
    const existingRunningGoal = (window.dbGoals || []).find(g => isSameEmployee(g.employee_id, employeeId) && g.status !== 'Completed');
    if (existingRunningGoal) {
        if (typeof showToast === 'function') {
            showToast(`⚠️ Cannot create goal: This employee already has an active in-progress goal ("${existingRunningGoal.title}"). Employees can only create a new goal if they have no active goals or their set goals are marked as Completed.`, 'error');
        }
        return;
    }

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

    showActionConfirmModal({
        title: 'Confirm Performance Objective',
        message: `Set "${title}" as the official performance objective for this cycle?`,
        confirmBtnText: 'Set Objective',
        confirmBtnClass: 'btn-primary bg-primary hover:bg-primary-dark text-white',
        iconClass: 'fas fa-bullseye',
        iconContainerClass: 'bg-purple-100 text-purple-700',
        onConfirm: async () => {
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
            } catch (err) {
                console.error('Goal submit error:', err);
                if (typeof showToast === 'function') {
                    showToast(err.message || 'Failed to save goal to database.', 'error');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
        }
    });
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

    // Show only Approved goals that are not completed
    let approvedGoals = (window.dbGoals || []).filter(g => g.status === 'Approved');

    // Filter by search query
    if (window.approvedSearchQuery && window.approvedSearchQuery.trim()) {
        const q = window.approvedSearchQuery.toLowerCase().trim();
        approvedGoals = approvedGoals.filter(g => {
            const title = (g.title || '').toLowerCase();
            const dept = (g.department || '').toLowerCase();
            let emp = window.perfRoster.find(e => isSameEmployee(e.id, g.employee_id));
            const empName = emp ? emp.name.toLowerCase() : '';
            return title.includes(q) || dept.includes(q) || empName.includes(q);
        });
    }

    if (approvedGoals.length === 0) {
        container.innerHTML = `
            <div class="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-2 col-span-2">
                <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg mx-auto font-bold">
                    <i class="fas fa-clipboard-check"></i>
                </div>
                <h4 class="font-bold text-slate-800 text-sm">No Approved Goals Found</h4>
                <p class="text-xs text-slate-500">Goals approved in Stage 1 will appear here as the active baseline for monitoring.</p>
            </div>
        `;
        updateStage2BulkDeleteState();
        return;
    }

    approvedGoals.forEach(goal => {
        let emp = window.perfRoster.find(e => isSameEmployee(e.id, goal.employee_id));
        if (!emp) {
            emp = {
                id: goal.employee_id || 'emp-101',
                name: goal.role === 'Supervisor' ? 'Chef Marco Rossi' : 'Maria Santos',
                position: goal.role === 'Supervisor' ? 'Executive Sous Chef' : 'Front Desk Host',
                department: goal.department || 'Front Office',
                avatarBg: 'bg-primary'
            };
        }

        const tasks = goal.tasks || [];
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const totalTasks = tasks.length;
        const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const div = document.createElement('div');
        div.className = 'p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3';
        div.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center space-x-3">
                    <input type="checkbox" class="stage2-goal-checkbox rounded border-slate-300 text-amber-600 focus:ring-amber-500" value="${goal.id}" onchange="updateStage2BulkDeleteState()">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg || 'bg-primary'} text-white font-bold text-xs flex items-center justify-center">
                        ${emp.avatar || emp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-900 text-sm">${emp.name}</h4>
                        <p class="text-[11px] text-slate-500">${emp.position} · <span class="text-primary font-bold">${goal.department || emp.department}</span></p>
                    </div>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                    <i class="fas fa-circle-check text-emerald-600 text-[9px]"></i>
                    <span>Approved Baseline</span>
                </span>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                <div class="flex justify-between items-start">
                    <span class="font-bold text-slate-900 text-xs">${goal.title}</span>
                    <span class="font-mono text-primary font-bold">${goal.target_metric || goal.kpi || 'N/A'}</span>
                </div>
                <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Target Date: <strong>${goal.target_date || 'Q3 2026'}</strong></span>
                    <span>Weight: <strong>${goal.weight || '20%'}</strong></span>
                </div>
                <div class="pt-1.5 space-y-1">
                    <div class="flex justify-between text-[10px] font-bold">
                        <span class="text-slate-600">Tasks Checklist: ${completedTasks}/${totalTasks}</span>
                        <span class="text-primary font-mono">${taskProgress}%</span>
                    </div>
                    <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div class="${taskProgress >= 100 ? 'bg-emerald-500' : 'bg-primary'} h-1.5 rounded-full" style="width: ${taskProgress}%"></div>
                    </div>
                </div>
            </div>

            <div class="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button onclick="confirmDeleteGoal('${goal.id}', '${(goal.title || '').replace(/'/g, "\\'")}')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition flex items-center space-x-1" title="Delete Objective">
                    <i class="fas fa-trash text-xs"></i>
                    <span>Delete</span>
                </button>
                <button onclick="openViewGoalModal('${goal.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
                    View Details
                </button>
                <button onclick="searchEmployeeInStage('monitor', '${(emp.name || '').replace(/'/g, "\\'")}')" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5">
                    <i class="fas fa-chart-line text-[11px]"></i>
                    <span>See Progress &rarr;</span>
                </button>
            </div>
        `;
        container.appendChild(div);
    });

    updateStage2BulkDeleteState();
}
window.renderApprovalRosterTable = renderApprovalRosterTable;

window.onApprovedGoalsSearch = function(query) {
    window.approvedSearchQuery = query;
    renderApprovalRosterTable();
};

window.updateStage2BulkDeleteState = function() {
    const checkboxes = document.querySelectorAll('.stage2-goal-checkbox:checked');
    const count = checkboxes.length;
    const btn = document.getElementById('btn-stage2-bulk-delete');
    const countEl = document.getElementById('stage2-selected-count');
    if (countEl) countEl.textContent = count;
    if (btn) {
        if (count > 0) {
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    }
};

window.confirmBulkDeleteStage2 = function() {
    const selected = Array.from(document.querySelectorAll('.stage2-goal-checkbox:checked')).map(cb => cb.value);
    if (selected.length === 0) return;

    showActionConfirmModal({
        title: 'Bulk Delete Approved Objectives',
        message: `Are you sure you want to delete ${selected.length} selected approved objective(s)?`,
        confirmBtnText: `Delete ${selected.length} Goals`,
        confirmBtnClass: 'btn-danger bg-rose-600 hover:bg-rose-700 text-white',
        iconClass: 'fas fa-trash-can',
        iconContainerClass: 'bg-rose-100 text-rose-700',
        onConfirm: async () => {
            try {
                await PerformanceAPI.bulkDeleteGoals(selected);
                showToast(`${selected.length} objectives deleted successfully.`, 'success');
                await loadAndRenderPlanningGoals();
            } catch (err) {
                console.error('Bulk delete error:', err);
                showToast(err.message || 'Failed to delete goals', 'error');
            }
        }
    });
};


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
    if (emp && emp.goals && emp.goals.length > 0) {
        let totalProgress = 0;
        let countedGoals = 0;
        const approvedGoals = emp.goals.filter(g => g.status === 'Approved' || g.status === 'Completed');

        approvedGoals.forEach(g => {
            const tasks = g.tasks || [];
            if (tasks.length > 0) {
                const completed = tasks.filter(t => t.status === 'completed').length;
                totalProgress += Math.round((completed / tasks.length) * 100);
            } else if (g.status === 'Completed') {
                totalProgress += 100;
            } else {
                totalProgress += (typeof g.task_progress === 'number' ? g.task_progress : (g.milestoneProgress || g.progress || 0));
            }
            countedGoals++;
        });

        if (countedGoals > 0) {
            return Math.min(100, Math.round(totalProgress / countedGoals));
        }
    }

    return 0;
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

    // Requirement 5: Do not show goals with status of 'Completed'
    let list = (window.perfRoster || []).filter(e => (window.dbGoals || []).some(g => g.status === 'Approved' && isSameEmployee(g.employee_id, e.id)));
    
    if (deptFilter !== 'all') {
        list = list.filter(e => e.department.toLowerCase().includes(deptFilter.toLowerCase()));
    }

    // Filter by employee search query
    if (window.monitoringSearchQuery && window.monitoringSearchQuery.trim()) {
        const q = window.monitoringSearchQuery.toLowerCase().trim();
        list = list.filter(e => (e.name || '').toLowerCase().includes(q) || (e.position || '').toLowerCase().includes(q) || (e.department || '').toLowerCase().includes(q));
    }

    if (list.length === 0) {
        document.getElementById('monitoring-employee-detail-card')?.classList.add('hidden');
        container.innerHTML = `
            <tr>
                <td colspan="5" class="p-8 text-center bg-white text-slate-500 text-xs">
                    <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2 text-base">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <p class="font-bold text-slate-700 mb-0.5">No Active Performance Goals to Monitor</p>
                    <p class="text-slate-400 text-[11px]">Employees will appear in Phase 3 Monitoring once their performance objectives are defined and approved in Phase 1 &amp; Phase 2.</p>
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
        
        // Find existing evaluation if any
        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const hasEval = evalRec && typeof evalRec.supervisor_rating !== 'undefined' && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0;
        const supScore = hasEval ? parseFloat(evalRec.supervisor_rating) : (emp.supervisorRating || 0);

        const inTraining = isEmployeeInTraining(emp.id);
        const tnNeed = getEmployeeTrainingNeed(emp.id);
        const isScored = isEmployeeTrainingScored(emp.id);
        const retryCount = getEmployeeRetryCount(emp.id);

        tr.innerHTML = `
            <td class="px-5 py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg || 'bg-primary'} text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        ${emp.avatar || emp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-bold text-slate-900 text-sm leading-tight max-w-[150px] truncate" title="${emp.name}">${emp.name}</p>
                        <span class="text-[10px] font-bold text-primary bg-primary-50 px-2 py-0.5 rounded max-w-[150px] truncate block" title="${emp.position}">${emp.position}</span>
                        ${inTraining ? `
                            <div class="mt-1.5 p-1.5 bg-rose-50/90 rounded-lg border border-rose-200 text-[10px] space-y-0.5 max-w-[180px]">
                                <div class="flex items-center space-x-1 font-bold text-rose-800 truncate" title="${tnNeed?.title || 'Mandatory Formal Training'}">
                                    <i class="fas fa-graduation-cap text-rose-600 flex-shrink-0"></i>
                                    <span class="truncate">${tnNeed ? (tnNeed.title || '').replace('Formal Training: ', '') : 'Mandatory Training'}</span>
                                </div>
                                <div class="flex items-center justify-between text-[10px] text-slate-600 font-mono">
                                    <span>Score: <strong class="${isScored ? 'text-emerald-700' : 'text-rose-700'}">${parseFloat(tnNeed?.current_score || 0).toFixed(2)}</strong>/5.0</span>
                                    <span>Target: <strong class="text-slate-800">${parseFloat(tnNeed?.required_score || 4.0).toFixed(2)}</strong></span>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </td>
            <td class="px-5 py-4">
                <span class="font-semibold text-slate-700 max-w-[130px] truncate block" title="${emp.department}">${emp.department}</span>
                ${inTraining ? `<span class="mt-1 inline-block px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[9px] font-bold">Needs Training: True</span>` : ''}
            </td>
            <td class="px-5 py-4">
                ${hasEval ? `
                    <div class="space-y-0.5">
                        <span class="font-bold text-slate-900 text-xs flex items-center space-x-1">
                            <span class="text-amber-500">⭐</span>
                            <span>${supScore.toFixed(2)} / 5.0</span>
                        </span>
                        <span class="text-[10px] text-emerald-700 font-semibold block">${evalRec.tier_label || 'Appraised'}</span>
                    </div>
                ` : `
                    <span class="text-slate-400 italic text-[11px]">Pending Appraisal</span>
                `}
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
                ${(isEmployeeGoalFailed(emp.id) || retryCount >= 4) ? `
                    <button disabled class="px-3.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold rounded-xl cursor-not-allowed inline-flex items-center space-x-1" title="${isEmployeeGoalFailed(emp.id) ? 'Goal has failed' : 'Locked: Final 1-on-1 Evaluation is active in Phase 7'}">
                        <i class="fas fa-lock text-[10px]"></i>
                        <span>${isEmployeeGoalFailed(emp.id) ? 'Goal Failed' : 'Final Eval in Phase 7'}</span>
                    </button>
                ` : `
                    <button onclick="openLogMilestoneModal('${emp.id}')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition inline-flex items-center space-x-1">
                        <i class="fas fa-plus text-[10px]"></i><span>Log KPI</span>
                    </button>
                    ${(inTraining && !isScored) ? `
                        <button disabled class="px-3.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold rounded-xl cursor-not-allowed inline-flex items-center space-x-1" title="Associate is currently undergoing Mandatory Formal Training. Re-evaluation locked until training is completed.">
                            <i class="fas fa-lock text-[10px]"></i>
                            <span>In Training (Locked)</span>
                        </button>
                    ` : ((inTraining && isScored) ? `
                        <button onclick="triggerEvaluationForEmployee('${emp.id}')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1 inline-flex" title="Training Completed! Open Post-Training Re-Evaluation">
                            <i class="fas fa-star-half-stroke"></i>
                            <span>Re-Evaluate (After Training)</span>
                        </button>
                    ` : `
                        <button onclick="triggerEvaluationForEmployee('${emp.id}')" class="px-3.5 py-1.5 ${hasEval ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-primary hover:bg-primary-dark'} text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1 inline-flex">
                            <i class="fas fa-star-half-stroke"></i>
                            <span>${hasEval ? 'Re-Evaluate' : 'Evaluate'}</span>
                        </button>
                    `)}
                `}
            </td>
        `;

        container.appendChild(tr);
    });

    renderPaginationControls('monitoring-pagination-container', monitoringCurrentPage, list.length, monitoringPageSize, 'setMonitoringPage');
}
window.renderMonitoringRosterTable = renderMonitoringRosterTable;

window.onMonitoringEmployeeSearch = function(query) {
    window.monitoringSearchQuery = query;
    monitoringCurrentPage = 1;
    renderMonitoringRosterTable();
};

function filterMonitoringByDept(dept) {
    const el = document.getElementById('filter-monitoring-dept');
    if (el) el.value = dept;
    monitoringCurrentPage = 1;
    renderMonitoringRosterTable();
}
window.filterMonitoringByDept = filterMonitoringByDept;

window.filterMonitoringByDept = filterMonitoringByDept;

function toggleEmployeeMonitoringDetail(empId) {
    const emp = window.perfRoster.find(e => e.id === empId);
    if (!emp) return;
    window.selectedEmployeeContext = emp;
    const nameEl = document.getElementById('mon-modal-emp-name') || document.getElementById('mon-detail-name');
    const posEl = document.getElementById('mon-modal-emp-pos') || document.getElementById('mon-detail-pos');
    if (nameEl) nameEl.innerText = `${emp.name} — Shift Monitoring Stream`;
    if (posEl) posEl.innerText = `${emp.position} · ${emp.department}`;

    const detailBox = document.getElementById('monitoring-employee-detail-card');
    if (detailBox) {
        detailBox.classList.remove('hidden');
    }

    // Render dynamic task accomplishments and activity stream
    renderEmployeeMonitoringStream(emp);

    // Open dedicated Monitoring Stream modal
    openModal('modal-monitoring-stream');


    if (typeof showToast === 'function') {
        showToast(`Loaded continuous shift stream for ${emp.name}`, 'info');
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
    const empGoals = (emp.goals || []).filter(g => g.status === 'Approved' || g.status === 'Completed');

    if (empGoals.length === 0) {
        container.innerHTML = `
            <div class="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                <i class="fas fa-tasks text-slate-400 text-base mb-1 block"></i>
                No approved performance objectives found for this employee. Approve goals in Stage 2 to begin monitoring.
            </div>
        `;
        return;
    }

    const isSupervisor = (window.activePersonaRole !== 'Associate');

    // Display Active Enrolled Training Curriculum Banner if in training
    const inTraining = isEmployeeInTraining(emp.id);
    const tnNeed = getEmployeeTrainingNeed(emp.id);
    const isScored = isEmployeeTrainingScored(emp.id);

    if (inTraining && tnNeed) {
        const trainingCard = document.createElement('div');
        trainingCard.className = 'p-4 bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 rounded-2xl border border-purple-200/90 shadow-2xs space-y-2 text-xs mb-3';
        trainingCard.innerHTML = `
            <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div>
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-200 text-purple-900 border border-purple-300">
                            Enrolled Formal Training: ${tnNeed.status || 'In Training'}
                        </span>
                        <h4 class="font-bold text-slate-900 text-xs mt-0.5">${tnNeed.title}</h4>
                    </div>
                </div>
                <div class="flex items-center space-x-3 font-mono text-[11px]">
                    <div class="text-right">
                        <span class="text-[9px] text-slate-500 block uppercase font-bold">Training Score</span>
                        <span class="font-bold ${isScored ? 'text-emerald-700' : 'text-rose-700'}">${parseFloat(tnNeed.current_score || 0).toFixed(2)} / 5.0</span>
                    </div>
                    <div class="text-right">
                        <span class="text-[9px] text-slate-500 block uppercase font-bold">Target Benchmark</span>
                        <span class="font-bold text-slate-800">${parseFloat(tnNeed.required_score || 4.0).toFixed(2)} / 5.0</span>
                    </div>
                </div>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed">
                ${tnNeed.notes || 'Formal curriculum assigned from IDP Remediation. Re-evaluation in Stage 4 & 5 is locked until training completion score is logged.'}
            </p>
        `;
        container.appendChild(trainingCard);
    }

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
function triggerEvaluationForEmployee(empId) {
    const emp = window.perfRoster.find(e => e.id === empId);
    if (emp) {
        window.selectedEmployeeContext = emp;
        const progress = calculateEmployeeProgress(emp);
        if (progress === 0 && typeof showToast === 'function') {
            showToast(`Proceeding to evaluation with current progress (${progress}% tasks completed)...`, 'info');
        }
        searchEmployeeInStage('eval', emp.name);
    }
}
window.triggerEvaluationForEmployee = triggerEvaluationForEmployee;

function renderEvaluationRosterTable() {
    const container = document.getElementById('eval-roster-tbody');
    if (!container) return;
    container.innerHTML = '';

    // Only show employees who have active approved performance goals (exclude Completed)
    let rosterWithGoals = (window.perfRoster || []).filter(emp => (window.dbGoals || []).some(g => g.status === 'Approved' && isSameEmployee(g.employee_id, emp.id)));

    // Search query filter
    if (window.evalSearchQuery && window.evalSearchQuery.trim()) {
        const q = window.evalSearchQuery.toLowerCase().trim();
        rosterWithGoals = rosterWithGoals.filter(emp => (emp.name || '').toLowerCase().includes(q) || (emp.position || '').toLowerCase().includes(q) || (emp.department || '').toLowerCase().includes(q));
    }

    if (rosterWithGoals.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="px-5 py-8 text-center text-slate-400 italic bg-slate-50">
                    <i class="fas fa-bullseye text-2xl mb-2 block text-slate-300"></i>
                    No active employees with approved performance goals found. Add and approve goals in Stages 1 &amp; 2 before appraisal evaluation.
                </td>
            </tr>
        `;
        document.getElementById('eval-detail-view-card')?.classList.add('hidden');
        return;
    }

    rosterWithGoals.forEach(emp => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition text-xs border-b border-slate-100';

        // Calculate actual task progress for this employee from Database Approved Goals
        const empGoals = (window.dbGoals || []).filter(g => g.status === 'Approved' && isSameEmployee(g.employee_id, emp.id));
        let totalTasks = 0;
        let completedTasks = 0;
        empGoals.forEach(g => {
            (g.tasks || []).forEach(t => {
                totalTasks++;
                if (t.status === 'completed') completedTasks++;
            });
        });
        const allTasksDone = totalTasks > 0 && completedTasks === totalTasks;
        const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Read evaluation record directly from Database
        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const supervisorRating = (evalRec && typeof evalRec.supervisor_rating !== 'undefined' && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0)
            ? parseFloat(evalRec.supervisor_rating)
            : ((emp.supervisorRating && parseFloat(emp.supervisorRating) > 0) ? parseFloat(emp.supervisorRating) : 0.0);
        const isRated = supervisorRating > 0 || (evalRec && (evalRec.status === 'Rated' || evalRec.status === 'Calibrated'));
        const selfEvaluation = (evalRec && typeof evalRec.self_evaluation !== 'undefined' && evalRec.self_evaluation !== null && parseFloat(evalRec.self_evaluation) > 0)
            ? parseFloat(evalRec.self_evaluation)
            : ((evalRec && typeof evalRec.self_rating !== 'undefined' && evalRec.self_rating !== null && parseFloat(evalRec.self_rating) > 0)
                ? parseFloat(evalRec.self_rating)
                : ((emp.selfRating && parseFloat(emp.selfRating) > 0) ? parseFloat(emp.selfRating) : null));
        const isBelowBenchmark = isRated && supervisorRating > 0 && supervisorRating < 3.0;
        const tierLabel = evalRec && evalRec.tier_label ? evalRec.tier_label : (supervisorRating >= 4.5 ? 'Master Tier' : (supervisorRating >= 3.5 ? 'Advanced Tier' : (supervisorRating >= 3.0 ? 'Proficient' : 'Needs PIP')));

        tr.innerHTML = `
            <td class="px-5 py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-full ${emp.avatarBg || 'bg-primary'} text-white font-bold text-xs flex items-center justify-center shadow-2xs flex-shrink-0">
                        ${emp.avatar || emp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-bold text-slate-900 text-sm leading-tight max-w-[150px] truncate" title="${emp.name}">${emp.name}</p>
                        <p class="text-[10px] text-slate-500 font-medium max-w-[150px] truncate" title="${emp.position}">${emp.position}</p>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 max-w-[130px] truncate block" title="${emp.department}">${emp.department}</span>
            </td>
            <td class="px-5 py-4 min-w-[130px]">
                <div class="space-y-1">
                    <div class="flex items-center justify-between text-[10px] font-bold">
                        <span class="text-slate-600">${completedTasks}/${totalTasks} Tasks</span>
                        <span class="text-primary font-mono">${progressPct}%</span>
                    </div>
                    <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div class="${progressPct >= 100 ? 'bg-emerald-500' : 'bg-primary'} h-1.5 rounded-full" style="width: ${progressPct}%"></div>
                    </div>
                </div>
            </td>
            <!-- Self Evaluation Column -->
            <td class="px-5 py-4 whitespace-nowrap">
                ${selfEvaluation !== null ? `
                    <span class="font-bold text-purple-900 text-xs bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 inline-flex items-center space-x-1 shadow-2xs">
                        <i class="fas fa-user-pen text-purple-600 text-[10px]"></i>
                        <span>⭐ ${selfEvaluation.toFixed(2)} / 5.0</span>
                    </span>
                ` : `
                    <span class="text-[10px] text-slate-400 italic bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        Pending Self-Review
                    </span>
                `}
            </td>
            <!-- Supervisor Rating Column -->
            <td class="px-5 py-4 whitespace-nowrap">
                ${isRated ? (isBelowBenchmark ? `
                    <div class="space-y-1">
                        <span class="font-bold text-rose-700 text-xs bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 inline-flex items-center space-x-1.5 shadow-2xs">
                            <i class="fas fa-triangle-exclamation text-rose-600"></i>
                            <span>⭐ ${supervisorRating.toFixed(2)} / 5.0</span>
                        </span>
                        <span class="text-[9px] text-rose-600 font-bold block flex items-center space-x-1">
                            <span>⚠️ Below 3.0 (Needs PIP)</span>
                        </span>
                    </div>
                ` : `
                    <div class="space-y-0.5">
                        <span class="font-bold text-emerald-800 text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-flex items-center space-x-1 shadow-2xs">
                            <span>⭐ ${supervisorRating.toFixed(2)} / 5.0</span>
                        </span>
                        <span class="text-[9px] text-emerald-700 font-semibold block">${tierLabel}</span>
                    </div>
                `) : `
                    <span class="text-[10px] text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-flex items-center space-x-1 shadow-2xs">
                        <i class="fas fa-clock text-[9px]"></i><span>Pending Evaluation</span>
                    </span>
                `}
            </td>
            <td class="px-5 py-4 text-center whitespace-nowrap">
                ${isRated ? (isBelowBenchmark ? `
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        ✓ Evaluated (Needs PIP)
                    </span>
                ` : `
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ✓ Evaluated (${tierLabel})
                    </span>
                `) : `
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Pending
                    </span>
                `}
            </td>
            <td class="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                <button onclick="showEmployeeEvalDetail('${emp.id}', true)" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition shadow-2xs" title="View Full Appraisal">
                    <i class="fas fa-eye mr-1"></i>View
                </button>
                ${(isEmployeeInTraining(emp.id) && !isEmployeeTrainingScored(emp.id)) ? `
                    <button disabled class="px-3 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg text-[11px] font-bold cursor-not-allowed inline-flex items-center space-x-1" title="Associate is currently enrolled in Mandatory Formal Training. Evaluation is locked until training score is recorded.">
                        <i class="fas fa-lock text-[10px]"></i>
                        <span>In Training</span>
                    </button>
                ` : ((isEmployeeInTraining(emp.id) && isEmployeeTrainingScored(emp.id)) ? `
                    <button onclick="openAppraisalModal('${emp.id}', true)" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition inline-flex items-center space-x-1" title="Training Completed! Open Post-Training Appraisal">
                        <i class="fas fa-star-half-stroke"></i>
                        <span>Evaluate (After Training)</span>
                    </button>
                ` : `
                    <button onclick="openAppraisalModal('${emp.id}')" class="px-3 py-1.5 ${isRated ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-primary hover:bg-primary-dark'} text-white rounded-lg text-[11px] font-bold shadow-xs transition inline-flex items-center space-x-1" title="Open Appraisal Scoring Form">
                        <i class="fas fa-star-half-stroke"></i>
                        <span>${isRated ? 'Re-Evaluate' : 'Evaluate'}</span>
                    </button>
                `)}
                <button onclick="searchEmployeeInStage('review', '${(emp.name || '').replace(/'/g, "\\'")}')" class="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-[11px] font-bold transition inline-flex items-center space-x-1" title="Proceed to Stage 5 Calibration & 1-on-1 Review">
                    <i class="fas fa-comments text-purple-600"></i>
                    <span>Review &rarr;</span>
                </button>
            </td>
        `;
        container.appendChild(tr);
    });
}
window.renderEvaluationRosterTable = renderEvaluationRosterTable;

function showEmployeeEvalDetail(empId, openModalImmediately = false) {
    if (!empId) return;
    const emp = window.perfRoster.find(e => isSameEmployee(e.id, empId));
    if (!emp) return;
    window.selectedEvalEmpId = emp.id;

    // Header info (Support both modal and inline IDs if present)
    const titleEl = document.getElementById('eval-modal-emp-title') || document.getElementById('eval-detail-emp-title');
    const subEl = document.getElementById('eval-modal-emp-subtitle') || document.getElementById('eval-detail-emp-subtitle');
    if (titleEl) titleEl.innerText = `${emp.name} — Formal Supervisor Appraisal`;
    if (subEl) subEl.innerText = `${emp.position} · ${emp.department}`;

    const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
    const superScore = (evalRec && typeof evalRec.supervisor_rating !== 'undefined' && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0)
        ? parseFloat(evalRec.supervisor_rating)
        : ((emp.supervisorRating && parseFloat(emp.supervisorRating) > 0) ? parseFloat(emp.supervisorRating) : 0);
    const isRated = superScore > 0 || (evalRec && (evalRec.status === 'Rated' || evalRec.status === 'Calibrated'));
    const isBelowBenchmark = isRated && superScore > 0 && superScore < 3.0;
    const tierLabel = evalRec && evalRec.tier_label ? evalRec.tier_label : (superScore >= 4.5 ? 'Master Tier' : (superScore >= 3.5 ? 'Advanced Tier' : (superScore >= 3.0 ? 'Proficient' : 'Developing (Needs PIP)')));

    const statusBadge = document.getElementById('eval-modal-status-badge') || document.getElementById('eval-detail-status-badge');
    if (statusBadge) {
        if (isBelowBenchmark) {
            statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200';
            statusBadge.textContent = `✓ Appraisal Completed (${tierLabel} · < 3.0)`;
        } else if (isRated) {
            statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
            statusBadge.textContent = `✓ Appraisal Completed (${tierLabel})`;
        } else {
            statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200';
            statusBadge.textContent = 'Pending Formal Appraisal';
        }
    }

    // Monitoring Progress Summary in Detail
    const monProgressEl = document.getElementById('eval-detail-mon-progress');
    const taskCountEl = document.getElementById('eval-detail-task-count');
    const approvedGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, emp.id));
    let totalAllTasks = 0;
    let completedAllTasks = 0;
    approvedGoals.forEach(g => {
        (g.tasks || []).forEach(t => {
            totalAllTasks++;
            if (t.status === 'completed') completedAllTasks++;
        });
    });
    const avgProg = totalAllTasks > 0 ? Math.round((completedAllTasks / totalAllTasks) * 100) : (approvedGoals.length > 0 ? 100 : 0);
    if (monProgressEl) monProgressEl.innerHTML = `${avgProg}% <span class="text-sm font-normal text-slate-400">Shift Execution</span>`;
    if (taskCountEl) taskCountEl.textContent = `${completedAllTasks} of ${totalAllTasks} monitoring tasks verified in database`;

    // Render Approved Goals & Tasks in Evaluation Detail
    const goalsContainer = document.getElementById('eval-detail-goals-container');
    if (goalsContainer) {
        if (approvedGoals.length === 0) {
            goalsContainer.innerHTML = `<div class="p-6 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-200">No approved objectives found in database for this associate.</div>`;
        } else {
            goalsContainer.innerHTML = approvedGoals.map((g, idx) => {
                const tasks = g.tasks || [];
                const done = tasks.filter(t => t.status === 'completed').length;
                const total = tasks.length;
                completedAllTasks += done;
                const pct = total > 0 ? Math.round((done / total) * 100) : (g.status === 'Completed' ? 100 : 0);
                return `
                    <div class="p-3 bg-white rounded-2xl border border-slate-200 space-y-1.5 text-xs shadow-2xs">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-slate-900 line-clamp-1">${idx + 1}. ${g.title}</span>
                            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">${g.weight ? g.weight.split(' ')[0] : '25%'}</span>
                        </div>
                        <p class="text-[10px] text-slate-500 font-mono font-bold">${g.target_metric}</p>
                        <div class="space-y-1 pt-1">
                            <div class="flex items-center justify-between text-[9px] font-bold text-slate-600">
                                <span>Tasks: ${done}/${total} Done</span>
                                <span class="text-primary">${pct}%</span>
                            </div>
                            <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div class="${pct >= 100 ? 'bg-emerald-500' : 'bg-primary'} h-1.5 rounded-full" style="width: ${pct}%"></div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    const allTasksDone = totalAllTasks > 0 && completedAllTasks === totalAllTasks;

    // Enable Open Appraisal Button (openAppraisalModal handles notice confirmation if tasks < 100%)
    const btnOpenAppraisal = document.getElementById('btn-open-eval-appraisal');
    const inTrainingEval = isEmployeeInTraining(emp.id);
    const isScoredEval = isEmployeeTrainingScored(emp.id);
    const retryCountEval = getEmployeeRetryCount(emp.id);
    const isGoalFailedEval = isEmployeeGoalFailed(emp.id);

    if (btnOpenAppraisal) {
        if (isGoalFailedEval || retryCountEval >= 4) {
            btnOpenAppraisal.disabled = true;
            btnOpenAppraisal.className = 'btn-secondary px-4 py-2 text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none inline-flex items-center space-x-1.5';
            btnOpenAppraisal.innerHTML = `<i class="fas fa-lock mr-1"></i><span>Locked (${isGoalFailedEval ? 'Goal Failed' : 'Final Eval in Phase 7'})</span>`;
            btnOpenAppraisal.title = 'Appraisal evaluation locked. Final evaluation is managed in Phase 7.';
            btnOpenAppraisal.onclick = null;
        } else if (inTrainingEval && !isScoredEval) {
            btnOpenAppraisal.disabled = true;
            btnOpenAppraisal.className = 'btn-secondary px-4 py-2 text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none inline-flex items-center space-x-1.5';
            btnOpenAppraisal.innerHTML = `<i class="fas fa-lock mr-1"></i><span>In Training (Locked)</span>`;
            btnOpenAppraisal.title = 'Associate is currently enrolled in mandatory formal training. Appraisal evaluation is locked until training score is recorded.';
            btnOpenAppraisal.onclick = null;
        } else if (inTrainingEval && isScoredEval) {
            btnOpenAppraisal.disabled = false;
            btnOpenAppraisal.className = 'btn-primary px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs inline-flex items-center space-x-1.5';
            btnOpenAppraisal.innerHTML = `<i class="fas fa-star-half-stroke mr-1"></i><span>Evaluate (After Training)</span>`;
            btnOpenAppraisal.title = 'Training Completed! Open Post-Training Appraisal';
            btnOpenAppraisal.onclick = () => openAppraisalModal(emp.id, true);
        } else {
            btnOpenAppraisal.disabled = false;
            btnOpenAppraisal.className = 'btn-primary px-4 py-2 text-xs font-bold shadow-xs inline-flex items-center space-x-1.5';
            btnOpenAppraisal.innerHTML = `<i class="fas fa-star-half-stroke mr-1"></i><span>${isRated ? 'Re-Evaluate Appraisal' : 'Open Appraisal Form'}</span>`;
            btnOpenAppraisal.title = 'Open Appraisal Form';
            btnOpenAppraisal.onclick = () => openAppraisalModal(emp.id);
        }
    }

    // Supervisor Assessment Score from Database
    const superScoreEl = document.getElementById('eval-detail-super-score');
    if (superScoreEl) {
        if (isRated) {
            superScoreEl.innerHTML = `${superScore.toFixed(2)} <span class="text-sm font-normal text-slate-400">/ 5.0 (${tierLabel})</span>`;
        } else {
            superScoreEl.innerHTML = `0.00 <span class="text-sm font-normal text-slate-400">/ 5.0 (Pending Evaluation)</span>`;
        }
    }

    const tierBadgeContainer = document.getElementById('eval-detail-tier-badge-container');
    if (tierBadgeContainer) {
        if (isBelowBenchmark) {
            tierBadgeContainer.innerHTML = `<span class="px-3 py-1 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center space-x-1.5"><i class="fas fa-triangle-exclamation"></i><span>Below 3.0 Benchmark</span></span>`;
        } else if (isRated) {
            tierBadgeContainer.innerHTML = `<span class="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center space-x-1.5"><i class="fas fa-award"></i><span>${tierLabel}</span></span>`;
        } else {
            tierBadgeContainer.innerHTML = `<span class="px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Evaluation Pending</span>`;
        }
    }

    // Evaluated Criteria Breakdown from Database
    const criteriaBreakdownEl = document.getElementById('eval-detail-criteria-breakdown');
    if (criteriaBreakdownEl) {
        const list = evalRec && Array.isArray(evalRec.criteria_scores) && evalRec.criteria_scores.length > 0 ? evalRec.criteria_scores : [];
        if (list.length > 0) {
            criteriaBreakdownEl.innerHTML = list.map((c, i) => `
                <div class="p-3 bg-white rounded-xl border ${c.rating < 3.0 ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'} space-y-1 shadow-2xs">
                    <div class="flex justify-between items-center text-xs flex-wrap gap-1">
                        <span class="font-bold text-slate-900">${i + 1}. ${c.title} <span class="text-[10px] text-slate-400 font-normal">(${c.metric || 'Standard Benchmark'})</span></span>
                        <span class="font-bold font-mono px-2 py-0.5 rounded text-[11px] ${c.rating < 3.0 ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800'}">
                            ${c.rating < 3.0 ? '⚠️ ' : ''}⭐ ${parseFloat(c.rating || 0).toFixed(1)} / 5.0 (${c.weight || '33'}% wt)
                        </span>
                    </div>
                    ${c.rationale ? `<p class="text-[11px] text-slate-600 italic pl-2 border-l-2 ${c.rating < 3.0 ? 'border-rose-300' : 'border-purple-300'}">"${c.rationale}"</p>` : ''}
                </div>
            `).join('');
        } else {
            criteriaBreakdownEl.innerHTML = `<p class="text-slate-400 italic text-[11px] p-3 bg-white rounded-xl border border-slate-200">No specific criteria rubric recorded in database yet.</p>`;
        }
    }

    // Supervisor Notes & Recommendation from Database
    const superRecEl = document.getElementById('eval-detail-super-recommendation');
    if (superRecEl) {
        if (evalRec && evalRec.supervisor_notes) {
            superRecEl.innerHTML = `<p class="text-slate-800 leading-relaxed italic">"${evalRec.supervisor_notes}"</p>`;
        } else {
            superRecEl.innerHTML = `<p class="text-slate-400 italic">No formal supervisor endorsement notes entered in database yet.</p>`;
        }
    }

    if (openModalImmediately) {
        openModal('modal-view-appraisal');
    }
}
window.showEmployeeEvalDetail = showEmployeeEvalDetail;

function hideEmployeeEvalDetail() {
    closeModal('modal-view-appraisal');
}
window.hideEmployeeEvalDetail = hideEmployeeEvalDetail;

window.pendingEvalEmpId = null;

function openAppraisalModal(empId, isPostTraining = false) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || (window.perfRoster || [])[0];
    if (!emp) return;

    window.selectedEvalEmpId = emp.id;

    // Check if employee is in training without score
    const inTraining = isEmployeeInTraining(emp.id);
    const isScored = isEmployeeTrainingScored(emp.id);
    if (inTraining && !isScored && !isPostTraining) {
        if (typeof showToast === 'function') {
            showToast(`⚠️ Cannot evaluate ${emp.name}: Associate is currently enrolled in Mandatory Formal Training. Re-evaluation is locked until training score is recorded.`, 'warning');
        }
        return;
    }

    // Check if employee has approved goals and all monitoring action tasks are completed
    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, emp.id));
    let totalTasks = 0;
    let completedTasks = 0;
    empGoals.forEach(g => {
        (g.tasks || []).forEach(t => {
            totalTasks++;
            if (t.status === 'completed') completedTasks++;
        });
    });

    const allTasksDone = totalTasks > 0 && completedTasks === totalTasks;
    if (!allTasksDone && !isPostTraining && !inTraining) {
        if (typeof showToast === 'function') {
            showToast(`⚠️ Cannot evaluate ${emp.name}: Monitoring tasks are still not done (${completedTasks}/${totalTasks} completed). Complete all tasks in Stage 3 Continuous Monitoring first.`, 'warning');
        }
        return;
    }

    openAppraisalModalInternal(emp.id, isPostTraining);
}
window.openAppraisalModal = openAppraisalModal;

function proceedToAppraisalModal() {
    closeModal('modal-eval-no-tasks-confirm');
    if (window.pendingEvalEmpId) {
        openAppraisalModalInternal(window.pendingEvalEmpId);
    }
}
window.proceedToAppraisalModal = proceedToAppraisalModal;

function openAppraisalModalInternal(empId) {
    const emp = window.perfRoster.find(e => e.id === empId) || window.perfRoster[0];
    if (!emp) return;

    window.selectedEvalEmpId = emp.id;
    const targetInput = document.getElementById('eval-target-emp-id');
    const titleEl = document.getElementById('modal-eval-emp-title');
    if (targetInput) targetInput.value = emp.id;
    if (titleEl) titleEl.textContent = `Appraisal Review: ${emp.name} (${emp.position})`;

    const criteriaContainer = document.getElementById('appraisal-criteria-container');
    if (!criteriaContainer) return;

    // Load approved goals and DB evaluation criteria
    const evalRec = emp.evaluationRecord || getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id));
    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, emp.id));

    let criteriaList = [];
    if (evalRec && Array.isArray(evalRec.criteria_scores) && evalRec.criteria_scores.length > 0) {
        criteriaList = evalRec.criteria_scores.map(c => ({
            title: c.title,
            metric: c.metric,
            weight: c.weight || 30,
            initialRating: c.rating || 4.5,
            rationale: c.rationale || 'Demonstrated high consistency in achieving target deliverables.'
        }));
    } else if (empGoals.length > 0) {
        criteriaList = empGoals.map((g, idx) => ({
            title: g.title,
            metric: g.target_metric || '100% SOP Compliance',
            weight: parseInt(g.weight || '30', 10) || 30,
            initialRating: 4.5,
            rationale: 'Demonstrated consistency in achieving shift deliverables.'
        }));
    } else {
        criteriaList = [
            { title: 'Operational Excellence & Protocol Adherence', metric: '100% SOP Compliance', weight: 40, initialRating: 4.8, rationale: 'Standard hospitality protocol adherence.' },
            { title: 'Guest Satisfaction & Service Speed', metric: 'CSAT >= 95%', weight: 30, initialRating: 4.5, rationale: 'Swift check-in and dining turnaround.' },
            { title: 'Teamwork, Conflict De-escalation & Mentorship', metric: 'Zero Unresolved Escalations', weight: 30, initialRating: 4.2, rationale: 'Assists colleagues during high volume rushes.' }
        ];
    }

    criteriaContainer.innerHTML = criteriaList.map((c, idx) => `
        <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2.5">
            <div class="flex justify-between items-center font-semibold text-xs">
                <span class="text-slate-900">${idx + 1}. ${c.title} <span class="text-primary font-bold">(Weight: ${c.weight}%)</span></span>
                <span id="criteria-val-display-${idx}" class="text-primary font-mono font-bold">${c.initialRating} / 5.0</span>
            </div>
            <p class="text-[10px] text-slate-500 font-medium font-mono">Target Metric: ${c.metric}</p>
            <input type="range" min="1" max="5" step="0.1" value="${c.initialRating}" data-title="${encodeURIComponent(c.title)}" data-metric="${encodeURIComponent(c.metric)}" data-weight="${c.weight}" id="criteria-slider-${idx}" oninput="updateAppraisalComputedScore()" class="w-full accent-[#9E1B20] appraisal-score-slider cursor-pointer">
            <textarea rows="2" placeholder="Provide performance evidence, KPI deliverables observed, and coaching notes..." class="w-full p-2.5 bg-white rounded-xl border border-[#E8DEDC] text-xs text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar">${c.rationale || 'Demonstrated consistency in achieving shift deliverables.'}</textarea>
        </div>
    `).join('');

    // Prepopulate supervisor recommendation textarea if present
    const notesInput = document.getElementById('eval-supervisor-notes');
    if (notesInput && evalRec && evalRec.supervisor_notes) {
        notesInput.value = evalRec.supervisor_notes;
    }

    updateAppraisalComputedScore();
    openModal('modal-self-assessment');
}
window.openAppraisalModalInternal = openAppraisalModalInternal;

function updateAppraisalComputedScore() {
    const sliders = document.querySelectorAll('.appraisal-score-slider');
    if (!sliders || sliders.length === 0) return;

    let totalWeight = 0;
    let weightedSum = 0;

    sliders.forEach((slider, idx) => {
        const val = parseFloat(slider.value) || 3.0;
        const weight = parseFloat(slider.dataset.weight) || 33.3;
        const display = document.getElementById(`criteria-val-display-${idx}`);
        if (display) {
            display.textContent = `${val.toFixed(1)} / 5.0`;
        }
        weightedSum += val * weight;
        totalWeight += weight;
    });

    const finalScore = totalWeight > 0 ? (weightedSum / totalWeight) : 4.5;
    const isBelow3 = finalScore < 3.0;
    const tier = finalScore >= 4.5 ? 'Master Tier' : (finalScore >= 3.5 ? 'Advanced Tier' : (finalScore >= 3.0 ? 'Proficient' : '⚠️ Below 3.0 (Needs PIP)'));
    const displayEl = document.getElementById('eval-overall-score-display');
    if (displayEl) {
        displayEl.textContent = `${finalScore.toFixed(2)} / 5.0 (${tier})`;
        if (isBelow3) {
            displayEl.className = 'font-mono font-bold text-sm text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 inline-block';
        } else {
            displayEl.className = 'font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block';
        }
    }
}
window.updateAppraisalComputedScore = updateAppraisalComputedScore;

async function handleAppraisalSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const empId = document.getElementById('eval-target-emp-id')?.value || window.selectedEvalEmpId || 'emp-101';
    const emp = window.perfRoster.find(e => e.id === empId);

    const submitBtn = document.getElementById('btn-submit-appraisal');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Saving to Database...</span>';
    }

    try {
        // Compute the final score and collect criteria scores
        const sliders = document.querySelectorAll('.appraisal-score-slider');
        let totalWeight = 0;
        let weightedSum = 0;
        const criteriaScores = [];

        sliders.forEach((slider, idx) => {
            const val = parseFloat(slider.value) || 4.5;
            const weight = parseFloat(slider.dataset.weight) || 33.3;
            const title = decodeURIComponent(slider.dataset.title || `Criterion ${idx + 1}`);
            const metric = decodeURIComponent(slider.dataset.metric || 'Target >= 95%');
            const textarea = slider.parentElement?.querySelector('textarea');
            const rationale = textarea ? textarea.value.trim() : '';

            weightedSum += val * weight;
            totalWeight += weight;

            criteriaScores.push({
                title,
                metric,
                weight,
                rating: val,
                rationale
            });
        });

        const finalScore = totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(2)) : 4.60;
        const supervisorNotes = document.getElementById('eval-supervisor-notes')?.value.trim() || 'Appraisal successfully endorsed with positive hospitality benchmarking.';

        const empGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, empId));
        const needsTraining = empGoals.some(g => !!g.needs_training);
        const inTrainingScored = isEmployeeInTraining(empId) && isEmployeeTrainingScored(empId);
        const isRetry = needsTraining || inTrainingScored;

        // If post-training appraisal, ensure retry_count is set to 3 and needs_training is cleared
        if (inTrainingScored) {
            try {
                await PerformanceAPI.setNeedsTraining({ employee_id: empId, needs_training: false, retry_count: 3 });
            } catch (err) {
                console.warn('Set retry_count error:', err);
            }
        }

        // Save directly to Database via PerformanceAPI
        const saved = await PerformanceAPI.submitAppraisal({
            employee_id: empId,
            supervisor_rating: finalScore,
            new_supervisor_rating: isRetry ? finalScore : undefined,
            is_retry: isRetry,
            criteria_scores: criteriaScores,
            supervisor_notes: supervisorNotes
        });

        // Update local memory and cache
        if (emp) {
            emp.evaluationStatus = 'Rated';
            emp.supervisorRating = finalScore;
            emp.managerRating = finalScore;
            if (isRetry) {
                emp.newSupervisorRating = finalScore;
            }
            emp.tierLabel = saved.tier_label || (finalScore >= 4.5 ? 'Master Tier' : 'Advanced Tier');
            emp.evaluationRecord = saved;
            emp.reviewStatus = 'Pending Calibration';
        }

        // Update dbEvaluations array
        updateDbEvaluationRecord(saved);

        if (typeof showToast === 'function') {
            showToast(`🎉 Formal appraisal successfully saved to database for ${emp ? emp.name : 'Employee'}! (${finalScore.toFixed(2)} / 5.0)`, 'success');
        }

        closeModal('modal-self-assessment');
        renderEvaluationRosterTable();
        showEmployeeEvalDetail(empId);
        renderReviewRosterTable();
        renderIDPRosterTable();
        renderCycleRosterTable();
        updateAllPerfStepperBadges();

        if (typeof loadLiveNotifications === 'function') {
            loadLiveNotifications(window.activePersonaRole || 'Supervisor');
        }
    } catch (err) {
        console.error('Appraisal database submission error:', err);
        if (typeof showToast === 'function') {
            showToast(err.message || 'Failed to save appraisal to database.', 'error');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
        }
    }
}
window.handleAppraisalSubmit = handleAppraisalSubmit;

function getKudosXP(rating) {
    const r = parseFloat(rating) || 0;
    if (r >= 5.0) return 20;
    if (r >= 4.0) return 8;
    if (r >= 3.0) return 5;
    return 0;
}
window.getKudosXP = getKudosXP;

function triggerSendKudosForEmployee(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || { id: empId, name: 'Associate' };
    const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
    const rating = evalRec?.calibrated_score ? parseFloat(evalRec.calibrated_score) : (evalRec?.supervisor_rating ? parseFloat(evalRec.supervisor_rating) : (emp.supervisorRating || 4.5));
    const xpPoints = getKudosXP(rating);
    const evalId = evalRec?.id || null;

    showActionConfirmModal({
        title: 'Send Colleague Kudos & Finalize Goal',
        message: `Award +${xpPoints} Performance XP to ${emp.name} for achieving ⭐ ${rating.toFixed(2)} / 5.0 rating? This will log points in xp_ledger, disable further kudos, and mark their performance goal as Completed.`,
        confirmBtnText: `Award +${xpPoints} XP & Complete Goal`,
        confirmBtnClass: 'btn-primary bg-amber-500 hover:bg-amber-600 text-white',
        iconClass: 'fas fa-award',
        iconContainerClass: 'bg-amber-100 text-amber-700',
        onConfirm: async () => {
            try {
                await PerformanceAPI.awardPerformanceXP(emp.id, rating, evalId);
                emp.kudosSent = true;

                // Update local memory goals for this employee to Completed
                (window.dbGoals || []).forEach(g => {
                    if (isSameEmployee(g.employee_id, emp.id)) {
                        g.status = 'Completed';
                    }
                });

                if (typeof showToast === 'function') {
                    showToast(`🎉 +${xpPoints} XP awarded to ${emp.name}! Performance goal marked as Completed.`, 'success');
                }

                renderIDPRosterTable();
                showIDPDetail(emp.id);
                await loadAndRenderPlanningGoals();
            } catch (err) {
                console.error('Award XP error:', err);
                if (typeof showToast === 'function') {
                    showToast(err.message || 'Failed to award XP', 'error');
                }
            }
        }
    });
}
window.triggerSendKudosForEmployee = triggerSendKudosForEmployee;


function renderReviewRosterTable() {
    const container = document.getElementById('review-roster-tbody');
    if (!container) return;
    container.innerHTML = '';

    // ONLY display employees who have active approved goals (exclude Completed) AND a completed Stage 4 evaluation
    let evaluatedEmployees = (window.perfRoster || []).filter(emp => {
        const hasGoal = (window.dbGoals || []).some(g => g.status === 'Approved' && isSameEmployee(g.employee_id, emp.id));
        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const hasEval = evalRec && typeof evalRec.supervisor_rating !== 'undefined' && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0;
        return hasGoal && hasEval;
    });

    // Search query filter
    if (window.reviewSearchQuery && window.reviewSearchQuery.trim()) {
        const q = window.reviewSearchQuery.toLowerCase().trim();
        evaluatedEmployees = evaluatedEmployees.filter(emp => (emp.name || '').toLowerCase().includes(q) || (emp.position || '').toLowerCase().includes(q) || (emp.department || '').toLowerCase().includes(q));
    }

    if (evaluatedEmployees.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="px-5 py-8 text-center text-slate-400 italic bg-slate-50">
                    <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2 text-base">
                        <i class="fas fa-sliders"></i>
                    </div>
                    <p class="font-bold text-slate-700 mb-0.5">No Calibrations Available</p>
                    <p class="text-slate-400 text-[11px]">Employees must have active approved performance goals and completed Stage 4 supervisor evaluations before 1-on-1 calibration can occur.</p>
                </td>
            </tr>
        `;
        showEmptyCalibrationDetail();
        return;
    }

    // Auto-select first evaluated employee if none selected
    if (!window.selectedCalibEmpId || !evaluatedEmployees.some(e => isSameEmployee(e.id, window.selectedCalibEmpId))) {
        window.selectedCalibEmpId = evaluatedEmployees[0].id;
    }
    showCalibrationDetail(window.selectedCalibEmpId, false);

    evaluatedEmployees.forEach(emp => {
        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;

        const rawSupScore = evalRec ? parseFloat(evalRec.supervisor_rating || 0) : (parseFloat(emp.supervisorRating || emp.managerRating || 0));
        const calibScore = evalRec && evalRec.calibrated_score ? parseFloat(evalRec.calibrated_score) : (rawSupScore > 0 ? rawSupScore : null);
        const isCalibrated = evalRec && (evalRec.status === 'Calibrated' || (evalRec.calibrated_score !== null && evalRec.calibrated_score !== undefined && evalRec.status !== 'Rated'));
        const tierLabel = evalRec?.tier_label || (calibScore ? (calibScore >= 4.5 ? 'Master Tier' : (calibScore >= 3.5 ? 'Advanced Tier' : (calibScore >= 3.0 ? 'Proficient' : 'Developing (Needs PIP)'))) : 'Pending');
        const effectiveScore = calibScore !== null ? calibScore : rawSupScore;

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition text-xs border-b border-slate-100';
        tr.innerHTML = `
            <td class="px-5 py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-xs">
                        ${emp.avatar || (emp.name ? emp.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'EM')}
                    </div>
                    <div>
                        <p class="font-bold text-slate-900 leading-tight max-w-[150px] truncate" title="${emp.name}">${emp.name}</p>
                        <p class="text-[10px] text-slate-400 max-w-[150px] truncate" title="${emp.position}">${emp.position}</p>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4 text-slate-600 font-medium max-w-[130px] truncate" title="${emp.department}">${emp.department}</td>
            <td class="px-5 py-4">
                ${rawSupScore > 0 ? `
                    <span class="font-mono font-bold text-xs ${rawSupScore < 3.0 ? 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200' : 'text-slate-800'}">
                        ⭐ ${rawSupScore.toFixed(2)} / 5.0
                    </span>
                ` : `<span class="text-slate-400 italic text-[11px]">Unrated</span>`}
            </td>
            <td class="px-5 py-4">
                ${calibScore ? `
                    <div class="space-y-0.5">
                        <span class="font-bold font-mono text-xs ${calibScore < 3.0 ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200' : 'text-indigo-700'}">
                            ⭐ ${calibScore.toFixed(2)} / 5.0
                        </span>
                        <span class="text-[10px] text-slate-500 block font-medium">(${tierLabel})</span>
                    </div>
                ` : `<span class="text-slate-400 italic text-[11px]">Pending 1-on-1</span>`}
            </td>
            <td class="px-5 py-4 text-center">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isCalibrated ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}">
                    ${isCalibrated ? '✓ Calibrated' : 'Pending 1-on-1'}
                </span>
            </td>
            <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end space-x-1.5">
                    <button onclick="showCalibrationDetail('${emp.id}', true)" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center space-x-1" title="View Calibration Detail Card">
                        <i class="fas fa-eye text-indigo-600"></i>
                        <span>View</span>
                    </button>
                    ${effectiveScore >= 3.0 ? `
                        <button onclick="triggerSendKudosForEmployee('${emp.id}')" class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs border border-amber-200 transition flex items-center space-x-1" title="Send Colleague Kudos">
                            <i class="fas fa-award text-amber-600"></i>
                            <span>Send Kudos</span>
                        </button>
                    ` : `
                        <button onclick="switchSubTab('perf', 'idp'); showIDPDetail('${emp.id}', true);" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-xl text-xs border border-rose-200 transition flex items-center space-x-1" title="Create Development Plan in Stage 6">
                            <i class="fas fa-file-pen text-rose-600"></i>
                            <span>Create Dev Plan</span>
                        </button>
                    `}
                    ${(isEmployeeInTraining(emp.id) && !isEmployeeTrainingScored(emp.id)) ? `
                        <button disabled class="px-2.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 font-bold rounded-xl text-xs cursor-not-allowed flex items-center space-x-1" title="In Training: Calibration locked until training score is recorded.">
                            <i class="fas fa-lock text-[10px]"></i>
                            <span>In Training</span>
                        </button>
                    ` : ((isEmployeeInTraining(emp.id) && isEmployeeTrainingScored(emp.id)) ? `
                        <button onclick="open1on1CalibrationModal('${emp.id}')" class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-1" title="Training completed! Open Post-Training Calibration">
                            <i class="fas fa-sliders"></i>
                            <span>Calibrate (After Training)</span>
                        </button>
                    ` : (isCalibrated ? `
                        <button onclick="open1on1CalibrationModal('${emp.id}')" class="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-1" title="Re-Calibrate 1-on-1 Review">
                            <i class="fas fa-sliders"></i>
                            <span>Re-Calibrate</span>
                        </button>
                    ` : `
                        <button onclick="open1on1CalibrationModal('${emp.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-1" title="Calibrate and Record 1-on-1 Review">
                            <i class="fas fa-sliders"></i>
                            <span>Calibrate</span>
                        </button>
                    `))}
                </div>
            </td>
        `;
        container.appendChild(tr);
    });
}
window.renderReviewRosterTable = renderReviewRosterTable;

window.onReviewEmployeeSearch = function(query) {
    window.reviewSearchQuery = query;
    renderReviewRosterTable();
};

function showEmptyCalibrationDetail() {
    const titleEl = document.getElementById('calib-detail-emp-title');
    const roleEl = document.getElementById('calib-detail-emp-role');
    const avatarEl = document.getElementById('calib-detail-emp-avatar');
    const scoreValEl = document.getElementById('calib-detail-score-val');
    const tierLabelEl = document.getElementById('calib-detail-tier-label');
    const minutesEl = document.getElementById('calib-detail-discussion-minutes');
    const statusBadge = document.getElementById('calib-detail-status-badge');
    const nextStepContainer = document.getElementById('calib-next-step-container');

    if (titleEl) titleEl.textContent = 'No Calibrations Pending';
    if (roleEl) roleEl.textContent = 'Awaiting active goals & completed Stage 4 evaluations in database';
    if (avatarEl) avatarEl.textContent = '--';
    if (scoreValEl) {
        scoreValEl.textContent = '0.00';
        if (scoreValEl.parentElement) scoreValEl.parentElement.className = 'text-3xl font-heading font-bold text-slate-400';
    }
    if (tierLabelEl) tierLabelEl.textContent = 'Pending Evaluation';
    if (statusBadge) {
        statusBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500';
        statusBadge.textContent = 'No Active Evaluations';
    }
    if (minutesEl) {
        minutesEl.innerHTML = '<p class="text-slate-400 italic text-center p-3 bg-slate-50 rounded-xl border border-slate-200">No 1-on-1 calibration minutes recorded in database yet.</p>';
    }
    if (nextStepContainer) {
        nextStepContainer.innerHTML = `
            <div class="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                <i class="fas fa-sliders text-slate-400 text-base mb-1 block"></i>
                No active 1-on-1 calibrations available. Set and approve performance goals in Stage 1 &amp; 2, and complete Stage 4 appraisal evaluations first.
            </div>
        `;
    }
}
window.showEmptyCalibrationDetail = showEmptyCalibrationDetail;

function showCalibrationDetail(empId, openModalImmediately = false) {
    if (!empId) {
        showEmptyCalibrationDetail();
        return;
    }

    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));
    if (!emp) {
        showEmptyCalibrationDetail();
        return;
    }

    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, emp.id));
    const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;

    if (empGoals.length === 0 || !evalRec) {
        showEmptyCalibrationDetail();
        return;
    }

    window.selectedCalibEmpId = emp.id;

    const titleEl = document.getElementById('calib-modal-emp-title') || document.getElementById('calib-detail-emp-title');
    const roleEl = document.getElementById('calib-modal-emp-subtitle') || document.getElementById('calib-detail-emp-role');
    const avatarEl = document.getElementById('calib-detail-emp-avatar');
    const statusBadge = document.getElementById('calib-modal-status-badge') || document.getElementById('calib-detail-status-badge');
    const scoreValEl = document.getElementById('calib-detail-score-val');
    const tierLabelEl = document.getElementById('calib-detail-tier-label');
    const minutesEl = document.getElementById('calib-detail-discussion-minutes');
    const nextStepContainer = document.getElementById('calib-next-step-container');

    if (titleEl) titleEl.textContent = `${emp.name} — 1-on-1 Discussion Minutes`;
    if (roleEl) roleEl.textContent = `${emp.position} · ${emp.department}`;
    if (avatarEl) avatarEl.textContent = emp.avatar || emp.name.split(' ').map(n => n[0]).join('').substring(0, 2);

    const isCalibrated = evalRec && (evalRec.status === 'Calibrated' || (evalRec.calibrated_score !== null && evalRec.calibrated_score !== undefined && evalRec.status !== 'Rated'));
    const calibScore = isCalibrated && evalRec?.calibrated_score ? parseFloat(evalRec.calibrated_score) : null;
    const rawSupScore = evalRec?.supervisor_rating ? parseFloat(evalRec.supervisor_rating) : 0.00;
    const tier = isCalibrated ? (evalRec?.tier_label || (calibScore ? (calibScore >= 4.5 ? 'Master Tier' : (calibScore >= 3.5 ? 'Advanced Tier' : (calibScore >= 3.0 ? 'Proficient' : 'Developing (Needs PIP)'))) : 'Pending Calibration')) : 'Pending 1-on-1 Calibration';

    if (statusBadge) {
        if (isCalibrated) {
            statusBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
            statusBadge.innerHTML = '✓ Calibrated &amp; Approved';
        } else {
            statusBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200';
            statusBadge.innerHTML = 'Pending 1-on-1 Calibration';
        }
    }

    if (scoreValEl) {
        scoreValEl.textContent = calibScore !== null ? calibScore.toFixed(2) : '--';
        if (calibScore !== null && calibScore < 3.0) {
            scoreValEl.parentElement.className = 'text-3xl font-heading font-bold text-rose-600';
        } else if (calibScore !== null) {
            scoreValEl.parentElement.className = 'text-3xl font-heading font-bold text-indigo-700';
        } else {
            scoreValEl.parentElement.className = 'text-3xl font-heading font-bold text-slate-400';
        }
    }

    if (tierLabelEl) tierLabelEl.textContent = tier;

    if (minutesEl) {
        const recordedMinutes = evalRec?.digital_signoffs?.discussion_minutes;
        if (recordedMinutes) {
            minutesEl.innerHTML = `<p class="italic text-slate-700 leading-relaxed">"${recordedMinutes}"</p>`;
        } else if (evalRec && evalRec.supervisor_notes) {
            minutesEl.innerHTML = `<p class="italic text-slate-600 leading-relaxed">Supervisor Appraisal Note: "${evalRec.supervisor_notes}". <span class="text-amber-600 block mt-1 font-semibold">1-on-1 discussion minutes pending formal recording.</span></p>`;
        } else {
            minutesEl.innerHTML = `<p class="text-slate-400 italic text-center p-3 bg-slate-50 rounded-xl border border-slate-200">No 1-on-1 calibration minutes recorded in database yet.</p>`;
        }
    }

    const openCalibBtn = document.getElementById('calib-detail-btn-open-modal');
    const inTrainingCalib = isEmployeeInTraining(emp.id);
    const isScoredCalib = isEmployeeTrainingScored(emp.id);
    const retryCountCalib = getEmployeeRetryCount(emp.id);
    const isGoalFailedCalib = isEmployeeGoalFailed(emp.id);

    if (openCalibBtn) {
        if (isGoalFailedCalib || retryCountCalib >= 4) {
            openCalibBtn.disabled = true;
            openCalibBtn.className = 'btn-secondary px-4 py-2 text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none flex items-center space-x-1.5';
            openCalibBtn.innerHTML = `<i class="fas fa-lock mr-1.5"></i><span>Locked (${isGoalFailedCalib ? 'Goal Failed' : 'Final Eval in Phase 7'})</span>`;
            openCalibBtn.onclick = null;
        } else if (inTrainingCalib && !isScoredCalib) {
            openCalibBtn.disabled = true;
            openCalibBtn.className = 'btn-secondary px-4 py-2 text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none flex items-center space-x-1.5';
            openCalibBtn.innerHTML = '<i class="fas fa-lock mr-1.5"></i><span>In Training (Locked)</span>';
            openCalibBtn.onclick = null;
        } else if (inTrainingCalib && isScoredCalib) {
            openCalibBtn.disabled = false;
            openCalibBtn.className = 'btn-primary px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-xs flex items-center space-x-1.5';
            openCalibBtn.innerHTML = '<i class="fas fa-sliders mr-1.5"></i><span>Calibrate (After Training)</span>';
            openCalibBtn.setAttribute('onclick', `open1on1CalibrationModal('${emp.id}')`);
        } else {
            openCalibBtn.disabled = false;
            openCalibBtn.className = 'btn-primary px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 border-indigo-600 shadow-xs flex items-center space-x-1.5';
            openCalibBtn.innerHTML = '<i class="fas fa-sliders mr-1.5"></i><span>Calibrate 1-on-1</span>';
            openCalibBtn.setAttribute('onclick', `open1on1CalibrationModal('${emp.id}')`);
        }
    }

    // Dynamic Next Step: Show Send Colleague Kudos if >= 3.0, or Create Development Plan if < 3.0
    if (nextStepContainer) {
        const effectiveScore = calibScore !== null ? calibScore : rawSupScore;
        if (inTrainingCalib && !isScoredCalib) {
            const tnNeed = getEmployeeTrainingNeed(emp.id);
            nextStepContainer.innerHTML = `
                <div class="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-purple-950">
                    <div class="flex items-center space-x-2.5">
                        <i class="fas fa-graduation-cap text-purple-600 text-base"></i>
                        <span><strong>Mandatory Training Enrolled:</strong> ${tnNeed ? tnNeed.title : 'Formal Curriculum'}. 1-on-1 Calibration is locked until training score is recorded in training_needs.</span>
                    </div>
                    <span class="px-3 py-1 bg-purple-200 text-purple-900 rounded-xl font-bold text-xs">In Training</span>
                </div>
            `;
        } else if (effectiveScore >= 3.0) {
            nextStepContainer.innerHTML = `
                <div class="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
                    <div class="flex items-center space-x-2.5">
                        <i class="fas fa-award text-emerald-600 text-base"></i>
                        <span>Associate rating meets proficiency benchmark (⭐ <strong>${effectiveScore.toFixed(2)} / 5.0</strong>). Send recognition kudos to celebrate their achievement!</span>
                    </div>
                    <button onclick="triggerSendKudosForEmployee('${emp.id}')" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-xs transition flex-shrink-0 flex items-center space-x-1.5">
                        <i class="fas fa-award"></i>
                        <span>Send Colleague Kudos &rarr;</span>
                    </button>
                </div>
            `;
        } else if (effectiveScore > 0 && effectiveScore < 3.0) {
            nextStepContainer.innerHTML = `
                <div class="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-950">
                    <div class="flex items-center space-x-2.5">
                        <i class="fas fa-triangle-exclamation text-rose-600 text-base"></i>
                        <span><strong>Performance Gap Detected:</strong> Score (⭐ <strong>${effectiveScore.toFixed(2)} / 5.0</strong>) is below 3.0 standard. Proceed to Stage 6 to create an Individual Development Plan.</span>
                    </div>
                    <button onclick="switchSubTab('perf', 'idp'); showIDPDetail('${emp.id}', true);" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition flex-shrink-0 flex items-center space-x-1.5">
                        <i class="fas fa-file-pen"></i>
                        <span>Create Development Plan &rarr;</span>
                    </button>
                </div>
            `;
        } else {
            nextStepContainer.innerHTML = `
                <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
                    <div class="flex items-center space-x-2.5">
                        <i class="fas fa-sliders text-amber-600 text-base"></i>
                        <span>Supervisor appraisal complete. Ready for formal 1-on-1 rating calibration.</span>
                    </div>
                    <button onclick="open1on1CalibrationModal('${emp.id}')" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex-shrink-0">
                        Calibrate 1-on-1 &rarr;
                    </button>
                </div>
            `;
        }
    }

    if (openModalImmediately) {
        openModal('modal-view-calibration');
    }
}

window.showCalibrationDetail = showCalibrationDetail;

function open1on1CalibrationModal(empId) {
    if (!empId) {
        if (typeof showToast === 'function') {
            showToast('⚠️ Please select an employee to calibrate.', 'info');
        }
        return;
    }

    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));
    if (!emp) {
        if (typeof showToast === 'function') {
            showToast('Employee not found in performance roster.', 'error');
        }
        return;
    }

    // 1. Guard check: Employee must have active goals in the database
    const empGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, emp.id));
    if (empGoals.length === 0) {
        if (typeof showToast === 'function') {
            showToast(`⚠️ Cannot calibrate: No active performance goals found in the database for ${emp.name}. Set and approve goals first.`, 'warning');
        }
        return;
    }

    // 2. Guard check: Employee must have a completed Stage 4 evaluation in the database
    const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
    const hasEval = evalRec && typeof evalRec.supervisor_rating !== 'undefined' && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0;
    if (!hasEval) {
        if (typeof showToast === 'function') {
            showToast(`⚠️ Cannot calibrate: Stage 4 formal supervisor appraisal has not been completed yet in the database for ${emp.name}. Complete evaluation first.`, 'warning');
        }
        return;
    }

    window.selectedEvalEmpId = emp.id;

    const targetInput = document.getElementById('calib-target-emp-id');
    const titleEl = document.getElementById('modal-calib-emp-title');
    const nameEl = document.getElementById('calib-emp-name');
    const roleEl = document.getElementById('calib-emp-role');
    const avatarEl = document.getElementById('calib-emp-avatar');
    const selfScoreEl = document.getElementById('calib-self-score-display');
    const supScoreEl = document.getElementById('calib-supervisor-score-display');
    const avgScoreEl = document.getElementById('calib-average-score-display');
    const sliderEl = document.getElementById('calib-score-slider');
    const minutesEl = document.getElementById('calib-discussion-minutes');
    const tierSelect = document.getElementById('calib-tier-select');

    if (targetInput) targetInput.value = emp.id;
    if (titleEl) titleEl.textContent = `1-on-1 Review & Calibration: ${emp.name}`;
    if (nameEl) nameEl.textContent = emp.name;
    if (roleEl) roleEl.textContent = `${emp.position} · ${emp.department}`;
    if (avatarEl) avatarEl.textContent = emp.avatar || emp.name.split(' ').map(n => n[0]).join('').substring(0, 2);

    const supScore = evalRec ? parseFloat(evalRec.supervisor_rating || 0) : 0;
    const selfScore = evalRec?.self_evaluation ? parseFloat(evalRec.self_evaluation) : 4.50;
    const computedAvg = (selfScore + supScore) / 2;

    if (selfScoreEl) selfScoreEl.textContent = `⭐ ${selfScore.toFixed(2)} / 5.0`;
    if (supScoreEl) supScoreEl.textContent = `⭐ ${supScore.toFixed(2)} / 5.0`;
    if (avgScoreEl) avgScoreEl.textContent = `⭐ ${computedAvg.toFixed(2)} / 5.0`;

    // Initialize calibration value to average of self evaluation + supervisor rating
    const defaultCalibScore = evalRec && evalRec.status === 'Calibrated' && evalRec.calibrated_score ? parseFloat(evalRec.calibrated_score) : computedAvg;
    if (sliderEl) {
        sliderEl.value = defaultCalibScore.toFixed(2);
    }

    if (minutesEl) {
        minutesEl.value = evalRec?.digital_signoffs?.discussion_minutes || `Conducted 1-on-1 performance review discussion with ${emp.name}. Reviewed deliverable outcomes (Self: ${selfScore.toFixed(2)}, Supervisor: ${supScore.toFixed(2)}, Avg: ${computedAvg.toFixed(2)}) and agreed on hospitality development targets.`;
    }

    onCalibrationScoreInput(defaultCalibScore, true);
    openModal('modal-1on1-calibration');
}
window.open1on1CalibrationModal = open1on1CalibrationModal;

function onCalibrationTierSelect(tier) {
    const sliderEl = document.getElementById('calib-score-slider');
    let targetScore = 4.80;
    if (tier === 'Master Tier') {
        targetScore = 4.80;
    } else if (tier === 'Advanced Tier') {
        targetScore = 4.00;
    } else if (tier === 'Proficient') {
        targetScore = 3.20;
    } else if (tier === 'Developing (Needs PIP)') {
        targetScore = 2.50;
    }

    if (sliderEl) {
        sliderEl.value = targetScore.toFixed(2);
    }
    onCalibrationScoreInput(targetScore, false);
}
window.onCalibrationTierSelect = onCalibrationTierSelect;

function onCalibrationScoreInput(val, syncSelect = true) {
    const score = parseFloat(val) || 4.0;
    const isBelow3 = score < 3.0;
    const tier = score >= 4.5 ? 'Master Tier' : (score >= 3.5 ? 'Advanced Tier' : (score >= 3.0 ? 'Proficient' : 'Developing (Needs PIP)'));

    const displayEl = document.getElementById('calib-computed-score-display');
    if (displayEl) {
        displayEl.textContent = `${score.toFixed(2)} / 5.0 (${tier})`;
        if (isBelow3) {
            displayEl.className = 'font-mono font-bold text-sm text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200';
        } else {
            displayEl.className = 'font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200';
        }
    }

    if (syncSelect) {
        const tierSelect = document.getElementById('calib-tier-select');
        if (tierSelect) {
            if (score >= 4.5) tierSelect.value = 'Master Tier';
            else if (score >= 3.5) tierSelect.value = 'Advanced Tier';
            else if (score >= 3.0) tierSelect.value = 'Proficient';
            else tierSelect.value = 'Developing (Needs PIP)';
        }
    }
}
window.onCalibrationScoreInput = onCalibrationScoreInput;

async function handleCalibrationSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const empId = document.getElementById('calib-target-emp-id')?.value || 'emp-101';
    const emp = (window.perfRoster || []).find(e => e.id === empId);

    const scoreSlider = document.getElementById('calib-score-slider');
    const calibratedScore = scoreSlider ? parseFloat(scoreSlider.value) : 4.55;
    const tierSelect = document.getElementById('calib-tier-select');
    const tierLabel = tierSelect ? tierSelect.value : (calibratedScore >= 4.5 ? 'Master Tier' : 'Advanced Tier');
    const discussionMinutes = document.getElementById('calib-discussion-minutes')?.value.trim() || '1-on-1 review session completed.';

    showActionConfirmModal({
        title: 'Confirm 1-on-1 Calibration',
        message: `Lock calibrated score of ⭐ ${calibratedScore.toFixed(2)} / 5.0 (${tierLabel}) for ${emp ? emp.name : 'Employee'}?`,
        confirmBtnText: 'Lock Calibration',
        confirmBtnClass: 'btn-primary bg-indigo-600 hover:bg-indigo-700 text-white',
        iconClass: 'fas fa-sliders',
        iconContainerClass: 'bg-indigo-100 text-indigo-700',
        onConfirm: async () => {
            const submitBtn = document.getElementById('btn-submit-calibration');
            const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Saving to Database...</span>';
            }

            try {
                const empGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, empId));
                const needsTraining = empGoals.some(g => !!g.needs_training);
                const inTrainingScored = isEmployeeInTraining(empId) && isEmployeeTrainingScored(empId);
                const isRetry = needsTraining || inTrainingScored;

                if (inTrainingScored) {
                    try {
                        await PerformanceAPI.setNeedsTraining({ employee_id: empId, needs_training: false, retry_count: 3 });
                    } catch (err) {
                        console.warn('Set retry_count error in calibration:', err);
                    }
                }

                const saved = await PerformanceAPI.calibrateEvaluation({
                    employee_id: empId,
                    calibrated_score: calibratedScore,
                    new_calibrated_score: isRetry ? calibratedScore : undefined,
                    is_retry: isRetry,
                    tier_label: tierLabel,
                    discussion_minutes: discussionMinutes
                });

                // Update local memory and cache
                if (emp) {
                    emp.reviewStatus = 'Calibrated';
                    emp.calibratedScore = calibratedScore;
                    if (isRetry) {
                        emp.newCalibratedScore = calibratedScore;
                    }
                    emp.tierLabel = tierLabel;
                    emp.evaluationRecord = saved;
                }

                // Update dbEvaluations array
                updateDbEvaluationRecord(saved);

                if (typeof showToast === 'function') {
                    showToast(`🎉 1-on-1 Calibration successfully recorded and locked to database for ${emp ? emp.name : 'Employee'}! (${calibratedScore.toFixed(2)} / 5.0)`, 'success');
                }

                // Sync Performance Calibration score directly with Competency Management Radar
                if (typeof window.syncCompetencyWithPerformance === 'function') {
                    window.syncCompetencyWithPerformance(empId);
                }

                closeModal('modal-1on1-calibration');
                renderReviewRosterTable();
                showCalibrationDetail(empId);
                renderIDPRosterTable();
                renderCycleRosterTable();
                updateAllPerfStepperBadges();

                if (typeof loadLiveNotifications === 'function') {
                    loadLiveNotifications(window.activePersonaRole || 'Supervisor');
                }
            } catch (err) {
                console.error('Calibration database submission error:', err);
                if (typeof showToast === 'function') {
                    showToast(err.message || 'Failed to save calibration to database.', 'error');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origBtnHtml;
                }
            }
        }
    });
}
window.handleCalibrationSubmit = handleCalibrationSubmit;

function openPIPModal(empId) {
    const emp = (window.perfRoster || []).find(e => e.id === empId) || (window.perfRoster || [])[0];
    if (!emp) return;

    const evalRec = getDbEvaluations().find(ev => ev.employee_id === emp.id || (emp.id === 'emp-101' && (ev.employee_id === 'emp-1' || ev.employee_id === 'OXF-EMP-1001')) || (emp.id === 'emp-102' && (ev.employee_id === 'emp-2' || ev.employee_id === 'OXF-SUP-2001')));

    const targetInput = document.getElementById('pip-target-emp-id');
    const titleEl = document.getElementById('pip-modal-title');
    const deficienciesEl = document.getElementById('pip-deficiencies');
    const milestonesEl = document.getElementById('pip-milestones');

    if (targetInput) targetInput.value = emp.id;
    if (titleEl) titleEl.textContent = `Performance Improvement Plan (PIP): ${emp.name}`;

    // Extract any specific gaps from DB criteria
    const criteriaGaps = (evalRec?.criteria_scores || []).filter(c => c.rating < 3.0);
    if (deficienciesEl) {
        if (criteriaGaps.length > 0) {
            deficienciesEl.value = criteriaGaps.map(g => `${g.title} (Observed Score: ${g.rating}/5.0 - ${g.rationale || 'Gap below standard'})`).join('\n');
        } else {
            deficienciesEl.value = `Overall appraisal score (${evalRec?.supervisor_rating || '2.80'} / 5.0) is below the hotel 3.0 minimum proficiency standard. Specific focus needed on shift operational consistency.`;
        }
    }

    if (milestonesEl) {
        milestonesEl.value = `1. Complete assigned remedial LMS handbook certifications.\n2. Bi-weekly coaching reviews with assigned mentor.\n3. Achieve >= 90% benchmark compliance over next 60 days.`;
    }

    openModal('modal-pip-action');
}
window.openPIPModal = openPIPModal;

async function handlePIPSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const empId = document.getElementById('pip-target-emp-id')?.value || 'emp-101';
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));
    const deficiencies = document.getElementById('pip-deficiencies')?.value.trim() || 'Remediation plan initiated.';
    const milestones = document.getElementById('pip-milestones')?.value.trim() || 'Complete remedial requirements.';

    try {
        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, empId));
        const currentRating = evalRec?.supervisor_rating ? parseFloat(evalRec.supervisor_rating) : 2.50;

        const updatedEval = await PerformanceAPI.calibrateEvaluation({
            employee_id: empId,
            calibrated_score: currentRating < 3.0 ? currentRating : 2.50,
            tier_label: 'Developing (Needs PIP)',
            discussion_minutes: `[PIP Notice Activated] Deficiencies: ${deficiencies}. Milestones: ${milestones}`
        });

        if (emp) {
            emp.supervisorRating = currentRating < 3.0 ? currentRating : 2.50;
            emp.tierLabel = 'Developing (Needs PIP)';
            emp.evaluationRecord = updatedEval;
        }

        updateDbEvaluationRecord(updatedEval);

        closeModal('modal-pip-action');

        if (typeof showToast === 'function') {
            showToast(`⚠️ Performance Improvement Plan (PIP) activated for ${emp ? emp.name : 'Employee'}. Redirecting to Stage 6...`, 'warning');
        }

        // Redirect to Stage 6: Development Planning (IDP / PIP)
        if (typeof switchSubTab === 'function') {
            switchSubTab('perf', 'idp');
        }
        showIDPDetail(empId);
        updateAllPerfStepperBadges();

    } catch (err) {
        console.error('Error submitting PIP action:', err);
        closeModal('modal-pip-action');
        if (typeof switchSubTab === 'function') {
            switchSubTab('perf', 'idp');
        }
        showIDPDetail(empId);
    }
}
window.handlePIPSubmit = handlePIPSubmit;

/**
 * Open View IDP / PIP Development Plan Modal
 */
function openViewIDPPlanModal(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || (window.perfRoster || [])[0];
    if (!emp) return;

    window.selectedEvalEmpId = emp.id;

    const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, emp.id));

    const avatarEl = document.getElementById('modal-idp-emp-avatar');
    const nameEl = document.getElementById('modal-idp-emp-name');
    const roleEl = document.getElementById('modal-idp-emp-role');
    const ratingEl = document.getElementById('modal-idp-emp-rating');
    const titleEl = document.getElementById('modal-idp-plan-title');
    const statusPill = document.getElementById('modal-idp-plan-status-pill');
    const strengthsList = document.getElementById('modal-idp-strengths-list');
    const gapsList = document.getElementById('modal-idp-gaps-list');
    const commitmentsList = document.getElementById('modal-idp-commitments-list');

    if (avatarEl) avatarEl.textContent = emp.avatar || emp.name.split(' ').map(n => n[0]).join('').substring(0, 2);
    if (nameEl) nameEl.textContent = emp.name;
    if (roleEl) roleEl.textContent = `${emp.position} · ${emp.department}`;

    const rawScore = evalRec?.calibrated_score ? parseFloat(evalRec.calibrated_score) : (evalRec?.supervisor_rating ? parseFloat(evalRec.supervisor_rating) : 0);
    const isPIP = rawScore > 0 && rawScore < 3.0;
    const retryCount = getEmployeeRetryCount(emp.id);
    const isExceededRetry = retryCount >= 3 && isPIP;

    if (ratingEl) {
        if (rawScore > 0) {
            ratingEl.innerHTML = `⭐ ${rawScore.toFixed(2)} / 5.0 <span class="text-xs font-semibold ${isExceededRetry ? 'text-rose-700' : (isPIP ? 'text-rose-600' : 'text-indigo-700')}">(${isExceededRetry ? 'Failed (3/3 Retries Exceeded)' : (evalRec?.tier_label || (isPIP ? 'Developing (Needs PIP)' : 'Proficient'))})</span>`;
            ratingEl.className = `text-sm font-bold font-mono ${isPIP ? 'text-rose-600' : 'text-indigo-700'}`;
        } else {
            ratingEl.innerHTML = `<span class="text-slate-400 italic text-xs">Pending Rating</span>`;
        }
    }

    if (titleEl) {
        titleEl.textContent = isExceededRetry
            ? `Failed Standard — Requires 1-on-1 Training: ${emp.name}`
            : (isPIP ? `Performance Improvement Plan (PIP): ${emp.name}` : `70-20-10 Individual Development Plan: ${emp.name}`);
    }

    if (statusPill) {
        if (isExceededRetry) {
            statusPill.textContent = '🔴 FAILED (Requires 1-on-1 Training)';
            statusPill.className = 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-700 text-white shadow-xs';
        } else if (isPIP) {
            statusPill.textContent = 'Mandatory PIP Active';
            statusPill.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200';
        } else {
            statusPill.textContent = '70-20-10 Growth Framework';
            statusPill.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800';
        }
    }

    const criteria = evalRec && Array.isArray(evalRec.criteria_scores) ? evalRec.criteria_scores : [];
    const strengths = criteria.filter(c => parseFloat(c.rating || 0) >= 3.5);
    const gaps = criteria.filter(c => parseFloat(c.rating || 0) < 3.5);

    if (strengthsList) {
        if (strengths.length > 0) {
            strengthsList.innerHTML = strengths.map(s => `
                <li class="p-2 bg-white rounded-lg border border-emerald-100 flex items-center justify-between">
                    <span class="flex items-center space-x-1.5 font-medium text-slate-800">
                        <i class="fas fa-check-circle text-emerald-600 text-[10px]"></i>
                        <span>${s.title}</span>
                    </span>
                    <span class="font-bold text-emerald-700 font-mono text-[11px]">⭐ ${parseFloat(s.rating).toFixed(1)}</span>
                </li>
            `).join('');
        } else {
            strengthsList.innerHTML = `<li class="p-2.5 text-center text-slate-400 italic bg-white rounded-lg border border-emerald-100">No calibrated strengths recorded.</li>`;
        }
    }

    if (gapsList) {
        if (gaps.length > 0) {
            gapsList.innerHTML = gaps.map(g => `
                <li class="p-2 bg-white rounded-lg border border-amber-200 flex items-center justify-between">
                    <span class="flex items-center space-x-1.5 font-medium text-slate-800">
                        <i class="fas fa-exclamation-triangle ${g.rating < 3.0 ? 'text-rose-600' : 'text-amber-600'} text-[10px]"></i>
                        <span>${g.title}</span>
                    </span>
                    <span class="font-bold ${g.rating < 3.0 ? 'text-rose-600' : 'text-amber-700'} font-mono text-[11px]">⭐ ${parseFloat(g.rating).toFixed(1)}</span>
                </li>
            `).join('');
        } else {
            gapsList.innerHTML = `<li class="p-2.5 text-center text-slate-400 italic bg-white rounded-lg border border-amber-100">No development gaps identified.</li>`;
        }
    }

    if (commitmentsList) {
        if (empGoals.length > 0) {
            commitmentsList.innerHTML = empGoals.map((g, idx) => {
                const tasks = g.tasks || [];
                return `
                    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold ${idx % 3 === 0 ? 'bg-blue-100 text-blue-800' : (idx % 3 === 1 ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800')} px-2 py-0.5 rounded-full">
                                ${idx % 3 === 0 ? '70% Experiential Target' : (idx % 3 === 1 ? '20% Mentorship Target' : '10% Formal Learning')}
                            </span>
                            <span class="text-[10px] font-bold ${g.status === 'Approved' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded' : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded'}">
                                ${g.status || 'Active'}
                            </span>
                        </div>
                        <p class="font-bold text-slate-900 text-xs">${g.title}</p>
                        <p class="text-slate-600 text-[11px]">${g.supervisor_notes || g.evidence || 'Active developmental metric.'}</p>
                        
                        <!-- Tasks list under this goal -->
                        <div class="pt-2 border-t border-slate-200/80 space-y-1">
                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assigned Action Tasks (${tasks.length}):</span>
                            ${tasks.length > 0 ? tasks.map(t => `
                                <div class="flex items-center justify-between text-[11px] p-1.5 bg-white rounded-lg border border-slate-100">
                                    <span class="text-slate-700 font-medium">${t.title}</span>
                                    <span class="text-[10px] font-bold ${t.status === 'completed' ? 'text-emerald-700' : 'text-amber-600'}">
                                        ${t.status === 'completed' ? '✓ Done' : 'Pending'}
                                    </span>
                                </div>
                            `).join('') : '<p class="text-slate-400 italic text-[10px]">No specific tasks assigned yet.</p>'}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            commitmentsList.innerHTML = `<div class="p-6 text-center text-slate-400 italic bg-slate-50 rounded-xl border border-slate-200">No approved commitments or goals assigned in database.</div>`;
        }
    }

    openModal('modal-view-idp-plan');
}
window.openViewIDPPlanModal = openViewIDPPlanModal;

/**
 * Open Add Specific Task Modal
 */
function openAddSpecificTaskModal(empId, preselectedGoalId = null) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || (window.perfRoster || [])[0];
    if (!emp) return;

    window.selectedEvalEmpId = emp.id;

    const targetEmpInput = document.getElementById('add-task-target-emp-id');
    const goalSelect = document.getElementById('add-task-goal-select');
    const targetDateInput = document.getElementById('add-task-target-date');
    const titleInput = document.getElementById('add-task-title');
    const descInput = document.getElementById('add-task-description');

    if (targetEmpInput) targetEmpInput.value = emp.id;
    if (titleInput) titleInput.value = '';
    if (descInput) descInput.value = '';

    // Default target date: 14 days ahead
    if (targetDateInput) {
        const d = new Date();
        d.setDate(d.getDate() + 14);
        targetDateInput.value = d.toISOString().split('T')[0];
    }

    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, emp.id));
    if (goalSelect) {
        if (empGoals.length > 0) {
            goalSelect.innerHTML = empGoals.map(g => `
                <option value="${g.id}" ${preselectedGoalId && g.id == preselectedGoalId ? 'selected' : ''}>
                    ${g.title} (Target: ${g.target_date || 'Q3 Target'})
                </option>
            `).join('');
        } else {
            goalSelect.innerHTML = '<option value="">No approved goals found for associate</option>';
        }
    }

    openModal('modal-add-specific-task');
}
window.openAddSpecificTaskModal = openAddSpecificTaskModal;

/**
 * Handle Add Specific Task Form Submission
 */
async function handleCreateSpecificTaskSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const empId = document.getElementById('add-task-target-emp-id')?.value || window.selectedEvalEmpId || 'emp-101';
    const goalId = document.getElementById('add-task-goal-select')?.value;
    const title = document.getElementById('add-task-title')?.value.trim();
    const targetDate = document.getElementById('add-task-target-date')?.value;
    const description = document.getElementById('add-task-description')?.value.trim();

    if (!goalId) {
        if (typeof showToast === 'function') showToast('Please select a target goal.', 'warning');
        return;
    }
    if (!title) {
        if (typeof showToast === 'function') showToast('Please provide a task title.', 'warning');
        return;
    }

    const submitBtn = document.getElementById('btn-submit-specific-task');
    const origHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Saving...';
    }

    try {
        await PerformanceAPI.createSpecificTask({
            goal_id: goalId,
            employee_id: empId,
            title: title,
            target_date: targetDate,
            description: description
        });

        if (typeof showToast === 'function') {
            showToast(`✅ Specific action task "${title}" assigned to associate in database!`, 'success');
        }

        closeModal('modal-add-specific-task');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origHtml;
        }
    }
}
window.handleCreateSpecificTaskSubmit = handleCreateSpecificTaskSubmit;

function showEmptyIDPDetail() {
    const titleEl = document.getElementById('idp-detail-title');
    const subtitleEl = document.getElementById('idp-detail-subtitle');
    const strengthsList = document.getElementById('idp-detail-strengths-list');
    const gapsList = document.getElementById('idp-detail-gaps-list');
    const strengthsCount = document.getElementById('idp-strengths-count');
    const gapsCount = document.getElementById('idp-gaps-count');
    const commitmentsContainer = document.getElementById('idp-perf-commitments-container');
    const headerActions = document.getElementById('idp-header-actions');
    const headerLmsAction = document.getElementById('idp-commitments-header-action');

    if (titleEl) titleEl.textContent = '70-20-10 Individual Development Plan (IDP)';
    if (subtitleEl) subtitleEl.textContent = 'No evaluated associate selected. Complete Stage 4 evaluation and Stage 5 calibration first.';
    if (strengthsCount) strengthsCount.textContent = '0 Calibrated';
    if (gapsCount) gapsCount.textContent = '0 Action Needed';
    if (strengthsList) strengthsList.innerHTML = `<li class="p-3 text-center text-slate-400 italic bg-white rounded-xl border border-emerald-100">No calibrated strengths available.</li>`;
    if (gapsList) gapsList.innerHTML = `<li class="p-3 text-center text-slate-400 italic bg-white rounded-xl border border-amber-100">No development gaps recorded.</li>`;
    if (headerActions) headerActions.innerHTML = '';
    if (headerLmsAction) headerLmsAction.innerHTML = '';
    if (commitmentsContainer) {
        commitmentsContainer.innerHTML = `
            <div class="col-span-3 p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 italic space-y-1.5">
                <i class="fas fa-book-open text-2xl text-slate-300 block"></i>
                <p class="font-semibold text-slate-600 text-xs">No evaluated IDP commitments available.</p>
                <p class="text-[11px] text-slate-400">Complete formal evaluations in Stage 4 and calibration in Stage 5 first.</p>
            </div>
        `;
    }
}
window.showEmptyIDPDetail = showEmptyIDPDetail;

function renderIDPRosterTable() {
    const container = document.getElementById('idp-roster-tbody');
    if (!container) return;
    container.innerHTML = '';

    // Show employees who have goals and evaluated ratings in database (Phase 4 / 5 evaluation)
    let roster = (window.perfRoster && window.perfRoster.length > 0) ? window.perfRoster.filter(emp => {
        const hasGoal = (window.dbGoals || []).some(g => isSameEmployee(g.employee_id, emp.id));
        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const score = (evalRec && evalRec.calibrated_score !== undefined && evalRec.calibrated_score !== null && parseFloat(evalRec.calibrated_score) > 0)
            ? parseFloat(evalRec.calibrated_score)
            : ((evalRec && evalRec.supervisor_rating !== undefined && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0)
                ? parseFloat(evalRec.supervisor_rating)
                : 0);
        return hasGoal && score > 0;
    }) : [];

    // Search query filter
    if (window.idpSearchQuery && window.idpSearchQuery.trim()) {
        const q = window.idpSearchQuery.toLowerCase().trim();
        roster = roster.filter(emp => (emp.name || '').toLowerCase().includes(q) || (emp.position || '').toLowerCase().includes(q) || (emp.department || '').toLowerCase().includes(q));
    }

    if (roster.length === 0) {
        container.innerHTML = `<tr><td colspan="5" class="px-5 py-6 text-center text-slate-400 italic">No employees with evaluated ratings found in IDP roster. Complete Stage 4 appraisals and Stage 5 calibration first.</td></tr>`;
        showEmptyIDPDetail();
        return;
    }

    roster.forEach(emp => {
        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const score = (evalRec && evalRec.calibrated_score !== undefined && evalRec.calibrated_score !== null && parseFloat(evalRec.calibrated_score) > 0)
            ? parseFloat(evalRec.calibrated_score)
            : ((evalRec && evalRec.supervisor_rating !== undefined && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0)
                ? parseFloat(evalRec.supervisor_rating)
                : 0);
        const hasPassed = score >= 3.0;
        const retryCount = getEmployeeRetryCount(emp.id);
        const isExceededRetry = retryCount >= 3 && !hasPassed;
        const xpPts = getKudosXP(score);
        const isGoalCompleted = (window.dbGoals || []).some(g => isSameEmployee(g.employee_id, emp.id) && g.status === 'Completed');
        const isKudosDisabled = !!(emp.kudosSent || isGoalCompleted);

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition text-xs border-b border-slate-100';
        tr.innerHTML = `
            <td class="px-5 py-4 font-bold text-slate-900">
                <div class="flex items-center space-x-2.5">
                    <div class="w-7 h-7 rounded-full ${emp.avatarBg || 'bg-emerald-100 text-emerald-800'} font-bold flex items-center justify-center text-xs shadow-2xs">
                        ${emp.avatar || (emp.name ? emp.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'EM')}
                    </div>
                    <span class="max-w-[150px] truncate" title="${emp.name}">${emp.name}</span>
                </div>
            </td>
            <td class="px-5 py-4 text-slate-500 max-w-[150px] truncate" title="${emp.position} · ${emp.department}">${emp.position} · ${emp.department}</td>
            <td class="px-5 py-4 font-bold text-slate-800">
                ${isExceededRetry ? `
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-200 text-rose-900 border border-rose-300">
                        Failed (${score.toFixed(2)}/5.0)
                    </span>
                ` : `
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${!hasPassed && score > 0 ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
                        ${!hasPassed && score > 0 ? `PIP Remediation (${score.toFixed(2)}/5.0)` : `⭐ Proficient (${score.toFixed(2)}/5.0)`}
                    </span>
                `}
            </td>
            <td class="px-5 py-4">
                ${isExceededRetry ? `
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-700 text-white shadow-xs">
                        🔴 FAILED (Requires 1-on-1 Training)
                    </span>
                ` : `
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isGoalCompleted ? 'bg-indigo-100 text-indigo-800' : (hasPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}">
                        ${isGoalCompleted ? 'Goal Completed ✓' : (hasPassed ? 'Clearance Active' : 'Action Plan Active')}
                    </span>
                `}
            </td>
            <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end space-x-1.5">
                    <button onclick="showIDPDetail('${emp.id}', true)" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center space-x-1">
                        <i class="fas fa-eye"></i>
                        <span>View IDP</span>
                    </button>
                    ${hasPassed ? (isKudosDisabled ? `
                        <button disabled class="px-2.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-xs font-bold cursor-not-allowed inline-flex items-center space-x-1" title="Kudos already awarded &amp; performance goal marked as completed">
                            <i class="fas fa-check text-emerald-600"></i>
                            <span>Kudos Sent (+${xpPts} XP)</span>
                        </button>
                    ` : `
                        <button onclick="triggerSendKudosForEmployee('${emp.id}')" class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center space-x-1" title="Send Colleague Kudos &amp; Award XP">
                            <i class="fas fa-award text-amber-600"></i>
                            <span>Send Kudos (+${xpPts} XP)</span>
                        </button>
                    `) : `
                        <button onclick="searchEmployeeInStage('cycle', '${(emp.name || '').replace(/'/g, "\\'")}')" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center space-x-1" title="Proceed to Phase 7 Transition &amp; Rollover">
                            <i class="fas fa-arrow-right text-rose-600"></i>
                            <span>Proceed to Phase 7</span>
                        </button>
                    `}
                </div>
            </td>
        `;
        container.appendChild(tr);
    });

    if (roster.length > 0) {
        if (!window.selectedEvalEmpId || !roster.some(e => isSameEmployee(e.id, window.selectedEvalEmpId))) {
            window.selectedEvalEmpId = roster[0].id;
        }
        showIDPDetail(window.selectedEvalEmpId, false);
    }
}
window.renderIDPRosterTable = renderIDPRosterTable;

window.onIDPEmployeeSearch = function(query) {
    window.idpSearchQuery = query;
    renderIDPRosterTable();
};

function showIDPDetail(empId, openModalImmediately = false) {
    if (!empId) {
        showEmptyIDPDetail();
        return;
    }

    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));
    if (!emp) {
        showEmptyIDPDetail();
        return;
    }

    const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
    const score = evalRec?.calibrated_score ? parseFloat(evalRec.calibrated_score) : (evalRec?.supervisor_rating ? parseFloat(evalRec.supervisor_rating) : 0);

    if (score === 0) {
        showEmptyIDPDetail();
        return;
    }

    window.selectedEvalEmpId = emp.id;

    const titleEl = document.getElementById('idp-detail-title');
    const subtitleEl = document.getElementById('idp-detail-subtitle');
    const strengthsList = document.getElementById('idp-detail-strengths-list');
    const gapsList = document.getElementById('idp-detail-gaps-list');
    const strengthsCount = document.getElementById('idp-strengths-count');
    const gapsCount = document.getElementById('idp-gaps-count');
    const commitmentsContainer = document.getElementById('idp-perf-commitments-container');
    const headerActions = document.getElementById('idp-header-actions');
    const headerLmsAction = document.getElementById('idp-commitments-header-action');

    const isPIP = score < 3.0;
    const hasPassedBenchmark = score >= 3.0;
    const retryCount = getEmployeeRetryCount(emp.id);
    const inTraining = isEmployeeInTraining(emp.id);
    const tnNeed = getEmployeeTrainingNeed(emp.id);
    const isScored = isEmployeeTrainingScored(emp.id);
    const isGoalFailed = isEmployeeGoalFailed(emp.id);
    const isNeeds1on1 = (retryCount >= 3 && isScored && !hasPassedBenchmark) || retryCount >= 4 || isGoalFailed;
    const isExceededRetry = (retryCount >= 3 && !hasPassedBenchmark) || isNeeds1on1;
    const xpPts = getKudosXP(score);
    const isGoalCompleted = (window.dbGoals || []).some(g => isSameEmployee(g.employee_id, emp.id) && g.status === 'Completed');
    const isKudosDisabled = !!(emp.kudosSent || isGoalCompleted);

    if (titleEl) {
        titleEl.textContent = isNeeds1on1
            ? `Needs Mandatory 1-on-1 Training: ${emp.name}`
            : (isExceededRetry
                ? `Failed Standard — Requires Mandatory 1-on-1 Training: ${emp.name}`
                : (isPIP ? `Performance Improvement Plan (PIP) & IDP: ${emp.name}` : `70-20-10 Individual Development Plan (IDP): ${emp.name}`));
    }
    if (subtitleEl) subtitleEl.textContent = `Position: ${emp.position} · ${emp.department} · Review Cycle ${evalRec?.cycle_period || '2026-Q3'}`;

    if (headerActions) {
        if (hasPassedBenchmark) {
            if (isKudosDisabled) {
                headerActions.innerHTML = `
                    <button disabled class="px-4 py-2 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-xs font-bold cursor-not-allowed flex items-center space-x-1.5">
                        <i class="fas fa-check text-emerald-600"></i>
                        <span>Kudos Sent (+${xpPts} XP) · Goal Completed</span>
                    </button>
                `;
            } else {
                headerActions.innerHTML = `
                    <button onclick="triggerSendKudosForEmployee('${emp.id}')" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition">
                        <i class="fas fa-award"></i>
                        <span>Send Colleague Kudos (+${xpPts} XP)</span>
                    </button>
                `;
            }
        } else if (isNeeds1on1) {
            headerActions.innerHTML = `
                <button onclick="searchEmployeeInStage('cycle', '${(emp.name || '').replace(/'/g, "\\'")}')" class="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition">
                    <i class="fas fa-arrow-right"></i>
                    <span>Proceed to Phase 7 Transition &rarr;</span>
                </button>
            `;
        } else if (isExceededRetry) {
            headerActions.innerHTML = `
                <button onclick="searchEmployeeInStage('cycle', '${(emp.name || '').replace(/'/g, "\\'")}')" class="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition">
                    <i class="fas fa-arrow-right"></i>
                    <span>Proceed to Phase 7 Transition &rarr;</span>
                </button>
                <button onclick="openFormalCurriculumModal('${emp.id}')" class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition">
                    <i class="fas fa-chalkboard-user"></i>
                    <span>Assign 1-on-1 Training</span>
                </button>
            `;
        } else {
            headerActions.innerHTML = `
                <button onclick="searchEmployeeInStage('cycle', '${(emp.name || '').replace(/'/g, "\\'")}')" class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition">
                    <i class="fas fa-arrow-right"></i>
                    <span>Proceed to Phase 7 Transition &rarr;</span>
                </button>
                ${(inTraining && !isScored) ? `
                    <button disabled class="px-3.5 py-2 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-xs font-semibold cursor-not-allowed flex items-center space-x-1.5" title="Associate is currently enrolled in Mandatory Formal Training.">
                        <i class="fas fa-lock"></i>
                        <span>Prescribe LMS Books (Locked)</span>
                    </button>
                ` : `
                    <button onclick="openRemedialBooksModal('${emp.id}')" class="px-3.5 py-2 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition">
                        <i class="fas fa-book-medical"></i>
                        <span>Prescribe LMS Books</span>
                    </button>
                `}
            `;
        }
    }



    if (headerLmsAction) {
        if (hasPassedBenchmark) {
            if (isKudosDisabled) {
                headerLmsAction.innerHTML = `
                    <span class="text-xs text-slate-400 font-bold flex items-center space-x-1">
                        <i class="fas fa-check text-emerald-600 text-[11px]"></i>
                        <span>Kudos Awarded (+${xpPts} XP)</span>
                    </span>
                `;
            } else {
                headerLmsAction.innerHTML = `
                    <button onclick="triggerSendKudosForEmployee('${emp.id}')" class="text-xs text-amber-600 font-bold hover:underline flex items-center space-x-1">
                        <i class="fas fa-award text-[11px]"></i>
                        <span>Send Colleague Kudos &rarr;</span>
                    </button>
                `;
            }
        } else if (isExceededRetry) {
            headerLmsAction.innerHTML = `
                <button onclick="openFormalCurriculumModal('${emp.id}')" class="text-xs text-rose-700 font-bold hover:underline flex items-center space-x-1">
                    <i class="fas fa-chalkboard-user text-[11px]"></i>
                    <span>Assign 1-on-1 Formal Program &rarr;</span>
                </button>
            `;
        } else {
            headerLmsAction.innerHTML = `
                <button onclick="openRemedialBooksModal('${emp.id}')" class="text-xs text-primary font-bold hover:underline flex items-center space-x-1">
                    <i class="fas fa-book-bookmark text-[11px]"></i>
                    <span>Browse All LMS Books &rarr;</span>
                </button>
            `;
        }
    }

    const criteria = evalRec && Array.isArray(evalRec.criteria_scores) ? evalRec.criteria_scores : [];
    const strengths = criteria.filter(c => parseFloat(c.rating || 0) >= 3.5);
    const gaps = criteria.filter(c => parseFloat(c.rating || 0) < 3.5);

    const empKey = isSameEmployee(emp.id, 'emp-101') ? 'maria' : (isSameEmployee(emp.id, 'emp-102') ? 'antonio' : emp.id);
    const prescribedList = [
        ...(window.prescribedBooksPerAssociate?.[empKey] || []),
        ...(window.prescribedBooksPerAssociate?.[emp.id] || [])
    ];
    const isTrainingPrescribed = prescribedList.length > 0;

    if (strengthsCount) strengthsCount.textContent = `${strengths.length} Identified`;
    if (gapsCount) gapsCount.textContent = `${gaps.length} Action Needed`;

    if (strengthsList) {
        if (strengths.length > 0) {
            strengthsList.innerHTML = strengths.map(s => `
                <li class="p-2.5 bg-white/90 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span class="flex items-center space-x-2">
                        <i class="fas fa-circle-check text-emerald-600 text-xs"></i>
                        <span class="font-medium text-slate-900">${s.title}</span>
                    </span>
                    <span class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] font-mono">⭐ ${parseFloat(s.rating).toFixed(1)} / 5.0</span>
                </li>
            `).join('');
        } else {
            strengthsList.innerHTML = `<li class="p-3 text-center text-slate-400 italic bg-white rounded-xl border border-emerald-100">No calibrated strengths recorded in database yet.</li>`;
        }
    }

    if (gapsList) {
        if (gaps.length > 0) {
            gapsList.innerHTML = gaps.map(g => `
                <li class="p-2.5 bg-white/90 rounded-xl border border-amber-200/70 flex items-center justify-between gap-2">
                    <div class="flex items-center space-x-2 min-w-0">
                        <i class="fas fa-circle-exclamation ${g.rating < 3.0 ? 'text-rose-600' : 'text-amber-600'} text-xs flex-shrink-0"></i>
                        <div class="truncate">
                            <p class="font-semibold text-slate-900 text-xs truncate">${g.title}</p>
                            <p class="text-[10px] ${g.rating < 3.0 ? 'text-rose-600 font-bold' : 'text-amber-700'}">Appraisal Rating: ⭐ ${parseFloat(g.rating).toFixed(1)} / 5.0</p>
                        </div>
                    </div>
                    ${!hasPassedBenchmark ? (isTrainingPrescribed ? `
                        <button onclick="openRemedialBooksModal('${emp.id}')" class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-bold text-[10px] flex-shrink-0 transition flex items-center space-x-1 shadow-2xs" title="Training module assigned to IDP">
                            <i class="fas fa-check text-emerald-600 text-[9px]"></i>
                            <span>Prescribed</span>
                        </button>
                    ` : `
                        <button onclick="openRemedialBooksModal('${emp.id}')" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-bold text-[10px] flex-shrink-0 transition flex items-center space-x-1 shadow-2xs" title="Assign targeted LMS book for this skill deficiency">
                            <i class="fas fa-plus text-amber-600 text-[9px]"></i>
                            <span>Prescribe Book</span>
                        </button>
                    `) : ''}
                </li>
            `).join('');
        } else {
            gapsList.innerHTML = `<li class="p-3 text-center text-slate-400 italic bg-white rounded-xl border border-amber-100">No development gaps identified.</li>`;
        }
    }

    // Render 70-20-10 Commitments
    if (commitmentsContainer) {
        const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, emp.id));
        let totalAllTasks = 0;
        let completedAllTasks = 0;
        empGoals.forEach(g => {
            (g.tasks || []).forEach(t => {
                totalAllTasks++;
                if (t.status === 'completed') completedAllTasks++;
            });
        });
        const allTasksDone = totalAllTasks > 0 && completedAllTasks === totalAllTasks;

        let topBannerHtml = '';
        if (hasPassedBenchmark) {
            topBannerHtml = `
                <div class="col-span-full p-5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/70 pb-3">
                        <div class="flex items-center space-x-2.5">
                            <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                                <i class="fas fa-award"></i>
                            </div>
                            <div>
                                <h5 class="font-bold text-emerald-950 text-xs">Proficient Performance Clearance</h5>
                                <p class="text-[11px] text-emerald-800">Evaluated score meets proficiency standards (⭐ <strong>${score.toFixed(2)} / 5.0</strong>). No remedial tasks required.</p>
                            </div>
                        </div>
                        <button onclick="triggerSendKudosForEmployee('${emp.id}')" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1.5 self-start sm:self-auto">
                            <i class="fas fa-award"></i>
                            <span>Send Colleague Kudos &rarr;</span>
                        </button>
                    </div>
                </div>
            `;
        } else if (isNeeds1on1 || isExceededRetry) {
            topBannerHtml = `
                <div class="col-span-full p-5 bg-rose-100 rounded-2xl border-2 border-rose-400 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-300 pb-3">
                        <div class="flex items-center space-x-2.5">
                            <div class="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                                <i class="fas fa-handshake-angle"></i>
                            </div>
                            <div>
                                <h5 class="font-bold text-rose-950 text-sm">Needs Mandatory 1-on-1 Training &amp; Direct Supervision</h5>
                                <p class="text-xs text-rose-900">Current appraisal rating is ⭐ <strong>${score.toFixed(2)} / 5.0</strong>. ${isGoalFailed ? 'Performance Goal has Failed.' : 'Retries exhausted. All standard IDP actions are locked.'}</p>
                            </div>
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-700 text-white shadow-xs">
                            ${isGoalFailed ? '🔴 Goal: FAILED' : '🔴 Needs 1-on-1 Training'}
                        </span>
                    </div>

                    <div class="p-3 bg-white/95 rounded-xl border border-rose-300 space-y-1.5 text-xs text-slate-800">
                        <p class="font-bold text-rose-900 flex items-center"><i class="fas fa-circle-exclamation mr-1.5 text-rose-600"></i> Remediation Directive: Require 1-on-1 Training &amp; Final Evaluation</p>
                        <p class="text-[11px] text-slate-700">All standard tasks, book prescriptions, and re-evaluations are locked. Transition to Phase 7 to proceed with the final 1-on-1 evaluation lifecycle.</p>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div class="flex items-center space-x-2">
                            <button disabled class="px-3 py-1.5 bg-slate-200 text-slate-400 border border-slate-300 rounded-xl font-bold text-xs cursor-not-allowed">
                                <i class="fas fa-lock mr-1"></i> Add Task (Locked)
                            </button>
                            <button disabled class="px-3 py-1.5 bg-slate-200 text-slate-400 border border-slate-300 rounded-xl font-bold text-xs cursor-not-allowed">
                                <i class="fas fa-lock mr-1"></i> Prescribe Books (Locked)
                            </button>
                            <button disabled class="px-3.5 py-1.5 bg-slate-200 text-slate-400 border border-slate-300 rounded-xl font-bold text-xs cursor-not-allowed">
                                <i class="fas fa-lock mr-1"></i> Re-Evaluate (Locked)
                            </button>
                        </div>
                        <button onclick="searchEmployeeInStage('cycle', '${(emp.name || '').replace(/'/g, "\\'")}')" class="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1.5">
                            <i class="fas fa-arrow-right"></i>
                            <span>Proceed to Phase 7 Transition &rarr;</span>
                        </button>
                    </div>
                </div>
            `;
        } else {
            topBannerHtml = `
                ${(inTraining && tnNeed) ? `
                    <div class="col-span-full p-4 bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 rounded-2xl border border-purple-200 shadow-2xs space-y-2 text-xs mb-1">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <div class="flex items-center space-x-2">
                                <div class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <div>
                                    <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-200 text-purple-900 border border-purple-300">
                                        Enrolled Formal Training: ${tnNeed.status || 'In Training'}
                                    </span>
                                    <h5 class="font-bold text-purple-950 text-xs mt-0.5">${tnNeed.title}</h5>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3 font-mono text-[11px]">
                                <div class="text-right">
                                    <span class="text-[9px] text-slate-500 block uppercase font-bold">Training Score</span>
                                    <span class="font-bold ${isScored ? 'text-emerald-700' : 'text-rose-700'}">${parseFloat(tnNeed.current_score || 0).toFixed(2)} / 5.0</span>
                                </div>
                                <div class="text-right">
                                    <span class="text-[9px] text-slate-500 block uppercase font-bold">Target Benchmark</span>
                                    <span class="font-bold text-slate-800">${parseFloat(tnNeed.required_score || 4.0).toFixed(2)} / 5.0</span>
                                </div>
                            </div>
                        </div>
                        <p class="text-[11px] text-slate-600 leading-relaxed">
                            ${tnNeed.notes || 'Formal training curriculum assigned. Prescribing LMS books, action tasks, and re-evaluation are locked until training is scored.'}
                        </p>
                    </div>
                ` : ''}
                <div class="col-span-full p-5 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/70 pb-3">
                        <div class="flex items-center space-x-2.5">
                            <div class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                                <i class="fas fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <h5 class="font-bold text-rose-950 text-xs">Mandatory Performance Improvement Plan (PIP) Workflow</h5>
                                <p class="text-[11px] text-rose-800">Current appraisal rating is ⭐ <strong>${score.toFixed(2)} / 5.0</strong>. Manage remediation tasks, complete remedial training, and conduct re-evaluation.</p>
                            </div>
                        </div>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900 self-start sm:self-auto">
                            Retry Review Active (${retryCount}/3 Retries)
                        </span>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div class="flex items-center space-x-2">
                            ${(inTraining && !isScored) ? `
                                <button disabled class="px-3 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl font-bold text-xs cursor-not-allowed flex items-center space-x-1.5" title="Associate is currently enrolled in Mandatory Formal Training.">
                                    <i class="fas fa-lock"></i>
                                    <span>Add Task (Locked)</span>
                                </button>
                            ` : `
                                <button onclick="openAddSpecificTaskModal('${emp.id}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1.5">
                                    <i class="fas fa-plus"></i>
                                    <span>${(inTraining && isScored) ? 'Add Task (After Training)' : 'Add Specific Action Task'}</span>
                                </button>
                            `}
                            ${(inTraining && !isScored) ? `
                                <button disabled class="px-3 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl font-bold text-xs cursor-not-allowed flex items-center space-x-1.5" title="Associate is currently enrolled in Mandatory Formal Training.">
                                    <i class="fas fa-lock"></i>
                                    <span>Prescribe Books (Locked)</span>
                                </button>
                            ` : (isTrainingPrescribed ? `
                                <button onclick="openRemedialBooksModal('${emp.id}')" class="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1.5" title="View assigned training modules">
                                    <i class="fas fa-check-circle text-emerald-700"></i>
                                    <span>Training Prescribed (${prescribedList.length})</span>
                                </button>
                            ` : `
                                <button onclick="openRemedialBooksModal('${emp.id}')" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1.5">
                                    <i class="fas fa-graduation-cap"></i>
                                    <span>${(inTraining && isScored) ? 'Prescribe Books (After Training)' : 'Put in Remedial Training'}</span>
                                </button>
                            `)}
                        </div>

                        <div class="flex items-center space-x-2">
                            <span class="text-[11px] text-rose-800 font-semibold bg-rose-100/80 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center space-x-1">
                                <i class="fas fa-hourglass-half text-rose-600 text-[10px]"></i>
                                <span>Score (${score.toFixed(2)}/5.0) &lt; 3.0</span>
                            </span>
                            ${(inTraining && !isScored) ? `
                                <button disabled class="px-3.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed rounded-xl font-bold text-xs flex items-center space-x-1.5" title="Re-evaluation is locked while undergoing mandatory training.">
                                    <i class="fas fa-lock text-[10px]"></i>
                                    <span>In Training (Locked)</span>
                                </button>
                            ` : (!allTasksDone ? `
                                <button disabled class="px-3.5 py-1.5 bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed rounded-xl font-bold text-xs shadow-none opacity-60 flex items-center space-x-1.5" title="Cannot re-evaluate: Tasks are still not done (${completedAllTasks}/${totalAllTasks} completed). Complete all tasks in Stage 3 Continuous Monitoring first.">
                                    <i class="fas fa-lock text-[10px]"></i>
                                    <span>Re-Evaluate (Tasks Incomplete)</span>
                                </button>
                            ` : `
                                <button onclick="openAppraisalModal('${emp.id}')" class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1.5" title="Re-evaluate associate to submit improved rating">
                                    <i class="fas fa-star-half-stroke text-[11px]"></i>
                                    <span>${(inTraining && isScored) ? 'Re-Evaluate (After Training) &rarr;' : 'Re-Evaluate Associate'}</span>
                                </button>
                            `)}
                        </div>
                    </div>
                </div>
            `;
        }

        if (empGoals.length > 0 || isPIP || hasPassedBenchmark) {
            commitmentsContainer.innerHTML = topBannerHtml + empGoals.map((g, idx) => `
                <div class="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 transition shadow-2xs flex flex-col justify-between space-y-3">
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold ${idx % 3 === 0 ? 'bg-blue-100 text-blue-800' : (idx % 3 === 1 ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800')} px-2.5 py-0.5 rounded-full">
                                ${idx % 3 === 0 ? '70% Experiential' : (idx % 3 === 1 ? '20% Mentorship' : '10% Formal LMS')}
                            </span>
                            <span class="text-[10px] font-mono text-slate-500 font-semibold">${g.target_metric || 'Active Target'}</span>
                        </div>
                        <h5 class="font-heading font-bold text-slate-900 text-xs">${g.title}</h5>
                        <p class="text-slate-600 text-[11px] leading-relaxed line-clamp-2">${g.supervisor_notes || g.evidence || 'Active hospitality developmental target.'}</p>
                    </div>
                    <div class="pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
                        <span class="text-slate-400 text-[10px]"><i class="fas fa-calendar-check mr-1"></i>${g.target_date || 'Q3 Target'}</span>
                        <div class="flex items-center space-x-1">
                            ${!hasPassedBenchmark ? `
                                <button onclick="openAddSpecificTaskModal('${emp.id}', '${g.id}')" class="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[10px] font-bold transition" title="Add Task to Goal">
                                    + Task
                                </button>
                            ` : ''}
                            <span class="text-[10px] font-bold ${g.status === 'Approved' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded' : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded'}">
                                ${g.status || 'Active'}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            commitmentsContainer.innerHTML = `
                <div class="col-span-3 p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 italic space-y-1.5">
                    <i class="fas fa-book-open text-2xl text-slate-300 block"></i>
                    <p class="font-semibold text-slate-600 text-xs">No active IDP commitments mapped yet in database.</p>
                    <p class="text-[11px] text-slate-400">Complete performance evaluations in Stage 4 &amp; 5 first.</p>
                </div>
            `;
        }
    }

    if (openModalImmediately && typeof openModal === 'function') {
        openModal('modal-idp-detail');
    }
}
window.showIDPDetail = showIDPDetail;

async function passPIPEmployee(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));
    if (!emp) return;

    try {
        const updated = await PerformanceAPI.calibrateEvaluation({
            employee_id: emp.id,
            calibrated_score: 3.50,
            tier_label: 'Proficient',
            discussion_minutes: `PIP Retry Successful: ${emp.name} has completed corrective requirements, met proficiency benchmarks, and earned full performance clearance.`
        });

        emp.supervisorRating = 3.50;
        emp.tierLabel = 'Proficient';
        emp.evaluationRecord = updated;

        updateDbEvaluationRecord(updated);

        if (typeof showToast === 'function') {
            showToast(`🎉 Outstanding! ${emp.name} passed PIP retry (⭐ 3.50 / 5.0). Opening Kudos recognition...`, 'success');
        }

        triggerSendKudosForEmployee(emp.id);

        if (typeof switchSubTab === 'function') {
            switchSubTab('perf', 'cycle');
        }
        showCycleDetail(emp.id);
        updateAllPerfStepperBadges();

    } catch (err) {
        console.error('Error passing PIP:', err);
        if (typeof showToast === 'function') showToast('Failed to update PIP status.', 'error');
    }
}
window.passPIPEmployee = passPIPEmployee;

function showEmptyCycleDetail() {
    const titleEl = document.getElementById('cycle-detail-title');
    const transitionCard = document.getElementById('cycle-detail-transition-card');

    if (titleEl) titleEl.textContent = 'Development Monitoring & Next Cycle Initiation';
    if (transitionCard) {
        transitionCard.innerHTML = `
            <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 italic space-y-1.5">
                <i class="fas fa-rotate text-2xl text-slate-300 block"></i>
                <p class="font-semibold text-slate-600 text-xs">No evaluated associates available for next cycle transition.</p>
                <p class="text-[11px] text-slate-400">Complete performance appraisals in Stage 4, 1-on-1 calibration in Stage 5, and IDP development plans in Stage 6 first.</p>
            </div>
        `;
    }
}
window.showEmptyCycleDetail = showEmptyCycleDetail;

function renderCycleRosterTable() {
    const container = document.getElementById('cycle-roster-tbody');
    if (!container) return;
    container.innerHTML = '';

    // Only show active goals (exclude Completed)
    let roster = (window.perfRoster && window.perfRoster.length > 0) ? window.perfRoster.filter(emp => {
        const hasGoal = (window.dbGoals || []).some(g => g.status === 'Approved' && isSameEmployee(g.employee_id, emp.id));
        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const score = evalRec?.calibrated_score ? parseFloat(evalRec.calibrated_score) : (evalRec?.supervisor_rating ? parseFloat(evalRec.supervisor_rating) : 0);
        return hasGoal && score > 0;
    }) : [];

    // Search query filter
    if (window.cycleSearchQuery && window.cycleSearchQuery.trim()) {
        const q = window.cycleSearchQuery.toLowerCase().trim();
        roster = roster.filter(emp => (emp.name || '').toLowerCase().includes(q) || (emp.position || '').toLowerCase().includes(q) || (emp.department || '').toLowerCase().includes(q));
    }

    if (roster.length === 0) {
        container.innerHTML = `<tr><td colspan="5" class="px-5 py-6 text-center text-slate-400 italic">No evaluated employees found in next cycle transition roster. Complete Stage 4-6 evaluations and IDP first.</td></tr>`;
        showEmptyCycleDetail();
        return;
    }

    roster.forEach(emp => {
        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const isCalibrated = evalRec && (evalRec.status === 'Calibrated' || (evalRec.calibrated_score !== null && evalRec.calibrated_score !== undefined && evalRec.status !== 'Rated'));
        const score = evalRec?.calibrated_score ? parseFloat(evalRec.calibrated_score) : (evalRec?.supervisor_rating ? parseFloat(evalRec.supervisor_rating) : 0);
        const hasPassed = score >= 3.0;
        const retryCount = getEmployeeRetryCount(emp.id);
        const isExceededRetry = retryCount >= 3 && !hasPassed;

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition text-xs border-b border-slate-100';
        tr.innerHTML = `
            <td class="px-5 py-4 font-bold text-slate-900">
                <div class="flex items-center space-x-2.5">
                    <div class="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                        ${emp.avatar || (emp.name ? emp.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'EM')}
                    </div>
                    <span class="max-w-[150px] truncate" title="${emp.name}">${emp.name}</span>
                </div>
            </td>
            <td class="px-5 py-4 text-slate-500 max-w-[130px] truncate" title="${emp.department}">${emp.department}</td>
            <td class="px-5 py-4 font-bold ${isCalibrated ? (isExceededRetry ? 'text-rose-700' : (hasPassed ? 'text-emerald-700' : 'text-rose-600')) : 'text-slate-400 font-normal italic'}">
                ${isCalibrated ? (isExceededRetry ? `⭐ ${score.toFixed(2)} / 5.0 (Failed)` : `⭐ ${score.toFixed(2)} / 5.0 (${evalRec?.tier_label || (hasPassed ? 'Calibrated' : 'Needs PIP')})`) : 'Pending Review'}
            </td>
            <td class="px-5 py-4">
                ${isExceededRetry ? `
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-700 text-white shadow-xs">
                        🔴 FAILED — Transition Suspended
                    </span>
                ` : `
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${hasPassed ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}">
                        ${hasPassed ? '✓ Qualified for Next Cycle' : 'Action Plan Incomplete'}
                    </span>
                `}
            </td>
            <td class="px-5 py-4 text-right">
                <button onclick="showCycleDetail('${emp.id}', true)" class="px-3.5 py-1.5 ${isExceededRetry ? 'bg-rose-700 hover:bg-rose-800 text-white' : (hasPassed ? 'bg-primary hover:bg-primary-dark text-white' : 'bg-amber-600 hover:bg-amber-700 text-white')} font-bold rounded-xl text-xs shadow-xs transition">
                    ${isExceededRetry ? '1-on-1 Remand' : (hasPassed ? 'View Rollover' : 'Review Plan')}
                </button>
            </td>
        `;
        container.appendChild(tr);
    });

    if (roster.length > 0) {
        if (!window.selectedEvalEmpId || !roster.some(e => isSameEmployee(e.id, window.selectedEvalEmpId))) {
            window.selectedEvalEmpId = roster[0].id;
        }
        showCycleDetail(window.selectedEvalEmpId, false);
    }
}
window.renderCycleRosterTable = renderCycleRosterTable;

window.onCycleEmployeeSearch = function(query) {
    window.cycleSearchQuery = query;
    renderCycleRosterTable();
};

function confirmMarkGoalCompleted(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));
    if (!emp) return;

    const empGoals = (window.dbGoals || []).filter(g => g.status === 'Approved' && isSameEmployee(g.employee_id, emp.id));
    const targetGoal = empGoals[0];

    showActionConfirmModal({
        title: 'Mark Performance Objective Completed',
        message: `Mark "${targetGoal ? targetGoal.title : 'Performance Goal'}" for ${emp.name} as Completed? This finalizes the review cycle and allows the employee to set their next performance objective.`,
        confirmBtnText: 'Mark as Completed',
        confirmBtnClass: 'btn-primary bg-emerald-600 hover:bg-emerald-700 text-white',
        iconClass: 'fas fa-circle-check',
        iconContainerClass: 'bg-emerald-100 text-emerald-700',
        onConfirm: async () => {
            const btn = document.getElementById('btn-mark-cycle-completed');
            const origHtml = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Marking as Completed...</span>';
            }

            try {
                if (targetGoal) {
                    await PerformanceAPI.markGoalCompleted(targetGoal.id);
                }
                if (typeof showToast === 'function') {
                    showToast(`🎉 Goal for ${emp.name} marked as Completed! The cycle is finalized and the employee can now establish their next objective.`, 'success');
                }
                closeModal('modal-cycle-detail');
                await loadAndRenderPlanningGoals();
            } catch (err) {
                console.error('Mark completed error:', err);
                if (typeof showToast === 'function') {
                    showToast(err.message || 'Failed to mark goal as completed.', 'error');
                }
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = origHtml;
                }
            }
        }
    });
}
window.confirmMarkGoalCompleted = confirmMarkGoalCompleted;

function showCycleDetail(empId, openModalImmediately = false) {
    if (!empId) {
        showEmptyCycleDetail();
        return;
    }

    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));
    if (!emp) {
        showEmptyCycleDetail();
        return;
    }

    const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
    const score = evalRec?.calibrated_score ? parseFloat(evalRec.calibrated_score) : (evalRec?.supervisor_rating ? parseFloat(evalRec.supervisor_rating) : 0);

    if (score === 0) {
        showEmptyCycleDetail();
        return;
    }

    window.selectedEvalEmpId = emp.id;

    const isCalibrated = evalRec && (evalRec.status === 'Calibrated' || (evalRec.calibrated_score !== null && evalRec.calibrated_score !== undefined && evalRec.status !== 'Rated'));
    const effectiveScore = (evalRec?.new_calibrated_score && parseFloat(evalRec.new_calibrated_score) > 0)
        ? parseFloat(evalRec.new_calibrated_score)
        : (evalRec?.calibrated_score ? parseFloat(evalRec.calibrated_score) : (evalRec?.new_supervisor_rating ? parseFloat(evalRec.new_supervisor_rating) : (evalRec?.supervisor_rating ? parseFloat(evalRec.supervisor_rating) : 0)));
    const hasPassed = effectiveScore >= 3.0;

    const retryCount = getEmployeeRetryCount(emp.id);
    const isExceededRetry = retryCount >= 3 && !hasPassed;

    const empGoals = (window.dbGoals || []).filter(g => g.status === 'Approved' && isSameEmployee(g.employee_id, emp.id));
    const needsTraining = empGoals.some(g => !!g.needs_training);
    const inTraining = isEmployeeInTraining(emp.id);
    const tnNeed = getEmployeeTrainingNeed(emp.id);
    const isScored = isEmployeeTrainingScored(emp.id);

    const isGoalFailed = isEmployeeGoalFailed(emp.id);
    const titleEl = document.getElementById('cycle-detail-title');
    const transitionCard = document.getElementById('cycle-detail-transition-card');

    if (titleEl) titleEl.textContent = `Development Monitoring & Next Cycle Initiation: ${emp.name}`;

    if (transitionCard) {
        if (isGoalFailed) {
            transitionCard.innerHTML = `
                <div class="p-6 bg-rose-100 rounded-2xl border-2 border-rose-400 space-y-4 text-xs">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center space-x-2.5">
                            <div class="w-10 h-10 rounded-2xl bg-rose-700 text-white flex items-center justify-center font-bold text-base shadow-2xs">
                                <i class="fas fa-ban"></i>
                            </div>
                            <div>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-700 text-white shadow-xs">
                                    🔴 PERFORMANCE GOAL FAILED
                                </span>
                                <h4 class="font-heading font-bold text-base text-rose-950 mt-0.5">Objective Concluded as Failed: ${emp.name}</h4>
                            </div>
                        </div>
                        <span class="text-xl font-bold text-rose-800 font-mono">⭐ ${effectiveScore.toFixed(2)} / 5.00</span>
                    </div>
                    <p class="text-slate-800 leading-relaxed text-xs">
                        This performance goal has been formally marked as <strong>Failed</strong> following 4 unsuccessful evaluation attempts, formal training, and mandatory 1-on-1 mentorship. Review cycle is permanently concluded.
                    </p>
                    <div class="pt-3 border-t border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span class="text-xs text-rose-900 font-bold"><i class="fas fa-lock mr-1 text-rose-600"></i> Cycle rollover is locked (Failed Objective)</span>
                        <button disabled class="px-4 py-2 bg-slate-200 text-slate-400 border border-slate-300 rounded-xl font-bold text-xs cursor-not-allowed">
                            Rollover Finalized (Failed)
                        </button>
                    </div>
                </div>
            `;
        } else if (isCalibrated && hasPassed) {
            transitionCard.innerHTML = `
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <span class="badge-sage">Continuous Growth Metric</span>
                        <h4 class="font-heading font-bold text-lg text-slate-900 mt-1">Development to Performance Transfer: ${emp.name}</h4>
                    </div>
                    <span class="text-2xl font-bold text-sage-dark font-heading font-mono">⭐ ${effectiveScore.toFixed(2)} / 5.0</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">
                    By completing the 2026 Q3 performance evaluation and IDP commitments, <strong>${emp.name}</strong> achieved a <strong>${evalRec?.tier_label || 'Calibrated'}</strong> rating. These validated competencies will form the elevated baseline for the upcoming <strong>2026 Q4 Cycle</strong>.
                </p>
                <div class="pt-3 border-t border-[#E8DEDC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span class="text-xs text-slate-500"><i class="fas fa-check text-sage-dark mr-1.5"></i> All 7 lifecycle phases completed for 2026 Q3</span>
                    <button id="btn-mark-cycle-completed" onclick="confirmMarkGoalCompleted('${emp.id}')" class="btn-primary px-5 py-2.5 text-xs font-bold transition flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                        <i class="fas fa-circle-check text-xs"></i>
                        <span>Mark as Completed</span>
                    </button>
                </div>
            `;
        } else if (retryCount >= 4 && !hasPassed) {
            transitionCard.innerHTML = `
                <div class="p-6 bg-rose-100 rounded-2xl border-2 border-rose-400 space-y-4 text-xs">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center space-x-2.5">
                            <div class="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold text-base shadow-2xs">
                                <i class="fas fa-gavel"></i>
                            </div>
                            <div>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-700 text-white shadow-xs">
                                    🔴 Final Attempt #4 Active
                                </span>
                                <h4 class="font-heading font-bold text-base text-rose-950 mt-0.5">Final 1-on-1 Evaluation (Last Attempt): ${emp.name}</h4>
                            </div>
                        </div>
                        <span class="text-xl font-bold text-rose-800 font-mono">⭐ ${effectiveScore.toFixed(2)} / 5.0</span>
                    </div>
                    <p class="text-slate-800 leading-relaxed text-xs">
                        Associate is undergoing the final 1-on-1 performance review (Attempt #4). Phases 3 to 6 are locked. Conduct the final evaluation to determine if the associate achieves proficiency (&ge; 3.00) or if the goal transitions to Failed.
                    </p>
                    <div class="pt-3 border-t border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span class="text-xs text-rose-900 font-bold"><i class="fas fa-lock mr-1 text-rose-600"></i> Final Stage &bull; Last evaluation before failure</span>
                        <button onclick="openPhase7FinalEvalModal('${emp.id}')" class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition flex items-center space-x-1.5">
                            <i class="fas fa-gavel"></i>
                            <span>Conduct Final 1-on-1 Evaluation &rarr;</span>
                        </button>
                    </div>
                </div>
            `;
        } else if ((retryCount === 3 && isScored && !hasPassed) || (retryCount >= 3 && !hasPassed)) {
            transitionCard.innerHTML = `
                <div class="p-6 bg-gradient-to-r from-rose-50 via-amber-50 to-purple-50 rounded-2xl border-2 border-rose-300 space-y-4 text-xs">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center space-x-2.5">
                            <div class="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold text-base shadow-2xs">
                                <i class="fas fa-handshake-angle"></i>
                            </div>
                            <div>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-700 text-white shadow-xs">
                                    🔴 Needs 1-on-1 Training (Retry #3 Exhausted)
                                </span>
                                <h4 class="font-heading font-bold text-base text-rose-950 mt-0.5">Mandatory 1-on-1 Mentorship Required: ${emp.name}</h4>
                            </div>
                        </div>
                        <span class="text-xl font-bold text-rose-800 font-mono">⭐ ${effectiveScore.toFixed(2)} / 5.0</span>
                    </div>
                    <p class="text-slate-800 leading-relaxed text-xs">
                        Associate completed formal training but calibrated rating remains below 3.0 standard. <strong>Mandatory 1-on-1 mentorship</strong> is required. Click Continue to initiate the definitive Final 1-on-1 Evaluation lifecycle (Attempt #4).
                    </p>
                    <div class="pt-3 border-t border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span class="text-xs text-rose-900 font-bold"><i class="fas fa-arrow-right mr-1 text-rose-600"></i> Next Step: Transition to Final Evaluation</span>
                        <button onclick="continueToFinal1on1Evaluation('${emp.id}')" class="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold shadow-xs transition flex items-center space-x-1.5">
                            <i class="fas fa-play"></i>
                            <span>Continue to Final 1-on-1 Evaluation &rarr;</span>
                        </button>
                    </div>
                </div>
            `;
        } else if (inTraining && tnNeed) {
                transitionCard.innerHTML = `
                    <div class="p-6 bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 rounded-2xl border border-purple-200 space-y-4 text-xs">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <div class="flex items-center space-x-2.5">
                                <div class="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-base shadow-2xs">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <div>
                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-200 text-purple-900 border border-purple-300">
                                        Enrolled in Formal Training: ${tnNeed.status || 'In Training'}
                                    </span>
                                    <h4 class="font-heading font-bold text-base text-purple-950 mt-0.5">${tnNeed.title}</h4>
                                </div>
                            </div>
                            <div class="text-right font-mono">
                                <span class="text-[10px] text-slate-500 block uppercase font-bold">Training Score / Target</span>
                                <span class="text-lg font-bold ${isScored ? 'text-emerald-700' : 'text-purple-900'}">${parseFloat(tnNeed.current_score || 0).toFixed(2)} / ${parseFloat(tnNeed.required_score || 4.0).toFixed(2)}</span>
                            </div>
                        </div>
                        <p class="text-slate-700 leading-relaxed text-xs">
                            Associate is actively enrolled in mandatory formal training. Once training score is recorded, re-evaluation and calibration (Retry #3) will unlock in Stages 4 and 5.
                        </p>
                        <div class="pt-3 border-t border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <span class="text-xs text-purple-800 font-semibold"><i class="fas fa-book-open mr-1"></i> Program: ${tnNeed.target_competency || tnNeed.category || 'Skill Gap'}</span>
                            <div class="flex items-center space-x-2">
                                <button onclick="openFormalCurriculumModal('${emp.id}')" class="px-3.5 py-1.5 bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-xl font-bold transition text-xs flex items-center space-x-1">
                                    <i class="fas fa-repeat"></i>
                                    <span>Switch / View Curriculum</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } else if (needsTraining || (retryCount >= 1 && !hasPassed)) {
                transitionCard.innerHTML = `
                    <div class="p-6 bg-rose-50 rounded-2xl border border-rose-300 space-y-4 text-xs">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <div class="flex items-center space-x-2.5">
                                <div class="w-10 h-10 rounded-2xl bg-rose-200 text-rose-800 flex items-center justify-center font-bold text-base shadow-2xs">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <div>
                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 text-rose-900 border border-rose-300">
                                        Needs Training: Flagged (True)
                                    </span>
                                    <h4 class="font-heading font-bold text-base text-slate-900 mt-0.5">Mandatory Formal Training Required: ${emp.name}</h4>
                                </div>
                            </div>
                            <span class="text-xl font-bold text-rose-700 font-mono">⭐ ${effectiveScore.toFixed(2)} / 5.0</span>
                        </div>
                        <p class="text-slate-700 leading-relaxed text-xs">
                            Associate is flagged for <strong>Needs Training</strong> (Retry limit exceeded or flagged). Formal training curriculum is required before monitoring rollover.
                        </p>
                        <div class="pt-3 border-t border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <span class="text-xs text-rose-800 font-bold"><i class="fas fa-graduation-cap mr-1 text-rose-600"></i> Action required: Mandatory Formal Curriculum enrollment</span>
                            <div class="flex items-center space-x-2">
                                <button onclick="toggleNeedsTrainingFlag('${emp.id}', false)" class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition text-xs">
                                    <span>Clear Flag</span>
                                </button>
                                <button onclick="openFormalCurriculumModal('${emp.id}')" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition flex items-center space-x-1.5">
                                    <i class="fas fa-graduation-cap"></i>
                                    <span>Need Training &rarr; Assign Formal Curriculum</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                transitionCard.innerHTML = `
                    <div class="p-6 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-4 text-xs">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <div class="flex items-center space-x-2.5">
                                <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base shadow-2xs">
                                    <i class="fas fa-triangle-exclamation"></i>
                                </div>
                                <div>
                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                                        Needs Training: False (Corrective Monitoring Active)
                                    </span>
                                    <h4 class="font-heading font-bold text-base text-slate-900 mt-0.5">Corrective Action Plan Required: ${emp.name}</h4>
                                </div>
                            </div>
                            <span class="text-xl font-bold text-amber-800 font-mono">⭐ ${effectiveScore.toFixed(2)} / 5.0</span>
                        </div>
                        <p class="text-slate-700 leading-relaxed text-xs">
                            Associate score is below the required 3.0 benchmark. To ensure standard compliance before rollover, review assigned action tasks, reset completed items for employee re-execution in Stage 3 Monitoring, or flag as Needs Training.
                        </p>
                        <div class="pt-3 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <span class="text-xs text-amber-900 font-semibold"><i class="fas fa-rotate mr-1 text-amber-700"></i> Tasks can be reset for employee to re-do in Stage 3 Monitoring</span>
                            <div class="flex items-center space-x-2">
                                <button onclick="toggleNeedsTrainingFlag('${emp.id}', true)" class="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl font-bold transition text-xs border border-rose-200">
                                    <i class="fas fa-flag mr-1"></i><span>Flag as Needs Training</span>
                                </button>
                                <button onclick="openReviewTasksModal('${emp.id}')" class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs transition flex items-center space-x-1.5">
                                    <i class="fas fa-list-check"></i>
                                    <span>Review Plan &amp; Tasks &rarr;</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
    }

    if (openModalImmediately) {
        if (!hasPassed && !needsTraining) {
            openReviewTasksModal(emp.id);
        } else if (typeof openModal === 'function') {
            openModal('modal-cycle-detail');
        }
    }
}
window.showCycleDetail = showCycleDetail;

/**
 * Open Formal Curriculum Modal and load training programs
 */
async function openFormalCurriculumModal(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || (window.perfRoster || [])[0];
    if (!emp) return;

    window.selectedEvalEmpId = emp.id;

    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, emp.id));
    const targetGoal = empGoals[0];

    const nameEl = document.getElementById('formal-curriculum-emp-name');
    const goalTitleEl = document.getElementById('formal-curriculum-goal-title');
    const container = document.getElementById('formal-programs-list');

    if (nameEl) nameEl.textContent = `${emp.name} · ${emp.position} (${emp.department})`;
    if (goalTitleEl) goalTitleEl.textContent = `Target Goal: ${targetGoal ? targetGoal.title : 'Performance IDP Remediation'}`;

    if (container) {
        container.innerHTML = `
            <div class="p-8 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-slate-200">
                <i class="fas fa-spinner fa-spin text-lg mb-2 block text-rose-500"></i>
                Loading formal training programs from database...
            </div>
        `;
    }

    openModal('modal-formal-curriculum');

    try {
        const res = await PerformanceAPI.getTrainingPrograms();
        const programs = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        window.dbTrainingPrograms = programs;

        if (!container) return;

        if (programs.length === 0) {
            container.innerHTML = `
                <div class="p-8 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-slate-200">
                    No formal training programs found in database.
                </div>
            `;
            return;
        }

        const existingNeed = getEmployeeTrainingNeed(emp.id);

        container.innerHTML = programs.map(p => {
            const isEnrolled = existingNeed && (existingNeed.linked_program_id === p.id || existingNeed.linkedProgramId === p.id);
            const passingScore = p.passing_score ? parseFloat(p.passing_score) : 80;
            const targetBenchmark = (passingScore / 20.0).toFixed(1);
            const modules = Array.isArray(p.modules) ? p.modules : [];

            return `
                <div class="p-4 bg-white rounded-2xl border ${isEnrolled ? 'border-rose-300 bg-rose-50/20 ring-2 ring-rose-200' : 'border-slate-200 hover:border-slate-300'} transition shadow-2xs space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div class="space-y-1">
                            <div class="flex items-center space-x-2 flex-wrap gap-1">
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                                    ${p.category || 'Skill Gap Remediation'}
                                </span>
                                <span class="text-[10px] text-slate-400 font-semibold font-mono">
                                    <i class="fas fa-clock mr-0.5"></i>${p.duration || '3.5 Hours'}
                                </span>
                                <span class="text-[10px] text-slate-400 font-semibold">
                                    <i class="fas fa-building mr-0.5"></i>${p.dept || 'General'}
                                </span>
                            </div>
                            <h5 class="font-heading font-bold text-slate-900 text-sm">${p.title}</h5>
                            <p class="text-slate-600 text-xs leading-relaxed">${p.description || 'Targeted training curriculum with practical modules and evaluation quiz.'}</p>
                        </div>
                        <div class="text-right flex-shrink-0 self-start sm:self-auto">
                            <span class="font-bold text-slate-800 text-xs block">Benchmark: ⭐ ${targetBenchmark} / 5.0</span>
                            <span class="text-[10px] text-slate-400 font-mono">Passing: ${passingScore}%</span>
                        </div>
                    </div>

                    ${modules.length > 0 ? `
                        <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                            <span class="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Course Modules:</span>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
                                ${modules.slice(0, 4).map(m => `
                                    <div class="flex items-center space-x-1 truncate">
                                        <i class="fas fa-check-circle text-rose-500 text-[10px] flex-shrink-0"></i>
                                        <span class="truncate">${typeof m === 'string' ? m : (m.title || 'Module')}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span class="text-[11px] text-slate-500">
                            <i class="fas fa-chalkboard-user text-rose-600 mr-1"></i>Format: ${p.format || 'Workshop & Assessment'} (${p.trainer_type || 'Master Trainer'})
                        </span>
                        ${isEnrolled ? `
                            <button disabled class="px-4 py-2 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs border border-emerald-200 inline-flex items-center space-x-1.5">
                                <i class="fas fa-check text-emerald-600"></i>
                                <span>Enrolled in training_needs</span>
                            </button>
                        ` : `
                            <button onclick="assignProgramToTrainingNeeds('${p.id}', '${emp.id}', '${targetGoal ? targetGoal.id : ''}')" class="btn-primary px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5">
                                <i class="fas fa-graduation-cap"></i>
                                <span>Enroll in Program &rarr;</span>
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Error loading training programs:', err);
        if (container) {
            container.innerHTML = `<div class="p-6 text-center text-rose-600 italic bg-rose-50 rounded-2xl border border-rose-200">Failed to load training programs: ${err.message || ''}</div>`;
        }
    }
}
window.openFormalCurriculumModal = openFormalCurriculumModal;

async function assignProgramToTrainingNeeds(programId, empId, goalId) {
    try {
        const res = await PerformanceAPI.assignFormalCurriculum({
            program_id: programId,
            employee_id: empId,
            goal_id: goalId,
            target_goal_id: goalId
        });
        if (typeof showToast === 'function') {
            showToast(res.message || 'Formal Training Program assigned and enrolled into training_needs!', 'success');
        }
        await loadAndRenderPlanningGoals();
        openFormalCurriculumModal(empId);
        if (typeof showCycleDetail === 'function') {
            showCycleDetail(empId, false);
        }
        updateAllPerfStepperBadges();
    } catch (err) {
        console.error('Error assigning formal training program:', err);
        if (typeof showToast === 'function') {
            showToast('Failed to assign formal training program: ' + (err.message || ''), 'error');
        }
    }
}
window.assignProgramToTrainingNeeds = assignProgramToTrainingNeeds;

/**
 * Toggle needs_training boolean flag on employee's goals
 */
async function toggleNeedsTrainingFlag(empId, needsTraining) {
    try {
        await PerformanceAPI.setNeedsTraining({ employee_id: empId, needs_training: needsTraining });
        if (typeof showToast === 'function') {
            showToast(needsTraining ? 'Flagged employee goal as Needs Training.' : 'Cleared Needs Training flag.', 'info');
        }
        await loadAndRenderPlanningGoals();
        if (typeof showCycleDetail === 'function') {
            showCycleDetail(empId, false);
        }
    } catch (err) {
        console.error('Error toggling needs_training flag:', err);
        if (typeof showToast === 'function') showToast('Failed to update needs_training flag.', 'error');
    }
}
window.toggleNeedsTrainingFlag = toggleNeedsTrainingFlag;

function openReviewTasksModal(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || (window.perfRoster || [])[0];
    if (!emp) return;

    window.selectedEvalEmpId = emp.id;

    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, emp.id));
    const retryCount = empGoals.reduce((max, g) => Math.max(max, parseInt(g.retry_count || 0)), 0);
    const needsTraining = empGoals.some(g => !!g.needs_training) || retryCount > 2;

    const titleEl = document.getElementById('modal-review-tasks-title');
    const listEl = document.getElementById('review-tasks-modal-list');
    const footerActions = document.getElementById('review-tasks-footer-actions');

    if (titleEl) {
        titleEl.innerHTML = `Review Plan &amp; Tasks: ${emp.name} <span class="ml-2 text-xs font-mono font-normal px-2 py-0.5 rounded-full ${needsTraining ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">Retry: ${retryCount} · Needs Training: ${needsTraining ? 'True' : 'False'}</span>`;
    }

    const allTasks = [];
    empGoals.forEach(g => {
        (g.tasks || []).forEach(t => {
            allTasks.push({ ...t, goal_title: g.title });
        });
    });

    if (listEl) {
        if (allTasks.length > 0) {
            listEl.innerHTML = allTasks.map(t => {
                const isDone = t.status === 'completed';
                return `
                    <div class="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div class="space-y-1">
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                                    ${isDone ? '✓ Completed' : 'Pending'}
                                </span>
                                <span class="text-[10px] text-slate-400 font-mono">${t.target_date || 'Due Soon'}</span>
                            </div>
                            <p class="font-bold text-slate-900">${t.title}</p>
                            <p class="text-[10px] text-slate-500">Goal: ${t.goal_title}</p>
                            ${t.employee_learnings ? `<p class="text-[10px] text-slate-600 italic bg-slate-50 p-1.5 rounded">Learnings: "${t.employee_learnings}"</p>` : ''}
                        </div>

                        <div class="flex items-center space-x-2 flex-shrink-0 self-end sm:self-auto">
                            ${isDone ? `
                                <button onclick="resetTaskForGoal('${t.id}', '${emp.id}')" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs border border-amber-200 transition flex items-center space-x-1" title="Reset to pending so employee can re-do task">
                                    <i class="fas fa-rotate-left"></i>
                                    <span>Reset to Re-Do</span>
                                </button>
                            ` : ''}
                            <button onclick="deleteTaskFromGoal('${t.id}', '${emp.id}')" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition" title="Delete obsolete task">
                                <i class="fas fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            listEl.innerHTML = `
                <div class="p-6 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-slate-200">
                    No active tasks assigned yet. Use "+ Add Task" to establish specific action tasks.
                </div>
            `;
        }
    }

    if (footerActions) {
        if (needsTraining) {
            footerActions.innerHTML = `
                <button onclick="closeModal('modal-review-tasks'); openRemedialBooksModal('${emp.id}');" class="btn-primary px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 border-rose-600 shadow-xs flex items-center space-x-2">
                    <i class="fas fa-graduation-cap"></i>
                    <span>Need Training &rarr; Assign Formal Program</span>
                </button>
            `;
        } else {
            footerActions.innerHTML = `
                <button id="btn-proceed-to-monitoring" onclick="proceedFromTasksToMonitoring()" class="btn-primary px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 border-teal-600 shadow-xs flex items-center space-x-2">
                    <span>Proceed to Continuous Monitoring (Stage 3)</span>
                    <i class="fas fa-arrow-right text-[10px]"></i>
                </button>
            `;
        }
    }

    openModal('modal-review-tasks');
}
window.openReviewTasksModal = openReviewTasksModal;

/**
 * Reset a task back to pending for employee re-execution
 */
async function resetTaskForGoal(taskId, empId) {
    try {
        await PerformanceAPI.resetTask(taskId);
        if (typeof showToast === 'function') {
            showToast('Task successfully reset to pending for employee re-execution.', 'info');
        }
        if (typeof loadAndRenderPlanningGoals === 'function') {
            await loadAndRenderPlanningGoals();
        }
        openReviewTasksModal(empId);
    } catch (err) {
        console.error('Error resetting task:', err);
        if (typeof showToast === 'function') showToast('Failed to reset task.', 'error');
    }
}
window.resetTaskForGoal = resetTaskForGoal;

/**
 * Delete an action task from a goal
 */
async function deleteTaskFromGoal(taskId, empId) {
    if (!confirm('Are you sure you want to delete this action task?')) return;

    try {
        await PerformanceAPI.deleteTask(taskId);
        if (typeof showToast === 'function') {
            showToast('Task successfully deleted from goal.', 'success');
        }
        if (typeof loadAndRenderPlanningGoals === 'function') {
            await loadAndRenderPlanningGoals();
        }
        openReviewTasksModal(empId);
    } catch (err) {
        console.error('Error deleting task:', err);
        if (typeof showToast === 'function') showToast('Failed to delete task.', 'error');
    }
}
window.deleteTaskFromGoal = deleteTaskFromGoal;

/**
 * Proceed from Stage 7 review tasks directly to Stage 3 Continuous Monitoring
 */
async function proceedFromTasksToMonitoring() {
    const empId = window.selectedEvalEmpId || 'emp-101';
    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, empId));
    const retryCount = empGoals.reduce((max, g) => Math.max(max, parseInt(g.retry_count || 0)), 0);
    const needsTraining = empGoals.some(g => !!g.needs_training) || retryCount >= 2;

    if (needsTraining) {
        closeModal('modal-review-tasks');
        if (typeof showToast === 'function') {
            showToast('⚠️ Associate is flagged for Needs Training (Retry limit exceeded or flagged). Formal training curriculum is required before monitoring rollover.', 'error');
        }
        if (typeof showCycleDetail === 'function') {
            showCycleDetail(empId);
        }
        return;
    }

    try {
        const res = await PerformanceAPI.retryPlan({ employee_id: empId });
        await loadAndRenderPlanningGoals();
        closeModal('modal-review-tasks');
        if (typeof switchSubTab === 'function') {
            switchSubTab('perf', 'monitor');
        }
        if (typeof showToast === 'function') {
            showToast(`🔄 Plan retry registered (Retry Count updated to ${res?.retry_count || (retryCount + 1)} in database). Returned to Stage 3 Continuous Monitoring.`, 'info');
        }
    } catch (err) {
        console.error('Error retrying plan:', err);
        closeModal('modal-review-tasks');
        if (typeof switchSubTab === 'function') {
            switchSubTab('perf', 'monitor');
        }
    }
}
window.proceedFromTasksToMonitoring = proceedFromTasksToMonitoring;

/**
 * -------------------------------------------------------------
 * 5. STEPPER BADGES & PENDING GUARD NAVIGATION
 * Evaluates completion and pending state strictly based on active database records:
 * - Phase 1 & 2: Complete only if all goals in DB are approved (status: Approved / Completed).
 * - Phase 3: Pending if KPI target progress of any employee is not 100% or below phase not complete.
 * - Phase 4: Complete if all employees with approved goals have a supervisor rating (not pending) and Phase 1-2 complete.
 * - Phase 5: Roster only shows employees with appraisal ratings; Complete if all evaluated have calibrated scores and Phase 4 complete.
 * -------------------------------------------------------------
 */
function isSameEmployee(idA, idB) {
    if (!idA || !idB) return false;
    const a = idA.toString().toLowerCase().trim();
    const b = idB.toString().toLowerCase().trim();
    if (a === b) return true;
    const isA_101 = a === 'emp-101' || a === 'emp-1' || a === 'oxf-emp-1001';
    const isB_101 = b === 'emp-101' || b === 'emp-1' || b === 'oxf-emp-1001';
    if (isA_101 && isB_101) return true;
    const isA_102 = a === 'emp-102' || a === 'emp-2' || a === 'oxf-sup-2001';
    const isB_102 = b === 'emp-102' || b === 'emp-2' || b === 'oxf-sup-2001';
    if (isA_102 && isB_102) return true;
    return false;
}
window.isSameEmployee = isSameEmployee;

function getPerformanceStageStatus(stageKey) {
    const goals = window.dbGoals || [];
    const evals = window.dbEvaluations || [];
    const roster = window.perfRoster || [];
    const totalGoals = goals.length;

    if (totalGoals === 0) {
        return { isComplete: false, pendingCount: 0, isNeutral: true };
    }

    // Helper to find evaluation record for an employee from both dbEvaluations and perfRoster
    const getEvalForEmployee = (empId) => {
        let ev = evals.find(e => isSameEmployee(e.employee_id, empId));
        if (!ev) {
            const empObj = roster.find(r => isSameEmployee(r.id, empId));
            if (empObj) {
                if (empObj.evaluationRecord) {
                    ev = empObj.evaluationRecord;
                } else if (empObj.supervisorRating || empObj.managerRating) {
                    ev = {
                        employee_id: empId,
                        supervisor_rating: empObj.supervisorRating || empObj.managerRating,
                        status: empObj.evaluationStatus || 'Rated',
                        tier_label: empObj.tierLabel || 'Proficient'
                    };
                }
            }
        }
        return ev;
    };

    // 1 & 2: Goals Planning & Approval
    const unapprovedGoals = goals.filter(g => {
        const s = (g.status || '').toLowerCase().trim();
        return s !== 'approved' && s !== 'completed';
    });
    const isPhase1_2_Complete = totalGoals > 0 && unapprovedGoals.length === 0;

    if (stageKey === 'plan' || stageKey === 'approve') {
        if (isPhase1_2_Complete) {
            return { isComplete: true, pendingCount: 0, isNeutral: false };
        } else {
            return { isComplete: false, pendingCount: unapprovedGoals.length, isNeutral: false };
        }
    }

    // Approved goals set (Phases 3-7 requirement)
    const approvedGoals = goals.filter(g => {
        const s = (g.status || '').toLowerCase().trim();
        return s === 'approved' || s === 'completed';
    });

    // 3: Continuous Monitoring & KPI Tracking (Evaluated only on approved goals)
    let totalTasks = 0;
    let completedTasks = 0;
    approvedGoals.forEach(g => {
        (g.tasks || []).forEach(t => {
            totalTasks++;
            if (t.status === 'completed') completedTasks++;
        });
    });

    const isPhase3_Complete = isPhase1_2_Complete && totalTasks > 0 && completedTasks === totalTasks;
    const incompletedTasks = Math.max(0, totalTasks - completedTasks);

    if (stageKey === 'monitor') {
        if (isPhase3_Complete) {
            return { isComplete: true, pendingCount: 0, isNeutral: false };
        } else {
            const pendingCount = totalTasks === 0 ? approvedGoals.length : incompletedTasks;
            return { isComplete: false, pendingCount: pendingCount, isNeutral: false };
        }
    }

    // 4: Employee Appraisal / Evaluation
    // Complete if all employees with approved goals have recorded data in performance_evaluations
    const employeesWithApprovedGoals = [];
    approvedGoals.forEach(g => {
        const eId = (g.employee_id || '').toLowerCase().trim();
        if (eId && !employeesWithApprovedGoals.some(existing => isSameEmployee(existing, eId))) {
            employeesWithApprovedGoals.push(g.employee_id);
        }
    });

    let pendingEvalsCount = 0;
    employeesWithApprovedGoals.forEach(empId => {
        const ev = getEvalForEmployee(empId);
        const hasEval = ev && typeof ev.supervisor_rating !== 'undefined' && ev.supervisor_rating !== null && parseFloat(ev.supervisor_rating) > 0;
        if (!hasEval) {
            pendingEvalsCount++;
        }
    });

    const isPhase4_Complete = employeesWithApprovedGoals.length > 0 && pendingEvalsCount === 0;

    if (stageKey === 'eval') {
        if (isPhase4_Complete) {
            return { isComplete: true, pendingCount: 0, isNeutral: false };
        } else {
            return { isComplete: false, pendingCount: pendingEvalsCount, isNeutral: false };
        }
    }

    // 5: 1-on-1 Review & Calibration
    // Complete if all evaluated employees with approved goals in performance_evaluations are calibrated
    const evaluatedEmployees = employeesWithApprovedGoals.filter(empId => {
        const ev = getEvalForEmployee(empId);
        return ev && typeof ev.supervisor_rating !== 'undefined' && ev.supervisor_rating !== null && parseFloat(ev.supervisor_rating) > 0;
    });

    let pendingCalibrationsCount = 0;
    evaluatedEmployees.forEach(empId => {
        const ev = getEvalForEmployee(empId);
        const isCalib = ev && ev.status === 'Calibrated' && typeof ev.calibrated_score !== 'undefined' && ev.calibrated_score !== null && parseFloat(ev.calibrated_score) > 0;
        if (!isCalib) {
            pendingCalibrationsCount++;
        }
    });

    const isPhase5_Complete = isPhase4_Complete && evaluatedEmployees.length > 0 && pendingCalibrationsCount === 0;

    if (stageKey === 'review') {
        if (isPhase5_Complete) {
            return { isComplete: true, pendingCount: 0, isNeutral: false };
        } else {
            return { isComplete: false, pendingCount: pendingCalibrationsCount, isNeutral: false };
        }
    }

    if (stageKey === 'idp' || stageKey === 'cycle') {
        if (isPhase5_Complete) {
            return { isComplete: true, pendingCount: 0, isNeutral: false };
        } else {
            return { isComplete: false, pendingCount: 0, isNeutral: false };
        }
    }

    return { isComplete: false, pendingCount: 0, isNeutral: false };
}

function updateAllPerfStepperBadges() {
    const stages = ['plan', 'approve', 'monitor', 'eval', 'review', 'idp', 'cycle'];
    const stageNumbers = { plan: 1, approve: 2, monitor: 3, eval: 4, review: 5, idp: 6, cycle: 7 };

    const planCount = (window.dbGoals || []).length;
    const approvedGoalsCount = (window.dbGoals || []).filter(g => g.status === 'Approved' || g.status === 'Completed').length;
    const monitoredEmployeesCount = (window.perfRoster || []).filter(e => (window.dbGoals || []).some(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, e.id))).length;
    const evaluatedEmployeesCount = getDbEvaluations().filter(ev => typeof ev.supervisor_rating !== 'undefined' && ev.supervisor_rating !== null && parseFloat(ev.supervisor_rating) > 0).length;
    const calibratedEmployeesCount = getDbEvaluations().filter(ev => ev.status === 'Calibrated' && typeof ev.calibrated_score !== 'undefined' && ev.calibrated_score !== null && parseFloat(ev.calibrated_score) > 0).length;
    const idpCount = evaluatedEmployeesCount;
    const cycleCount = evaluatedEmployeesCount;

    const stageDataCounts = {
        plan: { count: planCount, label: `${planCount} ${planCount === 1 ? 'Goal' : 'Goals'}` },
        approve: { count: approvedGoalsCount, label: `${approvedGoalsCount} Approved` },
        monitor: { count: monitoredEmployeesCount, label: `${monitoredEmployeesCount} Monitored` },
        eval: { count: evaluatedEmployeesCount, label: `${evaluatedEmployeesCount} Evaluated` },
        review: { count: calibratedEmployeesCount, label: `${calibratedEmployeesCount} Calibrated` },
        idp: { count: idpCount, label: `${idpCount} ${idpCount === 1 ? 'IDP Plan' : 'IDP Plans'}` },
        cycle: { count: cycleCount, label: `${cycleCount} ${cycleCount === 1 ? 'Transition' : 'Transitions'}` }
    };

    stages.forEach(stageKey => {
        const item = document.querySelector(`.perf-step-item[data-step-key="${stageKey}"]`);
        const subnavPill = document.querySelector(`.subnav-perf[data-sub="${stageKey}"]`);
        const num = stageNumbers[stageKey];
        const dataMeta = stageDataCounts[stageKey] || { count: 0, label: `0 ${stageKey}` };

        if (item) {
            const bubble = item.querySelector('.perf-step-bubble');
            const sub = item.querySelector('.perf-step-sub');
            if (bubble) {
                bubble.textContent = num;
            }
            if (sub) {
                sub.innerHTML = `<span class="text-slate-500 font-semibold">${dataMeta.label}</span>`;
            }
        }

        if (subnavPill) {
            let countBadge = subnavPill.querySelector('.subnav-count-badge');
            if (!countBadge) {
                // Remove any obsolete status icons
                const oldIcon = subnavPill.querySelector('.subnav-status-icon');
                if (oldIcon) oldIcon.remove();

                countBadge = document.createElement('span');
                countBadge.className = 'subnav-count-badge ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200 transition';
                subnavPill.appendChild(countBadge);
            }
            countBadge.textContent = dataMeta.count;
        }
    });
}

function getStagePendingCount(stageKey) {
    const status = getPerformanceStageStatus(stageKey);
    return status.pendingCount;
}

/**
 * Tab Switch Function - Unrestricted navigation across all 7 stages anytime
 */
window.canSwitchSubTabWithGuard = function (currentStageKey, targetStageKey) {
    return true;
};

/**
 * Continue to Final 1-on-1 Evaluation (Sets retry_count to 4 and opens Phase 7 final modal)
 */
async function continueToFinal1on1Evaluation(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));
    if (!emp) return;

    try {
        const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Pending Approval') && isSameEmployee(g.employee_id, emp.id));
        const targetGoal = empGoals[0];

        await PerformanceAPI.continueToFinalEvaluation(emp.id, targetGoal ? targetGoal.id : null);
        if (typeof showToast === 'function') {
            showToast(`1-on-1 Remediation Initiated for ${emp.name}. Final 4th attempt active.`, 'success');
        }

        // Reload data to reflect retry_count = 4
        await loadAndRenderPlanningGoals();

        // Open the Phase 7 Final Evaluation Modal
        openPhase7FinalEvalModal(emp.id);
    } catch (err) {
        console.error('Error continuing to final evaluation:', err);
        if (typeof showToast === 'function') {
            showToast(err.message || 'Failed to initiate final evaluation.', 'error');
        }
    }
}
window.continueToFinal1on1Evaluation = continueToFinal1on1Evaluation;

/**
 * Open Phase 7 Final 1-on-1 Evaluation Modal
 */
function openPhase7FinalEvalModal(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));
    if (!emp) return;

    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed' || g.status === 'Failed') && isSameEmployee(g.employee_id, emp.id));
    const targetGoal = empGoals[0];

    const empIdInput = document.getElementById('phase7-eval-emp-id');
    const goalIdInput = document.getElementById('phase7-eval-goal-id');
    const avatarEl = document.getElementById('phase7-eval-avatar');
    const nameEl = document.getElementById('phase7-eval-name');
    const roleDeptEl = document.getElementById('phase7-eval-role-dept');
    const notesEl = document.getElementById('phase7-eval-notes');

    if (empIdInput) empIdInput.value = emp.id;
    if (goalIdInput) goalIdInput.value = targetGoal ? targetGoal.id : '';
    if (avatarEl) {
        avatarEl.textContent = emp.avatar || (emp.name ? emp.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'EM');
        avatarEl.className = `w-10 h-10 rounded-full ${emp.avatarBg || 'bg-rose-100 text-rose-800'} font-bold flex items-center justify-center text-xs`;
    }
    if (nameEl) nameEl.textContent = emp.name;
    if (roleDeptEl) roleDeptEl.textContent = `${emp.position || 'Host'} · ${emp.department || 'Front Office'} · Final Remediation Attempt`;

    // Construct criteria dynamically from active approved goals + 1-on-1 Mentorship Integration
    let criteriaList = [];
    if (empGoals.length > 0) {
        criteriaList = empGoals.map((g, idx) => ({
            id: `p7-crit-${idx}`,
            title: g.title,
            metric: g.target_metric || 'Standard Shift Benchmark',
            weight: parseInt(g.weight || '30', 10) || 30,
            initialRating: 2.5
        }));
    } else {
        criteriaList = [
            { id: 'p7-crit-0', title: 'Core Operational Performance & KPI Standards', metric: 'Standard Shift Benchmark', weight: 40, initialRating: 2.5 },
            { id: 'p7-crit-1', title: 'Guest Engagement & Service Excellence', metric: 'CSAT >= 90%', weight: 30, initialRating: 2.5 }
        ];
    }

    // Always append 1-on-1 Mentorship Integration
    criteriaList.push({
        id: 'p7-crit-mentor',
        title: '1-on-1 Mentorship Integration',
        metric: 'Demonstrated retention of 1-on-1 mentoring feedback & coach recommendations',
        weight: 30,
        initialRating: 2.5
    });

    const criteriaContainer = document.getElementById('phase7-criteria-container');
    if (criteriaContainer) {
        criteriaContainer.innerHTML = criteriaList.map((c, idx) => `
            <div class="p-3.5 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-1.5 shadow-2xs">
                <div class="flex justify-between items-center text-xs">
                    <label class="font-bold text-slate-900 block truncate max-w-[200px]" title="${c.title}">${idx + 1}. ${c.title}</label>
                    <span id="phase7-val-${c.id}" class="font-mono font-bold text-slate-900 text-xs flex-shrink-0 ml-1 bg-white px-2 py-0.5 rounded border border-slate-200">${c.initialRating.toFixed(1)}</span>
                </div>
                <p class="text-[10px] text-slate-500 truncate" title="${c.metric}">${c.metric}</p>
                <div class="flex items-center space-x-2 pt-1">
                    <input type="range" min="1" max="5" step="0.1" value="${c.initialRating}" id="phase7-score-${c.id}" data-id="${c.id}" data-title="${encodeURIComponent(c.title)}" data-metric="${encodeURIComponent(c.metric)}" class="w-full accent-rose-600 phase7-score-slider" oninput="updatePhase7FinalScoreCalc()">
                </div>
            </div>
        `).join('');
    }

    if (notesEl) notesEl.value = '';

    updatePhase7FinalScoreCalc();
    openModal('modal-phase7-final-eval');
}
window.openPhase7FinalEvalModal = openPhase7FinalEvalModal;

/**
 * Recalculate dynamic scorecard in Phase 7 Final Evaluation
 */
function updatePhase7FinalScoreCalc() {
    const sliders = document.querySelectorAll('.phase7-score-slider');
    if (!sliders || sliders.length === 0) return;

    let totalScore = 0;
    sliders.forEach(slider => {
        const val = parseFloat(slider.value) || 2.5;
        const id = slider.getAttribute('data-id');
        const valEl = document.getElementById(`phase7-val-${id}`);
        if (valEl) valEl.textContent = val.toFixed(1);
        totalScore += val;
    });

    const avg = parseFloat((totalScore / sliders.length).toFixed(2));
    const isPassed = avg >= 3.0;

    const displayEl = document.getElementById('phase7-calc-score-display');
    const verdictEl = document.getElementById('phase7-calc-verdict');
    const bannerEl = document.getElementById('phase7-calc-banner');

    if (displayEl) {
        displayEl.textContent = `⭐ ${avg.toFixed(2)} / 5.00`;
        displayEl.className = `text-2xl font-mono font-bold ${isPassed ? 'text-emerald-700' : 'text-rose-700'}`;
    }

    if (verdictEl) {
        verdictEl.textContent = isPassed ? 'Proficiency Benchmark Met (≥ 3.00) • Qualified for Rollover' : 'Below Standard (< 3.00) • Subject to Goal Failure';
        verdictEl.className = `text-xs font-bold ${isPassed ? 'text-emerald-800' : 'text-rose-800'}`;
    }

    if (bannerEl) {
        bannerEl.className = `p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-2 transition-all ${isPassed ? 'bg-emerald-50/80 border-emerald-200' : 'bg-rose-50/80 border-rose-200'}`;
    }
}
window.updatePhase7FinalScoreCalc = updatePhase7FinalScoreCalc;

/**
 * Handle submission of Phase 7 Final Evaluation Form
 */
async function handlePhase7FinalEvalSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const empId = document.getElementById('phase7-eval-emp-id')?.value;
    const goalId = document.getElementById('phase7-eval-goal-id')?.value;
    const notes = document.getElementById('phase7-eval-notes')?.value || '';

    const sliders = document.querySelectorAll('.phase7-score-slider');
    let totalScore = 0;
    const criteriaScores = [];
    sliders.forEach(slider => {
        const val = parseFloat(slider.value) || 2.5;
        const title = decodeURIComponent(slider.getAttribute('data-title') || 'Performance Criteria');
        const metric = decodeURIComponent(slider.getAttribute('data-metric') || 'Standard Metric');
        totalScore += val;
        criteriaScores.push({
            title: title,
            metric: metric,
            rating: val,
            score: val
        });
    });

    const avg = parseFloat((totalScore / (sliders.length || 1)).toFixed(2));
    const emp = (window.perfRoster || []).find(x => isSameEmployee(x.id, empId));

    if (avg < 3.0) {
        // Store pending failure data and show double-check confirmation modal
        window.pendingFinalFailData = {
            empId: empId,
            goalId: goalId,
            score: avg,
            notes: notes,
            criteriaScores: criteriaScores
        };

        const confirmScoreEl = document.getElementById('confirm-fail-score');
        if (confirmScoreEl) confirmScoreEl.textContent = `${avg.toFixed(2)} / 5.00`;

        openModal('modal-confirm-goal-failure');
        return;
    }

    // If passed standard (>= 3.0)
    const btn = document.getElementById('btn-submit-phase7-final-eval');
    const origHtml = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Saving Final Evaluation...</span>';
    }

    try {
        await PerformanceAPI.submitAppraisal({
            employee_id: empId,
            supervisor_rating: avg,
            new_supervisor_rating: avg,
            is_retry: true,
            supervisor_notes: notes,
            criteria_scores: criteriaScores
        });

        await PerformanceAPI.calibrateEvaluation({
            employee_id: empId,
            calibrated_score: avg,
            new_calibrated_score: avg,
            is_retry: true,
            discussion_minutes: `Final Phase 7 1-on-1 evaluation completed. Score: ${avg.toFixed(2)}/5.00. Notes: ${notes}`
        });

        closeModal('modal-phase7-final-eval');
        if (typeof showToast === 'function') {
            showToast(`🎉 Final Evaluation Passed for ${emp?.name || 'Associate'} with score ${avg.toFixed(2)}/5.00!`, 'success');
        }
        await loadAndRenderPlanningGoals();
    } catch (err) {
        console.error('Error saving final evaluation:', err);
        if (typeof showToast === 'function') {
            showToast(err.message || 'Failed to submit final evaluation.', 'error');
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = origHtml;
        }
    }
}
window.handlePhase7FinalEvalSubmit = handlePhase7FinalEvalSubmit;

/**
 * Execute Final Goal Failure upon confirmation
 */
async function executeConfirmGoalFailure() {
    const data = window.pendingFinalFailData;
    if (!data) return;

    const btn = document.getElementById('btn-confirm-mark-failed');
    const origHtml = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Finalizing Failure...</span>';
    }

    try {
        const emp = (window.perfRoster || []).find(x => isSameEmployee(x.id, data.empId));

        // Submit final calibration record
        await PerformanceAPI.calibrateEvaluation({
            employee_id: data.empId,
            calibrated_score: data.score,
            discussion_minutes: `Final 4th Attempt 1-on-1 Review Concluded. Score: ${data.score.toFixed(2)} / 5.00 (Failed Standard). ${data.notes}`
        });

        // Mark goal as Failed in Supabase
        await PerformanceAPI.markGoalFailed(data.goalId, data.empId);

        closeModal('modal-confirm-goal-failure');
        closeModal('modal-phase7-final-eval');

        if (typeof showToast === 'function') {
            showToast(`Performance Goal for ${emp?.name || 'Associate'} permanently finalized as Failed.`, 'error');
        }

        window.pendingFinalFailData = null;
        await loadAndRenderPlanningGoals();
    } catch (err) {
        console.error('Error marking goal as failed:', err);
        if (typeof showToast === 'function') {
            showToast(err.message || 'Failed to finalize goal as failed.', 'error');
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = origHtml;
        }
    }
}
window.executeConfirmGoalFailure = executeConfirmGoalFailure;


