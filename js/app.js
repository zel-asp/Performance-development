// State
let currentXP = 300;
let totalGoals = 8;
let completedGoals = 6;
let activePersonaKey = 'employee';

// Global Chart instances (instantiated by charts.js)
var chartPerfTrendInstance = window.chartPerfTrendInstance || null;
var chartSentimentDoughnutInstance = window.chartSentimentDoughnutInstance || null;
var chartCompetencyRadarInstance = window.chartCompetencyRadarInstance || null;
var chartLmsComplianceInstance = window.chartLmsComplianceInstance || null;
var chartHourlySentimentInstance = window.chartHourlySentimentInstance || null;
var chartSystemDeptProgressInstance = window.chartSystemDeptProgressInstance || null;

// Dynamic Modal Stack Controller (Fixes nested modal overlap / z-index collisions)
window.activeModalStack = window.activeModalStack || [];

function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
        // Remove if already in stack to prevent duplicate references
        window.activeModalStack = window.activeModalStack.filter(mId => mId !== id);
        window.activeModalStack.push(id);

        // Dynamically calculate z-index so every nested child modal opens securely ON TOP
        const stackLevel = window.activeModalStack.length;
        const calculatedZIndex = 50 + (stackLevel * 20);
        el.style.zIndex = calculatedZIndex;

        el.classList.remove('hidden');
        el.classList.add('flex');
        document.body.classList.add('overflow-hidden');

        if (id === 'modal-recognition' && typeof initKudosRosterModal === 'function') {
            initKudosRosterModal();
        }
        if (id === 'modal-create-goal') {
            const scopeContainer = document.getElementById('goal-target-scope')?.closest('.bg-purple-50\\/60, .p-3');
            const scopeSelect = document.getElementById('goal-target-scope');
            const currentUserId = window.currentUser?.id || (window.activePersonaRole === 'Supervisor' ? 'emp-102' : 'emp-101');
            const isAssociate = (window.activePersonaRole === 'Associate' || activePersonaKey === 'associate' || activePersonaKey === 'employee');

            if (scopeSelect) {
                scopeSelect.value = currentUserId;
                if (typeof handleGoalScopeChange === 'function') {
                    handleGoalScopeChange(scopeSelect);
                }
            }

            if (isAssociate) {
                if (scopeContainer) scopeContainer.classList.add('hidden');
            } else {
                if (scopeContainer) scopeContainer.classList.remove('hidden');
            }
        }
    }
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('hidden');
        el.classList.remove('flex');
        el.style.zIndex = '';

        window.activeModalStack = window.activeModalStack.filter(mId => mId !== id);
        if (window.activeModalStack.length === 0) {
            document.body.classList.remove('overflow-hidden');
        }
    }
}

// Global ESC key listener to safely dismiss topmost active modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.activeModalStack && window.activeModalStack.length > 0) {
        const topModalId = window.activeModalStack[window.activeModalStack.length - 1];
        closeModal(topModalId);
    }
});

// Toasts — delegated to Sonner via window.showToast (see index.php module script)

// Mobile Sidebar Controller with Smooth Animation
let isMobileSidebarOpen = false;

// Dedicated Mobile Drawer Controller (Mobile Only)
let isMobileDrawerOpen = false;

function toggleMobileSidebar(forceState) {
    const wrapper = document.getElementById('mobile-drawer-wrapper');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const panel = document.getElementById('mobile-drawer-panel');
    const hamburgerIcon = document.getElementById('hamburger-icon');

    if (!wrapper || !backdrop || !panel) return;

    if (typeof forceState === 'boolean') {
        isMobileDrawerOpen = forceState;
    } else {
        isMobileDrawerOpen = !isMobileDrawerOpen;
    }

    if (isMobileDrawerOpen) {
        wrapper.classList.remove('pointer-events-none');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100', 'pointer-events-auto');
        panel.classList.remove('-translate-x-full');
        panel.classList.add('translate-x-0');
        if (hamburgerIcon) {
            hamburgerIcon.classList.remove('fa-bars-staggered');
            hamburgerIcon.classList.add('fa-xmark');
        }
        document.body.classList.add('overflow-hidden', 'lg:overflow-auto');
    } else {
        wrapper.classList.add('pointer-events-none');
        backdrop.classList.remove('opacity-100', 'pointer-events-auto');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        panel.classList.remove('translate-x-0');
        panel.classList.add('-translate-x-full');
        if (hamburgerIcon) {
            hamburgerIcon.classList.remove('fa-xmark');
            hamburgerIcon.classList.add('fa-bars-staggered');
        }
        document.body.classList.remove('overflow-hidden');
    }
}

// Window resize handler to cleanly reset mobile drawer if scaled up to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && isMobileDrawerOpen) {
        toggleMobileSidebar(false);
    }
});

// Master Pillar Switcher
function switchPillar(pillarKey) {
    // Auto close mobile sidebar on navigation selection
    if (window.innerWidth < 1024) {
        toggleMobileSidebar(false);
    }

    // Persist active pillar to localStorage
    try {
        localStorage.setItem('oxford_active_pillar', pillarKey);
    } catch (e) {}

    // Panels
    document.querySelectorAll('.pillar-panel').forEach(panel => {
        panel.classList.remove('active');
        panel.classList.add('hidden');
    });
    const targetPanel = document.getElementById('panel-' + pillarKey);
    if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.classList.remove('hidden');
    }

    // Sidebar
    document.querySelectorAll('#sidebar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-pillar') === pillarKey) {
            item.classList.add('active');
        }
    });

    // Mobile Nav
    document.querySelectorAll('#mobile-nav .mobile-nav-btn').forEach(btn => {
        btn.classList.remove('active', 'text-primary', 'font-bold');
        btn.classList.add('text-slate-400');
        if (btn.getAttribute('data-pillar') === pillarKey) {
            btn.classList.add('active', 'text-primary', 'font-bold');
            btn.classList.remove('text-slate-400');
        }
    });

    // Resize charts if visible & refresh dynamic data
    setTimeout(() => {
        if (pillarKey === 'dashboard') {
            if (chartPerfTrendInstance) chartPerfTrendInstance.resize();
            if (chartSentimentDoughnutInstance) chartSentimentDoughnutInstance.resize();
            if (chartSystemDeptProgressInstance) chartSystemDeptProgressInstance.resize();
            if (typeof loadAndRenderPlanningGoals === 'function') loadAndRenderPlanningGoals();
        } else if (pillarKey === 'pillar-perf') {
            if (typeof loadAndRenderPlanningGoals === 'function') loadAndRenderPlanningGoals();
            if (typeof loadAndRenderMonitoringData === 'function') loadAndRenderMonitoringData();
        } else if (pillarKey === 'pillar-comp') {
            if (chartCompetencyRadarInstance) chartCompetencyRadarInstance.resize();
            if (typeof renderRoleCompetencyFramework === 'function') renderRoleCompetencyFramework();
            if (typeof renderCompetencyMatrixTable === 'function') renderCompetencyMatrixTable();
        } else if (pillarKey === 'pillar-lms') {
            if (chartLmsComplianceInstance) chartLmsComplianceInstance.resize();
            if (typeof renderLmsBooks === 'function') renderLmsBooks();
            if (typeof renderTnaEnrollments === 'function') renderTnaEnrollments();
        } else if (pillarKey === 'pillar-training') {
            if (typeof renderTrainingProgramsView === 'function') renderTrainingProgramsView();
            if (typeof renderTrainingNeedsAnalysisView === 'function') renderTrainingNeedsAnalysisView();
        } else if (pillarKey === 'pillar-succession') {
            if (typeof renderSuccession9BoxGrid === 'function') renderSuccession9BoxGrid();
            if (typeof renderSuccessionBenchView === 'function') renderSuccessionBenchView();
        } else if (pillarKey === 'pillar-social') {
            if (chartHourlySentimentInstance) chartHourlySentimentInstance.resize();
            if (typeof initSocialRecognition === 'function') initSocialRecognition();
            else if (typeof renderSocialFeed === 'function') renderSocialFeed();
        } else if (pillarKey === 'pillar-notifications') {
            if (typeof loadLiveNotifications === 'function') loadLiveNotifications(window.activePersonaRole || 'Associate', window.currentUser?.id);
        } else if (pillarKey === 'pillar-reports') {
            if (typeof renderAuditLogExports === 'function') renderAuditLogExports();
            if (typeof initReportsHub === 'function') initReportsHub();
        }
    }, 80);
}

// Sub-Tab Switcher inside Pillar
function switchSubTab(pillarPrefix, subKey) {
    // Persist active subtab for this pillar to localStorage
    try {
        localStorage.setItem(`oxford_active_subtab_${pillarPrefix}`, subKey);
    } catch (e) {}

    document.querySelectorAll(`.sub-panel-${pillarPrefix}`).forEach(p => {
        p.classList.remove('active');
        p.classList.add('hidden');
    });
    const targetSub = document.getElementById(`sub-${pillarPrefix}-${subKey}`);
    if (targetSub) {
        targetSub.classList.add('active');
        targetSub.classList.remove('hidden');
    }

    document.querySelectorAll(`.subnav-${pillarPrefix}`).forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-sub') === subKey) {
            btn.classList.add('active');
        }
    });

    if (pillarPrefix === 'dashboard' && subKey === 'pulse') {
        if (typeof loadAndRenderPlanningGoals === 'function') loadAndRenderPlanningGoals();
    } else if (pillarPrefix === 'perf') {
        updatePerfStepper(subKey);
        if (typeof updateAllPerfStepperBadges === 'function') updateAllPerfStepperBadges();
        
        // Fast Instant Render from In-Memory Cache (0ms latency)
        if (subKey === 'plan') {
            if (typeof renderPlanningRosterTable === 'function') renderPlanningRosterTable();
            if (typeof renderGeneralTasksTable === 'function') renderGeneralTasksTable();
        } else if (subKey === 'approve') {
            if (typeof renderApprovalRosterTable === 'function') renderApprovalRosterTable();
        } else if (subKey === 'monitor') {
            if (typeof renderMonitoringRosterTable === 'function') renderMonitoringRosterTable();
        } else if (subKey === 'eval') {
            if (typeof renderEvaluationRosterTable === 'function') renderEvaluationRosterTable();
        } else if (subKey === 'review') {
            if (typeof renderReviewRosterTable === 'function') renderReviewRosterTable();
        } else if (subKey === 'idp') {
            if (typeof renderIDPRosterTable === 'function') renderIDPRosterTable();
        } else if (subKey === 'cycle') {
            if (typeof renderCycleRosterTable === 'function') renderCycleRosterTable();
        }

        // Fetch in background if cache is completely empty
        if (!window.dbGoals || window.dbGoals.length === 0) {
            if (typeof loadAndRenderPlanningGoals === 'function') loadAndRenderPlanningGoals();
        }
    } else if (pillarPrefix === 'comp') {
        if (subKey === 'profiles') {
            if (typeof renderRoleCompetencyFramework === 'function') renderRoleCompetencyFramework();
            if (typeof renderCompetencyMatrixTable === 'function') renderCompetencyMatrixTable();
        } else if (subKey === 'assessment') {
            if (typeof renderSelectedEmployeeRadarView === 'function') renderSelectedEmployeeRadarView();
            if (typeof renderSkillsGapAnalysis === 'function') renderSkillsGapAnalysis();
        } else if (subKey === 'development') {
            if (typeof renderIDPView === 'function') renderIDPView();
            if (typeof renderCertificationsRoster === 'function') renderCertificationsRoster();
            if (typeof renderPerformanceIntegrationSummary === 'function') renderPerformanceIntegrationSummary();
            if (typeof renderCompetencyAnalyticsDashboard === 'function') renderCompetencyAnalyticsDashboard();
        }
    } else if (pillarPrefix === 'lms' && subKey === 'tna') {
        if (typeof renderTnaEnrollments === 'function') renderTnaEnrollments();
        if (typeof fetchNeedsAnalysisData === 'function') fetchNeedsAnalysisData();
    } else if (pillarPrefix === 'lms' && subKey === 'modules') {
        if (typeof renderLmsBooks === 'function') renderLmsBooks();
    } else if (pillarPrefix === 'social') {
        if (subKey === 'kudos' && typeof renderSocialFeed === 'function') renderSocialFeed();
        if (subKey === 'ledger' && typeof renderPointLedger === 'function') renderPointLedger();
        if (subKey === 'badges' && typeof renderMilestoneBadges === 'function') renderMilestoneBadges();
        if (subKey === 'climate' && typeof updateHourlySentimentChart === 'function') updateHourlySentimentChart(shiftSentimentsState);
    }

    setTimeout(() => {
        if (subKey === 'system' && chartSystemDeptProgressInstance) chartSystemDeptProgressInstance.resize();
        if (subKey === 'pulse' && chartPerfTrendInstance) chartPerfTrendInstance.resize();
        if (subKey === 'pulse' && chartSentimentDoughnutInstance) chartSentimentDoughnutInstance.resize();
        if ((subKey === 'radar' || subKey === 'assessment') && chartCompetencyRadarInstance) chartCompetencyRadarInstance.resize();
        if (subKey === 'compliance' && chartLmsComplianceInstance) chartLmsComplianceInstance.resize();
        if (subKey === 'climate' && chartHourlySentimentInstance) chartHourlySentimentInstance.resize();
    }, 80);
}

// 7-Stage Performance Stepper Dynamic Progress State (Pure numerical count, no check icons)
function updatePerfStepper(activeSubKey) {
    const perfStages = ['plan', 'approve', 'monitor', 'eval', 'review', 'idp', 'cycle'];
    const activeIdx = perfStages.indexOf(activeSubKey);
    if (activeIdx === -1) return;

    const stepItems = document.querySelectorAll('.perf-step-item');
    const stepLines = document.querySelectorAll('.perf-step-line');

    stepItems.forEach((item, idx) => {
        const bubble = item.querySelector('.perf-step-bubble');
        const title = item.querySelector('.perf-step-title');

        if (idx < activeIdx) {
            // Passed stage
            if (bubble) {
                bubble.className = 'perf-step-bubble w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs group-hover:scale-105 transition';
                bubble.textContent = (idx + 1);
            }
            if (title) {
                title.className = 'perf-step-title font-bold text-slate-800 text-[11px] group-hover:text-primary transition';
            }
        } else if (idx === activeIdx) {
            // Active current stage
            if (bubble) {
                bubble.className = 'perf-step-bubble w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-primary/20 shadow-xs group-hover:scale-110 transition';
                bubble.textContent = (idx + 1);
            }
            if (title) {
                title.className = 'perf-step-title font-bold text-primary text-[11px]';
            }
        } else {
            // Upcoming stage
            if (bubble) {
                bubble.className = 'perf-step-bubble w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold group-hover:bg-slate-200 transition';
                bubble.textContent = (idx + 1);
            }
            if (title) {
                title.className = 'perf-step-title font-medium text-slate-600 text-[11px] group-hover:text-slate-900 transition';
            }
        }
    });

    stepLines.forEach((line, idx) => {
        if (idx < activeIdx) {
            line.className = 'perf-step-line flex-1 h-0.5 bg-slate-800 mx-2 transition-colors';
        } else if (idx === activeIdx) {
            line.className = 'perf-step-line flex-1 h-0.5 bg-primary/40 mx-2 transition-colors';
        } else {
            line.className = 'perf-step-line flex-1 h-0.5 bg-slate-200 mx-2 transition-colors';
        }
    });
}

// Auth and Persona based on users table
const personaData = {
    associate: {
        id: 'emp-101',
        role: 'Associate',
        name: 'Maria Santos',
        initials: 'MS',
        roleLabel: 'Maria Santos (Associate)',
        badge: 'Emp',
        dept: 'Front Office',
        greeting: 'Good morning, Maria Santos 👋',
        title: 'Viewing as: Front Desk Host (Associate)',
        desc: 'You can draft performance objectives, log daily shift accomplishments & evidence, submit self-assessments, and take LMS quizzes.',
        tag: 'Associate',
        icon: 'fas fa-user',
        bannerClass: 'bg-blue-50/80 border-blue-200 text-blue-950',
        badgeClass: 'bg-blue-100 text-blue-800'
    },
    supervisor: {
        id: 'emp-102',
        role: 'Supervisor',
        name: 'Chef Marco Rossi',
        initials: 'CM',
        roleLabel: 'Chef Marco Rossi (Supervisor)',
        badge: 'Mgr',
        dept: 'Culinary & F&B',
        greeting: 'Good morning, Chef Marco 👨‍🍳',
        title: 'Viewing as: F&B & Culinary Supervisor',
        desc: 'You can review and endorse subordinate goals, write coaching notes, evaluate team appraisals, and assign 70-20-10 IDPs.',
        tag: 'Supervisor',
        icon: 'fas fa-user-tie',
        bannerClass: 'bg-amber-50/80 border-amber-200 text-amber-950',
        badgeClass: 'bg-amber-100 text-amber-800'
    },
    hradmin: {
        id: 'emp-103',
        role: 'HRAdmin',
        name: 'Elena Vance',
        initials: 'EV',
        roleLabel: 'Elena Vance (HRAdmin)',
        badge: 'HR',
        dept: 'Human Resources',
        greeting: 'Welcome back, Elena Vance 📊',
        title: 'Viewing as: HRAdmin (Governance)',
        desc: 'You have full oversight over competency frameworks, bell-curve calibration normalization, LMS compliance, and 9-box succession.',
        tag: 'HRAdmin',
        icon: 'fas fa-shield-halved',
        bannerClass: 'bg-purple-50/80 border-purple-200 text-purple-950',
        badgeClass: 'bg-purple-100 text-purple-800'
    },
    generalmanager: {
        id: 'emp-104',
        role: 'GeneralManager',
        name: 'Robert Sterling',
        initials: 'RS',
        roleLabel: 'Robert Sterling (GeneralManager)',
        badge: 'Exec',
        dept: 'Executive Office',
        greeting: 'Executive Briefing, General Manager Sterling 🏨',
        title: 'Viewing as: GeneralManager',
        desc: 'Strategic overview of property-wide Hospitality Index, guest NPS analytics, leadership bench depth, and training ROI.',
        tag: 'GeneralManager',
        icon: 'fas fa-chess-king',
        bannerClass: 'bg-slate-100 border-slate-300 text-slate-950',
        badgeClass: 'bg-slate-200 text-slate-800'
    }
};
// Support exact role column lookups
personaData['Associate'] = personaData.associate;
personaData['Supervisor'] = personaData.supervisor;
personaData['HRAdmin'] = personaData.hradmin;
personaData['GeneralManager'] = personaData.generalmanager;
personaData['employee'] = personaData.associate;
personaData['manager'] = personaData.supervisor;
personaData['hr'] = personaData.hradmin;
personaData['executive'] = personaData.generalmanager;

function switchRole(userRole) {
    const normalizedKey = String(userRole || '').toLowerCase().trim();
    activePersonaKey = normalizedKey;
    const persona = personaData[normalizedKey] || personaData[userRole] || personaData.associate;

    window.currentUser = {
        id: persona.id,
        full_name: persona.name,
        role: persona.role,
        department: persona.dept
    };

    document.querySelectorAll('.sidebar-user-name').forEach(el => el.textContent = persona.name);
    document.querySelectorAll('.sidebar-user-dept').forEach(el => el.textContent = persona.dept);
    document.querySelectorAll('.role-badge-tag').forEach(el => el.textContent = persona.badge);
    document.querySelectorAll('.user-avatar-circle').forEach(el => el.textContent = persona.initials);
    const heroGreet = document.getElementById('hero-greeting-text');
    if (heroGreet) heroGreet.textContent = persona.greeting;

    const quickSwitcher = document.getElementById('quick-role-switcher');
    if (quickSwitcher) {
        for (let opt of quickSwitcher.options) {
            if (opt.value.toLowerCase() === normalizedKey || opt.value.toLowerCase() === (persona.role || '').toLowerCase()) {
                quickSwitcher.value = opt.value;
                break;
            }
        }
    }

    // Update Header User Profile Badge
    const navAvatar = document.getElementById('nav-user-avatar');
    const navName = document.getElementById('nav-user-name');
    const navRole = document.getElementById('nav-user-role');
    if (navAvatar && persona.avatar) navAvatar.src = persona.avatar;
    if (navName) navName.textContent = persona.name;
    if (navRole) navRole.textContent = `${persona.role} · ${persona.dept || 'Makati'}`;

    // Update Dynamic Role Context Banner
    const contextBanner = document.getElementById('role-context-banner');
    const contextTitle = document.getElementById('role-context-title');
    const contextDesc = document.getElementById('role-context-desc');
    const contextTag = document.getElementById('role-context-tag');
    const contextIcon = document.getElementById('role-context-icon');

    if (contextTitle) contextTitle.textContent = persona.title;
    if (contextDesc) contextDesc.textContent = persona.desc;
    if (contextTag) {
        contextTag.textContent = persona.tag;
        contextTag.className = `px-2.5 py-1 rounded-full text-[10px] font-bold ${persona.badgeClass}`;
    }
    if (contextIcon) {
        contextIcon.innerHTML = `<i class="${persona.icon}"></i>`;
    }
    if (contextBanner) {
        contextBanner.className = `p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs transition ${persona.bannerClass}`;
    }

    window.activePersonaRole = persona.role;
    applyRoleVisibility(persona.role);
    if (typeof loadLiveNotifications === 'function') {
        loadLiveNotifications(persona.role, persona.id);
    }
    if (typeof loadAndRenderPlanningGoals === 'function') {
        loadAndRenderPlanningGoals();
    }
    if (typeof renderEmployeeOverviewCompetencies === 'function') {
        renderEmployeeOverviewCompetencies(persona.id);
    }
    if (typeof renderTnaEnrollments === 'function') {
        renderTnaEnrollments();
    }
    showToast(`Signed in: ${persona.name} (${persona.tag})`, 'info');
}


function applyRoleVisibility(userRole) {
    // Read exclusively from the users.role column value
    const roleName = String(userRole || '').toLowerCase().trim();
    const isAssociate = (roleName === 'associate' || roleName === 'employee' || roleName === 'staff');

    // In Overview Hub sub-navigation, hide "2. System & Property Analytics" for Associate
    const systemSubTabBtn = document.querySelector('button[data-sub="system"]');
    if (systemSubTabBtn) {
        if (isAssociate) {
            systemSubTabBtn.classList.add('hidden');
            if (typeof switchSubTab === 'function') {
                switchSubTab('dashboard', 'pulse');
            }
        } else {
            systemSubTabBtn.classList.remove('hidden');
        }
    }

    // Competency Sub-tabs & Controls scoping for Associate
    const compProfilesBtn = document.getElementById('subtab-btn-comp-profiles');
    const compAssessBtn = document.getElementById('subtab-btn-comp-assessment');
    const compDevBtn = document.getElementById('subtab-btn-comp-development');
    const compBackToMatrixBtn = document.querySelector('button[onclick*="switchSubTab(\'comp\', \'profiles\')"]');

    if (compBackToMatrixBtn) {
        if (isAssociate) compBackToMatrixBtn.classList.add('hidden');
        else compBackToMatrixBtn.classList.remove('hidden');
    }

    const compConductEvalBox = document.getElementById('comp-conduct-eval-box');
    if (compConductEvalBox) {
        if (isAssociate) compConductEvalBox.classList.add('hidden');
        else compConductEvalBox.classList.remove('hidden');
    }

    const compTnaGapCard = document.getElementById('comp-tna-skills-gap-card');
    if (compTnaGapCard) {
        if (isAssociate) compTnaGapCard.classList.add('hidden');
        else compTnaGapCard.classList.remove('hidden');
    }


    if (isAssociate) {
        if (compProfilesBtn) compProfilesBtn.classList.add('hidden');
        if (compAssessBtn) {
            compAssessBtn.classList.remove('hidden');
            compAssessBtn.innerHTML = '<i class="fas fa-chart-radar mr-1.5"></i> My 360° Assessment';
        }
        if (compDevBtn) {
            compDevBtn.classList.remove('hidden');
            compDevBtn.innerHTML = '<i class="fas fa-certificate mr-1.5 text-gold"></i> My Certifications';
        }


        // Default sub-tab to 360° Assessment for Employee
        const activeCompSub = document.querySelector('.subnav-comp.active')?.getAttribute('data-sub');
        if (!activeCompSub || activeCompSub === 'profiles') {
            if (typeof switchSubTab === 'function') {
                switchSubTab('comp', 'assessment');
            }
        }

        // Force active competency employee key to logged-in user
        if (typeof selectEmployeeForCompetencies === 'function') {
            const empId = window.currentUser?.id || 'emp-101';
            selectEmployeeForCompetencies(empId);
        }
    } else {
        if (compProfilesBtn) compProfilesBtn.classList.remove('hidden');
        if (compAssessBtn) {
            compAssessBtn.classList.remove('hidden');
            compAssessBtn.innerHTML = '<i class="fas fa-chart-radar mr-1.5"></i> 360° Assessment &amp; Skills Gap';
        }
        if (compDevBtn) {
            compDevBtn.classList.remove('hidden');
            compDevBtn.innerHTML = '<i class="fas fa-route mr-1.5"></i> IDP, Certifications &amp; Appraisal';
        }
    }

    // Supervisor & Management only navigation items
    // NOTE: pillar-comp (Competency Management) and pillar-training (Training Operations) are NOW VISIBLE to Associates!
    const supervisorOnlyPillars = [
        'pillar-perf',
        'pillar-succession',
        'pillar-reports'
    ];

    document.querySelectorAll('.nav-item, [data-pillar]').forEach(link => {
        const pillar = link.getAttribute('data-pillar');
        if (supervisorOnlyPillars.includes(pillar)) {
            if (isAssociate) {
                link.classList.add('hidden');
            } else {
                link.classList.remove('hidden');
            }
        } else if (pillar === 'pillar-comp' || pillar === 'pillar-training') {
            link.classList.remove('hidden');
            link.style.display = '';
        }
    });


    // If active pillar was supervisor-only and current user is an Associate, return to overview dashboard
    const activePanel = document.querySelector('.pillar-panel.active');
    if (isAssociate && activePanel && supervisorOnlyPillars.includes(activePanel.id)) {
        if (typeof switchPillar === 'function') {
            switchPillar('dashboard');
        }
    }

    // Training Management Sub-tabs & Controls scoping for Associate
    const trainingNeedsBtn = document.querySelector('button[data-sub="needs"].subnav-training');
    const trainingProgramsBtn = document.querySelector('button[data-sub="programs"].subnav-training');
    const trainingSchedulesBtn = document.querySelector('button[data-sub="schedules"].subnav-training');
    const trainingAttendanceBtn = document.querySelector('button[data-sub="attendance"].subnav-training');
    const trainingResultsBtn = document.querySelector('button[data-sub="results"].subnav-training');

    const btnCreateProg = document.getElementById('btn-create-program');
    const btnSchedSess = document.getElementById('btn-schedule-session');
    const btnMarkAll = document.getElementById('btn-mark-all-attended');
    
    if (isAssociate) {
        if (trainingNeedsBtn) trainingNeedsBtn.innerHTML = '<i class="fas fa-bullseye mr-1.5 text-terracotta-dark"></i><span>My Training Needs</span>';
        if (trainingProgramsBtn) {
            trainingProgramsBtn.classList.remove('hidden');
            trainingProgramsBtn.innerHTML = '<i class="fas fa-book-bookmark mr-1.5 text-gold-dark"></i><span>Programs Catalog</span>';
        }
        if (trainingSchedulesBtn) trainingSchedulesBtn.classList.add('hidden');
        if (trainingAttendanceBtn) trainingAttendanceBtn.innerHTML = '<i class="fas fa-user-check mr-1.5 text-sage-dark"></i><span>My Attendance</span>';
        if (trainingResultsBtn) trainingResultsBtn.innerHTML = '<i class="fas fa-square-poll-vertical mr-1.5 text-primary"></i><span>My Results &amp; Certs</span>';

        if (btnCreateProg) btnCreateProg.classList.add('hidden');
        if (btnSchedSess) btnSchedSess.classList.add('hidden');
        if (btnMarkAll) btnMarkAll.classList.add('hidden');
        
        // If associate is on a hidden tab, redirect to needs
        const activeTrainingSub = document.querySelector('.subnav-training.active')?.getAttribute('data-sub');
        if (activeTrainingSub === 'schedules') {
            if (typeof switchSubTab === 'function') {
                switchSubTab('training', 'needs');
            }
        }
    } else {
        if (trainingNeedsBtn) trainingNeedsBtn.innerHTML = '<i class="fas fa-bullseye mr-1.5 text-terracotta-dark"></i><span>Needs &amp; Gaps</span>';
        if (trainingProgramsBtn) {
            trainingProgramsBtn.classList.remove('hidden');
            trainingProgramsBtn.innerHTML = '<i class="fas fa-book-bookmark mr-1.5 text-gold-dark"></i><span>Programs Catalog</span>';
        }
        if (trainingSchedulesBtn) trainingSchedulesBtn.classList.remove('hidden');
        if (trainingAttendanceBtn) trainingAttendanceBtn.innerHTML = '<i class="fas fa-user-check mr-1.5 text-sage-dark"></i><span>Attendance</span>';
        if (trainingResultsBtn) trainingResultsBtn.innerHTML = '<i class="fas fa-square-poll-vertical mr-1.5 text-primary"></i><span>Evaluation &amp; Results</span>';

        if (btnCreateProg) btnCreateProg.classList.remove('hidden');
        if (btnSchedSess) btnSchedSess.classList.remove('hidden');
        if (btnMarkAll) btnMarkAll.classList.remove('hidden');
    }
}

async function logOutToAuth() {
    localStorage.removeItem('oxford_session_auth');
    localStorage.removeItem('oxford_session_user');
    localStorage.removeItem('oxford_session_role');

    showToast('Signed out. Redirecting to login...', 'info');

    try {
        await AuthAPI.logout();
    } catch (err) {
        console.warn('Backend logout sync:', err);
    }

    // Redirect to standalone login page
    setTimeout(() => {
        window.location.replace('login.php?logout=1');
    }, 300);
}
window.logOutToAuth = logOutToAuth;

// Restore user session on refresh
document.addEventListener('DOMContentLoaded', () => {
    const isAuth = localStorage.getItem('oxford_session_auth');
    if (isAuth !== 'true') {
        window.location.replace('login.php');
        return;
    }
    const savedRole = localStorage.getItem('oxford_session_role') || 'associate';
    if (typeof switchRole === 'function') {
        switchRole(savedRole);
    } else if (typeof applyRoleVisibility === 'function') {
        applyRoleVisibility(savedRole);
    }

    // Restore last visited Pillar & Subtab across page refresh
    try {
        const savedPillar = localStorage.getItem('oxford_active_pillar');
        const role = savedRole.toLowerCase().trim();
        const isAssociate = (role === 'associate' || role === 'employee' || role === 'staff');
        const supervisorOnlyPillars = ['pillar-perf', 'pillar-succession', 'pillar-reports'];

        const targetPillar = (savedPillar && (!isAssociate || !supervisorOnlyPillars.includes(savedPillar)))
            ? savedPillar
            : 'dashboard';

        if (typeof switchPillar === 'function') {
            switchPillar(targetPillar);
        }

        // Restore active subtabs for pillars
        const pillarPrefixMap = {
            'dashboard': 'dashboard',
            'pillar-perf': 'perf',
            'pillar-comp': 'comp',
            'pillar-lms': 'lms',
            'pillar-training': 'training',
            'pillar-succession': 'succession',
            'pillar-social': 'social'
        };
        const prefix = pillarPrefixMap[targetPillar];
        if (prefix) {
            const savedSub = localStorage.getItem(`oxford_active_subtab_${prefix}`);
            if (savedSub && typeof switchSubTab === 'function') {
                switchSubTab(prefix, savedSub);
            }
        }
    } catch (e) {
        console.warn('Navigation state restore error:', e);
    }
});


// HR Central Roster Management Helpers
const departmentRosters = {
    front_office: [
        { id: 'maria_santos', name: 'Maria Santos', role: 'Front Desk Host', rating: '4.55' },
        { id: 'carlos_gomez', name: 'Carlos Gomez', role: 'Concierge Host', rating: '4.20' },
        { id: 'ana_tanaka', name: 'Ana Tanaka', role: 'Night Auditor', rating: '4.80' },
        { id: 'lucas_vargas', name: 'Lucas Vargas', role: 'Junior Host', rating: '3.90' }
    ],
    fb_service: [
        { id: 'pierre_dubois', name: 'Pierre Dubois', role: 'Master Sommelier', rating: '4.90' },
        { id: 'jean_luc', name: 'Jean-Luc Moreau', role: 'Head Waiter', rating: '4.40' },
        { id: 'chloe_dupont', name: 'Chloe Dupont', role: 'Bistro Hostess', rating: '4.15' }
    ],
    culinary: [
        { id: 'marco_rossi', name: 'Marco Rossi', role: 'Executive Sous Chef', rating: '4.85' },
        { id: 'antonio_silva', name: 'Antonio Silva', role: 'Chef de Partie', rating: '4.30' },
        { id: 'kenji_sato', name: 'Kenji Sato', role: 'Pastry Chef', rating: '4.70' }
    ],
    housekeeping: [
        { id: 'rosa_flores', name: 'Rosa Flores', role: 'Floor Supervisor', rating: '4.65' },
        { id: 'fatima_al', name: 'Fatima Al-Mansoor', role: 'Suite Attendant', rating: '4.50' }
    ],
    banquet: [
        { id: 'david_kim', name: 'David Kim', role: 'Banquet Captain', rating: '4.45' },
        { id: 'sarah_jenkins', name: 'Sarah Jenkins', role: 'Event Coordinator', rating: '4.60' }
    ]
};

function filterDepartmentStaff(deptKey) {
    const staffSelect = document.getElementById('hr-staff-select');
    if (!staffSelect) return;
    const staffList = departmentRosters[deptKey] || departmentRosters.front_office;

    staffSelect.innerHTML = staffList.map(s =>
        `<option value="${s.id}">${s.name} (${s.role} · Q3: ${s.rating})</option>`
    ).join('');

    showToast(`Loaded ${staffList.length} staff records for ${deptKey.replace('_', ' ').toUpperCase()}`, 'info');
}

function selectEmployeeRecord(staffId) {
    showToast(`Active record: ${staffId.replace('_', ' ').toUpperCase()}`, 'success');
}

const AuthAPI = {
    baseUrl: 'api/auth.php',
    async request(action, method = 'GET', payload = null) {
        const url = `${this.baseUrl}?action=${action}`;
        const options = {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        };
        if (payload && method !== 'GET') {
            options.body = JSON.stringify(payload);
        }
        try {
            const res = await fetch(url, options);
            const data = await res.json();
            return data;
        } catch (e) {
            console.warn('[AuthAPI Warning]:', e.message);
            return { success: true };
        }
    },
    fastLogin(roleKey) { return this.request('fast_login', 'POST', { roleKey }); },
    login(identifier, password) { return this.request('login', 'POST', { identifier, password }); },
    logout() { return this.request('logout', 'POST'); }
};

function togglePasswordVisibility() {
    const passInput = document.getElementById('login-password');
    const passIcon = document.getElementById('password-toggle-icon');
    if (!passInput || !passIcon) return;

    if (passInput.type === 'password') {
        passInput.type = 'text';
        passIcon.classList.remove('fa-eye');
        passIcon.classList.add('fa-eye-slash');
    } else {
        passInput.type = 'password';
        passIcon.classList.remove('fa-eye-slash');
        passIcon.classList.add('fa-eye');
    }
}

function fillLoginCredentials(code, pass = 'oxford2026') {
    const identifierInput = document.getElementById('login-identifier');
    const passwordInput = document.getElementById('login-password');
    if (identifierInput) identifierInput.value = code;
    if (passwordInput) passwordInput.value = pass;
    showToast(`Filled credentials for ${code}`, 'info');
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const identifierInput = document.getElementById('login-identifier');
    const passwordInput = document.getElementById('login-password');

    const identifier = identifierInput?.value?.trim() || 'OXF-EMP-1001';
    const password = passwordInput?.value?.trim() || 'oxford2026';

    try {
        const res = await AuthAPI.login(identifier, password);
        if (res && res.success && res.data && res.data.user) {
            const user = res.data.user;
            const userRole = user.role || res.data.role || 'Associate';

            localStorage.setItem('oxford_session_auth', 'true');
            localStorage.setItem('oxford_session_user', JSON.stringify(user));
            localStorage.setItem('oxford_session_role', userRole);

            switchRole(userRole);
            const authScreen = document.getElementById('auth-screen');
            if (authScreen) authScreen.classList.add('hidden');
            showToast(`Welcome ${user.full_name} (${user.title})!`, 'success');
            initAllCharts();
        } else {
            showToast(res?.message || 'Login failed. Please check credentials.', 'error');
        }
    } catch (err) {
        // Fallback to demo entry
        localStorage.setItem('oxford_session_auth', 'true');
        localStorage.setItem('oxford_session_role', 'employee');
        const authScreen = document.getElementById('auth-screen');
        if (authScreen) authScreen.classList.add('hidden');
        showToast('Welcome to Oxford Suites, Makati!', 'success');
        initAllCharts();
    }
}


// Form Templates
function fillGoalTemplate(type) {
    const titleInput = document.getElementById('goal-title-input');
    const catInput = document.getElementById('goal-cat-input');
    const kpiInput = document.getElementById('goal-kpi-input');
    const weightInput = document.getElementById('goal-weight-input');
    const evidenceInput = document.getElementById('goal-evidence-input');
    const adviceEl = document.getElementById('gemini-goal-advice');

    if (type === 'vip_nps') {
        titleInput.value = "Elevate VIP Guest Check-in Experience & NPS Loyalty Index";
        catInput.value = "Front Office & Guest Experience";
        kpiInput.value = "Net Promoter Score (NPS) >= +92 Score";
        weightInput.value = "High Priority (35% Weight - Core Role Objective)";
        evidenceInput.value = "Monthly Medallia guest ratings and Opera PMS check-in speed logs.";
        adviceEl.innerHTML = "✦ Excellent SMART alignment: Directly covers <strong>Guest Relations & Escalation</strong> competency for Senior Host promotion.";
    } else if (type === 'upsell_wine') {
        titleInput.value = "Fine Dining Upselling & Sommelier Wine Pairing Recommendations";
        catInput.value = "Food & Beverage Service";
        kpiInput.value = "+18% Beverage Revenue / Cover (Avg Check Lift)";
        weightInput.value = "Medium Priority (20% Weight - Standard Operational Goal)";
        evidenceInput.value = "Micros POS beverage report printouts.";
        adviceEl.innerHTML = "✦ High Revenue Impact: Directly targets the <strong>Revenue Optimization</strong> competency standard.";
    } else if (type === 'haccp_audit') {
        titleInput.value = "HACCP Food Safety, Cold-Chain Logging & Zero Non-Conformance";
        catInput.value = "Culinary & Kitchen Brigade";
        kpiInput.value = "100% Audit Pass Score (Zero Violations)";
        weightInput.value = "High Priority (35% Weight - Core Role Objective)";
        evidenceInput.value = "Daily digital temperature walk-in logs.";
        adviceEl.innerHTML = "✦ Critical Compliance Goal: Essential for maintaining hotel 5-star hygiene license.";
    } else if (type === 'room_turnaround') {
        titleInput.value = "Express Suite Turnover & 5-Star Deep Clean Sanitization";
        catInput.value = "Housekeeping & Facilities";
        kpiInput.value = "Turnaround < 22 mins / suite";
        weightInput.value = "Medium Priority (20% Weight - Standard Operational Goal)";
        evidenceInput.value = "Housekeeping PMS floor logs.";
        adviceEl.innerHTML = "✦ Operational Efficiency: Directly prevents late check-in friction.";
    }

    showToast('Loaded pre-filled goal template!', 'success');
}

function setKPIValue(kpiStr) {
    document.getElementById('goal-kpi-input').value = kpiStr;
    showToast(`Target set: "${kpiStr}"`, 'info');
}

function setRoughNote(noteStr) {
    document.getElementById('ai-rough-notes').value = noteStr;
    showToast('Scenario loaded! Click Generate below.', 'info');
}



function openGoalReview(title) {
    document.getElementById('review-goal-title').textContent = title;
    openModal('modal-approve-goal');
}

function approveGoalOfficial() {
    closeModal('modal-approve-goal');
    showToast('Goal officially approved by supervisor!', 'success');
}

function requestGoalRevision() {
    closeModal('modal-approve-goal');
    showToast('Revision request sent to employee with notes.', 'info');
}

function generateAIFeedback() {
    const rough = document.getElementById('ai-rough-notes').value;
    if (rough.trim()) {
        document.getElementById('ai-generated-text').textContent = `"${rough.trim()} — (SBI Model applied): Observed during dinner service. High guest engagement maintained. Recommending continued focus on team delegation."`;
    }
    document.getElementById('ai-output-box').classList.remove('hidden');
    showToast('Gemini structured SBI coaching generated!', 'success');
}

function copyAndApplyFeedback() {
    closeModal('modal-ai-feedback');
    showToast('Coaching feedback posted to employee wall!', 'success');
}

function submitSelfAssessment() {
    closeModal('modal-self-assessment');
    showToast('Self-assessment ratings submitted for calibration!', 'success');
}

function addGapToIDP(skillName, recommendedModule) {
    const container = document.getElementById('idp-tasks-container');
    const task = document.createElement('div');
    task.className = 'p-4 rounded-2xl border border-primary/30 bg-primary/5 space-y-2 text-xs';
    task.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="font-bold text-slate-900">Goal: Close Gap in ${skillName}</span>
                    <span class="text-primary font-bold">New (0%)</span>
                </div>
                <p class="text-slate-600">Assigned Module: <strong>${recommendedModule}</strong> · Mentorship scheduled</p>
                <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-primary h-1.5 rounded-full" style="width: 10%"></div>
                </div>
            `;
    container.insertBefore(task, container.firstChild);
    showToast(`Skill "${skillName}" added to IDP!`, 'success');
    switchPillar('pillar-comp');
    switchSubTab('comp', 'idp');
}

function launchInteractiveQuiz(moduleName) {
    document.getElementById('quiz-modal-title').textContent = `Quiz: ${moduleName}`;
    openModal('modal-lms-quiz');
}

function submitQuizSuccess() {
    closeModal('modal-lms-quiz');
    awardXP(100);
    showToast('Congratulations! Scored 100% on the quiz! +100 XP awarded!', 'success');
}

// Expose Core Navigation & Modal Functions to Window
window.switchPillar = switchPillar;
window.switchSubTab = switchSubTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleMobileSidebar = toggleMobileSidebar;
window.switchRole = switchRole;
window.logOutToAuth = logOutToAuth;

