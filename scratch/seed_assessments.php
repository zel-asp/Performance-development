<?php
require_once __DIR__ . '/../config/config.php';

// Fetch all competencies
$compsRes = supabaseRequest('competencies', 'GET', null, true);
$comps = $compsRes['data'] ?? [];
$compByKey = [];
foreach ($comps as $c) {
    $compByKey[$c['key']] = $c['id'];
}

// Sample ratings for Maria Santos
$initialAssessments = [
    // Maria Santos (Front Office, Front Desk Host)
    [
        'employee_id' => 'emp-101',
        'competency_id' => $compByKey['CUSTOMER_SERVICE'] ?? '',
        'score' => 4.50,
        'comments' => 'Exceptional warm greeting and guest engagement.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-101',
        'competency_id' => $compByKey['COMMUNICATION'] ?? '',
        'score' => 4.20,
        'comments' => 'Clear, articulate verbal and written communication with guests.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-101',
        'competency_id' => $compByKey['TEAMWORK'] ?? '',
        'score' => 4.40,
        'comments' => 'Strong collaboration with Concierge and Bell teams.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-101',
        'competency_id' => $compByKey['PROFESSIONALISM'] ?? '',
        'score' => 4.60,
        'comments' => 'Impeccable grooming and 5-star brand posture.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-101',
        'competency_id' => $compByKey['PROBLEM_SOLVING'] ?? '',
        'score' => 4.00,
        'comments' => 'Handles room assignment constraints effectively.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-101',
        'competency_id' => $compByKey['SAFETY_AWARENESS'] ?? '',
        'score' => 4.30,
        'comments' => 'Adheres strictly to guest key security and emergency procedures.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-101',
        'competency_id' => $compByKey['VIP_PROTOCOL'] ?? '',
        'score' => 4.80,
        'comments' => 'Outstanding recognition of Tier-1 VIPs and personalized amenity delivery.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-101',
        'competency_id' => $compByKey['HOTEL_PMS'] ?? '',
        'score' => 4.60,
        'comments' => 'Mastery in Opera Cloud PMS billing, folios, and fast check-in.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-101',
        'competency_id' => $compByKey['GUEST_COMPLAINT_HANDLING'] ?? '',
        'score' => 3.50,
        'comments' => 'Recommended for LAST framework de-escalation workshop.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-101',
        'competency_id' => $compByKey['COMMERCIAL_UPSELL'] ?? '',
        'score' => 4.10,
        'comments' => 'Consistent executive suite upgrades.',
        'assessed_by' => 'emp-103'
    ],
    // Lucas Vargas (Front Office)
    [
        'employee_id' => 'emp-105',
        'competency_id' => $compByKey['CUSTOMER_SERVICE'] ?? '',
        'score' => 4.00,
        'comments' => 'Polite and attentive at the reception desk.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-105',
        'competency_id' => $compByKey['COMMUNICATION'] ?? '',
        'score' => 3.80,
        'comments' => 'Good verbal clarity.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-105',
        'competency_id' => $compByKey['HOTEL_PMS'] ?? '',
        'score' => 3.90,
        'comments' => 'Solid foundation in room assignments.',
        'assessed_by' => 'emp-103'
    ],
    // Chef Marco Rossi (Kitchen)
    [
        'employee_id' => 'emp-102',
        'competency_id' => $compByKey['CUSTOMER_SERVICE'] ?? '',
        'score' => 4.50,
        'comments' => 'Great guest interaction during chef tables.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-102',
        'competency_id' => $compByKey['FOOD_PREPARATION'] ?? '',
        'score' => 4.80,
        'comments' => 'Exceptional culinary execution and recipe precision.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-102',
        'competency_id' => $compByKey['HACCP_COMPLIANCE'] ?? '',
        'score' => 4.90,
        'comments' => 'Flawless kitchen safety and sanitation audit scores.',
        'assessed_by' => 'emp-103'
    ],
    // Rosa Morales (Housekeeping)
    [
        'employee_id' => 'emp-111',
        'competency_id' => $compByKey['CUSTOMER_SERVICE'] ?? '',
        'score' => 4.30,
        'comments' => 'Warm hallway greetings and guest responsiveness.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-111',
        'competency_id' => $compByKey['ROOM_CLEANING_STANDARDS'] ?? '',
        'score' => 4.60,
        'comments' => 'Meets 50-point cleanliness audit on all assigned suites.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-111',
        'competency_id' => $compByKey['HYGIENE_SANITATION'] ?? '',
        'score' => 4.70,
        'comments' => 'Strict chemical dilution compliance.',
        'assessed_by' => 'emp-103'
    ],
    // David Lee (Food & Beverage)
    [
        'employee_id' => 'emp-108',
        'competency_id' => $compByKey['CUSTOMER_SERVICE'] ?? '',
        'score' => 4.40,
        'comments' => 'Attentive table maintenance and cordial guest rapport.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-108',
        'competency_id' => $compByKey['FB_SERVICE'] ?? '',
        'score' => 4.60,
        'comments' => 'Fine dining silver service certified.',
        'assessed_by' => 'emp-103'
    ],
    [
        'employee_id' => 'emp-108',
        'competency_id' => $compByKey['POS_OPERATION'] ?? '',
        'score' => 4.50,
        'comments' => 'Fast table order entry in Micros POS.',
        'assessed_by' => 'emp-103'
    ]
];

$existingAss = supabaseRequest('competency_assessments', 'GET', null, true);
$existingAssList = $existingAss['data'] ?? [];
if (empty($existingAssList)) {
    foreach ($initialAssessments as $a) {
        if (!empty($a['competency_id'])) {
            $res = supabaseRequest('competency_assessments', 'POST', $a, true);
            echo "Inserted assessment for emp {$a['employee_id']} - comp {$a['competency_id']}: status {$res['status']}\n";
        }
    }
} else {
    echo "Assessments already exist: " . count($existingAssList) . " records.\n";
}
