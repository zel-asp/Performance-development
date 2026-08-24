const kudosStaffRoster = [
                { id: 'chef_marco', name: 'Chef Marco Rossi', role: 'Executive Sous Chef', dept: 'culinary', deptName: 'Culinary', rating: '4.85', initials: 'MR', bg: 'bg-amber-600' },
                { id: 'elena_vance', name: 'Elena Vance', role: 'HR Director', dept: 'hr', deptName: 'HR & Admin', rating: '4.95', initials: 'EV', bg: 'bg-purple-700' },
                { id: 'maria_santos', name: 'Maria Santos', role: 'Front Desk Host', dept: 'front_office', deptName: 'Front Office', rating: '4.55', initials: 'MS', bg: 'bg-blue-600' },
                { id: 'carlos_gomez', name: 'Carlos Gomez', role: 'Concierge Host', dept: 'front_office', deptName: 'Front Office', rating: '4.20', initials: 'CG', bg: 'bg-slate-700' },
                { id: 'ana_tanaka', name: 'Ana Tanaka', role: 'Night Auditor', dept: 'front_office', deptName: 'Front Office', rating: '4.80', initials: 'AT', bg: 'bg-teal-700' },
                { id: 'lucas_vargas', name: 'Lucas Vargas', role: 'Junior Host', dept: 'front_office', deptName: 'Front Office', rating: '3.90', initials: 'LV', bg: 'bg-indigo-600' },
                { id: 'pierre_dubois', name: 'Pierre Dubois', role: 'Master Sommelier', dept: 'fb_service', deptName: 'F&B Service', rating: '4.90', initials: 'PD', bg: 'bg-rose-700' },
                { id: 'jean_luc', name: 'Jean-Luc Moreau', role: 'Head Waiter', dept: 'fb_service', deptName: 'F&B Service', rating: '4.40', initials: 'JM', bg: 'bg-cyan-700' },
                { id: 'chloe_dupont', name: 'Chloe Dupont', role: 'Bistro Hostess', dept: 'fb_service', deptName: 'F&B Service', rating: '4.15', initials: 'CD', bg: 'bg-pink-700' },
                { id: 'antonio_silva', name: 'Antonio Silva', role: 'Chef de Partie', dept: 'culinary', deptName: 'Culinary', rating: '4.30', initials: 'AS', bg: 'bg-orange-700' },
                { id: 'kenji_sato', name: 'Kenji Sato', role: 'Pastry Chef', dept: 'culinary', deptName: 'Culinary', rating: '4.70', initials: 'KS', bg: 'bg-emerald-700' },
                { id: 'rosa_flores', name: 'Rosa Flores', role: 'Floor Supervisor', dept: 'housekeeping', deptName: 'Housekeeping', rating: '4.65', initials: 'RF', bg: 'bg-teal-600' },
                { id: 'fatima_al', name: 'Fatima Al-Mansoor', role: 'Suite Attendant', dept: 'housekeeping', deptName: 'Housekeeping', rating: '4.50', initials: 'FA', bg: 'bg-purple-600' },
                { id: 'david_kim', name: 'David Kim', role: 'Banquet Captain', dept: 'banquet', deptName: 'Banquets', rating: '4.45', initials: 'DK', bg: 'bg-blue-700' },
                { id: 'sarah_jenkins', name: 'Sarah Jenkins', role: 'Event Coordinator', dept: 'banquet', deptName: 'Banquets', rating: '4.60', initials: 'SJ', bg: 'bg-emerald-600' }
            ];

            let selectedKudosRecipients = new Set();
            let kudosActiveDeptFilter = 'all';

            function initKudosRosterModal() {
                const searchInput = document.getElementById('kudos-search-input');
                if (searchInput) searchInput.value = '';
                kudosActiveDeptFilter = 'all';
                updateKudosDeptFilterPills();
                renderKudosRoster();
            }

            function setKudosDeptFilter(deptKey) {
                kudosActiveDeptFilter = deptKey;
                updateKudosDeptFilterPills();
                renderKudosRoster();
            }

            function updateKudosDeptFilterPills() {
                document.querySelectorAll('.kudos-dept-pill').forEach(pill => {
                    const pillDept = pill.getAttribute('data-dept');
                    if (pillDept === kudosActiveDeptFilter) {
                        pill.className = 'kudos-dept-pill active px-3 py-1 rounded-full font-bold bg-amber-500 text-white shadow-2xs transition text-[11px]';
                    } else {
                        pill.className = 'kudos-dept-pill px-3 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-[11px]';
                    }
                });
            }

            function filterKudosList() {
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

            function toggleSelectAllKudos(selectAll) {
                const query = (document.getElementById('kudos-search-input')?.value || '').toLowerCase().trim();
                const filtered = kudosStaffRoster.filter(s => {
                    const matchDept = (kudosActiveDeptFilter === 'all' || s.dept === kudosActiveDeptFilter);
                    const matchText = !query || s.name.toLowerCase().includes(query) || s.role.toLowerCase().includes(query) || s.deptName.toLowerCase().includes(query);
                    return matchDept && matchText;
                });

                if (selectAll) {
                    filtered.forEach(s => selectedKudosRecipients.add(s.id));
                } else {
                    if (query || kudosActiveDeptFilter !== 'all') {
                        filtered.forEach(s => selectedKudosRecipients.delete(s.id));
                    } else {
                        selectedKudosRecipients.clear();
                    }
                }
                renderKudosRoster();
            }

            function renderKudosRoster() {
                const container = document.getElementById('kudos-employee-roster');
                if (!container) return;

                const query = (document.getElementById('kudos-search-input')?.value || '').toLowerCase().trim();
                const filtered = kudosStaffRoster.filter(s => {
                    const matchDept = (kudosActiveDeptFilter === 'all' || s.dept === kudosActiveDeptFilter);
                    const matchText = !query || s.name.toLowerCase().includes(query) || s.role.toLowerCase().includes(query) || s.deptName.toLowerCase().includes(query);
                    return matchDept && matchText;
                });

                if (filtered.length === 0) {
                    container.innerHTML = `
                        <div class="py-6 text-center text-slate-400">
                            <i class="fas fa-user-slash text-xl mb-1"></i>
                            <p class="text-xs">No employees found matching criteria</p>
                        </div>
                    `;
                    updateKudosUI();
                    return;
                }

                container.innerHTML = filtered.map(s => {
                    const isSelected = selectedKudosRecipients.has(s.id);
                    const ratingNum = parseFloat(s.rating);
                    let perfBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    if (ratingNum < 4.3) {
                        perfBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                    } else if (ratingNum < 4.6) {
                        perfBadgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                    }

                    return `
                        <div onclick="toggleKudosRecipient('${s.id}')"
                            class="flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer select-none ${isSelected
                            ? 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-400/50 shadow-2xs'
                            : 'bg-white border-slate-200/80 hover:bg-slate-100/70'
                        }">
                            <div class="flex items-center space-x-3 min-w-0">
                                <div class="w-5 h-5 rounded-md flex items-center justify-center border transition ${isSelected
                            ? 'bg-amber-500 border-amber-600 text-white shadow-2xs'
                            : 'bg-slate-100 border-slate-300 text-transparent'
                        }">
                                    <i class="fas fa-check text-[9px]"></i>
                                </div>
                                <div class="w-8 h-8 rounded-full ${s.bg} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs border border-white">
                                    ${s.initials}
                                </div>
                                <div class="min-w-0">
                                    <p class="font-bold text-slate-900 text-xs truncate leading-tight">${s.name}</p>
                                    <p class="text-[10px] text-slate-500 truncate">${s.role} · <span class="font-medium">${s.deptName}</span></p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-1.5 flex-shrink-0">
                                <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${perfBadgeClass} flex items-center space-x-1 shadow-2xs">
                                    <i class="fas fa-star text-[9px] text-amber-500"></i>
                                    <span>${s.rating} Avg</span>
                                </span>
                            </div>
                        </div>
                    `;
                }).join('');

                updateKudosUI();
            }

            function updateKudosUI() {
                const count = selectedKudosRecipients.size;
                const countEl = document.getElementById('kudos-selected-count');
                if (countEl) countEl.textContent = count;

                const xpTotal = count * 50;
                const previewEl = document.getElementById('kudos-awarded-preview');
                if (previewEl) previewEl.textContent = `+${xpTotal} XP Total (${count} colleague${count === 1 ? '' : 's'})`;

                const btnLabel = document.getElementById('kudos-submit-label');
                if (btnLabel) {
                    btnLabel.textContent = count > 0 ? `Send Kudos (${count}) & Award XP` : 'Send Kudos & Award XP';
                }
            }

            function dispatchRecognition() {
                if (selectedKudosRecipients.size === 0) {
                    showToast('Please select at least one colleague to send kudos!', 'error');
                    return;
                }

                const names = Array.from(selectedKudosRecipients).map(id => {
                    const found = kudosStaffRoster.find(s => s.id === id);
                    return found ? found.name : id;
                });

                const totalAwarded = selectedKudosRecipients.size * 50;
                closeModal('modal-recognition');
                awardXP(totalAwarded);

                const count = selectedKudosRecipients.size;
                if (count === 1) {
                    showToast(`Kudos sent to ${names[0]}! (+50 XP granted)`, 'success');
                } else {
                    showToast(`Kudos sent to ${count} colleagues: ${names.slice(0, 2).join(', ')}${count > 2 ? ` and ${count - 2} more` : ''}! (+${totalAwarded} XP granted)`, 'success');
                }

                // Reset selection
                selectedKudosRecipients.clear();
                const msgInput = document.getElementById('shoutout-message');
                if (msgInput) msgInput.value = '';
            }

            function awardXP(amount) {
                currentXP += amount;
                document.getElementById('kpi-xp-val').innerHTML = `${currentXP} <span class="text-xs font-normal text-slate-400">XP</span>`;
                const fillPct = Math.min(100, Math.round((currentXP / 1600) * 100));
                document.getElementById('kpi-xp-bar').style.width = fillPct + '%';
            }

            function submitSentimentRating(rating) {
                closeModal('modal-sentiment-pulse');
                let pos = 68.5, neu = 23.0, neg = 8.5;
                if (rating === 'Positive') { pos = 71.2; neu = 21.0; neg = 7.8; }
                else if (rating === 'Neutral') { pos = 66.0; neu = 25.5; neg = 8.5; }
                else { pos = 63.0; neu = 22.0; neg = 15.0; }

                if (chartSentimentDoughnutInstance) {
                    chartSentimentDoughnutInstance.data.datasets[0].data = [pos, neu, neg];
                    chartSentimentDoughnutInstance.update();
                }

                showToast(`Shift sentiment logged as "${rating}". Thank you!`, 'success');
            }

            function logAchievementPrompt() {
                const desc = prompt("Enter accomplishment or guest compliment to log:");
                if (desc) {
                    showToast(`Accomplishment logged: "${desc}"`, 'success');
                }
            }

            // Charts Initialization
