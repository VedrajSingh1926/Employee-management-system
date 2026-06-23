import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { supabase } from '../../utils/supabaseClient';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeRole, setActiveRole] = useState('employee');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
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

    const handleResetPassword = async () => {
        if (!email) {
            setError('Please enter your email address to reset password.');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) {
            setError(error.message);
        } else {
            setMessage('Password reset link sent to your email.');
            setError('');
        }
        setLoading(false);
    };

    return (
        <div className='flex h-screen w-screen items-center justify-center bg-black font-sans'>
            <div className='w-full max-w-md bg-[#0a0c10] border border-zinc-850 p-10 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.05)]'>
                
                {/* Role Toggle Switch */}
                <div className="flex bg-black rounded-lg p-1 mb-8 border border-zinc-850">
                    <button 
                        onClick={() => { setActiveRole('employee'); setError(''); setMessage(''); }}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${activeRole === 'employee' ? 'bg-[#0a0c10] text-blue-500 shadow-sm border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Employee Portal
                    </button>
                    <button 
                        onClick={() => { setActiveRole('admin'); setError(''); setMessage(''); }}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${activeRole === 'admin' ? 'bg-[#0a0c10] text-rose-500 shadow-sm border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Admin Control
                    </button>
                </div>

                <form onSubmit={submitHandler}>
                    <div className="mb-8 text-center">
                        <h2 className='text-2xl font-bold text-white tracking-tight'>
                            System Authentication
                        </h2>
                        <p className="text-sm text-zinc-500 mt-2">
                            Enter credentials for {activeRole} access
                        </p>
                    </div>
                    
                    {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 mb-6 text-sm rounded-lg text-center">{error}</div>}
                    {message && <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 mb-6 text-sm rounded-lg text-center">{message}</div>}

                    <div className="space-y-5 mb-8">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email Identity</label>
                            <input 
                                required 
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                className='w-full bg-black border border-zinc-850 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700' 
                                type="email" 
                                placeholder="Enter system email" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Security Key</label>
                            <input 
                                required 
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                className='w-full bg-black border border-zinc-850 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700' 
                                type="password" 
                                placeholder="Enter password" 
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-zinc-800 bg-black text-blue-500 focus:ring-blue-500 focus:ring-offset-black"
                            />
                            <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">Remember Me</span>
                        </label>
                        <button 
                            type="button"
                            onClick={handleResetPassword}
                            className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button 
                        disabled={loading}
                        className='w-full text-white bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg px-4 py-3 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Authenticating...' : 'INITIALIZE SESSION'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;