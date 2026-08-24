<!-- ======================================================== -->
                        <div id="panel-pillar-comp" class="pillar-panel space-y-6">

                            <!-- Top Subnav Pills -->
                            <div
                                class="raindrop-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar">
                                <button onclick="switchSubTab('comp', 'radar')" class="subnav-pill subnav-comp active"
                                    data-sub="radar">
                                    <i class="fas fa-chart-radar mr-1.5"></i> Radar Profile
                                </button>
                                <button onclick="switchSubTab('comp', 'matrix')" class="subnav-pill subnav-comp"
                                    data-sub="matrix">
                                    <i class="fas fa-table-cells mr-1.5"></i> Team Matrix
                                </button>
                                <button onclick="switchSubTab('comp', 'gaps')" class="subnav-pill subnav-comp"
                                    data-sub="gaps">
                                    <i class="fas fa-chart-line-up mr-1.5"></i> Skills Gap Analysis
                                </button>
                                <button onclick="switchSubTab('comp', 'idp')" class="subnav-pill subnav-comp"
                                    data-sub="idp">
                                    <i class="fas fa-route mr-1.5"></i> 70-20-10 IDP Plan
                                </button>
                            </div>

                            <!-- Sub-tab 1: Radar Chart -->
                            <div id="sub-comp-radar" class="sub-panel sub-panel-comp active space-y-4">
                                <div class="card-clean p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                    <div
                                        class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col items-center">
                                        <div class="w-full flex justify-between items-center text-xs font-bold mb-2">
                                            <span class="text-slate-900">Competency Profile Radar</span>
                                            <span
                                                class="text-primary text-[10px] bg-primary/10 px-2 py-0.5 rounded-full">Target
                                                vs Evaluated</span>
                                        </div>
                                        <div class="h-60 w-full flex items-center justify-center">
                                            <canvas id="chart-competency-radar"></canvas>
                                        </div>
                                    </div>

                                    <div class="space-y-3 text-xs font-medium">
                                        <div>
                                            <div class="flex justify-between text-slate-800 font-bold mb-1">
                                                <span>Guest Relations & VIP Protocol</span>
                                                <span class="text-primary">4.8 / 5.0 (Advanced)</span>
                                            </div>
                                            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div class="bg-primary h-2 rounded-full" style="width: 96%"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="flex justify-between text-slate-800 font-bold mb-1">
                                                <span>Opera & PMS Reservation Systems</span>
                                                <span class="text-emerald-600">5.0 / 5.0 (Master)</span>
                                            </div>
                                            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div class="bg-emerald-500 h-2 rounded-full" style="width: 100%"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="flex justify-between text-slate-800 font-bold mb-1">
                                                <span>Frontline Conflict De-escalation</span>
                                                <span class="text-amber-600">3.5 / 5.0 (Developing)</span>
                                            </div>
                                            <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div class="bg-amber-500 h-2 rounded-full" style="width: 70%"></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- Sub-tab 2: Competency Matrix Table -->
                            <div id="sub-comp-matrix" class="sub-panel sub-panel-comp space-y-4">
                                <div class="card-clean overflow-hidden">
                                    <table class="w-full text-left text-xs">
                                        <thead
                                            class="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                                            <tr>
                                                <th class="px-5 py-3">Employee</th>
                                                <th class="px-5 py-3">Role</th>
                                                <th class="px-5 py-3 text-center">Guest Relations</th>
                                                <th class="px-5 py-3 text-center">PMS Systems</th>
                                                <th class="px-5 py-3 text-center">De-escalation</th>
                                                <th class="px-5 py-3 text-center">Overall</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-slate-100">
                                            <tr class="hover:bg-slate-50/70 transition">
                                                <td class="px-5 py-3.5 font-bold text-slate-900">Maria Santos</td>
                                                <td class="px-5 py-3.5 text-slate-500">Front Desk Host</td>
                                                <td class="px-5 py-3.5 text-center"><span
                                                        class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">4.8</span>
                                                </td>
                                                <td class="px-5 py-3.5 text-center"><span
                                                        class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">5.0</span>
                                                </td>
                                                <td class="px-5 py-3.5 text-center"><span
                                                        class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">3.5</span>
                                                </td>
                                                <td class="px-5 py-3.5 text-center font-bold text-primary">4.2</td>
                                            </tr>
                                            <tr class="hover:bg-slate-50/70 transition">
                                                <td class="px-5 py-3.5 font-bold text-slate-900">Carlos Gomez</td>
                                                <td class="px-5 py-3.5 text-slate-500">Concierge Lead</td>
                                                <td class="px-5 py-3.5 text-center"><span
                                                        class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">5.0</span>
                                                </td>
                                                <td class="px-5 py-3.5 text-center"><span
                                                        class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">4.6</span>
                                                </td>
                                                <td class="px-5 py-3.5 text-center"><span
                                                        class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">4.8</span>
                                                </td>
                                                <td class="px-5 py-3.5 text-center font-bold text-primary">4.6</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Sub-tab 3: Skills Gap -->
                            <div id="sub-comp-gaps" class="sub-panel sub-panel-comp space-y-4">
                                <div class="card-clean p-6 space-y-3">
                                    <h3 class="font-heading font-bold text-base text-slate-900">Identified Competency
                                        Gaps</h3>
                                    <div
                                        class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                                        <div class="flex justify-between items-center">
                                            <span class="font-bold text-slate-900">Frontline Conflict Management</span>
                                            <span
                                                class="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[11px]">Gap:
                                                -1.5</span>
                                        </div>
                                        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                                            <div class="bg-primary h-2" style="width: 70%"></div>
                                            <div class="bg-red-300 h-2 opacity-60" style="width: 30%"></div>
                                        </div>
                                        <div class="flex justify-between items-center pt-1 text-slate-600">
                                            <span>✦ Gemini Match: <strong>Hospitality Crisis Diplomacy
                                                    Module</strong></span>
                                            <button
                                                onclick="addGapToIDP('Frontline Conflict Management', 'Hospitality Crisis Diplomacy Module')"
                                                class="text-primary font-bold hover:underline">+ Add to IDP</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Sub-tab 4: IDP Plan -->
                            <div id="sub-comp-idp" class="sub-panel sub-panel-comp space-y-4">
                                <div class="card-clean p-6 space-y-4">
                                    <h3 class="font-heading font-bold text-base text-slate-900">Active Individual
                                        Development Goals (70-20-10)</h3>
                                    <div id="idp-tasks-container" class="space-y-3">
                                        <div
                                            class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                                            <div class="flex justify-between items-center">
                                                <span class="font-bold text-slate-900">Goal: Master Front Desk Shift
                                                    Escalations</span>
                                                <span class="text-primary font-bold">75% Complete</span>
                                            </div>
                                            <p class="text-slate-500">Mentor: Front Office Manager John Marco ·
                                                Check-ins on Thursdays</p>
                                            <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                <div class="bg-primary h-1.5 rounded-full" style="width: 75%"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- ======================================================== -->
                        <!-- PILLAR 3: LEARNING MANAGEMENT SYSTEM (LMS)               -->
