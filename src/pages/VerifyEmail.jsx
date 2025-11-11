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
    console.log("VerifyEmail: useEffect triggered with token:", token);
    let isMounted = true; // Biến để kiểm soát cleanup

    const verify = async () => {
      if (!token) {
        console.log("VerifyEmail: No token provided");
        setError("Token không hợp lệ hoặc thiếu.");
        setLoading(false);
        return;
      }

      try {
        console.log("VerifyEmail: Sending verifyEmail request");
        const response = await verifyEmail({ token });
        console.log("VerifyEmail: Response received:", response);
        if (isMounted) {
          setSuccess(true);
          setLoading(false);
          toast.success("Xác minh email thành công! Vui lòng đăng nhập.", {
            duration: 5000,
            id: "verify-email-success", // Đảm bảo chỉ một toast
          });
          console.log("VerifyEmail: Setting 5-second redirect timer");
          setTimeout(() => {
            if (isMounted) {
              console.log("VerifyEmail: Redirecting to /auth");
              navigate("/auth");
            }
          }, 5000);
        }
      } catch (err) {
        console.error("VerifyEmail: Error:", err);
        if (isMounted) {
          setError(err.response?.data?.Message || "Đã có lỗi xảy ra.");
          setLoading(false);
        }
      }
    };

    verify();

    return () => {
      console.log("VerifyEmail: Cleanup useEffect");
      isMounted = false; // Cleanup để ngăn chặn cập nhật state sau khi unmount
    };
  }, [token, navigate]);

  console.log("VerifyEmail: Rendering with state - loading:", loading, "success:", success, "error:", error);

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
          <h1 className="text-3xl font-bold text-blue-600">Xác minh email</h1>
          <p className="text-gray-500">
            {loading ? "Đang xác minh tài khoản của bạn..." : "Kết quả xác minh"}
          </p>
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
          <div className="text-green-600 text-sm bg-green-50 p-4 rounded">
            <p className="font-semibold">Xác minh thành công!</p>
            <p>Đang chuyển hướng đến trang đăng nhập trong 5 giây...</p>
            <button
              onClick={() => navigate("/auth")}
              className="mt-2 text-blue-600 hover:underline font-medium"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-4 rounded">
            {error}
            <p className="mt-2">
              <Link to="/auth" className="text-blue-600 hover:underline">
                Quay lại đăng nhập
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}