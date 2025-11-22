import React, { useState } from 'react';
import BusinessTable from './BusinessTable';
import BusinessForm from './BusinessForm';

const BusinessManagement = () => {
    const [businesses, setBusinesses] = useState([
        { id: 1, companyName: 'Công ty TNHH ABC', taxCode: '0312345678', phone: '0901234567', address: 'Quận 1', isActive: true },
        { id: 2, companyName: 'Công ty CP XYZ', taxCode: '0309876543', phone: '0918877665', address: 'Quận 3', isActive: false }
    ]);

    // Dữ liệu user theo doanh nghiệp
    const [users, setUsers] = useState([
        { id: 1, businessId: 1, name: 'Nguyễn Văn A', email: 'a@example.com', phone: '0901111111' },
        { id: 2, businessId: 1, name: 'Trần Thị B', email: 'b@example.com', phone: '0902222222' },
        { id: 3, businessId: 2, name: 'Lê Văn C', email: 'c@example.com', phone: '0911111111' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBusiness, setEditingBusiness] = useState(null);

    const [userModalOpen, setUserModalOpen] = useState(false);
    const [selectedBusinessUsers, setSelectedBusinessUsers] = useState([]);
    const [userDetailModalOpen, setUserDetailModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Thêm mới
    const handleAdd = () => {
        setEditingBusiness(null);
        setIsModalOpen(true);
    };

    // Chỉnh sửa
    const handleEdit = (biz) => {
        setEditingBusiness(biz);
        setIsModalOpen(true);
    };

    // Lưu form
    const handleSave = (biz) => {
        if (biz.id) {
            setBusinesses(prev => prev.map(b => (b.id === biz.id ? biz : b)));
        } else {
            const newBiz = { ...biz, id: Date.now() };
            setBusinesses(prev => [newBiz, ...prev]);
        }
        setIsModalOpen(false);
    };

    // Xóa doanh nghiệp
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa doanh nghiệp này?")) {
            setBusinesses(prev => prev.filter(b => b.id !== id));
        }
    };

    // Xem user của doanh nghiệp
    const handleViewUsers = (businessId) => {
        const bizUsers = users.filter(u => u.businessId === businessId);
        setSelectedBusinessUsers(bizUsers);
        setUserModalOpen(true);
    };

    // Xem chi tiết user
    const handleViewUserDetail = (user) => {
        setSelectedUser(user);
        setUserDetailModalOpen(true);
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-50 px-4 py-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl text-indigo-700">Quản lý doanh nghiệp</h1>
                    <button
                        onClick={handleAdd}
                        className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition"
                    >
                        + Thêm doanh nghiệp
                    </button>
                </div>

                <BusinessTable
                    businesses={businesses}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewUsers={handleViewUsers} // thêm nút xem user
                />
            </div>

            {isModalOpen && (
                <BusinessForm
                    business={editingBusiness}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}

            {/* Modal danh sách user */}
            {userModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96">
                        <h2 className="text-xl font-semibold mb-4">Danh sách User</h2>
                        <ul>
                            {selectedBusinessUsers.map(user => (
                                <li key={user.id} className="mb-2 flex justify-between items-center">
                                    {user.name}
                                    <button
                                        onClick={() => handleViewUserDetail(user)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Xem chi tiết
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setUserModalOpen(false)} className="mt-4 px-4 py-2 bg-gray-300 rounded">Đóng</button>
                    </div>
                </div>
            )}

            {/* Modal chi tiết user */}
            {userDetailModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96">
                        <h2 className="text-xl font-semibold mb-4">Chi tiết User</h2>
                        <p><strong>Tên:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Điện thoại:</strong> {selectedUser.phone}</p>
                        <button onClick={() => setUserDetailModalOpen(false)} className="mt-4 px-4 py-2 bg-gray-300 rounded">Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessManagement;
