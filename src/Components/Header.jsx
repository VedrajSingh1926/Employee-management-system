import React from 'react';
import { useAuth } from '../Context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className='mb-10 flex items-center justify-between'>
        <div>
            <h1 className='text-sm font-medium text-slate-500 mb-1'>
                Hello, 
            </h1> 
            <h2 className='text-3xl font-bold text-slate-100'>
                {user?.user_metadata?.full_name || user?.email || 'User'} 👋
            </h2>
        </div>
        <button 
            onClick={handleLogout} 
            className='bg-[#1f2026] hover:bg-[#2a2b33] text-slate-300 font-medium py-2.5 px-6 rounded-xl transition-all border border-[#2a2b33]'
        >
            Log Out
        </button>
    </div>
  );
};

export default Header;