import { useContext } from "react";
import toast from "react-hot-toast";
import { Link, Outlet, useLocation } from "react-router-dom"; // thêm useLocation
import { AuthContext } from "../context/AuthContext";

// ICONS
import { FiBox, FiHome, FiLayers, FiShield, FiUsers } from "react-icons/fi";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation(); // để kiểm tra active menu

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
  };

  // Avatar fallback: nếu không có hoặc lỗi thì dùng ảnh mặc định từ API luôn
  const avatarUrl = user?.avatar || "https://i.pravatar.cc/150"; // fallback an toàn

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FiHome /> },
    { name: "Quản lý Landing", path: "/admin/landing-management", icon: <FiLayers /> },
    { name: "Quản lý sản phẩm", path: "/admin/products", icon: <FiBox /> },
    { name: "Quản lý nhân viên", path: "/admin/employees", icon: <FiUsers /> },
    { name: "Thông tin cá nhân", path: "/admin/profile", icon: <FiShield /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg border-r flex flex-col">
        <div className="p-5 text-2xl font-bold text-blue-700 border-b">
          FECN SaaS
        </div>

        {/* Avatar + Email ở đầu sidebar (tùy chọn - đẹp hơn) */}
        <div className="px-5 py-6 border-b">
          <div className="flex items-center space-x-3">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
              onError={(e) => {
                // Nếu ảnh lỗi → tự động fallback về profile.jpg mặc định của backend
                e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;
              }}
            />
            <div>
              <p className="font-semibold text-gray-800">{user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.roles?.[0] || "Admin"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 mt-2 space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t text-xs text-gray-500">
          © 2025 — Admin System
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-blue-700">Trang quản trị</h1>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-gray-800">{user?.email}</p>
              <p className="text-xs text-gray-500">
                {user?.tenantName || "Tenant"}
              </p>
            </div>

            {/* Avatar trong header */}
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
              onError={(e) => {
                e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;
              }}
            />

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
            >
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

export default AdminLayout;