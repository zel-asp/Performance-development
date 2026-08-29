<?php

require_once __DIR__ . '/../models/TrainingNeedModel.php';
require_once __DIR__ . '/../models/CompetencyModel.php';
require_once __DIR__ . '/../config/config.php';

echo "========================================================================\n";
echo " Oxford Suites, Makati — Dynamic Skill Gap & TNA Scanner (< 3.8)\n";
echo " Database Target: " . SUPABASE_URL . "\n";
echo "========================================================================\n\n";

$needModel = new TrainingNeedModel();
$competencyModel = new CompetencyModel();

// 1. Fetch employees from Supabase
$empRes = supabaseRequest('employees?order=full_name.asc', 'GET', null, true);
$employees = is_array($empRes['data']) ? $empRes['data'] : [];

if (empty($employees)) {
    $userRes = supabaseRequest('users?order=full_name.asc', 'GET', null, true);
    $employees = is_array($userRes['data']) ? $userRes['data'] : [];
}

echo "Found " . count($employees) . " total associate profiles to scan.\n\n";

$totalDeficitsFound = 0;
foreach ($employees as $emp) {
    $empId = $emp['id'];
    $empName = $emp['full_name'] ?? ($emp['name'] ?? 'Associate');
    $empRole = $emp['title'] ?? ($emp['role'] ?? 'Staff');
    
    echo "🔍 Scanning Associate [{$empId}] {$empName} ({$empRole})...\n";
    
    $synced = $needModel->syncDeficitsFromAssessments($empId);
    $deficitCount = count($synced);
    $totalDeficitsFound += $deficitCount;
    
    if ($deficitCount > 0) {
        echo "   ⚠️  Found {$deficitCount} active deficit(s) < 3.8 score requiring training intervention:\n";
        foreach ($synced as $d) {
            $compName = $d['targetCompetency'] ?? ($d['target_competency'] ?? 'Competency');
            $score = $d['currentScore'] ?? ($d['current_score'] ?? 0);
            $reqScore = $d['requiredScore'] ?? ($d['required_score'] ?? 4.5);
            $gap = $d['gap'] ?? 0;
            $progId = $d['linkedProgramId'] ?? ($d['linked_program_id'] ?? 'Unassigned');
            $urgency = $d['urgency'] ?? 'High';
            echo "      • [{$urgency}] {$compName}: Score {$score} / {$reqScore} (Gap: {$gap}) -> Linked Program: {$progId}\n";
        }
    } else {
        echo "   ✅ All assessed competencies meet or exceed benchmark standard (>= 3.80).\n";
    }
    echo "\n";
}

// 2. Fetch summary of current active training needs
$allNeeds = $needModel->getNeeds();
$activeNeeds = array_filter($allNeeds, fn($n) => ($n['status'] ?? '') !== 'Resolved' && ($n['status'] ?? '') !== 'Completed');
$resolvedNeeds = array_filter($allNeeds, fn($n) => ($n['status'] ?? '') === 'Resolved' || ($n['status'] ?? '') === 'Completed');

echo "========================================================================\n";
echo " Scan Complete!\n";
echo " • Total Active Deficits in Queue: " . count($activeNeeds) . "\n";
echo " • Total Resolved Training History: " . count($resolvedNeeds) . "\n";
echo " • System Status: Training Management is connected to Supabase Database.\n";
echo "========================================================================\n";
