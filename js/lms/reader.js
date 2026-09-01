/**
 * Oxford Suites, Makati — Learning Management System (LMS)
 * Sub-Module: Interactive SOP Document Reader & Quiz Launcher
 */

function switchReaderTab(tabKey) {
    const btnViewer = document.getElementById('tab-btn-reader-viewer');
    const btnDetails = document.getElementById('tab-btn-reader-details');
    const panelViewer = document.getElementById('reader-panel-viewer');
    const panelDetails = document.getElementById('reader-panel-details');

    if (tabKey === 'viewer') {
        if (btnViewer) btnViewer.className = 'px-3 py-1.5 rounded-xl font-bold bg-primary text-white shadow-2xs transition text-xs flex items-center space-x-1.5';
        if (btnDetails) btnDetails.className = 'px-3 py-1.5 rounded-xl font-semibold bg-white text-slate-700 border border-[#E8DEDC] hover:bg-slate-100 transition text-xs flex items-center space-x-1.5';
        if (panelViewer) panelViewer.classList.remove('hidden');
        if (panelDetails) panelDetails.classList.add('hidden');
    } else {
        if (btnViewer) btnViewer.className = 'px-3 py-1.5 rounded-xl font-semibold bg-white text-slate-700 border border-[#E8DEDC] hover:bg-slate-100 transition text-xs flex items-center space-x-1.5';
        if (btnDetails) btnDetails.className = 'px-3 py-1.5 rounded-xl font-bold bg-primary text-white shadow-2xs transition text-xs flex items-center space-x-1.5';
        if (panelViewer) panelViewer.classList.add('hidden');
        if (panelDetails) panelDetails.classList.remove('hidden');
    }
}
window.switchReaderTab = switchReaderTab;

/**
 * Open Document in Reader Modal with Live Supabase File Link & Actual Content
 */
function openBookReader(docId) {
    const doc = (window.dynamicLmsState.documents || []).find(d => d.id === docId);
    if (!doc) return;

    currentReadingBookId = doc.id;

    // Update Header
    const titleEl = document.getElementById('reader-book-title');
    if (titleEl) titleEl.textContent = doc.title || 'SOP Document';

    const deptName = doc.department_name || 'Property-Wide';
    const pages = doc.estimated_pages ? `${doc.estimated_pages} Pages` : '18 Pages';
    const time = doc.estimated_reading_minutes ? `${doc.estimated_reading_minutes} min read` : '20 min read';
    
    const authorEl = document.getElementById('reader-book-author');
    if (authorEl) authorEl.textContent = `${deptName} · ${doc.category || 'SOP Manual'} · ${pages} · ${time}`;

    const xpEl = document.getElementById('reader-book-xp-badge');
    if (xpEl) xpEl.textContent = `+${doc.exp_reward || 100} XP Completion`;

    // Mandatory Badge
    const mandBadge = document.getElementById('reader-book-mandatory-badge');
    if (mandBadge) {
        const isMand = !!doc.manatory || !!doc.is_mandatory;
        if (isMand) {
            mandBadge.classList.remove('hidden');
        } else {
            mandBadge.classList.add('hidden');
        }
    }

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

    const fileInfoBadge = document.getElementById('reader-file-info-badge');
    if (fileInfoBadge) {
        const sizeStr = doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : '';
        fileInfoBadge.textContent = `${doc.file_name || 'document.pdf'} ${sizeStr ? `(${sizeStr})` : ''}`;
    }

    // Embed Actual Document Viewer
    const iframeContainer = document.getElementById('reader-iframe-container');
    if (iframeContainer) {
        const filePath = doc.file_path || '';
        const fileType = (doc.file_type || '').toLowerCase();
        const isPdf = fileType.includes('pdf') || filePath.toLowerCase().endsWith('.pdf');
        const isOfficeDoc = fileType.includes('word') || fileType.includes('officedocument') || filePath.toLowerCase().endsWith('.docx') || filePath.toLowerCase().endsWith('.doc') || filePath.toLowerCase().endsWith('.pptx');

        if (filePath && filePath !== '#') {
            if (isPdf) {
                iframeContainer.innerHTML = `
                    <iframe src="${filePath}#toolbar=1&navpanes=0" 
                        class="w-full h-[540px] rounded-xl border border-slate-200 bg-slate-50" 
                        title="${doc.title}"
                        loading="lazy">
                    </iframe>
                `;
            } else if (isOfficeDoc) {
                // Use Microsoft Office Online Embed Viewer with fallback link
                const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(filePath)}`;
                iframeContainer.innerHTML = `
                    <div class="w-full space-y-3">
                        <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                            <span class="text-blue-900 font-semibold flex items-center"><i class="fas fa-file-word text-blue-600 mr-1.5"></i> DOCX Document Preview</span>
                            <a href="${filePath}" target="_blank" download class="btn-primary px-3 py-1 text-xs font-bold shadow-2xs">Download Original &darr;</a>
                        </div>
                        <iframe src="${officeViewerUrl}" 
                            class="w-full h-[480px] rounded-xl border border-slate-200 bg-white" 
                            title="${doc.title}">
                        </iframe>
                    </div>
                `;
            } else {
                iframeContainer.innerHTML = `
                    <iframe src="${filePath}" 
                        class="w-full h-[540px] rounded-xl border border-slate-200 bg-white" 
                        title="${doc.title}">
                    </iframe>
                `;
            }
        } else {
            iframeContainer.innerHTML = `
                <div class="py-16 text-center text-slate-400 space-y-3">
                    <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300 text-2xl">
                        <i class="fas fa-file-circle-question"></i>
                    </div>
                    <p class="font-bold text-slate-700 text-sm">No Document File Uploaded</p>
                    <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">This standard operating procedure manual does not have an attached PDF or document file.</p>
                </div>
            `;
        }
    }

    // Set Structured SOP Guide Content with Actual Data
    const descEl = document.getElementById('reader-full-description');
    if (descEl) {
        descEl.innerHTML = `
            <p class="font-bold text-slate-900 text-xs">${doc.title}</p>
            <p class="text-xs text-slate-600 leading-relaxed">${doc.description || 'Standard operating procedure manual and operational workflow guidance.'}</p>
            <div class="pt-2 flex items-center space-x-2 text-[11px] font-semibold text-slate-500">
                <span class="badge-secondary text-[10px]">${deptName}</span>
                <span>·</span>
                <span>${doc.category || 'SOP Manual'}</span>
            </div>
        `;
    }

    const outcomesEl = document.getElementById('reader-full-outcomes');
    if (outcomesEl) {
        const outcomesList = (doc.learning_outcomes || 'Understand operational hospitality standards and procedural benchmarks.')
            .split('\n')
            .filter(Boolean);
        outcomesEl.innerHTML = outcomesList.map(o => `
            <div class="flex items-start space-x-2 text-xs text-slate-700 leading-relaxed">
                <i class="fas fa-circle-check text-emerald-600 text-[11px] mt-1 flex-shrink-0"></i>
                <span>${o}</span>
            </div>
        `).join('');
    }

    const tipEl = document.getElementById('reader-tip-text');
    if (tipEl) {
        tipEl.textContent = doc.learning_outcomes 
            ? doc.learning_outcomes.split('\n')[0] 
            : 'Always maintain 5-star standard compliance and hospitality excellence across all touchpoints.';
    }

    // Specs
    const specCat = document.getElementById('reader-spec-category');
    if (specCat) specCat.textContent = doc.category || 'SOP Manual';

    const specDept = document.getElementById('reader-spec-dept');
    if (specDept) specDept.textContent = deptName;

    const specReading = document.getElementById('reader-spec-reading');
    if (specReading) specReading.textContent = `${pages} · ${time}`;

    const specXp = document.getElementById('reader-spec-xp');
    if (specXp) specXp.textContent = `+${doc.exp_reward || 100} XP`;

    // Default to Document Viewer Tab
    switchReaderTab('viewer');

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
