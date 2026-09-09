<?php
require_once __DIR__ . '/../config/config.php';

class LmsController
{
    private static array $memoryCache = [];

    /**
     * Get cached payload if fresh
     */
    private static function getCache(string $key, int $ttlSeconds = 60)
    {
        if (isset(self::$memoryCache[$key]) && (time() - (self::$memoryCache[$key]['time'] ?? 0) < $ttlSeconds)) {
            return self::$memoryCache[$key]['data'];
        }
        $cacheFile = sys_get_temp_dir() . '/lms_cache_' . md5($key) . '.json';
        if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $ttlSeconds)) {
            $raw = @file_get_contents($cacheFile);
            if ($raw) {
                $decoded = json_decode($raw, true);
                if ($decoded !== null) {
                    self::$memoryCache[$key] = ['time' => filemtime($cacheFile), 'data' => $decoded];
                    return $decoded;
                }
            }
        }
        return null;
    }

    /**
     * Store payload into cache
     */
    private static function setCache(string $key, $data): void
    {
        self::$memoryCache[$key] = ['time' => time(), 'data' => $data];
        $cacheFile = sys_get_temp_dir() . '/lms_cache_' . md5($key) . '.json';
        @file_put_contents($cacheFile, json_encode($data));
    }

    /**
     * Clear LMS cache entries
     */
    public static function clearCache(): void
    {
        self::$memoryCache = [];
        $tmpDir = sys_get_temp_dir();
        $files = @glob($tmpDir . '/lms_cache_*.json');
        if ($files) {
            foreach ($files as $f) {
                @unlink($f);
            }
        }
    }

    /**
     * Get LMS Documents from Supabase SQL with Department Joins & Filters
     */
    public function getDocuments(array $params = []): array
    {
        $deptId = $params['department_id'] ?? $params['dept'] ?? null;
        $category = $params['category'] ?? null;
        $status = $params['status'] ?? null;
        $search = isset($params['search']) ? trim($params['search']) : '';
        $userId = trim($params['user_id'] ?? $params['employee_id'] ?? $params['employee'] ?? ($_SESSION['user']['id'] ?? ''));
        $role = strtolower(trim($params['role'] ?? $params['user_role'] ?? ($_SESSION['user']['role'] ?? '')));

        $cacheKey = 'docs_' . md5(json_encode([$deptId, $category, $status, $search, $userId, $role]));
        $cached = self::getCache($cacheKey, 30);
        if ($cached !== null) {
            return $cached;
        }

        // 1. Fetch Departments map (cached for 300s)
        $deptMap = self::getCache('dept_map', 300);
        if ($deptMap === null) {
            $deptRes = supabaseRequest('departments', 'GET', null, true);
            $departments = is_array($deptRes['data']) ? $deptRes['data'] : [];
            $deptMap = [];
            foreach ($departments as $d) {
                $deptMap[$d['id']] = $d['name'];
            }
            self::setCache('dept_map', $deptMap);
        }

        // Determine supervisor/manager authority
        $isSupervisor = empty($role) ||
            strpos($role, 'supervisor') !== false ||
            strpos($role, 'manager') !== false ||
            strpos($role, 'admin') !== false ||
            strpos($role, 'hr') !== false ||
            strpos($role, 'executive') !== false;

        // If not supervisor, fetch this associate's prescribed LMS document IDs from lms_prescribed
        $prescribedLmsIds = [];
        if (!$isSupervisor && !empty($userId)) {
            try {
                $pdo = getSupabaseDb();
                if ($pdo) {
                    $pStmt = $pdo->prepare("SELECT lms_id FROM public.lms_prescribed WHERE LOWER(employee) = LOWER(:emp)");
                    $pStmt->execute(['emp' => $userId]);
                    $prescribedLmsIds = $pStmt->fetchAll(PDO::FETCH_COLUMN);
                }
            } catch (Throwable $e) {}

            if (empty($prescribedLmsIds)) {
                $pRes = supabaseRequest('lms_prescribed?employee=eq.' . urlencode($userId) . '&select=lms_id', 'GET', null, true);
                if (!empty($pRes['data']) && is_array($pRes['data'])) {
                    $prescribedLmsIds = array_column($pRes['data'], 'lms_id');
                }
            }
            $prescribedLmsIds = array_map('strval', $prescribedLmsIds);
        }

        // 2. Fetch lms_documents via direct PDO with REST API fallback
        $allDocs = [];
        try {
            $pdo = getSupabaseDb();
            if ($pdo) {
                $stmt = $pdo->query("SELECT * FROM public.lms_documents ORDER BY created_at DESC");
                $allDocs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        } catch (Throwable $e) {}

        if (empty($allDocs)) {
            $query = 'lms_documents?order=created_at.desc';
            if (!empty($status) && $status !== 'all') {
                $query .= '&status=eq.' . urlencode($status);
            }

            $res = supabaseRequest($query, 'GET', null, true);
            $allDocs = is_array($res['data'] ?? null) ? $res['data'] : [];
        }

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
            $docId = (string)($doc['id'] ?? '');
            $isMandatory = !empty($doc['manatory']) || !empty($doc['mandatory']) || !empty($doc['is_mandatory']) ||
                (isset($doc['manatory']) && ($doc['manatory'] === true || $doc['manatory'] === 1 || $doc['manatory'] === 'true' || $doc['manatory'] === 't')) ||
                (isset($doc['mandatory']) && ($doc['mandatory'] === true || $doc['mandatory'] === 1 || $doc['mandatory'] === 'true' || $doc['mandatory'] === 't'));

            // Rule: If mandatory is false, do not show to anyone except supervisors unless it is in lms_prescribed
            if (!$isSupervisor && !$isMandatory) {
                if (!in_array($docId, $prescribedLmsIds, true)) {
                    continue; // Skip non-mandatory documents not prescribed to this employee
                }
            }

            $dId = $doc['department_id'] ?? null;
            $dName = $dId && isset($deptMap[$dId]) ? $deptMap[$dId] : 'Property-Wide';
            $doc['department_name'] = $dName;
            $doc['manatory'] = $isMandatory;
            $doc['mandatory'] = $isMandatory;
            $doc['is_mandatory'] = $isMandatory;
            $doc['is_prescribed'] = in_array($docId, $prescribedLmsIds, true);

            // Department filter: include specific department match AND all documents that don't have a department (null / Property-Wide)
            if (!empty($deptId) && $deptId !== 'all') {
                $targetName = $deptSlugMap[strtolower(trim($deptId))] ?? $deptId;
                $match = false;
                if ($dId === null || empty($dId) || strtolower((string)$dId) === 'null' || $dName === 'Property-Wide') {
                    $match = true; // Property-wide / null department is accessible everywhere
                } elseif ($dId === $deptId) {
                    $match = true;
                } elseif (strcasecmp($dName, $targetName) === 0 || strpos(strtolower($dName), strtolower($targetName)) !== false || strpos(strtolower($targetName), strtolower($dName)) !== false) {
                    $match = true;
                }
                if (!$match) {
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

        $res = [
            'success' => true,
            'data' => $filtered,
            'total' => count($filtered)
        ];
        self::setCache($cacheKey, $res);
        return $res;
    }

    private function getCategoryBadge(string $category): string
    {
        $cat = strtolower($category);
        if (strpos($cat, 'safety') !== false || strpos($cat, 'haccp') !== false) {
            return 'badge-sage';
        }
        if (strpos($cat, 'guest') !== false || strpos($cat, 'service') !== false) {
            return 'badge-gold';
        }
        if (strpos($cat, 'crisis') !== false || strpos($cat, 'emergency') !== false) {
            return 'badge-terracotta';
        }
        return 'badge-secondary';
    }

    /**
     * Publish Document Record from Direct Storage Upload
     */
    public function publishDocumentRecord(array $postData): array
    {
        self::clearCache();
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
        
        // Auto-resolve active performance goal for employee if goal_id not explicitly supplied
        if (empty($goalId)) {
            $goalRes = supabaseRequest('performance_goals?employee_id=eq.' . urlencode($employee) . '&order=created_at.desc&limit=1', 'GET', null, true);
            if (!empty($goalRes['data']) && is_array($goalRes['data']) && isset($goalRes['data'][0]['id'])) {
                $goalId = (int)$goalRes['data'][0]['id'];
            }
        }

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
            
            // Auto-create Specific Task in Performance Management for this employee & goal
            $this->addLmsSpecificTaskToPerformance($employee, $lmsId, $goalId);

            self::clearCache();

            return [
                'success' => true,
                'already_enrolled' => false,
                'message' => 'LMS document successfully prescribed and enrolled!',
                'data' => $created
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to insert prescription into lms_prescribed: ' . ($insertRes['error'] ?? 'Server error')
        ];
    }

    /**
     * Automatically create a specific task in performance_tasks when an LMS document is prescribed
     */
    private function addLmsSpecificTaskToPerformance(string $employee, string $lmsId, ?int $goalId): void
    {
        try {
            // Find employee's active performance goal
            $targetGoalId = $goalId;
            if (empty($targetGoalId)) {
                $gRes = supabaseRequest('performance_goals?employee_id=eq.' . urlencode($employee) . '&order=created_at.desc&limit=1', 'GET', null, true);
                if (!empty($gRes['data'][0]['id'])) {
                    $targetGoalId = (int)$gRes['data'][0]['id'];
                }
            }

            if (empty($targetGoalId)) return;

            // Check if specific task for this LMS document already exists
            $taskTitle = "LMS SOP Study: Handbook [LMS:{$lmsId}]";
            $existRes = supabaseRequest('performance_tasks?goal_id=eq.' . $targetGoalId . '&title=ilike.' . urlencode("%[LMS:{$lmsId}]%"), 'GET', null, true);
            if (!empty($existRes['data']) && is_array($existRes['data'])) {
                return; // Already added
            }

            // Fetch doc title
            $docRes = supabaseRequest('lms_documents?id=eq.' . urlencode($lmsId), 'GET', null, true);
            $docTitle = !empty($docRes['data'][0]['title']) ? $docRes['data'][0]['title'] : "Handbook #{$lmsId}";

            $taskPayload = [
                'goal_id' => $targetGoalId,
                'title' => "LMS Certification: {$docTitle} [LMS:{$lmsId}]",
                'description' => "Mandatory learning module prescribed to IDP. Read the handbook and achieve 100% progress in LMS before completing this task. [LMS:{$lmsId}]",
                'type' => 'specific',
                'status' => 'Pending',
                'completion_pct' => 0,
                'weight' => 20,
                'created_at' => date('c')
            ];

            supabaseRequest('performance_tasks', 'POST', $taskPayload, true);
        } catch (Exception $e) {
            error_log("Failed to auto-add LMS task to performance: " . $e->getMessage());
        }
    }

    /**
     * Get Prescribed LMS Documents with Document & Employee Details
     */
    public function getPrescribedDocuments(array $params = []): array
    {
        $employee = trim($params['employee'] ?? $params['employee_id'] ?? '');
        $cacheKey = 'prescribed_docs_' . md5($employee);
        $cached = self::getCache($cacheKey, 60);
        if ($cached !== null) {
            return $cached;
        }

        $query = 'lms_prescribed?order=created_at.desc';
        if (!empty($employee)) {
            $query .= '&employee=eq.' . urlencode($employee);
        }

        $res = supabaseRequest($query, 'GET', null, true);
        $records = is_array($res['data']) ? $res['data'] : [];

        if (empty($records)) {
            $out = [
                'success' => true,
                'data' => [],
                'total' => 0
            ];
            self::setCache($cacheKey, $out);
            return $out;
        }

        // Gather unique IDs to fetch only what's needed
        $docIds = array_filter(array_unique(array_column($records, 'lms_id')));
        $empIds = array_filter(array_unique(array_column($records, 'employee')));

        $docMap = [];
        if (!empty($docIds)) {
            $cleanDocIds = implode(',', array_map('urlencode', $docIds));
            $docRes = supabaseRequest("lms_documents?id=in.({$cleanDocIds})", 'GET', null, true);
            $documents = is_array($docRes['data']) ? $docRes['data'] : [];
            foreach ($documents as $d) {
                $docMap[$d['id']] = $d;
            }
        }

        $empMap = [];
        if (!empty($empIds)) {
            $cleanEmpIds = implode(',', array_map('urlencode', $empIds));
            $empRes = supabaseRequest("employees?id=in.({$cleanEmpIds})", 'GET', null, true);
            $employees = is_array($empRes['data']) ? $empRes['data'] : [];
            foreach ($employees as $e) {
                $empMap[$e['id']] = $e;
            }
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

        $result = [
            'success' => true,
            'data' => $enriched,
            'total' => count($enriched)
        ];
        self::setCache($cacheKey, $result);
        return $result;
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
            self::clearCache();
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
     * Extract plain text content from an attached LMS handbook/book file
     */
    public function extractTextFromBookFile(?string $filePath, ?string $fileName = '', ?string $fileType = ''): string
    {
        $filePath = trim((string)$filePath);
        if (empty($filePath)) {
            return '';
        }

        $cacheDir = __DIR__ . '/../storage/lms_extracted';
        if (!is_dir($cacheDir)) {
            @mkdir($cacheDir, 0777, true);
        }

        $cacheFile = $cacheDir . '/' . md5($filePath) . '.txt';
        if (file_exists($cacheFile) && filesize($cacheFile) > 40) {
            return (string)@file_get_contents($cacheFile);
        }

        $rawContent = '';
        if (preg_match('#^https?://#i', $filePath)) {
            $ctx = stream_context_create([
                'http' => ['timeout' => 12],
                'ssl'  => ['verify_peer' => false, 'verify_peer_name' => false]
            ]);
            $rawContent = @file_get_contents($filePath, false, $ctx);
            if (!$rawContent && function_exists('curl_init')) {
                $ch = curl_init($filePath);
                curl_setopt_array($ch, [
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_TIMEOUT        => 12,
                    CURLOPT_SSL_VERIFYPEER => false
                ]);
                $rawContent = curl_exec($ch);
                curl_close($ch);
            }
        } elseif (file_exists($filePath)) {
            $rawContent = @file_get_contents($filePath);
        }

        if (empty($rawContent)) {
            return '';
        }

        $extractedText = '';
        $isDocx = preg_match('/\.docx$/i', $filePath) || preg_match('/\.docx$/i', $fileName) || stripos((string)$fileType, 'wordprocessingml') !== false;
        $isPdf  = preg_match('/\.pdf$/i', $filePath)  || preg_match('/\.pdf$/i', $fileName)  || stripos((string)$fileType, 'pdf') !== false;

        if ($isDocx) {
            $tempFile = sys_get_temp_dir() . '/lms_extract_' . uniqid() . '.docx';
            file_put_contents($tempFile, $rawContent);

            try {
                if (class_exists('PharData')) {
                    $phar = new PharData($tempFile);
                    if (isset($phar['word/document.xml'])) {
                        $xml = $phar['word/document.xml']->getContent();
                        $extractedText = strip_tags(str_replace(['</w:p>', '<w:br/>', '</w:tr>'], ["\n", "\n", "\n"], $xml));
                    }
                }
            } catch (Throwable $e) {}

            // Fallback for Windows environments without zip phar
            if (empty($extractedText) && DIRECTORY_SEPARATOR === '\\') {
                $cmd = 'powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; $z = [System.IO.Compression.ZipFile]::OpenRead(\'' . addslashes($tempFile) . '\'); $e = $z.GetEntry(\'word/document.xml\'); if ($e) { $s = $e.Open(); $r = New-Object System.IO.StreamReader($s); $t = $r.ReadToEnd(); $r.Close(); $s.Close(); Write-Output $t }; $z.Dispose()"';
                $xmlOut = @shell_exec($cmd);
                if (!empty($xmlOut)) {
                    $extractedText = strip_tags(str_replace(['</w:p>', '<w:br/>', '</w:tr>'], ["\n", "\n", "\n"], $xmlOut));
                }
            }
            @unlink($tempFile);
        } elseif ($isPdf) {
            // PDF text extraction regex for text streams
            if (preg_match_all('#BT(.*?)ET#s', $rawContent, $matches)) {
                $pdfLines = [];
                foreach ($matches[1] as $block) {
                    if (preg_match_all('#\((.*?)\)\s*Tj#s', $block, $tjMatches)) {
                        $pdfLines[] = implode(' ', $tjMatches[1]);
                    } elseif (preg_match_all('#\[(.*?)\]\s*TJ#s', $block, $tjMatches)) {
                        $parts = [];
                        foreach ($tjMatches[1] as $inner) {
                            if (preg_match_all('#\((.*?)\)#s', $inner, $partMatches)) {
                                $parts[] = implode('', $partMatches[1]);
                            }
                        }
                        $pdfLines[] = implode(' ', $parts);
                    }
                }
                $extractedText = implode("\n", $pdfLines);
            }
        } else {
            // Plain text or markdown
            $extractedText = $rawContent;
        }

        $cleanText = preg_replace('/[ \t]+/', ' ', (string)$extractedText);
        $cleanText = preg_replace("/\n{3,}/", "\n\n", trim($cleanText));

        if (mb_strlen($cleanText) > 40) {
            @file_put_contents($cacheFile, $cleanText);
            return $cleanText;
        }

        return '';
    }

    /**
     * Deterministic question generator directly analyzing document text when Gemini is offline
     */
    public function generateQuestionsFromDocumentText(string $title, string $dept, string $category, string $docText): array
    {
        $cleanText = trim($docText);
        $paragraphs = array_filter(array_map('trim', explode("\n", $cleanText)), function($p) {
            return strlen($p) >= 35 && !preg_match('/^(page \d+|chapter \d+|section \d+|\d+\.|\d+)$/i', $p);
        });
        $paragraphs = array_values($paragraphs);

        if (count($paragraphs) < 10) {
            // Split by sentence boundaries if paragraphs are fewer than 10
            $allSentences = preg_split('/(?<=[.?!])\s+/', $cleanText, -1, PREG_SPLIT_NO_EMPTY);
            $paragraphs = array_values(array_filter($allSentences, function($s) {
                return strlen(trim($s)) >= 35;
            }));
        }

        $questions = [];
        $totalNeeded = 10;
        $count = count($paragraphs);

        if ($count >= 10) {
            $step = max(1, (int)floor($count / $totalNeeded));
            for ($i = 0; $i < $totalNeeded; $i++) {
                $pIdx = min($count - 1, $i * $step);
                $p = $paragraphs[$pIdx];

                $sentences = preg_split('/(?<=[.?!])\s+/', $p, -1, PREG_SPLIT_NO_EMPTY);
                $mainSentence = $sentences[0] ?? $p;
                if (strlen($mainSentence) < 30 && isset($sentences[1])) {
                    $mainSentence .= ' ' . $sentences[1];
                }

                $words = explode(' ', $mainSentence);
                $firstWords = implode(' ', array_slice($words, 0, 7));
                $qText = "According to the \"{$title}\" document, what is the core requirement regarding: \"{$firstWords}...\"?";

                $correctOption = mb_substr($mainSentence, 0, 135);
                $distractors = [
                    "Bypass this standard during peak operational hours to prioritize turnaround speed",
                    "Execute the procedure verbally without logging verifiable transactional audit records",
                    "Escalate immediately to external third-party vendors before initiating internal verification steps"
                ];

                $options = array_merge([$correctOption], $distractors);
                $targetPos = ($i * 2 + 1) % 4;
                $temp = $options[0];
                $options[0] = $options[$targetPos];
                $options[$targetPos] = $temp;

                $questions[] = [
                    'id' => $i + 1,
                    'question' => $qText,
                    'options' => $options,
                    'correct' => $targetPos,
                    'explanation' => "Verified handbook standard: \"{$correctOption}\""
                ];
            }
        }

        return $questions;
    }

    /**
     * Generate 10-item Knowledge Quiz for LMS Document (Analyzing attached book file)
     */
    public function generateQuiz(array $params): array
    {
        $bookId = trim($params['book_id'] ?? $params['id'] ?? $params['lms_id'] ?? '');
        if (empty($bookId)) {
            return ['success' => false, 'message' => 'Book/Document ID is required.'];
        }

        $forceRefresh = !empty($params['refresh']) || !empty($params['force']);
        $cacheKey = 'lms_quiz_dyn_v5_' . md5($bookId);
        if (!$forceRefresh) {
            $cached = self::getCache($cacheKey, 7200); // 2-hour cache
            if ($cached !== null && !empty($cached['questions']) && count($cached['questions']) === 10 && !empty($cached['grounded_in_file'])) {
                return $cached;
            }
        }

        // Fetch document metadata from database
        $doc = null;
        $res = supabaseRequest('lms_documents?id=eq.' . urlencode($bookId), 'GET', null, true);
        if (!empty($res['data']) && is_array($res['data']) && count($res['data']) > 0) {
            $doc = $res['data'][0];
        }

        // Fallback search by title or file name if bookId was a title or slug
        if (!$doc) {
            $titleSearch = supabaseRequest('lms_documents?title=ilike.' . urlencode('%' . $bookId . '%') . '&limit=1', 'GET', null, true);
            if (!empty($titleSearch['data'][0])) {
                $doc = $titleSearch['data'][0];
            } else {
                $fileSearch = supabaseRequest('lms_documents?file_name=ilike.' . urlencode('%' . $bookId . '%') . '&limit=1', 'GET', null, true);
                if (!empty($fileSearch['data'][0])) {
                    $doc = $fileSearch['data'][0];
                }
            }
        }

        $title = $doc['title'] ?? 'LMS Handbook';
        $dept = $doc['department_name'] ?? 'Hotel Operations';
        $category = $doc['category'] ?? 'SOP Manual';
        $filePath = $doc['file_path'] ?? '';
        $fileName = $doc['file_name'] ?? '';
        $fileType = $doc['file_type'] ?? '';

        // Strict requirement: must have a file attached
        if (empty($filePath)) {
            return [
                'success' => false,
                'message' => "No attached document file was found for '{$title}'. Please attach a valid handbook file (.docx, .pdf, or .txt) to take this quiz."
            ];
        }

        // 1. Extract plain text directly from the attached book file
        $documentText = $this->extractTextFromBookFile($filePath, $fileName, $fileType);
        if (empty($documentText) || mb_strlen($documentText) < 50) {
            return [
                'success' => false,
                'message' => "Unable to extract readable text content from '{$fileName}'. Please verify that the file contains valid text and is not corrupted."
            ];
        }

        $questions = [];

        // 2. Attempt Gemini dynamic question generation grounded strictly in the file content
        try {
            require_once __DIR__ . '/../services/GeminiService.php';
            $gemini = new GeminiService();
            $aiQuestions = $gemini->generateQuizFromDocument($title, $dept, $category, $documentText);
            if (is_array($aiQuestions) && count($aiQuestions) >= 10) {
                $questions = array_slice($aiQuestions, 0, 10);
            }
        } catch (Throwable $e) {
            error_log("Gemini Quiz Generation from book file failed: " . $e->getMessage());
        }

        // 3. Fallback to dynamic document text analysis if Gemini timed out or failed
        if (empty($questions) || count($questions) < 10) {
            $questions = $this->generateQuestionsFromDocumentText($title, $dept, $category, $documentText);
        }

        // 4. If questions could still not be generated from file, return error message (NO hardcoded domain bank)
        if (empty($questions) || count($questions) < 10) {
            return [
                'success' => false,
                'message' => "Failed to generate dynamic questions from the content of '{$title}'. Please verify the file content."
            ];
        }

        // Ensure exactly 1-10 IDs and uniform 4-option structure
        $finalQuestions = [];
        foreach (array_values($questions) as $idx => $q) {
            $options = is_array($q['options'] ?? null) && count($q['options']) === 4 ? array_values($q['options']) : [
                'Standard operating protocol as outlined in handbook',
                'Escalate immediately to floor supervisor',
                'Document transactional outcome in daily shift log',
                'Refer to departmental operational guide'
            ];
            $correctIdx = isset($q['correct']) && is_numeric($q['correct']) ? (int)$q['correct'] : 0;
            if ($correctIdx < 0 || $correctIdx > 3) $correctIdx = 0;

            $finalQuestions[] = [
                'id' => $idx + 1,
                'question' => $q['question'] ?? ($q['q'] ?? "Handbook Question #" . ($idx + 1)),
                'options' => $options,
                'correct' => $correctIdx,
                'correct_index' => $correctIdx,
                'explanation' => $q['explanation'] ?? ($q['handbook_reference'] ?? 'This adheres to verified operational standards.'),
                'handbook_reference' => $q['handbook_reference'] ?? ($q['explanation'] ?? 'Document Content Reference')
            ];
        }

        $result = [
            'success' => true,
            'book_id' => $bookId,
            'book_title' => $title,
            'department' => $dept,
            'category' => $category,
            'has_file' => true,
            'grounded_in_file' => true,
            'duration_minutes' => 10,
            'passing_score' => 80,
            'exp_reward' => 100,
            'questions' => $finalQuestions,
            'total_items' => count($finalQuestions)
        ];

        self::setCache($cacheKey, $result);
        return $result;
    }

    /**
     * Submit Quiz Results & Record in lms_prescribed + xp_transactions
     */
    public function submitQuizResult(array $payload): array
    {
        $employee = trim($payload['employee'] ?? $payload['employee_id'] ?? '');
        if (empty($employee)) {
            $employee = 'emp-101';
        }

        $lmsId = trim($payload['lms_id'] ?? $payload['book_id'] ?? '');
        if (empty($lmsId)) {
            return ['success' => false, 'message' => 'LMS document ID is required.'];
        }

        $score = isset($payload['score']) ? (float)$payload['score'] : (isset($payload['scores']) ? (float)$payload['scores'] : 0.0);
        $score = max(0.0, min(100.0, $score));
        $passed = $score >= 80.0;
        $status = $passed ? 'Passed' : 'Needs Retake';
        $progress = $passed ? 100 : (int)max($score, 50);
        $timeConsumed = isset($payload['time_consumed']) ? (int)$payload['time_consumed'] : 300; // seconds
        $timeConsumedMin = max(1, (int)round($timeConsumed / 60));
        $bookTitle = trim($payload['book_title'] ?? 'LMS SOP Handbook');
        $now = date('c');

        // Check if employee has existing enrollment in lms_prescribed
        $query = 'lms_prescribed?employee=eq.' . urlencode($employee) . '&lms_id=eq.' . urlencode($lmsId);
        $checkRes = supabaseRequest($query, 'GET', null, true);

        $savedRow = null;
        if (!empty($checkRes['data']) && is_array($checkRes['data']) && count($checkRes['data']) > 0) {
            // Update existing prescription record
            $recId = $checkRes['data'][0]['id'];
            $updateData = [
                'scores' => $score,
                'ratings' => $passed ? 4.50 : 2.50,
                'progress' => $progress,
                'status' => $status,
                'last_attempt' => $now,
                'time_consumed' => $timeConsumedMin,
                'updated_at' => $now
            ];
            $patchRes = supabaseRequest('lms_prescribed?id=eq.' . urlencode($recId), 'PATCH', $updateData, true);
            $savedRow = array_merge($checkRes['data'][0], $updateData);
        } else {
            // Insert new prescription record
            $goalId = null;
            $goalRes = supabaseRequest('performance_goals?employee_id=eq.' . urlencode($employee) . '&order=created_at.desc&limit=1', 'GET', null, true);
            if (!empty($goalRes['data'][0]['id'])) {
                $goalId = (int)$goalRes['data'][0]['id'];
            }

            $insertData = [
                'employee' => $employee,
                'lms_id' => $lmsId,
                'goal_id' => $goalId,
                'scores' => $score,
                'ratings' => $passed ? 4.50 : 2.50,
                'progress' => $progress,
                'status' => $status,
                'for' => 'both',
                'last_attempt' => $now,
                'time_consumed' => $timeConsumedMin,
                'created_at' => $now,
                'updated_at' => $now
            ];
            $postRes = supabaseRequest('lms_prescribed', 'POST', $insertData, true);
            $savedRow = (!empty($postRes['data'][0])) ? $postRes['data'][0] : $insertData;
        }

        // Award XP on pass (+100 XP per Section 0.5/3.1)
        $xpAwarded = 0;
        if ($passed) {
            try {
                require_once __DIR__ . '/../models/SocialModel.php';
                $socialModel = new SocialModel();
                $ok = $socialModel->createLmsGrant($employee, 100, $bookTitle);
                if ($ok) {
                    $xpAwarded = 100;
                }
            } catch (Throwable $e) {
                error_log("Failed to award LMS Quiz XP grant: " . $e->getMessage());
            }
        }

        self::clearCache();

        return [
            'success' => true,
            'message' => $passed ? "Congratulations! Scored {$score}% - Passed (+{$xpAwarded} XP)!" : "Scored {$score}%. Benchmark is 80%. Review and retake.",
            'passed' => $passed,
            'score' => $score,
            'xp_awarded' => $xpAwarded,
            'status' => $status,
            'progress' => $progress,
            'data' => $savedRow
        ];
    }
}



