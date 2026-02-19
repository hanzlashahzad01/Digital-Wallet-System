import React, { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import {
    X,
    Bell,
    Check,
    Trash2,
    Info,
    AlertTriangle,
    CheckCircle2,
    BellOff,
    CheckCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationModal = ({ isOpen, onClose }) => {
    const { notifications, markAsRead, clearAll } = useNotifications();

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle2 className="text-emerald-500" size={16} /></div>;
            case 'error': return <div className="p-2 bg-rose-500/10 rounded-lg"><AlertTriangle className="text-rose-500" size={16} /></div>;
            default: return <div className="p-2 bg-blue-500/10 rounded-lg"><Info className="text-blue-500" size={16} /></div>;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Invisible backdrop for closing */}
                    <div
                        className="fixed inset-0 z-[60] bg-transparent"
                        onClick={onClose}
                    />

                    {/* Floating Dropdown */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-24 right-4 md:right-10 lg:right-20 w-[92vw] sm:w-[400px] z-[70] origin-top-right overflow-hidden glass-card !p-0 shadow-2xl border-slate-200/50 dark:border-white/10"
                    >
                        {/* Internal Header */}
                        <div className="p-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                    <Bell size={16} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">System Signals</h2>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Global Mainframe Feed</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                        title="Clear All"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Notifications Content */}
                        <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden p-3 space-y-2 scrollbar-hide">
                            {notifications.length === 0 ? (
                                <div className="py-20 flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-700">
                                        <BellOff size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Zero signals detected</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {notifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`group relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden ${notification.read
                                                    ? 'bg-transparent border-transparent opacity-40 hover:opacity-100'
                                                    : 'bg-white dark:bg-white/5 border-slate-100 dark:border-blue-500/10 shadow-sm hover:border-blue-500/30'
                                                }`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            {!notification.read && (
                                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
                                            )}

                                            <div className="flex gap-4">
                                                <div className="shrink-0 mt-0.5">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <h4 className={`text-xs font-black truncate tracking-tight uppercase ${notification.read ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap ml-2">
                                                            {format(new Date(notification.timestamp), 'HH:mm')}
                                                        </span>
                                                    </div>
                                                    <p className={`text-[11px] leading-relaxed line-clamp-2 ${notification.read ? 'text-slate-400 italic' : 'text-slate-600 dark:text-slate-400 font-medium'}`}>
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="p-4 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 flex justify-center">
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all"
                            >
                                <CheckCheck size={14} />
                                Sync Acknowledged
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationModal;
