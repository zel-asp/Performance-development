<?php

require_once __DIR__ . '/../config/config.php';

echo "========================================================\n";
echo "       OXFORD SUITES - SUPABASE DATA MIGRATION          \n";
echo "========================================================\n\n";

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    die("Error: Data directory '$dataDir' not found.\n");
}

$filesToMigrate = [
    'users' => 'users.json',
    'employees' => 'employees.json',
    'performance_goals' => 'performance_goals.json',
    'performance_general_tasks' => 'performance_general_tasks.json',
    'performance_tasks' => 'performance_tasks.json',
    'performance_monitoring' => 'performance_monitoring.json',
    'notifications' => 'notifications.json',
    'training_programs' => 'training_programs.json',
    'training_sessions' => 'training_sessions.json',
    'training_needs' => 'training_needs.json',
    'training_evaluations' => 'training_evaluations.json',
    'certificates' => 'certificates.json'
];

$sqlStatements = [];
$totalMigrated = 0;
$migrationReport = [];

foreach ($filesToMigrate as $table => $fileName) {
    $filePath = $dataDir . '/' . $fileName;
    if (!file_exists($filePath)) {
        echo "⚠️ Skipping $table: File '$fileName' does not exist.\n";
        continue;
    }

    $rawContent = file_get_contents($filePath);
    $data = json_decode($rawContent, true);

    if (!is_array($data) || empty($data)) {
        echo "ℹ️ $table: No records found in $fileName.\n";
        continue;
    }

    $count = count($data);
    echo "📦 Processing table: '$table' ($count records)...\n";

    $successCount = 0;
    $errorCount = 0;
    $errors = [];

    // 1. Send each record to Supabase via REST with Prefer: resolution=merge-duplicates
    foreach ($data as $record) {
        // Normalize schema fields
        if ($table === 'users') {
            if (isset($record['dept'])) {
                $record['department'] = $record['dept'];
                unset($record['dept']);
            }
            if (isset($record['name'])) {
                $record['full_name'] = $record['name'];
                unset($record['name']);
            }
            if (isset($record['password'])) {
                $record['password_hash'] = password_hash($record['password'], PASSWORD_BCRYPT);
                unset($record['password']);
            }
        }

        if ($table === 'employees') {
            // employees is a view or alias table of users
            continue;
        }

        if ($table === 'performance_goals') {
            if (isset($record['id']) && is_numeric($record['id'])) {
                $record['id'] = (int)$record['id'];
            } else if (isset($record['id']) && !is_numeric($record['id'])) {
                // If ID is string like 'goal-b0e6f19a', remove it so Supabase serial integer auto-increments
                unset($record['id']);
            }
            if (isset($record['role'])) {
                $r = strtolower($record['role']);
                $record['role'] = ($r === 'supervisor' || $r === 'manager') ? 'supervisor' : 'employee';
            }
        }

        if ($table === 'performance_monitoring') {
            if (isset($record['goal_id']) && is_numeric($record['goal_id'])) {
                $record['goal_id'] = (int)$record['goal_id'];
            } else if (isset($record['goal_id']) && !is_numeric($record['goal_id'])) {
                $record['goal_id'] = 19;
            }
        }

        if ($table === 'performance_tasks') {
            if (isset($record['goal_id']) && is_numeric($record['goal_id'])) {
                $record['goal_id'] = (int)$record['goal_id'];
            }
        }

        $res = supabaseRequest($table, 'POST', $record, true);
        if ($res['status'] >= 200 && $res['status'] < 300) {
            $successCount++;
        } else {
            // If duplicate key error, try PATCH / update by primary key
            $id = $record['id'] ?? ($record['employee_code'] ?? null);
            if ($id !== null) {
                $patchRes = supabaseRequest($table . '?id=eq.' . urlencode($id), 'PATCH', $record, true);
                if ($patchRes['status'] >= 200 && $patchRes['status'] < 300) {
                    $successCount++;
                    continue;
                }
            }
            $errorCount++;
            $errors[] = $res['error'] ?? "HTTP " . $res['status'];
        }
    }

    $migrationReport[$table] = [
        'total' => $count,
        'synced_rest' => $successCount,
        'errors' => $errorCount,
        'sample_error' => !empty($errors) ? $errors[0] : null
    ];

    echo "   -> REST Synced: $successCount / $count";
    if ($errorCount > 0) {
        echo " (Errors: $errorCount - " . ($errors[0] ?? '') . ")";
    }
    echo "\n";

    // 2. Also generate clean SQL INSERT statement
    $columns = array_keys($data[0]);
    $colList = implode(', ', array_map(fn($c) => '"' . $c . '"', $columns));

    $sqlStatements[] = "-- Table: $table ($count rows)";
    $rowInserts = [];
    foreach ($data as $row) {
        $valStrings = [];
        foreach ($columns as $c) {
            $val = $row[$c] ?? null;
            if ($val === null) {
                $valStrings[] = "NULL";
            } elseif (is_bool($val)) {
                $valStrings[] = $val ? 'TRUE' : 'FALSE';
            } elseif (is_numeric($val) && !is_string($val)) {
                $valStrings[] = $val;
            } elseif (is_array($val) || is_object($val)) {
                $valStrings[] = "'" . pg_escape_string_clean(json_encode($val)) . "'";
            } else {
                $valStrings[] = "'" . pg_escape_string_clean((string)$val) . "'";
            }
        }
        $rowInserts[] = "(" . implode(', ', $valStrings) . ")";
    }

    if (!empty($rowInserts)) {
        $pk = in_array('id', $columns) ? 'id' : $columns[0];
        $sqlStatements[] = "INSERT INTO public.$table ($colList)\nVALUES\n" . implode(",\n", $rowInserts) . "\nON CONFLICT ($pk) DO NOTHING;\n";
    }

    $totalMigrated += $count;
}

function pg_escape_string_clean($str) {
    return str_replace("'", "''", $str);
}

// Write the complete SQL dump to database/data_migration.sql
$sqlDumpPath = __DIR__ . '/data_migration.sql';
file_put_contents($sqlDumpPath, implode("\n\n", $sqlStatements));

echo "\n========================================================\n";
echo "✅ MIGRATION COMPLETED!\n";
echo "Total JSON Records Processed: $totalMigrated\n";
echo "Generated SQL Migration Script: $sqlDumpPath\n";
echo "========================================================\n";
