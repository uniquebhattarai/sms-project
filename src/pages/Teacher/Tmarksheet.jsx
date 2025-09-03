import React, { useState, useEffect } from "react";
import { FiClipboard } from "react-icons/fi";
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
    setEditing(mark.id); // marksheet row id from backend
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
      // re-fetch performance after update
      searchPerformance();
    } catch {
      Toast.error("Update failed ❌");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
            Marksheet Management
          </h1>
          <p className="text-gray-600">Search and manage student marksheets</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow mb-6">
          <select
            className="p-2 border rounded"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              fetchStudents(e.target.value);
              setSelectedStudent("");
              setPerformance(null);
            }}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                Class {cls.level}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">Select Student</option>
            {students.map((stu) => (
              <option key={stu.id} value={stu.id}>
                {stu.full_name}
              </option>
            ))}
          </select>

          <button
            onClick={searchPerformance}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white/90 shadow rounded-xl border overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiClipboard /> Marksheet
            </h2>
            <button
              onClick={() => window.location.href = "/teacher/create/marksheet"}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg"
            >
              + Add Marksheet
            </button>
          </div>

          <div className="p-4">
            {!performance ? (
              <p className="text-gray-500 text-center py-6">
                {loading ? "Loading..." : "Select student and search to view marksheet"}
              </p>
            ) : (
              <div className="border p-4 rounded-lg">
                <h3 className="font-bold">
                  Student: {performance.student_name}
                </h3>
                <p className="text-sm text-gray-600">
                  Subjects: {performance.total_subjects} | Exams: {performance.total_exams}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Average: {performance.average_percentage}%
                </p>

                <table className="w-full border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">Subject</th>
                      <th className="border px-2 py-1">Exam</th>
                      <th className="border px-2 py-1">Marks</th>
                      <th className="border px-2 py-1">Full Marks</th>
                      <th className="border px-2 py-1">Date</th>
                      <th className="border px-2 py-1">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance.marksheets.map((mark) => (
                      <tr key={mark.id}>
                        <td className="border px-2 py-1">{mark.subject.name}</td>
                        <td className="border px-2 py-1">{mark.examtype.name}</td>

                        {editing === mark.id ? (
                          <>
                            <td className="border px-2 py-1">
                              <input
                                type="text"
                                value={formData.marks}
                                onChange={(e) =>
                                  setFormData({ ...formData, marks: e.target.value })
                                }
                                className="border px-2 py-1 w-20"
                              />
                            </td>
                            <td className="border px-2 py-1">
                              <input
                                type="text"
                                value={formData.full_marks}
                                onChange={(e) =>
                                  setFormData({ ...formData, full_marks: e.target.value })
                                }
                                className="border px-2 py-1 w-20"
                              />
                            </td>
                            <td className="border px-2 py-1">{mark.date}</td>
                            <td className="border px-2 py-1">
                              <button
                                onClick={handleUpdate}
                                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditing(null)}
                                className="bg-gray-500 text-white px-3 py-1 rounded"
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="border px-2 py-1">{mark.marks}</td>
                            <td className="border px-2 py-1">{mark.full_marks}</td>
                            <td className="border px-2 py-1">{mark.date}</td>
                            <td className="border px-2 py-1">
                              <button
                                onClick={() => handleEdit(mark)}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                              >
                                Edit
                              </button>
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
