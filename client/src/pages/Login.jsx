import { useState, useEffect } from 'react';
import { login, googleLogin, resendVerification, sendGoogleOtp, verifyGoogleOtp, forgotPassword, resetPassword } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [googleMsg, setGoogleMsg] = useState('');

  // Forgot Password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotModalEmail, setForgotModalEmail] = useState('');
  const [forgotModalCode, setForgotModalCode] = useState('');
  const [forgotModalNewPassword, setForgotModalNewPassword] = useState('');
  const [forgotModalLoading, setForgotModalLoading] = useState(false);
  const [forgotModalError, setForgotModalError] = useState('');
  const [forgotModalSuccess, setForgotModalSuccess] = useState('');
  
  // Verification states
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('idle'); // idle, loading, success, error
  const [resendMsg, setResendMsg] = useState('');

  // Simulated Google Sign-In states
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockRole, setMockRole] = useState('customer');
  const [mockEmail, setMockEmail] = useState('');
  const [mockName, setMockName] = useState('');
  const [mockError, setMockError] = useState('');
  const [mockLoading, setMockLoading] = useState(false);
  const [mockStep, setMockStep] = useState(1);
  const [mockCode, setMockCode] = useState('');

  const navigate = useNavigate();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isRealGoogleConfigured = clientId && clientId !== 'your-google-client-id-here.apps.googleusercontent.com';

  useEffect(() => {
    // Initialize Google Identity Services if real client ID is configured
    if (window.google && isRealGoogleConfigured) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', width: 380, shape: 'rectangular' }
      );
    }
  }, [clientId, isRealGoogleConfigured]);

  const handleGoogleCredentialResponse = async (response) => {
    try {
      setError('');
      const { data } = await googleLogin({ idToken: response.credential });
      localStorage.setItem('userInfo', JSON.stringify(data));
      redirectUser(data.role);
    } catch (err) {
      console.error('GOOGLE LOGIN ERROR:', err);
      let detailedError = err.response?.data?.message || err.message || 'Unknown error';
      
      // Specifically handle Ad-blocker / Network Error scenarios
      if (err.message === 'Network Error') {
        detailedError = 'Connection blocked. Please disable your Ad-Blocker (like uBlock or Brave Shields) for this site and try again.';
      }
      
      setError(`Google login failed: ${detailedError}`);
    }
  };

  const redirectUser = (role) => {
    if (role === 'admin') navigate('/admin');
    else if (role === 'entrepreneur') navigate('/dashboard');
    else navigate('/marketplace');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setUnverifiedEmail('');
    setResendMsg('');
    try {
      const { data } = await login({ email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      redirectUser(data.role);
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.unverified) {
        setUnverifiedEmail(err.response.data.email || email);
        setError(err.response.data.message || 'Please verify your email before logging in.');
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    }
  };

  const handleResendVerification = async () => {
    setResendStatus('loading');
    setResendMsg('');
    try {
      const { data } = await resendVerification({ email: unverifiedEmail });
      setResendStatus('success');
      setResendMsg(data.message || 'Verification link resent!');
    } catch (err) {
      setResendStatus('error');
      setResendMsg(err.response?.data?.message || 'Failed to resend email.');
    }
  };

  const handleMockGoogleLogin = async (e) => {
    if (e) e.preventDefault();
    
    if (mockStep === 1) {
      if (!mockEmail) {
        setMockError('Email is required');
        return;
      }
      setMockError('');
      setMockLoading(true);
      try {
        await sendGoogleOtp({ email: mockEmail });
        setMockStep(2);
        setMockError('');
      } catch (err) {
        setMockError(err.response?.data?.message || 'Failed to send verification code.');
      } finally {
        setMockLoading(false);
      }
      return;
    }

    if (mockStep === 2) {
      if (!mockCode) {
        setMockError('Verification code is required');
        return;
      }
      setMockError('');
      setMockLoading(true);
      try {
        setError('');
        const { data } = await verifyGoogleOtp({ 
          email: mockEmail,
          token: mockCode 
        });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setShowMockModal(false);
        setMockStep(1);
        setMockCode('');
        redirectUser(data.role);
      } catch (err) {
        setMockError(err.response?.data?.message || 'Verification failed. Please check the code.');
      } finally {
        setMockLoading(false);
      }
    }
  };

  const handleForgotOpen = () => {
    setShowForgotModal(true);
    setForgotStep(1);
    setForgotModalEmail(email);
    setForgotModalCode('');
    setForgotModalNewPassword('');
    setForgotModalError('');
    setForgotModalSuccess('');
  };

  const submitForgot = async (e) => {
    if (e) e.preventDefault();
    if (forgotStep === 1) {
      if (!forgotModalEmail) {
        setForgotModalError('Email is required');
        return;
      }
      setForgotModalError('');
      setForgotModalLoading(true);
      try {
        await forgotPassword({ email: forgotModalEmail });
        setForgotStep(2);
        setForgotModalError('');
      } catch (err) {
        setForgotModalError(err.response?.data?.message || 'Failed to send reset code.');
      } finally {
        setForgotModalLoading(false);
      }
      return;
    }

    if (forgotStep === 2) {
      if (!forgotModalCode || !forgotModalNewPassword) {
        setForgotModalError('Code and new password are required');
        return;
      }
      setForgotModalError('');
      setForgotModalLoading(true);
      try {
        const { data } = await resetPassword({ 
          email: forgotModalEmail,
          token: forgotModalCode,
          newPassword: forgotModalNewPassword
        });
        setForgotModalSuccess(data.message || 'Password reset successfully!');
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStep(1);
          setForgotModalSuccess('');
        }, 2000);
      } catch (err) {
        setForgotModalError(err.response?.data?.message || 'Failed to reset password.');
      } finally {
        setForgotModalLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row bg-[#FAFAFA] font-sans text-black">
      
      {/* Left Column: Image block */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-black select-none">
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-75"
          src="/login_nari_background.png"
          alt="Cinematic background portraying Indian women entrepreneurs"
        />
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
        
        {/* Editorial Text */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-16 text-white space-y-4 font-sans">
          <h2 className="text-5xl font-serif tracking-tight leading-none text-white drop-shadow-sm font-black">Aatmanirbhar Nari</h2>
          <p className="text-gray-300 text-sm max-w-md leading-relaxed font-semibold">
            Empowering women entrepreneurs through direct lead management, active mentorship, and interactive marketplace panels. Join our community of self-reliant enterprises.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-400">Direct business enablement</span>
          </div>
        </div>
      </div>

      {/* Right Column: Form block */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        {/* Hidden Details: Faint Grid Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-20 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Subtle Light Mode Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/55 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-transparent pointer-events-none" />

        {/* Login Card Container */}
        <div className="relative z-10 w-full max-w-lg px-2 md:px-0 animate-fade-in-up">
          <div className="liquid-glass rounded-3xl p-8 md:p-12 shadow-2xl">
          
          <div className="mb-8 text-center">
            <Link to="/" className="text-xl md:text-2xl font-serif tracking-tight text-black mb-2 inline-block hover:opacity-70 transition-opacity">
              Aatmanirbhar Nari
            </Link>
            <p className="text-gray-600 text-sm mt-2">
              Log in to manage your business or discover local services.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 bg-rose-500/10 text-rose-800 border border-rose-500/20 rounded-xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            {unverifiedEmail && (
              <div className="p-3.5 bg-amber-500/10 text-amber-900 border border-amber-500/20 rounded-xl text-xs flex flex-col gap-2">
                <p className="font-semibold">Your email is not verified yet.</p>
                <div className="flex gap-4">
                  <Link 
                    to={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                    className="text-black font-bold underline hover:no-underline"
                  >
                    Enter Verification Code
                  </Link>
                  <button 
                    type="button" 
                    onClick={handleResendVerification}
                    disabled={resendStatus === 'loading'}
                    className="text-black font-semibold underline hover:no-underline text-left cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {resendStatus === 'loading' && <Loader2 size={12} className="animate-spin" />}
                    Resend Code
                  </button>
                </div>
                {resendMsg && (
                  <p className={`text-[10px] mt-1 font-bold ${resendStatus === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {resendMsg}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                className="w-full h-12 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-base placeholder:text-gray-400 text-black shadow-inner"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-800" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotOpen}
                  className="text-xs text-gray-500 hover:text-black transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                className="w-full h-12 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-base placeholder:text-gray-400 text-black shadow-inner"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 btn-bright font-semibold text-base rounded-lg transition-all active:scale-95 cursor-pointer mt-2"
            >
              Log In
            </button>

            <div className="relative flex items-center gap-4 my-2">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">or</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* Google Identity Services / Simulated Button */}
            {isRealGoogleConfigured ? (
              <div className="w-full flex justify-center">
                <div id="googleSignInDiv"></div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowMockModal(true)}
                className="w-full h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all cursor-pointer shadow-sm text-black"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-base font-semibold text-gray-700">Continue with Google</span>
              </button>
            )}

            {googleMsg && (
              <div className="p-2 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg text-xs text-center transition-all">
                {googleMsg}
              </div>
            )}

            <p className="text-sm text-gray-500 text-center mt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-black font-semibold hover:underline">
                Register Now
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Simulated Google Sign-In Dialog Modal */}
      {showMockModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-black">
          <div className="liquid-glass rounded-3xl p-10 max-w-md w-full border border-black/10 shadow-2xl text-left animate-fade-in-up">
            <h3 className="text-xl font-bold text-black mb-2 text-center font-serif">Google Sign-In</h3>
            <p className="text-sm text-gray-600 mb-6 text-center leading-relaxed">
              Connect with your Google account. Please enter your email to continue.
            </p>
            
            <form onSubmit={handleMockGoogleLogin} className="flex flex-col gap-4">
              {mockError && (
                <div className="p-2.5 bg-rose-500/10 text-rose-800 border border-rose-500/20 rounded-xl text-xs text-center font-medium">
                  {mockError}
                </div>
              )}

              {mockStep === 1 ? (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="mock-email">
                    Google Email Address *
                  </label>
                  <input
                    id="mock-email"
                    type="email"
                    placeholder="e.g. sunita.sharma@gmail.com"
                    className="w-full h-12 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-base placeholder:text-gray-400 text-black shadow-inner"
                    value={mockEmail}
                    onChange={(e) => setMockEmail(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="mock-code">
                    Verification Code *
                  </label>
                  <input
                    id="mock-code"
                    type="text"
                    placeholder="Enter code"
                    className="w-full h-12 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-base placeholder:text-gray-400 text-black shadow-inner tracking-widest text-center font-bold"
                    value={mockCode}
                    onChange={(e) => setMockCode(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 text-center mt-1">
                    (Check your email inbox for the code)
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowMockModal(false);
                    setMockError('');
                    setMockStep(1);
                    setMockCode('');
                  }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer text-center text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mockLoading}
                  className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-850 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {mockLoading && <Loader2 size={16} className="animate-spin" />}
                  {mockStep === 1 ? 'Get Code' : 'Verify & Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-black">
          <div className="liquid-glass rounded-3xl p-10 max-w-md w-full border border-black/10 shadow-2xl text-left animate-fade-in-up">
            <h3 className="text-xl font-bold text-black mb-2 text-center font-serif">Reset Password</h3>
            <p className="text-sm text-gray-600 mb-6 text-center leading-relaxed">
              {forgotStep === 1 ? 'Enter your email to receive a password reset code.' : 'Enter the reset code and your new password.'}
            </p>
            
            <form onSubmit={submitForgot} className="flex flex-col gap-4">
              {forgotModalError && (
                <div className="p-2.5 bg-rose-500/10 text-rose-800 border border-rose-500/20 rounded-xl text-xs text-center font-medium">
                  {forgotModalError}
                </div>
              )}
              {forgotModalSuccess && (
                <div className="p-2.5 bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 rounded-xl text-xs text-center font-medium">
                  {forgotModalSuccess}
                </div>
              )}

              {forgotStep === 1 ? (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="forgot-email">
                    Email Address *
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full h-12 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-base placeholder:text-gray-400 text-black shadow-inner"
                    value={forgotModalEmail}
                    onChange={(e) => setForgotModalEmail(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="forgot-code">
                      Reset Code *
                    </label>
                    <input
                      id="forgot-code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      className="w-full h-12 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-base placeholder:text-gray-400 text-black shadow-inner tracking-widest text-center font-bold"
                      value={forgotModalCode}
                      onChange={(e) => setForgotModalCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-sm font-semibold text-gray-700" htmlFor="forgot-password-new">
                      New Password *
                    </label>
                    <input
                      id="forgot-password-new"
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-12 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-base placeholder:text-gray-400 text-black shadow-inner"
                      value={forgotModalNewPassword}
                      onChange={(e) => setForgotModalNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer text-center text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotModalLoading || !!forgotModalSuccess}
                  className="flex-1 py-3 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-850 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {forgotModalLoading && <Loader2 size={16} className="animate-spin" />}
                  {forgotStep === 1 ? 'Send Code' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default Login;
