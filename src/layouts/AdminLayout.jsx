import { useContext } from "react";
import toast from "react-hot-toast";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Import thêm icon BarChart cho thống kê
import { FiBox, FiHome, FiLayers, FiShield, FiUsers, FiBarChart2 } from "react-icons/fi";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
  };

  const avatarUrl = user?.avatar || `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;

  // 1. Lấy role hiện tại của user (Mặc định là Viewer nếu không tìm thấy)
  const currentRole = user?.roles?.[0] || "Viewer";

  // 2. Định nghĩa menu với quyền truy cập (allowedRoles)
  const allMenuItems = [
    { 
      name: "Dashboard", 
      path: "/admin", 
      icon: <FiHome />, 
      allowedRoles: ["Admin", "Editor", "Viewer"] // Ai cũng thấy
    },
    { 
      name: "Thống kê", 
      path: "/admin/statistics", 
      icon: <FiBarChart2 />, 
      allowedRoles: ["Admin"] // Chỉ Admin thấy
    },
    { 
      name: "Quản lý Landing", 
      path: "/admin/landing-management", 
      icon: <FiLayers />, 
      allowedRoles: ["Admin", "Editor"] // Admin và Editor thấy
    },
    { 
      name: "Quản lý sản phẩm", 
      path: "/admin/products", 
      icon: <FiBox />, 
      allowedRoles: ["Admin", "Editor"] 
    },
    { 
      name: "Quản lý nhân viên", 
      path: "/admin/employees", 
      icon: <FiUsers />, 
      allowedRoles: ["Admin"] // Chỉ Admin thấy
    },
    { 
      name: "Thông tin cá nhân", 
      path: "/admin/profile", 
      icon: <FiShield />, 
      allowedRoles: ["Admin", "Editor", "Viewer"] 
    },
  ];

  // 3. Lọc menu dựa trên role hiện tại
  const menuItems = allMenuItems.filter(item => item.allowedRoles.includes(currentRole));

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg border-r flex flex-col transition-all duration-300">
        <div className="p-5 text-2xl font-bold text-blue-700 border-b flex items-center gap-2">
          <FiLayers /> FECN SaaS
        </div>

        <div className="px-5 py-6 border-b bg-blue-50/50">
          <div className="flex items-center space-x-3">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-600 shadow-sm"
              onError={(e) => {
                e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`;
              }}
            />
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-800 truncate" title={user?.email}>{user?.email}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                currentRole === 'Admin' ? 'bg-blue-100 text-blue-700' : 
                currentRole === 'Editor' ? 'bg-green-100 text-green-700' : 
                'bg-gray-100 text-gray-600'
              }`}>
                {currentRole}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 mt-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md transform scale-[1.02]"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t text-xs text-center text-gray-400">
          © 2025 — Admin System
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center z-10">
          <h1 className="text-xl font-bold text-gray-800">
             {menuItems.find(i => i.path === location.pathname)?.name || "Trang quản trị"}
          </h1>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="font-medium text-gray-800 text-sm">{user?.tenantName || "Tenant"}</p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm text-sm font-medium"
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