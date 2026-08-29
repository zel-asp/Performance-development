<?php

require_once __DIR__ . '/BaseModel.php';

class EvaluationModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('training_evaluations');
    }

    public function getEvaluations(array $filters = []): array
    {
        $all = $this->all($filters);
        foreach ($all as &$ev) {
            $ev['id'] = $ev['id'] ?? '';
            $ev['sessionId'] = $ev['session_id'] ?? ($ev['sessionId'] ?? '');
            $ev['programId'] = $ev['program_id'] ?? ($ev['programId'] ?? '');
            $ev['programTitle'] = $ev['program_title'] ?? ($ev['programTitle'] ?? 'Training Program');
            $ev['category'] = $ev['category'] ?? 'Skill Gap';
            $ev['dept'] = $ev['dept'] ?? 'Front Office';
            $ev['associateId'] = $ev['associate_id'] ?? ($ev['associateId'] ?? ($ev['employee_id'] ?? ''));
            $ev['associateName'] = $ev['associate_name'] ?? ($ev['associateName'] ?? 'Associate');
            $ev['associateRole'] = $ev['associate_role'] ?? ($ev['associateRole'] ?? 'Hotel Staff');
            $ev['associateAvatar'] = $ev['associate_avatar'] ?? ($ev['associateAvatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
            $ev['trainerName'] = $ev['trainer_name'] ?? ($ev['trainerName'] ?? 'Trainer');
            $ev['completionDate'] = $ev['completion_date'] ?? ($ev['completionDate'] ?? date('M d, Y'));
            $ev['attendanceRate'] = $ev['attendance_rate'] ?? ($ev['attendanceRate'] ?? '100%');
            $ev['quizScore'] = (int)($ev['quiz_score'] ?? ($ev['quizScore'] ?? 100));
            $ev['passingThreshold'] = (int)($ev['passing_threshold'] ?? ($ev['passingThreshold'] ?? 80));
            $ev['resultStatus'] = $ev['result_status'] ?? ($ev['resultStatus'] ?? 'Passed & Certified');
            $ev['certificateReference'] = $ev['certificate_reference'] ?? ($ev['certificateReference'] ?? null);
            $ev['feedbackRating'] = (float)($ev['feedback_rating'] ?? ($ev['feedbackRating'] ?? 5.0));
            $ev['feedbackNotes'] = $ev['feedback_notes'] ?? ($ev['feedbackNotes'] ?? '');
            $ev['xpAwarded'] = (int)($ev['xp_awarded'] ?? ($ev['xpAwarded'] ?? 150));
        }
        return $all;
    }

    public function createEvaluation(array $data): array
    {
        $clean = [
            'id'                      => $data['id'] ?? ('res-' . substr(bin2hex(random_bytes(3)), 0, 6)),
            'session_id'              => $data['session_id'] ?? ($data['sessionId'] ?? 'sess-101'),
            'program_id'              => $data['program_id'] ?? ($data['programId'] ?? 'prog-1'),
            'program_title'           => $data['program_title'] ?? ($data['programTitle'] ?? 'Training Program'),
            'category'                => $data['category'] ?? 'Skill Gap',
            'dept'                    => $data['dept'] ?? 'Front Office',
            'associate_id'            => $data['associate_id'] ?? ($data['associateId'] ?? ($data['employee_id'] ?? ($data['employeeId'] ?? 'emp-101'))),
            'associate_name'          => $data['associate_name'] ?? ($data['associateName'] ?? 'Associate'),
            'associate_role'          => $data['associate_role'] ?? ($data['associateRole'] ?? 'Hotel Staff'),
            'associate_avatar'        => $data['associate_avatar'] ?? ($data['associateAvatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
            'trainer_name'            => $data['trainer_name'] ?? ($data['trainerName'] ?? 'Lead Trainer'),
            'completion_date'         => $data['completion_date'] ?? ($data['completionDate'] ?? date('M d, Y')),
            'attendance_rate'         => $data['attendance_rate'] ?? ($data['attendanceRate'] ?? '100%'),
            'quiz_score'              => (int)($data['quiz_score'] ?? ($data['quizScore'] ?? 100)),
            'passing_threshold'       => (int)($data['passing_threshold'] ?? ($data['passingThreshold'] ?? 80)),
            'result_status'           => $data['result_status'] ?? ($data['resultStatus'] ?? 'Passed & Certified'),
            'feedback_rating'         => (float)($data['feedback_rating'] ?? ($data['feedbackRating'] ?? 5.0)),
            'feedback_notes'          => $data['feedback_notes'] ?? ($data['feedbackNotes'] ?? 'Outstanding practical simulation.'),
            'certificate_reference'   => $data['certificate_reference'] ?? ($data['certificateReference'] ?? null),
            'competency_target'       => $data['competency_target'] ?? ($data['competencyTarget'] ?? 'Core Competency'),
            'competency_key'          => $data['competency_key'] ?? ($data['competencyKey'] ?? 'general'),
            'competency_score_before' => (float)($data['competency_score_before'] ?? ($data['competencyScoreBefore'] ?? 3.0)),
            'competency_score_after'  => (float)($data['competency_score_after'] ?? ($data['competencyScoreAfter'] ?? 4.8)),
            'xp_awarded'              => (int)($data['xp_awarded'] ?? ($data['xpAwarded'] ?? 150)),
            'synced_to_profile'       => true,
            'created_at'              => date('c')
        ];
        return $this->create($clean);
    }
}
