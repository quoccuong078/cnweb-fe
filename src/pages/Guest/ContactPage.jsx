import { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Giả lập gửi API
    setTimeout(() => {
      toast.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.");
      setFormData({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="pt-28 pb-20 bg-gray-50 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Info Side */}
          <div className="bg-blue-600 p-10 md:p-14 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h2>
              <p className="text-blue-100 mb-10 leading-relaxed">
                Bạn có câu hỏi về tính năng, bảng giá hoặc cần hỗ trợ kỹ thuật? 
                Đừng ngần ngại để lại lời nhắn.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg"><FiMail size={20}/></div>
                  <span>support@fecnsaas.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg"><FiPhone size={20}/></div>
                  <span>+84 90 123 4567</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg"><FiMapPin size={20}/></div>
                  <span>Tòa nhà Innovation, TP. Hồ Chí Minh</span>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/40 transition">f</div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/40 transition">in</div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/40 transition">t</div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-10 md:p-14">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="email@vidu.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lời nhắn</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Tôi cần tư vấn về gói Enterprise..."
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-70"
              >
                {loading ? "Đang gửi..." : "Gửi tin nhắn"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}