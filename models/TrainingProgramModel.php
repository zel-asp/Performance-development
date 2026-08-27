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
                        'q' => '1. What does the "A" in the LAST hospitality recovery framework represent?',
                        'options' => [
                            'Argue the hotel policy diplomatically',
                            'Apologize sincerely for the guest\'s distress without assigning blame',
                            'Ask the manager to intervene immediately',
                            'Assess the financial liability of the hotel'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '2. When an agitated guest raises their voice in the lobby, the recommended verbal pace is:',
                        'options' => [
                            'Match their volume and pace so you are heard clearly',
                            'Lower your tone, speak 15% slower, and maintain calm open body posture',
                            'Remain completely silent until they finish shouting',
                            'Immediately step backwards behind the security desk'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '3. What is the maximum instant amenity voucher a Front Desk Host may authorize without GM signoff?',
                        'options' => [
                            '₱500 Dining Credit',
                            '₱2,500 F&B or Spa Voucher + Room Category Upgrade',
                            'Free Weekend Stay',
                            '₱10,000 Cash Refund'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '4. During de-escalation, which phrase should ALWAYS be avoided?',
                        'options' => [
                            '"I completely understand your frustration and I will personally solve this."',
                            '"That\'s not our hotel policy and there is nothing I can do."',
                            '"Let me see what alternatives I can immediately arrange for you."',
                            '"Thank you for bringing this to our attention right away."'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '5. What documentation must be logged immediately after a de-escalation incident is resolved?',
                        'options' => [
                            'Duty Manager Shift Friction Log with guest name, room number, root cause, and recovery voucher issued',
                            'No logging is required if the guest stopped complaining',
                            'Send a private WhatsApp message to coworkers',
                            'Write a handwritten note and discard it at end of shift'
                        ],
                        'correct' => 0
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
                'passingScore' => 80,
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
                        'q' => '1. What is the mandatory minimum internal core temperature for cooked poultry?',
                        'options' => [
                            '63°C (145°F)',
                            '74°C (165°F) for at least 15 seconds',
                            '55°C (130°F)',
                            '85°C (185°F)'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '2. The Temperature Danger Zone for rapid bacterial growth in food is between:',
                        'options' => [
                            '0°C and 4°C',
                            '5°C and 60°C (41°F and 140°F)',
                            '60°C and 100°C',
                            '-18°C and 0°C'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '3. How often must walk-in chiller temperatures be manually logged in the HACCP register?',
                        'options' => [
                            'Once a week',
                            'Every 4 hours during shift operations',
                            'Only during annual audits',
                            'Once at the end of the month'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '4. Which cutting board color is strictly reserved for raw poultry in commercial kitchens?',
                        'options' => [
                            'Blue',
                            'Yellow',
                            'Red',
                            'Green'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '5. What is the maximum time hot food can be held on a buffet line before mandatory re-check or disposal?',
                        'options' => [
                            '1 Hour',
                            '4 Hours at ≥ 60°C',
                            '8 Hours',
                            '12 Hours'
                        ],
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
                        'q' => '1. Which wine classification represents the highest statutory quality tier in Bordeaux, France?',
                        'options' => [
                            'Vin de Pays',
                            'Grand Cru Classé (1855 Classification)',
                            'AOP Regional',
                            'Table Wine'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '2. What ideal serving temperature should be maintained for full-bodied vintage Cabernet Sauvignon?',
                        'options' => [
                            '4°C to 6°C',
                            '16°C to 18°C (60°F to 65°F)',
                            '22°C to 25°C',
                            '0°C'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '3. Which grape variety is the primary constituent of authentic Barolo wines from Piedmont, Italy?',
                        'options' => [
                            'Sangiovese',
                            'Nebbiolo',
                            'Merlot',
                            'Pinot Noir'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '4. When pairing wine with rich Wagyu Ribeye steak, what structural wine characteristic balances the marbling fat?',
                        'options' => [
                            'High residual sugar',
                            'High tannin and robust acidity',
                            'Low alcohol content',
                            'Effervescence'
                        ],
                        'correct' => 1
                    ],
                    [
                        'q' => '5. What is the primary purpose of decanting an aged vintage red wine before service?',
                        'options' => [
                            'Chilling the wine quickly',
                            'Separate sediment and aerate the wine to open complex aromas',
                            'Dilute the alcohol concentration',
                            'Change the wine color'
                        ],
                        'correct' => 1
                    ]
                ]
            ]
        ];
        $this->seedIfEmpty($initial);
    }
}
