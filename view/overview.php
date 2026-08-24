<!-- ======================================================== -->
                        <div id="panel-dashboard" class="pillar-panel active space-y-6">

                            <!-- Top Sub-Navigation Pills (Overview Hub Sub-tabs) -->
                            <div
                                class="raindrop-track flex items-center justify-between gap-2 p-1.5 overflow-x-auto custom-scrollbar">
                                <div class="flex items-center space-x-1.5 flex-nowrap">
                                    <button onclick="switchSubTab('dashboard', 'pulse')"
                                        class="subnav-pill subnav-dashboard active whitespace-nowrap" data-sub="pulse">
                                        <i class="fas fa-user-clock mr-1 text-primary"></i> 1. Shift Focus & My
                                        Pulse
                                    </button>
                                    <button onclick="switchSubTab('dashboard', 'system')"
                                        class="subnav-pill subnav-dashboard whitespace-nowrap" data-sub="system">
                                        <i class="fas fa-chart-line mr-1 text-purple-600"></i> 2. System &
                                        Property Analytics
                                    </button>
                                </div>
                                <div class="flex items-center space-x-2 flex-shrink-0">
                                    <span class="text-[11px] font-semibold text-slate-500 hidden sm:inline">100
                                        Active Staff · HR Pulse v3.2</span>
                                    <button onclick="openModal('modal-role-matrix')"
                                        class="btn-raindrop btn-raindrop-secondary px-3 py-1 text-xs font-semibold whitespace-nowrap">
                                        <i class="fas fa-shield-halved text-[10px] mr-1 text-purple-600"></i>
                                        Roles Matrix
                                    </button>
                                </div>
                            </div>

                            <!-- SUB-TAB 1: INDIVIDUAL SHIFT FOCUS & MY PULSE -->
                            <div id="sub-dashboard-pulse" class="sub-panel-dashboard active space-y-6">

                                <!-- 1. Focused "Today's Shift Action" Card -->
                                <div
                                    class="card-clean p-6 bg-slate-900 border border-slate-800 text-white relative overflow-hidden rounded-3xl">
                                    <div
                                        class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div class="space-y-1.5">
                                            <div
                                                class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/90 text-primary-200 text-[11px] font-semibold border border-slate-700/80">
                                                <span
                                                    class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                <span>On Shift: 07:00 - 15:30 · Front Office</span>
                                            </div>
                                            <h2 id="hero-greeting-text"
                                                class="font-heading font-bold text-2xl sm:text-3xl text-white">
                                                Good morning,
                                                Maria Santos 👋</h2>
                                            <p class="text-xs text-slate-300">You have <strong>1 milestone
                                                    review</strong>
                                                and <strong>1 LMS quiz</strong> scheduled for completion this
                                                week.</p>
                                        </div>
                                        <div class="flex items-center gap-2.5 flex-wrap">
                                            <button onclick="openModal('modal-create-goal')"
                                                class="btn-raindrop btn-raindrop-primary px-5 py-2.5 text-xs font-bold flex items-center space-x-2 shadow-sm">
                                                <i class="fas fa-plus text-xs"></i>
                                                <span>Set New Goal</span>
                                            </button>
                                            <button onclick="openModal('modal-self-assessment')"
                                                class="btn-raindrop px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold">
                                                <span>Quarterly Review</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- 4 Clean KPI Metric Cards -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                    <!-- KPI 1 -->
                                    <div class="card-clean p-5">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Hospitality Index</span>
                                            <span
                                                class="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">+4.2%</span>
                                        </div>
                                        <div class="mt-2 flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900">89.4%</span>
                                            <span class="text-xs text-slate-400">Target: 85%</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div class="bg-primary h-1.5 rounded-full" style="width: 89.4%">
                                            </div>
                                        </div>
                                        <p class="text-[11px] text-slate-400 mt-2">Continuous evaluation active
                                        </p>
                                    </div>

                                    <!-- KPI 2 -->
                                    <div class="card-clean p-5">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Q3 Goals Progress</span>
                                            <span id="kpi-goals-ratio"
                                                class="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">6
                                                of 8 Done</span>
                                        </div>
                                        <div class="mt-2 flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900">75%</span>
                                            <span class="text-xs text-emerald-600 font-semibold"><i
                                                    class="fas fa-check"></i> On Track</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div class="bg-emerald-500 h-1.5 rounded-full" style="width: 75%">
                                            </div>
                                        </div>
                                        <p class="text-[11px] text-slate-400 mt-2">2 goals in progress</p>
                                    </div>

                                    <!-- KPI 3 -->
                                    <div class="card-clean p-5">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Competency Matrix</span>
                                            <span
                                                class="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">Level
                                                4</span>
                                        </div>
                                        <div class="mt-2 flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900">4.3<span
                                                    class="text-base text-slate-400 font-normal">/5</span></span>
                                            <span class="text-xs text-indigo-600 font-medium">Senior Tier</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div class="bg-indigo-500 h-1.5 rounded-full" style="width: 86%">
                                            </div>
                                        </div>
                                        <p class="text-[11px] text-slate-400 mt-2">Lead Host promotion track</p>
                                    </div>

                                    <!-- KPI 4 -->
                                    <div class="card-clean p-5">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Gamified XP</span>
                                            <span
                                                class="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">Level
                                                8</span>
                                        </div>
                                        <div class="mt-2 flex items-baseline space-x-2">
                                            <span id="kpi-xp-val"
                                                class="text-3xl font-heading font-bold text-amber-600">1,480
                                                <span class="text-xs font-normal text-slate-400">XP</span></span>
                                            <span class="text-xs text-slate-400">Ambassador</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div id="kpi-xp-bar" class="bg-amber-500 h-1.5 rounded-full"
                                                style="width: 84%">
                                            </div>
                                        </div>
                                        <p class="text-[11px] text-slate-400 mt-2">120 XP to Gold tier</p>
                                    </div>

                                </div>

                                <!-- 2-Column: Key Trends + Shift Climate -->
                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                    <!-- Quality & KPI Trend Line Chart -->
                                    <div class="lg:col-span-2 card-clean p-6 space-y-3">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="font-heading font-bold text-base text-slate-900">
                                                    Hospitality KPI & Performance Trend</h3>
                                                <p class="text-xs text-slate-500">6-Month Continuous Score vs.
                                                    Hotel 85% Standard</p>
                                            </div>
                                            <span
                                                class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">2026</span>
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
                                                <p class="text-xs text-slate-500">Aggregated Employee Sentiment
                                                </p>
                                            </div>
                                            <button onclick="openModal('modal-sentiment-pulse')"
                                                class="text-xs font-bold text-primary hover:underline">+
                                                Vote</button>
                                        </div>
                                        <div class="h-48 w-full flex items-center justify-center">
                                            <canvas id="chart-sentiment-doughnut"></canvas>
                                        </div>
                                        <div
                                            class="flex justify-around text-center text-xs pt-2 border-t border-slate-100">
                                            <div>
                                                <p class="font-bold text-emerald-600">68.5%</p>
                                                <p class="text-[10px] text-slate-400">Smooth</p>
                                            </div>
                                            <div>
                                                <p class="font-bold text-amber-500">23.0%</p>
                                                <p class="text-[10px] text-slate-400">Manageable</p>
                                            </div>
                                            <div>
                                                <p class="font-bold text-red-500">8.5%</p>
                                                <p class="text-[10px] text-slate-400">Friction</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <!-- 6 Fast Module Cards -->
                                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                    <div onclick="switchPillar('pillar-perf')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition">
                                        <i class="fas fa-bullseye text-primary text-xl mb-2"></i>
                                        <p class="font-bold text-xs text-slate-800">1. Performance</p>
                                        <p class="text-[10px] text-slate-400">7-Step Cycle</p>
                                    </div>
                                    <div onclick="switchPillar('pillar-comp')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition">
                                        <i class="fas fa-cubes text-indigo-600 text-xl mb-2"></i>
                                        <p class="font-bold text-xs text-slate-800">2. Competency</p>
                                        <p class="text-[10px] text-slate-400">Radar & Gaps</p>
                                    </div>
                                    <div onclick="switchPillar('pillar-lms')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition">
                                        <i class="fas fa-graduation-cap text-emerald-600 text-xl mb-2"></i>
                                        <p class="font-bold text-xs text-slate-800">3. Learning LMS</p>
                                        <p class="text-[10px] text-slate-400">TNA & Quizzes</p>
                                    </div>
                                    <div onclick="switchPillar('pillar-training')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition">
                                        <i class="fas fa-chalkboard-user text-amber-600 text-xl mb-2"></i>
                                        <p class="font-bold text-xs text-slate-800">4. Training Ops</p>
                                        <p class="text-[10px] text-slate-400">12 Functions</p>
                                    </div>
                                    <div onclick="switchPillar('pillar-succession')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition">
                                        <i class="fas fa-sitemap text-purple-600 text-xl mb-2"></i>
                                        <p class="font-bold text-xs text-slate-800">5. Succession</p>
                                        <p class="text-[10px] text-slate-400">9-Box Bench</p>
                                    </div>
                                    <div onclick="switchPillar('pillar-social')"
                                        class="card-clean p-4 cursor-pointer hover:border-primary transition">
                                        <i class="fas fa-trophy text-rose-600 text-xl mb-2"></i>
                                        <p class="font-bold text-xs text-slate-800">6. Kudos & XP</p>
                                        <p class="text-[10px] text-slate-400">Social Climate</p>
                                    </div>
                                </div>

                            </div>

                            <!-- SUB-TAB 2: SYSTEM & PROPERTY ANALYTICS (Organization-Wide Overview) -->
                            <div id="sub-dashboard-system" class="sub-panel-dashboard space-y-6">

                                <!-- System Overview Banner -->
                                <div
                                    class="card-clean p-6 bg-slate-50 border border-slate-200/90 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div class="space-y-1">
                                        <div class="flex items-center space-x-2">
                                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                            <span
                                                class="text-xs font-bold text-slate-900 uppercase tracking-wide">Property-Wide
                                                HR Operating Metrics</span>
                                            <span
                                                class="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">All
                                                100 Employees</span>
                                        </div>
                                        <h2 class="text-xl sm:text-2xl font-heading font-bold text-slate-900">
                                            Workforce Health & Execution Velocity</h2>
                                        <p class="text-xs text-slate-500">Comprehensive system telemetry across
                                            all 5 resort departments, goal approvals, gamified XP, and
                                            succession pipeline readiness.</p>
                                    </div>
                                    <div class="flex items-center space-x-2 self-start md:self-auto flex-shrink-0">
                                        <button
                                            onclick="showToast('System metrics report exported successfully.', 'success')"
                                            class="btn-raindrop btn-raindrop-secondary px-4 py-2 text-xs font-semibold">
                                            <i class="fas fa-file-export text-xs text-slate-500"></i>
                                            <span>Export Summary</span>
                                        </button>
                                        <button onclick="openModal('modal-sentiment-pulse')"
                                            class="btn-raindrop btn-raindrop-primary px-4 py-2 text-xs font-bold shadow-sm">
                                            <i class="fas fa-bolt text-xs"></i>
                                            <span>Trigger Property Audit</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- 4 Master System-Wide KPI Cards -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                    <!-- System KPI 1: Approved Goals Count -->
                                    <div class="card-clean p-5">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Goal Approval Rate</span>
                                            <span
                                                class="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">93.6%
                                                Approved</span>
                                        </div>
                                        <div class="mt-2 flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900">248
                                                <span class="text-sm font-normal text-slate-400">/
                                                    265</span></span>
                                            <span class="text-xs text-emerald-600 font-semibold">+8.4%
                                                YoY</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div class="bg-emerald-500 h-1.5 rounded-full" style="width: 93.6%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500 mt-2">
                                            <span>248 Approved</span>
                                            <span class="text-amber-600 font-medium">12 In Review</span>
                                            <span class="text-slate-400">5 Revise</span>
                                        </div>
                                    </div>

                                    <!-- System KPI 2: Total Gamified XP -->
                                    <div class="card-clean p-5">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Total Property XP</span>
                                            <span
                                                class="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">Grade
                                                A+</span>
                                        </div>
                                        <div class="mt-2 flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-amber-600">84,620
                                                <span class="text-xs font-normal text-slate-400">XP</span></span>
                                            <span class="text-xs text-slate-500 font-medium">100 Staff</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div class="bg-amber-500 h-1.5 rounded-full" style="width: 85%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500 mt-2">
                                            <span>842 Kudos Sent</span>
                                            <span class="text-amber-600 font-medium">1,120 Badges</span>
                                        </div>
                                    </div>

                                    <!-- System KPI 3: Average LMS Completion Rate -->
                                    <div class="card-clean p-5">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>LMS Course Completion</span>
                                            <span
                                                class="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">94.2%
                                                Rate</span>
                                        </div>
                                        <div class="mt-2 flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900">94.2%</span>
                                            <span class="text-xs text-slate-400">Target: 90.0%</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div class="bg-primary h-1.5 rounded-full" style="width: 94.2%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500 mt-2">
                                            <span>471 / 500 Modules</span>
                                            <span class="text-emerald-600 font-medium">92.4% Avg Score</span>
                                        </div>
                                    </div>

                                    <!-- System KPI 4: Succession Pipeline Health Rate -->
                                    <div class="card-clean p-5">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Succession Bench Depth</span>
                                            <span
                                                class="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">78.5%
                                                Ready</span>
                                        </div>
                                        <div class="mt-2 flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-indigo-900">78.5%</span>
                                            <span class="text-xs text-indigo-600 font-semibold">Low Risk</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div class="bg-indigo-600 h-1.5 rounded-full" style="width: 78.5%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500 mt-2">
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
                                                <h3 class="font-heading font-bold text-base text-slate-900">Top
                                                    5 Gamified XP Champions</h3>
                                                <p class="text-xs text-slate-500">Highest accumulated
                                                    recognition points & badges</p>
                                            </div>
                                            <span
                                                class="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Property
                                                Top 5</span>
                                        </div>

                                        <!-- Top 5 Vertical Bar Podium (Names & Stars on Top) -->
                                        <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3.5 sm:p-5">
                                            <div class="relative pt-2">
                                                <!-- Connecting Horizontal Bar behind pillars -->
                                                <div
                                                    class="absolute bottom-11 left-0 right-0 h-3 bg-slate-700/80 rounded-full z-0 hidden sm:block">
                                                </div>

                                                <!-- 5 Stepped Vertical Columns -->
                                                <div class="grid grid-cols-5 gap-2 sm:gap-3.5 items-end relative z-10">

                                                    <!-- 01: FIRST - Elena Vance (Rank 1) -->
                                                    <div
                                                        class="flex flex-col items-center justify-end text-center group cursor-pointer">
                                                        <!-- Top Header: Name & Star -->
                                                        <div class="mb-2 flex flex-col items-center space-y-1 w-full">
                                                            <div
                                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-700 text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                                                                EV
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full"
                                                                title="Elena Vance">Elena</p>
                                                            <span
                                                                class="text-[8px] sm:text-[9px] font-bold text-amber-700 bg-amber-100/90 px-1.5 py-0.2 rounded-full">2.8k
                                                                XP</span>
                                                            <!-- Star -->
                                                            <div
                                                                class="pt-0.5 text-amber-400 text-sm sm:text-lg animate-bounce drop-shadow-xs">
                                                                <i class="fas fa-star"></i>
                                                            </div>
                                                        </div>

                                                        <!-- Vertical Pillar Bar (Rank 1: Tallest) -->
                                                        <div
                                                            class="w-full h-44 sm:h-52 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 shadow-md group-hover:shadow-lg group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t border-amber-200/50">
                                                            <div
                                                                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white/90 bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                                                                01
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p
                                                                    class="text-[9px] sm:text-[10px] font-bold text-white leading-tight">
                                                                    2,840</p>
                                                                <span
                                                                    class="text-[7px] sm:text-[8px] font-semibold bg-black/20 text-white/95 px-1 py-0.2 rounded-full inline-block">14
                                                                    🏅</span>
                                                            </div>
                                                        </div>

                                                        <!-- Bottom Label -->
                                                        <div
                                                            class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                                                            <span
                                                                class="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-amber-700 uppercase">FIRST</span>
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
                                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-600 text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                                                                CM
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full"
                                                                title="Chef Marco">Marco</p>
                                                            <span
                                                                class="text-[8px] sm:text-[9px] font-bold text-orange-700 bg-orange-100/90 px-1.5 py-0.2 rounded-full">2.4k
                                                                XP</span>
                                                            <!-- Star -->
                                                            <div
                                                                class="pt-0.5 text-amber-400 text-sm sm:text-lg drop-shadow-xs">
                                                                <i class="fas fa-star"></i>
                                                            </div>
                                                        </div>

                                                        <!-- Vertical Pillar Bar (Rank 2) -->
                                                        <div
                                                            class="w-full h-36 sm:h-44 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-t from-orange-600 via-orange-500 to-rose-400 shadow-md group-hover:shadow-lg group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t border-orange-200/50">
                                                            <div
                                                                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white/90 bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                                                                02
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p
                                                                    class="text-[9px] sm:text-[10px] font-bold text-white leading-tight">
                                                                    2,450</p>
                                                                <span
                                                                    class="text-[7px] sm:text-[8px] font-semibold bg-black/20 text-white/95 px-1 py-0.2 rounded-full inline-block">12
                                                                    🏅</span>
                                                            </div>
                                                        </div>

                                                        <!-- Bottom Label -->
                                                        <div
                                                            class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                                                            <span
                                                                class="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-orange-600 uppercase">SECOND</span>
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
                                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-700 text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                                                                AT
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full"
                                                                title="Ana Tanaka">Ana</p>
                                                            <span
                                                                class="text-[8px] sm:text-[9px] font-bold text-teal-700 bg-teal-100/90 px-1.5 py-0.2 rounded-full">2.1k
                                                                XP</span>
                                                            <!-- Star -->
                                                            <div
                                                                class="pt-0.5 text-amber-400 text-sm sm:text-lg drop-shadow-xs">
                                                                <i class="fas fa-star"></i>
                                                            </div>
                                                        </div>

                                                        <!-- Vertical Pillar Bar (Rank 3) -->
                                                        <div
                                                            class="w-full h-30 sm:h-38 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-t from-teal-600 via-teal-500 to-emerald-400 shadow-md group-hover:shadow-lg group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t border-teal-200/50">
                                                            <div
                                                                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white/90 bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                                                                03
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p
                                                                    class="text-[9px] sm:text-[10px] font-bold text-white leading-tight">
                                                                    2,190</p>
                                                                <span
                                                                    class="text-[7px] sm:text-[8px] font-semibold bg-black/20 text-white/95 px-1 py-0.2 rounded-full inline-block">11
                                                                    🏅</span>
                                                            </div>
                                                        </div>

                                                        <!-- Bottom Label -->
                                                        <div
                                                            class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                                                            <span
                                                                class="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-teal-600 uppercase">THIRD</span>
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
                                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                                                                MS
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full"
                                                                title="Maria Santos">Maria</p>
                                                            <span
                                                                class="text-[8px] sm:text-[9px] font-bold text-blue-700 bg-blue-100/90 px-1.5 py-0.2 rounded-full">1.4k
                                                                XP</span>
                                                            <!-- Star -->
                                                            <div
                                                                class="pt-0.5 text-amber-400 text-sm sm:text-lg drop-shadow-xs">
                                                                <i class="fas fa-star"></i>
                                                            </div>
                                                        </div>

                                                        <!-- Vertical Pillar Bar (Rank 4) -->
                                                        <div
                                                            class="w-full h-24 sm:h-32 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-t from-blue-600 via-cyan-500 to-sky-400 shadow-md group-hover:shadow-lg group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t border-blue-200/50">
                                                            <div
                                                                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white/90 bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                                                                04
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p
                                                                    class="text-[9px] sm:text-[10px] font-bold text-white leading-tight">
                                                                    1,480</p>
                                                                <span
                                                                    class="text-[7px] sm:text-[8px] font-semibold bg-black/20 text-white/95 px-1 py-0.2 rounded-full inline-block">9
                                                                    🏅</span>
                                                            </div>
                                                        </div>

                                                        <!-- Bottom Label -->
                                                        <div
                                                            class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                                                            <span
                                                                class="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-blue-600 uppercase">FOURTH</span>
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
                                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-700 text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                                                                CG
                                                            </div>
                                                            <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full"
                                                                title="Carlos Gomez">Carlos</p>
                                                            <span
                                                                class="text-[8px] sm:text-[9px] font-bold text-slate-700 bg-slate-200/90 px-1.5 py-0.2 rounded-full">1.3k
                                                                XP</span>
                                                            <!-- Star -->
                                                            <div
                                                                class="pt-0.5 text-amber-400 text-sm sm:text-lg drop-shadow-xs">
                                                                <i class="fas fa-star"></i>
                                                            </div>
                                                        </div>

                                                        <!-- Vertical Pillar Bar (Rank 5) -->
                                                        <div
                                                            class="w-full h-20 sm:h-26 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-t from-slate-700 via-slate-600 to-slate-400 shadow-md group-hover:shadow-lg group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t border-slate-300/50">
                                                            <div
                                                                class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white/90 bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                                                                05
                                                            </div>
                                                            <div class="space-y-0.5 text-center">
                                                                <p
                                                                    class="text-[9px] sm:text-[10px] font-bold text-white leading-tight">
                                                                    1,320</p>
                                                                <span
                                                                    class="text-[7px] sm:text-[8px] font-semibold bg-black/20 text-white/95 px-1 py-0.2 rounded-full inline-block">8
                                                                    🏅</span>
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
                                            class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5">
                                            <i class="fas fa-award text-amber-600"></i>
                                            <span>View All 100 Leaderboard Ranks & Kudos</span>
                                        </button>
                                    </div>

                                    <!-- Column 2: Department Completion & Progress Comparison (7 cols) -->
                                    <div class="lg:col-span-7 card-clean p-6 space-y-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="font-heading font-bold text-base text-slate-900">
                                                    Department Execution Matrix</h3>
                                                <p class="text-xs text-slate-500">Goal Approval %, LMS
                                                    Completion %, and Succession Depth by Department</p>
                                            </div>
                                            <span
                                                class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Q3
                                                Cycle</span>
                                        </div>

                                        <!-- Department Comparison Horizontal Bar Chart -->
                                        <div class="h-44 w-full">
                                            <canvas id="chart-system-dept-progress"></canvas>
                                        </div>

                                        <!-- Department Breakdown Mini Table -->
                                        <div class="overflow-x-auto custom-scrollbar pt-2 border-t border-slate-100">
                                            <table class="w-full text-left text-xs">
                                                <thead>
                                                    <tr class="text-slate-400 font-semibold border-b border-slate-100">
                                                        <th class="pb-2 font-medium">Department</th>
                                                        <th class="pb-2 font-medium text-center">Staff</th>
                                                        <th class="pb-2 font-medium text-center">Goals Approved
                                                        </th>
                                                        <th class="pb-2 font-medium text-center">LMS Rate</th>
                                                        <th class="pb-2 font-medium text-center">Succession</th>
                                                        <th class="pb-2 font-medium text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="divide-y divide-slate-100">
                                                    <tr>
                                                        <td class="py-2 font-bold text-slate-800">Front Office
                                                        </td>
                                                        <td class="py-2 text-center text-slate-500">12</td>
                                                        <td class="py-2 text-center font-bold text-emerald-600">
                                                            96.2%</td>
                                                        <td class="py-2 text-center font-bold text-primary">
                                                            98.0%</td>
                                                        <td class="py-2 text-center font-bold text-indigo-600">
                                                            85.0%</td>
                                                        <td class="py-2 text-right"><span
                                                                class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="py-2 font-bold text-slate-800">Food &
                                                            Beverage</td>
                                                        <td class="py-2 text-center text-slate-500">24</td>
                                                        <td class="py-2 text-center font-bold text-emerald-600">
                                                            95.0%</td>
                                                        <td class="py-2 text-center font-bold text-primary">
                                                            96.5%</td>
                                                        <td class="py-2 text-center font-bold text-indigo-600">
                                                            80.0%</td>
                                                        <td class="py-2 text-right"><span
                                                                class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Optimal</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="py-2 font-bold text-slate-800">Kitchen &
                                                            Culinary</td>
                                                        <td class="py-2 text-center text-slate-500">18</td>
                                                        <td class="py-2 text-center font-bold text-emerald-600">
                                                            94.0%</td>
                                                        <td class="py-2 text-center font-bold text-primary">
                                                            92.0%</td>
                                                        <td class="py-2 text-center font-bold text-indigo-600">
                                                            78.0%</td>
                                                        <td class="py-2 text-right"><span
                                                                class="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Good</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="py-2 font-bold text-slate-800">Banquet &
                                                            Events</td>
                                                        <td class="py-2 text-center text-slate-500">18</td>
                                                        <td class="py-2 text-center font-bold text-emerald-600">
                                                            93.0%</td>
                                                        <td class="py-2 text-center font-bold text-primary">
                                                            94.0%</td>
                                                        <td class="py-2 text-center font-bold text-indigo-600">
                                                            76.0%</td>
                                                        <td class="py-2 text-right"><span
                                                                class="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Good</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="py-2 font-bold text-slate-800">Housekeeping
                                                        </td>
                                                        <td class="py-2 text-center text-slate-500">28</td>
                                                        <td class="py-2 text-center font-bold text-emerald-600">
                                                            90.5%</td>
                                                        <td class="py-2 text-center font-bold text-primary">
                                                            91.0%</td>
                                                        <td class="py-2 text-center font-bold text-indigo-600">
                                                            72.5%</td>
                                                        <td class="py-2 text-right"><span
                                                                class="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Good</span>
                                                        </td>
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
                                            <span
                                                class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                                                <i class="fas fa-scale-balanced text-indigo-600"></i>
                                                <span>Calibration Normalization</span>
                                            </span>
                                            <span
                                                class="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">100%
                                                Calibrated</span>
                                        </div>
                                        <p class="text-xs text-slate-500">Target normal curve (15% Top / 70%
                                            Core / 15% Growth) successfully enforced across 100 evaluations.</p>
                                        <div class="flex items-center space-x-1 text-[11px] pt-1">
                                            <span
                                                class="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold">15
                                                Exceeds</span>
                                            <span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold">70
                                                Core Meets</span>
                                            <span class="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md font-bold">15
                                                Developing</span>
                                        </div>
                                    </div>

                                    <!-- Highlight 2: Turnaround Speed -->
                                    <div class="card-clean p-5 space-y-2">
                                        <div class="flex items-center justify-between">
                                            <span
                                                class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                                                <i class="fas fa-stopwatch text-emerald-600"></i>
                                                <span>Review Turnaround Velocity</span>
                                            </span>
                                            <span
                                                class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">4.2
                                                Days Avg</span>
                                        </div>
                                        <p class="text-xs text-slate-500">Average duration from employee draft
                                            submission to supervisor review and HR approval sign-off.</p>
                                        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                            <span>SLA Target: &lt; 7.0 Days</span>
                                            <span class="text-emerald-600 font-bold">0 Overdue Reviews</span>
                                        </div>
                                    </div>

                                    <!-- Highlight 3: AI Copilot Assists -->
                                    <div class="card-clean p-5 space-y-2">
                                        <div class="flex items-center justify-between">
                                            <span
                                                class="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                                                <i class="fas fa-sparkles text-purple-600"></i>
                                                <span>Gemini AI Copilot Adoption</span>
                                            </span>
                                            <span
                                                class="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">312
                                                Assists</span>
                                        </div>
                                        <p class="text-xs text-slate-500">312 AI-recommended SMART developmental
                                            objectives and tailored feedback suggestions accepted this cycle.
                                        </p>
                                        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                            <span>Goal Clarity: 98.4%</span>
                                            <span class="text-purple-600 font-bold">89% Action Rate</span>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                        <!-- ======================================================== -->
                        <!-- ======================================================== -->
                        <!-- PILLAR 1: PERFORMANCE MANAGEMENT (7-STAGE CONTINUOUS CYCLE) -->
