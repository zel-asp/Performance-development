<?php
require_once __DIR__ . '/../config/config.php';

$res = supabaseRequest('performance_goals?select=*', 'GET', null, true);
echo "Goals res:\n";
var_dump($res);

$evals = supabaseRequest('evaluations?select=*', 'GET', null, true);
echo "Evals res:\n";
var_dump($evals);
