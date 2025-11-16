import React, { useState, useEffect } from 'react';
import UserTable from './UserTable';
import UserForm from './UserForm';

const UserManagement = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', role: 'Admin' },
        { id: 2, name: 'Trần Thị B', email: 'b@example.com', role: 'Nhân viên' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const handleAdd = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    const handleSave = (user) => {
        if (user.id) {
            setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
        } else {
            const newUser = { ...user, id: Date.now() };
            setUsers(prev => [newUser, ...prev]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-50 px-4 py-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl text-indigo-700">Quản lý người dùng</h1>
                    <button
                        onClick={handleAdd}
                        className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition"
                    >
                        + Thêm người dùng
                    </button>
                </div>
                <UserTable
                    users={users}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
            {isModalOpen && (
                <UserForm
                    user={editingUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default UserManagement;
