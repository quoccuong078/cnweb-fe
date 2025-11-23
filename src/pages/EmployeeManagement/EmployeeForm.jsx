import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const EmployeeForm = ({ employee, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        id: 0,
        contactname: '',
        phoneNumber: '',
        email: '',
        password: '',
        roleName: 'Viewer',
    });

    const isEditing = !!employee;

    useEffect(() => {
        if (employee) {
            setFormData({
                id: employee.id,
                contactname: employee.fullName,
                phoneNumber: employee.phoneNumber || '',
                email: employee.email,
                password: '',
                roleName: employee.role
            });
        }
    }, [employee]);

    EmployeeForm.propTypes = {
    employee: PropTypes.shape({
        id: PropTypes.number,
        fullName: PropTypes.string,
        phoneNumber: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string
    }),
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-indigo-800">
                        {isEditing ? 'Cập nhật thông tin' : 'Thêm nhân viên mới'}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-red-500 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    {/* Họ tên */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên <span className="text-red-500">*</span></label>
                        <input
                            name="contactname"
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            value={formData.contactname}
                            onChange={handleChange}
                            required
                            placeholder="Nguyễn Văn A"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email đăng nhập <span className="text-red-500">*</span></label>
                        <input
                            name="email"
                            type="email"
                            className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none transition ${isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-indigo-500'}`}
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isEditing}
                            placeholder="email@example.com"
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                        <input
                            name="phoneNumber"
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="0912..."
                        />
                    </div>

                    {/* Chức vụ */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Chức vụ</label>
                        <select
                            name="roleName"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                            value={formData.roleName}
                            onChange={handleChange}
                        >
                            <option value="Viewer">Nhân viên</option>
                            <option value="Editor">Quản lý</option>
                            <option value="Admin">Trưởng phòng</option>
                        </select>
                    </div>

                    {/* Mật khẩu */}
                    {!isEditing && (
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-2">
                            <label className="block text-sm font-semibold text-indigo-800 mb-1">Mật khẩu khởi tạo</label>
                            <input
                                name="password"
                                type="text"
                                className="w-full border border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Để trống sẽ dùng mặc định: password123"
                            />
                            <p className="text-xs text-indigo-600 mt-1 italic">
                                * Mật khẩu này dùng để đăng nhập lần đầu.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-medium transition"
                        >
                            {isEditing ? 'Lưu thay đổi' : 'Thêm nhân viên'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;