<?php
require_once __DIR__ . '/../config/config.php';

$progs = supabaseRequest('training_programs', 'GET', null, true);
echo "=== TRAINING PROGRAMS ===\n";
print_r($progs['data'] ?? []);

$needs = supabaseRequest('training_needs', 'GET', null, true);
echo "\n=== TRAINING NEEDS ===\n";
print_r($needs['data'] ?? []);
