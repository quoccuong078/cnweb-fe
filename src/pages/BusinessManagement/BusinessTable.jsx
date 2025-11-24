// src/pages/BusinessManagement/BusinessTable.jsx
import { FiEdit, FiLock, FiUnlock, FiUsers } from "react-icons/fi"; // Import Icon Lock/Unlock

const BusinessTable = ({ businesses, onEdit, onToggleStatus, onViewUsers }) => { // Đổi onDelete thành onToggleStatus
    
    const renderStatus = (status) => {
        const styles = {
            "Active": "bg-green-100 text-green-700 border-green-200",
            "Inactive": "bg-gray-100 text-gray-600 border-gray-200",
            "Suspended": "bg-red-100 text-red-700 border-red-200"
        };
        const label = status === "Active" ? "Đang hoạt động" : status === "Suspended" ? "Đã khóa" : "Ngừng kích hoạt";
        
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles["Inactive"]}`}>
                {label}
            </span>
        );
    };

    return (
        <div className="overflow-hidden bg-white shadow-lg rounded-2xl border border-gray-100">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    {/* ... (Phần thead giữ nguyên) ... */}
                    <thead className="bg-purple-600 text-white">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Tên doanh nghiệp</th>
                            <th className="px-6 py-4 font-semibold">Mã Tenant</th>
                            <th className="px-6 py-4 font-semibold">Admin Liên hệ</th>
                            <th className="px-6 py-4 font-semibold">Gói dịch vụ</th>
                            <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                            <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {businesses.map((biz) => {
                            // Kiểm tra xem đang Active hay Suspended
                            const isActive = biz.status === "Active";

                            return (
                                <tr key={biz.id} className={`transition ${isActive ? 'hover:bg-purple-50/50' : 'bg-red-50/30 hover:bg-red-50'}`}>
                                    {/* ... (Các cột thông tin giữ nguyên) ... */}
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800 text-base">{biz.companyName}</div>
                                        <div className="text-xs text-gray-500">Ngày tạo: {new Date(biz.createdDate).toLocaleDateString('vi-VN')}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-600">{biz.tenantId}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">{biz.adminEmail}</div>
                                        <div className="text-xs text-gray-500">{biz.adminPhone || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                                            {biz.planName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {renderStatus(biz.status)}
                                    </td>
                                    
                                    {/* CỘT HÀNH ĐỘNG */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onViewUsers(biz.id)}
                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 transition"
                                                title="Xem nhân viên"
                                            >
                                                <FiUsers size={16} />
                                            </button>
                                            
                                            <button
                                                onClick={() => onEdit(biz)}
                                                className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 border border-yellow-200 transition"
                                                title="Chỉnh sửa"
                                            >
                                                <FiEdit size={16} />
                                            </button>

                                            {/* NÚT KHÓA/MỞ KHÓA */}
                                            <button
                                                onClick={() => onToggleStatus(biz.id, isActive)}
                                                className={`p-2 rounded-lg border transition ${
                                                    isActive 
                                                    ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200" 
                                                    : "bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                                }`}
                                                title={isActive ? "Khóa doanh nghiệp" : "Mở khóa doanh nghiệp"}
                                            >
                                                {isActive ? <FiLock size={16} /> : <FiUnlock size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BusinessTable;