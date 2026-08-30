<?php
require_once __DIR__ . '/../config/config.php';

echo "=== 1. role_based_accounts ===\n";
$rba = supabaseRequest('role_based_accounts?select=*', 'GET', null, true);
print_r($rba);

echo "=== 2. employees ===\n";
$emp = supabaseRequest('employees?select=*', 'GET', null, true);
print_r($emp);

echo "=== 3. users ===\n";
$usr = supabaseRequest('users?select=id,full_name,email,role,role_key,status', 'GET', null, true);
print_r($usr);

echo "=== 4. sessions ===\n";
$ses = supabaseRequest('sessions?select=*', 'GET', null, true);
print_r($ses);
