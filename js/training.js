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

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Server request failed');
            }
            return result.data;
        } catch (error) {
            console.error(`[TrainingAPI Error] [${action}]:`, error);
            if (typeof window.showToast === 'function') {
                window.showToast(error.message || 'Server communication error', 'error');
            }
            throw error;
        }
    },

    bootstrap() { return this.request('bootstrap'); },
    getNeeds(filters = {}) { return this.request('get_needs', 'GET', filters); },
    createNeed(data) { return this.request('create_need', 'POST', data); },
    getPrograms(filters = {}) { return this.request('get_programs', 'GET', filters); },
    createProgram(data) { return this.request('create_program', 'POST', data); },
    getSessions(filters = {}) { return this.request('get_sessions', 'GET', filters); },
    scheduleSession(data) { return this.request('create_session', 'POST', data); },
    updateAttendance(sessionId, associateId, status, checkInTime = null) {
        return this.request('update_attendance', 'POST', {
            session_id: sessionId,
            employee_id: associateId,
            attendance_status: status,
            check_in_time: checkInTime
        });
    },
    submitEvaluation(payload) { return this.request('submit_evaluation', 'POST', payload); },
    getCertificates(filters = {}) { return this.request('get_certificates', 'GET', filters); },
    getReports(filters = {}) { return this.request('get_reports', 'GET', filters); }
};

// =========================================================================
// 1. STATE STORES
// =========================================================================

let trainingNeedsState = [];
let trainingProgramsState = [];
let trainingSessionsState = [];
let trainingResultsState = [];

let activeAttendanceSessionId = 'sess-101';
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
        const bootstrapData = await TrainingAPI.bootstrap();
        if (bootstrapData) {
            if (Array.isArray(bootstrapData.needs)) trainingNeedsState = bootstrapData.needs.map(normalizeTrainingNeed);
            if (Array.isArray(bootstrapData.programs)) trainingProgramsState = bootstrapData.programs.map(normalizeTrainingProgram);
            if (Array.isArray(bootstrapData.sessions)) trainingSessionsState = bootstrapData.sessions.map(normalizeTrainingSession);
            if (Array.isArray(bootstrapData.results)) trainingResultsState = bootstrapData.results.map(normalizeTrainingResult);

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

    // 3. Supabase Realtime Subscription for Competency Gaps
    if (window.supabase) {
        window.supabase
            .channel('public:competency_assessments')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'competency_assessments' 
            }, async (payload) => {
                console.log('Realtime Assessment Detected in Training Module:', payload);
                try {
                    showNeedsLoadingState();
                    const bootstrapData = await TrainingAPI.bootstrap();
                    if (bootstrapData && Array.isArray(bootstrapData.needs)) {
                        trainingNeedsState = bootstrapData.needs.map(normalizeTrainingNeed);
                        renderTrainingNeeds();
                        updateTrainingStats();
                        if (typeof window.showToast === 'function') {
                            window.showToast('New Training Need automatically detected from latest competency appraisal.', 'info');
                        }
                    }
                } catch (err) {
                    console.error("Failed to realtime sync training needs:", err);
                }
            })
            .subscribe();
    }
}

function switchTrainingStage(stageSubTab) {
    switchSubTab('training', stageSubTab);
}

function updateTrainingStats() {
    const identifiedCount = trainingNeedsState.filter(n => n.status !== 'Resolved' && n.status !== 'Completed').length;
    const programsCount = trainingProgramsState.length;
    const activeSessionsCount = trainingSessionsState.filter(s => s.status !== 'Completed').length;
    const certifiedCount = trainingResultsState.filter(r => (r.resultStatus || '').includes('Passed')).length;

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

    let allNormalized = trainingNeedsState.map(normalizeTrainingNeed);
    
    const isAssociate = (window.activePersonaRole === 'Associate' || window.activePersonaKey === 'associate' || window.activePersonaKey === 'employee');
    const currentEmpId = window.currentUser?.id;

    if (isAssociate && currentEmpId) {
        allNormalized = allNormalized.filter(n => n.employeeId === currentEmpId);
    }
    
    const perfItems = allNormalized.filter(n => n.isPerformanceGoal);

    let filteredNeeds = allNormalized;
    if (needsActiveFilterTab === 'active') {
        filteredNeeds = allNormalized.filter(n => n.status !== 'Resolved' && n.status !== 'Completed' && !n.isPerformanceGoal);
    } else if (needsActiveFilterTab === 'performance') {
        filteredNeeds = perfItems;
    } else if (needsActiveFilterTab === 'resolved') {
        filteredNeeds = allNormalized.filter(n => n.status === 'Resolved' || n.status === 'Completed');
    }

    if (filteredNeeds.length === 0) {
        const emptyMsg = needsActiveFilterTab === 'performance'
            ? 'No formal training needs linked to Performance Goal Evaluations / IDP yet.'
            : needsActiveFilterTab === 'resolved'
                ? 'No resolved training history recorded yet.'
                : 'No active skill gap deficits or compliance requirements pending in the queue.';

        container.innerHTML = `
            <div class="card-clean p-8 bg-white border border-[#E8DEDC] text-center space-y-3">
                <div class="w-12 h-12 rounded-full bg-[#FAF8F7] border border-[#E8DEDC] text-slate-400 flex items-center justify-center mx-auto">
                    <i class="fas fa-check-double text-lg text-emerald-600"></i>
                </div>
                <h4 class="font-bold text-slate-800 text-sm">${needsActiveFilterTab === 'performance' ? 'No Performance Goal Needs' : (needsActiveFilterTab === 'resolved' ? 'No Resolved Items' : 'All Associate Competencies at Benchmark')}</h4>
                <p class="text-slate-500 text-xs">${emptyMsg}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredNeeds.map(need => {
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
                    <button onclick="openScheduleModal('${prog.id}')" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                        <i class="fas fa-calendar-days"></i>
                        <span>Schedule Session &rarr;</span>
                    </button>
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

    container.innerHTML = trainingSessionsState.map(sess => {
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
                        ${isLive ? `
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
    const currentEmpId = window.currentUser?.id;

    let filteredSessions = trainingSessionsState;
    if (isAssociate && currentEmpId) {
        filteredSessions = trainingSessionsState.filter(s => s.roster && s.roster.some(r => r.associateId === currentEmpId));
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
                    <button onclick="startSessionEvaluation('${session.id}', '${member.associateId}')" 
                        class="btn-primary px-3 py-1.5 text-[11px] font-bold inline-flex items-center space-x-1 shadow-xs">
                        <i class="fas fa-pen-to-square"></i>
                        <span>${assocResult ? 'Retake Evaluation Quiz &rarr;' : 'Take Evaluation Quiz &rarr;'}</span>
                    </button>
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

function renderTrainingResults() {
    const tbody = document.getElementById('training-results-tbody');
    if (!tbody) return;

    tbody.innerHTML = trainingResultsState.map(res => {
        const isPassed = res.resultStatus.includes('Passed');

        return `
            <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
                <td class="px-5 py-3.5">
                    <div class="flex items-center space-x-3">
                        <img src="${res.associateAvatar}" alt="${res.associateName}" class="w-8 h-8 rounded-full object-cover border border-[#E8DEDC]">
                        <div>
                            <span class="font-bold text-slate-900 block">${res.associateName}</span>
                            <span class="text-[11px] text-slate-500">${res.associateRole} · ${res.dept}</span>
                        </div>
                    </div>
                </td>
                <td class="px-5 py-3.5 font-bold text-slate-800">${res.programTitle}</td>
                <td class="px-5 py-3.5 text-slate-600">${res.completionDate}</td>
                <td class="px-5 py-3.5 font-bold ${isPassed ? 'text-emerald-700' : 'text-slate-700'}">${res.quizScore}%</td>
                <td class="px-5 py-3.5">
                    <span class="${isPassed ? 'badge-sage' : 'badge-terracotta'} font-bold">${res.resultStatus}</span>
                </td>
                <td class="px-5 py-3.5">
                    <span class="font-mono text-[11px] font-bold text-slate-700">${res.certificateReference || 'N/A'}</span>
                </td>
                <td class="px-5 py-3.5 text-right">
                    ${isPassed && res.certificateReference ? `
                        <button onclick="viewTrainingCertificate('${res.id}')" class="btn-primary px-3 py-1 text-[11px] font-bold inline-flex items-center space-x-1">
                            <i class="fas fa-certificate"></i>
                            <span>View Cert</span>
                        </button>
                    ` : `
                        <span class="text-slate-400 text-[11px]">N/A</span>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

function renderCertsTable() {
    const tbody = document.getElementById('certs-table-body');
    if (!tbody) return;

    const certifiedResults = trainingResultsState.filter(r => r.certificateReference);

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
    const result = trainingResultsState.find(r => r.id === resultId) || trainingResultsState[0];
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
    if (elCertDate) elCertDate.textContent = result.completionDate;
    if (elCertTrainer) elCertTrainer.textContent = result.trainerName;
    if (elCertScore) elCertScore.textContent = `Score: ${result.quizScore}% (Mastery Level)`;

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

function scheduleFromNeed(needId) {
    const raw = trainingNeedsState.find(n => n.id === needId);
    if (!raw) return;
    const need = normalizeTrainingNeed(raw);

    const existingSession = trainingSessionsState.find(s =>
        (s.roster || []).some(r => r.associateId === need.employeeId || (r.name && need.associateName && r.name.toLowerCase() === need.associateName.toLowerCase())) &&
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

    // 2. Populate Dynamic Participant Roster (Derived from Active Need Gaps & Staff)
    const rosterContainer = document.getElementById('sched-modal-roster-container');
    if (rosterContainer) {
        // Collect candidate associates from Need Gaps
        const candidateMap = new Map();

        // Add from active training needs
        trainingNeedsState.forEach(raw => {
            const n = normalizeTrainingNeed(raw);
            const key = n.associateName;
            if (!candidateMap.has(key)) {
                candidateMap.set(key, {
                    associateId: n.employeeId || (n.associateName.includes('Maria') ? 'emp-101' : (n.associateName.includes('Carlos') ? 'emp-102' : (n.associateName.includes('David') ? 'emp-106' : 'emp-104'))),
                    name: n.associateName,
                    role: n.associateRole,
                    dept: n.dept,
                    avatar: n.associateAvatar,
                    isNeedTrigger: true,
                    needTitle: n.title,
                    gap: n.gap,
                    needId: n.id,
                    isChecked: (preselectedNeedId && n.id === preselectedNeedId) || (preselectedProgramId && n.linkedProgramId === preselectedProgramId)
                });
            }
        });

        // Add standard team peers if not already in map
        const defaultPeers = [
            { associateId: 'emp-101', name: 'Maria Santos', role: 'Front Desk Host', dept: 'Front Office', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
            { associateId: 'emp-102', name: 'Carlos Gomez', role: 'Concierge Lead', dept: 'Front Office', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
            { associateId: 'emp-103', name: 'Angela Reyes', role: 'Guest Relations Officer', dept: 'Front Office', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
            { associateId: 'emp-104', name: 'Chef Marco S.', role: 'Line Cook Lead', dept: 'Culinary', avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80' },
            { associateId: 'emp-106', name: 'David Lee', role: 'F&B Server Lead', dept: 'F&B Service', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
        ];

        defaultPeers.forEach(peer => {
            if (!candidateMap.has(peer.name)) {
                candidateMap.set(peer.name, {
                    ...peer,
                    isNeedTrigger: false,
                    isChecked: false
                });
            }
        });

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
            const need = trainingNeedsState.find(n => n.id === currentSchedulingNeedId);
            if (need) {
                need.status = 'Scheduled';
                renderTrainingNeeds();
            }
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
    const raw = trainingNeedsState.find(n => n.id === needId);
    if (!raw) return;
    const need = normalizeTrainingNeed(raw);

    const existingSession = trainingSessionsState.find(s =>
        (s.roster || []).some(r => r.associateId === need.employeeId || (r.name && need.associateName && r.name.toLowerCase() === need.associateName.toLowerCase())) &&
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

async function submitAssignProgram(needId) {
    const selectedRadio = document.querySelector('input[name="assign_program_radio"]:checked');
    if (!selectedRadio) {
        showToast('Please select a training program to assign.', 'error');
        return;
    }

    const programId = selectedRadio.value;
    const need = trainingNeedsState.find(n => n.id === needId);
    const prog = trainingProgramsState.find(p => p.id === programId);

    if (need) {
        need.linkedProgramId = programId;
        need.linked_program_id = programId;
        need.status = 'Program Linked';
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

document.addEventListener('DOMContentLoaded', () => {
    initTrainingManagement();
});
