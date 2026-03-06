import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle, illustration }) {
    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Left side: Form */}
            <div className="flex flex-col flex-1 items-center justify-center w-full lg:w-1/2 px-6 sm:px-12 lg:px-16 xl:px-24 py-12">
                <div className="w-full max-w-md relative">

                    {/* Back to Home & Logo */}
                    <Link to="/" className="absolute -top-20 left-0 flex items-center gap-[10px] cursor-pointer">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0H0V24H12C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0Z" fill="#000000" />
                        </svg>
                        <span className="text-[20px] font-medium tracking-tight text-black">
                            HireAI
                        </span>
                    </Link>

                    <h1 className="text-[2rem] font-medium tracking-tight text-gray-900 mb-2 leading-tight">{title}</h1>
                    {subtitle && <p className="text-gray-500 mb-8 text-[15px]">{subtitle}</p>}

                    {children}
                </div>
            </div>

            {/* Right side: Illustration/Graphic Backdrop */}
            <div className="hidden lg:flex w-1/2 bg-[#FAFAF9] top-0 bottom-0 sticky h-screen items-center justify-center overflow-hidden border-l border-gray-100 p-12">

                {/* Soft Background Gradients mirroring the Hero section */}
                <div className="absolute inset-0 z-0" style={{
                    backgroundImage: `
            radial-gradient(circle at 40% 15%, rgba(255, 218, 195, 0.8) 0%, rgba(255, 255, 255, 0) 45%),
            radial-gradient(circle at 65% 60%, rgba(251, 222, 233, 0.6) 0%, rgba(255, 255, 255, 0) 50%)
            `
                }} />

                {/* Abstract Glass Card displaying product value proposition */}
                <div className="relative z-10 w-full max-w-md aspect-[4/5] rounded-[2.5rem] bg-white/40 border border-white shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center transition-transform hover:scale-[1.02] duration-500">
                    <div className="w-20 h-20 bg-[#050505] rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FEA945" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-medium text-gray-900 mb-4 tracking-tight">{illustration?.title || "Tailor your resume instantly."}</h2>
                    <p className="text-gray-600 text-[15px] leading-relaxed">
                        {illustration?.description || "Join thousands of applicants who are automating their job hunt and bypassing ATS filters with precision accuracy."}
                    </p>
                </div>

            </div>
        </div>
    );
}
