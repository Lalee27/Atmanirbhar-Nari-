import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail, resendVerification } from '../services/api';
import { CheckCircle, Loader2, Mail, ShieldCheck } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const urlEmail = searchParams.get('email') || '';
  const urlToken = searchParams.get('token') || '';

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(urlEmail);
  const [code, setCode] = useState(urlToken);

  const [resendStatus, setResendStatus] = useState('idle'); // idle, loading, success, error
  const [resendMsg, setResendMsg] = useState('');

  useEffect(() => {
    if (urlEmail && urlToken) {
      const autoVerify = async () => {
        setStatus('loading');
        try {
          const { data } = await verifyEmail({ email: urlEmail, token: urlToken });
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } catch (err) {
          setStatus('error');
          setMessage(err.response?.data?.message || 'Invalid or expired verification code.');
        }
      };
      autoVerify();
    }
  }, [urlEmail, urlToken]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim() || !code.trim()) {
      setMessage('Please enter both your email address and verification code.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const { data } = await verifyEmail({ email: email.trim(), token: code.trim() });
      setStatus('success');
      setMessage(data.message || 'Email verified successfully!');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Invalid or expired verification code.');
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setResendMsg('Please enter your email address first.');
      setResendStatus('error');
      return;
    }

    setResendStatus('loading');
    setResendMsg('');

    try {
      const { data } = await resendVerification({ email: email.trim() });
      setResendStatus('success');
      setResendMsg(data.message || 'Verification code resent!');
    } catch (err) {
      setResendStatus('error');
      setResendMsg(err.response?.data?.message || 'Failed to resend verification code.');
    }
  };

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden font-sans text-black py-16">
      
      {/* Subtle background graphics */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in-up">
        <div className="liquid-glass rounded-3xl p-8 md:p-10 shadow-2xl text-center">
          
          <Link to="/" className="text-xl md:text-2xl font-serif tracking-tight text-black mb-6 inline-block hover:opacity-70 transition-opacity">
            Aatmanirbhar Nari
          </Link>

          {status === 'loading' && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="animate-spin text-black mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Verifying your email...</h3>
              <p className="text-gray-500 text-sm">Please hold on while we process your request.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center py-6 animate-fade-in">
              <CheckCircle className="text-emerald-600 mb-4" size={56} />
              <h3 className="text-xl font-semibold mb-2">Success!</h3>
              <p className="text-gray-600 text-sm mb-6">{message}</p>
              <Link
                to="/login"
                className="w-full h-11 btn-bright font-semibold text-sm rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              >
                Go to Login
              </Link>
            </div>
          )}

          {(status === 'idle' || status === 'error') && (
            <div className="text-left animate-fade-in">
              <div className="text-center mb-6">
                <ShieldCheck size={36} className="mx-auto mb-2 text-gray-700" />
                <h3 className="text-lg font-bold">Email Verification</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Enter the 6-digit verification code sent to your email address to activate your account.
                </p>
              </div>

              {status === 'error' && message && (
                <div className="p-3 mb-4 bg-rose-500/10 text-rose-800 border border-rose-500/20 rounded-xl text-xs text-center font-semibold">
                  {message}
                </div>
              )}

              <form onSubmit={handleVerify} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700" htmlFor="verify-email">
                    Email Address
                  </label>
                  <input
                    id="verify-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-sm placeholder:text-gray-400 text-black shadow-inner"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700" htmlFor="verify-code">
                    6-Digit Verification Code
                  </label>
                  <input
                    id="verify-code"
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-11 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-center tracking-[12px] text-lg font-bold placeholder:text-gray-400 placeholder:tracking-normal text-black shadow-inner"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 btn-bright font-semibold text-sm rounded-xl transition-all active:scale-95 cursor-pointer mt-2"
                >
                  Verify Account
                </button>
              </form>

              <hr className="my-6 border-gray-200" />

              <div>
                <h4 className="text-xs font-bold text-gray-700 mb-2">
                  Didn't receive the code?
                </h4>
                <form onSubmit={handleResend} className="flex gap-2">
                  <button
                    type="submit"
                    disabled={resendStatus === 'loading'}
                    className="flex-1 h-10 border border-gray-200 text-black font-semibold text-xs rounded-xl hover:bg-gray-50 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {resendStatus === 'loading' ? (
                      <Loader2 className="animate-spin" size={12} />
                    ) : (
                      <Mail size={12} />
                    )}
                    Resend Code
                  </button>
                </form>
                
                {resendMsg && (
                  <div className={`p-2.5 mt-2 rounded-xl text-[11px] font-semibold text-center border ${
                    resendStatus === 'success' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {resendMsg}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 text-xs text-gray-500">
            Need help? <Link to="/support" className="underline hover:text-black">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
