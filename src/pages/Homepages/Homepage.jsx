import { motion } from "framer-motion";
import { FiCheckCircle, FiLayout, FiMonitor, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";
// Xóa Navbar import vì đã có trong MainLayout

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* ===== Hero Section ===== */}
      <section className="pt-36 pb-20 px-6 md:px-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Nền tảng tạo Landing Page số 1
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
            Xây dựng trang web <br />
            <span className="text-blue-600">trong vài phút.</span>
          </h1>

          <p className="text-gray-600 mb-8 text-lg md:text-xl leading-relaxed">
            FECN SaaS giúp doanh nghiệp tạo, xuất bản và quản lý hàng loạt Landing Page với tên miền riêng mà không cần biết lập trình.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth" className="bg-blue-600 text-white px-8 py-3.5 text-lg rounded-full font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-200 text-center">
              Tạo trang miễn phí
            </Link>
            <Link to="/contact" className="border-2 border-gray-200 text-gray-700 px-8 py-3.5 text-lg rounded-full font-bold hover:border-blue-600 hover:text-blue-600 transition text-center">
              Xem Demo
            </Link>
          </div>
          
          <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
              ))}
            </div>
            <p>Được tin dùng bởi 1,000+ doanh nghiệp</p>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="w-full h-auto"
            />
             {/* Floating Badge */}
             <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute top-10 left-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3"
             >
                <div className="bg-green-100 p-2 rounded-lg text-green-600"><FiTrendingUp size={24}/></div>
                <div>
                  <p className="text-xs text-gray-500">Tỷ lệ chuyển đổi</p>
                  <p className="font-bold text-gray-800">+125%</p>
                </div>
             </motion.div>
          </div>
          {/* Decorative Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
        </motion.div>
      </section>

      {/* ===== How it works ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quy trình đơn giản</h2>
          <p className="text-gray-500 mb-12 max-w-2xl mx-auto">Chỉ cần 3 bước để đưa doanh nghiệp của bạn lên internet.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <FiLayout/>, title: "1. Chọn giao diện", desc: "Kho giao diện mẫu đa dạng cho mọi ngành nghề." },
              { icon: <FiMonitor/>, title: "2. Chỉnh sửa nội dung", desc: "Kéo thả, thay đổi hình ảnh và văn bản dễ dàng." },
              { icon: <FiCheckCircle/>, title: "3. Xuất bản", desc: "Gắn tên miền riêng và online ngay lập tức." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Call to Action ===== */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Sẵn sàng bùng nổ doanh số?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Tham gia cùng hàng nghìn doanh nghiệp đang sử dụng FECN SaaS để phát triển thương hiệu.
            </p>
            <Link to="/auth" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-xl">
              Bắt đầu ngay hôm nay
            </Link>
          </div>
          {/* Circles background */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
      </section>
    </div>
  );
}