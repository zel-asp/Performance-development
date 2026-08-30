<?php require_once 'config/config.php'; ?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Oxford Suites, Makati · Performance and Development Hub</title>
        <link rel="icon" type="image/png" href="public/images/removed-bg-logo.png">
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

        <!-- Pillar & Sub-Panel Display System -->
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
        </style>
    </head>

    <body class="bg-[#FAF8F7] text-[#211A1A] antialiased h-screen flex flex-col overflow-hidden">
        <!-- Sonner Toaster Container with Dismiss/Close (X) Button (Max 3, 3s Duration) -->
        <ol id="sonner-toast-container" position="top-right" max-toasts="3" duration="2000" rich-colors="true" close-button="true" theme="light"></ol>

        <!-- 1. Authentication & Role Demo Screen -->
        <?php include_once 'view/auth.php'; ?>

        <!-- 2. Interactive Dialogs & Modals -->
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
