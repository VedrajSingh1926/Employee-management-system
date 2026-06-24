import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { UserPlus, Mail, Lock, UserCircle } from 'lucide-react';

const CreateEmployee = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { registerEmployee } = useAuth();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await registerEmployee(email, password, fullName);

        if (error) {
            setMessage(`ERROR: ${error.message}`);
        } else {
            setMessage('SUCCESS: Operative successfully integrated into the system.');
            setFullName('');
            setEmail('');
            setPassword('');
        }
        
        setLoading(false);
    };

    return (
        <div className='glass p-8 rounded-2xl mt-8 shadow-xl relative overflow-hidden'>
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="mb-10 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                    <UserPlus size={24} />
                </div>
                <div>
                    <h2 className='text-2xl font-bold text-white tracking-tight'>
                        Onboard Operative
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">
                        Register a new employee identity into the system
                    </p>
                </div>
            </div>

            {message && (
                <div className={`px-5 py-4 mb-8 text-sm rounded-xl border flex items-center gap-3 animate-fade-in-up ${message.startsWith('ERROR') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={submitHandler} className='max-w-2xl space-y-6 relative z-10'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider'>Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500"><UserCircle size={18} /></div>
                            <input 
                                required 
                                value={fullName}
                                onChange={(e)=>setFullName(e.target.value)}
                                className='w-full bg-[#0a0a0a] border border-zinc-800 text-white pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-600' 
                                type="text" 
                                placeholder="Operative Name" 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider'>Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500"><Mail size={18} /></div>
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
                </div>
                
                <div className="space-y-2">
                    <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider'>Temporary Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500"><Lock size={18} /></div>
                        <input 
                            required 
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            className='w-full bg-[#0a0a0a] border border-zinc-800 text-white pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-600' 
                            type="password" 
                            placeholder="Security Key" 
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/50">
                    <button 
                        disabled={loading}
                        className='bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] disabled:opacity-50 flex items-center justify-center gap-2'
                    >
                        {loading ? 'Processing...' : 'Register Identity'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEmployee;
