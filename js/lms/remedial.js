/**
 * Oxford Suites, Makati — Learning Management System (LMS)
 * Sub-Module: Remedial LMS Handbooks (< 3.0 Remedial) & Phase 6 IDP Drafting
 */

// ========================================================
// REMEDIAL LMS BOOKS MODAL HANDLERS (< 3.0 RATING)
// ========================================================
window.prescribedBooksPerAssociate = window.prescribedBooksPerAssociate || {};

let currentRemedialEmpId = 'emp-101';

// Load initial prescribed cache from sessionStorage for 0ms lookup
try {
    const cachedPres = sessionStorage.getItem('lms_prescribed_cache');
    if (cachedPres) {
        window.dynamicLmsState.prescribed = JSON.parse(cachedPres);
        (window.dynamicLmsState.prescribed || []).forEach(item => {
            const empKey = item.employee;
            if (empKey && item.lms_id) {
                window.prescribedBooksPerAssociate[empKey] = window.prescribedBooksPerAssociate[empKey] || [];
                if (!window.prescribedBooksPerAssociate[empKey].includes(item.lms_id)) {
                    window.prescribedBooksPerAssociate[empKey].push(item.lms_id);
                }
            }
        });
    }
} catch (e) {}

function resolveRemedialEmployee(empKeyOrId) {
    let targetId = empKeyOrId || window.selectedEvalEmpId || window.selectedEmployeeContext?.id;
    if (!targetId) {
        if (window.perfRoster && window.perfRoster.length > 0) {
            targetId = window.perfRoster[0].id;
        } else {
            targetId = 'emp-101';
        }
    }

    // Normalize aliases
    const k = targetId.toString().toLowerCase().trim();
    if (k === 'maria' || k === 'emp-1') targetId = 'emp-101';
    else if (k === 'antonio' || k === 'emp-2') targetId = 'emp-102';
    else if (k === 'lucas' || k === 'emp-3') targetId = 'emp-103';
    else if (k === 'chloe' || k === 'emp-4') targetId = 'emp-104';

    const emp = (window.perfRoster || []).find(e => typeof isSameEmployee === 'function' ? isSameEmployee(e.id, targetId) : e.id === targetId) ||
                (window.dbEmployees || []).find(e => typeof isSameEmployee === 'function' ? isSameEmployee(e.id, targetId) : e.id === targetId) ||
                { id: targetId, name: 'Associate', position: 'Associate', department: 'Operations' };

    return emp;
}

async function fetchPrescribedLms(empId = '') {
    try {
        const url = empId ? `api/lms.php?action=get_prescribed&employee=${encodeURIComponent(empId)}` : 'api/lms.php?action=get_prescribed';
        const res = await fetch(url);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
            window.dynamicLmsState.prescribed = json.data;
            try {
                sessionStorage.setItem('lms_prescribed_cache', JSON.stringify(json.data));
            } catch (e) {}
            json.data.forEach(item => {
                const empKey = item.employee;
                if (empKey && item.lms_id) {
                    window.prescribedBooksPerAssociate[empKey] = window.prescribedBooksPerAssociate[empKey] || [];
                    if (!window.prescribedBooksPerAssociate[empKey].includes(item.lms_id)) {
                        window.prescribedBooksPerAssociate[empKey].push(item.lms_id);
                    }
                }
            });
        }
    } catch (err) {
        console.error('Error fetching lms_prescribed:', err);
    }
}
window.fetchPrescribedLms = fetchPrescribedLms;

function isEmployeeEnrolledInLms(empId, lmsId, bookTitle = '') {
    if (!empId || (!lmsId && !bookTitle)) return false;
    const prescribed = window.dynamicLmsState.prescribed || [];
    const empStr = empId.toString().toLowerCase();
    const lmsStr = lmsId ? lmsId.toString() : '';
    const titleStr = (bookTitle || '').toLowerCase().trim();

    const inDb = prescribed.some(item => {
        const itemEmp = (item.employee || '').toString().toLowerCase();
        const matchEmp = typeof isSameEmployee === 'function' ? isSameEmployee(itemEmp, empStr) : (itemEmp === empStr);
        if (!matchEmp) return false;

        const itemLms = (item.lms_id || '').toString();
        const itemTitle = (item.document_title || '').toLowerCase().trim();
        return (lmsStr && itemLms === lmsStr) || (titleStr && itemTitle === titleStr);
    });

    if (inDb) return true;

    const list = [
        ...(window.prescribedBooksPerAssociate?.[empId] || []),
        ...(window.prescribedBooksPerAssociate?.[currentRemedialEmpId] || [])
    ];
    return lmsStr && list.includes(lmsStr);
}
window.isEmployeeEnrolledInLms = isEmployeeEnrolledInLms;

function updateRemedialAssociateSync(empKeyOrId) {
    const emp = resolveRemedialEmployee(empKeyOrId);
    currentRemedialEmpId = emp.id;
    window.selectedEvalEmpId = emp.id;

    const dbEvals = typeof getDbEvaluations === 'function' ? getDbEvaluations() : (window.dbEvaluations || []);
    const evalRec = dbEvals.find(ev => typeof isSameEmployee === 'function' ? isSameEmployee(ev.employee_id, emp.id) : ev.employee_id === emp.id) || emp.evaluationRecord;
    const isCalibrated = evalRec && (evalRec.status === 'Calibrated' || (evalRec.calibrated_score !== null && evalRec.calibrated_score !== undefined && evalRec.status !== 'Rated'));
    const score = isCalibrated && evalRec.calibrated_score ? parseFloat(evalRec.calibrated_score) : (parseFloat(emp.supervisorRating || emp.selfRating || 0) || 0);

    const criteria = evalRec && Array.isArray(evalRec.criteria_scores) ? evalRec.criteria_scores : [];
    const gaps = criteria.filter(c => parseFloat(c.rating || 0) < 3.5);

    const nameEl = document.getElementById('remedial-associate-name');
    const detailEl = document.getElementById('remedial-associate-detail');

    const roleDept = [emp.position, emp.department].filter(Boolean).join(' · ');
    if (nameEl) nameEl.textContent = `${emp.name}${roleDept ? ' · ' + roleDept : ''}`;
    if (detailEl) {
        detailEl.innerHTML = `Evaluated Rating: <strong class="text-slate-900 font-bold">${score > 0 ? score.toFixed(2) + ' / 5.0' : 'In Review'}</strong>${gaps.length > 0 ? ' · Identified Gaps: ' + gaps.map(g => `${g.title} (<strong>${parseFloat(g.rating).toFixed(1)}</strong>)`).join(', ') : ''}`;
    }
}

function openRemedialBooksModal(empKeyOrId) {
    const emp = resolveRemedialEmployee(empKeyOrId);
    currentRemedialEmpId = emp.id;
    window.selectedEvalEmpId = emp.id;

    // 1. INSTANT 0ms local render from in-memory cache & open modal immediately
    updateRemedialAssociateSync(emp.id);
    renderRemedialBooksList();
    openModal('modal-remedial-books');

    // 2. Silent background sync without locking UI
    Promise.all([
        fetchPrescribedLms(emp.id),
        typeof window.loadDraftSummary === 'function' ? window.loadDraftSummary(emp.id, false) : Promise.resolve()
    ]).then(() => {
        updateRemedialAssociateSync(emp.id);
        renderRemedialBooksList();
    }).catch(err => {
        console.warn('Background sync warning for remedial modal:', err);
    });
}
window.openRemedialBooksModal = openRemedialBooksModal;

async function updateRemedialAssociate(empKeyOrId) {
    updateRemedialAssociateSync(empKeyOrId);
    renderRemedialBooksList();
}
window.updateRemedialAssociate = updateRemedialAssociate;

function renderRemedialBooksList() {
    const container = document.getElementById('remedial-books-list');
    if (!container) return;

    const emp = resolveRemedialEmployee(currentRemedialEmpId);
    const books = window.dynamicLmsState.documents || [];

    if (books.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-400">
                <i class="fas fa-book-open text-3xl text-slate-300 mb-2"></i>
                <p class="text-xs font-semibold">No LMS SOP Handbooks published yet.</p>
            </div>
        `;
        return;
    }

    const stagedBooks = (window.dbDraftPlans && window.dbDraftPlans[emp.id] && Array.isArray(window.dbDraftPlans[emp.id].lms_books))
        ? window.dbDraftPlans[emp.id].lms_books
        : [];

    container.innerHTML = books.map(b => {
        const isDbEnrolled = isEmployeeEnrolledInLms(emp.id, b.id, b.title);
        const draftItem = stagedBooks.find(item => 
            String(item.lms_document_id) === String(b.id) ||
            String(item.id) === String(b.id) ||
            (b.title && item.book_title && item.book_title.trim().toLowerCase() === b.title.trim().toLowerCase())
        );
        const isDraftStaged = !!draftItem;
        const draftRowId = draftItem ? draftItem.id : null;

        let statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">Available</span>';
        let actionButton = '';

        if (isDbEnrolled) {
            statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Enrolled</span>';
            actionButton = `
                <button type="button" disabled class="btn-secondary px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-75 flex items-center space-x-1.5 shadow-none">
                    <i class="fas fa-check text-emerald-600"></i>
                    <span>Prescribed</span>
                </button>
            `;
        } else if (isDraftStaged) {
            statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">In Stage 6 Draft</span>';
            actionButton = `
                <button type="button" onclick="removeRemedialDraftBook('${emp.id}', '${b.id}', '${draftRowId}')" class="px-3 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl transition flex items-center space-x-1.5 shadow-2xs">
                    <i class="fas fa-times text-amber-700"></i>
                    <span>In Draft (Remove)</span>
                </button>
            `;
        } else {
            actionButton = `
                <button type="button" onclick="assignBookToIdp('${b.id}')" class="btn-primary px-3 py-1.5 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-2xs">
                    <i class="fas fa-plus"></i>
                    <span>+ Add to Draft IDP</span>
                </button>
            `;
        }

        const icon = b.icon || 'fa-book-bookmark';
        const dept = b.department_name || (b.department_id ? 'Department' : 'Property-Wide');
        const xp = b.exp_reward || 100;
        const mins = b.estimated_reading_minutes ? `${b.estimated_reading_minutes} mins` : '20 mins';

        return `
            <div class="p-4 bg-white border ${isDbEnrolled ? 'border-emerald-200 bg-emerald-50/20' : (isDraftStaged ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200')} rounded-2xl hover:border-primary/40 transition shadow-2xs flex flex-col justify-between space-y-3">
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${b.category || 'SOP Manual'}</span>
                        ${statusBadge}
                    </div>
                    <div class="flex items-start space-x-2.5">
                        <div class="w-8 h-8 rounded-xl bg-slate-50 text-primary border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            <i class="fas ${icon}"></i>
                        </div>
                        <div>
                            <h5 class="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 leading-snug">${b.title}</h5>
                            <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5">${b.description || 'Essential hospitality standards & SOP procedure guide.'}</p>
                        </div>
                    </div>
                </div>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div class="flex items-center space-x-2 text-[10px] text-slate-400 font-medium">
                        <span><i class="fas fa-building mr-1"></i>${dept}</span>
                        <span>&bull;</span>
                        <span class="font-bold text-amber-600">+${xp} XP</span>
                    </div>
                    <div>
                        ${actionButton}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
window.renderRemedialBooksList = renderRemedialBooksList;

function assignBookToIdp(bookId, goalId = null) {
    const empId = currentRemedialEmpId || window.selectedEvalEmpId || 'emp-101';
    const book = (window.dynamicLmsState.documents || []).find(d => String(d.id) === String(bookId)) || { id: bookId, title: 'LMS Handbook' };

    let targetGoalId = goalId;
    if (!targetGoalId && window.dbGoals && Array.isArray(window.dbGoals)) {
        const activeGoal = window.dbGoals.find(g => (typeof isSameEmployee === 'function' ? isSameEmployee(g.employee_id, empId) : g.employee_id === empId) && (g.status === 'Approved' || g.status === 'In Progress' || g.status === 'Draft'));
        if (activeGoal) targetGoalId = activeGoal.id;
    }

    // 1. INSTANT 0ms OPTIMISTIC UI UPDATE
    window.dbDraftPlans = window.dbDraftPlans || {};
    window.dbDraftPlans[empId] = window.dbDraftPlans[empId] || { tasks: [], lms_books: [], task_count: 0, book_count: 0, total: 0 };
    const tempDraftItem = {
        id: 'temp_' + Date.now(),
        employee_id: empId,
        item_type: 'lms_book',
        lms_document_id: bookId,
        book_title: book.title,
        goal_id: targetGoalId || null,
        status: 'Draft'
    };
    window.dbDraftPlans[empId].lms_books = window.dbDraftPlans[empId].lms_books || [];
    // Avoid duplicates in memory
    if (!window.dbDraftPlans[empId].lms_books.some(b => String(b.lms_document_id) === String(bookId))) {
        window.dbDraftPlans[empId].lms_books.push(tempDraftItem);
    }
    window.dbDraftPlans[empId].book_count = window.dbDraftPlans[empId].lms_books.length;
    window.dbDraftPlans[empId].total = (window.dbDraftPlans[empId].tasks?.length || 0) + window.dbDraftPlans[empId].book_count;

    // Instant UI render & feedback
    renderRemedialBooksList();
    if (typeof showIDPDetail === 'function') showIDPDetail(empId);
    if (typeof showToast === 'function') showToast(`📚 Handbook "${book.title}" added to draft IDP.`, 'success');

    // 2. NON-BLOCKING BACKGROUND API PERSISTENCE
    if (typeof PerformanceAPI !== 'undefined' && typeof PerformanceAPI.addDraftBook === 'function') {
        PerformanceAPI.addDraftBook({
            employee_id: empId,
            lms_document_id: bookId,
            book_title: book.title,
            goal_id: targetGoalId || null,
            plan_type: 'IDP'
        }).then(res => {
            if (res && res.data && res.data.id) {
                tempDraftItem.id = res.data.id;
            }
        }).catch(err => {
            // Revert optimistic update on error
            window.dbDraftPlans[empId].lms_books = (window.dbDraftPlans[empId].lms_books || []).filter(b => b.id !== tempDraftItem.id && b.lms_document_id !== bookId);
            window.dbDraftPlans[empId].book_count = window.dbDraftPlans[empId].lms_books.length;
            window.dbDraftPlans[empId].total = (window.dbDraftPlans[empId].tasks?.length || 0) + window.dbDraftPlans[empId].book_count;
            renderRemedialBooksList();
            if (typeof showIDPDetail === 'function') showIDPDetail(empId);
            if (typeof showToast === 'function') showToast(`Error saving draft: ${err.message}`, 'error');
        });
    } else {
        window.prescribedBooksPerAssociate[empId] = window.prescribedBooksPerAssociate[empId] || [];
        if (!window.prescribedBooksPerAssociate[empId].includes(bookId)) {
            window.prescribedBooksPerAssociate[empKey].push(bookId);
        }
    }
}
window.assignBookToIdp = assignBookToIdp;

function removeRemedialDraftBook(empId, bookId, rowId) {
    const targetEmpId = empId || currentRemedialEmpId;
    const draftData = window.dbDraftPlans?.[targetEmpId] || {};
    const savedBooks = [...(draftData.lms_books || [])];
    const draftItem = (draftData.lms_books || []).find(b => 
        String(b.id) === String(rowId) ||
        String(b.id) === String(bookId) ||
        String(b.lms_document_id) === String(bookId)
    );
    const targetIdToDelete = draftItem ? draftItem.id : (rowId || bookId);

    // 1. INSTANT 0ms OPTIMISTIC REMOVAL
    draftData.lms_books = (draftData.lms_books || []).filter(b => 
        String(b.id) !== String(targetIdToDelete) &&
        String(b.id) !== String(bookId) &&
        String(b.lms_document_id) !== String(bookId)
    );
    draftData.book_count = draftData.lms_books.length;
    draftData.total = (draftData.tasks?.length || 0) + draftData.book_count;

    // Instant UI render & feedback
    renderRemedialBooksList();
    if (typeof showIDPDetail === 'function') showIDPDetail(targetEmpId);
    if (typeof showToast === 'function') showToast('Draft LMS handbook removed from plan.', 'info');

    // 2. NON-BLOCKING BACKGROUND API CALL
    if (typeof PerformanceAPI !== 'undefined' && typeof PerformanceAPI.removeDraftItem === 'function') {
        PerformanceAPI.removeDraftItem(targetIdToDelete).catch(err => {
            // Revert optimistic removal on error
            draftData.lms_books = savedBooks;
            draftData.book_count = draftData.lms_books.length;
            draftData.total = (draftData.tasks?.length || 0) + draftData.book_count;
            renderRemedialBooksList();
            if (typeof showIDPDetail === 'function') showIDPDetail(targetEmpId);
            if (typeof showToast === 'function') showToast(`Error removing draft: ${err.message}`, 'error');
        });
    }
}
window.removeRemedialDraftBook = removeRemedialDraftBook;
window.removeStagedIdpBook = removeRemedialDraftBook;
