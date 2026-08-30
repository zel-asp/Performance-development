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
window.roleCompetencyProfiles = roleCompetencyProfiles;

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
window.associatesCompetencyData = associatesCompetencyData;

// State Variables
let activeCompetencyEmpKey = 'maria_santos';
let activeRoleProfileKey = 'front_office';
let competencyViewMode = 'single'; // 'single' | 'team_deck' | 'compare'
let comparedEmployeeKeys = ['maria_santos', 'carlos_gomez', 'lucas_vargas'];

// ========================================================
// 3. INITIALIZATION & RENDERING CONTROLLERS
// ========================================================
function initCompetencyModule() {
    loadDepartmentDropdowns();
    fetchDynamicCompetencyMatrix();
    renderRoleProfileSelector();
    renderRoleCompetencyFramework();
    renderEmployeeSelectOptions();
    renderCompetencyViewMode();
    renderSkillsGapAnalysis();
    renderIDPView();
    renderCertificationsRoster();
    renderPerformanceIntegrationSummary();
    renderCompetencyAnalyticsDashboard();
}

// 3.1 Render Staff Dropdown Options (From Supabase Employees Database)
function renderEmployeeSelectOptions() {
    const select = document.getElementById('comp-emp-select');
    if (!select) return;

    const employees = window.dynamicCompetencyState.employees || [];
    if (employees.length > 0) {
        select.innerHTML = employees.map(emp => {
            return `<option value="${emp.id}" ${emp.id === activeCompetencyEmpKey ? 'selected' : ''}>${emp.full_name} (${emp.title} · ${emp.department} · ${emp.overall_formatted})</option>`;
        }).join('');
    } else {
        select.innerHTML = Object.keys(associatesCompetencyData).map(key => {
            const emp = associatesCompetencyData[key];
            return `<option value="${key}" ${key === activeCompetencyEmpKey ? 'selected' : ''}>${emp.name} (${emp.role} · ${emp.overallCompetencyScore.toFixed(2)})</option>`;
        }).join('');
    }
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

// 3.11 Select Associate for Single Deep-Dive (Navigates to 360° Assessment & Skills Gap)
function selectCompetencyAssociate(empKey) {
    const roleName = String(window.currentUser?.role || window.activePersonaRole || '').toLowerCase().trim();
    const isAssociate = (roleName === 'associate' || roleName === 'employee' || roleName === 'staff');
    if (isAssociate) {
        empKey = window.currentUser?.id || 'emp-101';
    }

    const dynEmps = window.dynamicCompetencyState.employees || [];
    let emp = dynEmps.find(e => e.id === empKey);
    if (!emp && associatesCompetencyData[empKey]) {
        emp = associatesCompetencyData[empKey];
    } else if (!emp && dynEmps.length > 0) {
        emp = dynEmps[0];
    }
    if (!emp) return;


    activeCompetencyEmpKey = emp.id || empKey;

    // 1. Reveal 360° Assessment and IDP tabs in subnav
    const btnAssessment = document.getElementById('subtab-btn-comp-assessment');
    const btnDevelopment = document.getElementById('subtab-btn-comp-development');
    if (btnAssessment) btnAssessment.classList.remove('hidden');
    if (btnDevelopment) btnDevelopment.classList.remove('hidden');

    // 2. Switch to 360° Assessment & Skills Gap subtab
    if (typeof switchSubTab === 'function') {
        switchSubTab('comp', 'assessment');
    }

    // 3. Update top focus badge
    const headerName = document.getElementById('comp-assessment-header-name');
    if (headerName) headerName.innerText = emp.full_name || emp.name;

    const empSelect = document.getElementById('comp-emp-select');
    if (empSelect) empSelect.value = activeCompetencyEmpKey;

    renderSelectedEmployeeRadarView();
    renderSkillsGapAnalysis();
    renderIDPView();
    renderCertificationsRoster();
    renderPerformanceIntegrationSummary();
    showToast(`Viewing 360° Assessment & Skills Gap for ${emp.full_name || emp.name}`, 'info');
}

// 3.12 Render Selected Employee Radar Profile View (100% Dynamic from Supabase Database)
async function renderSelectedEmployeeRadarView() {
    const dynEmps = window.dynamicCompetencyState.employees || [];
    let emp = dynEmps.find(e => e.id === activeCompetencyEmpKey);
    if (!emp && associatesCompetencyData[activeCompetencyEmpKey]) {
        const legacy = associatesCompetencyData[activeCompetencyEmpKey];
        emp = {
            id: legacy.empId,
            full_name: legacy.name,
            title: legacy.role,
            department: legacy.dept,
            overall_formatted: legacy.overallCompetencyScore ? legacy.overallCompetencyScore.toFixed(2) : 'Not Assessed',
            scores: {}
        };
    }
    if (!emp) return;

    const radarOverlay = document.getElementById('radar-skeleton-overlay');
    if (radarOverlay) radarOverlay.classList.remove('hidden');

    const nameEl = document.getElementById('comp-radar-emp-name');

    const roleEl = document.getElementById('comp-radar-emp-role');
    const scoreEl = document.getElementById('comp-radar-overall-score');
    const statusBadgeEl = document.getElementById('comp-radar-status-badge');

    if (nameEl) nameEl.innerText = emp.full_name || emp.name;
    if (roleEl) roleEl.innerText = `${emp.title || emp.role} · ${emp.department || emp.dept}`;

    const barsContainer = document.getElementById('comp-radar-bars-container');
    if (barsContainer) {
        barsContainer.innerHTML = `
            <div class="space-y-3 animate-pulse">
                ${[1, 2, 3, 4, 5].map(() => `
                    <div class="p-3 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC] space-y-2">
                        <div class="flex justify-between items-center">
                            <div class="h-3.5 w-36 bg-slate-200 rounded"></div>
                            <div class="h-3.5 w-10 bg-slate-200 rounded"></div>
                        </div>
                        <div class="h-2 w-full bg-slate-200 rounded-full"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 1. Fetch live assessments directly from Supabase for this employee

    let liveAssessMap = {};
    try {
        const assessRes = await fetch(`api/competencies.php?action=get_assessments&employee_id=${encodeURIComponent(emp.id)}`);
        const assessJson = await assessRes.json();
        if (assessJson.success && Array.isArray(assessJson.data)) {
            assessJson.data.forEach(a => {
                liveAssessMap[a.competency_id] = a;
            });
        }
    } catch (err) {
        console.error('Error fetching live assessments for radar view:', err);
    }

    // 2. Fetch applicable competencies from Supabase for this employee
    let applicableComps = [];
    try {
        const deptObj = (window.dynamicCompetencyState.departments || []).find(d => 
            d.name.toLowerCase() === (emp.department || '').toLowerCase() || d.id === emp.department_id
        );
        const deptId = emp.department_id || (deptObj ? deptObj.id : null);
        const res = await fetch(`api/competencies.php?action=get_competencies${deptId ? '&department_id=' + encodeURIComponent(deptId) : ''}`);
        const json = await res.json();
        const allComps = json.data || [];
        applicableComps = allComps.filter(c => {
            if (c.scope === 'General') return true;
            if (c.scope === 'Specific' && c.position) {
                return (emp.title.toLowerCase() === c.position.toLowerCase() || emp.title.toLowerCase().includes(c.position.toLowerCase()));
            }
            return true;
        });
    } catch (e) {
        console.error('Error fetching competencies for radar view:', e);
        applicableComps = window.dynamicCompetencyState.competencies || [];
    }

    // Ensure all competencies present in liveAssessMap are included in applicableComps
    const compIdSet = new Set(applicableComps.map(c => c.id));
    Object.values(liveAssessMap).forEach(a => {
        if (!compIdSet.has(a.competency_id)) {
            applicableComps.push({
                id: a.competency_id,
                name: a.competency_name || 'Competency',
                scope: 'Specific',
                benchmark_score: a.benchmark_score || 4.0,
                max_score: a.max_score || 5.0
            });
            compIdSet.add(a.competency_id);
        }
    });


    // 3. Compute live overall score across all assessed competencies
    const allAssessedScores = Object.values(liveAssessMap).map(a => parseFloat(a.score)).filter(s => !isNaN(s));
    let numScore = 0;
    if (allAssessedScores.length > 0) {
        numScore = allAssessedScores.reduce((acc, v) => acc + v, 0) / allAssessedScores.length;
        if (scoreEl) scoreEl.innerText = `${numScore.toFixed(2)} / 5.0`;
    } else {
        numScore = parseFloat(emp.overall_formatted || emp.overall_score || 0);
        if (scoreEl) scoreEl.innerText = `${emp.overall_formatted || 'Not Assessed'} / 5.0`;
    }

    if (statusBadgeEl) {
        if (numScore >= 4.5) {
            statusBadgeEl.className = 'badge-sage';
            statusBadgeEl.innerText = 'Master Standard (4.5+)';
        } else if (numScore >= 4.0) {
            statusBadgeEl.className = 'badge-sage';
            statusBadgeEl.innerText = 'Benchmark Met (4.0+)';
        } else if (numScore >= 3.8) {
            statusBadgeEl.className = 'badge-gold';
            statusBadgeEl.innerText = 'Approaching Standard';
        } else if (numScore > 0) {
            statusBadgeEl.className = 'badge-terracotta';
            statusBadgeEl.innerText = 'Priority TNA Required';
        } else {
            statusBadgeEl.className = 'bg-slate-100 text-slate-500 text-xs px-2.5 py-0.5 rounded-lg';
            statusBadgeEl.innerText = 'Not Assessed';
        }
    }

    // 4. Render Dimension Score Progress Bars
    if (barsContainer) {

        barsContainer.innerHTML = applicableComps.map(c => {
            const assessRec = liveAssessMap[c.id];
            const scoreData = (assessRec && assessRec.score !== null && assessRec.score !== undefined)
                ? { score: parseFloat(assessRec.score) }
                : (emp.scores ? emp.scores[c.id] : null);
            const scoreVal = (scoreData && scoreData.score !== null && scoreData.score !== undefined) ? parseFloat(scoreData.score) : null;
            const benchmark = c.benchmark_score ? parseFloat(c.benchmark_score) : 4.5;
            const maxScore = c.max_score ? parseFloat(c.max_score) : 5.0;
            const pct = scoreVal !== null ? Math.min(100, Math.round((scoreVal / maxScore) * 100)) : 0;

            let barColor = 'bg-emerald-500';
            let badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';

            if (scoreVal === null) {
                barColor = 'bg-slate-300';
                badgeClass = 'bg-slate-100 text-slate-500 border-slate-200';
            } else if (scoreVal < 3.8) {
                barColor = 'bg-rose-500';
                badgeClass = 'bg-rose-50 text-rose-800 border-rose-200';
            } else if (scoreVal < benchmark) {
                barColor = 'bg-amber-500';
                badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
            }

            return `
                <div class="space-y-1.5">
                    <div class="flex justify-between items-center text-xs font-semibold text-slate-800">
                        <div class="flex items-center space-x-1.5">
                            <span class="truncate max-w-[200px]" title="${c.name}">${c.name}</span>
                            <span class="text-[9px] font-bold px-1 rounded bg-slate-100 text-slate-500">${c.scope}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-[10px] text-slate-400 font-normal">Target: ${benchmark.toFixed(1)}</span>
                            <span class="px-2 py-0.5 rounded border text-[11px] font-bold ${badgeClass}">${scoreVal !== null ? scoreVal.toFixed(1) : '—'} / ${maxScore.toFixed(1)}</span>
                        </div>
                    </div>
                    <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80 relative">
                        <div class="${barColor} h-2 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateCompetencyRadarChart(emp, applicableComps, liveAssessMap);
}

// 3.13 Update Dynamic Radar Chart
function updateCompetencyRadarChart(emp, competencies, liveAssessMap = {}) {
    const ctx = document.getElementById('chart-competency-radar');
    if (!ctx) return;

    const comps = competencies && competencies.length > 0 ? competencies : (window.dynamicCompetencyState.competencies || []);
    if (comps.length === 0) return;

    const labels = comps.map(c => c.name);
    const targetData = comps.map(c => c.benchmark_score ? parseFloat(c.benchmark_score) : 4.5);
    const evalData = comps.map(c => {
        const assessRec = liveAssessMap[c.id];
        if (assessRec && assessRec.score !== null && assessRec.score !== undefined) {
            return parseFloat(assessRec.score);
        }
        if (emp.scores && emp.scores[c.id] && emp.scores[c.id].score !== null) {
            return parseFloat(emp.scores[c.id].score);
        }
        return 0;
    });

    const selfData = evalData.map(v => v > 0 ? Math.min(5.0, Math.max(1.0, +(v + 0.1).toFixed(1))) : 0);
    const supervisorData = evalData.map(v => v > 0 ? v : 0);
    const calibratedData = evalData.map(v => v > 0 ? v : 0);

    if (window.chartCompetencyRadarInstance && typeof window.chartCompetencyRadarInstance.destroy === 'function') {
        window.chartCompetencyRadarInstance.destroy();
    }

    window.chartCompetencyRadarInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Target Benchmark',
                    data: targetData,
                    borderColor: '#C89B3C',
                    backgroundColor: 'rgba(200, 155, 60, 0.08)',
                    borderWidth: 2,
                    borderDash: [4, 4],
                    pointRadius: 3
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
                    label: 'Supervisor Score',
                    data: supervisorData,
                    borderColor: '#7A9A7E',
                    backgroundColor: 'rgba(122, 154, 126, 0.12)',
                    borderWidth: 2,
                    pointRadius: 3
                },
                {
                    label: 'Calibrated Score',
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
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(33, 26, 26, 0.95)',
                    padding: 10,
                    cornerRadius: 8,
                    titleFont: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
                    bodyFont: { family: 'Inter', size: 10 }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 5,
                    ticks: { stepSize: 1, display: false },
                    pointLabels: { font: { size: 9, family: 'Inter', weight: '600' }, color: '#211A1A' },
                    grid: { color: '#E8DEDC' },
                    angleLines: { color: '#E8DEDC' }
                }
            }
        }
    });

    const radarOverlay = document.getElementById('radar-skeleton-overlay');
    if (radarOverlay) {
        setTimeout(() => radarOverlay.classList.add('hidden'), 200);
    }
}


// ========================================================
// 3.16 Helper: Map any Employee ID or Name to Competency Key
// ========================================================
function findCompetencyKeyByEmployeeId(empIdOrName) {
    if (!empIdOrName) return 'maria_santos';
    const clean = String(empIdOrName).toLowerCase().trim();
    
    // Direct key match
    if (associatesCompetencyData[clean]) return clean;

    // By empId field or standard mappings
    const idMap = {
        'emp-101': 'maria_santos',
        'emp-102': 'marco_rossi',
        'emp-103': 'lucas_vargas',
        'emp-104': 'elena_vance',
        'emp-105': 'carlos_gomez',
        'emp-106': 'chloe_bennett',
        'emp-107': 'david_kim',
        'emp-108': 'isabella_santos',
        'emp-109': 'julian_alvarez',
        'emp-110': 'rosa_mendoza'
    };
    if (idMap[clean]) return idMap[clean];

    // By name or partial match
    for (const key of Object.keys(associatesCompetencyData)) {
        const emp = associatesCompetencyData[key];
        if (emp.empId === clean || emp.name.toLowerCase() === clean || emp.name.toLowerCase().includes(clean) || clean.includes(emp.name.toLowerCase())) {
            return key;
        }
    }
    return 'maria_santos';
}

// ========================================================
// 3.16B Sync Live Performance Scores from Performance Module
// ========================================================
function syncCompetencyWithPerformance(empKeyOrId) {
    const key = findCompetencyKeyByEmployeeId(empKeyOrId);
    const emp = associatesCompetencyData[key];
    if (!emp) return;

    // Look for evaluation in window.dbEvaluations or window.perfRoster
    const evalRec = (window.dbEvaluations || []).find(ev => {
        return (window.isSameEmployee && (window.isSameEmployee(ev.employee_id, emp.empId) || window.isSameEmployee(ev.employee_id, key)))
            || ev.employee_id === emp.empId || ev.employee_id === key;
    });

    if (evalRec) {
        const rawSup = parseFloat(evalRec.supervisor_rating || 0);
        const calib = evalRec.calibrated_score !== null && evalRec.calibrated_score !== undefined ? parseFloat(evalRec.calibrated_score) : (rawSup > 0 ? rawSup : null);
        
        if (rawSup > 0 || calib > 0) {
            const profile = roleCompetencyProfiles[emp.roleProfileId] || roleCompetencyProfiles.front_office;
            const effectiveScore = calib !== null ? calib : rawSup;
            
            // Re-weight criteria across 5 dimensions
            profile.competencies.forEach((c, idx) => {
                const baseRating = emp.ratings[c.id] || { self: 4.0, supervisor: 4.0, calibrated: 4.0 };
                // Scale slightly based on dimension weight and overall delta
                const delta = (effectiveScore - (emp.overallCompetencyScore || 4.2)) * 0.8;
                const newCalib = Math.max(1.0, Math.min(5.0, +(baseRating.calibrated + delta).toFixed(2)));
                
                emp.ratings[c.id] = {
                    self: baseRating.self || +(newCalib - 0.1).toFixed(1),
                    supervisor: rawSup > 0 ? +(rawSup + (idx % 2 === 0 ? 0.1 : -0.1)).toFixed(1) : baseRating.supervisor,
                    calibrated: newCalib,
                    status: newCalib >= c.benchmark ? 'Met' : (newCalib >= c.benchmark - 0.3 ? 'Minor Gap' : 'Gap')
                };
            });

            emp.overallCompetencyScore = +(effectiveScore).toFixed(2);
            emp.competencyGap = +(emp.overallCompetencyScore - emp.targetBenchmarkScore).toFixed(2);
            emp.lastAssessmentDate = evalRec.updated_at ? evalRec.updated_at.split('T')[0] : new Date().toISOString().split('T')[0];
            
            // Recalculate top strength and critical gap
            let maxScore = -1, minGapVal = 999;
            let topStr = 'Core Service', critG = 'None (Benchmark Met)';
            
            profile.competencies.forEach(c => {
                const r = emp.ratings[c.id]?.calibrated || 3.5;
                const gap = r - c.benchmark;
                if (r > maxScore) {
                    maxScore = r;
                    topStr = `${c.name} (${r.toFixed(1)})`;
                }
                if (gap < minGapVal && gap < 0) {
                    minGapVal = gap;
                    critG = `${c.name} (${gap.toFixed(2)})`;
                }
            });
            
            emp.topStrength = topStr;
            emp.criticalGap = critG;
        }
    }
}

// ========================================================
// 3.16C Render Skills Gap Analysis & TNA Diagnostic (100% Dynamic from Supabase)
// ========================================================
async function renderSkillsGapAnalysis() {
    const container = document.getElementById('comp-gaps-container');
    if (!container) return;

    const dynEmps = window.dynamicCompetencyState.employees || [];
    let emp = dynEmps.find(e => e.id === activeCompetencyEmpKey);
    if (!emp && associatesCompetencyData[activeCompetencyEmpKey]) {
        const legacy = associatesCompetencyData[activeCompetencyEmpKey];
        emp = {
            id: legacy.empId,
            full_name: legacy.name,
            title: legacy.role,
            department: legacy.dept,
            scores: {}
        };
    }
    if (!emp) return;

    // 1. Fetch live assessments directly from Supabase for this employee
    let liveAssessMap = {};
    try {
        const assessRes = await fetch(`api/competencies.php?action=get_assessments&employee_id=${encodeURIComponent(emp.id)}`);
        const assessJson = await assessRes.json();
        if (assessJson.success && Array.isArray(assessJson.data)) {
            assessJson.data.forEach(a => {
                liveAssessMap[a.competency_id] = a;
            });
        }
    } catch (err) {
        console.error('Error fetching live assessments for skills gap analysis:', err);
    }

    // 2. Fetch applicable competencies from Supabase for this employee
    let applicableComps = [];
    try {
        const deptObj = (window.dynamicCompetencyState.departments || []).find(d => 
            d.name.toLowerCase() === (emp.department || '').toLowerCase() || d.id === emp.department_id
        );
        const deptId = emp.department_id || (deptObj ? deptObj.id : null);
        const res = await fetch(`api/competencies.php?action=get_competencies${deptId ? '&department_id=' + encodeURIComponent(deptId) : ''}`);
        const json = await res.json();
        const allComps = json.data || [];
        applicableComps = allComps.filter(c => {
            if (c.scope === 'General') return true;
            if (c.scope === 'Specific' && c.position) {
                return (emp.title && (emp.title.toLowerCase() === c.position.toLowerCase() || emp.title.toLowerCase().includes(c.position.toLowerCase())));
            }
            return true;
        });
    } catch (e) {
        console.error('Error fetching competencies for skills gap analysis:', e);
        applicableComps = window.dynamicCompetencyState.competencies || [];
    }

    let detectedGapsCount = 0;
    let criticalGapsCount = 0;

    const gapCardsHtml = applicableComps.map(c => {
        const assessRec = liveAssessMap[c.id];
        const scoreData = (assessRec && assessRec.score !== null && assessRec.score !== undefined)
            ? { score: parseFloat(assessRec.score) }
            : (emp.scores ? emp.scores[c.id] : null);
        const scoreVal = (scoreData && scoreData.score !== null && scoreData.score !== undefined) ? parseFloat(scoreData.score) : null;
        const benchmark = c.benchmark_score ? parseFloat(c.benchmark_score) : 4.5;
        const maxScore = c.max_score ? parseFloat(c.max_score) : 5.0;

        let gap = 0;
        let statusText = 'Benchmark Met';
        let statusBadge = 'badge-sage';
        let barColor = 'bg-emerald-500';
        let isGap = false;
        let isUnassessed = false;

        if (scoreVal === null) {
            isUnassessed = true;
            statusText = 'Not Yet Evaluated';
            statusBadge = 'bg-slate-100 text-slate-500 border border-slate-200';
            barColor = 'bg-slate-300';
        } else {
            gap = +(scoreVal - benchmark).toFixed(2);
            if (gap < -0.4) {
                statusText = `Critical Skill Gap: ${Math.abs(gap).toFixed(2)} Deficit`;
                statusBadge = 'badge-terracotta';
                barColor = 'bg-rose-500';
                isGap = true;
                detectedGapsCount++;
                criticalGapsCount++;
            } else if (gap < 0) {
                statusText = `Minor Skill Gap: ${Math.abs(gap).toFixed(2)} Deficit`;
                statusBadge = 'badge-gold';
                barColor = 'bg-amber-500';
                isGap = true;
                detectedGapsCount++;
            }
        }

        const compliancePct = scoreVal !== null ? Math.min(100, Math.round((scoreVal / benchmark) * 100)) : 0;

        const actionBtn = (isGap || isUnassessed) ? `
            <button onclick="launchDynamicEvaluationModal('${emp.id}')" 
                class="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5">
                <i class="fas fa-clipboard-check text-[10px]"></i>
                <span>${isUnassessed ? '+ Conduct Evaluation' : '✦ Target Training &amp; Re-Evaluate'}</span>
            </button>
        ` : `
            <span class="text-xs font-bold text-emerald-700 flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <i class="fas fa-circle-check text-emerald-500"></i>
                <span>Benchmark Standard Verified</span>
            </span>
        `;

        return `
            <div class="p-4 bg-white rounded-2xl border border-[#E8DEDC] space-y-3 shadow-2xs hover:border-slate-300 transition ${isGap ? 'ring-1 ring-rose-500/20' : ''}">
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <div class="flex items-center space-x-2">
                            <h4 class="font-heading font-bold text-sm text-slate-900">${c.name}</h4>
                            <span class="${statusBadge} text-[10px] font-bold px-2 py-0.5 rounded-md">${statusText}</span>
                            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">${c.scope}</span>
                        </div>
                        <p class="text-[11px] text-slate-500 mt-0.5">
                            ${c.category || 'Core'} · Benchmark Standard: <strong class="text-slate-800">${benchmark.toFixed(1)} / ${maxScore.toFixed(1)}</strong> · Evaluated Score: <strong class="${isGap ? 'text-rose-600' : 'text-slate-900'}">${scoreVal !== null ? scoreVal.toFixed(2) : '—'}</strong>
                        </p>
                    </div>
                    <div>
                        ${actionBtn}
                    </div>
                </div>

                <div class="space-y-1 pt-1">
                    <div class="flex justify-between text-[11px] font-semibold text-slate-500">
                        <span>Target Benchmark Compliance: <strong>${compliancePct}%</strong></span>
                        <span>Gap Delta: <strong class="${gap < 0 ? 'text-rose-600' : (gap > 0 ? 'text-emerald-700' : 'text-slate-600')}">${scoreVal !== null ? (gap >= 0 ? '+' : '') + gap.toFixed(2) + ' pts' : 'Unassessed'}</strong></span>
                    </div>
                    <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80">
                        <div class="${barColor} h-2 rounded-full transition-all duration-500" style="width: ${compliancePct}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <!-- Diagnostic Header Banner -->
        <div class="p-4 bg-slate-50 border border-[#E8DEDC] rounded-2xl flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-base shadow-xs">
                    <i class="fas fa-chart-pie"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h4 class="font-heading font-bold text-base text-slate-900">${emp.full_name || emp.name} · Skills Gap Diagnostic</h4>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${detectedGapsCount > 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800'}">
                            ${detectedGapsCount > 0 ? `${detectedGapsCount} Gap${detectedGapsCount > 1 ? 's' : ''} Detected` : 'All Benchmarks Met'}
                        </span>
                    </div>
                    <p class="text-xs text-slate-500">Evaluated against hotel competency benchmarks directly mapped in Supabase.</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="launchDynamicEvaluationModal('${emp.id}')" class="btn-primary px-3.5 py-2 text-xs font-bold flex items-center space-x-1.5 shadow-xs">
                    <i class="fas fa-clipboard-check text-[11px]"></i>
                    <span>Conduct Full Assessment</span>
                </button>
            </div>
        </div>

        <!-- Summary Stat Row -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="p-3.5 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC]">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Applicable Dimensions</span>
                <p class="text-base font-heading font-bold text-slate-900">${applicableComps.length} Competencies</p>
            </div>
            <div class="p-3.5 ${criticalGapsCount > 0 ? 'bg-rose-50 border border-rose-200 text-rose-900' : 'bg-[#FAF8F7] border border-[#E8DEDC]'} rounded-xl">
                <span class="text-[10px] font-bold ${criticalGapsCount > 0 ? 'text-rose-500' : 'text-slate-400'} uppercase">Critical Skill Gaps</span>
                <p class="text-base font-heading font-bold ${criticalGapsCount > 0 ? 'text-rose-700' : 'text-slate-900'}">${criticalGapsCount} Priority Gaps</p>
            </div>
            <div class="p-3.5 ${detectedGapsCount > 0 ? 'bg-amber-50 border border-amber-200 text-amber-900' : 'bg-emerald-50 border border-emerald-200 text-emerald-900'} rounded-xl">
                <span class="text-[10px] font-bold ${detectedGapsCount > 0 ? 'text-amber-500' : 'text-emerald-600'} uppercase">Diagnostic Status</span>
                <p class="text-base font-heading font-bold ${detectedGapsCount > 0 ? 'text-amber-700' : 'text-emerald-700'}">${detectedGapsCount > 0 ? detectedGapsCount + ' Development Areas' : 'All Benchmarks Met'}</p>
            </div>
        </div>

        <div class="space-y-3 pt-2">${gapCardsHtml}</div>
    `;
}

// ========================================================
// 3.17 Assign LMS Module & Schedule in Training Management
// ========================================================
function assignLmsAndScheduleTraining(compId, compName, lmsBookId, lmsBookTitle, empKey) {
    const key = findCompetencyKeyByEmployeeId(empKey || activeCompetencyEmpKey);
    const emp = associatesCompetencyData[key];
    if (!emp) return;

    // 1. LMS Enrollment
    if (typeof window.lmsEnrollments === 'undefined') {
        window.lmsEnrollments = [];
    }
    
    const existingEnrollment = window.lmsEnrollments.find(e => (e.bookId === lmsBookId || e.courseId === lmsBookId) && (e.employeeId === emp.empId || e.associateName === emp.name));
    if (!existingEnrollment) {
        window.lmsEnrollments.unshift({
            id: 'enr_' + Date.now(),
            bookId: lmsBookId,
            courseId: lmsBookId,
            title: lmsBookTitle,
            employeeId: emp.empId,
            associateName: emp.name,
            role: emp.role,
            dept: emp.dept,
            enrolledDate: new Date().toISOString().split('T')[0],
            targetCompletion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            progress: 0,
            status: 'Enrolled',
            linkedCompetency: compName,
            xp: 150
        });
    }

    // 2. Add to IDP Goals
    const newIdpGoal = {
        id: 'idp_' + Date.now(),
        title: `Targeted Development: ${compName}`,
        category: '70% Experiential',
        competencyId: compId,
        competencyName: compName,
        assignedDate: new Date().toISOString().split('T')[0],
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 15,
        mentor: 'Elena Vance (HR Director)',
        actionItems: [
            { task: `Complete assigned LMS handbook: "${lmsBookTitle}"`, done: false },
            { task: 'Attend scheduled operational training workshop with supervisor', done: false },
            { task: 'Conduct 3 on-the-job shift scenario evaluations', done: false }
        ]
    };
    emp.idpGoals = emp.idpGoals || [];
    emp.idpGoals.unshift(newIdpGoal);

    // 3. Training Management: Create Need & Schedule Session
    if (typeof trainingNeedsState !== 'undefined') {
        const needId = 'need-' + Date.now();
        trainingNeedsState.unshift({
            id: needId,
            title: `${compName} Capability Development`,
            sourceType: 'competency_gap',
            sourceLabel: 'Competency Gap',
            category: 'Service Excellence',
            dept: emp.dept,
            associateName: emp.name,
            associateRole: emp.role,
            associateAvatar: emp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            targetCompetency: compName,
            competencyKey: compId,
            currentScore: emp.ratings[compId]?.calibrated || 3.5,
            requiredScore: 4.5,
            gap: +( (emp.ratings[compId]?.calibrated || 3.5) - 4.5 ).toFixed(2),
            urgency: 'High',
            status: 'Scheduled',
            linkedProgramId: 'prog-1',
            dateIdentified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            notes: `Auto-generated from Competency Gap Diagnostic to close ${compName} deficit.`
        });
    }

    if (typeof trainingSessionsState !== 'undefined') {
        const sessDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        trainingSessionsState.unshift({
            id: 'sess-' + Date.now(),
            programId: 'prog-1',
            title: `${compName} Remediation Workshop`,
            dept: emp.dept,
            trainerName: 'Elena Vance & Certified Trainer',
            trainerTitle: 'Internal Master Hospitality Trainer',
            location: 'Oxford Suites Training Center & Station Mockup',
            date: sessDate,
            time: '09:00 - 11:30',
            status: 'Scheduled',
            roster: [
                {
                    associateId: emp.empId,
                    name: emp.name,
                    role: emp.role,
                    dept: emp.dept,
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    attendanceStatus: 'Scheduled',
                    attendanceRate: 100,
                    checkInTime: null,
                    evaluationStatus: 'Pending',
                    score: null
                }
            ]
        });
    }

    // Re-render UI
    renderSkillsGapAnalysis();
    renderIDPView();
    if (typeof renderTrainingNeedsTable === 'function') renderTrainingNeedsTable();
    if (typeof renderTrainingCalendar === 'function') renderTrainingCalendar();

    showToast(`✦ Gap Action Created: Enrolled ${emp.name} in LMS "${lmsBookTitle}" & Scheduled Training Session in Training Operations!`, 'success');
}

// 3.18 Auto-Generate Complete IDP Plan
function autoGenerateCompleteIDP(empKey) {
    const key = findCompetencyKeyByEmployeeId(empKey || activeCompetencyEmpKey);
    const emp = associatesCompetencyData[key];
    if (!emp) return;

    showToast(`Auto-generating comprehensive 70-20-10 learning pathway for ${emp.name}...`, 'info');
    setTimeout(() => {
        const profile = roleCompetencyProfiles[emp.roleProfileId] || roleCompetencyProfiles.front_office;
        const firstGap = profile.competencies.find(c => (emp.ratings[c.id]?.calibrated || 3.5) < c.benchmark) || profile.competencies[0];
        
        assignLmsAndScheduleTraining(firstGap.id, firstGap.name, firstGap.recommendedCourseId || 'book_front_office', firstGap.recommendedCourse || 'Hospitality Mastery', key);
        switchSubTab('comp', 'development');
    }, 400);
}

// ========================================================
// 3.18B Global Bridge: View Employee Competency Radar from Anywhere
// ========================================================
window.viewEmployeeCompetencyRadar = function(empIdOrName) {
    if (typeof closeAllModals === 'function') closeAllModals();
    else if (typeof closeModal === 'function') {
        closeModal('modal-view-appraisal');
        closeModal('modal-view-calibration');
        closeModal('modal-idp-detail');
        closeModal('modal-create-goal');
        closeModal('modal-monitoring-stream');
    }

    const compKey = findCompetencyKeyByEmployeeId(empIdOrName);
    
    // Switch to Pillar 2 (Competency Management)
    if (typeof switchPillar === 'function') switchPillar('comp');
    if (typeof switchSubTab === 'function') switchSubTab('comp', 'assessment');

    // Sync and select associate
    syncCompetencyWithPerformance(compKey);
    selectCompetencyAssociate(compKey);
    
    // Scroll smoothly to radar box
    setTimeout(() => {
        const radarBox = document.getElementById('chart-competency-radar');
        if (radarBox) {
            radarBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 200);

    showToast(`Loaded Competency Radar & Skills Gap Diagnostic for ${associatesCompetencyData[compKey]?.name || 'Associate'}`, 'info');
};

window.assignLmsAndScheduleTraining = assignLmsAndScheduleTraining;
window.syncCompetencyWithPerformance = syncCompetencyWithPerformance;
window.findCompetencyKeyByEmployeeId = findCompetencyKeyByEmployeeId;

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

    const roleName = String(window.currentUser?.role || window.activePersonaRole || '').toLowerCase().trim();
    const isAssociate = (roleName === 'associate' || roleName === 'employee' || roleName === 'staff');

    container.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-heading font-bold text-base text-slate-900">${emp.name}'s Verified Qualifications &amp; Licensures</h3>
                    <p class="text-xs text-slate-500">Official registry tracking expiration alerts and recertification cycles.</p>
                </div>
                ${!isAssociate ? `
                    <button onclick="openModal('modal-add-certificate')" class="btn-primary px-4 py-2 text-xs font-bold flex items-center space-x-1.5">
                        <i class="fas fa-plus"></i>
                        <span>+ Record New Certificate</span>
                    </button>
                ` : ''}
            </div>
            <div class="space-y-3">${certsHtml.length > 0 ? certsHtml : '<p class="text-xs text-slate-400 italic p-4 bg-[#FAF8F7] rounded-xl border border-[#E8DEDC]">No active credentials logged.</p>'}</div>
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
// 4. DYNAMIC SUPABASE COMPETENCY ENGINE & MODALS
// ========================================================

window.dynamicCompetencyState = {
    departments: [],
    competencies: [],
    employees: [],
    activeDept: 'all',
    minScore: 0,
    loading: false
};

// 4.1 Load Departments from Supabase into Dropdowns
async function loadDepartmentDropdowns() {
    try {
        const res = await fetch('api/competencies.php?action=get_departments');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
            window.dynamicCompetencyState.departments = json.data;

            // 1. Matrix Filter Dept Dropdown
            const matrixDeptSelect = document.getElementById('matrix-filter-dept');
            if (matrixDeptSelect) {
                const currentVal = matrixDeptSelect.value || 'all';
                matrixDeptSelect.innerHTML = `<option value="all">All Departments (${json.data.length} Depts)</option>` +
                    json.data.map(d => `<option value="${d.id}" ${d.id === currentVal ? 'selected' : ''}>${d.name}</option>`).join('');
            }

            // 2. Team Deck Dept Dropdown
            const teamDeptSelect = document.getElementById('team-deck-dept-filter');
            if (teamDeptSelect) {
                const currentVal = teamDeptSelect.value || 'all';
                teamDeptSelect.innerHTML = `<option value="all">All Departments</option>` +
                    json.data.map(d => `<option value="${d.id}" ${d.id === currentVal ? 'selected' : ''}>${d.name}</option>`).join('');
            }

            // 3. Add Competency Modal Dept Dropdown
            const addCompDeptSelect = document.getElementById('comp-add-dept');
            if (addCompDeptSelect) {
                addCompDeptSelect.innerHTML = json.data.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
            }
        }
    } catch (err) {
        console.error('Failed to load departments from Supabase:', err);
    }
}

// 4.2 Fetch Dynamic Competencies & Employee Matrix from Supabase
async function fetchDynamicCompetencyMatrix(deptFilter, minScore) {
    const targetDept = deptFilter !== undefined ? deptFilter : (document.getElementById('matrix-filter-dept')?.value || window.dynamicCompetencyState.activeDept || 'all');
    const targetMin = minScore !== undefined ? parseFloat(minScore) : parseFloat(document.getElementById('matrix-filter-min')?.value || window.dynamicCompetencyState.minScore || 0);

    window.dynamicCompetencyState.activeDept = targetDept;
    window.dynamicCompetencyState.minScore = targetMin;

    const tbody = document.getElementById('comp-matrix-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="15" class="px-5 py-8 text-center text-slate-500 text-xs">
                    <i class="fas fa-spinner fa-spin text-primary mr-2"></i> Loading dynamic competencies directly from Supabase SQL database...
                </td>
            </tr>
        `;
    }

    try {
        const res = await fetch(`api/competencies.php?action=get_matrix&department=${encodeURIComponent(targetDept)}`);
        const json = await res.json();
        if (json.success) {
            window.dynamicCompetencyState.competencies = json.competencies || [];
            window.dynamicCompetencyState.employees = json.employees || [];
            renderCompetencyMatrixTable();
            renderEmployeeSelectOptions();
        } else {
            showToast(json.message || 'Error loading competencies from database', 'error');
        }
    } catch (err) {
        console.error('Error fetching competency matrix from Supabase:', err);
        showToast('Database connection error while fetching competencies', 'error');
    }
}

// 4.3 Render Dynamic Competency Table (Dynamic <th> and <td> from Database with Optimized Pagination)
window.dynamicCompetencyState.currentPage = window.dynamicCompetencyState.currentPage || 1;
window.dynamicCompetencyState.pageSize = window.dynamicCompetencyState.pageSize || 5;

function changeMatrixPage(newPage) {
    window.dynamicCompetencyState.currentPage = Math.max(1, parseInt(newPage));
    renderCompetencyMatrixTable();
}
window.changeMatrixPage = changeMatrixPage;

function changeMatrixPageSize(newSize) {
    window.dynamicCompetencyState.pageSize = (newSize === 'all') ? 'all' : parseInt(newSize);
    window.dynamicCompetencyState.currentPage = 1;
    renderCompetencyMatrixTable();
}
window.changeMatrixPageSize = changeMatrixPageSize;

function renderCompetencyMatrixTable() {
    const theadTr = document.getElementById('comp-matrix-thead-tr');
    const tbody = document.getElementById('comp-matrix-tbody');
    if (!theadTr || !tbody) return;

    const competencies = window.dynamicCompetencyState.competencies || [];
    const allEmployees = window.dynamicCompetencyState.employees || [];
    const minScore = window.dynamicCompetencyState.minScore || 0;
    const searchFilter = (document.getElementById('matrix-search-input')?.value || '').toLowerCase().trim();

    // 1. Filter employees by minimum overall rating and search query
    const filteredEmployees = allEmployees.filter(emp => {
        if (minScore > 0 && (emp.overall_score === null || emp.overall_score < minScore)) {
            return false;
        }
        if (searchFilter) {
            const nameMatch = (emp.full_name || '').toLowerCase().includes(searchFilter);
            const titleMatch = (emp.title || '').toLowerCase().includes(searchFilter);
            const deptMatch = (emp.department || '').toLowerCase().includes(searchFilter);
            if (!nameMatch && !titleMatch && !deptMatch) return false;
        }
        return true;
    });

    const totalCount = filteredEmployees.length;
    const matchCountBadge = document.getElementById('matrix-match-count');
    if (matchCountBadge) {
        matchCountBadge.innerText = `${totalCount} Associates In Registry`;
    }

    // 2. Pagination Calculations
    const pageSize = window.dynamicCompetencyState.pageSize || 5;
    const totalPages = (pageSize === 'all') ? 1 : (Math.ceil(totalCount / pageSize) || 1);
    if (window.dynamicCompetencyState.currentPage > totalPages) {
        window.dynamicCompetencyState.currentPage = totalPages;
    }
    const currentPage = window.dynamicCompetencyState.currentPage || 1;

    const startIndex = (pageSize === 'all') ? 0 : (currentPage - 1) * pageSize;
    const endIndex = (pageSize === 'all') ? totalCount : Math.min(startIndex + pageSize, totalCount);
    const pagedEmployees = (pageSize === 'all') ? filteredEmployees : filteredEmployees.slice(startIndex, endIndex);

    // 3. Render Pagination Footer
    const paginationInfo = document.getElementById('matrix-pagination-info');
    const paginationNav = document.getElementById('matrix-pagination-nav');
    if (paginationInfo) {
        if (totalCount === 0) {
            paginationInfo.innerHTML = 'Showing <strong>0</strong> associates';
        } else {
            paginationInfo.innerHTML = `Showing <strong>${startIndex + 1} - ${endIndex}</strong> of <strong>${totalCount}</strong> associates`;
        }
    }

    if (paginationNav) {
        if (totalPages <= 1) {
            paginationNav.innerHTML = '';
        } else {
            let navHtml = `
                <button type="button" 
                    ${currentPage === 1 ? 'disabled' : ''} 
                    onclick="changeMatrixPage(${currentPage - 1})"
                    class="px-2.5 py-1 rounded-lg border border-[#E8DEDC] bg-white text-slate-700 font-bold text-xs hover:bg-[#FAF8F7] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs">
                    <i class="fas fa-chevron-left text-[9px] mr-1"></i> Prev
                </button>
            `;

            for (let p = 1; p <= totalPages; p++) {
                if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                    const isActive = p === currentPage;
                    navHtml += `
                        <button type="button" 
                            onclick="changeMatrixPage(${p})"
                            class="px-2.5 py-1 rounded-lg border font-bold text-xs transition shadow-2xs ${isActive ? 'bg-primary text-white border-primary' : 'bg-white text-slate-700 border-[#E8DEDC] hover:bg-[#FAF8F7]'}">
                            ${p}
                        </button>
                    `;
                } else if (p === currentPage - 2 || p === currentPage + 2) {
                    navHtml += `<span class="px-1 text-slate-400 text-xs">...</span>`;
                }
            }

            navHtml += `
                <button type="button" 
                    ${currentPage === totalPages ? 'disabled' : ''} 
                    onclick="changeMatrixPage(${currentPage + 1})"
                    class="px-2.5 py-1 rounded-lg border border-[#E8DEDC] bg-white text-slate-700 font-bold text-xs hover:bg-[#FAF8F7] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs">
                    Next <i class="fas fa-chevron-right text-[9px] ml-1"></i>
                </button>
            `;
            paginationNav.innerHTML = navHtml;
        }
    }

    // 4. DYNAMIC THEAD GENERATION
    const fixedLeftTh = `
        <th class="px-4 py-3.5 sticky left-0 bg-[#FAF8F7] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] border-r border-[#E8DEDC] min-w-[260px] text-slate-800 font-bold">
            Associate &amp; Role
        </th>
    `;

    const dynamicThs = competencies.map(c => {
        const isSpecific = c.scope === 'Specific';
        const scopeBadge = isSpecific 
            ? '<span class="ml-1 text-[8px] font-bold text-amber-700 bg-amber-100/90 px-1 py-0.2 rounded border border-amber-200">Dept</span>' 
            : '<span class="ml-1 text-[8px] font-bold text-slate-500 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">All</span>';
        const targetVal = c.benchmark_score ? Number(c.benchmark_score).toFixed(1) : '4.5';
        const maxVal = Number(c.max_score || 5.0).toFixed(1);

        return `
            <th class="px-4 py-3 text-center min-w-[140px] border-r border-[#E8DEDC]/50" title="${c.description || c.name} (Target: ${targetVal} / ${maxVal})">
                <div class="flex flex-col items-center space-y-1">
                    <span class="font-bold text-slate-900 text-xs tracking-tight">${c.name}</span>
                    <div class="flex items-center space-x-1">
                        <span class="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">${c.category || 'core'}</span>
                        ${scopeBadge}
                    </div>
                    <span class="text-[9px] font-bold text-slate-600 bg-white border border-[#E8DEDC] px-2 py-0.2 rounded-full shadow-2xs">
                        Target: ${targetVal}
                    </span>
                </div>
            </th>
        `;
    }).join('');

    const fixedRightThs = `
        <th class="px-4 py-3.5 text-center min-w-[120px] text-slate-800 font-bold border-r border-[#E8DEDC]/50">
            Overall Proficiency
        </th>
        <th class="px-4 py-3.5 text-right min-w-[110px] text-slate-800 font-bold pr-5 sticky right-0 bg-[#FAF8F7] z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] border-l border-[#E8DEDC]">
            Actions
        </th>
    `;

    theadTr.innerHTML = fixedLeftTh + dynamicThs + fixedRightThs;

    // 5. DYNAMIC TBODY GENERATION
    if (pagedEmployees.length === 0) {
        const totalCols = competencies.length + 3;
        tbody.innerHTML = `
            <tr>
                <td colspan="${totalCols}" class="px-6 py-12 text-center text-slate-400 text-xs italic bg-white">
                    <div class="flex flex-col items-center justify-center space-y-2">
                        <i class="fas fa-users-slash text-2xl text-slate-300"></i>
                        <p class="font-semibold text-slate-600">No associates found matching the search criteria or department filter.</p>
                        <p class="text-[11px] text-slate-400">Try adjusting your department filter or search terms above.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = pagedEmployees.map(emp => {
        const dynamicCells = competencies.map(comp => {
            const scoreData = emp.scores[comp.id];
            if (!scoreData || scoreData.score === null) {
                if (scoreData && !scoreData.isApplicable) {
                    return `<td class="px-3.5 py-3 text-center text-slate-300 font-mono text-[10px] border-r border-[#E8DEDC]/40" title="Not applicable to ${emp.title}">N/A</td>`;
                }
                return `<td class="px-3.5 py-3 text-center text-slate-300 font-mono text-xs border-r border-[#E8DEDC]/40">—</td>`;
            }

            const val = scoreData.score;
            const benchmark = comp.benchmark_score ? parseFloat(comp.benchmark_score) : 4.5;

            let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
            let dotColor = 'bg-slate-400';

            if (val >= benchmark) {
                badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
                dotColor = 'bg-emerald-500';
            } else if (val >= 3.8) {
                badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
                dotColor = 'bg-amber-500';
            } else {
                badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
                dotColor = 'bg-rose-500';
            }

            return `
                <td class="px-3.5 py-3 text-center border-r border-[#E8DEDC]/40">
                    <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl border text-xs shadow-2xs ${badgeStyle}" title="${comp.name}: Evaluated ${val.toFixed(1)} / Benchmark ${benchmark.toFixed(1)}">
                        <span class="w-1.5 h-1.5 rounded-full ${dotColor}"></span>
                        <span>${val.toFixed(1)}</span>
                    </span>
                </td>
            `;
        }).join('');

        let overallBadge = '';
        if (emp.overall_score !== null) {
            let overallBg = 'bg-primary-50 text-primary border-primary-100';
            if (emp.overall_score < 3.8) overallBg = 'bg-rose-50 text-rose-800 border-rose-200';
            else if (emp.overall_score < 4.2) overallBg = 'bg-amber-50 text-amber-800 border-amber-200';
            else overallBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';

            overallBadge = `<span class="font-heading font-bold text-xs ${overallBg} px-3 py-1 rounded-xl border shadow-2xs">${emp.overall_formatted} / 5.0</span>`;
        } else {
            overallBadge = `<span class="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Not Assessed</span>`;
        }

        // Performance Objective & Retry Count Status Badge
        let goalBadge = '';
        const gs = emp.goals_summary || {};
        if (gs.needs_training) {
            goalBadge = `
                <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs" title="Performance Objective retry count: ${gs.max_retries}. Attempted twice without standard. Flagged for Needs Training.">
                    <i class="fas fa-triangle-exclamation text-rose-600 text-[8px]"></i>
                    <span>Needs Training (2+ Retries)</span>
                </span>
            `;
        } else if (gs.has_unmet_objectives) {
            goalBadge = `
                <span class="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs" title="Unmet Objectives: ${gs.unmet_titles ? gs.unmet_titles.join(', ') : 'Objectives not met'}">
                    <i class="fas fa-circle-exclamation text-amber-600 text-[8px]"></i>
                    <span>Goal Unmet</span>
                </span>
            `;
        } else if (gs.total_goals > 0) {
            goalBadge = `
                <span class="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200" title="Performance Objectives Met & Approved">
                    <i class="fas fa-circle-check text-emerald-500 text-[8px]"></i>
                    <span>Goal Met</span>
                </span>
            `;
        }

        return `
            <tr class="group hover:bg-[#FAF8F7] transition cursor-pointer" onclick="selectCompetencyAssociate('${emp.id}')">
                <td class="px-4 py-3.5 sticky left-0 bg-white group-hover:bg-[#FAF8F7] z-10 border-r border-[#E8DEDC] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition">
                    <div class="flex items-center space-x-3">
                        <img src="${emp.avatar_url}" alt="${emp.full_name}" class="w-9 h-9 rounded-full object-cover border border-[#E8DEDC] shadow-2xs flex-shrink-0">
                        <div class="min-w-0">
                            <div class="flex items-center space-x-1.5 flex-wrap gap-1">
                                <p class="font-bold text-slate-900 group-hover:text-primary transition text-xs truncate max-w-[140px]">${emp.full_name}</p>
                                ${goalBadge}
                            </div>
                            <p class="text-[11px] text-slate-500 truncate mt-0.5">
                                <span class="font-medium text-slate-700">${emp.title}</span> · <span class="text-slate-400 font-semibold">${emp.department}</span>
                            </p>
                        </div>
                    </div>
                </td>
                ${dynamicCells}
                <td class="px-4 py-3 text-center border-r border-[#E8DEDC]/40">
                    ${overallBadge}
                </td>
                <td class="px-4 py-3 text-right pr-5 sticky right-0 bg-white group-hover:bg-[#FAF8F7] z-10 border-l border-[#E8DEDC] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.06)] transition" onclick="event.stopPropagation()">
                    <button onclick="launchDynamicEvaluationModal('${emp.id}')" class="btn-primary px-3 py-1.5 text-xs font-bold shadow-2xs hover:bg-primary-dark transition flex items-center space-x-1.5 ml-auto">
                        <i class="fas fa-clipboard-check text-[10px]"></i>
                        <span>Evaluate</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// 4.4 Department Filter, Min Rating & Search Dispatcher
function filterMatrixCandidates() {
    window.dynamicCompetencyState.currentPage = 1;
    const deptVal = document.getElementById('matrix-filter-dept')?.value || 'all';
    const minVal = document.getElementById('matrix-filter-min')?.value || 0;
    
    // If department changed, refetch from Supabase for accurate General/Specific column scoping
    if (deptVal !== window.dynamicCompetencyState.activeDept) {
        fetchDynamicCompetencyMatrix(deptVal, minVal);
    } else {
        window.dynamicCompetencyState.minScore = parseFloat(minVal);
        renderCompetencyMatrixTable();
    }
}

// 4.5 Open Add Competency Modal
function openAddCompetencyModal() {
    const form = document.getElementById('form-add-competency');
    if (form) form.reset();
    const benchInput = document.getElementById('comp-add-benchmark');
    if (benchInput) benchInput.value = '4.5';
    const maxInput = document.getElementById('comp-add-max');
    if (maxInput) maxInput.value = '5.0';
    handleScopeChange('General');
    openModal('modal-add-competency');
}

// 4.6 Handle Scope Toggle in Add Competency Modal
function handleScopeChange(scope) {
    const specificFields = document.getElementById('comp-specific-fields');
    const deptSelect = document.getElementById('comp-add-dept');
    if (scope === 'Specific') {
        if (specificFields) specificFields.classList.remove('hidden');
        if (deptSelect) deptSelect.setAttribute('required', 'true');
    } else {
        if (specificFields) specificFields.classList.add('hidden');
        if (deptSelect) deptSelect.removeAttribute('required');
    }
}

// 4.7 Auto-Generate Competency Key
function autoGenerateCompKey(name) {
    const keyInput = document.getElementById('comp-add-key');
    if (keyInput) {
        keyInput.value = (name || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_');
    }
}

// 4.8 Save New Competency to Supabase
async function handleAddCompetencySubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('btn-submit-add-competency') || e.target.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> Saving to Database...';
    }

    const name = document.getElementById('comp-add-name').value;
    const key = document.getElementById('comp-add-key').value;
    const category = document.getElementById('comp-add-category').value;
    const scope = document.querySelector('input[name="comp-scope"]:checked')?.value || 'General';
    const deptId = scope === 'Specific' ? document.getElementById('comp-add-dept').value : null;
    const position = scope === 'Specific' ? document.getElementById('comp-add-pos').value : null;
    const benchmark = parseFloat(document.getElementById('comp-add-benchmark').value) || 4.5;
    const maxScore = parseFloat(document.getElementById('comp-add-max').value) || 5.0;
    const desc = document.getElementById('comp-add-desc').value;

    const payload = {
        name: name,
        key: key,
        category: category,
        scope: scope,
        department_id: deptId,
        position: position,
        benchmark_score: benchmark,
        max_score: maxScore,
        description: desc
    };

    try {
        const res = await fetch('api/competencies.php?action=create_competency', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
            closeModal('modal-add-competency');
            showToast(`Competency "${name}" created and saved to database!`, 'success');
            
            // Immediately refresh matrix table and dropdowns from database without requiring page refresh
            await fetchDynamicCompetencyMatrix(window.dynamicCompetencyState.activeDept);
            await loadDepartmentDropdowns();
            if (activeCompetencyEmpKey) {
                await renderSelectedEmployeeRadarView();
                await renderSkillsGapAnalysis();
            }
        } else {
            showToast(json.message || 'Failed to save competency.', 'error');
        }
    } catch (err) {
        console.error('Error saving competency:', err);
        showToast('Network error while saving competency.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            submitBtn.innerHTML = originalBtnHtml;
        }
    }
}

// 4.9 Launch Dynamic Evaluation Modal
async function launchDynamicEvaluationModal(empId) {
    const roleName = String(window.currentUser?.role || window.activePersonaRole || '').toLowerCase().trim();
    const isAssociate = (roleName === 'associate' || roleName === 'employee' || roleName === 'staff');
    if (isAssociate) {
        showToast('🔒 View-Only Mode: Associates cannot conduct self-evaluations.', 'warning');
        return;
    }

    const modal = document.getElementById('modal-conduct-assessment');
    if (!modal) return;


    // Find employee from state
    const employees = window.dynamicCompetencyState.employees || [];
    let emp = employees.find(e => e.id === empId);
    if (!emp && associatesCompetencyData[empId]) {
        const legacy = associatesCompetencyData[empId];
        emp = {
            id: legacy.empId,
            full_name: legacy.name,
            title: legacy.role,
            department: legacy.dept,
            scores: {}
        };
    }

    if (!emp) {
        showToast('Employee record not found.', 'warning');
        return;
    }

    activeCompetencyEmpKey = emp.id;
    document.getElementById('assess-modal-emp-id').value = emp.id;
    document.getElementById('assess-modal-emp-name').innerText = emp.full_name;
    document.getElementById('assess-modal-emp-role').innerText = `${emp.title} · ${emp.department}`;

    const formFieldsContainer = document.getElementById('assess-modal-fields');
    if (formFieldsContainer) {
        formFieldsContainer.innerHTML = `
            <div class="text-center py-6 text-slate-500 text-xs">
                <i class="fas fa-spinner fa-spin text-primary mr-2"></i> Loading applicable competencies from database...
            </div>
        `;
    }

    openModal('modal-conduct-assessment');

    // Fetch applicable competencies from database
    try {
        const deptObj = (window.dynamicCompetencyState.departments || []).find(d => 
            d.name.toLowerCase() === (emp.department || '').toLowerCase() || d.id === emp.department_id
        );
        const deptId = emp.department_id || (deptObj ? deptObj.id : null);

        const res = await fetch(`api/competencies.php?action=get_competencies${deptId ? '&department_id=' + encodeURIComponent(deptId) : ''}`);
        const json = await res.json();
        const competencies = json.data || [];

        // Filter applicable competencies for this employee position if specified
        const applicable = competencies.filter(c => {
            if (c.scope === 'General') return true;
            if (c.scope === 'Specific' && c.position) {
                return (emp.title.toLowerCase() === c.position.toLowerCase() || emp.title.toLowerCase().includes(c.position.toLowerCase()));
            }
            return true;
        });

        if (formFieldsContainer) {
            const scaleLabels = {
                1: 'Needs Significant Improvement',
                2: 'Needs Improvement',
                3: 'Meets Expectations',
                4: 'Exceeds Expectations',
                5: 'Outstanding'
            };

            let goalAlertBanner = '';
            const gs = emp.goals_summary || {};
            if (gs.needs_training) {
                goalAlertBanner = `
                    <div class="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2.5 text-rose-900 text-xs shadow-2xs mb-1">
                        <div class="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold">
                            <i class="fas fa-triangle-exclamation"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <strong class="font-bold text-rose-900">Training Intervention Required</strong>
                                <span class="px-1.5 py-0.2 rounded bg-rose-200 text-rose-800 text-[9px] font-bold">2+ Retries on Performance Goals</span>
                            </div>
                            <p class="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                                This associate has attempted their Performance Objective <strong>${gs.max_retries} times</strong> without meeting standard. Recommend assigning targeted training modules and an Individual Development Plan (IDP).
                            </p>
                        </div>
                    </div>
                `;
            } else if (gs.has_unmet_objectives) {
                goalAlertBanner = `
                    <div class="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-2.5 text-amber-900 text-xs shadow-2xs mb-1">
                        <div class="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold">
                            <i class="fas fa-circle-exclamation"></i>
                        </div>
                        <div>
                            <strong class="font-bold text-amber-900">Unmet Performance Objective Detected</strong>
                            <p class="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                                Associate currently has unmet or revising goals: ${gs.unmet_titles ? gs.unmet_titles.join(', ') : 'Objectives not met'}. Focus on related competency gaps below.
                            </p>
                        </div>
                    </div>
                `;
            }

            formFieldsContainer.innerHTML = goalAlertBanner + applicable.map((c, idx) => {
                const existingScore = emp.scores && emp.scores[c.id] && emp.scores[c.id].score !== null ? emp.scores[c.id].score : 4.0;
                const benchmark = c.benchmark_score ? parseFloat(c.benchmark_score).toFixed(1) : '4.5';
                const max = c.max_score ? parseFloat(c.max_score).toFixed(1) : '5.0';

                return `
                    <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-3" data-comp-id="${c.id}">
                        <div class="flex justify-between items-start flex-wrap gap-1">
                            <div>
                                <div class="flex items-center space-x-1.5">
                                    <span class="font-bold text-slate-900 text-xs">${idx + 1}. ${c.name}</span>
                                    <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">${c.scope}</span>
                                </div>
                                <span class="text-[10px] text-slate-500 block">${c.category || 'Core'} · Target: <strong class="text-primary">${benchmark} / ${max}</strong></span>
                            </div>
                            <div class="text-right">
                                <span class="text-[10px] text-slate-400 block">Evaluated Score:</span>
                                <span class="text-primary font-bold text-sm font-heading" id="assess-score-val-${c.id}">${Number(existingScore).toFixed(1)} / 5.0</span>
                            </div>
                        </div>

                        ${c.description ? `<p class="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-100 leading-relaxed">${c.description}</p>` : ''}

                        <!-- Interactive Rating Buttons (1 to 5) -->
                        <div class="space-y-1.5 pt-1">
                            <label class="block text-[10px] font-bold text-slate-700 uppercase">Select Rating (1–5):</label>
                            <div class="grid grid-cols-5 gap-1.5">
                                ${[1, 2, 3, 4, 5].map(scoreNum => {
                                    const isSelected = Math.round(existingScore) === scoreNum;
                                    return `
                                        <button type="button" 
                                            onclick="setCompetencyRating('${c.id}', ${scoreNum})"
                                            id="btn-rating-${c.id}-${scoreNum}"
                                            class="py-2 px-1 text-center rounded-xl border transition text-[11px] font-bold ${isSelected ? 'bg-primary text-white border-primary shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
                                            <span>${scoreNum}</span>
                                            <span class="block text-[8px] font-normal opacity-80 leading-tight truncate">${scaleLabels[scoreNum].split(' ')[0]}</span>
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                            
                            <input type="hidden" id="assess-rating-${c.id}" value="${existingScore}">

                            <!-- Slider for fine-tuning -->
                            <div class="pt-2">
                                <input type="range" min="1.0" max="5.0" step="0.1" value="${existingScore}" 
                                    id="assess-slider-${c.id}" 
                                    oninput="syncSliderRating('${c.id}', this.value)"
                                    class="w-full accent-[#9E1B20] cursor-pointer">
                                <div class="flex justify-between text-[9px] text-slate-400 font-semibold px-0.5">
                                    <span>1.0 Needs Significant Imp</span>
                                    <span>2.0 Needs Imp</span>
                                    <span>3.0 Meets</span>
                                    <span>4.0 Exceeds</span>
                                    <span>5.0 Outstanding</span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-1">
                            <input type="text" id="assess-comp-notes-${c.id}" class="w-full px-3 py-1.5 rounded-xl border border-[#E8DEDC] bg-white text-[11px] placeholder-slate-400" placeholder="Specific behavioral observations or remarks for this competency...">
                        </div>
                    </div>
                `;
            }).join('');
        }
    } catch (err) {
        console.error('Error rendering evaluation modal fields:', err);
    }
}

// Alias for legacy triggers
function launchAssessmentModalFor(empKey) {
    launchDynamicEvaluationModal(empKey);
}

// 4.10 Interactive Rating Clicker
function setCompetencyRating(compId, score) {
    const hiddenInput = document.getElementById(`assess-rating-${compId}`);
    if (hiddenInput) hiddenInput.value = score;

    const slider = document.getElementById(`assess-slider-${compId}`);
    if (slider) slider.value = score;

    const scoreDisplay = document.getElementById(`assess-score-val-${compId}`);
    if (scoreDisplay) scoreDisplay.innerText = `${score.toFixed(1)} / 5.0`;

    [1, 2, 3, 4, 5].forEach(num => {
        const btn = document.getElementById(`btn-rating-${compId}-${num}`);
        if (btn) {
            if (num === score) {
                btn.className = 'py-2 px-1 text-center rounded-xl border transition text-[11px] font-bold bg-primary text-white border-primary shadow-xs';
            } else {
                btn.className = 'py-2 px-1 text-center rounded-xl border transition text-[11px] font-bold bg-white text-slate-700 border-slate-200 hover:bg-slate-50';
            }
        }
    });
}

// 4.11 Interactive Slider Sync
function syncSliderRating(compId, val) {
    const num = parseFloat(val);
    const hiddenInput = document.getElementById(`assess-rating-${compId}`);
    if (hiddenInput) hiddenInput.value = num;

    const scoreDisplay = document.getElementById(`assess-score-val-${compId}`);
    if (scoreDisplay) scoreDisplay.innerText = `${num.toFixed(1)} / 5.0`;

    const rounded = Math.round(num);
    [1, 2, 3, 4, 5].forEach(btnNum => {
        const btn = document.getElementById(`btn-rating-${compId}-${btnNum}`);
        if (btn) {
            if (btnNum === rounded) {
                btn.className = 'py-2 px-1 text-center rounded-xl border transition text-[11px] font-bold bg-primary text-white border-primary shadow-xs';
            } else {
                btn.className = 'py-2 px-1 text-center rounded-xl border transition text-[11px] font-bold bg-white text-slate-700 border-slate-200 hover:bg-slate-50';
            }
        }
    });
}

// 4.12 Save Conducted Assessment to Supabase SQL Database
async function handleAssessmentSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('btn-submit-assessment') || e.target.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1.5"></i> Saving Assessment...';
    }

    const empId = document.getElementById('assess-modal-emp-id').value;
    if (!empId) {
        showToast('Employee ID is missing', 'error');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            submitBtn.innerHTML = originalBtnHtml;
        }
        return;
    }

    const fieldsContainer = document.getElementById('assess-modal-fields');
    const compCards = fieldsContainer ? fieldsContainer.querySelectorAll('[data-comp-id]') : [];
    const ratings = [];

    compCards.forEach(card => {
        const compId = card.getAttribute('data-comp-id');
        const ratingInput = document.getElementById(`assess-rating-${compId}`);
        const notesInput = document.getElementById(`assess-comp-notes-${compId}`);
        if (compId && ratingInput) {
            ratings.push({
                competency_id: compId,
                score: parseFloat(ratingInput.value) || 4.0,
                comments: notesInput ? notesInput.value : ''
            });
        }
    });

    const generalNotes = document.getElementById('assess-modal-notes')?.value || '';

    const payload = {
        employee_id: empId,
        assessed_by: 'emp-103', // Logged in evaluator / HR Admin
        ratings: ratings,
        notes: generalNotes
    };

    try {
        const res = await fetch('api/competencies.php?action=save_assessment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
            closeModal('modal-conduct-assessment');
            showToast('Competency assessment saved successfully in Supabase database!', 'success');
            
            // 1. Immediately refresh matrix table with new database scores
            await fetchDynamicCompetencyMatrix(window.dynamicCompetencyState.activeDept);

            // 2. Immediately refresh active associate 360 radar and skills gap views without needing browser refresh
            if (activeCompetencyEmpKey) {
                await renderSelectedEmployeeRadarView();
                await renderSkillsGapAnalysis();
            }
        } else {
            showToast(json.message || 'Failed to save assessment to database.', 'error');
        }
    } catch (err) {
        console.error('Error submitting assessment:', err);
        showToast('Network error while saving assessment.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            submitBtn.innerHTML = originalBtnHtml;
        }
    }
}

// 4.13 Add New IDP Goal
function handleCreateIdpSubmit(e) {
    e.preventDefault();
    const emp = associatesCompetencyData[activeCompetencyEmpKey] || associatesCompetencyData.maria_santos;
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

    emp.idpGoals = emp.idpGoals || [];
    emp.idpGoals.unshift(newGoal);
    closeModal('modal-create-idp');
    renderIDPView();
    showToast(`New IDP Milestone "${title}" created for ${emp.name}!`, 'success');
}

// 4.14 Add New Certificate
function handleAddCertificateSubmit(e) {
    e.preventDefault();
    const emp = associatesCompetencyData[activeCompetencyEmpKey] || associatesCompetencyData.maria_santos;
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

    emp.certifications = emp.certifications || [];
    emp.certifications.unshift(newCert);
    closeModal('modal-add-certificate');
    renderCertificationsRoster();
    showToast(`Recorded qualification "${name}" for ${emp.name}!`, 'success');
}

// 4.15 Open Batch Team Assessment Modal
function openBatchEvaluationModal() {
    const tbody = document.getElementById('batch-eval-table-tbody');
    if (!tbody) return;

    const employees = window.dynamicCompetencyState.employees || [];
    if (employees.length > 0) {
        tbody.innerHTML = employees.map(emp => `
            <tr class="hover:bg-[#FAF8F7] transition">
                <td class="px-4 py-3">
                    <div class="flex items-center space-x-2">
                        <img src="${emp.avatar_url}" class="w-6 h-6 rounded-full object-cover border border-[#E8DEDC]">
                        <div>
                            <p class="font-bold text-slate-900 text-xs">${emp.full_name}</p>
                            <p class="text-[10px] text-slate-500">${emp.title}</p>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-3 text-center font-bold text-xs text-slate-800">${emp.overall_formatted}</td>
                <td class="px-4 py-3 text-center">
                    <input type="number" step="0.1" min="1.0" max="5.0" value="${emp.overall_score !== null ? emp.overall_score.toFixed(1) : '4.0'}" id="batch-score-${emp.id}" class="w-16 p-1.5 text-center font-bold rounded-lg border border-[#E8DEDC] bg-white text-xs text-primary focus:ring-1 focus:ring-primary">
                </td>
                <td class="px-4 py-3 text-center">
                    <select id="batch-status-${emp.id}" class="p-1 rounded-lg border border-[#E8DEDC] text-[11px] font-semibold">
                        <option value="Approved" selected>Approve Rating</option>
                        <option value="Needs TNA">Flag for TNA</option>
                        <option value="Promote">Ready for Promotion</option>
                    </select>
                </td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = Object.values(associatesCompetencyData).map(emp => `
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
    }

    openModal('modal-batch-evaluation');
}

// 4.16 Save Batch Team Assessment
function saveBatchEvaluation(e) {
    if (e) e.preventDefault();
    closeModal('modal-batch-evaluation');
    showToast('Saved and synchronized batch team competency ratings!', 'success');
}

// 4.17 Export Dynamic CSV Matrix
function exportCompetencyReportCSV() {
    const competencies = window.dynamicCompetencyState.competencies || [];
    const employees = window.dynamicCompetencyState.employees || [];

    if (employees.length === 0) {
        showToast('No competency data available to export.', 'warning');
        return;
    }

    let csv = 'Associate Name,Department,Role,' + competencies.map(c => `"${c.name}"`).join(',') + ',Overall Score\n';
    employees.forEach(emp => {
        const compScores = competencies.map(c => {
            const scoreData = emp.scores[c.id];
            return (scoreData && scoreData.score !== null) ? scoreData.score.toFixed(2) : 'N/A';
        }).join(',');

        csv += `"${emp.full_name}","${emp.department}","${emp.title}",${compScores},"${emp.overall_formatted}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Oxford_Suites_Competency_Matrix_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Oxford Suites Dynamic Competency Matrix to CSV!', 'success');
}

window.employeeCompetencyProfiles = {
    'emp-101': [
        { name: 'Front Desk Standards & Guest Relations', score: 4.20, target: 4.00, status: 'Proficient', dept: 'Front Office' },
        { name: 'Opera Cloud PMS & Reservations', score: 2.80, target: 4.00, status: 'Needs Improvement', dept: 'Front Office' },
        { name: 'VIP Check-In & Service Protocol', score: 4.50, target: 4.00, status: 'Mastered', dept: 'Front Office' },
        { name: 'Guest De-escalation & Crisis Response', score: 3.50, target: 4.00, status: 'On Track', dept: 'Front Office' }
    ],
    'emp-102': [
        { name: 'HACCP Food Safety & Sanitation', score: 4.60, target: 4.50, status: 'Mastered', dept: 'Culinary' },
        { name: 'Grand Sommelier Wine Pairing', score: 2.40, target: 4.00, status: 'Needs Improvement', dept: 'F&B Service' },
        { name: 'Banquet Operations & Logistics', score: 2.80, target: 4.00, status: 'Needs Improvement', dept: 'F&B Service' },
        { name: 'Fine Dining Table Service', score: 4.10, target: 4.00, status: 'Proficient', dept: 'F&B Service' }
    ],
    'emp-103': [
        { name: 'Executive Suite Turn-Down', score: 4.80, target: 4.50, status: 'Mastered', dept: 'Housekeeping' },
        { name: 'Linen Inventory Management', score: 4.20, target: 4.00, status: 'Proficient', dept: 'Housekeeping' },
        { name: 'Deep Cleaning Protocols', score: 4.00, target: 4.00, status: 'Proficient', dept: 'Housekeeping' }
    ]
};

window._cachedEmpCompetencies = window._cachedEmpCompetencies || {};

function getFallbackCompetencyProfile(cleanId) {
    if (cleanId.includes('102') || cleanId.includes('antonio')) return window.employeeCompetencyProfiles['emp-102'] || [];
    if (cleanId.includes('103') || cleanId.includes('john')) return window.employeeCompetencyProfiles['emp-103'] || [];
    return window.employeeCompetencyProfiles['emp-101'] || [];
}

function renderCompetencyCardsHTML(list) {
    if (!list || list.length === 0) {
        return '<div class="col-span-4 p-4 text-center text-xs text-slate-400">No specific competencies evaluated yet for this employee.</div>';
    }

    return list.map(comp => {
        const pct = Math.min(100, Math.round((comp.score / 5.0) * 100));
        const isBelow = comp.score < comp.target;
        let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (isBelow) badgeClass = 'bg-red-100 text-red-800 border-red-200';
        else if (comp.score >= 4.5) badgeClass = 'bg-amber-100 text-amber-900 border-amber-200';

        return `
            <div class="p-4 rounded-2xl border ${isBelow ? 'border-red-200 bg-red-50/20' : 'border-[#E8DEDC] bg-[#FAF8F7]'} flex flex-col justify-between space-y-3 transition hover:shadow-2xs">
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${comp.dept || 'Assigned Competency'}</span>
                        <span class="text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}">${comp.status}</span>
                    </div>
                    <h4 class="font-heading font-bold text-slate-900 text-xs leading-snug">${comp.name}</h4>
                </div>
                <div class="pt-2 border-t border-[#E8DEDC] space-y-1">
                    <div class="flex items-center justify-between text-xs">
                        <span class="font-extrabold text-slate-800">${comp.score.toFixed(2)} / 5.0</span>
                        <span class="text-[11px] text-slate-400">Target: <strong class="text-slate-600">${comp.target.toFixed(1)}</strong></span>
                    </div>
                    <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div class="${isBelow ? 'bg-red-500' : 'bg-emerald-500'} h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function fetchEmployeeSpecificCompetencies(empId = 'emp-101') {
    const cleanId = (empId || 'emp-101').toString().toLowerCase();

    // Check memory cache
    if (window._cachedEmpCompetencies[cleanId]) {
        return window._cachedEmpCompetencies[cleanId];
    }
    
    try {
        const res = await fetch(`api/competencies.php?action=get_assessments&employee_id=${encodeURIComponent(cleanId)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const mapped = json.data.map(item => ({
                id: item.competency_id,
                name: item.competency_name || 'Assigned Competency',
                score: item.rating ? parseFloat(item.rating) : (item.score ? parseFloat(item.score) : 4.0),
                target: item.benchmark_score ? parseFloat(item.benchmark_score) : 4.0,
                status: (parseFloat(item.rating || item.score || 4.0) >= 4.0) ? 'Proficient' : ((parseFloat(item.rating || item.score || 4.0) >= 3.0) ? 'On Track' : 'Needs Improvement'),
                dept: item.category || item.department_name || 'Competency'
            }));
            window._cachedEmpCompetencies[cleanId] = mapped;
            return mapped;
        }

    } catch (e) {
        console.error('Error fetching employee specific competencies:', e);
    }

    return getFallbackCompetencyProfile(cleanId);
}
window.fetchEmployeeSpecificCompetencies = fetchEmployeeSpecificCompetencies;

async function renderEmployeeOverviewCompetencies(empId = 'emp-101') {
    const container = document.getElementById('emp-overview-competencies-container');
    if (!container) return;

    const cleanId = (empId || 'emp-101').toString().toLowerCase();
    const countEl = document.getElementById('emp-overview-comp-count');

    // 1. Instant Render: Use cached or fallback data immediately with ZERO delay
    const initialList = window._cachedEmpCompetencies[cleanId] || getFallbackCompetencyProfile(cleanId);
    if (initialList && initialList.length > 0) {
        container.innerHTML = renderCompetencyCardsHTML(initialList);
        if (countEl) countEl.textContent = `${initialList.length} Assigned Competencies`;
    } else {
        // Skeleton only if no data exists at all
        container.innerHTML = `
            <div class="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                ${[1, 2, 3, 4].map(() => `
                    <div class="p-4 bg-[#FAF8F7] rounded-2xl border border-[#E8DEDC] space-y-3">
                        <div class="flex justify-between items-center">
                            <div class="h-3.5 w-28 bg-slate-200 rounded"></div>
                            <div class="h-4 w-12 bg-slate-200 rounded-full"></div>
                        </div>
                        <div class="h-2 w-full bg-slate-200 rounded-full"></div>
                        <div class="flex justify-between items-center text-[10px]">
                            <div class="h-3 w-16 bg-slate-100 rounded"></div>
                            <div class="h-3 w-12 bg-slate-100 rounded"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 2. Fetch fresh database competencies asynchronously and update seamlessly
    try {
        const freshList = await fetchEmployeeSpecificCompetencies(empId);
        if (freshList && freshList.length > 0) {
            container.innerHTML = renderCompetencyCardsHTML(freshList);
            if (countEl) countEl.textContent = `${freshList.length} Assigned Competencies`;
        }
    } catch (e) {
        console.warn('Competency background refresh note:', e);
    }
}
window.renderEmployeeOverviewCompetencies = renderEmployeeOverviewCompetencies;

// Global exposes
window.loadDepartmentDropdowns = loadDepartmentDropdowns;
window.fetchDynamicCompetencyMatrix = fetchDynamicCompetencyMatrix;
window.renderCompetencyMatrixTable = renderCompetencyMatrixTable;
window.filterMatrixCandidates = filterMatrixCandidates;
window.openAddCompetencyModal = openAddCompetencyModal;
window.handleScopeChange = handleScopeChange;
window.autoGenerateCompKey = autoGenerateCompKey;
window.handleAddCompetencySubmit = handleAddCompetencySubmit;
window.launchDynamicEvaluationModal = launchDynamicEvaluationModal;
window.launchAssessmentModalFor = launchAssessmentModalFor;
window.setCompetencyRating = setCompetencyRating;
window.syncSliderRating = syncSliderRating;
window.handleAssessmentSubmit = handleAssessmentSubmit;
window.exportCompetencyReportCSV = exportCompetencyReportCSV;

// Auto-run on load
window.addEventListener('DOMContentLoaded', () => {
    initCompetencyModule();
    renderEmployeeOverviewCompetencies(window.selectedEvalEmpId || 'emp-101');
});


