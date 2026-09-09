<?php
require_once __DIR__ . '/../config/config.php';
$pdo = getSupabaseDb();
$q = $pdo->query("SELECT id, employee_id, points, description, created_at FROM public.xp_ledger ORDER BY created_at DESC LIMIT 5");
print_r($q->fetchAll(PDO::FETCH_ASSOC));
