import React, { useState, useEffect } from 'react';
import { useTask } from '../Context/TaskContext';
import { supabase } from '../utils/supabaseClient';

const CreateTask = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [category, setCategory] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('medium');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { createTask } = useTask();

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'employee')
        .order('full_name');
        
      if (error) {
        console.error("Error fetching employees:", error.message);
      } else {
        setEmployees(data || []);
      }
    };
    fetchEmployees();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!assignTo) {
      setMessage('ERROR: Please assign the task to an employee.');
      setLoading(false);
      return;
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      deadline: taskDate,
      assigned_to_id: assignTo,
      category: category,
      priority_level: priorityLevel,
      status: 'new',
    };

    const { error } = await createTask(newTask);

    if (error) {
      setMessage(`ERROR: ${error.message}`);
    } else {
      setMessage('SUCCESS: Task assigned and broadcasted.');
      setTaskTitle('');
      setCategory('');
      setAssignTo('');
      setTaskDate('');
      setTaskDescription('');
      setPriorityLevel('medium');
    }
    setLoading(false);
  };

  return (
    <div className='bg-[#0a0c10] border border-zinc-850 p-8 rounded-xl mt-8 shadow-[0_0_30px_rgba(37,99,235,0.03)]'>
      <div className="mb-8 border-l-4 border-blue-600 pl-4">
          <h2 className='text-xl font-bold text-white uppercase tracking-wider'>
              Issue Directive
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
              Create and assign a new operational task
          </p>
      </div>

      {message && (
          <div className={`px-4 py-3 mb-6 text-sm rounded-lg border ${message.startsWith('ERROR') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              {message}
          </div>
      )}

      <form onSubmit={submitHandler} className='flex flex-col lg:flex-row items-start justify-between gap-10'>
        <div className='w-full lg:w-1/2 space-y-5'>
          <div>
            <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2'>Task Title</label>
            <input
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className='w-full bg-black border border-zinc-850 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700'
              type='text'
              placeholder='e.g., Update security protocols'
            />
          </div>
          <div>
            <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2'>Deadline</label>
            <input
              required
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className='w-full bg-black border border-zinc-850 text-zinc-300 px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all [color-scheme:dark]'
              type='date'
            />
          </div>
          <div>
            <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2'>Assign To</label>
            <select
              required
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className='w-full bg-black border border-zinc-850 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer'
            >
              <option value="" disabled>Select Operative</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.full_name || emp.email}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2'>Category</label>
              <input
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full bg-black border border-zinc-850 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700'
                type='text'
                placeholder='e.g., Security'
              />
            </div>
            <div className="flex-1">
              <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2'>Priority</label>
              <select
                value={priorityLevel}
                onChange={(e) => setPriorityLevel(e.target.value)}
                className='w-full bg-black border border-zinc-850 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer'
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high" className="text-rose-500 font-bold">High Priority</option>
              </select>
            </div>
          </div>
        </div>

        <div className='w-full lg:w-1/2 flex flex-col'>
          <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2'>Directive Details</label>
          <textarea
            required
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className='w-full h-44 bg-black border border-zinc-850 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none placeholder:text-zinc-700'
            placeholder='Detailed description of the operational parameters...'
          ></textarea>
          <button 
            disabled={loading}
            className='w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white px-5 py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-50'
          >
            {loading ? 'Transmitting...' : 'Initialize Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;