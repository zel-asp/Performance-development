<?php
require_once __DIR__ . '/../config/config.php';

$res = supabaseRequest('performance_tasks?select=*', 'GET', null, true);
echo "Count: " . count($res['data']) . "\n";
foreach ($res['data'] as $t) {
    echo "Task: {$t['id']} | title: {$t['title']} | status: {$t['status']} | goal_id: {$t['goal_id']}\n";
}
