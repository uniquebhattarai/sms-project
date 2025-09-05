import React, { useState } from "react";
import { FiArrowLeft, FiMail, FiLock, FiUser, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../../services/ApiConnector";
import toast, { Toaster } from "react-hot-toast";

function RegisterUser() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    full_name: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("access");

      const res = await apiConnector("POST", "/register/", formData, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      toast.success("User registered successfully");
      console.log("User Registered:", res.data);

      // redirect back to ManageUser
      navigate("/admin/manageuser");
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to register user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <Toaster position="top-right" />

      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl w-full max-w-lg p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
            Register New User
          </h1>
          <button
            onClick={() => navigate("/admin/manageuser")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <FiArrowLeft /> Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-slate-50">
              <FiUser className="text-slate-400 mr-2" />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="flex-1 bg-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-slate-50">
              <FiMail className="text-slate-400 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="flex-1 bg-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-slate-50">
              <FiLock className="text-slate-400 mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="flex-1 bg-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-slate-50">
              <FiLock className="text-slate-400 mr-2" />
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                placeholder="Confirm password"
                className="flex-1 bg-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Role
            </label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-slate-50">
              <FiShield className="text-slate-400 mr-2" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterUser;
