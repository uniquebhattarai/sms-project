import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Attendance from "./pages/Attendance";
import Profile from "./pages/Profile";
import PrivateRoute from "./component/PrivateRoute";
import Navbar from "./component/Navbar";
import { useState, useEffect } from "react";
import { getStudent, getPhoto } from "./services/Apis";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const location = useLocation();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const studentData = await getStudent();
        const user = Array.isArray(studentData) ? studentData[0] : studentData;
        setFullName(user?.data?.full_name || "");

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
        />
      )}
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile
                setIsLoggedIn={setIsLoggedIn}
                setFullName={setFullName}
                setPhotoUrl={setPhotoUrl}
              />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
