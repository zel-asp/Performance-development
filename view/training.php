<!-- ======================================================== -->
                        <div id="panel-pillar-training" class="pillar-panel space-y-6">

                            <div
                                class="subnav-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar">
                                <button onclick="switchSubTab('training', 'schedules')"
                                    class="subnav-pill subnav-training active" data-sub="schedules">
                                    <i class="fas fa-calendar-days mr-1.5 text-dusty-dark"></i>
                                    <span>Schedules &amp; Trainers</span>
                                </button>
                                <button onclick="switchSubTab('training', 'attendance')"
                                    class="subnav-pill subnav-training" data-sub="attendance">
                                    <i class="fas fa-user-check mr-1.5 text-sage-dark"></i>
                                    <span>Attendance Log</span>
                                </button>
                                <button onclick="switchSubTab('training', 'certs')" class="subnav-pill subnav-training"
                                    data-sub="certs">
                                    <i class="fas fa-certificate mr-1.5 text-gold-dark"></i>
                                    <span>Licenses &amp; Certs</span>
                                </button>
                            </div>

                            <!-- Schedules -->
                            <div id="sub-training-schedules"
                                class="sub-panel sub-panel-training active space-y-3 text-xs">
                                <div class="card-clean p-5 flex flex-wrap items-center justify-between gap-3">
                                    <div class="space-y-1">
                                        <span class="badge-sage">Upcoming Workshop</span>
                                        <h4 class="font-bold text-sm text-slate-900 mt-1">Sommelier Wine Pairing &amp; Fine Dining Service</h4>
                                        <p class="text-slate-500">Aug 26 (14:00 - 16:30) · Main Dining Room · Trainer: <strong>Master Sommelier Pierre</strong></p>
                                    </div>
                                    <button onclick="showToast('Registered for Session', 'success')"
                                        class="btn-primary px-4 py-2 text-xs font-bold">Register Associate</button>
                                </div>
                            </div>

                            <!-- Attendance -->
                            <div id="sub-training-attendance" class="sub-panel sub-panel-training space-y-4">
                                <div class="card-clean overflow-hidden">
                                    <table class="w-full text-left text-xs">
                                        <thead
                                            class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                                            <tr>
                                                <th class="px-5 py-3">Associate</th>
                                                <th class="px-5 py-3">Training Session</th>
                                                <th class="px-5 py-3">Trainer</th>
                                                <th class="px-5 py-3">Attendance</th>
                                                <th class="px-5 py-3 text-right">Result</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-[#E8DEDC]">
                                            <tr class="hover:bg-[#FAF8F7]/70 transition">
                                                <td class="px-5 py-3.5 font-bold text-slate-900">Maria Santos</td>
                                                <td class="px-5 py-3.5 text-slate-500">HACCP Food Safety Level 3</td>
                                                <td class="px-5 py-3.5 text-slate-500">Chef Marco</td>
                                                <td class="px-5 py-3.5"><span class="badge-sage">Present (100%)</span></td>
                                                <td class="px-5 py-3.5 text-right font-bold text-sage-dark">Certified</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Certs -->
                            <div id="sub-training-certs" class="sub-panel sub-panel-training space-y-4">
                                <div class="card-clean overflow-hidden">
                                    <table class="w-full text-left text-xs">
                                        <thead
                                            class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                                            <tr>
                                                <th class="px-5 py-3">Certification</th>
                                                <th class="px-5 py-3">Authority</th>
                                                <th class="px-5 py-3">Expiry Date</th>
                                                <th class="px-5 py-3">Status</th>
                                                <th class="px-5 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="certs-table-body" class="divide-y divide-[#E8DEDC]">
                                            <tr class="hover:bg-[#FAF8F7]/70 transition">
                                                <td class="px-5 py-3.5 font-bold text-slate-900">HACCP Food Safety Level 3</td>
                                                <td class="px-5 py-3.5 text-slate-500">National Hospitality Board</td>
                                                <td class="px-5 py-3.5 text-slate-500">Jan 10, 2027</td>
                                                <td class="px-5 py-3.5"><span class="badge-sage">Valid</span></td>
                                                <td class="px-5 py-3.5 text-right"><button
                                                        onclick="showToast('Viewing Certificate...', 'info')"
                                                        class="text-primary font-bold hover:underline">View PDF</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        <!-- ======================================================== -->
                        <!-- PILLAR 5: SUCCESSION PLANNING & 9-BOX TALENT GRID        -->
