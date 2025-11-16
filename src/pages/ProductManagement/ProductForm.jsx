// src/components/ProductManagement/ProductForm.jsx
import React, { useState, useEffect } from 'react';

const ProductForm = ({ initialData = null, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        image: null,
        imagePreview: null
    });
    const [zoomImage, setZoomImage] = useState(null);

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || '',
                image: initialData.image || null,
                imagePreview: initialData.image || null
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setForm(prev => ({
                ...prev,
                image: file,
                imagePreview: previewUrl
            }));
        }
    };

    const handleRemoveImage = () => {
        if (form.imagePreview) {
            URL.revokeObjectURL(form.imagePreview);
        }
        setForm(prev => ({
            ...prev,
            image: null,
            imagePreview: null
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <>
            {/* Modal nhỏ để xem ảnh — không full màn hình */}
            {zoomImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-4 max-w-xl w-full m-4 relative">
                        <button
                            type="button"
                            onClick={() => setZoomImage(null)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                        >
                            ×
                        </button>
                        <img
                            src={zoomImage}
                            alt="Zoomed Preview"
                            className="w-full h-auto object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}

            {/* Form tạo/sửa sản phẩm */}
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-40">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 m-4 mt-20">
                    <h2 className="text-2xl text-indigo-600 mb-6">
                        {initialData ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                            <input
                                name="name"
                                type="text"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                            <textarea
                                name="description"
                                rows="3"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                value={form.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá (VNĐ)</label>
                            <input
                                name="price"
                                type="number"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                value={form.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <label
                                htmlFor="image"
                                className="px-5 py-3 bg-indigo-50 text-indigo-600 rounded-xl cursor-pointer hover:bg-indigo-100 transition"
                            >
                                Chọn ảnh
                            </label>
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            {form.imagePreview && (
                                <div className="relative">
                                    <img
                                        src={form.imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer"
                                        onClick={() => setZoomImage(form.imagePreview)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition"
                                        style={{ width: '20px', height: '20px', lineHeight: '20px', textAlign: 'center' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
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
                                Lưu sản phẩm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProductForm;
