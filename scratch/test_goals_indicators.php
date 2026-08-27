<?php
require_once __DIR__ . '/../controllers/CompetencyController.php';

$controller = new CompetencyController();
$res = $controller->getMatrixData(['department' => 'all']);

echo "=======================================================\n";
echo "TESTING GOAL STATUS & NEEDS TRAINING INDICATORS\n";
echo "=======================================================\n";

foreach ($res['employees'] as $emp) {
    $gs = $emp['goals_summary'];
    echo "Associate: {$emp['full_name']} ({$emp['title']})\n";
    echo "  - Total Goals: {$gs['total_goals']}\n";
    echo "  - Max Retries: {$gs['max_retries']}\n";
    echo "  - Needs Training: " . ($gs['needs_training'] ? 'YES (FLAGGED)' : 'NO') . "\n";
    echo "  - Has Unmet Objectives: " . ($gs['has_unmet_objectives'] ? 'YES' : 'NO') . "\n";
    echo "  - Status Label: {$gs['status_label']}\n\n";
}
