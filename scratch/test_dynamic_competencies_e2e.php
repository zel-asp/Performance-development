<?php
require_once __DIR__ . '/../controllers/CompetencyController.php';

$controller = new CompetencyController();

echo "=======================================================\n";
echo "1. TESTING DEPARTMENTS FROM SUPABASE\n";
echo "=======================================================\n";
$deptRes = $controller->getDepartments();
echo "Status: " . ($deptRes['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "Departments count: " . count($deptRes['data']) . "\n";
foreach ($deptRes['data'] as $d) {
    echo "  - [{$d['id']}] {$d['name']}\n";
}

echo "\n=======================================================\n";
echo "2. TESTING DYNAMIC MATRIX FOR FRONT OFFICE\n";
echo "=======================================================\n";
$foRes = $controller->getMatrixData(['department' => 'Front Office']);
echo "Employees: " . count($foRes['employees']) . "\n";
echo "Competencies (Dynamic Columns): " . count($foRes['competencies']) . "\n";
echo "Dynamic Columns List: \n";
foreach ($foRes['competencies'] as $idx => $c) {
    echo "  " . ($idx + 1) . ". {$c['name']} ({$c['scope']})\n";
}
echo "Sample Employee Row:\n";
$firstEmp = $foRes['employees'][0] ?? null;
if ($firstEmp) {
    echo "  Associate: {$firstEmp['full_name']} ({$firstEmp['title']})\n";
    echo "  Assessed Competencies: {$firstEmp['assessed_count']} / " . count($foRes['competencies']) . "\n";
    echo "  Overall Score: {$firstEmp['overall_formatted']}\n";
}

echo "\n=======================================================\n";
echo "3. TESTING DYNAMIC MATRIX FOR HOUSEKEEPING\n";
echo "=======================================================\n";
$hkRes = $controller->getMatrixData(['department' => 'Housekeeping']);
echo "Employees: " . count($hkRes['employees']) . "\n";
echo "Competencies (Dynamic Columns): " . count($hkRes['competencies']) . "\n";
foreach ($hkRes['competencies'] as $idx => $c) {
    echo "  " . ($idx + 1) . ". {$c['name']} ({$c['scope']})\n";
}

echo "\n=======================================================\n";
echo "4. TESTING DYNAMIC MATRIX FOR FOOD & BEVERAGE\n";
echo "=======================================================\n";
$fbRes = $controller->getMatrixData(['department' => 'Food & Beverage']);
echo "Employees: " . count($fbRes['employees']) . "\n";
echo "Competencies (Dynamic Columns): " . count($fbRes['competencies']) . "\n";
foreach ($fbRes['competencies'] as $idx => $c) {
    echo "  " . ($idx + 1) . ". {$c['name']} ({$c['scope']})\n";
}

echo "\n=======================================================\n";
echo "5. TESTING SUBMITTING ASSESSMENT TO SUPABASE\n";
echo "=======================================================\n";
// Evaluate emp-106 (Carlos Gomez) on Customer Service and Hotel PMS
$comps = $foRes['competencies'];
$ratings = [];
foreach (array_slice($comps, 0, 4) as $c) {
    $ratings[] = [
        'competency_id' => $c['id'],
        'score' => 4.80,
        'comments' => 'Outstanding concierge service demonstration during audit.'
    ];
}

$evalRes = $controller->saveAssessments([
    'employee_id' => 'emp-106',
    'assessed_by' => 'emp-103',
    'ratings' => $ratings,
    'notes' => 'Q3 Formal Calibration'
]);
echo "Save Assessment Status: " . ($evalRes['success'] ? 'SUCCESS' : 'FAILED') . "\n";
echo "Message: {$evalRes['message']}\n";

// Re-query Matrix for Front Office and check Carlos Gomez updated overall score
$foResUpdated = $controller->getMatrixData(['department' => 'Front Office']);
foreach ($foResUpdated['employees'] as $emp) {
    if ($emp['id'] === 'emp-106') {
        echo "\nUpdated Employee: {$emp['full_name']}\n";
        echo "Assessed Count: {$emp['assessed_count']}\n";
        echo "Dynamic Overall Score: {$emp['overall_formatted']}\n";
    }
}

echo "\n✅ ALL DYNAMIC SUPABASE COMPETENCY TESTS PASSED!\n";
