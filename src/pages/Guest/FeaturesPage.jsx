import { motion } from "framer-motion";
import { FiAnchor, FiBarChart2, FiGlobe, FiLayers, FiShield, FiSmartphone } from "react-icons/fi";

const features = [
  {
    icon: <FiLayers />,
    title: "Trình kéo thả trực quan",
    desc: "Không cần code. Thiết kế Landing Page bằng cách kéo thả các khối nội dung được dựng sẵn."
  },
  {
    icon: <FiGlobe />,
    title: "Tên miền tùy chỉnh",
    desc: "Kết nối tên miền riêng (VD: landing.congtyban.com) để tăng tính chuyên nghiệp và nhận diện thương hiệu."
  },
  {
    icon: <FiSmartphone />,
    title: "Responsive 100%",
    desc: "Giao diện tự động tối ưu hiển thị trên mọi thiết bị: Mobile, Tablet và Desktop."
  },
  {
    icon: <FiBarChart2 />,
    title: "Phân tích & Thống kê",
    desc: "Theo dõi lượt xem, khách truy cập duy nhất (Unique Visitors) theo thời gian thực."
  },
  {
    icon: <FiShield />,
    title: "Bảo mật SSL miễn phí",
    desc: "Mọi trang Landing Page tạo ra đều được tích hợp chứng chỉ bảo mật SSL tự động."
  },
  {
    icon: <FiAnchor />,
    title: "Quản lý tập trung",
    desc: "Một tài khoản quản lý hàng chục trang Landing Page khác nhau trên cùng một Dashboard."
  }
];

export default function FeaturesPage() {
  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tính năng mạnh mẽ</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Mọi công cụ bạn cần để xây dựng, vận hành và tối ưu hóa các chiến dịch Marketing của mình.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}