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
    /**
     * Get current rate limit status without incrementing counter
     *
     * @param string $userId User ID
     * @return array ['allowed' => bool, 'remaining' => int, 'limit' => int, 'resetIn' => int]
     */
    public function getRateLimitStatus(string $userId): array
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
        $oneHourAgo = date('Y-m-d H:i:sP', $now - 3600);

        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $stmt = $pdo->prepare("SELECT id, request_count, window_start FROM public.rate_limits WHERE user_id = :uid AND window_start >= :win ORDER BY window_start DESC LIMIT 1");
                $stmt->execute([':uid' => $userId, ':win' => $oneHourAgo]);
                $bucket = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($bucket) {
                    $count = (int)$bucket['request_count'];
                    $windowStartTs = strtotime($bucket['window_start'] ?? 'now');
                    $resetIn = max(1, 3600 - ($now - $windowStartTs));
                    return [
                        'allowed'   => $count < $this->maxPerHour,
                        'remaining' => max(0, $this->maxPerHour - $count),
                        'limit'     => $this->maxPerHour,
                        'resetIn'   => $resetIn
                    ];
                }
            }
        } catch (Throwable $e) {}

        $res = supabaseRequest("rate_limits?user_id=eq.{$userId}&window_start=gte.{$oneHourAgo}&order=window_start.desc&limit=1", 'GET', null, true);
        $records = is_array($res['data'] ?? null) && !isset($res['data']['code']) ? $res['data'] : [];

        if (!empty($records)) {
            $currentBucket = $records[0];
            $count = (int)($currentBucket['request_count'] ?? 0);
            $windowStartTs = strtotime($currentBucket['window_start'] ?? 'now');
            $resetIn = max(1, 3600 - ($now - $windowStartTs));
            return [
                'allowed'   => $count < $this->maxPerHour,
                'remaining' => max(0, $this->maxPerHour - $count),
                'limit'     => $this->maxPerHour,
                'resetIn'   => $resetIn
            ];
        }

        return [
            'allowed'   => true,
            'remaining' => $this->maxPerHour,
            'limit'     => $this->maxPerHour,
            'resetIn'   => 0
        ];
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
        $oneHourAgo = date('Y-m-d H:i:sP', $now - 3600);

        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $stmt = $pdo->prepare("SELECT id, request_count, window_start FROM public.rate_limits WHERE user_id = :uid AND window_start >= :win ORDER BY window_start DESC LIMIT 1");
                $stmt->execute([':uid' => $userId, ':win' => $oneHourAgo]);
                $bucket = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$bucket) {
                    $recordId = 'rl-' . substr(bin2hex(random_bytes(4)), 0, 8);
                    $ins = $pdo->prepare("INSERT INTO public.rate_limits (id, user_id, window_start, request_count, updated_at) VALUES (:id, :uid, :win, 1, :upd)");
                    $ins->execute([
                        ':id'  => $recordId,
                        ':uid' => $userId,
                        ':win' => date('c', $now),
                        ':upd' => date('c', $now)
                    ]);
                    return [
                        'allowed'   => true,
                        'remaining' => $this->maxPerHour - 1,
                        'limit'     => $this->maxPerHour,
                        'resetIn'   => 3600
                    ];
                }

                $count = (int)($bucket['request_count'] ?? 0);
                $windowStartTs = strtotime($bucket['window_start'] ?? 'now');
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

                $newCount = $count + 1;
                $upd = $pdo->prepare("UPDATE public.rate_limits SET request_count = :cnt, updated_at = :upd WHERE id = :id");
                $upd->execute([':cnt' => $newCount, ':upd' => date('c', $now), ':id' => $bucket['id']]);

                return [
                    'allowed'   => true,
                    'remaining' => max(0, $this->maxPerHour - $newCount),
                    'limit'     => $this->maxPerHour,
                    'resetIn'   => $resetIn
                ];
            }
        } catch (Throwable $e) {
            error_log('[RateLimitService] PDO checkRateLimit fallback: ' . $e->getMessage());
        }

        // 1. Fetch current hour's active rate bucket from Supabase REST
        $res = supabaseRequest("rate_limits?user_id=eq.{$userId}&window_start=gte.{$oneHourAgo}&order=window_start.desc&limit=1", 'GET', null, true);
        $records = is_array($res['data'] ?? null) && !isset($res['data']['code']) ? $res['data'] : [];

        if (empty($records)) {
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
