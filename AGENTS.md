# Build Spec for Coding Agent
## Performance and Development Management System — Hotel/Restaurant Operations
### Focus: Training Management · Succession Planning · Social Recognition

This spec reconciles the reference documents (Oxford Suites detailed spec + module-connections doc) into concrete build instructions. Follow the decisions in Section 0 first — they resolve conflicts between source documents before any code is written.

---

## 0. Architecture Decisions (resolve before building)

**0.1 — Module count stays at 6.**
Official modules: Performance, Competency, Learning (LMS), Training, Succession, Social Recognition.
**Dashboard, Notifications, and Reports are cross-cutting system layers, not modules.** They read from the 6 modules but are not counted as deliverables themselves. Do not create top-level nav items implying they're peer modules to the 6 — they can still be full pages/services in the codebase.

**0.2 — LMS stays thin for this build.**
Learning Management is a coordination/status layer over Training Management, not a full content-authoring LMS. It supports: SOP book reading records, a single quiz per SOP item, pass/fail, and an overdue-alert trigger. No video hosting, no course authoring UI, no adaptive paths.

**0.3 — 9-Box Grid needs two explicit axes.**
- **X-axis (Performance):** the calibrated Performance Management score (0–5 scale).
- **Y-axis (Potential):** the Competency Match % from the Succession readiness formula (Section 3.2).
Do not implement the 9-Box as a single-score lookup — it must plot two independent values.

**0.4 — All inter-module effects are direct function/service calls, not a message queue.**
E.g. `TrainingController::recordEvaluation()` calls `CompetencyService::updateSkillLevel()` directly in the same request. No event bus, no async workers, for this timeline.

**0.5 — XP/points is one unified ledger, not per-module counters.**
Single table `xp_transactions` with a `source_type` enum (`peer_kudos`, `supervisor_kudos`, `gm_citation`, `lms_quiz`). All XP grants — whether from Social Recognition posts or LMS quiz passes — insert into this one table. Badge threshold checks always query this table, never a per-module count.

**0.6 — Gemini boundary (applies to all 3 modules).**
Gemini may read/score free text (coaching notes, recognition messages, evaluation comments) for sentiment. Gemini never sets a rating, competency score, XP value, badge, or succession flag. All of those stay deterministic backend logic or human-entered.

---

## 1. Training Management

### 1.1 Workflow (6 stages)
1. **Need Identified** — triggered by either a Competency skill-gap alert (below-benchmark score) or a manually flagged Mandatory Compliance category (e.g. HACCP, Fire Safety).
2. **Program Creation** — syllabus/modules, target competency, passing threshold (default 80%).
3. **Scheduling** — trainer (internal or external), venue, date/time, participant roster (auto-populated from the gap alert if applicable).
4. **Attendance** — status: `attended` / `absent` / `completed`. **Attendance gate: evaluation stage is locked until status = attended or completed.**
5. **Evaluation & Result** — Part A: auto-graded quiz (score ≥ threshold to pass). Part B: 1–5 star Kirkpatrick Level 1 feedback (trainer mastery, relevance). Logs score, pass/fail, certificate reference code.
6. **Training Report** — aggregated attendance % and completion % grouped by department and program. Read-only, no write-back.

### 1.2 Outbound connections (implement all of these)
- **→ Competency Management:** on pass, call `CompetencyService::updateSkillLevel(employee_id, competency_id, new_score)`.
- **→ Learning/IDP:** on pass, mark the linked development task as 100% complete.
- **→ xp_transactions:** on certificate issuance, insert `source_type = 'training_cert'`, amount per config (e.g. +150 XP).
- **→ Succession Planning:** on pass, trigger a recalculation of that employee's readiness index (Section 3.1) since competency match % has changed.

### 1.3 Data model notes
- `trainings` table: id, name, linked_competency_id (nullable), compliance_category (nullable), threshold_pct, status
- `training_sessions`: training_id, trainer_id, venue, scheduled_at
- `training_attendance`: session_id, employee_id, status enum
- `training_results`: session_id, employee_id, quiz_score, kirkpatrick_rating, cert_ref, passed (bool)

---

## 2. Succession Planning

### 2.1 Workflow (5 steps)
1. **Data Pull** — pull the employee's latest *closed/calibrated* Performance score and current competency levels across all assessed dimensions. Only closed cycles count — never pull an in-progress evaluation.
2. **Readiness Computation** — formula:
 `readiness_index = (closed_performance_score × 0.40) + (competency_match_pct × 0.60)`
 Store both the computed index and a classification label (e.g. "94% — High Capability").
3. **HR Calibration & Bench Review** — HR views a side-by-side diagnostic table (tenure, performance history, competency strengths/gaps) plus the 9-Box Grid (Section 0.3 axes).
4. **HR-Only Flag Assignment** — HR manually sets one of three flags. **This must not be settable by any role other than HR; enforce at the controller/permission level, not just the UI.**
 - Ready Now (0–6 months)
 - Ready in 1–2 Years
 - Not Ready
5. **Succession Record** — persisted per (department, target_role) pair: current incumbent, transition horizon, risk of loss, bench strength, primary successor, emergency backup.

### 2.2 Recalculation triggers
The readiness_index must recalculate automatically whenever:
- A Performance Management cycle closes for that employee, OR
- A Training Management pass event upgrades a relevant competency score (Section 1.2)

Do not require a manual "recompute" button as the primary path — it should be a background recalculation call inside those two events' service methods.

### 2.3 Outbound connections
- **→ IDP:** if flag = "Ready in 1–2 Years", auto-generate prioritized leadership development goals.
- **→ Reports:** bench depth / leadership pipeline metrics, read-only export.
- **→ Notifications:** if a critical role has zero identified successors, fire a vacancy-risk alert.

### 2.4 Data model notes
- `succession_targets`: department, target_role, current_incumbent_id
- `succession_candidates`: target_id, employee_id, readiness_index, hr_flag enum, primary/backup bool
- Recompute `readiness_index` via a service method, not a stored trigger, so the 40/60 weighting stays adjustable in one place (`SuccessionService::computeReadiness()`).

---

## 3. Social Recognition

### 3.1 Two entry points — both must be implemented
1. **Manual post** — Peer or Supervisor selects recipient(s), category, writes commendation text.
2. **Automatic grant** — LMS fires an XP grant on quiz pass with no post/category (system-generated, `source_type = 'lms_quiz'`).

### 3.2 Workflow (7 steps)
1. Recognition triggered (manual post or automatic LMS event).
2. Deterministic point calculation — fixed values, not configurable by end users:
 - Peer-to-Peer: +50 XP
 - Supervisor Commendation: +100 XP
 - GM Citation: +200 XP
 - LMS quiz pass: XP value defined by the LMS config, passed through unchanged
3. Insert into unified `xp_transactions` ledger (Section 0.5) — immutable, never update/delete existing rows, only insert.
4. Badge threshold check — query cumulative `xp_transactions` (or category-specific counts) against fixed thresholds (e.g. Team Anchor: 5+ peer recognitions). Award badge record if crossed.
5. Post to public team feed — department-filterable, with reaction counters (👏 ❤️ ⭐ 🔥). LMS-triggered grants do not need to post to the visible feed (system XP, not a social post) — confirm this with your adviser, but default to: only manual posts appear on the feed; LMS XP grants are ledger-only.
6. Log to Notifications audit trail — every ledger insert (manual or automatic) also writes an audit log entry.
7. Forward to two consumers:
 - **Performance Management:** commendation text + badge list aggregated as qualitative input into the appraisal's calibration discussion step — read-only pull, do not duplicate storage.
 - **Dashboard:** aggregate sentiment/engagement number feeds the climate widget.

### 3.3 Explicit non-connections (do not build these links)
- No direct write path from Social Recognition to Competency Management.
- No direct write path from Social Recognition to Training Management.
- Any influence on Succession Planning is indirect only, via Performance Management's calibrated score — do not let recognition data touch `succession_candidates` directly.

### 3.4 Data model notes
- `xp_transactions`: id, sender_id (nullable for system-generated), recipient_id, source_type enum, category (nullable), amount, note (nullable), created_at — treat as append-only
- `badges`: id, name, threshold_rule (reference to a rule, not hardcoded per row)
- `employee_badges`: employee_id, badge_id, awarded_at
- Feed visibility flag on `xp_transactions` (or a separate `recognition_posts` table) to distinguish "shown on wall" vs "ledger only" per 3.2 step 5.

---

## 4. Build order for this batch

1. `xp_transactions` + `badges` tables first — both Training and Social Recognition write to this, build it once.
2. Training Management (Sections 1) — it's the upstream trigger for Succession recalculation.
3. Social Recognition (Section 3) — depends on the ledger table from step 1.
4. Succession Planning (Section 2) — depends on Training's competency updates and Performance's closed scores, build last of the three.

Do not build Succession Planning's HR flag UI before the readiness_index computation is working end-to-end — HR reviewing an empty/placeholder matrix defeats the point of the calibration step.