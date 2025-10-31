import { useState } from "react";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // login | register | forgot
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // demo credentials
  const DEMO_USER = "asdf123";
  const DEMO_PASS = "123456";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (activeTab === "login") {
        if (username === DEMO_USER && password === DEMO_PASS) {
          localStorage.setItem("token", "demo-token-123");
          localStorage.setItem("username", username);
          navigate("/");
        } else {
          setError("Tài khoản hoặc mật khẩu không đúng.");
        }
      } else if (activeTab === "register") {
        if (password !== confirmPass) {
          setError("Mật khẩu xác nhận không khớp!");
        } else {
          alert(`(Demo) Đăng ký thành công cho ${username}`);
          setActiveTab("login");
        }
      } else if (activeTab === "forgot") {
        alert(`(Demo) Email khôi phục đã được gửi đến: ${email}`);
        setActiveTab("login");
      }
    }, 800);
  };

  const handleSocial = (provider) => {
    alert(`(Demo) Sẽ mở OAuth với ${provider} — bạn tích hợp thật ở backend.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        {/* Header */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab !== "forgot" && (
            <div>
              <label className="block text-gray-600 mb-1">Tài khoản</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Nhập tài khoản"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          )}

          {activeTab === "register" && (
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          )}

          {activeTab !== "forgot" && (
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
          )}

          {activeTab === "register" && (
            <div>
              <label className="block text-gray-600 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                type="password"
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
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

        {/* Footer actions */}
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

        {/* Divider */}
        {activeTab === "login" && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-400 text-sm">
                Hoặc đăng nhập bằng
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Social login buttons */}
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
