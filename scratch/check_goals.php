<?php
require_once __DIR__ . '/../controllers/LmsController.php';

echo "=== PERFORMANCE GOALS ===\n";
$goalsRes = supabaseRequest('performance_goals?select=id,employee_id,title,status,target_date&order=created_at.desc&limit=10', 'GET', null, true);
print_r($goalsRes['data'] ?? []);

echo "\n=== PERFORMANCE TASKS ===\n";
$tasksRes = supabaseRequest('performance_tasks?select=id,goal_id,employee_id,title,task_type&order=created_at.desc&limit=10', 'GET', null, true);
print_r($tasksRes['data'] ?? []);

echo "\n=== LMS PRESCRIBED ===\n";
$presRes = supabaseRequest('lms_prescribed?select=id,goal_id,lms_id,employee,progress,status&order=created_at.desc&limit=10', 'GET', null, true);
print_r($presRes['data'] ?? []);
