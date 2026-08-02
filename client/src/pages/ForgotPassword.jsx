import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Code & New Password, 3: Success

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setError('');
      setSuccess('Reset code sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code || !newPassword) {
      setError('Code and new password are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await resetPassword({
        email,
        token: code,
        newPassword
      });
      setSuccess(data.message || 'Password reset successfully!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-black/5 p-8 animate-fade-in-up">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <h1 className="text-2xl font-bold font-sans text-primary flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[28px]">handshake</span>
              Aatmanirbhar Nari
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-500 mt-2">
            {step === 1 ? 'Enter your email to receive a reset code.' : step === 2 ? 'Enter the reset code and your new password.' : 'Password reset successful.'}
          </p>
        </div>

        {error && <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm border border-error/20">{error}</div>}
        {success && step !== 3 && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm border border-green-200">{success}</div>}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-70 transition-all text-sm"
            >
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </button>
            <div className="text-center">
              <Link to="/login" className="text-primary text-sm font-semibold hover:underline">Back to Login</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Reset Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-70 transition-all text-sm"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-[40px]">check_circle</span>
            </div>
            <p className="text-gray-600 font-medium">Your password has been reset successfully. You can now login with your new password.</p>
            <Link to="/login" className="block w-full btn-primary py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm">
              Login to Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
