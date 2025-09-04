import React, { useState, useEffect } from "react";
import {
  FiClipboard,
  FiSearch,
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { apiConnector } from "../../services/ApiConnector";
import { Toast } from "../../../utils/Toast";

function Tmarksheet({ role = "teacher" }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ marks: "", full_marks: "" });

  // ✅ Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await apiConnector("GET", "/class_list/");
      if (res?.data) setClasses(res.data);
    } catch {
      Toast.error("Failed to fetch classes");
    }
  };

  // ✅ Fetch students
  const fetchStudents = async (classId) => {
    try {
      const res = await apiConnector("GET", `/get_student_by_class/${classId}`);
      if (res?.data) setStudents(res.data);
    } catch {
      Toast.error("Failed to fetch students");
    }
  };

  // ✅ Fetch performance
  const searchPerformance = async () => {
    if (!selectedStudent) {
      Toast.error("Please select a student");
      return;
    }
    try {
      setLoading(true);
      const res = await apiConnector("GET", `/performance/${selectedStudent}/`);
      if (res?.data?.data) {
        setPerformance(res.data.data);
      } else {
        setPerformance(null);
        Toast.error("No performance data found");
      }
    } catch {
      Toast.error("Failed to fetch performance");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle edit
  const handleEdit = (mark) => {
    setEditing(mark.id);
    setFormData({
      marks: mark.marks,
      full_marks: mark.full_marks,
    });
  };

  // ✅ Handle update
  const handleUpdate = async () => {
    try {
      await apiConnector("PUT", `/marks/update/${editing}/`, {
        marks: formData.marks,
        full_marks: formData.full_marks,
      });
      Toast.success("Updated successfully ✅");
      setEditing(null);
      searchPerformance();
    } catch {
      Toast.error("Update failed ❌");
    }
  };

  // ✅ Handle delete
  const handleDelete = async (markId) => {
    if (!window.confirm("Are you sure you want to delete this mark?")) return;
    try {
      await apiConnector("DELETE", `/marks/delete/${markId}/`);
      Toast.success("Mark deleted successfully ✅");
      searchPerformance();
    } catch {
      Toast.error("Failed to delete mark ❌");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 mb-2">
            Marksheet Management
          </h1>
          <p className="text-slate-600 text-lg">
            Search and manage student performance records
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Class */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Select Class
              </label>
              <select
                className="w-full p-3 border border-slate-200 rounded-xl"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  fetchStudents(e.target.value);
                  setSelectedStudent("");
                  setPerformance(null);
                }}
              >
                <option value="">Choose a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.level}
                  </option>
                ))}
              </select>
            </div>

            {/* Student */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Select Student
              </label>
              <select
                className="w-full p-3 border border-slate-200 rounded-xl"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={!selectedClass}
              >
                <option value="">Choose a student</option>
                {students.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-transparent">
                Action
              </label>
              <button
                onClick={searchPerformance}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2"
                disabled={loading || !selectedStudent}
              >
                <FiSearch className="w-4 h-4" />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Add */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-transparent">
                Quick Action
              </label>
              <button
                onClick={() =>
                  (window.location.href =
                    role === "teacher"
                      ? "/teacher/create/marksheet"
                      : "/admin/create/marksheet")
                }
                className="w-full bg-white border-2 border-dashed border-slate-300 text-slate-600 px-6 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white/70 rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-6 flex items-center gap-3">
            <FiClipboard className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">Student Marksheet</h2>
              <p className="text-white/80">
                Performance overview and editing
              </p>
            </div>
          </div>

          <div className="p-6">
            {!performance ? (
              <p className="text-center text-slate-500 py-12">
                {loading ? "Loading..." : "No Marksheet Selected"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                      <th className="border px-4 py-3 text-left">Subject</th>
                      <th className="border px-4 py-3 text-left">Exam Type</th>
                      <th className="border px-4 py-3 text-left">Marks</th>
                      <th className="border px-4 py-3 text-left">
                        Full Marks
                      </th>
                      <th className="border px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance.marksheets.map((mark) => (
                      <tr key={mark.id} className="hover:bg-slate-50">
                        <td className="border px-4 py-3">{mark.subject.name}</td>
                        <td className="border px-4 py-3">{mark.examtype.name}</td>

                        {editing === mark.id ? (
                          <>
                            <td className="border px-4 py-3">
                              <input
                                type="text"
                                value={formData.marks}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    marks: e.target.value,
                                  })
                                }
                                className="w-20 p-2 border rounded-lg"
                              />
                            </td>
                            <td className="border px-4 py-3">
                              <input
                                type="text"
                                value={formData.full_marks}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    full_marks: e.target.value,
                                  })
                                }
                                className="w-20 p-2 border rounded-lg"
                              />
                            </td>
                            <td className="border px-4 py-3">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={handleUpdate}
                                  className="bg-green-500 text-white p-2 rounded-lg"
                                >
                                  <FiSave />
                                </button>
                                <button
                                  onClick={() => setEditing(null)}
                                  className="bg-slate-500 text-white p-2 rounded-lg"
                                >
                                  <FiX />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="border px-4 py-3">{mark.marks}</td>
                            <td className="border px-4 py-3">
                              {mark.full_marks}
                            </td>
                            <td className="border px-4 py-3">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => handleEdit(mark)}
                                  className="bg-blue-500 text-white p-2 rounded-lg"
                                >
                                  <FiEdit2 />
                                </button>
                                <button
                                  onClick={() => handleDelete(mark.id)}
                                  className="bg-red-500 text-white p-2 rounded-lg"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tmarksheet;
