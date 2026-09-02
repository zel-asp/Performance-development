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
                                                Good morning, Maria Santos</h2>
                                            <p class="text-xs text-slate-500">You have <strong>1 milestone review</strong> and <strong>1 LMS handbook</strong> scheduled for calibration this week.</p>
                                        </div>
                                        <div class="flex items-center gap-2.5 flex-wrap">
                                            <button onclick="openModal('modal-create-goal')"
                                                class="btn-primary px-4 py-2.5 text-xs font-bold flex items-center space-x-2">
                                                <i class="fas fa-plus text-xs"></i>
                                                <span>Set New Goal</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- 3 Database-Driven KPI Metric Cards with Loading State Overlays -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <!-- Card 1: Q3 Goals Progress -->
                                    <div class="card-clean p-5 space-y-3 relative overflow-hidden">
                                        <!-- Loading Overlay -->
                                        <div id="kpi-goals-loading" class="hidden absolute inset-0 bg-white/85 backdrop-blur-2xs flex flex-col items-center justify-center z-10">
                                            <div class="w-6 h-6 rounded-full border-2 border-sage-dark/20 border-t-sage-dark animate-spin mb-1"></div>
                                            <span class="text-[10px] font-semibold text-slate-500">Querying Goals...</span>
                                        </div>

                                        <div class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span class="font-semibold text-slate-700">Q3 Goals Progress</span>
                                            <span id="kpi-goals-ratio" class="badge-sage">0 of 0 Passed (0/2 Set)</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span id="kpi-goals-pct" class="text-3xl font-heading font-bold text-slate-900">0%</span>
                                            <span id="kpi-goals-status" class="text-xs text-slate-400 font-semibold">No Goals Set</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div id="kpi-goals-bar" class="bg-sage h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
                                        </div>
                                        <p id="kpi-goals-subtitle" class="text-[11px] text-slate-400">0 goals in progress</p>
                                    </div>

                                    <!-- Card 2: Competency Matrix -->
                                    <div class="card-clean p-5 space-y-3 relative overflow-hidden">
                                        <!-- Loading Overlay -->
                                        <div id="kpi-comp-loading" class="hidden absolute inset-0 bg-white/85 backdrop-blur-2xs flex flex-col items-center justify-center z-10">
                                            <div class="w-6 h-6 rounded-full border-2 border-dusty-dark/20 border-t-dusty-dark animate-spin mb-1"></div>
                                            <span class="text-[10px] font-semibold text-slate-500">Querying Competencies...</span>
                                        </div>

                                        <div class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span class="font-semibold text-slate-700">Competency Matrix</span>
                                            <span id="kpi-comp-level" class="badge-dusty">Level 1</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span id="kpi-comp-val" class="text-3xl font-heading font-bold text-slate-900">0.0<span class="text-base text-slate-400 font-normal">/5</span></span>
                                            <span id="kpi-comp-tier" class="text-xs text-dusty-dark font-semibold">Core Tier</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div id="kpi-comp-bar" class="bg-dusty h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
                                        </div>
                                        <p id="kpi-comp-subtitle" class="text-[11px] text-slate-400">Position benchmark alignment</p>
                                    </div>

                                    <!-- Card 3: Gamified XP -->
                                    <div class="card-clean p-5 space-y-3 relative overflow-hidden">
                                        <!-- Loading Overlay -->
                                        <div id="kpi-xp-loading" class="hidden absolute inset-0 bg-white/85 backdrop-blur-2xs flex flex-col items-center justify-center z-10">
                                            <div class="w-6 h-6 rounded-full border-2 border-gold/20 border-t-gold animate-spin mb-1"></div>
                                            <span class="text-[10px] font-semibold text-slate-500">Querying XP Ledger...</span>
                                        </div>

                                        <div class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span class="font-semibold text-slate-700">Gamified XP</span>
                                            <span id="kpi-xp-level-badge" class="badge-gold">Level 1</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span id="kpi-xp-val" class="text-3xl font-heading font-bold text-gold-dark">0 <span class="text-xs font-normal text-slate-400">XP</span></span>
                                            <span id="kpi-xp-title" class="text-xs text-slate-500 font-semibold">Novice Associate</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div id="kpi-xp-bar" class="bg-gold h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
                                        </div>
                                        <p id="kpi-xp-subtitle" class="text-[11px] text-slate-400">250 XP to Bronze Tier</p>
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

                                <!-- 2-Column: XP Received & Gamification Trajectory + My Shift Sentiment & Well-being (Personal Pulse) -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                    <!-- XP Received & Gamification Trajectory -->
                                    <div class="card-clean p-6 space-y-3">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="font-heading font-bold text-base text-slate-900">
                                                    XP Received &amp; Rewards Trajectory</h3>
                                                <p class="text-xs text-slate-500">Monthly Points &amp; Rewards History Sourced from <code class="text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-700">xp_ledger</code></p>
                                            </div>
                                            <span id="xp-trajectory-badge" class="badge-gold">Live xp_ledger</span>
                                        </div>
                                        <div class="h-60 w-full relative">
                                            <canvas id="chart-performance-trend"></canvas>
                                            
                                            <!-- Loading State Indicator -->
                                            <div id="xp-trajectory-loading" class="hidden absolute inset-0 flex flex-col items-center justify-center bg-white/85 backdrop-blur-2xs rounded-xl p-4 text-center z-10">
                                                <div class="w-8 h-8 rounded-full border-3 border-gold/25 border-t-gold animate-spin mb-2"></div>
                                                <p class="font-bold text-xs text-slate-800">Querying Database...</p>
                                                <p class="text-[10px] text-slate-400">Loading live points from <code>xp_ledger</code></p>
                                            </div>

                                            <!-- Empty State Indicator -->
                                            <div id="xp-trajectory-empty" class="hidden absolute inset-0 flex flex-col items-center justify-center bg-white/95 rounded-xl p-4 text-center border border-dashed border-slate-200">
                                                <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg mb-2">
                                                    <i class="fas fa-receipt"></i>
                                                </div>
                                                <p class="font-bold text-xs text-slate-800">No XP Records in Database</p>
                                                <p class="text-[11px] text-slate-500 max-w-xs mt-0.5">This associate has no recorded transactions in <code class="text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-700">xp_ledger</code> yet.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- My Shift Sentiment & Personal Well-being (Individual Pulse) -->
                                    <div class="card-clean p-6 space-y-4 flex flex-col justify-between">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="font-heading font-bold text-base text-slate-900">
                                                    My Shift Climate &amp; Well-being</h3>
                                                <p class="text-xs text-slate-500">Your personal shift sentiment and mood log</p>
                                            </div>
                                            <button onclick="openModal('modal-sentiment-pulse')"
                                                class="text-xs font-bold text-primary hover:underline flex items-center space-x-1">
                                                <i class="fas fa-pen text-[10px]"></i>
                                                <span>Log Check-In</span>
                                            </button>
                                        </div>

                                        <!-- Active Personal Status Banner -->
                                        <div id="my-shift-sentiment-banner" class="p-4 rounded-2xl bg-sage-50/70 border border-sage-200/80 flex items-center justify-between gap-3">
                                            <div class="flex items-center space-x-3">
                                                <div id="my-shift-sentiment-emoji" class="w-12 h-12 rounded-2xl bg-sage-dark text-white flex items-center justify-center text-2xl shadow-xs">
                                                    😊
                                                </div>
                                                <div>
                                                    <span class="text-[10px] font-bold uppercase tracking-wider text-sage-dark">Today's Check-in</span>
                                                    <h4 id="my-shift-sentiment-title" class="font-heading font-bold text-slate-900 text-sm">Smooth &amp; Energized</h4>
                                                    <p id="my-shift-sentiment-desc" class="text-[11px] text-slate-500">Front Desk shift operating on schedule with zero blockers.</p>
                                                </div>
                                            </div>
                                            <span id="my-shift-sentiment-badge" class="badge-sage flex-shrink-0">Active</span>
                                        </div>

                                        <!-- Quick Sentiment Logger Buttons -->
                                        <div class="space-y-1.5">
                                            <span class="text-[11px] font-bold text-slate-600 block">Quick Shift Mood Update:</span>
                                            <div class="grid grid-cols-3 gap-2">
                                                <button type="button" onclick="logQuickSentiment('smooth')" class="p-2.5 rounded-xl border border-sage-200 bg-white hover:bg-sage-50 text-slate-800 flex flex-col items-center justify-center space-y-1 transition group">
                                                    <span class="text-lg group-hover:scale-110 transition-transform">😊</span>
                                                    <span class="text-[11px] font-bold text-sage-dark">Smooth</span>
                                                    <span class="text-[9px] text-slate-400">Clear focus</span>
                                                </button>
                                                <button type="button" onclick="logQuickSentiment('manageable')" class="p-2.5 rounded-xl border border-dusty-200 bg-white hover:bg-dusty-50 text-slate-800 flex flex-col items-center justify-center space-y-1 transition group">
                                                    <span class="text-lg group-hover:scale-110 transition-transform">😐</span>
                                                    <span class="text-[11px] font-bold text-dusty-dark">Manageable</span>
                                                    <span class="text-[9px] text-slate-400">Steady load</span>
                                                </button>
                                                <button type="button" onclick="logQuickSentiment('friction')" class="p-2.5 rounded-xl border border-terracotta-200 bg-white hover:bg-terracotta-50 text-slate-800 flex flex-col items-center justify-center space-y-1 transition group">
                                                    <span class="text-lg group-hover:scale-110 transition-transform">😟</span>
                                                    <span class="text-[11px] font-bold text-terracotta-dark">Friction</span>
                                                    <span class="text-[9px] text-slate-400">Need support</span>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- 7-Day Personal Consistency Track -->
                                        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                                            <span>Weekly Streak: <strong class="text-slate-900">7 Shifts Logged</strong></span>
                                            <span class="text-sage-dark font-semibold"><i class="fas fa-shield-heart mr-1"></i>94% Positive Climate</span>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <!-- SUB-TAB 2: SYSTEM & PROPERTY ANALYTICS (Organization-Wide Overview) -->
                            <div id="sub-dashboard-system" class="sub-panel-dashboard space-y-6 relative">

                                <!-- Sub-Tab 2 Loading Shimmer & State -->
                                <div id="overview-tab2-loading" class="hidden absolute inset-0 z-30 bg-white/80 backdrop-blur-2xs rounded-3xl flex flex-col items-center justify-center space-y-3 transition-opacity duration-300">
                                    <div class="relative flex items-center justify-center">
                                        <div class="w-12 h-12 rounded-full border-3 border-primary/20 border-t-primary animate-spin"></div>
                                        <div class="absolute w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                                            <i class="fas fa-chart-line text-[10px]"></i>
                                        </div>
                                    </div>
                                    <div class="text-center space-y-0.5">
                                        <p class="font-bold text-xs text-slate-800 tracking-wide">Syncing Property Telemetry...</p>
                                        <p class="text-[10px] text-slate-400">Loading live KPIs, Execution Matrix &amp; XP Champions</p>
                                    </div>
                                </div>

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

                                <!-- 6 Fast Core Module Navigation Cards (Property-Wide Architecture) -->
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

                                <!-- Row 1: Top 5 Gamified XP Champions + Department Execution Matrix -->
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
                                                <?php
                                                require_once __DIR__ . '/../models/SocialModel.php';
                                                $socialModelOverview = new SocialModel();
                                                $overviewChampions = $socialModelOverview->getTop5XpChampions();
                                                ?>
                                                <div id="overview-top5-podium" class="grid grid-cols-5 gap-2 sm:gap-3.5 items-end relative z-10">
                                                <?php
                                                $rankStylesPhp = [
                                                    1 => ['avatarBg' => 'bg-gold', 'xpPill' => 'text-gold-dark bg-gold-50 border border-gold-100', 'pillarBg' => 'bg-gold', 'heightClass' => 'h-44 sm:h-52', 'labelColor' => 'text-gold-dark', 'bounceStar' => true],
                                                    2 => ['avatarBg' => 'bg-terracotta', 'xpPill' => 'text-terracotta-dark bg-terracotta-50 border border-terracotta-100', 'pillarBg' => 'bg-terracotta', 'heightClass' => 'h-36 sm:h-44', 'labelColor' => 'text-terracotta', 'bounceStar' => false],
                                                    3 => ['avatarBg' => 'bg-sage-dark', 'xpPill' => 'text-sage-dark bg-sage-50 border border-sage-100', 'pillarBg' => 'bg-sage-dark', 'heightClass' => 'h-28 sm:h-36', 'labelColor' => 'text-sage-dark', 'bounceStar' => false],
                                                    4 => ['avatarBg' => 'bg-dusty', 'xpPill' => 'text-dusty-dark bg-dusty-50 border border-dusty-100', 'pillarBg' => 'bg-dusty', 'heightClass' => 'h-22 sm:h-28', 'labelColor' => 'text-dusty', 'bounceStar' => false],
                                                    5 => ['avatarBg' => 'bg-[#6F6261]', 'xpPill' => 'text-slate-700 bg-slate-100 border border-slate-200', 'pillarBg' => 'bg-[#6F6261]', 'heightClass' => 'h-16 sm:h-22', 'labelColor' => 'text-slate-600', 'bounceStar' => false],
                                                ];

                                                foreach ($overviewChampions as $c):
                                                    $xp = (int)($c['total_xp'] ?? 0);
                                                    $rank = (int)($c['rank'] ?? 1);
                                                    $st = $rankStylesPhp[$rank] ?? $rankStylesPhp[5];
                                                    $rankBadge = str_pad((string)$rank, 2, '0', STR_PAD_LEFT);
                                                    $displayLabel = $c['rank_label'] ?? ('RANK ' . $rank);

                                                    if (!empty($c['is_ready'])):
                                                ?>
                                                    <!-- Ready Empty State Slot -->
                                                    <div class="flex flex-col items-center justify-end text-center group cursor-pointer" onclick="switchPillar('pillar-social')" title="Open Podium Position <?= $rank ?>: Ready for Contender">
                                                        <div class="mb-2 flex flex-col items-center space-y-1 w-full opacity-60">
                                                            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-dashed border-slate-300 bg-white/70 text-slate-400 font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-2xs">
                                                                <i class="fas fa-plus text-[9px] sm:text-[10px] text-slate-400"></i>
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-400 truncate max-w-full">Ready</p>
                                                            <span class="text-[8px] sm:text-[9px] font-medium text-slate-400 bg-slate-100/80 border border-dashed border-slate-200 px-1.5 py-0.2 rounded-full">-- XP</span>
                                                            <div class="pt-0.5 text-slate-200 text-sm sm:text-lg">
                                                                <i class="far fa-star"></i>
                                                            </div>
                                                        </div>
                                                        <div class="w-full <?= $st['heightClass'] ?> rounded-t-xl sm:rounded-t-2xl bg-slate-100/80 border-2 border-dashed border-slate-200 shadow-2xs group-hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-slate-400">
                                                            <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-dashed border-slate-300 bg-white/80 flex items-center justify-center font-bold text-[10px] sm:text-xs text-slate-400 shadow-2xs mt-1">
                                                                <?= $rankBadge ?>
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p class="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ready</p>
                                                                <span class="text-[7px] sm:text-[8px] font-medium text-slate-400 bg-black/5 px-1.5 py-0.5 rounded-full inline-flex items-center space-x-0.5">
                                                                    <span>Open</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                                                            <span class="text-[9px] sm:text-[10px] font-bold tracking-wider text-slate-400 uppercase"><?= htmlspecialchars($displayLabel) ?></span>
                                                            <p class="text-[8px] text-slate-400 font-medium hidden sm:block">Awaiting XP</p>
                                                        </div>
                                                    </div>
                                                <?php else:
                                                    $xpDisplay = $xp >= 1000 ? number_format($xp / 1000, 1) . 'k XP' : ($xp . ' XP');
                                                    $parts = preg_split('/\s+/', trim($c['name'] ?? 'Staff'));
                                                    $firstName = $parts[0] ?? 'Staff';
                                                    $initials = count($parts) > 1 ? strtoupper(substr($parts[0], 0, 1) . substr(end($parts), 0, 1)) : strtoupper(substr($parts[0], 0, 2));

                                                    if (!empty($c['is_tied'])) {
                                                        $ordinals = [1 => '1ST', 2 => '2ND', 3 => '3RD', 4 => '4TH', 5 => '5TH'];
                                                        $displayLabel = 'TIED ' . ($ordinals[$rank] ?? $rank);
                                                    }
                                                    $roleShort = str_replace(['Director', 'Supervisor', 'Associate'], ['Dir', 'Sup', 'Assoc'], $c['role'] ?? 'Associate');
                                                ?>
                                                    <!-- Active Champion Slot -->
                                                    <div class="flex flex-col items-center justify-end text-center group cursor-pointer" onclick="switchPillar('pillar-social')" title="<?= htmlspecialchars($c['name']) ?> (<?= htmlspecialchars($c['role']) ?>): <?= number_format($xp) ?> XP">
                                                        <div class="mb-2 flex flex-col items-center space-y-1 w-full">
                                                            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full <?= $st['avatarBg'] ?> text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                                                                <?= htmlspecialchars($initials) ?>
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full" title="<?= htmlspecialchars($c['name']) ?>"><?= htmlspecialchars($firstName) ?></p>
                                                            <span class="text-[8px] sm:text-[9px] font-bold <?= $st['xpPill'] ?> px-1.5 py-0.2 rounded-full"><?= $xpDisplay ?></span>
                                                            <div class="pt-0.5 text-gold text-sm sm:text-lg <?= !empty($st['bounceStar']) ? 'animate-bounce drop-shadow-xs' : 'drop-shadow-xs' ?>">
                                                                <i class="fas fa-star"></i>
                                                            </div>
                                                        </div>
                                                        <div class="w-full <?= $st['heightClass'] ?> rounded-t-xl sm:rounded-t-2xl <?= $st['pillarBg'] ?> shadow-sm group-hover:shadow-md group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t-2 border-white/40">
                                                            <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-black/15 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                                                                <?= $rankBadge ?>
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p class="text-[9px] sm:text-[10px] font-bold text-white leading-tight"><?= number_format($xp) ?></p>
                                                                <span class="text-[7px] sm:text-[8px] font-semibold bg-black/25 text-white px-1.5 py-0.5 rounded-full inline-flex items-center space-x-0.5">
                                                                    <span><?= (int)($c['trophies'] ?? 0) ?></span>
                                                                    <i class="fas fa-trophy text-[7px] text-amber-300"></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                                                            <span class="text-[9px] sm:text-[10px] font-extrabold tracking-wider <?= $st['labelColor'] ?> uppercase"><?= htmlspecialchars($displayLabel) ?></span>
                                                            <p class="text-[8px] text-slate-400 font-medium hidden sm:block truncate" title="<?= htmlspecialchars($c['role']) ?>"><?= htmlspecialchars($roleShort) ?></p>
                                                        </div>
                                                    </div>
                                                <?php endif; endforeach; ?>
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

                                <!-- Row 2: Property Shift Climate Pulse + Governance Highlights -->
                                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                                    <!-- Column 1: Property Shift Climate Pulse (Doughnut Chart) (5 cols) -->
                                    <div class="lg:col-span-5 card-clean p-6 space-y-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="font-heading font-bold text-base text-slate-900">
                                                    Shift Climate Pulse</h3>
                                                <p class="text-xs text-slate-500">Aggregated Employee Sentiment (All 100 Staff)</p>
                                            </div>
                                            <button onclick="openModal('modal-sentiment-pulse')"
                                                class="text-xs font-bold text-primary hover:underline">+ Property Audit</button>
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

                                    <!-- Column 2: Governance & Operational Velocity (7 cols in a single clean card) -->
                                    <div class="lg:col-span-7 card-clean p-6 space-y-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="font-heading font-bold text-base text-slate-900">Governance &amp; Operational Velocity</h3>
                                                <p class="text-xs text-slate-500">Cross-module synchronization, calibration compliance, and succession pipeline throughput</p>
                                            </div>
                                            <span class="badge-sage">Live Telemetry</span>
                                        </div>

                                        <!-- 2-Column Analytics Grid -->
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                                            <!-- Column 1: Appraisal Calibration & Review Velocity -->
                                            <div class="bg-[#FAF8F7] border border-[#E8DEDC] rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                                                <div class="space-y-2">
                                                    <div class="flex items-center justify-between">
                                                        <span class="text-xs font-bold text-slate-900 flex items-center space-x-2">
                                                            <i class="fas fa-scale-balanced text-primary text-xs"></i>
                                                            <span>Appraisal Calibration &amp; SLA</span>
                                                        </span>
                                                        <span class="badge-sage text-[10px]">100% Calibrated</span>
                                                    </div>
                                                    <p class="text-xs text-slate-500 leading-relaxed">Enforces 15% Top / 70% Core / 15% Growth bell-curve across closed cycles. Closed scores directly feed the 9-Box matrix (40% weight).</p>
                                                </div>
                                                
                                                <div class="space-y-2 pt-2 border-t border-[#E8DEDC]">
                                                    <div class="flex items-center justify-between text-[11px]">
                                                        <span class="text-slate-500 font-medium">Review SLA Speed:</span>
                                                        <span class="font-bold text-sage-dark">4.2d Avg <span class="text-[10px] text-slate-400 font-normal">(&lt; 7.0d Target)</span></span>
                                                    </div>
                                                    <div class="flex items-center justify-between text-[11px]">
                                                        <span class="text-slate-500 font-medium">AI Feedback Assists:</span>
                                                        <span class="font-bold text-dusty-dark">312 Accepted (89%)</span>
                                                    </div>
                                                    <div class="flex flex-wrap gap-1 text-[10px] pt-1">
                                                        <span class="px-2 py-0.5 bg-sage-50 text-sage-dark rounded-md font-bold border border-sage-100">15 Top</span>
                                                        <span class="px-2 py-0.5 bg-dusty-50 text-dusty-dark rounded-md font-bold border border-dusty-100">70 Core</span>
                                                        <span class="px-2 py-0.5 bg-terracotta-50 text-terracotta-dark rounded-md font-bold border border-terracotta-100">15 Growth</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Column 2: Training Ops & Succession Pipeline -->
                                            <div class="bg-[#FAF8F7] border border-[#E8DEDC] rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                                                <div class="space-y-2">
                                                    <div class="flex items-center justify-between">
                                                        <span class="text-xs font-bold text-slate-900 flex items-center space-x-2">
                                                            <i class="fas fa-sitemap text-dusty-dark text-xs"></i>
                                                            <span>Succession &amp; Training Pipeline</span>
                                                        </span>
                                                        <span class="badge-dusty text-[10px]">78.5% Bench Ready</span>
                                                    </div>
                                                    <p class="text-xs text-slate-500 leading-relaxed">Competency gap alerts automatically trigger Training sessions &amp; LMS SOPs. Passing upgrades competency match (60% weight) and issues XP.</p>
                                                </div>

                                                <div class="space-y-2 pt-2 border-t border-[#E8DEDC]">
                                                    <div class="flex items-center justify-between text-[11px]">
                                                        <span class="text-slate-500 font-medium">Key Roles Covered:</span>
                                                        <span class="font-bold text-slate-800">14 / 16 Roles <span class="text-[10px] text-sage-dark font-semibold">(2 Fast-Track)</span></span>
                                                    </div>
                                                    <div class="flex items-center justify-between text-[11px]">
                                                        <span class="text-slate-500 font-medium">LMS Quiz Pass Rate:</span>
                                                        <span class="font-bold text-primary">94.2% <span class="text-[10px] text-slate-400 font-normal">(First Attempt)</span></span>
                                                    </div>
                                                    <div class="flex flex-wrap gap-1 text-[10px] pt-1">
                                                        <span class="px-2 py-0.5 bg-dusty-50 text-dusty-dark rounded-md font-bold border border-dusty-100">8 Ready Now</span>
                                                        <span class="px-2 py-0.5 bg-gold-50 text-gold-dark rounded-md font-bold border border-gold-100">6 in 1-2 Yrs</span>
                                                        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold border border-slate-200">+150 XP/Cert</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- ======================================================== -->
                        <!-- ======================================================== -->
                        <!-- PILLAR 1: PERFORMANCE MANAGEMENT (7-STAGE CONTINUOUS CYCLE) -->
