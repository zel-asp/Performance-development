<?php
require_once __DIR__ . '/../controllers/PerformanceController.php';
$c = new PerformanceController();
$res = $c->getPlanningData([]);
echo "Goals count: " . count($res['data']['goals'] ?? []) . "\n";
foreach ($res['data']['goals'] as $g) {
    echo "Goal ID: " . $g['id'] . ", title: " . $g['title'] . ", tasks count: " . count($g['tasks'] ?? []) . "\n";
    if (!empty($g['tasks'])) {
        foreach ($g['tasks'] as $t) {
            echo "  - Task: " . $t['title'] . " (type: " . ($t['task_type'] ?? 'N/A') . ", status: " . ($t['status'] ?? 'N/A') . ")\n";
        }
    }
}
