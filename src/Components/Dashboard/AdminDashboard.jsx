import React, { useState, useEffect } from 'react';
import Header from '../Header';
import CreateTask from '../CreateTask';
import AllTask from '../AllTask';
import CreateEmployee from '../CreateEmployee';
import CurrentEmployees from '../CurrentEmployees';
import ResetRequests from '../ResetRequests';
import { PlusSquare, UserPlus, Users, LayoutList, KeyRound } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('createTask');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const fetchPendingRequestsCount = () => {
    const stored = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
    const count = stored.filter(req => req.status === 'pending').length;
    setPendingRequestsCount(count);
  };

  useEffect(() => {
    fetchPendingRequestsCount();
    // Poll for requests count every 5 seconds to keep it dynamic
    const interval = setInterval(fetchPendingRequestsCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'createTask', label: 'Create Task', icon: <PlusSquare size={18} /> },
    { id: 'addEmployee', label: 'Add Employee', icon: <UserPlus size={18} /> },
    { id: 'currentEmployees', label: 'Current Employees', icon: <Users size={18} /> },
    { id: 'allTasks', label: 'All Tasks', icon: <LayoutList size={18} /> },
    { 
      id: 'resetRequests', 
      label: 'Reset Requests', 
      icon: <KeyRound size={18} />, 
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null 
    }
  ];

  return (
    <div className='flex h-screen w-full bg-[#050505] text-slate-300 font-sans overflow-hidden relative'>
      {/* Subtle background glow */}
      <div className="absolute top-[20%] left-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Sidebar - Fixed w-64 */}
      <aside className="w-64 glass border-r border-zinc-800/50 flex flex-col h-full shrink-0 z-10">
        <div className="p-8 border-b border-zinc-800/50">
            <h1 className="text-2xl font-black text-white tracking-widest uppercase flex items-center gap-2">
                EMS<span className="text-blue-500">Core</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-2 font-medium tracking-wider">SYSTEM CONTROL</p>
        </div>
        
        <nav className="flex-1 py-8 flex flex-col gap-3 px-6">
            {navItems.map(item => (
                <button 
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      fetchPendingRequestsCount();
                    }}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 text-left group ${activeTab === item.id ? 'bg-gradient-to-r from-blue-600/10 to-transparent text-blue-400 border border-blue-500/20 shadow-[inset_4px_0_0_0_rgba(59,130,246,1)]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 border border-transparent hover:border-zinc-700/50'}`}
                >
                    <div className="flex items-center gap-3">
                        <span className={`transition-transform duration-300 ${activeTab === item.id ? 'transform scale-110' : 'group-hover:scale-110 group-hover:text-blue-400'}`}>
                            {item.icon}
                        </span>
                        {item.label}
                    </div>
                    {item.badge && (
                      <span className="bg-amber-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                </button>
            ))}
        </nav>

        <div className="p-6 border-t border-zinc-800/50">
            <div className="bg-[#0a0a0a] rounded-lg p-3 flex items-center justify-center gap-2 border border-zinc-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                <p className="text-xs text-zinc-500 font-medium">System Online</p>
            </div>
        </div>
      </aside>

      {/* Main Content Panel */}
      <main className="flex-1 flex flex-col h-full overflow-hidden z-10">
        <div className="px-12 pt-10 pb-4 shrink-0">
            <Header />
        </div>
        
        <div className="flex-1 overflow-y-auto px-12 pb-12 custom-scrollbar">
            <div className="max-w-6xl mx-auto animate-fade-in-up">
                {activeTab === 'createTask' && <CreateTask />}
                {activeTab === 'addEmployee' && <CreateEmployee />}
                {activeTab === 'currentEmployees' && <CurrentEmployees />}
                {activeTab === 'allTasks' && <AllTask />}
                {activeTab === 'resetRequests' && <ResetRequests />}
            </div>
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;