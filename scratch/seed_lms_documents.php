<?php
require_once __DIR__ . '/../config/config.php';

$pdo = getSupabaseDb();
if (!$pdo) {
    echo "Could not connect to DB.\n";
    exit(1);
}

// 1. Get Department IDs
$stmt = $pdo->query("SELECT id, name FROM public.departments");
$depts = $stmt->fetchAll(PDO::FETCH_ASSOC);
$deptMap = [];
foreach ($depts as $d) {
    $deptMap[$d['name']] = $d['id'];
}

$sampleDocs = [
    [
        'id' => 'lms-sop-101',
        'title' => 'SOP 101: Front Office PMS & VIP Guest Service Mastery',
        'file_name' => 'SOP_101_Front_Office_PMS.pdf',
        'file_path' => 'public/documents/SOP_101_Front_Office_PMS.pdf',
        'file_type' => 'application/pdf',
        'file_size' => 1048576,
        'department_id' => $deptMap['Front Office'] ?? null,
        'category' => 'SOP Manual',
        'estimated_reading_minutes' => 20,
        'estimated_pages' => 14,
        'exp_reward' => 100,
        'description' => 'Comprehensive standard operating procedures for Opera Cloud PMS check-in, billing settlement, and VIP guest service escalation.',
        'learning_outcomes' => 'Master guest check-in, keycard provisioning, folios, and service recovery protocols.',
        'status' => 'Published',
        'uploaded_by' => 'emp-103',
        'created_at' => date('Y-m-d H:i:s+00', strtotime('-10 days')),
        'updated_at' => date('Y-m-d H:i:s+00', strtotime('-10 days')),
        'manatory' => true
    ],
    [
        'id' => 'lms-sop-201',
        'title' => 'SOP 201: HACCP Food Safety, Hygiene & Kitchen Sanitation',
        'file_name' => 'SOP_201_HACCP_Safety.pdf',
        'file_path' => 'public/documents/SOP_201_HACCP_Safety.pdf',
        'file_type' => 'application/pdf',
        'file_size' => 2097152,
        'department_id' => $deptMap['Kitchen'] ?? null,
        'category' => 'Compliance & Safety',
        'estimated_reading_minutes' => 25,
        'estimated_pages' => 18,
        'exp_reward' => 150,
        'description' => 'Statutory Hazard Analysis Critical Control Point (HACCP) standards, temperature logs, allergen controls, and chemical sanitation rules.',
        'learning_outcomes' => 'Ensure 100% compliance with international food hygiene regulations and culinary safety audits.',
        'status' => 'Published',
        'uploaded_by' => 'emp-103',
        'created_at' => date('Y-m-d H:i:s+00', strtotime('-8 days')),
        'updated_at' => date('Y-m-d H:i:s+00', strtotime('-8 days')),
        'manatory' => true
    ],
    [
        'id' => 'lms-sop-301',
        'title' => 'SOP 301: Luxury Housekeeping & Turndown Quality Standards',
        'file_name' => 'SOP_301_Housekeeping.pdf',
        'file_path' => 'public/documents/SOP_301_Housekeeping.pdf',
        'file_type' => 'application/pdf',
        'file_size' => 1572864,
        'department_id' => $deptMap['Housekeeping'] ?? null,
        'category' => 'SOP Manual',
        'estimated_reading_minutes' => 15,
        'estimated_pages' => 12,
        'exp_reward' => 100,
        'description' => 'Oxford Suites 5-star room preparation checklists, linen handling standards, deep cleaning workflows, and inspection criteria.',
        'learning_outcomes' => 'Deliver flawless guest room cleanliness, linen sanitation, and turn-down hospitality.',
        'status' => 'Published',
        'uploaded_by' => 'emp-103',
        'created_at' => date('Y-m-d H:i:s+00', strtotime('-6 days')),
        'updated_at' => date('Y-m-d H:i:s+00', strtotime('-6 days')),
        'manatory' => false
    ],
    [
        'id' => 'lms-sop-401',
        'title' => 'SOP 401: Food & Beverage Table Service & Wine Etiquette',
        'file_name' => 'SOP_401_FB_Service.pdf',
        'file_path' => 'public/documents/SOP_401_FB_Service.pdf',
        'file_type' => 'application/pdf',
        'file_size' => 1258291,
        'department_id' => $deptMap['Food & Beverage'] ?? null,
        'category' => 'SOP Manual',
        'estimated_reading_minutes' => 18,
        'estimated_pages' => 15,
        'exp_reward' => 100,
        'description' => 'Fine dining table setting, beverage pairing service, sequence of service steps, and upscale banquet hospitality guidelines.',
        'learning_outcomes' => 'Execute high-touch dining service, upselling techniques, and guest satisfaction.',
        'status' => 'Published',
        'uploaded_by' => 'emp-103',
        'created_at' => date('Y-m-d H:i:s+00', strtotime('-4 days')),
        'updated_at' => date('Y-m-d H:i:s+00', strtotime('-4 days')),
        'manatory' => false
    ],
    [
        'id' => 'lms-sop-501',
        'title' => 'SOP 501: Crisis Management, Fire Safety & De-escalation Protocol',
        'file_name' => 'SOP_501_Crisis_Safety.pdf',
        'file_path' => 'public/documents/SOP_501_Crisis_Safety.pdf',
        'file_type' => 'application/pdf',
        'file_size' => 3145728,
        'department_id' => null, // Property-Wide
        'category' => 'Compliance & Safety',
        'estimated_reading_minutes' => 30,
        'estimated_pages' => 22,
        'exp_reward' => 200,
        'description' => 'Hotel-wide emergency evacuation, fire suppression protocols, first-aid procedures, and conflict resolution de-escalation training.',
        'learning_outcomes' => 'Lead emergency responses and ensure guest and associate safety across all shifts.',
        'status' => 'Published',
        'uploaded_by' => 'emp-103',
        'created_at' => date('Y-m-d H:i:s+00', strtotime('-2 days')),
        'updated_at' => date('Y-m-d H:i:s+00', strtotime('-2 days')),
        'manatory' => true
    ]
];

foreach ($sampleDocs as $doc) {
    $doc['manatory'] = $doc['manatory'] ? 'true' : 'false';
    $stmt = $pdo->prepare("INSERT INTO public.lms_documents (id, title, file_name, file_path, file_type, file_size, department_id, category, estimated_reading_minutes, estimated_pages, exp_reward, description, learning_outcomes, status, uploaded_by, created_at, updated_at, manatory)
        VALUES (:id, :title, :file_name, :file_path, :file_type, :file_size, :department_id, :category, :estimated_reading_minutes, :estimated_pages, :exp_reward, :description, :learning_outcomes, :status, :uploaded_by, :created_at, :updated_at, :manatory)
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            file_name = EXCLUDED.file_name,
            file_path = EXCLUDED.file_path,
            file_type = EXCLUDED.file_type,
            file_size = EXCLUDED.file_size,
            department_id = EXCLUDED.department_id,
            category = EXCLUDED.category,
            estimated_reading_minutes = EXCLUDED.estimated_reading_minutes,
            estimated_pages = EXCLUDED.estimated_pages,
            exp_reward = EXCLUDED.exp_reward,
            description = EXCLUDED.description,
            learning_outcomes = EXCLUDED.learning_outcomes,
            status = EXCLUDED.status,
            uploaded_by = EXCLUDED.uploaded_by,
            manatory = EXCLUDED.manatory");
    $stmt->execute($doc);
    echo "Seeded/Updated LMS Document: {$doc['id']} ({$doc['title']})\n";
}

echo "Done seeding LMS documents.\n";
