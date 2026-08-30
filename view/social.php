<!-- ======================================================== -->
<!-- PILLAR 6: SOCIAL RECOGNITION, DETERMINISTIC POINTS & XP  -->
<!-- Scope: Peer/Supervisor Kudos -> Deterministic Ledger -> Team Feed -> Qualitative Perf Input -->
<!-- ======================================================== -->
<div id="panel-pillar-social" class="pillar-panel space-y-6">

    <!-- Top KPI Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div class="card-clean p-4 border-l-4 border-l-gold space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Social Recognitions</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-social-count" class="text-xl font-heading font-extrabold text-slate-900">0</span>
                <span class="text-[10px] font-bold text-gold-dark">Peer &amp; Supervisor</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-primary space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">XP Points Awarded</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-social-xp" class="text-xl font-heading font-extrabold text-slate-900">0</span>
                <span class="text-[10px] font-bold text-primary">Deterministic Ledger</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-sage space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Milestone Badges</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-social-badges" class="text-xl font-heading font-extrabold text-slate-900">0</span>
                <span class="text-[10px] font-bold text-emerald-600">Threshold Unlocked</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-dusty space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Perf Review Input</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-social-sync" class="text-xl font-heading font-extrabold text-slate-900">0%</span>
                <span class="text-[10px] font-bold text-dusty-dark">Synced to Q3 Cycle</span>
            </div>
        </div>
    </div>

    <!-- Navigation & Action Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="subnav-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar flex-shrink-0">
            <button onclick="switchSubTab('social', 'kudos')" class="subnav-pill subnav-social active" data-sub="kudos">
                <i class="fas fa-bullhorn mr-1.5 text-gold-dark"></i>
                <span>Recognition Feed</span>
            </button>
            <button onclick="switchSubTab('social', 'ledger')" class="subnav-pill subnav-social" data-sub="ledger">
                <i class="fas fa-receipt mr-1.5 text-primary"></i>
                <span>Points &amp; XP Ledger</span>
            </button>
            <button onclick="switchSubTab('social', 'badges')" class="subnav-pill subnav-social" data-sub="badges">
                <i class="fas fa-medal mr-1.5 text-amber-600"></i>
                <span>Milestone Badges</span>
            </button>
            <button onclick="switchSubTab('social', 'climate')" class="subnav-pill subnav-social" data-sub="climate">
                <i class="fas fa-heart-pulse mr-1.5 text-terracotta-dark"></i>
                <span>24h Shift Sentiment</span>
            </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center space-x-2">
            <button onclick="openModal('modal-sentiment-pulse')" class="btn-secondary px-3.5 py-2 text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 shadow-xs">
                <i class="fas fa-heart-pulse text-sage-dark"></i>
                <span>Log Shift Pulse</span>
            </button>
            <button onclick="openModal('modal-recognition'); if (typeof initKudosRosterModal === 'function') initKudosRosterModal();" class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 shadow-sm">
                <i class="fas fa-hand-holding-heart"></i>
                <span>+ Give Recognition (+50 / +100 XP)</span>
            </button>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 1: RECOGNITION FEED (LIVE TEAM WALL)           -->
    <!-- ======================================================== -->
    <div id="sub-social-kudos" class="sub-panel sub-panel-social active space-y-4 text-xs">
        
        <!-- Filter Header -->
        <div class="card-clean p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Oxford Hospitality Team Recognition Wall</h4>
                <p class="text-slate-500 text-xs">Peer-to-peer and supervisor commendations celebrating 5-star service and teamwork</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <!-- Search Input -->
                <div class="relative">
                    <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                    <input type="text" id="social-feed-search" oninput="filterSocialFeed(this.value)" placeholder="Search post or associate..." class="pl-8 pr-3 py-1.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none w-48 sm:w-56 transition">
                </div>

                <!-- Department Filter Chips -->
                <div class="flex items-center space-x-1 overflow-x-auto custom-scrollbar">
                    <button onclick="setSocialDeptFilter('all')" data-dept="all" class="social-dept-chip px-3 py-1 rounded-full font-bold bg-primary text-white text-[11px] whitespace-nowrap shadow-2xs">All Feed</button>
                    <button onclick="setSocialDeptFilter('front office')" data-dept="front office" class="social-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Front Office</button>
                    <button onclick="setSocialDeptFilter('culinary')" data-dept="culinary" class="social-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Culinary</button>
                    <button onclick="setSocialDeptFilter('f&b service')" data-dept="f&b service" class="social-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">F&amp;B Service</button>
                    <button onclick="setSocialDeptFilter('housekeeping')" data-dept="housekeeping" class="social-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Housekeeping</button>
                </div>
            </div>
        </div>

        <!-- Dynamic Feed List Container -->
        <div id="social-feed-container" class="space-y-4">
            <!-- Rendered dynamically by js/kudos.js -->
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 2: DETERMINISTIC POINT & XP LEDGER             -->
    <!-- ======================================================== -->
    <div id="sub-social-ledger" class="sub-panel sub-panel-social hidden space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">My Personal Points &amp; XP Ledger</h4>
                <p class="text-slate-500 text-xs">Private account audit ledger recording your verified points earned across LMS quizzes, training certs, and kudos</p>
            </div>
            <div class="flex items-center space-x-2">
                <span id="my-ledger-account-label" class="badge-primary"><i class="fas fa-user-shield mr-1"></i> Personal Account Ledger</span>
                <input type="text" id="ledger-search-input" oninput="filterPointLedger(this.value)" placeholder="Filter my transactions..." class="px-3 py-1.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition">
            </div>
        </div>

        <div class="card-clean overflow-x-auto border border-[#E8DEDC]">
            <table class="w-full text-left text-xs min-w-[650px]">
                <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                    <tr>
                        <th class="px-5 py-3">Transaction ID</th>
                        <th class="px-5 py-3">Date</th>
                        <th class="px-5 py-3">Recipient Account</th>
                        <th class="px-5 py-3">Issued By</th>
                        <th class="px-5 py-3">Category / Reason</th>
                        <th class="px-5 py-3">Points Earned</th>
                        <th class="px-5 py-3">Running Balance</th>
                    </tr>
                </thead>
                <tbody id="points-ledger-tbody" class="divide-y divide-[#E8DEDC]">
                    <!-- Rendered dynamically by js/kudos.js -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 3: MILESTONE BADGES (THRESHOLD UNLOCKED)       -->
    <!-- ======================================================== -->
    <div id="sub-social-badges" class="sub-panel sub-panel-social hidden space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Hospitality Milestone &amp; Ambassador Badges</h4>
                <p class="text-slate-500 text-xs">Deterministic badge unlocks awarded when verified qualitative recognition thresholds are met</p>
            </div>
            <span class="badge-gold"><i class="fas fa-crown mr-1"></i> Oxford Honors</span>
        </div>

        <div id="milestone-badges-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Rendered dynamically by js/kudos.js -->
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 4: 24H HOURLY SHIFT SENTIMENT                  -->
    <!-- ======================================================== -->
    <div id="sub-social-climate" class="sub-panel sub-panel-social hidden space-y-4 text-xs">
        <div class="card-clean p-6 space-y-4 bg-white border border-[#E8DEDC]">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900">Shift Sentiment Dynamics by Hour (Rush Analysis)</h3>
                    <p class="text-xs text-slate-500">Realtime monitoring of shift stress peaks to dispatch floor support</p>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="badge-sage flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> Live Supabase Feed</span>
                    <button onclick="openModal('modal-sentiment-pulse')" class="btn-secondary px-3 py-1 text-xs font-bold">
                        <i class="fas fa-plus mr-1"></i> Log Shift Pulse
                    </button>
                </div>
            </div>

            <!-- Date / Period Filter Toolbar -->
            <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] flex flex-wrap items-center justify-between gap-3 relative">
                <div class="flex items-center space-x-1.5 overflow-x-auto">
                    <span class="text-slate-400 text-[10px] font-bold uppercase mr-1">Timeframe:</span>
                    <button onclick="setSentimentTimeFilter('today')" id="climate-btn-today" class="climate-chip px-3 py-1 rounded-full font-bold bg-primary text-white text-[11px] whitespace-nowrap shadow-2xs">Today</button>
                    <button onclick="setSentimentTimeFilter('week')" id="climate-btn-week" class="climate-chip px-3 py-1 rounded-full font-semibold bg-white text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">This Week</button>
                    <button onclick="setSentimentTimeFilter('month')" id="climate-btn-month" class="climate-chip px-3 py-1 rounded-full font-semibold bg-white text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">This Month</button>
                    
                    <!-- Specific Date Trigger Button (Opens Modal) -->
                    <button onclick="openModal('modal-specific-date-filter')" id="climate-btn-specific" class="climate-chip px-3 py-1 rounded-full font-semibold bg-white text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap flex items-center space-x-1 shadow-2xs">
                        <i class="fas fa-calendar-alt text-slate-400 mr-1 text-[10px]"></i>
                        <span id="climate-specific-label">Specific Date</span>
                        <i class="fas fa-arrow-up-right-from-square text-[9px] ml-1 text-slate-400"></i>
                    </button>
                </div>

                <div class="text-[11px] text-slate-400 font-medium">
                    <span id="climate-active-filter-status" class="font-semibold text-slate-600">Showing: Today's Shift</span>
                </div>
            </div>

            <!-- Sentiment Highlight Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-1">
                    <span class="text-[10px] text-slate-400 font-bold uppercase">Average Climate Rating</span>
                    <div class="flex items-baseline space-x-1.5">
                        <span id="sentiment-avg-rating" class="text-lg font-heading font-extrabold text-slate-900">0.0 / 5.0</span>
                        <span id="sentiment-mood-label" class="text-[10px] font-bold text-emerald-600">Neutral</span>
                    </div>
                </div>
                <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-1">
                    <span class="text-[10px] text-slate-400 font-bold uppercase">Peak Friction Rush Window</span>
                    <div class="flex items-baseline space-x-1.5">
                        <span id="sentiment-peak-window" class="text-lg font-heading font-extrabold text-slate-900">15:00 - 16:30</span>
                        <span id="sentiment-peak-label" class="text-[10px] font-bold text-terracotta-dark">Flight Arrivals</span>
                    </div>
                </div>
                <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-1">
                    <span class="text-[10px] text-slate-400 font-bold uppercase">Active Floor Dispatches</span>
                    <div class="flex items-baseline space-x-1.5">
                        <span id="sentiment-dispatch-count" class="text-lg font-heading font-extrabold text-slate-900">Normal Operations</span>
                        <span id="sentiment-dispatch-status" class="text-[10px] font-bold text-primary">On Duty</span>
                    </div>
                </div>
            </div>

            <div class="h-64 w-full pt-2">
                <canvas id="chart-hourly-sentiment"></canvas>
            </div>
        </div>
    </div>

</div>
