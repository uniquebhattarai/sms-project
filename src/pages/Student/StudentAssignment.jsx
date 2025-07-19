import React, { useEffect, useState } from 'react'
import { studentAssignment } from '../../services/Apis'
import { useNavigate } from 'react-router-dom';

function StudentAssignment() {
  const [assignments,setAssignments]= useState([]);
  const [loading,setloading]=useState(true);
   const navigate = useNavigate();

  useEffect(()=>{
    const fetchAssignment = async()=>{
      try {
        const data = await studentAssignment();
        setAssignments(data);
      } catch (error) {
        console.error("Failed to fetch assignments",error);
      }finally{
        setloading(false);
      }
    }
    fetchAssignment();
  },[]);

  const getDaysUntilDeadline = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="h-10 bg-slate-200 rounded-lg w-1/3 mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 rounded-lg w-2/3 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-6 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Assignments Yet</h3>
            <p className="text-slate-500 text-lg">Check back later for new assignments from your instructors.</p>
          </div>
        </div>
      </div>
    );
  }


  const clickHandler=(assignments)=>{
    navigate(`/student/assignment/details/${assignments.id}`,{
      state:{assignments},
    });
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-3 text-center">Your Assignments</h1>
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => {
            const daysLeft = getDaysUntilDeadline(assignment.deadline);
            return (
              <div
                key={assignment.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 overflow-hidden group"
              >
                <div className="h-1 bg-indigo-500"></div>

                <div className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200 leading-tight">
                      {assignment.title}
                    </h2>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {assignment.assignment.slice(0-50)}.......
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Due:</span>
                      <span className="text-sm font-semibold text-slate-700">
                        {new Date(assignment.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Time remaining:</span>
                      <span className={`text-sm font-semibold ${
                        daysLeft < 0 ? 'text-red-600' :
                        daysLeft <= 3 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
                          daysLeft === 0 ? 'Due today' :
                          `${daysLeft} days left`}
                      </span>
                    </div>

                    <button onClick={() => clickHandler(assignment)} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StudentAssignment