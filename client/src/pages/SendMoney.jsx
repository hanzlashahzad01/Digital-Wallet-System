import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { sendMoney, requestOTP, verifyOTP } from '../api';
import {
    Send,
    Mail,
    DollarSign,
    FileText,
    CheckCircle2,
    ChevronLeft,
    Lock,
    ArrowRight
} from 'lucide-react';

const SendMoney = () => {
    const { user, setUser } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        receiverRunningId: '',
        amount: '',
        description: '',
        otp: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Pre-fill wallet ID if passed from Quick Send
    useEffect(() => {
        if (location.state?.recipientWalletId) {
            setFormData(prev => ({
                ...prev,
                receiverRunningId: location.state.recipientWalletId
            }));
        }
    }, [location.state]);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await requestOTP(user.email);

            setStep(2);
            addNotification('SMS Code Sent', 'Check your phone for the 6-digit verification code.', 'info');
        } catch (err) {
            setError(err.response?.data?.message || 'Setup interrupted.');
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await verifyOTP({ email: user.email, otp: formData.otp });
            await sendMoney({
                senderId: user._id,
                receiverRunningId: formData.receiverRunningId,
                amount: Number(formData.amount),
                description: formData.description
            });

            const updatedUser = { ...user, balance: user.balance - Number(formData.amount) };
            setUser(updatedUser);

            setSuccess(true);
            addNotification('Transfer Successful', `Rs.${formData.amount} sent.`, 'success');
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Authorization failed.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center page-transition">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-emerald-500/10">
                    <CheckCircle2 size={40} className="shrink-0" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 italic">Transfer Success</h2>
                <p className="text-slate-500 font-medium">Auto-syncing with dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 page-transition pb-20">
            <header className="flex items-center justify-between">
                <button
                    onClick={() => step === 2 ? setStep(1) : navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm"
                >
                    <ChevronLeft size={18} className="shrink-0" />
                    <span>Go Back</span>
                </button>
            </header>

            <div className="glass-card !p-8 sm:!p-12">
                <div className="text-center mb-10">
                    <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <Send size={28} className="shrink-0" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white italic tracking-tighter">Send Money</h2>
                    <p className="text-slate-500 text-sm font-medium">Secure transfer to another node</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 rounded-xl text-xs font-bold text-center uppercase tracking-widest">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleRequestOTP} className="space-y-6">
                        <div className="space-y-1">
                            <label>Recipient Wallet ID</label>
                            <div className="with-icon">
                                <Mail size={20} />
                                <input
                                    type="text"
                                    required
                                    className="input-standard py-3.5"
                                    placeholder="FLX-000-000-000"
                                    value={formData.receiverRunningId}
                                    onChange={(e) => setFormData({ ...formData, receiverRunningId: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label>Amount (Rs.)</label>
                            <div className="flex flex-col gap-2">
                                <div className="with-icon">
                                    <DollarSign size={20} />
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max={user.balance}
                                        className="input-standard py-5 text-2xl font-bold"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Available: Rs.{user.balance?.toLocaleString()}</p>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, amount: user.balance })}
                                        className="text-[10px] text-blue-600 font-bold uppercase tracking-widest hover:underline"
                                    >
                                        Use Max
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label>Note (Optional)</label>
                            <div className="with-icon">
                                <FileText size={20} className="!top-5" />
                                <textarea
                                    className="input-standard py-4 min-h-[120px] resize-none"
                                    placeholder="Enter a description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !formData.amount || !formData.receiverRunningId}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.2em]"
                        >
                            <span>Request SMS Authorization</span>
                            <ArrowRight size={18} className="shrink-0" />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleTransfer} className="space-y-10">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Final Clearance</h3>
                            <p className="text-sm text-slate-500 font-medium">Verify the 6-digit SMS code sent to your phone</p>
                        </div>

                        <div className="space-y-2">
                            <div className="relative max-w-[280px] mx-auto with-icon">
                                <Lock size={20} />
                                <input
                                    type="text"
                                    maxLength="6"
                                    required
                                    className="input-standard text-center text-3xl font-black tracking-[0.4em] py-6"
                                    placeholder="000000"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={loading || formData.otp.length < 6}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 uppercase text-[10px] tracking-[0.2em]"
                            >
                                {loading ? 'Authorizing...' : 'Authorize Transfer'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                            >
                                Abort
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SendMoney;
