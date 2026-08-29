<?php
require_once __DIR__ . '/../controllers/LmsController.php';

echo "=== BACKFILLING NULL GOAL_ID IN LMS_PRESCRIBED & PERFORMANCE_TASKS ===\n";

// 1. Fetch all goals
$goalsRes = supabaseRequest('performance_goals?select=id,employee_id,status,created_at&order=created_at.desc', 'GET', null, true);
$goals = is_array($goalsRes['data'] ?? null) ? $goalsRes['data'] : [];

$empGoalMap = [];
foreach ($goals as $g) {
    $e = strtolower(trim($g['employee_id'] ?? ''));
    if (!isset($empGoalMap[$e])) {
        $empGoalMap[$e] = (int)$g['id'];
    }
}

// 2. Backfill lms_prescribed
$presRes = supabaseRequest('lms_prescribed?select=id,goal_id,employee', 'GET', null, true);
$presList = is_array($presRes['data'] ?? null) ? $presRes['data'] : [];

foreach ($presList as $p) {
    if (empty($p['goal_id'])) {
        $e = strtolower(trim($p['employee'] ?? ''));
        $targetGoal = $empGoalMap[$e] ?? ($empGoalMap['emp-101'] ?? 36);
        echo "Updating lms_prescribed {$p['id']} (emp: {$p['employee']}) -> goal_id = {$targetGoal}\n";
        supabaseRequest('lms_prescribed?id=eq.' . urlencode($p['id']), 'PATCH', ['goal_id' => $targetGoal], true);
    }
}

// 3. Backfill performance_tasks
$tasksRes = supabaseRequest('performance_tasks?select=id,goal_id,employee_id', 'GET', null, true);
$tasksList = is_array($tasksRes['data'] ?? null) ? $tasksRes['data'] : [];

foreach ($tasksList as $t) {
    if (empty($t['goal_id'])) {
        $e = strtolower(trim($t['employee_id'] ?? ''));
        $targetGoal = $empGoalMap[$e] ?? ($empGoalMap['emp-101'] ?? 36);
        echo "Updating performance_tasks {$t['id']} (emp: {$t['employee_id']}) -> goal_id = {$targetGoal}\n";
        supabaseRequest('performance_tasks?id=eq.' . urlencode($t['id']), 'PATCH', ['goal_id' => $targetGoal], true);
    }
}

echo "=== DONE BACKFILLING ===\n";
