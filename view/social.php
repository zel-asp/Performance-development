<!-- ======================================================== -->
                        <div id="panel-pillar-social" class="pillar-panel space-y-6">

                            <div
                                class="subnav-track flex items-center space-x-1.5 p-1.5 overflow-x-auto custom-scrollbar">
                                <button onclick="switchSubTab('social', 'kudos')"
                                    class="subnav-pill subnav-social active" data-sub="kudos">
                                    <i class="fas fa-trophy mr-1.5 text-gold-dark"></i>
                                    <span>Kudos &amp; Gamification XP</span>
                                </button>
                                <button onclick="switchSubTab('social', 'climate')" class="subnav-pill subnav-social"
                                    data-sub="climate">
                                    <i class="fas fa-heart-pulse mr-1.5 text-terracotta-dark"></i>
                                    <span>24h Realtime Sentiment</span>
                                </button>
                            </div>

                            <!-- Kudos -->
                            <div id="sub-social-kudos" class="sub-panel sub-panel-social active space-y-6">
                                <div class="card-clean p-6 space-y-6">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <h3 class="font-heading font-bold text-xl text-slate-900">Social Recognition &amp; Ambassador Badges</h3>
                                            <p class="text-xs text-slate-500">Celebrate team milestones and earn level progress</p>
                                        </div>
                                        <button onclick="openModal('modal-recognition')"
                                            class="btn-primary px-4 py-2 text-xs font-bold self-start sm:self-auto">
                                            + Give Kudos (+50 XP)
                                        </button>
                                    </div>

                                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                                        <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-1">
                                            <div
                                                class="w-10 h-10 mx-auto rounded-xl bg-gold-50 text-gold-dark border border-gold-100 flex items-center justify-center text-lg font-bold">
                                                <i class="fas fa-trophy"></i>
                                            </div>
                                            <p class="font-bold text-slate-900">Guest Hero</p>
                                            <p class="text-[10px] text-slate-400">10+ 5-Star reviews</p>
                                        </div>
                                        <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-1">
                                            <div
                                                class="w-10 h-10 mx-auto rounded-xl bg-dusty-50 text-dusty-dark border border-dusty-100 flex items-center justify-center text-lg font-bold">
                                                <i class="fas fa-certificate"></i>
                                            </div>
                                            <p class="font-bold text-slate-900">Safety Star</p>
                                            <p class="text-[10px] text-slate-400">100% HACCP pass</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 24h Hourly Sentiment -->
                            <div id="sub-social-climate" class="sub-panel sub-panel-social space-y-4">
                                <div class="card-clean p-6 space-y-3">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <h3 class="font-heading font-bold text-base text-slate-900">Shift Sentiment Dynamics by Hour (Rush Analysis)</h3>
                                            <p class="text-xs text-slate-500">Realtime monitoring of shift stress peaks to dispatch floor support</p>
                                        </div>
                                        <span class="badge-sage">Live Feed</span>
                                    </div>
                                    <div class="h-60 w-full">
                                        <canvas id="chart-hourly-sentiment"></canvas>
                                    </div>
                                </div>
                            </div>

                        </div>
