// src/pages/ProfilePageManagement/ProfilePage.jsx

import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
// Đảm bảo bạn đã export resendVerificationEmail và uploadUserAvatar trong api.js
import { getCurrentUser, resendVerificationEmail, updateUser, uploadUserAvatar } from '../../services/api';

const ProfilePage = () => {
    const { user } = useContext(AuthContext); // Lấy user từ context (để check role nếu cần)
    const [loading, setLoading] = useState(false);
    
    // State riêng cho nút gửi lại email để tránh conflict với loading form
    const [resending, setResending] = useState(false); 
    
    // State để hiển thị status verified (cập nhật từ API mới nhất thay vì Context)
    const [isVerified, setIsVerified] = useState(true);

    const [formData, setFormData] = useState({
        id: 0,
        fullName: '',
        email: '',
        phone: '',
        position: 'Administrator',
        avatar: '',
    });

    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // 1. Hàm lấy dữ liệu từ Server (Tách ra để tái sử dụng cho nút Hủy)
    const fetchProfile = async () => {
        try {
            const userData = await getCurrentUser();
            setFormData({
                id: userData.id,
                fullName: userData.contactName || '',
                email: userData.email || '',
                phone: userData.phoneNumber || '',
                position: userData.roles?.[0] || 'User',
                avatar: userData.avatar,
            });
            // Cập nhật trạng thái xác thực từ dữ liệu mới nhất
            setIsVerified(userData.isEmailVerified); 
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải thông tin cá nhân");
        }
    };

    // 2. Load dữ liệu khi vào trang
    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewAvatar(URL.createObjectURL(file)); // Hiển thị ảnh xem trước
        }
    };

    // 3. Xử lý nút Hủy: Reset form và load lại dữ liệu cũ
    const handleCancel = () => {
        setIsEditing(false);
        setPreviewAvatar(null);
        setAvatarFile(null);
        fetchProfile(); // <--- Gọi lại API để lấy dữ liệu gốc
    };

    // 4. Xử lý nút Gửi lại Email xác thực
    const handleResendVerify = async () => {
        setResending(true);
        try {
            await resendVerificationEmail(formData.email);
            toast.success("Đã gửi lại email kích hoạt. Vui lòng kiểm tra hộp thư (cả mục Spam)!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.Message || "Không thể gửi email. Vui lòng thử lại sau.");
        } finally {
            setResending(false);
        }
    };

    // 5. Xử lý Lưu thay đổi
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let avatarFileName = formData.avatar;

            // === LOGIC XỬ LÝ ẢNH ===
            if (avatarFile) {
                const uploadResult = await uploadUserAvatar(avatarFile);
                
                // SỬA: Kiểm tra cả 2 trường hợp hoặc dùng fileName (camelCase)
                // console.log("Upload response:", uploadResult); // Bỏ comment để debug nếu cần
                avatarFileName = uploadResult.fileName || uploadResult.FileName; 
            } else {
                // B. Nếu giữ ảnh cũ:
                // Kiểm tra xem dữ liệu cũ có bị lỗi lưu full URL không (ví dụ: https://domain/avatar/abc.jpg)
                // Nếu có, cắt chuỗi chỉ lấy tên file "abc.jpg" để lưu vào DB cho sạch
                if (avatarFileName && avatarFileName.includes('/')) {
                    avatarFileName = avatarFileName.split('/').pop();
                }
            }
            // ========================

            const updatePayload = {
                Id: formData.id,
                ContactName: formData.fullName,
                Email: formData.email,
                PhoneNumber: formData.phone,
                Avatar: avatarFileName // DB chỉ lưu tên file (vd: "abc.jpg")
            };

            await updateUser(formData.id, updatePayload);
            
            // Thông báo kết quả
            if (formData.email !== user.email) {
                toast.success("Cập nhật thành công! Email đã thay đổi, vui lòng xác minh lại.", { duration: 6000 });
            } else {
                toast.success("Cập nhật thông tin thành công!");
            }

            // Reload trang để AuthContext và Sidebar cập nhật lại Avatar/Tên mới
            window.location.reload(); 
            
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.Message || "Lỗi khi cập nhật hồ sơ");
            setLoading(false); // Chỉ tắt loading khi lỗi, thành công thì reload trang rồi
        }
    };

    // Helper: Tạo đường dẫn hiển thị ảnh
    const getDisplayAvatar = () => {
        // 1. Ưu tiên ảnh xem trước khi vừa chọn file
        if (previewAvatar) return previewAvatar;
        
        // 2. Nếu có avatar từ DB
        if (formData.avatar) {
            // Nếu DB lưu tên file (chuẩn) -> Ghép với API URL
            if (!formData.avatar.startsWith('http')) {
                return `${import.meta.env.VITE_API_URL}/avatar/${formData.avatar}`;
            }
            // Nếu DB lỡ lưu full URL (dữ liệu cũ) -> Dùng luôn
            return formData.avatar;
        }
        
        // 3. Fallback mặc định
        return '/default-avatar.png'; // Đảm bảo bạn có file này trong public
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
                <h1 className="text-3xl font-semibold text-indigo-700 mb-6">Thông tin cá nhân</h1>

                {/* Avatar Section */}
                <div className="flex gap-6 items-center mb-8">
                    <div className="relative">
                        <img
                            src={getDisplayAvatar()}
                            alt="avatar"
                            className="w-32 h-32 object-cover rounded-full shadow-md border bg-gray-100"
                            onError={(e) => e.target.src = '/default-avatar.png'} // Fallback nếu ảnh lỗi
                        />
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white px-3 py-1 rounded-xl cursor-pointer text-sm hover:bg-indigo-700 transition shadow-lg">
                                Đổi ảnh
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        )}
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{formData.fullName}</h2>
                        <p className="text-gray-500 font-medium">{formData.position}</p>
                        
                        {/* Cảnh báo chưa xác minh Email & Nút gửi lại */}
                        {!isVerified && (
                             <div className="mt-3 flex flex-col items-start gap-2">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded border border-red-200">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                    Chưa xác minh Email
                                </span>
                                <button 
                                    type="button"
                                    onClick={handleResendVerify}
                                    disabled={resending}
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50 font-medium transition-colors"
                                >
                                    {resending ? "Đang gửi..." : "Gửi lại email kích hoạt"}
                                </button>
                             </div>
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <form className="space-y-6" onSubmit={handleSave}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên hiển thị</label>
                        <input
                            type="text"
                            name="fullName"
                            disabled={!isEditing}
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            disabled={!isEditing}
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 transition-all"
                        />
                        {isEditing && (
                            <p className="text-xs text-orange-600 mt-1 italic">
                                * Lưu ý: Nếu thay đổi email, bạn sẽ cần xác thực lại tài khoản mới.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            disabled={!isEditing}
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 transition-all"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition shadow-sm"
                            >
                                Chỉnh sửa hồ sơ
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2.5 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition shadow-sm"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition shadow-sm flex items-center gap-2"
                                >
                                    {loading && (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
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