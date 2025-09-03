import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../../utils/Toast";
import { apiConnector } from "../../services/ApiConnector";
import { FiClipboard } from "react-icons/fi";

function Tmarksheet() {
  const [marks, setMarks] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

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

  // Fetch marks by class
  const fetchMarks = async (classId) => {
    try {
      setLoading(true);
      const res = await apiConnector("GET", `/marks/class/${classId}/`);
      if (res?.data?.data) {
        setMarks(res.data.data);
      } else {
        setMarks([]);
      }
    } catch {
      Toast.error("Failed to fetch marks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamTypes();
    fetchClasses();
  }, []);

  // Handle class change → fetch subjects + students + marks
  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    fetchSubjects(classId);
    fetchStudents(classId);
    fetchMarks(classId);
  };

  const clickMarksheet = (mark) => {
    navigate(`/teacher/marksheet/details/${mark.id}`, { state: { mark } });
  };

  const clickHandler = () => {
    navigate("/teacher/create/marksheet");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
            Marksheet Management
          </h1>
          <p className="text-gray-600">Filter and manage student marksheets</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow mb-6">
          <select
            className="p-2 border rounded"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="">Select Exam Type</option>
            {examTypes.map((exam) => (
              <option key={exam.id} value={exam.id}>{exam.name}</option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>Class {cls.level}</option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((stu) => (
              <option key={stu.id} value={stu.id}>{stu.full_name}</option>
            ))}
          </select>
        </div>

        {/* Results Section */}
        <div className="bg-white/90 shadow rounded-xl border overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiClipboard /> Marksheet List
            </h2>
            <button
              onClick={clickHandler}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg"
            >
              + Add Marksheet
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : marks.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No marksheets found</p>
            ) : (
              <div className="grid gap-3">
                {marks
                  .filter((m) =>
                    (!selectedExam || m.examtype.id == selectedExam) &&
                    (!selectedSubject || m.subject.id == selectedSubject) &&
                    (!selectedStudent || m.student.id == selectedStudent)
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => clickMarksheet(item)}
                      className="border p-4 rounded-lg hover:shadow cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{item.student.full_name} (Class {item.classlevel.level})</h3>
                          <p className="text-sm text-gray-600">
                            {item.subject.name} - {item.examtype.name}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                          {item.percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Marks: {item.marks}/{item.full_marks} | Date: {formatDate(item.date)}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tmarksheet;
