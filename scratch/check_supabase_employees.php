<?php
require_once __DIR__ . '/../config/config.php';

echo "--- Checking Supabase public.employees table ---\n";
$res = supabaseRequest('employees', 'GET', null, true);
echo "Status: " . $res['status'] . "\n";
echo "Data: " . json_encode($res['data']) . "\n";
if (is_array($res['data'])) {
    echo "Count: " . count($res['data']) . "\n";
    foreach ($res['data'] as $e) {
        echo "  - [{$e['id']}] {$e['full_name']} (code: {$e['employee_code']}, title: {$e['title']}, dept_id: {$e['department_id']})\n";
    }
}
