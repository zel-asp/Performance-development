<?php
require_once __DIR__ . '/../controllers/LmsController.php';
$c = new LmsController();
$res = $c->getNeedsAnalysisData();
echo "Success: " . ($res['success'] ? 'true' : 'false') . "\n";
echo "Categories count: " . count($res['data']['categories']) . "\n";
foreach ($res['data']['categories'] as $cat) {
    echo " - [{$cat['category']}] {$cat['display_name']} | Docs: {$cat['documents_count']} | Enrolled: {$cat['enrolled_count']} | Is Empty: " . ($cat['is_empty'] ? 'yes' : 'no') . "\n";
}
