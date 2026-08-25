<?php

require_once __DIR__ . '/../models/TrainingNeedModel.php';
require_once __DIR__ . '/../models/TrainingProgramModel.php';
require_once __DIR__ . '/../models/TrainingSessionModel.php';
require_once __DIR__ . '/../models/EvaluationModel.php';
require_once __DIR__ . '/../models/TrainingReportModel.php';

class TrainingController
{
    private TrainingNeedModel $needModel;
    private TrainingProgramModel $programModel;
    private TrainingSessionModel $sessionModel;
    private EvaluationModel $evaluationModel;
    private TrainingReportModel $reportModel;

    public function __construct()
    {
        $this->needModel = new TrainingNeedModel();
        $this->programModel = new TrainingProgramModel();
        $this->sessionModel = new TrainingSessionModel();
        $this->evaluationModel = new EvaluationModel();
        $this->reportModel = new TrainingReportModel();
    }

    // 1. Training Needs
    public function getNeeds(array $filters = []): array
    {
        $needs = $this->needModel->getNeeds($filters);
        return [
            'success' => true,
            'data'    => $needs
        ];
    }

    public function createNeed(array $data): array
    {
        if (empty($data['title'])) {
            return ['success' => false, 'message' => 'Need title is required.'];
        }
        $created = $this->needModel->createNeed($data);
        return [
            'success' => true,
            'message' => 'Training need registered successfully.',
            'data'    => $created
        ];
    }

    // 2. Training Programs
    public function getPrograms(array $filters = []): array
    {
        $programs = $this->programModel->getPrograms($filters);
        return [
            'success' => true,
            'data'    => $programs
        ];
    }

    public function createProgram(array $data): array
    {
        if (empty($data['title']) || empty($data['dept'])) {
            return ['success' => false, 'message' => 'Program title and department are required.'];
        }
        $created = $this->programModel->createProgram($data);
        return [
            'success' => true,
            'message' => 'Training program created successfully.',
            'data'    => $created
        ];
    }

    // 3. Training Sessions
    public function getSessions(array $filters = []): array
    {
        $sessions = $this->sessionModel->getSessions($filters);
        return [
            'success' => true,
            'data'    => $sessions
        ];
    }

    public function createSession(array $data): array
    {
        if (empty($data['title']) || empty($data['programId']) || empty($data['date'])) {
            return ['success' => false, 'message' => 'Session title, program, and date are required.'];
        }
        $created = $this->sessionModel->createSession($data);
        return [
            'success' => true,
            'message' => 'Training session scheduled successfully.',
            'data'    => $created
        ];
    }

    // 4. Evaluations / Results List
    public function getResults(array $filters = []): array
    {
        $evaluations = $this->evaluationModel->getEvaluations($filters);
        return [
            'success' => true,
            'data'    => $evaluations
        ];
    }

    // 5. Training Reports & Audit Analytics
    public function getReports(array $filters = []): array
    {
        $dept = $filters['department'] ?? null;
        $summary = $this->reportModel->getSummaryAnalytics($dept);
        return [
            'success' => true,
            'data'    => $summary
        ];
    }

    // 6. Master Bootstrap Data (Fetches all states in a single payload)
    public function getBootstrapData(): array
    {
        return [
            'success' => true,
            'data'    => [
                'needs'       => $this->needModel->getNeeds(),
                'programs'    => $this->programModel->getPrograms(),
                'sessions'    => $this->sessionModel->getSessions(),
                'results'     => $this->evaluationModel->getEvaluations(),
                'reports'     => $this->reportModel->getSummaryAnalytics()
            ]
        ];
    }
}
