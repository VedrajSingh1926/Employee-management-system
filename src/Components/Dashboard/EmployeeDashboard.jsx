import React from 'react';
import Header from '../Header';
import TasklistNumber from '../TasklistNumber';
import Tasklist from '../Tasklist/Tasklist';

const EmployeeDashboard = () => {
  return (
    <div className='p-10 bg-[#050505] min-h-screen text-slate-300 font-sans relative overflow-x-hidden'>
      {/* Subtle background glow */}
      <div className="absolute top-[10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
        <Header />
        <TasklistNumber />
        <Tasklist />
      </div>
    </div>
  );
};

export default EmployeeDashboard;