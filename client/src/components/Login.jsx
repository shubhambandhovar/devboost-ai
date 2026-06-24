import { useState } from 'react';
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
    <div className="min-h-screen flex bg-dark animate-fade-in">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/20 via-dark to-dark-lighter relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="bg-primary p-2.5 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">DevBoost AI</span>
          </Link>
          
          <div className="mt-24 space-y-6 max-w-lg">
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Supercharge your <br />
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Developer Workflow
              </span>
            </h1>
            <p className="text-lg text-gray-400">
              Join thousands of developers shipping code faster. AI-powered refactoring, debugging, architecture planning, and more—all in one place.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 mt-12 max-w-md">
           <div className="bg-dark/50 backdrop-blur-sm p-4 rounded-xl border border-dark-lighter flex items-center gap-3">
              <Code2 className="text-primary w-5 h-5" />
              <span className="text-sm font-medium text-gray-200">Code Refactoring</span>
           </div>
           <div className="bg-dark/50 backdrop-blur-sm p-4 rounded-xl border border-dark-lighter flex items-center gap-3">
              <ShieldAlert className="text-red-400 w-5 h-5" />
              <span className="text-sm font-medium text-gray-200">Security Scans</span>
           </div>
           <div className="bg-dark/50 backdrop-blur-sm p-4 rounded-xl border border-dark-lighter flex items-center gap-3">
              <Database className="text-green-400 w-5 h-5" />
              <span className="text-sm font-medium text-gray-200">Schema Gen</span>
           </div>
           <div className="bg-dark/50 backdrop-blur-sm p-4 rounded-xl border border-dark-lighter flex items-center gap-3">
              <Sparkles className="text-purple-400 w-5 h-5" />
              <span className="text-sm font-medium text-gray-200">And 8 more tools</span>
           </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to continue to DevBoost AI</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Failed')}
              useOneTap
              theme="filled_black"
              shape="pill"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-lighter"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-lighter border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-lighter border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 transition-colors"
                placeholder="••••••••"
              />
            </div>
            
            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </div>
          </form>
          
          <p className="text-center text-sm text-gray-400">
            Don't have an account? <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
