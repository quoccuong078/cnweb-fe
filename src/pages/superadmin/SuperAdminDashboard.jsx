// src/pages/superadmin/SuperAdminDashboard.jsx
import { useEffect, useState } from "react";
import { FiDollarSign, FiGlobe, FiTrendingUp, FiUsers } from "react-icons/fi";
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

function StatCard({ title, value, icon, borderColor }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${borderColor} hover:shadow-xl transition`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
        </div>
        <div className={`p-4 rounded-full bg-${borderColor.split("-")[1]}-100 text-${borderColor.split("-")[1]}-600 text-2xl`}>
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
        setStats(statsRes);
        setChartData(Array.isArray(chartRes) ? chartRes : []);
      } catch (err) {
        console.error("Lỗi tải SuperAdmin Dashboard:", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-2xl text-purple-600 font-medium">Đang tải dữ liệu hệ thống...</div>
      </div>
    );
  }

  const hasChartData = chartData && chartData.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-purple-700">Tổng quan hệ thống</h1>
        <p className="text-gray-600 mt-1">Quản lý toàn bộ nền tảng SaaS đa tenant</p>
      </div>

      {/* Stats Cards - Nhỏ gọn như Admin Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Tenant"
          value={stats?.totalTenants || 0}
          icon={<FiGlobe />}
          borderColor="border-purple-600"
        />
        <StatCard
          title="Tổng Người Dùng"
          value={(stats?.totalUsers || 0).toLocaleString()}
          icon={<FiUsers />}
          borderColor="border-blue-600"
        />
        <StatCard
          title="Doanh Thu Tháng"
          value={stats?.monthlyRevenueVND || "0M ₫"}
          icon={<FiDollarSign />}
          borderColor="border-green-600"
        />
        <StatCard
          title="Tăng Trưởng"
          value="↑ 28%"
          icon={<FiTrendingUp />}
          borderColor="border-orange-600"
        />
      </div>

      {/* Biểu đồ + Thông tin hệ thống */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Biểu đồ */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-lg border">
          <h3 className="text-xl font-bold text-purple-700 mb-4">
            Tăng trưởng Tenant năm {new Date().getFullYear()}
          </h3>

          {hasChartData ? (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTenants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: "#666" }} />
                <YAxis tick={{ fill: "#666" }} />
                <Tooltip
                  formatter={(value) => `${value} tenant${value > 1 ? "s" : ""}`}
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #ddd" }}
                />
                <Area
                  type="monotone"
                  dataKey="tenants"
                  stroke="#9333ea"
                  fillOpacity={1}
                  fill="url(#colorTenants)"
                  strokeWidth={3}
                  dot={{ fill: "#9333ea", r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-xl font-medium text-gray-600">Chưa có dữ liệu tăng trưởng</p>
              <p className="text-sm text-gray-500 mt-2">Sẽ hiển thị khi có tenant mới</p>
            </div>
          )}
        </div>

        {/* Thông tin hệ thống - Nhỏ gọn */}
        <div className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Hệ thống ổn định</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Tổng lượt truy cập</span>
              <span className="font-bold">1.8M+</span>
            </div>
            <div className="flex justify-between">
              <span>Tenant hoạt động</span>
              <span className="font-bold text-green-300">100%</span>
            </div>
            <div className="flex justify-between">
              <span>Phản hồi trung bình</span>
              <span className="font-bold">&lt; 70ms</span>
            </div>
            <div className="flex justify-between">
              <span>Backup</span>
              <span className="font-bold text-green-300">Hoàn tất</span>
            </div>
          </div>
        </div>
      </div>

      {/* ĐÃ XÓA FOOTER THEO YÊU CẦU */}
    </div>
  );
}