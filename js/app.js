// State
            let currentXP = 1480;
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

            // Modal Controls
            function openModal(id) {
                const el = document.getElementById(id);
                if (el) {
                    el.classList.remove('hidden');
                    el.classList.add('flex');
                    if (id === 'modal-recognition' && typeof initKudosRosterModal === 'function') {
                        initKudosRosterModal();
                    }
                }
            }

            function closeModal(id) {
                const el = document.getElementById(id);
                if (el) {
                    el.classList.add('hidden');
                    el.classList.remove('flex');
                }
            }

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

                // Resize charts if visible
                setTimeout(() => {
                    if (pillarKey === 'dashboard') {
                        if (chartPerfTrendInstance) chartPerfTrendInstance.resize();
                        if (chartSentimentDoughnutInstance) chartSentimentDoughnutInstance.resize();
                        if (chartSystemDeptProgressInstance) chartSystemDeptProgressInstance.resize();
                    } else if (pillarKey === 'pillar-comp') {
                        if (chartCompetencyRadarInstance) chartCompetencyRadarInstance.resize();
                    } else if (pillarKey === 'pillar-lms') {
                        if (chartLmsComplianceInstance) chartLmsComplianceInstance.resize();
                        if (typeof renderLmsBooks === 'function') renderLmsBooks();
                        if (typeof renderTnaEnrollments === 'function') renderTnaEnrollments();
                    } else if (pillarKey === 'pillar-social') {
                        if (chartHourlySentimentInstance) chartHourlySentimentInstance.resize();
                    }
                }, 80);
            }

            // Sub-Tab Switcher inside Pillar
            function switchSubTab(pillarPrefix, subKey) {
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

                if (pillarPrefix === 'perf') {
                    updatePerfStepper(subKey);
                    if (typeof updateAllPerfStepperBadges === 'function') updateAllPerfStepperBadges();
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
                } else if (pillarPrefix === 'lms' && subKey === 'modules') {
                    if (typeof renderLmsBooks === 'function') renderLmsBooks();
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

            // 7-Stage Performance Stepper Dynamic Progress State
            function updatePerfStepper(activeSubKey) {
                const perfStages = ['plan', 'approve', 'monitor', 'eval', 'review', 'idp', 'cycle'];
                const activeIdx = perfStages.indexOf(activeSubKey);
                if (activeIdx === -1) return;

                const stepItems = document.querySelectorAll('.perf-step-item');
                const stepLines = document.querySelectorAll('.perf-step-line');

                stepItems.forEach((item, idx) => {
                    const bubble = item.querySelector('.perf-step-bubble');
                    const title = item.querySelector('.perf-step-title');
                    const sub = item.querySelector('.perf-step-sub');

                    if (idx < activeIdx) {
                        // Completed stage
                        if (bubble) {
                            bubble.className = 'perf-step-bubble w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs group-hover:scale-110 transition';
                            bubble.innerHTML = '<i class="fas fa-check text-[9px]"></i>';
                        }
                        if (title) {
                            title.className = 'perf-step-title font-bold text-slate-800 text-[11px] group-hover:text-primary transition';
                        }
                    } else if (idx === activeIdx) {
                        // Active current stage
                        if (bubble) {
                            bubble.className = 'perf-step-bubble w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-primary/20 shadow-xs group-hover:scale-110 transition';
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
                        if (sub) {
                            sub.className = 'perf-step-sub text-[9px] text-slate-400';
                        }
                    }
                });

                stepLines.forEach((line, idx) => {
                    if (idx < activeIdx) {
                        line.className = 'perf-step-line flex-1 h-0.5 bg-emerald-500 mx-2 transition-colors';
                    } else if (idx === activeIdx) {
                        line.className = 'perf-step-line flex-1 h-0.5 bg-primary/40 mx-2 transition-colors';
                    } else {
                        line.className = 'perf-step-line flex-1 h-0.5 bg-slate-200 mx-2 transition-colors';
                    }
                });
            }

            // Auth and Persona
            const personaData = {
                employee: {
                    name: 'Maria Santos',
                    initials: 'MS',
                    roleLabel: 'Maria Santos (Host / Employee)',
                    badge: 'Emp',
                    dept: 'Front Desk Host',
                    greeting: 'Good morning, Maria Santos 👋',
                    title: 'Viewing as: Front Desk Host (Employee / Individual Contributor)',
                    desc: 'You can draft performance objectives, log daily shift accomplishments & evidence, submit self-assessments, and take LMS quizzes.',
                    tag: 'Individual Contributor',
                    icon: 'fas fa-user',
                    bannerClass: 'bg-blue-50/80 border-blue-200 text-blue-950',
                    badgeClass: 'bg-blue-100 text-blue-800'
                },
                manager: {
                    name: 'Chef Marco',
                    initials: 'CM',
                    roleLabel: 'Chef Marco (Supervisor)',
                    badge: 'Mgr',
                    dept: 'Culinary & F&B Lead',
                    greeting: 'Good morning, Chef Marco 👨‍🍳',
                    title: 'Viewing as: F&B & Culinary Supervisor (Operational Leader)',
                    desc: 'You can review and endorse subordinate goals, write coaching notes, evaluate team appraisals, and assign 70-20-10 IDPs.',
                    tag: 'Supervisor / Manager',
                    icon: 'fas fa-user-tie',
                    bannerClass: 'bg-amber-50/80 border-amber-200 text-amber-950',
                    badgeClass: 'bg-amber-100 text-amber-800'
                },
                hr: {
                    name: 'Elena Vance',
                    initials: 'EV',
                    roleLabel: 'Elena Vance (HR Director)',
                    badge: 'HR',
                    dept: 'HR Director',
                    greeting: 'Welcome back, Elena Vance 📊',
                    title: 'Viewing as: HR Director (Full Organizational Governance)',
                    desc: 'You have full oversight over competency frameworks, bell-curve calibration normalization, LMS compliance, and 9-box succession.',
                    tag: 'HR Administrator',
                    icon: 'fas fa-shield-halved',
                    bannerClass: 'bg-purple-50/80 border-purple-200 text-purple-950',
                    badgeClass: 'bg-purple-100 text-purple-800'
                },
                executive: {
                    name: 'Robert Sterling',
                    initials: 'RS',
                    roleLabel: 'Robert Sterling (GM / Exec)',
                    badge: 'Exec',
                    dept: 'General Manager',
                    greeting: 'Executive Briefing, General Manager Sterling 🏨',
                    title: 'Viewing as: General Manager (Executive Strategic View)',
                    desc: 'Strategic overview of property-wide Hospitality Index, guest NPS analytics, leadership bench depth, and training ROI.',
                    tag: 'General Manager',
                    icon: 'fas fa-chess-king',
                    bannerClass: 'bg-slate-100 border-slate-300 text-slate-950',
                    badgeClass: 'bg-slate-200 text-slate-800'
                }
            };

            function switchRole(roleKey) {
                activePersonaKey = roleKey;
                const persona = personaData[roleKey] || personaData.employee;

                document.querySelectorAll('.sidebar-user-name').forEach(el => el.textContent = persona.name);
                document.querySelectorAll('.sidebar-user-dept').forEach(el => el.textContent = persona.dept);
                document.querySelectorAll('.role-badge-tag').forEach(el => el.textContent = persona.badge);
                document.querySelectorAll('.user-avatar-circle').forEach(el => el.textContent = persona.initials);
                const heroGreet = document.getElementById('hero-greeting-text');
                if (heroGreet) heroGreet.textContent = persona.greeting;

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

                showToast(`Signed in: ${persona.name} (${persona.tag})`, 'info');
            }

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
                        const roleKey = res.data.roleKey || user.role_key || 'employee';

                        switchRole(roleKey);
                        document.getElementById('auth-screen').classList.add('hidden');
                        showToast(`Welcome ${user.full_name} (${user.title})!`, 'success');
                        initAllCharts();
                    } else {
                        showToast(res?.message || 'Login failed. Please check credentials.', 'error');
                    }
                } catch (err) {
                    // Fallback to demo entry
                    document.getElementById('auth-screen').classList.add('hidden');
                    showToast('Welcome to Oxford Suites, Makati!', 'success');
                    initAllCharts();
                }
            }

            async function logOutToAuth() {
                document.getElementById('auth-screen').classList.remove('hidden');
                showToast('Signed out of session', 'info');
                try {
                    await AuthAPI.logout();
                } catch (err) {
                    console.warn('Backend logout sync:', err);
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

            // Handlers
            function handleGoalSubmit(e) {
                e.preventDefault();
                const title = document.getElementById('goal-title-input').value;
                const cat = document.getElementById('goal-cat-input').value;
                const date = document.getElementById('goal-date-input').value;
                const kpi = document.getElementById('goal-kpi-input').value;
                const weight = document.getElementById('goal-weight-input') ? document.getElementById('goal-weight-input').value : '20% (Standard)';
                const evidence = document.getElementById('goal-evidence-input') ? document.getElementById('goal-evidence-input').value : '';

                const tbody = document.getElementById('goals-table-body');
                if (tbody) {
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-slate-50/60 transition bg-emerald-50/20';
                    tr.innerHTML = `
                    <td class="px-5 py-4 font-semibold text-slate-900">
                        ${title}
                        <p class="text-[11px] text-slate-400 font-normal">${cat}</p>
                    </td>
                    <td class="px-5 py-4 font-mono font-medium text-slate-800">${kpi}</td>
                    <td class="px-5 py-4 font-bold text-slate-700">${weight.split(' ')[0]} ${weight.includes('(') ? weight.substring(weight.indexOf('(')) : ''}</td>
                    <td class="px-5 py-4 text-slate-600">${evidence || 'Newly submitted documentation & evidence logs'}</td>
                    <td class="px-5 py-4 text-slate-500">${date}</td>
                    <td class="px-5 py-4 text-right">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Pending Approval</span>
                    </td>
                `;
                    tbody.insertBefore(tr, tbody.firstChild);
                }

                totalGoals++;
                const kpiRatio = document.getElementById('kpi-goals-ratio');
                if (kpiRatio) kpiRatio.textContent = `${completedGoals} of ${totalGoals} Done`;

                closeModal('modal-create-goal');
                showToast(`Goal "${title}" submitted to supervisor!`, 'success');
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

            // =========================================================================
            // LEARNING MANAGEMENT SYSTEM (LMS) - DIGITAL 3D BOOK & SOP LIBRARY
            // =========================================================================
            let currentReadingBookId = null;
            let lmsActiveDeptFilter = 'all';
