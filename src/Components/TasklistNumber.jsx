import React from 'react';
import { useTask } from '../Context/TaskContext';
import { FilePlus2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const TasklistNumber = () => {
  const { tasks } = useTask();

  const newTasks = tasks.filter(t => t.status === 'new').length;
  const acceptedTasks = tasks.filter(t => t.status === 'accepted').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const failedTasks = tasks.filter(t => t.status === 'failed').length;

  const cards = [
    { title: 'New Tasks', count: newTasks, icon: <FilePlus2 size={24} />, color: 'blue', gradient: 'from-blue-500/20 to-transparent', border: 'border-blue-500/30' },
    { title: 'In Progress', count: acceptedTasks, icon: <Clock size={24} />, color: 'amber', gradient: 'from-amber-500/20 to-transparent', border: 'border-amber-500/30' },
    { title: 'Completed', count: completedTasks, icon: <CheckCircle2 size={24} />, color: 'emerald', gradient: 'from-emerald-500/20 to-transparent', border: 'border-emerald-500/30' },
    { title: 'Failed', count: failedTasks, icon: <AlertCircle size={24} />, color: 'rose', gradient: 'from-rose-500/20 to-transparent', border: 'border-rose-500/30' }
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-10 gap-6'>
        {cards.map((card, idx) => (
            <div key={idx} className={`glass p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border ${card.border} group`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-500`}></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`p-3 rounded-xl bg-${card.color}-500/10 text-${card.color}-400`}>
                        {card.icon}
                    </div>
                </div>
                
                <div className="relative z-10">
                    <h2 className={`text-5xl font-black text-${card.color}-400 drop-shadow-[0_0_12px_currentColor] tracking-tight`}>
                        {card.count}
                    </h2>
                    <h3 className='text-xs font-bold uppercase tracking-wider text-zinc-400 mt-3 group-hover:text-zinc-200 transition-colors'>
                        {card.title}
                    </h3>
                </div>
            </div>
        ))}
    </div>
  );
};

export default TasklistNumber;