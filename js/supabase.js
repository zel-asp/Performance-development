/**
 * Supabase Client Configuration (Frontend JavaScript)
 * Oxford Suites, Makati · HR3 System
 */

const SUPABASE_CONFIG = {
    url: 'https://jvxnrgcxegzhyaekxdok.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2eG5yZ2N4ZWd6aHlhZWt4ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NTczOTYsImV4cCI6MjEwMzEzMzM5Nn0.nPTeedzMfSnFgFhxb2PDoXiH_aW8Mmwt04ltYR7IznU'
};

// Initialize Supabase Client if supabase-js library is loaded
let supabaseClient = null;
if (typeof supabase !== 'undefined' && supabase.createClient) {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
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
