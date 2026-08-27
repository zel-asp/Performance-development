<?php
require_once __DIR__ . '/../config/config.php';

echo "--- Supabase performance_goals table ---\n";
$pgRes = supabaseRequest('performance_goals', 'GET', null, true);
echo "Status: " . $pgRes['status'] . "\n";
echo "Count: " . (is_array($pgRes['data']) ? count($pgRes['data']) : 0) . "\n";
if (is_array($pgRes['data'])) {
    foreach ($pgRes['data'] as $pg) {
        echo "  - [{$pg['id']}] Emp: {$pg['employee_id']}, Goal: {$pg['title']}, Status: {$pg['status']}, RetryCount: " . ($pg['retry_count'] ?? 0) . "\n";
    }
}

echo "\n--- Supabase evaluations table ---\n";
$evalRes = supabaseRequest('evaluations', 'GET', null, true);
echo "Status: " . $evalRes['status'] . "\n";
echo "Count: " . (is_array($evalRes['data']) ? count($evalRes['data']) : 0) . "\n";
if (is_array($evalRes['data'])) {
    foreach (array_slice($evalRes['data'], 0, 5) as $ev) {
        echo "  - [{$ev['id']}] Emp: {$ev['employee_id']}, Rating: " . ($ev['overall_rating'] ?? 'N/A') . ", Status: " . ($ev['status'] ?? 'N/A') . "\n";
    }
}
