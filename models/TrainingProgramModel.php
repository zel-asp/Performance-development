<?php

require_once __DIR__ . '/BaseModel.php';

class TrainingProgramModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('training_programs');
    }

    public function getPrograms(array $filters = []): array
    {
        $all = $this->all($filters);
        if (empty($all)) {
            $baseline = $this->getBaselinePrograms();
            foreach ($baseline as $bp) {
                $this->createProgram($bp);
            }
            $all = $this->all($filters);
        }

        foreach ($all as &$p) {
            $p['id'] = $p['id'] ?? '';
            $p['targetCompetency'] = $p['target_competency'] ?? ($p['targetCompetency'] ?? 'Core Hospitality');
            $p['competencyKey'] = $p['competency_key'] ?? ($p['competencyKey'] ?? 'general');
            $p['categoryType'] = $p['category_type'] ?? ($p['categoryType'] ?? 'skill_gap');
            $p['trainerType'] = $p['trainer_type'] ?? ($p['trainerType'] ?? 'Internal Master Trainer');
            $p['passingScore'] = (int)($p['passing_score'] ?? ($p['passingScore'] ?? 80));
            $p['xpAward'] = (int)($p['xp_award'] ?? ($p['xpAward'] ?? 150));
            $p['badgeColor'] = $p['badge_color'] ?? ($p['badgeColor'] ?? 'primary');
            if (is_string($p['modules'] ?? null)) {
                $p['modules'] = json_decode($p['modules'], true) ?: [];
            }
            if (is_string($p['quiz_questions'] ?? null)) {
                $p['quizQuestions'] = json_decode($p['quiz_questions'], true) ?: [];
            } else {
                $p['quizQuestions'] = $p['quiz_questions'] ?? ($p['quizQuestions'] ?? []);
            }
        }
        return $all;
    }

    public function getProgramById(string $programId): ?array
    {
        $prog = $this->find($programId);
        if (!$prog) {
            $all = $this->getPrograms();
            foreach ($all as $p) {
                if ($p['id'] === $programId) return $p;
            }
            return null;
        }

        $prog['targetCompetency'] = $prog['target_competency'] ?? ($prog['targetCompetency'] ?? 'Core Hospitality');
        $prog['competencyKey'] = $prog['competency_key'] ?? ($prog['competencyKey'] ?? 'general');
        $prog['categoryType'] = $prog['category_type'] ?? ($prog['categoryType'] ?? 'skill_gap');
        $prog['trainerType'] = $prog['trainer_type'] ?? ($prog['trainerType'] ?? 'Internal Master Trainer');
        $prog['passingScore'] = (int)($prog['passing_score'] ?? ($prog['passingScore'] ?? 80));
        $prog['xpAward'] = (int)($prog['xp_award'] ?? ($prog['xpAward'] ?? 150));
        $prog['badgeColor'] = $prog['badge_color'] ?? ($prog['badgeColor'] ?? 'primary');
        if (is_string($prog['modules'] ?? null)) {
            $prog['modules'] = json_decode($prog['modules'], true) ?: [];
        }
        if (is_string($prog['quiz_questions'] ?? null)) {
            $prog['quizQuestions'] = json_decode($prog['quiz_questions'], true) ?: [];
        } else {
            $prog['quizQuestions'] = $prog['quiz_questions'] ?? ($prog['quizQuestions'] ?? []);
        }

        return $prog;
    }

    public function createProgram(array $data): array
    {
        $id = $data['id'] ?? ('prog-' . substr(bin2hex(random_bytes(3)), 0, 6));
        $modules = $data['modules'] ?? [];
        if (is_string($modules)) $modules = json_decode($modules, true) ?: [];
        $quiz = $data['quiz_questions'] ?? ($data['quizQuestions'] ?? []);
        if (is_string($quiz)) $quiz = json_decode($quiz, true) ?: [];

        $clean = [
            'id'                => $id,
            'title'             => $data['title'] ?? 'Training Program',
            'category'          => $data['category'] ?? 'Service Excellence',
            'category_type'     => in_array($data['category_type'] ?? ($data['categoryType'] ?? ''), ['skill_gap', 'compliance']) ? ($data['category_type'] ?? $data['categoryType']) : 'skill_gap',
            'dept'              => $data['dept'] ?? 'Front Office',
            'target_competency' => $data['target_competency'] ?? ($data['targetCompetency'] ?? 'Guest Relations & VIP Protocol'),
            'competency_key'    => $data['competency_key'] ?? ($data['competencyKey'] ?? 'guest_relations'),
            'duration'          => $data['duration'] ?? '3.5 Hours',
            'format'            => $data['format'] ?? 'Workshop & Roleplay',
            'trainer_type'      => $data['trainer_type'] ?? ($data['trainerType'] ?? 'Internal Master Trainer'),
            'passing_score'     => (int)($data['passing_score'] ?? ($data['passingScore'] ?? 80)),
            'xp_award'          => (int)($data['xp_award'] ?? ($data['xpAward'] ?? 150)),
            'icon'              => $data['icon'] ?? 'fa-graduation-cap',
            'badge_color'       => $data['badge_color'] ?? ($data['badgeColor'] ?? 'primary'),
            'description'       => $data['description'] ?? 'Comprehensive hotel training syllabus.',
            'modules'           => $modules,
            'quiz_questions'    => $quiz,
            'created_at'        => date('c')
        ];

        return $this->create($clean);
    }

    private function getBaselinePrograms(): array
    {
        return [
            [
                'id' => 'prog-1',
                'title' => 'Hospitality Crisis Diplomacy & Guest De-escalation',
                'category' => 'Skill Gap & Service Excellence',
                'categoryType' => 'skill_gap',
                'dept' => 'Front Office',
                'targetCompetency' => 'Guest Complaint Handling & VIP Protocol',
                'competencyKey' => 'guest_complaint_handling',
                'duration' => '3.5 Hours (1 Day Workshop)',
                'format' => 'In-Person Workshop & Roleplay',
                'trainerType' => 'Internal Master Trainer',
                'passingScore' => 80,
                'xpAward' => 150,
                'icon' => 'fa-shield-halved',
                'badgeColor' => 'primary',
                'description' => 'De-escalation protocols, empathy scripting, and service recovery compensation authority.',
                'modules' => ['1. Active Listening & Empathy', '2. Service Recovery Matrix', '3. Roleplay Simulation', '4. Post-Training Evaluation'],
                'quizQuestions' => [
                    ['q' => 'What is the benchmark standard response time for VIP guest requests?', 'options' => ['Within 5 minutes', 'Within 30 minutes', 'By end of shift', 'Next morning'], 'correct' => 0],
                    ['q' => 'Which protocol must be followed when a guest escalates a service delay?', 'options' => ['Listen and execute immediate service recovery voucher', 'Escalate immediately to GM without apology', 'Ask guest to wait in the lounge', 'Ignore the delay'], 'correct' => 0]
                ]
            ],
            [
                'id' => 'prog-2',
                'title' => 'HACCP Level 3 Food Safety & Culinary Hygiene',
                'category' => 'Mandatory Compliance',
                'categoryType' => 'compliance',
                'dept' => 'Kitchen',
                'targetCompetency' => 'Food Safety Compliance & Kitchen Sanitation',
                'competencyKey' => 'food_safety_hygiene',
                'duration' => '4.0 Hours (Interactive Cohort)',
                'format' => 'Cohort Workshop & Kitchen Lab',
                'trainerType' => 'Certified Master Trainer',
                'passingScore' => 85,
                'xpAward' => 200,
                'icon' => 'fa-utensils',
                'badgeColor' => 'emerald',
                'description' => 'Critical control point monitoring, cross-contamination prevention, and cold-chain logging.',
                'modules' => ['1. CCP Identification', '2. Temperature Control Logs', '3. Allergen Protocols', '4. Sanitization Evaluation'],
                'quizQuestions' => [
                    ['q' => 'What is the maximum allowable temperature for walk-in chillers in culinary operations?', 'options' => ['4°C (40°F) or below', '10°C (50°F)', '15°C (60°F)', '0°C (32°F)'], 'correct' => 0],
                    ['q' => 'How often must sanitizer concentration test strips be logged per shift?', 'options' => ['Every 2 hours', 'Once per week', 'Only during audits', 'End of day'], 'correct' => 0]
                ]
            ],
            [
                'id' => 'prog-3',
                'title' => 'Sommelier Fine Wine Pairing & Vintage Storytelling',
                'category' => 'Revenue & Upsell',
                'categoryType' => 'skill_gap',
                'dept' => 'Food & Beverage',
                'targetCompetency' => 'F&B Product Knowledge & Premium Beverage Storytelling',
                'competencyKey' => 'sommelier_wine_service',
                'duration' => '3.0 Hours (Tasting Workshop)',
                'format' => 'Tasting Workshop & Tableside Service',
                'trainerType' => 'Head Sommelier',
                'passingScore' => 80,
                'xpAward' => 150,
                'icon' => 'fa-wine-glass',
                'badgeColor' => 'purple',
                'description' => 'Old World vs New World wine sensory profiling, varietal characteristics, and degustation pairings.',
                'modules' => ['1. Varietal Sensory Profiling', '2. Degustation Menu Pairing', '3. Tableside Decanting', '4. Evaluation Tasting'],
                'quizQuestions' => [
                    ['q' => 'Which wine pairing is recommended for Prime Dry-Aged Ribeye steak?', 'options' => ['Full-bodied Cabernet Sauvignon', 'Sweet Moscato', 'Light Pinot Grigio', 'Prosecco'], 'correct' => 0],
                    ['q' => 'What is the standard serving temperature for vintage Bordeaux red wines?', 'options' => ['16°C - 18°C (60°F - 65°F)', '4°C (40°F)', '25°C (77°F)', '0°C (32°F)'], 'correct' => 0]
                ]
            ]
        ];
    }
}
