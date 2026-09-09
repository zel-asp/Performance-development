<?php
require_once __DIR__ . '/../controllers/SocialController.php';
$c = new SocialController();
$res = $c->getSocialOverview();
echo "Recognitions: " . count($res['data']['recognitions']) . "\n";
echo "Sentiments: " . count($res['data']['sentiments']) . "\n";
print_r($res['data']['sentiments']);
