// src/pages/UserManagement/UserTable.jsx
import { FiEdit3, FiLock, FiUnlock } from 'react-icons/fi';

const UserTable = ({ users, loading, onEdit, onToggleLock }) => {

    const getRoleBadge = (role) => {
        const colors = {
            "Admin": "bg-purple-100 text-purple-700 border-purple-200",
            "Editor": "bg-blue-100 text-blue-700 border-blue-200",
            "Viewer": "bg-gray-100 text-gray-700 border-gray-200",
            "SuperAdmin": "bg-red-100 text-red-700 border-red-200"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[role] || colors["Viewer"]}`}>
                {role}
            </span>
        );
    };

    if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;

    return (
        <div className="overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-purple-600 text-white">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Thông tin cá nhân</th>
                            <th className="px-6 py-4 font-semibold">Doanh nghiệp (Tenant)</th>
                            <th className="px-6 py-4 font-semibold">Vai trò</th>
                            <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                            <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-purple-50/50 transition">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900 text-base">{u.fullName}</div>
                                    <div className="text-xs text-gray-500">{u.email}</div>
                                    <div className="text-xs text-gray-400">{u.phoneNumber}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-700">{u.tenantName}</div>
                                    {u.tenantId && <span className="text-xs text-gray-400">ID: {u.tenantId}</span>}
                                </td>
                                <td className="px-6 py-4">
                                    {getRoleBadge(u.role)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {u.isActive ? (
                                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold border border-green-100">Hoạt động</span>
                                    ) : (
                                        <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-bold border border-red-100">Đã khóa</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => onEdit(u)} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 border border-yellow-200 transition">
                                        <FiEdit3 />
                                    </button>
                                    <button 
                                        onClick={() => onToggleLock(u.id, u.isActive)} 
                                        className={`p-2 rounded-lg border transition ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200'}`}
                                    >
                                        {u.isActive ? <FiLock /> : <FiUnlock />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;