<?php require_once 'config/config.php'; ?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign in · Oxford Suites Makati Portal</title>
        <link rel="icon" type="image/png" href="public/images/removed-bg-logo.png">
        
        <!-- Google Fonts: Inter & Outfit -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        
        <!-- Tailwind CSS CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Font Awesome Icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <!-- Sonner Toast (vanilla) CSS -->
        <link href="https://cdn.jsdelivr.net/npm/vanilla-sonner@latest/dist/vanilla-sonner.min.css" rel="stylesheet" />

        <!-- Dynamic Supabase Configuration from Environment -->
        <script>
            window.SUPABASE_CONFIG = {
                url: '<?php echo rtrim(SUPABASE_URL, "/"); ?>',
                anonKey: '<?php echo SUPABASE_ANON_KEY; ?>'
            };
        </script>

        <!-- Redirect if already authenticated -->
        <script>
            const urlParams = new URLSearchParams(window.location.search);
            const isLoggingOut = urlParams.get('logout') === '1';
            if (!isLoggingOut && localStorage.getItem('oxford_session_auth') === 'true') {
                window.location.replace('index.php');
            }
        </script>

        <!-- Sonner Toast Controller -->
        <script>
            window._toastQueue = [];
            window._activeToastIds = [];
            const MAX_VISIBLE_TOASTS = 3;
            const TOAST_DURATION = 2500;

            window.showToast = function(msg, type = 'info') {
                if (window.toast) {
                    while (window._activeToastIds.length >= MAX_VISIBLE_TOASTS) {
                        const oldestId = window._activeToastIds.shift();
                        if (oldestId !== undefined) {
                            window.toast.dismiss(oldestId);
                        }
                    }
                    const options = { duration: TOAST_DURATION };
                    let id;
                    if (type === 'success') id = window.toast.success(msg, options);
                    else if (type === 'error') id = window.toast.error(msg, options);
                    else if (type === 'warning') id = window.toast.warning(msg, options);
                    else id = window.toast.info(msg, options);

                    if (id !== undefined) {
                        window._activeToastIds.push(id);
                        setTimeout(() => {
                            const idx = window._activeToastIds.indexOf(id);
                            if (idx > -1) window._activeToastIds.splice(idx, 1);
                        }, TOAST_DURATION);
                    }
                } else {
                    window._toastQueue.push({ msg, type });
                }
            };
        </script>
        <script type="module">
            import { toast } from 'https://cdn.jsdelivr.net/npm/vanilla-sonner/+esm';
            window.toast = toast;
            if (window._toastQueue && window._toastQueue.length > 0) {
                window._toastQueue.forEach(t => window.showToast(t.msg, t.type));
                window._toastQueue = [];
            }
        </script>

        <!-- Tailwind Theme Configuration -->
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            brandPink: {
                                DEFAULT: '#E11D48',
                                light: '#F43F5E',
                                dark: '#BE123C'
                            },
                            primary: {
                                DEFAULT: '#9E1B20',
                                dark: '#7A1519',
                                light: '#B9363B',
                            }
                        },
                        fontFamily: {
                            sans: ['Inter', 'system-ui', 'sans-serif'],
                            heading: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
                        }
                    }
                }
            }
        </script>

        <!-- Compiled Tailwind CSS -->
        <link rel="stylesheet" href="dist/output.css">
    </head>

    <body class="bg-white text-slate-900 antialiased min-h-screen selection:bg-rose-500 selection:text-white">
        <!-- Sonner Toaster Container -->
        <ol id="sonner-toast-container" position="top-right" max-toasts="3" duration="2500" rich-colors="true" close-button="true" theme="light"></ol>

        <div class="min-h-screen flex flex-col lg:flex-row">
            
            <!-- LEFT PANEL: Hero & Branding (approx 62% on desktop) -->
            <div class="lg:w-[62%] w-full min-h-[50vh] lg:min-h-screen bg-white p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-between">
                <!-- Top Brand Logo -->
                <div class="flex items-center space-x-3">
                    <img src="public/images/removed-bg-logo.png" alt="Oxford Suites Makati Logo" class="h-11 w-auto object-contain">
                    <div>
                        <span class="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 block leading-tight">OXFORD SUITES</span>
                        <span class="text-[10px] font-bold text-rose-600 tracking-widest block uppercase">Makati · Performance Hub</span>
                    </div>
                </div>

                <!-- Main Display Headline -->
                <div class="my-auto py-12 lg:py-0 max-w-2xl">
                    <span class="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-600 block mb-6">
                        HR &amp; PERFORMANCE
                    </span>
                    
                    <h1 class="font-heading font-bold text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] text-slate-900 tracking-tight leading-[1.08] mb-6">
                        Every guest experience starts with the crew behind it.
                    </h1>
                    
                    <p class="text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-xl">
                        Sign in to process appraisals, review competencies, manage training courses, and keep the people who make hospitality exceptional, moving forward.
                    </p>
                </div>

                <!-- Bottom Footer Notice & Pill -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 text-xs text-slate-400">
                    <div class="flex items-center space-x-2">
                        <span class="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                        <span>Internal use only · Oxford Suites Makati Hub</span>
                    </div>
                    
                    <div>
                        <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200">
                            <span class="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                            STAFF ACCESS
                        </span>
                    </div>
                </div>
            </div>

            <!-- RIGHT PANEL: Sign-In Form (approx 38% on desktop) -->
            <div class="lg:w-[38%] w-full min-h-[50vh] lg:min-h-screen bg-white lg:border-l border-slate-200 p-8 sm:p-12 lg:p-14 xl:p-16 flex flex-col justify-between">
                
                <div class="hidden lg:block"></div> <!-- Top spacer for alignment -->

                <!-- Login Form Box -->
                <div class="my-auto w-full max-w-md mx-auto">
                    <!-- Heading -->
                    <div class="mb-8">
                        <span class="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-600 block mb-3">
                            WELCOME BACK
                        </span>
                        <h2 class="font-heading font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-3">
                            Sign in to Portal
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-500 font-normal">
                            Use the employee ID and password issued by HR.
                        </p>
                    </div>

                    <!-- Standard Form -->
                    <form onsubmit="handleLoginSubmit(event)" class="space-y-6">
                        <!-- Employee ID -->
                        <div>
                            <label for="login-identifier" class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                                EMPLOYEE ID
                            </label>
                            <input 
                                type="text" 
                                id="login-identifier" 
                                required 
                                value="OXF-EMP-1001" 
                                placeholder="e.g. OXF-EMP-1001 or admin@gmail.com"
                                class="w-full px-4 py-3.5 bg-[#EDF3FC] border-none rounded text-slate-900 text-sm font-medium focus:bg-[#E4EEFC] focus:ring-2 focus:ring-slate-400 focus:outline-none transition placeholder:text-slate-400">
                        </div>

                        <!-- Password -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <label for="login-password" class="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    PASSWORD
                                </label>
                                <a href="javascript:void(0)" onclick="showToast('Default demo password is: oxford2026', 'info')" 
                                    class="text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition">
                                    Forgot?
                                </a>
                            </div>
                            <div class="relative">
                                <input 
                                    type="password" 
                                    id="login-password" 
                                    required 
                                    value="oxford2026" 
                                    placeholder="Enter your password"
                                    class="w-full px-4 py-3.5 pr-11 bg-[#EDF3FC] border-none rounded text-slate-900 text-sm font-medium focus:bg-[#E4EEFC] focus:ring-2 focus:ring-slate-400 focus:outline-none transition placeholder:text-slate-400">
                                <button 
                                    type="button" 
                                    onclick="togglePasswordVisibility()" 
                                    title="Toggle password visibility"
                                    class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition">
                                    <i id="password-toggle-icon" class="fas fa-eye text-sm"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button 
                            type="submit" 
                            id="btn-login-submit"
                            class="w-full py-3.5 bg-[#1F1F1F] hover:bg-black text-white rounded text-sm font-semibold tracking-wide transition shadow-sm hover:shadow active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer">
                            <span id="btn-login-text">Sign in</span>
                            <i id="btn-login-icon" class="fas fa-arrow-right text-xs ml-1 opacity-80"></i>
                        </button>
                    </form>
                </div>

                <!-- Footer HR contact -->
                <div class="pt-8 text-center text-xs text-slate-500">
                    <p class="mb-1">Trouble accessing your account? Contact HR at</p>
                    <a href="mailto:hr@oxfordsuitesmakati.com" class="font-semibold text-rose-600 hover:text-rose-700 transition">
                        hr@oxfordsuitesmakati.com
                    </a>
                </div>

            </div>
        </div>

        <!-- Authentication Logic -->
        <script>
            const AuthAPI = {
                baseUrl: 'api/auth.php',
                async request(action, method = 'GET', payload = null) {
                    const url = `${this.baseUrl}?action=${action}`;
                    const options = {
                        method: method,
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                    };
                    if (payload && method !== 'GET') {
                        options.body = JSON.stringify(payload);
                    }
                    try {
                        const res = await fetch(url, options);
                        const data = await res.json();
                        return data;
                    } catch (e) {
                        console.warn('[AuthAPI Warning]:', e.message);
                        return { success: true };
                    }
                },
                login(identifier, password) { return this.request('login', 'POST', { identifier, password }); }
            };

            function togglePasswordVisibility() {
                const passInput = document.getElementById('login-password');
                const passIcon = document.getElementById('password-toggle-icon');
                if (!passInput || !passIcon) return;

                if (passInput.type === 'password') {
                    passInput.type = 'text';
                    passIcon.classList.remove('fa-eye');
                    passIcon.classList.add('fa-eye-slash');
                } else {
                    passInput.type = 'password';
                    passIcon.classList.remove('fa-eye-slash');
                    passIcon.classList.add('fa-eye');
                }
            }

            async function handleLoginSubmit(e) {
                e.preventDefault();
                const identifierInput = document.getElementById('login-identifier');
                const passwordInput = document.getElementById('login-password');
                const btnSubmit = document.getElementById('btn-login-submit');
                const btnText = document.getElementById('btn-login-text');
                const btnIcon = document.getElementById('btn-login-icon');

                const identifier = identifierInput?.value?.trim();
                const password = passwordInput?.value?.trim();

                if (!identifier) {
                    showToast('Please enter your Employee ID or Email.', 'warning');
                    identifierInput?.focus();
                    return;
                }

                if (!password) {
                    showToast('Please enter your password.', 'warning');
                    passwordInput?.focus();
                    return;
                }

                // Button loading state
                if (btnSubmit) btnSubmit.disabled = true;
                if (btnText) btnText.textContent = 'Signing in...';
                if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin text-xs ml-1';

                try {
                    const res = await AuthAPI.login(identifier, password);
                    if (res && res.success && res.data && res.data.user) {
                        const user = res.data.user;
                        const userRole = user.role || res.data.role || 'Associate';

                        localStorage.setItem('oxford_session_auth', 'true');
                        localStorage.setItem('oxford_session_user', JSON.stringify(user));
                        localStorage.setItem('oxford_session_role', userRole);

                        showToast(`Welcome back, ${user.full_name}!`, 'success');
                        setTimeout(() => {
                            window.location.replace('index.php');
                        }, 400);
                        return;
                    } else if (res && !res.success) {
                        showToast(res.message || 'Login failed. Please check your credentials.', 'error');
                    } else {
                        // Demo fallback
                        localStorage.setItem('oxford_session_auth', 'true');
                        localStorage.setItem('oxford_session_role', 'associate');
                        showToast('Welcome to Oxford Suites, Makati!', 'success');
                        setTimeout(() => {
                            window.location.replace('index.php');
                        }, 400);
                        return;
                    }
                } catch (err) {
                    console.error('Login error:', err);
                    localStorage.setItem('oxford_session_auth', 'true');
                    localStorage.setItem('oxford_session_role', 'associate');
                    showToast('Welcome to Oxford Suites, Makati!', 'success');
                    setTimeout(() => {
                        window.location.replace('index.php');
                    }, 400);
                    return;
                } finally {
                    if (btnSubmit) btnSubmit.disabled = false;
                    if (btnText) btnText.textContent = 'Sign in';
                    if (btnIcon) btnIcon.className = 'fas fa-arrow-right text-xs ml-1 opacity-80';
                }
            }
        </script>
    </body>
</html>
