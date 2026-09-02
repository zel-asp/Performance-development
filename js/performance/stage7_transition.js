/**
 * Oxford Suites, Makati — Performance Management Module
 * Sub-Module: Stage 7 — Review, Transition, Formal Training & Plan Deploy
 */

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

    // Stage 7 strictly shows associates who have an uncompleted performance goal AND have a Final Review Rating or Calibrated Rating.
    // If completed, do not show here.
    let roster = (window.perfRoster && window.perfRoster.length > 0) ? window.perfRoster.filter(emp => {
        const empGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, emp.id));
        const hasUncompletedGoal = empGoals.some(g => {
            const st = (g.status || '').toLowerCase().trim();
            return st !== 'completed' && (st === 'approved' || st === 'in progress' || st === 'done');
        });
        if (!hasUncompletedGoal) return false;

        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;

        // 1. Calibrated Rating (from Stage 5 HR Calibration)
        const calibratedScore = (evalRec?.new_calibrated_score && parseFloat(evalRec.new_calibrated_score) > 0)
            ? parseFloat(evalRec.new_calibrated_score)
            : (evalRec?.calibrated_score && parseFloat(evalRec.calibrated_score) > 0 ? parseFloat(evalRec.calibrated_score) : 0);
        const isCalibrated = calibratedScore > 0 && (evalRec?.status === 'Calibrated' || evalRec?.status !== 'Rated');

        // 2. Final Review Rating (from Stage 5 1-on-1 Review or Goal Final Rating)
        const evalFinalRating = evalRec?.final_rating && parseFloat(evalRec.final_rating) > 0 ? parseFloat(evalRec.final_rating) : 0;
        const goalWithFinal = empGoals.find(g => g.final_rating && parseFloat(g.final_rating) > 0);
        const goalFinalRating = goalWithFinal ? parseFloat(goalWithFinal.final_rating) : 0;
        const finalRating = evalFinalRating > 0 ? evalFinalRating : goalFinalRating;

        // Associate MUST have either a calibrated rating OR a final review rating to appear in Stage 7
        return (isCalibrated && calibratedScore > 0) || finalRating > 0;
    }) : [];

    // Search query filter
    if (window.cycleSearchQuery && window.cycleSearchQuery.trim()) {
        const q = window.cycleSearchQuery.toLowerCase().trim();
        roster = roster.filter(emp => (emp.name || '').toLowerCase().includes(q) || (emp.position || '').toLowerCase().includes(q) || (emp.department || '').toLowerCase().includes(q));
    }

    if (roster.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="py-12 text-center text-slate-400">
                    <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg mx-auto font-bold mb-2">
                        <i class="fas fa-rotate"></i>
                    </div>
                    <p class="text-sm font-semibold text-slate-600">No Associates in Transition Roster</p>
                    <p class="text-xs text-slate-400 mt-1">Complete Stage 4-6 evaluations and IDP first to initiate next cycle transitions.</p>
                </td>
            </tr>
        `;
        showEmptyCycleDetail();
        renderPaginationControls('cycle-pagination-container', 1, 0, cyclePageSize, 'setCyclePage', 'setCyclePageSize');
        return;
    }

    const isAll = cyclePageSize === 'all';
    const effectivePageSize = isAll ? roster.length : cyclePageSize;
    const totalPages = isAll ? 1 : (Math.ceil(roster.length / effectivePageSize) || 1);
    if (cycleCurrentPage > totalPages) {
        cycleCurrentPage = totalPages;
    }
    if (cycleCurrentPage < 1) {
        cycleCurrentPage = 1;
    }

    const startIdx = isAll ? 0 : (cycleCurrentPage - 1) * effectivePageSize;
    const pageList = isAll ? roster : roster.slice(startIdx, startIdx + effectivePageSize);

function checkEmployeeStage7Tasks(empId) {
    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Done') && isSameEmployee(g.employee_id, empId));
    let totalTasks = 0;
    let completedTasks = 0;
    empGoals.forEach(g => {
        (g.tasks || []).forEach(t => {
            totalTasks++;
            if (t.status === 'completed') completedTasks++;
        });
    });
    const allTasksDone = totalTasks > 0 ? (completedTasks === totalTasks) : true;
    return {
        allTasksDone,
        totalTasks,
        completedTasks
    };
}
window.checkEmployeeStage7Tasks = checkEmployeeStage7Tasks;

    container.innerHTML = pageList.map((emp, idx) => {
        const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Done' || g.status === 'Completed') && isSameEmployee(g.employee_id, emp.id));
        const doneGoal = empGoals.find(g => g.status === 'Done' || g.status === 'Completed' || !!g.exp_id);
        const isGoalDone = !!doneGoal;

        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;

        const calibratedScore = (evalRec?.new_calibrated_score && parseFloat(evalRec.new_calibrated_score) > 0)
            ? parseFloat(evalRec.new_calibrated_score)
            : (evalRec?.calibrated_score && parseFloat(evalRec.calibrated_score) > 0 ? parseFloat(evalRec.calibrated_score) : 0);
        const isCalibrated = calibratedScore > 0 && (evalRec?.status === 'Calibrated' || evalRec?.status !== 'Rated');

        const evalFinalRating = evalRec?.final_rating && parseFloat(evalRec.final_rating) > 0 ? parseFloat(evalRec.final_rating) : 0;
        const goalWithFinal = empGoals.find(g => g.final_rating && parseFloat(g.final_rating) > 0);
        const goalFinalRating = goalWithFinal ? parseFloat(goalWithFinal.final_rating) : 0;
        const finalRating = evalFinalRating > 0 ? evalFinalRating : goalFinalRating;

        const score = isCalibrated && calibratedScore > 0 ? calibratedScore : (finalRating > 0 ? finalRating : 0);
        const hasPassed = score >= 3.0 || isGoalDone;
        const retryCount = getEmployeeRetryCount(emp.id);
        const isExceededRetry = retryCount >= 3 && !hasPassed;
        const ratingLabel = isCalibrated ? 'Calibrated' : 'Final Review';

        // Draft plan summary from cache
        const draftData = window.dbDraftPlans?.[emp.id] || {};
        const draftTotal = draftData.total || 0;
        const draftTaskCount = draftData.task_count || 0;
        const draftBookCount = draftData.book_count || 0;
        const hasDraft = draftTotal > 0;

        const taskCheck = checkEmployeeStage7Tasks(emp.id);
        const allTasksDone = taskCheck.allTasksDone;

        return `
            <tr class="hover:bg-slate-50 transition text-xs border-b border-slate-100">
                <td class="px-3 py-4 text-center font-mono font-bold text-slate-400 text-xs">
                    ${startIdx + idx + 1}
                </td>
                <td class="px-5 py-4 font-bold text-slate-900">
                    <span class="max-w-[160px] truncate block" title="${emp.name}">${emp.name}</span>
                </td>
                <td class="px-5 py-4 text-slate-500 max-w-[130px] truncate" title="${emp.department}">${emp.department}</td>
                <td class="px-5 py-4 font-bold ${isExceededRetry ? 'text-rose-700' : (hasPassed ? 'text-emerald-700' : 'text-rose-600')}">
                    <i class="fas fa-star text-amber-500 mr-1 text-[10px]"></i>${score.toFixed(2)} / 5.0 (${evalRec?.tier_label || (hasPassed ? ratingLabel : 'Needs PIP')})
                </td>
                <td class="px-5 py-4">
                    <div class="flex flex-col space-y-1">
                        ${isExceededRetry ? `
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-700 text-white shadow-xs">
                                <i class="fas fa-circle-xmark mr-1"></i> FAILED — Transition Suspended
                            </span>
                        ` : `
                            <div class="flex items-center space-x-1.5 flex-wrap gap-1">
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${hasPassed ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}">
                                    ${hasPassed ? '<i class="fas fa-check mr-1 text-teal-700"></i>Qualified for Next Cycle' : 'Action Plan Incomplete'}
                                </span>
                                ${isGoalDone ? `
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-flex items-center">
                                        <i class="fas fa-award text-amber-500 mr-1 text-[9px]"></i>Done (Kudos Sent)
                                    </span>
                                ` : `
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                        Approved
                                    </span>
                                `}
                            </div>
                        `}
                        ${hasDraft ? `
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 inline-flex items-center space-x-1">
                                <i class="fas fa-clipboard-list text-[9px]"></i>
                                <span>Draft Plan: ${draftTaskCount} task${draftTaskCount !== 1 ? 's' : ''}, ${draftBookCount} book${draftBookCount !== 1 ? 's' : ''}</span>
                            </span>
                        ` : ''}
                    </div>
                </td>
                <td class="px-5 py-4 text-right">
                    <div class="flex items-center justify-end space-x-1.5">
                        ${hasDraft ? `
                            <button onclick="deployDraftPlan('${emp.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-1" title="Deploy draft plan to live tasks & LMS">
                                <i class="fas fa-rocket text-[10px]"></i>
                                <span>Deploy</span>
                            </button>
                        ` : ''}
                        ${isGoalDone ? `
                            <button onclick="confirmRevertGoalKudos('${emp.id}', '${doneGoal ? doneGoal.id : ''}')" class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-xl text-xs shadow-2xs transition flex items-center space-x-1" title="Revert Kudos XP and reset goal status to Approved">
                                <i class="fas fa-rotate-left text-amber-600"></i>
                                <span>Revert</span>
                            </button>
                        ` : ''}
                        ${isExceededRetry ? `
                            <button onclick="showCycleDetail('${emp.id}', true)" class="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs shadow-xs transition">
                                1-on-1 Remand
                            </button>
                        ` : (hasPassed ? (allTasksDone ? `
                            <button onclick="showCycleDetail('${emp.id}', true)" class="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs shadow-xs transition">
                                View Rollover
                            </button>
                        ` : `
                            <button disabled title="Monitoring tasks are incomplete (${taskCheck.completedTasks}/${taskCheck.totalTasks} completed in Stage 3). Complete all monitoring tasks before cycle rollover." class="px-3.5 py-1.5 bg-slate-200 text-slate-400 border border-slate-300 font-bold rounded-xl text-xs cursor-not-allowed inline-flex items-center space-x-1">
                                <i class="fas fa-lock text-[10px]"></i>
                                <span>Rollover (Locked)</span>
                            </button>
                        `) : `
                            <button onclick="showCycleDetail('${emp.id}', true)" class="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition">
                                Review Plan
                            </button>
                        `)}
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    renderPaginationControls('cycle-pagination-container', cycleCurrentPage, roster.length, cyclePageSize, 'setCyclePage', 'setCyclePageSize');

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
    cycleCurrentPage = 1;
    renderCycleRosterTable();
};

/**
 * Deploy all draft plan items for an employee (Phase 7).
 * Copies task rows → performance_tasks, lms_book rows → lms_prescribed,
 * then marks them all as Committed in performance_development_plans.
 */
window.deployDraftPlan = async function(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || { name: 'Associate' };
    const draftData = window.dbDraftPlans?.[empId] || {};
    const total = draftData.total || 0;

    if (total === 0) {
        if (typeof showToast === 'function') showToast('No draft plan items to deploy for this employee.', 'info');
        return;
    }

    // Find active goal for the employee
    const activeGoal = (window.dbGoals || []).find(g =>
        isSameEmployee(g.employee_id, empId) && (g.status === 'Approved' || g.status === 'In Progress')
    );
    const goalId = activeGoal ? activeGoal.id : null;

    if (typeof showToast === 'function') {
        showToast(`🚀 Deploying ${total} draft item(s) for ${emp.name}...`, 'info');
    }

    try {
        const result = await PerformanceAPI.deployDevelopmentPlan(empId, goalId);

        // Clear local cache
        window.dbDraftPlans[empId] = { tasks: [], lms_books: [], task_count: 0, book_count: 0, total: 0 };

        if (typeof showToast === 'function') {
            showToast(
                `✅ Plan deployed! ${result.tasks_deployed || 0} task(s) → performance_tasks, ${result.books_deployed || 0} book(s) → lms_prescribed for ${emp.name}.`,
                'success'
            );
        }

        // Reload all data to reflect the newly deployed tasks/books
        await loadAndRenderPlanningGoals();
        if (typeof loadAndRenderMonitoringData === 'function') {
            await loadAndRenderMonitoringData();
        }
        renderCycleRosterTable();
    } catch (err) {
        console.error('Error deploying draft plan:', err);
        if (typeof showToast === 'function') {
            showToast(`Error deploying plan: ${err.message || 'Server error'}`, 'error');
        }
    }
};

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

    const empGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, emp.id));
    const hasUncompletedGoal = empGoals.some(g => (g.status || '').toLowerCase().trim() !== 'completed');
    if (!hasUncompletedGoal) {
        showEmptyCycleDetail();
        return;
    }

    const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
    const doneGoal = empGoals.find(g => g.status === 'Done' || !!g.exp_id);
    const isGoalDone = !!doneGoal;

    const calibratedScore = (evalRec?.new_calibrated_score && parseFloat(evalRec.new_calibrated_score) > 0)
        ? parseFloat(evalRec.new_calibrated_score)
        : (evalRec?.calibrated_score && parseFloat(evalRec.calibrated_score) > 0 ? parseFloat(evalRec.calibrated_score) : 0);
    const isCalibrated = calibratedScore > 0 && (evalRec?.status === 'Calibrated' || evalRec?.status !== 'Rated');

    const evalFinalRating = evalRec?.final_rating && parseFloat(evalRec.final_rating) > 0 ? parseFloat(evalRec.final_rating) : 0;
    const goalWithFinal = empGoals.find(g => g.final_rating && parseFloat(g.final_rating) > 0);
    const goalFinalRating = goalWithFinal ? parseFloat(goalWithFinal.final_rating) : 0;
    const finalRating = evalFinalRating > 0 ? evalFinalRating : goalFinalRating;

    const effectiveScore = isCalibrated && calibratedScore > 0 ? calibratedScore : (finalRating > 0 ? finalRating : 0);

    if (effectiveScore === 0) {
        showEmptyCycleDetail();
        return;
    }

    window.selectedEvalEmpId = emp.id;
    const retryCount = typeof getEmployeeRetryCount === 'function' ? getEmployeeRetryCount(emp.id) : 0;
    const hasPassed = effectiveScore >= 3.0 || isGoalDone;
    const isExceededRetry = retryCount >= 3 && !hasPassed;
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
                                    <i class="fas fa-circle-xmark mr-1"></i> PERFORMANCE GOAL FAILED
                                </span>
                                <h4 class="font-heading font-bold text-base text-rose-950 mt-0.5">Objective Concluded as Failed: ${emp.name}</h4>
                            </div>
                        </div>
                        <span class="text-xl font-bold text-rose-800 font-mono"><i class="fas fa-star text-amber-500 mr-1 text-base"></i>${effectiveScore.toFixed(2)} / 5.00</span>
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
        } else if (hasPassed) {
            const taskCheck = checkEmployeeStage7Tasks(emp.id);
            const allTasksDone = taskCheck.allTasksDone;

            transitionCard.innerHTML = `
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <span class="badge-sage">Continuous Growth Metric</span>
                        <h4 class="font-heading font-bold text-lg text-slate-900 mt-1">Development to Performance Transfer: ${emp.name}</h4>
                    </div>
                    <span class="text-2xl font-bold text-sage-dark font-heading font-mono"><i class="fas fa-star text-amber-500 mr-1 text-lg"></i>${effectiveScore.toFixed(2)} / 5.0</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">
                    By completing the 2026 Q3 performance evaluation and IDP commitments, <strong>${emp.name}</strong> achieved a <strong>${evalRec?.tier_label || (isCalibrated ? 'Calibrated' : 'Proficient')}</strong> rating (${effectiveScore.toFixed(2)} / 5.0). These validated competencies will form the elevated baseline for the upcoming <strong>2026 Q4 Cycle</strong>.
                </p>
                <div class="pt-3 border-t border-[#E8DEDC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span class="text-xs text-slate-500">
                        ${allTasksDone ? '<i class="fas fa-check text-sage-dark mr-1.5"></i> All 7 lifecycle phases completed for 2026 Q3' : `<i class="fas fa-triangle-exclamation text-amber-500 mr-1.5"></i> Monitoring tasks incomplete (${taskCheck.completedTasks}/${taskCheck.totalTasks} completed)`}
                    </span>
                    <div class="flex items-center space-x-2">
                        ${isGoalDone ? `
                            <button onclick="confirmRevertGoalKudos('${emp.id}', '${doneGoal ? doneGoal.id : ''}')" class="px-4 py-2.5 text-xs font-bold transition flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl" title="Revert Kudos XP and reset goal to Approved">
                                <i class="fas fa-rotate-left text-amber-600"></i>
                                <span>Revert Kudos</span>
                            </button>
                        ` : ''}
                        ${allTasksDone ? `
                            <button id="btn-mark-cycle-completed" onclick="confirmMarkGoalCompleted('${emp.id}')" class="btn-primary px-5 py-2.5 text-xs font-bold transition flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                                <i class="fas fa-circle-check text-xs"></i>
                                <span>Mark as Completed</span>
                            </button>
                        ` : `
                            <button id="btn-mark-cycle-completed" disabled title="Monitoring tasks are incomplete (${taskCheck.completedTasks}/${taskCheck.totalTasks} completed in Stage 3). Complete all tasks in Stage 3 first." class="px-5 py-2.5 text-xs font-bold transition flex items-center space-x-2 bg-slate-200 text-slate-400 border border-slate-300 rounded-xl cursor-not-allowed">
                                <i class="fas fa-lock text-xs"></i>
                                <span>Mark as Completed (Tasks Incomplete)</span>
                            </button>
                        `}
                    </div>
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
                                    <i class="fas fa-gavel mr-1"></i> Final Attempt #4 Active
                                </span>
                                <h4 class="font-heading font-bold text-base text-rose-950 mt-0.5">Final 1-on-1 Evaluation (Last Attempt): ${emp.name}</h4>
                            </div>
                        </div>
                        <span class="text-xl font-bold text-rose-800 font-mono"><i class="fas fa-star text-amber-500 mr-1 text-base"></i>${effectiveScore.toFixed(2)} / 5.0</span>
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
                                    <i class="fas fa-handshake-angle mr-1"></i> Needs 1-on-1 Training (Retry #3 Exhausted)
                                </span>
                                <h4 class="font-heading font-bold text-base text-rose-950 mt-0.5">Mandatory 1-on-1 Mentorship Required: ${emp.name}</h4>
                            </div>
                        </div>
                        <span class="text-xl font-bold text-rose-800 font-mono"><i class="fas fa-star text-amber-500 mr-1 text-base"></i>${effectiveScore.toFixed(2)} / 5.0</span>
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
                        <span class="text-xl font-bold text-rose-700 font-mono"><i class="fas fa-star text-amber-500 mr-1 text-base"></i>${effectiveScore.toFixed(2)} / 5.0</span>
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
                const draftData = window.dbDraftPlans?.[emp.id] || {};
                const draftTotal = draftData.total || 0;
                const draftTaskCount = draftData.task_count || 0;
                const draftBookCount = draftData.book_count || 0;
                const hasDraft = draftTotal > 0;

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
                            <span class="text-xl font-bold text-amber-800 font-mono"><i class="fas fa-star text-amber-500 mr-1 text-base"></i>${effectiveScore.toFixed(2)} / 5.0</span>
                        </div>
                        <p class="text-slate-700 leading-relaxed text-xs">
                            Associate score is below the required 3.0 benchmark. To ensure standard compliance before rollover, review assigned action tasks, reset completed items for employee re-execution in Stage 3 Monitoring, or flag as Needs Training.
                        </p>

                        ${hasDraft ? `
                            <!-- Staged Performance Development Plan Card -->
                            <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 shadow-2xs space-y-2">
                                <div class="flex items-center justify-between flex-wrap gap-2">
                                    <div class="flex items-center space-x-2">
                                        <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                                            <i class="fas fa-clipboard-list"></i>
                                        </div>
                                        <div>
                                            <p class="font-bold text-slate-900 text-xs">Stage 6 Performance Development Plan (Draft Staged)</p>
                                            <p class="text-[10px] text-slate-500">${draftTaskCount} Action Task(s) · ${draftBookCount} LMS Handbook(s) staged in Stage 6</p>
                                        </div>
                                    </div>
                                    <button onclick="deployDraftPlan('${emp.id}')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1">
                                        <i class="fas fa-rocket text-[10px]"></i>
                                        <span>Deploy Plan</span>
                                    </button>
                                </div>
                            </div>
                        ` : ''}

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

    const renderProgramsList = (programs) => {
        if (!container) return;
        if (!programs || programs.length === 0) {
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
                            <h5 class="font-heading font-bold text-slate-900 text-sm">${p.title || p.name}</h5>
                            <p class="text-slate-600 text-xs leading-relaxed">${p.description || 'Targeted training curriculum with practical modules and evaluation quiz.'}</p>
                        </div>
                        <div class="text-right flex-shrink-0 self-start sm:self-auto">
                            <span class="font-bold text-slate-800 text-xs block">Benchmark: <i class="fas fa-star text-amber-500 mr-0.5 text-[10px]"></i>${targetBenchmark} / 5.0</span>
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
    };

    if (window.dbTrainingPrograms && window.dbTrainingPrograms.length > 0) {
        renderProgramsList(window.dbTrainingPrograms);
    } else if (container) {
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
        renderProgramsList(programs);
    } catch (err) {
        console.error('Error loading training programs:', err);
        if (container && (!window.dbTrainingPrograms || window.dbTrainingPrograms.length === 0)) {
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

async function openReviewTasksModal(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || (window.perfRoster || [])[0];
    if (!emp) return;

    window.selectedEvalEmpId = emp.id;

    const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
    const isCalibrated = evalRec && (evalRec.status === 'Calibrated' || (evalRec.calibrated_score !== null && evalRec.calibrated_score !== undefined && evalRec.status !== 'Rated'));
    const score = isCalibrated && evalRec.calibrated_score ? parseFloat(evalRec.calibrated_score) : (parseFloat(emp.supervisorRating || 0));

    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Completed') && isSameEmployee(g.employee_id, emp.id));
    const retryCount = empGoals.reduce((max, g) => Math.max(max, parseInt(g.retry_count || 0)), 0);
    const needsTraining = empGoals.some(g => !!g.needs_training) || retryCount > 2;

    const titleEl = document.getElementById('modal-review-tasks-title');
    const avatarEl = document.getElementById('review-tasks-avatar');
    const empNameEl = document.getElementById('review-tasks-emp-name');
    const empRoleEl = document.getElementById('review-tasks-emp-role');
    const scorePillEl = document.getElementById('review-tasks-score-pill');
    const devPlanContainer = document.getElementById('review-plan-dev-plan-container');
    const listEl = document.getElementById('review-tasks-list-container') || document.getElementById('review-tasks-modal-list');
    const footerActions = document.getElementById('review-tasks-footer-actions');

    // Populate Associate Header Card
    if (titleEl) {
        titleEl.innerHTML = `Review Plan &amp; Tasks: ${emp.name} <span class="ml-2 text-xs font-mono font-normal px-2 py-0.5 rounded-full ${needsTraining ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">Retry: ${retryCount} · Needs Training: ${needsTraining ? 'True' : 'False'}</span>`;
    }
    if (avatarEl) {
        const initials = (emp.name || 'EM').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        avatarEl.textContent = initials;
    }
    if (empNameEl) empNameEl.textContent = emp.name;
    if (empRoleEl) empRoleEl.textContent = `${emp.position || 'Associate'} · ${emp.department || 'Property-Wide'}`;
    if (scorePillEl) {
        scorePillEl.innerHTML = `<i class="fas fa-star text-amber-500 mr-1"></i>${score > 0 ? score.toFixed(2) : '0.00'} / 5.0 (${evalRec?.tier_label || (score >= 3.0 ? 'Proficient' : 'Developing')})`;
        scorePillEl.className = `px-2.5 py-1 rounded-full text-[10px] font-bold border font-mono ${score >= 3.0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`;
    }

    // Load Development Plan Drafts (Stage 6)
    let draftSummary = window.dbDraftPlans?.[emp.id];
    if (!draftSummary && typeof loadDraftSummary === 'function') {
        draftSummary = await loadDraftSummary(emp.id);
    }
    const draftTasks = draftSummary?.tasks || [];
    const draftBooks = draftSummary?.lms_books || [];
    const hasDraft = (draftTasks.length + draftBooks.length) > 0;

    // Render Staged Performance Development Plan
    if (devPlanContainer) {
        if (hasDraft) {
            devPlanContainer.innerHTML = `
                <div class="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200/80 space-y-3">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                                <i class="fas fa-clipboard-list"></i>
                            </div>
                            <div>
                                <h5 class="font-bold text-slate-900 text-xs">Stage 6 Performance Development Plan (Draft Staged)</h5>
                                <p class="text-[10px] text-slate-500">Staged during Phase 6 IDP planning. Ready to deploy into active execution.</p>
                            </div>
                        </div>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                            ${draftTasks.length} Draft Task(s) · ${draftBooks.length} LMS Book(s)
                        </span>
                    </div>

                    <!-- Draft Tasks & Books Cards -->
                    <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                        ${draftTasks.map(t => `
                            <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
                                <div class="space-y-0.5 min-w-0">
                                    <div class="flex items-center space-x-1.5">
                                        <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Draft Action Task</span>
                                        <span class="text-[10px] text-slate-400 font-mono">${t.target_date || 'Due in 2 wks'}</span>
                                    </div>
                                    <p class="font-bold text-slate-900 text-xs truncate">${t.title}</p>
                                    <p class="text-[10px] text-slate-500 truncate">${t.description || 'Action item to be deployed to performance_tasks'}</p>
                                </div>
                                <span class="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg font-bold flex-shrink-0">
                                    Pending Deploy
                                </span>
                            </div>
                        `).join('')}

                        ${draftBooks.map(b => `
                            <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
                                <div class="space-y-0.5 min-w-0">
                                    <div class="flex items-center space-x-1.5">
                                        <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Draft LMS Handbook</span>
                                        <span class="text-[10px] text-slate-400 font-mono">10% Formal LMS</span>
                                    </div>
                                    <p class="font-bold text-slate-900 text-xs truncate">${b.title || 'LMS Training Manual'}</p>
                                    <p class="text-[10px] text-slate-500 truncate">Doc ID: ${b.lms_document_id || 'N/A'} · Status: Needs Retake on deploy</p>
                                </div>
                                <span class="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg font-bold flex-shrink-0">
                                    Pending Enroll
                                </span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px]">
                        <span class="text-indigo-900 font-medium"><i class="fas fa-circle-info mr-1 text-indigo-600"></i> Deploying copies tasks to <code>performance_tasks</code> &amp; handbooks to <code>lms_prescribed</code>.</span>
                        <button onclick="deployDraftPlanFromModal('${emp.id}')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1">
                            <i class="fas fa-rocket text-[10px]"></i>
                            <span>Deploy Draft Plan Now</span>
                        </button>
                    </div>
                </div>
            `;
        } else {
            devPlanContainer.innerHTML = `
                <div class="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs text-slate-500">
                    <span class="flex items-center space-x-2">
                        <i class="fas fa-clipboard-check text-slate-400"></i>
                        <span>No uncommitted Stage 6 development plan drafts staged for this associate.</span>
                    </span>
                    <button onclick="closeModal('modal-review-tasks'); if(typeof switchSubTab==='function') switchSubTab('perf', 'idp'); if(typeof showIDPDetail==='function') showIDPDetail('${emp.id}', true);" class="text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center space-x-1">
                        <span>+ Open Stage 6 IDP Planner</span>
                        <i class="fas fa-arrow-right text-[10px]"></i>
                    </button>
                </div>
            `;
        }
    }

    // Render Active Goal Tasks
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
                                <button onclick="resetTaskForGoal('${t.id}', '${emp.id}', this)" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs border border-amber-200 transition flex items-center space-x-1" title="Reset to pending so employee can re-do task">
                                    <i class="fas fa-rotate-left"></i>
                                    <span>Reset to Re-Do</span>
                                </button>
                            ` : ''}
                            <button onclick="deleteTaskFromGoal('${t.id}', '${emp.id}', this)" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition" title="Delete obsolete task">
                                <i class="fas fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            listEl.innerHTML = `
                <div class="p-6 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-slate-200">
                    No active tasks assigned yet under goals.
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
        } else if (hasDraft) {
            footerActions.innerHTML = `
                <button onclick="deployAndProceedToMonitoring('${emp.id}')" class="btn-primary px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 border-emerald-600 shadow-xs flex items-center space-x-2">
                    <i class="fas fa-rocket"></i>
                    <span>Deploy Plan &amp; Proceed to Monitoring (Stage 3)</span>
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
 * Deploy draft plan directly from within Review Tasks modal and refresh modal
 */
async function deployDraftPlanFromModal(empId) {
    if (typeof deployDraftPlan === 'function') {
        await deployDraftPlan(empId);
        // Refresh review modal content
        await openReviewTasksModal(empId);
    }
}
window.deployDraftPlanFromModal = deployDraftPlanFromModal;

/**
 * Deploy draft plan and immediately transition to Stage 3 monitoring
 */
async function deployAndProceedToMonitoring(empId) {
    if (typeof deployDraftPlan === 'function') {
        await deployDraftPlan(empId);
    }
    await proceedFromTasksToMonitoring();
}
window.deployAndProceedToMonitoring = deployAndProceedToMonitoring;


/**
 * Reset a task back to pending for employee re-execution
 */
async function resetTaskForGoal(taskId, empId, btnEl = null) {
    let origHtml = '';
    if (btnEl) {
        origHtml = btnEl.innerHTML;
        btnEl.disabled = true;
        btnEl.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i><span>Resetting...</span>';
    }
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
    } finally {
        if (btnEl) {
            btnEl.disabled = false;
            btnEl.innerHTML = origHtml;
        }
    }
}
window.resetTaskForGoal = resetTaskForGoal;

/**
 * Delete an action task from a goal
 */
async function deleteTaskFromGoal(taskId, empId, btnEl = null) {
    showActionConfirmModal({
        title: 'Delete Action Task',
        message: 'Are you sure you want to delete this action task from the objective?',
        confirmBtnText: 'Delete Task',
        confirmBtnClass: 'btn-danger bg-rose-600 hover:bg-rose-700 text-white',
        iconClass: 'fas fa-trash-can',
        iconContainerClass: 'bg-rose-100 text-rose-700',
        onConfirm: async () => {
            let origHtml = '';
            if (btnEl) {
                origHtml = btnEl.innerHTML;
                btnEl.disabled = true;
                btnEl.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i>';
            }
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
            } finally {
                if (btnEl) {
                    btnEl.disabled = false;
                    btnEl.innerHTML = origHtml;
                }
            }
        }
    });
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
        displayEl.innerHTML = `<i class="fas fa-star text-amber-500 mr-1 text-xl"></i>${avg.toFixed(2)} / 5.00`;
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

/**
 * Handle Revert Goal Kudos in Phase 7
 */
async function confirmRevertGoalKudos(empId, goalId = null) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || { id: empId, name: 'Associate' };
    const empGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, emp.id));
    const targetGoal = empGoals.find(g => (goalId ? String(g.id) === String(goalId) : (g.status === 'Done' || g.status === 'Completed' || !!g.exp_id))) || empGoals[0];

    showActionConfirmModal({
        title: 'Revert Kudos & Reset Goal Status',
        message: `Are you sure you want to revert kudos for ${emp.name}? This will delete the XP entry from the ledger, deduct awarded points from the user's XP balance, and reset the goal status back to 'Approved'.`,
        confirmBtnText: 'Revert Kudos & Reset Status',
        confirmBtnClass: 'btn-primary bg-amber-600 hover:bg-amber-700 text-white',
        iconClass: 'fas fa-rotate-left',
        iconContainerClass: 'bg-amber-100 text-amber-700',
        onConfirm: async () => {
            try {
                await PerformanceAPI.revertGoalKudos(emp.id, targetGoal ? targetGoal.id : goalId);

                // Update local memory
                (window.dbGoals || []).forEach(g => {
                    if (isSameEmployee(g.employee_id, emp.id) && (g.status === 'Done' || g.status === 'Completed' || (targetGoal && String(g.id) === String(targetGoal.id)))) {
                        g.status = 'Approved';
                        g.exp_id = null;
                    }
                });

                emp.kudosSent = false;

                if (typeof showToast === 'function') {
                    showToast(`Kudos reverted for ${emp.name}. Goal status reset to Approved.`, 'success');
                }

                renderCycleRosterTable();
                showCycleDetail(emp.id);
                if (typeof renderIDPRosterTable === 'function') renderIDPRosterTable();
                if (typeof showIDPDetail === 'function') showIDPDetail(emp.id);
                if (typeof loadAndRenderPlanningGoals === 'function') await loadAndRenderPlanningGoals();
            } catch (err) {
                console.error('Error reverting goal kudos:', err);
                if (typeof showToast === 'function') {
                    showToast(err.message || 'Failed to revert kudos.', 'error');
                }
            }
        }
    });
}
window.confirmRevertGoalKudos = confirmRevertGoalKudos;

/**
 * Handle Mark Goal Completed in Phase 7 with task completion gate & Kudos award prompt
 */
async function confirmMarkGoalCompleted(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));
    if (!emp) return;

    const taskCheck = checkEmployeeStage7Tasks(emp.id);
    if (!taskCheck.allTasksDone) {
        if (typeof showToast === 'function') {
            showToast(`⚠️ Cannot complete cycle for ${emp.name}: Monitoring tasks are still incomplete (${taskCheck.completedTasks}/${taskCheck.totalTasks} completed). Complete all tasks in Stage 3 Continuous Monitoring first.`, 'warning');
        }
        return;
    }

    const empGoals = (window.dbGoals || []).filter(g => (g.status === 'Approved' || g.status === 'Done' || g.status === 'Completed' || g.status === 'In Progress') && isSameEmployee(g.employee_id, emp.id));
    if (empGoals.length === 0) {
        if (typeof showToast === 'function') {
            showToast(`No active goals found for ${emp.name}.`, 'info');
        }
        return;
    }

    const hasKudos = empGoals.some(g => g.status === 'Done' || g.status === 'Completed' || !!g.exp_id) || !!emp.kudosSent;

    // If Kudos was not awarded yet, display the interactive modal prompt
    if (!hasKudos) {
        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const rating = evalRec?.new_calibrated_score || evalRec?.calibrated_score || evalRec?.supervisor_rating || emp.calibratedScore || emp.supervisorRating || 4.5;
        const xpPoints = getKudosXP(rating);
        const targetGoal = empGoals[0];

        const promptTitleEl = document.getElementById('phase7-kudos-prompt-title');
        const promptMsgEl = document.getElementById('phase7-kudos-prompt-msg');
        const ptsDisplayEl = document.getElementById('phase7-kudos-pts-display');

        if (promptTitleEl) promptTitleEl.textContent = 'Award Kudos Before Completion?';
        if (promptMsgEl) promptMsgEl.innerHTML = `This goal for <strong>${emp.name}</strong> has not been awarded with Kudos XP yet.<br>Would you like to award Kudos points and mark the goal as Completed?`;
        if (ptsDisplayEl) ptsDisplayEl.textContent = `+${xpPoints} XP (${parseFloat(rating).toFixed(2)} Rating)`;

        const btnYes = document.getElementById('btn-p7-award-and-complete');
        const btnNo = document.getElementById('btn-p7-complete-only');

        if (btnYes) {
            btnYes.disabled = false;
            btnYes.innerHTML = '<i class="fas fa-award"></i><span>Yes, Award Kudos &amp; Complete</span>';
            btnYes.onclick = async function() {
                btnYes.disabled = true;
                if (btnNo) btnNo.disabled = true;
                btnYes.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i><span>Awarding &amp; Completing...</span>';
                try {
                    const res = await PerformanceAPI.awardPerformanceXP(emp.id, xpPoints, evalRec?.id, `Performance Kudos (+${xpPoints} XP)`, targetGoal ? targetGoal.id : null);
                    const expId = res?.exp_id || res?.data?.id || (res?.id ? res.id : null);
                    emp.kudosSent = true;

                    for (const g of empGoals) {
                        await PerformanceAPI.updateGoalStatus(g.id, 'Completed', 'Performance cycle concluded with Kudos awarded.');
                        g.status = 'Completed';
                        if (expId) g.exp_id = expId;
                    }

                    closeModal('modal-phase7-kudos-prompt');
                    if (typeof showToast === 'function') {
                        showToast(`🎉 +${xpPoints} XP awarded and goal successfully marked as Completed for ${emp.name}!`, 'success');
                    }

                    await loadAndRenderPlanningGoals();
                    if (typeof loadAndRenderMonitoringData === 'function') {
                        await loadAndRenderMonitoringData();
                    }
                    renderCycleRosterTable();
                    showCycleDetail(emp.id);
                    if (typeof renderIDPRosterTable === 'function') renderIDPRosterTable();
                } catch (err) {
                    console.error('Error awarding kudos & completing:', err);
                    if (typeof showToast === 'function') {
                        showToast(err.message || 'Failed to award kudos & complete.', 'error');
                    }
                } finally {
                    btnYes.disabled = false;
                    btnYes.innerHTML = '<i class="fas fa-award"></i><span>Yes, Award Kudos &amp; Complete</span>';
                    if (btnNo) btnNo.disabled = false;
                }
            };
        }

        if (btnNo) {
            btnNo.disabled = false;
            btnNo.innerHTML = '<i class="fas fa-check"></i><span>No, Mark as Complete Only</span>';
            btnNo.onclick = async function() {
                btnNo.disabled = true;
                if (btnYes) btnYes.disabled = true;
                btnNo.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i><span>Completing Goal...</span>';
                try {
                    for (const g of empGoals) {
                        await PerformanceAPI.updateGoalStatus(g.id, 'Completed', 'Performance cycle concluded without kudos.');
                        g.status = 'Completed';
                    }

                    closeModal('modal-phase7-kudos-prompt');
                    if (typeof showToast === 'function') {
                        showToast(`Goal successfully marked as Completed for ${emp.name}.`, 'success');
                    }

                    await loadAndRenderPlanningGoals();
                    if (typeof loadAndRenderMonitoringData === 'function') {
                        await loadAndRenderMonitoringData();
                    }
                    renderCycleRosterTable();
                    showCycleDetail(emp.id);
                    if (typeof renderIDPRosterTable === 'function') renderIDPRosterTable();
                } catch (err) {
                    console.error('Error completing goal:', err);
                    if (typeof showToast === 'function') {
                        showToast(err.message || 'Failed to complete goal.', 'error');
                    }
                } finally {
                    btnNo.disabled = false;
                    btnNo.innerHTML = '<i class="fas fa-check"></i><span>No, Mark as Complete Only</span>';
                    if (btnYes) btnYes.disabled = false;
                }
            };
        }

        openModal('modal-phase7-kudos-prompt');
        return;
    }

    // If Kudos was already awarded previously, show standard confirmation modal
    showActionConfirmModal({
        title: 'Mark Goal as Completed',
        message: `Mark the performance goal for ${emp.name} as Completed? This will conclude the 2026 Q3 review cycle.`,
        confirmBtnText: 'Complete Goal',
        confirmBtnClass: 'btn-primary bg-emerald-600 hover:bg-emerald-700 text-white',
        iconClass: 'fas fa-circle-check',
        iconContainerClass: 'bg-emerald-100 text-emerald-700',
        onConfirm: async () => {
            try {
                for (const g of empGoals) {
                    await PerformanceAPI.updateGoalStatus(g.id, 'Completed', 'Performance cycle concluded successfully.');
                    g.status = 'Completed';
                }

                if (typeof showToast === 'function') {
                    showToast(`🎉 2026 Q3 Performance Cycle successfully marked as Completed for ${emp.name}!`, 'success');
                }

                await loadAndRenderPlanningGoals();
                if (typeof loadAndRenderMonitoringData === 'function') {
                    await loadAndRenderMonitoringData();
                }
                renderCycleRosterTable();
                showCycleDetail(emp.id);
                if (typeof renderIDPRosterTable === 'function') renderIDPRosterTable();
            } catch (err) {
                console.error('Error marking goal completed:', err);
                if (typeof showToast === 'function') {
                    showToast(err.message || 'Failed to finalize cycle.', 'error');
                }
            }
        }
    });
}
window.confirmMarkGoalCompleted = confirmMarkGoalCompleted;
