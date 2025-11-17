import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        fullName: 'Nguyễn Văn Admin',
        email: 'admin@company.com',
        phone: '0912345678',
        position: 'Quản trị hệ thống',
        avatar: null,
    });

    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }));
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        // In thực tế: call API PUT /profile
        setProfile(formData);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">

                {/* Header */}
                <h1 className="text-3xl font-semibold text-indigo-700 mb-6">
                    Thông tin cá nhân
                </h1>

                {/* Avatar + Name */}
                <div className="flex gap-6 items-center mb-8">
                    <div className="relative">
                        <img
                            src={previewAvatar || profile.avatar || '/default-avatar.png'}
                            alt="avatar"
                            className="w-32 h-32 object-cover rounded-full shadow-md border"
                        />

                        {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white px-3 py-1 rounded-xl cursor-pointer text-sm hover:bg-indigo-700 transition">
                                Đổi
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        )}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{profile.fullName}</h2>
                        <p className="text-gray-500">{profile.position}</p>
                    </div>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSave}>

                    {/* Họ tên */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Họ tên</label>
                        <input
                            type="text"
                            name="fullName"
                            disabled={!isEditing}
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            disabled={!isEditing}
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            disabled={!isEditing}
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
                        />
                    </div>

                    {/* Position */}
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Chức vụ</label>
                        <input
                            type="text"
                            name="position"
                            disabled={!isEditing}
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-4">
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                            >
                                Chỉnh sửa
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
                                >
                                    Hủy
                                </button>

                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                                >
                                    Lưu thay đổi
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
