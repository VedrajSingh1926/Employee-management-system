import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

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
        <div className='bg-[#0a0c10] border border-zinc-850 p-8 rounded-xl mt-8 shadow-[0_0_30px_rgba(37,99,235,0.03)]'>
            <div className="mb-8 border-l-4 border-blue-600 pl-4">
                <h2 className='text-xl font-bold text-white uppercase tracking-wider'>
                    Onboard Operative
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                    Register a new employee identity into the system
                </p>
            </div>

            {message && (
                <div className={`px-4 py-3 mb-6 text-sm rounded-lg border ${message.startsWith('ERROR') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={submitHandler} className='max-w-xl mx-auto space-y-5'>
                <div>
                    <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2'>Full Name</label>
                    <input 
                        required 
                        value={fullName}
                        onChange={(e)=>setFullName(e.target.value)}
                        className='w-full bg-black border border-zinc-850 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700' 
                        type="text" 
                        placeholder="Operative Name" 
                    />
                </div>
                <div>
                    <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2'>Email Address</label>
                    <input 
                        required 
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className='w-full bg-black border border-zinc-850 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700' 
                        type="email" 
                        placeholder="operative@system.com" 
                    />
                </div>
                <div>
                    <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2'>Temporary Password</label>
                    <input 
                        required 
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className='w-full bg-black border border-zinc-850 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700' 
                        type="password" 
                        placeholder="Security Key" 
                    />
                </div>

                <button 
                    disabled={loading}
                    className='w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white px-5 py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-50'
                >
                    {loading ? 'Processing...' : 'Register Identity'}
                </button>
            </form>
        </div>
    );
};

export default CreateEmployee;
