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

    // Chart 2: Doughnut (Sentiment)
    const ctxSentiment = document.getElementById('chart-sentiment-doughnut');
    if (ctxSentiment && !chartSentimentDoughnutInstance) {
        chartSentimentDoughnutInstance = new Chart(ctxSentiment, {
            type: 'doughnut',
            data: {
                labels: ['Smooth (68.5%)', 'Manageable (23%)', 'Friction (8.5%)'],
                datasets: [{
                    data: [68.5, 23.0, 8.5],
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
        chartSystemDeptProgressInstance = new Chart(ctxDeptProgress, {
            type: 'bar',
            data: {
                labels: ['Front Office', 'F&B Service', 'Culinary', 'Banquets', 'Housekeeping'],
                datasets: [
                    {
                        label: 'Goals Approved (%)',
                        data: [96.2, 95.0, 94.0, 93.0, 90.5],
                        backgroundColor: '#7A9A7E',
                        borderRadius: 4
                    },
                    {
                        label: 'LMS Completion (%)',
                        data: [98.0, 96.5, 92.0, 94.0, 91.0],
                        backgroundColor: '#9E1B20',
                        borderRadius: 4
                    },
                    {
                        label: 'Succession Ready (%)',
                        data: [85.0, 80.0, 78.0, 76.0, 72.5],
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
                        min: 60,
                        max: 100,
                        grid: { color: '#F1E9E7' },
                        ticks: { font: { size: 10, family: 'Inter' } }
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
}

/**
 * Update XP Received & Rewards Trajectory strictly from xp_ledger database records
 */
async function updateXpTrajectoryFromLedger(employeeId) {
    const ctxPerf = document.getElementById('chart-performance-trend');
    if (!ctxPerf) return;

    const empId = employeeId || window.currentUser?.id || (window.activePersonaRole === 'Supervisor' ? 'emp-102' : 'emp-101');
    const loadingOverlay = document.getElementById('xp-trajectory-loading');
    const emptyOverlay = document.getElementById('xp-trajectory-empty');
    const xpBadge = document.getElementById('xp-trajectory-badge');

    const xpKpiLoading = document.getElementById('kpi-xp-loading');

    // Display Loading State
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    if (xpKpiLoading) xpKpiLoading.classList.remove('hidden');
    if (emptyOverlay) emptyOverlay.classList.add('hidden');
    if (xpBadge) xpBadge.textContent = 'Loading...';

    try {
        const res = await fetch(`api/social.php?action=get_ledger&employeeId=${encodeURIComponent(empId)}`);
        const json = await res.json();
        const ledger = (json && Array.isArray(json.data)) ? json.data : (Array.isArray(json) ? json : []);

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
        ledger.forEach(item => {
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

        if (totalLedgerPoints === 0 || ledger.length === 0) {
            // No database records found for this employee
            if (emptyOverlay) emptyOverlay.classList.remove('hidden');
            if (xpBadge) xpBadge.textContent = '0 XP';
        } else {
            // Real database records exist
            if (emptyOverlay) emptyOverlay.classList.add('hidden');
            if (xpBadge) xpBadge.textContent = `${totalLedgerPoints.toLocaleString()} XP`;
        }

        // Update Gamified XP KPI Card in Dashboard Overview
        updateGamifiedXpKpiCard(totalLedgerPoints);

        if (chartPerfTrendInstance) {
            chartPerfTrendInstance.data.labels = labels;
            chartPerfTrendInstance.data.datasets[0].data = monthlyData;
            chartPerfTrendInstance.update();
        }
    } catch (err) {
        console.warn('Could not query database xp_ledger for chart:', err);
        if (emptyOverlay) emptyOverlay.classList.remove('hidden');
        if (xpBadge) xpBadge.textContent = '0 XP';
        updateGamifiedXpKpiCard(0);
    } finally {
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
        if (xpKpiLoading) xpKpiLoading.classList.add('hidden');
    }
}

function updateGamifiedXpKpiCard(totalPoints) {
    const kpiLvl = document.getElementById('kpi-xp-level-badge');
    const kpiVal = document.getElementById('kpi-xp-val');
    const kpiTitle = document.getElementById('kpi-xp-title');
    const kpiBar = document.getElementById('kpi-xp-bar');
    const kpiSub = document.getElementById('kpi-xp-subtitle');

    let level = 1;
    let title = 'Novice Associate';
    let nextTier = 'Bronze Tier';
    let tierMax = 250;
    let tierMin = 0;

    if (totalPoints >= 1000) {
        level = 5;
        title = 'Gold Master Champion';
        nextTier = 'Diamond Tier';
        tierMin = 1000;
        tierMax = 2500;
    } else if (totalPoints >= 750) {
        level = 4;
        title = 'Senior Specialist';
        nextTier = 'Gold Tier';
        tierMin = 750;
        tierMax = 1000;
    } else if (totalPoints >= 500) {
        level = 3;
        title = 'Silver Professional';
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
    const barWidth = Math.min(100, Math.max(0, Math.round((xpInLevel / levelSpan) * 100)));
    const xpToNext = Math.max(0, tierMax - totalPoints);

    if (kpiLvl) kpiLvl.textContent = `Level ${level}`;
    if (kpiVal) kpiVal.innerHTML = `${totalPoints.toLocaleString()} <span class="text-xs font-normal text-slate-400">XP</span>`;
    if (kpiTitle) kpiTitle.textContent = title;
    if (kpiBar) kpiBar.style.width = `${barWidth}%`;
    if (kpiSub) kpiSub.textContent = totalPoints === 0 ? '250 XP to Bronze Tier' : `${xpToNext} XP to ${nextTier}`;
}
window.updateGamifiedXpKpiCard = updateGamifiedXpKpiCard;
window.updateXpTrajectoryFromLedger = updateXpTrajectoryFromLedger;

window.addEventListener('DOMContentLoaded', () => {
    initAllCharts();
    if (typeof renderLmsBooks === 'function') renderLmsBooks();
    if (typeof renderTnaEnrollments === 'function') renderTnaEnrollments();
});
