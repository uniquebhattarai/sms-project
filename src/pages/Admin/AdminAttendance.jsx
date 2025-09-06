import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClassList } from "../../services/Apis";
import { apiConnector } from "../../services/ApiConnector";
import { Toast } from "../../../utils/Toast";
import { FiUsers, FiSearch, FiCalendar, FiEye, FiBarChart2 } from "react-icons/fi";

function AdminAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState({}); // date per student
  const [markedDates, setMarkedDates] = useState({}); // existing marked dates per student

  const token = localStorage.getItem("access");

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

      // Save already marked dates for each student
      const datesMap = {};
      (res.data.attendance_data || []).forEach((item) => {
        datesMap[item.student__id] = (item.marked_dates || []).map(
          (d) => new Date(d)
        );
      });
      setMarkedDates(datesMap);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      Toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId) => {
    const selectedDate = selectedDates[studentId];
    if (!selectedDate) {
      Toast.error("Please select a date");
      return;
    }

    const dateStr = selectedDate.toISOString().split("T")[0];

    // Check if already marked
    if (markedDates[studentId]?.some(d => d.toISOString().split("T")[0] === dateStr)) {
      Toast.error("Attendance already marked for this date");
      return;
    }

    try {
      setLoading(true);
      const res = await apiConnector(
        "POST",
        `/mark_attendance_by_admin/${studentId}`,
        { date: dateStr },
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      );
      if (res.status === 201) {
        Toast.success(`Attendance marked for ${selectedDate.toLocaleDateString()}`);
        // Refresh attendance
        searchHandler();
      }
    } catch (error) {
      console.error("Error marking attendance:", error.response?.data || error);
      if (error.response?.status === 409) {
        Toast.error("Attendance already marked for this date");
      } else {
        Toast.error("Failed to mark attendance");
      }
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
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
              Attendance Summary
            </h1>
            <p className="text-slate-600">
              View and mark student attendance by class
            </p>
          </div>
        </div>

        {/* Class Selection */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiUsers className="w-4 h-4 text-purple-500" />
                Select Class
              </label>
              <select
                onChange={(e) => setSelectedClass(e.target.value)}
                value={selectedClass}
                className="w-full p-3 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Choose a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.level}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <button
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all"
                onClick={searchHandler}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Attendance List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-6">
            <h2 className="text-2xl font-bold">Attendance Report</h2>
            <p className="text-slate-200">
              {attendance.length > 0 ? `${attendance.length} students found` : "Select a class to view attendance data"}
            </p>
          </div>

          <div className="p-6 space-y-3">
            {attendance.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                {loading ? "Loading..." : "No Attendance Data"}
              </div>
            ) : (
              attendance.map((item, index) => (
                <div
                  key={item.student__id}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-slate-600 text-sm">{index + 1}</span>
                    </div>
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.student__full_name}`}
                      alt="avatar"
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800">{item.student__full_name}</h3>
                      <p className="text-sm text-green-600 font-medium">Present: {item.total} days</p>
                      
                    </div>
                  </div>

                  {/* Date Picker + Mark */}
                  <div className="flex items-center gap-2">
                    <DatePicker
                      selected={selectedDates[item.student__id] || null}
                      onChange={(date) =>
                        setSelectedDates((prev) => ({ ...prev, [item.student__id]: date }))
                      }
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select date"
                      className="border px-2 py-1 rounded-lg"
                      excludeDates={markedDates[item.student__id]} // disable already marked dates
                    />
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      onClick={() => markAttendance(item.student__id)}
                    >
                      Mark
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAttendance;
