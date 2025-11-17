// src/layouts/SuperAdminLayout.jsx
import { useContext } from "react";
import toast from "react-hot-toast";
import { FiGlobe, FiHome, FiSettings, FiShield, FiUsers } from "react-icons/fi";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SuperAdminLayout = () => {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        toast.success("Đăng xuất thành công!");
    };

    const menuItems = [
        { name: "Tổng quan", path: "/superadmin", icon: <FiHome className="text-lg" /> },
        { name: "Quản lý Tenant", path: "/superadmin/tenants", icon: <FiGlobe className="text-lg" /> },
        { name: "Quản lý người dùng", path: "/superadmin/users", icon: <FiUsers className="text-lg" /> },
        { name: "Quản lý vai trò", path: "/superadmin/roles", icon: <FiShield className="text-lg" /> },
        { name: "Cấu hình hệ thống", path: "/superadmin/settings", icon: <FiSettings className="text-lg" /> },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-800">

        {/* SIDEBAR (thu nhỏ giống AdminLayout) */}
        <aside className="w-64 bg-white shadow-lg border-r flex flex-col">
            <div className="p-5 text-2xl font-bold text-purple-700 border-b">
            SuperAdmin
            </div>

            <nav className="flex-1 p-3 mt-2 space-y-1">
            {menuItems.map((item) => {
                const active = location.pathname.startsWith(item.path);

                return (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                    ${active
                        ? "bg-purple-600 text-white shadow"
                        : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    }
                    `}
                >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                </Link>
                );
            })}
            </nav>

            <div className="p-4 border-t text-xs text-gray-500">
            © 2025 — SuperAdmin System
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col">

            {/* HEADER gọn lại như AdminLayout */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-purple-700">Bảng điều khiển SuperAdmin</h1>

            <div className="flex items-center space-x-3">
                <span className="font-medium">{user?.email}</span>
                <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="rounded-full w-10 h-10"
                />
                <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                Đăng xuất
                </button>
            </div>
            </header>

            <main className="flex-1 p-6 bg-gray-50">
            <Outlet />
            </main>
        </div>
        </div>
    );
};

export default SuperAdminLayout;
