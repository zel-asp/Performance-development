<?php

require_once __DIR__ . '/BaseModel.php';

/**
 * PerformanceDevelopmentPlanModel
 *
 * Manages the `performance_development_plans` staging table.
 * Each row is ONE draft item (item_type = 'task' | 'lms_book').
 *
 * Phase 6: Items are inserted here as Draft.
 * Phase 7: deployPlan() copies rows to performance_tasks / lms_prescribed
 *           and marks them Committed.
 */
class PerformanceDevelopmentPlanModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('performance_development_plans');
    }

    // =========================================================================
    // 1. Fetch draft items for an employee
    // =========================================================================

    /**
     * Get all draft items for an employee using direct SQL / Supabase index filters
     */
    public function getByEmployee(string $empId, ?string $status = null): array
    {
        $filters = ['employee_id' => trim($empId)];
        if ($status !== null) {
            $filters['status'] = trim($status);
        }
        return $this->all($filters);
    }

    /**
     * Get draft items for employee grouped by item_type
     */
    public function getDraftSummary(string $empId): array
    {
        $items = $this->getByEmployee($empId, 'Draft');
        $tasks = array_values(array_filter($items, fn($r) => ($r['item_type'] ?? '') === 'task'));
        $books = array_values(array_filter($items, fn($r) => ($r['item_type'] ?? '') === 'lms_book'));
        return [
            'tasks'       => $tasks,
            'lms_books'   => $books,
            'task_count'  => count($tasks),
            'book_count'  => count($books),
            'total'       => count($tasks) + count($books),
        ];
    }

    /**
     * Fetch all active draft plan summaries across all employees in a single 1-query batch
     */
    public function getAllDraftSummaries(): array
    {
        $drafts = $this->all(['status' => 'Draft']);
        $summaries = [];
        foreach ($drafts as $item) {
            $empId = $item['employee_id'] ?? '';
            if (empty($empId)) continue;
            if (!isset($summaries[$empId])) {
                $summaries[$empId] = [
                    'tasks'      => [],
                    'lms_books'  => [],
                    'task_count' => 0,
                    'book_count' => 0,
                    'total'      => 0,
                ];
            }
            if (($item['item_type'] ?? '') === 'task') {
                $summaries[$empId]['tasks'][] = $item;
                $summaries[$empId]['task_count']++;
            } elseif (($item['item_type'] ?? '') === 'lms_book') {
                $summaries[$empId]['lms_books'][] = $item;
                $summaries[$empId]['book_count']++;
            }
            $summaries[$empId]['total']++;
        }
        return $summaries;
    }

    // =========================================================================
    // 2. Add draft items (Phase 6)
    // =========================================================================

    /**
     * Add a draft action task (item_type = 'task')
     */
    public function addDraftTask(array $data): array
    {
        if (empty($data['employee_id'])) {
            return ['success' => false, 'message' => 'employee_id is required.'];
        }
        if (empty($data['title'])) {
            return ['success' => false, 'message' => 'title is required for a draft task.'];
        }

        $record = [
            'id'          => 'pdp-task-' . substr(bin2hex(random_bytes(5)), 0, 10),
            'employee_id' => trim($data['employee_id']),
            'goal_id'     => !empty($data['goal_id']) ? $data['goal_id'] : null,
            'cycle_period'=> trim($data['cycle_period'] ?? '2026-Q3'),
            'plan_type'   => in_array($data['plan_type'] ?? 'IDP', ['IDP', 'PIP']) ? $data['plan_type'] : 'IDP',
            'item_type'   => 'task',
            'title'       => trim($data['title']),
            'description' => trim($data['description'] ?? ''),
            'target_date' => !empty($data['target_date']) ? $data['target_date'] : null,
            'lms_document_id' => null,
            'status'      => 'Draft',
            'notes'       => trim($data['notes'] ?? ''),
            'created_by'  => $data['created_by'] ?? null,
            'created_at'  => date('c'),
            'updated_at'  => date('c'),
        ];

        return $this->create($record);
    }

    /**
     * Add a draft LMS book prescription (item_type = 'lms_book')
     */
    public function addDraftBook(array $data): array
    {
        if (empty($data['employee_id'])) {
            return ['success' => false, 'message' => 'employee_id is required.'];
        }
        if (empty($data['lms_document_id'])) {
            return ['success' => false, 'message' => 'lms_document_id is required for a draft LMS book.'];
        }

        // Prevent duplicate prescription of same book in same cycle
        $existing = $this->getByEmployee($data['employee_id'], 'Draft');
        foreach ($existing as $row) {
            if (
                ($row['item_type'] ?? '') === 'lms_book' &&
                ($row['lms_document_id'] ?? '') === (string)$data['lms_document_id']
            ) {
                return $this->normalizeRecord($row); // already drafted, return existing
            }
        }

        $record = [
            'id'             => 'pdp-book-' . substr(bin2hex(random_bytes(5)), 0, 10),
            'employee_id'    => trim($data['employee_id']),
            'goal_id'        => !empty($data['goal_id']) ? $data['goal_id'] : null,
            'cycle_period'   => trim($data['cycle_period'] ?? '2026-Q3'),
            'plan_type'      => in_array($data['plan_type'] ?? 'IDP', ['IDP', 'PIP']) ? $data['plan_type'] : 'IDP',
            'item_type'      => 'lms_book',
            'title'          => trim($data['book_title'] ?? ''),
            'description'    => null,
            'target_date'    => null,
            'lms_document_id'=> (string)$data['lms_document_id'],
            'status'         => 'Draft',
            'notes'          => trim($data['notes'] ?? ''),
            'created_by'     => $data['created_by'] ?? null,
            'created_at'     => date('c'),
            'updated_at'     => date('c'),
        ];

        return $this->create($record);
    }

    // =========================================================================
    // 3. Remove a single draft item (Phase 6)
    // =========================================================================

    public function removeDraftItem(string $itemId): bool
    {
        return $this->delete($itemId);
    }

    // =========================================================================
    // 4. Discard all draft items for an employee (Phase 6 — Discard Plan)
    // =========================================================================

    public function discardAllDrafts(string $empId): int
    {
        $items = $this->getByEmployee($empId, 'Draft');
        $count = 0;
        foreach ($items as $item) {
            if ($this->delete((string)$item['id'])) {
                $count++;
            }
        }
        return $count;
    }

    // =========================================================================
    // 5. Deploy Plan (Phase 7 — copies drafts to live tables)
    // =========================================================================

    /**
     * Deploy all Draft items for an employee:
     *  - 'task' rows → POST to performance_tasks via supabaseRequest
     *  - 'lms_book' rows → POST to lms_prescribed via supabaseRequest
     *  - All deployed rows → status = 'Committed'
     *
     * Returns summary of deployed items.
     */
    public function deployPlan(string $empId, ?int $goalId = null): array
    {
        $items   = $this->getByEmployee($empId, 'Draft');
        if (empty($items)) {
            return [
                'success'        => false,
                'message'        => 'No draft items found for this employee.',
                'tasks_deployed' => 0,
                'books_deployed' => 0,
            ];
        }

        $tasksDeployed = 0;
        $booksDeployed = 0;
        $errors        = [];

        foreach ($items as $item) {
            $type = $item['item_type'] ?? '';

            if ($type === 'task') {
                // Build performance_tasks payload
                $taskPayload = [
                    'id'          => 'task-' . substr(bin2hex(random_bytes(5)), 0, 10),
                    'goal_id'     => $goalId ?? ($item['goal_id'] ?? null),
                    'employee_id' => $empId,
                    'task_type'   => 'specific',
                    'title'       => $item['title'] ?? 'Development Task',
                    'description' => $item['description'] ?? '',
                    'target_date' => $item['target_date'] ?? date('Y-m-d', strtotime('+14 days')),
                    'status'      => 'pending',
                    'created_at'  => date('c'),
                    'updated_at'  => date('c'),
                ];
                $res = supabaseRequest('performance_tasks', 'POST', $taskPayload, true);
                if ($res['status'] >= 200 && $res['status'] < 300) {
                    $tasksDeployed++;
                    $this->update((string)$item['id'], ['status' => 'Committed']);
                } else {
                    $errors[] = "Task '{$item['title']}': " . ($res['data']['message'] ?? 'Insert failed');
                }

            } elseif ($type === 'lms_book') {
                // Build lms_prescribed payload
                $bookPayload = [
                    'id'         => 'lms-presc-' . substr(bin2hex(random_bytes(5)), 0, 8),
                    'lms_id'     => $item['lms_document_id'],
                    'employee'   => $empId,
                    'goal_id'    => $goalId ?? ($item['goal_id'] ?? null),
                    'for'        => ($item['goal_id'] || $goalId) ? 'goal' : 'both',
                    'scores'     => 0,
                    'ratings'    => 0,
                    'progress'   => 0,
                    'status'     => 'Needs Retake',
                    'created_at' => date('c'),
                    'updated_at' => date('c'),
                ];
                $res = supabaseRequest('lms_prescribed', 'POST', $bookPayload, true);
                if ($res['status'] >= 200 && $res['status'] < 300) {
                    $booksDeployed++;
                    $this->update((string)$item['id'], ['status' => 'Committed']);
                } else {
                    $errors[] = "LMS Book '{$item['title']}': " . ($res['data']['message'] ?? 'Insert failed');
                }
            }
        }

        return [
            'success'        => empty($errors),
            'message'        => empty($errors)
                ? "Plan deployed: {$tasksDeployed} task(s) and {$booksDeployed} LMS book(s) committed."
                : "Partial deploy. Errors: " . implode('; ', $errors),
            'tasks_deployed' => $tasksDeployed,
            'books_deployed' => $booksDeployed,
            'errors'         => $errors,
        ];
    }
}
