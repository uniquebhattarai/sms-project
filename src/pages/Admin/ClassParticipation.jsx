import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiCheckCircle, FiX } from "react-icons/fi";
import { apiConnector } from "../../services/ApiConnector";
import { Toast } from "../../../utils/Toast";

function ClassParticipation() {
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [editing, setEditing] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await apiConnector("GET", "/class_list/", null, {
        Authorization: `Bearer ${token}`,
      });
      setClasses(res.data);
    } catch (err) {
      console.error(err);
      Toast.error("Failed to load class list");
    }
  };

  useEffect(() => {
    if (selectedClass) fetchSubjects(selectedClass);
  }, [selectedClass]);

  const fetchSubjects = async (classId) => {
    try {
      const token = localStorage.getItem("access");
      const res = await apiConnector(
        "GET",
        `/subject_list/${classId}/`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
      Toast.error("Failed to load subjects");
    }
  };

  useEffect(() => {
    if (selectedClass && selectedSubject) fetchStudentsAndParticipation();
  }, [selectedClass, selectedSubject]);

  const fetchStudentsAndParticipation = async () => {
    try {
      const token = localStorage.getItem("access");

      const sRes = await apiConnector(
        "GET",
        `/get_student_by_class/${selectedClass}`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      setStudents(sRes.data);

      const pRes = await apiConnector(
        "GET",
        `/class-participation/`,
        null,
        { Authorization: `Bearer ${token}` }
      );

      const filtered = pRes.data.data.filter(
        (item) =>
          item.classlevel.id === Number(selectedClass) &&
          item.subject.id === Number(selectedSubject)
      );

      const map = {};
      filtered.forEach((p) => {
        map[p.student.id] = {
          id: p.id,
          mark: p.mark,
          grade_description: p.grade_description,
        };
      });

      setMarksData(map);
    } catch (err) {
      console.error(err);
      Toast.error("Failed to fetch class participation data");
    }
  };

  const handleChange = (studentId, field, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handleSave = async (studentId) => {
    const data = marksData[studentId];
    if (!data?.mark && data.mark !== 0) return Toast.error("Enter mark first");

    const token = localStorage.getItem("access");
    const payload = {
      student_id: studentId,
      subject_id: Number(selectedSubject),
      classlevel_id: Number(selectedClass),
      mark: Number(data.mark),
    };

    try {
      if (data.id) {
        await apiConnector(
          "PUT",
          `/class-participation/update/${data.id}/`,
          payload,
          { Authorization: `Bearer ${token}` }
        );
        Toast.success("Participation updated successfully!");
      } else {
        const res = await apiConnector(
          "POST",
          `/class-participation/add/`,
          payload,
          { Authorization: `Bearer ${token}` }
        );
        setMarksData((prev) => ({
          ...prev,
          [studentId]: { ...data, id: res.data.id },
        }));
        Toast.success("Participation added successfully!");
      }

      setEditing((prev) => ({ ...prev, [studentId]: false }));
      fetchStudentsAndParticipation();
    } catch (err) {
      console.error(err);
      Toast.error("Failed to save participation mark");
    }
  };

  const handleDelete = async (studentId) => {
    const data = marksData[studentId];
    if (!data?.id) return Toast.error("No record to delete");

    if (!window.confirm("Are you sure you want to delete this mark?")) return;

    try {
      const token = localStorage.getItem("access");
      await apiConnector(
        "DELETE",
        `/class-participation/delete/${data.id}/`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      setMarksData((prev) => {
        const copy = { ...prev };
        delete copy[studentId];
        return copy;
      });
      Toast.success("Record deleted successfully!");
    } catch (err) {
      console.error(err);
      Toast.error("Failed to delete record");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      {/* Header */}
      <div className="mb-8 bg-emerald-600 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-1">Class Participation</h1>
        <p className="text-green-100 text-lg">Manage and track student participation marks</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Class Level</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSubject("");
              setMarksData({});
            }}
          >
            <option value="">Choose a class...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                Class {cls.level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Subject</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">Choose a subject...</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Stats */}
        {selectedClass && selectedSubject && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm font-medium text-gray-600 mb-1">Quick Stats</div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-green-700">{Object.keys(marksData).length}</div>
                <div className="text-xs text-gray-600">Graded</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-700">
                  {Object.values(marksData)
                    .map(d => d.mark)
                    .filter(m => m !== undefined)
                    .reduce((a,b)=>a+b,0) / (Object.values(marksData).length || 1)}
                </div>
                <div className="text-xs text-gray-600">Average</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Students Table */}
      {selectedClass && selectedSubject && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Student Participation Marks</h2>
          </div>
          <div className="p-6 overflow-x-auto">
            {students.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No students found for this class.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-green-600 bg-green-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Mark (0–5)</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Grade</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((s) => {
                    const data = marksData[s.id] || {};
                    const isEditing = editing[s.id] || !data.id;

                    return (
                      <tr key={s.id} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4">{s.full_name}</td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            className="border-2 border-gray-300 px-4 py-2 rounded-lg w-24 text-center font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600 transition-all"
                            max={5}
                            min={0}
                            value={data.mark || ""}
                            disabled={!isEditing}
                            onChange={(e) =>
                              handleChange(s.id, "mark", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          {data.grade_description ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              {data.grade_description}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center flex justify-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(s.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                              >
                                <FiCheckCircle /> Save
                              </button>
                              <button
                                onClick={() =>
                                  setEditing((prev) => ({ ...prev, [s.id]: false }))
                                }
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                              >
                                <FiX /> Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  setEditing((prev) => ({ ...prev, [s.id]: true }))
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                              >
                                <FiEdit /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(s.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                              >
                                <FiTrash2 /> Delete
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
      )}
    </div>
  );
}

export default ClassParticipation;
