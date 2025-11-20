import { useState } from "react";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmNewPass, setConfirmNewPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate độ dài mật khẩu
        if (currentPass.length < 6 || newPass.length < 6 || confirmNewPass.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        // Validate trùng khớp mật khẩu mới
        if (newPass !== confirmNewPass) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        setLoading(true);
        try {
            // Gọi API đổi mật khẩu, ví dụ:
            // await changePasswordAPI({ currentPass, newPass });
            toast.success("Đổi mật khẩu thành công!", { duration: 5000 });
            setCurrentPass("");
            setNewPass("");
            setConfirmNewPass("");
        } catch (err) {
            console.error(err);
            setError("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ fontFamily: "Poppins, sans-serif" }} className=" flex items-center justify-center mt-6">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl text-blue-600">Đổi mật khẩu</h1>
                    <p className="text-gray-500">Nhập thông tin để đổi mật khẩu của bạn</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600 mb-1">Mật khẩu hiện tại</label>
                        <input
                            value={currentPass}
                            onChange={(e) => setCurrentPass(e.target.value)}
                            type="password"
                            placeholder="Nhập mật khẩu hiện tại"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Mật khẩu mới</label>
                        <input
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Xác nhận mật khẩu mới</label>
                        <input
                            value={confirmNewPass}
                            onChange={(e) => setConfirmNewPass(e.target.value)}
                            type="password"
                            placeholder="Nhập lại mật khẩu mới"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
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
                        ) : (
                            "Đổi mật khẩu"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
