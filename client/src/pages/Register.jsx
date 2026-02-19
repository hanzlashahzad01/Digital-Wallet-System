import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api';
import { Mail, Lock, UserPlus, ArrowRight, Phone } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registerApi(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Matrix registry failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-6 page-transition">
            <div className="max-w-md w-full glass-card !p-10 sm:!p-12">
                <div className="text-center mb-10">
                    <div className="mx-auto h-20 w-20 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 mb-8 border border-white/10 group">
                        <UserPlus className="text-white group-hover:scale-110 transition-transform" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight italic">Join Flux</h2>
                    <p className="mt-2 text-slate-500 font-medium">Establish your global node identity</p>
                </div>

                {error && (
                    <div className="mb-8 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 text-[10px] font-bold p-4 rounded-xl text-center uppercase tracking-widest leading-relaxed">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label>Forename</label>
                            <input
                                type="text"
                                required
                                className="input-standard py-3.5 font-bold uppercase tracking-tight"
                                placeholder="ALPHA"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label>Surname</label>
                            <input
                                type="text"
                                required
                                className="input-standard py-3.5 font-bold uppercase tracking-tight"
                                placeholder="NODE"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label>Identity Gateway (Email)</label>
                        <div className="with-icon">
                            <Mail size={20} />
                            <input
                                type="email"
                                required
                                className="input-standard py-3.5 font-mono text-sm"
                                placeholder="node@flux.sys"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label>Mobile Number (For Verification)</label>
                        <div className="with-icon">
                            <Phone size={20} />
                            <input
                                type="tel"
                                required
                                className="input-standard py-3.5 font-mono text-sm"
                                placeholder="+923000000000"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Include country code (e.g., +92)</p>
                    </div>

                    <div className="space-y-1">
                        <label>Security Key (Password)</label>
                        <div className="with-icon">
                            <Lock size={20} />
                            <input
                                type="password"
                                required
                                className="input-standard py-3.5 font-mono tracking-widest"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-600/30 active:scale-[0.98] uppercase tracking-[0.2em] text-[11px]"
                    >
                        <span>{loading ? 'Initializing...' : 'Authorize Registration'}</span>
                        {!loading && <ArrowRight size={18} className="shrink-0" />}
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-sm text-slate-500 font-medium tracking-tight">
                            Established ID?{' '}
                            <Link to="/login" className="text-emerald-600 font-bold hover:underline">Vault Sync</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
