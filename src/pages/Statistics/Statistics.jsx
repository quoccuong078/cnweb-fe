// src/pages/Statistics/Statistics.jsx
import { useState, useEffect } from "react";
import { Users, Globe, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../services/api";

export default function Statistics() {
  const [stats, setStats] = useState({});
  const [growth, setGrowth] = useState([]);
  const [topTenants, setTopTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, growthRes, topRes] = await Promise.all([
          api.get("/api/superadmin/stats"),
          api.get("/api/superadmin/stats/growth"),
          api.get("/api/superadmin/stats/top-tenants"),
        ]);

        setStats(statsRes.data);
        setGrowth(growthRes.data || []);
        setTopTenants(topRes.data || []);
      } catch (err) {
        console.error("Lỗi tải thống kê:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="p-20 text-center">
        <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-purple-600 border-t-transparent"></div>
        <p className="mt-6 text-lg text-gray-600">Đang tải thống kê...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-purple-700 flex items-center gap-3">
          <BarChart3 className="w-9 h-9" />
          Thống kê doanh nghiệp
        </h1>
        <p className="text-gray-600 mt-2">Tổng quan hoạt động hệ thống FECN SaaS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Tổng doanh nghiệp</p>
              <p className="text-4xl font-bold text-purple-700 mt-2">
                {(stats.totalTenants || 0).toLocaleString()}
              </p>
              <p className="text-green-600 text-sm mt-2">↑ 28% tháng này</p>
            </div>
            <Globe className="text-5xl text-purple-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Tổng người dùng</p>
              <p className="text-4xl font-bold text-blue-700 mt-2">
                {(stats.totalUsers || 0).toLocaleString()}
              </p>
            </div>
            <Users className="text-5xl text-blue-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="text-green-600" /> Landing mới nhất
          </p>
          <p className="text-xl font-bold mt-2">{stats.newestLanding?.domain || "Chưa có"}</p>
          <p className="text-sm text-gray-500">
            {stats.newestLanding?.createdAt ? new Date(stats.newestLanding.createdAt).toLocaleDateString("vi-VN") : ""}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="text-red-600" /> Landing cũ nhất
          </p>
          <p className="text-xl font-bold mt-2">{stats.oldestLanding?.domain || "Chưa có"}</p>
          <p className="text-sm text-gray-500">
            {stats.oldestLanding?.createdAt ? new Date(stats.oldestLanding.createdAt).toLocaleDateString("vi-VN") : ""}
          </p>
        </div>
      </div>

      {growth.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-purple-600" />
            Tăng trưởng Tenant năm 2025
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tenants" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: "#8b5cf6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {topTenants.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Top 5 doanh nghiệp hoạt động mạnh
          </h2>
          <div className="space-y-4">
            {topTenants.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{t.name}</p>
                    <p className="text-sm text-gray-600">{t.users?.toLocaleString() || 0} người dùng</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-700">{t.visits?.toLocaleString() || 0}</p>
                  <p className="text-sm text-gray-600">lượt truy cập</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}