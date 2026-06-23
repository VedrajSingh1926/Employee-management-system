import React from 'react';
import Login from './Components/Auth/Login';
import ResetPassword from './Components/Auth/ResetPassword';
import EmployeeDashboard from './Components/Dashboard/EmployeeDashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import { useAuth } from './Context/AuthContext';

const App = () => {
  const { user, role, loading } = useAuth();
  const path = window.location.pathname;

  if (path === '/reset-password') {
    return <ResetPassword />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-blue-500 text-lg font-mono">
        INITIALIZING SECURE SESSION...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      {role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
    </>
  );
};

export default App;