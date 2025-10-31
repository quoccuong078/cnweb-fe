
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#052c65] text-gray-300 py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-10">
        {/* Logo + Description */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-4">Group 4</h2>
          <p className="text-gray-400 mb-6">
            Giải pháp phần mềm giúp doanh nghiệp của bạn phát triển nhanh hơn,
            thông minh hơn và hiệu quả hơn.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              <Facebook />
            </a>
            <a href="#" className="hover:text-white">
              <Instagram />
            </a>
            <a href="#" className="hover:text-white">
              <Linkedin />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Sản phẩm</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">CRM</a></li>
            <li><a href="#" className="hover:text-white">Marketing</a></li>
            <li><a href="#" className="hover:text-white">Bán hàng</a></li>
            <li><a href="#" className="hover:text-white">Dịch vụ</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Công ty</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Giới thiệu</a></li>
            <li><a href="#" className="hover:text-white">Tuyển dụng</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Trung tâm trợ giúp</a></li>
            <li><a href="#" className="hover:text-white">Liên hệ</a></li>
            <li><a href="#" className="hover:text-white">Chính sách bảo mật</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
        © 2025 YourBrand. All rights reserved.
      </div>
    </footer>
  );
}
