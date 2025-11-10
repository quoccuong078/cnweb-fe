import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
        <svg
          className="w-8 h-8 animate-spin text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
    );
  }

  if (!user || !user.roles.includes("Admin")) {
    return null; // Render nothing while redirecting
  }

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Danh sách vai trò", path: "/admin/roles" },
    { name: "Tạo Landing mới", path: "/admin/create-landing" },
    { name: "Editor", path: "/admin/editor" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-blue-500">
          Admin Panel
        </div>
        <nav className="flex-1 p-3 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-lg font-medium transition ${
                location.pathname === item.path
                  ? "bg-blue-500"
                  : "hover:bg-blue-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-500 text-sm">
          © 2025 - Admin
        </div>
      </aside>

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