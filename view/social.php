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
                <span class="text-xl font-heading font-extrabold text-slate-900">42</span>
                <span class="text-[10px] font-bold text-gold-dark">Peer &amp; Supervisor</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-primary space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">XP Points Awarded</span>
            <div class="flex items-baseline space-x-2">
                <span class="text-xl font-heading font-extrabold text-slate-900">3,450</span>
                <span class="text-[10px] font-bold text-primary">Deterministic Ledger</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-sage space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Milestone Badges</span>
            <div class="flex items-baseline space-x-2">
                <span class="text-xl font-heading font-extrabold text-slate-900">4</span>
                <span class="text-[10px] font-bold text-emerald-600">Threshold Unlocked</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-dusty space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Perf Review Input</span>
            <div class="flex items-baseline space-x-2">
                <span class="text-xl font-heading font-extrabold text-slate-900">100%</span>
                <span class="text-[10px] font-bold text-dusty-dark">Synced to Q3 Cycle</span>
            </div>
        </div>
    </div>

    <!-- Navigation & Department Filter Bar -->
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

        <!-- Action Button -->
        <div class="flex items-center space-x-2">
            <button onclick="openModal('modal-recognition')" class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 shadow-sm">
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
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Oxford Hospitality Team Recognition Wall</h4>
                <p class="text-slate-500 text-xs">Peer-to-peer and supervisor commendations celebrating 5-star service and teamwork</p>
            </div>

            <!-- Filter Chips -->
            <div class="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar">
                <button onclick="setSocialDeptFilter('all')" data-dept="all" class="social-dept-chip px-3 py-1 rounded-full font-bold bg-primary text-white text-[11px] whitespace-nowrap">All Feed</button>
                <button onclick="setSocialDeptFilter('front office')" data-dept="front office" class="social-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Front Office</button>
                <button onclick="setSocialDeptFilter('culinary')" data-dept="culinary" class="social-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Culinary</button>
                <button onclick="setSocialDeptFilter('f&b service')" data-dept="f&b service" class="social-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">F&amp;B Service</button>
            </div>
        </div>

        <!-- Dynamic Feed List Container -->
        <div id="social-feed-container" class="space-y-4">
            <!-- Rendered by js/kudos.js -->
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 2: DETERMINISTIC POINT & XP LEDGER             -->
    <!-- ======================================================== -->
    <div id="sub-social-ledger" class="sub-panel sub-panel-social space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Deterministic Points Ledger &amp; Rule Audits</h4>
                <p class="text-slate-500 text-xs">Transparent point allocations calculated via strict business rules: Peer (+50 XP), Supervisor (+100 XP), GM (+200 XP)</p>
            </div>
            <span class="badge-sage"><i class="fas fa-lock mr-1"></i> Rule Enforced (Non-AI)</span>
        </div>

        <div class="card-clean overflow-hidden border border-[#E8DEDC]">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                    <tr>
                        <th class="px-5 py-3">Transaction ID</th>
                        <th class="px-5 py-3">Date</th>
                        <th class="px-5 py-3">Recipient Associate</th>
                        <th class="px-5 py-3">Recognized By</th>
                        <th class="px-5 py-3">Category</th>
                        <th class="px-5 py-3">Points Granted</th>
                        <th class="px-5 py-3">New Balance</th>
                    </tr>
                </thead>
                <tbody id="points-ledger-tbody" class="divide-y divide-[#E8DEDC]">
                    <!-- Rendered by js/kudos.js -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 3: MILESTONE BADGES (THRESHOLD UNLOCKED)       -->
    <!-- ======================================================== -->
    <div id="sub-social-badges" class="sub-panel sub-panel-social space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Hospitality Milestone &amp; Ambassador Badges</h4>
                <p class="text-slate-500 text-xs">Deterministic badge unlocks awarded when verified qualitative recognition thresholds are met</p>
            </div>
            <span class="badge-gold"><i class="fas fa-crown mr-1"></i> Oxford Honors</span>
        </div>

        <div id="milestone-badges-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Rendered by js/kudos.js -->
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 4: 24H HOURLY SHIFT SENTIMENT                  -->
    <!-- ======================================================== -->
    <div id="sub-social-climate" class="sub-panel sub-panel-social space-y-4 text-xs">
        <div class="card-clean p-6 space-y-4 bg-white border border-[#E8DEDC]">
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900">Shift Sentiment Dynamics by Hour (Rush Analysis)</h3>
                    <p class="text-xs text-slate-500">Realtime monitoring of shift stress peaks to dispatch floor support</p>
                </div>
                <span class="badge-sage">Live Feed</span>
            </div>
            <div class="h-60 w-full">
                <canvas id="chart-hourly-sentiment"></canvas>
            </div>
        </div>
    </div>

</div>

<!-- ======================================================== -->
<!-- PILLAR 7: NOTIFICATIONS & SYSTEM ACTIVITY HUB             -->
