/**
 * Oxford Suites, Makati — Learning Management System (LMS)
 * Sub-Module: Digital SOP Library, Category Filtering & Document Deletion
 */

// ========================================================
// DYNAMIC LEARNING MANAGEMENT SYSTEM (LMS) - SUPABASE INTEGRATED
// ========================================================

window.dynamicLmsState = {
    documents: [],
    departments: [],
    activeDept: 'all',
    search: '',
    loading: false
};

let lmsActiveDeptFilter = 'all';
let currentReadingBookId = null;

// Load initial cache from sessionStorage for 0ms startup
try {
    const cachedDocs = sessionStorage.getItem('lms_documents_cache');
    if (cachedDocs) {
        window.dynamicLmsState.documents = JSON.parse(cachedDocs);
    }
    const cachedDepts = sessionStorage.getItem('lms_departments_cache');
    if (cachedDepts) {
        window.dynamicLmsState.departments = JSON.parse(cachedDepts);
    }
} catch (e) {}

/**
 * Fetch LMS Documents from Supabase REST via api/lms.php (Cached + Background Revalidate)
 */
async function fetchDynamicLmsDocuments(deptFilter = null, searchVal = null) {
    const container = document.getElementById('lms-bookshelf-grid');
    if (!container) return;

    if (deptFilter !== null) window.dynamicLmsState.activeDept = deptFilter;
    if (searchVal !== null) window.dynamicLmsState.search = searchVal;

    // 1. Instant 0ms render if cache available
    if (window.dynamicLmsState.documents && window.dynamicLmsState.documents.length > 0) {
        renderLmsBooks();
    } else {
        try {
            const cached = sessionStorage.getItem('lms_documents_cache');
            if (cached) {
                window.dynamicLmsState.documents = JSON.parse(cached);
                renderLmsBooks();
            }
        } catch (e) {}
    }

    window.dynamicLmsState.loading = true;

    // 2. Fresh background data synchronization
    try {
        const params = new URLSearchParams({
            action: 'get_documents'
        });
        if (window.dynamicLmsState.activeDept && window.dynamicLmsState.activeDept !== 'all') {
            params.append('department_id', window.dynamicLmsState.activeDept);
        }
        if (window.dynamicLmsState.search) {
            params.append('search', window.dynamicLmsState.search);
        }

        const res = await fetch(`api/lms.php?${params.toString()}`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
            window.dynamicLmsState.documents = json.data;
            try {
                sessionStorage.setItem('lms_documents_cache', JSON.stringify(json.data));
            } catch (e) {}
        } else {
            console.warn('LMS fetch warning:', json.message);
        }
    } catch (err) {
        console.error('Failed to fetch LMS documents from Supabase:', err);
    } finally {
        window.dynamicLmsState.loading = false;
        renderLmsBooks();
    }
}

/**
 * Load Departments into Upload Modal & Filter Chips
 */
async function loadLmsDepartments() {
    try {
        const cachedDepts = sessionStorage.getItem('lms_departments_cache');
        if (cachedDepts) {
            const depts = JSON.parse(cachedDepts);
            window.dynamicLmsState.departments = depts;
            populateDeptDropdown(depts);
        }
    } catch (e) {}

    try {
        const res = await fetch('api/competencies.php?action=get_departments');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
            window.dynamicLmsState.departments = json.data;
            try {
                sessionStorage.setItem('lms_departments_cache', JSON.stringify(json.data));
            } catch (e) {}
            populateDeptDropdown(json.data);
        }
    } catch (e) {
        console.warn('Could not load departments for LMS:', e);
    }
}

function populateDeptDropdown(depts) {
    const modalSelect = document.getElementById('lms-doc-dept');
    if (modalSelect && Array.isArray(depts)) {
        let options = '<option value="all">Property-Wide (All Associates)</option>';
        depts.forEach(d => {
            options += `<option value="${d.id}">${d.name}</option>`;
        });
        modalSelect.innerHTML = options;
    }
}

/**
 * Render Dynamic 3D Digital Bookshelf Grid
 */
function renderLmsBooks() {
    const container = document.getElementById('lms-bookshelf-grid');
    if (!container) return;

    const userRole = (window.currentUser?.role || window.activePersonaRole || '').toLowerCase();
    const currentUserId = (window.currentUser?.id || 'emp-101').toLowerCase();
    const isSupervisorOrManager = userRole.includes('supervisor') || userRole.includes('manager') || userRole.includes('admin') || userRole.includes('hr') || userRole.includes('executive');

    // Toggle Upload Action visibility based on user role
    const uploadContainer = document.getElementById('lms-upload-action-container');
    const uploadBtn = document.getElementById('btn-lms-upload-doc');
    if (uploadContainer || uploadBtn) {
        const target = uploadContainer || uploadBtn;
        if (isSupervisorOrManager) {
            target.classList.remove('hidden');
        } else {
            target.classList.add('hidden');
        }
    }

    let docs = window.dynamicLmsState.documents || [];

    // Regular employee sees prescribed books + all property-wide/null department LMS handbooks
    if (!isSupervisorOrManager) {
        const prescribedList = window.dynamicLmsState.prescribed || [];
        const myPrescribedLmsIds = prescribedList.filter(p => {
            const empId = (p.employee || p.employee_id || '').toLowerCase();
            const empName = (p.employee_name || '').toLowerCase();
            return empId === currentUserId ||
                (currentUserId === 'emp-101' && (empId.includes('101') || empId.includes('maria') || empName.includes('maria'))) ||
                (currentUserId === 'emp-102' && (empId.includes('102') || empId.includes('antonio') || empName.includes('antonio')));
        }).map(p => p.lms_id || p.id);

        docs = docs.filter(doc => {
            const dId = doc.department_id;
            const dName = doc.department_name;
            const isNullOrPropertyWide = !dId || dId === 'null' || dId === 'all' || dName === 'Property-Wide' || String(dId).trim() === '';
            return isNullOrPropertyWide || myPrescribedLmsIds.includes(doc.id);
        });
    }

    if (window.dynamicLmsState.loading && docs.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-16 text-center text-slate-400">
                <i class="fas fa-spinner fa-spin text-3xl text-primary mb-3"></i>
                <p class="text-sm font-semibold text-slate-600">Loading digital library...</p>
            </div>
        `;
        return;
    }

    if (!isSupervisorOrManager && docs.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-16 text-center text-slate-400">
                <i class="fas fa-book-open text-3xl text-slate-300 mb-3 block"></i>
                <p class="text-sm font-semibold text-slate-700">No Prescribed or Property-Wide Handbooks Available</p>
                <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">You currently have no training handbooks or SOP documents assigned. Once assigned or published property-wide, your documents will appear here.</p>
            </div>
        `;
        return;
    }

    let booksHtml = docs.map(doc => {
        const docId = doc.id;
        const title = doc.title || 'Untitled Handbook';
        const deptName = doc.department_name || 'Property-Wide';
        const category = doc.category || 'SOP Manual';
        const pages = doc.estimated_pages ? `${doc.estimated_pages} Pages` : '18 Pages';
        const readingMin = doc.estimated_reading_minutes ? `${doc.estimated_reading_minutes} min read` : '20 min read';
        const xp = doc.exp_reward || 100;
        const icon = doc.icon || 'fa-book-bookmark';
        const desc = doc.description || 'Standard operating procedure manual and operational workflow guidance.';
        const filePath = doc.file_path || '#';
        const isPdf = (doc.file_type || '').toLowerCase().includes('pdf') || filePath.toLowerCase().endsWith('.pdf');
        const safeTitle = title.replace(/'/g, "\\'");

        return `
            <!-- Minimalist Clean Book Card with Supabase Data -->
            <div class="card-clean p-5 flex flex-col justify-between h-full group bg-white border border-[#E8DEDC] hover:border-[#D8CECB] transition shadow-2xs hover:shadow-xs rounded-2xl relative">
                <div class="space-y-3">
                    <!-- Top Badges & Icon -->
                    <div class="flex items-center justify-between">
                        <div class="w-9 h-9 rounded-xl bg-[#FAF8F7] text-primary border border-[#E8DEDC] flex items-center justify-center text-sm font-bold shadow-2xs group-hover:scale-105 transition">
                            <i class="fas ${icon}"></i>
                        </div>
                        <div class="flex items-center space-x-1.5">
                            <span class="badge-secondary text-[10px] px-2 py-0.5">${deptName}</span>
                            <span class="badge-gold text-[10px] px-2 py-0.5 font-bold">+${xp} XP</span>
                        </div>
                    </div>
                    
                    <!-- Content -->
                    <div>
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${category}</span>
                            ${isPdf ? '<span class="text-[9px] font-extrabold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">PDF</span>' : ''}
                        </div>
                        <h4 class="font-heading font-bold text-sm sm:text-base text-slate-900 mt-0.5 leading-snug group-hover:text-primary transition line-clamp-2">${title}</h4>
                        <p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">${desc}</p>
                    </div>

                    <!-- Metadata Row -->
                    <div class="flex items-center space-x-3 text-[11px] text-slate-400 pt-1 border-t border-slate-100 font-medium">
                        <span class="flex items-center space-x-1">
                            <i class="fas fa-file-lines text-[10px]"></i>
                            <span>${pages}</span>
                        </span>
                        <span>&bull;</span>
                        <span class="flex items-center space-x-1">
                            <i class="fas fa-clock text-[10px]"></i>
                            <span>${readingMin}</span>
                        </span>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="pt-4 mt-3 border-t border-[#F2EBE9] flex items-center justify-between gap-2">
                    <button onclick="openBookReader('${docId}')" class="btn-primary flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs">
                        <i class="fas fa-book-open text-xs"></i>
                        <span>Read Handbook</span>
                    </button>
                    ${isSupervisorOrManager ? `
                        <button onclick="deleteLmsDocument('${docId}', '${safeTitle}', this)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-200" title="Delete document">
                            <i class="fas fa-trash-can text-xs"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = booksHtml || `
        <div class="col-span-full py-12 text-center text-slate-400">
            <i class="fas fa-folder-open text-3xl text-slate-300 mb-2"></i>
            <p class="text-sm font-semibold">No documents found matching this filter.</p>
        </div>
    `;
}

/**
 * Filter LMS Bookshelf by Department
 */
function setLmsDeptFilter(deptKey) {
    lmsActiveDeptFilter = deptKey;

    // Update UI chips
    const buttons = document.querySelectorAll('#lms-dept-filters button');
    buttons.forEach(btn => {
        const key = btn.getAttribute('data-dept');
        if (key === deptKey) {
            btn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition bg-primary text-white shadow-xs';
        } else {
            btn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-bold transition bg-white text-slate-600 border border-slate-200 hover:bg-slate-50';
        }
    });

    fetchDynamicLmsDocuments(deptKey);
}

/**
 * Filter LMS Bookshelf by Search Text
 */
function filterLmsBooks() {
    const searchVal = document.getElementById('lms-search-input')?.value || '';
    fetchDynamicLmsDocuments(null, searchVal);
}

/**
 * Delete LMS Document
 */
async function deleteLmsDocument(docId, docTitle, btnEl = null) {
    const doDelete = async () => {
        let origHtml = '';
        if (btnEl) {
            origHtml = btnEl.innerHTML;
            btnEl.disabled = true;
            btnEl.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i>';
        }

        try {
            const res = await fetch(`api/lms.php?action=delete_document&id=${encodeURIComponent(docId)}`, {
                method: 'POST'
            });
            const json = await res.json();

            if (json.success) {
                if (typeof showToast === 'function') {
                    showToast(`Document "${docTitle}" successfully deleted from LMS library.`, 'info');
                }
                // Invalidate local cache
                sessionStorage.removeItem('lms_documents_cache');
                // Refresh list from server
                await fetchDynamicLmsDocuments();
                // Also update TNA if visible
                if (typeof fetchNeedsAnalysisData === 'function') fetchNeedsAnalysisData();
            } else {
                if (typeof showToast === 'function') {
                    showToast(json.message || 'Failed to delete document.', 'error');
                }
            }
        } catch (err) {
            console.error('Error deleting document:', err);
            if (typeof showToast === 'function') {
                showToast('Network error while deleting document.', 'error');
            }
        } finally {
            if (btnEl) {
                btnEl.disabled = false;
                btnEl.innerHTML = origHtml;
            }
        }
    };

    if (typeof showActionConfirmModal === 'function') {
        showActionConfirmModal({
            title: 'Delete LMS Handbook',
            message: `Are you sure you want to permanently delete "${docTitle}"? This will remove the SOP manual from the library and Supabase storage.`,
            confirmBtnText: 'Delete Document',
            confirmBtnClass: 'btn-danger bg-rose-600 hover:bg-rose-700 text-white',
            iconClass: 'fas fa-trash-can',
            iconContainerClass: 'bg-rose-100 text-rose-700',
            onConfirm: doDelete
        });
    } else {
        if (confirm(`Are you sure you want to delete "${docTitle}"?`)) {
            await doDelete();
        }
    }
}

window.fetchDynamicLmsDocuments = fetchDynamicLmsDocuments;
window.loadLmsDepartments = loadLmsDepartments;
window.renderLmsBooks = renderLmsBooks;
window.setLmsDeptFilter = setLmsDeptFilter;
window.filterLmsBooks = filterLmsBooks;
window.deleteLmsDocument = deleteLmsDocument;
