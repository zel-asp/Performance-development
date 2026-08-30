/**
 * Oxford Suites, Makati - Interactive AI Copilot (Conversational Chatbot)
 * 2026 Generative UI (GenUI)
 */

const AIRefiner = {
    chatHistory: [],
    isProcessing: false,
    currentEmployeeName: 'Associate',
    currentDept: 'Front Office',

    open(empId = 'emp-101', empName = 'Maria Santos', dept = 'Front Office') {
        this.currentEmployeeName = empName || (window.currentUser?.name || 'Associate');
        this.currentDept = dept || 'Operations';
        this.chatHistory = [];

        const nameEl = document.getElementById('ai-modal-emp-name');
        const deptEl = document.getElementById('ai-modal-emp-dept');
        if (nameEl) nameEl.textContent = this.currentEmployeeName;
        if (deptEl) deptEl.textContent = `${this.currentDept} · Subordinate Coaching`;

        this.clearChatUI();
        this.appendMessage('model', `Hello! I am your **AI Leadership Coach** for Oxford Suites.\n\nI can help you structure performance feedback, de-escalate difficult guest situations, or draft coaching notes for ${this.currentEmployeeName}. How can I help you today?`);

        if (typeof openModal === 'function') {
            openModal('modal-ai-feedback');
        }
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

        this.setLoadingState(true);
        this.appendTypingIndicator();

        const currentRole = window.activePersonaRole || 'Supervisor';
        const currentUserId = window.currentUser?.id || 'sup-101';

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

            const json = await res.json();

            if (json.success && json.data) {
                const responseText = json.data.text;
                this.chatHistory.push({ role: 'model', content: responseText });
                this.appendMessage('model', responseText);
            } else {
                this.appendMessage('model', `⚠️ Error: ${json.message || 'Unable to reach AI Coach.'}`);
            }
        } catch (e) {
            console.error('[AIRefiner] Chat error:', e);
            this.appendMessage('model', `⚠️ Network error connecting to Gemini AI.`);
        } finally {
            this.removeTypingIndicator();
            this.setLoadingState(false);
        }
    },

    appendMessage(role, text) {
        const historyEl = document.getElementById('ai-chat-history');
        if (!historyEl) return;

        // Convert basic markdown
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
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
