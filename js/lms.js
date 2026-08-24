const lmsTrainingBooks = [
                {
                    id: 'book_front_office',
                    title: 'Front Desk Standards & VIP Protocols Codex',
                    subtitle: 'Oxford Suites, Makati Hospitality Standard Operating Procedure',
                    dept: 'front_office',
                    deptName: 'Front Office',
                    category: 'SOP Manual',
                    pages: '18 Pages · 4 Chapters',
                    time: '20 min read',
                    xp: 100,
                    author: 'Elena Vance · HR & Front Desk Lead',
                    gradient: 'from-[#7F1418] via-[#9E1B20] to-[#450A0C]',
                    spineColor: 'rgba(217, 119, 6, 0.4)',
                    foilColor: 'border-amber-400/40 text-amber-200',
                    icon: 'fa-bell-concierge',
                    badge: 'VIP Hospitality Standard',
                    badgeBg: 'bg-amber-400 text-amber-950',
                    desc: 'Master the 5-star greeting ritual, keycard encoding, luggage concierge dispatch, and discretion protocols for diplomatic & celebrity guests.',
                    tip: 'Never mention a guest room number aloud in the lobby. Point discreetly to the written key wallet.',
                    chapters: [
                        'Chapter 1: The 10-5 Eye Contact & Greeting Rule',
                        'Chapter 2: Opera Cloud Check-in & Keycard Provisioning',
                        'Chapter 3: VIP Escort & Suite Orientation Etiquette',
                        'Chapter 4: Discretion & Rapid Luggage Logistics'
                    ],
                    sopSteps: [
                        { step: '1. Warm Welcome', text: 'Acknowledge approaching guests within 10 feet with genuine eye contact, offering chilled infused water towels during summer months.' },
                        { step: '2. Identity & Profile Check', text: 'Confirm reservation in Opera PMS without verbalizing confidential contact details or suite room numbers.' },
                        { step: '3. Digital Key Provisioning', text: 'Encode dual RFID keycards, present within gold-embossed key folder along with property Wi-Fi card.' },
                        { step: '4. Concierge Handoff', text: 'Signal the concierge desk via subtle gesture for luggage escort and elevator escort to guest suite.' }
                    ]
                },
                {
                    id: 'book_haccp',
                    title: 'HACCP Hygiene & Cold-Chain Protocol Manual',
                    subtitle: 'Kitchen Cold-Storage & Surface Sanitation Guide',
                    dept: 'culinary',
                    deptName: 'Culinary',
                    category: 'Compliance Standard',
                    pages: '24 Pages · 5 Chapters',
                    time: '25 min read',
                    xp: 100,
                    author: 'Chef Marco Rossi · Executive Sous Chef',
                    gradient: 'from-[#065F46] via-[#047857] to-[#022C22]',
                    spineColor: 'rgba(16, 185, 129, 0.4)',
                    foilColor: 'border-emerald-300/40 text-emerald-100',
                    icon: 'fa-utensils',
                    badge: 'Mandatory HACCP Safety',
                    badgeBg: 'bg-emerald-400 text-emerald-950',
                    desc: 'Comprehensive protocols for dual temperature logging, meat & dairy segregation, 7-step hand scrubbing, and allergen cross-contact prevention.',
                    tip: 'Walk-in chillers must strictly maintain 2°C to 4°C. Check logs every 4 hours and report any ±1°C fluctuation immediately.',
                    chapters: [
                        'Chapter 1: 7-Step Medical Grade Hand Scrubbing',
                        'Chapter 2: Critical Control Points (CCP) & Temperature Logs',
                        'Chapter 3: Cross-Contamination Prevention (Color-coded Boards)',
                        'Chapter 4: Blast Chilling & Rapid Food Storage SOP',
                        'Chapter 5: Allergen Segregation & Guest Notification'
                    ],
                    sopSteps: [
                        { step: '1. Hand Scrubbing Station', text: 'Lather forearms and hands with antibacterial foam for 20 seconds, rinse under 38°C water, and air dry.' },
                        { step: '2. Thermometer Probe Calibration', text: 'Sanitize digital probe with alcohol wipes before and after checking inner core meat temperatures.' },
                        { step: '3. Cold-Chain Log Entry', text: 'Record temperature in digital tablet log at 06:00, 10:00, 14:00, 18:00, and 22:00.' },
                        { step: '4. FIFO Stock Rotation', text: 'Apply First-In, First-Out labels with batch expiration date on every vacuum-sealed container.' }
                    ]
                },
                {
                    id: 'book_sommelier',
                    title: 'Sommelier Fine Wine Pairing & Vintage Compendium',
                    subtitle: 'Bordeaux, Burgundy, & New World Varietals Codex',
                    dept: 'fb_service',
                    deptName: 'F&B Service',
                    category: 'Masterclass Guide',
                    pages: '32 Pages · 6 Chapters',
                    time: '35 min read',
                    xp: 150,
                    author: 'Pierre Dubois · Master Sommelier',
                    gradient: 'from-[#92400E] via-[#B45309] to-[#451A03]',
                    spineColor: 'rgba(245, 158, 11, 0.4)',
                    foilColor: 'border-amber-300/50 text-amber-100',
                    icon: 'fa-wine-glass-empty',
                    badge: 'Sommelier Masterclass',
                    badgeBg: 'bg-amber-400 text-amber-950',
                    desc: 'Expert guide to vintage evaluations, decanting techniques for aged Grand Crus, flavor balancing with chef tasting menus, and cellar storage.',
                    tip: 'Hold the wine bottle from the punt base with the label facing the guest at all times during tableside presentation.',
                    chapters: [
                        'Chapter 1: Old World vs New World Terroir Profiles',
                        'Chapter 2: Acidity, Tannin, and Sweetness Food Balancing',
                        'Chapter 3: Tableside Decanting & Crystal Glass Selection',
                        'Chapter 4: Champagne & Sparkling Service Rituals',
                        'Chapter 5: Premium Wine Upselling & Storytelling'
                    ],
                    sopSteps: [
                        { step: '1. Label Presentation', text: 'Present the bottle to the host with the label clearly facing up, stating vintage, château name, and appellation.' },
                        { step: '2. Capsule Cutting & Extraction', text: 'Cut the foil cleanly below the second lip of the bottle neck, extracting cork smoothly without audible pop.' },
                        { step: '3. Tasting Pour (30ml)', text: 'Pour a 30ml tasting measure for the host to approve clarity, aroma bouquet, and temperature.' },
                        { step: '4. Clockwise Table Service', text: 'Serve guests clockwise starting with ladies, filling glasses to the widest bowl contour (maximum 1/3 glass).' }
                    ]
                },
                {
                    id: 'book_opera_pms',
                    title: 'Opera Cloud PMS & Room Dispatch Masterclass',
                    subtitle: 'Fast-Track Reservation, Split Billing & Room Allocation',
                    dept: 'front_office',
                    deptName: 'Front Office',
                    category: 'SOP Manual',
                    pages: '16 Pages · 4 Chapters',
                    time: '18 min read',
                    xp: 100,
                    author: 'Ana Tanaka · Night Auditor Lead',
                    gradient: 'from-[#1E3A8A] via-[#1D4ED8] to-[#0F172A]',
                    spineColor: 'rgba(59, 130, 246, 0.4)',
                    foilColor: 'border-blue-300/40 text-blue-100',
                    icon: 'fa-desktop',
                    badge: 'Core Systems Mastery',
                    badgeBg: 'bg-blue-400 text-blue-950',
                    desc: 'Step-by-step shortcuts for Opera Cloud: fast check-in under 60 seconds, split billing for corporate guests, and floor status synchronization.',
                    tip: 'Use Alt+F shortcuts to instantly locate guest loyalty tier points without navigating through nested sub-windows.',
                    chapters: [
                        'Chapter 1: Accelerated 60-Second Check-in Workflow',
                        'Chapter 2: Corporate Folio Routing & Split Charges',
                        'Chapter 3: Housekeeping Status Sync & Queue Rooms',
                        'Chapter 4: Night Audit Balancing & Discrepancy Reconciliation'
                    ],
                    sopSteps: [
                        { step: '1. Quick Search Key', text: 'Press F8 and enter reservation confirmation number or guest surname.' },
                        { step: '2. Pre-authorization Lock', text: 'Swipe credit card for room rate plus $150 incidentals daily pre-authorization hold.' },
                        { step: '3. RFID Keycard Sync', text: 'Place keycards on RFID terminal and press Generate Key (Shift+K).' },
                        { step: '4. Instant Folio Window', text: 'Route company expenses to Window 2 and personal minibar incidentals to Window 1.' }
                    ]
                },
                {
                    id: 'book_housekeeping',
                    title: 'Five-Star Suite Turndown & Linen Standard Handbook',
                    subtitle: 'Hospitality Housekeeping Precision & Room Inspection',
                    dept: 'housekeeping',
                    deptName: 'Housekeeping',
                    category: 'SOP Manual',
                    pages: '22 Pages · 5 Chapters',
                    time: '20 min read',
                    xp: 100,
                    author: 'Rosa Flores · Floor Supervisor',
                    icon: 'fa-bed',
                    badge: 'Housekeeping Standard',
                    desc: 'Master the 45-degree hospital fold bed making, aromatherapy pillow placement, bathroom marble buffing, and turndown treats styling.',
                    tip: 'Never leave fingerprints on polished brass handles or bathroom mirrors. Use microfiber glass towels for final inspection.',
                    chapters: [
                        'Chapter 1: 300-Thread Count Fitted Sheet & Hospital Fold Bedding',
                        'Chapter 2: Evening Turndown Lighting & Foot Mat Alignment',
                        'Chapter 3: Bathroom Marble Sanitation & Eco-friendly Amenities',
                        'Chapter 4: Minibar Audit & Refresh Standards'
                    ],
                    sopSteps: [
                        { step: '1. Strip & Sanitize', text: 'Strip used linens into laundry trolley, inspect mattress protector, and sanitize high-touch remotes and switches.' },
                        { step: '2. Bed Dressing', text: 'Smooth Egyptian cotton fitted sheet tightly, fold duvet corner at 45° angle, and fluff 4 down pillows upright.' },
                        { step: '3. Evening Turndown Ambience', text: 'Dim bedside lamp, set ambient jazz audio to volume 2, and place lavender essential pillow mist.' },
                        { step: '4. Quality Card Signature', text: 'Place inspector handwritten greeting card on the nightstand beside bedside slippers.' }
                    ]
                },
                {
                    id: 'book_crisis',
                    title: 'Crisis Diplomacy & Frontline De-escalation Protocol',
                    subtitle: 'Service Recovery, Emergency Evacuation & Guest Reassurance',
                    dept: 'all',
                    deptName: 'Property-Wide',
                    category: 'Safety Protocol',
                    pages: '15 Pages · 3 Chapters',
                    time: '15 min read',
                    xp: 120,
                    author: 'Carlos Gomez & Security Operations',
                    icon: 'fa-shield-halved',
                    badge: 'Emergency Protocol',
                    desc: 'Standardized LAST method (Listen, Apologize, Solve, Thank) for handling upset guests, emergency medical dispatch, and fire alarm evacuation routes.',
                    tip: 'Always lower your vocal tone by 10% and slow speech pacing when de-escalating an agitated guest.',
                    chapters: [
                        'Chapter 1: The LAST Framework for Service Recovery',
                        'Chapter 2: $200 Incident Recovery Budget Empowerment',
                        'Chapter 3: Medical Emergency & First-Aid Dispatch',
                        'Chapter 4: Fire Alarm Zones & Assembly Area Coordination'
                    ],
                    sopSteps: [
                        { step: '1. Active Listening', text: 'Listen without interruption for 60 seconds, taking written notes to validate guest concerns.' },
                        { step: '2. Sincere Empathy', text: 'Acknowledge the emotional impact without placing blame on other team members or departments.' },
                        { step: '3. Empowered Action', text: 'Exercise instant service recovery: complimentary dining voucher or room category upgrade immediately.' },
                        { step: '4. Follow-up & Log', text: 'Check back with guest in 30 minutes and record incident in the Daily Duty Manager handover log.' }
                    ]
                }
            ];

            function renderLmsBooks() {
                const container = document.getElementById('lms-bookshelf-grid');
                if (!container) return;

                const searchInput = (document.getElementById('lms-search-input')?.value || '').toLowerCase().trim();
                const filtered = lmsTrainingBooks.filter(b => {
                    const matchDept = (lmsActiveDeptFilter === 'all' || b.dept === lmsActiveDeptFilter || b.dept === 'all');
                    const matchText = !searchInput || 
                        b.title.toLowerCase().includes(searchInput) || 
                        b.desc.toLowerCase().includes(searchInput) ||
                        b.category.toLowerCase().includes(searchInput) ||
                        b.deptName.toLowerCase().includes(searchInput);
                    return matchDept && matchText;
                });

                let booksHtml = filtered.map(book => {
                    return `
                        <!-- Minimalist Clean Book Card -->
                        <div class="card-clean p-5 flex flex-col justify-between h-full group bg-white border border-[#E8DEDC] hover:border-[#D8CECB] transition">
                            <div class="space-y-3">
                                <!-- Top Badges & Icon -->
                                <div class="flex items-center justify-between">
                                    <div class="w-9 h-9 rounded-xl bg-[#FAF8F7] text-primary border border-[#E8DEDC] flex items-center justify-center text-sm font-bold shadow-2xs">
                                        <i class="fas ${book.icon}"></i>
                                    </div>
                                    <div class="flex items-center space-x-1.5">
                                        <span class="badge-secondary">${book.deptName}</span>
                                        <span class="badge-gold">+${book.xp} XP</span>
                                    </div>
                                </div>
                                
                                <!-- Content -->
                                <div>
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${book.category}</span>
                                    <h4 class="font-heading font-bold text-sm sm:text-base text-slate-900 mt-0.5 leading-snug group-hover:text-primary transition">${book.title}</h4>
                                    <p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">${book.desc}</p>
                                </div>

                                <!-- Metadata Row -->
                                <div class="pt-2.5 border-t border-[#E8DEDC] flex items-center justify-between text-[11px] text-slate-400">
                                    <span class="truncate max-w-[140px]"><i class="fas fa-feather-pointed mr-1 text-slate-400"></i> ${book.author}</span>
                                    <span class="font-medium text-slate-600">${book.pages}</span>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="pt-3.5 flex items-center justify-between gap-2 border-t border-[#E8DEDC] mt-3.5">
                                <button onclick="openBookReader('${book.id}')"
                                    class="flex-1 py-2 px-3 btn-primary text-xs font-bold flex items-center justify-center space-x-1.5">
                                    <i class="fas fa-book-open text-xs"></i>
                                    <span>Read Handbook</span>
                                </button>
                                <button onclick="launchInteractiveQuiz('${book.title.replace(/'/g, "\\'")}')"
                                    class="py-2 px-3 btn-secondary text-xs font-semibold flex items-center space-x-1 flex-shrink-0">
                                    <i class="fas fa-graduation-cap text-gold-dark text-xs"></i>
                                    <span>Quiz</span>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');

                // Add Upload New Document / Book Card Slot on Shelf
                const uploadCardSlot = `
                    <div onclick="openModal('modal-lms-upload')"
                        class="border-2 border-dashed border-[#E8DEDC] hover:border-primary bg-[#FAF8F7] hover:bg-primary-50/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition group min-h-[260px]">
                        <div class="w-12 h-12 rounded-xl bg-white border border-[#E8DEDC] group-hover:border-primary-100 flex items-center justify-center text-primary text-xl shadow-2xs group-hover:scale-105 transition mb-2.5">
                            <i class="fas fa-file-circle-plus"></i>
                        </div>
                        <h4 class="font-heading font-bold text-sm text-slate-900 group-hover:text-primary transition">Upload Handbook / SOP</h4>
                        <p class="text-xs text-slate-500 max-w-[200px] mt-1 leading-relaxed">Publish PDF standard operating procedures or guides</p>
                        <span class="mt-3.5 px-3 py-1.5 rounded-full btn-primary text-[11px] font-bold transition flex items-center space-x-1.5">
                            <i class="fas fa-arrow-up-from-bracket text-xs"></i>
                            <span>Upload Document</span>
                        </span>
                    </div>
                `;

                container.innerHTML = booksHtml + uploadCardSlot;
            }

            function setLmsDeptFilter(deptKey) {
                lmsActiveDeptFilter = deptKey;
                document.querySelectorAll('.lms-dept-filter-chip').forEach(chip => {
                    const chipDept = chip.getAttribute('data-dept');
                    if (chipDept === lmsActiveDeptFilter) {
                        chip.className = 'lms-dept-filter-chip active px-3 py-1 rounded-full font-bold bg-primary text-white transition text-[11px] whitespace-nowrap';
                    } else {
                        chip.className = 'lms-dept-filter-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 transition text-[11px] whitespace-nowrap';
                    }
                });
                renderLmsBooks();
            }

            function filterLmsBooks() {
                renderLmsBooks();
            }

            function openBookReader(bookId) {
                const book = lmsTrainingBooks.find(b => b.id === bookId);
                if (!book) return;

                currentReadingBookId = book.id;

                // Update Header
                document.getElementById('reader-book-title').textContent = book.title;
                document.getElementById('reader-book-author').textContent = `${book.author} · ${book.pages} · ${book.time}`;
                document.getElementById('reader-book-xp-badge').textContent = `+${book.xp} XP Completion`;
                
                // Update Tip
                document.getElementById('reader-tip-text').textContent = book.tip || 'Follow standard 5-star protocol and maintain guest delight at all touchpoints.';

                // Update TOC
                const tocEl = document.getElementById('reader-toc');
                if (tocEl && book.chapters) {
                    tocEl.innerHTML = book.chapters.map((ch, idx) => `
                        <div class="p-2 rounded-lg bg-slate-50 border border-slate-200/70 hover:bg-amber-50/50 hover:border-amber-300 transition cursor-pointer flex items-center justify-between text-xs">
                            <span class="font-medium text-slate-700"><i class="fas fa-bookmark text-amber-500 text-[10px] mr-1.5"></i> ${ch}</span>
                            <span class="text-[10px] font-bold text-slate-400">p.${(idx + 1) * 3}</span>
                        </div>
                    `).join('');
                }

                // Update Procedure Content
                const contentEl = document.getElementById('reader-page-content');
                if (contentEl && book.sopSteps) {
                    contentEl.innerHTML = book.sopSteps.map(step => `
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                            <p class="font-bold text-slate-900 text-xs text-primary">${step.step}</p>
                            <p class="text-xs text-slate-600 leading-relaxed">${step.text}</p>
                        </div>
                    `).join('');
                }

                openModal('modal-book-reader');
            }

            function launchQuizFromReader() {
                if (currentReadingBookId) {
                    const book = lmsTrainingBooks.find(b => b.id === currentReadingBookId);
                    closeModal('modal-book-reader');
                    if (book) {
                        launchInteractiveQuiz(book.title);
                    }
                }
            }

            function handleLmsFileSelect(input) {
                if (input.files && input.files[0]) {
                    const file = input.files[0];
                    const chosenEl = document.getElementById('lms-file-chosen');
                    const chosenName = document.getElementById('lms-file-chosen-name');
                    if (chosenEl && chosenName) {
                        chosenName.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
                        chosenEl.classList.remove('hidden');
                    }
                    if (!document.getElementById('lms-doc-title').value) {
                        const defaultTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
                        document.getElementById('lms-doc-title').value = defaultTitle.charAt(0).toUpperCase() + defaultTitle.slice(1);
                    }
                }
            }

            function submitLmsDocUpload() {
                const title = (document.getElementById('lms-doc-title')?.value || '').trim();
                const dept = document.getElementById('lms-doc-dept')?.value || 'front_office';
                const category = document.getElementById('lms-doc-category')?.value || 'SOP Manual';
                const pages = (document.getElementById('lms-doc-pages')?.value || '15 Pages · 3 Chapters').trim();
                const xp = 100;
                const desc = (document.getElementById('lms-doc-desc')?.value || '').trim() || 'Official hotel standard documentation and operational workflow instructions.';

                if (!title) {
                    showToast('Please enter a document title to publish!', 'error');
                    return;
                }

                const deptNames = {
                    front_office: 'Front Office',
                    culinary: 'Culinary',
                    fb_service: 'F&B Service',
                    housekeeping: 'Housekeeping',
                    banquet: 'Banquets',
                    all: 'Property-Wide'
                };

                const newBook = {
                    id: 'book_' + Date.now(),
                    title: title,
                    subtitle: desc,
                    dept: dept,
                    deptName: deptNames[dept] || 'Hospitality',
                    category: category,
                    pages: pages,
                    time: '15 min read',
                    xp: xp,
                    author: 'Elena Vance (HR Content Management)',
                    icon: 'fa-book-open-reader',
                    badge: 'Newly Uploaded SOP',
                    desc: desc,
                    tip: 'Review all mandatory steps carefully before taking the verification knowledge quiz.',
                    chapters: [
                        'Chapter 1: Standard Operational Overview',
                        'Chapter 2: Quality Assurance & Safety Guidelines',
                        'Chapter 3: Practical Checklist & Digital Sign-off'
                    ],
                    sopSteps: [
                        { step: '1. Preparation & Setup', text: 'Ensure all equipment, workstations, and digital systems are calibrated according to Oxford Suites, Makati specifications.' },
                        { step: '2. Standard Procedure Execution', text: desc },
                        { step: '3. Compliance Audit Sign-off', text: 'Document completion in shift register and inform department supervisor.' }
                    ]
                };

                lmsTrainingBooks.unshift(newBook);
                renderLmsBooks();
                closeModal('modal-lms-upload');
                showToast(`Handbook "${title}" successfully published to associate training library!`, 'success');

                // Reset form
                document.getElementById('lms-doc-title').value = '';
                document.getElementById('lms-doc-desc').value = '';
                document.getElementById('lms-file-chosen')?.classList.add('hidden');
            }

            // ========================================================
            // LMS NEEDS ANALYSIS (TNA) ROSTER & QUIZ POINTS PROGRESS
            // ========================================================
            const lmsTnaEnrollments = [
                {
                    id: 'tna_1',
                    empName: 'Lucas Vargas',
                    empRole: 'Junior Front Desk Host',
                    empDept: 'Front Office',
                    empAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                    bookId: 'book_frontdesk',
                    bookTitle: 'Front Desk Standards & VIP Protocols Codex',
                    bookDept: 'Front Office',
                    quizScore: 55,
                    quizMax: 100,
                    status: 'Needs Retake',
                    statusClass: 'bg-red-100 text-red-800 border-red-200',
                    evalRating: 2.80,
                    targetRating: 4.00,
                    lastAttempt: 'Aug 22, 2026',
                    attemptCount: 1,
                    notes: 'Needs additional practice on Opera Cloud VIP rate override sequence.'
                },
                {
                    id: 'tna_2',
                    empName: 'Jean-Luc Moreau',
                    empRole: 'Chef de Partie',
                    empDept: 'Kitchen & Culinary',
                    empAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                    bookId: 'book_haccp',
                    bookTitle: 'HACCP Hygiene & Cold-Chain Protocol Manual',
                    bookDept: 'Culinary',
                    quizScore: 92,
                    quizMax: 100,
                    status: 'Certified - Passed',
                    statusClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    evalRating: 4.60,
                    targetRating: 4.50,
                    lastAttempt: 'Aug 23, 2026',
                    attemptCount: 2,
                    notes: 'Passed with high distinction. Mastered temperature log compliance.'
                },
                {
                    id: 'tna_3',
                    empName: 'Maria Santos',
                    empRole: 'Bistro Service Lead',
                    empDept: 'Food & Beverage',
                    empAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
                    bookId: 'book_sommelier',
                    bookTitle: 'Grand Sommelier Wine Pairing Compendium',
                    bookDept: 'F&B Service',
                    quizScore: 60,
                    quizMax: 100,
                    status: 'Needs Retake',
                    statusClass: 'bg-amber-100 text-amber-800 border-amber-200',
                    evalRating: 2.40,
                    targetRating: 4.00,
                    lastAttempt: 'Aug 21, 2026',
                    attemptCount: 1,
                    notes: 'Gap in French Bordeaux vintage descriptors. Remedial study prescribed.'
                },
                {
                    id: 'tna_4',
                    empName: 'Fatima Al-Mansoor',
                    empRole: 'Executive Floor Supervisor',
                    empDept: 'Housekeeping',
                    empAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
                    bookId: 'book_housekeeping',
                    bookTitle: 'Five-Star Suite Turn-Down & Hygiene Standard',
                    bookDept: 'Housekeeping',
                    quizScore: 95,
                    quizMax: 100,
                    status: 'Certified - Passed',
                    statusClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    evalRating: 4.80,
                    targetRating: 4.50,
                    lastAttempt: 'Aug 24, 2026',
                    attemptCount: 1,
                    notes: 'Flawless inspection standard score.'
                },
                {
                    id: 'tna_5',
                    empName: 'Antonio Silva',
                    empRole: 'Banquet Logistics Captain',
                    empDept: 'Food & Beverage',
                    empAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
                    bookId: 'book_crisis',
                    bookTitle: 'Crisis Diplomacy & Guest Conflict Manual',
                    bookDept: 'Banquet & Front Office',
                    quizScore: 48,
                    quizMax: 100,
                    status: 'Needs Retake',
                    statusClass: 'bg-red-100 text-red-800 border-red-200',
                    evalRating: 2.80,
                    targetRating: 4.00,
                    lastAttempt: 'Aug 20, 2026',
                    attemptCount: 1,
                    notes: 'Struggled with emergency de-escalation response protocols.'
                },
                {
                    id: 'tna_6',
                    empName: 'Chloe Dupont',
                    empRole: 'Front Desk Hostess',
                    empDept: 'Front Office',
                    empAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
                    bookId: 'book_opera',
                    bookTitle: 'Opera Cloud PMS Reservation & Billing Masterclass',
                    bookDept: 'Front Office',
                    quizScore: 68,
                    quizMax: 100,
                    status: 'In Progress',
                    statusClass: 'bg-blue-100 text-blue-800 border-blue-200',
                    evalRating: 2.95,
                    targetRating: 4.00,
                    lastAttempt: 'Aug 23, 2026',
                    attemptCount: 1,
                    notes: 'Needs re-quiz after reviewing chapter 3 billing splits.'
                }
            ];

            let currentReevalEnrollmentId = null;

            function renderTnaEnrollments() {
                const tbody = document.getElementById('tna-enrollments-table-body');
                if (!tbody) return;

                const bookFilter = document.getElementById('tna-book-filter')?.value || 'all';
                const searchQ = (document.getElementById('tna-search-input')?.value || '').toLowerCase().trim();

                const filtered = lmsTnaEnrollments.filter(item => {
                    const matchesBook = (bookFilter === 'all') || (item.bookId === bookFilter);
                    const matchesSearch = !searchQ || 
                        item.empName.toLowerCase().includes(searchQ) ||
                        item.empRole.toLowerCase().includes(searchQ) ||
                        item.bookTitle.toLowerCase().includes(searchQ) ||
                        item.empDept.toLowerCase().includes(searchQ);
                    return matchesBook && matchesSearch;
                });

                if (filtered.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6" class="py-8 text-center text-slate-400 font-semibold">
                                <i class="fas fa-book-bookmark text-2xl mb-2 block text-slate-300"></i>
                                No associate enrollments matching current filter.
                            </td>
                        </tr>
                    `;
                    return;
                }

                tbody.innerHTML = filtered.map(item => {
                    const scorePct = Math.round((item.quizScore / item.quizMax) * 100);
                    let barColor = 'bg-red-500';
                    if (scorePct >= 80) barColor = 'bg-emerald-500';
                    else if (scorePct >= 60) barColor = 'bg-amber-500';

                    const isBelowThree = item.evalRating < 3.0;

                    return `
                        <tr class="hover:bg-slate-50/80 transition group">
                            <!-- Enrolled Associate -->
                            <td class="py-3.5 px-3">
                                <div class="flex items-center space-x-3">
                                    <img src="${item.empAvatar}" class="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs">
                                    <div>
                                        <p class="font-bold text-slate-900 text-xs">${item.empName}</p>
                                        <p class="text-[11px] text-slate-500">${item.empRole} · <span class="font-semibold text-slate-600">${item.empDept}</span></p>
                                    </div>
                                </div>
                            </td>

                            <!-- Handbook Title -->
                            <td class="py-3.5 px-3">
                                <p class="font-bold text-slate-900 text-xs leading-snug cursor-pointer hover:text-primary transition" onclick="openBookReader('${item.bookId}')">
                                    <i class="fas fa-book mr-1 text-amber-600 text-[10px]"></i> ${item.bookTitle}
                                </p>
                                <span class="text-[10px] font-semibold text-slate-400">${item.bookDept} Handbook</span>
                            </td>

                            <!-- Quiz Points & Score Bar -->
                            <td class="py-3.5 px-3 w-48">
                                <div class="space-y-1">
                                    <div class="flex items-center justify-between text-[11px]">
                                        <span class="font-extrabold ${scorePct >= 80 ? 'text-emerald-700' : (scorePct >= 60 ? 'text-amber-700' : 'text-red-700')}">
                                            ${item.quizScore} / ${item.quizMax} pts
                                        </span>
                                        <span class="font-bold text-slate-500">${scorePct}%</span>
                                    </div>
                                    <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div class="${barColor} h-full rounded-full transition-all duration-500" style="width: ${scorePct}%"></div>
                                    </div>
                                    <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${item.statusClass} inline-block mt-0.5">
                                        ${item.status}
                                    </span>
                                </div>
                            </td>

                            <!-- Rating & Remedial Flag -->
                            <td class="py-3.5 px-3">
                                <div class="space-y-0.5">
                                    <div class="flex items-center space-x-1.5">
                                        <span class="text-xs font-bold ${isBelowThree ? 'text-red-600' : 'text-slate-800'}">
                                            ${item.evalRating.toFixed(2)} / 5.0
                                        </span>
                                        ${isBelowThree ? '<span class="text-[9px] font-extrabold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">&lt;3.0 Gap</span>' : '<span class="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Meets Std</span>'}
                                    </div>
                                    <p class="text-[10px] text-slate-400">Target: <strong>${item.targetRating.toFixed(1)}</strong></p>
                                </div>
                            </td>

                            <!-- Last Attempt -->
                            <td class="py-3.5 px-3">
                                <p class="text-slate-700 font-semibold text-xs">${item.lastAttempt}</p>
                                <span class="text-[10px] text-slate-400">Attempt #${item.attemptCount}</span>
                            </td>

                            <!-- Audit & Re-evaluate Action -->
                            <td class="py-3.5 px-3 text-right">
                                <button onclick="openReevaluateModal('${item.id}')"
                                    class="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition shadow-2xs hover:shadow-xs flex items-center space-x-1 ml-auto group/btn">
                                    <i class="fas fa-rotate-right group-hover/btn:rotate-180 transition duration-300"></i>
                                    <span>Re-evaluate</span>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }

            function filterTnaEnrollments() {
                renderTnaEnrollments();
            }

            function openReevaluateModal(enrollmentId) {
                const item = lmsTnaEnrollments.find(e => e.id === enrollmentId);
                if (!item) return;

                currentReevalEnrollmentId = item.id;

                const nameEl = document.getElementById('reeval-employee-name');
                const titleEl = document.getElementById('reeval-book-title');
                const prevScoreEl = document.getElementById('reeval-prev-score');
                const newScoreEl = document.getElementById('reeval-new-score');
                const ratingSelect = document.getElementById('reeval-new-rating');
                const statusSelect = document.getElementById('reeval-status');
                const notesEl = document.getElementById('reeval-notes');

                if (nameEl) nameEl.textContent = `${item.empName} (${item.empRole} · ${item.empDept})`;
                if (titleEl) titleEl.textContent = item.bookTitle;
                if (prevScoreEl) prevScoreEl.value = `${item.quizScore} / ${item.quizMax} pts (${Math.round((item.quizScore/item.quizMax)*100)}%)`;
                if (newScoreEl) newScoreEl.value = Math.min(100, item.quizScore + 30);
                if (ratingSelect) ratingSelect.value = item.evalRating < 3.0 ? "4.0" : "4.5";
                if (statusSelect) statusSelect.value = "Certified";
                if (notesEl) notesEl.value = `Post-study evaluation for ${item.bookTitle}. Associate demonstrated marked competency improvement during 1-on-1 supervisory review.`;

                openModal('modal-re-evaluate');
            }

            function submitAssociateReevaluation() {
                if (!currentReevalEnrollmentId) return;

                const item = lmsTnaEnrollments.find(e => e.id === currentReevalEnrollmentId);
                if (!item) return;

                const newScore = parseInt(document.getElementById('reeval-new-score')?.value || '90');
                const newRating = parseFloat(document.getElementById('reeval-new-rating')?.value || '4.0');
                const newStatus = document.getElementById('reeval-status')?.value || 'Certified';
                const notes = (document.getElementById('reeval-notes')?.value || '').trim();

                item.quizScore = Math.min(100, Math.max(0, newScore));
                item.evalRating = newRating;
                item.attemptCount += 1;
                item.lastAttempt = 'Just now (Aug 24, 2026)';
                item.notes = notes;

                if (newStatus === 'Certified' || item.quizScore >= 80) {
                    item.status = 'Certified - Passed';
                    item.statusClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                } else if (item.quizScore >= 60) {
                    item.status = 'In Progress';
                    item.statusClass = 'bg-blue-100 text-blue-800 border-blue-200';
                } else {
                    item.status = 'Needs Retake';
                    item.statusClass = 'bg-red-100 text-red-800 border-red-200';
                }

                renderTnaEnrollments();
                closeModal('modal-re-evaluate');
                showToast(`🎉 Re-evaluation saved for ${item.empName}! Quiz Score: ${item.quizScore}/100 pts · Calibrated Rating: ${item.evalRating.toFixed(2)}/5.0`, 'success');
            }

            // ========================================================
            // REMEDIAL LMS BOOKS MODAL HANDLERS (< 3.0 RATING)
            // ========================================================
            const remedialAssociates = {
                lucas: {
                    name: 'Lucas Vargas · Junior Host (Front Office)',
                    detail: 'Evaluated Rating: <strong class="text-red-600">2.80 / 5.0</strong> · Sommelier Wine (<strong class="text-red-600">2.40</strong>) & Conflict De-escalation (<strong class="text-red-600">2.60</strong>)',
                    recommendedBookId: 'book_sommelier'
                },
                antonio: {
                    name: 'Antonio Silva · Banquet Logistics Captain',
                    detail: 'Evaluated Rating: <strong class="text-red-600">2.90 / 5.0</strong> · Crisis Protocol (<strong class="text-red-600">2.40</strong>) & Split Billing (<strong class="text-red-600">2.80</strong>)',
                    recommendedBookId: 'book_crisis'
                },
                maria: {
                    name: 'Maria Santos · Bistro Service Lead',
                    detail: 'Evaluated Rating: <strong class="text-amber-600">3.10 / 5.0</strong> · Identified Gaps: French Wine Pairing (<strong class="text-red-600">2.40</strong>) & Floor Delegation (<strong class="text-red-600">2.80</strong>)',
                    recommendedBookId: 'book_sommelier'
                },
                chloe: {
                    name: 'Chloe Dupont · Front Desk Hostess',
                    detail: 'Evaluated Rating: <strong class="text-red-600">2.95 / 5.0</strong> · Opera PMS Split Billing (<strong class="text-red-600">2.70</strong>)',
                    recommendedBookId: 'book_opera'
                }
            };

            let currentRemedialKey = 'maria';

            function openRemedialBooksModal(empKey) {
                if (empKey && remedialAssociates[empKey]) {
                    currentRemedialKey = empKey;
                    const selectEl = document.getElementById('remedial-associate-select');
                    if (selectEl) selectEl.value = empKey;
                }
                updateRemedialAssociate(currentRemedialKey);
                renderRemedialBooksList();
                openModal('modal-remedial-books');
            }

            function updateRemedialAssociate(empKey) {
                currentRemedialKey = empKey;
                const emp = remedialAssociates[empKey] || remedialAssociates['lucas'];
                const nameEl = document.getElementById('remedial-associate-name');
                const detailEl = document.getElementById('remedial-associate-detail');
                if (nameEl) nameEl.textContent = emp.name;
                if (detailEl) detailEl.innerHTML = emp.detail;
                renderRemedialBooksList();
            }

            function renderRemedialBooksList() {
                const container = document.getElementById('remedial-books-list');
                if (!container) return;

                const emp = remedialAssociates[currentRemedialKey] || remedialAssociates['lucas'];

                container.innerHTML = lmsTrainingBooks.map(book => {
                    const isRecommended = book.id === emp.recommendedBookId;

                    return `
                        <div class="p-3.5 rounded-2xl border ${isRecommended ? 'border-primary/40 bg-primary-50/30 shadow-xs' : 'border-[#E8DEDC] bg-white hover:bg-[#FAF8F7]'} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition">
                            <div class="flex items-start space-x-3">
                                <div class="w-9 h-9 rounded-xl bg-[#FAF8F7] text-primary border border-[#E8DEDC] flex items-center justify-center text-sm shadow-2xs flex-shrink-0">
                                    <i class="fas ${book.icon}"></i>
                                </div>
                                <div class="space-y-0.5">
                                    <div class="flex items-center space-x-2">
                                        <p class="font-bold text-slate-900 text-xs">${book.title}</p>
                                        ${isRecommended ? '<span class="badge-terracotta text-[9px] uppercase tracking-wider font-extrabold">Gap Match</span>' : ''}
                                    </div>
                                    <p class="text-[11px] text-slate-500">${book.deptName} · ${book.category} · <span class="font-medium text-slate-700">${book.pages}</span></p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2 self-end sm:self-auto flex-shrink-0">
                                <button onclick="openBookReader('${book.id}')"
                                    class="px-3 py-1.5 btn-secondary text-xs font-semibold">
                                    Preview
                                </button>
                                <button onclick="assignBookToIdp('${book.id}')"
                                    class="px-3.5 py-1.5 btn-primary text-xs font-bold transition flex items-center space-x-1">
                                    <i class="fas fa-plus mr-1"></i>
                                    <span>Assign to IDP</span>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            function assignBookToIdp(bookId) {
                const book = lmsTrainingBooks.find(b => b.id === bookId);
                if (!book) return;

                const emp = remedialAssociates[currentRemedialKey] || remedialAssociates['lucas'];

                // Add card into the IDP commitments container
                const idpContainer = document.getElementById('idp-perf-commitments-container');
                if (idpContainer) {
                    const newCommitment = document.createElement('div');
                    newCommitment.className = 'p-5 bg-amber-50/70 hover:bg-white rounded-2xl border border-amber-300 transition shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-3 animate-fadeIn';
                    newCommitment.innerHTML = `
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">10% Formal</span>
                                <span class="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">&lt; 3.0 Remedial</span>
                            </div>
                            <h5 class="font-heading font-bold text-slate-900 text-sm">${book.title}</h5>
                            <p class="text-slate-600 text-xs leading-relaxed">Assigned to close competency gap for ${emp.name.split('·')[0].trim()}. Complete handbook and pass quiz for calibration.</p>
                        </div>
                        <div class="pt-3 border-t border-amber-200 flex items-center justify-between text-xs">
                            <span class="text-amber-800 text-[11px] font-semibold"><i class="fas fa-book-medical mr-1"></i>Prescribed</span>
                            <span class="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-300">Enrolled</span>
                        </div>
                    `;
                    idpContainer.prepend(newCommitment);
                }

                // Add or update to TNA roster
                const existing = lmsTnaEnrollments.find(e => e.bookId === bookId && e.empName.includes(emp.name.split('·')[0].trim()));
                if (!existing) {
                    lmsTnaEnrollments.unshift({
                        id: 'tna_' + Date.now(),
                        empName: emp.name.split('·')[0].trim(),
                        empRole: emp.name.includes('(') ? emp.name.split('(')[1].replace(')', '') : 'Associate',
                        empDept: book.deptName,
                        empAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                        bookId: book.id,
                        bookTitle: book.title,
                        bookDept: book.deptName,
                        quizScore: 0,
                        quizMax: 100,
                        status: 'Prescribed (Remedial)',
                        statusClass: 'bg-amber-100 text-amber-800 border-amber-200',
                        evalRating: 2.80,
                        targetRating: 4.00,
                        lastAttempt: 'Not Started',
                        attemptCount: 0,
                        notes: 'Mandatory remedial study prescribed to resolve competency rating < 3.0.'
                    });
                    renderTnaEnrollments();
                }

                closeModal('modal-remedial-books');
                showToast(`📚 Handbook "${book.title}" prescribed to ${emp.name.split('·')[0].trim()}'s 70-20-10 IDP!`, 'success');
            }

            // Comprehensive Kudos Staff Directory with Performance Averages
