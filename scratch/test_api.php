<?php
require_once __DIR__ . '/../controllers/SocialController.php';
$c = new SocialController();
$all = $c->getShiftSentiments();
echo "All Sentiments: " . count($all) . "\n";
print_r($all);

$todayCheck = $c->getUserTodaySentiment('3a52667f-53cf-412a-b048-ef96eb407707');
echo "Today Check for Juan: " . json_encode($todayCheck) . "\n";

$todayCheck2 = $c->getUserTodaySentiment('emp-101');
echo "Today Check for Maria: " . json_encode($todayCheck2) . "\n";
