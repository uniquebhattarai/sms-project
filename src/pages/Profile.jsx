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
    <div>
      <Navbar fullName={student?.data?.full_name} setIsLoggedIn={setIsLoggedIn} />

      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col items-center mb-6">
          <label className="relative group cursor-pointer">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-blue-600 shadow-lg group-hover:opacity-75 transition duration-300"
            />
            <input type="file" onChange={handleFileChange} className="hidden" />
            <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs text-center opacity-0 group-hover:opacity-100 py-1 rounded-b-md transition-all duration-200">
              Change Photo
            </div>
          </label>
          {file && (
            <button
              onClick={handlePhotoUpload}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Upload
            </button>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover:cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
