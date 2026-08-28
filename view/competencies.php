<!-- ======================================================== -->
<!-- PILLAR 2: COMPETENCY MANAGEMENT MODULE (MULTI-EMPLOYEE)  -->
<!-- ======================================================== -->
<div id="panel-pillar-comp" class="pillar-panel space-y-6">

    <!-- Top Subnav Pills (Consolidated 3 Clean Functional Tabs) -->
    <div class="subnav-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar">
        <button id="subtab-btn-comp-profiles" onclick="switchSubTab('comp', 'profiles')" class="subnav-pill subnav-comp active" data-sub="profiles">
            <i class="fas fa-id-card-clip mr-1.5"></i> Role Profiles &amp; Matrix
        </button>
        <button id="subtab-btn-comp-assessment" onclick="switchSubTab('comp', 'assessment')" class="subnav-pill subnav-comp hidden" data-sub="assessment">
            <i class="fas fa-chart-radar mr-1.5"></i> 360° Assessment &amp; Skills Gap
        </button>
        <button id="subtab-btn-comp-development" onclick="switchSubTab('comp', 'development')" class="subnav-pill subnav-comp hidden" data-sub="development">
            <i class="fas fa-route mr-1.5"></i> IDP, Certifications &amp; Appraisal
        </button>
    </div>


    <!-- ======================================================== -->
    <!-- TAB 1: ROLE PROFILES & COMPETENCY MATRIX                -->
    <!-- ======================================================== -->
    <div id="sub-comp-profiles" class="sub-panel sub-panel-comp active space-y-6">
        
        <!-- 1.2 Departmental Competency Matrix & Talent Matcher -->
        <div class="card-clean p-6 space-y-5">
            <div class="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900">Departmental Competency Matrix &amp; Talent Registry</h3>
                    <p class="text-xs text-slate-500">Live multi-rater competency scores, department benchmarks, and performance diagnostic indicators.</p>
                </div>
                <div class="flex items-center space-x-2">
                    <span id="matrix-match-count" class="badge-sage">Loading Associates...</span>
                </div>
            </div>

            <!-- Filters & Search Toolbar -->
            <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-3">
                <div class="flex items-center justify-between flex-wrap gap-3 text-xs">
                    <!-- Left: Search & Select Filters -->
                    <div class="flex items-center space-x-3 flex-wrap gap-2.5">
                        <!-- Search Box -->
                        <div class="relative min-w-[200px]">
                            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input type="text" id="matrix-search-input" onkeyup="filterMatrixCandidates()" placeholder="Search associate or title..." class="w-full bg-white border border-[#E8DEDC] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-slate-400">
                        </div>

                        <!-- Department Filter -->
                        <div class="flex items-center space-x-1.5">
                            <span class="font-bold text-slate-600">Dept:</span>
                            <select id="matrix-filter-dept" onchange="filterMatrixCandidates()" class="bg-white border border-[#E8DEDC] font-semibold text-slate-800 px-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs shadow-2xs">
                                <option value="all">All Departments</option>
                            </select>
                        </div>

                        <!-- Min Score Filter -->
                        <div class="flex items-center space-x-1.5">
                            <span class="font-bold text-slate-600">Min Rating:</span>
                            <select id="matrix-filter-min" onchange="filterMatrixCandidates()" class="bg-white border border-[#E8DEDC] font-semibold text-slate-800 px-3 py-1.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs shadow-2xs">
                                <option value="0">All Ratings</option>
                                <option value="4.0">&ge; 4.0 (Advanced Standard)</option>
                                <option value="4.5">&ge; 4.5 (Master Benchmark)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Right: Actions -->
                    <div class="flex items-center space-x-2">
                        <button onclick="openAddCompetencyModal()" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                            <i class="fas fa-plus text-[10px]"></i>
                            <span>Add Competency</span>
                        </button>
                        <button onclick="exportCompetencyReportCSV()" class="btn-secondary px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                            <i class="fas fa-download text-primary"></i>
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                <!-- Legend Bar -->
                <div class="pt-2.5 border-t border-[#E8DEDC]/80 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-600">
                    <div class="flex items-center space-x-4 flex-wrap gap-2 font-medium">
                        <span class="text-slate-400 font-bold uppercase text-[10px]">Score Standards:</span>
                        <span class="flex items-center space-x-1.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
                            <span>Benchmark Met (&ge; Target)</span>
                        </span>
                        <span class="flex items-center space-x-1.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100"></span>
                            <span>Approaching Standard (3.8 - 4.4)</span>
                        </span>
                        <span class="flex items-center space-x-1.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100"></span>
                            <span>Skill Gap / Needs TNA (&lt; 3.8)</span>
                        </span>
                        <span class="flex items-center space-x-1.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                            <span>Unassessed</span>
                        </span>
                    </div>
                    <div class="text-[10px] text-slate-500 italic">
                        Click any associate row to open their 360° Assessment &amp; Skills Gap Profile
                    </div>
                </div>
            </div>

            <!-- Dynamic Table from Supabase -->
            <div class="overflow-x-auto custom-scrollbar border border-[#E8DEDC] rounded-2xl bg-white shadow-2xs">
                <table class="w-full text-left text-xs border-collapse">
                    <thead id="comp-matrix-thead" class="bg-[#FAF8F7] text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                        <tr id="comp-matrix-thead-tr">
                            <!-- Populated dynamically by renderCompetencyMatrixTable() -->
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
        
        <!-- Back Navigation & Associate Focus Bar -->
        <div class="flex items-center justify-between flex-wrap gap-3 p-4 bg-white rounded-2xl border border-[#E8DEDC] shadow-2xs">
            <div class="flex items-center space-x-2">
                <span class="text-xs font-semibold text-slate-500">Associate 360° Assessment Focus:</span>
                <span id="comp-assessment-header-name" class="font-heading font-bold text-xs bg-primary-50 text-primary border border-primary-100 px-3 py-1 rounded-xl">Maria Santos</span>
            </div>
        </div>


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
                    <div id="radar-chart-canvas-container" class="h-64 sm:h-72 w-full flex items-center justify-center relative">
                        <div id="radar-skeleton-overlay" class="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF8F7]/90 backdrop-blur-xs z-10 rounded-2xl animate-pulse">
                            <div class="w-16 h-16 rounded-full border-4 border-slate-200 border-t-primary animate-spin mb-2"></div>
                            <span class="text-[11px] font-bold text-slate-600">Calculating Multi-Rater Geometry...</span>
                        </div>
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

                    <div id="comp-conduct-eval-box" class="p-3.5 bg-primary-50/50 rounded-2xl border border-primary-100 flex items-center justify-between text-xs">
                        <span class="text-slate-700">Need to record a new calibration?</span>
                        <button onclick="launchDynamicEvaluationModal(activeCompetencyEmpKey)" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1">
                            <i class="fas fa-clipboard-check"></i>
                            <span>+ Conduct Assessment</span>
                        </button>
                    </div>

                </div>

            </div>

            <!-- 2.2 Training Needs Analysis (TNA) & Skills Gap Diagnostic -->
            <div id="comp-tna-skills-gap-card" class="card-clean p-6 space-y-5">
                <div class="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#E8DEDC]">
                    <div>
                        <h3 class="font-heading font-bold text-base text-slate-900">Training Needs Analysis (TNA) &amp; Skills Gap Diagnostic</h3>
                        <p class="text-xs text-slate-500">Automated gap calculation identifying training priorities and recommended learning interventions.</p>
                    </div>
                </div>

                <div id="comp-gaps-container" class="space-y-4">
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
