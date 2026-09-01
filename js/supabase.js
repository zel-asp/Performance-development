/**
 * Supabase Client & Instant In-Memory Realtime Engine (Frontend JavaScript)
 * Oxford Suites, Makati · HR3 System
 */

const SUPABASE_CONFIG = window.SUPABASE_CONFIG || {
    url: 'https://jvxnrgcxegzhyaekxdok.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2eG5yZ2N4ZWd6aHlhZWt4ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NTczOTYsImV4cCI6MjEwMzEzMzM5Nn0.nPTeedzMfSnFgFhxb2PDoXiH_aW8Mmwt04ltYR7IznU'
};

// Initialize Supabase Client
let supabaseClient = null;
if (typeof supabase !== 'undefined' && supabase.createClient) {
    try {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
            realtime: {
                params: {
                    eventsPerSecond: 20
                }
            }
        });
        window.supabaseClient = supabaseClient;
    } catch (e) {
        console.warn('[Supabase] Failed to initialize createClient:', e);
    }
}

/**
 * Helper to fetch data from Supabase REST API directly via fetch
 */
async function fetchSupabase(table, options = {}) {
    const { method = 'GET', body = null, headers = {} } = options;
    const url = `${SUPABASE_CONFIG.url}/rest/v1/${table}`;
    
    const requestHeaders = {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...headers
    };

    try {
        const response = await fetch(url, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : null
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || 'Supabase request failed');
        }

        return await response.json();
    } catch (err) {
        console.error(`[Supabase Error] ${table}:`, err);
        throw err;
    }
}
window.fetchSupabase = fetchSupabase;

/**
 * Realtime Instant In-Memory Synchronizer
 * Mutates state and re-renders visible components in 0ms without network fetches or loading indicators
 */
let realtimeChannels = {};

function initSupabaseRealtime() {
    if (!supabaseClient) return;

    try {
        // 1. Performance Goals Channel (Instant DOM Mutation)
        if (!realtimeChannels.performance_goals) {
            realtimeChannels.performance_goals = supabaseClient
                .channel('realtime_perf_goals')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'performance_goals' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};
                        const empId = newRow.employee_id || oldRow.employee_id;
                        if (!empId) return;

                        const isNT = (newRow.needs_training === true || newRow.needs_training === 1 || newRow.needs_training === '1' || newRow.needs_training === 'true' || newRow.needs_training === 't');
                        const isIT = (newRow.in_training === true || newRow.in_training === 1 || newRow.in_training === '1' || newRow.in_training === 'true' || newRow.in_training === 't');

                        // 1. Update in-memory employee goals_summary in Matrix table
                        const employees = window.dynamicCompetencyState?.employees || [];
                        const targetEmp = employees.find(e => e.id === empId);
                        if (targetEmp) {
                            targetEmp.goals_summary = targetEmp.goals_summary || {};
                            targetEmp.goals_summary.needs_training = isNT;
                            targetEmp.goals_summary.in_training = isIT;
                            targetEmp.goals_summary.status_label = isNT ? 'Needs Training' : (isIT ? 'In Training' : (newRow.status || null));
                            if (typeof renderCompetencyMatrixTable === 'function') {
                                renderCompetencyMatrixTable();
                            }
                        }

                        // 2. Update in-memory goals cache and live IDP / Objectives container if currently viewing this employee
                        const goalsCacheKey = `comp_goals_cache_${empId}`;
                        let cachedGoals = window.dynamicCompetencyState?.cache?.[goalsCacheKey];
                        if (Array.isArray(cachedGoals)) {
                            if (payload.eventType === 'INSERT') {
                                cachedGoals.unshift(newRow);
                            } else if (payload.eventType === 'UPDATE') {
                                const idx = cachedGoals.findIndex(g => g.id == newRow.id);
                                if (idx >= 0) cachedGoals[idx] = Object.assign({}, cachedGoals[idx], newRow);
                                else cachedGoals.unshift(newRow);
                            } else if (payload.eventType === 'DELETE') {
                                cachedGoals = cachedGoals.filter(g => g.id != oldRow.id);
                                window.dynamicCompetencyState.cache[goalsCacheKey] = cachedGoals;
                            }
                            try { sessionStorage.setItem(goalsCacheKey, JSON.stringify(cachedGoals)); } catch (e) {}
                        }

                        if (typeof activeCompetencyEmpKey !== 'undefined' && activeCompetencyEmpKey === empId) {
                            if (typeof renderIDPView === 'function') {
                                renderIDPView(false);
                            }
                        }
                    }
                )
                .subscribe();
        }

        // 2. Certificates Registry Channel (Instant DOM Mutation)
        if (!realtimeChannels.certificates) {
            realtimeChannels.certificates = supabaseClient
                .channel('realtime_certificates')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'certificates' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const oldRow = payload.old || {};
                        const associateId = newRow.associate_id || oldRow.associate_id;
                        if (!associateId) return;

                        const certsCacheKey = `comp_certs_cache_${associateId}`;
                        let cachedCerts = window.dynamicCompetencyState?.cache?.[certsCacheKey];
                        if (Array.isArray(cachedCerts)) {
                            if (payload.eventType === 'INSERT') {
                                cachedCerts.unshift(newRow);
                            } else if (payload.eventType === 'UPDATE') {
                                const idx = cachedCerts.findIndex(c => c.id == newRow.id);
                                if (idx >= 0) cachedCerts[idx] = Object.assign({}, cachedCerts[idx], newRow);
                                else cachedCerts.unshift(newRow);
                            } else if (payload.eventType === 'DELETE') {
                                cachedCerts = cachedCerts.filter(c => c.id != oldRow.id);
                                window.dynamicCompetencyState.cache[certsCacheKey] = cachedCerts;
                            }
                            try { sessionStorage.setItem(certsCacheKey, JSON.stringify(cachedCerts)); } catch (e) {}
                        }

                        if (typeof activeCompetencyEmpKey !== 'undefined' && activeCompetencyEmpKey === associateId) {
                            if (typeof renderCertificationsRoster === 'function') {
                                renderCertificationsRoster(false);
                            }
                        }
                    }
                )
                .subscribe();
        }

        // 3. Competency Evaluations Channel (Instant Score Update)
        if (!realtimeChannels.competency_evaluations) {
            realtimeChannels.competency_evaluations = supabaseClient
                .channel('realtime_competency_evals')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'competency_evaluations' },
                    (payload) => {
                        const newRow = payload.new || {};
                        const empId = newRow.employee_id;
                        const compId = newRow.competency_id;
                        if (!empId || !compId) return;

                        const employees = window.dynamicCompetencyState?.employees || [];
                        const targetEmp = employees.find(e => e.id === empId);
                        if (targetEmp && targetEmp.scores) {
                            const newScore = parseFloat(newRow.score || 0);
                            targetEmp.scores[compId] = {
                                score: newScore,
                                formatted: newScore.toFixed(2),
                                isApplicable: true
                            };
                            if (typeof renderCompetencyMatrixTable === 'function') {
                                renderCompetencyMatrixTable();
                            }
                        }

                        if (typeof activeCompetencyEmpKey !== 'undefined' && activeCompetencyEmpKey === empId) {
                            if (typeof renderSelectedEmployeeRadarView === 'function') {
                                renderSelectedEmployeeRadarView();
                            }
                        }
                    }
                )
                .subscribe();
        }

        // 4. Social Recognition Feed Channel
        if (!realtimeChannels.xp_transactions) {
            realtimeChannels.xp_transactions = supabaseClient
                .channel('realtime_xp_transactions')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'xp_transactions' },
                    (payload) => {
                        if (typeof renderRecognitionFeed === 'function') {
                            renderRecognitionFeed();
                        }
                    }
                )
                .subscribe();
        }

    } catch (e) {
        console.warn('[Supabase Realtime] Error initializing channels:', e);
    }
}
window.initSupabaseRealtime = initSupabaseRealtime;

// Auto-boot Realtime
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initSupabaseRealtime, 200));
} else {
    setTimeout(initSupabaseRealtime, 200);
}
