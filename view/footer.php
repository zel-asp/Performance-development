</div>
                </main>

            </div>

        </div>

        <!-- ===== STREAMLINED MOBILE BOTTOM NAVIGATION ===== -->
        <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 flex justify-around py-2 px-1 z-30 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]"
            id="mobile-nav">
            <button onclick="switchPillar('dashboard')"
                class="mobile-nav-btn active flex flex-col items-center justify-center py-1 px-3 rounded-full text-[10px] text-primary font-bold transition active:scale-95"
                data-pillar="dashboard">
                <i class="fas fa-chart-pie text-base mb-0.5"></i>
                <span>Home</span>
            </button>
            <button onclick="switchPillar('pillar-perf')"
                class="mobile-nav-btn flex flex-col items-center justify-center py-1 px-3 rounded-full text-[10px] text-slate-400 font-medium transition active:scale-95"
                data-pillar="pillar-perf">
                <i class="fas fa-bullseye text-base mb-0.5"></i>
                <span>Perf</span>
            </button>
            <button onclick="switchPillar('pillar-comp')"
                class="mobile-nav-btn flex flex-col items-center justify-center py-1 px-3 rounded-full text-[10px] text-slate-400 font-medium transition active:scale-95"
                data-pillar="pillar-comp">
                <i class="fas fa-cubes text-base mb-0.5"></i>
                <span>Comp</span>
            </button>
            <button onclick="switchPillar('pillar-lms')"
                class="mobile-nav-btn flex flex-col items-center justify-center py-1 px-3 rounded-full text-[10px] text-slate-400 font-medium transition active:scale-95"
                data-pillar="pillar-lms">
                <i class="fas fa-graduation-cap text-base mb-0.5"></i>
                <span>LMS</span>
            </button>
            <button onclick="switchPillar('pillar-social')"
                class="mobile-nav-btn flex flex-col items-center justify-center py-1 px-3 rounded-full text-[10px] text-slate-400 font-medium transition active:scale-95"
                data-pillar="pillar-social">
                <i class="fas fa-trophy text-base mb-0.5"></i>
                <span>Social</span>
            </button>
</div>
