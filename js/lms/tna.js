/**
 * Oxford Suites, Makati — Learning Management System (LMS)
 * Sub-Module: Training Needs Analysis (TNA), Quiz Roster & Compliance Audits
 */

// Load initial TNA & Prescriptions cache from sessionStorage for 0ms instant startup
try {
    const cachedPrescribed = sessionStorage.getItem('lms_prescribed_cache');
    if (cachedPrescribed && (!window.dynamicLmsState.prescribed || window.dynamicLmsState.prescribed.length === 0)) {
        window.dynamicLmsState.prescribed = JSON.parse(cachedPrescribed);
    }
} catch (e) {}

/**
 * Render Associate Learning Progress Summary Metrics
 */
function renderTnaProgressSummary(roster = []) {
    const statEnrolled = document.getElementById('tna-stat-enrolled');
    const statPassed = document.getElementById('tna-stat-passed');
    const statPassedRatio = document.getElementById('tna-stat-passed-ratio');
    const statProgAvg = document.getElementById('tna-stat-progress-avg');
    const statProgBar = document.getElementById('tna-stat-progress-bar');
    const statScoreAvg = document.getElementById('tna-stat-score-avg');
    const statScoreTier = document.getElementById('tna-stat-score-tier');

    const total = roster.length;
    if (total === 0) {
        if (statEnrolled) statEnrolled.textContent = '0';
        if (statPassed) statPassed.textContent = '0';
        if (statPassedRatio) statPassedRatio.textContent = '0% Passed';
        if (statProgAvg) statProgAvg.textContent = '0%';
        if (statProgBar) statProgBar.style.width = '0%';
        if (statScoreAvg) statScoreAvg.textContent = '0%';
        if (statScoreTier) statScoreTier.textContent = 'No Quizzes Yet';
        return;
    }

    const passedCount = roster.filter(r => (r.status || '').toLowerCase() === 'passed').length;
    const passedPct = Math.round((passedCount / total) * 100);
    
    let totalProg = 0;
    let totalScores = 0;
    let attemptCount = 0;

    roster.forEach(r => {
        totalProg += Number(r.progress || 0);
        const sc = Number(r.quizScore || r.scores || 0);
        if (sc > 0) {
            totalScores += sc;
            attemptCount++;
        }
    });

    const avgProg = Math.round(totalProg / total);
    const avgScore = attemptCount > 0 ? Math.round(totalScores / attemptCount) : 0;

    let tierLabel = 'Needs Retake';
    if (avgScore >= 85) tierLabel = 'Mastery (Gold Tier)';
    else if (avgScore >= 75) tierLabel = 'Proficient (Passing)';
    else if (avgScore > 0) tierLabel = 'Developing Tier';
    else tierLabel = 'Not Attempted';

    if (statEnrolled) statEnrolled.textContent = String(total);
    if (statPassed) statPassed.textContent = String(passedCount);
    if (statPassedRatio) statPassedRatio.textContent = `${passedPct}% Passed`;
    if (statProgAvg) statProgAvg.textContent = `${avgProg}%`;
    if (statProgBar) statProgBar.style.width = `${avgProg}%`;
    if (statScoreAvg) statScoreAvg.textContent = `${avgScore}%`;
    if (statScoreTier) statScoreTier.textContent = tierLabel;
}
window.renderTnaProgressSummary = renderTnaProgressSummary;

async function fetchNeedsAnalysisData() {
    renderTnaProgressSummary(window.dynamicLmsState?.prescribed || []);
}
window.fetchNeedsAnalysisData = fetchNeedsAnalysisData;

// Auto-initialize LMS on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    if (typeof loadLmsDepartments === 'function') loadLmsDepartments();
    if (typeof fetchDynamicLmsDocuments === 'function') await fetchDynamicLmsDocuments();
    if (typeof fetchPrescribedLms === 'function') await fetchPrescribedLms();
    renderTnaEnrollments();
    if (typeof initLmsDropzone === 'function') initLmsDropzone();
});

// Also trigger if page already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (typeof loadLmsDepartments === 'function') loadLmsDepartments();
    if (typeof fetchDynamicLmsDocuments === 'function') fetchDynamicLmsDocuments();
    if (typeof fetchPrescribedLms === 'function') fetchPrescribedLms().then(() => renderTnaEnrollments());
}

// ========================================================
// LMS NEEDS ANALYSIS (TNA) ROSTER & QUIZ POINTS PROGRESS
// ========================================================
let currentReevalEnrollmentId = null;

function renderTnaEnrollmentsTableRows() {
    const tbody = document.getElementById('tna-enrollments-table-body');
    if (!tbody) return;

    const dbRecords = window.dynamicLmsState.prescribed || [];
    
    // Map db records strictly from public.lms_prescribed database table
    const mappedDb = dbRecords.map(item => {
        const progress = typeof item.progress === 'number' ? item.progress : 0;
        const scores = typeof item.scores === 'number' ? item.scores : 0;
        const ratings = typeof item.ratings === 'number' ? item.ratings : 0;
        const statusStr = item.status || 'Needs Retake';
        const isPassed = statusStr.toLowerCase() === 'passed';
        
        let statusClass = 'bg-amber-100 text-amber-800 border-amber-200';
        if (isPassed) statusClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
        else if (statusStr.toLowerCase().includes('progress')) statusClass = 'bg-blue-100 text-blue-800 border-blue-200';

        return {
            id: item.id,
            employeeId: item.employee,
            empName: item.employee_name || (item.employee === 'emp-101' ? 'Maria Santos' : (item.employee === 'emp-102' ? 'Antonio Silva' : (item.employee === 'emp-103' ? 'John Marco' : item.employee))),
            empRole: item.employee_title || 'Associate',
            empDept: item.document_department || 'Property-Wide',
            empAvatar: item.employee_avatar || 'public/images/removed-bg-logo.png',
            bookId: item.lms_id,
            bookTitle: item.document_title || 'SOP Handbook',
            bookDept: item.document_department || 'Property-Wide',
            quizScore: scores,
            quizMax: 100,
            progress: progress,
            status: statusStr,
            statusClass: statusClass,
            evalRating: ratings,
            targetRating: 4.00,
            lastAttempt: item.last_attempt ? new Date(item.last_attempt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not Started',
            attemptCount: item.last_attempt ? 1 : 0,
            forType: item.for || 'both',
            notes: `Enrolled via lms_prescribed (For: ${item.for || 'both'})`
        };
    });

    const userRole = (window.currentUser?.role || window.activePersonaRole || '').toLowerCase();
    const currentUserId = (window.currentUser?.id || 'emp-101').toLowerCase();
    const isSupervisorOrManager = userRole.includes('supervisor') || userRole.includes('manager') || userRole.includes('admin') || userRole.includes('hr') || userRole.includes('executive');

    let allRoster = mappedDb;
    if (!isSupervisorOrManager) {
        allRoster = allRoster.filter(r => {
            const eId = (r.employeeId || '').toLowerCase();
            const eName = (r.empName || '').toLowerCase();
            return eId === currentUserId ||
                (currentUserId === 'emp-101' && (eId.includes('101') || eId.includes('maria') || eName.includes('maria'))) ||
                (currentUserId === 'emp-102' && (eId.includes('102') || eId.includes('antonio') || eName.includes('antonio')));
        });
    }

    if (allRoster.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="py-12 text-center text-slate-400">
                    <i class="fas fa-clipboard-list text-3xl text-slate-300 mb-2 block"></i>
                    <p class="text-sm font-semibold text-slate-600">No Prescribed LMS Records Found</p>
                    <p class="text-xs text-slate-400 mt-1">Prescribed learning modules and associate quiz records will appear here.</p>
                </td>
            </tr>
        `;
        renderTnaProgressSummary([]);
        return;
    }

    tbody.innerHTML = allRoster.map((row, idx) => {
        const isPassed = (row.status || '').toLowerCase() === 'passed';
        const progressPct = row.progress || 0;
        const quizBadge = row.quizScore > 0 ? `${row.quizScore}%` : 'Not Attempted';
        const quizClass = isPassed ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-600 bg-slate-50 border-slate-200';

        return `
            <tr class="hover:bg-slate-50/70 transition border-b border-slate-100 last:border-0 text-xs">
                <td class="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">${idx + 1}</td>
                <td class="py-3 px-3">
                    <div class="flex items-center space-x-2.5">
                        <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                            ${row.empName.charAt(0)}
                        </div>
                        <div>
                            <div class="font-bold text-slate-900 text-xs">${row.empName}</div>
                            <div class="text-[10px] text-slate-400 font-mono">${row.empRole} · ${row.empDept}</div>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-3">
                    <div class="font-semibold text-slate-800 text-xs max-w-xs truncate" title="${row.bookTitle}">${row.bookTitle}</div>
                    <div class="text-[10px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                        <span>${row.bookDept}</span>
                        <span>•</span>
                        <span class="text-primary font-medium">${row.notes}</span>
                    </div>
                </td>
                <td class="py-3 px-3">
                    <div class="flex items-center justify-between text-[11px] mb-1">
                        <span class="font-bold ${isPassed ? 'text-emerald-600' : 'text-slate-700'}">${quizBadge}</span>
                        <span class="text-slate-400 text-[10px]">${progressPct}% Complete</span>
                    </div>
                    <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-300 ${isPassed ? 'bg-emerald-500' : 'bg-primary'}" style="width: ${progressPct}%"></div>
                    </div>
                </td>
                <td class="py-3 px-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.statusClass}">
                        ${row.status}
                    </span>
                </td>
                <td class="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    ${row.lastAttempt}
                </td>
                <td class="py-3 px-3 text-right">
                    <button onclick="openBookReader('${row.bookId}')" class="px-2.5 py-1 text-[11px] font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition border border-primary/20">
                        Launch SOP
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    renderTnaProgressSummary(allRoster);
}
window.renderTnaEnrollmentsTableRows = renderTnaEnrollmentsTableRows;

async function renderTnaEnrollments(forceRefresh = false) {
    const tbody = document.getElementById('tna-enrollments-table-body');
    if (!tbody) return;

    if (window.dynamicLmsState?.prescribed && window.dynamicLmsState.prescribed.length > 0) {
        renderTnaEnrollmentsTableRows();
    } else {
        tbody.innerHTML = [1, 2, 3].map(() => `
            <tr class="animate-pulse">
                <td class="py-3.5 px-3"><div class="h-4 w-4 bg-slate-200 rounded mx-auto"></div></td>
                <td class="py-3.5 px-3">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-xl bg-slate-200"></div>
                        <div class="space-y-1.5">
                            <div class="h-3 w-28 bg-slate-200 rounded"></div>
                            <div class="h-2.5 w-20 bg-slate-100 rounded"></div>
                        </div>
                    </div>
                </td>
                <td class="py-3.5 px-3">
                    <div class="h-3.5 w-44 bg-slate-200 rounded mb-1"></div>
                    <div class="h-2.5 w-24 bg-slate-100 rounded"></div>
                </td>
                <td class="py-3.5 px-3 w-48">
                    <div class="h-3 w-16 bg-slate-200 rounded mb-1.5"></div>
                    <div class="h-2 w-full bg-slate-200 rounded-full"></div>
                </td>
                <td class="py-3.5 px-3"><div class="h-5 w-20 bg-slate-200 rounded-full"></div></td>
                <td class="py-3.5 px-3"><div class="h-3 w-20 bg-slate-200 rounded"></div></td>
                <td class="py-3.5 px-3 text-right"><div class="h-7 w-20 bg-slate-200 rounded-xl ml-auto"></div></td>
            </tr>
        `).join('');
    }

    if (typeof fetchPrescribedLms === 'function' && (!window.dynamicLmsState?.prescribedFetched || forceRefresh)) {
        try {
            await fetchPrescribedLms();
            window.dynamicLmsState.prescribedFetched = true;
        } catch (e) {
            console.warn('Prescribed LMS fetch error:', e);
        }
    }
    renderTnaEnrollmentsTableRows();
}
window.renderTnaEnrollments = renderTnaEnrollments;

function filterTnaEnrollments() {
    const searchVal = (document.getElementById('tna-search-input')?.value || '').toLowerCase().trim();
    const bookVal = (document.getElementById('tna-book-filter')?.value || 'all').toLowerCase();
    const rows = document.querySelectorAll('#tna-enrollments-table-body tr');

    rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        const matchSearch = !searchVal || text.includes(searchVal);
        const matchBook = bookVal === 'all' || text.includes(bookVal.replace('book_', '').replace('_', ' '));
        r.style.display = (matchSearch && matchBook) ? '' : 'none';
    });
}
window.filterTnaEnrollments = filterTnaEnrollments;

function renderLmsComplianceAudit(prescribedList = []) {
    const totalCount = prescribedList.length;
    if (totalCount === 0) return;

    const completed = prescribedList.filter(p => (p.status || '').toLowerCase() === 'passed' || (p.progress || 0) >= 100).length;
    const inProgress = prescribedList.filter(p => (p.progress || 0) > 0 && (p.progress || 0) < 100).length;
    const pending = totalCount - completed - inProgress;

    const rateEl = document.getElementById('lms-compliance-rate');
    const compEl = document.getElementById('lms-audit-completed-count');
    const inProgEl = document.getElementById('lms-audit-inprogress-count');
    const pendEl = document.getElementById('lms-audit-pending-count');

    const ratePct = totalCount > 0 ? Math.round((completed / totalCount) * 100) : 0;

    if (rateEl) rateEl.textContent = `${ratePct}%`;
    if (compEl) compEl.textContent = completed;
    if (inProgEl) inProgEl.textContent = inProgress;
    if (pendEl) pendEl.textContent = pending;
}
window.renderLmsComplianceAudit = renderLmsComplianceAudit;

function openReevaluateModal(enrollmentId) {
    currentReevalEnrollmentId = enrollmentId;
    const dbRecords = window.dynamicLmsState.prescribed || [];
    const item = dbRecords.find(r => r.id === enrollmentId);
    if (!item) return;

    const empName = item.employee_name || item.employee;
    const docTitle = item.document_title || 'SOP Handbook';

    const empNameEl = document.getElementById('reeval-modal-emp-name');
    const bookTitleEl = document.getElementById('reeval-modal-book-title');
    const newRatingInput = document.getElementById('reeval-new-rating');

    if (empNameEl) empNameEl.textContent = empName;
    if (bookTitleEl) bookTitleEl.textContent = docTitle;
    if (newRatingInput) newRatingInput.value = item.ratings ? item.ratings.toFixed(2) : '3.80';

    openModal('modal-reevaluate-competency');
}
window.openReevaluateModal = openReevaluateModal;

async function submitCompetencyReevaluation() {
    if (!currentReevalEnrollmentId) return;

    const newRatingInput = document.getElementById('reeval-new-rating');
    const newRating = newRatingInput ? parseFloat(newRatingInput.value) : 4.00;

    const submitBtn = document.getElementById('btn-submit-reeval');
    const origHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Saving...';
    }

    try {
        const res = await fetch('api/lms.php?action=update_prescription_status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: currentReevalEnrollmentId,
                ratings: newRating,
                status: 'Passed',
                progress: 100
            })
        });
        const json = await res.json();
        if (json.success) {
            closeModal('modal-reevaluate-competency');
            if (typeof showToast === 'function') {
                showToast(`Competency rating successfully re-evaluated to ${newRating.toFixed(2)} / 5.0!`, 'success');
            }
            await fetchPrescribedLms();
            renderTnaEnrollments(true);
        } else {
            if (typeof showToast === 'function') {
                showToast(json.message || 'Failed to update re-evaluation.', 'error');
            }
        }
    } catch (err) {
        console.error('Error submitting re-evaluation:', err);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origHtml;
        }
    }
}
window.submitCompetencyReevaluation = submitCompetencyReevaluation;
