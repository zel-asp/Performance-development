<?php

require_once __DIR__ . '/../services/GeminiService.php';
require_once __DIR__ . '/../services/RateLimitService.php';
require_once __DIR__ . '/../models/AILogModel.php';
require_once __DIR__ . '/../models/CoachingNoteModel.php';

class AIController
{
    private GeminiService $geminiService;
    private RateLimitService $rateLimitService;
    private AILogModel $aiLogModel;
    private CoachingNoteModel $coachingModel;

    public function __construct()
    {
        $this->geminiService = new GeminiService();
        $this->rateLimitService = new RateLimitService();
        $this->aiLogModel = new AILogModel();
        $this->coachingModel = new CoachingNoteModel();
    }

    /**
     * Handle conversational chat with history
    /**
     * Pre-flight Domain Boundary Guardrail
     * Enforce that the AI only discusses Oxford Suites hotel operations, coaching, and hospitality.
     */
    private function checkDomainGuardrail(string $prompt, string $employeeName, string $dept): ?string
    {
        $lower = strtolower($prompt);

        // Disallow programming and software coding requests
        $codingPatterns = [
            'how to code', 'write code', 'write a program', 'write a function', 'write a script',
            'python', 'javascript', 'html', 'css', 'react', 'java code', 'c++', 'c#', 'php script',
            'programming in', 'algorithm', 'sql query to create', 'how do i code',
            'debug this code', 'write me a script', 'write a class', 'install npm', 'git clone'
        ];

        foreach ($codingPatterns as $pattern) {
            if (str_contains($lower, $pattern)) {
                return "As the Oxford Suites Makati Leadership & Operations AI Copilot, my capabilities are strictly dedicated to our hotel operations, guest service excellence, and staff performance coaching. I cannot assist with computer programming, software coding, or non-hotel technical topics.\n\nHow may I assist you with coaching {$employeeName}, handling shift operations in {$dept}, or structuring SBI feedback today?";
            }
        }

        return null;
    }

    /**
     * Get real-time rate limit quota status for user
     */
    public function getRateLimitStatus(array $payload): array
    {
        $userId = trim($payload['user_id'] ?? ($payload['userId'] ?? ''));
        $status = $this->rateLimitService->getRateLimitStatus($userId ?: 'anonymous-supervisor');
        return [
            'success'   => true,
            'rateLimit' => $status
        ];
    }

    /**
     * Handle conversational chat with history
     */
    public function chat(array $payload): array
    {
        $role = trim($payload['role'] ?? ($payload['user_role'] ?? 'Associate'));
        $userId = trim($payload['user_id'] ?? ($payload['userId'] ?? ''));
        $dept = trim($payload['dept'] ?? ($payload['department'] ?? 'Front Office'));
        $employeeName = trim($payload['employee_name'] ?? ($payload['employeeName'] ?? 'Associate'));
        $chatHistory = $payload['history'] ?? [];

        if (empty($chatHistory) || !is_array($chatHistory)) {
            http_response_code(400);
            return [
                'success' => false,
                'code'    => 400,
                'message' => 'Chat history is required.'
            ];
        }

        // Check if user is asking for coding or non-hotel questions
        $latestUserMsg = '';
        foreach (array_reverse($chatHistory) as $m) {
            if (($m['role'] ?? '') === 'user') {
                $latestUserMsg = $m['content'] ?? '';
                break;
            }
        }

        $guardrailViolation = $this->checkDomainGuardrail($latestUserMsg, $employeeName, $dept);
        if ($guardrailViolation !== null) {
            $rateCheck = $this->rateLimitService->getRateLimitStatus($userId ?: 'anonymous-supervisor');
            return [
                'success'   => true,
                'data'      => [
                    'text'  => $guardrailViolation,
                    'model' => 'oxford-guardrail'
                ],
                'rateLimit' => $rateCheck
            ];
        }

        // Sliding Window Rate Limiting (Per-User)
        $rateCheck = $this->rateLimitService->checkRateLimit($userId ?: 'anonymous-supervisor');
        if (!$rateCheck['allowed']) {
            http_response_code(429);
            return [
                'success'   => false,
                'code'      => 429,
                'rateLimit' => $rateCheck,
                'message'   => $rateCheck['message'] ?? 'Rate limit exceeded. Please retry later or use manual entry.'
            ];
        }

        $result = $this->geminiService->chatWithContext($chatHistory, $employeeName, $dept);

        $this->aiLogModel->logRequest([
            'user_id'         => $userId ?: 'anonymous-supervisor',
            'role'            => $role,
            'feature'         => 'chatbot',
            'input_reference' => substr($latestUserMsg, 0, 150),
            'tokens_used'     => $result['tokens'] ?? 0,
            'status'          => 'SUCCESS'
        ]);

        return [
            'success'   => true,
            'data'      => [
                'text'  => $result['text'] ?? '',
                'model' => $result['model'] ?? 'gemini-1.5-flash'
            ],
            'rateLimit' => $rateCheck
        ];
    }

    /**
     * Refine rough supervisor floor observation into 3-part SBI format
     */
    public function refineSBI(array $payload): array
    {
        $role = trim($payload['role'] ?? ($payload['user_role'] ?? 'Associate'));
        $userId = trim($payload['user_id'] ?? ($payload['userId'] ?? ''));
        $dept = trim($payload['dept'] ?? ($payload['department'] ?? 'Front Office'));
        $employeeId = trim($payload['employee_id'] ?? ($payload['employeeId'] ?? ''));
        $employeeName = trim($payload['employee_name'] ?? ($payload['employeeName'] ?? 'Associate'));
        $roughNotes = trim($payload['rough_notes'] ?? ($payload['rough_observation'] ?? ($payload['notes'] ?? '')));
        $tone = trim($payload['tone'] ?? 'balanced');

        // 1. Role Context Handling: Associates, Supervisors, and HR all have access
        $isAssociate = (strcasecmp($role, 'Associate') === 0 || strcasecmp($role, 'Employee') === 0);

        // 2. Validate Input
        if (empty($roughNotes)) {
            http_response_code(400);
            return [
                'success' => false,
                'code'    => 400,
                'message' => 'Observation text cannot be empty. Please enter rough notes from your shift.'
            ];
        }

        if (strlen($roughNotes) > 1200) {
            http_response_code(400);
            return [
                'success' => false,
                'code'    => 400,
                'message' => 'Observation exceeds maximum allowed length of 1,200 characters.'
            ];
        }

        // 3. Sliding Window Rate Limiting (Per-User)
        $rateCheck = $this->rateLimitService->checkRateLimit($userId ?: 'anonymous-supervisor');
        if (!$rateCheck['allowed']) {
            http_response_code(429);
            $this->aiLogModel->logRequest([
                'user_id'         => $userId ?: 'anonymous-supervisor',
                'role'            => $role,
                'feature'         => 'sbi_refiner',
                'input_reference' => substr($roughNotes, 0, 100),
                'status'          => 'RATE_LIMITED'
            ]);

            return [
                'success'   => false,
                'code'      => 429,
                'rateLimit' => $rateCheck,
                'message'   => $rateCheck['message'] ?? 'Rate limit exceeded. Please retry later or use manual entry.'
            ];
        }

        // 4. Dispatch to Gemini Service
        $result = $this->geminiService->refineSBIFeedback($roughNotes, $employeeName, $dept, $tone);

        // 5. Log Request in Audit Trail
        $this->aiLogModel->logRequest([
            'user_id'         => $userId ?: 'anonymous-supervisor',
            'role'            => $role,
            'feature'         => 'sbi_refiner',
            'input_reference' => substr($roughNotes, 0, 150),
            'tokens_used'     => $result['tokens'] ?? 0,
            'status'          => ($result['is_fallback'] ?? false) ? 'FALLBACK' : 'SUCCESS'
        ]);

        return [
            'success'   => true,
            'data'      => [
                'situation'   => $result['situation'] ?? '',
                'behavior'    => $result['behavior'] ?? '',
                'impact'      => $result['impact'] ?? '',
                'tone'        => $result['tone'] ?? $tone,
                'isFallback'  => !empty($result['is_fallback']),
                'isCached'    => !empty($result['is_cached']),
                'model'       => $result['model'] ?? 'gemini-1.5-flash'
            ],
            'rateLimit' => $rateCheck,
            'message'   => $result['message'] ?? 'SBI coaching draft structured successfully. Please review and edit before saving.'
        ];
    }

    /**
     * Department Sentiment Diagnostics (Passive Trend Analysis)
     */
    public function getDepartmentSentiment(array $payload): array
    {
        $role = trim($payload['role'] ?? ($payload['user_role'] ?? 'Associate'));
        $dept = trim($payload['dept'] ?? ($payload['department'] ?? 'all'));
        $userId = trim($payload['user_id'] ?? ($payload['userId'] ?? ''));

        // Department sentiment is accessible to all team members, scoped to department
        if ($dept === 'all' && (strcasecmp($role, 'Associate') === 0 || strcasecmp($role, 'Employee') === 0)) {
            $dept = 'Front Office'; // Default scope for associate
        }

        $rateCheck = $this->rateLimitService->checkRateLimit($userId ?: 'anonymous-supervisor');
        if (!$rateCheck['allowed']) {
            http_response_code(429);
            return [
                'success'   => false,
                'code'      => 429,
                'rateLimit' => $rateCheck,
                'message'   => $rateCheck['message'] ?? 'Rate limit exceeded. Please retry later or use manual entry.'
            ];
        }

        // Aggregate free-text notes from coaching notes and recent activity
        $notes = $this->coachingModel->getNotes();
        $textBuffer = [];
        foreach ($notes as $n) {
            if ($dept === 'all' || strcasecmp($n['dept'] ?? 'Operations', $dept) === 0) {
                $textBuffer[] = ($n['situation'] ?? '') . ' ' . ($n['behavior'] ?? '') . ' ' . ($n['impact'] ?? '');
            }
        }
        $combinedText = implode(" \n ", array_slice($textBuffer, 0, 10));

        $sentimentResult = $this->geminiService->analyzeSentiment($combinedText, $dept === 'all' ? 'Oxford Suites Makati (Property-wide)' : $dept);

        return [
            'success'   => true,
            'data'      => $sentimentResult,
            'dept'      => $dept,
            'rateLimit' => $rateCheck
        ];
    }

    /**
     * Get AI Compliance Audit Logs (HR Only)
     */
    public function getAuditLogs(array $payload): array
    {
        $role = trim($payload['role'] ?? ($payload['user_role'] ?? ''));
        if (strcasecmp($role, 'HR') !== 0 && strcasecmp($role, 'Admin') !== 0) {
            http_response_code(403);
            return [
                'success' => false,
                'code'    => 403,
                'message' => 'Access denied: AI compliance logs are accessible to HR only.'
            ];
        }

        $logs = $this->aiLogModel->getLogs(50);
        return [
            'success' => true,
            'data'    => $logs,
            'count'   => count($logs)
        ];
    }
}
