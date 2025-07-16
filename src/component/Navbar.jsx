import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  FiLogOut,
  FiUser,
  FiCalendar,
  FiFileText,
  FiTrello,
  FiClock,
} from "react-icons/fi";
import { Toast } from "../../utils/Toast";

// Avatar Menu Component
function AvatarMenu({ setIsLoggedIn, fullName = "User", photoUrl = null }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fallbackAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    fullName
  )}&backgroundColor=3B82F6&fontColor=ffffff`;

  const avatarUrl = photoUrl ? `${photoUrl}?t=${Date.now()}` : fallbackAvatar;

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    Toast.success("Logged out successfully!", {
      position: "top-right",
    });
    navigate("/");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 hover:cursor-pointer"
      >
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-20">
          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-6 h-6 rounded-full"
            />
            {fullName}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

// Navbar Component
export function Navbar({ setIsLoggedIn, fullName, photoUrl, role }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="relative z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg">
        <div className="px-4 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none hover:cursor-pointer"
              >
                <RxHamburgerMenu className="w-6 h-6 text-white" />
              </button>
              <Link
                to={
                  role === "student"
                    ? "/student/dashboard"
                    : role === "teacher"
                    ? "teacher/dashboard"
                    : "admin/dashboard"
                }
                className="flex items-center gap-3 "
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/20 ">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
              </Link>
            </div>

            <AvatarMenu
              fullName={fullName}
              photoUrl={photoUrl}
              setIsLoggedIn={setIsLoggedIn}
            />
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={toggleMenu}
          />
          <div className="fixed left-0 top-0 z-40 w-72 h-full bg-white shadow-2xl transform transition-transform duration-300">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Menu</h2>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="p-4">
              <div className="space-y-2">
                {/* Student menu */}
                {role === "student" && (
                  <>
                    <Link
                      to="/student/dashboard"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={toggleMenu}
                    >
                      <FiTrello className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/student/attendance"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={toggleMenu}
                    >
                      <FiCalendar className="w-5 h-5" />
                      Attendance
                    </Link>
                    <Link
                      to="/student/assignment"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={toggleMenu}
                    >
                      <FiFileText className="w-5 h-5" />
                      Assignments
                    </Link>
                    <Link
                      to="/student/grades"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={toggleMenu}
                    >
                      <FiTrello className="w-5 h-5" />
                      Grades
                    </Link>
                    <Link
                      to="/student/schedule"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={toggleMenu}
                    >
                      <FiClock className="w-5 h-5" />
                      Schedule
                    </Link>
                  </>
                )}

                {/* Teacher menu */}
                {role === "teacher" && (
                  <>
                    <Link
                      to="/teacher/dashboard"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={toggleMenu}
                    >
                      <FiTrello className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/teacher/attendance"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={toggleMenu}
                    >
                      <FiCalendar className="w-5 h-5" />
                      Manage Attendance
                    </Link>
                    <Link
                      to="/teacher/assignment"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={toggleMenu}
                    >
                      <FiFileText className="w-5 h-5" />
                      Check Assignments
                    </Link>
                  </>
                )}

                {/* Admin menu */}
                {role === "admin" && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={toggleMenu}
                    >
                      <FiTrello className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/attendance"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={toggleMenu}
                    >
                      <FiCalendar className="w-5 h-5" />
                      Manage Attendance
                    </Link>
                    <Link
                      to="/admin/assignment"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={toggleMenu}
                    >
                      <FiFileText className="w-5 h-5" />
                      Manage Assignment
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
