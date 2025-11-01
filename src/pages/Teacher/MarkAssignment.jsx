import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiConnector } from "../../services/ApiConnector";
import { Toast } from "../../../utils/Toast";
import { FiEdit, FiTrash2, FiCheckCircle, FiX } from "react-icons/fi";

// Icon for header
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

function MarkAssignment() {
  const { id } = useParams();
  const location = useLocation();
  const passedClassId = location.state?.classId || null;

  const [assignment, setAssignment] = useState(null);
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [editing, setEditing] = useState({});

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        if (passedClassId) {
          fetchStudents(passedClassId);
          fetchSubmissions();
          return;
        }
        const response = await getAssignment(id);
        setAssignment(response);
        if (response.classlevel) {
          fetchStudents(response.classlevel);
          fetchSubmissions();
        } else Toast.error("Class info missing from assignment");
      } catch (error) {
        console.error(error);
        Toast.error("Failed to load assignment");
      }
    };
    fetchAssignment();
  }, [id, passedClassId]);

  const getAssignment = async (assignmentId) => {
    const token = localStorage.getItem("access");
    const res = await apiConnector(
      "GET",
      `/assignments/${assignmentId}/`,
      null,
      { Authorization: `Bearer ${token}` }
    );
    return res.data;
  };

  const fetchStudents = async (classId) => {
    try {
      const token = localStorage.getItem("access");
      const res = await apiConnector(
        "GET",
        `/get_student_by_class/${classId}`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      setStudents(res.data);
    } catch (error) {
      console.error(error);
      Toast.error("Failed to fetch students");
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await apiConnector(
        "GET",
        `/assignment-submissions/?assignment=${id}`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      const map = {};
      res.data.forEach((s) => {
        map[s.student] = {
          marks: s.marks,
          feedback: s.feedback,
          submissionId: s.id,
        };
      });
      setMarksData(map);
    } catch (error) {
      console.error(error);
      Toast.error("Failed to fetch submissions");
    }
  };

  const handleMarkChange = (studentId, field, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handleSubmit = async (studentId) => {
    const data = marksData[studentId];
    if (!data?.marks) return Toast.error("Please enter marks first");

    try {
      const token = localStorage.getItem("access");

      if (data.submissionId) {
        await apiConnector(
          "PUT",
          `/assignment-submissions/${data.submissionId}/edit/`,
          { assignment: id, marks: data.marks, feedback: data.feedback, student: studentId },
          { Authorization: `Bearer ${token}` }
        );
        Toast.success("Marks updated successfully!");
      } else {
        const res = await apiConnector(
          "POST",
          `/assignment-submissions/create/`,
          { assignment: id, marks: data.marks, feedback: data.feedback, student: studentId },
          { Authorization: `Bearer ${token}` }
        );
        setMarksData((prev) => ({
          ...prev,
          [studentId]: { ...data, submissionId: res.data.id },
        }));
        Toast.success("Marks submitted successfully!");
      }
      setEditing((prev) => ({ ...prev, [studentId]: false }));
    } catch (error) {
      console.error(error);
      Toast.error("Failed to save marks");
    }
  };

  const handleDelete = async (studentId) => {
    const data = marksData[studentId];
    if (!data?.submissionId) return Toast.error("No submission found to delete");

    if (!window.confirm("Are you sure you want to delete this mark?")) return;

    try {
      const token = localStorage.getItem("access");
      await apiConnector(
        "DELETE",
        `/assignment-submissions/${data.submissionId}/delete/`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      setMarksData((prev) => {
        const copy = { ...prev };
        delete copy[studentId];
        return copy;
      });
      Toast.success("Marks deleted successfully!");
    } catch (error) {
      console.error(error);
      Toast.error("Failed to delete marks");
    }
  };

  // Calculate stats
  const stats = students.length > 0
    ? (() => {
        const marksArray = Object.values(marksData).map(d => d.marks).filter(m => m !== undefined && m !== "");
        const total = marksArray.length;
        const average = total > 0 ? (marksArray.reduce((a,b)=>Number(a)+Number(b),0)/total).toFixed(2) : 0;
        return { total: students.length, graded: total, pending: students.length - total, average };
      })()
    : { total: 0, graded:0, pending:0, average:0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-emerald-600 rounded-2xl shadow-xl p-8 text-white flex items-center gap-4">
          <ClipboardIcon />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Mark Assignment</h1>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Students</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <UsersIcon />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Graded</p>
            <p className="text-3xl font-bold text-green-600">{stats.graded}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
            <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <FileTextIcon />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Average Score</p>
            <p className="text-3xl font-bold text-purple-600">{stats.average}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <StarIcon />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white flex items-center gap-2">
          <UsersIcon />
          <h2 className="text-xl font-semibold">Student Submissions</h2>
        </div>
        <div className="p-6">
          {students.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No students found for this class.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-green-600">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-green-50">Student Name</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 bg-green-50">Marks</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-green-50">Feedback</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 bg-green-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map(student => {
                    const data = marksData[student.id] || {};
                    const isEditing = editing[student.id] || !data.submissionId;

                    return (
                      <tr key={student.id} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-semibold">
                            {student.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-medium text-gray-800 block">{student.full_name}</span>
                            {data.submissionId && <span className="text-xs text-green-600 font-medium">✓ Graded</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            className="border-2 border-gray-300 px-4 py-2 rounded-lg w-24 text-center font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                            max={5} min={0}
                            value={data.marks || ""}
                            disabled={!isEditing}
                            onChange={(e) => handleMarkChange(student.id, "marks", e.target.value)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            placeholder="Enter feedback..."
                            className="border-2 border-gray-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                            value={data.feedback || ""}
                            disabled={!isEditing}
                            onChange={(e) => handleMarkChange(student.id, "feedback", e.target.value)}
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            {isEditing ? (
                              <>
                                <button onClick={() => handleSubmit(student.id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-all shadow-md hover:shadow-lg"><FiCheckCircle /> Save</button>
                                <button onClick={() => setEditing(prev => ({ ...prev, [student.id]: false }))} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-all shadow-md hover:shadow-lg"><FiX /> Cancel</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => setEditing(prev => ({ ...prev, [student.id]: true }))} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-all shadow-md hover:shadow-lg"><FiEdit /> Edit</button>
                                <button onClick={() => handleDelete(student.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-all shadow-md hover:shadow-lg"><FiTrash2 /> Delete</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarkAssignment;
