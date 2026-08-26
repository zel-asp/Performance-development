# Performance Monitoring & KPI Target Progress Architecture
## Stage 3: Continuous Shift Performance Monitoring (Oxford Suites, Makati)

---

## 1. Executive Overview

This specification defines the complete end-to-end architecture for **Stage 3: Continuous Performance Monitoring** within the Oxford Suites HR3 Performance Management Module.

The system transitions from **Stage 1 (Planning)** and **Stage 2 (Approval)** into **Stage 3 (Monitoring)** where supervisors and employees continuously track, verify, and calibrate progress against agreed hotel deliverables throughout the quarter.

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   1. PLANNING   │ ───▶  │   2. APPROVAL   │ ───▶  │  3. MONITORING  │ ───▶  │  4. EVALUATION  │
│  (Goal Setting) │       │  (Calibration)  │       │ (Milestone Logs)│       │ (Formal Review) │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 2. KPI Target Progress: Mathematical Formula & Automation

### 2.1 The Weighted Aggregation Formula

In hospitality performance management, each approved objective is assigned a **Priority Weight Allocation** ($W_i$) (e.g. $35\%$ Core, $35\%$ Standard, $30\%$ Operational), totaling $100\%$.

The employee's aggregate **KPI Target Progress** ($P_{\text{overall}}$) is computed dynamically as:

$$P_{\text{overall}} = \frac{\sum_{i=1}^{n} \big( P_i \times W_i \big)}{\sum_{i=1}^{n} W_i}$$

Where:
* $n$ = Total approved objectives for the employee.
* $W_i$ = Percentage weight of objective $i$ (e.g., $35\% \rightarrow 35$).
* $P_i$ = Individual completion progress of objective $i$ ($0\% - 100\%$) derived from shift milestone logs.

### 2.2 Live Calculation Example (Maria Santos — Front Office Host)

| Objective Title | Priority Weight ($W_i$) | Target Metric Benchmark | Logged Actual Metric | Goal Progress ($P_i$) | Weighted Contribution |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **VIP Check-in & NPS Index** | $35\%$ | $\ge +92\text{ NPS}$ | $+94\text{ NPS}$ *(Medallia Log)* | $100\%$ | $35.0\%$ |
| **Front Office Speed** | $35\%$ | $< 60\text{s Response}$ | $52\text{s Response Time}$ | $88\%$ | $30.8\%$ |
| **Upsell & Room Upgrades** | $30\%$ | $+18\%\text{ Beverage / Rev Lift}$ | $+15\%\text{ Avg Check Lift}$ | $80\%$ | $24.0\%$ |
| **Aggregate KPI Met** | **$100\%$** | — | — | — | **$89.8\%$ Met (On Track)** 🟢 |

---

## 3. Progress Status Thresholds & Visual Cues

| Progress Range | Status Category | Color Scheme | Action Triggered |
| :---: | :---: | :---: | :--- |
| **$\ge 90\%$** | **Exceeding Target** | Emerald (`bg-emerald-500`) | Eligible for accelerated merit recognition & succession fast-track. |
| **$75\% - 89\%$** | **On Track** | Primary Blue (`bg-primary`) | Normal shift operations pacing on target. |
| **$< 75\%$** | **Needs Support / At Risk** | Amber (`bg-amber-500`) | Triggers automated supervisor coaching recommendation. |

---

## 4. `performance_monitoring` Database Table & Foreign Keys

### 4.1 SQL Schema Definition
```sql
CREATE TABLE IF NOT EXISTS performance_monitoring (
    id VARCHAR(64) PRIMARY KEY,
    goal_id BIGINT REFERENCES performance_goals(id) ON DELETE CASCADE,
    employee_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    milestone_title VARCHAR(255) NOT NULL,
    actual_metric VARCHAR(255) NOT NULL,
    progress INT NOT NULL DEFAULT 85,
    supervisor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Shift Milestone JSON Record
When a supervisor or employee logs shift deliverables via `openLogMilestoneModal(empId)`:

```json
{
  "id": "mon-9a4f21",
  "goal_id": 22,
  "employee_id": "emp-101",
  "milestone_title": "Front Office Speed & VIP Recognition",
  "actual_metric": "Avg Check-in 46s / 100% Score",
  "progress": 92,
  "supervisor_notes": "Exemplary adherence to Forbes 5-star greeting protocol during dinner rush.",
  "created_at": "2026-08-26T03:25:00Z"
}
```

### 4.3 Automated Multi-Employee Sync Effects
1. **Dynamic Roster Population**: The monitoring table strictly queries `performance_goals` & `performance_monitoring`, displaying ONLY active staff with assigned goals.
2. **Auto-Calculates All Employees**: The engine computes weighted average progress ($W_i$) across all approved goals automatically without requiring manual slider updates.
3. **Database Insertion**: Saves milestone data into the `performance_monitoring` table with foreign keys `goal_id` and `employee_id`.
4. **Dispatches Notifications**: Dispatches an instant celebration alert linked by `goal_id`.


---

## 5. AI Performance Intelligence Coaching Refiner

The **AI Coaching Refiner (`modal-ai-feedback`)** generates grounded hospitality commentary using 3 distinct supervisor tones:

1. **🌟 Motivational (High Performer Recognition)**:
   - Evaluates high attendance rates ($\ge 98\%$) and strong progress ($\ge 85\%$) to produce leadership-readiness feedback.
2. **🎯 Constructive (Development & Skill Calibration)**:
   - Identifies specific gaps between actual shift metric and target benchmark to recommend 1-on-1 coaching or training modules.
3. **⚖️ Accountability (Operational Alignment)**:
   - Reinforces Oxford Suites Standard Operating Procedures (SOPs) during peak shift windows.

---

## 6. Stage Progression Rules (Monitoring ──▶ Evaluation)

1. **Readiness Gate**:
   - An employee becomes ready for **Stage 4: Evaluation** once:
     - All quarterly goals have been **Approved & Calibrated**.
     - Aggregate progress is **$\ge 75\%$ Met** or the scheduled shift review date is reached.
2. **1-Click Evaluation Trigger**:
   - Clicking **`Evaluate`** on any row executes `triggerEvaluationForEmployee(empId)`, which locks the active employee context into `window.selectedEmployeeContext` and transitions directly to **Stage 4: Evaluation**.
