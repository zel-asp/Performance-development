// Global Chart Instances
var chartPerfTrendInstance = null;
var chartSentimentDoughnutInstance = null;
var chartCompetencyRadarInstance = null;
var chartLmsComplianceInstance = null;
var chartHourlySentimentInstance = null;
var chartSystemDeptProgressInstance = null;

function initAllCharts() {
    // Chart 1: Line Chart (Performance Trend)
    const ctxPerf = document.getElementById('chart-performance-trend');
    if (ctxPerf && !chartPerfTrendInstance) {
        chartPerfTrendInstance = new Chart(ctxPerf, {
            type: 'line',
            data: {
                labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [
                    {
                        label: 'Performance Score (%)',
                        data: [82, 84, 85, 87, 88.5, 89.4],
                        borderColor: '#9E1B20',
                        backgroundColor: 'rgba(158, 27, 32, 0.06)',
                        borderWidth: 2.5,
                        fill: true,
                        tension: 0.35,
                        pointBackgroundColor: '#9E1B20',
                        pointRadius: 3.5
                    },
                    {
                        label: 'Hotel Target (85%)',
                        data: [85, 85, 85, 85, 85, 85],
                        borderColor: '#CBD5E1',
                        borderWidth: 1.5,
                        borderDash: [4, 4],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, family: 'Inter' } } } },
                scales: {
                    y: { min: 70, max: 100, grid: { color: '#F1E9E7' }, ticks: { font: { size: 10, family: 'Inter' } } },
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

    // Chart 5: Multi-Line (Hourly Sentiment)
    const ctxHourly = document.getElementById('chart-hourly-sentiment');
    if (ctxHourly && !chartHourlySentimentInstance) {
        chartHourlySentimentInstance = new Chart(ctxHourly, {
            type: 'line',
            data: {
                labels: ['06:00', '08:00 (Breakfast)', '10:00', '12:00 (Lunch)', '15:00 (Check-in)', '18:00 (Dinner)', '21:00', '23:00'],
                datasets: [
                    {
                        label: 'Positive Climate (%)',
                        data: [88, 72, 85, 69, 64, 76, 82, 89],
                        borderColor: '#7A9A7E',
                        backgroundColor: 'rgba(122, 154, 126, 0.08)',
                        fill: true,
                        tension: 0.35
                    },
                    {
                        label: 'Friction / Stress Peak (%)',
                        data: [6, 18, 8, 22, 28, 16, 10, 5],
                        borderColor: '#C47762',
                        backgroundColor: 'rgba(196, 119, 98, 0.05)',
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
}

window.addEventListener('DOMContentLoaded', () => {
    initAllCharts();
    if (typeof renderLmsBooks === 'function') renderLmsBooks();
    if (typeof renderTnaEnrollments === 'function') renderTnaEnrollments();
});
