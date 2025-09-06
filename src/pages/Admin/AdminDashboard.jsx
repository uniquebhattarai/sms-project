import React, { useEffect, useState } from "react";
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

const Card = ({ children, className, hover = false }) => (
  <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 transition-all duration-300 ${hover ? 'hover:shadow-2xl hover:-translate-y-1' : ''} ${className || ""}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-8 ${className || ""}`}>{children}</div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <FiRefreshCw className="w-6 h-6 text-blue-600 animate-pulse" />
      </div>
    </div>
  </div>
);

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage - handle both string and object formats
      let token = localStorage.getItem("token");
      if (token) {
        try {
          token = JSON.parse(token);
        } catch (e) {
          // Token is already a string, use as is
        }
      }
      
      if (!token) {
        Toast.error("You are not logged in");
        setError("Authentication required");
        return;
      }

      const res = await apiConnector("GET", "/api/dashboard/", null, {
        Authorization: `Bearer ${token}`,
      });

      console.log("Dashboard API Response:", res); // Debug log
      
      // Check if response has data property
      if (res && res.data) {
        setDashboard(res.data);
      } else if (res) {
        // If response is the data directly
        setDashboard(res);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Failed to fetch dashboard", err);
      setError("Failed to load dashboard data");
      Toast.error("Failed to load dashboard data");
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            
            {/* Debug Information */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left text-sm">
              <h3 className="font-bold mb-2">Debug Information:</h3>
              <p><strong>Token exists:</strong> {localStorage.getItem("token") ? "Yes" : "No"}</p>
              <p><strong>Token length:</strong> {localStorage.getItem("token")?.length || 0}</p>
              <p><strong>Token preview:</strong> {localStorage.getItem("token")?.substring(0, 20)}...</p>
            </div>
            
            <button
              onClick={fetchDashboard}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <FiRefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <button
              onClick={fetchDashboard}
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          <SummaryCard
            icon={<FiUsers />}
            label="Students"
            value={dashboard.total_students || 0}
            color="from-blue-500 to-blue-600"
            trend={dashboard.students_this_month > 0 ? `+${dashboard.students_this_month}` : "0"}
          />
          <SummaryCard
            icon={<FiBookOpen />}
            label="Teachers"
            value={dashboard.total_teachers || 0}
            color="from-green-500 to-green-600"
            trend={dashboard.teachers_this_month > 0 ? `+${dashboard.teachers_this_month}` : "0"}
          />
          <SummaryCard
            icon={<FiLayers />}
            label="Classes"
            value={dashboard.total_classes || 0}
            color="from-purple-500 to-purple-600"
            trend="Active"
          />
          <SummaryCard
            icon={<FiClipboard />}
            label="Total Assignments"
            value={dashboard.total_assignments || 0}
            color="from-orange-500 to-orange-600"
            trend="All time"
          />
          <SummaryCard
            icon={<FiActivity />}
            label="Active Assignments"
            value={dashboard.active_assignments || 0}
            color="from-red-500 to-red-600"
            trend="Current"
          />
          <SummaryCard
            icon={<FiTrendingUp />}
            label="Attendance Rate"
            value={`${dashboard.overall_attendance_rate || 0}%`}
            color="from-emerald-500 to-emerald-600"
            trend="Overall"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Attendance Trends by Class */}
          <Card hover>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Attendance Trends</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiActivity className="w-4 h-4" />
                  <span>Last 30 days</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
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
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  {dashboard.class_attendance && dashboard.class_attendance.map((cls, idx) => (
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
          <Card hover>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Class Performance</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiAward className="w-4 h-4" />
                  <span>Average attendance</span>
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
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="average_attendance" 
                    fill="url(#colorAttendanceBar)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorAttendanceBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card hover>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Activities</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4" />
                <span>Latest updates</span>
              </div>
            </div>
            <div className="space-y-4">
              {dashboard.recent_activities && dashboard.recent_activities.length > 0 ? (
                dashboard.recent_activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4">
                      {act.title ? act.title.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                        {act.title || 'Activity'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {act.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          {act.date ? new Date(act.date).toLocaleDateString() : 'Unknown date'}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiLayers className="w-3 h-3" />
                          {act.class_name || 'Unknown class'}
                        </span>
                        {act.type && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {act.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <p className="text-gray-500 text-lg">No recent activities</p>
                  <p className="text-gray-400 text-sm mt-1">Activities will appear here as they happen</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color = "from-blue-500 to-blue-600", trend }) {
  return (
    <div className="group bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
      <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-2xl text-white">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
        {value}
      </div>
      <div className="text-gray-600 font-medium mb-2">{label}</div>
      {trend && (
        <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
          <FiTrendingUp className="w-3 h-3" />
          <span className="font-medium">{trend}</span>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
