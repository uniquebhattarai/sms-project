import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiCheckCircle, FiX } from "react-icons/fi";
import { apiConnector } from "../../services/ApiConnector";
import { Toast } from "../../../utils/Toast";

function ClassParticipation() {
  const [participations, setParticipations] = useState([]);
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

      // students
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
          {
            Authorization: `Bearer ${token}`,
          }
        );
        Toast.success("Participation updated successfully!");
      } else {
   
        const res = await apiConnector(
          "POST",
          `/class-participation/add/`,
          payload,
          {
            Authorization: `Bearer ${token}`,
          }
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
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Class Participation Marks
      </h1>

 
      <div className="bg-white p-6 mb-6 rounded-xl shadow-lg border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Select Class
          </label>
          <select
            className="border p-2 w-full rounded-md"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSubject("");
              setMarksData({});
            }}
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                Class {cls.level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Select Subject
          </label>
          <select
            className="border p-2 w-full rounded-md"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>


      {selectedClass && selectedSubject && (
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
                  <th className="p-3 border text-center">Mark (0–5)</th>
                  <th className="p-3 border text-center">Grade</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const data = marksData[s.id] || {};
                  const isEditing = editing[s.id] || !data.id;

                  return (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{s.full_name}</td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          className="border px-3 py-2 rounded-md w-24 text-center"
                          max={5}
                          min={0}
                          value={data.mark || ""}
                          disabled={!isEditing}
                          onChange={(e) =>
                            handleChange(s.id, "mark", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-3 text-center text-gray-600">
                        {data.grade_description || "-"}
                      </td>
                      <td className="p-3 text-center space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(s.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg inline-flex items-center"
                            >
                              <FiCheckCircle className="mr-1" /> Save
                            </button>
                            <button
                              onClick={() =>
                                setEditing((prev) => ({
                                  ...prev,
                                  [s.id]: false,
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
                                  [s.id]: true,
                                }))
                              }
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg inline-flex items-center"
                            >
                              <FiEdit className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
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
      )}
    </div>
  );
}

export default ClassParticipation;
