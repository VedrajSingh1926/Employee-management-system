import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { Mail, Lock, Shield, UserSquare2, ShieldAlert } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeRole, setActiveRole] = useState('employee');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [proposedPassword, setProposedPassword] = useState('');
    const { login } = useAuth();

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        const { error: loginError } = await login(email, password, activeRole);
        
        if (loginError) {
            setError(loginError.message);
        }
        setLoading(false);
    };

    const submitResetRequestHandler = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const requests = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
        requests.push({
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            email: resetEmail,
            proposedPassword: proposedPassword,
            requestedAt: new Date().toISOString(),
            status: 'pending'
        });
        localStorage.setItem('passwordResetRequests', JSON.stringify(requests));

        setMessage('Password reset request sent! Admin approval is needed.');
        setResetEmail('');
        setProposedPassword('');
        setIsResetMode(false);
        setLoading(false);
    };

    return (
        <div className='flex h-screen w-screen items-center justify-center bg-[#050505] font-sans relative overflow-hidden'>
            {/* Background glowing orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className='w-full max-w-md glass p-10 rounded-3xl shadow-2xl animate-fade-in-up z-10'>
                {!isResetMode ? (
                    <>
                        {/* Role Toggle Switch */}
                        <div className="flex bg-[#0a0a0a] rounded-xl p-1 mb-8 border border-zinc-800/50 shadow-inner">
                            <button 
                                onClick={() => { setActiveRole('employee'); setError(''); setMessage(''); }}
                                className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${activeRole === 'employee' ? 'bg-[#121214] text-blue-400 shadow-md border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <UserSquare2 size={16} />
                                Employee
                            </button>
                            <button 
                                onClick={() => { setActiveRole('admin'); setError(''); setMessage(''); }}
                                className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${activeRole === 'admin' ? 'bg-[#121214] text-indigo-400 shadow-md border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <ShieldAlert size={16} />
                                Admin
                            </button>
                        </div>

                        <form onSubmit={submitHandler}>
                            <div className="mb-8 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                    <Shield className="text-white" size={24} />
                                </div>
                                <h2 className='text-2xl font-bold text-white tracking-tight'>
                                    Employee Management System
                                </h2>
                                <span className="text-xs font-bold text-blue-500 tracking-widest uppercase mt-1.5 block">EMS Portal</span>
                            </div>
                            
                            {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 mb-6 text-sm rounded-xl text-center animate-fade-in-up">{error}</div>}
                            {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 mb-6 text-sm rounded-xl text-center animate-fade-in-up">{message}</div>}

                            <div className="space-y-5 mb-8">
                                <div className="relative">
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email Identity</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="text-zinc-500" size={18} />
                                        </div>
                                        <input 
                                            required 
                                            value={email}
                                            onChange={(e)=>setEmail(e.target.value)}
                                            className='w-full bg-[#0a0a0a] border border-zinc-800 text-white pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-600' 
                                            type="email" 
                                            placeholder="operative@system.com" 
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Security Key</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="text-zinc-500" size={18} />
                                        </div>
                                        <input 
                                            required 
                                            value={password}
                                            onChange={(e)=>setPassword(e.target.value)}
                                            className='w-full bg-[#0a0a0a] border border-zinc-800 text-white pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-600' 
                                            type="password" 
                                            placeholder="Enter your password" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="custom-checkbox focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    />
                                    <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">Remember Me</span>
                                </label>
                                <button 
                                    type="button"
                                    onClick={() => { setIsResetMode(true); setError(''); setMessage(''); }}
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button 
                                disabled={loading}
                                className='w-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold rounded-xl px-4 py-4 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 duration-200'
                            >
                                {loading ? 'Authenticating...' : 'LOG IN'}
                            </button>
                        </form>
                    </>
                ) : (
                    <form onSubmit={submitResetRequestHandler}>
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                <Lock className="text-white" size={24} />
                            </div>
                            <h2 className='text-2xl font-bold text-white tracking-tight'>
                                Reset Security Key
                            </h2>
                            <p className="text-sm text-zinc-400 mt-2">
                                Request a new password. Admin approval required.
                            </p>
                        </div>

                        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 mb-6 text-sm rounded-xl text-center animate-fade-in-up">{error}</div>}
                        {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 mb-6 text-sm rounded-xl text-center animate-fade-in-up">{message}</div>}

                        <div className="space-y-5 mb-8">
                            <div className="relative">
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="text-zinc-500" size={18} />
                                    </div>
                                    <input 
                                        required 
                                        value={resetEmail}
                                        onChange={(e)=>setResetEmail(e.target.value)}
                                        className='w-full bg-[#0a0a0a] border border-zinc-800 text-white pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-zinc-600' 
                                        type="email" 
                                        placeholder="operative@system.com" 
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Proposed New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="text-zinc-500" size={18} />
                                    </div>
                                    <input 
                                        required 
                                        value={proposedPassword}
                                        onChange={(e)=>setProposedPassword(e.target.value)}
                                        className='w-full bg-[#0a0a0a] border border-zinc-800 text-white pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-zinc-600' 
                                        type="password" 
                                        placeholder="Enter new password" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                disabled={loading}
                                className='w-full text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 font-semibold rounded-xl px-4 py-4 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 duration-200'
                            >
                                {loading ? 'Submitting...' : 'SUBMIT RESET REQUEST'}
                            </button>
                            <button 
                                type="button"
                                onClick={() => { setIsResetMode(false); setError(''); setMessage(''); }}
                                className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white font-semibold rounded-xl px-4 py-4 transition-all"
                            >
                                BACK TO LOG IN
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;