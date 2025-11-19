import React, { useState } from 'react';
import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([
        {
            id: 1,
            fullName: 'Nguyễn Văn A',
            phone: '0912345678',
            position: 'Nhân viên',
            isLocked: false
        },
        {
            id: 2,
            fullName: 'Trần Thị B',
            phone: '0987654321',
            position: 'Quản lý',
            isLocked: true
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const handleAdd = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const handleEdit = (emp) => {
        setEditingEmployee(emp);
        setIsModalOpen(true);
    };

    const handleSave = (emp) => {
        if (emp.id) {
            setEmployees(prev =>
                prev.map(e => (e.id === emp.id ? emp : e))
            );
        } else {
            const newEmp = { ...emp, id: Date.now() };
            setEmployees(prev => [newEmp, ...prev]);
        }

        setIsModalOpen(false);
    };

    const handleToggleLock = (id) => {
        setEmployees(prev =>
            prev.map(e =>
                e.id === id ? { ...e, isLocked: !e.isLocked } : e
            )
        );
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-50 px-4 py-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl text-indigo-700">Quản lý nhân viên</h1>

                    <button
                        onClick={handleAdd}
                        className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition"
                    >
                        + Thêm nhân viên
                    </button>
                </div>

                <EmployeeTable
                    employees={employees}
                    onEdit={handleEdit}
                    onToggleLock={handleToggleLock}
                />
            </div>

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
