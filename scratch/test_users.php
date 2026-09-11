<?php
require_once __DIR__ . '/../config/config.php';

$u = supabaseRequest('users', 'GET', null, true);
$e = supabaseRequest('employees', 'GET', null, true);

echo "=== USERS ===\n";
echo json_encode($u['data'], JSON_PRETTY_PRINT) . "\n\n";

echo "=== EMPLOYEES ===\n";
echo json_encode($e['data'], JSON_PRETTY_PRINT) . "\n\n";
