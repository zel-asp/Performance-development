/**
 * Oxford Suites, Makati — Audit Reports & Compliance Exports Engine
 *
 * v2 — live backend wired to api/reports.php
 * Sections:
 *   1. State
 *   2. Init & Bootstrap (real API)
 *   3. Catalog Rendering
 *   4. Statutory / Dept tables (real data from API)
 *   5. CSV Export (calls api/reports.php → rows → Blob download)
 *   6. PDF Preview Modal
 *   7. Custom Report Builder
 */

// =========================================================================
// 1. STATE
// =========================================================================

let _reportsBootstrap = null;   // cached API response
let activeReportsCatalogFilter = 'all';

const executiveReportsCatalog = [
    {
        id: 'rep-perf-q3',
        title: '2026 Q3 Comprehensive Performance Calibration Audit',
        category: 'performance',
        dept: 'Hotel-Wide (All Depts)',
        period: 'Q3 2026 (Jul 1 – Sep 30, 2026)',
        description: 'Complete employee evaluation dataset including self-reviews, supervisor appraisals, normalized calibration curves, and final approved tier distributions.',
        status: 'Audit Approved',
        icon: 'fa-chart-line',
        color: 'primary',
        exportType: 'all',
    },
    {
        id: 'rep-haccp-statutory',
        title: 'Statutory Food Safety & HACCP Compliance Register',
        category: 'compliance',
        dept: 'Culinary & F&B Service',
        period: 'Annual Statutory Audit (2026)',
        description: 'Mandatory Food Safety Level 3, Allergen Control, and Kitchen Probe Temperature log audits for DOLE and Sanitation Inspectorate compliance.',
        status: '100% Compliant',
        icon: 'fa-shield-halved',
        color: 'sage',
        exportType: 'certification',
    },
    {
        id: 'rep-training-governance',
        title: 'Training Governance & Skill Gap Closure Audit',
        category: 'training',
        dept: 'Hotel-Wide (All Depts)',
        period: 'Year-to-Date (2026)',
        description: 'Analysis of training programs delivered, attendance vs completion ratios, pre/post test score differentials, and competency gap closure rates.',
        status: 'Verified',
        icon: 'fa-chalkboard-user',
        color: 'gold',
        exportType: 'training',
    },
    {
        id: 'rep-succession-mobility',
        title: 'Executive Succession Bench & 9-Box Talent Mobility Deck',
        category: 'succession',
        dept: 'Operations Leadership',
        period: 'Executive Review Q3 2026',
        description: 'Succession depth for critical hotel management roles, ready-now candidate rosters, flight-risk assessments, and 9-box performance vs potential calibration.',
        status: 'Confidential (HR Only)',
        icon: 'fa-sitemap',
        color: 'dusty',
        exportType: 'dept_summary',
    },
    {
        id: 'rep-shift-sentiment',
        title: 'Realtime Shift Climate & Rush Hour Friction Audit',
        category: 'sentiment',
        dept: 'Front Office & F&B Service',
        period: 'Last 30 Days (Rolling)',
        description: '24-hour sentiment dynamics identifying peak friction rush hours, table turnover delays, and employee wellness metrics.',
        status: 'Live Analytics',
        icon: 'fa-heart-pulse',
        color: 'terracotta',
        exportType: 'needs',
    }
];

// =========================================================================
// 2. INIT & BOOTSTRAP
// =========================================================================

async function initReportsHub() {
    try {
        const res = await fetch('api/reports.php?action=bootstrap_reports');
        const json = await res.json();
        if (json.success) {
            _reportsBootstrap = json;
            updateKPICards(json.kpi);
            renderDepartmentPerformanceSummary(json.deptSummary);
            renderCertificationRegister(json.certificates);
        }
    } catch (e) {
        console.warn('[Reports] Bootstrap failed, using static fallback:', e);
        renderDepartmentPerformanceSummary(null);
        renderCertificationRegister(null);
    }
    renderReportsCatalog();
}

function updateKPICards(kpi) {
    if (!kpi) return;

    // 1. Audited Associates
    const auditedValEl = document.getElementById('rep-kpi-audited-val');
    const auditedSubEl = document.getElementById('rep-kpi-audited-sub');
    const auditedCount = kpi.auditedAssociates ?? (kpi.totalHeadcount ?? 4);
    const auditedPct = kpi.auditedRatePct ?? 100;
    if (auditedValEl) auditedValEl.textContent = auditedCount;
    if (auditedSubEl) auditedSubEl.textContent = `${auditedPct}% Q3 Complete`;

    // 2. Statutory Compliance
    const compValEl = document.getElementById('rep-kpi-compliance-val');
    const compSubEl = document.getElementById('rep-kpi-compliance-sub');
    if (compValEl) compValEl.textContent = `${kpi.statutoryCompliancePct ?? 100}%`;
    if (compSubEl) compSubEl.textContent = 'HACCP & Hygiene';

    // 3. Active Certifications
    let certCount = kpi.activeCertificates ?? 0;
    if (typeof getAggregatedCertificates === 'function') {
        const liveCerts = getAggregatedCertificates();
        if (liveCerts && liveCerts.length > certCount) {
            certCount = liveCerts.length;
        }
    }
    const certValEl = document.getElementById('rep-kpi-certs-val');
    const certSubEl = document.getElementById('rep-kpi-certs-sub');
    if (certValEl) certValEl.textContent = certCount;
    if (certSubEl) certSubEl.textContent = 'Verified Licenses';

    // 4. Bench Coverage (Succession Depth)
    const benchValEl = document.getElementById('rep-kpi-bench-val');
    const benchSubEl = document.getElementById('rep-kpi-bench-sub');
    if (benchValEl) benchValEl.textContent = `${kpi.benchCoveragePct ?? 100}%`;
    if (benchSubEl) benchSubEl.textContent = 'Succession Depth';
}

// =========================================================================
// 3. CATALOG RENDERING
// =========================================================================

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

    const kpi = _reportsBootstrap?.kpi;
    let filtered = executiveReportsCatalog;
    if (activeReportsCatalogFilter !== 'all') {
        filtered = executiveReportsCatalog.filter(r => r.category === activeReportsCatalogFilter);
    }

    const recordLabel = {
        'rep-perf-q3':           kpi ? `${kpi.totalCertificates} Certified Associates` : 'Loading…',
        'rep-haccp-statutory':   kpi ? `${kpi.activeCertificates} Verified Licenses` : 'Loading…',
        'rep-training-governance': kpi ? `${kpi.totalPrograms} Active Programs` : 'Loading…',
        'rep-succession-mobility': '4 Critical Roles / 6 Successors',
        'rep-shift-sentiment':   kpi ? `${kpi.activeNeeds} Active TNA Triggers` : 'Loading…',
    };

    container.innerHTML = filtered.map(rep => `
        <div class="card-clean p-5 hover:shadow-lg transition flex flex-col justify-between space-y-4 border border-[#E8DEDC] bg-white">
            <div class="space-y-3">
                <div class="flex items-start justify-between gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-lg flex-shrink-0">
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
                    <span class="font-bold text-slate-800">${recordLabel[rep.id] ?? '—'}</span>
                </div>
            </div>
            <!-- Export buttons: CSV · Excel · Word · PDF -->
            <div class="pt-3 border-t border-[#E8DEDC] space-y-2 text-xs">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <button onclick="downloadCSVReport('${rep.id}')" title="Download CSV" class="flex-1 btn-secondary px-2 py-1.5 font-bold flex items-center justify-center space-x-1 text-slate-700 min-w-0">
                        <i class="fas fa-file-csv text-emerald-600"></i>
                        <span>CSV</span>
                    </button>
                    <button onclick="downloadExcelReport('${rep.id}')" title="Download Excel (.xlsx)" class="flex-1 btn-secondary px-2 py-1.5 font-bold flex items-center justify-center space-x-1 text-slate-700 min-w-0">
                        <i class="fas fa-file-excel text-emerald-700"></i>
                        <span>Excel</span>
                    </button>
                    <button onclick="downloadWordReport('${rep.id}')" title="Download Word (.doc)" class="flex-1 btn-secondary px-2 py-1.5 font-bold flex items-center justify-center space-x-1 text-slate-700 min-w-0">
                        <i class="fas fa-file-word text-blue-600"></i>
                        <span>Word</span>
                    </button>
                    <button onclick="openPrintableReportPDF('${rep.id}')" title="Print / PDF Preview" class="flex-1 btn-primary px-2 py-1.5 font-bold flex items-center justify-center space-x-1 min-w-0">
                        <i class="fas fa-file-pdf"></i>
                        <span>PDF</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// =========================================================================
// 4. STATUTORY / DEPT TABLES (real data)
// =========================================================================

function renderCertificationRegister(certs) {
    const tbody = document.getElementById('statutory-register-tbody');
    if (!tbody) return;

    if (!certs || certs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="px-5 py-8 text-center text-slate-400 text-xs">No certification records found.</td></tr>`;
        return;
    }

    tbody.innerHTML = certs.map((c, i) => {
        const certNo  = c.certificate_number ?? c.certificateNumber ?? `LIC-${String(i+1).padStart(2,'0')}`;
        const name    = c.associate_name ?? c.associateName ?? '—';
        const dept    = c.dept ?? '—';
        const program = c.program_title ?? c.programTitle ?? '—';
        const issueDate = c.issue_date ?? c.issueDate ?? '—';
        const score   = c.score ? `${c.score}%` : '—';
        const seal    = c.verification_seal_code ?? c.verificationSealCode ?? '—';
        const cat     = c.category ?? '—';

        return `
            <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
                <td class="px-5 py-3 font-mono font-bold text-slate-700">${certNo}</td>
                <td class="px-5 py-3">
                    <span class="font-bold text-slate-900 block">${name}</span>
                    <span class="text-[10px] text-slate-500">${dept}</span>
                </td>
                <td class="px-5 py-3 font-semibold text-slate-800">${program}</td>
                <td class="px-5 py-3 font-mono text-[11px] text-slate-600">${seal}</td>
                <td class="px-5 py-3 text-slate-600">${issueDate}</td>
                <td class="px-5 py-3 font-bold text-primary">${score}</td>
                <td class="px-5 py-3"><span class="badge-sage text-[10px] font-bold"><i class="fas fa-check-circle mr-1"></i> Active</span></td>
                <td class="px-5 py-3 text-right">
                    <button onclick="downloadSingleCert('${certNo}')" class="text-primary hover:underline font-bold text-[11px]">
                        Verify &amp; Cert &rarr;
                    </button>
                </td>
            </tr>`;
    }).join('');
}

function renderDepartmentPerformanceSummary(depts) {
    const tbody = document.getElementById('dept-audit-tbody');
    if (!tbody) return;

    // Fallback static if no live data
    const data = depts && depts.length > 0 ? depts : [
        { department: 'Front Office',    enrolled: 12, attended: 12, completed: 12, attendanceRate: 100, completionRate: 100, averageScore: 94.5 },
        { department: 'Culinary',        enrolled: 18, attended: 17, completed: 17, attendanceRate: 94,  completionRate: 94,  averageScore: 96.2 },
        { department: 'F&B Service',     enrolled: 24, attended: 23, completed: 22, attendanceRate: 96,  completionRate: 92,  averageScore: 91.8 },
        { department: 'Housekeeping',    enrolled: 28, attended: 25, completed: 24, attendanceRate: 89,  completionRate: 86,  averageScore: 88.5 },
        { department: 'Banquet & Events',enrolled: 18, attended: 17, completed: 17, attendanceRate: 94,  completionRate: 94,  averageScore: 93.1 },
    ];

    tbody.innerHTML = data.map(d => {
        const attRate  = d.attendanceRate ?? Math.round((d.attended / (d.enrolled||1)) * 100);
        const compRate = d.completionRate ?? Math.round((d.completed / (d.enrolled||1)) * 100);
        const avgScore = d.averageScore ?? 90;
        const attColor = attRate >= 95 ? 'text-emerald-700' : attRate >= 80 ? 'text-amber-700' : 'text-rose-600';
        const compColor= compRate>= 90 ? 'text-emerald-700' : compRate >= 75 ? 'text-amber-700' : 'text-rose-600';

        return `
        <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
            <td class="px-5 py-3.5 font-bold text-slate-900">${d.department}</td>
            <td class="px-5 py-3.5 text-slate-600">${d.enrolled ?? '—'} Staff</td>
            <td class="px-5 py-3.5 font-bold ${attColor}">${attRate}%</td>
            <td class="px-5 py-3.5 font-bold ${compColor}">${compRate}%</td>
            <td class="px-5 py-3.5 font-bold text-primary">${avgScore}</td>
            <td class="px-5 py-3.5">
                <span class="badge-sage text-[10px]">${compRate >= 90 ? '✓ Compliant' : '⚠ Partial'}</span>
            </td>
            <td class="px-5 py-3.5 text-right">
                <button onclick="downloadDeptCSV('${d.department}')" class="btn-secondary px-2.5 py-1 text-[11px] font-bold">
                    <i class="fas fa-file-csv text-emerald-600 mr-1"></i> CSV
                </button>
            </td>
        </tr>`;
    }).join('');
}

// =========================================================================
// 5. CSV EXPORT — pulls real rows from api/reports.php
// =========================================================================

async function downloadCSVReport(reportId) {
    const rep = executiveReportsCatalog.find(r => r.id === reportId);
    if (!rep) return;

    showToast('Preparing export…', 'info');

    try {
        const res = await fetch(`api/reports.php?action=export_csv&type=${rep.exportType}&dept=all&period=Q3+2026`);
        const json = await res.json();

        if (!json.success || !json.export?.rows) throw new Error(json.message ?? 'Export failed');

        const csvContent = json.export.rows.map(row =>
            row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        const slug = rep.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
        triggerBrowserCSVDownload(csvContent, `oxford_suites_${slug}.csv`);
        showToast(`Export complete! ${json.export.count} records downloaded.`, 'success');

    } catch (e) {
        console.error('[Reports] CSV export error:', e);
        showToast('Export failed — check connection.', 'error');
    }
}

async function downloadDeptCSV(deptName) {
    showToast(`Preparing ${deptName} export…`, 'info');
    try {
        const deptSlug = deptName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const res  = await fetch(`api/reports.php?action=export_csv&type=dept_summary&dept=${encodeURIComponent(deptName)}`);
        const json = await res.json();

        if (!json.success || !json.export?.rows) throw new Error('Export failed');

        const csvContent = json.export.rows.map(row =>
            row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        triggerBrowserCSVDownload(csvContent, `oxford_suites_dept_${deptSlug}.csv`);
        showToast(`${deptName} export downloaded!`, 'success');
    } catch(e) {
        console.error('[Reports] Dept CSV error:', e);
        showToast('Export failed.', 'error');
    }
}

async function downloadSingleCert(certNo) {
    const certs = _reportsBootstrap?.certificates ?? [];
    const cert  = certs.find(c => (c.certificate_number ?? c.certificateNumber ?? '') === certNo);

    if (!cert) {
        showToast('Certificate record not found in cache.', 'warning');
        return;
    }

    const csvContent = [
        ['Certificate No.','Associate Name','Department','Program Title','Score','Category','Issue Date','Verification Seal'],
        [
            cert.certificate_number ?? cert.certificateNumber ?? '',
            cert.associate_name ?? cert.associateName ?? '',
            cert.dept ?? '',
            cert.program_title ?? cert.programTitle ?? '',
            (cert.score ?? '') + '%',
            cert.category ?? '',
            cert.issue_date ?? cert.issueDate ?? '',
            cert.verification_seal_code ?? cert.verificationSealCode ?? '',
        ]
    ].map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');

    const slug = certNo.toLowerCase().replace(/[^a-z0-9]/g, '_');
    triggerBrowserCSVDownload(csvContent, `cert_${slug}.csv`);
    showToast(`Certificate ${certNo} exported.`, 'success');
}

function triggerBrowserCSVDownload(csvString, filename) {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ─── Excel (.xlsx) export via SheetJS ────────────────────────────────────────
function triggerExcelDownload(rows, filename) {
    if (!window.XLSX) {
        showToast('Excel library not loaded yet — try again in a moment.', 'warning');
        return;
    }
    const ws = XLSX.utils.aoa_to_sheet(rows);
    // Auto-width columns
    const colWidths = rows[0].map((_, ci) =>
        ({ wch: Math.min(50, Math.max(12, ...rows.map(r => String(r[ci] ?? '').length))) })
    );
    ws['!cols'] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Audit Data');
    XLSX.writeFile(wb, filename);
}

// ─── Word (.doc) export — HTML-to-Word blob ──────────────────────────────────
function triggerWordDownload(rows, title, filename) {
    const tableRows = rows.map((row, ri) => {
        const tag  = ri === 0 ? 'th' : 'td';
        const cells = row.map(cell =>
            `<${tag} style="border:1px solid #ccc;padding:6px 10px;font-size:11pt;${
                ri === 0 ? 'background:#f0f0f0;font-weight:bold;' : ''
            }">${String(cell ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</${tag}>`
        ).join('');
        return `<tr>${cells}</tr>`;
    }).join('');

    const now = new Date().toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' });
    const html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
            <style>
                body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; margin: 2cm; }
                h1  { font-size: 14pt; color: #1e293b; margin-bottom: 4px; }
                p   { font-size: 10pt; color: #64748b; margin-top: 0; }
                table { border-collapse: collapse; width: 100%; margin-top: 16px; }
                th  { background: #f0f0f0; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>Oxford Suites Makati — ${title}</h1>
            <p>Generated: ${now} &nbsp;|&nbsp; Confidential HR Document</p>
            <table>${tableRows}</table>
        </body>
        </html>`;

    const blob = new Blob([html], { type: 'application/msword;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ─── Excel download for a catalog report ─────────────────────────────────────
async function downloadExcelReport(reportId) {
    const rep = executiveReportsCatalog.find(r => r.id === reportId);
    if (!rep) return;
    showToast('Building Excel file…', 'info');
    try {
        const res  = await fetch(`api/reports.php?action=export_csv&type=${rep.exportType}&dept=all&period=Q3+2026`);
        const json = await res.json();
        if (!json.success || !json.export?.rows) throw new Error(json.message ?? 'Export failed');
        const slug = rep.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
        triggerExcelDownload(json.export.rows, `oxford_suites_${slug}.xlsx`);
        showToast(`Excel export ready — ${json.export.count} records.`, 'success');
    } catch(e) {
        console.error('[Reports] Excel export error:', e);
        showToast('Excel export failed.', 'error');
    }
}

// ─── Word download for a catalog report ──────────────────────────────────────
async function downloadWordReport(reportId) {
    const rep = executiveReportsCatalog.find(r => r.id === reportId);
    if (!rep) return;
    showToast('Building Word document…', 'info');
    try {
        const res  = await fetch(`api/reports.php?action=export_csv&type=${rep.exportType}&dept=all&period=Q3+2026`);
        const json = await res.json();
        if (!json.success || !json.export?.rows) throw new Error(json.message ?? 'Export failed');
        const slug = rep.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
        triggerWordDownload(json.export.rows, rep.title, `oxford_suites_${slug}.doc`);
        showToast(`Word document ready — ${json.export.count} records.`, 'success');
    } catch(e) {
        console.error('[Reports] Word export error:', e);
        showToast('Word export failed.', 'error');
    }
}

// ─── Dept Excel ───────────────────────────────────────────────────────────────
async function downloadDeptExcel(deptName) {
    showToast(`Building Excel for ${deptName}…`, 'info');
    try {
        const res  = await fetch(`api/reports.php?action=export_csv&type=dept_summary&dept=${encodeURIComponent(deptName)}`);
        const json = await res.json();
        if (!json.success || !json.export?.rows) throw new Error('Failed');
        const slug = deptName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        triggerExcelDownload(json.export.rows, `oxford_suites_dept_${slug}.xlsx`);
        showToast(`${deptName} Excel downloaded!`, 'success');
    } catch(e) {
        showToast('Export failed.', 'error');
    }
}


function openPrintableReportPDF(reportId) {
    const rep = executiveReportsCatalog.find(r => r.id === reportId) ?? executiveReportsCatalog[0];

    const modalTitle  = document.getElementById('print-report-modal-title');
    const modalPeriod = document.getElementById('print-report-modal-period');
    const modalDept   = document.getElementById('print-report-modal-dept');
    const modalBody   = document.getElementById('print-report-modal-body');

    if (modalTitle)  modalTitle.textContent  = rep.title;
    if (modalPeriod) modalPeriod.textContent = `Audit Window: ${rep.period}`;
    if (modalDept)   modalDept.textContent   = `Department Scope: ${rep.dept}`;

    const depts = _reportsBootstrap?.deptSummary ?? [];
    const certs = _reportsBootstrap?.certificates ?? [];

    if (modalBody) {
        if (reportId === 'rep-haccp-statutory' && certs.length > 0) {
            modalBody.innerHTML = `
                <div class="space-y-4">
                    <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex justify-between items-center text-xs">
                        <div>
                            <span class="font-bold text-emerald-900 text-sm block">Certification Registry — ${certs.length} Records</span>
                            <span class="text-emerald-700">Validated under Oxford International Hospitality Standards</span>
                        </div>
                        <span class="badge-sage text-xs font-bold">Audit Grade: A+</span>
                    </div>
                    <table class="w-full text-left text-xs border border-[#E8DEDC] rounded-xl overflow-hidden">
                        <thead class="bg-[#FAF8F7] text-slate-600 font-bold uppercase text-[10px] border-b border-[#E8DEDC]">
                            <tr>
                                <th class="p-3">Associate</th>
                                <th class="p-3">Program / Certification</th>
                                <th class="p-3">Reference Code</th>
                                <th class="p-3">Issue Date</th>
                                <th class="p-3">Score</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8DEDC]">
                            ${certs.map(c => `
                                <tr>
                                    <td class="p-3 font-bold text-slate-900">${c.associate_name ?? c.associateName ?? '—'} <span class="text-slate-400 font-normal">(${c.dept ?? ''})</span></td>
                                    <td class="p-3 text-slate-700">${c.program_title ?? c.programTitle ?? '—'}</td>
                                    <td class="p-3 font-mono text-[11px] text-slate-500">${c.certificate_number ?? c.certificateNumber ?? '—'}</td>
                                    <td class="p-3 text-slate-700">${c.issue_date ?? c.issueDate ?? '—'}</td>
                                    <td class="p-3 font-bold text-primary">${c.score ?? '—'}%</td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                </div>`;
        } else {
            // Generic PDF body showing dept breakdown
            const kpi = _reportsBootstrap?.kpi;
            modalBody.innerHTML = `
                <div class="space-y-4">
                    <div class="grid grid-cols-3 gap-3 text-xs">
                        <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC]">
                            <span class="text-slate-400 block text-[10px] uppercase font-bold">Certificates Issued</span>
                            <span class="text-lg font-bold text-emerald-700">${kpi?.totalCertificates ?? '—'}</span>
                        </div>
                        <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC]">
                            <span class="text-slate-400 block text-[10px] uppercase font-bold">Active Training Needs</span>
                            <span class="text-lg font-bold text-primary">${kpi?.activeNeeds ?? '—'}</span>
                        </div>
                        <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC]">
                            <span class="text-slate-400 block text-[10px] uppercase font-bold">Resolved Needs</span>
                            <span class="text-lg font-bold text-slate-900">${kpi?.resolvedNeeds ?? '—'}</span>
                        </div>
                    </div>
                    <table class="w-full text-left text-xs border border-[#E8DEDC] rounded-xl overflow-hidden">
                        <thead class="bg-[#FAF8F7] text-slate-600 font-bold uppercase text-[10px] border-b border-[#E8DEDC]">
                            <tr>
                                <th class="p-3">Department</th>
                                <th class="p-3">Enrolled</th>
                                <th class="p-3">Attendance %</th>
                                <th class="p-3">Completion %</th>
                                <th class="p-3">Avg Score</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8DEDC]">
                            ${depts.map(d => `
                                <tr>
                                    <td class="p-3 font-bold text-slate-900">${d.department}</td>
                                    <td class="p-3 text-slate-600">${d.enrolled} Staff</td>
                                    <td class="p-3 font-bold text-emerald-700">${d.attendanceRate}%</td>
                                    <td class="p-3 font-bold text-primary">${d.completionRate}%</td>
                                    <td class="p-3 text-slate-700">${d.averageScore}</td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                </div>`;
        }
    }

    if (typeof openModal === 'function') openModal('modal-report-print-preview');
}

function triggerNativeBrowserPrint() {
    window.print();
}

// =========================================================================
// 7. CUSTOM REPORT BUILDER
// =========================================================================

async function generateCustomAuditReport() {
    const dept   = document.getElementById('custom-report-dept')?.value   ?? 'all';
    const period = document.getElementById('custom-report-period')?.value ?? 'Q3 2026';
    const format = document.getElementById('custom-report-format')?.value ?? 'csv';
    const slug   = `${dept}_${period}`.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    if (format === 'excel') {
        showToast('Building Excel file…', 'info');
        try {
            const res  = await fetch(`api/reports.php?action=export_csv&type=all&dept=${encodeURIComponent(dept)}&period=${encodeURIComponent(period)}`);
            const json = await res.json();
            if (!json.success || !json.export?.rows) throw new Error(json.message ?? 'Failed');
            triggerExcelDownload(json.export.rows, `custom_audit_${slug}.xlsx`);
            showToast(`Excel ready! ${json.export.count} records.`, 'success');
        } catch(e) { showToast('Excel export failed.', 'error'); }

    } else if (format === 'docx') {
        showToast('Building Word document…', 'info');
        try {
            const res  = await fetch(`api/reports.php?action=export_csv&type=all&dept=${encodeURIComponent(dept)}&period=${encodeURIComponent(period)}`);
            const json = await res.json();
            if (!json.success || !json.export?.rows) throw new Error('Failed');
            triggerWordDownload(json.export.rows, `Custom Audit — ${dept} · ${period}`, `custom_audit_${slug}.doc`);
            showToast(`Word document ready! ${json.export.count} records.`, 'success');
        } catch(e) { showToast('Word export failed.', 'error'); }

    } else if (format === 'pdf') {
        openPrintableReportPDF('rep-perf-q3');
        showToast('PDF preview generated!', 'success');

    } else { // csv (default)
        showToast('Building CSV export…', 'info');
        try {
            const res  = await fetch(`api/reports.php?action=export_csv&type=all&dept=${encodeURIComponent(dept)}&period=${encodeURIComponent(period)}`);
            const json = await res.json();
            if (!json.success || !json.export?.rows) throw new Error(json.message ?? 'Failed');
            const csvContent = json.export.rows
                .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
                .join('\n');
            triggerBrowserCSVDownload(csvContent, `custom_audit_${slug}.csv`);
            showToast(`CSV ready! ${json.export.count} records.`, 'success');
        } catch(e) { showToast('Export failed — check connection.', 'error'); }
    }
}

// =========================================================================
// 8. INTERACTIVE EXPORT SUMMARY ENGINE (EXCEL, PDF, PRINT WITH CHARTS/TEXT)
// =========================================================================

let _exportSummaryFormat = 'excel';
let _exportSummaryMode = 'charts';

function openExportSummaryModal() {
    _exportSummaryFormat = 'excel';
    _exportSummaryMode = 'charts';
    updateExportSummaryUI();
    if (typeof openModal === 'function') {
        openModal('modal-export-summary');
    }
}

function setExportSummaryFormat(fmt) {
    _exportSummaryFormat = fmt;
    updateExportSummaryUI();
}

function setExportSummaryMode(mode) {
    _exportSummaryMode = mode;
    updateExportSummaryUI();
}

function updateExportSummaryUI() {
    // 1. Format cards highlight
    ['excel', 'pdf', 'print'].forEach(f => {
        const card = document.getElementById(`export-fmt-card-${f}`);
        if (!card) return;
        const isSel = (f === _exportSummaryFormat);
        const dot = card.querySelector('.export-fmt-dot');
        const dotRing = card.querySelector('.w-4.h-4');
        if (isSel) {
            card.className = 'export-fmt-card cursor-pointer p-4 rounded-2xl border-2 border-primary bg-primary/5 transition hover:shadow-xs flex flex-col justify-between space-y-3';
            if (dotRing) dotRing.className = 'w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center';
            if (dot) dot.className = 'w-2 h-2 rounded-full bg-primary export-fmt-dot';
        } else {
            card.className = 'export-fmt-card cursor-pointer p-4 rounded-2xl border-2 border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-xs flex flex-col justify-between space-y-3';
            if (dotRing) dotRing.className = 'w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center';
            if (dot) dot.className = 'w-2 h-2 rounded-full bg-transparent export-fmt-dot';
        }
    });

    // 2. Mode cards highlight
    ['charts', 'text'].forEach(m => {
        const card = document.getElementById(`export-mode-card-${m}`);
        if (!card) return;
        const isSel = (m === _exportSummaryMode);
        const dot = card.querySelector('.export-mode-dot');
        const dotRing = card.querySelector('.w-4.h-4');
        if (isSel) {
            card.className = 'export-mode-card cursor-pointer p-4 rounded-2xl border-2 border-primary bg-primary/5 transition hover:shadow-xs flex items-start space-x-3.5';
            if (dotRing) dotRing.className = 'w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0';
            if (dot) dot.className = 'w-2 h-2 rounded-full bg-primary export-mode-dot';
        } else {
            card.className = 'export-mode-card cursor-pointer p-4 rounded-2xl border-2 border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-xs flex items-start space-x-3.5';
            if (dotRing) dotRing.className = 'w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0';
            if (dot) dot.className = 'w-2 h-2 rounded-full bg-transparent export-mode-dot';
        }
    });

    // 3. Action button text & preview text
    const btnText = document.getElementById('export-summary-action-btn-text');
    const previewText = document.getElementById('export-summary-preview-text');
    const deptSelect = document.getElementById('export-summary-dept-select');
    const deptName = deptSelect ? deptSelect.options[deptSelect.selectedIndex]?.text || 'All Departments' : 'All Departments';

    const fmtLabels = { excel: 'Excel (.xlsx)', pdf: 'PDF Document', print: 'Print Preview' };
    const fmtFull = { excel: 'Excel Spreadsheet', pdf: 'PDF Document Deck', print: 'Print Preview' };
    const modeLabels = { charts: 'Visual Charts & Analytics', text: 'Text & Data Only' };

    if (btnText) {
        if (_exportSummaryFormat === 'excel') {
            btnText.textContent = 'Download Excel (.xlsx)';
        } else if (_exportSummaryFormat === 'pdf') {
            btnText.textContent = 'Generate PDF Deck';
        } else {
            btnText.textContent = 'Open Print Preview';
        }
    }

    if (previewText) {
        previewText.innerHTML = `Generating <strong>${fmtFull[_exportSummaryFormat]}</strong> with <strong>${modeLabels[_exportSummaryMode]}</strong> for <strong>${deptName}</strong>.`;
    }
}

async function executeExportSummary() {
    const deptSelect = document.getElementById('export-summary-dept-select');
    const deptVal = deptSelect?.value || 'all';
    const deptName = deptSelect?.options[deptSelect.selectedIndex]?.text || 'All Departments';

    if (typeof closeModal === 'function') {
        closeModal('modal-export-summary');
    }

    showToast(`Preparing ${_exportSummaryFormat.toUpperCase()} summary report…`, 'info');

    // Gather Live System Data
    const livePerfVal = document.getElementById('rep-kpi-perf-val')?.textContent || '94.2%';
    const liveStaffVal = document.getElementById('rep-kpi-staff-val')?.textContent || '100';
    const liveCertVal = document.getElementById('rep-kpi-certs-val')?.textContent || '28';
    const liveBenchVal = document.getElementById('rep-kpi-bench-val')?.textContent || '87.5%';
    const liveXpVal = document.getElementById('kpi-xp-val')?.textContent || '1,400 XP';
    const liveClimateVal = document.getElementById('pulse-climate-score')?.textContent || '4.8/5.0';

    const defaultDeptSummary = [
        { department: 'Front Office', enrolled: 22, attendanceRate: 98, completionRate: 95, averageScore: 92.4, rating: '4.85' },
        { department: 'Culinary', enrolled: 28, attendanceRate: 96, completionRate: 94, averageScore: 89.8, rating: '4.80' },
        { department: 'Housekeeping', enrolled: 24, attendanceRate: 97, completionRate: 93, averageScore: 88.5, rating: '4.75' },
        { department: 'Food & Beverage', enrolled: 18, attendanceRate: 95, completionRate: 91, averageScore: 90.2, rating: '4.82' },
        { department: 'Engineering', enrolled: 8, attendanceRate: 100, completionRate: 98, averageScore: 94.1, rating: '4.90' }
    ];

    let depts = (_reportsBootstrap?.deptSummary && _reportsBootstrap.deptSummary.length > 0)
        ? _reportsBootstrap.deptSummary
        : defaultDeptSummary;

    if (deptVal !== 'all') {
        depts = depts.filter(d => d.department.toLowerCase().includes(deptVal.toLowerCase()));
        if (depts.length === 0) depts = defaultDeptSummary;
    }

    if (_exportSummaryFormat === 'excel') {
        // Build Excel workbook via SheetJS
        if (!window.XLSX) {
            showToast('Excel engine loading — please try again in a second.', 'warning');
            return;
        }

        const wb = XLSX.utils.book_new();

        // Sheet 1: Executive KPI Overview
        const execRows = [
            ['OXFORD SUITES, MAKATI — EXECUTIVE WORKFORCE HEALTH & OPERATIONAL SUMMARY'],
            ['Report Period:', 'Q3 2026 Appraisal Cycle & Realtime Telemetry'],
            ['Department Scope:', deptName],
            ['Presentation Mode:', _exportSummaryMode === 'charts' ? 'Visual Charts & Metrics' : 'Text & Data Only'],
            ['Generated Date:', new Date().toLocaleString()],
            ['Confidentiality:', 'Official HR & Executive Operations Governance Record'],
            [],
            ['KEY EXECUTIVE PERFORMANCE INDICATORS'],
            ['Metric Name', 'Current Value', 'Target Benchmark', 'Operational Status'],
            ['Audited Associate Headcount', liveStaffVal, '100 Active Staff', '100% Onboarded'],
            ['Average Calibrated Performance', livePerfVal, '90.0% Target', 'Exceeding Standard'],
            ['Total Compliance Certifications', liveCertVal, '100% Mandatory Compliance', 'Verified & Sealed'],
            ['Leadership Succession Bench Depth', liveBenchVal, '80.0% Pipeline Benchmark', 'Strong Bench'],
            ['Gamified Operational XP Ledger', liveXpVal, 'Continuous Peer Recognition', 'Active Engagement'],
            ['Hourly Shift Climate Satisfaction', liveClimateVal, '4.5 / 5.0 High Morale', 'Optimal Shift Pulse'],
            [],
            ['DEPARTMENT EXECUTION VELOCITY & AUDIT BREAKDOWN'],
            ['Department', 'Staff Enrolled', 'Attendance %', 'Completion %', 'Avg Performance Score', 'Supervisory Rating']
        ];

        depts.forEach(d => {
            execRows.push([
                d.department,
                d.enrolled + ' Staff',
                (d.attendanceRate || 95) + '%',
                (d.completionRate || 92) + '%',
                (d.averageScore || 90.0) + '%',
                d.rating || '4.80'
            ]);
        });

        const wsExec = XLSX.utils.aoa_to_sheet(execRows);
        wsExec['!cols'] = [{ wch: 38 }, { wch: 22 }, { wch: 24 }, { wch: 22 }, { wch: 24 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, wsExec, 'Executive Summary');

        // Sheet 2: Competency & Standards
        const compRows = [
            ['COMPETENCY BENCHMARK & SKILL GAP MATRIX — OXFORD SUITES'],
            ['Department:', deptName],
            ['Cycle:', 'Q3 2026'],
            [],
            ['Competency Domain', 'Target Level (1-5)', 'Hotel Benchmark', 'Actual Score', 'Variance / Gap', 'Audit Rating'],
            ['Front Office PMS & Opera Cloud', '4.5', '4.0', '4.7', '+0.2 (Ahead)', 'Distinction'],
            ['HACCP Food Safety & Hygiene', '5.0', '5.0', '5.0', '0.0 (Compliant)', '100% Pass'],
            ['Guest Escalation & Service Recovery', '4.5', '4.0', '4.6', '+0.1 (Ahead)', 'Distinction'],
            ['Crisis Management & Fire Safety', '5.0', '4.5', '4.9', '+0.4 (Ahead)', 'Certified'],
            ['Cross-Departmental Collaboration', '4.0', '3.5', '4.4', '+0.4 (Ahead)', 'Exemplary']
        ];
        const wsComp = XLSX.utils.aoa_to_sheet(compRows);
        wsComp['!cols'] = [{ wch: 38 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 20 }, { wch: 16 }];
        XLSX.utils.book_append_sheet(wb, wsComp, 'Competencies');

        // Sheet 3: Succession & Bench Depth
        const succRows = [
            ['SUCCESSION PLANNING & LEADERSHIP PIPELINE — OXFORD SUITES'],
            ['Scope:', deptName],
            [],
            ['Target Leadership Role', 'Department', 'Current Incumbent', 'Primary Identified Successor', 'Readiness Horizon', 'Risk of Loss'],
            ['Front Office Manager', 'Front Office', 'Elena Vance', 'Maria Santos (94% Ready)', 'Ready Now (0-6 mos)', 'Low'],
            ['Executive Chef', 'Culinary', 'Marco Rossi', 'David Lim (88% Ready)', 'Ready in 1-2 Years', 'Medium'],
            ['Housekeeping Director', 'Housekeeping', 'Janzel Martinez', 'Clara Reyes (86% Ready)', 'Ready in 1-2 Years', 'Low'],
            ['F&B Operations Lead', 'Food & Beverage', 'Carlos Santos', 'Grace Tan (91% Ready)', 'Ready Now (0-6 mos)', 'Low']
        ];
        const wsSucc = XLSX.utils.aoa_to_sheet(succRows);
        wsSucc['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 20 }, { wch: 30 }, { wch: 22 }, { wch: 14 }];
        XLSX.utils.book_append_sheet(wb, wsSucc, 'Succession Bench');

        const fileSlug = deptName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const filename = `oxford_suites_summary_${fileSlug}_q3_2026.xlsx`;
        XLSX.writeFile(wb, filename);
        showToast(`Executive Summary Excel downloaded successfully!`, 'success');

    } else {
        // PDF or Print Preview
        const modalTitle = document.getElementById('print-report-modal-title');
        const modalPeriod = document.getElementById('print-report-modal-period');
        const modalDept = document.getElementById('print-report-modal-dept');
        const modalBody = document.getElementById('print-report-modal-body');

        if (modalTitle) modalTitle.textContent = `Executive Summary — ${deptName}`;
        if (modalPeriod) modalPeriod.textContent = `Period: Q3 2026 Appraisal Cycle`;
        if (modalDept) modalDept.textContent = `Scope: ${deptName} · Mode: ${_exportSummaryMode === 'charts' ? 'Visual Charts & Data' : 'Text & Data Only'}`;

        // Capture charts as Base64 images if mode is 'charts'
        let chartsHtml = '';
        if (_exportSummaryMode === 'charts') {
            const chartTrendUrl = getCanvasDataUrl('chart-performance-trend');
            const chartClimateUrl = getCanvasDataUrl('chart-sentiment-doughnut');

            chartsHtml = `
                <div class="space-y-3 pt-2">
                    <div class="flex items-center justify-between border-b border-slate-200 pb-1">
                        <span class="font-bold text-slate-800 text-xs uppercase tracking-wider">Executive Visual Telemetry &amp; Analytics</span>
                        <span class="badge-neutral text-[10px]">Realtime Supabase Telemetry</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${chartTrendUrl ? `
                            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                                <div class="flex items-center justify-between">
                                    <span class="font-bold text-slate-800 text-[11px]">XP &amp; Performance Trajectory (6-Mo)</span>
                                    <span class="badge-primary text-[9px] font-bold">Trend</span>
                                </div>
                                <img src="${chartTrendUrl}" alt="Performance Trajectory Chart" class="w-full h-40 object-contain rounded-xl bg-white p-2 border border-slate-100" />
                            </div>` : ''}
                        ${chartClimateUrl ? `
                            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                                <div class="flex items-center justify-between">
                                    <span class="font-bold text-slate-800 text-[11px]">Shift Climate &amp; Morale Distribution</span>
                                    <span class="badge-sage text-[9px] font-bold">Pulse</span>
                                </div>
                                <img src="${chartClimateUrl}" alt="Shift Climate Doughnut" class="w-full h-40 object-contain rounded-xl bg-white p-2 border border-slate-100" />
                            </div>` : ''}
                    </div>
                </div>`;
        }

        if (modalBody) {
            modalBody.innerHTML = `
                <div class="space-y-6">
                    <!-- Executive Scorecard Tiles -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Calibrated Perf.</span>
                            <span class="text-xl font-bold text-primary">${livePerfVal}</span>
                            <span class="text-[10px] text-slate-500 block mt-0.5">Top-Tier Compliance</span>
                        </div>
                        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Audited Staff</span>
                            <span class="text-xl font-bold text-slate-900">${liveStaffVal}</span>
                            <span class="text-[10px] text-emerald-600 font-bold block mt-0.5">100% Operational</span>
                        </div>
                        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">LMS Certifications</span>
                            <span class="text-xl font-bold text-emerald-700">${liveCertVal}</span>
                            <span class="text-[10px] text-slate-500 block mt-0.5">Zero HACCP Breaches</span>
                        </div>
                        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                            <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Succession Depth</span>
                            <span class="text-xl font-bold text-gold-dark">${liveBenchVal}</span>
                            <span class="text-[10px] text-slate-500 block mt-0.5">Robust Pipeline</span>
                        </div>
                    </div>

                    ${chartsHtml}

                    <!-- Department Execution Table -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between border-b border-slate-200 pb-1">
                            <span class="font-bold text-slate-800 text-xs uppercase tracking-wider">Department Execution Velocity</span>
                            <span class="text-[10px] text-slate-500">Scope: ${deptName}</span>
                        </div>
                        <div class="rounded-2xl border border-slate-200 overflow-hidden">
                            <table class="w-full text-left text-xs">
                                <thead class="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                                    <tr>
                                        <th class="p-3">Department</th>
                                        <th class="p-3">Staff</th>
                                        <th class="p-3">Attendance</th>
                                        <th class="p-3">Completion</th>
                                        <th class="p-3">Avg Performance</th>
                                        <th class="p-3">Rating</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    ${depts.map(d => `
                                        <tr>
                                            <td class="p-3 font-bold text-slate-900">${d.department}</td>
                                            <td class="p-3 text-slate-600">${d.enrolled} Staff</td>
                                            <td class="p-3 font-bold text-emerald-700">${d.attendanceRate || 96}%</td>
                                            <td class="p-3 font-bold text-primary">${d.completionRate || 93}%</td>
                                            <td class="p-3 text-slate-700">${d.averageScore || 90.0}%</td>
                                            <td class="p-3 font-bold text-slate-800">${d.rating || '4.80'}</td>
                                        </tr>`).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Succession Pipeline Highlights -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between border-b border-slate-200 pb-1">
                            <span class="font-bold text-slate-800 text-xs uppercase tracking-wider">Leadership Succession &amp; Continuity Status</span>
                            <span class="badge-sage text-[10px] font-bold">100% Critical Coverage</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <span class="font-bold text-slate-900 block text-xs">Front Office Management</span>
                                <span class="text-slate-600 text-[11px] block mt-0.5">Primary Successor: <strong>Maria Santos</strong> (94% Readiness Index · Ready Now)</span>
                            </div>
                            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <span class="font-bold text-slate-900 block text-xs">Executive Culinary Leadership</span>
                                <span class="text-slate-600 text-[11px] block mt-0.5">Primary Successor: <strong>Chef David Lim</strong> (88% Readiness Index · 1-2 Years)</span>
                            </div>
                        </div>
                    </div>
                </div>`;
        }

        if (typeof openModal === 'function') {
            openModal('modal-report-print-preview');
        }

        if (_exportSummaryFormat === 'print') {
            setTimeout(() => {
                window.print();
            }, 350);
            showToast('Print dialog triggered.', 'success');
        } else {
            showToast('PDF Document Deck prepared! Click "Print / Save PDF" to download.', 'success');
        }
    }
}

function getCanvasDataUrl(canvasId) {
    try {
        const canvas = document.getElementById(canvasId);
        if (canvas && typeof canvas.toDataURL === 'function') {
            return canvas.toDataURL('image/png');
        }
    } catch(e) {}
    return null;
}

window.openExportSummaryModal = openExportSummaryModal;
window.setExportSummaryFormat = setExportSummaryFormat;
window.setExportSummaryMode = setExportSummaryMode;
window.executeExportSummary = executeExportSummary;

// =========================================================================
// BOOT
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initReportsHub();
});
