import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';

import { 
    getEmployees, 
    createEmployee, 
    updateEmployee, 
    toggleEmployeeStatus 
} from '../../services/employeeService';

const EmployeeManagement = () => {

    const [employees, setEmployees] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await getEmployees();
            setEmployees(data || []);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            toast.error("Không thể tải danh sách nhân viên.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAdd = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const handleEdit = (emp) => {
        setEditingEmployee(emp);
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            if (editingEmployee) {
                await updateEmployee(formData.id, {
                    id: formData.id,
                    contactname: formData.contactname,
                    phoneNumber: formData.phoneNumber,
                    roleName: formData.roleName
                });
                toast.success("Cập nhật thành công!");
            } else {
                await createEmployee({
                    contactname: formData.contactname,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    roleName: formData.roleName,
                    password: formData.password || null
                });
                toast.success("Thêm nhân viên thành công!");
            }
            
            setIsModalOpen(false);
            fetchEmployees();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra.");
        }
    };

    const handleToggleLock = async (id, currentIsActive) => {
        const action = currentIsActive ? "KHÓA" : "MỞ KHÓA";
        
        const result = await Swal.fire({
            title: `Bạn muốn ${action} tài khoản?`,
            text: "Hành động này sẽ thay đổi quyền truy cập của nhân viên.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: currentIsActive ? '#d33' : '#10b981',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Vâng, thực hiện!',
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
                await toggleEmployeeStatus(id, !currentIsActive);
                
                setEmployees(prev => prev.map(e => 
                    e.id === id ? { ...e, isActive: !currentIsActive } : e
                ));

                Swal.fire({
                    title: 'Thành công!',
                    text: `Đã ${action.toLowerCase()} tài khoản nhân viên.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                
            } catch (error) {
                console.error(error);
                Swal.fire('Lỗi!', 'Không thể cập nhật trạng thái.', 'error');
            }
        }
    };

    const filteredEmployees = employees.filter(e => 
        (e.fullName && e.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.email && e.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-indigo-800">Quản lý nhân viên</h1>

                    <div className="flex gap-3 w-full md:w-auto">
                        {/* Search Bar */}
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Tìm theo tên..." 
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition font-medium"
                        >
                            <Plus size={18} /> Thêm nhân viên
                        </button>
                    </div>
                </div>

                {/* Table Component */}
                <EmployeeTable
                    employees={filteredEmployees}
                    loading={loading}
                    onEdit={handleEdit}
                    onToggleLock={handleToggleLock}
                />
            </div>

            {/* Modal Form Component */}
            {isModalOpen && (
                <EmployeeForm
                    employee={editingEmployee}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default EmployeeManagement;