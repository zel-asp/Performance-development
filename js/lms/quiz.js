/**
 * Oxford Suites, Makati — Learning Management System (LMS)
 * Interactive AI Knowledge Quiz Engine
 * Features: 10 Items, Confirmation Screen, 10-Min Timer, 1-10 Navigator Strip, LocalStorage Sync, Auto-Grading & lms_prescribed Sync
 */

(function () {
    // Global Quiz State
    window.activeQuizState = {
        bookId: null,
        bookTitle: 'Handbook',
        department: 'Hotel Operations',
        category: 'SOP Manual',
        questions: [],
        answers: {},          // { 0: 1, 1: 0, ... }
        currentIndex: 0,
        totalItems: 10,
        durationSeconds: 600, // 10 minutes
        remainingSeconds: 600,
        timerInterval: null,
        startedAt: null,
        isSubmitted: false
    };

    // Fast In-Memory Cache
    window.lmsQuizCache = window.lmsQuizCache || {};

    const STORAGE_KEY_PREFIX = 'oxford_lms_active_quiz_';

    function getStorageKey(bookId) {
        const empId = (window.currentUser?.id || window.activePersonaId || 'emp-101').toLowerCase();
        return `${STORAGE_KEY_PREFIX}${empId}_${bookId}`;
    }

    /**
     * Find any uncompleted active quiz session across localStorage
     */
    function findAnyActiveQuizSession() {
        try {
            const empId = (window.currentUser?.id || window.activePersonaId || 'emp-101').toLowerCase();
            const prefix = `${STORAGE_KEY_PREFIX}${empId}_`;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    const raw = localStorage.getItem(key);
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        if (parsed && !parsed.isSubmitted && parsed.remainingSeconds > 0 && Array.isArray(parsed.questions) && parsed.questions.length === 10) {
                            return parsed;
                        }
                    }
                }
            }
        } catch (e) {}
        return null;
    }

    /**
     * Check if user has already taken and completed the quiz for this book
     */
    window.getCompletedQuizRecord = function (bookId) {
        if (!bookId) return null;
        const currentUserId = (window.currentUser?.id || window.activePersonaId || 'emp-101').toLowerCase();

        // 1. Check local storage persistent completion keys
        try {
            const keyUser = 'oxford_lms_completed_quiz_' + bookId + '_' + currentUserId;
            const itemUser = localStorage.getItem(keyUser);
            if (itemUser) {
                const parsed = JSON.parse(itemUser);
                if (parsed && parsed.taken) return parsed;
            }
            const keyGen = 'oxford_lms_completed_quiz_' + bookId;
            const itemGen = localStorage.getItem(keyGen);
            if (itemGen) {
                const parsedGen = JSON.parse(itemGen);
                if (parsedGen && parsedGen.taken) return parsedGen;
            }
        } catch (e) {}

        // 2. Check window.dynamicLmsState.prescribed
        if (window.dynamicLmsState && Array.isArray(window.dynamicLmsState.prescribed)) {
            const match = window.dynamicLmsState.prescribed.find(p => {
                const pBookId = p.lms_id || p.book_id || p.id;
                if (String(pBookId) !== String(bookId)) return false;
                const empId = (p.employee || p.employee_id || '').toLowerCase();
                const empName = (p.employee_name || '').toLowerCase();
                return empId === currentUserId ||
                    (currentUserId === 'emp-101' && (empId.includes('101') || empId.includes('maria') || empName.includes('maria'))) ||
                    (currentUserId === 'emp-102' && (empId.includes('102') || empId.includes('antonio') || empName.includes('antonio')));
            });

            if (match) {
                const score = Number(match.scores ?? match.score ?? 0);
                const status = String(match.status || '').toLowerCase();
                const hasAttempt = Boolean(match.last_attempt || match.scores !== null || status === 'passed' || status === 'completed');
                if (hasAttempt || status === 'passed' || status === 'completed' || score > 0) {
                    return {
                        taken: true,
                        passed: status === 'passed' || score >= 80,
                        score: score,
                        status: match.status || (score >= 80 ? 'Passed' : 'Completed'),
                        completedAt: match.last_attempt || null
                    };
                }
            }
        }

        return null;
    };

    /**
     * Entrypoint 1: Triggered when user clicks "Take Knowledge Quiz"
     */
    window.startQuizPrompt = function (bookId, bookTitle, deptName, catName) {
        if (!bookId) {
            if (typeof showToast === 'function') showToast('Please select a handbook first.', 'warning');
            return;
        }

        // Close reader if open
        if (typeof closeModal === 'function') {
            closeModal('modal-book-reader');
        }

        // Guard: Check if ANY other handbook quiz session is currently running
        const otherActive = findAnyActiveQuizSession();
        if (otherActive && otherActive.bookId !== bookId && !otherActive.isSubmitted && otherActive.remainingSeconds > 0) {
            if (typeof showToast === 'function') {
                showToast(`You already started a quiz for "${otherActive.bookTitle}". You cannot start a new quiz until you finish or submit your active attempt!`, 'warning');
            }
            // Switch target to the currently running quiz so they cannot open a new quiz
            bookId = otherActive.bookId;
            bookTitle = otherActive.bookTitle;
            deptName = otherActive.department;
            catName = otherActive.category;
        }

        // Resolve handbook info
        const doc = (window.dynamicLmsState?.documents || []).find(d => d.id === bookId) || {};
        const title = bookTitle || doc.title || 'Standard Operating Procedure Handbook';
        const dept = deptName || doc.department_name || 'Hotel Operations';
        const category = catName || doc.category || 'SOP Manual';

        window.activeQuizState.bookId = bookId;
        window.activeQuizState.bookTitle = title;
        window.activeQuizState.department = dept;
        window.activeQuizState.category = category;

        // Populate Confirmation Modal Screen
        const elTitle = document.getElementById('quiz-confirm-book-title');
        const elBadge = document.getElementById('quiz-confirm-badge');
        if (elTitle) elTitle.textContent = title;
        if (elBadge) elBadge.textContent = `${category} · 10 Items`;

        // Check if there is an in-progress saved attempt in LocalStorage
        const saved = loadQuizFromLocalStorage(bookId);
        const hasActiveAttempt = saved && !saved.isSubmitted && saved.remainingSeconds > 0 && Array.isArray(saved.questions) && saved.questions.length === 10;

        const resumeBanner = document.getElementById('quiz-resume-banner');
        const resumeTimer = document.getElementById('quiz-resume-timer');
        const startBtn = document.getElementById('btn-quiz-start-confirm');
        const resumeBtn = document.getElementById('btn-quiz-resume-confirm');
        const confirmTitle = document.getElementById('quiz-confirm-title');
        const confirmDesc = document.getElementById('quiz-confirm-desc');

        // Check if user already took/completed the quiz
        const completedRecord = window.getCompletedQuizRecord(bookId);

        if (hasActiveAttempt) {
            // When already started: DISABLE "Start Quiz" and OPENING A NEW QUIZ; SHOW ONLY "RESUME"
            if (startBtn) {
                startBtn.classList.add('hidden');
                startBtn.disabled = true;
            }
            if (resumeBtn) {
                resumeBtn.classList.remove('hidden');
                resumeBtn.disabled = false;
            }
            if (resumeBanner) resumeBanner.classList.remove('hidden');
            if (resumeTimer) {
                const m = Math.floor(saved.remainingSeconds / 60);
                const s = saved.remainingSeconds % 60;
                resumeTimer.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            }
            if (confirmTitle) {
                confirmTitle.textContent = 'Active Quiz Attempt In Progress';
            }
            if (confirmDesc) {
                confirmDesc.innerHTML = `You have already started the 10-item knowledge check for <strong class="text-slate-900">${title}</strong>. Starting a new quiz is <span class="text-rose-600 font-bold">disabled</span> while an active attempt is running. Please resume your current attempt before time expires.`;
            }
        } else if (completedRecord && completedRecord.taken) {
            // When already completed: DISABLE "Start Quiz" and show "Quiz Completed" text
            if (startBtn) {
                startBtn.classList.remove('hidden');
                startBtn.disabled = true;
                startBtn.className = 'px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center space-x-2 cursor-not-allowed opacity-90 shadow-none';
                startBtn.innerHTML = `<i class="fas fa-circle-check text-emerald-600"></i><span>Quiz Completed ✓ (${completedRecord.score}%)</span>`;
            }
            if (resumeBtn) {
                resumeBtn.classList.add('hidden');
                resumeBtn.disabled = true;
            }
            if (resumeBanner) resumeBanner.classList.add('hidden');
            if (confirmTitle) {
                confirmTitle.textContent = 'Knowledge Quiz Already Completed';
            }
            if (confirmDesc) {
                confirmDesc.innerHTML = `You have already completed the 10-item knowledge check for <strong class="text-slate-900">${title}</strong> with a score of <span class="text-emerald-700 font-bold">${completedRecord.score}% (${completedRecord.passed ? 'Passed' : 'Completed'})</span>. Retaking completed compliance quizzes is disabled.`;
            }
        } else {
            // No active attempt and not yet taken: allow starting quiz fresh
            if (startBtn) {
                startBtn.classList.remove('hidden');
                startBtn.disabled = false;
                startBtn.className = 'btn-primary px-6 py-2.5 text-xs font-bold rounded-xl flex items-center space-x-2 shadow-2xs';
                startBtn.innerHTML = `<span>Start 10-Min Quiz</span><i class="fas fa-arrow-right text-[10px]"></i>`;
            }
            if (resumeBtn) {
                resumeBtn.classList.add('hidden');
            }
            if (resumeBanner) resumeBanner.classList.add('hidden');
            if (confirmTitle) {
                confirmTitle.textContent = 'Are you sure you want to take this quiz?';
            }
            if (confirmDesc) {
                confirmDesc.innerHTML = `You are about to begin the associate knowledge check for <strong id="quiz-confirm-book-title" class="text-slate-800">${title}</strong>.`;
            }
        }

        // Switch screens to Screen 1: Confirmation
        showScreen('confirm');
        openModal('modal-lms-quiz');
    };

    /**
     * User confirms they want to take the quiz
     */
    window.confirmAndBeginQuiz = async function () {
        const bookId = window.activeQuizState.bookId;
        if (!bookId) return;

        // Guard 1: If already completed, lock and prevent taking quiz
        const alreadyDone = window.getCompletedQuizRecord(bookId);
        if (alreadyDone && alreadyDone.taken) {
            if (typeof showToast === 'function') {
                showToast(`You have already completed the quiz for "${window.activeQuizState.bookTitle}" (${alreadyDone.score}%).`, 'info');
            }
            return;
        }

        // Guard 2: If attempt has already started, do NOT start new quiz! Resume instead!
        const existingAttempt = loadQuizFromLocalStorage(bookId);
        if (existingAttempt && !existingAttempt.isSubmitted && existingAttempt.remainingSeconds > 0 && Array.isArray(existingAttempt.questions) && existingAttempt.questions.length === 10) {
            if (typeof showToast === 'function') {
                showToast('Quiz already started. Resuming your active attempt.', 'info');
            }
            resumeQuizFromLocalStorage();
            return;
        }

        showScreen('loading');
        const subEl = document.getElementById('quiz-loading-sub');
        if (subEl) subEl.textContent = `Analyzing handbook file & generating 10 questions from "${window.activeQuizState.bookTitle}"...`;

        try {
            // Invalidate local memory cache to guarantee fresh file-derived questions
            delete window.lmsQuizCache[bookId];

            // Fetch dynamic questions from backend
            const res = await fetch(`api/lms.php?action=generate_quiz&book_id=${encodeURIComponent(bookId)}&force=1`);
            const json = await res.json();
            
            if (!json || !json.success || !Array.isArray(json.questions) || json.questions.length < 10) {
                const errMsg = json?.message || `Failed to generate dynamic questions from the file for "${window.activeQuizState.bookTitle}".`;
                throw new Error(errMsg);
            }

            const quizData = json;
            window.lmsQuizCache[bookId] = json;

            // Initialize State
            window.activeQuizState.questions = quizData.questions;
            window.activeQuizState.totalItems = quizData.questions.length;
            window.activeQuizState.answers = {};
            window.activeQuizState.currentIndex = 0;
            window.activeQuizState.durationSeconds = 600; // 10 minutes
            window.activeQuizState.remainingSeconds = 600;
            window.activeQuizState.startedAt = Date.now();
            window.activeQuizState.isSubmitted = false;

            // Save initial state to LocalStorage
            saveQuizToLocalStorage();

            // Launch Active Quiz
            startLiveTimer();
            renderActiveQuizUI();
            showScreen('active');

        } catch (err) {
            console.error('Quiz initialization error:', err);
            showScreen('confirm');
            if (typeof showToast === 'function') {
                showToast(err.message || 'Unable to launch quiz from handbook file.', 'error');
            }
        }
    };

    /**
     * Resume Saved Quiz from LocalStorage
     */
    window.resumeQuizFromLocalStorage = function () {
        const bookId = window.activeQuizState.bookId;
        const saved = loadQuizFromLocalStorage(bookId);
        if (!saved || saved.isSubmitted || saved.remainingSeconds <= 0) {
            confirmAndBeginQuiz();
            return;
        }

        // Calculate actual elapsed time since save
        const now = Date.now();
        const elapsedSinceSave = Math.floor((now - (saved.lastSavedAt || now)) / 1000);
        const adjustedRemaining = Math.max(1, saved.remainingSeconds - elapsedSinceSave);

        window.activeQuizState = {
            ...saved,
            remainingSeconds: adjustedRemaining
        };

        startLiveTimer();
        renderActiveQuizUI();
        showScreen('active');

        if (typeof showToast === 'function') {
            showToast('Resumed active quiz attempt from local storage.', 'info');
        }
    };

    /**
     * LocalStorage Helpers
     */
    function saveQuizToLocalStorage() {
        try {
            const key = getStorageKey(window.activeQuizState.bookId);
            const dataToSave = {
                bookId: window.activeQuizState.bookId,
                bookTitle: window.activeQuizState.bookTitle,
                department: window.activeQuizState.department,
                category: window.activeQuizState.category,
                questions: window.activeQuizState.questions,
                answers: window.activeQuizState.answers,
                currentIndex: window.activeQuizState.currentIndex,
                totalItems: window.activeQuizState.totalItems,
                remainingSeconds: window.activeQuizState.remainingSeconds,
                startedAt: window.activeQuizState.startedAt,
                lastSavedAt: Date.now(),
                isSubmitted: window.activeQuizState.isSubmitted
            };
            localStorage.setItem(key, JSON.stringify(dataToSave));
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }
    }

    function loadQuizFromLocalStorage(bookId) {
        try {
            const key = getStorageKey(bookId);
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function clearQuizLocalStorage(bookId) {
        try {
            const key = getStorageKey(bookId);
            localStorage.removeItem(key);
        } catch (e) {}
    }

    /**
     * 10-Minute Countdown Timer
     */
    function startLiveTimer() {
        if (window.activeQuizState.timerInterval) {
            clearInterval(window.activeQuizState.timerInterval);
        }

        updateTimerDisplay();

        window.activeQuizState.timerInterval = setInterval(() => {
            window.activeQuizState.remainingSeconds--;

            updateTimerDisplay();

            // Save state every 5 seconds
            if (window.activeQuizState.remainingSeconds % 5 === 0) {
                saveQuizToLocalStorage();
            }

            // Time's up!
            if (window.activeQuizState.remainingSeconds <= 0) {
                clearInterval(window.activeQuizState.timerInterval);
                window.activeQuizState.remainingSeconds = 0;
                updateTimerDisplay();
                if (typeof showToast === 'function') {
                    showToast('Time is up! Submitting your answers automatically...', 'warning');
                }
                finalizeAndGradeQuiz(true);
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const totalSec = Math.max(0, window.activeQuizState.remainingSeconds);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        const clockEl = document.getElementById('quiz-timer-clock');
        const pillEl = document.getElementById('quiz-timer-pill');
        const iconEl = document.getElementById('quiz-timer-icon');
        const reviewTimerEl = document.getElementById('quiz-review-timer-badge');

        if (clockEl) clockEl.textContent = timeStr;
        if (reviewTimerEl) reviewTimerEl.textContent = `Time Remaining: ${timeStr}`;

        if (pillEl) {
            if (totalSec <= 60) {
                pillEl.className = 'flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 font-mono font-bold text-xs shadow-xs animate-pulse';
                if (iconEl) iconEl.className = 'fas fa-stopwatch text-rose-600 animate-spin';
            } else if (totalSec <= 180) {
                pillEl.className = 'flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-mono font-bold text-xs shadow-2xs';
                if (iconEl) iconEl.className = 'fas fa-stopwatch text-amber-700 animate-pulse';
            } else {
                pillEl.className = 'flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold text-xs shadow-2xs';
                if (iconEl) iconEl.className = 'fas fa-stopwatch text-amber-600';
            }
        }
    }

    /**
     * Render the Active Quiz UI (Question, Options, Navigator 1-10)
     */
    function renderActiveQuizUI() {
        const s = window.activeQuizState;
        const qIndex = s.currentIndex;
        const q = s.questions[qIndex];
        if (!q) return;

        // Header Title & Dept
        const titleEl = document.getElementById('quiz-active-title');
        const deptEl = document.getElementById('quiz-header-dept');
        if (titleEl) titleEl.textContent = s.bookTitle;
        if (deptEl) deptEl.textContent = `${s.department} · 10 Items`;

        // Question Badge & Text
        const numBadge = document.getElementById('quiz-q-num-badge');
        const statusBadge = document.getElementById('quiz-q-status-badge');
        const qText = document.getElementById('quiz-q-text');

        const isAnswered = s.answers[qIndex] !== undefined;

        if (numBadge) numBadge.textContent = `Question ${qIndex + 1} of 10`;
        if (statusBadge) {
            if (isAnswered) {
                statusBadge.className = 'badge-sage text-[10px] font-bold';
                statusBadge.textContent = 'Answered ✓';
            } else {
                statusBadge.className = 'badge-dusty text-[10px] font-bold';
                statusBadge.textContent = 'Not Answered';
            }
        }
        if (qText) qText.textContent = q.question || 'Scenario question';

        // Render Options (A, B, C, D)
        const optContainer = document.getElementById('quiz-options-container');
        if (optContainer && Array.isArray(q.options)) {
            const letters = ['A', 'B', 'C', 'D'];
            const selectedOpt = s.answers[qIndex];

            optContainer.innerHTML = q.options.map((optText, optIdx) => {
                const isSelected = selectedOpt === optIdx;
                const borderClass = isSelected
                    ? 'border-primary bg-primary-50/40 ring-2 ring-primary/30 shadow-xs'
                    : 'border-[#E8DEDC] bg-white hover:bg-[#FAF8F7] hover:border-slate-300';
                const circleClass = isSelected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-slate-100 text-slate-700 border-slate-300';

                return `
                    <label onclick="selectQuizOption(${optIdx})"
                        class="flex items-start space-x-3 p-3.5 rounded-2xl border ${borderClass} cursor-pointer transition select-none">
                        <div class="w-6 h-6 rounded-full border ${circleClass} flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 transition">
                            ${letters[optIdx] || (optIdx + 1)}
                        </div>
                        <div class="flex-1">
                            <span class="text-slate-800 font-semibold text-xs leading-relaxed block">${optText}</span>
                        </div>
                        <input type="radio" name="quiz_current_opt" value="${optIdx}" ${isSelected ? 'checked' : ''} class="hidden">
                    </label>
                `;
            }).join('');
        }

        // Render 1 to 10 Navigation Strip
        renderNavStrip();

        // Footer Navigation Controls
        const prevBtn = document.getElementById('btn-quiz-prev');
        const nextBtn = document.getElementById('btn-quiz-next');
        const submitBtn = document.getElementById('btn-quiz-submit');
        const pageInd = document.getElementById('quiz-page-indicator');

        if (pageInd) pageInd.textContent = `Page ${qIndex + 1} of 10`;

        if (prevBtn) {
            prevBtn.disabled = (qIndex === 0);
        }

        // Switch Next to Submit on item 10
        if (qIndex === 9) {
            if (nextBtn) nextBtn.classList.add('hidden');
            if (submitBtn) submitBtn.classList.remove('hidden');
        } else {
            if (nextBtn) nextBtn.classList.remove('hidden');
            if (submitBtn) submitBtn.classList.add('hidden');
        }
    }

    /**
     * Render the 1 to 10 Question Navigator Strip
     */
    function renderNavStrip() {
        const container = document.getElementById('quiz-nav-strip');
        if (!container) return;

        const s = window.activeQuizState;
        const currentIdx = s.currentIndex;
        const total = s.totalItems || 10;

        let answeredCount = 0;

        const html = [];
        for (let i = 0; i < total; i++) {
            const isAnswered = s.answers[i] !== undefined;
            const isCurrent = (i === currentIdx);

            if (isAnswered) answeredCount++;

            let btnClasses = 'w-8 h-8 rounded-xl font-bold text-xs transition flex items-center justify-center border shadow-2xs relative ';

            if (isCurrent) {
                btnClasses += 'bg-white text-primary border-primary ring-2 ring-primary/40 font-black scale-105 z-10';
            } else if (isAnswered) {
                btnClasses += 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200';
            } else {
                btnClasses += 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800';
            }

            html.push(`
                <button onclick="goToQuizQuestion(${i})" class="${btnClasses}" title="Question ${i + 1}: ${isAnswered ? 'Answered' : 'Not Answered'}">
                    <span>${i + 1}</span>
                    ${isAnswered && !isCurrent ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute top-1 right-1"></span>' : ''}
                </button>
            `);
        }

        container.innerHTML = html.join('');

        // Progress counter text
        const counterEl = document.getElementById('quiz-progress-counter');
        if (counterEl) {
            counterEl.textContent = `${answeredCount} of ${total} Answered`;
        }
    }

    /**
     * User clicks an option
     */
    window.selectQuizOption = function (optIndex) {
        const s = window.activeQuizState;
        s.answers[s.currentIndex] = optIndex;

        // Persist immediately
        saveQuizToLocalStorage();

        // Update active UI & navigator strip in real-time
        renderActiveQuizUI();
    };

    /**
     * Navigate: Direct jump to Question (0-indexed)
     */
    window.goToQuizQuestion = function (targetIndex) {
        const s = window.activeQuizState;
        if (targetIndex < 0 || targetIndex >= s.totalItems) return;
        s.currentIndex = targetIndex;
        saveQuizToLocalStorage();
        renderActiveQuizUI();
    };

    /**
     * Navigate: Next Question
     */
    window.nextQuizQuestion = function () {
        const s = window.activeQuizState;
        if (s.currentIndex < s.totalItems - 1) {
            s.currentIndex++;
            saveQuizToLocalStorage();
            renderActiveQuizUI();
        } else {
            showQuizReviewScreen();
        }
    };

    /**
     * Navigate: Previous Question
     */
    window.prevQuizQuestion = function () {
        const s = window.activeQuizState;
        if (s.currentIndex > 0) {
            s.currentIndex--;
            saveQuizToLocalStorage();
            renderActiveQuizUI();
        }
    };

    /**
     * Show Review Screen (Page 10 Submit or button clicked)
     */
    window.showQuizReviewScreen = function () {
        const s = window.activeQuizState;
        const total = s.totalItems || 10;
        let answeredCount = 0;
        const unansweredIndices = [];

        for (let i = 0; i < total; i++) {
            if (s.answers[i] !== undefined) {
                answeredCount++;
            } else {
                unansweredIndices.push(i + 1);
            }
        }

        // Render Review Alert Box
        const alertBox = document.getElementById('quiz-review-alert');
        if (alertBox) {
            if (unansweredIndices.length === 0) {
                alertBox.className = 'p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-center justify-between gap-3 text-xs';
                alertBox.innerHTML = `
                    <div class="flex items-center space-x-2.5">
                        <i class="fas fa-circle-check text-emerald-600 text-lg"></i>
                        <div>
                            <span class="font-bold block">All 10 Questions Answered!</span>
                            <span class="text-[11px] text-emerald-700">You are ready to submit your assessment. Good luck!</span>
                        </div>
                    </div>
                    <span class="badge-sage text-[10px] font-bold">10/10 Ready</span>
                `;
            } else {
                alertBox.className = 'p-4 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 flex items-center justify-between gap-3 text-xs';
                alertBox.innerHTML = `
                    <div class="flex items-center space-x-2.5">
                        <i class="fas fa-triangle-exclamation text-amber-600 text-lg"></i>
                        <div>
                            <span class="font-bold block">Incomplete Answers (${answeredCount} of ${total})</span>
                            <span class="text-[11px] text-amber-700">Questions <strong>${unansweredIndices.join(', ')}</strong> have not been answered yet.</span>
                        </div>
                    </div>
                    <button onclick="goToQuizQuestion(${unansweredIndices[0] - 1}); backToActiveQuiz();" class="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-bold text-[11px] hover:bg-amber-700 transition">
                        Jump to Q${unansweredIndices[0]}
                    </button>
                `;
            }
        }

        // Render 10 Review Cards
        const grid = document.getElementById('quiz-review-items-grid');
        if (grid) {
            grid.innerHTML = s.questions.map((q, idx) => {
                const userAns = s.answers[idx];
                const isAns = (userAns !== undefined);
                const letters = ['A', 'B', 'C', 'D'];
                const chosenText = isAns ? `${letters[userAns]}: ${q.options[userAns]}` : 'No option selected yet';

                return `
                    <div onclick="goToQuizQuestion(${idx}); backToActiveQuiz();"
                        class="p-3.5 rounded-2xl border ${isAns ? 'border-slate-200 bg-[#FAF8F7]' : 'border-amber-200 bg-amber-50/40'} hover:border-primary/50 cursor-pointer transition space-y-1.5 shadow-2xs">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-[11px] ${isAns ? 'text-slate-700' : 'text-amber-800'}">Question ${idx + 1}</span>
                            <span class="text-[10px] font-bold ${isAns ? 'text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full' : 'text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full'}">
                                ${isAns ? 'Answered ✓' : 'Click to Answer'}
                            </span>
                        </div>
                        <p class="text-slate-800 text-xs font-medium line-clamp-1">${q.question}</p>
                        <div class="text-[11px] ${isAns ? 'text-slate-500' : 'text-amber-700 italic'} truncate">
                            ${chosenText}
                        </div>
                    </div>
                `;
            }).join('');
        }

        showScreen('review');
    };

    /**
     * Back to Active Quiz from Review Screen
     */
    window.backToActiveQuiz = function () {
        showScreen('active');
        renderActiveQuizUI();
    };

    /**
     * Finalize, Grade Answers, and Sync with Supabase lms_prescribed + xp_transactions
     */
    window.finalizeAndGradeQuiz = async function (isAutoSubmit = false) {
        const s = window.activeQuizState;

        // Stop timer
        if (s.timerInterval) {
            clearInterval(s.timerInterval);
            s.timerInterval = null;
        }

        s.isSubmitted = true;

        // 1. Calculate Score Deterministically
        let correctCount = 0;
        s.questions.forEach((q, idx) => {
            const userAns = s.answers[idx];
            if (userAns !== undefined && userAns === q.correct) {
                correctCount++;
            }
        });

        const total = s.totalItems || 10;
        const scorePct = Math.round((correctCount / total) * 100);
        const passed = (scorePct >= 80);
        const elapsedSec = Math.max(1, 600 - s.remainingSeconds);
        const elapsedMin = Math.floor(elapsedSec / 60);
        const elapsedRemSec = elapsedSec % 60;
        const timeTakenStr = `${elapsedMin}m ${elapsedRemSec}s`;

        const currentUserId = (window.currentUser?.id || window.activePersonaId || 'emp-101').toLowerCase();

        // 2. Dispatch to Backend
        let serverResult = null;
        try {
            const payload = {
                employee: currentUserId,
                book_id: s.bookId,
                book_title: s.bookTitle,
                score: scorePct,
                total_items: total,
                correct_count: correctCount,
                time_consumed: elapsedSec,
                passed: passed
            };

            const resp = await fetch('api/lms.php?action=submit_quiz_result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            serverResult = await resp.json();
        } catch (e) {
            console.error('Failed to submit quiz to server:', e);
        }

        // 3. Clear active attempt from LocalStorage and persist completed record
        clearQuizLocalStorage(s.bookId);
        try {
            const compRecord = {
                bookId: s.bookId,
                bookTitle: s.bookTitle,
                taken: true,
                passed: passed,
                score: scorePct,
                status: passed ? 'Passed' : 'Completed',
                completedAt: new Date().toISOString()
            };
            localStorage.setItem('oxford_lms_completed_quiz_' + s.bookId + '_' + currentUserId, JSON.stringify(compRecord));
            localStorage.setItem('oxford_lms_completed_quiz_' + s.bookId, JSON.stringify(compRecord));
        } catch (e) {}

        // 4. Update In-Memory dynamicLmsState in Real-Time
        if (window.dynamicLmsState && Array.isArray(window.dynamicLmsState.prescribed)) {
            const existingIdx = window.dynamicLmsState.prescribed.findIndex(p => {
                const empMatch = (p.employee || p.employee_id || '').toLowerCase() === currentUserId;
                const bookMatch = (p.lms_id || p.book_id || '') === s.bookId;
                return empMatch && bookMatch;
            });

            const newPresRecord = {
                id: serverResult?.data?.id || `pres-dyn-${Date.now()}`,
                employee: currentUserId,
                employee_name: window.currentUser?.name || window.activePersonaName || 'Maria Santos',
                employee_title: window.currentUser?.title || 'Associate',
                lms_id: s.bookId,
                document_title: s.bookTitle,
                document_department: s.department,
                scores: scorePct,
                progress: passed ? 100 : Math.max(scorePct, 50),
                ratings: passed ? 4.50 : 2.50,
                status: passed ? 'Passed' : 'Needs Retake',
                last_attempt: new Date().toISOString(),
                time_consumed: Math.max(1, Math.round(elapsedSec / 60)),
                for: 'both'
            };

            if (existingIdx >= 0) {
                window.dynamicLmsState.prescribed[existingIdx] = {
                    ...window.dynamicLmsState.prescribed[existingIdx],
                    ...newPresRecord
                };
            } else {
                window.dynamicLmsState.prescribed.unshift(newPresRecord);
            }

            // Real-Time Table & Bookshelf Re-render
            if (typeof renderTnaEnrollmentsTableRows === 'function') {
                renderTnaEnrollmentsTableRows();
            }
            if (typeof renderLmsBooks === 'function') {
                renderLmsBooks();
            }
        }

        // 5. If passed, notify XP and trigger Social Ledger sync
        if (passed) {
            if (typeof awardXP === 'function') {
                awardXP(100);
            }
            if (typeof showToast === 'function') {
                showToast(`Congratulations! Scored ${scorePct}% on ${s.bookTitle}! +100 XP awarded to ledger!`, 'success');
            }
        } else {
            if (typeof showToast === 'function') {
                showToast(`Scored ${scorePct}%. Benchmark is 80%. Review handbook and retake.`, 'warning');
            }
        }

        // 6. Render Results Screen
        renderQuizResultsUI(scorePct, correctCount, total, passed, timeTakenStr, serverResult);
        showScreen('results');
    };

    /**
     * Render the Final Results Screen
     */
    function renderQuizResultsUI(scorePct, correctCount, total, passed, timeTakenStr, serverResult) {
        const s = window.activeQuizState;

        const scoreNumEl = document.getElementById('quiz-result-score-num');
        const scoreRatioEl = document.getElementById('quiz-result-score-ratio');
        const feedbackEl = document.getElementById('quiz-result-feedback');
        const statusBadge = document.getElementById('quiz-result-status-badge');
        const xpBadge = document.getElementById('quiz-result-xp-badge');
        const iconBox = document.getElementById('quiz-result-icon-box');
        const icon = document.getElementById('quiz-result-icon');
        const card = document.getElementById('quiz-result-card');
        const timeTakenEl = document.getElementById('quiz-result-time-taken');
        const retakeBtn = document.getElementById('btn-quiz-retake');

        if (scoreNumEl) scoreNumEl.textContent = `${scorePct}%`;
        if (scoreRatioEl) scoreRatioEl.textContent = `(${correctCount} of ${total} Correct)`;
        if (timeTakenEl) timeTakenEl.textContent = `Completed in ${timeTakenStr}`;

        if (passed) {
            if (statusBadge) {
                statusBadge.className = 'badge-sage text-[10px] font-extrabold';
                statusBadge.textContent = 'PASSED';
            }
            if (xpBadge) {
                xpBadge.className = 'badge-gold text-[10px] font-extrabold';
                xpBadge.textContent = '+100 XP Granted';
            }
            if (iconBox) iconBox.className = 'w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold border border-emerald-200';
            if (icon) icon.className = 'fas fa-trophy';
            if (card) card.className = 'p-5 rounded-3xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row items-center justify-between gap-4';
            if (feedbackEl) feedbackEl.textContent = 'Outstanding operational proficiency! Your official LMS record has been updated with full compliance completion.';
            if (retakeBtn) retakeBtn.classList.add('hidden');
        } else {
            if (statusBadge) {
                statusBadge.className = 'badge-terracotta text-[10px] font-extrabold';
                statusBadge.textContent = 'NEEDS RETAKE';
            }
            if (xpBadge) {
                xpBadge.className = 'badge-dusty text-[10px] font-extrabold';
                xpBadge.textContent = 'No XP Awarded';
            }
            if (iconBox) iconBox.className = 'w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold border border-amber-200';
            if (icon) icon.className = 'fas fa-rotate-right';
            if (card) card.className = 'p-5 rounded-3xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row items-center justify-between gap-4';
            if (feedbackEl) feedbackEl.textContent = 'Score fell below the 80% passing standard. Review the departmental SOP and retake the quiz to complete this milestone.';
            if (retakeBtn) retakeBtn.classList.remove('hidden');
        }

        // Render Answer Key Review List (Explicitly Showing Correct Answer for Every Single Item 1 to 10)
        const reviewList = document.getElementById('quiz-result-review-list');
        if (reviewList) {
            const letters = ['A', 'B', 'C', 'D'];
            reviewList.innerHTML = s.questions.map((q, idx) => {
                const userChoice = s.answers[idx];
                const isAnswered = (userChoice !== undefined);
                const isCorrect = isAnswered && (userChoice === q.correct);
                const userChoiceText = isAnswered ? `${letters[userChoice]}. ${q.options[userChoice]}` : 'No answer submitted';
                const correctChoiceText = `${letters[q.correct]}. ${q.options[q.correct]}`;

                let badgeHtml = '';
                if (!isAnswered) {
                    badgeHtml = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1"><i class="fas fa-minus text-[9px]"></i> Skipped</span>`;
                } else if (isCorrect) {
                    badgeHtml = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"><i class="fas fa-check text-[9px]"></i> Correct ✓</span>`;
                } else {
                    badgeHtml = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1"><i class="fas fa-xmark text-[9px]"></i> Incorrect ✗</span>`;
                }

                return `
                    <div class="p-4 rounded-2xl border ${isCorrect ? 'border-emerald-200 bg-emerald-50/20' : (!isAnswered ? 'border-amber-200 bg-amber-50/20' : 'border-rose-200 bg-rose-50/20')} space-y-2.5 text-xs shadow-2xs">
                        <div class="flex items-center justify-between gap-2">
                            <span class="font-extrabold text-slate-900 flex items-center gap-1.5">
                                <span class="w-5 h-5 rounded-md bg-slate-200 text-slate-800 flex items-center justify-center text-[11px] font-mono font-bold">${idx + 1}</span>
                                <span>Question ${idx + 1} of ${total}</span>
                            </span>
                            ${badgeHtml}
                        </div>
                        
                        <p class="text-slate-900 font-bold text-xs leading-relaxed">${q.question}</p>
                        
                        <div class="space-y-2 pt-2 border-t border-slate-200/60">
                            <!-- User Choice Display -->
                            <div class="p-2.5 rounded-xl ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : (!isAnswered ? 'bg-slate-50 border border-slate-200 text-slate-500' : 'bg-rose-50 border border-rose-200')} flex items-start gap-2">
                                <span class="font-bold text-[11px] ${isCorrect ? 'text-emerald-800' : (!isAnswered ? 'text-slate-500' : 'text-rose-800')} flex-shrink-0">
                                    Your Answer:
                                </span>
                                <span class="text-xs font-semibold ${isCorrect ? 'text-emerald-950 font-bold' : (!isAnswered ? 'italic text-slate-500' : 'text-rose-950 font-bold')}">
                                    ${userChoiceText}
                                </span>
                            </div>

                            <!-- Standard Verified Correct Answer (Always Rendered for All Items) -->
                            <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-300 text-emerald-950 flex items-start gap-2 shadow-2xs">
                                <div class="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="flex-1">
                                    <span class="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">Verified Correct Answer:</span>
                                    <div class="text-xs font-extrabold text-emerald-950 mt-0.5">${correctChoiceText}</div>
                                </div>
                            </div>

                            <!-- Explanation & Handbook Grounding Reference -->
                            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 text-[11px] flex items-start gap-2">
                                <i class="fas fa-book-open text-primary mt-0.5 text-xs flex-shrink-0"></i>
                                <div class="flex-1 leading-relaxed">
                                    <strong class="text-slate-800 font-semibold">Handbook Reference:</strong> ${q.explanation || 'Verified standard operating protocol from course handbook.'}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    /**
     * Restart/Retake Quiz
     */
    window.restartQuiz = function () {
        clearQuizLocalStorage(window.activeQuizState.bookId);
        confirmAndBeginQuiz();
    };

    /**
     * Safe Close / Exit with confirmation if in-progress
     */
    window.promptCloseQuiz = function () {
        const s = window.activeQuizState;
        if (!s.isSubmitted && s.remainingSeconds > 0 && Object.keys(s.answers).length > 0) {
            const ok = confirm('Your current answers are saved in local storage. The 10-minute timer will continue running. Are you sure you want to close?');
            if (!ok) return;
        }
        closeQuizModal();
    };

    window.closeQuizModal = function () {
        if (window.activeQuizState.timerInterval) {
            clearInterval(window.activeQuizState.timerInterval);
            window.activeQuizState.timerInterval = null;
        }
        if (typeof closeModal === 'function') {
            closeModal('modal-lms-quiz');
        }
    };

    /**
     * Screen Switcher Helper
     */
    function showScreen(screenName) {
        const screens = ['confirm', 'loading', 'active', 'review', 'results'];
        screens.forEach(s => {
            const el = document.getElementById(`quiz-screen-${s}`);
            if (el) {
                if (s === screenName) {
                    el.classList.remove('hidden');
                    if (s === 'active' || s === 'review' || s === 'results') {
                        el.classList.add('flex');
                    }
                } else {
                    el.classList.add('hidden');
                    el.classList.remove('flex');
                }
            }
        });
    }

    // Override legacy app.js launchInteractiveQuiz to point to the new engine
    window.launchInteractiveQuiz = function (moduleName, bookId) {
        const id = bookId || 'book_frontdesk';
        window.startQuizPrompt(id, moduleName);
    };

})();
