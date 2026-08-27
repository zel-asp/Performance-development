/**
 * Oxford Suites, Makati - Social Recognition & Deterministic Gamification Ledger
 * 
 * Scope:
 * 1. Peer-to-peer and supervisor-to-employee recognition posts (text + category)
 * 2. Point/badge ledger — deterministic backend rules (not AI-generated)
 * 3. Recognition feed visible to department/team with reaction cheering
 * 4. Recognition data passed as qualitative input into Performance Management cycles
 */

// =========================================================================
// 1. DETERMINISTIC RULES & CONSTANTS
// =========================================================================

const RECOGNITION_RULES = {
    PEER_TO_PEER_POINTS: 50,      // Peer recognition: +50 XP
    SUPERVISOR_POINTS: 100,       // Supervisor commendation: +100 XP
    EXECUTIVE_GM_POINTS: 200,     // General Manager citation: +200 XP
    CATEGORIES: {
        guest_service: { label: 'Great Guest Service', icon: 'fa-bell-concierge', color: 'gold', badge: 'Guest Hero' },
        collaboration: { label: 'Team Collaboration', icon: 'fa-hands-holding-circle', color: 'dusty', badge: 'Team Anchor' },
        safety_haccp: { label: 'Safety & HACCP Standard', icon: 'fa-shield-halved', color: 'sage', badge: 'Safety Champion' },
        crisis_recovery: { label: 'Crisis & Conflict Recovery', icon: 'fa-handshake-angle', color: 'terracotta', badge: 'Diplomacy Lead' },
        operational_excellence: { label: 'Operational Excellence', icon: 'fa-star', color: 'primary', badge: 'Excellence Master' }
    }
};

// =========================================================================
// 2. STATE STORES
// =========================================================================

const kudosStaffRoster = [
    { id: 'maria_santos', name: 'Maria Santos', role: 'Front Desk Host', dept: 'Front Office', deptName: 'Front Office', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', rating: '4.80' },
    { id: 'carlos_gomez', name: 'Carlos Gomez', role: 'Concierge Host', dept: 'Front Office', deptName: 'Front Office', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', rating: '4.60' },
    { id: 'chef_marco', name: 'Chef Marco Rossi', role: 'Executive Sous Chef', dept: 'Culinary', deptName: 'Culinary', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', rating: '4.85' },
    { id: 'pierre_dubois', name: 'Pierre Dubois', role: 'Master Sommelier', dept: 'F&B Service', deptName: 'F&B Service', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', rating: '4.90' },
    { id: 'david_lee', name: 'David Lee', role: 'F&B Server Lead', dept: 'F&B Service', deptName: 'F&B Service', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', rating: '4.20' },
    { id: 'rosa_flores', name: 'Rosa Flores', role: 'Floor Supervisor', dept: 'Housekeeping', deptName: 'Housekeeping', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', rating: '4.65' },
    { id: 'elena_vance', name: 'Elena Vance', role: 'HR Director', dept: 'HR & Admin', deptName: 'HR & Admin', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', rating: '4.95' }
];

let socialFeedPostsState = [
    {
        id: 'post-101',
        senderName: 'Elena Vance',
        senderRole: 'HR Director & Trainer',
        senderType: 'Supervisor', // 'Peer', 'Supervisor', 'Executive'
        senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        receiverName: 'Maria Santos',
        receiverRole: 'Front Desk Host',
        receiverDept: 'Front Office',
        receiverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        categoryKey: 'crisis_recovery',
        categoryLabel: 'Crisis & Conflict Recovery',
        pointsAwarded: 100, // Supervisor Commendation
        timestamp: '2 hours ago',
        date: 'Aug 24, 2026',
        text: 'Exceptional de-escalation with the diplomat delegation arrival during peak check-in rush. Maria calmly arranged executive lounge hospitality and VIP suite keys without any friction.',
        reactions: { clap: 14, heart: 9, star: 7, fire: 5 },
        qualitativeInCycle: true
    },
    {
        id: 'post-102',
        senderName: 'Carlos Gomez',
        senderRole: 'Concierge Lead',
        senderType: 'Peer',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        receiverName: 'Maria Santos',
        receiverRole: 'Front Desk Host',
        receiverDept: 'Front Office',
        receiverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        categoryKey: 'collaboration',
        categoryLabel: 'Team Collaboration',
        pointsAwarded: 50, // Peer Recognition
        timestamp: 'Yesterday at 17:40',
        date: 'Aug 23, 2026',
        text: 'Huge thanks to Maria for stepping in during the concierge group luggage dispatch while two flights arrived simultaneously. Pure teamwork!',
        reactions: { clap: 8, heart: 12, star: 3, fire: 2 },
        qualitativeInCycle: true
    },
    {
        id: 'post-103',
        senderName: 'Chef Marco Rossi',
        senderRole: 'Executive Sous Chef',
        senderType: 'Supervisor',
        senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        receiverName: 'Chef Marco S.',
        receiverRole: 'Line Cook Lead',
        receiverDept: 'Culinary',
        receiverAvatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80',
        categoryKey: 'safety_haccp',
        categoryLabel: 'Safety & HACCP Standard',
        pointsAwarded: 100,
        timestamp: '2 days ago',
        date: 'Aug 22, 2026',
        text: 'Flawless 100% cold-chain probe log compliance and exemplary allergen segregation during banquet dinner service for 250 guests.',
        reactions: { clap: 19, heart: 6, star: 8, fire: 11 },
        qualitativeInCycle: true
    },
    {
        id: 'post-104',
        senderName: 'Maria Santos',
        senderRole: 'Front Desk Host',
        senderType: 'Peer',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        receiverName: 'David Lee',
        receiverRole: 'F&B Server Lead',
        receiverDept: 'F&B Service',
        receiverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        categoryKey: 'guest_service',
        categoryLabel: 'Great Guest Service',
        pointsAwarded: 50,
        timestamp: '3 days ago',
        date: 'Aug 21, 2026',
        text: 'David made our long-stay VIP guests feel so welcomed with customized tableside wine recommendations that they wrote a personal commendation card!',
        reactions: { clap: 11, heart: 15, star: 6, fire: 3 },
        qualitativeInCycle: true
    }
];

let pointsLedgerState = [
    { id: 'TXN-8801', date: 'Aug 24, 2026', recipient: 'Maria Santos', sender: 'Elena Vance (Supervisor)', rule: 'SUPERVISOR_COMMENDATION', category: 'Crisis Recovery', xpChange: '+100 XP', balance: 1480 },
    { id: 'TXN-8800', date: 'Aug 23, 2026', recipient: 'Maria Santos', sender: 'Carlos Gomez (Peer)', rule: 'PEER_TO_PEER_RECOGNITION', category: 'Team Collaboration', xpChange: '+50 XP', balance: 1380 },
    { id: 'TXN-8799', date: 'Aug 22, 2026', recipient: 'Chef Marco S.', sender: 'Chef Marco Rossi (Supervisor)', rule: 'SUPERVISOR_COMMENDATION', category: 'Safety & HACCP', xpChange: '+100 XP', balance: 1150 },
    { id: 'TXN-8798', date: 'Aug 21, 2026', recipient: 'David Lee', sender: 'Maria Santos (Peer)', rule: 'PEER_TO_PEER_RECOGNITION', category: 'Guest Service', xpChange: '+50 XP', balance: 950 }
];

let milestoneBadgesState = [
    { id: 'badge-1', name: 'Guest Hero', category: 'Guest Service', threshold: '10+ 5-Star Reviews', icon: 'fa-trophy', color: 'gold', awardedTo: 'Maria Santos', dateAwarded: 'Aug 2026', isUnlocked: true },
    { id: 'badge-2', name: 'Safety Star', category: 'Safety & HACCP', threshold: '100% HACCP Audit Pass', icon: 'fa-shield-halved', color: 'sage', awardedTo: 'Chef Marco S.', dateAwarded: 'Aug 2026', isUnlocked: true },
    { id: 'badge-3', name: 'Team Anchor', category: 'Collaboration', threshold: '5+ Peer Recognitions', icon: 'fa-hands-holding-circle', color: 'dusty', awardedTo: 'Carlos Gomez', dateAwarded: 'Jul 2026', isUnlocked: true },
    { id: 'badge-4', name: 'Diplomacy Lead', category: 'Crisis Recovery', threshold: 'Mastery in De-escalation', icon: 'fa-handshake-angle', color: 'terracotta', awardedTo: 'Maria Santos', dateAwarded: 'Aug 2026', isUnlocked: true }
];

let socialActiveDeptFilter = 'all';

// =========================================================================
// 3. INITIALIZATION & RENDERING
// =========================================================================

function initSocialRecognition() {
    renderSocialFeed();
    renderPointLedger();
    renderMilestoneBadges();
    renderQualitativePerformanceFeed();
}

function setSocialDeptFilter(dept) {
    socialActiveDeptFilter = dept;
    document.querySelectorAll('.social-dept-chip').forEach(btn => {
        if (btn.dataset.dept === dept) {
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('bg-[#FAF8F7]', 'text-slate-600');
        } else {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-[#FAF8F7]', 'text-slate-600');
        }
    });
    renderSocialFeed();
}

// =========================================================================
// 4. RECOGNITION FEED & PEER POSTS
// =========================================================================

function renderSocialFeed() {
    const container = document.getElementById('social-feed-container');
    if (!container) return;

    let filteredPosts = socialFeedPostsState;
    if (socialActiveDeptFilter !== 'all') {
        filteredPosts = socialFeedPostsState.filter(p => p.receiverDept.toLowerCase().includes(socialActiveDeptFilter.toLowerCase()));
    }

    if (filteredPosts.length === 0) {
        container.innerHTML = `<div class="p-8 text-center text-slate-400 text-xs">No recognition posts found for this department yet. Be the first to send kudos!</div>`;
        return;
    }

    container.innerHTML = filteredPosts.map(post => {
        const catConfig = RECOGNITION_RULES.CATEGORIES[post.categoryKey] || { label: post.categoryLabel, color: 'primary', icon: 'fa-award' };

        return `
            <div class="card-clean p-5 hover:shadow-md transition space-y-3.5 border border-[#E8DEDC] bg-white">
                <!-- Header: Sender & Receiver Details -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DEDC] pb-3">
                    <div class="flex items-center space-x-3">
                        <img src="${post.senderAvatar}" alt="${post.senderName}" class="w-9 h-9 rounded-full object-cover border border-[#E8DEDC] shadow-sm">
                        <div>
                            <div class="flex items-center space-x-1.5">
                                <span class="font-bold text-slate-900 text-xs">${post.senderName}</span>
                                <span class="text-[10px] text-slate-400 font-medium">recognized</span>
                                <span class="font-bold text-primary text-xs">${post.receiverName}</span>
                            </div>
                            <p class="text-[10px] text-slate-500">${post.senderRole} &rarr; <span class="font-semibold text-slate-700">${post.receiverRole}</span> (${post.receiverDept})</p>
                        </div>
                    </div>

                    <div class="flex items-center space-x-2">
                        <span class="badge-${catConfig.color} text-[10px]">
                            <i class="fas ${catConfig.icon} mr-1"></i> ${post.categoryLabel}
                        </span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-800 border border-amber-500/20">
                            +${post.pointsAwarded} XP
                        </span>
                    </div>
                </div>

                <!-- Recognition Text Quote -->
                <p class="text-xs text-slate-700 leading-relaxed font-medium pl-3 border-l-2 border-primary/40 italic">
                    "${post.text}"
                </p>

                <!-- Footer: Reactions & Performance Input Badge -->
                <div class="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500">
                    <div class="flex items-center space-x-1.5">
                        <button onclick="reactToPost('${post.id}', 'clap')" class="px-2.5 py-1 rounded-xl bg-[#FAF8F7] hover:bg-slate-100 border border-[#E8DEDC] text-[11px] font-bold flex items-center space-x-1 transition">
                            <span>👏</span>
                            <span id="react-clap-${post.id}">${post.reactions.clap}</span>
                        </button>
                        <button onclick="reactToPost('${post.id}', 'heart')" class="px-2.5 py-1 rounded-xl bg-[#FAF8F7] hover:bg-slate-100 border border-[#E8DEDC] text-[11px] font-bold flex items-center space-x-1 transition">
                            <span>❤️</span>
                            <span id="react-heart-${post.id}">${post.reactions.heart}</span>
                        </button>
                        <button onclick="reactToPost('${post.id}', 'star')" class="px-2.5 py-1 rounded-xl bg-[#FAF8F7] hover:bg-slate-100 border border-[#E8DEDC] text-[11px] font-bold flex items-center space-x-1 transition">
                            <span>⭐</span>
                            <span id="react-star-${post.id}">${post.reactions.star}</span>
                        </button>
                        <button onclick="reactToPost('${post.id}', 'fire')" class="px-2.5 py-1 rounded-xl bg-[#FAF8F7] hover:bg-slate-100 border border-[#E8DEDC] text-[11px] font-bold flex items-center space-x-1 transition">
                            <span>🔥</span>
                            <span id="react-fire-${post.id}">${post.reactions.fire}</span>
                        </button>
                    </div>

                    <div class="flex items-center space-x-2">
                        <span class="text-[10px] text-slate-400">${post.timestamp}</span>
                        <span class="text-[10px] font-semibold text-sage-dark flex items-center">
                            <i class="fas fa-check-circle mr-1 text-emerald-600"></i> Passed to Appraisal Review
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function reactToPost(postId, reactionType) {
    const post = socialFeedPostsState.find(p => p.id === postId);
    if (!post) return;

    post.reactions[reactionType] = (post.reactions[reactionType] || 0) + 1;
    const countEl = document.getElementById(`react-${reactionType}-${postId}`);
    if (countEl) countEl.textContent = post.reactions[reactionType];
    
    showToast(`Reaction added to ${post.receiverName}'s recognition!`, 'success');
}

// =========================================================================
// 5. DETERMINISTIC POINT LEDGER & BADGES
// =========================================================================

function renderPointLedger() {
    const tbody = document.getElementById('points-ledger-tbody');
    if (!tbody) return;

    tbody.innerHTML = pointsLedgerState.map(txn => `
        <tr class="hover:bg-[#FAF8F7]/80 transition text-xs">
            <td class="px-5 py-3 font-mono font-bold text-slate-700">${txn.id}</td>
            <td class="px-5 py-3 text-slate-600">${txn.date}</td>
            <td class="px-5 py-3 font-bold text-slate-900">${txn.recipient}</td>
            <td class="px-5 py-3 text-slate-600">${txn.sender}</td>
            <td class="px-5 py-3 font-semibold text-slate-700">${txn.category}</td>
            <td class="px-5 py-3 font-bold text-emerald-700">${txn.xpChange}</td>
            <td class="px-5 py-3 font-mono font-bold text-slate-900">${txn.balance} XP</td>
        </tr>
    `).join('');
}

function renderMilestoneBadges() {
    const container = document.getElementById('milestone-badges-grid');
    if (!container) return;

    container.innerHTML = milestoneBadgesState.map(b => `
        <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2 text-center text-xs">
            <div class="w-12 h-12 mx-auto rounded-2xl bg-${b.color}-500/10 text-${b.color}-600 border border-${b.color}-500/20 flex items-center justify-center text-xl shadow-xs">
                <i class="fas ${b.icon}"></i>
            </div>
            <div>
                <h4 class="font-heading font-bold text-sm text-slate-900">${b.name}</h4>
                <p class="text-[10px] text-slate-400">${b.threshold}</p>
            </div>
            <div class="pt-1 border-t border-[#E8DEDC] flex justify-between items-center text-[10px]">
                <span class="text-slate-500">Recipient:</span>
                <span class="font-bold text-slate-800">${b.awardedTo}</span>
            </div>
        </div>
    `).join('');
}

// =========================================================================
// 6. QUALITATIVE INPUT INTO PERFORMANCE MANAGEMENT CYCLE
// =========================================================================

function renderQualitativePerformanceFeed() {
    const container = document.getElementById('perf-qualitative-recognition-container');
    if (!container) return;

    // Check if database social commendations exist for the selected employee
    const empId = window.selectedEvalEmpId || 'emp-101';
    const dbPosts = (window.dbSocialPosts || []).filter(p => p.receiver_id === empId || p.receiver_name === empId);

    if (dbPosts.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div class="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/80 space-y-3 text-xs">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                    <h4 class="font-heading font-bold text-xs text-slate-900 uppercase tracking-wider">Verified Social Recognition &amp; Peer Commendations (Q3 Input)</h4>
                </div>
                <span class="badge-gold text-[10px] font-bold">${dbPosts.length} Commendations Recorded</span>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed">
                The following peer-to-peer quotes and supervisor recognitions are automatically aggregated as <strong>qualitative evidence</strong> for the manager's final rating calibration:
            </p>
            <div class="space-y-2">
                ${dbPosts.map(p => `
                    <div class="p-3 bg-white rounded-xl border border-amber-100 space-y-1 shadow-2xs">
                        <div class="flex items-center justify-between text-[10px]">
                            <span class="font-bold text-slate-800"><i class="fas fa-user-check text-amber-600 mr-1"></i> ${p.sender_name || 'Colleague'} (${p.sender_role || 'Staff'}):</span>
                            <span class="badge-primary text-[9px]">+${p.points || 50} XP</span>
                        </div>
                        <p class="text-slate-700 italic text-[11px]">"${p.message || p.text}"</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// =========================================================================
// 7. POST CREATION & SEND MODAL HANDLER
// =========================================================================

let selectedKudosRecipients = new Set();
let kudosActiveDeptFilter = 'all';

function initKudosRosterModal() {
    selectedKudosRecipients.clear();
    const msg = document.getElementById('shoutout-message');
    if (msg) msg.value = '';
    renderKudosRoster();
}

function setKudosDeptFilter(deptKey) {
    kudosActiveDeptFilter = deptKey;
    renderKudosRoster();
}

function toggleKudosRecipient(staffId) {
    if (selectedKudosRecipients.has(staffId)) {
        selectedKudosRecipients.delete(staffId);
    } else {
        selectedKudosRecipients.add(staffId);
    }
    renderKudosRoster();
}

function renderKudosRoster() {
    const container = document.getElementById('kudos-employee-roster');
    if (!container) return;

    let filtered = kudosStaffRoster;
    if (kudosActiveDeptFilter !== 'all') {
        filtered = kudosStaffRoster.filter(s => s.dept.toLowerCase().includes(kudosActiveDeptFilter.toLowerCase()));
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
                        <span class="text-[10px] text-slate-500">${s.role} · ${s.dept}</span>
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

function dispatchRecognition() {
    if (selectedKudosRecipients.size === 0) {
        showToast('Please select at least one colleague to recognize!', 'error');
        return;
    }

    const message = document.getElementById('shoutout-message')?.value || 'Outstanding teamwork and hospitality excellence!';
    const categoryKey = document.getElementById('kudos-category-select')?.value || 'guest_service';
    const isSupervisor = document.getElementById('kudos-role-supervisor')?.checked || false;

    const pointsPerPerson = isSupervisor ? RECOGNITION_RULES.SUPERVISOR_POINTS : RECOGNITION_RULES.PEER_TO_PEER_POINTS;
    const catConfig = RECOGNITION_RULES.CATEGORIES[categoryKey] || RECOGNITION_RULES.CATEGORIES.guest_service;

    const recipients = Array.from(selectedKudosRecipients).map(id => kudosStaffRoster.find(s => s.id === id)).filter(Boolean);

    recipients.forEach(r => {
        const newPost = {
            id: `post-${Date.now()}-${Math.floor(Math.random()*100)}`,
            senderName: isSupervisor ? 'Elena Vance' : 'Maria Santos',
            senderRole: isSupervisor ? 'HR Director & Supervisor' : 'Front Desk Host',
            senderType: isSupervisor ? 'Supervisor' : 'Peer',
            senderAvatar: isSupervisor ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            receiverName: r.name,
            receiverRole: r.role,
            receiverDept: r.dept,
            receiverAvatar: r.avatar,
            categoryKey: categoryKey,
            categoryLabel: catConfig.label,
            pointsAwarded: pointsPerPerson,
            timestamp: 'Just now',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            text: message,
            reactions: { clap: 1, heart: 1, star: 1, fire: 0 },
            qualitativeInCycle: true
        };

        socialFeedPostsState.unshift(newPost);

        // Add ledger transaction
        pointsLedgerState.unshift({
            id: `TXN-${Math.floor(8800 + Math.random()*1000)}`,
            date: newPost.date,
            recipient: r.name,
            sender: `${newPost.senderName} (${newPost.senderType})`,
            rule: isSupervisor ? 'SUPERVISOR_COMMENDATION' : 'PEER_TO_PEER_RECOGNITION',
            category: catConfig.label,
            xpChange: `+${pointsPerPerson} XP`,
            balance: 1480 + pointsPerPerson
        });
    });

    closeModal('modal-recognition');
    awardXP(pointsPerPerson * recipients.length);

    renderSocialFeed();
    renderPointLedger();
    renderQualitativePerformanceFeed();

    showToast(`Recognition dispatched to ${recipients.length} colleague(s)! (+${pointsPerPerson * recipients.length} XP total awarded)`, 'success');
}

function awardXP(amount) {
    if (typeof currentXP !== 'undefined') {
        currentXP += amount;
        const xpEl = document.getElementById('user-xp-display');
        if (xpEl) xpEl.textContent = `${currentXP} XP`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSocialRecognition();
});
