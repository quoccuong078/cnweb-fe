import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ICONS
import { FiBox, FiHome, FiLayers, FiShield, FiUsers } from "react-icons/fi";

const AdminLayout = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!user || !user.roles.includes("Admin"))) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user || !user.roles.includes("Admin")) return null;

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <FiHome /> },
    { name: "Quản lý Landing", path: "/admin/landing-management", icon: <FiLayers /> },
    { name: "Quản lý người dùng", path: "/admin/users", icon: <FiUsers /> },
    { name: "Quản lý sản phẩm", path: "/admin/products", icon: <FiBox /> },
    { name: "Quản lý nhân viên", path: "/admin/employees", icon: <FiBox /> },
    { name: "Danh sách vai trò", path: "/admin/roles", icon: <FiShield /> },
    { name: "Thông tin cá nhân", path: "/admin/profile", icon: <FiShield /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg border-r flex flex-col">
        <div className="p-5 text-2xl font-bold text-blue-700 border-b">
          FECN SaaS
        </div>

        <nav className="flex-1 p-3 mt-2 space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${active
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
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
          © 2025 — Admin System
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-blue-700">Trang quản trị</h1>

          <div className="flex items-center space-x-3">
            <span className="font-medium">{user.email}</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="rounded-full w-10 h-10"
            />
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
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

export default AdminLayout;
