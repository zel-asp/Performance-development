<?php
if (!function_exists('loadEnv')) {
    function loadEnv($filePath = null) {
        if ($filePath === null) {
            $filePath = file_exists(__DIR__ . '/.env') ? __DIR__ . '/.env' : __DIR__ . '/../.env';
        }
        if (!file_exists($filePath)) {
            return [];
        }
        return parse_ini_file($filePath, false, INI_SCANNER_RAW) ?: [];
    }
}

$env = loadEnv();

define('SUPABASE_URL', $env['SUPABASE_URL'] ?? '');
define('SUPABASE_ANON_KEY', $env['SUPABASE_ANON_KEY'] ?? '');
define('SUPABASE_SERVICE_ROLE_KEY', $env['SUPABASE_SERVICE_ROLE_KEY'] ?? '');
define('DATABASE_URL', $env['DATABASE_URL'] ?? '');


function getSupabaseDb() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    global $env;
    $dbUrl = $env['DATABASE_URL'] ?? '';

    $user = 'postgres.jvxnrgcxegzhyaekxdok';
    $pass = 'YD$%-3@x9$wi_hj';
    $host = 'aws-0-ap-southeast-1.pooler.supabase.com';
    $port = '6543';
    $dbname = 'postgres';

    if (!empty($dbUrl) && preg_match('/^postgresql:\/\/([^:]+):(.*)@([^@:]+):?(\d+)?\/(.+)$/', $dbUrl, $m)) {
        $user = $m[1];
        $pass = $m[2];
        $host = $m[3];
        $port = !empty($m[4]) ? $m[4] : '5432';
        $dbname = $m[5];
    }

    // Try primary connection
    try {
        $dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 4
        ]);
        return $pdo;
    } catch (PDOException $e) {
        // Fallback to pooler host
        try {
            $poolHost = "aws-0-ap-southeast-1.pooler.supabase.com";
            $poolUser = "postgres.jvxnrgcxegzhyaekxdok";
            $poolPort = "6543";
            $dsn = "pgsql:host={$poolHost};port={$poolPort};dbname=postgres;sslmode=require";
            $pdo = new PDO($dsn, $poolUser, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::ATTR_TIMEOUT            => 4
            ]);
            return $pdo;
        } catch (PDOException $e2) {
            error_log("Supabase PDO Connection Error: " . $e2->getMessage());
            return null;
        }
    }
}

/**
 * 2. Supabase REST API Query Helper
 * @param string $endpoint (e.g. 'performance_goals')
 * @param string $method ('GET', 'POST', 'PATCH', 'DELETE')
 * @param array|null $data Payload for POST/PATCH
 * @param array $headers Additional headers
 * @return array ['status' => int, 'data' => mixed, 'error' => string|null]
 */
function supabaseRequest($endpoint, $method = 'GET', $data = null, $useServiceRole = false) {
    $url = rtrim(SUPABASE_URL, '/') . '/rest/v1/' . ltrim($endpoint, '/');
    $apiKey = $useServiceRole ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY;

    $ch = curl_init($url);
    $headers = [
        "apikey: {$apiKey}",
        "Authorization: Bearer {$apiKey}",
        "Content-Type: application/json",
        "Prefer: return=representation"
    ];

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    if ($data !== null && in_array(strtoupper($method), ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        return ['status' => 500, 'data' => null, 'error' => $curlError];
    }

    $decodedData = json_decode($response, true);
    return [
        'status' => $httpCode,
        'data'   => $decodedData,
        'error'  => ($httpCode >= 400) ? ($decodedData['message'] ?? 'Request failed') : null
    ];
}

/**
 * 3. Supabase Auth API Helper (GoTrue Authentication)
 * Communicates with Supabase Auth endpoints (/auth/v1/...)
 */
function supabaseAuthRequest($endpoint, $method = 'GET', $data = null, $useServiceRole = true) {
    $url = rtrim(SUPABASE_URL, '/') . '/auth/v1/' . ltrim($endpoint, '/');
    $apiKey = $useServiceRole ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY;

    $ch = curl_init($url);
    $headers = [
        "apikey: {$apiKey}",
        "Authorization: Bearer {$apiKey}",
        "Content-Type: application/json"
    ];

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    if ($data !== null && in_array(strtoupper($method), ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        return ['status' => 500, 'data' => null, 'error' => $curlError];
    }

    $decodedData = json_decode($response, true);
    return [
        'status' => $httpCode,
        'data'   => $decodedData,
        'error'  => ($httpCode >= 400) ? ($decodedData['msg'] ?? $decodedData['message'] ?? $decodedData['error_description'] ?? 'Auth request failed') : null
    ];
}

/**
 * 4. Supabase Storage Upload Helper
 * Uploads binary file content to a specific Supabase storage bucket
 */
function uploadToSupabaseStorage($bucket, $destinationPath, $fileContent, $mimeType = 'application/octet-stream') {
    $url = rtrim(SUPABASE_URL, '/') . '/storage/v1/object/' . rawurlencode($bucket) . '/' . ltrim($destinationPath, '/');
    $apiKey = SUPABASE_SERVICE_ROLE_KEY;

    $ch = curl_init($url);
    $headers = [
        "apikey: {$apiKey}",
        "Authorization: Bearer {$apiKey}",
        "Content-Type: {$mimeType}",
        "x-upsert: true"
    ];

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fileContent);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        return ['status' => 500, 'data' => null, 'error' => $curlError];
    }

    $decoded = json_decode($response, true);
    $publicUrl = rtrim(SUPABASE_URL, '/') . '/storage/v1/object/public/' . rawurlencode($bucket) . '/' . ltrim($destinationPath, '/');

    return [
        'status' => $httpCode,
        'data' => $decoded,
        'publicUrl' => $publicUrl,
        'filePath' => $destinationPath,
        'error' => ($httpCode >= 400) ? ($decoded['message'] ?? 'Storage upload failed') : null
    ];
}

/**
 * 4. Supabase Storage Delete Helper
 */
function deleteFromSupabaseStorage($bucket, $destinationPaths) {
    $url = rtrim(SUPABASE_URL, '/') . '/storage/v1/object/' . rawurlencode($bucket);
    $apiKey = SUPABASE_SERVICE_ROLE_KEY;

    $paths = is_array($destinationPaths) ? $destinationPaths : [$destinationPaths];
    $paths = array_map(function($p) {
        return ltrim($p, '/');
    }, array_filter($paths));

    if (empty($paths)) {
        return ['status' => 200, 'data' => [], 'error' => null];
    }

    $ch = curl_init($url);
    $headers = [
        "apikey: {$apiKey}",
        "Authorization: Bearer {$apiKey}",
        "Content-Type: application/json"
    ];

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['prefixes' => array_values($paths)]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        return ['status' => 500, 'data' => null, 'error' => $curlError];
    }

    $decoded = json_decode($response, true);
    return [
        'status' => $httpCode,
        'data' => $decoded,
        'error' => ($httpCode >= 400) ? ($decoded['message'] ?? 'Storage delete failed') : null
    ];
}


