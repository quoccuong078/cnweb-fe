import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

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
          <button
            onClick={() => navigate("/auth")} // 👈 Thêm điều hướng
            className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </header>
  );
}
