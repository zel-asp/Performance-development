<?php
require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/controllers/CompetencyController.php';


$ctrl = new CompetencyController();

echo "=== ASSESSMENTS FOR emp-101 ===\n";
print_r($ctrl->getAssessments(['employee_id' => 'emp-101']));

echo "=== ASSESSMENTS FOR maria_santos ===\n";
print_r($ctrl->getAssessments(['employee_id' => 'maria_santos']));

echo "=== ASSESSMENTS FOR emp-102 ===\n";
print_r($ctrl->getAssessments(['employee_id' => 'emp-102']));

echo "=== ASSESSMENTS FOR emp-103 ===\n";
print_r($ctrl->getAssessments(['employee_id' => 'emp-103']));


