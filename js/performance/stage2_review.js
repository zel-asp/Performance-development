/**
 * Oxford Suites, Makati — Performance Management Module
 * Sub-Module: Stage 2 — Goal Review, Approvals & General Tasks Matrix
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
        renderPaginationControls('general-tasks-pagination-container', 1, 0, generalTasksPageSize, 'setGeneralTasksPage', 'setGeneralTasksPageSize');
        return;
    }

    const isAll = generalTasksPageSize === 'all';
    const effectivePageSize = isAll ? tasks.length : generalTasksPageSize;
    const totalPages = isAll ? 1 : (Math.ceil(tasks.length / effectivePageSize) || 1);
    if (generalTasksCurrentPage > totalPages) {
        generalTasksCurrentPage = totalPages;
    }
    if (generalTasksCurrentPage < 1) {
        generalTasksCurrentPage = 1;
    }

    const startIdx = isAll ? 0 : (generalTasksCurrentPage - 1) * effectivePageSize;
    const pageTasks = isAll ? tasks : tasks.slice(startIdx, startIdx + effectivePageSize);

    tbody.innerHTML = pageTasks.map((t, idx) => `
        <tr class="hover:bg-slate-50/80 transition text-xs border-b border-slate-100">
            <td class="px-3 py-3.5 text-center font-mono font-bold text-slate-400 text-xs">
                ${startIdx + idx + 1}
            </td>
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
        </tr>
    `).join('');

    renderPaginationControls('general-tasks-pagination-container', generalTasksCurrentPage, tasks.length, generalTasksPageSize, 'setGeneralTasksPage', 'setGeneralTasksPageSize');
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
        renderPaginationControls('approval-pagination-container', 1, 0, approvalPageSize, 'setApprovalPage', 'setApprovalPageSize');
        updateStage2BulkDeleteState();
        return;
    }

    const isAll = approvalPageSize === 'all';
    const effectivePageSize = isAll ? approvedGoals.length : approvalPageSize;
    const totalPages = isAll ? 1 : (Math.ceil(approvedGoals.length / effectivePageSize) || 1);
    if (approvalCurrentPage > totalPages) {
        approvalCurrentPage = totalPages;
    }
    if (approvalCurrentPage < 1) {
        approvalCurrentPage = 1;
    }

    const startIdx = isAll ? 0 : (approvalCurrentPage - 1) * effectivePageSize;
    const pageGoals = isAll ? approvedGoals : approvedGoals.slice(startIdx, startIdx + effectivePageSize);

    container.innerHTML = pageGoals.map(goal => {
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

        return `
            <div class="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" class="stage2-goal-checkbox rounded border-slate-300 text-amber-600 focus:ring-amber-500" value="${goal.id}" onchange="updateStage2BulkDeleteState()">
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
                    <button onclick="confirmDeleteGoal('${goal.id}', '${(goal.title || '').replace(/'/g, "\\'")}', this)" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition flex items-center space-x-1" title="Delete Objective">
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
            </div>
        `;
    }).join('');

    renderPaginationControls('approval-pagination-container', approvalCurrentPage, approvedGoals.length, approvalPageSize, 'setApprovalPage', 'setApprovalPageSize');
    updateStage2BulkDeleteState();
}
window.renderApprovalRosterTable = renderApprovalRosterTable;

window.onApprovedGoalsSearch = function(query) {
    window.approvedSearchQuery = query;
    approvalCurrentPage = 1;
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
    const bulkBtn = document.getElementById('btn-stage2-bulk-delete');

    showActionConfirmModal({
        title: 'Bulk Delete Approved Objectives',
        message: `Are you sure you want to delete ${selected.length} selected approved objective(s)?`,
        confirmBtnText: `Delete ${selected.length} Goals`,
        confirmBtnClass: 'btn-danger bg-rose-600 hover:bg-rose-700 text-white',
        iconClass: 'fas fa-trash-can',
        iconContainerClass: 'bg-rose-100 text-rose-700',
        onConfirm: async () => {
            let origBulkHtml = '';
            if (bulkBtn) {
                origBulkHtml = bulkBtn.innerHTML;
                bulkBtn.disabled = true;
                bulkBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Deleting...</span>';
            }
            try {
                await PerformanceAPI.bulkDeleteGoals(selected);
                showToast(`${selected.length} objectives deleted successfully.`, 'success');
                await loadAndRenderPlanningGoals();
            } catch (err) {
                console.error('Bulk delete error:', err);
                showToast(err.message || 'Failed to delete goals', 'error');
            } finally {
                if (bulkBtn) {
                    bulkBtn.disabled = false;
                    bulkBtn.innerHTML = origBulkHtml;
                }
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
