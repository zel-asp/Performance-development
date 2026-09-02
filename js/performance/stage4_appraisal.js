/**
 * js/performance/stage4_appraisal.js
 * Stage 4: Formal Performance Appraisal
 */

// ============================================================================
// Unified Helper Functions
// ============================================================================

/**
 * Calculates monitoring task completion stats for a given employee.
 */
function getEmployeeTaskStats(empId) {
    const empGoals = (window.dbGoals || []).filter(g => g.status === 'Approved' && isSameEmployee(g.employee_id, empId));
    let total = 0;
    let completed = 0;
    empGoals.forEach(g => {
        (g.tasks || []).forEach(t => {
            total++;
            if (t.status === 'completed') completed++;
        });
    });
    return {
        total,
        completed,
        allDone: total > 0 && completed === total,
        progressPct: total > 0 ? Math.round((completed / total) * 100) : 0,
        goals: empGoals
    };
}
window.getEmployeeTaskStats = getEmployeeTaskStats;

/**
 * Resolves evaluation data (record, supervisor score, self score) for an employee.
 */
function getEmployeeEvalData(emp) {
    if (!emp) return { record: null, supervisorRating: null, selfRating: null, isRated: false };
    const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
    const rawSup = evalRec && evalRec.supervisor_rating !== undefined && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0
        ? parseFloat(evalRec.supervisor_rating)
        : (emp.supervisorRating && emp.supervisorRating > 0 ? parseFloat(emp.supervisorRating) : null);
    const rawSelf = evalRec && evalRec.self_evaluation !== undefined && evalRec.self_evaluation !== null && parseFloat(evalRec.self_evaluation) > 0
        ? parseFloat(evalRec.self_evaluation)
        : (emp.selfRating && emp.selfRating > 0 ? parseFloat(emp.selfRating) : null);
    return {
        record: evalRec,
        supervisorRating: rawSup,
        selfRating: rawSelf,
        isRated: rawSup !== null
    };
}
window.getEmployeeEvalData = getEmployeeEvalData;

/**
 * Returns tier label, benchmark status, and style classes for a score.
 */
function getTierInfo(score) {
    const s = parseFloat(score);
    if (isNaN(s) || s <= 0) {
        return { label: 'Pending Evaluation', isBelow: false, badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    if (s >= 4.5) return { label: 'Master Tier', isBelow: false, badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (s >= 3.5) return { label: 'Advanced Tier', isBelow: false, badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (s >= 3.0) return { label: 'Proficient', isBelow: false, badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Below 3.0 Benchmark', isBelow: true, badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
}
window.getTierInfo = getTierInfo;

/**
 * Determines action lock status and button labels for appraisal operations.
 */
function getAppraisalActionState(empId, allTasksDone) {
    const isGoalFailed = isEmployeeGoalFailed(empId);
    const retryCount = getEmployeeRetryCount(empId);
    const inTraining = isEmployeeInTraining(empId);
    const isScored = isEmployeeTrainingScored(empId);

    if (isGoalFailed || retryCount >= 4) {
        return { state: 'locked_failed', label: 'Locked (Goal Failed)', canOpen: false, reason: 'Goal Failed. Performance appraisal locked - final score is in Phase 7.' };
    }
    if (inTraining && !isScored) {
        return { state: 'in_training', label: 'In Training (Locked)', canOpen: false, reason: 'Associate is currently in mandatory formal training. Appraisal locked until training score is recorded.' };
    }
    if (inTraining && isScored) {
        return { state: 'post_training', label: 'Evaluate (After Training)', canOpen: true, isPostTraining: true, reason: 'Training score recorded! Ready for re-evaluation.' };
    }
    if (!allTasksDone) {
        return { state: 'tasks_incomplete', label: 'Tasks Incomplete', canOpen: false, reason: 'All monitoring tasks in Stage 3 Continuous Monitoring must be completed first.' };
    }
    return { state: 'ready', label: 'Conduct Appraisal', canOpen: true, isPostTraining: false, reason: 'Ready for formal appraisal.' };
}
window.getAppraisalActionState = getAppraisalActionState;

// ============================================================================
// Roster Table & Search
// ============================================================================

function renderEvaluationRosterTable() {
    const tbody = document.getElementById('eval-roster-tbody') || document.getElementById('perf-evaluation-roster-tbody');
    if (!tbody) return;

    if (!window.perfRoster || window.perfRoster.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="py-12 text-center text-slate-400">
                    <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg mx-auto font-bold mb-2">
                        <i class="fas fa-clipboard-user"></i>
                    </div>
                    <p class="text-sm font-semibold text-slate-600">No Associates in Appraisal Roster</p>
                    <p class="text-xs text-slate-400 mt-1">Associates with active objectives in Stage 1 &amp; 2 will appear here for performance appraisals.</p>
                </td>
            </tr>
        `;
        return;
    }

    const searchInput = document.getElementById('search-eval-emp') || document.getElementById('eval-search-input');
    const searchQuery = ((typeof window.evalSearchQuery !== 'undefined' && window.evalSearchQuery !== null) ? window.evalSearchQuery : (searchInput ? searchInput.value : '')).toLowerCase().trim();

    let roster = (window.perfRoster || []).filter(emp => {
        return typeof employeeHasApprovedGoal === 'function' ? employeeHasApprovedGoal(emp) : false;
    });

    if (searchQuery) {
        roster = roster.filter(emp => {
            const name = (emp.name || '').toLowerCase();
            const pos = (emp.position || '').toLowerCase();
            const dept = (emp.department || '').toLowerCase();
            const id = (emp.id || '').toLowerCase();
            return name.includes(searchQuery) || pos.includes(searchQuery) || dept.includes(searchQuery) || id.includes(searchQuery);
        });
    }

    if (roster.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="py-12 text-center text-slate-400">
                    <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg mx-auto font-bold mb-2">
                        <i class="fas fa-clipboard-user"></i>
                    </div>
                    <p class="text-sm font-semibold text-slate-600">No Associates with Active Approved Objectives</p>
                    <p class="text-xs text-slate-400 mt-1">Associates will appear in Appraisal Roster once their goals have status 'Approved' in Stage 1 &amp; 2.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = roster.map((emp, idx) => {
        const evalData = getEmployeeEvalData(emp);
        const taskStats = getEmployeeTaskStats(emp.id);
        const actionState = getAppraisalActionState(emp.id, taskStats.allDone);
        const tier = getTierInfo(evalData.supervisorRating);

        const selfScoreDisplay = (evalData.selfRating !== null && evalData.selfRating > 0)
            ? `${evalData.selfRating.toFixed(2)} / 5.0`
            : `<span class="text-slate-400 italic">Pending</span>`;

        let tierBadge = '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Awaiting Rating</span>';
        if (!taskStats.allDone && !evalData.isRated) {
            tierBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Tasks Incomplete (${taskStats.completed}/${taskStats.total})</span>`;
        } else if (evalData.isRated) {
            tierBadge = tier.isBelow
                ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${tier.badgeClass} border inline-flex items-center space-x-1"><i class="fas fa-triangle-exclamation text-[9px]"></i><span>Below 3.0</span></span>`
                : `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${tier.badgeClass} border">${tier.label}</span>`;
        }

        let actionBtnHtml = '';
        if (!actionState.canOpen) {
            actionBtnHtml = `
                <button disabled title="${actionState.reason}" class="px-3 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold rounded-xl shadow-none cursor-not-allowed inline-flex items-center space-x-1.5">
                    <i class="fas fa-lock text-[10px]"></i>
                    <span>${actionState.label}</span>
                </button>
            `;
        } else if (actionState.isPostTraining) {
            actionBtnHtml = `
                <button onclick="openAppraisalModal('${emp.id}', true)" title="${actionState.reason}" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center space-x-1.5">
                    <i class="fas fa-star-half-stroke text-[10px]"></i>
                    <span>${actionState.label}</span>
                </button>
            `;
        } else if (evalData.isRated) {
            actionBtnHtml = `
                <button onclick="showEmployeeEvalDetail('${emp.id}', true)" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition inline-flex items-center space-x-1.5">
                    <i class="fas fa-eye text-[10px]"></i>
                    <span>View Record</span>
                </button>
                <button onclick="openAppraisalModal('${emp.id}')" class="px-3 py-1.5 bg-white hover:bg-slate-50 text-primary text-xs font-bold rounded-xl border border-primary/30 transition inline-flex items-center space-x-1.5">
                    <i class="fas fa-pen text-[10px]"></i>
                    <span>Re-Evaluate</span>
                </button>
            `;
        } else {
            actionBtnHtml = `
                <button onclick="openAppraisalModal('${emp.id}')" class="px-3 py-1.5 btn-primary text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center space-x-1.5">
                    <i class="fas fa-star-half-stroke text-[10px]"></i>
                    <span>Conduct Appraisal</span>
                </button>
            `;
        }

        const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40';

        return `
            <tr class="${rowBg} hover:bg-[#FAF8F7] transition border-b border-slate-100 text-xs">
                <td class="px-3 py-4 text-center text-slate-400 font-mono text-[11px]">${idx + 1}</td>
                <td class="px-5 py-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                            ${emp.avatar || emp.name.charAt(0)}
                        </div>
                        <div>
                            <div class="font-bold text-slate-900 text-xs hover:text-primary cursor-pointer" onclick="showEmployeeEvalDetail('${emp.id}', true)">${emp.name}</div>
                            <div class="text-[10px] text-slate-400 font-mono">${emp.position}</div>
                        </div>
                    </div>
                </td>
                <td class="px-5 py-4">
                    <span class="text-xs font-medium text-slate-600">${emp.department}</span>
                </td>
                <td class="px-5 py-4">
                    <div class="flex items-center justify-between text-[11px] mb-1">
                        <span class="font-bold text-slate-700">${taskStats.progressPct}%</span>
                        <span class="text-slate-400 text-[10px]">${taskStats.total > 0 ? taskStats.completed + '/' + taskStats.total + ' Tasks' : 'No Tasks'}</span>
                    </div>
                    <div class="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-300 ${taskStats.progressPct >= 100 ? 'bg-emerald-500' : 'bg-primary'}" style="width: ${taskStats.progressPct}%"></div>
                    </div>
                </td>
                <td class="px-5 py-4">
                    <span class="text-xs font-mono text-slate-700">${selfScoreDisplay}</span>
                </td>
                <td class="px-5 py-4">
                    <span class="text-xs font-mono font-bold ${tier.isBelow ? 'text-rose-600' : 'text-slate-900'}">${evalData.isRated ? evalData.supervisorRating.toFixed(2) + ' / 5.0' : '<span class="text-slate-400 font-normal italic">--</span>'}</span>
                </td>
                <td class="px-5 py-4 text-center">
                    ${tierBadge}
                </td>
                <td class="px-5 py-4 text-right">
                    <div class="flex items-center justify-end space-x-2">
                        ${actionBtnHtml}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}
window.renderEvaluationRosterTable = renderEvaluationRosterTable;

window.onEvalEmployeeSearch = function(query) {
    window.evalSearchQuery = query;
    renderEvaluationRosterTable();
};

function filterEvaluationRoster() {
    const search = (document.getElementById('search-eval-emp')?.value || document.getElementById('eval-search-input')?.value || '').toLowerCase();
    const dept = document.getElementById('eval-dept-filter')?.value || 'all';

    const rows = document.querySelectorAll('#eval-roster-tbody tr, #perf-eval-roster-tbody tr');
    rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        const matchesSearch = !search || text.includes(search);
        const matchesDept = dept === 'all' || text.includes(dept.toLowerCase());
        r.style.display = (matchesSearch && matchesDept) ? '' : 'none';
    });
}
window.filterEvaluationRoster = filterEvaluationRoster;

// ============================================================================
// Evaluation Detail View Modal
// ============================================================================

function showEmployeeEvalDetail(empId, openModalImmediately = false) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || (window.perfRoster || [])[0];
    if (!emp) return;

    window.selectedEvalEmpId = emp.id;

    // Header Details
    const nameEl = document.getElementById('eval-detail-emp-name');
    const posEl = document.getElementById('eval-detail-emp-pos');
    const idEl = document.getElementById('eval-detail-emp-id');
    const avatarEl = document.getElementById('eval-detail-emp-avatar');
    if (nameEl) nameEl.textContent = emp.name;
    if (posEl) posEl.textContent = `${emp.position} · ${emp.department}`;
    if (idEl) idEl.textContent = `EMP #${emp.id}`;
    if (avatarEl) avatarEl.textContent = emp.avatar || emp.name.charAt(0);

    const evalData = getEmployeeEvalData(emp);
    const taskStats = getEmployeeTaskStats(emp.id);
    const actionState = getAppraisalActionState(emp.id, taskStats.allDone);
    const tier = getTierInfo(evalData.supervisorRating);

    const statusBadge = document.getElementById('eval-detail-status-badge');
    if (statusBadge) {
        if (evalData.isRated) {
            statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
            statusBadge.textContent = '✓ Formal Appraisal Completed';
        } else {
            statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200';
            statusBadge.textContent = 'Pending Formal Appraisal';
        }
    }

    // Monitoring Progress Summary in Detail
    const monProgressEl = document.getElementById('eval-detail-mon-progress');
    const taskCountEl = document.getElementById('eval-detail-task-count');
    if (monProgressEl) monProgressEl.innerHTML = `${taskStats.progressPct}% <span class="text-sm font-normal text-slate-400">Shift Execution</span>`;
    if (taskCountEl) taskCountEl.textContent = `${taskStats.completed} of ${taskStats.total} monitoring tasks verified in database`;

    // Render Approved Goals & Tasks in Evaluation Detail
    const goalsContainer = document.getElementById('eval-detail-goals-container');
    if (goalsContainer) {
        if (taskStats.goals.length === 0) {
            goalsContainer.innerHTML = `<div class="p-6 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-200">No approved objectives found in database for this associate.</div>`;
        } else {
            goalsContainer.innerHTML = taskStats.goals.map((g, idx) => {
                const tasks = g.tasks || [];
                const done = tasks.filter(t => t.status === 'completed').length;
                const total = tasks.length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
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

    // Configure Open Appraisal Button
    const btnOpenAppraisal = document.getElementById('btn-open-eval-appraisal');
    if (btnOpenAppraisal) {
        if (!actionState.canOpen) {
            btnOpenAppraisal.disabled = true;
            btnOpenAppraisal.className = 'btn-secondary px-4 py-2 text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none inline-flex items-center space-x-1.5';
            btnOpenAppraisal.innerHTML = `<i class="fas fa-lock mr-1"></i><span>${actionState.label}</span>`;
            btnOpenAppraisal.title = actionState.reason;
            btnOpenAppraisal.onclick = null;
        } else if (actionState.isPostTraining) {
            btnOpenAppraisal.disabled = false;
            btnOpenAppraisal.className = 'btn-primary px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs inline-flex items-center space-x-1.5';
            btnOpenAppraisal.innerHTML = `<i class="fas fa-star-half-stroke mr-1"></i><span>${actionState.label}</span>`;
            btnOpenAppraisal.title = actionState.reason;
            btnOpenAppraisal.onclick = () => openAppraisalModal(emp.id, true);
        } else {
            btnOpenAppraisal.disabled = false;
            btnOpenAppraisal.className = 'btn-primary px-4 py-2 text-xs font-bold shadow-xs inline-flex items-center space-x-1.5';
            btnOpenAppraisal.innerHTML = `<i class="fas fa-star-half-stroke mr-1"></i><span>${evalData.isRated ? 'Re-Evaluate Appraisal' : 'Open Appraisal Form'}</span>`;
            btnOpenAppraisal.title = 'Open Appraisal Form';
            btnOpenAppraisal.onclick = () => openAppraisalModal(emp.id);
        }
    }

    // Supervisor Assessment Score from Database
    const superScoreEl = document.getElementById('eval-detail-super-score');
    if (superScoreEl) {
        superScoreEl.innerHTML = evalData.isRated
            ? `${evalData.supervisorRating.toFixed(2)} <span class="text-sm font-normal text-slate-400">/ 5.0 (${tier.label})</span>`
            : `0.00 <span class="text-sm font-normal text-slate-400">/ 5.0 (Pending Evaluation)</span>`;
    }

    const tierBadgeContainer = document.getElementById('eval-detail-tier-badge-container');
    if (tierBadgeContainer) {
        if (evalData.isRated) {
            tierBadgeContainer.innerHTML = `<span class="px-3 py-1 rounded-xl text-xs font-bold ${tier.badgeClass} border inline-flex items-center space-x-1.5"><i class="fas ${tier.isBelow ? 'fa-triangle-exclamation' : 'fa-award'}"></i><span>${tier.label}</span></span>`;
        } else {
            tierBadgeContainer.innerHTML = `<span class="px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Evaluation Pending</span>`;
        }
    }

    // Evaluated Criteria Breakdown from Database
    const criteriaBreakdownEl = document.getElementById('eval-detail-criteria-breakdown');
    if (criteriaBreakdownEl) {
        const list = evalData.record && Array.isArray(evalData.record.criteria_scores) && evalData.record.criteria_scores.length > 0 ? evalData.record.criteria_scores : [];
        if (list.length > 0) {
            criteriaBreakdownEl.innerHTML = list.map((c, i) => `
                <div class="p-3 bg-white rounded-xl border ${c.rating < 3.0 ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'} space-y-1 shadow-2xs">
                    <div class="flex justify-between items-center text-xs flex-wrap gap-1">
                        <span class="font-bold text-slate-900">${i + 1}. ${c.title} <span class="text-[10px] text-slate-400 font-normal">(${c.metric || 'Standard Benchmark'})</span></span>
                        <span class="font-bold font-mono px-2 py-0.5 rounded text-[11px] ${c.rating < 3.0 ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800'}">
                            ${c.rating < 3.0 ? '<i class="fas fa-triangle-exclamation mr-1 text-rose-600"></i>' : ''}<i class="fas fa-star text-amber-500 mr-0.5 text-[10px]"></i>${parseFloat(c.rating || 0).toFixed(1)} / 5.0 (${c.weight || '33'}% wt)
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
        superRecEl.innerHTML = (evalData.record && evalData.record.supervisor_notes)
            ? `<p class="text-slate-800 leading-relaxed italic">"${evalData.record.supervisor_notes}"</p>`
            : `<p class="text-slate-400 italic">No formal supervisor endorsement notes entered in database yet.</p>`;
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

// ============================================================================
// Formal Appraisal Modal & Form Submission
// ============================================================================

window.pendingEvalEmpId = null;

function openAppraisalModal(empId, isPostTraining = false) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || (window.perfRoster || [])[0];
    if (!emp) return;

    window.selectedEvalEmpId = emp.id;

    const inTraining = isEmployeeInTraining(emp.id);
    const isScored = isEmployeeTrainingScored(emp.id);
    if (inTraining && !isScored && !isPostTraining) {
        if (typeof showToast === 'function') {
            showToast(`⚠️ Cannot evaluate ${emp.name}: Associate is currently enrolled in Mandatory Formal Training. Re-evaluation is locked until training score is recorded.`, 'warning');
        }
        return;
    }

    const taskStats = getEmployeeTaskStats(emp.id);
    if (!taskStats.allDone && !isPostTraining && !inTraining) {
        if (typeof showToast === 'function') {
            showToast(`⚠️ Cannot evaluate ${emp.name}: Monitoring tasks are still not done (${taskStats.completed}/${taskStats.total} completed). Complete all tasks in Stage 3 Continuous Monitoring first.`, 'warning');
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
    const targetGoalInput = document.getElementById('eval-target-goal-id');
    const titleEl = document.getElementById('modal-eval-emp-title');
    if (targetInput) targetInput.value = emp.id;
    if (titleEl) titleEl.textContent = `Appraisal Review: ${emp.name} (${emp.position})`;

    const criteriaContainer = document.getElementById('appraisal-criteria-container');
    if (!criteriaContainer) return;

    // Load approved goals and DB evaluation criteria
    const evalData = getEmployeeEvalData(emp);
    const empGoals = (window.dbGoals || []).filter(g => g.status === 'Approved' && isSameEmployee(g.employee_id, emp.id));
    const targetGoal = empGoals[0];
    if (targetGoalInput) targetGoalInput.value = targetGoal ? targetGoal.id : '';

    let criteriaList = [];
    if (evalData.record && Array.isArray(evalData.record.criteria_scores) && evalData.record.criteria_scores.length > 0) {
        criteriaList = evalData.record.criteria_scores.map(c => ({
            title: c.title,
            metric: c.metric,
            weight: c.weight || 30,
            initialRating: c.rating || 4.5,
            rationale: c.rationale || 'Demonstrated high consistency in achieving target deliverables.'
        }));
    } else if (empGoals.length > 0) {
        criteriaList = empGoals.map(g => ({
            title: g.title,
            metric: g.target_metric || '100% SOP Compliance',
            weight: parseInt(g.weight || '30', 10) || 30,
            initialRating: 3.0,
            rationale: ''
        }));
    } else {
        criteriaList = [
            { title: 'Operational Excellence & Protocol Adherence', metric: '100% SOP Compliance', weight: 40, initialRating: 3.0, rationale: '' },
            { title: 'Guest Satisfaction & Service Speed', metric: 'CSAT >= 95%', weight: 30, initialRating: 3.0, rationale: '' },
            { title: 'Teamwork, Conflict De-escalation & Mentorship', metric: 'Zero Unresolved Escalations', weight: 30, initialRating: 3.0, rationale: '' }
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
            <textarea rows="2" placeholder="Provide performance evidence, KPI deliverables observed, and coaching notes..." class="w-full p-2.5 bg-white rounded-xl border border-[#E8DEDC] text-xs text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar">${c.rationale || ''}</textarea>
        </div>
    `).join('');

    // Prepopulate supervisor recommendation textarea if present
    const notesInput = document.getElementById('eval-supervisor-notes');
    if (notesInput && evalData.record && evalData.record.supervisor_notes) {
        notesInput.value = evalData.record.supervisor_notes;
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
    const tier = getTierInfo(finalScore);
    const displayEl = document.getElementById('eval-overall-score-display');
    if (displayEl) {
        displayEl.textContent = `${finalScore.toFixed(2)} / 5.0 (${tier.label})`;
        displayEl.className = `font-mono font-bold text-sm ${tier.isBelow ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'} px-2.5 py-1 rounded-lg border inline-block`;
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
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Saving Appraisal...</span>';
    }

    try {
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

        const targetGoal = empGoals[0];
        const goalId = document.getElementById('eval-target-goal-id')?.value || (targetGoal ? targetGoal.id : null);

        if (inTrainingScored) {
            try {
                await PerformanceAPI.setNeedsTraining({ employee_id: empId, needs_training: false, retry_count: 3 });
            } catch (err) {
                console.warn('Set retry_count error:', err);
            }
        }

        const saved = await PerformanceAPI.submitAppraisal({
            employee_id: empId,
            goal_id: goalId ? (!isNaN(parseInt(goalId, 10)) ? parseInt(goalId, 10) : null) : undefined,
            supervisor_rating: finalScore,
            new_supervisor_rating: isRetry ? finalScore : undefined,
            is_retry: isRetry,
            criteria_scores: criteriaScores,
            supervisor_notes: supervisorNotes
        });

        if (emp) {
            emp.evaluationStatus = 'Rated';
            emp.supervisorRating = finalScore;
            emp.managerRating = finalScore;
            if (isRetry) {
                emp.newSupervisorRating = finalScore;
            }
            emp.tierLabel = saved.tier_label || getTierInfo(finalScore).label;
            emp.evaluationRecord = saved;
            emp.reviewStatus = 'Pending Calibration';
        }

        updateDbEvaluationRecord(saved);

        if (typeof showToast === 'function') {
            showToast(`🎉 Formal appraisal successfully saved for ${emp ? emp.name : 'Employee'}! (${finalScore.toFixed(2)} / 5.0)`, 'success');
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
        console.error('Appraisal submission error:', err);
        if (typeof showToast === 'function') {
            showToast(err.message || 'Failed to save appraisal.', 'error');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
        }
    }
}
window.handleAppraisalSubmit = handleAppraisalSubmit;

// ============================================================================
// Kudos & Phase Transitions
// ============================================================================

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
    const evalData = getEmployeeEvalData(emp);
    const rating = evalData.record?.calibrated_score
        ? parseFloat(evalData.record.calibrated_score)
        : (evalData.supervisorRating || 4.5);
    const xpPoints = getKudosXP(rating);
    const evalId = evalData.record?.id || null;

    showActionConfirmModal({
        title: 'Send Colleague Kudos & Mark Goal Done',
        message: `Award +${xpPoints} Performance XP to ${emp.name} for achieving ⭐ ${rating.toFixed(2)} / 5.0 rating? This will log points in xp_ledger, disable further kudos, attach the XP transaction to the performance goal, and mark the goal as Done.`,
        confirmBtnText: `Award +${xpPoints} XP & Mark Done`,
        confirmBtnClass: 'btn-primary bg-amber-500 hover:bg-amber-600 text-white',
        iconClass: 'fas fa-award',
        iconContainerClass: 'bg-amber-100 text-amber-700',
        onConfirm: async () => {
            try {
                const res = await PerformanceAPI.awardPerformanceXP(emp.id, xpPoints, evalId, `Performance Kudos (+${xpPoints} XP)`);
                emp.kudosSent = true;
                const expId = res?.exp_id || res?.data?.id || (res?.id ? res.id : null);

                (window.dbGoals || []).forEach(g => {
                    if (isSameEmployee(g.employee_id, emp.id) && (g.status === 'Approved' || g.status === 'Done')) {
                        g.status = 'Done';
                        if (expId) g.exp_id = expId;
                    }
                });

                if (typeof showToast === 'function') {
                    showToast(`🎉 +${xpPoints} XP awarded to ${emp.name}! Performance goal marked as Done.`, 'success');
                }

                if (typeof renderIDPRosterTable === 'function') renderIDPRosterTable();
                if (typeof showIDPDetail === 'function') showIDPDetail(emp.id);
                if (typeof renderCycleRosterTable === 'function') renderCycleRosterTable();
                if (typeof loadAndRenderPlanningGoals === 'function') await loadAndRenderPlanningGoals();
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

function proceedFromPhase4ToPhase5(empId) {
    const targetEmpId = empId || window.selectedEvalEmpId || (window.perfRoster && window.perfRoster[0] ? window.perfRoster[0].id : 'emp-101');
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, targetEmpId)) || (window.perfRoster || [])[0];

    if (typeof closeModal === 'function') {
        closeModal('modal-view-appraisal');
        closeModal('modal-self-assessment');
    }

    if (typeof switchSubTab === 'function') {
        switchSubTab('perf', 'review');
    }

    if (emp) {
        const searchInput = document.getElementById('search-review-emp') || document.getElementById('review-search-input');
        if (searchInput) {
            searchInput.value = emp.name;
        }
        window.reviewSearchQuery = emp.name;
        if (typeof reviewCurrentPage !== 'undefined') reviewCurrentPage = 1;

        if (typeof renderReviewRosterTable === 'function') {
            renderReviewRosterTable();
        }
        if (typeof showCalibrationDetail === 'function') {
            showCalibrationDetail(emp.id, false);
        }
    }
}
window.proceedFromPhase4ToPhase5 = proceedFromPhase4ToPhase5;

