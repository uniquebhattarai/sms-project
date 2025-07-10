import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

export default function AvatarMenu({ setIsLoggedIn }) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("Student");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://student-management-system-1-ldgq.onrender.com/api/student/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        const data = await res.json();
        if (data?.data?.full_name) {
          setFullName(data.data.full_name);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    fullName
  )}&backgroundColor=F97316&fontColor=ffffff`;

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="relative inline-block text-left">
      {/* Avatar trigger */}
      <img
        src={avatarUrl}
        alt="avatar"
        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
        onClick={() => setOpen(!open)}
        title={fullName}
      />

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 text-black">
          {/* Profile row with icon and name */}
          <button
            onClick={goToProfile}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
          >
            <img
              src={avatarUrl}
              alt="avatar small"
              className="w-6 h-6 rounded-full border"
            />
            {fullName}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm gap-2 hover:bg-gray-100 transition"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
