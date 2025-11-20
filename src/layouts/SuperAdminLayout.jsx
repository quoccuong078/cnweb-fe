// src/layouts/SuperAdminLayout.jsx
import { useContext } from "react";
import toast from "react-hot-toast";
import { FiGlobe, FiHome, FiLayers, FiShield, FiUsers, FiZap } from "react-icons/fi"; // Thêm FiZap
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SuperAdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const handleLogout = () => {
        logout();
        toast.success("Đăng xuất thành công!");
    };

    // Avatar fallback
    const avatarUrl = user?.avatar || `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;

    // Config riêng cho SuperAdmin — đẹp, có icon, bo tròn đầy đủ
    const roleConfig = {
        SuperAdmin: {
            color: "bg-purple-100 text-purple-700 border border-purple-300",
            icon: <FiZap className="text-lg" />, // Có thể thay bằng GiCrown nếu muốn "vương miện"
            label: "Super Admin"
        },
        // Nếu sau này có thêm role khác trong SuperAdmin thì thêm ở đây
    };

    const currentRole = user?.roles?.includes("SuperAdmin") ? "SuperAdmin" : "SuperAdmin"; // Luôn là SuperAdmin ở layout này
    const config = roleConfig[currentRole];

    const menuItems = [
        { name: "Tổng quan", path: "/superadmin", icon: <FiHome className="text-lg" /> },
        { name: "Quản lý Tenant", path: "/superadmin/tenants", icon: <FiGlobe className="text-lg" /> },
        { name: "Quản lý người dùng", path: "/superadmin/users", icon: <FiUsers className="text-lg" /> },
        { name: "Thông tin cá nhân", path: "/superadmin/profile", icon: <FiShield className="text-lg" /> },
        { name: "Đổi mật khẩu", path: "/superadmin/change-password", icon: <FiShield className="text-base" /> },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-800">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white shadow-lg border-r flex flex-col">
                {/* Logo */}
                <div className="p-5 text-2xl font-bold text-purple-700 border-b flex items-center gap-2">
                    <FiLayers /> FECN SaaS
                </div>

                {/* Avatar + Info với Badge đẹp */}
                <div className="px-5 py-6 border-b">
                    <div className="flex items-center space-x-4">
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full object-cover border-4 border-purple-600 shadow-lg ring-2 ring-purple-200 ring-opacity-50"
                            onError={(e) => {
                                e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;
                            }}
                        />

                        <div className="flex-1 overflow-hidden">
                            <p
                                className="font-semibold text-gray-800 truncate cursor-default"
                                title={user?.contactName || user?.email}
                            >
                                {user?.contactName || user?.email}
                            </p>

                            {/* Badge giống hệt trang Admin */}
                            <div className={`inline-flex items-center gap-2 mt-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm ${config.color}`}>
                                {config.icon}
                                {config.label}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-3 mt-2 space-y-1">
                    {menuItems.map((item) => {
                        const active = location.pathname.startsWith(item.path) || (item.path === "/superadmin" && location.pathname === "/superadmin");
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                                    ${active
                                        ? "bg-purple-600 text-white shadow-md"
                                        : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t text-xs text-gray-500">
                    © 2025 — SuperAdmin System
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">
                {/* HEADER */}
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-purple-700">
                        Bảng điều khiển SuperAdmin
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="font-medium text-gray-800">{user?.email}</p>
                            <p className="text-xs text-purple-600 font-medium">Super Administrator</p>
                        </div>
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-300"
                            onError={(e) => {
                                e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;
                            }}
                        />
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </header>

                {/* MAIN */}
                <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;