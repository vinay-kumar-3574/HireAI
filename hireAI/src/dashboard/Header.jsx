import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function Header() {
    return (
        <header className="h-[80px] bg-white border-b border-gray-100 flex items-center justify-between px-8 w-full">

            {/* Empty Left Section - Logo is now in Sidebar */}
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

                {/* User Profile Avatar */}
                <div className="w-[36px] h-[36px] rounded-lg bg-[#FAFAF9] border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-900 shadow-sm cursor-pointer ml-2">
                    H
                </div>
            </div>
        </header>
    );
}
