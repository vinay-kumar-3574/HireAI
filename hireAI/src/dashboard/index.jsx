import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Overview from './Overview';
import Resumes from './Resumes';
import JobTracker from './JobTracker';
import Account from './Account';
import Upgrade from './Upgrade';
import DashboardNavigation from './Sidebar';
import { authAPI } from '../services/api';

export default function DashboardLayout() {
    const [activeTab, setActiveTab] = useState('overview');
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Fetch logged-in user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await authAPI.getCurrentUser();
                setUser(data.user);
            } catch (err) {
                // Not authenticated → redirect to login
                console.log('Not authenticated, redirecting...');
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview />;
            case 'resumes':
                return <Resumes />;
            case 'tracker':
                return <JobTracker />;
            case 'account':
                return <Account />;
            case 'upgrade':
                return <Upgrade />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row bg-[#FAFAF9] w-full min-h-screen">

            {/* Animated Aceternity Sidebar */}
            <DashboardNavigation activeTab={activeTab} setActiveTab={setActiveTab} open={open} setOpen={setOpen} />

            {/* Main Content Pane */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white md:rounded-tl-2xl border-t border-l border-gray-200 mt-[80px] md:mt-[10px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] m-0 md:mr-3 md:mb-3">
                <Header user={user} />
                <main className="flex-1 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>

        </div>
    );
}
