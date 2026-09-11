/**
 * Oxford Suites, Makati — Performance Management Module
 * Sub-Module: Stage 1 — Goal Planning, Objectives & KPI Templates
 */

async function loadAndRenderPlanningGoals(silent = false) {
    // 0. Instant Cache Pre-Hydration (0ms Latency on Page Refresh)
    if (!window.dbGoals || window.dbGoals.length === 0) {
        const cached = window.PerfCache ? window.PerfCache.get('planning_data') : null;
        if (cached && Array.isArray(cached.goals) && cached.goals.length > 0) {
            window.dbGoals = cached.goals;
            window.dbGeneralTasks = cached.general_tasks || [];
            if (cached.draft_plans) window.dbDraftPlans = cached.draft_plans;
            if (cached.roster) window.perfRoster = cached.roster;
            if (cached.evaluations) window.dbEvaluations = cached.evaluations;
            if (cached.training_needs) window.dbTrainingNeeds = cached.training_needs;

            renderEmployeePulseGoals(cached.goals);
            renderActiveStageTable();
            updateAllPerfStepperBadges();
        }
    }

    if (!silent && (!window.dbGoals || window.dbGoals.length === 0)) {
        renderPerformanceSkeletons();
        if (typeof showStage1TableLoading === 'function') showStage1TableLoading(true, 'Loading objectives...');
        if (typeof renderStage1TableSkeleton === 'function') renderStage1TableSkeleton(3);
        const gl = document.getElementById('kpi-goals-loading');
        if (gl) gl.classList.remove('hidden');
    }

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

        // Extract real employees from backend
        const dbEmployees = Array.isArray(data.employees) ? data.employees : [];
        if (dbEmployees.length > 0) {
            window.dbEmployees = dbEmployees;
            window.perfRoster = dbEmployees.map(u => {
                const role = u.role || 'Employee';
                const isSup = role.toLowerCase().includes('supervisor') || role.toLowerCase().includes('manager');
                const name = u.full_name || u.name || 'Associate';
                const initials = name.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'EM';
                return {
                    id: u.id,
                    employee_code: u.employee_code || u.id,
                    name: name,
                    position: u.title || u.position || (isSup ? 'Supervisor' : 'Associate'),
                    department: u.department || 'Hotel Operations',
                    avatar: initials,
                    avatarBg: isSup ? 'bg-amber-600' : 'bg-primary',
                    role: role,
                    goals: []
                };
            });
        }

        // High-performance O(1) Employee Hash Map index
        const empMap = new Map();
        (window.perfRoster || []).forEach(emp => {
            emp.goals = []; // Reset goals before mapping
            if (emp.id) empMap.set(String(emp.id).toLowerCase().trim(), emp);
            if (emp.employee_code) empMap.set(String(emp.employee_code).toLowerCase().trim(), emp);
        });

        // Apply monitoring roster fields if available
        if (monResult.status === 'fulfilled' && monResult.value?.roster && Array.isArray(monResult.value.roster)) {
            monResult.value.roster.forEach(dynEmp => {
                const idKey = String(dynEmp.id || '').toLowerCase().trim();
                const codeKey = String(dynEmp.employee_code || '').toLowerCase().trim();
                const existing = empMap.get(idKey) || (codeKey ? empMap.get(codeKey) : null) || (window.perfRoster || []).find(e => isSameEmployee(e.id, dynEmp.id) || isSameEmployee(e.employee_code, dynEmp.id));
                if (existing) {
                    Object.assign(existing, dynEmp);
                } else {
                    window.perfRoster.push(dynEmp);
                    if (dynEmp.id) empMap.set(idKey, dynEmp);
                    if (dynEmp.employee_code) empMap.set(codeKey, dynEmp);
                }
            });
        }

        // Map DB goals strictly to real employees via O(1) lookup
        goals.forEach(g => {
            const empId = (g.employee_id || '').toString().toLowerCase().trim();
            let emp = empMap.get(empId) || (window.perfRoster || []).find(e => isSameEmployee(e.id, empId) || isSameEmployee(e.employee_code, empId));

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

        // Stale-While-Revalidate session caching for 180 seconds
        if (window.PerfCache) {
            window.PerfCache.set('planning_data', {
                goals: goals,
                general_tasks: generalTasks,
                draft_plans: window.dbDraftPlans,
                roster: window.perfRoster,
                evaluations: window.dbEvaluations,
                training_needs: window.dbTrainingNeeds
            }, 180);
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
    } finally {
        if (!silent) {
            const gl = document.getElementById('kpi-goals-loading');
            if (gl) gl.classList.add('hidden');
            if (typeof showStage1TableLoading === 'function') showStage1TableLoading(false);
        }
    }
}

/**
 * AI Objective Summary & Coaching Helpers (Oxford Suites GenUI)
 */
function getInitialGoalCoaching(goal) {
    if (!goal) {
        return {
            summary: "Deliver consistent hospitality service excellence aligned with Oxford Suites operational standards.",
            coaching_tip: "Break milestones into shift routines and consult your supervisor during floor touchpoints.",
            key_focus: "Goal Delivery"
        };
    }

    try {
        const cached = localStorage.getItem('oxford_ai_goal_coaching_' + goal.id);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.summary && parsed.coaching_tip) return parsed;
        }
    } catch (e) {}

    const lower = ((goal.title || '') + ' ' + (goal.target_metric || '')).toLowerCase();
    if (lower.includes('check-in') || lower.includes('front desk') || lower.includes('pms') || lower.includes('reception')) {
        return {
            summary: "Prioritize swift, warm guest arrivals by maintaining check-in processing under 3 minutes with zero PMS billing errors.",
            coaching_tip: "Pre-key room access cards during peak arrival windows and apply the LAST recovery model if delays occur.",
            key_focus: "Check-in Speed"
        };
    } else if (lower.includes('turnover') || lower.includes('housekeeping') || lower.includes('inspection') || lower.includes('suite')) {
        return {
            summary: "Ensure complete 18-point suite cleanliness and fixture inspection standards within target room turnover turnaround.",
            coaching_tip: "Double-check bathroom sanitation and linen alignment before updating room status to inspected in PMS.",
            key_focus: "Room Readiness"
        };
    } else if (lower.includes('haccp') || lower.includes('food') || lower.includes('culinary') || lower.includes('kitchen') || lower.includes('sanitation')) {
        return {
            summary: "Adhere strictly to Oxford Suites culinary food safety and sanitation benchmarks across all preparation lines.",
            coaching_tip: "Monitor walk-in chiller logs twice daily and maintain strict FIFO rotation for all prepped items.",
            key_focus: "HACCP Safety"
        };
    } else if (lower.includes('table') || lower.includes('dining') || lower.includes('f&b') || lower.includes('beverage') || lower.includes('server')) {
        return {
            summary: "Deliver seamless dining service by adhering to 2-minute greeting and 3-minute beverage service standards.",
            coaching_tip: "Coordinate closely with the expeditor during dinner rush to ensure smooth table turnovers without rushing guests.",
            key_focus: "Service Pacing"
        };
    } else {
        return {
            summary: `Drive consistent operational standards towards your target metric of ${goal.target_metric || 'departmental excellence'}.`,
            coaching_tip: "Break milestones down into daily shift routines and verify progress with your supervisor during shift huddles.",
            key_focus: "Goal Delivery"
        };
    }
}

async function fetchDynamicGoalCoaching(goal, force = false) {
    if (!goal || !goal.id) return;

    const tipEl = document.getElementById(`ai-coaching-tip-${goal.id}`);
    const summaryEl = document.getElementById(`ai-summary-text-${goal.id}`);
    const focusEl = document.getElementById(`ai-focus-tag-${goal.id}`);

    if (!force) {
        try {
            const cached = localStorage.getItem('oxford_ai_goal_coaching_' + goal.id);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (summaryEl && parsed.summary) summaryEl.textContent = parsed.summary;
                if (tipEl && parsed.coaching_tip) tipEl.textContent = parsed.coaching_tip;
                if (focusEl && parsed.key_focus) focusEl.textContent = parsed.key_focus;
                return;
            }
        } catch (e) {}
    }

    if (!window._aiGoalFetching) window._aiGoalFetching = {};
    if (window._aiGoalFetching[goal.id]) return;
    window._aiGoalFetching[goal.id] = true;

    try {
        const res = await fetch('api/ai.php?action=goal_coaching', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                goal_id: goal.id,
                title: goal.title,
                target_metric: goal.target_metric,
                department: goal.department,
                status: goal.status,
                progress_pct: goal.progress_pct || 0,
                tasks: goal.tasks || [],
                employee_name: window.currentUser?.name || (window.activePersonaRole === 'Supervisor' ? 'Marco Rossi' : 'Maria Santos'),
                user_id: window.currentUser?.id || 'emp-101'
            })
        });

        const json = await res.json();
        if (json.success && json.data) {
            const coaching = json.data;
            try {
                localStorage.setItem('oxford_ai_goal_coaching_' + goal.id, JSON.stringify(coaching));
            } catch (e) {}

            if (summaryEl && coaching.summary) summaryEl.textContent = coaching.summary;
            if (tipEl && coaching.coaching_tip) tipEl.textContent = coaching.coaching_tip;
            if (focusEl && coaching.key_focus) focusEl.textContent = coaching.key_focus;
        }
    } catch (e) {
        console.warn(`[AI Coaching] Dynamic fetch fallback for goal ${goal.id}:`, e);
    } finally {
        window._aiGoalFetching[goal.id] = false;
    }
}

async function refreshGoalAiCoaching(goalId, btnEl = null) {
    const goals = window.dbGoals || [];
    const goal = goals.find(g => String(g.id) === String(goalId));
    if (!goal) return;

    const btn = btnEl || (typeof event !== 'undefined' && event?.currentTarget ? event.currentTarget : null) || document.querySelector(`button[onclick*="refreshGoalAiCoaching('${goalId}')"]`);

    const doRefresh = async () => {
        const tipEl = document.getElementById(`ai-coaching-tip-${goalId}`);
        if (tipEl) {
            tipEl.innerHTML = '<span class="inline-flex items-center text-primary"><i class="fas fa-circle-notch fa-spin text-xs mr-1.5"></i>Consulting Gemini AI Coach...</span>';
        }

        try {
            localStorage.removeItem('oxford_ai_goal_coaching_' + goalId);
        } catch (e) {}

        await fetchDynamicGoalCoaching(goal, true);
        if (typeof showToast === 'function') {
            showToast('Gemini AI coaching updated.', 'success');
        }
    };

    if (btn && window.withButtonLock) {
        await window.withButtonLock(btn, doRefresh, {
            loadingText: 'Refreshing...',
            spinnerIcon: 'fa-arrows-rotate fa-spin'
        });
    } else {
        await doRefresh();
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
               (userObj.employee_code && isSameEmployee(goalEmpId, userObj.employee_code));
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

        // Instant & Tailored AI Coaching
        const initialCoaching = getInitialGoalCoaching(g);

        return `
            <div class="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between hover:border-primary/40 transition">
                <div class="space-y-3">
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

                    <!-- AI Objective Summary & Coaching Section -->
                    <div id="ai-coaching-box-${g.id}" class="p-3 bg-linear-to-br from-amber-500/5 via-primary/5 to-purple-500/5 rounded-xl border border-primary/20 shadow-2xs space-y-2 relative overflow-hidden transition-all min-h-37" style="contain: layout style;">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-1.5">
                                <span class="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] shadow-2xs">
                                    <i class="fas fa-sparkles"></i>
                                </span>
                                <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-1">
                                    <span>AI Objective Coaching</span>
                                    <span class="text-[8px] font-normal text-slate-400">· Gemini</span>
                                </span>
                            </div>
                            <span id="ai-focus-tag-${g.id}" class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-2xs">
                                ${initialCoaching.key_focus}
                            </span>
                        </div>

                        <!-- Summary & Floor Tip -->
                        <div class="space-y-1.5 text-[11px]">
                            <p id="ai-summary-text-${g.id}" class="text-slate-700 font-medium leading-relaxed min-h-9">
                                ${initialCoaching.summary}
                            </p>
                            <div class="p-2 bg-white/95 rounded-lg border border-primary/15 shadow-2xs flex items-start space-x-2 text-slate-600">
                                <i class="fas fa-lightbulb text-amber-500 text-xs mt-0.5 shrink-0"></i>
                                <div class="leading-relaxed">
                                    <span class="font-bold text-slate-800 text-[10px] uppercase tracking-wide mr-1">Shift Coaching:</span>
                                    <span id="ai-coaching-tip-${g.id}" class="min-h-8 inline-block">${initialCoaching.coaching_tip}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[10px]">
                            <button type="button" onclick="refreshGoalAiCoaching('${g.id}', this)" class="text-slate-400 hover:text-primary transition inline-flex items-center space-x-1 font-medium" title="Re-evaluate with Gemini AI">
                                <i class="fas fa-arrows-rotate text-[9px]"></i>
                                <span>Refresh AI Tip</span>
                            </button>
                            <button type="button" onclick="AIRefiner.askAboutGoal('${g.id}', '${encodeURIComponent(g.title)}', '${encodeURIComponent(g.target_metric || '')}', '${encodeURIComponent(g.department || '')}')"
                                class="text-primary hover:text-primary-dark font-bold inline-flex items-center space-x-1 transition hover:underline">
                                <i class="fas fa-comments text-[9px]"></i>
                                <span>Deepen Coaching</span>
                                <i class="fas fa-chevron-right text-[8px]"></i>
                            </button>
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
                        ${(() => {
                            const isGoalNeedsTraining = (typeof isEmployeeNeedsTraining === 'function' ? isEmployeeNeedsTraining(g.employee_id || currentUserId, g.id) : (g.needs_training || g.in_training));
                            if (statusLower === 'completed' || statusLower === 'done' || statusLower === 'failed' || isGoalNeedsTraining) {
                                return `
                                    <button disabled class="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60" title="${isGoalNeedsTraining ? 'Self review locked: Associate is undergoing mandatory formal training.' : 'Self evaluation disabled: Objective is ' + (g.status || 'Concluded')}">
                                        <i class="fas fa-lock text-[8px] mr-0.5"></i>
                                        <span>Self Review (Locked)</span>
                                    </button>
                                `;
                            } else {
                                return `
                                    <button type="button" onclick="openEmployeeSelfEvalModal('${g.id}', '${g.employee_id || currentUserId}')" class="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition inline-flex items-center space-x-1 shadow-2xs" title="Submit Self Review Rating">
                                        <i class="fas fa-user-pen text-[9px] text-purple-600"></i>
                                        <span>Self Review</span>
                                    </button>
                                `;
                            }
                        })()}
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
window.getInitialGoalCoaching = getInitialGoalCoaching;
window.fetchDynamicGoalCoaching = fetchDynamicGoalCoaching;
window.refreshGoalAiCoaching = refreshGoalAiCoaching;

function openEmployeeSelfEvalModal(goalId, empId) {
    const goal = (window.dbGoals || []).find(g => String(g.id) === String(goalId));
    if (goal) {
        const st = (goal.status || '').toLowerCase().trim();
        if (st === 'done' || st === 'completed' || st === 'failed') {
            if (typeof showToast === 'function') {
                showToast(`Self evaluation is disabled: Objective is already marked as ${goal.status}.`, 'warning');
            }
            return;
        }
    }
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
    const goal = (window.dbGoals || []).find(g => String(g.id) === String(goalId));
    if (goal) {
        const st = (goal.status || '').toLowerCase().trim();
        if (st === 'done' || st === 'completed' || st === 'failed') {
            if (typeof showToast === 'function') {
                showToast(`Self evaluation is locked: Objective is already marked as ${goal.status}.`, 'warning');
            }
            if (typeof closeModal === 'function') {
                closeModal('modal-submit-self-evaluation');
            }
            return;
        }
    }
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

// Stage 1 Table Loading & Skeleton Helpers
window.showStage1TableLoading = function(show, message = 'Updating Objectives...') {
    const el = document.getElementById('stage1-table-loading');
    const txt = document.getElementById('stage1-loading-text');
    if (!el) return;
    if (show) {
        if (txt) txt.textContent = message;
        el.classList.remove('hidden');
        el.classList.add('flex');
    } else {
        el.classList.add('hidden');
        el.classList.remove('flex');
    }
};

window.renderStage1TableSkeleton = function(rowCount = 3) {
    const tbody = document.getElementById('goals-table-body');
    if (!tbody) return;
    let html = '';
    for (let i = 0; i < rowCount; i++) {
        html += `
            <tr class="animate-pulse border-b border-slate-100">
                <td class="sticky-col-checkbox px-4 py-4 text-center border-b border-slate-100" style="position: sticky; left: 0px; width: 48px; min-width: 48px; max-width: 48px; z-index: 25; background-color: #ffffff !important; background: #ffffff !important; opacity: 1 !important;">
                    <div class="w-4 h-4 bg-slate-200 rounded mx-auto"></div>
                </td>
                <td class="sticky-col-index px-3 py-4 text-center border-b border-slate-100" style="position: sticky; left: 48px; width: 48px; min-width: 48px; max-width: 48px; z-index: 25; background-color: #ffffff !important; background: #ffffff !important; opacity: 1 !important;">
                    <div class="w-4 h-3 bg-slate-200 rounded mx-auto"></div>
                </td>
                <td class="sticky-col-employee px-5 py-4 border-b border-slate-100" style="position: sticky; left: 96px; width: 192px; min-width: 192px; max-width: 192px; z-index: 25; background-color: #ffffff !important; background: #ffffff !important; opacity: 1 !important; border-right: 1px solid #e2e8f0; box-shadow: 4px 0 10px -2px rgba(0,0,0,0.08);">
                    <div class="w-28 h-3.5 bg-slate-200 rounded mb-1.5"></div>
                    <div class="w-20 h-2.5 bg-slate-100 rounded"></div>
                </td>
                <td class="px-5 py-4 bg-white"><div class="w-36 h-3 bg-slate-200 rounded"></div></td>
                <td class="px-5 py-4 bg-white"><div class="w-24 h-5 bg-slate-100 rounded-lg"></div></td>
                <td class="px-5 py-4 bg-white"><div class="w-20 h-3 bg-slate-200 rounded"></div></td>
                <td class="px-5 py-4 bg-white"><div class="w-16 h-4 bg-slate-100 rounded"></div></td>
                <td class="px-5 py-4 bg-white"><div class="w-20 h-2 bg-slate-200 rounded-full"></div></td>
                <td class="px-5 py-4 text-center bg-white"><div class="w-16 h-4 bg-slate-100 rounded-full mx-auto"></div></td>
                <td class="px-5 py-4 text-right bg-white"><div class="w-12 h-6 bg-slate-100 rounded ml-auto"></div></td>
            </tr>
        `;
    }
    tbody.innerHTML = html;
};

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

    if (!window.planningStatusFilter) {
        const statusSelect = document.getElementById('filter-planning-status');
        window.planningStatusFilter = statusSelect ? statusSelect.value : 'pending';
    }

    // Filter by status dropdown (pending / approved / completed / failed / all)
    if (window.planningStatusFilter && window.planningStatusFilter !== 'all') {
        const sf = window.planningStatusFilter.toLowerCase();
        if (sf === 'pending') {
            allGoals = allGoals.filter(g => {
                const st = (g.status || '').toLowerCase().trim();
                return st !== 'approved' && st !== 'completed' && st !== 'done' && st !== 'failed';
            });
        } else if (sf === 'approved') {
            allGoals = allGoals.filter(g => (g.status || '').toLowerCase() === 'approved');
        } else if (sf === 'completed') {
            allGoals = allGoals.filter(g => {
                const st = (g.status || '').toLowerCase().trim();
                return st === 'completed' || st === 'done';
            });
        } else if (sf === 'failed') {
            allGoals = allGoals.filter(g => (g.status || '').toLowerCase() === 'failed');
        }
    }

    if (allGoals.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="p-8 text-center text-slate-400 bg-white">
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
        let emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, goal.employee_id) || isSameEmployee(e.employee_code, goal.employee_id));
        if (!emp && window.dbEmployees) {
            const foundUser = window.dbEmployees.find(u => isSameEmployee(u.id, goal.employee_id) || isSameEmployee(u.employee_code, goal.employee_id));
            if (foundUser) {
                emp = {
                    id: foundUser.id,
                    employee_code: foundUser.employee_code || foundUser.id,
                    name: foundUser.full_name || foundUser.name || 'Associate',
                    position: foundUser.title || foundUser.position || 'Associate',
                    department: foundUser.department || goal.department || 'Hotel Operations'
                };
            }
        }
        if (!emp) {
            emp = {
                id: goal.employee_id,
                name: goal.employee_name || 'Team Member',
                position: goal.role || 'Associate',
                department: goal.department || 'Hotel Operations'
            };
        }
        const goalStatus = (goal.status || '').toLowerCase().trim();
        const isCompleted = goalStatus === 'completed' || goalStatus === 'done';
        const isApproved = goalStatus === 'approved';
        const isFailed = goalStatus === 'failed';
        const isPending = goalStatus === 'pending approval' || goalStatus === 'pending' || goalStatus === 'draft' || (!isCompleted && !isApproved && !isFailed);
        const isRevised = !!goal.supervisor_notes || (goal.updated_at && goal.created_at && goal.updated_at !== goal.created_at);

        const tasks = goal.tasks || [];
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const totalTasks = tasks.length;
        const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (isCompleted ? 100 : 0);

        const rowBgClass = 'bg-white group-hover:bg-slate-50';

        return `
            <tr class="group text-xs transition bg-white">
                <!-- Checkbox Column -->
                <td class="sticky-col-checkbox px-4 py-4 text-center sticky left-0 z-25 w-12 min-w-12 max-w-12 border-b border-slate-100 transition" style="position: sticky; left: 0px; width: 48px; min-width: 48px; max-width: 48px; z-index: 25; background-color: #ffffff !important; background: #ffffff !important; opacity: 1 !important;">
                    <input type="checkbox" class="stage1-goal-checkbox rounded border-slate-300 text-primary focus:ring-primary ${!isPending ? 'opacity-30 cursor-not-allowed' : ''}" value="${goal.id}" onchange="updateStage1BulkDeleteState()" ${!isPending ? 'disabled title="Only pending objectives can be deleted"' : ''}>
                </td>

                <!-- Numbering Column -->
                <td class="sticky-col-index px-3 py-4 text-center font-mono font-bold text-slate-400 text-xs sticky left-12 z-25 w-12 min-w-12 max-w-12 border-b border-slate-100 transition" style="position: sticky; left: 48px; width: 48px; min-width: 48px; max-width: 48px; z-index: 25; background-color: #ffffff !important; background: #ffffff !important; opacity: 1 !important;">
                    ${startIdx + index + 1}
                </td>

                <!-- 1. Employee Column -->
                <td class="sticky-col-employee px-5 py-4 sticky left-24 z-25 w-48 min-w-48 max-w-48 border-b border-slate-100 border-r border-slate-200/80 shadow-[4px_0_10px_-2px_rgba(0,0,0,0.08)] transition" style="position: sticky; left: 96px; width: 192px; min-width: 192px; max-width: 192px; z-index: 25; background-color: #ffffff !important; background: #ffffff !important; opacity: 1 !important; border-right: 1px solid #e2e8f0; box-shadow: 4px 0 10px -2px rgba(0,0,0,0.08);">
                    <div>
                        <p class="font-bold text-slate-900 text-xs leading-tight max-w-40 truncate" title="${emp.name}">${emp.name}</p>
                        <p class="text-[10px] text-slate-500 font-medium max-w-40 truncate" title="${emp.position}">${emp.position}</p>
                    </div>
                </td>

                <!-- 2. Objective & Scope -->
                <td class="px-5 py-4 border-b border-slate-100 ${rowBgClass}">
                    <div class="space-y-1 max-w-60">
                        <div class="flex items-center space-x-1.5 flex-wrap">
                            <p class="font-bold text-slate-900 text-xs leading-snug line-clamp-2" title="${goal.title}">${goal.title}</p>
                            ${isRevised ? `<span class="px-1.5 py-0.2 rounded text-[8px] font-bold bg-purple-100 text-purple-700 border border-purple-200">Edited</span>` : ''}
                        </div>
                        <span class="text-[10px] font-bold text-primary bg-primary-50 px-2 py-0.5 rounded inline-block max-w-50 truncate" title="${goal.department || emp.department}">${goal.department || emp.department}</span>
                    </div>
                </td>

                <!-- 3. Target Metric / KPI -->
                <td class="px-5 py-4 border-b border-slate-100 ${rowBgClass}">
                    <span class="text-primary font-bold font-mono text-[11px] bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 block w-fit max-w-45 truncate" title="${goal.target_metric}">
                        ${goal.target_metric}
                    </span>
                </td>

                <!-- 4. Target Date -->
                <td class="px-5 py-4 whitespace-nowrap border-b border-slate-100 ${rowBgClass}">
                    <span class="text-slate-700 font-mono text-xs font-semibold">
                        ${goal.target_date || 'Q3 2026'}
                    </span>
                </td>

                <!-- 5. Weight -->
                <td class="px-5 py-4 whitespace-nowrap border-b border-slate-100 ${rowBgClass}">
                    <span class="text-slate-700 font-bold text-[11px] bg-slate-100 px-2 py-1 rounded-lg">
                        ${goal.weight ? goal.weight.split(' ')[0] : '20%'}
                    </span>
                </td>

                <!-- 6. Checklist Progress -->
                <td class="px-5 py-4 min-w-35 border-b border-slate-100 ${rowBgClass}">
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
                <td class="px-5 py-4 text-center whitespace-nowrap border-b border-slate-100 ${rowBgClass}">
                    ${isFailed ? `
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center space-x-1">
                            <i class="fas fa-times-circle text-rose-600 text-[9px]"></i><span>Failed</span>
                        </span>
                    ` : (isCompleted ? `
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 inline-flex items-center space-x-1">
                            <i class="fas fa-circle-check text-indigo-600 text-[9px]"></i><span>${(goal.status || '').toLowerCase().trim() === 'done' ? 'Done' : 'Completed'}</span>
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
                <td class="px-5 py-4 text-right space-x-1.5 whitespace-nowrap border-b border-slate-100 ${rowBgClass}">
                    ${(() => {
                        const isGoalNeedsTraining = (typeof isEmployeeNeedsTraining === 'function' ? isEmployeeNeedsTraining(emp.id, goal.id) : (goal.needs_training || goal.in_training));
                        if (isGoalNeedsTraining) {
                            return `
                                <button disabled class="px-2.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg text-xs font-semibold cursor-not-allowed opacity-50 inline-flex items-center space-x-1" title="In Training: Objective modifications locked during mandatory formal training">
                                    <i class="fas fa-lock text-[9px]"></i>
                                    <span>Training Locked</span>
                                </button>
                            `;
                        } else if (!isCompleted && !isFailed) {
                            return `
                                <button onclick="openCreateSpecificTaskModal('${goal.id}', '${emp.id}')" class="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-bold shadow-2xs transition inline-flex items-center space-x-1" title="Add Specific Task to this Objective">
                                    <i class="fas fa-plus text-[10px]"></i>
                                    <span>Add Specific Task</span>
                                </button>
                            `;
                        } else {
                            return `
                                <button disabled class="px-2.5 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg text-xs font-semibold cursor-not-allowed opacity-50 inline-flex items-center space-x-1" title="Cannot add tasks: Objective is ${goal.status}">
                                    <i class="fas fa-lock text-[9px]"></i>
                                    <span>Task Locked</span>
                                </button>
                            `;
                        }
                    })()}
                    <button onclick="openViewGoalModal('${goal.id || emp.id}')" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center justify-center transition shadow-2xs" title="View Full Details">
                        <i class="fas fa-eye text-xs"></i>
                    </button>
                    ${(isApproved || isCompleted || isFailed || (typeof isEmployeeNeedsTraining === 'function' && isEmployeeNeedsTraining(emp.id, goal.id))) ? `
                        <button disabled class="w-7 h-7 rounded-lg bg-slate-100 text-slate-300 inline-flex items-center justify-center cursor-not-allowed opacity-40 shadow-2xs" title="Revise disabled for approved, completed, or training locked goals">
                            <i class="fas fa-pen-to-square text-xs"></i>
                        </button>
                    ` : `
                        <button onclick="openReviseGoalModal('${goal.id || emp.id}')" class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center justify-center transition shadow-2xs" title="Edit / Revise Objective">
                            <i class="fas fa-pen-to-square text-xs"></i>
                        </button>
                    `}
                    ${!isPending ? `
                        <button disabled class="w-7 h-7 rounded-lg bg-slate-100 text-slate-300 inline-flex items-center justify-center cursor-not-allowed opacity-40 shadow-2xs" title="Delete disabled: only pending objectives can be deleted">
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                    ` : `
                        <button onclick="confirmDeleteGoal('${goal.id}', '${(goal.title || '').replace(/'/g, "\\'")}', this)" class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 inline-flex items-center justify-center transition shadow-2xs" title="Delete Objective">
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                    `}
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

// Stage 1 Filter & Search Handlers with Smooth Loading Effect
window.filterPlanningByStatus = function(status) {
    window.planningStatusFilter = status;
    planningCurrentPage = 1;
    showStage1TableLoading(true, 'Filtering objectives...');
    setTimeout(() => {
        renderPlanningRosterTable();
        showStage1TableLoading(false);
    }, 100);
};

let planningSearchTimer = null;
window.onPlanningGoalsSearch = function(query) {
    window.planningSearchQuery = query;
    planningCurrentPage = 1;
    clearTimeout(planningSearchTimer);
    showStage1TableLoading(true, 'Searching objectives...');
    planningSearchTimer = setTimeout(() => {
        renderPlanningRosterTable();
        showStage1TableLoading(false);
    }, 150);
};

// Stage 1 Bulk Delete and Single Delete Handlers
window.toggleSelectAllStage1 = function(checked) {
    const checkboxes = document.querySelectorAll('.stage1-goal-checkbox:not(:disabled)');
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
    const allCbs = document.querySelectorAll('.stage1-goal-checkbox:not(:disabled)');
    if (selectAllCb) {
        selectAllCb.checked = allCbs.length > 0 && count === allCbs.length;
    }
};

window.confirmDeleteGoal = function(goalId, goalTitle = 'Objective', btnEl = null) {
    const goal = (window.dbGoals || []).find(g => String(g.id) === String(goalId));
    if (goal) {
        const goalStatus = (goal.status || '').toLowerCase().trim();
        const isPending = goalStatus === 'pending approval' || goalStatus === 'pending' || goalStatus === 'draft' || (!goalStatus);
        if (!isPending) {
            if (typeof showToast === 'function') {
                showToast(`Cannot delete objective: Only pending objectives can be deleted. (Current status: ${goal.status})`, 'warning');
            }
            return;
        }
    }

    const targetRow = btnEl ? btnEl.closest('tr') : document.querySelector(`button[onclick*="'${goalId}'"]`)?.closest('tr');
    const deleteBtn = btnEl || targetRow?.querySelector('button[title="Delete Objective"]');

    showActionConfirmModal({
        title: 'Delete Performance Objective',
        message: `Are you sure you want to delete "${goalTitle}"? This will permanently remove this goal and its associated tasks.`,
        confirmBtnText: 'Delete Objective',
        confirmBtnClass: 'btn-danger bg-rose-600 hover:bg-rose-700 text-white',
        iconClass: 'fas fa-trash-can',
        iconContainerClass: 'bg-rose-100 text-rose-700',
        onConfirm: async () => {
            // Visual loading state on row and table
            if (targetRow) {
                targetRow.classList.add('opacity-50', 'bg-rose-50/30', 'pointer-events-none');
                targetRow.querySelectorAll('button').forEach(b => { b.disabled = true; });
            }
            if (deleteBtn) {
                deleteBtn.disabled = true;
                deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i>';
            }
            showStage1TableLoading(true, 'Deleting objective...');

            const goalIndex = (window.dbGoals || []).findIndex(g => String(g.id) === String(goalId));
            const goalBackup = goalIndex !== -1 ? window.dbGoals[goalIndex] : null;

            try {
                await PerformanceAPI.deleteGoal(goalId, { status: goalBackup?.status || 'pending' });

                closeModal('modal-action-confirmation');

                if (goalIndex !== -1) {
                    window.dbGoals.splice(goalIndex, 1);
                }
                (window.perfRoster || []).forEach(emp => {
                    if (emp.goals && Array.isArray(emp.goals)) {
                        emp.goals = emp.goals.filter(g => String(g.id) !== String(goalId));
                        emp.goalsCount = emp.goals.length;
                    }
                });

                showToast('Performance objective deleted successfully.', 'success');

                if (targetRow) {
                    targetRow.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                    targetRow.style.opacity = '0';
                    targetRow.style.transform = 'translateX(10px)';
                    setTimeout(() => {
                        renderPlanningRosterTable();
                        updateStage1BulkDeleteState();
                        showStage1TableLoading(false);
                    }, 200);
                } else {
                    renderPlanningRosterTable();
                    updateStage1BulkDeleteState();
                    showStage1TableLoading(false);
                }

                if (typeof updateAllPerfStepperBadges === 'function') updateAllPerfStepperBadges();
                if (typeof renderEmployeePulseGoals === 'function') renderEmployeePulseGoals(window.dbGoals || []);
                if (typeof renderApprovalRosterTable === 'function') renderApprovalRosterTable();

                if (typeof loadAndRenderPlanningGoals === 'function') {
                    await loadAndRenderPlanningGoals(true);
                }
            } catch (err) {
                console.error('Delete goal error:', err);
                closeModal('modal-action-confirmation');
                showStage1TableLoading(false);
                if (targetRow) {
                    targetRow.classList.remove('opacity-50', 'bg-rose-50/30', 'pointer-events-none');
                    targetRow.querySelectorAll('button').forEach(b => { b.disabled = false; });
                }
                if (deleteBtn) {
                    deleteBtn.disabled = false;
                    deleteBtn.innerHTML = '<i class="fas fa-trash text-xs"></i>';
                }
                showToast(err.message || 'Failed to delete goal', 'error');
            }
        }
    });
};

window.confirmBulkDeleteStage1 = function() {
    const selected = Array.from(document.querySelectorAll('.stage1-goal-checkbox:checked')).map(cb => cb.value);
    if (selected.length === 0) return;

    const pendingSelected = selected.filter(id => {
        const goal = (window.dbGoals || []).find(g => String(g.id) === String(id));
        if (!goal) return false;
        const st = (goal.status || '').toLowerCase().trim();
        return st === 'pending approval' || st === 'pending' || st === 'draft' || (!st);
    });

    if (pendingSelected.length === 0) {
        if (typeof showToast === 'function') {
            showToast('Cannot delete selected objectives: Only pending objectives can be deleted.', 'warning');
        }
        return;
    }

    const count = pendingSelected.length;
    const btnBulk = document.getElementById('btn-stage1-bulk-delete');

    showActionConfirmModal({
        title: 'Bulk Delete Objectives',
        message: `Are you sure you want to delete ${count} selected objective(s)? This will permanently remove them and their associated tasks.`,
        confirmBtnText: `Delete ${count} Goal${count > 1 ? 's' : ''}`,
        confirmBtnClass: 'btn-danger bg-rose-600 hover:bg-rose-700 text-white',
        iconClass: 'fas fa-trash-can',
        iconContainerClass: 'bg-rose-100 text-rose-700',
        onConfirm: async () => {
            if (btnBulk) {
                btnBulk.disabled = true;
                btnBulk.innerHTML = `<i class="fas fa-spinner fa-spin mr-1.5"></i> Deleting (${count})...`;
            }
            showStage1TableLoading(true, `Deleting ${count} selected objective${count > 1 ? 's' : ''}...`);

            pendingSelected.forEach(id => {
                const cb = document.querySelector(`.stage1-goal-checkbox[value="${id}"]`);
                const tr = cb?.closest('tr');
                if (tr) tr.classList.add('opacity-40', 'pointer-events-none');
            });

            try {
                await PerformanceAPI.bulkDeleteGoals(pendingSelected);
                closeModal('modal-action-confirmation');

                window.dbGoals = (window.dbGoals || []).filter(g => !pendingSelected.includes(String(g.id)));
                (window.perfRoster || []).forEach(emp => {
                    if (emp.goals && Array.isArray(emp.goals)) {
                        emp.goals = emp.goals.filter(g => !pendingSelected.includes(String(g.id)));
                        emp.goalsCount = emp.goals.length;
                    }
                });

                showToast(`${count} objective${count > 1 ? 's' : ''} deleted successfully.`, 'success');
                renderPlanningRosterTable();
                updateStage1BulkDeleteState();
                showStage1TableLoading(false);

                if (typeof updateAllPerfStepperBadges === 'function') updateAllPerfStepperBadges();
                if (typeof renderEmployeePulseGoals === 'function') renderEmployeePulseGoals(window.dbGoals || []);
                if (typeof renderApprovalRosterTable === 'function') renderApprovalRosterTable();

                if (typeof loadAndRenderPlanningGoals === 'function') {
                    await loadAndRenderPlanningGoals(true);
                }
            } catch (err) {
                console.error('Bulk delete error:', err);
                closeModal('modal-action-confirmation');
                showStage1TableLoading(false);
                if (btnBulk) {
                    btnBulk.disabled = false;
                    btnBulk.innerHTML = `<i class="fas fa-trash-can mr-1.5"></i> Delete (<span id="stage1-selected-count">${count}</span>)`;
                }
                pendingSelected.forEach(id => {
                    const cb = document.querySelector(`.stage1-goal-checkbox[value="${id}"]`);
                    const tr = cb?.closest('tr');
                    if (tr) tr.classList.remove('opacity-40', 'pointer-events-none');
                });
                showToast(err.message || 'Failed to bulk delete objectives', 'error');
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
                await Promise.all(pendingGoals.map(g => PerformanceAPI.updateGoalStatus(g.id, 'Approved')));
                showToast(`All ${pendingGoals.length} pending goals have been approved!`, 'success');
                await loadAndRenderPlanningGoals();
                if (typeof refreshObjectiveDetailsModal === 'function') {
                    refreshObjectiveDetailsModal();
                }
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
    const roleStr = String(window.activePersonaRole || window.currentUser?.role || storedUser.role || (typeof activePersonaKey !== 'undefined' ? activePersonaKey : '')).toLowerCase().trim();
    const isAssociate = (roleStr === 'associate' || roleStr === 'employee' || roleStr === 'staff');
    const currentUserId = window.currentUser?.id || storedUser.id || (isAssociate ? 'emp-101' : 'emp-102');
    const currentRole = window.currentUser?.role || storedUser.role || (isAssociate ? 'Associate' : 'Supervisor');

    const selectedOpt = scopeSelect && scopeSelect.selectedIndex >= 0 ? scopeSelect.options[scopeSelect.selectedIndex] : null;
    let employeeId = isAssociate ? currentUserId : (selectedOpt && selectedOpt.value !== 'dept' && selectedOpt.value !== 'property' && selectedOpt.value ? selectedOpt.value : currentUserId);
    let role = isAssociate ? 'Associate' : (selectedOpt ? (selectedOpt.getAttribute('data-role') || currentRole) : currentRole);
    const targetScope = selectedOpt ? (selectedOpt.getAttribute('data-scope') || 'single') : 'single';

    // Requirement 0: 1 Max in-progress goal constraint check
    const existingRunningGoal = (window.dbGoals || []).find(g => isSameEmployee(g.employee_id, employeeId) && g.status !== 'Completed');
    if (existingRunningGoal) {
        if (typeof showToast === 'function') {
            showToast(` Cannot create goal: This employee already has an active in-progress goal ("${existingRunningGoal.title}"). Employees can only create a new goal if they have no active goals or their set goals are marked as Completed.`, 'error');
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

function populateGoalEmployeeDropdown() {
    const scopeSelect = document.getElementById('goal-target-scope');
    if (!scopeSelect) return;

    const roster = window.perfRoster || window.dbEmployees || [];
    const associates = roster.filter(u => {
        const r = (u.role || '').toLowerCase();
        return !r.includes('supervisor') && !r.includes('manager') && !r.includes('director') && !r.includes('admin') && !r.includes('generalmanager');
    });

    if (associates.length > 0) {
        scopeSelect.innerHTML = associates.map(u => {
            const name = u.name || u.full_name || 'Staff';
            const dept = u.department || u.dept || 'Front Office & Guest Experience';
            const role = u.role || 'Associate';
            const pos = u.position || u.title || role;
            return `<option value="${u.id}" data-scope="single" data-name="${name}" data-dept="${dept}" data-role="${role}">${name} · ${pos} (${dept})</option>`;
        }).join('');
    }
}
window.populateGoalEmployeeDropdown = populateGoalEmployeeDropdown;


function openViewGoalModal(targetId, isSilentLiveSync = false) {
    if (!targetId && window.currentViewGoalTargetId) {
        targetId = window.currentViewGoalTargetId;
    }
    if (!targetId) return;
    window.currentViewGoalTargetId = targetId;

    // 1. Accurately locate goal or employee
    let targetGoal = (window.dbGoals || []).find(g => String(g.id) === String(targetId));
    let isSpecificGoal = !!targetGoal;
    let emp = null;
    if (targetGoal) {
        emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, targetGoal.employee_id) || isSameEmployee(e.employee_code, targetGoal.employee_id));
    }
    if (!emp) {
        emp = (window.perfRoster || []).find(e => String(e.id) === String(targetId) || String(e.employee_code) === String(targetId) || (e.goals && e.goals.some(g => String(g.id) === String(targetId))));
    }
    if (!targetGoal && emp && Array.isArray(emp.goals) && emp.goals.length > 0) {
        const foundG = emp.goals.find(g => String(g.id) === String(targetId));
        if (foundG) {
            targetGoal = foundG;
            isSpecificGoal = true;
        }
    }
    if (!targetGoal && !emp) {
        targetGoal = (window.dbGoals || []).find(g => String(g.employee_id) === String(targetId));
    }

    if (!emp && targetGoal && window.dbEmployees) {
        const foundUser = window.dbEmployees.find(u => isSameEmployee(u.id, targetGoal.employee_id) || isSameEmployee(u.employee_code, targetGoal.employee_id));
        if (foundUser) {
            emp = {
                id: foundUser.id,
                employee_code: foundUser.employee_code || foundUser.id,
                name: foundUser.full_name || foundUser.name || 'Associate',
                position: foundUser.title || foundUser.position || 'Associate',
                department: foundUser.department || targetGoal.department || 'Hotel Operations',
                attendance: { present: 22, absent: 1, percentage: '96.5%' },
                managerRating: 4.6,
                customerRating: 4.8,
                goals: targetGoal ? [targetGoal] : []
            };
        }
    }

    if (!emp) {
        emp = {
            id: targetGoal?.employee_id || targetId,
            name: targetGoal?.employee_name || 'Team Member',
            position: 'Associate',
            department: targetGoal?.department || 'Hotel Operations',
            attendance: { present: 22, absent: 1, percentage: '96.5%' },
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

    if (empNameEl) empNameEl.innerText = emp.name || 'Associate';
    if (empPosEl) empPosEl.innerText = `${emp.position || 'Associate'} · ${emp.department || targetGoal?.department || 'Oxford Suites'}`;
    if (attEl) attEl.innerText = emp.attendance ? (typeof emp.attendance === 'object' ? (emp.attendance.percentage || '96.5%') : emp.attendance) : '96.5% Attendance';
    
    const mgrRatingVal = emp.supervisorRating || emp.managerRating || (emp.evaluationRecord?.supervisor_rating ? parseFloat(emp.evaluationRecord.supervisor_rating) : 4.6);
    const custRatingVal = emp.customerRating || (emp.evaluationRecord?.self_evaluation ? parseFloat(emp.evaluationRecord.self_evaluation) : 4.8);
    if (mgrRatEl) mgrRatEl.innerHTML = `<i class="fas fa-star text-amber-500 mr-1"></i>${Number(mgrRatingVal).toFixed(1)}`;
    if (custRatEl) custRatEl.innerHTML = `<i class="fas fa-star text-amber-500 mr-1"></i>${Number(custRatingVal).toFixed(1)}`;

    const container = document.getElementById('view-modal-goals-list');
    const scrollEl = document.getElementById('view-modal-scroll-body');
    const prevScroll = scrollEl ? scrollEl.scrollTop : 0;

    if (container) {
        container.innerHTML = '';
        
        let displayGoals = [];
        if (isSpecificGoal && targetGoal) {
            displayGoals = [targetGoal];
        } else if (emp && emp.id) {
            const rosterEmp = (window.perfRoster || []).find(e => isSameEmployee(e.id, emp.id));
            const rosterGoals = (rosterEmp && Array.isArray(rosterEmp.goals) && rosterEmp.goals.length > 0) ? rosterEmp.goals : [];
            const liveGoals = (window.dbGoals || []).filter(g => isSameEmployee(g.employee_id, emp.id));
            displayGoals = liveGoals.length > 0 ? liveGoals : rosterGoals;
            if (displayGoals.length === 0 && targetGoal) {
                displayGoals = [targetGoal];
            }
        } else if (targetGoal) {
            displayGoals = [targetGoal];
        }

        displayGoals.forEach((g, idx) => {
            // Live sync in-memory fields and tasks from window.dbGoals
            if (Array.isArray(window.dbGoals)) {
                const liveG = window.dbGoals.find(dg => String(dg.id) === String(g.id));
                if (liveG) {
                    g.title = liveG.title || g.title;
                    g.status = liveG.status || g.status;
                    g.target_metric = liveG.target_metric || g.target_metric;
                    g.weight = liveG.weight || g.weight;
                    g.evidence = liveG.evidence || g.evidence;
                    g.department = liveG.department || g.department;
                    g.target_date = liveG.target_date || g.target_date;
                    if (liveG.supervisor_notes !== undefined) g.supervisor_notes = liveG.supervisor_notes;
                    if (liveG.tasks) g.tasks = liveG.tasks;
                }
            }
            const goalStatus = (g.status || 'Pending Approval').trim();
            const isApproved = (goalStatus.toLowerCase() === 'approved');
            const isCompleted = (goalStatus.toLowerCase() === 'completed' || goalStatus.toLowerCase() === 'done');
            const isFailed = (goalStatus.toLowerCase() === 'failed');

            const tasks = g.tasks || [];
            const completedCount = tasks.filter(t => t.status === 'completed').length;
            const totalCount = tasks.length;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : (isCompleted ? 100 : 0);

            const div = document.createElement('div');
            div.className = 'p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs';
            div.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900 text-sm">${idx + 1}. ${g.title}</span>
                    <span class="px-2.5 py-0.5 rounded-full font-bold text-[10px] ${isCompleted ? 'bg-indigo-100 text-indigo-800' : (isApproved ? 'bg-emerald-100 text-emerald-800' : (isFailed ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'))}">
                        ${isCompleted ? 'Completed' : (isApproved ? 'Approved' : (isFailed ? 'Failed' : 'Pending Approval'))}
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
                            const isSupervisor = (typeof isCurrentUserSupervisor === 'function') ? isCurrentUserSupervisor() : (window.activePersonaRole === 'Supervisor');
                            const isGoalConcluded = isCompleted || isFailed;
                            const cannotEditReason = isSupervisor
                                ? 'Supervisor cannot edit employee Action Checklist'
                                : (isGoalConcluded ? `Action Checklist is locked: Objective is ${goalStatus}` : '');
                            const isEditDisabled = isSupervisor || isGoalConcluded;
                            const completedDateStr = t.completed_at ? new Date(t.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                            const lmsInfo = (typeof checkLmsTaskProgress === 'function') ? checkLmsTaskProgress(t, g.employee_id) : { isLmsTask: false };
                            return `
                                <div class="p-2.5 rounded-xl border ${isDone ? 'bg-emerald-50/60 border-emerald-200/90 text-emerald-950 shadow-2xs' : 'bg-white border-slate-200 text-slate-800 hover:border-primary/30'} text-[11px] space-y-1.5 transition">
                                    <div class="flex items-start justify-between gap-2">
                                        <label class="flex items-start space-x-2.5 ${isEditDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} flex-1 select-none">
                                            <input type="checkbox" ${isDone ? 'checked disabled' : (isEditDisabled ? `disabled title="${cannotEditReason}"` : `onchange="triggerTaskCompletionModal('${t.id}', '${g.id}', this)"`)} class="mt-0.5 w-4 h-4 rounded border-slate-300 ${isEditDisabled ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-emerald-600 focus:ring-emerald-500 cursor-pointer'}">
                                            <div class="space-y-0.5">
                                                <div class="flex items-center space-x-1.5 flex-wrap">
                                                    <span class="${isDone ? 'line-through text-slate-500 font-medium' : 'font-semibold text-slate-900'} leading-snug">${t.title}</span>
                                                    <span class="text-[9px] px-1.5 py-0.2 rounded font-bold ${t.task_type === 'specific' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}">${t.task_type === 'specific' ? 'Specific' : 'General'}</span>
                                                </div>
                                                ${t.description ? `<p class="text-[10px] text-slate-500">${t.description}</p>` : ''}
                                                ${lmsInfo.isLmsTask ? `
                                                    <div class="flex items-center space-x-1.5 pt-0.5 flex-wrap">
                                                        <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${lmsInfo.isPassed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : (lmsInfo.needsRetest ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-900 border border-amber-200')}">
                                                            <i class="fas ${lmsInfo.isPassed ? 'fa-check text-emerald-600' : (lmsInfo.needsRetest ? 'fa-rotate-left text-rose-600' : 'fa-book-open text-amber-700')} text-[8px]"></i>
                                                            <span>LMS: ${lmsInfo.progress}%</span>
                                                            ${lmsInfo.isPassed ? `<span class="text-[8px] font-bold text-emerald-700">(Passed ${lmsInfo.score || 100}%)</span>` : (lmsInfo.needsRetest ? `<span class="text-[8px] font-extrabold text-rose-700">Needs Re-test (${lmsInfo.score || 0}%)</span>` : '<span class="text-[8px] font-extrabold text-amber-700">(Req: 100%)</span>')}
                                                        </span>
                                                        ${lmsInfo.lmsId ? `
                                                            <button type="button" onclick="closeModal('modal-view-goal'); openBookReader('${lmsInfo.lmsId}')" class="text-primary hover:underline font-bold text-[9px] inline-flex items-center space-x-0.5">
                                                                <i class="fas ${lmsInfo.needsRetest ? 'fa-rotate-left' : 'fa-book-reader'}"></i>
                                                                <span>${lmsInfo.needsRetest ? 'Retake Quiz &rarr;' : 'Read SOP &rarr;'}</span>
                                                            </button>
                                                        ` : ''}
                                                    </div>
                                                ` : ''}
                                            </div>
                                        </label>
                                        <div class="flex items-center space-x-1.5 shrink-0">
                                            ${isDone ? `
                                                <span class="text-[9px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                                                    ✓ Done ${completedDateStr ? `(${completedDateStr})` : ''}
                                                </span>
                                            ` : (isEditDisabled ? `
                                                <button disabled class="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60 shadow-none inline-flex items-center space-x-1" title="${cannotEditReason}">
                                                    <i class="fas fa-lock text-[8px]"></i>
                                                    <span>${isSupervisor ? 'Employee Task' : 'Locked'}</span>
                                                </button>
                                                <span class="text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                                    Due: ${t.target_date || 'Q3'}
                                                </span>
                                            ` : `
                                                <button type="button" onclick="openCompleteTaskModal('${t.id}', '${g.id}')" class="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition inline-flex items-center space-x-1 shadow-2xs" title="Click to log reflections and complete task">
                                                    <i class="fas fa-feather-pointed text-[8px]"></i>
                                                    <span>Log Experience</span>
                                                </button>
                                                <span class="text-[9px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                                    Due: ${t.target_date || 'Q3'}
                                                </span>
                                            `)}
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

    if (scrollEl && isSilentLiveSync) {
        scrollEl.scrollTop = prevScroll;
    }

    if (!isSilentLiveSync) {
        openModal('modal-view-goal');
    }

    // 2. Realtime Background Parity Fetch (Fresh Database Sync)
    if (!isSilentLiveSync && typeof PerformanceAPI !== 'undefined' && PerformanceAPI.getGoalTasks) {
        const goalIdToQuery = isSpecificGoal ? targetGoal?.id : undefined;
        const empIdToQuery = emp?.id || targetGoal?.employee_id;
        PerformanceAPI.getGoalTasks({ goal_id: goalIdToQuery, employee_id: empIdToQuery }).then(res => {
            if (res && res.success && Array.isArray(res.data)) {
                const freshTasks = res.data;
                displayGoals.forEach(dg => {
                    const matched = freshTasks.filter(t => String(t.goal_id) === String(dg.id));
                    if (matched.length > 0) {
                        dg.tasks = matched;
                    } else if (isSpecificGoal && freshTasks.length > 0) {
                        dg.tasks = freshTasks;
                    }
                    if (Array.isArray(window.dbGoals)) {
                        const targetDbGoal = window.dbGoals.find(item => String(item.id) === String(dg.id));
                        if (targetDbGoal) {
                            targetDbGoal.tasks = dg.tasks;
                        }
                    }
                });
                const modal = document.getElementById('modal-view-goal');
                if (modal && !modal.classList.contains('hidden') && window.currentViewGoalTargetId === targetId) {
                    openViewGoalModal(targetId, true);
                }
            }
        }).catch(() => {});
    }
}
window.openViewGoalModal = openViewGoalModal;

function refreshObjectiveDetailsModal() {
    const modal = document.getElementById('modal-view-goal');
    if (modal && !modal.classList.contains('hidden') && window.currentViewGoalTargetId) {
        openViewGoalModal(window.currentViewGoalTargetId, true);
    }
}
window.refreshObjectiveDetailsModal = refreshObjectiveDetailsModal;

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

    const doSave = async () => {
        try {
            // Call AJAX endpoint to update database
            await PerformanceAPI.reviseGoal(goalId, updates);

            // Close modal and refresh Planning roster & pulse cards
            closeModal('modal-revise-goal');
            await loadAndRenderPlanningGoals();
            if (typeof refreshObjectiveDetailsModal === 'function') {
                refreshObjectiveDetailsModal();
            }
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
            throw err;
        }
    };

    if (submitBtn && window.withButtonLock) {
        await window.withButtonLock(submitBtn, doSave, { loadingText: 'Saving Changes...' });
    } else {
        await doSave();
    }
}
window.saveGoalRevision = saveGoalRevision;

