<?php
/**
 * api/reports.php
 * Oxford Suites — Audit Exports & Compliance Reports Backend
 * Actions: bootstrap_reports | export_csv | get_dept_summary | get_certifications
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/TrainingReportModel.php';
require_once __DIR__ . '/../models/CertificateModel.php';
require_once __DIR__ . '/../models/TrainingProgramModel.php';
require_once __DIR__ . '/../models/TrainingNeedModel.php';
require_once __DIR__ . '/../models/EvaluationModel.php';

$action = $_GET['action'] ?? '';
$rawBody = file_get_contents('php://input');
$jsonBody = !empty($rawBody) ? json_decode($rawBody, true) : [];
$payload  = array_merge($_GET, $_POST, is_array($jsonBody) ? $jsonBody : []);
if (empty($action) && isset($payload['action'])) {
    $action = $payload['action'];
}

try {
    switch ($action) {

        // ─── Full bootstrap for the reports hub ──────────────────────────────
        case 'bootstrap_reports':
            $reportModel   = new TrainingReportModel();
            $certModel     = new CertificateModel();
            $programModel  = new TrainingProgramModel();
            $needModel     = new TrainingNeedModel();

            $analytics  = $reportModel->getSummaryAnalytics();
            $certs      = $certModel->getCertificates();
            $programs   = $programModel->getPrograms();
            $needs      = $needModel->getNeeds([]);

            $totalCerts    = count($certs);
            $activeCerts   = array_filter($certs, fn($c) => !empty($c['certificateNumber'] ?? $c['certificate_number'] ?? ''));
            $resolvedNeeds = array_filter($needs, fn($n) => ($n['status'] ?? '') === 'Resolved');
            $activeNeeds   = array_filter($needs, fn($n) => ($n['status'] ?? '') === 'Active');
            $totalPrograms = count($programs);

            $response = [
                'success' => true,
                'kpi' => [
                    'totalPrograms'      => $totalPrograms,
                    'totalCertificates'  => $totalCerts,
                    'activeCertificates' => count($activeCerts),
                    'activeNeeds'        => count($activeNeeds),
                    'resolvedNeeds'      => count($resolvedNeeds),
                    'overallAttendance'  => $analytics['overall']['attendanceRate'] ?? 96,
                    'overallCompletion'  => $analytics['overall']['completionRate'] ?? 91,
                ],
                'deptSummary'  => $analytics['departments'],
                'certificates' => array_values($certs),
                'programs'     => array_values($programs),
            ];
            break;

        // ─── Real-data CSV export ─────────────────────────────────────────────
        case 'export_csv':
            $type   = $payload['type']   ?? 'all';
            $dept   = $payload['dept']   ?? 'all';
            $period = $payload['period'] ?? 'Q3 2026';

            $reportModel  = new TrainingReportModel();
            $certModel    = new CertificateModel();
            $programModel = new TrainingProgramModel();
            $needModel    = new TrainingNeedModel();
            $evalModel    = new EvaluationModel();

            $analytics = $reportModel->getSummaryAnalytics();
            $certs     = $certModel->getCertificates();
            $programs  = $programModel->getPrograms();
            $needs     = $needModel->getNeeds([]);
            $evals     = $evalModel->getEvaluations();

            if ($dept !== 'all') {
                $deptNorm = strtolower($dept);
                $certs    = array_values(array_filter($certs,    fn($c) => strtolower($c['dept'] ?? '') === $deptNorm));
                $needs    = array_values(array_filter($needs,    fn($n) => strtolower($n['dept'] ?? '') === $deptNorm));
                $programs = array_values(array_filter($programs, fn($p) => strtolower($p['dept'] ?? '') === $deptNorm));
            }

            switch ($type) {
                case 'training':
                    $rows = [['Program ID','Program Title','Category','Department','Trainer','Threshold %','Status','Date Created']];
                    foreach ($programs as $p) {
                        $rows[] = [
                            $p['id'] ?? '',
                            $p['name'] ?? '',
                            $p['category'] ?? '',
                            $p['dept'] ?? '',
                            $p['trainerName'] ?? '',
                            ($p['passingThreshold'] ?? 80) . '%',
                            $p['status'] ?? '',
                            $p['createdAt'] ?? '',
                        ];
                    }
                    break;

                case 'certification':
                    $rows = [['Certificate No.','Associate Name','Department','Program Title','Score','Category','Issue Date','Verification Seal']];
                    foreach ($certs as $c) {
                        $rows[] = [
                            $c['certificate_number'] ?? $c['certificateNumber'] ?? '',
                            $c['associate_name']     ?? $c['associateName']     ?? '',
                            $c['dept'] ?? '',
                            $c['program_title'] ?? $c['programTitle'] ?? '',
                            ($c['score'] ?? '') . '%',
                            $c['category'] ?? '',
                            $c['issue_date'] ?? $c['issueDate'] ?? '',
                            $c['verification_seal_code'] ?? $c['verificationSealCode'] ?? '',
                        ];
                    }
                    break;

                case 'needs':
                    $rows = [['Need ID','Title','Associate Name','Department','Source','Category','Gap','Urgency','Status','Date Identified']];
                    foreach ($needs as $n) {
                        $rows[] = [
                            $n['id'] ?? '',
                            $n['title'] ?? '',
                            $n['associateName'] ?? '',
                            $n['dept'] ?? '',
                            $n['sourceType'] ?? '',
                            $n['category'] ?? '',
                            $n['gap'] ?? '',
                            $n['urgency'] ?? '',
                            $n['status'] ?? '',
                            $n['dateIdentified'] ?? '',
                        ];
                    }
                    break;

                case 'dept_summary':
                    $rows = [['Department','Enrolled','Attended','Completed','Attendance %','Completion %','Avg Score']];
                    foreach ($analytics['departments'] as $d) {
                        $rows[] = [
                            $d['department'],
                            $d['enrolled'],
                            $d['attended'],
                            $d['completed'],
                            $d['attendanceRate'] . '%',
                            $d['completionRate'] . '%',
                            $d['averageScore'],
                        ];
                    }
                    break;

                default: // master / all
                    $rows = [['Record Type','ID','Associate / Program','Department','Detail 1','Detail 2','Status','Date']];
                    foreach ($certs as $c) {
                        $rows[] = ['Certificate',
                            $c['certificate_number'] ?? $c['certificateNumber'] ?? '',
                            $c['associate_name'] ?? $c['associateName'] ?? '',
                            $c['dept'] ?? '',
                            'Program: ' . ($c['program_title'] ?? $c['programTitle'] ?? ''),
                            'Score: ' . ($c['score'] ?? '') . '%',
                            'Issued',
                            $c['issue_date'] ?? $c['issueDate'] ?? '',
                        ];
                    }
                    foreach ($needs as $n) {
                        $rows[] = ['Training Need',
                            $n['id'] ?? '',
                            $n['associateName'] ?? '',
                            $n['dept'] ?? '',
                            'Gap: ' . ($n['gap'] ?? '') . ' pts',
                            'Urgency: ' . ($n['urgency'] ?? ''),
                            $n['status'] ?? '',
                            $n['dateIdentified'] ?? '',
                        ];
                    }
                    break;
            }

            $response = [
                'success' => true,
                'export'  => ['type' => $type, 'rows' => $rows, 'count' => count($rows) - 1],
                'period'  => $period,
                'dept'    => $dept,
            ];
            break;

        // ─── Department summary only ──────────────────────────────────────────
        case 'get_dept_summary':
            $reportModel = new TrainingReportModel();
            $analytics   = $reportModel->getSummaryAnalytics();
            $response = [
                'success'     => true,
                'departments' => $analytics['departments'],
                'overall'     => $analytics['overall'],
            ];
            break;

        // ─── Certificate registry ─────────────────────────────────────────────
        case 'get_certifications':
            $certModel = new CertificateModel();
            $certs     = $certModel->getCertificates();
            $response  = ['success' => true, 'certificates' => array_values($certs), 'count' => count($certs)];
            break;

        default:
            http_response_code(400);
            $response = ['success' => false, 'message' => "Unknown action '{$action}'"];
            break;
    }
} catch (\Throwable $e) {
    http_response_code(500);
    $response = ['success' => false, 'message' => 'Server error: ' . $e->getMessage()];
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
exit;
