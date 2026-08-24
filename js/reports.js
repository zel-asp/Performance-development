/**
 * Oxford Suites, Makati - Audit Reports & Compliance Exports Engine
 * 
 * Scope:
 * 1. Pre-packaged Executive Audit Packs (Performance, HACCP, Training, Succession, Sentiment)
 * 2. Real Downloadable CSV Exporters (Browser Blob-based instant file downloads)
 * 3. Formatted Printable PDF Executive Report Viewer
 * 4. Custom Report & Data Export Builder
 */

// =========================================================================
// 1. STATE STORES
// =========================================================================

const executiveReportsCatalog = [
    {
        id: 'rep-perf-q3',
        title: '2026 Q3 Comprehensive Performance Calibration Audit',
        category: 'performance',
        dept: 'Hotel-Wide (All Depts)',
        period: 'Q3 2026 (Jul 1 – Sep 30, 2026)',
        description: 'Complete employee evaluation dataset including self-reviews, supervisor appraisals, normalized calibration curves, and final approved tier distributions.',
        status: 'Audit Approved',
        recordsCount: '100 Associates',
        icon: 'fa-chart-line',
        color: 'primary'
    },
    {
        id: 'rep-haccp-statutory',
        title: 'Statutory Food Safety & HACCP Compliance Register',
        category: 'compliance',
        dept: 'Culinary & F&B Service',
        period: 'Annual Statutory Audit (2026)',
        description: 'Mandatory Food Safety Level 3, Allergen Control, and Kitchen Probe Temperature log audits for DOLE and Sanitation Inspectorate compliance.',
        status: '100% Compliant',
        recordsCount: '42 Certified Staff',
        icon: 'fa-shield-halved',
        color: 'sage'
    },
    {
        id: 'rep-training-governance',
        title: 'Training Governance & Skill Gap Closure Audit',
        category: 'training',
        dept: 'Hotel-Wide (All Depts)',
        period: 'Year-to-Date (2026)',
        description: 'Analysis of 1,240 training hours delivered, attendance vs completion ratios, pre/post test score differentials, and competency gap closure rates.',
        status: 'Verified',
        recordsCount: '8 Programs / 24 Cohorts',
        icon: 'fa-chalkboard-user',
        color: 'gold'
    },
    {
        id: 'rep-succession-mobility',
        title: 'Executive Succession Bench & 9-Box Talent Mobility Deck',
        category: 'succession',
        dept: 'Operations Leadership',
        period: 'Executive Review Q3 2026',
        description: 'Succession depth for critical hotel management roles, ready-now candidate rosters, flight-risk assessments, and 9-box performance vs potential calibration.',
        status: 'Confidential (HR Only)',
        recordsCount: '4 Critical Roles / 6 Successors',
        icon: 'fa-sitemap',
        color: 'dusty'
    },
    {
        id: 'rep-shift-sentiment',
        title: 'Realtime Shift Climate & Rush Hour Friction Audit',
        category: 'sentiment',
        dept: 'Front Office & F&B Service',
        period: 'Last 30 Days (Rolling)',
        description: '24-hour sentiment dynamics synthesized by Gemini 1.5, identifying peak friction rush hours, table turnover delays, and employee wellness metrics.',
        status: 'Live Analytics',
        recordsCount: '720 Shift Logs',
        icon: 'fa-heart-pulse',
        color: 'terracotta'
    }
];

const statutoryLicensesData = [
    { id: 'LIC-01', staffName: 'Chef Marco Rossi', role: 'Executive Sous Chef', dept: 'Culinary', licenseType: 'HACCP Level 3 Food Safety', issueDate: 'Jan 15, 2025', expiryDate: 'Jan 15, 2027', status: 'Active', certRef: 'HACCP-2025-089' },
    { id: 'LIC-02', staffName: 'Chef Marco S.', role: 'Line Cook Lead', dept: 'Culinary', licenseType: 'HACCP Level 3 Food Safety', issueDate: 'Aug 22, 2026', expiryDate: 'Aug 22, 2028', status: 'Active', certRef: 'HACCP-2026-112' },
    { id: 'LIC-03', staffName: 'Maria Santos', role: 'Front Desk Host', dept: 'Front Office', licenseType: 'Opera Cloud PMS Certified Specialist', issueDate: 'Aug 24, 2026', expiryDate: 'Aug 24, 2028', status: 'Active', certRef: 'OXF-CERT-2026-0889' },
    { id: 'LIC-04', staffName: 'Carlos Gomez', role: 'Concierge Lead', dept: 'Front Office', licenseType: 'First Aid & CPR First Responder', issueDate: 'Mar 10, 2025', expiryDate: 'Mar 10, 2027', status: 'Active', certRef: 'FA-2025-334' },
    { id: 'LIC-05', staffName: 'Pierre Dubois', role: 'Master Sommelier', dept: 'F&B Service', licenseType: 'Court of Master Sommeliers Cert', issueDate: 'Jun 12, 2024', expiryDate: 'Jun 12, 2027', status: 'Active', certRef: 'SOMM-2024-55' },
    { id: 'LIC-06', staffName: 'Antonio Silva', role: 'Chef de Partie', dept: 'Culinary', licenseType: 'Food Safety & Hygiene Refresher', issueDate: 'Sep 01, 2024', expiryDate: 'Sep 10, 2026', status: 'Expiring Soon', certRef: 'HACCP-2024-041' },
    { id: 'LIC-07', staffName: 'Rosa Flores', role: 'Floor Supervisor', dept: 'Housekeeping', licenseType: 'Chemical Handling & Bloodborne Safety', issueDate: 'Oct 05, 2025', expiryDate: 'Oct 05, 2027', status: 'Active', certRef: 'HS-2025-108' }
];

const departmentPerformanceSummary = [
    { dept: 'Front Office', headcount: 12, completionRate: '100%', avgScore: '4.55 / 5.0', tier1Count: 4, tier2Count: 7, tier3Count: 1, complianceRate: '100%' },
    { dept: 'Culinary & Kitchen', headcount: 18, completionRate: '95%', avgScore: '4.62 / 5.0', tier1Count: 7, tier2Count: 10, tier3Count: 1, complianceRate: '94.4%' },
    { dept: 'Food & Beverage', headcount: 24, completionRate: '92%', avgScore: '4.48 / 5.0', tier1Count: 6, tier2Count: 16, tier3Count: 2, complianceRate: '95.8%' },
    { dept: 'Housekeeping', headcount: 28, completionRate: '90%', avgScore: '4.42 / 5.0', tier1Count: 5, tier2Count: 21, tier3Count: 2, complianceRate: '96.4%' },
    { dept: 'Banquet & Events', headcount: 18, completionRate: '94%', avgScore: '4.50 / 5.0', tier1Count: 5, tier2Count: 12, tier3Count: 1, complianceRate: '100%' }
];

let activeReportsCatalogFilter = 'all';

// =========================================================================
// 2. INITIALIZATION & RENDERING
// =========================================================================

function initReportsHub() {
    renderReportsCatalog();
    renderStatutoryRegister();
    renderDepartmentPerformanceSummary();
}

function setReportsCatalogFilter(catKey) {
    activeReportsCatalogFilter = catKey;
    document.querySelectorAll('.reports-cat-chip').forEach(btn => {
        if (btn.dataset.cat === catKey) {
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('bg-[#FAF8F7]', 'text-slate-600');
        } else {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-[#FAF8F7]', 'text-slate-600');
        }
    });
    renderReportsCatalog();
}

function renderReportsCatalog() {
    const container = document.getElementById('reports-catalog-grid');
    if (!container) return;

    let filtered = executiveReportsCatalog;
    if (activeReportsCatalogFilter !== 'all') {
        filtered = executiveReportsCatalog.filter(r => r.category === activeReportsCatalogFilter);
    }

    container.innerHTML = filtered.map(rep => `
        <div class="card-clean p-5 hover:shadow-lg transition flex flex-col justify-between space-y-4 border border-[#E8DEDC] bg-white">
            <div class="space-y-3">
                <div class="flex items-start justify-between gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-${rep.color}-500/10 text-${rep.color}-700 border border-${rep.color}-500/20 flex items-center justify-center text-lg flex-shrink-0">
                        <i class="fas ${rep.icon}"></i>
                    </div>
                    <span class="badge-sage text-[10px] font-bold">${rep.status}</span>
                </div>

                <div>
                    <span class="badge-dusty text-[10px] font-bold">${rep.dept}</span>
                    <h4 class="font-heading font-bold text-base text-slate-900 mt-1">${rep.title}</h4>
                    <p class="text-[11px] text-slate-400 font-semibold mt-0.5"><i class="fas fa-calendar-alt mr-1"></i> Period: ${rep.period}</p>
                </div>

                <p class="text-xs text-slate-600 leading-relaxed">${rep.description}</p>
                
                <div class="p-2.5 rounded-xl bg-[#FAF8F7] border border-[#E8DEDC] flex items-center justify-between text-xs">
                    <span class="text-slate-500 text-[11px]">Dataset Scope:</span>
                    <span class="font-bold text-slate-800">${rep.recordsCount}</span>
                </div>
            </div>

            <!-- Export Buttons -->
            <div class="pt-3 border-t border-[#E8DEDC] flex items-center justify-between gap-2 text-xs">
                <button onclick="downloadCSVReport('${rep.id}')" class="btn-secondary px-3 py-1.5 font-bold flex items-center space-x-1.5 text-slate-700">
                    <i class="fas fa-file-csv text-emerald-600"></i>
                    <span>Export CSV</span>
                </button>
                <button onclick="openPrintableReportPDF('${rep.id}')" class="btn-primary px-3 py-1.5 font-bold flex items-center space-x-1.5">
                    <i class="fas fa-file-pdf"></i>
                    <span>Official PDF</span>
                </button>
            </div>
        </div>
    `).join('');
}

function renderStatutoryRegister() {
    const tbody = document.getElementById('statutory-register-tbody');
    if (!tbody) return;

    tbody.innerHTML = statutoryLicensesData.map(lic => {
        const isExpiring = lic.status === 'Expiring Soon';
        const badge = isExpiring
            ? `<span class="badge-gold text-[10px] font-bold"><i class="fas fa-hourglass-half mr-1"></i> Expiring Soon</span>`
            : `<span class="badge-sage text-[10px] font-bold"><i class="fas fa-check-circle mr-1"></i> Active</span>`;

        return `
            <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
                <td class="px-5 py-3 font-mono font-bold text-slate-700">${lic.id}</td>
                <td class="px-5 py-3">
                    <span class="font-bold text-slate-900 block">${lic.staffName}</span>
                    <span class="text-[10px] text-slate-500">${lic.role} · ${lic.dept}</span>
                </td>
                <td class="px-5 py-3 font-semibold text-slate-800">${lic.licenseType}</td>
                <td class="px-5 py-3 font-mono text-[11px] text-slate-600">${lic.certRef}</td>
                <td class="px-5 py-3 text-slate-600">${lic.issueDate}</td>
                <td class="px-5 py-3 font-semibold ${isExpiring ? 'text-amber-700 font-bold' : 'text-slate-700'}">${lic.expiryDate}</td>
                <td class="px-5 py-3">${badge}</td>
                <td class="px-5 py-3 text-right">
                    <button onclick="downloadSingleLicenseCert('${lic.id}')" class="text-primary hover:underline font-bold text-[11px]">
                        Verify &amp; Cert &rarr;
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderDepartmentPerformanceSummary() {
    const tbody = document.getElementById('dept-audit-tbody');
    if (!tbody) return;

    tbody.innerHTML = departmentPerformanceSummary.map(d => `
        <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
            <td class="px-5 py-3.5 font-bold text-slate-900">${d.dept}</td>
            <td class="px-5 py-3.5 text-slate-600">${d.headcount} Staff</td>
            <td class="px-5 py-3.5 font-bold text-emerald-700">${d.completionRate}</td>
            <td class="px-5 py-3.5 font-bold text-primary">${d.avgScore}</td>
            <td class="px-5 py-3.5">
                <span class="text-emerald-700 font-bold">${d.tier1Count} Exceeds</span> / 
                <span class="text-slate-600">${d.tier2Count} Meets</span> / 
                <span class="text-rose-600 font-bold">${d.tier3Count} Dev</span>
            </td>
            <td class="px-5 py-3.5 font-bold text-slate-800">${d.complianceRate}</td>
            <td class="px-5 py-3.5 text-right">
                <button onclick="downloadDeptCSV('${d.dept}')" class="btn-secondary px-2.5 py-1 text-[11px] font-bold">
                    <i class="fas fa-file-csv text-emerald-600 mr-1"></i> CSV
                </button>
            </td>
        </tr>
    `).join('');
}

// =========================================================================
// 3. REAL CLIENT-SIDE CSV EXPORT GENERATOR (Dynamic Blob Download)
// =========================================================================

function downloadCSVReport(reportId) {
    let filename = 'oxford_suites_audit_export.csv';
    let csvContent = '';

    if (reportId === 'rep-perf-q3') {
        filename = 'oxford_suites_performance_q3_audit.csv';
        csvContent = 'Associate ID,Associate Name,Department,Role,Self Rating,Supervisor Rating,Final Calibrated Score,Performance Tier,Appraisal Status,Sign-Off Date\n' +
            'EMP-101,Maria Santos,Front Office,Front Desk Host,4.80,4.85,4.80,Tier 1 Exceeds Expectations,Calibrated & Approved,2026-08-23\n' +
            'EMP-102,Carlos Gomez,Front Office,Concierge Host,4.40,4.60,4.60,Tier 1 Exceeds Expectations,Calibrated & Approved,2026-08-22\n' +
            'EMP-103,Chef Marco Rossi,Culinary,Executive Sous Chef,4.85,4.90,4.85,Tier 1 Exceeds Expectations,Calibrated & Approved,2026-08-20\n' +
            'EMP-104,Chef Marco S.,Culinary,Line Cook Lead,4.50,4.50,4.50,Tier 2 Meets Expectations,Calibrated & Approved,2026-08-21\n' +
            'EMP-105,Pierre Dubois,F&B Service,Master Sommelier,4.90,4.95,4.90,Tier 1 Exceeds Expectations,Calibrated & Approved,2026-08-19\n' +
            'EMP-106,David Lee,F&B Service,F&B Server Lead,4.20,4.20,4.20,Tier 2 Meets Expectations,Calibrated & Approved,2026-08-20\n' +
            'EMP-107,Rosa Flores,Housekeeping,Floor Supervisor,4.65,4.65,4.65,Tier 1 Exceeds Expectations,Calibrated & Approved,2026-08-22\n' +
            'EMP-108,Elena Vance,HR & Admin,HR Director,4.95,4.95,4.95,Tier 1 Exceeds Expectations,Calibrated & Approved,2026-08-24\n';
    } else if (reportId === 'rep-haccp-statutory') {
        filename = 'oxford_suites_statutory_haccp_register.csv';
        csvContent = 'License ID,Associate Name,Role,Department,Certification Type,Certificate Reference,Issue Date,Expiry Date,Compliance Status\n' +
            statutoryLicensesData.map(l => `"${l.id}","${l.staffName}","${l.role}","${l.dept}","${l.licenseType}","${l.certRef}","${l.issueDate}","${l.expiryDate}","${l.status}"`).join('\n');
    } else if (reportId === 'rep-training-governance') {
        filename = 'oxford_suites_training_governance_audit.csv';
        csvContent = 'Program ID,Program Name,Category,Department,Trainer,Duration (Hrs),Total Enrolled,Attendance Rate %,Passing Score %,Completion Rate %\n' +
            'PRG-01,Frontline Conflict & Crisis Diplomacy,Skill Gap Resolution,Front Office,Elena Vance,4.0,14,100%,96%,100%\n' +
            'PRG-02,HACCP Level 3 Food Safety & Allergen Master,Mandatory Statutory,Culinary,Chef Marco Rossi,6.0,18,94.4%,94%,94.4%\n' +
            'PRG-03,Opera Cloud PMS Advanced Check-in & Audit,Software Mastery,Front Office,Maria Santos,3.5,12,100%,92%,100%\n' +
            'PRG-04,Luxury Tableside Wine Service & Sommelier Etiquette,Upselling Excellence,F&B Service,Pierre Dubois,5.0,20,95%,90%,95%\n';
    } else if (reportId === 'rep-succession-mobility') {
        filename = 'oxford_suites_succession_bench_audit.csv';
        csvContent = 'Role ID,Target Leadership Role,Department,Current Incumbent,Planned Transition Horizon,Risk of Loss,Designated Primary Successor,Computed Match %,HR Readiness Flag\n' +
            'ROLE-01,Front Office Assistant Manager,Front Office,John Marco,Q1 2027 (6 Months),Medium,Maria Santos,94%,Ready Now\n' +
            'ROLE-02,Executive Sous Chef,Culinary,Chef Marco Rossi,Q3 2027 (12 Months),Low,Chef Marco S.,86%,Ready in 1-2 Years\n' +
            'ROLE-03,Restaurant Operations Manager,F&B Service,Antoine Laurent,Q4 2027 (18 Months),High,David Lee,74%,Not Ready\n' +
            'ROLE-04,Executive Housekeeper,Housekeeping,Theresa Ramos,Q2 2028 (24 Months),Low,Rosa Flores,91%,Ready Now\n';
    } else {
        filename = 'oxford_suites_shift_sentiment_friction_audit.csv';
        csvContent = 'Shift Date,Shift Window,Department,Overall Sentiment Score %,Positive %,Neutral %,Stress / Friction %,Top Friction Cause,Gemini Intervention Recommendation\n' +
            '2026-08-24,07:00 - 15:30 (Morning),Front Office,71.2%,71.2%,21.0%,7.8%,None - Smooth Handover,Maintain Standard Protocol\n' +
            '2026-08-24,15:30 - 23:30 (Evening),Front Office,63.0%,63.0%,22.0%,15.0%,Triple Flight Arrival Luggage Queue,Dispatch 1 Concierge Floater to Executive Lounge\n' +
            '2026-08-24,11:30 - 14:30 (Lunch Rush),F&B Bistro,68.5%,68.5%,23.0%,8.5%,Table 12 VIP Special Order Delay,Assign Head Waiter tableside sommelier recovery\n';
    }

    triggerBrowserCSVDownload(csvContent, filename);
}

function downloadDeptCSV(deptName) {
    const filename = `oxford_suites_${deptName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_audit.csv`;
    const csvContent = `Department Audit: ${deptName}\n` +
        'Export Generated: 2026-08-24\n' +
        'Facility: Oxford Suites, Makati\n\n' +
        'Headcount,Appraisal Completion Rate %,Average Calibrated Score,Tier 1 Count,Tier 2 Count,Tier 3 Count,Compliance Rate %\n' +
        departmentPerformanceSummary.filter(d => d.dept === deptName).map(d => `"${d.headcount}","${d.completionRate}","${d.avgScore}","${d.tier1Count}","${d.tier2Count}","${d.tier3Count}","${d.complianceRate}"`).join('\n');

    triggerBrowserCSVDownload(csvContent, filename);
}

function downloadSingleLicenseCert(licId) {
    const lic = statutoryLicensesData.find(l => l.id === licId);
    if (!lic) return;

    const filename = `license_${lic.certRef.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`;
    const csvContent = 'License ID,Associate Name,Role,Department,Certification Type,Certificate Reference,Issue Date,Expiry Date,Status\n' +
        `"${lic.id}","${lic.staffName}","${lic.role}","${lic.dept}","${lic.licenseType}","${lic.certRef}","${lic.issueDate}","${lic.expiryDate}","${lic.status}"\n`;

    triggerBrowserCSVDownload(csvContent, filename);
    showToast(`Verification export for ${lic.staffName} (${lic.certRef}) downloaded.`, 'success');
}

function triggerBrowserCSVDownload(csvString, filename) {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Export complete: "${filename}" saved successfully!`, 'success');
}

// =========================================================================
// 4. PRINTABLE EXECUTIVE PDF AUDIT VIEWER
// =========================================================================

function openPrintableReportPDF(reportId) {
    const rep = executiveReportsCatalog.find(r => r.id === reportId) || executiveReportsCatalog[0];

    const modalTitle = document.getElementById('print-report-modal-title');
    const modalPeriod = document.getElementById('print-report-modal-period');
    const modalDept = document.getElementById('print-report-modal-dept');
    const modalBody = document.getElementById('print-report-modal-body');

    if (modalTitle) modalTitle.textContent = rep.title;
    if (modalPeriod) modalPeriod.textContent = `Audit Window: ${rep.period}`;
    if (modalDept) modalDept.textContent = `Department Scope: ${rep.dept}`;

    if (modalBody) {
        if (reportId === 'rep-haccp-statutory') {
            modalBody.innerHTML = `
                <div class="space-y-4">
                    <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex justify-between items-center text-xs">
                        <div>
                            <span class="font-bold text-emerald-900 text-sm block">100% Statutory Sanitation &amp; HACCP Compliance</span>
                            <span class="text-emerald-700">Validated under Philippine Food Safety Act &amp; Oxford International Hospitality Standards</span>
                        </div>
                        <span class="badge-sage text-xs font-bold">Audit Grade: A+</span>
                    </div>

                    <table class="w-full text-left text-xs border border-[#E8DEDC] rounded-xl overflow-hidden">
                        <thead class="bg-[#FAF8F7] text-slate-600 font-bold uppercase text-[10px] border-b border-[#E8DEDC]">
                            <tr>
                                <th class="p-3">Associate</th>
                                <th class="p-3">Certification</th>
                                <th class="p-3">Reference Code</th>
                                <th class="p-3">Expiry Date</th>
                                <th class="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8DEDC]">
                            ${statutoryLicensesData.map(l => `
                                <tr>
                                    <td class="p-3 font-bold text-slate-900">${l.staffName} (${l.dept})</td>
                                    <td class="p-3 text-slate-700">${l.licenseType}</td>
                                    <td class="p-3 font-mono text-[11px] text-slate-500">${l.certRef}</td>
                                    <td class="p-3 text-slate-700">${l.expiryDate}</td>
                                    <td class="p-3"><span class="badge-sage text-[10px] font-bold">${l.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            modalBody.innerHTML = `
                <div class="space-y-4">
                    <div class="grid grid-cols-3 gap-3 text-xs">
                        <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC]">
                            <span class="text-slate-400 block text-[10px] uppercase font-bold">Completion Rate</span>
                            <span class="text-lg font-bold text-emerald-700">96.2% Completed</span>
                        </div>
                        <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC]">
                            <span class="text-slate-400 block text-[10px] uppercase font-bold">Property Average</span>
                            <span class="text-lg font-bold text-primary">4.53 / 5.0 Rating</span>
                        </div>
                        <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC]">
                            <span class="text-slate-400 block text-[10px] uppercase font-bold">Calibration Status</span>
                            <span class="text-lg font-bold text-slate-900">100% Normalized</span>
                        </div>
                    </div>

                    <table class="w-full text-left text-xs border border-[#E8DEDC] rounded-xl overflow-hidden">
                        <thead class="bg-[#FAF8F7] text-slate-600 font-bold uppercase text-[10px] border-b border-[#E8DEDC]">
                            <tr>
                                <th class="p-3">Department</th>
                                <th class="p-3">Staff Headcount</th>
                                <th class="p-3">Completion %</th>
                                <th class="p-3">Average Score</th>
                                <th class="p-3">Tier Distribution (Exceeds / Meets / Dev)</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8DEDC]">
                            ${departmentPerformanceSummary.map(d => `
                                <tr>
                                    <td class="p-3 font-bold text-slate-900">${d.dept}</td>
                                    <td class="p-3 text-slate-600">${d.headcount} Associates</td>
                                    <td class="p-3 font-bold text-emerald-700">${d.completionRate}</td>
                                    <td class="p-3 font-bold text-primary">${d.avgScore}</td>
                                    <td class="p-3">${d.tier1Count} / ${d.tier2Count} / ${d.tier3Count}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }

    if (typeof openModal === 'function') {
        openModal('modal-report-print-preview');
    }
}

function triggerNativeBrowserPrint() {
    window.print();
}

// =========================================================================
// 5. CUSTOM REPORT BUILDER
// =========================================================================

function generateCustomAuditReport() {
    const dept = document.getElementById('custom-report-dept')?.value || 'all';
    const period = document.getElementById('custom-report-period')?.value || 'Q3 2026';
    const format = document.getElementById('custom-report-format')?.value || 'csv';

    if (format === 'csv') {
        const filename = `custom_audit_${dept}_${period.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`;
        const csvContent = `Custom Oxford Suites Audit Report\n` +
            `Scope: ${dept} · Period: ${period}\n` +
            `Generated: 2026-08-24\n\n` +
            `Employee Name,Department,Role,Appraisal Score,HACCP Certified,De-escalation Level,XP Points Balance,Succession Readiness\n` +
            `Maria Santos,Front Office,Front Desk Host,4.80,Yes (Opera Specialist),4.8 Master,1480 XP,Ready Now (94%)\n` +
            `Carlos Gomez,Front Office,Concierge Host,4.60,Yes (First Aid),4.8 Master,1240 XP,Ready in 1-2 Years (88%)\n` +
            `Chef Marco Rossi,Culinary,Executive Sous Chef,4.85,Yes (HACCP Level 3),4.9 Master,1850 XP,Incumbent\n` +
            `Pierre Dubois,F&B Service,Master Sommelier,4.90,Yes (Sommelier Master),5.0 Master,1920 XP,Incumbent\n`;
        
        triggerBrowserCSVDownload(csvContent, filename);
    } else {
        openPrintableReportPDF('rep-perf-q3');
        showToast('Custom PDF Report preview generated!', 'success');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initReportsHub();
});
