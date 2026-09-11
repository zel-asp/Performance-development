const { spawn } = require('child_process');
const http = require('http');

async function main() {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const port = 9224;
    const chrome = spawn(chromePath, [
        '--headless=new',
        `--remote-debugging-port=${port}`,
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1280,800'
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
        console.log('Connecting to tab:', targetTab.url, targetTab.type);

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

        // Navigate to login.php
        await navigateAndWait('http://localhost:8080/login.php');

        // Set localStorage
        await send('Runtime.evaluate', {
            expression: `
                localStorage.setItem('oxford_session_auth', 'true');
                localStorage.setItem('oxford_session_role', 'supervisor');
                localStorage.setItem('oxford_session_user', JSON.stringify({id: 'EMP002', name: 'Chef Marco Rossi', full_name: 'Chef Marco Rossi', role: 'supervisor', department: 'Food & Beverage', title: 'Executive Chef'}));
                localStorage.setItem('oxford_active_tab', 'performance');
                localStorage.setItem('oxford_active_subtab_perf', 'plan');
            `
        });

        // Navigate to index.php
        await navigateAndWait('http://localhost:8080/index.php');
        await new Promise(r => setTimeout(r, 2000));

        // Switch to performance tab if needed
        await send('Runtime.evaluate', {
            expression: `
                if (typeof switchPillar === 'function') switchPillar('pillar-perf');
                if (typeof switchSubTab === 'function') switchSubTab('perf', 'plan');
            `
        });
        await new Promise(r => setTimeout(r, 2000));

        const pageState = await send('Runtime.evaluate', {
            returnByValue: true,
            expression: `document.body.innerHTML.length`
        });
        console.log('pageState:', pageState);

        // Inspect table columns before scroll
        const initialDims = await send('Runtime.evaluate', {
            returnByValue: true,
            expression: `
                (() => {
                    const table = document.querySelector('#sub-perf-plan table');
                    const ths = Array.from(document.querySelectorAll('#sub-perf-plan table thead tr th')).slice(0, 5).map(th => ({
                        text: th.innerText.trim(),
                        className: th.className,
                        rect: th.getBoundingClientRect(),
                        computedStyle: {
                            position: getComputedStyle(th).position,
                            left: getComputedStyle(th).left,
                            width: getComputedStyle(th).width,
                            zIndex: getComputedStyle(th).zIndex
                        }
                    }));
                    const tds = Array.from(document.querySelectorAll('#sub-perf-plan table tbody tr:first-child td')).slice(0, 5).map(td => ({
                        text: td.innerText.trim().slice(0, 20),
                        className: td.className,
                        rect: td.getBoundingClientRect(),
                        computedStyle: {
                            position: getComputedStyle(td).position,
                            left: getComputedStyle(td).left,
                            width: getComputedStyle(td).width,
                            zIndex: getComputedStyle(td).zIndex
                        }
                    }));
                    return { ths, tds };
                })()
            `
        });

        console.log('=== BEFORE SCROLL ===');
        console.log('THs:', JSON.stringify(initialDims.result.value.ths, null, 2));
        console.log('TDs:', JSON.stringify(initialDims.result.value.tds, null, 2));

        // Now scroll table container by 300px to the right
        await send('Runtime.evaluate', {
            expression: `
                const scrollContainer = document.querySelector('#sub-perf-plan .overflow-x-auto');
                if (scrollContainer) scrollContainer.scrollLeft = 300;
            `
        });
        await new Promise(r => setTimeout(r, 500));

        // Inspect after scroll
        const scrolledDims = await send('Runtime.evaluate', {
            returnByValue: true,
            expression: `
                (() => {
                    const scrollContainer = document.querySelector('#sub-perf-plan .overflow-x-auto');
                    const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
                    const ths = Array.from(document.querySelectorAll('#sub-perf-plan table thead tr th')).slice(0, 5).map(th => ({
                        text: th.innerText.trim(),
                        rect: th.getBoundingClientRect(),
                        computedLeft: getComputedStyle(th).left
                    }));
                    const tds = Array.from(document.querySelectorAll('#sub-perf-plan table tbody tr:first-child td')).slice(0, 5).map(td => ({
                        text: td.innerText.trim().slice(0, 20),
                        rect: td.getBoundingClientRect(),
                        computedLeft: getComputedStyle(td).left
                    }));
                    return { scrollLeft, ths, tds };
                })()
            `
        });

        console.log('=== AFTER SCROLL ===');
        console.log('ScrollLeft:', scrolledDims.result.value.scrollLeft);
        console.log('THs after scroll:', JSON.stringify(scrolledDims.result.value.ths, null, 2));
        console.log('TDs after scroll:', JSON.stringify(scrolledDims.result.value.tds, null, 2));

        ws.close();
    } catch (err) {
        console.error('Inspection error:', err);
    } finally {
        chrome.kill();
    }
}

main();
