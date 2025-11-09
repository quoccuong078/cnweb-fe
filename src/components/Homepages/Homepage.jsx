import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Navbar from "../Navbar/Navbar";

// Component tùy chỉnh cho nút Next
const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 shadow-lg text-xl"
      onClick={onClick}
    >
      ❯
    </div>
  );
};

// Component tùy chỉnh cho nút Prev
const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute left-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 shadow-lg text-xl"
      onClick={onClick}
    >
      ❮
    </div>
  );
};

export default function Homepage() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 overflow-x-hidden">
      <Navbar />

      {/* ===== Hero Section ===== */}
      <section className="pt-32 pb-20 px-6 md:px-20 grid md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            Dành cho công nghệ & phần mềm
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Xây dựng sản phẩm của bạn. <br />
            <span className="text-blue-600">
              Chúng tôi sẽ xây dựng kênh phân phối cho bạn.
            </span>
          </h1>

          <p className="text-gray-600 mb-8 text-lg">
            Giúp bạn quảng bá sản phẩm, mở rộng thị trường và tối ưu hiệu quả
            kinh doanh — tất cả trong một nền tảng SaaS mạnh mẽ.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 text-lg rounded-full font-semibold hover:bg-blue-700 transition transform hover:scale-105">
              Nhận bản demo
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 text-lg rounded-full font-semibold hover:bg-blue-50 transition transform hover:scale-105">
              Bắt đầu miễn phí
            </button>
          </div>
        </motion.div>

        {/* Image bên phải */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="relative">
            <img
              src="https://cdn-icons-png.flaticon.com/512/7063/7063177.png"
              alt="hero"
              className="w-80 md:w-96 rounded-full bg-blue-100 p-6 shadow-md"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute top-8 right-8 bg-white shadow-lg rounded-full p-3"
            >
              💬
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute bottom-10 left-10 bg-white shadow-lg rounded-full p-3"
            >
              📈
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ===== Slider Section ===== */}
      <section className="py-16 bg-gradient-to-r from-blue-100 to-blue-50 relative">
        <div className="max-w-5xl mx-auto px-6">
          <Slider {...sliderSettings}>
            {[
              "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&q=80",
              "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1200&q=80",
            ].map((src, i) => (
              <div key={i}>
                <img
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className="w-full rounded-xl shadow-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* ===== Steps Section ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-14">
            Khám phá cách dễ dàng hơn để:
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                number: 1,
                title: "Tạo khách hàng tiềm năng chất lượng",
                desc: "Tự động phân phối nội dung dựa trên hành vi người dùng và nâng cao tỷ lệ chuyển đổi.",
              },
              {
                number: 2,
                title: "Quản lý vòng đời đăng ký",
                desc: "Theo dõi tương tác của khách hàng, cải thiện trải nghiệm và tối ưu hóa quy trình bán hàng.",
              },
              {
                number: 3,
                title: "Gia hạn và chăm sóc khách hàng",
                desc: "Duy trì mối quan hệ lâu dài, tự động hóa hỗ trợ và ưu tiên khách hàng giá trị cao.",
              },
            ].map((item) => (
              <motion.div
                key={item.number}
                whileHover={{ scale: 1.05 }}
                className="relative bg-blue-50 rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all"
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-md">
                  {item.number}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-blue-700 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6">{item.desc}</p>
                <button className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
                  Nhận bản demo
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-10">
            Tính năng nổi bật
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Tích hợp thông minh",
                desc: "Kết nối dễ dàng với CRM, Marketing Hub và hệ thống nội bộ của bạn.",
                icon: "⚙️",
              },
              {
                title: "Phân tích dữ liệu",
                desc: "Cung cấp báo cáo chi tiết giúp bạn đưa ra quyết định kinh doanh chính xác hơn.",
                icon: "📊",
              },
              {
                title: "Tự động hóa quy trình",
                desc: "Tiết kiệm thời gian với các workflow và tính năng tự động hóa toàn diện.",
                icon: "🤖",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-blue-50 rounded-2xl p-8 shadow-sm"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} FECN SaaS Platform. All rights reserved.
      </footer>
    </div>
  );
}
