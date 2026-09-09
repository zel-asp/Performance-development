<?php
require_once __DIR__ . '/../controllers/SocialController.php';

$c = new SocialController();

// 1. Initial State
echo "=== Step 1: Query initial sentiments ===\n";
$init = $c->getShiftSentiments();
echo "Total initial sentiments: " . count($init) . "\n";

// 2. Check Maria Santos (emp-101) today
echo "\n=== Step 2: Check today log for emp-101 before insert ===\n";
$mariaCheckBefore = $c->getUserTodaySentiment('emp-101');
echo "Maria hasLogged before: " . ($mariaCheckBefore['hasLogged'] ? 'true' : 'false') . "\n";

// 3. Simulate logging sentiment for Maria Santos
echo "\n=== Step 3: Log quick sentiment for Maria Santos ===\n";
$logRes = $c->logShiftSentiment([
    'id' => 'sent-test-' . time(),
    'employeeId' => 'emp-101',
    'employeeName' => 'Maria Santos',
    'department' => 'Front Office',
    'sentimentScore' => 5,
    'shiftPeriod' => 'Peak Rush Window',
    'sentimentType' => 'Positive',
    'note' => 'Quick mood log: Smooth & Energized'
]);
echo "Log result: " . json_encode($logRes) . "\n";

// 4. Verify Maria Santos today after insert
echo "\n=== Step 4: Check today log for emp-101 after insert ===\n";
$mariaCheckAfter = $c->getUserTodaySentiment('emp-101');
echo "Maria hasLogged after: " . ($mariaCheckAfter['hasLogged'] ? 'true' : 'false') . "\n";
print_r($mariaCheckAfter['data']);

// 5. Verify total sentiments and Shift Climate breakdown
echo "\n=== Step 5: Verify Total Sentiments and Distribution ===\n";
$allAfter = $c->getShiftSentiments();
echo "Total sentiments now: " . count($allAfter) . "\n";
$total = count($allAfter);
$smooth = 0; $manageable = 0; $friction = 0;
foreach ($allAfter as $s) {
    $score = (int)($s['sentiment_score'] ?? 4);
    if ($score >= 4) $smooth++;
    elseif ($score == 3) $manageable++;
    else $friction++;
}
echo "Smooth: {$smooth} (" . round(($smooth / $total) * 100, 1) . "%)\n";
echo "Manageable: {$manageable} (" . round(($manageable / $total) * 100, 1) . "%)\n";
echo "Friction: {$friction} (" . round(($friction / $total) * 100, 1) . "%)\n";
