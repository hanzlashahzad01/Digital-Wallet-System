import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchTransactions, fetchUsers } from '../api';
import {
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    Plus,
    History,
    TrendingUp,
    DollarSign,
    Users,
    CreditCard,
    ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [allTransactions, setAllTransactions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const { data } = await fetchTransactions(user._id);
                setAllTransactions(data);
                setTransactions(data.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getTransactions();
    }, [user._id]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const { data } = await fetchUsers(user._id);
                setUsers(data.slice(0, 4)); // Get only 4 users for Quick Send
            } catch (err) {
                console.error('Error fetching users:', err);
            } finally {
                setUsersLoading(false);
            }
        };
        getUsers();
    }, [user._id]);

    // Calculate real-time spending and income
    const totalSpending = allTransactions
        .filter(t => t.senderId === user._id)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = allTransactions
        .filter(t => t.receiverId === user._id)
        .reduce((sum, t) => sum + t.amount, 0);

    const stats = [
        { label: 'Total Balance', value: `Rs.${user.balance?.toLocaleString()}`, icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Spending', value: `Rs.${totalSpending.toLocaleString()}`, icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Income', value: `Rs.${totalIncome.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    // Generate last 7 days data
    const getLast7DaysData = () => {
        const days = [];
        const spendingData = [];
        const incomeData = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayLabel = format(date, 'EEE');
            days.push(dayLabel);

            // Calculate spending for this day
            const daySpending = allTransactions
                .filter(t => {
                    const txDate = new Date(t.createdAt);
                    return t.senderId === user._id &&
                        txDate.toDateString() === date.toDateString();
                })
                .reduce((sum, t) => sum + t.amount, 0);

            spendingData.push(daySpending);

            // Calculate income for this day
            const dayIncome = allTransactions
                .filter(t => {
                    const txDate = new Date(t.createdAt);
                    return t.receiverId === user._id &&
                        txDate.toDateString() === date.toDateString();
                })
                .reduce((sum, t) => sum + t.amount, 0);

            incomeData.push(dayIncome);
        }

        return { days, spendingData, incomeData };
    };

    const { days, spendingData, incomeData } = getLast7DaysData();

    const chartData = {
        labels: days,
        datasets: [
            {
                label: 'Spending',
                data: spendingData,
                fill: true,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                borderWidth: 3,
            },
            {
                label: 'Income',
                data: incomeData,
                fill: true,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                borderWidth: 3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                titleColor: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                bodyColor: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderWidth: 1,
                padding: 12,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b' },
            },
            y: {
                grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                ticks: { color: theme === 'dark' ? '#94a3b8' : '#64748b' },
            },
        },
    };

    return (
        <div className="space-y-8 page-transition pb-20">
            <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Financial Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Welcome back, <span className="text-blue-600 dark:text-blue-400 font-bold">{user.firstName}</span>!
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/history')}
                        className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all font-bold text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                    >
                        <History size={18} className="shrink-0" />
                        <span>History</span>
                    </button>
                    <button
                        onClick={() => navigate('/send')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        <Plus size={20} className="shrink-0" />
                        <span>Send Money</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1 space-y-8">
                    {/* Visual Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2rem] p-8 text-white h-64 flex flex-col justify-between shadow-xl relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-start">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Active Balance</span>
                            <CreditCard size={24} className="opacity-80 shrink-0" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-4xl font-black tracking-tight">Rs.{user.balance?.toLocaleString()}</p>
                            <p className="text-[10px] opacity-60 mt-1 uppercase tracking-widest font-bold">{user.walletId}</p>
                        </div>
                        <div className="relative z-10 flex justify-between items-end">
                            <p className="text-sm font-bold uppercase">{user.firstName} {user.lastName}</p>
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/10"></div>
                                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/5"></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats List */}
                    <div className="grid grid-cols-1 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="glass-card !p-5 flex items-center justify-between hover:translate-x-1 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shrink-0`}>
                                        <stat.icon size={22} className="shrink-0" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">{stat.value}</p>
                                    </div>
                                </div>
                                <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="xl:col-span-2 glass-card !p-10 h-[500px] flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Spending Analytics</h2>
                            <p className="text-xs text-slate-500 font-medium">Weekly activity update</p>
                        </div>
                    </div>
                    <div className="flex-grow">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Recent Activity */}
                <div className="glass-card !p-8 flex flex-col min-h-[450px]">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                            <History size={22} className="text-blue-500 shrink-0" />
                            Recent Activity
                        </h2>
                        <button
                            onClick={() => navigate('/history')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-500"
                        >
                            View All
                        </button>
                    </div>

                    <div className="space-y-4 flex-grow overflow-y-auto pr-2 scrollbar-hide">
                        {loading ? (
                            <div className="flex items-center justify-center h-40 opacity-50 text-xs font-bold uppercase tracking-widest">Loading...</div>
                        ) : (
                            transactions.map((tx) => (
                                <div key={tx._id} className="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl shrink-0 ${tx.senderId === user._id ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            {tx.senderId === user._id ? <ArrowUpRight size={18} className="shrink-0" /> : <ArrowDownLeft size={18} className="shrink-0" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">
                                                {tx.senderId === user._id ? 'Payment Sent' : 'Payment Received'}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase opacity-60">{format(new Date(tx.createdAt), 'MMM dd, HH:mm')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold tracking-tight ${tx.senderId === user._id ? 'text-slate-900 dark:text-white' : 'text-emerald-500'}`}>
                                            {tx.senderId === user._id ? '-' : '+'}Rs.{tx.amount.toLocaleString()}
                                        </p>
                                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-md mt-1 inline-block ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Transfer */}
                <div className="glass-card !p-8 flex flex-col justify-between min-h-[450px]">
                    <div>
                        <h2 className="text-xl font-bold mb-10 flex items-center gap-3 text-slate-900 dark:text-white">
                            <Users size={22} className="text-indigo-500 shrink-0" />
                            Quick Send
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
                            {usersLoading ? (
                                <div className="col-span-2 sm:col-span-4 flex items-center justify-center h-24 opacity-50 text-xs font-bold uppercase tracking-widest">
                                    Loading...
                                </div>
                            ) : users.length > 0 ? (
                                users.map((u, i) => (
                                    <button
                                        key={i}
                                        className="flex flex-col items-center gap-3 group"
                                        onClick={() => navigate('/send', { state: { recipientWalletId: u.walletId } })}
                                    >
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-transparent group-hover:border-blue-500/30 group-hover:scale-105 transition-all shadow-sm">
                                            <span className="text-lg sm:text-xl font-bold text-slate-400 group-hover:text-blue-500">
                                                {u.firstName[0]}{u.lastName[0]}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate w-full px-1">
                                            {u.firstName}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2 sm:col-span-4 flex items-center justify-center h-24 opacity-50 text-xs font-bold uppercase tracking-widest">
                                    No users available
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/send')}
                        className="w-full py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 mt-6"
                    >
                        <span>Start Transfer</span>
                        <ArrowRight size={18} className="shrink-0" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
