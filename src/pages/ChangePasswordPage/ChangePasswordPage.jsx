import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle, FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { changePassword } from "../../services/api";

export default function ChangePasswordPage() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'new_password') {
      checkPasswordStrength(value);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.old_password || !formData.new_password || !formData.confirm_password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return false;
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return false;
    }

    if (formData.new_password.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return false;
    }

    if (formData.old_password === formData.new_password) {
      toast.error('Mật khẩu mới phải khác mật khẩu cũ');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      await changePassword(formData.old_password, formData.new_password);
      toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      
      // Đăng xuất và chuyển đến trang login sau 2 giây
      setTimeout(() => {
        logout();
        navigate('/auth'); // Chuyển về trang auth/login
      }, 2000);
      
    } catch (error) {
      console.error('Failed to change password:', error);
      const msg = error.response?.data?.Message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FiLock className="text-3xl text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đổi mật khẩu</h1>
            <p className="text-gray-500 text-sm">Bảo vệ tài khoản của bạn bằng mật khẩu mạnh</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mật khẩu cũ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-10"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('old')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.old ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-10"
                  placeholder="Nhập mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.new_password && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs font-medium text-gray-700 mb-2">Độ mạnh mật khẩu:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-xs">
                      <FiCheckCircle 
                        className={`mr-1.5 ${passwordStrength.length ? 'text-green-500' : 'text-gray-300'}`} 
                      />
                      <span className={passwordStrength.length ? 'text-green-700 font-medium' : 'text-gray-500'}>
                        ≥ 6 ký tự
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <FiCheckCircle 
                        className={`mr-1.5 ${passwordStrength.uppercase ? 'text-green-500' : 'text-gray-300'}`} 
                      />
                      <span className={passwordStrength.uppercase ? 'text-green-700 font-medium' : 'text-gray-500'}>
                        Chữ hoa (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <FiCheckCircle 
                        className={`mr-1.5 ${passwordStrength.lowercase ? 'text-green-500' : 'text-gray-300'}`} 
                      />
                      <span className={passwordStrength.lowercase ? 'text-green-700 font-medium' : 'text-gray-500'}>
                        Chữ thường (a-z)
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <FiCheckCircle 
                        className={`mr-1.5 ${passwordStrength.number ? 'text-green-500' : 'text-gray-300'}`} 
                      />
                      <span className={passwordStrength.number ? 'text-green-700 font-medium' : 'text-gray-500'}>
                        Số (0-9)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition pr-10 ${
                    formData.confirm_password && formData.new_password !== formData.confirm_password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {formData.confirm_password && formData.new_password !== formData.confirm_password && (
                <p className="text-red-600 text-xs mt-1 font-medium">Mật khẩu xác nhận không khớp</p>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3">
              <div className="text-yellow-600 pt-0.5 text-lg">⚠️</div>
              <p className="text-xs text-yellow-800 leading-relaxed">
                <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành công, phiên đăng nhập hiện tại sẽ kết thúc và bạn cần đăng nhập lại.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium text-sm"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading || !isPasswordStrong}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 font-medium text-sm shadow-lg shadow-blue-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  'Cập nhật mật khẩu'
                )}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}