import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiConnector } from "../../services/ApiConnector";
import { Toast } from "../../../utils/Toast";
import { FiEdit, FiTrash2, FiCheckCircle, FiX } from "react-icons/fi";

function MarkAssignment() {
  const { id } = useParams(); // assignment ID
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
          {
            assignment: id,
            marks: data.marks,
            feedback: data.feedback,
            student: studentId,
          },
          { Authorization: `Bearer ${token}` }
        );
        Toast.success("Marks updated successfully!");
      } else {
        const res = await apiConnector(
          "POST",
          `/assignment-submissions/create/`,
          {
            assignment: id,
            marks: data.marks,
            feedback: data.feedback,
            student: studentId,
          },
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
    if (!data?.submissionId)
      return Toast.error("No submission found to delete");

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

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Mark Assignment #{id}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {students.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No students found for this class.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-gray-700">
                <th className="p-3 border">Student Name</th>
                <th className="p-3 border">Marks</th>
                <th className="p-3 border">Feedback</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const data = marksData[student.id] || {};
                const isEditing = editing[student.id] || !data.submissionId;

                return (
                  <tr key={student.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{student.full_name}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        className="border px-3 py-2 rounded-md w-24"
                        max={5}
                        min={0}
                        value={data.marks || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleMarkChange(student.id, "marks", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        className="border px-3 py-2 rounded-md w-full"
                        value={data.feedback || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleMarkChange(
                            student.id,
                            "feedback",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-3 text-center space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSubmit(student.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg inline-flex items-center"
                          >
                            <FiCheckCircle className="mr-1" /> Save
                          </button>
                          <button
                            onClick={() =>
                              setEditing((prev) => ({
                                ...prev,
                                [student.id]: false,
                              }))
                            }
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded-lg inline-flex items-center"
                          >
                            <FiX className="mr-1" /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              setEditing((prev) => ({
                                ...prev,
                                [student.id]: true,
                              }))
                            }
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg inline-flex items-center"
                          >
                            <FiEdit className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg inline-flex items-center"
                          >
                            <FiTrash2 className="mr-1" /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MarkAssignment;
