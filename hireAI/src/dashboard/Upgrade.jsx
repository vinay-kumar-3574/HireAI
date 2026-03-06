import React, { useState } from 'react';
import { Lock, Check } from 'lucide-react';

export default function Upgrade() {
    return (
        <div className="max-w-[1100px] mx-auto px-8 py-16">
            <div className="mb-12 text-center">
                <h1 className="text-[32px] font-bold text-gray-900 tracking-tight mb-3">Upgrade your plan</h1>
                <p className="text-gray-500 text-[16px]">Choose the perfect plan for your job hunt.</p>
            </div>

            <div className="bg-white border text-center border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col w-full">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                        <tr>
                            <th className="w-[18%] p-6 border-b border-r border-gray-100 bg-white"></th>

                            {/* Free */}
                            <th className="w-[20%] p-6 py-8 border-b border-r border-gray-100 text-center bg-white align-top">
                                <h3 className="text-[20px] font-bold text-gray-900 mb-1">Free</h3>
                                <p className="text-[14px] text-gray-500 font-medium mb-6 h-[20px]">truly free forever</p>
                                <div className="flex items-baseline justify-center gap-1 mt-6">
                                    <span className="text-[36px] font-bold text-gray-900">$0</span>
                                    <span className="text-[14px] text-gray-500 font-normal">/month</span>
                                </div>
                            </th>

                            {/* Basic */}
                            <th className="w-[20%] p-6 py-8 border-b border-r border-gray-100 text-center bg-white align-top">
                                <h3 className="text-[20px] font-bold text-[#1a2333] mb-1">Basic</h3>
                                <p className="text-[14px] text-gray-500 font-medium mb-6 h-[20px]">for active job hunting</p>
                                <div className="flex flex-col items-center">
                                    <span className="text-[16px] text-gray-400 font-medium leading-none mb-1 line-through">$9.99</span>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-[36px] font-bold text-gray-900 leading-none">$7.99</span>
                                        <span className="text-[14px] text-gray-500 font-normal">/month</span>
                                    </div>
                                </div>
                            </th>

                            {/* Pro */}
                            <th className="w-[20%] p-6 py-8 border-b border-r border-[#e8f5ec] text-center bg-[#F4FBF7] align-top relative">
                                <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1/2 mt-3">
                                    <span className="bg-[#10B981] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-[0_2px_8px_rgba(16,185,129,0.25)]">Popular</span>
                                </div>
                                <h3 className="text-[20px] font-bold text-[#1a2333] mb-1 mt-2">Pro</h3>
                                <p className="text-[14px] text-gray-500 font-medium mb-6 h-[20px]">for serious job hunters</p>
                                <div className="flex flex-col items-center">
                                    <span className="text-[16px] text-gray-400 line-through font-medium leading-none mb-1">$24.99</span>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-[36px] font-bold text-[#10B981] leading-none">$19.99</span>
                                        <span className="text-[14px] text-gray-500 font-normal">/month</span>
                                    </div>
                                </div>
                            </th>

                            {/* Elite */}
                            <th className="w-[22%] p-6 py-8 border-b border-gray-100 text-center bg-white align-top">
                                <h3 className="text-[20px] font-bold text-[#1a2333] mb-1">Elite</h3>
                                <p className="text-[14px] text-gray-500 font-medium mb-6 h-[20px] leading-tight px-4">for power users and teams</p>
                                <div className="flex flex-col items-center">
                                    <span className="text-[16px] text-gray-400 line-through font-medium leading-none mb-1">$34.99</span>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-[36px] font-bold text-gray-900 leading-none">$27.99</span>
                                        <span className="text-[14px] text-gray-500 font-normal">/month</span>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Tailored resumes */}
                        <tr>
                            <td className="p-5 px-6 border-b border-r border-gray-100 text-[15px] font-semibold text-gray-700 bg-white">Tailored resumes</td>
                            <td className="p-5 border-b border-r border-gray-100 text-center text-[15px] font-bold text-gray-900 bg-white">5</td>
                            <td className="p-5 border-b border-r border-gray-100 text-center text-[15px] font-bold text-gray-900 bg-white">100</td>
                            <td className="p-5 border-b border-r border-[#e8f5ec] text-center text-[15px] font-bold text-gray-900 bg-[#FAFDFA]">500</td>
                            <td className="p-5 border-b border-gray-100 text-center text-[15px] font-bold text-gray-900 bg-white">Unlimited</td>
                        </tr>

                        {/* Cover letters */}
                        <tr>
                            <td className="p-5 px-6 border-b border-r border-gray-100 text-[15px] font-semibold text-gray-700 bg-white">Cover letters</td>
                            <td className="p-5 border-b border-r border-gray-100 text-center text-[15px] font-bold text-gray-900 bg-white">2</td>
                            <td className="p-5 border-b border-r border-gray-100 text-center text-[15px] font-bold text-gray-900 bg-white">100</td>
                            <td className="p-5 border-b border-r border-[#e8f5ec] text-center text-[15px] font-bold text-gray-900 bg-[#FAFDFA]">500</td>
                            <td className="p-5 border-b border-gray-100 text-center text-[15px] font-bold text-gray-900 bg-white">Unlimited</td>
                        </tr>

                        {/* Resume uploads */}
                        <tr>
                            <td className="p-5 px-6 border-b border-r border-gray-100 text-[15px] font-semibold text-gray-700 bg-white">Resume uploads</td>
                            <td className="p-5 border-b border-r border-gray-100 text-center text-[15px] font-bold text-gray-900 bg-white">1</td>
                            <td className="p-5 border-b border-r border-gray-100 text-center text-[15px] font-bold text-gray-900 bg-white">5</td>
                            <td className="p-5 border-b border-r border-[#e8f5ec] text-center text-[15px] font-bold text-gray-900 bg-[#FAFDFA]">Unlimited</td>
                            <td className="p-5 border-b border-gray-100 text-center text-[15px] font-bold text-gray-900 bg-white">Unlimited</td>
                        </tr>

                        {/* Analytics */}
                        <tr>
                            <td className="p-5 px-6 border-b border-r border-gray-100 text-[15px] font-semibold text-gray-700 bg-white">Analytics</td>
                            <td className="p-5 border-b border-r border-gray-100 text-center bg-white">
                                <div className="flex justify-center"><div className="w-[28px] h-[28px] rounded-full bg-gray-100 flex items-center justify-center border border-gray-200"><Lock className="w-[12px] h-[12px] text-gray-300" strokeWidth={2.5} /></div></div>
                            </td>
                            <td className="p-5 border-b border-r border-gray-100 text-center bg-white">
                                <div className="flex justify-center"><div className="w-[28px] h-[28px] rounded-full bg-gray-100 flex items-center justify-center border border-gray-200"><Lock className="w-[12px] h-[12px] text-gray-300" strokeWidth={2.5} /></div></div>
                            </td>
                            <td className="p-5 border-b border-r border-[#e8f5ec] text-center bg-[#FAFDFA]">
                                <div className="flex justify-center"><div className="w-[28px] h-[28px] rounded-full bg-[#E0F2E9] flex items-center justify-center"><Check className="w-[14px] h-[14px] text-[#10B981]" strokeWidth={3} /></div></div>
                            </td>
                            <td className="p-5 border-b border-gray-100 text-center bg-white">
                                <div className="flex justify-center"><div className="w-[28px] h-[28px] rounded-full bg-[#E0F2E9] flex items-center justify-center"><Check className="w-[14px] h-[14px] text-[#10B981]" strokeWidth={3} /></div></div>
                            </td>
                        </tr>

                        {/* Footers / Buttons */}
                        <tr>
                            <td className="p-6 px-6 border-r border-gray-100 bg-white text-[13px] text-gray-500 font-medium">Build your free resume.</td>
                            <td className="p-6 border-r border-gray-100 text-center bg-white">
                                <button className="w-full py-2.5 rounded-full text-[15px] font-semibold bg-gray-100 text-gray-400 cursor-not-allowed">Current plan</button>
                            </td>
                            <td className="p-6 border-r border-gray-100 text-center bg-white">
                                <button className="w-full py-2.5 rounded-full text-[15px] font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">Upgrade</button>
                            </td>
                            <td className="p-6 border-r border-[#e8f5ec] text-center bg-[#FAFDFA]">
                                <button className="w-full py-2.5 rounded-full text-[15px] font-semibold bg-[#10B981] text-white hover:bg-[#059669] transition-colors shadow-sm tracking-wide">Upgrade</button>
                            </td>
                            <td className="p-6 text-center bg-white">
                                <button className="w-full py-2.5 rounded-full text-[15px] font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">Upgrade</button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    );
}
