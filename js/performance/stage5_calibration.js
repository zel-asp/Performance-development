/**
 * js/performance/stage5_calibration.js
 * Stage 5: Calibration & 1-on-1 Review
 */

function renderReviewRosterTable() {
    const tbody = document.getElementById('review-roster-tbody') || document.getElementById('perf-review-roster-tbody');
    if (!tbody) return;

    if (!window.perfRoster || window.perfRoster.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="py-12 text-center text-slate-400">
                    <div class="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg mx-auto font-bold mb-2">
                        <i class="fas fa-sliders"></i>
                    </div>
                    <p class="text-sm font-semibold text-slate-600">No Associates in 1-on-1 Review Roster</p>
                    <p class="text-xs text-slate-400 mt-1">Associates evaluated in Stage 4 will appear here for 1-on-1 calibration and rating lock.</p>
                </td>
            </tr>
        `;
        return;
    }

    const dbEvals = getDbEvaluations();
    const searchInput = document.getElementById('search-review-emp') || document.getElementById('review-search-input');
    const searchQuery = ((typeof window.reviewSearchQuery !== 'undefined' && window.reviewSearchQuery !== null) ? window.reviewSearchQuery : (searchInput ? searchInput.value : '')).toLowerCase().trim();

    let roster = (window.perfRoster || []).filter(emp => {
        return (window.dbGoals || []).some(g => g.status === 'Approved' && isSameEmployee(g.employee_id, emp.id));
    });

    if (searchQuery) {
        roster = roster.filter(emp => {
            const name = (emp.name || '').toLowerCase();
            const pos = (emp.position || '').toLowerCase();
            const dept = (emp.department || '').toLowerCase();
            const id = (emp.id || '').toLowerCase();
            return name.includes(searchQuery) || pos.includes(searchQuery) || dept.includes(searchQuery) || id.includes(searchQuery);
        });
    }

    if (roster.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="py-12 text-center text-slate-400">
                    <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-lg mx-auto font-bold mb-2">
                        <i class="fas fa-handshake"></i>
                    </div>
                    <p class="text-sm font-semibold text-slate-600">No Associates in 1-on-1 Review</p>
                    <p class="text-xs text-slate-400 mt-1">Associates with active approved objectives and formal appraisal will appear here for calibration.</p>
                </td>
            </tr>
        `;
        return;
    }

function checkEmployeeStage5Tasks(empId) {
    const empGoals = (window.dbGoals || []).filter(g => g.status === 'Approved' && isSameEmployee(g.employee_id, empId));
    let totalTasks = 0;
    let completedTasks = 0;
    empGoals.forEach(g => {
        (g.tasks || []).forEach(t => {
            totalTasks++;
            if (t.status === 'completed') completedTasks++;
        });
    });
    const allTasksDone = totalTasks > 0 ? (completedTasks === totalTasks) : true;
    return {
        allTasksDone,
        totalTasks,
        completedTasks
    };
}
window.checkEmployeeStage5Tasks = checkEmployeeStage5Tasks;

    tbody.innerHTML = roster.map((emp, idx) => {
        const evalRec = dbEvals.find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;
        const initialRating = evalRec && typeof evalRec.supervisor_rating !== 'undefined' && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0
            ? parseFloat(evalRec.supervisor_rating)
            : (emp.supervisorRating && emp.supervisorRating > 0 ? parseFloat(emp.supervisorRating) : null);
        const calibratedScore = evalRec && typeof evalRec.calibrated_score !== 'undefined' && evalRec.calibrated_score !== null && parseFloat(evalRec.calibrated_score) > 0
            ? parseFloat(evalRec.calibrated_score)
            : (emp.calibratedScore && emp.calibratedScore > 0 ? parseFloat(emp.calibratedScore) : null);
        const isCalibrated = !!(calibratedScore !== null && calibratedScore > 0 && (evalRec?.status === 'Calibrated' || emp.reviewStatus === 'Calibrated'));
        const isRated = !!(initialRating !== null && initialRating > 0);
        const isBelowBenchmark = isCalibrated && calibratedScore !== null && calibratedScore < 3.0;

        let statusBadge = '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">Pending Eval</span>';
        if (isCalibrated) {
            statusBadge = '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Calibrated</span>';
        } else if (isRated) {
            statusBadge = '<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Awaiting 1-on-1</span>';
        }

        const tierLabel = isCalibrated ? (evalRec?.tier_label || (calibratedScore >= 4.5 ? 'Master Tier' : (calibratedScore >= 3.5 ? 'Advanced Tier' : (calibratedScore >= 3.0 ? 'Proficient' : 'Developing (Needs PIP)')))) : '--';

        const taskCheck = checkEmployeeStage5Tasks(emp.id);
        const allTasksDone = taskCheck.allTasksDone;

        let actionBtnHtml = '';
        if (isCalibrated) {
            actionBtnHtml = `
                <button onclick="showCalibrationDetail('${emp.id}', true)" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition inline-flex items-center space-x-1.5">
                    <i class="fas fa-eye text-[10px]"></i>
                    <span>View Record</span>
                </button>
                ${allTasksDone ? `
                    <button onclick="openCalibrationModal('${emp.id}')" class="px-3 py-1.5 bg-white hover:bg-slate-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition inline-flex items-center space-x-1.5">
                        <i class="fas fa-sliders text-[10px]"></i>
                        <span>Re-Calibrate</span>
                    </button>
                ` : `
                    <button disabled title="Tasks are not done (${taskCheck.completedTasks}/${taskCheck.totalTasks} completed in Stage 3). Complete all monitoring tasks before re-calibrating." class="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl border border-slate-200 cursor-not-allowed inline-flex items-center space-x-1.5">
                        <i class="fas fa-lock text-[10px]"></i>
                        <span>Re-Calibrate (Locked)</span>
                    </button>
                `}
            `;
        } else if (isRated) {
            if (allTasksDone) {
                actionBtnHtml = `
                    <button onclick="openCalibrationModal('${emp.id}')" class="px-3 py-1.5 btn-primary bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition inline-flex items-center space-x-1.5">
                        <i class="fas fa-sliders text-[10px]"></i>
                        <span>Calibrate 1-on-1</span>
                    </button>
                `;
            } else {
                actionBtnHtml = `
                    <button disabled title="Tasks are not done (${taskCheck.completedTasks}/${taskCheck.totalTasks} completed in Stage 3). Complete all monitoring tasks before calibrating." class="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl border border-slate-200 cursor-not-allowed inline-flex items-center space-x-1.5">
                        <i class="fas fa-lock text-[10px]"></i>
                        <span>Tasks Incomplete</span>
                    </button>
                `;
            }
        } else {
            actionBtnHtml = `
                <button disabled title="Complete formal appraisal first." class="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl border border-slate-200 cursor-not-allowed inline-flex items-center space-x-1.5">
                    <i class="fas fa-lock text-[10px]"></i>
                    <span>Appraisal Needed</span>
                </button>
            `;
        }

        const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40';

        return `
            <tr class="${rowBg} hover:bg-[#FAF8F7] transition border-b border-slate-100 text-xs">
                <td class="px-3 py-4 text-center text-slate-400 font-mono text-[11px]">${idx + 1}</td>
                <td class="px-5 py-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            ${emp.avatar || emp.name.charAt(0)}
                        </div>
                        <div>
                            <div class="font-bold text-slate-900 text-xs hover:text-indigo-600 cursor-pointer" onclick="showCalibrationDetail('${emp.id}', true)">${emp.name}</div>
                            <div class="text-[10px] text-slate-400 font-mono">${emp.position}</div>
                        </div>
                    </div>
                </td>
                <td class="px-5 py-4">
                    <span class="text-xs font-medium text-slate-600">${emp.department}</span>
                </td>
                <td class="px-5 py-4">
                    <span class="text-xs font-mono text-slate-700">${initialRating !== null ? initialRating.toFixed(2) + ' / 5.0' : '<span class="text-slate-400 italic">--</span>'}</span>
                </td>
                <td class="px-5 py-4">
                    <span class="text-xs font-mono font-bold ${isBelowBenchmark ? 'text-rose-600' : 'text-slate-900'}">${isCalibrated && calibratedScore !== null ? calibratedScore.toFixed(2) + ' / 5.0' : '<span class="text-slate-400 font-normal italic">Pending</span>'}</span>
                </td>
                <td class="px-5 py-4 text-center">
                    ${statusBadge}
                </td>
                <td class="px-5 py-4 text-right">
                    <div class="flex items-center justify-end space-x-2">
                        ${actionBtnHtml}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}
window.renderReviewRosterTable = renderReviewRosterTable;

window.onReviewEmployeeSearch = function(query) {
    window.reviewSearchQuery = query;
    renderReviewRosterTable();
};

function filterReviewRoster() {
    const search = (document.getElementById('search-review-emp')?.value || document.getElementById('review-search-input')?.value || '').toLowerCase();
    const dept = document.getElementById('review-dept-filter')?.value || 'all';

    const rows = document.querySelectorAll('#review-roster-tbody tr, #perf-review-roster-tbody tr');
    rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        const matchesSearch = !search || text.includes(search);
        const matchesDept = dept === 'all' || text.includes(dept.toLowerCase());
        r.style.display = (matchesSearch && matchesDept) ? '' : 'none';
    });
}
window.filterReviewRoster = filterReviewRoster;

function showCalibrationDetail(empId, openModalImmediately = false) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || (window.perfRoster || [])[0];
    if (!emp) return;

    window.selectedCalibEmpId = emp.id;

    const nameEl = document.getElementById('calib-detail-emp-name') || document.getElementById('calib-modal-emp-title');
    const posEl = document.getElementById('calib-detail-emp-pos') || document.getElementById('calib-modal-emp-subtitle');
    const idEl = document.getElementById('calib-detail-emp-id');
    const avatarEl = document.getElementById('calib-detail-emp-avatar');
    if (nameEl) nameEl.textContent = `1-on-1 Discussion & Calibration: ${emp.name}`;
    if (posEl) posEl.textContent = `${emp.position} · ${emp.department}`;
    if (idEl) idEl.textContent = `EMP #${emp.id}`;
    if (avatarEl) avatarEl.textContent = emp.avatar || emp.name.charAt(0);

    const dbEvals = getDbEvaluations();
    const evalRec = dbEvals.find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;

    const initialRating = evalRec?.supervisor_rating ? parseFloat(evalRec.supervisor_rating) : (emp.supervisorRating || 0);
    const calibratedScore = evalRec?.calibrated_score ? parseFloat(evalRec.calibrated_score) : (emp.calibratedScore || 0);
    const isCalibrated = !!evalRec?.calibrated_score || emp.reviewStatus === 'Calibrated';
    const isBelowBenchmark = (calibratedScore > 0 ? calibratedScore : initialRating) > 0 && (calibratedScore > 0 ? calibratedScore : initialRating) < 3.0;
    const tierLabel = evalRec?.tier_label || emp.tierLabel || (isCalibrated ? (calibratedScore >= 4.5 ? 'Master Tier' : (calibratedScore >= 3.5 ? 'Advanced Tier' : 'Proficient')) : 'Pending Calibration');

    const statusBadge = document.getElementById('calib-detail-status-badge') || document.getElementById('calib-modal-status-badge');
    if (statusBadge) {
        if (isCalibrated) {
            statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
            statusBadge.textContent = '✓ Calibration Finalized';
        } else {
            statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200';
            statusBadge.textContent = 'Awaiting 1-on-1 Review';
        }
    }

    const initScoreEl = document.getElementById('calib-detail-initial-score');
    if (initScoreEl) {
        initScoreEl.innerHTML = `${initialRating ? initialRating.toFixed(2) : '0.00'} <span class="text-sm font-normal text-slate-400">/ 5.0</span>`;
    }

    const calibScoreEl = document.getElementById('calib-detail-final-score') || document.getElementById('calib-detail-score-val');
    if (calibScoreEl) {
        if (isCalibrated) {
            calibScoreEl.innerHTML = `${calibratedScore.toFixed(2)} <span class="text-sm font-normal text-slate-400">/ 5.0 (${tierLabel})</span>`;
        } else {
            calibScoreEl.innerHTML = `-- <span class="text-sm font-normal text-slate-400">/ 5.0 (Pending)</span>`;
        }
    }

    const tierLabelEl = document.getElementById('calib-detail-tier-label');
    if (tierLabelEl) {
        tierLabelEl.textContent = isCalibrated ? tierLabel : 'Pending Calibration';
    }

    const minutesContainer = document.getElementById('calib-detail-minutes-container') || document.getElementById('calib-detail-discussion-minutes');
    if (minutesContainer) {
        if (evalRec && evalRec.discussion_minutes) {
            minutesContainer.innerHTML = `<p class="text-slate-800 leading-relaxed italic">"${evalRec.discussion_minutes}"</p>`;
        } else {
            minutesContainer.innerHTML = `<p class="text-slate-400 italic">No 1-on-1 discussion notes recorded in database yet.</p>`;
        }
    }

    const nextStepContainer = document.getElementById('calib-next-step-container');
    if (nextStepContainer) {
        if (isCalibrated && !isBelowBenchmark) {
            nextStepContainer.innerHTML = `
                <div class="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs flex items-center justify-between">
                    <span class="text-emerald-900 font-medium"><i class="fas fa-check-circle text-emerald-600 mr-1.5"></i> Calibrated score passed benchmark. Associate qualified for Stage 6 Development (IDP).</span>
                    <button onclick="proceedFromPhase5ToPhase6('${emp.id}')" class="btn-primary px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700">Go to IDP</button>
                </div>
            `;
        } else if (isCalibrated && isBelowBenchmark) {
            nextStepContainer.innerHTML = `
                <div class="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs flex items-center justify-between">
                    <span class="text-rose-900 font-medium"><i class="fas fa-triangle-exclamation text-rose-600 mr-1.5"></i> Calibrated score below 3.0. Review action tasks or initiate remedial development.</span>
                    <button onclick="proceedFromPhase5ToPhase6('${emp.id}')" class="btn-primary px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700">Review Plan</button>
                </div>
            `;
        } else {
            nextStepContainer.innerHTML = '';
        }
    }

    const btnOpenCalib = document.getElementById('btn-open-calib-modal') || document.getElementById('calib-detail-btn-open-modal');
    if (btnOpenCalib) {
        btnOpenCalib.onclick = () => {
            closeModal('modal-view-calibration');
            openCalibrationModal(emp.id);
        };
    }

    if (openModalImmediately) {
        openModal('modal-view-calibration');
    }
}
window.showCalibrationDetail = showCalibrationDetail;

function hideCalibrationDetail() {
    closeModal('modal-view-calibration');
}
window.hideCalibrationDetail = hideCalibrationDetail;

function openCalibrationModal(empId) {
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId)) || (window.perfRoster || [])[0];
    if (!emp) return;

    window.selectedCalibEmpId = emp.id;

    // Check if monitoring tasks are completed
    const taskCheck = checkEmployeeStage5Tasks(emp.id);
    if (!taskCheck.allTasksDone) {
        if (typeof showToast === 'function') {
            showToast(`⚠️ Cannot calibrate ${emp.name}: Monitoring tasks are still not done (${taskCheck.completedTasks}/${taskCheck.totalTasks} completed). Complete all tasks in Stage 3 Continuous Monitoring first.`, 'warning');
        }
        return;
    }

    closeModal('modal-view-calibration');
    closeModal('modal-1on1-minutes-viewer');

    const dbEvals = getDbEvaluations();
    const evalRec = dbEvals.find(ev => isSameEmployee(ev.employee_id, emp.id)) || emp.evaluationRecord;

    const targetInput = document.getElementById('calib-target-emp-id');
    const titleEl = document.getElementById('modal-calib-emp-title');
    if (targetInput) targetInput.value = emp.id;
    if (titleEl) titleEl.textContent = `1-on-1 Review & Calibration: ${emp.name} (${emp.position})`;

    const selfScore = evalRec && typeof evalRec.self_evaluation !== 'undefined' && evalRec.self_evaluation !== null && parseFloat(evalRec.self_evaluation) > 0
        ? parseFloat(evalRec.self_evaluation)
        : (emp.selfRating && parseFloat(emp.selfRating) > 0 ? parseFloat(emp.selfRating) : null);
    const supScore = evalRec && typeof evalRec.supervisor_rating !== 'undefined' && evalRec.supervisor_rating !== null && parseFloat(evalRec.supervisor_rating) > 0
        ? parseFloat(evalRec.supervisor_rating)
        : (emp.supervisorRating && parseFloat(emp.supervisorRating) > 0 ? parseFloat(emp.supervisorRating) : 4.50);
    const recommendedScore = selfScore !== null ? parseFloat(((selfScore + supScore) / 2).toFixed(2)) : supScore;
    window.currentRecommendedScore = recommendedScore;

    const selfScoreEl = document.getElementById('calib-self-score-display');
    if (selfScoreEl) {
        selfScoreEl.innerHTML = selfScore !== null 
            ? `<i class="fas fa-star text-amber-400 mr-1 text-xs"></i>${selfScore.toFixed(2)} / 5.0`
            : `<span class="text-slate-400 font-normal italic">Pending</span>`;
    }

    const supScoreEl = document.getElementById('calib-supervisor-score-display');
    if (supScoreEl) {
        supScoreEl.innerHTML = `<i class="fas fa-star text-amber-400 mr-1 text-xs"></i>${supScore.toFixed(2)} / 5.0`;
    }

    const recScoreEl = document.getElementById('calib-recommended-score-display');
    if (recScoreEl) {
        recScoreEl.innerHTML = `<i class="fas fa-star text-amber-400 mr-1 text-xs"></i>${recommendedScore.toFixed(2)} / 5.0`;
    }

    const existingCalib = evalRec && typeof evalRec.calibrated_score !== 'undefined' && evalRec.calibrated_score !== null && parseFloat(evalRec.calibrated_score) > 0
        ? parseFloat(evalRec.calibrated_score)
        : (emp.calibratedScore && parseFloat(emp.calibratedScore) > 0 ? parseFloat(emp.calibratedScore) : recommendedScore);

    const initScoreDisplay = document.getElementById('calib-modal-initial-score');
    if (initScoreDisplay) {
        initScoreDisplay.textContent = `${supScore.toFixed(2)} / 5.0`;
    }

    const scoreSlider = document.getElementById('calib-score-slider');
    if (scoreSlider) {
        scoreSlider.value = existingCalib.toFixed(2);
    }

    const tierSelect = document.getElementById('calib-tier-select');
    if (tierSelect) {
        tierSelect.value = evalRec?.tier_label || (existingCalib >= 4.5 ? 'Master Tier' : (existingCalib >= 3.5 ? 'Advanced Tier' : 'Proficient'));
    }

    const minutesInput = document.getElementById('calib-discussion-minutes');
    if (minutesInput && evalRec?.discussion_minutes) {
        minutesInput.value = evalRec.discussion_minutes;
    }

    onCalibrationScoreInput(existingCalib, false);
    openModal('modal-1on1-calibration');
}
window.openCalibrationModal = openCalibrationModal;
window.open1on1CalibrationModal = function(empId) {
    closeModal('modal-view-calibration');
    closeModal('modal-1on1-minutes-viewer');
    openCalibrationModal(empId);
};

function applyRecommendedRating() {
    const recommended = typeof window.currentRecommendedScore === 'number' ? window.currentRecommendedScore : 4.50;
    const scoreSlider = document.getElementById('calib-score-slider');
    if (scoreSlider) {
        scoreSlider.value = recommended.toFixed(2);
        onCalibrationScoreInput(recommended.toFixed(2), true);
        if (typeof showToast === 'function') {
            showToast(`Applied recommended rating: ⭐ ${recommended.toFixed(2)} / 5.0`, 'info');
        }
    }
}
window.applyRecommendedRating = applyRecommendedRating;

function onCalibrationTierChange(tierVal) {
    const scoreSlider = document.getElementById('calib-score-slider');
    if (!scoreSlider) return;

    if (tierVal === 'Master Tier' && parseFloat(scoreSlider.value) < 4.5) {
        scoreSlider.value = '4.75';
    } else if (tierVal === 'Advanced Tier' && (parseFloat(scoreSlider.value) < 3.5 || parseFloat(scoreSlider.value) >= 4.5)) {
        scoreSlider.value = '4.00';
    } else if (tierVal === 'Proficient' && (parseFloat(scoreSlider.value) < 3.0 || parseFloat(scoreSlider.value) >= 3.5)) {
        scoreSlider.value = '3.25';
    } else if (tierVal === 'Developing (Needs PIP)' && parseFloat(scoreSlider.value) >= 3.0) {
        scoreSlider.value = '2.70';
    }

    onCalibrationScoreInput(scoreSlider.value, false);
}
window.onCalibrationTierChange = onCalibrationTierChange;

function onCalibrationScoreInput(val, syncSelect = true) {
    const score = parseFloat(val) || 4.0;
    const isBelow3 = score < 3.0;
    const tier = score >= 4.5 ? 'Master Tier' : (score >= 3.5 ? 'Advanced Tier' : (score >= 3.0 ? 'Proficient' : 'Developing (Needs PIP)'));

    const displayEl = document.getElementById('calib-computed-score-display');
    if (displayEl) {
        displayEl.textContent = `${score.toFixed(2)} / 5.0 (${tier})`;
        if (isBelow3) {
            displayEl.className = 'font-mono font-bold text-sm text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200';
        } else {
            displayEl.className = 'font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200';
        }
    }

    if (syncSelect) {
        const tierSelect = document.getElementById('calib-tier-select');
        if (tierSelect) {
            if (score >= 4.5) tierSelect.value = 'Master Tier';
            else if (score >= 3.5) tierSelect.value = 'Advanced Tier';
            else if (score >= 3.0) tierSelect.value = 'Proficient';
            else tierSelect.value = 'Developing (Needs PIP)';
        }
    }
}
window.onCalibrationScoreInput = onCalibrationScoreInput;

async function handleCalibrationSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const empId = document.getElementById('calib-target-emp-id')?.value || 'emp-101';
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));

    const scoreSlider = document.getElementById('calib-score-slider');
    const calibratedScore = scoreSlider ? parseFloat(scoreSlider.value) : 4.55;
    const tierSelect = document.getElementById('calib-tier-select');
    const tierLabel = tierSelect ? tierSelect.value : (calibratedScore >= 4.5 ? 'Master Tier' : 'Advanced Tier');
    const discussionMinutes = document.getElementById('calib-discussion-minutes')?.value.trim() || '1-on-1 review session completed.';

    showActionConfirmModal({
        title: 'Confirm 1-on-1 Calibration',
        message: `Lock calibrated score of ⭐ ${calibratedScore.toFixed(2)} / 5.0 (${tierLabel}) for ${emp ? emp.name : 'Employee'}?`,
        confirmBtnText: 'Lock Calibration',
        confirmBtnClass: 'btn-primary bg-indigo-600 hover:bg-indigo-700 text-white',
        iconClass: 'fas fa-sliders',
        iconContainerClass: 'bg-indigo-100 text-indigo-700',
        onConfirm: async () => {
            const submitBtn = document.getElementById('btn-submit-calibration');
            const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Saving Calibration...</span>';
            }

            try {
                const empGoals = (window.dbGoals || []).filter(g => g.status === 'Approved' && isSameEmployee(g.employee_id, empId));
                const needsTraining = empGoals.some(g => !!g.needs_training);
                const inTrainingScored = isEmployeeInTraining(empId) && isEmployeeTrainingScored(empId);
                const isRetry = needsTraining || inTrainingScored;

                if (inTrainingScored) {
                    try {
                        await PerformanceAPI.setNeedsTraining({ employee_id: empId, needs_training: false, retry_count: 3 });
                    } catch (err) {
                        console.warn('Set retry_count error in calibration:', err);
                    }
                }

                const targetGoal = empGoals[0];
                const goalId = targetGoal ? targetGoal.id : null;

                const saved = await PerformanceAPI.calibrateEvaluation({
                    employee_id: empId,
                    goal_id: goalId ? (!isNaN(parseInt(goalId, 10)) ? parseInt(goalId, 10) : null) : undefined,
                    calibrated_score: calibratedScore,
                    new_calibrated_score: isRetry ? calibratedScore : undefined,
                    is_retry: isRetry,
                    tier_label: tierLabel,
                    discussion_minutes: discussionMinutes
                });

                // Update local memory and cache
                if (emp) {
                    emp.reviewStatus = 'Calibrated';
                    emp.calibratedScore = calibratedScore;
                    if (isRetry) {
                        emp.newCalibratedScore = calibratedScore;
                    }
                    emp.tierLabel = tierLabel;
                    emp.evaluationRecord = saved;
                }

                // Update dbEvaluations array
                updateDbEvaluationRecord(saved);

                // Update final_rating on dbGoals array and invalidate competency goals cache
                if (Array.isArray(window.dbGoals)) {
                    window.dbGoals.forEach(g => {
                        if (isSameEmployee(g.employee_id, empId)) {
                            g.final_rating = calibratedScore;
                        }
                    });
                }
                try {
                    sessionStorage.removeItem(`comp_goals_cache_${empId}`);
                    if (window.dynamicCompetencyState?.cache) {
                        delete window.dynamicCompetencyState.cache[`comp_goals_cache_${empId}`];
                    }
                } catch (e) {}

                if (typeof showToast === 'function') {
                    showToast(`🎉 1-on-1 Calibration successfully recorded and locked for ${emp ? emp.name : 'Employee'}! (${calibratedScore.toFixed(2)} / 5.0)`, 'success');
                }

                // Sync Performance Calibration score directly with Competency Management Radar
                if (typeof window.syncCompetencyWithPerformance === 'function') {
                    window.syncCompetencyWithPerformance(empId);
                }

                closeModal('modal-1on1-calibration');
                renderReviewRosterTable();
                showCalibrationDetail(empId);
                renderIDPRosterTable();
                renderCycleRosterTable();
                updateAllPerfStepperBadges();

                if (typeof loadLiveNotifications === 'function') {
                    loadLiveNotifications(window.activePersonaRole || 'Supervisor');
                }
            } catch (err) {
                console.error('Calibration submission error:', err);
                if (typeof showToast === 'function') {
                    showToast(err.message || 'Failed to save calibration.', 'error');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origBtnHtml;
                }
            }
        }
    });
}
window.handleCalibrationSubmit = handleCalibrationSubmit;

function openPIPModal(empId) {
    const emp = (window.perfRoster || []).find(e => e.id === empId) || (window.perfRoster || [])[0];
    if (!emp) return;

    const evalRec = getDbEvaluations().find(ev => ev.employee_id === emp.id || (emp.id === 'emp-101' && (ev.employee_id === 'emp-1' || ev.employee_id === 'OXF-EMP-1001')) || (emp.id === 'emp-102' && (ev.employee_id === 'emp-2' || ev.employee_id === 'OXF-SUP-2001')));

    const targetInput = document.getElementById('pip-target-emp-id');
    const titleEl = document.getElementById('pip-modal-title');
    const deficienciesEl = document.getElementById('pip-deficiencies');
    const milestonesEl = document.getElementById('pip-milestones');

    if (targetInput) targetInput.value = emp.id;
    if (titleEl) titleEl.textContent = `Performance Improvement Plan (PIP): ${emp.name}`;

    // Extract any specific gaps from DB criteria
    const criteriaGaps = (evalRec?.criteria_scores || []).filter(c => c.rating < 3.0);
    if (deficienciesEl) {
        if (criteriaGaps.length > 0) {
            deficienciesEl.value = criteriaGaps.map(g => `${g.title} (Observed Score: ${g.rating}/5.0 - ${g.rationale || 'Gap below standard'})`).join('\n');
        } else {
            deficienciesEl.value = `Overall appraisal score (${evalRec?.supervisor_rating || '2.80'} / 5.0) is below the hotel 3.0 minimum proficiency standard. Specific focus needed on shift operational consistency.`;
        }
    }

    if (milestonesEl) {
        milestonesEl.value = `1. Complete assigned remedial LMS handbook certifications.\n2. Bi-weekly coaching reviews with assigned mentor.\n3. Achieve >= 90% benchmark compliance over next 60 days.`;
    }

    openModal('modal-pip-action');
}
window.openPIPModal = openPIPModal;

async function handlePIPSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const empId = document.getElementById('pip-target-emp-id')?.value || 'emp-101';
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, empId));
    const deficiencies = document.getElementById('pip-deficiencies')?.value.trim() || 'Remediation plan initiated.';
    const milestones = document.getElementById('pip-milestones')?.value.trim() || 'Complete remedial requirements.';

    const submitBtn = document.getElementById('btn-submit-pip');
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i><span>Saving PIP...</span>';
    }

    try {
        await PerformanceAPI.initiatePIP({
            employee_id: empId,
            deficiencies: deficiencies,
            milestones: milestones
        });

        if (emp) {
            emp.hasPIP = true;
            emp.pipStatus = 'Active PIP';
        }

        if (typeof showToast === 'function') {
            showToast(`📋 Formal PIP successfully initiated for ${emp ? emp.name : 'Employee'}!`, 'success');
        }

        closeModal('modal-pip-action');
        renderReviewRosterTable();
        showCalibrationDetail(empId);
        renderIDPRosterTable();

        if (typeof loadLiveNotifications === 'function') {
            loadLiveNotifications(window.activePersonaRole || 'Supervisor');
        }
    } catch (err) {
        console.error('PIP submission error:', err);
        if (typeof showToast === 'function') {
            showToast(err.message || 'Failed to submit PIP.', 'error');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
        }
    }
}
window.handlePIPSubmit = handlePIPSubmit;

function proceedFromPhase5ToPhase6(empId) {
    const targetEmpId = empId || window.selectedCalibEmpId || window.selectedEvalEmpId || (window.perfRoster && window.perfRoster[0] ? window.perfRoster[0].id : 'emp-101');
    const emp = (window.perfRoster || []).find(e => isSameEmployee(e.id, targetEmpId)) || (window.perfRoster || [])[0];

    if (typeof closeModal === 'function') {
        closeModal('modal-view-calibration');
        closeModal('modal-1on1-calibration');
    }

    if (typeof switchSubTab === 'function') {
        switchSubTab('perf', 'idp');
    }

    if (emp) {
        const searchInput = document.getElementById('search-idp-emp');
        if (searchInput) {
            searchInput.value = emp.name;
        }
        window.idpSearchQuery = emp.name;
        if (typeof idpCurrentPage !== 'undefined') idpCurrentPage = 1;

        if (typeof renderIDPRosterTable === 'function') {
            renderIDPRosterTable();
        }
        if (typeof showIDPDetail === 'function') {
            showIDPDetail(emp.id, true);
        }
    }
}
window.proceedFromPhase5ToPhase6 = proceedFromPhase5ToPhase6;
