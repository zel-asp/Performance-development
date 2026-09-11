const { spawn } = require('child_process');
const http = require('http');

async function check() {
    const port = 9227;
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=' + port,
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1200,800'
    ]);
    await new Promise(r => setTimeout(r, 1200));

    try {
        const tabs = await new Promise((res, rej) => {
            http.get('http://127.0.0.1:' + port + '/json/list', r => {
                let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
            }).on('error', rej);
        });
        const ws = new WebSocket((tabs.find(t => t.type === 'page') || tabs[0]).webSocketDebuggerUrl);
        await new Promise(r => ws.onopen = r);
        let id = 1;
        function send(m, p = {}) {
            return new Promise(res => {
                const curId = id++;
                const h = (e) => {
                    const r = JSON.parse(e.data);
                    if (r.id === curId) { ws.removeEventListener('message', h); res(r.result); }
                };
                ws.addEventListener('message', h);
                ws.send(JSON.stringify({ id: curId, method: m, params: p }));
            });
        }
        await send('Page.enable');
        await send('Runtime.enable');
        
        await send('Page.navigate', { url: 'http://localhost:8080/login.php' });
        await new Promise(r => setTimeout(r, 1000));
        await send('Runtime.evaluate', {
            expression: `
                localStorage.setItem('oxford_session_auth', 'true');
                localStorage.setItem('oxford_session_role', 'supervisor');
                localStorage.setItem('oxford_session_user', JSON.stringify({id: 'EMP002', name: 'Chef Marco Rossi', full_name: 'Chef Marco Rossi', role: 'supervisor', department: 'Food & Beverage'}));
                localStorage.setItem('oxford_active_tab', 'performance');
                localStorage.setItem('oxford_active_subtab_perf', 'plan');
            `
        });
        await send('Page.navigate', { url: 'http://localhost:8080/index.php' });
        await new Promise(r => setTimeout(r, 2000));
        
        await send('Runtime.evaluate', {
            expression: `
                if (typeof switchPillar === 'function') switchPillar('pillar-perf');
                if (typeof switchSubTab === 'function') switchSubTab('perf', 'plan');
                window.planningStatusFilter = 'all';
                const sel = document.getElementById('filter-planning-status');
                if (sel) sel.value = 'all';
                renderPlanningRosterTable();
            `
        });
        await new Promise(r => setTimeout(r, 1000));

        const res = await send('Runtime.evaluate', {
            returnByValue: true,
            expression: `
                (() => {
                    const ths = Array.from(document.querySelectorAll('#sub-perf-plan table thead tr th')).slice(0, 3).map(th => {
                        const cs = window.getComputedStyle(th);
                        return { text: th.innerText.trim(), bg: cs.backgroundColor, pos: cs.position, z: cs.zIndex, left: cs.left };
                    });
                    const tds = Array.from(document.querySelectorAll('#sub-perf-plan table tbody tr:first-child td')).slice(0, 3).map(td => {
                        const cs = window.getComputedStyle(td);
                        return { text: td.innerText.trim(), bg: cs.backgroundColor, pos: cs.position, z: cs.zIndex, left: cs.left, inlineBg: td.style.backgroundColor };
                    });
                    const tr = document.querySelector('#sub-perf-plan table tbody tr:first-child');
                    const trCs = tr ? window.getComputedStyle(tr).backgroundColor : null;
                    const tbody = document.querySelector('#sub-perf-plan table tbody');
                    const tbodyCs = tbody ? window.getComputedStyle(tbody).backgroundColor : null;
                    const table = document.querySelector('#sub-perf-plan table');
                    const tableCs = table ? window.getComputedStyle(table).backgroundColor : null;
                    return { ths, tds, trCs, tbodyCs, tableCs };
                })()
            `
        });
        console.log('Computed styles:', JSON.stringify(res.result.value, null, 2));
        ws.close();
    } catch(e) { console.error(e); }
    finally { chrome.kill(); }
}
check();
