import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../Context/AuthContext';

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
        
        if (error) {
            console.error("Error fetching employees:", error.message);
        } else {
            setEmployees(data || []);
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

    if (loading) return <div className="text-blue-500 mt-8 text-sm font-medium">Loading roster...</div>;

    return (
        <div className="mt-8 bg-[#0a0c10] border border-zinc-850 p-8 rounded-xl shadow-lg shadow-blue-500/5">
            <div className="mb-8 border-l-4 border-blue-600 pl-4">
                <h2 className='text-xl font-bold text-white uppercase tracking-wider'>
                    Current Personnel
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                    System roster and operational identities
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.length === 0 ? (
                    <p className="text-zinc-600 text-sm">No personnel found.</p>
                ) : (
                    employees.map(emp => (
                        <div key={emp.id} className="bg-black border border-zinc-850 p-5 rounded-lg flex flex-col justify-between hover:border-blue-500/30 transition-colors group">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{emp.full_name || 'Unnamed Operative'}</h3>
                                <p className="text-sm text-zinc-400 mb-4">{emp.email}</p>
                            </div>
                            <div className="flex justify-between items-center text-xs mt-2 pt-4 border-t border-zinc-850">
                                <span className="text-zinc-600">Joined <span className="text-blue-400 font-medium ml-1">{new Date(emp.created_at).toLocaleDateString()}</span></span>
                                <button 
                                    onClick={() => handleRemove(emp.id, emp.full_name)}
                                    className="text-zinc-600 hover:text-rose-500 transition-colors uppercase font-bold text-[10px] tracking-wider opacity-0 group-hover:opacity-100 focus:opacity-100"
                                >
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
