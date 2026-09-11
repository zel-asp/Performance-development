<?php
require_once __DIR__ . '/../controllers/PerformanceController.php';

$model = new PerformanceGoalModel();
$goals = $model->getGoalsByEmployee('emp-101');
echo "Current Goal 82 before test: retry_count=" . ($goals[0]['retry_count'] ?? 'null') . ", needs_training=" . ($goals[0]['needs_training'] ? 'true' : 'false') . "\n";

$controller = new PerformanceController();
$res = $controller->retryPlan(['employee_id' => 'emp-101']);
echo "retryPlan result: " . json_encode($res) . "\n";

$goalsAfter = $model->getGoalsByEmployee('emp-101');
echo "Current Goal 82 after test: retry_count=" . ($goalsAfter[0]['retry_count'] ?? 'null') . ", needs_training=" . ($goalsAfter[0]['needs_training'] ? 'true' : 'false') . "\n";

