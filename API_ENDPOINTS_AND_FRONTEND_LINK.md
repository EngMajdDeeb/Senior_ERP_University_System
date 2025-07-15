## Authentication
- **Obtain Token:**
  - `POST /auth/jwt/create/` (Djoser/SimpleJWT)
    - Payload: `{ "username": "<username>", "password": "<password>" }`
    - Response: `{ "access": "<token>", "refresh": "<token>" }`
    - **Decoded JWT now includes:** `"role": "<user_role>"`
- **Refresh Token:**
  - `POST /auth/jwt/refresh/`
- **User Info:**
  - `GET /auth/users/me/` (returns user details including role)

## User & Role Management
- **List Users:** `GET /auth/users/`
- **Create User:** `POST /auth/users/`
- **Edit User Role:** Use Django admin or PATCH `/auth/users/{id}/` (role field)

## Schedules
- `GET /api/schedules/` — List schedules
- `POST /api/schedules/` — Create schedule
- `PUT/PATCH /api/schedules/{id}/` — Update schedule
- `DELETE /api/schedules/{id}/` — Delete schedule

## Meetings
- `GET /api/meetings/` — List meetings
- `POST /api/meetings/` — Create meeting
- `PUT/PATCH /api/meetings/{id}/` — Update meeting
- `DELETE /api/meetings/{id}/` — Delete meeting

## Study Plans
- `GET /api/study-plans/` — List study plans
- `POST /api/study-plans/` — Create study plan (teacher/admin only)
- `PUT/PATCH /api/study-plans/{id}/` — Update study plan (teacher/admin only)
- `DELETE /api/study-plans/{id}/` — Delete study plan (teacher/admin only)

## Recent Activities
- `GET /api/recent-activities/` — List recent activities (read-only)

## Dean Services
- `GET /api/dean/meetings/` — List meetings (dean only)
- `GET /api/dean/academic-decisions/` — List academic decisions (dean only)
- `GET /api/dean/academic-decisions/students/` — List students needing attention (dean only)
- `POST /api/dean/academic-decisions/issue/` — Issue warning/dismissal (dean only)
- `GET /api/dean/plan-approval/` — List all study plans (dean only)
- `POST /api/dean/plan-approval/{id}/approve/` — Approve a plan (dean only)
- `POST /api/dean/plan-approval/{id}/return/` — Return a plan for revision (dean only)
- `GET /api/dean/dashboard/stats/` — Dashboard stats (dean only)
- `GET /api/dean/dashboard/recent-activity/` — Recent activity log (dean only)

## Notes
- All endpoints require JWT authentication unless otherwise noted.
- The JWT token now includes the user's role for frontend role-based routing.