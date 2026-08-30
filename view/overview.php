<!-- ======================================================== -->
                        <div id="panel-dashboard" class="pillar-panel active space-y-6">

                            <!-- Top Sub-Navigation Pills (Overview Hub Sub-tabs) -->
                            <div
                                class="subnav-track flex items-center justify-between gap-2 p-1.5 overflow-x-auto custom-scrollbar">
                                <div class="flex items-center space-x-1.5 flex-nowrap">
                                    <button onclick="switchSubTab('dashboard', 'pulse')"
                                        class="subnav-pill subnav-dashboard active whitespace-nowrap" data-sub="pulse">
                                        <i class="fas fa-user-clock mr-1.5 text-primary"></i>
                                        <span>1. Shift Focus &amp; My Pulse</span>
                                    </button>
                                    <button onclick="switchSubTab('dashboard', 'system')"
                                        class="subnav-pill subnav-dashboard whitespace-nowrap" data-sub="system">
                                        <i class="fas fa-chart-line mr-1.5 text-dusty-dark"></i>
                                        <span>2. System &amp; Property Analytics</span>
                                    </button>
                                </div>
                                <div class="flex items-center space-x-2 flex-shrink-0">
                                    <span class="text-[11px] font-semibold text-slate-500 hidden sm:inline">Oxford Suites Makati · Live Workplace</span>
                                </div>
                            </div>

                            <!-- SUB-TAB 1: INDIVIDUAL SHIFT FOCUS & MY PULSE -->
                            <div id="sub-dashboard-pulse" class="sub-panel-dashboard active space-y-6">

                                <!-- 1. Focused "Today's Shift Action" Card -->
                                <div
                                    class="card-hero p-6 relative overflow-hidden bg-white">
                                    <div
                                        class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div class="space-y-1.5">
                                            <div
                                                class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF8F7] text-slate-700 text-[11px] font-semibold border border-[#E8DEDC]">
                                                <span
                                                    class="w-1.5 h-1.5 rounded-full bg-sage-dark animate-pulse"></span>
                                                <span>On Shift: 07:00 - 15:30 · Front Office</span>
                                            </div>
                                            <h2 id="hero-greeting-text"
                                                class="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
                                                Good morning, Maria Santos 👋</h2>
                                            <p class="text-xs text-slate-500">You have <strong>1 milestone review</strong> and <strong>1 LMS handbook</strong> scheduled for calibration this week.</p>
                                        </div>
                                        <div class="flex items-center gap-2.5 flex-wrap">
                                            <button onclick="openModal('modal-create-goal')"
                                                class="btn-primary px-4 py-2.5 text-xs font-bold flex items-center space-x-2">
                                                <i class="fas fa-plus text-xs"></i>
                                                <span>Set New Goal</span>
                                            </button>
                                            <button onclick="openModal('modal-self-assessment')"
                                                class="btn-secondary px-4 py-2.5 text-xs font-semibold">
                                                <span>Quarterly Review</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- 4 Clean KPI Metric Cards -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                    <!-- KPI 1 -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Hospitality Index</span>
                                            <span class="badge-sage">+4.2%</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900">89.4%</span>
                                            <span class="text-xs text-slate-400">Target: 85%</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div class="bg-primary h-1.5 rounded-full" style="width: 89.4%">
                                            </div>
                                        </div>
                                        <p class="text-[11px] text-slate-400">Continuous evaluation active</p>
                                    </div>

                                    <!-- KPI 2 -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Q3 Goals Progress</span>
                                            <span id="kpi-goals-ratio"
                                                class="badge-sage">6 of 8 Done</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900">75%</span>
                                            <span class="text-xs text-sage-dark font-semibold"><i
                                                    class="fas fa-check"></i> On Track</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div class="bg-sage h-1.5 rounded-full" style="width: 75%">
                                            </div>
                                        </div>
                                        <p class="text-[11px] text-slate-400">2 goals in progress</p>
                                    </div>

                                    <!-- KPI 3 -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Competency Matrix</span>
                                            <span class="badge-dusty">Level 4</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900">4.3<span
                                                    class="text-base text-slate-400 font-normal">/5</span></span>
                                            <span class="text-xs text-dusty-dark font-semibold">Senior Tier</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div class="bg-dusty h-1.5 rounded-full" style="width: 86%">
                                            </div>
                                        </div>
                                        <p class="text-[11px] text-slate-400">Lead Host promotion track</p>
                                    </div>

                                    <!-- KPI 4 -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Gamified XP</span>
                                            <span id="kpi-xp-level-badge" class="badge-gold">Level 2</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span id="kpi-xp-val"
                                                class="text-3xl font-heading font-bold text-gold-dark">300
                                                <span class="text-xs font-normal text-slate-400">XP</span></span>
                                            <span id="kpi-xp-title" class="text-xs text-slate-500 font-semibold">Bronze Host</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div id="kpi-xp-bar" class="bg-gold h-1.5 rounded-full"
                                                style="width: 20%">
                                            </div>
                                        </div>
                                        <p id="kpi-xp-subtitle" class="text-[11px] text-slate-400">200 XP to Silver Tier</p>
                                    </div>

                                </div>

                                <!-- Individual Performance Objectives Card (Live Supabase Data) -->
                                <div class="card-clean p-6 space-y-4">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                        <div class="space-y-0.5">
                                            <div class="flex items-center space-x-2">
                                                <h3 class="font-heading font-bold text-base text-slate-900">
                                                    My Active Performance Objectives</h3>
                                                <span id="emp-pulse-goals-count" class="badge-primary">0 Goals</span>
                                            </div>
                                            <p class="text-xs text-slate-500">Self-set target metrics awaiting supervisor calibration or actively tracked for Q3.</p>
                                        </div>
                                        <button onclick="openModal('modal-create-goal')"
                                            class="btn-primary px-3.5 py-1.5 text-xs font-bold inline-flex items-center space-x-1.5 self-start sm:self-auto shadow-2xs">
                                            <i class="fas fa-plus text-xs"></i>
                                            <span>Set Performance Objective</span>
                                        </button>
                                    </div>
                                    <div id="emp-pulse-goals-container" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <!-- Dynamic live goals loaded from Supabase -->
                                    </div>
                                </div>

                                <!-- Employee Specific Evaluated Competencies Card -->
                                <div class="card-clean p-6 space-y-4">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                        <div class="space-y-0.5">
                                            <div class="flex items-center space-x-2">
                                                <h3 class="font-heading font-bold text-base text-slate-900">
                                                    My Evaluated Competencies &amp; Standards</h3>
                                                <span id="emp-overview-comp-count" class="badge-dusty">4 Assigned Competencies</span>
                                            </div>
                                            <p class="text-xs text-slate-500">Baseline competency ratings and target benchmarks specifically evaluated for your position.</p>
                                        </div>
                                        <button onclick="switchPillar('pillar-comp')"
                                            class="px-3.5 py-1.5 bg-[#FAF8F7] hover:bg-slate-100 border border-[#E8DEDC] text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 transition">
                                            <i class="fas fa-cubes text-xs text-primary"></i>
                                            <span>View Full Competency Radar</span>
                                        </button>
                                    </div>
                                    <div id="emp-overview-competencies-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <!-- Employee specific competencies rendered dynamically -->
                                    </div>
                                </div>


                                <!-- 2-Column: Key Trends + Shift Climate (Balanced Side-by-Side) -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                    <!-- Quality & KPI Trend Line Chart -->
                                    <div class="card-clean p-6 space-y-3">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="font-heading font-bold text-base text-slate-900">
                                                    Hospitality KPI &amp; Performance Trend</h3>
                                                <p class="text-xs text-slate-500">6-Month Continuous Score vs. Hotel 85% Standard</p>
                                            </div>
                                            <span class="badge-primary">2026 Q3</span>
                                        </div>
                                        <div class="h-60 w-full">
                                            <canvas id="chart-performance-trend"></canvas>
                                        </div>
                                    </div>

                                    <!-- Realtime Shift Climate Doughnut -->
                                    <div class="card-clean p-6 space-y-3">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="font-heading font-bold text-base text-slate-900">
                                                    Shift Climate Pulse</h3>
                                                <p class="text-xs text-slate-500">Aggregated Employee Sentiment</p>
                                            </div>
                                            <button onclick="openModal('modal-sentiment-pulse')"
                                                class="text-xs font-bold text-primary hover:underline">+ Vote</button>
                                        </div>
                                        <div class="h-48 w-full flex items-center justify-center">
                                            <canvas id="chart-sentiment-doughnut"></canvas>
                                        </div>
                                        <div
                                            class="flex justify-around text-center text-xs pt-3 border-t border-[#E8DEDC]">
                                            <div>
                                                <p class="font-bold text-sage-dark">68.5%</p>
                                                <p class="text-[10px] text-slate-500">Smooth</p>
                                            </div>
                                            <div>
                                                <p class="font-bold text-dusty-dark">23.0%</p>
                                                <p class="text-[10px] text-slate-500">Manageable</p>
                                            </div>
                                            <div>
                                                <p class="font-bold text-terracotta-dark">8.5%</p>
                                                <p class="text-[10px] text-slate-500">Friction</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <!-- 6 Fast Module Cards -->
                                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                    <div onclick="switchPillar('pillar-perf')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition group">
                                        <i class="fas fa-bullseye text-primary text-xl mb-2 group-hover:scale-105 transition-transform"></i>
                                        <p class="font-bold text-xs text-slate-900">1. Performance</p>
                                        <p class="text-[10px] text-slate-500">7-Step Cycle</p>
                                    </div>
                                    <div onclick="switchPillar('pillar-comp')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition group">
                                        <i class="fas fa-cubes text-dusty-dark text-xl mb-2 group-hover:scale-105 transition-transform"></i>
                                        <p class="font-bold text-xs text-slate-900">2. Competency</p>
                                        <p class="text-[10px] text-slate-500">Radar &amp; Gaps</p>
                                    </div>
                                    <div onclick="switchPillar('pillar-lms')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition group">
                                        <i class="fas fa-graduation-cap text-sage-dark text-xl mb-2 group-hover:scale-105 transition-transform"></i>
                                        <p class="font-bold text-xs text-slate-900">3. Learning LMS</p>
                                        <p class="text-[10px] text-slate-500">TNA &amp; Quizzes</p>
                                    </div>
                                    <div onclick="switchPillar('pillar-training')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition group">
                                        <i class="fas fa-chalkboard-user text-terracotta text-xl mb-2 group-hover:scale-105 transition-transform"></i>
                                        <p class="font-bold text-xs text-slate-900">4. Training Ops</p>
                                        <p class="text-[10px] text-slate-500">12 Functions</p>
                                    </div>
                                    <div onclick="switchPillar('pillar-succession')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition group">
                                        <i class="fas fa-sitemap text-dusty-dark text-xl mb-2 group-hover:scale-105 transition-transform"></i>
                                        <p class="font-bold text-xs text-slate-900">5. Succession</p>
                                        <p class="text-[10px] text-slate-500">9-Box Bench</p>
                                    </div>
                                    <div onclick="switchPillar('pillar-social')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition group">
                                        <i class="fas fa-trophy text-gold text-xl mb-2 group-hover:scale-105 transition-transform"></i>
                                        <p class="font-bold text-xs text-slate-900">6. Kudos &amp; XP</p>
                                        <p class="text-[10px] text-slate-500">Social Climate</p>
                                    </div>
                                </div>

                            </div>

                            <!-- SUB-TAB 2: SYSTEM & PROPERTY ANALYTICS (Organization-Wide Overview) -->
                            <div id="sub-dashboard-system" class="sub-panel-dashboard space-y-6">

                                <!-- System Overview Banner -->
                                <div
                                    class="card-clean p-6 bg-white border border-[#E8DEDC] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div class="space-y-1">
                                        <div class="flex items-center space-x-2">
                                            <span class="w-2.5 h-2.5 rounded-full bg-sage"></span>
                                            <span
                                                class="text-xs font-bold text-slate-900 uppercase tracking-wide">Property-Wide HR Operating Metrics</span>
                                            <span class="badge-neutral">All 100 Associates</span>
                                        </div>
                                        <h2 class="text-xl sm:text-2xl font-heading font-bold text-slate-900">
                                            Workforce Health &amp; Execution Velocity</h2>
                                        <p class="text-xs text-slate-500">Telemetry across all 5 departments: goal approvals, LMS certification, and succession pipeline readiness.</p>
                                    </div>
                                    <div class="flex items-center space-x-2 self-start md:self-auto flex-shrink-0">
                                        <button
                                            onclick="showToast('System metrics report exported successfully.', 'success')"
                                            class="btn-secondary px-4 py-2 text-xs font-semibold">
                                            <i class="fas fa-file-export text-xs text-slate-500"></i>
                                            <span>Export Summary</span>
                                        </button>
                                        <button onclick="openModal('modal-sentiment-pulse')"
                                            class="btn-primary px-4 py-2 text-xs font-bold">
                                            <i class="fas fa-bolt text-xs"></i>
                                            <span>Property Audit</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- 4 Master System-Wide KPI Cards -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                    <!-- System KPI 1: Approved Goals Count -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Goal Approval Rate</span>
                                            <span class="badge-sage">93.6% Approved</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900">248
                                                <span class="text-sm font-normal text-slate-400">/ 265</span></span>
                                            <span class="text-xs text-sage-dark font-semibold">+8.4% YoY</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div class="bg-sage h-1.5 rounded-full" style="width: 93.6%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500">
                                            <span>248 Approved</span>
                                            <span class="text-gold-dark font-medium">12 In Review</span>
                                            <span class="text-slate-400">5 Revise</span>
                                        </div>
                                    </div>

                                    <!-- System KPI 2: Total Gamified XP -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Total Property XP</span>
                                            <span class="badge-gold">Grade A+</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-gold-dark">84,620
                                                <span class="text-xs font-normal text-slate-400">XP</span></span>
                                            <span class="text-xs text-slate-500 font-medium">100 Staff</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div class="bg-gold h-1.5 rounded-full" style="width: 85%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500">
                                            <span>842 Kudos Sent</span>
                                            <span class="text-gold-dark font-medium">1,120 Badges</span>
                                        </div>
                                    </div>

                                    <!-- System KPI 3: Average LMS Completion Rate -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>LMS Course Completion</span>
                                            <span class="badge-primary">94.2% Rate</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900">94.2%</span>
                                            <span class="text-xs text-slate-400">Target: 90.0%</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div class="bg-primary h-1.5 rounded-full" style="width: 94.2%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500">
                                            <span>471 / 500 Modules</span>
                                            <span class="text-sage-dark font-medium">92.4% Avg Score</span>
                                        </div>
                                    </div>

                                    <!-- System KPI 4: Succession Pipeline Health Rate -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Succession Bench Depth</span>
                                            <span class="badge-dusty">78.5% Ready</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900">78.5%</span>
                                            <span class="text-xs text-dusty-dark font-semibold">Low Risk</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div class="bg-dusty h-1.5 rounded-full" style="width: 78.5%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500">
                                            <span>14 Key Roles Covered</span>
                                            <span class="text-slate-400">2 In Fast-Track</span>
                                        </div>
                                    </div>

                                </div>

                                <!-- 2-Column: Top 5 Gamified XP Leaderboard + Department Multi-Metric Matrix -->
                                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                                    <!-- Column 1: Top 5 Highest Gamified XP Staff Leaderboard (5 cols) -->
                                    <div class="lg:col-span-5 card-clean p-6 space-y-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="font-heading font-bold text-base text-slate-900">Top 5 Gamified XP Champions</h3>
                                                <p class="text-xs text-slate-500">Highest accumulated recognition points &amp; badges</p>
                                            </div>
                                            <span class="badge-gold">Property Top 5</span>
                                        </div>

                                        <!-- Top 5 Vertical Bar Podium (Names & Stars on Top - Clean Solid Palette) -->
                                        <div class="bg-[#FAF8F7] border border-[#E8DEDC] rounded-2xl p-3.5 sm:p-5">
                                            <div class="relative pt-2">
                                                <!-- Connecting Horizontal Bar behind pillars -->
                                                <div
                                                    class="absolute bottom-11 left-0 right-0 h-2.5 bg-[#E8DEDC] rounded-full z-0 hidden sm:block">
                                                </div>

                                                <!-- 5 Stepped Vertical Columns -->
                                                <div class="grid grid-cols-5 gap-2 sm:gap-3.5 items-end relative z-10">

                                                    <!-- 01: FIRST - Elena Vance (Rank 1) -->
                                                    <div
                                                        class="flex flex-col items-center justify-end text-center group cursor-pointer">
                                                        <!-- Top Header: Name & Star -->
                                                        <div class="mb-2 flex flex-col items-center space-y-1 w-full">
                                                            <div
                                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                                                                EV
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full"
                                                                title="Elena Vance">Elena</p>
                                                            <span
                                                                class="text-[8px] sm:text-[9px] font-bold text-gold-dark bg-gold-50 px-1.5 py-0.2 rounded-full border border-gold-100">2.8k
                                                                XP</span>
                                                            <!-- Star -->
                                                            <div
                                                                class="pt-0.5 text-gold text-sm sm:text-lg animate-bounce drop-shadow-xs">
                                                                <i class="fas fa-star"></i>
                                                            </div>
                                                        </div>

                                                        <!-- Vertical Pillar Bar (Rank 1: Tallest) -->
                                                        <div
                                                            class="w-full h-44 sm:h-52 rounded-t-xl sm:rounded-t-2xl bg-gold shadow-sm group-hover:shadow-md group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t-2 border-white/40">
                                                            <div
                                                                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-black/15 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                                                                01
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p
                                                                    class="text-[9px] sm:text-[10px] font-bold text-white leading-tight">
                                                                    2,840</p>
                                                                <span
                                                                    class="text-[7px] sm:text-[8px] font-semibold bg-black/25 text-white px-1 py-0.2 rounded-full inline-block">14
                                                                    🏆</span>
                                                            </div>
                                                        </div>

                                                        <!-- Bottom Label -->
                                                        <div
                                                            class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                                                            <span
                                                                class="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-gold-dark uppercase">FIRST</span>
                                                            <p
                                                                class="text-[8px] text-slate-400 font-medium hidden sm:block">
                                                                HR Dir</p>
                                                        </div>
                                                    </div>

                                                    <!-- 02: SECOND - Chef Marco (Rank 2) -->
                                                    <div
                                                        class="flex flex-col items-center justify-end text-center group cursor-pointer">
                                                        <!-- Top Header: Name & Star -->
                                                        <div class="mb-2 flex flex-col items-center space-y-1 w-full">
                                                            <div
                                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-terracotta text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                                                                CM
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full"
                                                                title="Chef Marco">Marco</p>
                                                            <span
                                                                class="text-[8px] sm:text-[9px] font-bold text-terracotta-dark bg-terracotta-50 px-1.5 py-0.2 rounded-full border border-terracotta-100">2.4k
                                                                XP</span>
                                                            <!-- Star -->
                                                            <div
                                                                class="pt-0.5 text-gold text-sm sm:text-lg drop-shadow-xs">
                                                                <i class="fas fa-star"></i>
                                                            </div>
                                                        </div>

                                                        <!-- Vertical Pillar Bar (Rank 2) -->
                                                        <div
                                                            class="w-full h-36 sm:h-44 rounded-t-xl sm:rounded-t-2xl bg-terracotta shadow-sm group-hover:shadow-md group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t-2 border-white/40">
                                                            <div
                                                                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-black/15 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                                                                02
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p
                                                                    class="text-[9px] sm:text-[10px] font-bold text-white leading-tight">
                                                                    2,450</p>
                                                                <span
                                                                    class="text-[7px] sm:text-[8px] font-semibold bg-black/25 text-white px-1 py-0.2 rounded-full inline-block">12
                                                                    🏆</span>
                                                            </div>
                                                        </div>

                                                        <!-- Bottom Label -->
                                                        <div
                                                            class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                                                            <span
                                                                class="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-terracotta uppercase">SECOND</span>
                                                            <p
                                                                class="text-[8px] text-slate-400 font-medium hidden sm:block">
                                                                Culinary</p>
                                                        </div>
                                                    </div>

                                                    <!-- 03: THIRD - Ana Tanaka (Rank 3) -->
                                                    <div
                                                        class="flex flex-col items-center justify-end text-center group cursor-pointer">
                                                        <!-- Top Header: Name & Star -->
                                                        <div class="mb-2 flex flex-col items-center space-y-1 w-full">
                                                            <div
                                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sage-dark text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                                                                AT
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full"
                                                                title="Ana Tanaka">Ana</p>
                                                            <span
                                                                class="text-[8px] sm:text-[9px] font-bold text-sage-dark bg-sage-50 px-1.5 py-0.2 rounded-full border border-sage-100">2.1k
                                                                XP</span>
                                                            <!-- Star -->
                                                            <div
                                                                class="pt-0.5 text-gold text-sm sm:text-lg drop-shadow-xs">
                                                                <i class="fas fa-star"></i>
                                                            </div>
                                                        </div>

                                                        <!-- Vertical Pillar Bar (Rank 3) -->
                                                        <div
                                                            class="w-full h-30 sm:h-38 rounded-t-xl sm:rounded-t-2xl bg-sage-dark shadow-sm group-hover:shadow-md group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t-2 border-white/40">
                                                            <div
                                                                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-black/15 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                                                                03
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p
                                                                    class="text-[9px] sm:text-[10px] font-bold text-white leading-tight">
                                                                    2,190</p>
                                                                <span
                                                                    class="text-[7px] sm:text-[8px] font-semibold bg-black/25 text-white px-1 py-0.2 rounded-full inline-block">11
                                                                    🏆</span>
                                                            </div>
                                                        </div>

                                                        <!-- Bottom Label -->
                                                        <div
                                                            class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                                                            <span
                                                                class="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-sage-dark uppercase">THIRD</span>
                                                            <p
                                                                class="text-[8px] text-slate-400 font-medium hidden sm:block">
                                                                Auditor</p>
                                                        </div>
                                                    </div>

                                                    <!-- 04: FOURTH - Maria Santos (Rank 4) -->
                                                    <div
                                                        class="flex flex-col items-center justify-end text-center group cursor-pointer">
                                                        <!-- Top Header: Name & Star -->
                                                        <div class="mb-2 flex flex-col items-center space-y-1 w-full">
                                                            <div
                                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-dusty text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                                                                MS
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full"
                                                                title="Maria Santos">Maria</p>
                                                            <span
                                                                class="text-[8px] sm:text-[9px] font-bold text-dusty-dark bg-dusty-50 px-1.5 py-0.2 rounded-full border border-dusty-100">1.4k
                                                                XP</span>
                                                            <!-- Star -->
                                                            <div
                                                                class="pt-0.5 text-gold text-sm sm:text-lg drop-shadow-xs">
                                                                <i class="fas fa-star"></i>
                                                            </div>
                                                        </div>

                                                        <!-- Vertical Pillar Bar (Rank 4) -->
                                                        <div
                                                            class="w-full h-24 sm:h-32 rounded-t-xl sm:rounded-t-2xl bg-dusty shadow-sm group-hover:shadow-md group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t-2 border-white/40">
                                                            <div
                                                                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-black/15 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                                                                04
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p
                                                                    id="leaderboard-rank4-xp"
                                                                    class="text-[9px] sm:text-[10px] font-bold text-white leading-tight">
                                                                    300</p>
                                                                <span
                                                                    class="text-[7px] sm:text-[8px] font-semibold bg-black/25 text-white px-1 py-0.2 rounded-full inline-block">1
                                                                    🏆</span>
                                                            </div>
                                                        </div>

                                                        <!-- Bottom Label -->
                                                        <div
                                                            class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                                                            <span
                                                                class="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-dusty uppercase">FOURTH</span>
                                                            <p
                                                                class="text-[8px] text-slate-400 font-medium hidden sm:block">
                                                                Front Host</p>
                                                        </div>
                                                    </div>

                                                    <!-- 05: FIFTH - Carlos Gomez (Rank 5) -->
                                                    <div
                                                        class="flex flex-col items-center justify-end text-center group cursor-pointer">
                                                        <!-- Top Header: Name & Star -->
                                                        <div class="mb-2 flex flex-col items-center space-y-1 w-full">
                                                            <div
                                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#6F6261] text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                                                                CG
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full"
                                                                title="Carlos Gomez">Carlos</p>
                                                            <span
                                                                class="text-[8px] sm:text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-full border border-slate-200">1.3k
                                                                XP</span>
                                                            <!-- Star -->
                                                            <div
                                                                class="pt-0.5 text-gold text-sm sm:text-lg drop-shadow-xs">
                                                                <i class="fas fa-star"></i>
                                                            </div>
                                                        </div>

                                                        <!-- Vertical Pillar Bar (Rank 5) -->
                                                        <div
                                                            class="w-full h-20 sm:h-26 rounded-t-xl sm:rounded-t-2xl bg-[#6F6261] shadow-sm group-hover:shadow-md group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t-2 border-white/40">
                                                            <div
                                                                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-black/15 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                                                                05
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p
                                                                    class="text-[9px] sm:text-[10px] font-bold text-white leading-tight">
                                                                    1,320</p>
                                                                <span
                                                                    class="text-[7px] sm:text-[8px] font-semibold bg-black/25 text-white px-1 py-0.2 rounded-full inline-block">8
                                                                    🏆</span>
                                                            </div>
                                                        </div>

                                                        <!-- Bottom Label -->
                                                        <div
                                                            class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                                                            <span
                                                                class="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-slate-600 uppercase">FIFTH</span>
                                                            <p
                                                                class="text-[8px] text-slate-400 font-medium hidden sm:block">
                                                                Concierge</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        <button onclick="switchPillar('pillar-social')"
                                            class="w-full py-2.5 bg-[#FAF8F7] hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-[#E8DEDC] transition flex items-center justify-center space-x-1.5">
                                            <i class="fas fa-award text-gold"></i>
                                            <span>View All Leaderboard Ranks &amp; Kudos</span>
                                        </button>
                                    </div>

                                    <!-- Column 2: Department Completion & Progress Comparison (7 cols) -->
                                    <div class="lg:col-span-7 card-clean p-6 space-y-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="font-heading font-bold text-base text-slate-900">Department Execution Matrix</h3>
                                                <p class="text-xs text-slate-500">Goal Approval %, LMS Completion %, and Succession Depth by Department</p>
                                            </div>
                                            <span class="badge-primary">Q3 Cycle</span>
                                        </div>

                                        <!-- Department Comparison Horizontal Bar Chart -->
                                        <div class="h-44 w-full">
                                            <canvas id="chart-system-dept-progress"></canvas>
                                        </div>

                                        <!-- Department Breakdown Mini Table -->
                                        <div class="overflow-x-auto custom-scrollbar pt-2 border-t border-[#E8DEDC]">
                                            <table class="w-full text-left text-xs">
                                                <thead>
                                                    <tr class="text-slate-400 font-semibold border-b border-[#E8DEDC]">
                                                        <th class="pb-2 font-medium">Department</th>
                                                        <th class="pb-2 font-medium text-center">Staff</th>
                                                        <th class="pb-2 font-medium text-center">Goals Approved</th>
                                                        <th class="pb-2 font-medium text-center">LMS Rate</th>
                                                        <th class="pb-2 font-medium text-center">Succession</th>
                                                        <th class="pb-2 font-medium text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="divide-y divide-[#E8DEDC]">
                                                    <tr>
                                                        <td class="py-2.5 font-bold text-slate-800">Front Office</td>
                                                        <td class="py-2.5 text-center text-slate-500">12</td>
                                                        <td class="py-2.5 text-center font-bold text-sage-dark">96.2%</td>
                                                        <td class="py-2.5 text-center font-bold text-primary">98.0%</td>
                                                        <td class="py-2.5 text-center font-bold text-dusty-dark">85.0%</td>
                                                        <td class="py-2.5 text-right"><span class="badge-sage">Optimal</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="py-2.5 font-bold text-slate-800">Food &amp; Beverage</td>
                                                        <td class="py-2.5 text-center text-slate-500">24</td>
                                                        <td class="py-2.5 text-center font-bold text-sage-dark">95.0%</td>
                                                        <td class="py-2.5 text-center font-bold text-primary">96.5%</td>
                                                        <td class="py-2.5 text-center font-bold text-dusty-dark">80.0%</td>
                                                        <td class="py-2.5 text-right"><span class="badge-sage">Optimal</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="py-2.5 font-bold text-slate-800">Kitchen &amp; Culinary</td>
                                                        <td class="py-2.5 text-center text-slate-500">18</td>
                                                        <td class="py-2.5 text-center font-bold text-sage-dark">94.0%</td>
                                                        <td class="py-2.5 text-center font-bold text-primary">92.0%</td>
                                                        <td class="py-2.5 text-center font-bold text-dusty-dark">78.0%</td>
                                                        <td class="py-2.5 text-right"><span class="badge-dusty">Good</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="py-2.5 font-bold text-slate-800">Banquet &amp; Events</td>
                                                        <td class="py-2.5 text-center text-slate-500">18</td>
                                                        <td class="py-2.5 text-center font-bold text-sage-dark">93.0%</td>
                                                        <td class="py-2.5 text-center font-bold text-primary">94.0%</td>
                                                        <td class="py-2.5 text-center font-bold text-dusty-dark">76.0%</td>
                                                        <td class="py-2.5 text-right"><span class="badge-dusty">Good</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="py-2.5 font-bold text-slate-800">Housekeeping</td>
                                                        <td class="py-2.5 text-center text-slate-500">28</td>
                                                        <td class="py-2.5 text-center font-bold text-sage-dark">90.5%</td>
                                                        <td class="py-2.5 text-center font-bold text-primary">91.0%</td>
                                                        <td class="py-2.5 text-center font-bold text-dusty-dark">72.5%</td>
                                                        <td class="py-2.5 text-right"><span class="badge-dusty">Good</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>

                                <!-- Bottom Row: 3 Governance & Operational Velocity Highlights -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <!-- Highlight 1: Normalization & Bell Curve Status -->
                                    <div class="card-clean p-5 space-y-2">
                                        <div class="flex items-center justify-between">
                                            <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                                                <i class="fas fa-scale-balanced text-dusty-dark"></i>
                                                <span>Calibration Normalization</span>
                                            </span>
                                            <span class="badge-dusty">100% Calibrated</span>
                                        </div>
                                        <p class="text-xs text-slate-500 leading-relaxed">Target normal curve (15% Top / 70% Core / 15% Growth) successfully enforced across 100 evaluations.</p>
                                        <div class="flex items-center space-x-1.5 text-[11px] pt-1">
                                            <span class="px-2 py-0.5 bg-sage-50 text-sage-dark rounded-md font-bold border border-sage-100">15 Exceeds</span>
                                            <span class="px-2 py-0.5 bg-dusty-50 text-dusty-dark rounded-md font-bold border border-dusty-100">70 Core</span>
                                            <span class="px-2 py-0.5 bg-terracotta-50 text-terracotta-dark rounded-md font-bold border border-terracotta-100">15 Growth</span>
                                        </div>
                                    </div>

                                    <!-- Highlight 2: Turnaround Speed -->
                                    <div class="card-clean p-5 space-y-2">
                                        <div class="flex items-center justify-between">
                                            <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                                                <i class="fas fa-stopwatch text-sage-dark"></i>
                                                <span>Review Turnaround</span>
                                            </span>
                                            <span class="badge-sage">4.2 Days Avg</span>
                                        </div>
                                        <p class="text-xs text-slate-500 leading-relaxed">Average duration from associate draft submission to supervisor endorsement and HR approval.</p>
                                        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                            <span>SLA Target: &lt; 7.0 Days</span>
                                            <span class="text-sage-dark font-bold">0 Overdue Reviews</span>
                                        </div>
                                    </div>

                                    <!-- Highlight 3: AI Copilot Assists -->
                                    <div class="card-clean p-5 space-y-2">
                                        <div class="flex items-center justify-between">
                                            <span class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                                                <i class="fas fa-robot text-dusty-dark"></i>
                                                <span>AI Feedback Adoption</span>
                                            </span>
                                            <span class="badge-dusty">312 Assists</span>
                                        </div>
                                        <p class="text-xs text-slate-500 leading-relaxed">312 AI-recommended SMART developmental objectives and tailored feedback suggestions accepted this cycle.</p>
                                        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                            <span>Goal Clarity: 98.4%</span>
                                            <span class="text-dusty-dark font-bold">89% Action Rate</span>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- ======================================================== -->
                        <!-- ======================================================== -->
                        <!-- PILLAR 1: PERFORMANCE MANAGEMENT (7-STAGE CONTINUOUS CYCLE) -->
