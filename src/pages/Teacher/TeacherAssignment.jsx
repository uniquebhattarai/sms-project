import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Assignmentlist } from "../../services/Apis";
import { Toast } from "../../../utils/Toast";

function TeacherAssignment({
  classes,
  subjects,
  selectedClass,
  setSelectedClass,
}) {
  const [selectedSubject, setSelectedSubject] = useState(""); 
  const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchHandler = async () => {
    if (!selectedClass || !selectedSubject) {
      Toast.success("Please select both class and subject", "error");
      return;
    }
    try {
      setLoading(true);
      const data = await Assignmentlist(selectedClass, selectedSubject);
      setAssignment(data);
    } catch (error) {
      Toast.error("Failed to fetch assignments", "error");
    } finally {
      setLoading(false);
    }
  };

  const clickhandler = () => {
    navigate("/teacher/create/assignment");
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const getDeadlineStatus = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return { status: 'overdue', color: 'text-red-600 bg-red-50', text: 'Overdue' };
    if (days === 0) return { status: 'today', color: 'text-orange-600 bg-orange-50', text: 'Due Today' };
    if (days <= 3) return { status: 'urgent', color: 'text-yellow-600 bg-yellow-50', text: `${days} days left` };
    return { status: 'normal', color: 'text-green-600 bg-green-50', text: `${days} days left` };
  };

  const getSelectedClassName = () => {
    const selectedClassObj = classes.find(cls => cls.id === parseInt(selectedClass));
    return selectedClassObj ? `Class ${selectedClassObj.level}` : '';
  };

  const getSelectedSubjectName = () => {
    const selectedSubjectObj = subjects.find(subj => subj.id === parseInt(selectedSubject));
    return selectedSubjectObj ? selectedSubjectObj.name : '';
  };

  const clearFilters = () => {
    setSelectedClass("");
    setSelectedSubject("");
    setAssignment([]);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Assignment Management
          </h1>
          <p className="text-gray-600">Manage and view assignments for your classes</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6 mb-6 border border-white/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Class Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Class
              </label>
              <select
                onChange={(e) => setSelectedClass(e.target.value)}
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

            {/* Subject Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)} 
                className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={!selectedClass}
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-end gap-2">
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={searchHandler}
                disabled={loading || !selectedClass || !selectedSubject}
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
              
              {(selectedClass || selectedSubject) && (
                <button
                  className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600 transition-all duration-200"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedClass || selectedSubject) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-700">
                Active Filters: 
                {selectedClass && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{getSelectedClassName()}</span>}
                {selectedSubject && <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">{getSelectedSubjectName()}</span>}
              </p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-white/30 overflow-hidden">
          
          {/* Results Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Assignment List</h2>
                <p className="text-blue-100 mt-1">
                  {assignment.length > 0 ? `Found ${assignment.length} assignment${assignment.length > 1 ? 's' : ''}` : 'No assignments to display'}
                </p>
              </div>
              <button
                onClick={clickhandler}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                + Create New Assignment
              </button>
            </div>
          </div>

          {/* Assignment Cards */}
          <div className="p-6">
            {assignment.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No assignments found</h3>
                <p className="text-gray-500">
                  {selectedClass || selectedSubject 
                    ? "Try selecting different filters or create a new assignment"
                    : "Select a class and subject to view assignments"
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {assignment.map((item, idx) => {
                  const deadlineStatus = getDeadlineStatus(item.deadline);
                  
                  return (
                    <div
                      key={item.id || idx}
                      className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-3 leading-relaxed">{item.assignment}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${deadlineStatus.color}`}>
                          {deadlineStatus.text}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Deadline:</span>
                          <span className="ml-1">{formatDate(item.deadline)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">Created:</span>
                          <span className="ml-1">{formatDate(item.created_at)}</span>
                        </div>
                        
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherAssignment;
