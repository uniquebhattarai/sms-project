import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../services/ApiConnector";
import { ClassList } from "../../services/Apis";

const RegisterUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    password2: "",
    role: "",
    gender: "",
    class_level_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);

  // ✅ Fetch class list when role = student
  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const data = await ClassList();
        setClasses(data); // expecting [{id, name}, ...]
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to load class list");
      }
    };

    if (formData.role === "student") {
      fetchClassList();
    }
  }, [formData.role]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access");

      const endpoint =
        formData.role === "teacher" ? "/register/" : "/register_student/";

      const res = await apiConnector("POST", endpoint, formData, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      toast.success(
        formData.role === "teacher"
          ? "Teacher registered successfully"
          : "Student registered successfully"
      );

      console.log("User Registered:", res.data);
      navigate("/admin/manageuser");
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to register user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">
          <FiUserPlus className="inline-block mr-2 text-indigo-500" />
          Register User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
         
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

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-3 py-2 bg-slate-50 text-slate-700 outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-3 py-2 bg-slate-50 text-slate-700 outline-none"
            >
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

          {formData.role === "student" && (
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Class
              </label>
              <select
                name="class_level_id"
                value={formData.class_level_id}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-3 py-2 bg-slate-50 text-slate-700 outline-none"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    class { cls.level}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
