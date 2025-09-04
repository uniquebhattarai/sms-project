import React, { useEffect, useState } from "react";
import {
  UpdateAssignment,
  getAssignment,
  deleteAssignment,
} from "../../services/Apis";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../../utils/Toast";

function AssignmentDetails({ role = "teacher" }) {
  const { id } = useParams();
  const [assignmentData, setAssignmentData] = useState(null);
  const [Updated, setupdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const response = await getAssignment(id);
        setAssignmentData(response);
      } catch (error) {
        Toast.error("Failed to fetch Assignment");
      }finally{
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleChange = (e) => {
    setAssignmentData({
      ...assignmentData,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpdate = async () => {
    try {
      await UpdateAssignment(id, assignmentData);
      Toast.success("Assignment Updated Successfully");
      setupdate(false);
    } catch (error) {
      Toast.error("Error while updating");
    }
  };

  const deleteHandler = async()=>{
    if (!window.confirm("Are you sure you want to delete your Assignment?")) return;
    try {
      await deleteAssignment(id);
      Toast.success("Assignment Deleted Successfully");
      navigate(role==="teacher"?"/teacher/assignment":"/admin/assignment");
    } catch (error) {
      console.error("Error while deleting Assignment",error);
      Toast.error("Error while deleting Assignment");
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-1/3 mb-8"></div>
              <div className="space-y-6">
                <div className="h-20 bg-slate-200 rounded"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
                <div className="h-16 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(role==="teacher"?"/teacher/assignment":"/admin/assignment")}
            className="flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-200 mb-4 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Assignments
          </button>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Assignment Details</h1>
          <p className="text-slate-600">View, edit, or delete assignment information</p>
        </div>
  
        {assignmentData ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Status Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Assignment Active</span>
                </div>
                <div className="text-sm opacity-90">
                  ID: {id}
                </div>
              </div>
            </div>
  
            <div className="p-8">
              <div className="grid gap-8">
                {/* Title */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-colors duration-200">
                  <label className=" text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Assignment Title
                  </label>
                  {Updated ? (
                    <input
                      type="text"
                      name="title"
                      value={assignmentData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-medium bg-white shadow-sm"
                      placeholder="Enter assignment title..."
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-slate-800 leading-tight">{assignmentData.title}</h2>
                  )}
                </div>
  
                {/* Content */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-colors duration-200">
                  <label className=" text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Assignment Content
                  </label>
                  {Updated ? (
                    <textarea
                      name="assignment"
                      value={assignmentData.assignment}
                      onChange={handleChange}
                      rows="8"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-vertical bg-white shadow-sm"
                      placeholder="Enter assignment description..."
                    />
                  ) : (
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border">
                        {assignmentData.assignment}
                      </p>
                    </div>
                  )}
                </div>
  
                {/* Deadline */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-colors duration-200">
                  <label className=" text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Deadline
                  </label>
                  {Updated ? (
                    <input
                      type="date"
                      name="deadline"
                      value={assignmentData.deadline}
                      onChange={handleChange}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg bg-white shadow-sm"
                    />
                  ) : (
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-xl font-semibold text-slate-800 block">
                            {new Date(assignmentData.deadline).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="text-sm text-slate-500">
                            Due in {Math.ceil((new Date(assignmentData.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
  
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-slate-200">
                {Updated ? (
                  <div className="flex gap-4 flex-1">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                    >
                      <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => setupdate(false)}
                      className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setupdate(true)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit Assignment</span>
                  </button>
                )}
  
                <button
                  type="button"
                  onClick={deleteHandler}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-slate-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Assignment Found</h3>
            <p className="text-slate-500">The assignment data could not be loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignmentDetails;
