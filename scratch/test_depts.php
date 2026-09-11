<?php
require_once __DIR__ . '/../config/config.php';

$d = supabaseRequest('departments', 'GET', null, true);
echo "=== DEPARTMENTS ===\n";
echo json_encode($d['data'], JSON_PRETTY_PRINT) . "\n\n";
