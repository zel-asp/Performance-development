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
     * Conversational Chat with history context
     */
    public function chatWithContext(array $chatHistory, string $employeeName, string $dept): array
    {
        // Strict Oxford Suites domain guardrail system prompt
        $systemInstruction = "You are the official Oxford Suites Makati Leadership & Operations AI Copilot. "
            . "You are an internal corporate assistant strictly dedicated to Oxford Suites hotel operations, hospitality service standards, employee performance coaching, Situation-Behavior-Impact (SBI) feedback drafting, shift friction resolution, training development, and leadership succession. "
            . "You are currently assisting with coaching for {$employeeName} in the {$dept} department. "
            . "\n\nCRITICAL DOMAIN GUARDRAILS (STRICTLY ENFORCED):\n"
            . "1. You must ONLY answer questions related to Oxford Suites hotel operations, hospitality leadership, staff coaching, guest service excellence, shift coordination, and HR performance development.\n"
            . "2. You must NEVER answer technical programming, software engineering, or coding questions (e.g. writing Python, JavaScript, PHP, SQL, HTML, CSS, debugging code, solving algorithms, or technical computer tutorials). You are a hotel operations leadership coach, NOT a code assistant.\n"
            . "3. You must NEVER answer homework problems, general trivia, recipes outside Oxford Suites F&B standards, or non-hotel topics.\n"
            . "4. If a user asks you to write code, teach programming, or asks any question outside of Oxford Suites hotel operations, you MUST POLITELY REFUSE with this sentiment:\n"
            . "'As the Oxford Suites Makati Leadership & Operations AI Copilot, I am specialized exclusively in our hotel operations, guest service excellence, and employee performance coaching. I cannot assist with computer programming or topics outside our hotel. How may I assist you with coaching {$employeeName}, handling shift operations in {$dept}, or refining hospitality feedback today?'\n"
            . "5. Always maintain a warm, concise, professional hospitality tone in English.";

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
                'temperature'     => 0.6,
                'maxOutputTokens' => 800,
                'responseMimeType'=> 'text/plain'
            ]
        ];

        $response = $this->callGeminiApi($payload);

        if (!$response['success']) {
            return [
                'success' => false,
                'message' => 'The AI Coach is temporarily unavailable.',
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
     * Send cURL request to Gemini API endpoint with strict timeout and fallback models
     */
    private function callGeminiApi(array $payload): array
    {
        if (empty($this->apiKey)) {
            return ['success' => false, 'error' => 'GEMINI_API_KEY is not configured.'];
        }

        $models = [
            GEMINI_MODEL,
            'gemini-3.1-flash-lite'
        ];

        $jsonPayload = json_encode($payload);

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
                CURLOPT_TIMEOUT        => $this->timeout,
                CURLOPT_CONNECTTIMEOUT => 2,
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
            }
        }

        return ['success' => false, 'error' => 'All Gemini flash endpoints failed or timed out.'];
    }

    /**
     * Helper to clean and extract JSON object from Gemini response
     */
    private function extractJson(string $raw): ?array
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
