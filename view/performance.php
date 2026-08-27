<!-- ======================================================== -->
                        <div id="panel-pillar-perf" class="pillar-panel space-y-6">

                            <!-- Top Sub-Navigation Pills (All 7 Lifecycle Stages) -->
                            <div
                                class="subnav-track flex items-center justify-between gap-2 p-1.5 overflow-x-auto custom-scrollbar">
                                <div class="flex items-center space-x-1.5 flex-nowrap">
                                    <button onclick="switchSubTab('perf', 'plan')"
                                        class="subnav-pill subnav-perf active whitespace-nowrap" data-sub="plan">
                                        <i class="fas fa-bullseye mr-1.5 text-primary"></i>
                                        <span>1. Planning</span>
                                    </button>
                                    <button onclick="switchSubTab('perf', 'approve')"
                                        class="subnav-pill subnav-perf whitespace-nowrap" data-sub="approve">
                                        <i class="fas fa-signature mr-1.5 text-gold-dark"></i>
                                        <span>2. Approval</span>
                                    </button>
                                    <button onclick="switchSubTab('perf', 'monitor')"
                                        class="subnav-pill subnav-perf whitespace-nowrap" data-sub="monitor">
                                        <i class="fas fa-stream mr-1.5 text-dusty-dark"></i>
                                        <span>3. Monitoring</span>
                                    </button>
                                    <button onclick="switchSubTab('perf', 'eval')"
                                        class="subnav-pill subnav-perf whitespace-nowrap" data-sub="eval">
                                        <i class="fas fa-star-half-stroke mr-1.5 text-primary"></i>
                                        <span>4. Evaluation</span>
                                    </button>
                                    <button onclick="switchSubTab('perf', 'review')"
                                        class="subnav-pill subnav-perf whitespace-nowrap" data-sub="review">
                                        <i class="fas fa-scale-balanced mr-1.5 text-dusty-dark"></i>
                                        <span>5. Review &amp; Calibration</span>
                                    </button>
                                    <button onclick="switchSubTab('perf', 'idp')"
                                        class="subnav-pill subnav-perf whitespace-nowrap" data-sub="idp">
                                        <i class="fas fa-route mr-1.5 text-sage-dark"></i>
                                        <span>6. Development Plan</span>
                                    </button>
                                    <button onclick="switchSubTab('perf', 'cycle')"
                                        class="subnav-pill subnav-perf whitespace-nowrap" data-sub="cycle">
                                        <i class="fas fa-rotate mr-1.5 text-sage-dark"></i>
                                        <span>7. Next Cycle</span>
                                    </button>
                                </div>
                                <button onclick="openModal('modal-create-goal')"
                                    class="btn-primary px-3.5 py-1.5 text-xs font-bold whitespace-nowrap ml-2 flex-shrink-0">
                                    <i class="fas fa-plus mr-1"></i>
                                    <span>Set Objective</span>
                                </button>
                            </div>

                            <!-- 7-Stage Continuous Cycle Interactive Stepper -->
                            <div class="card-clean p-4 overflow-x-auto custom-scrollbar bg-white">
                                <div class="min-w-[840px] flex items-center justify-between text-xs select-none">

                                    <div onclick="switchSubTab('perf', 'plan')"
                                        class="flex items-center space-x-2 cursor-pointer group perf-step-item" data-step-key="plan">
                                        <div
                                            class="perf-step-bubble w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-primary/20 shadow-xs group-hover:scale-110 transition">
                                            1</div>
                                        <div>
                                            <p
                                                class="perf-step-title font-bold text-primary text-[11px] group-hover:text-primary transition">
                                                1. Planning</p>
                                            <p class="perf-step-sub text-[9px] text-primary/70 font-medium">Goals & KPIs</p>
                                        </div>
                                    </div>
                                    <div class="perf-step-line flex-1 h-0.5 bg-slate-200 mx-2 transition-colors"></div>

                                    <div onclick="switchSubTab('perf', 'approve')"
                                        class="flex items-center space-x-2 cursor-pointer group perf-step-item" data-step-key="approve">
                                        <div
                                            class="perf-step-bubble w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold group-hover:bg-slate-200 transition">
                                            2</div>
                                        <div>
                                            <p
                                                class="perf-step-title font-medium text-slate-600 text-[11px] group-hover:text-slate-900 transition">
                                                2. Approval</p>
                                            <p class="perf-step-sub text-[9px] text-slate-400">Calibration</p>
                                        </div>
                                    </div>
                                    <div class="perf-step-line flex-1 h-0.5 bg-slate-200 mx-2 transition-colors"></div>

                                    <div onclick="switchSubTab('perf', 'monitor')"
                                        class="flex items-center space-x-2 cursor-pointer group perf-step-item" data-step-key="monitor">
                                        <div
                                            class="perf-step-bubble w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold group-hover:bg-slate-200 transition">
                                            3</div>
                                        <div>
                                            <p class="perf-step-title font-medium text-slate-600 text-[11px] group-hover:text-slate-900 transition">3. Monitoring</p>
                                            <p class="perf-step-sub text-[9px] text-slate-400">Continuous Log</p>
                                        </div>
                                    </div>
                                    <div class="perf-step-line flex-1 h-0.5 bg-slate-200 mx-2 transition-colors"></div>

                                    <div onclick="switchSubTab('perf', 'eval')"
                                        class="flex items-center space-x-2 cursor-pointer group perf-step-item" data-step-key="eval">
                                        <div
                                            class="perf-step-bubble w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold group-hover:bg-slate-200 transition">
                                            4</div>
                                        <div>
                                            <p
                                                class="perf-step-title font-medium text-slate-600 text-[11px] group-hover:text-slate-900 transition">
                                                4. Evaluation</p>
                                            <p class="perf-step-sub text-[9px] text-slate-400">Self & Super</p>
                                        </div>
                                    </div>
                                    <div class="perf-step-line flex-1 h-0.5 bg-slate-200 mx-2 transition-colors"></div>

                                    <div onclick="switchSubTab('perf', 'review')"
                                        class="flex items-center space-x-2 cursor-pointer group perf-step-item" data-step-key="review">
                                        <div
                                            class="perf-step-bubble w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold group-hover:bg-slate-200 transition">
                                            5</div>
                                        <div>
                                            <p
                                                class="perf-step-title font-medium text-slate-600 text-[11px] group-hover:text-slate-900 transition">
                                                5. Review</p>
                                            <p class="perf-step-sub text-[9px] text-slate-400">1-on-1 & Calib</p>
                                        </div>
                                    </div>
                                    <div class="perf-step-line flex-1 h-0.5 bg-slate-200 mx-2 transition-colors"></div>

                                    <div onclick="switchSubTab('perf', 'idp')"
                                        class="flex items-center space-x-2 cursor-pointer group perf-step-item" data-step-key="idp">
                                        <div
                                            class="perf-step-bubble w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold group-hover:bg-slate-200 transition">
                                            6</div>
                                        <div>
                                            <p
                                                class="perf-step-title font-medium text-slate-600 text-[11px] group-hover:text-slate-900 transition">
                                                6. IDP Plan</p>
                                            <p class="perf-step-sub text-[9px] text-slate-400">70-20-10</p>
                                        </div>
                                    </div>
                                    <div class="perf-step-line flex-1 h-0.5 bg-slate-200 mx-2 transition-colors"></div>

                                    <div onclick="switchSubTab('perf', 'cycle')"
                                        class="flex items-center space-x-2 cursor-pointer group perf-step-item" data-step-key="cycle">
                                        <div
                                            class="perf-step-bubble w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold group-hover:bg-slate-200 transition">
                                            7</div>
                                        <div>
                                            <p
                                                class="perf-step-title font-medium text-slate-600 text-[11px] group-hover:text-slate-900 transition">
                                                7. Next Cycle</p>
                                            <p class="perf-step-sub text-[9px] text-slate-400">Roll Forward</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 1 SUB-PANEL: PERFORMANCE PLANNING                 -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-plan" class="sub-panel sub-panel-perf active space-y-4">

                                <!-- Planning Overview Hero -->
                                <div
                                    class="card-hero p-6 bg-white space-y-4">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <span class="badge-primary">Phase 1: Performance Planning</span>
                                            <h3 class="font-heading font-bold text-lg text-slate-900 mt-1.5">Joint Objective Setting &amp; Target Definition</h3>
                                            <p class="text-xs text-slate-500 mt-0.5">Employee and supervisor collaborate to define high-impact hospitality KPIs and expected deliverables for Q3.</p>
                                        </div>
                                        <button onclick="openModal('modal-create-goal')"
                                            class="btn-primary px-4 py-2.5 text-xs font-bold flex items-center space-x-2 self-start sm:self-auto">
                                            <i class="fas fa-plus text-xs"></i>
                                            <span>Define New Objective</span>
                                        </button>
                                    </div>

                                    <div
                                        class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-[#E8DEDC]">
                                        <div class="bg-[#FAF8F7] p-3 rounded-2xl border border-[#E8DEDC]">
                                            <p class="text-slate-500 text-[10px]">Agreed Objectives</p>
                                            <p id="perf-plan-active-targets" class="text-lg font-bold text-slate-900 font-heading">3 Active Targets</p>
                                        </div>
                                        <div class="bg-[#FAF8F7] p-3 rounded-2xl border border-[#E8DEDC]">
                                            <p class="text-slate-500 text-[10px]">Total Weight Allocation</p>
                                            <p id="perf-plan-weight-alloc" class="text-lg font-bold text-sage-dark font-heading">100% Calibrated</p>
                                        </div>
                                        <div class="bg-[#FAF8F7] p-3 rounded-2xl border border-[#E8DEDC]">
                                            <p class="text-slate-500 text-[10px]">Target Alignment</p>
                                            <p id="perf-plan-target-alignment" class="text-lg font-bold text-primary font-heading">5-Star Standards</p>
                                        </div>
                                    </div>
                                </div>



                                <!-- Performance Objectives Table -->
                                <div class="card-clean bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                                    <!-- Header Section -->
                                    <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div class="space-y-1">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 1 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Goal Definition &amp; Metrics</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 1: Performance Objectives &amp; Deliverables Roster</h3>
                                            <p class="text-slate-500 text-xs">Defined baseline commitments, hospitality KPIs, weights, and expected deliverables for team members.</p>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="relative">
                                                <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                                </svg>
                                                <input type="text" placeholder="Search objectives..." class="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-700 w-44 sm:w-48 transition" />
                                            </div>
                                            <button onclick="openModal('modal-create-goal')" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5 shadow-xs">
                                                <i class="fas fa-plus text-[11px]"></i>
                                                <span>Define Objective</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Table -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead class="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                                                <tr>
                                                    <th class="px-5 py-3">Employee</th>
                                                    <th class="px-5 py-3">Objective &amp; Dept</th>
                                                    <th class="px-5 py-3">Target Metric / KPI</th>
                                                    <th class="px-5 py-3">Target Date</th>
                                                    <th class="px-5 py-3">Weight</th>
                                                    <th class="px-5 py-3">Progress</th>
                                                    <th class="px-5 py-3 text-center">Status</th>
                                                    <th class="px-5 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="goals-table-body" class="divide-y divide-slate-100 text-slate-700">
                                                <!-- Rendered dynamically by js/performance.js -->
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="planning-pagination-container" class="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"></div>
                                </div>

                                <!-- Supervisor General Task Checklist Matrix Table -->
                                <div id="general-tasks-matrix-card" class="card-clean bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                                    <!-- Header Section -->
                                    <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div class="space-y-1">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 px-2.5 py-0.5 rounded-full">
                                                    Supervisor Matrix
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Standard Baseline Checklists</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">General Tasks &amp; Operational Checklist Matrix</h3>
                                            <p class="text-slate-500 text-xs">Standard checklist items automatically assigned to all employees setting performance objectives.</p>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="relative">
                                                <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                                </svg>
                                                <input type="text" placeholder="Search tasks..." class="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-700 w-44 sm:w-48 transition" />
                                            </div>
                                            <button onclick="openCreateGeneralTaskModal()" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5 shadow-xs">
                                                <i class="fas fa-plus text-[11px]"></i>
                                                <span>Add General Task</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Table -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead class="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                                                <tr>
                                                    <th class="px-5 py-3">Task Title &amp; Category</th>
                                                    <th class="px-5 py-3">SOP Requirements / Guidelines</th>
                                                    <th class="px-5 py-3">Target Deadline Offset</th>
                                                    <th class="px-5 py-3">Priority / Weight</th>
                                                    <th class="px-5 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="general-tasks-tbody" class="divide-y divide-slate-100 text-slate-700">
                                                <!-- Rendered dynamically by js/performance.js -->
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="general-tasks-pagination-container" class="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"></div>
                                </div>

                                <!-- Initial Development Needs Identification -->
                                <div class="card-clean p-5 bg-indigo-50/40 border border-indigo-100 rounded-xl flex items-start space-x-3.5 text-xs">
                                    <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm flex-shrink-0 shadow-2xs">
                                        <i class="fas fa-lightbulb"></i>
                                    </div>
                                    <div class="space-y-1 flex-1">
                                        <p class="font-bold text-indigo-950 text-sm">Initial Development Needs Identified for this Period</p>
                                        <p class="text-slate-700 leading-relaxed">During the joint planning session, supervisor Marco noted that to sustain the <strong>+18% Upsell target</strong>, Maria requires advanced mentorship in French &amp; Italian reserve wine pairing and Micros POS fast-split billing.</p>
                                        <button onclick="switchSubTab('perf', 'idp')" class="text-indigo-600 hover:text-indigo-800 font-bold underline text-xs inline-block pt-1">
                                            View mapped Individual Development Plan (IDP) &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 2 SUB-PANEL: SUPERVISOR APPROVAL & CALIBRATION      -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-approve" class="sub-panel sub-panel-perf hidden space-y-4">
                                <div class="card-clean bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                                    <!-- Header Section -->
                                    <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div class="space-y-1">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 2 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Supervisor Calibration</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 2: Goal Calibration &amp; Formal Approval Roster</h3>
                                            <p class="text-slate-500 text-xs">Supervisors review employee goals against departmental quotas before locking the baseline.</p>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <button onclick="approveAllPendingGoals()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center space-x-1.5">
                                                <i class="fas fa-check-double"></i>
                                                <span>Approve All Pending Goals</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Dynamic Calibration Workflow Cards (Pending Goals Roster) -->
                                    <div class="p-5 bg-slate-50/30">
                                        <div id="approval-cards-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <!-- Rendered dynamically by js/performance.js -->
                                        </div>
                                    </div>

                                    <!-- Locked Status Card -->
                                    <div class="p-4 bg-emerald-50/70 border-t border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900">
                                        <div class="flex items-center space-x-2.5">
                                            <i class="fas fa-circle-check text-emerald-600 text-base"></i>
                                            <span><strong>Approved &amp; Locked:</strong> All goals now form the official baseline for continuous shift monitoring.</span>
                                        </div>
                                        <button onclick="switchSubTab('perf', 'monitor')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition">
                                            Go to Monitoring &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 3 SUB-PANEL: PERFORMANCE MONITORING                 -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-monitor" class="sub-panel sub-panel-perf hidden space-y-4">
                                <!-- Monitoring Employee Roster Table -->
                                <div class="card-clean bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                                    <!-- Header Section -->
                                    <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div class="space-y-1">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 3 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Continuous Shift Monitoring</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 3: Continuous Shift Performance Monitoring</h3>
                                            <p class="text-slate-500 text-xs">Live shift monitoring, task completions, attendance records, and guest feedback ratings.</p>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="relative">
                                                <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                                </svg>
                                                <input type="text" placeholder="Search employee..." class="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 w-44 sm:w-48 transition" />
                                            </div>
                                            <select id="filter-monitoring-dept" onchange="filterMonitoringByDept(this.value)" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-primary focus:outline-none shadow-2xs">
                                                <option value="all">All Departments</option>
                                                <option value="Front Office">Front Office</option>
                                                <option value="Food & Beverage">Food & Beverage</option>
                                                <option value="Culinary">Culinary</option>
                                                <option value="Housekeeping">Housekeeping</option>
                                            </select>
                                            <button onclick="autoCalculateAllMonitoringProgress()" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 shadow-xs border-indigo-600">
                                                <i class="fas fa-bolt text-[11px]"></i>
                                                <span>Auto-Calculate KPIs</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Table -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead class="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                                                <tr>
                                                    <th class="px-5 py-3">Employee &amp; Position</th>
                                                    <th class="px-5 py-3">Department</th>
                                                    <th class="px-5 py-3">Attendance</th>
                                                    <th class="px-5 py-3">Ratings (Mgr / Cust)</th>
                                                    <th class="px-5 py-3">KPI Target Progress</th>
                                                    <th class="px-5 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="monitoring-roster-tbody" class="divide-y divide-slate-100 text-slate-700">
                                                <!-- Rendered dynamically by js/performance.js -->
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="monitoring-pagination-container" class="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"></div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 4 SUB-PANEL: APPRAISAL EVALUATION                   -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-eval" class="sub-panel sub-panel-perf hidden space-y-4">
                                <!-- Stage 4 Employee Appraisal Evaluation Roster -->
                                <div id="eval-roster-list-card" class="card-clean bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                                    <!-- Header Section -->
                                    <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div class="space-y-1">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 4 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Multi-Factor Assessment</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 4: Employee Appraisal Evaluation Roster</h3>
                                            <p class="text-slate-500 text-xs">Evaluate associate performance against agreed objectives, deliverables, and 5-star hospitality competencies.</p>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="relative">
                                                <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                                </svg>
                                                <input type="text" placeholder="Search employee..." class="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-700 w-44 sm:w-48 transition" />
                                            </div>
                                            <button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-2xs">
                                                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                                                </svg>
                                                Filter
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Table -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead class="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                                                <tr>
                                                    <th class="px-5 py-3">Employee &amp; Position</th>
                                                    <th class="px-5 py-3">Department</th>
                                                    <th class="px-5 py-3">Objectives Progress</th>
                                                    <th class="px-5 py-3">Supervisor Rating</th>
                                                    <th class="px-5 py-3 text-center">Status</th>
                                                    <th class="px-5 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="eval-roster-tbody" class="divide-y divide-slate-100 text-slate-700">
                                                <!-- Rendered dynamically by js/performance.js from database -->
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="eval-pagination-container" class="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"></div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 5 SUB-PANEL: CALIBRATION & 1-ON-1 REVIEW             -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-review" class="sub-panel sub-panel-perf hidden space-y-4">
                                <!-- Stage 5 Employee Review Roster -->
                                <div class="card-clean bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                                    <!-- Header Section -->
                                    <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div class="space-y-1">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 5 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">1-on-1 Calibration</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 5: Calibration &amp; 1-on-1 Review Roster</h3>
                                            <p class="text-slate-500 text-xs">HR bell-curve normalization and formal 1-on-1 rating calibration from database.</p>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="relative">
                                                <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                                </svg>
                                                <input type="text" placeholder="Search employee..." class="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 w-44 sm:w-48 transition" />
                                            </div>
                                            <button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-2xs">
                                                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                                                </svg>
                                                Filter
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Table -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead class="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                                                <tr>
                                                    <th class="px-5 py-3">Employee &amp; Position</th>
                                                    <th class="px-5 py-3">Department</th>
                                                    <th class="px-5 py-3">Appraisal Rating</th>
                                                    <th class="px-5 py-3">Calibrated Score</th>
                                                    <th class="px-5 py-3 text-center">Review Status</th>
                                                    <th class="px-5 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="review-roster-tbody" class="divide-y divide-slate-100 text-slate-700">
                                                <!-- Rendered dynamically by js/performance.js from database -->
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="review-pagination-container" class="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"></div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 6 SUB-PANEL: DEVELOPMENT PLANNING (IDP)             -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-idp" class="sub-panel sub-panel-perf hidden space-y-4">
                                <!-- Stage 6 Employee IDP Roster -->
                                <div class="card-clean bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                                    <!-- Header Section -->
                                    <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div class="space-y-1">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 6 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Development Planning (IDP)</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 6: Individual Development Plan (IDP) Roster</h3>
                                            <p class="text-slate-500 text-xs">70-20-10 experiential, social, and formal learning plans with competency uplift and remediation.</p>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="relative">
                                                <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                                </svg>
                                                <input type="text" placeholder="Search employee..." class="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 w-44 sm:w-48 transition" />
                                            </div>
                                            <button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-2xs">
                                                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                                                </svg>
                                                Filter
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Table -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead class="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                                                <tr>
                                                    <th class="px-5 py-3">Employee</th>
                                                    <th class="px-5 py-3">Position &amp; Department</th>
                                                    <th class="px-5 py-3">IDP 70-20-10 Mapping</th>
                                                    <th class="px-5 py-3">Status</th>
                                                    <th class="px-5 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="idp-roster-tbody" class="divide-y divide-slate-100 text-slate-700">
                                                <!-- Rendered dynamically by js/performance.js -->
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="idp-pagination-container" class="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"></div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 7 SUB-PANEL: IMPLEMENTATION & NEXT CYCLE            -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-cycle" class="sub-panel sub-panel-perf hidden space-y-4">
                                <!-- Stage 7 Employee Next Cycle Roster -->
                                <div class="card-clean bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                                    <!-- Header Section -->
                                    <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div class="space-y-1">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 7 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Implementation &amp; Next Cycle</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 7: Next Cycle Transition &amp; Rollover Roster</h3>
                                            <p class="text-slate-500 text-xs">Rollover active quarterly targets and performance growth lifts into the next cycle baseline.</p>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="relative">
                                                <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                                </svg>
                                                <input type="text" placeholder="Search employee..." class="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-700 w-44 sm:w-48 transition" />
                                            </div>
                                            <button class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-2xs">
                                                <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                                                </svg>
                                                Filter
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Table -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead class="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                                                <tr>
                                                    <th class="px-5 py-3">Employee</th>
                                                    <th class="px-5 py-3">Department</th>
                                                    <th class="px-5 py-3">Growth Lift</th>
                                                    <th class="px-5 py-3">Status</th>
                                                    <th class="px-5 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="cycle-roster-tbody" class="divide-y divide-slate-100 text-slate-700">
                                                <!-- Rendered dynamically by js/performance.js -->
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="cycle-pagination-container" class="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"></div>
                                </div>
                            </div>div>
                        </div>

                        <!-- ======================================================== -->
                        <!-- PILLAR 2: COMPETENCY MANAGEMENT                          -->
