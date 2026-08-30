/**
 * Oxford Suites, Makati - Interactive AI Copilot (SBI Feedback Refiner)
 * 2026 Generative UI (GenUI), Liquid Glass Design & Recoverable Agency Engine
 */

const AIRefiner = {
    selectedTone: 'balanced',
    currentEmployeeId: 'emp-101',
    currentEmployeeName: 'Maria Santos',
    currentDept: 'Front Office',
    currentDraft: null,
    isProcessing: false,

    demoScenarios: {
        rush_hour: {
            text: 'Peak dinner rush was hectic. Maria calmed down an angry VIP guest whose suite was delayed, but junior hosts were standing idle.',
            empName: 'Maria Santos',
            empId: 'emp-101',
            dept: 'Front Office',
            tone: 'balanced'
        },
        sommelier_upsell: {
            text: 'Pierre recommended the reserve vintage to presidential suites and exceeded beverage targets by 20% tonight.',
            empName: 'Pierre Dubois',
            empId: 'emp-103',
            dept: 'F&B Service',
            tone: 'growth'
        },
        housekeeping_turn: {
            text: 'Elena turned over 14 departure suites before 2 PM without sacrificing linen or mini-bar inspection standards.',
            empName: 'Elena Cruz',
            empId: 'emp-104',
            dept: 'Housekeeping',
            tone: 'direct'
        }
    },

    /**
     * Open the AI Feedback Copilot Modal with target associate context
     */
    open(empId = 'emp-101', empName = 'Maria Santos', dept = 'Front Office') {
        const currentRole = window.activePersonaRole || (window.activePersonaKey === 'employee' ? 'Associate' : 'Supervisor');
        const isAssociate = (currentRole === 'Associate');

        this.currentEmployeeId = empId || (window.currentUser?.id || 'emp-101');
        this.currentEmployeeName = empName || (window.currentUser?.name || 'Associate');
        this.currentDept = dept || 'Operations';

        const nameEl = document.getElementById('ai-modal-emp-name');
        const deptEl = document.getElementById('ai-modal-emp-dept');
        const avatarEl = document.getElementById('ai-modal-emp-avatar');
        if (nameEl) nameEl.textContent = this.currentEmployeeName;
        if (deptEl) {
            deptEl.textContent = isAssociate
                ? `${this.currentDept} · Personal Shift Reflection & Feedback`
                : `${this.currentDept} · Subordinate Coaching`;
        }
        if (avatarEl) {
            const initials = this.currentEmployeeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            avatarEl.textContent = initials || 'AS';
        }

        // Reset state
        this.setTone('balanced');
        this.hideError();
        this.hideRateLimit();

        if (typeof openModal === 'function') {
            openModal('modal-ai-feedback');
        }
    },

    /**
     * Populate rough observation from 1-Click demo scenario chips
     */
    setScenario(key) {
        const scenario = this.demoScenarios[key];
        if (!scenario) return;

        const textarea = document.getElementById('ai-rough-notes');
        if (textarea) {
            textarea.value = scenario.text;
            this.updateCharCount();
        }

        this.currentEmployeeName = scenario.empName;
        this.currentEmployeeId = scenario.empId;
        this.currentDept = scenario.dept;
        this.setTone(scenario.tone);

        const nameEl = document.getElementById('ai-modal-emp-name');
        const deptEl = document.getElementById('ai-modal-emp-dept');
        if (nameEl) nameEl.textContent = scenario.empName;
        if (deptEl) deptEl.textContent = `${scenario.dept} · Subordinate Coaching`;

        // Highlight selected chip
        document.querySelectorAll('.ai-scenario-chip').forEach(btn => {
            if (btn.dataset.scenario === key) {
                btn.classList.add('bg-primary', 'text-white', 'border-primary');
                btn.classList.remove('bg-white', 'text-slate-700');
            } else {
                btn.classList.remove('bg-primary', 'text-white', 'border-primary');
                btn.classList.add('bg-white', 'text-slate-700');
            }
        });
    },

    /**
     * Set tone modifier (balanced, direct, growth, empathy)
     */
    setTone(tone) {
        this.selectedTone = tone;
        document.querySelectorAll('.ai-tone-pill').forEach(pill => {
            if (pill.dataset.tone === tone) {
                pill.classList.add('bg-primary', 'text-white', 'border-primary', 'shadow-xs');
                pill.classList.remove('bg-slate-50', 'text-slate-600', 'border-slate-200');
            } else {
                pill.classList.remove('bg-primary', 'text-white', 'border-primary', 'shadow-xs');
                pill.classList.add('bg-slate-50', 'text-slate-600', 'border-slate-200');
            }
        });
    },

    /**
     * Update character counter on rough observation textarea
     */
    updateCharCount() {
        const textarea = document.getElementById('ai-rough-notes');
        const countEl = document.getElementById('ai-char-counter');
        if (textarea && countEl) {
            const len = textarea.value.length;
            countEl.textContent = `${len}/1200`;
            if (len > 1000) {
                countEl.classList.add('text-rose-500');
            } else {
                countEl.classList.remove('text-rose-500');
            }
        }
    },

    /**
     * Dispatch AI Refinement request to backend API
     */
    async generateDraft() {
        if (this.isProcessing) return;

        const roughNotes = (document.getElementById('ai-rough-notes')?.value || '').trim();
        if (!roughNotes) {
            if (typeof showToast === 'function') {
                showToast('Please type a rough shift observation or pick a scenario.', 'info');
            }
            return;
        }

        const currentRole = window.activePersonaRole || (window.activePersonaKey === 'employee' ? 'Associate' : 'Supervisor');
        const currentUserId = window.currentUser?.id || 'sup-101';

        this.setLoadingState(true);
        this.hideError();
        this.hideRateLimit();

        try {
            const res = await fetch('api/ai.php?action=refine_sbi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: currentRole,
                    user_id: currentUserId,
                    employee_id: this.currentEmployeeId,
                    employee_name: this.currentEmployeeName,
                    dept: this.currentDept,
                    rough_notes: roughNotes,
                    tone: this.selectedTone
                })
            });

            const json = await res.json();

            if (res.status === 429) {
                // Rate limit reached
                this.showRateLimit(json.rateLimit?.resetIn || 1800, json.message);
                this.setLoadingState(false);
                return;
            }

            if (!res.ok || !json.success) {
                this.showError(json.message || 'AI assistant is temporarily busy.');
                this.setLoadingState(false);
                return;
            }

            // Render structured 3-part GenUI card
            this.currentDraft = json.data;
            this.renderGenUICards(json.data);
            this.updateRateLimitBadge(json.rateLimit);

            if (json.data?.isFallback) {
                if (typeof showToast === 'function') {
                    showToast('AI offline: loaded raw observation for manual edit.', 'info');
                }
            } else {
                if (typeof showToast === 'function') {
                    showToast('Structured SBI coaching draft generated! Edit lines below as needed.', 'success');
                }
            }

        } catch (err) {
            console.error('[AIRefiner] Network or API error:', err);
            this.showError('Unable to connect to AI engine. You can still write and save notes manually.');
        } finally {
            this.setLoadingState(false);
        }
    },

    /**
     * Render the 3-part GenUI interactive cards (Situation, Behavior, Impact)
     */
    renderGenUICards(data) {
        const container = document.getElementById('ai-genui-output-container');
        const situationInput = document.getElementById('ai-card-situation');
        const behaviorInput = document.getElementById('ai-card-behavior');
        const impactInput = document.getElementById('ai-card-impact');
        const toneTagEl = document.getElementById('ai-draft-tone-tag');

        if (situationInput) situationInput.value = data.situation || '';
        if (behaviorInput) behaviorInput.value = data.behavior || '';
        if (impactInput) impactInput.value = data.impact || '';
        if (toneTagEl) toneTagEl.textContent = (data.tone || this.selectedTone).toUpperCase();

        if (container) {
            container.classList.remove('hidden');
            container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    },

    /**
     * Commit the human-approved coaching note to permanent database
     */
    async saveCoachingNote() {
        const situation = (document.getElementById('ai-card-situation')?.value || '').trim();
        const behavior = (document.getElementById('ai-card-behavior')?.value || '').trim();
        const impact = (document.getElementById('ai-card-impact')?.value || '').trim();

        if (!situation || !behavior || !impact) {
            if (typeof showToast === 'function') {
                showToast('Please complete Situation, Behavior, and Impact before saving.', 'info');
            }
            return;
        }

        const currentUserId = window.currentUser?.id || 'sup-101';
        const isAIGenerated = !!this.currentDraft;

        try {
            const saveBtn = document.getElementById('ai-btn-save-note');
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-1.5"></i> Saving Note...`;
            }

            const res = await fetch('api/coaching.php?action=create_note', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employee_id: this.currentEmployeeId,
                    supervisor_id: currentUserId,
                    situation: situation,
                    behavior: behavior,
                    impact: impact,
                    source: isAIGenerated ? 'ai_refined' : 'manual',
                    tone_tag: this.selectedTone
                })
            });

            const json = await res.json();
            if (json.success) {
                if (typeof showToast === 'function') {
                    showToast('Coaching feedback committed to associate record!', 'success');
                }
                if (typeof closeModal === 'function') {
                    closeModal('modal-ai-feedback');
                }
                // Refresh coaching timeline in Performance Management if open
                if (typeof loadAndRenderMonitoringData === 'function') {
                    loadAndRenderMonitoringData();
                }
            } else {
                if (typeof showToast === 'function') {
                    showToast(json.message || 'Failed to save coaching note.', 'error');
                }
            }
        } catch (e) {
            console.error('[AIRefiner] Save note failed:', e);
            if (typeof showToast === 'function') {
                showToast('Network error while saving coaching note.', 'error');
            }
        } finally {
            const saveBtn = document.getElementById('ai-btn-save-note');
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = `<i class="fas fa-floppy-disk mr-1.5"></i> Save to Coaching Record`;
            }
        }
    },

    /**
     * Discard draft with clean reset
     */
    discardDraft() {
        this.currentDraft = null;
        const container = document.getElementById('ai-genui-output-container');
        if (container) container.classList.add('hidden');
        if (typeof showToast === 'function') {
            showToast('SBI draft discarded.', 'info');
        }
    },

    /**
     * Copy full formatted SBI draft to clipboard
     */
    copyDraftToClipboard() {
        const sit = document.getElementById('ai-card-situation')?.value || '';
        const beh = document.getElementById('ai-card-behavior')?.value || '';
        const imp = document.getElementById('ai-card-impact')?.value || '';
        const formatted = `[SITUATION]\n${sit}\n\n[BEHAVIOR]\n${beh}\n\n[IMPACT & GUIDANCE]\n${imp}`;

        navigator.clipboard.writeText(formatted).then(() => {
            if (typeof showToast === 'function') {
                showToast('SBI draft copied to clipboard!', 'success');
            }
        }).catch(() => {
            if (typeof showToast === 'function') {
                showToast('Failed to copy text.', 'error');
            }
        });
    },

    /**
     * Switch to manual entry mode on rate limit or offline state
     */
    switchToManual() {
        const rough = (document.getElementById('ai-rough-notes')?.value || '').trim();
        this.renderGenUICards({
            situation: `Shift Observation (${this.currentDept}):`,
            behavior: rough || 'Observed floor performance during shift.',
            impact: 'Coaching note for skill reinforcement.',
            tone: 'manual'
        });
        this.hideRateLimit();
        this.hideError();
    },

    /**
     * UI State Helpers
     */
    setLoadingState(isLoading) {
        this.isProcessing = isLoading;
        const shimmer = document.getElementById('ai-shimmer-loader');
        const submitBtn = document.getElementById('ai-btn-generate');
        if (shimmer) {
            if (isLoading) shimmer.classList.remove('hidden');
            else shimmer.classList.add('hidden');
        }
        if (submitBtn) {
            submitBtn.disabled = isLoading;
            submitBtn.innerHTML = isLoading
                ? `<i class="fas fa-sparkles fa-spin mr-1.5"></i> Structuring SBI Model...`
                : `<i class="fas fa-wand-magic-sparkles mr-1.5"></i> Refine into Structured SBI Model`;
        }
    },

    updateRateLimitBadge(rateLimit) {
        const badge = document.getElementById('ai-rate-limit-badge');
        if (badge && rateLimit) {
            const rem = rateLimit.remaining ?? 20;
            const lim = rateLimit.limit ?? 20;
            badge.textContent = `⚡ ${rem}/${lim} AI requests left this hr`;
        }
    },

    showRateLimit(resetInSecs, message) {
        const banner = document.getElementById('ai-rate-limit-banner');
        const timerEl = document.getElementById('ai-rate-limit-timer');
        const msgEl = document.getElementById('ai-rate-limit-msg');
        if (banner) {
            banner.classList.remove('hidden');
            if (msgEl) msgEl.textContent = message || 'Hourly request limit reached.';
            if (timerEl) {
                const mins = Math.ceil(resetInSecs / 60);
                timerEl.textContent = `Reset in ~${mins} min`;
            }
        }
    },

    hideRateLimit() {
        const banner = document.getElementById('ai-rate-limit-banner');
        if (banner) banner.classList.add('hidden');
    },

    showError(msg) {
        const errEl = document.getElementById('ai-error-banner');
        const msgEl = document.getElementById('ai-error-msg');
        if (errEl) {
            errEl.classList.remove('hidden');
            if (msgEl) msgEl.textContent = msg;
        }
    },

    hideError() {
        const errEl = document.getElementById('ai-error-banner');
        if (errEl) errEl.classList.add('hidden');
    },

    /**
     * Passive Department Sentiment Analytics Loader
     */
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

// Global Window Bindings
window.AIRefiner = AIRefiner;
window.openAIFeedbackModal = (empId, empName, dept) => AIRefiner.open(empId, empName, dept);
window.setRoughNote = (text) => {
    const textarea = document.getElementById('ai-rough-notes');
    if (textarea) {
        textarea.value = text;
        AIRefiner.updateCharCount();
    }
};
window.generateAIFeedback = () => AIRefiner.generateDraft();
window.saveCoachingNoteFromAI = () => AIRefiner.saveCoachingNote();
window.copyAndApplyFeedback = () => AIRefiner.saveCoachingNote();
window.loadDepartmentSentiment = (dept) => AIRefiner.loadDepartmentSentiment(dept);

