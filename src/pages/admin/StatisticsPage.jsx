import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from "recharts";
import { FiUsers, FiLayers, FiActivity } from "react-icons/fi";
import axios from "axios";
// import { getStatistics } from "../../services/api";

const StatisticsPage = () => {
  const [stats, setStats] = useState({
    employees: 0,
    landings: 0,
    totalVisits: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");
        const config = {
           headers: { Authorization: `Bearer ${token}` }
        };
        
        const [summaryRes, trafficRes] = await Promise.all([
          axios.get("https://localhost:7007/api/statistics/summary", config),
          axios.get("https://localhost:7007/api/statistics/traffic", config)
        ]);

        setStats(summaryRes.data);
        setChartData(trafficRes.data);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <div className="text-center mt-10">Đang tải dữ liệu thống kê...</div>;

  return (
    <div className="space-y-6">
      {/* Thẻ thống kê (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Nhân viên */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-full text-2xl">
            <FiUsers />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Tổng nhân viên</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.employees}</h3>
          </div>
        </div>

        {/* Card Landing Pages */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-full text-2xl">
            <FiLayers />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Landing Pages</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.landings}</h3>
          </div>
        </div>

        {/* Card Tổng truy cập */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full text-2xl">
            <FiActivity />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Tổng lượt truy cập</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalVisits.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Biểu đồ thống kê */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Lượt truy cập theo Landing Page</h3>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="visits" name="Lượt xem" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;