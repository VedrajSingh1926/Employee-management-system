import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    // Direct select from tasks, avoiding complex aliases that cause PGRST205
    let query = supabase.from('tasks').select('*, profiles(full_name, email)');

    if (role === 'employee') {
      query = query.eq('assigned_to_id', user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    const dbTasks = data || [];
    const localTasks = JSON.parse(localStorage.getItem('localTasks') || '[]');
    let filteredLocalTasks = localTasks;
    
    if (role === 'employee') {
      filteredLocalTasks = localTasks.filter(task => task.assigned_to_id === user.id);
    }
    
    const localEmployees = JSON.parse(localStorage.getItem('localEmployees') || '[]');
    const allLocalTasksFormatted = filteredLocalTasks.map(task => {
      const emp = localEmployees.find(e => e.id === task.assigned_to_id);
      return {
        ...task,
        profiles: emp ? { full_name: emp.full_name, email: emp.email } : null
      };
    });

    if (error) {
      console.error("Error fetching tasks:", error.message);
      setTasks(allLocalTasksFormatted);
    } else {
      setTasks([...allLocalTasksFormatted, ...dbTasks]);
    }
    setLoading(false);
  }, [user, role]);

  useEffect(() => {
    fetchTasks();

    if (!user) return;

    // Real-time listener for tasks (Commented out to prevent WebSocket timeout errors)
    /*
    const subscription = supabase
      .channel('public:tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks(); // Refetch to ensure we get joined profile data safely
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
    */
  }, [user, fetchTasks]);

  const createTask = async (taskData) => {
    const isMockAdmin = user?.id === 'mock-admin-id';
    
    if (isMockAdmin) {
      const dummyId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      const newTask = {
        id: dummyId,
        ...taskData,
        created_by: user.id,
        created_at: new Date().toISOString()
      };
      const localTasks = JSON.parse(localStorage.getItem('localTasks') || '[]');
      localTasks.push(newTask);
      localStorage.setItem('localTasks', JSON.stringify(localTasks));
      
      fetchTasks();
      return { data: [newTask] };
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...taskData, created_by: user.id }])
      .select();
      
    if (error) {
      console.error("Error creating task, falling back to local storage:", error.message);
      const dummyId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      const newTask = {
        id: dummyId,
        ...taskData,
        created_by: user.id,
        created_at: new Date().toISOString()
      };
      const localTasks = JSON.parse(localStorage.getItem('localTasks') || '[]');
      localTasks.push(newTask);
      localStorage.setItem('localTasks', JSON.stringify(localTasks));
      
      fetchTasks();
      return { data: [newTask] };
    }
    fetchTasks();
    return { data };
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const localTasks = JSON.parse(localStorage.getItem('localTasks') || '[]');
    const isLocalTask = localTasks.some(task => task.id === taskId);
    
    if (isLocalTask) {
      const updatedLocalTasks = localTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      localStorage.setItem('localTasks', JSON.stringify(updatedLocalTasks));
      fetchTasks();
      return { data: updatedLocalTasks.find(t => t.id === taskId) };
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)
      .select();
      
    if (error) {
      console.error("Error updating status in database, checking local tasks:", error.message);
      return { error };
    }
    fetchTasks();
    return { data };
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, fetchTasks, createTask, updateTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;