<?php
require_once __DIR__ . '/../models/PerformanceGoalModel.php';

$model = new PerformanceGoalModel();
$goals = $model->getGoalsByEmployee('emp-101');
if (!empty($goals)) {
    $firstGoal = $goals[0];
    echo "Before update - Goal ID {$firstGoal['id']} retry_count: " . ($firstGoal['retry_count'] ?? 0) . " needs_training: " . ($firstGoal['needs_training'] ? 'true' : 'false') . "\n";
    
    $res = $model->incrementRetryCount($firstGoal['id'], 1);
    echo "After update - Goal ID {$firstGoal['id']} retry_count: " . ($res['retry_count'] ?? 0) . " needs_training: " . ($res['needs_training'] ? 'true' : 'false') . "\n";
} else {
    echo "No goals found for emp-101\n";
}
