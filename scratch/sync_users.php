<?php
require_once __DIR__ . '/../config/config.php';

$usersToEnsure = [
    [
        'id' => 'emp-101',
        'employee_code' => 'OXF-EMP-1001',
        'full_name' => 'Maria Santos',
        'email' => 'maria.santos@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'role_key' => 'employee',
        'title' => 'Front Desk Host',
        'department' => 'Front Office',
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
        'role_key' => 'employee',
        'title' => 'Front Desk Host',
        'department' => 'Front Office',
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
        'role_key' => 'employee',
        'title' => 'Front Desk Host',
        'department' => 'Front Office',
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
        'role_key' => 'employee',
        'title' => 'Front Desk Host',
        'department' => 'Front Office',
        'avatar_url' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        'current_level' => 3,
        'total_xp' => 480,
        'status' => 'Active'
    ],
    [
        'id' => 'emp-108',
        'employee_code' => 'OXF-EMP-1008',
        'full_name' => 'David Lee',
        'email' => 'david.lee@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'role_key' => 'employee',
        'title' => 'Server',
        'department' => 'Food & Beverage',
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
        'role_key' => 'employee',
        'title' => 'Server',
        'department' => 'Food & Beverage',
        'avatar_url' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        'current_level' => 3,
        'total_xp' => 430,
        'status' => 'Active'
    ],
    [
        'id' => 'emp-102',
        'employee_code' => 'OXF-SUP-2001',
        'full_name' => 'Chef Marco Rossi',
        'email' => 'marco.rossi@oxfordsuitesmakati.com',
        'role' => 'Supervisor',
        'role_key' => 'manager',
        'title' => 'Kitchen Staff',
        'department' => 'Kitchen',
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
        'role_key' => 'employee',
        'title' => 'Kitchen Staff',
        'department' => 'Kitchen',
        'avatar_url' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        'current_level' => 4,
        'total_xp' => 690,
        'status' => 'Active'
    ],
    [
        'id' => 'emp-111',
        'employee_code' => 'OXF-EMP-1011',
        'full_name' => 'Rosa Morales',
        'email' => 'rosa.morales@oxfordsuitesmakati.com',
        'role' => 'Associate',
        'role_key' => 'employee',
        'title' => 'Room Attendant',
        'department' => 'Housekeeping',
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
        'role_key' => 'employee',
        'title' => 'Room Attendant',
        'department' => 'Housekeeping',
        'avatar_url' => 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
        'current_level' => 4,
        'total_xp' => 710,
        'status' => 'Active'
    ]
];

$existingUsersRes = supabaseRequest('users', 'GET', null, true);
$existingUserIds = [];
if (is_array($existingUsersRes['data'])) {
    foreach ($existingUsersRes['data'] as $u) {
        $existingUserIds[$u['id']] = $u;
    }
}

foreach ($usersToEnsure as $u) {
    if (!isset($existingUserIds[$u['id']])) {
        $res = supabaseRequest('users', 'POST', $u, true);
        echo "Inserted {$u['full_name']} ({$u['id']}): status {$res['status']}\n";
    } else {
        // Update department / title if needed
        $res = supabaseRequest('users?id=eq.' . urlencode($u['id']), 'PATCH', [
            'department' => $u['department'],
            'title' => $u['title'],
            'avatar_url' => $u['avatar_url']
        ], true);
        echo "Updated {$u['full_name']}: status {$res['status']}\n";
    }
}
