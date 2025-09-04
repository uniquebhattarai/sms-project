import React, { useEffect, useState } from "react";
import { FiTrash2, FiUsers, FiX, FiAlertTriangle, FiSearch } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { apiConnector } from "../../services/ApiConnector";

function ManageUser() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

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

  // ✅ Fetch Students for Selected Class
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

  // ✅ Confirm Delete
  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowModal(true);
  };

  // ✅ Delete Student
  const deleteStudent = async () => {
    if (!studentToDelete) return;
    try {
      const token = localStorage.getItem("access");
      await apiConnector(
        "DELETE",
        "/register/delete/",
        { id: studentToDelete.id },
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );
      setStudents((prev) =>
        prev.filter((s) => s.id !== studentToDelete.id)
      );
      toast.success(`${studentToDelete.full_name} deleted successfully`, {
        id: "delete-toast",
      });
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete student", { id: "delete-toast" });
    } finally {
      setShowModal(false);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
            <FiUsers className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
              Manage Users
            </h1>
            <p className="text-slate-600">View and manage student accounts by class</p>
          </div>
        </div>

        {/* Main Content Grid */}
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
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-full flex items-center justify-center">
                      <FiUsers className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm">No classes found</p>
                  </div>
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
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Students</h2>
                    <p className="text-slate-200">
                      {selectedClass 
                        ? `Class ${classes.find(c => c.id === selectedClass)?.level || ''} - ${students.length} students`
                        : "Select a class to view students"
                      }
                    </p>
                  </div>
                  {students.length > 0 && (
                    <div className="bg-white/20 px-3 py-1 rounded-lg">
                      <span className="text-sm font-medium">{students.length} Total</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Students Content */}
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500">Loading students...</p>
                  </div>
                ) : !selectedClass ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                      <FiUsers className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No Class Selected</h3>
                    <p className="text-slate-500">Choose a class from the sidebar to view students</p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                      <FiUsers className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No Students Found</h3>
                    <p className="text-slate-500">This class doesn't have any enrolled students yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {students.map((stu, index) => (
                      <div
                        key={stu.id}
                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-blue-600 text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{stu.full_name}</p>
                            <p className="text-sm text-slate-500">ID: {stu.id}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => confirmDelete(stu)}
                          className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 hover:shadow-sm"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Confirm Deletion</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-slate-600 mb-2">
                Are you sure you want to delete this student?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="font-semibold text-red-800">
                  {studentToDelete?.full_name}
                </p>
                <p className="text-sm text-red-600">This action cannot be undone.</p>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteStudent}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  Delete Student
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