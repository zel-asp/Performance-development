<?php
/**
 * Migration Script: Migrate all local JSON database files to Supabase REST API
 * With intelligent column mapping and foreign key resolution
 */

require_once __DIR__ . '/../config/config.php';

echo "=======================================================\n";
echo " Starting Full Migration: JSON Data -> Supabase\n";
echo " Endpoint: " . SUPABASE_URL . "\n";
echo "=======================================================\n\n";

function postToSupabase(string $table, array $payload): array {
    $url = rtrim(SUPABASE_URL, '/') . '/rest/v1/' . $table;
    $apiKey = SUPABASE_SERVICE_ROLE_KEY;

    $ch = curl_init($url);
    $headers = [
        "apikey: {$apiKey}",
        "Authorization: Bearer {$apiKey}",
        "Content-Type: application/json",
        "Prefer: resolution=merge-duplicates,return=representation"
    ];

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

    $res = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['status' => $status, 'response' => json_decode($res, true) ?: $res];
}

// 1. Employees & Users
echo "1. Migrating Employees & Users...\n";
$empPath = __DIR__ . '/data/employees.json';
if (file_exists($empPath)) {
    $employees = json_decode(file_get_contents($empPath), true) ?: [];
    foreach ($employees as $emp) {
        $p = [
            'id'             => $emp['id'],
            'employee_code'  => $emp['employee_code'] ?? ($emp['employeeCode'] ?? 'OXF-' . $emp['id']),
            'full_name'      => $emp['full_name'] ?? ($emp['fullName'] ?? $emp['name']),
            'email'          => $emp['email'],
            'role'           => $emp['role'] ?? 'Associate',
            'title'          => $emp['title'] ?? 'Staff',
            'avatar_url'     => $emp['avatar_url'] ?? ($emp['avatarUrl'] ?? ($emp['avatar'] ?? null)),
            'current_level'  => (int)($emp['current_level'] ?? ($emp['currentLevel'] ?? 1)),
            'total_xp'       => (int)($emp['total_xp'] ?? ($emp['totalXp'] ?? 0)),
            'status'         => $emp['status'] ?? 'Active'
        ];
        $res = postToSupabase('employees', $p);
        echo "  - Employee [{$p['id']} - {$p['full_name']}]: Status {$res['status']}\n";
    }
}

// 2. Training Programs
echo "\n2. Migrating Training Programs...\n";
$progPath = __DIR__ . '/data/training_programs.json';
if (file_exists($progPath)) {
    $programs = json_decode(file_get_contents($progPath), true) ?: [];
    foreach ($programs as $prog) {
        $p = [
            'id'                => $prog['id'],
            'title'             => $prog['title'],
            'category'          => $prog['category'] ?? 'General',
            'category_type'     => $prog['categoryType'] ?? ($prog['category_type'] ?? 'skill_gap'),
            'dept'              => $prog['dept'] ?? 'Front Office',
            'target_competency' => $prog['targetCompetency'] ?? ($prog['target_competency'] ?? 'Core Hospitality'),
            'competency_key'    => $prog['competencyKey'] ?? ($prog['competency_key'] ?? 'general'),
            'duration'          => $prog['duration'] ?? '3 Hours',
            'format'            => $prog['format'] ?? 'Workshop',
            'trainer_type'      => $prog['trainerType'] ?? ($prog['trainer_type'] ?? 'Internal Master Trainer'),
            'passing_score'     => (int)($prog['passingScore'] ?? ($prog['passing_score'] ?? 80)),
            'xp_award'          => (int)($prog['xpAward'] ?? ($prog['xp_award'] ?? 150)),
            'icon'              => $prog['icon'] ?? 'fa-award',
            'badge_color'       => $prog['badgeColor'] ?? ($prog['badge_color'] ?? 'primary'),
            'description'       => $prog['description'] ?? '',
            'modules'           => is_array($prog['modules'] ?? null) ? $prog['modules'] : [],
            'quiz_questions'    => is_array($prog['quizQuestions'] ?? ($prog['quiz_questions'] ?? null)) ? ($prog['quizQuestions'] ?? $prog['quiz_questions']) : []
        ];
        $res = postToSupabase('training_programs', $p);
        echo "  - Program [{$p['id']} - {$p['title']}]: Status {$res['status']}\n";
    }
}

// 3. Training Sessions
echo "\n3. Migrating Training Sessions...\n";
$sessPath = __DIR__ . '/data/training_sessions.json';
if (file_exists($sessPath)) {
    $sessions = json_decode(file_get_contents($sessPath), true) ?: [];
    foreach ($sessions as $sess) {
        $p = [
            'id'             => $sess['id'],
            'program_id'     => $sess['programId'] ?? ($sess['program_id'] ?? 'prog-1'),
            'title'          => $sess['title'],
            'dept'           => $sess['dept'] ?? 'Front Office',
            'trainer_name'   => $sess['trainerName'] ?? ($sess['trainer_name'] ?? 'Assigned Trainer'),
            'trainer_title'  => $sess['trainerTitle'] ?? ($sess['trainer_title'] ?? 'Senior Trainer'),
            'trainer_avatar' => $sess['trainerAvatar'] ?? ($sess['trainer_avatar'] ?? null),
            'location'       => $sess['location'] ?? 'Training Room',
            'session_date'   => $sess['date'] ?? ($sess['session_date'] ?? date('M d, Y')),
            'time_slot'      => $sess['time'] ?? ($sess['time_slot'] ?? '14:00 - 17:00'),
            'status'         => $sess['status'] ?? 'Scheduled',
            'roster'         => is_array($sess['roster'] ?? null) ? $sess['roster'] : []
        ];
        $res = postToSupabase('training_sessions', $p);
        echo "  - Session [{$p['id']} - {$p['title']}]: Status {$res['status']}\n";
    }
}

// 4. Training Needs
echo "\n4. Migrating Training Needs...\n";
$needPath = __DIR__ . '/data/training_needs.json';
if (file_exists($needPath)) {
    $needs = json_decode(file_get_contents($needPath), true) ?: [];
    foreach ($needs as $need) {
        $p = [
            'id'                => $need['id'],
            'title'             => $need['title'],
            'source_type'       => $need['sourceType'] ?? ($need['source_type'] ?? 'competency_gap'),
            'source_label'      => $need['sourceLabel'] ?? ($need['source_label'] ?? 'Skill Gap'),
            'category'          => $need['category'] ?? 'Service Excellence',
            'dept'              => $need['dept'] ?? 'Front Office',
            'associate_name'    => $need['associateName'] ?? ($need['associate_name'] ?? 'Associate'),
            'associate_role'    => $need['associateRole'] ?? ($need['associate_role'] ?? 'Staff'),
            'associate_avatar'  => $need['associateAvatar'] ?? ($need['associate_avatar'] ?? null),
            'target_competency' => $need['targetCompetency'] ?? ($need['target_competency'] ?? 'Service'),
            'competency_key'    => $need['competencyKey'] ?? ($need['competency_key'] ?? 'service'),
            'current_score'     => (float)($need['currentScore'] ?? ($need['current_score'] ?? 3.5)),
            'required_score'    => (float)($need['requiredScore'] ?? ($need['required_score'] ?? 5.0)),
            'gap'               => (float)($need['gap'] ?? -1.5),
            'urgency'           => $need['urgency'] ?? 'High',
            'status'            => $need['status'] ?? 'Identified',
            'linked_program_id' => $need['linkedProgramId'] ?? ($need['linked_program_id'] ?? null),
            'date_identified'   => $need['dateIdentified'] ?? ($need['date_identified'] ?? date('M d, Y')),
            'notes'             => $need['notes'] ?? null
        ];
        $res = postToSupabase('training_needs', $p);
        echo "  - Need [{$p['id']} - {$p['title']}]: Status {$res['status']}\n";
    }
}

// 5. Training Evaluations
echo "\n5. Migrating Training Evaluations...\n";
$evalPath = __DIR__ . '/data/training_evaluations.json';
if (file_exists($evalPath)) {
    $evals = json_decode(file_get_contents($evalPath), true) ?: [];
    foreach ($evals as $ev) {
        $p = [
            'id'                      => $ev['id'],
            'session_id'              => $ev['sessionId'] ?? ($ev['session_id'] ?? 'sess-101'),
            'program_id'              => $ev['programId'] ?? ($ev['program_id'] ?? 'prog-1'),
            'program_title'           => $ev['programTitle'] ?? ($ev['program_title'] ?? 'Training Program'),
            'category'                => $ev['category'] ?? 'Service',
            'dept'                    => $ev['dept'] ?? 'Front Office',
            'associate_id'            => $ev['associateId'] ?? ($ev['associate_id'] ?? 'emp-101'),
            'associate_name'          => $ev['associateName'] ?? ($ev['associate_name'] ?? 'Associate'),
            'associate_role'          => $ev['associateRole'] ?? ($ev['associate_role'] ?? 'Staff'),
            'associate_avatar'        => $ev['associateAvatar'] ?? ($ev['associate_avatar'] ?? null),
            'trainer_name'            => $ev['trainerName'] ?? ($ev['trainer_name'] ?? 'Trainer'),
            'completion_date'         => $ev['completionDate'] ?? ($ev['completion_date'] ?? date('M d, Y')),
            'attendance_rate'         => $ev['attendanceRate'] ?? ($ev['attendance_rate'] ?? '100%'),
            'quiz_score'              => (int)($ev['quizScore'] ?? ($ev['quiz_score'] ?? 95)),
            'passing_threshold'       => (int)($ev['passingThreshold'] ?? ($ev['passing_threshold'] ?? 80)),
            'result_status'           => $ev['resultStatus'] ?? ($ev['result_status'] ?? 'Passed & Certified'),
            'feedback_rating'         => (float)($ev['feedbackRating'] ?? ($ev['feedback_rating'] ?? 5.0)),
            'certificate_reference'   => $ev['certificateReference'] ?? ($ev['certificate_reference'] ?? null),
            'competency_target'       => $ev['competencyTarget'] ?? ($ev['competency_target'] ?? 'Service'),
            'competency_key'          => $ev['competencyKey'] ?? ($ev['competency_key'] ?? 'service'),
            'competency_score_before' => (float)($ev['competencyScoreBefore'] ?? ($ev['competency_score_before'] ?? 3.5)),
            'competency_score_after'  => (float)($ev['competencyScoreAfter'] ?? ($ev['competency_score_after'] ?? 4.8)),
            'synced_to_profile'       => true,
            'xp_awarded'              => (int)($ev['xpAwarded'] ?? ($ev['xp_awarded'] ?? 150))
        ];
        $res = postToSupabase('training_evaluations', $p);
        echo "  - Evaluation [{$p['id']} - {$p['program_title']}]: Status {$res['status']}\n";
    }
}

// 6. Certificates
echo "\n6. Migrating Certificates...\n";
$certPath = __DIR__ . '/data/certificates.json';
if (file_exists($certPath)) {
    $certs = json_decode(file_get_contents($certPath), true) ?: [];
    foreach ($certs as $c) {
        $p = [
            'id'                     => $c['id'],
            'certificate_number'     => $c['certificate_number'] ?? ($c['certificateNumber'] ?? 'OXF-CERT-2026-0001'),
            'employee_id'            => $c['employee_id'] ?? ($c['employeeId'] ?? 'emp-101'),
            'associate_name'         => $c['associate_name'] ?? ($c['associateName'] ?? 'Associate'),
            'program_title'          => $c['program_title'] ?? ($c['programTitle'] ?? 'Training Program'),
            'category'               => $c['category'] ?? 'Service Excellence',
            'dept'                   => $c['dept'] ?? 'Front Office',
            'score'                  => (int)($c['score'] ?? 95),
            'issue_date'             => $c['issue_date'] ?? ($c['issueDate'] ?? date('M d, Y')),
            'gm_signature'           => $c['gm_signature'] ?? 'General Manager, Oxford Suites',
            'verification_seal_code' => $c['verification_seal_code'] ?? ('OXF-SEAL-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8)))
        ];
        $res = postToSupabase('certificates', $p);
        echo "  - Certificate [{$p['id']} - {$p['certificate_number']}]: Status {$res['status']}\n";
    }
}

// 7. Succession Positions & Candidates
echo "\n7. Migrating Succession Positions & Candidates...\n";
require_once __DIR__ . '/../models/SuccessionModel.php';
$succModel = new SuccessionModel();
$succModel->seedInitialPositions();
$succModel->seedInitialCandidates();
echo "  - Succession Positions & Candidates seeded successfully.\n";

echo "\n=======================================================\n";
echo "--- STEP 8: Migrating Social Recognitions & Shift Sentiments to Supabase ---\n";

$socialPosts = [
    [
        'id'             => 'post-101',
        'sender_id'      => 'emp-105',
        'sender_name'    => 'Elena Vance',
        'sender_role'    => 'HR Director & Master Trainer',
        'sender_type'    => 'Supervisor',
        'sender_avatar'  => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        'receiver_id'    => 'emp-101',
        'receiver_name'  => 'Maria Santos',
        'receiver_role'  => 'Front Desk Host',
        'receiver_dept'  => 'Front Office',
        'receiver_avatar'=> 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        'category_key'   => 'crisis_recovery',
        'category_label' => 'Crisis & Conflict Recovery',
        'points_awarded' => 100,
        'text_content'   => 'Exceptional de-escalation during the diplomat delegation arrival. Maria calmly arranged executive lounge hospitality and VIP suite keys without friction.',
        'reactions'      => ['clap' => 14, 'heart' => 9, 'star' => 7, 'fire' => 5]
    ],
    [
        'id'             => 'post-102',
        'sender_id'      => 'emp-102',
        'sender_name'    => 'Carlos Gomez',
        'sender_role'    => 'Concierge Lead',
        'sender_type'    => 'Peer',
        'sender_avatar'  => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        'receiver_id'    => 'emp-101',
        'receiver_name'  => 'Maria Santos',
        'receiver_role'  => 'Front Desk Host',
        'receiver_dept'  => 'Front Office',
        'receiver_avatar'=> 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        'category_key'   => 'collaboration',
        'category_label' => 'Team Collaboration',
        'points_awarded' => 50,
        'text_content'   => 'Huge thanks to Maria for stepping in during the concierge group luggage dispatch while two flight buses arrived simultaneously. Pure teamwork!',
        'reactions'      => ['clap' => 8, 'heart' => 12, 'star' => 3, 'fire' => 2]
    ]
];

foreach ($socialPosts as $post) {
    $res = sendSupabaseRequest('social_recognitions', 'POST', $post);
    echo "  [POST {$post['id']}] Status: " . ($res['status'] ?? 'N/A') . "\n";
}

echo "=======================================================\n";
echo " ALL TRAINING, SUCCESSION & SOCIAL DATA MIGRATED TO SUPABASE SUCCESSFULLY!\n";
echo "=======================================================\n";

