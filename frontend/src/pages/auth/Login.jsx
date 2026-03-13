import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [remember,    setRemember]    = useState(false);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const fillDemo = (type) => {
    setEmail(type === 'doctor' ? 'doctor@demo.com' : 'receptionist@demo.com');
    setPassword('demo123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      // Route based on role from demo profile or Firestore
      const role = result?.profile?.role || result?.user?.role;
      setTimeout(() => {
        navigate(role === 'doctor' ? '/app/doctor' : '/app/dashboard');
      }, 300);
    } catch (err) {
      const msgs = {
        'auth/invalid-credential':  'Invalid email or password.',
        'auth/user-not-found':      'No account found with this email.',
        'auth/wrong-password':      'Incorrect password.',
        'auth/too-many-requests':   'Too many attempts. Please try again later.',
      };
      setError(msgs[err.code] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">

          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white px-6 md:px-10 py-3">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
                <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
              </div>
              <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">ClinicFlow</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center justify-center rounded-lg h-10 bg-slate-100 text-slate-900 px-3 hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined text-[20px]">shield_lock</span>
              </button>
            </div>
          </header>

          {/* Main */}
          <main className="flex flex-1 items-center justify-center p-4">
            <div className="flex flex-col max-w-[480px] w-full bg-white shadow-xl rounded-xl overflow-hidden border border-slate-100 animate-fade-in">

              {/* Cover image strip */}
              <div
                className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end min-h-[180px] relative"
                style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <span className="material-symbols-outlined text-[64px] opacity-30">local_hospital</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
              </div>

              {/* Form */}
              <div className="px-8 pb-10 pt-4 flex flex-col gap-1">
                <h2 className="text-slate-900 tracking-tight text-3xl font-bold leading-tight text-center">Welcome Back</h2>
                <p className="text-slate-500 text-sm font-normal leading-normal text-center mb-6">
                  Access your secure healthcare dashboard
                </p>

                {/* Demo credentials banner */}
                <div className="mb-4 p-3.5 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">🚀 Demo Accounts</p>
                  <div className="flex flex-col gap-1.5">
                    <button type="button" onClick={() => fillDemo('receptionist')}
                      className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg bg-white border border-primary/20 hover:border-primary hover:bg-primary/5 transition-all">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Receptionist</p>
                        <p className="text-[11px] text-slate-400 font-mono">receptionist@demo.com / demo123</p>
                      </div>
                      <span className="material-symbols-outlined text-primary text-[16px]">arrow_forward</span>
                    </button>
                    <button type="button" onClick={() => fillDemo('doctor')}
                      className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg bg-white border border-primary/20 hover:border-primary hover:bg-primary/5 transition-all">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Doctor</p>
                        <p className="text-[11px] text-slate-400 font-mono">doctor@demo.com / demo123</p>
                      </div>
                      <span className="material-symbols-outlined text-primary text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-red-500">error</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-700 text-sm font-semibold">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="dr.smith@clinicflow.com"
                        className="form-input flex w-full rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary h-12 pl-10 pr-4 placeholder:text-slate-400 text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-700 text-sm font-semibold">Password</label>
                      <a href="#" className="text-primary text-xs font-medium hover:underline">Forgot password?</a>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="form-input flex w-full rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary h-12 pl-10 pr-12 placeholder:text-slate-400 text-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPass ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Remember */}
                  <div className="flex items-center gap-2 py-1">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="remember" className="text-slate-600 text-sm select-none cursor-pointer">
                      Keep me signed in
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                          <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <span className="material-symbols-outlined text-[18px]">login</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Footer divider */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
                  <p className="text-slate-500 text-xs text-center">
                    Use biometric login for faster access on mobile devices
                  </p>
                  <div className="flex gap-4">
                    <div className="size-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">fingerprint</span>
                    </div>
                    <div className="size-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">face</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="py-6 px-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-xs">© 2024 ClinicFlow Healthcare Solutions. All rights reserved.</p>
            <div className="flex gap-6 text-slate-400 text-xs font-medium">
              <a href="#" className="hover:text-primary transition-colors">HIPAA Compliance</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default Login;
