<!-- ======================================================== -->
<!-- PILLAR 8: HOSPITALITY AUDIT EXPORTS & COMPLIANCE REPORTS  -->
<!-- Scope: Executive Audit Packs -> Statutory Register -> Dept Calibration -> Custom CSV Exporter -->
<!-- ======================================================== -->
<div id="panel-pillar-reports" class="pillar-panel space-y-6">

    <!-- Top KPI Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div class="card-clean p-4 border-l-4 border-l-primary space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Audited Associates</span>
            <div class="flex items-baseline space-x-2">
                <span class="text-xl font-heading font-extrabold text-slate-900">100</span>
                <span class="text-[10px] font-bold text-primary">100% Q3 Complete</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-sage space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Statutory Compliance</span>
            <div class="flex items-baseline space-x-2">
                <span class="text-xl font-heading font-extrabold text-emerald-700">100%</span>
                <span class="text-[10px] font-bold text-emerald-600">HACCP &amp; Hygiene</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-gold space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Certifications</span>
            <div class="flex items-baseline space-x-2">
                <span class="text-xl font-heading font-extrabold text-slate-900">42</span>
                <span class="text-[10px] font-bold text-gold-dark">Verified Licenses</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-dusty space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Bench Coverage</span>
            <div class="flex items-baseline space-x-2">
                <span class="text-xl font-heading font-extrabold text-slate-900">94%</span>
                <span class="text-[10px] font-bold text-dusty-dark">Succession Depth</span>
            </div>
        </div>
    </div>

    <!-- Subnav Tabs & Export Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="subnav-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar flex-shrink-0">
            <button onclick="switchSubTab('reports', 'packs')" class="subnav-pill subnav-reports active" data-sub="packs">
                <i class="fas fa-boxes-packing mr-1.5 text-primary"></i>
                <span>Executive Audit Packs</span>
            </button>
            <button onclick="switchSubTab('reports', 'statutory')" class="subnav-pill subnav-reports" data-sub="statutory">
                <i class="fas fa-certificate mr-1.5 text-sage-dark"></i>
                <span>Statutory &amp; HACCP Register</span>
            </button>
            <button onclick="switchSubTab('reports', 'dept')" class="subnav-pill subnav-reports" data-sub="dept">
                <i class="fas fa-building-user mr-1.5 text-dusty-dark"></i>
                <span>Dept Calibration Breakdown</span>
            </button>
            <button onclick="switchSubTab('reports', 'custom')" class="subnav-pill subnav-reports" data-sub="custom">
                <i class="fas fa-file-excel mr-1.5 text-emerald-600"></i>
                <span>Custom CSV &amp; PDF Builder</span>
            </button>
        </div>

        <!-- Fast All-in-One Export Button -->
        <div class="flex items-center space-x-2">
            <button onclick="downloadCSVReport('rep-perf-q3')" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5 flex-shrink-0 shadow-sm">
                <i class="fas fa-file-arrow-down"></i>
                <span>Export Q3 Master CSV</span>
            </button>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 1: PRE-PACKAGED EXECUTIVE AUDIT PACKS          -->
    <!-- ======================================================== -->
    <div id="sub-reports-packs" class="sub-panel sub-panel-reports active space-y-4 text-xs">
        
        <!-- Filter Header -->
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Pre-Compiled Executive Audit Reports</h4>
                <p class="text-slate-500 text-xs">Official documentation for General Manager review, Board reporting, and statutory regulatory inspections</p>
            </div>

            <!-- Filter Chips -->
            <div class="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar">
                <button onclick="setReportsCatalogFilter('all')" data-cat="all" class="reports-cat-chip px-3 py-1 rounded-full font-bold bg-primary text-white text-[11px] whitespace-nowrap">All Audits</button>
                <button onclick="setReportsCatalogFilter('performance')" data-cat="performance" class="reports-cat-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Performance</button>
                <button onclick="setReportsCatalogFilter('compliance')" data-cat="compliance" class="reports-cat-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">HACCP Statutory</button>
                <button onclick="setReportsCatalogFilter('training')" data-cat="training" class="reports-cat-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Training</button>
                <button onclick="setReportsCatalogFilter('succession')" data-cat="succession" class="reports-cat-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Succession</button>
            </div>
        </div>

        <!-- Reports Grid -->
        <div id="reports-catalog-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Rendered by js/reports.js -->
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 2: STATUTORY & HACCP REGISTER                  -->
    <!-- ======================================================== -->
    <div id="sub-reports-statutory" class="sub-panel sub-panel-reports space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Statutory Compliance &amp; Mandatory Licenses Registry</h4>
                <p class="text-slate-500 text-xs">Certified staff credentials required by Sanitation, DOLE, Bureau of Fire Protection, and Brand Standard audits</p>
            </div>
            <button onclick="downloadCSVReport('rep-haccp-statutory')" class="btn-secondary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                <i class="fas fa-file-csv text-emerald-600"></i>
                <span>Download Statutory Register (CSV)</span>
            </button>
        </div>

        <div class="card-clean overflow-hidden border border-[#E8DEDC]">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                    <tr>
                        <th class="px-5 py-3">License ID</th>
                        <th class="px-5 py-3">Associate Holder</th>
                        <th class="px-5 py-3">License / Certification Type</th>
                        <th class="px-5 py-3">Cert Reference</th>
                        <th class="px-5 py-3">Issue Date</th>
                        <th class="px-5 py-3">Expiry Date</th>
                        <th class="px-5 py-3">Audit Status</th>
                        <th class="px-5 py-3 text-right">Verification</th>
                    </tr>
                </thead>
                <tbody id="statutory-register-tbody" class="divide-y divide-[#E8DEDC]">
                    <!-- Rendered by js/reports.js -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 3: DEPARTMENT CALIBRATION BREAKDOWN            -->
    <!-- ======================================================== -->
    <div id="sub-reports-dept" class="sub-panel sub-panel-reports space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Department Performance &amp; Calibration Summary Table</h4>
                <p class="text-slate-500 text-xs">Comparative operational appraisal analytics across Front Office, Culinary, F&amp;B, Housekeeping, and Banquets</p>
            </div>
            <span class="badge-primary font-bold">100 Active Staff Scope</span>
        </div>

        <div class="card-clean overflow-hidden border border-[#E8DEDC]">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                    <tr>
                        <th class="px-5 py-3.5">Department</th>
                        <th class="px-5 py-3.5">Staff Headcount</th>
                        <th class="px-5 py-3.5">Appraisal Completion</th>
                        <th class="px-5 py-3.5">Average Score</th>
                        <th class="px-5 py-3.5">Tier 1 / 2 / 3 Breakdown</th>
                        <th class="px-5 py-3.5">Compliance Rate</th>
                        <th class="px-5 py-3.5 text-right">Export</th>
                    </tr>
                </thead>
                <tbody id="dept-audit-tbody" class="divide-y divide-[#E8DEDC]">
                    <!-- Rendered by js/reports.js -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 4: CUSTOM AUDIT & CSV BUILDER                  -->
    <!-- ======================================================== -->
    <div id="sub-reports-custom" class="sub-panel sub-panel-reports space-y-4 text-xs">
        <div class="card-clean p-6 bg-white border border-[#E8DEDC] space-y-5">
            <div>
                <h4 class="font-heading font-bold text-base text-slate-900">Custom Audit &amp; Data Export Builder</h4>
                <p class="text-slate-500 text-xs">Configure custom report parameters, filter specific hotel operational metrics, and generate real-time downloadable CSV or executive PDF packs</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">Select Department Scope</label>
                    <select id="custom-report-dept" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                        <option value="all">Hotel-Wide (All 5 Departments)</option>
                        <option value="front_office">Front Office</option>
                        <option value="culinary">Kitchen &amp; Culinary</option>
                        <option value="fb_service">Food &amp; Beverage</option>
                        <option value="housekeeping">Housekeeping</option>
                        <option value="banquet">Banquet &amp; Events</option>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">Reporting Period</label>
                    <select id="custom-report-period" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                        <option value="Q3 2026">Q3 2026 (Current Cycle)</option>
                        <option value="Q2 2026">Q2 2026 (Past Cycle)</option>
                        <option value="YTD 2026">Year-to-Date (2026)</option>
                        <option value="Annual 2025">Full Year 2025</option>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">Export File Format</label>
                    <select id="custom-report-format" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                        <option value="csv">Downloadable CSV Spreadsheet (.csv)</option>
                        <option value="pdf">Official Printable Executive PDF</option>
                    </select>
                </div>
            </div>

            <!-- Metric Toggles -->
            <div class="space-y-2 pt-2 border-t border-[#E8DEDC]">
                <span class="block font-bold text-slate-800 text-[11px]">Included Data Dimensions</span>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <label class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-[#FAF8F7] cursor-pointer">
                        <input type="checkbox" checked class="accent-primary w-3.5 h-3.5">
                        <span class="text-slate-800 font-semibold text-[11px]">Performance Ratings</span>
                    </label>
                    <label class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-[#FAF8F7] cursor-pointer">
                        <input type="checkbox" checked class="accent-primary w-3.5 h-3.5">
                        <span class="text-slate-800 font-semibold text-[11px]">Competency Scores</span>
                    </label>
                    <label class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-[#FAF8F7] cursor-pointer">
                        <input type="checkbox" checked class="accent-primary w-3.5 h-3.5">
                        <span class="text-slate-800 font-semibold text-[11px]">HACCP &amp; Licenses</span>
                    </label>
                    <label class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-[#FAF8F7] cursor-pointer">
                        <input type="checkbox" checked class="accent-primary w-3.5 h-3.5">
                        <span class="text-slate-800 font-semibold text-[11px]">Succession Readiness</span>
                    </label>
                </div>
            </div>

            <div class="pt-3 border-t border-[#E8DEDC] flex justify-end">
                <button onclick="generateCustomAuditReport()" class="btn-primary px-6 py-2.5 text-xs font-bold flex items-center space-x-2 shadow-sm">
                    <i class="fas fa-file-arrow-down"></i>
                    <span>Generate &amp; Download Custom Export</span>
                </button>
            </div>
        </div>
    </div>

</div>
