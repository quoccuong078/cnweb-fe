// src/pages/BusinessManagement/BusinessManagement.jsx
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUsers, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Swal from 'sweetalert2'; // Import SweetAlert2
import BusinessForm from './BusinessForm';
import BusinessTable from './BusinessTable';
// Import service mới
import {
    getAllTenants,
    getTenantUsers,
    toggleTenantStatus,
    updateTenant
} from '../../services/businessService';

const BusinessManagement = () => {
    // --- STATES ---
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination States (Mới thêm)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Edit Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBusiness, setEditingBusiness] = useState(null);

    // User List Modal States
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [selectedTenantUsers, setSelectedTenantUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // --- FETCH DATA ---
    const fetchBusinesses = async () => {
        try {
            setLoading(true);
            const data = await getAllTenants();
            setBusinesses(data);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi tải danh sách doanh nghiệp");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    // --- PAGINATION LOGIC ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBusinesses = businesses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(businesses.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // --- HANDLERS ---

    // 1. Mở form chỉnh sửa
    const handleEdit = (biz) => {
        setEditingBusiness(biz);
        setIsModalOpen(true);
    };

    // 2. Lưu form chỉnh sửa
    const handleSave = async (formData) => {
        try {
            await updateTenant(formData.id, {
                companyName: formData.companyName,
                status: formData.status
            });
            toast.success("Cập nhật thành công!");
            setIsModalOpen(false);
            fetchBusinesses();
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi lưu.");
        }
    };

    // 3. Xử lý Khóa/Mở khóa
    const handleToggleStatus = async (id, isCurrentlyActive) => {
        const action = isCurrentlyActive ? "KHÓA" : "MỞ KHÓA";
        const confirmText = isCurrentlyActive 
            ? "Hành động này sẽ khóa quyền truy cập của doanh nghiệp và TẤT CẢ nhân viên thuộc doanh nghiệp này." 
            : "Hành động này sẽ kích hoạt lại quyền truy cập cho doanh nghiệp và nhân viên.";

        // Hiển thị Confirm Dialog đẹp
        const result = await Swal.fire({
            title: `Bạn muốn ${action} doanh nghiệp này?`,
            text: confirmText,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isCurrentlyActive ? '#d33' : '#10b981',
            cancelButtonColor: '#3085d6',
            confirmButtonText: isCurrentlyActive ? 'Vâng, Khóa ngay!' : 'Vâng, Mở khóa!',
            cancelButtonText: 'Hủy bỏ',
            background: '#fff',
            customClass: {
                popup: 'rounded-2xl shadow-xl',
                title: 'text-gray-800 font-bold',
                confirmButton: 'px-4 py-2 rounded-lg',
                cancelButton: 'px-4 py-2 rounded-lg'
            }
        });

        if (result.isConfirmed) {
            try {
                await toggleTenantStatus(id, isCurrentlyActive);
                
                Swal.fire({
                    title: 'Thành công!',
                    text: `Doanh nghiệp đã được ${isCurrentlyActive ? 'khóa' : 'mở khóa'}.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                // Cập nhật UI ngay lập tức
                setBusinesses(prev => prev.map(b => {
                    if (b.id === id) {
                        return { 
                            ...b, 
                            status: isCurrentlyActive ? "Suspended" : "Active" 
                        };
                    }
                    return b;
                }));

            } catch (error) {
                console.error(error);
                Swal.fire('Lỗi!', 'Không thể cập nhật trạng thái doanh nghiệp.', 'error');
            }
        }
    };

    // 4. Xem danh sách nhân viên của Tenant
    const handleViewUsers = async (tenantId) => {
        setUserModalOpen(true);
        setLoadingUsers(true);
        setSelectedTenantUsers([]);
        try {
            const users = await getTenantUsers(tenantId);
            setSelectedTenantUsers(users);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi tải danh sách nhân viên");
        } finally {
            setLoadingUsers(false);
        }
    };

    return (
        <div className="pt-6 min-h-screen bg-gray-50 px-4 font-sans pb-10">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-purple-800">Quản lý Doanh nghiệp</h1>
                        <p className="text-gray-500 text-sm mt-1">Danh sách các Tenant đã đăng ký trên hệ thống</p>
                    </div>
                </div>

                {/* MAIN TABLE */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Truyền danh sách đã phân trang vào bảng */}
                        <BusinessTable
                            businesses={currentBusinesses} 
                            onEdit={handleEdit}
                            onToggleStatus={handleToggleStatus}
                            onViewUsers={handleViewUsers}
                        />

                        {/* --- PAGINATION BAR --- */}
                        {businesses.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                                <span className="text-sm text-gray-500">
                                    Hiển thị <span className="font-medium text-gray-900">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, businesses.length)}</span> trong tổng số <span className="font-medium text-gray-900">{businesses.length}</span> doanh nghiệp
                                </span>
                                
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-lg border ${
                                            currentPage === 1 
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" 
                                            : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300"
                                        }`}
                                    >
                                        <FiChevronLeft className="w-4 h-4" />
                                    </button>

                                    {/* Số trang */}
                                    {[...Array(totalPages)].map((_, idx) => {
                                        const pageNum = idx + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === pageNum
                                                        ? "bg-purple-600 text-white border border-purple-600"
                                                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-lg border ${
                                            currentPage === totalPages 
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" 
                                            : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300"
                                        }`}
                                    >
                                        <FiChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL: EDIT BUSINESS FORM */}
            {isModalOpen && (
                <BusinessForm
                    business={editingBusiness}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {/* MODAL: USER LIST */}
            {userModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm p-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-3xl shadow-2xl animate-fade-in flex flex-col max-h-[85vh]">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4 border-b pb-3 flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FiUsers className="text-purple-600"/> Danh sách nhân viên
                            </h2>
                            <button 
                                onClick={() => setUserModalOpen(false)} 
                                className="text-gray-400 hover:text-red-500 transition bg-gray-100 hover:bg-red-50 p-2 rounded-full"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Modal Body (Scrollable) */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {loadingUsers ? (
                                <div className="text-center py-10">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                    <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
                                </div>
                            ) : selectedTenantUsers.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <FiUsers className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                                    <p className="text-gray-500">Doanh nghiệp này chưa có nhân viên nào.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-100 text-gray-700 font-semibold sticky top-0 z-10">
                                        <tr>
                                            <th className="p-3 rounded-tl-lg">Họ tên</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">SĐT</th>
                                            <th className="p-3">Vai trò</th>
                                            <th className="p-3 rounded-tr-lg text-center">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedTenantUsers.map(user => (
                                            <tr key={user.id} className="hover:bg-purple-50 transition-colors">
                                                <td className="p-3 font-bold text-gray-800">{user.fullName}</td>
                                                <td className="p-3">{user.email}</td>
                                                <td className="p-3 text-gray-500">{user.phoneNumber || "N/A"}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                                        user.role === 'Admin' 
                                                            ? 'bg-purple-100 text-purple-700 border-purple-200' 
                                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    {user.isActive ? (
                                                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold border border-green-100">
                                                            Hoạt động
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-bold border border-red-100">
                                                            Đã khóa
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="mt-4 pt-3 border-t text-right flex-shrink-0">
                            <button 
                                onClick={() => setUserModalOpen(false)} 
                                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessManagement;