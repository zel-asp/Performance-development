<?php
require_once __DIR__ . '/../models/PerformanceGoalModel.php';

$model = new PerformanceGoalModel();
$res = $model->incrementRetryCount(38, 1);
echo "Updated goal 38:\n";
print_r($res);
