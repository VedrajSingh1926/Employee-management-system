import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { KeyRound, Check, Trash2, Clock, Mail, ShieldAlert } from 'lucide-react';

const ResetRequests = () => {
    const [requests, setRequests] = useState([]);
    const [passwords, setPasswords] = useState({});
    const [message, setMessage] = useState('');
    const { adminResetPassword } = useAuth();

    const fetchRequests = () => {
        const stored = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
        const pending = stored.filter(r => r.status === 'pending');
        setRequests(pending);
        
        // Prefill proposed passwords from the request
        const prefilled = {};
        pending.forEach(req => {
            if (req.proposedPassword) {
                prefilled[req.id] = req.proposedPassword;
            }
        });
        setPasswords(prefilled);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handlePasswordChange = (id, val) => {
        setPasswords(prev => ({ ...prev, [id]: val }));
    };

    const handleApprove = async (reqId, email) => {
        const newPassword = passwords[reqId];
        if (!newPassword || newPassword.trim() === '') {
            alert("Please enter a new password first.");
            return;
        }

        // 1. Reset password in context (updates localEmployees)
        await adminResetPassword(email, newPassword);

        // 2. Mark request as approved/completed in localStorage
        const stored = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
        const updatedRequests = stored.map(req => 
            req.id === reqId ? { ...req, status: 'approved', resolvedAt: new Date().toISOString() } : req
        );
        localStorage.setItem('passwordResetRequests', JSON.stringify(updatedRequests));

        setMessage(`SUCCESS: Password for ${email} has been successfully updated.`);
        fetchRequests();
        
        // Clear input state
        setPasswords(prev => {
            const next = { ...prev };
            delete next[reqId];
            return next;
        });

        setTimeout(() => setMessage(''), 5000);
    };

    const handleReject = (reqId, email) => {
        if (!window.confirm(`Are you sure you want to dismiss the reset request for ${email}?`)) return;

        const stored = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
        const updatedRequests = stored.map(req => 
            req.id === reqId ? { ...req, status: 'rejected', resolvedAt: new Date().toISOString() } : req
        );
        localStorage.setItem('passwordResetRequests', JSON.stringify(updatedRequests));

        setMessage(`INFO: Reset request for ${email} was rejected.`);
        fetchRequests();
        setTimeout(() => setMessage(''), 5000);
    };

    return (
        <div className="glass p-8 rounded-2xl mt-8 shadow-xl relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="mb-10 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                    <KeyRound size={24} />
                </div>
                <div>
                    <h2 className='text-2xl font-bold text-white tracking-tight'>
                        Reset Security Keys
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">
                        Approve or reject employee password reset requests
                    </p>
                </div>
            </div>

            {message && (
                <div className={`px-5 py-4 mb-8 text-sm rounded-xl border flex items-center gap-3 animate-fade-in-up ${message.startsWith('ERROR') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-6">
                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                        <Clock size={48} className="mb-4 opacity-20" />
                        <p className="text-sm">No pending reset requests found.</p>
                    </div>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className="bg-[#0a0a0a]/80 border border-zinc-800/80 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-500/20 transition-all duration-300">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-zinc-500" />
                                    <span className="text-white font-medium">{req.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                    <Clock size={12} />
                                    Requested on {new Date(req.requestedAt).toLocaleString()}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                <input 
                                    type="text"
                                    placeholder="Enter new password"
                                    value={passwords[req.id] || ''}
                                    onChange={(e) => handlePasswordChange(req.id, e.target.value)}
                                    className="bg-[#0f0f11] border border-zinc-800 text-white px-4 py-2.5 rounded-lg outline-none focus:border-amber-500/50 text-sm placeholder:text-zinc-600 min-w-[200px]"
                                />
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleApprove(req.id, req.email)}
                                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                    >
                                        <Check size={14} />
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReject(req.id, req.email)}
                                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-900/50 px-4 py-2.5 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all"
                                    >
                                        <Trash2 size={14} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ResetRequests;
