# AcademicERP Backend API Endpoints & Frontend Integration Guide

## Table of Contents
- [General Info](#general-info)
- [Authentication](#authentication)
- [User & Role Management](#user--role-management)
- [Dean Services](#dean-services)
- [Other Services](#other-services)
- [Frontend Integration Example](#frontend-integration-example)

---

## General Info
- **Base API URL:** `/api/` (adjust as needed for your deployment)
- All endpoints require JWT authentication unless otherwise noted.

---

## Authentication
- **Obtain Token:**
  - `POST /auth/jwt/create/` (Djoser/SimpleJWT)
    - Payload: `{ "username": "<username>", "password": "<password>" }`
    - Response: `{ "access": "<token>", "refresh": "<token>" }`
- **Refresh Token:**
  - `POST /auth/jwt/refresh/`
- **User Info:**
  - `GET /auth/users/me/`

---

## User & Role Management
- **List Users:** `GET /auth/users/`
- **Create User:** `POST /auth/users/`
- **Edit User Role:** Use Django admin or PATCH `/auth/users/{id}/` (role field)

---

## Dean Services

### Academic Decisions
- `GET /api/dean/academic-decisions/` — List all academic decisions
- `GET /api/dean/academic-decisions/students/` — List students needing attention (filters: `gpa`, `warnings`, `department`)
- `POST /api/dean/academic-decisions/issue/` — Issue warning/dismissal
  - Payload: `{ "student": <user_id>, "decision_type": "first-warning"|"second-warning"|"dismissal", "notes": "..." }`

### Study Plan Approval
- `GET /api/dean/plan-approval/` — List all study plans
- `POST /api/dean/plan-approval/{id}/approve/` — Approve a plan
- `POST /api/dean/plan-approval/{id}/return/` — Return a plan for revision (payload: `{ "notes": "..." }`)

### Meeting Signatures
- `GET /api/dean/meetings/` — List meetings
- (Extendable: add POST for signing if needed)

### Dashboard Stats & Activity
- `GET /api/dean/dashboard/stats/` — Quick stats for dashboard
- `GET /api/dean/dashboard/recent-activity/` — Recent activity log

---

## Other Services

### Schedules
- `GET /api/schedules/` — List schedules
- `POST /api/schedules/` — Create schedule
- `PUT/PATCH /api/schedules/{id}/` — Update schedule
- `DELETE /api/schedules/{id}/` — Delete schedule

### Meetings
- `GET /api/meetings/` — List meetings
- `POST /api/meetings/` — Create meeting
- `PUT/PATCH /api/meetings/{id}/` — Update meeting
- `DELETE /api/meetings/{id}/` — Delete meeting

### Study Plans
- `GET /api/study-plans/` — List study plans
- `POST /api/study-plans/` — Create study plan
- `PUT/PATCH /api/study-plans/{id}/` — Update study plan
- `DELETE /api/study-plans/{id}/` — Delete study plan

### Recent Activities
- `GET /api/recent-activities/` — List recent activities (read-only)

---

## Frontend Integration Example

### 1. **Login and Store Token**
```js
// Example using fetch
fetch('/auth/jwt/create/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'dean1', password: 'yourpassword' })
})
  .then(res => res.json())
  .then(data => localStorage.setItem('access', data.access));
```

### 2. **Authenticated API Call**
```js
fetch('/api/dean/dashboard/stats/', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('access') }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### 3. **CORS**
- Ensure your Django `settings.py` includes your frontend URL in `CORS_ALLOWED_ORIGINS`.

### 4. **Role-based Access**
- Only users with the correct `role` (e.g., `dean`) can access Dean endpoints.
- Assign roles via Django admin or user creation API.

---

## Notes
- All endpoints are RESTful and follow standard DRF conventions.
- For more details, see your Django admin or the code in `profiles/urls.py` and `profiles/views.py`. 