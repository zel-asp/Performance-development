<!-- ======================================================== -->
<!-- PILLAR 4: TRAINING OPERATIONS MANAGEMENT                  -->
<!-- In-Scope: Program Creation -> Scheduling -> Attendance -> Evaluation -> Reports -->
<!-- ======================================================== -->
<div id="panel-pillar-training" class="pillar-panel space-y-6">

    <!-- Top KPI Status Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div class="card-clean p-4 border-l-4 border-l-primary space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Identified Needs</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-training-needs" class="text-xl font-heading font-extrabold text-slate-900">4</span>
                <span class="text-[10px] font-bold text-terracotta-dark">Gaps &amp; Compliance</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-sage space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Standard Programs</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-training-programs" class="text-xl font-heading font-extrabold text-slate-900">3</span>
                <span class="text-[10px] font-bold text-sage-dark">Active Courses</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-gold space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Sessions</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-training-sessions" class="text-xl font-heading font-extrabold text-slate-900">3</span>
                <span class="text-[10px] font-bold text-gold-dark">Scheduled &amp; Live</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-dusty space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Certified Associates</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-training-certified" class="text-xl font-heading font-extrabold text-slate-900">2</span>
                <span class="text-[10px] font-bold text-emerald-600">Results Recorded</span>
            </div>
        </div>
    </div>

    <!-- Streamlined Modern Sub-Navigation Bar -->
    <div class="border-b border-[#E8DEDC] pb-3">
        <div class="subnav-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar">
            <button onclick="switchSubTab('training', 'needs')" class="subnav-pill subnav-training active" data-sub="needs">
                <i class="fas fa-bullseye mr-1.5 text-terracotta-dark"></i>
                <span>Needs &amp; Gaps</span>
            </button>
            <button onclick="switchSubTab('training', 'programs')" class="subnav-pill subnav-training" data-sub="programs">
                <i class="fas fa-book-bookmark mr-1.5 text-gold-dark"></i>
                <span>Programs Catalog</span>
            </button>
            <button onclick="switchSubTab('training', 'schedules')" class="subnav-pill subnav-training" data-sub="schedules">
                <i class="fas fa-calendar-days mr-1.5 text-dusty-dark"></i>
                <span>Scheduling</span>
            </button>
            <button onclick="switchSubTab('training', 'attendance')" class="subnav-pill subnav-training" data-sub="attendance">
                <i class="fas fa-user-check mr-1.5 text-sage-dark"></i>
                <span>Attendance</span>
            </button>
            <button onclick="switchSubTab('training', 'results')" class="subnav-pill subnav-training" data-sub="results">
                <i class="fas fa-square-poll-vertical mr-1.5 text-primary"></i>
                <span>Evaluation &amp; Results</span>
            </button>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 1: NEEDS & GAPS                                -->
    <!-- ======================================================== -->
    <div id="sub-training-needs" class="sub-panel sub-panel-training active space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Skill Gap Audits &amp; Mandatory Compliance Requirements</h4>
                <p class="text-slate-500 text-xs">Direct triggers identifying which associate requires training and linking to syllabus</p>
            </div>
            <span class="badge-terracotta"><i class="fas fa-bolt mr-1"></i> Live Needs Queue</span>
        </div>

        <!-- Needs Filter Pill Bar -->
        <div class="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-[#E8DEDC]">
            <div class="flex items-center space-x-1.5 overflow-x-auto">
                <button onclick="setNeedsFilter('active')" id="btn-needs-filter-active" class="px-3 py-1 rounded-lg text-xs font-bold bg-primary text-white transition shadow-sm">
                    <i class="fas fa-bolt mr-1 text-amber-300"></i> Active Deficits
                </button>
                <button onclick="setNeedsFilter('resolved')" id="btn-needs-filter-resolved" class="px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition">
                    <i class="fas fa-check-circle mr-1 text-emerald-600"></i> Resolved History
                </button>
                <button onclick="setNeedsFilter('all')" id="btn-needs-filter-all" class="px-3 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition">
                    All Audit Triggers
                </button>
            </div>
            <span id="needs-filter-count-badge" class="text-[11px] font-semibold text-slate-500 pr-2">Showing Active Deficits</span>
        </div>

        <!-- Live Needs Queue List -->
        <div id="training-needs-list" class="space-y-3">
            <!-- Rendered by js/training.js -->
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 2: 1. PROGRAM CREATION & CATALOG               -->
    <!-- ======================================================== -->
    <div id="sub-training-programs" class="sub-panel sub-panel-training space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Training Programs Catalog (Linked to Skill Gap or Mandatory Compliance)</h4>
                <p class="text-slate-500 text-xs">Structured syllabi, passing thresholds, target competencies, and certified trainer requirements</p>
            </div>
            <button onclick="openCreateProgramModal()" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1">
                <i class="fas fa-plus"></i>
                <span>+ Create Program</span>
            </button>
        </div>

        <div id="training-programs-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Rendered by js/training.js -->
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 3: 2. SCHEDULING                               -->
    <!-- ======================================================== -->
    <div id="sub-training-schedules" class="sub-panel sub-panel-training space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Session Scheduling (Date, Time, Location, Trainer, Participant List)</h4>
                <p class="text-slate-500 text-xs">Roster registrations, venue assignments, dates, and session status tracking</p>
            </div>
            <button onclick="openScheduleModal()" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1">
                <i class="fas fa-calendar-plus"></i>
                <span>+ Schedule Session</span>
            </button>
        </div>

        <div id="training-sessions-list" class="space-y-4">
            <!-- Rendered by js/training.js -->
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 4: 3. ATTENDANCE TRACKING                      -->
    <!-- ======================================================== -->
    <div id="sub-training-attendance" class="sub-panel sub-panel-training space-y-4 text-xs">
        
        <div class="card-clean p-5 bg-white border border-[#E8DEDC] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="space-y-1">
                <span class="badge-sage"><i class="fas fa-user-check mr-1"></i> Attendance Tracking (Attended / Absent / Completed)</span>
                <h3 id="attendance-session-header-title" class="font-heading font-bold text-base text-slate-900 mt-1">Hospitality Crisis Diplomacy - Cohort A</h3>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-xs pt-0.5">
                    <span id="attendance-session-header-trainer" class="font-semibold text-slate-800">Trainer: Elena Vance &amp; FOM John Marco</span>
                    <span id="attendance-session-header-venue"><i class="fas fa-location-dot mr-1 text-slate-400"></i> Executive Boardroom</span>
                    <span id="attendance-session-header-date"><i class="fas fa-clock mr-1 text-slate-400"></i> Aug 26, 2026 · 14:00 - 17:30</span>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <select id="attendance-session-select" onchange="changeAttendanceSession(this.value)" 
                    class="bg-[#FAF8F7] border border-[#E8DEDC] text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none">
                </select>

                <button onclick="markAllSessionPresent()" class="btn-secondary px-3 py-2 text-xs font-bold flex items-center space-x-1.5">
                    <i class="fas fa-check-double text-sage-dark"></i>
                    <span>Mark All Attended</span>
                </button>
            </div>
        </div>

        <div class="card-clean overflow-hidden border border-[#E8DEDC]">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                    <tr>
                        <th class="px-5 py-3">Associate Participant</th>
                        <th class="px-5 py-3">Check-in Time</th>
                        <th class="px-5 py-3">Attendance Status</th>
                        <th class="px-5 py-3">Status Toggle</th>
                        <th class="px-5 py-3 text-right">Post-Training Action</th>
                    </tr>
                </thead>
                <tbody id="attendance-roster-tbody" class="divide-y divide-[#E8DEDC]">
                    <!-- Rendered by js/training.js -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 5: 4. POST-TRAINING EVALUATION & RESULTS       -->
    <!-- ======================================================== -->
    <div id="sub-training-results" class="sub-panel sub-panel-training space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Post-Training Evaluation Results &amp; Certificate References</h4>
                <p class="text-slate-500 text-xs">Audit log of recorded scores, evaluation statuses, and official certificate reference codes</p>
            </div>
            <span class="badge-primary"><i class="fas fa-award mr-1"></i> Recorded Results</span>
        </div>

        <div class="card-clean overflow-hidden border border-[#E8DEDC]">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                    <tr>
                        <th class="px-5 py-3">Associate</th>
                        <th class="px-5 py-3">Training Program</th>
                        <th class="px-5 py-3">Completion Date</th>
                        <th class="px-5 py-3">Recorded Score</th>
                        <th class="px-5 py-3">Status</th>
                        <th class="px-5 py-3">Certificate Reference</th>
                        <th class="px-5 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody id="training-results-tbody" class="divide-y divide-[#E8DEDC]">
                    <!-- Rendered by js/training.js -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 6: 5. BASIC TRAINING REPORT (IN-SCOPE)         -->
    <!-- ======================================================== -->
    <div id="sub-training-reports" class="sub-panel sub-panel-training space-y-5 text-xs">
        
        <!-- Header & Filter Bar -->
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Basic Training Report (Attendance &amp; Completion)</h4>
                <p class="text-slate-500 text-xs">Aggregate performance, attendance rate, and completion metrics broken down by department and program</p>
            </div>

            <!-- Department Filter Chips -->
            <div class="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar">
                <button onclick="setReportDeptFilter('all')" data-dept="all" class="report-dept-chip px-3 py-1 rounded-full font-bold bg-primary text-white text-[11px] whitespace-nowrap">All Depts</button>
                <button onclick="setReportDeptFilter('front office')" data-dept="front office" class="report-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Front Office</button>
                <button onclick="setReportDeptFilter('culinary')" data-dept="culinary" class="report-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Culinary</button>
                <button onclick="setReportDeptFilter('f&b service')" data-dept="f&b service" class="report-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">F&amp;B Service</button>
            </div>
        </div>

        <!-- 1. Department Summary Rate Cards -->
        <div class="space-y-2">
            <h5 class="font-bold text-xs text-slate-800 uppercase tracking-wider">Department Attendance &amp; Completion Overview</h5>
            <div id="report-dept-summary" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <!-- Rendered by js/training.js -->
            </div>
        </div>

        <!-- 2. Program Breakdown Table -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <h5 class="font-bold text-xs text-slate-800 uppercase tracking-wider">Attendance &amp; Completion Breakdown by Training Program</h5>
                <button onclick="showToast('Exporting Training Report (PDF/Excel)...', 'info')" class="btn-secondary px-3 py-1 text-[11px] font-bold flex items-center space-x-1">
                    <i class="fas fa-file-arrow-down"></i>
                    <span>Export Report</span>
                </button>
            </div>

            <div class="card-clean overflow-hidden border border-[#E8DEDC]">
                <table class="w-full text-left text-xs">
                    <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                        <tr>
                            <th class="px-5 py-3">Training Program</th>
                            <th class="px-5 py-3">Department</th>
                            <th class="px-5 py-3">Total Enrolled</th>
                            <th class="px-5 py-3">Attendance Rate</th>
                            <th class="px-5 py-3">Completion Rate</th>
                            <th class="px-5 py-3">Avg Score</th>
                            <th class="px-5 py-3 text-right">Audit Status</th>
                        </tr>
                    </thead>
                    <tbody id="report-program-tbody" class="divide-y divide-[#E8DEDC]">
                        <!-- Rendered by js/training.js -->
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 7: LICENSES & CERTS REGISTRY                   -->
    <!-- ======================================================== -->
    <div id="sub-training-certs" class="sub-panel sub-panel-training space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Hotel Staff Licenses &amp; Statutory Certifications</h4>
                <p class="text-slate-500 text-xs">Verified compliance records with TESDA, Department of Tourism, and Oxford Hospitality standards</p>
            </div>
            <button onclick="showToast('Exporting Certification Compliance Report (PDF)...', 'info')" class="btn-secondary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1">
                <i class="fas fa-file-arrow-down"></i>
                <span>Export Audit Registry</span>
            </button>
        </div>

        <div class="card-clean overflow-hidden border border-[#E8DEDC]">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                    <tr>
                        <th class="px-5 py-3">Certification &amp; Associate</th>
                        <th class="px-5 py-3">Issuing Authority</th>
                        <th class="px-5 py-3">Certificate Reference</th>
                        <th class="px-5 py-3">Status</th>
                        <th class="px-5 py-3 text-right">Digital Document</th>
                    </tr>
                </thead>
                <tbody id="certs-table-body" class="divide-y divide-[#E8DEDC]">
                    <!-- Rendered by js/training.js -->
                </tbody>
            </table>
        </div>
    </div>

</div>

<!-- ======================================================== -->
<!-- PILLAR 5: SUCCESSION PLANNING & 9-BOX TALENT GRID        -->
