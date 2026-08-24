<!-- ========================================================================= -->
        <div id="auth-screen"
            class="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
                class="bg-white rounded-3xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl border border-slate-100 my-auto">

                <!-- Left Branding Pane -->
                <div
                    class="bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
                    <div class="relative z-10 space-y-6">
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                <i class="fas fa-hotel"></i>
                            </div>
                            <div>
                                <span class="font-heading font-bold text-2xl tracking-tight">Pulse</span>
                                <span
                                    class="text-[10px] font-bold text-primary-200 bg-primary/30 px-2 py-0.5 rounded-full ml-1 uppercase tracking-wider">Hospitality</span>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <h2 class="font-heading font-bold text-2xl sm:text-3xl text-white leading-tight">
                                Performance & Development Hub
                            </h2>
                            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                A streamlined, clutter-free workspace connecting <strong>Performance Planning</strong>,
                                <strong>Competencies</strong>, <strong>LMS Training</strong>,
                                <strong>Succession</strong>, and <strong>Realtime Shift Climate</strong>.
                            </p>
                        </div>

                        <div class="space-y-2.5 pt-2 text-xs text-slate-300">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-check-circle text-emerald-400"></i>
                                <span>7-Step Continuous Performance & Goal Stepper</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-check-circle text-emerald-400"></i>
                                <span>Gemini AI SBI Coaching & Alignment Copilot</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-check-circle text-emerald-400"></i>
                                <span>Realtime Shift Sentiment & 9-Box Succession Bench</span>
                            </div>
                        </div>
                    </div>

                    <div
                        class="text-[11px] text-slate-400 pt-6 border-t border-white/10 relative z-10 flex items-center justify-between">
                        <span>Grand Horizon Palace Hotel</span>
                        <span>Powered by Gemini API</span>
                    </div>
                </div>

                <!-- Right Fast Sign-In Card -->
                <div class="p-8 sm:p-10 flex flex-col justify-center space-y-6 bg-white">
                    <div>
                        <h3 class="font-heading font-bold text-2xl text-slate-900">Welcome to Pulse</h3>
                        <p class="text-xs text-slate-500 mt-1">Select a role demo to explore the clean workspace
                            instantly:</p>
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
                                    <p class="text-[10px] text-slate-500">Supervisor / F&B</p>
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
                        class="space-y-3.5 pt-2 border-t border-slate-100 text-xs">
                        <div>
                            <label class="block font-semibold text-slate-700 text-[11px] mb-1">Work Email</label>
                            <input type="email" required value="maria.santos@grandhorizonhotel.com"
                                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary focus:outline-none">
                        </div>
                        <button type="submit"
                            class="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-full text-xs transition shadow-sm flex items-center justify-center space-x-2 btn-raindrop btn-raindrop-primary">
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
