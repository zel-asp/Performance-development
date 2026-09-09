<?php
require_once __DIR__ . '/../controllers/LmsController.php';

$controller = new LmsController();
LmsController::clearCache();

echo "Testing LmsController->getDocuments([]):\n";
$docs = $controller->getDocuments([]);
echo "Success: " . ($docs['success'] ? 'true' : 'false') . "\n";
echo "Count: " . count($docs['data'] ?? []) . "\n";
print_r($docs);

echo "\nTesting direct PDO query for lms_documents:\n";
try {
    $pdo = getSupabaseDb();
    if ($pdo) {
        $stmt = $pdo->query("SELECT id, title, category, department_id, status FROM public.lms_documents");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "Direct PDO count: " . count($rows) . "\n";
        print_r($rows);
    }
} catch (Throwable $e) {
    echo "PDO Error: " . $e->getMessage() . "\n";
}
