import React from 'react';
import { useTask } from '../Context/TaskContext';

const AllTask = () => {
    const { tasks, loading } = useTask();

    if (loading) return <div className="text-blue-500 mt-8 text-sm font-bold uppercase tracking-wider">Loading tasks...</div>;

    const getStatusStyle = (status) => {
        switch(status) {
            case 'new': return 'bg-blue-500/10 text-blue-400 border-l-[3px] border-l-blue-500';
            case 'accepted': return 'bg-amber-500/10 text-amber-400 border-l-[3px] border-l-amber-500';
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-l-[3px] border-l-emerald-500';
            case 'failed': return 'bg-red-500/10 text-red-400 border-l-[3px] border-l-red-500';
            default: return 'bg-zinc-800 text-zinc-400 border-l-[3px] border-l-zinc-500';
        }
    };

    const getPriorityStyle = (priority) => {
        switch(priority) {
            case 'high': return 'text-red-500 font-bold';
            case 'medium': return 'text-amber-500 font-bold';
            case 'low': return 'text-emerald-500 font-bold';
            default: return 'text-zinc-500 font-bold';
        }
    };

  return (
    <div className="mt-8 bg-[#0a0c10] border border-zinc-850 p-8 rounded-xl shadow-lg shadow-blue-500/5">
        <div className="mb-8 border-l-4 border-blue-600 pl-4">
            <h2 className='text-xl font-bold text-white uppercase tracking-wider'>
                All Tasks
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
                Global operational matrix
            </p>
        </div>
        
        <div className='flex flex-col gap-4 w-full h-[600px] overflow-y-auto pr-2 custom-scrollbar' >
            {tasks.length === 0 ? (
                <p className="text-zinc-500 text-sm">No tasks found.</p>
            ) : (
                tasks.map(task => {
                    const statusClass = getStatusStyle(task.status);
                    
                    return (
                        <div key={task.id} className={`bg-black p-6 rounded-r-lg border-y border-r border-zinc-850 shadow-sm transition-all hover:border-r-blue-500/30 hover:border-y-blue-500/30 ${statusClass.split(' ').filter(c => c.startsWith('border-l')).join(' ')}`} >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{task.title}</h3>
                                    <p className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-wider">
                                        Assigned To: <span className="text-blue-400">{task.profiles?.full_name || task.profiles?.email || 'Unknown'}</span>
                                    </p>
                                </div>
                                <span className={`text-[10px] font-bold px-3 py-1 rounded capitalize tracking-widest uppercase ${statusClass.replace(/border-l(?:-\[3px\]|-blue-500|-amber-500|-emerald-500|-red-500|-zinc-500)/g, '')}`}>
                                    {task.status}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">{task.description}</p>
                            
                            <div className="flex justify-between items-center text-xs mt-6 pt-4 border-t border-zinc-850 uppercase tracking-wider font-bold">
                                <div className="flex gap-6">
                                    <span className="text-zinc-600">Deadline: <span className="text-zinc-400">{task.deadline || 'None'}</span></span>
                                    <span className="text-zinc-600">Category: <span className="text-zinc-400">{task.category || 'General'}</span></span>
                                </div>
                                <span className="text-zinc-600">Priority: <span className={`${getPriorityStyle(task.priority_level)} capitalize`}>{task.priority_level}</span></span>
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