import React, { useState, useEffect } from 'react';
import { useTask } from '../Context/TaskContext';
import { supabase } from '../utils/supabaseClient';
import { PlusSquare, CalendarDays, Users, Tag, AlertTriangle, Send } from 'lucide-react';

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
        
      const localEmp = JSON.parse(localStorage.getItem('localEmployees') || '[]');

      if (error) {
        console.error("Error fetching employees:", error.message);
        setEmployees(localEmp);
      } else {
        setEmployees([...localEmp, ...(data || [])]);
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
    <div className='glass p-8 rounded-2xl mt-8 shadow-xl relative overflow-hidden'>
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="mb-10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <PlusSquare size={24} />
          </div>
          <div>
              <h2 className='text-2xl font-bold text-white tracking-tight'>
                  Issue Directive
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                  Create and assign a new operational task
              </p>
          </div>
      </div>

      {message && (
          <div className={`px-5 py-4 mb-8 text-sm rounded-xl border flex items-center gap-3 animate-fade-in-up ${message.startsWith('ERROR') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              {message}
          </div>
      )}

      <form onSubmit={submitHandler} className='flex flex-col lg:flex-row items-start justify-between gap-10 relative z-10'>
        <div className='w-full lg:w-1/2 space-y-6'>
          <div className="space-y-2">
            <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider'>Task Title</label>
            <input
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className='w-full bg-[#0a0a0a] border border-zinc-800 text-white px-5 py-3.5 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-600'
              type='text'
              placeholder='e.g., Update security protocols'
            />
          </div>
          <div className="space-y-2">
            <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider'>Deadline</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500"><CalendarDays size={18} /></div>
              <input
                required
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className='w-full bg-[#0a0a0a] border border-zinc-800 text-zinc-300 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all [color-scheme:dark]'
                type='date'
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider'>Assign To</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500"><Users size={18} /></div>
              <select
                required
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                className='w-full bg-[#0a0a0a] border border-zinc-800 text-white pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer'
              >
                <option value="" disabled>Select Operative</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.full_name || emp.email}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider'>Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500"><Tag size={18} /></div>
                <input
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className='w-full bg-[#0a0a0a] border border-zinc-800 text-white pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-600'
                  type='text'
                  placeholder='e.g., Security'
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider'>Priority</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500"><AlertTriangle size={18} /></div>
                <select
                  value={priorityLevel}
                  onChange={(e) => setPriorityLevel(e.target.value)}
                  className='w-full bg-[#0a0a0a] border border-zinc-800 text-white pl-11 pr-4 py-3.5 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer'
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high" className="text-rose-500 font-bold">High Priority</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className='w-full lg:w-1/2 flex flex-col'>
          <div className="space-y-2">
            <label className='block text-xs font-semibold text-zinc-400 uppercase tracking-wider'>Directive Details</label>
            <textarea
              required
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className='w-full h-56 bg-[#0a0a0a] border border-zinc-800 text-white p-5 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none placeholder:text-zinc-600'
              placeholder='Detailed description of the operational parameters...'
            ></textarea>
          </div>
          <button 
            disabled={loading}
            className='w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] disabled:opacity-50 flex items-center justify-center gap-2'
          >
            {loading ? 'Transmitting...' : <><Send size={18} /> Create Task</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;