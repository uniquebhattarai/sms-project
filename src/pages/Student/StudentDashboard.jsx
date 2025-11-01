import React, { useEffect, useState } from "react";
import { 
  Sparkles, Target, AlertCircle, Calendar, CheckCircle, Award, Users, TrendingUp, BarChart3 
} from "lucide-react";
import { apiConnector } from "../../services/ApiConnector";

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await apiConnector("GET", "/student_dashboard/", null, {
          Authorization: `Bearer ${token}`,
        });
        setDashboardData(res.data);
      } catch (err) {
        console.error("Dashboard Fetch Error", err);
      }
    };

    const fetchPrediction = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await apiConnector("GET", "/mark_prediction/", null, {
          Authorization: `Bearer ${token}`,
        });
        const score = await apiConnector("POST", "/score_prediction/", res.data, {
          Authorization: `Bearer ${token}`,
        });
        setPrediction(score.data.predicted_final_exam_scores?.[0]);
      } catch (err) {
        console.error("Prediction Error", err);
      }
    };

    const loadAll = async () => {
      await Promise.all([fetchDashboard(), fetchPrediction()]);
      setLoading(false);
    };

    loadAll();
  }, []);

  // Scale backend prediction (out of 80) to 100-point scale
  const scaledPrediction = prediction ? (prediction * 100 / 80) : null;

  const getScoreColor = (score) => {
    if (score >= 70) return "from-emerald-500 to-teal-600";
    if (score >= 50) return "from-amber-500 to-orange-600";
    return "from-rose-500 to-red-600";
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  const getScoreStatus = (score) => {
    if (score >= 70) return { text: "Excellent Performance", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (score >= 50) return { text: "Good Performance", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    return { text: "Needs Improvement", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, gradient }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-wide">{title}</h3>
      <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 font-medium">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 text-xl font-semibold">Loading your dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing your performance data</p>
        </div>
      </div>
    );
  }

  const status = getScoreStatus(scaledPrediction);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-emerald-600 bg-clip-text text-transparent">
              Welcome back, Student
            </h1>
            <p className="text-gray-600 font-medium">Track your academic progress & predicted outcomes</p>
          </div>
        </div>

        <div className="mb-10">
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                  <Target className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Score Prediction</h2>
                  <p className="text-indigo-100 text-sm font-medium">Expected Final Exam Score</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 items-end">
                <div className="md:col-span-2">
                  <div className="flex items-end gap-6">
                    <div>
                      <p className="text-8xl font-black tracking-tight">
                        {scaledPrediction ? scaledPrediction.toFixed(1) : "N/A"}
                      </p>
                      <p className="text-indigo-100 text-lg font-semibold mt-2">out of 100</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl px-8 py-5 mb-4 border border-white border-opacity-20">
                      <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mb-1">Grade</p>
                      <p className="text-5xl font-black text-green-600">{scaledPrediction ? getScoreGrade(scaledPrediction) : "N/A"}</p>
                    </div>
                  </div>

                  <div className={`mt-6 inline-flex items-center gap-2 ${status.bg} ${status.border} border-2 rounded-full px-5 py-2.5`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${status.color.replace('text', 'bg')} animate-pulse`}></div>
                    <span className={`${status.color} font-bold text-sm`}>{status.text}</span>
                  </div>
                </div>

                <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-gray-800" />
                    <h3 className="font-bold text-sm text-gray-800">About Prediction</h3>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    The system evaluates your attendance, assignments, internal marks, and past performance to estimate your final exam score.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard icon={Calendar} title="Attendance" value={`${dashboardData?.attendance?.percentage?.toFixed(1)}%`} subtitle={`${dashboardData?.attendance?.attendance_rate} of ${dashboardData?.attendance?.total} classes`} gradient="from-purple-500 to-indigo-600" />
          <MetricCard icon={CheckCircle} title="Assignments" value={`${dashboardData?.assignment?.average_assignment_submission_percentage}%`} subtitle={`${dashboardData?.assignment?.unsubmitted_assignment} pending`} gradient="from-emerald-500 to-teal-600" />
          <MetricCard icon={Award} title="Assessment" value={`${dashboardData?.internal_assesment?.avg_intarnal_assesment_mark}%`} subtitle="Internal score avg" gradient="from-amber-500 to-orange-600" />
          <MetricCard icon={Users} title="Participation" value={dashboardData?.class_participation?.average_class_participation?.toFixed(1)} subtitle="Class engagement" gradient="from-pink-500 to-rose-600" />
        </div>

      </div>
    </div>
  );
}
