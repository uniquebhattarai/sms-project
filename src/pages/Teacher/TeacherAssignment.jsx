import React, { useState } from "react";
import { createAssignment } from "../../services/Apis";
import { Toast } from "../../../utils/Toast";

function TeacherAssignment() {
  const [assignmentdata, setAsignmentData] = useState({
    title: "",
    assignment: "",
    classlevel: 1,
    subject: 1,
    deadline: "",
    teacher: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsignmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = await createAssignment(assignmentdata);
      console.log("Assignment created:", data);
      Toast.success("Assignment Created Successfully");
      setAsignmentData({
        title: "",
        assignment: "",
        classlevel: 1,
        subject: 1,
        deadline: "",
        teacher: 1,
      });
    } catch (error) {
      Toast.error("Failed to create Assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Assignment
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="space-y-6">
            {/* Title Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assignment Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter assignment title..."
                  value={assignmentdata.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl shadow-sm hover:shadow-md focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"

                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Assignment Content */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assignment Description
              </label>
              <textarea
                name="assignment"
                placeholder="Describe the assignment details, instructions, and requirements..."
                value={assignmentdata.assignment}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl shadow-sm hover:shadow-md focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"

                required
              />
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Level */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Class Level
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="classlevel"
                    placeholder="Grade level"
                    value={assignmentdata.classlevel}
                    onChange={handleChange}
                    min="1"
                    max="12"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl shadow-sm hover:shadow-md focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"

                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject ID
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="subject"
                    placeholder="Subject identifier"
                    value={assignmentdata.subject}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl shadow-sm hover:shadow-md focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"

                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Teacher ID */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teacher ID
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="teacher"
                    placeholder="Teacher identifier"
                    value={assignmentdata.teacher}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl shadow-sm hover:shadow-md focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"

                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deadline
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="deadline"
                    value={assignmentdata.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-2xl shadow-sm hover:shadow-md focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"

                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={submitHandler}
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Creating Assignment...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Assignment</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignment;