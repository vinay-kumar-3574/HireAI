import React from 'react';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, Briefcase, Settings, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function DashboardNavigation({ activeTab, setActiveTab, open, setOpen }) {
    const links = [
        { label: 'Dashboards', id: 'overview', icon: <LayoutDashboard className="h-5 w-5 shrink-0" /> },
        { label: 'Resumes', id: 'resumes', icon: <FileText className="h-5 w-5 shrink-0" /> },
        { label: 'Job Tracker', id: 'tracker', icon: <Briefcase className="h-5 w-5 shrink-0" /> },
        { label: 'Account', id: 'account', icon: <Settings className="h-5 w-5 shrink-0" /> },
    ];

    return (
        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10 bg-[#FAFAF9] border-r border-gray-200" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>

                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden pt-4">

                    {/* Top Logo injection matching Aceternity */}
                    <div className="mb-8 px-2 flex items-center">
                        {open ? <Logo /> : <LogoIcon />}
                    </div>

                    <div className="flex flex-col gap-2 relative z-20">
                        {links.map((link, idx) => {
                            const isActive = activeTab === link.id;
                            return (
                                <SidebarLink
                                    key={idx}
                                    link={link}
                                    onClick={() => setActiveTab(link.id)}
                                    active={isActive}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="mt-auto">
                    <CurrentPlanWidget setActiveTab={setActiveTab} />
                </div>

            </SidebarBody>
        </Sidebar>
    );
}

// Logo matching the Header aesthetic
export const Logo = () => {
    return (
        <Link to="/" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 overflow-hidden cursor-pointer">
            <div className="h-6 w-6 bg-black rounded-sm shrink-0 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0H0V24H12C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0Z" fill="#ffffff" />
                </svg>
            </div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold tracking-tight text-[18px] text-black whitespace-nowrap"
            >
                HireAI
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link to="/" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 cursor-pointer">
            <div className="h-6 w-6 bg-black rounded-sm shrink-0 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0H0V24H12C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0Z" fill="#ffffff" />
                </svg>
            </div>
        </Link>
    );
};

const CurrentPlanWidget = ({ setActiveTab }) => {
    const { open, animate } = useSidebar();

    return (
        <div className="border border-gray-200 mt-4 overflow-hidden rounded-xl bg-white shadow-sm transition-all">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/50">
                <TrendingUp className="w-5 h-5 text-gray-500 shrink-0" />
                <motion.span
                    animate={{
                        display: animate ? (open ? "inline-block" : "none") : "inline-block",
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                    Current Plan
                </motion.span>
            </div>

            <motion.div
                animate={{
                    height: animate ? (open ? "auto" : "0px") : "auto",
                    opacity: animate ? (open ? 1 : 0) : 1,
                    display: animate ? (open ? "block" : "none") : "block",
                }}
                className="px-4 py-4"
            >
                <h4 className="text-[14px] font-semibold text-gray-900 mb-3">Free Plan</h4>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-[12px]">
                        <span className="text-gray-500">Job extractions</span>
                        <span className="font-semibold text-gray-900">0/15</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-black w-[5%] h-full rounded-full" />
                    </div>

                    <div className="flex justify-between items-center text-[12px] pt-2">
                        <span className="text-gray-500">Tailored Resumes</span>
                        <span className="font-semibold text-gray-900">0/5</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-black w-[5%] h-full rounded-full" />
                    </div>
                </div>
                <button
                    onClick={() => setActiveTab('upgrade')}
                    className="w-full py-2 bg-black rounded-lg text-[13px] font-medium text-white hover:bg-gray-800 transition-colors shadow-sm"
                >
                    Upgrade Account
                </button>
            </motion.div>
        </div>
    )
}
