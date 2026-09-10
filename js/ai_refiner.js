/**
 * Oxford Suites, Makati - Interactive AI Copilot (Conversational Chatbot)
 * 2026 Generative UI (GenUI)
 */

const AIRefiner = {
    chatHistory: [],
    isProcessing: false,
    currentEmployeeName: 'Associate',
    currentDept: 'Front Office',

    getStorageKey() {
        let loggedInUser = window.currentUser;
        if (!loggedInUser || !loggedInUser.id) {
            try {
                const raw = localStorage.getItem('oxford_session_user');
                if (raw) loggedInUser = JSON.parse(raw);
            } catch (e) {}
        }
        const uid = loggedInUser?.id || (this.isSupervisorRole() ? 'emp-102' : 'emp-101');
        return `oxford_ai_chat_history_${uid}`;
    },

    getLoggedInProfile() {
        let loggedInUser = window.currentUser;
        if (!loggedInUser || !loggedInUser.name) {
            try {
                const raw = localStorage.getItem('oxford_session_user');
                if (raw) loggedInUser = JSON.parse(raw);
            } catch (e) {}
        }
        return {
            id: loggedInUser?.id || (this.isSupervisorRole() ? 'emp-102' : 'emp-101'),
            name: loggedInUser?.full_name || loggedInUser?.name || (this.isSupervisorRole() ? 'Supervisor' : 'Associate'),
            role: loggedInUser?.role || window.activePersonaRole || (this.isSupervisorRole() ? 'Supervisor' : 'Associate'),
            dept: loggedInUser?.department || loggedInUser?.dept || 'Front Office'
        };
    },

    loadSavedHistory() {
        try {
            const raw = localStorage.getItem(this.getStorageKey());
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.warn('[AIRefiner] Error reading chat storage:', e);
        }
        return null;
    },

    saveHistoryToStorage() {
        try {
            localStorage.setItem(this.getStorageKey(), JSON.stringify(this.chatHistory));
        } catch (e) {
            console.warn('[AIRefiner] Error saving chat storage:', e);
        }
    },

    getUserRole() {
        const profile = this.getLoggedInProfile();
        return profile.role;
    },

    isSupervisorRole() {
        const r = (this.getUserRole() || '').toLowerCase();
        return r.includes('supervisor') || r.includes('manager') || r.includes('hr') || r.includes('admin') || r.includes('lead') || r.includes('executive');
    },

    getWelcomeText() {
        const isSup = this.isSupervisorRole();
        const profile = this.getLoggedInProfile();
        const userName = profile.name;
        if (isSup) {
            return `Hello ${userName}! I am your **Oxford Suites Makati Leadership & Coaching AI Copilot**.\n\nI can assist you with:\n* 💡 **Drafting SBI Coaching Notes** (Situation-Behavior-Impact) for ${this.currentEmployeeName}\n* 📝 **Drafting Appraisal Review Commentaries** and calibration feedback\n* 📊 **9-Box Grid & Succession Readiness** computations\n* 🎯 **Structuring SMART Objectives** and floor milestone tracking\n\nWhat coaching observation or leadership draft can I assist you with today?`;
        } else {
            return `Hello ${userName}! I am your **Oxford Suites Makati Performance & Learning AI Copilot**.\n\nI can assist you with:\n* ✍️ **Drafting Self-Assessments** for your performance appraisal review\n* 🌟 **Drafting Peer Kudos** to recognize your colleagues (+50 XP)\n* 🎯 **Breaking down your shift targets** into daily floor action habits\n* 📚 **Preparing for LMS SOP quizzes** and training milestones\n\nWhat reflection or development draft would you like help writing today?`;
        }
    },

    renderQuickPrompts() {
        const container = document.getElementById('ai-quick-prompts-bar');
        if (!container) return;

        if (this.isSupervisorRole()) {
            container.innerHTML = `
                <button type="button" onclick="AIRefiner.sendChat('Help me draft a constructive SBI coaching note for an associate regarding guest check-in speed and front-desk composure.')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    💡 Draft SBI Coaching Note
                </button>
                <button type="button" onclick="AIRefiner.sendChat('Help me draft an objective supervisor appraisal review commentary for an associate who consistently meets SOP standards.')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    📝 Draft Appraisal Review
                </button>
                <button type="button" onclick="AIRefiner.sendChat('How does the 9-Box Grid work and how is succession readiness computed?')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    📊 Explain 9-Box Grid
                </button>
                <button type="button" onclick="AIRefiner.sendChat('Explain the LAST model for resolving guest complaints and coaching floor staff.')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    🛎️ LAST Recovery Coaching
                </button>
                <button type="button" onclick="AIRefiner.sendChat('Help me draft SMART performance goals and milestone metrics for my shift team.')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    🎯 Draft SMART Goals
                </button>
            `;
        } else {
            container.innerHTML = `
                <button type="button" onclick="AIRefiner.sendChat('Help me draft a self-assessment reflection for my performance appraisal detailing my shift achievements and key learnings.')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-amber-50/70 border border-amber-200 text-amber-900 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    ✍️ Draft Self-Assessment
                </button>
                <button type="button" onclick="AIRefiner.sendChat('Help me draft a peer kudos commendation for a teammate who helped me during a busy check-in rush.')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-purple-50/70 border border-purple-200 text-purple-900 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    🌟 Draft Peer Kudos (+50 XP)
                </button>
                <button type="button" onclick="AIRefiner.sendChat('Help me draft daily shift action habits to hit my quarterly KPI targets.')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    🎯 Draft Goal Habits
                </button>
                <button type="button" onclick="AIRefiner.sendChat('How can I prepare for my upcoming LMS SOP quiz and training milestones?')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    📚 LMS Quiz & SOP Prep
                </button>
                <button type="button" onclick="AIRefiner.sendChat('Explain the LAST recovery model with hospitality examples for frontline staff.')"
                    class="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold hover:border-primary hover:text-primary transition">
                    🛎️ LAST Model in Action
                </button>
            `;
        }
    },

    clearHistory() {
        this.chatHistory = [];
        try {
            localStorage.removeItem(this.getStorageKey());
        } catch (e) {}
        this.clearChatUI();
        const welcomeText = this.getWelcomeText();
        this.chatHistory.push({ role: 'model', content: welcomeText });
        this.saveHistoryToStorage();
        this.appendMessage('model', welcomeText);
        this.renderQuickPrompts();
    },

    open(targetEmpId = null, targetEmpName = null, targetDept = null) {
        const profile = this.getLoggedInProfile();
        const isSup = this.isSupervisorRole();

        if (isSup) {
            this.currentEmployeeName = targetEmpName || window.selectedEmployeeContext?.name || 'Associate';
            this.currentDept = targetDept || window.selectedEmployeeContext?.dept || profile.dept;
            this.currentEmployeeId = targetEmpId || window.selectedEmployeeContext?.id || '';
        } else {
            // For frontline employee: identity is always the logged-in user themselves
            this.currentEmployeeName = profile.name;
            this.currentDept = profile.dept;
            this.currentEmployeeId = profile.id;
        }

        const nameEl = document.getElementById('ai-modal-emp-name');
        const deptEl = document.getElementById('ai-modal-emp-dept');
        if (nameEl) nameEl.textContent = this.currentEmployeeName;
        if (deptEl) deptEl.textContent = isSup 
            ? `${this.currentDept} · Leadership & Coaching Copilot` 
            : `${this.currentDept} · Personal Development & Reflection`;

        this.clearChatUI();
        this.renderQuickPrompts();

        // Restore chat history if exists, otherwise show greeting
        const savedHistory = this.loadSavedHistory();
        if (savedHistory && savedHistory.length > 0) {
            this.chatHistory = savedHistory;
            this.renderFullHistoryUI();
        } else {
            this.chatHistory = [];
            const welcomeText = this.getWelcomeText();
            this.chatHistory.push({ role: 'model', content: welcomeText });
            this.saveHistoryToStorage();
            this.appendMessage('model', welcomeText);
        }

        // Fetch real-time rate limit quota status
        this.fetchCurrentRateLimit();

        if (typeof openModal === 'function') {
            openModal('modal-ai-feedback');
        }
    },

    renderFullHistoryUI() {
        const historyEl = document.getElementById('ai-chat-history');
        if (!historyEl) return;
        historyEl.innerHTML = '';
        this.chatHistory.forEach(item => {
            this.appendMessage(item.role, item.content);
        });
    },

    clearChatUI() {
        const historyEl = document.getElementById('ai-chat-history');
        if (historyEl) historyEl.innerHTML = '';
        const inputEl = document.getElementById('ai-chat-input');
        if (inputEl) {
            inputEl.value = '';
            inputEl.style.height = '';
        }
    },

    async fetchCurrentRateLimit() {
        const profile = this.getLoggedInProfile();
        const currentUserId = profile.id;
        try {
            const res = await fetch(`api/ai.php?action=rate_limit&user_id=${encodeURIComponent(currentUserId)}`);
            const json = await res.json();
            if (json.success && json.rateLimit) {
                this.updateRateLimitBadge(json.rateLimit.remaining, json.rateLimit.limit);
            }
        } catch (e) {
            console.warn('[AIRefiner] Rate limit fetch fallback:', e);
        }
    },

    updateRateLimitBadge(remaining, limit = 20) {
        const badge = document.getElementById('ai-rate-limit-badge');
        if (badge) {
            badge.innerHTML = `⚡ ${remaining}/${limit} req left`;
            if (remaining <= 3) {
                badge.className = 'text-[10px] font-bold text-rose-500 animate-pulse';
            } else if (remaining <= 8) {
                badge.className = 'text-[10px] font-bold text-amber-500';
            } else {
                badge.className = 'text-[10px] font-bold text-slate-400';
            }
        }
    },

    handleSendClick() {
        const inputEl = document.getElementById('ai-chat-input');
        if (!inputEl) return;
        const msg = inputEl.value.trim();
        if (msg) {
            this.sendChat(msg);
            inputEl.value = '';
            inputEl.style.height = '';
        }
    },

    async sendChat(message) {
        if (this.isProcessing) return;
        if (!message || message.trim() === '') return;

        this.appendMessage('user', message);
        this.chatHistory.push({ role: 'user', content: message });
        this.saveHistoryToStorage();

        this.setLoadingState(true);
        this.appendTypingIndicator();

        const profile = this.getLoggedInProfile();
        const currentRole = profile.role;
        const currentUserId = profile.id;

        try {
            const res = await fetch('api/ai.php?action=chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: currentRole,
                    user_id: currentUserId,
                    employee_name: this.currentEmployeeName,
                    dept: this.currentDept,
                    history: this.chatHistory
                })
            });

            const rawText = await res.text();
            let json = null;
            try {
                json = JSON.parse(rawText);
            } catch (jsonErr) {
                console.error('[AIRefiner] Invalid JSON response:', rawText);
                this.appendMessage('model', `⚠️ Error: Could not parse response from AI service.`);
                return;
            }

            // Real-time decrement & rate limit update
            if (json.rateLimit) {
                this.updateRateLimitBadge(json.rateLimit.remaining, json.rateLimit.limit);
            }

            if (json.success && json.data) {
                const responseText = json.data.text;
                this.chatHistory.push({ role: 'model', content: responseText });
                this.saveHistoryToStorage();
                this.appendMessage('model', responseText);
            } else {
                this.appendMessage('model', `⚠️ ${json.message || 'The Oxford Suites AI Copilot is temporarily unavailable.'}`);
            }
        } catch (e) {
            console.error('[AIRefiner] Chat error:', e);
            this.appendMessage('model', `⚠️ Connection error: Unable to communicate with the local server. Please ensure your session is active.`);
        } finally {
            this.removeTypingIndicator();
            this.setLoadingState(false);
        }
    },

    appendMessage(role, text) {
        const historyEl = document.getElementById('ai-chat-history');
        if (!historyEl) return;

        // Convert markdown headings, bold, italics, bullets, and linebreaks
        let formattedText = text
            .replace(/### (.*?)(?:\n|$)/g, '<h4 class="font-bold text-slate-900 mt-2 mb-1 text-xs">$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^[\*\-] (.*?)(?:\n|$)/gm, '• $1<br>')
            .replace(/\n/g, '<br>');

        const bubble = document.createElement('div');
        bubble.className = `flex items-start space-x-3 w-full ${role === 'user' ? 'justify-end' : 'max-w-lg'}`;

        if (role === 'user') {
            const userAvatarSrc = document.getElementById('nav-user-avatar')?.src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
            bubble.innerHTML = `
                <div class="flex-1 max-w-[85%] bg-primary p-3.5 rounded-2xl rounded-tr-sm text-white leading-relaxed shadow-2xs text-xs">
                    ${formattedText}
                </div>
                <img src="${userAvatarSrc}" alt="User" class="w-8 h-8 rounded-full object-cover flex-shrink-0 shadow-2xs border border-slate-300 mt-1">
            `;
        } else {
            bubble.innerHTML = `
                <img src="assets/images/ai_copilot_avatar.jpg" alt="AI Copilot" class="w-8 h-8 rounded-xl object-cover flex-shrink-0 shadow-2xs border border-slate-200 mt-1">
                <div class="flex-1 bg-white p-3.5 rounded-2xl rounded-tl-sm border border-slate-200/60 shadow-2xs text-slate-700 leading-relaxed space-y-2 text-xs">
                    ${formattedText}
                </div>
            `;
        }

        historyEl.appendChild(bubble);
        historyEl.scrollTo({ top: historyEl.scrollHeight, behavior: 'smooth' });
    },

    appendTypingIndicator() {
        const historyEl = document.getElementById('ai-chat-history');
        if (!historyEl) return;
        
        const bubble = document.createElement('div');
        bubble.id = 'ai-typing-indicator';
        bubble.className = `flex items-start space-x-3 w-full max-w-lg`;
        bubble.innerHTML = `
            <img src="assets/images/ai_copilot_avatar.jpg" alt="AI Copilot" class="w-8 h-8 rounded-xl object-cover flex-shrink-0 shadow-2xs border border-slate-200 mt-1 opacity-70">
            <div class="flex-1 bg-white p-3.5 rounded-2xl rounded-tl-sm border border-slate-200/60 shadow-2xs text-slate-700 leading-relaxed space-y-2 text-xs flex items-center space-x-1.5 h-10 w-16">
                <span class="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style="animation-delay: 0ms;"></span>
                <span class="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style="animation-delay: 150ms;"></span>
                <span class="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style="animation-delay: 300ms;"></span>
            </div>
        `;
        historyEl.appendChild(bubble);
        historyEl.scrollTo({ top: historyEl.scrollHeight, behavior: 'smooth' });
    },

    removeTypingIndicator() {
        const indicator = document.getElementById('ai-typing-indicator');
        if (indicator) indicator.remove();
    },

    setLoadingState(isLoading) {
        this.isProcessing = isLoading;
        const btn = document.getElementById('ai-btn-send-chat');
        const status = document.getElementById('ai-chat-status');
        
        if (btn) {
            btn.disabled = isLoading;
            btn.innerHTML = isLoading ? '<i class="fas fa-circle-notch fa-spin text-xs"></i>' : '<i class="fas fa-paper-plane text-xs"></i>';
        }
        
        if (status) {
            status.textContent = isLoading ? 'Gemini 3.1 Pro is typing...' : 'Ready';
        }
    },

    async loadDepartmentSentiment(dept = 'all') {
        const currentRole = window.activePersonaRole || (window.activePersonaKey === 'employee' ? 'Associate' : 'Supervisor');

        try {
            const res = await fetch(`api/ai.php?action=department_sentiment&dept=${encodeURIComponent(dept)}&role=${encodeURIComponent(currentRole)}`);
            const json = await res.json();
            if (json.success && json.data) {
                const data = json.data;
                const labelEl = document.getElementById('sentiment-mood-label');
                const scoreEl = document.getElementById('sentiment-avg-rating');
                if (labelEl) labelEl.textContent = `${data.sentiment} (${data.score}%)`;
                if (scoreEl) scoreEl.textContent = `${(data.score / 20).toFixed(1)} / 5.0`;
            }
        } catch (e) {
            console.warn('[AIRefiner] Sentiment pulse fetch fallback:', e);
        }
    },

    askAboutGoal(goalId, goalTitle, metric, dept) {
        const title = decodeURIComponent(goalTitle || 'Performance Objective');
        const met = decodeURIComponent(metric || '');
        const department = decodeURIComponent(dept || this.currentDept || 'Front Office');
        const empName = window.currentUser?.name || (window.activePersonaRole === 'Supervisor' ? 'Marco Rossi' : 'Maria Santos');
        const empId = window.currentUser?.id || (window.activePersonaRole === 'Supervisor' ? 'emp-102' : 'emp-101');

        this.open(empId, empName, department);

        const prompt = `As my Oxford Suites Leadership & System AI Copilot, please provide a coaching breakdown for my performance objective: "${title}" with target metric "${met}". What daily shift habits, PMS/floor practices, and guest recovery steps (LAST model) will help me hit this target?`;

        setTimeout(() => {
            this.sendChat(prompt);
        }, 200);
    }
};

// Global bindings
window.AIRefiner = AIRefiner;
window.openAIFeedbackModal = (empId, empName, dept) => AIRefiner.open(empId, empName, dept);
window.loadDepartmentSentiment = (dept) => AIRefiner.loadDepartmentSentiment(dept);

// Add Enter key support for textarea
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (e) => {
        if (e.target.id === 'ai-chat-input' && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            AIRefiner.handleSendClick();
        }
    });
});
