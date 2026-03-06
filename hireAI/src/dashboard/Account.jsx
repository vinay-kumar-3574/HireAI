import React from 'react';
import { User, Bell, Shield, Wallet, CreditCard, LogOut, Plus } from 'lucide-react';

export default function Account() {
    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'billing', label: 'Billing & Plan', icon: Wallet },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">

            <div className="mb-10">
                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Account Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account preferences and billing information.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-10">

                {/* Navigation Sidebar */}
                <div className="w-full md:w-64 shrink-0 space-y-1">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all text-left ${tab.id === 'profile'
                                    ? 'bg-white shadow-sm border border-gray-200 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 transparent border border-transparent'
                                    }`}
                            >
                                <Icon className="w-4 h-4" strokeWidth={2} />
                                {tab.label}
                            </button>
                        )
                    })}

                    <div className="pt-6 mt-6 border-t border-gray-200">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all text-left text-red-600 hover:bg-red-50 hover:text-red-700">
                            <LogOut className="w-4 h-4" strokeWidth={2} />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-8">

                    {/* Profile Section */}
                    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">Personal Information</h2>
                            <button className="text-[14px] font-medium text-[#5865F2] hover:text-[#4752C4]">Edit Profile</button>
                        </div>
                        <div className="p-6">

                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-700 shadow-inner">
                                    H
                                </div>
                                <div>
                                    <h3 className="text-[18px] font-bold text-gray-900">John Doe</h3>
                                    <p className="text-[15px] text-gray-500">Software Engineer</p>
                                    <button className="mt-3 text-[13px] font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                                        Upload new photo
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <p className="text-[15px] font-medium text-gray-900">John Doe</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <p className="text-[15px] font-medium text-gray-900">john.doe@example.com</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Location</label>
                                    <p className="text-[15px] font-medium text-gray-900">San Francisco, CA</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Joined Date</label>
                                    <p className="text-[15px] font-medium text-gray-900">March 2026</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Connected Accounts Section */}
                    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">Connected Accounts</h2>
                        </div>
                        <div className="p-6 space-y-4">

                            <div className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50/50 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-semibold text-gray-900">Google</h4>
                                        <p className="text-sm text-gray-500">Connected as john.doe@gmail.com</p>
                                    </div>
                                </div>
                                <button className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                                    Disconnect
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.5 6-6.76 0-1.47-.5-2.7-1.3-3.6.13-.34.56-1.7-.1-3.56 0 0-1.07-.34-3.5 1.3A12.3 12.3 0 0 0 12 5.5a12.3 12.3 0 0 0-3.5-1.3c-2.43-1.64-3.5-1.3-3.5-1.3-.66 1.86-.23 3.22-.1 3.56-.8.9-1.3 2.13-1.3 3.6 0 5.24 3 6.4 6 6.76-.8.6-1 1.8-1 2.8V22"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-semibold text-gray-900">GitHub</h4>
                                        <p className="text-sm text-gray-500">Not connected</p>
                                    </div>
                                </div>
                                <button className="text-sm font-medium text-white bg-black hover:bg-gray-800 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    Connect
                                </button>
                            </div>

                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
