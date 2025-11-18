// src/layouts/SuperAdminLayout.jsx
import { useContext } from "react";
import toast from "react-hot-toast";
import { FiGlobe, FiHome, FiShield, FiUsers } from "react-icons/fi";
import { Link, Outlet, useLocation } from "react-router-dom"; // thêm useLocation
import { AuthContext } from "../context/AuthContext";

const SuperAdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
  };

  // Avatar fallback an toàn
  const avatarUrl = user?.avatar || `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;

  const menuItems = [
    { name: "Tổng quan", path: "/superadmin", icon: <FiHome className="text-lg" /> },
    { name: "Quản lý Tenant", path: "/superadmin/tenants", icon: <FiGlobe className="text-lg" /> },
    { name: "Quản lý người dùng", path: "/superadmin/users", icon: <FiUsers className="text-lg" /> },
    { name: "Quản lý vai trò", path: "/superadmin/roles", icon: <FiShield className="text-lg" /> },
    { name: "Thông tin cá nhân", path: "/superadmin/profile", icon: <FiShield className="text-lg" /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg border-r flex flex-col">
        {/* Logo */}
        <div className="p-5 text-2xl font-bold text-purple-700 border-b">
          SuperAdmin
        </div>

        {/* Avatar + Info ở đầu sidebar */}
        <div className="px-5 py-6 border-b">
          <div className="flex items-center space-x-3">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-600 shadow-md"
              onError={(e) => {
                e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;
              }}
            />
            <div>
              <p className="font-semibold text-gray-800 truncate">{user?.email}</p>
              <p className="text-xs text-purple-600 font-medium">
                {user?.roles?.includes("SuperAdmin") ? "Super Administrator" : "Administrator"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
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
                  }`}
              >
                <span>{item.icon}</span>
                {item.name}
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
              <p className="text-xs text-gray-500">Super Administrator</p>
            </div>

            {/* Avatar trong header */}
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