import React from 'react';

const UserTable = ({ users, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
            <table className="min-w-full table-auto text-sm text-left text-gray-700">
                <thead className="bg-indigo-600 text-white">
                    <tr>
                        <th className="px-6 py-4">Họ tên</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Vai trò</th>
                        <th className="px-6 py-4 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4 text-center space-x-2">
                                <button
                                    onClick={() => onEdit(user)}
                                    className="px-4 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => onDelete(user.id)}
                                    className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
