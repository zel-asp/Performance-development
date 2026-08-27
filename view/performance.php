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
                                <div class="card-clean overflow-hidden">
                                    <div
                                        class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <div>
                                            <h4 class="font-heading font-bold text-sm text-slate-900">Defined
                                                Objectives, KPIs & Expected Outputs</h4>
                                            <p class="text-xs text-slate-500">Established baseline commitments for Maria
                                                Santos (Front Office Host)</p>
                                        </div>
                                        <span
                                            class="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">Phase
                                            1 Complete</span>
                                    </div>
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs">
                                            <thead class="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
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
                                    <div id="planning-pagination-container" class="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"></div>
                                </div>

                                <!-- Supervisor General Task Checklist Matrix Table -->
                                <div id="general-tasks-matrix-card" class="card-clean overflow-hidden">
                                    <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                                        <div>
                                            <div class="flex items-center space-x-2">
                                                <span class="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">Supervisor Matrix</span>
                                                <span class="text-xs text-slate-400 font-medium">Standard Baseline Checklists</span>
                                            </div>
                                            <h4 class="font-heading font-bold text-sm text-slate-900 mt-1">General Tasks &amp; Operational Checklist Matrix</h4>
                                            <p class="text-xs text-slate-500">Standard checklist items automatically assigned to all employees setting performance objectives.</p>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <button onclick="openCreateGeneralTaskModal()" class="btn-primary px-3.5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                                                <i class="fas fa-plus text-[11px]"></i>
                                                <span>Add General Task</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs">
                                            <thead class="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
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
                                    <div id="general-tasks-pagination-container" class="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"></div>
                                </div>

                                <!-- Initial Development Needs Identification -->
                                <div
                                    class="card-clean p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start space-x-3.5 text-xs">
                                    <div
                                        class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm flex-shrink-0">
                                        <i class="fas fa-lightbulb"></i>
                                    </div>
                                    <div class="space-y-1 flex-1">
                                        <p class="font-bold text-indigo-950 text-sm">Initial Development Needs
                                             Identified for this Period</p>
                                        <p class="text-slate-700 leading-relaxed">During the joint planning session,
                                            supervisor Marco noted that to sustain the <strong>+18% Upsell
                                                target</strong>, Maria requires advanced mentorship in French & Italian
                                            reserve wine pairing and Micros POS fast-split billing.</p>
                                        <button onclick="switchSubTab('perf', 'idp')"
                                            class="text-indigo-600 hover:text-indigo-800 font-bold underline text-xs inline-block pt-1">
                                            View mapped Individual Development Plan (IDP) &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <div id="sub-perf-approve" class="sub-panel sub-panel-perf hidden space-y-4">

                                <div class="card-clean p-6 space-y-4">
                                    <div
                                        class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                                        <div>
                                            <span
                                                class="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Phase
                                                2: Supervisor Calibration</span>
                                            <h3 class="font-heading font-bold text-base text-slate-900 mt-1">Goal
                                                Review, Calibration & Formal Approval</h3>
                                            <p class="text-xs text-slate-500">Supervisors review employee goals against
                                                departmental quotas before locking the baseline.</p>
                                        </div>
                                        <div class="flex items-center space-x-2 self-start sm:self-auto">
                                            <button onclick="approveAllPendingGoals()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5">
                                                <i class="fas fa-check-double"></i>
                                                <span>Approve All Pending Goals</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Dynamic Calibration Workflow Cards (Pending Goals Roster) -->
                                    <div id="approval-cards-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <!-- Rendered dynamically by js/performance.js -->
                                    </div>

                                    <!-- Locked Status Card -->
                                    <div
                                        class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                                        <div class="flex items-center space-x-2.5">
                                            <i class="fas fa-circle-check text-emerald-600 text-base"></i>
                                            <span><strong>Approved & Locked:</strong> All goals now form the official
                                                legal baseline for continuous shift monitoring.</span>
                                        </div>
                                        <button onclick="switchSubTab('perf', 'monitor')"
                                            class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition">
                                            Go to Monitoring &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 3 SUB-PANEL: PERFORMANCE MONITORING                 -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-monitor" class="sub-panel sub-panel-perf hidden space-y-4">

                                <!-- Monitoring Employee Roster Table (Categorized by Position & Department) -->
                                <div class="card-clean overflow-hidden">
                                    <div class="p-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                        <div>
                                            <h3 class="font-heading font-bold text-sm text-slate-900">Continuous Shift Performance Monitoring</h3>
                                            <p class="text-slate-500 text-xs">Click any employee row to inspect their progress timeline stream or trigger appraisal evaluation.</p>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <button onclick="autoCalculateAllMonitoringProgress()" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 shadow-xs border-indigo-600">
                                                <i class="fas fa-bolt text-[11px]"></i>
                                                <span>Auto-Calculate All KPIs</span>
                                            </button>
                                            <span class="text-slate-400 font-semibold text-[11px] ml-1">Filter:</span>
                                            <select id="filter-monitoring-dept" onchange="filterMonitoringByDept(this.value)" class="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                                                <option value="all">All Departments</option>
                                                <option value="Front Office">Front Office</option>
                                                <option value="Food & Beverage">Food & Beverage</option>
                                                <option value="Culinary">Culinary</option>
                                                <option value="Housekeeping">Housekeeping</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs">
                                            <thead class="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
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
                                    <div id="monitoring-pagination-container" class="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"></div>
                                </div>

                                <!-- Continuous Activity Stream & Accomplishment / Challenge Log (Drill-Down Container) -->
                                <div id="monitoring-employee-detail-card" class="card-clean p-6 space-y-4">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                        <div>
                                            <div class="flex items-center space-x-2">
                                                <span class="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">Monitoring Drill-Down</span>
                                                <span class="text-xs text-slate-400 font-medium">Objective &amp; Action Task Stream</span>
                                            </div>
                                            <h3 id="mon-detail-name" class="font-heading font-bold text-base text-slate-900 mt-1">Select an Employee</h3>
                                            <p id="mon-detail-pos" class="text-xs text-slate-500">Continuous Monitoring Stream</p>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <button onclick="openModal('modal-ai-feedback')"
                                                class="btn-primary px-3.5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                                                <i class="fas fa-wand-magic-sparkles text-[11px]"></i>
                                                <span>AI Refiner</span>
                                            </button>
                                            <button onclick="openLogMilestoneModal(window.selectedEmployeeContext?.id || 'emp-101')"
                                                class="btn-secondary px-3.5 py-2 text-xs font-semibold hover:bg-slate-100 flex items-center space-x-1">
                                                <i class="fas fa-flag-checkered text-emerald-600 text-xs"></i>
                                                <span>+ Log Milestone</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Interactive Filter & Search Bar for Monitoring Stream -->
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs">
                                        <div class="flex items-center space-x-1.5 flex-wrap gap-1">
                                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
                                            <button type="button" onclick="setMonitoringStreamFilter('all')" id="btn-stream-filter-all" class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-primary text-white shadow-2xs transition">All Tasks</button>
                                            <button type="button" onclick="setMonitoringStreamFilter('pending')" id="btn-stream-filter-pending" class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition">⏳ Pending</button>
                                            <button type="button" onclick="setMonitoringStreamFilter('completed')" id="btn-stream-filter-completed" class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition">✓ Completed</button>
                                            <button type="button" onclick="setMonitoringStreamFilter('specific')" id="btn-stream-filter-specific" class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition">Specific Action</button>
                                            <button type="button" onclick="setMonitoringStreamFilter('general')" id="btn-stream-filter-general" class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition">General SOP</button>
                                        </div>
                                        <div class="relative">
                                            <i class="fas fa-search absolute left-3 top-2.5 text-slate-400 text-[10px]"></i>
                                            <input type="text" id="stream-task-search-input" oninput="onMonitoringStreamSearch(this.value)" placeholder="Search tasks, learnings, feedback..." class="pl-7 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-56 font-medium text-slate-800">
                                        </div>
                                    </div>

                                    <!-- Compact Goal-Separated Container -->
                                    <div id="timeline-stream-container" class="space-y-3.5 text-xs">
                                        <!-- Rendered dynamically by js/performance.js -->
                                    </div>
                                </div>
                            </div>
<div id="sub-perf-eval" class="sub-panel sub-panel-perf hidden space-y-4">

                                <!-- Stage 4 Employee Roster List Firs                                <!-- Stage 4 Employee Appraisal Evaluation Roster -->
                                <div id="eval-roster-list-card" class="card-clean overflow-hidden">
                                    <div class="p-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                        <div>
                                            <div class="flex items-center space-x-2">
                                                <span class="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Phase 4 Stepper</span>
                                                <span class="text-xs text-slate-400 font-medium">Multi-Factor Assessment</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-sm text-slate-900 mt-1">Stage 4: Employee Appraisal Evaluation Roster</h3>
                                            <p class="text-slate-500 text-xs">Evaluate associate performance against agreed objectives, deliverables, and 5-star hospitality competencies.</p>
                                        </div>
                                    </div>
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs">
                                            <thead class="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
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
                                </div>

                                <!-- Appraisal Detail View Card (Dynamic per Employee from Database) -->
                                <div id="eval-detail-view-card" class="card-clean p-6 space-y-6 hidden">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div>
                                            <button onclick="hideEmployeeEvalDetail()" class="text-xs text-primary font-bold hover:underline mb-1.5 flex items-center space-x-1">
                                                <i class="fas fa-arrow-left text-[10px]"></i><span>Back to Appraisal Roster</span>
                                            </button>
                                            <div class="flex items-center space-x-2">
                                                <span class="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Phase 4: Formal Evaluation</span>
                                                <span id="eval-detail-status-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Rated</span>
                                            </div>
                                            <h3 id="eval-detail-emp-title" class="font-heading font-bold text-lg text-slate-900 mt-1">Formal Multi-Factor Appraisal</h3>
                                            <p id="eval-detail-emp-subtitle" class="text-xs text-slate-500">Position · Department</p>
                                        </div>
                                        <div class="flex items-center space-x-2 self-start sm:self-auto">
                                            <button id="btn-open-eval-appraisal" onclick="openAppraisalModal(window.selectedEvalEmpId)" class="btn-primary px-4 py-2 text-xs font-bold shadow-xs">
                                                <i class="fas fa-edit mr-1"></i> Open Appraisal Form
                                            </button>
                                            <button onclick="switchSubTab('perf', 'review')" class="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center space-x-1" title="Proceed to Phase 5: Calibration">
                                                <span>Phase 5 Calibration</span>
                                                <i class="fas fa-arrow-right text-[10px]"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Warning Alert Banner if Supervisor Rating Below 3.0 -->
                                    <div id="eval-detail-warning-alert" class="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-xs text-rose-900 hidden shadow-2xs">
                                        <div class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            <i class="fas fa-triangle-exclamation"></i>
                                        </div>
                                        <div class="space-y-0.5">
                                            <p class="font-bold text-rose-950 text-sm">Performance Alert: Rating Below 3.0 Benchmark</p>
                                            <p class="text-rose-800 text-[11px] leading-relaxed">The supervisor appraisal score for this associate is below standard hotel competency requirements (&lt; 3.0). A structured <strong>Performance Improvement Plan (PIP)</strong> and targeted capability retraining are recommended.</p>
                                        </div>
                                    </div>

                                    <!-- Objectives Scorecard Breakdown -->
                                    <div class="space-y-2">
                                        <h4 class="font-heading font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                                            <i class="fas fa-bullseye text-primary"></i>
                                            <span>Agreed Performance Objectives &amp; Task Deliverables Scorecard</span>
                                        </h4>
                                        <div id="eval-detail-objectives-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            <!-- Populated dynamically by showEmployeeEvalDetail() from DB -->
                                        </div>
                                    </div>

                                    <!-- Primary Supervisor Appraisal Assessment Card -->
                                    <div class="p-5 bg-[#FAF8F7] rounded-2xl border border-purple-200/90 space-y-4 text-xs">
                                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                                            <div class="flex items-center space-x-2">
                                                <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xs">
                                                    <i class="fas fa-user-tie"></i>
                                                </div>
                                                <div>
                                                    <span class="font-bold text-purple-950 uppercase text-[11px] tracking-wide block">Supervisor Appraisal Scorecard</span>
                                                    <span class="text-[10px] text-slate-500">Official calibrated rating recorded in Supabase database</span>
                                                </div>
                                            </div>
                                            <span id="eval-detail-super-status-badge" class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full self-start sm:self-auto">Rated</span>
                                        </div>

                                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-purple-100 shadow-2xs">
                                            <div class="space-y-1">
                                                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Evaluated Score</span>
                                                <div id="eval-detail-super-score" class="text-3xl font-heading font-bold text-slate-900">
                                                    0.0 <span class="text-sm font-normal text-slate-400">/ 5.0 (Pending)</span>
                                                </div>
                                            </div>
                                            <div id="eval-detail-tier-badge-container">
                                                <!-- Dynamic Tier Badge -->
                                            </div>
                                        </div>

                                        <!-- Evaluated Criteria Breakdown from Database -->
                                        <div class="space-y-2 pt-1">
                                            <h5 class="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                                                <i class="fas fa-list-check text-purple-700"></i>
                                                <span>Criteria Rubric Scores &amp; Rationales</span>
                                            </h5>
                                            <div id="eval-detail-criteria-breakdown" class="space-y-2">
                                                <!-- Populated dynamically by showEmployeeEvalDetail() from DB -->
                                            </div>
                                        </div>

                                        <!-- Supervisor Notes & Recommendation -->
                                        <div class="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
                                            <span class="font-bold text-slate-800 text-[11px] flex items-center space-x-1.5">
                                                <i class="fas fa-comment-dots text-purple-700"></i>
                                                <span>Supervisor Feedback &amp; Development Recommendation</span>
                                            </span>
                                            <div id="eval-detail-super-recommendation" class="text-slate-700 leading-relaxed text-xs">
                                                <!-- Populated dynamically -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 5 SUB-PANEL: CALIBRATION & 1-ON-1 REVIEW             -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-review" class="sub-panel sub-panel-perf hidden space-y-4">

                                <!-- Stage 5 Employee Review Roster -->
                                <div class="card-clean overflow-hidden">
                                    <div class="p-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                        <div>
                                            <div class="flex items-center space-x-2">
                                                <span class="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Phase 5 Stepper</span>
                                                <span class="text-xs text-slate-400 font-medium">1-on-1 Calibration</span>
                                            </div>
                                            <h3 class="font-heading font-bold text-sm text-slate-900 mt-1">Stage 5: Calibration &amp; 1-on-1 Review Roster</h3>
                                            <p class="text-slate-500 text-xs">HR bell-curve normalization and formal 1-on-1 rating calibration from database.</p>
                                        </div>
                                    </div>
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs">
                                            <thead class="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
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
                                </div>

                                <!-- Stage 5: Detailed 1-on-1 Discussion & Calibration Summary Card -->
                                <div id="calibration-detail-view-card" class="card-clean p-6 space-y-6">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div>
                                            <div class="flex items-center space-x-2">
                                                <span class="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Phase 5: Discussion Minutes</span>
                                                <span id="calib-detail-status-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Calibrated &amp; Approved</span>
                                            </div>
                                            <h3 id="calib-detail-emp-title" class="font-heading font-bold text-lg text-slate-900 mt-1">1-on-1 Discussion &amp; Calibration Approval</h3>
                                            <p id="calib-detail-emp-subtitle" class="text-xs text-slate-500">Employee and supervisor discuss evaluation results, normalize ratings, and record final approved score.</p>
                                        </div>
                                        <div class="flex items-center space-x-2 self-start sm:self-auto">
                                            <button id="calib-detail-btn-open-modal" onclick="open1on1CalibrationModal(window.selectedEvalEmpId || 'emp-101')" class="btn-primary px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 border-indigo-600 shadow-xs">
                                                <i class="fas fa-sliders mr-1.5"></i> Calibrate 1-on-1
                                            </button>
                                        </div>
                                    </div>

                                    <!-- 1-on-1 Discussion Minutes & Rating Record from Database (2 Clean Columns) -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                                            <p class="font-bold text-slate-900 text-sm">Final Calibrated Score</p>
                                            <p class="text-3xl font-heading font-bold text-indigo-700">
                                                <span id="calib-detail-score-val">0.00</span> <span class="text-xs font-normal text-slate-400">/ 5.0</span>
                                            </p>
                                            <p class="text-[11px] text-slate-500">Grade: <strong id="calib-detail-tier-label" class="text-slate-800">Pending Calibration</strong></p>
                                        </div>

                                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                                            <p class="font-bold text-slate-900 text-sm">Discussion Minutes &amp; Growth Focus</p>
                                            <div id="calib-detail-discussion-minutes" class="text-slate-600 leading-relaxed text-[11px] max-h-28 overflow-y-auto custom-scrollbar">
                                                1-on-1 session discussion minutes pending formal recording in database.
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Dynamic Next Step: Create Development Plan if >= 3.0, or Initiate PIP if < 3.0 -->
                                    <div id="calib-next-step-container">
                                        <!-- Rendered dynamically by js/performance.js -->
                                    </div>
                                </div>

                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 6 SUB-PANEL: DEVELOPMENT PLANNING (IDP)             -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-idp" class="sub-panel sub-panel-perf hidden space-y-5">

                                <!-- Stage 6 Employee IDP Roster -->
                                <div class="card-clean overflow-hidden">
                                    <div class="p-4 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
                                        <div>
                                            <h3 class="font-heading font-bold text-sm text-slate-900">Stage 6: Individual Development Plan (IDP) Roster</h3>
                                            <p class="text-slate-500 text-xs">70-20-10 experiential, social, and formal learning plans from database.</p>
                                        </div>
                                    </div>
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs">
                                            <thead class="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
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
                                </div>

                                <div class="card-clean p-6 space-y-6">
                                    <!-- Header -->
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div>
                                            <span class="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Phase 6: Development Planning</span>
                                            <h3 id="idp-detail-title" class="font-heading font-bold text-lg text-slate-900 mt-1">70-20-10 Individual Development Plan (IDP)</h3>
                                            <p id="idp-detail-subtitle" class="text-xs text-slate-500 mt-0.5">Based on appraisal results, employee strengths and development gaps are mapped to tailored 70-20-10 learning actions.</p>
                                        </div>
                                        <div id="idp-header-actions" class="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                                            <button onclick="openRemedialBooksModal(window.selectedEvalEmpId || 'emp-101')" class="px-3.5 py-2 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition">
                                                <i class="fas fa-book-medical"></i>
                                                <span>Prescribe LMS Books</span>
                                            </button>
                                            <button onclick="openModal('modal-ai-feedback')" class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-1.5">
                                                <i class="fas fa-plus"></i>
                                                <span>Add IDP Action</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Strengths vs Gaps Breakdown from Database -->
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                                        <!-- Strengths Card -->
                                        <div class="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-3">
                                            <div class="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                                                <span class="font-bold text-emerald-950 text-xs flex items-center">
                                                    <i class="fas fa-award mr-2 text-emerald-600 text-sm"></i>
                                                    Identified Strengths &amp; Core Competencies
                                                </span>
                                                <span id="idp-strengths-count" class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">0 Calibrated</span>
                                            </div>
                                            <ul id="idp-detail-strengths-list" class="space-y-2 text-slate-700">
                                                <!-- Populated dynamically by js/performance.js -->
                                            </ul>
                                        </div>

                                        <!-- Gaps Card -->
                                        <div class="p-5 bg-amber-50/40 rounded-2xl border border-amber-200/80 space-y-3">
                                            <div class="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
                                                <span class="font-bold text-amber-950 text-xs flex items-center">
                                                    <i class="fas fa-triangle-exclamation mr-2 text-amber-600 text-sm"></i>
                                                    Development Gaps (&lt; 3.0 Threshold)
                                                </span>
                                                <span id="idp-gaps-count" class="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">Action Required</span>
                                            </div>
                                            <ul id="idp-detail-gaps-list" class="space-y-2 text-slate-700">
                                                <!-- Populated dynamically by js/performance.js -->
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- 70-20-10 IDP Plan Cards Section from Database -->
                                    <div class="space-y-3.5 text-xs">
                                        <div class="flex items-center justify-between border-t border-slate-100 pt-4">
                                            <div>
                                                <h4 class="font-heading font-bold text-slate-900 text-sm">70-20-10 Active Development Commitments</h4>
                                                <p class="text-slate-500 text-[11px]">Experiential, Mentorship &amp; Formal LMS actions mapped for growth</p>
                                            </div>
                                            <div id="idp-commitments-header-action">
                                                <button onclick="openRemedialBooksModal(window.selectedEvalEmpId || 'emp-101')" class="text-xs text-primary font-bold hover:underline flex items-center space-x-1">
                                                    <i class="fas fa-book-bookmark text-[11px]"></i>
                                                    <span>Browse All LMS Books &rarr;</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div id="idp-perf-commitments-container" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <!-- Populated dynamically by js/performance.js -->
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 7 SUB-PANEL: IMPLEMENTATION & NEXT CYCLE            -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-cycle" class="sub-panel sub-panel-perf hidden space-y-4">

                                <!-- Stage 7 Employee Next Cycle Roster -->
                                <div class="card-clean overflow-hidden">
                                    <div class="p-4 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
                                        <div>
                                            <h3 class="font-heading font-bold text-sm text-slate-900">Stage 7: Next Cycle Transition Roster</h3>
                                            <p class="text-slate-500 text-xs">Rollover active quarterly targets and performance growth lifts into the next cycle baseline.</p>
                                        </div>
                                    </div>
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs">
                                            <thead class="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
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
                                </div>

                                <div class="card-clean p-6 space-y-6">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div>
                                            <span class="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">Phase 7: Next Cycle Transition</span>
                                            <h3 id="cycle-detail-title" class="font-heading font-bold text-lg text-slate-900 mt-1">Development Monitoring &amp; Next Cycle Initiation</h3>
                                            <p class="text-xs text-slate-500">Progress is verified, newly mastered capabilities feed into elevated targets, closing the continuous loop.</p>
                                        </div>
                                        <span class="text-xs bg-teal-100 text-teal-800 font-bold px-3 py-1.5 rounded-xl self-start sm:self-auto">
                                            <i class="fas fa-rotate mr-1"></i> Continuous Loop Active
                                        </span>
                                    </div>

                                    <!-- Progress to Next Cycle Card from Database -->
                                    <div id="cycle-detail-transition-card" class="card-hero p-6 bg-white space-y-4">
                                        <!-- Rendered dynamically by js/performance.js -->
                                    </div>

                                    <!-- Continuous Process Flow Reminder Card -->
                                    <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-700">
                                        <p class="font-bold text-slate-900 text-sm"><i class="fas fa-infinity text-primary mr-1.5"></i> Continuous Cycle Architecture Summary:</p>
                                        <p class="leading-relaxed">
                                            <span class="font-semibold text-slate-900">Set Goals</span> &rarr;
                                            <span class="font-semibold text-slate-900">Approve Goals</span> &rarr;
                                            <span class="font-semibold text-slate-900">Monitor Performance</span> &rarr;
                                            <span class="font-semibold text-slate-900">Evaluate</span> &rarr;
                                            <span class="font-semibold text-slate-900">Review/Approve Results</span> &rarr;
                                            <span class="font-semibold text-slate-900">Create Development Plan</span> &rarr;
                                            <span class="font-semibold text-slate-900">Implement Development</span> &rarr;
                                            <span class="font-semibold text-slate-900">Monitor Progress</span> &rarr;
                                            <span class="font-semibold text-primary font-bold">Next Performance Cycle</span>
                                        </p>
                                        <p class="text-slate-500 text-[11px]">The module creates an ongoing feedback loop where appraisal results directly fuel capability development and future hospitality excellence.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- ======================================================== -->
                        <!-- PILLAR 2: COMPETENCY MANAGEMENT                          -->
