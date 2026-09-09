<?php
require_once __DIR__ . '/../config/config.php';
$conn = getSupabaseDb();
$stmt = $conn->query("SELECT id, employee_id, title, status, retry_count, needs_training, final_rating FROM performance_goals");
$goals = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "Goals count: " . count($goals) . "\n";
foreach ($goals as $g) {
    echo "Goal {$g['id']}: emp={$g['employee_id']}, status={$g['status']}, retry={$g['retry_count']}, needs_training={$g['needs_training']}, final_rating={$g['final_rating']}\n";
}

$stmt2 = $conn->query("SELECT id, employee_id, status, calibrated_score, new_calibrated_score, final_rating FROM performance_evaluations");
$evals = $stmt2->fetchAll(PDO::FETCH_ASSOC);
echo "\nEvals count: " . count($evals) . "\n";
foreach ($evals as $e) {
    echo "Eval {$e['id']}: emp={$e['employee_id']}, status={$e['status']}, calibrated={$e['calibrated_score']}, new_calibrated={$e['new_calibrated_score']}, final={$e['final_rating']}\n";
}
