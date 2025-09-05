import React, { useEffect, useState } from "react";
import {
  FiTrash2,
  FiUsers,
  FiX,
  FiAlertTriangle,
  FiSearch,
  FiBookOpen,
  FiUserPlus,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { apiConnector } from "../../services/ApiConnector";
import { useNavigate } from "react-router-dom";

function ManageUser() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("students");
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const navigate = useNavigate();

  // ✅ Fetch Classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await apiConnector("GET", "/class_list/", null, {
          Authorization: `Bearer ${token}`,
        });
        setClasses(res.data);
      } catch (err) {
        console.error("Failed to load classes:", err);
        toast.error("Error fetching classes");
      }
    };
    fetchClasses();
  }, []);

  // ✅ Fetch Students
  const fetchStudents = async (classId) => {
    setSelectedClass(classId);
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const res = await apiConnector(
        "GET",
        `/get_student_by_class/${classId}`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students:", err);
      toast.error("Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Teachers
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const res = await apiConnector("GET", "/get_teacher_list/", null, {
        Authorization: `Bearer ${token}`,
      });
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to load teachers:", err);
      toast.error("Error fetching teachers");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Confirm Delete
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  // ✅ Delete User
  const deleteUser = async () => {
    if (!userToDelete) return;
    try {
      const token = localStorage.getItem("access");

      await apiConnector(
        "DELETE",
        "/register/delete/",
        { id: userToDelete.id },
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );

      if (activeTab === "teachers") {
        setTeachers((prev) => prev.filter((t) => t.id !== userToDelete.id));
      } else {
        setStudents((prev) => prev.filter((s) => s.id !== userToDelete.id));
      }

      toast.success(`${userToDelete.full_name} deleted successfully`);
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err);
      toast.error("Failed to delete user");
    } finally {
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
              <FiUsers className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
                Manage Users
              </h1>
              <p className="text-slate-600">
                View and manage student and teacher accounts
              </p>
            </div>
          </div>

          {/* ✅ Add New User Button */}
          <button
            onClick={() => navigate("/admin/register-user")}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            <FiUserPlus className="w-5 h-5" />
            Add New User
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "students"
                ? "bg-blue-600 text-white shadow"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => {
              setActiveTab("teachers");
              fetchTeachers();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "teachers"
                ? "bg-purple-600 text-white shadow"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            Teachers
          </button>
        </div>

        {/* Content */}
        {activeTab === "students" ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Classes Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FiSearch className="w-5 h-5 text-blue-600" />
                  Select Class
                </h2>
                <div className="space-y-2">
                  {classes.length === 0 ? (
                    <p className="text-slate-500">No classes found</p>
                  ) : (
                    classes.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => fetchStudents(cls.id)}
                        className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          selectedClass === cls.id
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        <span className="font-medium">Class {cls.level}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="lg:col-span-3">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                {/* Students Header */}
                <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Students</h2>
                    <p className="text-slate-200">
                      {selectedClass
                        ? `Class ${
                            classes.find((c) => c.id === selectedClass)?.level ||
                            ""
                          } - ${students.length} students`
                        : "Select a class to view students"}
                    </p>
                  </div>
                  {students.length > 0 && (
                    <div className="bg-white/20 px-3 py-1 rounded-lg">
                      <span className="text-sm font-medium">
                        {students.length} Total
                      </span>
                    </div>
                  )}
                </div>

                {/* Students Content */}
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-slate-500">Loading students...</p>
                    </div>
                  ) : !selectedClass ? (
                    <div className="text-center py-16 text-slate-500">
                      Select a class to view students
                    </div>
                  ) : students.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                      No students found
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {students.map((stu, index) => (
                        <div
                          key={stu.id}
                          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-blue-600 text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {stu.full_name}
                              </p>
                              <p className="text-sm text-slate-500">ID: {stu.id}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => confirmDelete(stu)}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Teachers Tab
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiBookOpen className="w-5 h-5" /> Teachers
              </h2>
              <p className="text-slate-200">{teachers.length} total</p>
            </div>
            <div className="p-6 space-y-3">
              {loading ? (
                <p>Loading teachers...</p>
              ) : teachers.length === 0 ? (
                <p className="text-slate-500">No teachers found</p>
              ) : (
                teachers.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {t.full_name}
                      </p>
                      <p className="text-sm text-slate-500">{t.email}</p>
                    </div>
                    <button
                      onClick={() => confirmDelete(t)}
                      className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Confirm Deletion
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <FiX className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-2">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {userToDelete?.full_name}
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteUser}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUser;
