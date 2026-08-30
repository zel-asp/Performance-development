<?php
require_once __DIR__ . '/../config/config.php';

// Let's test DNS resolution
$hosts = [
    'db.jvxnrgcxegzhyaekxdok.supabase.co',
    'aws-0-ap-southeast-1.pooler.supabase.com',
    'aws-0-us-east-1.pooler.supabase.com'
];
foreach ($hosts as $h) {
    $ip = gethostbyname($h);
    echo "Host $h -> $ip\n";
}
