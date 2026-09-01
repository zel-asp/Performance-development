/**
 * Oxford Suites, Makati — Performance Management Module
 * Master Entrypoint (Modular Architecture in js/performance/)
 *
 * Sub-modules:
 * - js/performance/api.js                (PerformanceAPI, Shared State & Helpers)
 * - js/performance/navigation.js         (Sub-Tab Switching, Steppers & Pagination)
 * - js/performance/stage1_planning.js    (Stage 1: Goals & Objectives)
 * - js/performance/stage2_review.js      (Stage 2: Goal Review & General Tasks Matrix)
 * - js/performance/stage3_monitoring.js  (Stage 3: Continuous Monitoring & Milestones)
 * - js/performance/stage4_appraisal.js   (Stage 4: Multi-Factor Appraisals & Rubrics)
 * - js/performance/stage5_calibration.js (Stage 5: Talent Calibration & 9-Box Grid)
 * - js/performance/stage6_development.js (Stage 6: IDP 70-20-10 & Draft Staging)
 * - js/performance/stage7_transition.js  (Stage 7: Review, Transition & Deploy)
 * - js/performance/index.js              (Master Lifecycle Initializer)
 */

// If loaded directly as a standalone fallback, auto-load modular stage scripts
(function() {
    if (typeof window !== 'undefined' && !window.PerformanceAPI) {
        const scripts = [
            'js/performance/api.js',
            'js/performance/navigation.js',
            'js/performance/stage1_planning.js',
            'js/performance/stage2_review.js',
            'js/performance/stage3_monitoring.js',
            'js/performance/stage4_appraisal.js',
            'js/performance/stage5_calibration.js',
            'js/performance/stage6_development.js',
            'js/performance/stage7_transition.js',
            'js/performance/index.js'
        ];
        scripts.forEach(src => {
            if (!document.querySelector(`script[src="${src}"]`)) {
                const s = document.createElement('script');
                s.src = src;
                s.async = false;
                document.head.appendChild(s);
            }
        });
    }
})();
