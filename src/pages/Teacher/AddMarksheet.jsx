import React, { useState, useEffect } from "react";
import { Toast } from "../../../utils/Toast";
import { apiConnector } from "../../services/ApiConnector";
import { useNavigate } from "react-router-dom";
import { FiSave, FiArrowLeft, FiBookOpen, FiUsers, FiFileText, FiAward, FiTarget } from "react-icons/fi";

function AddMarksheet({ role = "teacher" }) {
  const [examTypes, setExamTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [fullMarks, setFullMarks] = useState("");
  const [marks, setMarks] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch exam types
  const fetchExamTypes = async () => {
    try {
      const res = await apiConnector("GET", "/exam-types/");
      if (res?.data?.data) setExamTypes(res.data.data);
    } catch {
      Toast.error("Failed to fetch exam types");
    }
  };

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await apiConnector("GET", "/class_list/");
      if (res?.data) setClasses(res.data);
    } catch {
      Toast.error("Failed to fetch classes");
    }
  };

  // Fetch subjects by class
  const fetchSubjects = async (classId) => {
    try {
      const res = await apiConnector("GET", `/subject_list/${classId}/`);
      if (res?.data) setSubjects(res.data);
    } catch {
      Toast.error("Failed to fetch subjects");
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

  // Handle class change → fetch subjects + students
  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    setSelectedSubject("");
    setSelectedStudent("");
    if (classId) {
      fetchSubjects(classId);
      fetchStudents(classId);
    } else {
      setSubjects([]);
      setStudents([]);
    }
  };

  // Submit new marksheet
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedExam || !selectedClass || !selectedSubject || !selectedStudent || !fullMarks || !marks) {
      Toast.error("Please fill all fields");
      return;
    }

    if (parseInt(marks) > parseInt(fullMarks)) {
      Toast.error("Marks obtained cannot be greater than full marks");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        student_id: parseInt(selectedStudent),
        classlevel_id: parseInt(selectedClass),
        subject_id: parseInt(selectedSubject),
        examtype_id: parseInt(selectedExam),
        full_marks: fullMarks,
        marks: marks,
      };

      const res = await apiConnector("POST", "/marks/add/", payload);

      if (res?.status === 201) {
        Toast.success("Marksheet added successfully!");
        navigate(role==="teacher"?"/teacher/marksheet":"/admin/marksheet");
      } else {
        Toast.error("Failed to add marksheet");
      }
    } catch (error) {
      Toast.error("Error adding marksheet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamTypes();
    fetchClasses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate( role="teacher"?"/teacher/marksheet":"/admin/marksheet")}
            className="p-2 bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:bg-white/90 transition-all duration-200"
          >
            <FiArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
              Add New Marksheet
            </h1>
            <p className="text-slate-600">Create a new performance record for a student</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FiFileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Marksheet Details</h2>
                <p className="text-white/80">Fill in all the required information</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Exam Type */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FiAward className="w-4 h-4 text-indigo-500" />
                    Exam Type
                  </label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                  >
                    <option value="">Select exam type</option>
                    {examTypes.map((exam) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FiUsers className="w-4 h-4 text-purple-500" />
                    Class
                  </label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={selectedClass}
                    onChange={(e) => handleClassChange(e.target.value)}
                  >
                    <option value="">Select class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        Class {cls.level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FiBookOpen className="w-4 h-4 text-blue-500" />
                    Subject
                  </label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={!selectedClass}
                  >
                    <option value="">Select subject</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <FiUsers className="w-4 h-4 text-green-500" />
                    Student
                  </label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    disabled={!selectedClass}
                  >
                    <option value="">Select student</option>
                    {students.map((stu) => (
                      <option key={stu.id} value={stu.id}>
                        {stu.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Marks Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FiTarget className="w-5 h-5 text-indigo-600" />
                  Marks Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Marks */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Marks</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter full marks (e.g., 100)"
                      value={fullMarks}
                      onChange={(e) => setFullMarks(e.target.value)}
                      min="1"
                      max="1000"
                    />
                  </div>

                  {/* Marks Obtained */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Marks Obtained</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter marks obtained"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      min="0"
                      max={fullMarks || "1000"}
                    />
                  </div>
                </div>

                {/* Percentage Display */}
                {marks && fullMarks && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Percentage:</span>
                      <span className="font-bold text-lg text-indigo-600">
                        {((parseFloat(marks) / parseFloat(fullMarks)) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate( role==="teacher"?"/teacher/marksheet":"/admin/marsheet")}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  {loading ? "Saving..." : "Add Marksheet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMarksheet;