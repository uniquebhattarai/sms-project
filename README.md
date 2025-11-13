#  Student Score Prediction System (Frontend)

 **Live Demo:** [https://sms-project-frontend.vercel.app/](https://sms-project-frontend.vercel.app/)


The **Student Score Prediction System** is a web-based application that predicts students’ academic performance using machine learning models.  
This repository contains the **frontend**, built with **React (Vite)** and styled using **Tailwind CSS v4**.

It provides an intuitive interface for uploading student data, visualizing predicted scores, and managing user dashboards.

---

##  Features
-  Predicts student academic scores based on input parameters  
-  Integration with trained ML model via API  
-  JWT-based authentication  
-  Role-based dashboards (Student, Teacher, Admin)  
-  Data visualization of predicted and actual scores  
-  Modern and responsive UI with Tailwind CSS  

---

##  Tech Stack

| Layer | Technologies Used |
|--------|-------------------|
| **Frontend** | React (Vite), Tailwind CSS v4 |
| **UI/UX** | ShadCN/UI, Lucide React, Framer Motion |
| **API Handling** | Axios (custom `apiConnector.js`) |
| **Routing** | React Router DOM |
| **Backend (for reference)** | Django REST Framework + ML Model |

---

##  Installation and Setup

Follow these steps to run the frontend locally:

```bash
# 1️ Clone the repository
git clone https://github.com/your-username/student-score-prediction-frontend.git

# 2️ Move into the directory
cd student-score-prediction-frontend

# 3️ Install dependencies
npm install

# 4️ Start the development server
npm run dev

##  Project Screenshots

###  Student Views
<p align="center">
  <img src="./screenshots/login.png" alt="Login Page" width="300"/>
  <img src="./screenshots/StudentPrediction.png" alt="Student Dashboard" width="300"/>
  <img src="./screenshots/StudentMarksheet.png" alt="Student Marksheet" width="300"/>
  <img src="./screenshots/Attendance.png" alt="Student Attendance" width="300"/>
  <img src="./screenshots/Assignments.png" alt="Student Assignments" width="300"/>
</p>

###  Teacher Views
<p align="center">
  <img src="./screenshots/AssignmentManagement.png" alt="Assignment Management" width="300"/>
  <img src="./screenshots/CreateAssignment.png" alt="Create Assignment" width="300"/>
  <img src="./screenshots/AssignmentEdit.png" alt="Assignment Edit" width="300"/>
  <img src="./screenshots/AssignmentMark.png" alt="Assignment Mark" width="300"/>
  <img src="./screenshots/ClassParticipation.png" alt="Class Participation" width="300"/>
</p>

###  Admin Views
<p align="center">
  <img src="./screenshots/AdminDashboard.png" alt="Admin Dashboard" width="300"/>
  <img src="./screenshots/AdminPrediction.png" alt="Admin Prediction" width="300"/>
  <img src="./screenshots/AdminAttendance.png" alt="Admin Attendance" width="300"/>
  <img src="./screenshots/AddMarksheet.png" alt="Add Marksheet" width="300"/>
  <img src="./screenshots/ManageUserStudent.png" alt="Manage User Student" width="300"/>
  <img src="./screenshots/ManageTeacher.png" alt="Manage Teacher" width="300"/>
</p>

