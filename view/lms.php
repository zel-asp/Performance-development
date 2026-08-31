<!-- ======================================================== -->
                        <div id="panel-pillar-lms" class="pillar-panel space-y-6">

                            <!-- Top Subnav Pills & Quick Upload Action Bar -->
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div
                                    class="subnav-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar flex-shrink-0">
                                    <button onclick="switchSubTab('lms', 'modules')" class="subnav-pill subnav-lms active"
                                        data-sub="modules">
                                        <i class="fas fa-book-bookmark mr-1.5 text-gold-dark"></i>
                                        <span>Training Books &amp; Docs</span>
                                    </button>
                                    <button onclick="switchSubTab('lms', 'tna')" class="subnav-pill subnav-lms"
                                        data-sub="tna">
                                        <i class="fas fa-chart-pie mr-1.5 text-dusty-dark"></i>
                                        <span>Needs Analysis (TNA)</span>
                                    </button>
                                    <button onclick="switchSubTab('lms', 'compliance')" class="subnav-pill subnav-lms"
                                        data-sub="compliance">
                                        <i class="fas fa-clipboard-check mr-1.5 text-sage-dark"></i>
                                        <span>Compliance Audit</span>
                                    </button>
                                </div>

                                <!-- Action Buttons: Upload Docs & Search -->
                                <div class="flex items-center space-x-2.5">
                                    <button onclick="openModal('modal-lms-upload')"
                                        class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-1.5 flex-shrink-0">
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
                                            class="w-full pl-9 pr-4 py-2 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none transition">
                                    </div>

                                    <!-- Category Chips -->
                                    <div class="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar w-full sm:w-auto pb-1 sm:pb-0 text-xs">
                                        <button onclick="setLmsDeptFilter('all')" data-dept="all" class="lms-dept-filter-chip active px-3 py-1 rounded-full font-bold bg-primary text-white transition text-[11px] whitespace-nowrap">All Books</button>
                                        <button onclick="setLmsDeptFilter('front_office')" data-dept="front_office" class="lms-dept-filter-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 transition text-[11px] whitespace-nowrap">Front Office</button>
                                        <button onclick="setLmsDeptFilter('culinary')" data-dept="culinary" class="lms-dept-filter-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 transition text-[11px] whitespace-nowrap">Culinary</button>
                                        <button onclick="setLmsDeptFilter('fb_service')" data-dept="fb_service" class="lms-dept-filter-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 transition text-[11px] whitespace-nowrap">F&amp;B Service</button>
                                        <button onclick="setLmsDeptFilter('housekeeping')" data-dept="housekeeping" class="lms-dept-filter-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 transition text-[11px] whitespace-nowrap">Housekeeping</button>
                                    </div>
                                </div>

                                <!-- 3D Digital Bookshelf Grid Container -->
                                <div id="lms-bookshelf-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                                    <!-- Dynamic Books rendered via JS -->
                                </div>
                            </div>

                            <!-- Sub-tab 2: Needs Analysis (TNA) -->
                            <div id="sub-lms-tna" class="sub-panel sub-panel-lms space-y-5">
                                <!-- Top 4 Priority TNA Category Cards (Highest Enrolled from Supabase lms_documents & lms_prescribed) -->
                                <div id="tna-category-cards-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                                    <!-- Dynamic 4 Categories rendered via JS -->
                                    <div class="col-span-full py-8 text-center text-slate-400">
                                        <i class="fas fa-spinner fa-spin text-2xl text-primary mb-2"></i>
                                        <p class="text-xs font-semibold text-slate-500">Loading top enrolled TNA categories from Supabase...</p>
                                    </div>
                                </div>

                                <!-- Training Needs & Book Enrollment Progress Matrix -->
                                <div class="card-clean p-6 space-y-5">
                                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E8DEDC] pb-4">
                                        <div>
                                            <div class="flex items-center space-x-2">
                                                <h3 class="font-heading font-bold text-base text-slate-900">LMS Handbook Enrollments &amp; Associate Progress</h3>
                                                <span class="badge-sage">Live TNA Audit</span>
                                            </div>
                                            <p class="text-xs text-slate-500 mt-0.5">Track enrolled associates, quiz points, post-study competency re-evaluations, and certification milestones</p>
                                        </div>

                                        <div class="flex flex-wrap items-center gap-2">
                                            <!-- Book Filter -->
                                            <select id="tna-book-filter" onchange="filterTnaEnrollments()"
                                                class="px-3 py-1.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold text-slate-700 focus:outline-none">
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
                                                    class="pl-8 pr-3 py-1.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary w-36 sm:w-44">
                                            </div>

                                            <button onclick="openRemedialBooksModal()"
                                                class="px-3.5 py-1.5 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5">
                                                <i class="fas fa-book-medical"></i>
                                                <span>Prescribe Book</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Table of Enrolled Employees with Quiz Points & Re-evaluate Action -->
                                    <div class="overflow-x-auto custom-scrollbar">
                                        <table class="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr class="border-b border-[#E8DEDC] text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-[#FAF8F7]/50">
                                                    <th class="py-3 px-3 w-10 text-center rounded-l-xl">#</th>
                                                    <th class="py-3 px-3">Enrolled Associate</th>
                                                    <th class="py-3 px-3">Handbook Title &amp; Department</th>
                                                    <th class="py-3 px-3">Quiz Points &amp; Progress</th>
                                                    <th class="py-3 px-3">Rating / Status</th>
                                                    <th class="py-3 px-3">Last Attempt</th>
                                                    <th class="py-3 px-3 text-right rounded-r-xl">Audit Action</th>
                                                </tr>
                                            </thead>
                                            <tbody id="tna-enrollments-table-body" class="divide-y divide-[#E8DEDC]">
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
                                        <div class="p-4 rounded-2xl bg-[#FAF8F7] border border-[#E8DEDC]">
                                            <p class="text-slate-500">Hotel Compliance</p>
                                            <p class="text-2xl font-bold text-sage-dark mt-1">96.2%</p>
                                        </div>
                                        <div class="p-4 rounded-2xl bg-[#FAF8F7] border border-[#E8DEDC]">
                                            <p class="text-slate-500">Overdue Staff</p>
                                            <p class="text-2xl font-bold text-terracotta-dark mt-1">2</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- ======================================================== -->
                        <!-- PILLAR 4: TRAINING OPERATIONS (12 Functions)             -->
