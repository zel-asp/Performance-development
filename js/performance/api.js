/**
 * Oxford Suites, Makati — Performance Management Module
 * Sub-Module: PerformanceAPI, Shared DB States & Universal Helpers
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
    awardPerformanceXP(employeeId, points, evalId, reason = 'Performance Kudos', goalId = null) {
        return this.request('award_performance_xp', 'POST', {
            employee_id: employeeId,
            points: points,
            eval_id: evalId,
            reason: reason,
            goal_id: goalId
        });
    },

    // 13b. Revert Goal Kudos and Reset Status to Approved
    revertGoalKudos(employeeId, goalId = null, expId = null) {
        return this.request('revert_goal_kudos', 'POST', {
            employee_id: employeeId,
            goal_id: goalId,
            exp_id: expId
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
    },

    // 18. Development Plan — Phase 6 Draft Management
    getDevelopmentPlans(employeeId) {
        return this.request('get_development_plans', 'GET', { employee_id: employeeId });
    },

    addDraftTask(data) {
        return this.request('add_draft_task', 'POST', data);
    },

    addDraftBook(data) {
        return this.request('add_draft_book', 'POST', data);
    },

    removeDraftItem(id) {
        return this.request('remove_draft_item', 'POST', { id });
    },

    discardDraftPlan(employeeId) {
        return this.request('discard_draft_plan', 'POST', { employee_id: employeeId });
    },

    // 19. Development Plan — Phase 7 Deploy
    deployDevelopmentPlan(employeeId, goalId = null) {
        return this.request('deploy_development_plan', 'POST', {
            employee_id: employeeId,
            goal_id: goalId
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
 * Strictly scopes to:
 * 1. Matching target_goal_id if provided
 * 2. Records with source_type === 'performance_gap' or source_label referencing Performance/IDP/Stage 7
 * 3. Records with non-null target_goal_id
 * Ignores unlinked generic competency TNA gaps (source_type = 'competency_gap' with target_goal_id = null)
 */
function getEmployeeTrainingNeed(empId, goalId = null) {
    if (!Array.isArray(window.dbTrainingNeeds) || window.dbTrainingNeeds.length === 0) return null;
    const list = window.dbTrainingNeeds.filter(tn => isSameEmployee(tn.employee_id, empId) || isSameEmployee(tn.employeeId, empId));
    if (list.length === 0) return null;

    // 1. If goalId is provided, look for exact target_goal_id match first
    if (goalId) {
        const goalMatch = list.find(tn => (tn.target_goal_id && String(tn.target_goal_id) === String(goalId)) || (tn.targetGoalId && String(tn.targetGoalId) === String(goalId)));
        if (goalMatch) return goalMatch;
    }

    // 2. Filter for performance-specific training needs (not unlinked competency gap assessments)
    const perfNeeds = list.filter(tn => {
        const hasGoalId = !!(tn.target_goal_id || tn.targetGoalId);
        const isPerfSource = tn.source_type === 'performance_gap' || 
            (tn.source_label && (tn.source_label.includes('Performance') || tn.source_label.includes('Stage 7') || tn.source_label.includes('IDP Remediation'))) ||
            (tn.title && tn.title.includes('Formal Training:'));
        return hasGoalId || isPerfSource;
    });

    if (perfNeeds.length === 0) return null;

    // Prioritize active In Training records
    const active = perfNeeds.find(tn => tn.status === 'In Training' || tn.status === 'In Progress');
    return active || perfNeeds[perfNeeds.length - 1];
}
window.getEmployeeTrainingNeed = getEmployeeTrainingNeed;

/**
 * Check if employee is currently flagged for Needs Training or enrolled in training_needs for a performance goal
 */
function isEmployeeInTraining(empId, goalId = null) {
    const empGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, empId));
    const targetGoals = goalId ? empGoals.filter(g => String(g.id) === String(goalId)) : empGoals;
    const hasInTrainingGoal = targetGoals.some(g => !!g.in_training);
    const hasNeedsTrainingGoal = targetGoals.some(g => !!g.needs_training);

    if (hasInTrainingGoal || hasNeedsTrainingGoal) return true;

    // Check if there is an active performance-linked training need
    const tn = getEmployeeTrainingNeed(empId, goalId);
    if (tn && (tn.status === 'In Training' || tn.status === 'In Progress')) return true;
    return false;
}
window.isEmployeeInTraining = isEmployeeInTraining;

/**
 * Check if employee has a recorded score / completed training in training_needs for the performance goal
 */
function isEmployeeTrainingScored(empId, goalId = null) {
    const tn = getEmployeeTrainingNeed(empId, goalId);
    if (!tn) return false;
    const status = (tn.status || '').toLowerCase();
    // Only completed/resolved/passed or active post-training quiz score counts
    if (status === 'resolved' || status === 'completed' || status === 'passed') return true;
    if (tn.status === 'In Training' && parseFloat(tn.current_score || tn.currentScore || 0) > 0 && tn.notes && (tn.notes.includes('Quiz Passed') || tn.notes.includes('Completed'))) return true;
    return false;
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

/**
 * Check if all shift monitoring tasks for an employee's approved goals are 100% completed
 */
function isEmployeeTasksFullyCompleted(emp) {
    const empId = typeof emp === 'object' ? emp.id : emp;
    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, empId));
    if (empGoals.length === 0) return false;

    let totalTasks = 0;
    let completedTasks = 0;

    empGoals.forEach(g => {
        const tasks = g.tasks || [];
        if (tasks.length > 0) {
            tasks.forEach(t => {
                totalTasks++;
                if (t.status === 'completed') completedTasks++;
            });
        } else if (g.status === 'Completed') {
            totalTasks++;
            completedTasks++;
        } else {
            // Check milestone or task progress
            const prog = typeof g.task_progress === 'number' ? g.task_progress : (g.milestoneProgress || g.progress || 0);
            totalTasks++;
            if (prog >= 100) completedTasks++;
        }
    });

    if (totalTasks === 0) return false;
    return completedTasks === totalTasks;
}
window.isEmployeeTasksFullyCompleted = isEmployeeTasksFullyCompleted;

window.planningStatusFilter = 'pending';
window.planningSearchQuery = '';
window.approvedSearchQuery = '';
window.monitoringSearchQuery = '';
window.evalSearchQuery = '';
window.reviewSearchQuery = '';
window.idpSearchQuery = '';
window.cycleSearchQuery = '';


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
    const cancelBtn = document.getElementById('btn-cancel-action-confirm');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (iconEl) iconEl.className = iconClass;
    if (iconContEl) iconContEl.className = `w-12 h-12 rounded-2xl ${iconContainerClass} flex items-center justify-center text-xl font-bold mx-auto`;
    if (cancelBtn) {
        cancelBtn.disabled = false;
        cancelBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    if (proceedBtn) {
        proceedBtn.innerHTML = confirmBtnText;
        proceedBtn.disabled = false;
        proceedBtn.className = `${confirmBtnClass} px-4 py-2 text-xs font-bold flex-1 shadow-xs transition flex items-center justify-center space-x-1.5`;
        proceedBtn.onclick = async function() {
            if (typeof onConfirm === 'function') {
                proceedBtn.disabled = true;
                if (cancelBtn) {
                    cancelBtn.disabled = true;
                    cancelBtn.classList.add('opacity-50', 'cursor-not-allowed');
                }
                const isDelete = (confirmBtnText || '').toLowerCase().includes('delete') || (iconClass || '').includes('trash');
                const loadingText = isDelete ? 'Deleting...' : 'Processing...';
                proceedBtn.innerHTML = `<i class="fas fa-spinner fa-spin text-xs"></i><span>${loadingText}</span>`;
                try {
                    await onConfirm();
                    closeModal('modal-action-confirmation');
                } catch (e) {
                    console.error('Confirmation action error:', e);
                } finally {
                    proceedBtn.disabled = false;
                    proceedBtn.innerHTML = confirmBtnText;
                    if (cancelBtn) {
                        cancelBtn.disabled = false;
                        cancelBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    }
                }
            } else {
                closeModal('modal-action-confirmation');
            }
        };
    }
    openModal('modal-action-confirmation');
};


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
