import React, { useEffect, useState } from "react";
import { ClassList } from "../../services/Apis";
import { apiConnector } from "../../services/ApiConnector";
import { Toast } from "../../../utils/Toast";
import { FiUsers, FiSearch, FiCalendar, FiEye, FiBarChart2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function TeacherAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  // Load class list
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await ClassList();
        setClasses(res || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
        Toast.error("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  // Fetch attendance summary
  const searchHandler = async () => {
    if (!selectedClass) {
      Toast.error("Please select a class");
      return;
    }
    try {
      setLoading(true);
      const res = await apiConnector(
        "GET",
        `/get_attendance_summary/${selectedClass}`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      setAttendance(res.data.attendance_data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      Toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
            <FiCalendar className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Attendance Summary
            </h1>
            <p className="text-slate-600">
              View student attendance records by class
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FiSearch className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Search Attendance
              </h2>
              <p className="text-slate-600">
                Select a class to view attendance summary
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Dropdown */}
            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiUsers className="w-4 h-4 text-green-500" />
                Select Class
              </label>
              <select
                onChange={(e) => setSelectedClass(e.target.value)}
                value={selectedClass}
                className="w-full p-3 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Choose a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.level}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-transparent">Action</label>
              <button
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={searchHandler}
                disabled={loading || !selectedClass}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <FiSearch className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-emerald-600 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FiBarChart2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Attendance Report</h2>
                <p className="text-slate-200">
                  {attendance.length > 0
                    ? `${attendance.length} students found`
                    : "Select a class to view attendance data"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {attendance.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                  <FiCalendar className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-3">
                  {loading ? "Loading Attendance Data..." : "No Attendance Data"}
                </h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  {loading
                    ? "Please wait while we fetch the attendance records"
                    : selectedClass
                    ? "No attendance records found for this class"
                    : "Select a class from the dropdown above to view attendance summary"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendance.map((item, index) => (
                  <div
                    key={item.student__id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      {/* Number */}
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-slate-600 text-sm">
                          {index + 1}
                        </span>
                      </div>

                      {/* Avatar */}
                      <img
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.student__full_name}`}
                        alt="avatar"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />

                      {/* Info */}
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {item.student__full_name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-green-600 font-medium">
                            Present: {item.total} days
                          </p>
                         
                        </div>
                      </div>
                    </div>

                    {/* Badge + Button */}
                    <div className="flex items-center gap-3">
                      <button
                        className="bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium hover:opacity-90"
                        onClick={() => navigate(`/teacher/student-attendance/${item.student__id}`)  }
                      >
                        <FiEye className="w-4 h-4" />
                        View
                      </button>
                    </div>
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

export default TeacherAttendance;
