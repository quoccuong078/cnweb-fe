import React from 'react';
import PropTypes from 'prop-types';
import { FiEdit3, FiLock, FiUnlock } from 'react-icons/fi';

const EmployeeTable = ({ employees, loading, onEdit, onToggleLock }) => {

    const getRoleBadge = (role) => {
        switch (role) {
            case "Admin": 
                return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">Trưởng phòng</span>;
            case "Editor": 
                return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200">Quản lý</span>;
            default: 
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200">Nhân viên</span>;
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center text-gray-500">
                Đang tải dữ liệu...
            </div>
        );
    }

    if (employees.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center text-gray-500">
                Chưa có nhân viên nào. Hãy thêm mới!
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="px-6 py-4 font-semibold tracking-wider">Họ tên / Email</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">Số điện thoại</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">Chức vụ</th>
                            <th className="px-6 py-4 font-semibold tracking-wider text-center">Trạng thái</th>
                            <th className="px-6 py-4 font-semibold tracking-wider text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-indigo-50/50 transition duration-150">
                                {/* Cột Họ tên + Email */}
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 text-base">{emp.fullName}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{emp.email}</div>
                                </td>

                                {/* Cột SĐT */}
                                <td className="px-6 py-4 font-medium text-gray-600">
                                    {emp.phoneNumber || <span className="text-gray-400 italic">Chưa cập nhật</span>}
                                </td>

                                {/* Cột Chức vụ */}
                                <td className="px-6 py-4">
                                    {getRoleBadge(emp.role)}
                                </td>

                                {/* Cột Trạng thá */}
                                <td className="px-6 py-4 text-center">
                                    {emp.isActive ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <span className="w-1.5 h-1.5 mr-1.5 bg-green-600 rounded-full"></span>
                                            Hoạt động
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            <span className="w-1.5 h-1.5 mr-1.5 bg-red-600 rounded-full"></span>
                                            Bị khóa
                                        </span>
                                    )}
                                </td>

                                {/* Cột Hành động */}
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => onEdit(emp)}
                                        className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition shadow-sm border border-yellow-200"
                                        title="Chỉnh sửa"
                                    >
                                        <FiEdit3 size={16} />
                                    </button>

                                    <button
                                        onClick={() => onToggleLock(emp.id, emp.isActive)}
                                        className={`p-2 rounded-lg transition shadow-sm border ${
                                            emp.isActive
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200'
                                                : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200'
                                        }`}
                                        title={emp.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                                    >
                                        {emp.isActive ? <FiLock size={16} /> : <FiUnlock size={16} />}
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

EmployeeTable.propTypes = {
    employees: PropTypes.array,
    loading: PropTypes.bool,
    onEdit: PropTypes.func,
    onToggleLock: PropTypes.func
};

export default EmployeeTable;