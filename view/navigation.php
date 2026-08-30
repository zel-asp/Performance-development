<div id="mobile-drawer-wrapper"
            class="fixed inset-0 z-50 lg:hidden pointer-events-none transition-all duration-300">
            <!-- Backdrop Overlay -->
            <div id="mobile-drawer-backdrop" onclick="toggleMobileSidebar(false)"
                class="fixed inset-0 bg-[#211A1A]/40 backdrop-blur-xs opacity-0 transition-opacity duration-300 pointer-events-none">
            </div>

            <!-- Slide-Over Drawer Content -->
            <div id="mobile-drawer-panel"
                class="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl flex flex-col h-full overflow-y-auto custom-scrollbar transition-transform duration-300 ease-in-out -translate-x-full pointer-events-auto border-r border-[#E8DEDC]">
                <!-- Header with Close button -->
                <div
                    class="flex items-center justify-between px-5 h-16 border-b border-[#E8DEDC] bg-white sticky top-0 z-10">
                    <div class="flex items-center space-x-2.5">
                        <img src="public/images/removed-bg-logo.png" alt="Oxford Suites Logo" class="h-9 w-auto object-contain">
                        <div>
                            <span class="text-slate-900 font-heading font-bold text-sm tracking-tight block leading-tight">Oxford Suites</span>
                            <span class="text-[10px] font-semibold text-primary block leading-tight">Makati</span>
                        </div>
                    </div>
                    <button onclick="toggleMobileSidebar(false)"
                        class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title="Close Menu">
                        <i class="fas fa-xmark text-base"></i>
                    </button>
                </div>

                <!-- Mobile User Profile -->
                <div class="px-4 py-3 border-b border-[#E8DEDC]">
                    <div
                        class="bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl p-2.5 flex items-center justify-between">
                        <div class="flex items-center space-x-2.5 overflow-hidden">
                            <div
                                class="user-avatar-circle w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                                MS
                            </div>
                            <div class="truncate">
                                <p class="sidebar-user-name text-xs font-bold text-slate-800 truncate">Maria Santos</p>
                                <p class="sidebar-user-dept text-[10px] text-slate-500 truncate">Front Desk Host</p>
                            </div>
                        </div>
                        <span
                            class="role-badge-tag text-[9px] bg-primary-50 text-primary border border-primary-100 font-bold px-1.5 py-0.5 rounded uppercase">Emp</span>
                    </div>
                </div>

                <!-- Navigation Links -->
                <nav class="flex-1 px-3 py-4 space-y-1 text-xs font-medium">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Performance &amp;
                        Development</p>
                    <a href="#" onclick="switchPillar('dashboard'); toggleMobileSidebar(false); return false;"
                        class="nav-item active" data-pillar="dashboard">
                        <i class="fas fa-chart-pie w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Overview Hub</span>
                    </a>
                    <a href="#" onclick="switchPillar('pillar-perf'); toggleMobileSidebar(false); return false;"
                        class="nav-item" data-pillar="pillar-perf">
                        <i class="fas fa-bullseye w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Performance Management</span>
                    </a>
                    <a href="#" onclick="switchPillar('pillar-comp'); toggleMobileSidebar(false); return false;"
                        class="nav-item" data-pillar="pillar-comp">
                        <i class="fas fa-cubes w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Competency Management</span>
                    </a>
                    <a href="#" onclick="switchPillar('pillar-lms'); toggleMobileSidebar(false); return false;"
                        class="nav-item" data-pillar="pillar-lms">
                        <i class="fas fa-graduation-cap w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Learning Management</span>
                    </a>
                    <a href="#" onclick="switchPillar('pillar-training'); toggleMobileSidebar(false); return false;"
                        class="nav-item" data-pillar="pillar-training">
                        <i class="fas fa-chalkboard-user w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Training Management</span>
                    </a>
                    <a href="#" onclick="switchPillar('pillar-succession'); toggleMobileSidebar(false); return false;"
                        class="nav-item" data-pillar="pillar-succession">
                        <i class="fas fa-sitemap w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Succession Planning</span>
                    </a>
                    <a href="#" onclick="switchPillar('pillar-social'); toggleMobileSidebar(false); return false;"
                        class="nav-item" data-pillar="pillar-social">
                        <i class="fas fa-trophy w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Social Recognition</span>
                    </a>
                    <div class="pt-4 border-t border-[#E8DEDC] my-2">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Workspace</p>
                        <a href="#"
                            onclick="switchPillar('pillar-notifications'); toggleMobileSidebar(false); return false;"
                            class="nav-item"
                            data-pillar="pillar-notifications">
                            <i class="fas fa-bell w-5 text-center text-sm"></i>
                            <span class="ml-3">Alerts &amp; Logs</span>
                        </a>
                        <a href="#" onclick="switchPillar('pillar-reports'); toggleMobileSidebar(false); return false;"
                            class="nav-item"
                            data-pillar="pillar-reports">
                            <i class="fas fa-file-invoice w-5 text-center text-sm"></i>
                            <span class="ml-3">Audit Exports</span>
                        </a>
                    </div>
                </nav>

                <!-- Bottom Sign Out -->
                <div class="border-t border-[#E8DEDC] p-3 bg-white sticky bottom-0">
                    <button onclick="logOutToAuth(); toggleMobileSidebar(false);"
                        class="w-full py-2 px-3 rounded-xl border border-[#E8DEDC] hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold flex items-center justify-center space-x-2 transition">
                        <i class="fas fa-right-from-bracket text-xs"></i>
                        <span>Switch Role / Log Out</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="flex h-screen overflow-hidden relative" id="app">

            <!-- ===== STATIC DESKTOP SIDEBAR (Visible Only on lg and above, 100% Static) ===== -->
            <aside id="desktop-sidebar"
                class="hidden lg:flex lg:flex-col w-64 bg-white border-r border-[#E8DEDC] flex-shrink-0 h-full overflow-y-auto custom-scrollbar select-none">

                <!-- Brand Logo Header -->
                <div
                    class="flex items-center justify-between px-6 h-16 border-b border-[#E8DEDC] bg-white sticky top-0 z-10">
                    <div class="flex items-center space-x-2.5">
                        <img src="public/images/removed-bg-logo.png" alt="Oxford Suites Logo" class="h-9 w-auto object-contain">
                        <div>
                            <span class="text-slate-900 font-heading font-bold text-sm tracking-tight block leading-tight">Oxford Suites</span>
                            <span class="text-[10px] font-semibold text-primary block leading-tight">Makati</span>
                        </div>
                    </div>
                </div>

                <!-- Active User Card -->
                <div class="px-4 py-3 border-b border-[#E8DEDC]">
                    <div
                        class="bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl p-2.5 flex items-center justify-between">
                        <div class="flex items-center space-x-2.5 overflow-hidden">
                            <div
                                class="user-avatar-circle w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                                MS
                            </div>
                            <div class="truncate">
                                <p class="sidebar-user-name text-xs font-bold text-slate-800 truncate">Maria Santos
                                </p>
                                <p class="sidebar-user-dept text-[10px] text-slate-500 truncate">Front Desk Host
                                </p>
                            </div>
                        </div>
                        <span
                            class="role-badge-tag text-[9px] bg-primary-50 text-primary border border-primary-100 font-bold px-1.5 py-0.5 rounded uppercase">Emp</span>
                    </div>
                </div>

                <!-- 6 Master Performance & Development Modules -->
                <nav class="flex-1 px-3 py-4 space-y-1 text-xs font-medium" id="sidebar-nav">

                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Performance &amp;
                        Development</p>

                    <!-- 0. Overview Dashboard -->
                    <a href="#" onclick="switchPillar('dashboard'); return false;"
                        class="nav-item active" data-pillar="dashboard">
                        <i class="fas fa-chart-pie w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Overview Hub</span>
                    </a>

                    <!-- 1. Performance Management (7 Lifecycle Stages) -->
                    <a href="#" onclick="switchPillar('pillar-perf'); return false;"
                        class="nav-item" data-pillar="pillar-perf">
                        <i class="fas fa-bullseye w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Performance Management</span>
                    </a>

                    <!-- 2. Competency Management -->
                    <a href="#" onclick="switchPillar('pillar-comp'); return false;"
                        class="nav-item" data-pillar="pillar-comp">
                        <i class="fas fa-cubes w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Competency Management</span>
                    </a>

                    <!-- 3. Learning Management -->
                    <a href="#" onclick="switchPillar('pillar-lms'); return false;"
                        class="nav-item" data-pillar="pillar-lms">
                        <i class="fas fa-graduation-cap w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Learning Management</span>
                    </a>

                    <!-- 4. Training Management -->
                    <a href="#" onclick="switchPillar('pillar-training'); return false;"
                        class="nav-item" data-pillar="pillar-training">
                        <i class="fas fa-chalkboard-user w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Training Management</span>
                    </a>

                    <!-- 5. Succession Planning -->
                    <a href="#" onclick="switchPillar('pillar-succession'); return false;"
                        class="nav-item" data-pillar="pillar-succession">
                        <i class="fas fa-sitemap w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Succession Planning</span>
                    </a>

                    <!-- 6. Social Recognition -->
                    <a href="#" onclick="switchPillar('pillar-social'); return false;"
                        class="nav-item" data-pillar="pillar-social">
                        <i class="fas fa-trophy w-5 text-center text-sm"></i>
                        <span class="ml-3 font-semibold">Social Recognition</span>
                    </a>

                    <div class="pt-4 border-t border-[#E8DEDC] my-2">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Workspace</p>

                        <a href="#" onclick="switchPillar('pillar-notifications'); return false;"
                            class="nav-item"
                            data-pillar="pillar-notifications">
                            <i class="fas fa-bell w-5 text-center text-sm"></i>
                            <span class="ml-3">Alerts &amp; Logs</span>
                        </a>

                        <a href="#" onclick="switchPillar('pillar-reports'); return false;"
                            class="nav-item"
                            data-pillar="pillar-reports">
                            <i class="fas fa-file-invoice w-5 text-center text-sm"></i>
                            <span class="ml-3">Audit Exports</span>
                        </a>
                    </div>
                </nav>

                <!-- Bottom Sign Out Card -->
                <div class="border-t border-[#E8DEDC] p-3 bg-white sticky bottom-0">
                    <button onclick="logOutToAuth()"
                        class="w-full py-2 px-3 rounded-xl border border-[#E8DEDC] hover:border-red-200 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold flex items-center justify-center space-x-2 transition">
                        <i class="fas fa-right-from-bracket text-xs"></i>
                        <span>Switch Role / Log Out</span>
                    </button>
                </div>
            </aside>

            <!-- ===== MAIN CONTENT CONTAINER ===== -->
            <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

                <!-- Clean Top Header Bar -->
                <header
                    class="h-16 bg-white border-b border-[#E8DEDC] px-3 sm:px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-20">

                    <!-- Left: Hamburger Button, Title & Active Cycle Pill -->
                    <div class="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
                        <button id="mobile-hamburger-btn" onclick="toggleMobileSidebar()"
                            aria-label="Toggle navigation menu"
                            class="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 transition shadow-2xs border border-[#E8DEDC] flex-shrink-0">
                            <i class="fas fa-bars-staggered text-sm transition-transform duration-200"
                                id="hamburger-icon"></i>
                        </button>
                        <div class="min-w-0">
                            <div class="flex items-center space-x-2">
                                <h1 id="page-header-title"
                                    class="font-heading font-bold text-sm sm:text-base md:text-lg text-slate-900 truncate">
                                    Performance &amp; Development Hub</h1>
                                <span
                                    class="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sage-50 text-sage-dark border border-sage-100 flex-shrink-0">
                                    <span class="w-1.5 h-1.5 rounded-full bg-sage mr-1.5"></span> Oxford Suites, Makati · 2026 Q3
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Right: HR Quick Tools, Department/Staff Switcher, AI Copilot -->
                    <div class="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 text-xs flex-shrink-0">

                        <!-- Authenticated User Profile Badge -->
                        <div id="header-user-profile"
                            class="flex items-center space-x-2.5 bg-[#FAF8F7] border border-[#E8DEDC] px-3 py-1.5 rounded-2xl shadow-2xs">
                            <img id="nav-user-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                                alt="User Avatar" class="w-7 h-7 rounded-full object-cover border border-[#E8DEDC]">
                            <div class="text-left hidden sm:block">
                                <p id="nav-user-name" class="font-bold text-slate-800 text-[11px] leading-tight">Maria Santos</p>
                                <p id="nav-user-role" class="text-[10px] text-slate-500 leading-tight">Front Desk Host · Front Office</p>
                            </div>
                        </div>

                        <!-- Sign Out Button -->
                        <button onclick="logOutToAuth()" title="Sign Out of Session"
                            class="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#FAF8F7] hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-600 rounded-xl border border-[#E8DEDC] font-semibold transition text-xs shadow-2xs">
                            <i class="fas fa-arrow-right-from-bracket text-xs"></i>
                            <span class="hidden md:inline">Sign Out</span>
                        </button>

                        <!-- AI Copilot Trigger -->
                        <button onclick="openModal('modal-ai-feedback')" title="Open AI Feedback Copilot"
                            class="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-dusty-50 border border-dusty-100 text-dusty-dark rounded-xl font-semibold hover:bg-dusty-100 transition text-xs shadow-2xs">
                            <i class="fas fa-robot text-dusty"></i>
                            <span>AI Copilot</span>
                        </button>

                        <!-- Notifications Bell -->
                        <button onclick="switchPillar('pillar-notifications')"
                            class="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition">
                            <i class="fas fa-bell text-base"></i>
                            <span id="notif-badge"
                                class="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
                        </button>
                    </div>
                </header>

                <!-- Scrollable Viewport with Safe Bottom Spacing for Mobile Nav -->
                <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-28 lg:pb-8 custom-scrollbar">
                    <div class="max-w-7xl mx-auto space-y-5 pb-6 lg:pb-0">

                        <!-- ======================================================== -->
                        <!-- PILLAR 0: DASHBOARD (Overview Hub & System Analytics)     -->
