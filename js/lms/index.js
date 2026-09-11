/**
 * Oxford Suites, Makati — Learning Management System (LMS)
 * Master Entrypoint & Lifecycle Initializer
 */

document.addEventListener('DOMContentLoaded', () => {
    const runLmsBoot = async () => {
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
    };

    const activePillar = localStorage.getItem('oxford_active_pillar') || 'dashboard';
    if (activePillar === 'pillar-lms') {
        runLmsBoot();
    } else {
        if (window.requestIdleCallback) {
            window.requestIdleCallback(runLmsBoot, { timeout: 2500 });
        } else {
            setTimeout(runLmsBoot, 500);
        }
    }
});
