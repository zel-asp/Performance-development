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
                        <div class="p-3 bg-purple-50/70 rounded-xl border border-purple-200/80 space-y-1">
                            <div class="flex justify-between items-center">
                                <label class="font-bold text-purple-950 text-[11px]"><i
                                        class="fas fa-bullseye text-purple-600 mr-1"></i> HR Assignment Target Scope
                                    *</label>
                                <span class="text-[10px] text-purple-700 font-semibold">Centralized HR Dispatch</span>
                            </div>
                            <select id="goal-target-scope"
                                class="w-full px-3 py-2 rounded-lg border border-purple-200 text-xs font-bold text-purple-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="single">Assign to Selected Staff: Maria Santos (Front Desk Host)</option>
                                <option value="dept">Cascade to ENTIRE Department: Front Office (All 12 Staff)</option>
                                <option value="property">Hotel-wide Benchmark Objective (All 100 Employees)</option>
                            </select>
                        </div>

                        <!-- Objective Title -->
                        <div class="space-y-1">
                            <div class="flex justify-between items-center">
                                <label class="font-bold text-slate-800 text-[11px]">1. Performance Objective / Milestone
                                    *</label>
                                <span class="text-[10px] text-slate-400">Core milestone commitment</span>
                            </div>
                            <textarea id="goal-title-input" required rows="2"
                                placeholder="Describe the primary service or operational objective you are committing to achieve (e.g., Elevate VIP Guest Check-in Experience & NPS Loyalty Index)..."
                                class="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none font-medium custom-scrollbar bg-slate-50/50 hover:bg-white transition"></textarea>
                        </div>

                        <!-- Department & Date -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div class="space-y-1">
                                <label class="font-bold text-slate-800 text-[11px]">2. Department / Function *</label>
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
                                <label class="font-bold text-slate-800 text-[11px]">3. Target Completion Date *</label>
                                <input type="date" id="goal-date-input" required value="2026-09-30"
                                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium bg-slate-50/50">
                            </div>
                        </div>

                        <!-- KPI Formula -->
                        <div class="space-y-1">
                            <div class="flex justify-between items-center">
                                <label class="font-bold text-slate-800 text-[11px]">4. Measurable KPI Formula *</label>
                                <span class="text-[10px] text-primary font-semibold">Formula format</span>
                            </div>
                            <textarea id="goal-kpi-input" required rows="2"
                                placeholder="Define how success is measured (e.g., Net Promoter Score (NPS) >= +92 Score, or Check Average +18%)..."
                                class="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none font-medium custom-scrollbar bg-slate-50/50 hover:bg-white transition"></textarea>

                            <div class="flex items-center space-x-1.5 pt-0.5 flex-wrap gap-y-1">
                                <span class="text-[10px] text-slate-400">Quick KPI formats:</span>
                                <button type="button" onclick="setKPIValue('NPS >= +92 Score')"
                                    class="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md font-mono transition">NPS
                                    &gt;= +92</button>
                                <button type="button" onclick="setKPIValue('+18% Beverage Rev/Cover')"
                                    class="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md font-mono transition">+18%
                                    Avg Check</button>
                                <button type="button" onclick="setKPIValue('100% Audit Score (Zero Violations)')"
                                    class="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md font-mono transition">100%
                                    Audit Pass</button>
                            </div>
                        </div>

                        <!-- Weight & Evidence -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div class="space-y-1">
                                <label class="font-bold text-slate-800 text-[11px]">5. Appraisal Weighting</label>
                                <select id="goal-weight-input"
                                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium bg-slate-50/50">
                                    <option>High Priority (35% Weight - Core Role Objective)</option>
                                    <option selected>Medium Priority (20% Weight - Standard Operational Goal)</option>
                                    <option>Developmental (15% Weight - Learning Goal)</option>
                                </select>
                            </div>
                            <div class="space-y-1">
                                <label class="font-bold text-slate-800 text-[11px]">6. Expected Outputs &
                                    Evidence</label>
                                <textarea id="goal-evidence-input" rows="2"
                                    placeholder="Detail deliverables, feedback cards, Opera PMS logs, or audit certificates..."
                                    class="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary/30 focus:border-primary font-medium custom-scrollbar bg-slate-50/50"></textarea>
                            </div>
                        </div>

                        <!-- Gemini AI Alignment Box -->
                        <div class="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-start space-x-3">
                            <div
                                class="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0 shadow-2xs">
                                <i class="fas fa-sparkles"></i>
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
                            class="px-4 py-2 rounded-full text-xs text-slate-600 hover:bg-slate-100 font-semibold transition btn-raindrop btn-raindrop-secondary">Cancel</button>
                        <button type="button" onclick="document.getElementById('form-create-goal').requestSubmit()"
                            class="px-5 py-2.5 rounded-full text-xs bg-primary hover:bg-primary-dark text-white font-bold shadow-sm transition flex items-center space-x-1.5 btn-raindrop btn-raindrop-primary">
                            <span>Submit for Approval</span>
                            <i class="fas fa-arrow-right text-[10px]"></i>
                        </button>
                    </div>
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
                            class="w-11 h-11 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-base font-bold border border-amber-100">
                            <i class="fas fa-signature"></i>
                        </div>
                        <div>
                            <span
                                class="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Step
                                2 · Supervisor Calibration</span>
                            <h3 class="font-heading font-bold text-base text-slate-900 mt-0.5">Endorse Objective & KPIs
                            </h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-approve-goal')"
                        class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <div class="p-6 space-y-4 text-xs bg-white">
                    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
                        <div class="flex justify-between font-bold text-slate-900 text-sm">
                            <span id="review-goal-title">VIP Guest Check-in Experience & NPS Lift</span>
                            <span class="text-primary font-bold text-xs bg-primary/10 px-2.5 py-0.5 rounded-full">Q3
                                Priority</span>
                        </div>
                        <p class="text-slate-600">KPI Target: <strong>Net Promoter Score (NPS) &ge; +92 Score</strong>
                        </p>
                        <p class="text-slate-400 text-[11px]">Submitted by: Maria Santos (Front Office) · Due: Sep 30,
                            2026</p>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-800 mb-1">Supervisor Coaching Notes & Check-in
                            Intervals</label>
                        <textarea id="supervisor-feedback-notes" rows="3"
                            class="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-slate-50/50"
                            placeholder="Add specific coaching notes, check-in intervals or calibration adjustments for this goal..."></textarea>
                    </div>
                </div>

                <div
                    class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end space-x-2.5">
                    <button onclick="requestGoalRevision()"
                        class="px-4 py-2 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold hover:bg-slate-100 transition btn-raindrop btn-raindrop-secondary">Request
                        Revision</button>
                    <button onclick="approveGoalOfficial()"
                        class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-sm transition btn-raindrop">Approve
                        Goal</button>
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
                            class="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold border border-indigo-100">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div>
                            <span
                                class="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">Gemini
                                AI Copilot</span>
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
                    <div class="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs">
                        <p class="text-[11px] font-bold text-indigo-900 mb-1.5">Try a quick shift observation scenario:
                        </p>
                        <div class="flex flex-wrap gap-1.5">
                            <button type="button"
                                onclick="setRoughNote('Peak dinner rush was hectic. Maria calmed down an angry VIP guest whose suite was delayed, but junior hosts were standing idle.')"
                                class="px-3 py-1 rounded-full bg-white border border-indigo-200 text-indigo-900 text-[10px] font-medium hover:bg-indigo-100 transition shadow-2xs btn-raindrop">
                                ⚡ Rush Hour Composure
                            </button>
                            <button type="button"
                                onclick="setRoughNote('Pierre recommended the reserve vintage to presidential suites and exceeded beverage targets by 20% tonight.')"
                                class="px-3 py-1 rounded-full bg-white border border-indigo-200 text-indigo-900 text-[10px] font-medium hover:bg-indigo-100 transition shadow-2xs btn-raindrop">
                                🍷 Sommelier Upsell Win
                            </button>
                        </div>
                    </div>

                    <div class="space-y-2.5">
                        <label class="block font-bold text-slate-800 text-[11px]">Rough Observation / Floor
                            Notes</label>
                        <textarea id="ai-rough-notes" rows="3"
                            class="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar bg-slate-50/50"
                            placeholder="Type or click an observation scenario above..."></textarea>

                        <button onclick="generateAIFeedback()"
                            class="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-full font-bold flex items-center justify-center space-x-2 shadow-sm transition btn-raindrop btn-raindrop-primary">
                            <i class="fas fa-wand-magic-sparkles"></i>
                            <span>Generate Structured SBI Coaching Model</span>
                        </button>
                    </div>

                    <!-- Structured Output Box -->
                    <div id="ai-output-box"
                        class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 space-y-2 hidden">
                        <div class="font-semibold text-primary flex items-center justify-between text-xs">
                            <span>✦ Refined Coaching Feedback</span>
                            <span
                                class="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">SBI
                                Model</span>
                        </div>
                        <p class="leading-relaxed text-slate-800 text-xs" id="ai-generated-text">"Maria, during the
                            evening rush (Situation), your calm de-escalation with the VIP guest protected satisfaction
                            (Behavior). Moving forward, delegating table resets to junior attendants will enable faster
                            seating turns (Impact)."</p>
                        <div class="flex justify-end pt-2 border-t border-slate-200/60">
                            <button onclick="copyAndApplyFeedback()"
                                class="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-full font-semibold transition text-xs shadow-xs btn-raindrop btn-raindrop-primary">Post
                                to Feedback Wall</button>
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
                            class="w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg font-bold border border-emerald-100">
                            <i class="fas fa-star-half-stroke"></i>
                        </div>
                        <div>
                            <span
                                class="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Steps
                                4 & 5 · Formal Evaluation</span>
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
                    <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[10px] text-slate-600">
                        <p class="font-bold text-slate-800 text-[11px] mb-1">1-5 Rating Scale Guide:</p>
                        <div class="grid grid-cols-5 gap-1 text-center font-medium">
                            <span class="p-1 rounded bg-red-50 text-red-700">1: Below</span>
                            <span class="p-1 rounded bg-amber-50 text-amber-700">2: Developing</span>
                            <span class="p-1 rounded bg-blue-50 text-blue-700">3: Proficient</span>
                            <span class="p-1 rounded bg-emerald-50 text-emerald-700 font-bold">4: Advanced</span>
                            <span class="p-1 rounded bg-purple-50 text-purple-700 font-bold">5: Master</span>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                            <div class="flex justify-between items-center font-semibold">
                                <span>1. Guest Satisfaction & 5-Star Protocols (Weight: 40%)</span>
                                <span class="text-primary font-bold">4.8 / 5.0 (Advanced)</span>
                            </div>
                            <input type="range" min="1" max="5" step="0.1" value="4.8" class="w-full accent-[#A61E22]">
                            <textarea rows="2"
                                placeholder="Provide achievements, guest commendations, and rationale for this rating..."
                                class="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar"></textarea>
                        </div>

                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                            <div class="flex justify-between items-center font-semibold">
                                <span>2. PMS Reservation Speed & Coordination (Weight: 30%)</span>
                                <span class="text-primary font-bold">4.5 / 5.0 (Advanced)</span>
                            </div>
                            <input type="range" min="1" max="5" step="0.1" value="4.5" class="w-full accent-[#A61E22]">
                            <textarea rows="2"
                                placeholder="Detail PMS efficiency metrics, check-in speeds, and shift coordination notes..."
                                class="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar"></textarea>
                        </div>

                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                            <div class="flex justify-between items-center font-semibold">
                                <span>3. Conflict De-escalation & Mentorship (Weight: 30%)</span>
                                <span class="text-primary font-bold">3.8 / 5.0 (Developing)</span>
                            </div>
                            <input type="range" min="1" max="5" step="0.1" value="3.8" class="w-full accent-[#A61E22]">
                            <textarea rows="2"
                                placeholder="List guest resolution examples, mentorship moments, or areas where coaching is requested..."
                                class="w-full p-2.5 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar"></textarea>
                        </div>
                    </div>
                </div>

                <div
                    class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex justify-end space-x-2.5 flex-shrink-0">
                    <button onclick="closeModal('modal-self-assessment')"
                        class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-full font-semibold transition btn-raindrop btn-raindrop-secondary">Cancel</button>
                    <button onclick="submitSelfAssessment()"
                        class="px-5 py-2 text-xs bg-primary text-white rounded-full font-bold hover:bg-primary-dark shadow-sm transition btn-raindrop btn-raindrop-primary">Submit
                        Evaluation</button>
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
                        class="text-xs font-bold text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full">+0 XP
                        Total</span>
                    <div class="flex items-center space-x-2.5">
                        <button onclick="closeModal('modal-recognition')"
                            class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-full font-semibold transition btn-raindrop btn-raindrop-secondary">Cancel</button>
                        <button onclick="dispatchRecognition()"
                            class="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full text-xs font-bold shadow-md shadow-amber-500/20 transition btn-raindrop">
                            <span id="kudos-submit-label">Send Kudos & Award XP</span>
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
                            class="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold border border-emerald-200">
                            <i class="fas fa-heart-pulse"></i>
                        </div>
                        <div>
                            <span
                                class="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Anonymous
                                Pulse</span>
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
                            class="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition flex flex-col items-center group shadow-2xs hover:shadow-xs">
                            <span class="text-3xl mb-1.5 group-hover:scale-110 transition">😊</span>
                            <span class="text-xs font-bold text-emerald-700">Smooth</span>
                            <span class="text-[10px] text-slate-400">Great flow</span>
                        </button>
                        <button onclick="submitSentimentRating('Neutral')"
                            class="p-4 rounded-2xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition flex flex-col items-center group shadow-2xs hover:shadow-xs">
                            <span class="text-3xl mb-1.5 group-hover:scale-110 transition">😐</span>
                            <span class="text-xs font-bold text-amber-700">Manageable</span>
                            <span class="text-[10px] text-slate-400">Busy shift</span>
                        </button>
                        <button onclick="submitSentimentRating('Stressful')"
                            class="p-4 rounded-2xl border border-slate-200 hover:border-red-500 hover:bg-red-50/50 transition flex flex-col items-center group shadow-2xs hover:shadow-xs">
                            <span class="text-3xl mb-1.5 group-hover:scale-110 transition">😓</span>
                            <span class="text-xs font-bold text-red-700">Friction</span>
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
                            class="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold border border-emerald-200">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div>
                            <span
                                class="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Knowledge
                                Check · +100 XP</span>
                            <h3 id="quiz-modal-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">
                                Hospitality Standard Quiz</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-lms-quiz')"
                        class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <div class="p-6 space-y-4 text-xs bg-white">
                    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                        <div class="flex justify-between items-center font-bold text-slate-700 text-xs">
                            <span>Question 1 of 3</span>
                            <span class="text-primary font-bold">Single Choice</span>
                        </div>
                        <p class="text-slate-800 font-semibold text-xs leading-relaxed">When a VIP guest arrives with an
                            unconfirmed suite upgrade request during peak check-in, what is the approved FIRST step
                            according to Grand Horizon service standards?</p>

                        <div class="space-y-2 pt-1">
                            <label
                                class="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-primary-50/30 hover:border-primary/40 cursor-pointer transition">
                                <input type="radio" name="quiz_opt" checked class="accent-[#A61E22]">
                                <span class="text-slate-700 font-medium">Warmly offer welcome beverage, verify PMS room
                                    availability, and discreetly notify Front Office Manager.</span>
                            </label>
                            <label
                                class="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-primary-50/30 hover:border-primary/40 cursor-pointer transition">
                                <input type="radio" name="quiz_opt" class="accent-[#A61E22]">
                                <span class="text-slate-700 font-medium">Immediately inform the guest that upgrades are
                                    not possible without written approval.</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex justify-between items-center">
                    <span class="text-[11px] text-slate-500 font-semibold"><i
                            class="fas fa-trophy text-amber-500 mr-1"></i> Pass: 80% (+100 XP)</span>
                    <div class="space-x-2">
                        <button onclick="closeModal('modal-lms-quiz')"
                            class="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition">Cancel</button>
                        <button onclick="submitQuizSuccess()"
                            class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition">Submit
                            Answers</button>
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
                        <div class="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold border border-emerald-200 shadow-2xs">
                            <i class="fas fa-file-arrow-up"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <h3 class="font-heading font-bold text-base text-slate-900">Upload Training Document / SOP</h3>
                                <span class="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">LMS Library</span>
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
                        class="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition group">
                        <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition shadow-2xs">
                            <i class="fas fa-cloud-arrow-up"></i>
                        </div>
                        <p class="font-bold text-slate-900 text-xs">Drag & drop document or <span class="text-emerald-700 underline">browse files</span></p>
                        <p class="text-[10px] text-slate-400 mt-1">Supports PDF, DOCX, PPTX, MP4, and SCORM packages (Max 50MB)</p>
                        <p id="lms-file-chosen" class="text-xs font-bold text-emerald-700 mt-2 hidden"><i class="fas fa-check-circle mr-1"></i> <span id="lms-file-chosen-name">file.pdf</span></p>
                        <input type="file" id="lms-file-input" onchange="handleLmsFileSelect(this)" class="hidden" accept=".pdf,.docx,.doc,.pptx,.mp4,.zip">
                    </div>

                    <!-- Metadata Fields -->
                    <div class="space-y-3">
                        <div>
                            <label class="block font-bold text-slate-800 text-[11px] mb-1">Document / Book Title</label>
                            <input id="lms-doc-title" type="text" placeholder="e.g., Executive Suite Turndown & Linen Standard Handbook"
                                class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block font-bold text-slate-800 text-[11px] mb-1">Target Department</label>
                                <select id="lms-doc-dept" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none">
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
                                <select id="lms-doc-category" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none">
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
                                    class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none">
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
                                class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none custom-scrollbar"></textarea>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
                    <span class="text-[11px] text-slate-500 font-semibold"><i class="fas fa-shield-halved text-emerald-600 mr-1"></i> Official Training Documentation Publishing</span>
                    <div class="flex items-center space-x-2">
                        <button onclick="closeModal('modal-lms-upload')"
                            class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-full font-semibold transition btn-raindrop btn-raindrop-secondary">Cancel</button>
                        <button onclick="submitLmsDocUpload()"
                            class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-600/20 transition btn-raindrop">
                            <i class="fas fa-upload mr-1.5"></i> Publish Document
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 7c. Modal: Interactive 3D Book & SOP Document Reader -->
        <div id="modal-book-reader" class="fixed inset-0 modal-overlay z-50 hidden items-center justify-center p-4">
            <div class="modal-card max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-amber-900/10">

                <!-- Header -->
                <div class="px-6 py-4 border-b border-amber-900/10 flex items-center justify-between bg-white flex-shrink-0">
                    <div class="flex items-center space-x-3">
                        <div id="reader-book-icon-badge" class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                            <i class="fas fa-book-open"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <h3 id="reader-book-title" class="font-heading font-bold text-base text-slate-900">Hospitality Standard SOP Codex</h3>
                                <span id="reader-book-xp-badge" class="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">+100 XP Completion</span>
                            </div>
                            <p id="reader-book-author" class="text-xs text-slate-500">Grand Horizon Operations Manual · Standard Edition 2026</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="showToast('Downloading PDF Document...', 'info')" class="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center space-x-1.5 transition shadow-2xs">
                            <i class="fas fa-file-pdf text-red-600 text-xs"></i>
                            <span class="hidden sm:inline">Download PDF</span>
                        </button>
                        <button onclick="closeModal('modal-book-reader')"
                            class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                            <i class="fas fa-times text-xs"></i>
                        </button>
                    </div>
                </div>

                <!-- Book Reading Body (Dual-Page Open Book Aesthetic) -->
                <div class="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#FAF8F5]">
                    <div class="bg-white rounded-2xl border border-amber-900/10 shadow-sm p-6 sm:p-8 relative">
                        <!-- Book Binding Center Crease Effect -->
                        <div class="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-transparent via-amber-950/5 to-transparent pointer-events-none"></div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs relative z-10">
                            <!-- Left Page: Table of Contents & Chapter Overview -->
                            <div class="space-y-4 md:border-r md:border-amber-900/10 md:pr-6">
                                <div class="border-b border-slate-100 pb-3">
                                    <span class="text-[10px] font-bold text-amber-700 uppercase tracking-widest">CHAPTER OVERVIEW</span>
                                    <h4 id="reader-chapter-title" class="font-heading font-bold text-base text-slate-900 mt-0.5">Chapter 1: Standard Operating Principles</h4>
                                </div>
                                <div id="reader-toc" class="space-y-2 text-slate-600">
                                    <!-- Dynamic chapters -->
                                </div>
                                <div class="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-1">
                                    <p class="font-bold text-amber-900 text-[11px]"><i class="fas fa-lightbulb text-amber-600 mr-1"></i> Quality Standard Tip</p>
                                    <p id="reader-tip-text" class="text-[11px] text-amber-800 leading-relaxed">Always maintain eye contact and warm smile within 10 feet of approaching guests.</p>
                                </div>
                            </div>

                            <!-- Right Page: Step-by-Step Procedure Content -->
                            <div class="space-y-4">
                                <div class="border-b border-slate-100 pb-3 flex justify-between items-center">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PROCEDURE SPECIFICATION</span>
                                    <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">SOP Approved</span>
                                </div>
                                <div id="reader-page-content" class="space-y-3 text-slate-700 leading-relaxed">
                                    <!-- Dynamic page content -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Reader Controls -->
                <div class="p-4 sm:px-6 border-t border-amber-900/10 bg-white flex items-center justify-between flex-shrink-0 text-xs">
                    <span class="text-slate-500 font-semibold hidden sm:inline"><i class="fas fa-book-bookmark text-amber-600 mr-1.5"></i> Interactive Digital Handbook Reader</span>
                    <div class="flex items-center space-x-2 w-full sm:w-auto justify-end">
                        <button onclick="closeModal('modal-book-reader')"
                            class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-full font-semibold transition btn-raindrop btn-raindrop-secondary">Close Reader</button>
                        <button id="reader-quiz-btn" onclick="launchQuizFromReader()"
                            class="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full font-bold shadow-md shadow-emerald-600/20 transition btn-raindrop flex items-center space-x-1.5">
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
                        <div class="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold border border-amber-200 shadow-2xs">
                            <i class="fas fa-book-medical"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <h3 class="font-heading font-bold text-base text-slate-900">Targeted LMS Handbooks (< 3.0 Remedial)</h3>
                                <span class="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Gap Resolution</span>
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
                    <div class="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div class="space-y-1">
                            <span class="text-[10px] font-bold text-amber-900 uppercase tracking-wide flex items-center"><i class="fas fa-triangle-exclamation text-amber-600 mr-1.5"></i> Associate with &lt; 3.0 Gaps</span>
                            <p id="remedial-associate-name" class="font-bold text-slate-900 text-xs">Lucas Vargas · Junior Host (Front Office)</p>
                            <p id="remedial-associate-detail" class="text-slate-600 text-[11px]">Evaluated Rating: <strong class="text-red-600">2.80 / 5.0</strong> · Sommelier Wine (<strong class="text-red-600">2.40</strong>) &amp; Conflict De-escalation (<strong class="text-red-600">2.60</strong>)</p>
                        </div>
                        <select id="remedial-associate-select" onchange="updateRemedialAssociate(this.value)"
                            class="p-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none shadow-2xs">
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
                    <span class="text-[11px] text-slate-500 font-semibold"><i class="fas fa-circle-info text-primary mr-1"></i> Prescriptions auto-sync with employee TNA & IDP</span>
                    <button onclick="closeModal('modal-remedial-books')"
                        class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-xs transition btn-raindrop">
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
                        <div class="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold border border-blue-200 shadow-2xs">
                            <i class="fas fa-rotate-right"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <h3 class="font-heading font-bold text-base text-slate-900">Associate Re-evaluation</h3>
                                <span class="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">TNA Audit</span>
                            </div>
                            <p class="text-xs text-slate-500 mt-0.5">Re-assess quiz knowledge score & competency rating after book review</p>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-re-evaluate')"
                        class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <!-- Form Body -->
                <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs bg-white">
                    <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                        <p class="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Enrolled Associate &amp; Book</p>
                        <p id="reeval-employee-name" class="text-sm font-bold text-slate-900">Lucas Vargas (Junior Host · Front Office)</p>
                        <p id="reeval-book-title" class="text-xs font-semibold text-primary">Front Desk Standards & VIP Protocols Codex</p>
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
                                class="w-full p-2.5 bg-slate-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-extrabold focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block font-bold text-slate-800 text-[11px] mb-1">Calibrated Competency Score</label>
                            <select id="reeval-new-rating" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                <option value="4.5">4.5 / 5.0 (Exceeds Expectations)</option>
                                <option value="4.0" selected>4.0 / 5.0 (Proficient Standard)</option>
                                <option value="3.5">3.5 / 5.0 (Developing)</option>
                                <option value="2.8">2.8 / 5.0 (Remedial Ongoing)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block font-bold text-slate-800 text-[11px] mb-1">Certification Status</label>
                            <select id="reeval-status" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                <option value="Certified" selected>✅ Passed & Certified</option>
                                <option value="Retake Required">⚠️ Retake Required</option>
                                <option value="In Progress">⏳ In Progress</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-800 text-[11px] mb-1">Supervisor Re-evaluation Observation Notes</label>
                        <textarea id="reeval-notes" rows="2" placeholder="Associate demonstrated marked improvement in VIP greeting and check-in speed under 2 minutes..."
                            class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar">Demonstrated 100% adherence to standard operating procedures during the practical post-study evaluation. All gap points resolved.</textarea>
                    </div>
                </div>

                <!-- Footer -->
                <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between flex-shrink-0">
                    <span class="text-[11px] text-slate-500 font-semibold"><i class="fas fa-award text-emerald-600 mr-1"></i> Auto-updates TNA & Competency Matrix</span>
                    <div class="flex items-center space-x-2">
                        <button onclick="closeModal('modal-re-evaluate')"
                            class="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-full font-semibold transition btn-raindrop btn-raindrop-secondary">Cancel</button>
                        <button onclick="submitAssociateReevaluation()"
                            class="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full text-xs font-bold shadow-md shadow-blue-600/20 transition btn-raindrop">
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
                            <span
                                class="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">Role-Based
                                Access Control (RBAC)</span>
                            <h3 class="font-heading font-bold text-lg text-slate-900 mt-0.5">Hospitality Role
                                Responsibilities & Permissions</h3>
                        </div>
                    </div>
                    <button onclick="closeModal('modal-role-matrix')"
                        class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition hover:rotate-90">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto custom-scrollbar space-y-5 text-xs bg-white">

                    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 space-y-1">
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
                        <div class="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-2.5">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-blue-950 text-sm flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> 1. Front Desk Host
                                    (Employee)
                                </span>
                                <span
                                    class="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Maria
                                    Santos</span>
                            </div>
                            <p class="text-slate-600 text-[11px]"><strong>Scope:</strong> Individual Contributor
                                (Self-Service)</p>
                            <div class="space-y-1 text-[11px] text-slate-700">
                                <p class="text-emerald-700 font-semibold"><i class="fas fa-check-circle mr-1"></i>
                                    <strong>What Employee CAN do:</strong>
                                </p>
                                <ul class="list-disc pl-4 space-y-0.5 text-slate-600">
                                    <li>Draft & submit performance objectives (Step 1)</li>
                                    <li>Log daily shift achievements & attach evidence (Step 3)</li>
                                    <li>Submit self-assessment ratings & narrative (Step 4)</li>
                                    <li>Take LMS training courses & knowledge quizzes</li>
                                    <li>Send peer kudos to colleagues (+50 XP)</li>
                                    <li>Execute personal 70-20-10 IDP action items (Step 7)</li>
                                </ul>
                                <p class="text-red-600 font-semibold pt-1"><i class="fas fa-times-circle mr-1"></i>
                                    <strong>CANNOT do:</strong>
                                </p>
                                <p class="text-slate-500 italic pl-4">Cannot approve own goals, rate colleagues
                                    officially, or edit team succession 9-box grids.</p>
                            </div>
                        </div>

                        <!-- 2. Supervisor / Manager -->
                        <div class="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2.5">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-amber-950 text-sm flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-amber-500 mr-2"></span> 2. Department
                                    Supervisor
                                </span>
                                <span
                                    class="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Chef
                                    Marco</span>
                            </div>
                            <p class="text-slate-600 text-[11px]"><strong>Scope:</strong> Operational Team Leader</p>
                            <div class="space-y-1 text-[11px] text-slate-700">
                                <p class="text-emerald-700 font-semibold"><i class="fas fa-check-circle mr-1"></i>
                                    <strong>What Supervisor CAN do:</strong>
                                </p>
                                <ul class="list-disc pl-4 space-y-0.5 text-slate-600">
                                    <li>Review, calibrate & officially approve goals (Step 2)</li>
                                    <li>Log continuous supervisor coaching notes (Step 3)</li>
                                    <li>Generate AI SBI coaching models for shift feedback</li>
                                    <li>Conduct formal appraisal & supervisor rating (Step 4)</li>
                                    <li>Lead 1-on-1 calibration meetings with employee (Step 5)</li>
                                    <li>Design & assign 70-20-10 IDPs to subordinates (Step 6)</li>
                                </ul>
                            </div>
                        </div>

                        <!-- 3. HR Director -->
                        <div class="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-2.5">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-purple-950 text-sm flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-purple-500 mr-2"></span> 3. HR Director (Admin)
                                </span>
                                <span
                                    class="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Elena
                                    Vance</span>
                            </div>
                            <p class="text-slate-600 text-[11px]"><strong>Scope:</strong> Hotel-Wide Governance</p>
                            <div class="space-y-1 text-[11px] text-slate-700">
                                <p class="text-emerald-700 font-semibold"><i class="fas fa-check-circle mr-1"></i>
                                    <strong>What HR Director CAN do:</strong>
                                </p>
                                <ul class="list-disc pl-4 space-y-0.5 text-slate-600">
                                    <li>Normalize appraisal bell curves & finalize ratings</li>
                                    <li>Manage competency frameworks & team matrix</li>
                                    <li>Conduct Training Needs Analysis (TNA) & compliance</li>
                                    <li>Manage 9-Box Succession Grids & talent bench</li>
                                    <li>Export formal audit reports & compliance logs</li>
                                </ul>
                            </div>
                        </div>

                        <!-- 4. General Manager -->
                        <div class="p-4 rounded-2xl border border-slate-300 bg-slate-100/60 space-y-2.5">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-slate-950 text-sm flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-slate-700 mr-2"></span> 4. General Manager
                                    (Exec)
                                </span>
                                <span
                                    class="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">Robert
                                    Sterling</span>
                            </div>
                            <p class="text-slate-600 text-[11px]"><strong>Scope:</strong> Executive Strategic Oversight
                            </p>
                            <div class="space-y-1 text-[11px] text-slate-700">
                                <p class="text-emerald-700 font-semibold"><i class="fas fa-check-circle mr-1"></i>
                                    <strong>What GM CAN do:</strong>
                                </p>
                                <ul class="list-disc pl-4 space-y-0.5 text-slate-600">
                                    <li>Review property-wide Hospitality Index & NPS</li>
                                    <li>Approve executive leadership succession appointments</li>
                                    <li>Monitor department operational efficiency & sentiment</li>
                                    <li>Access high-level executive strategic briefings</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                </div>

                <div class="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex justify-end">
                    <button onclick="closeModal('modal-role-matrix')"
                        class="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary-dark transition">Understood</button>
                </div>
            </div>
        </div>
