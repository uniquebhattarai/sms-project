import React, { useState, useEffect } from "react";
import { FiClipboard, FiSearch, FiEdit2, FiSave, FiX, FiPlus } from "react-icons/fi";
import { apiConnector } from "../../services/ApiConnector";
import { Toast } from "../../../utils/Toast";

function Tmarksheet() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ marks: "", full_marks: "" });

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await apiConnector("GET", "/class_list/");
      if (res?.data) setClasses(res.data);
    } catch {
      Toast.error("Failed to fetch classes");
    }
  };

  // Fetch students by class
  const fetchStudents = async (classId) => {
    try {
      const res = await apiConnector("GET", `/get_student_by_class/${classId}`);
      if (res?.data) setStudents(res.data);
    } catch {
      Toast.error("Failed to fetch students");
    }
  };

  // Search performance of student
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

  // Handle edit
  const handleEdit = (mark) => {
    setEditing(mark.id);
    setFormData({
      marks: mark.marks,
      full_marks: mark.full_marks,
    });
  };

  // Handle update
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
          <p className="text-slate-600 text-lg">Search and manage student performance records</p>
        </div>

        {/* Search Filters Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Class Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Select Class</label>
              <select
                className="w-full p-3 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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

            {/* Student Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Select Student</label>
              <select
                className="w-full p-3 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Search Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-transparent">Action</label>
              <button
                onClick={searchPerformance}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                disabled={loading || !selectedStudent}
              >
                <FiSearch className="w-4 h-4" />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Add Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-transparent">Quick Action</label>
              <button
                onClick={() => window.location.href = "/teacher/create/marksheet"}
                className="w-full bg-white border-2 border-dashed border-slate-300 text-slate-600 px-6 py-3 rounded-xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FiClipboard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Student Marksheet</h2>
                  <p className="text-white/80">Performance overview and editing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {!performance ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <FiClipboard className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  {loading ? "Loading Performance Data..." : "No Marksheet Selected"}
                </h3>
                <p className="text-slate-500">
                  {loading ? "Please wait while we fetch the data" : "Select a class and student to view their marksheet"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Student Info Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Student Name</p>
                      <p className="font-bold text-slate-800">{performance.student_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Subjects</p>
                      <p className="font-bold text-slate-800">{performance.total_subjects}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Exams</p>
                      <p className="font-bold text-slate-800">{performance.total_exams}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Average Score</p>
                      <p className="font-bold text-indigo-600 text-lg">{performance.average_percentage}%</p>
                    </div>
                  </div>
                </div>

                {/* Marks Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                        <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Subject</th>
                        <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Exam Type</th>
                        <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Marks</th>
                        <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Full Marks</th>
                        <th className="border border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Date</th>
                        <th className="border border-slate-200 px-4 py-3 text-center font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performance.marksheets.map((mark, index) => (
                        <tr key={mark.id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="border border-slate-200 px-4 py-3 font-medium">{mark.subject.name}</td>
                          <td className="border border-slate-200 px-4 py-3">{mark.examtype.name}</td>
                          
                          {editing === mark.id ? (
                            <>
                              <td className="border border-slate-200 px-4 py-3">
                                <input
                                  type="text"
                                  value={formData.marks}
                                  onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                                  className="w-20 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="border border-slate-200 px-4 py-3">
                                <input
                                  type="text"
                                  value={formData.full_marks}
                                  onChange={(e) => setFormData({ ...formData, full_marks: e.target.value })}
                                  className="w-20 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </td>
                              <td className="border border-slate-200 px-4 py-3">{mark.date}</td>
                              <td className="border border-slate-200 px-4 py-3">
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={handleUpdate}
                                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                                    title="Save changes"
                                  >
                                    <FiSave className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditing(null)}
                                    className="bg-slate-500 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
                                    title="Cancel editing"
                                  >
                                    <FiX className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="border border-slate-200 px-4 py-3 font-semibold text-blue-600">{mark.marks}</td>
                              <td className="border border-slate-200 px-4 py-3">{mark.full_marks}</td>
                              <td className="border border-slate-200 px-4 py-3 text-slate-600">{mark.date}</td>
                              <td className="border border-slate-200 px-4 py-3">
                                <div className="flex justify-center">
                                  <button
                                    onClick={() => handleEdit(mark)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                                    title="Edit marks"
                                  >
                                    <FiEdit2 className="w-4 h-4" />
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tmarksheet;