import React, { useEffect, useState } from "react";
import { getAssignment } from "../../services/Apis";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../../utils/Toast";

function ViewAssignment() {
  const { id } = useParams();
  const [assignmentData, setAssignmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
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

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const adjustFontSize = (change) => setFontSize(prev => Math.max(12, Math.min(24, prev + change)));

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-slate-900"
    : "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6";

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="animate-pulse">
              <div className="bg-green-500 h-16"></div>
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

  return (
    <div className={containerClass}>
      <div className={isFullscreen ? "h-full flex flex-col" : "max-w-5xl mx-auto"}>
        {/* Updated Toolbar */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 shadow-xl rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isFullscreen && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-white hover:text-slate-100 group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-bold text-lg text-white">Assignment Viewer</h1>
                  <p className="text-xs text-white/80">ID: {assignmentData?.id}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => adjustFontSize(-2)}
                  className="p-2 hover:bg-white/20 rounded text-sm font-bold text-white"
                  title="Decrease font size"
                >
                  A-
                </button>
                <span className="text-xs px-2 text-white">{fontSize}px</span>
                <button
                  onClick={() => adjustFontSize(2)}
                  className="p-2 hover:bg-white/20 rounded text-sm font-bold text-white"
                  title="Increase font size"
                >
                  A+
                </button>
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Assignment Content */}
        {assignmentData ? (
          <div className={isFullscreen ? "flex-1 overflow-hidden" : ""}>
            <div className={`bg-white shadow-2xl ${isFullscreen ? 'h-full flex flex-col' : 'rounded-b-xl'}`}>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 px-8 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-800 mb-3">{assignmentData.title}</h1>
                    <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                      <div className="flex items-center">📘 Course: {assignmentData.course}</div>
                      <div className="flex items-center">👨‍🏫 Instructor: {assignmentData.instructor}</div>
                      <div className="flex items-center">⏱ Est. Time: {assignmentData.estimatedTime}</div>
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                      <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Due Date</div>
                      <div className="text-sm font-bold text-slate-800">
                        {new Date(assignmentData.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </div>
                      <div className="text-xs text-red-600 font-medium">
                        {Math.ceil((new Date(assignmentData.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${isFullscreen ? 'flex-1 overflow-y-auto' : ''} px-8 py-8`}>
                <div className="max-w-none" style={{ fontSize: `${fontSize}px` }}>
                  <div className="prose prose-slate prose-lg max-w-none">
                    <div className="bg-slate-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8">
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-green-700">📄 Assignment Instructions</span>
                      </div>
                      <p className="text-slate-700 m-0">Please read through all sections carefully before beginning your work.</p>
                    </div>
                    <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
                      {assignmentData.assignment}
                    </div>
                  </div>
                </div>
              </div>

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
            <h3 className="text-2xl font-bold text-slate-700 mb-3">Assignment Not Found</h3>
            <p className="text-slate-500 text-lg">The requested assignment could not be loaded.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAssignment;
