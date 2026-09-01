/**
 * Oxford Suites, Makati — Performance Management Module
 * Master Entrypoint & Stage Orchestrator
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initPerformanceViews === 'function') {
        initPerformanceViews();
    }
});
