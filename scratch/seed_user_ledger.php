<?php
require_once __DIR__ . '/../config/config.php';
$pdo = getSupabaseDb();

$entries = [
    // Juan Dela Cruz (3a52667f-53cf-412a-b048-ef96eb407707)
    [
        'id' => 'txn-juan-1',
        'employee_id' => '3a52667f-53cf-412a-b048-ef96eb407707',
        'source_type' => 'lms_quiz',
        'points' => 150,
        'balance_after' => 150,
        'description' => 'Passed SOP 101: Front Office PMS Check-In Mastery',
        'created_at' => '2026-08-15T09:00:00Z'
    ],
    [
        'id' => 'txn-juan-2',
        'employee_id' => '3a52667f-53cf-412a-b048-ef96eb407707',
        'source_type' => 'peer_kudos',
        'points' => 50,
        'balance_after' => 200,
        'description' => 'Great Guest Service recognition from Maria Santos',
        'created_at' => '2026-08-25T14:30:00Z'
    ],
    [
        'id' => 'txn-juan-3',
        'employee_id' => '3a52667f-53cf-412a-b048-ef96eb407707',
        'source_type' => 'supervisor_kudos',
        'points' => 100,
        'balance_after' => 300,
        'description' => 'Front Desk Operations Excellence Commendation from Supervisor',
        'created_at' => '2026-09-01T11:15:00Z'
    ],

    // Janzel (3bb792e6-b25e-460e-a8fa-712c65c3b2e2)
    [
        'id' => 'txn-janzel-1',
        'employee_id' => '3bb792e6-b25e-460e-a8fa-712c65c3b2e2',
        'source_type' => 'training_cert',
        'points' => 150,
        'balance_after' => 150,
        'description' => 'Certified: Housekeeping SOP & Safety Compliance',
        'created_at' => '2026-08-10T10:00:00Z'
    ],
    [
        'id' => 'txn-janzel-2',
        'employee_id' => '3bb792e6-b25e-460e-a8fa-712c65c3b2e2',
        'source_type' => 'supervisor_kudos',
        'points' => 100,
        'balance_after' => 250,
        'description' => 'Housekeeping Supervisor Leadership Commendation',
        'created_at' => '2026-08-28T16:00:00Z'
    ],
    [
        'id' => 'txn-janzel-3',
        'employee_id' => '3bb792e6-b25e-460e-a8fa-712c65c3b2e2',
        'source_type' => 'lms_quiz',
        'points' => 100,
        'balance_after' => 350,
        'description' => 'Passed SOP 202: Room Inspection & Sanitization Standards',
        'created_at' => '2026-09-02T13:45:00Z'
    ]
];

if ($pdo) {
    echo "Inserting via PDO...\n";
    $stmt = $pdo->prepare("INSERT INTO public.xp_ledger (id, employee_id, source_type, points, balance_after, description, created_at) VALUES (:id, :employee_id, :source_type, :points, :balance_after, :description, :created_at) ON CONFLICT (id) DO UPDATE SET points = EXCLUDED.points, balance_after = EXCLUDED.balance_after");
    foreach ($entries as $e) {
        $stmt->execute([
            ':id' => $e['id'],
            ':employee_id' => $e['employee_id'],
            ':source_type' => $e['source_type'],
            ':points' => $e['points'],
            ':balance_after' => $e['balance_after'],
            ':description' => $e['description'],
            ':created_at' => $e['created_at']
        ]);
        echo "Inserted/Updated: {$e['id']} for {$e['employee_id']}\n";
    }
} else {
    echo "Inserting via REST...\n";
    foreach ($entries as $e) {
        $res = supabaseRequest('xp_ledger', 'POST', $e, true);
        echo "REST result for {$e['id']}: " . json_encode($res) . "\n";
    }
}

echo "Done seeding.\n";
