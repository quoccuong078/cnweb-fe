// src/layouts/AdminLayout.jsx
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FiAlertCircle, FiBarChart2,
  FiChevronDown,
  FiCreditCard, FiEdit3,
  FiExternalLink,
  FiEye, FiHome,
  FiLayers,
  FiLogOut,
  FiSettings, FiShield, FiUsers
} from "react-icons/fi";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- DROPDOWN STATE ---
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

  // --- TOAST LOGIC ---
  const hasShownVerifyToast = useRef(false);
  useEffect(() => {
    if (user && !user.isEmailVerified && !hasShownVerifyToast.current) {
      hasShownVerifyToast.current = true; 
      toast(
        (t) => (
          <div className="flex items-start gap-4 max-w-lg">
            <FiAlertCircle className="text-4xl text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-lg text-orange-900">Email chưa được xác minh!</p>
              <p className="text-sm text-gray-700 mt-1">
                Vui lòng kiểm tra hộp thư <strong>(bao gồm mục Spam/Junk)</strong> để nhận link kích hoạt.
              </p>
            </div>
          </div>
        ),
        {
          id: "email-not-verified",
          duration: 5000,
          position: "top-center",
          style: {
            background: "#fffaeb",
            border: "2px solid #f97316",
            borderRadius: "16px",
            padding: "20px",
          },
        }
      );
    }
  }, [user?.isEmailVerified]);

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    navigate("/auth");
  };

  const handleGoHome = () => {
    navigate("/"); 
  };

  const getAvatarUrl = () => {
    if (!user?.avatar || user.avatar === "profile.jpg") {
      return `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;
    }
    if (user.avatar.startsWith("http")) return user.avatar;
    return `${import.meta.env.VITE_API_URL}/avatar/${user.avatar}`;
  };

  const avatarUrl = getAvatarUrl();
  const role = user?.roles?.[0] || "Viewer";

  const roleConfig = {
    Admin:   { color: "bg-blue-100 text-blue-700 border-blue-200",   icon: <FiShield className="text-lg" />, label: "Administrator" },
    Editor:  { color: "bg-green-100 text-green-700 border-green-200",  icon: <FiEdit3 className="text-lg" />, label: "Editor" },
    Viewer:  { color: "bg-orange-100 text-orange-700 border-orange-200", icon: <FiEye className="text-lg" />, label: "Viewer" },
  };

  const config = roleConfig[role] || roleConfig.Viewer;

  const menuItems = [
    { name: "Dashboard",           path: "/admin",                     icon: <FiHome />,       roles: ["Admin", "Editor", "Viewer"] },
    { name: "Thống kê",            path: "/admin/statistics",          icon: <FiBarChart2 />,  roles: ["Admin", "Editor", "Viewer"] },
    { name: "Gói cước & Dịch vụ",  path: "/admin/subscription",        icon: <FiCreditCard />, roles: ["Admin"] },
    { name: "Quản lý Landing",     path: "/admin/landing-management",  icon: <FiLayers />,     roles: ["Admin", "Editor", "Viewer"] },
    { name: "Quản lý nhân viên",   path: "/admin/employees",           icon: <FiUsers />,      roles: ["Admin"] },
    { name: "Cấu hình",            path: "/admin/settings",            icon: <FiSettings />,   roles: ["Admin"] },
    { name: "Thông tin cá nhân",   path: "/admin/profile",             icon: <FiShield />,     roles: ["Admin", "Editor", "Viewer"] },
    { name: "Đổi mật khẩu",        path: "/admin/change-password",     icon: <FiShield />,     roles: ["Admin", "Editor", "Viewer"] },
  ];

  const visibleMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg border-r flex flex-col z-30">
        <div className="p-5 text-2xl font-bold text-blue-700 border-b flex items-center gap-2">
          <FiLayers /> FECN SaaS
        </div>

        {/* User Profile Widget ở Sidebar*/}
        <div className="px-5 py-6 border-b bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-blue-100"
              onError={(e) => e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`}
            />
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-gray-800 truncate text-sm" title={user?.contactName || user?.email}>
                {user?.contactName || user?.email}
              </p>
              <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${config.color}`}>
                {config.icon} {role}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {visibleMenu.map(item => {
            const active = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${active 
                    ? "bg-blue-600 text-white shadow-md translate-x-1" 
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t text-center text-xs text-gray-400">
          © 2025 FECN SaaS Tenant
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER */}
        <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center z-50 relative">
          <h1 className="text-xl font-bold text-gray-800">
            {user?.tenantName || "Bảng điều khiển Tenant"}
          </h1>

          {/* --- USER DROPDOWN MENU --- */}
          <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition border border-transparent hover:border-gray-200 focus:outline-none"
            >
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
                    onError={(e) => e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`}
                />
                <div className="text-right hidden md:block leading-tight">
                    <p className="text-sm font-bold text-gray-700">
                        {user?.contactName || "User"}
                    </p>
                    <p className={`text-[10px] font-bold uppercase ${
                        role === 'Admin' ? 'text-blue-600' : role === 'Editor' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                        {config.label}
                    </p>
                </div>
                <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu xổ xuống */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fade-in-down origin-top-right z-50">
                    {/* Header dropdown */}
                    <div className="px-4 py-3 border-b border-gray-50 mb-1 bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-800 truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Tenant ID: {user?.tenantId}</p>
                        {user?.planName && (
                            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold uppercase">
                                <FiCreditCard /> {user.planName}
                            </span>
                        )}
                    </div>

                    {/* Các mục menu */}
                    <button 
                        onClick={handleGoHome}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition"
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

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto custom-scrollbar">
          {!user?.isEmailVerified && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl shadow-sm flex items-start gap-4 animate-pulse-slow">
              <FiAlertCircle className="text-3xl text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-orange-900">Tài khoản chưa xác minh</h3>
                <p className="text-orange-800 text-sm mt-1">
                  Vui lòng kiểm tra email để kích hoạt tài khoản và sử dụng đầy đủ tính năng.
                </p>
              </div>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;