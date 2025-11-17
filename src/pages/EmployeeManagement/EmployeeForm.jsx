import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ employee, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        position: 'Nhân viên',
        isLocked: false,
    });

    useEffect(() => {
        if (employee) setFormData(employee);
    }, [employee]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl text-indigo-600 mb-6">
                    {employee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Họ tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                        <input
                            name="fullName"
                            type="text"
                            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input
                            name="phone"
                            type="text"
                            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Chức vụ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Chức vụ</label>
                        <select
                            name="position"
                            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={formData.position}
                            onChange={handleChange}
                        >
                            <option>Nhân viên</option>
                            <option>Quản lý</option>
                            <option>Trưởng phòng</option>
                        </select>
                    </div>

                    {/* Trạng thái khóa */}
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="isLocked"
                            checked={formData.isLocked}
                            onChange={handleChange}
                        />
                        <label className="text-sm text-gray-700">Khóa tài khoản</label>
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

export default EmployeeForm;
