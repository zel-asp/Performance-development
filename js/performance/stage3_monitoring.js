/**
 * Oxford Suites, Makati — Performance Management Module
 * Sub-Module: Stage 3 — Continuous Monitoring, Milestone Logs & Task Checklists
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
        renderPaginationControls('monitoring-pagination-container', 1, 0, monitoringPageSize, 'setMonitoringPage', 'setMonitoringPageSize');
        return;
    }

    const isAll = monitoringPageSize === 'all';
    const effectivePageSize = isAll ? list.length : monitoringPageSize;
    const totalPages = isAll ? 1 : (Math.ceil(list.length / effectivePageSize) || 1);
    if (monitoringCurrentPage > totalPages) {
        monitoringCurrentPage = totalPages;
    }
    if (monitoringCurrentPage < 1) {
        monitoringCurrentPage = 1;
    }

    const startIdx = isAll ? 0 : (monitoringCurrentPage - 1) * effectivePageSize;
    const pageList = isAll ? list : list.slice(startIdx, startIdx + effectivePageSize);

    const dbEvals = getDbEvaluations();

    container.innerHTML = pageList.map((emp, idx) => {
        emp.monitoringProgress = calculateEmployeeProgress(emp);
        emp.monitoringStatus = emp.monitoringProgress >= 90 ? 'Exceeding' : (emp.monitoringProgress >= 70 ? 'On Track' : 'Needs Support');

        const progressColor = emp.monitoringProgress >= 90 ? 'bg-emerald-500' : (emp.monitoringProgress >= 70 ? 'bg-primary' : 'bg-amber-500');
        
        // Find existing evaluation if any
        const evalRec = dbEvals.find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const hasEval = evalRec && typeof evalRec.supervisor_rating !== 'undefined' && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0;
        const supScore = hasEval ? parseFloat(evalRec.supervisor_rating) : (emp.supervisorRating || 0);

        const inTraining = isEmployeeInTraining(emp.id);
        const tnNeed = getEmployeeTrainingNeed(emp.id);
        const isScored = isEmployeeTrainingScored(emp.id);
        const retryCount = getEmployeeRetryCount(emp.id);
        const allTasksDone = isEmployeeTasksFullyCompleted(emp);

        return `
            <tr class="hover:bg-slate-50 transition text-xs border-b border-slate-100">
                <td class="px-3 py-4 text-center font-mono font-bold text-slate-400 text-xs">
                    ${startIdx + idx + 1}
                </td>
                <td class="px-5 py-4">
                    <div>
                        <p class="font-bold text-slate-900 text-sm leading-tight max-w-[160px] truncate" title="${emp.name}">${emp.name}</p>
                        <span class="text-[10px] font-bold text-primary bg-primary-50 px-2 py-0.5 rounded max-w-[160px] truncate block" title="${emp.position}">${emp.position}</span>
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
                </td>
                <td class="px-5 py-4">
                    <span class="font-semibold text-slate-700 max-w-[130px] truncate block" title="${emp.department}">${emp.department}</span>
                    ${inTraining ? `<span class="mt-1 inline-block px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-[9px] font-bold">Needs Training: True</span>` : ''}
                </td>
                <td class="px-5 py-4">
                    ${hasEval ? `
                        <div class="space-y-0.5">
                            <span class="font-bold text-slate-900 text-xs flex items-center space-x-1">
                                <i class="fas fa-star text-amber-500 text-xs"></i>
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
                <td class="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                    <button onclick="toggleEmployeeMonitoringDetail('${emp.id}')" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition" title="View Full Employee Logs">
                        <i class="fas fa-eye text-primary"></i>
                        <span>Logs</span>
                    </button>
                    ${retryCount >= 3 ? `
                        <button onclick="switchSubTab('perf', 'idp'); showIDPDetail('${emp.id}', true);" class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1 inline-flex" title="Exceeded Retries! Open Stage 6 IDP for Mandatory 1-on-1 Training">
                            <i class="fas fa-triangle-exclamation"></i>
                            <span>Mandatory Training</span>
                        </button>
                    ` : `
                        ${(inTraining && !isScored) ? `
                            <button disabled class="px-3.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold rounded-xl cursor-not-allowed flex items-center space-x-1 inline-flex" title="In Training: Post-training evaluation locked until training score is recorded.">
                                <i class="fas fa-lock text-[10px]"></i>
                                <span>In Training</span>
                            </button>
                        ` : ((inTraining && isScored) ? `
                            <button onclick="triggerEvaluationForEmployee('${emp.id}')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1 inline-flex" title="Training Completed! Open Post-Training Re-Evaluation">
                                <i class="fas fa-star-half-stroke"></i>
                                <span>Re-Evaluate (After Training)</span>
                            </button>
                        ` : (!allTasksDone ? `
                            <button disabled class="px-3.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold rounded-xl cursor-not-allowed flex items-center space-x-1 inline-flex" title="All shift monitoring tasks must be 100% completed before appraisal evaluation.">
                                <i class="fas fa-lock text-[10px]"></i>
                                <span>Tasks Incomplete</span>
                            </button>
                        ` : `
                            <button onclick="triggerEvaluationForEmployee('${emp.id}')" class="px-3.5 py-1.5 ${hasEval ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-primary hover:bg-primary-dark'} text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1 inline-flex">
                                <i class="fas fa-star-half-stroke"></i>
                                <span>${hasEval ? 'Re-Evaluate' : 'Evaluate'}</span>
                            </button>
                        `))}
                    `}
                </td>
            </tr>
        `;
    }).join('');

    renderPaginationControls('monitoring-pagination-container', monitoringCurrentPage, list.length, monitoringPageSize, 'setMonitoringPage', 'setMonitoringPageSize');
}
window.renderMonitoringRosterTable = renderMonitoringRosterTable;

/**
 * Navigate to Phase 4 (Formal Appraisal) and open appraisal evaluation for employee
 */
function triggerEvaluationForEmployee(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || { id: empId };
    if (!emp) return;

    window.selectedEmployeeContext = emp;
    window.selectedEvalEmpId = emp.id;

    // Check if in training without score
    const inTraining = isEmployeeInTraining(emp.id);
    const isScored = isEmployeeTrainingScored(emp.id);
    const isPostTraining = inTraining && isScored;

    if (inTraining && !isScored) {
        if (typeof showToast === 'function') {
            showToast(`⚠️ Cannot evaluate ${emp.name || 'Associate'}: Associate is currently enrolled in Mandatory Formal Training. Re-evaluation is locked until training score is recorded.`, 'warning');
        }
        return;
    }

    // Switch to Phase 4 (Appraisal)
    if (typeof switchSubTab === 'function') {
        switchSubTab('perf', 'eval');
    }

    // After tab switch, select employee and open appraisal form
    setTimeout(() => {
        if (typeof renderEvaluationRosterTable === 'function') {
            renderEvaluationRosterTable();
        }
        if (typeof showEmployeeEvalDetail === 'function') {
            showEmployeeEvalDetail(emp.id, false);
        }
        if (typeof openAppraisalModal === 'function') {
            openAppraisalModal(emp.id, isPostTraining);
        }
    }, 60);
}
window.triggerEvaluationForEmployee = triggerEvaluationForEmployee;

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
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Saving Progress...';
    }

    try {
        // Save milestone & KPI progress dynamically to performance_monitoring table
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
            showToast(`🎉 Shift monitoring log saved for ${emp.name}!`, 'success');
        }

        if (typeof loadLiveNotifications === 'function') {
            loadLiveNotifications(window.activePersonaRole || 'Supervisor');
        }
    } catch (err) {
        console.error('Error saving milestone:', err);
        if (typeof showToast === 'function') {
            showToast(err.message || 'Failed to save milestone.', 'error');
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
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || (window.perfRoster || [])[0];
    if (!emp) return;

    const inTraining = isEmployeeInTraining(emp.id);
    const isScored = isEmployeeTrainingScored(emp.id);
    const isPostTraining = inTraining && isScored;

    // 1. Switch to Phase 4 Appraisal
    if (typeof switchSubTab === 'function') {
        switchSubTab('perf', 'eval');
    }

    // 2. Search employee name in Phase 4 search bar
    const searchInput = document.getElementById('search-eval-emp') || document.getElementById('eval-search-input');
    if (searchInput) {
        searchInput.value = emp.name;
    }
    window.evalSearchQuery = emp.name;
    if (typeof evalCurrentPage !== 'undefined') evalCurrentPage = 1;

    // 3. Render Phase 4 table and select employee
    if (typeof renderEvaluationRosterTable === 'function') {
        renderEvaluationRosterTable();
    }
    if (typeof showEmployeeEvalDetail === 'function') {
        showEmployeeEvalDetail(emp.id, false);
    }

    // 4. Open Appraisal Modal for this employee
    if (typeof openAppraisalModal === 'function') {
        openAppraisalModal(emp.id, isPostTraining);
    }
}
window.triggerEvaluationForEmployee = triggerEvaluationForEmployee;
