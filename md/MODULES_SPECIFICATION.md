# Oxford Suites, Makati — Core Modules Specification & Architecture
## Training Management · Succession Planning · Social Recognition

This document provides a comprehensive technical and functional specification of the three core modules: **Training Management**, **Succession Planning**, and **Social Recognition**, detailing their **purpose**, **step-by-step workflows**, and **interconnected data flows** across the hotel's Performance and Development ecosystem.

---

## 1. Master System Ecosystem & Closed-Loop Architecture

The platform operates as a continuous, closed-loop talent and operational management system where operational signals, learning, recognition, appraisal, and leadership planning feed into each other without data silos.

```
                                  ┌──────────────────────────────────────────────┐
                                  │      REALTIME SHIFT SENTIMENT ANALYTICS      │
                                  │  (24h Rush Hour Stress Dynamics & Feedback)  │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                                                         ▼
    ┌──────────────────────────────────┐   Friction/Gap  ┌──────────────────────────────────┐
    │     SOCIAL RECOGNITION WALL      │◀────────────────│      COMPETENCY MANAGEMENT       │
    │  (Peer & Supervisor Kudos + XP)  │                 │  (Radar Benchmark & Gap Analysis)│
    └────────────────┬─────────────────┘                 └────────────────┬─────────────────┘
                     │                                                    │
                     │ Qualitative Quotes                                 │ Identified Gap
                     ▼                                                    ▼
    ┌──────────────────────────────────┐   Closed Score  ┌──────────────────────────────────┐
    │      PERFORMANCE MANAGEMENT      │────────────────▶│       TRAINING MANAGEMENT        │
    │   (7-Stage Appraisal & Review)   │                 │ (Schedule ➔ Attend ➔ Eval ➔ Cert)│
    └────────────────┬─────────────────┘                 └────────────────┬─────────────────┘
                     │                                                    │
                     │ Closed Ratings                                     │ Upgraded Competencies
                     └───────────────────────────┬────────────────────────┘
                                                 │
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │     SUCCESSION PLANNING      │
                                  │  (Readiness Matrix & Bench)  │
                                  └──────────────────────────────┘
```

---

## 2. Module 1: Training Management

### 2.1. Purpose
The **Training Management** module bridges operational skill gaps and enforces mandatory statutory compliance (e.g., HACCP Food Safety, Crisis Evacuation, Opera Cloud PMS). It ensures training is never an isolated event, but a measurable 5-part operational cycle that directly verifies attendance, tests learned knowledge, issues official certification, and updates associate skill profiles.

### 2.2. In-Scope Workflow
The training lifecycle follows a strict **5-stage operational process**:

```
 1. NEED IDENTIFIED       2. PROGRAM CREATION       3. SCHEDULING          4. ATTENDANCE          5. EVALUATION & RESULT
┌────────────────────┐   ┌────────────────────┐   ┌───────────────────┐   ┌───────────────────┐   ┌────────────────────┐
│ Skill Gap or       │──▶│ Syllabus, Modules, │──▶│ Date, Venue, Time,│──▶│ Check-in Console: │──▶│ Knowledge Quiz +   │
│ Mandatory          │   │ Target Competency, │   │ Assigned Trainer, │   │ Attended, Absent, │   │ Kirkpatrick 1-5★   │
│ Compliance Category│   │ Passing Threshold  │   │ Participant Roster│   │ Completed (100%)  │   │ Score & Cert Ref   │
└────────────────────┘   └────────────────────┘   └───────────────────┘   └───────────────────┘   └─────────┬──────────┘
                                                                                                            │
                                                                                                            ▼
                                                                                                  ┌────────────────────┐
                                                                                                  │ 6. TRAINING REPORT │
                                                                                                  │ Dept & Program %   │
                                                                                                  └────────────────────┘
```

1. **Training Program Creation (Linked to Skill Gap or Mandatory Compliance)**:
   - Every program is explicitly mapped to a **Skill Gap** (e.g., *Frontline Conflict De-escalation deficit of -1.5*) or a **Mandatory Compliance Standard** (e.g., *HACCP Level 3 Food Safety*).
   - Defines curriculum modules, target competencies, required duration, and passing threshold ($\ge 80\%$).
2. **Scheduling (Date, Time, Location, Trainer, Participant List)**:
   - Assigns internal certified masters (e.g., *Master Sommelier Pierre*, *Elena Vance*) or external auditors.
   - Sets physical venue (e.g., *Executive Boardroom*, *Culinary Training Kitchen*) and session time slots.
   - Enrolls participant rosters directly from identified competency gaps.
3. **Attendance Tracking (Attended / Absent / Completed)**:
   - Live session attendance console tracking real-time check-in timestamps.
   - Status toggles: **`Attended`** (100%), **`Absent`** (0%), and **`Completed`** (100%).
   - *Attendance Gate*: Participants must be marked Attended before unlocking the post-evaluation assessment.
4. **Post-Training Evaluation & Result Recording (Score, Certificate Reference)**:
   - **Part A (Knowledge Quiz)**: Auto-graded multiple-choice questions testing practical application.
   - **Part B (Kirkpatrick Level 1 Feedback)**: 1-to-5 star ratings for trainer mastery and practical relevance.
   - **Result Logging**: Records numerical score ($\ge 80\%$), pass/fail status, and official certificate reference code (e.g., `OXF-CERT-2026-0889`).
   - **Digital Certificate**: Viewable, printable luxury gold-bordered certificate complete with GM signature and verification seal.
5. **Basic Training Report (Attendance + Completion by Program/Department)**:
   - Aggregated analytics displaying attendance rates ($\%$) and completion rates ($\%$) grouped by **Department** (Front Office, Culinary, F&B, Housekeeping) and **Program**.

### 2.3. Connections to Other Modules
- **Input From Competency Management**: Automatically receives low benchmark alerts when an associate's skill rating is below target.
- **Input From LMS (Books & SOPs)**: Links practical workshops to 3D Digital Standard Operating Procedure manuals.
- **Output To Competency Management**: When an evaluation is passed, automatically elevates the associate's skill level (e.g., De-escalation rises from $3.5 \rightarrow 4.8\text{ Master}$), refreshing the **Radar Chart** and **Team Matrix**.
- **Output To Individual Development Plan (IDP)**: Automatically marks the linked 70-20-10 development task as 100% completed.
- **Output To Gamification Engine**: Awards **`+150 XP`** to the associate profile upon certificate issuance.
- **Output To Succession Planning**: Satisfies required competency prerequisites for leadership promotion.

---

## 3. Module 2: Succession Planning

### 2.1. Purpose
The **Succession Planning** module safeguards hotel business continuity by identifying and cultivating internal talent for mission-critical leadership roles (e.g., *Front Office Assistant Manager*, *Executive Sous Chef*, *Restaurant Operations Manager*). It eliminates subjective promotion bias by calculating an objective, data-informed readiness index while maintaining HR leadership oversight.

### 2.2. In-Scope Workflow
The succession pipeline executes a **4-step calibration workflow**:

```
 1. DATA PULL         2. COMPUTATION              3. HR REVIEW            4. HR FLAG SETTING
┌─────────────────┐  ┌─────────────────────────┐  ┌─────────────────┐   ┌───────────────────────────┐
│ Pulls Closed    │  │ Computes Readiness Match│  │ HR Reviews Bench│   │ HR Manually Sets Flag:    │
│ Perf (4.8) +    │─▶│ (Employee × Target Role)│─▶│ Diagnostics     │──▶│ 🟢 Ready Now (0–6 mos)    │
│ Competency (4.8)│  │ e.g., Maria Santos: 94% │  │ & Capability Fit│   │ 🟡 Ready in 1–2 Years     │
└─────────────────┘  └─────────────────────────┘  └─────────────────┘   │ 🔴 Not Ready              │
                                                                        └─────────────┬─────────────┘
                                                                                      │
                                                                                      ▼
                                                                        ┌───────────────────────────┐
                                                                        │ 5. Succession Record      │
                                                                        │ Dept × Target Leadership  │
                                                                        └───────────────────────────┘
```

1. **Data Pull (Closed Performance Ratings + Competency Levels)**:
   - Automatically pulls the employee's finalized review score from Performance Management (e.g., *Maria Santos: 4.8 / 5.0 – Exceeds Expectations*).
   - Pulls current evaluated competency ratings across all core dimensions (Guest Relations, PMS, De-escalation, Leadership).
2. **Readiness Computation (`Employee × Target Role`)**:
   - The engine computes the candidate's capability match percentage against target role requirements:
     $$\text{Readiness Index} = (\text{Closed Performance Score} \times 40\%) + (\text{Target Competencies Match} \times 60\%)$$
   - Generates match classifications (e.g., *94% Match – High Capability*).
3. **HR Calibration & Bench Review**:
   - HR and Department Heads review the side-by-side diagnostic table comparing candidates across tenure, performance history, competency strengths, and gaps.
   - Evaluates the **9-Box Talent Grid** (Performance vs. Potential).
4. **HR-Only Manual Readiness Flag Assignment**:
   - HR sets the official talent horizon flag:
     - 🟢 **Ready Now** (*Immediate successor, 0–6 months*)
     - 🟡 **Ready in 1–2 Years** (*High potential, requires targeted cross-training*)
     - 🔴 **Not Ready** (*Developing foundational capabilities*)
5. **Succession Records Tied to Department and Target Role**:
   - Each key leadership position maintains a live succession profile detailing **Current Incumbent**, **Planned Transition Horizon**, **Risk of Loss**, **Bench Strength**, **Primary Successor**, and **Emergency Backup**.

### 2.3. Connections to Other Modules
- **Input From Performance Management**: Directly consumes the finalized, calibrated appraisal score.
- **Input From Training & Competency Management**: Consumes verified competency scores; when an employee passes a training workshop, their succession readiness index automatically recalculates and jumps upward.
- **Output To Individual Development Plans (IDP)**: Associates marked *"Ready in 1–2 years"* automatically receive prioritized leadership development goals.
- **Output To Executive BI Reports**: Feeds property-wide leadership bench strength metrics to the General Manager overview.

---

## 4. Module 3: Social Recognition & Gamification

### 2.1. Purpose
The **Social Recognition** module drives frontline workplace engagement, camaraderie, and service culture through peer-to-peer and supervisor-to-employee acknowledgments. It enforces strict, **deterministic point rules** (avoiding non-transparent or arbitrary AI scoring) and converts social recognition into **verified qualitative evidence** for formal performance appraisals.

### 2.2. In-Scope Workflow
The recognition workflow operates across **4 connected stages**:

```
 1. RECOGNITION POST      2. DETERMINISTIC LEDGER   3. LIVE TEAM FEED      4. PERFORMANCE INPUT
┌────────────────────┐   ┌───────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
│ • Peer-to-Peer or  │──▶│ • Peer Rule: +50 XP   │─▶ • Department Wall  │─▶ • Quotes & Badges │
│   Supervisor Post  │   │ • Supv Rule: +100 XP  │ │ • Cheer Reactions: │ │   Aggregated into  │
│ • Category & Text  │   │ • Milestone Badges    │ │   👏 ❤️ ⭐ 🔥      │ │   Q3 Appraisal Form│
└────────────────────┘   └───────────────────────┘ └────────────────────┘ └────────────────────┘
```

1. **Recognition Post Creation (Peer & Supervisor)**:
   - Senders choose their role (*Peer-to-Peer* or *Supervisor Commendation*), select recipient(s) from the staff roster, pick an authentic hospitality category (*Great Guest Service*, *Team Collaboration*, *Safety & HACCP Compliance*, *Crisis Recovery*, *Operational Excellence*), and write a specific commendation.
2. **Point / Badge Ledger (Deterministic Backend Rules)**:
   - Points are calculated deterministically via transparent business logic:
     - **Peer-to-Peer Recognition**: **`+50 XP`**
     - **Supervisor Commendation**: **`+100 XP`**
     - **General Manager Citation**: **`+200 XP`**
   - **Transaction Audit Ledger**: Immutable record of Transaction ID, Date, Recipient, Sender, Rule, Points Granted, and Balance.
   - **Milestone Badges**: Awarded when deterministic threshold counts are reached (*Guest Hero: 10+ 5-Star Reviews*, *Safety Star: 100% HACCP Pass*, *Team Anchor: 5+ Peer Recognitions*, *Diplomacy Lead: De-escalation Mastery*).
3. **Department / Team Recognition Wall**:
   - Public team feed with department filtering (Front Office, Culinary, F&B, Housekeeping) and interactive peer cheering reactions (**👏 Clap**, **❤️ Heart**, **⭐ Star**, **🔥 Fire**) with live counters.
4. **Qualitative Input into Performance Appraisal Cycle**:
   - Commendation quotes and earned badges are automatically aggregated and synthesized into **Phase 5 (1-on-1 Calibration Discussion)** of the employee's formal performance review.

### 2.3. Connections to Other Modules
- **Output To Performance Management**: Supplies objective peer & supervisor quotes to the appraisal review, preventing recency bias.
- **Output To User Profile & Gamification**: Increases the employee's continuous level progression bar (e.g., $1,480\text{ XP} \rightarrow 1,580\text{ XP}$).
- **Output To Realtime Shift Climate**: High recognition activity directly stabilizes shift sentiment, reducing operational friction during peak restaurant and check-in rush hours.

---

## 5. Master Cross-Module Integration Matrix

| Source Module | Output / Data Generated | Target Module | How Data is Consumed & Action Taken |
| :--- | :--- | :--- | :--- |
| **Competency Management** | Competency Gap Identified ($-1.5$ deficit) | **Training Management** | Creates an active training need and auto-populates the participant in the session schedule. |
| **Training Management** | Post-Evaluation Passed ($96\%$ Score, Certificate Issued) | **Competency Management** | Automatically upgrades skill score ($3.5 \rightarrow 4.8\text{ Master}$) and redraws the Radar Benchmark. |
| **Training Management** | Certified Completion Record | **Gamification Engine** | Awards **`+150 XP`** and records certificate in Statutory Licenses Registry. |
| **Training Management** | Upgraded Competency Levels | **Succession Planning** | Recalculates role capability match ($\rightarrow 94\%$), unlocking *"Ready Now"* eligibility. |
| **Social Recognition** | Peer & Supervisor Commendations (+XP) | **Performance Management** | Injects verified qualitative quotes into Phase 5 Appraisal Discussion minutes. |
| **Performance Management** | Finalized Calibrated Review Score ($4.8 / 5.0$) | **Succession Planning** | Acts as the $40\%$ weighted foundation in the Computed Readiness Matrix. |
| **Succession Planning** | HR Flag set to *"Ready in 1–2 Years"* | **Competency / IDP** | Triggers targeted 70-20-10 leadership development goals and mentor check-ins. |

---

## 6. Implementation File Manifest

- [view/training.php](file:///opt/lampp/htdocs/Performance-development/view/training.php) — 5-Stage training pipeline visualizer, sub-panels for Needs, Programs, Schedules, Attendance, Evaluation Results, and Basic Reports.
- [js/training.js](file:///opt/lampp/htdocs/Performance-development/js/training.js) — Training state engine, attendance tracking, quiz scoring, certificate generator, and competency sync.
- [view/succession.php](file:///opt/lampp/htdocs/Performance-development/view/succession.php) — Succession records by department, computed readiness matrix table (`Employee × Target Role`), and 9-Box calibration grid.
- [js/succession.js](file:///opt/lampp/htdocs/Performance-development/js/succession.js) — Readiness calculation engine, HR flag toggles (`Ready Now` / `1–2 Yrs` / `Not Ready`), and department filters.
- [view/social.php](file:///opt/lampp/htdocs/Performance-development/view/social.php) — Live team recognition feed, deterministic points ledger table, and milestone badges grid.
- [js/kudos.js](file:///opt/lampp/htdocs/Performance-development/js/kudos.js) — Deterministic point allocation rules, cheer reactions, and qualitative performance input synthesizer.
- [view/performance.php](file:///opt/lampp/htdocs/Performance-development/view/performance.php) — Formal appraisal cycle with embedded qualitative recognition evidence.
- [view/modals.php](file:///opt/lampp/htdocs/Performance-development/view/modals.php) — Interactive dialogs for program creation, session scheduling, post-evaluation quiz, digital certificate viewer, and recognition posts.
