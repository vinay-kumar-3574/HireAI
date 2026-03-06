import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Overview() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
    const dropdownRef = useRef(null);

    const periods = ["Monthly", "Weekly", "All Time"];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Dynamically fetch the cards based on current Analysis Period
    const getCardsContent = () => {
        if (selectedPeriod === "Weekly") {
            return [
                { id: "w1", title: "All Time", value: "0", desc: "Total applications" },
                { id: "w2", title: "Weekly", value: "0", desc: "Applications this week" },
                { id: "w3", title: "Today", value: "0", desc: "Applications today" },
            ];
        }
        if (selectedPeriod === "All Time") {
            return [
                { id: "a1", title: "All Time", value: "0", desc: "Total applications" },
                { id: "a2", title: "This Year", value: "0", desc: "Applications this year" },
                { id: "a3", title: "This Month", value: "0", desc: "Applications this month" },
            ];
        }
        // Default (Monthly)
        return [
            { id: "m1", title: "All Time", value: "0", desc: "Total applications" },
            { id: "m2", title: "Monthly", value: "0", desc: "Applications in last 30 days" },
            { id: "m3", title: "Last 7 Days", value: "0", desc: "Applications in last 7 days" },
        ];
    };

    const cards = getCardsContent();

    return (
        <div className="max-w-6xl mx-auto px-8 py-8">

            {/* Top Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Overview</h1>

                <div className="relative z-50" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-3 bg-white border px-4 py-2.5 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-black/5 ${isDropdownOpen ? 'border-gray-300 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}
                    >
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">Analysis Period:</span>
                        <span className="text-sm font-bold text-gray-900">{selectedPeriod}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Animated Dropdown */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
                            >
                                <div className="p-1">
                                    {periods.map((period) => (
                                        <button
                                            key={period}
                                            onClick={() => {
                                                setSelectedPeriod(period);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedPeriod === period
                                                ? 'bg-gray-50 text-black'
                                                : 'text-gray-600 hover:bg-gray-50/80 hover:text-black'
                                                }`}
                                        >
                                            {period}
                                            {selectedPeriod === period && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                >
                                                    <Check className="w-4 h-4 text-black" strokeWidth={3} />
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Dynamic Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative">
                <AnimatePresence mode="popLayout">
                    {cards.map((card) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
                            className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col items-start hover:shadow-md transition-shadow"
                        >
                            <span className="text-gray-500 font-medium mb-4 text-sm">{card.title}</span>
                            <span className="text-5xl font-bold tracking-tight text-black mb-2">{card.value}</span>
                            <span className="text-gray-400 text-sm">{card.desc}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Trends Graph Placeholder */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 min-h-[350px] flex flex-col relative z-0">
                <h2 className="text-[20px] font-bold text-gray-900 mb-1">Application Trends</h2>
                <p className="text-gray-500 text-sm mb-12">Track the number of jobs viewed and jobs applied over time</p>

                {/* Empty State */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-12 opacity-40">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-gray-400">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span className="text-gray-500 font-medium">No application data yet</span>
                </div>
            </div>

        </div>
    );
}
