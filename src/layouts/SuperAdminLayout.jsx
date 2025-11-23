// src/layouts/SuperAdminLayout.jsx
import { useContext } from "react";
import toast from "react-hot-toast";
import { 
  FiGlobe, 
  FiHome, 
  FiLayers, 
  FiShield, 
  FiUsers, 
  FiZap,
  FiLayout,      // ← THAY FiMonitor
  FiBarChart2    // ← THAY FiBarChart3
} from "react-icons/fi";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SuperAdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const handleLogout = () => {
        logout();
        toast.success("Đăng xuất thành công!");
    };

    const avatarUrl = user?.avatar || `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;

    const roleConfig = {
        SuperAdmin: {
            color: "bg-purple-100 text-purple-700 border border-purple-300",
            icon: <FiZap className="text-lg" />,
            label: "Super Admin"
        },
    };

    const currentRole = "SuperAdmin";
    const config = roleConfig[currentRole];

    // Hàm active chuẩn
    const isActive = (path) => {
      if (path === "/superadmin") return location.pathname === "/superadmin" || location.pathname === "/superadmin/";
      return location.pathname.startsWith(path);
    };

    const menuItems = [
        { name: "Tổng quan", path: "/superadmin", icon: <FiHome className="text-lg" /> },
        { name: "Quản lý doanh nghiệp", path: "/superadmin/business", icon: <FiGlobe className="text-lg" /> },
        { name: "Quản lý Landing Page", path: "/superadmin/landings", icon: <FiLayout className="text-lg" /> },     // ĐÃ SỬA
        { name: "Thống kê doanh nghiệp", path: "/superadmin/statistics", icon: <FiBarChart2 className="text-lg" /> }, // ĐÃ SỬA
        { name: "Quản lý người dùng", path: "/superadmin/users", icon: <FiUsers className="text-lg" /> },
        { name: "Thông tin cá nhân", path: "/superadmin/profile", icon: <FiShield className="text-lg" /> },
        { name: "Đổi mật khẩu", path: "/superadmin/change-password", icon: <FiShield className="text-base" /> },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-800">
            {/* SIDEBAR */}
            <aside className="w-70 bg-white shadow-lg border-r flex flex-col">
                <div className="p-5 text-2xl font-bold text-purple-700 border-b flex items-center gap-2">
                    <FiLayers /> FECN SaaS
                </div>

                <div className="px-5 py-6 border-b">
                    <div className="flex items-center space-x-4">
                        <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-4 border-purple-600 shadow-lg" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 truncate">{user?.contactName || user?.email}</p>
                            <div className={`inline-flex items-center gap-2 mt-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${config.color}`}>
                                {config.icon} {config.label}
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-3 mt-2 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                isActive(item.path)
                                    ? "bg-purple-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t text-xs text-gray-500">
                    © 2025 — SuperAdmin System
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-purple-700">Bảng điều khiển SuperAdmin</h1>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="font-medium text-gray-800">{user?.email}</p>
                            <p className="text-xs text-purple-600 font-medium">Super Administrator</p>
                        </div>
                        <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-purple-300" />
                        <button onClick={handleLogout} className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition font-medium">
                            Đăng xuất
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;