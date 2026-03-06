import React from 'react';
import { Search, Plus, MoreHorizontal, Building2, MapPin, DollarSign, Calendar } from 'lucide-react';

export default function JobTracker() {
    const stages = [
        { id: 'saved', label: 'Saved', count: 2, color: 'bg-gray-100' },
        { id: 'applied', label: 'Applied', count: 3, color: 'bg-blue-100' },
        { id: 'interview', label: 'Interviewing', count: 1, color: 'bg-yellow-100' },
        { id: 'offer', label: 'Offers', count: 0, color: 'bg-green-100' },
        { id: 'rejected', label: 'Rejected', count: 0, color: 'bg-red-100' },
    ];

    const mockJobs = [
        {
            id: 1,
            role: 'Frontend Engineer',
            company: 'TechCorp Inc.',
            location: 'Remote, US',
            salary: '$120k - $150k',
            date: 'Applied 2 days ago',
            stage: 'applied',
            logo: 'T',
        },
        {
            id: 2,
            role: 'Full Stack Developer',
            company: 'Startup XYZ',
            location: 'New York, NY',
            salary: '$130k - $160k',
            date: 'Saved yesterday',
            stage: 'saved',
            logo: 'S',
        },
        {
            id: 3,
            role: 'React Specialist',
            company: 'Global Solutions',
            location: 'Austin, TX',
            salary: '$110k - $140k',
            date: 'Interview next Tue',
            stage: 'interview',
            logo: 'G',
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-8 py-8 h-full flex flex-col">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 shrink-0">
                <div>
                    <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Job Tracker</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and track your job application pipeline.</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm"
                        />
                    </div>
                    <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm shrink-0">
                        <Plus className="w-4 h-4" />
                        Add Job
                    </button>
                </div>
            </div>

            {/* Kanban Board Container */}
            <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">

                {stages.map(stage => (
                    <div key={stage.id} className="w-[320px] shrink-0 flex flex-col">

                        {/* Stage Header */}
                        <div className={`px-4 py-3 rounded-t-xl border border-b-0 border-gray-200 flex items-center justify-between ${stage.color}`}>
                            <h3 className="font-semibold text-gray-900 text-[15px]">{stage.label}</h3>
                            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-600 shadow-sm">
                                {stage.count}
                            </span>
                        </div>

                        {/* Stage Column */}
                        <div className="flex-1 bg-gray-50/50 border border-t-0 border-gray-200 rounded-b-xl p-3 flex flex-col gap-3 min-h-[300px]">

                            {mockJobs.filter(job => job.stage === stage.id).map(job => (

                                /* Job Card */
                                <div key={job.id} className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-700">
                                                {job.logo}
                                            </div>
                                            <div>
                                                <h4 className="text-[15px] font-semibold text-gray-900 leading-tight">{job.role}</h4>
                                                <span className="text-sm font-medium text-gray-500">{job.company}</span>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                                            {job.salary}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {job.date}
                                        </div>
                                    </div>
                                </div>

                            ))}

                            {mockJobs.filter(job => job.stage === stage.id).length === 0 && (
                                <div className="flex items-center justify-center h-20 text-sm font-medium text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                    Drop jobs here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
