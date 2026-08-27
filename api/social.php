<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../controllers/SocialController.php';

$controller = new SocialController();
$action = $_GET['action'] ?? $_POST['action'] ?? 'get_overview';

try {
    switch ($action) {
        case 'get_overview':
            echo json_encode($controller->getSocialOverview());
            break;

        case 'give_recognition':
            $raw = file_get_contents('php://input');
            $payload = json_decode($raw, true) ?? $_POST;
            echo json_encode($controller->giveRecognition($payload));
            break;

        case 'react':
            $raw = file_get_contents('php://input');
            $payload = json_decode($raw, true) ?? $_POST;
            $postId = $payload['postId'] ?? '';
            $reactionType = $payload['reactionType'] ?? 'clap';
            echo json_encode($controller->addReaction($postId, $reactionType));
            break;

        case 'log_sentiment':
            $raw = file_get_contents('php://input');
            $payload = json_decode($raw, true) ?? $_POST;
            echo json_encode($controller->logShiftSentiment($payload));
            break;

        default:
            echo json_encode([
                'success' => false,
                'message' => 'Invalid Social API action: ' . htmlspecialchars($action)
            ]);
            break;
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
