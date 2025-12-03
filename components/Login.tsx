
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Activity, Smartphone } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050507]">
       {/* Ambient Background */}
       <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
       </div>

       <div className="w-full max-w-md p-6 relative z-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] mb-4 animate-float">
                <Activity size={32} />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
                Nexus<span className="font-light text-purple-400">Trader</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">Enterprise Orchestration Layer</p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase pl-1">Work Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0a0a0e]/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-gray-600"
                            placeholder="name@company.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase pl-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0a0a0e]/60 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-gray-600 font-mono"
                            placeholder="••••••••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Authenticating...</span>
                        </div>
                    ) : (
                        <>
                            <span>Sign In</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
             </form>

             <div className="my-8 flex items-center gap-4">
                <div className="h-px bg-white/5 flex-1"></div>
                <span className="text-xs text-gray-500 uppercase font-bold">Or continue with</span>
                <div className="h-px bg-white/5 flex-1"></div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-sm font-bold text-gray-300">
                     <ShieldCheck size={18} />
                     <span>SSO</span>
                 </button>
                 <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-sm font-bold text-gray-300">
                     <Smartphone size={18} className="text-green-500" />
                     <span>M-PESA Auth</span>
                 </button>
             </div>
          </div>
          
          <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                  <Lock size={12} />
                  <span>256-bit End-to-End Encryption</span>
              </p>
          </div>
       </div>
    </div>
  );
};

export default Login;
