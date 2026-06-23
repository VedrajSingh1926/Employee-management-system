import React from 'react';
import { useTask } from '../Context/TaskContext';

const TasklistNumber = () => {
  const { tasks } = useTask();

  const newTasks = tasks.filter(t => t.status === 'new').length;
  const acceptedTasks = tasks.filter(t => t.status === 'accepted').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const failedTasks = tasks.filter(t => t.status === 'failed').length;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-10 gap-6'>
        <div className='py-6 px-8 bg-[#0a0c10] border border-zinc-850 rounded-xl shadow-lg shadow-blue-500/5 relative overflow-hidden'>
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
            <h2 className='text-4xl font-black text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'>{newTasks}</h2>
            <h3 className='text-xs font-bold uppercase tracking-wider text-zinc-500 mt-2'>New Tasks</h3>
        </div>
        <div className='py-6 px-8 bg-[#0a0c10] border border-zinc-850 rounded-xl shadow-lg shadow-amber-500/5 relative overflow-hidden'>
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]"></div>
            <h2 className='text-4xl font-black text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'>{acceptedTasks}</h2>
            <h3 className='text-xs font-bold uppercase tracking-wider text-zinc-500 mt-2'>Accepted</h3>
        </div>
        <div className='py-6 px-8 bg-[#0a0c10] border border-zinc-850 rounded-xl shadow-lg shadow-emerald-500/5 relative overflow-hidden'>
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
            <h2 className='text-4xl font-black text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'>{completedTasks}</h2>
            <h3 className='text-xs font-bold uppercase tracking-wider text-zinc-500 mt-2'>Completed</h3>
        </div>
        <div className='py-6 px-8 bg-[#0a0c10] border border-zinc-850 rounded-xl shadow-lg shadow-red-500/5 relative overflow-hidden'>
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
            <h2 className='text-4xl font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'>{failedTasks}</h2>
            <h3 className='text-xs font-bold uppercase tracking-wider text-zinc-500 mt-2'>Failed</h3>
        </div>
    </div>
  );
};

export default TasklistNumber;