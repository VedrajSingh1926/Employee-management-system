import React, { useState } from 'react';
import Header from '../Header';
import CreateTask from '../CreateTask';
import AllTask from '../AllTask';
import CreateEmployee from '../CreateEmployee';
import CurrentEmployees from '../CurrentEmployees';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('createTask');

  const navItems = [
    { id: 'createTask', label: 'Create Task', icon: 'z ' },
    { id: 'addEmployee', label: 'Add Employee', icon: 'dY` ' },
    { id: 'currentEmployees', label: 'Current Employees', icon: 'dY`' },
    { id: 'allTasks', label: 'All Tasks', icon: 'dY"S' }
  ];

  return (
    <div className='flex h-screen w-full bg-black text-slate-300 font-sans overflow-hidden'>
      
      {/* Sidebar - Fixed w-64 */}
      <aside className="w-64 bg-[#0a0c10] border-r border-zinc-850 flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-zinc-850">
            <h1 className="text-xl font-bold text-white tracking-widest uppercase">Admin<span className="text-blue-500">Panel</span></h1>
            <p className="text-xs text-zinc-500 mt-1">System Control</p>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
            {navItems.map(item => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all text-left ${activeTab === item.id ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'}`}
                >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                </button>
            ))}
        </nav>

        <div className="p-6 border-t border-zinc-850">
            <p className="text-xs text-zinc-600 text-center">EMS v2.0 - Midnight</p>
        </div>
      </aside>

      {/* Main Content Panel */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="px-10 pt-8 pb-4 shrink-0">
            <Header />
        </div>
        
        <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
                {activeTab === 'createTask' && <CreateTask />}
                {activeTab === 'addEmployee' && <CreateEmployee />}
                {activeTab === 'currentEmployees' && <CurrentEmployees />}
                {activeTab === 'allTasks' && <AllTask />}
            </div>
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;