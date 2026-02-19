import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    Send,
    User,
    ShieldCheck,
    Menu,
    X,
    Sun,
    Moon,
    Bell,
    LogOut,
    Wallet
} from 'lucide-react';
import NotificationModal from './NotificationModal';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Send Money', path: '/send', icon: Send },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    if (user?.isAdmin) {
        navLinks.push({ name: 'Admin', path: '/admin', icon: ShieldCheck });
    }

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 h-20">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                {/* Brand */}
                <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                        <Wallet className="text-white" size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">Flux Wallet</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Simple Banking</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                {user && (
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5 
                                        ${isActive(link.path)
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                                >
                                    <link.icon size={18} className="shrink-0" />
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-white/10 h-10">
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 transition-all flex items-center justify-center"
                            >
                                {theme === 'dark' ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
                            </button>

                            <button
                                onClick={() => setIsNotificationsOpen(true)}
                                className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 relative transition-all flex items-center justify-center"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-[#0f172a]"></span>
                            </button>

                            <button
                                onClick={logout}
                                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-md flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Mobile Toggle */}
                <div className="lg:hidden flex items-center gap-2">
                    <button onClick={toggleTheme} className="p-2 text-slate-500">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setIsNotificationsOpen(true)} className="p-2 text-slate-500 relative">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-[#0f172a]"></span>
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 rounded-lg">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && user && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/5 p-6 space-y-4 shadow-xl">
                    <div className="grid grid-cols-1 gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-3 p-4 rounded-xl font-bold text-sm ${isActive(link.path) ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-white/5 text-slate-500'}`}
                            >
                                <link.icon size={20} className="shrink-0" />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            )}

            <NotificationModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </nav>
    );
};

export default Navbar;
