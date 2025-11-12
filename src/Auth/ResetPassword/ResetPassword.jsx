import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PasswordResetForm from './ResetPasswordForm';

const ResetPassword = () => {
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');
    const [valid, setValid] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const t = searchParams.get('token');
        const uid = searchParams.get('uid');
        if (t && uid) {
            setToken(t);
            setUserId(uid);
            setValid(true);
        } else {
            setValid(false);
        }
    }, [searchParams]);

    if (!valid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 font-sans">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">Link không hợp lệ</h2>
                    <p className="text-gray-600">Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 font-sans">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-sans text-gray-900 text-center mb-6">Đặt lại mật khẩu</h2>
                <PasswordResetForm token={token} userId={userId} onSuccess={() => navigate('/login')} />
            </div>
        </div>
    );
};

export default ResetPassword;
