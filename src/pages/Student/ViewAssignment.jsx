import React, { useEffect, useState } from "react";
import { getAssignment } from "../../services/Apis";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../../utils/Toast";

function ViewAssignment() {
  const { id } = useParams();
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(16)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        const response = await getAssignment(id);
        setAssignmentData(response);
      } catch (error) {
        Toast.error("Failed to fetch Assignment");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const adjustFontSize = (change) => {
    setFontSize(prev => Math.max(12, Math.min(24, prev + change)));
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="animate-pulse">
              <div className="bg-slate-800 h-16"></div>
              <div className="p-8 space-y-6">
                <div className="h-8 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const containerClass = isFullscreen 
  ? "fixed inset-0 z-50 bg-slate-900" 
  : "min-h-screen bg-white p-6";

  return (
    <div className={containerClass}>
      <div className={isFullscreen ? "h-full flex flex-col" : "max-w-5xl mx-auto"}>
        {/* Header Toolbar */}
        <div className="bg-slate-800 text-white px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isFullscreen && (
                <button
                  onClick={() => console.log('Navigate back')}
                  className="flex items-center text-blue-500 hover:text-white transition-colors group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-bold text-lg text-blue-500">Assignment Viewer</h1>
                  <p className="text-xs text-slate-400">ID: {assignmentData?.id}</p>
                </div>
              </div>
            </div>
            
            {/* Toolbar Controls */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => adjustFontSize(-2)}
                  className="p-2 hover:bg-slate-600 rounded text-sm font-bold"
                  title="Decrease font size"
                >
                  A-
                </button>
                <span className="text-xs px-2 text-slate-300">{fontSize}px</span>
                <button
                  onClick={() => adjustFontSize(2)}
                  className="p-2 hover:bg-slate-600 rounded text-sm font-bold"
                  title="Increase font size"
                >
                  A+
                </button>
              </div>
              
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d={isFullscreen 
                      ? "M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9v-4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5M15 15h4.5m0 0l5.5 5.5"
                      : "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15m-5.25 5.25v-4.5m0 4.5h4.5m-4.5 0L9 15"
                    } 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {assignmentData ? (
          <div className={isFullscreen ? "flex-1 overflow-hidden" : ""}>
            {/* PDF-style Document Container */}
            <div className={`bg-white shadow-2xl ${isFullscreen ? 'h-full flex flex-col' : 'rounded-b-xl'}`}>
              {/* Document Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 px-8 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-800 mb-3 leading-tight">
                      {assignmentData.title}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Course: {assignmentData.course}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Instructor: {assignmentData.instructor}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Est. Time: {assignmentData.estimatedTime}
                      </div>
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                      <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Due Date</div>
                      <div className="text-sm font-bold text-slate-800">
                        {new Date(assignmentData.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-red-600 font-medium">
                        {Math.ceil((new Date(assignmentData.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div className={`${isFullscreen ? 'flex-1 overflow-y-auto' : ''} px-8 py-8`}>
                <div className="max-w-none" style={{ fontSize: `${fontSize}px` }}>
                  <div className="prose prose-slate prose-lg max-w-none">
                    <div className="bg-slate-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-blue-800">Assignment Instructions</span>
                      </div>
                      <p className="text-slate-700 m-0">Please read through all sections carefully before beginning your work.</p>
                    </div>
                    
                    <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                      {assignmentData.assignment}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Footer */}
              <div className="border-t border-slate-200 bg-slate-50 px-8 py-4 text-center text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <div>Assignment ID: {assignmentData.id}</div>
                  <div>Generated on {new Date().toLocaleDateString()}</div>
                  <div>Page 1 of 1</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-b-xl shadow-2xl p-12 text-center">
            <div className="text-slate-400 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-3">Assignment Not Found</h3>
            <p className="text-slate-500 text-lg">The requested assignment could not be loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAssignment;
