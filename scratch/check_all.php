<?php
require_once __DIR__ . '/../controllers/LmsController.php';

$allPres = supabaseRequest('lms_prescribed?select=id,goal_id,lms_id,employee,created_at', 'GET', null, true);
echo "LMS PRESCRIBED ALL:\n";
print_r($allPres['data'] ?? []);

$allTasks = supabaseRequest('performance_tasks?select=id,goal_id,employee_id,title,created_at', 'GET', null, true);
echo "PERFORMANCE TASKS ALL:\n";
print_r($allTasks['data'] ?? []);
