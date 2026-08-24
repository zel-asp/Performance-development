/**
 * Oxford Suites, Makati - Succession Planning & Talent Pipeline Engine
 * 
 * Process Flow:
 * 1. Pull closed performance ratings + competency assessment levels
 * 2. Compute readiness matrix against target role (Employee × Target Role)
 * 3. HR reviews computed matrix and gap diagnosis
 * 4. HR manually sets formal readiness flag (Ready Now / Ready in 1–2 years / Not Ready)
 * 5. Update succession records tied to Department and Target Role
 */

// =========================================================================
// 1. STATE STORES
// =========================================================================

const successionRolesState = [
    {
        id: 'role-fo-mgr',
        title: 'Front Office Assistant Manager',
        dept: 'Front Office',
        incumbentName: 'John Marco',
        incumbentTenure: '4 Years',
        plannedTransition: 'Q1 2027 (6 Months)',
        riskOfLoss: 'Medium (Overseas Transfer)',
        benchStrength: 'Strong (2 Successors)',
        requiredCompetencies: {
            guest_relations: 4.8,
            pms_systems: 4.5,
            de_escalation: 4.5,
            shift_leadership: 4.0
        },
        minPerformanceRating: 4.5,
        primarySuccessorId: 'emp-101', // Maria Santos
        emergencyBackupId: 'emp-102',   // Carlos Gomez
        successionStatus: 'Bench Ready'
    },
    {
        id: 'role-exec-sous',
        title: 'Executive Sous Chef',
        dept: 'Culinary',
        incumbentName: 'Chef Marco Rossi',
        incumbentTenure: '6 Years',
        plannedTransition: 'Q3 2027 (12 Months)',
        riskOfLoss: 'Low',
        benchStrength: 'Moderate (1 Successor)',
        requiredCompetencies: {
            haccp_safety: 4.8,
            culinary_technique: 4.8,
            kitchen_costing: 4.2,
            shift_leadership: 4.2
        },
        minPerformanceRating: 4.5,
        primarySuccessorId: 'emp-104', // Chef Marco S.
        emergencyBackupId: 'emp-105',   // Tanya Morales
        successionStatus: 'Pipeline Active'
    },
    {
        id: 'role-fb-mgr',
        title: 'Restaurant Operations Manager',
        dept: 'F&B Service',
        incumbentName: 'Antoine Laurent',
        incumbentTenure: '3 Years',
        plannedTransition: 'Q4 2027 (18 Months)',
        riskOfLoss: 'High (Retirement)',
        benchStrength: 'Emerging (1 Successor)',
        requiredCompetencies: {
            revenue_upsell: 4.8,
            sommelier_standards: 4.5,
            guest_relations: 4.5,
            shift_leadership: 4.0
        },
        minPerformanceRating: 4.2,
        primarySuccessorId: 'emp-106', // David Lee
        emergencyBackupId: null,
        successionStatus: 'Development Phase'
    },
    {
        id: 'role-housekeeping-mgr',
        title: 'Executive Housekeeper',
        dept: 'Housekeeping',
        incumbentName: 'Theresa Ramos',
        incumbentTenure: '8 Years',
        plannedTransition: 'Q2 2028 (24 Months)',
        riskOfLoss: 'Low',
        benchStrength: 'Developing (2 Successors)',
        requiredCompetencies: {
            room_standards: 4.8,
            crisis_mgmt: 4.5,
            inventory_control: 4.2,
            shift_leadership: 4.0
        },
        minPerformanceRating: 4.2,
        primarySuccessorId: 'emp-107',
        emergencyBackupId: null,
        successionStatus: 'Bench Ready'
    }
];

const successionCandidatesState = [
    {
        id: 'emp-101',
        name: 'Maria Santos',
        role: 'Front Desk Host',
        dept: 'Front Office',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        closedPerformanceRating: 4.8, // from Performance Management (89.4% Exceeds)
        performanceLabel: 'Exceeds Expectations (4.8 / 5.0)',
        nineBoxGridCategory: 'Star Track (Next Lead)',
        potentialScore: 'High',
        competencyScores: {
            guest_relations: 4.8,
            pms_systems: 5.0,
            de_escalation: 4.8, // upgraded after training completion!
            shift_leadership: 4.2,
            haccp_safety: 4.8,
            revenue_upsell: 4.6
        },
        targetRoleAllocations: [
            {
                roleId: 'role-fo-mgr',
                computedReadinessPercent: 94,
                matchStatus: 'High Match',
                hrReadinessFlag: 'Ready Now', // 'Ready Now', 'Ready in 1–2 years', 'Not Ready'
                hrNotes: 'Completed Crisis Diplomacy training and demonstrated outstanding leadership during night shift escalations.',
                lastCalibrated: 'Aug 24, 2026'
            }
        ]
    },
    {
        id: 'emp-102',
        name: 'Carlos Gomez',
        role: 'Concierge Lead',
        dept: 'Front Office',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        closedPerformanceRating: 4.6,
        performanceLabel: 'Strong Performer (4.6 / 5.0)',
        nineBoxGridCategory: 'High Performer',
        potentialScore: 'High',
        competencyScores: {
            guest_relations: 5.0,
            pms_systems: 4.6,
            de_escalation: 4.8,
            shift_leadership: 3.8,
            haccp_safety: 4.0,
            revenue_upsell: 4.5
        },
        targetRoleAllocations: [
            {
                roleId: 'role-fo-mgr',
                computedReadinessPercent: 88,
                matchStatus: 'Strong Match',
                hrReadinessFlag: 'Ready in 1–2 years',
                hrNotes: 'Strong guest relations skills. Needs additional shift scheduling and PMS audit exposure before taking full manager reins.',
                lastCalibrated: 'Aug 22, 2026'
            }
        ]
    },
    {
        id: 'emp-104',
        name: 'Chef Marco S.',
        role: 'Line Cook Lead',
        dept: 'Culinary',
        avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80',
        closedPerformanceRating: 4.5,
        performanceLabel: 'Meets Standards (4.5 / 5.0)',
        nineBoxGridCategory: 'Core Performer',
        potentialScore: 'Medium',
        competencyScores: {
            haccp_safety: 4.8,
            culinary_technique: 4.9,
            kitchen_costing: 4.0,
            shift_leadership: 3.9
        },
        targetRoleAllocations: [
            {
                roleId: 'role-exec-sous',
                computedReadinessPercent: 86,
                matchStatus: 'Good Match',
                hrReadinessFlag: 'Ready in 1–2 years',
                hrNotes: 'Exceptional kitchen technique. Enrolled in F&B Costing and Inventory Leadership module.',
                lastCalibrated: 'Aug 15, 2026'
            }
        ]
    },
    {
        id: 'emp-106',
        name: 'David Lee',
        role: 'F&B Server Lead',
        dept: 'F&B Service',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        closedPerformanceRating: 4.2,
        performanceLabel: 'Solid Contributor (4.2 / 5.0)',
        nineBoxGridCategory: 'Enigma / Growth',
        potentialScore: 'High',
        competencyScores: {
            revenue_upsell: 3.8,
            sommelier_standards: 4.0,
            guest_relations: 4.6,
            shift_leadership: 3.5
        },
        targetRoleAllocations: [
            {
                roleId: 'role-fb-mgr',
                computedReadinessPercent: 74,
                matchStatus: 'Emerging',
                hrReadinessFlag: 'Not Ready',
                hrNotes: 'Requires Sommelier Certification and Revenue Upselling workshop completion.',
                lastCalibrated: 'Aug 20, 2026'
            }
        ]
    }
];

let successionActiveDeptFilter = 'all';

// =========================================================================
// 2. INITIALIZATION & RENDERING
// =========================================================================

function initSuccessionPlanning() {
    renderSuccessionKPIs();
    renderSuccessionRecords();
    renderComputedReadinessMatrix();
    renderSuccession9BoxGrid();
}

function renderSuccessionKPIs() {
    const totalRoles = successionRolesState.length;
    const readyNowCount = successionCandidatesState.filter(c => 
        c.targetRoleAllocations.some(a => a.hrReadinessFlag === 'Ready Now')
    ).length;
    const pipelineCount = successionCandidatesState.filter(c => 
        c.targetRoleAllocations.some(a => a.hrReadinessFlag === 'Ready in 1–2 years')
    ).length;

    const elTotal = document.getElementById('stat-succession-roles');
    const elReadyNow = document.getElementById('stat-succession-readynow');
    const elPipeline = document.getElementById('stat-succession-pipeline');

    if (elTotal) elTotal.textContent = totalRoles;
    if (elReadyNow) elReadyNow.textContent = readyNowCount;
    if (elPipeline) elPipeline.textContent = pipelineCount;
}

function setSuccessionDeptFilter(dept) {
    successionActiveDeptFilter = dept;
    document.querySelectorAll('.succession-dept-chip').forEach(btn => {
        if (btn.dataset.dept === dept) {
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('bg-[#FAF8F7]', 'text-slate-600');
        } else {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-[#FAF8F7]', 'text-slate-600');
        }
    });
    renderSuccessionRecords();
    renderComputedReadinessMatrix();
}

// =========================================================================
// 3. STEP 5: SUCCESSION RECORDS (Tied to Dept & Target Role)
// =========================================================================

function renderSuccessionRecords() {
    const container = document.getElementById('succession-records-grid');
    if (!container) return;

    let filteredRoles = successionRolesState;
    if (successionActiveDeptFilter !== 'all') {
        filteredRoles = successionRolesState.filter(r => r.dept.toLowerCase().includes(successionActiveDeptFilter.toLowerCase()));
    }

    container.innerHTML = filteredRoles.map(role => {
        const primaryCandidate = successionCandidatesState.find(c => c.id === role.primarySuccessorId);
        const primaryAlloc = primaryCandidate?.targetRoleAllocations.find(a => a.roleId === role.id);
        const backupCandidate = successionCandidatesState.find(c => c.id === role.emergencyBackupId);

        const flagBadge = primaryAlloc?.hrReadinessFlag === 'Ready Now'
            ? `<span class="badge-sage"><i class="fas fa-check-circle mr-1"></i> Ready Now</span>`
            : primaryAlloc?.hrReadinessFlag === 'Ready in 1–2 years'
            ? `<span class="badge-gold"><i class="fas fa-hourglass-half mr-1"></i> Ready in 1–2 Years</span>`
            : `<span class="badge-terracotta"><i class="fas fa-clock mr-1"></i> Not Ready</span>`;

        return `
            <div class="card-clean p-5 hover:shadow-lg transition flex flex-col justify-between space-y-4 border border-[#E8DEDC] bg-white">
                <div class="space-y-3">
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <span class="badge-dusty text-[10px]">${role.dept}</span>
                            <h4 class="font-heading font-bold text-base text-slate-900 mt-1">${role.title}</h4>
                        </div>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                            ${role.benchStrength}
                        </span>
                    </div>

                    <!-- Incumbent Card -->
                    <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-1 text-xs">
                        <div class="flex justify-between items-center">
                            <span class="text-slate-400 text-[10px] font-bold uppercase">Current Incumbent:</span>
                            <span class="font-bold text-slate-900">${role.incumbentName}</span>
                        </div>
                        <div class="flex justify-between items-center text-[11px] text-slate-500">
                            <span>Planned Horizon: <strong>${role.plannedTransition}</strong></span>
                            <span>Risk: <strong class="${role.riskOfLoss.includes('High') ? 'text-red-600' : 'text-slate-700'}">${role.riskOfLoss}</strong></span>
                        </div>
                    </div>

                    <!-- Primary Successor Strip -->
                    <div class="space-y-1 text-xs">
                        <span class="text-slate-400 block text-[10px] font-bold uppercase">Designated Primary Successor:</span>
                        ${primaryCandidate ? `
                            <div class="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between gap-2">
                                <div class="flex items-center space-x-2.5">
                                    <img src="${primaryCandidate.avatar}" alt="${primaryCandidate.name}" class="w-8 h-8 rounded-full object-cover border border-[#E8DEDC]">
                                    <div>
                                        <span class="font-bold text-slate-900 block">${primaryCandidate.name}</span>
                                        <span class="text-[10px] text-slate-500">${primaryCandidate.role}</span>
                                    </div>
                                </div>
                                <div class="text-right">
                                    ${flagBadge}
                                    <span class="block text-[10px] font-bold text-primary mt-0.5">${primaryAlloc?.computedReadinessPercent}% Computed Match</span>
                                </div>
                            </div>
                        ` : `
                            <div class="p-3 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">No primary successor assigned</div>
                        `}
                    </div>

                    ${backupCandidate ? `
                        <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
                            <span>Emergency Backup: <strong>${backupCandidate.name}</strong></span>
                            <span class="badge-dusty text-[10px]">Ready in 1-2 yrs</span>
                        </div>
                    ` : ''}
                </div>

                <div class="pt-3 border-t border-[#E8DEDC] flex items-center justify-between text-xs">
                    <span class="text-[11px] text-slate-500"><i class="fas fa-chart-line mr-1 text-primary"></i> Min Perf: ${role.minPerformanceRating}</span>
                    <button onclick="openCalibrateRoleModal('${role.id}')" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1">
                        <i class="fas fa-sliders"></i>
                        <span>Calibrate Bench &rarr;</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// =========================================================================
// 4. STEPS 1-4: READINESS MATRIX (Employee × Target Role)
// =========================================================================

function renderComputedReadinessMatrix() {
    const tbody = document.getElementById('succession-matrix-tbody');
    if (!tbody) return;

    let rows = [];

    successionCandidatesState.forEach(cand => {
        if (successionActiveDeptFilter !== 'all' && !cand.dept.toLowerCase().includes(successionActiveDeptFilter.toLowerCase())) {
            return;
        }

        cand.targetRoleAllocations.forEach(alloc => {
            const role = successionRolesState.find(r => r.id === alloc.roleId);
            if (!role) return;

            rows.push({
                candidate: cand,
                allocation: alloc,
                role: role
            });
        });
    });

    tbody.innerHTML = rows.map(item => {
        const { candidate, allocation, role } = item;

        const isReadyNow = allocation.hrReadinessFlag === 'Ready Now';
        const isReady1_2 = allocation.hrReadinessFlag === 'Ready in 1–2 years';
        const isNotReady = allocation.hrReadinessFlag === 'Not Ready';

        return `
            <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
                <!-- 1. Employee Candidate -->
                <td class="px-5 py-3.5">
                    <div class="flex items-center space-x-3">
                        <img src="${candidate.avatar}" alt="${candidate.name}" class="w-8 h-8 rounded-full object-cover border border-[#E8DEDC]">
                        <div>
                            <span class="font-bold text-slate-900 block">${candidate.name}</span>
                            <span class="text-[11px] text-slate-500">${candidate.role} · ${candidate.dept}</span>
                        </div>
                    </div>
                </td>

                <!-- Target Leadership Role -->
                <td class="px-5 py-3.5 font-bold text-slate-800">
                    <div>${role.title}</div>
                    <div class="text-[10px] text-slate-400">Incumbent: ${role.incumbentName}</div>
                </td>

                <!-- Pulled Closed Performance Rating -->
                <td class="px-5 py-3.5">
                    <span class="font-bold text-primary">${candidate.closedPerformanceRating} / 5.0</span>
                    <span class="block text-[10px] text-slate-400">Closed Q3 Appraisal</span>
                </td>

                <!-- Pulled Competency Level Benchmark -->
                <td class="px-5 py-3.5">
                    <div class="space-y-0.5 text-[11px]">
                        <span class="font-semibold text-slate-700">De-escalation: <strong class="text-sage-dark">${candidate.competencyScores.de_escalation || 4.5}</strong></span>
                        <span class="block text-slate-500 text-[10px]">Guest Rel: <strong>${candidate.competencyScores.guest_relations || 4.8}</strong> · PMS: <strong>${candidate.competencyScores.pms_systems || 4.8}</strong></span>
                    </div>
                </td>

                <!-- 2. Computed Readiness Score -->
                <td class="px-5 py-3.5">
                    <div class="flex items-center space-x-2">
                        <span class="font-bold text-sm ${allocation.computedReadinessPercent >= 90 ? 'text-emerald-700' : 'text-slate-800'}">${allocation.computedReadinessPercent}%</span>
                        <div class="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div class="${allocation.computedReadinessPercent >= 90 ? 'bg-emerald-600' : 'bg-primary'} h-2" style="width: ${allocation.computedReadinessPercent}%"></div>
                        </div>
                    </div>
                    <span class="text-[10px] text-slate-400 font-semibold">${allocation.matchStatus}</span>
                </td>

                <!-- 3 & 4. HR-Only Manual Readiness Flag Selector -->
                <td class="px-5 py-3.5">
                    <div class="inline-flex rounded-xl p-1 bg-[#FAF8F7] border border-[#E8DEDC] space-x-1">
                        <button onclick="setHRReadinessFlag('${candidate.id}', '${role.id}', 'Ready Now')"
                            class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${isReadyNow ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">
                            Ready Now
                        </button>
                        <button onclick="setHRReadinessFlag('${candidate.id}', '${role.id}', 'Ready in 1–2 years')"
                            class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${isReady1_2 ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">
                            1–2 Yrs
                        </button>
                        <button onclick="setHRReadinessFlag('${candidate.id}', '${role.id}', 'Not Ready')"
                            class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${isNotReady ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">
                            Not Ready
                        </button>
                    </div>
                </td>

                <td class="px-5 py-3.5 text-right">
                    <button onclick="openCalibrationNotesModal('${candidate.id}', '${role.id}')" class="text-primary font-bold text-[11px] hover:underline">
                        Audit Note
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function setHRReadinessFlag(candidateId, roleId, newFlag) {
    const candidate = successionCandidatesState.find(c => c.id === candidateId);
    if (!candidate) return;

    const allocation = candidate.targetRoleAllocations.find(a => a.roleId === roleId);
    if (!allocation) return;

    allocation.hrReadinessFlag = newFlag;
    allocation.lastCalibrated = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    renderComputedReadinessMatrix();
    renderSuccessionRecords();
    renderSuccessionKPIs();
    renderSuccession9BoxGrid();

    showToast(`HR Readiness Flag updated: ${candidate.name} is marked as "${newFlag}"!`, 'success');
}

// =========================================================================
// 5. HOSPITALITY 9-BOX TALENT CALIBRATION GRID (3x3 MATRIX)
// =========================================================================

const nineBoxSampleRoster = [
    // High Potential Row (Y = High)
    { boxId: 7, boxName: 'Enigma / Rough Diamond', potential: 'High', perfTier: 'Developing (3.0-4.2)', color: 'terracotta', name: 'David Lee', role: 'F&B Server Lead', dept: 'F&B Service', score: '4.20', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', action: 'Sommelier & Wine Upselling IDP', readiness: 'Development Phase' },
    { boxId: 8, boxName: 'Growth Leader', potential: 'High', perfTier: 'Core/Meets (4.3-4.6)', color: 'gold', name: 'Carlos Gomez', role: 'Concierge Lead', dept: 'Front Office', score: '4.60', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', action: 'Duty Manager Shift Exposure', readiness: 'Ready in 1–2 Years' },
    { boxId: 9, boxName: '★ Star Talent (Ready Lead)', potential: 'High', perfTier: 'Exceeds (4.7-5.0)', color: 'primary', name: 'Maria Santos', role: 'Front Desk Host', dept: 'Front Office', score: '4.80', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', action: 'Successor: FO Assistant Manager', readiness: 'Ready Now (94%)' },

    // Medium Potential Row (Y = Medium)
    { boxId: 4, boxName: 'Dilemma / Inconsistent', potential: 'Medium', perfTier: 'Developing (3.0-4.2)', color: 'amber', name: 'Lucas Vargas', role: 'Junior Host', dept: 'Front Office', score: '3.90', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', action: '60-Day SOP 1-on-1 Mentoring', readiness: 'Coaching Plan' },
    { boxId: 5, boxName: 'Core Operations Anchor', potential: 'Medium', perfTier: 'Core/Meets (4.3-4.6)', color: 'dusty', name: 'Chef Marco S.', role: 'Line Cook Lead', dept: 'Culinary', score: '4.50', avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80', action: 'Kitchen Costing & Leadership IDP', readiness: 'Ready in 1–2 Years' },
    { boxId: 6, boxName: 'High Performer / Specialist', potential: 'Medium', perfTier: 'Exceeds (4.7-5.0)', color: 'emerald', name: 'Pierre Dubois', role: 'Master Sommelier', dept: 'F&B Service', score: '4.90', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', action: 'Lead Hotel Wine Masterclasses', readiness: 'Domain Specialist' },

    // Low Potential Row (Y = Low / Content)
    { boxId: 1, boxName: 'Risk / Action Required', potential: 'Low', perfTier: 'Developing (1.0-2.9)', color: 'rose', name: 'Trainee Steward', role: 'Kitchen Steward', dept: 'Culinary', score: '2.80', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', action: '30-Day Sanitation PIP', readiness: 'Action Plan' },
    { boxId: 2, boxName: 'Solid Specialist / Pro', potential: 'Low', perfTier: 'Core/Meets (3.0-4.4)', color: 'slate', name: 'Chloe Dupont', role: 'Bistro Hostess', dept: 'F&B Service', score: '4.15', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', action: 'Refresher Customer Etiquette', readiness: 'Stable Operations' },
    { boxId: 3, boxName: 'Trusted Craft Master', potential: 'Low', perfTier: 'Exceeds (4.5-5.0)', color: 'sage', name: 'Rosa Flores', role: 'Floor Supervisor', dept: 'Housekeeping', score: '4.65', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', action: 'Hygiene & Cleanliness Auditor', readiness: 'Subject Expert' }
];

function renderSuccession9BoxGrid() {
    const gridContainer = document.getElementById('nine-box-grid-container');
    if (!gridContainer) return;

    gridContainer.innerHTML = `
        <div class="space-y-4">
            <!-- 9-Box Header Calibration Legend -->
            <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                    <span class="font-bold text-slate-900 text-sm block">Hospitality 9-Box Talent Calibration Matrix</span>
                    <span class="text-slate-500 text-[11px]">Calibrating Closed Performance (X-Axis) vs. Leadership Potential (Y-Axis) for bench mobility</span>
                </div>
                <div class="flex items-center space-x-3 text-[11px] font-semibold">
                    <span class="flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-primary mr-1.5"></span> Star Track</span>
                    <span class="flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-emerald-600 mr-1.5"></span> High Performer</span>
                    <span class="flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-amber-600 mr-1.5"></span> Core Anchor</span>
                    <span class="flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-rose-600 mr-1.5"></span> PIP / Risk</span>
                </div>
            </div>

            <!-- 3x3 Visual Matrix Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                ${nineBoxSampleRoster.map(item => {
                    const isStar = item.boxId === 9;
                    const cardBorder = isStar ? 'border-2 border-primary/40 bg-primary-50/20 shadow-md ring-1 ring-primary/20' : 'border border-[#E8DEDC] bg-white';

                    return `
                        <div class="card-clean p-4 transition hover:shadow-md ${cardBorder} flex flex-col justify-between space-y-3">
                            <div class="space-y-2">
                                <div class="flex items-start justify-between gap-2">
                                    <span class="text-[10px] font-mono font-bold text-slate-400">BOX ${item.boxId}</span>
                                    <span class="badge-${item.color} text-[10px] font-bold">${item.potential} Potential</span>
                                </div>
                                <div>
                                    <h4 class="font-heading font-bold text-xs ${isStar ? 'text-primary' : 'text-slate-900'}">${item.boxName}</h4>
                                    <span class="text-[10px] text-slate-400 font-medium">Perf: ${item.perfTier}</span>
                                </div>

                                <!-- Associate Card -->
                                <div class="p-2.5 rounded-xl bg-[#FAF8F7] border border-[#E8DEDC] flex items-center space-x-2.5">
                                    <img src="${item.avatar}" alt="${item.name}" class="w-8 h-8 rounded-full object-cover border border-[#E8DEDC]">
                                    <div class="min-w-0 flex-1">
                                        <div class="flex justify-between items-baseline">
                                            <span class="font-bold text-slate-900 text-xs truncate">${item.name}</span>
                                            <span class="font-bold text-primary text-[11px]">${item.score}</span>
                                        </div>
                                        <span class="text-[10px] text-slate-500 block truncate">${item.role} · ${item.dept}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-2 border-t border-[#E8DEDC] space-y-1">
                                <div class="flex justify-between items-center text-[10px]">
                                    <span class="text-slate-400 font-semibold uppercase">Action:</span>
                                    <span class="font-bold text-slate-800 truncate">${item.action}</span>
                                </div>
                                <div class="flex justify-between items-center text-[10px]">
                                    <span class="text-slate-400 font-semibold uppercase">Mobility:</span>
                                    <span class="font-bold ${isStar ? 'text-emerald-700' : 'text-slate-700'}">${item.readiness}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Matrix Axis Footnote -->
            <div class="p-3 bg-white rounded-xl border border-[#E8DEDC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                <span><strong>X-Axis (Performance):</strong> Developing (&lt;4.3) &rarr; Core (4.3–4.6) &rarr; Exceeds (4.7–5.0)</span>
                <span><strong>Y-Axis (Potential):</strong> Low (Current Role) &rarr; Medium (1 Level) &rarr; High (Multi-Level Lead)</span>
            </div>
        </div>
    `;
}

function openCalibrateRoleModal(roleId) {
    showToast('Opening Succession Bench Calibration console...', 'info');
    switchSubTab('succession', 'matrix');
}

function openCalibrationNotesModal(candidateId, roleId) {
    const candidate = successionCandidatesState.find(c => c.id === candidateId);
    const alloc = candidate?.targetRoleAllocations.find(a => a.roleId === roleId);
    if (alloc) {
        showToast(`Audit Notes for ${candidate.name}: "${alloc.hrNotes}"`, 'info');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSuccessionPlanning();
});
