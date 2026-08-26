<!-- 1. Modal: Create Goal -->
<div id="modal-create-goal" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-2xl w-full overflow-hidden max-h-[92vh] flex flex-col">

        <!-- Header -->
        <div
            class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3.5">
                <div
                    class="w-11 h-11 rounded-full bg-primary-50 text-primary flex items-center justify-center text-lg shadow-2xs border border-primary-100">
                    <i class="fas fa-bullseye"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <span
                            class="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">Step
                            1 of 7 · Planning</span>
                        <span class="text-[10px] text-slate-400">2026 Q3 Cycle</span>
                    </div>
                    <h3 class="font-heading font-bold text-lg text-slate-900 mt-0.5">Set Performance Objective
                    </h3>
                </div>
            </div>
            <button onclick="closeModal('modal-create-goal')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition duration-200 hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Scrollable Body -->
        <div class="p-6 sm:p-7 overflow-y-auto custom-scrollbar space-y-5 bg-white flex-1">

            <!-- Quick Template Selector Card -->
            <div class="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div class="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span class="flex items-center space-x-1.5">
                        <i class="fas fa-sparkles text-primary"></i>
                        <span>1-Click Pre-filled Hotel Templates:</span>
                    </span>
                    <span class="text-[10px] text-slate-400 font-normal">Auto-fills all fields</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <button type="button" onclick="fillGoalTemplate('vip_nps')"
                        class="p-2 rounded-xl bg-white border border-slate-200 hover:border-primary hover:text-primary font-semibold transition text-left shadow-2xs hover:shadow-xs group">
                        <span class="text-xs mb-0.5 block group-hover:scale-105 transition">🌟</span>
                        <span
                            class="font-bold block text-slate-800 group-hover:text-primary text-[11px] truncate">VIP
                            NPS Lift</span>
                        <span class="text-[10px] text-slate-400 block truncate">Target: &ge; +92</span>
                    </button>
                    <button type="button" onclick="fillGoalTemplate('upsell_wine')"
                        class="p-2 rounded-xl bg-white border border-slate-200 hover:border-primary hover:text-primary font-semibold transition text-left shadow-2xs hover:shadow-xs group">
                        <span class="text-xs mb-0.5 block group-hover:scale-105 transition">🍷</span>
                        <span
                            class="font-bold block text-slate-800 group-hover:text-primary text-[11px] truncate">Wine
                            Pairing</span>
                        <span class="text-[10px] text-slate-400 block truncate">+18% Avg Check</span>
                    </button>
                    <button type="button" onclick="fillGoalTemplate('haccp_audit')"
                        class="p-2 rounded-xl bg-white border border-slate-200 hover:border-primary hover:text-primary font-semibold transition text-left shadow-2xs hover:shadow-xs group">
                        <span class="text-xs mb-0.5 block group-hover:scale-105 transition">🧼</span>
                        <span
                            class="font-bold block text-slate-800 group-hover:text-primary text-[11px] truncate">HACCP
                            Hygiene</span>
                        <span class="text-[10px] text-slate-400 block truncate">100% QA Score</span>
                    </button>
                    <button type="button" onclick="fillGoalTemplate('room_turnaround')"
                        class="p-2 rounded-xl bg-white border border-slate-200 hover:border-primary hover:text-primary font-semibold transition text-left shadow-2xs hover:shadow-xs group">
                        <span class="text-xs mb-0.5 block group-hover:scale-105 transition">🛏️</span>
                        <span
                            class="font-bold block text-slate-800 group-hover:text-primary text-[11px] truncate">Suite
                            Turnover</span>
                        <span class="text-[10px] text-slate-400 block truncate">&lt; 22m / suite</span>
                    </button>
                </div>
            </div>

            <form id="form-create-goal" onsubmit="handleGoalSubmit(event)" class="space-y-4 text-xs">

                <!-- HR Target Assignment Scope -->
                <div class="p-3 bg-purple-50/60 rounded-xl border border-purple-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label class="font-bold text-purple-950 text-[11px] flex items-center shrink-0">
                        <i class="fas fa-bullseye text-purple-600 mr-1.5"></i> Assign Goal To:
                    </label>
                    <select id="goal-target-scope" onchange="if(typeof handleGoalScopeChange === 'function') handleGoalScopeChange(this)"
                        class="w-full sm:w-auto flex-1 px-3 py-1.5 rounded-lg border border-purple-200 text-xs font-semibold text-purple-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="emp-101" data-scope="single" data-name="Maria Santos" data-dept="Front Office & Guest Experience" data-role="Associate">Maria Santos (Associate · Front Desk Host)</option>
                        <option value="emp-102" data-scope="single" data-name="Chef Marco Rossi" data-dept="Culinary & F&B" data-role="Supervisor">Chef Marco Rossi (Supervisor · Executive Sous Chef)</option>
                        <option value="emp-103" data-scope="single" data-name="Elena Vance" data-dept="Human Resources" data-role="HRAdmin">Elena Vance (HRAdmin · Director of People)</option>
                        <option value="emp-104" data-scope="single" data-name="Robert Sterling" data-dept="Executive Office" data-role="GeneralManager">Robert Sterling (GeneralManager · Managing Director)</option>
                        <option value="dept" data-scope="dept" data-name="Entire Front Office Department" data-dept="Front Office & Guest Experience" data-role="Associate">Entire Front Office Department (12 Staff)</option>
                        <option value="property" data-scope="property" data-name="Hotel-wide Benchmark" data-dept="Front Office & Guest Experience" data-role="Associate">Hotel-wide Benchmark (All 100 Staff)</option>
                    </select>
                </div>

                <!-- Objective Title -->
                <div class="space-y-1">
                    <label class="font-bold text-slate-800 text-[11px]">1. Goal / Objective *</label>
                    <input type="text" id="goal-title-input" required
                        placeholder="e.g., Elevate VIP Guest Check-in Experience & NPS Loyalty Index"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none font-medium bg-slate-50/50 hover:bg-white transition">
                </div>

                <!-- Department & Target Date -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">2. Department *</label>
                        <select id="goal-cat-input"
                            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium bg-slate-50/50">
                            <option>Front Office & Guest Experience</option>
                            <option>Food & Beverage Service</option>
                            <option>Culinary & Kitchen Brigade</option>
                            <option>Housekeeping & Facilities</option>
                            <option>Banquet & Event Operations</option>
                            <option>Leadership & Team Mentorship</option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">3. Target Date *</label>
                        <input type="date" id="goal-date-input" required value="2026-09-30"
                            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium bg-slate-50/50">
                    </div>
                </div>

                <!-- Simplified Target Metric (Replaces Confusing KPI Formula) -->
                <div class="space-y-1.5 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                    <div class="flex justify-between items-center">
                        <label class="font-bold text-slate-800 text-[11px] flex items-center space-x-1.5">
                            <i class="fas fa-chart-line text-primary"></i>
                            <span>4. Target / Success Metric *</span>
                        </label>
                        <span class="text-[10px] text-slate-400">Clear target result</span>
                    </div>
                    <input type="text" id="goal-kpi-input" required
                        placeholder="e.g., Score >= 92%, +18% Average Check, or Zero Defects"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none bg-white transition">

                    <div class="flex items-center space-x-1.5 pt-1 flex-wrap gap-y-1">
                        <span class="text-[10px] text-slate-400 font-medium">Quick Presets:</span>
                        <button type="button" onclick="setKPIValue('NPS >= +92 Score')"
                            class="text-[10px] bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-700 px-2.5 py-1 rounded-lg font-medium transition shadow-2xs">
                            ⭐ NPS &ge; +92
                        </button>
                        <button type="button" onclick="setKPIValue('+18% Beverage Rev/Cover')"
                            class="text-[10px] bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-700 px-2.5 py-1 rounded-lg font-medium transition shadow-2xs">
                            📈 +18% Avg Check
                        </button>
                        <button type="button" onclick="setKPIValue('100% Audit Score (Zero Violations)')"
                            class="text-[10px] bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-700 px-2.5 py-1 rounded-lg font-medium transition shadow-2xs">
                            ✅ 100% Audit Pass
                        </button>
                        <button type="button" onclick="setKPIValue('< 22 mins / suite turnover')"
                            class="text-[10px] bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-700 px-2.5 py-1 rounded-lg font-medium transition shadow-2xs">
                            ⏱️ &lt; 22m Turnover
                        </button>
                    </div>
                </div>

                <!-- Priority / Weighting & Optional Notes -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">5. Priority Weight</label>
                        <select id="goal-weight-input"
                            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium bg-slate-50/50">
                            <option>High Priority (35% Weight - Core Role Objective)</option>
                            <option selected>Medium Priority (20% Weight - Standard Operational Goal)</option>
                            <option>Developmental (15% Weight - Learning Goal)</option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">6. Evidence / Deliverables (Optional)</label>
                        <input type="text" id="goal-evidence-input"
                            placeholder="e.g., Monthly guest feedback reports, PMS logs"
                            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium bg-slate-50/50">
                    </div>
                </div>

                <!-- Gemini AI Alignment Box -->
                <div class="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-start space-x-3">
                    <div
                        class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0 shadow-2xs">
                        <i class="fas fa-sparkles text-[10px]"></i>
                    </div>
                    <div class="text-[11px] text-slate-800 leading-relaxed">
                        <span class="font-bold text-indigo-950">✦ Gemini Goal Copilot:</span>
                        <span id="gemini-goal-advice">This objective directly targets the <strong>Guest
                                Relations & VIP Protocol</strong> competency standard for the Senior Host
                            promotion track.</span>
                    </div>
                </div>
            </form>
        </div>

        <!-- Footer -->
        <div
            class="p-4 sm:px-7 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-400 font-medium hidden sm:inline"><i
                    class="fas fa-lock text-slate-300 mr-1"></i> Auto-saved draft</span>
            <div class="flex items-center space-x-2.5 ml-auto">
                <button type="button" onclick="closeModal('modal-create-goal')"
                    class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
                <button type="submit" form="form-create-goal" id="btn-submit-create-goal" onclick="handleGoalSubmit(event)"
                    class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5 cursor-pointer">
                    <span>Submit for Approval</span>
                    <i class="fas fa-arrow-right text-[10px]"></i>
                </button>
            </div>
        </div>

    </div>
</div>

<!-- Modal: View Goal Objectives & KPIs -->
<div id="modal-view-goal" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3.5">
                <div class="w-10 h-10 rounded-full bg-primary-50 text-primary flex items-center justify-center text-base font-bold border border-primary-100 shadow-2xs">
                    <i class="fas fa-bullseye"></i>
                </div>
                <div>
                    <span class="badge-primary">Objective Details</span>
                    <h3 id="view-modal-emp-name" class="font-heading font-bold text-base text-slate-900 mt-0.5">Associate Performance Plan</h3>
                    <p id="view-modal-emp-pos" class="text-[11px] text-slate-500 font-medium">Front Desk Host · Front Office</p>
                </div>
            </div>
            <button onclick="closeModal('modal-view-goal')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs bg-white flex-1">
            <div class="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-center">
                <div>
                    <span class="text-[10px] text-slate-400 block font-semibold">Attendance</span>
                    <span id="view-modal-attendance" class="font-bold text-slate-800 text-xs">96.5%</span>
                </div>
                <div>
                    <span class="text-[10px] text-slate-400 block font-semibold">Manager Rating</span>
                    <span id="view-modal-mgr-rating" class="font-bold text-slate-900 text-xs">⭐ 4.6</span>
                </div>
                <div>
                    <span class="text-[10px] text-slate-400 block font-semibold">Guest Sentiment</span>
                    <span id="view-modal-cust-rating" class="font-bold text-amber-600 text-xs">⭐ 4.8</span>
                </div>
            </div>

            <div class="space-y-2">
                <h4 class="font-bold text-slate-800 text-[11px]">Defined Target Objectives:</h4>
                <div id="view-modal-goals-list" class="space-y-3">
                    <!-- Dynamic Objective Cards -->
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
            <button onclick="closeModal('modal-view-goal')" class="btn-secondary px-4 py-2 text-xs font-semibold">Close</button>
        </div>
    </div>
</div>

<!-- Modal: Revise Performance Objective -->
<div id="modal-revise-goal" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3.5">
                <div class="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-base font-bold border border-amber-100 shadow-2xs">
                    <i class="fas fa-pen-to-square"></i>
                </div>
                <div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Calibration & Revision</span>
                    <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Revise Performance Objective</h3>
                    <p class="text-[11px] text-slate-500 font-medium">
                        <span id="revise-modal-emp-name">Maria Santos</span> &middot; <span id="revise-modal-emp-pos">Front Office</span>
                    </p>
                </div>
            </div>
            <button onclick="closeModal('modal-revise-goal')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar space-y-4 bg-white flex-1 text-xs">
            <form id="form-revise-goal" onsubmit="saveGoalRevision(event)" class="space-y-4">
                <input type="hidden" id="revise-goal-id">

                <!-- Title -->
                <div class="space-y-1">
                    <label class="font-bold text-slate-800 text-[11px]">1. Goal / Objective Title *</label>
                    <input type="text" id="revise-goal-title" required
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none font-medium bg-slate-50/50 hover:bg-white transition">
                </div>

                <!-- Department & Target Date -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">2. Department</label>
                        <select id="revise-goal-cat"
                            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium bg-slate-50/50">
                            <option>Front Office & Guest Experience</option>
                            <option>Food & Beverage Service</option>
                            <option>Culinary & Kitchen Brigade</option>
                            <option>Housekeeping & Facilities</option>
                            <option>Banquet & Event Operations</option>
                            <option>Leadership & Team Mentorship</option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">3. Target Date</label>
                        <input type="date" id="revise-goal-date"
                            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium bg-slate-50/50">
                    </div>
                </div>

                <!-- Target Metric -->
                <div class="space-y-1">
                    <label class="font-bold text-slate-800 text-[11px]">4. Target / Success Metric *</label>
                    <input type="text" id="revise-goal-kpi" required
                        placeholder="e.g., NPS >= +92 Score or Table reset < 3 mins"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none bg-white transition">
                </div>

                <!-- Priority Weight -->
                <div class="space-y-1">
                    <label class="font-bold text-slate-800 text-[11px]">5. Priority Weight</label>
                    <select id="revise-goal-weight"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium bg-slate-50/50">
                        <option>High Priority (35% Weight - Core Role Objective)</option>
                        <option selected>Medium Priority (20% Weight - Standard Operational Goal)</option>
                        <option>Developmental (15% Weight - Learning Goal)</option>
                    </select>
                </div>

                <!-- Deliverables / Evidence -->
                <div class="space-y-1">
                    <label class="font-bold text-slate-800 text-[11px]">6. Evidence & Verification Deliverables</label>
                    <input type="text" id="revise-goal-deliverables"
                        placeholder="e.g., Medallia guest satisfaction monthly reports, PMS shift logs"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium bg-slate-50/50">
                </div>

                <!-- Supervisor Coaching & Calibration Notes -->
                <div id="container-revise-goal-notes" class="space-y-1">
                    <div class="flex items-center justify-between">
                        <label id="label-revise-goal-notes" class="font-bold text-slate-800 text-[11px]">7. Calibration &amp; Coaching Notes (Optional)</label>
                        <span id="badge-revise-notes-auth" class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Supervisor Notes</span>
                    </div>
                    <textarea id="revise-goal-notes" rows="2"
                        placeholder="Add revision rationale, supervisor coaching notes, or check-in instructions..."
                        class="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-slate-50/50"></textarea>
                </div>
            </form>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end space-x-2.5 flex-shrink-0">
            <button type="button" onclick="closeModal('modal-revise-goal')"
                class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
            <button type="submit" form="form-revise-goal" id="btn-save-goal-revision" onclick="saveGoalRevision(event)"
                class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs">
                <span>Save &amp; Update Objective</span>
                <i class="fas fa-check text-[10px]"></i>
            </button>
        </div>
    </div>
</div>

<!-- 2. Modal: Manager Goal Review & Approval -->
<div id="modal-approve-goal" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-lg w-full overflow-hidden flex flex-col">

        <div
            class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div
                    class="w-11 h-11 rounded-full bg-gold-50 text-gold-dark flex items-center justify-center text-base font-bold border border-gold-100">
                    <i class="fas fa-signature"></i>
                </div>
                <div>
                    <span class="badge-gold">Step 2 · Calibration</span>
                    <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Endorse Objective &amp; KPIs</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-approve-goal')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <div class="p-6 space-y-4 text-xs bg-white">
            <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-1.5">
                <div class="flex justify-between font-bold text-slate-900 text-sm">
                    <span id="review-goal-title">VIP Guest Check-in Experience &amp; NPS Lift</span>
                    <span class="badge-primary">Q3 Priority</span>
                </div>
                <p class="text-slate-600">KPI Target: <strong>Net Promoter Score (NPS) &ge; +92 Score</strong>
                </p>
                <p class="text-slate-400 text-[11px]">Submitted by: Maria Santos (Front Office) · Due: Sep 30, 2026</p>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-800 mb-1">Supervisor Coaching Notes &amp; Check-in Intervals</label>
                <textarea id="supervisor-feedback-notes" rows="3"
                    class="w-full p-3 rounded-xl border border-[#E8DEDC] text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-[#FAF8F7]"
                    placeholder="Add specific coaching notes, check-in intervals or calibration adjustments for this goal..."></textarea>
            </div>
        </div>

        <div
            class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end space-x-2.5">
            <button onclick="requestGoalRevision()"
                class="btn-secondary px-4 py-2 text-xs font-semibold">Request Revision</button>
            <button onclick="approveGoalOfficial()"
                class="btn-primary px-5 py-2 text-xs font-bold">Approve Goal</button>
        </div>
    </div>
</div>

<!-- 3. Modal: Gemini AI Coaching Refiner -->
<div id="modal-ai-feedback" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-lg w-full overflow-hidden flex flex-col">

        <div
            class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div
                    class="w-11 h-11 rounded-full bg-dusty-50 text-dusty-dark flex items-center justify-center text-lg font-bold border border-dusty-100">
                    <i class="fas fa-robot"></i>
                </div>
                <div>
                    <span class="badge-dusty">AI Copilot</span>
                    <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">SBI Feedback Refiner</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-ai-feedback')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <div class="p-6 space-y-4 text-xs bg-white">
            <!-- 1-Click Observation Chips -->
            <div class="p-3 bg-dusty-50/60 rounded-2xl border border-dusty-100 text-xs">
                <p class="text-[11px] font-bold text-dusty-dark mb-1.5">Try a quick shift observation scenario:
                </p>
                <div class="flex flex-wrap gap-1.5">
                    <button type="button"
                        onclick="setRoughNote('Peak dinner rush was hectic. Maria calmed down an angry VIP guest whose suite was delayed, but junior hosts were standing idle.')"
                        class="px-3 py-1 rounded-full bg-white border border-dusty-100 text-dusty-dark text-[10px] font-semibold hover:bg-slate-100 transition shadow-2xs">
                        ⚡ Rush Hour Composure
                    </button>
                    <button type="button"
                        onclick="setRoughNote('Pierre recommended the reserve vintage to presidential suites and exceeded beverage targets by 20% tonight.')"
                        class="px-3 py-1 rounded-full bg-white border border-dusty-100 text-dusty-dark text-[10px] font-semibold hover:bg-slate-100 transition shadow-2xs">
                        🍷 Sommelier Upsell Win
                    </button>
                </div>
            </div>

            <div class="space-y-2.5">
                <label class="block font-bold text-slate-800 text-[11px]">Rough Observation / Floor Notes</label>
                <textarea id="ai-rough-notes" rows="3"
                    class="w-full p-3 rounded-xl border border-[#E8DEDC] focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-[#FAF8F7]"
                    placeholder="Type or click an observation scenario above..."></textarea>

                <button onclick="generateAIFeedback()"
                    class="w-full py-2.5 btn-primary text-xs font-bold flex items-center justify-center space-x-2">
                    <i class="fas fa-wand-magic-sparkles"></i>
                    <span>Generate Structured SBI Coaching Model</span>
                </button>
            </div>

            <!-- Structured Output Box -->
            <div id="ai-output-box"
                class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] text-slate-700 space-y-2 hidden">
                <div class="font-semibold text-primary flex items-center justify-between text-xs">
                    <span>✦ Refined Coaching Feedback</span>
                    <span class="badge-sage">SBI Model</span>
                </div>
                <p class="leading-relaxed text-slate-800 text-xs" id="ai-generated-text">"Maria, during the evening rush (Situation), your calm de-escalation with the VIP guest protected satisfaction (Behavior). Moving forward, delegating table resets to junior attendants will enable faster seating turns (Impact)."</p>
                <div class="flex justify-end pt-2 border-t border-[#E8DEDC]">
                    <button onclick="copyAndApplyFeedback()"
                        class="btn-primary px-4 py-1.5 text-xs font-bold">Post to Feedback Wall</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 4. Modal: Performance Evaluation (Step 4 & 5) -->
<div id="modal-self-assessment" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">

        <div
            class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div
                    class="w-11 h-11 rounded-full bg-sage-50 text-sage-dark flex items-center justify-center text-lg font-bold border border-sage-100">
                    <i class="fas fa-star-half-stroke"></i>
                </div>
                <div>
                    <span class="badge-sage">Steps 4 &amp; 5 · Formal Evaluation</span>
                    <h3 class="font-heading font-bold text-lg text-slate-900 mt-0.5">2026 Q3 Appraisal Review
                    </h3>
                </div>
            </div>
            <button onclick="closeModal('modal-self-assessment')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <div class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs bg-white">
            <!-- 1-5 Scale Guide -->
            <div class="p-3 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] text-[10px] text-slate-600">
                <p class="font-bold text-slate-800 text-[11px] mb-1">1-5 Rating Scale Guide:</p>
                <div class="grid grid-cols-5 gap-1 text-center font-medium">
                    <span class="p-1 rounded bg-terracotta-50 text-terracotta-dark">1: Below</span>
                    <span class="p-1 rounded bg-gold-50 text-gold-dark">2: Developing</span>
                    <span class="p-1 rounded bg-dusty-50 text-dusty-dark">3: Proficient</span>
                    <span class="p-1 rounded bg-sage-50 text-sage-dark font-bold">4: Advanced</span>
                    <span class="p-1 rounded bg-primary-50 text-primary font-bold">5: Master</span>
                </div>
            </div>

            <div class="space-y-4">
                <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2">
                    <div class="flex justify-between items-center font-semibold">
                        <span>1. Guest Satisfaction &amp; 5-Star Protocols (Weight: 40%)</span>
                        <span class="text-primary font-bold">4.8 / 5.0 (Advanced)</span>
                    </div>
                    <input type="range" min="1" max="5" step="0.1" value="4.8" class="w-full accent-[#9E1B20]">
                    <textarea rows="2"
                        placeholder="Provide achievements, guest commendations, and rationale for this rating..."
                        class="w-full p-2.5 bg-white rounded-xl border border-[#E8DEDC] text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar"></textarea>
                </div>

                <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2">
                    <div class="flex justify-between items-center font-semibold">
                        <span>2. PMS Reservation Speed &amp; Coordination (Weight: 30%)</span>
                        <span class="text-primary font-bold">4.5 / 5.0 (Advanced)</span>
                    </div>
                    <input type="range" min="1" max="5" step="0.1" value="4.5" class="w-full accent-[#9E1B20]">
                    <textarea rows="2"
                        placeholder="Detail PMS efficiency metrics, check-in speeds, and shift coordination notes..."
                        class="w-full p-2.5 bg-white rounded-xl border border-[#E8DEDC] text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar"></textarea>
                </div>

                <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2">
                    <div class="flex justify-between items-center font-semibold">
                        <span>3. Conflict De-escalation &amp; Mentorship (Weight: 30%)</span>
                        <span class="text-primary font-bold">3.8 / 5.0 (Developing)</span>
                    </div>
                    <input type="range" min="1" max="5" step="0.1" value="3.8" class="w-full accent-[#9E1B20]">
                    <textarea rows="2"
                        placeholder="List guest resolution examples, mentorship moments, or areas where coaching is requested..."
                        class="w-full p-2.5 bg-white rounded-xl border border-[#E8DEDC] text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar"></textarea>
                </div>
            </div>
        </div>

        <div
            class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex justify-end space-x-2.5 flex-shrink-0">
            <button onclick="closeModal('modal-self-assessment')"
                class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
            <button onclick="submitSelfAssessment()"
                class="btn-primary px-5 py-2 text-xs font-bold">Submit Evaluation</button>
        </div>
    </div>
</div>

<!-- 5. Modal: Social Recognition & Kudos (Multi-Select Roster with Search, Filters & Perf Averages) -->
<div id="modal-recognition" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div
        class="modal-card max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100">

        <!-- Header -->
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div
                    class="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold border border-amber-200/80 shadow-2xs">
                    <i class="fas fa-trophy text-amber-600"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h3 class="font-heading font-bold text-base text-slate-900">Send Colleague Kudos</h3>
                        <span
                            class="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">+50
                            XP / Person</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">Select one or multiple colleagues to celebrate
                        accomplishments</p>
                </div>
            </div>
            <button onclick="closeModal('modal-recognition')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs bg-white">

            <!-- Search & Filter Controls -->
            <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                    <label class="block font-bold text-slate-800 text-[11px]">Select Recipients (<span
                            id="kudos-selected-count" class="text-amber-600 font-extrabold">0</span>
                        selected)</label>
                    <div class="flex items-center space-x-2">
                        <button type="button" onclick="toggleSelectAllKudos(true)"
                            class="text-[11px] font-bold text-primary hover:underline">Select All</button>
                        <span class="text-slate-300">|</span>
                        <button type="button" onclick="toggleSelectAllKudos(false)"
                            class="text-[11px] font-bold text-slate-500 hover:text-slate-700">Clear</button>
                    </div>
                </div>

                <!-- Search Bar -->
                <div class="relative">
                    <i
                        class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                    <input id="kudos-search-input" oninput="filterKudosList()" type="text"
                        placeholder="Search employee name, title, or department..."
                        class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-none transition">
                </div>

                <!-- Department Filter Pills -->
                <div class="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar pb-1 text-[11px]">
                    <button type="button" onclick="setKudosDeptFilter('all')" data-dept="all"
                        class="kudos-dept-pill active px-3 py-1 rounded-full font-bold bg-amber-500 text-white shadow-2xs transition">All
                        Depts</button>
                    <button type="button" onclick="setKudosDeptFilter('front_office')" data-dept="front_office"
                        class="kudos-dept-pill px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Front
                        Office</button>
                    <button type="button" onclick="setKudosDeptFilter('fb_service')" data-dept="fb_service"
                        class="kudos-dept-pill px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">F&B
                        Service</button>
                    <button type="button" onclick="setKudosDeptFilter('culinary')" data-dept="culinary"
                        class="kudos-dept-pill px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Culinary</button>
                    <button type="button" onclick="setKudosDeptFilter('housekeeping')" data-dept="housekeeping"
                        class="kudos-dept-pill px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Housekeeping</button>
                    <button type="button" onclick="setKudosDeptFilter('banquet')" data-dept="banquet"
                        class="kudos-dept-pill px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Banquets</button>
                </div>
            </div>

            <!-- Scrollable Employee Multi-Select Roster -->
            <div id="kudos-employee-roster"
                class="max-h-52 overflow-y-auto custom-scrollbar space-y-1.5 pr-1 border border-slate-200/70 rounded-2xl p-2 bg-slate-50/50">
                <!-- Dynamic rendered list -->
            </div>

            <!-- Kudos Core Values / Category -->
            <div>
                <label class="block font-bold text-slate-800 text-[11px] mb-1.5">Recognition Category</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <label
                        class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-white hover:border-amber-400 cursor-pointer transition">
                        <input type="radio" name="kudos_category" value="Guest Delight" checked
                            class="accent-amber-600">
                        <span class="text-[11px] font-semibold text-slate-700">🌟 Guest Delight</span>
                    </label>
                    <label
                        class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-white hover:border-amber-400 cursor-pointer transition">
                        <input type="radio" name="kudos_category" value="Team Player" class="accent-amber-600">
                        <span class="text-[11px] font-semibold text-slate-700">🤝 Team Player</span>
                    </label>
                    <label
                        class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-white hover:border-amber-400 cursor-pointer transition">
                        <input type="radio" name="kudos_category" value="Excellence" class="accent-amber-600">
                        <span class="text-[11px] font-semibold text-slate-700">⚡ Excellence</span>
                    </label>
                    <label
                        class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-white hover:border-amber-400 cursor-pointer transition">
                        <input type="radio" name="kudos_category" value="Leadership" class="accent-amber-600">
                        <span class="text-[11px] font-semibold text-slate-700">👑 Leadership</span>
                    </label>
                </div>
            </div>

            <!-- Kudos Message -->
            <div>
                <label class="block font-bold text-slate-800 text-[11px] mb-1">Kudos Message / Reason</label>
                <textarea id="shoutout-message" rows="2"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:outline-none custom-scrollbar bg-slate-50/50 text-xs font-medium"
                    placeholder="e.g., Outstanding teamwork and calm composure during the peak dinner rush!"></textarea>
            </div>
        </div>

        <!-- Footer -->
        <div
            class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <span id="kudos-awarded-preview"
                class="badge-gold">+0 XP Total</span>
            <div class="flex items-center space-x-2.5">
                <button onclick="closeModal('modal-recognition')"
                    class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
                <button onclick="dispatchRecognition()"
                    class="btn-primary px-5 py-2 text-xs font-bold">
                    <span id="kudos-submit-label">Send Kudos &amp; Award XP</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- 6. Modal: Shift Sentiment Pulse -->
<div id="modal-sentiment-pulse" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-md w-full overflow-hidden flex flex-col">

        <div
            class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div
                    class="w-11 h-11 rounded-full bg-sage-50 text-sage-dark flex items-center justify-center text-lg font-bold border border-sage-100">
                    <i class="fas fa-heart-pulse"></i>
                </div>
                <div>
                    <span class="badge-sage">Anonymous Pulse</span>
                    <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Shift Climate Check</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-sentiment-pulse')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <div class="p-6 space-y-4 bg-white">
            <p class="text-xs text-slate-600">How did your shift go today at Front Office?</p>

            <div class="grid grid-cols-3 gap-3 text-center">
                <button onclick="submitSentimentRating('Positive')"
                    class="p-4 rounded-2xl border border-[#E8DEDC] hover:border-sage-dark hover:bg-sage-50/50 transition flex flex-col items-center group shadow-2xs">
                    <span class="text-3xl mb-1.5 group-hover:scale-110 transition">😊</span>
                    <span class="text-xs font-bold text-sage-dark">Smooth</span>
                    <span class="text-[10px] text-slate-400">Great flow</span>
                </button>
                <button onclick="submitSentimentRating('Neutral')"
                    class="p-4 rounded-2xl border border-[#E8DEDC] hover:border-gold-dark hover:bg-gold-50/50 transition flex flex-col items-center group shadow-2xs">
                    <span class="text-3xl mb-1.5 group-hover:scale-110 transition">😐</span>
                    <span class="text-xs font-bold text-gold-dark">Manageable</span>
                    <span class="text-[10px] text-slate-400">Busy shift</span>
                </button>
                <button onclick="submitSentimentRating('Stressful')"
                    class="p-4 rounded-2xl border border-[#E8DEDC] hover:border-terracotta-dark hover:bg-terracotta-50/50 transition flex flex-col items-center group shadow-2xs">
                    <span class="text-3xl mb-1.5 group-hover:scale-110 transition">😓</span>
                    <span class="text-xs font-bold text-terracotta-dark">Friction</span>
                    <span class="text-[10px] text-slate-400">High stress</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- 7. Modal: Interactive LMS Quiz -->
<div id="modal-lms-quiz" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-lg w-full overflow-hidden flex flex-col">

        <div
            class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div
                    class="w-11 h-11 rounded-full bg-sage-50 text-sage-dark flex items-center justify-center text-lg font-bold border border-sage-100">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div>
                    <span class="badge-sage">Knowledge Check · +100 XP</span>
                    <h3 id="quiz-modal-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">Hospitality Standard Quiz</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-lms-quiz')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <div class="p-6 space-y-4 text-xs bg-white">
            <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-3">
                <div class="flex justify-between items-center font-bold text-slate-700 text-xs">
                    <span>Question 1 of 3</span>
                    <span class="text-primary font-bold">Single Choice</span>
                </div>
                <p class="text-slate-800 font-semibold text-xs leading-relaxed">When a VIP guest arrives with an unconfirmed suite upgrade request during peak check-in, what is the approved FIRST step according to Oxford Suites, Makati service standards?</p>

                <div class="space-y-2 pt-1">
                    <label
                        class="flex items-center space-x-3 p-3 rounded-xl border border-[#E8DEDC] bg-white hover:bg-primary-50/30 hover:border-primary/40 cursor-pointer transition">
                        <input type="radio" name="quiz_opt" checked class="accent-[#9E1B20]">
                        <span class="text-slate-700 font-medium">Warmly offer welcome beverage, verify PMS room availability, and discreetly notify Front Office Manager.</span>
                    </label>
                    <label
                        class="flex items-center space-x-3 p-3 rounded-xl border border-[#E8DEDC] bg-white hover:bg-primary-50/30 hover:border-primary/40 cursor-pointer transition">
                        <input type="radio" name="quiz_opt" class="accent-[#9E1B20]">
                        <span class="text-slate-700 font-medium">Immediately inform the guest that upgrades are not possible without written approval.</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex justify-between items-center">
            <span class="text-[11px] text-slate-500 font-semibold"><i
                    class="fas fa-trophy text-gold-dark mr-1"></i> Pass: 80% (+100 XP)</span>
            <div class="space-x-2">
                <button onclick="closeModal('modal-lms-quiz')"
                    class="btn-secondary px-3.5 py-2 text-xs font-semibold">Cancel</button>
                <button onclick="submitQuizSuccess()"
                    class="btn-primary px-5 py-2 text-xs font-bold">Submit Answers</button>
            </div>
        </div>
    </div>
</div>

<!-- 7b. Modal: Upload Training Documents & SOP Manuals -->
<div id="modal-lms-upload" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100">

        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-2xl bg-sage-50 text-sage-dark flex items-center justify-center text-lg font-bold border border-sage-100 shadow-2xs">
                    <i class="fas fa-file-arrow-up"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h3 class="font-heading font-bold text-base text-slate-900">Upload Training Document / SOP</h3>
                        <span class="badge-sage">LMS Library</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">Publish PDF handbooks, SOP guides, or video modules to associate book shelf</p>
                </div>
            </div>
            <button onclick="closeModal('modal-lms-upload')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Form Content -->
        <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs bg-white">
            <!-- File Drag & Drop Zone -->
            <div id="lms-dropzone" onclick="document.getElementById('lms-file-input').click()"
                class="border-2 border-dashed border-sage-light hover:border-sage-dark bg-sage-50/30 hover:bg-sage-50/60 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition group">
                <div class="w-12 h-12 rounded-full bg-sage-100 text-sage-dark flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition shadow-2xs">
                    <i class="fas fa-cloud-arrow-up"></i>
                </div>
                <p class="font-bold text-slate-900 text-xs">Drag & drop document or <span class="text-primary font-bold underline">browse files</span></p>
                <p class="text-[10px] text-slate-400 mt-1">Supports PDF, DOCX, PPTX, MP4, and SCORM packages (Max 50MB)</p>
                <p id="lms-file-chosen" class="text-xs font-bold text-sage-dark mt-2 hidden"><i class="fas fa-check-circle mr-1"></i> <span id="lms-file-chosen-name">file.pdf</span></p>
                <input type="file" id="lms-file-input" onchange="handleLmsFileSelect(this)" class="hidden" accept=".pdf,.docx,.doc,.pptx,.mp4,.zip">
            </div>

            <!-- Metadata Fields -->
            <div class="space-y-3">
                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">Document / Book Title</label>
                    <input id="lms-doc-title" type="text" placeholder="e.g., Executive Suite Turndown & Linen Standard Handbook"
                        class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-800 text-[11px] mb-1">Target Department</label>
                        <select id="lms-doc-dept" class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none">
                            <option value="front_office">Front Office</option>
                            <option value="culinary">Kitchen & Culinary</option>
                            <option value="fb_service">Food & Beverage</option>
                            <option value="housekeeping">Housekeeping & Laundry</option>
                            <option value="banquet">Banquets & Events</option>
                            <option value="all">Property-Wide (All Associates)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-800 text-[11px] mb-1">Document Category</label>
                        <select id="lms-doc-category" class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none">
                            <option value="SOP Manual">SOP Handbook / Manual</option>
                            <option value="Compliance Standard">Compliance & Hygiene</option>
                            <option value="Masterclass Guide">Masterclass Compendium</option>
                            <option value="Safety Protocol">Safety & Emergency Protocol</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-800 text-[11px] mb-1">Estimated Reading / Pages</label>
                        <input id="lms-doc-pages" type="text" placeholder="e.g., 20 Pages · 4 Chapters"
                            class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-800 text-[11px] mb-1">Associate Quiz Reward</label>
                        <input id="lms-doc-xp" type="text" readonly value="+100 XP (On Quiz Completion)"
                            class="w-full p-2.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold cursor-not-allowed">
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">Short Description / Learning Outcomes</label>
                    <textarea id="lms-doc-desc" rows="2" placeholder="Describe essential procedures, compliance benchmarks, and key check points..."
                        class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar"></textarea>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-500 font-semibold"><i class="fas fa-shield-halved text-sage-dark mr-1"></i> Official Training Documentation Publishing</span>
            <div class="flex items-center space-x-2">
                <button onclick="closeModal('modal-lms-upload')"
                    class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
                <button onclick="submitLmsDocUpload()"
                    class="btn-primary px-5 py-2 text-xs font-bold">
                    <i class="fas fa-upload mr-1.5"></i> Publish Document
                </button>
            </div>
        </div>
    </div>
</div>

<!-- 7c. Modal: Interactive 3D Book & SOP Document Reader -->
<div id="modal-book-reader" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-[#FAF8F7] rounded-3xl shadow-2xl border border-[#E8DEDC]">

        <!-- Header -->
        <div class="px-6 py-4 border-b border-[#E8DEDC] flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div id="reader-book-icon-badge" class="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center text-lg font-bold">
                    <i class="fas fa-book-open"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h3 id="reader-book-title" class="font-heading font-bold text-base text-slate-900">Hospitality Standard SOP Codex</h3>
                        <span id="reader-book-xp-badge" class="badge-gold">+100 XP Completion</span>
                    </div>
                    <p id="reader-book-author" class="text-xs text-slate-500">Oxford Suites, Makati Operations Manual · Standard Edition 2026</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="showToast('Downloading PDF Document...', 'info')" class="btn-secondary px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                    <i class="fas fa-file-pdf text-primary text-xs"></i>
                    <span class="hidden sm:inline">Download PDF</span>
                </button>
                <button onclick="closeModal('modal-book-reader')"
                    class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        </div>

        <!-- Book Reading Body (Dual-Page Open Book Aesthetic) -->
        <div class="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#FAF8F7]">
            <div class="bg-white rounded-2xl border border-[#E8DEDC] p-6 sm:p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                    <!-- Left Page: Table of Contents & Chapter Overview -->
                    <div class="space-y-4 md:border-r md:border-[#E8DEDC] md:pr-6">
                        <div class="border-b border-slate-100 pb-3">
                            <span class="text-[10px] font-bold text-gold-dark uppercase tracking-widest">CHAPTER OVERVIEW</span>
                            <h4 id="reader-chapter-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">Chapter 1: Standard Operating Principles</h4>
                        </div>
                        <div id="reader-toc" class="space-y-2 text-slate-600">
                            <!-- Dynamic chapters -->
                        </div>
                        <div class="p-3 bg-gold-50/60 rounded-xl border border-gold-100 space-y-1">
                            <p class="font-bold text-gold-dark text-[11px]"><i class="fas fa-lightbulb text-gold-dark mr-1"></i> Quality Standard Tip</p>
                            <p id="reader-tip-text" class="text-[11px] text-slate-700 leading-relaxed">Always maintain eye contact and warm smile within 10 feet of approaching guests.</p>
                        </div>
                    </div>

                    <!-- Right Page: Step-by-Step Procedure Content -->
                    <div class="space-y-4">
                        <div class="border-b border-slate-100 pb-3 flex justify-between items-center">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PROCEDURE SPECIFICATION</span>
                            <span class="badge-sage">SOP Approved</span>
                        </div>
                        <div id="reader-page-content" class="space-y-3 text-slate-700 leading-relaxed">
                            <!-- Dynamic page content -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Reader Controls -->
        <div class="p-4 sm:px-6 border-t border-[#E8DEDC] bg-white flex items-center justify-between flex-shrink-0 text-xs">
            <span class="text-slate-500 font-semibold hidden sm:inline"><i class="fas fa-book-bookmark text-gold-dark mr-1.5"></i> Interactive Digital Handbook Reader</span>
            <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button onclick="closeModal('modal-book-reader')"
                    class="btn-secondary px-4 py-2 text-xs font-semibold">Close Reader</button>
                <button id="reader-quiz-btn" onclick="launchQuizFromReader()"
                    class="btn-primary px-5 py-2 font-bold flex items-center space-x-1.5">
                    <i class="fas fa-graduation-cap"></i>
                    <span>Take Knowledge Quiz (+100 XP)</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- 7d. Modal: Prescribe Remedial LMS Books (< 3.0 Performance Rating) -->
<div id="modal-remedial-books" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100">

        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-2xl bg-terracotta-50 text-terracotta-dark flex items-center justify-center text-lg font-bold border border-terracotta-100 shadow-2xs">
                    <i class="fas fa-book-medical"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h3 class="font-heading font-bold text-base text-slate-900">Targeted LMS Handbooks (&lt; 3.0 Remedial)</h3>
                        <span class="badge-terracotta">Gap Resolution</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">Assign specialized LMS books to close competency gaps rated below the 3.0 benchmark</p>
                </div>
            </div>
            <button onclick="closeModal('modal-remedial-books')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs bg-white">
            <!-- Associate Target Selector & Gap Alert -->
            <div class="p-4 bg-terracotta-50/60 rounded-2xl border border-terracotta-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                    <span class="text-[10px] font-bold text-terracotta-dark uppercase tracking-wide flex items-center"><i class="fas fa-triangle-exclamation text-terracotta mr-1.5"></i> Associate with &lt; 3.0 Gaps</span>
                    <p id="remedial-associate-name" class="font-bold text-slate-900 text-xs">Lucas Vargas · Junior Host (Front Office)</p>
                    <p id="remedial-associate-detail" class="text-slate-600 text-[11px]">Evaluated Rating: <strong class="text-terracotta-dark font-bold">2.80 / 5.0</strong> · Sommelier Wine (<strong class="text-terracotta-dark font-bold">2.40</strong>) &amp; Conflict De-escalation (<strong class="text-terracotta-dark font-bold">2.60</strong>)</p>
                </div>
                <select id="remedial-associate-select" onchange="updateRemedialAssociate(this.value)"
                    class="p-2 bg-white border border-[#E8DEDC] rounded-xl text-xs font-bold text-slate-800 focus:outline-none shadow-2xs">
                    <option value="lucas">Lucas Vargas (Rating: 2.80)</option>
                    <option value="antonio">Antonio Silva (Rating: 2.90)</option>
                    <option value="maria">Maria Santos (Gap: Wine 2.40)</option>
                    <option value="chloe">Chloe Dupont (Rating: 2.95)</option>
                </select>
            </div>

            <!-- List of All Available LMS Books with 1-Click Assignment -->
            <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                    <h4 class="font-heading font-bold text-slate-900 text-xs uppercase tracking-wider">Available LMS Standard Operating Books</h4>
                    <span class="text-[11px] text-slate-400">Click to prescribe to 70-20-10 IDP</span>
                </div>

                <div id="remedial-books-list" class="space-y-2.5">
                    <!-- Dynamic Book list -->
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-500 font-semibold"><i class="fas fa-circle-info text-primary mr-1"></i> Prescriptions auto-sync with employee TNA &amp; IDP</span>
            <button onclick="closeModal('modal-remedial-books')"
                class="btn-primary px-5 py-2 text-xs font-bold">
                Done
            </button>
        </div>
    </div>
</div>

<!-- 7e. Modal: Associate Knowledge & Quiz Re-evaluation -->
<div id="modal-re-evaluate" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100">

        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-2xl bg-dusty-50 text-dusty-dark flex items-center justify-center text-lg font-bold border border-dusty-100 shadow-2xs">
                    <i class="fas fa-rotate-right"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h3 class="font-heading font-bold text-base text-slate-900">Associate Re-evaluation</h3>
                        <span class="badge-dusty">TNA Audit</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">Re-assess quiz knowledge score &amp; competency rating after book review</p>
                </div>
            </div>
            <button onclick="closeModal('modal-re-evaluate')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Form Body -->
        <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs bg-white">
            <div class="p-3.5 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-1">
                <p class="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Enrolled Associate &amp; Book</p>
                <p id="reeval-employee-name" class="text-sm font-bold text-slate-900">Lucas Vargas (Junior Host · Front Office)</p>
                <p id="reeval-book-title" class="text-xs font-semibold text-primary">Front Desk Standards &amp; VIP Protocols Codex</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">Previous Quiz Points</label>
                    <input id="reeval-prev-score" type="text" readonly value="55 / 100 pts (55%)"
                        class="w-full p-2.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl text-xs font-bold cursor-not-allowed">
                </div>
                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">New Re-quiz Score (pts)</label>
                    <input id="reeval-new-score" type="number" min="0" max="100" value="90"
                        class="w-full p-2.5 bg-[#FAF8F7] border border-sage-dark text-sage-dark rounded-xl text-xs font-extrabold focus:ring-2 focus:ring-sage-dark focus:outline-none">
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">Calibrated Competency Score</label>
                    <select id="reeval-new-rating" class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none">
                        <option value="4.5">4.5 / 5.0 (Exceeds Expectations)</option>
                        <option value="4.0" selected>4.0 / 5.0 (Proficient Standard)</option>
                        <option value="3.5">3.5 / 5.0 (Developing)</option>
                        <option value="2.8">2.8 / 5.0 (Remedial Ongoing)</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">Certification Status</label>
                    <select id="reeval-status" class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none">
                        <option value="Certified" selected>✅ Passed &amp; Certified</option>
                        <option value="Retake Required">⚠️ Retake Required</option>
                        <option value="In Progress">⏳ In Progress</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block font-bold text-slate-800 text-[11px] mb-1">Supervisor Re-evaluation Observation Notes</label>
                <textarea id="reeval-notes" rows="2" placeholder="Associate demonstrated marked improvement in VIP greeting and check-in speed under 2 minutes..."
                    class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar">Demonstrated 100% adherence to standard operating procedures during the practical post-study evaluation. All gap points resolved.</textarea>
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-500 font-semibold"><i class="fas fa-award text-sage-dark mr-1"></i> Auto-updates TNA &amp; Competency Matrix</span>
            <div class="flex items-center space-x-2">
                <button onclick="closeModal('modal-re-evaluate')"
                    class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
                <button onclick="submitAssociateReevaluation()"
                    class="btn-primary px-5 py-2 text-xs font-bold">
                    <i class="fas fa-check-circle mr-1.5"></i> Save Re-evaluation
                </button>
            </div>
        </div>
    </div>
</div>

<!-- 8. Modal: Role & Permissions Matrix (Host vs Supervisor vs HR vs Exec) -->
<div id="modal-role-matrix" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-3xl w-full overflow-hidden max-h-[92vh] flex flex-col">

        <div
            class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div
                    class="w-11 h-11 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center text-lg font-bold border border-slate-200">
                    <i class="fas fa-users-gear"></i>
                </div>
                <div>
                    <span class="badge-primary">Role-Based Access Control (RBAC)</span>
                    <h3 class="font-heading font-bold text-lg text-slate-900 mt-0.5">Hospitality Role Responsibilities &amp; Permissions</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-role-matrix')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <div class="p-6 overflow-y-auto custom-scrollbar space-y-5 text-xs bg-white">

            <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] text-slate-700 space-y-1">
                <p class="font-bold text-slate-900 text-sm">💡 What is a "Host"?</p>
                <p class="text-xs leading-relaxed text-slate-600">In hotel and fine dining operations, a
                    <strong>"Host"</strong> (e.g. Front Desk Host, Guest Relations Host, Restaurant Host) is an
                    **individual contributor/frontline employee**. They provide direct guest service.
                    Supervisors, HR, and Executives manage and support them.
                </p>
            </div>

            <!-- 4 Persona Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <!-- 1. Host (Employee) -->
                <div class="p-4 rounded-2xl border border-dusty-100 bg-dusty-50/40 space-y-2.5">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-dusty-dark text-sm flex items-center">
                            <span class="w-2 h-2 rounded-full bg-dusty mr-2"></span> 1. Front Desk Host
                            (Employee)
                        </span>
                        <span class="badge-dusty">Maria Santos</span>
                    </div>
                    <p class="text-slate-600 text-[11px]"><strong>Scope:</strong> Individual Contributor
                        (Self-Service)</p>
                    <div class="space-y-1 text-[11px] text-slate-700">
                        <p class="text-sage-dark font-semibold"><i class="fas fa-check-circle mr-1"></i>
                            <strong>What Employee CAN do:</strong>
                        </p>
                        <ul class="list-disc pl-4 space-y-0.5 text-slate-600">
                            <li>Draft &amp; submit performance objectives (Step 1)</li>
                            <li>Log daily shift achievements &amp; attach evidence (Step 3)</li>
                            <li>Submit self-assessment ratings &amp; narrative (Step 4)</li>
                            <li>Take LMS training courses &amp; knowledge quizzes</li>
                            <li>Send peer kudos to colleagues (+50 XP)</li>
                            <li>Execute personal 70-20-10 IDP action items (Step 7)</li>
                        </ul>
                        <p class="text-terracotta-dark font-semibold pt-1"><i class="fas fa-times-circle mr-1"></i>
                            <strong>CANNOT do:</strong>
                        </p>
                        <p class="text-slate-500 italic pl-4">Cannot approve own goals, rate colleagues
                            officially, or edit team succession 9-box grids.</p>
                    </div>
                </div>

                <!-- 2. Supervisor / Manager -->
                <div class="p-4 rounded-2xl border border-gold-100 bg-gold-50/40 space-y-2.5">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-gold-dark text-sm flex items-center">
                            <span class="w-2 h-2 rounded-full bg-gold mr-2"></span> 2. Department Supervisor
                        </span>
                        <span class="badge-gold">Chef Marco</span>
                    </div>
                    <p class="text-slate-600 text-[11px]"><strong>Scope:</strong> Operational Team Leader</p>
                    <div class="space-y-1 text-[11px] text-slate-700">
                        <p class="text-sage-dark font-semibold"><i class="fas fa-check-circle mr-1"></i>
                            <strong>What Supervisor CAN do:</strong>
                        </p>
                        <ul class="list-disc pl-4 space-y-0.5 text-slate-600">
                            <li>Review, calibrate &amp; officially approve goals (Step 2)</li>
                            <li>Log continuous supervisor coaching notes (Step 3)</li>
                            <li>Generate AI SBI coaching models for shift feedback</li>
                            <li>Conduct formal appraisal &amp; supervisor rating (Step 4)</li>
                            <li>Lead 1-on-1 calibration meetings with employee (Step 5)</li>
                            <li>Design &amp; assign 70-20-10 IDPs to subordinates (Step 6)</li>
                        </ul>
                    </div>
                </div>

                <!-- 3. HR Director -->
                <div class="p-4 rounded-2xl border border-primary-100 bg-primary-50/40 space-y-2.5">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-primary text-sm flex items-center">
                            <span class="w-2 h-2 rounded-full bg-primary mr-2"></span> 3. HR Director (Admin)
                        </span>
                        <span class="badge-primary">Elena Vance</span>
                    </div>
                    <p class="text-slate-600 text-[11px]"><strong>Scope:</strong> Hotel-Wide Governance</p>
                    <div class="space-y-1 text-[11px] text-slate-700">
                        <p class="text-sage-dark font-semibold"><i class="fas fa-check-circle mr-1"></i>
                            <strong>What HR Director CAN do:</strong>
                        </p>
                        <ul class="list-disc pl-4 space-y-0.5 text-slate-600">
                            <li>Normalize appraisal bell curves &amp; finalize ratings</li>
                            <li>Manage competency frameworks &amp; team matrix</li>
                            <li>Conduct Training Needs Analysis (TNA) &amp; compliance</li>
                            <li>Manage 9-Box Succession Grids &amp; talent bench</li>
                            <li>Export formal audit reports &amp; compliance logs</li>
                        </ul>
                    </div>
                </div>

                <!-- 4. General Manager -->
                <div class="p-4 rounded-2xl border border-[#E8DEDC] bg-[#FAF8F7] space-y-2.5">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-slate-950 text-sm flex items-center">
                            <span class="w-2 h-2 rounded-full bg-slate-700 mr-2"></span> 4. General Manager (Exec)
                        </span>
                        <span class="badge-secondary">Robert Sterling</span>
                    </div>
                    <p class="text-slate-600 text-[11px]"><strong>Scope:</strong> Executive Strategic Oversight
                    </p>
                    <div class="space-y-1 text-[11px] text-slate-700">
                        <p class="text-sage-dark font-semibold"><i class="fas fa-check-circle mr-1"></i>
                            <strong>What GM CAN do:</strong>
                        </p>
                        <ul class="list-disc pl-4 space-y-0.5 text-slate-600">
                            <li>Review property-wide Hospitality Index &amp; NPS</li>
                            <li>Approve executive leadership succession appointments</li>
                            <li>Monitor department operational efficiency &amp; sentiment</li>
                            <li>Access high-level executive strategic briefings</li>
                        </ul>
                    </div>
                </div>

            </div>

        </div>

        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex justify-end">
            <button onclick="closeModal('modal-role-matrix')"
                class="btn-primary px-5 py-2 text-xs font-bold">Understood</button>
        </div>
    </div>
</div>

<!-- ======================================================== -->
<!-- COMPETENCY MANAGEMENT MODALS                             -->
<!-- ======================================================== -->

<!-- Modal: Conduct 360 Competency Assessment -->
<div id="modal-conduct-assessment" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-full bg-primary-50 text-primary flex items-center justify-center text-lg font-bold border border-primary-100">
                    <i class="fas fa-clipboard-check"></i>
                </div>
                <div>
                    <span class="badge-primary">Competency Assessment Rubric</span>
                    <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Evaluate Associate: <span id="assess-modal-emp-name" class="text-primary font-bold">Maria Santos</span></h3>
                    <p id="assess-modal-emp-role" class="text-[11px] text-slate-500">Front Desk Host · Front Office</p>
                </div>
            </div>
            <button onclick="closeModal('modal-conduct-assessment')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Body Form -->
        <form id="form-conduct-assessment" onsubmit="handleAssessmentSubmit(event)" class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs bg-white flex-1">
            <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] text-[11px] text-slate-600">
                <i class="fas fa-info-circle text-primary mr-1"></i>
                Rate each dimension based on demonstrated observable behaviors during the 2026 Q3 review period.
            </div>

            <!-- Dynamic Fields Container -->
            <div id="assess-modal-fields" class="space-y-3">
                <!-- Populated dynamically by launchAssessmentModalFor() -->
            </div>

            <div class="space-y-1 pt-2">
                <label class="block font-bold text-slate-800 text-[11px]">Calibrated Assessor Notes &amp; Coaching Recommendations</label>
                <textarea id="assess-modal-notes" rows="2" class="w-full p-3 rounded-xl border border-[#E8DEDC] focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-[#FAF8F7]" placeholder="Detail key developmental strengths and coaching priorities..."></textarea>
            </div>
        </form>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-400 font-medium hidden sm:inline"><i class="fas fa-shield text-slate-300 mr-1"></i> Official HR Record</span>
            <div class="flex items-center space-x-2.5 ml-auto">
                <button type="button" onclick="closeModal('modal-conduct-assessment')" class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
                <button type="button" onclick="document.getElementById('form-conduct-assessment').requestSubmit()" class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5">
                    <span>Lock &amp; Calibrate Assessment</span>
                    <i class="fas fa-check text-[10px]"></i>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Modal: Create 70-20-10 IDP Milestone -->
<div id="modal-create-idp" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-full bg-sage-50 text-sage-dark flex items-center justify-center text-lg font-bold border border-sage-100">
                    <i class="fas fa-route"></i>
                </div>
                <div>
                    <span class="badge-sage">70-20-10 Framework</span>
                    <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Add Individual Development Goal</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-create-idp')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <form id="form-create-idp" onsubmit="handleCreateIdpSubmit(event)" class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs bg-white flex-1">
            <div class="space-y-1">
                <label class="block font-bold text-slate-800 text-[11px]">Developmental Objective Title *</label>
                <input type="text" id="idp-form-title" required class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEDC] focus:ring-2 focus:ring-primary focus:outline-none bg-[#FAF8F7]" placeholder="e.g. Master High-Occupancy Frontline Crisis Diplomacy">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">70-20-10 Learning Pillar *</label>
                    <select id="idp-form-category" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] font-semibold text-slate-800 bg-[#FAF8F7]">
                        <option value="70% Experiential">70% Experiential (On-the-job floor project)</option>
                        <option value="20% Social">20% Social (Peer shadow &amp; mentor coaching)</option>
                        <option value="10% Formal">10% Formal (LMS modules &amp; SOP handbook)</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Target Completion Date *</label>
                    <input type="date" id="idp-form-date" required value="2026-10-31" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] font-semibold text-slate-800 bg-[#FAF8F7]">
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Target Competency Dimension *</label>
                    <input type="text" id="idp-form-comp" required value="Frontline Conflict De-escalation" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7]">
                </div>
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Assigned Mentor / Supervisor *</label>
                    <input type="text" id="idp-form-mentor" required value="Elena Vance (HR Lead)" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7]">
                </div>
            </div>

            <div class="space-y-2 pt-2 border-t border-[#E8DEDC]">
                <label class="block font-bold text-slate-800 text-[11px]">Milestone Action Items:</label>
                <input type="text" id="idp-form-task-1" required value="Complete Crisis Diplomacy simulation training module" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] mb-2" placeholder="Action Task 1">
                <input type="text" id="idp-form-task-2" required value="Lead 3 live VIP dispute recoveries and log incident resolution notes" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7]" placeholder="Action Task 2">
            </div>
        </form>

        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end space-x-2.5 flex-shrink-0">
            <button type="button" onclick="closeModal('modal-create-idp')" class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
            <button type="button" onclick="document.getElementById('form-create-idp').requestSubmit()" class="btn-primary px-5 py-2 text-xs font-bold">Create IDP Plan</button>
        </div>
    </div>
</div>

<!-- Modal: Add / Record New Certificate -->
<div id="modal-add-certificate" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-full bg-gold-50 text-gold-dark flex items-center justify-center text-lg font-bold border border-gold-100">
                    <i class="fas fa-award"></i>
                </div>
                <div>
                    <span class="badge-gold">Licensure Registry</span>
                    <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Record Verified Qualification</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-add-certificate')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <form id="form-add-certificate" onsubmit="handleAddCertificateSubmit(event)" class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs bg-white flex-1">
            <div class="space-y-1">
                <label class="block font-bold text-slate-800 text-[11px]">Certificate / License Title *</label>
                <input type="text" id="cert-form-name" required value="Certified Hospitality Supervisor (CHS)" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEDC] focus:ring-2 focus:ring-primary focus:outline-none bg-[#FAF8F7]">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Issuing Body / Authority *</label>
                    <input type="text" id="cert-form-issuer" required value="AHLEI" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7]">
                </div>
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Certificate / Registration No.</label>
                    <input type="text" id="cert-form-no" value="AHLEI-CHS-88390" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7]">
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Issue Date *</label>
                    <input type="date" id="cert-form-issue" required value="2026-08-01" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7]">
                </div>
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Expiration Date *</label>
                    <input type="date" id="cert-form-expiry" required value="2028-08-01" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7]">
                </div>
            </div>

            <div class="space-y-1">
                <label class="block font-bold text-slate-800 text-[11px]">Linked Competency Dimension</label>
                <input type="text" id="cert-form-comp" value="Guest Relations & VIP Protocol" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7]">
            </div>
        </form>

        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end space-x-2.5 flex-shrink-0">
            <button type="button" onclick="closeModal('modal-add-certificate')" class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
            <button type="button" onclick="document.getElementById('form-add-certificate').requestSubmit()" class="btn-primary px-5 py-2 text-xs font-bold">Save Credential</button>
        </div>
    </div>
</div>

<!-- Modal: Edit Role Competency Profile Standard -->
<div id="modal-edit-competency-profile" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-md w-full overflow-hidden flex flex-col">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-full bg-primary-50 text-primary flex items-center justify-center text-lg font-bold border border-primary-100">
                    <i class="fas fa-sliders"></i>
                </div>
                <div>
                    <span class="badge-primary">HR Admin Config</span>
                    <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Edit Benchmark Standard</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-edit-competency-profile')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <div class="p-6 space-y-4 text-xs bg-white">
            <p class="text-slate-600">Adjust the property benchmark threshold required for promotion qualification in this role:</p>
            <div class="space-y-1">
                <label class="block font-bold text-slate-800 text-[11px]">Minimum Target Rating (1.0 - 5.0)</label>
                <input type="number" step="0.1" min="1.0" max="5.0" value="4.5" class="w-full p-2.5 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-bold text-slate-900">
            </div>
            <div class="space-y-1">
                <label class="block font-bold text-slate-800 text-[11px]">Competency Appraisal Weight</label>
                <select class="w-full p-2.5 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-semibold text-slate-800">
                    <option value="40" selected>40% (Standard HR3 Appraisal Weight)</option>
                    <option value="50">50% (High Leadership Weight)</option>
                    <option value="30">30% (Operational Focus)</option>
                </select>
            </div>
        </div>

        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end space-x-2.5">
            <button type="button" onclick="closeModal('modal-edit-competency-profile')" class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
            <button type="button" onclick="closeModal('modal-edit-competency-profile'); showToast('Updated role competency benchmark standard!', 'success');" class="btn-primary px-5 py-2 text-xs font-bold">Save Standards</button>
        </div>
    </div>
</div>

<!-- Modal: Batch Team Competency Evaluation -->
<div id="modal-batch-evaluation" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-3xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-full bg-primary-50 text-primary flex items-center justify-center text-lg font-bold border border-primary-100">
                    <i class="fas fa-list-check"></i>
                </div>
                <div>
                    <span class="badge-primary">Supervisory Multi-Staff Review</span>
                    <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Batch Competency Evaluation</h3>
                    <p class="text-[11px] text-slate-500">Quick-calibrate and approve ratings for all direct reports across hotel departments.</p>
                </div>
            </div>
            <button onclick="closeModal('modal-batch-evaluation')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <form onsubmit="saveBatchEvaluation(event)" class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs bg-white flex-1">
            <div class="overflow-x-auto border border-[#E8DEDC] rounded-2xl">
                <table class="w-full text-left text-xs">
                    <thead class="bg-[#FAF8F7] text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-[#E8DEDC]">
                        <tr>
                            <th class="px-4 py-3">Associate</th>
                            <th class="px-4 py-3 text-center">Previous Rating</th>
                            <th class="px-4 py-3 text-center">New Calibrated Rating</th>
                            <th class="px-4 py-3 text-center">Status Action</th>
                        </tr>
                    </thead>
                    <tbody id="batch-eval-table-tbody" class="divide-y divide-[#E8DEDC]">
                        <!-- Populated dynamically by openBatchEvaluationModal() -->
                    </tbody>
                </table>
            </div>
        </form>

        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-400 font-medium hidden sm:inline"><i class="fas fa-bolt text-gold mr-1"></i> Synchronizes across entire department</span>
            <div class="flex items-center space-x-2.5 ml-auto">
                <button type="button" onclick="closeModal('modal-batch-evaluation')" class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
                <button type="button" onclick="saveBatchEvaluation(event)" class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5">
                    <i class="fas fa-check"></i>
                    <span>Apply Batch Ratings</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ======================================================== -->
        <!-- MODAL: CREATE TRAINING PROGRAM (STAGE 2)                  -->
        <!-- ======================================================== -->
        <div id="modal-create-training-program" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-xl w-full overflow-hidden max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100">
                <div class="p-5 border-b border-[#E8DEDC] flex items-center justify-between bg-[#FAF8F7]">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                            <i class="fas fa-book-bookmark text-base"></i>
                        </div>
                        <div>
                            <span class="badge-primary text-[10px]">Stage 2: Program Creation</span>
                            <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Create Training Program</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-create-training-program')" class="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition shadow-sm border border-[#E8DEDC]">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs">
                    <div>
                        <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Program Title *</label>
                        <input id="prog-modal-title-input" type="text" placeholder="e.g. VIP Concierge Guest Luggage Logistics & Discretion" 
                            class="w-full px-3.5 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Category *</label>
                            <select id="prog-modal-category" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="Service Excellence">Service Excellence</option>
                                <option value="Mandatory Compliance">Mandatory Compliance</option>
                                <option value="Technical System">Technical System</option>
                                <option value="Leadership & Strategy">Leadership &amp; Strategy</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department *</label>
                            <select id="prog-modal-dept" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="Front Office">Front Office</option>
                                <option value="Food & Beverage">Food &amp; Beverage</option>
                                <option value="Culinary & Kitchen">Culinary &amp; Kitchen</option>
                                <option value="Housekeeping">Housekeeping</option>
                                <option value="Engineering & Security">Engineering &amp; Security</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Target Competency *</label>
                            <select id="prog-modal-comp" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="Frontline Conflict De-escalation">Frontline Conflict De-escalation</option>
                                <option value="Guest Relations & VIP Protocol">Guest Relations &amp; VIP Protocol</option>
                                <option value="Opera & PMS Reservation Systems">Opera &amp; PMS Reservation Systems</option>
                                <option value="HACCP Safety & Sanitation">HACCP Safety &amp; Sanitation</option>
                                <option value="Revenue & Wine Upsell">Revenue &amp; Wine Upsell</option>
                                <option value="Shift Leadership & Delegation">Shift Leadership &amp; Delegation</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Duration &amp; Format</label>
                            <input id="prog-modal-duration" type="text" value="3.5 Hours (Workshop & Roleplay)" 
                                class="w-full px-3.5 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Program Syllabus / Overview</label>
                        <textarea id="prog-modal-desc" rows="3" placeholder="Describe learning objectives, scenario roleplays, and expected competencies..." 
                            class="w-full px-3.5 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none"></textarea>
                    </div>

                    <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] flex items-center justify-between text-slate-600">
                        <span class="font-bold"><i class="fas fa-medal text-gold-dark mr-1"></i> Passing Requirement:</span>
                        <span class="font-bold text-primary">&ge; 80% on post-quiz · Awards +150 XP</span>
                    </div>
                </div>

                <div class="p-4 border-t border-[#E8DEDC] bg-[#FAF8F7] flex items-center justify-end space-x-2">
                    <button type="button" onclick="closeModal('modal-create-training-program')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                    <button type="button" onclick="saveNewTrainingProgram()" class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5">
                        <i class="fas fa-check"></i>
                        <span>Publish Program</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- MODAL: SCHEDULE TRAINING SESSION (STAGE 3)                -->
        <!-- ======================================================== -->
        <div id="modal-schedule-training-session" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-xl w-full overflow-hidden max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100">
                <div class="p-5 border-b border-[#E8DEDC] flex items-center justify-between bg-[#FAF8F7]">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-dusty-500/10 text-dusty-dark border border-dusty-500/20 flex items-center justify-center">
                            <i class="fas fa-calendar-days text-base"></i>
                        </div>
                        <div>
                            <span class="badge-dusty text-[10px]">Stage 3: Schedule &amp; Trainer</span>
                            <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Schedule Training Session</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-schedule-training-session')" class="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition shadow-sm border border-[#E8DEDC]">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs">
                    <div>
                        <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Select Training Program *</label>
                        <select id="sched-modal-program-select" class="w-full px-3.5 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                            <!-- Populated dynamically -->
                        </select>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Assigned Trainer *</label>
                            <input id="sched-modal-trainer" type="text" value="Elena Vance & FOM John Marco" 
                                class="w-full px-3.5 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Training Venue / Location *</label>
                            <input id="sched-modal-venue" type="text" value="Executive Boardroom & Front Desk Mockup" 
                                class="w-full px-3.5 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Session Date *</label>
                            <input id="sched-modal-date" type="text" value="Aug 30, 2026" 
                                class="w-full px-3.5 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Session Time *</label>
                            <input id="sched-modal-time" type="text" value="14:00 - 17:30 (3.5 hrs)" 
                                class="w-full px-3.5 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                        </div>
                    </div>

                    <!-- Participant Registration Roster -->
                    <div class="p-3 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2">
                        <span class="block text-[11px] font-bold text-slate-700 uppercase">Enrolled Participants (Auto-populated from Need Gaps)</span>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#E8DEDC] text-slate-800 flex items-center space-x-1">
                                <span>Maria Santos (Front Desk)</span>
                                <i class="fas fa-check text-emerald-600 text-[10px] ml-1"></i>
                            </span>
                            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#E8DEDC] text-slate-800 flex items-center space-x-1">
                                <span>Carlos Gomez (Concierge)</span>
                                <i class="fas fa-check text-emerald-600 text-[10px] ml-1"></i>
                            </span>
                            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#E8DEDC] text-slate-800 flex items-center space-x-1">
                                <span>Angela Reyes (Guest Relations)</span>
                                <i class="fas fa-check text-emerald-600 text-[10px] ml-1"></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="p-4 border-t border-[#E8DEDC] bg-[#FAF8F7] flex items-center justify-end space-x-2">
                    <button type="button" onclick="closeModal('modal-schedule-training-session')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                    <button type="button" onclick="saveScheduledSession()" class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5">
                        <i class="fas fa-calendar-check"></i>
                        <span>Confirm &amp; Notify Roster</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- MODAL: POST-TRAINING EVALUATION & QUIZ (STAGE 5)          -->
        <!-- ======================================================== -->
        <div id="modal-training-evaluation" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-2xl w-full overflow-hidden max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100">
                <div class="p-5 border-b border-[#E8DEDC] flex items-center justify-between bg-[#FAF8F7]">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-terracotta-500/10 text-terracotta-dark border border-terracotta-500/20 flex items-center justify-center">
                            <i class="fas fa-clipboard-question text-base"></i>
                        </div>
                        <div>
                            <span class="badge-terracotta text-[10px]">Stage 5: Post-Training Evaluation</span>
                            <h3 id="eval-modal-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">Post-Training Knowledge &amp; Practical Assessment</h3>
                            <p id="eval-modal-subtitle" class="text-slate-500 text-[11px]">Associate: Maria Santos · Passing Score: 80%</p>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-training-evaluation')" class="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition shadow-sm border border-[#E8DEDC]">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto custom-scrollbar space-y-6 text-xs">
                    
                    <!-- Part A: Knowledge Assessment Quiz -->
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <h4 class="font-heading font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                                <span class="w-2 h-2 rounded-full bg-primary"></span>
                                <span>Part A: Practical Knowledge Questions (4 Questions)</span>
                            </h4>
                            <span class="badge-sage text-[10px]">Passing &ge; 80%</span>
                        </div>

                        <!-- Dynamic Questions Container -->
                        <div id="eval-modal-questions-container" class="space-y-3">
                            <!-- Populated dynamically by js/training.js -->
                        </div>
                    </div>

                    <!-- Part B: Kirkpatrick Level 1 Evaluation Feedback -->
                    <div class="space-y-3 pt-4 border-t border-[#E8DEDC]">
                        <h4 class="font-heading font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                            <span class="w-2 h-2 rounded-full bg-gold"></span>
                            <span>Part B: Kirkpatrick Level 1 Participant Feedback</span>
                        </h4>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-2">
                                <span class="font-bold text-slate-800 block text-[11px]">Trainer Mastery &amp; Clarity:</span>
                                <div id="star-trainer-rating" class="flex items-center space-x-1">
                                    <button type="button" onclick="setKirkpatrickRating('trainer', 1)" class="text-amber-400 hover:scale-110 transition text-base"><i class="fas fa-star"></i></button>
                                    <button type="button" onclick="setKirkpatrickRating('trainer', 2)" class="text-amber-400 hover:scale-110 transition text-base"><i class="fas fa-star"></i></button>
                                    <button type="button" onclick="setKirkpatrickRating('trainer', 3)" class="text-amber-400 hover:scale-110 transition text-base"><i class="fas fa-star"></i></button>
                                    <button type="button" onclick="setKirkpatrickRating('trainer', 4)" class="text-amber-400 hover:scale-110 transition text-base"><i class="fas fa-star"></i></button>
                                    <button type="button" onclick="setKirkpatrickRating('trainer', 5)" class="text-amber-400 hover:scale-110 transition text-base"><i class="fas fa-star"></i></button>
                                </div>
                            </div>

                            <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-2">
                                <span class="font-bold text-slate-800 block text-[11px]">Practical Relevance to Role:</span>
                                <div id="star-relevance-rating" class="flex items-center space-x-1">
                                    <button type="button" onclick="setKirkpatrickRating('relevance', 1)" class="text-amber-400 hover:scale-110 transition text-base"><i class="fas fa-star"></i></button>
                                    <button type="button" onclick="setKirkpatrickRating('relevance', 2)" class="text-amber-400 hover:scale-110 transition text-base"><i class="fas fa-star"></i></button>
                                    <button type="button" onclick="setKirkpatrickRating('relevance', 3)" class="text-amber-400 hover:scale-110 transition text-base"><i class="fas fa-star"></i></button>
                                    <button type="button" onclick="setKirkpatrickRating('relevance', 4)" class="text-amber-400 hover:scale-110 transition text-base"><i class="fas fa-star"></i></button>
                                    <button type="button" onclick="setKirkpatrickRating('relevance', 5)" class="text-amber-400 hover:scale-110 transition text-base"><i class="fas fa-star"></i></button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Key Takeaway / Action Commitment</label>
                            <input id="eval-modal-comments" type="text" value="Will implement the LAST de-escalation framework and proactive room upgrades." 
                                class="w-full px-3.5 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                        </div>
                    </div>

                </div>

                <div class="p-4 border-t border-[#E8DEDC] bg-[#FAF8F7] flex items-center justify-between">
                    <span class="text-[11px] text-slate-500 font-medium">Submitting will calculate score &amp; trigger <strong>Stage 6 &amp; 7 Feedback</strong></span>
                    <div class="flex items-center space-x-2">
                        <button type="button" onclick="closeModal('modal-training-evaluation')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                        <button type="button" onclick="submitTrainingEvaluation()" class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                            <i class="fas fa-paper-plane"></i>
                            <span>Submit &amp; Sync Results</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- MODAL: DIGITAL TRAINING CERTIFICATE (STAGE 6)             -->
        <!-- ======================================================== -->
        <div id="modal-training-certificate" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-2xl w-full overflow-hidden max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100">
                <div class="p-4 border-b border-[#E8DEDC] flex items-center justify-between bg-[#FAF8F7]">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-certificate text-amber-500"></i>
                        <h4 class="font-heading font-bold text-sm text-slate-900">Oxford Suites Hospitality Official Certificate</h4>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="printTrainingCertificate()" class="btn-secondary px-3 py-1 text-xs font-bold flex items-center space-x-1">
                            <i class="fas fa-print"></i>
                            <span>Print / PDF</span>
                        </button>
                        <button onclick="closeModal('modal-training-certificate')" class="w-7 h-7 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition border border-[#E8DEDC]">
                            <i class="fas fa-times text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- Gold-Bordered Luxury Certificate Body -->
                <div class="p-8 bg-[#FFFDF9] border-8 border-double border-amber-300/80 m-4 rounded-2xl relative shadow-inner overflow-hidden text-center space-y-4">
                    <!-- Subtle Watermark Seal -->
                    <div class="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
                        <i class="fas fa-hotel text-[220px] text-amber-900"></i>
                    </div>

                    <div class="space-y-1">
                        <div class="flex items-center justify-center space-x-2 text-primary font-bold tracking-widest text-[11px] uppercase">
                            <i class="fas fa-crown text-amber-500"></i>
                            <span>Oxford Suites, Makati · Hospitality Excellence Center</span>
                            <i class="fas fa-crown text-amber-500"></i>
                        </div>
                        <h2 class="font-heading font-extrabold text-2xl text-slate-900 tracking-wide uppercase pt-1">Certificate of Competency Mastery</h2>
                        <p class="text-xs text-slate-500 italic">This is officially presented to acknowledge that</p>
                    </div>

                    <div class="py-2 border-b-2 border-amber-400/40 max-w-md mx-auto">
                        <h3 id="cert-modal-associate-name" class="font-heading font-black text-2xl text-primary tracking-wide">Maria Santos</h3>
                    </div>

                    <div class="space-y-1 text-xs text-slate-600 max-w-lg mx-auto">
                        <p>has successfully completed the intensive curriculum, practical simulation, and post-training examination for</p>
                        <h4 id="cert-modal-program-title" class="font-bold text-sm text-slate-900 text-amber-900 pt-1 font-heading">Hospitality Crisis Diplomacy &amp; Guest De-escalation</h4>
                        <p id="cert-modal-score" class="text-xs font-bold text-emerald-700">Score: 96% (Mastery Level Achieved)</p>
                    </div>

                    <!-- Signatures & Seal Section -->
                    <div class="pt-6 grid grid-cols-3 gap-4 items-end text-[10px] text-slate-600">
                        <div class="space-y-1 border-t border-slate-300 pt-1">
                            <p id="cert-modal-trainer-name" class="font-bold text-slate-900">Elena Vance</p>
                            <p class="text-slate-400">Certified Master Trainer</p>
                        </div>

                        <!-- Golden Foil Seal Badge -->
                        <div class="flex flex-col items-center justify-center">
                            <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 border-2 border-amber-600 shadow-md flex items-center justify-center text-amber-950">
                                <i class="fas fa-medal text-xl"></i>
                            </div>
                            <span id="cert-modal-cert-id" class="text-[9px] font-mono text-slate-400 mt-1">OXF-CERT-2026-0889</span>
                        </div>

                        <div class="space-y-1 border-t border-slate-300 pt-1">
                            <p class="font-bold text-slate-900">Robert Sterling</p>
                            <p class="text-slate-400">General Manager</p>
                        </div>
                    </div>

                    <div class="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-amber-200/40">
                        <span>Issued: <strong id="cert-modal-date">Aug 24, 2026</strong></span>
                        <span class="text-emerald-700 font-bold"><i class="fas fa-check-circle mr-1"></i> Verified &amp; Synced with Competency Management</span>
                    </div>
                </div>

                <div class="p-4 border-t border-[#E8DEDC] bg-[#FAF8F7] flex items-center justify-end">
                    <button onclick="closeModal('modal-training-certificate')" class="btn-primary px-5 py-2 text-xs font-bold">Done</button>
                </div>
            </div>
        </div>

        <!-- 15. Modal: Official Printable Executive PDF Audit Preview -->
        <div id="modal-report-print-preview" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#E8DEDC]">
                
                <!-- Modal Top Header -->
                <div class="p-5 border-b border-[#E8DEDC] flex items-center justify-between bg-white flex-shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-primary-50 text-primary flex items-center justify-center text-lg font-bold border border-primary-100">
                            <i class="fas fa-file-pdf"></i>
                        </div>
                        <div>
                            <h3 id="print-report-modal-title" class="font-heading font-bold text-base text-slate-900">Official Executive Audit Deck</h3>
                            <div class="flex items-center space-x-2 text-xs text-slate-500">
                                <span id="print-report-modal-period">Audit Window: Q3 2026</span>
                                <span>·</span>
                                <span id="print-report-modal-dept">Department: Hotel-Wide</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="triggerNativeBrowserPrint()" class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                            <i class="fas fa-print"></i>
                            <span>Print / Save PDF</span>
                        </button>
                        <button onclick="closeModal('modal-report-print-preview')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                            <i class="fas fa-times text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- Printable Report Body -->
                <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white text-xs">
                    
                    <!-- Branded Letterhead -->
                    <div class="flex items-start justify-between border-b-2 border-primary/20 pb-4">
                        <div class="flex items-center space-x-3">
                            <img src="public/images/removed-bg-logo.png" alt="Oxford Suites Logo" class="h-12 w-auto object-contain">
                            <div>
                                <h2 class="font-heading font-bold text-lg text-slate-900 leading-tight">Oxford Suites, Makati</h2>
                                <p class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Human Resources &amp; Hospitality Operational Governance</p>
                            </div>
                        </div>
                        <div class="text-right text-[10px] text-slate-400">
                            <p>Ref: <strong>OXF-AUDIT-2026-Q3</strong></p>
                            <p>Date: <strong>Aug 24, 2026</strong></p>
                            <span class="inline-block mt-1 badge-sage font-bold">Official Record</span>
                        </div>
                    </div>

                    <!-- Dynamic Report Content -->
                    <div id="print-report-modal-body" class="space-y-4">
                        <!-- Rendered by js/reports.js -->
                    </div>

                    <!-- Formal Sign-Off Blocks -->
                    <div class="pt-6 border-t border-[#E8DEDC] grid grid-cols-2 gap-8 text-[11px] text-slate-600">
                        <div class="space-y-1">
                            <p class="text-slate-400 text-[10px] uppercase font-bold">Prepared &amp; Audited By:</p>
                            <p class="font-bold text-slate-900 text-xs">Elena Vance, CHRP</p>
                            <p class="text-[10px] text-slate-500">Director of Human Resources &amp; Talent Development</p>
                        </div>
                        <div class="space-y-1 text-right">
                            <p class="text-slate-400 text-[10px] uppercase font-bold">Endorsed &amp; Approved By:</p>
                            <p class="font-bold text-slate-900 text-xs">Robert Sterling, CHA</p>
                            <p class="text-[10px] text-slate-500">General Manager · Oxford Suites, Makati</p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="p-4 border-t border-[#E8DEDC] bg-[#FAF8F7] flex items-center justify-between text-xs">
                    <span class="text-slate-400 text-[10px]">Confidential — For Internal Governance and Regulatory Inspections Only</span>
                    <button onclick="closeModal('modal-report-print-preview')" class="btn-secondary px-4 py-1.5 font-bold">Close Preview</button>
                </div>
            </div>
        </div>



        <!-- 17. Modal: Log Performance Milestone & KPI Progress -->
        <div id="modal-log-milestone" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200">
                <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg font-bold border border-emerald-200 shadow-2xs">
                            <i class="fas fa-flag-checkered"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-1.5">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Stage 3 · Monitoring</span>
                                <span class="text-[10px] text-slate-400">Shift Progress Log</span>
                            </div>
                            <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Log Milestone &amp; Actual KPI</h3>
                            <p class="text-[11px] text-slate-500 font-medium">
                                <span id="milestone-emp-name">Maria Santos</span> &middot; <span id="milestone-emp-pos">Front Office</span>
                            </p>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-log-milestone')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <form id="form-log-milestone" onsubmit="saveMilestoneLog(event)" class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs">
                    <input type="hidden" id="milestone-emp-id">

                    <!-- 1. Target Objective Selector -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">1. Select Target Objective *</label>
                        <select id="milestone-goal-select" required onchange="onMilestoneGoalChange()" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50">
                            <!-- Populated dynamically -->
                        </select>
                    </div>

                    <!-- 2. Milestone / Shift Achievement Description -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">2. Milestone / Shift Deliverable Title *</label>
                        <input id="milestone-title" type="text" required placeholder="e.g., Completed 45 VIP check-ins with 100% Medallia rating" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50">
                    </div>

                    <!-- 3. Actual Metric & Progress Slider -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="font-bold text-slate-800 text-[11px]">3. Actual Metric Achieved *</label>
                            <input id="milestone-actual-metric" type="text" required placeholder="e.g., +94 NPS or 48s Response" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none bg-white">
                        </div>
                        <div class="space-y-1">
                            <div class="flex justify-between items-center">
                                <label class="font-bold text-slate-800 text-[11px]">4. Goal Progress Achieved</label>
                                <span id="milestone-progress-val" class="font-bold font-mono text-emerald-700 text-xs">85%</span>
                            </div>
                            <input id="milestone-progress-range" type="range" min="10" max="100" step="5" value="85" oninput="document.getElementById('milestone-progress-val').textContent = this.value + '%'" class="w-full accent-primary mt-2 cursor-pointer">
                        </div>
                    </div>

                    <!-- 4. Accomplishments Recorded -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px] flex items-center space-x-1.5">
                            <i class="fas fa-trophy text-amber-500"></i>
                            <span>5. Accomplishments Recorded</span>
                        </label>
                        <textarea id="milestone-accomplishments" rows="2" placeholder="Record key shift wins, guest commendations, revenue upsell milestones, or audit achievements..." class="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-slate-50"></textarea>
                    </div>

                    <!-- 5. Challenges Encountered -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px] flex items-center space-x-1.5">
                            <i class="fas fa-triangle-exclamation text-rose-500"></i>
                            <span>6. Challenges &amp; Obstacles Encountered</span>
                        </label>
                        <textarea id="milestone-challenges" rows="2" placeholder="Record shift bottlenecks, high-occupancy rushes, inventory delays, or operational hurdles..." class="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-slate-50"></textarea>
                    </div>

                    <!-- 6. Feedback & Coaching -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px] flex items-center space-x-1.5">
                            <i class="fas fa-comments text-indigo-500"></i>
                            <span>7. Coaching &amp; Operational Feedback</span>
                        </label>
                        <textarea id="milestone-feedback" rows="2" placeholder="Record supervisor calibration notes, peer observations, or actionable next steps..." class="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-slate-50"></textarea>
                    </div>

                    <!-- 7. Supporting Evidence -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px] flex items-center space-x-1.5">
                            <i class="fas fa-paperclip text-slate-500"></i>
                            <span>8. Supporting Evidence / Verification Source</span>
                        </label>
                        <input id="milestone-evidence" type="text" placeholder="e.g., Medallia Guest Survey #4412, Micros POS Shift Report, Opera PMS Speed Log" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none bg-slate-50">
                    </div>

                    <div class="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button type="button" onclick="closeModal('modal-log-milestone')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                        <button type="submit" id="btn-save-milestone" class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-xs">
                            <i class="fas fa-check text-[10px]"></i>
                            <span>Save Milestone &amp; Update KPI</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 19. Modal: General Tasks Template Matrix (Add/Edit) -->
        <div id="modal-general-task" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200">
                <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 flex-shrink-0">
                    <div class="flex items-center space-x-3.5">
                        <div class="w-10 h-10 rounded-2xl bg-primary-50 text-primary flex items-center justify-center text-lg shadow-2xs border border-primary-100">
                            <i class="fas fa-list-check"></i>
                        </div>
                        <div>
                            <span id="general-task-modal-badge" class="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">General Task Matrix</span>
                            <h3 id="general-task-modal-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">Add Standard General Task</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-general-task')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <form id="form-general-task" onsubmit="handleGeneralTaskSubmit(event)" class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs">
                    <input type="hidden" id="general-task-id" value="">

                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">Task Title / Standard Action *</label>
                        <input type="text" id="general-task-title" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g., Hospitality 5-Star Standard Operating Procedure (SOP) Refresher">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="font-bold text-slate-800 text-[11px]">Category *</label>
                            <select id="general-task-category" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none bg-white">
                                <option value="SOP & Standards">SOP &amp; Standards</option>
                                <option value="Operational Excellence">Operational Excellence</option>
                                <option value="Guest Experience">Guest Experience</option>
                                <option value="Hygiene & Sanitation">Hygiene &amp; Sanitation</option>
                                <option value="Communication & Escalation">Communication &amp; Escalation</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="font-bold text-slate-800 text-[11px]">Deadline Offset (Days Before Goal Target)</label>
                            <input type="number" id="general-task-days-offset" min="1" max="90" value="7" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                            <span class="text-[10px] text-slate-400 block">Due N days before employee's target date</span>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">Priority / Weight</label>
                        <select id="general-task-weight" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none bg-white">
                            <option value="Standard">Standard Priority</option>
                            <option value="High Priority">High Priority (Critical Milestone)</option>
                            <option value="Mandatory Compliance">Mandatory Compliance Checklist</option>
                        </select>
                    </div>

                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">Detailed Description / SOP Requirements</label>
                        <textarea id="general-task-desc" rows="3" class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar" placeholder="Provide actionable guidelines, checklist criteria, or expectations for the employee..."></textarea>
                    </div>

                    <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button type="button" onclick="closeModal('modal-general-task')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                        <button type="submit" id="btn-save-general-task" class="btn-primary px-5 py-2 text-xs font-bold shadow-xs">
                            <i class="fas fa-save mr-1.5"></i> Save Task Template
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 20. Modal: Create Specific Task for Objective -->
        <div id="modal-specific-task" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200">
                <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-primary-50/40 flex-shrink-0">
                    <div class="flex items-center space-x-3.5">
                        <div class="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center text-lg shadow-2xs">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <div>
                            <span class="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">Specific Task Assignment</span>
                            <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Add Specific Task for Objective</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-specific-task')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <form id="form-specific-task" onsubmit="handleSpecificTaskSubmit(event)" class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs">
                    <input type="hidden" id="specific-task-goal-id" value="">
                    <input type="hidden" id="specific-task-employee-id" value="">
                    <input type="hidden" id="specific-task-goal-target-date" value="">

                    <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Objective</p>
                        <p id="specific-task-goal-title-display" class="font-bold text-slate-900 text-xs">Loading Goal...</p>
                        <p class="text-[11px] text-slate-500 flex items-center space-x-2">
                            <span>Target Date: <strong id="specific-task-goal-date-display" class="text-primary font-bold">2026-09-30</strong></span>
                            <span>·</span>
                            <span>Assigned To: <strong id="specific-task-emp-name-display" class="text-slate-800">Maria Santos</strong></span>
                        </p>
                    </div>

                    <!-- Dynamic Multiple Specific Task Rows Container -->
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <label class="font-bold text-slate-800 text-[11px] flex items-center space-x-1.5">
                                <i class="fas fa-list-check text-primary"></i>
                                <span>Specific Action Tasks to Assign</span>
                            </label>
                            <button type="button" onclick="addSpecificTaskRow()" class="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[10px] inline-flex items-center space-x-1 transition shadow-2xs">
                                <i class="fas fa-plus text-[8px]"></i>
                                <span>Add Another Task</span>
                            </button>
                        </div>

                        <div id="specific-tasks-rows-container" class="space-y-3">
                            <!-- Populated dynamically by JS or starts with 1 default row -->
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <button type="button" onclick="addSpecificTaskRow()" class="text-primary hover:underline text-xs font-bold inline-flex items-center space-x-1">
                            <i class="fas fa-plus-circle"></i>
                            <span>+ Add More Task Fields</span>
                        </button>
                        <div class="flex items-center space-x-2">
                            <button type="button" onclick="closeModal('modal-specific-task')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                            <button type="submit" id="btn-save-specific-task" class="btn-primary px-5 py-2 text-xs font-bold shadow-xs flex items-center space-x-1.5">
                                <i class="fas fa-check-double text-[10px]"></i>
                                <span id="btn-save-specific-task-text">Assign Tasks to Objective</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- 21. Modal: Employee Task Completion with Live Timestamp & Learnings / Feedback -->
        <div id="modal-complete-task" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-emerald-200">
                <div class="px-6 py-5 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/70 flex-shrink-0">
                    <div class="flex items-center space-x-3.5">
                        <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-2xs">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div>
                            <span class="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Task Accomplishment</span>
                            <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Complete Task &amp; Submit Learnings</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-complete-task')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <form id="form-complete-task" onsubmit="handleTaskCompletionSubmit(event)" class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs">
                    <input type="hidden" id="complete-task-id" value="">
                    <input type="hidden" id="complete-task-goal-id" value="">

                    <!-- Task Information Card -->
                    <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                        <div class="flex items-center justify-between">
                            <span id="complete-task-type-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">General Checklist</span>
                            <span class="text-[10px] text-slate-400 font-semibold" id="complete-task-due-badge">Due: 2026-09-20</span>
                        </div>
                        <h4 id="complete-task-title-display" class="font-bold text-slate-900 text-sm">Hospitality 5-Star Standard Operating Procedure Refresher</h4>
                        <p id="complete-task-desc-display" class="text-slate-600 text-[11px] leading-relaxed">Review hotel front-of-house service protocols and luxury guest greeting guidelines.</p>
                    </div>

                    <!-- Automatic Time & Date Detection Box -->
                    <div class="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-200 flex items-center justify-between">
                        <div class="flex items-center space-x-2.5">
                            <div class="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-indigo-950 uppercase tracking-wider">Completion Timestamp (Auto-Detected)</p>
                                <p id="complete-task-detected-time" class="text-xs font-bold text-indigo-700 font-mono">2026-08-26 20:30:00 (Local Time)</p>
                            </div>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                            <i class="fas fa-circle-dot text-[8px] animate-pulse"></i>
                            <span>Live Verified</span>
                        </span>
                        <input type="hidden" id="complete-task-iso-timestamp" value="">
                    </div>

                    <!-- Employee Key Learnings Textarea -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px] flex items-center justify-between">
                            <span>1. Key Learnings &amp; Growth Reflections *</span>
                            <span class="text-[10px] text-slate-400 font-normal">What did you learn or improve?</span>
                        </label>
                        <textarea id="complete-task-learnings" required rows="3" class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none custom-scrollbar" placeholder="e.g., Gained mastery in French wine pairing storytelling and expedited check-in handling within 2 minutes..."></textarea>
                    </div>

                    <!-- Employee Operational Feedback Textarea -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px] flex items-center justify-between">
                            <span>2. Operational Feedback &amp; Observations</span>
                            <span class="text-[10px] text-slate-400 font-normal">Any obstacles, suggestions or tool needs?</span>
                        </label>
                        <textarea id="complete-task-feedback" rows="3" class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none custom-scrollbar" placeholder="e.g., Suggest updating the digital wine menu on tablets for faster tableside lookup during peak Friday rushes..."></textarea>
                    </div>

                    <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button type="button" onclick="closeModal('modal-complete-task')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                        <button type="submit" id="btn-confirm-complete-task" class="btn-primary px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 border-emerald-600 shadow-xs">
                            <i class="fas fa-check-double mr-1.5"></i> Confirm &amp; Submit Task Completion
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 22. Modal: Supervisor Task Coaching & Accomplishment Feedback -->
        <div id="modal-supervisor-task-feedback" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-amber-200">
                <div class="px-6 py-5 border-b border-amber-100 flex items-center justify-between bg-amber-50/70 flex-shrink-0">
                    <div class="flex items-center space-x-3.5">
                        <div class="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-lg shadow-2xs">
                            <i class="fas fa-user-check"></i>
                        </div>
                        <div>
                            <span class="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Supervisor Calibration</span>
                            <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Record Accomplishments &amp; Coaching Feedback</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-supervisor-task-feedback')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <form id="form-supervisor-task-feedback" onsubmit="handleSupervisorTaskFeedbackSubmit(event)" class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs">
                    <input type="hidden" id="super-feedback-task-id" value="">

                    <!-- Task & Employee Learnings Preview -->
                    <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <h4 id="super-feedback-task-title" class="font-bold text-slate-900 text-xs">Sommelier Reserve Wine Pairing Workshop</h4>
                        <div id="super-feedback-employee-box" class="p-2.5 bg-white rounded-xl border border-slate-200/80 space-y-1">
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee Submitted Learnings &amp; Feedback</p>
                            <p id="super-feedback-learnings-text" class="text-[11px] text-slate-700 italic">"Gained confidence explaining vintage profiles..."</p>
                            <p id="super-feedback-feedback-text" class="text-[10px] text-slate-500">Feedback: "Would love a quick pocket cheat-sheet..."</p>
                        </div>
                    </div>

                    <!-- Supervisor Recorded Accomplishment -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">Accomplishments Recorded</label>
                        <input type="text" id="super-feedback-accomplishment" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="e.g., Successfully achieved +$480 beverage upsell during Aug 25 evening rush">
                    </div>

                    <!-- Supervisor Coaching & Operational Feedback -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">Coaching &amp; Operational Feedback *</label>
                        <textarea id="super-feedback-coaching" required rows="3" class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none custom-scrollbar" placeholder="e.g., Excellent demonstration of table engagement. Next step: practice wine decanting techniques during quiet hours..."></textarea>
                    </div>

                    <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button type="button" onclick="closeModal('modal-supervisor-task-feedback')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                        <button type="submit" id="btn-save-super-feedback" class="btn-primary px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 border-amber-600 shadow-xs">
                            <i class="fas fa-save mr-1.5"></i> Save Feedback to Monitoring
                        </button>
                    </div>
                </form>
            </div>
        </div>

