'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const login = useAuthStore((state) => state.login);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light overflow-x-hidden transition-colors duration-300">
            {/* Header */}
            <Navbar />
            {/* Main Content */}
            <main className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
                    {/* Left: Illustration */}
                    <aside className="hidden lg:flex items-center justify-center">
                        <div className="w-[520px] h-[440px] rounded-2xl bg-transparent flex items-center justify-center">
                            <svg viewBox="0 0 520 440" xmlns="http://www.w3.org/2000/svg" className="w-full h-full pointer-events-none">
                                <defs>
                                    <filter id="softLeft" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#000" floodOpacity="0.06" />
                                    </filter>
                                </defs>

                                <g opacity="0.95">
                                    <ellipse cx="160" cy="120" rx="120" ry="90" fill="#f8f5ee" />
                                    <ellipse cx="360" cy="260" rx="120" ry="100" fill="#eef7f4" />
                                </g>

                                <g transform="translate(140,190)" filter="url(#softLeft)">
                                    <rect x="0" y="0" width="220" height="26" rx="6" fill="#b67949" />
                                    <rect x="8" y="-38" width="204" height="30" rx="6" fill="#f2c27a" />
                                    <rect x="18" y="-74" width="188" height="28" rx="6" fill="#7fb7a4" />
                                    <rect x="30" y="-108" width="160" height="26" rx="6" fill="#6b84c6" />
                                    <path className="callig" d="M12 12 C70 2,150 2,208 12" />
                                    <path className="callig" d="M20 -22 C80 -32,160 -32,196 -22" />
                                    <path className="callig" d="M30 -60 C90 -70,160 -70,196 -60" />
                                    <path className="callig" d="M40 -96 C100 -106,150 -106,190 -96" />
                                </g>

                                <g transform="translate(60,260)">
                                    <rect x="0" y="0" width="120" height="86" rx="10" fill="#fff7e8" stroke="#f4e5c7" />
                                    <rect x="14" y="14" width="92" height="58" rx="6" fill="#fff" />
                                </g>

                                <g transform="translate(330,70)">
                                    <rect className="note n1" x="0" y="0" width="96" height="86" rx="10" fill="#fde7bb" stroke="#f6dca6" />
                                    <rect className="note n2" x="-50" y="120" width="78" height="68" rx="8" fill="#ffd9d0" stroke="#f1bdb5" />
                                    <rect className="note n3" x="100" y="140" width="72" height="56" rx="8" fill="#d6f5e7" stroke="#bfe9cf" />
                                </g>

                                <g transform="translate(420,320)">
                                    <circle cx="10" cy="10" r="6" fill="#f0d29b" opacity="0.95" />
                                    <rect x="28" y="6" width="34" height="8" rx="4" fill="#cfeafe" opacity="0.95" />
                                </g>
                            </svg>

                            <style>{`@keyframes float1 {0%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-12px) rotate(2deg)}100%{transform:translateY(0) rotate(-3deg)} }
                    @keyframes float2 {0%{transform:translateY(0) rotate(4deg)}50%{transform:translateY(-14px) rotate(-2deg)}100%{transform:translateY(0) rotate(4deg)} }
                    @keyframes float3 {0%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(3deg)}100%{transform:translateY(0) rotate(-2deg)} }
                    .n1{transform-origin:center;animation:float1 4s ease-in-out infinite}
                    .n2{transform-origin:center;animation:float2 5s ease-in-out infinite .6s}
                    .n3{transform-origin:center;animation:float3 4.5s ease-in-out infinite .2s}
                    .callig{fill:none;stroke:#ffffff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;opacity:0.95}
                `}</style>
                        </div>
                    </aside>
                    <section className="mx-auto w-full max-w-md lg:col-start-2">
                        <div className="layout-content-container flex flex-col w-full text-left">
                            <div className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm border border-[#e5e7eb] transition-colors duration-300">
                                {/* Heading */}
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-[#111418] text-3xl font-black leading-tight tracking-[-0.033em]">Sign in</h1>
                                    <p className="text-[#637588] text-base font-normal leading-normal">Access your encrypted notes securely.</p>
                                </div>

                                {/* Login Form */}
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    {error && (
                                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100">
                                            {error}
                                        </div>
                                    )}
                                    {/* Email Field */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[#111418] text-base font-medium leading-normal" htmlFor="email">
                                            Email Address
                                        </label>
                                        <input
                                            className="form-input flex w-full resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#d1d5db] bg-transparent focus:border-primary h-12 placeholder:text-[#9ca3af] px-4 text-base font-normal leading-normal transition-all"
                                            id="email"
                                            placeholder="name@example.com"
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[#111418] text-base font-medium leading-normal" htmlFor="password">
                                                Password
                                            </label>
                                        </div>
                                        <div className="relative flex w-full items-center rounded-lg">
                                            <input
                                                className="form-input flex w-full flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#d1d5db] bg-transparent focus:border-primary h-12 placeholder:text-[#9ca3af] pl-4 pr-12 text-base font-normal leading-normal transition-all"
                                                id="password"
                                                placeholder="Enter your password"
                                                required
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                aria-label="Toggle password visibility"
                                                className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-3 text-[#637588] hover:text-primary transition-colors cursor-pointer"
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {showPassword ? 'visibility' : 'visibility_off'}
                                                </span>
                                            </button>
                                        </div>
                                        <div className="flex justify-end mt-1">
                                            <Link className="text-primary text-sm font-medium hover:underline" href="#">
                                                Forgot Password?
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        className="w-full flex items-center justify-center rounded-lg bg-primary h-12 px-4 text-white text-base font-bold shadow-sm cursor-pointer hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        <span className="truncate">{isLoading ? 'Logging in...' : 'Log In'}</span>
                                    </button>
                                </form>

                                {/* Sign Up Link */}
                                <p className="text-center text-[#637588] text-sm">
                                    Don&apos;t have an account?
                                    <Link className="text-primary font-bold hover:underline ml-1" href="/auth/signup">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>

                            {/* Footer Info */}
                            <div className="mt-8 flex justify-center gap-6 text-[#637588] text-xs">
                                <Link className="hover:text-primary transition-colors" href="#">
                                    Privacy Policy
                                </Link>
                                <Link className="hover:text-primary transition-colors" href="#">
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Right: Illustration */}
                    <aside className="hidden lg:flex items-center justify-center">
                        <div className="w-[520px] h-[440px] rounded-2xl bg-transparent flex items-center justify-center">
                            <svg viewBox="0 0 520 440" xmlns="http://www.w3.org/2000/svg" className="w-full h-full pointer-events-none">
                                <defs>
                                    <filter id="softRight" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#000" floodOpacity="0.06" />
                                    </filter>
                                </defs>

                                {/* background abstract shape */}
                                <g opacity="0.95">
                                    <ellipse cx="160" cy="120" rx="120" ry="90" fill="#f8f5ee" />
                                    <ellipse cx="360" cy="260" rx="120" ry="100" fill="#eef7f4" />
                                </g>

                                {/* stacked books */}
                                <g transform="translate(140,190)" filter="url(#softRight)">
                                    <rect x="0" y="0" width="220" height="26" rx="6" fill="#b67949" />
                                    <rect x="8" y="-38" width="204" height="30" rx="6" fill="#f2c27a" />
                                    <rect x="18" y="-74" width="188" height="28" rx="6" fill="#7fb7a4" />
                                    <rect x="30" y="-108" width="160" height="26" rx="6" fill="#6b84c6" />
                                    <path className="callig" d="M12 12 C70 2,150 2,208 12" />
                                    <path className="callig" d="M20 -22 C80 -32,160 -32,196 -22" />
                                    <path className="callig" d="M30 -60 C90 -70,160 -70,196 -60" />
                                    <path className="callig" d="M40 -96 C100 -106,150 -106,190 -96" />
                                </g>

                                {/* folder / notebook */}
                                <g transform="translate(60,290)">
                                    <rect x="0" y="0" width="120" height="86" rx="10" fill="#fff7e8" stroke="#f4e5c7" />
                                    <rect x="14" y="14" width="92" height="58" rx="6" fill="#fff" />
                                    <g className="pin" transform="translate(96,18) rotate(-18)">
                                        <circle cx="0" cy="0" r="8" fill="#f4a261" stroke="#c6863d" strokeWidth="1.2" />
                                        <path d="M-4 6 L4 6 L0 14 Z" fill="#c6863d" />
                                    </g>
                                </g>

                                {/* floating sticky notes */}
                                <g transform="translate(330,70)">
                                    <rect className="note n1" x="0" y="0" width="96" height="86" rx="10" fill="#fde7bb" stroke="#f6dca6" />
                                    <rect className="note n2" x="-50" y="120" width="78" height="68" rx="8" fill="#ffd9d0" stroke="#f1bdb5" />
                                    <rect className="note n3" x="100" y="140" width="72" height="56" rx="8" fill="#d6f5e7" stroke="#bfe9cf" />
                                </g>

                                {/* small decorative accents */}
                                <g transform="translate(420,320)">
                                    <circle cx="10" cy="10" r="6" fill="#f0d29b" opacity="0.95" />
                                    <rect x="28" y="6" width="34" height="8" rx="4" fill="#cfeafe" opacity="0.95" />
                                </g>
                            </svg>

                            <style>{`@keyframes float1 {0%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-12px) rotate(2deg)}100%{transform:translateY(0) rotate(-3deg)} }
                    @keyframes float2 {0%{transform:translateY(0) rotate(4deg)}50%{transform:translateY(-14px) rotate(-2deg)}100%{transform:translateY(0) rotate(4deg)} }
                    @keyframes float3 {0%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(3deg)}100%{transform:translateY(0) rotate(-2deg)} }
                    .n1{transform-origin:center;animation:float1 4s ease-in-out infinite}
                    .n2{transform-origin:center;animation:float2 5s ease-in-out infinite .6s}
                    .n3{transform-origin:center;animation:float3 4.5s ease-in-out infinite .2s}
                    .callig{fill:none;stroke:#ffffff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;opacity:0.95}
                `}</style>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
