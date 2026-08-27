<?php
require_once __DIR__ . '/../config/config.php';

echo "--- 1. Testing Supabase REST API ---\n";
$resDepts = supabaseRequest('departments', 'GET', null, true);
echo "Departments status: " . $resDepts['status'] . "\n";
echo "Departments data: " . json_encode($resDepts['data']) . "\n\n";

$resComps = supabaseRequest('competencies', 'GET', null, true);
echo "Competencies status: " . $resComps['status'] . "\n";
echo "Competencies count: " . (is_array($resComps['data']) ? count($resComps['data']) : 0) . "\n";
if (is_array($resComps['data'])) {
    foreach ($resComps['data'] as $c) {
        echo "  - [{$c['id']}] {$c['name']} (key: {$c['key']}, scope: " . ($c['scope'] ?? 'N/A') . ", dept_id: " . ($c['department_id'] ?? 'null') . ", pos: " . ($c['position'] ?? 'null') . ")\n";
    }
} else {
    echo "Error: " . json_encode($resComps) . "\n";
}

$resAssess = supabaseRequest('competency_assessments', 'GET', null, true);
echo "\nCompetency assessments status: " . $resAssess['status'] . "\n";
echo "Competency assessments count: " . (is_array($resAssess['data']) ? count($resAssess['data']) : 0) . "\n";

$resUsers = supabaseRequest('users', 'GET', null, true);
echo "\nUsers status: " . $resUsers['status'] . "\n";
echo "Users count: " . (is_array($resUsers['data']) ? count($resUsers['data']) : 0) . "\n";
if (is_array($resUsers['data'])) {
    foreach ($resUsers['data'] as $u) {
        echo "  - [{$u['id']}] {$u['full_name']} ({$u['title']} - {$u['department']})\n";
    }
}
