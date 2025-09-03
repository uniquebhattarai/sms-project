import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

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
              onClick={() => navigate("/teacher/create/marksheet")}
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
              <div
                onClick={() =>
                  navigate(`/teacher/marksheet/details/${performance.student_id}`, {
                    state: { performance },
                  })
                }
                className="border p-4 rounded-lg hover:shadow cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">
                      Student ID: {performance.student_id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Subjects: {performance.total_subjects} | Exams: {performance.total_exams}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    Avg: {performance.average_percentage}%
                  </span>
                </div>
                <div className="mt-3 grid gap-2">
                  {performance.subject_wise_stats.map((sub, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border p-2 rounded-lg"
                    >
                      <span className="font-medium">{sub.subject__name}</span>
                      <span className="text-sm text-gray-600">
                        {sub.avg_marks} marks ({sub.avg_percentage}%)
                      </span>
                    </div>
                  ))}
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
