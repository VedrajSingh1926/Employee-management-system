import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();

  const fetchTasks = async () => {
    if (!user) return;
    setLoading(true);
    
    // Direct select from tasks, avoiding complex aliases that cause PGRST205
    let query = supabase.from('tasks').select('*, profiles(full_name, email)');

    if (role === 'employee') {
      query = query.eq('assigned_to_id', user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching tasks:", error.message);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();

    if (!user) return;

    // Real-time listener for tasks
    const subscription = supabase
      .channel('public:tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        fetchTasks(); // Refetch to ensure we get joined profile data safely
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [user, role]);

  const createTask = async (taskData) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...taskData, created_by: user.id }])
      .select();
      
    if (error) {
      console.error("Error creating task:", error.message);
      return { error };
    }
    return { data };
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)
      .select();
      
    if (error) {
      console.error("Error updating status:", error.message);
      return { error };
    }
    return { data };
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, fetchTasks, createTask, updateTaskStatus }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;