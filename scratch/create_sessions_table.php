<?php
$pass = 'YD$%-3@x9$wi_hj';
$user = 'postgres.jvxnrgcxegzhyaekxdok';
$host = "aws-0-ap-southeast-1.pooler.supabase.com";
$port = 6543;

try {
    $dsn = "pgsql:host={$host};port={$port};dbname=postgres;sslmode=require";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 5
    ]);
    echo "Connected successfully to PostgreSQL!\n";

    $sql = file_get_contents(__DIR__ . '/../database/sessions.sql');
    $pdo->exec($sql);
    echo "Executed database/sessions.sql successfully!\n";

    $stmt = $pdo->query("SELECT count(*) FROM public.sessions");
    echo "sessions table count: " . $stmt->fetchColumn() . "\n";
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
