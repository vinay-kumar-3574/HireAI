import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import { authAPI } from '../services/api';

export default function Signup() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await authAPI.signup({ fullName, email, password });
            toast.success(`Account created! Welcome, ${data.user?.displayName || fullName}! 🚀`, {
                duration: 3500,
            });
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            const message =
                err.response?.data?.error ||
                err.response?.data?.errors?.[0] ||
                'Signup failed. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        toast('Redirecting to Google...', {
            icon: '🔗',
            duration: 2000,
        });
        setTimeout(() => authAPI.googleLogin(), 500);
    };

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Join HireAI and generate perfect resumes in seconds."
            illustration={{
                title: "Match ATS Systems.",
                description: "Our engine deeply analyzes your skills against the job description to maximize your application score."
            }}
        >
            <div className="space-y-6">
                {/* Social Auth (Google) */}
                <button
                    onClick={handleGoogleSignup}
                    className="w-full flex items-center justify-center gap-[10px] px-4 py-[13px] border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-[15px]">Sign up with Google</span>
                </button>

                <div className="flex items-center text-sm text-gray-400">
                    <div className="flex-1 border-t border-gray-100"></div>
                    <span className="px-5 text-[14px]">Or continue with email</span>
                    <div className="flex-1 border-t border-gray-100"></div>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSignup}>
                    <div className="space-y-1.5">
                        <label className="text-[14px] font-medium text-gray-700">Full name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none text-gray-400">
                                <User className="w-[18px] h-[18px]" strokeWidth={2.5} />
                            </div>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full pl-11 pr-4 py-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400 text-[15px]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[14px] font-medium text-gray-700">Email address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none text-gray-400">
                                <Mail className="w-[18px] h-[18px]" strokeWidth={2.5} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-11 pr-4 py-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400 text-[15px]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[14px] font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none text-gray-400">
                                <Lock className="w-[18px] h-[18px]" strokeWidth={2.5} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password (min 8 chars)"
                                className="w-full pl-11 pr-4 py-[13px] border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all placeholder:text-gray-400 text-[15px]"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#050505] text-[#fcfcfc] px-4 py-[14px] rounded-xl text-[15.5px] font-[500] hover:bg-[#1a1a1a] transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-[18px] h-[18px] animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create account
                                <ArrowRight className="w-[18px] h-[18px]" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-[14.5px] mt-8">
                    Already have an account? <Link to="/login" className="text-black font-medium hover:underline">Log in</Link>
                </p>
            </div>
        </AuthLayout>
    );
}
