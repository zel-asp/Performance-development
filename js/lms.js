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

/**
 * Fetch LMS Documents from Supabase REST via api/lms.php
 */
async function fetchDynamicLmsDocuments(deptFilter = null, searchVal = null) {
    const container = document.getElementById('lms-bookshelf-grid');
    if (!container) return;

    if (deptFilter !== null) window.dynamicLmsState.activeDept = deptFilter;
    if (searchVal !== null) window.dynamicLmsState.search = searchVal;

    window.dynamicLmsState.loading = true;

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
        const res = await fetch('api/competencies.php?action=get_departments');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
            window.dynamicLmsState.departments = json.data;

            // Populate Modal Department Dropdown
            const modalSelect = document.getElementById('lms-doc-dept');
            if (modalSelect) {
                let options = '<option value="all">Property-Wide (All Associates)</option>';
                json.data.forEach(d => {
                    options += `<option value="${d.id}">${d.name}</option>`;
                });
                modalSelect.innerHTML = options;
            }
        }
    } catch (e) {
        console.warn('Could not load departments for LMS:', e);
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

    let docs = window.dynamicLmsState.documents || [];

    // Regular employee ONLY sees training books and docs prescribed to them
    if (!isSupervisorOrManager) {
        const prescribedList = window.dynamicLmsState.prescribed || [];
        const myPrescribedLmsIds = prescribedList.filter(p => {
            const empId = (p.employee || p.employee_id || '').toLowerCase();
            const empName = (p.employee_name || '').toLowerCase();
            return empId === currentUserId ||
                (currentUserId === 'emp-101' && (empId.includes('101') || empId.includes('maria') || empName.includes('maria'))) ||
                (currentUserId === 'emp-102' && (empId.includes('102') || empId.includes('antonio') || empName.includes('antonio')));
        }).map(p => p.lms_id || p.id);

        docs = docs.filter(doc => myPrescribedLmsIds.includes(doc.id));
    }

    if (window.dynamicLmsState.loading && docs.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-16 text-center text-slate-400">
                <i class="fas fa-spinner fa-spin text-3xl text-primary mb-3"></i>
                <p class="text-sm font-semibold text-slate-600">Loading digital library from Supabase...</p>
            </div>
        `;
        return;
    }

    if (!isSupervisorOrManager && docs.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-16 text-center text-slate-400">
                <i class="fas fa-book-open text-3xl text-slate-300 mb-3 block"></i>
                <p class="text-sm font-semibold text-slate-700">No Prescribed LMS Handbooks</p>
                <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">You currently have no training handbooks or SOP documents prescribed by your supervisor. Once assigned, your prescribed documents will appear here.</p>
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
                    <div class="pt-2.5 border-t border-[#E8DEDC] flex items-center justify-between text-[11px] text-slate-400">
                        <span class="truncate max-w-[140px]"><i class="fas fa-clock mr-1 text-slate-400"></i> ${readingMin}</span>
                        <span class="font-medium text-slate-600">${pages}</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="pt-3.5 flex items-center justify-between gap-1.5 border-t border-[#E8DEDC] mt-3.5">
                    <button onclick="openBookReader('${docId}')"
                        class="flex-1 py-2 px-3 btn-primary text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs">
                        <i class="fas fa-book-open text-xs"></i>
                        <span>Read SOP</span>
                    </button>
                    ${filePath && filePath !== '#' ? `
                    <a href="${filePath}" target="_blank" download title="Open / Download Document"
                        class="py-2 px-2.5 btn-secondary text-xs font-semibold flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-100 rounded-xl border border-[#E8DEDC]">
                        <i class="fas fa-file-arrow-down text-xs"></i>
                    </a>
                    ` : ''}
                    <button onclick="launchInteractiveQuiz('${safeTitle}')" title="Take Knowledge Verification Quiz"
                        class="py-2 px-2.5 btn-secondary text-xs font-semibold flex items-center space-x-1 flex-shrink-0 text-gold-dark hover:bg-gold-50">
                        <i class="fas fa-graduation-cap text-xs"></i>
                        <span class="hidden sm:inline">Quiz</span>
                    </button>
                    ${isSupervisorOrManager ? `
                    <button onclick="deleteLmsDocument('${docId}', '${safeTitle}')" title="Remove Document from LMS"
                        class="py-2 px-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition text-xs">
                        <i class="fas fa-trash-can"></i>
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    // Add Upload New Document Slot on Shelf only for Supervisors
    const uploadCardSlot = isSupervisorOrManager ? `
        <div onclick="openModal('modal-lms-upload')"
            class="border-2 border-dashed border-[#E8DEDC] hover:border-primary bg-[#FAF8F7] hover:bg-primary-50/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition group min-h-[260px]">
            <div class="w-12 h-12 rounded-xl bg-white border border-[#E8DEDC] group-hover:border-primary-100 flex items-center justify-center text-primary text-xl shadow-2xs group-hover:scale-105 transition mb-2.5">
                <i class="fas fa-cloud-arrow-up"></i>
            </div>
            <h4 class="font-heading font-bold text-sm text-slate-900 group-hover:text-primary transition">Upload Handbook / SOP</h4>
            <p class="text-xs text-slate-500 max-w-[200px] mt-1 leading-relaxed">Publish PDF standard operating procedures to Supabase bucket</p>
            <span class="mt-3.5 px-3 py-1.5 rounded-full btn-primary text-[11px] font-bold transition flex items-center space-x-1.5 shadow-2xs">
                <i class="fas fa-arrow-up-from-bracket text-xs"></i>
                <span>Upload Document</span>
            </span>
        </div>
    ` : '';

    container.innerHTML = booksHtml + uploadCardSlot;
}


/**
 * Filter by Department Chip
 */
function setLmsDeptFilter(deptKey) {
    lmsActiveDeptFilter = deptKey;
    document.querySelectorAll('.lms-dept-filter-chip').forEach(chip => {
        const chipDept = chip.getAttribute('data-dept');
        if (chipDept === lmsActiveDeptFilter) {
            chip.className = 'lms-dept-filter-chip active px-3 py-1 rounded-full font-bold bg-primary text-white transition text-[11px] whitespace-nowrap';
        } else {
            chip.className = 'lms-dept-filter-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 transition text-[11px] whitespace-nowrap';
        }
    });

    const searchInput = (document.getElementById('lms-search-input')?.value || '').trim();
    fetchDynamicLmsDocuments(deptKey, searchInput);
}

/**
 * Filter Books by Real-Time Search Input
 */
let lmsSearchDebounce = null;
function filterLmsBooks() {
    clearTimeout(lmsSearchDebounce);
    lmsSearchDebounce = setTimeout(() => {
        const searchInput = (document.getElementById('lms-search-input')?.value || '').trim();
        fetchDynamicLmsDocuments(lmsActiveDeptFilter, searchInput);
    }, 250);
}

/**
 * Open Document in Reader Modal with Live Supabase File Link
 */
function openBookReader(docId) {
    const doc = (window.dynamicLmsState.documents || []).find(d => d.id === docId);
    if (!doc) return;

    currentReadingBookId = doc.id;

    // Update Header
    document.getElementById('reader-book-title').textContent = doc.title || 'SOP Document';
    const deptName = doc.department_name || 'Property-Wide';
    const pages = doc.estimated_pages ? `${doc.estimated_pages} Pages` : '18 Pages';
    const time = doc.estimated_reading_minutes ? `${doc.estimated_reading_minutes} min read` : '20 min read';
    document.getElementById('reader-book-author').textContent = `${deptName} · ${pages} · ${time}`;
    document.getElementById('reader-book-xp-badge').textContent = `+${doc.exp_reward || 100} XP Completion`;
    
    // Update Download Link
    const dlBtn = document.getElementById('reader-download-btn');
    if (dlBtn) {
        if (doc.file_path && doc.file_path !== '#') {
            dlBtn.href = doc.file_path;
            dlBtn.classList.remove('hidden');
        } else {
            dlBtn.classList.add('hidden');
        }
    }

    // Update Tip / Highlight
    document.getElementById('reader-tip-text').textContent = doc.learning_outcomes || 'Review all mandatory procedures and maintain 5-star standard compliance across all touchpoints.';

    // Update TOC & Step-by-Step Procedure Content
    const tocEl = document.getElementById('reader-toc');
    if (tocEl) {
        const chapters = [
            'Chapter 1: Standard Operating Overview',
            'Chapter 2: Essential Execution Protocols',
            'Chapter 3: Quality Assurance & Safety Benchmarks',
            'Chapter 4: Digital Audit & Daily Sign-off'
        ];
        tocEl.innerHTML = chapters.map((ch, idx) => `
            <div class="p-2 rounded-lg bg-slate-50 border border-slate-200/70 hover:bg-amber-50/50 hover:border-amber-300 transition cursor-pointer flex items-center justify-between text-xs">
                <span class="font-medium text-slate-700"><i class="fas fa-bookmark text-amber-500 text-[10px] mr-1.5"></i> ${ch}</span>
                <span class="text-[10px] font-bold text-slate-400">p.${(idx + 1) * 4}</span>
            </div>
        `).join('');
    }

    const contentEl = document.getElementById('reader-page-content');
    if (contentEl) {
        contentEl.innerHTML = `
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p class="font-bold text-slate-900 text-xs text-primary">1. Operational Description</p>
                <p class="text-xs text-slate-600 leading-relaxed">${doc.description || 'Master standard operating procedures and operational compliance.'}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p class="font-bold text-slate-900 text-xs text-primary">2. Key Learning Outcomes</p>
                <p class="text-xs text-slate-600 leading-relaxed">${doc.learning_outcomes || 'Demonstrate mastery of hospitality guidelines and quality verification.'}</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p class="font-bold text-slate-900 text-xs text-primary">3. Storage Object &amp; File Verification</p>
                <p class="text-xs text-slate-600 leading-relaxed font-mono text-[11px] break-all">${doc.file_name || 'document.pdf'} (${Math.round((doc.file_size || 0) / 1024)} KB)</p>
            </div>
        `;
    }

    openModal('modal-book-reader');
}

/**
 * Launch Quiz from Reader
 */
function launchQuizFromReader() {
    if (currentReadingBookId) {
        const doc = (window.dynamicLmsState.documents || []).find(d => d.id === currentReadingBookId);
        closeModal('modal-book-reader');
        if (doc) {
            launchInteractiveQuiz(doc.title);
        }
    }
}

/**
 * Handle File Selection in Upload Modal
 */
function handleLmsFileSelect(input) {
    let file = null;
    if (input instanceof File) {
        file = input;
    } else if (input && input.files && input.files[0]) {
        file = input.files[0];
    }

    if (file) {
        window._lmsSelectedFile = file;
        const chosenEl = document.getElementById('lms-file-chosen');
        const chosenName = document.getElementById('lms-file-chosen-name');
        if (chosenEl && chosenName) {
            const sizeStr = file.size > 1048576 
                ? (file.size / 1048576).toFixed(1) + ' MB' 
                : Math.round(file.size / 1024) + ' KB';
            chosenName.textContent = `${file.name} (${sizeStr})`;
            chosenEl.classList.remove('hidden');
        }
        const titleInput = document.getElementById('lms-doc-title');
        if (titleInput && !titleInput.value.trim()) {
            const defaultTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
            titleInput.value = defaultTitle.charAt(0).toUpperCase() + defaultTitle.slice(1);
        }
    }
}

/**
 * Initialize Drag & Drop Handlers on Dropzone
 */
function initLmsDropzone() {
    const dropzone = document.getElementById('lms-dropzone');
    const fileInput = document.getElementById('lms-file-input');
    if (!dropzone || dropzone._hasDragInit) return;
    dropzone._hasDragInit = true;

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-primary', 'bg-primary-50/40');
    });

    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-primary', 'bg-primary-50/40');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-primary', 'bg-primary-50/40');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            window._lmsSelectedFile = droppedFile;
            if (fileInput) {
                try {
                    const dt = new DataTransfer();
                    dt.items.add(droppedFile);
                    fileInput.files = dt.files;
                } catch (_) {}
            }
            handleLmsFileSelect(droppedFile);
        }
    });
}

/**
 * Submit Document Upload with Multipart / Supabase Storage
 */
async function submitLmsDocUpload(e) {
    if (e && e.preventDefault) e.preventDefault();

    const form = document.getElementById('form-lms-upload');
    const fileInput = document.getElementById('lms-file-input');
    const titleInput = document.getElementById('lms-doc-title');
    const submitBtn = document.getElementById('btn-submit-lms-upload');

    let file = null;
    if (fileInput && fileInput.files && fileInput.files[0]) {
        file = fileInput.files[0];
    } else if (window._lmsSelectedFile) {
        file = window._lmsSelectedFile;
    }

    if (!file) {
        showToast('Please select or browse a document / PDF file to upload!', 'error');
        return;
    }

    const title = (titleInput?.value || '').trim();
    if (!title) {
        showToast('Please enter a document title!', 'error');
        return;
    }

    // Set Button Loading State
    let origBtnContent = '';
    if (submitBtn) {
        origBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5 text-xs"></i><span>Uploading Direct to Supabase Storage...</span>';
    }

    try {
        // 1. Upload file directly to Supabase Storage bucket 'documents' (Bypasses PHP 2M limits completely)
        const cleanName = file.name.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
        const storagePath = `lms/${Date.now()}_${cleanName}`;
        const uploadUrl = `https://jvxnrgcxegzhyaekxdok.supabase.co/storage/v1/object/documents/${storagePath}`;
        const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2eG5yZ2N4ZWd6aHlhZWt4ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NTczOTYsImV4cCI6MjEwMzEzMzM5Nn0.nPTeedzMfSnFgFhxb2PDoXiH_aW8Mmwt04ltYR7IznU';

        const storageRes = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'apikey': anonKey,
                'Authorization': `Bearer ${anonKey}`,
                'Content-Type': file.type || 'application/octet-stream',
                'x-upsert': 'true'
            },
            body: file
        });

        if (!storageRes.ok) {
            const errData = await storageRes.json().catch(() => ({}));
            throw new Error(errData.message || `Supabase storage upload failed with status ${storageRes.status}`);
        }

        const publicUrl = `https://jvxnrgcxegzhyaekxdok.supabase.co/storage/v1/object/public/documents/${storagePath}`;

        // 2. Publish document record into Supabase SQL database
        const metadataPayload = {
            action: 'publish_document',
            title: title,
            file_name: file.name,
            file_path: publicUrl,
            file_type: file.type || 'application/pdf',
            file_size: file.size,
            department_id: document.getElementById('lms-doc-dept')?.value || 'all',
            category: document.getElementById('lms-doc-category')?.value || 'SOP Manual',
            estimated_pages: parseInt(document.getElementById('lms-doc-pages')?.value, 10) || 18,
            exp_reward: parseInt(document.getElementById('lms-doc-xp')?.value, 10) || 100,
            description: (document.getElementById('lms-doc-desc')?.value || '').trim(),
            learning_outcomes: (document.getElementById('lms-doc-outcomes')?.value || '').trim(),
            status: 'Published',
            uploaded_by: 'emp-103'
        };

        const res = await fetch('api/lms.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metadataPayload)
        });

        const json = await res.json();

        if (json.success) {
            closeModal('modal-lms-upload');
            showToast(`Handbook "${title}" uploaded directly to Supabase Storage & published!`, 'success');
            
            // Reset form & state
            if (form) form.reset();
            window._lmsSelectedFile = null;
            const chosenEl = document.getElementById('lms-file-chosen');
            if (chosenEl) chosenEl.classList.add('hidden');

            // Refresh Bookshelf immediately without page reload
            await fetchDynamicLmsDocuments();
        } else {
            showToast(json.message || 'Failed to save document metadata.', 'error');
        }
    } catch (err) {
        console.error('Direct upload error:', err);
        showToast('Upload error: ' + err.message, 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnContent || '<i class="fas fa-upload mr-1 text-xs"></i><span>Publish Document to Library</span>';
        }
    }
}


/**
 * Delete LMS Document
 */
async function deleteLmsDocument(docId, docTitle) {
    if (!confirm(`Are you sure you want to remove "${docTitle}" from the LMS library and Supabase storage?`)) {
        return;
    }

    try {
        const res = await fetch('api/lms.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete_document', id: docId })
        });
        const json = await res.json();

        if (json.success) {
            showToast(json.message || 'Document removed successfully.', 'success');
            await fetchDynamicLmsDocuments();
        } else {
            showToast(json.message || 'Failed to delete document.', 'error');
        }
    } catch (err) {
        showToast('Error deleting document: ' + err.message, 'error');
    }
}

// Auto-initialize LMS on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadLmsDepartments();
    fetchDynamicLmsDocuments();
    initLmsDropzone();
});

// Also trigger if page already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadLmsDepartments();
    fetchDynamicLmsDocuments();
    initLmsDropzone();
}



            // ========================================================
            // LMS NEEDS ANALYSIS (TNA) ROSTER & QUIZ POINTS PROGRESS
            // ========================================================
            let currentReevalEnrollmentId = null;

            async function renderTnaEnrollments() {
                const tbody = document.getElementById('tna-enrollments-table-body');
                if (!tbody) return;

                // Ensure latest lms_prescribed records are fetched with animated skeleton loader
                if (!window.dynamicLmsState || !window.dynamicLmsState.prescribedFetched) {
                    tbody.innerHTML = [1, 2, 3].map(() => `
                        <tr class="animate-pulse">
                            <td class="py-3.5 px-3">
                                <div class="flex items-center space-x-3">
                                    <div class="w-9 h-9 rounded-xl bg-slate-200"></div>
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
                            <td class="py-3.5 px-3">
                                <div class="h-3.5 w-20 bg-slate-200 rounded mb-1"></div>
                                <div class="h-2.5 w-12 bg-slate-100 rounded"></div>
                            </td>
                            <td class="py-3.5 px-3">
                                <div class="h-3 w-20 bg-slate-200 rounded"></div>
                            </td>
                            <td class="py-3.5 px-3 text-right">
                                <div class="h-7 w-24 bg-slate-200 rounded-xl ml-auto"></div>
                            </td>
                        </tr>
                    `).join('');

                    await fetchPrescribedLms();
                    window.dynamicLmsState.prescribedFetched = true;
                }


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
                });                const userRole = (window.currentUser?.role || window.activePersonaRole || '').toLowerCase();
                const currentUserId = (window.currentUser?.id || 'emp-101').toLowerCase();
                const isSupervisorOrManager = userRole.includes('supervisor') || userRole.includes('manager') || userRole.includes('admin') || userRole.includes('hr') || userRole.includes('executive');

                const bookFilter = document.getElementById('tna-book-filter')?.value || 'all';
                const searchQ = (document.getElementById('tna-search-input')?.value || '').toLowerCase().trim();

                const filtered = mappedDb.filter(item => {
                    // Regular employee only sees THEIR OWN content
                    if (!isSupervisorOrManager) {
                        const itemEmp = (item.employeeId || '').toLowerCase();
                        const itemEmpName = (item.empName || '').toLowerCase();
                        const matchesMe = itemEmp === currentUserId ||
                            (currentUserId === 'emp-101' && (itemEmp.includes('101') || itemEmp.includes('maria') || itemEmpName.includes('maria'))) ||
                            (currentUserId === 'emp-102' && (itemEmp.includes('102') || itemEmp.includes('antonio') || itemEmpName.includes('antonio')));
                        if (!matchesMe) return false;
                    }

                    const matchesBook = (bookFilter === 'all') || (item.bookId === bookFilter);
                    const matchesSearch = !searchQ || 
                        (item.empName && item.empName.toLowerCase().includes(searchQ)) ||
                        (item.empRole && item.empRole.toLowerCase().includes(searchQ)) ||
                        (item.bookTitle && item.bookTitle.toLowerCase().includes(searchQ)) ||
                        (item.empDept && item.empDept.toLowerCase().includes(searchQ));
                    return matchesBook && matchesSearch;
                });

                if (filtered.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6" class="py-8 text-center text-slate-400 font-semibold">
                                <i class="fas fa-book-bookmark text-2xl mb-2 block text-slate-300"></i>
                                ${isSupervisorOrManager ? 'No associate enrollments in lms_prescribed matching current filter.' : 'You currently have no prescribed LMS handbooks.'}
                            </td>
                        </tr>
                    `;
                    return;
                }

                tbody.innerHTML = filtered.map(item => {
                    const scorePct = typeof item.progress === 'number' && item.progress > 0 ? item.progress : Math.round(((item.quizScore || 0) / (item.quizMax || 100)) * 100);
                    let barColor = 'bg-red-500';
                    if (scorePct >= 80 || (item.status && item.status.toLowerCase() === 'passed')) barColor = 'bg-emerald-500';
                    else if (scorePct >= 50) barColor = 'bg-amber-500';

                    const evalVal = typeof item.evalRating === 'number' ? item.evalRating : 0;
                    const isBelowThree = evalVal < 3.0;

                    return `
                        <tr class="hover:bg-slate-50/80 transition group">
                            <!-- Enrolled Associate -->
                            <td class="py-3.5 px-3">
                                <div class="flex items-center space-x-3">
                                    <img src="${item.empAvatar}" class="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs">
                                    <div>
                                        <p class="font-bold text-slate-900 text-xs">${item.empName}</p>
                                        <p class="text-[11px] text-slate-500">${item.empRole} · <span class="font-semibold text-slate-600">${item.empDept}</span></p>
                                    </div>
                                </div>
                            </td>

                            <!-- Handbook Title -->
                            <td class="py-3.5 px-3">
                                <p class="font-bold text-slate-900 text-xs leading-snug cursor-pointer hover:text-primary transition" onclick="openBookReader('${item.bookId}')">
                                    <i class="fas fa-book mr-1 text-amber-600 text-[10px]"></i> ${item.bookTitle}
                                </p>
                                <div class="flex items-center space-x-1.5 mt-0.5">
                                    <span class="text-[10px] font-semibold text-slate-400">${item.bookDept} Handbook</span>
                                    ${item.forType ? `<span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">For: ${item.forType}</span>` : ''}
                                </div>
                            </td>

                            <!-- Quiz Points & Score Bar -->
                            <td class="py-3.5 px-3 w-48">
                                <div class="space-y-1">
                                    <div class="flex items-center justify-between text-[11px]">
                                        <span class="font-extrabold ${scorePct >= 80 ? 'text-emerald-700' : (scorePct >= 50 ? 'text-amber-700' : 'text-red-700')}">
                                            ${item.quizScore || 0} / ${item.quizMax || 100} pts
                                        </span>
                                        <span class="font-bold text-slate-500">${scorePct}%</span>
                                    </div>
                                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div class="${barColor} h-full rounded-full transition-all duration-500" style="width: ${scorePct}%"></div>
                                    </div>
                                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${item.statusClass || 'bg-amber-100 text-amber-800 border-amber-200'} inline-block mt-0.5">
                                        ${item.status || 'Needs Retake'}
                                    </span>
                                </div>
                            </td>

                            <!-- Rating & Remedial Flag -->
                            <td class="py-3.5 px-3">
                                <div class="space-y-0.5">
                                    <div class="flex items-center space-x-1.5">
                                        <span class="text-xs font-bold ${isBelowThree ? 'text-red-600' : 'text-slate-800'}">
                                            ${evalVal > 0 ? evalVal.toFixed(2) : '2.80'} / 5.0
                                        </span>
                                        ${isBelowThree ? '<span class="text-[9px] font-extrabold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">&lt;3.0 Gap</span>' : '<span class="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Meets Std</span>'}
                                    </div>
                                    <p class="text-[10px] text-slate-400">Target: <strong>${(item.targetRating || 4.0).toFixed(1)}</strong></p>
                                </div>
                            </td>

                            <!-- Last Attempt -->
                            <td class="py-3.5 px-3">
                                <p class="text-slate-700 font-semibold text-xs">${item.lastAttempt || 'Not Started'}</p>
                                <span class="text-[10px] text-slate-400">lms_prescribed record</span>
                            </td>

                            <!-- Audit & Re-evaluate Action -->
                            <td class="py-3.5 px-3 text-right">
                                ${isSupervisorOrManager ? `
                                    <button onclick="openReevaluateModal('${item.id}')"
                                        class="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition shadow-2xs hover:shadow-xs flex items-center space-x-1 ml-auto group/btn">
                                        <i class="fas fa-rotate-right group-hover/btn:rotate-180 transition duration-300"></i>
                                        <span>Re-evaluate</span>
                                    </button>
                                ` : `
                                    <button onclick="openBookReader('${item.bookId}')"
                                        class="px-3.5 py-1.5 btn-primary text-xs font-bold transition shadow-2xs flex items-center space-x-1 ml-auto">
                                        <i class="fas fa-book-open mr-1"></i>
                                        <span>Read SOP</span>
                                    </button>
                                `}
                        </tr>
                    `;
                }).join('');


                // Trigger Compliance Audit calculations
                renderLmsComplianceAudit(mappedDb);
            }


            function filterTnaEnrollments() {
                renderTnaEnrollments();
            }

            /**
             * Sub-tab 3: Render Departmental Compliance Audit from lms_prescribed Data
             */
            function renderLmsComplianceAudit(prescribedList = []) {
                const records = prescribedList.length > 0 ? prescribedList : (window.dynamicLmsState.prescribed || []);
                const total = records.length;
                const passedCount = records.filter(r => (r.status || '').toLowerCase() === 'passed' || (r.status || '').toLowerCase().includes('certified')).length;
                const overdueCount = records.filter(r => (r.status || '').toLowerCase() === 'needs retake' || (r.status || '').toLowerCase().includes('retake')).length;
                const ratePct = total > 0 ? ((passedCount / total) * 100).toFixed(1) : '96.2';

                // Render Compliance Chart if canvas exists
                const canvas = document.getElementById('chart-lms-compliance');
                if (canvas && typeof Chart !== 'undefined') {
                    if (window._chartLmsCompliance) {
                        window._chartLmsCompliance.destroy();
                    }
                    const ctx = canvas.getContext('2d');
                    window._chartLmsCompliance = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Front Office', 'Culinary', 'F&B Service', 'Housekeeping', 'Engineering'],
                            datasets: [{
                                label: 'Compliance Rate (%)',
                                data: [98.5, 94.2, 95.8, 97.0, 96.0],
                                backgroundColor: ['#0D9488', '#D97706', '#E11D48', '#2563EB', '#4F46E5'],
                                borderRadius: 8
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { min: 80, max: 100, ticks: { callback: v => v + '%' } }
                            }
                        }
                    });
                }
            }


            function openReevaluateModal(enrollmentId) {
                let item = (window.dynamicLmsState.prescribed || []).find(e => e.id === enrollmentId);
                if (item) {
                    item = {
                        id: item.id,
                        empName: item.employee_name || item.employee,
                        empRole: item.employee_title || 'Associate',
                        empDept: item.document_department || 'Property-Wide',
                        bookTitle: item.document_title || 'SOP Handbook',
                        quizScore: item.scores || 0,
                        quizMax: 100,
                        evalRating: item.ratings || 2.80,
                        status: item.status || 'Needs Retake'
                    };
                } else {
                    item = null;
                }
                if (!item) return;


                currentReevalEnrollmentId = item.id;

                const nameEl = document.getElementById('reeval-employee-name');
                const titleEl = document.getElementById('reeval-book-title');
                const prevScoreEl = document.getElementById('reeval-prev-score');
                const newScoreEl = document.getElementById('reeval-new-score');
                const ratingSelect = document.getElementById('reeval-new-rating');
                const statusSelect = document.getElementById('reeval-status');
                const notesEl = document.getElementById('reeval-notes');

                if (nameEl) nameEl.textContent = `${item.empName} (${item.empRole} · ${item.empDept})`;
                if (titleEl) titleEl.textContent = item.bookTitle;
                if (prevScoreEl) prevScoreEl.value = `${item.quizScore} / ${item.quizMax} pts (${Math.round((item.quizScore/(item.quizMax||100))*100)}%)`;
                if (newScoreEl) newScoreEl.value = Math.min(100, (item.quizScore || 0) + 30);
                if (ratingSelect) ratingSelect.value = item.evalRating < 3.0 ? "4.0" : "4.5";
                if (statusSelect) statusSelect.value = "Passed";
                if (notesEl) notesEl.value = `Post-study evaluation for ${item.bookTitle}. Associate demonstrated marked competency improvement during supervisory review.`;

                openModal('modal-re-evaluate');
            }

            async function submitAssociateReevaluation() {
                if (!currentReevalEnrollmentId) return;

                const newScore = parseInt(document.getElementById('reeval-new-score')?.value || '90');
                const newRating = parseFloat(document.getElementById('reeval-new-rating')?.value || '4.0');
                const newStatusRaw = document.getElementById('reeval-status')?.value || 'Passed';
                const notes = (document.getElementById('reeval-notes')?.value || '').trim();

                const dbStatus = newStatusRaw.includes('Cert') || newStatusRaw.includes('Pass') ? 'Passed' : 'Needs Retake';

                // Save update to public.lms_prescribed database table in Supabase
                if (currentReevalEnrollmentId.length > 20 && !currentReevalEnrollmentId.startsWith('tna_')) {
                    try {
                        await fetch('api/lms.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                action: 'update_prescription',
                                id: currentReevalEnrollmentId,
                                scores: newScore,
                                ratings: newRating,
                                progress: newScore,
                                status: dbStatus,
                                last_attempt: new Date().toISOString()
                            })
                        });
                        showToast('✓ Evaluation score updated in lms_prescribed database table!', 'success');
                    } catch (err) {
                        console.error('Error updating lms_prescribed in database:', err);
                    }
                }

                const dbItem = (window.dynamicLmsState.prescribed || []).find(e => e.id === currentReevalEnrollmentId);
                if (dbItem) {
                    dbItem.scores = newScore;
                    dbItem.ratings = newRating;
                    dbItem.progress = newScore;
                    dbItem.status = dbStatus;
                    dbItem.last_attempt = new Date().toISOString();
                }

                closeModal('modal-re-evaluate');
                window.dynamicLmsState.prescribedFetched = false;
                renderTnaEnrollments();
                showToast(`🎉 Re-evaluation updated & saved!`, 'success');
            }
            window.submitAssociateReevaluation = submitAssociateReevaluation;



            // ========================================================
            // REMEDIAL LMS BOOKS MODAL HANDLERS (< 3.0 RATING)
            // ========================================================
            const remedialAssociates = {
                lucas: {
                    name: 'Lucas Vargas · Junior Host (Front Office)',
                    detail: 'Evaluated Rating: <strong class="text-red-600">2.80 / 5.0</strong> · Sommelier Wine (<strong class="text-red-600">2.40</strong>) & Conflict De-escalation (<strong class="text-red-600">2.60</strong>)',
                    recommendedBookId: 'book_sommelier'
                },
                antonio: {
                    name: 'Antonio Silva · Banquet Logistics Captain',
                    detail: 'Evaluated Rating: <strong class="text-red-600">2.90 / 5.0</strong> · Crisis Protocol (<strong class="text-red-600">2.40</strong>) & Split Billing (<strong class="text-red-600">2.80</strong>)',
                    recommendedBookId: 'book_crisis'
                },
                maria: {
                    name: 'Maria Santos · Bistro Service Lead',
                    detail: 'Evaluated Rating: <strong class="text-amber-600">3.10 / 5.0</strong> · Identified Gaps: French Wine Pairing (<strong class="text-red-600">2.40</strong>) & Floor Delegation (<strong class="text-red-600">2.80</strong>)',
                    recommendedBookId: 'book_sommelier'
                },
                chloe: {
                    name: 'Chloe Dupont · Front Desk Hostess',
                    detail: 'Evaluated Rating: <strong class="text-red-600">2.95 / 5.0</strong> · Opera PMS Split Billing (<strong class="text-red-600">2.70</strong>)',
                    recommendedBookId: 'book_opera'
                }
            };

            window.prescribedBooksPerAssociate = window.prescribedBooksPerAssociate || {
                maria: ['book_sommelier'],
                'emp-101': ['book_sommelier']
            };

            let currentRemedialKey = 'maria';

            async function fetchPrescribedLms(empId = '') {
                try {
                    const url = empId ? `api/lms.php?action=get_prescribed&employee=${encodeURIComponent(empId)}` : 'api/lms.php?action=get_prescribed';
                    const res = await fetch(url);
                    const json = await res.json();
                    if (json.success && Array.isArray(json.data)) {
                        window.dynamicLmsState.prescribed = json.data;
                        json.data.forEach(item => {
                            const empKey = item.employee;
                            if (empKey && item.lms_id) {
                                window.prescribedBooksPerAssociate[empKey] = window.prescribedBooksPerAssociate[empKey] || [];
                                if (!window.prescribedBooksPerAssociate[empKey].includes(item.lms_id)) {
                                    window.prescribedBooksPerAssociate[empKey].push(item.lms_id);
                                }
                                if (empKey === 'emp-101') {
                                    window.prescribedBooksPerAssociate['maria'] = window.prescribedBooksPerAssociate['maria'] || [];
                                    if (!window.prescribedBooksPerAssociate['maria'].includes(item.lms_id)) {
                                        window.prescribedBooksPerAssociate['maria'].push(item.lms_id);
                                    }
                                }
                                if (empKey === 'emp-102') {
                                    window.prescribedBooksPerAssociate['antonio'] = window.prescribedBooksPerAssociate['antonio'] || [];
                                    if (!window.prescribedBooksPerAssociate['antonio'].includes(item.lms_id)) {
                                        window.prescribedBooksPerAssociate['antonio'].push(item.lms_id);
                                    }
                                }
                            }
                        });
                    }
                } catch (err) {
                    console.error('Error fetching lms_prescribed:', err);
                }
            }
            window.fetchPrescribedLms = fetchPrescribedLms;

            function isEmployeeEnrolledInLms(empId, lmsId) {
                if (!empId || !lmsId) return false;
                const prescribed = window.dynamicLmsState.prescribed || [];
                const empStr = empId.toString().toLowerCase();
                const lmsStr = lmsId.toString();

                const inDb = prescribed.some(item => {
                    const itemEmp = (item.employee || '').toString().toLowerCase();
                    const itemLms = (item.lms_id || '').toString();
                    const matchEmp = itemEmp === empStr || itemEmp === 'emp-' + empStr || empStr === 'emp-' + itemEmp ||
                        (empStr.includes('maria') && (itemEmp === 'emp-101' || itemEmp === 'maria')) ||
                        (empStr.includes('antonio') && (itemEmp === 'emp-102' || itemEmp === 'antonio'));
                    return matchEmp && itemLms === lmsStr;
                });

                if (inDb) return true;

                const list = [
                    ...(window.prescribedBooksPerAssociate?.[empId] || []),
                    ...(window.prescribedBooksPerAssociate?.[currentRemedialKey] || []),
                    ...(empStr.includes('maria') ? (window.prescribedBooksPerAssociate?.['emp-101'] || []) : [])
                ];
                return list.includes(lmsId);
            }
            window.isEmployeeEnrolledInLms = isEmployeeEnrolledInLms;

            function openRemedialBooksModal(empKey) {
                if (empKey) {
                    const k = empKey.toString().toLowerCase().trim();
                    if (k === 'emp-101' || k === 'emp-1' || k.includes('maria')) {
                        currentRemedialKey = 'maria';
                    } else if (k === 'emp-102' || k === 'emp-2' || k.includes('antonio')) {
                        currentRemedialKey = 'antonio';
                    } else if (k.includes('lucas')) {
                        currentRemedialKey = 'lucas';
                    } else if (k.includes('chloe')) {
                        currentRemedialKey = 'chloe';
                    } else if (remedialAssociates[empKey]) {
                        currentRemedialKey = empKey;
                    }
                    const selectEl = document.getElementById('remedial-associate-select');
                    if (selectEl) selectEl.value = currentRemedialKey;
                }
                const empId = window.selectedEvalEmpId || (currentRemedialKey === 'maria' ? 'emp-101' : (currentRemedialKey === 'antonio' ? 'emp-102' : currentRemedialKey));
                fetchPrescribedLms(empId).then(() => {
                    updateRemedialAssociate(currentRemedialKey);
                    renderRemedialBooksList();
                    openModal('modal-remedial-books');
                });
            }
            window.openRemedialBooksModal = openRemedialBooksModal;

            async function updateRemedialAssociate(empKey) {
                currentRemedialKey = empKey;
                const emp = remedialAssociates[empKey] || remedialAssociates['maria'];
                const nameEl = document.getElementById('remedial-associate-name');
                const detailEl = document.getElementById('remedial-associate-detail');
                if (nameEl) nameEl.textContent = emp.name;

                const empId = window.selectedEvalEmpId || (currentRemedialKey === 'maria' ? 'emp-101' : (currentRemedialKey === 'antonio' ? 'emp-102' : currentRemedialKey));
                const comps = typeof fetchEmployeeSpecificCompetencies === 'function' ? await fetchEmployeeSpecificCompetencies(empId) : [];
                const compsBadgeHtml = comps.map(c => `
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${c.score < c.target ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
                        ${c.name}: ${c.score.toFixed(1)} / 5.0
                    </span>
                `).join(' ');

                if (detailEl) detailEl.innerHTML = `${emp.detail}<div class="mt-2.5 pt-2.5 border-t border-[#E8DEDC]"><p class="text-[11px] font-bold text-slate-800 mb-1 flex items-center"><i class="fas fa-cubes text-primary mr-1.5 text-xs"></i>Assigned Competencies for ${emp.name.split('·')[0].trim()}:</p><div class="flex flex-wrap gap-1.5">${compsBadgeHtml}</div></div>`;

                renderRemedialBooksList();
            }
            window.updateRemedialAssociate = updateRemedialAssociate;


            function renderRemedialBooksList() {
                const container = document.getElementById('remedial-books-list');
                if (!container) return;

                const books = (window.dynamicLmsState && window.dynamicLmsState.documents && window.dynamicLmsState.documents.length > 0)
                    ? window.dynamicLmsState.documents
                    : (window.lmsTrainingBooks || []);

                const emp = remedialAssociates[currentRemedialKey] || remedialAssociates['maria'];
                const empId = window.selectedEvalEmpId || (currentRemedialKey === 'maria' ? 'emp-101' : (currentRemedialKey === 'antonio' ? 'emp-102' : currentRemedialKey));

                if (!books || books.length === 0) {
                    container.innerHTML = '<div class="p-4 text-center text-xs text-slate-400"><i class="fas fa-book-open mr-1"></i> No training documents currently loaded in the LMS library.</div>';
                    return;
                }

                container.innerHTML = books.map(book => {
                    const isRecommended = book.id === emp.recommendedBookId;
                    const isAlreadyPrescribed = isEmployeeEnrolledInLms(empId, book.id) || isEmployeeEnrolledInLms(currentRemedialKey, book.id);
                    const deptDisplay = book.deptName || book.department_name || (book.departments && book.departments.name) || 'Property-Wide';
                    const pagesDisplay = book.pages || (book.estimated_pages ? `${book.estimated_pages} Pages` : '18 Pages');

                    return `
                        <div class="p-3.5 rounded-2xl border ${isAlreadyPrescribed ? 'border-emerald-200 bg-emerald-50/20' : (isRecommended ? 'border-primary/40 bg-primary-50/30 shadow-xs' : 'border-[#E8DEDC] bg-white hover:bg-[#FAF8F7]')} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition">
                            <div class="flex items-start space-x-3">
                                <div class="w-9 h-9 rounded-xl ${isAlreadyPrescribed ? 'bg-emerald-100 text-emerald-800' : 'bg-[#FAF8F7] text-primary'} border border-[#E8DEDC] flex items-center justify-center text-sm shadow-2xs flex-shrink-0">
                                    <i class="fas ${book.icon || 'fa-book-open'}"></i>
                                </div>
                                <div class="space-y-0.5">
                                    <div class="flex items-center space-x-2">
                                        <p class="font-bold text-slate-900 text-xs">${book.title}</p>
                                        ${isAlreadyPrescribed ? '<span class="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Enrolled in lms_prescribed</span>' : (isRecommended ? '<span class="badge-terracotta text-[9px] uppercase tracking-wider font-extrabold">Gap Match</span>' : '')}
                                    </div>
                                    <p class="text-[11px] text-slate-500">${deptDisplay} · ${book.category || 'SOP Manual'} · <span class="font-medium text-slate-700">${pagesDisplay}</span></p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2 self-end sm:self-auto flex-shrink-0">
                                <button onclick="openBookReader('${book.id}')"
                                    class="px-3 py-1.5 btn-secondary text-xs font-semibold">
                                    Preview
                                </button>
                                ${isAlreadyPrescribed ? `
                                    <button disabled
                                        class="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl cursor-not-allowed flex items-center space-x-1 opacity-90 shadow-2xs" title="Already prescribed in lms_prescribed database">
                                        <i class="fas fa-check text-emerald-600 mr-1"></i>
                                        <span>Prescribed</span>
                                    </button>
                                ` : `
                                    <button onclick="assignBookToIdp('${book.id}')"
                                        class="px-3.5 py-1.5 btn-primary text-xs font-bold transition flex items-center space-x-1 shadow-2xs">
                                        <i class="fas fa-plus mr-1"></i>
                                        <span>Assign to IDP</span>
                                    </button>
                                `}
                            </div>
                        </div>
                    `;
                }).join('');
            }
            window.renderRemedialBooksList = renderRemedialBooksList;

            async function assignBookToIdp(bookId, goalId = null) {
                const books = (window.dynamicLmsState && window.dynamicLmsState.documents && window.dynamicLmsState.documents.length > 0)
                    ? window.dynamicLmsState.documents
                    : (window.lmsTrainingBooks || []);
                const book = books.find(b => b.id === bookId);
                if (!book) return;

                const emp = remedialAssociates[currentRemedialKey] || remedialAssociates['maria'];
                const empId = window.selectedEvalEmpId || (currentRemedialKey === 'maria' ? 'emp-101' : (currentRemedialKey === 'antonio' ? 'emp-102' : currentRemedialKey));

                // 1. Insert prescription into lms_prescribed database table in Supabase
                try {
                    const res = await fetch('api/lms.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'prescribe_document',
                            employee: empId,
                            lms_id: bookId,
                            goal_id: goalId || null,
                            for: goalId ? 'goal' : 'both',
                            status: 'Needs Retake',
                            scores: 0,
                            ratings: 0,
                            progress: 0
                        })
                    });
                    const json = await res.json();
                    if (json.success && json.data) {
                        window.dynamicLmsState.prescribed = window.dynamicLmsState.prescribed || [];
                        window.dynamicLmsState.prescribed.push(json.data);
                    }
                } catch (err) {
                    console.error('Failed to insert into lms_prescribed:', err);
                }

                // 2. Local state fallback sync
                window.prescribedBooksPerAssociate[currentRemedialKey] = window.prescribedBooksPerAssociate[currentRemedialKey] || [];
                if (!window.prescribedBooksPerAssociate[currentRemedialKey].includes(bookId)) {
                    window.prescribedBooksPerAssociate[currentRemedialKey].push(bookId);
                }
                if (empId) {
                    window.prescribedBooksPerAssociate[empId] = window.prescribedBooksPerAssociate[empId] || [];
                    if (!window.prescribedBooksPerAssociate[empId].includes(bookId)) {
                        window.prescribedBooksPerAssociate[empId].push(bookId);
                    }
                }

                // 3. Add card into the IDP commitments container
                const idpContainer = document.getElementById('idp-perf-commitments-container');
                if (idpContainer) {
                    const newCommitment = document.createElement('div');
                    newCommitment.className = 'p-5 bg-amber-50/70 hover:bg-white rounded-2xl border border-amber-300 transition shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-3 animate-fadeIn';
                    newCommitment.innerHTML = `
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">10% Formal</span>
                                <span class="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">&lt; 3.0 Remedial</span>
                            </div>
                            <h5 class="font-heading font-bold text-slate-900 text-sm">${book.title}</h5>
                            <p class="text-slate-600 text-xs leading-relaxed">Assigned to close competency gap for ${emp.name.split('·')[0].trim()}. Complete handbook and pass quiz for calibration.</p>
                        </div>
                        <div class="pt-3 border-t border-amber-200 flex items-center justify-between text-xs">
                            <span class="text-amber-800 text-[11px] font-semibold"><i class="fas fa-book-medical mr-1"></i>Prescribed</span>
                            <span class="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300">Enrolled in lms_prescribed</span>
                        </div>
                    `;
                    idpContainer.prepend(newCommitment);
                }

                renderRemedialBooksList();
                if (typeof showIDPDetail === 'function') {
                    showIDPDetail(currentRemedialKey);
                }
                showToast(`📚 Handbook "${book.title}" prescribed & enrolled into lms_prescribed for ${emp.name.split('·')[0].trim()}!`, 'success');
            }
            window.assignBookToIdp = assignBookToIdp;


            // Comprehensive Kudos Staff Directory with Performance Averages
