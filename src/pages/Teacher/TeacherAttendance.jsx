import React from 'react'
import { getAttendancelist, getStudentByClass } from '../../services/Apis'
import { useState } from 'react';
import { Toast } from '../../../utils/Toast';
import { FiUsers, FiSearch, FiUser, FiEye, FiUserCheck, FiCalendar } from 'react-icons/fi';

function TeacherAttendance({ classes, selectedClass, setSelectedClass }) {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchHandler = async () => {
    if (!selectedClass) {
      Toast.error("Please select a class");
      return;
    }
    try {
      setLoading(true);
      const data = await getStudentByClass(selectedClass);
      setStudent(data);
      if (data.length === 0) {
        Toast.info("No students found in this class");
      }
    } catch (error) {
      Toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 mb-2">
            Student Attendance
          </h1>
          <p className="text-slate-600 text-lg">View and manage student attendance records</p>
        </div>

        {/* Search Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
              <FiSearch className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Search Students</h2>
              <p className="text-slate-600">Select a class to view student list</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Class Selection */}
            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiUsers className="w-4 h-4 text-purple-500" />
                Select Class
              </label>
              <select
                onChange={(e) => {
                  console.log("Selected Class ID:", e.target.value);
                  setSelectedClass(e.target.value);
                  setStudent([]); // Clear previous results
                }}
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
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                onClick={searchHandler}
                disabled={loading || !selectedClass}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <FiSearch className="w-4 h-4" />
                    Search Students
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          
          {/* Results Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FiUserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Student List</h2>
                  <p className="text-white/80">
                    {student.length > 0 ? `${student.length} students found` : 'Select a class to view students'}
                  </p>
                </div>
              </div>
              
              {student.length > 0 && (
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <FiCalendar className="w-4 h-4" />
                  <span className="text-sm">Ready for attendance</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Content */}
          <div className="p-6">
            {student.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <FiUsers className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-600 mb-3">
                  {loading ? "Loading Students..." : "No Students Found"}
                </h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  {loading 
                    ? "Please wait while we fetch the student list" 
                    : selectedClass 
                      ? "No students are enrolled in the selected class" 
                      : "Select a class from the dropdown above to view students"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Students Count Header */}
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiUsers className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Total Students</h3>
                      <p className="text-sm text-slate-600">Class {classes.find(c => c.id == selectedClass)?.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{student.length}</div>
                    <div className="text-sm text-slate-500">Students</div>
                  </div>
                </div>

                {/* Student Cards */}
                <div className="grid gap-4">
                  {student.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="group border border-slate-200 rounded-xl p-4 bg-white/50 hover:bg-white hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="relative">
                            <img
                              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.full_name}`}
                              alt="avatar"
                              className="w-14 h-14 rounded-full border-3 border-white shadow-lg"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
                          </div>
                          
                          {/* Student Info */}
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {item.full_name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <FiUser className="w-3 h-3" />
                              <span>Student ID: {item.id}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <div className="text-xs text-slate-500">Status</div>
                            <div className="flex items-center gap-1 text-green-600">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-sm font-medium">Active</span>
                            </div>
                          </div>
                          
                          <button
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5 hover:shadow-md"
                            onClick={() => alert(`Viewing ${item.full_name} profile`)}
                          >
                            <FiEye className="w-4 h-4" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Footer */}
                <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FiCalendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">Ready to mark attendance?</h4>
                        <p className="text-sm text-slate-600">All {student.length} students are loaded and ready</p>
                      </div>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      Mark Attendance
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherAttendance;