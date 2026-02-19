import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchTransactions } from '../api';
import {
    ArrowUpRight,
    ArrowDownLeft,
    History as HistoryIcon,
    Search,
    ChevronLeft,
    Calendar,
    Filter,
    ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const { data } = await fetchTransactions(user._id);
                setTransactions(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getTransactions();
    }, [user._id]);

    const filteredTransactions = transactions.filter(tx =>
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx._id.includes(searchTerm) ||
        tx.amount.toString().includes(searchTerm)
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 page-transition pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 transition-all border border-slate-200 dark:border-white/5"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Transaction History</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Detailed log of all your network activity.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80 with-icon">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by amount or note..."
                            className="input-standard py-2.5 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500">
                        <Filter size={20} />
                    </button>
                </div>
            </header>

            <div className="glass-card !p-0 overflow-hidden min-h-[500px] flex flex-col shadow-xl">
                <div className="p-6 bg-slate-50/50 dark:bg-black/20 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">All Records</span>
                    </div>
                    <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                        {filteredTransactions.length} Items Found
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-80 opacity-50 space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Syncing History...</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-80 opacity-60 text-center">
                            <div className="p-5 bg-slate-100 dark:bg-white/5 rounded-3xl mb-4">
                                <HistoryIcon size={40} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Transactions Found</h3>
                            <p className="text-xs text-slate-500 font-medium">Try searching with different keywords.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredTransactions.map((tx) => (
                                <div key={tx._id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/2 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-2xl shrink-0 transition-transform group-hover:scale-105 ${tx.senderId === user._id ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            {tx.senderId === user._id ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white">
                                                    {tx.senderId === user._id ? 'Paid Out' : 'Received Funds'}
                                                </h4>
                                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm truncate">
                                                {tx.description || 'Secure network transfer protocol'}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(tx.createdAt), 'MMM dd, yyyy')}</span>
                                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">REF: {tx._id.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-6">
                                        <div>
                                            <p className={`text-2xl font-black tracking-tighter ${tx.senderId === user._id ? 'text-slate-900 dark:text-white' : 'text-emerald-500'}`}>
                                                {tx.senderId === user._id ? '-' : '+'}Rs.{tx.amount.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Authorized</p>
                                        </div>
                                        <ArrowRight size={18} className="text-slate-200 group-hover:text-blue-500 transition-colors translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
