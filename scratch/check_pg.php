<?php
require_once __DIR__ . '/../config/config.php';

$res = supabaseRequest('performance_goals', 'GET', null, true);
echo "Status: " . $res['status'] . "\n";
print_r($res['data'] ?? $res);
