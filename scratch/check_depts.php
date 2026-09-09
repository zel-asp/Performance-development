<?php
require_once __DIR__ . '/../config/config.php';

$pdo = getSupabaseDb();
if ($pdo) {
    $stmt = $pdo->query("SELECT * FROM public.departments");
    $depts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Departments:\n";
    print_r($depts);

    $stmt2 = $pdo->query("SELECT * FROM public.lms_documents");
    $lms = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    echo "\nLMS Documents in DB:\n";
    print_r($lms);

    $stmt3 = $pdo->query("SELECT * FROM public.lms_prescribed");
    $pres = $stmt3->fetchAll(PDO::FETCH_ASSOC);
    echo "\nLMS Prescribed in DB:\n";
    print_r($pres);
}
