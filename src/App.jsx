import { Route, Routes, useLocation,useNavigate } from "react-router-dom";
import StudentDashboard from "./pages/Student/StudentDashboard";
import Login from "./pages/Login";
import Attendance from "./pages/Student/Attendance";
import Profile from "./pages/Profile";
import PrivateRoute from "./component/PrivateRoute";
import Navbar from "./component/Navbar";
import { useState, useEffect } from "react";
import { getUser, getPhoto } from "./services/Apis";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminAttendance from "./pages/Admin/AdminAttendance";
import TeacherAttendance from "./pages/Teacher/TeacherAttendance";
import TeacherAssignment from "./pages/Teacher/TeacherAssignment";
import StudentAssignment from "./pages/Student/StudentAssignment";
import AddAssignment from "./pages/Teacher/AddAssignment";
import { ClassList,SubjectList } from "./services/Apis";
import AssignmentDetails from "./pages/Teacher/AssignmentDetails";
import ViewAssignment from "./pages/Student/ViewAssignment";
import Tmarksheet from "./pages/Teacher/Tmarksheet";
import AddMarksheet from "./pages/Teacher/AddMarksheet";
import ViewMarksheet from "./pages/Student/ViewMarksheet";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access"));
  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "");
  const [photoUrl, setPhotoUrl] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    

  const location = useLocation();

  

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await getUser();
        const user = Array.isArray(userData) ? userData[0] : userData;
        setFullName(user?.data?.full_name || "");
        setRole(user?.data?.role || "");
        
        const photoResponse = await getPhoto();
        if (photoResponse?.profile_picture_url) {
          setPhotoUrl(photoResponse.profile_picture_url);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await ClassList();
        setClasses(data);
      } catch (error) {
        console.error("Error loading class list", error);
      }
    };

    fetchClasses();
  }, []);

  // Fetch subjects when selected class changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedClass) {
        try {
          const subjectData = await SubjectList(selectedClass);
          setSubjects(subjectData);
        } catch (error) {
          console.error("Error loading subject list", error);
        }
      }
    };

    fetchSubjects();
  }, [selectedClass]);

  const showNavbar = location.pathname !== "/";

  return (
    <div className="w-screen min-h-screen bg-background">
      {showNavbar && (
        <Navbar
          fullName={fullName}
          photoUrl={photoUrl}
          setIsLoggedIn={setIsLoggedIn}
          role={role}
        />
      )}
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/student/dashboard" element={<PrivateRoute expectedRole="student" ><StudentDashboard /></PrivateRoute> }/>
        <Route path="/student/attendance"element={<PrivateRoute expectedRole="student" ><Attendance /></PrivateRoute>}/>
        <Route path="/student/assignment"element={<PrivateRoute expectedRole="student" ><StudentAssignment /></PrivateRoute>}/>
        <Route path="/student/assignment/details/:id" element={<PrivateRoute expectedRole="student" ><ViewAssignment/></PrivateRoute>}/>
        <Route path="/student/grades" element={<PrivateRoute expectedRole="student" ><ViewMarksheet/></PrivateRoute>}/>
        <Route path="/profile"element={<PrivateRoute><Profile setIsLoggedIn={setIsLoggedIn}setFullName={setFullName}setPhotoUrl={setPhotoUrl}/> </PrivateRoute>}/>
        <Route path="/teacher/dashboard" element={<PrivateRoute expectedRole="teacher" ><TeacherDashboard/></PrivateRoute>} />
        <Route path="/teacher/attendance" element={<PrivateRoute expectedRole="teacher" ><TeacherAttendance classes={classes}
            selectedClass={selectedClass} setSelectedClass={setSelectedClass} /></PrivateRoute>} />
        <Route path="/teacher/assignment" element={<PrivateRoute expectedRole="teacher" ><TeacherAssignment  classes={classes}
            subjects={subjects}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass} /></PrivateRoute>} />
        <Route path="/teacher/create/assignment" element={<PrivateRoute expectedRole="teacher" ><AddAssignment classes={classes}
            subjects={subjects} selectedClass={selectedClass}   setSelectedClass={setSelectedClass}  /></PrivateRoute>} />
          <Route path="/teacher/assignment/details/:id" element={<PrivateRoute expectedRole="teacher" ><AssignmentDetails/></PrivateRoute>}/>
          <Route path="/teacher/marksheet" element={<PrivateRoute expectedRole="teacher" ><Tmarksheet /></PrivateRoute>}/>
          <Route path="/teacher/create/marksheet" element={<PrivateRoute expectedRole="teacher" ><AddMarksheet /></PrivateRoute>}/>
        <Route path="/admin/dashboard" element={<PrivateRoute expectedRole="admin" ><AdminDashboard/></PrivateRoute>} />
        <Route path="/admin/attendance" element={<PrivateRoute expectedRole="admin" ><AdminAttendance/></PrivateRoute>} />
        <Route path="/admin/assignment" element={<PrivateRoute expectedRole="admin" ><TeacherAssignment/></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
