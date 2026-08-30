<!-- Universal Reusable Action Confirmation Modal -->
<div id="modal-action-confirmation" class="fixed inset-0 modal-overlay z-[999] hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scaleUp">
        <div id="confirm-modal-icon-container" class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold mx-auto">
            <i id="confirm-modal-icon" class="fas fa-triangle-exclamation"></i>
        </div>
        <div class="text-center space-y-1.5">
            <h3 id="confirm-modal-title" class="font-heading font-bold text-base text-slate-900">Confirm Action</h3>
            <p id="confirm-modal-message" class="text-xs text-slate-500 leading-relaxed">Are you sure you want to proceed with this action?</p>
        </div>
        <div class="flex items-center justify-end space-x-2.5 pt-2">
            <button type="button" id="btn-cancel-action-confirm" onclick="closeModal('modal-action-confirmation')" class="btn-secondary px-4 py-2 text-xs font-bold flex-1">
                Cancel
            </button>
            <button type="button" id="btn-proceed-action-confirm" class="btn-primary px-4 py-2 text-xs font-bold flex-1 shadow-xs">
                Confirm
            </button>
        </div>
    </div>
</div>

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
                        <span class="text-xs mb-0.5 block group-hover:scale-105 transition"><i class="fas fa-star text-amber-500 text-xs"></i></span>
                        <span
                            class="font-bold block text-slate-800 group-hover:text-primary text-[11px] truncate">VIP
                            NPS Lift</span>
                        <span class="text-[10px] text-slate-400 block truncate">Target: &ge; +92</span>
                    </button>
                    <button type="button" onclick="fillGoalTemplate('upsell_wine')"
                        class="p-2 rounded-xl bg-white border border-slate-200 hover:border-primary hover:text-primary font-semibold transition text-left shadow-2xs hover:shadow-xs group">
                        <span class="text-xs mb-0.5 block group-hover:scale-105 transition"><i class="fas fa-wine-glass text-rose-700 text-xs"></i></span>
                        <span
                            class="font-bold block text-slate-800 group-hover:text-primary text-[11px] truncate">Wine
                            Pairing</span>
                        <span class="text-[10px] text-slate-400 block truncate">+18% Avg Check</span>
                    </button>
                    <button type="button" onclick="fillGoalTemplate('haccp_audit')"
                        class="p-2 rounded-xl bg-white border border-slate-200 hover:border-primary hover:text-primary font-semibold transition text-left shadow-2xs hover:shadow-xs group">
                        <span class="text-xs mb-0.5 block group-hover:scale-105 transition"><i class="fas fa-shield-halved text-emerald-600 text-xs"></i></span>
                        <span
                            class="font-bold block text-slate-800 group-hover:text-primary text-[11px] truncate">HACCP
                            Hygiene</span>
                        <span class="text-[10px] text-slate-400 block truncate">100% QA Score</span>
                    </button>
                    <button type="button" onclick="fillGoalTemplate('room_turnaround')"
                        class="p-2 rounded-xl bg-white border border-slate-200 hover:border-primary hover:text-primary font-semibold transition text-left shadow-2xs hover:shadow-xs group">
                        <span class="text-xs mb-0.5 block group-hover:scale-105 transition"><i class="fas fa-bed text-indigo-600 text-xs"></i></span>
                        <span
                            class="font-bold block text-slate-800 group-hover:text-primary text-[11px] truncate">Suite
                            Turnover</span>
                        <span class="text-[10px] text-slate-400 block truncate">&lt; 22m / suite</span>
                    </button>
                </div>
            </div>

            <form id="form-create-goal" onsubmit="handleGoalSubmit(event)" class="space-y-4 text-xs">

                <!-- HR Target Assignment Scope / Supervisor from DB -->
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label class="font-bold text-slate-800 text-[11px] flex items-center shrink-0">
                        <i class="fas fa-user-tie text-slate-500 mr-1.5"></i> Assign Goal To (Supervisor / Leader):
                    </label>
                    <select id="goal-target-scope" onchange="if(typeof handleGoalScopeChange === 'function') handleGoalScopeChange(this)"
                        class="w-full sm:w-auto flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="emp-102" data-scope="single" data-name="Chef Marco Rossi" data-dept="Culinary & Kitchen Brigade" data-role="Supervisor">Chef Marco Rossi (Supervisor · Executive Sous Chef)</option>
                        <option value="emp-103" data-scope="single" data-name="Elena Vance" data-dept="Human Resources" data-role="HRAdmin">Elena Vance (HRAdmin · Director of People)</option>
                        <option value="emp-104" data-scope="single" data-name="Robert Sterling" data-dept="Executive Office" data-role="GeneralManager">Robert Sterling (GeneralManager · Managing Director)</option>
                        <option value="emp-101" data-scope="single" data-name="Maria Santos" data-dept="Front Office & Guest Experience" data-role="Associate">Maria Santos (Associate · Front Desk Host)</option>
                        <option value="dept" data-scope="dept" data-name="Entire Front Office Department" data-dept="Front Office & Guest Experience" data-role="Associate">Entire Front Office Department (12 Staff)</option>
                        <option value="property" data-scope="property" data-name="Hotel-wide Benchmark" data-dept="Front Office & Guest Experience" data-role="Associate">Hotel-wide Benchmark (All Staff)</option>
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

                <!-- Target Metric as Select Dropdown -->
                <div class="space-y-1.5 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                    <div class="flex justify-between items-center">
                        <label class="font-bold text-slate-800 text-[11px] flex items-center space-x-1.5">
                            <i class="fas fa-chart-line text-slate-600"></i>
                            <span>4. Target / Success Metric *</span>
                        </label>
                        <span class="text-[10px] text-slate-400">Select standard metric</span>
                    </div>
                    <select id="goal-kpi-input" required
                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none bg-white transition">
                        <option value="NPS >= +92 Score">VIP NPS Lift (Target >= +92 NPS Score)</option>
                        <option value="+18% Beverage Rev/Cover">Wine & Beverage Pairing (+18% Avg Check Revenue)</option>
                        <option value="100% Audit Score (Zero Violations)">HACCP Hygiene & Safety (100% Audit Pass)</option>
                        <option value="< 22 mins / suite turnover">Suite Turnover Efficiency (&lt; 22m per suite)</option>
                        <option value="Guest Satisfaction >= 95%">Guest Satisfaction Index (&ge; 95% Rating)</option>
                        <option value="Zero Safety Incidents">Risk & Safety Compliance (Zero Incidents)</option>
                        <option value="Upsell Conversion Rate >= 25%">Room Upsell Conversion (&ge; 25% Arrival Upgrade)</option>
                        <option value="Food Cost Variance <= 1.5%">Culinary Margin Control (Variance &le; 1.5%)</option>
                    </select>

                    <div class="flex items-center space-x-1.5 pt-1 flex-wrap gap-y-1">
                        <span class="text-[10px] text-slate-400 font-medium">Quick Presets:</span>
                        <button type="button" onclick="setKPIValue('NPS >= +92 Score')"
                            class="text-[10px] bg-white border border-slate-200 hover:border-slate-400 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition shadow-2xs flex items-center space-x-1">
                            <i class="fas fa-star text-amber-500 text-[10px]"></i>
                            <span>NPS &ge; +92</span>
                        </button>
                        <button type="button" onclick="setKPIValue('+18% Beverage Rev/Cover')"
                            class="text-[10px] bg-white border border-slate-200 hover:border-slate-400 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition shadow-2xs flex items-center space-x-1">
                            <i class="fas fa-arrow-trend-up text-emerald-600 text-[10px]"></i>
                            <span>+18% Avg Check</span>
                        </button>
                        <button type="button" onclick="setKPIValue('100% Audit Score (Zero Violations)')"
                            class="text-[10px] bg-white border border-slate-200 hover:border-slate-400 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition shadow-2xs flex items-center space-x-1">
                            <i class="fas fa-check-circle text-emerald-600 text-[10px]"></i>
                            <span>100% Audit Pass</span>
                        </button>
                        <button type="button" onclick="setKPIValue('< 22 mins / suite turnover')"
                            class="text-[10px] bg-white border border-slate-200 hover:border-slate-400 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition shadow-2xs flex items-center space-x-1">
                            <i class="fas fa-stopwatch text-indigo-600 text-[10px]"></i>
                            <span>&lt; 22m Turnover</span>
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
                <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3">
                    <div
                        class="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs flex-shrink-0 shadow-2xs">
                        <i class="fas fa-sparkles text-[10px]"></i>
                    </div>
                    <div class="text-[11px] text-slate-700 leading-relaxed">
                        <span class="font-bold text-slate-900"><i class="fas fa-wand-magic-sparkles text-primary mr-1"></i>Gemini Goal Copilot:</span>
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

<!-- 3. Modal: Gemini AI Coaching Refiner (Conversational Chatbot) -->
<div id="modal-ai-feedback" class="fixed z-50 hidden flex-col w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[85vh] bottom-24 right-4 lg:bottom-8 lg:right-24 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 animate-scaleUp">
    <div class="flex flex-col h-full overflow-hidden">

        <!-- Frosted Liquid Glass Header -->
        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-500/5 via-rose-500/5 to-purple-500/5 backdrop-blur-xs flex-shrink-0">
            <div class="flex items-center space-x-3">
                <img src="assets/images/ai_copilot_avatar.jpg" alt="AI Copilot" class="w-10 h-10 rounded-2xl object-cover shadow-2xs border border-slate-200">
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                            ✦ Copilot 1.5
                        </span>
                        <span id="ai-rate-limit-badge" class="text-[10px] font-bold text-slate-400">
                            ⚡ 20/20 req left
                        </span>
                    </div>
                    <h3 class="font-heading font-extrabold text-base text-slate-900 mt-0.5">SBI Feedback Refiner</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-ai-feedback')" aria-label="Close modal"
                class="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Scrollable Modal Body (Chat History) -->
        <div id="ai-chat-history" class="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 custom-scrollbar flex flex-col bg-slate-50/30">
            
            <!-- AI Welcome Message -->
            <div class="flex items-start space-x-3 w-full max-w-lg">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 via-primary/20 to-purple-500/20 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs border border-primary/20 mt-1">
                    <i class="fas fa-sparkles text-[10px]"></i>
                </div>
                <div class="flex-1 bg-white p-3.5 rounded-2xl rounded-tl-sm border border-slate-200/60 shadow-2xs text-slate-700 leading-relaxed space-y-2">
                    <p>Hello! I am your <strong>AI Leadership Coach</strong> for Oxford Suites.</p>
                    <p>I can help you structure performance feedback, de-escalate difficult guest situations, or draft coaching notes. How can I help you today?</p>
                </div>
            </div>

        </div>

        <!-- Chat Input Area -->
        <div class="p-3 sm:p-4 border-t border-slate-100 bg-white space-y-3">
            
            <!-- Quick Prompts -->
            <div class="flex space-x-2 overflow-x-auto custom-scrollbar pb-1">
                <button type="button" onclick="AIRefiner.sendChat('Help me draft a coaching note about a difficult guest check-in.')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    📝 Draft Coaching Note
                </button>
                <button type="button" onclick="AIRefiner.sendChat('What is the best way to handle an impatient VIP guest?')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    🗣️ De-escalation Tips
                </button>
                <button type="button" onclick="AIRefiner.sendChat('How can I improve my team\'s table turnover time?')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    ⏱️ Speed & Efficiency
                </button>
            </div>

            <div class="flex items-end space-x-2">
                <textarea id="ai-chat-input" rows="1" oninput="this.style.height = ''; this.style.height = Math.min(this.scrollHeight, 120) + 'px';"
                    class="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-slate-50/50 text-slate-800 text-xs placeholder:text-slate-400 leading-relaxed resize-none transition"
                    placeholder="Message AI Coach... (Press Enter to send)"></textarea>
                
                <button id="ai-btn-send-chat" onclick="AIRefiner.handleSendClick()"
                    class="w-10 h-10 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center flex-shrink-0 transition shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fas fa-paper-plane text-xs"></i>
                </button>
            </div>
            
            <div class="flex justify-between items-center px-1">
                <span class="text-[9px] text-slate-400">Gemini can make mistakes. Verify important information.</span>
                <span id="ai-chat-status" class="text-[9px] font-bold text-slate-400">Ready</span>
            </div>
        </div>
    </div>
</div>

<!-- 3.5 Modal: Employee Objective Self Evaluation -->
<div id="modal-submit-self-evaluation" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-lg w-full overflow-hidden flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 animate-scaleUp">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3.5">
                <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-base font-bold border border-slate-200/60 shadow-2xs">
                    <i class="fas fa-user-pen"></i>
                </div>
                <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60 px-2 py-0.5 rounded-full">Employee Self Assessment</span>
                    <h3 id="self-eval-modal-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">Self Evaluation: Performance Objective</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-submit-self-evaluation')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <form id="form-submit-self-eval" onsubmit="handleEmployeeSelfEvalSubmit(event)" class="flex flex-col flex-1">
            <input type="hidden" id="self-eval-goal-id" value="">
            <input type="hidden" id="self-eval-emp-id" value="">

            <div class="p-6 space-y-4 text-xs bg-white">
                <!-- Goal Reference Card -->
                <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <div class="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                        <span>ACTIVE PERFORMANCE OBJECTIVE</span>
                        <span id="self-eval-target-metric" class="font-mono text-primary font-bold">CSAT > 90%</span>
                    </div>
                    <h4 id="self-eval-goal-title" class="font-bold text-slate-900 text-xs">Deliver five-star service standard</h4>
                </div>

                <!-- 1-5 Rating Slider -->
                <div class="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                    <div class="flex items-center justify-between">
                        <label class="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                            <i class="fas fa-star text-slate-500"></i>
                            <span>Your Self Evaluation Rating (1.0 – 5.0) *</span>
                        </label>
                        <span id="self-eval-score-preview" class="text-sm font-bold font-mono text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                            ⭐ 1.00 / 5.0
                        </span>
                    </div>
                    <input type="range" id="self-eval-rating-input" min="1.0" max="5.0" step="0.1" value="1.0"
                        oninput="document.getElementById('self-eval-score-preview').textContent = `⭐ ${parseFloat(this.value).toFixed(2)} / 5.0`"
                        class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary">
                    <div class="grid grid-cols-5 gap-1 text-center font-medium text-[9px] text-slate-600">
                        <span class="p-1 rounded bg-white border border-slate-200">1: Below</span>
                        <span class="p-1 rounded bg-white border border-slate-200">2: Dev</span>
                        <span class="p-1 rounded bg-white border border-slate-200">3: Prof</span>
                        <span class="p-1 rounded bg-white border border-slate-200 font-bold text-slate-800">4: Adv</span>
                        <span class="p-1 rounded bg-white border border-slate-200 font-bold text-slate-900">5: Mast</span>
                    </div>
                </div>

                <!-- Self Reflection / Key Achievements Textarea -->
                <div class="space-y-1.5">
                    <label class="font-bold text-slate-700 text-xs flex items-center space-x-1.5">
                        <i class="fas fa-feather-pointed text-slate-500"></i>
                        <span>Self Reflections &amp; Key Achievements *</span>
                    </label>
                    <textarea id="self-eval-notes-input" required rows="3"
                        placeholder="Highlight your key shift deliverables, improvements made, SOP compliance, or areas where you excelled..."
                        class="w-full p-3 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar">Consistently achieved 95%+ shift guest satisfaction, completed all assigned SOP matrices, and supported onboarding team members.</textarea>
                </div>
            </div>

            <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
                <span class="text-[11px] text-slate-500">Recorded directly in calibration record.</span>
                <div class="flex items-center space-x-2">
                    <button type="button" onclick="closeModal('modal-submit-self-evaluation')"
                        class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
                    <button type="submit" id="btn-submit-self-eval"
                        class="btn-primary px-5 py-2 text-xs font-bold shadow-xs">
                        <i class="fas fa-check mr-1.5"></i>
                        <span>Submit Self Evaluation</span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- 4. Modal: Performance Evaluation (Step 4 & 5) -->
<!-- 4. Modal: Formal Multi-Factor Performance Appraisal & Evaluation -->
<div id="modal-self-assessment" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-2xl w-full overflow-hidden max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100">

        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3.5">
                <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-base font-bold border border-slate-200/60 shadow-2xs">
                    <i class="fas fa-star-half-stroke"></i>
                </div>
                <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60 px-2 py-0.5 rounded-full">Phase 4 · Formal Appraisal Evaluation</span>
                    <h3 id="modal-eval-emp-title" class="font-heading font-bold text-lg text-slate-900 mt-0.5">Appraisal Review: Maria Santos</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-self-assessment')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <form id="form-appraisal-evaluation" onsubmit="handleAppraisalSubmit(event)" class="flex flex-col flex-1 overflow-hidden">
            <input type="hidden" id="eval-target-emp-id" value="emp-101">

            <div class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs bg-white flex-1">
                <!-- 1-5 Scale Guide -->
                <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-[10px] text-slate-600">
                    <div class="flex items-center justify-between mb-1.5">
                        <p class="font-bold text-slate-800 text-[11px]">1-5 Rating Scale Guide:</p>
                        <div class="flex items-center space-x-1 font-mono">
                            <span class="text-slate-400">Current Computed:</span>
                            <span id="eval-overall-score-display" class="font-bold text-primary text-xs">4.5 / 5.0 (Advanced)</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-5 gap-1 text-center font-medium">
                        <span class="p-1 rounded bg-white border border-slate-200 text-slate-700">1: Below</span>
                        <span class="p-1 rounded bg-white border border-slate-200 text-slate-700">2: Developing</span>
                        <span class="p-1 rounded bg-white border border-slate-200 text-slate-700">3: Proficient</span>
                        <span class="p-1 rounded bg-white border border-slate-200 font-bold text-slate-800">4: Advanced</span>
                        <span class="p-1 rounded bg-white border border-slate-200 font-bold text-slate-900">5: Master</span>
                    </div>
                </div>

                <!-- Dynamic Objective & Competency Criteria Container -->
                <div id="appraisal-criteria-container" class="space-y-3.5">
                    <!-- Populated dynamically by openAppraisalModal() in performance.js -->
                </div>

                <!-- Evaluator / Supervisor Recommendation & Development Notes -->
                <div class="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                    <label class="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                        <i class="fas fa-comment-dots text-slate-500"></i>
                        <span>Supervisor Appraisal Coaching &amp; Recommendation *</span>
                    </label>
                    <textarea id="eval-supervisor-notes" required rows="2"
                        placeholder="Detail key performance highlights, leadership strengths, promotion aptitude, or specific IDP areas for Q4..."
                        class="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar">Maria continues to demonstrate exceptional hospitality leadership and poise. Highly recommended for Senior Lead track.</textarea>
                </div>
            </div>

            <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
                <div class="text-[11px] text-slate-500 font-medium">
                    <span>Appraisal weights will normalize to 100% calibration.</span>
                </div>
                <div class="flex items-center space-x-2.5">
                    <button type="button" onclick="closeModal('modal-self-assessment')"
                        class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
                    <button type="submit" id="btn-submit-appraisal"
                        class="btn-primary px-5 py-2 text-xs font-bold shadow-xs">
                        <i class="fas fa-check-double mr-1.5"></i>
                        <span>Save &amp; Endorse Appraisal</span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Confirmation Modal: No Monitoring Tasks Logged Before Appraisal -->
<div id="modal-eval-no-tasks-confirm" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 space-y-4 animate-scaleUp">
        <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold mx-auto">
            <i class="fas fa-triangle-exclamation"></i>
        </div>
        <div class="text-center space-y-1.5">
            <h3 class="font-heading font-bold text-base text-slate-900">No Monitoring Tasks Logged</h3>
            <p id="eval-no-tasks-emp-msg" class="text-xs text-slate-500 leading-relaxed">
                This associate does not have any active or completed monitoring action tasks recorded in the database yet for this review cycle.
            </p>
            <p class="text-[11px] text-amber-800 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                Are you sure you want to proceed with a formal supervisor appraisal evaluation?
            </p>
        </div>
        <div class="flex items-center justify-end space-x-2 pt-2">
            <button type="button" onclick="closeModal('modal-eval-no-tasks-confirm')" class="btn-secondary px-4 py-2 text-xs font-bold flex-1">
                Cancel
            </button>
            <button type="button" id="btn-proceed-eval-without-tasks" onclick="proceedToAppraisalModal()" class="btn-primary px-4 py-2 text-xs font-bold bg-primary hover:bg-primary-dark flex-1 shadow-xs">
                Proceed to Evaluate &rarr;
            </button>
        </div>
    </div>
</div>

<!-- 5. Modal: Social Recognition & Kudos (Multi-Select Roster with Search, Filters & Perf Averages) -->
<div id="modal-recognition" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div
        class="modal-card max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100">

        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3.5">
                <div
                    class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-base font-bold border border-slate-200/60 shadow-2xs">
                    <i class="fas fa-trophy text-slate-600"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h3 class="font-heading font-bold text-base text-slate-900">Send Colleague Recognition</h3>
                        <span id="kudos-tier-badge"
                            class="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60 px-2 py-0.5 rounded-full">+50 XP / Person</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">Select colleagues and award deterministic recognition points</p>
                </div>
            </div>
            <button onclick="closeModal('modal-recognition')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs bg-white">

            <!-- Sender Role Tier (Deterministic Point Engine) -->
            <div>
                <label class="block font-bold text-slate-800 text-[11px] mb-1.5">Recognition Tier &amp; Point Value</label>
                <div class="grid grid-cols-3 gap-2">
                    <label class="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-300 bg-slate-50 cursor-pointer transition select-none">
                        <input type="radio" name="kudos_sender_tier" value="Peer" checked onchange="updateKudosXPPreview()" class="accent-primary">
                        <div>
                            <span class="text-xs font-bold text-slate-900 block">Peer Kudos</span>
                            <span class="text-[10px] text-slate-600 font-semibold">+50 XP</span>
                        </div>
                    </label>
                    <label class="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition select-none">
                        <input type="radio" name="kudos_sender_tier" value="Supervisor" onchange="updateKudosXPPreview()" class="accent-primary">
                        <div>
                            <span class="text-xs font-bold text-slate-900 block">Supervisor</span>
                            <span class="text-[10px] text-slate-600 font-semibold">+100 XP</span>
                        </div>
                    </label>
                    <label class="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition select-none">
                        <input type="radio" name="kudos_sender_tier" value="Executive" onchange="updateKudosXPPreview()" class="accent-primary">
                        <div>
                            <span class="text-xs font-bold text-slate-900 block">GM / Exec</span>
                            <span class="text-[10px] text-slate-600 font-semibold">+200 XP</span>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Search & Filter Controls -->
            <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                    <label class="block font-bold text-slate-800 text-[11px]">Select Recipients (<span
                            id="kudos-selected-count" class="text-primary font-extrabold">0</span>
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
                        class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition">
                </div>

                <!-- Department Filter Pills -->
                <div class="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar pb-1 text-[11px]">
                    <button type="button" onclick="setKudosDeptFilter('all')" data-dept="all"
                        class="kudos-dept-pill active px-3 py-1 rounded-full font-bold bg-slate-900 text-white shadow-2xs transition">All Depts</button>
                    <button type="button" onclick="setKudosDeptFilter('front office')" data-dept="front office"
                        class="kudos-dept-pill px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Front Office</button>
                    <button type="button" onclick="setKudosDeptFilter('culinary')" data-dept="culinary"
                        class="kudos-dept-pill px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Culinary</button>
                    <button type="button" onclick="setKudosDeptFilter('f&b service')" data-dept="f&b service"
                        class="kudos-dept-pill px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">F&B Service</button>
                    <button type="button" onclick="setKudosDeptFilter('housekeeping')" data-dept="housekeeping"
                        class="kudos-dept-pill px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Housekeeping</button>
                </div>
            </div>

            <!-- Scrollable Employee Multi-Select Roster -->
            <div id="kudos-employee-roster"
                class="max-h-48 overflow-y-auto custom-scrollbar space-y-1.5 pr-1 border border-slate-200/70 rounded-2xl p-2 bg-slate-50/50">
                <!-- Dynamically rendered list from Supabase -->
            </div>

            <!-- Kudos Core Values / Category -->
            <div>
                <label class="block font-bold text-slate-800 text-[11px] mb-1.5">Recognition Category</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <label
                        class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition">
                        <input type="radio" name="kudos_category" value="guest_service" checked
                            class="accent-primary">
                        <span class="text-[11px] font-semibold text-slate-700 flex items-center space-x-1"><i class="fas fa-star text-amber-500 text-xs"></i> <span>Great Guest Service</span></span>
                    </label>
                    <label
                        class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition">
                        <input type="radio" name="kudos_category" value="collaboration" class="accent-primary">
                        <span class="text-[11px] font-semibold text-slate-700 flex items-center space-x-1"><i class="fas fa-handshake text-indigo-600 text-xs"></i> <span>Team Collaboration</span></span>
                    </label>
                    <label
                        class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition">
                        <input type="radio" name="kudos_category" value="safety_haccp" class="accent-primary">
                        <span class="text-[11px] font-semibold text-slate-700 flex items-center space-x-1"><i class="fas fa-shield-halved text-emerald-600 text-xs"></i> <span>Safety &amp; HACCP</span></span>
                    </label>
                    <label
                        class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition">
                        <input type="radio" name="kudos_category" value="crisis_recovery" class="accent-primary">
                        <span class="text-[11px] font-semibold text-slate-700 flex items-center space-x-1"><i class="fas fa-bolt text-amber-500 text-xs"></i> <span>Crisis Recovery</span></span>
                    </label>
                    <label
                        class="flex items-center space-x-2 p-2 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer transition">
                        <input type="radio" name="kudos_category" value="operational_excellence" class="accent-primary">
                        <span class="text-[11px] font-semibold text-slate-700 flex items-center space-x-1"><i class="fas fa-trophy text-amber-500 text-xs"></i> <span>Operational Excellence</span></span>
                    </label>
                </div>
            </div>

            <!-- Kudos Message -->
            <div>
                <label class="block font-bold text-slate-800 text-[11px] mb-1">Recognition Message / Qualitative Evidence</label>
                <textarea id="shoutout-message" rows="2"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none custom-scrollbar bg-slate-50/50 text-xs font-medium"
                    placeholder="e.g., Outstanding teamwork and calm composure during the peak banquet rush!"></textarea>
            </div>
        </div>

        <!-- Footer -->
        <div
            class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <span id="kudos-awarded-preview"
                class="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg">+0 XP Total</span>
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
    <div class="modal-card max-w-md w-full overflow-hidden flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100">

        <div
            class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div
                    class="w-11 h-11 rounded-full bg-sage-50 text-sage-dark flex items-center justify-center text-lg font-bold border border-sage-100">
                    <i class="fas fa-heart-pulse"></i>
                </div>
                <div>
                    <span class="badge-sage">Live Pulse</span>
                    <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Shift Climate Check</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-sentiment-pulse')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <div class="p-6 space-y-4 bg-white text-xs">
            <p class="text-xs text-slate-600">How is the operational climate and team energy during your shift right now?</p>

            <div class="grid grid-cols-3 gap-3 text-center">
                <button onclick="submitSentimentRating('Positive')"
                    class="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition flex flex-col items-center group shadow-2xs">
                    <i class="fas fa-face-smile text-emerald-500 text-2xl mb-1.5 group-hover:scale-110 transition"></i>
                    <span class="text-xs font-bold text-emerald-700">Smooth</span>
                    <span class="text-[10px] text-slate-400">Great flow (5★)</span>
                </button>
                <button onclick="submitSentimentRating('Neutral')"
                    class="p-4 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition flex flex-col items-center group shadow-2xs">
                    <i class="fas fa-face-meh text-amber-500 text-2xl mb-1.5 group-hover:scale-110 transition"></i>
                    <span class="text-xs font-bold text-amber-700">Manageable</span>
                    <span class="text-[10px] text-slate-400">Busy shift (3★)</span>
                </button>
                <button onclick="submitSentimentRating('Stressful')"
                    class="p-4 rounded-2xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 transition flex flex-col items-center group shadow-2xs">
                    <i class="fas fa-face-frown text-rose-500 text-2xl mb-1.5 group-hover:scale-110 transition"></i>
                    <span class="text-xs font-bold text-rose-600">Friction</span>
                    <span class="text-[10px] text-slate-400">High stress (1★)</span>
                </button>
            </div>

            <div>
                <label class="block font-bold text-slate-800 text-[11px] mb-1">Optional Shift Notes / Bottleneck Details</label>
                <input type="text" id="sentiment-note-input" placeholder="e.g., Heavy luggage rush at front entrance, luggage tags running low" class="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none">
            </div>
        </div>
    </div>
</div>

<!-- Modal: Specific Date / Month Picker for Shift Sentiment -->
<div id="modal-specific-date-filter" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="card-clean max-w-md w-full p-6 space-y-5 bg-white border border-[#E8DEDC] rounded-3xl shadow-2xl relative">
        <div class="flex items-center justify-between border-b border-[#E8DEDC] pb-3.5">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-2xl bg-amber-50 text-primary flex items-center justify-center text-lg font-bold border border-amber-100 shadow-2xs">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900">Select Specific Timeframe</h3>
                    <p class="text-xs text-slate-500">Filter shift sentiment dynamics by exact date or month</p>
                </div>
            </div>
            <button onclick="closeModal('modal-specific-date-filter')" class="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <div class="space-y-4 text-xs">
            <!-- Option 1: Specific Date -->
            <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2">
                <div class="flex items-center justify-between">
                    <label class="font-bold text-slate-800 flex items-center space-x-1.5 text-xs">
                        <i class="fas fa-calendar-day text-primary"></i>
                        <span>Filter by Exact Date</span>
                    </label>
                    <span class="text-[10px] text-slate-400 font-semibold uppercase">Single Day Rush</span>
                </div>
                <input type="date" id="modal-climate-date-picker" onchange="const m = document.getElementById('modal-climate-month-picker'); if (m) m.value = '';" class="w-full text-xs px-3 py-2.5 bg-white border border-[#E8DEDC] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-slate-800 font-medium cursor-pointer shadow-2xs">
            </div>

            <div class="relative flex items-center justify-center">
                <div class="border-t border-[#E8DEDC] w-full"></div>
                <span class="bg-white px-3 text-[10px] uppercase font-extrabold text-slate-400 absolute tracking-wider">OR</span>
            </div>

            <!-- Option 2: Specific Month -->
            <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2">
                <div class="flex items-center justify-between">
                    <label class="font-bold text-slate-800 flex items-center space-x-1.5 text-xs">
                        <i class="fas fa-calendar text-gold-dark"></i>
                        <span>Filter by Entire Month</span>
                    </label>
                    <span class="text-[10px] text-slate-400 font-semibold uppercase">Monthly Climate</span>
                </div>
                <input type="month" id="modal-climate-month-picker" onchange="const d = document.getElementById('modal-climate-date-picker'); if (d) d.value = '';" class="w-full text-xs px-3 py-2.5 bg-white border border-[#E8DEDC] rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-slate-800 font-medium cursor-pointer shadow-2xs">
            </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-[#E8DEDC]">
            <button onclick="clearModalSpecificDate()" type="button" class="btn-secondary px-3.5 py-2 text-xs font-bold text-slate-600">
                <i class="fas fa-rotate-left mr-1"></i> Reset to Today
            </button>
            <div class="flex items-center space-x-2">
                <button onclick="closeModal('modal-specific-date-filter')" type="button" class="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition">
                    Cancel
                </button>
                <button onclick="applyModalSpecificDate()" type="button" class="btn-primary px-4 py-2 text-xs font-bold shadow-sm">
                    <i class="fas fa-check mr-1"></i> Apply Filter
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
                        <span class="badge-sage">Supabase Storage</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">Publish PDF handbooks, SOP guides, or documents directly to Supabase storage bucket</p>
                </div>
            </div>
            <button onclick="closeModal('modal-lms-upload')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Form Content -->
        <form id="form-lms-upload" enctype="multipart/form-data" onsubmit="submitLmsDocUpload(event)" class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs bg-white">

            <!-- File Drag & Drop Zone -->
            <div id="lms-dropzone" onclick="document.getElementById('lms-file-input').click()"
                class="border-2 border-dashed border-sage-light hover:border-sage-dark bg-sage-50/30 hover:bg-sage-50/60 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition group">
                <div class="w-12 h-12 rounded-full bg-sage-100 text-sage-dark flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition shadow-2xs">
                    <i class="fas fa-cloud-arrow-up"></i>
                </div>
                <p class="font-bold text-slate-900 text-xs">Drag &amp; drop document or <span class="text-primary font-bold underline">browse files</span></p>
                <p class="text-[10px] text-slate-400 mt-1">Supports PDF, DOCX, DOC, PPTX, TXT, MP4, and ZIP files</p>
                <p id="lms-file-chosen" class="text-xs font-bold text-sage-dark mt-2 hidden"><i class="fas fa-check-circle mr-1"></i> <span id="lms-file-chosen-name">file.pdf</span></p>
                <input type="file" id="lms-file-input" name="document" onchange="handleLmsFileSelect(this)" class="hidden" accept=".pdf,.docx,.doc,.pptx,.txt,.mp4,.zip" required>
            </div>

            <!-- Metadata Fields -->
            <div class="space-y-3">
                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">Document / Book Title *</label>
                    <input id="lms-doc-title" name="title" type="text" required placeholder="e.g., Executive Suite Turndown & Linen Standard Handbook"
                        class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-800 text-[11px] mb-1">Target Department</label>
                        <select id="lms-doc-dept" name="department_id" class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none">
                            <option value="all">Property-Wide (All Associates)</option>
                            <!-- Dynamically populated from Supabase departments -->
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-slate-800 text-[11px] mb-1">Document Category *</label>
                        <select id="lms-doc-category" name="category" class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none">
                            <option value="SOP Manual">SOP Handbook / Manual</option>
                            <option value="Compliance Standard">Compliance &amp; Hygiene</option>
                            <option value="Masterclass Guide">Masterclass Compendium</option>
                            <option value="Safety Protocol">Safety &amp; Emergency Protocol</option>
                        </select>
                    </div>
                </div>

                <!-- Mandatory SOP Auto-Prescribe Toggle -->
                <div class="p-3 bg-amber-50/70 border border-amber-200/90 rounded-2xl flex items-start space-x-3">
                    <div class="flex items-center h-5 mt-0.5">
                        <input id="lms-doc-mandatory" name="is_mandatory" type="checkbox" value="1"
                            class="w-4 h-4 text-primary bg-white border-slate-300 rounded focus:ring-primary focus:ring-2 cursor-pointer">
                    </div>
                    <label for="lms-doc-mandatory" class="cursor-pointer select-none">
                        <span class="block font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                            <i class="fas fa-shield-halved text-amber-600 text-xs"></i>
                            <span>Mark as Mandatory Training Document</span>
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-200/80 text-amber-900 uppercase tracking-wider">Auto-Prescribe</span>
                        </span>
                        <span class="block text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            If enabled (<strong>True</strong>), this document will be automatically prescribed and enrolled for <strong>all hotel employees</strong> in their training and continuous development roster.
                        </span>
                    </label>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-800 text-[11px] mb-1">Estimated Reading Pages</label>
                        <input id="lms-doc-pages" name="estimated_pages" type="number" min="1" max="500" value="18" placeholder="e.g., 18"
                            class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-800 text-[11px] mb-1">Associate XP Reward</label>
                        <input id="lms-doc-xp" name="exp_reward" type="number" min="10" max="500" value="100"
                            class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] text-slate-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary focus:outline-none">
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">Short Description</label>
                    <textarea id="lms-doc-desc" name="description" rows="2" placeholder="Describe essential procedures, compliance benchmarks, and key check points..."
                        class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar"></textarea>
                </div>

                <div>
                    <label class="block font-bold text-slate-800 text-[11px] mb-1">Key Learning Outcomes</label>
                    <textarea id="lms-doc-outcomes" name="learning_outcomes" rows="2" placeholder="List core competencies and standards associates will master after reading..."
                        class="w-full p-2.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar"></textarea>
                </div>
            </div>
        </form>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-500 font-semibold hidden sm:inline"><i class="fas fa-shield-halved text-sage-dark mr-1"></i> Bucket: "documents"</span>
            <div class="flex items-center space-x-2 ml-auto">
                <button type="button" onclick="closeModal('modal-lms-upload')"
                    class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
                <button type="button" id="btn-submit-lms-upload" onclick="document.getElementById('form-lms-upload').requestSubmit()"
                    class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                    <i class="fas fa-upload mr-1 text-xs"></i>
                    <span>Publish Document to Library</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- 7c. Modal: Interactive 3D Book & Actual SOP Document Reader -->
<div id="modal-book-reader" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-[#FAF8F7] rounded-3xl shadow-2xl border border-[#E8DEDC]">

        <!-- Header -->
        <div class="px-6 py-4 border-b border-[#E8DEDC] flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3 min-w-0">
                <div id="reader-book-icon-badge" class="w-11 h-11 rounded-2xl bg-primary-50 text-primary flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-2xs">
                    <i class="fas fa-book-open"></i>
                </div>
                <div class="min-w-0">
                    <div class="flex items-center space-x-2 flex-wrap">
                        <h3 id="reader-book-title" class="font-heading font-bold text-base text-slate-900 truncate">Hospitality Standard SOP Codex</h3>
                        <span id="reader-book-xp-badge" class="badge-gold text-[10px] font-bold">+100 XP Completion</span>
                        <span id="reader-book-mandatory-badge" class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 hidden"><i class="fas fa-shield-halved mr-1"></i>Mandatory SOP</span>
                    </div>
                    <p id="reader-book-author" class="text-xs text-slate-500 truncate mt-0.5">Oxford Suites Operations Manual · Standard Edition</p>
                </div>
            </div>
            <div class="flex items-center space-x-2 flex-shrink-0">
                <a id="reader-download-btn" href="#" target="_blank" class="btn-secondary px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 hover:bg-slate-100 shadow-2xs">
                    <i class="fas fa-arrow-up-right-from-square text-primary text-xs"></i>
                    <span class="hidden sm:inline">Open / Download File</span>
                </a>
                <button onclick="closeModal('modal-book-reader')"
                    class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        </div>

        <!-- Mode Switcher Tabs (File Viewer vs Structured Procedure Guide) -->
        <div class="px-6 py-2.5 bg-slate-50 border-b border-[#E8DEDC] flex items-center justify-between gap-3 text-xs flex-shrink-0">
            <div class="flex items-center space-x-1.5">
                <button id="tab-btn-reader-viewer" onclick="switchReaderTab('viewer')"
                    class="px-3 py-1.5 rounded-xl font-bold bg-primary text-white shadow-2xs transition text-xs flex items-center space-x-1.5">
                    <i class="fas fa-file-pdf"></i>
                    <span>Document Viewer</span>
                </button>
                <button id="tab-btn-reader-details" onclick="switchReaderTab('details')"
                    class="px-3 py-1.5 rounded-xl font-semibold bg-white text-slate-700 border border-[#E8DEDC] hover:bg-slate-100 transition text-xs flex items-center space-x-1.5">
                    <i class="fas fa-list-check"></i>
                    <span>SOP Specifications &amp; Outcomes</span>
                </button>
            </div>
            <span id="reader-file-info-badge" class="text-[11px] font-mono text-slate-500 truncate hidden sm:inline"></span>
        </div>

        <!-- Book Reading Body -->
        <div class="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#FAF8F7]">
            
            <!-- 1. Actual Document Embedded Viewer Panel -->
            <div id="reader-panel-viewer" class="space-y-3">
                <div id="reader-iframe-container" class="w-full bg-white rounded-2xl border border-[#E8DEDC] p-2 shadow-2xs overflow-hidden min-h-[480px] flex items-center justify-center">
                    <!-- Dynamic iframe / document object inserted here -->
                </div>
            </div>

            <!-- 2. Structured SOP Procedure Guide & Outcomes Panel -->
            <div id="reader-panel-details" class="space-y-4 hidden">
                <div class="bg-white rounded-2xl border border-[#E8DEDC] p-6 sm:p-8 space-y-6">
                    <!-- Top Operational Highlight -->
                    <div class="p-4 bg-gold-50/70 rounded-2xl border border-gold-200/80 space-y-1.5">
                        <div class="flex items-center justify-between">
                            <p class="font-bold text-gold-dark text-xs uppercase tracking-wider flex items-center">
                                <i class="fas fa-lightbulb text-gold-dark mr-1.5"></i> Quality &amp; Compliance Benchmark
                            </p>
                            <span class="badge-sage text-[10px]">Active Standard</span>
                        </div>
                        <p id="reader-tip-text" class="text-xs text-slate-700 leading-relaxed font-medium">Always maintain 5-star standard compliance across all touchpoints.</p>
                    </div>

                    <!-- Dual Grid Description & Outcomes -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        <!-- Left Page: Overview & Description -->
                        <div class="space-y-3 md:border-r md:border-[#E8DEDC] md:pr-6">
                            <div class="border-b border-slate-100 pb-2">
                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SECTION 1</span>
                                <h4 class="font-heading font-bold text-sm text-slate-900 mt-0.5">Operational Overview &amp; Procedures</h4>
                            </div>
                            <div id="reader-full-description" class="p-3.5 bg-[#FAF8F7] rounded-xl border border-slate-200/70 text-slate-700 leading-relaxed space-y-2">
                                <!-- Dynamic Description -->
                            </div>
                        </div>

                        <!-- Right Page: Key Learning Outcomes & Competencies -->
                        <div class="space-y-3">
                            <div class="border-b border-slate-100 pb-2">
                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SECTION 2</span>
                                <h4 class="font-heading font-bold text-sm text-slate-900 mt-0.5">Learning Outcomes &amp; Core Standards</h4>
                            </div>
                            <div id="reader-full-outcomes" class="p-3.5 bg-[#FAF8F7] rounded-xl border border-slate-200/70 text-slate-700 leading-relaxed space-y-2">
                                <!-- Dynamic Outcomes -->
                            </div>
                        </div>
                    </div>

                    <!-- Document Metadata Specification Box -->
                    <div class="pt-4 border-t border-[#E8DEDC] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                            <span class="text-[10px] font-bold text-slate-400 uppercase block">Category</span>
                            <span id="reader-spec-category" class="font-bold text-slate-900 text-xs">SOP Manual</span>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                            <span class="text-[10px] font-bold text-slate-400 uppercase block">Target Department</span>
                            <span id="reader-spec-dept" class="font-bold text-slate-900 text-xs">Property-Wide</span>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                            <span class="text-[10px] font-bold text-slate-400 uppercase block">Reading Scope</span>
                            <span id="reader-spec-reading" class="font-bold text-slate-900 text-xs">18 Pages · 20 min</span>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                            <span class="text-[10px] font-bold text-slate-400 uppercase block">XP Award</span>
                            <span id="reader-spec-xp" class="font-bold text-gold-dark text-xs">+100 XP</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Reader Controls -->
        <div class="p-4 sm:px-6 border-t border-[#E8DEDC] bg-white flex items-center justify-between flex-shrink-0 text-xs">
            <span class="text-slate-500 font-semibold hidden sm:inline"><i class="fas fa-book-bookmark text-gold-dark mr-1.5"></i> Interactive Digital LMS Handbook Reader</span>
            <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button onclick="closeModal('modal-book-reader')"
                    class="btn-secondary px-4 py-2 text-xs font-semibold">Close Reader</button>
                <button id="reader-quiz-btn" onclick="launchQuizFromReader()"
                    class="btn-primary px-5 py-2 font-bold flex items-center space-x-1.5 shadow-2xs">
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

<!-- 7d-2. Modal: Need Training → Assign Formal Curriculum (Stage 7 IDP Remediation) -->
<div id="modal-formal-curriculum" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100">

        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/70 via-white to-amber-50/40 flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-lg font-bold border border-rose-200 shadow-2xs">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h3 class="font-heading font-bold text-base text-slate-900">Mandatory Formal Training Curriculum</h3>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Stage 7 IDP Remediation</span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">Assign comprehensive Training Programs from database to close critical performance deficits</p>
                </div>
            </div>
            <button onclick="closeModal('modal-formal-curriculum')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-xs bg-white">
            <!-- Target Associate Banner -->
            <div class="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-1">
                    <span class="text-[10px] font-bold text-rose-800 uppercase tracking-wide flex items-center">
                        <i class="fas fa-user-graduate text-rose-600 mr-1.5"></i> Associate Requiring Formal Training
                    </span>
                    <p id="formal-curriculum-emp-name" class="font-bold text-slate-900 text-sm">Lucas Vargas · Junior Host (Front Office)</p>
                    <p id="formal-curriculum-goal-title" class="text-slate-600 text-xs">Active Goal: Elevate Front Desk Check-in Efficiency</p>
                </div>
                <div class="text-right sm:self-center">
                    <span class="px-3 py-1 bg-rose-100 text-rose-800 font-bold rounded-xl text-xs border border-rose-300">
                        Needs Training: True
                    </span>
                </div>
            </div>

            <!-- List of Programs from training_programs Table -->
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <h4 class="font-heading font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                        <i class="fas fa-chalkboard-user text-rose-600"></i>
                        <span>Available Formal Training Programs (Supabase Database)</span>
                    </h4>
                    <span class="text-[11px] text-slate-400">Click to enroll into training_needs</span>
                </div>

                <div id="formal-programs-list" class="space-y-3">
                    <div class="p-8 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-slate-200">
                        <i class="fas fa-spinner fa-spin text-lg mb-2 block text-rose-500"></i>
                        Loading training programs from database...
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-500 font-semibold">
                <i class="fas fa-database text-rose-600 mr-1"></i> Auto-enrolled in <code>training_needs</code> with <code>target_goal_id</code>
            </span>
            <button onclick="closeModal('modal-formal-curriculum')"
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
                        <option value="Certified" selected>Passed &amp; Certified</option>
                        <option value="Retake Required">Retake Required</option>
                        <option value="In Progress">In Progress</option>
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

<!-- 7f. Modal: Phase 7 Final 1-on-1 Evaluation (Last Attempt / Retry #4) -->
<div id="modal-phase7-final-eval" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-100">

        <!-- Header -->
        <div class="px-6 py-5 border-b border-rose-100 bg-gradient-to-r from-rose-50/70 via-white to-amber-50/40 flex items-center justify-between flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-lg font-bold shadow-2xs">
                    <i class="fas fa-gavel"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h3 class="font-heading font-bold text-base text-rose-950">Phase 7 · Final 1-on-1 Evaluation</h3>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-200 text-rose-900 border border-rose-300">
                            Final Attempt #4
                        </span>
                    </div>
                    <p class="text-xs text-rose-800/80 mt-0.5">Definitive supervisor assessment following mandatory 1-on-1 mentorship &amp; formal curriculum</p>
                </div>
            </div>
            <button onclick="closeModal('modal-phase7-final-eval')"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Form Body -->
        <form id="form-phase7-final-eval" onsubmit="handlePhase7FinalEvalSubmit(event)" class="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-xs bg-white">
            <input type="hidden" id="phase7-eval-emp-id" value="">
            <input type="hidden" id="phase7-eval-goal-id" value="">

            <!-- Employee Info Banner -->
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center space-x-3">
                    <div id="phase7-eval-avatar" class="w-10 h-10 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-xs">
                        MS
                    </div>
                    <div>
                        <h4 id="phase7-eval-name" class="font-bold text-slate-900 text-sm">Maria Santos</h4>
                        <p id="phase7-eval-role-dept" class="text-[11px] text-slate-500">Front Desk Host · Front Office</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-[10px] text-slate-400 uppercase font-bold block">Passing Standard</span>
                    <span class="text-xs font-bold text-emerald-700 font-mono">⭐ 3.00 / 5.00</span>
                </div>
            </div>

            <!-- Notice Callout -->
            <div class="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-2.5 text-amber-900 text-xs">
                <i class="fas fa-triangle-exclamation text-amber-600 mt-0.5 text-sm flex-shrink-0"></i>
                <div>
                    <p class="font-bold">Final Evaluation Threshold Notice</p>
                    <p class="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                        This is the associate's 4th and final evaluation attempt. If the final score remains below <strong>3.00</strong>, the performance goal status will permanently transition to <strong>Failed</strong> upon your confirmation.
                    </p>
                </div>
            </div>

            <!-- Scorecard Inputs -->
            <div class="space-y-3.5">
                <h5 class="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                    <i class="fas fa-list-check text-rose-600"></i>
                    <span>Evaluation Scorecard (1.0 - 5.0 Scale)</span>
                </h5>

                <div id="phase7-criteria-container" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <!-- Dynamically populated from employee's goals + 1-on-1 Mentorship Integration -->
                </div>
            </div>

            <!-- Calculated Score Banner -->
            <div class="p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-2 transition-all" id="phase7-calc-banner">
                <div>
                    <span class="text-[10px] uppercase font-bold text-slate-500 block">Overall Computed Final Score</span>
                    <span id="phase7-calc-verdict" class="text-xs font-bold text-rose-800">Below Standard (&lt; 3.00) &bull; Subject to Goal Failure</span>
                </div>
                <div class="text-2xl font-mono font-bold text-rose-700" id="phase7-calc-score-display">
                    ⭐ 2.50 / 5.00
                </div>
            </div>

            <!-- Notes & Remarks -->
            <div class="space-y-1.5">
                <label class="font-bold text-slate-900 block text-xs">Supervisor Final Review Notes &amp; Recommendation *</label>
                <textarea id="phase7-eval-notes" rows="3" required placeholder="Detail the outcome of the 1-on-1 coaching, practical shifts observed, and justification for this final score..." class="w-full p-3 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition"></textarea>
            </div>

            <!-- Footer Action Buttons -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button type="button" onclick="closeModal('modal-phase7-final-eval')" class="btn-secondary px-4 py-2 text-xs font-semibold">
                    Cancel
                </button>
                <button type="submit" id="btn-submit-phase7-final-eval" class="btn-primary px-6 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center space-x-1.5 shadow-xs">
                    <i class="fas fa-check-double text-xs"></i>
                    <span>Submit Final Evaluation</span>
                </button>
            </div>
        </form>
    </div>
</div>

<!-- 7g. Modal: Confirm Goal Failure Double-Check -->
<div id="modal-confirm-goal-failure" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-md w-full overflow-hidden flex flex-col bg-white rounded-3xl shadow-2xl border-2 border-rose-300">
        <div class="p-6 text-center space-y-4">
            <div class="w-14 h-14 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-2xl font-bold mx-auto border border-rose-200">
                <i class="fas fa-ban"></i>
            </div>
            <div>
                <h3 class="font-heading font-bold text-lg text-rose-950">Confirm Performance Goal Failure</h3>
                <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                    The associate has completed all 4 remediation attempts and formal 1-on-1 mentorship. The final score is <strong id="confirm-fail-score" class="text-rose-700 font-mono">2.50 / 5.00</strong> (below 3.00 standard).
                </p>
            </div>

            <div class="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-left text-xs text-rose-900 space-y-1">
                <p class="font-bold flex items-center"><i class="fas fa-circle-exclamation mr-1.5 text-rose-600"></i> Permanent Status Update:</p>
                <p class="text-[11px] text-rose-800">
                    Marking this goal as <strong>Failed</strong> permanently concludes this review cycle. All phases will be finalized with a Failed record.
                </p>
            </div>

            <div class="pt-2 flex items-center justify-center space-x-3">
                <button type="button" onclick="closeModal('modal-confirm-goal-failure')" class="btn-secondary px-5 py-2.5 text-xs font-semibold">
                    Cancel Review
                </button>
                <button type="button" id="btn-confirm-mark-failed" onclick="executeConfirmGoalFailure()" class="btn-primary px-6 py-2.5 text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white shadow-xs flex items-center space-x-1.5">
                    <i class="fas fa-circle-xmark text-xs"></i>
                    <span>Confirm & Mark as Failed</span>
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

            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 space-y-1">
                <p class="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                    <i class="fas fa-lightbulb text-amber-500"></i>
                    <span>What is a "Host"?</span>
                </p>
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
            <input type="hidden" id="assess-modal-emp-id" value="">
            <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] text-[11px] text-slate-600">
                <i class="fas fa-info-circle text-primary mr-1"></i>
                Rate each applicable competency dimension based on observable behaviors during the review period (Scale: 1 = Needs Significant Improvement to 5 = Outstanding).
            </div>

            <!-- Dynamic Fields Container -->
            <div id="assess-modal-fields" class="space-y-4">
                <!-- Populated dynamically by launchAssessmentModalFor() -->
            </div>

            <div class="space-y-1 pt-2">
                <label class="block font-bold text-slate-800 text-[11px]">Calibrated Assessor Notes &amp; Coaching Recommendations</label>
                <textarea id="assess-modal-notes" rows="2" class="w-full p-3 rounded-xl border border-[#E8DEDC] focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-[#FAF8F7]" placeholder="Detail key developmental strengths and coaching priorities..."></textarea>
            </div>
        </form>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-400 font-medium hidden sm:inline"><i class="fas fa-shield text-slate-300 mr-1"></i> Official Supabase DB Record</span>
            <div class="flex items-center space-x-2.5 ml-auto">
                <button type="button" onclick="closeModal('modal-conduct-assessment')" class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
                <button type="button" id="btn-submit-assessment" onclick="document.getElementById('form-conduct-assessment').requestSubmit()" class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                    <i class="fas fa-check text-[10px]"></i>
                    <span>Lock &amp; Save Assessment</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Modal: Add New Competency (Supabase SQL) -->
<div id="modal-add-competency" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-full bg-primary-50 text-primary flex items-center justify-center text-lg font-bold border border-primary-100">
                    <i class="fas fa-layer-group"></i>
                </div>
                <div>
                    <span class="badge-primary">Competency Catalog</span>
                    <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Define New Competency</h3>
                </div>
            </div>
            <button onclick="closeModal('modal-add-competency')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <form id="form-add-competency" onsubmit="handleAddCompetencySubmit(event)" class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs bg-white flex-1">
            <div class="space-y-1">
                <label class="block font-bold text-slate-800 text-[11px]">Competency Name *</label>
                <input type="text" id="comp-add-name" required class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEDC] focus:ring-2 focus:ring-primary focus:outline-none bg-[#FAF8F7]" placeholder="e.g. VIP Protocol, Room Inspection, POS Operation" oninput="autoGenerateCompKey(this.value)">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Key / Identifier</label>
                    <input type="text" id="comp-add-key" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] font-mono text-slate-700 uppercase bg-[#FAF8F7]" placeholder="AUTO_GENERATED">
                </div>
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Category *</label>
                    <select id="comp-add-category" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] font-semibold text-slate-800 bg-[#FAF8F7]">
                        <option value="Core Hospitality">Core Hospitality</option>
                        <option value="Technical Systems">Technical Systems</option>
                        <option value="Compliance & Safety">Compliance &amp; Safety</option>
                        <option value="Guest Relations">Guest Relations</option>
                        <option value="Operational Mastery">Operational Mastery</option>
                        <option value="Culinary Operations">Culinary Operations</option>
                        <option value="Leadership & Strategy">Leadership &amp; Strategy</option>
                    </select>
                </div>
            </div>

            <div class="space-y-1">
                <label class="block font-bold text-slate-800 text-[11px]">Scope *</label>
                <div class="grid grid-cols-2 gap-2">
                    <label class="flex items-center space-x-2 p-2.5 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] cursor-pointer hover:bg-slate-100 transition">
                        <input type="radio" name="comp-scope" value="General" checked onchange="handleScopeChange('General')" class="text-primary focus:ring-primary">
                        <div>
                            <span class="font-bold text-slate-900 block text-xs">General</span>
                            <span class="text-[10px] text-slate-500 block">Applies to all departments</span>
                        </div>
                    </label>
                    <label class="flex items-center space-x-2 p-2.5 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] cursor-pointer hover:bg-slate-100 transition">
                        <input type="radio" name="comp-scope" value="Specific" onchange="handleScopeChange('Specific')" class="text-primary focus:ring-primary">
                        <div>
                            <span class="font-bold text-slate-900 block text-xs">Specific</span>
                            <span class="text-[10px] text-slate-500 block">Dept &amp; position specific</span>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Specific Dept & Position Fields (Shown only if Specific) -->
            <div id="comp-specific-fields" class="space-y-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 hidden">
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Department *</label>
                    <select id="comp-add-dept" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] font-semibold text-slate-800 bg-white">
                        <!-- Dynamically populated from Supabase departments -->
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Position / Role (Optional)</label>
                    <input type="text" id="comp-add-pos" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-white text-xs" placeholder="e.g. Front Desk Host, Room Attendant, Server, Kitchen Staff (leave blank for all dept roles)">
                    <span class="text-[10px] text-slate-500 italic block">Leave blank if this competency applies to all positions in the selected department.</span>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Target Benchmark Rating (1.0 - 5.0)</label>
                    <input type="number" id="comp-add-benchmark" step="0.1" min="1.0" max="5.0" value="4.5" required class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] font-bold text-primary bg-[#FAF8F7]">
                </div>
                <div class="space-y-1">
                    <label class="block font-bold text-slate-800 text-[11px]">Maximum Score Scale</label>
                    <input type="number" id="comp-add-max" step="0.1" min="1.0" max="5.0" value="5.0" required class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] font-bold text-slate-800 bg-[#FAF8F7]">
                </div>
            </div>

            <div class="space-y-1">
                <label class="block font-bold text-slate-800 text-[11px]">Description &amp; Observable Behavioral Rubric</label>
                <textarea id="comp-add-desc" rows="3" class="w-full p-3 rounded-xl border border-[#E8DEDC] focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-[#FAF8F7]" placeholder="Define observable behavioral expectations and operational standard requirements..."></textarea>
            </div>
        </form>

        <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end space-x-2.5 flex-shrink-0">
            <button type="button" onclick="closeModal('modal-add-competency')" class="btn-secondary px-4 py-2 text-xs font-semibold">Cancel</button>
            <button type="button" id="btn-submit-add-competency" onclick="document.getElementById('form-add-competency').requestSubmit()" class="btn-primary px-5 py-2 text-xs font-bold shadow-2xs flex items-center space-x-1.5">
                <i class="fas fa-save text-[10px]"></i>
                <span>Save Competency to Database</span>
            </button>
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
                    <div class="p-3.5 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2.5">
                        <div class="flex items-center justify-between">
                            <span class="block text-[11px] font-bold text-slate-700 uppercase">Enrolled Participants (Auto-populated from Need Gaps)</span>
                            <span id="sched-modal-roster-count" class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">0 Selected</span>
                        </div>
                        <div id="sched-modal-roster-container" class="space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar pr-1">
                            <!-- Populated dynamically by openScheduleModal() in js/training.js -->
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
                            <p id="eval-modal-subtitle" class="text-slate-500 text-[11px]">Associate Evaluation</p>
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
                                <span>Part A: Practical Knowledge Assessment (5 Questions · 20 Points Each)</span>
                            </h4>
                            <span class="badge-sage text-[10px]">Evaluation Form</span>
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
                                <span id="milestone-progress-val" class="font-bold font-mono text-emerald-700 text-xs">0%</span>
                            </div>
                            <input id="milestone-progress-range" type="range" min="0" max="100" step="5" value="0" oninput="document.getElementById('milestone-progress-val').textContent = this.value + '%'" class="w-full accent-primary mt-2 cursor-pointer">
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
                        <button type="submit" class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                            <i class="fas fa-check-circle"></i>
                            <span>Save Feedback &amp; Complete</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- MODAL: 1-ON-1 CALIBRATION & FORMAL REVIEW SIGN-OFF       -->
        <!-- ======================================================== -->
        <div id="modal-1on1-calibration" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8DEDC] overflow-hidden transform transition-all animate-scaleUp">
                
                <!-- Modal Header -->
                <div class="p-6 border-b border-[#E8DEDC] flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/40">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-base shadow-2xs">
                            <i class="fas fa-sliders"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Phase 5: Calibration</span>
                                <span class="text-xs text-slate-400 font-medium">1-on-1 Normalization</span>
                            </div>
                            <h3 id="modal-calib-emp-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">1-on-1 Performance Calibration</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-1on1-calibration')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <!-- Calibration Form -->
                <form id="form-1on1-calibration" onsubmit="handleCalibrationSubmit(event)" class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs">
                    <input type="hidden" id="calib-target-emp-id" value="emp-101">

                    <!-- Employee Summary Card -->
                    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div class="flex items-center space-x-3">
                            <div id="calib-emp-avatar" class="w-10 h-10 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-2xs flex-shrink-0">
                                MS
                            </div>
                            <div>
                                <p id="calib-emp-name" class="font-bold text-slate-900 text-sm leading-tight">Maria Santos</p>
                                <p id="calib-emp-role" class="text-[11px] text-slate-500">Front Desk Host · Front Office</p>
                            </div>
                        </div>
                        <div class="text-left sm:text-right">
                            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Appraisal Rating</span>
                            <span id="calib-raw-supervisor-score" class="text-xs font-bold text-purple-700 font-mono">⭐ 4.60 / 5.0 (Master Tier)</span>
                        </div>
                    </div>

                    <!-- Calibrated Score Slider & Number Input -->
                    <div class="p-4 bg-purple-50/30 rounded-2xl border border-purple-200 space-y-3">
                        <div class="flex justify-between items-center">
                            <label class="font-bold text-slate-900 text-xs">1. Normalized Calibrated Score (1.00 – 5.00) *</label>
                            <span id="calib-computed-score-display" class="font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                4.55 / 5.0 (Master Tier)
                            </span>
                        </div>
                        <input id="calib-score-slider" type="range" min="1.0" max="5.0" step="0.05" value="4.55" oninput="onCalibrationScoreInput(this.value)" class="w-full accent-indigo-600 cursor-pointer">
                        <div class="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>1.0 (Critical Support)</span>
                            <span>3.0 (Proficient Benchmark)</span>
                            <span>5.0 (Exceptional / Master)</span>
                        </div>
                    </div>

                    <!-- Tier Classification & Department Normalization -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">2. Calibrated Performance Tier</label>
                        <select id="calib-tier-select" onchange="onCalibrationTierSelect(this.value)" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                            <option value="Master Tier">Master Tier (4.50 – 5.00 Exceeds All Expectations)</option>
                            <option value="Advanced Tier">Advanced Tier (3.50 – 4.49 Highly Proficient)</option>
                            <option value="Proficient">Proficient Tier (3.00 – 3.49 Meets All Standards)</option>
                            <option value="Developing (Needs PIP)">Developing (Below 3.00 Benchmark · Action Plan Required)</option>
                        </select>
                    </div>

                    <!-- 1-on-1 Discussion Minutes & Agreed Growth Actions -->
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px] flex items-center space-x-1.5">
                            <i class="fas fa-comments text-indigo-600"></i>
                            <span>3. 1-on-1 Discussion Minutes &amp; Agreed Commitments *</span>
                        </label>
                        <textarea id="calib-discussion-minutes" required rows="3" placeholder="Summarize key dialogue during the 1-on-1 review session, agreed key strengths, and specific areas for capability growth in the upcoming cycle..." class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none custom-scrollbar bg-white"></textarea>
                    </div>

                    <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button type="button" onclick="closeModal('modal-1on1-calibration')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                        <button type="submit" id="btn-submit-calibration" class="btn-primary px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 border-indigo-600 shadow-xs">
                            <i class="fas fa-lock mr-1.5"></i> Lock &amp; Save Calibration to Database
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- MODAL: 1-ON-1 DISCUSSION MINUTES VIEWER MODAL            -->
        <!-- ======================================================== -->
        <div id="modal-1on1-minutes-viewer" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8DEDC] overflow-hidden transform transition-all animate-scaleUp">
                
                <div class="p-6 border-b border-[#E8DEDC] flex items-center justify-between bg-gradient-to-r from-indigo-50/60 via-white to-purple-50/40">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base shadow-2xs">
                            <i class="fas fa-file-lines"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Stage 5 Record</span>
                                <span id="minutes-modal-cycle" class="text-xs text-slate-400 font-medium">Review Cycle 2026-Q3</span>
                            </div>
                            <h3 id="minutes-modal-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">1-on-1 Discussion Minutes</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-1on1-minutes-viewer')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs">
                    <!-- Associate & Score Summary Card -->
                    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div class="flex items-center space-x-3">
                            <div id="minutes-modal-avatar" class="w-10 h-10 rounded-full bg-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-2xs flex-shrink-0">
                                MS
                            </div>
                            <div>
                                <p id="minutes-modal-emp-name" class="font-bold text-slate-900 text-sm leading-tight">Maria Santos</p>
                                <p id="minutes-modal-emp-role" class="text-[11px] text-slate-500">Front Desk Host · Front Office</p>
                            </div>
                        </div>
                        <div class="text-left sm:text-right">
                            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Calibrated Score</span>
                            <span id="minutes-modal-score" class="text-sm font-bold text-indigo-700 font-mono">⭐ 4.55 / 5.0 (Master Tier)</span>
                        </div>
                    </div>

                    <!-- Minutes Content -->
                    <div class="space-y-1.5">
                        <label class="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                            <i class="fas fa-comments text-indigo-600"></i>
                            <span>Recorded 1-on-1 Discussion Minutes &amp; Action Items</span>
                        </label>
                        <div id="minutes-modal-body" class="p-4 bg-white rounded-2xl border border-slate-200 text-slate-700 leading-relaxed text-xs max-h-56 overflow-y-auto custom-scrollbar shadow-2xs">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button type="button" onclick="closeModal('modal-1on1-minutes-viewer')" class="btn-secondary px-4 py-2 text-xs font-bold">Close</button>
                    <button id="minutes-modal-btn-calibrate" onclick="closeModal('modal-1on1-minutes-viewer'); open1on1CalibrationModal(window.selectedEvalEmpId || 'emp-101');" class="btn-primary px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 border-indigo-600 shadow-xs flex items-center space-x-1.5">
                        <i class="fas fa-sliders"></i>
                        <span>Edit / Calibrate 1-on-1</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- MODAL: PERFORMANCE IMPROVEMENT PLAN (PIP) (< 3.0)        -->
        <!-- ======================================================== -->
        <div id="modal-pip-action" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-rose-200 overflow-hidden transform transition-all animate-scaleUp">
                
                <div class="p-6 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50 via-white to-amber-50">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-base shadow-2xs">
                            <i class="fas fa-triangle-exclamation"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Mandatory Action Plan</span>
                                <span class="text-xs text-slate-400 font-medium">Rating Below 3.0</span>
                            </div>
                            <h3 id="pip-modal-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">Performance Improvement Plan (PIP)</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-pip-action')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <form id="form-pip-action" onsubmit="handlePIPSubmit(event)" class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs">
                    <input type="hidden" id="pip-target-emp-id" value="">

                    <div class="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-1.5">
                        <p class="font-bold text-rose-950 text-xs">Structured 30-60-90 Day Corrective Protocol</p>
                        <p class="text-[11px] text-rose-800 leading-relaxed">The associate's appraisal score is below the required 3.0 benchmark. Define measurable remediation goals, coaching milestones, and evaluation check-in cadences.</p>
                    </div>

                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">1. Specific Deficiencies &amp; Gaps Identified *</label>
                        <textarea id="pip-deficiencies" required rows="2" placeholder="Detail specific performance standards or task metrics not met during the evaluation cycle..." class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none custom-scrollbar bg-white"></textarea>
                    </div>

                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">2. Required Actionable Deliverables &amp; Milestones *</label>
                        <textarea id="pip-milestones" required rows="2" placeholder="List mandatory coaching sessions, daily check-ins, or LMS remedial certifications required to reach >= 3.0 standard..." class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none custom-scrollbar bg-white"></textarea>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="font-bold text-slate-800 text-[11px]">3. PIP Review Duration</label>
                            <select id="pip-duration" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white">
                                <option value="30 Days">30-Day Intensive Review</option>
                                <option value="60 Days" selected>60-Day Standard PIP</option>
                                <option value="90 Days">90-Day Extended Remediation</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="font-bold text-slate-800 text-[11px]">4. Assigned Mentor / Supervisor</label>
                            <input type="text" id="pip-mentor" value="Marco Rossi (Supervisor)" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white">
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button type="button" onclick="closeModal('modal-pip-action')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                        <button type="submit" id="btn-submit-pip" class="btn-primary px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 border-rose-600 shadow-xs flex items-center space-x-1.5">
                            <i class="fas fa-file-signature"></i>
                            <span>Lock &amp; Issue PIP Notice &rarr;</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- MODAL: VIEW IDP / PIP DEVELOPMENT PLAN MODAL             -->
        <!-- ======================================================== -->
        <div id="modal-view-idp-plan" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scaleUp">
                
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 via-white to-indigo-50/40">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base shadow-2xs">
                            <i class="fas fa-file-invoice"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Stage 6 Document</span>
                                <span id="modal-idp-plan-status-pill" class="text-xs text-slate-400 font-medium">Active Development Plan</span>
                            </div>
                            <h3 id="modal-idp-plan-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">Individual Development Plan (IDP)</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-view-idp-plan')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 text-xs">
                    <!-- Associate & Score Summary Header -->
                    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div class="flex items-center space-x-3">
                            <div id="modal-idp-emp-avatar" class="w-10 h-10 rounded-full bg-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-2xs flex-shrink-0">
                                EM
                            </div>
                            <div>
                                <p id="modal-idp-emp-name" class="font-bold text-slate-900 text-sm leading-tight">Employee Name</p>
                                <p id="modal-idp-emp-role" class="text-[11px] text-slate-500">Position · Department</p>
                            </div>
                        </div>
                        <div class="text-left sm:text-right">
                            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Performance Rating</span>
                            <span id="modal-idp-emp-rating" class="text-sm font-bold text-indigo-700 font-mono">⭐ 4.50 / 5.0</span>
                        </div>
                    </div>

                    <!-- Strengths & Gaps Columns -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                            <span class="font-bold text-emerald-950 text-xs flex items-center">
                                <i class="fas fa-award mr-1.5 text-emerald-600"></i> Identified Strengths
                            </span>
                            <ul id="modal-idp-strengths-list" class="space-y-1.5 text-slate-700">
                                <!-- Populated dynamically -->
                            </ul>
                        </div>
                        <div class="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
                            <span class="font-bold text-amber-950 text-xs flex items-center">
                                <i class="fas fa-triangle-exclamation mr-1.5 text-amber-600"></i> Development Gaps (&lt; 3.0)
                            </span>
                            <ul id="modal-idp-gaps-list" class="space-y-1.5 text-slate-700">
                                <!-- Populated dynamically -->
                            </ul>
                        </div>
                    </div>

                    <!-- 70-20-10 Learning Commitments & Tasks -->
                    <div class="space-y-2.5">
                        <div class="flex items-center justify-between">
                            <h4 class="font-heading font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                                <i class="fas fa-list-check text-indigo-600"></i>
                                <span>70-20-10 Learning Commitments &amp; Concrete Tasks</span>
                            </h4>
                            <button onclick="closeModal('modal-view-idp-plan'); openAddSpecificTaskModal(window.selectedEvalEmpId || 'emp-101')" class="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center space-x-1">
                                <i class="fas fa-plus"></i>
                                <span>Add Specific Task</span>
                            </button>
                        </div>
                        <div id="modal-idp-commitments-list" class="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button type="button" onclick="closeModal('modal-view-idp-plan')" class="btn-secondary px-4 py-2 text-xs font-bold">Close</button>
                    <div class="flex items-center space-x-2">
                        <button onclick="closeModal('modal-view-idp-plan'); openRemedialBooksModal(window.selectedEvalEmpId || 'emp-101')" class="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-1.5">
                            <i class="fas fa-book-medical"></i>
                            <span>Prescribe LMS Books</span>
                        </button>
                        <button onclick="closeModal('modal-view-idp-plan'); switchSubTab('perf', 'idp'); showIDPDetail(window.selectedEvalEmpId || 'emp-101')" class="btn-primary px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 border-indigo-600 shadow-xs flex items-center space-x-1.5">
                            <span>Open Stage 6 Workspace &rarr;</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- MODAL: ADD SPECIFIC TASK TO GOAL                         -->
        <!-- ======================================================== -->
        <div id="modal-add-specific-task" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scaleUp">
                
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 via-white to-indigo-50">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shadow-2xs">
                            <i class="fas fa-plus"></i>
                        </div>
                        <div>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Action Plan Task</span>
                            <h3 id="modal-add-task-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">Add Specific Goal Task</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-add-specific-task')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <form id="form-add-specific-task" onsubmit="handleCreateSpecificTaskSubmit(event)" class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs">
                    <input type="hidden" id="add-task-target-emp-id" value="emp-101">
                    <input type="hidden" id="add-task-target-goal-id" value="">

                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">Select Active Goal *</label>
                        <select id="add-task-goal-select" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                            <!-- Populated dynamically -->
                        </select>
                    </div>

                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">Specific Task Title *</label>
                        <input type="text" id="add-task-title" required placeholder="e.g. Shadow Senior Front Desk Supervisor on VIP Arrivals" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                    </div>

                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">Target Completion Date *</label>
                        <input type="date" id="add-task-target-date" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                    </div>

                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">Task Instructions &amp; Success Metric</label>
                        <textarea id="add-task-description" rows="2" placeholder="Detail specific standards, SOP checklists, or supervisor observation criteria..." class="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar bg-white"></textarea>
                    </div>

                    <div class="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                        <button type="button" onclick="closeModal('modal-add-specific-task')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                        <button type="submit" id="btn-submit-specific-task" class="btn-primary px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-xs flex items-center space-x-1.5">
                            <i class="fas fa-check"></i>
                            <span>Save Task to Database</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- MODAL: REVIEW PLAN & TASKS (STAGE 7 RETRY / RESET)       -->
        <!-- ======================================================== -->
        <div id="modal-review-tasks" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scaleUp">
                
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 via-white to-blue-50">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base shadow-2xs">
                            <i class="fas fa-list-check"></i>
                        </div>
                        <div>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Stage 7 Review</span>
                            <h3 id="modal-review-tasks-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">Review Plan &amp; Tasks for Re-Execution</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-review-tasks')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs">
                    <div class="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
                        <div class="space-y-0.5">
                            <p class="font-bold text-amber-950 text-xs">Remediation Task Re-do Protocol</p>
                            <p class="text-[11px] text-amber-800">Review all action tasks. You can reset completed tasks back to pending for re-execution or delete obsolete tasks before returning to Continuous Monitoring.</p>
                        </div>
                        <button onclick="openAddSpecificTaskModal(window.selectedEvalEmpId || 'emp-101')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs flex-shrink-0 transition flex items-center space-x-1">
                            <i class="fas fa-plus"></i>
                            <span>Add Task</span>
                        </button>
                    </div>

                    <!-- Tasks List for Re-Execution -->
                    <div class="space-y-2">
                        <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                            <i class="fas fa-tasks text-amber-600"></i>
                            <span>Assigned Action Tasks</span>
                        </h4>
                        <div id="review-tasks-modal-list" class="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                </div>

                <div class="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <button type="button" onclick="closeModal('modal-review-tasks')" class="btn-secondary px-4 py-2 text-xs font-bold">Close</button>
                    <div id="review-tasks-footer-actions" class="flex items-center space-x-2">
                        <button id="btn-proceed-to-monitoring" onclick="proceedFromTasksToMonitoring()" class="btn-primary px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 border-teal-600 shadow-xs flex items-center space-x-2">
                            <span>Proceed to Continuous Monitoring (Stage 3)</span>
                            <i class="fas fa-arrow-right text-[10px]"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
<!-- Modal: Stage 6 Individual Development Plan (IDP) Detail Modal -->
<div id="modal-idp-detail" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-100">
        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg font-bold border border-emerald-100 shadow-2xs">
                    <i class="fas fa-seedling"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Phase 6: Development Planning</span>
                        <h3 id="idp-detail-title" class="font-heading font-bold text-base text-slate-900">70-20-10 Individual Development Plan (IDP)</h3>
                    </div>
                    <p id="idp-detail-subtitle" class="text-xs text-slate-500 mt-0.5">Based on appraisal results, employee strengths and development gaps are mapped to tailored 70-20-10 learning actions.</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <div id="idp-header-actions" class="flex items-center space-x-2">
                    <!-- Dynamic header actions (Send Kudos or Prescribe LMS / Add Action) -->
                </div>
                <button onclick="closeModal('modal-idp-detail')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 text-xs bg-slate-50/40">
            <!-- Strengths vs Gaps Breakdown from Database -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Strengths Card -->
                <div class="p-5 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-3">
                    <div class="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                        <span class="font-bold text-emerald-950 text-xs flex items-center">
                            <i class="fas fa-award mr-2 text-emerald-600 text-sm"></i>
                            Identified Strengths &amp; Core Competencies
                        </span>
                        <span id="idp-strengths-count" class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">0 Calibrated</span>
                    </div>
                    <ul id="idp-detail-strengths-list" class="space-y-2 text-slate-700 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        <!-- Populated dynamically by js/performance.js -->
                    </ul>
                </div>

                <!-- Gaps Card -->
                <div class="p-5 bg-white rounded-2xl border border-amber-200/80 shadow-2xs space-y-3">
                    <div class="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
                        <span class="font-bold text-amber-950 text-xs flex items-center">
                            <i class="fas fa-triangle-exclamation mr-2 text-amber-600 text-sm"></i>
                            Development Gaps (&lt; 3.0 Threshold)
                        </span>
                        <span id="idp-gaps-count" class="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">Action Required</span>
                    </div>
                    <ul id="idp-detail-gaps-list" class="space-y-2 text-slate-700 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        <!-- Populated dynamically by js/performance.js -->
                    </ul>
                </div>
            </div>

            <!-- 70-20-10 IDP Plan Cards Section from Database -->
            <div class="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <h4 class="font-heading font-bold text-slate-900 text-sm">70-20-10 Active Development Commitments</h4>
                        <p class="text-slate-500 text-[11px]">Experiential, Mentorship &amp; Formal LMS actions mapped for growth</p>
                    </div>
                    <div id="idp-commitments-header-action">
                        <!-- Dynamic Link -->
                    </div>
                </div>

                <div id="idp-perf-commitments-container" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Populated dynamically by js/performance.js -->
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-white flex items-center justify-between flex-shrink-0">
            <button onclick="viewEmployeeCompetencyRadar(window.selectedEvalEmpId || 'emp-101')" class="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold shadow-2xs transition flex items-center space-x-1.5" title="Inspect Associate Competency Radar &amp; Gap Diagnostic">
                <i class="fas fa-chart-radar text-indigo-600"></i>
                <span>View Competency Radar &amp; Gap Interventions</span>
            </button>
            <button type="button" onclick="closeModal('modal-idp-detail')" class="btn-secondary px-5 py-2 text-xs font-bold">
                Close Plan
            </button>
        </div>
    </div>
</div>

<!-- Modal: Stage 7 Next Cycle Transition Detail Modal -->
<div id="modal-cycle-detail" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100">
        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center text-lg font-bold border border-teal-100 shadow-2xs">
                    <i class="fas fa-rotate"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">Phase 7: Next Cycle Transition</span>
                        <h3 id="cycle-modal-title" class="font-heading font-bold text-base text-slate-900">Next Cycle Rollover</h3>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">Rollover active quarterly targets and performance growth baseline into the upcoming cycle.</p>
                </div>
            </div>
            <button onclick="closeModal('modal-cycle-detail')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs bg-slate-50/40">
            <div id="cycle-detail-transition-card" class="card-hero p-6 bg-white space-y-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <!-- Rendered dynamically -->
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-white flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-500 font-semibold"><i class="fas fa-infinity text-teal-600 mr-1.5"></i> Continuous Cycle Architecture</span>
            <button type="button" onclick="closeModal('modal-cycle-detail')" class="btn-secondary px-5 py-2 text-xs font-bold">
                Close
            </button>
        </div>
    </div>
</div>

<!-- Modal: Stage 3 Continuous Monitoring & Activity Stream Modal -->
<div id="modal-monitoring-stream" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-100">
        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-lg font-bold border border-indigo-100 shadow-2xs">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">Phase 3: Monitoring Drill-Down</span>
                        <h3 id="mon-modal-emp-name" class="font-heading font-bold text-base text-slate-900">Continuous Monitoring Stream</h3>
                    </div>
                    <p id="mon-modal-emp-pos" class="text-xs text-slate-500 mt-0.5">Real-time KPI progress tracking, SOP checklist completions, and reflective shift logs.</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="openAIFeedbackModal(window.selectedEmployeeContext?.id || 'emp-101', window.selectedEmployeeContext?.name || 'Maria Santos', window.selectedEmployeeContext?.dept || 'Front Office')" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                    <i class="fas fa-wand-magic-sparkles text-[10px]"></i>
                    <span>AI Copilot</span>
                </button>
                <button onclick="openLogMilestoneModal(window.selectedEmployeeContext?.id || 'emp-101')" class="btn-secondary px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 flex items-center space-x-1">
                    <i class="fas fa-flag-checkered text-emerald-600 text-xs"></i>
                    <span>+ Log KPI</span>
                </button>
                <button onclick="closeModal('modal-monitoring-stream')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs bg-slate-50/40">
            <!-- Filter & Search Bar -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs text-xs">
                <div class="flex items-center space-x-1.5 flex-wrap gap-1">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
                    <button type="button" onclick="setMonitoringStreamFilter('all')" id="btn-stream-filter-all" class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-primary text-white shadow-2xs transition">All Tasks</button>
                    <button type="button" onclick="setMonitoringStreamFilter('pending')" id="btn-stream-filter-pending" class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition flex items-center space-x-1">
                        <i class="fas fa-hourglass-half text-amber-500 text-[10px]"></i>
                        <span>Pending</span>
                    </button>
                    <button type="button" onclick="setMonitoringStreamFilter('completed')" id="btn-stream-filter-completed" class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition flex items-center space-x-1">
                        <i class="fas fa-check text-emerald-600 text-[10px]"></i>
                        <span>Completed</span>
                    </button>
                    <button type="button" onclick="setMonitoringStreamFilter('specific')" id="btn-stream-filter-specific" class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition">Specific Action</button>
                    <button type="button" onclick="setMonitoringStreamFilter('general')" id="btn-stream-filter-general" class="px-2.5 py-1 rounded-lg font-bold text-[10px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition">General SOP</button>
                </div>
                <div class="relative">
                    <i class="fas fa-search absolute left-3 top-2.5 text-slate-400 text-[10px]"></i>
                    <input type="text" id="stream-task-search-input" oninput="onMonitoringStreamSearch(this.value)" placeholder="Search tasks, learnings, feedback..." class="pl-7 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-56 font-medium text-slate-800">
                </div>
            </div>

            <!-- Timeline Stream Container -->
            <div id="timeline-stream-container" class="space-y-3.5 text-xs">
                <!-- Rendered dynamically by js/performance.js -->
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-white flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-500 font-semibold"><i class="fas fa-clock-rotate-left text-indigo-600 mr-1.5"></i> Live Shift Checklists &amp; Milestone Stream</span>
            <button type="button" onclick="closeModal('modal-monitoring-stream')" class="btn-secondary px-5 py-2 text-xs font-bold">
                Close Stream
            </button>
        </div>
    </div>
</div>

<!-- Modal: Stage 4 Formal Multi-Factor Appraisal Detail Modal -->
<div id="modal-view-appraisal" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-100">
        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-lg font-bold border border-purple-100 shadow-2xs">
                    <i class="fas fa-star-half-stroke"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">Phase 4: Formal Evaluation</span>
                        <span id="eval-modal-status-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Rated</span>
                    </div>
                    <h3 id="eval-modal-emp-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">Formal Multi-Factor Appraisal</h3>
                    <p id="eval-modal-emp-subtitle" class="text-xs text-slate-500">Position · Department</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button id="btn-open-eval-appraisal" onclick="openAppraisalModal(window.selectedEvalEmpId)" class="btn-primary px-3.5 py-2 text-xs font-bold shadow-xs">
                    <i class="fas fa-edit mr-1"></i> Open Appraisal Form
                </button>
                <button onclick="closeModal('modal-view-appraisal')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs bg-slate-50/40">
            <!-- Warning Alert Banner if Supervisor Rating Below 3.0 -->
            <div id="eval-detail-warning-alert" class="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-xs text-rose-900 hidden shadow-2xs">
                <div class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    <i class="fas fa-triangle-exclamation"></i>
                </div>
                <div class="space-y-0.5">
                    <p class="font-bold text-rose-950 text-sm">Performance Alert: Rating Below 3.0 Benchmark</p>
                    <p class="text-rose-800 text-[11px] leading-relaxed">The supervisor appraisal score for this associate is below standard hotel competency requirements (&lt; 3.0). A structured <strong>Performance Improvement Plan (PIP)</strong> and targeted capability retraining are recommended.</p>
                </div>
            </div>

            <!-- Objectives Scorecard Breakdown -->
            <div class="space-y-2">
                <h4 class="font-heading font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <i class="fas fa-bullseye text-primary"></i>
                    <span>Agreed Performance Objectives &amp; Task Deliverables Scorecard</span>
                </h4>
                <div id="eval-detail-objectives-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <!-- Populated dynamically by showEmployeeEvalDetail() from DB -->
                </div>
            </div>

            <!-- Primary Supervisor Appraisal Assessment Card -->
            <div class="p-5 bg-white rounded-2xl border border-purple-200/90 space-y-4 text-xs shadow-2xs">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xs">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div>
                            <span class="font-bold text-purple-950 uppercase text-[11px] tracking-wide block">Supervisor Appraisal Scorecard</span>
                            <span class="text-[10px] text-slate-500">Official calibrated rating recorded in database</span>
                        </div>
                    </div>
                    <span id="eval-detail-super-status-badge" class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full self-start sm:self-auto">Rated</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <div>
                        <span class="text-[11px] font-semibold text-slate-500 block">Overall Supervisor Rating:</span>
                        <div id="eval-detail-super-score" class="font-heading font-bold text-2xl text-purple-950 mt-0.5">
                            0.00 <span class="text-sm font-normal text-slate-400">/ 5.0 (Pending Evaluation)</span>
                        </div>
                    </div>
                    <div id="eval-detail-tier-badge-container" class="text-left sm:text-right">
                        <!-- Dynamic Tier Badge -->
                    </div>
                </div>

                <!-- Evaluated Criteria Breakdown from Database -->
                <div class="space-y-2 pt-2">
                    <span class="font-bold text-slate-800 text-xs block">Criteria Rubric Breakdown:</span>
                    <div id="eval-detail-criteria-breakdown" class="space-y-2">
                        <!-- Populated dynamically -->
                    </div>
                </div>

                <!-- Supervisor Recommendation / Notes -->
                <div class="pt-3 border-t border-purple-100 space-y-1">
                    <span class="font-bold text-slate-800 text-xs block">Supervisor Endorsement &amp; Coaching Notes:</span>
                    <div id="eval-detail-super-recommendation" class="text-slate-700 leading-relaxed text-xs">
                        <!-- Populated dynamically -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-white flex items-center justify-between flex-shrink-0">
            <div class="flex items-center space-x-2">
                <button type="button" onclick="closeModal('modal-view-appraisal')" class="btn-secondary px-5 py-2 text-xs font-bold">
                    Close
                </button>
                <button onclick="viewEmployeeCompetencyRadar(window.selectedEvalEmpId || 'emp-101')" class="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs font-bold shadow-2xs transition flex items-center space-x-1.5" title="Inspect Associate Competency Radar &amp; Gap Diagnostic">
                    <i class="fas fa-chart-radar text-indigo-600"></i>
                    <span>Competency Radar &amp; Gaps</span>
                </button>
            </div>
            <button onclick="closeModal('modal-view-appraisal'); switchSubTab('perf', 'review');" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5">
                <span>Proceed to Phase 5: Calibration</span>
                <i class="fas fa-arrow-right text-[10px]"></i>
            </button>
        </div>
    </div>
</div>

<!-- Modal: Stage 5 Discussion Minutes & Calibration Detail Modal -->
<div id="modal-view-calibration" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
    <div class="modal-card max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100">
        <!-- Header -->
        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
            <div class="flex items-center space-x-3">
                <div class="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-lg font-bold border border-indigo-100 shadow-2xs">
                    <i class="fas fa-sliders"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">Phase 5: Discussion Minutes</span>
                        <span id="calib-modal-status-badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Calibrated</span>
                    </div>
                    <h3 id="calib-modal-emp-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">1-on-1 Discussion &amp; Calibration Approval</h3>
                    <p id="calib-modal-emp-subtitle" class="text-xs text-slate-500">Employee and supervisor rating normalization.</p>
                </div>
            </div>
            <button onclick="closeModal('modal-view-calibration')" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs bg-slate-50/40">
            <!-- 1-on-1 Discussion Minutes & Rating Record from Database (2 Clean Columns) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <p class="font-bold text-slate-900 text-sm">Final Calibrated Score</p>
                    <p class="text-3xl font-heading font-bold text-indigo-700">
                        <span id="calib-detail-score-val">0.00</span> <span class="text-xs font-normal text-slate-400">/ 5.0</span>
                    </p>
                    <p class="text-[11px] text-slate-500">Grade: <strong id="calib-detail-tier-label" class="text-slate-800">Pending Calibration</strong></p>
                </div>

                <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <p class="font-bold text-slate-900 text-sm">Discussion Minutes &amp; Growth Focus</p>
                    <div id="calib-detail-discussion-minutes" class="text-slate-600 leading-relaxed text-[11px] max-h-28 overflow-y-auto custom-scrollbar">
                        1-on-1 session discussion minutes pending formal recording in database.
                    </div>
                </div>
            </div>

            <!-- Dynamic Next Step: Create Development Plan if >= 3.0, or Initiate PIP if < 3.0 -->
            <div id="calib-next-step-container">
                <!-- Rendered dynamically by js/performance.js -->
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 sm:px-6 border-t border-slate-100 bg-white flex items-center justify-between flex-shrink-0">
            <div class="flex items-center space-x-2">
                <button type="button" onclick="closeModal('modal-view-calibration')" class="btn-secondary px-5 py-2 text-xs font-bold">
                    Close
                </button>
                <button onclick="viewEmployeeCompetencyRadar(window.selectedEvalEmpId || 'emp-101')" class="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs font-bold shadow-2xs transition flex items-center space-x-1.5" title="Inspect Associate Competency Radar &amp; Gap Diagnostic">
                    <i class="fas fa-chart-radar text-indigo-600"></i>
                    <span>Competency Radar &amp; Gaps</span>
                </button>
            </div>
            <button id="calib-detail-btn-open-modal" onclick="open1on1CalibrationModal(window.selectedEvalEmpId || 'emp-101')" class="btn-primary px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 border-indigo-600 shadow-xs flex items-center space-x-1.5">
                <i class="fas fa-sliders mr-1"></i>
                <span>Open Calibration Editor</span>
            </button>
        </div>
    </div>
</div>

        <!-- ======================================================== -->
        <!-- MODAL: CALIBRATE HR READINESS FLAG                        -->
        <!-- ======================================================== -->
        <div id="modal-calibrate-succession-flag" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div class="p-4 border-b border-[#E8DEDC] flex items-center justify-between bg-[#FAF8F7]">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-sliders text-primary"></i>
                        <h4 class="font-heading font-bold text-sm text-slate-900">HR Readiness Bench Calibration</h4>
                    </div>
                    <button type="button" onclick="closeModal('modal-calibrate-succession-flag')" class="w-7 h-7 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition border border-[#E8DEDC]">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <form onsubmit="submitHRFlagCalibration(event)" class="p-5 space-y-4 text-xs">
                    <input type="hidden" id="succ-flag-candidate-id" value="">

                    <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-1">
                        <div class="flex justify-between items-center text-[11px]">
                            <span class="text-slate-500 font-semibold">Candidate:</span>
                            <strong id="succ-flag-candidate-name" class="text-slate-900 font-bold">Maria Santos</strong>
                        </div>
                        <div class="flex justify-between items-center text-[11px]">
                            <span class="text-slate-500 font-semibold">Target Leadership Role:</span>
                            <strong id="succ-flag-target-role" class="text-primary font-bold">Front Office Assistant Manager</strong>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">Formal HR Readiness Flag *</label>
                        <select id="succ-flag-readiness-select" required class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                            <option value="Ready Now">Ready Now (0–6 Months Horizon)</option>
                            <option value="Ready in 1-2 Years">Ready in 1–2 Years (Pipeline Developing)</option>
                            <option value="Not Ready">Not Ready (Skill / Tenure Gap)</option>
                        </select>
                    </div>

                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">HR Calibration Rationale &amp; Audit Notes *</label>
                        <textarea id="succ-flag-notes" required rows="3" class="w-full p-3 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] text-slate-800 font-medium focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar" placeholder="Enter leadership readiness assessment notes, completed milestones, or remaining development gaps..."></textarea>
                    </div>

                    <div class="pt-3 border-t border-[#E8DEDC] flex items-center justify-end space-x-2">
                        <button type="button" onclick="closeModal('modal-calibrate-succession-flag')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                        <button type="submit" class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                            <i class="fas fa-check-circle"></i>
                            <span>Calibrate &amp; Sync Flag</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- MODAL: ADD SUCCESSION TARGET ROLE                         -->
        <!-- ======================================================== -->
        <div id="modal-add-succession-role" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div class="p-4 border-b border-[#E8DEDC] flex items-center justify-between bg-[#FAF8F7]">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-sitemap text-primary"></i>
                        <h4 class="font-heading font-bold text-sm text-slate-900">Define Key Leadership Succession Position</h4>
                    </div>
                    <button type="button" onclick="closeModal('modal-add-succession-role')" class="w-7 h-7 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition border border-[#E8DEDC]">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <form onsubmit="submitNewSuccessionRole(event)" class="p-5 space-y-4 text-xs">
                    <div class="space-y-1">
                        <label class="font-bold text-slate-800 text-[11px]">Position Title *</label>
                        <input id="succ-role-title" type="text" required placeholder="e.g., Executive Housekeeper / F&B Director" class="w-full px-3.5 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="font-bold text-slate-800 text-[11px]">Department *</label>
                            <select id="succ-role-dept" onchange="updateSuccessionModalRecommendations()" required class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="Front Office">Front Office</option>
                                <option value="Culinary">Culinary</option>
                                <option value="F&B Service">F&B Service</option>
                                <option value="Housekeeping">Housekeeping</option>
                                <option value="Engineering">Engineering</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="font-bold text-slate-800 text-[11px]">Current Incumbent *</label>
                            <select id="succ-role-incumbent" required class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="">-- Select Current Incumbent --</option>
                            </select>
                        </div>
                    </div>

                    <!-- Dynamic XP Recommendation Box -->
                    <div id="succ-role-xp-recommendations-box" class="p-3 bg-primary/5 rounded-2xl border border-primary/20 space-y-2">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-primary flex items-center">
                                <i class="fas fa-sparkles mr-1.5 text-gold"></i>
                                <span>XP-Ledger Top Talent Recommendations</span>
                            </span>
                            <span class="text-[10px] text-slate-500 font-semibold">Department Leaderboard</span>
                        </div>
                        <div id="succ-role-xp-recommendations-list" class="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                            <div class="text-slate-400 text-xs italic py-2 text-center">Loading department talent leaderboard...</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="font-bold text-slate-800 text-[11px]">Planned Transition *</label>
                            <select id="succ-role-transition" required class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="0–6 Months (Immediate)">0–6 Months (Immediate)</option>
                                <option value="6–12 Months (Near-term)">6–12 Months (Near-term)</option>
                                <option value="1–2 Years (Mid-term)" selected>1–2 Years (Mid-term)</option>
                                <option value="2+ Years (Long-term)">2+ Years (Long-term)</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="font-bold text-slate-800 text-[11px]">Risk of Loss *</label>
                            <select id="succ-role-risk" required class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="Low">Low Risk</option>
                                <option value="Medium">Medium Risk</option>
                                <option value="High">High Risk</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1">
                            <label class="font-bold text-slate-800 text-[11px]">Primary Successor</label>
                            <select id="succ-role-primary-successor" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="">-- Select Primary Successor --</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="font-bold text-slate-800 text-[11px]">Emergency Backup</label>
                            <select id="succ-role-backup-successor" class="w-full px-3 py-2 rounded-xl border border-[#E8DEDC] bg-[#FAF8F7] font-semibold text-slate-800 focus:ring-2 focus:ring-primary focus:outline-none">
                                <option value="">-- Optional Emergency Backup --</option>
                            </select>
                        </div>
                    </div>

                    <div class="pt-3 border-t border-[#E8DEDC] flex items-center justify-end space-x-2">
                        <button type="button" onclick="closeModal('modal-add-succession-role')" class="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                        <button type="submit" class="btn-primary px-5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                            <i class="fas fa-plus"></i>
                            <span>Create Position</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>


