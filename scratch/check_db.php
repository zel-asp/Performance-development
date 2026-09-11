<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/TrainingNeedModel.php';

$needModel = new TrainingNeedModel();
$needsFromModel = $needModel->getNeeds();

$rawNeeds = supabaseRequest('training_needs', 'GET', null, true);
$rawEvals = supabaseRequest('training_evaluations', 'GET', null, true);
$rawGoals = supabaseRequest('performance_goals', 'GET', null, true);

echo "=== RAW TRAINING NEEDS ===\n";
echo json_encode($rawNeeds['data'], JSON_PRETTY_PRINT) . "\n\n";

echo "=== NEEDS FROM MODEL (getNeeds) ===\n";
echo json_encode($needsFromModel, JSON_PRETTY_PRINT) . "\n\n";

echo "=== RAW EVALUATIONS ===\n";
echo json_encode($rawEvals['data'], JSON_PRETTY_PRINT) . "\n\n";
