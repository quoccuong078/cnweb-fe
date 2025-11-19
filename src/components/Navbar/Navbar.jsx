import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-blue-600 cursor-pointer"
        >
          FECN SaaS
        </h1>

        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <a href="#features" className="hover:text-blue-600 transition">
            Tính năng
          </a>
          <a href="#pricing" className="hover:text-blue-600 transition">
            Giá cả
          </a>
          <a href="#resources" className="hover:text-blue-600 transition">
            Tài nguyên
          </a>
          <a href="#contact" className="hover:text-blue-600 transition">
            Liên hệ
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <button className="hidden md:block px-4 py-2 border border-blue-500 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition">
            Bắt đầu miễn phí
          </button>
          {user ? (
            <>
              <Link to="/admin" className="hover:underline">
                Admin Panel
              </Link>
              <Link to="/change-password" className="hover:underline">
                Đổi mật khẩu
              </Link>
              <button
                onClick={handleLogout}
                className="hover:underline"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/auth" className="hover:underline">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
