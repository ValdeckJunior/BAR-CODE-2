# QR Campus – Project Overview & Frontend Flow

This document provides a comprehensive overview of the QR Campus frontend application, detailing user flows, processes, and the data handled. It is designed to inform the creation of a robust Product Requirements Document (PRD) for the backend API and services.

---

## 1. User Roles

- **Student**: Can log in, view and manage their profile, generate and display their personal QR code, scan course QR codes, view registered courses, and see results.
- **Staff/Admin** (future): May verify student QR codes and manage course registrations (not yet implemented in frontend).

---

## 2. Authentication Flow

- **Login**: Student logs in using matriculation number and password.
  - On success: Receives a JWT token and user profile data (including registered courses).
  - On failure: Error message is shown.
- **Session Persistence**: Auth state (token, user) is stored locally (AsyncStorage). On app launch, the frontend attempts to restore the session.
- **Logout**: Clears all stored user data and token.

**Backend endpoints needed:**

- `POST /auth/login` (matricule, password → token, user)
- `GET /auth/me` (token → user)

---

## 3. Student Profile & QR Code

- **Profile**: Displays student details (matricule, name, department, semester, level, academic year, registered courses).
- **Personal QR Code**: Encodes student info for identification. Can be displayed and downloaded.

**Backend endpoints needed:**

- `GET /students/:matricule` (returns student profile)
- `GET /students/:matricule/qrcode` (returns QR code data or image)

---

## 4. Course Management

- **Course List**: Shows all available and registered courses, with filters (semester, registration status, sort).
- **Course Details**: Shows detailed info for each course.
- **Course Registration**: (future) Allows students to register/unregister for courses.

**Backend endpoints needed:**

- `GET /courses` (list all courses)
- `GET /courses/:id` (course details)
- `POST /courses/:id/register` (register student for course)
- `POST /courses/:id/unregister` (unregister student)

---

## 5. QR Code Scanning & Verification

- **Scan Flow**:

  1. Student scans a QR code (e.g., at a classroom or event).
  2. App decodes QR data (course or student info).
  3. If offline, scan is saved to pending queue.
  4. If online, scan is sent to backend for verification/registration.
  5. On success, course registration is updated locally.

- **Pending Scans**: If offline, scans are stored and retried when network is available.

**Backend endpoints needed:**

- `POST /scans` (scan data → verification/registration)
- `GET /students/:matricule/courses` (list registered courses)

---

## 6. Results & Academic Records

- **Results View**: Student can view results for registered courses.

**Backend endpoints needed:**

- `GET /students/:matricule/results` (returns results per course)

---

## 7. State Management & Storage

- Uses Redux Toolkit for global state (auth, courses).
- Uses AsyncStorage for persistence (token, user, courses, pending scans).
- Data is validated and revalidated on app start and after key actions.

---

## 8. Error Handling & Edge Cases

- Handles network errors, invalid credentials, invalid QR codes, and data corruption.
- Provides user feedback for all error states.
- Ensures data consistency between local state and backend.

---

## 9. Technology Stack (Frontend)

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State**: Redux Toolkit
- **Storage**: AsyncStorage
- **UI**: Custom components, native theming, animations

---

## 10. Suggested Backend API Summary

| Endpoint                     | Method | Description                           |
| ---------------------------- | ------ | ------------------------------------- |
| /auth/login                  | POST   | Login, returns token and user profile |
| /auth/me                     | GET    | Get current user profile              |
| /students/:matricule         | GET    | Get student profile                   |
| /students/:matricule/qrcode  | GET    | Get student QR code                   |
| /students/:matricule/courses | GET    | List registered courses               |
| /students/:matricule/results | GET    | Get results for student               |
| /courses                     | GET    | List all courses                      |
| /courses/:id                 | GET    | Get course details                    |
| /courses/:id/register        | POST   | Register student for course           |
| /courses/:id/unregister      | POST   | Unregister student from course        |
| /scans                       | POST   | Submit scan data for verification     |

---

## 11. User Flow Summary

1. **Login** → 2. **Profile/QR** → 3. **View Courses** → 4. **Scan QR** → 5. **Register/Verify** → 6. **View Results**

---

## 12. Special Notes on User Accounts & Lecturer Flow

### Pre-Provisioned Student Accounts
- All student accounts are pre-created and imported from the university's main app (mocked for now, as there is no official API yet).
- Each student account comes with courses already assigned based on semester and academic year.
- No student self-registration; all data is managed centrally and synced to the frontend.

### Home Screen (Student)
- After login, students immediately see their personal QR code, which encodes their identity and registered courses.
- The QR code is ready for download and can be used for verification or attendance.

### Lecturer/Staff Scan Flow
- On the login screen, lecturers can access a scan button to scan student QR codes.
- Scanning a QR code retrieves the student's registered courses and details for verification or attendance purposes.
- This flow is designed for staff/lecturers to quickly verify student enrollment in specific courses or events.

---

This document should serve as a blueprint for backend requirements and API design, ensuring all frontend flows are supported and data integrity is maintained throughout the app lifecycle.
