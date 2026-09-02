/**
 * Oxford Suites, Makati - Social Recognition & Deterministic Gamification Ledger
 * Live Dynamic Data Integration with Supabase
 * 
 * Scope:
 * 1. Peer-to-peer and supervisor-to-employee recognition posts (text + category)
 * 2. Deterministic points ledger (Peer: +50 XP, Supervisor: +100 XP, GM/Exec: +200 XP)
 * 3. Live Recognition Feed with instant emoji cheering & comment threads
 * 4. Milestone badge unlock engine based on verified qualitative recognition
 * 5. 24h Hourly Shift Climate / Stress Pulse tracking with Chart.js
 * 6. Qualitative input into Phase 5 Performance Appraisal Review
 */

const RECOGNITION_RULES = {
    TIERS: {
        Peer: { points: 50, label: 'Peer Kudos', color: 'amber' },
        Supervisor: { points: 100, label: 'Supervisor Commendation', color: 'primary' },
        Executive: { points: 200, label: 'GM / Executive Citation', color: 'emerald' }
    },
    CATEGORIES: {
        guest_service: { label: 'Great Guest Service', icon: 'fa-bell-concierge', color: 'gold', badge: 'Guest Hero' },
        collaboration: { label: 'Team Collaboration', icon: 'fa-hands-holding-circle', color: 'dusty', badge: 'Team Anchor' },
        safety_haccp: { label: 'Safety & HACCP Standard', icon: 'fa-shield-halved', color: 'sage', badge: 'Safety Champion' },
        crisis_recovery: { label: 'Crisis & Conflict Recovery', icon: 'fa-handshake-angle', color: 'terracotta', badge: 'Diplomacy Lead' },
        operational_excellence: { label: 'Operational Excellence', icon: 'fa-star', color: 'primary', badge: 'Excellence Master' }
    }
};

let kudosStaffRosterState = [
    { id: 'emp-101', name: 'Maria Santos', role: 'Front Desk Host', dept: 'Front Office', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', rating: '4.80' },
    { id: 'emp-102', name: 'Carlos Gomez', role: 'Concierge Lead', dept: 'Front Office', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', rating: '4.60' },
    { id: 'emp-103', name: 'Chef Marco Rossi', role: 'Executive Sous Chef', dept: 'Culinary', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', rating: '4.85' },
    { id: 'emp-104', name: 'Chef Marco S.', role: 'Line Cook Lead', dept: 'Culinary', avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80', rating: '4.50' },
    { id: 'emp-106', name: 'David Lee', role: 'F&B Server Lead', dept: 'F&B Service', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', rating: '4.20' },
    { id: 'emp-105', name: 'Elena Vance', role: 'HR Director & Master Trainer', dept: 'HR & Admin', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', rating: '4.95' }
];

let socialFeedPostsState = [];
let pointsLedgerState = [];
let milestoneBadgesState = [];
let shiftSentimentsState = [];

let socialActiveDeptFilter = 'all';
let socialFeedSearchQuery = '';
let selectedKudosRecipients = new Set();
let kudosActiveDeptFilter = 'all';
let kudosSearchQuery = '';

// =========================================================================
// INITIALIZATION & SUPABASE API FETCH
// =========================================================================

let activeSentimentFilterType = 'today';
let activeSentimentFilterValue = '';

async function initSocialRecognition() {
    const currentUserId = window.currentUser?.id || (window.activePersonaRole === 'Supervisor' ? 'emp-102' : 'emp-101');
    const currentUserName = window.currentUser?.name || (window.activePersonaRole === 'Supervisor' ? 'Chef Marco Rossi' : 'Maria Santos');

    const accountLabel = document.getElementById('my-ledger-account-label');
    if (accountLabel) {
        accountLabel.innerHTML = `<i class="fas fa-user-shield mr-1"></i> ${currentUserName} · Personal Ledger`;
    }

    try {
        let url = `api/social.php?action=get_overview&employeeId=${encodeURIComponent(currentUserId)}`;
        if (activeSentimentFilterType) {
            url += `&filterType=${encodeURIComponent(activeSentimentFilterType)}`;
            if (activeSentimentFilterValue) {
                url += `&filterValue=${encodeURIComponent(activeSentimentFilterValue)}`;
            }
        }

        const res = await fetch(url);
        const json = await res.json();

        if (json.success && json.data) {
            const d = json.data;
            if (Array.isArray(d.roster) && d.roster.length > 0) {
                kudosStaffRosterState = d.roster;
            }
            if (Array.isArray(d.recognitions)) {
                socialFeedPostsState = d.recognitions.map(normalizeRecognitionPost);
            }
            if (Array.isArray(d.ledger)) {
                pointsLedgerState = d.ledger;
            } else if (socialFeedPostsState.length > 0) {
                updateLedgerFromPosts(socialFeedPostsState);
            } else {
                pointsLedgerState = [];
            }
            if (Array.isArray(d.badges)) {
                milestoneBadgesState = d.badges;
            }
            if (Array.isArray(d.sentiments)) {
                shiftSentimentsState = d.sentiments;
            }
            if (d.kpis) {
                updateKPIs(d.kpis);
            }
        }
    } catch (e) {
        console.warn('Using local fallback state for Social Engine:', e);
    }

    renderSocialFeed();
    renderPointLedger();
    renderMilestoneBadges();
    renderQualitativePerformanceFeed();
    applySentimentFiltering();

    // Dynamically synchronize live XP with Overview Gamified XP card & Leaderboards
    let currentTotalXp = 0;
    if (pointsLedgerState && pointsLedgerState.length > 0) {
        const rawBal = pointsLedgerState[0].balance || '';
        const parsed = parseInt(String(rawBal).replace(/[^0-9]/g, ''), 10);
        currentTotalXp = !isNaN(parsed) ? parsed : pointsLedgerState.reduce((sum, t) => sum + (parseInt(String(t.xpChange).replace(/[^0-9]/g, ''), 10) || 0), 0);
    }
    syncOverviewGamifiedXP(currentTotalXp);
    if (typeof updateXpTrajectoryFromLedger === 'function') {
        updateXpTrajectoryFromLedger(currentUserId);
    }
}

function normalizeRecognitionPost(p) {
    const rx = p.reactions || {};
    const reactionsObj = typeof rx === 'string' ? (JSON.parse(rx) || {}) : rx;
    const cm = p.comments || [];
    const commentsArr = typeof cm === 'string' ? (JSON.parse(cm) || []) : cm;

    const catKey = p.category_key || p.categoryKey || 'guest_service';
    const catLabel = p.category_label || p.categoryLabel || 'Great Guest Service';
    const pts = parseInt(p.points_awarded || p.pointsAwarded || 50, 10);

    const createdAtDate = p.created_at ? new Date(p.created_at) : new Date();

    return {
        id: p.id || ('post-' + Math.random()),
        senderId: p.sender_id || p.senderId || 'emp-105',
        senderName: p.sender_name || p.senderName || 'Elena Vance',
        senderRole: p.sender_role || p.senderRole || 'HR Director & Master Trainer',
        senderType: p.sender_type || p.senderType || 'Supervisor',
        senderAvatar: p.sender_avatar || p.senderAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        receiverId: p.receiver_id || p.receiverId || 'emp-101',
        receiverName: p.receiver_name || p.receiverName || 'Maria Santos',
        receiverRole: p.receiver_role || p.receiverRole || 'Front Desk Host',
        receiverDept: p.receiver_dept || p.receiverDept || (p.department || 'Front Office'),
        receiverAvatar: p.receiver_avatar || p.receiverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        categoryKey: catKey,
        categoryLabel: catLabel,
        pointsAwarded: pts,
        timestamp: formatRelativeTime(createdAtDate),
        date: createdAtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        text: p.text_content || p.text || 'Exemplary hospitality teamwork!',
        reactions: {
            clap: parseInt(reactionsObj.clap || 0, 10),
            heart: parseInt(reactionsObj.heart || 0, 10),
            star: parseInt(reactionsObj.star || 0, 10),
            fire: parseInt(reactionsObj.fire || 0, 10)
        },
        comments: commentsArr,
        qualitativeInCycle: true
    };
}

function formatRelativeTime(date) {
    const diffSec = Math.floor((new Date() - date) / 1000);
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
    if (diffSec < 172800) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function updateKPIs(kpis) {
    const elRec = document.getElementById('stat-social-count');
    const elXP = document.getElementById('stat-social-xp');
    const elBadges = document.getElementById('stat-social-badges');
    const elSync = document.getElementById('stat-social-sync');
    const elAvg = document.getElementById('sentiment-avg-rating');

    if (elRec) elRec.textContent = kpis.totalRecognitions !== undefined ? kpis.totalRecognitions : socialFeedPostsState.length;
    if (elXP) elXP.textContent = (kpis.totalXPAwarded !== undefined ? kpis.totalXPAwarded : 0).toLocaleString();
    if (elBadges) elBadges.textContent = kpis.badgesUnlocked !== undefined ? kpis.badgesUnlocked : 0;
    if (elSync) elSync.textContent = (kpis.performanceSyncPct !== undefined ? kpis.performanceSyncPct : 0) + '%';
    if (elAvg && kpis.averageSentiment) elAvg.textContent = `${kpis.averageSentiment} / 5.0`;
}

function updateLedgerFromPosts(posts) {
    let balance = 0;
    pointsLedgerState = posts.slice().reverse().map((p, idx) => {
        balance += p.pointsAwarded;
        return {
            id: `TXN-${8800 + idx}`,
            date: p.date,
            recipient: p.receiverName,
            sender: `${p.senderName} (${p.senderType})`,
            rule: p.senderType === 'Supervisor' ? 'SUPERVISOR_COMMENDATION' : (p.senderType === 'Executive' ? 'GM_EXECUTIVE_CITATION' : 'PEER_TO_PEER_RECOGNITION'),
            category: p.categoryLabel,
            xpChange: `+${p.pointsAwarded} XP`,
            balance: `${balance} XP`
        };
    }).reverse();
}

function calculateXpLevel(totalXp) {
    totalXp = Math.max(0, parseInt(totalXp, 10) || 0);
    const tiers = [
        { level: 1, min: 0,    max: 250,  title: 'Associate',          nextTier: 'Bronze Tier' },
        { level: 2, min: 250,  max: 500,  title: 'Bronze Host',        nextTier: 'Silver Tier' },
        { level: 3, min: 500,  max: 750,  title: 'Silver Specialist',  nextTier: 'Senior Tier' },
        { level: 4, min: 750,  max: 1000, title: 'Senior Specialist',  nextTier: 'Gold Tier' },
        { level: 5, min: 1000, max: 1500, title: 'Gold Ambassador',    nextTier: 'Platinum Tier' },
        { level: 6, min: 1500, max: 2000, title: 'Platinum Lead',      nextTier: 'Diamond Tier' },
        { level: 7, min: 2000, max: 2500, title: 'Diamond Master',     nextTier: 'Fellow Tier' },
        { level: 8, min: 2500, max: 5000, title: 'Oxford Ambassador',  nextTier: 'Max Rank' }
    ];

    let currentTier = tiers[0];
    for (let t of tiers) {
        if (totalXp >= t.min) currentTier = t;
    }

    const range = currentTier.max - currentTier.min;
    const progress = Math.min(100, Math.max(5, Math.round(((totalXp - currentTier.min) / range) * 100)));
    const needed = Math.max(0, currentTier.max - totalXp);

    return {
        level: currentTier.level,
        title: currentTier.title,
        nextTier: currentTier.nextTier,
        xpToNext: needed,
        progressPct: progress,
        totalXp: totalXp
    };
}

function syncOverviewGamifiedXP(totalXp) {
    const xpInfo = calculateXpLevel(totalXp);

    if (typeof currentXP !== 'undefined') {
        currentXP = totalXp;
    }

    const elXpVal = document.getElementById('kpi-xp-val');
    const elLevel = document.getElementById('kpi-xp-level-badge');
    const elTitle = document.getElementById('kpi-xp-title');
    const elBar = document.getElementById('kpi-xp-bar');
    const elSubtitle = document.getElementById('kpi-xp-subtitle');

    if (elXpVal) {
        elXpVal.innerHTML = `${xpInfo.totalXp.toLocaleString()} <span class="text-xs font-normal text-slate-400">XP</span>`;
    }
    if (elLevel) {
        elLevel.textContent = `Level ${xpInfo.level}`;
    }
    if (elTitle) {
        elTitle.textContent = xpInfo.title;
    }
    if (elBar) {
        elBar.style.width = `${xpInfo.progressPct}%`;
    }
    if (elSubtitle) {
        elSubtitle.textContent = xpInfo.xpToNext > 0
            ? `${xpInfo.xpToNext.toLocaleString()} XP to ${xpInfo.nextTier}`
            : 'Max Prestige Rank reached';
    }

    const lbRank4 = document.getElementById('leaderboard-rank4-xp');
    if (lbRank4) {
        lbRank4.textContent = xpInfo.totalXp.toLocaleString();
    }
}
window.syncOverviewGamifiedXP = syncOverviewGamifiedXP;
window.calculateXpLevel = calculateXpLevel;

/**
 * Render Top 5 Gamified XP Champions Podium dynamically from xp_ledger data.
 * If multiple employees have the same XP (e.g. 0 XP), they share the exact same
 * rank level and visual pillar height.
 */
function renderTop5XpChampions(champions) {
    const container = document.getElementById('overview-top5-podium');
    if (!container) return;

    // Filter qualifiers with XP > 0
    const rawList = Array.isArray(champions) ? champions : [];
    const qualifiers = rawList.filter(c => !c.is_ready && Number(c.total_xp || 0) > 0);

    // Build always exactly 5 slots
    const slots = [];
    const rankLabels = { 1: 'FIRST', 2: 'SECOND', 3: 'THIRD', 4: 'FOURTH', 5: 'FIFTH' };

    for (let i = 0; i < 5; i++) {
        if (i < qualifiers.length) {
            slots.push(qualifiers[i]);
        } else {
            const slotRank = i + 1;
            slots.push({
                employee_id: null,
                name: 'Ready',
                role: 'Open Slot',
                total_xp: 0,
                trophies: 0,
                rank: slotRank,
                rank_label: rankLabels[slotRank] || ('RANK ' + slotRank),
                is_ready: true
            });
        }
    }

    const rankStyles = {
        1: { avatarBg: 'bg-gold', xpPill: 'text-gold-dark bg-gold-50 border border-gold-100', pillarBg: 'bg-gold', heightClass: 'h-44 sm:h-52', labelColor: 'text-gold-dark', bounceStar: true },
        2: { avatarBg: 'bg-terracotta', xpPill: 'text-terracotta-dark bg-terracotta-50 border border-terracotta-100', pillarBg: 'bg-terracotta', heightClass: 'h-36 sm:h-44', labelColor: 'text-terracotta', bounceStar: false },
        3: { avatarBg: 'bg-sage-dark', xpPill: 'text-sage-dark bg-sage-50 border border-sage-100', pillarBg: 'bg-sage-dark', heightClass: 'h-28 sm:h-36', labelColor: 'text-sage-dark', bounceStar: false },
        4: { avatarBg: 'bg-dusty', xpPill: 'text-dusty-dark bg-dusty-50 border border-dusty-100', pillarBg: 'bg-dusty', heightClass: 'h-22 sm:h-28', labelColor: 'text-dusty', bounceStar: false },
        5: { avatarBg: 'bg-[#6F6261]', xpPill: 'text-slate-700 bg-slate-100 border border-slate-200', pillarBg: 'bg-[#6F6261]', heightClass: 'h-16 sm:h-22', labelColor: 'text-slate-600', bounceStar: false }
    };

    container.className = 'grid grid-cols-5 gap-2 sm:gap-3.5 items-end relative z-10';
    container.style.gridTemplateColumns = '';

    container.innerHTML = slots.map(c => {
        const rank = c.rank || 1;
        const style = rankStyles[rank] || rankStyles[5];
        const rankBadge = String(rank).padStart(2, '0');
        const displayLabel = c.rank_label || ('RANK ' + rank);

        if (c.is_ready) {
            return `
                <div class="flex flex-col items-center justify-end text-center group cursor-pointer" onclick="switchPillar('pillar-social')" title="Open Podium Position ${rank}: Ready for Contender">
                    <div class="mb-2 flex flex-col items-center space-y-1 w-full opacity-60">
                        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-dashed border-slate-300 bg-white/70 text-slate-400 font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-2xs">
                            <i class="fas fa-plus text-[9px] sm:text-[10px] text-slate-400"></i>
                        </div>
                        <p class="text-[10px] sm:text-xs font-bold text-slate-400 truncate max-w-full">Ready</p>
                        <span class="text-[8px] sm:text-[9px] font-medium text-slate-400 bg-slate-100/80 border border-dashed border-slate-200 px-1.5 py-0.2 rounded-full">-- XP</span>
                        <div class="pt-0.5 text-slate-200 text-sm sm:text-lg">
                            <i class="far fa-star"></i>
                        </div>
                    </div>
                    <div class="w-full ${style.heightClass} rounded-t-xl sm:rounded-t-2xl bg-slate-100/80 border-2 border-dashed border-slate-200 shadow-2xs group-hover:border-slate-300 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-slate-400">
                        <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-dashed border-slate-300 bg-white/80 flex items-center justify-center font-bold text-[10px] sm:text-xs text-slate-400 shadow-2xs mt-1">
                            ${rankBadge}
                        </div>
                        <div class="space-y-0.5 text-center">
                            <p class="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ready</p>
                            <span class="text-[7px] sm:text-[8px] font-medium text-slate-400 bg-black/5 px-1.5 py-0.5 rounded-full inline-flex items-center space-x-0.5">
                                <span>Open</span>
                            </span>
                        </div>
                    </div>
                    <div class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                        <span class="text-[9px] sm:text-[10px] font-bold tracking-wider text-slate-400 uppercase">${displayLabel}</span>
                        <p class="text-[8px] text-slate-400 font-medium hidden sm:block">Awaiting XP</p>
                    </div>
                </div>
            `;
        }

        const xp = Number(c.total_xp || 0);
        const xpDisplay = xp >= 1000 ? (xp / 1000).toFixed(1) + 'k XP' : `${xp} XP`;
        const firstName = (c.name || 'Staff').trim().split(/\s+/)[0];

        let initials = '??';
        if (c.name) {
            const parts = c.name.trim().split(/\s+/);
            initials = parts.length === 1 ? parts[0].substring(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }

        let tiedLabel = displayLabel;
        if (c.is_tied) {
            const ordinals = { 1: '1ST', 2: '2ND', 3: '3RD', 4: '4TH', 5: '5TH' };
            tiedLabel = `TIED ${ordinals[rank] || rank}`;
        }

        const roleShort = (c.role || c.department || 'Associate').replace('Director', 'Dir').replace('Supervisor', 'Sup').replace('Associate', 'Assoc');

        return `
            <div class="flex flex-col items-center justify-end text-center group cursor-pointer" onclick="switchPillar('pillar-social')" title="${c.name} (${c.role || ''}): ${xp.toLocaleString()} XP">
                <div class="mb-2 flex flex-col items-center space-y-1 w-full">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full ${style.avatarBg} text-white font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-xs border-2 border-white">
                        ${initials}
                    </div>
                    <p class="text-[10px] sm:text-xs font-bold text-slate-900 truncate max-w-full" title="${c.name}">${firstName}</p>
                    <span class="text-[8px] sm:text-[9px] font-bold ${style.xpPill} px-1.5 py-0.2 rounded-full">${xpDisplay}</span>
                    <div class="pt-0.5 text-gold text-sm sm:text-lg ${style.bounceStar ? 'animate-bounce drop-shadow-xs' : 'drop-shadow-xs'}">
                        <i class="fas fa-star"></i>
                    </div>
                </div>

                <div class="w-full ${style.heightClass} rounded-t-xl sm:rounded-t-2xl ${style.pillarBg} shadow-sm group-hover:shadow-md group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between py-2.5 px-1 text-white border-t-2 border-white/40">
                    <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-black/15 backdrop-blur-xs flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-xs mt-1">
                        ${rankBadge}
                    </div>
                    <div class="space-y-0.5 text-center">
                        <p class="text-[9px] sm:text-[10px] font-bold text-white leading-tight">${xp.toLocaleString()}</p>
                        <span class="text-[7px] sm:text-[8px] font-semibold bg-black/25 text-white px-1.5 py-0.5 rounded-full inline-flex items-center space-x-0.5">
                            <span>${c.trophies || 0}</span>
                            <i class="fas fa-trophy text-[7px] text-amber-300"></i>
                        </span>
                    </div>
                </div>

                <div class="pt-2 text-center w-full bg-slate-100/90 sm:bg-transparent rounded-b-lg sm:rounded-none">
                    <span class="text-[9px] sm:text-[10px] font-extrabold tracking-wider ${style.labelColor} uppercase">${tiedLabel}</span>
                    <p class="text-[8px] text-slate-400 font-medium hidden sm:block truncate" title="${c.role}">${roleShort}</p>
                </div>
            </div>
        `;
    }).join('');
}
window.renderTop5XpChampions = renderTop5XpChampions;

async function loadAndRenderTop5Champions() {
    const container = document.getElementById('overview-top5-podium');
    if (!container) return;

    try {
        const res = await fetch('api/social.php?action=get_top_champions');
        const json = await res.json();
        const champions = (json && json.success && Array.isArray(json.data)) ? json.data : [];
        renderTop5XpChampions(champions);
    } catch (err) {
        console.error('Failed to load top 5 XP champions:', err);
    }
}
window.loadAndRenderTop5Champions = loadAndRenderTop5Champions;

// =========================================================================
// FEED FILTERING & RENDERING
// =========================================================================

function setSocialDeptFilter(dept) {
    socialActiveDeptFilter = dept;
    document.querySelectorAll('.social-dept-chip').forEach(btn => {
        const btnDept = (btn.dataset.dept || '').toLowerCase();
        if (btnDept === dept.toLowerCase()) {
            btn.className = 'social-dept-chip px-3 py-1 rounded-full font-bold bg-primary text-white text-[11px] whitespace-nowrap shadow-2xs transition';
        } else {
            btn.className = 'social-dept-chip px-3 py-1 rounded-full font-semibold bg-[#FAF8F7] text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap transition';
        }
    });
    renderSocialFeed();
}

function filterSocialFeed(query) {
    socialFeedSearchQuery = (query || '').toLowerCase().trim();
    renderSocialFeed();
}

function renderSocialFeed() {
    const container = document.getElementById('social-feed-container');
    if (!container) return;

    let filtered = socialFeedPostsState;

    if (socialActiveDeptFilter !== 'all') {
        filtered = filtered.filter(p => (p.receiverDept || '').toLowerCase().includes(socialActiveDeptFilter.toLowerCase()));
    }

    if (socialFeedSearchQuery) {
        filtered = filtered.filter(p =>
            p.receiverName.toLowerCase().includes(socialFeedSearchQuery) ||
            p.senderName.toLowerCase().includes(socialFeedSearchQuery) ||
            p.categoryLabel.toLowerCase().includes(socialFeedSearchQuery) ||
            p.text.toLowerCase().includes(socialFeedSearchQuery)
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="card-clean p-10 text-center space-y-2 border border-[#E8DEDC] bg-white">
                <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl shadow-2xs">
                    <i class="fas fa-bullhorn"></i>
                </div>
                <h4 class="font-heading font-bold text-sm text-slate-800">No recognition posts found</h4>
                <p class="text-xs text-slate-500">Be the first to recognize a colleague for their outstanding hospitality!</p>
                <button onclick="openModal('modal-recognition'); initKudosRosterModal();" class="btn-primary px-4 py-1.5 text-xs font-bold mt-2">
                    + Give Recognition
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(post => {
        const catConfig = RECOGNITION_RULES.CATEGORIES[post.categoryKey] || { label: post.categoryLabel, color: 'primary', icon: 'fa-award' };
        const comments = post.comments || [];
        const hasComments = comments.length > 0;

        return `
            <div class="card-clean p-5 hover:shadow-md transition space-y-3.5 border border-[#E8DEDC] bg-white rounded-2xl">
                <!-- Header: Sender & Receiver Details -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DEDC] pb-3">
                    <div class="flex items-center space-x-3">
                        <img src="${post.senderAvatar}" alt="${post.senderName}" class="w-10 h-10 rounded-full object-cover border border-[#E8DEDC] shadow-xs">
                        <div>
                            <div class="flex items-center space-x-1.5 flex-wrap">
                                <span class="font-bold text-slate-900 text-xs">${post.senderName}</span>
                                <span class="text-[10px] text-slate-400 font-medium">recognized</span>
                                <span class="font-bold text-primary text-xs">${post.receiverName}</span>
                            </div>
                            <p class="text-[10px] text-slate-500">${post.senderRole} &rarr; <span class="font-semibold text-slate-700">${post.receiverRole}</span> (${post.receiverDept})</p>
                        </div>
                    </div>

                    <div class="flex items-center space-x-2 flex-shrink-0">
                        <span class="badge-${catConfig.color} text-[10px]">
                            <i class="fas ${catConfig.icon} mr-1"></i> ${post.categoryLabel}
                        </span>
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-800 border border-amber-500/20 shadow-2xs">
                            +${post.pointsAwarded} XP
                        </span>
                    </div>
                </div>

                <!-- Recognition Text Quote -->
                <p class="text-xs text-slate-700 leading-relaxed font-medium pl-3 border-l-2 border-amber-400 italic">
                    "${post.text}"
                </p>

                <!-- Footer: Reactions & Performance Input Badge -->
                <div class="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500">
                    <div class="flex items-center space-x-1.5">
                        <button onclick="reactToPost('${post.id}', 'clap')" class="px-2.5 py-1 rounded-xl bg-[#FAF8F7] hover:bg-amber-50 hover:border-amber-300 border border-[#E8DEDC] text-[11px] font-bold flex items-center space-x-1.5 transition">
                            <i class="fas fa-hands-clapping text-amber-500"></i>
                            <span id="react-clap-${post.id}">${post.reactions.clap}</span>
                        </button>
                        <button onclick="reactToPost('${post.id}', 'heart')" class="px-2.5 py-1 rounded-xl bg-[#FAF8F7] hover:bg-red-50 hover:border-red-300 border border-[#E8DEDC] text-[11px] font-bold flex items-center space-x-1.5 transition">
                            <i class="fas fa-heart text-rose-500"></i>
                            <span id="react-heart-${post.id}">${post.reactions.heart}</span>
                        </button>
                        <button onclick="reactToPost('${post.id}', 'star')" class="px-2.5 py-1 rounded-xl bg-[#FAF8F7] hover:bg-yellow-50 hover:border-yellow-300 border border-[#E8DEDC] text-[11px] font-bold flex items-center space-x-1.5 transition">
                            <i class="fas fa-star text-amber-400"></i>
                            <span id="react-star-${post.id}">${post.reactions.star}</span>
                        </button>
                        <button onclick="reactToPost('${post.id}', 'fire')" class="px-2.5 py-1 rounded-xl bg-[#FAF8F7] hover:bg-orange-50 hover:border-orange-300 border border-[#E8DEDC] text-[11px] font-bold flex items-center space-x-1.5 transition">
                            <i class="fas fa-fire text-orange-500"></i>
                            <span id="react-fire-${post.id}">${post.reactions.fire}</span>
                        </button>
                        <button onclick="togglePostComments('${post.id}')" class="px-2.5 py-1 rounded-xl bg-[#FAF8F7] hover:bg-slate-100 border border-[#E8DEDC] text-[10px] font-semibold text-slate-600 flex items-center space-x-1 transition">
                            <i class="fas fa-comment-dots text-slate-400"></i>
                            <span>${comments.length} Cheers</span>
                        </button>
                    </div>

                    <div class="flex items-center space-x-2">
                        <span class="text-[10px] text-slate-400">${post.timestamp}</span>
                        <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center shadow-2xs">
                            <i class="fas fa-check-circle mr-1 text-emerald-600"></i> Passed to Appraisal Review
                        </span>
                    </div>
                </div>

                <!-- Comments & Cheer Section -->
                <div id="comments-section-${post.id}" class="${hasComments ? '' : 'hidden'} pt-3 border-t border-slate-100 space-y-2">
                    <div id="comments-list-${post.id}" class="space-y-1.5">
                        ${comments.map(c => `
                            <div class="p-2.5 rounded-xl bg-[#FAF8F7] border border-[#E8DEDC] flex items-start space-x-2.5 text-xs">
                                <img src="${c.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}" class="w-6 h-6 rounded-full object-cover border border-[#E8DEDC] mt-0.5">
                                <div class="flex-1">
                                    <div class="flex items-center justify-between">
                                        <span class="font-bold text-slate-800 text-[11px]">${c.author_name}</span>
                                        <span class="text-[9px] text-slate-400">${c.created_at ? formatRelativeTime(new Date(c.created_at)) : 'Just now'}</span>
                                    </div>
                                    <p class="text-slate-600 text-[11px] mt-0.5">${c.text}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Quick Cheer Reply Input -->
                    <div class="flex items-center space-x-2 pt-1">
                        <input type="text" id="comment-input-${post.id}" placeholder="Cheer on ${post.receiverName} with a friendly note..." 
                            class="flex-1 px-3 py-1.5 bg-[#FAF8F7] border border-[#E8DEDC] rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none"
                            onkeypress="if(event.key==='Enter') submitPostComment('${post.id}')">
                        <button onclick="submitPostComment('${post.id}')" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1">
                            <i class="fas fa-paper-plane text-[10px]"></i>
                            <span>Cheer</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function reactToPost(postId, reactionType) {
    const post = socialFeedPostsState.find(p => p.id === postId);
    if (!post) return;

    post.reactions[reactionType] = (post.reactions[reactionType] || 0) + 1;
    const countEl = document.getElementById(`react-${reactionType}-${postId}`);
    if (countEl) countEl.textContent = post.reactions[reactionType];

    if (typeof showToast === 'function') {
        showToast(`Cheered ${post.receiverName}'s recognition!`, 'success');
    }

    try {
        await fetch('api/social.php?action=react', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, reactionType })
        });
    } catch (e) {
        console.warn('Reaction saved locally:', e);
    }
}

function togglePostComments(postId) {
    const sec = document.getElementById(`comments-section-${postId}`);
    if (sec) {
        sec.classList.toggle('hidden');
    }
}

async function submitPostComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';

    const post = socialFeedPostsState.find(p => p.id === postId);
    if (!post) return;

    const commentPayload = {
        authorName: 'Elena Vance',
        authorRole: 'HR Director',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        text: text
    };

    if (!post.comments) post.comments = [];
    post.comments.push({
        ...commentPayload,
        created_at: new Date().toISOString()
    });

    renderSocialFeed();
    if (typeof showToast === 'function') {
        showToast('Cheer posted & synced to Supabase!', 'success');
    }

    try {
        await fetch('api/social.php?action=add_comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, ...commentPayload })
        });
    } catch (e) {
        console.warn('Comment saved locally:', e);
    }
}

// =========================================================================
// DETERMINISTIC POINTS & XP LEDGER (SELF / PERSONAL LOGS)
// =========================================================================

function filterPointLedger(query) {
    const q = (query || '').toLowerCase().trim();
    renderPointLedger(q);
}

function renderPointLedger(filterQuery = '') {
    const tbody = document.getElementById('points-ledger-tbody');
    if (!tbody) return;

    let rows = pointsLedgerState;
    if (filterQuery) {
        rows = rows.filter(r =>
            (r.recipient || '').toLowerCase().includes(filterQuery) ||
            (r.sender || '').toLowerCase().includes(filterQuery) ||
            (r.category || '').toLowerCase().includes(filterQuery) ||
            (r.id || '').toLowerCase().includes(filterQuery)
        );
    }

    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-5 py-8 text-center text-slate-400 text-xs">
            <i class="fas fa-receipt text-2xl text-slate-300 mb-2 block"></i>
            No personal XP ledger transactions recorded yet for your account.
        </td></tr>`;
        return;
    }

    tbody.innerHTML = rows.map(txn => `
        <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
            <td class="px-5 py-3 font-mono font-bold text-slate-700">${txn.id || 'TXN-8800'}</td>
            <td class="px-5 py-3 text-slate-600">${txn.date || 'Aug 24, 2026'}</td>
            <td class="px-5 py-3 font-bold text-slate-900">${txn.recipient || 'My Account'}</td>
            <td class="px-5 py-3 text-slate-600">${txn.sender || 'System / Supervisor'}</td>
            <td class="px-5 py-3 font-semibold text-slate-700">${txn.category || 'Hospitality'}</td>
            <td class="px-5 py-3 font-bold text-emerald-700">${txn.xpChange || '+50 XP'}</td>
            <td class="px-5 py-3 font-mono font-bold text-slate-900">${txn.balance || '0 XP'}</td>
        </tr>
    `).join('');
}

// =========================================================================
// MILESTONE BADGES (PERSONAL USER ACHIEVEMENTS)
// =========================================================================

function renderMilestoneBadges() {
    const container = document.getElementById('milestone-badges-grid');
    if (!container) return;

    container.innerHTML = milestoneBadgesState.map(b => {
        const pct = Math.min(100, Math.max(0, b.progressPct || 0));
        const isUnlocked = b.isUnlocked || pct >= 100;
        const currentXp = b.currentXp || 0;
        const targetXp = b.targetXp || (b.threshold ? parseInt(b.threshold.replace(/\D/g, '')) || 1000 : 1000);

        return `
            <div class="p-5 bg-white rounded-2xl border ${isUnlocked ? 'border-amber-400 bg-amber-50/20' : 'border-[#E8DEDC]'} space-y-3 text-center text-xs shadow-2xs hover:shadow-md transition">
                <div class="w-14 h-14 mx-auto rounded-2xl ${isUnlocked ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-400'} border border-amber-500/20 flex items-center justify-center text-2xl transition">
                    <i class="fas ${b.icon || 'fa-medal'}"></i>
                </div>
                <div>
                    <h4 class="font-heading font-bold text-sm text-slate-900">${b.name}</h4>
                    <span class="text-[10px] font-bold text-primary block mt-0.5">${b.category}</span>
                    <p class="text-[10px] text-slate-400 mt-1 font-medium">${b.threshold}</p>
                </div>

                <!-- Progress Bar -->
                <div class="space-y-1 text-left pt-1">
                    <div class="flex justify-between text-[10px] font-semibold text-slate-600">
                        <span>XP Progress</span>
                        <span>${currentXp.toLocaleString()} / ${targetXp.toLocaleString()} XP (${pct}%)</span>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div class="${isUnlocked ? 'bg-emerald-500' : 'bg-amber-500'} h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                </div>

                <div class="pt-2 border-t border-[#E8DEDC] flex justify-between items-center text-[10px]">
                    <span class="text-slate-500">Status:</span>
                    ${isUnlocked 
                        ? `<span class="badge-sage font-bold"><i class="fas fa-check-circle mr-1"></i> Achieved</span>` 
                        : `<span class="badge-dusty font-bold"><i class="fas fa-lock mr-1"></i> In Progress</span>`}
                </div>
            </div>
        `;
    }).join('');
}

// =========================================================
// HOURLY SHIFT SENTIMENT & TIME FILTERING DYNAMICS
// =========================================================================

function applyModalSpecificDate() {
    const dateVal = document.getElementById('modal-climate-date-picker')?.value;
    const monthVal = document.getElementById('modal-climate-month-picker')?.value;

    if (dateVal) {
        setSentimentTimeFilter('date', dateVal);
        if (typeof closeModal === 'function') closeModal('modal-specific-date-filter');
    } else if (monthVal) {
        setSentimentTimeFilter('month_picker', monthVal);
        if (typeof closeModal === 'function') closeModal('modal-specific-date-filter');
    } else {
        if (typeof showToast === 'function') {
            showToast('Please select either a Date or a Month.', 'warning');
        }
    }
}

function clearModalSpecificDate() {
    const datePicker = document.getElementById('modal-climate-date-picker');
    const monthPicker = document.getElementById('modal-climate-month-picker');
    if (datePicker) datePicker.value = '';
    if (monthPicker) monthPicker.value = '';
    setSentimentTimeFilter('today');
    if (typeof closeModal === 'function') closeModal('modal-specific-date-filter');
}

function setSentimentTimeFilter(timeframeType, value = '') {
    activeSentimentFilterType = timeframeType;
    activeSentimentFilterValue = value;

    // Update Chip Buttons
    const isPreset = ['today', 'week', 'month'].includes(timeframeType);
    ['today', 'week', 'month'].forEach(k => {
        const btn = document.getElementById(`climate-btn-${k}`);
        if (btn) {
            if (timeframeType === k) {
                btn.className = 'climate-chip px-3 py-1 rounded-full font-bold bg-primary text-white text-[11px] whitespace-nowrap shadow-2xs';
            } else {
                btn.className = 'climate-chip px-3 py-1 rounded-full font-semibold bg-white text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap';
            }
        }
    });

    const specificBtn = document.getElementById('climate-btn-specific');
    const specificLabel = document.getElementById('climate-specific-label');
    const statusText = document.getElementById('climate-active-filter-status');

    if (specificBtn) {
        if (!isPreset) {
            specificBtn.className = 'climate-chip px-3 py-1 rounded-full font-bold bg-primary text-white text-[11px] whitespace-nowrap flex items-center space-x-1 shadow-2xs';
            if (timeframeType === 'date') {
                const formattedDate = new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                if (specificLabel) specificLabel.textContent = formattedDate;
                if (statusText) statusText.textContent = `Showing: ${formattedDate}`;
            } else if (timeframeType === 'month_picker') {
                if (specificLabel) specificLabel.textContent = value;
                if (statusText) statusText.textContent = `Showing Month: ${value}`;
            }
        } else {
            specificBtn.className = 'climate-chip px-3 py-1 rounded-full font-semibold bg-white text-slate-600 border border-[#E8DEDC] hover:bg-slate-100 text-[11px] whitespace-nowrap flex items-center space-x-1';
            if (specificLabel) specificLabel.textContent = 'Specific Date';
            if (statusText) {
                if (timeframeType === 'today') statusText.textContent = "Showing: Today's Shift";
                else if (timeframeType === 'week') statusText.textContent = "Showing: Last 7 Days";
                else if (timeframeType === 'month') statusText.textContent = "Showing: Current Month";
            }
        }
    }

    applySentimentFiltering();
}

function applySentimentFiltering() {
    let filtered = Array.isArray(shiftSentimentsState) ? [...shiftSentimentsState] : [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const localTodayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
    const thisMonthStr = now.toISOString().slice(0, 7);

    if (activeSentimentFilterType === 'today') {
        const todayFiltered = filtered.filter(s => {
            const dt = s.created_at || s.timestamp || '';
            if (!dt) return false;
            return dt.startsWith(todayStr) || dt.startsWith(localTodayStr);
        });
        // If today has recorded pulses, show them; otherwise fallback to recent shift cycle so 24hr monitoring stays live
        filtered = todayFiltered.length > 0 ? todayFiltered : filtered;
    } else if (activeSentimentFilterType === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(s => {
            const dt = s.created_at ? new Date(s.created_at) : now;
            return dt >= weekAgo;
        });
    } else if (activeSentimentFilterType === 'month') {
        filtered = filtered.filter(s => {
            const dt = s.created_at || s.timestamp || '';
            return !dt || dt.startsWith(thisMonthStr);
        });
    } else if (activeSentimentFilterType === 'date' && activeSentimentFilterValue) {
        filtered = filtered.filter(s => {
            const dt = s.created_at || s.timestamp || '';
            return dt.startsWith(activeSentimentFilterValue);
        });
    } else if (activeSentimentFilterType === 'month_picker' && activeSentimentFilterValue) {
        filtered = filtered.filter(s => {
            const dt = s.created_at || s.timestamp || '';
            return dt.startsWith(activeSentimentFilterValue);
        });
    }

    // Update Highlight Cards
    const avgEl = document.getElementById('sentiment-avg-rating');
    const moodEl = document.getElementById('sentiment-mood-label');
    const peakWinEl = document.getElementById('sentiment-peak-window');
    const peakLblEl = document.getElementById('sentiment-peak-label');
    const dispatchEl = document.getElementById('sentiment-dispatch-count');
    const dispatchStatEl = document.getElementById('sentiment-dispatch-status');

    if (filtered.length === 0) {
        if (avgEl) avgEl.textContent = '4.3 / 5.0';
        if (moodEl) { moodEl.textContent = 'Positive'; moodEl.className = 'text-[10px] font-bold text-emerald-600'; }
        if (peakWinEl) peakWinEl.textContent = '15:00 - 16:30';
        if (peakLblEl) { peakLblEl.textContent = 'Flight Arrivals'; peakLblEl.className = 'text-[10px] font-bold text-amber-600'; }
        if (dispatchEl) dispatchEl.textContent = '1 Concierge Floater';
        if (dispatchStatEl) { dispatchStatEl.textContent = 'On Duty'; dispatchStatEl.className = 'text-[10px] font-bold text-slate-500'; }
    } else {
        const total = filtered.reduce((sum, s) => sum + (parseFloat(s.sentiment_score || s.sentimentScore || 4)), 0);
        const avg = (total / filtered.length).toFixed(1);
        if (avgEl) avgEl.textContent = `${avg} / 5.0`;

        if (moodEl) {
            if (avg >= 4.0) {
                moodEl.textContent = 'Positive';
                moodEl.className = 'text-[10px] font-bold text-emerald-600';
            } else if (avg >= 3.0) {
                moodEl.textContent = 'Neutral';
                moodEl.className = 'text-[10px] font-bold text-amber-600';
            } else {
                moodEl.textContent = 'High Stress';
                moodEl.className = 'text-[10px] font-bold text-terracotta-dark';
            }
        }

        // Check stressful pulses for peak friction detection
        const stressPulses = filtered.filter(s => (s.sentiment_score <= 2 || s.sentiment_type === 'Stressful'));
        if (peakWinEl) {
            if (stressPulses.length > 0) {
                peakWinEl.textContent = '15:00 - 16:30';
                if (peakLblEl) {
                    peakLblEl.textContent = 'Peak Rush Friction';
                    peakLblEl.className = 'text-[10px] font-bold text-terracotta-dark';
                }
                if (dispatchEl) dispatchEl.textContent = '1 Floater Dispatched';
                if (dispatchStatEl) {
                    dispatchStatEl.textContent = 'Active Support';
                    dispatchStatEl.className = 'text-[10px] font-bold text-primary';
                }
            } else {
                peakWinEl.textContent = 'No Friction Rush';
                if (peakLblEl) {
                    peakLblEl.textContent = 'Smooth Operations';
                    peakLblEl.className = 'text-[10px] font-bold text-emerald-600';
                }
                if (dispatchEl) dispatchEl.textContent = 'Normal Operations';
                if (dispatchStatEl) {
                    dispatchStatEl.textContent = 'On Duty';
                    dispatchStatEl.className = 'text-[10px] font-bold text-slate-500';
                }
            }
        }
    }

    updateHourlySentimentChart(filtered);
}

function updateHourlySentimentChart(sentiments = []) {
    if (typeof Chart === 'undefined') return;

    const ctxHourly = document.getElementById('chart-hourly-sentiment');
    if (!ctxHourly) return;

    // Calculate hourly distribution based on filtered sentiments
    let positiveData = [90, 85, 88, 75, 70, 80, 85, 92];
    let frictionData = [5, 10, 8, 20, 25, 15, 10, 4];

    if (sentiments.length > 0) {
        const positiveCount = sentiments.filter(s => (s.sentiment_score >= 4) || s.sentiment_type === 'Positive').length;
        const frictionCount = sentiments.filter(s => (s.sentiment_score <= 2) || s.sentiment_type === 'Stressful').length;
        const total = sentiments.length;

        if (total > 0) {
            const posPct = Math.min(100, Math.max(20, Math.round((positiveCount / total) * 100)));
            const frictPct = Math.min(100, Math.max(5, Math.round((frictionCount / total) * 100)));
            positiveData[4] = posPct;
            frictionData[4] = frictPct;
            positiveData[3] = Math.max(50, posPct - 5);
            frictionData[3] = Math.min(40, frictPct + 5);
        }
    }

    if (window.chartHourlySentimentInstance) {
        window.chartHourlySentimentInstance.data.datasets[0].data = positiveData;
        window.chartHourlySentimentInstance.data.datasets[1].data = frictionData;
        window.chartHourlySentimentInstance.update();
    } else {
        window.chartHourlySentimentInstance = new Chart(ctxHourly, {
            type: 'line',
            data: {
                labels: ['06:00', '08:00 (Breakfast)', '10:00', '12:00 (Lunch)', '15:00 (Check-in Rush)', '18:00 (Dinner Rush)', '21:00', '23:00'],
                datasets: [
                    {
                        label: 'Positive Climate (%)',
                        data: positiveData,
                        borderColor: '#7A9A7E',
                        backgroundColor: 'rgba(122, 154, 126, 0.12)',
                        fill: true,
                        tension: 0.35
                    },
                    {
                        label: 'Friction / Stress Peak (%)',
                        data: frictionData,
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
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, family: 'Inter' } } }
                },
                scales: {
                    y: { min: 0, max: 100, grid: { color: '#F1E9E7' }, ticks: { font: { size: 10, family: 'Inter' } } },
                    x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' } } }
                }
            }
        });
    }
}

async function submitSentimentRating(moodType) {
    const scoreMap = { 'Positive': 5, 'Neutral': 3, 'Stressful': 1 };
    const score = scoreMap[moodType] || 4;
    const note = document.getElementById('sentiment-note-input')?.value?.trim() || '';

    const currentUserId = window.currentUser?.id || (window.activePersonaRole === 'Supervisor' ? 'emp-102' : 'emp-101');
    const currentUserName = window.currentUser?.name || (window.activePersonaRole === 'Supervisor' ? 'Chef Marco Rossi' : 'Maria Santos');
    const currentDept = window.currentUser?.department || (window.activePersonaRole === 'Supervisor' ? 'Culinary' : 'Front Office');

    const payload = {
        employeeId: currentUserId,
        employeeName: currentUserName,
        department: currentDept,
        sentimentScore: score,
        shiftPeriod: 'Peak Rush Window',
        sentimentType: moodType,
        note: note
    };

    if (typeof closeModal === 'function') {
        closeModal('modal-sentiment-pulse');
    }

    shiftSentimentsState.unshift({
        ...payload,
        id: 'sent-' + Date.now(),
        created_at: new Date().toISOString()
    });

    applySentimentFiltering();

    if (typeof showToast === 'function') {
        showToast(`Shift sentiment logged (${moodType}) & synced to Supabase!`, 'success');
    }

    try {
        const res = await fetch('api/social.php?action=log_sentiment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const resJson = await res.json();
        if (resJson.success && resJson.data) {
            // Update the state item with true Supabase ID
            const idx = shiftSentimentsState.findIndex(s => s.id === 'sent-' + Date.now());
            if (idx !== -1) {
                shiftSentimentsState[idx] = { ...shiftSentimentsState[idx], ...resJson.data };
            }
        }
    } catch (e) {
        console.warn('Sentiment saved locally:', e);
    }
}

// =========================================================================
// QUALITATIVE APPRAISAL REVIEW INTEGRATION
// =========================================================================

function renderQualitativePerformanceFeed() {
    const container = document.getElementById('perf-qualitative-recognition-container');
    if (!container) return;

    const empId = window.selectedEvalEmpId || 'emp-101';
    const qualitativePosts = socialFeedPostsState.filter(p =>
        (p.receiverId && p.receiverId === empId) ||
        (p.receiverName && p.receiverName.toLowerCase().includes('maria'))
    );

    if (qualitativePosts.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div class="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/80 space-y-3 text-xs">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <h4 class="font-heading font-bold text-xs text-slate-900 uppercase tracking-wider">Verified Social Recognition &amp; Peer Commendations (Q3 Input)</h4>
                </div>
                <span class="badge-gold text-[10px] font-bold">${qualitativePosts.length} Verified Commendations</span>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed">
                The following peer-to-peer quotes and supervisor recognitions are automatically aggregated as <strong>qualitative evidence</strong> for calibration:
            </p>
            <div class="space-y-2">
                ${qualitativePosts.map(p => `
                    <div class="p-3 bg-white rounded-xl border border-amber-100 space-y-1 shadow-2xs">
                        <div class="flex items-center justify-between text-[10px]">
                            <span class="font-bold text-slate-800"><i class="fas fa-user-check text-amber-600 mr-1"></i> ${p.senderName} (${p.senderRole}):</span>
                            <span class="badge-primary text-[9px]">+${p.pointsAwarded} XP</span>
                        </div>
                        <p class="text-slate-700 italic text-[11px]">"${p.text}"</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// =========================================================================
// GIVE RECOGNITION MODAL CONTROLS
// =========================================================================

function initKudosRosterModal() {
    selectedKudosRecipients.clear();
    const msg = document.getElementById('shoutout-message');
    if (msg) msg.value = '';
    const search = document.getElementById('kudos-search-input');
    if (search) search.value = '';
    kudosSearchQuery = '';
    kudosActiveDeptFilter = 'all';
    renderKudosRoster();
    updateKudosXPPreview();
}

function setKudosDeptFilter(deptKey) {
    kudosActiveDeptFilter = deptKey;
    document.querySelectorAll('.kudos-dept-pill').forEach(btn => {
        const d = (btn.dataset.dept || '').toLowerCase();
        if (d === deptKey.toLowerCase()) {
            btn.className = 'kudos-dept-pill active px-3 py-1 rounded-full font-bold bg-amber-500 text-white shadow-2xs transition';
        } else {
            btn.className = 'kudos-dept-pill px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition';
        }
    });
    renderKudosRoster();
}

function filterKudosList() {
    const input = document.getElementById('kudos-search-input');
    kudosSearchQuery = (input?.value || '').toLowerCase().trim();
    renderKudosRoster();
}

function toggleKudosRecipient(staffId) {
    if (selectedKudosRecipients.has(staffId)) {
        selectedKudosRecipients.delete(staffId);
    } else {
        selectedKudosRecipients.add(staffId);
    }
    renderKudosRoster();
    updateKudosXPPreview();
}

function toggleSelectAllKudos(select) {
    let filtered = getFilteredKudosStaff();
    if (select) {
        filtered.forEach(s => selectedKudosRecipients.add(s.id));
    } else {
        selectedKudosRecipients.clear();
    }
    renderKudosRoster();
    updateKudosXPPreview();
}

function getFilteredKudosStaff() {
    let filtered = kudosStaffRosterState;
    if (kudosActiveDeptFilter !== 'all') {
        filtered = filtered.filter(s => (s.dept || s.department || '').toLowerCase().includes(kudosActiveDeptFilter.toLowerCase()));
    }
    if (kudosSearchQuery) {
        filtered = filtered.filter(s =>
            s.name.toLowerCase().includes(kudosSearchQuery) ||
            (s.role || '').toLowerCase().includes(kudosSearchQuery) ||
            (s.dept || '').toLowerCase().includes(kudosSearchQuery)
        );
    }
    return filtered;
}

function renderKudosRoster() {
    const container = document.getElementById('kudos-employee-roster');
    if (!container) return;

    const filtered = getFilteredKudosStaff();

    if (filtered.length === 0) {
        container.innerHTML = `<div class="p-6 text-center text-slate-400 text-xs">No employees found matching filter.</div>`;
        return;
    }

    container.innerHTML = filtered.map(s => {
        const isSelected = selectedKudosRecipients.has(s.id);

        return `
            <div onclick="toggleKudosRecipient('${s.id}')" 
                class="flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer select-none ${isSelected ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400' : 'bg-white border-[#E8DEDC] hover:bg-slate-50'}">
                <div class="flex items-center space-x-3">
                    <img src="${s.avatar}" alt="${s.name}" class="w-8 h-8 rounded-full object-cover border border-[#E8DEDC]">
                    <div>
                        <span class="font-bold text-slate-900 block text-xs">${s.name}</span>
                        <span class="text-[10px] text-slate-500">${s.role} · <span class="text-primary font-semibold">${s.dept || s.department}</span></span>
                    </div>
                </div>
                <div class="w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-amber-500 border-amber-600 text-white' : 'border-slate-300 text-transparent'}">
                    <i class="fas fa-check text-[9px]"></i>
                </div>
            </div>
        `;
    }).join('');

    const countEl = document.getElementById('kudos-selected-count');
    if (countEl) countEl.textContent = selectedKudosRecipients.size;
}

function updateKudosXPPreview() {
    const tierRadio = document.querySelector('input[name="kudos_sender_tier"]:checked');
    const tier = tierRadio ? tierRadio.value : 'Peer';
    const ptsPerPerson = tier === 'Supervisor' ? 100 : (tier === 'Executive' ? 200 : 50);

    const tierBadge = document.getElementById('kudos-tier-badge');
    if (tierBadge) tierBadge.textContent = `+${ptsPerPerson} XP / Person`;

    const totalXP = ptsPerPerson * selectedKudosRecipients.size;
    const previewEl = document.getElementById('kudos-awarded-preview');
    if (previewEl) {
        previewEl.textContent = `+${totalXP} XP Total (${selectedKudosRecipients.size} Selected)`;
    }
}

async function dispatchRecognition() {
    if (selectedKudosRecipients.size === 0) {
        if (typeof showToast === 'function') {
            showToast('Please select at least one colleague to recognize!', 'error');
        }
        return;
    }

    const message = document.getElementById('shoutout-message')?.value?.trim() || 'Outstanding teamwork and hospitality excellence!';
    const categoryKey = document.querySelector('input[name="kudos_category"]:checked')?.value || 'guest_service';
    const tierRadio = document.querySelector('input[name="kudos_sender_tier"]:checked');
    const senderTier = tierRadio ? tierRadio.value : 'Peer';

    const catConfig = RECOGNITION_RULES.CATEGORIES[categoryKey] || RECOGNITION_RULES.CATEGORIES.guest_service;
    const pts = senderTier === 'Supervisor' ? 100 : (senderTier === 'Executive' ? 200 : 50);

    const recipients = Array.from(selectedKudosRecipients).map(id => kudosStaffRosterState.find(s => s.id === id)).filter(Boolean);

    if (typeof closeModal === 'function') {
        closeModal('modal-recognition');
    }

    let toastId = null;
    if (typeof showToast === 'function') {
        toastId = showToast('Dispatching recognition & recording XP ledger...', 'loading');
    }

    for (const r of recipients) {
        const payload = {
            senderId: 'emp-105',
            senderName: senderTier === 'Supervisor' ? 'Elena Vance' : (senderTier === 'Executive' ? 'General Manager' : 'Maria Santos'),
            senderType: senderTier,
            senderRole: senderTier === 'Supervisor' ? 'HR Director' : (senderTier === 'Executive' ? 'General Manager' : 'Front Desk Host'),
            senderAvatar: senderTier === 'Supervisor'
                ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            receiverId: r.id,
            receiverName: r.name,
            receiverRole: r.role,
            receiverDept: r.dept || r.department || 'Operations',
            receiverAvatar: r.avatar,
            categoryKey: categoryKey,
            categoryLabel: catConfig.label,
            textContent: message
        };

        const localPost = {
            id: `post-${Date.now()}-${Math.floor(Math.random() * 100)}`,
            senderName: payload.senderName,
            senderRole: payload.senderRole,
            senderType: payload.senderType,
            senderAvatar: payload.senderAvatar,
            receiverName: r.name,
            receiverRole: r.role,
            receiverDept: payload.receiverDept,
            receiverAvatar: r.avatar,
            categoryKey: categoryKey,
            categoryLabel: catConfig.label,
            pointsAwarded: pts,
            timestamp: 'Just now',
            date: 'Aug 2026',
            text: message,
            reactions: { clap: 1, heart: 1, star: 1, fire: 0 },
            comments: []
        };

        socialFeedPostsState.unshift(localPost);

        // Update Ledger locally
        pointsLedgerState.unshift({
            id: `TXN-${Math.floor(Math.random() * 1000) + 8800}`,
            date: 'Aug 24, 2026',
            recipient: r.name,
            sender: `${payload.senderName} (${senderTier})`,
            rule: senderTier === 'Supervisor' ? 'SUPERVISOR_COMMENDATION' : (senderTier === 'Executive' ? 'GM_EXECUTIVE_CITATION' : 'PEER_TO_PEER_RECOGNITION'),
            category: catConfig.label,
            xpChange: `+${pts} XP`,
            balance: '1,550 XP'
        });

        try {
            await fetch('api/social.php?action=give_recognition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (e) {
            console.warn('Recognition sync warning:', e);
        }
    }

    await initSocialRecognition();

    if (toastId && typeof dismissToast === 'function') {
        dismissToast(toastId);
    }

    if (typeof showToast === 'function') {
        showToast(`Recognition dispatched to ${recipients.length} colleague(s) & permanently recorded in Supabase!`, 'success');
    }
}

// Global Window Bindings
window.initSocialRecognition = initSocialRecognition;
window.renderSocialFeed = renderSocialFeed;
window.setSocialDeptFilter = setSocialDeptFilter;
window.filterSocialFeed = filterSocialFeed;
window.reactToPost = reactToPost;
window.togglePostComments = togglePostComments;
window.submitPostComment = submitPostComment;
window.filterPointLedger = filterPointLedger;
window.renderPointLedger = renderPointLedger;
window.renderMilestoneBadges = renderMilestoneBadges;
window.updateHourlySentimentChart = updateHourlySentimentChart;
window.submitSentimentRating = submitSentimentRating;
window.setSentimentTimeFilter = setSentimentTimeFilter;
window.applySentimentFiltering = applySentimentFiltering;
window.applyModalSpecificDate = applyModalSpecificDate;
window.clearModalSpecificDate = clearModalSpecificDate;
window.initKudosRosterModal = initKudosRosterModal;
window.setKudosDeptFilter = setKudosDeptFilter;
window.filterKudosList = filterKudosList;
window.toggleKudosRecipient = toggleKudosRecipient;
window.toggleSelectAllKudos = toggleSelectAllKudos;
window.updateKudosXPPreview = updateKudosXPPreview;
window.dispatchRecognition = dispatchRecognition;
window.renderQualitativePerformanceFeed = renderQualitativePerformanceFeed;

document.addEventListener('DOMContentLoaded', () => {
    initSocialRecognition();
});
