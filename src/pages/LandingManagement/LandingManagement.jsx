// src/pages/LandingManagement/LandingManagement.jsx
import { useEffect, useState } from "react";
import { FiCheckCircle, FiCircle, FiEdit, FiEye, FiPlus } from "react-icons/fi"; // Import thêm icon
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

  // Hàm render badge trạng thái
  const renderStatusBadge = (status) => {
    if (status === "Published") {
      return (
        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-200">
          <FiCheckCircle /> Đã xuất bản
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold border border-gray-200">
        <FiCircle /> Bản nháp
      </span>
    );
  };

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
              className="border rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-blue-700 truncate flex-1 pr-2">{item.title}</h3>
                {renderStatusBadge(item.status)}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p className="truncate" title={`/${item.subdomain}/${item.slug}`}>
                    URL: <span className="font-medium text-gray-800">/{item.subdomain}/{item.slug}</span>
                </p>
                <p>Template: <span className="font-medium text-purple-600">{item.template}</span></p>
                <p>Màu: <span className={`font-medium text-${item.customColors}-600`}>{item.customColors}</span></p>
                <p className="text-xs text-gray-400 mt-2">Cập nhật: {item.updatedAt}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => window.open(`/${item.subdomain}/${item.slug}`, "_blank")}
                  className="flex-1 bg-white border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-semibold transition"
                >
                  <FiEye /> Xem
                </button>
                <button
                  onClick={() => navigate(`/admin/editor?id=${item.id}`)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium transition"
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