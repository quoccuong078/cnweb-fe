import React, { useState, useEffect } from 'react';

const BusinessForm = ({ business, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        taxCode: '',
        address: '',
        phone: '',
        isActive: true,
    });

    // Reset form khi không có dữ liệu sửa
    useEffect(() => {
        if (business) {
            setFormData(business);
        } else {
            setFormData({
                companyName: '',
                taxCode: '',
                address: '',
                phone: '',
                isActive: true,
            });
        }
    }, [business]);

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
                    {business ? 'Chỉnh sửa doanh nghiệp' : 'Thêm doanh nghiệp mới'}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    <div>
                        <label className="block text-sm text-gray-700">Tên doanh nghiệp</label>
                        <input
                            name="companyName"
                            type="text"
                            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-xl"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700">Mã số thuế</label>
                        <input
                            name="taxCode"
                            type="text"
                            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-xl"
                            value={formData.taxCode}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700">Địa chỉ</label>
                        <input
                            name="address"
                            type="text"
                            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-xl"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700">Số điện thoại</label>
                        <input
                            name="phone"
                            type="text"
                            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-xl"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        <label className="text-sm text-gray-700">Đang hoạt động</label>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 bg-gray-200 rounded-xl hover:bg-gray-300"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                        >
                            Lưu
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default BusinessForm;
