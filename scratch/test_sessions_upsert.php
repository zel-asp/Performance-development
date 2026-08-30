<?php
require_once __DIR__ . '/../config/config.php';

$pdo = getSupabaseDb();
if (!$pdo) {
    echo "PDO failed\n";
    exit(1);
}
echo "PDO connected!\n";

$userId = 'emp-101';
$email = 'maria.santos@oxfordsuitesmakati.com';
$name = 'Maria Santos';
$token = bin2hex(random_bytes(32));
$remember = true;
$expiresAt = date('Y-m-d H:i:s', time() + 86400);
$expiresRemember = date('Y-m-d H:i:s', time() + (30 * 86400));
$ip = '127.0.0.1';
$agent = 'Mozilla/5.0';

// Upsert session
$sql = "
    INSERT INTO public.sessions (user_id, session_token, expires_at, ip_address, user_agent, is_active, email, hr_employee_name, remember_me, expires_at_remember, updated_at)
    VALUES (:user_id, :token, :expires_at, :ip, :agent, true, :email, :name, :remember, :expires_remember, NOW())
    ON CONFLICT (email) DO UPDATE SET
        session_token = EXCLUDED.session_token,
        expires_at = EXCLUDED.expires_at,
        is_active = true,
        remember_me = EXCLUDED.remember_me,
        expires_at_remember = EXCLUDED.expires_at_remember,
        ip_address = EXCLUDED.ip_address,
        user_agent = EXCLUDED.user_agent,
        updated_at = NOW()
    RETURNING id, user_id, email, is_active, remember_me
";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':user_id' => $userId,
    ':token' => $token,
    ':expires_at' => $expiresAt,
    ':ip' => $ip,
    ':agent' => $agent,
    ':email' => $email,
    ':name' => $name,
    ':remember' => $remember ? 'true' : 'false',
    ':expires_remember' => $expiresRemember
]);
$row = $stmt->fetch();
echo "Inserted/Updated session:\n";
print_r($row);
