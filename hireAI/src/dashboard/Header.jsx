import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

export default function Header({ user }) {
    const displayName = user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
    const displayEmail = user?.email || '—';
    const initial = displayName.charAt(0).toUpperCase();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await authAPI.logout();
            toast.success('Logged out successfully. See you soon! 👋', { duration: 3000 });
            setTimeout(() => navigate('/login'), 600);
        } catch (err) {
            toast.error('Logout failed. Please try again.');
        } finally {
            setLoggingOut(false);
            setDropdownOpen(false);
        }
    };

    return (
        <header className="h-[80px] bg-white border-b border-gray-100 flex items-center justify-between px-8 w-full relative z-[100]">

            {/* Left Section */}
            <div className="flex items-center gap-6">
                <h2 className="text-[17px] font-semibold tracking-tight text-gray-900 hidden md:block">Dashboard</h2>
            </div>

            {/* Right section: Actions */}
            <div className="flex items-center gap-6">

                <div className="hidden lg:flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">Jobs</span>
                    <span className="text-[10px] font-bold tracking-wider text-black bg-gray-100 px-2.5 py-1 rounded-sm uppercase">Soon</span>
                </div>

                <button className="hidden sm:block bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
                    Install Extension
                </button>

                <a href="#" className="hidden md:block text-sm font-medium text-gray-600 hover:text-black transition-colors">How it works</a>

                <button className="hidden sm:flex items-center gap-2 bg-[#5865F2] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4752C4] transition-colors shadow-sm">
                    <MessageSquare className="w-4 h-4" />
                    Need Help?
                </button>

                {/* User Profile Avatar + Dropdown */}
                <div className="relative ml-2" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <div className="w-[36px] h-[36px] rounded-lg bg-[#FAFAF9] border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-900 shadow-sm group-hover:border-gray-300 group-hover:shadow-md transition-all">
                            {initial}
                        </div>
                        <ChevronDown
                            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div
                            className="absolute right-0 top-[calc(100%+8px)] w-[220px] bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/8 py-1.5 z-[200]"
                            style={{ animation: 'dropdownFadeIn 0.15s ease-out' }}
                        >
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-[13.5px] font-semibold text-gray-900 truncate">{displayName}</p>
                                <p className="text-[12px] text-gray-500 mt-0.5 truncate">{displayEmail}</p>
                            </div>

                            <div className="py-1">
                                <button
                                    onClick={() => { setDropdownOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <User className="w-4 h-4 text-gray-400" />
                                    My Profile
                                </button>
                                <button
                                    onClick={() => { setDropdownOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Settings className="w-4 h-4 text-gray-400" />
                                    Settings
                                </button>
                            </div>

                            <div className="border-t border-gray-100 py-1">
                                <button
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {loggingOut ? 'Logging out...' : 'Log out'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Dropdown animation keyframes */}
            <style>{`
                @keyframes dropdownFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-4px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </header>
    );
}
