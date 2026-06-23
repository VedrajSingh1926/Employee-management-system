import React from 'react';
import Header from '../Header';
import TasklistNumber from '../TasklistNumber';
import Tasklist from '../Tasklist/Tasklist';

const EmployeeDashboard = () => {
  return (
    <div className='p-10 bg-black min-h-screen text-slate-300 font-sans'>
      <div className="max-w-7xl mx-auto">
        <Header />
        <TasklistNumber />
        <Tasklist />
      </div>
    </div>
  );
};

export default EmployeeDashboard;