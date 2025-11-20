// src/pages/LandingManagement/LandingManagement.jsx
import { useEffect, useState } from "react";
import { FiEdit, FiEye, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getMyLandings } from "../../services/api";

export default function LandingManagement() {
  const navigate = useNavigate();
  const [landings, setLandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandings = async () => {
      try {
        const data = await getMyLandings();
        setLandings(data);
      } catch (err) {
        console.error("Lỗi tải danh sách landing:", err);
        alert("Không tải được danh sách trang");
      } finally {
        setLoading(false);
      }
    };
    fetchLandings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Đang tải danh sách trang...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-blue-700">Quản lý Landing Page</h1>
          <p className="text-gray-500 text-sm mt-1">
            Danh sách landing page của doanh nghiệp bạn
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/create-landing")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition w-full lg:w-auto justify-center"
        >
          <FiPlus size={18} /> Tạo Landing Page Mới
        </button>
      </div>

      {landings.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-4">Bạn chưa có landing page nào</p>
          <button
            onClick={() => navigate("/admin/create-landing")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Tạo trang đầu tiên ngay!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landings.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <h3 className="text-lg font-bold text-blue-700 mb-3">{item.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>URL: <span className="font-medium">/{item.subdomain}/{item.slug}</span></p>
                <p>Template: <span className="font-medium text-purple-600">{item.template}</span></p>
                <p>Màu: <span className={`font-medium text-${item.customColors}-600`}>{item.customColors}</span></p>
                <p className="text-xs">Cập nhật: {item.updatedAt}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.open(`/${item.subdomain}/${item.slug}`, "_blank")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium"
                >
                  <FiEye /> Xem
                </button>
                <button
                  onClick={() => navigate(`/admin/editor?id=${item.id}`)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium"
                >
                  <FiEdit /> Sửa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}