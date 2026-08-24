<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pulse · Hotel & Restaurant Performance and Development System</title>
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

        <!-- Tailwind Theme Configuration -->
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            primary: {
                                DEFAULT: '#9E1B20',
                                dark: '#7F1418',
                                light: '#B92B30',
                                50: '#FEF2F2',
                                100: '#FEE2E2',
                                200: '#FECACA',
                                500: '#9E1B20',
                                600: '#7F1418',
                                700: '#631013',
                            },
                            brand: {
                                slate: '#0F172A',
                                surface: '#FFFFFF',
                                bg: '#F8FAFC',
                                muted: '#64748B',
                                border: '#E2E8F0'
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

        <!-- External Stylesheet from css/ -->
        <link rel="stylesheet" href="css/styles.css">
    </head>

    <body class="bg-brand-bg text-slate-800 antialiased h-screen flex flex-col overflow-hidden">

        <!-- Toast Notifications Hub -->
        <div id="toast-container"></div>

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
        <script src="js/lms.js"></script>
        <script src="js/kudos.js"></script>
        <script src="js/app.js"></script>
    </body>
</html>
