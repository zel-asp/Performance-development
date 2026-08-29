<?php
require_once __DIR__ . '/../config/config.php';

class LmsController
{
    /**
     * Get LMS Documents from Supabase SQL with Department Joins & Filters
     */
    public function getDocuments(array $params = []): array
    {
        $deptId = $params['department_id'] ?? $params['dept'] ?? null;
        $category = $params['category'] ?? null;
        $status = $params['status'] ?? null;
        $search = isset($params['search']) ? trim($params['search']) : '';

        // 1. Fetch Departments map
        $deptRes = supabaseRequest('departments', 'GET', null, true);
        $departments = is_array($deptRes['data']) ? $deptRes['data'] : [];
        $deptMap = [];
        foreach ($departments as $d) {
            $deptMap[$d['id']] = $d['name'];
        }

        // 2. Build Query for lms_documents
        $query = 'lms_documents?order=created_at.desc';
        if (!empty($status) && $status !== 'all') {
            $query .= '&status=eq.' . urlencode($status);
        }

        $res = supabaseRequest($query, 'GET', null, true);
        $allDocs = is_array($res['data']) ? $res['data'] : [];

        // 3. Resolve department names and filter in PHP
        $filtered = [];
        $deptSlugMap = [
            'front_office' => 'Front Office',
            'culinary' => 'Kitchen',
            'kitchen' => 'Kitchen',
            'fb_service' => 'Food & Beverage',
            'housekeeping' => 'Housekeeping'
        ];

        foreach ($allDocs as $doc) {
            $dId = $doc['department_id'] ?? null;
            $dName = $dId && isset($deptMap[$dId]) ? $deptMap[$dId] : 'Property-Wide';
            $doc['department_name'] = $dName;

            // Department filter
            if (!empty($deptId) && $deptId !== 'all') {
                $targetName = $deptSlugMap[strtolower(trim($deptId))] ?? $deptId;
                $match = false;
                if ($dId === $deptId) $match = true;
                if (strcasecmp($dName, $targetName) === 0 || strpos(strtolower($dName), strtolower($targetName)) !== false || strpos(strtolower($targetName), strtolower($dName)) !== false) {
                    $match = true;
                }
                if (!$match && $dId !== null) {
                    continue;
                }
            }

            // Category filter
            if (!empty($category) && $category !== 'all') {
                if (strcasecmp($doc['category'] ?? '', $category) !== 0) {
                    continue;
                }
            }

            // Search query filter
            if (!empty($search)) {
                $haystack = strtolower(($doc['title'] ?? '') . ' ' . ($doc['description'] ?? '') . ' ' . ($doc['category'] ?? '') . ' ' . $dName . ' ' . ($doc['learning_outcomes'] ?? ''));
                if (strpos($haystack, strtolower($search)) === false) {
                    continue;
                }
            }

            // Decorate visually for frontend
            $doc['gradient'] = $this->getCategoryGradient($doc['category'] ?? '', $dName);
            $doc['icon'] = $this->getCategoryIcon($doc['category'] ?? '', $dName);
            $doc['badge_color'] = $this->getCategoryBadge($doc['category'] ?? '');

            $filtered[] = $doc;
        }

        return [
            'success' => true,
            'data' => $filtered,
            'total' => count($filtered)
        ];
    }

    /**
     * Publish Document Record from Direct Storage Upload
     */
    public function publishDocumentRecord(array $postData): array
    {
        $title = trim($postData['title'] ?? '');
        if (empty($title)) {
            return ['success' => false, 'message' => 'Document title is required.'];
        }

        $filePath = trim($postData['file_path'] ?? '');
        if (empty($filePath)) {
            return ['success' => false, 'message' => 'Document file path is required.'];
        }

        $category = trim($postData['category'] ?? 'SOP Manual');
        $deptId = trim($postData['department_id'] ?? $postData['department'] ?? '');
        if (empty($deptId) || $deptId === 'all') {
            $deptId = null;
        }

        // If department was passed as slug, resolve to department UUID
        if ($deptId && !preg_match('/^[0-9a-f\-]{36}$/i', $deptId)) {
            $deptRes = supabaseRequest('departments', 'GET', null, true);
            $departments = is_array($deptRes['data']) ? $deptRes['data'] : [];
            $cleanSlug = str_replace('_', ' ', strtolower($deptId));
            foreach ($departments as $d) {
                if (strpos(strtolower($d['name']), $cleanSlug) !== false || strpos($cleanSlug, strtolower($d['name'])) !== false) {
                    $deptId = $d['id'];
                    break;
                }
            }
        }

        $origFileName = basename($postData['file_name'] ?? 'document.pdf');
        $fileSize = (int)($postData['file_size'] ?? 0);
        $fileType = $postData['file_type'] ?? 'application/pdf';

        $pages = isset($postData['estimated_pages']) && (int)$postData['estimated_pages'] > 0 ? (int)$postData['estimated_pages'] : 18;
        $readingMin = isset($postData['estimated_reading_minutes']) && (int)$postData['estimated_reading_minutes'] > 0 ? (int)$postData['estimated_reading_minutes'] : max(5, round($pages * 1.5));
        $expReward = isset($postData['exp_reward']) && (int)$postData['exp_reward'] > 0 ? (int)$postData['exp_reward'] : 100;
        $desc = trim($postData['description'] ?? '');
        $learningOutcomes = trim($postData['learning_outcomes'] ?? '');
        $status = in_array($postData['status'] ?? '', ['Draft', 'Published', 'Archived']) ? $postData['status'] : 'Published';
        $uploadedBy = $postData['uploaded_by'] ?? 'emp-103';
        $isMandatory = !empty($postData['is_mandatory']) || !empty($postData['manatory']) || (isset($postData['mandatory']) && ($postData['mandatory'] === true || $postData['mandatory'] === 1 || $postData['mandatory'] === '1' || $postData['mandatory'] === 'true'));

        $now = date('c');
        $docRecord = [
            'title' => $title,
            'file_name' => $origFileName,
            'file_path' => $filePath,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'department_id' => $deptId,
            'category' => $category,
            'estimated_reading_minutes' => $readingMin,
            'estimated_pages' => $pages,
            'exp_reward' => $expReward,
            'description' => $desc ?: 'Standard operating procedure manual and operational workflow guidance.',
            'learning_outcomes' => $learningOutcomes ?: 'Understand operational hospitality standards and procedural benchmarks.',
            'status' => $status,
            'uploaded_by' => $uploadedBy,
            'manatory' => $isMandatory,
            'created_at' => $now,
            'updated_at' => $now
        ];

        $insertRes = supabaseRequest('lms_documents', 'POST', $docRecord, true);
        if ($insertRes['status'] >= 200 && $insertRes['status'] < 300 && !empty($insertRes['data'])) {
            $created = is_array($insertRes['data']) && isset($insertRes['data'][0]) ? $insertRes['data'][0] : $docRecord;
            $createdId = $created['id'] ?? ($insertRes['data'][0]['id'] ?? null);

            $prescribeMsg = '';
            if ($isMandatory && $createdId) {
                $count = $this->prescribeToAllEmployees($createdId);
                $prescribeMsg = " (Mandatory SOP auto-prescribed to all {$count} employees)";
            }

            return [
                'success' => true,
                'message' => "Handbook \"{$title}\" successfully published to LMS library!{$prescribeMsg}",
                'data' => $created
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to save document metadata in Supabase database: ' . ($insertRes['error'] ?? 'Database error')
        ];
    }

    /**
     * Upload Document to Supabase Storage & Create SQL Record
     */

    public function uploadDocument(?array $file, array $postData): array
    {
        if (empty($file)) {
            if (!empty($_FILES)) {
                $file = $_FILES['document'] ?? $_FILES['file'] ?? reset($_FILES);
            }
        }

        if (!empty($file) && isset($file['error']) && $file['error'] !== UPLOAD_ERR_OK) {
            switch ($file['error']) {
                case UPLOAD_ERR_INI_SIZE:
                    return [
                        'success' => false,
                        'message' => 'The uploaded file exceeds the PHP server upload limit (' . ini_get('upload_max_filesize') . '). Please choose a file smaller than ' . ini_get('upload_max_filesize') . ' or increase upload_max_filesize in php.ini.'
                    ];
                case UPLOAD_ERR_FORM_SIZE:
                    return ['success' => false, 'message' => 'The uploaded file exceeds the maximum form file size.'];
                case UPLOAD_ERR_PARTIAL:
                    return ['success' => false, 'message' => 'The document was only partially uploaded. Please try again.'];
                case UPLOAD_ERR_NO_FILE:
                    return ['success' => false, 'message' => 'No document file was selected. Please choose a PDF/DOCX file to upload.'];
                case UPLOAD_ERR_NO_TMP_DIR:
                    return ['success' => false, 'message' => 'Server error: Missing temporary upload directory.'];
                case UPLOAD_ERR_CANT_WRITE:
                    return ['success' => false, 'message' => 'Server error: Failed to write uploaded file to disk.'];
                default:
                    return ['success' => false, 'message' => 'Upload error occurred (PHP Error Code: ' . $file['error'] . ').'];
            }
        }

        if (empty($file) || !isset($file['tmp_name']) || empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            return ['success' => false, 'message' => 'No valid document file was received by the server. Please select a document file.'];
        }

        $title = trim($postData['title'] ?? '');
        if (empty($title)) {
            return ['success' => false, 'message' => 'Document title is required.'];
        }

        $category = trim($postData['category'] ?? 'SOP Manual');
        $deptId = trim($postData['department_id'] ?? $postData['department'] ?? '');
        if (empty($deptId) || $deptId === 'all') {
            $deptId = null;
        }

        // If department was passed as slug, resolve to department UUID
        if ($deptId && !preg_match('/^[0-9a-f\-]{36}$/i', $deptId)) {
            $deptRes = supabaseRequest('departments', 'GET', null, true);
            $departments = is_array($deptRes['data']) ? $deptRes['data'] : [];
            $cleanSlug = str_replace('_', ' ', strtolower($deptId));
            foreach ($departments as $d) {
                if (strpos(strtolower($d['name']), $cleanSlug) !== false || strpos($cleanSlug, strtolower($d['name'])) !== false) {
                    $deptId = $d['id'];
                    break;
                }
            }
        }

        $origFileName = basename($file['name'] ?? 'document.pdf');
        $fileSize = (int)($file['size'] ?? filesize($file['tmp_name']));
        $fileType = mime_content_type($file['tmp_name']) ?: ($file['type'] ?? 'application/octet-stream');

        // Reading time & pages
        $pages = isset($postData['estimated_pages']) && (int)$postData['estimated_pages'] > 0 ? (int)$postData['estimated_pages'] : null;
        $readingMin = isset($postData['estimated_reading_minutes']) && (int)$postData['estimated_reading_minutes'] > 0 ? (int)$postData['estimated_reading_minutes'] : null;
        
        if ($pages === null && isset($postData['pages'])) {
            if (preg_match('/(\d+)\s*Pages/i', $postData['pages'], $m)) {
                $pages = (int)$m[1];
            }
        }
        if ($readingMin === null && $pages !== null) {
            $readingMin = max(5, round($pages * 1.5));
        }

        $expReward = isset($postData['exp_reward']) && (int)$postData['exp_reward'] > 0 ? (int)$postData['exp_reward'] : 100;
        $desc = trim($postData['description'] ?? '');
        $learningOutcomes = trim($postData['learning_outcomes'] ?? '');
        $status = in_array($postData['status'] ?? '', ['Draft', 'Published', 'Archived']) ? $postData['status'] : 'Published';
        $uploadedBy = $postData['uploaded_by'] ?? 'emp-103';
        $isMandatory = !empty($postData['is_mandatory']) || !empty($postData['manatory']) || (isset($postData['mandatory']) && ($postData['mandatory'] === true || $postData['mandatory'] === 1 || $postData['mandatory'] === '1' || $postData['mandatory'] === 'true'));

        // 1. Upload to Supabase Storage in "documents" bucket
        $sanitizedName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $origFileName);
        $storagePath = 'lms/' . date('Ymd_His') . '_' . uniqid() . '_' . $sanitizedName;
        $fileContent = file_get_contents($file['tmp_name']);

        $storageRes = uploadToSupabaseStorage('documents', $storagePath, $fileContent, $fileType);
        if ($storageRes['status'] >= 400 || !empty($storageRes['error'])) {
            return [
                'success' => false,
                'message' => 'Failed to upload document file to Supabase storage: ' . ($storageRes['error'] ?? 'Unknown storage error')
            ];
        }

        $publicUrl = $storageRes['publicUrl'];

        // 2. Insert record into public.lms_documents
        $now = date('c');
        $docRecord = [
            'title' => $title,
            'file_name' => $origFileName,
            'file_path' => $publicUrl,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'department_id' => $deptId,
            'category' => $category,
            'estimated_reading_minutes' => $readingMin,
            'estimated_pages' => $pages,
            'exp_reward' => $expReward,
            'description' => $desc ?: 'Standard operating procedure manual and operational workflow guidance.',
            'learning_outcomes' => $learningOutcomes ?: 'Understand operational hospitality standards and procedural benchmarks.',
            'status' => $status,
            'uploaded_by' => $uploadedBy,
            'manatory' => $isMandatory,
            'created_at' => $now,
            'updated_at' => $now
        ];

        $insertRes = supabaseRequest('lms_documents', 'POST', $docRecord, true);
        if ($insertRes['status'] >= 200 && $insertRes['status'] < 300 && !empty($insertRes['data'])) {
            $created = is_array($insertRes['data']) && isset($insertRes['data'][0]) ? $insertRes['data'][0] : $docRecord;
            $createdId = $created['id'] ?? ($insertRes['data'][0]['id'] ?? null);

            $prescribeMsg = '';
            if ($isMandatory && $createdId) {
                $count = $this->prescribeToAllEmployees($createdId);
                $prescribeMsg = " (Mandatory SOP auto-prescribed to all {$count} employees)";
            }

            return [
                'success' => true,
                'message' => "Handbook \"{$title}\" successfully uploaded to Supabase Storage and published to LMS library!{$prescribeMsg}",
                'data' => $created
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to save document metadata in Supabase database: ' . ($insertRes['error'] ?? 'Database error')
        ];
    }

    /**
     * Prescribe an LMS Document to All Active Employees (Mandatory SOP)
     */
    public function prescribeToAllEmployees(string $lmsId): int
    {
        $empRes = supabaseRequest('employees', 'GET', null, true);
        $employees = is_array($empRes['data'] ?? null) ? $empRes['data'] : [];
        if (empty($employees)) {
            $employees = [
                ['id' => 'emp-101', 'full_name' => 'Maria Santos'],
                ['id' => 'emp-102', 'full_name' => 'Chef Marco Rossi'],
                ['id' => 'emp-103', 'full_name' => 'John Marco']
            ];
        }

        $prescribedCount = 0;
        foreach ($employees as $emp) {
            $empId = $emp['id'] ?? null;
            if (!$empId) continue;
            $this->prescribeDocument([
                'employee' => $empId,
                'lms_id' => $lmsId,
                'goal_id' => null,
                'scores' => 0.00,
                'ratings' => 0.00,
                'progress' => 0,
                'status' => 'Pending',
                'for' => 'both',
                'time_consumed' => 0
            ]);
        }
        return $prescribedCount;
    }

    /**
     * Delete LMS Document from SQL and Supabase Storage
     */
    public function deleteDocument(string $id): array
    {
        if (empty($id)) {
            return ['success' => false, 'message' => 'Document ID is required.'];
        }

        // 1. Fetch document record first to extract the storage file path
        $getRes = supabaseRequest('lms_documents?id=eq.' . urlencode($id), 'GET', null, true);
        $doc = is_array($getRes['data']) && !empty($getRes['data']) ? $getRes['data'][0] : null;

        if ($doc) {
            $filePath = $doc['file_path'] ?? '';
            // Remove query parameters or fragments if any
            $cleanUrl = explode('?', $filePath)[0];
            $cleanUrl = explode('#', $cleanUrl)[0];

            $storagePath = '';
            // Match various Supabase storage URL patterns
            if (preg_match('#/storage/v1/object/(?:public/|authenticated/)?documents/(.+)$#i', $cleanUrl, $matches)) {
                $storagePath = urldecode($matches[1]);
            } elseif (preg_match('#^documents/(.+)$#i', $cleanUrl, $matches)) {
                $storagePath = urldecode($matches[1]);
            } elseif (strpos($cleanUrl, 'lms/') === 0) {
                $storagePath = urldecode($cleanUrl);
            } elseif (!empty($cleanUrl) && !preg_match('#^https?://#i', $cleanUrl)) {
                $storagePath = urldecode(ltrim($cleanUrl, '/'));
            }

            // 2. Delete file from Supabase Storage bucket 'documents'
            if (!empty($storagePath)) {
                deleteFromSupabaseStorage('documents', $storagePath);
            }

            // Also check local uploads fallback if file exists locally
            if (!empty($cleanUrl) && !preg_match('#^https?://#i', $cleanUrl)) {
                $localPath = __DIR__ . '/../' . ltrim($cleanUrl, '/');
                if (file_exists($localPath) && is_file($localPath)) {
                    @unlink($localPath);
                }
            }
        }

        // 3. Delete record from Supabase SQL table lms_documents
        $delRes = supabaseRequest('lms_documents?id=eq.' . urlencode($id), 'DELETE', null, true);
        if ($delRes['status'] >= 200 && $delRes['status'] < 300) {
            return [
                'success' => true,
                'message' => 'Document and associated storage file deleted successfully from LMS library.'
            ];
        }

        return ['success' => false, 'message' => $delRes['error'] ?? 'Failed to delete document from database.'];
    }

    /**
     * Get Visual Gradient for Book Cover
     */
    private function getCategoryGradient(string $category, string $deptName): string
    {
        $cat = strtolower($category);
        $dept = strtolower($deptName);

        if (strpos($cat, 'compliance') !== false || strpos($cat, 'safety') !== false) {
            return 'from-[#065F46] via-[#047857] to-[#022C22]'; // Deep Emerald
        }
        if (strpos($dept, 'culinary') !== false || strpos($dept, 'kitchen') !== false) {
            return 'from-[#065F46] via-[#047857] to-[#022C22]'; // Kitchen Emerald
        }
        if (strpos($cat, 'masterclass') !== false || strpos($dept, 'beverage') !== false) {
            return 'from-[#92400E] via-[#B45309] to-[#451A03]'; // Wine Amber
        }
        if (strpos($dept, 'housekeeping') !== false) {
            return 'from-[#1E3A8A] via-[#1D4ED8] to-[#0F172A]'; // Royal Navy Blue
        }
        if (strpos($cat, 'emergency') !== false || strpos($cat, 'crisis') !== false) {
            return 'from-[#881337] via-[#9F1239] to-[#4C0519]'; // Burgundy Rose
        }
        // Default Hospitality Crimson
        return 'from-[#7F1418] via-[#9E1B20] to-[#450A0C]';
    }

    /**
     * Get FontAwesome Icon for Book Cover
     */
    private function getCategoryIcon(string $category, string $deptName): string
    {
        $cat = strtolower($category);
        $dept = strtolower($deptName);

        if (strpos($dept, 'front') !== false) return 'fa-bell-concierge';
        if (strpos($dept, 'kitchen') !== false || strpos($dept, 'culinary') !== false) return 'fa-utensils';
        if (strpos($dept, 'beverage') !== false || strpos($dept, 'f&b') !== false) return 'fa-wine-glass-empty';
        if (strpos($dept, 'housekeeping') !== false) return 'fa-bed';
        if (strpos($cat, 'safety') !== false || strpos($cat, 'emergency') !== false) return 'fa-shield-halved';
        return 'fa-book-bookmark';
    }

    /**
     * Prescribe LMS Document to an Employee (Insert into lms_prescribed)
     */
    public function prescribeDocument(array $postData): array
    {
        $employee = trim($postData['employee'] ?? $postData['employee_id'] ?? '');
        if (empty($employee)) {
            return ['success' => false, 'message' => 'Employee ID is required for prescription.'];
        }

        $lmsId = trim($postData['lms_id'] ?? $postData['book_id'] ?? '');
        if (empty($lmsId)) {
            return ['success' => false, 'message' => 'LMS document ID is required.'];
        }

        $goalId = isset($postData['goal_id']) && !empty($postData['goal_id']) ? (int)$postData['goal_id'] : null;
        $scores = isset($postData['scores']) ? (float)$postData['scores'] : (isset($postData['score']) ? (float)$postData['score'] : 0.00);
        $ratings = isset($postData['ratings']) ? (float)$postData['ratings'] : (isset($postData['rating']) ? (float)$postData['rating'] : 0.00);
        $progress = isset($postData['progress']) ? (int)$postData['progress'] : 0;
        $status = in_array($postData['status'] ?? '', ['needs retake', 'passed', 'Needs Retake', 'Passed', 'In Progress', 'Pending']) ? $postData['status'] : 'Needs Retake';
        $forType = in_array(strtolower($postData['for'] ?? ''), ['goal', 'competency', 'both']) ? strtolower($postData['for']) : 'both';
        $timeConsumed = isset($postData['time_consumed']) ? (int)$postData['time_consumed'] : 0;
        $lastAttempt = !empty($postData['last_attempt']) ? $postData['last_attempt'] : null;

        // 1. Check if employee is already enrolled / prescribed in this LMS document
        $query = 'lms_prescribed?employee=eq.' . urlencode($employee) . '&lms_id=eq.' . urlencode($lmsId);
        $checkRes = supabaseRequest($query, 'GET', null, true);
        if ($checkRes['status'] >= 200 && $checkRes['status'] < 300 && !empty($checkRes['data']) && is_array($checkRes['data'])) {
            return [
                'success' => true,
                'already_enrolled' => true,
                'message' => 'Employee is already enrolled in this LMS document.',
                'data' => $checkRes['data'][0]
            ];
        }

        // 2. Insert new prescription record into lms_prescribed database table
        $now = date('c');
        $record = [
            'employee' => $employee,
            'lms_id' => $lmsId,
            'goal_id' => $goalId,
            'scores' => $scores,
            'ratings' => $ratings,
            'progress' => $progress,
            'status' => $status,
            'for' => $forType,
            'last_attempt' => $lastAttempt,
            'time_consumed' => $timeConsumed,
            'created_at' => $now,
            'updated_at' => $now
        ];

        $insertRes = supabaseRequest('lms_prescribed', 'POST', $record, true);
        if ($insertRes['status'] >= 200 && $insertRes['status'] < 300 && !empty($insertRes['data'])) {
            $created = is_array($insertRes['data']) && isset($insertRes['data'][0]) ? $insertRes['data'][0] : $record;
            return [
                'success' => true,
                'already_enrolled' => false,
                'message' => 'LMS document successfully prescribed and enrolled in database!',
                'data' => $created
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to insert prescription into lms_prescribed database: ' . ($insertRes['error'] ?? 'Database error')
        ];
    }

    /**
     * Get Prescribed LMS Documents with Document & Employee Details
     */
    public function getPrescribedDocuments(array $params = []): array
    {
        $employee = trim($params['employee'] ?? $params['employee_id'] ?? '');
        $query = 'lms_prescribed?order=created_at.desc';
        if (!empty($employee)) {
            $query .= '&employee=eq.' . urlencode($employee);
        }

        $res = supabaseRequest($query, 'GET', null, true);
        $records = is_array($res['data']) ? $res['data'] : [];

        // 1. Fetch lms_documents map
        $docRes = supabaseRequest('lms_documents', 'GET', null, true);
        $documents = is_array($docRes['data']) ? $docRes['data'] : [];
        $docMap = [];
        foreach ($documents as $d) {
            $docMap[$d['id']] = $d;
        }

        // 2. Fetch employees map
        $empRes = supabaseRequest('employees', 'GET', null, true);
        $employees = is_array($empRes['data']) ? $empRes['data'] : [];
        $empMap = [];
        foreach ($employees as $e) {
            $empMap[$e['id']] = $e;
        }

        $enriched = [];
        foreach ($records as $rec) {
            $lId = $rec['lms_id'] ?? null;
            $eId = $rec['employee'] ?? null;

            $doc = $lId && isset($docMap[$lId]) ? $docMap[$lId] : null;
            $emp = $eId && isset($empMap[$eId]) ? $empMap[$eId] : null;

            $rec['document_title'] = $doc['title'] ?? 'SOP Handbook';
            $rec['document_category'] = $doc['category'] ?? 'SOP Manual';
            $rec['document_department'] = $doc['department_name'] ?? ($doc['department_id'] ?? 'Property-Wide');
            $rec['document_file_path'] = $doc['file_path'] ?? '#';

            $rec['employee_name'] = $emp['full_name'] ?? ($eId === 'emp-101' ? 'Maria Santos' : ($eId === 'emp-102' ? 'Antonio Silva' : ($eId === 'emp-103' ? 'John Marco' : $eId)));
            $rec['employee_title'] = $emp['title'] ?? 'Associate';
            $rec['employee_role'] = $emp['role'] ?? 'Associate';
            $rec['employee_avatar'] = $emp['avatar_url'] ?? 'public/images/removed-bg-logo.png';

            $enriched[] = $rec;
        }

        return [
            'success' => true,
            'data' => $enriched,
            'total' => count($enriched)
        ];
    }

    /**
     * Update Prescription Progress / Status in lms_prescribed table
     */
    public function updatePrescriptionStatus(array $postData): array
    {
        $id = trim($postData['id'] ?? '');
        if (empty($id)) {
            return ['success' => false, 'message' => 'Prescription record ID is required.'];
        }

        $updatePayload = [];
        if (isset($postData['scores'])) $updatePayload['scores'] = (float)$postData['scores'];
        if (isset($postData['ratings'])) $updatePayload['ratings'] = (float)$postData['ratings'];
        if (isset($postData['progress'])) $updatePayload['progress'] = (int)$postData['progress'];
        if (isset($postData['status'])) $updatePayload['status'] = $postData['status'];
        if (isset($postData['time_consumed'])) $updatePayload['time_consumed'] = (int)$postData['time_consumed'];
        if (isset($postData['last_attempt'])) $updatePayload['last_attempt'] = $postData['last_attempt'];
        if (isset($postData['for'])) $updatePayload['for'] = $postData['for'];
        $updatePayload['updated_at'] = date('c');

        $res = supabaseRequest('lms_prescribed?id=eq.' . urlencode($id), 'PATCH', $updatePayload, true);
        if ($res['status'] >= 200 && $res['status'] < 300) {
            return ['success' => true, 'message' => 'LMS prescription updated successfully!', 'data' => $updatePayload];
        }

        return ['success' => false, 'message' => $res['error'] ?? 'Failed to update prescription record.'];
    }


    /**
     * Get Needs Analysis (TNA) Category Cards with Highest Enrolled from Supabase
     */
    public function getNeedsAnalysisData(): array
    {
        // 1. Fetch all documents from Supabase
        $docRes = supabaseRequest('lms_documents?order=created_at.desc', 'GET', null, true);
        $allDocs = is_array($docRes['data'] ?? null) ? $docRes['data'] : [];

        // 2. Fetch all prescribed enrollments from Supabase
        $presRes = supabaseRequest('lms_prescribed', 'GET', null, true);
        $allPres = is_array($presRes['data'] ?? null) ? $presRes['data'] : [];

        // 3. Define Standard Categories & detect any additional custom ones from DB
        $standardCategories = [
            'SOP Manual',
            'Compliance Standard',
            'Masterclass Guide',
            'Safety Protocol'
        ];

        $categoriesMap = [];
        foreach ($standardCategories as $cat) {
            $categoriesMap[strtolower($cat)] = [
                'category' => $cat,
                'docs' => [],
                'prescribed' => []
            ];
        }

        // Map documents into categories
        foreach ($allDocs as $doc) {
            $cat = trim($doc['category'] ?? 'SOP Manual');
            $key = strtolower($cat);
            if (!isset($categoriesMap[$key])) {
                $categoriesMap[$key] = [
                    'category' => $cat,
                    'docs' => [],
                    'prescribed' => []
                ];
            }
            $categoriesMap[$key]['docs'][] = $doc;
        }

        // Build document-to-category lookup
        $docToCatKey = [];
        foreach ($allDocs as $doc) {
            $dId = $doc['id'] ?? '';
            if ($dId) {
                $docToCatKey[$dId] = strtolower(trim($doc['category'] ?? 'SOP Manual'));
            }
        }

        // Map prescribed records into categories
        foreach ($allPres as $pres) {
            $lmsId = $pres['lms_id'] ?? '';
            if ($lmsId && isset($docToCatKey[$lmsId])) {
                $catKey = $docToCatKey[$lmsId];
                if (isset($categoriesMap[$catKey])) {
                    $categoriesMap[$catKey]['prescribed'][] = $pres;
                }
            }
        }

        // 4. Calculate aggregated metrics per category
        $categoryCards = [];
        foreach ($categoriesMap as $key => $data) {
            $catName = $data['category'];
            $docs = $data['docs'];
            $pres = $data['prescribed'];

            $docCount = count($docs);
            $enrolledCount = count($pres);
            $passedCount = 0;
            $totalScore = 0;

            foreach ($pres as $p) {
                $score = isset($p['scores']) ? (float)$p['scores'] : 0;
                $totalScore += $score;
                $status = strtolower($p['status'] ?? '');
                if ($status === 'passed' || strpos($status, 'cert') !== false) {
                    $passedCount++;
                }
            }

            $avgScore = $enrolledCount > 0 ? round($totalScore / $enrolledCount, 1) : 0;

            // Find top document in this category (with most enrollments or newest)
            $topDoc = null;
            if ($docCount > 0) {
                // Count enrollments per doc
                $docEnrollCounts = [];
                foreach ($pres as $p) {
                    $lId = $p['lms_id'] ?? '';
                    $docEnrollCounts[$lId] = ($docEnrollCounts[$lId] ?? 0) + 1;
                }

                usort($docs, function($a, $b) use ($docEnrollCounts) {
                    $cntA = $docEnrollCounts[$a['id'] ?? ''] ?? 0;
                    $cntB = $docEnrollCounts[$b['id'] ?? ''] ?? 0;
                    if ($cntA === $cntB) {
                        return strcmp($b['created_at'] ?? '', $a['created_at'] ?? '');
                    }
                    return $cntB - $cntA;
                });
                $topDoc = $docs[0];
            }

            $categoryCards[] = [
                'category' => $catName,
                'display_name' => $this->getCategoryDisplayName($catName),
                'subtitle' => $this->getCategorySubtitle($catName),
                'documents_count' => $docCount,
                'enrolled_count' => $enrolledCount,
                'passed_count' => $passedCount,
                'avg_score' => $avgScore,
                'is_empty' => ($docCount === 0),
                'top_document' => $topDoc ? [
                    'id' => $topDoc['id'] ?? '',
                    'title' => $topDoc['title'] ?? '',
                    'department_id' => $topDoc['department_id'] ?? null,
                    'estimated_pages' => $topDoc['estimated_pages'] ?? 18,
                    'estimated_reading_minutes' => $topDoc['estimated_reading_minutes'] ?? 20,
                    'exp_reward' => $topDoc['exp_reward'] ?? 100,
                    'file_path' => $topDoc['file_path'] ?? '#'
                ] : null,
                'border_color' => $this->getCategoryBorderColor($catName),
                'text_color' => $this->getCategoryTextColor($catName),
                'badge_class' => $this->getCategoryBadge($catName),
                'icon' => $this->getCategoryIcon($catName, '')
            ];
        }

        // 5. Sort by enrolled_count DESC, then documents_count DESC
        usort($categoryCards, function ($a, $b) {
            if ($a['enrolled_count'] === $b['enrolled_count']) {
                return $b['documents_count'] - $a['documents_count'];
            }
            return $b['enrolled_count'] - $a['enrolled_count'];
        });

        // 6. Return top 4 categories
        $top4 = array_slice($categoryCards, 0, 4);

        return [
            'success' => true,
            'data' => [
                'categories' => $top4,
                'total_documents' => count($allDocs),
                'total_prescribed' => count($allPres)
            ]
        ];
    }

    private function getCategoryDisplayName(string $category): string
    {
        $cat = strtolower($category);
        if (strpos($cat, 'sop') !== false) return 'SOP Operations';
        if (strpos($cat, 'compliance') !== false || strpos($cat, 'hygiene') !== false) return 'Compliance & Hygiene';
        if (strpos($cat, 'masterclass') !== false) return 'Service Masterclass';
        if (strpos($cat, 'safety') !== false || strpos($cat, 'emergency') !== false) return 'Safety & Protocols';
        return $category;
    }

    private function getCategorySubtitle(string $category): string
    {
        $cat = strtolower($category);
        if (strpos($cat, 'sop') !== false) return 'Standard workflow benchmarks & operational excellence.';
        if (strpos($cat, 'compliance') !== false || strpos($cat, 'hygiene') !== false) return 'Mandatory quality audits, health & sanitation standards.';
        if (strpos($cat, 'masterclass') !== false) return 'Upskilling, premium guest pacing & sommelier expertise.';
        if (strpos($cat, 'safety') !== false || strpos($cat, 'emergency') !== false) return 'Fire safety, emergency readiness & licensing renewals.';
        return 'Training handbooks and departmental procedure manuals.';
    }

    private function getCategoryBorderColor(string $category): string
    {
        $cat = strtolower($category);
        if (strpos($cat, 'compliance') !== false) return 'border-l-sage';
        if (strpos($cat, 'masterclass') !== false) return 'border-l-gold';
        if (strpos($cat, 'safety') !== false) return 'border-l-terracotta';
        return 'border-l-dusty';
    }

    private function getCategoryTextColor(string $category): string
    {
        $cat = strtolower($category);
        if (strpos($cat, 'compliance') !== false) return 'text-sage-dark';
        if (strpos($cat, 'masterclass') !== false) return 'text-gold-dark';
        if (strpos($cat, 'safety') !== false) return 'text-terracotta-dark';
        return 'text-dusty-dark';
    }

    /**
     * Get Badge Class for Category
     */
    private function getCategoryBadge(string $category): string
    {
        $cat = strtolower($category);
        if (strpos($cat, 'compliance') !== false) return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
        if (strpos($cat, 'masterclass') !== false) return 'bg-amber-100 text-amber-800 border border-amber-200';
        if (strpos($cat, 'safety') !== false) return 'bg-rose-100 text-rose-800 border border-rose-200';
        return 'bg-gold-50 text-gold-dark border border-gold-200';
    }
}


