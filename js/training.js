/**
 * Oxford Suites, Makati - Training Operations Management System
 * 
 * In-Scope Modules:
 * 1. Training program creation (linked to skill gap or mandatory compliance)
 * 2. Scheduling (date, time, location, trainer, participant list)
 * 3. Attendance tracking (Attended / Absent / Completed)
 * 4. Post-training evaluation form and result recording (score, certificate reference)
 * 5. Basic training report (attendance + completion by program/department)
 */

// =========================================================================
// 0. AJAX FETCH API CLIENT
// =========================================================================

const TrainingAPI = {
    baseUrl: 'api/training.php',

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

        let toastId = null;
        if (method !== 'GET' && typeof window.showToast === 'function') {
            let loadingMsg = 'Processing training request...';
            if (action.includes('delete') || action.includes('remove')) loadingMsg = 'Deleting training record...';
            else if (action.includes('program')) loadingMsg = 'Saving training program...';
            else if (action.includes('session') || action.includes('schedule')) loadingMsg = 'Scheduling training session...';
            else if (action.includes('attendance')) loadingMsg = 'Updating attendance roster...';
            else if (action.includes('result') || action.includes('evaluat') || action.includes('quiz')) loadingMsg = 'Processing training evaluation & quiz...';
            else if (action.includes('need')) loadingMsg = 'Recording training need...';
            toastId = window.showToast(loadingMsg, 'loading');
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (toastId && typeof window.dismissToast === 'function') {
                window.dismissToast(toastId);
            }

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Server request failed');
            }
            return result.data;
        } catch (error) {
            if (toastId && typeof window.dismissToast === 'function') {
                window.dismissToast(toastId);
            }
            console.error(`[TrainingAPI Error] [${action}]:`, error);
            if (typeof window.showToast === 'function') {
                window.showToast(error.message || 'Server communication error', 'error');
            }
            throw error;
        }
    },
    bootstrap(filters = {}) {
        const currentRole = window.activePersonaRole || 'Associate';
        const currentUserId = window.currentUser?.id || '';
        const isSupervisor = (currentRole === 'Supervisor' || currentRole === 'DeptHead' || window.activePersonaKey === 'supervisor' || window.activePersonaKey === 'manager');
        const scope = (window.trainingSupervisorShowAll || window.trainingResultsShowAll || isSupervisor) ? 'all' : (filters.scope || '');
        return this.request('bootstrap', 'GET', { ...filters, scope, role: currentRole, user_id: currentUserId });
    },
    getNeeds(filters = {}) {
        const currentRole = window.activePersonaRole || 'Associate';
        const currentUserId = window.currentUser?.id || '';
        const scope = window.trainingSupervisorShowAll ? 'all' : (filters.scope || '');
        return this.request('get_needs', 'GET', { ...filters, scope, role: currentRole, user_id: currentUserId });
    },
    createNeed(data) { return this.request('create_need', 'POST', data); },
    getPrograms(filters = {}) {
        const currentRole = window.activePersonaRole || 'Associate';
        const currentUserId = window.currentUser?.id || '';
        return this.request('get_programs', 'GET', { ...filters, role: currentRole, user_id: currentUserId });
    },
    createProgram(data) { return this.request('create_program', 'POST', data); },
    getSessions(filters = {}) {
        const currentRole = window.activePersonaRole || 'Associate';
        const currentUserId = window.currentUser?.id || '';
        return this.request('get_sessions', 'GET', { ...filters, role: currentRole, user_id: currentUserId });
    },
    scheduleSession(data) { return this.request('create_session', 'POST', data); },
    updateAttendance(sessionId, associateId, status, checkInTime = null) {
        const currentRole = window.activePersonaRole || 'Associate';
        const currentUserId = window.currentUser?.id || '';
        return this.request('update_attendance', 'POST', {
            session_id: sessionId,
            employee_id: associateId,
            attendance_status: status,
            check_in_time: checkInTime,
            role: currentRole,
            user_id: currentUserId
        });
    },
    submitEvaluation(payload) {
        const currentRole = window.activePersonaRole || 'Associate';
        const currentUserId = window.currentUser?.id || '';
        return this.request('submit_evaluation', 'POST', {
            ...payload,
            role: currentRole,
            user_id: currentUserId
        });
    },
    getCertificates(filters = {}) {
        const currentRole = window.activePersonaRole || 'Associate';
        const currentUserId = window.currentUser?.id || '';
        return this.request('get_certificates', 'GET', { ...filters, role: currentRole, user_id: currentUserId });
    },
    getReports(filters = {}) {
        const currentRole = window.activePersonaRole || 'Associate';
        const currentUserId = window.currentUser?.id || '';
        return this.request('get_reports', 'GET', { ...filters, role: currentRole, user_id: currentUserId });
    }
};

// =========================================================================
// 1. STATE STORES
// =========================================================================

let trainingNeedsState = [];
let trainingProgramsState = [];
let trainingSessionsState = [];
let trainingResultsState = [];
let trainingCertificatesState = [];
let trainingEmployeesState = [];

let activeAttendanceSessionId = 'sess-101';

function matchesDepartment(itemDept, supervisorDept) {
    if (!supervisorDept) return true;
    const a = String(itemDept || '').toLowerCase().trim();
    const b = String(supervisorDept || '').toLowerCase().trim();
    if (a === '' || b === '') return true;
    if (a.includes(b) || b.includes(a)) return true;

    const aliases = {
        'culinary & f&b': ['culinary', 'f&b service', 'f & b service', 'food & beverage', 'kitchen'],
        'kitchen': ['culinary', 'f&b service', 'food & beverage', 'culinary & f&b', 'kitchen'],
        'front office': ['front office', 'fo', 'front desk', 'reception', 'concierge'],
        'housekeeping': ['housekeeping', 'hk', 'rooms'],
        'human resources': ['human resources', 'hr'],
        'executive office': ['executive office', 'gm'],
    };

    const normalize = (s) => s.replace(/&/g, 'and').replace(/\s+/g, ' ').trim();

    for (const [key, vals] of Object.entries(aliases)) {
        if (normalize(a) === key || vals.some(v => normalize(a).includes(v))) {
            if (normalize(b) === key || vals.some(v => normalize(b).includes(v))) return true;
        }
    }
    return false;
}

let currentEvaluationContext = {
    sessionId: null,
    associateId: null,
    programId: null,
    answers: {},
    kirkpatrickFeedback: {
        trainerRating: 5,
        relevanceRating: 5,
        comments: 'Outstanding practical scenarios.'
    }
};

// =========================================================================
// 2. INITIALIZATION
// =========================================================================

function normalizeTrainingNeed(need) {
    if (!need) return {};
    const currentScore = need.currentScore ?? need.current_score ?? 3.5;
    const requiredScore = need.requiredScore ?? need.required_score ?? 5.0;
    const gap = need.gap ?? Number((currentScore - requiredScore).toFixed(1));
    return {
        ...need,
        id: need.id,
        title: need.title || 'Operational Training Need',
        employeeId: need.employeeId || need.employee_id || null,
        associateName: need.associateName || need.associate_name || 'Associate',
        associateRole: need.associateRole || need.associate_role || 'Staff',
        associateAvatar: need.associateAvatar || need.associate_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        sourceType: need.sourceType || need.source_type || 'competency_gap',
        sourceLabel: need.sourceLabel || need.source_label || ((need.source_type === 'compliance' || need.sourceType === 'compliance') ? 'Mandatory Compliance' : 'Skill Gap'),
        category: need.category || 'Service Excellence',
        dept: need.dept || 'Front Office',
        targetCompetency: need.targetCompetency || need.target_competency || 'Service Excellence',
        competencyKey: need.competencyKey || need.competency_key || 'general',
        currentScore: currentScore,
        requiredScore: requiredScore,
        gap: gap,
        urgency: need.urgency || 'High',
        status: need.status || 'Identified',
        linkedProgramId: need.linkedProgramId || need.linked_program_id || null,
        linkedProgramTitle: need.linkedProgramTitle || need.linked_program_title || null,
        programDuration: need.programDuration || need.program_duration || null,
        programPassingScore: need.programPassingScore || need.program_passing_score || null,
        dateIdentified: need.dateIdentified || need.date_identified || 'Aug 18, 2026',
        notes: need.notes || need.diagnosis_note || 'Identified during supervisor performance audit.',
        targetGoalId: need.targetGoalId || need.target_goal_id || null,
        linkedGoalTitle: need.linkedGoalTitle || need.linked_goal_title || null,
        linkedGoalMetric: need.linkedGoalMetric || need.linked_goal_metric || null,
        linkedGoalWeight: need.linkedGoalWeight || need.linked_goal_weight || null,
        linkedGoalStatus: need.linkedGoalStatus || need.linked_goal_status || null,
        isPerformanceGoal: !!(need.targetGoalId || need.target_goal_id || (need.source_label && need.source_label.toLowerCase().includes('performance')) || (need.sourceLabel && need.sourceLabel.toLowerCase().includes('performance')) || (need.source_type === 'performance_goal') || (need.sourceType === 'performance_goal'))
    };
}

function formatDiagnosisNotesHtml(notesText) {
    if (!notesText) return '<p class="text-slate-500 text-xs italic">Identified during supervisor performance evaluation.</p>';

    // 1. If string has bullet lines with "•" or "\n"
    if (notesText.includes('•') || notesText.includes('\n')) {
        const lines = notesText.split('\n').map(l => l.trim()).filter(Boolean);
        const headerLines = [];
        const bulletItems = [];

        lines.forEach(l => {
            if (l.startsWith('•') || l.startsWith('-') || l.startsWith('*')) {
                bulletItems.push(l.replace(/^[•\-\*]\s*/, ''));
            } else {
                headerLines.push(l);
            }
        });

        return `
            <div class="space-y-1.5 text-xs">
                ${headerLines.length > 0 ? `<div class="font-medium text-slate-700 leading-snug">${headerLines.join(' ')}</div>` : ''}
                ${bulletItems.length > 0 ? `
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Diagnosed Competency Deficits:</div>
                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                        ${bulletItems.map(item => `
                            <li class="flex items-center space-x-1.5 p-1.5 rounded-lg bg-white border border-[#E8DEDC] text-slate-700 text-xs shadow-2xs">
                                <span class="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>
                                <span class="font-semibold text-slate-800">${item}</span>
                            </li>
                        `).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
    }

    // 2. If string is comma-separated format like "Diagnosed low areas: VIP Protocol (1/4.5), Customer Service (1/4.5)..."
    if (notesText.includes('Diagnosed low areas:')) {
        const parts = notesText.split('Diagnosed low areas:');
        const header = parts[0].trim();
        const lowAreaSection = parts[1] || '';
        const rawItems = lowAreaSection.split('. Requires')[0].split(',');

        return `
            <div class="space-y-1.5 text-xs">
                ${header ? `<div class="font-medium text-slate-700 leading-snug">${header}</div>` : ''}
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Diagnosed Competency Deficits:</div>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                    ${rawItems.map(item => {
                        const clean = item.trim();
                        if (!clean) return '';
                        return `
                            <li class="flex items-center space-x-1.5 p-1.5 rounded-lg bg-white border border-[#E8DEDC] text-slate-700 text-xs shadow-2xs">
                                <span class="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>
                                <span class="font-semibold text-slate-800">${clean}</span>
                            </li>
                        `;
                    }).join('')}
                </ul>
            </div>
        `;
    }

    return `<p class="text-slate-700 leading-relaxed text-xs">${notesText}</p>`;
}

function normalizeTrainingProgram(prog) {
    if (!prog) return {};
    return {
        ...prog,
        id: prog.id,
        title: prog.title || 'Training Program',
        category: prog.category || 'General',
        categoryType: prog.categoryType || prog.category_type || 'skill_gap',
        dept: prog.dept || 'Front Office',
        targetCompetency: prog.targetCompetency || prog.target_competency || 'Core Hospitality',
        competencyKey: prog.competencyKey || prog.competency_key || 'general',
        duration: prog.duration || '3 Hours',
        format: prog.format || 'Workshop',
        trainerType: prog.trainerType || prog.trainer_type || 'Internal Master Trainer',
        passingScore: prog.passingScore ?? prog.passing_score ?? 80,
        xpAward: prog.xpAward ?? prog.xp_award ?? 150,
        icon: prog.icon || 'fa-award',
        badgeColor: prog.badgeColor || prog.badge_color || 'primary',
        description: prog.description || '',
        modules: Array.isArray(prog.modules) ? prog.modules : [],
        quizQuestions: Array.isArray(prog.quizQuestions) ? prog.quizQuestions : (Array.isArray(prog.quiz_questions) ? prog.quiz_questions : [])
    };
}

function normalizeTrainingSession(sess) {
    if (!sess) return {};
    return {
        ...sess,
        id: sess.id,
        programId: sess.programId || sess.program_id || 'prog-1',
        title: sess.title || 'Training Session',
        dept: sess.dept || 'Front Office',
        trainerName: sess.trainerName || sess.trainer_name || 'Assigned Trainer',
        trainerTitle: sess.trainerTitle || sess.trainer_title || 'Senior Trainer',
        trainerAvatar: sess.trainerAvatar || sess.trainer_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        location: sess.location || 'Training Room',
        date: sess.date || sess.session_date || 'Aug 26, 2026',
        time: sess.time || sess.time_slot || '14:00 - 17:00',
        status: sess.status || 'Scheduled',
        roster: Array.isArray(sess.roster) ? sess.roster : []
    };
}

function normalizeTrainingResult(res) {
    if (!res) return {};
    return {
        ...res,
        id: res.id,
        sessionId: res.sessionId || res.session_id || 'sess-101',
        programId: res.programId || res.program_id || 'prog-1',
        programTitle: res.programTitle || res.program_title || 'Training Program',
        category: res.category || 'Service',
        dept: res.dept || 'Front Office',
        associateId: res.associateId || res.associate_id || 'emp-101',
        associateName: res.associateName || res.associate_name || 'Associate',
        associateRole: res.associateRole || res.associate_role || 'Staff',
        associateAvatar: res.associateAvatar || res.associate_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        trainerName: res.trainerName || res.trainer_name || 'Trainer',
        completionDate: res.completionDate || res.completion_date || 'Aug 24, 2026',
        attendanceRate: res.attendanceRate || res.attendance_rate || '100%',
        quizScore: res.quizScore ?? res.quiz_score ?? 95,
        passingThreshold: res.passingThreshold ?? res.passing_threshold ?? 80,
        resultStatus: res.resultStatus || res.result_status || 'Passed & Certified',
        feedbackRating: res.feedbackRating ?? res.feedback_rating ?? 5.0,
        certificateReference: res.certificateReference || res.certificate_reference || null,
        competencyTarget: res.competencyTarget || res.competency_target || 'Service',
        competencyKey: res.competencyKey || res.competency_key || 'service',
        competencyScoreBefore: res.competencyScoreBefore ?? res.competency_score_before ?? 3.5,
        competencyScoreAfter: res.competencyScoreAfter ?? res.competency_score_after ?? 4.8,
        xpAwarded: res.xpAwarded ?? res.xp_awarded ?? 150
    };
}

async function initTrainingManagement() {
    // 1. Initial Synchronous Render with Local State
    renderTrainingNeeds();
    renderTrainingPrograms();
    renderTrainingSessions();
    renderAttendanceConsole();
    renderTrainingResults();
    renderCertsTable();
    renderBasicTrainingReport();
    updateTrainingStats();

    // 2. Asynchronous Fetch & Sync from MVC Backend
    try {
        showNeedsLoadingState();
        let bootstrapData = null;
        try {
            bootstrapData = await TrainingAPI.bootstrap();
        } catch (bErr) {
            console.warn('[Training] Bootstrap fetch failed, trying direct getNeeds fallback:', bErr);
        }

        if (!bootstrapData || !Array.isArray(bootstrapData.needs)) {
            try {
                const rawNeeds = await TrainingAPI.getNeeds();
                if (Array.isArray(rawNeeds)) {
                    bootstrapData = bootstrapData || {};
                    bootstrapData.needs = rawNeeds;
                }
            } catch (nErr) {
                console.warn('[Training] Fallback getNeeds also failed:', nErr);
            }
        }

        if (bootstrapData) {
            if (Array.isArray(bootstrapData.needs)) trainingNeedsState = bootstrapData.needs.map(normalizeTrainingNeed);
            if (Array.isArray(bootstrapData.propertyNeeds)) {
                window.propertyNeedsState = bootstrapData.propertyNeeds.map(normalizeTrainingNeed);
            } else if (Array.isArray(bootstrapData.allNeeds)) {
                window.propertyNeedsState = bootstrapData.allNeeds.map(normalizeTrainingNeed);
            } else {
                window.propertyNeedsState = trainingNeedsState;
            }
            if (Array.isArray(bootstrapData.programs)) trainingProgramsState = bootstrapData.programs.map(normalizeTrainingProgram);
            if (Array.isArray(bootstrapData.sessions)) trainingSessionsState = bootstrapData.sessions.map(normalizeTrainingSession);
            if (Array.isArray(bootstrapData.propertyResults)) {
                window.propertyResultsState = bootstrapData.propertyResults.map(normalizeTrainingResult);
            } else if (Array.isArray(bootstrapData.allResults)) {
                window.propertyResultsState = bootstrapData.allResults.map(normalizeTrainingResult);
            } else {
                window.propertyResultsState = [];
            }
            if (Array.isArray(bootstrapData.results) && bootstrapData.results.length > 0) {
                trainingResultsState = bootstrapData.results.map(normalizeTrainingResult);
            } else if (window.propertyResultsState && window.propertyResultsState.length > 0) {
                trainingResultsState = window.propertyResultsState;
            } else if (Array.isArray(bootstrapData.results)) {
                trainingResultsState = bootstrapData.results.map(normalizeTrainingResult);
            }
            if (Array.isArray(bootstrapData.certificates)) trainingCertificatesState = bootstrapData.certificates;
            if (Array.isArray(bootstrapData.allCertificates)) {
                window.propertyCertificatesState = bootstrapData.allCertificates;
            } else {
                window.propertyCertificatesState = trainingCertificatesState;
            }
            if (Array.isArray(bootstrapData.employees)) {
                trainingEmployeesState = bootstrapData.employees;
                window.trainingEmployeesState = bootstrapData.employees;
            }

            // Re-render UI with synchronized server state
            renderTrainingNeeds();
            renderTrainingPrograms();
            renderTrainingSessions();
            renderAttendanceConsole();
            renderTrainingResults();
            renderCertsTable();
            renderBasicTrainingReport();
            updateTrainingStats();
        }
    } catch (err) {
        console.warn('[Training] Running with cached offline state:', err.message);
    }

    // 3. Supabase Realtime Subscription for Competency Gaps, Performance Evaluations & Training Needs
    const sbClient = window.supabaseClient || (window.supabase && typeof window.supabase.channel === 'function' ? window.supabase : null);
    if (sbClient && typeof sbClient.channel === 'function') {
        // Debounce + in-flight lock to prevent infinite loop:
        // bootstrap({ force_sync }) writes back to training_needs, which fires
        // another realtime event on the same table, re-triggering this handler.
        let _realtimeSyncInFlight = false;
        let _realtimeLastSyncTs = 0;
        const REALTIME_DEBOUNCE_MS = 10000; // ignore re-fires within 10 s of last sync

        const handleRealtimeSync = async (source) => {
            const now = Date.now();
            if (_realtimeSyncInFlight) {
                console.log(`[Training Realtime] Skipping ${source} — sync already in flight.`);
                return;
            }
            if (now - _realtimeLastSyncTs < REALTIME_DEBOUNCE_MS) {
                console.log(`[Training Realtime] Skipping ${source} — debounced (${Math.round((now - _realtimeLastSyncTs) / 1000)}s since last sync).`);
                return;
            }

            _realtimeSyncInFlight = true;
            console.log(`[Training Realtime] Change detected in ${source}: refreshing deficits.`);
            try {
                const freshData = await TrainingAPI.bootstrap({ force_sync: true });
                _realtimeLastSyncTs = Date.now();
                if (freshData) {
                    if (Array.isArray(freshData.needs)) trainingNeedsState = freshData.needs.map(normalizeTrainingNeed);
                    if (Array.isArray(freshData.propertyNeeds)) {
                        window.propertyNeedsState = freshData.propertyNeeds.map(normalizeTrainingNeed);
                    } else if (Array.isArray(freshData.allNeeds)) {
                        window.propertyNeedsState = freshData.allNeeds.map(normalizeTrainingNeed);
                    }
                    renderTrainingNeeds();
                    updateTrainingStats();
                    if (typeof window.showToast === 'function') {
                        window.showToast(`Live Deficit Detected: Training Queue refreshed from ${source}.`, 'info');
                    }
                }
            } catch (err) {
                console.warn('[Training Realtime] Live sync error:', err);
            } finally {
                _realtimeSyncInFlight = false;
            }
        };

        sbClient
            .channel('training_realtime_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'competency_assessments' }, () => handleRealtimeSync('competency appraisal'))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'performance_evaluations' }, () => handleRealtimeSync('performance evaluation'))
            // NOTE: Do NOT listen on 'training_needs' here — that table is written to
            // by the sync itself (syncDeficitsFromAssessments), so subscribing to it
            // creates an infinite realtime loop. The two listeners above cover all
            // upstream data sources that feed into training_needs.
            .subscribe();
    }
}

function switchTrainingStage(stageSubTab) {
    switchSubTab('training', stageSubTab);
}

function getAggregatedCertificates() {
    const list = [];
    const seenAssociates = new Set();
    const seenRefs = new Set();
    const isSupervisor = (window.activePersonaRole === 'Supervisor' || window.activePersonaRole === 'DeptHead' || window.activePersonaKey === 'manager' || window.activePersonaKey === 'supervisor' || window.activePersonaKey === 'depthead');
    const currentUserDept = window.currentUser?.department || window.currentUser?.dept;
    const showAll = window.trainingSupervisorShowAll || window.trainingResultsShowAll;

    const getEmpDept = (empId) => {
        if (!empId || !Array.isArray(trainingEmployeesState)) return null;
        const e = trainingEmployeesState.find(x => String(x.id).toLowerCase() === String(empId).toLowerCase());
        return e ? (e.department || e.dept) : null;
    };

    const shouldInclude = (itemDept, empId) => {
        if (!isSupervisor || showAll || !currentUserDept) return true;
        if (matchesDepartment(itemDept, currentUserDept)) return true;
        const eDept = getEmpDept(empId);
        if (eDept && matchesDepartment(eDept, currentUserDept)) return true;
        return false;
    };

    const resultsPool = (Array.isArray(window.propertyResultsState) && window.propertyResultsState.length > 0)
        ? window.propertyResultsState
        : trainingResultsState;

    // 1. From resultsPool
    resultsPool.forEach(r => {
        if (!shouldInclude(r.dept, r.associateId)) return;
        const ref = r.certificateReference || r.certificate_reference;
        const assocKey = String(r.associateId || r.associateName || '').toLowerCase().trim();
        if (ref && assocKey && !seenAssociates.has(assocKey)) {
            seenAssociates.add(assocKey);
            if (ref) seenRefs.add(ref);
            list.push({
                id: r.id,
                programTitle: r.programTitle || r.program_title || 'Hospitality Mastery Program',
                associateName: r.associateName || r.associate_name || 'Associate',
                associateRole: r.associateRole || r.associate_role || 'Hotel Staff',
                certificateReference: ref,
                completionDate: r.completionDate || r.completion_date || 'Aug 29, 2026',
                trainerName: r.trainerName || r.trainer_name || 'Lead Master Trainer',
                quizScore: r.quizScore || r.quiz_score || 96,
                employeeId: r.associateId || r.associate_id,
                dept: r.dept || 'General'
            });
        }
    });

    const certsPool = (Array.isArray(window.propertyCertificatesState) && window.propertyCertificatesState.length > 0)
        ? window.propertyCertificatesState
        : trainingCertificatesState;

    // 2. From certsPool
    certsPool.forEach(c => {
        const cDept = c.dept || c.department || '';
        const cEmpId = c.employee_id || c.employeeId;
        if (!shouldInclude(cDept, cEmpId)) return;
        const ref = c.certificateNumber || c.certificate_number;
        const assocKey = String(cEmpId || c.associate_name || c.associateName || '').toLowerCase().trim();
        if (ref && assocKey && !seenAssociates.has(assocKey)) {
            seenAssociates.add(assocKey);
            if (ref) seenRefs.add(ref);
            list.push({
                id: c.id || ('cert-' + ref),
                programTitle: c.programTitle || c.program_title || 'Hospitality Mastery Program',
                associateName: c.associateName || c.associate_name || 'Associate',
                associateRole: c.associateRole || c.associate_role || 'Hotel Staff',
                certificateReference: ref,
                completionDate: c.issueDate || c.issue_date || 'Aug 29, 2026',
                trainerName: 'Lead Master Trainer',
                quizScore: c.score || 96,
                employeeId: cEmpId,
                dept: cDept || 'General'
            });
        }
    });

    // 3. From resolved trainingNeedsState with certificate/license
    const needsPool = (Array.isArray(window.propertyNeedsState) && window.propertyNeedsState.length > 0)
        ? window.propertyNeedsState
        : trainingNeedsState;

    needsPool.forEach(n => {
        if (!shouldInclude(n.dept, n.employeeId || n.employee_id)) return;
        if (n.status === 'Resolved' || n.status === 'Completed') {
            const rawId = String(n.id || '').replace(/\D/g, '') || '9412';
            const ref = n.certificateReference || n.certificate_reference || `OXF-CERT-2026-${rawId.padStart(4, '0')}`;
            const assocKey = String(n.employeeId || n.employee_id || n.associateName || '').toLowerCase().trim();
            if (assocKey && !seenAssociates.has(assocKey)) {
                seenAssociates.add(assocKey);
                if (ref) seenRefs.add(ref);
                list.push({
                    id: 'need-cert-' + (n.id || ref),
                    programTitle: n.linkedProgramTitle || n.targetCompetency || 'Hospitality Mastery Program',
                    associateName: n.associateName || 'Associate',
                    associateRole: n.associateRole || 'Staff',
                    certificateReference: ref,
                    completionDate: n.dateIdentified || 'Aug 29, 2026',
                    trainerName: 'Lead Master Trainer',
                    quizScore: 96,
                    employeeId: n.employeeId || n.employee_id,
                    dept: n.dept || 'General'
                });
            }
        }
    });

    return list;
}
window.getAggregatedCertificates = getAggregatedCertificates;

function updateTrainingStats() {
    const isAssociate = (window.activePersonaRole === 'Associate' || window.activePersonaKey === 'associate' || window.activePersonaKey === 'employee');
    const currentEmpId = window.currentUser?.id;

    let needs = trainingNeedsState;
    let results = trainingResultsState;
    let certs = getAggregatedCertificates();

    if (isAssociate && currentEmpId) {
        needs = needs.filter(n => n.employeeId === currentEmpId);
        results = results.filter(r => r.associateId === currentEmpId);
        certs = certs.filter(c => c.employeeId === currentEmpId || (window.currentUser?.name && String(c.associateName).toLowerCase().includes(String(window.currentUser.name).toLowerCase())));
    }

    const identifiedCount = needs.filter(n => n.status !== 'Resolved' && n.status !== 'Completed').length;
    const programsCount = trainingProgramsState.length;
    const activeSessionsCount = trainingSessionsState.filter(s => s.status !== 'Completed').length;
    const certifiedCount = certs.length;

    const elNeeds = document.getElementById('stat-training-needs');
    const elPrograms = document.getElementById('stat-training-programs');
    const elSessions = document.getElementById('stat-training-sessions');
    const elCertified = document.getElementById('stat-training-certified');

    if (elNeeds) elNeeds.textContent = identifiedCount;
    if (elPrograms) elPrograms.textContent = programsCount;
    if (elSessions) elSessions.textContent = activeSessionsCount;
    if (elCertified) elCertified.textContent = certifiedCount;
}

let needsActiveFilterTab = 'active';

function setNeedsFilter(filter) {
    needsActiveFilterTab = filter;

    const filterBtns = ['active', 'performance', 'resolved', 'all'];
    filterBtns.forEach(f => {
        const btn = document.getElementById(`btn-needs-filter-${f}`);
        if (btn) {
            if (f === filter) {
                btn.className = 'px-3 py-1 rounded-lg text-xs font-bold bg-primary text-white transition shadow-sm whitespace-nowrap';
            } else {
                btn.className = 'px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition whitespace-nowrap';
            }
        }
    });

    const badge = document.getElementById('needs-filter-count-badge');
    if (badge) {
        badge.textContent = filter === 'active' 
            ? 'Showing Active Deficits' 
            : filter === 'performance' 
                ? 'Showing Referrals' 
                : filter === 'resolved' 
                    ? 'Showing Resolved History' 
                    : 'Showing All Audit Triggers';
    }

    renderTrainingNeeds();
}

function showNeedsLoadingState() {
    const container = document.getElementById('training-needs-list');
    if (container) {
        container.innerHTML = `
            <div class="col-span-full py-12 flex flex-col items-center justify-center space-y-3 bg-white/50 rounded-2xl border border-[#E8DEDC] border-dashed">
                <i class="fas fa-circle-notch fa-spin text-primary text-3xl"></i>
                <div class="text-slate-500 font-medium text-xs">Synchronizing live competency appraisals...</div>
            </div>
        `;
    }
}

function renderTrainingNeeds() {
    const container = document.getElementById('training-needs-list');
    if (!container) return;

    const isAssociate = (window.activePersonaRole === 'Associate' || window.activePersonaKey === 'associate' || window.activePersonaKey === 'employee');
    const isSupervisor = (window.activePersonaRole === 'Supervisor' || window.activePersonaRole === 'DeptHead' || window.activePersonaKey === 'manager' || window.activePersonaKey === 'supervisor' || window.activePersonaKey === 'depthead');
    const currentEmpId = window.currentUser?.id;
    const currentUserDept = window.currentUser?.department || window.currentUser?.dept;

    // Use full property deficits if supervisor enabled property-wide view
    const propertyNeeds = (window.propertyNeedsState && window.propertyNeedsState.length > 0)
        ? window.propertyNeedsState
        : trainingNeedsState.map(normalizeTrainingNeed);

    let allNormalized = (window.trainingSupervisorShowAll && propertyNeeds.length > 0)
        ? propertyNeeds
        : trainingNeedsState.map(normalizeTrainingNeed);

    if (isAssociate && currentEmpId) {
        allNormalized = allNormalized.filter(n => n.employeeId === currentEmpId);
    } else if (isSupervisor && currentUserDept && !window.trainingSupervisorShowAll) {
        allNormalized = allNormalized.filter(n => matchesDepartment(n.dept, currentUserDept));
    }
    
    const perfItems = allNormalized.filter(n => n.isPerformanceGoal);

    let filteredNeeds = allNormalized;
    if (needsActiveFilterTab === 'active') {
        filteredNeeds = allNormalized.filter(n => n.status !== 'Resolved' && n.status !== 'Completed' && !n.isPerformanceGoal);
    } else if (needsActiveFilterTab === 'performance') {
        filteredNeeds = perfItems.filter(n => n.status !== 'Resolved' && n.status !== 'Completed');
    } else if (needsActiveFilterTab === 'resolved') {
        filteredNeeds = allNormalized.filter(n => n.status === 'Resolved' || n.status === 'Completed');
    }

    const badge = document.getElementById('needs-filter-count-badge');
    if (badge) {
        badge.textContent = needsActiveFilterTab === 'active' 
            ? `Showing Active Deficits (${filteredNeeds.length})` 
            : needsActiveFilterTab === 'performance' 
                ? `Showing Active Referrals (${filteredNeeds.length})` 
                : needsActiveFilterTab === 'resolved' 
                    ? `Showing Resolved History (${filteredNeeds.length})` 
                    : `Showing All Audit Triggers (${filteredNeeds.length})`;
    }

    // Tab button count badges
    const activeNeedsCount = allNormalized.filter(n => n.status !== 'Resolved' && n.status !== 'Completed' && !n.isPerformanceGoal).length;
    const referralsCount = perfItems.filter(n => n.status !== 'Resolved' && n.status !== 'Completed').length;
    const resolvedCount = allNormalized.filter(n => n.status === 'Resolved' || n.status === 'Completed').length;
    const allCount = allNormalized.length;

    // Personalize Header and Filters for Associate vs Supervisor
    const headTitle = document.getElementById('training-needs-header-title');
    const headDesc = document.getElementById('training-needs-header-desc');
    const headBadge = document.getElementById('training-needs-header-badge');
    const btnActive = document.getElementById('btn-needs-filter-active');
    const btnPerf = document.getElementById('btn-needs-filter-performance');
    const btnResolved = document.getElementById('btn-needs-filter-resolved');
    const btnAll = document.getElementById('btn-needs-filter-all');

    if (isAssociate) {
        if (headTitle) headTitle.textContent = 'My Training & Skill Development Plan';
        if (headDesc) headDesc.textContent = 'Personalized learning assignments and mandatory compliance requirements to close skill gaps';
        if (headBadge) headBadge.innerHTML = '<i class="fas fa-user-graduate mr-1"></i> My Learning Plan';
        if (btnActive) btnActive.innerHTML = `<i class="fas fa-bolt mr-1 text-amber-300"></i> My Active Needs <span class="ml-1 px-1.5 py-0.5 rounded-full ${needsActiveFilterTab === 'active' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'} text-[10px] font-bold">${activeNeedsCount}</span>`;
        if (btnPerf) btnPerf.innerHTML = `<i class="fas fa-bullseye mr-1 text-indigo-600"></i> My Goal Referrals <span class="ml-1 px-1.5 py-0.5 rounded-full ${needsActiveFilterTab === 'performance' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'} text-[10px] font-bold">${referralsCount}</span>`;
        if (btnResolved) btnResolved.innerHTML = `<i class="fas fa-check-circle mr-1 text-emerald-600"></i> My Completed &amp; Certs <span class="ml-1 px-1.5 py-0.5 rounded-full ${needsActiveFilterTab === 'resolved' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'} text-[10px] font-bold">${resolvedCount}</span>`;
        if (btnAll) btnAll.innerHTML = `All My Training <span class="ml-1 px-1.5 py-0.5 rounded-full ${needsActiveFilterTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'} text-[10px] font-bold">${allCount}</span>`;
    } else {
        if (headTitle) headTitle.textContent = 'Skill Gap Audits & Mandatory Compliance Requirements';
        if (headDesc) headDesc.textContent = 'Direct triggers identifying which associate requires training and linking to syllabus';
        if (headBadge) headBadge.innerHTML = '<i class="fas fa-bolt mr-1"></i> Live Needs Queue';
        if (btnActive) btnActive.innerHTML = `<i class="fas fa-bolt mr-1 text-amber-300"></i> Active Deficits <span class="ml-1 px-1.5 py-0.5 rounded-full ${needsActiveFilterTab === 'active' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'} text-[10px] font-bold">${activeNeedsCount}</span>`;
        if (btnPerf) btnPerf.innerHTML = `<i class="fas fa-share-from-square mr-1 text-indigo-600"></i> Referrals <span class="ml-1 px-1.5 py-0.5 rounded-full ${needsActiveFilterTab === 'performance' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'} text-[10px] font-bold">${referralsCount}</span>`;
        if (btnResolved) btnResolved.innerHTML = `<i class="fas fa-check-circle mr-1 text-emerald-600"></i> Resolved History <span class="ml-1 px-1.5 py-0.5 rounded-full ${needsActiveFilterTab === 'resolved' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'} text-[10px] font-bold">${resolvedCount}</span>`;
        if (btnAll) btnAll.innerHTML = `All Audit Triggers <span class="ml-1 px-1.5 py-0.5 rounded-full ${needsActiveFilterTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'} text-[10px] font-bold">${allCount}</span>`;
    }

    if (filteredNeeds.length === 0) {
        // Auto-expand: if supervisor's dept has 0 deficits but other depts do, show property-wide automatically
        if (isSupervisor && !window.trainingSupervisorShowAll && needsActiveFilterTab === 'active') {
            const otherDeptDeficitsCount = propertyNeeds.filter(n => n.status !== 'Resolved' && n.status !== 'Completed' && !n.isPerformanceGoal && !matchesDepartment(n.dept, currentUserDept)).length;
            if (otherDeptDeficitsCount > 0) {
                window.trainingSupervisorShowAll = true;
                renderTrainingNeeds();
                return;
            }
        }

        const emptyMsg = needsActiveFilterTab === 'performance'
            ? (isAssociate ? 'No formal training needs linked to your Performance Goals yet.' : 'No formal training needs linked to Performance Goal Evaluations / IDP yet.')
            : needsActiveFilterTab === 'resolved'
                ? (isAssociate ? 'No completed training certifications recorded on your profile yet.' : 'No resolved training history recorded yet.')
                : (isAssociate ? 'Great job! You have no pending skill gaps or compliance deficits.' : 'No active skill gap deficits or compliance requirements pending in this view.');

        container.innerHTML = `
            <div class="card-clean p-8 bg-white border border-[#E8DEDC] text-center space-y-3">
                <div class="w-12 h-12 rounded-full bg-[#FAF8F7] border border-[#E8DEDC] text-slate-400 flex items-center justify-center mx-auto">
                    <i class="fas fa-check-double text-lg text-emerald-600"></i>
                </div>
                <h4 class="font-bold text-slate-800 text-sm">${needsActiveFilterTab === 'performance' ? (isAssociate ? 'No Goal Referrals' : 'No Performance Goal Needs') : (needsActiveFilterTab === 'resolved' ? (isAssociate ? 'No Certifications Yet' : 'No Resolved Items') : (isAssociate ? 'All Your Competencies on Target' : 'All Associate Competencies at Benchmark'))}</h4>
                <p class="text-slate-500 text-xs">${emptyMsg}</p>
            </div>
        `;
        return;
    }

    let supervisorBannerHtml = '';
    if (isSupervisor && window.trainingSupervisorShowAll) {
        supervisorBannerHtml = `
            <div class="col-span-full mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
                <div class="flex items-center space-x-2 text-amber-900 font-bold">
                    <i class="fas fa-hotel text-amber-600"></i>
                    <span>Viewing Property-Wide Deficits (All Hotel Departments)</span>
                </div>
                <button type="button" onclick="window.trainingSupervisorShowAll = false; renderTrainingNeeds();" class="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-300 transition shadow-xs">
                    <i class="fas fa-filter mr-1"></i> Return to My Department Only (${currentUserDept || 'Assigned Department'})
                </button>
            </div>
        `;
    }

    container.innerHTML = supervisorBannerHtml + filteredNeeds.map(need => {
        const isResolved = need.status === 'Resolved' || need.status === 'Completed';
        const isScheduled = need.status === 'Scheduled';
        const isSkillGap = need.sourceType === 'competency_gap';

        const existingSession = trainingSessionsState.find(s => s.linkedNeedId === need.id && s.status !== 'Completed');
        const isAlreadyScheduled = !!existingSession || isScheduled;

        // Find linked program metadata
        const prog = trainingProgramsState.find(p => p.id === need.linkedProgramId) || null;
        const programTitle = prog ? prog.title : (need.linkedProgramTitle || need.category || 'Hospitality Mastery Program');
        const programDuration = prog ? prog.duration : (need.programDuration || '3.5 Hours (Workshop)');
        const programPassingScore = prog ? prog.passingScore : (need.programPassingScore || 80);
        const programFormat = prog ? prog.format : 'In-Person Workshop & Roleplay';

        // Calculate progress percentage on 5.0 scale
        const currentPct = Math.min(100, Math.max(10, Math.round((need.currentScore / 5.0) * 100)));
        const targetPct = Math.min(100, Math.max(10, Math.round((need.requiredScore / 5.0) * 100)));

        const urgencyBadge = need.urgency === 'Critical'
            ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider"><i class="fas fa-fire mr-1"></i> Critical Urgency</span>`
            : need.urgency === 'High'
                ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200"><i class="fas fa-clock mr-1"></i> High Priority</span>`
                : `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Standard</span>`;

        const typeBadge = need.isPerformanceGoal
            ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200"><i class="fas fa-bullseye mr-1"></i> ${need.sourceLabel || 'Performance IDP Goal'}${need.targetGoalId ? ` (Goal #${need.targetGoalId})` : ''}</span>`
            : isSkillGap
                ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20"><i class="fas fa-chart-radar mr-1"></i> Skill Gap: ${need.targetCompetency}</span>`
                : `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-800 border border-amber-500/20"><i class="fas fa-shield-halved mr-1"></i> Mandatory Compliance</span>`;

        const statusPill = isResolved
            ? `<span class="badge-sage font-bold"><i class="fas fa-check-circle mr-1"></i> Resolved &amp; Synced (4.8 Score)</span>`
            : isScheduled
                ? `<span class="badge-dusty font-bold"><i class="fas fa-calendar-check mr-1"></i> Session Scheduled</span>`
                : `<span class="badge-terracotta font-bold"><i class="fas fa-bolt mr-1"></i> Deficit Active (< 3.8 TNA)</span>`;

        const performanceGoalSnippet = need.targetGoalId ? `
            <div class="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div class="space-y-0.5">
                    <div class="flex items-center space-x-2 text-indigo-950 font-bold text-[11px]">
                        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white">
                            <i class="fas fa-bullseye mr-1"></i> Performance Goal #${need.targetGoalId}
                        </span>
                        <span class="text-slate-900">${need.linkedGoalTitle || 'Operational Performance Objective'}</span>
                    </div>
                    <p class="text-slate-600 text-[11px]">
                        Target Metric: <strong class="text-indigo-900">${need.linkedGoalMetric || 'Benchmark Met'}</strong> · Weight: <strong class="text-slate-700">${need.linkedGoalWeight || 'Standard'}</strong>
                    </p>
                </div>
                <div class="flex items-center space-x-2 flex-shrink-0">
                    <span class="badge-sage text-[10px] font-bold"><i class="fas fa-link mr-1"></i> IDP Synced</span>
                </div>
            </div>
        ` : '';

        return `
            <div class="card-clean p-5 hover:shadow-md transition space-y-4 border ${isResolved ? 'bg-emerald-50/20 border-emerald-200' : 'bg-white border-[#E8DEDC]'}">
                <!-- Top Row: Associate & Need Status -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center space-x-3.5">
                        <img src="${need.associateAvatar}" alt="${need.associateName}" class="w-11 h-11 rounded-full object-cover border border-[#E8DEDC] shadow-sm flex-shrink-0">
                        <div>
                            <div class="flex flex-wrap items-center gap-1.5">
                                <h4 class="font-bold text-sm text-slate-900 leading-snug">${need.title}</h4>
                                ${typeBadge}
                                ${urgencyBadge}
                            </div>
                            <p class="text-xs text-slate-500 font-medium mt-0.5">
                                Associate: <strong class="text-slate-800">${need.associateName}</strong> (${need.associateRole}) · Dept: <strong class="text-slate-700">${need.dept}</strong>
                            </p>
                        </div>
                    </div>
                    <div class="flex-shrink-0">
                        ${statusPill}
                    </div>
                </div>

                ${performanceGoalSnippet}

                <!-- Middle Row: Benchmark Comparison & Diagnosis -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 p-3.5 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] text-xs items-center">
                    
                    <!-- Score & Gap Progress Visualizer (5 Cols) -->
                    <div class="lg:col-span-5 space-y-1.5">
                        <div class="flex justify-between items-center text-[11px]">
                            <span class="text-slate-500 font-semibold">Current vs Target Benchmark:</span>
                            <span class="font-black text-slate-800">
                                <span class="${need.currentScore < 3.8 ? 'text-rose-600' : (need.currentScore < need.requiredScore ? 'text-amber-600' : 'text-emerald-700')} font-bold">${need.currentScore}</span>
                                <span class="text-slate-400 font-normal"> / 5.0</span>
                                <span class="text-slate-400 mx-1">vs</span>
                                <span class="text-slate-900">${need.requiredScore}</span>
                                <span class="ml-1 px-1.5 py-0.2 rounded text-[10px] font-bold ${need.gap < 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
                                    ${need.gap < 0 ? need.gap : '+' + need.gap} Gap
                                </span>
                            </span>
                        </div>

                        <!-- Progress Bar -->
                        <div class="w-full bg-slate-200/80 rounded-full h-2.5 relative overflow-hidden flex">
                            <div class="h-2.5 rounded-full ${need.currentScore < 3.8 ? 'bg-rose-500' : 'bg-amber-500'} transition-all duration-500" style="width: ${currentPct}%;"></div>
                        </div>
                        <div class="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>Assessed Score (${need.currentScore} &lt; 3.8 TNA)</span>
                            <span>Target Level (${need.requiredScore})</span>
                        </div>
                    </div>

                    <!-- Diagnosis Note (7 Cols) -->
                    <div class="lg:col-span-7 lg:pl-3 lg:border-l border-slate-200 space-y-1">
                        <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Diagnosis Audit Note &amp; Trigger Context:</span>
                        ${formatDiagnosisNotesHtml(need.notes)}
                        <div class="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                            <span><i class="fas fa-calendar-check mr-1 text-slate-400"></i> Identified: <strong class="text-slate-600">${need.dateIdentified}</strong></span>
                            <span><i class="fas fa-layer-group mr-1 text-primary"></i> Target Competency: <strong class="text-primary font-bold">${need.targetCompetency}</strong></span>
                        </div>
                    </div>
                </div>

                <!-- Training Curriculum Resolution Banner -->
                ${prog ? `
                    <div class="p-3.5 bg-primary/5 rounded-xl border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div class="space-y-1">
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary text-white">
                                    <i class="fas fa-graduation-cap mr-1"></i> Assigned Curriculum
                                </span>
                                <span class="font-bold text-slate-900">${prog.title}</span>
                                ${!isResolved && !isAlreadyScheduled && !isAssociate ? `
                                    <button onclick="openAssignProgramModal('${need.id}')" class="text-[11px] text-primary hover:underline font-semibold ml-2">
                                        <i class="fas fa-pen-to-square mr-1"></i>Change
                                    </button>
                                ` : ''}
                            </div>
                            <p class="text-slate-600 text-[11px]">
                                <i class="fas fa-clock mr-1 text-slate-400"></i> ${prog.duration || '3 Hours'} · 
                                <i class="fas fa-chalkboard-user mr-1 text-slate-400"></i> ${prog.format || 'Workshop'}
                            </p>
                        </div>

                        <div class="flex-shrink-0">
                            ${isResolved ? `
                                <div class="flex items-center space-x-2">
                                    <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                                        <i class="fas fa-award mr-1.5 text-emerald-600"></i>
                                        <span>Deficit Resolved · Score 4.8 Master Level</span>
                                    </span>
                                    <button onclick="switchTrainingStage('certs')" class="btn-secondary px-3 py-1.5 text-xs font-bold flex items-center space-x-1">
                                        <i class="fas fa-certificate text-primary mr-1"></i>
                                        <span>View License</span>
                                    </button>
                                </div>
                            ` : isAlreadyScheduled ? `
                                <div class="flex items-center space-x-2">
                                    <span class="badge-sage text-xs font-bold py-1.5 px-3">
                                        <i class="fas fa-calendar-check mr-1.5"></i> Session Scheduled (${existingSession ? existingSession.date : 'Upcoming'})
                                    </span>
                                    ${isAssociate && existingSession ? `
                                        <span class="text-xs text-slate-500 font-medium px-2 py-1.5 bg-white border border-[#E8DEDC] rounded-lg shadow-2xs">
                                            <i class="fas fa-clock mr-1 text-slate-400"></i> ${existingSession.time} &middot; <i class="fas fa-location-dot ml-1 mr-1 text-slate-400"></i> ${existingSession.location}
                                        </span>
                                    ` : isAssociate ? `
                                        <span class="text-xs text-slate-500 font-medium px-2 py-1.5 bg-white border border-[#E8DEDC] rounded-lg">Pending final time slot</span>
                                    ` : `
                                        <button onclick="switchTrainingStage('schedules')" class="btn-secondary px-3 py-1.5 text-xs font-bold flex items-center space-x-1 shadow-2xs">
                                            <i class="fas fa-calendar mr-1"></i>
                                            <span>View Cohort Roster &rarr;</span>
                                        </button>
                                    `}
                                </div>
                            ` : isAssociate ? `
                                <span class="badge-dusty text-xs font-bold py-1.5 px-3">Pending Schedule</span>
                            ` : `
                                <button onclick="scheduleFromNeed('${need.id}')" class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-2 shadow-sm whitespace-nowrap">
                                    <i class="fas fa-calendar-plus"></i>
                                    <span>Schedule Training Session &rarr;</span>
                                </button>
                            `}
                        </div>
                    </div>
                ` : `
                    <div class="p-3.5 ${isAssociate ? 'bg-slate-50 border border-slate-200' : 'bg-amber-50/90 border border-amber-200'} rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div class="space-y-1">
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${isAssociate ? 'bg-slate-500' : 'bg-amber-600'} text-white">
                                    ${isAssociate ? '<i class="fas fa-hourglass-half mr-1"></i> Pending Assignment' : '<i class="fas fa-user-gear mr-1"></i> Supervisor Action Required'}
                                </span>
                                <span class="font-bold text-slate-900">No Training Program Assigned Yet</span>
                            </div>
                            <p class="text-slate-600 text-[11px]">
                                <i class="fas fa-circle-info mr-1 ${isAssociate ? 'text-slate-400' : 'text-amber-600'}"></i> ${isAssociate ? 'Your supervisor will assign a curriculum to help you bridge this competency gap.' : `Review diagnosed deficit scores for <strong>${need.associateName}</strong> and manually select the appropriate training curriculum.`}
                            </p>
                        </div>

                        <div class="flex items-center space-x-2 flex-shrink-0">
                            ${isAlreadyScheduled ? `
                                <span class="badge-sage text-xs font-bold py-1.5 px-3">
                                    <i class="fas fa-calendar-check mr-1.5"></i> Training Scheduled
                                </span>
                                ${isAssociate ? '' : `
                                    <button onclick="switchTrainingStage('schedules')" class="btn-secondary px-3 py-1.5 text-xs font-bold flex items-center space-x-1 shadow-2xs">
                                        <i class="fas fa-calendar mr-1"></i>
                                        <span>View Cohort &rarr;</span>
                                    </button>
                                `}
                            ` : isAssociate ? `
                                <span class="text-xs text-slate-400 font-bold px-2 py-1"><i class="fas fa-clock mr-1"></i> Awaiting Manager</span>
                            ` : `
                                <button onclick="openAssignProgramModal('${need.id}')" class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-sm whitespace-nowrap">
                                    <i class="fas fa-plus-circle mr-1"></i>
                                    <span>Assign Training Program &rarr;</span>
                                </button>
                                <button onclick="switchTrainingStage('programs')" class="px-3 py-2 rounded-lg bg-white border border-[#E8DEDC] hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1 shadow-2xs transition whitespace-nowrap">
                                    <i class="fas fa-layer-group text-slate-400"></i>
                                    <span>Browse Catalog</span>
                                </button>
                            `}
                        </div>
                    </div>
                `}
            </div>
        `;
    }).join('');
}

function renderTrainingPrograms() {
    const container = document.getElementById('training-programs-grid');
    if (!container) return;

    const isAssociate = (window.activePersonaRole === 'Associate' || window.activePersonaKey === 'associate' || window.activePersonaKey === 'employee');

    const progTitle = document.getElementById('training-programs-header-title');
    const progDesc = document.getElementById('training-programs-header-desc');
    const btnCreate = document.getElementById('btn-create-program');

    if (isAssociate) {
        if (progTitle) progTitle.textContent = 'Training Programs Catalog';
        if (progDesc) progDesc.textContent = 'Browse official hotel training courses, curriculum syllabi, target competencies, and certification requirements';
        if (btnCreate) btnCreate.classList.add('hidden');
    } else {
        if (progTitle) progTitle.textContent = 'Training Programs Catalog (Linked to Skill Gap or Mandatory Compliance)';
        if (progDesc) progDesc.textContent = 'Structured syllabi, passing thresholds, target competencies, and certified trainer requirements';
        if (btnCreate) btnCreate.classList.remove('hidden');
    }

    container.innerHTML = trainingProgramsState.map(prog => {
        return `
            <div class="card-clean p-5 hover:shadow-lg transition flex flex-col justify-between space-y-4 border border-[#E8DEDC] bg-white">
                <div class="space-y-3">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex items-center space-x-2.5">
                            <div class="w-9 h-9 rounded-xl bg-${prog.badgeColor}-500/10 text-${prog.badgeColor}-600 border border-${prog.badgeColor}-500/20 flex items-center justify-center flex-shrink-0">
                                <i class="fas ${prog.icon}"></i>
                            </div>
                            <div>
                                <span class="badge-${prog.badgeColor} text-[10px]">${prog.category}</span>
                                <h4 class="font-bold text-sm text-slate-900 mt-1 leading-snug">${prog.title}</h4>
                            </div>
                        </div>
                    </div>
                    <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">${prog.description}</p>

                    <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-1.5 text-xs">
                        <div class="flex justify-between">
                            <span class="text-slate-400 text-[11px]">Department:</span>
                            <span class="font-bold text-slate-800 text-[11px]">${prog.dept}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400 text-[11px]">Target Competency:</span>
                            <span class="font-bold text-slate-800 text-[11px]">${prog.targetCompetency}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400 text-[11px]">Duration &amp; Format:</span>
                            <span class="font-semibold text-slate-700 text-[11px]">${prog.duration} · ${prog.format}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400 text-[11px]">Passing Requirement:</span>
                            <span class="font-bold text-primary text-[11px]">&ge; ${prog.passingScore}% + ${prog.xpAward} XP</span>
                        </div>
                    </div>
                </div>

                <div class="pt-3 border-t border-[#E8DEDC] flex items-center justify-between">
                    <span class="text-[11px] font-semibold text-slate-500"><i class="fas fa-graduation-cap mr-1 text-primary"></i> ${prog.modules.length} Modules</span>
                    ${isAssociate ? `
                        <span class="text-[11px] font-bold text-slate-600 bg-[#FAF8F7] border border-[#E8DEDC] px-2.5 py-1 rounded-lg">
                            <i class="fas fa-book-open text-primary mr-1"></i> Standard Syllabus
                        </span>
                    ` : `
                        <button onclick="openScheduleModal('${prog.id}')" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                            <i class="fas fa-calendar-days"></i>
                            <span>Schedule Session &rarr;</span>
                        </button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

// =========================================================================
// 4. MODULE 2: SCHEDULING (Date, Time, Location, Trainer, Participants)
// =========================================================================

function renderTrainingSessions() {
    const container = document.getElementById('training-sessions-list');
    if (!container) return;

    const isAssociate = (window.activePersonaRole === 'Associate' || window.activePersonaKey === 'associate' || window.activePersonaKey === 'employee');
    const isSupervisor = (window.activePersonaRole === 'Supervisor' || window.activePersonaRole === 'DeptHead' || window.activePersonaKey === 'manager' || window.activePersonaKey === 'supervisor' || window.activePersonaKey === 'depthead');
    const currentEmpId = window.currentUser?.id;
    const currentUserDept = window.currentUser?.department || window.currentUser?.dept;

    let sessionsToRender = trainingSessionsState;
    if (isAssociate && currentEmpId) {
        sessionsToRender = trainingSessionsState.filter(s => s.roster && s.roster.some(r => r.associateId === currentEmpId || (window.currentUser?.name && String(r.name).toLowerCase().includes(String(window.currentUser.name).toLowerCase()))));
    } else if (isSupervisor && currentUserDept) {
        sessionsToRender = trainingSessionsState.filter(s => {
            const sessDept = (s.dept || '').toLowerCase();
            return matchesDepartment(sessDept, currentUserDept) || sessDept === '';
        });
    }

    if (sessionsToRender.length === 0) {
        container.innerHTML = `
            <div class="card-clean p-8 bg-white border border-[#E8DEDC] text-center space-y-3">
                <div class="w-12 h-12 rounded-full bg-[#FAF8F7] border border-[#E8DEDC] text-slate-400 flex items-center justify-center mx-auto">
                    <i class="fas fa-calendar-xmark text-lg text-slate-400"></i>
                </div>
                <h4 class="font-bold text-slate-800 text-sm">${isAssociate ? 'No Scheduled Sessions' : 'No Active Sessions'}</h4>
                <p class="text-slate-500 text-xs">${isAssociate ? 'You do not have any upcoming training sessions scheduled at this time. Once assigned by your supervisor, details will appear here.' : 'No training sessions scheduled yet. Click "+ Schedule Session" above to create a new cohort.'}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = sessionsToRender.map(sess => {
        const allCompleted = sess.roster && sess.roster.length > 0 && sess.roster.every(r => r.attendanceStatus === 'Completed' || r.evaluationStatus === 'Completed');
        const isCompleted = sess.status === 'Completed' || allCompleted;
        const isLive = !isCompleted && sess.status === 'In Progress';

        const statusBadge = isCompleted
            ? `<span class="badge-sage font-bold"><i class="fas fa-check-circle mr-1"></i> Completed</span>`
            : isLive
                ? `<span class="badge-terracotta animate-pulse"><i class="fas fa-satellite-dish mr-1"></i> In Progress</span>`
                : `<span class="badge-dusty"><i class="fas fa-calendar-clock mr-1"></i> Scheduled</span>`;

        return `
            <div class="card-clean p-6 hover:shadow-md transition space-y-4 border ${isLive ? 'border-terracotta/40 bg-terracotta-50/10' : isCompleted ? 'border-emerald-200/80 bg-emerald-50/10' : 'border-[#E8DEDC] bg-white'}">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div class="space-y-1.5">
                        <div class="flex items-center space-x-2">
                            ${statusBadge}
                            <span class="badge-sage text-[10px]">Dept: ${sess.dept}</span>
                        </div>
                        <h3 class="font-heading font-bold text-base text-slate-900">${sess.title}</h3>
                        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                            <span><i class="fas fa-calendar-day mr-1 text-primary"></i> <strong>${sess.date}</strong></span>
                            <span><i class="fas fa-clock mr-1 text-slate-400"></i> ${sess.time}</span>
                            <span><i class="fas fa-location-dot mr-1 text-slate-400"></i> <strong>${sess.location}</strong></span>
                        </div>
                    </div>

                    <div class="flex items-center space-x-3 bg-[#FAF8F7] p-3 rounded-2xl border border-[#E8DEDC] flex-shrink-0">
                        <img src="${sess.trainerAvatar}" alt="${sess.trainerName}" class="w-10 h-10 rounded-full object-cover border border-[#E8DEDC] shadow-sm">
                        <div class="text-xs">
                            <span class="text-slate-400 block text-[10px] uppercase font-bold">Assigned Trainer</span>
                            <span class="font-bold text-slate-900">${sess.trainerName}</span>
                            <span class="text-slate-500 block text-[10px]">${sess.trainerTitle}</span>
                        </div>
                    </div>
                </div>

                <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div class="flex items-center space-x-2">
                        <span class="font-bold text-slate-700">Registered Participants (${sess.roster.length}):</span>
                        <div class="flex -space-x-2 overflow-hidden">
                            ${sess.roster.map(r => `
                                <img src="${r.avatar}" title="${r.name} (${r.role})" class="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover">
                            `).join('')}
                        </div>
                    </div>

                    <div class="flex items-center space-x-2">
                        <button onclick="openAttendanceForSession('${sess.id}')" class="btn-secondary px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                            <i class="fas ${isCompleted ? 'fa-eye text-primary' : 'fa-user-check text-sage-dark'}"></i>
                            <span>${isCompleted ? 'View Cohort (Completed)' : 'Track Attendance'}</span>
                        </button>
                        ${isLive && !isSupervisor ? `
                            <button onclick="startSessionEvaluation('${sess.id}', '${sess.roster[0]?.associateId}')" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                                <i class="fas fa-clipboard-question"></i>
                                <span>Evaluate Participant &rarr;</span>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// =========================================================================
// 5. MODULE 3: ATTENDANCE TRACKING (Attended / Absent / Completed)
// =========================================================================

function renderAttendanceConsole() {
    const selector = document.getElementById('attendance-session-select');
    if (!selector) return;

    const isAssociate = (window.activePersonaRole === 'Associate' || window.activePersonaKey === 'associate' || window.activePersonaKey === 'employee');
    const isSupervisor = (window.activePersonaRole === 'Supervisor' || window.activePersonaRole === 'DeptHead' || window.activePersonaKey === 'manager' || window.activePersonaKey === 'supervisor' || window.activePersonaKey === 'depthead');
    const currentEmpId = window.currentUser?.id;
    const currentUserDept = window.currentUser?.department || window.currentUser?.dept;

    let filteredSessions = trainingSessionsState;
    if (isAssociate && currentEmpId) {
        filteredSessions = trainingSessionsState.filter(s => s.roster && s.roster.some(r => r.associateId === currentEmpId));
    } else if (isSupervisor && currentUserDept) {
        filteredSessions = trainingSessionsState.filter(s => {
            const sessDept = (s.dept || '').toLowerCase();
            return matchesDepartment(sessDept, currentUserDept) || sessDept === '';
        });
    }

    if (filteredSessions.length === 0) {
        selector.innerHTML = '<option value="">-- No active sessions found --</option>';
        const tbody = document.getElementById('attendance-roster-tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-5 py-8 text-center text-slate-400 text-xs italic bg-white border border-[#E8DEDC]">
                        ${isAssociate ? 'You are not currently scheduled for any training sessions.' : 'No active sessions to track.'}
                    </td>
                </tr>
            `;
        }
        
        const markAllBtn = document.getElementById('btn-mark-all-attended');
        if (markAllBtn) markAllBtn.classList.add('hidden');
        
        return;
    }

    if (!activeAttendanceSessionId || !filteredSessions.find(s => s.id === activeAttendanceSessionId)) {
        activeAttendanceSessionId = filteredSessions[0].id;
    }

    if (document.activeElement !== selector) {
        selector.innerHTML = filteredSessions.map(s => `
            <option value="${s.id}" ${s.id === activeAttendanceSessionId ? 'selected' : ''}>${s.title} (${s.date})</option>
        `).join('');
    }

    const markAllBtn = document.getElementById('btn-mark-all-attended');
    if (markAllBtn) {
        if (isAssociate) markAllBtn.classList.add('hidden');
        else markAllBtn.classList.remove('hidden');
    }

    const session = filteredSessions.find(s => s.id === activeAttendanceSessionId);
    if (!session) return;

    const titleEl = document.getElementById('attendance-session-header-title');
    const trainerEl = document.getElementById('attendance-session-header-trainer');
    const venueEl = document.getElementById('attendance-session-header-venue');
    const dateEl = document.getElementById('attendance-session-header-date');

    if (titleEl) titleEl.textContent = session.title;
    if (trainerEl) trainerEl.textContent = `Trainer: ${session.trainerName}`;
    if (venueEl) venueEl.innerHTML = `<i class="fas fa-location-dot mr-1 text-slate-400"></i> ${session.location}`;
    if (dateEl) dateEl.innerHTML = `<i class="fas fa-clock mr-1 text-slate-400"></i> ${session.date} &middot; ${session.time}`;

    const tbody = document.getElementById('attendance-roster-tbody');
    if (!tbody) return;

    let sessionRoster = session.roster || [];
    if (isAssociate && currentEmpId) {
        sessionRoster = sessionRoster.filter(member => member.associateId === currentEmpId);
    }

    tbody.innerHTML = sessionRoster.map(member => {
        const assocResult = trainingResultsState.find(r => r.associateId === member.associateId && r.sessionId === session.id);
        const hasPassed = assocResult && (assocResult.resultStatus.includes('Passed') || assocResult.resultStatus === 'Completed');
        const hasCert = assocResult && assocResult.certificateReference;

        const isAttended = member.attendanceStatus === 'Attended';
        const isAbsent = member.attendanceStatus === 'Absent';
        const isCompleted = member.attendanceStatus === 'Completed' || hasPassed;

        const statusBadge = isCompleted
            ? `<span class="badge-sage font-bold"><i class="fas fa-check-double mr-1"></i> Completed (100%)</span>`
            : isAttended
                ? `<span class="badge-dusty"><i class="fas fa-user-check mr-1"></i> Attended (Pending Quiz)</span>`
                : `<span class="badge-terracotta"><i class="fas fa-xmark mr-1"></i> Absent (0%)</span>`;

        const markAttendanceContent = isCompleted
            ? `<span class="badge-sage text-xs font-bold py-1 px-3 inline-flex items-center"><i class="fas fa-lock text-[10px] mr-1.5 opacity-70"></i> Attended (Completed)</span>`
            : isAssociate
            ? `
                <span class="badge-dusty text-[11px] font-bold py-1 px-2.5 inline-flex items-center">
                    <i class="fas fa-clock mr-1"></i> Pending Trainer Attendance
                </span>
            `
            : `
                <div class="flex items-center space-x-1.5">
                    <button onclick="setAssociateAttendance('${session.id}', '${member.associateId}', 'Attended')" 
                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${isAttended ? 'bg-dusty-dark text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                        <i class="fas fa-check mr-1 text-[10px]"></i> Attended
                    </button>
                    <button onclick="setAssociateAttendance('${session.id}', '${member.associateId}', 'Absent')" 
                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${isAbsent ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                        <i class="fas fa-xmark mr-1 text-[10px]"></i> Absent
                    </button>
                </div>
            `;

        const actionContent = isCompleted
            ? `
                <div class="flex items-center justify-end space-x-1.5">
                    <span class="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 py-1 px-2.5 rounded-lg inline-flex items-center">
                        <i class="fas fa-certificate text-gold mr-1"></i> Completed · View Only
                    </span>
                    ${hasCert ? `
                        <button onclick="viewTrainingCertificate('${assocResult.id}')" class="btn-secondary px-2.5 py-1 text-[11px] font-bold inline-flex items-center space-x-1">
                            <i class="fas fa-file-pdf text-primary"></i>
                            <span>View Cert</span>
                        </button>
                    ` : ''}
                </div>
            `
            : isAttended
                ? `
                    ${isSupervisor ? `
                        <span class="text-slate-400 text-[11px] italic font-medium">Evaluation pending for associate</span>
                    ` : `
                        <button onclick="startSessionEvaluation('${session.id}', '${member.associateId}')" 
                            class="btn-primary px-3 py-1.5 text-[11px] font-bold inline-flex items-center space-x-1 shadow-xs">
                            <i class="fas fa-pen-to-square"></i>
                            <span>${assocResult ? 'Retake Evaluation Quiz &rarr;' : 'Take Evaluation Quiz &rarr;'}</span>
                        </button>
                    `}
                `
                : `
                    <span class="text-slate-400 text-[11px] italic font-medium">Mark Attended First</span>
                `;

        return `
            <tr class="hover:bg-[#FAF8F7]/80 transition">
                <td class="px-5 py-3.5">
                    <div class="flex items-center space-x-3">
                        <img src="${member.avatar}" alt="${member.name}" class="w-8 h-8 rounded-full object-cover border border-[#E8DEDC]">
                        <div>
                            <span class="font-bold text-slate-900 block">${member.name}</span>
                            <span class="text-[11px] text-slate-500">${member.role} · ${member.dept}</span>
                        </div>
                    </div>
                </td>
                <td class="px-5 py-3.5 text-slate-600 font-medium">${member.checkInTime || '-'}</td>
                <td class="px-5 py-3.5">${statusBadge}</td>
                <td class="px-5 py-3.5">${markAttendanceContent}</td>
                <td class="px-5 py-3.5 text-right">${actionContent}</td>
            </tr>
        `;
    }).join('');
}

async function setAssociateAttendance(sessionId, associateId, status) {
    const session = trainingSessionsState.find(s => s.id === sessionId);
    if (!session) return;

    const member = session.roster.find(r => r.associateId === associateId);
    if (!member) return;

    if (member.attendanceStatus === 'Completed' || member.evaluationStatus === 'Completed') {
        showToast('This associate has completed certification. Attendance record is locked and finalized.', 'info');
        return;
    }

    const prevStatus = member.attendanceStatus;
    const prevRate = member.attendanceRate;

    // 1. Optimistic UI update
    member.attendanceStatus = status;
    member.attendanceRate = status === 'Absent' ? 0 : 100;

    const now = new Date();
    const checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    member.checkInTime = checkInTime;

    renderAttendanceConsole();
    renderTrainingSessions();
    renderBasicTrainingReport();
    showToast(`Attendance recorded: ${member.name} marked as "${status}"`, 'success');

    // 2. Persist to MVC Backend via AJAX
    try {
        await TrainingAPI.updateAttendance(sessionId, associateId, status, checkInTime);
    } catch (err) {
        // Rollback on network failure
        member.attendanceStatus = prevStatus;
        member.attendanceRate = prevRate;
        renderAttendanceConsole();
        renderTrainingSessions();
    }
}

async function markAllSessionPresent() {
    const session = trainingSessionsState.find(s => s.id === activeAttendanceSessionId);
    if (!session) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    session.roster.forEach(member => {
        member.attendanceStatus = 'Attended';
        member.attendanceRate = 100;
        member.checkInTime = timeStr;
    });

    renderAttendanceConsole();
    renderTrainingSessions();
    renderBasicTrainingReport();
    showToast(`All participants in "${session.title}" marked as Attended!`, 'success');

    // Persist all via AJAX
    try {
        await Promise.all(session.roster.map(m =>
            TrainingAPI.updateAttendance(session.id, m.associateId, 'Attended', timeStr)
        ));
    } catch (err) {
        console.warn('Failed to bulk sync attendance:', err);
    }
}

function changeAttendanceSession(sessionId) {
    activeAttendanceSessionId = sessionId;
    renderAttendanceConsole();
}

function openAttendanceForSession(sessionId) {
    activeAttendanceSessionId = sessionId;
    switchTrainingStage('attendance');
    renderAttendanceConsole();
}

// =========================================================================
// 6. MODULE 4: POST-TRAINING EVALUATION & RESULTS (Score, Cert Reference)
// =========================================================================

function startSessionEvaluation(sessionId, associateId) {
    const isSupervisor = (window.activePersonaRole === 'Supervisor' || window.activePersonaRole === 'DeptHead' || window.activePersonaKey === 'manager' || window.activePersonaKey === 'supervisor' || window.activePersonaKey === 'depthead');
    if (isSupervisor) {
        showToast('Supervisors cannot submit training evaluations. The assigned associate must complete the evaluation quiz themselves.', 'error');
        return;
    }

    const session = trainingSessionsState.find(s => s.id === sessionId);
    if (!session) return;

    const member = session.roster.find(r => r.associateId === associateId);
    if (!member) return;

    const program = trainingProgramsState.find(p => p.id === session.programId) || trainingProgramsState[0];

    if (member.attendanceStatus === 'Absent') {
        showToast(`Cannot evaluate ${member.name}: Participant is marked Absent.`, 'error');
        return;
    }

    currentEvaluationContext = {
        sessionId: sessionId,
        associateId: associateId,
        programId: program.id,
        answers: {},
        kirkpatrickFeedback: {
            trainerRating: 5,
            relevanceRating: 5,
            comments: 'Clear practical scenario training.'
        }
    };

    const modalTitle = document.getElementById('eval-modal-title');
    const modalSubtitle = document.getElementById('eval-modal-subtitle');
    const questionsContainer = document.getElementById('eval-modal-questions-container');

    if (modalTitle) modalTitle.textContent = `Post-Training Evaluation Form: ${program.title}`;
    if (modalSubtitle) modalSubtitle.textContent = `Associate: ${member.name} (${member.role}) · Trainer: ${session.trainerName}`;

    if (questionsContainer) {
        let questionsList = program.quizQuestions || program.quiz_questions || [];
        if (typeof questionsList === 'string') {
            try { questionsList = JSON.parse(questionsList); } catch (e) { questionsList = []; }
        }

        questionsContainer.innerHTML = questionsList.map((q, qIndex) => {
            const questionText = q.q || q.question || `Question ${qIndex + 1}`;
            const options = Array.isArray(q.options) ? q.options : [];

            return `
                <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-3 text-xs">
                    <p class="font-bold text-slate-900 leading-snug"><span class="text-primary font-bold">Q${qIndex + 1}:</span> ${questionText}</p>
                    <div class="space-y-2">
                        ${options.map((opt, optIndex) => `
                            <label class="flex items-center space-x-2.5 p-2 rounded-xl border border-transparent hover:bg-white hover:border-[#E8DEDC] cursor-pointer transition">
                                <input type="radio" name="eval_q_${qIndex}" value="${optIndex}" onchange="recordEvalAnswer(${qIndex}, ${optIndex})" class="text-primary focus:ring-primary h-4 w-4">
                                <span class="text-slate-700 font-medium">${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    openModal('modal-training-evaluation');
}

function recordEvalAnswer(qIndex, optIndex) {
    currentEvaluationContext.answers[qIndex] = optIndex;
}

function setKirkpatrickRating(type, stars) {
    if (type === 'trainer') {
        currentEvaluationContext.kirkpatrickFeedback.trainerRating = stars;
    } else {
        currentEvaluationContext.kirkpatrickFeedback.relevanceRating = stars;
    }

    const containerId = type === 'trainer' ? 'star-trainer-rating' : 'star-relevance-rating';
    const container = document.getElementById(containerId);
    if (container) {
        const buttons = container.querySelectorAll('button');
        buttons.forEach((btn, i) => {
            if (i < stars) {
                btn.classList.add('text-amber-400');
                btn.classList.remove('text-slate-300');
            } else {
                btn.classList.remove('text-amber-400');
                btn.classList.add('text-slate-300');
            }
        });
    }
}

async function submitTrainingEvaluation() {
    const { sessionId, associateId, programId, answers, kirkpatrickFeedback } = currentEvaluationContext;
    const session = trainingSessionsState.find(s => s.id === sessionId);
    const member = session?.roster.find(r => r.associateId === associateId);
    const program = trainingProgramsState.find(p => p.id === programId);

    if (!session || !member || !program) {
        showToast('Evaluation submission error: Session or Associate context missing', 'error');
        return;
    }

    closeModal('modal-training-evaluation');

    try {
        const payload = {
            sessionId: sessionId,
            programId: programId,
            associateId: associateId,
            answers: answers,
            kirkpatrickFeedback: kirkpatrickFeedback
        };

        const res = await TrainingAPI.submitEvaluation(payload);
        const resData = res?.data || res;

        if (resData && (resData.evaluation || resData.id)) {
            const evalRecord = resData.evaluation || resData;
            trainingResultsState.unshift(normalizeTrainingResult(evalRecord));

            member.evaluationStatus = 'Completed';
            member.attendanceStatus = 'Completed';
            member.score = evalRecord.quizScore;
            member.resultId = evalRecord.id;

            if (resData.isPassed || evalRecord.resultStatus?.includes('Passed')) {
                feedResultsIntoCompetency(evalRecord);
                showToast(`Evaluation Passed (${evalRecord.quizScore}%)! Cert: ${resData.certificateNumber || evalRecord.certificateReference} generated & +150 XP awarded!`, 'success');
                switchTrainingStage('results');
            } else {
                showToast(`Evaluation Score: ${evalRecord.quizScore}% (Threshold: ${evalRecord.passingThreshold || 80}%). Remedial required.`, 'warning');
                switchTrainingStage('results');
            }
        } else if (res && !res.success) {
            showToast('Evaluation submission failed: ' + (res.message || 'Unknown error'), 'error');
        }
    } catch (err) {
        showToast('Failed to submit evaluation to server: ' + err.message, 'error');
    }

    renderAttendanceConsole();
    renderTrainingSessions();
    renderTrainingResults();
    renderCertsTable();
    renderBasicTrainingReport();
    updateTrainingStats();
}

function feedResultsIntoCompetency(result) {
    const matchingNeed = trainingNeedsState.find(n =>
        (n.associateName && result.associateName && n.associateName.includes(result.associateName)) ||
        (n.employeeId && result.associateId && n.employeeId === result.associateId) ||
        (n.targetCompetency && result.competencyTarget && n.targetCompetency === result.competencyTarget)
    );
    if (matchingNeed) {
        matchingNeed.status = 'Resolved';
        matchingNeed.currentScore = result.competencyScoreAfter || 4.8;
        matchingNeed.gap = 0;
    }

    if (typeof currentXP !== 'undefined' && result.xpAwarded) {
        currentXP += result.xpAwarded;
        const xpEl = document.getElementById('user-xp-display');
        if (xpEl) xpEl.textContent = `${currentXP} XP`;
    }

    if (window.chartCompetencyRadarInstance) {
        const labels = window.chartCompetencyRadarInstance.data.labels;
        const deEscIdx = labels.findIndex(l => l.toLowerCase().includes('de-escalation') || l.toLowerCase().includes('conflict'));
        if (deEscIdx !== -1) {
            window.chartCompetencyRadarInstance.data.datasets[0].data[deEscIdx] = result.competencyScoreAfter;
            window.chartCompetencyRadarInstance.update();
        }
    }

    const mariaRow = document.querySelector('#sub-comp-matrix tbody tr');
    if (mariaRow) {
        const scoreCells = mariaRow.querySelectorAll('td');
        if (scoreCells.length >= 5) {
            scoreCells[4].innerHTML = `<span class="badge-sage font-bold">4.8</span>`;
            scoreCells[5].innerHTML = `<span class="text-primary font-bold">4.9</span>`;
        }
    }

    const idpContainer = document.getElementById('idp-tasks-container');
    if (idpContainer) {
        idpContainer.innerHTML = `
            <div class="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/50 space-y-2 text-xs">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-slate-900">Goal: Master Front Desk Shift Escalations</span>
                    <span class="badge-sage"><i class="fas fa-check-circle mr-1"></i> 100% Completed</span>
                </div>
                <p class="text-slate-600">Certified via: <strong>${result.programTitle}</strong> (${result.completionDate}) · Score: <strong>${result.quizScore}%</strong></p>
                <div class="w-full bg-white h-2 rounded-full overflow-hidden border border-emerald-200">
                    <div class="bg-emerald-600 h-2 rounded-full" style="width: 100%"></div>
                </div>
            </div>
        `;
    }

    renderTrainingNeeds();
}

let resultsActiveDeptFilter = 'all';

function setResultsDeptFilter(dept) {
    resultsActiveDeptFilter = dept;
    document.querySelectorAll('.results-dept-chip').forEach(btn => {
        if (btn.dataset.dept === dept) {
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('bg-[#FAF8F7]', 'text-slate-600');
        } else {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-[#FAF8F7]', 'text-slate-600');
        }
    });
    renderTrainingResults();
}
window.setResultsDeptFilter = setResultsDeptFilter;

function renderTrainingResults() {
    const tbody = document.getElementById('training-results-tbody');
    if (!tbody) return;

    const isAssociate = (window.activePersonaRole === 'Associate' || window.activePersonaKey === 'associate' || window.activePersonaKey === 'employee');
    const isSupervisor = (window.activePersonaRole === 'Supervisor' || window.activePersonaRole === 'DeptHead' || window.activePersonaKey === 'manager' || window.activePersonaKey === 'supervisor' || window.activePersonaKey === 'depthead');
    const currentEmpId = window.currentUser?.id;
    const currentUserDept = window.currentUser?.department || window.currentUser?.dept;

    // Use full property evaluations pool if available
    const pool = (Array.isArray(window.propertyResultsState) && window.propertyResultsState.length > 0)
        ? window.propertyResultsState
        : trainingResultsState;

    // Helper to get employee's actual department from employee roster
    const getEmpDept = (empId) => {
        if (!empId || !Array.isArray(trainingEmployeesState)) return null;
        const e = trainingEmployeesState.find(x => String(x.id).toLowerCase() === String(empId).toLowerCase());
        return e ? (e.department || e.dept) : null;
    };

    let resultsToRender = pool;
    if (isAssociate && currentEmpId) {
        resultsToRender = pool.filter(r => r.associateId === currentEmpId || (window.currentUser?.name && String(r.associateName).toLowerCase().includes(String(window.currentUser.name).toLowerCase())));
    } else if (isSupervisor) {
        if (resultsActiveDeptFilter === 'my-dept' && currentUserDept) {
            resultsToRender = pool.filter(r => matchesDepartment(r.dept, currentUserDept) || matchesDepartment(getEmpDept(r.associateId), currentUserDept));
        } else if (resultsActiveDeptFilter !== 'all') {
            resultsToRender = pool.filter(r => matchesDepartment(r.dept, resultsActiveDeptFilter) || matchesDepartment(getEmpDept(r.associateId), resultsActiveDeptFilter));
        }
    }

    // Role-dependent filter bar visibility
    const filterBar = document.getElementById('training-results-filter-bar');
    if (filterBar) {
        if (isAssociate) {
            filterBar.classList.add('hidden');
        } else {
            filterBar.classList.remove('hidden');
        }
    }

    // Update count badge
    const countBadge = document.getElementById('results-count-badge');
    if (countBadge) {
        if (isAssociate) {
            countBadge.textContent = `${resultsToRender.length} Recorded Exam${resultsToRender.length === 1 ? '' : 's'}`;
        } else if (resultsActiveDeptFilter === 'all') {
            countBadge.textContent = `Showing All Hotel Results (${resultsToRender.length})`;
        } else if (resultsActiveDeptFilter === 'my-dept') {
            countBadge.textContent = `My Dept: ${currentUserDept || 'General'} (${resultsToRender.length})`;
        } else {
            countBadge.textContent = `${resultsActiveDeptFilter.toUpperCase()} (${resultsToRender.length})`;
        }
    }

    if (resultsToRender.length === 0) {
        const hasOtherResults = pool.length > 0;
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-5 py-8 text-center text-slate-400 text-xs italic">
                    <div class="flex flex-col items-center justify-center space-y-2">
                        <i class="fas fa-clipboard-list text-2xl text-slate-300"></i>
                        <span>${isAssociate ? 'No evaluation results or certifications recorded for your account yet.' : 'No recorded training evaluation results found for this department filter.'}</span>
                        ${(!isAssociate && hasOtherResults) ? `
                            <button type="button" onclick="setResultsDeptFilter('all')" class="mt-2 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary/90 transition inline-flex items-center space-x-1.5">
                                <i class="fas fa-hotel mr-1 text-amber-300"></i>
                                <span>View All Hotel Evaluation Results (${pool.length} Total)</span>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = resultsToRender.map(res => {
        const isPassed = String(res.resultStatus || '').includes('Passed');
        const empDept = getEmpDept(res.associateId) || res.dept;

        return `
            <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
                <td class="px-5 py-3.5">
                    <div class="flex items-center space-x-3">
                        <img src="${res.associateAvatar}" alt="${res.associateName}" class="w-8 h-8 rounded-full object-cover border border-[#E8DEDC]">
                        <div>
                            <span class="font-bold text-slate-900 block">${res.associateName}</span>
                            <span class="text-[11px] text-slate-500">${res.associateRole} · <span class="font-semibold text-slate-700">${empDept}</span></span>
                        </div>
                    </div>
                </td>
                <td class="px-5 py-3.5">
                    <span class="font-bold text-slate-800 block">${res.programTitle}</span>
                    <span class="text-[10px] text-slate-400 font-medium">${res.category || 'Hospitality Curriculum'} · ${res.dept}</span>
                </td>
                <td class="px-5 py-3.5 text-slate-600 font-medium">${res.completionDate}</td>
                <td class="px-5 py-3.5">
                    <div class="flex items-baseline space-x-1">
                        <span class="font-extrabold text-sm ${isPassed ? 'text-emerald-700' : 'text-slate-700'}">${res.quizScore}%</span>
                        <span class="text-[10px] text-slate-400 font-medium">/ 100</span>
                    </div>
                    <span class="text-[10px] text-slate-400">Passing: ${res.passingThreshold || 80}%</span>
                </td>
                <td class="px-5 py-3.5">
                    <span class="${isPassed ? 'badge-sage' : 'badge-terracotta'} font-bold inline-flex items-center space-x-1">
                        <i class="fas ${isPassed ? 'fa-check-circle' : 'fa-xmark'} text-[10px]"></i>
                        <span>${res.resultStatus}</span>
                    </span>
                </td>
                <td class="px-5 py-3.5">
                    <span class="font-mono text-[11px] font-bold text-slate-700 bg-[#FAF8F7] px-2 py-0.5 rounded border border-[#E8DEDC]">${res.certificateReference || 'N/A'}</span>
                </td>
                <td class="px-5 py-3.5 text-right">
                    <div class="flex items-center justify-end space-x-1.5">
                        <button type="button" onclick="viewExamDetails('${res.id}')" class="btn-secondary px-2.5 py-1 text-[11px] font-bold inline-flex items-center space-x-1 shadow-2xs" title="View Exam & Kirkpatrick Breakdown">
                            <i class="fas fa-file-lines text-indigo-600"></i>
                            <span>Exam Details</span>
                        </button>
                        ${isPassed && res.certificateReference ? `
                            <button type="button" onclick="viewTrainingCertificate('${res.id}')" class="btn-primary px-2.5 py-1 text-[11px] font-bold inline-flex items-center space-x-1 shadow-2xs" title="View Digital Certificate">
                                <i class="fas fa-certificate text-amber-300"></i>
                                <span>Cert</span>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function viewExamDetails(resultId) {
    const pool = (Array.isArray(window.propertyResultsState) && window.propertyResultsState.length > 0)
        ? window.propertyResultsState
        : trainingResultsState;
    const result = pool.find(r => r.id === resultId) || trainingResultsState.find(r => r.id === resultId) || pool[0];
    if (!result) return;

    const elName = document.getElementById('exam-detail-associate-name');
    const elAvatar = document.getElementById('exam-detail-avatar');
    const elRole = document.getElementById('exam-detail-associate-role');
    const elDept = document.getElementById('exam-detail-dept');
    const elDate = document.getElementById('exam-detail-completion-date');
    const elTrainer = document.getElementById('exam-detail-trainer');
    const elProg = document.getElementById('exam-detail-program-title');
    const elCat = document.getElementById('exam-detail-category');
    const elScore = document.getElementById('exam-detail-score');
    const elThreshold = document.getElementById('exam-detail-threshold');
    const elAttendance = document.getElementById('exam-detail-attendance');
    const elStatusBadge = document.getElementById('exam-detail-status-badge');
    const elRating = document.getElementById('exam-detail-rating');
    const elNotes = document.getElementById('exam-detail-notes');
    const elCompTarget = document.getElementById('exam-detail-comp-target');
    const elCompScores = document.getElementById('exam-detail-comp-scores');
    const elXp = document.getElementById('exam-detail-xp');
    const elCertRef = document.getElementById('exam-detail-cert-ref');
    const btnOpenCert = document.getElementById('btn-exam-detail-open-cert');

    if (elName) elName.textContent = result.associateName;
    if (elAvatar) elAvatar.src = result.associateAvatar;
    if (elRole) elRole.textContent = result.associateRole;
    if (elDept) elDept.textContent = result.dept;
    if (elDate) elDate.textContent = result.completionDate || 'Sep 10, 2026';
    if (elTrainer) elTrainer.textContent = `Trainer: ${result.trainerName || 'Elena Vance'}`;
    if (elProg) elProg.textContent = result.programTitle;
    if (elCat) elCat.textContent = result.category || 'Skill Gap Deficit';
    if (elScore) elScore.textContent = `${result.quizScore}%`;
    if (elThreshold) elThreshold.textContent = `${result.passingThreshold || 80}%`;
    if (elAttendance) elAttendance.textContent = `${result.attendanceRate || '100%'} (Attended)`;
    if (elRating) elRating.textContent = Number(result.feedbackRating || 5.0).toFixed(1);
    if (elNotes) elNotes.textContent = result.feedbackNotes ? `"${result.feedbackNotes}"` : '"Outstanding practical simulation and crisis de-escalation."';
    if (elCompTarget) elCompTarget.textContent = result.competencyTarget || 'Frontline Conflict De-escalation';
    if (elCompScores) elCompScores.textContent = `${Number(result.competencyScoreBefore || 3.0).toFixed(2)} \u2192 ${Number(result.competencyScoreAfter || 4.8).toFixed(2)} Master Level`;
    if (elXp) elXp.textContent = `+${result.xpAwarded || 150} XP Awarded`;
    if (elCertRef) elCertRef.textContent = result.certificateReference || 'OXF-CERT-2026-9508';

    const isPassed = String(result.resultStatus || '').includes('Passed');
    if (elStatusBadge) {
        elStatusBadge.textContent = result.resultStatus || 'Passed & Certified';
        elStatusBadge.className = isPassed ? 'badge-sage font-bold' : 'badge-terracotta font-bold';
    }

    if (btnOpenCert) {
        if (result.certificateReference) {
            btnOpenCert.classList.remove('hidden');
            btnOpenCert.onclick = () => {
                closeModal('modal-training-exam-details');
                viewTrainingCertificate(result.id);
            };
        } else {
            btnOpenCert.classList.add('hidden');
        }
    }

    openModal('modal-training-exam-details');
}
window.viewExamDetails = viewExamDetails;

function renderCertsTable() {
    const tbody = document.getElementById('certs-table-body');
    if (!tbody) return;

    const certifiedResults = getAggregatedCertificates();

    if (certifiedResults.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-5 py-8 text-center text-slate-400 text-xs italic">
                    <div class="flex flex-col items-center justify-center space-y-2">
                        <i class="fas fa-certificate text-2xl text-slate-300"></i>
                        <span>No digital certificates issued yet. Pass a post-training evaluation quiz to generate verified licenses.</span>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = certifiedResults.map(r => `
        <tr class="hover:bg-[#FAF8F7]/70 transition text-xs">
            <td class="px-5 py-3.5">
                <div class="font-bold text-slate-900">${r.programTitle}</div>
                <div class="text-[11px] text-slate-500">Recipient: <strong>${r.associateName}</strong> (${r.associateRole})</div>
            </td>
            <td class="px-5 py-3.5 text-slate-600">Oxford Hospitality Board &amp; Statutory Dept</td>
            <td class="px-5 py-3.5 font-mono text-[11px] font-bold text-primary">${r.certificateReference}</td>
            <td class="px-5 py-3.5"><span class="badge-sage">Active License</span></td>
            <td class="px-5 py-3.5 text-right">
                <button onclick="viewTrainingCertificate('${r.id}')" class="text-primary font-bold hover:underline inline-flex items-center space-x-1">
                    <i class="fas fa-file-pdf mr-1"></i>
                    <span>Digital Cert</span>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewTrainingCertificate(resultId) {
    const allCerts = getAggregatedCertificates();
    const result = allCerts.find(r => r.id === resultId) || trainingResultsState.find(r => r.id === resultId) || allCerts[0];
    if (!result) return;

    const elCertName = document.getElementById('cert-modal-associate-name');
    const elCertProgram = document.getElementById('cert-modal-program-title');
    const elCertId = document.getElementById('cert-modal-cert-id');
    const elCertDate = document.getElementById('cert-modal-date');
    const elCertTrainer = document.getElementById('cert-modal-trainer-name');
    const elCertScore = document.getElementById('cert-modal-score');

    if (elCertName) elCertName.textContent = result.associateName;
    if (elCertProgram) elCertProgram.textContent = result.programTitle;
    if (elCertId) elCertId.textContent = result.certificateReference || 'OXF-CERT-2026-0889';
    if (elCertDate) elCertDate.textContent = result.completionDate || 'Aug 29, 2026';
    if (elCertTrainer) elCertTrainer.textContent = result.trainerName || 'Lead Master Trainer';
    if (elCertScore) elCertScore.textContent = `Score: ${result.quizScore || 96}% (Mastery Level)`;

    openModal('modal-training-certificate');
}

function printTrainingCertificate() {
    window.print();
}

// =========================================================================
// 7. MODULE 5: BASIC TRAINING REPORT (Attendance + Completion by Program/Dept)
// =========================================================================

let reportActiveDeptFilter = 'all';

function setReportDeptFilter(dept) {
    reportActiveDeptFilter = dept;
    document.querySelectorAll('.report-dept-chip').forEach(btn => {
        if (btn.dataset.dept === dept) {
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('bg-[#FAF8F7]', 'text-slate-600');
        } else {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-[#FAF8F7]', 'text-slate-600');
        }
    });
    renderBasicTrainingReport();
}

function renderBasicTrainingReport() {
    const tbody = document.getElementById('report-program-tbody');
    const deptSummaryContainer = document.getElementById('report-dept-summary');
    if (!tbody || !deptSummaryContainer) return;

    const isSupervisor = (window.activePersonaRole === 'Supervisor' || window.activePersonaRole === 'DeptHead' || window.activePersonaKey === 'manager' || window.activePersonaKey === 'supervisor' || window.activePersonaKey === 'depthead');
    const currentUserDept = window.currentUser?.department || window.currentUser?.dept;

    if (isSupervisor && currentUserDept) {
        reportActiveDeptFilter = currentUserDept.toLowerCase();
    }

    // Collect all participants across sessions
    let allParticipants = [];
    trainingSessionsState.forEach(s => {
        s.roster.forEach(r => {
            allParticipants.push({
                ...r,
                programId: s.programId,
                sessionTitle: s.title,
                sessionDept: s.dept,
                sessionDate: s.date
            });
        });
    });

    if (isSupervisor && currentUserDept) {
        allParticipants = allParticipants.filter(p => matchesDepartment(p.dept || p.sessionDept, currentUserDept));
    }

    // Departments list
    const departments = ['Front Office', 'Culinary', 'F&B Service', 'Housekeeping'];

    // 1. Department Summary Cards
    deptSummaryContainer.innerHTML = departments.map(d => {
        const deptRoster = allParticipants.filter(p => p.dept === d || p.sessionDept === d);
        const totalEnrolled = deptRoster.length || 1; // prevent / 0
        const attendedCount = deptRoster.filter(p => p.attendanceStatus === 'Attended' || p.attendanceStatus === 'Completed').length;
        const completedCount = deptRoster.filter(p => p.attendanceStatus === 'Completed' || p.evaluationStatus === 'Completed').length;

        const attRate = Math.round((attendedCount / totalEnrolled) * 100);
        const compRate = Math.round((completedCount / totalEnrolled) * 100);

        return `
            <div class="card-clean p-4 border border-[#E8DEDC] space-y-2 bg-white">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900 text-xs">${d}</span>
                    <span class="text-[10px] font-bold text-slate-400">${deptRoster.length} Enrolled</span>
                </div>
                <div class="space-y-1 text-xs">
                    <div class="flex justify-between text-[11px]">
                        <span class="text-slate-500">Attendance Rate:</span>
                        <span class="font-bold text-sage-dark">${attRate}%</span>
                    </div>
                    <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]">
                        <div class="bg-sage h-1.5 rounded-full" style="width: ${attRate}%"></div>
                    </div>
                    <div class="flex justify-between text-[11px] pt-1">
                        <span class="text-slate-500">Completion Rate:</span>
                        <span class="font-bold text-primary">${compRate}%</span>
                    </div>
                    <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]">
                        <div class="bg-primary h-1.5 rounded-full" style="width: ${compRate}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // 2. Program Breakdown Table
    let filteredPrograms = trainingProgramsState;
    if (reportActiveDeptFilter !== 'all') {
        filteredPrograms = trainingProgramsState.filter(p => p.dept.toLowerCase().includes(reportActiveDeptFilter.toLowerCase()));
    }

    tbody.innerHTML = filteredPrograms.map(prog => {
        const progRoster = allParticipants.filter(p => p.programId === prog.id);
        const totalEnrolled = progRoster.length || 1;
        const attendedCount = progRoster.filter(p => p.attendanceStatus === 'Attended' || p.attendanceStatus === 'Completed').length;
        const completedCount = progRoster.filter(p => p.attendanceStatus === 'Completed' || p.evaluationStatus === 'Completed').length;

        const avgScoreResults = trainingResultsState.filter(r => r.programId === prog.id);
        const avgScore = avgScoreResults.length > 0
            ? Math.round(avgScoreResults.reduce((acc, r) => acc + r.quizScore, 0) / avgScoreResults.length)
            : 95;

        const attRate = Math.round((attendedCount / totalEnrolled) * 100);
        const compRate = Math.round((completedCount / totalEnrolled) * 100);

        return `
            <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
                <td class="px-5 py-3.5">
                    <span class="font-bold text-slate-900 block">${prog.title}</span>
                    <span class="text-[11px] text-slate-500">${prog.category}</span>
                </td>
                <td class="px-5 py-3.5 font-semibold text-slate-700">${prog.dept}</td>
                <td class="px-5 py-3.5 font-bold text-slate-800">${totalEnrolled} associates</td>
                <td class="px-5 py-3.5">
                    <div class="flex items-center space-x-2">
                        <span class="font-bold text-sage-dark">${attRate}%</span>
                        <div class="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-sage h-1.5" style="width: ${attRate}%"></div>
                        </div>
                    </div>
                </td>
                <td class="px-5 py-3.5">
                    <div class="flex items-center space-x-2">
                        <span class="font-bold text-primary">${compRate}%</span>
                        <div class="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-primary h-1.5" style="width: ${compRate}%"></div>
                        </div>
                    </div>
                </td>
                <td class="px-5 py-3.5 font-bold text-slate-900">${avgScore}%</td>
                <td class="px-5 py-3.5 text-right">
                    <span class="badge-sage">${compRate >= 80 ? 'Target Met' : 'In Progress'}</span>
                </td>
            </tr>
        `;
    }).join('');
}

// =========================================================================
// 8. MODAL HANDLERS
// =========================================================================

let currentSchedulingNeedId = null;

function findAnyTrainingNeed(needId) {
    if (!needId) return null;
    let found = trainingNeedsState.find(n => n.id === needId);
    if (!found && Array.isArray(window.propertyNeedsState)) {
        found = window.propertyNeedsState.find(n => n.id === needId);
    }
    return found || null;
}

function scheduleFromNeed(needId) {
    const raw = findAnyTrainingNeed(needId);
    if (!raw) {
        console.warn('[Training] Need not found for scheduling:', needId);
        showToast('Could not load details for this training need.', 'error');
        return;
    }
    const need = normalizeTrainingNeed(raw);

    const existingSession = trainingSessionsState.find(s =>
        (s.linkedNeedId === need.id || ((s.roster || []).some(r => (r.associateId === need.employeeId || (r.name && need.associateName && r.name.toLowerCase() === need.associateName.toLowerCase())) && (s.programId === need.linkedProgramId || s.title?.includes(need.targetCompetency))))) &&
        s.status !== 'Completed'
    );
    if (existingSession || need.status === 'Scheduled') {
        showToast(`A training cohort is already scheduled for ${need.associateName}. Duplicate scheduling is disabled.`, 'warning');
        switchTrainingStage('schedules');
        return;
    }

    currentSchedulingNeedId = need.id;
    openScheduleModal(need.linkedProgramId, need.id);
}

function updateScheduleModalRosterCount() {
    const checked = document.querySelectorAll('.sched-roster-checkbox:checked').length;
    const countEl = document.getElementById('sched-modal-roster-count');
    if (countEl) {
        countEl.textContent = `${checked} Selected`;
    }
}

function openScheduleModal(preselectedProgramId = null, preselectedNeedId = null) {
    currentSchedulingNeedId = preselectedNeedId || currentSchedulingNeedId;

    // 1. Populate Programs Dropdown
    const progSelect = document.getElementById('sched-modal-program-select');
    if (progSelect) {
        progSelect.innerHTML = trainingProgramsState.map(p => `
            <option value="${p.id}" ${p.id === preselectedProgramId ? 'selected' : ''}>${p.title} (${p.category})</option>
        `).join('');
    }

    // 2. Populate Dynamic Participant Roster (Derived from Active Need Gaps & Real DB Employees)
    const rosterContainer = document.getElementById('sched-modal-roster-container');
    if (rosterContainer) {
        const candidateMap = new Map();

        // A. Add associates with active training need deficits (from department queue AND property-wide queue)
        const allNeedsPool = [
            ...trainingNeedsState,
            ...(Array.isArray(window.propertyNeedsState) ? window.propertyNeedsState : [])
        ];

        allNeedsPool.forEach(raw => {
            const n = normalizeTrainingNeed(raw);
            const key = n.associateName;
            if (key && !candidateMap.has(key)) {
                candidateMap.set(key, {
                    associateId: n.employeeId || n.associateId || ('emp-' + key.replace(/\s+/g, '').toLowerCase()),
                    name: n.associateName,
                    role: n.associateRole || 'Hotel Staff',
                    dept: n.dept || 'General',
                    avatar: n.associateAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(n.associateName)}&background=8E4A49&color=fff`,
                    isNeedTrigger: true,
                    needTitle: n.title,
                    gap: n.gap,
                    needId: n.id,
                    isChecked: (preselectedNeedId && n.id === preselectedNeedId) || (preselectedProgramId && n.linkedProgramId === preselectedProgramId)
                });
            }
        });

        // B. Add all active employees directly from the database employees table
        const dbEmployees = (trainingEmployeesState && trainingEmployeesState.length > 0)
            ? trainingEmployeesState
            : (window.trainingEmployeesState || window.allEmployeesList || []);

        dbEmployees.forEach(emp => {
            const empName = emp.full_name || emp.name;
            const empId = emp.id;
            if (!empName) return;

            // Don't duplicate if already listed from need deficits
            const exists = candidateMap.has(empName) || 
                           Array.from(candidateMap.values()).some(c => c.associateId === empId);

            if (!exists) {
                candidateMap.set(empName, {
                    associateId: empId,
                    name: empName,
                    role: emp.title || emp.role || 'Hotel Staff',
                    dept: emp.department || emp.dept || 'General',
                    avatar: emp.avatar_url || emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(empName)}&background=8E4A49&color=fff`,
                    isNeedTrigger: false,
                    isChecked: false
                });
            }
        });

        // If preselectedNeedId exists, ensure that specific associate is checked
        if (preselectedNeedId) {
            const targetNeed = allNeedsPool.find(n => n.id === preselectedNeedId);
            if (targetNeed) {
                const targetKey = targetNeed.associate_name || targetNeed.associateName;
                const targetEntry = candidateMap.get(targetKey);
                if (targetEntry) targetEntry.isChecked = true;
            }
        }

        // If nothing is checked yet, check the first candidate
        const candidates = Array.from(candidateMap.values());
        if (!candidates.some(c => c.isChecked) && candidates.length > 0) {
            candidates[0].isChecked = true;
        }

        rosterContainer.innerHTML = candidates.map(c => `
            <label class="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8DEDC] hover:bg-slate-50 cursor-pointer transition">
                <div class="flex items-center space-x-2.5">
                    <input type="checkbox" class="sched-roster-checkbox rounded text-primary focus:ring-primary h-4 w-4" 
                        value="${c.associateId}" 
                        data-name="${c.name}" 
                        data-role="${c.role}" 
                        data-dept="${c.dept}" 
                        data-avatar="${c.avatar}" 
                        ${c.isChecked ? 'checked' : ''} 
                        onchange="updateScheduleModalRosterCount()">
                    <img src="${c.avatar}" alt="${c.name}" class="w-7 h-7 rounded-full object-cover border border-[#E8DEDC]">
                    <div>
                        <div class="font-bold text-xs text-slate-900">${c.name}</div>
                        <div class="text-[10px] text-slate-500">${c.role} · <strong class="text-slate-700">${c.dept}</strong></div>
                    </div>
                </div>
                <div>
                    ${c.isNeedTrigger ? `
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            ${c.gap ? c.gap + ' Gap' : 'Active Need'}
                        </span>
                    ` : `
                        <span class="text-[10px] text-slate-400 font-medium">Department Peer</span>
                    `}
                </div>
            </label>
        `).join('');

        updateScheduleModalRosterCount();
    }

    openModal('modal-schedule-training-session');
}

async function saveScheduledSession() {
    const progId = document.getElementById('sched-modal-program-select')?.value;
    const trainerName = document.getElementById('sched-modal-trainer')?.value || 'Master Sommelier Pierre';
    const location = document.getElementById('sched-modal-venue')?.value || 'Executive Boardroom';
    const date = document.getElementById('sched-modal-date')?.value || 'Aug 30, 2026';
    const time = document.getElementById('sched-modal-time')?.value || '14:00 - 17:00';

    const prog = trainingProgramsState.find(p => p.id === progId) || trainingProgramsState[0];

    // Collect dynamically checked participants from the modal checkboxes
    const checkedBoxes = Array.from(document.querySelectorAll('.sched-roster-checkbox:checked'));
    const selectedRoster = checkedBoxes.map(cb => ({
        associateId: cb.value,
        name: cb.dataset.name,
        role: cb.dataset.role,
        dept: cb.dataset.dept,
        avatar: cb.dataset.avatar,
        attendanceStatus: 'Attended',
        attendanceRate: 100,
        checkInTime: '13:50',
        evaluationStatus: 'Pending',
        score: null,
        resultId: null
    }));

    // Fallback if none checked
    if (selectedRoster.length === 0) {
        selectedRoster.push({
            associateId: 'emp-101',
            name: 'Maria Santos',
            role: 'Front Desk Host',
            dept: 'Front Office',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            attendanceStatus: 'Attended',
            attendanceRate: 100,
            checkInTime: '13:50',
            evaluationStatus: 'Pending',
            score: null,
            resultId: null
        });
    }

    const newSession = {
        id: `sess-${Date.now()}`,
        programId: prog.id,
        title: `${prog.title} - Cohort ${String.fromCharCode(65 + (trainingSessionsState.length % 26))}`,
        dept: prog.dept,
        trainerName: trainerName,
        trainerTitle: 'Assigned Senior Trainer',
        trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        location: location,
        date: date,
        time: time,
        status: 'Scheduled',
        roster: selectedRoster
    };

    trainingSessionsState.unshift(normalizeTrainingSession(newSession));
    closeModal('modal-schedule-training-session');

    renderTrainingSessions();
    renderAttendanceConsole();
    renderBasicTrainingReport();
    updateTrainingStats();
    showToast(`Training session "${newSession.title}" scheduled with ${selectedRoster.length} participants!`, 'success');
    switchTrainingStage('schedules');

    // Async persist to Supabase backend
    try {
        const res = await TrainingAPI.scheduleSession(newSession);
        if (res && res.data) {
            const savedSess = normalizeTrainingSession(res.data);
            const idx = trainingSessionsState.findIndex(s => s.id === newSession.id || s.id === savedSess.id);
            if (idx !== -1) {
                trainingSessionsState[idx] = savedSess;
                renderTrainingSessions();
                renderAttendanceConsole();
            }
        }

        // If scheduled from a specific Need, update that need's status to Scheduled
        if (currentSchedulingNeedId) {
            const need = findAnyTrainingNeed(currentSchedulingNeedId);
            if (need) {
                need.status = 'Scheduled';
            }
            const inProp = (window.propertyNeedsState || []).find(n => n.id === currentSchedulingNeedId);
            if (inProp) inProp.status = 'Scheduled';
            const inState = trainingNeedsState.find(n => n.id === currentSchedulingNeedId);
            if (inState) inState.status = 'Scheduled';
            renderTrainingNeeds();
            currentSchedulingNeedId = null;
        }
    } catch (err) {
        console.warn('Could not persist session to backend:', err);
    }
}

function openCreateProgramModal() {
    openModal('modal-create-training-program');
}

async function saveNewTrainingProgram() {
    const title = document.getElementById('prog-modal-title-input')?.value || 'Hospitality Advanced Service Standard';
    const category = document.getElementById('prog-modal-category')?.value || 'Skill Gap';
    const dept = document.getElementById('prog-modal-dept')?.value || 'Front Office';
    const targetComp = document.getElementById('prog-modal-comp')?.value || 'Guest Relations & VIP Protocol';
    const duration = document.getElementById('prog-modal-duration')?.value || '3.0 Hours';
    const desc = document.getElementById('prog-modal-desc')?.value || 'Comprehensive hotel training syllabus.';

    const newProg = {
        id: `prog-${Date.now()}`,
        title: title,
        category: category,
        dept: dept,
        targetCompetency: targetComp,
        competencyKey: 'guest_relations',
        duration: duration,
        format: 'Workshop & Assessment',
        trainerType: 'Internal Master Trainer',
        passingScore: 80,
        xpAward: 150,
        icon: 'fa-award',
        badgeColor: 'primary',
        description: desc,
        modules: [
            '1. Standard Operating Procedures Overview',
            '2. Practical Hospitality Delivery',
            '3. Scenario Roleplay & Simulation',
            '4. Post-Training Evaluation Quiz'
        ],
        quizQuestions: [
            {
                q: 'What is the benchmark standard response time for VIP guest requests?',
                options: ['Within 5 minutes', 'Within 30 minutes', 'By end of shift', 'Next morning'],
                correct: 0
            },
            {
                q: 'Which protocol must be followed when a guest escalates a service delay?',
                options: ['Listen and execute immediate service recovery voucher', 'Escalate immediately to GM without apology', 'Ask guest to wait in the lounge', 'Ignore the delay'],
                correct: 0
            }
        ]
    };

    trainingProgramsState.unshift(newProg);
    closeModal('modal-create-training-program');

    renderTrainingPrograms();
    renderBasicTrainingReport();
    updateTrainingStats();
    showToast(`Training Program "${title}" created!`, 'success');
    switchTrainingStage('programs');

    // Async persist to backend
    try {
        await TrainingAPI.createProgram(newProg);
    } catch (err) {
        console.warn('Could not persist program to backend:', err);
    }
}

// ----------------------------------------------------
// Supervisor Manual Training Program Assignment
// ----------------------------------------------------
function openAssignProgramModal(needId) {
    const raw = findAnyTrainingNeed(needId);
    if (!raw) {
        console.warn('[Training] Need not found:', needId);
        showToast('Could not load details for this training deficit.', 'error');
        return;
    }
    const need = normalizeTrainingNeed(raw);

    const existingSession = trainingSessionsState.find(s =>
        (s.linkedNeedId === need.id || ((s.roster || []).some(r => (r.associateId === need.employeeId || (r.name && need.associateName && r.name.toLowerCase() === need.associateName.toLowerCase())) && (s.programId === need.linkedProgramId || s.title?.includes(need.targetCompetency))))) &&
        s.status !== 'Completed'
    );
    if (existingSession || need.status === 'Scheduled') {
        showToast(`Training session is already scheduled for ${need.associateName}. Reassignment is locked to prevent duplication.`, 'warning');
        return;
    }

    let modal = document.getElementById('modal-assign-training-program');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-assign-training-program';
        modal.className = 'fixed inset-0 modal-overlay z-[999] hidden items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs';
        document.body.appendChild(modal);
    }

    const availablePrograms = trainingProgramsState || [];
    const programOptions = availablePrograms.length > 0 ? availablePrograms.map(p => `
        <label class="flex items-start p-3.5 rounded-xl border border-[#E8DEDC] bg-white hover:bg-slate-50 cursor-pointer transition space-x-3 group">
            <input type="radio" name="assign_program_radio" value="${p.id}" class="mt-1 text-primary focus:ring-primary h-4 w-4 cursor-pointer" ${p.id === need.linkedProgramId ? 'checked' : ''}>
            <div class="flex-1 space-y-1">
                <div class="flex items-center justify-between">
                    <h5 class="font-bold text-xs text-slate-900 group-hover:text-primary transition">${p.title}</h5>
                    <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">${p.category} · ${p.dept}</span>
                </div>
                <p class="text-[11px] text-slate-500 leading-relaxed">${p.description || 'Structured hospitality training syllabus.'}</p>
                <div class="flex items-center space-x-3 text-[10px] text-slate-400 pt-0.5">
                    <span><i class="fas fa-clock mr-1"></i>${p.duration}</span>
                    <span><i class="fas fa-award text-amber-500 mr-1"></i>Passing Threshold: &ge; ${p.passingScore || 80}%</span>
                </div>
            </div>
        </label>
    `).join('') : `
        <div class="p-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No training programs created yet. You can create a new program from the Programs Catalog tab.
        </div>
    `;

    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scaleUp max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div>
                        <h3 class="font-heading font-bold text-base text-slate-900">Assign Training Program</h3>
                        <p class="text-xs text-slate-500">Associate: <strong class="text-slate-800">${need.associateName}</strong> (${need.associateRole} · ${need.dept})</p>
                    </div>
                </div>
                <button onclick="closeModal('modal-assign-training-program')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>

            <!-- Associate Diagnosis Overview -->
            <div class="p-3.5 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-2 text-xs">
                <div class="flex justify-between items-center text-[11px] border-b border-slate-200 pb-1.5">
                    <span class="text-slate-500 font-semibold">Assessed Overall Proficiency:</span>
                    <span class="font-black text-rose-600">${need.currentScore} / 5.0 <span class="text-slate-400 font-normal">(Target: ${need.requiredScore})</span></span>
                </div>
                ${formatDiagnosisNotesHtml(need.notes)}
            </div>

            <!-- Program Selection List -->
            <div class="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1">
                <span class="text-slate-500 text-xs font-bold block uppercase tracking-wider text-[10px]">Select Approved Training Curriculum:</span>
                <div class="space-y-2" id="assign-program-options-list">
                    ${programOptions}
                </div>
            </div>

            <!-- Footer Actions -->
            <div class="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button type="button" onclick="closeModal('modal-assign-training-program')" class="btn-secondary px-4 py-2 text-xs font-bold">
                    Cancel
                </button>
                <button type="button" onclick="submitAssignProgram('${need.id}')" class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                    <i class="fas fa-check-circle"></i>
                    <span>Confirm Program Assignment</span>
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}
window.openAssignProgramModal = openAssignProgramModal;

async function submitAssignProgram(needId) {
    const selectedRadio = document.querySelector('input[name="assign_program_radio"]:checked');
    if (!selectedRadio) {
        showToast('Please select a training program to assign.', 'error');
        return;
    }

    const programId = selectedRadio.value;
    const need = findAnyTrainingNeed(needId);
    const prog = trainingProgramsState.find(p => p.id === programId);

    if (need) {
        need.linkedProgramId = programId;
        need.linked_program_id = programId;
        need.status = 'Program Linked';
    }

    const inProp = (window.propertyNeedsState || []).find(n => n.id === needId);
    if (inProp) {
        inProp.linkedProgramId = programId;
        inProp.linked_program_id = programId;
        inProp.status = 'Program Linked';
    }
    const inState = trainingNeedsState.find(n => n.id === needId);
    if (inState) {
        inState.linkedProgramId = programId;
        inState.linked_program_id = programId;
        inState.status = 'Program Linked';
    }

    closeModal('modal-assign-training-program');
    renderTrainingNeeds();
    updateTrainingStats();
    showToast(`Assigned "${prog ? prog.title : 'Program'}" to ${need ? need.associateName : 'Associate'}!`, 'success');

    // Async persist to backend Supabase
    try {
        await fetch('api/training.php?action=assign_program', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ needId: needId, programId: programId })
        });
    } catch (err) {
        console.warn('Could not persist program assignment to backend:', err);
    }
}
window.submitAssignProgram = submitAssignProgram;

document.addEventListener('DOMContentLoaded', () => {
    initTrainingManagement();
});
