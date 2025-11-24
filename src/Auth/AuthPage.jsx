// src/Auth/AuthPage.jsx
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiX } from "react-icons/fi"; // Import icon
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getCurrentUser,
  getPublicPlans,
  login as loginApi,
  requestPasswordReset,
  signup
} from "../services/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login: setAuth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("login");
  
  // --- STATE FORM ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subdomain, setSubdomain] = useState(""); // Chỉ lưu phần prefix (vd: tndtvn)
  
  // --- STATE MODAL PLAN ---
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- VALIDATION ---
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^0\d{9}$/.test(phone);

  // [CẬP NHẬT] Validate Subdomain: Không cho phép nhập dấu chấm
  const isValidSubdomain = (domain) => {
    const regex = /^[a-z0-9-]+$/; // Chỉ chữ thường, số, gạch ngang
    if (!regex.test(domain)) return { valid: false, msg: "Subdomain chỉ chứa chữ thường, số và gạch ngang (không nhập .com)" };
    if (domain.length < 3) return { valid: false, msg: "Tên subdomain quá ngắn (< 3 ký tự)" };
    return { valid: true };
  };

  // --- XỬ LÝ NÚT "TIẾP TỤC" (Validate & Mở Modal) ---
  const handlePreCheckRegister = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");

    // 1. Validate Form
    if (!isValidEmail(email)) { toast.error("Email không đúng định dạng!"); return; }
    if (!isValidPhone(phoneNumber)) { toast.error("SĐT phải đủ 10 số và bắt đầu bằng 0!"); return; }
    if (password.length < 6) { toast.error("Mật khẩu tối thiểu 6 ký tự!"); return; }
    if (password !== confirmPass) { toast.error("Mật khẩu xác nhận không khớp!"); return; }
    
    // Validate Subdomain
    const cleanSubdomain = subdomain.trim().toLowerCase();
    const subCheck = isValidSubdomain(cleanSubdomain);
    if (!subCheck.valid) { toast.error(subCheck.msg); return; }

    // 2. Load Plans & Mở Modal
    setLoading(true);
    try {
      const data = await getPublicPlans();
      setPlans(data);
      // Mặc định chọn gói Popular hoặc gói đầu tiên
      const defaultPlan = data.find(p => p.isPopular) || data[0];
      if (defaultPlan) setSelectedPlanId(defaultPlan.id);
      
      setShowPlanModal(true); // Mở Modal
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải bảng giá. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // --- XỬ LÝ SUBMIT CUỐI CÙNG (Gọi API Signup) ---
  const handleFinalSignup = async () => {
    if (!selectedPlanId) {
      toast.error("Vui lòng chọn một gói dịch vụ!");
      return;
    }

    setLoading(true);
    try {
      // [CẬP NHẬT] Tự động ghép đuôi domain hệ thống
      const fullSubdomain = `${subdomain.trim().toLowerCase()}.saaswebsite.com`;

      await signup({
        CompanyName: companyName,
        Email: email,
        Password: password,
        ContactName: contactName,
        PhoneNumber: phoneNumber,
        Subdomain: fullSubdomain, // Gửi chuỗi đầy đủ: "brand.saaswebsite.com"
        PlanId: selectedPlanId 
      });

      toast.success("Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt.", { duration: 8000 });

      // Reset & Close
      setShowPlanModal(false);
      setActiveTab("login");
      resetForm();
    } catch (err) {
      console.error("Signup error:", err);
      let msg = "Có lỗi xảy ra.";
      if (err.response?.data?.Message) msg = err.response.data.Message;
      else if (err.response?.data?.Error) msg = err.response.data.Error;
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      localStorage.setItem("token", res.token);
      const userData = await getCurrentUser();
      setAuth(userData, res.token);
      toast.success("Đăng nhập thành công!");
      
      // Điều hướng dựa trên Role
      if (userData.roles.includes("SuperAdmin")) navigate("/superadmin");
      else navigate("/admin");
      
    } catch (err) {
      let msg = "Email hoặc mật khẩu không đúng.";
      if (err.response?.data?.message) {
          msg = err.response.data.message;
      } else if (err.response?.data?.Message) {
          msg = err.response.data.Message;
      } else if (err.response?.data?.error) {
          msg = err.response.data.error;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { toast.error("Email sai định dạng"); return; }
    setLoading(true);
    try {
      await requestPasswordReset({ email });
      toast.success("Đã gửi link khôi phục mật khẩu vào email.");
      setTimeout(() => setActiveTab("login"), 3000);
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCompanyName(""); setContactName(""); setPhoneNumber("");
    setSubdomain(""); setPassword(""); setConfirmPass(""); setEmail("");
    setSelectedPlanId(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-6 relative">
      <Link to="/" className="fixed top-4 left-4 text-blue-600 hover:underline flex items-center gap-1 text-sm font-semibold z-40">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        Trang chủ
      </Link>

      <div className={`w-full bg-white shadow-2xl rounded-2xl p-8 transition-all duration-500 ease-in-out z-10 ${activeTab === "register" ? "max-w-2xl" : "max-w-md"}`}>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">FECN SaaS</h1>
          <p className="text-gray-500 mt-1">
            {activeTab === "login" ? "Đăng nhập hệ thống" : activeTab === "register" ? "Đăng ký tài khoản doanh nghiệp" : "Khôi phục mật khẩu"}
          </p>
        </div>

        <form onSubmit={activeTab === 'login' ? handleLoginSubmit : activeTab === 'forgot' ? handleForgotSubmit : handlePreCheckRegister} className="space-y-4">
          
          {/* --- LOGIN FORM --- */}
          {activeTab === "login" && (
            <>
              <div><label className="block text-gray-700 text-sm font-medium mb-1">Email</label><input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-gray-700 text-sm font-medium mb-1">Mật khẩu</label><input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required /></div>
            </>
          )}

          {/* --- REGISTER FORM --- */}
          {activeTab === "register" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-gray-700 text-sm font-medium mb-1">Tên công ty</label><input value={companyName} onChange={(e)=>setCompanyName(e.target.value)} type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required /></div>
                
                {/* [CẬP NHẬT] Giao diện nhập Subdomain có đuôi cố định */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Subdomain</label>
                  <div className="flex items-center">
                    <input 
                      value={subdomain} 
                      onChange={(e)=>setSubdomain(e.target.value)} 
                      type="text" 
                      placeholder="mybrand" 
                      className="w-full px-4 py-2 border border-r-0 rounded-l-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      required 
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 text-gray-500 px-3 py-2 rounded-r-lg text-sm select-none whitespace-nowrap">
                      .saaswebsite.com
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 whitespace-nowrap">*Chỉ nhập tên định danh, không nhập .com</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-gray-700 text-sm font-medium mb-1">Tên liên hệ</label><input value={contactName} onChange={(e)=>setContactName(e.target.value)} type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required /></div>
                <div><label className="block text-gray-700 text-sm font-medium mb-1">Số điện thoại</label><input value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} type="tel" placeholder="09xxxxxxx" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required /></div>
              </div>
              
              <div><label className="block text-gray-700 text-sm font-medium mb-1">Email đăng ký</label><input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required /></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-gray-700 text-sm font-medium mb-1">Mật khẩu</label><input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Min 6 ký tự" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required /></div>
                <div><label className="block text-gray-700 text-sm font-medium mb-1">Xác nhận MK</label><input value={confirmPass} onChange={(e)=>setConfirmPass(e.target.value)} type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required /></div>
              </div>
            </div>
          )}

          {/* --- FORGOT FORM --- */}
          {activeTab === "forgot" && (
            <div><label className="block text-gray-700 text-sm font-medium mb-1">Email khôi phục</label><input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required /></div>
          )}

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-100">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-md mt-4">
            {loading ? "Đang xử lý..." : activeTab === "login" ? "Đăng nhập" : activeTab === "register" ? "Tiếp tục: Chọn gói dịch vụ" : "Gửi yêu cầu"}
          </button>
        </form>

        <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
          {activeTab === "login" && (
            <>
              <span>Chưa có tài khoản? <button type="button" onClick={()=>setActiveTab("register")} className="text-blue-600 font-semibold hover:underline">Đăng ký</button></span>
              <button type="button" onClick={()=>setActiveTab("forgot")} className="text-blue-600 hover:underline">Quên mật khẩu?</button>
            </>
          )}
          {(activeTab === "register" || activeTab === "forgot") && (
            <div className="w-full text-center">
              <button type="button" onClick={()=>setActiveTab("login")} className="text-blue-600 font-semibold hover:underline">← Quay lại đăng nhập</button>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL CHỌN PLAN ================= */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Chọn gói dịch vụ</h2>
                <p className="text-gray-500 text-sm">Bước cuối cùng để hoàn tất đăng ký</p>
              </div>
              <button onClick={() => setShowPlanModal(false)} className="text-gray-400 hover:text-red-500 transition">
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 hover:shadow-xl bg-white
                      h-full flex flex-col
                      ${selectedPlanId === plan.id 
                        ? "border-blue-600 shadow-blue-100 ring-2 ring-blue-100 transform -translate-y-1" 
                        : "border-gray-100 hover:border-blue-300"
                      }
                    `}
                  >
                    {plan.isPopular && (
                      <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                        Phổ biến
                      </span>
                    )}
                    
                    {/* Header Card */}
                    <div className="mb-4">
                      <h3 className={`text-lg font-bold ${selectedPlanId === plan.id ? 'text-blue-600' : 'text-gray-800'}`}>
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline mt-2">
                        <span className="text-3xl font-extrabold text-gray-900">{plan.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 font-medium ml-1">₫{plan.period}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 h-8">{plan.description}</p>
                    </div>

                    <hr className="border-gray-100 my-4" />

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {(() => {
                        try {
                          const feats = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features;
                          return Array.isArray(feats) ? feats : [];
                        } catch { return []; }
                      })().map((feat, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600 gap-2">
                          <FiCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Radio Button Visual */}
                    <div className={`w-full py-2 rounded-lg text-center text-sm font-bold border transition-colors mt-auto
                      ${selectedPlanId === plan.id 
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-gray-50 text-gray-400 border-transparent"
                      }
                    `}>
                      {selectedPlanId === plan.id ? "Đang chọn" : "Chọn gói này"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-white flex justify-end gap-3 items-center">
              <button 
                onClick={() => setShowPlanModal(false)}
                className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition"
              >
                Quay lại
              </button>

              <button
                onClick={handleFinalSignup}
                disabled={loading}
                className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition disabled:opacity-70 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Đang đăng ký...
                  </>
                ) : (
                  "Xác nhận & Đăng ký"
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}