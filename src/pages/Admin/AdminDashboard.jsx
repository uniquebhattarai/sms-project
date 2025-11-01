import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../../services/ApiConnector";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  FiUsers,
  FiBookOpen,
  FiLayers,
  FiClipboard,
  FiTrendingUp,
  FiActivity,
  FiCalendar,
  FiAward,
  FiRefreshCw,
} from "react-icons/fi";
import { Toast } from "../../../utils/Toast";

const Card = ({ children, className, hover = false, gradient = false }) => (
  <div
    className={`bg-white rounded-3xl shadow-xl border border-gray-100 transition-all duration-500 ease-out ${
      hover ? "hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]" : ""
    } ${gradient ? "bg-gradient-to-br from-white to-gray-50" : ""} ${
      className || ""
    }`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-8 ${className || ""}`}>{children}</div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
      </div>
    </div>
    <div className="ml-4">
      <div className="text-lg font-semibold text-gray-700">
        Loading Dashboard
      </div>
      <div className="text-sm text-gray-500">
        Please wait while we fetch your data...
      </div>
    </div>
  </div>
);

function AdminDashboard({ role = "admin" }) {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("access");

      if (!token) {
        Toast.error("You are not logged in");
        setError("Authentication required");
        setTimeout(() => {
          navigate("/");
        }, 2000);
        return;
      }

      const res = await apiConnector("GET", "/dashboard/", null, {
        Authorization: `Bearer ${token}`,
      });

      console.log("Dashboard API Response:", res); 
      if (res && res.data) {
        setDashboard(res.data);
      } else if (res) {
        setDashboard(res);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Failed to fetch dashboard", err);
      let errorMessage = "Failed to load dashboard data";
      if (err.response) {
        errorMessage = `Server Error: ${err.response.status} - ${err.response.statusText}`;
        if (err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.request) {
        errorMessage = "Network Error: No response from server";
      } else {
        errorMessage = err.message || "Unknown error occurred";
      }

      setError(errorMessage);
      Toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent>
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>

            {/* Debug Information */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left text-sm">
              <h3 className="font-bold mb-2">Debug Information:</h3>
              <p>
                <strong>Access token exists:</strong>{" "}
                {localStorage.getItem("access") ? "Yes" : "No"}
              </p>
              <p>
                <strong>Access token length:</strong>{" "}
                {localStorage.getItem("access")?.length || 0}
              </p>
              <p>
                <strong>Access token preview:</strong>{" "}
                {localStorage.getItem("access")?.substring(0, 20)}...
              </p>
              <p>
                <strong>Role:</strong>{" "}
                {localStorage.getItem("role") || "Not set"}
              </p>
              <p>
                <strong>Refresh token exists:</strong>{" "}
                {localStorage.getItem("refresh") ? "Yes" : "No"}
              </p>
              <p>
                <strong>API Base URL:</strong>{" "}
                https://prejjj.pythonanywhere.com/api
              </p>
              <p>
                <strong>Dashboard Endpoint:</strong> /dashboard/
              </p>
              <p>
                <strong>Full URL:</strong>{" "}
                https://prejjj.pythonanywhere.com/api/dashboard/
              </p>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={fetchDashboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <FiRefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("access");
                    console.log(
                      "Testing API call with token:",
                      token?.substring(0, 20) + "..."
                    );
                    const response = await fetch(
                      "https://prejjj.pythonanywhere.com/api/dashboard/",
                      {
                        method: "GET",
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    console.log("Raw response status:", response.status);
                    console.log("Raw response headers:", response.headers);
                    const data = await response.text();
                    console.log("Raw response data:", data);
                  } catch (err) {
                    console.error("Test API call error:", err);
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
              >
                Test API Call
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
              >
                Go to Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-200/20 rounded-full blur-xl animate-pulse delay-2000"></div>

      {/* Header */}
      <div className="relative bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                {role === "admin" ? "Admin Dashboard" : "Teacher Dashboard"}
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                {role === "admin"
                  ? "Welcome back! Here's what's happening across your school today."
                  : "Welcome back! Here's your teaching overview and class insights."}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
            <button
              onClick={() => role =="admin"? navigate("/admin/prediction"):navigate("/teacher/prediction")}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow hover:scale-105 transition"
            >
              🎯 Student Score Prediction
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Last updated</div>
                <div className="text-sm font-semibold text-gray-700">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={fetchDashboard}
                className="group bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl border border-gray-200 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <FiRefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-semibold">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {role === "admin" ? (
            // Admin view - full school overview
            <>
              <SummaryCard
                icon={<FiUsers />}
                label="Students"
                value={dashboard.total_students || 0}
                color="from-blue-500 to-blue-600"
                trend={
                  dashboard.students_this_month > 0
                    ? `+${dashboard.students_this_month}`
                    : "0"
                }
                delay={0}
              />
              <SummaryCard
                icon={<FiBookOpen />}
                label="Teachers"
                value={dashboard.total_teachers || 0}
                color="from-green-500 to-green-600"
                trend={
                  dashboard.teachers_this_month > 0
                    ? `+${dashboard.teachers_this_month}`
                    : "0"
                }
                delay={100}
              />
              <SummaryCard
                icon={<FiLayers />}
                label="Classes"
                value={dashboard.total_classes || 0}
                color="from-purple-500 to-purple-600"
                trend="Active"
                delay={200}
              />
              <SummaryCard
                icon={<FiClipboard />}
                label="Total Assignments"
                value={dashboard.total_assignments || 0}
                color="from-orange-500 to-orange-600"
                trend="All time"
                delay={300}
              />
              <SummaryCard
                icon={<FiActivity />}
                label="Active Assignments"
                value={dashboard.active_assignments || 0}
                color="from-red-500 to-red-600"
                trend="Current"
                delay={400}
              />
              <SummaryCard
                icon={<FiTrendingUp />}
                label="Attendance Rate"
                value={`${dashboard.overall_attendance_rate || 0}%`}
                color="from-emerald-500 to-emerald-600"
                trend="Overall"
                delay={500}
              />
            </>
          ) : (
            // Teacher view - focused on teaching metrics
            <>
              <SummaryCard
                icon={<FiUsers />}
                label="My Students"
                value={dashboard.total_students || 0}
                color="from-blue-500 to-blue-600"
                trend="Enrolled"
                delay={0}
              />
              <SummaryCard
                icon={<FiLayers />}
                label="My Classes"
                value={dashboard.total_classes || 0}
                color="from-purple-500 to-purple-600"
                trend="Teaching"
                delay={100}
              />
              <SummaryCard
                icon={<FiClipboard />}
                label="Assignments Created"
                value={dashboard.total_assignments || 0}
                color="from-orange-500 to-orange-600"
                trend="This term"
                delay={200}
              />
              <SummaryCard
                icon={<FiActivity />}
                label="Pending Reviews"
                value={dashboard.active_assignments || 0}
                color="from-red-500 to-red-600"
                trend="To grade"
                delay={300}
              />
              <SummaryCard
                icon={<FiTrendingUp />}
                label="Class Attendance"
                value={`${dashboard.overall_attendance_rate || 0}%`}
                color="from-emerald-500 to-emerald-600"
                trend="Average"
                delay={400}
              />
              <SummaryCard
                icon={<FiAward />}
                label="Performance"
                value="95%"
                color="from-indigo-500 to-indigo-600"
                trend="Excellent"
                delay={500}
              />
            </>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Attendance Trends by Class */}
          <Card hover gradient>
            <CardContent>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {role === "admin"
                      ? "School Attendance Trends"
                      : "My Class Attendance"}
                  </h2>
                  <p className="text-gray-600">
                    {role === "admin"
                      ? "Track attendance performance across all classes"
                      : "Monitor attendance in your classes over time"}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  <FiActivity className="w-4 h-4" />
                  <span className="font-semibold">Last 30 days</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart>
                  <defs>
                    <linearGradient
                      id="colorAttendance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  {dashboard.class_attendance &&
                    dashboard.class_attendance.map((cls, idx) => (
                      <Area
                        key={cls.class_id}
                        type="monotone"
                        data={cls.attendance_trend || []}
                        dataKey="attendance_rate"
                        name={cls.class_name}
                        stroke={`hsl(${idx * 60}, 70%, 50%)`}
                        fill={`hsl(${idx * 60}, 70%, 50%)`}
                        strokeWidth={3}
                        fillOpacity={0.1}
                      />
                    ))}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Class Average Attendance */}
          <Card hover gradient>
            <CardContent>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {role === "admin"
                      ? "Class Performance"
                      : "My Class Performance"}
                  </h2>
                  <p className="text-gray-600">
                    {role === "admin"
                      ? "Compare attendance performance across all classes"
                      : "Track performance metrics for your classes"}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  <FiAward className="w-4 h-4" />
                  <span className="font-semibold">Average attendance</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dashboard.class_attendance || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="class_name"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="average_attendance"
                    fill="url(#colorAttendanceBar)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="colorAttendanceBar"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card hover gradient>
          <CardContent>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {role === "admin"
                    ? "Recent Activities"
                    : "My Recent Activities"}
                </h2>
                <p className="text-gray-600">
                  {role === "admin"
                    ? "Stay updated with latest school-wide events and activities"
                    : "Track your recent teaching activities and student interactions"}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                <FiCalendar className="w-4 h-4" />
                <span className="font-semibold">Latest updates</span>
              </div>
            </div>
            <div className="space-y-6">
              {dashboard.recent_activities &&
              dashboard.recent_activities.length > 0 ? (
                dashboard.recent_activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start p-8 bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 hover:border-blue-200 relative overflow-hidden"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>

                    {/* Avatar with enhanced styling */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10">
                      {act.title ? act.title.charAt(0).toUpperCase() : "A"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <p className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                          {act.title || "Activity"}
                        </p>
                        <div className="flex items-center gap-2">
                          {act.type && (
                            <span className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                              {act.type}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {act.description || "No description available"}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
                          <FiCalendar className="w-4 h-4" />
                          <span className="font-medium">
                            {act.date
                              ? new Date(act.date).toLocaleDateString()
                              : "Unknown date"}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
                          <FiLayers className="w-4 h-4" />
                          <span className="font-medium">
                            {act.class_name || "Unknown class"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCalendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {role === "admin"
                      ? "No recent activities"
                      : "No recent teaching activities"}
                  </h3>
                  <p className="text-gray-500">
                    {role === "admin"
                      ? "School activities will appear here as they happen"
                      : "Your teaching activities will appear here as they happen"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  color = "from-blue-500 to-blue-600",
  trend,
  delay = 0,
}) {
  return (
    <div
      className="group bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-gray-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 ease-out cursor-pointer relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Icon container with enhanced styling */}
      <div
        className={`relative w-20 h-20 bg-gradient-to-br ${color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
      >
        <div className="text-3xl text-white drop-shadow-sm">{icon}</div>
        {/* Subtle glow effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
        ></div>
      </div>

      {/* Value with enhanced typography */}
      <div className="text-4xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 relative z-10">
        {value}
      </div>

      {/* Label with better spacing */}
      <div className="text-gray-600 font-semibold mb-4 text-center relative z-10">
        {label}
      </div>

      {/* Trend indicator with enhanced styling */}
      {trend && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200 shadow-sm relative z-10">
          <FiTrendingUp className="w-4 h-4" />
          <span className="font-semibold">{trend}</span>
        </div>
      )}

      {/* Decorative corner element */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
}

export default AdminDashboard;
