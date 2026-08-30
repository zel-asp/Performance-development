<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/gemini.php';

class RateLimitService
{
    private int $maxPerHour;
    private int $maxPerDay;

    public function __construct()
    {
        $this->maxPerHour = defined('GEMINI_RATE_LIMIT_HOUR') ? GEMINI_RATE_LIMIT_HOUR : 20;
        $this->maxPerDay = defined('GEMINI_RATE_LIMIT_DAY') ? GEMINI_RATE_LIMIT_DAY : 100;
    }

    /**
     * Check if a user is within their hourly and daily rate limits
     *
     * @param string $userId User ID to rate-limit
     * @return array ['allowed' => bool, 'remaining' => int, 'limit' => int, 'resetIn' => int, 'message' => string]
     */
    public function checkRateLimit(string $userId): array
    {
        $userId = trim($userId);
        if (empty($userId)) {
            return [
                'allowed'   => true,
                'remaining' => $this->maxPerHour,
                'limit'     => $this->maxPerHour,
                'resetIn'   => 0
            ];
        }

        $now = time();
        $oneHourAgo = date('c', $now - 3600);

        // 1. Fetch current hour's active rate bucket from Supabase
        $res = supabaseRequest("rate_limits?user_id=eq.{$userId}&window_start=gte.{$oneHourAgo}&order=window_start.desc&limit=1", 'GET', null, true);
        $records = is_array($res['data'] ?? null) && !isset($res['data']['code']) ? $res['data'] : [];

        if (empty($records)) {
            // First request in this window - create a fresh bucket
            $recordId = 'rl-' . substr(bin2hex(random_bytes(4)), 0, 8);
            supabaseRequest('rate_limits', 'POST', [
                'id'            => $recordId,
                'user_id'       => $userId,
                'window_start'  => date('c', $now),
                'request_count' => 1,
                'updated_at'    => date('c', $now)
            ], true);

            return [
                'allowed'   => true,
                'remaining' => $this->maxPerHour - 1,
                'limit'     => $this->maxPerHour,
                'resetIn'   => 3600
            ];
        }

        $currentBucket = $records[0];
        $count = (int)($currentBucket['request_count'] ?? 0);
        $windowStartTs = strtotime($currentBucket['window_start'] ?? 'now');
        $elapsed = $now - $windowStartTs;
        $resetIn = max(1, 3600 - $elapsed);

        if ($count >= $this->maxPerHour) {
            $resetMins = ceil($resetIn / 60);
            return [
                'allowed'   => false,
                'remaining' => 0,
                'limit'     => $this->maxPerHour,
                'resetIn'   => $resetIn,
                'message'   => "AI request quota reached ({$this->maxPerHour}/hour). Please retry in {$resetMins} minute(s) or use manual entry."
            ];
        }

        // Increment count
        $newCount = $count + 1;
        $bucketId = $currentBucket['id'] ?? '';
        if ($bucketId) {
            supabaseRequest("rate_limits?id=eq.{$bucketId}", 'PATCH', [
                'request_count' => $newCount,
                'updated_at'    => date('c', $now)
            ], true);
        }

        return [
            'allowed'   => true,
            'remaining' => max(0, $this->maxPerHour - $newCount),
            'limit'     => $this->maxPerHour,
            'resetIn'   => $resetIn
        ];
    }
}
