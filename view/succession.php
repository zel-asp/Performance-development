<!-- ======================================================== -->
<!-- PILLAR 5: SUCCESSION PLANNING & 9-BOX TALENT GRID        -->
<!-- Process: Pull Data -> Compute Matrix -> HR Review -> Set Flag -> Succession Record -->
<!-- ======================================================== -->
<div id="panel-pillar-succession" class="pillar-panel space-y-6">

    <!-- Top KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div class="card-clean p-4 border-l-4 border-l-primary space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Target Key Positions</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-succession-roles" class="text-xl font-heading font-extrabold text-slate-900">4</span>
                <span class="text-[10px] font-bold text-slate-500">Critical Roles</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-sage space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Ready Now Successors</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-succession-readynow" class="text-xl font-heading font-extrabold text-slate-900">1</span>
                <span class="text-[10px] font-bold text-emerald-600">0–6 Months Horizon</span>
            </div>
        </div>

        <div class="card-clean p-4 border-l-4 border-l-gold space-y-1">
            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Pipeline Developing</span>
            <div class="flex items-baseline space-x-2">
                <span id="stat-succession-pipeline" class="text-xl font-heading font-extrabold text-slate-900">2</span>
                <span class="text-[10px] font-bold text-gold-dark">Ready in 1–2 Years</span>
            </div>
        </div>
    </div>

    <!-- 4-Step Process Visualizer Banner -->
    <div class="card-clean p-4 bg-white border border-[#E8DEDC] space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DEDC] pb-2.5">
            <div>
                <h3 class="font-heading font-bold text-sm text-slate-900 flex items-center space-x-2">
                    <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                    <span>Succession Planning &amp; Readiness Calculation Workflow</span>
                </h3>
                <p class="text-slate-500 text-xs">Closed Performance + Competencies &rarr; Computed Matrix &rarr; HR Review &rarr; Manual Readiness Flag</p>
            </div>
            <span class="badge-primary text-[10px] font-bold">Data-Informed Pipeline</span>
        </div>

        <!-- 4-Step Track -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div class="p-2.5 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] space-y-0.5">
                <span class="text-[10px] font-bold text-primary block">STEP 1: DATA PULL</span>
                <span class="font-bold text-slate-900 block text-xs">Closed Ratings &amp; Competencies</span>
                <span class="text-[10px] text-slate-500 block">Performance reviews &amp; evaluated skill levels</span>
            </div>

            <div class="p-2.5 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] space-y-0.5">
                <span class="text-[10px] font-bold text-dusty-dark block">STEP 2: COMPUTATION</span>
                <span class="font-bold text-slate-900 block text-xs">Readiness Matrix (Employee × Role)</span>
                <span class="text-[10px] text-slate-500 block">Automated % fit against role requirements</span>
            </div>

            <div class="p-2.5 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] space-y-0.5">
                <span class="text-[10px] font-bold text-gold-dark block">STEP 3: HR REVIEW</span>
                <span class="font-bold text-slate-900 block text-xs">Bench Calibration &amp; Audit</span>
                <span class="text-[10px] text-slate-500 block">Evaluate leadership readiness and gaps</span>
            </div>

            <div class="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-0.5">
                <span class="text-[10px] font-bold text-emerald-700 block">STEP 4: HR FLAG</span>
                <span class="font-bold text-emerald-900 block text-xs">Set Readiness Horizon</span>
                <span class="text-[10px] text-emerald-600 block">Ready Now / 1–2 Yrs / Not Ready</span>
            </div>
        </div>
    </div>

    <!-- Navigation Tabs & Filter Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="subnav-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar flex-shrink-0">
            <button onclick="switchSubTab('succession', 'records')" class="subnav-pill subnav-succession active" data-sub="records">
                <i class="fas fa-sitemap mr-1.5 text-primary"></i>
                <span>Succession Records (by Dept)</span>
            </button>
            <button onclick="switchSubTab('succession', 'matrix')" class="subnav-pill subnav-succession" data-sub="matrix">
                <i class="fas fa-table-cells mr-1.5 text-dusty-dark"></i>
                <span>Computed Readiness Matrix</span>
            </button>
            <button onclick="switchSubTab('succession', 'ninebox')" class="subnav-pill subnav-succession" data-sub="ninebox">
                <i class="fas fa-cubes-stacked mr-1.5 text-gold-dark"></i>
                <span>9-Box Calibration Grid</span>
            </button>
        </div>

        <!-- Department Filter -->
        <div class="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar">
            <button onclick="setSuccessionDeptFilter('all')" data-dept="all" class="succession-dept-chip px-3 py-1 rounded-full font-bold bg-primary text-white text-[11px] whitespace-nowrap">All Depts</button>
            <button onclick="setSuccessionDeptFilter('front office')" data-dept="front office" class="succession-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Front Office</button>
            <button onclick="setSuccessionDeptFilter('culinary')" data-dept="culinary" class="succession-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">Culinary</button>
            <button onclick="setSuccessionDeptFilter('f&b service')" data-dept="f&b service" class="succession-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap">F&amp;B Service</button>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 1: SUCCESSION RECORDS (Dept × Target Role)     -->
    <!-- ======================================================== -->
    <div id="sub-succession-records" class="sub-panel sub-panel-succession active space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Hotel Leadership Succession Records</h4>
                <p class="text-slate-500 text-xs">Key leadership roles tied to Department, Incumbent transition horizon, Primary successor, and Emergency backup</p>
            </div>
            <button onclick="openCreateSuccessionRoleModal()" class="btn-primary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1">
                <i class="fas fa-plus"></i>
                <span>+ Add Succession Role</span>
            </button>
        </div>

        <div id="succession-records-grid" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Rendered by js/succession.js -->
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 2: COMPUTED READINESS MATRIX (Employee × Role)  -->
    <!-- ======================================================== -->
    <div id="sub-succession-matrix" class="sub-panel sub-panel-succession space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Computed Readiness Matrix (Employee &times; Target Role)</h4>
                <p class="text-slate-500 text-xs">Algorithm computes match % based on closed performance ratings (40%) + competency benchmarks (60%), followed by HR manual flag assignment</p>
            </div>
            <span class="badge-primary"><i class="fas fa-lock mr-1"></i> HR-Only Flag Controls</span>
        </div>

        <div class="card-clean overflow-hidden border border-[#E8DEDC]">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                    <tr>
                        <th class="px-5 py-3">Employee Candidate</th>
                        <th class="px-5 py-3">Target Leadership Role</th>
                        <th class="px-5 py-3">1. Performance Rating</th>
                        <th class="px-5 py-3">1. Competency Levels</th>
                        <th class="px-5 py-3">2. Computed Fit (%)</th>
                        <th class="px-5 py-3">4. HR Readiness Flag</th>
                        <th class="px-5 py-3 text-right">Audit</th>
                    </tr>
                </thead>
                <tbody id="succession-matrix-tbody" class="divide-y divide-[#E8DEDC]">
                    <!-- Rendered by js/succession.js -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- ======================================================== -->
    <!-- SUB-PANEL 3: 9-BOX TALENT CALIBRATION GRID               -->
    <!-- ======================================================== -->
    <div id="sub-succession-ninebox" class="sub-panel sub-panel-succession space-y-4 text-xs">
        <div class="card-clean p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#E8DEDC]">
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">Hospitality 9-Box Talent Calibration Grid</h4>
                <p class="text-slate-500 text-xs">Calibrating Performance (X-Axis) vs. Leadership Potential (Y-Axis) for bench mobility</p>
            </div>
            <button onclick="showToast('Exporting 9-Box Executive Talent Matrix (PDF)...', 'info')" class="btn-secondary px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1">
                <i class="fas fa-file-arrow-down"></i>
                <span>Export 9-Box Matrix</span>
            </button>
        </div>

        <div id="nine-box-grid-container">
            <!-- Rendered by js/succession.js -->
        </div>
    </div>

</div>

<!-- ======================================================== -->
<!-- PILLAR 6: SOCIAL RECOGNITION, XP & SHIFT CLIMATE         -->
