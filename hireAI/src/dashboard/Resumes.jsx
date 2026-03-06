import React from 'react';
import { UploadCloud, PenLine } from 'lucide-react';

export default function Resumes() {
    return (
        <div className="max-w-[760px] mx-auto px-8 py-12">

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Create New Resume</h1>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-8">

                {/* Input */}
                <div className="space-y-2">
                    <label className="text-[15px] font-semibold text-gray-900">
                        Resume Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Software Engineer Resume"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400 text-[15px]"
                    />
                    <p className="text-xs text-gray-500">Please enter a name for your resume</p>
                </div>

                {/* Upload Dropzone */}
                <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors cursor-pointer group bg-gray-50/50">

                    <div className="flex items-start gap-4 p-5 border-b border-gray-100 bg-white">
                        <div className="bg-[#fcfcfc] border border-gray-100 shadow-sm w-10 h-10 rounded-lg flex items-center justify-center text-black shrink-0">
                            <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-[16px] font-semibold text-gray-900">Upload Resume</h3>
                            <p className="text-sm text-gray-500">Upload your existing resume and we'll extract the information</p>
                        </div>
                    </div>

                    {/* Inner Drop Area */}
                    <div className="p-8 pb-10">
                        <div className="border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-10 bg-white group-hover:bg-[#fafaf9] transition-colors">
                            <UploadCloud className="w-10 h-10 text-gray-400 mb-4" strokeWidth={1.5} />
                            <p className="text-gray-600 font-medium text-[15px] text-center mb-1">
                                Upload or drag and drop your resume
                            </p>
                            <p className="text-gray-400 text-sm">PDF, DOCX</p>
                        </div>
                    </div>
                </div>

                {/* Build from Scratch Option */}
                <div className="border border-gray-200 rounded-xl flex items-start gap-4 p-5 hover:border-gray-300 transition-colors cursor-pointer bg-white">
                    <div className="bg-[#fbfdfc] border border-gray-100 shadow-sm w-10 h-10 rounded-lg flex items-center justify-center text-black shrink-0">
                        <PenLine className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-semibold text-gray-900">Build from Scratch</h3>
                        <p className="text-sm text-gray-500">Start fresh and build your resume step by step</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
