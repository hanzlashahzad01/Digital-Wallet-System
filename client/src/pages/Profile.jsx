import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { updateProfile, updatePassword } from '../api';
import {
    User as UserIcon,
    ShieldCheck,
    CreditCard,
    ChevronRight,
    Lock,
    Bell,
    CheckCircle2,
    Mail,
    Edit3,
    Save,
    X,
    ShieldAlert
} from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useAuth();
    const { addNotification } = useNotifications();
    const [activeTab, setActiveTab] = useState('general');
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertSignals, setAlertSignals] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [profileData, setProfileData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    });

    const tabs = [
        { id: 'general', label: 'Identity', icon: UserIcon },
        { id: 'security', label: 'Shield', icon: ShieldCheck },
        { id: 'wallet', label: 'Wallet', icon: CreditCard },
    ];

    const handleSave = async () => {
        setLoading(true);
        try {
            const { data } = await updateProfile(user._id, profileData);
            const updatedProfile = JSON.parse(localStorage.getItem('profile'));
            updatedProfile.user = data;
            localStorage.setItem('profile', JSON.stringify(updatedProfile));
            setUser(data);

            setEditMode(false);
            addNotification('Identity Updated', 'Your profile details have been synchronized.', 'success');
        } catch (err) {
            addNotification('Update Failed', err.response?.data?.message || 'Signal lost during sync.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSync = async () => {
        if (!newPassword || newPassword.length < 5) {
            return addNotification('Invalid Key', 'Security keys must be at least 5 characters.', 'error');
        }
        setLoading(true);
        try {
            await updatePassword(user._id, newPassword);
            setNewPassword('');
            addNotification('Key Rotated', 'Your security access key has been updated.', 'success');
        } catch (err) {
            addNotification('Sync Failed', 'Mainframe rejected the security update.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 page-transition pb-20">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">Account Console</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your global identity and security protocols.</p>
                </div>
                {activeTab === 'general' && (
                    <button
                        onClick={() => editMode ? handleSave() : setEditMode(true)}
                        disabled={loading}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${editMode
                                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                                : 'bg-blue-600 text-white shadow-blue-600/20'
                            }`}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : editMode ? (
                            <Save size={16} />
                        ) : (
                            <Edit3 size={16} />
                        )}
                        <span>{editMode ? 'Authorize Save' : 'Edit Identity'}</span>
                    </button>
                )}
            </header>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setEditMode(false); }}
                            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 active:scale-[0.98]'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon size={18} />
                                <span>{tab.label}</span>
                            </div>
                            <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'general' && (
                        <div className="glass-card !p-8 md:!p-10 space-y-8">
                            <div className="flex items-center gap-8 pb-8 border-b border-slate-100 dark:border-white/5">
                                <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-xl italic relative">
                                    {user.firstName[0]}
                                    {editMode && (
                                        <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-black/40 transition-all">
                                            <Edit3 size={20} className="text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                        {editMode ? 'Modify Profile' : `${user.firstName} ${user.lastName}`}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                            <CheckCircle2 size={14} />
                                            Active
                                        </span>
                                        <span className="text-slate-300">|</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID: {user.walletId}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label>Forename</label>
                                        {editMode && <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Editable</span>}
                                    </div>
                                    <input
                                        type="text"
                                        readOnly={!editMode}
                                        value={profileData.firstName}
                                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                        className={`input-standard py-3.5 font-bold transition-all ${!editMode
                                                ? '!bg-slate-50 dark:!bg-slate-900/40 cursor-default'
                                                : 'ring-2 ring-blue-500/20 border-blue-500 dark:!bg-slate-900/60'
                                            }`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label>Surname</label>
                                        {editMode && <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Editable</span>}
                                    </div>
                                    <input
                                        type="text"
                                        readOnly={!editMode}
                                        value={profileData.lastName}
                                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                        className={`input-standard py-3.5 font-bold transition-all ${!editMode
                                                ? '!bg-slate-50 dark:!bg-slate-900/40 cursor-default'
                                                : 'ring-2 ring-blue-500/20 border-blue-500 dark:!bg-slate-900/60'
                                            }`}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label>Identity Gateway (Email)</label>
                                        {editMode && <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Public Route</span>}
                                    </div>
                                    <div className="with-icon">
                                        <Mail size={18} />
                                        <input
                                            type="email"
                                            readOnly={!editMode}
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className={`input-standard py-3.5 font-mono text-sm transition-all ${!editMode
                                                    ? '!bg-slate-100 dark:!bg-slate-900/20 text-slate-400 cursor-not-allowed'
                                                    : 'ring-2 ring-blue-500/20 border-blue-500 dark:!bg-slate-900/60'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {editMode && (
                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        Authorize Sync
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setProfileData({
                                                firstName: user.firstName,
                                                lastName: user.lastName,
                                                email: user.email
                                            });
                                        }}
                                        className="px-6 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="glass-card !p-8 md:!p-10 space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-600/10 text-blue-600 rounded-2xl">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight italic">Security Protocol</h3>
                                    <p className="text-xs text-slate-500 font-medium">Encryption and authentication management.</p>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-white/2 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-white dark:bg-white/5 text-blue-600 rounded-xl shadow-sm border border-slate-100 dark:border-white/10">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">Alert Signals</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Real-time node notifications</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setAlertSignals(!alertSignals)}
                                    className={`w-12 h-6 rounded-full relative transition-all p-1 ${alertSignals ? 'bg-blue-600' : 'bg-slate-300 dark:bg-white/10'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all ${alertSignals ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-white/5">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Rotate Access Key</h4>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label>New Security Key</label>
                                        <div className="with-icon">
                                            <Lock size={18} />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Min. 5 chars"
                                                className="input-standard py-3.5 font-mono"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handlePasswordSync}
                                        disabled={loading}
                                        className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50"
                                    >
                                        {loading ? 'Processing Sync...' : 'Update Node Access'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'wallet' && (
                        <div className="space-y-8">
                            <div className="glass-card bg-gradient-to-br from-blue-600 to-indigo-800 !p-12 text-white relative overflow-hidden min-h-[260px] flex flex-col justify-between border-transparent shadow-2xl">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-40 -mt-40" />
                                <div>
                                    <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.4em] mb-10">Network Identity</p>
                                    <p className="text-3xl md:text-5xl font-black tracking-tighter break-all font-mono italic">{user.walletId}</p>
                                </div>
                                <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                                    <ShieldCheck size={16} />
                                    Node Verified & Secured
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card !p-8 flex flex-col items-center justify-center text-center group hover:border-blue-500/30 transition-all">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 leading-none">Primary Currency</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">{user.currency}</p>
                                </div>
                                <div className="glass-card !p-8 flex flex-col items-center justify-center text-center group hover:border-blue-500/30 transition-all">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 leading-none">Sync Limit</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">Rs.5,000</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
