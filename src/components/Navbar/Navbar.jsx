import { useContext, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const isActive = (path) => location.pathname === path ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600";

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center gap-2"
        >
          <span className="bg-blue-600 text-white rounded p-1 text-lg">FS</span>
          FECN SaaS
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 font-medium">
          <Link to="/features" className={`transition ${isActive("/features")}`}>Tính năng</Link>
          <Link to="/pricing" className={`transition ${isActive("/pricing")}`}>Bảng giá</Link>
          <Link to="/contact" className={`transition ${isActive("/contact")}`}>Liên hệ</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <>
              <Link 
                to={user.roles?.includes("SuperAdmin") ? "/superadmin" : "/admin"} 
                className="text-blue-600 font-medium hover:underline"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
               <Link to="/auth" className="text-gray-600 font-medium hover:text-blue-600">
                Đăng nhập
              </Link>
              <Link 
                to="/auth" 
                className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Bắt đầu miễn phí
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-2xl text-gray-700">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col space-y-4 shadow-lg">
          <Link to="/features" onClick={() => setIsOpen(false)} className="text-gray-700 font-medium">Tính năng</Link>
          <Link to="/pricing" onClick={() => setIsOpen(false)} className="text-gray-700 font-medium">Bảng giá</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="text-gray-700 font-medium">Liên hệ</Link>
          <hr />
          {user ? (
            <button onClick={handleLogout} className="text-left text-red-600 font-medium">Đăng xuất</button>
          ) : (
             <Link to="/auth" onClick={() => setIsOpen(false)} className="text-blue-600 font-bold">Đăng nhập / Đăng ký</Link>
          )}
        </div>
      )}
    </header>
  );
}