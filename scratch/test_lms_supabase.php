<?php
require_once __DIR__ . '/../config/config.php';
$e = supabaseRequest('employees', 'GET');
echo "Employees in DB: " . (is_array($e['data'] ?? null) ? count($e['data']) : 0) . "\n";
if (is_array($e['data'] ?? null)) {
    foreach ($e['data'] as $emp) {
        echo " - [{$emp['id']}] {$emp['full_name']} | Title: {$emp['title']} | Role: {$emp['role']} | Dept: " . ($emp['department_id'] ?? 'null') . "\n";
    }
}
