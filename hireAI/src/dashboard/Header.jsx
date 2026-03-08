import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, LogOut, User, Settings, ChevronDown, Download, X, Copy, Check, ExternalLink } from 'lucide-react';
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
    const [showExtensionModal, setShowExtensionModal] = useState(false);
    const [copied, setCopied] = useState(false);
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

                <button
                    onClick={() => setShowExtensionModal(true)}
                    className="hidden sm:flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
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

            {/* Extension Installation Modal */}
            {showExtensionModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={() => setShowExtensionModal(false)}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-[480px] max-w-[90vw] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'dropdownFadeIn 0.2s ease-out' }}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
                                    <Download className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-bold text-gray-900">Install Chrome Extension</h3>
                                    <p className="text-[12px] text-gray-500">AI Assistant on Every Job Page</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowExtensionModal(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5">
                            <div className="space-y-4">
                                {/* Step 1 */}
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">1</div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-900">Open Chrome Extensions Page</p>
                                        <p className="text-[12px] text-gray-500 mt-0.5">Copy the URL below and paste it in your browser's address bar:</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <code className="flex-1 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[12px] font-mono text-gray-700">chrome://extensions</code>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText('chrome://extensions');
                                                    setCopied(true);
                                                    toast.success('Copied to clipboard!');
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px] font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                            >
                                                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                {copied ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">2</div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-900">Enable Developer Mode</p>
                                        <p className="text-[12px] text-gray-500 mt-0.5">Toggle the <span className="font-semibold text-gray-700">"Developer mode"</span> switch in the top-right corner of the page.</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">3</div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-900">Load the Extension</p>
                                        <p className="text-[12px] text-gray-500 mt-0.5">Click <span className="font-semibold text-gray-700">"Load unpacked"</span> and select the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px] font-mono">chrome-extension</code> folder from the project directory.</p>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">4</div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-900">Pin & Activate</p>
                                        <p className="text-[12px] text-gray-500 mt-0.5">Click the puzzle icon <span className="font-semibold">🧩</span> in the toolbar, find <span className="font-semibold text-gray-700">HireAI</span>, and pin it. Then visit any job page and click the icon!</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-[11px] text-gray-400">Works on LinkedIn, GitHub, Indeed & more</p>
                            <button
                                onClick={() => setShowExtensionModal(false)}
                                className="px-4 py-2 bg-black text-white rounded-lg text-[13px] font-medium hover:bg-gray-800 transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
