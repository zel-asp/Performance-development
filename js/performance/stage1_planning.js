/**
 * Oxford Suites, Makati — Performance Management Module
 * Sub-Module: Stage 1 — Goal Planning, Objectives & KPI Templates
 */

async function loadAndRenderPlanningGoals() {
    renderPerformanceSkeletons();
    const gl = document.getElementById('kpi-goals-loading');
    if (gl) gl.classList.remove('hidden');
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
        if (data.draft_plans && typeof data.draft_plans === 'object') {
            window.dbDraftPlans = Object.assign(window.dbDraftPlans || {}, data.draft_plans);
        }

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

        // Fast batch render of active table & cached badges
        renderEmployeePulseGoals(goals);
        renderActiveStageTable();
        updateAllPerfStepperBadges();

        // Render remaining background tables asynchronously so UI never hitches
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                renderAllStageTables();
            });
        } else {
            setTimeout(() => {
                renderAllStageTables();
            }, 50);
        }

    } catch (err) {
        console.warn('Fallback to local state rendering:', err);
        renderEmployeePulseGoals(window.dbGoals || []);
        renderActiveStageTable();
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
        return isSameEmployee(goalEmpId, currentUserId) ||
               (userObj.id && isSameEmployee(goalEmpId, userObj.id)) ||
               (userObj.employee_code && isSameEmployee(goalEmpId, userObj.employee_code)) ||
               (isAssociate && (goalEmpId === 'emp-101' || goalEmpId === 'emp-1' || goalEmpId === 'oxf-emp-1001' || goalEmpId === 'emp-001' || goalEmpId === '3a52667f-53cf-412a-b048-ef96eb407707'));
    });

    const totalGoalCount = empGoals.length;
    const completedOrApprovedCount = empGoals.filter(g => {
        const st = (g.status || '').toLowerCase();
        return st === 'approved' || st === 'completed' || st === 'passed' || st === 'done';
    }).length;
    const inProgressCount = totalGoalCount - completedOrApprovedCount;
    const pct = totalGoalCount > 0 ? Math.round((completedOrApprovedCount / totalGoalCount) * 100) : 0;

    if (countBadge) {
        countBadge.textContent = `${totalGoalCount}/2 Objectives`;
    }

    const kpiGoalsRatio = document.getElementById('kpi-goals-ratio');
    if (kpiGoalsRatio) {
        kpiGoalsRatio.textContent = `${completedOrApprovedCount} of ${totalGoalCount} Passed (${totalGoalCount}/2 Set)`;
    }

    const kpiGoalsPct = document.getElementById('kpi-goals-pct');
    if (kpiGoalsPct) {
        kpiGoalsPct.textContent = `${pct}%`;
    }

    const kpiGoalsStatus = document.getElementById('kpi-goals-status');
    if (kpiGoalsStatus) {
        if (totalGoalCount === 0) {
            kpiGoalsStatus.className = 'text-xs text-slate-400 font-semibold';
            kpiGoalsStatus.innerHTML = 'No Goals Set';
        } else if (pct >= 75) {
            kpiGoalsStatus.className = 'text-xs text-sage-dark font-semibold';
            kpiGoalsStatus.innerHTML = '<i class="fas fa-check"></i> On Track';
        } else {
            kpiGoalsStatus.className = 'text-xs text-dusty-dark font-semibold';
            kpiGoalsStatus.innerHTML = '<i class="fas fa-clock"></i> In Progress';
        }
    }

    const kpiGoalsBar = document.getElementById('kpi-goals-bar');
    if (kpiGoalsBar) {
        kpiGoalsBar.style.width = `${pct}%`;
    }

    const kpiGoalsSub = document.getElementById('kpi-goals-subtitle');
    if (kpiGoalsSub) {
        kpiGoalsSub.textContent = totalGoalCount === 0 ? '0 goals in progress' : `${inProgressCount} goals in progress`;
    }

    const goalsLoading = document.getElementById('kpi-goals-loading');
    if (goalsLoading) {
        goalsLoading.classList.add('hidden');
    }

    // Fetch prescribed LMS list if not cached yet
    if ((!window.dynamicLmsState || !window.dynamicLmsState.prescribed) && !window._fetchingPulsePrescribed) {
        window._fetchingPulsePrescribed = true;
        fetch('api/lms.php?action=get_prescribed')
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
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center space-x-1 shadow-2xs">
                    <i class="fas fa-times-circle text-rose-600 text-[9px]"></i>
                    <span>Failed (Remediation)</span>
                </span>
            `;
        } else if (statusLower === 'completed') {
            statusBadgeHtml = `
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 inline-flex items-center space-x-1 shadow-2xs">
                    <i class="fas fa-circle-check text-indigo-600 text-[9px]"></i>
                    <span>Completed</span>
                </span>
            `;
        } else if (g.in_training || g.needs_training) {
            statusBadgeHtml = `
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center space-x-1 shadow-2xs">
                    <i class="fas fa-graduation-cap text-amber-700 text-[9px]"></i>
                    <span>In Training</span>
                </span>
            `;
        } else if (statusLower === 'approved') {
            statusBadgeHtml = `
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center space-x-1 shadow-2xs">
                    <i class="fas fa-check-circle text-emerald-600 text-[9px]"></i>
                    <span>Approved &amp; Active</span>
                </span>
            `;
        } else {
            statusBadgeHtml = `
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center space-x-1 shadow-2xs">
                    <i class="fas fa-clock text-amber-600 text-[9px]"></i>
                    <span>Pending Approval</span>
                </span>
            `;
        }

        const tasks = g.tasks || [];
        const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
        const totalTasksCount = tasks.length;
        const progressPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : (g.status === 'Completed' ? 100 : 0);

        // Check for linked prescribed LMS
        const prescribedList = (window.dynamicLmsState && window.dynamicLmsState.prescribed) || window.dbPrescribedLms || [];
        const matchedLms = prescribedList.find(p => {
            if (p.goal_id && String(p.goal_id) === String(g.id)) return true;
            if (g.lms_id && String(p.lms_id) === String(g.lms_id)) return true;
            return false;
        });
        const lmsTitle = matchedLms ? (matchedLms.document_title || matchedLms.title) : (g.lms_title || g.lms_doc_title || g.prescribed_lms);

        return `
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between hover:border-primary/40 transition">
                <div class="space-y-2.5">
                    <div class="flex items-center justify-between gap-2 flex-wrap">
                        <div class="flex items-center space-x-1.5">
                            ${statusBadgeHtml}
                            ${isRevised ? `<span class="px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center space-x-0.5"><i class="fas fa-pen-to-square text-[7px]"></i><span>Revised</span></span>` : ''}
                        </div>
                        <div class="flex items-center space-x-1.5">
                            <span class="text-[9px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">${idx + 1}/${empGoals.length}</span>
                            <span class="text-[10px] text-slate-400 font-mono">Due: ${g.target_date || 'Q3 2026'}</span>
                        </div>
                    </div>

                    <div>
                        <h4 class="font-bold text-slate-900 text-sm leading-snug hover:text-primary transition cursor-pointer" onclick="openViewGoalModal('${g.id}')">${g.title}</h4>
                        <p class="text-[11px] text-slate-500 mt-0.5">${g.department || 'Front Office'} &middot; <span class="font-mono text-primary font-bold">${g.target_metric}</span></p>
                    </div>

                    <!-- Compact Progress & Tasks summary -->
                    <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5">
                        <div class="flex items-center justify-between text-[10px] font-bold">
                            <span class="text-slate-700 flex items-center space-x-1">
                                <i class="fas fa-chart-line text-primary text-[9px]"></i>
                                <span>Goal Execution</span>
                            </span>
                            <span class="font-mono text-primary">${progressPct}% (${completedTasksCount}/${totalTasksCount} Tasks Done)</span>
                        </div>
                        <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div class="${progressPct >= 100 ? 'bg-emerald-500' : (isFailed ? 'bg-rose-500' : 'bg-primary')} h-1.5 rounded-full transition-all duration-500" style="width: ${progressPct}%"></div>
                        </div>
                    </div>

                    ${lmsTitle ? `
                        <div class="p-2 bg-blue-50/70 rounded-xl border border-blue-200/70 text-[10px] text-blue-900 flex items-center justify-between">
                            <span class="truncate font-medium"><i class="fas fa-book-bookmark mr-1 text-blue-600"></i>${lmsTitle}</span>
                            <span class="text-[9px] font-bold text-blue-700 uppercase">Prescribed LMS</span>
                        </div>
                    ` : ''}
                </div>

                <!-- Footer with Action Buttons -->
                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                    <span class="text-[10px] text-slate-400 font-medium">${g.weight ? g.weight.split(' ')[0] : '20%'} Weight</span>
                    <div class="flex items-center space-x-1.5">
                        ${(g.status === 'Completed' || statusLower === 'completed') ? `
                            <button disabled class="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60">
                                <i class="fas fa-lock text-[8px] mr-0.5"></i>
                                <span>Self Reviewed</span>
                            </button>
                        ` : `
                            <button type="button" onclick="openEmployeeSelfEvalModal('${g.id}', '${g.employee_id || currentUserId}')" class="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition inline-flex items-center space-x-1 shadow-2xs" title="Submit Self Review Rating">
                                <i class="fas fa-user-pen text-[9px] text-purple-600"></i>
                                <span>Self Review</span>
                            </button>
                        `}
                        <button type="button" onclick="openViewGoalModal('${g.id}')" class="btn-primary px-3 py-1 text-[11px] font-bold shadow-2xs inline-flex items-center space-x-1">
                            <i class="fas fa-list-check text-[10px]"></i>
                            <span>View Details &amp; Checklist</span>
                        </button>
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
    if (previewEl) previewEl.innerHTML = `<i class="fas fa-star text-amber-500 mr-1"></i>${currentScore.toFixed(2)} / 5.0`;

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
        message: `Submit a self evaluation rating of ${rating.toFixed(2)} / 5.0 for this performance objective? This will be recorded directly into your calibration record.`,
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
                    showToast(`Self evaluation of ${rating.toFixed(2)}/5.0 submitted successfully!`, 'success');
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
        renderPaginationControls('planning-pagination-container', 1, 0, planningPageSize, 'setPlanningPage', 'setPlanningPageSize');
        updateStage1BulkDeleteState();
        return;
    }

    const isAll = planningPageSize === 'all';
    const effectivePageSize = isAll ? allGoals.length : planningPageSize;
    const totalPages = isAll ? 1 : (Math.ceil(allGoals.length / effectivePageSize) || 1);
    if (planningCurrentPage > totalPages) {
        planningCurrentPage = totalPages;
    }
    if (planningCurrentPage < 1) {
        planningCurrentPage = 1;
    }

    const startIdx = isAll ? 0 : (planningCurrentPage - 1) * effectivePageSize;
    const pageGoals = isAll ? allGoals : allGoals.slice(startIdx, startIdx + effectivePageSize);

    tbody.innerHTML = pageGoals.map((goal, index) => {
        let emp = window.perfRoster.find(e => isSameEmployee(e.id, goal.employee_id));
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

        const tasks = goal.tasks || [];
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const totalTasks = tasks.length;
        const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (isCompleted ? 100 : 0);

        return `
            <tr class="hover:bg-slate-50/80 transition text-xs border-b border-slate-100 ${index === 0 ? 'bg-emerald-50/10' : ''}">
                <!-- Checkbox Column -->
                <td class="px-4 py-4 text-center">
                    <input type="checkbox" class="stage1-goal-checkbox rounded border-slate-300 text-primary focus:ring-primary" value="${goal.id}" onchange="updateStage1BulkDeleteState()">
                </td>

                <!-- Numbering Column -->
                <td class="px-3 py-4 text-center font-mono font-bold text-slate-400 text-xs">
                    ${startIdx + index + 1}
                </td>

                <!-- 1. Employee Column -->
                <td class="px-5 py-4">
                    <div>
                        <p class="font-bold text-slate-900 text-xs leading-tight max-w-[160px] truncate" title="${emp.name}">${emp.name}</p>
                        <p class="text-[10px] text-slate-500 font-medium max-w-[160px] truncate" title="${emp.position}">${emp.position}</p>
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
                    <button onclick="confirmDeleteGoal('${goal.id}', '${(goal.title || '').replace(/'/g, "\\'")}', this)" class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 inline-flex items-center justify-center transition shadow-2xs" title="Delete Objective">
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
            </tr>
        `;
    }).join('');

    renderPaginationControls('planning-pagination-container', planningCurrentPage, allGoals.length, planningPageSize, 'setPlanningPage', 'setPlanningPageSize');
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

window.confirmDeleteGoal = function(goalId, goalTitle = 'Objective', btnEl = null) {
    showActionConfirmModal({
        title: 'Delete Performance Objective',
        message: `Are you sure you want to delete "${goalTitle}"? This will permanently remove this goal and its associated tasks.`,
        confirmBtnText: 'Delete Objective',
        confirmBtnClass: 'btn-danger bg-rose-600 hover:bg-rose-700 text-white',
        iconClass: 'fas fa-trash-can',
        iconContainerClass: 'bg-rose-100 text-rose-700',
        onConfirm: async () => {
            let origBtnHtml = '';
            if (btnEl) {
                origBtnHtml = btnEl.innerHTML;
                btnEl.disabled = true;
                btnEl.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i>';
            }
            try {
                await PerformanceAPI.deleteGoal(goalId);
                showToast('Performance objective deleted successfully.', 'success');
                await loadAndRenderPlanningGoals();
            } catch (err) {
                console.error('Delete goal error:', err);
                showToast(err.message || 'Failed to delete goal', 'error');
            } finally {
                if (btnEl) {
                    btnEl.disabled = false;
                    btnEl.innerHTML = origBtnHtml;
                }
            }
        }
    });
};

window.confirmBulkDeleteStage1 = function() {
    const selected = Array.from(document.querySelectorAll('.stage1-goal-checkbox:checked')).map(cb => cb.value);
    if (selected.length === 0) return;
    const bulkBtn = document.getElementById('btn-stage1-bulk-delete');

    showActionConfirmModal({
        title: 'Bulk Delete Objectives',
        message: `Are you sure you want to delete ${selected.length} selected objective(s)?`,
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

    const storedUser = JSON.parse(localStorage.getItem('oxford_session_user') || '{}');
    const isAssociate = (typeof activePersonaKey !== 'undefined' && (activePersonaKey === 'associate' || activePersonaKey === 'employee'));
    const currentUserId = window.currentUser?.id || storedUser.id || (isAssociate ? 'emp-101' : 'emp-102');
    const currentRole = window.currentUser?.role || storedUser.role || (isAssociate ? 'Associate' : 'Supervisor');

    const selectedOpt = scopeSelect && scopeSelect.selectedIndex >= 0 ? scopeSelect.options[scopeSelect.selectedIndex] : null;
    let employeeId = isAssociate ? currentUserId : (selectedOpt && selectedOpt.value !== 'dept' && selectedOpt.value !== 'property' ? selectedOpt.value : currentUserId);
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
                    showToast(`Performance objective "${title}" successfully saved!`, 'success');
                }

                // Close modal & reset form
                if (typeof closeModal === 'function') {
                    closeModal('modal-create-goal');
                }
                const form = document.getElementById('form-create-goal');
                if (form) form.reset();

                // Refresh Planning Tab & Employee Dashboard with Live State
                await loadAndRenderPlanningGoals();
                if (typeof loadLiveNotifications === 'function') {
                    loadLiveNotifications(window.activePersonaRole || 'Supervisor');
                }
            } catch (err) {
                console.error('Goal submit error:', err);
                if (typeof showToast === 'function') {
                    showToast(err.message || 'Failed to save goal.', 'error');
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
    if (mgrRatEl) mgrRatEl.innerHTML = `<i class="fas fa-star text-amber-500 mr-1"></i>${(emp.managerRating || 4.6).toFixed(1)}`;
    if (custRatEl) custRatEl.innerHTML = `<i class="fas fa-star text-amber-500 mr-1"></i>${(emp.customerRating || 4.8).toFixed(1)}`;

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
                    </div>
                    <div class="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-0.5">
                        ${tasks.length > 0 ? tasks.map(t => {
                            const isDone = t.status === 'completed';
                            const completedDateStr = t.completed_at ? new Date(t.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                            const lmsInfo = (typeof checkLmsTaskProgress === 'function') ? checkLmsTaskProgress(t, g.employee_id) : { isLmsTask: false };
                            return `
                                <div class="p-2.5 rounded-xl border ${isDone ? 'bg-emerald-50/60 border-emerald-200/90 text-emerald-950 shadow-2xs' : 'bg-white border-slate-200 text-slate-800 hover:border-primary/30'} text-[11px] space-y-1.5 transition">
                                    <div class="flex items-start justify-between gap-2">
                                        <label class="flex items-start space-x-2.5 cursor-pointer flex-1 select-none">
                                            <input type="checkbox" ${isDone ? 'checked disabled' : `onchange="triggerTaskCompletionModal('${t.id}', '${g.id}', this)"`} class="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                                            <div class="space-y-0.5">
                                                <div class="flex items-center space-x-1.5 flex-wrap">
                                                    <span class="${isDone ? 'line-through text-slate-500 font-medium' : 'font-semibold text-slate-900'} leading-snug">${t.title}</span>
                                                    <span class="text-[9px] px-1.5 py-0.2 rounded font-bold ${t.task_type === 'specific' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}">${t.task_type === 'specific' ? 'Specific' : 'General'}</span>
                                                </div>
                                                ${t.description ? `<p class="text-[10px] text-slate-500">${t.description}</p>` : ''}
                                                ${lmsInfo.isLmsTask ? `
                                                    <div class="flex items-center space-x-1.5 pt-0.5">
                                                        <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${lmsInfo.canComplete ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-900 border border-amber-200'}">
                                                            <i class="fas fa-book-open text-[8px]"></i>
                                                            <span>LMS: ${lmsInfo.progress}%</span>
                                                            ${!lmsInfo.canComplete ? '<span class="text-[8px] font-extrabold text-amber-700">(Req: 100%)</span>' : '<i class="fas fa-check text-[8px] text-emerald-600 ml-0.5"></i>'}
                                                        </span>
                                                        ${!lmsInfo.canComplete && lmsInfo.lmsId ? `
                                                            <button type="button" onclick="closeModal('modal-view-goal'); openBookReader('${lmsInfo.lmsId}')" class="text-primary hover:underline font-bold text-[9px] inline-flex items-center space-x-0.5">
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
                                                    ✓ Done ${completedDateStr ? `(${completedDateStr})` : ''}
                                                </span>
                                            ` : `
                                                <button type="button" onclick="openCompleteTaskModal('${t.id}', '${g.id}')" class="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition inline-flex items-center space-x-1 shadow-2xs" title="Click to log reflections and complete task">
                                                    <i class="fas fa-feather-pointed text-[8px]"></i>
                                                    <span>Log Experience</span>
                                                </button>
                                                <span class="text-[9px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                                    Due: ${t.target_date || 'Q3'}
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
                        }).join('') : `<p class="text-[10px] text-slate-400 italic py-2 text-center bg-white rounded-xl border border-slate-100">No action tasks assigned to this objective yet.</p>`}
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
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> Saving Changes...';
        }

        // Call AJAX endpoint to update database
        await PerformanceAPI.reviseGoal(goalId, updates);

        // Close modal and refresh Planning roster & pulse cards
        closeModal('modal-revise-goal');
        await loadAndRenderPlanningGoals();
        if (typeof loadLiveNotifications === 'function') {
            loadLiveNotifications(window.activePersonaRole || 'Associate');
        }

        if (typeof showToast === 'function') {
            showToast('Performance goal objectives successfully revised!', 'success');
        }
    } catch (err) {
        console.error('Failed to save goal revision:', err);
        if (typeof showToast === 'function') {
            showToast(err.message || 'Failed to save revisions.', 'error');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
}

