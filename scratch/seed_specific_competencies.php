<?php
require_once __DIR__ . '/../config/config.php';

$deptsRes = supabaseRequest('departments', 'GET', null, true);
$depts = $deptsRes['data'] ?? [];
$deptMap = [];
foreach ($depts as $d) {
    $deptMap[$d['name']] = $d['id'];
}

echo "Found Departments:\n";
print_r($deptMap);

$compsToEnsure = [
    // Housekeeping
    [
        'key' => 'ROOM_CLEANING_STANDARDS',
        'name' => 'Room Cleaning Standards',
        'category' => 'Operational Mastery',
        'department_id' => $deptMap['Housekeeping'] ?? null,
        'description' => 'Execution of 50-point guest suite sanitization, linen dressing, and turnaround speed standards.',
        'benchmark_score' => 4.50,
        'max_score' => 5.00,
        'scope' => 'Specific',
        'position' => 'Room Attendant'
    ],
    [
        'key' => 'HYGIENE_SANITATION',
        'name' => 'Hygiene & Sanitation',
        'category' => 'Compliance & Safety',
        'department_id' => $deptMap['Housekeeping'] ?? null,
        'description' => 'Chemical safety, OSHA standards, biohazard protocols, and cross-contamination prevention.',
        'benchmark_score' => 4.60,
        'max_score' => 5.00,
        'scope' => 'Specific',
        'position' => 'Room Attendant'
    ],
    [
        'key' => 'ROOM_INSPECTION',
        'name' => 'Room Inspection',
        'category' => 'Quality Assurance',
        'department_id' => $deptMap['Housekeeping'] ?? null,
        'description' => 'Detailed 50-point VIP suite quality audit prior to guest check-in arrival.',
        'benchmark_score' => 4.40,
        'max_score' => 5.00,
        'scope' => 'Specific',
        'position' => 'Room Attendant'
    ],
    // Food & Beverage
    [
        'key' => 'FOOD_SAFETY',
        'name' => 'Food Safety',
        'category' => 'Compliance & Safety',
        'department_id' => $deptMap['Food & Beverage'] ?? null,
        'description' => 'Food handling, temperature holding, allergen awareness, and ServSafe protocols.',
        'benchmark_score' => 4.70,
        'max_score' => 5.00,
        'scope' => 'Specific',
        'position' => 'Server'
    ],
    [
        'key' => 'POS_OPERATION',
        'name' => 'POS Operation',
        'category' => 'Technical Systems',
        'department_id' => $deptMap['Food & Beverage'] ?? null,
        'description' => 'Micros Simphony / POS terminal billing, table splitting, and payment reconciliation.',
        'benchmark_score' => 4.50,
        'max_score' => 5.00,
        'scope' => 'Specific',
        'position' => 'Server'
    ],
    [
        'key' => 'FB_SERVICE',
        'name' => 'Food & Beverage Service',
        'category' => 'Core Hospitality',
        'department_id' => $deptMap['Food & Beverage'] ?? null,
        'description' => 'Fine-dining silver service, order pacing, beverage pouring, and table maintenance.',
        'benchmark_score' => 4.60,
        'max_score' => 5.00,
        'scope' => 'Specific',
        'position' => 'Server'
    ],
    [
        'key' => 'UPSELLING_FB',
        'name' => 'Upselling',
        'category' => 'Commercial / Revenue',
        'department_id' => $deptMap['Food & Beverage'] ?? null,
        'description' => 'Sommelier wine pairing, dessert suggestions, and average check enhancement.',
        'benchmark_score' => 4.30,
        'max_score' => 5.00,
        'scope' => 'Specific',
        'position' => 'Server'
    ],
    // Kitchen
    [
        'key' => 'FOOD_PREPARATION',
        'name' => 'Food Preparation',
        'category' => 'Culinary Operations',
        'department_id' => $deptMap['Kitchen'] ?? null,
        'description' => 'Mise-en-place prep, knife skills, recipe adherence, and plate presentation.',
        'benchmark_score' => 4.60,
        'max_score' => 5.00,
        'scope' => 'Specific',
        'position' => 'Kitchen Staff'
    ],
    [
        'key' => 'HACCP_COMPLIANCE',
        'name' => 'HACCP Compliance',
        'category' => 'Compliance & Safety',
        'department_id' => $deptMap['Kitchen'] ?? null,
        'description' => 'Hazard analysis, critical control point logging, and sanitized station operations.',
        'benchmark_score' => 4.80,
        'max_score' => 5.00,
        'scope' => 'Specific',
        'position' => 'Kitchen Staff'
    ],
    [
        'key' => 'COLD_CHAIN_MANAGEMENT',
        'name' => 'Cold Chain Management',
        'category' => 'Storage & Safety',
        'department_id' => $deptMap['Kitchen'] ?? null,
        'description' => 'Walk-in refrigeration logs, thawing protocols, and FIFO inventory management.',
        'benchmark_score' => 4.50,
        'max_score' => 5.00,
        'scope' => 'Specific',
        'position' => 'Kitchen Staff'
    ]
];

// Fetch existing to avoid duplicates
$existingRes = supabaseRequest('competencies', 'GET', null, true);
$existingKeys = [];
if (is_array($existingRes['data'])) {
    foreach ($existingRes['data'] as $c) {
        $existingKeys[$c['key']] = true;
    }
}

foreach ($compsToEnsure as $c) {
    if (!isset($existingKeys[$c['key']])) {
        $res = supabaseRequest('competencies', 'POST', $c, true);
        echo "Inserted {$c['name']} (key: {$c['key']}): status {$res['status']}\n";
    } else {
        echo "Already exists: {$c['name']} (key: {$c['key']})\n";
    }
}
