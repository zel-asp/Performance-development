<!-- ======================================================== -->
<!-- PILLAR 7: ACTIVITY, OPERATIONAL ALERTS & AUDIT LOGS       -->
<!-- Scope: Realtime Alerts -> Immutable Audit Log -> Gemini AI Risk Scan -> Delivery Preferences -->
<!-- ======================================================== -->
<div id="panel-pillar-notifications" class="pillar-panel space-y-6">

    <!-- Top KPI Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div class="card-clean p-4 border-l-4 border-l-primary space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Unread Alerts</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-alerts-unread" class="text-xl font-heading font-extrabold text-slate-900">4</span>
                <span class="text-[10px] font-bold text-primary">Pending Review</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-rose-500 space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Critical &amp; Risk</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-alerts-critical" class="text-xl font-heading font-extrabold text-rose-700">2</span>
                <span class="text-[10px] font-bold text-rose-600">Immediate Action</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-amber-500 space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Pending Approvals</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-alerts-action" class="text-xl font-heading font-extrabold text-amber-700">2</span>
                <span class="text-[10px] font-bold text-amber-600">Appraisal &amp; Quiz</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-sage space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">24h System Events</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-alerts-logs" class="text-xl font-heading font-extrabold text-slate-900">6 Events</span>
                <span class="text-[10px] font-bold text-emerald-600">Audit Stream</span>
            </div>
        </div>
    </div>

    <!-- Subnav Tabs & Top Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="subnav-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar flex-shrink-0">
            <button onclick="switchSubTab('notifications', 'inbox')" class="subnav-pill subnav-notifications active" data-sub="inbox">
                <i class="fas fa-inbox mr-1.5 text-primary"></i>
                <span>Alerts Inbox</span>
            </button>
            <button onclick="switchSubTab('notifications', 'audit')" class="subnav-pill subnav-notifications" data-sub="audit">
                <i class="fas fa-clock-rotate-left mr-1.5 text-dusty-dark"></i>
                <span>System Audit Log</span>
            </button>
            <button onclick="switchSubTab('notifications', 'gemini')" class="subnav-pill subnav-notifications" data-sub="gemini">
                <i class="fas fa-wand-magic-sparkles mr-1.5 text-terracotta-dark"></i>
                <span>Gemini AI Diagnostics</span>
            </button>
            <button onclick="switchSubTab('notifications', 'settings')" class="subnav-pill subnav-notifications" data-sub="settings">
                <i class="fas fa-sliders mr-1.5 text-slate-600"></i>
                <span>Preferences</span>
            </button>
        </div>

        <div class="flex items-center space-x-2">
            <button onclick="markAllAlertsRead()" class="btn-secondary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1">
                <i class="fas fa-check-double text-emerald-600"></i>
                <span>Mark All Read</span>
            </button>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 1: OPERATIONAL ALERTS INBOX                    -->
    <!-- ======================================================== -->
    <div id="sub-notifications-inbox" class="sub-panel sub-panel-notifications active space-y-4 text-xs">
        
        <!-- Filter Header -->
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Hotel Operational &amp; Compliance Alerts</h4>
                <p class="text-slate-500 text-xs">Real-time alerts requiring supervisor endorsement, statutory compliance renewals, and milestone achievements</p>
            </div>

            <!-- Priority Filter Chips -->
            <div class="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar">
                <button onclick="setAlertsFilter('all')" data-filter="all" class="alerts-filter-chip px-3 py-1 rounded-full font-bold bg-primary text-white text-[11px] whitespace-nowrap">All Alerts</button>
                <button onclick="setAlertsFilter('unread')" data-filter="unread" class="alerts-filter-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Unread Only</button>
                <button onclick="setAlertsFilter('critical')" data-filter="critical" class="alerts-filter-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-rose-700 border border-rose-200 hover:bg-rose-50 text-[11px] whitespace-nowrap">Critical (2)</button>
                <button onclick="setAlertsFilter('action')" data-filter="action" class="alerts-filter-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-amber-700 border border-amber-200 hover:bg-amber-50 text-[11px] whitespace-nowrap">Action Required (2)</button>
                <button onclick="setAlertsFilter('info')" data-filter="info" class="alerts-filter-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Milestones</button>
            </div>
        </div>

        <!-- Dynamic List Container -->
        <div id="alerts-inbox-container" class="space-y-3">
            <!-- Rendered by js/notifications.js -->
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 2: SYSTEM AUDIT LOG LEDGER                     -->
    <!-- ======================================================== -->
    <div id="sub-notifications-audit" class="sub-panel sub-panel-notifications space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Immutable System &amp; Talent Audit Log</h4>
                <p class="text-slate-500 text-xs">Chronological, tamper-proof record of all appraisal approvals, certificate issuances, XP points grants, and HR flags</p>
            </div>

            <!-- Module Filter Select -->
            <div class="flex items-center space-x-2">
                <span class="text-slate-400 font-semibold text-[11px]">Filter Module:</span>
                <select onchange="setAuditModuleFilter(this.value)" class="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                    <option value="all">All System Modules</option>
                    <option value="Performance">Performance Management</option>
                    <option value="Training">Training Management</option>
                    <option value="Succession">Succession Planning</option>
                    <option value="Social">Social Recognition</option>
                    <option value="Gemini">Gemini Copilot</option>
                    <option value="Sentiment">Realtime Sentiment</option>
                </select>
            </div>
        </div>

        <div class="card-clean overflow-hidden border border-[#E8DEDC]">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                    <tr>
                        <th class="px-5 py-3">Event ID</th>
                        <th class="px-5 py-3">Timestamp</th>
                        <th class="px-5 py-3">Module</th>
                        <th class="px-5 py-3">Action Type</th>
                        <th class="px-5 py-3">Initiated By</th>
                        <th class="px-5 py-3">Audit Details</th>
                        <th class="px-5 py-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody id="audit-logs-tbody" class="divide-y divide-[#E8DEDC]">
                    <!-- Rendered by js/notifications.js -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 3: GEMINI AI SHIFT RISK DIAGNOSTICS            -->
    <!-- ======================================================== -->
    <div id="sub-notifications-gemini" class="sub-panel sub-panel-notifications space-y-4 text-xs">
        <div class="card-clean p-5 bg-white border border-[#E8DEDC] space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DEDC] pb-3">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center text-lg">
                        <i class="fas fa-wand-magic-sparkles text-indigo-600"></i>
                    </div>
                    <div>
                        <h4 class="font-heading font-bold text-sm text-slate-900">Gemini 1.5 Realtime Operational Risk Scanner</h4>
                        <p class="text-slate-500 text-xs">AI-driven predictive diagnostic engine synthesizing shift sentiment, table turnaround bottlenecks, and training gaps</p>
                    </div>
                </div>
                <button onclick="triggerGeminiShiftScan()" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                    <i class="fas fa-bolt"></i>
                    <span>Run Realtime AI Scan</span>
                </button>
            </div>

            <!-- AI Insight Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 bg-terracotta-50/40 rounded-2xl border border-terracotta-200/80 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="badge-terracotta text-[10px] font-bold"><i class="fas fa-triangle-exclamation mr-1"></i> Front Office Rush Friction</span>
                        <span class="text-[10px] text-slate-400">Peak Hour: 19:30</span>
                    </div>
                    <h5 class="font-bold text-slate-900 text-xs">Luggage Dispatch &amp; VIP Suite Key Bottleneck</h5>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                        Gemini detected an anomaly in guest sentiment correlated with three simultaneous flight arrivals. Recommendation: Dispatch 1 Concierge Floater to assist with baggage tags and activate the executive lounge check-in protocol.
                    </p>
                </div>

                <div class="p-4 bg-sage-50/50 rounded-2xl border border-emerald-200 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="badge-sage text-[10px] font-bold"><i class="fas fa-shield-check mr-1"></i> Culinary HACCP Proactive Alert</span>
                        <span class="text-[10px] text-slate-400">Audit Status: 100% Pass</span>
                    </div>
                    <h5 class="font-bold text-slate-900 text-xs">Cold-Chain Temperature Logs Fully Normalized</h5>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                        All walk-in chiller probe logs passed automated validation with 0 deviations. Kitchen team safety score is maintained at 100% compliance.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 4: NOTIFICATION PREFERENCES                    -->
    <!-- ======================================================== -->
    <div id="sub-notifications-settings" class="sub-panel sub-panel-notifications space-y-4 text-xs">
        <div class="card-clean p-6 bg-white border border-[#E8DEDC] space-y-5">
            <div>
                <h4 class="font-heading font-bold text-base text-slate-900">Notification &amp; Delivery Rules</h4>
                <p class="text-slate-500 text-xs">Configure how and when operational alerts, appraisals, and shift digests are dispatched</p>
            </div>

            <div class="space-y-3">
                <div class="p-3.5 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] flex items-center justify-between">
                    <div>
                        <span class="font-bold text-slate-900 block">Critical Statutory &amp; Compliance Alerts</span>
                        <span class="text-[11px] text-slate-500">Urgent notifications for expiring certifications (HACCP, Fire Safety)</span>
                    </div>
                    <input type="checkbox" checked class="w-4 h-4 accent-primary rounded cursor-pointer">
                </div>

                <div class="p-3.5 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] flex items-center justify-between">
                    <div>
                        <span class="font-bold text-slate-900 block">Performance Appraisal Milestones</span>
                        <span class="text-[11px] text-slate-500">Alerts when self-reviews, 1-on-1 discussion minutes, and calibrations are submitted</span>
                    </div>
                    <input type="checkbox" checked class="w-4 h-4 accent-primary rounded cursor-pointer">
                </div>

                <div class="p-3.5 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] flex items-center justify-between">
                    <div>
                        <span class="font-bold text-slate-900 block">Gemini Realtime Sentiment Diagnostics</span>
                        <span class="text-[11px] text-slate-500">Automated AI prompts when rush-hour stress spikes exceed threshold (>15%)</span>
                    </div>
                    <input type="checkbox" checked class="w-4 h-4 accent-primary rounded cursor-pointer">
                </div>

                <div class="p-3.5 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] flex items-center justify-between">
                    <div>
                        <span class="font-bold text-slate-900 block">Gamification XP &amp; Peer Kudos Feed</span>
                        <span class="text-[11px] text-slate-500">Instant notification when colleagues recognize you on the public team wall</span>
                    </div>
                    <input type="checkbox" checked class="w-4 h-4 accent-primary rounded cursor-pointer">
                </div>
            </div>

            <div class="pt-2 flex justify-end">
                <button onclick="saveNotificationPreferences()" class="btn-primary px-5 py-2 text-xs font-bold">
                    Save Delivery Preferences
                </button>
            </div>
        </div>
    </div>

</div>

<!-- ======================================================== -->
<!-- PILLAR 8: AUDIT EXPORTS & COMPLIANCE REPORTS              -->
