// src/components/ProtectedRoute/ProtectedRoute.jsx
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Các route công khai (không cần login)
  const publicPaths = [
    "/", "/auth", "/homepages", "/verify-email", 
    "/reset-password", "/forgot-password"
  ];

  if (publicPaths.some(p => location.pathname.startsWith(p))) {
    return <Outlet />;
  }

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      navigate("/auth", { replace: true });
      return;
    }

    const roles = user.roles || [];
    const isSuperAdmin = roles.includes("SuperAdmin");
    const isAdmin = roles.includes("Admin");
    const isEditor = roles.includes("Editor");
    const isViewer = roles.includes("Viewer");

    const isAdminRoute = location.pathname.startsWith("/admin");
    const isSuperAdminRoute = location.pathname.startsWith("/superadmin");

    // 1. SuperAdmin mới vào được /superadmin
    if (isSuperAdminRoute && !isSuperAdmin) {
      toast.error("Bạn không có quyền truy cập khu vực SuperAdmin!");
      navigate("/admin", { replace: true });
      return;
    }

    // 2. Chỉ người có quyền trong tenant mới vào được /admin
    // → Người vừa đăng ký đã là Admin → được vào ngay
    if (isAdminRoute && !(isSuperAdmin || isAdmin || isEditor || isViewer)) {
      toast.error("Bạn không có quyền truy cập khu vực quản trị!");
      navigate("/", { replace: true });
      return;
    }

    // ===> ĐÃ BỎ HOÀN TOÀN VIỆC CHẶN KHI CHƯA VERIFY EMAIL <===
    // Bây giờ cảnh báo sẽ hiển thị trong AdminLayout thay vì chặn cứng

  }, [user, loading, location.pathname, navigate]);

  if (loading || !user) return null;

  return <Outlet />;
}