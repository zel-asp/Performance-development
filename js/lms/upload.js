/**
 * Oxford Suites, Makati — Learning Management System (LMS)
 * Sub-Module: Document Upload Modal, File Parsing & Dropzone Handlers
 */

function handleLmsFileSelect(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        window._lmsSelectedFile = file;

        // Auto-fill title from filename if title empty
        const titleInput = document.getElementById('lms-doc-title');
        if (titleInput && !titleInput.value.trim()) {
            const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
            titleInput.value = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        }

        // Show File Chosen Indicator
        const chosenEl = document.getElementById('lms-file-chosen');
        const nameEl = document.getElementById('lms-file-chosen-name');
        const sizeEl = document.getElementById('lms-file-chosen-size');

        if (chosenEl && nameEl && sizeEl) {
            nameEl.textContent = file.name;
            sizeEl.textContent = `(${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
            chosenEl.classList.remove('hidden');
        }
    }
}

function initLmsDropzone() {
    const dropzone = document.getElementById('lms-upload-dropzone');
    const fileInput = document.getElementById('lms-doc-file');
    if (!dropzone || !fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('border-primary', 'bg-primary/5');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('border-primary', 'bg-primary/5');
        }, false);
    });

    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            fileInput.files = files;
            handleLmsFileSelect(fileInput);
        }
    }, false);
}

/**
 * Submit Document Upload & is_mandatory Auto-Prescribe
 */
async function submitLmsDocUpload(e) {
    if (e && e.preventDefault) e.preventDefault();

    const form = document.getElementById('form-lms-upload');
    const fileInput = document.getElementById('lms-doc-file');
    const titleInput = document.getElementById('lms-doc-title');
    const submitBtn = document.getElementById('btn-submit-lms-upload');
    const mandatoryInput = document.getElementById('lms-doc-mandatory');
    const isMandatory = mandatoryInput ? mandatoryInput.checked : false;

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
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5 text-xs"></i><span>Uploading Document...</span>';
    }

    try {
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
            throw new Error(errData.message || `Upload failed with status ${storageRes.status}`);
        }

        const publicUrl = `https://jvxnrgcxegzhyaekxdok.supabase.co/storage/v1/object/public/documents/${storagePath}`;

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
            is_mandatory: isMandatory,
            manatory: isMandatory,
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
            showToast(json.message || `Handbook "${title}" uploaded & published successfully!`, 'success');
            
            // Invalidate local cache
            sessionStorage.removeItem('lms_documents_cache');
            
            // Reset form & state
            if (form) form.reset();
            window._lmsSelectedFile = null;
            const chosenEl = document.getElementById('lms-file-chosen');
            if (chosenEl) chosenEl.classList.add('hidden');

            // Refresh Bookshelf & TNA Category Cards immediately without page reload
            await fetchDynamicLmsDocuments();
            if (typeof fetchNeedsAnalysisData === 'function') {
                await fetchNeedsAnalysisData();
            }
            if (typeof fetchPrescribedLms === 'function') {
                await fetchPrescribedLms();
            }
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

window.handleLmsFileSelect = handleLmsFileSelect;
window.initLmsDropzone = initLmsDropzone;
window.submitLmsDocUpload = submitLmsDocUpload;
