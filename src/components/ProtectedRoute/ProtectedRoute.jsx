// src/components/ProtectedRoute/ProtectedRoute.jsx
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const publicPaths = ["/", "/auth", "/homepages", "/verify-email", "/reset-password", "/forgot-password"];
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

    // SuperAdmin vào được cả 2
    if (isSuperAdminRoute && !isSuperAdmin) {
      toast.error("Bạn không có quyền truy cập khu vực SuperAdmin!");
      navigate("/admin", { replace: true });
      return;
    }

    // Chỉ người trong tenant (Admin/Editor/Viewer/SuperAdmin) mới vào /admin
    if (isAdminRoute && !(isSuperAdmin || isAdmin || isEditor || isViewer)) {
      toast.error("Bạn không có quyền truy cập khu vực này!");
      navigate("/", { replace: true });
      return;
    }

  }, [user, loading, location.pathname, navigate]);

  if (loading || !user) return null;

  return <Outlet />;
}