<?php
require_once __DIR__ . '/../config/config.php';

$res = supabaseRequest('lms_prescribed?id=eq.lms-presc-8e8d4617', 'PATCH', [
    'progress' => 100
], true);

echo "Update result: " . json_encode($res, JSON_PRETTY_PRINT) . PHP_EOL;
