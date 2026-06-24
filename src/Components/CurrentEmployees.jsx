import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../Context/AuthContext';
import { Users, UserMinus, Mail, Calendar, ShieldAlert } from 'lucide-react';

const CurrentEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const { deleteEmployee } = useAuth();

    const fetchEmployees = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'employee')
            .order('created_at', { ascending: false });
        
        const localEmp = JSON.parse(localStorage.getItem('localEmployees') || '[]');
        
        if (error) {
            console.error("Error fetching employees:", error.message);
            setEmployees(localEmp);
        } else {
            setEmployees([...localEmp, ...(data || [])]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleRemove = async (id, name) => {
        if (!window.confirm(`Are you sure you want to permanently delete operative ${name}?`)) return;
        
        const { error } = await deleteEmployee(id);
        if (error) {
            alert(`Error deleting employee: ${error.message}`);
        } else {
            fetchEmployees(); // Refresh list
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="mt-8 glass p-8 rounded-2xl shadow-xl relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="mb-10 flex items-center gap-4 relative z-10">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                    <Users size={24} />
                </div>
                <div>
                    <h2 className='text-2xl font-bold text-white tracking-tight'>
                        Current Personnel
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">
                        System roster and operational identities
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {employees.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-zinc-500">
                        <ShieldAlert size={48} className="mb-4 opacity-20" />
                        <p className="text-sm">No personnel found in the system.</p>
                    </div>
                ) : (
                    employees.map(emp => (
                        <div key={emp.id} className="bg-[#0a0a0a]/80 backdrop-blur-sm border border-zinc-800/50 p-6 rounded-xl flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                            <div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                    <span className="text-white font-bold text-lg">{emp.full_name?.[0]?.toUpperCase() || 'U'}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 tracking-tight">{emp.full_name || 'Unnamed Operative'}</h3>
                                <p className="flex items-center gap-2 text-sm text-zinc-400 mb-4">
                                    <Mail size={14} className="text-zinc-500" />
                                    {emp.email}
                                </p>
                            </div>
                            <div className="flex justify-between items-center text-xs mt-2 pt-4 border-t border-zinc-800/50">
                                <span className="flex items-center gap-1.5 text-zinc-500">
                                    <Calendar size={14} className="text-zinc-400" />
                                    Joined <span className="text-blue-400 font-medium ml-1">{new Date(emp.created_at).toLocaleDateString()}</span>
                                </span>
                                <button 
                                    onClick={() => handleRemove(emp.id, emp.full_name)}
                                    className="flex items-center gap-1.5 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 px-2 py-1 rounded transition-all uppercase font-bold text-[10px] tracking-wider opacity-0 group-hover:opacity-100 focus:opacity-100"
                                >
                                    <UserMinus size={12} />
                                    Terminate
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CurrentEmployees;
