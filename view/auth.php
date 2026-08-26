<script>
    if (localStorage.getItem('oxford_session_auth') === 'true') {
        document.write('<style id="auth-hide-style">#auth-screen{display:none!important;}</style>');
    }
</script>
<div id="auth-screen"
    class="fixed inset-0 z-50 bg-[#211A1A]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
    <div
        class="bg-white rounded-3xl max-w-3xl w-full grid grid-cols-1 md:grid-cols-5 overflow-hidden shadow-2xl border border-[#E8DEDC] my-auto">

        <!-- Left Branding Pane (2 Cols) -->
        <div
            class="md:col-span-2 bg-[#7A1519] text-white p-8 flex flex-col justify-between relative overflow-hidden border-r border-[#9E1B20]">
            <div class="relative z-10 space-y-5">
                <div class="flex items-center space-x-3">
                    <img src="public/images/removed-bg-logo.png" alt="Oxford Suites Makati Logo" class="h-11 w-auto object-contain bg-white/95 rounded-xl p-1.5 shadow-sm">
                    <div>
                        <span class="font-heading font-bold text-xl tracking-tight text-white block leading-tight">Oxford Suites</span>
                        <span class="text-[10px] font-bold text-gold-light uppercase tracking-wider block">Makati · Performance Hub</span>
                    </div>
                </div>

                <div class="space-y-1.5">
                    <h2 class="font-heading font-bold text-xl text-white leading-tight">
                        Staff Workplace Portal
                    </h2>
                    <p class="text-xs text-[#F1E9E7]/90 leading-relaxed">
                        Sign in with your official <strong>Employee Code</strong> to access Performance Reviews, Competency Radars, LMS Training, and Succession Planning.
                    </p>
                </div>

                <div class="space-y-2.5 pt-2 text-xs text-[#F1E9E7]">
                    <div class="flex items-center space-x-2.5">
                        <i class="fas fa-shield-halved text-amber-300 text-sm"></i>
                        <span>Secure Role-Based Access</span>
                    </div>
                    <div class="flex items-center space-x-2.5">
                        <i class="fas fa-id-card text-amber-300 text-sm"></i>
                        <span>Verified Associate Credentials</span>
                    </div>
                    <div class="flex items-center space-x-2.5">
                        <i class="fas fa-bolt text-amber-300 text-sm"></i>
                        <span>Realtime Shift Sync &amp; AI Copilot</span>
                    </div>
                </div>
            </div>

            <div class="text-[10px] text-[#F1E9E7]/70 pt-6 border-t border-white/15 relative z-10 flex items-center justify-between">
                <span>Oxford Suites Makati &copy; 2026</span>
                <span>v3.4 Production</span>
            </div>
        </div>

        <!-- Right Sign-In Form (3 Cols) -->
        <div class="md:col-span-3 p-8 sm:p-10 flex flex-col justify-center space-y-5 bg-white">
            <div>
                <span class="badge-primary text-[10px] font-bold mb-2 inline-block">Staff Authentication</span>
                <h3 class="font-heading font-bold text-2xl text-slate-900 leading-tight">Sign In to Workplace</h3>
                <p class="text-xs text-slate-500 mt-1">Enter your assigned Employee Code and Password:</p>
            </div>

            <!-- Standard Employee Code & Password Form -->
            <form onsubmit="handleLoginSubmit(event)" class="space-y-3.5 text-xs">
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="block font-bold text-slate-700 text-[11px]">Employee Code or Email</label>
                        <span class="text-[10px] text-slate-400 font-medium">e.g. OXF-EMP-1001</span>
                    </div>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                            <i class="fas fa-id-badge"></i>
                        </span>
                        <input type="text" id="login-identifier" required value="OXF-EMP-1001" placeholder="Enter Employee Code or Work Email"
                            class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8DEDC] text-xs focus:ring-2 focus:ring-primary focus:outline-none bg-[#FAF8F7] font-semibold text-slate-900 tracking-wide">
                    </div>
                </div>

                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="block font-bold text-slate-700 text-[11px]">Password</label>
                        <span class="text-[10px] text-slate-400">Standard Password: <code class="text-primary font-bold">oxford2026</code></span>
                    </div>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
                            <i class="fas fa-lock"></i>
                        </span>
                        <input type="password" id="login-password" value="oxford2026" placeholder="Enter password" required
                            class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E8DEDC] text-xs focus:ring-2 focus:ring-primary focus:outline-none bg-[#FAF8F7] text-slate-900">
                        <button type="button" onclick="togglePasswordVisibility()" title="Toggle password visibility"
                            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-xs transition">
                            <i id="password-toggle-icon" class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <label class="flex items-center space-x-1.5 cursor-pointer">
                        <input type="checkbox" checked class="rounded text-primary focus:ring-primary h-3.5 w-3.5 border-slate-300">
                        <span>Remember my Employee Code</span>
                    </label>
                    <span class="text-slate-400 text-[10px]">Oxford Suites SSO</span>
                </div>

                <button type="submit" id="btn-login-submit"
                    class="w-full py-3 btn-primary text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                    <span>Sign In to Workplace</span>
                    <i class="fas fa-arrow-right text-[11px]"></i>
                </button>
            </form>

           

        </div>

    </div>
</div>
