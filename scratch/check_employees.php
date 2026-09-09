<?php
require_once __DIR__ . '/../config/config.php';
$pdo = getSupabaseDb();
if ($pdo) {
    $q = $pdo->query("SELECT id, full_name, role, department_id FROM public.employees");
    print_r($q->fetchAll(PDO::FETCH_ASSOC));
}
