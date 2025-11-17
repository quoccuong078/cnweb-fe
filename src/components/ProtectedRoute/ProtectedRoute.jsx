import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const publicPaths = ["/", "/auth", "/homepages", "/verify-email", "/reset-password"];
  if (publicPaths.includes(location.pathname)) {
    return <Outlet />;
  }

  useEffect(() => {
    if (loading) return;

    // Nếu chưa đăng nhập → chuyển về /auth
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    const isAdminPage = location.pathname.startsWith("/admin");
    const isSuperAdminPage = location.pathname.startsWith("/superadmin");

    const isAdmin = user.roles?.includes("Admin");
    const isSuperAdmin = user.roles?.includes("SuperAdmin");

    if (isAdminPage && !isAdmin && !isSuperAdmin) {
      toast.error("Bạn không có quyền truy cập khu vực Admin!");
      navigate("/", { replace: true });
    }

    if (isSuperAdminPage && !isSuperAdmin) {
      toast.error("Bạn không có quyền truy cập khu vực SuperAdmin!");
      navigate("/", { replace: true });
    }
  }, [user, loading, location.pathname]);

  if (loading) return null;
  if (!user) return null;

  return <Outlet />;
}
