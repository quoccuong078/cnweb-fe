// src/layouts/SuperAdminLayout.jsx
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
    FiBarChart2,
    FiChevronDown, FiExternalLink,
    FiGlobe, FiHome, FiLayers, FiLayout,
    FiLogOut,
    FiShield, FiUsers, FiZap
} from "react-icons/fi";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { AuthContext } from "../context/AuthContext";

const SuperAdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleLogout = () => {
        logout();
        toast.success("Đăng xuất thành công!");
        navigate("/auth");
    };

    const handleGoHome = () => {
        navigate("/superadmin"); 
    };

    const avatarUrl = user?.avatar || `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;

    const roleConfig = {
        SuperAdmin: {
            color: "bg-purple-100 text-purple-700 border border-purple-300",
            icon: <FiZap className="text-lg" />,
            label: "Super Admin"
        }
    };

    const currentRole = "SuperAdmin";
    const config = roleConfig[currentRole];

    const menuItems = [
        { name: "Tổng quan", path: "/superadmin", icon: <FiHome className="text-lg" /> },
        { name: "Quản lý Đăng ký", path: "/superadmin/subscriptions", icon: <FiGlobe className="text-lg" /> },
        { name: "Cấu hình Gói cước", path: "/superadmin/plans", icon: <FiLayers className="text-lg" /> },
        { name: "Quản lý doanh nghiệp", path: "/superadmin/business", icon: <FiGlobe className="text-lg" /> },
        { name: "Quản lý Landing Page", path: "/superadmin/landings", icon: <FiLayout className="text-lg" /> },
        { name: "Thống kê doanh nghiệp", path: "/superadmin/statistics", icon: <FiBarChart2 className="text-lg" /> },
        { name: "Quản lý người dùng", path: "/superadmin/users", icon: <FiUsers className="text-lg" /> },
        { name: "Thông tin cá nhân", path: "/superadmin/profile", icon: <FiShield className="text-lg" /> },
        { name: "Đổi mật khẩu", path: "/superadmin/change-password", icon: <FiShield className="text-base" /> },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-800">
            {/* SIDEBAR */}
            <aside className="w-70 bg-white shadow-lg border-r flex flex-col shrink-0 transition-all duration-300">
                {/* Logo */}
                <div className="p-5 text-2xl font-bold text-purple-700 border-b flex items-center gap-2">
                    <FiLayers /> FECN SaaS
                </div>

                {/* Sidebar User Info */}
                <div className="px-5 py-6 border-b bg-purple-50/50">
                    <div className="flex items-center space-x-4">
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full object-cover border-4 border-purple-600 shadow-lg ring-2 ring-purple-200"
                            onError={(e) => {
                                e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;
                            }}
                        />
                        <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-gray-800 truncate text-sm" title={user?.email}>
                                {user?.contactName || user?.email}
                            </p>
                            <div className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide shadow-sm ${config.color}`}>
                                {config.icon} {config.label}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-3 mt-2 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const active = location.pathname === item.path || (item.path !== "/superadmin" && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                                    ${active
                                        ? "bg-purple-600 text-white shadow-md translate-x-1"
                                        : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t text-xs text-center text-gray-400">
                    © 2025 — SuperAdmin System
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* HEADER */}
                <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center z-50 relative">
                    <h1 className="text-xl font-bold text-gray-800">
                        Bảng điều khiển SuperAdmin
                    </h1>

                    {/* --- USER DROPDOWN --- */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-3 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
                        >
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
                                onError={(e) => {
                                    e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;
                                }}
                            />
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-700 leading-tight">
                                    {user?.contactName || "Admin"}
                                </p>
                                <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">
                                    Super Admin
                                </p>
                            </div>
                            <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fade-in-down origin-top-right">
                                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                    <p className="text-sm font-bold text-gray-800 truncate">{user?.email}</p>
                                    <p className="text-xs text-gray-500">Đang online</p>
                                </div>

                                <button 
                                    onClick={handleGoHome}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition"
                                >
                                    <FiExternalLink size={16} /> Về trang chủ
                                </button>
                                
                                <div className="border-t border-gray-100 my-1"></div>

                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition font-medium"
                                >
                                    <FiLogOut size={16} /> Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* MAIN */}
                <main className="flex-1 p-6 bg-gray-50 overflow-y-auto custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;