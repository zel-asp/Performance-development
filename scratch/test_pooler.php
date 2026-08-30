<?php
$pass = 'YD$%-3@x9$wi_hj';
$user = 'postgres.jvxnrgcxegzhyaekxdok';
$regions = ['ap-southeast-1', 'us-east-1', 'eu-central-1', 'ap-northeast-1', 'us-west-1'];

foreach ($regions as $r) {
    $host = "aws-0-{$r}.pooler.supabase.com";
    $ports = [6543, 5432];
    foreach ($ports as $port) {
        try {
            $dsn = "pgsql:host={$host};port={$port};dbname=postgres;sslmode=require";
            $pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 3
            ]);
            echo "SUCCESS connected to {$host}:{$port}!\n";
            $sql = file_get_contents(__DIR__ . '/../database/sessions.sql');
            $pdo->exec($sql);
            echo "Executed sessions.sql successfully!\n";
            break 2;
        } catch (\Throwable $e) {
            echo "Failed {$host}:{$port}: " . $e->getMessage() . "\n";
        }
    }
}
