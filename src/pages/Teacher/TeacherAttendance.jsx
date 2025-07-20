import React from 'react'
import { getAttendancelist,getStudentByClass } from '../../services/Apis'
import { useState } from 'react';
import { Toast } from '../../../utils/Toast';

function TeacherAttendance({classes,selectedClass,setSelectedClass}) {
  
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchHandler = async () => {
      if (!selectedClass ) {
        Toast.success("Please select both class", "error");
        return;
      }
      try {
        setLoading(true);
        const data = await getStudentByClass(selectedClass);
        setStudent(data);
      } catch (error) {
        Toast.error("Failed to fetch students", "error");
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <div>
       <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Class
              </label>
              <select
               onChange={(e) => {
                console.log("Selected Class ID:", e.target.value);
                setSelectedClass(e.target.value)
              }}
              
                value={selectedClass}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    Class {cls.level}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-end gap-2">
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={searchHandler}
                disabled={loading || !selectedClass}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  "Search Assignments"
                )}
              </button>


    </div>
    <div className="p-6">
            {/* Student List */}
      {student.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Student found</h3>
        </div>
      ) : (
        <div className="grid gap-4">
          {student.map((item, idx) => (
            <div
              key={item.id || idx}
              className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-200 hover:border-blue-300 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${item.full_name}`}
                    alt="avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  {/* Student Name */}
                  <h3 className="text-lg font-semibold text-gray-800">{item.full_name}</h3>
                </div>

                <button
                  className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-4 py-1 rounded-full"
                  onClick={() => alert(`Viewing ${item.full_name}`)} // You can later link to student profile
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
              </div>
            )}
          </div>
    </div>
  )
}

export default TeacherAttendance