<!-- ========================================================================= -->
        <div id="auth-screen"
            class="fixed inset-0 z-50 bg-[#211A1A]/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
                class="bg-white rounded-3xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl border border-[#E8DEDC] my-auto">

                <!-- Left Branding Pane -->
                <div
                    class="bg-[#7A1519] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-r border-[#9E1B20]">
                    <div class="relative z-10 space-y-6">
                        <div class="flex items-center space-x-3">
                            <img src="public/images/removed-bg-logo.png" alt="Oxford Suites Makati Logo" class="h-12 w-auto object-contain bg-white/95 rounded-xl p-1.5 shadow-sm">
                            <div>
                                <span class="font-heading font-bold text-2xl tracking-tight text-white block leading-tight">Oxford Suites</span>
                                <span
                                    class="text-[11px] font-bold text-gold-light uppercase tracking-wider block">Makati · Performance Hub</span>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <h2 class="font-heading font-bold text-2xl sm:text-3xl text-white leading-tight">
                                Performance &amp; Development Hub
                            </h2>
                            <p class="text-xs sm:text-sm text-[#F1E9E7] leading-relaxed">
                                A streamlined, clutter-free workspace connecting <strong>Performance Planning</strong>,
                                <strong>Competencies</strong>, <strong>LMS Training</strong>,
                                <strong>Succession</strong>, and <strong>Realtime Shift Climate</strong>.
                            </p>
                        </div>

                        <div class="space-y-2.5 pt-2 text-xs text-[#F1E9E7]">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-check-circle text-sage-light"></i>
                                <span>7-Step Continuous Performance &amp; Goal Stepper</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-check-circle text-sage-light"></i>
                                <span>Gemini AI SBI Coaching &amp; Alignment Copilot</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-check-circle text-sage-light"></i>
                                <span>Realtime Shift Sentiment &amp; 9-Box Succession Bench</span>
                            </div>
                        </div>
                    </div>

                    <div
                        class="text-[11px] text-[#F1E9E7]/80 pt-6 border-t border-white/15 relative z-10 flex items-center justify-between">
                        <span>Oxford Suites, Makati</span>
                        <span>Powered by Gemini API</span>
                    </div>
                </div>

                <!-- Right Fast Sign-In Card -->
                <div class="p-8 sm:p-10 flex flex-col justify-center space-y-6 bg-white">
                    <div>
                        <h3 class="font-heading font-bold text-2xl text-slate-900">Welcome to Oxford Suites</h3>
                        <p class="text-xs text-slate-500 mt-1">Select a role demo to explore the workspace instantly:</p>
                    </div>

                    <!-- 1-Click Persona Demo Grid -->
                    <div class="grid grid-cols-2 gap-2.5 text-left">
                        <button type="button" onclick="fastLoginAs('employee')"
                            class="p-3 rounded-2xl border border-slate-200 hover:border-primary hover:bg-primary-50/40 transition text-left group">
                            <div class="flex items-center space-x-2.5">
                                <div
                                    class="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
                                    MS</div>
                                <div>
                                    <p class="text-xs font-bold text-slate-800">Maria Santos</p>
                                    <p class="text-[10px] text-slate-500">Front Desk Host</p>
                                </div>
                            </div>
                        </button>

                        <button type="button" onclick="fastLoginAs('manager')"
                            class="p-3 rounded-2xl border border-slate-200 hover:border-primary hover:bg-primary-50/40 transition text-left group">
                            <div class="flex items-center space-x-2.5">
                                <div
                                    class="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                                    CM</div>
                                <div>
                                    <p class="text-xs font-bold text-slate-800">Chef Marco</p>
                                    <p class="text-[10px] text-slate-500">Supervisor / F&amp;B</p>
                                </div>
                            </div>
                        </button>

                        <button type="button" onclick="fastLoginAs('hr')"
                            class="p-3 rounded-2xl border border-slate-200 hover:border-primary hover:bg-primary-50/40 transition text-left group">
                            <div class="flex items-center space-x-2.5">
                                <div
                                    class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                                    EV</div>
                                <div>
                                    <p class="text-xs font-bold text-slate-800">Elena Vance</p>
                                    <p class="text-[10px] text-slate-500">HR Director</p>
                                </div>
                            </div>
                        </button>

                        <button type="button" onclick="fastLoginAs('executive')"
                            class="p-3 rounded-2xl border border-slate-200 hover:border-primary hover:bg-primary-50/40 transition text-left group">
                            <div class="flex items-center space-x-2.5">
                                <div
                                    class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                                    RS</div>
                                <div>
                                    <p class="text-xs font-bold text-slate-800">Robert Sterling</p>
                                    <p class="text-[10px] text-slate-500">General Manager</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    <!-- Or Standard Sign In -->
                    <form onsubmit="handleLoginSubmit(event)"
                        class="space-y-3.5 pt-2 border-t border-[#E8DEDC] text-xs">
                        <div>
                            <label class="block font-semibold text-slate-700 text-[11px] mb-1">Work Email</label>
                            <input type="email" required value="maria.santos@oxfordsuitesmakati.com"
                                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEDC] text-xs focus:ring-2 focus:ring-primary focus:outline-none bg-[#FAF8F7]">
                        </div>
                        <button type="submit"
                            class="w-full py-3 btn-primary text-xs font-bold transition flex items-center justify-center space-x-2">
                            <span>Sign In to Workplace</span>
                            <i class="fas fa-arrow-right text-[10px]"></i>
                        </button>
                    </form>
                </div>

            </div>
        </div>

        <!-- ========================================================================= -->
        <!-- INTERACTIVE WORKFLOW MODALS (LUXURY REDESIGN)                             -->
        <!-- ========================================================================= -->
