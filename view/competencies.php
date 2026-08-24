<!-- ======================================================== -->
<!-- PILLAR 2: COMPETENCY MANAGEMENT MODULE (MULTI-EMPLOYEE)  -->
<!-- ======================================================== -->
<div id="panel-pillar-comp" class="pillar-panel space-y-6">

    <!-- Top Subnav Pills (Consolidated 3 Clean Functional Tabs) -->
    <div class="subnav-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar">
        <button onclick="switchSubTab('comp', 'profiles')" class="subnav-pill subnav-comp active" data-sub="profiles">
            <i class="fas fa-id-card-clip mr-1.5"></i> Role Profiles &amp; Matrix
        </button>
        <button onclick="switchSubTab('comp', 'assessment')" class="subnav-pill subnav-comp" data-sub="assessment">
            <i class="fas fa-chart-radar mr-1.5"></i> 360° Assessment &amp; Skills Gap
        </button>
        <button onclick="switchSubTab('comp', 'development')" class="subnav-pill subnav-comp" data-sub="development">
            <i class="fas fa-route mr-1.5"></i> IDP, Certifications &amp; Appraisal
        </button>
    </div>

    <!-- Manager Control & Multi-Employee View Mode Bar -->
    <div class="p-4 bg-white rounded-2xl border border-[#E8DEDC] flex items-center justify-between flex-wrap gap-3 shadow-2xs">
        
        <!-- Left: Active Focus / Team Mode Indicator -->
        <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-primary-50 text-primary border border-primary-100 flex items-center justify-center font-bold text-sm shadow-2xs">
                <i class="fas fa-users-gear"></i>
            </div>
            <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Supervisory &amp; Competency Focus</span>
                <div class="flex items-center space-x-2">
                    <h3 id="comp-radar-emp-name" class="font-heading font-bold text-base text-slate-900">Maria Santos</h3>
                    <span id="comp-radar-status-badge" class="badge-sage">Benchmark Met</span>
                </div>
            </div>
        </div>

        <!-- Middle: 3 View Mode Toggle Buttons (Single Focus vs Team Roster vs Multi-Compare) -->
        <div class="inline-flex p-1 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs">
            <button onclick="setCompetencyViewMode('single')" class="btn-comp-viewmode px-3 py-1.5 rounded-lg transition text-xs font-semibold bg-primary text-white font-bold" data-mode="single">
                <i class="fas fa-user mr-1"></i> Single Focus
            </button>
            <button onclick="setCompetencyViewMode('team_deck')" class="btn-comp-viewmode px-3 py-1.5 rounded-lg transition text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50" data-mode="team_deck">
                <i class="fas fa-table-cells-large mr-1"></i> Team Roster Grid
            </button>
            <button onclick="setCompetencyViewMode('compare')" class="btn-comp-viewmode px-3 py-1.5 rounded-lg transition text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50" data-mode="compare">
                <i class="fas fa-code-compare mr-1"></i> Compare Staff (Side-by-Side)
            </button>
        </div>

        <!-- Right: Associate Selector & Batch Actions -->
        <div class="flex items-center space-x-2">
            <select id="comp-emp-select" onchange="selectCompetencyAssociate(this.value)" class="bg-[#FAF8F7] border border-[#E8DEDC] text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer">
                <!-- Populated dynamically with all associates across departments -->
            </select>
            <button onclick="openBatchEvaluationModal()" class="btn-secondary px-3.5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                <i class="fas fa-list-check text-primary"></i>
                <span class="hidden sm:inline">Batch Rate Team</span>
            </button>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 1: ROLE PROFILES & COMPETENCY MATRIX                -->
    <!-- ======================================================== -->
    <div id="sub-comp-profiles" class="sub-panel sub-panel-comp active space-y-6">
        
        <!-- 1.1 Role Profile Catalog -->
        <div class="card-clean p-6 space-y-6">
            <div class="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-[#E8DEDC]">
                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900">Role Competency Frameworks &amp; Standards</h3>
                    <p class="text-xs text-slate-500">Standardized skills, behavioral rubrics, and target benchmark ratings per department.</p>
                </div>
                <div class="flex items-center space-x-2">
                    <label class="text-xs font-semibold text-slate-600">Select Job Role:</label>
                    <select id="comp-role-profile-select" onchange="switchRoleProfileView(this.value)" class="bg-[#FAF8F7] border border-[#E8DEDC] text-xs font-bold text-slate-800 rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer">
                        <!-- Populated by renderRoleProfileSelector() -->
                    </select>
                </div>
            </div>

            <!-- Role Summary Header -->
            <div class="p-5 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2">
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <h4 id="framework-role-title" class="font-heading font-bold text-base text-slate-900">Front Desk Host / Reception Associate</h4>
                        <p class="text-xs text-slate-500">Department: <strong id="framework-role-dept" class="text-slate-800">Front Office</strong> · Min Required Experience: <strong id="framework-role-exp" class="text-slate-800">2+ Years</strong></p>
                    </div>
                    <span class="badge-primary">Oxford Suites Certified Framework</span>
                </div>
                <p id="framework-role-desc" class="text-xs text-slate-600 leading-relaxed">
                    Delivers exceptional 5-star welcome experiences, operates PMS reservation systems, and maintains composure during high-occupancy check-in peaks.
                </p>
            </div>

            <!-- Dynamic Role Framework -->
            <div id="role-framework-container">
                <!-- Populated dynamically by renderRoleCompetencyFramework() -->
            </div>
        </div>

        <!-- 1.2 Departmental Competency Matrix & Talent Matcher -->
        <div class="card-clean p-6 space-y-5">
            <div class="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900">Departmental Competency Matrix &amp; Talent Matcher</h3>
                    <p class="text-xs text-slate-500">Identify high-potential candidates for promotions and special project taskforces.</p>
                </div>
                <span id="matrix-match-count" class="badge-sage">10 Associates In Registry</span>
            </div>

            <!-- Filters -->
            <div class="p-3.5 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] flex items-center justify-between flex-wrap gap-3 text-xs">
                <div class="flex items-center space-x-3 flex-wrap gap-2">
                    <div class="flex items-center space-x-1.5">
                        <span class="font-semibold text-slate-600">Department:</span>
                        <select id="matrix-filter-dept" onchange="filterMatrixCandidates()" class="bg-white border border-[#E8DEDC] font-semibold text-slate-800 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-xs">
                            <option value="all">All Departments (10 Associates)</option>
                            <option value="front_office">Front Office (4 Associates)</option>
                            <option value="fb_service">Food &amp; Beverage (2 Associates)</option>
                            <option value="culinary">Kitchen &amp; Culinary (2 Associates)</option>
                            <option value="housekeeping">Housekeeping (2 Associates)</option>
                        </select>
                    </div>
                    <div class="flex items-center space-x-1.5">
                        <span class="font-semibold text-slate-600">Min Overall Rating:</span>
                        <select id="matrix-filter-min" onchange="filterMatrixCandidates()" class="bg-white border border-[#E8DEDC] font-semibold text-slate-800 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-xs">
                            <option value="0">Show All Scores</option>
                            <option value="4.0">&ge; 4.0 (Advanced Standard)</option>
                            <option value="4.5">&ge; 4.5 (Master VIP Standard)</option>
                        </select>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <button onclick="exportCompetencyReportCSV()" class="btn-secondary px-3 py-1.5 text-xs font-bold flex items-center space-x-1">
                        <i class="fas fa-download text-primary text-xs"></i>
                        <span>Export Matrix CSV</span>
                    </button>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto custom-scrollbar border border-[#E8DEDC] rounded-2xl">
                <table class="w-full text-left text-xs">
                    <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                        <tr>
                            <th class="px-4 py-3">Associate</th>
                            <th class="px-4 py-3 text-center">VIP Protocol</th>
                            <th class="px-4 py-3 text-center">Technical System</th>
                            <th class="px-4 py-3 text-center">Compliance / Safety</th>
                            <th class="px-4 py-3 text-center">Commercial / Upsell</th>
                            <th class="px-4 py-3 text-center">Overall</th>
                            <th class="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="comp-matrix-tbody" class="divide-y divide-[#E8DEDC]">
                        <!-- Populated dynamically by renderCompetencyMatrixTable() -->
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <!-- ======================================================== -->
    <!-- TAB 2: 360° ASSESSMENT & SKILLS GAP DIAGNOSTICS          -->
    <!-- ======================================================== -->
    <div id="sub-comp-assessment" class="sub-panel sub-panel-comp space-y-6">
        
        <!-- MODE A: SINGLE EMPLOYEE DEEP-DIVE VIEW -->
        <div id="comp-single-employee-view" class="space-y-6">
            <!-- 2.1 Radar Benchmark & Multi-Rater Visualizer -->
            <div class="card-clean p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <!-- Left: Radar Chart Box (6 cols) -->
                <div class="lg:col-span-6 bg-[#FAF8F7] p-5 rounded-2xl border border-[#E8DEDC] flex flex-col items-center justify-between">
                    <div class="w-full flex justify-between items-center text-xs font-bold mb-2">
                        <span class="text-slate-900">Multi-Rater Competency Radar</span>
                        <span class="text-[11px] text-slate-500 font-medium">Target vs Self vs Calibrated</span>
                    </div>
                    <div class="h-64 sm:h-72 w-full flex items-center justify-center relative">
                        <canvas id="chart-competency-radar"></canvas>
                    </div>
                    <div class="w-full pt-3 border-t border-[#E8DEDC] flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span class="flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-gold mr-1.5"></span> Benchmark</span>
                        <span class="flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-dusty mr-1.5"></span> Self</span>
                        <span class="flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-sage mr-1.5"></span> Supervisor</span>
                        <span class="flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-primary mr-1.5"></span> Calibrated</span>
                    </div>
                </div>

                <!-- Right: 5 Dimensions Breakdown (6 cols) -->
                <div class="lg:col-span-6 space-y-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h4 class="font-heading font-bold text-sm text-slate-900">Evaluated Dimension Scores</h4>
                            <p id="comp-radar-emp-role" class="text-xs text-slate-500">Front Desk Host · Front Office</p>
                        </div>
                        <div class="text-right">
                            <span class="text-[11px] text-slate-400 font-medium block">Overall Proficiency</span>
                            <span id="comp-radar-overall-score" class="font-heading font-bold text-lg text-primary">4.28 / 5.0</span>
                        </div>
                    </div>

                    <div id="comp-radar-bars-container" class="space-y-3.5 pt-1">
                        <!-- Populated dynamically by renderSelectedEmployeeRadarView() -->
                    </div>

                    <div class="p-3.5 bg-primary-50/50 rounded-2xl border border-primary-100 flex items-center justify-between text-xs">
                        <span class="text-slate-700">Need to record a new calibration?</span>
                        <button onclick="launchAssessmentModalFor(activeCompetencyEmpKey)" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1">
                            <i class="fas fa-clipboard-check"></i>
                            <span>+ Conduct Assessment</span>
                        </button>
                    </div>
                </div>

            </div>

            <!-- 2.2 360° Rater Scorecard & Historical Log -->
            <div class="card-clean p-6 space-y-5">
                <div class="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#E8DEDC]">
                    <div>
                        <h3 class="font-heading font-bold text-base text-slate-900">Multi-Rater Scorecard &amp; Assessment History</h3>
                        <p class="text-xs text-slate-500">Triangulate Self-Assessments, Supervisor Observations, and HR Calibrations.</p>
                    </div>
                </div>

                <!-- Calibration Status Card -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-1">
                        <span class="text-[11px] font-bold text-slate-400 uppercase">Self-Evaluation</span>
                        <h4 class="font-heading font-bold text-lg text-slate-900">4.24 / 5.0</h4>
                        <p class="text-xs text-slate-500">Submitted by Associate on Aug 12</p>
                    </div>
                    <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-1">
                        <span class="text-[11px] font-bold text-slate-400 uppercase">Supervisor Review</span>
                        <h4 class="font-heading font-bold text-lg text-slate-900">4.30 / 5.0</h4>
                        <p class="text-xs text-slate-500">Endorsed by Chef Marco on Aug 14</p>
                    </div>
                    <div class="p-4 bg-primary-50/60 rounded-2xl border border-primary-100 space-y-1">
                        <span class="text-[11px] font-bold text-primary uppercase">HR Final Calibrated</span>
                        <h4 class="font-heading font-bold text-lg text-primary">4.28 / 5.0</h4>
                        <p class="text-xs text-slate-600">Locked &amp; Verified by Elena Vance</p>
                    </div>
                </div>

                <!-- Historical Assessment Log Table -->
                <div class="space-y-3">
                    <h4 class="font-heading font-bold text-sm text-slate-900">Historical Assessment Logs &amp; Audit Trail</h4>
                    <div class="overflow-x-auto custom-scrollbar border border-[#E8DEDC] rounded-2xl">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                                <tr>
                                    <th class="px-4 py-3">Evaluation Date</th>
                                    <th class="px-4 py-3">Assessment Type</th>
                                    <th class="px-4 py-3">Evaluator / Assessor</th>
                                    <th class="px-4 py-3 text-center">Score</th>
                                    <th class="px-4 py-3">Calibrated Coaching Notes</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-[#E8DEDC]">
                                <tr class="hover:bg-[#FAF8F7] transition">
                                    <td class="px-4 py-3 font-mono text-slate-600">2026-08-15</td>
                                    <td class="px-4 py-3"><span class="badge-primary">Q3 Calibration</span></td>
                                    <td class="px-4 py-3 font-semibold text-slate-800">Elena Vance / Chef Marco</td>
                                    <td class="px-4 py-3 text-center font-bold text-primary">4.28</td>
                                    <td class="px-4 py-3 text-slate-600">Significant strength in PMS systems and VIP greeting. Prioritizing conflict de-escalation training.</td>
                                </tr>
                                <tr class="hover:bg-[#FAF8F7] transition">
                                    <td class="px-4 py-3 font-mono text-slate-600">2026-05-10</td>
                                    <td class="px-4 py-3"><span class="badge-sage">Q2 Periodic</span></td>
                                    <td class="px-4 py-3 font-semibold text-slate-800">John Marco</td>
                                    <td class="px-4 py-3 text-center font-bold text-slate-900">4.12</td>
                                    <td class="px-4 py-3 text-slate-600">Steady progress, recommended for Senior Host track upon IDP completion.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- 2.3 Skills Gap Analysis & TNA Diagnostic -->
            <div class="card-clean p-6 space-y-5">
                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900">Training Needs Analysis (TNA) &amp; Skills Gap Diagnostic</h3>
                    <p class="text-xs text-slate-500">Automated gap calculation identifying training priorities and recommended interventions.</p>
                </div>

                <div id="comp-gaps-container">
                    <!-- Populated dynamically by renderSkillsGapAnalysis() -->
                </div>
            </div>
        </div>

        <!-- MODE B: MULTI-EMPLOYEE TEAM ROSTER GRID (DECK VIEW) -->
        <div id="comp-team-deck-view" class="space-y-6" style="display: none;">
            <div class="card-clean p-6 space-y-5">
                <div class="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#E8DEDC]">
                    <div>
                        <h3 class="font-heading font-bold text-base text-slate-900">Multi-Employee Supervisory Roster</h3>
                        <p class="text-xs text-slate-500">Manage multiple associates simultaneously with at-a-glance competency ratings, strengths, and gaps.</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <select id="team-deck-dept-filter" onchange="renderTeamRosterDeck()" class="bg-[#FAF8F7] border border-[#E8DEDC] text-xs font-semibold rounded-xl px-3 py-1.5">
                            <option value="all">All Departments</option>
                            <option value="front_office">Front Office</option>
                            <option value="fb_service">Food &amp; Beverage</option>
                            <option value="culinary">Kitchen &amp; Culinary</option>
                            <option value="housekeeping">Housekeeping</option>
                        </select>
                        <span id="team-deck-count" class="badge-sage">10 Associates</span>
                    </div>
                </div>

                <!-- Cards Grid -->
                <div id="team-deck-cards-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <!-- Populated dynamically by renderTeamRosterDeck() -->
                </div>
            </div>
        </div>

        <!-- MODE C: MULTI-EMPLOYEE COMPARATIVE VIEW (SIDE-BY-SIDE) -->
        <div id="comp-compare-view" class="space-y-6" style="display: none;">
            <div class="card-clean p-6 space-y-6">
                <div class="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#E8DEDC]">
                    <div>
                        <h3 class="font-heading font-bold text-base text-slate-900">Multi-Employee Side-by-Side Benchmark Comparison</h3>
                        <p class="text-xs text-slate-500">Select up to 4 associates to compare competencies for promotions, succession, or project taskforces.</p>
                    </div>
                </div>

                <!-- Employee Selection Checkboxes -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-800">Select Associates to Compare (Max 4):</label>
                    <div id="compare-employee-checkboxes" class="flex items-center space-x-2 flex-wrap gap-2">
                        <!-- Populated dynamically by renderMultiEmployeeComparison() -->
                    </div>
                </div>

                <!-- Overlaid Comparative Radar Chart -->
                <div class="bg-[#FAF8F7] p-5 rounded-2xl border border-[#E8DEDC] space-y-3">
                    <h4 class="font-heading font-bold text-sm text-slate-900">Overlaid Competency Radar Profiles</h4>
                    <div class="h-72 w-full flex items-center justify-center relative">
                        <canvas id="chart-comparative-radar"></canvas>
                    </div>
                </div>

                <!-- Side-by-Side Comparison Matrix Table -->
                <div class="space-y-2">
                    <h4 class="font-heading font-bold text-sm text-slate-900">Dimension-by-Dimension Scorecard</h4>
                    <div class="overflow-x-auto custom-scrollbar border border-[#E8DEDC] rounded-2xl">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                                <tr>
                                    <th class="px-4 py-3">Competency Dimension</th>
                                    <th class="px-4 py-3 text-center">Maria Santos</th>
                                    <th class="px-4 py-3 text-center">Carlos Gomez</th>
                                    <th class="px-4 py-3 text-center">Lucas Vargas</th>
                                </tr>
                            </thead>
                            <tbody id="compare-table-tbody" class="divide-y divide-[#E8DEDC]">
                                <!-- Populated dynamically by renderMultiEmployeeComparison() -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- ======================================================== -->
    <!-- TAB 3: IDP, CERTIFICATIONS & PERFORMANCE APPRAISAL       -->
    <!-- ======================================================== -->
    <div id="sub-comp-development" class="sub-panel sub-panel-comp space-y-6">
        
        <!-- 3.1 70-20-10 Individual Development Plan -->
        <div class="card-clean p-6 space-y-5">
            <div id="comp-idp-container">
                <!-- Populated dynamically by renderIDPView() -->
            </div>
        </div>

        <!-- 3.2 Certifications & Licensure Registry -->
        <div class="card-clean p-6 space-y-5">
            <div id="comp-certs-container">
                <!-- Populated dynamically by renderCertificationsRoster() -->
            </div>
        </div>

        <!-- 3.3 Performance & Appraisal Matrix Integration -->
        <div id="comp-perf-integration-container">
            <!-- Populated dynamically by renderPerformanceIntegrationSummary() -->
        </div>

        <!-- 3.4 Property Competency Analytics & Reports -->
        <div class="card-clean p-6 space-y-6">
            <div>
                <h3 class="font-heading font-bold text-base text-slate-900">Oxford Suites Competency Intelligence &amp; Analytics</h3>
                <p class="text-xs text-slate-500">Property-wide skills health index, audit compliance metrics, and training ROI insights.</p>
            </div>
            <div id="comp-analytics-container">
                <!-- Populated dynamically by renderCompetencyAnalyticsDashboard() -->
            </div>
        </div>

    </div>

</div>
