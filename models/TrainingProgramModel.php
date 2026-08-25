<?php

require_once __DIR__ . '/BaseModel.php';

class TrainingProgramModel extends BaseModel
{
    public function __construct()
    {
        parent::__construct('training_programs');
        $this->seedInitialPrograms();
    }

    public function getPrograms(array $filters = []): array
    {
        return $this->all($filters);
    }

    public function getProgramById(string $programId): ?array
    {
        return $this->find($programId);
    }

    public function createProgram(array $data): array
    {
        if (empty($data['id'])) {
            $data['id'] = 'prog-' . substr(bin2hex(random_bytes(3)), 0, 6);
        }
        if (!isset($data['passingScore'])) {
            $data['passingScore'] = 80;
        }
        if (!isset($data['xpAward'])) {
            $data['xpAward'] = 150;
        }
        return $this->create($data);
    }

    private function seedInitialPrograms(): void
    {
        $initial = [
            [
                'id' => 'prog-1',
                'title' => 'Hospitality Crisis Diplomacy & Guest De-escalation',
                'category' => 'Skill Gap: Service Excellence',
                'categoryType' => 'skill_gap',
                'dept' => 'Front Office',
                'targetCompetency' => 'Frontline Conflict De-escalation',
                'competencyKey' => 'de_escalation',
                'duration' => '3.5 Hours (1 Day Workshop)',
                'format' => 'In-Person Workshop & Roleplay',
                'trainerType' => 'Internal Master Trainer',
                'passingScore' => 80,
                'xpAward' => 150,
                'icon' => 'fa-handshake-angle',
                'badgeColor' => 'terracotta',
                'description' => 'Comprehensive training covering the LAST de-escalation framework (Listen, Apologize, Solve, Thank), emotional intelligence under pressure, and diplomatic service recovery vouchers.',
                'modules' => [
                    '1. Anatomy of Guest Frustration & Empathy Triggers',
                    '2. The LAST Protocol in Real Hospitality Scenarios',
                    '3. Body Language, Vocal Cadence & Boundary Setting',
                    '4. Live Simulations & Practical Scenario Assessment'
                ],
                'quizQuestions' => [
                    [
                        'q' => 'What does the "A" in the LAST hospitality recovery framework represent?',
                        'options' => [
                            'Argue the policy diplomatically',
                            'Apologize sincerely for the guest\'s distress without assigning blame',
                            'Ask the manager to intervene immediately',
                            'Assess the financial liability'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => 'When an agitated guest raises their voice in the lobby, the recommended verbal pace is:',
                        'options' => [
                            'Match their volume and pace so you are heard',
                            'Lower your tone, speak 15% slower, and maintain calm open body posture',
                            'Remain completely silent until they finish shouting',
                            'Immediately step backwards behind the security desk'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => 'What is the maximum instant amenity voucher a Front Desk Host may authorize without GM signoff?',
                        'options' => [
                            '₱500 Dining Credit',
                            '₱2,500 F&B or Spa Voucher + Room Category Upgrade',
                            'Free Weekend Stay',
                            '₱10,000 Cash Refund'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => 'During de-escalation, which phrase should ALWAYS be avoided?',
                        'options' => [
                            '"I completely understand your frustration and I will personally solve this."',
                            '"That\'s not our hotel policy and there is nothing I can do."',
                            '"Let me see what alternatives I can immediately arrange for you."',
                            '"Thank you for bringing this to our attention right away."'
                        ],
                        'correct' => 1
                    ]
                ]
            ],
            [
                'id' => 'prog-2',
                'title' => 'HACCP Level 3 Food Safety & Cold-Chain Mastery',
                'category' => 'Mandatory Compliance',
                'categoryType' => 'compliance',
                'dept' => 'Culinary',
                'targetCompetency' => 'HACCP Safety & Sanitation',
                'competencyKey' => 'haccp_safety',
                'duration' => '4.0 Hours',
                'format' => 'Hygiene Lab & Inspection Walk',
                'trainerType' => 'Certified External Auditor',
                'passingScore' => 85,
                'xpAward' => 150,
                'icon' => 'fa-utensils',
                'badgeColor' => 'sage',
                'description' => 'Certified standard training on critical control points (CCP), digital cold-chain data logging, allergen cross-contact segregation, and sanitization protocols.',
                'modules' => [
                    '1. Critical Control Points & Walk-in Chiller Thresholds',
                    '2. Color-coded Board Segregation & Cross-Contamination',
                    '3. Blast Chilling, Core Probe Calibration & FIFO Logs',
                    '4. Health Authority Audit Compliance Walkthrough'
                ],
                'quizQuestions' => [
                    [
                        'q' => 'What is the mandatory temperature range for hotel walk-in meat chillers?',
                        'options' => ['0°C to 1°C', '2°C to 4°C', '5°C to 8°C', '-5°C to 0°C'],
                        'correct' => 1
                    ],
                    [
                        'q' => 'Which cutting board color is strictly reserved for raw poultry?',
                        'options' => ['Blue', 'Yellow', 'Red', 'Green'],
                        'correct' => 1
                    ]
                ]
            ],
            [
                'id' => 'prog-3',
                'title' => 'Sommelier Fine Wine Pairing & Vintage Storytelling',
                'category' => 'Skill Gap: Revenue Optimization',
                'categoryType' => 'skill_gap',
                'dept' => 'F&B Service',
                'targetCompetency' => 'Revenue & Wine Upsell',
                'competencyKey' => 'revenue_upsell',
                'duration' => '3.0 Hours',
                'format' => 'Tasting Workshop & Tableside Service',
                'trainerType' => 'Master Sommelier',
                'passingScore' => 80,
                'xpAward' => 150,
                'icon' => 'fa-wine-glass-empty',
                'badgeColor' => 'gold',
                'description' => 'Tasting workshop covering Old World vs New World terroirs, tableside decanting ritual, tasting pour etiquette, and food pairing storytelling.',
                'modules' => [
                    '1. Bordeaux, Burgundy & Tuscan Vintage Profiles',
                    '2. Tableside Decanting Etiquette & Glassware Selection',
                    '3. Acidity & Tannin Balancing with Tasting Menus',
                    '4. Premium Cellar Upselling Dialogue'
                ],
                'quizQuestions' => [
                    [
                        'q' => 'What is the correct tableside tasting pour volume when presenting wine to the host?',
                        'options' => ['10ml', '30ml (1 oz)', '75ml', '150ml'],
                        'correct' => 1
                    ],
                    [
                        'q' => 'Where should the wine bottle label face during pouring?',
                        'options' => ['Towards the floor', 'Facing directly towards the guest being served', 'Facing the sommelier', 'Covered with a napkin'],
                        'correct' => 1
                    ]
                ]
            ]
        ];
        $this->seedIfEmpty($initial);
    }
}
