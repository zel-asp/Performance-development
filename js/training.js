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

let trainingNeedsState = [
    {
        id: 'need-1',
        title: 'Frontline Conflict De-escalation Deficit',
        sourceType: 'competency_gap',
        sourceLabel: 'Skill Gap',
        category: 'Service Excellence',
        dept: 'Front Office',
        associateName: 'Maria Santos',
        associateRole: 'Front Desk Host',
        associateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        targetCompetency: 'Frontline Conflict De-escalation',
        competencyKey: 'de_escalation',
        currentScore: 3.5,
        requiredScore: 5.0,
        gap: -1.5,
        urgency: 'High',
        status: 'Program Linked',
        linkedProgramId: 'prog-1',
        dateIdentified: 'Aug 18, 2026',
        notes: 'Identified during Q3 Supervisor Review and Front Office guest friction logs.'
    },
    {
        id: 'need-2',
        title: 'HACCP Level 3 Mandatory Annual Recertification',
        sourceType: 'compliance',
        sourceLabel: 'Mandatory Compliance',
        category: 'Food Safety & Hygiene',
        dept: 'Culinary',
        associateName: 'Carlos Gomez & Culinary Team (5 Associates)',
        associateRole: 'Kitchen & Concierge Staff',
        associateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        targetCompetency: 'HACCP Safety & Sanitation',
        competencyKey: 'haccp_safety',
        currentScore: 4.0,
        requiredScore: 4.8,
        gap: -0.8,
        urgency: 'Critical',
        status: 'Scheduled',
        linkedProgramId: 'prog-2',
        dateIdentified: 'Aug 12, 2026',
        notes: 'Statutory hospitality requirement for all food handling staff.'
    },
    {
        id: 'need-3',
        title: 'Sommelier Wine Upselling & Vintage Storytelling',
        sourceType: 'competency_gap',
        sourceLabel: 'Skill Gap',
        category: 'Revenue Optimization',
        dept: 'F&B Service',
        associateName: 'David Lee',
        associateRole: 'F&B Server Lead',
        associateAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        targetCompetency: 'Revenue & Wine Upsell',
        competencyKey: 'revenue_upsell',
        currentScore: 3.8,
        requiredScore: 4.8,
        gap: -1.0,
        urgency: 'Medium',
        status: 'Identified',
        linkedProgramId: 'prog-3',
        dateIdentified: 'Aug 20, 2026',
        notes: 'Average wine check is 18% below restaurant benchmark for dinner shift.'
    },
    {
        id: 'need-4',
        title: 'Fire Safety & Crisis Evacuation Protocol',
        sourceType: 'compliance',
        sourceLabel: 'Mandatory Compliance',
        category: 'Safety & Security',
        dept: 'Housekeeping',
        associateName: 'Housekeeping Staff (12 Associates)',
        associateRole: 'Room Attendants',
        associateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        targetCompetency: 'Crisis Management & Evacuation',
        competencyKey: 'crisis_mgmt',
        currentScore: 4.1,
        requiredScore: 5.0,
        gap: -0.9,
        urgency: 'High',
        status: 'Identified',
        linkedProgramId: 'prog-4',
        dateIdentified: 'Aug 22, 2026',
        notes: 'Annual mandatory hotel evacuation drill and extinguisher handling.'
    }
];

let trainingProgramsState = [
    {
        id: 'prog-1',
        title: 'Hospitality Crisis Diplomacy & Guest De-escalation',
        category: 'Skill Gap: Service Excellence',
        categoryType: 'skill_gap',
        dept: 'Front Office',
        targetCompetency: 'Frontline Conflict De-escalation',
        competencyKey: 'de_escalation',
        duration: '3.5 Hours (1 Day Workshop)',
        format: 'In-Person Workshop & Roleplay',
        trainerType: 'Internal Master Trainer',
        passingScore: 80,
        xpAward: 150,
        icon: 'fa-handshake-angle',
        badgeColor: 'terracotta',
        description: 'Comprehensive training covering the LAST de-escalation framework (Listen, Apologize, Solve, Thank), emotional intelligence under pressure, and diplomatic service recovery vouchers.',
        modules: [
            '1. Anatomy of Guest Frustration & Empathy Triggers',
            '2. The LAST Protocol in Real Hospitality Scenarios',
            '3. Body Language, Vocal Cadence & Boundary Setting',
            '4. Live Simulations & Practical Scenario Assessment'
        ],
        quizQuestions: [
            {
                q: '1. What does the "A" in the LAST hospitality recovery framework represent?',
                options: [
                    'Argue the hotel policy diplomatically',
                    'Apologize sincerely for the guest\'s distress without assigning blame',
                    'Ask the manager to intervene immediately',
                    'Assess the financial liability of the hotel'
                ],
                correct: 1
            },
            {
                q: '2. When an agitated guest raises their voice in the lobby, the recommended verbal pace is:',
                options: [
                    'Match their volume and pace so you are heard clearly',
                    'Lower your tone, speak 15% slower, and maintain calm open body posture',
                    'Remain completely silent until they finish shouting',
                    'Immediately step backwards behind the security desk'
                ],
                correct: 1
            },
            {
                q: '3. What is the maximum instant amenity voucher a Front Desk Host may authorize without GM signoff?',
                options: [
                    '₱500 Dining Credit',
                    '₱2,500 F&B or Spa Voucher + Room Category Upgrade',
                    'Free Weekend Stay',
                    '₱10,000 Cash Refund'
                ],
                correct: 1
            },
            {
                q: '4. During de-escalation, which phrase should ALWAYS be avoided?',
                options: [
                    '"I completely understand your frustration and I will personally solve this."',
                    '"That\'s not our hotel policy and there is nothing I can do."',
                    '"Let me see what alternatives I can immediately arrange for you."',
                    '"Thank you for bringing this to our attention right away."'
                ],
                correct: 1
            },
            {
                q: '5. What documentation must be logged immediately after a de-escalation incident is resolved?',
                options: [
                    'Duty Manager Shift Friction Log with guest name, room number, root cause, and recovery voucher issued',
                    'No logging is required if the guest stopped complaining',
                    'Send a private WhatsApp message to coworkers',
                    'Write a handwritten note and discard it at end of shift'
                ],
                correct: 0
            }
        ]
    },
    {
        id: 'prog-2',
        title: 'HACCP Level 3 Food Safety & Cold-Chain Mastery',
        category: 'Mandatory Compliance',
        categoryType: 'compliance',
        dept: 'Culinary',
        targetCompetency: 'HACCP Safety & Sanitation',
        competencyKey: 'haccp_safety',
        duration: '4.0 Hours',
        format: 'Hygiene Lab & Inspection Walk',
        trainerType: 'Certified External Auditor',
        passingScore: 80,
        xpAward: 150,
        icon: 'fa-utensils',
        badgeColor: 'sage',
        description: 'Certified standard training on critical control points (CCP), digital cold-chain data logging, allergen cross-contact segregation, and sanitization protocols.',
        modules: [
            '1. Critical Control Points & Walk-in Chiller Thresholds',
            '2. Color-coded Board Segregation & Cross-Contamination',
            '3. Blast Chilling, Core Probe Calibration & FIFO Logs',
            '4. Health Authority Audit Compliance Walkthrough'
        ],
        quizQuestions: [
            {
                q: '1. What is the mandatory minimum internal core temperature for cooked poultry?',
                options: [
                    '63°C (145°F)',
                    '74°C (165°F) for at least 15 seconds',
                    '55°C (130°F)',
                    '85°C (185°F)'
                ],
                correct: 1
            },
            {
                q: '2. The Temperature Danger Zone for rapid bacterial growth in food is between:',
                options: [
                    '0°C and 4°C',
                    '5°C and 60°C (41°F and 140°F)',
                    '60°C and 100°C',
                    '-18°C and 0°C'
                ],
                correct: 1
            },
            {
                q: '3. How often must walk-in chiller temperatures be manually logged in the HACCP register?',
                options: [
                    'Once a week',
                    'Every 4 hours during shift operations',
                    'Only during annual audits',
                    'Once at the end of the month'
                ],
                correct: 1
            },
            {
                q: '4. Which cutting board color is strictly reserved for raw poultry in commercial kitchens?',
                options: [
                    'Blue',
                    'Yellow',
                    'Red',
                    'Green'
                ],
                correct: 1
            },
            {
                q: '5. What is the maximum time hot food can be held on a buffet line before mandatory re-check or disposal?',
                options: [
                    '1 Hour',
                    '4 Hours at ≥ 60°C',
                    '8 Hours',
                    '12 Hours'
                ],
                correct: 1
            }
        ]
    },
    {
        id: 'prog-3',
        title: 'Sommelier Fine Wine Pairing & Vintage Storytelling',
        category: 'Skill Gap: Revenue Optimization',
        categoryType: 'skill_gap',
        dept: 'F&B Service',
        targetCompetency: 'Revenue & Wine Upsell',
        competencyKey: 'revenue_upsell',
        duration: '3.0 Hours',
        format: 'Tasting Workshop & Tableside Service',
        trainerType: 'Master Sommelier',
        passingScore: 80,
        xpAward: 150,
        icon: 'fa-wine-glass-empty',
        badgeColor: 'gold',
        description: 'Tasting workshop covering Old World vs New World terroirs, tableside decanting ritual, tasting pour etiquette, and food pairing storytelling.',
        modules: [
            '1. Bordeaux, Burgundy & Tuscan Vintage Profiles',
            '2. Tableside Decanting Etiquette & Glassware Selection',
            '3. Acidity & Tannin Balancing with Tasting Menus',
            '4. Premium Cellar Upselling Dialogue'
        ],
        quizQuestions: [
            {
                q: '1. Which wine classification represents the highest statutory quality tier in Bordeaux, France?',
                options: [
                    'Vin de Pays',
                    'Grand Cru Classé (1855 Classification)',
                    'AOP Regional',
                    'Table Wine'
                ],
                correct: 1
            },
            {
                q: '2. What ideal serving temperature should be maintained for full-bodied vintage Cabernet Sauvignon?',
                options: [
                    '4°C to 6°C',
                    '16°C to 18°C (60°F to 65°F)',
                    '22°C to 25°C',
                    '0°C'
                ],
                correct: 1
            },
            {
                q: '3. Which grape variety is the primary constituent of authentic Barolo wines from Piedmont, Italy?',
                options: [
                    'Sangiovese',
                    'Nebbiolo',
                    'Merlot',
                    'Pinot Noir'
                ],
                correct: 1
            },
            {
                q: '4. When pairing wine with rich Wagyu Ribeye steak, what structural wine characteristic balances the marbling fat?',
                options: [
                    'High residual sugar',
                    'High tannin and robust acidity',
                    'Low alcohol content',
                    'Effervescence'
                ],
                correct: 1
            },
            {
                q: '5. What is the primary purpose of decanting an aged vintage red wine before service?',
                options: [
                    'Chilling the wine quickly',
                    'Separate sediment and aerate the wine to open complex aromas',
                    'Dilute the alcohol concentration',
                    'Change the wine color'
                ],
                correct: 1
            }
        ]
    }
];

let trainingSessionsState = [
    {
        id: 'sess-101',
        programId: 'prog-1',
        title: 'Hospitality Crisis Diplomacy & Guest De-escalation - Cohort A',
        dept: 'Front Office',
        trainerName: 'Elena Vance & FOM John Marco',
        trainerTitle: 'Internal Master Hospitality Trainer',
        trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        location: 'Executive Boardroom & Front Desk Mockup',
        date: 'Aug 26, 2026',
        time: '14:00 - 17:30',
        status: 'In Progress', // 'Scheduled', 'In Progress', 'Completed'
        roster: [
            {
                associateId: 'emp-101',
                name: 'Maria Santos',
                role: 'Front Desk Host',
                dept: 'Front Office',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                attendanceStatus: 'Attended', // 'Attended', 'Absent', 'Completed'
                attendanceRate: 100,
                checkInTime: '13:52',
                evaluationStatus: 'Pending',
                score: null,
                resultId: null
            },
            {
                associateId: 'emp-102',
                name: 'Carlos Gomez',
                role: 'Concierge Lead',
                dept: 'Front Office',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                attendanceStatus: 'Completed',
                attendanceRate: 100,
                checkInTime: '13:58',
                evaluationStatus: 'Completed',
                score: 95,
                resultId: 'res-901'
            },
            {
                associateId: 'emp-103',
                name: 'Angela Reyes',
                role: 'Guest Relations Officer',
                dept: 'Front Office',
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
                attendanceStatus: 'Attended',
                attendanceRate: 100,
                checkInTime: '14:01',
                evaluationStatus: 'Pending',
                score: null,
                resultId: null
            }
        ]
    },
    {
        id: 'sess-102',
        programId: 'prog-2',
        title: 'HACCP Food Safety Level 3 - Hygiene Intensive',
        dept: 'Culinary',
        trainerName: 'Chef Marco Rossi (Exec Sous Chef)',
        trainerTitle: 'Certified Food Hygiene Auditor',
        trainerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        location: 'Main Culinary Kitchen & Training Cold Room',
        date: 'Aug 27, 2026',
        time: '09:00 - 13:00',
        status: 'Scheduled',
        roster: [
            {
                associateId: 'emp-104',
                name: 'Chef Marco S.',
                role: 'Line Cook Lead',
                dept: 'Culinary',
                avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80',
                attendanceStatus: 'Attended',
                attendanceRate: 100,
                checkInTime: '08:55',
                evaluationStatus: 'Pending',
                score: null,
                resultId: null
            },
            {
                associateId: 'emp-105',
                name: 'Tanya Morales',
                role: 'Pastry Chef de Partie',
                dept: 'Culinary',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                attendanceStatus: 'Attended',
                attendanceRate: 100,
                checkInTime: '08:58',
                evaluationStatus: 'Pending',
                score: null,
                resultId: null
            }
        ]
    },
    {
        id: 'sess-103',
        programId: 'prog-3',
        title: 'Sommelier Wine Pairing & Fine Dining Service Masterclass',
        dept: 'F&B Service',
        trainerName: 'Pierre Dubois',
        trainerTitle: 'Master Sommelier',
        trainerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        location: 'The Oxford Cellar & Fine Dining Room',
        date: 'Aug 28, 2026',
        time: '15:00 - 18:00',
        status: 'Scheduled',
        roster: [
            {
                associateId: 'emp-106',
                name: 'David Lee',
                role: 'F&B Server Lead',
                dept: 'F&B Service',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                attendanceStatus: 'Attended',
                attendanceRate: 100,
                checkInTime: '14:50',
                evaluationStatus: 'Pending',
                score: null,
                resultId: null
            }
        ]
    }
];

let trainingResultsState = [
    {
        id: 'res-901',
        sessionId: 'sess-101',
        programId: 'prog-1',
        programTitle: 'Hospitality Crisis Diplomacy & Guest De-escalation',
        category: 'Skill Gap: Service Excellence',
        dept: 'Front Office',
        associateId: 'emp-102',
        associateName: 'Carlos Gomez',
        associateRole: 'Concierge Lead',
        associateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        trainerName: 'Elena Vance & FOM John Marco',
        completionDate: 'Aug 24, 2026',
        attendanceRate: '100%',
        quizScore: 95,
        passingThreshold: 80,
        resultStatus: 'Passed & Certified',
        feedbackRating: 5.0,
        certificateReference: 'OXF-CERT-2026-0889',
        competencyTarget: 'Frontline Conflict De-escalation',
        competencyKey: 'de_escalation',
        competencyScoreBefore: 3.8,
        competencyScoreAfter: 4.8,
        syncedToProfile: true,
        xpAwarded: 150
    },
    {
        id: 'res-899',
        sessionId: 'sess-prev',
        programId: 'prog-2',
        programTitle: 'HACCP Level 3 Food Safety & Cold-Chain Mastery',
        category: 'Mandatory Compliance',
        dept: 'Culinary',
        associateId: 'emp-101',
        associateName: 'Maria Santos',
        associateRole: 'Front Desk Host (Cross-Training)',
        associateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        trainerName: 'Chef Marco Rossi',
        completionDate: 'Jul 15, 2026',
        attendanceRate: '100%',
        quizScore: 98,
        passingThreshold: 85,
        resultStatus: 'Passed & Certified',
        feedbackRating: 5.0,
        certificateReference: 'OXF-CERT-2026-0742',
        competencyTarget: 'HACCP Safety & Sanitation',
        competencyKey: 'haccp_safety',
        competencyScoreBefore: 4.0,
        competencyScoreAfter: 4.8,
        syncedToProfile: true,
        xpAwarded: 150
    }
];

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
        linkedProgramId: need.linkedProgramId || need.linked_program_id || 'prog-1',
        dateIdentified: need.dateIdentified || need.date_identified || 'Aug 18, 2026',
        notes: need.notes || need.diagnosis_note || 'Identified during supervisor performance audit.'
    };
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
        certificateReference: res.certificateReference || res.certificate_reference || 'OXF-CERT-2026-0001',
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

    const filterBtns = ['active', 'resolved', 'all'];
    filterBtns.forEach(f => {
        const btn = document.getElementById(`btn-needs-filter-${f}`);
        if (btn) {
            if (f === filter) {
                btn.className = 'px-3 py-1 rounded-lg text-xs font-bold bg-primary text-white transition shadow-sm';
            } else {
                btn.className = 'px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition';
            }
        }
    });

    const badge = document.getElementById('needs-filter-count-badge');
    if (badge) {
        badge.textContent = filter === 'active' ? 'Showing Active Deficits' : filter === 'resolved' ? 'Showing Resolved History' : 'Showing All Audit Triggers';
    }

    renderTrainingNeeds();
}

function renderTrainingNeeds() {
    const container = document.getElementById('training-needs-list');
    if (!container) return;

    let filteredNeeds = trainingNeedsState.map(normalizeTrainingNeed);
    if (needsActiveFilterTab === 'active') {
        filteredNeeds = filteredNeeds.filter(n => n.status !== 'Resolved' && n.status !== 'Completed');
    } else if (needsActiveFilterTab === 'resolved') {
        filteredNeeds = filteredNeeds.filter(n => n.status === 'Resolved' || n.status === 'Completed');
    }

    if (filteredNeeds.length === 0) {
        const emptyMsg = needsActiveFilterTab === 'resolved'
            ? 'No resolved training history recorded yet.'
            : 'No active skill gap deficits or compliance requirements pending in the queue.';

        container.innerHTML = `
            <div class="card-clean p-8 bg-white border border-[#E8DEDC] text-center space-y-3">
                <div class="w-12 h-12 rounded-full bg-[#FAF8F7] border border-[#E8DEDC] text-slate-400 flex items-center justify-center mx-auto">
                    <i class="fas fa-check-double text-lg text-emerald-600"></i>
                </div>
                <h4 class="font-bold text-slate-800 text-sm">${needsActiveFilterTab === 'resolved' ? 'No Resolved Items' : 'All Associate Competencies at Benchmark'}</h4>
                <p class="text-slate-500 text-xs">${emptyMsg}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredNeeds.map(need => {
        const isResolved = need.status === 'Resolved' || need.status === 'Completed';
        const isScheduled = need.status === 'Scheduled';
        const isSkillGap = need.sourceType === 'competency_gap';

        // Calculate progress percentage on 5.0 scale
        const currentPct = Math.min(100, Math.max(10, Math.round((need.currentScore / 5.0) * 100)));
        const targetPct = Math.min(100, Math.max(10, Math.round((need.requiredScore / 5.0) * 100)));

        const urgencyBadge = need.urgency === 'Critical'
            ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider"><i class="fas fa-fire mr-1"></i> Critical Urgency</span>`
            : need.urgency === 'High'
                ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200"><i class="fas fa-clock mr-1"></i> High Priority</span>`
                : `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Standard</span>`;

        const typeBadge = isSkillGap
            ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20"><i class="fas fa-chart-radar mr-1"></i> Skill Gap: ${need.targetCompetency}</span>`
            : `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-800 border border-amber-500/20"><i class="fas fa-shield-halved mr-1"></i> Mandatory Compliance</span>`;

        const statusPill = isResolved
            ? `<span class="badge-sage font-bold"><i class="fas fa-check-circle mr-1"></i> Resolved &amp; Synced (4.8 Score)</span>`
            : isScheduled
                ? `<span class="badge-dusty font-bold"><i class="fas fa-calendar-check mr-1"></i> Session Scheduled</span>`
                : `<span class="badge-terracotta font-bold"><i class="fas fa-bolt mr-1"></i> Deficit Active</span>`;

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

                <!-- Middle Row: Benchmark Comparison & Diagnosis -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 p-3.5 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] text-xs items-center">
                    
                    <!-- Score & Gap Progress Visualizer (5 Cols) -->
                    <div class="lg:col-span-5 space-y-1.5">
                        <div class="flex justify-between items-center text-[11px]">
                            <span class="text-slate-500 font-semibold">Current vs Target Benchmark:</span>
                            <span class="font-black text-slate-800">
                                <span class="${need.currentScore < need.requiredScore ? 'text-terracotta-dark' : 'text-emerald-700'} font-bold">${need.currentScore}</span>
                                <span class="text-slate-400 font-normal"> / 5.0</span>
                                <span class="text-slate-400 mx-1">vs</span>
                                <span class="text-slate-900">${need.requiredScore}</span>
                                <span class="ml-1 px-1.5 py-0.2 rounded text-[10px] font-bold ${need.gap < 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}">
                                    ${need.gap < 0 ? need.gap : '+' + need.gap} Gap
                                </span>
                            </span>
                        </div>

                        <!-- Progress Bar -->
                        <div class="w-full bg-slate-200/80 rounded-full h-2.5 relative overflow-hidden flex">
                            <div class="h-2.5 rounded-full ${need.currentScore < 4.0 ? 'bg-terracotta' : 'bg-amber-500'} transition-all duration-500" style="width: ${currentPct}%;"></div>
                        </div>
                        <div class="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>Evaluated Rating (${need.currentScore})</span>
                            <span>Target Level (${need.requiredScore})</span>
                        </div>
                    </div>

                    <!-- Diagnosis Note (7 Cols) -->
                    <div class="lg:col-span-7 lg:pl-3 lg:border-l border-slate-200 space-y-1">
                        <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Diagnosis Audit Note &amp; Trigger Context:</span>
                        <p class="text-slate-700 leading-relaxed">${need.notes}</p>
                        <div class="flex items-center space-x-3 text-[11px] text-slate-400 pt-0.5">
                            <span><i class="fas fa-calendar-check mr-1 text-slate-400"></i> Identified: <strong class="text-slate-600">${need.dateIdentified}</strong></span>
                            <span><i class="fas fa-link mr-1 text-primary"></i> Linked Syllabus: <strong class="text-primary font-bold">${need.category}</strong></span>
                        </div>
                    </div>
                </div>

                <!-- Bottom Row: Action Trigger -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                    <div class="flex items-center space-x-2 text-slate-500">
                        <i class="fas fa-lightbulb text-amber-500"></i>
                        <span class="text-[11px]">Recommended Action: <strong>Schedule targeted cohort session before next shift audit.</strong></span>
                    </div>

                    <div>
                        ${!isResolved ? `
                            <button onclick="scheduleFromNeed('${need.id}')" class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-2 shadow-sm">
                                <i class="fas fa-calendar-plus"></i>
                                <span>Schedule Training Session &rarr;</span>
                            </button>
                        ` : `
                            <span class="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                                <i class="fas fa-award mr-1.5 text-emerald-600"></i>
                                <span>Competency Upgraded to 4.8 Master Level</span>
                            </span>
                        `}
                    </div>
                </div>
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
        const isLive = sess.status === 'In Progress';
        const isCompleted = sess.status === 'Completed';

        const statusBadge = isLive
            ? `<span class="badge-terracotta animate-pulse"><i class="fas fa-satellite-dish mr-1"></i> In Progress</span>`
            : isCompleted
                ? `<span class="badge-sage"><i class="fas fa-check-circle mr-1"></i> Completed</span>`
                : `<span class="badge-dusty"><i class="fas fa-calendar-clock mr-1"></i> Scheduled</span>`;

        return `
            <div class="card-clean p-6 hover:shadow-md transition space-y-4 border ${isLive ? 'border-terracotta/40 bg-terracotta-50/10' : 'border-[#E8DEDC] bg-white'}">
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
                            <i class="fas fa-user-check text-sage-dark"></i>
                            <span>Track Attendance</span>
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
    const session = trainingSessionsState.find(s => s.id === activeAttendanceSessionId) || trainingSessionsState[0];
    if (!session) return;

    activeAttendanceSessionId = session.id;

    const selector = document.getElementById('attendance-session-select');
    if (selector) {
        selector.innerHTML = trainingSessionsState.map(s => `
            <option value="${s.id}" ${s.id === activeAttendanceSessionId ? 'selected' : ''}>${s.title} (${s.date})</option>
        `).join('');
    }

    const titleEl = document.getElementById('attendance-session-header-title');
    const trainerEl = document.getElementById('attendance-session-header-trainer');
    const venueEl = document.getElementById('attendance-session-header-venue');
    const dateEl = document.getElementById('attendance-session-header-date');

    if (titleEl) titleEl.textContent = session.title;
    if (trainerEl) trainerEl.textContent = `Trainer: ${session.trainerName}`;
    if (venueEl) venueEl.textContent = session.location;
    if (dateEl) dateEl.textContent = `${session.date} · ${session.time}`;

    const tbody = document.getElementById('attendance-roster-tbody');
    if (!tbody) return;

    tbody.innerHTML = session.roster.map(member => {
        const isAttended = member.attendanceStatus === 'Attended';
        const isAbsent = member.attendanceStatus === 'Absent';
        const isCompleted = member.attendanceStatus === 'Completed' || member.evaluationStatus === 'Completed';

        const statusBadge = isCompleted
            ? `<span class="badge-sage font-bold"><i class="fas fa-check-double mr-1"></i> Completed (Passed 80%+)</span>`
            : isAttended
                ? `<span class="badge-dusty"><i class="fas fa-user-check mr-1"></i> Attended (Pending Quiz)</span>`
                : `<span class="badge-terracotta"><i class="fas fa-xmark mr-1"></i> Absent (0%)</span>`;

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
                <td class="px-5 py-3.5">
                    <div class="flex items-center space-x-1.5">
                        <button onclick="setAssociateAttendance('${session.id}', '${member.associateId}', 'Attended')" 
                            class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${isAttended || isCompleted ? 'bg-dusty-dark text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                            <i class="fas fa-check mr-1 text-[10px]"></i> Attended
                        </button>
                        <button onclick="setAssociateAttendance('${session.id}', '${member.associateId}', 'Absent')" 
                            class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${isAbsent ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                            <i class="fas fa-xmark mr-1 text-[10px]"></i> Absent
                        </button>
                    </div>
                </td>
                <td class="px-5 py-3.5 text-right">
                    ${isAttended || isCompleted ? `
                        <button onclick="startSessionEvaluation('${session.id}', '${member.associateId}')" 
                            class="btn-primary px-3 py-1.5 text-[11px] font-bold inline-flex items-center space-x-1 shadow-xs">
                            <i class="fas fa-pen-to-square"></i>
                            <span>${isCompleted ? 'Re-Evaluate Quiz' : 'Take Evaluation Quiz →'}</span>
                        </button>
                    ` : `
                        <span class="text-slate-400 text-[11px] italic font-medium">Mark Attended First</span>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

async function setAssociateAttendance(sessionId, associateId, status) {
    const session = trainingSessionsState.find(s => s.id === sessionId);
    if (!session) return;

    const member = session.roster.find(r => r.associateId === associateId);
    if (!member) return;

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
    if (modalSubtitle) modalSubtitle.textContent = `Associate: ${member.name} (${member.role}) · Trainer: ${session.trainerName} · Passing: ${program.passingScore}%`;

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
        n.associateName.includes(result.associateName) || n.targetCompetency === result.competencyTarget
    );
    if (matchingNeed) {
        matchingNeed.status = 'Resolved';
        matchingNeed.currentScore = result.competencyScoreAfter;
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
                <td class="px-5 py-3.5 font-bold ${isPassed ? 'text-emerald-700' : 'text-red-600'}">${res.quizScore}% <span class="text-[10px] text-slate-400 font-normal">(&ge;${res.passingThreshold}%)</span></td>
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

document.addEventListener('DOMContentLoaded', () => {
    initTrainingManagement();
});
