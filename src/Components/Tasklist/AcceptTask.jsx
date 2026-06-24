import React, { useState } from 'react';
import { useTask } from '../../Context/TaskContext';
import { Calendar, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const AcceptTask = ({ task }) => {
  const { updateTaskStatus } = useTask();
  const [submittingAction, setSubmittingAction] = useState(null);

  const handleAction = async (newStatus) => {
    setSubmittingAction(newStatus);
    await updateTaskStatus(task.id, newStatus);
    setSubmittingAction(null);
  };

  const isHighPriority = task.priority_level === 'high';
  const borderClass = isHighPriority ? 'border-l-rose-500/80' : 'border-l-blue-500/80';
  const glowClass = isHighPriority ? 'bg-rose-500/10' : 'bg-blue-500/10';

  return (
    <div className={`shrink-0 h-full w-[320px] bg-[#0a0a0a]/80 backdrop-blur-md p-6 rounded-xl border border-zinc-800/50 border-l-[4px] ${borderClass} shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden group`}>
        {/* Subtle background glow */}
        <div className={`absolute top-[-20%] right-[-20%] w-[60%] h-[60%] ${glowClass} blur-[60px] rounded-full pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100`}></div>

        <div className="relative z-10">
            <div className='flex justify-between items-center mb-4'>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-black border border-zinc-800/80 ${isHighPriority ? 'text-rose-400' : 'text-blue-400'}`}>
                    <AlertCircle size={12} />
                    {task.priority_level}
                </span>
                <span className='flex items-center gap-1.5 text-xs text-zinc-400 font-medium'>
                    <Calendar size={12} className="text-zinc-500" />
                    {task.deadline || 'No deadline'}
                </span>
            </div>
            <h2 className='text-lg font-bold text-white mb-3 tracking-tight'>{task.title}</h2>
            <p className='text-sm text-zinc-400 line-clamp-4 leading-relaxed'>{task.description}</p>
        </div>
        
        <div className='mt-6 flex justify-between gap-3 relative z-10'>
            <button 
                onClick={() => handleAction('completed')}
                disabled={submittingAction !== null}
                className={`w-1/2 font-bold py-3 px-2 text-[10px] uppercase tracking-widest rounded-lg transition-all duration-300 flex justify-center items-center gap-1.5 ${submittingAction === 'completed' ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
            >
                {submittingAction === 'completed' ? (
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <><CheckCircle2 size={14} /> Complete</>
                )}
            </button>
            <button 
                onClick={() => handleAction('failed')}
                disabled={submittingAction !== null}
                className={`w-1/2 font-bold py-3 px-2 text-[10px] uppercase tracking-widest rounded-lg transition-all duration-300 flex justify-center items-center gap-1.5 ${submittingAction === 'failed' ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-rose-500/10 border border-rose-500/30 hover:bg-rose-600 hover:text-white hover:border-rose-600 text-rose-500 hover:shadow-[0_0_15px_rgba(225,29,72,0.3)]'}`}
            >
                {submittingAction === 'failed' ? (
                    <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <><XCircle size={14} /> Failed</>
                )}
            </button>
        </div>
    </div>
  );
};

export default AcceptTask;
