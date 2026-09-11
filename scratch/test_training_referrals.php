<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../controllers/TrainingController.php';

$tc = new TrainingController();

echo "=== 1. ADMIN / ASSOCIATE VIEW (no filter or emp-101) ===\n";
$b1 = $tc->getBootstrapData(['role' => 'Associate', 'userId' => 'emp-101']);
echo "Total Needs: " . count($b1['data']['needs']) . "\n";
foreach ($b1['data']['needs'] as $n) {
    echo "  - [{$n['id']}] {$n['title']} | Dept: {$n['dept']} | Associate: {$n['associate_name']} | Status: {$n['status']} | Goal: " . ($n['target_goal_id'] ?? 'none') . "\n";
}

echo "\n=== 2. SUPERVISOR VIEW FOR FRONT OFFICE (emp-101 / supervisor) ===\n";
$b2 = $tc->getBootstrapData(['role' => 'Supervisor', 'userId' => 'b7e1a2c4-9d3f-4a1e-8c6b-1f2e3d4a5b6c']); // Front Desk Associate / Housekeeping
echo "Total Needs: " . count($b2['data']['needs']) . "\n";

echo "\n=== 3. GENERAL GET_NEEDS FOR ALL ===\n";
$b3 = $tc->getNeeds([]);
echo "Total Needs: " . count($b3['data']) . "\n";
foreach ($b3['data'] as $n) {
    echo "  - [{$n['id']}] {$n['title']} | Dept: {$n['dept']} | Associate: {$n['associate_name']} | Status: {$n['status']} | Goal: " . ($n['target_goal_id'] ?? 'none') . "\n";
}
