import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function TeacherAssignment({classes,subjects,selectedClass,setSelectedClass}) {
  
  const navigate = useNavigate();

  const clickhandler = () => {
    navigate("/teacher/create/assignment");
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/30">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Assignment List
          </h1>
        </div>

        {/* Class Select */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Class
          </label>
          <select
            onChange={(e) => setSelectedClass(e.target.value)}
            value={selectedClass}
            className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                Class {cls.level}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Select */}
        {selectedClass && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Subject
            </label>
            <select
              className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.name}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Create Button */}
        <div className="text-center">
          <button
            onClick={clickhandler}
            className="w-full py-3 px-6 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
          >
            + Create New Assignment
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignment;
