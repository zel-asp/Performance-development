<?php
require_once __DIR__ . '/../config/config.php';
$pdo = getSupabaseDb();
if ($pdo) {
    echo "Connected via PDO\n";
    $q = $pdo->query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'shift_sentiments' ORDER BY ordinal_position");
    print_r($q->fetchAll(PDO::FETCH_ASSOC));
    
    $rows = $pdo->query("SELECT * FROM public.shift_sentiments ORDER BY created_at DESC LIMIT 10");
    print_r($rows->fetchAll(PDO::FETCH_ASSOC));
} else {
    echo "PDO failed, checking REST API:\n";
    $res = supabaseRequest('shift_sentiments?limit=5', 'GET', null, true);
    print_r($res);
}
