<?php
/**
 * QA & Dynamic Analysis Test for Training, Succession, and Social Recognition Modules
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../controllers/TrainingController.php';
require_once __DIR__ . '/../controllers/AttendanceController.php';
require_once __DIR__ . '/../controllers/EvaluationController.php';
require_once __DIR__ . '/../controllers/CertificationController.php';
require_once __DIR__ . '/../controllers/SuccessionController.php';
require_once __DIR__ . '/../controllers/SocialController.php';

echo "=== STARTING FUNCTIONAL QA SUITE ===\n\n";

$pdo = getSupabaseDb();
if (!$pdo) {
    echo "[FAIL] Database connection failed!\n";
    exit(1);
}
echo "[PASS] PostgreSQL/Supabase DB connected successfully.\n\n";

// ==========================================
// TEST 1: TRAINING MANAGEMENT MODULE
// ==========================================
echo "--- 1. TESTING TRAINING MANAGEMENT ---\n";
$trainingCtrl = new TrainingController();
$attendanceCtrl = new AttendanceController();
$evaluationCtrl = new EvaluationController();
$certCtrl = new CertificationController();

// 1.1 Bootstrap
$bootstrap = $trainingCtrl->getBootstrapData(['role' => 'HRAdmin']);
if ($bootstrap['success'] && isset($bootstrap['data']['programs'], $bootstrap['data']['sessions'], $bootstrap['data']['needs'])) {
    echo "[PASS] Training bootstrap: " . count($bootstrap['data']['programs']) . " programs, " . count($bootstrap['data']['sessions']) . " sessions, " . count($bootstrap['data']['needs']) . " needs.\n";
} else {
    echo "[FAIL] Training bootstrap failed.\n";
}

// 1.2 Program Creation
$testProgId = 'test-prog-' . time();
$newProg = $trainingCtrl->createProgram([
    'id' => $testProgId,
    'title' => 'QA Dynamic Fire Safety & Evacuation Drill',
    'category' => 'Mandatory Compliance',
    'dept' => 'Front Office',
    'duration' => '2.5 Hours',
    'passingScore' => 80,
    'xpAward' => 150,
    'targetCompetency' => 'Emergency Response Protocol',
    'competencyKey' => 'emergency_response',
    'quizQuestions' => [
        ['q' => 'Where is the designated assembly point?', 'options' => ['Front Garden', 'Basement', 'Roof'], 'correct' => 0],
        ['q' => 'What code is announced for fire alert?', 'options' => ['Code Red', 'Code Blue', 'Code Gold'], 'correct' => 0]
    ]
]);
if ($newProg['success']) {
    echo "[PASS] Training createProgram: Created program '{$testProgId}'.\n";
} else {
    echo "[FAIL] Training createProgram: " . ($newProg['message'] ?? 'Unknown error') . "\n";
}

// 1.3 Session Scheduling
$testSessId = 'test-sess-' . time();
$testEmpId = '3a52667f-53cf-412a-b048-ef96eb407707'; // Juan Dela Cruz or first available
// Get a real employee ID
$empRow = $pdo->query("SELECT id, full_name, role, department_id FROM public.employees LIMIT 1")->fetch(PDO::FETCH_ASSOC);
if ($empRow) {
    $testEmpId = $empRow['id'];
    $testEmpName = $empRow['full_name'];
} else {
    $testEmpName = 'Test Associate';
}

$newSess = $trainingCtrl->createSession([
    'id' => $testSessId,
    'programId' => $testProgId,
    'title' => 'QA Fire Safety Drill Session',
    'dept' => 'Front Office',
    'trainerName' => 'Chief Security Officer',
    'location' => 'Lower Ground Briefing Room',
    'date' => date('Y-m-d', strtotime('+3 days')),
    'time' => '10:00 - 12:30',
    'roster' => [
        [
            'associateId' => $testEmpId,
            'name' => $testEmpName,
            'attendanceStatus' => 'Scheduled',
            'attendanceRate' => 0
        ]
    ]
]);
if ($newSess['success']) {
    echo "[PASS] Training createSession: Scheduled session '{$testSessId}' for '{$testEmpName}'.\n";
} else {
    echo "[FAIL] Training createSession: " . ($newSess['message'] ?? 'Unknown error') . "\n";
}

// 1.4 Attendance Tracking
$attRes = $attendanceCtrl->updateAttendance([
    'sessionId' => $testSessId,
    'associateId' => $testEmpId,
    'status' => 'Attended',
    'role' => 'HRAdmin'
]);
if ($attRes['success']) {
    echo "[PASS] Training updateAttendance: Marked employee as 'Attended'.\n";
} else {
    echo "[FAIL] Training updateAttendance: " . ($attRes['message'] ?? 'Unknown error') . "\n";
}

// 1.5 Evaluation & Auto-grading & Kirkpatrick Level 1
$evalRes = $evaluationCtrl->submitEvaluation([
    'sessionId' => $testSessId,
    'programId' => $testProgId,
    'associateId' => $testEmpId,
    'answers' => [0 => 0, 1 => 0], // 100% score
    'kirkpatrickFeedback' => [
        'trainerRating' => 5.0,
        'relevanceRating' => 5.0,
        'comments' => 'Clear evacuation steps and great hands-on extinguisher practice.'
    ],
    'role' => 'Associate'
]);

if ($evalRes['success'] && !empty($evalRes['data']['isPassed'])) {
    $certNo = $evalRes['data']['certificateNumber'] ?? 'N/A';
    echo "[PASS] Training submitEvaluation: Auto-graded 100%, Passed! Certificate issued: {$certNo}\n";
    echo "       XP Awarded: " . ($evalRes['data']['evaluation']['xpAwarded'] ?? 0) . " XP.\n";
} else {
    echo "[FAIL] Training submitEvaluation: " . ($evalRes['message'] ?? 'Unknown error') . "\n";
}

// Check if certificate exists in DB
$certCheck = $pdo->query("SELECT * FROM public.certificates WHERE employee_id = " . $pdo->quote($testEmpId) . " ORDER BY created_at DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
if ($certCheck) {
    echo "[PASS] DB Check: Certificate verified in public.certificates (Cert #: {$certCheck['certificate_number']}).\n";
} else {
    echo "[WARN] Certificate not found in public.certificates table.\n";
}

// Check training reports
$reports = $trainingCtrl->getReports(['role' => 'HRAdmin']);
if ($reports['success']) {
    echo "[PASS] Training getReports: Generated summary analytics.\n";
} else {
    echo "[FAIL] Training getReports failed.\n";
}


// ==========================================
// TEST 2: SUCCESSION PLANNING MODULE
// ==========================================
echo "\n--- 2. TESTING SUCCESSION PLANNING ---\n";
$succCtrl = new SuccessionController();
$succOverview = $succCtrl->getSuccessionOverview();

if ($succOverview['success']) {
    $positions = $succOverview['data']['positions'] ?? [];
    $candidates = $succOverview['data']['candidates'] ?? [];
    $nineBox = $succOverview['data']['nineBoxRoster'] ?? [];
    echo "[PASS] Succession Overview: " . count($positions) . " positions, " . count($candidates) . " candidates, 9-box grid loaded.\n";
    
    // Check candidate computation formula:
    if (!empty($candidates)) {
        $c0 = $candidates[0];
        $perf = (float)($c0['closedPerformanceRating'] ?? 0);
        $compMatch = (int)($c0['competencyMatchPct'] ?? 0);
        $readiness = (int)($c0['computedReadinessPercent'] ?? 0);
        $expected = (int)round(($perf / 5.0 * 40) + ($compMatch * 0.60));
        echo "[INFO] Candidate '{$c0['name']}': Perf={$perf}, CompMatch={$compMatch}%, Readiness={$readiness}% (Expected={$expected}%).\n";
        if (abs($readiness - $expected) <= 1) {
            echo "[PASS] Formula verified: (perf/5.0 * 40) + (compMatch * 0.60).\n";
        } else {
            echo "[WARN] Formula mismatch: got {$readiness}%, expected {$expected}%.\n";
        }
    }
    
    // Check 9-box distribution
    $totalIn9Box = 0;
    foreach ($nineBox as $box) {
        $totalIn9Box += count($box['items'] ?? []);
    }
    echo "[INFO] 9-Box Grid total talent plotted across 9 cells: {$totalIn9Box} candidates.\n";
} else {
    echo "[FAIL] Succession Overview failed: " . ($succOverview['message'] ?? '') . "\n";
}

// Test HR Flag Calibration
if (!empty($candidates[0])) {
    $cId = $candidates[0]['id'];
    $empId = $candidates[0]['employeeId'];
    $posId = $candidates[0]['positionId'];
    $flagTest = 'Ready Now';
    $notesTest = 'QA Test HR calibration assignment on ' . date('Y-m-d H:i:s');
    $calibRes = $succCtrl->updateHRFlag($cId, $flagTest, $notesTest, $empId, $posId);
    if ($calibRes['success']) {
        echo "[PASS] Succession updateHRFlag: calibrated flag to '{$flagTest}'.\n";
    } else {
        echo "[FAIL] Succession updateHRFlag: " . ($calibRes['message'] ?? '') . "\n";
    }
}


// ==========================================
// TEST 3: SOCIAL RECOGNITION MODULE
// ==========================================
echo "\n--- 3. TESTING SOCIAL RECOGNITION ---\n";
$socialCtrl = new SocialController();
$socOverview = $socialCtrl->getSocialOverview($testEmpId);

if ($socOverview['success']) {
    $feed = $socOverview['data']['recognitions'] ?? [];
    $ledger = $socOverview['data']['ledger'] ?? [];
    $badges = $socOverview['data']['badges'] ?? [];
    $champions = $socOverview['data']['champions'] ?? [];
    echo "[PASS] Social Overview: " . count($feed) . " feed posts, " . count($ledger) . " ledger entries, " . count($badges) . " badges, " . count($champions) . " champions.\n";
} else {
    echo "[FAIL] Social Overview failed: " . ($socOverview['message'] ?? '') . "\n";
}

// Test Peer Kudos (+50 XP)
$kudosPeer = $socialCtrl->giveRecognition([
    'senderType' => 'Peer',
    'senderId' => 'emp-test-peer',
    'senderName' => 'Maria Santos',
    'senderRole' => 'Front Desk Host',
    'receiverId' => $testEmpId,
    'receiverName' => $testEmpName,
    'categoryKey' => 'collaboration',
    'categoryLabel' => 'Team Collaboration',
    'textContent' => 'Awesome support during the peak check-in rush today!'
]);
if ($kudosPeer['success'] && ($kudosPeer['data']['points_awarded'] ?? 0) === 50) {
    echo "[PASS] Social giveRecognition (Peer): Correctly awarded deterministic +50 XP.\n";
} else {
    echo "[FAIL] Social giveRecognition (Peer): " . ($kudosPeer['message'] ?? '') . "\n";
}

// Test Supervisor Commendation (+100 XP)
$kudosSup = $socialCtrl->giveRecognition([
    'senderType' => 'Supervisor',
    'senderId' => 'emp-test-sup',
    'senderName' => 'Chef Marco Rossi',
    'senderRole' => 'Supervisor',
    'receiverId' => $testEmpId,
    'receiverName' => $testEmpName,
    'categoryKey' => 'operational_excellence',
    'categoryLabel' => 'Operational Excellence',
    'textContent' => 'Flawless execution during inspection.'
]);
if ($kudosSup['success'] && ($kudosSup['data']['points_awarded'] ?? 0) === 100) {
    echo "[PASS] Social giveRecognition (Supervisor): Correctly awarded deterministic +100 XP.\n";
} else {
    echo "[FAIL] Social giveRecognition (Supervisor): " . ($kudosSup['message'] ?? '') . "\n";
}

// Test Executive / GM Citation (+200 XP)
$kudosExec = $socialCtrl->giveRecognition([
    'senderType' => 'Executive',
    'senderId' => 'emp-test-gm',
    'senderName' => 'General Manager',
    'senderRole' => 'General Manager',
    'receiverId' => $testEmpId,
    'receiverName' => $testEmpName,
    'categoryKey' => 'guest_service',
    'categoryLabel' => 'Great Guest Service',
    'textContent' => 'Commended by VIP guest letter.'
]);
if ($kudosExec['success'] && ($kudosExec['data']['points_awarded'] ?? 0) === 200) {
    echo "[PASS] Social giveRecognition (Executive): Correctly awarded deterministic +200 XP.\n";
} else {
    echo "[FAIL] Social giveRecognition (Executive): " . ($kudosExec['message'] ?? '') . "\n";
}

// Verify XP ledger table in Supabase
$ledgerCheck = $pdo->query("SELECT * FROM public.xp_ledger WHERE employee_id = " . $pdo->quote($testEmpId) . " ORDER BY created_at DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
echo "[INFO] Verified " . count($ledgerCheck) . " recent ledger entries in public.xp_ledger for employee {$testEmpId}:\n";
foreach ($ledgerCheck as $row) {
    echo "       - [{$row['source_type']}] +{$row['points']} XP (Balance: {$row['balance_after']}) - {$row['description']}\n";
}

// Test LMS Quiz Pass Grant
$lmsGrant = $socialCtrl->triggerLmsQuizPass([
    'employeeId' => $testEmpId,
    'amount' => 120,
    'quizName' => 'HACCP Temperature Control Standards'
]);
if ($lmsGrant['success']) {
    echo "[PASS] Social triggerLmsQuizPass: Recorded +120 XP in ledger.\n";
} else {
    echo "[FAIL] Social triggerLmsQuizPass: " . ($lmsGrant['message'] ?? '') . "\n";
}

// Test Reactions
$postList = $pdo->query("SELECT id FROM public.social_recognitions ORDER BY created_at DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
if ($postList) {
    $postId = $postList['id'];
    $rxRes = $socialCtrl->addReaction($postId, 'clap', $testEmpId);
    if ($rxRes['success']) {
        echo "[PASS] Social addReaction: Added clap reaction to post '{$postId}'.\n";
    } else {
        echo "[FAIL] Social addReaction: " . ($rxRes['message'] ?? '') . "\n";
    }
}

// Clean up test session and program created
$pdo->exec("DELETE FROM public.training_sessions WHERE id = " . $pdo->quote($testSessId));
$pdo->exec("DELETE FROM public.training_programs WHERE id = " . $pdo->quote($testProgId));
echo "\n[INFO] Cleaned up temporary test session and program.\n";

echo "\n=== QA COMPLETED ===\n";
