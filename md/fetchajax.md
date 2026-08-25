# Training Management MVC Backend Architecture & Implementation Plan
## With AJAX / Fetch API Integration Layer

## Executive Summary
This implementation plan defines the complete **Model-View-Controller (MVC)** backend architecture with a **Modern AJAX / Fetch API Integration Layer** for the **Training Management Module** at Oxford Suites, Makati.

- **Models (`models/`)**: Dedicated database query layer executing parameterized PDO queries via [config/config.php](file:///opt/lampp/htdocs/Performance-development/config/config.php).
- **Controllers (`controllers/`)**: Business logic layer handling validation, quiz auto-grading, Kirkpatrick calculations, certificate generation, closed-loop triggers (elevating competencies, +150 XP, succession recalibration), and mailer dispatch.
- **Views (`view/`)**: UI presentation templates ([view/training.php](file:///opt/lampp/htdocs/Performance-development/view/training.php), [view/modals.php](file:///opt/lampp/htdocs/Performance-development/view/modals.php)).
- **AJAX Fetch Layer (`js/training.js` & `TrainingAPI`)**: Async `fetch()` client connecting the View layer to the API router with loading spinners, Sonner toast notifications, optimistic UI updates, and graceful error handling.
- **API Gateway (`api/training.php`)**: JSON REST router receiving AJAX requests and returning standardized JSON response envelopes.

---

## 1. System Communication Flow (AJAX & MVC)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          VIEW LAYER (HTML / UI)                             │
│   view/training.php  ───  view/modals.php  (Buttons, Modals, Tables)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ User Events (Click, Submit, Toggle)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 AJAX / FETCH API CLIENT (js/training.js)                    │
│   - TrainingAPI.getNeeds()              - TrainingAPI.updateAttendance()   │
│   - TrainingAPI.createProgram()         - TrainingAPI.submitEvaluation()   │
│   - TrainingAPI.scheduleSession()       - TrainingAPI.getReports()         │
│   - Handles: async/await, Loading State, Error Toasts, Local Cache Sync     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP Fetch (POST / GET / PATCH)
                                       │ Header: Content-Type: application/json
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       API ROUTER (api/training.php)                         │
│   - Validates JSON payload and action routing                               │
│   - Sends Standardized JSON Response Envelope { success, data, message }   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CONTROLLER LAYER (controllers/)                         │
│   - TrainingController.php             - AttendanceController.php           │
│   - EvaluationController.php           - CertificationController.php        │
│   - TrainingIntegrationController.php (Closed-Loop: Competency, XP, Mail)   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MODEL LAYER (models/)                                 │
│   - TrainingNeedModel.php              - AttendanceModel.php                │
│   - TrainingProgramModel.php           - EvaluationModel.php                │
│   - TrainingSessionModel.php           - CertificateModel.php               │
│   - TrainingReportModel.php                                                 │
│   - Prepared Statements via getSupabaseDb() in config/config.php            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. What We Add for the AJAX / Fetch Integration

### 2.1. Standardized JSON Response Envelope (`api/helpers/Response.php` or `api/training.php`)
Every AJAX response returned by the backend will strictly adhere to a consistent contract:

```json
// Success Response (HTTP 200 / 201)
{
  "success": true,
  "data": { ... },
  "message": "Evaluation submitted! +150 XP awarded and certificate generated.",
  "timestamp": "2026-08-26T00:35:00Z"
}

// Error Response (HTTP 400 / 422 / 500)
{
  "success": false,
  "data": null,
  "message": "Validation failed: Attendance must be marked 'Attended' before evaluation.",
  "error_code": "ATTENDANCE_REQUIRED"
}
```

---

### 2.2. Frontend `TrainingAPI` Client Module (`js/training.js`)
A centralized, promise-based API client wrapper using `async/await`:

```javascript
const TrainingAPI = {
    baseUrl: 'api/training.php',

    async request(action, method = 'GET', payload = null) {
        const url = method === 'GET' && payload 
            ? `${this.baseUrl}?action=${action}&${new URLSearchParams(payload)}`
            : `${this.baseUrl}?action=${action}`;

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (payload && method !== 'GET') {
            options.body = JSON.stringify(payload);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Server request failed');
            }
            return result.data;
        } catch (error) {
            console.error(`[TrainingAPI Error] [${action}]:`, error);
            window.showToast(error.message || 'Network error occurred', 'error');
            throw error;
        }
    },

    // 1. Needs & Programs
    getNeeds(filters = {}) { return this.request('get_needs', 'GET', filters); },
    createNeed(data) { return this.request('create_need', 'POST', data); },
    getPrograms(filters = {}) { return this.request('get_programs', 'GET', filters); },
    createProgram(data) { return this.request('create_program', 'POST', data); },

    // 2. Sessions & Rosters
    getSessions(filters = {}) { return this.request('get_sessions', 'GET', filters); },
    getSessionDetails(sessionId) { return this.request('get_session', 'GET', { id: sessionId }); },
    scheduleSession(data) { return this.request('create_session', 'POST', data); },

    // 3. Attendance Check-In Console
    updateAttendance(sessionId, employeeId, status, checkInTime = null) {
        return this.request('update_attendance', 'POST', {
            session_id: sessionId,
            employee_id: employeeId,
            attendance_status: status,
            check_in_time: checkInTime
        });
    },

    // 4. Post-Evaluation & Auto-Grading
    submitEvaluation(payload) {
        return this.request('submit_evaluation', 'POST', payload);
    },

    // 5. Certificate Verification
    getCertificate(certNumber) {
        return this.request('get_certificate', 'GET', { cert_number: certNumber });
    },

    // 6. Department & Audit Reports
    getReports(filters = {}) { return this.request('get_reports', 'GET', filters); }
};
```

---

### 2.3. Asynchronous Workflow Enhancements in the UI

1. **Initial Page Load & Tab Switch**:
   - `initTrainingManagement()` fires `Promise.all([TrainingAPI.getNeeds(), TrainingAPI.getPrograms(), TrainingAPI.getSessions(), TrainingAPI.getReports()])`.
   - Shows clean shimmer/skeleton loading state while data loads.
   - Populates UI states and recalculates KPI counter cards dynamically.

2. **Program Creation & Scheduling Modals**:
   - On clicking *"Save Program"* or *"Schedule Session"*, the submit button disables, showing a loading spinner (`<i class="fas fa-spinner fa-spin"></i>`).
   - Sends AJAX POST to the API.
   - On success: closes modal, displays `window.showToast("Program successfully created!", "success")`, and re-renders the list dynamically without full page reload.

3. **Real-time Attendance Console (Optimistic Check-In)**:
   - On toggling **`Attended`**, **`Absent`**, or **`Completed`**, the UI badge updates immediately (optimistic UI update).
   - An asynchronous PATCH/POST request is sent to `api/training.php?action=update_attendance`.
   - Displays a 2-second Sonner confirmation: `showToast("Attendance marked: Attended for Maria Santos", "success")`.
   - If the request fails, the badge rolls back to its prior state with an error toast.

4. **Knowledge Quiz Submission & Closed-Loop Feedback**:
   - Submitting the quiz triggers `TrainingAPI.submitEvaluation()`.
   - The backend computes the grade, generates the certificate reference (`OXF-CERT-2026-XXXX`), elevates the associate's competency rating, and awards `+150 XP`.
   - The AJAX response returns the result object.
   - UI instantly triggers:
     1. Pass/Fail score display in the modal.
     2. Gold certificate modal reveal with printable view.
     3. Global XP counter increment animation (`+150 XP! Level Up`).
     4. Automatic refresh of the Competency Radar Chart and Succession Bench score in the background.

5. **Live Department Audit Reports**:
   - Filtering by department or quarter triggers an AJAX fetch to reload aggregated completion percentages without refreshing the page.

---

## 3. Directory & File Structure (MVC + AJAX API)

```
Performance-development/
├── config/
│   └── config.php                 # getSupabaseDb() PDO connection & environment loader
├── models/                        # [MODEL] SQL Queries & Database Access
│   ├── TrainingNeedModel.php      # SQL queries for needs & gaps
│   ├── TrainingProgramModel.php   # SQL queries for programs, syllabi, quizzes
│   ├── TrainingSessionModel.php   # SQL queries for sessions, trainers, rosters
│   ├── AttendanceModel.php        # SQL queries for check-in logs & status
│   ├── EvaluationModel.php        # SQL queries for quiz scores & Kirkpatrick feedback
│   ├── CertificateModel.php       # SQL queries for certificates & seal codes
│   └── TrainingReportModel.php    # SQL queries for department/program aggregates
├── controllers/                   # [CONTROLLER] Business Logic & Closed-Loop Engine
│   ├── TrainingController.php     # Program CRUD & session scheduling logic
│   ├── AttendanceController.php   # Check-in validation & attendance gate
│   ├── EvaluationController.php   # Auto-grading quiz engine & passing thresholds
│   ├── CertificationController.php# Unique reference generator (OXF-CERT-YYYY-XXXX)
│   └── TrainingIntegrationController.php # Closed-loop updates (Competencies, XP, Mail)
├── view/                          # [VIEW] Presentation Layer
│   ├── training.php               # HTML dashboard & operational panels
│   └── modals.php                 # Quiz, Evaluation, Certificate, Scheduling modals
├── api/
│   └── training.php               # REST API Router & AJAX JSON Dispatcher
├── js/
│   └── training.js                # TrainingAPI fetch client & UI event listeners
└── mailer.php                     # PHPMailer SMTP email dispatch
```

---

## 4. Verification & Testing Plan

### Automated AJAX & API Testing
- **API Request Validation**: Test invalid action, missing parameters, and malformed JSON payloads.
- **Roster & Attendance AJAX**: Test asynchronous toggle of attendance statuses and verify database state in `session_participants`.
- **Quiz Auto-Grading AJAX**: Test answer submission payload, verify percentage calculation, certificate record creation, and closed-loop database triggers (+150 XP, competency elevation).
- **Report Aggregation AJAX**: Verify department filter queries return accurate percentages.

### Manual UI / Interactive Verification
- Test all buttons and modals in the browser with DevTools Network tab open:
  - Verify all network requests are asynchronous (`fetch`), return `application/json`, and have appropriate HTTP status codes.
  - Verify smooth user feedback with loading spinners and Sonner toasts on every action.
  - Verify no full page reloads occur during any of the 5 operational stages.
