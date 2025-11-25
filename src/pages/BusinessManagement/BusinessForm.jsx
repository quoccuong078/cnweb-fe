// src/pages/BusinessManagement/BusinessForm.jsx
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

const BusinessForm = ({ business, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        id: 0,
        companyName: '',
        status: 'Active',
    });

    useEffect(() => {
        if (business) {
            setFormData({
                id: business.id,
                companyName: business.companyName,
                status: business.status || 'Active'
            });
        }
    }, [business]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800">
                        Chỉnh sửa Doanh nghiệp
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
                        <FiX size={24} />
                    </button>
                </div>

                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tên doanh nghiệp</label>
                        <input
                            name="companyName"
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái hoạt động</label>
                        <select
                            name="status"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Active">Đang hoạt động (Active)</option>
                            <option value="Suspended">Tạm khóa (Suspended)</option>
                            <option value="Inactive">Ngừng kích hoạt (Inactive)</option>
                        </select>
                    </div>

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
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md font-medium transition"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusinessForm;