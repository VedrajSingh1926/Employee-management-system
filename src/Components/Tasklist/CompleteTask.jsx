import React from 'react';

const CompleteTask = ({ task }) => {
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
        <div className='mt-6'>
            <button className='w-full font-bold py-3 px-4 text-xs uppercase tracking-wider rounded-lg transition-colors bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default' disabled>
                Completed
            </button>
        </div>
    </div>
  );
};

export default CompleteTask;
