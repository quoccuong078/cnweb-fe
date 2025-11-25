// src/pages/superadmin/SubscriptionManagement.jsx
import { useEffect, useState } from "react";
import { FiPackage, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getAllSubscriptions } from "../../services/api";

export default function SubscriptionManagement() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getAllSubscriptions();
        setSubs(data);
      } catch (error) { 
        console.error(error); 
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubs = subs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subs.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đăng ký (Subscriptions)</h1>
        <p className="text-gray-500 text-sm mt-1">Theo dõi tình trạng sử dụng gói cước của các doanh nghiệp.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Doanh nghiệp (Tenant)</th>
                <th className="p-4 font-semibold text-gray-600">Gói cước</th>
                <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-600">Ngày hết hạn</th>
                <th className="p-4 font-semibold text-gray-600">Dung lượng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                 <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                 </tr>
              ) : currentSubs.length > 0 ? (
                currentSubs.map(sub => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{sub.tenantName}</p>
                      <p className="text-xs text-gray-500">{sub.tenantEmail}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-${sub.planColor}-100 text-${sub.planColor}-700 border border-${sub.planColor}-200`}>
                        <FiPackage /> {sub.planName}
                      </span>
                    </td>
                    <td className="p-4">
                      {sub.status === 'Active' 
                        ? <span className="text-green-700 font-bold bg-green-100 px-2 py-1 rounded text-xs border border-green-200">● Đang hoạt động</span>
                        : <span className="text-red-700 font-bold bg-red-100 px-2 py-1 rounded text-xs border border-red-200">● Hết hạn</span>
                      }
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {sub.endDate ? new Date(sub.endDate).toLocaleDateString('vi-VN') : "Vĩnh viễn"}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {sub.storageLimit === -1 ? "Không giới hạn" : `${sub.storageLimit} MB`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-500">Chưa có dữ liệu đăng ký nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Thanh Phân Trang*/}
        {!loading && subs.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between bg-gray-50 gap-4">
                <span className="text-sm text-gray-500">
                    Hiển thị <span className="font-medium text-gray-900">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, subs.length)}</span> trong tổng số <span className="font-medium text-gray-900">{subs.length}</span> bản ghi
                </span>
                
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border ${
                            currentPage === 1 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" 
                            : "bg-white text-gray-600 hover:bg-gray-100 border-gray-300 transition"
                        }`}
                    >
                        <FiChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Render số trang */}
                    {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === pageNum
                                        ? "bg-purple-600 text-white border border-purple-600 shadow-sm"
                                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                                }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border ${
                            currentPage === totalPages 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" 
                            : "bg-white text-gray-600 hover:bg-gray-100 border-gray-300 transition"
                        }`}
                    >
                        <FiChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}