<?php
require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/controllers/LmsController.php';


$ctrl = new LmsController();
echo "=== LMS PRESCRIBED LIST ===\n";
print_r($ctrl->getPrescribedDocuments([]));

