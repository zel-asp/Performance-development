<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/PerformanceController.php';

// Parse incoming request
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Parse JSON body or form data
$rawBody = file_get_contents('php://input');
$jsonBody = !empty($rawBody) ? json_decode($rawBody, true) : [];
$payload = array_merge($_GET, $_POST, is_array($jsonBody) ? $jsonBody : []);

// If action is in payload body
if (empty($action) && isset($payload['action'])) {
    $action = $payload['action'];
}

$controller = new PerformanceController();

try {
    switch ($action) {
        // 1. Get Goals List
        case 'get_goals':
            $response = $controller->getGoals($payload);
            break;

        // 2. Set Performance Objective & Insert into DB
        case 'create_goal':
        case 'set_goal':
            $response = $controller->createGoal($payload);
            break;

        // 3. Update Goal Status (Approve / Needs Revision)
        case 'update_goal_status':
        case 'approve_goal':
            $response = $controller->updateGoalStatus($payload);
            break;

        // 4. Revise / Update Goal Objectives
        case 'update_goal':
        case 'revise_goal':
            $response = $controller->updateGoal($payload);
            break;

        // 4b. Delete / Bulk Delete Goals
        case 'delete_goal':
            $response = $controller->deleteGoal($payload);
            break;

        case 'bulk_delete_goals':
            $response = $controller->bulkDeleteGoals($payload);
            break;

        // 4c. Supervisors / Leaders for Goal Assignment
        case 'get_supervisors':
            $response = $controller->getSupervisors($payload);
            break;

        // 4d. Award Performance XP to xp_ledger
        case 'award_performance_xp':
            $response = $controller->awardPerformanceXP($payload);
            break;

        // 4e. Mark Goal as Completed
        case 'mark_goal_completed':
            $response = $controller->markGoalCompleted($payload);
            break;

        // 5. Planning Tab Data & Aggregates
        case 'get_planning_data':
            $response = $controller->getPlanningData($payload);
            break;

        // 6. Log Shift Milestone & Actual Metric into DB
        case 'log_milestone':
        case 'update_progress':
            $response = $controller->logMilestone($payload);
            break;

        // 7. Dynamic Monitoring Data & Roster
        case 'get_monitoring_data':
        case 'get_monitoring_roster':
            $response = $controller->getMonitoringData($payload);
            break;

        // 8. General Tasks Matrix (Supervisor Hub)
        case 'get_general_tasks':
            $response = $controller->getGeneralTasks($payload);
            break;

        case 'create_general_task':
            $response = $controller->createGeneralTask($payload);
            break;

        case 'update_general_task':
            $response = $controller->updateGeneralTask($payload);
            break;

        case 'delete_general_task':
            $response = $controller->deleteGeneralTask($payload);
            break;

        // 9. Concrete Tasks (Checklists & Completion)
        case 'get_goal_tasks':
        case 'get_tasks':
            $response = $controller->getGoalTasks($payload);
            break;

        case 'create_specific_task':
            $response = $controller->createSpecificTask($payload);
            break;

        case 'complete_task':
            $response = $controller->completeTask($payload);
            break;

        case 'add_supervisor_task_feedback':
        case 'add_task_feedback':
            $response = $controller->addSupervisorTaskFeedback($payload);
            break;

        case 'delete_task':
            $response = $controller->deleteTask($payload);
            break;

        case 'reset_task':
            $response = $controller->resetTask($payload);
            break;

        // 10. Evaluation & Multi-Factor Appraisal (Database Driven)
        case 'get_performance_data':
            $evalsRes = $controller->getEvaluations($payload);
            $planRes = $controller->getPlanningData($payload);
            $response = [
                'success' => true,
                'data' => [
                    'evaluations' => $evalsRes['data']['evaluations'] ?? ($evalsRes['data'] ?? []),
                    'planning'    => $planRes['data'] ?? []
                ]
            ];
            break;

        case 'get_evaluations':
            $response = $controller->getEvaluations($payload);
            break;

        case 'get_evaluation':
            $response = $controller->getEvaluation($payload);
            break;

        case 'submit_appraisal':
        case 'save_evaluation':
            $response = $controller->submitAppraisal($payload);
            break;

        case 'submit_self_assessment':
            $response = $controller->submitSelfAssessment($payload);
            break;

        case 'calibrate_evaluation':
            $response = $controller->calibrateEvaluation($payload);
            break;

        case 'set_needs_training':
        case 'update_needs_training':
        case 'increment_retry_count':
            $response = $controller->setNeedsTraining($payload);
            break;

        case 'retry_plan':
            $response = $controller->retryPlan($payload);
            break;

        case 'get_training_programs':
            $response = $controller->getTrainingPrograms($payload);
            break;

        case 'get_training_needs':
            $response = $controller->getTrainingNeeds($payload);
            break;

        case 'assign_formal_training':
        case 'assign_formal_curriculum':
            $response = $controller->assignFormalCurriculum($payload);
            break;

        case 'continue_to_final_evaluation':
        case 'continue_final_evaluation':
            $response = $controller->continueToFinal1on1Evaluation($payload);
            break;

        case 'mark_goal_failed':
            $response = $controller->markGoalFailed($payload);
            break;

        // ── Development Plan (Phase 6 Draft & Phase 7 Deploy) ──────────────
        case 'get_development_plans':
            $response = $controller->getDevelopmentPlans($payload);
            break;

        case 'add_draft_task':
            $response = $controller->addDraftTask($payload);
            break;

        case 'add_draft_book':
            $response = $controller->addDraftBook($payload);
            break;

        case 'remove_draft_item':
            $response = $controller->removeDraftItem($payload);
            break;

        case 'discard_draft_plan':
            $response = $controller->discardDraftPlan($payload);
            break;

        case 'deploy_development_plan':
            $response = $controller->deployDevelopmentPlan($payload);
            break;

        default:
            http_response_code(400);
            $response = [
                'success' => false,
                'data'    => null,
                'message' => "Invalid or unspecified action '{$action}'."
            ];
            break;
    }
} catch (\Throwable $e) {
    http_response_code(500);
    $response = [
        'success' => false,
        'data'    => null,
        'message' => 'Internal server error: ' . $e->getMessage()
    ];
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
