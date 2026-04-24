# Primary Student Grading System

This project is a comprehensive **Primary Student Grading System** developed for the **INF221 Web Design and Development** (Business Processes - Modelling & Design) course.

## 👥 Team Members - Thursday Group 5

| Registration Number | Name |
| :--- | :--- |
| BSC/INF/09/24 | Mike Prosper Kamanga |
| BED/COM/03/24 | Shadreck Lizard |
| BED/COM/25/24 | Mwiza Simbeye |
| BED/COM/40/24 | Chisomo Pensulo |
| BSC/COM/37/24 | Faith Mwitha |

## 🎯 Project Goal

To design and develop a website that assists primary teachers in the grading of end-of-term results for their students.

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: Oracle (with TypeORM)
- **Authentication**: JWT (JSON Web Tokens)

## 👥 Roles & Users

- **Administrator**: Manages teacher accounts, assigns classes, and subjects.
- **Teacher**: Registers students, enters grades, verifies records, and generates report cards for their class.
- **HeadTeacher**: Views class and school-wide grade overviews and reviews generated reports.

## ✨ Functional Requirements

### 1. Registration
- **FR1.1**: The system shall allow an administrator to create a teacher account.
- **FR1.2**: The system shall allow the administrator to assign the subject(s) and class that a teacher teaches.
- **FR1.3**: The system shall allow the teacher to register his/her students.

### 2. Grade Processing
- **FR2.1**: The system shall compute the final end-of-term grades and generate a school report for the headteacher to view.
- **FR2.2**: The system shall generate report cards and grade records in PDF form.
- **FR2.3**: The system shall perform sort and filter operations on student grade records.
- **FR2.4**: The system shall enable the teacher to edit the grade of a student if a mistake was made.
- **FR2.5**: The system shall display the entered grades to the teacher for cross-checking before processing.
- **FR2.6**: The system shall display an overview of student grades.

### 3. Password Management
- **FR3.1**: The system shall allow the teacher to create or change their account password.
- **FR3.2**: The system shall verify the identity of the teacher when changing their password through two-step authentication.

### 4. Authentication
- **FR4.1**: The system shall enable users to login and logout.

## 🔌 REST Endpoints

### Authentication
| Endpoint | Method | Description | Request Body / Parameters |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | POST | Authenticate a user and return a session token | `{ username, password }` |
| `/api/v1/auth/logout` | POST | Logout user | - |
| `/api/v1/auth/me` | GET | Retrieve the profile of the current authenticated user | - |
| `/api/v1/auth/reset` | PUT | Initiate a password reset; sends a verification code to user’s email | `{ email }` |
| `/api/v1/auth/verify` | POST | Complete two-step identity verification sent to user’s email | `{ otp }` |
| `/api/v1/auth/password` | PUT | Set a new password after identity has been verified | `{ newPassword, confirmPassword }` |

### Users
| Endpoint | Method | Description | Request Body / Parameters |
| :--- | :--- | :--- | :--- |
| `/api/v1/users` | POST | Create a new teacher/headteacher account in the system (admin only) | `{ name, email, ... }` |
| `/api/v1/users` | GET | List all teacher accounts | Query params |
| `/api/v1/users/:id` | GET | Retrieve full profile details for a specific user account | Path: `id` |
| `/api/v1/users/:id` | PUT | Update account details for a specific teacher | `{ ... }` |
| `/api/v1/users/:id` | DELETE | Permanently delete a teacher account (admin only) | Path: `id` |
| `/api/v1/users/:id/subjects` | GET | List all subjects assigned to a specific teacher | Path: `id` |
| `/api/v1/users/:id/class` | GET | Get the class that a specific teacher is assigned to | Path: `id` |
| `/api/v1/users/:id/subjects` | POST | Assign one or more subjects to a teacher (admin only) | `{ Path: id, ... }` |
| `/api/v1/users/:id/class` | PUT | Assign or change the class a teacher is responsible for (admin only) | `{ Path: id, ..., ClassId }` |

### Students
| Endpoint | Method | Description | Request Body / Parameters |
| :--- | :--- | :--- | :--- |
| `/api/v1/students` | POST | Register a new student (authenticated teachers only) | `{ fullName, dateOfBirth, class, ... }` |
| `/api/v1/students` | GET | List all students; teachers see only their class | Query Params |
| `/api/v1/students/:id` | GET | Retrieve personal details and class info for a specific student | Path: `id` |
| `/api/v1/students/:id` | PUT | Update details for a specific student record | `{ Path: id, details... }` |
| `/api/v1/students/:id` | DELETE | Remove a student from the system (class teacher only) | Path: `id` |
| `/api/v1/students/:id/grades` | GET | Retrieve all grade records for a specific student | Path: `id` |

### Reports
| Endpoint | Method | Description | Request Body / Parameters |
| :--- | :--- | :--- | :--- |
| `/api/v1/reports/generate` | POST | Generate end-of-term report cards for all students in a class | `{ class, term }` |
| `/api/v1/reports/student/:id` | GET | Download the PDF report card for a specific student | `{ Path: id, term }` |
| `/api/v1/reports/class/:class` | GET | Download a consolidated PDF grade record for an entire class | `{ Path: class, term }` |
| `/api/v1/reports/class/:class/overview` | GET | Retrieve a summary report of class performance including averages | `{ Path: class, term }` |

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (usually comes with Node.js)
- **Oracle Database** (or access to an Oracle instance/PDB)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd student-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory (if not already present):
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Oracle database connection details:
   ```env
   ORACLE_USER=admin
   ORACLE_PASSWORD=yourpassword
   ORACLE_CONNECT_STRING=localhost:1521/ORCLPDB1
   PORT=3000
   ```

### Running the Application

Start the development server:
```bash
npm run start:dev
```

The application will be accessible at `http://localhost:3000`.

## 📂 Project Structure

```
student-management-system/
├── src/
│   ├── auth/          # Authentication module (JWT, Guards)
│   ├── users/         # Users module (Teachers, Admins, Headteachers)
│   ├── students/      # Students module (Registration, details)
│   ├── reports/       # Reports module (Grades, PDF generation)
│   ├── app.module.ts  # Root module
│   └── main.ts        # Application entry point
├── test/              # E2E tests
├── .env               # Environment variables
└── package.json       # Project dependencies
```

## 📝 License
This project is for academic purposes as part of the INF221 Group Assignment.
