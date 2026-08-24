<!-- ======================================================== -->
                        <div id="panel-pillar-lms" class="pillar-panel space-y-6">

                            <!-- Top Subnav Pills & Quick Upload Action Bar -->
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div
                                    class="raindrop-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar flex-shrink-0">
                                    <button onclick="switchSubTab('lms', 'modules')" class="subnav-pill subnav-lms active"
                                        data-sub="modules">
                                        <i class="fas fa-book-bookmark mr-1.5 text-amber-500"></i> Training Books & Docs Library
                                    </button>
                                    <button onclick="switchSubTab('lms', 'tna')" class="subnav-pill subnav-lms"
                                        data-sub="tna">
                                        <i class="fas fa-chart-pie-simple mr-1.5"></i> Needs Analysis (TNA)
                                    </button>
                                    <button onclick="switchSubTab('lms', 'compliance')" class="subnav-pill subnav-lms"
                                        data-sub="compliance">
                                        <i class="fas fa-clipboard-check mr-1.5"></i> Compliance Audit
                                    </button>
                                </div>

                                <!-- Action Buttons: Upload Docs & Search -->
                                <div class="flex items-center space-x-2.5">
                                    <button onclick="openModal('modal-lms-upload')"
                                        class="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center space-x-1.5 btn-raindrop flex-shrink-0">
                                        <i class="fas fa-file-arrow-up"></i>
                                        <span>+ Upload Document / SOP</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Sub-tab 1: Training Books & Document Library (Active by Default) -->
                            <div id="sub-lms-modules" class="sub-panel sub-panel-lms active space-y-4">
                                
                                <!-- Search & Department Category Filter Bar -->
                                <div class="card-clean p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
                                    <!-- Search Input -->
                                    <div class="relative w-full sm:w-72">
                                        <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                        <input id="lms-search-input" type="text" oninput="filterLmsBooks()"
                                            placeholder="Search handbook, SOP manual, or topic..."
                                            class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none transition">
                                    </div>

                                    <!-- Category Chips -->
                                    <div class="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar w-full sm:w-auto pb-1 sm:pb-0 text-xs">
                                        <button onclick="setLmsDeptFilter('all')" data-dept="all" class="lms-dept-filter-chip active px-3 py-1 rounded-full font-bold bg-amber-500 text-white shadow-2xs transition text-[11px] whitespace-nowrap">All Books</button>
                                        <button onclick="setLmsDeptFilter('front_office')" data-dept="front_office" class="lms-dept-filter-chip px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-[11px] whitespace-nowrap">Front Office</button>
                                        <button onclick="setLmsDeptFilter('culinary')" data-dept="culinary" class="lms-dept-filter-chip px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-[11px] whitespace-nowrap">Culinary</button>
                                        <button onclick="setLmsDeptFilter('fb_service')" data-dept="fb_service" class="lms-dept-filter-chip px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-[11px] whitespace-nowrap">F&B Service</button>
                                        <button onclick="setLmsDeptFilter('housekeeping')" data-dept="housekeeping" class="lms-dept-filter-chip px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-[11px] whitespace-nowrap">Housekeeping</button>
                                    </div>
                                </div>

                                <!-- 3D Digital Bookshelf Grid Container -->
                                <div id="lms-bookshelf-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                                    <!-- Dynamic Books rendered via JS -->
                                </div>
                            </div>

                            <!-- Sub-tab 2: Needs Analysis (TNA) -->
                            <div id="sub-lms-tna" class="sub-panel sub-panel-lms space-y-5">
                                <!-- Top Priority TNA Highlights -->
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                    <div class="card-clean p-5 border-l-4 border-l-red-500 space-y-1.5 hover:shadow-md transition">
                                        <div class="flex items-center justify-between">
                                            <p class="font-bold text-red-700 uppercase text-[10px] tracking-wider"><i class="fas fa-triangle-exclamation mr-1"></i> High Priority TNA</p>
                                            <span class="text-[10px] font-extrabold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">3 Enrolled</span>
                                        </div>
                                        <p class="text-base font-bold text-slate-900">HACCP Cold-Chain Log</p>
                                        <p class="text-slate-500 text-[11px] leading-relaxed">Triggered by Kitchen hygiene audit findings & temp breaches.</p>
                                        <div class="pt-2 flex items-center justify-between border-t border-slate-100">
                                            <button onclick="openBookReader('book_haccp')" class="text-primary font-bold hover:underline text-[11px]">Open Manual &rarr;</button>
                                            <span class="text-[10px] font-semibold text-slate-400">Avg Score: 68 pts</span>
                                        </div>
                                    </div>

                                    <div class="card-clean p-5 border-l-4 border-l-amber-500 space-y-1.5 hover:shadow-md transition">
                                        <div class="flex items-center justify-between">
                                            <p class="font-bold text-amber-700 uppercase text-[10px] tracking-wider"><i class="fas fa-wine-glass mr-1"></i> Service Excellence</p>
                                            <span class="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">4 Enrolled</span>
                                        </div>
                                        <p class="text-base font-bold text-slate-900">Wine Upselling Pacing</p>
                                        <p class="text-slate-500 text-[11px] leading-relaxed">Triggered by F&B check average benchmark & sommelier gap.</p>
                                        <div class="pt-2 flex items-center justify-between border-t border-slate-100">
                                            <button onclick="openBookReader('book_sommelier')" class="text-primary font-bold hover:underline text-[11px]">Open Wine Guide &rarr;</button>
                                            <span class="text-[10px] font-semibold text-slate-400">Avg Score: 62 pts</span>
                                        </div>
                                    </div>

                                    <div class="card-clean p-5 border-l-4 border-l-blue-500 space-y-1.5 hover:shadow-md transition">
                                        <div class="flex items-center justify-between">
                                            <p class="font-bold text-blue-700 uppercase text-[10px] tracking-wider"><i class="fas fa-shield-halved mr-1"></i> Mandatory Annual</p>
                                            <span class="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">24 Enrolled</span>
                                        </div>
                                        <p class="text-base font-bold text-slate-900">Fire Safety & Crisis Codex</p>
                                        <p class="text-slate-500 text-[11px] leading-relaxed">Annual hospitality license renewal for all hotel associates.</p>
                                        <div class="pt-2 flex items-center justify-between border-t border-slate-100">
                                            <button onclick="openBookReader('book_crisis')" class="text-primary font-bold hover:underline text-[11px]">Open Emergency Codex &rarr;</button>
                                            <span class="text-[10px] font-semibold text-slate-400">Avg Score: 78 pts</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Training Needs & Book Enrollment Progress Matrix -->
                                <div class="card-clean p-6 space-y-5">
                                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div>
                                            <div class="flex items-center space-x-2">
                                                <h3 class="font-heading font-bold text-base text-slate-900">LMS Handbook Enrollments & Associate Progress</h3>
                                                <span class="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Live TNA Audit</span>
                                            </div>
                                            <p class="text-xs text-slate-500 mt-0.5">Track enrolled associates, quiz points, post-study competency re-evaluations, and certification milestones</p>
                                        </div>

                                        <div class="flex flex-wrap items-center gap-2">
                                            <!-- Book Filter -->
                                            <select id="tna-book-filter" onchange="filterTnaEnrollments()"
                                                class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none shadow-2xs">
                                                <option value="all">All Enrolled Books</option>
                                                <option value="book_frontdesk">Front Desk Standards Codex</option>
                                                <option value="book_haccp">HACCP Hygiene Manual</option>
                                                <option value="book_sommelier">Sommelier Wine Compendium</option>
                                                <option value="book_opera">Opera Cloud PMS Masterclass</option>
                                                <option value="book_housekeeping">Five-Star Turn-Down Standard</option>
                                                <option value="book_crisis">Crisis Diplomacy Manual</option>
                                            </select>

                                            <!-- Search Associate -->
                                            <div class="relative">
                                                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                                                <input id="tna-search-input" oninput="filterTnaEnrollments()" type="text" placeholder="Search associate..."
                                                    class="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary w-36 sm:w-44">
                                            </div>

                                            <button onclick="openRemedialBooksModal()"
                                                class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5 btn-raindrop">
                                                <i class="fas fa-book-medical"></i>
                                                <span>Prescribe Book</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Table of Enrolled Employees with Quiz Points & Re-evaluate Action -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr class="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                                                    <th class="py-3 px-3 rounded-l-xl">Enrolled Associate</th>
                                                    <th class="py-3 px-3">Handbook Title & Department</th>
                                                    <th class="py-3 px-3">Quiz Points & Progress</th>
                                                    <th class="py-3 px-3">Rating / Status</th>
                                                    <th class="py-3 px-3">Last Attempt</th>
                                                    <th class="py-3 px-3 text-right rounded-r-xl">Audit Action</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tna-enrollments-table-body" class="divide-y divide-slate-100">
                                                <!-- Dynamic Rows rendered via JS -->
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <!-- Sub-tab 3: Compliance Rates -->
                            <div id="sub-lms-compliance" class="sub-panel sub-panel-lms space-y-4">
                                <div class="card-clean p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                                    <div>
                                        <h4 class="font-bold text-xs text-slate-800 mb-2">Departmental Training Compliance</h4>
                                        <div class="h-52 w-full">
                                            <canvas id="chart-lms-compliance"></canvas>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-3 text-xs">
                                        <div class="p-4 rounded-2xl bg-slate-50">
                                            <p class="text-slate-500">Hotel Compliance</p>
                                            <p class="text-2xl font-bold text-emerald-600 mt-1">96.2%</p>
                                        </div>
                                        <div class="p-4 rounded-2xl bg-slate-50">
                                            <p class="text-slate-500">Overdue Staff</p>
                                            <p class="text-2xl font-bold text-red-600 mt-1">2</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- ======================================================== -->
                        <!-- PILLAR 4: TRAINING OPERATIONS (12 Functions)             -->
