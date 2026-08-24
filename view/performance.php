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
                                            <p class="text-lg font-bold text-slate-900 font-heading">3 Active Targets</p>
                                        </div>
                                        <div class="bg-[#FAF8F7] p-3 rounded-2xl border border-[#E8DEDC]">
                                            <p class="text-slate-500 text-[10px]">Total Weight Allocation</p>
                                            <p class="text-lg font-bold text-sage-dark font-heading">100% Calibrated</p>
                                        </div>
                                        <div class="bg-[#FAF8F7] p-3 rounded-2xl border border-[#E8DEDC]">
                                            <p class="text-slate-500 text-[10px]">Target Alignment</p>
                                            <p class="text-lg font-bold text-primary font-heading">5-Star Standards</p>
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
                                            <thead
                                                class="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                                                <tr>
                                                    <th class="px-5 py-3">Performance Objective</th>
                                                    <th class="px-5 py-3">Measurable KPI Formula</th>
                                                    <th class="px-5 py-3">Weight</th>
                                                    <th class="px-5 py-3">Expected Deliverables & Evidence</th>
                                                    <th class="px-5 py-3">Target Date</th>
                                                    <th class="px-5 py-3 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody id="goals-table-body" class="divide-y divide-slate-100 text-slate-700">
                                                <tr class="hover:bg-slate-50/60 transition">
                                                    <td class="px-5 py-4 font-semibold text-slate-900">
                                                        VIP Guest Check-in Experience & NPS Lift
                                                        <p class="text-[11px] text-slate-400 font-normal">Front Office &
                                                            Guest Experience</p>
                                                    </td>
                                                    <td class="px-5 py-4 font-mono font-medium text-slate-800">NPS &ge;
                                                        +92 Score</td>
                                                    <td class="px-5 py-4 font-bold text-primary">35% (Core)</td>
                                                    <td class="px-5 py-4 text-slate-600">Medallia monthly review scores,
                                                        Opera PMS check-in logs</td>
                                                    <td class="px-5 py-4 text-slate-500">Aug 30, 2026</td>
                                                    <td class="px-5 py-4 text-right">
                                                        <span
                                                            class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Approved</span>
                                                    </td>
                                                </tr>
                                                <tr class="hover:bg-slate-50/60 transition">
                                                    <td class="px-5 py-4 font-semibold text-slate-900">
                                                        Fine Dining Upselling & Sommelier Pairing
                                                        <p class="text-[11px] text-slate-400 font-normal">Food &
                                                            Beverage Service</p>
                                                    </td>
                                                    <td class="px-5 py-4 font-mono font-medium text-slate-800">+18% Avg
                                                        Check Lift</td>
                                                    <td class="px-5 py-4 font-bold text-slate-700">30% (Standard)</td>
                                                    <td class="px-5 py-4 text-slate-600">Micros POS beverage and reserve
                                                        vintage weekly reports</td>
                                                    <td class="px-5 py-4 text-slate-500">Sep 15, 2026</td>
                                                    <td class="px-5 py-4 text-right">
                                                        <span
                                                            class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Approved</span>
                                                    </td>
                                                </tr>
                                                <tr class="hover:bg-slate-50/60 transition">
                                                    <td class="px-5 py-4 font-semibold text-slate-900">
                                                        HACCP Food Safety & Sanitation Compliance
                                                        <p class="text-[11px] text-slate-400 font-normal">Culinary &
                                                            Kitchen Hygiene</p>
                                                    </td>
                                                    <td class="px-5 py-4 font-mono font-medium text-slate-800">100%
                                                        Audit Pass (0 Violations)</td>
                                                    <td class="px-5 py-4 font-bold text-slate-700">35% (Core)</td>
                                                    <td class="px-5 py-4 text-slate-600">Daily cold-chain walk-in
                                                        temperature logs and QA sign-off</td>
                                                    <td class="px-5 py-4 text-slate-500">Sep 30, 2026</td>
                                                    <td class="px-5 py-4 text-right">
                                                        <span
                                                            class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Approved</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
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
                            <!-- STAGE 2 SUB-PANEL: GOAL SETTING & APPROVAL                -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-approve" class="sub-panel sub-panel-perf space-y-4">
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
                                        <span
                                            class="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                                            <i class="fas fa-lock text-slate-400 mr-1"></i> Baseline Locked for Q3
                                        </span>
                                    </div>

                                    <!-- Calibration Workflow Cards -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                                            <div class="flex items-center justify-between">
                                                <span class="font-bold text-slate-900 text-sm">VIP Guest NPS Lift
                                                    (+92)</span>
                                                <span
                                                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Endorsed</span>
                                            </div>
                                            <p class="text-xs text-slate-600">Supervisor Note: "Target is aggressive but
                                                achievable given Maria's strong rapport with presidential suite guests.
                                                Endorsed with 35% appraisal weight."</p>
                                            <div
                                                class="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                                                <span>Calibrated by Chef Marco</span>
                                                <span>Aug 02, 2026</span>
                                            </div>
                                        </div>

                                        <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                                            <div class="flex items-center justify-between">
                                                <span class="font-bold text-slate-900 text-sm">Fine Dining Upselling
                                                    (+18%)</span>
                                                <span
                                                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Endorsed</span>
                                            </div>
                                            <p class="text-xs text-slate-600">Supervisor Note: "Reviewed and calibrated
                                                against Micros POS historical evening covers. Sommelier pairing assigned
                                                for coaching support."</p>
                                            <div
                                                class="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                                                <span>Calibrated by Elena Vance</span>
                                                <span>Aug 03, 2026</span>
                                            </div>
                                        </div>

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
                            <div id="sub-perf-monitor" class="sub-panel sub-panel-perf space-y-4">

                                <!-- Continuous Progress Bar Header -->
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div class="card-clean p-4 space-y-2">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>VIP Check-in NPS</span>
                                            <span
                                                class="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">90%
                                                Met</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div class="bg-emerald-500 h-2 rounded-full" style="width: 90%"></div>
                                        </div>
                                        <p class="text-[11px] text-slate-400">Current NPS: +91.8 (Target: +92)</p>
                                    </div>

                                    <div class="card-clean p-4 space-y-2">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Wine Upsell Rev</span>
                                            <span
                                                class="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">65%
                                                Met</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div class="bg-amber-500 h-2 rounded-full" style="width: 65%"></div>
                                        </div>
                                        <p class="text-[11px] text-slate-400">Current Check Lift: +11.7% (Target: +18%)
                                        </p>
                                    </div>

                                    <div class="card-clean p-4 space-y-2">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>HACCP Sanitization</span>
                                            <span
                                                class="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">100%
                                                Met</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div class="bg-emerald-500 h-2 rounded-full" style="width: 100%"></div>
                                        </div>
                                        <p class="text-[11px] text-slate-400">0 Violations logged in 30 days</p>
                                    </div>
                                </div>

                                <!-- Continuous Activity Stream & Accomplishment / Challenge Log -->
                                <div class="card-clean p-6 space-y-4">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Continuous
                                                Monitoring Activity Stream</h3>
                                            <p class="text-xs text-slate-500">Record accomplishments, operational
                                                challenges, feedback notes, and evidence</p>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <button onclick="openModal('modal-ai-feedback')"
                                                class="btn-primary px-3.5 py-2 text-xs font-bold flex items-center space-x-1.5">
                                                <i class="fas fa-wand-magic-sparkles text-[11px]"></i>
                                                <span>AI Refiner</span>
                                            </button>
                                            <button onclick="logAchievementPrompt()"
                                                class="btn-secondary px-3.5 py-2 text-xs font-semibold">
                                                + Log Milestone
                                            </button>
                                        </div>
                                    </div>

                                    <div id="timeline-stream-container" class="space-y-3 text-xs">

                                        <div class="flex items-start space-x-3.5 group">
                                            <div class="flex flex-col items-center self-stretch">
                                                <div class="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 mt-1 flex-shrink-0"></div>
                                                <div class="w-0.5 flex-1 bg-slate-200 my-1 min-h-[36px]"></div>
                                            </div>
                                            <div class="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1">
                                                <div class="flex items-center justify-between">
                                                    <span class="font-bold text-slate-900">Accomplishment Logged: 100% Medallia 5-Star Rating</span>
                                                    <span class="text-slate-400">Aug 21 · 14:30</span>
                                                </div>
                                                <p class="text-slate-600">Presidential suite guest commendation logged for prompt champagne service and express check-in under 2 minutes.</p>
                                                <div class="pt-1 text-[11px] text-primary font-medium flex items-center space-x-1">
                                                    <i class="fas fa-paperclip"></i>
                                                    <span>Attached Evidence: Medallia_Guest_Card_#8842.pdf</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex items-start space-x-3.5 group">
                                            <div class="flex flex-col items-center self-stretch">
                                                <div class="w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-primary-100 mt-1 flex-shrink-0"></div>
                                                <div class="w-0.5 flex-1 bg-slate-200 my-1 min-h-[36px]"></div>
                                            </div>
                                            <div class="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1">
                                                <div class="flex items-center justify-between">
                                                    <span class="font-bold text-slate-900">Coaching Session: Sommelier Upselling Review</span>
                                                    <span class="text-slate-400">Aug 18 · 09:15</span>
                                                </div>
                                                <p class="text-slate-600">Supervisor Marco reviewed guest table conversation tactics for vintage wines with Maria. Action item: Shadow sommelier Pierre on Friday rush.</p>
                                            </div>
                                        </div>

                                        <div class="flex items-start space-x-3.5 group">
                                            <div class="flex flex-col items-center self-stretch">
                                                <div class="w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-amber-100 mt-1 flex-shrink-0"></div>
                                            </div>
                                            <div class="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1">
                                                <div class="flex items-center justify-between">
                                                    <span class="font-bold text-slate-900">Operational Challenge Logged: Micros POS Latency</span>
                                                    <span class="text-slate-400">Aug 12 · 20:00</span>
                                                </div>
                                                <p class="text-slate-600">Network lag during Friday peak rush caused 4-minute bill split delays. Escalated to IT engineering team.</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 4 SUB-PANEL: PERFORMANCE EVALUATION                 -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-eval" class="sub-panel sub-panel-perf space-y-4">
                                <div class="card-clean p-6 space-y-6">
                                    <div
                                        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div>
                                            <span
                                                class="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Phase
                                                4: Formal Evaluation</span>
                                            <h3 class="font-heading font-bold text-lg text-slate-900 mt-1">Multi-Factor
                                                Appraisal & Assessment</h3>
                                            <p class="text-xs text-slate-500">Employee self-assessment and supervisor
                                                ratings assessed against agreed objectives and competencies.</p>
                                        </div>
                                        <button onclick="openModal('modal-self-assessment')"
                                            class="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary-dark self-start sm:self-auto">
                                            <i class="fas fa-edit mr-1"></i> Open Appraisal Form
                                        </button>
                                    </div>

                                    <!-- Side-by-Side Ratings Grid -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div
                                            class="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                                            <div class="flex justify-between items-center">
                                                <span class="font-bold text-slate-600 uppercase text-[11px]">Employee
                                                    Self-Assessment</span>
                                                <span
                                                    class="text-xs font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">Submitted</span>
                                            </div>
                                            <div class="text-3xl font-heading font-bold text-primary">4.3 <span
                                                    class="text-sm font-normal text-slate-400">/ 5.0 (Advanced)</span>
                                            </div>
                                            <div class="space-y-1 text-slate-600">
                                                <p><strong>Guest Satisfaction:</strong> 4.8 / 5.0 ("Consistent adherence
                                                    to 5-star hotel check-in protocols")</p>
                                                <p><strong>PMS Speed:</strong> 4.5 / 5.0 ("Maintained under 2-min
                                                    check-in time")</p>
                                                <p><strong>Conflict De-escalation:</strong> 3.8 / 5.0 ("Handled rain
                                                    delay smoothly; requesting coaching")</p>
                                            </div>
                                        </div>

                                        <div
                                            class="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                                            <div class="flex justify-between items-center">
                                                <span class="font-bold text-slate-600 uppercase text-[11px]">Supervisor
                                                    Assessment</span>
                                                <span
                                                    class="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Rated</span>
                                            </div>
                                            <div class="text-3xl font-heading font-bold text-slate-900">4.6 <span
                                                    class="text-sm font-normal text-slate-400">/ 5.0 (Master
                                                    Tier)</span></div>
                                            <div class="space-y-1 text-slate-600">
                                                <p><strong>Supervisor Recommendation:</strong> "Maria is one of our top
                                                    guest ambassadors. High aptitude for Front Desk Lead promotion
                                                    track."</p>
                                                <p><strong>Target Area:</strong> "Wine pairing upselling to be
                                                    reinforced in Q4 IDP."</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Peer 360 Feedback Summary -->
                                    <div
                                        class="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2 text-xs">
                                        <div class="flex justify-between items-center font-bold text-purple-950">
                                            <span>Hospitality 360° Peer Feedback Commendations</span>
                                            <span class="text-purple-700">4 Reviews Received</span>
                                        </div>
                                        <p class="text-slate-700 leading-relaxed">"Maria demonstrates exemplary poise
                                            under pressure. Always steps in to assist banquet hosts when lobby queues
                                            form." — <em>Carlos Gomez (Concierge Host)</em></p>
                                    </div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 5 SUB-PANEL: REVIEW & CALIBRATION APPROVAL          -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-review" class="sub-panel sub-panel-perf space-y-4">
                                <div class="card-clean p-6 space-y-6">
                                    <div
                                        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div>
                                            <span
                                                class="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Phase
                                                5: Calibration & Approval</span>
                                            <h3 class="font-heading font-bold text-lg text-slate-900 mt-1">1-on-1
                                                Discussion & Calibration Approval</h3>
                                            <p class="text-xs text-slate-500">Employee and supervisor discuss evaluation
                                                results, normalize ratings, and record final approved score.</p>
                                        </div>
                                        <span
                                            class="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl self-start sm:self-auto">
                                            <i class="fas fa-check-circle mr-1"></i> Calibrated & Approved
                                        </span>
                                    </div>

                                    <!-- 1-on-1 Discussion Minutes & Rating Record -->
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                                            <p class="font-bold text-slate-900 text-sm">Final Calibrated Score</p>
                                            <p class="text-3xl font-heading font-bold text-emerald-600">4.55 <span
                                                    class="text-xs font-normal text-slate-400">/ 5.0</span></p>
                                            <p class="text-[11px] text-slate-500">Grade: <strong>Tier 1 · Exceeds
                                                    Expectations</strong></p>
                                        </div>

                                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                                            <p class="font-bold text-slate-900 text-sm">Discussion Minutes</p>
                                            <p class="text-slate-600 leading-relaxed text-[11px]">1-on-1 session
                                                conducted on Aug 23. Employee acknowledged strengths in VIP protocol and
                                                agreed on wine upselling focus.</p>
                                        </div>

                                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                                            <p class="font-bold text-slate-900 text-sm">Digital Sign-off Record</p>
                                            <p class="text-[11px] text-slate-600">Employee Signed: <strong>Maria
                                                    Santos</strong> (Aug 23, 2026)</p>
                                            <p class="text-[11px] text-slate-600">Supervisor Endorsed: <strong>Marco
                                                    Rossi</strong> (Aug 23, 2026)</p>
                                            <p class="text-[11px] text-slate-600">HR Recorded: <strong>Elena
                                                    Vance</strong> (Aug 23, 2026)</p>
                                        </div>
                                    </div>

                                    <!-- Qualitative Social Recognition Feedback Input -->
                                    <div id="perf-qualitative-recognition-container">
                                        <!-- Rendered by js/kudos.js -->
                                    </div>

                                    <div
                                        class="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
                                        <span>Evaluation results have been finalized. Proceed to create the Individual
                                            Development Plan.</span>
                                        <button onclick="switchSubTab('perf', 'idp')"
                                            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition">
                                            Create Development Plan &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 6 SUB-PANEL: DEVELOPMENT PLANNING (IDP)             -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-idp" class="sub-panel sub-panel-perf space-y-5">
                                <div class="card-clean p-6 space-y-6">
                                    <!-- Header -->
                                    <div
                                        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div>
                                            <span
                                                class="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Phase
                                                6: Development Planning</span>
                                            <h3 class="font-heading font-bold text-lg text-slate-900 mt-1">70-20-10
                                                Individual Development Plan (IDP)</h3>
                                            <p class="text-xs text-slate-500 mt-0.5">Based on appraisal results, employee
                                                strengths and development gaps are mapped to tailored 70-20-10 learning actions.</p>
                                        </div>
                                        <div class="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                                            <button onclick="openRemedialBooksModal('maria')"
                                                class="px-3.5 py-2 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition">
                                                <i class="fas fa-book-medical"></i>
                                                <span>Prescribe LMS Books (&lt; 3.0)</span>
                                            </button>
                                            <button onclick="openModal('modal-ai-feedback')"
                                                class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-1.5">
                                                <i class="fas fa-plus"></i>
                                                <span>Add IDP Action</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Strengths vs Gaps Breakdown with < 3.0 Alert Banner -->
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                                        <!-- Strengths Card -->
                                        <div class="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-3">
                                            <div class="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                                                <span class="font-bold text-emerald-950 text-xs flex items-center">
                                                    <i class="fas fa-award mr-2 text-emerald-600 text-sm"></i>
                                                    Identified Strengths & Core Competencies
                                                </span>
                                                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">3 Calibrated</span>
                                            </div>
                                            <ul class="space-y-2 text-slate-700">
                                                <li class="p-2.5 bg-white/90 rounded-xl border border-emerald-100 flex items-center justify-between">
                                                    <span class="flex items-center space-x-2">
                                                        <i class="fas fa-circle-check text-emerald-600 text-xs"></i>
                                                        <span class="font-medium text-slate-900">VIP Guest Greeting & 5-Star Protocol</span>
                                                    </span>
                                                    <span class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">4.8 / 5.0</span>
                                                </li>
                                                <li class="p-2.5 bg-white/90 rounded-xl border border-emerald-100 flex items-center justify-between">
                                                    <span class="flex items-center space-x-2">
                                                        <i class="fas fa-circle-check text-emerald-600 text-xs"></i>
                                                        <span class="font-medium text-slate-900">Opera PMS Reservation Speed & Accuracy</span>
                                                    </span>
                                                    <span class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">4.5 / 5.0</span>
                                                </li>
                                                <li class="p-2.5 bg-white/90 rounded-xl border border-emerald-100 flex items-center justify-between">
                                                    <span class="flex items-center space-x-2">
                                                        <i class="fas fa-circle-check text-emerald-600 text-xs"></i>
                                                        <span class="font-medium text-slate-900">HACCP Cold-chain Safety Compliance</span>
                                                    </span>
                                                    <span class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">5.0 / 5.0</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <!-- Gaps Card -->
                                        <div class="p-5 bg-amber-50/40 rounded-2xl border border-amber-200/80 space-y-3">
                                            <div class="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
                                                <span class="font-bold text-amber-950 text-xs flex items-center">
                                                    <i class="fas fa-triangle-exclamation mr-2 text-amber-600 text-sm"></i>
                                                    Development Gaps (&lt; 3.0 Threshold)
                                                </span>
                                                <span class="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Action Required</span>
                                            </div>
                                            <ul class="space-y-2 text-slate-700">
                                                <li class="p-2.5 bg-white/90 rounded-xl border border-amber-200/70 flex items-center justify-between gap-2">
                                                    <div class="flex items-center space-x-2 min-w-0">
                                                        <i class="fas fa-circle-exclamation text-red-600 text-xs flex-shrink-0"></i>
                                                        <div class="truncate">
                                                            <p class="font-semibold text-slate-900 text-xs truncate">French & Italian Wine Pairing</p>
                                                            <p class="text-[10px] text-red-600 font-bold">Appraisal Rating: 2.40 / 5.0</p>
                                                        </div>
                                                    </div>
                                                    <button onclick="openRemedialBooksModal('maria')" class="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-[10px] flex-shrink-0 transition flex items-center space-x-1">
                                                        <i class="fas fa-book-medical text-[10px]"></i>
                                                        <span>Prescribe</span>
                                                    </button>
                                                </li>
                                                <li class="p-2.5 bg-white/90 rounded-xl border border-amber-200/70 flex items-center justify-between gap-2">
                                                    <div class="flex items-center space-x-2 min-w-0">
                                                        <i class="fas fa-circle-exclamation text-red-600 text-xs flex-shrink-0"></i>
                                                        <div class="truncate">
                                                            <p class="font-semibold text-slate-900 text-xs truncate">Banquet Floor Rush Delegation</p>
                                                            <p class="text-[10px] text-red-600 font-bold">Appraisal Rating: 2.80 / 5.0</p>
                                                        </div>
                                                    </div>
                                                    <button onclick="openRemedialBooksModal('maria')" class="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-[10px] flex-shrink-0 transition flex items-center space-x-1">
                                                        <i class="fas fa-book-medical text-[10px]"></i>
                                                        <span>Prescribe</span>
                                                    </button>
                                                </li>
                                                <li class="p-2.5 bg-white/90 rounded-xl border border-amber-200/70 flex items-center justify-between gap-2">
                                                    <div class="flex items-center space-x-2 min-w-0">
                                                        <i class="fas fa-circle-exclamation text-amber-600 text-xs flex-shrink-0"></i>
                                                        <div class="truncate">
                                                            <p class="font-semibold text-slate-900 text-xs truncate">Micros POS Advanced Split Billing</p>
                                                            <p class="text-[10px] text-amber-700 font-bold">Competency Gap: -0.5 Level</p>
                                                        </div>
                                                    </div>
                                                    <button onclick="openRemedialBooksModal('maria')" class="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-[10px] flex-shrink-0 transition flex items-center space-x-1">
                                                        <i class="fas fa-book-medical text-[10px]"></i>
                                                        <span>Prescribe</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- 70-20-10 IDP Plan Cards Section -->
                                    <div class="space-y-3.5 text-xs">
                                        <div class="flex items-center justify-between border-t border-slate-100 pt-4">
                                            <div>
                                                <h4 class="font-heading font-bold text-slate-900 text-sm">70-20-10 Active Development Commitments</h4>
                                                <p class="text-slate-500 text-[11px]">Experiential, Mentorship & Formal LMS actions mapped for Q3/Q4 growth</p>
                                            </div>
                                            <button onclick="openRemedialBooksModal('maria')" class="text-xs text-primary font-bold hover:underline flex items-center space-x-1">
                                                <i class="fas fa-book-bookmark text-[11px]"></i>
                                                <span>Browse All LMS Books &rarr;</span>
                                            </button>
                                        </div>

                                        <div id="idp-perf-commitments-container" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <!-- 70% Experiential Card -->
                                            <div class="p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 transition shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-3">
                                                <div class="space-y-2">
                                                    <div class="flex items-center justify-between">
                                                        <span class="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">70% Experiential</span>
                                                        <span class="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">On-the-Job</span>
                                                    </div>
                                                    <h5 class="font-heading font-bold text-slate-900 text-sm">Lead Front Desk Shift during Film Festival</h5>
                                                    <p class="text-slate-600 text-xs leading-relaxed">Take charge of VIP queue dispatch and suite allocation for 4 consecutive days.</p>
                                                </div>
                                                <div class="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                                                    <span class="text-slate-400 text-[11px]"><i class="fas fa-calendar-check mr-1"></i>4 Days Active</span>
                                                    <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl">In Progress (60%)</span>
                                                </div>
                                            </div>

                                            <!-- 20% Social Card -->
                                            <div class="p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 transition shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-3">
                                                <div class="space-y-2">
                                                    <div class="flex items-center justify-between">
                                                        <span class="text-[10px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">20% Social</span>
                                                        <span class="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Mentorship</span>
                                                    </div>
                                                    <h5 class="font-heading font-bold text-slate-900 text-sm">Sommelier Shadowing with Pierre Dubois</h5>
                                                    <p class="text-slate-600 text-xs leading-relaxed">Shadow master sommelier during Friday evening wine service to master wine pairing descriptors.</p>
                                                </div>
                                                <div class="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                                                    <span class="text-slate-400 text-[11px]"><i class="fas fa-user-tie mr-1"></i>Master Pierre</span>
                                                    <span class="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-xl">Scheduled</span>
                                                </div>
                                            </div>

                                            <!-- 10% Formal Card -->
                                            <div class="p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-3">
                                                <div class="space-y-2">
                                                    <div class="flex items-center justify-between">
                                                        <span class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">10% Formal</span>
                                                        <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">LMS Courses</span>
                                                    </div>
                                                    <h5 class="font-heading font-bold text-slate-900 text-sm">Certified Wine Knowledge Level 2</h5>
                                                    <p class="text-slate-600 text-xs leading-relaxed">Complete modular LMS course & service recovery handbook to pass knowledge quiz (+100 XP).</p>
                                                </div>
                                                <div class="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                                                    <span class="text-slate-400 text-[11px]"><i class="fas fa-graduation-cap mr-1"></i>+100 XP</span>
                                                    <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">Enrolled in LMS</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- ======================================================== -->
                            <!-- STAGE 7 SUB-PANEL: IMPLEMENTATION & NEXT CYCLE            -->
                            <!-- ======================================================== -->
                            <div id="sub-perf-cycle" class="sub-panel sub-panel-perf space-y-4">
                                <div class="card-clean p-6 space-y-6">
                                    <div
                                        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div>
                                            <span
                                                class="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">Phase
                                                7: Next Cycle Transition</span>
                                            <h3 class="font-heading font-bold text-lg text-slate-900 mt-1">Development
                                                Monitoring & Next Cycle Initiation</h3>
                                            <p class="text-xs text-slate-500">Progress is verified, newly mastered
                                                capabilities feed into elevated targets, closing the continuous loop.
                                            </p>
                                        </div>
                                        <span
                                            class="text-xs bg-teal-100 text-teal-800 font-bold px-3 py-1.5 rounded-xl self-start sm:self-auto">
                                            <i class="fas fa-rotate mr-1"></i> Continuous Loop Active
                                        </span>
                                    </div>

                                    <!-- Progress to Next Cycle Card -->
                                    <div
                                        class="card-hero p-6 bg-white space-y-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <span class="badge-sage">Continuous Growth Metric</span>
                                                <h4 class="font-heading font-bold text-xl text-slate-900 mt-1">Development to Performance Transfer</h4>
                                            </div>
                                            <span class="text-2xl font-bold text-sage-dark font-heading">+14.2% Lift</span>
                                        </div>
                                        <p class="text-xs text-slate-600 leading-relaxed">By undertaking the 70-20-10 IDP activities, Maria achieved a 14.2% performance lift in guest check-in speed and unlocked the <strong>Front Office Lead</strong> competency badge. These achievements will form the elevated baseline for the <strong>2026 Q4 Cycle</strong>.</p>

                                        <div
                                            class="pt-3 border-t border-[#E8DEDC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <span class="text-xs text-slate-500"><i
                                                    class="fas fa-check text-sage-dark mr-1.5"></i> All 7 lifecycle phases completed for 2026 Q3</span>
                                            <button
                                                onclick="switchSubTab('perf', 'plan'); showToast('Loaded next performance planning cycle (Q4)!', 'success');"
                                                class="btn-primary px-5 py-2.5 text-xs font-bold transition flex items-center space-x-2">
                                                <span>Initiate Next Performance Cycle (Q4)</span>
                                                <i class="fas fa-arrow-right text-[10px]"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Continuous Process Flow Reminder Card -->
                                    <div
                                        class="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-700">
                                        <p class="font-bold text-slate-900 text-sm"><i
                                                class="fas fa-infinity text-primary mr-1.5"></i> Continuous Cycle
                                            Architecture Summary:</p>
                                        <p class="leading-relaxed">
                                            <span class="font-semibold text-slate-900">Set Goals</span> &rarr;
                                            <span class="font-semibold text-slate-900">Approve Goals</span> &rarr;
                                            <span class="font-semibold text-slate-900">Monitor Performance</span> &rarr;
                                            <span class="font-semibold text-slate-900">Evaluate</span> &rarr;
                                            <span class="font-semibold text-slate-900">Review/Approve Results</span>
                                            &rarr;
                                            <span class="font-semibold text-slate-900">Create Development Plan</span>
                                            &rarr;
                                            <span class="font-semibold text-slate-900">Implement Development</span>
                                            &rarr;
                                            <span class="font-semibold text-slate-900">Monitor Progress</span> &rarr;
                                            <span class="font-semibold text-primary font-bold">Next Performance
                                                Cycle</span>
                                        </p>
                                        <p class="text-slate-500 text-[11px]">The module creates an ongoing feedback
                                            loop where appraisal results directly fuel capability development and future
                                            hospitality excellence.</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- ======================================================== -->
                        <!-- PILLAR 2: COMPETENCY MANAGEMENT                          -->
