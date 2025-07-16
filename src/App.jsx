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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access"));
  const [fullName, setFullName] = useState(localStorage.getItem("fullName") || "");
  const [photoUrl, setPhotoUrl] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

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
        <Route path="/student/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute> }/>
        <Route path="/student/attendance"element={<PrivateRoute><Attendance /></PrivateRoute>}/>
        <Route path="/student/assignment"element={<PrivateRoute><StudentAssignment /></PrivateRoute>}/>
        <Route path="/profile"element={<PrivateRoute><Profile setIsLoggedIn={setIsLoggedIn}setFullName={setFullName}setPhotoUrl={setPhotoUrl}/> </PrivateRoute>}/>
        <Route path="/teacher/dashboard" element={<PrivateRoute><TeacherDashboard/></PrivateRoute>} />
        <Route path="/teacher/attendance" element={<PrivateRoute><TeacherAttendance/></PrivateRoute>} />
        <Route path="/teacher/assignment" element={<PrivateRoute><TeacherAssignment/></PrivateRoute>} />
        <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard/></PrivateRoute>} />
        <Route path="/admin/attendance" element={<PrivateRoute><AdminAttendance/></PrivateRoute>} />
        <Route path="/admin/assignment" element={<PrivateRoute><TeacherAssignment/></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
