import React from 'react';
import { useTask } from '../Context/TaskContext';
import { ListTree, User, Calendar, Tag, AlertCircle } from 'lucide-react';

const AllTask = () => {
    const { tasks, loading } = useTask();

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );

    const getStatusStyle = (status) => {
        switch(status) {
            case 'new': return 'bg-blue-500/10 text-blue-400 border-l-[4px] border-l-blue-500';
            case 'accepted': return 'bg-amber-500/10 text-amber-400 border-l-[4px] border-l-amber-500';
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-l-[4px] border-l-emerald-500';
            case 'failed': return 'bg-rose-500/10 text-rose-400 border-l-[4px] border-l-rose-500';
            default: return 'bg-zinc-800/30 text-zinc-400 border-l-[4px] border-l-zinc-500';
        }
    };

    const getPriorityStyle = (priority) => {
        switch(priority) {
            case 'high': return 'text-rose-400 font-bold';
            case 'medium': return 'text-amber-400 font-bold';
            case 'low': return 'text-emerald-400 font-bold';
            default: return 'text-zinc-500 font-bold';
        }
    };

  return (
    <div className="mt-8 glass p-8 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="mb-10 flex items-center gap-4 relative z-10">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                <ListTree size={24} />
            </div>
            <div>
                <h2 className='text-2xl font-bold text-white tracking-tight'>
                    Global Tasks
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                    System-wide operational matrix
                </p>
            </div>
        </div>
        
        <div className='flex flex-col gap-5 w-full h-[600px] overflow-y-auto pr-2 custom-scrollbar relative z-10' >
            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                    <ListTree size={48} className="mb-4 opacity-20" />
                    <p className="text-sm">No tasks found in the database.</p>
                </div>
            ) : (
                tasks.map(task => {
                    const statusClass = getStatusStyle(task.status);
                    
                    return (
                        <div key={task.id} className={`bg-[#0a0a0a]/80 backdrop-blur-sm p-6 rounded-r-xl border-y border-r border-zinc-800/50 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-r-blue-500/30 hover:border-y-blue-500/30 ${statusClass.split(' ').filter(c => c.startsWith('border-l')).join(' ')}`} >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">{task.title}</h3>
                                    <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 mt-2 uppercase tracking-wider">
                                        <User size={14} className="text-blue-400/70" />
                                        Assigned To: <span className="text-blue-400">{task.profiles?.full_name || task.profiles?.email || 'Unknown'}</span>
                                    </p>
                                </div>
                                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-md capitalize tracking-widest uppercase shadow-inner ${statusClass.replace(/border-l(?:-\[4px\]|-blue-500|-amber-500|-emerald-500|-rose-500|-zinc-500)/g, '')}`}>
                                    {task.status}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-400 mt-4 leading-relaxed bg-[#121214] p-4 rounded-lg border border-zinc-800/50 shadow-inner">
                                {task.description}
                            </p>
                            
                            <div className="flex flex-wrap justify-between items-center text-xs mt-6 pt-4 border-t border-zinc-800/50 uppercase tracking-wider font-semibold gap-4">
                                <div className="flex flex-wrap gap-6">
                                    <span className="flex items-center gap-1.5 text-zinc-500">
                                        <Calendar size={14} className="text-zinc-400" />
                                        Deadline: <span className="text-zinc-300">{task.deadline || 'None'}</span>
                                    </span>
                                    <span className="flex items-center gap-1.5 text-zinc-500">
                                        <Tag size={14} className="text-zinc-400" />
                                        Category: <span className="text-zinc-300">{task.category || 'General'}</span>
                                    </span>
                                </div>
                                <span className="flex items-center gap-1.5 text-zinc-500">
                                    <AlertCircle size={14} className={getPriorityStyle(task.priority_level).split(' ')[0]} />
                                    Priority: <span className={`${getPriorityStyle(task.priority_level)} capitalize`}>{task.priority_level}</span>
                                </span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );
};

export default AllTask;