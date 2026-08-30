<?php
require_once 'config/config.php';
?>
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
            if (isLoggingOut) {
                localStorage.removeItem('oxford_session_auth');
                localStorage.removeItem('oxford_session_user');
                localStorage.removeItem('oxford_session_role');
            } else if (localStorage.getItem('oxford_session_auth') === 'true') {
                window.location.replace('index.php');
            }
        </script>

        <!-- Sonner Toast Controller -->
        <script>
            window._toastQueue = [];
            window._activeToastIds = [];
            const MAX_VISIBLE_TOASTS = 3;
            const TOAST_DURATION = 3000;

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
                                50: '#FFF5F5',
                                100: '#FDE8E8'
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

        <style>
            .emp-card.selected {
                border-color: #9E1B20 !important;
                background-color: #FFF5F5 !important;
                box-shadow: 0 0 0 2px #9E1B20, 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                transform: translateY(-2px);
            }
            .emp-card.disabled {
                opacity: 0.35;
                pointer-events: none;
                filter: grayscale(80%);
            }
            .modal-backdrop {
                background-color: rgba(15, 23, 42, 0.65);
                backdrop-filter: blur(4px);
            }
            input:focus {
                outline: none;
            }
        </style>
    </head>

    <body class="bg-[#F8FAFC] text-slate-900 antialiased min-h-screen selection:bg-rose-500 selection:text-white">
        <!-- Sonner Toaster Container -->
        <ol id="sonner-toast-container" position="top-right" max-toasts="3" duration="3000" rich-colors="true" close-button="true" theme="light"></ol>

        <!-- =================================================================== -->
        <!-- MAIN PAGE: INITIAL ROLE SIGN-IN SCREEN                             -->
        <!-- =================================================================== -->
        <div class="min-h-screen flex flex-col lg:flex-row">

            <!-- LEFT PANEL: Hero & Branding -->
            <div class="lg:w-[58%] xl:w-[60%] w-full min-h-[40vh] lg:min-h-screen bg-white p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
                <!-- Brand Logo -->
                <div class="flex items-center space-x-3.5">
                    <img src="public/images/removed-bg-logo.png" alt="Oxford Suites Makati Logo" class="h-11 w-auto object-contain">
                    <div>
                        <span class="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 block leading-tight">OXFORD SUITES</span>
                        <span class="text-[10px] font-bold text-rose-600 tracking-widest block uppercase">Makati &middot; Performance Hub</span>
                    </div>
                </div>

                <!-- Main Display Headline -->
                <div class="my-auto py-8 lg:py-0 max-w-2xl">
                    <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 mb-6">
                        <span class="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                        <span class="text-[11px] font-bold uppercase tracking-[0.15em] text-rose-700">
                            ROLE-BASED PORTAL ACCESS
                        </span>
                    </div>

                    <h1 class="font-heading font-bold text-3xl sm:text-4xl lg:text-[3.2rem] xl:text-[3.6rem] text-slate-900 tracking-tight leading-[1.12] mb-6">
                        Every guest experience starts with the crew behind it.
                    </h1>

                    <p class="text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-xl">
                        Sign in with your role-based credentials to verify your profile, manage appraisals, review competencies, and empower hospitality excellence.
                    </p>

                    <!-- Features -->
                    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                        <div class="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <div class="w-8 h-8 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                                <i class="fas fa-users-gear"></i>
                            </div>
                            <div>
                                <h4 class="text-xs font-bold text-slate-800">Role Verification</h4>
                                <p class="text-[11px] text-slate-500">Employee &amp; Supervisor role access</p>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <div class="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                                <i class="fas fa-shield-check"></i>
                            </div>
                            <div>
                                <h4 class="text-xs font-bold text-slate-800">OTP &amp; Session Guard</h4>
                                <p class="text-[11px] text-slate-500">One-time code with Remember Me session</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Notice -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 text-xs text-slate-400">
                    <div class="flex items-center space-x-2">
                        <span class="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                        <span>Internal use only &middot; Oxford Suites Makati Hub</span>
                    </div>

                    <div>
                        <span class="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                            ACTIVE SESSION SYSTEM
                        </span>
                    </div>
                </div>
            </div>

            <!-- RIGHT PANEL: Gateway Sign-In Form -->
            <div class="lg:w-[42%] xl:w-[40%] w-full min-h-[60vh] lg:min-h-screen bg-[#FDFDFE] p-6 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between">

                <div class="my-auto w-full max-w-md mx-auto space-y-6">
                    <div>
                        <span class="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-600 block mb-2">
                            AUTHENTICATION GATEWAY
                        </span>
                        <h2 class="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mb-2">
                            Sign in to Portal
                        </h2>
                        <p class="text-xs sm:text-sm text-slate-500 font-normal">
                            Enter the role-based account credentials to select your employee or supervisor profile.
                        </p>
                    </div>

                    <form onsubmit="handleGatewayLoginSubmit(event)" class="space-y-5">
                        <!-- Role Email / Account Email -->
                        <div>
                            <label for="gateway-email" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                                ROLE ACCOUNT EMAIL
                            </label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
                                    <i class="fas fa-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    id="gateway-email"
                                    required
                                    placeholder="Enter role account email"
                                    class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition shadow-sm placeholder:text-slate-400">
                            </div>
                        </div>

                        <!-- Role Password -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <label for="gateway-password" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                    ACCOUNT PASSWORD
                                </label>
                            </div>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
                                    <i class="fas fa-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    id="gateway-password"
                                    required
                                    placeholder="Enter your account password"
                                    class="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition shadow-sm placeholder:text-slate-400">
                                <button
                                    type="button"
                                    onclick="togglePasswordVisibility('gateway-password', 'gateway-pass-icon')"
                                    title="Toggle password visibility"
                                    class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer">
                                    <i id="gateway-pass-icon" class="fas fa-eye text-xs"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button
                            type="submit"
                            id="btn-gateway-submit"
                            class="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-lg text-sm font-bold tracking-wide transition shadow-sm hover:shadow active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer">
                            <span id="btn-gateway-text">Sign In &amp; Select Profile</span>
                            <i id="btn-gateway-icon" class="fas fa-arrow-right text-xs ml-1 opacity-80"></i>
                        </button>
                    </form>
                </div>

                <!-- Footer HR contact -->
                <div class="pt-6 text-center text-xs text-slate-500">
                    <p class="mb-1">Trouble signing in? Contact People &amp; Culture at</p>
                    <a href="mailto:hr@oxfordsuitesmakati.com" class="font-semibold text-rose-600 hover:text-rose-700 transition">
                        hr@oxfordsuitesmakati.com
                    </a>
                </div>

            </div>
        </div>


        <!-- =================================================================== -->
        <!-- MODAL 1: EMPLOYEE / SUPERVISOR SELECTION MODAL                      -->
        <!-- =================================================================== -->
        <div id="modal-employee-selection" class="fixed inset-0 z-50 modal-backdrop hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                <!-- Modal Header -->
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div class="flex items-center space-x-3">
                        <div id="modal-role-icon" class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-base font-bold">
                            <i class="fas fa-users"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <h3 id="modal-role-title" class="font-heading font-bold text-lg text-slate-900">
                                    Select Employee Profile
                                </h3>
                                <span id="modal-role-badge" class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                                    Employee
                                </span>
                            </div>
                            <p class="text-xs text-slate-500">Click your profile below to continue.</p>
                        </div>
                    </div>
                    <button type="button" onclick="closeModal('modal-employee-selection')" class="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>

                <!-- Search & Filters -->
                <div class="px-6 py-3 border-b border-slate-100 bg-white">
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
                            <i class="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            id="employee-search-input"
                            oninput="filterEmployeeList(this.value)"
                            placeholder="Search by name, title, or email..."
                            class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs font-medium focus:border-rose-600 focus:bg-white focus:ring-2 focus:ring-rose-100 transition placeholder:text-slate-400">
                    </div>
                </div>

                <!-- Employee Cards List -->
                <div class="p-6 overflow-y-auto flex-grow space-y-3" id="employee-cards-container">
                    <div class="text-center py-8 text-slate-400 text-xs">
                        <i class="fas fa-spinner fa-spin text-lg mb-2 text-rose-600"></i>
                        <p>Loading directory profiles...</p>
                    </div>
                </div>

                <!-- Bottom Action Footer -->
                <div id="modal-selection-footer" class="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div id="selected-employee-preview" class="text-xs text-slate-500">
                        <span class="italic">Please select an employee profile from above</span>
                    </div>

                    <div class="flex items-center space-x-2">
                        <button
                            type="button"
                            id="btn-cancel-selection"
                            onclick="resetEmployeeSelection()"
                            class="hidden px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold transition">
                            Change Selection
                        </button>
                        <button
                            type="button"
                            id="btn-confirm-selection"
                            disabled
                            onclick="handleConfirmEmployeeSelection()"
                            class="px-5 py-2.5 rounded-lg bg-slate-300 text-slate-500 text-xs font-bold transition flex items-center space-x-2 cursor-not-allowed">
                            <span id="btn-confirm-text">Select Profile</span>
                            <i id="btn-confirm-icon" class="fas fa-arrow-right text-[10px]"></i>
                        </button>
                    </div>
                </div>

            </div>
        </div>


        <!-- =================================================================== -->
        <!-- MODAL 2: OTP VERIFICATION MODAL                                     -->
        <!-- =================================================================== -->
        <div id="modal-otp-verification" class="fixed inset-0 z-50 modal-backdrop hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                <!-- Modal Header -->
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-base font-bold">
                            <i class="fas fa-key"></i>
                        </div>
                        <div>
                            <h3 class="font-heading font-bold text-lg text-slate-900">
                                Verify One-Time Code
                            </h3>
                            <p class="text-xs text-slate-500">OTP code dispatched to employee email.</p>
                        </div>
                    </div>
                    <button type="button" onclick="closeModal('modal-otp-verification')" class="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>

                <div class="p-6 space-y-5">
                    <!-- Selected Profile Info Banner -->
                    <div class="flex items-center space-x-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div class="w-10 h-10 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-sm shrink-0" id="otp-avatar-container">
                            <span id="otp-avatar-initial">M</span>
                        </div>
                        <div class="truncate">
                            <h4 id="otp-employee-name" class="font-bold text-sm text-slate-900 truncate">Maria Santos</h4>
                            <p id="otp-employee-email" class="text-xs text-slate-500 truncate">maria.santos@oxfordsuitesmakati.com</p>
                        </div>
                    </div>

                    <form onsubmit="handleModalVerifyOtpSubmit(event)" class="space-y-4">
                        <!-- 6-digit Code Input -->
                        <div>
                            <label for="modal-otp-input" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                                6-DIGIT VERIFICATION CODE
                            </label>
                            <input
                                type="text"
                                id="modal-otp-input"
                                maxlength="6"
                                required
                                placeholder="123456"
                                class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xl font-bold tracking-[0.35em] text-center focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition shadow-sm placeholder:text-slate-300">
                        </div>

                        <!-- Remember Me Checkbox -->
                        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <label class="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="modal-remember-me-checkbox"
                                    checked
                                    class="w-4 h-4 mt-0.5 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer">
                                <div class="text-xs">
                                    <span class="font-bold text-slate-800 block">Remember me on this device</span>
                                    <span class="text-[11px] text-slate-500 block">Skip OTP verification on your next sign-in.</span>
                                </div>
                            </label>
                        </div>

                        <!-- Resend and Back Buttons with Rate Limit Status -->
                        <div class="space-y-2 pt-1">
                            <div class="flex items-center justify-between text-xs">
                                <button
                                    type="button"
                                    onclick="openEmployeeSelectionModal()"
                                    class="text-slate-500 hover:text-slate-800 transition">
                                    <i class="fas fa-arrow-left text-[10px] mr-1"></i> Back to Profiles
                                </button>
                                <button
                                    type="button"
                                    id="btn-modal-resend-otp"
                                    onclick="handleModalResendOtp()"
                                    class="text-rose-600 hover:text-rose-700 font-bold transition disabled:opacity-40 disabled:cursor-not-allowed">
                                    Resend Code
                                </button>
                            </div>
                            <div class="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                                <span id="modal-otp-rate-info">Limit: 3 sends / 15 mins</span>
                                <span id="modal-otp-remaining-badge" class="font-semibold text-rose-700"></span>
                            </div>
                        </div>

                        <!-- Verify Button -->
                        <button
                            type="submit"
                            id="btn-modal-verify-otp"
                            class="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-bold tracking-wide transition shadow-sm hover:shadow active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer">
                            <span id="btn-modal-verify-text">Verify &amp; Enter Portal</span>
                            <i id="btn-modal-verify-icon" class="fas fa-check text-xs ml-1"></i>
                        </button>
                    </form>
                </div>

            </div>
        </div>


        <!-- =================================================================== -->
        <!-- MODAL 3: CREATE PASSWORD MODAL (FIRST-TIME USERS)                   -->
        <!-- =================================================================== -->
        <div id="modal-create-password" class="fixed inset-0 z-50 modal-backdrop hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                <!-- Modal Header -->
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base font-bold">
                            <i class="fas fa-shield-halved"></i>
                        </div>
                        <div>
                            <h3 class="font-heading font-bold text-lg text-slate-900">
                                Create Personal Password
                            </h3>
                            <p class="text-xs text-slate-500">First-time account security setup.</p>
                        </div>
                    </div>
                    <button type="button" onclick="closeModal('modal-create-password')" class="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>

                <div class="p-6 space-y-4">
                    <p class="text-xs text-slate-600 leading-relaxed">
                        Create your personal secure password for <strong id="create-pass-employee-name" class="text-slate-800"></strong>. <span class="text-slate-500">Pre-assigned HR passwords are not used.</span>
                    </p>

                    <form onsubmit="handleModalCreatePasswordSubmit(event)" class="space-y-4">
                        <!-- Password -->
                        <div>
                            <label for="modal-new-password" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                                NEW PASSWORD (MIN. 6 CHARACTERS)
                            </label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
                                    <i class="fas fa-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    id="modal-new-password"
                                    required
                                    oninput="checkModalPasswordStrength(this.value)"
                                    placeholder="Enter your personal password"
                                    class="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition shadow-sm placeholder:text-slate-400">
                                <button
                                    type="button"
                                    onclick="togglePasswordVisibility('modal-new-password', 'modal-new-pass-icon')"
                                    class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer">
                                    <i id="modal-new-pass-icon" class="fas fa-eye text-xs"></i>
                                </button>
                            </div>

                            <!-- Strength Meter -->
                            <div class="mt-2">
                                <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                    <div id="modal-pass-strength-bar" class="h-full w-0 transition-all duration-300 bg-rose-500"></div>
                                </div>
                                <span id="modal-pass-strength-text" class="text-[10px] text-slate-400 mt-1 block">At least 6 characters required</span>
                            </div>
                        </div>

                        <!-- Confirm Password -->
                        <div>
                            <label for="modal-confirm-password" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                                CONFIRM PASSWORD
                            </label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
                                    <i class="fas fa-check-double"></i>
                                </span>
                                <input
                                    type="password"
                                    id="modal-confirm-password"
                                    required
                                    placeholder="Re-enter your password"
                                    class="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition shadow-sm placeholder:text-slate-400">
                                <button
                                    type="button"
                                    onclick="togglePasswordVisibility('modal-confirm-password', 'modal-conf-pass-icon')"
                                    class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer">
                                    <i id="modal-conf-pass-icon" class="fas fa-eye text-xs"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button
                            type="submit"
                            id="btn-modal-create-pass-submit"
                            class="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-lg text-sm font-bold tracking-wide transition shadow-sm hover:shadow active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer">
                            <span id="btn-modal-create-pass-text">Complete Setup &amp; Sign In</span>
                            <i id="btn-modal-create-pass-icon" class="fas fa-arrow-right text-xs ml-1"></i>
                        </button>
                    </form>
                </div>

            </div>
        </div>


        <!-- =================================================================== -->
        <!-- MODAL 4: REMEMBERED STAFF PASSWORD LOGIN MODAL                      -->
        <!-- =================================================================== -->
        <div id="modal-remembered-login" class="fixed inset-0 z-50 modal-backdrop hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                <!-- Modal Header -->
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base font-bold">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <div>
                            <h3 class="font-heading font-bold text-lg text-slate-900">
                                Staff Sign In
                            </h3>
                            <p class="text-xs text-emerald-600 font-semibold flex items-center">
                                <i class="fas fa-shield-check mr-1"></i> Remembered on this device
                            </p>
                        </div>
                    </div>
                    <button type="button" onclick="closeModal('modal-remembered-login')" class="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>

                <div class="p-6 space-y-5">
                    <!-- Profile snippet -->
                    <div class="flex items-center space-x-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div class="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shrink-0" id="rem-avatar-container">
                            <span id="rem-avatar-initial">M</span>
                        </div>
                        <div class="truncate">
                            <h4 id="rem-employee-name" class="font-bold text-sm text-slate-900 truncate">Maria Santos</h4>
                            <p id="rem-employee-email" class="text-xs text-slate-500 truncate">maria.santos@oxfordsuitesmakati.com</p>
                        </div>
                    </div>

                    <form onsubmit="handleRememberedPasswordSubmit(event)" class="space-y-4">
                        <!-- Password -->
                        <div>
                            <label for="modal-rem-password" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                                ENTER YOUR PERSONAL PASSWORD
                            </label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none text-xs">
                                    <i class="fas fa-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    id="modal-rem-password"
                                    required
                                    placeholder="Enter your personal password"
                                    class="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition shadow-sm placeholder:text-slate-400">
                                <button
                                    type="button"
                                    onclick="togglePasswordVisibility('modal-rem-password', 'modal-rem-pass-icon')"
                                    class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer">
                                    <i id="modal-rem-pass-icon" class="fas fa-eye text-xs"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Fallback / Alternative Link -->
                        <div class="flex items-center justify-between text-xs">
                            <button
                                type="button"
                                onclick="openEmployeeSelectionModal()"
                                class="text-slate-500 hover:text-slate-800 transition">
                                <i class="fas fa-arrow-left text-[10px] mr-1"></i> Change Profile
                            </button>
                            <button
                                type="button"
                                onclick="fallbackToOtpFromRemembered()"
                                class="text-rose-600 hover:text-rose-700 font-bold transition">
                                Sign in with OTP instead
                            </button>
                        </div>

                        <!-- Submit Button -->
                        <button
                            type="submit"
                            id="btn-modal-rem-submit"
                            class="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-lg text-sm font-bold tracking-wide transition shadow-sm hover:shadow active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer">
                            <span id="btn-modal-rem-text">Sign In &amp; Enter Portal</span>
                            <i id="btn-modal-rem-icon" class="fas fa-arrow-right text-xs ml-1"></i>
                        </button>
                    </form>
                </div>

            </div>
        </div>


        <!-- =================================================================== -->
        <!-- JAVASCRIPT: AUTHENTICATION & MODAL CONTROLLER                       -->
        <!-- =================================================================== -->
        <script>
            // Application State
            let currentVerifiedRole = 'Employee';
            let currentRoleEmployees = [];
            let selectedEmployee = null;
            let currentSetupToken = '';

            // API Service
            const AuthAPI = {
                baseUrl: 'api/auth.php',
                async request(action, method = 'GET', payload = null) {
                    const url = `${this.baseUrl}?action=${action}`;
                    const options = {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    };
                    if (payload && method !== 'GET') {
                        options.body = JSON.stringify(payload);
                    }
                    try {
                        const res = await fetch(url, options);
                        return await res.json();
                    } catch (e) {
                        console.error('[AuthAPI Error]:', e);
                        return { success: false, message: 'Server communication error.' };
                    }
                },
                roleLogin(email, password) {
                    return this.request('role_login', 'POST', { email, password });
                },
                getRoleEmployees(role) {
                    return this.request('get_role_employees', 'GET', { role });
                },
                requestOtp(email, full_name, user_id) {
                    return this.request('request_otp', 'POST', { email, full_name, user_id });
                },
                verifyOtp(email, otp, remember_me) {
                    return this.request('verify_otp', 'POST', { email, otp, remember_me });
                },
                createPassword(setup_token, password, confirm_password, email) {
                    return this.request('create_password', 'POST', { setup_token, password, confirm_password, email });
                },
                loginEmployeePassword(email, password, remember_me) {
                    return this.request('login_employee_password', 'POST', { email, password, remember_me });
                }
            };

            // Modal Helper Functions
            function openModal(modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.remove('hidden');
                }
            }

            function closeModal(modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('hidden');
                }
            }

            function closeAllModals() {
                ['modal-employee-selection', 'modal-otp-verification', 'modal-create-password', 'modal-remembered-login'].forEach(closeModal);
            }

            // Toggle Password Visibility
            function togglePasswordVisibility(inputId, iconId) {
                const input = document.getElementById(inputId);
                const icon = document.getElementById(iconId);
                if (!input || !icon) return;

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            }

            // Real-time password strength
            function checkModalPasswordStrength(val) {
                const bar = document.getElementById('modal-pass-strength-bar');
                const text = document.getElementById('modal-pass-strength-text');
                if (!bar || !text) return;

                let score = 0;
                if (val.length >= 6) score += 1;
                if (val.length >= 8) score += 1;
                if (/[A-Z]/.test(val)) score += 1;
                if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score += 1;

                if (val.length === 0) {
                    bar.style.width = '0%';
                    text.textContent = 'At least 6 characters required';
                    text.className = 'text-[10px] text-slate-400 mt-1 block';
                } else if (score <= 1) {
                    bar.style.width = '25%';
                    bar.className = 'h-full transition-all duration-300 bg-rose-500';
                    text.textContent = 'Weak (Must be at least 6 characters)';
                    text.className = 'text-[10px] text-rose-500 font-semibold mt-1 block';
                } else if (score === 2) {
                    bar.style.width = '50%';
                    bar.className = 'h-full transition-all duration-300 bg-amber-500';
                    text.textContent = 'Medium password';
                    text.className = 'text-[10px] text-amber-600 font-semibold mt-1 block';
                } else if (score === 3) {
                    bar.style.width = '75%';
                    bar.className = 'h-full transition-all duration-300 bg-blue-500';
                    text.textContent = 'Good password';
                    text.className = 'text-[10px] text-blue-600 font-semibold mt-1 block';
                } else {
                    bar.style.width = '100%';
                    bar.className = 'h-full transition-all duration-300 bg-emerald-500';
                    text.textContent = 'Strong password';
                    text.className = 'text-[10px] text-emerald-600 font-semibold mt-1 block';
                }
            }

            // -----------------------------------------------------------------
            // STEP 1: INITIAL GATEWAY ROLE SIGN-IN SUBMIT
            // -----------------------------------------------------------------
            async function handleGatewayLoginSubmit(e) {
                e.preventDefault();
                const emailInput = document.getElementById('gateway-email');
                const passInput = document.getElementById('gateway-password');
                const btn = document.getElementById('btn-gateway-submit');
                const btnText = document.getElementById('btn-gateway-text');
                const btnIcon = document.getElementById('btn-gateway-icon');

                const email = emailInput?.value?.trim();
                const password = passInput?.value?.trim();

                if (!email || !password) {
                    showToast('Please enter both email and password.', 'warning');
                    return;
                }

                if (btn) btn.disabled = true;
                if (btnText) btnText.textContent = 'Verifying role access...';
                if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin text-xs ml-1';

                try {
                    const res = await AuthAPI.roleLogin(email, password);
                    if (res && res.success) {
                        currentVerifiedRole = res.role || 'Employee';
                        currentRoleEmployees = res.employees || [];

                        showToast(res.message || `Signed into ${currentVerifiedRole} gateway!`, 'success');
                        openEmployeeSelectionModal();
                    } else {
                        showToast(res.message || 'Invalid role account credentials.', 'error');
                    }
                } catch (err) {
                    console.error('Role login error:', err);
                    showToast('Communication error during role authentication.', 'error');
                } finally {
                    if (btn) btn.disabled = false;
                    if (btnText) btnText.textContent = 'Sign In & Select Profile';
                    if (btnIcon) btnIcon.className = 'fas fa-arrow-right text-xs ml-1 opacity-80';
                }
            }

            // -----------------------------------------------------------------
            // STEP 2: RENDER & HANDLE EMPLOYEE / SUPERVISOR SELECTION MODAL
            // -----------------------------------------------------------------
            function openEmployeeSelectionModal() {
                closeAllModals();
                selectedEmployee = null;

                const roleBadge = document.getElementById('modal-role-badge');
                const roleTitle = document.getElementById('modal-role-title');
                const roleIcon = document.getElementById('modal-role-icon');

                if (currentVerifiedRole === 'Supervisor') {
                    roleBadge.textContent = 'Supervisor Role';
                    roleBadge.className = 'px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200';
                    roleTitle.textContent = 'Select Supervisor Profile';
                    roleIcon.className = 'w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-base font-bold';
                    roleIcon.innerHTML = '<i class="fas fa-user-tie"></i>';
                } else {
                    roleBadge.textContent = 'Employee Role';
                    roleBadge.className = 'px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-rose-100 text-rose-700 border border-rose-200';
                    roleTitle.textContent = 'Select Employee Profile';
                    roleIcon.className = 'w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-base font-bold';
                    roleIcon.innerHTML = '<i class="fas fa-users"></i>';
                }

                renderEmployeeCards(currentRoleEmployees);
                resetEmployeeSelection();
                openModal('modal-employee-selection');
            }

            function renderEmployeeCards(employees) {
                const container = document.getElementById('employee-cards-container');
                if (!container) return;

                if (!employees || employees.length === 0) {
                    container.innerHTML = `
                        <div class="text-center py-10 text-slate-400 text-xs">
                            <i class="fas fa-user-slash text-2xl mb-2 text-slate-300"></i>
                            <p>No employee profiles found matching this role.</p>
                        </div>`;
                    return;
                }

                container.innerHTML = '';
                employees.forEach(emp => {
                    const card = document.createElement('div');
                    card.id = `emp-card-${emp.id}`;
                    card.className = 'emp-card p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition duration-150 cursor-pointer flex items-center justify-between';
                    card.onclick = () => handleSelectEmployeeCard(emp);

                    const avatarHtml = emp.avatar_url 
                        ? `<img src="${emp.avatar_url}" alt="${emp.full_name}" class="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200">`
                        : `<div class="w-11 h-11 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shrink-0">${emp.full_name.charAt(0)}</div>`;

                    const rememberedBadge = emp.is_remembered
                        ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                             <i class="fas fa-shield-check mr-1 text-[9px]"></i> Remembered
                           </span>`
                        : `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                             <i class="fas fa-key mr-1 text-[9px]"></i> OTP Required
                           </span>`;

                    card.innerHTML = `
                        <div class="flex items-center space-x-3.5 overflow-hidden">
                            ${avatarHtml}
                            <div class="truncate">
                                <h4 class="font-bold text-sm text-slate-900 truncate">${emp.full_name}</h4>
                                <p class="text-xs text-slate-500 truncate">${emp.title} &middot; <span class="text-slate-400">${emp.email}</span></p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3 shrink-0 ml-3">
                            ${rememberedBadge}
                            <div class="select-radio w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                <div class="radio-inner w-2.5 h-2.5 rounded-full bg-rose-600 hidden"></div>
                            </div>
                        </div>
                    `;

                    container.appendChild(card);
                });
            }

            function filterEmployeeList(query) {
                const q = query.toLowerCase().trim();
                const filtered = currentRoleEmployees.filter(emp => 
                    emp.full_name.toLowerCase().includes(q) ||
                    emp.email.toLowerCase().includes(q) ||
                    (emp.title && emp.title.toLowerCase().includes(q))
                );
                renderEmployeeCards(filtered);
            }

            function handleSelectEmployeeCard(emp) {
                selectedEmployee = emp;

                // Highlight selected card and disable other cards
                const allCards = document.querySelectorAll('.emp-card');
                allCards.forEach(c => {
                    if (c.id === `emp-card-${emp.id}`) {
                        c.classList.add('selected');
                        c.classList.remove('disabled');
                        const radioInner = c.querySelector('.radio-inner');
                        if (radioInner) radioInner.classList.remove('hidden');
                        const radioBorder = c.querySelector('.select-radio');
                        if (radioBorder) radioBorder.classList.replace('border-slate-300', 'border-rose-600');
                    } else {
                        c.classList.remove('selected');
                        c.classList.add('disabled'); // Disable unclicked employees!
                        const radioInner = c.querySelector('.radio-inner');
                        if (radioInner) radioInner.classList.add('hidden');
                        const radioBorder = c.querySelector('.select-radio');
                        if (radioBorder) radioBorder.classList.replace('border-rose-600', 'border-slate-300');
                    }
                });

                // Update bottom action container
                const preview = document.getElementById('selected-employee-preview');
                const btnConfirm = document.getElementById('btn-confirm-selection');
                const btnCancel = document.getElementById('btn-cancel-selection');
                const btnText = document.getElementById('btn-confirm-text');
                const btnIcon = document.getElementById('btn-confirm-icon');

                if (preview) {
                    preview.innerHTML = `Selected: <strong class="text-slate-900">${emp.full_name}</strong> (${emp.email})`;
                }

                if (btnCancel) btnCancel.classList.remove('hidden');

                if (btnConfirm) {
                    btnConfirm.disabled = false;
                    btnConfirm.classList.remove('bg-slate-300', 'text-slate-500', 'cursor-not-allowed');

                    // If remembered -> Action is "Log In"
                    if (emp.is_remembered) {
                        btnConfirm.className = 'px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-sm';
                        btnText.textContent = 'Log In';
                        btnIcon.className = 'fas fa-arrow-right text-[10px] ml-1';
                    } else {
                        // If not remembered -> Action is "Send OTP"
                        btnConfirm.className = 'px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-sm';
                        btnText.textContent = 'Send OTP Code';
                        btnIcon.className = 'fas fa-paper-plane text-[10px] ml-1';
                    }
                }
            }

            function resetEmployeeSelection() {
                selectedEmployee = null;
                const allCards = document.querySelectorAll('.emp-card');
                allCards.forEach(c => {
                    c.classList.remove('selected', 'disabled');
                    const radioInner = c.querySelector('.radio-inner');
                    if (radioInner) radioInner.classList.add('hidden');
                    const radioBorder = c.querySelector('.select-radio');
                    if (radioBorder) radioBorder.classList.replace('border-rose-600', 'border-slate-300');
                });

                const preview = document.getElementById('selected-employee-preview');
                const btnConfirm = document.getElementById('btn-confirm-selection');
                const btnCancel = document.getElementById('btn-cancel-selection');
                const btnText = document.getElementById('btn-confirm-text');

                if (preview) preview.innerHTML = '<span class="italic">Please select an employee profile from above</span>';
                if (btnCancel) btnCancel.classList.add('hidden');
                if (btnConfirm) {
                    btnConfirm.disabled = true;
                    btnConfirm.className = 'px-5 py-2.5 rounded-lg bg-slate-300 text-slate-500 text-xs font-bold transition flex items-center space-x-2 cursor-not-allowed';
                    btnText.textContent = 'Select Profile';
                }
            }

            // -----------------------------------------------------------------
            // STEP 3: HANDLE CONFIRM SELECTION (DISPATCH OTP OR SHOW PASSWORD)
            // -----------------------------------------------------------------
            async function handleConfirmEmployeeSelection() {
                if (!selectedEmployee) {
                    showToast('Please select an employee profile first.', 'warning');
                    return;
                }

                // CASE 1: REMEMBERED EMPLOYEE -> Open Password Modal directly!
                if (selectedEmployee.is_remembered) {
                    openRememberedPasswordModal(selectedEmployee);
                    return;
                }

                // CASE 2: NOT REMEMBERED -> Send OTP & Open OTP Modal!
                const btn = document.getElementById('btn-confirm-selection');
                const btnText = document.getElementById('btn-confirm-text');
                const btnIcon = document.getElementById('btn-confirm-icon');

                if (btn) btn.disabled = true;
                if (btnText) btnText.textContent = 'Sending OTP...';
                if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin text-[10px] ml-1';

                try {
                    const res = await AuthAPI.requestOtp(selectedEmployee.email, selectedEmployee.full_name, selectedEmployee.id);
                    if (res && res.success) {
                        showToast(res.message || 'OTP verification code sent to your email!', 'success');
                        openOtpModal(selectedEmployee, res.remaining_sends);
                    } else if (res && res.rate_limited) {
                        showToast(res.message, 'warning');
                        openOtpModal(selectedEmployee, 0);
                    } else {
                        showToast(res.message || 'Failed to dispatch verification code.', 'error');
                    }
                } catch (e) {
                    console.error('Request OTP error:', e);
                    showToast('Communication error dispatching OTP.', 'error');
                } finally {
                    if (btn) btn.disabled = false;
                    if (btnText) btnText.textContent = 'Send OTP Code';
                    if (btnIcon) btnIcon.className = 'fas fa-paper-plane text-[10px] ml-1';
                }
            }

            // -----------------------------------------------------------------
            // STEP 4: OTP MODAL & VERIFICATION WITH RATE LIMITING
            // -----------------------------------------------------------------
            let otpResendTimer = null;

            function openOtpModal(employee, remainingSends = 2) {
                closeAllModals();

                document.getElementById('otp-employee-name').textContent = employee.full_name;
                document.getElementById('otp-employee-email').textContent = employee.email;
                document.getElementById('otp-avatar-initial').textContent = employee.full_name.charAt(0);
                document.getElementById('modal-otp-input').value = '';

                updateOtpRateLimitUI(remainingSends, 30);
                openModal('modal-otp-verification');
                setTimeout(() => document.getElementById('modal-otp-input')?.focus(), 200);
            }

            function updateOtpRateLimitUI(remainingSends, cooldownSeconds = 0) {
                const resendBtn = document.getElementById('btn-modal-resend-otp');
                const badge = document.getElementById('modal-otp-remaining-badge');
                const rateInfo = document.getElementById('modal-otp-rate-info');

                if (otpResendTimer) {
                    clearInterval(otpResendTimer);
                    otpResendTimer = null;
                }

                if (badge) {
                    if (remainingSends > 0) {
                        badge.textContent = `${remainingSends} resend${remainingSends > 1 ? 's' : ''} left`;
                        badge.className = 'font-semibold text-rose-700';
                    } else {
                        badge.textContent = 'Limit reached (0 left)';
                        badge.className = 'font-semibold text-amber-600';
                    }
                }

                if (remainingSends <= 0) {
                    if (resendBtn) {
                        resendBtn.disabled = true;
                        resendBtn.textContent = 'Limit Reached';
                    }
                    if (rateInfo) rateInfo.textContent = 'Wait 15 mins to request new codes';
                    return;
                }

                if (cooldownSeconds > 0 && resendBtn) {
                    let secondsLeft = cooldownSeconds;
                    resendBtn.disabled = true;
                    resendBtn.textContent = `Resend (${secondsLeft}s)`;

                    otpResendTimer = setInterval(() => {
                        secondsLeft--;
                        if (secondsLeft <= 0) {
                            clearInterval(otpResendTimer);
                            otpResendTimer = null;
                            resendBtn.disabled = false;
                            resendBtn.textContent = 'Resend Code';
                        } else {
                            resendBtn.textContent = `Resend (${secondsLeft}s)`;
                        }
                    }, 1000);
                } else if (resendBtn) {
                    resendBtn.disabled = false;
                    resendBtn.textContent = 'Resend Code';
                }
            }

            async function handleModalResendOtp() {
                if (!selectedEmployee) return;
                const btn = document.getElementById('btn-modal-resend-otp');
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = 'Resending...';
                }

                try {
                    const res = await AuthAPI.requestOtp(selectedEmployee.email, selectedEmployee.full_name, selectedEmployee.id);
                    if (res && res.success) {
                        showToast(res.message || 'New verification code sent to your email!', 'success');
                        updateOtpRateLimitUI(res.remaining_sends, 30);
                    } else if (res && res.rate_limited) {
                        showToast(res.message, 'warning');
                        updateOtpRateLimitUI(0, 0);
                    } else {
                        showToast(res.message || 'Failed to resend code.', 'error');
                        if (btn) btn.disabled = false;
                    }
                } catch (e) {
                    console.error('Resend OTP error:', e);
                    showToast('Communication error during resend.', 'error');
                    if (btn) btn.disabled = false;
                }
            }

            async function handleModalVerifyOtpSubmit(e) {
                e.preventDefault();
                if (!selectedEmployee) return;

                const otpInput = document.getElementById('modal-otp-input');
                const rememberMe = document.getElementById('modal-remember-me-checkbox')?.checked || false;
                const btn = document.getElementById('btn-modal-verify-otp');
                const btnText = document.getElementById('btn-modal-verify-text');
                const btnIcon = document.getElementById('btn-modal-verify-icon');

                const otp = otpInput?.value?.trim();
                if (!otp || otp.length < 6) {
                    showToast('Please enter the 6-digit verification code.', 'warning');
                    otpInput?.focus();
                    return;
                }

                if (btn) btn.disabled = true;
                if (btnText) btnText.textContent = 'Verifying code...';
                if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin text-xs ml-1';

                try {
                    const res = await AuthAPI.verifyOtp(selectedEmployee.email, otp, rememberMe);
                    if (res && res.success) {
                        // CASE A: EXISTING ACCOUNT -> Logged in directly!
                        if (res.logged_in) {
                            const user = res.user || selectedEmployee;
                            const role = res.role || currentVerifiedRole;

                            localStorage.setItem('oxford_session_auth', 'true');
                            localStorage.setItem('oxford_session_user', JSON.stringify(user));
                            localStorage.setItem('oxford_session_role', role);

                            showToast(res.message || `Welcome back, ${user.full_name}!`, 'success');
                            setTimeout(() => {
                                window.location.replace(res.redirect || 'index.php');
                            }, 500);
                            return;
                        }

                        // CASE B: FIRST TIME USER -> Open Create Password Modal!
                        currentSetupToken = res.setup_token || '';
                        showToast('Code confirmed! Please create your personal password.', 'info');
                        openCreatePasswordModal(selectedEmployee);
                    } else {
                        showToast(res.message || 'Invalid verification code.', 'error');
                        otpInput?.focus();
                    }
                } catch (err) {
                    console.error('Verify OTP error:', err);
                    showToast('Verification communication error.', 'error');
                } finally {
                    if (btn) btn.disabled = false;
                    if (btnText) btnText.textContent = 'Verify & Enter Portal';
                    if (btnIcon) btnIcon.className = 'fas fa-check text-xs ml-1';
                }
            }

            // -----------------------------------------------------------------
            // STEP 5: CREATE PASSWORD MODAL (FOR NEW USERS)
            // -----------------------------------------------------------------
            function openCreatePasswordModal(employee) {
                closeAllModals();
                document.getElementById('create-pass-employee-name').textContent = employee.full_name;
                document.getElementById('modal-new-password').value = '';
                document.getElementById('modal-confirm-password').value = '';
                openModal('modal-create-password');
                setTimeout(() => document.getElementById('modal-new-password')?.focus(), 200);
            }

            async function handleModalCreatePasswordSubmit(e) {
                e.preventDefault();
                if (!selectedEmployee) return;

                const passInput = document.getElementById('modal-new-password');
                const confInput = document.getElementById('modal-confirm-password');
                const btn = document.getElementById('btn-modal-create-pass-submit');
                const btnText = document.getElementById('btn-modal-create-pass-text');
                const btnIcon = document.getElementById('btn-modal-create-pass-icon');

                const password = passInput?.value;
                const confirmPassword = confInput?.value;

                if (!password || password.length < 6) {
                    showToast('Password must be at least 6 characters long.', 'warning');
                    passInput?.focus();
                    return;
                }

                if (password !== confirmPassword) {
                    showToast('Passwords do not match. Please re-enter.', 'error');
                    confInput?.focus();
                    return;
                }

                if (btn) btn.disabled = true;
                if (btnText) btnText.textContent = 'Creating account session...';
                if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin text-xs ml-1';

                try {
                    const res = await AuthAPI.createPassword(currentSetupToken, password, confirmPassword, selectedEmployee.email);
                    if (res && res.success) {
                        const user = res.user || selectedEmployee;
                        const role = res.role || currentVerifiedRole;

                        localStorage.setItem('oxford_session_auth', 'true');
                        localStorage.setItem('oxford_session_user', JSON.stringify(user));
                        localStorage.setItem('oxford_session_role', role);

                        showToast(res.message || 'Password created successfully! Entering portal...', 'success');
                        setTimeout(() => {
                            window.location.replace(res.redirect || 'index.php');
                        }, 500);
                    } else {
                        showToast(res.message || 'Failed to create password.', 'error');
                    }
                } catch (err) {
                    console.error('Create password error:', err);
                    showToast('Communication error creating password.', 'error');
                } finally {
                    if (btn) btn.disabled = false;
                    if (btnText) btnText.textContent = 'Complete Setup & Sign In';
                    if (btnIcon) btnIcon.className = 'fas fa-arrow-right text-xs ml-1';
                }
            }

            // -----------------------------------------------------------------
            // STEP 6: REMEMBERED STAFF PASSWORD MODAL
            // -----------------------------------------------------------------
            function openRememberedPasswordModal(employee) {
                closeAllModals();
                document.getElementById('rem-employee-name').textContent = employee.full_name;
                document.getElementById('rem-employee-email').textContent = employee.email;
                document.getElementById('rem-avatar-initial').textContent = employee.full_name.charAt(0);
                document.getElementById('modal-rem-password').value = '';
                openModal('modal-remembered-login');
                setTimeout(() => document.getElementById('modal-rem-password')?.focus(), 200);
            }

            async function fallbackToOtpFromRemembered() {
                if (!selectedEmployee) return;
                showToast('Sending OTP verification code...', 'info');
                const res = await AuthAPI.requestOtp(selectedEmployee.email, selectedEmployee.full_name, selectedEmployee.id);
                if (res && res.success) {
                    openOtpModal(selectedEmployee, res.remaining_sends);
                } else if (res && res.rate_limited) {
                    showToast(res.message, 'warning');
                    openOtpModal(selectedEmployee, 0);
                } else {
                    showToast(res.message || 'Failed to send OTP.', 'error');
                }
            }

            async function handleRememberedPasswordSubmit(e) {
                e.preventDefault();
                if (!selectedEmployee) return;

                const passInput = document.getElementById('modal-rem-password');
                const btn = document.getElementById('btn-modal-rem-submit');
                const btnText = document.getElementById('btn-modal-rem-text');
                const btnIcon = document.getElementById('btn-modal-rem-icon');

                const password = passInput?.value;
                if (!password) {
                    showToast('Please enter your password.', 'warning');
                    passInput?.focus();
                    return;
                }

                if (btn) btn.disabled = true;
                if (btnText) btnText.textContent = 'Signing in...';
                if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin text-xs ml-1';

                try {
                    const res = await AuthAPI.loginEmployeePassword(selectedEmployee.email, password, true);
                    if (res && res.success) {
                        const user = res.user || selectedEmployee;
                        const role = res.role || currentVerifiedRole;

                        localStorage.setItem('oxford_session_auth', 'true');
                        localStorage.setItem('oxford_session_user', JSON.stringify(user));
                        localStorage.setItem('oxford_session_role', role);

                        showToast(res.message || `Welcome back, ${user.full_name}!`, 'success');
                        setTimeout(() => {
                            window.location.replace(res.redirect || 'index.php');
                        }, 500);
                    } else if (res && res.needs_setup) {
                        showToast(res.message, 'info');
                        fallbackToOtpFromRemembered();
                    } else {
                        showToast(res.message || 'Incorrect personal password.', 'error');
                        passInput?.focus();
                    }
                } catch (err) {
                    console.error('Password login error:', err);
                    showToast('Communication error during sign-in.', 'error');
                } finally {
                    if (btn) btn.disabled = false;
                    if (btnText) btnText.textContent = 'Sign In & Enter Portal';
                    if (btnIcon) btnIcon.className = 'fas fa-arrow-right text-xs ml-1';
                }
            }
        </script>
    </body>
</html>
