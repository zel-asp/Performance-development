const { spawn } = require('child_process');
const http = require('http');

async function testModalRealtime() {
    const port = 9228;
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
        '--headless=new',
        '--remote-debugging-port=' + port,
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1280,900'
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
        await new Promise(r => setTimeout(r, 800));
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
        await new Promise(r => setTimeout(r, 2500));
        
        // Check initial state and open modal
        const testRes = await send('Runtime.evaluate', {
            returnByValue: true,
            awaitPromise: true,
            expression: `
                (async () => {
                    if (typeof switchPillar === 'function') switchPillar('pillar-perf');
                    if (typeof switchSubTab === 'function') switchSubTab('perf', 'plan');
                    if (typeof loadAndRenderPlanningGoals === 'function') {
                        await loadAndRenderPlanningGoals();
                    } else {
                        await new Promise(r => setTimeout(r, 1200));
                    }

                    const sampleGoal = (window.dbGoals && window.dbGoals.length > 0) ? window.dbGoals[0] : null;
                    if (!sampleGoal) {
                        return { success: false, reason: 'No goals found in window.dbGoals' };
                    }

                    // Open Objective Details Modal
                    openViewGoalModal(sampleGoal.id);
                    await new Promise(r => setTimeout(r, 400));

                    const modal = document.getElementById('modal-view-goal');
                    const isVisibleBefore = modal && !modal.classList.contains('hidden');
                    const initialTasks = Array.from(modal.querySelectorAll('#view-modal-goals-list label')).map(l => l.textContent.trim());
                    const initialScrollTop = document.getElementById('view-modal-scroll-body')?.scrollTop || 0;

                    // Now simulate real-time task update:
                    // Push a simulated task into window.dbGoals[0].tasks
                    sampleGoal.tasks = sampleGoal.tasks || [];
                    const newTask = {
                        id: 'TEST_TASK_' + Date.now(),
                        goal_id: sampleGoal.id,
                        title: 'Realtime Verification Task',
                        task_type: 'specific',
                        status: 'pending',
                        target_date: '2026-09-30'
                    };
                    sampleGoal.tasks.push(newTask);

                    // Call triggerPerformanceRealtimeSync
                    triggerPerformanceRealtimeSync('performance_tasks', sampleGoal.employee_id);
                    await new Promise(r => setTimeout(r, 400));

                    const isVisibleAfter = modal && !modal.classList.contains('hidden');
                    const tasksAfter = Array.from(modal.querySelectorAll('#view-modal-goals-list label')).map(l => l.textContent.trim());
                    const hasNewTask = tasksAfter.some(txt => txt.includes('Realtime Verification Task'));
                    const targetIdPreserved = window.currentViewGoalTargetId === sampleGoal.id;

                    return {
                        success: true,
                        goalId: sampleGoal.id,
                        goalTitle: sampleGoal.title,
                        isVisibleBefore,
                        isVisibleAfter,
                        targetIdPreserved,
                        initialCount: initialTasks.length,
                        hasNewTask,
                        tasksAfterCount: tasksAfter.length
                    };
                })()
            `
        });

        console.log('Test Result:', JSON.stringify(testRes, null, 2));
    } catch (e) {
        console.error('Error:', e);
    } finally {
        chrome.kill();
    }
}

testModalRealtime();
