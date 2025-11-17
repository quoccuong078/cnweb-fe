import React from 'react';

const EmployeeTable = ({ employees, onEdit, onToggleLock }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-indigo-600 text-white">
                    <tr>
                        <th className="px-6 py-4">Họ tên</th>
                        <th className="px-6 py-4">Số điện thoại</th>
                        <th className="px-6 py-4">Chức vụ</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-center">Hành động</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{emp.fullName}</td>
                            <td className="px-6 py-4">{emp.phone}</td>
                            <td className="px-6 py-4">{emp.position}</td>

                            {/* trạng thái */}
                            <td className="px-6 py-4 text-center">
                                <span
                                    className={`px-3 py-1 rounded-xl text-white text-xs ${emp.isLocked
                                            ? 'bg-red-500'
                                            : 'bg-green-500'
                                        }`}
                                >
                                    {emp.isLocked ? 'Bị khóa' : 'Hoạt động'}
                                </span>
                            </td>

                            <td className="px-6 py-4 text-center space-x-2">
                                <button
                                    onClick={() => onEdit(emp)}
                                    className="px-4 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                                >
                                    Sửa
                                </button>

                                <button
                                    onClick={() => onToggleLock(emp.id)}
                                    className={`px-4 py-1 text-white rounded-lg transition ${emp.isLocked
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {emp.isLocked ? 'Mở khóa' : 'Khóa'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeTable;
