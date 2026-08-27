<?php
require_once __DIR__ . '/../config/config.php';

echo "--- 1. Testing Supabase PDO Connection ---\n";
$pdo = getSupabaseDb();
if ($pdo) {
    echo "✅ Supabase PDO connected successfully!\n";
    
    // Check departments
    try {
        $stmt = $pdo->query("SELECT * FROM departments LIMIT 10");
        $depts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "Departments count: " . count($depts) . "\n";
        foreach ($depts as $d) {
            echo "  - [{$d['id']}] {$d['name']} (code: " . ($d['code'] ?? 'null') . ")\n";
        }
    } catch (Exception $e) {
        echo "❌ Error querying departments: " . $e->getMessage() . "\n";
    }

    // Check competencies
    try {
        $stmt = $pdo->query("SELECT * FROM competencies LIMIT 10");
        $comps = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "\nCompetencies count: " . count($comps) . "\n";
        foreach ($comps as $c) {
            echo "  - [{$c['id']}] {$c['name']} (key: {$c['key']}, scope: " . ($c['scope'] ?? 'N/A') . ", dept_id: " . ($c['department_id'] ?? 'null') . ", pos: " . ($c['position'] ?? 'null') . ")\n";
        }
    } catch (Exception $e) {
        echo "❌ Error querying competencies: " . $e->getMessage() . "\n";
    }

    // Check competency_assessments
    try {
        $stmt = $pdo->query("SELECT * FROM competency_assessments LIMIT 10");
        $ass = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "\nCompetency Assessments count: " . count($ass) . "\n";
    } catch (Exception $e) {
        echo "❌ Error querying competency_assessments: " . $e->getMessage() . "\n";
    }

    // Check users
    try {
        $stmt = $pdo->query("SELECT id, full_name, role, title, department FROM users LIMIT 10");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "\nUsers count: " . count($users) . "\n";
        foreach ($users as $u) {
            echo "  - [{$u['id']}] {$u['full_name']} - {$u['title']} ({$u['department']})\n";
        }
    } catch (Exception $e) {
        echo "❌ Error querying users: " . $e->getMessage() . "\n";
    }

} else {
    echo "❌ Failed to connect to Supabase PDO.\n";
}
