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
// 1. STATE STORES
// =========================================================================

const trainingNeedsState = [
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

const trainingProgramsState = [
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
                q: 'What does the "A" in the LAST hospitality recovery framework represent?',
                options: [
                    'Argue the policy diplomatically',
                    'Apologize sincerely for the guest\'s distress without assigning blame',
                    'Ask the manager to intervene immediately',
                    'Assess the financial liability'
                ],
                correct: 1
            },
            {
                q: 'When an agitated guest raises their voice in the lobby, the recommended verbal pace is:',
                options: [
                    'Match their volume and pace so you are heard',
                    'Lower your tone, speak 15% slower, and maintain calm open body posture',
                    'Remain completely silent until they finish shouting',
                    'Immediately step backwards behind the security desk'
                ],
                correct: 1
            },
            {
                q: 'What is the maximum instant amenity voucher a Front Desk Host may authorize without GM signoff?',
                options: [
                    '₱500 Dining Credit',
                    '₱2,500 F&B or Spa Voucher + Room Category Upgrade',
                    'Free Weekend Stay',
                    '₱10,000 Cash Refund'
                ],
                correct: 1
            },
            {
                q: 'During de-escalation, which phrase should ALWAYS be avoided?',
                options: [
                    '"I completely understand your frustration and I will personally solve this."',
                    '"That\'s not our hotel policy and there is nothing I can do."',
                    '"Let me see what alternatives I can immediately arrange for you."',
                    '"Thank you for bringing this to our attention right away."'
                ],
                correct: 1
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
        passingScore: 85,
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
                q: 'What is the mandatory temperature range for hotel walk-in meat chillers?',
                options: ['0°C to 1°C', '2°C to 4°C', '5°C to 8°C', '-5°C to 0°C'],
                correct: 1
            },
            {
                q: 'Which cutting board color is strictly reserved for raw poultry?',
                options: ['Blue', 'Yellow', 'Red', 'Green'],
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
                q: 'What is the correct tableside tasting pour volume when presenting wine to the host?',
                options: ['10ml', '30ml (1 oz)', '75ml', '150ml'],
                correct: 1
            },
            {
                q: 'Where should the wine bottle label face during pouring?',
                options: ['Towards the floor', 'Facing directly towards the guest being served', 'Facing the sommelier', 'Covered with a napkin'],
                correct: 1
            }
        ]
    }
];

const trainingSessionsState = [
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

const trainingResultsState = [
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

function initTrainingManagement() {
    renderTrainingNeeds();
    renderTrainingPrograms();
    renderTrainingSessions();
    renderAttendanceConsole();
    renderTrainingResults();
    renderCertsTable();
    renderBasicTrainingReport();
    updateTrainingStats();
}

function switchTrainingStage(stageSubTab) {
    switchSubTab('training', stageSubTab);
    
    document.querySelectorAll('.training-stage-step').forEach(step => {
        if (step.dataset.stage === stageSubTab) {
            step.classList.add('border-primary', 'bg-primary/10', 'text-primary');
            step.classList.remove('border-[#E8DEDC]', 'bg-[#FAF8F7]', 'text-slate-600');
        } else {
            step.classList.remove('border-primary', 'bg-primary/10', 'text-primary');
            step.classList.add('border-[#E8DEDC]', 'bg-[#FAF8F7]', 'text-slate-600');
        }
    });
}

function updateTrainingStats() {
    const identifiedCount = trainingNeedsState.filter(n => n.status !== 'Resolved').length;
    const programsCount = trainingProgramsState.length;
    const activeSessionsCount = trainingSessionsState.filter(s => s.status !== 'Completed').length;
    const certifiedCount = trainingResultsState.filter(r => r.resultStatus.includes('Passed')).length;

    const elNeeds = document.getElementById('stat-training-needs');
    const elPrograms = document.getElementById('stat-training-programs');
    const elSessions = document.getElementById('stat-training-sessions');
    const elCertified = document.getElementById('stat-training-certified');

    if (elNeeds) elNeeds.textContent = identifiedCount;
    if (elPrograms) elPrograms.textContent = programsCount;
    if (elSessions) elSessions.textContent = activeSessionsCount;
    if (elCertified) elCertified.textContent = certifiedCount;
}

// =========================================================================
// 3. MODULE 1: PROGRAM CREATION & NEEDS (Gaps / Compliance)
// =========================================================================

function renderTrainingNeeds() {
    const container = document.getElementById('training-needs-list');
    if (!container) return;

    container.innerHTML = trainingNeedsState.map(need => {
        const isResolved = need.status === 'Resolved';
        const typeBadge = need.sourceType === 'competency_gap'
            ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20"><i class="fas fa-chart-radar mr-1"></i> Skill Gap: ${need.targetCompetency}</span>`
            : `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20"><i class="fas fa-shield-check mr-1"></i> Mandatory Compliance: ${need.category}</span>`;

        return `
            <div class="card-clean p-5 hover:shadow-md transition space-y-3.5 border ${isResolved ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-[#E8DEDC]'}">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div class="flex items-center space-x-3">
                        <img src="${need.associateAvatar}" alt="${need.associateName}" class="w-10 h-10 rounded-full object-cover border border-[#E8DEDC] shadow-sm flex-shrink-0">
                        <div>
                            <div class="flex items-center space-x-2">
                                <h4 class="font-bold text-sm text-slate-900">${need.title}</h4>
                                ${typeBadge}
                            </div>
                            <p class="text-xs text-slate-500 font-medium">Associate: <strong class="text-slate-800">${need.associateName}</strong> (${need.associateRole}) · Dept: <strong>${need.dept}</strong></p>
                        </div>
                    </div>
                    <div>
                        ${isResolved 
                            ? `<span class="badge-sage"><i class="fas fa-check-circle mr-1"></i> Resolved &amp; Synced</span>`
                            : `<span class="badge-terracotta"><i class="fas fa-bolt mr-1"></i> Need Active</span>`
                        }
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] text-xs">
                    <div>
                        <span class="text-slate-400 block text-[10px] uppercase font-bold">Category Link</span>
                        <span class="font-bold text-slate-800">${need.category}</span>
                    </div>
                    <div>
                        <span class="text-slate-400 block text-[10px] uppercase font-bold">Current vs Target Benchmark</span>
                        <span class="font-bold text-slate-800">${need.currentScore} / 5.0 <span class="text-slate-400">vs</span> ${need.requiredScore} <span class="text-terracotta-dark font-bold">(${need.gap})</span></span>
                    </div>
                    <div>
                        <span class="text-slate-400 block text-[10px] uppercase font-bold">Diagnosis Note</span>
                        <span class="text-slate-600 line-clamp-1">${need.notes}</span>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-1 text-xs">
                    <span class="text-[11px] text-slate-500">Urgency: <strong class="${need.urgency === 'Critical' ? 'text-red-600' : 'text-slate-700'}">${need.urgency}</strong></span>
                    ${!isResolved ? `
                        <button onclick="scheduleFromNeed('${need.id}')" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                            <i class="fas fa-calendar-plus"></i>
                            <span>Schedule Training Session &rarr;</span>
                        </button>
                    ` : `
                        <span class="text-xs font-bold text-emerald-700"><i class="fas fa-check mr-1"></i> Profile Upgraded to 4.8 Master</span>
                    `}
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
        const isCompleted = member.attendanceStatus === 'Completed';

        const statusBadge = isCompleted
            ? `<span class="badge-sage"><i class="fas fa-check-double mr-1"></i> Completed (100%)</span>`
            : isAttended
            ? `<span class="badge-dusty"><i class="fas fa-user-check mr-1"></i> Attended (100%)</span>`
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
                            class="px-2.5 py-1 rounded-lg text-xs font-bold ${isAttended ? 'bg-dusty-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                            Attended
                        </button>
                        <button onclick="setAssociateAttendance('${session.id}', '${member.associateId}', 'Absent')" 
                            class="px-2.5 py-1 rounded-lg text-xs font-bold ${isAbsent ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                            Absent
                        </button>
                        <button onclick="setAssociateAttendance('${session.id}', '${member.associateId}', 'Completed')" 
                            class="px-2.5 py-1 rounded-lg text-xs font-bold ${isCompleted ? 'bg-sage-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                            Completed
                        </button>
                    </div>
                </td>
                <td class="px-5 py-3.5 text-right">
                    ${isAttended || isCompleted ? `
                        <button onclick="startSessionEvaluation('${session.id}', '${member.associateId}')" 
                            class="btn-primary px-3 py-1 text-[11px] font-bold inline-flex items-center space-x-1">
                            <i class="fas fa-pen-to-square"></i>
                            <span>${member.evaluationStatus === 'Completed' ? 'Re-Evaluate' : 'Fill Evaluation Form'}</span>
                        </button>
                    ` : `
                        <span class="text-slate-400 text-[11px] italic">Attendance Required</span>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

function setAssociateAttendance(sessionId, associateId, status) {
    const session = trainingSessionsState.find(s => s.id === sessionId);
    if (!session) return;

    const member = session.roster.find(r => r.associateId === associateId);
    if (!member) return;

    member.attendanceStatus = status;
    member.attendanceRate = status === 'Absent' ? 0 : 100;
    
    const now = new Date();
    member.checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    renderAttendanceConsole();
    renderTrainingSessions();
    renderBasicTrainingReport();
    showToast(`Attendance recorded: ${member.name} marked as "${status}"`, 'success');
}

function markAllSessionPresent() {
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
        questionsContainer.innerHTML = program.quizQuestions.map((q, qIndex) => {
            return `
                <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-3 text-xs">
                    <p class="font-bold text-slate-900 leading-snug"><span class="text-primary font-bold">Q${qIndex + 1}:</span> ${q.q}</p>
                    <div class="space-y-2">
                        ${q.options.map((opt, optIndex) => `
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

function submitTrainingEvaluation() {
    const { sessionId, associateId, programId, answers } = currentEvaluationContext;
    const session = trainingSessionsState.find(s => s.id === sessionId);
    const member = session?.roster.find(r => r.associateId === associateId);
    const program = trainingProgramsState.find(p => p.id === programId);

    if (!session || !member || !program) {
        showToast('Evaluation submission error: Session or Associate context missing', 'error');
        return;
    }

    let correctCount = 0;
    const totalQuestions = program.quizQuestions.length;

    program.quizQuestions.forEach((q, idx) => {
        if (answers[idx] === q.correct) {
            correctCount++;
        }
    });

    const answeredKeys = Object.keys(answers);
    const calculatedScore = answeredKeys.length > 0 
        ? Math.round((correctCount / totalQuestions) * 100)
        : 95;

    const isPassed = calculatedScore >= program.passingScore;
    const resultId = `res-${Date.now()}`;
    const certReference = `OXF-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newResult = {
        id: resultId,
        sessionId: sessionId,
        programId: programId,
        programTitle: program.title,
        category: program.category,
        dept: session.dept,
        associateId: associateId,
        associateName: member.name,
        associateRole: member.role,
        associateAvatar: member.avatar,
        trainerName: session.trainerName,
        completionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        attendanceRate: `${member.attendanceRate}%`,
        quizScore: calculatedScore,
        passingThreshold: program.passingScore,
        resultStatus: isPassed ? 'Passed & Certified' : 'Failed - Remedial Required',
        feedbackRating: currentEvaluationContext.kirkpatrickFeedback.trainerRating,
        certificateReference: isPassed ? certReference : null,
        competencyTarget: program.targetCompetency,
        competencyKey: program.competencyKey,
        competencyScoreBefore: 3.5,
        competencyScoreAfter: isPassed ? 4.8 : 3.5,
        syncedToProfile: isPassed,
        xpAwarded: isPassed ? program.xpAward : 0
    };

    trainingResultsState.unshift(newResult);

    member.evaluationStatus = 'Completed';
    member.attendanceStatus = 'Completed';
    member.score = calculatedScore;
    member.resultId = resultId;

    closeModal('modal-training-evaluation');

    if (isPassed) {
        feedResultsIntoCompetency(newResult);
        showToast(`Evaluation Passed (${calculatedScore}%)! Cert: ${certReference} recorded & Profile updated!`, 'success');
        switchTrainingStage('results');
    } else {
        showToast(`Evaluation Score: ${calculatedScore}% (Threshold: ${program.passingScore}%). Result recorded.`, 'error');
        switchTrainingStage('results');
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

function scheduleFromNeed(needId) {
    const need = trainingNeedsState.find(n => n.id === needId);
    if (!need) return;
    openScheduleModal(need.linkedProgramId);
}

function openScheduleModal(preselectedProgramId = null) {
    const progSelect = document.getElementById('sched-modal-program-select');
    if (progSelect) {
        progSelect.innerHTML = trainingProgramsState.map(p => `
            <option value="${p.id}" ${p.id === preselectedProgramId ? 'selected' : ''}>${p.title} (${p.category})</option>
        `).join('');
    }
    openModal('modal-schedule-training-session');
}

function saveScheduledSession() {
    const progId = document.getElementById('sched-modal-program-select')?.value;
    const trainerName = document.getElementById('sched-modal-trainer')?.value || 'Master Sommelier Pierre';
    const location = document.getElementById('sched-modal-venue')?.value || 'Executive Boardroom';
    const date = document.getElementById('sched-modal-date')?.value || 'Aug 30, 2026';
    const time = document.getElementById('sched-modal-time')?.value || '14:00 - 17:00';

    const prog = trainingProgramsState.find(p => p.id === progId) || trainingProgramsState[0];

    const newSession = {
        id: `sess-${Date.now()}`,
        programId: prog.id,
        title: `${prog.title} - Cohort B`,
        dept: prog.dept,
        trainerName: trainerName,
        trainerTitle: 'Assigned Senior Trainer',
        trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        location: location,
        date: date,
        time: time,
        status: 'Scheduled',
        roster: [
            {
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
            },
            {
                associateId: 'emp-102',
                name: 'Carlos Gomez',
                role: 'Concierge Lead',
                dept: 'Front Office',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                attendanceStatus: 'Attended',
                attendanceRate: 100,
                checkInTime: '13:55',
                evaluationStatus: 'Pending',
                score: null,
                resultId: null
            }
        ]
    };

    trainingSessionsState.unshift(newSession);
    closeModal('modal-schedule-training-session');
    
    renderTrainingSessions();
    renderAttendanceConsole();
    renderBasicTrainingReport();
    updateTrainingStats();
    showToast(`Training session "${newSession.title}" scheduled!`, 'success');
    switchTrainingStage('schedules');
}

function openCreateProgramModal() {
    openModal('modal-create-training-program');
}

function saveNewTrainingProgram() {
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
}

document.addEventListener('DOMContentLoaded', () => {
    initTrainingManagement();
});
