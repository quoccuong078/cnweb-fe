import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError("Token không hợp lệ hoặc thiếu.");
        setLoading(false);
        return;
      }

      try {
        await verifyEmail({ token });
        setSuccess(true);
        toast.success("Xác minh email thành công! Vui lòng đăng nhập.");
        setTimeout(() => navigate("/auth"), 2000);
      } catch (err) {
        setError(err.response?.data?.Message || "Đã có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      {/* Nút trở về trang chủ */}
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
          <h1 className="text-3xl font-bold text-blue-600">Xác minh email</h1>
          <p className="text-gray-500">Đang xác minh tài khoản của bạn...</p>
        </div>

        {loading && (
          <div className="flex justify-center">
            <svg
              className="w-8 h-8 animate-spin text-blue-600"
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
          </div>
        )}

        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
            Xác minh thành công! Đang chuyển hướng đến trang đăng nhập...
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>
        )}
      </div>
    </div>
  );
}