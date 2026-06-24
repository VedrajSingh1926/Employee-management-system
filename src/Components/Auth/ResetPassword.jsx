import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if there is an active session or recovery token in URL
        // Supabase automatically handles parsing the hash if properly configured
        supabase.auth.onAuthStateChange(async (event) => {
            if (event === "PASSWORD_RECOVERY") {
                setMessage("Please enter your new password.");
            }
        });
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Password successfully updated! You can now log in.');
            setPassword('');
        }
        setLoading(false);
    };

    return (
        <div className='flex h-screen w-screen items-center justify-center bg-black font-sans'>
            <div className='w-full max-w-md bg-[#0a0c10] border border-zinc-850 p-10 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.05)]'>
                <form onSubmit={submitHandler}>
                    <div className="mb-8 text-center">
                        <h2 className='text-2xl font-bold text-white tracking-tight'>
                            Reset Security Key
                        </h2>
                        <p className="text-sm text-zinc-500 mt-2">
                            Enter a new password for your account
                        </p>
                    </div>
                    
                    {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 mb-6 text-sm rounded-lg text-center">{error}</div>}
                    {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 mb-6 text-sm rounded-lg text-center">{message}</div>}

                    <div className="space-y-5 mb-8">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">New Password</label>
                            <input 
                                required 
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                className='w-full bg-black border border-zinc-850 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700' 
                                type="password" 
                                placeholder="Enter new password" 
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className='w-full text-white bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg px-4 py-3 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Updating...' : 'UPDATE PASSWORD'}
                    </button>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                            Return to Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
