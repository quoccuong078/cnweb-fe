// src/pages/UserManagement/UserManagement.jsx
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'; // Thêm icon điều hướng
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

import UserForm from './UserForm';
import UserTable from './UserTable';

import { createUser, getAllUsers, getTenantsForSelect, toggleUserStatus } from '../../services/superAdminUserService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Số lượng user mỗi trang

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, tenantsData] = await Promise.all([
                getAllUsers(),
                getTenantsForSelect()
            ]);
            setUsers(usersData || []);
            setTenants(tenantsData || []);
        } catch (error) {
            toast.error("Lỗi tải dữ liệu hệ thống.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Reset về trang 1 khi search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // --- CRUD Handlers ---
    const handleAdd = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            if (editingUser) {
                toast.success("Tính năng cập nhật đang phát triển");
            } else {
                await createUser(formData);
                toast.success("Thêm người dùng thành công!");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.Message || "Có lỗi xảy ra.");
        }
    };

    const handleToggleLock = async (id, currentIsActive) => {
        const action = currentIsActive ? "KHÓA" : "MỞ KHÓA";
        const result = await Swal.fire({
            title: `Bạn muốn ${action} tài khoản này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: currentIsActive ? '#d33' : '#10b981',
            confirmButtonText: 'Thực hiện',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await toggleUserStatus(id, currentIsActive);
                setUsers(prev => prev.map(u => 
                    u.id === id ? { ...u, isActive: !currentIsActive } : u
                ));
                Swal.fire('Thành công!', `Đã ${action.toLowerCase()} tài khoản.`, 'success');
            } catch (error) {
                toast.error("Lỗi cập nhật trạng thái.");
            }
        }
    };

    // --- LOGIC PHÂN TRANG & SEARCH ---
    const filteredUsers = users.filter(u => 
        (u.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-purple-800">Quản lý Người dùng hệ thống</h1>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Tìm tên, email, công ty..." 
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-md transition font-medium whitespace-nowrap"
                        >
                            <Plus size={18} /> Thêm mới
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <UserTable
                    users={currentUsers} // Chỉ truyền user của trang hiện tại
                    loading={loading}
                    onEdit={handleEdit}
                    onToggleLock={handleToggleLock}
                />

                {/* PAGINATION CONTROLS */}
                {!loading && filteredUsers.length > 0 && (
                    <div className="flex justify-between items-center mt-6 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-sm text-gray-500 pl-2">
                            Hiển thị <strong>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)}</strong> trong tổng số <strong>{filteredUsers.length}</strong> người dùng
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => paginate(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            
                            {/* Render Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
                                        currentPage === i + 1 
                                            ? 'bg-purple-600 text-white shadow-md' 
                                            : 'bg-white text-gray-600 hover:bg-purple-50 border'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => paginate(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <UserForm
                    user={editingUser}
                    tenants={tenants} 
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default UserManagement;