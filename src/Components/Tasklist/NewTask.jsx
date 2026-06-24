import React, { useState } from 'react';
import { useTask } from '../../Context/TaskContext';
import { Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

const NewTask = ({ task }) => {
  const { updateTaskStatus } = useTask();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    await updateTaskStatus(task.id, 'accepted');
    setIsSubmitting(false);
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
        
        <div className='mt-6 relative z-10'>
            <button 
                onClick={handleAccept}
                disabled={isSubmitting}
                className={`w-full font-bold py-3 px-4 text-xs uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]'}`}
            >
                {isSubmitting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <CheckCircle2 size={16} />
                        Accept Task
                    </>
                )}
            </button>
        </div>
    </div>
  );
};

export default NewTask;
