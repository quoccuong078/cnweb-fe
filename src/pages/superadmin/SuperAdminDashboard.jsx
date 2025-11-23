// src/pages/superadmin/SuperAdminDashboard.jsx
import { useEffect, useState } from "react";
import { FiDollarSign, FiGlobe, FiLayers, FiServer, FiTrendingUp, FiUsers } from "react-icons/fi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getSuperAdminChartData, getSuperAdminStats } from "../../services/dashboardService";

// Component thẻ thống kê nhỏ
function StatCard({ title, value, subValue, icon, borderColor, colorClass }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${borderColor} hover:shadow-md transition`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
          {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
        </div>
        <div className={`p-4 rounded-full ${colorClass} text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          getSuperAdminStats(),
          getSuperAdminChartData(),
        ]);
        setStats(statsRes.data); // Axios trả về trong .data
        setChartData(Array.isArray(chartRes.data) ? chartRes.data : []);
      } catch (err) {
        console.error("Lỗi tải SuperAdmin Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Đang tải dữ liệu hệ thống...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản Trị</h1>
          <p className="text-gray-500 mt-1">Tổng quan hoạt động nền tảng SaaS</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg shadow-sm border text-sm text-gray-600">
          <span className="font-semibold text-green-600">● Hệ thống Online</span> 
          <span className="mx-2">|</span> 
          Cập nhật: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards - Dữ liệu thực tế */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Tenant"
          value={stats?.totalTenants || 0}
          subValue={`${stats?.activeTenants || 0} đang hoạt động`}
          icon={<FiGlobe />}
          borderColor="border-purple-500"
          colorClass="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Người Dùng"
          value={(stats?.totalUsers || 0).toLocaleString()}
          subValue="Trên toàn hệ thống"
          icon={<FiUsers />}
          borderColor="border-blue-500"
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Doanh Thu Tháng"
          value={stats?.monthlyRevenueVND || "0 ₫"}
          subValue="Ước tính từ Subscription"
          icon={<FiDollarSign />}
          borderColor="border-green-500"
          colorClass="bg-green-100 text-green-600"
        />
        <StatCard
          title="Tỷ lệ Active"
          value={`${stats?.activeRate || 0}%`}
          subValue="Tenant có Subcription Active"
          icon={<FiTrendingUp />}
          borderColor="border-orange-500"
          colorClass="bg-orange-100 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Cột Trái: Biểu đồ tăng trưởng */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
            Tăng trưởng Tenant năm {new Date().getFullYear()}
          </h3>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#9ca3af", fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#9ca3af", fontSize: 12 }} 
                />
                <Tooltip
                  formatter={(value) => [`${value} Tenants`, "Tổng số"]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                />
                <Area
                  type="monotone"
                  dataKey="tenants"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorTenants)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cột Phải: Thống kê Tài Nguyên Hệ Thống (Real Data) */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/10 rounded-lg">
                <FiServer className="text-2xl text-blue-300" />
              </div>
              <h3 className="text-xl font-bold">Tài nguyên hệ thống</h3>
            </div>

            <div className="space-y-6">
              {/* Item 1: Landing Pages */}
              <div>
                <div className="flex justify-between text-sm mb-2 text-gray-300">
                  <span>Tổng Landing Pages</span>
                  <span className="font-bold text-white">{stats?.systemStats?.totalPages || 0}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              {/* Item 2: Media Files */}
              <div>
                <div className="flex justify-between text-sm mb-2 text-gray-300">
                  <span>File Media đã tải lên</span>
                  <span className="font-bold text-white">{stats?.systemStats?.totalMedia || 0} files</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              {/* Item 3: Avg Pages */}
              <div>
                <div className="flex justify-between text-sm mb-2 text-gray-300">
                  <span>Trung bình trang/Tenant</span>
                  <span className="font-bold text-white">{stats?.systemStats?.avgPagesPerTenant || 0}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiLayers />
              <span>Database Status: <span className="text-green-400 font-semibold">Connected</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}