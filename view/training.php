<!-- ======================================================== -->
                        <div id="panel-pillar-training" class="pillar-panel space-y-6">

                            <div
                                class="raindrop-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar">
                                <button onclick="switchSubTab('training', 'schedules')"
                                    class="subnav-pill subnav-training active" data-sub="schedules">
                                    <i class="fas fa-calendar-days mr-1.5"></i> Schedules & Trainers
                                </button>
                                <button onclick="switchSubTab('training', 'attendance')"
                                    class="subnav-pill subnav-training" data-sub="attendance">
                                    <i class="fas fa-user-check mr-1.5"></i> Attendance Log
                                </button>
                                <button onclick="switchSubTab('training', 'certs')" class="subnav-pill subnav-training"
                                    data-sub="certs">
                                    <i class="fas fa-certificate mr-1.5"></i> Licenses & Certs
                                </button>
                            </div>

                            <!-- Schedules -->
                            <div id="sub-training-schedules"
                                class="sub-panel sub-panel-training active space-y-3 text-xs">
                                <div class="card-clean p-5 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <span
                                            class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Upcoming
                                            Workshop</span>
                                        <h4 class="font-bold text-sm text-slate-900 mt-1">Sommelier Wine Pairing & Fine
                                            Dining Service</h4>
                                        <p class="text-slate-500">Aug 26 (14:00 - 16:30) · Main Dining Room · Trainer:
                                            <strong>Master Sommelier Pierre</strong>
                                        </p>
                                    </div>
                                    <button onclick="showToast('Registered for Session', 'success')"
                                        class="px-4 py-2 bg-primary text-white rounded-xl font-bold">Register
                                        Colleague</button>
                                </div>
                            </div>

                            <!-- Attendance -->
                            <div id="sub-training-attendance" class="sub-panel sub-panel-training space-y-4">
                                <div class="card-clean overflow-hidden">
                                    <table class="w-full text-left text-xs">
                                        <thead
                                            class="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                                            <tr>
                                                <th class="px-5 py-3">Employee</th>
                                                <th class="px-5 py-3">Training Session</th>
                                                <th class="px-5 py-3">Trainer</th>
                                                <th class="px-5 py-3">Attendance</th>
                                                <th class="px-5 py-3 text-right">Result</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-100">
                                            <tr class="hover:bg-slate-50 transition">
                                                <td class="px-5 py-3.5 font-bold text-slate-900">Maria Santos</td>
                                                <td class="px-5 py-3.5 text-slate-500">HACCP Food Safety Level 3</td>
                                                <td class="px-5 py-3.5 text-slate-500">Chef Marco</td>
                                                <td class="px-5 py-3.5"><span
                                                        class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Present
                                                        (100%)</span></td>
                                                <td class="px-5 py-3.5 text-right font-bold text-emerald-600">Certified
                                                </td>
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
                                            class="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                                            <tr>
                                                <th class="px-5 py-3">Certification</th>
                                                <th class="px-5 py-3">Authority</th>
                                                <th class="px-5 py-3">Expiry Date</th>
                                                <th class="px-5 py-3">Status</th>
                                                <th class="px-5 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="certs-table-body" class="divide-y divide-slate-100">
                                            <tr class="hover:bg-slate-50 transition">
                                                <td class="px-5 py-3.5 font-bold text-slate-900">HACCP Food Safety Level
                                                    3</td>
                                                <td class="px-5 py-3.5 text-slate-500">National Hospitality Board</td>
                                                <td class="px-5 py-3.5 text-slate-500">Jan 10, 2027</td>
                                                <td class="px-5 py-3.5"><span
                                                        class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Valid</span>
                                                </td>
                                                <td class="px-5 py-3.5 text-right"><button
                                                        onclick="showToast('Viewing Certificate...', 'info')"
                                                        class="text-primary font-bold">View PDF</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        <!-- ======================================================== -->
                        <!-- PILLAR 5: SUCCESSION PLANNING & 9-BOX TALENT GRID        -->
