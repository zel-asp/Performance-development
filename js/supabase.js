/**
 * Supabase Client & Instant In-Memory Realtime Engine (Frontend JavaScript)
 * Oxford Suites, Makati · HR3 System
 */

const SUPABASE_CONFIG = window.SUPABASE_CONFIG || {
    url: 'https://jvxnrgcxegzhyaekxdok.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2eG5yZ2N4ZWd6aHlhZWt4ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NTczOTYsImV4cCI6MjEwMzEzMzM5Nn0.nPTeedzMfSnFgFhxb2PDoXiH_aW8Mmwt04ltYR7IznU'
};

// Initialize Supabase Client
let supabaseClient = null;
if (typeof supabase !== 'undefined' && supabase.createClient) {
    try {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
            realtime: {
                params: {
                    eventsPerSecond: 20
                }
            }
        });
        window.supabaseClient = supabaseClient;
    } catch (e) {
        console.warn('[Supabase] Failed to initialize createClient:', e);
    }
}

/**
 * Helper to fetch data from Supabase REST API directly via fetch
 */
async function fetchSupabase(table, options = {}) {
    const { method = 'GET', body = null, headers = {} } = options;
    const url = `${SUPABASE_CONFIG.url}/rest/v1/${table}`;
    
    const requestHeaders = {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...headers
    };

    try {
        const response = await fetch(url, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : null
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || 'Supabase request failed');
        }

        return await response.json();
    } catch (err) {
        console.error(`[Supabase Error] ${table}:`, err);
        throw err;
    }
}
window.fetchSupabase = fetchSupabase;

/**
 * Realtime Instant In-Memory Synchronizer
 * Mutates state and re-renders visible components in 0ms without network fetches or loading indicators
 */
let realtimeChannels = {};

/**
 * Global Performance Realtime Debounced Sync Engine (Stages 1 through 7)
 * Synchronizes visible stage tables, active detail cards, and top navigation stepper badges in 0ms without reloads
 */
let _perfRealtimeDebounceTimer = null;
function triggerPerformanceRealtimeSync(sourceTable, empId = null) {
    if (_perfRealtimeDebounceTimer) {
        clearTimeout(_perfRealtimeDebounceTimer);
    }
    _perfRealtimeDebounceTimer = setTimeout(() => {
        // 1. Instant re-render of currently active stage table
        if (typeof renderActiveStageTable === 'function') {
            renderActiveStageTable();
        }

        // 2. Re-render all stage tables in background so switching stage tabs is instant
        if (typeof renderAllStageTables === 'function') {
            renderAllStageTables();
        }

        // 3. Update top stepper badge counters across all Stages 1 to 7
        if (typeof updateAllPerfStepperBadges === 'function') {
            updateAllPerfStepperBadges();
        }

        // 4. Update Stage 1 Pulse Goals (Employee & Supervisor self-views)
        if (typeof renderEmployeePulseGoals === 'function' && Array.isArray(window.dbGoals)) {
            renderEmployeePulseGoals(window.dbGoals);
        }

        // 5. Update Stage 2 General Tasks Matrix Table
        if (sourceTable === 'performance_general_tasks' && typeof renderGeneralTasksTable === 'function') {
            renderGeneralTasksTable();
        }

        // 6. Update Stage 4 Appraisal Metrics
        if (typeof renderAppraisalMetrics === 'function') {
            renderAppraisalMetrics();
        }

        // 7. Update Stage 5 Calibration Distribution
        if (typeof renderCalibrationDistribution === 'function') {
            renderCalibrationDistribution();
        }

        // 8. Re-render active detail panels or modals if an associate is currently selected
        const targetEmpId = empId || window.selectedEvalEmpId || window.selectedCalibEmpId;
        if (targetEmpId) {
            // Stage 4 detail card
            const evalDetailEl = document.getElementById('eval-detail-emp-name');
            if (evalDetailEl && typeof showAppraisalDetail === 'function') {
                showAppraisalDetail(targetEmpId);
            }

            // Stage 5 detail card
            const calibDetailEl = document.getElementById('calib-detail-emp-name');
            if (calibDetailEl && typeof showCalibrationDetail === 'function') {
                showCalibrationDetail(targetEmpId);
            }

            // Stage 6 detail card
            const idpDetailEl = document.getElementById('idp-detail-emp-name');
            if (idpDetailEl && typeof showIDPDetail === 'function') {
                showIDPDetail(targetEmpId);
            }

            // Stage 7 transition card
            const cycleDetailEl = document.getElementById('cycle-detail-transition-card');
            if (cycleDetailEl && typeof showCycleDetail === 'function') {
                showCycleDetail(targetEmpId, false);
            }

            // Stage 7 Review Tasks Modal (if open)
            const reviewModalEl = document.getElementById('modal-review-tasks');
            if (reviewModalEl && !reviewModalEl.classList.contains('hidden') && typeof openReviewTasksModal === 'function') {
                openReviewTasksModal(targetEmpId);
            }

            // Stage 3 Monitoring Stream Modal (if open)
            const monStreamModal = document.getElementById('modal-monitoring-stream');
            if (monStreamModal && !monStreamModal.classList.contains('hidden') && typeof renderEmployeeMonitoringStream === 'function') {
                const emp = (window.perfRoster || []).find(e => typeof isSameEmployee === 'function' ? isSameEmployee(e.id, targetEmpId) : e.id == targetEmpId);
                if (emp) renderEmployeeMonitoringStream(emp);
            }
        }

        // 9. Silent background parity fetch to guarantee 100% database integrity without skeleton flash
        if (typeof loadAndRenderPlanningGoals === 'function') {
            loadAndRenderPlanningGoals(true).catch(() => {});
        }
    }, 100);
}
window.triggerPerformanceRealtimeSync = triggerPerformanceRealtimeSync;

function initSupabaseRealtime() {
    if (!supabaseClient) return;

    try {
        // ====================================================================
        // 1. Performance Lifecycle Hub Channel (Realtime across Stages 1 to 7)
        // ====================================================================
        if (!realtimeChannels.performance_hub) {
            realtimeChannels.performance_hub = supabaseClient
                .channel('realtime_performance_hub')
                // A. Performance Goals (Stages 1, 2, 3, 4, 5, 6, 7)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'performance_goals' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};
                        const empId = newRow.employee_id || oldRow.employee_id;

                        // 1. Live Sync window.dbGoals
                        if (Array.isArray(window.dbGoals)) {
                            if (payload.eventType === 'INSERT' && newRow.id) {
                                const exists = window.dbGoals.some(g => g.id == newRow.id);
                                if (!exists) {
                                    newRow.tasks = newRow.tasks || [];
                                    window.dbGoals.unshift(newRow);
                                }
                            } else if (payload.eventType === 'UPDATE' && newRow.id) {
                                const idx = window.dbGoals.findIndex(g => g.id == newRow.id);
                                if (idx >= 0) {
                                    const existingTasks = window.dbGoals[idx].tasks || [];
                                    window.dbGoals[idx] = Object.assign({}, window.dbGoals[idx], newRow);
                                    if (!newRow.tasks && existingTasks.length > 0) {
                                        window.dbGoals[idx].tasks = existingTasks;
                                    }
                                } else {
                                    window.dbGoals.unshift(newRow);
                                }
                            } else if (payload.eventType === 'DELETE' && oldRow.id) {
                                window.dbGoals = window.dbGoals.filter(g => g.id != oldRow.id);
                            }
                        }

                        // 2. Sync perfRoster employee goals
                        if (Array.isArray(window.perfRoster) && empId) {
                            const emp = window.perfRoster.find(e => typeof isSameEmployee === 'function' ? isSameEmployee(e.id, empId) : e.id == empId);
                            if (emp) {
                                emp.goals = emp.goals || [];
                                if (payload.eventType === 'INSERT' && newRow.id) {
                                    const gExists = emp.goals.some(g => g.id == newRow.id);
                                    if (!gExists) {
                                        emp.goals.unshift({
                                            id: newRow.id,
                                            title: newRow.title,
                                            category: newRow.department,
                                            kpi: newRow.target_metric,
                                            weight: newRow.weight,
                                            deliverables: newRow.evidence || 'Standard shift operational log verification',
                                            targetDate: newRow.target_date,
                                            status: newRow.status || 'Pending Approval',
                                            supervisor_notes: newRow.supervisor_notes,
                                            tasks: newRow.tasks || [],
                                            general_tasks: newRow.general_tasks || [],
                                            specific_tasks: newRow.specific_tasks || [],
                                            task_progress: 0,
                                            created_at: newRow.created_at
                                        });
                                    }
                                } else if (payload.eventType === 'UPDATE' && newRow.id) {
                                    const gIdx = emp.goals.findIndex(g => g.id == newRow.id);
                                    if (gIdx >= 0) {
                                        Object.assign(emp.goals[gIdx], {
                                            title: newRow.title || emp.goals[gIdx].title,
                                            category: newRow.department || emp.goals[gIdx].category,
                                            kpi: newRow.target_metric || emp.goals[gIdx].kpi,
                                            weight: newRow.weight || emp.goals[gIdx].weight,
                                            deliverables: newRow.evidence || emp.goals[gIdx].deliverables,
                                            targetDate: newRow.target_date || emp.goals[gIdx].targetDate,
                                            status: newRow.status || emp.goals[gIdx].status,
                                            supervisor_notes: newRow.supervisor_notes !== undefined ? newRow.supervisor_notes : emp.goals[gIdx].supervisor_notes,
                                            needs_training: newRow.needs_training !== undefined ? newRow.needs_training : emp.goals[gIdx].needs_training,
                                            retry_count: newRow.retry_count !== undefined ? newRow.retry_count : emp.goals[gIdx].retry_count,
                                            final_rating: newRow.final_rating !== undefined ? newRow.final_rating : emp.goals[gIdx].final_rating
                                        });
                                    }
                                } else if (payload.eventType === 'DELETE' && oldRow.id) {
                                    emp.goals = emp.goals.filter(g => g.id != oldRow.id);
                                }
                                emp.goalsCount = emp.goals.length;
                                const hasPending = emp.goals.some(g => {
                                    const st = (g.status || '').toLowerCase();
                                    return st !== 'approved' && st !== 'completed' && st !== 'failed';
                                });
                                const allFailed = emp.goals.length > 0 && emp.goals.every(g => (g.status || '').toLowerCase() === 'failed');
                                emp.planningStatus = allFailed ? 'Failed' : (hasPending ? 'Pending Approval' : (emp.goals.length > 0 ? 'Approved' : 'Draft'));
                                emp.approvalStatus = emp.planningStatus;
                            }
                        }

                        // 3. Update in-memory employee goals_summary in Competency Matrix table
                        if (empId) {
                            const isNT = (newRow.needs_training === true || newRow.needs_training === 1 || newRow.needs_training === '1' || newRow.needs_training === 'true' || newRow.needs_training === 't');
                            const isIT = (newRow.in_training === true || newRow.in_training === 1 || newRow.in_training === '1' || newRow.in_training === 'true' || newRow.in_training === 't');

                            const employees = window.dynamicCompetencyState?.employees || [];
                            const targetEmp = employees.find(e => typeof isSameEmployee === 'function' ? isSameEmployee(e.id, empId) : e.id == empId);
                            if (targetEmp) {
                                targetEmp.goals_summary = targetEmp.goals_summary || {};
                                targetEmp.goals_summary.needs_training = isNT;
                                targetEmp.goals_summary.in_training = isIT;
                                targetEmp.goals_summary.status_label = isNT ? 'Needs Training' : (isIT ? 'In Training' : (newRow.status || null));
                                if (typeof renderCompetencyMatrixTable === 'function') {
                                    renderCompetencyMatrixTable();
                                }
                            }
                        }

                        triggerPerformanceRealtimeSync('performance_goals', empId);
                    }
                )
                // B. Performance Tasks (Stages 1, 2, 3, 4, 6, 7)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'performance_tasks' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};
                        const goalId = newRow.goal_id || oldRow.goal_id;
                        const empId = newRow.employee_id || oldRow.employee_id;

                        // 1. Live Sync tasks in window.dbGoals
                        if (Array.isArray(window.dbGoals) && goalId) {
                            const goal = window.dbGoals.find(g => g.id == goalId);
                            if (goal) {
                                goal.tasks = goal.tasks || [];
                                if (payload.eventType === 'INSERT' && newRow.id) {
                                    const tExists = goal.tasks.some(t => t.id == newRow.id);
                                    if (!tExists) goal.tasks.push(newRow);
                                } else if (payload.eventType === 'UPDATE' && newRow.id) {
                                    const tIdx = goal.tasks.findIndex(t => t.id == newRow.id);
                                    if (tIdx >= 0) {
                                        goal.tasks[tIdx] = Object.assign({}, goal.tasks[tIdx], newRow);
                                    } else {
                                        goal.tasks.push(newRow);
                                    }
                                } else if (payload.eventType === 'DELETE' && oldRow.id) {
                                    goal.tasks = goal.tasks.filter(t => t.id != oldRow.id);
                                }
                                const done = goal.tasks.filter(t => t.status === 'completed').length;
                                goal.task_progress = goal.tasks.length > 0 ? Math.round((done / goal.tasks.length) * 100) : 0;
                                goal.progress = goal.task_progress;
                            }
                        }

                        // 2. Live Sync tasks in window.perfRoster employee goals
                        if (Array.isArray(window.perfRoster)) {
                            window.perfRoster.forEach(emp => {
                                (emp.goals || []).forEach(goal => {
                                    if (goal.id == goalId) {
                                        goal.tasks = goal.tasks || [];
                                        if (payload.eventType === 'INSERT' && newRow.id) {
                                            const tExists = goal.tasks.some(t => t.id == newRow.id);
                                            if (!tExists) goal.tasks.push(newRow);
                                        } else if (payload.eventType === 'UPDATE' && newRow.id) {
                                            const tIdx = goal.tasks.findIndex(t => t.id == newRow.id);
                                            if (tIdx >= 0) {
                                                goal.tasks[tIdx] = Object.assign({}, goal.tasks[tIdx], newRow);
                                            } else {
                                                goal.tasks.push(newRow);
                                            }
                                        } else if (payload.eventType === 'DELETE' && oldRow.id) {
                                            goal.tasks = goal.tasks.filter(t => t.id != oldRow.id);
                                        }
                                        const done = goal.tasks.filter(t => t.status === 'completed').length;
                                        goal.task_progress = goal.tasks.length > 0 ? Math.round((done / goal.tasks.length) * 100) : 0;
                                        goal.progress = goal.task_progress;
                                    }
                                });
                            });
                        }

                        triggerPerformanceRealtimeSync('performance_tasks', empId);
                        if (typeof fetchPrescribedLms === 'function') {
                            fetchPrescribedLms();
                        }
                        if (typeof renderLmsBooks === 'function') {
                            renderLmsBooks();
                        }
                    }
                )
                // C. Performance Evaluations (Stages 4, 5, 6, 7)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'performance_evaluations' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};
                        const empId = newRow.employee_id || oldRow.employee_id;

                        // 1. Live Sync window.dbEvaluations
                        if (Array.isArray(window.dbEvaluations)) {
                            if (payload.eventType === 'INSERT' && newRow.id) {
                                const exists = window.dbEvaluations.some(ev => ev.id == newRow.id || (empId && isSameEmployee(ev.employee_id, empId)));
                                if (!exists) {
                                    window.dbEvaluations.unshift(newRow);
                                } else {
                                    const idx = window.dbEvaluations.findIndex(ev => ev.id == newRow.id || (empId && isSameEmployee(ev.employee_id, empId)));
                                    if (idx >= 0) window.dbEvaluations[idx] = Object.assign({}, window.dbEvaluations[idx], newRow);
                                }
                            } else if (payload.eventType === 'UPDATE' && (newRow.id || empId)) {
                                const idx = window.dbEvaluations.findIndex(ev => (newRow.id && ev.id == newRow.id) || (empId && isSameEmployee(ev.employee_id, empId)));
                                if (idx >= 0) {
                                    window.dbEvaluations[idx] = Object.assign({}, window.dbEvaluations[idx], newRow);
                                } else {
                                    window.dbEvaluations.unshift(newRow);
                                }
                            } else if (payload.eventType === 'DELETE' && (oldRow.id || empId)) {
                                window.dbEvaluations = window.dbEvaluations.filter(ev => (oldRow.id && ev.id != oldRow.id) || (empId && !isSameEmployee(ev.employee_id, empId)));
                            }
                        }

                        // 2. Sync matching employee in window.perfRoster
                        if (Array.isArray(window.perfRoster) && empId) {
                            const emp = window.perfRoster.find(e => isSameEmployee(e.id, empId) || isSameEmployee(e.employee_code, empId));
                            if (emp) {
                                emp.evaluationRecord = Object.assign({}, emp.evaluationRecord || {}, newRow);
                                const supScore = (newRow.supervisor_rating !== undefined && newRow.supervisor_rating !== null && parseFloat(newRow.supervisor_rating) > 0)
                                    ? parseFloat(newRow.supervisor_rating)
                                    : (emp.supervisorRating || 0.0);
                                const selfScore = (newRow.self_evaluation !== undefined && newRow.self_evaluation !== null && parseFloat(newRow.self_evaluation) > 0)
                                    ? parseFloat(newRow.self_evaluation)
                                    : (emp.selfRating || 0.0);
                                const calibScore = (newRow.calibrated_score !== undefined && newRow.calibrated_score !== null && parseFloat(newRow.calibrated_score) > 0)
                                    ? parseFloat(newRow.calibrated_score)
                                    : (emp.calibratedScore || null);

                                emp.supervisorRating = supScore;
                                emp.selfRating = selfScore;
                                if (calibScore) emp.calibratedScore = calibScore;
                                if (newRow.tier_label) emp.tierLabel = newRow.tier_label;
                                emp.evaluationStatus = newRow.status || (calibScore ? 'Calibrated' : (supScore > 0 ? 'Rated' : (selfScore ? 'Self-Reviewed' : 'Pending Evaluation')));
                                if (newRow.status === 'Calibrated') emp.reviewStatus = 'Calibrated';
                            }
                        }

                        triggerPerformanceRealtimeSync('performance_evaluations', empId);
                    }
                )
                // D. Performance Development Plans (Stages 6 & 7)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'performance_development_plans' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};
                        const empId = newRow.employee_id || oldRow.employee_id;

                        if (empId) {
                            window.dbDraftPlans = window.dbDraftPlans || {};
                            if (typeof loadDraftSummary === 'function') {
                                loadDraftSummary(empId, true).then(summary => {
                                    window.dbDraftPlans[empId] = summary;
                                    triggerPerformanceRealtimeSync('performance_development_plans', empId);
                                }).catch(() => {
                                    triggerPerformanceRealtimeSync('performance_development_plans', empId);
                                });
                            } else {
                                delete window.dbDraftPlans[empId];
                                triggerPerformanceRealtimeSync('performance_development_plans', empId);
                            }
                        } else {
                            triggerPerformanceRealtimeSync('performance_development_plans');
                        }
                    }
                )
                // E. General Tasks (Stage 2)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'performance_general_tasks' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};

                        if (Array.isArray(window.dbGeneralTasks)) {
                            if (payload.eventType === 'INSERT' && newRow.id) {
                                const exists = window.dbGeneralTasks.some(t => t.id == newRow.id);
                                if (!exists) window.dbGeneralTasks.unshift(newRow);
                            } else if (payload.eventType === 'UPDATE' && newRow.id) {
                                const idx = window.dbGeneralTasks.findIndex(t => t.id == newRow.id);
                                if (idx >= 0) window.dbGeneralTasks[idx] = Object.assign({}, window.dbGeneralTasks[idx], newRow);
                                else window.dbGeneralTasks.unshift(newRow);
                            } else if (payload.eventType === 'DELETE' && oldRow.id) {
                                window.dbGeneralTasks = window.dbGeneralTasks.filter(t => t.id != oldRow.id);
                            }
                        }

                        if (typeof renderGeneralTasksTable === 'function') {
                            renderGeneralTasksTable();
                        }
                        triggerPerformanceRealtimeSync('performance_general_tasks');
                    }
                )
                // F. Monitoring Milestones & Evidence (Stage 3)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'performance_monitoring' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};
                        const empId = newRow.employee_id || oldRow.employee_id;
                        triggerPerformanceRealtimeSync('performance_monitoring', empId);
                    }
                )
                // G. Coaching & 1-on-1 Notes (Stage 3)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'coaching_notes' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};
                        const empId = newRow.employee_id || oldRow.employee_id;
                        triggerPerformanceRealtimeSync('coaching_notes', empId);
                    }
                )
                // H. Training Needs & Deficits (Stages 3 & 7)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'training_needs' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};
                        const empId = newRow.employee_id || oldRow.employee_id;

                        if (Array.isArray(window.dbTrainingNeeds)) {
                            if (payload.eventType === 'INSERT' && newRow.id) {
                                window.dbTrainingNeeds.unshift(newRow);
                            } else if (payload.eventType === 'UPDATE' && newRow.id) {
                                const idx = window.dbTrainingNeeds.findIndex(tn => tn.id == newRow.id);
                                if (idx >= 0) window.dbTrainingNeeds[idx] = Object.assign({}, window.dbTrainingNeeds[idx], newRow);
                            } else if (payload.eventType === 'DELETE' && oldRow.id) {
                                window.dbTrainingNeeds = window.dbTrainingNeeds.filter(tn => tn.id != oldRow.id);
                            }
                        }

                        triggerPerformanceRealtimeSync('training_needs', empId);
                    }
                )
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        console.log('[Supabase Realtime] Performance Lifecycle Hub subscribed (Stages 1-7 live)');
                    }
                });
        }

        // 2. Certificates Registry Channel (Instant DOM Mutation)
        if (!realtimeChannels.certificates) {
            realtimeChannels.certificates = supabaseClient
                .channel('realtime_certificates')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'certificates' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};
                        const associateId = newRow.associate_id || oldRow.associate_id;
                        if (!associateId) return;

                        const certsCacheKey = `comp_certs_cache_${associateId}`;
                        let cachedCerts = window.dynamicCompetencyState?.cache?.[certsCacheKey];
                        if (Array.isArray(cachedCerts)) {
                            if (payload.eventType === 'INSERT') {
                                cachedCerts.unshift(newRow);
                            } else if (payload.eventType === 'UPDATE') {
                                const idx = cachedCerts.findIndex(c => c.id == newRow.id);
                                if (idx >= 0) cachedCerts[idx] = Object.assign({}, cachedCerts[idx], newRow);
                                else cachedCerts.unshift(newRow);
                            } else if (payload.eventType === 'DELETE') {
                                cachedCerts = cachedCerts.filter(c => c.id != oldRow.id);
                                window.dynamicCompetencyState.cache[certsCacheKey] = cachedCerts;
                            }
                            try { sessionStorage.setItem(certsCacheKey, JSON.stringify(cachedCerts)); } catch (e) {}
                        }

                        if (typeof activeCompetencyEmpKey !== 'undefined' && activeCompetencyEmpKey === associateId) {
                            if (typeof renderCertificationsRoster === 'function') {
                                renderCertificationsRoster(false);
                            }
                        }
                    }
                )
                .subscribe();
        }

        // 3. Competency Evaluations Channel (Instant Score Update & Cache Invalidation)
        if (!realtimeChannels.competency_evaluations) {
            realtimeChannels.competency_evaluations = supabaseClient
                .channel('realtime_competency_evals')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'competency_evaluations' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const empId = newRow.employee_id;
                        const compId = newRow.competency_id;
                        if (!empId || !compId) return;

                        // Invalidate competency caches in memory and sessionStorage
                        if (window.dynamicCompetencyState) {
                            window.dynamicCompetencyState.cache = {};
                        }
                        window._cachedEmpCompetencies = window._cachedEmpCompetencies || {};
                        delete window._cachedEmpCompetencies[empId.toLowerCase()];
                        try {
                            for (let i = sessionStorage.length - 1; i >= 0; i--) {
                                const k = sessionStorage.key(i);
                                if (k && (k.startsWith('comp_matrix_cache_') || k.startsWith('comp_emp_cache_'))) {
                                    sessionStorage.removeItem(k);
                                }
                            }
                        } catch (e) {}

                        const employees = window.dynamicCompetencyState?.employees || [];
                        const targetEmp = employees.find(e => e.id === empId);
                        if (targetEmp && targetEmp.scores) {
                            const newScore = parseFloat(newRow.score || 0);
                            targetEmp.scores[compId] = {
                                score: newScore,
                                formatted: newScore.toFixed(2),
                                isApplicable: true
                            };
                            if (typeof renderCompetencyMatrixTable === 'function') {
                                renderCompetencyMatrixTable();
                            }
                        }

                        if (typeof renderEmployeeOverviewCompetencies === 'function') {
                            renderEmployeeOverviewCompetencies(empId, true);
                        }

                        if (typeof activeCompetencyEmpKey !== 'undefined' && activeCompetencyEmpKey === empId) {
                            if (typeof renderSelectedEmployeeRadarView === 'function') {
                                renderSelectedEmployeeRadarView();
                            }
                        }
                    }
                )
                .subscribe();
        }

        // 4. Social Recognition Feed & Gamified XP Ledger Channel
        if (!realtimeChannels.social_recognitions) {
            realtimeChannels.social_recognitions = supabaseClient
                .channel('realtime_social_recognitions')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'social_recognitions' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};
                        const postId = newRow.id || oldRow.id;
                        if (!postId) return;

                        if (payload.eventType === 'UPDATE' && newRow.id) {
                            if (typeof window.updatePostFromRealtime === 'function') {
                                window.updatePostFromRealtime(newRow);
                            } else if (typeof renderSocialFeed === 'function') {
                                renderSocialFeed();
                            }
                        } else if (payload.eventType === 'INSERT' && newRow.id) {
                            if (typeof window.addRealtimeRecognitionPost === 'function') {
                                window.addRealtimeRecognitionPost(newRow);
                            } else if (typeof loadSocialOverview === 'function') {
                                loadSocialOverview();
                            }
                        } else if (payload.eventType === 'DELETE' && oldRow.id) {
                            if (Array.isArray(window.socialFeedPostsState)) {
                                window.socialFeedPostsState = window.socialFeedPostsState.filter(p => p.id !== oldRow.id);
                                if (typeof renderSocialFeed === 'function') renderSocialFeed();
                            }
                        }
                    }
                )
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'xp_ledger' },
                    (payload) => {
                        const currentUserId = window.currentUser?.id || (window.activePersonaRole === 'Supervisor' ? 'emp-102' : 'emp-101');
                        
                        // Invalidate XP ledger cache for real-time update
                        window._cachedXpLedger = window._cachedXpLedger || {};
                        delete window._cachedXpLedger[currentUserId];
                        try {
                            sessionStorage.removeItem(`xp_ledger_cache_${currentUserId}`);
                        } catch(e) {}

                        if (typeof updateXpTrajectoryFromLedger === 'function') {
                            updateXpTrajectoryFromLedger(currentUserId, true);
                        }
                        if (typeof initSocialRecognition === 'function') {
                            initSocialRecognition();
                        }
                    }
                )
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'shift_sentiments' },
                    (payload) => {
                        const newRow = payload.new || {};
                        if (newRow && newRow.id) {
                            if (typeof window.addRealtimeShiftSentiment === 'function') {
                                window.addRealtimeShiftSentiment(newRow);
                            }
                        }
                    }
                )
                .subscribe();
        }

        // 5. LMS Documents & Learning Prescriptions Realtime Channel
        if (!realtimeChannels.lms_documents) {
            realtimeChannels.lms_documents = supabaseClient
                .channel('realtime_lms_documents_hub')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'lms_documents' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};

                        // Clear local cache for instant freshness
                        try {
                            sessionStorage.removeItem('lms_documents_cache');
                        } catch (e) {}

                        // In-memory instant sync for window.dynamicLmsState.documents
                        if (window.dynamicLmsState && Array.isArray(window.dynamicLmsState.documents)) {
                            if (payload.eventType === 'INSERT' && newRow.id) {
                                const exists = window.dynamicLmsState.documents.some(d => d.id == newRow.id);
                                if (!exists) {
                                    window.dynamicLmsState.documents.unshift(newRow);
                                }
                            } else if (payload.eventType === 'UPDATE' && newRow.id) {
                                const idx = window.dynamicLmsState.documents.findIndex(d => d.id == newRow.id);
                                if (idx >= 0) {
                                    window.dynamicLmsState.documents[idx] = Object.assign({}, window.dynamicLmsState.documents[idx], newRow);
                                } else {
                                    window.dynamicLmsState.documents.unshift(newRow);
                                }
                            } else if (payload.eventType === 'DELETE' && oldRow.id) {
                                window.dynamicLmsState.documents = window.dynamicLmsState.documents.filter(d => d.id != oldRow.id);
                            }
                        }

                        // Trigger UI re-renders across LMS views
                        if (typeof renderLmsBooks === 'function') {
                            renderLmsBooks();
                        }
                        if (typeof fetchDynamicLmsDocuments === 'function') {
                            fetchDynamicLmsDocuments();
                        }
                        if (typeof fetchNeedsAnalysisData === 'function') {
                            fetchNeedsAnalysisData();
                        }
                    }
                )
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'lms_prescribed' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};

                        try {
                            sessionStorage.removeItem('lms_prescribed_cache');
                        } catch (e) {}

                        // In-memory instant sync for window.dynamicLmsState.prescribed
                        if (window.dynamicLmsState && Array.isArray(window.dynamicLmsState.prescribed)) {
                            if (payload.eventType === 'INSERT' && newRow.id) {
                                const exists = window.dynamicLmsState.prescribed.some(p => p.id == newRow.id);
                                if (!exists) {
                                    window.dynamicLmsState.prescribed.unshift(newRow);
                                }
                            } else if (payload.eventType === 'UPDATE' && newRow.id) {
                                const idx = window.dynamicLmsState.prescribed.findIndex(p => p.id == newRow.id);
                                if (idx >= 0) {
                                    window.dynamicLmsState.prescribed[idx] = Object.assign({}, window.dynamicLmsState.prescribed[idx], newRow);
                                } else {
                                    window.dynamicLmsState.prescribed.unshift(newRow);
                                }
                            } else if (payload.eventType === 'DELETE' && oldRow.id) {
                                window.dynamicLmsState.prescribed = window.dynamicLmsState.prescribed.filter(p => p.id != oldRow.id);
                            }
                        }

                        // Re-render bookshelf and prescribed status
                        if (typeof renderLmsBooks === 'function') {
                            renderLmsBooks();
                        }
                        if (typeof fetchPrescribedLms === 'function') {
                            fetchPrescribedLms();
                        }
                        if (typeof fetchNeedsAnalysisData === 'function') {
                            fetchNeedsAnalysisData();
                        }
                    }
                )
                .subscribe();
        }

    } catch (e) {
        console.warn('[Supabase Realtime] Error initializing channels:', e);
    }
}
window.initSupabaseRealtime = initSupabaseRealtime;

// Auto-boot Realtime
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initSupabaseRealtime, 200));
} else {
    setTimeout(initSupabaseRealtime, 200);
}
