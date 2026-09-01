/**
 * Oxford Suites, Makati — Learning Management System (LMS)
 * Master Entrypoint (Modular Architecture in js/lms/)
 *
 * Sub-modules:
 * - js/lms/library.js   (Digital SOP Library, Category Filtering & Document Deletion)
 * - js/lms/reader.js    (Interactive SOP Reader & Quiz Launcher)
 * - js/lms/upload.js    (SOP Document Upload Modal & Dropzone)
 * - js/lms/tna.js       (Training Needs Analysis & Compliance Audit)
 * - js/lms/remedial.js  (Remedial LMS Handbooks & IDP Drafting)
 * - js/lms/index.js     (Master Lifecycle Initializer)
 */

// If loaded directly as a standalone fallback, auto-load modular LMS scripts
(function() {
    if (typeof window !== 'undefined' && !window.dynamicLmsState) {
        const scripts = [
            'js/lms/library.js',
            'js/lms/reader.js',
            'js/lms/upload.js',
            'js/lms/tna.js',
            'js/lms/remedial.js',
            'js/lms/index.js'
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
