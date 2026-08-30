/**
 * Oxford Suites, Makati - Succession Planning & Talent Pipeline Engine
 * 
 * Process Flow:
 * 1. Pull closed performance ratings + evaluated competency levels from Supabase
 * 2. Compute readiness matrix against target role (Employee × Target Role)
 * 3. HR reviews computed matrix and bench calibration
 * 4. HR manually sets formal readiness flag (Ready Now / Ready in 1–2 Years / Not Ready)
 * 5. Update succession records and dynamic 9-box talent matrix in Supabase
 */

let successionRolesState = [];
let successionCandidatesState = [];
let nineBoxRosterState = [];
let successionEmployeesState = [];
let successionRecommendationsState = [];
let successionActiveDeptFilter = 'all';

// =========================================================================
// 1. INITIALIZATION & DATA SYNC
// =========================================================================

async function initSuccessionPlanning() {
    try {
        showSuccessionLoadingState();
        const res = await fetch('api/succession.php?action=get_overview');
        const payload = await res.json();
        
        if (payload.success && payload.data) {
            successionRolesState = payload.data.positions || [];
            successionCandidatesState = payload.data.candidates || [];
            nineBoxRosterState = payload.data.nineBoxRoster || [];
            successionEmployeesState = payload.data.employees || [];
            successionRecommendationsState = payload.data.recommendations || [];
            
            populateSuccessionEmployeeDropdowns();
            updateSuccessionModalRecommendations();
        }
    } catch (e) {
        console.warn('Network error fetching succession data, using cached state:', e);
    }

    renderSuccessionKPIs();
    renderSuccessionRecords();
    renderComputedReadinessMatrix();
    renderSuccession9BoxGrid();

    // 2. Supabase Realtime Subscription for Succession Recalculations
    if (window.supabase && !window.successionRealtimeInitialized) {
        window.successionRealtimeInitialized = true; // prevent duplicate listeners if init is called again
        
        const channel = window.supabase.channel('public:succession_recalc');
        
        // Listen to changes in Performance Appraisals that might close a cycle
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'performance_evaluations' }, (payload) => {
            console.log('Realtime: Performance Evaluation change detected -> syncing succession bench');
            syncSuccessionBackground();
        });
        
        // Listen to changes in Competency/Training that alter readiness index
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'competency_assessments' }, (payload) => {
            console.log('Realtime: Competency score change detected -> syncing succession bench');
            syncSuccessionBackground();
        });

        // Listen directly to succession records changes (HR flags updated)
        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'succession_candidates' }, (payload) => {
            console.log('Realtime: Succession Candidate change detected -> syncing succession bench');
            syncSuccessionBackground();
        });

        channel.subscribe();
    }
}

async function syncSuccessionBackground() {
    try {
        showSuccessionLoadingState();
        const res = await fetch('api/succession.php?action=get_overview');
        const payload = await res.json();
        if (payload.success && payload.data) {
            successionRolesState = payload.data.positions || [];
            successionCandidatesState = payload.data.candidates || [];
            nineBoxRosterState = payload.data.nineBoxRoster || [];
            successionEmployeesState = payload.data.employees || [];
            
            populateSuccessionEmployeeDropdowns();
            renderSuccessionKPIs();
            renderSuccessionRecords();
            renderComputedReadinessMatrix();
            renderSuccession9BoxGrid();
            
            if (typeof window.showToast === 'function') {
                window.showToast('Succession metrics automatically updated based on new performance/training data.', 'info');
            }
        }
    } catch (e) {
        console.warn('Failed background sync for succession data:', e);
    }
}

function showSuccessionLoadingState() {
    const recordsGrid = document.getElementById('succession-records-grid');
    const tableBody = document.getElementById('succession-readiness-tbody');

    const loaderHTML = `
        <div class="col-span-full py-12 flex flex-col items-center justify-center space-y-3 bg-white/50 rounded-2xl border border-[#E8DEDC] border-dashed">
            <i class="fas fa-circle-notch fa-spin text-primary text-3xl"></i>
            <div class="text-slate-500 font-medium text-xs">Recalculating pipeline bench readiness...</div>
        </div>
    `;

    if (recordsGrid) recordsGrid.innerHTML = loaderHTML;
    if (tableBody) tableBody.innerHTML = `<tr><td colspan="7" class="p-0">${loaderHTML}</td></tr>`;
}

function populateSuccessionEmployeeDropdowns() {
    const incumbentSelect = document.getElementById('succ-role-incumbent');
    const primarySelect = document.getElementById('succ-role-primary-successor');
    const backupSelect = document.getElementById('succ-role-backup-successor');

    const optionsHtml = successionEmployeesState.map(e => `
        <option value="${e.id}" data-name="${e.full_name || e.name}">
            ${e.full_name || e.name} (${e.title || e.role || 'Staff'} · ${e.department || 'Hotel'})
        </option>
    `).join('');

    if (incumbentSelect) {
        incumbentSelect.innerHTML = '<option value="">-- Select Current Incumbent --</option>' + optionsHtml;
    }

    if (primarySelect) {
        primarySelect.innerHTML = '<option value="">-- Select Primary Successor --</option>' + optionsHtml;
    }

    if (backupSelect) {
        backupSelect.innerHTML = '<option value="">-- Optional Emergency Backup --</option>' + optionsHtml;
    }

    updateSuccessionModalRecommendations();
}

function updateSuccessionModalRecommendations() {
    const listContainer = document.getElementById('succ-role-xp-recommendations-list');
    if (!listContainer) return;

    const deptSelect = document.getElementById('succ-role-dept');
    const selectedDept = (deptSelect?.value || 'Front Office').toLowerCase().trim();

    let recs = successionRecommendationsState.filter(r => {
        const d = (r.department || '').toLowerCase();
        return d.includes(selectedDept) || selectedDept.includes(d);
    });

    if (recs.length === 0) {
        recs = successionRecommendationsState.slice(0, 3);
    }

    if (recs.length === 0) {
        listContainer.innerHTML = `
            <div class="text-slate-400 text-xs italic py-2 text-center bg-white/60 rounded-xl border border-dashed border-slate-200">
                No active associates with XP ledger entries found in this department yet.
            </div>
        `;
        return;
    }

    listContainer.innerHTML = recs.slice(0, 3).map((rec, idx) => `
        <div class="p-2.5 rounded-xl bg-white border border-primary/20 flex items-center justify-between gap-2 shadow-2xs">
            <div class="flex items-center space-x-2.5 min-w-0">
                <div class="w-6 h-6 rounded-full ${idx === 0 ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'} font-black text-[10px] flex items-center justify-center flex-shrink-0">
                    #${idx + 1}
                </div>
                <img src="${rec.avatar}" alt="" class="w-8 h-8 rounded-full object-cover border border-[#E8DEDC] flex-shrink-0">
                <div class="min-w-0">
                    <div class="flex items-center space-x-1.5">
                        <span class="font-bold text-slate-900 text-xs truncate">${rec.name}</span>
                        <span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                            <i class="fas fa-bolt mr-0.5"></i> ${rec.totalXP} XP
                        </span>
                    </div>
                    <span class="text-[10px] text-slate-500 block truncate">${rec.role} · <strong class="text-emerald-700">${rec.computedReadinessPercent}% Fit</strong></span>
                </div>
            </div>
            <div class="flex items-center space-x-1 flex-shrink-0">
                <button type="button" onclick="selectRecommendedSuccessor('${rec.employeeId}', 'primary')" class="px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-[10px] transition">
                    + Primary
                </button>
                <button type="button" onclick="selectRecommendedSuccessor('${rec.employeeId}', 'backup')" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition">
                    + Backup
                </button>
            </div>
        </div>
    `).join('');
}

function selectRecommendedSuccessor(empId, roleType) {
    const selectId = roleType === 'primary' ? 'succ-role-primary-successor' : 'succ-role-backup-successor';
    const selectEl = document.getElementById(selectId);
    if (selectEl) {
        selectEl.value = empId;
        const opt = selectEl.options[selectEl.selectedIndex];
        const name = opt?.getAttribute('data-name') || 'Candidate';
        if (typeof showToast === 'function') {
            showToast(`Selected ${name} as ${roleType === 'primary' ? 'Primary Successor' : 'Emergency Backup'}!`, 'info');
        }
    }
}

// =========================================================================
// 2. TOP KPI COUNTERS
// =========================================================================

function renderSuccessionKPIs() {
    const totalRoles = successionRolesState.length;
    let readyNowCount = 0;
    let pipelineCount = 0;

    successionCandidatesState.forEach(c => {
        const flag = c.hrReadinessFlag;
        if (flag === 'Ready Now') {
            readyNowCount++;
        } else if (flag === 'Ready in 1–2 years' || flag === 'Ready in 1-2 Years') {
            pipelineCount++;
        }
    });

    const elTotal = document.getElementById('stat-succession-roles');
    const elReadyNow = document.getElementById('stat-succession-readynow');
    const elPipeline = document.getElementById('stat-succession-pipeline');

    if (elTotal) elTotal.textContent = totalRoles;
    if (elReadyNow) elReadyNow.textContent = readyNowCount;
    if (elPipeline) elPipeline.textContent = pipelineCount;
}

// =========================================================================
// 3. DEPARTMENT FILTERING
// =========================================================================

function setSuccessionDeptFilter(dept) {
    successionActiveDeptFilter = dept.toLowerCase().trim();
    
    document.querySelectorAll('.succession-dept-chip').forEach(btn => {
        const bDept = (btn.dataset.dept || '').toLowerCase().trim();
        if (bDept === successionActiveDeptFilter) {
            btn.className = 'succession-dept-chip px-3 py-1 rounded-full font-bold bg-primary text-white text-[11px] whitespace-nowrap shadow-xs';
        } else {
            btn.className = 'succession-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap transition';
        }
    });

    renderSuccessionRecords();
    renderComputedReadinessMatrix();
    renderSuccession9BoxGrid();
}

// =========================================================================
// 4. SUB-PANEL 1: SUCCESSION RECORDS (Dept × Target Role)
// =========================================================================

function renderSuccessionRecords() {
    const container = document.getElementById('succession-records-grid');
    if (!container) return;

    let filteredRoles = successionRolesState;
    if (successionActiveDeptFilter !== 'all') {
        filteredRoles = successionRolesState.filter(r => {
            const d = (r.dept || '').toLowerCase();
            return d.includes(successionActiveDeptFilter) || successionActiveDeptFilter.includes(d);
        });
    }

    if (filteredRoles.length === 0) {
        container.innerHTML = `
            <div class="col-span-full p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                <i class="fas fa-sitemap text-3xl text-slate-300 mb-2 block"></i>
                No leadership succession positions found for the selected department filter.
            </div>
        `;
        return;
    }

    container.innerHTML = filteredRoles.map(role => {
        // Find assigned primary successor candidate
        const primaryCandidate = successionCandidatesState.find(c => 
            (role.primarySuccessorId && (c.id === role.primarySuccessorId || c.employeeId === role.primarySuccessorId)) || 
            (c.positionId === role.id && (c.isPrimary || c.primary))
        ) || (role.primarySuccessor ? {
            id: 'cand-' + role.id,
            employeeId: role.primarySuccessor.id,
            name: role.primarySuccessor.full_name || role.primarySuccessor.name,
            role: role.primarySuccessor.title || role.primarySuccessor.role,
            avatar: role.primarySuccessor.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            computedReadinessPercent: role.primarySuccessor.computedReadinessPercent || 0,
            hrReadinessFlag: role.primarySuccessor.hrReadinessFlag || 'Pending Calibration'
        } : null);

        const primaryAlloc = primaryCandidate?.targetRoleAllocations?.find(a => a.roleId === role.id) || primaryCandidate?.targetRoleAllocations?.[0];
        const flag = primaryAlloc?.hrReadinessFlag || primaryCandidate?.hrReadinessFlag || 'Pending Calibration';
        
        const flagBadge = flag === 'Ready Now'
            ? `<span class="badge-sage"><i class="fas fa-check-circle mr-1"></i> Ready Now</span>`
            : (flag === 'Ready in 1–2 years' || flag === 'Ready in 1-2 Years')
            ? `<span class="badge-gold"><i class="fas fa-hourglass-half mr-1"></i> Ready in 1–2 Years</span>`
            : flag === 'Not Ready' 
            ? `<span class="badge-terracotta"><i class="fas fa-clock mr-1"></i> Not Ready</span>`
            : `<span class="badge-dusty"><i class="fas fa-hourglass-start mr-1"></i> Pending Calibration</span>`;

        const backupCandidate = successionCandidatesState.find(c => 
            (role.emergencyBackupId && (c.id === role.emergencyBackupId || c.employeeId === role.emergencyBackupId))
        ) || (role.emergencyBackup ? {
            name: role.emergencyBackup.full_name || role.emergencyBackup.name,
            role: role.emergencyBackup.title || role.emergencyBackup.role
        } : null);

        const matchPct = primaryAlloc?.computedReadinessPercent ?? primaryCandidate?.computedReadinessPercent ?? 0;

        const deptClean = (role.dept || '').toLowerCase().trim();
        const deptRecs = successionRecommendationsState.filter(r => {
            const d = (r.department || '').toLowerCase().trim();
            return (d.includes(deptClean) || deptClean.includes(d)) && r.employeeId !== role.primarySuccessorId && r.employeeId !== role.emergencyBackupId;
        });

        return `
            <div class="card-clean p-5 hover:shadow-lg transition flex flex-col justify-between space-y-4 border border-[#E8DEDC] bg-white">
                <div class="space-y-3">
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <span class="badge-dusty text-[10px]">${role.dept}</span>
                            <h4 class="font-heading font-bold text-base text-slate-900 mt-1">${role.title}</h4>
                        </div>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                            ${role.benchStrength || 'Pipeline Active'}
                        </span>
                    </div>

                    <!-- Incumbent Card -->
                    <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-1 text-xs">
                        <div class="flex justify-between items-center">
                            <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Current Incumbent:</span>
                            <span class="font-bold text-slate-900">${role.incumbentName}</span>
                        </div>
                        <div class="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                            <span>Planned Horizon: <strong class="text-slate-700">${role.plannedTransition}</strong></span>
                            <span>Risk: <strong class="${(role.riskOfLoss || '').includes('High') ? 'text-red-600' : 'text-slate-700'}">${role.riskOfLoss}</strong></span>
                        </div>
                    </div>

                    <!-- Primary Successor Strip -->
                    <div class="space-y-1 text-xs">
                        <span class="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Designated Primary Successor:</span>
                        ${primaryCandidate ? `
                            <div class="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between gap-2">
                                <div class="flex items-center space-x-2.5">
                                    <img src="${primaryCandidate.avatar}" alt="" class="w-9 h-9 rounded-full object-cover border border-[#E8DEDC] shadow-2xs">
                                    <div>
                                        <span class="font-bold text-slate-900 block">${primaryCandidate.name}</span>
                                        <span class="text-[10px] text-slate-500">${primaryCandidate.role}</span>
                                    </div>
                                </div>
                                <div class="text-right">
                                    ${flagBadge}
                                    <span class="block text-[10px] font-bold text-primary mt-0.5">${matchPct}% Computed Fit</span>
                                </div>
                            </div>
                        ` : `
                            <div class="p-3 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">No primary successor assigned yet</div>
                        `}
                    </div>

                    ${backupCandidate ? `
                        <div class="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                            <span>Emergency Backup: <strong class="text-slate-700">${backupCandidate.name}</strong></span>
                            <span class="badge-dusty text-[10px]">Pipeline Developing</span>
                        </div>
                    ` : ''}

                    <!-- System Talent Recommendations Box (XP-Ledger Powered) -->
                    ${(!primaryCandidate || !backupCandidate || deptRecs.length > 0) ? `
                        <div class="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-amber-900 text-[11px] flex items-center">
                                    <i class="fas fa-sparkles text-gold mr-1.5"></i>
                                    <span>XP-Ledger Top Talent Replacements</span>
                                </span>
                                <span class="text-[10px] text-amber-700 font-semibold">${role.dept}</span>
                            </div>
                            <div class="space-y-1.5">
                                ${deptRecs.length > 0 ? deptRecs.slice(0, 2).map(r => `
                                    <div class="p-2 rounded-lg bg-white border border-[#E8DEDC] flex items-center justify-between gap-2 shadow-2xs">
                                        <div class="flex items-center space-x-2 min-w-0">
                                            <img src="${r.avatar}" alt="" class="w-7 h-7 rounded-full object-cover border border-[#E8DEDC]">
                                            <div class="min-w-0">
                                                <div class="flex items-center space-x-1.5">
                                                    <span class="font-bold text-slate-900 text-xs truncate">${r.name}</span>
                                                    <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                                                        <i class="fas fa-bolt mr-0.5"></i> ${r.totalXP} XP
                                                    </span>
                                                </div>
                                                <span class="text-[10px] text-slate-500 block truncate">${r.role} · <strong class="text-emerald-700">${r.computedReadinessPercent}% Fit</strong></span>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-1 flex-shrink-0">
                                            <button onclick="quickAssignSuccessor('${role.id}', '${r.employeeId}', 'primary')" class="px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-[10px] transition">
                                                + Primary
                                            </button>
                                            <button onclick="quickAssignSuccessor('${role.id}', '${r.employeeId}', 'backup')" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition">
                                                + Backup
                                            </button>
                                        </div>
                                    </div>
                                `).join('') : `
                                    <div class="text-slate-400 text-[10px] italic py-1 text-center">No other eligible department associates found.</div>
                                `}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="pt-3 border-t border-[#E8DEDC] flex items-center justify-between text-xs">
                    <span class="text-[11px] text-slate-500"><i class="fas fa-chart-line mr-1 text-primary"></i> Min Perf: <strong>${role.minPerformanceRating || 4.2}</strong></span>
                    <button onclick="openCalibrateFlagModal('${primaryCandidate?.id || ''}', '${role.id}')" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1 shadow-xs">
                        <i class="fas fa-sliders"></i>
                        <span>Calibrate Bench &rarr;</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// =========================================================================
// 5. SUB-PANEL 2: COMPUTED READINESS MATRIX (Employee × Role)
// =========================================================================

function renderComputedReadinessMatrix() {
    const tbody = document.getElementById('succession-matrix-tbody');
    if (!tbody) return;

    let candidates = successionCandidatesState;
    if (successionActiveDeptFilter !== 'all') {
        candidates = candidates.filter(c => {
            const d = (c.dept || '').toLowerCase();
            return d.includes(successionActiveDeptFilter) || successionActiveDeptFilter.includes(d);
        });
    }

    if (candidates.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="p-8 text-center text-slate-400 text-xs italic">
                    No succession candidate evaluations found for this department.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = candidates.map(candidate => {
        const role = successionRolesState.find(r => r.id === candidate.positionId) || successionRolesState[0] || {
            title: 'Leadership Position',
            incumbentName: 'Unassigned'
        };

        const flag = candidate.hrReadinessFlag || 'Pending Calibration';
        const isReadyNow = flag === 'Ready Now';
        const isReady1_2 = flag === 'Ready in 1–2 years' || flag === 'Ready in 1-2 Years';
        const isNotReady = flag === 'Not Ready';
        const isPending = flag === 'Pending Calibration';
        const fitPct = candidate.computedReadinessPercent || 90;

        return `
            <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
                <!-- 1. Employee Candidate -->
                <td class="px-5 py-3.5">
                    <div class="flex items-center space-x-3">
                        <img src="${candidate.avatar}" alt="${candidate.name}" class="w-8 h-8 rounded-full object-cover border border-[#E8DEDC]">
                        <div>
                            <span class="font-bold text-slate-900 block">${candidate.name}</span>
                            <span class="text-[11px] text-slate-500">${candidate.role} · <strong class="text-slate-700">${candidate.dept}</strong></span>
                        </div>
                    </div>
                </td>

                <!-- Target Leadership Role -->
                <td class="px-5 py-3.5 font-bold text-slate-800">
                    <div>${role.title}</div>
                    <div class="text-[10px] text-slate-400 font-normal">Incumbent: ${role.incumbentName}</div>
                </td>

                <!-- Pulled Closed Performance Rating -->
                <td class="px-5 py-3.5">
                    <span class="font-bold text-primary text-xs"><i class="fas fa-star text-amber-500 mr-0.5 text-[10px]"></i>${parseFloat(candidate.closedPerformanceRating).toFixed(2)} / 5.0</span>
                    <span class="block text-[10px] text-slate-400 font-medium">Calibrated Appraisal</span>
                </td>

                <!-- Pulled Competency Level Benchmark -->
                <td class="px-5 py-3.5">
                    <div class="space-y-0.5 text-[11px]">
                        <span class="font-semibold text-slate-700">Evaluated Avg: <strong class="text-sage-dark">${parseFloat(candidate.competencyAverage || 4.8).toFixed(2)} / 5.0</strong></span>
                        <span class="block text-slate-500 text-[10px]">Match: <strong>${candidate.competencyMatchPct || 95}% Benchmark Met</strong></span>
                    </div>
                </td>

                <!-- 2. Computed Fit % -->
                <td class="px-5 py-3.5">
                    <div class="flex items-center space-x-2">
                        <span class="font-bold text-xs ${fitPct >= 90 ? 'text-emerald-700' : 'text-slate-800'}">${fitPct}%</span>
                        <div class="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div class="${fitPct >= 90 ? 'bg-emerald-600' : 'bg-primary'} h-2 transition-all duration-500" style="width: ${fitPct}%"></div>
                        </div>
                    </div>
                    <span class="text-[10px] text-slate-400 font-semibold">${candidate.matchStatus || 'High Match'}</span>
                </td>

                <!-- 3 & 4. HR-Only Manual Readiness Flag Selector -->
                <td class="px-5 py-3.5">
                    <div class="inline-flex rounded-xl p-1 bg-[#FAF8F7] border border-[#E8DEDC] space-x-1">
                        <button onclick="setHRReadinessFlag('${candidate.id}', 'Ready Now')"
                            class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${isReadyNow ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">
                            Ready Now
                        </button>
                        <button onclick="setHRReadinessFlag('${candidate.id}', 'Ready in 1-2 Years')"
                            class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${isReady1_2 ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">
                            1–2 Yrs
                        </button>
                        <button onclick="setHRReadinessFlag('${candidate.id}', 'Not Ready')"
                            class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${isNotReady ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">
                            Not Ready
                        </button>
                        ${isPending ? `<span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-200 text-slate-500 ml-1 shadow-2xs">Pending</span>` : ''}
                    </div>
                </td>

                <!-- Action / Audit -->
                <td class="px-5 py-3.5 text-right">
                    <button onclick="openCalibrateFlagModal('${candidate.id}', '${role.id}')" class="text-primary font-bold text-[11px] hover:underline flex items-center justify-end space-x-1">
                        <i class="fas fa-sliders"></i>
                        <span>Calibrate</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// =========================================================================
// 6. QUICK CALIBRATE HR READINESS FLAG (Instant Sync to Supabase)
// =========================================================================

async function setHRReadinessFlag(candidateId, newFlag) {
    const candidate = successionCandidatesState.find(c => c.id === candidateId);
    if (candidate) {
        candidate.hrReadinessFlag = newFlag;
        if (candidate.targetRoleAllocations?.[0]) {
            candidate.targetRoleAllocations[0].hrReadinessFlag = newFlag;
        }
    }

    renderComputedReadinessMatrix();
    renderSuccessionRecords();
    renderSuccessionKPIs();
    renderSuccession9BoxGrid();

    try {
        const res = await fetch('api/succession.php?action=update_flag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                candidateId: candidateId,
                employeeId: candidate?.employeeId || candidateId,
                positionId: candidate?.positionId || '',
                hrReadinessFlag: newFlag,
                notes: candidate?.notes || 'Calibrated via HR Bench Matrix'
            })
        });
        const result = await res.json();
        if (result.success) {
            showToast(`HR Readiness Flag updated to "${newFlag}" & synced to Supabase!`, 'success');
        } else {
            showToast(result.message || 'Updated locally', 'info');
        }
    } catch (e) {
        showToast(`HR Readiness Flag updated locally`, 'info');
    }
}

// =========================================================================
// 7. CALIBRATION MODAL & AUDIT FORM
// =========================================================================

function openCalibrateFlagModal(candidateId, roleId) {
    const candidate = successionCandidatesState.find(c => c.id === candidateId || c.employeeId === candidateId) || successionCandidatesState[0];
    const role = successionRolesState.find(r => r.id === roleId) || successionRolesState[0];

    if (!candidate) {
        showToast('Candidate record not found for calibration', 'warning');
        return;
    }

    const candIdEl = document.getElementById('succ-flag-candidate-id');
    const candNameEl = document.getElementById('succ-flag-candidate-name');
    const targetRoleEl = document.getElementById('succ-flag-target-role');
    const selectEl = document.getElementById('succ-flag-readiness-select');
    const notesEl = document.getElementById('succ-flag-notes');

    if (candIdEl) candIdEl.value = candidate.id;
    if (candNameEl) candNameEl.textContent = candidate.name;
    if (targetRoleEl) targetRoleEl.textContent = role ? role.title : 'Leadership Position';
    if (selectEl) selectEl.value = candidate.hrReadinessFlag || 'Ready Now';
    if (notesEl) notesEl.value = candidate.notes || 'Demonstrated strong leadership and completed required training curriculum.';

    openModal('modal-calibrate-succession-flag');
}

async function submitHRFlagCalibration(event) {
    event.preventDefault();

    const candidateId = document.getElementById('succ-flag-candidate-id').value;
    const flag = document.getElementById('succ-flag-readiness-select').value;
    const notes = document.getElementById('succ-flag-notes').value;

    closeModal('modal-calibrate-succession-flag');

    const candidate = successionCandidatesState.find(c => c.id === candidateId);
    if (candidate) {
        candidate.hrReadinessFlag = flag;
        candidate.notes = notes;
        if (candidate.targetRoleAllocations?.[0]) {
            candidate.targetRoleAllocations[0].hrReadinessFlag = flag;
            candidate.targetRoleAllocations[0].hrNotes = notes;
        }
    }

    renderComputedReadinessMatrix();
    renderSuccessionRecords();
    renderSuccessionKPIs();
    renderSuccession9BoxGrid();

    try {
        const res = await fetch('api/succession.php?action=update_flag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                candidateId: candidateId,
                employeeId: candidate?.employeeId || candidateId,
                positionId: candidate?.positionId || '',
                hrReadinessFlag: flag,
                notes: notes
            })
        });
        const result = await res.json();
        if (result.success) {
            showToast(`Calibrated HR Flag for ${candidate?.name || 'Candidate'} to "${flag}"!`, 'success');
        } else {
            showToast(result.message || 'Saved locally', 'info');
        }
    } catch (e) {
        showToast('Calibration saved locally', 'info');
    }
}

// =========================================================================
// 8. ADD SUCCESSION ROLE MODAL & MUTATION
// =========================================================================

function openCreateSuccessionRoleModal() {
    populateSuccessionEmployeeDropdowns();
    openModal('modal-add-succession-role');
}

async function submitNewSuccessionPosition(event) {
    event.preventDefault();

    const title = document.getElementById('succ-role-title')?.value.trim();
    const dept = document.getElementById('succ-role-dept')?.value || 'Front Office';
    
    const incumbentSelect = document.getElementById('succ-role-incumbent');
    const selectedIncumbentOpt = incumbentSelect?.options[incumbentSelect.selectedIndex];
    const incumbentName = selectedIncumbentOpt?.getAttribute('data-name') || incumbentSelect?.value || 'Unassigned';
    const incumbentId = incumbentSelect?.value || null;

    const plannedTransition = document.getElementById('succ-role-transition')?.value || '1–2 Years (Mid-term)';
    const riskOfLoss = document.getElementById('succ-role-risk')?.value || 'Low';
    const primarySuccessorId = document.getElementById('succ-role-primary-successor')?.value || null;
    const emergencyBackupId = document.getElementById('succ-role-backup-successor')?.value || null;

    if (!title || !incumbentId) {
        showToast('Please specify the position title and select a current incumbent', 'error');
        return;
    }

    closeModal('modal-add-succession-role');

    const newRolePayload = {
        title,
        dept,
        incumbentName,
        plannedTransition,
        riskOfLoss,
        benchStrength: primarySuccessorId ? 'Pipeline Active' : 'Vacancy Risk',
        minPerformanceRating: 4.2,
        primarySuccessorId,
        emergencyBackupId,
        status: 'Bench Ready'
    };

    try {
        const res = await fetch('api/succession.php?action=create_position', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRolePayload)
        });
        const result = await res.json();
        
        if (result.success) {
            showToast(`New Succession Position "${title}" created & synced to Supabase!`, 'success');
            await initSuccessionPlanning();
        } else {
            showToast(result.message || 'Position added locally', 'info');
            successionRolesState.unshift(Object.assign({ id: 'role-' + Date.now() }, newRolePayload));
            renderSuccessionRecords();
            renderSuccessionKPIs();
        }
    } catch (e) {
        showToast(`Succession Role "${title}" added locally`, 'info');
        successionRolesState.unshift(Object.assign({ id: 'role-' + Date.now() }, newRolePayload));
        renderSuccessionRecords();
        renderSuccessionKPIs();
    }
}

// =========================================================================
let showAllCalibrationQuadrants = false;

function toggleCalibrationGridMode() {
    showAllCalibrationQuadrants = !showAllCalibrationQuadrants;
    renderSuccession9BoxGrid();
}

function renderSuccession9BoxGrid() {
    const gridContainer = document.getElementById('nine-box-grid-container');
    if (!gridContainer) return;

    const boxes = [
        { boxId: 7, boxName: 'Enigma / Rough Diamond', potential: 'High', perfTier: 'Developing (<4.3)', color: 'terracotta', items: [] },
        { boxId: 8, boxName: 'Growth Leader', potential: 'High', perfTier: 'Core/Meets (4.3-4.6)', color: 'gold', items: [] },
        { boxId: 9, boxName: '★ Star Talent (Ready Lead)', potential: 'High', perfTier: 'Exceeds (4.7-5.0)', color: 'primary', items: [] },
        { boxId: 4, boxName: 'Dilemma / Inconsistent', potential: 'Medium', perfTier: 'Developing (<4.3)', color: 'amber', items: [] },
        { boxId: 5, boxName: 'Core Operations Anchor', potential: 'Medium', perfTier: 'Core/Meets (4.3-4.6)', color: 'dusty', items: [] },
        { boxId: 6, boxName: 'High Performer / Specialist', potential: 'Medium', perfTier: 'Exceeds (4.7-5.0)', color: 'emerald', items: [] },
        { boxId: 1, boxName: 'Risk / Action Required', potential: 'Low', perfTier: 'Developing (<4.3)', color: 'rose', items: [] },
        { boxId: 2, boxName: 'Solid Specialist / Pro', potential: 'Low', perfTier: 'Core/Meets (4.3-4.6)', color: 'slate', items: [] },
        { boxId: 3, boxName: 'Trusted Craft Master', potential: 'Low', perfTier: 'Exceeds (4.7-5.0)', color: 'sage', items: [] }
    ];

    let candidates = successionCandidatesState;
    if (successionActiveDeptFilter !== 'all') {
        candidates = candidates.filter(c => {
            const d = (c.dept || '').toLowerCase();
            return d.includes(successionActiveDeptFilter) || successionActiveDeptFilter.includes(d);
        });
    }

    candidates.forEach(cand => {
        const perf = parseFloat(cand.closedPerformanceRating || 0.0);
        const compMatchPct = parseFloat(cand.competencyMatchPct || 0.0);
        
        let bIdx = 2; // Default Box 9
        if (compMatchPct >= 90) {
            if (perf >= 4.70) bIdx = 2; // Box 9
            else if (perf >= 4.30) bIdx = 1; // Box 8
            else bIdx = 0; // Box 7
        } else if (compMatchPct >= 75) {
            if (perf >= 4.70) bIdx = 5; // Box 6
            else if (perf >= 4.30) bIdx = 4; // Box 5
            else bIdx = 3; // Box 4
        } else {
            if (perf >= 4.70) bIdx = 8; // Box 3
            else if (perf >= 4.30) bIdx = 7; // Box 2
            else bIdx = 6; // Box 1
        }

        boxes[bIdx].items.push({
            name: cand.name,
            role: cand.role,
            dept: cand.dept,
            avatar: cand.avatar,
            score: perf.toFixed(2),
            action: cand.hrReadinessFlag === 'Ready Now' ? 'Primary Leadership Successor' : (cand.hrReadinessFlag === 'Not Ready' ? 'Performance Improvement Plan' : '1-on-1 Mentorship & IDP'),
            readiness: cand.hrReadinessFlag || 'Pending Calibration'
        });
    });

    const activeBoxes = boxes.filter(b => b.items && b.items.length > 0);
    const displayBoxes = showAllCalibrationQuadrants ? boxes : activeBoxes;
    const totalTalentCount = activeBoxes.reduce((acc, b) => acc + (b.items?.length || 0), 0);

    gridContainer.innerHTML = `
        <div class="space-y-4">
            <!-- Header Legend & Export Button -->
            <div class="card-clean p-4 bg-white rounded-2xl border border-[#E8DEDC] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs">
                <div>
                    <h4 class="font-heading font-bold text-slate-900 text-sm block">Talent Calibration Grid</h4>
                    <p class="text-slate-500 text-[11px] mt-0.5">Calibrating Performance Ratings (X-Axis) vs. Potential (Y-Axis) · <strong>${totalTalentCount} Active Candidates</strong></p>
                </div>
                
                <div class="flex flex-wrap items-center gap-3">
                    <button onclick="toggleCalibrationGridMode()" class="px-3 py-1.5 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] hover:bg-slate-100 font-bold text-slate-700 text-xs transition flex items-center space-x-1.5">
                        <i class="fas ${showAllCalibrationQuadrants ? 'fa-filter' : 'fa-grid-2'} text-primary"></i>
                        <span>${showAllCalibrationQuadrants ? 'Show Active Talent Only' : 'Show All 9 Quadrants'}</span>
                    </button>

                    <button onclick="exportNineBoxMatrix()" class="btn-secondary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5 shadow-2xs hover:border-primary/40 transition">
                        <i class="fas fa-file-arrow-down text-primary"></i>
                        <span>Export Calibration Grid</span>
                    </button>
                </div>
            </div>

            <!-- Active Talent Grid -->
            ${displayBoxes.length === 0 ? `
                <div class="card-clean p-12 text-center bg-white rounded-2xl border border-dashed border-[#E8DEDC] space-y-3">
                    <div class="w-12 h-12 rounded-full bg-[#FAF8F7] border border-[#E8DEDC] text-slate-400 flex items-center justify-center mx-auto">
                        <i class="fas fa-cubes-stacked text-xl text-slate-400"></i>
                    </div>
                    <h4 class="font-bold text-slate-800 text-sm">No Talent Currently in Calibration Grid</h4>
                    <p class="text-slate-500 text-xs">Assign successors or evaluate candidates to populate the Calibration Grid quadrants.</p>
                </div>
            ` : `
                <div class="grid grid-cols-1 ${displayBoxes.length > 2 ? 'md:grid-cols-3' : (displayBoxes.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1')} gap-4 text-xs">
                    ${displayBoxes.map(item => {
                        const isStar = item.boxId === 9;
                        const cardBorder = isStar ? 'border-2 border-primary/40 bg-primary-50/20 shadow-md ring-1 ring-primary/20' : 'border border-[#E8DEDC] bg-white';
                        const members = item.items || [];

                        return `
                            <div class="card-clean p-4 transition hover:shadow-md ${cardBorder} flex flex-col justify-between space-y-3">
                                <div class="space-y-2">
                                    <div class="flex items-start justify-between gap-2">
                                        <span class="text-[10px] font-mono font-bold text-slate-400">BOX ${item.boxId}</span>
                                        <span class="badge-${item.color} text-[10px] font-bold">${item.potential} Potential</span>
                                    </div>
                                    <div>
                                        <h4 class="font-heading font-bold text-xs ${isStar ? 'text-primary font-extrabold' : 'text-slate-900'}">${item.boxName}</h4>
                                        <span class="text-[10px] text-slate-400 font-medium">Perf: ${item.perfTier}</span>
                                    </div>

                                    <!-- Associate Cards inside this box -->
                                    <div class="space-y-1.5">
                                        ${members.length > 0 ? members.map(m => `
                                            <div class="p-2.5 rounded-xl bg-[#FAF8F7] border border-[#E8DEDC] flex items-center space-x-2.5">
                                                <img src="${m.avatar}" alt="" class="w-8 h-8 rounded-full object-cover border border-[#E8DEDC] shadow-2xs">
                                                <div class="min-w-0 flex-1">
                                                    <div class="flex justify-between items-baseline">
                                                        <span class="font-bold text-slate-900 text-xs truncate">${m.name}</span>
                                                        <span class="font-bold text-primary text-[11px]"><i class="fas fa-star text-amber-500 mr-0.5 text-[9px]"></i>${m.score}</span>
                                                    </div>
                                                    <span class="text-[10px] text-slate-500 block truncate">${m.role} · ${m.dept}</span>
                                                </div>
                                            </div>
                                        `).join('') : `
                                            <div class="p-4 text-center text-slate-400 text-[11px] italic bg-[#FAF8F7]/60 rounded-xl border border-dashed border-slate-200">
                                                No candidates currently in this quadrant
                                            </div>
                                        `}
                                    </div>
                                </div>

                                <div class="pt-2 border-t border-[#E8DEDC] space-y-1">
                                    <div class="flex justify-between items-center text-[10px]">
                                        <span class="text-slate-400 font-semibold uppercase">Bench Mobility:</span>
                                        <span class="font-bold ${isStar ? 'text-emerald-700' : 'text-slate-700'}">${members.length > 0 ? members[0].readiness : 'Pipeline'}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        </div>
    `;
}

// =========================================================================
// 10. EXPORT CALIBRATION GRID REPORT
// =========================================================================

function exportNineBoxMatrix() {
    let rows = [
        ['Candidate Name', 'Current Role', 'Department', 'Calibration Quadrant', 'Potential Level', 'Closed Performance Score', 'Benchmark Competency Avg', 'Computed Fit %', 'HR Readiness Flag', 'Mobility Action Plan']
    ];

    successionCandidatesState.forEach(cand => {
        const perf = parseFloat(cand.closedPerformanceRating || 0.0).toFixed(2);
        const comp = parseFloat(cand.competencyAverage || 0.0).toFixed(2);
        const fit = (cand.computedReadinessPercent || 0) + '%';
        const flag = cand.hrReadinessFlag || 'Pending Calibration';
        const boxCat = cand.nineBoxGridCategory || 'Developing';
        const action = flag === 'Ready Now' ? 'Primary Leadership Successor' : (flag === 'Not Ready' ? 'Performance Improvement Plan' : '1-on-1 Mentorship & IDP');

        rows.push([
            `"${cand.name}"`,
            `"${cand.role}"`,
            `"${cand.dept}"`,
            `"${boxCat}"`,
            `"Evaluated"`,
            `"${perf} / 5.0"`,
            `"${comp} / 5.0"`,
            `"${fit}"`,
            `"${flag}"`,
            `"${action}"`
        ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Oxford_Suites_Talent_Calibration_Grid_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Talent Calibration Grid exported successfully (CSV)!', 'success');
}

// =========================================================================
// 11. QUICK ASSIGN SUCCESSOR FROM RECOMMENDATION ENGINE
// =========================================================================

async function quickAssignSuccessor(positionId, employeeId, type = 'primary') {
    try {
        const res = await fetch('api/succession.php?action=assign_successor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ positionId, employeeId, type })
        });
        const result = await res.json();
        if (result.success) {
            showToast(`Assigned candidate as ${type === 'primary' ? 'Primary Successor' : 'Emergency Backup'} & synced to bench!`, 'success');
            await initSuccessionPlanning();
        } else {
            showToast(result.message || 'Assignment failed', 'error');
        }
    } catch (e) {
        showToast('Network error assigning successor', 'error');
    }
}

// =========================================================================
// 12. GLOBAL EXPORTS & EVENT LISTENERS
// =========================================================================

window.initSuccessionPlanning = initSuccessionPlanning;
window.setSuccessionDeptFilter = setSuccessionDeptFilter;
window.renderSuccessionRecords = renderSuccessionRecords;
window.renderComputedReadinessMatrix = renderComputedReadinessMatrix;
window.renderSuccession9BoxGrid = renderSuccession9BoxGrid;
window.exportNineBoxMatrix = exportNineBoxMatrix;
window.setHRReadinessFlag = setHRReadinessFlag;
window.openCalibrateFlagModal = openCalibrateFlagModal;
window.submitHRFlagCalibration = submitHRFlagCalibration;
window.openCreateSuccessionRoleModal = openCreateSuccessionRoleModal;
window.submitNewSuccessionRole = submitNewSuccessionPosition;
window.submitNewSuccessionPosition = submitNewSuccessionPosition;
window.updateSuccessionModalRecommendations = updateSuccessionModalRecommendations;
window.selectRecommendedSuccessor = selectRecommendedSuccessor;
window.quickAssignSuccessor = quickAssignSuccessor;
window.toggleCalibrationGridMode = toggleCalibrationGridMode;

document.addEventListener('DOMContentLoaded', () => {
    initSuccessionPlanning();
});
