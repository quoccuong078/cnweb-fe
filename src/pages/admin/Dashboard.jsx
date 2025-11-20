import { useEffect, useState } from "react";
import { FiBarChart2, FiFileText, FiUsers } from "react-icons/fi";
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
    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-600 hover:shadow-xl transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
        </div>
        <div className={`p-4 rounded-full bg-${color}-100 text-${color}-600 text-3xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([getAdminStats(), getAdminChartData()]);
        setStats(statsRes);
        setChartData(Array.isArray(chartRes) ? chartRes : []);
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
        <div className="text-2xl text-indigo-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  const hasChartData = chartData && chartData.length > 0;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Doanh Nghiệp</h1>
        <p className="text-gray-600 mt-1">Theo dõi hiệu suất website của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Lượt truy cập 30 ngày"
          value={(stats?.visitors || 0).toLocaleString()}   // ← Sửa ở đây
          icon={<FiBarChart2 />}
        />
        <StatCard
          title="Khách duy nhất"
          value={(stats?.uniqueVisitors || 0).toLocaleString()}   // ← Và đây nữa (nếu có)
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

      {/* Biểu đồ + Hoạt động */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biểu đồ */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-2xl border">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Lượt truy cập 30 ngày qua</h3>

          {hasChartData ? (
            <ResponsiveContainer width="100%" height={420}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fill: "#666" }} />
                <YAxis tick={{ fill: "#666" }} />
                <Tooltip
                  formatter={(value) => value.toLocaleString()}
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #ddd" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#6366f1"
                  name="Lượt xem"
                  strokeWidth={4}
                  dot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#10b981"
                  name="Khách duy nhất"
                  strokeWidth={4}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
              <div className="text-8xl mb-6">📈</div>
              <p className="text-2xl font-bold text-gray-700">Chưa có dữ liệu truy cập</p>
              <p className="text-gray-500 mt-3">Biểu đồ sẽ hiển thị khi có lượt truy cập đầu tiên</p>
            </div>
          )}
        </div>

        {/* Hoạt động gần đây */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl border">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Hoạt động gần đây</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-green-500 mt-2"></div>
              <div>
                <p className="font-medium">Trang chủ đã được cập nhật</p>
                <p className="text-sm text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="font-medium">Thêm 5 sản phẩm mới</p>
                <p className="text-sm text-gray-500">Hôm qua</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-3 h-3 rounded-full bg-purple-500 mt-2"></div>
              <div>
                <p className="font-medium">Tối ưu SEO cho trang liên hệ</p>
                <p className="text-sm text-gray-500">3 ngày trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}