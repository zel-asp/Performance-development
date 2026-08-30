<?php require_once 'config/config.php'; ?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Oxford Suites, Makati · Performance and Development Hub</title>
        <link rel="icon" type="image/png" href="public/images/removed-bg-logo.png">

        <!-- Session Authentication Guard & Zero-Flash Pre-hydration -->
        <script>
            (function() {
                try {
                    if (localStorage.getItem('oxford_session_auth') !== 'true') {
                        window.location.replace('login.php');
                        return;
                    }
                    var role = (localStorage.getItem('oxford_session_role') || 'associate').toLowerCase().trim();
                    var isAssociate = (role === 'associate' || role === 'employee' || role === 'staff');
                    
                    document.documentElement.setAttribute('data-user-role', role);
                    if (isAssociate) {
                        document.documentElement.classList.add('role-associate');
                        document.documentElement.classList.remove('role-management');
                    } else {
                        document.documentElement.classList.add('role-management');
                        document.documentElement.classList.remove('role-associate');
                    }
                } catch (e) {}
            })();
        </script>

        <!-- Google Fonts: Inter & Outfit -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap"
            rel="stylesheet">
        <!-- Tailwind CSS CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Font Awesome Icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <!-- Chart.js CDN -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <!-- Dynamic Supabase Configuration from Environment -->
        <script>
            window.SUPABASE_CONFIG = {
                url: '<?php echo rtrim(SUPABASE_URL, "/"); ?>',
                anonKey: '<?php echo SUPABASE_ANON_KEY; ?>'
            };
        </script>

        <!-- Sonner Toast (vanilla) CSS -->
        <link href="https://cdn.jsdelivr.net/npm/vanilla-sonner@latest/dist/vanilla-sonner.min.css" rel="stylesheet" />

        <!-- Sonner Toast Controller & Global Shim with Max 3 FIFO Queue & 3s Auto-Dismiss -->
        <script>
            window._toastQueue = [];

            window._activeToastIds = [];
            const MAX_VISIBLE_TOASTS = 3;
            const TOAST_DURATION = 2000;

            window.showToast = function(msg, type = 'info') {
                if (window.toast) {
                    while (window._activeToastIds.length >= MAX_VISIBLE_TOASTS) {
                        const oldestId = window._activeToastIds.shift();
                        if (oldestId !== undefined) {
                            window.toast.dismiss(oldestId);
                        }
                    }
                    const options = { duration: TOAST_DURATION };
                    let id;
                    if (type === 'success') id = window.toast.success(msg, options);
                    else if (type === 'error') id = window.toast.error(msg, options);
                    else if (type === 'warning') id = window.toast.warning(msg, options);
                    else id = window.toast.info(msg, options);

                    if (id !== undefined) {
                        window._activeToastIds.push(id);
                        setTimeout(() => {
                            const idx = window._activeToastIds.indexOf(id);
                            if (idx > -1) window._activeToastIds.splice(idx, 1);
                        }, TOAST_DURATION);
                    }
                } else {
                    window._toastQueue.push({ msg, type });
                }
            };
        </script>
        <script type="module">
            import { toast } from 'https://cdn.jsdelivr.net/npm/vanilla-sonner/+esm';
            window.toast = toast;
            if (window._toastQueue && window._toastQueue.length > 0) {
                window._toastQueue.forEach(t => window.showToast(t.msg, t.type));
                window._toastQueue = [];
            }
        </script>

        <!-- Tailwind Theme Configuration -->
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            primary: {
                                DEFAULT: '#9E1B20',
                                dark: '#7A1519',
                                light: '#B9363B',
                                50: '#FFF5F5',
                                100: '#FDE8E8',
                                200: '#F9CACA',
                                500: '#9E1B20',
                                600: '#7A1519',
                                700: '#631013',
                            },
                            sage: {
                                DEFAULT: '#7A9A7E',
                                dark: '#607C64',
                                light: '#A8C0AA',
                                50: '#F4F7F4',
                                100: '#E5EDE6',
                                200: '#C9DBCB',
                                500: '#7A9A7E',
                                600: '#607C64',
                            },
                            gold: {
                                DEFAULT: '#C89B3C',
                                dark: '#A57C28',
                                light: '#F5EBD2',
                                50: '#FDFBF7',
                                100: '#F7EED9',
                                200: '#EEDBB3',
                                500: '#C89B3C',
                            },
                            dusty: {
                                DEFAULT: '#6B8FA3',
                                dark: '#527387',
                                light: '#E8F0F4',
                                50: '#F4F8FA',
                                100: '#E1ECF2',
                                200: '#C3D9E4',
                                500: '#6B8FA3',
                            },
                            terracotta: {
                                DEFAULT: '#C47762',
                                dark: '#A85D49',
                                light: '#F8EAE5',
                                50: '#FCF5F3',
                                100: '#F7E4DE',
                                200: '#ECC8BE',
                                500: '#C47762',
                            },
                            brand: {
                                canvas: '#FAF8F7',
                                surface: '#FFFFFF',
                                border: '#E8DEDC',
                                borderLight: '#F1E9E7',
                                textMain: '#211A1A',
                                textMuted: '#6F6261',
                                textSubtle: '#9C8F8D',
                            }
                        },
                        fontFamily: {
                            sans: ['Inter', 'system-ui', 'sans-serif'],
                            heading: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
                        }
                    }
                }
            }
        </script>

        <!-- Compiled Tailwind CSS -->
        <link rel="stylesheet" href="dist/output.css">

        <!-- Pillar & Sub-Panel Display System + Instant Zero-Flash Role Privacy Rules -->
        <style>
            .pillar-panel {
                display: none !important;
            }
            .pillar-panel.active {
                display: block !important;
            }

            .sub-panel,
            .sub-panel-dashboard,
            .sub-panel-perf,
            .sub-panel-comp,
            .sub-panel-lms,
            .sub-panel-training,
            .sub-panel-succession,
            .sub-panel-social {
                display: none !important;
            }

            .sub-panel.active,
            .sub-panel-dashboard.active,
            .sub-panel-perf.active,
            .sub-panel-comp.active,
            .sub-panel-lms.active,
            .sub-panel-training.active,
            .sub-panel-succession.active,
            .sub-panel-social.active {
                display: block !important;
                animation: subPanelFadeIn 0.15s ease-in-out;
            }

            @keyframes subPanelFadeIn {
                from { opacity: 0; transform: translateY(2px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Zero-Flash RBAC Guard Styles - Instantly hide privileged navigation & management tools for Associate */
            html.role-associate [data-pillar="pillar-perf"],
            html.role-associate [data-pillar="pillar-succession"],
            html.role-associate [data-pillar="pillar-reports"],
            html.role-associate [data-sub="system"],
            html.role-associate #btn-create-program,
            html.role-associate #btn-schedule-session,
            html.role-associate #btn-mark-all-attended,
            html.role-associate #comp-conduct-eval-box,
            html.role-associate #comp-tna-skills-gap-card,
            html.role-associate #subtab-btn-comp-profiles,
            html.role-associate [data-sub="schedules"].subnav-training {
                display: none !important;
            }

            html.role-associate #subtab-btn-comp-assessment,
            html.role-associate #subtab-btn-comp-development {
                display: inline-flex !important;
            }

            html.role-management #subtab-btn-comp-profiles,
            html.role-management #subtab-btn-comp-assessment,
            html.role-management #subtab-btn-comp-development {
                display: inline-flex !important;
            }

            /* ======================================================== */
            /* LUXURY MINIMALIST MODAL SYSTEM (Less Colors, Clean Layout) */
            /* ======================================================== */
            .modal-overlay {
                background-color: rgba(15, 23, 42, 0.45) !important;
                backdrop-filter: blur(8px) !important;
                -webkit-backdrop-filter: blur(8px) !important;
            }

            .modal-card {
                background: #FFFFFF !important;
                border-radius: 1.5rem !important;
                border: 1px solid #E2E8F0 !important;
                box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.04) !important;
            }

            /* Clean Modal Headers */
            .modal-card > div:first-child:not(.p-6),
            .modal-card > header {
                background: #FFFFFF !important;
                border-bottom: 1px solid #F1F5F9 !important;
            }

            /* Clean Modal Footers */
            .modal-card > div:last-child:not(.p-6):not(.space-y-4),
            .modal-card > footer {
                background: #F8FAFC !important;
                border-top: 1px solid #F1F5F9 !important;
            }

            /* Universal Clean Modal Inputs & Dropdowns */
            .modal-card input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"]),
            .modal-card select,
            .modal-card textarea {
                background-color: #F8FAFC !important;
                border: 1px solid #E2E8F0 !important;
                color: #1E293B !important;
                border-radius: 0.75rem !important;
                font-size: 0.75rem !important;
                transition: all 0.15s ease !important;
            }

            .modal-card input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"]):focus,
            .modal-card select:focus,
            .modal-card textarea:focus {
                background-color: #FFFFFF !important;
                border-color: #9E1B20 !important;
                box-shadow: 0 0 0 3px rgba(158, 27, 32, 0.1) !important;
                outline: none !important;
            }

            /* Subdue excessive colorful info boxes inside modals */
            .modal-card .bg-purple-50,
            .modal-card [class*="bg-purple-50/"],
            .modal-card .bg-blue-50,
            .modal-card [class*="bg-blue-50/"],
            .modal-card .bg-indigo-50,
            .modal-card [class*="bg-indigo-50/"],
            .modal-card .bg-dusty-50,
            .modal-card [class*="bg-dusty-50/"],
            .modal-card .bg-gold-50,
            .modal-card [class*="bg-gold-50/"],
            .modal-card .bg-sage-50,
            .modal-card [class*="bg-sage-50/"] {
                background-color: #F8FAFC !important;
                border-color: #E2E8F0 !important;
                color: #334155 !important;
            }

            /* Subdue colored text in modal labels */
            .modal-card [class*="text-purple-"],
            .modal-card [class*="text-indigo-"],
            .modal-card [class*="text-blue-"],
            .modal-card [class*="text-dusty-"],
            .modal-card [class*="text-sage-"] {
                color: #334155 !important;
            }

            /* Neutral subtle badges in modals */
            .modal-card .bg-purple-100,
            .modal-card .bg-blue-100,
            .modal-card .bg-indigo-100,
            .modal-card .badge-dusty,
            .modal-card .badge-sage,
            .modal-card .badge-gold {
                background-color: #F1F5F9 !important;
                color: #475569 !important;
                border: 1px solid #E2E8F0 !important;
            }

            /* Clean Semantic Badges */
            .modal-card .bg-emerald-50,
            .modal-card .bg-emerald-100 {
                background-color: #F0FDF4 !important;
                color: #166534 !important;
                border-color: #BBF7D0 !important;
            }

            .modal-card .bg-rose-50,
            .modal-card .bg-rose-100 {
                background-color: #FFF1F2 !important;
                color: #9F1239 !important;
                border-color: #FECDD3 !important;
            }

            .modal-card .bg-amber-50,
            .modal-card .bg-amber-100 {
                background-color: #FFFBEB !important;
                color: #92400E !important;
                border-color: #FDE68A !important;
            }
        </style>
    </head>

    <body class="bg-[#FAF8F7] text-[#211A1A] antialiased h-screen flex flex-col overflow-hidden">
        <!-- Early Pre-hydration of User Context -->
        <script>
            (function() {
                try {
                    var role = (localStorage.getItem('oxford_session_role') || 'associate').toLowerCase().trim();
                    var rawUser = localStorage.getItem('oxford_session_user');
                    var user = rawUser ? JSON.parse(rawUser) : null;
                    window.activePersonaRole = role === 'supervisor' ? 'Supervisor' : (role === 'hradmin' ? 'HRAdmin' : (role === 'generalmanager' ? 'GeneralManager' : 'Associate'));
                    window.activePersonaKey = role;
                    if (user) window.currentUser = user;
                } catch(e) {}
            })();
        </script>

        <!-- Sonner Toaster Container with Dismiss/Close (X) Button (Max 3, 3s Duration) -->
        <ol id="sonner-toast-container" position="top-right" max-toasts="3" duration="2000" rich-colors="true" close-button="true" theme="light"></ol>

        <!-- 1. Interactive Dialogs & Modals -->
        <?php include_once 'view/modals.php'; ?>

        <!-- 3. Navigation & Header Layout -->
        <?php include_once 'view/navigation.php'; ?>

        <!-- Tab 0: Overview Hub & Dashboard -->
        <?php include_once 'view/overview.php'; ?>

        <!-- Tab 1: Performance Management (7-Stage Continuous Cycle) -->
        <?php include_once 'view/performance.php'; ?>

        <!-- Tab 2: Competency Management & Radar Benchmark -->
        <?php include_once 'view/competencies.php'; ?>

        <!-- Tab 3: Learning Management System (LMS 3D Books & TNA Live Audit) -->
        <?php include_once 'view/lms.php'; ?>

        <!-- Tab 4: Training Operations (12 Functions) -->
        <?php include_once 'view/training.php'; ?>

        <!-- Tab 5: Succession Planning & 9-Box Talent Grid -->
        <?php include_once 'view/succession.php'; ?>

        <!-- Tab 6: Social Recognition, Gamified XP & Shift Climate -->
        <?php include_once 'view/social.php'; ?>

        <!-- Tab 7: Alerts & Notifications Hub -->
        <?php include_once 'view/notifications.php'; ?>

        <!-- Tab 8: Executive Reports & BI Analytics Export -->
        <?php include_once 'view/reports.php'; ?>

        <!-- Layout Footer & Mobile Bottom Navigation -->
        <?php include_once 'view/footer.php'; ?>

        <!-- External Modular JavaScript Scripts from js/ -->
        <script src="js/charts.js"></script>
        <script src="js/performance.js"></script>
        <script src="js/competencies.js"></script>
        <script src="js/lms.js"></script>
        <script src="js/training.js"></script>
        <script src="js/succession.js"></script>
        <script src="js/kudos.js"></script>
        <script src="js/notifications.js"></script>
        <!-- SheetJS: Real Excel .xlsx export -->
        <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
        <script src="js/reports.js"></script>
        <script src="js/app.js"></script>
    </body>
</html>
