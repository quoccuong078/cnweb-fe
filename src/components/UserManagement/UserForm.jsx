import React, { useState, useEffect } from 'react';

const UserForm = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Nhân viên' });

    useEffect(() => {
        if (user) setFormData(user);
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl text-indigo-600 mb-6">
                    {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                        <input
                            name="name"
                            type="text"
                            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                        <select
                            name="role"
                            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option>Nhân viên</option>
                            <option>Admin</option>
                            <option>Quản lý</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
