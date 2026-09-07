<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../controllers/SocialController.php';

$controller = new SocialController();
$action = $_GET['action'] ?? $_POST['action'] ?? 'get_overview';

try {
    switch ($action) {
        case 'get_overview':
            $empId = $_GET['employeeId'] ?? ($_GET['employee_id'] ?? null);
            $filterType = $_GET['filterType'] ?? ($_GET['filter_type'] ?? null);
            $filterVal = $_GET['filterValue'] ?? ($_GET['filter_value'] ?? null);
            echo json_encode($controller->getSocialOverview($empId, $filterType, $filterVal));
            break;

        case 'get_roster':
            echo json_encode($controller->getRoster());
            break;

        case 'get_ledger':
            $empId = $_GET['employeeId'] ?? ($_GET['employee_id'] ?? null);
            echo json_encode($controller->getLedger($empId));
            break;

        case 'get_top_champions':
            echo json_encode($controller->getTop5Champions());
            break;

        case 'get_badges':
            $empId = $_GET['employeeId'] ?? ($_GET['employee_id'] ?? null);
            echo json_encode($controller->getBadges($empId));
            break;

        case 'give_recognition':
            $raw = file_get_contents('php://input');
            $payload = json_decode($raw, true) ?? $_POST;
            echo json_encode($controller->giveRecognition($payload));
            break;

        case 'trigger_lms_grant':
            $raw = file_get_contents('php://input');
            $payload = json_decode($raw, true) ?? $_POST;
            echo json_encode($controller->triggerLmsQuizPass($payload));
            break;

        case 'react':
            $raw = file_get_contents('php://input');
            $payload = json_decode($raw, true) ?? $_POST;
            $postId = $payload['postId'] ?? ($payload['post_id'] ?? '');
            $reactionType = $payload['reactionType'] ?? ($payload['reaction_type'] ?? 'clap');
            $userId = $payload['userId'] ?? ($payload['user_id'] ?? ($payload['employeeId'] ?? ($payload['employee_id'] ?? null)));
            echo json_encode($controller->addReaction($postId, $reactionType, $userId));
            break;

        case 'add_comment':
            $raw = file_get_contents('php://input');
            $payload = json_decode($raw, true) ?? $_POST;
            $postId = $payload['postId'] ?? ($payload['post_id'] ?? '');
            echo json_encode($controller->addComment($postId, $payload));
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
