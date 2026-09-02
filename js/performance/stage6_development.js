/**
 * Oxford Suites, Makati — Performance Management Module
 * Sub-Module: Stage 6 — IDP Development Planning (70-20-10) & Draft Staging
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

    const isCalibrated = evalRec && (evalRec.status === 'Calibrated' || (evalRec.calibrated_score !== null && evalRec.calibrated_score !== undefined && evalRec.status !== 'Rated'));
    const rawScore = isCalibrated && evalRec.calibrated_score ? parseFloat(evalRec.calibrated_score) : 0;
    const isPIP = rawScore > 0 && rawScore < 3.0;
    const retryCount = getEmployeeRetryCount(emp.id);
    const isExceededRetry = retryCount >= 3 && isPIP;

    if (ratingEl) {
        if (rawScore > 0) {
            ratingEl.innerHTML = `<i class="fas fa-star text-amber-500 mr-1"></i>${rawScore.toFixed(2)} / 5.0 <span class="text-xs font-semibold ${isExceededRetry ? 'text-rose-700' : (isPIP ? 'text-rose-600' : 'text-indigo-700')}">(${isExceededRetry ? 'Failed (3/3 Retries Exceeded)' : (evalRec?.tier_label || (isPIP ? 'Developing (Needs PIP)' : 'Proficient'))})</span>`;
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
            statusPill.innerHTML = '<i class="fas fa-circle-xmark mr-1"></i> FAILED (Requires 1-on-1 Training)';
            statusPill.className = 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200';
        } else if (isPIP) {
            statusPill.textContent = 'Mandatory PIP Active';
            statusPill.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200';
        } else {
            statusPill.textContent = '70-20-10 Growth Framework';
            statusPill.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200';
        }
    }

    const criteria = evalRec && Array.isArray(evalRec.criteria_scores) ? evalRec.criteria_scores : [];
    const strengths = criteria.filter(c => parseFloat(c.rating || 0) >= 3.5);
    const gaps = criteria.filter(c => parseFloat(c.rating || 0) < 3.5);

    if (strengthsList) {
        if (strengths.length > 0) {
            strengthsList.innerHTML = strengths.map(s => `
                <li class="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between transition">
                    <span class="flex items-center space-x-2 font-medium text-slate-800">
                        <i class="fas fa-circle-check text-emerald-600 text-xs"></i>
                        <span>${s.title}</span>
                    </span>
                    <span class="font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono text-[11px]"><i class="fas fa-star text-amber-500 text-[10px] mr-1"></i>${parseFloat(s.rating).toFixed(1)}</span>
                </li>
            `).join('');
        } else {
            strengthsList.innerHTML = `<li class="p-3 text-center text-slate-400 italic bg-slate-50 rounded-xl border border-slate-200/60">No calibrated strengths recorded.</li>`;
        }
    }

    if (gapsList) {
        if (gaps.length > 0) {
            gapsList.innerHTML = gaps.map(g => `
                <li class="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between transition">
                    <span class="flex items-center space-x-2 font-medium text-slate-800">
                        <i class="fas fa-circle-exclamation ${g.rating < 3.0 ? 'text-rose-600' : 'text-amber-600'} text-xs"></i>
                        <span>${g.title}</span>
                    </span>
                    <span class="font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono text-[11px]"><i class="fas fa-star text-amber-500 text-[10px] mr-1"></i>${parseFloat(g.rating).toFixed(1)}</span>
                </li>
            `).join('');
        } else {
            gapsList.innerHTML = `<li class="p-3 text-center text-slate-400 italic bg-slate-50 rounded-xl border border-slate-200/60">No development gaps identified.</li>`;
        }
    }

    if (commitmentsList) {
        const stagedPlan = window.stagedIdpPlans?.[emp.id] || { tasks: [], prescribedBooks: [] };
        const stagedTasks = stagedPlan.tasks || [];
        const stagedBooks = stagedPlan.prescribedBooks || [];
        const stagedTotal = stagedTasks.length + stagedBooks.length;

        const stagedModalCards = [
            ...stagedTasks.map(t => `
                <div class="p-3 bg-slate-50/90 rounded-2xl border border-dashed border-amber-300/80 space-y-1.5 shadow-2xs">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <i class="fas fa-pen-ruler text-[9px] mr-1 text-amber-600"></i>Draft Action Task (Unsaved)
                        </span>
                        <button onclick="removeStagedIdpTask('${emp.id}', '${t.id}'); openViewIDPPlanModal('${emp.id}')" class="text-slate-400 hover:text-rose-600 text-[10px] font-medium transition">
                            <i class="fas fa-times"></i> Remove
                        </button>
                    </div>
                    <p class="font-bold text-slate-900 text-xs">${t.title}</p>
                    <p class="text-slate-500 text-[11px]">${t.description || 'Pending database save upon clicking Finish & Save IDP Plan.'}</p>
                </div>
            `),
            ...stagedBooks.map(b => `
                <div class="p-3 bg-slate-50/90 rounded-2xl border border-dashed border-amber-300/80 space-y-1.5 shadow-2xs">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <i class="fas fa-book-medical text-[9px] mr-1 text-amber-600"></i>Draft LMS Handbook (Unsaved)
                        </span>
                        <button onclick="removeStagedIdpBook('${emp.id}', '${b.bookId}'); openViewIDPPlanModal('${emp.id}')" class="text-slate-400 hover:text-rose-600 text-[10px] font-medium transition">
                            <i class="fas fa-times"></i> Remove
                        </button>
                    </div>
                    <p class="font-bold text-slate-900 text-xs">${b.bookTitle}</p>
                    <p class="text-slate-500 text-[11px]">Assigned to close competency gap. Will enroll in lms_prescribed on Finish.</p>
                </div>
            `)
        ].join('');

        if (stagedTotal > 0 || empGoals.length > 0) {
            commitmentsList.innerHTML = stagedModalCards + empGoals.map((g, idx) => {
                const tasks = g.tasks || [];
                return `
                    <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full">
                                ${idx % 3 === 0 ? '70% Experiential Target' : (idx % 3 === 1 ? '20% Mentorship Target' : '10% Formal Learning')}
                            </span>
                            <span class="text-[10px] font-bold ${g.status === 'Approved' ? 'text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded' : 'text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded'}">
                                ${g.status || 'Active'}
                            </span>
                        </div>
                        <p class="font-bold text-slate-900 text-xs">${g.title}</p>
                        <p class="text-slate-500 text-[11px] leading-relaxed">${g.supervisor_notes || g.evidence || 'Active developmental metric.'}</p>
                        
                        <!-- Tasks list under this goal -->
                        <div class="pt-2 border-t border-slate-100 space-y-1.5">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Action Tasks (${tasks.length}):</span>
                            ${tasks.length > 0 ? tasks.map(t => `
                                <div class="flex items-center justify-between text-[11px] p-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <span class="text-slate-700 font-medium">${t.title}</span>
                                    <span class="text-[10px] font-bold ${t.status === 'completed' ? 'text-emerald-700' : 'text-slate-500'}">
                                        ${t.status === 'completed' ? '✓ Completed' : 'Pending'}
                                    </span>
                                </div>
                            `).join('') : '<p class="text-slate-400 italic text-[10px]">No specific tasks assigned yet.</p>'}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            commitmentsList.innerHTML = `<div class="p-6 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-200/80">No approved commitments or goals assigned in database.</div>`;
        }
    }

    const modalFooterActions = document.getElementById('modal-idp-plan-footer-actions');
    if (modalFooterActions) {
        const stagedPlan = window.stagedIdpPlans?.[emp.id] || { tasks: [], prescribedBooks: [] };
        const stagedTotal = (stagedPlan.tasks?.length || 0) + (stagedPlan.prescribedBooks?.length || 0);

        if (stagedTotal > 0) {
            modalFooterActions.innerHTML = `
                <button onclick="discardStagedIdpPlan('${emp.id}'); openViewIDPPlanModal('${emp.id}')" class="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition flex items-center space-x-1" title="Discard uncommitted draft items">
                    <i class="fas fa-trash-can text-slate-400"></i>
                    <span>Discard (${stagedTotal})</span>
                </button>
                <button onclick="commitStagedIdpPlan('${emp.id}'); closeModal('modal-view-idp-plan')" class="btn-finish-idp-plan px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5 ring-2 ring-emerald-400/50">
                    <i class="fas fa-check-double"></i>
                    <span>Finish &amp; Save IDP (${stagedTotal})</span>
                </button>
            `;
        } else {
            modalFooterActions.innerHTML = `
                <button onclick="closeModal('modal-view-idp-plan'); openRemedialBooksModal('${emp.id}')" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 shadow-2xs transition flex items-center space-x-1.5">
                    <i class="fas fa-book-medical text-slate-600"></i>
                    <span>Prescribe LMS Books</span>
                </button>
                <button onclick="proceedFromPhase5ToPhase6('${emp.id}')" class="btn-primary px-4 py-2 text-xs font-bold shadow-xs flex items-center space-x-1.5">
                    <span>Open Stage 6 Workspace &rarr;</span>
                </button>
            `;
        }
    }

    openModal('modal-view-idp-plan');
}
window.openViewIDPPlanModal = openViewIDPPlanModal;

/**
 * Open Add Specific Task Modal
 */
function openAddSpecificTaskModal(empId, preselectedGoalId = null) {
    if (preselectedGoalId) {
        const goal = (window.dbGoals || []).find(g => String(g.id) === String(preselectedGoalId));
        if (goal) {
            const st = (goal.status || '').toLowerCase().trim();
            if (st === 'done' || st === 'completed' || st === 'failed') {
                if (typeof showToast === 'function') {
                    showToast(`Cannot add tasks: Objective is already marked as ${goal.status}.`, 'warning');
                }
                return;
            }
        }
    }

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

// ============================================================================
// IDP DRAFT PLAN — DB-Backed (performance_development_plans table)
// Replaces window.stagedIdpPlans (in-memory only). Draft items are persisted
// to the DB in Phase 6. Phase 7 deploy calls deployDevelopmentPlan().
// ============================================================================

// In-memory cache of draft summaries: { [empId]: { tasks, lms_books, task_count, book_count } }
window.dbDraftPlans = window.dbDraftPlans || {};

async function loadDraftSummary(empId, forceRefresh = false) {
    if (!forceRefresh && window.dbDraftPlans && window.dbDraftPlans[empId]) {
        return window.dbDraftPlans[empId];
    }
    try {
        const summary = await PerformanceAPI.getDevelopmentPlans(empId);
        window.dbDraftPlans[empId] = summary;
        return summary;
    } catch (err) {
        window.dbDraftPlans[empId] = window.dbDraftPlans[empId] || { tasks: [], lms_books: [], task_count: 0, book_count: 0, total: 0 };
        return window.dbDraftPlans[empId];
    }
}
window.loadDraftSummary = loadDraftSummary;

/**
 * Handle Add Specific Task Form Submission — saves to DB draft immediately
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

    closeModal('modal-add-specific-task');

    // 1. INSTANT 0ms OPTIMISTIC ADDITION
    window.dbDraftPlans = window.dbDraftPlans || {};
    window.dbDraftPlans[empId] = window.dbDraftPlans[empId] || { tasks: [], lms_books: [], task_count: 0, book_count: 0, total: 0 };
    const tempTaskItem = {
        id: 'temp_task_' + Date.now(),
        employee_id: empId,
        goal_id: goalId,
        title: title,
        target_date: targetDate || '2 Weeks',
        description: description || 'Action task.',
        status: 'Draft',
        item_type: 'task'
    };
    window.dbDraftPlans[empId].tasks = window.dbDraftPlans[empId].tasks || [];
    window.dbDraftPlans[empId].tasks.push(tempTaskItem);
    window.dbDraftPlans[empId].task_count = window.dbDraftPlans[empId].tasks.length;
    window.dbDraftPlans[empId].total = window.dbDraftPlans[empId].task_count + (window.dbDraftPlans[empId].lms_books?.length || 0);

    showIDPDetail(empId);
    if (typeof showToast === 'function') {
        showToast(`✏️ Draft task "${title}" added to plan.`, 'success');
    }

    // 2. NON-BLOCKING BACKGROUND API CALL
    try {
        const res = await PerformanceAPI.addDraftTask({
            employee_id: empId,
            goal_id: goalId,
            title: title,
            target_date: targetDate,
            description: description,
            plan_type: 'IDP'
        });

        if (res && res.id) {
            tempTaskItem.id = res.id;
        }
    } catch (err) {
        console.error('Error saving draft task:', err);
        // Rollback on error
        window.dbDraftPlans[empId].tasks = (window.dbDraftPlans[empId].tasks || []).filter(t => t.id !== tempTaskItem.id);
        window.dbDraftPlans[empId].task_count = window.dbDraftPlans[empId].tasks.length;
        window.dbDraftPlans[empId].total = window.dbDraftPlans[empId].task_count + (window.dbDraftPlans[empId].lms_books?.length || 0);
        showIDPDetail(empId);
        if (typeof showToast === 'function') showToast(`Error saving draft task: ${err.message || 'Server error'}`, 'error');
    }
}
window.handleCreateSpecificTaskSubmit = handleCreateSpecificTaskSubmit;

/**
 * View draft plan summary for an employee (opens a review modal).
 * Called from the "Drafts (N)" button in Phase 6.
 */
window.viewDraftPlan = function(empId) {
    const summary = window.dbDraftPlans?.[empId] || { tasks: [], lms_books: [], task_count: 0, book_count: 0, total: 0 };
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || { name: 'Associate' };
    const total = summary.total || (summary.tasks?.length || 0) + (summary.lms_books?.length || 0);

    // Make sure IDP detail is rendered instantly
    showIDPDetail(empId);

    if (total === 0) {
        if (typeof showToast === 'function') showToast('No draft items staged for this associate yet.', 'info');
        return;
    }

    // Instantly scroll to draft section in modal body with visual highlight
    setTimeout(() => {
        const container = document.getElementById('idp-detail-commitments-list');
        const firstDraft = container?.querySelector('.draft-item-card');
        if (firstDraft) {
            firstDraft.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            firstDraft.classList.add('ring-2', 'ring-amber-400');
            setTimeout(() => firstDraft.classList.remove('ring-2', 'ring-amber-400'), 1200);
        }
    }, 50);
};

/**
 * Discard all draft items for an employee — instant 0ms optimistic removal
 */
window.discardStagedIdpPlan = function(empId) {
    const savedDraft = JSON.parse(JSON.stringify(window.dbDraftPlans?.[empId] || {}));
    
    // 1. INSTANT 0ms OPTIMISTIC CLEAR
    window.dbDraftPlans[empId] = { tasks: [], lms_books: [], task_count: 0, book_count: 0, total: 0 };
    showIDPDetail(empId);
    if (typeof renderRemedialBooksList === 'function') renderRemedialBooksList();
    if (typeof showToast === 'function') showToast('Draft plan discarded.', 'info');

    // 2. NON-BLOCKING BACKGROUND API CALL
    if (typeof PerformanceAPI !== 'undefined' && typeof PerformanceAPI.discardDraftPlan === 'function') {
        PerformanceAPI.discardDraftPlan(empId).catch(err => {
            window.dbDraftPlans[empId] = savedDraft;
            showIDPDetail(empId);
            if (typeof renderRemedialBooksList === 'function') renderRemedialBooksList();
            if (typeof showToast === 'function') showToast(`Error discarding draft: ${err.message}`, 'error');
        });
    }
};

/**
 * Remove a single draft task item from DB — instant 0ms optimistic removal
 */
window.removeStagedIdpTask = function(empId, taskId) {
    const draftData = window.dbDraftPlans?.[empId] || {};
    const savedTasks = [...(draftData.tasks || [])];

    // 1. INSTANT 0ms OPTIMISTIC REMOVAL
    draftData.tasks = (draftData.tasks || []).filter(t => String(t.id) !== String(taskId));
    draftData.task_count = draftData.tasks.length;
    draftData.total = draftData.task_count + (draftData.lms_books?.length || 0);

    showIDPDetail(empId);
    if (typeof showToast === 'function') showToast('Draft task removed from plan.', 'info');

    // 2. NON-BLOCKING BACKGROUND API CALL
    if (typeof PerformanceAPI !== 'undefined' && typeof PerformanceAPI.removeDraftItem === 'function') {
        PerformanceAPI.removeDraftItem(taskId).catch(err => {
            draftData.tasks = savedTasks;
            draftData.task_count = draftData.tasks.length;
            draftData.total = draftData.task_count + (draftData.lms_books?.length || 0);
            showIDPDetail(empId);
            if (typeof showToast === 'function') showToast(`Error removing task: ${err.message}`, 'error');
        });
    }
};

/**
 * Remove a single draft LMS book item from DB — instant 0ms optimistic removal
 */
window.removeStagedIdpBook = function(empId, bookId, rowId) {
    if (typeof removeRemedialDraftBook === 'function') {
        removeRemedialDraftBook(empId, bookId, rowId);
        return;
    }
    const draftData = window.dbDraftPlans?.[empId] || {};
    const savedBooks = [...(draftData.lms_books || [])];
    const draftItem = (draftData.lms_books || []).find(b => 
        String(b.id) === String(rowId) ||
        String(b.id) === String(bookId) ||
        String(b.lms_document_id) === String(bookId)
    );
    const targetIdToDelete = draftItem ? draftItem.id : (rowId || bookId);

    // 1. INSTANT 0ms OPTIMISTIC REMOVAL
    draftData.lms_books = (draftData.lms_books || []).filter(b => 
        String(b.id) !== String(targetIdToDelete) &&
        String(b.id) !== String(bookId) &&
        String(b.lms_document_id) !== String(bookId)
    );
    draftData.book_count = draftData.lms_books.length;
    draftData.total = (draftData.tasks?.length || 0) + draftData.book_count;

    showIDPDetail(empId);
    if (typeof renderRemedialBooksList === 'function') renderRemedialBooksList();
    if (typeof showToast === 'function') showToast('Draft LMS handbook removed from plan.', 'info');

    // 2. NON-BLOCKING BACKGROUND API CALL
    if (typeof PerformanceAPI !== 'undefined' && typeof PerformanceAPI.removeDraftItem === 'function') {
        PerformanceAPI.removeDraftItem(targetIdToDelete).catch(err => {
            draftData.lms_books = savedBooks;
            draftData.book_count = draftData.lms_books.length;
            draftData.total = (draftData.tasks?.length || 0) + draftData.book_count;
            showIDPDetail(empId);
            if (typeof renderRemedialBooksList === 'function') renderRemedialBooksList();
            if (typeof showToast === 'function') showToast(`Error removing draft book: ${err.message}`, 'error');
        });
    }
};

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

    if (titleEl) titleEl.textContent = 'IDP · Development Plan';
    if (subtitleEl) subtitleEl.textContent = 'No evaluated associate selected. Complete Stage 4-5 first.';
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

    // Show employees who have goals and finalized calibrated ratings from Stage 5 in database
    let roster = (window.perfRoster && window.perfRoster.length > 0) ? window.perfRoster.filter(emp => {
        const hasGoal = typeof employeeHasApprovedGoal === 'function' ? employeeHasApprovedGoal(emp) : false;
        const evalRec = getDbEvaluations().find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const isCalibrated = evalRec && (evalRec.status === 'Calibrated' || (evalRec.calibrated_score !== null && evalRec.calibrated_score !== undefined && evalRec.status !== 'Rated'));
        const score = isCalibrated && evalRec.calibrated_score ? parseFloat(evalRec.calibrated_score) : 0;
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
        renderPaginationControls('idp-pagination-container', 1, 0, idpPageSize, 'setIDPPage', 'setIDPPageSize');
        return;
    }

    const isAll = idpPageSize === 'all';
    const effectivePageSize = isAll ? roster.length : idpPageSize;
    const totalPages = isAll ? 1 : (Math.ceil(roster.length / effectivePageSize) || 1);
    if (idpCurrentPage > totalPages) {
        idpCurrentPage = totalPages;
    }
    if (idpCurrentPage < 1) {
        idpCurrentPage = 1;
    }

    const startIdx = isAll ? 0 : (idpCurrentPage - 1) * effectivePageSize;
    const pageList = isAll ? roster : roster.slice(startIdx, startIdx + effectivePageSize);

    const dbEvals = getDbEvaluations();

    container.innerHTML = pageList.map((emp, idx) => {
        const evalRec = dbEvals.find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const isCalibrated = evalRec && (evalRec.status === 'Calibrated' || (evalRec.calibrated_score !== null && evalRec.calibrated_score !== undefined && evalRec.status !== 'Rated'));
        const score = isCalibrated && evalRec.calibrated_score ? parseFloat(evalRec.calibrated_score) : 0;
        const hasPassed = score >= 3.0;
        const retryCount = getEmployeeRetryCount(emp.id);
        const inTraining = isEmployeeInTraining(emp.id);
        const isScored = isEmployeeTrainingScored(emp.id);
        const isGoalFailed = isEmployeeGoalFailed(emp.id);
        const isNeeds1on1 = (retryCount >= 3 && isScored && !hasPassed) || retryCount >= 4 || isGoalFailed;
        const isExceededRetry = (retryCount >= 3 && !hasPassed) || isNeeds1on1;
        const xpPts = getKudosXP(score);
        const isGoalDone = (window.dbGoals || []).some(g => isSameEmployee(g.employee_id, emp.id) && (g.status === 'Done' || g.status === 'Completed' || !!g.exp_id));
        const isKudosDisabled = !!(emp.kudosSent || isGoalDone);
        return `
            <tr class="hover:bg-slate-50 transition text-xs border-b border-slate-100">
                <td class="px-3 py-4 text-center font-mono font-bold text-slate-400 text-xs">
                    ${startIdx + idx + 1}
                </td>
                <td class="px-5 py-4 font-bold text-slate-900">
                    <span class="max-w-[160px] truncate block" title="${emp.name}">${emp.name}</span>
                </td>
                <td class="px-5 py-4 text-slate-500 max-w-[150px] truncate" title="${emp.position} · ${emp.department}">${emp.position} · ${emp.department}</td>
                <td class="px-5 py-4 font-bold text-slate-800">
                    ${isExceededRetry ? `
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-200 text-rose-900 border border-rose-300">
                            Failed (${score.toFixed(2)}/5.0)
                        </span>
                    ` : `
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${!hasPassed && score > 0 ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
                            ${!hasPassed && score > 0 ? `PIP Remediation (${score.toFixed(2)}/5.0)` : `<i class="fas fa-star text-amber-500 mr-1 text-[10px]"></i>Proficient (${score.toFixed(2)}/5.0)`}
                        </span>
                    `}
                </td>
                <td class="px-5 py-4">
                    ${isExceededRetry ? `
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-700 text-white shadow-xs">
                            <i class="fas fa-circle-xmark mr-1"></i> FAILED (Requires 1-on-1 Training)
                        </span>
                    ` : `
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isGoalDone ? 'bg-indigo-100 text-indigo-800' : (hasPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}">
                            ${isGoalDone ? 'Goal Done (Kudos Sent) <i class="fas fa-check text-indigo-700 ml-1"></i>' : (hasPassed ? 'Clearance Active' : 'Action Plan Active')}
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
                            <button disabled class="px-2.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-xs font-bold cursor-not-allowed inline-flex items-center space-x-1" title="Kudos already awarded">
                                <i class="fas fa-check text-emerald-600"></i>
                                <span>Kudos Sent</span>
                            </button>
                        ` : `
                            <button onclick="triggerSendKudosForEmployee('${emp.id}')" class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center space-x-1" title="Send Kudos">
                                <i class="fas fa-award text-amber-600"></i>
                                <span>Send Kudos</span>
                            </button>
                        `) : `
                            <button onclick="searchEmployeeInStage('cycle', '${(emp.name || '').replace(/'/g, "\\'")}')" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center space-x-1" title="Proceed to Phase 7">
                                <i class="fas fa-arrow-right text-rose-600"></i>
                                <span>Phase 7 &rarr;</span>
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    renderPaginationControls('idp-pagination-container', idpCurrentPage, roster.length, idpPageSize, 'setIDPPage', 'setIDPPageSize');

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
    idpCurrentPage = 1;
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
    const isCalibrated = evalRec && (evalRec.status === 'Calibrated' || (evalRec.calibrated_score !== null && evalRec.calibrated_score !== undefined && evalRec.status !== 'Rated'));
    const score = isCalibrated && evalRec.calibrated_score ? parseFloat(evalRec.calibrated_score) : 0;

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
    const isGoalDone = (window.dbGoals || []).some(g => isSameEmployee(g.employee_id, emp.id) && (g.status === 'Done' || g.status === 'Completed' || !!g.exp_id));
    const isKudosDisabled = !!(emp.kudosSent || isGoalDone);

    if (titleEl) {
        titleEl.textContent = `IDP · ${emp.name}`;
    }
    if (subtitleEl) {
        const meta = [emp.position, emp.department].filter(Boolean).join(' · ');
        subtitleEl.textContent = `${meta ? meta + ' · ' : ''}Review Cycle ${evalRec?.cycle_period || '2026-Q3'}`;
    }

    const dbDraft = window.dbDraftPlans?.[emp.id] || { tasks: [], lms_books: [], task_count: 0, book_count: 0, total: 0 };
    const stagedTasks = dbDraft.tasks || [];
    const stagedBooks = dbDraft.lms_books || [];
    const stagedTotal = dbDraft.total || 0;

    // Load from DB only if cache is missing for this associate
    if (!window.dbDraftPlans || !window.dbDraftPlans[emp.id]) {
        loadDraftSummary(emp.id).then(summary => {
            if ((summary?.total || 0) > 0) {
                showIDPDetail(empId, false);
            }
        });
    }

    if (headerActions) {
        const actionButtons = [];

        if (stagedTotal > 0) {
            actionButtons.push(`
                <button onclick="discardStagedIdpPlan('${emp.id}')" class="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition flex items-center space-x-1" title="Discard draft items">
                    <i class="fas fa-trash-can text-slate-400"></i>
                    <span>Discard</span>
                </button>
            `);
            actionButtons.push(`
                <button onclick="viewDraftPlan('${emp.id}')" class="btn-view-idp-draft px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5">
                    <i class="fas fa-clipboard-list"></i>
                    <span>Drafts (${stagedTotal})</span>
                </button>
            `);
        }

        if (hasPassedBenchmark) {
            if (isKudosDisabled) {
                actionButtons.push(`
                    <button disabled class="px-3 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-xs font-bold cursor-not-allowed flex items-center space-x-1.5">
                        <i class="fas fa-check text-emerald-600"></i>
                        <span>Kudos Sent</span>
                    </button>
                `);
            } else {
                actionButtons.push(`
                    <button onclick="triggerSendKudosForEmployee('${emp.id}')" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition">
                        <i class="fas fa-award"></i>
                        <span>Send Kudos</span>
                    </button>
                `);
            }
        } else if (isNeeds1on1) {
            actionButtons.push(`
                <button onclick="searchEmployeeInStage('cycle', '${(emp.name || '').replace(/'/g, "\\'")}')" class="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition">
                    <i class="fas fa-arrow-right"></i>
                    <span>Phase 7 &rarr;</span>
                </button>
            `);
        } else if (isExceededRetry) {
            actionButtons.push(`
                <button onclick="openFormalCurriculumModal('${emp.id}')" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition">
                    <i class="fas fa-chalkboard-user"></i>
                    <span>Assign Training</span>
                </button>
            `);
            actionButtons.push(`
                <button onclick="searchEmployeeInStage('cycle', '${(emp.name || '').replace(/'/g, "\\'")}')" class="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition">
                    <i class="fas fa-arrow-right"></i>
                    <span>Phase 7 &rarr;</span>
                </button>
            `);
        } else {
            if (inTraining && !isScored) {
                actionButtons.push(`
                    <button disabled class="px-3 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-xs font-semibold cursor-not-allowed flex items-center space-x-1.5" title="Associate is currently enrolled in Mandatory Formal Training.">
                        <i class="fas fa-lock"></i>
                        <span>Prescribe Books</span>
                    </button>
                `);
            } else {
                actionButtons.push(`
                    <button onclick="openRemedialBooksModal('${emp.id}')" class="px-3 py-1.5 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition">
                        <i class="fas fa-book-medical"></i>
                        <span>Prescribe Books</span>
                    </button>
                `);
            }
            actionButtons.push(`
                <button onclick="searchEmployeeInStage('cycle', '${(emp.name || '').replace(/'/g, "\\'")}')" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition">
                    <i class="fas fa-arrow-right"></i>
                    <span>Phase 7 &rarr;</span>
                </button>
            `);
        }

        headerActions.innerHTML = actionButtons.join('');
    }

    if (headerLmsAction) {
        if (hasPassedBenchmark) {
            if (isKudosDisabled) {
                headerLmsAction.innerHTML = `
                    <span class="text-xs text-slate-400 font-bold flex items-center space-x-1">
                        <i class="fas fa-check text-emerald-600 text-[11px]"></i>
                        <span>Kudos Sent</span>
                    </span>
                `;
            } else {
                headerLmsAction.innerHTML = `
                    <button onclick="triggerSendKudosForEmployee('${emp.id}')" class="text-xs text-amber-600 font-bold hover:underline flex items-center space-x-1">
                        <i class="fas fa-award text-[11px]"></i>
                        <span>Send Kudos &rarr;</span>
                    </button>
                `;
            }
        } else if (isExceededRetry) {
            headerLmsAction.innerHTML = `
                <button onclick="openFormalCurriculumModal('${emp.id}')" class="text-xs text-rose-700 font-bold hover:underline flex items-center space-x-1">
                    <i class="fas fa-chalkboard-user text-[11px]"></i>
                    <span>Assign Training &rarr;</span>
                </button>
            `;
        } else {
            headerLmsAction.innerHTML = `
                <button onclick="openRemedialBooksModal('${emp.id}')" class="text-xs text-primary font-bold hover:underline flex items-center space-x-1">
                    <i class="fas fa-book-bookmark text-[11px]"></i>
                    <span>Browse Books &rarr;</span>
                </button>
            `;
        }
    }

    const criteria = evalRec && Array.isArray(evalRec.criteria_scores) ? evalRec.criteria_scores : [];
    const strengths = criteria.filter(c => parseFloat(c.rating || 0) >= 3.5);
    const gaps = criteria.filter(c => parseFloat(c.rating || 0) < 3.5);

    const empKey = isSameEmployee(emp.id, 'emp-101') ? 'maria' : (isSameEmployee(emp.id, 'emp-102') ? 'antonio' : emp.id);
    const dbPrescribed = (window.dynamicLmsState && Array.isArray(window.dynamicLmsState.prescribed)) ? window.dynamicLmsState.prescribed : [];
    const empDbPrescribed = dbPrescribed.filter(item => isSameEmployee(item.employee, emp.id) || (empKey === 'maria' && isSameEmployee(item.employee, 'emp-101')));
    const memoryPrescribed = [
        ...(window.prescribedBooksPerAssociate?.[emp.id] || []),
        ...(window.prescribedBooksPerAssociate?.[empKey] || [])
    ];
    const prescribedIds = Array.from(new Set([
        ...empDbPrescribed.map(p => String(p.lms_id)),
        ...memoryPrescribed.map(p => String(p))
    ])).filter(Boolean);

    const prescribedList = prescribedIds;
    const isTrainingPrescribed = prescribedList.length > 0;

    if (strengthsCount) strengthsCount.textContent = `${strengths.length} Identified`;
    if (gapsCount) gapsCount.textContent = `${gaps.length} Action Needed`;

    if (strengthsList) {
        if (strengths.length > 0) {
            strengthsList.innerHTML = strengths.map(s => `
                <li class="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between transition">
                    <span class="flex items-center space-x-2 min-w-0 pr-2">
                        <i class="fas fa-circle-check text-emerald-600 text-xs flex-shrink-0"></i>
                        <span class="font-medium text-slate-900 truncate">${s.title}</span>
                    </span>
                    <span class="font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px] font-mono flex-shrink-0"><i class="fas fa-star text-amber-500 text-[10px] mr-1"></i>${parseFloat(s.rating).toFixed(1)}</span>
                </li>
            `).join('');
        } else {
            strengthsList.innerHTML = `<li class="p-3 text-center text-slate-400 italic bg-slate-50 rounded-xl border border-slate-200/60">No calibrated strengths recorded.</li>`;
        }
    }

    if (gapsList) {
        if (gaps.length > 0) {
            gapsList.innerHTML = gaps.map(g => `
                <li class="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 transition">
                    <div class="flex items-center space-x-2 min-w-0">
                        <i class="fas fa-circle-exclamation ${g.rating < 3.0 ? 'text-rose-600' : 'text-amber-600'} text-xs flex-shrink-0"></i>
                        <div class="truncate">
                            <p class="font-semibold text-slate-900 text-xs truncate">${g.title}</p>
                            <p class="text-[10px] text-slate-500">Rating: <i class="fas fa-star text-amber-500 text-[10px] mr-0.5"></i><span class="font-bold text-slate-700">${parseFloat(g.rating).toFixed(1)} / 5.0</span></p>
                        </div>
                    </div>
                    ${!hasPassedBenchmark ? (isTrainingPrescribed ? `
                        <button onclick="openRemedialBooksModal('${emp.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg font-bold text-[10px] flex-shrink-0 transition flex items-center space-x-1 shadow-2xs" title="Training module assigned">
                            <i class="fas fa-check text-emerald-600 text-[9px]"></i>
                            <span>Prescribed</span>
                        </button>
                    ` : `
                        <button onclick="openRemedialBooksModal('${emp.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg font-bold text-[10px] flex-shrink-0 transition flex items-center space-x-1 shadow-2xs" title="Assign targeted LMS book">
                            <i class="fas fa-plus text-slate-600 text-[9px]"></i>
                            <span>Prescribe</span>
                        </button>
                    `) : ''}
                </li>
            `).join('');
        } else {
            gapsList.innerHTML = `<li class="p-3 text-center text-slate-400 italic bg-slate-50 rounded-xl border border-slate-200/60">No development gaps identified.</li>`;
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
                <div class="col-span-full p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/70 space-y-2 shadow-2xs">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div class="flex items-center space-x-2.5">
                            <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200">
                                <i class="fas fa-circle-check"></i>
                            </div>
                            <div>
                                <h5 class="font-bold text-slate-900 text-xs">Proficient Performance Clearance</h5>
                                <p class="text-[11px] text-slate-500">Evaluated score meets proficiency standards (<i class="fas fa-star text-amber-500 mr-0.5 text-xs"></i><strong class="text-slate-800">${score.toFixed(2)} / 5.0</strong>). No remedial tasks required.</p>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto flex items-center space-x-1">
                            <i class="fas fa-check"></i>
                            <span>Proficient</span>
                        </span>
                    </div>
                </div>
            `;
        } else if (isNeeds1on1 || isExceededRetry) {
            topBannerHtml = `
                <div class="col-span-full p-4 bg-rose-50/60 rounded-2xl border border-rose-200/80 space-y-3 shadow-2xs">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-2.5">
                        <div class="flex items-center space-x-2.5">
                            <div class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs border border-rose-200">
                                <i class="fas fa-handshake-angle"></i>
                            </div>
                            <div>
                                <h5 class="font-bold text-slate-900 text-xs">1-on-1 Training Required</h5>
                                <p class="text-[11px] text-slate-500">Rating is <i class="fas fa-star text-amber-500 mr-0.5 text-xs"></i><strong class="text-slate-800">${score.toFixed(2)} / 5.0</strong>. ${isGoalFailed ? 'Goal failed.' : 'Retries exhausted.'} Standard IDP locked.</p>
                            </div>
                        </div>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 self-start sm:self-auto">
                            ${isGoalFailed ? 'Goal: FAILED' : 'Requires 1-on-1'}
                        </span>
                    </div>

                    <div class="flex items-center justify-between gap-2 text-xs">
                        <p class="text-[11px] text-slate-600">Transition to Phase 7 for the 1-on-1 evaluation lifecycle.</p>
                        <button onclick="searchEmployeeInStage('cycle', '${(emp.name || '').replace(/'/g, "\\'")}')" class="btn-primary px-3.5 py-1.5 text-xs font-bold shadow-xs flex items-center space-x-1">
                            <span>Phase 7 &rarr;</span>
                        </button>
                    </div>
                </div>
            `;
        } else {
            topBannerHtml = `
                ${(inTraining && tnNeed) ? `
                    <div class="col-span-full p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 text-xs mb-1">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <div class="flex items-center space-x-2">
                                <div class="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <div>
                                    <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                        Formal Training: ${tnNeed.status || 'In Training'}
                                    </span>
                                    <h5 class="font-bold text-slate-900 text-xs mt-0.5">${tnNeed.title}</h5>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3 font-mono text-[11px]">
                                <div class="text-right">
                                    <span class="text-[9px] text-slate-400 block uppercase font-bold">Score</span>
                                    <span class="font-bold ${isScored ? 'text-emerald-700' : 'text-slate-700'}">${parseFloat(tnNeed.current_score || 0).toFixed(2)} / 5.0</span>
                                </div>
                                <div class="text-right">
                                    <span class="text-[9px] text-slate-400 block uppercase font-bold">Benchmark</span>
                                    <span class="font-bold text-slate-800">${parseFloat(tnNeed.required_score || 4.0).toFixed(2)} / 5.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                <div class="col-span-full p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 shadow-2xs">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                        <div class="flex items-center space-x-2.5">
                            <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
                                <i class="fas fa-triangle-exclamation"></i>
                            </div>
                            <div>
                                <h5 class="font-bold text-slate-900 text-xs">PIP Action Plan</h5>
                                <p class="text-[11px] text-slate-500">Rating: <i class="fas fa-star text-amber-500 mr-0.5 text-xs"></i><strong class="text-slate-800">${score.toFixed(2)} / 5.0</strong>. Complete required actions to re-evaluate.</p>
                            </div>
                        </div>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
                            Retry (${retryCount}/3)
                        </span>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        <div class="flex items-center space-x-1.5">
                            ${(inTraining && !isScored) ? `
                                <button disabled class="px-3 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl font-bold text-xs cursor-not-allowed flex items-center space-x-1">
                                    <i class="fas fa-lock"></i>
                                    <span>+ Task</span>
                                </button>
                            ` : `
                                <button onclick="openAddSpecificTaskModal('${emp.id}')" class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs shadow-2xs transition flex items-center space-x-1">
                                    <i class="fas fa-plus text-slate-500"></i>
                                    <span>+ Task</span>
                                </button>
                            `}
                            ${(inTraining && !isScored) ? `
                                <button disabled class="px-3 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl font-bold text-xs cursor-not-allowed flex items-center space-x-1">
                                    <i class="fas fa-lock"></i>
                                    <span>Books</span>
                                </button>
                            ` : (isTrainingPrescribed ? `
                                <button onclick="openRemedialBooksModal('${emp.id}')" class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs shadow-2xs transition flex items-center space-x-1" title="View assigned training modules">
                                    <i class="fas fa-check-circle text-emerald-600"></i>
                                    <span>Prescribed (${prescribedList.length})</span>
                                </button>
                            ` : `
                                <button onclick="openRemedialBooksModal('${emp.id}')" class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs shadow-2xs transition flex items-center space-x-1">
                                    <i class="fas fa-book-medical text-slate-500"></i>
                                    <span>Prescribe Books</span>
                                </button>
                            `)}
                        </div>

                        <div class="flex items-center space-x-2">
                            ${(inTraining && !isScored) ? `
                                <button disabled class="px-3.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed rounded-xl font-bold text-xs flex items-center space-x-1" title="Re-evaluation is locked while undergoing mandatory training.">
                                    <i class="fas fa-lock text-[10px]"></i>
                                    <span>In Training</span>
                                </button>
                            ` : (!allTasksDone ? `
                                <button disabled class="px-3.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed rounded-xl font-bold text-xs opacity-70 flex items-center space-x-1" title="Complete all tasks first (${completedAllTasks}/${totalAllTasks} completed).">
                                    <i class="fas fa-lock text-[10px]"></i>
                                    <span>Incomplete (${completedAllTasks}/${totalAllTasks})</span>
                                </button>
                            ` : `
                                <button onclick="openAppraisalModal('${emp.id}')" class="btn-primary px-3.5 py-1.5 text-xs font-bold shadow-xs flex items-center space-x-1" title="Re-evaluate associate">
                                    <i class="fas fa-star-half-stroke text-[10px]"></i>
                                    <span>Re-Evaluate</span>
                                </button>
                            `)}
                        </div>
                    </div>
                </div>
            `;
        }

        const stagedCardsHtml = [
            ...stagedTasks.map(t => `
                <div class="p-4 bg-slate-50/90 hover:bg-white rounded-2xl border border-dashed border-amber-300/80 transition shadow-2xs flex flex-col justify-between space-y-3 draft-item-card">
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                                <i class="fas fa-pen-ruler text-[9px] mr-1 text-amber-600"></i>Draft Task
                            </span>
                            <button onclick="removeStagedIdpTask('${emp.id}', '${t.id}')" class="text-slate-400 hover:text-rose-600 text-[11px] font-medium transition flex items-center space-x-0.5 active:scale-95" title="Remove draft">
                                <i class="fas fa-times text-[10px]"></i>
                                <span>Remove</span>
                            </button>
                        </div>
                        <h5 class="font-heading font-bold text-slate-900 text-xs">${t.title || t.item_title || 'Draft Task'}</h5>
                        <p class="text-slate-500 text-[11px] leading-relaxed line-clamp-2">${t.description || t.item_description || 'Draft action task.'}</p>
                    </div>
                    <div class="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span class="text-slate-500 text-[10px] font-medium"><i class="fas fa-calendar-check mr-1 text-slate-400"></i>${t.target_date || '2 Weeks'}</span>
                        <span class="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">Draft</span>
                    </div>
                </div>
            `),
            ...stagedBooks.map(b => `
                <div class="p-4 bg-slate-50/90 hover:bg-white rounded-2xl border border-dashed border-amber-300/80 transition shadow-2xs flex flex-col justify-between space-y-3 draft-item-card">
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                                <i class="fas fa-book-medical text-[9px] mr-1 text-amber-600"></i>Draft LMS Book
                            </span>
                            <button onclick="removeStagedIdpBook('${emp.id}', '${b.lms_document_id || b.id || b.bookId}', '${b.id}')" class="text-slate-400 hover:text-rose-600 text-[11px] font-medium transition flex items-center space-x-0.5 active:scale-95" title="Remove draft">
                                <i class="fas fa-times text-[10px]"></i>
                                <span>Remove</span>
                            </button>
                        </div>
                        <h5 class="font-heading font-bold text-slate-900 text-xs">${b.book_title || b.item_title || b.bookTitle || 'SOP Handbook'}</h5>
                        <p class="text-slate-500 text-[11px] leading-relaxed line-clamp-2">Prescribed LMS handbook for remediation.</p>
                    </div>
                    <div class="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span class="text-slate-500 text-[10px] font-medium"><i class="fas fa-book-open mr-1 text-slate-400"></i>10% Formal LMS</span>
                        <span class="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">Draft</span>
                    </div>
                </div>
            `)
        ].join('');

        if (stagedTotal > 0 || empGoals.length > 0 || isPIP || hasPassedBenchmark) {
            commitmentsContainer.innerHTML = topBannerHtml + stagedCardsHtml + empGoals.map((g, idx) => `
                <div class="p-4 bg-white hover:border-slate-300 rounded-2xl border border-slate-200/80 transition shadow-2xs flex flex-col justify-between space-y-3">
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full">
                                ${idx % 3 === 0 ? '70% Experiential' : (idx % 3 === 1 ? '20% Mentorship' : '10% Formal LMS')}
                            </span>
                            <span class="text-[10px] font-mono text-slate-400 font-semibold">${g.target_metric || 'Active Target'}</span>
                        </div>
                        <h5 class="font-heading font-bold text-slate-900 text-xs">${g.title}</h5>
                        <p class="text-slate-500 text-[11px] leading-relaxed line-clamp-2">${g.supervisor_notes || g.evidence || 'Active developmental metric.'}</p>
                    </div>
                    <div class="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span class="text-slate-400 text-[10px]"><i class="fas fa-calendar-check mr-1"></i>${g.target_date || 'Q3 Target'}</span>
                        <div class="flex items-center space-x-1">
                            ${(() => {
                                const st = (g.status || '').toLowerCase().trim();
                                const isConcluded = st === 'done' || st === 'completed' || st === 'failed';
                                if (hasPassedBenchmark) return '';
                                if (isConcluded) {
                                    return `
                                        <button disabled class="px-2 py-0.5 bg-slate-100 text-slate-300 border border-slate-200 rounded text-[10px] font-bold cursor-not-allowed opacity-50" title="Add Task disabled: Objective is ${g.status}">
                                            <i class="fas fa-lock text-[8px]"></i> Task
                                        </button>
                                    `;
                                }
                                return `
                                    <button onclick="openAddSpecificTaskModal('${emp.id}', '${g.id}')" class="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded text-[10px] font-bold transition" title="Add Task to Goal">
                                        + Task
                                    </button>
                                `;
                            })()}
                            <span class="text-[10px] font-bold ${g.status === 'Approved' ? 'text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded' : 'text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded'}">
                                ${g.status || 'Active'}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            commitmentsContainer.innerHTML = `
                <div class="col-span-3 p-8 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-400 italic space-y-1.5">
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
