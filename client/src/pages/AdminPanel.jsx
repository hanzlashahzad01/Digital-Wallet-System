import React, { useEffect, useState } from 'react';
import { fetchAllTransactions, freezeWallet, unfreezeWallet } from '../api';
import {
    ShieldAlert,
    Users,
    Activity,
    Lock,
    Unlock,
    Search,
    AlertTriangle,
    Shield
} from 'lucide-react';

const AdminPanel = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flaggedOnly, setFlaggedOnly] = useState(false);
    const [stats, setStats] = useState({ total: 0, flagged: 0, volume: 0 });

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const { data } = await fetchAllTransactions();
            setTransactions(data);
            const flagged = data.filter(t => t.isFlagged).length;
            const volume = data.reduce((acc, curr) => acc + curr.amount, 0);
            setStats({ total: data.length, flagged, volume });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFreeze = async (userId, currentlyFrozen) => {
        try {
            if (currentlyFrozen) {
                await unfreezeWallet(userId);
            } else {
                await freezeWallet(userId);
            }
            loadTransactions();
        } catch (err) {
            alert("Action failed: " + err.message);
        }
    };

    const filteredTx = flaggedOnly ? transactions.filter(t => t.isFlagged) : transactions;

    return (
        <div className="space-y-8 page-transition pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
                        <Shield size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase italic">Admin Console</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Monitoring network security and transaction integrity.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all text-slate-600 dark:text-slate-400">Export Feed</button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card !p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600">
                            <Activity size={24} />
                        </div>
                        <span className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Live</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Signals</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.total.toLocaleString()}</p>
                </div>

                <div className="glass-card !p-8 border-rose-500/10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-600">
                            <ShieldAlert size={24} />
                        </div>
                        <span className="bg-rose-500/10 text-rose-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Alerts</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Flagged Activity</p>
                    <p className="text-3xl font-black text-rose-600">{stats.flagged}</p>
                </div>

                <div className="glass-card !p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Network Volume</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-slate-400">Rs.</span>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.volume.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="glass-card !p-0 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-white/2">
                    <div className="flex p-1 bg-slate-200 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 w-full sm:w-auto">
                        <button
                            onClick={() => setFlaggedOnly(false)}
                            className={`px-4 sm:px-6 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all flex-1 sm:flex-none ${!flaggedOnly ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
                        >
                            All Streams
                        </button>
                        <button
                            onClick={() => setFlaggedOnly(true)}
                            className={`px-4 sm:px-6 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all flex-1 sm:flex-none ${flaggedOnly ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500 hover:text-rose-500'}`}
                        >
                            Risk Flags
                        </button>
                    </div>
                    <div className="with-icon !w-full md:!w-80">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search Node ID..."
                            className="input-standard py-2.5 text-xs"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto table-responsive">
                    <table className="w-full text-left min-w-[640px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-black/20 text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/10">
                                <th className="px-4 sm:px-8 py-4">Origin Node</th>
                                <th className="px-4 sm:px-8 py-4">Quantity</th>
                                <th className="px-4 sm:px-8 py-4">Security</th>
                                <th className="px-4 sm:px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => <tr key={i}><td colSpan="4" className="px-4 sm:px-8 py-10 text-center text-slate-400 italic text-xs font-bold uppercase tracking-widest opacity-50">Syncing with Mainframe...</td></tr>)
                            ) : filteredTx.length === 0 ? (
                                <tr><td colSpan="4" className="px-4 sm:px-8 py-16 text-center text-slate-500 font-bold uppercase tracking-widest opacity-60">No matching signals found</td></tr>
                            ) : (
                                filteredTx.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                                        <td className="px-4 sm:px-8 py-6">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 text-xs sm:text-base shrink-0">
                                                    {tx.senderId?.email?.[0] || '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-none tracking-tight truncate">{tx.senderId?.email || 'Unknown User'}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest truncate">ID: {tx.senderId?.walletId || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-8 py-6">
                                            <p className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tighter">Rs.{tx.amount.toLocaleString()}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">REF: {tx._id.slice(-6).toUpperCase()}</p>
                                        </td>
                                        <td className="px-4 sm:px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${tx.isFlagged
                                                ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                }`}>
                                                {tx.isFlagged ? <AlertTriangle size={12} className="shrink-0" /> : <Shield size={12} className="shrink-0" />}
                                                <span className="hidden sm:inline">{tx.isFlagged ? 'High Risk' : 'Authorized'}</span>
                                                <span className="sm:hidden">{tx.isFlagged ? 'Risk' : 'OK'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-8 py-6 text-right">
                                            <button
                                                onClick={() => handleFreeze(tx.senderId?._id, tx.senderId?.isFrozen)}
                                                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border shadow-sm active:scale-95 ${tx.senderId?.isFrozen
                                                    ? 'bg-amber-600 text-white border-amber-500'
                                                    : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 dark:hover:bg-rose-600 dark:hover:text-white'
                                                    }`}
                                            >
                                                {tx.senderId?.isFrozen ? <Unlock size={12} className="shrink-0" /> : <Lock size={12} className="shrink-0" />}
                                                <span className="hidden sm:inline">{tx.senderId?.isFrozen ? 'Release' : 'Freeze'}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
