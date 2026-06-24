import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Sparkles, Code2, Database, ShieldAlert } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    'Establishing secure connection...',
    'Decrypting credentials...',
    'Syncing workspace state...',
    'DevBoost AI is booting up...'
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex bg-dark overflow-hidden relative">
      {/* Background glowing decorations for mobile/tablets */}
      <div className="lg:hidden absolute top-0 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none animate-float-blob"></div>
      <div className="lg:hidden absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none animate-float-blob-reverse"></div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/15 via-dark to-dark-lighter relative overflow-hidden flex-col justify-between p-12 border-r border-white/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[110px] -mr-40 -mt-40 pointer-events-none animate-float-blob"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[110px] -ml-40 -mb-40 pointer-events-none animate-float-blob-reverse"></div>
        
        <div className="relative z-10 animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
          <Link to="/" className="flex items-center gap-3 w-fit group">
            <div className="bg-primary p-2.5 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide group-hover:text-primary transition-colors duration-300">DevBoost AI</span>
          </Link>
          
          <div className="mt-24 space-y-6 max-w-lg">
            <h1 className="text-4xl font-extrabold text-white leading-tight animate-slide-up-fade" style={{ animationDelay: '250ms' }}>
              Supercharge your <br />
              <span className="bg-gradient-to-r from-primary via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Developer Workflow
              </span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed animate-slide-up-fade" style={{ animationDelay: '400ms' }}>
              Join thousands of developers shipping code faster. AI-powered refactoring, debugging, architecture planning, and more—all in one place.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12 max-w-md animate-slide-up-fade" style={{ animationDelay: '550ms' }}>
           <div className="bg-dark/40 backdrop-blur-md p-4 rounded-xl border border-white/5 flex items-center gap-3 hover:border-primary/30 hover:bg-dark/60 transition-all duration-300">
              <Code2 className="text-primary w-5 h-5" />
              <span className="text-sm font-medium text-gray-200">Code Refactoring</span>
           </div>
           <div className="bg-dark/40 backdrop-blur-md p-4 rounded-xl border border-white/5 flex items-center gap-3 hover:border-primary/30 hover:bg-dark/60 transition-all duration-300">
              <ShieldAlert className="text-red-400 w-5 h-5" />
              <span className="text-sm font-medium text-gray-200">Security Scans</span>
           </div>
           <div className="bg-dark/40 backdrop-blur-md p-4 rounded-xl border border-white/5 flex items-center gap-3 hover:border-primary/30 hover:bg-dark/60 transition-all duration-300">
              <Database className="text-green-400 w-5 h-5" />
              <span className="text-sm font-medium text-gray-200">Schema Gen</span>
           </div>
           <div className="bg-dark/40 backdrop-blur-md p-4 rounded-xl border border-white/5 flex items-center gap-3 hover:border-primary/30 hover:bg-dark/60 transition-all duration-300">
              <Sparkles className="text-purple-400 w-5 h-5" />
              <span className="text-sm font-medium text-gray-200">And 8 more tools</span>
           </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-dark/85 backdrop-blur-md flex flex-col items-center justify-center z-50 transition-all duration-300">
            <div className="relative flex items-center justify-center">
              {/* Outer spinning ring */}
              <div className="w-20 h-20 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              
              {/* Inner reverse spinning ring */}
              <div className="absolute w-14 h-14 border-2 border-purple-500/20 border-b-purple-500 rounded-full animate-spin [animation-direction:reverse]"></div>
              
              {/* Glowing center orb */}
              <div className="absolute w-6 h-6 bg-primary rounded-full blur-[4px] animate-pulse"></div>
            </div>
            
            <div className="mt-8 text-center space-y-2 px-6 max-w-xs">
              <h3 className="text-lg font-bold text-white tracking-wide">Authenticating</h3>
              <p className="text-sm text-gray-400 animate-pulse min-h-[40px] leading-relaxed">
                {loadingMessages[loadingStep]}
              </p>
            </div>
          </div>
        )}

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-gray-400">Sign in to continue to DevBoost AI</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center animate-slide-up-fade">
              {error}
            </div>
          )}
          
          <div className="flex justify-center animate-slide-up-fade" style={{ animationDelay: '200ms' }}>
            <div className="hover:scale-[1.02] transition-transform duration-300">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                useOneTap
                theme="filled_black"
                shape="pill"
              />
            </div>
          </div>

          <div className="relative animate-slide-up-fade" style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-slide-up-fade" style={{ animationDelay: '400ms' }}>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-lighter/50 backdrop-blur-sm border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-all duration-300 hover:border-gray-700"
                placeholder="you@example.com"
              />
            </div>
            <div className="animate-slide-up-fade" style={{ animationDelay: '500ms' }}>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-lighter/50 backdrop-blur-sm border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-all duration-300 hover:border-gray-700"
                placeholder="••••••••"
              />
            </div>
            
            <div className="pt-2 animate-slide-up-fade" style={{ animationDelay: '600ms' }}>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/35 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </div>
          </form>
          
          <p className="text-center text-sm text-gray-400 animate-slide-up-fade" style={{ animationDelay: '700ms' }}>
            Don't have an account? <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors duration-300 border-b border-transparent hover:border-primary">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
