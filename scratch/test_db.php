<?php
require_once __DIR__ . '/../config/config.php';

$testAccount = [
    'email' => 'test@oxfordsuitesmakati.com',
    'password_hash' => password_hash('Password123!', PASSWORD_BCRYPT),
    'role' => 'Employee',
    'status' => 'Active'
];
$res = supabaseRequest('role_based_accounts', 'POST', $testAccount, true);
echo "role_based_accounts insert response:\n";
print_r($res);

if ($res['status'] >= 200 && $res['status'] < 300) {
    $insertedId = $res['data'][0]['id'] ?? null;
    echo "Inserted Account ID: $insertedId\n";
    if ($insertedId) {
        $delRes = supabaseRequest('role_based_accounts?id=eq.' . $insertedId, 'DELETE', null, true);
        echo "Delete response: status=" . $delRes['status'] . "\n";
    }
}





