// src/layouts/AdminLayout.jsx
import { useContext, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FiAlertCircle, FiBarChart2, FiEdit3, FiEye, FiHome, FiLayers, FiShield, FiUsers } from "react-icons/fi";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  
  // Dùng ref để đảm bảo toast chỉ hiện 1 lần duy nhất
  const hasShownVerifyToast = useRef(false);

  useEffect(() => {
    if (user && !user.isEmailVerified && !hasShownVerifyToast.current) {
      hasShownVerifyToast.current = true; // Đánh dấu đã hiện

      toast(
        (t) => (
          <div className="flex items-start gap-4 max-w-lg">
            <FiAlertCircle className="text-4xl text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-lg text-orange-900">Email chưa được xác minh!</p>
              <p className="text-sm text-gray-700 mt-1">
                Vui lòng kiểm tra hộp thư <strong>(bao gồm mục Spam/Junk)</strong> để nhận link kích hoạt tài khoản.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Sau khi xác minh, bạn sẽ được sử dụng đầy đủ các tính năng.
              </p>
            </div>
          </div>
        ),
        {
          id: "email-not-verified", // Đảm bảo không bị duplicate dù re-render
          duration: 5000,
          position: "top-center",
          style: {
            background: "#fffaeb",
            border: "2px solid #f97316",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 10px 25px rgba(249, 115, 22, 0.2)",
          },
        }
      );
    }
  }, [user?.isEmailVerified]);

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
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
    Admin:   { color: "bg-blue-100 text-blue-700",     icon: <FiShield className="text-lg" /> },
    Editor:  { color: "bg-green-100 text-green-700",   icon: <FiEdit3 className="text-lg" /> },
    Viewer:  { color: "bg-orange-100 text-orange-700", icon: <FiEye className="text-lg" /> },
  };

  const config = roleConfig[role] || roleConfig.Viewer;

  const menuItems = [
    { name: "Dashboard",           path: "/admin",                     icon: <FiHome />,       roles: ["Admin", "Editor", "Viewer"] },
    { name: "Thống kê",            path: "/admin/statistics",          icon: <FiBarChart2 />,  roles: ["Admin", "Editor", "Viewer"] },
    { name: "Quản lý Landing",     path: "/admin/landing-management",  icon: <FiLayers />,     roles: ["Admin", "Editor"] },
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
              <p className="font-semibold text-gray-800 truncate" title={user?.contactName || user?.email}>
                {user?.contactName || user?.email}
              </p>
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-blue-600">
            {user?.tenantName || (user?.tenantId ? "Tenant Dashboard" : "Admin System")}
          </h1>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-gray-800 truncate max-w-[200px]">{user?.email}</p>
              <p className={`text-xs font-medium ${
                role === 'Admin' ? 'text-blue-600' : 
                role === 'Editor' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {role === 'Admin' ? 'Administrator' : role === 'Editor' ? 'Editor' : 'Viewer'}
              </p>
            </div>

            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-300"
              onError={(e) => e.currentTarget.src = `${import.meta.env.VITE_API_URL}/avatar/profile.jpg`}
            />

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition font-medium"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {/* Banner lớn, nổi bật ở đầu trang */}
          {!user?.isEmailVerified && (
            <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl shadow-lg flex items-center gap-5">
              <FiAlertCircle className="text-5xl text-orange-600 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-orange-900">Tài khoản chưa được kích hoạt đầy đủ</h3>
                <p className="text-orange-800 mt-2 leading-relaxed">
                  Bạn đã đăng nhập thành công, nhưng <strong>chưa xác minh email</strong>.<br />
                  Vui lòng kiểm tra hộp thư (kể cả mục <strong>Spam/Junk/Promotions</strong>) để nhận link kích hoạt.
                </p>
                <p className="text-sm text-orange-700 mt-3 font-medium">
                  Sau khi xác minh, bạn sẽ được sử dụng tất cả tính năng của hệ thống.
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