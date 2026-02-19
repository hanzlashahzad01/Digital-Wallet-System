import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Lock, Mail, ArrowRight, Wallet } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await loginApi(formData);
            login(data.user, data.token);
            addNotification('Login Successful', 'Welcome back.', 'success');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-6 page-transition">
            <div className="max-w-md w-full glass-card !p-10 sm:!p-12">
                <div className="text-center mb-10">
                    <div className="mx-auto h-20 w-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 mb-8 border border-white/10 group">
                        <Wallet className="text-white group-hover:scale-110 transition-transform" size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-slate-500 font-medium">Log in to your secure digital gateway</p>
                </div>

                {error && (
                    <div className="mb-8 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 text-[10px] font-bold p-4 rounded-xl text-center uppercase tracking-widest">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label>Email Address</label>
                        <div className="with-icon">
                            <Mail size={20} />
                            <input
                                type="email"
                                required
                                className="input-standard py-3.5"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label>Secure Password</label>
                        <div className="with-icon">
                            <Lock size={20} />
                            <input
                                type="password"
                                required
                                className="input-standard py-3.5"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] uppercase tracking-[0.2em] text-[11px]"
                    >
                        <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                        {!loading && <ArrowRight size={18} className="shrink-0" />}
                    </button>

                    <div className="text-center pt-4">
                        <p className="text-sm text-slate-500 font-medium tracking-tight">
                            Don't have an ID?{' '}
                            <Link to="/register" className="text-blue-600 font-bold hover:underline">Establish Node</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
