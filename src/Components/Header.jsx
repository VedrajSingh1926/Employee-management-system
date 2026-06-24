import React from 'react';
import { useAuth } from '../Context/AuthContext';
import { LogOut, UserCircle2 } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className='mb-10 flex items-center justify-between glass p-6 rounded-2xl'>
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <UserCircle2 size={24} className="text-white" />
            </div>
            <div>
                <h1 className='text-xs font-semibold text-zinc-400 mb-0.5 tracking-wider uppercase'>
                    System Operator
                </h1> 
                <h2 className='text-2xl font-bold text-white tracking-tight'>
                    {user?.user_metadata?.full_name || user?.email || 'User'}
                </h2>
            </div>
        </div>
        <button 
            onClick={handleLogout} 
            className='flex items-center gap-2 bg-[#121214] hover:bg-rose-500/10 text-zinc-300 hover:text-rose-500 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-zinc-800 hover:border-rose-500/30 shadow-sm'
        >
            <LogOut size={16} />
            Disconnect
        </button>
    </div>
  );
};

export default Header;