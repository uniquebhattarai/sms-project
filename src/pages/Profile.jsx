import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import { getStudent, updateUser, deleteUser, uploadPhoto } from "../services/Apis";
import { Toast } from "../../utils/Toast";
import { useNavigate } from "react-router-dom";

function Profile({ setIsLoggedIn }) {
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({ full_name: "", email: "", id: null });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudent();
        const user = Array.isArray(data) ? data[0] : data;
        setStudent(user);
        setFormData({
          full_name: user?.data?.full_name || "",
          email: user?.data?.email || "",
          id: user?.data?.id || null,
        });
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      }
    };
    fetchStudent();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      Toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      Toast.error("Update failed!");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await deleteUser(formData.id);
      Toast.success("Account deleted successfully!");
      localStorage.removeItem("access");
      setIsLoggedIn(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      Toast.error("Deletion failed!");
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handlePhotoUpload = async () => {
    if (!file) return Toast.error("Please select an image first.");
    try {
      await uploadPhoto(file);
      Toast.success("Photo uploaded successfully");
    } catch (err) {
      console.error(err);
      Toast.error("Photo upload failed");
    }
  };

  const avatarUrl = student?.data?.user_image
    ? student.data.user_image
    : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        formData.full_name
      )}&backgroundColor=3B82F6&fontColor=ffffff`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative z-0 overflow-hidden">
      <Navbar fullName={student?.data?.full_name} setIsLoggedIn={setIsLoggedIn} />

      <div className="max-w-4xl mx-auto pt-12 px-6 relative z-10">
        {/* Profile Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-12 mb-8">
          <div className="flex flex-col lg:flex-col items-center lg:items-center gap-8">
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                <label className="relative cursor-pointer block">
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="relative w-32 h-32 rounded-full border-4 border-white shadow-2xl group-hover:scale-105 transition-all duration-300"
                  />
                  <input type="file" onChange={handleFileChange} className="hidden" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                    <span className="text-white text-sm font-medium">Change Photo</span>
                  </div>
                </label>
              </div>

              {file && (
                <button
                  onClick={handlePhotoUpload}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Upload Photo
                </button>
              )}
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {formData.full_name || "Your Profile"}
              </h1>
              <p className="text-gray-600 text-lg mb-2">{formData.email}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-12">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Profile
          </h2>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Full Name</label>
              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 text-lg"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 text-lg"
                placeholder="Enter your email address"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100 mt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Decorative Blurs */}
      <div className="fixed top-32 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full filter blur-3xl z-0"></div>
      <div className="fixed bottom-32 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full filter blur-3xl z-0"></div>
    </div>
  );
}

export default Profile;
