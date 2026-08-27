<?php
require_once __DIR__ . '/../config/config.php';

$deptsRes = supabaseRequest('departments', 'GET', null, true);
$deptMap = [];
foreach ($deptsRes['data'] as $d) {
    $deptMap[$d['name']] = $d['id'];
}
echo "Department Map:\n";
print_r($deptMap);

$employeesToSync = [
    // Front Office
    [
        'id' => 'emp-101',
        'employee_code' => 'OXF-EMP-1001',
        'full_name' => 'Maria Santos',
        'email' => 'maria.santos@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'title' => 'Front Desk Host',
        'department_id' => $deptMap['Front Office'],
        'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        'current_level' => 3,
        'total_xp' => 450,
        'status' => 'Active'
    ],
    [
        'id' => 'emp-105',
        'employee_code' => 'OXF-EMP-1005',
        'full_name' => 'Lucas Vargas',
        'email' => 'lucas.vargas@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'title' => 'Front Desk Host',
        'department_id' => $deptMap['Front Office'],
        'avatar_url' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        'current_level' => 2,
        'total_xp' => 310,
        'status' => 'Active'
    ],
    [
        'id' => 'emp-106',
        'employee_code' => 'OXF-EMP-1006',
        'full_name' => 'Carlos Gomez',
        'email' => 'carlos.gomez@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'title' => 'Front Desk Host',
        'department_id' => $deptMap['Front Office'],
        'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        'current_level' => 4,
        'total_xp' => 620,
        'status' => 'Active'
    ],
    [
        'id' => 'emp-107',
        'employee_code' => 'OXF-EMP-1007',
        'full_name' => 'Clara Schmidt',
        'email' => 'clara.schmidt@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'title' => 'Front Desk Host',
        'department_id' => $deptMap['Front Office'],
        'avatar_url' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        'current_level' => 3,
        'total_xp' => 480,
        'status' => 'Active'
    ],
    // Food & Beverage
    [
        'id' => 'emp-108',
        'employee_code' => 'OXF-EMP-1008',
        'full_name' => 'David Lee',
        'email' => 'david.lee@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'title' => 'Server',
        'department_id' => $deptMap['Food & Beverage'],
        'avatar_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        'current_level' => 3,
        'total_xp' => 520,
        'status' => 'Active'
    ],
    [
        'id' => 'emp-109',
        'employee_code' => 'OXF-EMP-1009',
        'full_name' => 'Antonio Silva',
        'email' => 'antonio.silva@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'title' => 'Server',
        'department_id' => $deptMap['Food & Beverage'],
        'avatar_url' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        'current_level' => 3,
        'total_xp' => 430,
        'status' => 'Active'
    ],
    // Kitchen
    [
        'id' => 'emp-102',
        'employee_code' => 'OXF-SUP-2001',
        'full_name' => 'Chef Marco Rossi',
        'email' => 'marco.rossi@oxfordsuitesmakati.com',
        'role' => 'Supervisor',
        'title' => 'Kitchen Staff',
        'department_id' => $deptMap['Kitchen'],
        'avatar_url' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        'current_level' => 5,
        'total_xp' => 820,
        'status' => 'Active'
    ],
    [
        'id' => 'emp-110',
        'employee_code' => 'OXF-EMP-1010',
        'full_name' => 'Jean-Pierre Laurent',
        'email' => 'jeanpierre.laurent@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'title' => 'Kitchen Staff',
        'department_id' => $deptMap['Kitchen'],
        'avatar_url' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        'current_level' => 4,
        'total_xp' => 690,
        'status' => 'Active'
    ],
    // Housekeeping
    [
        'id' => 'emp-111',
        'employee_code' => 'OXF-EMP-1011',
        'full_name' => 'Rosa Morales',
        'email' => 'rosa.morales@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'title' => 'Room Attendant',
        'department_id' => $deptMap['Housekeeping'],
        'avatar_url' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        'current_level' => 3,
        'total_xp' => 410,
        'status' => 'Active'
    ],
    [
        'id' => 'emp-112',
        'employee_code' => 'OXF-EMP-1012',
        'full_name' => 'Fatima Zahra',
        'email' => 'fatima.zahra@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'title' => 'Room Attendant',
        'department_id' => $deptMap['Housekeeping'],
        'avatar_url' => 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
        'current_level' => 4,
        'total_xp' => 710,
        'status' => 'Active'
    ],
    // Human Resources
    [
        'id' => 'emp-103',
        'employee_code' => 'OXF-HR-3001',
        'full_name' => 'Elena Vance',
        'email' => 'elena.vance@oxfordsuitesmakati.com',
        'role' => 'HR Director',
        'title' => 'Director of People & Culture',
        'department_id' => $deptMap['Human Resources'],
        'avatar_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        'current_level' => 7,
        'total_xp' => 1200,
        'status' => 'Active'
    ]
];

$existingRes = supabaseRequest('employees', 'GET', null, true);
$existingById = [];
if (is_array($existingRes['data'])) {
    foreach ($existingRes['data'] as $e) {
        $existingById[$e['id']] = $e;
    }
}

foreach ($employeesToSync as $emp) {
    if (!isset($existingById[$emp['id']])) {
        $res = supabaseRequest('employees', 'POST', $emp, true);
        echo "Inserted employee {$emp['full_name']} ({$emp['id']}): status {$res['status']}\n";
    } else {
        $res = supabaseRequest('employees?id=eq.' . urlencode($emp['id']), 'PATCH', [
            'department_id' => $emp['department_id'],
            'title' => $emp['title'],
            'avatar_url' => $emp['avatar_url'],
            'employee_code' => $emp['employee_code'],
            'role' => $emp['role']
        ], true);
        echo "Updated employee {$emp['full_name']} ({$emp['id']}): status {$res['status']}\n";
    }
}
