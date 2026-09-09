<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/gemini.php';

class GeminiService
{
    private string $apiKey;
    private string $endpoint;
    private int $timeout;

    public function __construct()
    {
        $this->apiKey = defined('GEMINI_API_KEY') ? GEMINI_API_KEY : '';
        $this->endpoint = defined('GEMINI_ENDPOINT') ? GEMINI_ENDPOINT : '';
        $this->timeout = defined('GEMINI_TIMEOUT_SECONDS') ? GEMINI_TIMEOUT_SECONDS : 4;
    }

    /**
     * Refine rough floor observation into structured SBI (Situation-Behavior-Impact) draft
     *
     * @param string $roughObservation Raw text from floor supervisor
     * @param string $employeeName Name of the associate being observed
     * @param string $dept Department
     * @param string $tone 'balanced' | 'direct' | 'growth' | 'empathy'
     * @return array Structured [situation, behavior, impact, is_fallback, model, tokens]
     */
    public function refineSBIFeedback(
        string $roughObservation,
        string $employeeName = 'Associate',
        string $dept = 'Operations',
        string $tone = 'balanced'
    ): array {
        $roughObservation = trim($roughObservation);
        if (empty($roughObservation)) {
            return [
                'success'     => false,
                'situation'   => '',
                'behavior'    => '',
                'impact'      => '',
                'is_fallback' => true,
                'message'     => 'Empty observation input provided.'
            ];
        }

        // 1. Check static demo scenario cache first
        $demoCache = file_exists(__DIR__ . '/../config/ai_demo_cache.php')
            ? require __DIR__ . '/../config/ai_demo_cache.php'
            : [];

        foreach ($demoCache as $demo) {
            if (strcasecmp(trim($demo['rough_input']), $roughObservation) === 0) {
                return [
                    'success'     => true,
                    'situation'   => $demo['cached_output']['situation'] ?? '',
                    'behavior'    => $demo['cached_output']['behavior'] ?? '',
                    'impact'      => $demo['cached_output']['impact'] ?? '',
                    'is_fallback' => false,
                    'is_cached'   => true,
                    'tone'        => $tone,
                    'model'       => 'cache-zero-latency'
                ];
            }
        }

        // 2. Prepare Gemini Prompt
        $userPrompt = <<<USER_PROMPT
Associate Name: {$employeeName}
Department: {$dept}
Selected Tone: {$tone}
Rough Floor Observation:
"{$roughObservation}"

Please structure this observation into the 3-part SBI format. Return valid JSON only with keys "situation", "behavior", "impact".
USER_PROMPT;

        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => GEMINI_SBI_SYSTEM_INSTRUCTION . "\n\n" . $userPrompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature'     => 0.4,
                'topK'            => 32,
                'topP'            => 0.9,
                'maxOutputTokens' => 800,
                'responseMimeType'=> 'application/json'
            ]
        ];

        // 3. Dispatch HTTP Request to Gemini API
        $response = $this->callGeminiApi($payload);

        if (!$response['success']) {
            // Graceful fallback to raw text without blocking supervisor workflow
            return [
                'success'     => true,
                'situation'   => "Observed during shift in {$dept}:",
                'behavior'    => $roughObservation,
                'impact'      => 'Discussed during coaching touchpoint to support team performance.',
                'is_fallback' => true,
                'error'       => $response['error'] ?? 'API timeout or offline',
                'message'     => 'Gemini assistant is temporarily unavailable. Raw observation loaded for manual editing.'
            ];
        }

        $rawText = $response['text'] ?? '';
        $parsed = $this->extractJson($rawText);

        if (!$parsed || empty($parsed['situation']) || empty($parsed['behavior']) || empty($parsed['impact'])) {
            return [
                'success'     => true,
                'situation'   => "Observed during shift in {$dept}:",
                'behavior'    => $roughObservation,
                'impact'      => 'Coaching touchpoint recorded for continuous operational improvement.',
                'is_fallback' => true,
                'message'     => 'AI generated non-standard format. Loaded for manual review.'
            ];
        }

        return [
            'success'     => true,
            'situation'   => trim($parsed['situation']),
            'behavior'    => trim($parsed['behavior']),
            'impact'      => trim($parsed['impact']),
            'is_fallback' => false,
            'tone'        => $tone,
            'model'       => GEMINI_MODEL,
            'tokens'      => $response['tokens'] ?? 0
        ];
    }

    /**
     * Passive Department Sentiment Analysis on aggregated free-text comments
     *
     * @param string $text Aggregated coaching, kudos, or evaluation comments
     * @param string $dept Department name
     * @return array
     */
    public function analyzeSentiment(string $text, string $dept = 'Hotel Operations'): array
    {
        $text = trim($text);
        if (empty($text)) {
            return [
                'success'    => true,
                'sentiment'  => 'Positive',
                'score'      => 88,
                'summary'    => 'Operational standards and guest engagement remain steady.',
                'key_themes' => ['Service Quality', 'Guest Satisfaction'],
                'is_fallback'=> true
            ];
        }

        $userPrompt = "Department: {$dept}\nAggregated Comments:\n\"" . substr($text, 0, 2500) . "\"\n\nAnalyze workplace sentiment and return JSON.";

        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => GEMINI_SENTIMENT_SYSTEM_INSTRUCTION . "\n\n" . $userPrompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature'     => 0.2,
                'maxOutputTokens' => 400,
                'responseMimeType'=> 'application/json'
            ]
        ];

        $response = $this->callGeminiApi($payload);

        if (!$response['success']) {
            return [
                'success'    => true,
                'sentiment'  => 'Positive',
                'score'      => 85,
                'summary'    => 'Staff morale and collaborative guest recovery are within benchmark thresholds.',
                'key_themes' => ['Hospitality Standard', 'Team Collaboration'],
                'is_fallback'=> true
            ];
        }

        $parsed = $this->extractJson($response['text'] ?? '');
        if (!$parsed || !isset($parsed['sentiment'])) {
            return [
                'success'    => true,
                'sentiment'  => 'Positive',
                'score'      => 86,
                'summary'    => 'Team feedback reflects positive engagement and focus on service excellence.',
                'key_themes' => ['Guest Focus', 'Shift Coordination'],
                'is_fallback'=> true
            ];
        }

        return [
            'success'    => true,
            'sentiment'  => $parsed['sentiment'] ?? 'Positive',
            'score'      => (int)($parsed['score'] ?? 85),
            'summary'    => $parsed['summary'] ?? 'Positive operational climate observed.',
            'key_themes' => is_array($parsed['key_themes'] ?? null) ? $parsed['key_themes'] : ['Service Excellence'],
            'is_fallback'=> false
        ];
    }

    /**
     * Conversational Chat with deep Oxford Suites system knowledge context
     */
    public function chatWithContext(array $chatHistory, string $employeeName, string $dept): array
    {
        $systemKnowledge = file_exists(__DIR__ . '/../config/system_knowledge.php')
            ? require __DIR__ . '/../config/system_knowledge.php'
            : '';

        $systemInstruction = "You are the official Oxford Suites Makati Leadership & System AI Copilot. "
            . "You are an internal corporate intelligence assistant exclusively dedicated to the Oxford Suites Makati hotel operations and our 6-Module Performance & Development Management System.\n\n"
            . "Current User Session Context:\n"
            . "- Active Associate / Subject: {$employeeName}\n"
            . "- Department: {$dept}\n\n"
            . "=== SYSTEM KNOWLEDGE BASE ===\n"
            . $systemKnowledge . "\n\n"
            . "=== INSTRUCTIONS FOR COPILOT ===\n"
            . "1. Use the knowledge base above to answer any question about our 6 modules (Performance, Competency, LMS, Training, Succession, Social Recognition), rating scales, 9-Box grid, readiness index formula (40% Performance + 60% Competency), XP rewards, badges, and hotel SOPs.\n"
            . "2. Help supervisors and associates draft Situation-Behavior-Impact (SBI) feedback, solve guest service friction (using our LAST recovery model), prepare for appraisals, and plan leadership development.\n"
            . "3. DOMAIN ENFORCEMENT: If the user asks about software coding, programming, non-hotel subjects, homework, general trivia, politics, or topics outside our hotel, you MUST POLITELY REFUSE and remind them that you are strictly dedicated to Oxford Suites hotel operations and this Performance & Development Management System.\n"
            . "4. Keep your responses structured, clear, and professional, using markdown bullets and headings where helpful.";

        $contents = [];
        foreach ($chatHistory as $msg) {
            $role = $msg['role'] === 'user' ? 'user' : 'model';
            $contents[] = [
                'role' => $role,
                'parts' => [['text' => $msg['content']]]
            ];
        }

        $payload = [
            'systemInstruction' => [
                'role' => 'system',
                'parts' => [['text' => $systemInstruction]]
            ],
            'contents' => $contents,
            'generationConfig' => [
                'temperature'     => 0.4,
                'maxOutputTokens' => 1000,
                'responseMimeType'=> 'text/plain'
            ]
        ];

        $response = $this->callGeminiApi($payload, 15);

        if (!$response['success']) {
            return [
                'success' => false,
                'message' => $response['error'] ?? 'The AI Coach is temporarily unavailable.',
                'error'   => $response['error'] ?? 'API timeout'
            ];
        }

        return [
            'success' => true,
            'text'    => $response['text'] ?? '',
            'tokens'  => $response['tokens'] ?? 0,
            'model'   => $response['model'] ?? GEMINI_MODEL
        ];
    }

    /**
     * Generate an interactive 10-item knowledge quiz grounded in document text
     */
    public function generateQuizFromDocument(string $title, string $dept, string $category, string $documentText): ?array
    {
        $documentText = trim($documentText);
        $snippet = mb_substr($documentText, 0, 7000);

        $systemInstruction = "You are an expert assessment and instructional designer. "
            . "Analyze the attached handbook/document file and create an interactive 10-item multiple-choice quiz based directly on its content.\n"
            . "Rules:\n"
            . "1. Always output VALID JSON ONLY as an array of exactly 10 objects. Do not wrap in markdown code blocks or backticks.\n"
            . "2. Each object must contain:\n"
            . "   - 'id': integer from 1 to 10\n"
            . "   - 'question': scenario-based or procedural question testing key principles, systems, workflows, or rules explicitly mentioned in the document\n"
            . "   - 'options': array of 4 distinct string choices\n"
            . "   - 'correct': integer (0, 1, 2, or 3) indicating the zero-based index of the correct answer\n"
            . "   - 'explanation': 1 concise sentence explaining the correct answer referencing the document\n"
            . "3. Ground every question, option, and answer directly in the provided document text.";

        $prompt = "Document Title: {$title}\nDepartment/Domain: {$dept}\nCategory: {$category}\n\n"
            . "Document Content:\n\"\"\"\n{$snippet}\n\"\"\"\n\n"
            . "Analyze the document text above and generate exactly 10 scenario-based multiple-choice questions grounded in this file.";

        $payload = [
            'systemInstruction' => [
                'role' => 'system',
                'parts' => [['text' => $systemInstruction]]
            ],
            'contents' => [
                ['role' => 'user', 'parts' => [['text' => $prompt]]]
            ],
            'generationConfig' => [
                'temperature'     => 0.2,
                'maxOutputTokens' => 2500,
                'responseMimeType'=> 'application/json'
            ]
        ];

        $response = $this->callGeminiApi($payload, 12);
        if (!$response['success'] || empty($response['text'])) {
            return null;
        }

        $parsed = $this->extractJson($response['text']);
        if (!is_array($parsed) || count($parsed) < 10) {
            return null;
        }

        return array_slice($parsed, 0, 10);
    }

    /**
     * Send cURL request to Gemini API endpoint with strict timeout and fallback models
     */
    public function callGeminiApi(array $payload, ?int $customTimeout = null): array
    {
        if (empty($this->apiKey)) {
            return ['success' => false, 'error' => 'GEMINI_API_KEY is not configured.'];
        }

        $models = [
            GEMINI_MODEL,
            'gemini-3.5-flash',
            'gemini-3.1-flash-lite'
        ];

        $jsonPayload = json_encode($payload);
        $timeout = $customTimeout !== null ? $customTimeout : $this->timeout;
        $lastError = 'Connection failed';

        foreach ($models as $modelName) {
            $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/' . $modelName . ':generateContent';
            $url = $endpoint . '?key=' . urlencode($this->apiKey);

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $jsonPayload,
                CURLOPT_HTTPHEADER     => [
                    'Content-Type: application/json',
                    'Content-Length: ' . strlen($jsonPayload)
                ],
                CURLOPT_TIMEOUT        => $timeout,
                CURLOPT_CONNECTTIMEOUT => 4,
                CURLOPT_SSL_VERIFYPEER => false
            ]);

            $rawResponse = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);

            if ($rawResponse !== false && empty($curlError) && $httpCode === 200) {
                $decoded = json_decode($rawResponse, true);
                $candidates = $decoded['candidates'] ?? [];
                $text = $candidates[0]['content']['parts'][0]['text'] ?? '';
                $tokens = $decoded['usageMetadata']['totalTokenCount'] ?? 0;

                return [
                    'success' => true,
                    'text'    => $text,
                    'tokens'  => $tokens,
                    'model'   => $modelName
                ];
            } else {
                $lastError = !empty($curlError) ? $curlError : "HTTP {$httpCode} from {$modelName}";
            }
        }

        return ['success' => false, 'error' => "Gemini API unavailable: {$lastError}"];
    }

    /**
     * Helper to clean and extract JSON object from Gemini response
     */
    public function extractJson(string $raw): ?array
    {
        $clean = trim($raw);
        // Remove markdown code blocks if any
        if (preg_match('/^```(?:json)?\s*(.*?)\s*```$/is', $clean, $matches)) {
            $clean = trim($matches[1]);
        }
        $data = json_decode($clean, true);
        return is_array($data) ? $data : null;
    }
}

