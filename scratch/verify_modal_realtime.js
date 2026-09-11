const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function test() {
    const port = 9295;
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        `--remote-debugging-port=${port}`,
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1280,900'
    ]);

    await new Promise(r => setTimeout(r, 1200));

    try {
        const tabs = await new Promise((res, rej) => {
            http.get(`http://127.0.0.1:${port}/json/list`, r => {
                let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
            }).on('error', rej);
        });

        const targetTab = tabs.find(t => t.type === 'page') || tabs[0];
        const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
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

        // Execute check on Objective Details modal
        const testRes = await send('Runtime.evaluate', {
            returnByValue: true,
            awaitPromise: true,
            expression: `
                (async () => {
                    const sampleGoal = (window.dbGoals && window.dbGoals.length > 0) ? window.dbGoals[0] : null;
                    if (!sampleGoal) {
                        return { success: false, reason: 'window.dbGoals is empty' };
                    }

                    // Open Objective Details modal
                    openViewGoalModal(sampleGoal.id);
                    await new Promise(r => setTimeout(r, 400));

                    const modal = document.getElementById('modal-view-goal');
                    const isVisible = modal && !modal.classList.contains('hidden');
                    
                    // Search for any "Add Specific Task" buttons inside the modal
                    const addButtons = Array.from(modal.querySelectorAll('button')).filter(b => b.innerText.includes('Add Specific Task'));
                    
                    return {
                        success: true,
                        goalId: sampleGoal.id,
                        goalTitle: sampleGoal.title,
                        isModalVisible: isVisible,
                        addSpecificTaskButtonsFound: addButtons.length,
                        hasAddSpecificTaskButton: addButtons.length > 0
                    };
                })()
            `
        });

        console.log('RESULT:', JSON.stringify(testRes, null, 2));

        const ss = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:\\clients\\Etulle\\scratch\\modal_realtime_verified.png', Buffer.from(ss.data, 'base64'));
        console.log('Screenshot saved.');
    } catch (e) {
        console.error('Error during execution:', e);
    } finally {
        chrome.kill();
    }
}

test();
