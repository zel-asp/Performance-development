<?php
require_once __DIR__ . '/../controllers/CompetencyController.php';

$controller = new CompetencyController();

echo "--- 1. Testing getDepartments() ---\n";
$depts = $controller->getDepartments();
echo "Depts count: " . count($depts['data']) . "\n";

echo "\n--- 2. Testing getCompetencies() for Front Office ---\n";
$foId = '967ff30a-61cf-4bda-a839-58439aaaa231';
$comps = $controller->getCompetencies(['department_id' => $foId]);
echo "FO Competencies count: " . count($comps['data']) . "\n";
foreach ($comps['data'] as $c) {
    echo "  - {$c['name']} (scope: {$c['scope']})\n";
}

echo "\n--- 3. Testing getMatrixData() for Front Office ---\n";
$matrixFO = $controller->getMatrixData(['department_id' => $foId]);
echo "Matrix FO Employees count: " . count($matrixFO['employees']) . "\n";
echo "Matrix FO Competencies count: " . count($matrixFO['competencies']) . "\n";
foreach ($matrixFO['employees'] as $emp) {
    echo "  Employee: {$emp['full_name']} ({$emp['title']}) - Overall: {$emp['overall_formatted']}\n";
}

echo "\n--- 4. Testing getMatrixData() for Housekeeping ---\n";
$hkId = '505ff947-5c21-4f4a-a117-27d4d7dac341';
$matrixHK = $controller->getMatrixData(['department_id' => $hkId]);
echo "Matrix HK Employees count: " . count($matrixHK['employees']) . "\n";
echo "Matrix HK Competencies count: " . count($matrixHK['competencies']) . "\n";
foreach ($matrixHK['competencies'] as $c) {
    echo "  - {$c['name']} ({$c['scope']})\n";
}
foreach ($matrixHK['employees'] as $emp) {
    echo "  Employee: {$emp['full_name']} ({$emp['title']}) - Overall: {$emp['overall_formatted']}\n";
}
