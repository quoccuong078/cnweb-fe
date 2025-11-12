import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetForm = ({ token, userId, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Mật khẩu phải ít nhất 8 ký tự.');
            return;
        }
        if (password !== confirm) {
            setError('Xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
                userId,
                token,
                newPassword: password,
            });
            onSuccess();
        } catch (err) {
            console.error(err);
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mật khẩu mới
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className="mt-1 block w-full px-5 py-4 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu
                </label>
                <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    className="mt-1 block w-full px-5 py-4 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-5 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50"
            >
                {loading ? 'Đang xử lý…' : 'Đặt lại mật khẩu'}
            </button>
        </form>
    );
};

export default PasswordResetForm;
