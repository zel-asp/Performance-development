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
                                        <script>
                                            (function() {
                                                try {
                                                    var activeId = window.currentUser?.id || (window.activePersonaRole === 'Supervisor' ? 'emp-102' : 'emp-101');
                                                    var rawCached = localStorage.getItem('oxford_cached_total_xp_' + activeId);
                                                    if (rawCached !== null) {
                                                        var xp = parseInt(rawCached, 10) || 0;
                                                        var elVal = document.getElementById('kpi-xp-val');
                                                        if (elVal) elVal.innerHTML = xp.toLocaleString() + ' <span class="text-xs font-normal text-slate-400">XP</span>';
                                                    }
                                                } catch(e) {}
                                            })();
                                        </script>
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
                                            <button id="btn-log-checkin-modal" onclick="openModal('modal-sentiment-pulse')"
                                                class="text-xs font-bold text-primary hover:underline flex items-center space-x-1 transition">
                                                <i class="fas fa-pen text-[10px]"></i>
                                                <span id="btn-log-checkin-text">Log Check-In</span>
                                            </button>
                                        </div>

                                        <!-- Active Personal Status Banner -->
                                        <div id="my-shift-sentiment-banner" class="p-4 rounded-2xl bg-sage-50/70 border border-sage-200/80 flex items-center justify-between gap-3 transition-all">
                                            <div class="flex items-center space-x-3">
                                                <div id="my-shift-sentiment-emoji" class="w-12 h-12 rounded-2xl bg-sage-dark text-white flex items-center justify-center text-2xl shadow-xs transition-all">
                                                    😊
                                                </div>
                                                <div>
                                                    <span id="my-shift-sentiment-tag" class="text-[10px] font-bold uppercase tracking-wider text-sage-dark">Today's Check-in</span>
                                                    <h4 id="my-shift-sentiment-title" class="font-heading font-bold text-slate-900 text-sm">Smooth &amp; Energized</h4>
                                                    <p id="my-shift-sentiment-desc" class="text-[11px] text-slate-500">Front Desk shift operating on schedule with zero blockers.</p>
                                                </div>
                                            </div>
                                            <span id="my-shift-sentiment-badge" class="badge-sage flex-shrink-0">Active</span>
                                        </div>

                                        <!-- Quick Sentiment Logger Buttons -->
                                        <div class="space-y-1.5">
                                            <div class="flex items-center justify-between">
                                                <span class="text-[11px] font-bold text-slate-600 block">Quick Shift Mood Update:</span>
                                                <span id="my-shift-already-logged-hint" class="hidden text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                    <i class="fas fa-check-circle mr-1 text-emerald-600"></i>Logged for Today
                                                </span>
                                            </div>
                                            <div class="grid grid-cols-3 gap-2" id="quick-mood-btn-group">
                                                <button id="quick-mood-btn-smooth" type="button" onclick="logQuickSentiment('smooth')" class="quick-sentiment-btn p-2.5 rounded-xl border border-sage-200 bg-white hover:bg-sage-50 text-slate-800 flex flex-col items-center justify-center space-y-1 transition group">
                                                    <span class="text-lg group-hover:scale-110 transition-transform">😊</span>
                                                    <span class="text-[11px] font-bold text-sage-dark">Smooth</span>
                                                    <span class="text-[9px] text-slate-400">Clear focus</span>
                                                </button>
                                                <button id="quick-mood-btn-manageable" type="button" onclick="logQuickSentiment('manageable')" class="quick-sentiment-btn p-2.5 rounded-xl border border-dusty-200 bg-white hover:bg-dusty-50 text-slate-800 flex flex-col items-center justify-center space-y-1 transition group">
                                                    <span class="text-lg group-hover:scale-110 transition-transform">😐</span>
                                                    <span class="text-[11px] font-bold text-dusty-dark">Manageable</span>
                                                    <span class="text-[9px] text-slate-400">Steady load</span>
                                                </button>
                                                <button id="quick-mood-btn-friction" type="button" onclick="logQuickSentiment('friction')" class="quick-sentiment-btn p-2.5 rounded-xl border border-terracotta-200 bg-white hover:bg-terracotta-50 text-slate-800 flex flex-col items-center justify-center space-y-1 transition group">
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
                                            onclick="openExportSummaryModal()"
                                            class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-2 shadow-xs hover:shadow-md transition">
                                            <i class="fas fa-file-export text-xs"></i>
                                            <span>Export Summary</span>
                                        </button>
                                    </div>
                                </div>

                                <?php
                                // Dynamic calculations for System KPIs and Department Execution Matrix from Database
                                $livePropertyXp = 0;
                                $liveKudosSent = 0;
                                $liveBadgesCount = 0;
                                $liveActiveStaffCount = 0;

                                $liveTotalGoals = 0;
                                $liveApprovedGoals = 0;
                                $liveReviewGoals = 0;
                                $liveReviseGoals = 0;
                                $liveGoalsApprovalRate = 0.0;

                                $liveTotalPrescribed = 0;
                                $livePassedPrescribed = 0;
                                $liveLmsAvgScore = 0.0;
                                $liveLmsRate = 0.0;

                                $totalRolesCount = 0;
                                $coveredRolesCount = 0;
                                $fastTrackCount = 0;
                                $liveBenchDepthPct = 0.0;

                                $canonicalDepts = [
                                    'Front Office',
                                    'Food & Beverage',
                                    'Kitchen & Culinary',
                                    'Banquet & Events',
                                    'Housekeeping'
                                ];

                                $normalizeDept = function($name) {
                                    $lower = strtolower(trim((string)$name));
                                    if (strpos($lower, 'front') !== false) return 'Front Office';
                                    if (strpos($lower, 'culinary') !== false || strpos($lower, 'kitchen') !== false || strpos($lower, 'chef') !== false) return 'Kitchen & Culinary';
                                    if (strpos($lower, 'food') !== false || strpos($lower, 'beverage') !== false || strpos($lower, 'f&b') !== false || strpos($lower, 'dining') !== false) return 'Food & Beverage';
                                    if (strpos($lower, 'banquet') !== false || strpos($lower, 'event') !== false) return 'Banquet & Events';
                                    if (strpos($lower, 'housekeep') !== false) return 'Housekeeping';
                                    if (strpos($lower, 'human') !== false || strpos($lower, 'hr') !== false) return 'Human Resources';
                                    if (strpos($lower, 'finance') !== false || strpos($lower, 'account') !== false) return 'Finance';
                                    if (strpos($lower, 'engineer') !== false) return 'Engineering';
                                    if (strpos($lower, 'security') !== false) return 'Security';
                                    return 'Front Office';
                                };

                                $deptBuckets = [];
                                foreach ($canonicalDepts as $cDept) {
                                    $deptBuckets[$cDept] = [
                                        'department'       => $cDept,
                                        'staff_count'      => 0,
                                        'goals_total'      => 0,
                                        'goals_approved'   => 0,
                                        'lms_total'        => 0,
                                        'lms_progress_sum' => 0,
                                        'succ_candidates'  => 0,
                                        'succ_ready'       => 0
                                    ];
                                }

                                try {
                                    $pdoOverview = getSupabaseDb();
                                    if ($pdoOverview) {
                                        // Staff count strictly from employees table
                                        $empCntStmt = $pdoOverview->query("SELECT COUNT(*) FROM public.employees");
                                        $liveActiveStaffCount = $empCntStmt ? (int)$empCntStmt->fetchColumn() : 0;

                                        // Total XP from unified xp_ledger
                                        $xpStmt = $pdoOverview->query("SELECT COALESCE(SUM(points), 0) AS total_xp FROM public.xp_ledger");
                                        $xpRow = $xpStmt ? $xpStmt->fetch(PDO::FETCH_ASSOC) : null;
                                        if ($xpRow) $livePropertyXp = (int)$xpRow['total_xp'];

                                        // Kudos count
                                        $kudosStmt = $pdoOverview->query("SELECT COUNT(*) AS kudos_cnt FROM public.social_recognitions");
                                        $kudosRow = $kudosStmt ? $kudosStmt->fetch(PDO::FETCH_ASSOC) : null;
                                        if ($kudosRow) $liveKudosSent = (int)$kudosRow['kudos_cnt'];

                                        // Badges count
                                        $badgeStmt = $pdoOverview->query("SELECT COUNT(*) AS badge_cnt FROM public.xp_ledger WHERE source_type IN ('peer_kudos', 'supervisor_kudos', 'training_cert', 'lms_quiz')");
                                        $bRow = $badgeStmt ? $badgeStmt->fetch(PDO::FETCH_ASSOC) : null;
                                        if ($bRow) $liveBadgesCount = (int)$bRow['badge_cnt'];

                                        // Goal Approval Rate strictly from performance_goals table
                                        $goalsStmt = $pdoOverview->query("SELECT 
                                            COUNT(*) AS total_goals,
                                            COUNT(*) FILTER (WHERE LOWER(status::text) IN ('approved', 'done', 'completed', 'active', 'endorsed', 'calibrated')) AS approved_goals,
                                            COUNT(*) FILTER (WHERE LOWER(status::text) IN ('pending', 'pending approval', 'in review', 'submitted')) AS review_goals,
                                            COUNT(*) FILTER (WHERE LOWER(status::text) IN ('needs revision', 'revise', 'revision', 'rejected')) AS revise_goals
                                        FROM public.performance_goals");
                                        $goalsRow = $goalsStmt ? $goalsStmt->fetch(PDO::FETCH_ASSOC) : null;
                                        if ($goalsRow) {
                                            $liveTotalGoals = (int)($goalsRow['total_goals'] ?? 0);
                                            $liveApprovedGoals = (int)($goalsRow['approved_goals'] ?? 0);
                                            $liveReviewGoals = (int)($goalsRow['review_goals'] ?? 0);
                                            $liveReviseGoals = (int)($goalsRow['revise_goals'] ?? 0);
                                            $liveGoalsApprovalRate = $liveTotalGoals > 0 ? round(($liveApprovedGoals / $liveTotalGoals) * 100, 1) : 0.0;
                                        }

                                        // LMS Course Completion strictly from lms_prescribed table
                                        $lmsStmt = $pdoOverview->query("SELECT 
                                            COUNT(*) AS total_prescribed,
                                            COUNT(*) FILTER (WHERE LOWER(status::text) IN ('passed', 'completed') OR progress >= 80) AS passed_prescribed,
                                            COALESCE(AVG(progress), 0) AS avg_progress
                                        FROM public.lms_prescribed");
                                        $lmsRow = $lmsStmt ? $lmsStmt->fetch(PDO::FETCH_ASSOC) : null;
                                        if ($lmsRow) {
                                            $liveTotalPrescribed = (int)($lmsRow['total_prescribed'] ?? 0);
                                            $livePassedPrescribed = (int)($lmsRow['passed_prescribed'] ?? 0);
                                            $liveLmsAvgScore = round((float)($lmsRow['avg_progress'] ?? 0), 1);
                                            $liveLmsRate = $liveTotalPrescribed > 0 ? round(($livePassedPrescribed / $liveTotalPrescribed) * 100, 1) : 0.0;
                                        }

                                        // Succession Bench Depth strictly from succession_positions & succession_candidates
                                        $posStmt = $pdoOverview->query("SELECT COUNT(*) AS total_roles, COUNT(*) FILTER (WHERE primary_successor_id IS NOT NULL AND primary_successor_id != '') AS covered_roles FROM public.succession_positions");
                                        $posRow = $posStmt ? $posStmt->fetch(PDO::FETCH_ASSOC) : null;
                                        if ($posRow) {
                                            $totalRolesCount = (int)($posRow['total_roles'] ?? 0);
                                            $coveredRolesCount = (int)($posRow['covered_roles'] ?? 0);
                                        }

                                        $candStmt = $pdoOverview->query("SELECT COUNT(*) AS total_cands, COUNT(*) FILTER (WHERE LOWER(hr_readiness_flag::text) LIKE '%ready now%') AS fast_track FROM public.succession_candidates");
                                        $candRow = $candStmt ? $candStmt->fetch(PDO::FETCH_ASSOC) : null;
                                        if ($candRow) {
                                            $fastTrackCount = (int)($candRow['fast_track'] ?? 0);
                                        }
                                        $liveBenchDepthPct = $totalRolesCount > 0 ? round(($coveredRolesCount / $totalRolesCount) * 100, 1) : 0.0;

                                        // Department Execution Matrix aggregation
                                        $deptsStmt = $pdoOverview->query("SELECT id, name FROM public.departments ORDER BY name");
                                        $allDepts = $deptsStmt ? $deptsStmt->fetchAll(PDO::FETCH_ASSOC) : [];
                                        $deptIdMap = [];
                                        foreach ($allDepts as $d) {
                                            if (!empty($d['id']) && !empty($d['name'])) $deptIdMap[$d['id']] = $d['name'];
                                        }

                                        $empsStmt = $pdoOverview->query("SELECT id, full_name, department_id, title, status FROM public.employees");
                                        $allEmps = $empsStmt ? $empsStmt->fetchAll(PDO::FETCH_ASSOC) : [];

                                        $allGoals = $pdoOverview->query("SELECT id, employee_id, department, status::text AS status, weight FROM public.performance_goals")->fetchAll(PDO::FETCH_ASSOC) ?: [];
                                        $allLms = $pdoOverview->query("SELECT id, employee, status::text AS status, progress FROM public.lms_prescribed")->fetchAll(PDO::FETCH_ASSOC) ?: [];
                                        $allSucc = $pdoOverview->query("SELECT sc.id, sc.employee_id, sc.position_id, sc.hr_readiness_flag::text AS hr_readiness_flag, sp.dept as pos_dept 
                                            FROM public.succession_candidates sc 
                                            LEFT JOIN public.succession_positions sp ON sc.position_id = sp.id")->fetchAll(PDO::FETCH_ASSOC) ?: [];

                                        $empDeptMap = [];
                                        foreach ($allEmps as $emp) {
                                            $dName = '';
                                            if (!empty($emp['department_id']) && isset($deptIdMap[$emp['department_id']])) {
                                                $dName = $deptIdMap[$emp['department_id']];
                                            } else {
                                                $haystack = ($emp['title'] ?? '') . ' ' . ($emp['full_name'] ?? '');
                                                $dName = $normalizeDept($haystack);
                                            }
                                            $empDeptMap[$emp['id']] = $normalizeDept($dName);
                                        }

                                        foreach ($allEmps as $emp) {
                                            $d = $empDeptMap[$emp['id']] ?? 'Front Office';
                                            if (isset($deptBuckets[$d])) {
                                                $deptBuckets[$d]['staff_count']++;
                                            }
                                        }

                                        foreach ($allGoals as $g) {
                                            $gDept = '';
                                            if (!empty($g['department'])) {
                                                $gDept = $normalizeDept($g['department']);
                                            }
                                            if (empty($gDept) && !empty($g['employee_id'])) {
                                                $gDept = $empDeptMap[$g['employee_id']] ?? 'Front Office';
                                            }
                                            if (!isset($deptBuckets[$gDept])) $gDept = 'Front Office';
                                            $deptBuckets[$gDept]['goals_total']++;
                                            $st = strtolower(trim((string)($g['status'] ?? '')));
                                            if (in_array($st, ['approved', 'done', 'completed', 'active', 'endorsed', 'calibrated'])) {
                                                $deptBuckets[$gDept]['goals_approved']++;
                                            }
                                        }

                                        foreach ($allLms as $l) {
                                            $eId = $l['employee'] ?? '';
                                            $d = $empDeptMap[$eId] ?? 'Front Office';
                                            if (!isset($deptBuckets[$d])) $d = 'Front Office';
                                            $deptBuckets[$d]['lms_total']++;
                                            $prog = (float)($l['progress'] ?? 0);
                                            $deptBuckets[$d]['lms_progress_sum'] += $prog;
                                        }

                                        foreach ($allSucc as $s) {
                                            $d = '';
                                            if (!empty($s['pos_dept'])) {
                                                $d = $normalizeDept($s['pos_dept']);
                                            } elseif (!empty($s['employee_id'])) {
                                                $d = $empDeptMap[$s['employee_id']] ?? 'Front Office';
                                            }
                                            if (empty($d) || !isset($deptBuckets[$d])) $d = 'Front Office';
                                            $deptBuckets[$d]['succ_candidates']++;
                                            $flag = strtolower(trim((string)($s['hr_readiness_flag'] ?? '')));
                                            if (strpos($flag, 'ready now') !== false || strpos($flag, 'ready in') !== false) {
                                                $deptBuckets[$d]['succ_ready']++;
                                            }
                                        }
                                    }
                                } catch (Throwable $e) {}

                                // Grade & bar calculation
                                if ($livePropertyXp >= 10000) $liveXpGrade = 'Grade A+';
                                elseif ($livePropertyXp >= 5000) $liveXpGrade = 'Grade A';
                                elseif ($livePropertyXp >= 2000) $liveXpGrade = 'Grade B+';
                                elseif ($livePropertyXp > 0) $liveXpGrade = 'Grade B';
                                else $liveXpGrade = 'Grade C';

                                $xpBarPct = min(100, max(0, round(($livePropertyXp / 3000) * 100)));

                                if ($liveBenchDepthPct >= 75) {
                                    $benchRisk = 'Low Risk';
                                    $benchRiskClass = 'text-sage-dark';
                                    $benchBadgeClass = 'badge-dusty';
                                } elseif ($liveBenchDepthPct >= 50) {
                                    $benchRisk = 'Moderate Risk';
                                    $benchRiskClass = 'text-gold-dark';
                                    $benchBadgeClass = 'badge-gold';
                                } elseif ($liveBenchDepthPct > 0) {
                                    $benchRisk = 'Elevated Risk';
                                    $benchRiskClass = 'text-rose-600';
                                    $benchBadgeClass = 'badge-terracotta';
                                } else {
                                    $benchRisk = 'Pipeline Empty';
                                    $benchRiskClass = 'text-slate-400';
                                    $benchBadgeClass = 'bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full';
                                }

                                $deptMatrixRows = [];
                                foreach ($canonicalDepts as $cDept) {
                                    $b = $deptBuckets[$cDept];
                                    $goalsPct = $b['goals_total'] > 0 ? round(($b['goals_approved'] / $b['goals_total']) * 100, 1) : 0.0;
                                    $lmsPct = $b['lms_total'] > 0 ? round($b['lms_progress_sum'] / $b['lms_total'], 1) : 0.0;
                                    $succPct = $b['succ_candidates'] > 0 ? round(($b['succ_ready'] / $b['succ_candidates']) * 100, 1) : 0.0;
                                    $composite = round(($goalsPct * 0.35) + ($lmsPct * 0.35) + ($succPct * 0.30), 1);

                                    if ($composite >= 80) {
                                        $status = 'Optimal';
                                        $badgeClass = 'badge-sage';
                                    } elseif ($composite >= 50) {
                                        $status = 'Good';
                                        $badgeClass = 'badge-dusty';
                                    } elseif ($composite > 0 || $b['staff_count'] > 0) {
                                        $status = 'Developing';
                                        $badgeClass = 'badge-terracotta';
                                    } else {
                                        $status = 'Pending';
                                        $badgeClass = 'bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full';
                                    }

                                    $deptMatrixRows[] = [
                                        'department'           => $cDept,
                                        'staff_count'          => $b['staff_count'],
                                        'goals_approved_pct'   => $goalsPct,
                                        'lms_rate_pct'         => $lmsPct,
                                        'succession_ready_pct' => $succPct,
                                        'composite_score'      => $composite,
                                        'status'               => $status,
                                        'badge_class'          => $badgeClass
                                    ];
                                }
                                ?>

                                <!-- 4 Master System-Wide KPI Cards -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                    <!-- System KPI 1: Approved Goals Count (100% Dynamic from performance_goals) -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Goal Approval Rate</span>
                                            <span class="<?= $liveGoalsApprovalRate >= 80 ? 'badge-sage' : ($liveGoalsApprovalRate > 0 ? 'badge-dusty' : 'bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full') ?>" id="sys-kpi-goals-rate-badge"><?= $liveGoalsApprovalRate ?>% Approved</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900" id="sys-kpi-goals-ratio"><?= $liveApprovedGoals ?>
                                                <span class="text-sm font-normal text-slate-400">/ <?= $liveTotalGoals ?></span></span>
                                            <span class="text-xs text-slate-400 font-medium" id="sys-kpi-goals-subtext"><?= $liveTotalGoals > 0 ? 'Live Database' : 'No Goals Set' ?></span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div class="bg-sage h-1.5 rounded-full transition-all duration-500" id="sys-kpi-goals-bar" style="width: <?= $liveGoalsApprovalRate ?>%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500" id="sys-kpi-goals-breakdown">
                                            <span><?= $liveApprovedGoals ?> Approved</span>
                                            <span class="text-gold-dark font-medium"><?= $liveReviewGoals ?> In Review</span>
                                            <span class="text-slate-400"><?= $liveReviseGoals ?> Revise</span>
                                        </div>
                                    </div>

                                    <!-- System KPI 2: Total Gamified XP (100% Dynamic from xp_ledger) -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Total Property XP</span>
                                            <span class="badge-gold" id="sys-kpi-property-xp-grade"><?= htmlspecialchars($liveXpGrade) ?></span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-gold-dark" id="sys-kpi-property-xp-val"><?= number_format($livePropertyXp) ?>
                                                <span class="text-xs font-normal text-slate-400">XP</span></span>
                                            <span class="text-xs text-slate-500 font-medium" id="sys-kpi-property-xp-staff"><?= $liveActiveStaffCount ?> Staff</span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div class="bg-gold h-1.5 rounded-full transition-all duration-500" id="sys-kpi-property-xp-bar" style="width: <?= $xpBarPct ?>%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500">
                                            <span id="sys-kpi-property-xp-kudos"><?= number_format($liveKudosSent) ?> Kudos Sent</span>
                                            <span class="text-gold-dark font-medium" id="sys-kpi-property-xp-badges"><?= number_format($liveBadgesCount) ?> Badges</span>
                                        </div>
                                    </div>

                                    <!-- System KPI 3: Average LMS Completion Rate (100% Dynamic from lms_prescribed) -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>LMS Course Completion</span>
                                            <span class="<?= $liveLmsRate >= 80 ? 'badge-primary' : ($liveLmsRate > 0 ? 'badge-dusty' : 'bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full') ?>" id="sys-kpi-lms-rate-badge"><?= $liveLmsRate ?>% Rate</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900" id="sys-kpi-lms-rate-val"><?= $liveLmsRate ?>%</span>
                                            <span class="text-xs text-slate-400" id="sys-kpi-lms-target"><?= $liveTotalPrescribed > 0 ? 'Target: 80.0%' : 'No Courses' ?></span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div class="bg-primary h-1.5 rounded-full transition-all duration-500" id="sys-kpi-lms-bar" style="width: <?= $liveLmsRate ?>%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500" id="sys-kpi-lms-breakdown">
                                            <span><?= $livePassedPrescribed ?> / <?= $liveTotalPrescribed ?> Modules</span>
                                            <span class="text-sage-dark font-medium"><?= $liveLmsAvgScore ?>% Avg Score</span>
                                        </div>
                                    </div>

                                    <!-- System KPI 4: Succession Pipeline Health Rate (100% Dynamic from succession tables) -->
                                    <div class="card-clean p-5 space-y-3">
                                        <div
                                            class="flex justify-between items-center text-xs text-slate-500 font-medium">
                                            <span>Succession Bench Depth</span>
                                            <span class="<?= $benchBadgeClass ?>" id="sys-kpi-succession-badge"><?= $liveBenchDepthPct ?>% Ready</span>
                                        </div>
                                        <div class="flex items-baseline space-x-2">
                                            <span class="text-3xl font-heading font-bold text-slate-900" id="sys-kpi-succession-val"><?= $liveBenchDepthPct ?>%</span>
                                            <span class="text-xs <?= $benchRiskClass ?> font-semibold" id="sys-kpi-succession-risk"><?= $benchRisk ?></span>
                                        </div>
                                        <div class="w-full bg-[#FAF8F7] h-1.5 rounded-full overflow-hidden border border-[#E8DEDC]/50">
                                            <div class="bg-dusty h-1.5 rounded-full transition-all duration-500" id="sys-kpi-succession-bar" style="width: <?= $liveBenchDepthPct ?>%">
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center text-[11px] text-slate-500">
                                            <span id="sys-kpi-succession-roles"><?= $coveredRolesCount ?> / <?= max(1, $totalRolesCount) ?> Key Roles Covered</span>
                                            <span class="text-slate-400" id="sys-kpi-succession-fasttrack"><?= $fastTrackCount ?> In Fast-Track</span>
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
                                            <div class="flex items-center space-x-2">
                                                <span class="badge-primary">Q3 Cycle</span>
                                                <span class="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all duration-300" id="dept-matrix-realtime-badge" title="Connected to Supabase Realtime Telemetry">
                                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    <span>Live Telemetry</span>
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Department Comparison Horizontal Bar Chart -->
                                        <div class="h-44 w-full relative">
                                            <canvas id="chart-system-dept-progress"></canvas>
                                            <div id="dept-matrix-loading-overlay" class="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-lg hidden flex items-center justify-center transition-opacity">
                                                <div class="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-white/90 shadow-sm px-3 py-1.5 rounded-full border border-slate-200">
                                                    <i class="fas fa-circle-notch fa-spin text-primary"></i>
                                                    <span>Syncing with Database...</span>
                                                </div>
                                            </div>
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
                                                <tbody id="table-dept-execution-matrix-body" class="divide-y divide-[#E8DEDC]">
                                                    <?php foreach ($deptMatrixRows as $dRow): 
                                                        $gColor = $dRow['goals_approved_pct'] > 0 ? 'text-sage-dark font-bold' : 'text-slate-400 font-medium';
                                                        $lColor = $dRow['lms_rate_pct'] > 0 ? 'text-primary font-bold' : 'text-slate-400 font-medium';
                                                        $sColor = $dRow['succession_ready_pct'] > 0 ? 'text-dusty-dark font-bold' : 'text-slate-400 font-medium';
                                                    ?>
                                                    <tr class="hover:bg-slate-50/50 transition-colors">
                                                        <td class="py-2.5 font-bold text-slate-800"><?= htmlspecialchars($dRow['department']) ?></td>
                                                        <td class="py-2.5 text-center text-slate-500 font-medium"><?= (int)$dRow['staff_count'] ?></td>
                                                        <td class="py-2.5 text-center <?= $gColor ?>"><?= number_format($dRow['goals_approved_pct'], 1) ?>%</td>
                                                        <td class="py-2.5 text-center <?= $lColor ?>"><?= number_format($dRow['lms_rate_pct'], 1) ?>%</td>
                                                        <td class="py-2.5 text-center <?= $sColor ?>"><?= number_format($dRow['succession_ready_pct'], 1) ?>%</td>
                                                        <td class="py-2.5 text-right"><span class="<?= $dRow['badge_class'] ?>"><?= htmlspecialchars($dRow['status']) ?></span></td>
                                                    </tr>
                                                    <?php endforeach; ?>
                                                </tbody>
                                            </table>
                                            <script>
                                                window.initialDeptMatrixData = <?= json_encode($deptMatrixRows) ?>;
                                            </script>
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
                                                <p id="pulse-total-staff-subtitle" class="text-xs text-slate-500">Aggregated Employee Sentiment (Live Supabase Telemetry)</p>
                                            </div>
                                        </div>
                                        <div class="h-48 w-full flex items-center justify-center relative">
                                            <canvas id="chart-sentiment-doughnut"></canvas>
                                            
                                            <!-- Empty State for Shift Climate Pulse -->
                                            <div id="chart-sentiment-empty-state" class="hidden absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-slate-50/90 rounded-2xl border border-dashed border-slate-200">
                                                <div class="w-11 h-11 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg mb-2 shadow-2xs">
                                                    <i class="fas fa-heart-pulse text-primary/60"></i>
                                                </div>
                                                <p class="font-bold text-xs text-slate-700">No Shift Climate Data</p>
                                                <p class="text-[10px] text-slate-400 mt-0.5 max-w-[210px] leading-tight">No employee shift sentiments recorded yet in Supabase. Check in above to start tracking live team pulse.</p>
                                            </div>
                                        </div>
                                        <div
                                            class="flex justify-around text-center text-xs pt-3 border-t border-[#E8DEDC]">
                                            <div>
                                                <p id="pulse-smooth-pct" class="font-bold text-sage-dark">0.0%</p>
                                                <p class="text-[10px] text-slate-500">Smooth</p>
                                            </div>
                                            <div>
                                                <p id="pulse-manageable-pct" class="font-bold text-dusty-dark">0.0%</p>
                                                <p class="text-[10px] text-slate-500">Manageable</p>
                                            </div>
                                            <div>
                                                <p id="pulse-friction-pct" class="font-bold text-terracotta-dark">0.0%</p>
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
