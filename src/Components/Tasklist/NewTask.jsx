import React, { useState } from 'react';
import { useTask } from '../../Context/TaskContext';

const NewTask = ({ task }) => {
  const { updateTaskStatus } = useTask();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    await updateTaskStatus(task.id, 'accepted');
    setIsSubmitting(false);
  };

  const isHighPriority = task.priority_level === 'high';
  const borderClass = isHighPriority ? 'border-l-red-500' : 'border-l-blue-500';
  const shadowClass = isHighPriority ? 'shadow-red-500/10' : 'shadow-blue-500/10';

  return (
    <div className={`shrink-0 h-full w-[300px] bg-[#0a0c10] p-6 rounded-r-xl border-y border-r border-zinc-850 border-l-[3px] ${borderClass} shadow-lg ${shadowClass} flex flex-col justify-between transition-all hover:border-y-zinc-700 hover:border-r-zinc-700`}>
        <div>
            <div className='flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-4'>
                <span className={`px-2 py-1 rounded bg-black border border-zinc-800 ${isHighPriority ? 'text-red-500' : 'text-blue-500'}`}>
                    {task.priority_level} Priority
                </span>
                <span className='text-zinc-500'>{task.deadline || 'No deadline'}</span>
            </div>
            <h2 className='text-lg font-bold text-white mb-2 leading-tight'>{task.title}</h2>
            <p className='text-sm text-zinc-400 line-clamp-3 leading-relaxed'>{task.description}</p>
        </div>
        <div className='mt-6 flex justify-between'>
            <button 
                onClick={handleAccept}
                disabled={isSubmitting}
                className={`w-full font-bold py-3 px-4 text-xs uppercase tracking-wider rounded-lg transition-all ${isSubmitting ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                    </span>
                ) : 'Accept Task'}
            </button>
        </div>
    </div>
  );
};

export default NewTask;
