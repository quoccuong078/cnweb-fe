// src/layouts/AdminLayout.jsx
import { useContext } from "react";
import toast from "react-hot-toast";
import { FiBarChart2, FiBox, FiEdit3, FiEye, FiHome, FiLayers, FiShield, FiUsers } from "react-icons/fi";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Logout đã được sửa ở AuthContext → chỉ cần gọi
  const handleLogout = () => {
    logout(); // → tự động về /auth
    toast.success("Đăng xuất thành công!");
  };

  // Avatar sửa lỗi undefined
  const getAvatarUrl = () => {
    if (!user?.avatar || user.avatar === "profile.jpg") {
      return `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;
    }
    if (user.avatar.startsWith("http")) return user.avatar;
    return `${import.meta.env.VITE_API_URL}/avatars/${user.avatar}`;
  };

  const avatarUrl = getAvatarUrl();

  // Chỉ lấy role trong tenant: Admin, Editor, Viewer
  const role = user?.roles?.[0] || "Viewer";

  // Không có SuperAdmin ở đây nữa
  const roleConfig = {
    Admin:  { color: "bg-blue-100 text-blue-700",     icon: <FiShield className="text-lg" /> },
    Editor: { color: "bg-green-100 text-green-700",   icon: <FiEdit3 className="text-lg" /> },
    Viewer: { color: "bg-orange-100 text-orange-700", icon: <FiEye className="text-lg" /> },
  };

  const config = roleConfig[role] || roleConfig.Viewer;

  // Menu chỉ dành cho tenant
  const menuItems = [
    { name: "Dashboard",           path: "/admin",                     icon: <FiHome />,       roles: ["Admin", "Editor", "Viewer"] },
    { name: "Thống kê",            path: "/admin/statistics",          icon: <FiBarChart2 />,  roles: ["Admin", "Editor", "Viewer"] },
    { name: "Quản lý Landing",     path: "/admin/landing-management",  icon: <FiLayers />,     roles: ["Admin", "Editor"] },
    { name: "Quản lý sản phẩm",    path: "/admin/products",            icon: <FiBox />,        roles: ["Admin", "Editor"] },
    { name: "Quản lý nhân viên",   path: "/admin/employees",           icon: <FiUsers />,      roles: ["Admin"] },
    { name: "Thông tin cá nhân",   path: "/admin/profile",             icon: <FiShield />,     roles: ["Admin", "Editor", "Viewer"] },
    { name: "Đổi mật khẩu",        path: "/admin/change-password",     icon: <FiShield />,     roles: ["Admin", "Editor", "Viewer"] },
  ];

  const visibleMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg border-r flex flex-col">
        <div className="p-5 text-2xl font-bold text-blue-700 border-b flex items-center gap-2">
          <FiLayers /> FECN SaaS
        </div>

        <div className="px-5 py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-xl"
              onError={(e) => e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`}
            />
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-gray-800 truncate">{user?.email}</p>
              <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full text-xs font-bold ${config.color}`}>
                {config.icon} {role}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {visibleMenu.map(item => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${active ? "bg-blue-600 text-white shadow-lg" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t text-center text-xs text-gray-500">
          © 2025 FECN SaaS — Phiên bản 1.0
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          
          {/* Tiêu đề: Tên công ty */}
          <h1 className="text-xl font-semibold text-blue-600">
            {user?.tenantName || "Tên công ty"}
          </h1>

          <div className="flex items-center space-x-4">
            
            {/* Email + Role – Sửa đúng 100% */}
            <div className="text-right">
              <p className="font-medium text-gray-800 truncate max-w-[200px]">
                {user?.email}
              </p>
              <p className="text-xs font-medium 
                ${role === 'Admin' ? 'text-blue-600' : 
                  role === 'Editor' ? 'text-green-600' : 
                  'text-orange-600'}">
                {role === 'Admin' ? 'Administrator' : 
                role === 'Editor' ? 'Editor' : 
                'Viewer'}
              </p>
            </div>

            {/* Avatar */}
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-300"
              onError={(e) => {
                e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;
              }}
            />

            {/* Logout */}
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

export default AdminLayout;