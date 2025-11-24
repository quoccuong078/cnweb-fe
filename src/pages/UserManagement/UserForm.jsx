// src/pages/UserManagement/UserForm.jsx
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const UserForm = ({ user, tenants, onClose, onSave }) => {
    const isEditing = !!user;
    const [mode, setMode] = useState('existing'); 

    const [formData, setFormData] = useState({
        contactname: '',
        email: '',
        phoneNumber: '',
        roleName: 'Admin', 
        password: '',
        existingTenantId: '',
        newTenantName: '',
        newTenantSubdomain: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                contactname: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber || '',
                roleName: user.role,
                existingTenantId: user.tenantId || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            isNewTenant: mode === 'new',
            newTenantName: mode === 'new' ? formData.newTenantName : null,
            existingTenantId: mode === 'existing' ? formData.existingTenantId : null
        };
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
            {/* CONTAINER CHÍNH: Giới hạn chiều cao 90vh */}
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
                
                {/* 1. HEADER (CỐ ĐỊNH) */}
                <div className="p-5 border-b flex justify-between items-center bg-purple-50 flex-shrink-0">
                    <h3 className="text-xl font-bold text-purple-800">
                        {isEditing ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition bg-white rounded-full p-1 hover:bg-red-50">
                        <X size={20} />
                    </button>
                </div>

                {/* FORM BAO BỌC PHẦN NỘI DUNG VÀ FOOTER */}
                {/* flex-1 để chiếm hết chiều cao còn lại, min-h-0 để scroll hoạt động đúng trong flex item */}
                <form className="flex flex-col flex-1 min-h-0" onSubmit={handleSubmit}>
                    
                    {/* 2. BODY (CUỘN ĐƯỢC) */}
                    <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                        
                        {/* TAB SELECTION */}
                        {!isEditing && (
                            <div className="flex p-1 bg-gray-100 rounded-lg mb-4 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setMode('existing')}
                                    className={`flex-1 py-2 text-sm font-bold rounded-md transition ${mode === 'existing' ? 'bg-white text-purple-700 shadow' : 'text-gray-500'}`}
                                >
                                    Chọn Doanh nghiệp
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('new')}
                                    className={`flex-1 py-2 text-sm font-bold rounded-md transition ${mode === 'new' ? 'bg-white text-purple-700 shadow' : 'text-gray-500'}`}
                                >
                                    Tạo Doanh nghiệp mới
                                </button>
                            </div>
                        )}

                        {/* --- User Info --- */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên <span className="text-red-500">*</span></label>
                                <input name="contactname" value={formData.contactname} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">SĐT</label>
                                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isEditing} className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none ${isEditing ? 'bg-gray-100' : 'focus:ring-2 focus:ring-purple-500'}`} />
                        </div>

                        {!isEditing && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Mặc định: password123" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Vai trò</label>
                            <select name="roleName" value={formData.roleName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 bg-white">
                                <option value="Admin">Admin (Quản trị doanh nghiệp)</option>
                                <option value="Editor">Editor (Biên tập viên)</option>
                                <option value="Viewer">Viewer (Nhân viên xem)</option>
                            </select>
                        </div>

                        <hr className="border-gray-200 my-2" />

                        {/* --- Tenant Info --- */}
                        {mode === 'existing' && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Chọn Doanh nghiệp <span className="text-red-500">*</span></label>
                                <select 
                                    name="existingTenantId" 
                                    value={formData.existingTenantId} 
                                    onChange={handleChange} 
                                    required={mode === 'existing'}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 bg-white"
                                >
                                    <option value="">-- Chọn doanh nghiệp --</option>
                                    {tenants.map(t => (
                                        <option key={t.id} value={t.id}>{t.companyName} (ID: {t.tenantId})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {mode === 'new' && !isEditing && (
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-3 animate-fade-in">
                                <h4 className="text-sm font-bold text-purple-800 uppercase flex items-center gap-2">
                                    🏢 Thông tin doanh nghiệp mới
                                </h4>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tên Doanh nghiệp</label>
                                    <input name="newTenantName" value={formData.newTenantName} onChange={handleChange} required={mode === 'new'} className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-purple-500" placeholder="Ví dụ: Công ty ABC" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Subdomain</label>
                                    <div className="flex items-center">
                                        <input name="newTenantSubdomain" value={formData.newTenantSubdomain} onChange={handleChange} required={mode === 'new'} className="w-full border border-purple-200 border-r-0 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500" placeholder="mybrand" />
                                        <span className="bg-gray-200 text-gray-600 px-3 py-2 rounded-r-lg text-sm border border-l-0 border-purple-200 min-w-fit">.saaswebsite.com</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. FOOTER (CỐ ĐỊNH) */}
                    <div className="flex justify-end space-x-3 p-5 border-t bg-gray-50 flex-shrink-0 rounded-b-2xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition">Hủy bỏ</button>
                        <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md font-medium transition">
                            {isEditing ? 'Lưu thay đổi' : 'Xác nhận thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;