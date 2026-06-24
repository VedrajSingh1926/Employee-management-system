import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, supabaseAdmin } from '../utils/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching role:", error.message);
    } else {
      setRole(data?.role || 'employee');
    }
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchRole(session.user.id);
      }
      setLoading(false);
    };
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchRole(session.user.id);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchRole]);

  const login = async (email, password, expectedRole) => {
    // Admin mock bypass for EMS default setup
    if (email === 'admin@123.com' && password === 'EMS' && expectedRole === 'admin') {
      setUser({ id: 'mock-admin-id', email: 'admin@123.com', user_metadata: { full_name: 'System Admin' } });
      setRole('admin');
      return { data: { user: { id: 'mock-admin-id' } }, error: null };
    }

    // Fallback logic for locally created demo employees
    const localEmp = JSON.parse(localStorage.getItem('localEmployees') || '[]');
    const fallbackUser = localEmp.find(emp => emp.email.toLowerCase() === email.toLowerCase() && emp.password === password);
    if (fallbackUser) {
        if (fallbackUser.role !== expectedRole) {
            return { data: null, error: { message: "Access Denied: Unauthorized Role Selection" } };
        }
        setUser({ id: fallbackUser.id, email: fallbackUser.email, user_metadata: { full_name: fallbackUser.full_name } });
        setRole(fallbackUser.role);
        return { data: { user: { id: fallbackUser.id } }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Double check localEmployees just in case
        const matchingLocal = localEmp.find(emp => emp.email.toLowerCase() === email.toLowerCase() && emp.password === password);
        if (matchingLocal && matchingLocal.role === expectedRole) {
            setUser({ id: matchingLocal.id, email: matchingLocal.email, user_metadata: { full_name: matchingLocal.full_name } });
            setRole(matchingLocal.role);
            return { data: { user: { id: matchingLocal.id } }, error: null };
        }
        return { data, error: { message: "Invalid credentials. Please check your email and password." } };
      }

      if (data?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (profileError || !profileData || profileData?.role !== expectedRole) {
          const matchingLocal = localEmp.find(emp => emp.email.toLowerCase() === email.toLowerCase());
          if (matchingLocal && matchingLocal.role === expectedRole) {
              setUser({ id: data.user.id, email: data.user.email, user_metadata: { full_name: matchingLocal.full_name } });
              setRole(matchingLocal.role);
              return { data, error: null };
          }
          await supabase.auth.signOut();
          setUser(null);
          setRole(null);
          return { data: null, error: { message: "Access Denied: Unauthorized Role Selection" } };
        }
        setRole(profileData.role);
      }
      return { data, error };
    } catch (e) {
      const matchingLocal = localEmp.find(emp => emp.email.toLowerCase() === email.toLowerCase() && emp.password === password);
      if (matchingLocal && matchingLocal.role === expectedRole) {
          setUser({ id: matchingLocal.id, email: matchingLocal.email, user_metadata: { full_name: matchingLocal.full_name } });
          setRole(matchingLocal.role);
          return { data: { user: { id: matchingLocal.id } }, error: null };
      }
      return { data: null, error: { message: "Network error. Please try again." } };
    }
  };

  const logout = async () => {
    if (user?.id === 'mock-admin-id') {
      setUser(null);
      setRole(null);
      return;
    }

    const localEmp = JSON.parse(localStorage.getItem('localEmployees') || '[]');
    const isFallback = localEmp.some(emp => emp.id === user?.id);
    if (isFallback) {
      setUser(null);
      setRole(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error.message);
  };

  const registerEmployee = async (email, password, fullName) => {
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
      });

      if (authError) {
          const dummyId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
          const localEmp = JSON.parse(localStorage.getItem('localEmployees') || '[]');
          localEmp.push({ id: dummyId, email, password, full_name: fullName, role: 'employee', created_at: new Date().toISOString() });
          localStorage.setItem('localEmployees', JSON.stringify(localEmp));
          return { data: { user: { id: dummyId, email } }, error: null };
      }

      if (authData?.user) {
          const { error: profileError } = await supabase
              .from('profiles')
              .insert([{ id: authData.user.id, email, full_name: fullName, role: 'employee' }]);
          
          if (profileError) {
              const localEmp = JSON.parse(localStorage.getItem('localEmployees') || '[]');
              localEmp.push({ id: authData.user.id, email, password, full_name: fullName, role: 'employee', created_at: new Date().toISOString() });
              localStorage.setItem('localEmployees', JSON.stringify(localEmp));
              return { data: { user: { id: authData.user.id, email } }, error: null };
          }
      }
      return { data: authData, error: null };
    } catch (e) {
      const dummyId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      const localEmp = JSON.parse(localStorage.getItem('localEmployees') || '[]');
      localEmp.push({ id: dummyId, email, password, full_name: fullName, role: 'employee', created_at: new Date().toISOString() });
      localStorage.setItem('localEmployees', JSON.stringify(localEmp));
      return { data: { user: { id: dummyId, email } }, error: null };
    }
  };

  const deleteEmployee = async (employeeId) => {
    // 1. Delete from local storage
    const localEmp = JSON.parse(localStorage.getItem('localEmployees') || '[]');
    const newLocalEmp = localEmp.filter(emp => emp.id !== employeeId);
    localStorage.setItem('localEmployees', JSON.stringify(newLocalEmp));

    const localTasks = JSON.parse(localStorage.getItem('localTasks') || '[]');
    const newLocalTasks = localTasks.filter(task => task.assigned_to_id !== employeeId);
    localStorage.setItem('localTasks', JSON.stringify(newLocalTasks));

    // 2. Delete tasks in DB assigned to this employee first (to avoid foreign key errors)
    await supabase
        .from('tasks')
        .delete()
        .eq('assigned_to_id', employeeId);

    // 3. Delete profile from DB
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', employeeId);
    return { error };
  };

  const adminResetPassword = async (email, newPassword) => {
    // 1. Update in local storage
    const localEmp = JSON.parse(localStorage.getItem('localEmployees') || '[]');
    const updated = localEmp.map(emp => 
        emp.email.toLowerCase() === email.toLowerCase() ? { ...emp, password: newPassword } : emp
    );
    localStorage.setItem('localEmployees', JSON.stringify(updated));
    return { success: true };
  };

  const value = {
    user,
    role,
    login,
    logout,
    loading,
    registerEmployee,
    deleteEmployee,
    adminResetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;