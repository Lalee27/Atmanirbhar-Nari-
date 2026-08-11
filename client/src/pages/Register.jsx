import { useState, useEffect } from 'react';
import { register, googleLogin, verifyEmail, login, resendVerification } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('entrepreneur');
  const [error, setError] = useState('');

  // Registration success state
  const [regSuccess, setRegSuccess] = useState(false);
  const [regEmail, setRegEmail] = useState('');

  // Verification states
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // Simulated Google Sign-In states
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockEmail, setMockEmail] = useState('');
  const [mockName, setMockName] = useState('');
  const [mockError, setMockError] = useState('');
  const [mockLoading, setMockLoading] = useState(false);

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
        document.getElementById('googleSignUpDiv'),
        { theme: 'outline', size: 'large', width: 380, shape: 'rectangular' }
      );
    }
  }, [clientId, isRealGoogleConfigured, role]); // re-render if role changes to send correct role to google

  const handleGoogleCredentialResponse = async (response) => {
    try {
      setError('');
      const { data } = await googleLogin({ 
        idToken: response.credential,
        role: role 
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      redirectUser(data.role);
    } catch (err) {
      console.error('GOOGLE SIGNUP ERROR:', err);
      let detailedError = err.response?.data?.message || err.message || 'Unknown error';
      
      if (err.message === 'Network Error') {
        detailedError = 'Connection blocked. Please disable your Ad-Blocker (like uBlock or Brave Shields) for this site and try again.';
      }
      
      setError(`Google registration failed: ${detailedError}`);
    }
  };

  const redirectUser = (role) => {
    if (role === 'admin') navigate('/admin');
    else if (role === 'entrepreneur') navigate('/dashboard');
    else navigate('/marketplace');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ name, email, password, role });
      setRegEmail(email);
      setRegSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleVerifyAndLogin = async (e) => {
    e.preventDefault();
    setVerificationError('');
    setVerifying(true);
    try {
      await verifyEmail({ email: regEmail, token: verificationCode });
      const { data } = await login({ email: regEmail, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      redirectUser(data.role);
    } catch (err) {
      setVerificationError(err.response?.data?.message || 'Verification or login failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleMockGoogleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!mockEmail) {
      setMockError('Email is required');
      return;
    }
    setMockError('');
    setMockLoading(true);
    try {
      setError('');
      const { data } = await googleLogin({ 
        idToken: 'simulated-google-token',
        email: mockEmail,
        name: mockName,
        role: role 
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setShowMockModal(false);
      redirectUser(data.role);
    } catch (err) {
      setMockError(err.response?.data?.message || 'Simulated Google signup failed');
    } finally {
      setMockLoading(false);
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

        {/* Register Card Container */}
        <div className="relative z-10 w-full max-w-md px-2 md:px-0 animate-fade-in-up">
          <div className="liquid-glass rounded-3xl p-8 md:p-10 shadow-2xl">
          
          <div className="mb-8 text-center">
            <Link to="/" className="text-xl md:text-2xl font-serif tracking-tight text-black mb-2 inline-block hover:opacity-70 transition-opacity">
              Aatmanirbhar Nari
            </Link>
            <p className="text-gray-600 text-sm mt-2">
              Create your account to start your journey.
            </p>
          </div>

          {regSuccess ? (
            <div className="flex flex-col gap-5 py-2 animate-fade-in">
              <div className="text-center mb-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center mx-auto mb-3 animate-bounce">
                  <span className="material-symbols-outlined text-[24px]">verified_user</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Verify Your Email</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  We've sent a 6-digit verification code to <strong className="text-black">{regEmail}</strong>. Enter it below to activate and enter your account.
                </p>
              </div>

              <form onSubmit={handleVerifyAndLogin} className="flex flex-col gap-4">
                {verificationError && (
                  <div className="p-3 bg-rose-500/10 text-rose-800 border border-rose-500/20 rounded-xl text-xs text-center font-semibold">
                    {verificationError}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700 text-center" htmlFor="verificationCode">
                    6-Digit Verification Code
                  </label>
                  <input
                    id="verificationCode"
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-11 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-center tracking-[12px] text-lg font-bold placeholder:text-gray-400 placeholder:tracking-normal text-black shadow-inner"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full h-11 btn-bright font-semibold text-sm rounded-xl transition-all active:scale-95 cursor-pointer mt-2 flex items-center justify-center gap-2"
                >
                  {verifying && <Loader2 size={16} className="animate-spin text-white" />}
                  Verify & Enter Application
                </button>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Didn't receive the code?{' '}
                  <button 
                    type="button"
                    onClick={async () => {
                      try {
                        setVerificationError('');
                        await resendVerification({ email: regEmail });
                        alert('Verification code resent successfully!');
                      } catch (err) {
                        setVerificationError(err.response?.data?.message || 'Failed to resend code.');
                      }
                    }}
                    className="text-black font-bold underline hover:no-underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                </p>
              </form>
            </div>
          ) : (
            <>
              {/* Role Selector */}
              <div className="flex gap-2 mb-6 p-1 bg-black/5 border border-black/10 rounded-xl shadow-inner">
                {[
                  { value: 'entrepreneur', label: 'Entrepreneur', icon: 'storefront' },
                  { value: 'customer', label: 'Customer', icon: 'person' },
                  { value: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      role === r.value
                        ? 'bg-white text-black shadow-md border border-black/5'
                        : 'text-gray-500 hover:text-black hover:bg-black/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                {error && (
                  <div className="p-3 bg-rose-500/10 text-rose-800 border border-rose-500/20 rounded-xl text-sm text-center font-medium">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-800" htmlFor="fullname">
                    Full Name
                  </label>
                  <input
                    id="fullname"
                    className="w-full h-11 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-sm placeholder:text-gray-400 text-black shadow-inner"
                    type="text"
                    placeholder="e.g. Sunita Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-800" htmlFor="reg-email">
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    className="w-full h-11 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-sm placeholder:text-gray-400 text-black shadow-inner"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-800" htmlFor="reg-password">
                    Password
                  </label>
                  <input
                    id="reg-password"
                    className="w-full h-11 px-4 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-sm placeholder:text-gray-400 text-black shadow-inner"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>



                <button
                  type="submit"
                  className="w-full h-11 btn-bright font-semibold text-sm rounded-xl transition-all active:scale-95 cursor-pointer mt-2"
                >
                  Create Account
                </button>

                <div className="relative flex items-center gap-4 my-2">
                  <hr className="flex-1 border-gray-200" />
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">or</span>
                  <hr className="flex-1 border-gray-200" />
                </div>

                {/* Google Sign-in buttons */}
                {isRealGoogleConfigured ? (
                  <div className="w-full flex justify-center">
                    <div id="googleSignUpDiv"></div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMockModal(true)}
                    className="w-full h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all cursor-pointer shadow-sm text-black"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">Continue with Google (Simulated)</span>
                  </button>
                )}

                <p className="text-sm text-gray-500 text-center mt-2">
                  Already have an account?{' '}
                  <Link to="/login" className="text-black font-semibold hover:underline">
                    Log In
                  </Link>
                </p>

                <p className="text-xs text-gray-400 text-center mt-2 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="underline hover:text-black">Terms</Link> and{' '}
                  <Link to="/privacy" className="underline hover:text-black">Privacy</Link>.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Simulated Google Sign-In Modal */}
      {showMockModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-black">
          <div className="liquid-glass rounded-3xl p-8 max-w-sm w-full border border-black/10 shadow-2xl text-left animate-fade-in-up">
            <h3 className="text-lg font-bold text-black mb-1 text-center font-serif">Simulated Google Registration</h3>
            <p className="text-xs text-gray-600 mb-6 text-center leading-relaxed">
              You are registering via Google with the selected role: <strong className="text-black capitalize">{role}</strong>.
            </p>

            <form onSubmit={handleMockGoogleLogin} className="flex flex-col gap-4">
              {mockError && (
                <div className="p-2.5 bg-rose-500/10 text-rose-800 border border-rose-500/20 rounded-xl text-xs text-center font-medium">
                  {mockError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700" htmlFor="mock-reg-email">
                  Google Email Address *
                </label>
                <input
                  id="mock-reg-email"
                  type="email"
                  placeholder="e.g. sunita.sharma@gmail.com"
                  className="w-full h-10 px-3 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-xs placeholder:text-gray-400 text-black shadow-inner"
                  value={mockEmail}
                  onChange={(e) => setMockEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700" htmlFor="mock-reg-name">
                  Display Name (Optional)
                </label>
                <input
                  id="mock-reg-name"
                  type="text"
                  placeholder="e.g. Sunita Sharma"
                  className="w-full h-10 px-3 rounded-xl bg-black/5 border border-black/10 focus:border-black focus:bg-white outline-none transition-all text-xs placeholder:text-gray-400 text-black shadow-inner"
                  value={mockName}
                  onChange={(e) => setMockName(e.target.value)}
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMockModal(false);
                    setMockError('');
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer text-center text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mockLoading}
                  className="flex-1 py-2.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-gray-850 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {mockLoading && <Loader2 size={12} className="animate-spin" />}
                  Confirm Register
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

export default Register;
