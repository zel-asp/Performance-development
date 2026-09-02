/**
 * Oxford Suites, Makati — Performance Management Module
 * Sub-Module: Navigation, Sub-Tab Switching, Stepper Badges & Pagination Controls
 */

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

// Dynamic Performance Roster State populated from real database users
window.perfRoster = [];

// Active Goal Selected for View / Revise
window.selectedGoalContext = null;
window.selectedEmployeeContext = null;

// Initialize Performance Module
document.addEventListener('DOMContentLoaded', () => {
    initPerformanceViews();
});

function renderActiveStageTable(targetStage = null) {
    let subKey = targetStage;
    if (!subKey) {
        const activeBtn = document.querySelector('.subnav-perf.active');
        subKey = activeBtn ? activeBtn.getAttribute('data-sub') : null;
        if (!subKey) {
            try {
                subKey = localStorage.getItem('oxford_active_subtab_perf') || 'plan';
            } catch(e) {
                subKey = 'plan';
            }
        }
    }

    switch(subKey) {
        case 'plan':
            renderPlanningRosterTable();
            renderGeneralTasksTable();
            break;
        case 'approve':
            renderApprovalRosterTable();
            break;
        case 'monitor':
            renderMonitoringRosterTable();
            break;
        case 'eval':
            renderEvaluationRosterTable();
            break;
        case 'review':
            renderReviewRosterTable();
            break;
        case 'idp':
            renderIDPRosterTable();
            break;
        case 'cycle':
            renderCycleRosterTable();
            break;
        default:
            renderPlanningRosterTable();
            renderGeneralTasksTable();
            break;
    }
}
window.renderActiveStageTable = renderActiveStageTable;

function renderAllStageTables() {
    renderPlanningRosterTable();
    renderApprovalRosterTable();
    renderMonitoringRosterTable();
    renderGeneralTasksTable();
    renderEvaluationRosterTable();
    renderReviewRosterTable();
    renderIDPRosterTable();
    renderCycleRosterTable();
}
window.renderAllStageTables = renderAllStageTables;

async function initPerformanceViews() {
    // 1. Instant local render of active stage first (0ms latency)
    if (window.dbGoals && window.dbGoals.length > 0) {
        renderEmployeePulseGoals(window.dbGoals);
    }
    renderActiveStageTable();
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
        pulseContainer.innerHTML = Array(2).fill(0).map(() => `
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
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div class="h-4 bg-slate-100 rounded w-16"></div>
                    <div class="h-7 bg-slate-200 rounded-xl w-28"></div>
                </div>
            </div>
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

// ============================================================================
// Enhanced Pagination State & Controllers (Stages 1 through 7)
// ============================================================================
let planningCurrentPage = 1;
let planningPageSize = 5;
let generalTasksCurrentPage = 1;
let generalTasksPageSize = 5;
let approvalCurrentPage = 1;
let approvalPageSize = 4;
let monitoringCurrentPage = 1;
let monitoringPageSize = 5;
let evalCurrentPage = 1;
let evalPageSize = 5;
let reviewCurrentPage = 1;
let reviewPageSize = 5;
let idpCurrentPage = 1;
let idpPageSize = 5;
let cycleCurrentPage = 1;
let cyclePageSize = 5;

// Stage 1 Setters
function setPlanningPage(page) {
    planningCurrentPage = Math.max(1, parseInt(page));
    renderPlanningRosterTable();
}
window.setPlanningPage = setPlanningPage;

function setPlanningPageSize(size) {
    planningPageSize = size === 'all' ? 'all' : parseInt(size);
    planningCurrentPage = 1;
    renderPlanningRosterTable();
}
window.setPlanningPageSize = setPlanningPageSize;

function setGeneralTasksPage(page) {
    generalTasksCurrentPage = Math.max(1, parseInt(page));
    renderGeneralTasksTable();
}
window.setGeneralTasksPage = setGeneralTasksPage;

function setGeneralTasksPageSize(size) {
    generalTasksPageSize = size === 'all' ? 'all' : parseInt(size);
    generalTasksCurrentPage = 1;
    renderGeneralTasksTable();
}
window.setGeneralTasksPageSize = setGeneralTasksPageSize;

// Stage 2 Setters
function setApprovalPage(page) {
    approvalCurrentPage = Math.max(1, parseInt(page));
    renderApprovalRosterTable();
}
window.setApprovalPage = setApprovalPage;

function setApprovalPageSize(size) {
    approvalPageSize = size === 'all' ? 'all' : parseInt(size);
    approvalCurrentPage = 1;
    renderApprovalRosterTable();
}
window.setApprovalPageSize = setApprovalPageSize;

// Stage 3 Setters
function setMonitoringPage(page) {
    monitoringCurrentPage = Math.max(1, parseInt(page));
    renderMonitoringRosterTable();
}
window.setMonitoringPage = setMonitoringPage;

function setMonitoringPageSize(size) {
    monitoringPageSize = size === 'all' ? 'all' : parseInt(size);
    monitoringCurrentPage = 1;
    renderMonitoringRosterTable();
}
window.setMonitoringPageSize = setMonitoringPageSize;

// Stage 4 Setters
function setEvalPage(page) {
    evalCurrentPage = Math.max(1, parseInt(page));
    renderEvaluationRosterTable();
}
window.setEvalPage = setEvalPage;

function setEvalPageSize(size) {
    evalPageSize = size === 'all' ? 'all' : parseInt(size);
    evalCurrentPage = 1;
    renderEvaluationRosterTable();
}
window.setEvalPageSize = setEvalPageSize;

// Stage 5 Setters
function setReviewPage(page) {
    reviewCurrentPage = Math.max(1, parseInt(page));
    renderReviewRosterTable();
}
window.setReviewPage = setReviewPage;

function setReviewPageSize(size) {
    reviewPageSize = size === 'all' ? 'all' : parseInt(size);
    reviewCurrentPage = 1;
    renderReviewRosterTable();
}
window.setReviewPageSize = setReviewPageSize;

// Stage 6 Setters
function setIDPPage(page) {
    idpCurrentPage = Math.max(1, parseInt(page));
    renderIDPRosterTable();
}
window.setIDPPage = setIDPPage;

function setIDPPageSize(size) {
    idpPageSize = size === 'all' ? 'all' : parseInt(size);
    idpCurrentPage = 1;
    renderIDPRosterTable();
}
window.setIDPPageSize = setIDPPageSize;

// Stage 7 Setters
function setCyclePage(page) {
    cycleCurrentPage = Math.max(1, parseInt(page));
    renderCycleRosterTable();
}
window.setCyclePage = setCyclePage;

function setCyclePageSize(size) {
    cyclePageSize = size === 'all' ? 'all' : parseInt(size);
    cycleCurrentPage = 1;
    renderCycleRosterTable();
}
window.setCyclePageSize = setCyclePageSize;

// Universal High-Performance Pagination Renderer with Per-Page Selector
function renderPaginationControls(containerId, currentPage, totalItems, pageSize, onPageFnName, onSizeFnName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isAll = pageSize === 'all' || pageSize >= 99999;
    const effectivePageSize = isAll ? (totalItems || 1) : parseInt(pageSize);
    const totalPages = isAll ? 1 : (Math.ceil(totalItems / effectivePageSize) || 1);
    const startItem = totalItems === 0 ? 0 : (isAll ? 1 : ((currentPage - 1) * effectivePageSize + 1));
    const endItem = isAll ? totalItems : Math.min(currentPage * effectivePageSize, totalItems);

    let perPageHtml = '';
    if (onSizeFnName) {
        perPageHtml = `
            <div class="flex items-center space-x-1.5 border-l border-slate-200 pl-3">
                <span class="text-[10px] text-slate-400 font-semibold">Per page:</span>
                <select onchange="${onSizeFnName}(this.value)" class="bg-white border border-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer">
                    <option value="4" ${pageSize == 4 ? 'selected' : ''}>4</option>
                    <option value="5" ${pageSize == 5 ? 'selected' : ''}>5</option>
                    <option value="10" ${pageSize == 10 ? 'selected' : ''}>10</option>
                    <option value="20" ${pageSize == 20 ? 'selected' : ''}>20</option>
                    <option value="all" ${pageSize === 'all' ? 'selected' : ''}>All</option>
                </select>
            </div>
        `;
    }

    if (totalItems === 0) {
        container.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-slate-400 text-[11px]">Showing 0 entries</span>
                ${perPageHtml}
            </div>
        `;
        return;
    }

    if (totalPages <= 1) {
        container.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-slate-500 text-[11px]">Showing <strong>${startItem}-${endItem}</strong> of <strong>${totalItems}</strong> entries</span>
                ${perPageHtml}
            </div>
            <div class="text-[11px] text-slate-400 font-medium">Page 1 of 1</div>
        `;
        return;
    }

    let html = `
        <div class="flex items-center space-x-3">
            <span class="text-slate-500 text-[11px]">Showing <strong>${startItem}-${endItem}</strong> of <strong>${totalItems}</strong> entries</span>
            ${perPageHtml}
        </div>
        <div class="flex items-center space-x-1">
            <button type="button" onclick="${onPageFnName}(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-bold transition flex items-center space-x-1 shadow-2xs">
                <i class="fas fa-chevron-left text-[9px]"></i><span>Prev</span>
            </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <button type="button" onclick="${onPageFnName}(${i})" class="w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${i === currentPage ? 'bg-primary text-white shadow-xs' : 'border border-slate-200 text-slate-700 hover:bg-slate-100'}">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="px-1 text-slate-400 text-xs">...</span>`;
        }
    }

    html += `
            <button type="button" onclick="${onPageFnName}(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-bold transition flex items-center space-x-1 shadow-2xs">
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

    const goals = window.dbGoals || [];
    const evals = getDbEvaluations();
    const roster = window.perfRoster || [];

    // Fast single-pass counters
    let pendingPlanCount = 0;
    let approvedGoalsCount = 0;
    const monitoredEmpSet = new Set();

    goals.forEach(g => {
        const s = (g.status || '').toLowerCase().trim();
        if (s === 'pending approval' || s === 'pending' || s === 'draft' || s === '') {
            pendingPlanCount++;
        } else if (s === 'approved') {
            approvedGoalsCount++;
            if (g.employee_id) monitoredEmpSet.add(String(g.employee_id).toLowerCase());
        }
    });

    const monitoredEmployeesCount = roster.filter(e => {
        return typeof employeeHasApprovedGoal === 'function' ? employeeHasApprovedGoal(e) : false;
    }).length;

    // Stage 4 pending evaluation (strictly requires approved goal)
    const pendingEvaluationCount = roster.filter(emp => {
        const hasApprovedGoal = typeof employeeHasApprovedGoal === 'function' ? employeeHasApprovedGoal(emp) : false;
        if (!hasApprovedGoal) return false;
        if (!isEmployeeTasksFullyCompleted(emp)) return false;

        const evalRec = evals.find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const hasRatedScore = evalRec && typeof evalRec.supervisor_rating !== 'undefined' && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0;
        return !hasRatedScore;
    }).length;

    const evaluatedEmployeesCount = roster.filter(emp => {
        const hasApprovedGoal = typeof employeeHasApprovedGoal === 'function' ? employeeHasApprovedGoal(emp) : false;
        if (!hasApprovedGoal) return false;
        const evalRec = evals.find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        return evalRec && typeof evalRec.supervisor_rating !== 'undefined' && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0;
    }).length;

    const calibratedEmployeesCount = roster.filter(emp => {
        const hasApprovedGoal = typeof employeeHasApprovedGoal === 'function' ? employeeHasApprovedGoal(emp) : false;
        if (!hasApprovedGoal) return false;
        const evalRec = evals.find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        return evalRec && evalRec.status === 'Calibrated' && typeof evalRec.calibrated_score !== 'undefined' && evalRec.calibrated_score !== null && parseFloat(evalRec.calibrated_score) > 0;
    }).length;

    const idpCount = evaluatedEmployeesCount;
    const cycleCount = roster.filter(emp => {
        const empGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, emp.id));
        return empGoals.some(g => {
            const st = (g.status || '').toLowerCase().trim();
            return st !== 'completed' && (st === 'approved' || st === 'in progress' || st === 'done');
        });
    }).length;

    const stageDataCounts = {
        plan: { count: pendingPlanCount, label: `${pendingPlanCount} Pending` },
        approve: { count: approvedGoalsCount, label: `${approvedGoalsCount} Approved` },
        monitor: { count: monitoredEmployeesCount, label: `${monitoredEmployeesCount} Monitored` },
        eval: { count: pendingEvaluationCount, label: `${pendingEvaluationCount} Pending` },
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
