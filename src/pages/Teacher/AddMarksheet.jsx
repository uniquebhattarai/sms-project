import React, { useState, useEffect } from "react";
import { Toast } from "../../../utils/Toast";
import { apiConnector } from "../../services/ApiConnector";
import { useNavigate } from "react-router-dom";

function AddMarksheet() {
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
    fetchSubjects(classId);
    fetchStudents(classId);
  };

  // Submit new marksheet
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedExam || !selectedClass || !selectedSubject || !selectedStudent || !fullMarks || !marks) {
      Toast.error("Please fill all fields");
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
        navigate("/teacher/marksheet"); // go back to marksheet list
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Add New Marksheet</h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Exam Type */}
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

          {/* Class */}
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

          {/* Subject */}
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

          {/* Student */}
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

          {/* Full Marks */}
          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Full Marks"
            value={fullMarks}
            onChange={(e) => setFullMarks(e.target.value)}
          />

          {/* Marks Obtained */}
          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Marks Obtained"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Saving..." : "Add Marksheet"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMarksheet;
