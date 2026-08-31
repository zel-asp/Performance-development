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
                            </div>

                            <!-- 7-Stage Continuous Cycle Interactive Stepper -->
                            <div class="card-clean p-5 overflow-x-auto custom-scrollbar bg-white">
                                <div class="min-w-[840px] relative text-xs select-none py-1">

                                    <!-- Connecting Stepper Track & Dynamic Traveling Beam -->
                                    <div class="stepper-track-container absolute top-[18px] left-[6%] right-[6%] h-[3px] bg-[#E2DCD5] rounded-full z-0 overflow-hidden pointer-events-none">
                                        <div id="perf-stepper-progress-fill" class="absolute top-0 left-0 h-full bg-slate-800 rounded-full transition-all duration-500 ease-out" style="width: 0%;"></div>
                                        <div id="perf-stepper-glider" class="stepper-glider-beam opacity-0" style="left: 0px; width: 0px;"></div>
                                    </div>

                                    <div class="relative z-10 flex items-start justify-between">
                                        <!-- Step 1 -->
                                        <div onclick="switchSubTab('perf', 'plan')"
                                            class="flex flex-col items-center text-center cursor-pointer group perf-step-item w-28" data-step-key="plan">
                                            <div class="perf-step-bubble w-9 h-9 rounded-full bg-primary text-white ring-4 ring-primary/25 ring-offset-2 ring-offset-white flex items-center justify-center text-xs font-bold shadow-md scale-110 transition-all duration-300">
                                                1
                                            </div>
                                            <p class="perf-step-title font-bold text-primary text-[11px] mt-2 group-hover:text-primary transition-colors">
                                                1. Planning
                                            </p>
                                            <p class="perf-step-sub text-[9px] text-slate-400 font-medium mt-0.5">0 Pending</p>
                                        </div>

                                        <!-- Step 2 -->
                                        <div onclick="switchSubTab('perf', 'approve')"
                                            class="flex flex-col items-center text-center cursor-pointer group perf-step-item w-28" data-step-key="approve">
                                            <div class="perf-step-bubble w-9 h-9 rounded-full bg-slate-100 text-slate-500 ring-4 ring-white flex items-center justify-center text-xs font-bold group-hover:bg-slate-200 transition-all duration-300">
                                                2
                                            </div>
                                            <p class="perf-step-title font-medium text-slate-600 text-[11px] mt-2 group-hover:text-slate-900 transition-colors">
                                                2. Approval
                                            </p>
                                            <p class="perf-step-sub text-[9px] text-slate-400 font-medium mt-0.5">1 Approved</p>
                                        </div>

                                        <!-- Step 3 -->
                                        <div onclick="switchSubTab('perf', 'monitor')"
                                            class="flex flex-col items-center text-center cursor-pointer group perf-step-item w-28" data-step-key="monitor">
                                            <div class="perf-step-bubble w-9 h-9 rounded-full bg-slate-100 text-slate-500 ring-4 ring-white flex items-center justify-center text-xs font-bold group-hover:bg-slate-200 transition-all duration-300">
                                                3
                                            </div>
                                            <p class="perf-step-title font-medium text-slate-600 text-[11px] mt-2 group-hover:text-slate-900 transition-colors">
                                                3. Monitoring
                                            </p>
                                            <p class="perf-step-sub text-[9px] text-slate-400 font-medium mt-0.5">1 Monitored</p>
                                        </div>

                                        <!-- Step 4 -->
                                        <div onclick="switchSubTab('perf', 'eval')"
                                            class="flex flex-col items-center text-center cursor-pointer group perf-step-item w-28" data-step-key="eval">
                                            <div class="perf-step-bubble w-9 h-9 rounded-full bg-slate-100 text-slate-500 ring-4 ring-white flex items-center justify-center text-xs font-bold group-hover:bg-slate-200 transition-all duration-300">
                                                4
                                            </div>
                                            <p class="perf-step-title font-medium text-slate-600 text-[11px] mt-2 group-hover:text-slate-900 transition-colors">
                                                4. Evaluation
                                            </p>
                                            <p class="perf-step-sub text-[9px] text-slate-400 font-medium mt-0.5">0 Pending</p>
                                        </div>

                                        <!-- Step 5 -->
                                        <div onclick="switchSubTab('perf', 'review')"
                                            class="flex flex-col items-center text-center cursor-pointer group perf-step-item w-28" data-step-key="review">
                                            <div class="perf-step-bubble w-9 h-9 rounded-full bg-slate-100 text-slate-500 ring-4 ring-white flex items-center justify-center text-xs font-bold group-hover:bg-slate-200 transition-all duration-300">
                                                5
                                            </div>
                                            <p class="perf-step-title font-medium text-slate-600 text-[11px] mt-2 group-hover:text-slate-900 transition-colors">
                                                5. Review
                                            </p>
                                            <p class="perf-step-sub text-[9px] text-slate-400 font-medium mt-0.5">0 Calibrated</p>
                                        </div>

                                        <!-- Step 6 -->
                                        <div onclick="switchSubTab('perf', 'idp')"
                                            class="flex flex-col items-center text-center cursor-pointer group perf-step-item w-28" data-step-key="idp">
                                            <div class="perf-step-bubble w-9 h-9 rounded-full bg-slate-100 text-slate-500 ring-4 ring-white flex items-center justify-center text-xs font-bold group-hover:bg-slate-200 transition-all duration-300">
                                                6
                                            </div>
                                            <p class="perf-step-title font-medium text-slate-600 text-[11px] mt-2 group-hover:text-slate-900 transition-colors">
                                                6. IDP Plan
                                            </p>
                                            <p class="perf-step-sub text-[9px] text-slate-400 font-medium mt-0.5">0 IDP Plans</p>
                                        </div>

                                        <!-- Step 7 -->
                                        <div onclick="switchSubTab('perf', 'cycle')"
                                            class="flex flex-col items-center text-center cursor-pointer group perf-step-item w-28" data-step-key="cycle">
                                            <div class="perf-step-bubble w-9 h-9 rounded-full bg-slate-100 text-slate-500 ring-4 ring-white flex items-center justify-center text-xs font-bold group-hover:bg-slate-200 transition-all duration-300">
                                                7
                                            </div>
                                            <p class="perf-step-title font-medium text-slate-600 text-[11px] mt-2 group-hover:text-slate-900 transition-colors">
                                                7. Next Cycle
                                            </p>
                                            <p class="perf-step-sub text-[9px] text-slate-400 font-medium mt-0.5">0 Transitions</p>
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
                                        <div class="space-y-0.5">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 1 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Goal Definition &amp; Metrics</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 1: Objectives &amp; Deliverables</h3>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="search-box-pixel">
                                                <i class="fas fa-magnifying-glass absolute left-2.5 text-slate-400 text-xs pointer-events-none"></i>
                                                <input id="search-planning-goals" oninput="onPlanningGoalsSearch(this.value)" type="text" placeholder="Search objectives..." class="search-input-pixel" />
                                            </div>
                                            <select id="filter-planning-status" onchange="filterPlanningByStatus(this.value)" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-primary focus:outline-none shadow-2xs">
                                                <option value="all">All Goals</option>
                                                <option value="pending" selected>Pending Approval</option>
                                                <option value="approved">Approved</option>
                                                <option value="completed">Completed</option>
                                                <option value="failed">Failed</option>
                                            </select>
                                            <button onclick="confirmApproveAllPendingGoals()" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center space-x-1.5">
                                                <i class="fas fa-check-double"></i>
                                                <span>Approve All Pending</span>
                                            </button>
                                            <button id="btn-stage1-bulk-delete" onclick="confirmBulkDeleteStage1()" class="hidden px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center space-x-1.5">
                                                <i class="fas fa-trash-can"></i>
                                                <span>Delete (<span id="stage1-selected-count">0</span>)</span>
                                            </button>
                                            <button onclick="openModal('modal-create-goal')" class="btn-primary text-xs font-bold flex items-center space-x-1.5 shadow-xs">
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
                                                    <th class="px-4 py-3 w-8 text-center">
                                                        <input type="checkbox" id="stage1-select-all" onchange="toggleSelectAllStage1(this.checked)" class="rounded border-slate-300 text-primary focus:ring-primary">
                                                    </th>
                                                    <th class="px-3 py-3 w-10 text-center font-bold text-slate-400">#</th>
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
                                        <div class="space-y-0.5">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 px-2.5 py-0.5 rounded-full">
                                                    Supervisor Matrix
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Baseline Checklists</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">General Tasks Matrix</h3>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="search-box-pixel">
                                                <i class="fas fa-magnifying-glass absolute left-2.5 text-slate-400 text-xs pointer-events-none"></i>
                                                <input id="search-general-tasks" oninput="onGeneralTasksSearch(this.value)" type="text" placeholder="Search tasks..." class="search-input-pixel" />
                                            </div>
                                            <button onclick="openCreateGeneralTaskModal()" class="btn-primary text-xs font-bold flex items-center space-x-1.5 shadow-xs">
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
                                                    <th class="px-3 py-3 w-10 text-center font-bold text-slate-400">#</th>
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
                                <div class="card-clean p-4.5 bg-indigo-50/40 border border-indigo-100 rounded-xl flex items-start space-x-3.5 text-xs">
                                    <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm flex-shrink-0 shadow-2xs">
                                        <i class="fas fa-lightbulb"></i>
                                    </div>
                                    <div class="space-y-0.5 flex-1">
                                        <p class="font-bold text-indigo-950 text-xs">Development Needs Identified</p>
                                        <p class="text-slate-600 leading-relaxed">Associate Maria is scheduled for reserve wine pairing mentorship to sustain the <strong>+18% Upsell target</strong>.</p>
                                    </div>
                                    <button onclick="switchSubTab('perf', 'idp')" class="text-indigo-600 hover:text-indigo-800 font-bold underline text-xs flex-shrink-0">
                                        View IDP &rarr;
                                    </button>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 2 SUB-PANEL: SUPERVISOR APPROVAL & CALIBRATION      -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-approve" class="sub-panel sub-panel-perf hidden space-y-4">
                                <div class="card-clean bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                                    <!-- Header Section -->
                                    <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div class="space-y-0.5">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 2 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Approved Objectives</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 2: Goal Calibration &amp; Approval</h3>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="search-box-pixel">
                                                <i class="fas fa-magnifying-glass absolute left-2.5 text-slate-400 text-xs pointer-events-none"></i>
                                                <input id="search-approved-goals" oninput="onApprovedGoalsSearch(this.value)" type="text" placeholder="Search approved goals..." class="search-input-pixel" />
                                            </div>
                                            <button id="btn-stage2-bulk-delete" onclick="confirmBulkDeleteStage2()" class="hidden px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center space-x-1.5">
                                                <i class="fas fa-trash-can"></i>
                                                <span>Delete Selected (<span id="stage2-selected-count">0</span>)</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Dynamic Calibration Workflow Cards (Approved Goals Roster) -->
                                    <div class="p-5 bg-slate-50/30">
                                        <div id="approval-cards-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <!-- Rendered dynamically by js/performance.js -->
                                        </div>
                                    </div>
                                    <div id="approval-pagination-container" class="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500"></div>

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
                                        <div class="space-y-0.5">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 3 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Continuous Monitoring</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 3: Shift Performance Monitoring</h3>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="search-box-pixel">
                                                <i class="fas fa-magnifying-glass absolute left-2.5 text-slate-400 text-xs pointer-events-none"></i>
                                                <input id="search-monitoring-emp" oninput="onMonitoringEmployeeSearch(this.value)" type="text" placeholder="Search employee..." class="search-input-pixel" />
                                            </div>
                                            <select id="filter-monitoring-dept" onchange="filterMonitoringByDept(this.value)" class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-primary focus:outline-none shadow-2xs">
                                                <option value="all">All Departments</option>
                                                <option value="Front Office">Front Office</option>
                                                <option value="Food & Beverage">Food & Beverage</option>
                                                <option value="Culinary">Culinary</option>
                                                <option value="Housekeeping">Housekeeping</option>
                                            </select>
                                            <button onclick="autoCalculateAllMonitoringProgress()" class="btn-primary text-xs font-bold flex items-center space-x-1.5 shadow-xs">
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
                                                    <th class="px-3 py-3 w-10 text-center font-bold text-slate-400">#</th>
                                                    <th class="px-5 py-3">Employee &amp; Position</th>
                                                    <th class="px-5 py-3">Department</th>
                                                    <th class="px-5 py-3">Supervisor Rating</th>
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
                                        <div class="space-y-0.5">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 4 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Evaluation Roster</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 4: Appraisal Evaluation</h3>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="search-box-pixel">
                                                <i class="fas fa-magnifying-glass absolute left-2.5 text-slate-400 text-xs pointer-events-none"></i>
                                                <input id="search-eval-emp" oninput="onEvalEmployeeSearch(this.value)" type="text" placeholder="Search employee..." class="search-input-pixel" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Table -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead class="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                                                <tr>
                                                    <th class="px-3 py-3 w-10 text-center font-bold text-slate-400">#</th>
                                                    <th class="px-5 py-3">Employee &amp; Position</th>
                                                    <th class="px-5 py-3">Department</th>
                                                    <th class="px-5 py-3">Objectives Progress</th>
                                                    <th class="px-5 py-3">Self Evaluation</th>
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
                                        <div class="space-y-0.5">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 5 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">1-on-1 Review &amp; Calibration</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 5: 1-on-1 Review &amp; Rating</h3>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="search-box-pixel">
                                                <i class="fas fa-magnifying-glass absolute left-2.5 text-slate-400 text-xs pointer-events-none"></i>
                                                <input id="search-review-emp" oninput="onReviewEmployeeSearch(this.value)" type="text" placeholder="Search employee..." class="search-input-pixel" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Table -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead class="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                                                <tr>
                                                    <th class="px-3 py-3 w-10 text-center font-bold text-slate-400">#</th>
                                                    <th class="px-5 py-3">Employee &amp; Position</th>
                                                    <th class="px-5 py-3">Department</th>
                                                    <th class="px-5 py-3">Appraisal Rating</th>
                                                    <th class="px-5 py-3">Final Rating</th>
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
                                        <div class="space-y-0.5">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 6 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">70-20-10 Learning Action Plan</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 6: Individual Development Plan (IDP)</h3>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="search-box-pixel">
                                                <i class="fas fa-magnifying-glass absolute left-2.5 text-slate-400 text-xs pointer-events-none"></i>
                                                <input id="search-idp-emp" oninput="onIDPEmployeeSearch(this.value)" type="text" placeholder="Search employee..." class="search-input-pixel" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Table -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead class="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                                                <tr>
                                                    <th class="px-3 py-3 w-10 text-center font-bold text-slate-400">#</th>
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
                                        <div class="space-y-0.5">
                                            <div class="flex items-center space-x-2">
                                                <span class="inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-700/10 px-2.5 py-0.5 rounded-full">
                                                    Phase 7 Stepper
                                                </span>
                                                <span class="text-xs text-slate-400 font-medium">•</span>
                                                <span class="text-xs text-slate-500 font-medium">Cycle Transition &amp; Baseline</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Stage 7: Next Cycle Transition</h3>
                                        </div>

                                        <!-- Header Action Controls -->
                                        <div class="flex items-center gap-2 self-end lg:self-center flex-wrap">
                                            <div class="search-box-pixel">
                                                <i class="fas fa-magnifying-glass absolute left-2.5 text-slate-400 text-xs pointer-events-none"></i>
                                                <input id="search-cycle-emp" oninput="onCycleEmployeeSearch(this.value)" type="text" placeholder="Search employee..." class="search-input-pixel" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Table -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead class="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                                                <tr>
                                                    <th class="px-3 py-3 w-10 text-center font-bold text-slate-400">#</th>
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
                            </div>
                        </div>
