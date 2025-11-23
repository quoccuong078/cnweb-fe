// src/pages/Dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import { FiArrowRight, FiBarChart2, FiFileText, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // 1. Thêm dòng này
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAdminChartData, getAdminStats } from "../../services/dashboardService";

function StatCard({ title, value, icon, color = "indigo" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 border-${color}-600 hover:shadow-md transition`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
        </div>
        <div className={`p-4 rounded-full bg-${color}-50 text-${color}-600 text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate(); // 2. Khai báo navigate
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([getAdminStats(), getAdminChartData()]);
        setStats(statsRes.data);
        setChartData(Array.isArray(chartRes.data) ? chartRes.data : []);
      } catch (err) {
        console.error("Lỗi tải dashboard:", err);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const hasChartData = chartData && chartData.length > 0;
  const topPages = stats?.topPages || [];

  return (
    <div className="space-y-8 p-2">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Tổng Quan</h1>
        <p className="text-gray-500 mt-1">Theo dõi hiệu suất các trang Landing Page của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Lượt truy cập (30 ngày)"
          value={(stats?.visitors || 0).toLocaleString()}
          icon={<FiBarChart2 />}
          color="indigo"
        />
        <StatCard
          title="Khách truy cập (Unique)"
          value={(stats?.uniqueVisitors || 0).toLocaleString()}
          icon={<FiUsers />}
          color="blue"
        />
        <StatCard
          title="Trang đã xuất bản"
          value={stats?.publishedPages || 0}
          icon={<FiFileText />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột Trái: Biểu đồ */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            Biểu đồ tăng trưởng
          </h3>

          {hasChartData ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "#9CA3AF", fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: "#9CA3AF", fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [value.toLocaleString(), ""]}
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#6366f1"
                  name="Lượt xem"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#10b981"
                  name="Khách unique"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-4 grayscale opacity-30">📊</div>
              <p className="text-gray-500 font-medium">Chưa có dữ liệu truy cập</p>
              <p className="text-sm text-gray-400 mt-1">Hãy chia sẻ Landing Page để nhận thống kê</p>
            </div>
          )}
        </div>

        {/* Cột Phải: Top Pages */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
            Top Trang Hiệu Quả
          </h3>

          <div className="flex-1 overflow-y-auto pr-2">
            {topPages.length > 0 ? (
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={page.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                        ${index === 0 ? "bg-yellow-100 text-yellow-700" : 
                          index === 1 ? "bg-gray-100 text-gray-700" : 
                          index === 2 ? "bg-orange-100 text-orange-700" : "bg-blue-50 text-blue-600"}`}>
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 truncate text-sm">{page.name}</p>
                        <p className="text-xs text-gray-500 truncate">/{page.slug}</p>
                      </div>
                    </div>
                    
                    <div className="text-right pl-2">
                      <p className="font-bold text-indigo-600 text-sm">{page.totalViews}</p>
                      <p className="text-[10px] text-gray-400 uppercase">Views</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="p-4 bg-gray-50 rounded-full mb-3">
                  <FiFileText className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-600 font-medium">Chưa có trang nào</p>
                <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Các trang có lượt truy cập cao nhất sẽ hiển thị tại đây.</p>
              </div>
            )}
          </div>

          {/* 3. Gắn sự kiện onClick chuyển trang */}
          <button 
            onClick={() => navigate("/admin/landing-management")}
            className="w-full mt-6 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
          >
            Xem tất cả trang <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}