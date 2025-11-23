// src/pages/superadmin/SubscriptionManagement.jsx
import { useEffect, useState } from "react";
import { FiPackage } from "react-icons/fi";
import { getAllSubscriptions } from "../../services/api";

export default function SubscriptionManagement() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllSubscriptions();
        setSubs(data);
      } catch (error) { console.error(error); }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đăng ký (Subscriptions)</h1>
        <p className="text-gray-500">Theo dõi tình trạng sử dụng gói cước của các doanh nghiệp.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
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
          <tbody>
            {subs.map(sub => (
              <tr key={sub.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-bold text-gray-800">{sub.tenantName}</p>
                  <p className="text-xs text-gray-500">{sub.tenantEmail}</p>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-${sub.planColor}-100 text-${sub.planColor}-700`}>
                    <FiPackage /> {sub.planName}
                  </span>
                </td>
                <td className="p-4">
                  {sub.status === 'Active' 
                    ? <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs">● Đang hoạt động</span>
                    : <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-xs">● Hết hạn</span>
                  }
                </td>
                <td className="p-4 text-sm">
                  {sub.endDate ? new Date(sub.endDate).toLocaleDateString('vi-VN') : "Vĩnh viễn"}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {sub.storageLimit === -1 ? "Unlimited" : `${sub.storageLimit} MB`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subs.length === 0 && <div className="p-10 text-center text-gray-500">Chưa có dữ liệu đăng ký nào.</div>}
      </div>
    </div>
  );
}