import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiConnector } from "../../services/ApiConnector";

function MarksheetDetails() {
  const location = useLocation();
  const { student_id } = useParams();

  // If performance is passed via props/state
  const initialPerformance = location.state?.performance || null;

  const [performance, setPerformance] = useState(initialPerformance);
  const [loading, setLoading] = useState(!initialPerformance); // only loading if no initial data
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ marks: "", full_marks: "" });

  // Fetch performance only if not passed via props
  useEffect(() => {
    if (!performance) {
      const fetchPerformance = async () => {
        try {
          const res = await apiConnector(
            "GET",
            `/performance/${student_id}/`
          );
          setPerformance(res.data.data);
        } catch (err) {
          console.error("Error fetching performance:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchPerformance();
    }
  }, [performance, student_id]);

  // Edit subject row
  const handleEdit = (subj) => {
    setEditing(subj.mark_id); // make sure backend provides mark_id
    setFormData({
      marks: subj.avg_marks,
      full_marks: subj.max_marks,
    });
  };

  // Update marks API
  const handleUpdate = async () => {
    try {
      await apiConnector("PUT", `/marks/update/${editing}/`, {
        marks: formData.marks,
        full_marks: formData.full_marks,
      });
      alert("Updated successfully ✅");
      setEditing(null);

      // refresh data
      const res = await apiConnector(
        "GET",
        `/performance/${student_id}/`
      );
      setPerformance(res.data.data);
    } catch (err) {
      console.error("Error updating:", err);
      alert("Update failed ❌");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!performance) return <p>No performance found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Performance of Student #{student_id}
      </h2>

      <p>
        <strong>Total Subjects:</strong> {performance.total_subjects}
      </p>
      <p>
        <strong>Total Exams:</strong> {performance.total_exams}
      </p>
      <p>
        <strong>Average %:</strong> {performance.average_percentage}%
      </p>

      <h3 className="text-xl font-semibold mt-4">Subject-wise Stats</h3>
      <table className="w-full border mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Subject</th>
            <th className="border px-2 py-1">Marks</th>
            <th className="border px-2 py-1">Full Marks</th>
            <th className="border px-2 py-1">Percentage</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {performance.subject_wise_stats.map((subj, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{subj.subject__name}</td>

              {editing === subj.mark_id ? (
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
                  <td className="border px-2 py-1">-</td>
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
                  <td className="border px-2 py-1">{subj.avg_marks}</td>
                  <td className="border px-2 py-1">{subj.max_marks}</td>
                  <td className="border px-2 py-1">{subj.avg_percentage}%</td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleEdit(subj)}
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
  );
}

export default MarksheetDetails;
