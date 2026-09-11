const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function main() {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const port = 9225;
    const chrome = spawn(chromePath, [
        '--headless=new',
        `--remote-debugging-port=${port}`,
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1200,800'
    ]);

    await new Promise(r => setTimeout(r, 1200));

    try {
        const tabs = await new Promise((resolve, reject) => {
            http.get(`http://127.0.0.1:${port}/json/list`, res => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
            }).on('error', reject);
        });

        const targetTab = tabs.find(t => t.type === 'page') || tabs[0];
        const wsUrl = targetTab.webSocketDebuggerUrl;

        const ws = new WebSocket(wsUrl);
        await new Promise(r => ws.onopen = r);

        let msgId = 1;
        function send(method, params = {}) {
            return new Promise(resolve => {
                const id = msgId++;
                const handler = (evt) => {
                    const res = JSON.parse(evt.data);
                    if (res.id === id) {
                        ws.removeEventListener('message', handler);
                        resolve(res.result);
                    }
                };
                ws.addEventListener('message', handler);
                ws.send(JSON.stringify({ id, method, params }));
            });
        }

        await send('Page.enable');
        await send('Runtime.enable');

        function navigateAndWait(url) {
            return new Promise(resolve => {
                const handler = (evt) => {
                    const msg = JSON.parse(evt.data);
                    if (msg.method === 'Page.loadEventFired') {
                        ws.removeEventListener('message', handler);
                        resolve();
                    }
                };
                ws.addEventListener('message', handler);
                send('Page.navigate', { url });
            });
        }

        await navigateAndWait('http://localhost:8080/login.php');

        await send('Runtime.evaluate', {
            expression: `
                localStorage.setItem('oxford_session_auth', 'true');
                localStorage.setItem('oxford_session_role', 'supervisor');
                localStorage.setItem('oxford_session_user', JSON.stringify({id: 'EMP002', name: 'Chef Marco Rossi', full_name: 'Chef Marco Rossi', role: 'supervisor', department: 'Food & Beverage', title: 'Executive Chef'}));
                localStorage.setItem('oxford_active_tab', 'performance');
                localStorage.setItem('oxford_active_subtab_perf', 'plan');
            `
        });

        await navigateAndWait('http://localhost:8080/index.php');
        await new Promise(r => setTimeout(r, 2000));

        await send('Runtime.evaluate', {
            expression: `
                if (typeof switchPillar === 'function') switchPillar('pillar-perf');
                if (typeof switchSubTab === 'function') switchSubTab('perf', 'plan');
            `
        });
        await new Promise(r => setTimeout(r, 1500));

        // Scroll page down so table is visible
        await send('Runtime.evaluate', {
            expression: `document.querySelector('#sub-perf-plan table').scrollIntoView({ block: 'start' });`
        });
        await new Promise(r => setTimeout(r, 600));

        // Scroll table horizontally
        const scrollInfo = await send('Runtime.evaluate', {
            returnByValue: true,
            expression: `
                (() => {
                    const scrollContainer = document.querySelector('#sub-perf-plan .overflow-x-auto');
                    if (scrollContainer) scrollContainer.scrollLeft = 350;
                    
                    const ths = Array.from(document.querySelectorAll('#sub-perf-plan table thead tr th')).slice(0, 6).map(th => {
                        const r = th.getBoundingClientRect();
                        return { text: th.innerText.trim(), left: r.left, width: r.width, right: r.right };
                    });
                    const tds = Array.from(document.querySelectorAll('#sub-perf-plan table tbody tr:first-child td')).slice(0, 6).map(td => {
                        const r = td.getBoundingClientRect();
                        return { text: td.innerText.trim().slice(0, 15), left: r.left, width: r.width, right: r.right };
                    });
                    return { scrollLeft: scrollContainer ? scrollContainer.scrollLeft : 0, ths, tds };
                })()
            `
        });

        console.log('Scroll Info:', JSON.stringify(scrollInfo.result.value, null, 2));

        // Capture screenshot of the viewport
        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('scratch/table_scrolled.png', Buffer.from(screenshot.data, 'base64'));
        console.log('Screenshot saved to scratch/table_scrolled.png');

        ws.close();
    } catch (e) {
        console.error(e);
    } finally {
        chrome.kill();
    }
}
main();
