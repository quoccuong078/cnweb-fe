import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getCurrentUser, login as loginApi, requestPasswordReset, signup } from "../services/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login: setAuth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setLoading(true);

    try {
      if (activeTab === "login") {
        const res = await loginApi({ email, password });

        localStorage.setItem("token", res.token);

        // // Kiểm tra có warning không
        // if (res.warnings && res.warnings.length > 0) {
        //   res.warnings.forEach(msg => toast(msg, { 
        //     duration: 8000, 
        //     style: { background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' } 
        //   }));
        // }

        const userData = await getCurrentUser();

        setAuth(userData, res.token);

        toast.success("Đăng nhập thành công!");

        if (userData.roles.includes("SuperAdmin")) navigate("/superadmin");
        else navigate("/admin");
      }
      
      else if (activeTab === "register") {
        if (password !== confirmPass) {
          const errorMessage = "Mật khẩu xác nhận không khớp!";
          toast.error(errorMessage, { duration: 5000 });
          setError(errorMessage);
          setLoading(false);
          return;
        }

        const response = await signup({
          CompanyName: companyName,
          Email: email,
          Password: password,
          ContactName: contactName,
          PhoneNumber: phoneNumber,
          Subdomain: subdomain,
        });

        // === TOÀN BỘ PHẦN SỬA Ở ĐÂY ===
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email (và mục Spam) để kích hoạt tài khoản trước khi đăng nhập.",
          { duration: 10000 }
        );

        // XÓA sạch token cũ nếu có (phòng trường hợp user đang login tài khoản khác)
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // KHÔNG gọi setAuth nữa → không đăng nhập tự động
        // Chỉ chuyển về tab login để user tự đăng nhập sau khi verify
        setActiveTab("login");

        // Reset form
        setCompanyName("");
        setContactName("");
        setPhoneNumber("");
        setSubdomain("");
        setPassword("");
        setConfirmPass("");
        // ==============================

      } else if (activeTab === "forgot") {
        await requestPasswordReset({ email });
        toast.success("Link đặt lại mật khẩu đã được gửi đến email của bạn.", { duration: 5000 });
        setTimeout(() => setActiveTab("login"), 3000);
      }
    } catch (err) {
      console.error("Error during auth:", err);
      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";

      // Ưu tiên lấy đúng message từ backend (rất quan trọng!)
      if (err.response?.data?.Message) {
        errorMessage = err.response.data.Message;
      } else if (err.response?.data?.Error) {
        errorMessage = err.response.data.Error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = "Email hoặc mật khẩu không đúng.";
      }

      toast.error(errorMessage, { duration: 6000 });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = (provider) => {
    toast.error(`Chưa hỗ trợ đăng nhập với ${provider}. Vui lòng thử lại sau!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <Link
        to="/"
        className="fixed top-4 left-4 text-blue-600 hover:underline flex items-center gap-1 text-sm font-semibold z-50"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Trang chủ
      </Link>

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">FECN SaaS</h1>
          <p className="text-gray-500">
            {activeTab === "login"
              ? "Đăng nhập vào tài khoản của bạn"
              : activeTab === "register"
              ? "Tạo tài khoản mới"
              : "Khôi phục mật khẩu của bạn"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "login" && (
            <>
              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Nhập email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Mật khẩu</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </>
          )}

          {activeTab === "register" && (
            <>
              <div>
                <label className="block text-gray-600 mb-1">Tên công ty</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  type="text"
                  placeholder="Nhập tên công ty"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Nhập email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Tên liên hệ</label>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  type="text"
                  placeholder="Nhập tên liên hệ"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Số điện thoại</label>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Subdomain</label>
                <input
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  type="text"
                  placeholder="Nhập subdomain (VD: mycompany)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Mật khẩu</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Xác nhận mật khẩu</label>
                <input
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </>
          )}

          {activeTab === "forgot" && (
            <div>
              <label className="block text-gray-600 mb-1">Email khôi phục</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Nhập email đã đăng ký"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Đang xử lý...
              </>
            ) : activeTab === "login" ? (
              "Đăng nhập"
            ) : activeTab === "register" ? (
              "Đăng ký"
            ) : (
              "Gửi yêu cầu"
            )}
          </button>
        </form>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          {activeTab === "login" && (
            <>
              <span>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className="text-blue-600 hover:underline"
                >
                  Đăng ký
                </button>
              </span>
              <button
                type="button"
                onClick={() => setActiveTab("forgot")}
                className="text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </>
          )}

          {activeTab === "register" && (
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className="text-blue-600 hover:underline"
            >
              ← Quay lại đăng nhập
            </button>
          )}

          {activeTab === "forgot" && (
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className="text-blue-600 hover:underline"
            >
              ← Quay lại đăng nhập
            </button>
          )}
        </div>

        {activeTab === "login" && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-400 text-sm">Hoặc đăng nhập bằng</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="grid gap-3">
              <button
                onClick={() => handleSocial("Google")}
                className="w-full flex items-center justify-center gap-3 border py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <FaGoogle className="text-xl text-red-500" />
                <span>Google</span>
              </button>
              <button
                onClick={() => handleSocial("Facebook")}
                className="w-full flex items-center justify-center gap-3 border py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <FaFacebook className="text-xl text-blue-600" />
                <span>Facebook</span>
              </button>
              <button
                onClick={() => handleSocial("GitHub")}
                className="w-full flex items-center justify-center gap-3 border py-2 rounded-lg hover:bg-gray-50 transition"
              >
                <FaGithub className="text-xl text-gray-700" />
                <span>GitHub</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}