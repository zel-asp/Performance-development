<?php
require_once __DIR__ . '/../config/config.php';
$pdo = getSupabaseDb();
if ($pdo) {
    $q = $pdo->query("SELECT id, email, full_name, role, department FROM public.users LIMIT 20");
    $users = $q->fetchAll(PDO::FETCH_ASSOC);
    print_r($users);
}
