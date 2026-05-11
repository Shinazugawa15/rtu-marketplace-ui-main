import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Auth({ setUser }: { setUser: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/marketplace');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2rem] shadow-2xl shadow-primary/5 overflow-hidden border border-gray-100">
        
        {/* Left Side: Illustration / Branding */}
        <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-white relative overflow-hidden border-r-8 border-secondary">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-primary rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl leading-tight uppercase tracking-tight text-white">RTU Marketplace</span>
                <span className="text-xs uppercase text-secondary font-semibold tracking-widest">Campus Community Hub</span>
              </div>
            </div>
            <h2 className="text-5xl font-black leading-[0.9] tracking-tighter pt-8">
              JOIN THE <span className="text-secondary">ELITE</span> CAMPUS TRADE.
            </h2>
            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                <ShieldCheck className="w-6 h-6 text-secondary" />
                <p className="text-sm">Verified student community only.</p>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                <Mail className="w-6 h-6 text-secondary" />
                <p className="text-sm">Safe campus meet-ups via chat.</p>
              </div>
            </div>
          </div>
          <div className="relative z-10 pt-12">
            <p className="text-blue-200 text-sm italic">"I sold all my old textbooks in 2 days. The RTU Marketplace actually works!"</p>
            <p className="text-white font-bold mt-2">— Mark, CEAT Student</p>
          </div>
          
          {/* Background Design */}
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
             <div className="absolute -top-20 -right-20 w-96 h-96 bg-secondary rounded-full blur-[100px]" />
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400 rounded-full blur-[80px]" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-16">
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">{isLogin ? 'Welcome Back!' : 'Join the Community'}</h2>
              <p className="text-gray-500 mt-2">{isLogin ? 'Login to your account' : 'Register with your student email'}</p>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
              <button 
                onClick={() => setIsLogin(true)}
                className={cn("flex-grow py-2.5 rounded-xl font-bold transition-all", isLogin ? "bg-white shadow-sm text-primary" : "text-gray-400")}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={cn("flex-grow py-2.5 rounded-xl font-bold transition-all", !isLogin ? "bg-white shadow-sm text-primary" : "text-gray-400")}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-1.5"
                  >
                    <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        required={!isLogin}
                        placeholder="John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    required 
                    placeholder="student@rtu.edu.ph"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <p className="text-[10px] text-gray-400 ml-1">Preferred: @rtu.edu.ph email address</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-gray-700">Password</label>
                  {isLogin && <button type="button" className="text-xs text-primary font-bold hover:underline">Forgot?</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 italic">
                  ⚠️ {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-secondary font-extrabold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm">
              By continuing, you agree to our <button className="text-primary font-bold">Terms of Service</button> and <button className="text-primary font-bold">Community Guidelines</button>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
