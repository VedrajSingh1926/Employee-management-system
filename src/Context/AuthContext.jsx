import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const fetchRole = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error fetching role:", error.message);
    } else {
      setRole(data?.role || 'employee');
    }
  };

  const login = async (email, password, expectedRole) => {
    // Admin mock bypass for EMS default setup
    if (email === 'admin@123.com' && password === 'EMS' && expectedRole === 'admin') {
      setUser({ id: 'mock-admin-id', email: 'admin@123.com', user_metadata: { full_name: 'System Admin' } });
      setRole('admin');
      return { data: { user: { id: 'mock-admin-id' } }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return { data, error: { message: "Invalid credentials. Please check your email and password." } };
    }

    if (data?.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (profileError || profileData?.role !== expectedRole) {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        return { data: null, error: { message: "Access Denied: Unauthorized Role Selection" } };
      }
      setRole(profileData.role);
    }
    return { data, error };
  };

  const logout = async () => {
    if (user?.id === 'mock-admin-id') {
      setUser(null);
      setRole(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error.message);
  };

  const registerEmployee = async (email, password, fullName) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
    });

    if (authError) return { error: authError };

    if (authData?.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: authData.user.id, email, full_name: fullName, role: 'employee' }]);
        if (profileError) return { error: profileError };
    }
    return { data: authData, error: null };
  };

  const deleteEmployee = async (employeeId) => {
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', employeeId);
    return { error };
  };

  const value = {
    user,
    role,
    login,
    logout,
    loading,
    registerEmployee,
    deleteEmployee
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;