<?php
require_once __DIR__ . '/../controllers/SocialController.php';

$controller = new SocialController();

echo "Testing getLedger for Juan Dela Cruz (3a52667f-53cf-412a-b048-ef96eb407707):\n";
$resJuan = $controller->getLedger('3a52667f-53cf-412a-b048-ef96eb407707');
echo "Count: " . count($resJuan['data'] ?? []) . "\n";
print_r($resJuan['data']);

echo "\nTesting getLedger for emp-101:\n";
$res101 = $controller->getLedger('emp-101');
echo "Count: " . count($res101['data'] ?? []) . "\n";

echo "\nTesting getSocialOverview for Juan:\n";
$ov = $controller->getSocialOverview('3a52667f-53cf-412a-b048-ef96eb407707');
echo "KPIs:\n";
print_r($ov['data']['kpis'] ?? []);
