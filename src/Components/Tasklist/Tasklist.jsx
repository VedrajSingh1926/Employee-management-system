import React from 'react';
import { useTask } from '../../Context/TaskContext';
import AcceptTask from './AcceptTask';
import NewTask from './NewTask';
import CompleteTask from './CompleteTask';
import FailedTask from './FailedTask';

const Tasklist = () => {
    const { tasks } = useTask();

  return (
    <div id='tasklist' className='h-[350px] overflow-x-auto flex items-center justify-start gap-6 flex-nowrap w-full py-5 mt-10 custom-scrollbar'>
        {tasks.length === 0 ? (
            <p className="w-full text-center text-gray-500">No tasks found.</p>
        ) : (
            tasks.map(task => {
                switch (task.status) {
                    case 'new':
                        return <NewTask key={task.id} task={task} />;
                    case 'accepted':
                        return <AcceptTask key={task.id} task={task} />;
                    case 'completed':
                        return <CompleteTask key={task.id} task={task} />;
                    case 'failed':
                        return <FailedTask key={task.id} task={task} />;
                    default:
                        return null;
                }
            })
        )}
    </div>
  )
}

export default Tasklist;