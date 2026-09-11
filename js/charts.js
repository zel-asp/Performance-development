// Global Chart Instances
var chartPerfTrendInstance = null;
var chartSentimentDoughnutInstance = null;
var chartCompetencyRadarInstance = null;
var chartLmsComplianceInstance = null;
var chartHourlySentimentInstance = null;
var chartSystemDeptProgressInstance = null;

function initAllCharts() {
    // Chart 1: Line Chart (XP Points Received & Gamification Trend) - Sourced purely from database
    const ctxPerf = document.getElementById('chart-performance-trend');
    if (ctxPerf && !chartPerfTrendInstance) {
        chartPerfTrendInstance = new Chart(ctxPerf, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'XP Received',
                        data: [],
                        borderColor: '#C89B3C',
                        backgroundColor: 'rgba(200, 155, 60, 0.12)',
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#C89B3C',
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { 
                        position: 'top', 
                        labels: { boxWidth: 10, font: { size: 10, family: 'Inter' } } 
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.dataset.label}: ${context.parsed.y} XP`;
                            }
                        }
                    }
                },
                scales: {
                    y: { 
                        min: 0,
                        grid: { color: '#F1E9E7' }, 
                        ticks: { 
                            font: { size: 10, family: 'Inter' },
                            callback: function(value) { return value + ' XP'; }
                        } 
                    },
                    x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' } } }
                }
            }
        });
    }

    // Chart 2: Doughnut (Sentiment) - Pure Dynamic from Supabase shift_sentiments
    const ctxSentiment = document.getElementById('chart-sentiment-doughnut');
    if (ctxSentiment) {
        updateShiftClimatePulseFromSupabase(window.shiftSentimentsState || null);
    }

    // Chart 3: Radar (Competency Matrix)
    const ctxRadar = document.getElementById('chart-competency-radar');
    if (ctxRadar && !chartCompetencyRadarInstance) {
        chartCompetencyRadarInstance = new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: ['Guest Relations', 'PMS Systems', 'De-escalation', 'Leadership', 'HACCP Safety', 'Revenue Upsell'],
                datasets: [
                    {
                        label: 'Current Level',
                        data: [4.8, 5.0, 3.5, 3.2, 4.5, 4.6],
                        backgroundColor: 'rgba(158, 27, 32, 0.15)',
                        borderColor: '#9E1B20',
                        borderWidth: 2,
                        pointBackgroundColor: '#9E1B20'
                    },
                    {
                        label: 'Supervisor Target',
                        data: [5.0, 4.8, 5.0, 4.5, 4.8, 4.8],
                        backgroundColor: 'rgba(107, 143, 163, 0.12)',
                        borderColor: '#6B8FA3',
                        borderWidth: 1.5,
                        borderDash: [4, 4],
                        pointBackgroundColor: '#6B8FA3'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: { min: 0, max: 5, ticks: { display: false }, pointLabels: { font: { size: 10, family: 'Inter' } } }
                },
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 10, family: 'Inter' } } } }
            }
        });
    }

    // Chart 4: Compliance Bar
    const ctxCompliance = document.getElementById('chart-lms-compliance');
    if (ctxCompliance) {
        const existing = typeof Chart !== 'undefined' ? Chart.getChart(ctxCompliance) : null;
        if (existing) existing.destroy();
        chartLmsComplianceInstance = new Chart(ctxCompliance, {
            type: 'bar',
            data: {
                labels: ['Front Office', 'F&B Service', 'Culinary', 'Housekeeping', 'Banquets'],
                datasets: [{
                    data: [98, 95, 100, 92, 96],
                    backgroundColor: ['#9E1B20', '#C89B3C', '#7A9A7E', '#6B8FA3', '#C47762'],
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { min: 80, max: 100, grid: { color: '#F1E9E7' }, ticks: { font: { size: 10, family: 'Inter' } } },
                    y: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' } } }
                }
            }
        });
    }

    // Chart 5: Multi-Line (Hourly Sentiment - Pure Dynamic from Supabase shift_sentiments)
    const ctxHourly = document.getElementById('chart-hourly-sentiment');
    if (ctxHourly && !chartHourlySentimentInstance) {
        if (typeof updateHourlySentimentChart === 'function') {
            updateHourlySentimentChart(window.shiftSentimentsState || []);
        } else {
            chartHourlySentimentInstance = new Chart(ctxHourly, {
                type: 'line',
                data: {
                    labels: ['06:00', '08:00 (Breakfast)', '10:00', '12:00 (Lunch)', '15:00 (Check-in Rush)', '18:00 (Dinner Rush)', '21:00', '23:00 (Night Audit)'],
                    datasets: [
                        {
                            label: 'Positive Climate (%)',
                            data: [0, 0, 0, 0, 0, 0, 0, 0],
                            borderColor: '#7A9A7E',
                            backgroundColor: 'rgba(122, 154, 126, 0.12)',
                            fill: true,
                            tension: 0.35
                        },
                        {
                            label: 'Friction / Stress Peak (%)',
                            data: [0, 0, 0, 0, 0, 0, 0, 0],
                            borderColor: '#C47762',
                            backgroundColor: 'rgba(196, 119, 98, 0.08)',
                            fill: true,
                            tension: 0.35
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, family: 'Inter' } } } },
                    scales: {
                        y: { min: 0, max: 100, grid: { color: '#F1E9E7' }, ticks: { font: { size: 10, family: 'Inter' } } },
                        x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' } } }
                    }
                }
            });
        }
    }

    // Chart 6: System Dept Multi-Metric Progress Bar Chart
    const ctxDeptProgress = document.getElementById('chart-system-dept-progress');
    if (ctxDeptProgress && !chartSystemDeptProgressInstance) {
        let initLabels = ['Front Office', 'Food & Beverage', 'Kitchen & Culinary', 'Banquet & Events', 'Housekeeping'];
        let initGoals = [0, 0, 0, 0, 0];
        let initLms = [0, 0, 0, 0, 0];
        let initSucc = [0, 0, 0, 0, 0];

        if (Array.isArray(window.initialDeptMatrixData) && window.initialDeptMatrixData.length > 0) {
            initLabels = window.initialDeptMatrixData.map(r => r.department || '');
            initGoals = window.initialDeptMatrixData.map(r => parseFloat(r.goals_approved_pct || 0));
            initLms = window.initialDeptMatrixData.map(r => parseFloat(r.lms_rate_pct || 0));
            initSucc = window.initialDeptMatrixData.map(r => parseFloat(r.succession_ready_pct || 0));
        }

        chartSystemDeptProgressInstance = new Chart(ctxDeptProgress, {
            type: 'bar',
            data: {
                labels: initLabels,
                datasets: [
                    {
                        label: 'Goals Approved (%)',
                        data: initGoals,
                        backgroundColor: '#7A9A7E',
                        borderRadius: 4
                    },
                    {
                        label: 'LMS Completion (%)',
                        data: initLms,
                        backgroundColor: '#9E1B20',
                        borderRadius: 4
                    },
                    {
                        label: 'Succession Ready (%)',
                        data: initSucc,
                        backgroundColor: '#6B8FA3',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 10, font: { size: 10, family: 'Inter' } }
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: { color: '#F1E9E7' },
                        ticks: {
                            font: { size: 10, family: 'Inter' },
                            callback: function(val) { return val + '%'; }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10, family: 'Inter' } }
                    }
                }
            }
        });
    }

    // Populate XP Trajectory chart from xp_ledger
    updateXpTrajectoryFromLedger();

    // Populate Department Execution Matrix from live Supabase data
    fetchAndRenderDepartmentExecutionMatrix();
}

window._cachedXpLedger = window._cachedXpLedger || {};

function renderXpTrajectoryAndKpi(ledger, empId) {
    const emptyOverlay = document.getElementById('xp-trajectory-empty');
    const xpBadge = document.getElementById('xp-trajectory-badge');

    // Calculate last 6 months buckets
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
            label: monthNames[d.getMonth()],
            points: 0
        });
    }

    // Aggregate points strictly from database xp_ledger rows
    let totalLedgerPoints = 0;
    (ledger || []).forEach(item => {
        const rawDate = item.raw_date || item.created_at;
        const pts = Number(item.amount || item.points || 0);
        totalLedgerPoints += pts;

        if (rawDate) {
            const itemDate = new Date(rawDate);
            const itemKey = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`;
            const mBucket = months.find(m => m.key === itemKey);
            if (mBucket) {
                mBucket.points += pts;
            }
        }
    });

    const labels = months.map(m => m.label);
    const monthlyData = months.map(m => m.points);

    if (totalLedgerPoints === 0 || !ledger || ledger.length === 0) {
        if (emptyOverlay) emptyOverlay.classList.remove('hidden');
        if (xpBadge) xpBadge.textContent = '0 XP';
    } else {
        if (emptyOverlay) emptyOverlay.classList.add('hidden');
        if (xpBadge) xpBadge.textContent = `${totalLedgerPoints.toLocaleString()} XP`;
    }

    // Save cached total XP for instant 0ms pre-hydration
    try {
        localStorage.setItem(`oxford_cached_total_xp_${empId}`, totalLedgerPoints);
    } catch (e) {}

    // Update Gamified XP KPI Card in Dashboard Overview
    updateGamifiedXpKpiCard(totalLedgerPoints);

    if (chartPerfTrendInstance) {
        chartPerfTrendInstance.data.labels = labels;
        chartPerfTrendInstance.data.datasets[0].data = monthlyData;
        chartPerfTrendInstance.update();
    }
}

/**
 * Update XP Received & Rewards Trajectory strictly from xp_ledger database records with 0ms Cache Support
 */
async function updateXpTrajectoryFromLedger(employeeId, forceRefresh = false) {
    const ctxPerf = document.getElementById('chart-performance-trend');
    if (!ctxPerf) return;

    const activeUser = (typeof getActiveSessionUser === 'function') ? getActiveSessionUser() : null;
    const empId = employeeId || activeUser?.id || window.currentUser?.id || (window.activePersonaRole === 'Supervisor' ? 'emp-102' : 'emp-101');
    const loadingOverlay = document.getElementById('xp-trajectory-loading');
    const emptyOverlay = document.getElementById('xp-trajectory-empty');
    const xpBadge = document.getElementById('xp-trajectory-badge');
    const xpKpiLoading = document.getElementById('kpi-xp-loading');
    const cacheKey = `xp_ledger_cache_${empId}`;

    // 1. Instant 0ms render from memory or sessionStorage cache
    let hasRenderedFromCache = false;
    if (!forceRefresh) {
        if (window._cachedXpLedger && window._cachedXpLedger[empId]) {
            renderXpTrajectoryAndKpi(window._cachedXpLedger[empId], empId);
            hasRenderedFromCache = true;
        } else {
            try {
                const stored = sessionStorage.getItem(cacheKey);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    window._cachedXpLedger[empId] = parsed;
                    renderXpTrajectoryAndKpi(parsed, empId);
                    hasRenderedFromCache = true;
                }
            } catch (e) {}
        }
    }

    if (!hasRenderedFromCache) {
        // If we have cached total XP, render that immediately
        try {
            const cachedXp = localStorage.getItem(`oxford_cached_total_xp_${empId}`);
            if (cachedXp !== null) {
                updateGamifiedXpKpiCard(parseInt(cachedXp, 10) || 0);
            }
        } catch(e) {}

        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
        if (xpKpiLoading) xpKpiLoading.classList.remove('hidden');
        if (emptyOverlay) emptyOverlay.classList.add('hidden');
        if (xpBadge) xpBadge.textContent = 'Loading...';
    }

    try {
        const res = await fetch(`api/social.php?action=get_ledger&employeeId=${encodeURIComponent(empId)}`);
        const json = await res.json();
        const ledger = (json && Array.isArray(json.data)) ? json.data : (Array.isArray(json) ? json : []);

        // Update memory & session cache
        window._cachedXpLedger[empId] = ledger;
        try {
            sessionStorage.setItem(cacheKey, JSON.stringify(ledger));
        } catch (e) {}

        renderXpTrajectoryAndKpi(ledger, empId);
    } catch (err) {
        console.warn('Could not query database xp_ledger for chart:', err);
        if (!hasRenderedFromCache) {
            if (emptyOverlay) emptyOverlay.classList.remove('hidden');
            if (xpBadge) xpBadge.textContent = '0 XP';
            updateGamifiedXpKpiCard(0);
        }
    } finally {
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
        if (xpKpiLoading) xpKpiLoading.classList.add('hidden');
    }
}

function updateGamifiedXpKpiCard(totalPoints) {
    if (typeof window.syncOverviewGamifiedXP === 'function') {
        window.syncOverviewGamifiedXP(totalPoints);
        return;
    }

    const kpiLvl = document.getElementById('kpi-xp-level-badge');
    const kpiVal = document.getElementById('kpi-xp-val');
    const kpiTitle = document.getElementById('kpi-xp-title');
    const kpiBar = document.getElementById('kpi-xp-bar');
    const kpiSub = document.getElementById('kpi-xp-subtitle');

    let level = 1;
    let title = 'Associate';
    let nextTier = 'Bronze Tier';
    let tierMax = 250;
    let tierMin = 0;

    if (totalPoints >= 2500) {
        level = 8;
        title = 'Oxford Ambassador';
        nextTier = 'Max Rank';
        tierMin = 2500;
        tierMax = 5000;
    } else if (totalPoints >= 2000) {
        level = 7;
        title = 'Diamond Master';
        nextTier = 'Fellow Tier';
        tierMin = 2000;
        tierMax = 2500;
    } else if (totalPoints >= 1500) {
        level = 6;
        title = 'Platinum Lead';
        nextTier = 'Diamond Tier';
        tierMin = 1500;
        tierMax = 2000;
    } else if (totalPoints >= 1000) {
        level = 5;
        title = 'Gold Ambassador';
        nextTier = 'Platinum Tier';
        tierMin = 1000;
        tierMax = 1500;
    } else if (totalPoints >= 750) {
        level = 4;
        title = 'Senior Specialist';
        nextTier = 'Gold Tier';
        tierMin = 750;
        tierMax = 1000;
    } else if (totalPoints >= 500) {
        level = 3;
        title = 'Silver Specialist';
        nextTier = 'Senior Tier';
        tierMin = 500;
        tierMax = 750;
    } else if (totalPoints >= 250) {
        level = 2;
        title = 'Bronze Host';
        nextTier = 'Silver Tier';
        tierMin = 250;
        tierMax = 500;
    }

    const xpInLevel = totalPoints - tierMin;
    const levelSpan = tierMax - tierMin;
    const barWidth = Math.min(100, Math.max(5, Math.round((xpInLevel / levelSpan) * 100)));
    const xpToNext = Math.max(0, tierMax - totalPoints);

    if (kpiLvl) kpiLvl.textContent = `Level ${level}`;
    if (kpiVal) kpiVal.innerHTML = `${totalPoints.toLocaleString()} <span class="text-xs font-normal text-slate-400">XP</span>`;
    if (kpiTitle) kpiTitle.textContent = title;
    if (kpiBar) kpiBar.style.width = `${barWidth}%`;
    if (kpiSub) kpiSub.textContent = xpToNext > 0 ? `${xpToNext.toLocaleString()} XP to ${nextTier}` : 'Max Prestige Rank reached';
}
window.updateGamifiedXpKpiCard = updateGamifiedXpKpiCard;
window.updateXpTrajectoryFromLedger = updateXpTrajectoryFromLedger;

/**
 * Dynamic Shift Climate Pulse Doughnut & Metrics from Supabase shift_sentiments
 */
async function updateShiftClimatePulseFromSupabase(sentimentsInput) {
    const ctxSentiment = document.getElementById('chart-sentiment-doughnut');
    const emptyState = document.getElementById('chart-sentiment-empty-state');
    const smoothEl = document.getElementById('pulse-smooth-pct');
    const manageableEl = document.getElementById('pulse-manageable-pct');
    const frictionEl = document.getElementById('pulse-friction-pct');
    const subtitleEl = document.getElementById('pulse-total-staff-subtitle');

    let list = sentimentsInput;
    if (!Array.isArray(list)) {
        if (window.shiftSentimentsState && Array.isArray(window.shiftSentimentsState) && window.shiftSentimentsState.length > 0) {
            list = window.shiftSentimentsState;
        } else {
            try {
                const res = await fetch('api/social.php?action=get_sentiments');
                const json = await res.json();
                if (json && Array.isArray(json.data)) {
                    list = json.data;
                    window.shiftSentimentsState = list;
                }
            } catch (e) {
                console.warn('Could not fetch shift sentiments:', e);
                list = [];
            }
        }
    }

    if (!Array.isArray(list) || list.length === 0) {
        // EMPTY STATE
        if (emptyState) emptyState.classList.remove('hidden');
        if (ctxSentiment) ctxSentiment.classList.add('opacity-0');
        if (smoothEl) smoothEl.textContent = '0.0%';
        if (manageableEl) manageableEl.textContent = '0.0%';
        if (frictionEl) frictionEl.textContent = '0.0%';
        if (subtitleEl) subtitleEl.textContent = 'Aggregated Employee Sentiment (0 Records in Supabase)';

        if (chartSentimentDoughnutInstance) {
            chartSentimentDoughnutInstance.data.datasets[0].data = [0, 0, 0];
            chartSentimentDoughnutInstance.update();
        }
        return;
    }

    // HAS DATA
    if (emptyState) emptyState.classList.add('hidden');
    if (ctxSentiment) ctxSentiment.classList.remove('opacity-0');

    const total = list.length;
    let smoothCount = 0;
    let manageableCount = 0;
    let frictionCount = 0;

    list.forEach(item => {
        const score = Number(item.sentiment_score ?? item.sentimentScore ?? 4);
        const type = String(item.sentiment_type ?? item.sentimentType ?? '').toLowerCase();
        if (score >= 4 || type.includes('pos') || type.includes('smooth')) {
            smoothCount++;
        } else if (score === 3 || type.includes('neu') || type.includes('manageable')) {
            manageableCount++;
        } else {
            frictionCount++;
        }
    });

    const smoothPct = ((smoothCount / total) * 100).toFixed(1);
    const manageablePct = ((manageableCount / total) * 100).toFixed(1);
    const frictionPct = ((frictionCount / total) * 100).toFixed(1);

    if (smoothEl) smoothEl.textContent = `${smoothPct}%`;
    if (manageableEl) manageableEl.textContent = `${manageablePct}%`;
    if (frictionEl) frictionEl.textContent = `${frictionPct}%`;
    if (subtitleEl) subtitleEl.textContent = `Aggregated Employee Sentiment (${total} Live Supabase Pulse${total === 1 ? '' : 's'})`;

    const chartData = [parseFloat(smoothPct), parseFloat(manageablePct), parseFloat(frictionPct)];
    const chartLabels = [`Smooth (${smoothPct}%)`, `Manageable (${manageablePct}%)`, `Friction (${frictionPct}%)`];

    if (ctxSentiment && typeof Chart !== 'undefined') {
        if (!chartSentimentDoughnutInstance) {
            chartSentimentDoughnutInstance = new Chart(ctxSentiment, {
                type: 'doughnut',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        data: chartData,
                        backgroundColor: ['#7A9A7E', '#6B8FA3', '#C47762'],
                        borderWidth: 2,
                        borderColor: '#FFFFFF'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    cutout: '72%'
                }
            });
        } else {
            chartSentimentDoughnutInstance.data.labels = chartLabels;
            chartSentimentDoughnutInstance.data.datasets[0].data = chartData;
            chartSentimentDoughnutInstance.update();
        }
    }
}
window.updateShiftClimatePulseFromSupabase = updateShiftClimatePulseFromSupabase;

/**
 * Department Execution Matrix - Live Supabase Data Engine & Dynamic Chart Renderer
 */
window._cachedDeptMatrix = window._cachedDeptMatrix || null;

function renderDepartmentExecutionMatrix(matrixData) {
    if (!Array.isArray(matrixData) || matrixData.length === 0) return;

    const tbody = document.getElementById('table-dept-execution-matrix-body');
    const labels = [];
    const goalsData = [];
    const lmsData = [];
    const succData = [];

    let tableHtml = '';

    matrixData.forEach(row => {
        const dept = row.department || 'Department';
        const staff = row.staff_count ?? 0;
        const goalsPct = parseFloat(row.goals_approved_pct ?? 0);
        const lmsPct = parseFloat(row.lms_rate_pct ?? 0);
        const succPct = parseFloat(row.succession_ready_pct ?? 0);
        const status = row.status || 'Pending';
        const badgeClass = row.badge_class || 'bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full';

        labels.push(dept);
        goalsData.push(goalsPct);
        lmsData.push(lmsPct);
        succData.push(succPct);

        const goalsColor = goalsPct > 0 ? 'text-sage-dark font-bold' : 'text-slate-400 font-medium';
        const lmsColor = lmsPct > 0 ? 'text-primary font-bold' : 'text-slate-400 font-medium';
        const succColor = succPct > 0 ? 'text-dusty-dark font-bold' : 'text-slate-400 font-medium';

        tableHtml += `
            <tr class="hover:bg-slate-50/50 transition-colors">
                <td class="py-2.5 font-bold text-slate-800">${escapeMatrixText(dept)}</td>
                <td class="py-2.5 text-center text-slate-500 font-medium">${staff}</td>
                <td class="py-2.5 text-center ${goalsColor}">${goalsPct.toFixed(1)}%</td>
                <td class="py-2.5 text-center ${lmsColor}">${lmsPct.toFixed(1)}%</td>
                <td class="py-2.5 text-center ${succColor}">${succPct.toFixed(1)}%</td>
                <td class="py-2.5 text-right"><span class="${badgeClass}">${escapeMatrixText(status)}</span></td>
            </tr>
        `;
    });

    if (tbody) {
        tbody.innerHTML = tableHtml;
    }

    // Update Chart
    if (chartSystemDeptProgressInstance) {
        chartSystemDeptProgressInstance.data.labels = labels;
        chartSystemDeptProgressInstance.data.datasets[0].data = goalsData;
        chartSystemDeptProgressInstance.data.datasets[1].data = lmsData;
        chartSystemDeptProgressInstance.data.datasets[2].data = succData;
        chartSystemDeptProgressInstance.update();
    }
}

function escapeMatrixText(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

let _deptMatrixFetchInProgress = false;
async function fetchAndRenderDepartmentExecutionMatrix(forceRefresh = false) {
    const overlay = document.getElementById('dept-matrix-loading-overlay');
    const badge = document.getElementById('dept-matrix-realtime-badge');

    // 1. Instant 0ms cache rendering from memory or sessionStorage
    let hasRenderedCache = false;
    if (!forceRefresh) {
        if (window._cachedDeptMatrix && Array.isArray(window._cachedDeptMatrix)) {
            renderDepartmentExecutionMatrix(window._cachedDeptMatrix);
            hasRenderedCache = true;
        } else {
            try {
                const stored = sessionStorage.getItem('dept_matrix_cache');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        window._cachedDeptMatrix = parsed;
                        renderDepartmentExecutionMatrix(parsed);
                        hasRenderedCache = true;
                    }
                }
            } catch (e) {}
        }
    }

    if (_deptMatrixFetchInProgress) return;
    _deptMatrixFetchInProgress = true;

    // Show loading overlay only if no cache is shown
    if (!hasRenderedCache && overlay) {
        overlay.classList.remove('hidden');
    }

    try {
        const cacheBuster = forceRefresh ? `&_t=${Date.now()}` : '';
        const res = await fetch(`api/reports.php?action=get_dept_execution_matrix${cacheBuster}`);
        const json = await res.json();

        if (json && json.success && Array.isArray(json.matrix)) {
            window._cachedDeptMatrix = json.matrix;
            try {
                sessionStorage.setItem('dept_matrix_cache', JSON.stringify(json.matrix));
            } catch (e) {}

            renderDepartmentExecutionMatrix(json.matrix);

            // Update top system KPI cards if KPI payload is present
            if (json.kpis) {
                updateOverviewSystemKpis(json.kpis);
            }

            // Subtle Realtime pulse animation on live badge
            if (badge) {
                badge.classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-100');
                setTimeout(() => {
                    badge.classList.remove('ring-2', 'ring-emerald-400', 'bg-emerald-100');
                }, 1000);
            }
        }
    } catch (err) {
        console.warn('[Department Execution Matrix] Error querying api/reports.php, attempting direct Supabase fallback:', err);
        // Direct client-side fallback via fetchSupabase if API is unreachable
        if (typeof fetchSupabase === 'function') {
            try {
                const [depts, emps, goals, lms, succ] = await Promise.all([
                    fetchSupabase('departments?select=id,name').catch(() => []),
                    fetchSupabase('employees?select=id,full_name,department_id,title,status').catch(() => []),
                    fetchSupabase('performance_goals?select=id,employee_id,department,status,weight').catch(() => []),
                    fetchSupabase('lms_prescribed?select=id,employee,status,progress').catch(() => []),
                    fetchSupabase('succession_candidates?select=*').catch(() => [])
                ]);

                if (Array.isArray(depts) && depts.length > 0) {
                    const matrix = computeClientDeptMatrix(depts, emps, goals, lms, succ);
                    window._cachedDeptMatrix = matrix;
                    renderDepartmentExecutionMatrix(matrix);
                }
            } catch (fallbackErr) {
                console.warn('[Department Execution Matrix] Fallback failed:', fallbackErr);
            }
        }
    } finally {
        _deptMatrixFetchInProgress = false;
        if (overlay) overlay.classList.add('hidden');
    }
}

function computeClientDeptMatrix(allDepts, allEmps, allGoals, allLms, allSucc) {
    const canonical = ['Front Office', 'Food & Beverage', 'Kitchen & Culinary', 'Banquet & Events', 'Housekeeping'];
    const deptIdMap = {};
    (allDepts || []).forEach(d => { if (d.id && d.name) deptIdMap[d.id] = d.name; });

    const norm = (str) => {
        const s = (str || '').toLowerCase();
        if (s.includes('front')) return 'Front Office';
        if (s.includes('culinary') || s.includes('kitchen') || s.includes('chef')) return 'Kitchen & Culinary';
        if (s.includes('food') || s.includes('beverage') || s.includes('f&b') || s.includes('dining')) return 'Food & Beverage';
        if (s.includes('banquet') || s.includes('event')) return 'Banquet & Events';
        if (s.includes('housekeep')) return 'Housekeeping';
        return 'Front Office';
    };

    const buckets = {};
    canonical.forEach(c => {
        buckets[c] = { department: c, staff_count: 0, goals_total: 0, goals_approved: 0, lms_total: 0, lms_progress_sum: 0, succ_candidates: 0, succ_ready: 0 };
    });

    const empDeptMap = {};
    (allEmps || []).forEach(emp => {
        let d = emp.department_id ? deptIdMap[emp.department_id] : null;
        if (!d) d = norm((emp.title || '') + ' ' + (emp.full_name || ''));
        else d = norm(d);
        empDeptMap[emp.id] = d;
        if (buckets[d]) buckets[d].staff_count++;
    });

    (allGoals || []).forEach(g => {
        let d = g.department ? norm(g.department) : (empDeptMap[g.employee_id] || 'Front Office');
        if (!buckets[d]) d = 'Front Office';
        buckets[d].goals_total++;
        const st = (g.status || '').toLowerCase();
        if (['approved', 'done', 'completed', 'active', 'endorsed', 'calibrated'].includes(st)) {
            buckets[d].goals_approved++;
        }
    });

    (allLms || []).forEach(l => {
        let d = empDeptMap[l.employee] || 'Front Office';
        if (!buckets[d]) d = 'Front Office';
        buckets[d].lms_total++;
        const prog = parseFloat(l.progress || 0);
        buckets[d].lms_progress_sum += prog;
    });

    (allSucc || []).forEach(s => {
        let d = s.pos_dept ? norm(s.pos_dept) : (empDeptMap[s.employee_id] || 'Front Office');
        if (!buckets[d]) d = 'Front Office';
        buckets[d].succ_candidates++;
        const fl = (s.hr_readiness_flag || '').toLowerCase();
        if (fl.includes('ready now') || fl.includes('ready in')) {
            buckets[d].succ_ready++;
        }
    });

    return canonical.map(c => {
        const b = buckets[c];
        const goalsPct = b.goals_total > 0 ? parseFloat(((b.goals_approved / b.goals_total) * 100).toFixed(1)) : 0;
        const lmsPct = b.lms_total > 0 ? parseFloat((b.lms_progress_sum / b.lms_total).toFixed(1)) : 0;
        const succPct = b.succ_candidates > 0 ? parseFloat(((b.succ_ready / b.succ_candidates) * 100).toFixed(1)) : 0;
        const comp = parseFloat(((goalsPct * 0.35) + (lmsPct * 0.35) + (succPct * 0.30)).toFixed(1));

        let status = 'Pending';
        let badgeClass = 'bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full';
        if (comp >= 80) { status = 'Optimal'; badgeClass = 'badge-sage'; }
        else if (comp >= 50) { status = 'Good'; badgeClass = 'badge-dusty'; }
        else if (comp > 0 || b.staff_count > 0) { status = 'Developing'; badgeClass = 'badge-terracotta'; }

        return {
            department: c,
            staff_count: b.staff_count,
            goals_approved_pct: goalsPct,
            lms_rate_pct: lmsPct,
            succession_ready_pct: succPct,
            composite_score: comp,
            status,
            badge_class: badgeClass
        };
    });
}

function updateOverviewSystemKpis(kpis) {
    if (!kpis) return;

    // 1. Goal Approval Rate
    if (kpis.goals) {
        const gRate = parseFloat(kpis.goals.rate_pct || 0);
        const gTotal = parseInt(kpis.goals.total || 0, 10);
        const gApproved = parseInt(kpis.goals.approved || 0, 10);
        const gReview = parseInt(kpis.goals.review || 0, 10);
        const gRevise = parseInt(kpis.goals.revise || 0, 10);

        const ratioEl = document.getElementById('sys-kpi-goals-ratio');
        if (ratioEl) ratioEl.innerHTML = `${gApproved} <span class="text-sm font-normal text-slate-400">/ ${gTotal}</span>`;

        const badgeEl = document.getElementById('sys-kpi-goals-rate-badge');
        if (badgeEl) {
            badgeEl.textContent = `${gRate.toFixed(1)}% Approved`;
            badgeEl.className = gRate >= 80 ? 'badge-sage' : (gRate > 0 ? 'badge-dusty' : 'bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full');
        }

        const barEl = document.getElementById('sys-kpi-goals-bar');
        if (barEl) barEl.style.width = `${Math.min(100, Math.max(0, gRate))}%`;

        const subEl = document.getElementById('sys-kpi-goals-subtext');
        if (subEl) subEl.textContent = gTotal > 0 ? 'Live Database' : 'No Goals Set';

        const breakEl = document.getElementById('sys-kpi-goals-breakdown');
        if (breakEl) {
            breakEl.innerHTML = `
                <span>${gApproved} Approved</span>
                <span class="text-gold-dark font-medium">${gReview} In Review</span>
                <span class="text-slate-400">${gRevise} Revise</span>
            `;
        }
    }

    // 2. Active Staff Count
    if (typeof kpis.staff_count !== 'undefined') {
        const staffEl = document.getElementById('sys-kpi-property-xp-staff');
        if (staffEl) staffEl.textContent = `${kpis.staff_count} Staff`;
    }

    // 3. LMS Course Completion
    if (kpis.lms) {
        const lRate = parseFloat(kpis.lms.rate_pct || 0);
        const lTotal = parseInt(kpis.lms.total || 0, 10);
        const lPassed = parseInt(kpis.lms.passed || 0, 10);
        const lAvg = parseFloat(kpis.lms.avg_score || 0);

        const valEl = document.getElementById('sys-kpi-lms-rate-val');
        if (valEl) valEl.textContent = `${lRate.toFixed(1)}%`;

        const badgeEl = document.getElementById('sys-kpi-lms-rate-badge');
        if (badgeEl) {
            badgeEl.textContent = `${lRate.toFixed(1)}% Rate`;
            badgeEl.className = lRate >= 80 ? 'badge-primary' : (lRate > 0 ? 'badge-dusty' : 'bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full');
        }

        const barEl = document.getElementById('sys-kpi-lms-bar');
        if (barEl) barEl.style.width = `${Math.min(100, Math.max(0, lRate))}%`;

        const targetEl = document.getElementById('sys-kpi-lms-target');
        if (targetEl) targetEl.textContent = lTotal > 0 ? 'Target: 80.0%' : 'No Courses';

        const breakEl = document.getElementById('sys-kpi-lms-breakdown');
        if (breakEl) {
            breakEl.innerHTML = `
                <span>${lPassed} / ${lTotal} Modules</span>
                <span class="text-sage-dark font-medium">${lAvg.toFixed(1)}% Avg Score</span>
            `;
        }
    }

    // 4. Succession Bench Depth
    if (kpis.succession) {
        const sRate = parseFloat(kpis.succession.rate_pct || 0);
        const sTotal = parseInt(kpis.succession.total || 0, 10);
        const sCovered = parseInt(kpis.succession.covered || 0, 10);
        const sFastTrack = parseInt(kpis.succession.fast_track || 0, 10);

        const valEl = document.getElementById('sys-kpi-succession-val');
        if (valEl) valEl.textContent = `${sRate.toFixed(1)}%`;

        let riskLabel = 'Pipeline Empty';
        let riskClass = 'text-slate-400';
        let badgeClass = 'bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full';

        if (sRate >= 75) {
            riskLabel = 'Low Risk';
            riskClass = 'text-sage-dark';
            badgeClass = 'badge-dusty';
        } else if (sRate >= 50) {
            riskLabel = 'Moderate Risk';
            riskClass = 'text-gold-dark';
            badgeClass = 'badge-gold';
        } else if (sRate > 0) {
            riskLabel = 'Elevated Risk';
            riskClass = 'text-rose-600';
            badgeClass = 'badge-terracotta';
        }

        const badgeEl = document.getElementById('sys-kpi-succession-badge');
        if (badgeEl) {
            badgeEl.textContent = `${sRate.toFixed(1)}% Ready`;
            badgeEl.className = badgeClass;
        }

        const riskEl = document.getElementById('sys-kpi-succession-risk');
        if (riskEl) {
            riskEl.textContent = riskLabel;
            riskEl.className = `text-xs ${riskClass} font-semibold`;
        }

        const barEl = document.getElementById('sys-kpi-succession-bar');
        if (barEl) barEl.style.width = `${Math.min(100, Math.max(0, sRate))}%`;

        const rolesEl = document.getElementById('sys-kpi-succession-roles');
        if (rolesEl) rolesEl.textContent = `${sCovered} / ${Math.max(1, sTotal)} Key Roles Covered`;

        const ftEl = document.getElementById('sys-kpi-succession-fasttrack');
        if (ftEl) ftEl.textContent = `${sFastTrack} In Fast-Track`;
    }
}

window.renderDepartmentExecutionMatrix = renderDepartmentExecutionMatrix;
window.fetchAndRenderDepartmentExecutionMatrix = fetchAndRenderDepartmentExecutionMatrix;
window.updateOverviewSystemKpis = updateOverviewSystemKpis;

window.addEventListener('DOMContentLoaded', () => {
    const deferInit = window.requestIdleCallback 
        ? (fn) => window.requestIdleCallback(fn, { timeout: 800 }) 
        : (fn) => setTimeout(fn, 50);

    deferInit(() => {
        initAllCharts();
        if (typeof fetchAndRenderDepartmentExecutionMatrix === 'function') {
            fetchAndRenderDepartmentExecutionMatrix();
        }
    });
});
