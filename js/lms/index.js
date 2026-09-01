/**
 * Oxford Suites, Makati — Learning Management System (LMS)
 * Master Entrypoint & Lifecycle Initializer
 */

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof loadLmsDepartments === 'function') {
        loadLmsDepartments();
    }
    if (typeof fetchDynamicLmsDocuments === 'function') {
        await fetchDynamicLmsDocuments();
    }
    if (typeof fetchPrescribedLms === 'function') {
        await fetchPrescribedLms();
    }
    if (typeof renderTnaEnrollments === 'function') {
        renderTnaEnrollments();
    }
    if (typeof initLmsDropzone === 'function') {
        initLmsDropzone();
    }
});
