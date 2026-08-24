/**
 * Oxford Suites, Makati - Activity & Notification Center Engine
 * 
 * Scope:
 * 1. Operational Alerts Inbox (Critical compliance, pending approvals, milestones)
 * 2. Immutable System Audit Log (Chronological event stream across all 7 modules)
 * 3. Gemini AI Shift Risk & Sentiment Diagnostic Alerts
 * 4. User Notification Delivery Preferences & Dynamic Counter Sync
 */

// =========================================================================
// 1. STATE STORES
// =========================================================================

let alertsState = [
    {
        id: 'alt-101',
        title: 'HACCP Level 3 Food Safety Recertification Due',
        category: 'compliance',
        priority: 'critical', // 'critical', 'action', 'info'
        dept: 'Culinary',
        icon: 'fa-triangle-exclamation',
        color: 'rose',
        timestamp: '15 mins ago',
        date: 'Aug 24, 2026',
        message: '3 Kitchen Leads have Food Safety certification expiring in 14 days. Enforce enrollment in the upcoming HACCP refresher cohort.',
        actionLabel: 'View Training &rarr;',
        actionTarget: 'pillar-training',
        actionSubTab: 'programs',
        isRead: false
    },
    {
        id: 'alt-102',
        title: 'Gemini Shift Risk: Peak Dinner Rush Sentiment Drop',
        category: 'sentiment_ai',
        priority: 'critical',
        dept: 'Front Office',
        icon: 'fa-robot',
        color: 'terracotta',
        timestamp: '42 mins ago',
        date: 'Aug 24, 2026',
        message: 'Gemini detected a 16.5% sentiment dip between 19:00 - 20:30 due to long check-in queue backlog. Floor supervisor dispatch recommended.',
        actionLabel: 'View Shift Climate &rarr;',
        actionTarget: 'pillar-social',
        actionSubTab: 'climate',
        isRead: false
    },
    {
        id: 'alt-103',
        title: '1-on-1 Calibration Approval Pending: Maria Santos',
        category: 'performance',
        priority: 'action',
        dept: 'Front Office',
        icon: 'fa-user-clock',
        color: 'amber',
        timestamp: '2 hours ago',
        date: 'Aug 24, 2026',
        message: 'Q3 formal review for Maria Santos has been submitted by Supervisor Marco Rossi. Awaiting HR Director digital signature.',
        actionLabel: 'Sign-off Appraisal &rarr;',
        actionTarget: 'pillar-perf',
        actionSubTab: 'review',
        isRead: false
    },
    {
        id: 'alt-104',
        title: 'Post-Training Knowledge Evaluation Pending',
        category: 'training',
        priority: 'action',
        dept: 'Front Office',
        icon: 'fa-chalkboard-user',
        color: 'primary',
        timestamp: '4 hours ago',
        date: 'Aug 24, 2026',
        message: 'Maria Santos completed attendance for "Frontline Conflict & Crisis Diplomacy". Post-training quiz is ready for grading.',
        actionLabel: 'Open Evaluation &rarr;',
        actionTarget: 'pillar-training',
        actionSubTab: 'evaluation',
        isRead: false
    },
    {
        id: 'alt-105',
        title: 'Milestone Honor: Maria Santos Unlocked "Diplomacy Lead"',
        category: 'gamification',
        priority: 'info',
        dept: 'Front Office',
        icon: 'fa-award',
        color: 'gold',
        timestamp: 'Yesterday at 18:30',
        date: 'Aug 23, 2026',
        message: 'Maria earned 5 verified peer recognitions for exceptional guest de-escalation. Deterministic badge added to public profile (+150 XP).',
        actionLabel: 'View Recognition &rarr;',
        actionTarget: 'pillar-social',
        actionSubTab: 'kudos',
        isRead: true
    },
    {
        id: 'alt-106',
        title: 'Succession Bench Updated: Front Office Asst Manager',
        category: 'succession',
        priority: 'info',
        dept: 'Front Office',
        icon: 'fa-sitemap',
        color: 'sage',
        timestamp: '2 days ago',
        date: 'Aug 22, 2026',
        message: 'Maria Santos calculated readiness score reached 94%. HR status officially set to "Ready Now" (0–6 months horizon).',
        actionLabel: 'View Bench Matrix &rarr;',
        actionTarget: 'pillar-succession',
        actionSubTab: 'records',
        isRead: true
    }
];

let auditLogsState = [
    {
        id: 'LOG-9401',
        timestamp: 'Aug 24, 2026 · 19:42:10',
        module: 'Social Recognition',
        action: 'SUPERVISOR_COMMENDATION_GRANTED',
        actor: 'Elena Vance (HR Director)',
        target: 'Maria Santos (Front Desk Host)',
        details: 'Commendation awarded for crisis diplomacy during diplomat delegation arrival (+100 XP granted).',
        status: 'SUCCESS',
        ip: '192.168.1.45 (HR Terminal)'
    },
    {
        id: 'LOG-9400',
        timestamp: 'Aug 24, 2026 · 17:15:33',
        module: 'Succession Planning',
        action: 'HR_READINESS_FLAG_UPDATED',
        actor: 'Elena Vance (HR Director)',
        target: 'Maria Santos × FO Assistant Manager',
        details: 'Manual flag updated to "Ready Now" based on 94% computed capability match.',
        status: 'SUCCESS',
        ip: '192.168.1.45 (HR Terminal)'
    },
    {
        id: 'LOG-9399',
        timestamp: 'Aug 24, 2026 · 15:30:00',
        module: 'Training Management',
        action: 'CERTIFICATE_GENERATED_AND_ISSUED',
        actor: 'System Automation',
        target: 'Maria Santos (Score: 96%)',
        details: 'Certificate Reference OXF-CERT-2026-0889 issued. De-escalation competency elevated to 4.8 Master (+150 XP).',
        status: 'SUCCESS',
        ip: 'Internal System Worker'
    },
    {
        id: 'LOG-9398',
        timestamp: 'Aug 24, 2026 · 14:00:22',
        module: 'Performance Management',
        action: '1_ON_1_CALIBRATION_ENDORSED',
        actor: 'Marco Rossi (Supervisor)',
        target: 'Maria Santos (Appraisal Q3)',
        details: 'Final calibrated score approved at 4.80 / 5.0 (Exceeds Expectations).',
        status: 'SUCCESS',
        ip: '192.168.1.88 (Culinary / F&B Office)'
    },
    {
        id: 'LOG-9397',
        timestamp: 'Aug 24, 2026 · 11:20:05',
        module: 'Gemini Copilot',
        action: 'GEMINI_SBI_COACHING_GENERATED',
        actor: 'Gemini 1.5 API Engine',
        target: 'Prompt: VIP Check-in Protocol',
        details: 'Generated structured Situation-Behavior-Impact feedback coaching draft for supervisor review.',
        status: 'SUCCESS',
        ip: 'Google Gemini API Endpoint'
    },
    {
        id: 'LOG-9396',
        timestamp: 'Aug 24, 2026 · 08:30:00',
        module: 'Realtime Sentiment',
        action: 'SHIFT_SENTIMENT_PULSE_LOGGED',
        actor: 'Front Office Shift Roster (14 Staff)',
        target: 'Morning Shift Handover',
        details: 'Shift sentiment logged as 71.2% Positive, 21.0% Neutral, 7.8% Stress.',
        status: 'SUCCESS',
        ip: 'Floor Kiosks / Mobile'
    }
];

let activeAlertsFilter = 'all';
let activeAuditModuleFilter = 'all';

// =========================================================================
// 2. INITIALIZATION & RENDERING
// =========================================================================

function initNotificationsHub() {
    renderAlertsKPIs();
    renderAlertsInbox();
    renderAuditLogs();
    updateUnreadBadges();
}

function renderAlertsKPIs() {
    const unreadCount = alertsState.filter(a => !a.isRead).length;
    const criticalCount = alertsState.filter(a => a.priority === 'critical' && !a.isRead).length;
    const actionCount = alertsState.filter(a => a.priority === 'action' && !a.isRead).length;
    const totalLogs = auditLogsState.length;

    const elUnread = document.getElementById('stat-alerts-unread');
    const elCritical = document.getElementById('stat-alerts-critical');
    const elAction = document.getElementById('stat-alerts-action');
    const elLogs = document.getElementById('stat-alerts-logs');

    if (elUnread) elUnread.textContent = unreadCount;
    if (elCritical) elCritical.textContent = criticalCount;
    if (elAction) elAction.textContent = actionCount;
    if (elLogs) elLogs.textContent = `${totalLogs} Events`;
}

function updateUnreadBadges() {
    const unreadCount = alertsState.filter(a => !a.isRead).length;

    // Update sidebar & header notification badges
    const topBellDot = document.getElementById('notif-badge');
    if (topBellDot) {
        if (unreadCount > 0) {
            topBellDot.classList.remove('hidden');
        } else {
            topBellDot.classList.add('hidden');
        }
    }

    const badgeElements = document.querySelectorAll('.nav-alert-badge');
    badgeElements.forEach(badge => {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

// =========================================================================
// 3. TAB 1: OPERATIONAL ALERTS INBOX
// =========================================================================

function setAlertsFilter(filterKey) {
    activeAlertsFilter = filterKey;
    document.querySelectorAll('.alerts-filter-chip').forEach(btn => {
        if (btn.dataset.filter === filterKey) {
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('bg-[#FAF8F7]', 'text-slate-600');
        } else {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-[#FAF8F7]', 'text-slate-600');
        }
    });
    renderAlertsInbox();
}

function renderAlertsInbox() {
    const container = document.getElementById('alerts-inbox-container');
    if (!container) return;

    let filtered = alertsState;
    if (activeAlertsFilter === 'unread') {
        filtered = alertsState.filter(a => !a.isRead);
    } else if (activeAlertsFilter === 'critical') {
        filtered = alertsState.filter(a => a.priority === 'critical');
    } else if (activeAlertsFilter === 'action') {
        filtered = alertsState.filter(a => a.priority === 'action');
    } else if (activeAlertsFilter === 'info') {
        filtered = alertsState.filter(a => a.priority === 'info');
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="card-clean p-10 text-center text-slate-400 space-y-2 border border-[#E8DEDC] bg-white">
                <i class="fas fa-bell-slash text-3xl text-slate-300"></i>
                <p class="font-bold text-slate-700 text-sm">No alerts in this category</p>
                <p class="text-xs text-slate-500">All notifications have been reviewed and acknowledged.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(alert => {
        const priorityBadge = alert.priority === 'critical'
            ? `<span class="badge-terracotta text-[10px] font-bold"><i class="fas fa-circle-exclamation mr-1"></i> Critical</span>`
            : alert.priority === 'action'
            ? `<span class="badge-gold text-[10px] font-bold"><i class="fas fa-clock mr-1"></i> Action Required</span>`
            : `<span class="badge-sage text-[10px] font-bold"><i class="fas fa-info-circle mr-1"></i> Milestone</span>`;

        return `
            <div class="card-clean p-4 sm:p-5 transition hover:shadow-md border border-[#E8DEDC] ${alert.isRead ? 'bg-white opacity-85' : 'bg-primary-50/20 border-primary/30 ring-1 ring-primary/20'} space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div class="flex items-start space-x-3.5">
                        <div class="w-10 h-10 rounded-2xl bg-${alert.color}-500/10 text-${alert.color}-700 border border-${alert.color}-500/20 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                            <i class="fas ${alert.icon}"></i>
                        </div>
                        <div class="space-y-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <h4 class="font-heading font-bold text-sm text-slate-900">${alert.title}</h4>
                                ${priorityBadge}
                                <span class="badge-dusty text-[10px]">${alert.dept}</span>
                            </div>
                            <p class="text-xs text-slate-600 leading-relaxed">${alert.message}</p>
                            <span class="text-[10px] text-slate-400 block">${alert.timestamp} · ${alert.date}</span>
                        </div>
                    </div>

                    <!-- Action Controls -->
                    <div class="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                        ${!alert.isRead ? `
                            <button onclick="markAlertRead('${alert.id}')" class="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center space-x-1" title="Mark as Read">
                                <i class="fas fa-check text-emerald-600 text-[11px]"></i>
                                <span>Acknowledge</span>
                            </button>
                        ` : `
                            <span class="text-[10px] text-slate-400 font-medium px-2 py-1"><i class="fas fa-check-double text-emerald-600 mr-1"></i> Acknowledged</span>
                        `}
                        <button onclick="navigateAlertAction('${alert.actionTarget}', '${alert.actionSubTab}')" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1">
                            <span>${alert.actionLabel}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function markAlertRead(alertId) {
    const alert = alertsState.find(a => a.id === alertId);
    if (!alert) return;

    alert.isRead = true;
    renderAlertsInbox();
    renderAlertsKPIs();
    updateUnreadBadges();
    showToast(`Notification "${alert.title}" acknowledged.`, 'info');
}

function markAllAlertsRead() {
    alertsState.forEach(a => a.isRead = true);
    renderAlertsInbox();
    renderAlertsKPIs();
    updateUnreadBadges();
    showToast('All notifications marked as acknowledged.', 'success');
}

function navigateAlertAction(targetPillar, targetSubTab) {
    if (typeof switchPillar === 'function') {
        switchPillar(targetPillar);
    }
    if (targetSubTab && typeof switchSubTab === 'function') {
        setTimeout(() => {
            const pillarPrefix = targetPillar.replace('pillar-', '');
            switchSubTab(pillarPrefix, targetSubTab);
        }, 100);
    }
}

// =========================================================================
// 4. TAB 2: SYSTEM AUDIT LOG (Chronological Event Stream)
// =========================================================================

function setAuditModuleFilter(moduleKey) {
    activeAuditModuleFilter = moduleKey;
    renderAuditLogs();
}

function renderAuditLogs() {
    const tbody = document.getElementById('audit-logs-tbody');
    if (!tbody) return;

    let filtered = auditLogsState;
    if (activeAuditModuleFilter !== 'all') {
        filtered = auditLogsState.filter(l => l.module.toLowerCase().includes(activeAuditModuleFilter.toLowerCase()));
    }

    tbody.innerHTML = filtered.map(log => `
        <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
            <td class="px-5 py-3 font-mono font-bold text-slate-700">${log.id}</td>
            <td class="px-5 py-3 text-slate-500 whitespace-nowrap">${log.timestamp}</td>
            <td class="px-5 py-3">
                <span class="badge-dusty text-[10px] font-bold">${log.module}</span>
            </td>
            <td class="px-5 py-3 font-bold text-slate-800">${log.action}</td>
            <td class="px-5 py-3 text-slate-700">${log.actor}</td>
            <td class="px-5 py-3 text-slate-600 max-w-xs truncate" title="${log.details}">${log.details}</td>
            <td class="px-5 py-3 text-right">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ${log.status}
                </span>
            </td>
        </tr>
    `).join('');
}

// =========================================================================
// 5. TAB 3: GEMINI AI DIAGNOSTIC ALERTS
// =========================================================================

function triggerGeminiShiftScan() {
    showToast('Gemini 1.5 API analyzing realtime shift sentiment & guest friction logs...', 'info');
    setTimeout(() => {
        showToast('Gemini shift analysis complete: Peak dinner rush friction normalized.', 'success');
    }, 1200);
}

// =========================================================================
// 6. TAB 4: PREFERENCES & SETTINGS
// =========================================================================

function saveNotificationPreferences() {
    showToast('Notification delivery preferences saved successfully!', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
    initNotificationsHub();
});
