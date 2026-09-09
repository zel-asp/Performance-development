<?php
require_once __DIR__ . '/../config/config.php';
$conn = getSupabaseDb();
$stmt = $conn->query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE '%goal%' OR table_name LIKE '%perf%'");
print_r($stmt->fetchAll(PDO::FETCH_COLUMN));
