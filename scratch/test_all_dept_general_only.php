<?php
require_once __DIR__ . '/../controllers/CompetencyController.php';

$controller = new CompetencyController();

echo "=======================================================\n";
echo "TEST 1: MATRIX TABLE WITH 'ALL DEPARTMENTS'\n";
echo "=======================================================\n";
$allRes = $controller->getMatrixData(['department' => 'all']);
echo "Total Competencies in Matrix for All Depts: " . count($allRes['competencies']) . "\n";
echo "Columns:\n";
foreach ($allRes['competencies'] as $idx => $c) {
    echo "  " . ($idx + 1) . ". {$c['name']} (Scope: {$c['scope']})\n";
}

echo "\n=======================================================\n";
echo "TEST 2: MATRIX TABLE WITH 'FRONT OFFICE'\n";
echo "=======================================================\n";
$foRes = $controller->getMatrixData(['department' => 'Front Office']);
echo "Total Competencies in Matrix for Front Office: " . count($foRes['competencies']) . "\n";
echo "Columns:\n";
foreach ($foRes['competencies'] as $idx => $c) {
    echo "  " . ($idx + 1) . ". {$c['name']} (Scope: {$c['scope']})\n";
}

echo "\n=======================================================\n";
echo "TEST 3: EVALUATE MODAL COMPETENCIES FOR FRONT OFFICE EMPLOYEE\n";
echo "=======================================================\n";
$foDeptId = '967ff30a-61cf-4bda-a839-58439aaaa231';
$foModalComps = $controller->getCompetencies(['department_id' => $foDeptId]);
echo "Total Competencies in Evaluate Modal for Front Office Associate: " . count($foModalComps['data']) . "\n";
foreach ($foModalComps['data'] as $idx => $c) {
    echo "  " . ($idx + 1) . ". {$c['name']} (Scope: {$c['scope']})\n";
}

echo "\n=======================================================\n";
echo "TEST 4: EVALUATE MODAL COMPETENCIES FOR HOUSEKEEPING EMPLOYEE\n";
echo "=======================================================\n";
$hkDeptId = '505ff947-5c21-4f4a-a117-27d4d7dac341';
$hkModalComps = $controller->getCompetencies(['department_id' => $hkDeptId]);
echo "Total Competencies in Evaluate Modal for Housekeeping Associate: " . count($hkModalComps['data']) . "\n";
foreach ($hkModalComps['data'] as $idx => $c) {
    echo "  " . ($idx + 1) . ". {$c['name']} (Scope: {$c['scope']})\n";
}

echo "\n✅ VERIFICATION COMPLETE!\n";
