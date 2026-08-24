/**
 * Oxford Suites, Makati - Competency Management & Multi-Employee Development Engine
 * Comprehensive Multi-Staff HRMS: Single & Multi-Employee Roster, Comparative Radar, Batch Evaluation & IDP
 */

// ========================================================
// 1. ROLE COMPETENCY PROFILES (BENCHMARKS & STANDARDS)
// ========================================================
const roleCompetencyProfiles = {
    front_office: {
        roleId: 'front_office',
        roleTitle: 'Front Desk Host / Reception Associate',
        department: 'Front Office',
        deptCode: 'front_office',
        experienceRequired: '2+ Years Luxury Hospitality',
        description: 'Delivers exceptional 5-star welcome experiences, operates PMS reservation systems, and maintains composure during high-occupancy check-in peaks.',
        competencies: [
            {
                id: 'comp_fo_1',
                name: 'Guest Relations & VIP Protocol',
                category: 'Core Service',
                benchmark: 4.5,
                weight: 25,
                description: 'Adheres to 5-star greeting rituals, diplomatic discretion, and personalized VIP recognition standards.',
                indicators: 'Recognizes returning elite guests, manages escort protocols, and executes discreet check-in.',
                recommendedCourse: 'Front Desk Standards & VIP Protocols Codex',
                recommendedCourseId: 'book_front_office'
            },
            {
                id: 'comp_fo_2',
                name: 'Opera & PMS Reservation Systems',
                category: 'Technical',
                benchmark: 4.8,
                weight: 25,
                description: 'Mastery over Opera Cloud PMS, room inventory assignment, billing folios, and digital key encoding.',
                indicators: 'Zero billing discrepancies, fast check-in turnaround (<3 mins), and accurate room routing.',
                recommendedCourse: 'Opera Cloud PMS & Room Inventory Masterclass',
                recommendedCourseId: 'book_opera_pms'
            },
            {
                id: 'comp_fo_3',
                name: 'Frontline Conflict De-escalation',
                category: 'Behavioral',
                benchmark: 4.2,
                weight: 20,
                description: 'Applies LAST (Listen, Apologize, Solve, Thank) framework during guest service escalations.',
                indicators: 'Maintains calm posture under pressure, offers empowered recovery solutions, and logs service recoveries.',
                recommendedCourse: 'Hospitality Crisis Diplomacy & LAST Framework',
                recommendedCourseId: 'book_conflict'
            },
            {
                id: 'comp_fo_4',
                name: 'Luxury Room & Suite Upselling',
                category: 'Commercial',
                benchmark: 4.0,
                weight: 15,
                description: 'Proactively presents premium suites, lounge access, and hotel dining packages upon check-in.',
                indicators: 'Consistently achieves >15% upgrade conversion rate with positive guest reception.',
                recommendedCourse: 'Frontline Upselling & Premium Package Presentation',
                recommendedCourseId: 'book_upsell'
            },
            {
                id: 'comp_fo_5',
                name: 'Emergency & Safety Procedures',
                category: 'Compliance',
                benchmark: 4.5,
                weight: 15,
                description: 'Executes hotel emergency evacuation, medical response dispatch, and keycard security protocols.',
                indicators: '100% compliance during unannounced fire/safety audits and key control checks.',
                recommendedCourse: 'Hotel Life Safety & Emergency Evacuation SOP',
                recommendedCourseId: 'book_safety'
            }
        ],
        requiredCertifications: [
            'Certified Hospitality Receptionist (CHR)',
            'Opera Cloud PMS Certified Specialist',
            'First Aid & Adult CPR / AED'
        ]
    },
    fb_service: {
        roleId: 'fb_service',
        roleTitle: 'F&B Captain / Senior Sommelier',
        department: 'Food & Beverage Service',
        deptCode: 'fb_service',
        experienceRequired: '3+ Years Fine Dining',
        description: 'Leads dining floor service excellence, wine pairings, POS ordering accuracy, and guest dietary allergen safety.',
        competencies: [
            {
                id: 'comp_fb_1',
                name: 'Fine Dining Service Etiquette & Mise en Place',
                category: 'Core Service',
                benchmark: 4.6,
                weight: 25,
                description: 'Executes synchronized French/American table service, tableside gueridon service, and silverware placement.',
                indicators: 'Flawless table setup, discrete crumb-clearing, and seamless multi-course coordination.',
                recommendedCourse: 'Fine Dining Floor Etiquette & Michelin Standards',
                recommendedCourseId: 'book_fb_service'
            },
            {
                id: 'comp_fb_2',
                name: 'Beverage Pairing & Wine Sommelier Knowledge',
                category: 'Technical',
                benchmark: 4.4,
                weight: 25,
                description: 'Deep knowledge of regional wine varietals, vintage pairings, decanting rituals, and craft mixology.',
                indicators: 'Articulates tasting notes effortlessly, enhances guest check average through vintage pairings.',
                recommendedCourse: 'Wine Varietals & Cellar Pairing Mastery',
                recommendedCourseId: 'book_sommelier'
            },
            {
                id: 'comp_fb_3',
                name: 'Food Allergen & Dietary Safety Protocol',
                category: 'Compliance',
                benchmark: 5.0,
                weight: 20,
                description: 'Rigorous identification and kitchen communication of 14 major allergens (gluten, nuts, shellfish, etc.).',
                indicators: 'Zero allergen cross-contamination incidents, thorough allergy note flags on POS tickets.',
                recommendedCourse: 'HACCP Allergen Control & Kitchen Communication',
                recommendedCourseId: 'book_allergen'
            },
            {
                id: 'comp_fb_4',
                name: 'Point of Sale (Micros/Simphony) Mastery',
                category: 'Technical',
                benchmark: 4.5,
                weight: 15,
                description: 'Rapid, error-free order entry, seat-number routing, splitting bills, and room charge authorizations.',
                indicators: 'Sub-second POS entry speed with 0% kitchen re-fire waste due to punch errors.',
                recommendedCourse: 'Simphony POS Speed & Split-Billing Protocol',
                recommendedCourseId: 'book_pos'
            },
            {
                id: 'comp_fb_5',
                name: 'Floor Leadership & Station Mentorship',
                category: 'Leadership',
                benchmark: 4.0,
                weight: 15,
                description: 'Mentors junior runners, oversees station timing, and manages guest table turn cadence.',
                indicators: 'Maintains optimal pacing between appetizer and entree, supports junior peers during rushes.',
                recommendedCourse: 'F&B Floor Captain Leadership & Turn Management',
                recommendedCourseId: 'book_fb_lead'
            }
        ],
        requiredCertifications: [
            'WSET Level 2 Award in Wines',
            'TIPS Responsible Beverage Server Certification',
            'ServSafe Food Handler / Allergen Certification'
        ]
    },
    culinary: {
        roleId: 'culinary',
        roleTitle: 'Chef de Partie / Senior Line Cook',
        department: 'Kitchen & Culinary',
        deptCode: 'culinary',
        experienceRequired: '3+ Years Commercial Kitchen',
        description: 'Manages designated kitchen hot/cold station, oversees HACCP temperature controls, recipe standardization, and prep mise en place.',
        competencies: [
            {
                id: 'comp_cul_1',
                name: 'HACCP Food Safety & Critical Control Points',
                category: 'Compliance',
                benchmark: 5.0,
                weight: 30,
                description: 'Monitors walk-in cooler temps, protein internal cook temps, sanitization logs, and FIFO labeling.',
                indicators: '100% pass on internal and municipal health audits, accurate digital temperature logging.',
                recommendedCourse: 'HACCP Advanced Hygiene & Cold Chain Safety',
                recommendedCourseId: 'book_haccp'
            },
            {
                id: 'comp_cul_2',
                name: 'Culinary Technique & Recipe Standardization',
                category: 'Technical',
                benchmark: 4.5,
                weight: 25,
                description: 'Executes mother sauces, precise protein searing/roasting, knife cuts, and exact plating specifications.',
                indicators: 'Consistent taste profiles, minimal portion variance, high plating aesthetic scores.',
                recommendedCourse: 'Contemporary Plating & Mother Sauce Refinement',
                recommendedCourseId: 'book_cul_tech'
            },
            {
                id: 'comp_cul_3',
                name: 'Food Costing, Yield & Waste Reduction',
                category: 'Commercial',
                benchmark: 4.2,
                weight: 20,
                description: 'Maximizes ingredient yield, trim utilization, trim broth conversion, and zero-spoilage inventory control.',
                indicators: 'Maintains departmental food cost within target budget (28-31%), minimal daily scrap waste.',
                recommendedCourse: 'Kitchen Yield Analysis & Sustainable Waste Reduction',
                recommendedCourseId: 'book_yield'
            },
            {
                id: 'comp_cul_4',
                name: 'High-Volume Rush Line Speed & Coordination',
                category: 'Operational',
                benchmark: 4.4,
                weight: 15,
                description: 'Maintains composure on expo line, coordinates ticket times with grill/saute/pastry stations.',
                indicators: 'Ticket times under 14 minutes during peak dinner seating, zero dropped orders.',
                recommendedCourse: 'Expediter Flow & Station Synchronization',
                recommendedCourseId: 'book_line_speed'
            },
            {
                id: 'comp_cul_5',
                name: 'Equipment Maintenance & Chemical Safety',
                category: 'Safety',
                benchmark: 4.0,
                weight: 10,
                description: 'Safe operation and breakdown of combi-ovens, slicers, fryers, and MSDS chemical handling.',
                indicators: 'Zero kitchen workplace accidents, pristine station deep-cleaning sign-off.',
                recommendedCourse: 'Commercial Kitchen Equipment Care & MSDS Protocol',
                recommendedCourseId: 'book_equip_safe'
            }
        ],
        requiredCertifications: [
            'ServSafe Food Protection Manager',
            'HACCP Certified Food Handler',
            'Culinary Arts Diploma or Red Seal Equivalent'
        ]
    },
    housekeeping: {
        roleId: 'housekeeping',
        roleTitle: 'Floor Housekeeping Supervisor',
        department: 'Housekeeping & Facilities',
        deptCode: 'housekeeping',
        experienceRequired: '2+ Years Hotel Housekeeping',
        description: 'Oversees 40+ room inventory turns, luxury linen quality, chemical safety, and room turnaround inspections.',
        competencies: [
            {
                id: 'comp_hk_1',
                name: '50-Point VIP Suite Inspection Standards',
                category: 'Quality Assurance',
                benchmark: 4.8,
                weight: 30,
                description: 'Detailed inspection of high/low dusting, linen crispness, amenity replenishment, and fixtures.',
                indicators: 'Zero guest cleanliness complaints, >98% first-pass room inspection audit score.',
                recommendedCourse: '50-Point White Glove Room Inspection Codex',
                recommendedCourseId: 'book_hk_inspect'
            },
            {
                id: 'comp_hk_2',
                name: 'Turnaround Time & Productivity Flow',
                category: 'Operational',
                benchmark: 4.4,
                weight: 25,
                description: 'Optimizes room cleaning sequence, linen chute coordination, and priority VIP rush rooms.',
                indicators: 'Achieves departure room turn under 22 mins per unit without quality degradation.',
                recommendedCourse: 'Lean Housekeeping Workflow & Turnover Speed',
                recommendedCourseId: 'book_hk_prod'
            },
            {
                id: 'comp_hk_3',
                name: 'OSHA & Eco-Lab Chemical Dilution Safety',
                category: 'Compliance',
                benchmark: 4.7,
                weight: 20,
                description: 'Safe handling of disinfectants, dilution dispensers, bloodborne pathogen cleanup kits.',
                indicators: '100% PPE compliance, zero chemical cross-mix incidents, proper MSDS sheet storage.',
                recommendedCourse: 'Eco-Lab Chemical Dispenser & OSHA Safety Standards',
                recommendedCourseId: 'book_chemical'
            },
            {
                id: 'comp_hk_4',
                name: 'Lost & Found Digital Logging Protocol',
                category: 'Administrative',
                benchmark: 4.5,
                weight: 15,
                description: 'Prompt secure bagging, high-value item safe drop, and PMS guest folio logging.',
                indicators: '100% item recovery tracking rate, zero unaccounted guest property items.',
                recommendedCourse: 'Lost & Found Chain-of-Custody Digital Management',
                recommendedCourseId: 'book_lost_found'
            },
            {
                id: 'comp_hk_5',
                name: 'Attendant Coaching & Linen Inventory Control',
                category: 'Leadership',
                benchmark: 4.0,
                weight: 10,
                description: 'Daily morning briefings, spot coaching on bed-making ergonomics, and par level control.',
                indicators: 'Low linen discard rates, high attendant engagement scores on floor.',
                recommendedCourse: 'Housekeeping Floor Supervisor Coaching Mastery',
                recommendedCourseId: 'book_hk_lead'
            }
        ],
        requiredCertifications: [
            'Certified Hospitality Housekeeping Executive (CHHE)',
            'OSHA Hazard Communication Standard Certification',
            'First Aid & Infection Control Specialist'
        ]
    }
};

// ========================================================
// 2. COMPLETE ASSOCIATES COMPETENCY REPOSITORY
// ========================================================
let associatesCompetencyData = {
    maria_santos: {
        empId: 'maria_santos',
        name: 'Maria Santos',
        role: 'Front Desk Host',
        dept: 'Front Office',
        deptCode: 'front_office',
        avatar: 'MS',
        roleProfileId: 'front_office',
        overallCompetencyScore: 4.28,
        targetBenchmarkScore: 4.40,
        competencyGap: -0.12,
        lastAssessmentDate: '2026-08-15',
        assessedBy: 'Chef Marco (Supervisor) & Elena Vance (HR)',
        status: 'Active Review',
        topStrength: 'Opera & PMS Systems (5.0)',
        criticalGap: 'Conflict De-escalation (-0.75)',
        ratings: {
            comp_fo_1: { self: 4.7, supervisor: 4.8, hr: 4.8, calibrated: 4.80, status: 'Met' },
            comp_fo_2: { self: 5.0, supervisor: 4.9, hr: 5.0, calibrated: 4.95, status: 'Exceeding' },
            comp_fo_3: { self: 3.2, supervisor: 3.5, hr: 3.5, calibrated: 3.45, status: 'Gap' },
            comp_fo_4: { self: 4.0, supervisor: 4.2, hr: 4.1, calibrated: 4.10, status: 'Met' },
            comp_fo_5: { self: 4.3, supervisor: 4.1, hr: 4.2, calibrated: 4.15, status: 'Minor Gap' }
        },
        idpGoals: [
            {
                id: 'idp_ms_1',
                title: 'Master Front Desk Shift Escalations & Crisis Diplomacy',
                category: '70% Experiential',
                competencyId: 'comp_fo_3',
                competencyName: 'Frontline Conflict De-escalation',
                assignedDate: '2026-08-01',
                targetDate: '2026-09-30',
                progress: 75,
                mentor: 'Elena Vance (HR Director)',
                actionItems: [
                    { task: 'Lead 5 live VIP check-in escalation recoveries on shift', done: true },
                    { task: 'Debrief weekly incident logs with Front Office Manager', done: true },
                    { task: 'Complete Crisis Diplomacy simulation scenario assessment', done: false }
                ]
            },
            {
                id: 'idp_ms_2',
                title: 'Peer Mentorship & Shadowing Senior Duty Manager',
                category: '20% Social',
                competencyId: 'comp_fo_1',
                competencyName: 'Guest Relations & VIP Protocol',
                assignedDate: '2026-08-10',
                targetDate: '2026-10-15',
                progress: 50,
                mentor: 'John Marco (Duty Manager)',
                actionItems: [
                    { task: 'Shadow presidential suite check-in escort rituals', done: true },
                    { task: 'Conduct bi-weekly peer feedback session with junior hosts', done: false }
                ]
            }
        ],
        certifications: [
            {
                id: 'cert_ms_1',
                name: 'Opera Cloud PMS Certified Specialist',
                issuer: 'Oracle Hospitality University',
                issuedDate: '2025-03-10',
                expiryDate: '2027-03-10',
                certNo: 'OPERA-2025-98421',
                status: 'Active',
                linkedCompetency: 'Opera & PMS Reservation Systems'
            },
            {
                id: 'cert_ms_2',
                name: 'Certified Hospitality Receptionist (CHR)',
                issuer: 'AHLEI',
                issuedDate: '2024-11-20',
                expiryDate: '2026-11-20',
                certNo: 'AHLEI-CHR-55109',
                status: 'Expiring Soon',
                linkedCompetency: 'Guest Relations & VIP Protocol'
            }
        ],
        assessmentHistory: [
            { date: '2026-08-15', type: 'Q3 Calibration', rater: 'Elena Vance / Marco Rossi', score: 4.28, notes: 'Significant strength in PMS systems and VIP greeting. Prioritizing conflict de-escalation training.' },
            { date: '2026-05-10', type: 'Q2 Periodic Review', rater: 'John Marco', score: 4.12, notes: 'Steady progress, recommended for Senior Host track upon IDP completion.' }
        ]
    },
    carlos_gomez: {
        empId: 'carlos_gomez',
        name: 'Carlos Gomez',
        role: 'Concierge Lead',
        dept: 'Front Office',
        deptCode: 'front_office',
        avatar: 'CG',
        roleProfileId: 'front_office',
        overallCompetencyScore: 4.62,
        targetBenchmarkScore: 4.40,
        competencyGap: 0.22,
        lastAssessmentDate: '2026-08-14',
        assessedBy: 'Elena Vance (HR Admin)',
        status: 'Benchmark Met',
        topStrength: 'Guest Relations & VIP Protocol (5.0)',
        criticalGap: 'None (Benchmark Exceeded)',
        ratings: {
            comp_fo_1: { self: 4.9, supervisor: 5.0, hr: 5.0, calibrated: 5.0, status: 'Exceeding' },
            comp_fo_2: { self: 4.6, supervisor: 4.6, hr: 4.7, calibrated: 4.65, status: 'Met' },
            comp_fo_3: { self: 4.5, supervisor: 4.8, hr: 4.8, calibrated: 4.75, status: 'Exceeding' },
            comp_fo_4: { self: 4.4, supervisor: 4.5, hr: 4.5, calibrated: 4.45, status: 'Met' },
            comp_fo_5: { self: 4.3, supervisor: 4.2, hr: 4.3, calibrated: 4.25, status: 'Minor Gap' }
        },
        idpGoals: [
            {
                id: 'idp_cg_1',
                title: 'Les Clefs d’Or International Concierge Certification',
                category: '70% Experiential',
                competencyId: 'comp_fo_1',
                competencyName: 'Guest Relations & VIP Protocol',
                assignedDate: '2026-07-01',
                targetDate: '2026-11-30',
                progress: 80,
                mentor: 'Robert Sterling (General Manager)',
                actionItems: [
                    { task: 'Compile Makati cultural & bespoke luxury guide dossier', done: true },
                    { task: 'Submit Clefs d’Or national chapter recommendation dossier', done: true }
                ]
            }
        ],
        certifications: [
            {
                id: 'cert_cg_1',
                name: 'Certified Concierge Specialist (CCS)',
                issuer: 'AHLEI',
                issuedDate: '2024-05-15',
                expiryDate: '2026-05-15',
                certNo: 'AHLEI-CCS-44219',
                status: 'Expired',
                linkedCompetency: 'Guest Relations & VIP Protocol'
            }
        ],
        assessmentHistory: [
            { date: '2026-08-14', type: 'Q3 Calibration', rater: 'Elena Vance', score: 4.62, notes: 'Outstanding guest relations. Ready for Assistant Front Office Manager succession pool.' }
        ]
    },
    ana_tanaka: {
        empId: 'ana_tanaka',
        name: 'Ana Tanaka',
        role: 'Night Auditor',
        dept: 'Front Office',
        deptCode: 'front_office',
        avatar: 'AT',
        roleProfileId: 'front_office',
        overallCompetencyScore: 4.75,
        targetBenchmarkScore: 4.40,
        competencyGap: 0.35,
        lastAssessmentDate: '2026-08-16',
        assessedBy: 'Elena Vance (HR)',
        status: 'Benchmark Met',
        topStrength: 'Financial Audit & PMS (5.0)',
        criticalGap: 'None (Benchmark Exceeded)',
        ratings: {
            comp_fo_1: { self: 4.5, supervisor: 4.7, hr: 4.7, calibrated: 4.65, status: 'Met' },
            comp_fo_2: { self: 5.0, supervisor: 5.0, hr: 5.0, calibrated: 5.00, status: 'Exceeding' },
            comp_fo_3: { self: 4.6, supervisor: 4.7, hr: 4.7, calibrated: 4.68, status: 'Met' },
            comp_fo_4: { self: 4.3, supervisor: 4.4, hr: 4.4, calibrated: 4.38, status: 'Met' },
            comp_fo_5: { self: 5.0, supervisor: 5.0, hr: 5.0, calibrated: 5.00, status: 'Exceeding' }
        },
        idpGoals: [],
        certifications: [
            {
                id: 'cert_at_1',
                name: 'Opera Cloud PMS Superuser & Financial Auditor',
                issuer: 'Oracle Hospitality',
                issuedDate: '2025-01-10',
                expiryDate: '2027-01-10',
                certNo: 'OPERA-AUD-77312',
                status: 'Active',
                linkedCompetency: 'Opera & PMS Reservation Systems'
            }
        ],
        assessmentHistory: [
            { date: '2026-08-16', type: 'Q3 Calibration', rater: 'Elena Vance', score: 4.75, notes: 'Highest financial ledger accuracy across the property.' }
        ]
    },
    lucas_vargas: {
        empId: 'lucas_vargas',
        name: 'Lucas Vargas',
        role: 'Junior Front Desk Host',
        dept: 'Front Office',
        deptCode: 'front_office',
        avatar: 'LV',
        roleProfileId: 'front_office',
        overallCompetencyScore: 3.82,
        targetBenchmarkScore: 4.40,
        competencyGap: -0.58,
        lastAssessmentDate: '2026-08-10',
        assessedBy: 'John Marco (Supervisor)',
        status: 'Priority TNA',
        topStrength: 'Room Upselling (4.25)',
        criticalGap: 'Conflict De-escalation (-1.10)',
        ratings: {
            comp_fo_1: { self: 3.8, supervisor: 4.0, hr: 3.9, calibrated: 3.90, status: 'Minor Gap' },
            comp_fo_2: { self: 3.5, supervisor: 3.7, hr: 3.6, calibrated: 3.65, status: 'Gap' },
            comp_fo_3: { self: 3.0, supervisor: 3.2, hr: 3.1, calibrated: 3.10, status: 'Significant Gap' },
            comp_fo_4: { self: 4.2, supervisor: 4.3, hr: 4.2, calibrated: 4.25, status: 'Met' },
            comp_fo_5: { self: 4.0, supervisor: 4.1, hr: 4.1, calibrated: 4.10, status: 'Minor Gap' }
        },
        idpGoals: [
            {
                id: 'idp_lv_1',
                title: 'Intensive Opera PMS Sandbox & Check-in Speed Drills',
                category: '70% Experiential',
                competencyId: 'comp_fo_2',
                competencyName: 'Opera & PMS Reservation Systems',
                assignedDate: '2026-08-12',
                targetDate: '2026-09-25',
                progress: 40,
                mentor: 'Ana Tanaka (Auditor)',
                actionItems: [
                    { task: 'Complete 30 simulated complex folio splits', done: true },
                    { task: 'Achieve check-in cycle time under 3.5 minutes', done: false }
                ]
            }
        ],
        certifications: [
            {
                id: 'cert_lv_1',
                name: 'Basic Hospitality Service Foundations',
                issuer: 'Oxford Suites Internal Academy',
                issuedDate: '2026-03-01',
                expiryDate: '2028-03-01',
                certNo: 'OSM-FND-10029',
                status: 'Active',
                linkedCompetency: 'Guest Relations & VIP Protocol'
            }
        ],
        assessmentHistory: [
            { date: '2026-08-10', type: 'Probation Milestone', rater: 'John Marco', score: 3.82, notes: 'Requires intensive coaching on PMS and Conflict Handling.' }
        ]
    },
    pierre_dubois: {
        empId: 'pierre_dubois',
        name: 'Pierre Dubois',
        role: 'F&B Captain / Sommelier',
        dept: 'Food & Beverage Service',
        deptCode: 'fb_service',
        avatar: 'PD',
        roleProfileId: 'fb_service',
        overallCompetencyScore: 4.54,
        targetBenchmarkScore: 4.50,
        competencyGap: 0.04,
        lastAssessmentDate: '2026-08-12',
        assessedBy: 'Chef Marco (Supervisor)',
        status: 'Benchmark Met',
        topStrength: 'Sommelier & Wine Pairing (4.9)',
        criticalGap: 'POS Speed & Split-Billing (-0.3)',
        ratings: {
            comp_fb_1: { self: 4.7, supervisor: 4.8, hr: 4.8, calibrated: 4.80, status: 'Exceeding' },
            comp_fb_2: { self: 4.9, supervisor: 4.9, hr: 4.9, calibrated: 4.90, status: 'Exceeding' },
            comp_fb_3: { self: 5.0, supervisor: 5.0, hr: 5.0, calibrated: 5.00, status: 'Met' },
            comp_fb_4: { self: 4.1, supervisor: 4.2, hr: 4.2, calibrated: 4.20, status: 'Minor Gap' },
            comp_fb_5: { self: 3.8, supervisor: 3.8, hr: 3.8, calibrated: 3.80, status: 'Minor Gap' }
        },
        idpGoals: [],
        certifications: [
            {
                id: 'cert_pd_1',
                name: 'WSET Level 3 Award in Wines',
                issuer: 'Wine & Spirit Education Trust',
                issuedDate: '2024-02-15',
                expiryDate: '2027-02-15',
                certNo: 'WSET-L3-99410',
                status: 'Active',
                linkedCompetency: 'Beverage Pairing & Wine Sommelier Knowledge'
            }
        ],
        assessmentHistory: []
    },
    clara_reyes: {
        empId: 'clara_reyes',
        name: 'Clara Reyes',
        role: 'Food Server & Barista',
        dept: 'Food & Beverage Service',
        deptCode: 'fb_service',
        avatar: 'CR',
        roleProfileId: 'fb_service',
        overallCompetencyScore: 3.90,
        targetBenchmarkScore: 4.50,
        competencyGap: -0.60,
        lastAssessmentDate: '2026-08-08',
        assessedBy: 'Pierre Dubois (Captain)',
        status: 'Priority TNA',
        topStrength: 'Guest Dining Etiquette (4.3)',
        criticalGap: 'Allergen Control Protocol (-1.0)',
        ratings: {
            comp_fb_1: { self: 4.2, supervisor: 4.3, hr: 4.3, calibrated: 4.30, status: 'Minor Gap' },
            comp_fb_2: { self: 3.5, supervisor: 3.6, hr: 3.6, calibrated: 3.60, status: 'Gap' },
            comp_fb_3: { self: 3.8, supervisor: 4.0, hr: 4.0, calibrated: 4.00, status: 'Significant Gap' },
            comp_fb_4: { self: 3.9, supervisor: 4.1, hr: 4.0, calibrated: 4.00, status: 'Minor Gap' },
            comp_fb_5: { self: 3.5, supervisor: 3.6, hr: 3.6, calibrated: 3.60, status: 'Minor Gap' }
        },
        idpGoals: [],
        certifications: [],
        assessmentHistory: []
    },
    chef_marco: {
        empId: 'chef_marco',
        name: 'Chef Marco Rossi',
        role: 'Executive Sous Chef',
        dept: 'Kitchen & Culinary',
        deptCode: 'culinary',
        avatar: 'MR',
        roleProfileId: 'culinary',
        overallCompetencyScore: 4.80,
        targetBenchmarkScore: 4.60,
        competencyGap: 0.20,
        lastAssessmentDate: '2026-08-14',
        assessedBy: 'Executive Chef & GM',
        status: 'Benchmark Met',
        topStrength: 'HACCP Food Safety (5.0)',
        criticalGap: 'None (Benchmark Exceeded)',
        ratings: {
            comp_cul_1: { self: 5.0, supervisor: 5.0, hr: 5.0, calibrated: 5.00, status: 'Exceeding' },
            comp_cul_2: { self: 4.8, supervisor: 4.9, hr: 4.9, calibrated: 4.90, status: 'Exceeding' },
            comp_cul_3: { self: 4.5, supervisor: 4.6, hr: 4.6, calibrated: 4.60, status: 'Met' },
            comp_cul_4: { self: 4.7, supervisor: 4.8, hr: 4.8, calibrated: 4.80, status: 'Exceeding' },
            comp_cul_5: { self: 4.6, supervisor: 4.7, hr: 4.7, calibrated: 4.70, status: 'Exceeding' }
        },
        idpGoals: [],
        certifications: [
            {
                id: 'cert_mr_1',
                name: 'ServSafe Food Protection Manager',
                issuer: 'National Restaurant Association',
                issuedDate: '2025-05-10',
                expiryDate: '2028-05-10',
                certNo: 'SERV-MGR-88319',
                status: 'Active',
                linkedCompetency: 'HACCP Food Safety & Critical Control Points'
            }
        ],
        assessmentHistory: []
    },
    miguel_torres: {
        empId: 'miguel_torres',
        name: 'Miguel Torres',
        role: 'Senior Line Cook (Grill/Saute)',
        dept: 'Kitchen & Culinary',
        deptCode: 'culinary',
        avatar: 'MT',
        roleProfileId: 'culinary',
        overallCompetencyScore: 4.10,
        targetBenchmarkScore: 4.60,
        competencyGap: -0.50,
        lastAssessmentDate: '2026-08-11',
        assessedBy: 'Chef Marco Rossi',
        status: 'Priority TNA',
        topStrength: 'Line Speed & Expo (4.5)',
        criticalGap: 'Food Costing & Waste Trim (-0.8)',
        ratings: {
            comp_cul_1: { self: 4.4, supervisor: 4.5, hr: 4.5, calibrated: 4.50, status: 'Minor Gap' },
            comp_cul_2: { self: 4.2, supervisor: 4.3, hr: 4.3, calibrated: 4.30, status: 'Minor Gap' },
            comp_cul_3: { self: 3.3, supervisor: 3.4, hr: 3.4, calibrated: 3.40, status: 'Significant Gap' },
            comp_cul_4: { self: 4.5, supervisor: 4.5, hr: 4.5, calibrated: 4.50, status: 'Met' },
            comp_cul_5: { self: 3.8, supervisor: 3.8, hr: 3.8, calibrated: 3.80, status: 'Minor Gap' }
        },
        idpGoals: [],
        certifications: [],
        assessmentHistory: []
    },
    elena_vance: {
        empId: 'elena_vance',
        name: 'Elena Vance',
        role: 'Floor Housekeeping Supervisor',
        dept: 'Housekeeping & Facilities',
        deptCode: 'housekeeping',
        avatar: 'EV',
        roleProfileId: 'housekeeping',
        overallCompetencyScore: 4.70,
        targetBenchmarkScore: 4.50,
        competencyGap: 0.20,
        lastAssessmentDate: '2026-08-15',
        assessedBy: 'Executive Housekeeper',
        status: 'Benchmark Met',
        topStrength: '50-Point Suite Inspections (5.0)',
        criticalGap: 'None (Benchmark Exceeded)',
        ratings: {
            comp_hk_1: { self: 5.0, supervisor: 5.0, hr: 5.0, calibrated: 5.00, status: 'Exceeding' },
            comp_hk_2: { self: 4.6, supervisor: 4.7, hr: 4.7, calibrated: 4.70, status: 'Met' },
            comp_hk_3: { self: 4.8, supervisor: 4.8, hr: 4.8, calibrated: 4.80, status: 'Exceeding' },
            comp_hk_4: { self: 4.5, supervisor: 4.5, hr: 4.5, calibrated: 4.50, status: 'Met' },
            comp_hk_5: { self: 4.5, supervisor: 4.5, hr: 4.5, calibrated: 4.50, status: 'Exceeding' }
        },
        idpGoals: [],
        certifications: [
            {
                id: 'cert_ev_1',
                name: 'Certified Hospitality Housekeeping Executive (CHHE)',
                issuer: 'AHLEI',
                issuedDate: '2025-01-20',
                expiryDate: '2028-01-20',
                certNo: 'AHLEI-CHHE-77192',
                status: 'Active',
                linkedCompetency: '50-Point VIP Suite Inspection Standards'
            }
        ],
        assessmentHistory: []
    },
    rosa_mendoza: {
        empId: 'rosa_mendoza',
        name: 'Rosa Mendoza',
        role: 'Senior Suite Attendant',
        dept: 'Housekeeping & Facilities',
        deptCode: 'housekeeping',
        avatar: 'RM',
        roleProfileId: 'housekeeping',
        overallCompetencyScore: 4.05,
        targetBenchmarkScore: 4.50,
        competencyGap: -0.45,
        lastAssessmentDate: '2026-08-09',
        assessedBy: 'Elena Vance (Supervisor)',
        status: 'Active Review',
        topStrength: 'Turnaround Time & Speed (4.4)',
        criticalGap: 'Chemical Dilution Safety (-0.8)',
        ratings: {
            comp_hk_1: { self: 4.2, supervisor: 4.3, hr: 4.3, calibrated: 4.30, status: 'Minor Gap' },
            comp_hk_2: { self: 4.4, supervisor: 4.4, hr: 4.4, calibrated: 4.40, status: 'Met' },
            comp_hk_3: { self: 3.8, supervisor: 3.9, hr: 3.9, calibrated: 3.90, status: 'Gap' },
            comp_hk_4: { self: 4.0, supervisor: 4.1, hr: 4.0, calibrated: 4.00, status: 'Minor Gap' },
            comp_hk_5: { self: 3.6, supervisor: 3.7, hr: 3.7, calibrated: 3.70, status: 'Minor Gap' }
        },
        idpGoals: [],
        certifications: [],
        assessmentHistory: []
    }
};

// State Variables
let activeCompetencyEmpKey = 'maria_santos';
let activeRoleProfileKey = 'front_office';
let competencyViewMode = 'single'; // 'single' | 'team_deck' | 'compare'
let comparedEmployeeKeys = ['maria_santos', 'carlos_gomez', 'lucas_vargas'];

// ========================================================
// 3. INITIALIZATION & RENDERING CONTROLLERS
// ========================================================
function initCompetencyModule() {
    renderRoleProfileSelector();
    renderRoleCompetencyFramework();
    renderEmployeeSelectOptions();
    renderCompetencyViewMode();
    renderCompetencyMatrixTable();
    renderSkillsGapAnalysis();
    renderIDPView();
    renderCertificationsRoster();
    renderPerformanceIntegrationSummary();
    renderCompetencyAnalyticsDashboard();
}

// 3.1 Render Staff Dropdown Options (All 10 Associates Across Departments)
function renderEmployeeSelectOptions() {
    const select = document.getElementById('comp-emp-select');
    if (!select) return;

    select.innerHTML = Object.keys(associatesCompetencyData).map(key => {
        const emp = associatesCompetencyData[key];
        return `<option value="${key}" ${key === activeCompetencyEmpKey ? 'selected' : ''}>${emp.name} (${emp.role} · ${emp.overallCompetencyScore.toFixed(2)})</option>`;
    }).join('');
}

// 3.2 View Mode Switcher: Single Deep-Dive vs Team Deck vs Multi-Compare
function setCompetencyViewMode(mode) {
    competencyViewMode = mode;

    document.querySelectorAll('.btn-comp-viewmode').forEach(btn => {
        btn.classList.remove('active', 'bg-primary', 'text-white', 'font-bold');
        btn.classList.add('bg-white', 'text-slate-700');
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active', 'bg-primary', 'text-white', 'font-bold');
            btn.classList.remove('bg-white', 'text-slate-700');
        }
    });

    renderCompetencyViewMode();
    showToast(`Switched Competency View to: ${mode === 'single' ? 'Single Associate Deep-Dive' : (mode === 'team_deck' ? 'Team Roster Grid (Multi-Staff)' : 'Side-by-Side Multi-Staff Compare')}`, 'info');
}

// 3.3 Render Active View Mode in Tab 2 (Assessment)
function renderCompetencyViewMode() {
    const singleContainer = document.getElementById('comp-single-employee-view');
    const teamDeckContainer = document.getElementById('comp-team-deck-view');
    const compareContainer = document.getElementById('comp-compare-view');

    if (singleContainer) singleContainer.style.display = (competencyViewMode === 'single') ? 'block' : 'none';
    if (teamDeckContainer) teamDeckContainer.style.display = (competencyViewMode === 'team_deck') ? 'block' : 'none';
    if (compareContainer) compareContainer.style.display = (competencyViewMode === 'compare') ? 'block' : 'none';

    if (competencyViewMode === 'single') {
        renderSelectedEmployeeRadarView();
    } else if (competencyViewMode === 'team_deck') {
        renderTeamRosterDeck();
    } else if (competencyViewMode === 'compare') {
        renderMultiEmployeeComparison();
    }
}

// 3.4 Multi-Employee Team Deck Grid (Manage Multiple Associates at a Glance)
function renderTeamRosterDeck() {
    const container = document.getElementById('team-deck-cards-grid');
    if (!container) return;

    const deptFilter = document.getElementById('team-deck-dept-filter')?.value || 'all';
    const associates = Object.values(associatesCompetencyData).filter(emp => {
        return (deptFilter === 'all' || emp.deptCode === deptFilter);
    });

    container.innerHTML = associates.map(emp => {
        let badgeClass = 'badge-sage';
        let badgeText = `Benchmark Met (+${emp.competencyGap >= 0 ? '+' : ''}${emp.competencyGap.toFixed(2)})`;
        if (emp.competencyGap < -0.4) {
            badgeClass = 'badge-terracotta';
            badgeText = `Priority TNA (${emp.competencyGap.toFixed(2)})`;
        } else if (emp.competencyGap < 0) {
            badgeClass = 'badge-gold';
            badgeText = `Minor Gap (${emp.competencyGap.toFixed(2)})`;
        }

        const isFocus = emp.empId === activeCompetencyEmpKey;

        return `
            <div class="p-5 bg-white rounded-2xl border ${isFocus ? 'border-primary ring-2 ring-primary/20' : 'border-[#E8DEDC]'} hover:border-primary/50 transition shadow-2xs space-y-3.5 flex flex-col justify-between">
                <div>
                    <div class="flex items-start justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center shadow-xs">
                                ${emp.avatar}
                            </div>
                            <div>
                                <h4 class="font-heading font-bold text-sm text-slate-900">${emp.name}</h4>
                                <p class="text-[11px] text-slate-500">${emp.role} · ${emp.dept}</p>
                            </div>
                        </div>
                        <span class="${badgeClass} text-[10px]">${badgeText}</span>
                    </div>

                    <div class="mt-3 p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-2 text-xs">
                        <div class="flex justify-between items-center font-semibold">
                            <span class="text-slate-500">Overall Rating:</span>
                            <span class="font-heading font-bold text-sm text-primary">${emp.overallCompetencyScore.toFixed(2)} / 5.0</span>
                        </div>
                        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div class="bg-primary h-2 rounded-full" style="width: ${(emp.overallCompetencyScore / 5.0) * 100}%"></div>
                        </div>
                        <div class="text-[11px] space-y-0.5 pt-1">
                            <p class="text-slate-700">✦ <strong>Top Strength:</strong> <span class="text-sage-dark font-medium">${emp.topStrength}</span></p>
                            <p class="text-slate-700">✦ <strong>Critical Gap:</strong> <span class="${emp.competencyGap < 0 ? 'text-terracotta' : 'text-slate-500'} font-medium">${emp.criticalGap}</span></p>
                        </div>
                    </div>
                </div>

                <div class="pt-2 border-t border-[#E8DEDC] flex items-center justify-between gap-2 flex-wrap">
                    <button onclick="selectCompetencyAssociate('${emp.empId}'); setCompetencyViewMode('single');" class="px-3 py-1.5 rounded-xl border border-[#E8DEDC] hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center space-x-1">
                        <i class="fas fa-eye text-primary"></i>
                        <span>Deep-Dive</span>
                    </button>
                    <button onclick="launchAssessmentModalFor('${emp.empId}')" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1">
                        <i class="fas fa-clipboard-check"></i>
                        <span>Evaluate</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    const countEl = document.getElementById('team-deck-count');
    if (countEl) countEl.innerText = `${associates.length} Associates In Roster`;
}

// 3.5 Multi-Employee Side-by-Side Comparison (Overlaid Radar & Comparative Rubric)
function renderMultiEmployeeComparison() {
    const selectorContainer = document.getElementById('compare-employee-checkboxes');
    if (selectorContainer) {
        selectorContainer.innerHTML = Object.values(associatesCompetencyData).map(emp => {
            const isChecked = comparedEmployeeKeys.includes(emp.empId);
            return `
                <label class="flex items-center space-x-2 px-3 py-1.5 rounded-xl border ${isChecked ? 'bg-primary-50 border-primary text-primary font-bold' : 'bg-white border-[#E8DEDC] text-slate-700'} text-xs cursor-pointer transition">
                    <input type="checkbox" value="${emp.empId}" ${isChecked ? 'checked' : ''} onchange="toggleCompareEmployee('${emp.empId}')" class="accent-[#9E1B20] w-3.5 h-3.5 rounded">
                    <span>${emp.name}</span>
                </label>
            `;
        }).join('');
    }

    const tableBody = document.getElementById('compare-table-tbody');
    if (tableBody) {
        const selectedEmps = comparedEmployeeKeys.map(k => associatesCompetencyData[k]).filter(Boolean);
        const profile = roleCompetencyProfiles.front_office;

        const rowsHtml = profile.competencies.map(c => {
            const cells = selectedEmps.map(emp => {
                const r = emp.ratings[c.id]?.calibrated || 3.5;
                let badge = 'badge-sage';
                if (r < 3.8) badge = 'badge-terracotta';
                else if (r < 4.2) badge = 'badge-gold';

                return `<td class="px-4 py-3 text-center"><span class="${badge} font-bold text-xs">${r.toFixed(1)} / 5.0</span></td>`;
            }).join('');

            return `
                <tr class="hover:bg-[#FAF8F7] transition">
                    <td class="px-4 py-3 font-semibold text-slate-900 text-xs">
                        ${c.name}
                        <span class="block text-[10px] text-slate-400 font-normal">Target: ${c.benchmark.toFixed(1)}</span>
                    </td>
                    ${cells}
                </tr>
            `;
        }).join('');

        const overallCells = selectedEmps.map(emp => `
            <td class="px-4 py-3 text-center font-heading font-bold text-sm text-primary">
                ${emp.overallCompetencyScore.toFixed(2)}
            </td>
        `).join('');

        tableBody.innerHTML = `
            ${rowsHtml}
            <tr class="bg-primary-50/50 font-bold border-t-2 border-primary/20">
                <td class="px-4 py-3.5 text-xs text-slate-900">Overall Calibrated Score</td>
                ${overallCells}
            </tr>
        `;
    }

    updateComparativeRadarChart();
}

// 3.6 Toggle Associate Selection for Comparative View
function toggleCompareEmployee(empId) {
    if (comparedEmployeeKeys.includes(empId)) {
        if (comparedEmployeeKeys.length <= 1) {
            showToast('Please keep at least 1 associate selected for comparison.', 'warning');
            return;
        }
        comparedEmployeeKeys = comparedEmployeeKeys.filter(id => id !== empId);
    } else {
        if (comparedEmployeeKeys.length >= 4) {
            showToast('You can compare a maximum of 4 associates simultaneously.', 'info');
            return;
        }
        comparedEmployeeKeys.push(empId);
    }

    renderMultiEmployeeComparison();
}

// 3.7 Update Comparative Multi-Dataset Radar Chart
function updateComparativeRadarChart() {
    const ctx = document.getElementById('chart-comparative-radar');
    if (!ctx) return;

    const profile = roleCompetencyProfiles.front_office;
    const labels = profile.competencies.map(c => c.name.split(' ').slice(0, 3).join(' '));

    const colors = [
        { border: '#9E1B20', bg: 'rgba(158, 27, 32, 0.12)' },
        { border: '#7A9A7E', bg: 'rgba(122, 154, 126, 0.12)' },
        { border: '#C89B3C', bg: 'rgba(200, 155, 60, 0.12)' },
        { border: '#6B8FA3', bg: 'rgba(107, 143, 163, 0.12)' }
    ];

    const datasets = [
        {
            label: 'Benchmark Target',
            data: profile.competencies.map(c => c.benchmark),
            borderColor: '#9C8F8D',
            borderWidth: 1.5,
            borderDash: [3, 3],
            pointRadius: 2,
            backgroundColor: 'transparent'
        }
    ];

    comparedEmployeeKeys.forEach((empKey, idx) => {
        const emp = associatesCompetencyData[empKey];
        if (emp) {
            const color = colors[idx % colors.length];
            datasets.push({
                label: emp.name,
                data: profile.competencies.map(c => emp.ratings[c.id]?.calibrated || 3.5),
                borderColor: color.border,
                backgroundColor: color.bg,
                borderWidth: 2,
                pointRadius: 3
            });
        }
    });

    if (window.chartComparativeRadarInstance) {
        window.chartComparativeRadarInstance.data.labels = labels;
        window.chartComparativeRadarInstance.data.datasets = datasets;
        window.chartComparativeRadarInstance.update();
    } else {
        window.chartComparativeRadarInstance = new Chart(ctx, {
            type: 'radar',
            data: { labels: labels, datasets: datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, family: 'Inter' } } }
                },
                scales: {
                    r: {
                        min: 1,
                        max: 5,
                        ticks: { stepSize: 1, display: false },
                        pointLabels: { font: { size: 9, family: 'Inter', weight: '600' }, color: '#211A1A' },
                        grid: { color: '#E8DEDC' },
                        angleLines: { color: '#E8DEDC' }
                    }
                }
            }
        });
    }
}

// 3.8 Role Profile Selector
function renderRoleProfileSelector() {
    const roleSelect = document.getElementById('comp-role-profile-select');
    if (!roleSelect) return;

    roleSelect.innerHTML = Object.keys(roleCompetencyProfiles).map(key => {
        const p = roleCompetencyProfiles[key];
        return `<option value="${key}" ${key === activeRoleProfileKey ? 'selected' : ''}>${p.department} · ${p.roleTitle}</option>`;
    }).join('');
}

// 3.9 Change Active Role Profile
function switchRoleProfileView(roleKey) {
    if (!roleCompetencyProfiles[roleKey]) return;
    activeRoleProfileKey = roleKey;
    renderRoleCompetencyFramework();
    showToast(`Loaded Competency Framework for: ${roleCompetencyProfiles[roleKey].roleTitle}`, 'info');
}

// 3.10 Render Role Competency Framework Details
function renderRoleCompetencyFramework() {
    const profile = roleCompetencyProfiles[activeRoleProfileKey];
    const container = document.getElementById('role-framework-container');
    if (!container || !profile) return;

    const titleEl = document.getElementById('framework-role-title');
    const deptEl = document.getElementById('framework-role-dept');
    const expEl = document.getElementById('framework-role-exp');
    const descEl = document.getElementById('framework-role-desc');

    if (titleEl) titleEl.innerText = profile.roleTitle;
    if (deptEl) deptEl.innerText = profile.department;
    if (expEl) expEl.innerText = profile.experienceRequired;
    if (descEl) descEl.innerText = profile.description;

    const listHtml = profile.competencies.map((c, idx) => {
        let catBadge = 'badge-primary';
        if (c.category === 'Technical') catBadge = 'badge-dusty';
        if (c.category === 'Compliance' || c.category === 'Safety') catBadge = 'badge-terracotta';
        if (c.category === 'Leadership') catBadge = 'badge-gold';
        if (c.category === 'Core Service' || c.category === 'Quality Assurance') catBadge = 'badge-sage';

        return `
            <div class="p-4 bg-white rounded-2xl border border-[#E8DEDC] hover:border-primary/40 transition shadow-2xs space-y-2.5">
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center space-x-2">
                        <span class="w-6 h-6 rounded-full bg-[#FAF8F7] text-slate-800 font-bold text-xs flex items-center justify-center border border-[#E8DEDC]">
                            ${idx + 1}
                        </span>
                        <h4 class="font-heading font-bold text-sm text-slate-900">${c.name}</h4>
                        <span class="${catBadge} text-[10px]">${c.category}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-[11px] text-slate-400 font-medium">Weight: <strong>${c.weight}%</strong></span>
                        <span class="px-2 py-0.5 rounded-lg bg-primary-50 text-primary border border-primary-100 font-bold text-xs">
                            Target: ${c.benchmark.toFixed(1)} / 5.0
                        </span>
                    </div>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">${c.description}</p>
                <div class="p-2.5 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] text-[11px] text-slate-700 flex items-start space-x-2">
                    <i class="fas fa-eye text-primary mt-0.5"></i>
                    <span><strong>Observable Indicators:</strong> ${c.indicators}</span>
                </div>
            </div>
        `;
    }).join('');

    const certsHtml = profile.requiredCertifications.map(cert => `
        <span class="px-2.5 py-1 rounded-xl bg-sage-50 text-sage-dark border border-sage-100 font-bold text-xs flex items-center space-x-1.5 shadow-2xs">
            <i class="fas fa-certificate text-sage text-xs"></i>
            <span>${cert}</span>
        </span>
    `).join('');

    container.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <h4 class="font-heading font-bold text-sm text-slate-900">5 Defined Core Competency Dimensions</h4>
                <button onclick="openModal('modal-edit-competency-profile')" class="btn-secondary px-3 py-1 text-xs font-bold flex items-center space-x-1.5">
                    <i class="fas fa-pen-to-square text-xs text-primary"></i>
                    <span>Edit Role Benchmark</span>
                </button>
            </div>
            <div class="space-y-3">${listHtml}</div>
            <div class="pt-3 border-t border-[#E8DEDC]">
                <h5 class="text-xs font-bold text-slate-800 mb-2">Mandatory Role Certifications:</h5>
                <div class="flex flex-wrap gap-2">${certsHtml}</div>
            </div>
        </div>
    `;
}

// 3.11 Select Associate for Single Deep-Dive
function selectCompetencyAssociate(empKey) {
    if (!associatesCompetencyData[empKey]) return;
    activeCompetencyEmpKey = empKey;

    const empSelect = document.getElementById('comp-emp-select');
    if (empSelect) empSelect.value = empKey;

    renderSelectedEmployeeRadarView();
    renderSkillsGapAnalysis();
    renderIDPView();
    renderCertificationsRoster();
    renderPerformanceIntegrationSummary();
    showToast(`Switched Competency Focus to ${associatesCompetencyData[empKey].name}`, 'info');
}

// 3.12 Render Selected Employee Radar Profile View
function renderSelectedEmployeeRadarView() {
    const emp = associatesCompetencyData[activeCompetencyEmpKey];
    if (!emp) return;

    const profile = roleCompetencyProfiles[emp.roleProfileId] || roleCompetencyProfiles.front_office;

    const nameEl = document.getElementById('comp-radar-emp-name');
    const roleEl = document.getElementById('comp-radar-emp-role');
    const scoreEl = document.getElementById('comp-radar-overall-score');
    const statusBadgeEl = document.getElementById('comp-radar-status-badge');

    if (nameEl) nameEl.innerText = emp.name;
    if (roleEl) roleEl.innerText = `${emp.role} · ${emp.dept}`;
    if (scoreEl) scoreEl.innerText = `${emp.overallCompetencyScore.toFixed(2)} / 5.0`;

    if (statusBadgeEl) {
        if (emp.competencyGap >= 0) {
            statusBadgeEl.className = 'badge-sage';
            statusBadgeEl.innerText = `Benchmark Met (+${emp.competencyGap.toFixed(2)})`;
        } else if (emp.competencyGap > -0.3) {
            statusBadgeEl.className = 'badge-gold';
            statusBadgeEl.innerText = `Minor Gap (${emp.competencyGap.toFixed(2)})`;
        } else {
            statusBadgeEl.className = 'badge-terracotta';
            statusBadgeEl.innerText = `Priority TNA (${emp.competencyGap.toFixed(2)})`;
        }
    }

    const barsContainer = document.getElementById('comp-radar-bars-container');
    if (barsContainer) {
        barsContainer.innerHTML = profile.competencies.map(c => {
            const r = emp.ratings[c.id] || { calibrated: 3.5, supervisor: 3.5, self: 3.5 };
            const pct = Math.min(100, Math.round((r.calibrated / 5.0) * 100));
            const gap = (r.calibrated - c.benchmark).toFixed(1);
            let barColor = 'bg-sage';
            let badgeClass = 'badge-sage';

            if (gap < -0.4) {
                barColor = 'bg-terracotta';
                badgeClass = 'badge-terracotta';
            } else if (gap < 0) {
                barColor = 'bg-gold';
                badgeClass = 'badge-gold';
            }

            return `
                <div class="space-y-1.5">
                    <div class="flex justify-between items-center text-xs font-semibold text-slate-800">
                        <span class="truncate max-w-[220px]" title="${c.name}">${c.name}</span>
                        <div class="flex items-center space-x-2">
                            <span class="text-[11px] text-slate-400">Target: ${c.benchmark.toFixed(1)}</span>
                            <span class="${badgeClass} font-bold text-[11px]">${r.calibrated.toFixed(1)} / 5.0</span>
                        </div>
                    </div>
                    <div class="w-full bg-[#FAF8F7] h-2 rounded-full overflow-hidden border border-[#E8DEDC]/80 relative">
                        <div class="${barColor} h-2 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateCompetencyRadarChart(emp, profile);
}

// 3.13 Update Single Radar Chart
function updateCompetencyRadarChart(emp, profile) {
    const ctx = document.getElementById('chart-competency-radar');
    if (!ctx) return;

    const labels = profile.competencies.map(c => c.name.split(' ').slice(0, 3).join(' '));
    const targetData = profile.competencies.map(c => c.benchmark);
    const selfData = profile.competencies.map(c => emp.ratings[c.id]?.self || 3.5);
    const supervisorData = profile.competencies.map(c => emp.ratings[c.id]?.supervisor || 3.5);
    const calibratedData = profile.competencies.map(c => emp.ratings[c.id]?.calibrated || 3.5);

    if (window.chartCompetencyRadarInstance) {
        window.chartCompetencyRadarInstance.data.labels = labels;
        window.chartCompetencyRadarInstance.data.datasets[0].data = targetData;
        window.chartCompetencyRadarInstance.data.datasets[1].data = selfData;
        window.chartCompetencyRadarInstance.data.datasets[2].data = supervisorData;
        window.chartCompetencyRadarInstance.data.datasets[3].data = calibratedData;
        window.chartCompetencyRadarInstance.update();
    } else {
        window.chartCompetencyRadarInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Role Target Standard',
                        data: targetData,
                        borderColor: '#C89B3C',
                        backgroundColor: 'rgba(200, 155, 60, 0.08)',
                        borderWidth: 2,
                        borderDash: [3, 3],
                        pointRadius: 2.5
                    },
                    {
                        label: 'Self-Assessment',
                        data: selfData,
                        borderColor: '#6B8FA3',
                        backgroundColor: 'rgba(107, 143, 163, 0.08)',
                        borderWidth: 1.5,
                        pointRadius: 2.5
                    },
                    {
                        label: 'Supervisor Evaluation',
                        data: supervisorData,
                        borderColor: '#7A9A7E',
                        backgroundColor: 'rgba(122, 154, 126, 0.12)',
                        borderWidth: 2,
                        pointRadius: 3
                    },
                    {
                        label: 'HR Calibrated Score',
                        data: calibratedData,
                        borderColor: '#9E1B20',
                        backgroundColor: 'rgba(158, 27, 32, 0.15)',
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointBackgroundColor: '#9E1B20'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, family: 'Inter' } } }
                },
                scales: {
                    r: {
                        min: 1,
                        max: 5,
                        ticks: { stepSize: 1, display: false },
                        pointLabels: { font: { size: 9, family: 'Inter', weight: '600' }, color: '#211A1A' },
                        grid: { color: '#E8DEDC' },
                        angleLines: { color: '#E8DEDC' }
                    }
                }
            }
        });
    }
}

// 3.14 Render Matrix Table
function renderCompetencyMatrixTable() {
    const tbody = document.getElementById('comp-matrix-tbody');
    if (!tbody) return;

    const associates = Object.values(associatesCompetencyData);

    tbody.innerHTML = associates.map(emp => {
        const profile = roleCompetencyProfiles[emp.roleProfileId] || roleCompetencyProfiles.front_office;
        const comps = profile.competencies;

        const cellsHtml = comps.slice(0, 4).map(c => {
            const r = emp.ratings[c.id]?.calibrated || 3.5;
            let badgeClass = 'badge-sage';
            if (r < 3.8) badgeClass = 'badge-terracotta';
            else if (r < 4.2) badgeClass = 'badge-gold';

            return `<td class="px-4 py-3.5 text-center"><span class="${badgeClass} font-bold">${r.toFixed(1)}</span></td>`;
        }).join('');

        let overallBadge = 'badge-sage';
        if (emp.overallCompetencyScore < 4.0) overallBadge = 'badge-terracotta';
        else if (emp.overallCompetencyScore < 4.4) overallBadge = 'badge-gold';

        const isSelected = emp.empId === activeCompetencyEmpKey;

        return `
            <tr class="hover:bg-[#FAF8F7] transition cursor-pointer ${isSelected ? 'bg-primary-50/40 font-semibold' : ''}" onclick="selectCompetencyAssociate('${emp.empId}')">
                <td class="px-4 py-3.5">
                    <div class="flex items-center space-x-2.5">
                        <div class="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-xs">
                            ${emp.avatar}
                        </div>
                        <div>
                            <p class="font-bold text-slate-900 text-xs">${emp.name}</p>
                            <p class="text-[10px] text-slate-500">${emp.role} · ${emp.dept}</p>
                        </div>
                    </div>
                </td>
                ${cellsHtml}
                <td class="px-4 py-3.5 text-center font-bold text-primary">
                    <span class="${overallBadge}">${emp.overallCompetencyScore.toFixed(2)}</span>
                </td>
                <td class="px-4 py-3.5 text-right">
                    <button onclick="event.stopPropagation(); launchAssessmentModalFor('${emp.empId}')" class="px-2.5 py-1 rounded-lg bg-white border border-[#E8DEDC] hover:border-primary hover:text-primary text-[11px] font-bold shadow-2xs transition">
                        Evaluate
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 3.15 Filter Matrix Candidates
function filterMatrixCandidates() {
    const filterDept = document.getElementById('matrix-filter-dept')?.value || 'all';
    const minRating = parseFloat(document.getElementById('matrix-filter-min')?.value || '0');

    const rows = document.querySelectorAll('#comp-matrix-tbody tr');
    const associates = Object.values(associatesCompetencyData);

    let matchCount = 0;
    associates.forEach((emp, idx) => {
        const matchesDept = (filterDept === 'all' || emp.deptCode === filterDept);
        const matchesScore = emp.overallCompetencyScore >= minRating;
        const row = rows[idx];
        if (row) {
            if (matchesDept && matchesScore) {
                row.style.display = '';
                matchCount++;
            } else {
                row.style.display = 'none';
            }
        }
    });

    const countEl = document.getElementById('matrix-match-count');
    if (countEl) countEl.innerText = `${matchCount} Suitable Associates Matched`;
}

// 3.16 Render Skills Gap Analysis
function renderSkillsGapAnalysis() {
    const emp = associatesCompetencyData[activeCompetencyEmpKey];
    const container = document.getElementById('comp-gaps-container');
    if (!container || !emp) return;

    const profile = roleCompetencyProfiles[emp.roleProfileId] || roleCompetencyProfiles.front_office;

    const gapsList = profile.competencies.map(c => {
        const rating = emp.ratings[c.id]?.calibrated || 3.5;
        const gap = +(rating - c.benchmark).toFixed(2);
        const gapPct = Math.round((rating / c.benchmark) * 100);

        let statusText = 'Competency Benchmark Met';
        let statusBadge = 'badge-sage';
        let barColor = 'bg-sage';
        let actionBtn = `<button onclick="showToast('Competency standard is fully verified for this dimension.', 'info')" class="text-xs font-bold text-sage-dark flex items-center space-x-1"><i class="fas fa-check-circle"></i><span>Standard Met</span></button>`;

        if (gap < -0.4) {
            statusText = `Critical Skill Gap: ${gap.toFixed(1)} Deficit`;
            statusBadge = 'badge-terracotta';
            barColor = 'bg-terracotta';
            actionBtn = `
                <button onclick="autoAddSkillGapToIDP('${c.id}', '${c.name}', '${c.recommendedCourse}')" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                    <i class="fas fa-plus"></i>
                    <span>+ Add to IDP & Assign LMS</span>
                </button>
            `;
        } else if (gap < 0) {
            statusText = `Minor Gap: ${gap.toFixed(1)}`;
            statusBadge = 'badge-gold';
            barColor = 'bg-gold';
            actionBtn = `
                <button onclick="autoAddSkillGapToIDP('${c.id}', '${c.name}', '${c.recommendedCourse}')" class="btn-secondary px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                    <i class="fas fa-plus"></i>
                    <span>+ Add IDP Goal</span>
                </button>
            `;
        }

        return `
            <div class="p-4 bg-white rounded-2xl border border-[#E8DEDC] space-y-3 shadow-2xs hover:border-slate-300 transition">
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <h4 class="font-heading font-bold text-sm text-slate-900">${c.name}</h4>
                        <p class="text-[11px] text-slate-500">${c.category} · Benchmark Standard: <strong>${c.benchmark.toFixed(1)} / 5.0</strong></p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-xs font-bold text-slate-800">Current: ${rating.toFixed(1)}</span>
                        <span class="${statusBadge}">${statusText}</span>
                    </div>
                </div>

                <div class="space-y-1">
                    <div class="flex justify-between text-[11px] font-semibold text-slate-500">
                        <span>Proficiency Fulfillment: ${gapPct}%</span>
                        <span>Gap Variance: ${gap >= 0 ? '+' : ''}${gap.toFixed(1)}</span>
                    </div>
                    <div class="w-full bg-[#FAF8F7] h-2.5 rounded-full overflow-hidden border border-[#E8DEDC] flex">
                        <div class="${barColor} h-2.5 transition-all duration-500" style="width: ${Math.min(100, gapPct)}%"></div>
                    </div>
                </div>

                <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-book-open text-primary text-xs"></i>
                        <span class="text-slate-700">Recommended Learning Intervention: <strong>${c.recommendedCourse}</strong></span>
                    </div>
                    <div>${actionBtn}</div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="space-y-4">
            <div class="p-4 bg-primary-50/50 rounded-2xl border border-primary-100 flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        <i class="fas fa-chart-line-up"></i>
                    </div>
                    <div>
                        <h4 class="font-heading font-bold text-sm text-slate-900">${emp.name} · Skills Gap Diagnostic</h4>
                        <p class="text-xs text-slate-600">Calculated against ${profile.roleTitle} benchmarks.</p>
                    </div>
                </div>
                <button onclick="autoGenerateCompleteIDP('${emp.empId}')" class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-1.5">
                    <i class="fas fa-wand-magic-sparkles"></i>
                    <span>✦ Auto-Generate 70-20-10 IDP</span>
                </button>
            </div>
            <div class="space-y-3">${gapsList}</div>
        </div>
    `;
}

// 3.17 Auto-Add Skill Gap into Associate's IDP
function autoAddSkillGapToIDP(compId, compName, recommendedCourse) {
    const emp = associatesCompetencyData[activeCompetencyEmpKey];
    if (!emp) return;

    const newIdpGoal = {
        id: 'idp_' + Date.now(),
        title: `Targeted Development: ${compName}`,
        category: '70% Experiential',
        competencyId: compId,
        competencyName: compName,
        assignedDate: new Date().toISOString().split('T')[0],
        targetDate: '2026-10-31',
        progress: 10,
        mentor: 'Elena Vance (HR Lead)',
        actionItems: [
            { task: `Complete assigned handbook: ${recommendedCourse}`, done: false },
            { task: 'Conduct 3 on-the-job floor practice observations with supervisor', done: false },
            { task: 'Complete post-training competency re-evaluation assessment', done: false }
        ]
    };

    emp.idpGoals.unshift(newIdpGoal);
    renderIDPView();
    showToast(`Added developmental goal for "${compName}" to ${emp.name}'s IDP!`, 'success');
}

// 3.18 Auto-Generate Complete IDP Plan
function autoGenerateCompleteIDP(empKey) {
    const emp = associatesCompetencyData[empKey];
    if (!emp) return;

    showToast(`Auto-generating 70-20-10 learning pathway for ${emp.name}...`, 'info');
    setTimeout(() => {
        autoAddSkillGapToIDP('comp_fo_3', 'Frontline Conflict De-escalation', 'Hospitality Crisis Diplomacy Module');
        switchSubTab('comp', 'development');
    }, 400);
}

// 3.19 Render IDP View
function renderIDPView() {
    const emp = associatesCompetencyData[activeCompetencyEmpKey];
    const container = document.getElementById('comp-idp-container');
    if (!container || !emp) return;

    if (!emp.idpGoals || emp.idpGoals.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-3">
                <i class="fas fa-route text-3xl text-slate-300"></i>
                <h4 class="font-heading font-bold text-slate-800 text-sm">No Active IDP Goals for ${emp.name}</h4>
                <p class="text-xs text-slate-500">Run a Skills Gap Analysis or click below to create an Individual Development Plan.</p>
                <button onclick="openModal('modal-create-idp')" class="btn-primary px-4 py-2 text-xs font-bold inline-flex items-center space-x-1.5">
                    <i class="fas fa-plus"></i>
                    <span>Create New IDP Goal</span>
                </button>
            </div>
        `;
        return;
    }

    const goalsHtml = emp.idpGoals.map(goal => {
        let catBadge = 'badge-primary';
        if (goal.category.includes('70%')) catBadge = 'badge-primary';
        if (goal.category.includes('20%')) catBadge = 'badge-sage';
        if (goal.category.includes('10%')) catBadge = 'badge-dusty';

        const tasksHtml = goal.actionItems.map((item, taskIdx) => `
            <label class="flex items-center space-x-3 p-2.5 bg-white rounded-xl border border-[#E8DEDC] hover:bg-primary-50/20 cursor-pointer transition text-xs">
                <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleIdpTask('${goal.id}', ${taskIdx})" class="accent-[#9E1B20] w-4 h-4 rounded">
                <span class="${item.done ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-semibold'}">${item.task}</span>
            </label>
        `).join('');

        return `
            <div class="p-5 bg-white rounded-2xl border border-[#E8DEDC] space-y-3.5 shadow-2xs">
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <div class="flex items-center space-x-2">
                            <span class="${catBadge}">${goal.category}</span>
                            <span class="text-[10px] text-slate-400">Target: ${goal.targetDate}</span>
                        </div>
                        <h4 class="font-heading font-bold text-sm text-slate-900 mt-1">${goal.title}</h4>
                        <p class="text-[11px] text-slate-500">Linked Dimension: <strong>${goal.competencyName}</strong> · Mentor: ${goal.mentor}</p>
                    </div>
                    <div class="text-right">
                        <span class="font-heading font-bold text-sm text-primary">${goal.progress}% Complete</span>
                        <div class="w-28 bg-[#FAF8F7] h-2 rounded-full overflow-hidden border border-[#E8DEDC] mt-1">
                            <div class="bg-primary h-2 rounded-full transition-all duration-300" style="width: ${goal.progress}%"></div>
                        </div>
                    </div>
                </div>

                <div class="space-y-1.5 pt-1">
                    <p class="text-[11px] font-bold text-slate-700">Action Milestones:</p>
                    <div class="space-y-1.5">${tasksHtml}</div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900">${emp.name}'s 70-20-10 Individual Development Plan</h3>
                    <p class="text-xs text-slate-500">Targeted experiential, social coaching, and formal LMS milestones.</p>
                </div>
                <button onclick="openModal('modal-create-idp')" class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-1.5">
                    <i class="fas fa-plus"></i>
                    <span>+ Add IDP Milestone</span>
                </button>
            </div>
            <div class="space-y-3.5">${goalsHtml}</div>
        </div>
    `;
}

// 3.20 Toggle IDP Action Task Status
function toggleIdpTask(goalId, taskIdx) {
    const emp = associatesCompetencyData[activeCompetencyEmpKey];
    if (!emp) return;

    const goal = emp.idpGoals.find(g => g.id === goalId);
    if (goal && goal.actionItems[taskIdx]) {
        goal.actionItems[taskIdx].done = !goal.actionItems[taskIdx].done;
        const total = goal.actionItems.length;
        const completed = goal.actionItems.filter(t => t.done).length;
        goal.progress = Math.round((completed / total) * 100);

        renderIDPView();
        showToast(`Updated IDP progress to ${goal.progress}%`, 'success');
    }
}

// 3.21 Render Certifications Roster
function renderCertificationsRoster() {
    const emp = associatesCompetencyData[activeCompetencyEmpKey];
    const container = document.getElementById('comp-certs-container');
    if (!container || !emp) return;

    const certsHtml = emp.certifications.map(c => {
        let statusBadge = 'badge-sage';
        if (c.status === 'Expiring Soon') statusBadge = 'badge-gold';
        if (c.status === 'Expired') statusBadge = 'badge-terracotta';

        return `
            <div class="p-4 bg-white rounded-2xl border border-[#E8DEDC] flex items-center justify-between flex-wrap gap-3 shadow-2xs hover:border-slate-300 transition">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl bg-gold-50 text-gold-dark border border-gold-100 flex items-center justify-center text-base font-bold shadow-2xs">
                        <i class="fas fa-award"></i>
                    </div>
                    <div>
                        <div class="flex items-center space-x-2">
                            <h4 class="font-heading font-bold text-sm text-slate-900">${c.name}</h4>
                            <span class="${statusBadge}">${c.status}</span>
                        </div>
                        <p class="text-xs text-slate-500">Issuer: ${c.issuer} · Reg No: <code class="font-mono text-slate-700">${c.certNo}</code></p>
                        <p class="text-[11px] text-slate-400">Valid: ${c.issuedDate} &rarr; <strong>Expires: ${c.expiryDate}</strong> · Dimension: ${c.linkedCompetency}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="showToast('Verifying digital certificate validity with issuer database...', 'info')" class="px-3 py-1.5 rounded-xl border border-[#E8DEDC] hover:bg-slate-50 text-xs font-semibold text-slate-700 transition">
                        Verify Digital ID
                    </button>
                    ${c.status !== 'Active' ? `
                        <button onclick="showToast('Sent certification renewal reminder and scheduled refresher LMS course.', 'success')" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1">
                            <i class="fas fa-bell"></i>
                            <span>Renew Credential</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900">${emp.name}'s Verified Qualifications &amp; Licensures</h3>
                    <p class="text-xs text-slate-500">Official registry tracking expiration alerts and recertification cycles.</p>
                </div>
                <button onclick="openModal('modal-add-certificate')" class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-1.5">
                    <i class="fas fa-plus"></i>
                    <span>+ Record New Certificate</span>
                </button>
            </div>
            <div class="space-y-3">${certsHtml.length > 0 ? certsHtml : '<p class="text-xs text-slate-400 italic p-4 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC]">No active credentials logged. Click "+ Record New Certificate" to add.</p>'}</div>
        </div>
    `;
}

// 3.22 Render Performance Integration Summary
function renderPerformanceIntegrationSummary() {
    const emp = associatesCompetencyData[activeCompetencyEmpKey];
    const container = document.getElementById('comp-perf-integration-container');
    if (!container || !emp) return;

    const compScore = emp.overallCompetencyScore;
    const goalScore = 4.60;
    const compositeAppraisal = (compScore * 0.40) + (goalScore * 0.60);

    container.innerHTML = `
        <div class="p-6 bg-white rounded-3xl border border-[#E8DEDC] space-y-5 shadow-xs">
            <div class="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <span class="badge-primary">Q3 Performance Appraisal Integration</span>
                    <h3 class="font-heading font-bold text-lg text-slate-900 mt-1">${emp.name} · Composite Merit Rating</h3>
                </div>
                <div class="text-right">
                    <span class="text-xs text-slate-400 block font-medium">Overall Composite Score</span>
                    <span class="font-heading font-bold text-2xl text-primary">${compositeAppraisal.toFixed(2)} / 5.0</span>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2">
                    <div class="flex justify-between font-bold text-xs text-slate-800">
                        <span>1. Competency Behavioral Score (40% Weight)</span>
                        <span class="text-primary">${compScore.toFixed(2)} / 5.0</span>
                    </div>
                    <div class="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E8DEDC]">
                        <div class="bg-primary h-2" style="width: ${(compScore / 5.0) * 100}%"></div>
                    </div>
                    <p class="text-[11px] text-slate-500">Evaluated across 5 functional dimensions by Supervisor &amp; HR Calibration.</p>
                </div>

                <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2">
                    <div class="flex justify-between font-bold text-xs text-slate-800">
                        <span>2. SMART Operational Goals (60% Weight)</span>
                        <span class="text-sage-dark">${goalScore.toFixed(2)} / 5.0</span>
                    </div>
                    <div class="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E8DEDC]">
                        <div class="bg-sage h-2" style="width: ${(goalScore / 5.0) * 100}%"></div>
                    </div>
                    <p class="text-[11px] text-slate-500">Measured against VIP NPS Index &ge; +92, Upsell Conversion, and Audit Pass.</p>
                </div>
            </div>

            <div class="p-4 bg-sage-50/70 rounded-2xl border border-sage-100 flex items-center justify-between flex-wrap gap-2 text-xs text-sage-dark font-medium">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-check-circle text-sage text-base"></i>
                    <span>Competency assessment is synchronized with <strong>Phase 4 &amp; 5 Formal Appraisal</strong>.</span>
                </div>
                <button onclick="showToast('Synchronized live competency records with Q3 appraisal sheet.', 'success')" class="btn-primary px-4 py-2 text-xs font-bold">
                    Sync to Q3 Appraisal Matrix
                </button>
            </div>
        </div>
    `;
}

// 3.23 Render Competency Analytics Dashboard
function renderCompetencyAnalyticsDashboard() {
    const container = document.getElementById('comp-analytics-container');
    if (!container) return;

    container.innerHTML = `
        <div class="space-y-6">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="p-5 bg-white rounded-2xl border border-[#E8DEDC] space-y-1 shadow-2xs">
                    <span class="text-slate-400 text-xs font-medium">Property Competency Index</span>
                    <h3 class="font-heading font-bold text-2xl text-slate-900">4.42 <span class="text-xs text-sage-dark font-bold">+0.18 Q3</span></h3>
                    <p class="text-[11px] text-slate-500">Across 100 Associates</p>
                </div>
                <div class="p-5 bg-white rounded-2xl border border-[#E8DEDC] space-y-1 shadow-2xs">
                    <span class="text-slate-400 text-xs font-medium">Benchmark Compliance</span>
                    <h3 class="font-heading font-bold text-2xl text-sage-dark">92.4%</h3>
                    <p class="text-[11px] text-slate-500">Met / Exceeded Target</p>
                </div>
                <div class="p-5 bg-white rounded-2xl border border-[#E8DEDC] space-y-1 shadow-2xs">
                    <span class="text-slate-400 text-xs font-medium">Active IDP Plans</span>
                    <h3 class="font-heading font-bold text-2xl text-primary">28 Enrolled</h3>
                    <p class="text-[11px] text-slate-500">74% Average Completion</p>
                </div>
                <div class="p-5 bg-white rounded-2xl border border-[#E8DEDC] space-y-1 shadow-2xs">
                    <span class="text-slate-400 text-xs font-medium">License Compliance</span>
                    <h3 class="font-heading font-bold text-2xl text-gold-dark">98.5%</h3>
                    <p class="text-[11px] text-slate-500">2 Expirations Pending</p>
                </div>
            </div>

            <div class="p-4 bg-white rounded-2xl border border-[#E8DEDC] flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-file-shield text-primary"></i>
                    <span class="text-xs font-bold text-slate-900">Official Oxford Suites Competency &amp; TNA Audit Dossier</span>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="exportCompetencyReportCSV()" class="btn-secondary px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                        <i class="fas fa-file-csv text-primary"></i>
                        <span>Export CSV Matrix</span>
                    </button>
                    <button onclick="window.print()" class="btn-primary px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                        <i class="fas fa-print"></i>
                        <span>Print Audit Dossier</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ========================================================
// 4. MODALS & BATCH ACTIONS
// ========================================================

// 4.1 Launch Assessment Modal For Specific Employee
function launchAssessmentModalFor(empKey) {
    const emp = associatesCompetencyData[empKey] || associatesCompetencyData.maria_santos;
    activeCompetencyEmpKey = emp.empId;

    const modal = document.getElementById('modal-conduct-assessment');
    if (!modal) return;

    document.getElementById('assess-modal-emp-name').innerText = emp.name;
    document.getElementById('assess-modal-emp-role').innerText = `${emp.role} · ${emp.dept}`;

    const profile = roleCompetencyProfiles[emp.roleProfileId] || roleCompetencyProfiles.front_office;
    const formFieldsContainer = document.getElementById('assess-modal-fields');

    if (formFieldsContainer) {
        formFieldsContainer.innerHTML = profile.competencies.map((c, idx) => {
            const current = emp.ratings[c.id]?.supervisor || 4.0;
            return `
                <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-2">
                    <div class="flex justify-between items-center text-xs font-bold">
                        <span class="text-slate-900">${idx + 1}. ${c.name}</span>
                        <span class="text-primary font-bold text-xs" id="assess-score-val-${c.id}">${current.toFixed(1)} / 5.0</span>
                    </div>
                    <p class="text-[11px] text-slate-500">${c.description}</p>
                    <div class="space-y-1 pt-1">
                        <input type="range" min="1.0" max="5.0" step="0.1" value="${current}" 
                            id="assess-slider-${c.id}" 
                            oninput="document.getElementById('assess-score-val-${c.id}').innerText = parseFloat(this.value).toFixed(1) + ' / 5.0'"
                            class="w-full accent-[#9E1B20] cursor-pointer">
                        <div class="flex justify-between text-[9px] text-slate-400 font-semibold px-0.5">
                            <span>1.0 Below</span>
                            <span>2.0 Dev</span>
                            <span>3.0 Proficient</span>
                            <span>4.0 Advanced</span>
                            <span>5.0 Master</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    openModal('modal-conduct-assessment');
}

// 4.2 Save Conducted Assessment
function handleAssessmentSubmit(e) {
    e.preventDefault();
    const emp = associatesCompetencyData[activeCompetencyEmpKey];
    if (!emp) return;

    const profile = roleCompetencyProfiles[emp.roleProfileId] || roleCompetencyProfiles.front_office;
    let sum = 0;

    profile.competencies.forEach(c => {
        const slider = document.getElementById(`assess-slider-${c.id}`);
        if (slider) {
            const val = parseFloat(slider.value);
            emp.ratings[c.id] = emp.ratings[c.id] || {};
            emp.ratings[c.id].supervisor = val;
            emp.ratings[c.id].calibrated = val;
            sum += val;
        }
    });

    emp.overallCompetencyScore = +(sum / profile.competencies.length).toFixed(2);
    emp.competencyGap = +(emp.overallCompetencyScore - emp.targetBenchmarkScore).toFixed(2);
    emp.lastAssessmentDate = new Date().toISOString().split('T')[0];

    emp.assessmentHistory.unshift({
        date: emp.lastAssessmentDate,
        type: 'Manager Periodic Assessment',
        rater: 'Chef Marco / Elena Vance',
        score: emp.overallCompetencyScore,
        notes: document.getElementById('assess-modal-notes')?.value || 'Calibrated official competency review.'
    });

    closeModal('modal-conduct-assessment');
    initCompetencyModule();
    showToast(`Successfully saved and calibrated competency assessment for ${emp.name}! (Score: ${emp.overallCompetencyScore})`, 'success');
}

// 4.3 Add New IDP Goal
function handleCreateIdpSubmit(e) {
    e.preventDefault();
    const emp = associatesCompetencyData[activeCompetencyEmpKey];
    if (!emp) return;

    const title = document.getElementById('idp-form-title').value;
    const category = document.getElementById('idp-form-category').value;
    const compName = document.getElementById('idp-form-comp').value;
    const mentor = document.getElementById('idp-form-mentor').value;
    const targetDate = document.getElementById('idp-form-date').value;
    const task1 = document.getElementById('idp-form-task-1').value;
    const task2 = document.getElementById('idp-form-task-2').value;

    const newGoal = {
        id: 'idp_' + Date.now(),
        title: title,
        category: category,
        competencyId: 'custom',
        competencyName: compName,
        assignedDate: new Date().toISOString().split('T')[0],
        targetDate: targetDate,
        progress: 0,
        mentor: mentor,
        actionItems: [
            { task: task1, done: false },
            { task: task2, done: false }
        ]
    };

    emp.idpGoals.unshift(newGoal);
    closeModal('modal-create-idp');
    renderIDPView();
    showToast(`New IDP Milestone "${title}" created for ${emp.name}!`, 'success');
}

// 4.4 Add New Certificate
function handleAddCertificateSubmit(e) {
    e.preventDefault();
    const emp = associatesCompetencyData[activeCompetencyEmpKey];
    if (!emp) return;

    const name = document.getElementById('cert-form-name').value;
    const issuer = document.getElementById('cert-form-issuer').value;
    const certNo = document.getElementById('cert-form-no').value;
    const issueDate = document.getElementById('cert-form-issue').value;
    const expiryDate = document.getElementById('cert-form-expiry').value;
    const linkedComp = document.getElementById('cert-form-comp').value;

    const now = new Date();
    const exp = new Date(expiryDate);
    let status = 'Active';
    if (exp < now) status = 'Expired';
    else if ((exp - now) / (1000 * 60 * 60 * 24) < 60) status = 'Expiring Soon';

    const newCert = {
        id: 'cert_' + Date.now(),
        name: name,
        issuer: issuer,
        issuedDate: issueDate,
        expiryDate: expiryDate,
        certNo: certNo || 'OSM-REG-' + Math.floor(10000 + Math.random() * 90000),
        status: status,
        linkedCompetency: linkedComp
    };

    emp.certifications.unshift(newCert);
    closeModal('modal-add-certificate');
    renderCertificationsRoster();
    showToast(`Recorded qualification "${name}" for ${emp.name}!`, 'success');
}

// 4.5 Open Batch Team Assessment Modal
function openBatchEvaluationModal() {
    const tbody = document.getElementById('batch-eval-table-tbody');
    if (!tbody) return;

    tbody.innerHTML = Object.values(associatesCompetencyData).map((emp, idx) => `
        <tr class="hover:bg-[#FAF8F7] transition">
            <td class="px-4 py-3">
                <div class="flex items-center space-x-2">
                    <span class="w-6 h-6 rounded-full bg-primary text-white font-bold text-[10px] flex items-center justify-center">${emp.avatar}</span>
                    <div>
                        <p class="font-bold text-slate-900 text-xs">${emp.name}</p>
                        <p class="text-[10px] text-slate-500">${emp.role}</p>
                    </div>
                </div>
            </td>
            <td class="px-4 py-3 text-center font-bold text-xs text-slate-800">${emp.overallCompetencyScore.toFixed(2)}</td>
            <td class="px-4 py-3 text-center">
                <input type="number" step="0.1" min="1.0" max="5.0" value="${emp.overallCompetencyScore.toFixed(1)}" id="batch-score-${emp.empId}" class="w-16 p-1.5 text-center font-bold rounded-lg border border-[#E8DEDC] bg-white text-xs text-primary focus:ring-1 focus:ring-primary">
            </td>
            <td class="px-4 py-3 text-center">
                <select id="batch-status-${emp.empId}" class="p-1 rounded-lg border border-[#E8DEDC] text-[11px] font-semibold">
                    <option value="Approved" selected>Approve Rating</option>
                    <option value="Needs TNA">Flag for TNA</option>
                    <option value="Promote">Ready for Promotion</option>
                </select>
            </td>
        </tr>
    `).join('');

    openModal('modal-batch-evaluation');
}

// 4.6 Save Batch Team Assessment
function saveBatchEvaluation(e) {
    if (e) e.preventDefault();
    Object.values(associatesCompetencyData).forEach(emp => {
        const input = document.getElementById(`batch-score-${emp.empId}`);
        if (input) {
            const val = parseFloat(input.value);
            if (!isNaN(val)) {
                emp.overallCompetencyScore = val;
                emp.competencyGap = +(emp.overallCompetencyScore - emp.targetBenchmarkScore).toFixed(2);
            }
        }
    });

    closeModal('modal-batch-evaluation');
    initCompetencyModule();
    showToast('Saved and synchronized batch team competency ratings across all 10 associates!', 'success');
}

// 4.7 Export CSV Matrix
function exportCompetencyReportCSV() {
    let csv = 'Associate Name,Department,Role,Overall Score,Target Benchmark,Gap Status,Top Strength,Critical Gap\n';
    Object.values(associatesCompetencyData).forEach(emp => {
        csv += `"${emp.name}","${emp.dept}","${emp.role}",${emp.overallCompetencyScore},${emp.targetBenchmarkScore},"${emp.status}","${emp.topStrength}","${emp.criticalGap}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Oxford_Suites_Competency_Matrix_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Oxford Suites Competency Matrix to CSV!', 'success');
}

// Auto-run on load
window.addEventListener('DOMContentLoaded', () => {
    initCompetencyModule();
});
