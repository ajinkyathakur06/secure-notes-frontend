"use client";

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
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <div className="min-h-screen bg-[#fbf7ef]">
      <Navbar />

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          {/* Left: Illustration (duplicate of right) */}
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
          {/* Center: Login Card */}
          <section className="mx-auto w-full max-w-md lg:col-start-2">
            <div className="rounded-2xl bg-white p-8 shadow-lg border border-[#f1e9d8]">
              <div className="mb-3">
                <h1 className="text-3xl font-semibold text-[#0f1720]">Sign in</h1>
                <p className="mt-1 text-sm text-[#6b7280]">Access your encrypted notes securely</p>
              </div>

              {error && (
                <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 border border-red-100">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#374151]">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 block w-full rounded-lg border border-[#e6e9ec] bg-white px-4 py-3 placeholder:text-[#9aa3ad] focus:outline-none focus:ring-2 focus:ring-[#cfeafe] focus:border-[#a7d8ff] transition"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-[#374151]">Password</label>
                    <Link href="#" className="text-sm text-[#6b7280] hover:underline">Forgot password?</Link>
                  </div>
                  <div className="mt-2 relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-lg border border-[#e6e9ec] bg-white px-4 py-3 pr-12 placeholder:text-[#9aa3ad] focus:outline-none focus:ring-2 focus:ring-[#cfeafe] focus:border-[#a7d8ff] transition"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#374151]"
                    >
                      {showPassword ? (
                        <span className="material-symbols-outlined">visibility</span>
                      ) : (
                        <span className="material-symbols-outlined">visibility_off</span>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-[#d8b26a] hover:bg-[#caa45a] text-white py-3 font-semibold shadow-sm transition disabled:opacity-60"
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </button>
              </form>

              <div className="my-4 flex items-center">
                <div className="flex-1 border-t border-[#eef2f4]"></div>
                <span className="mx-4 text-sm text-[#9aa3ad]">or</span>
                <div className="flex-1 border-t border-[#eef2f4]"></div>
              </div>

              <div>
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#e9ecef] bg-white py-3 text-sm font-medium text-[#111827] shadow-sm hover:bg-[#fbfbfb] transition"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M21.6 12.227c0-.72-.063-1.413-.18-2.087H12v3.96h5.64c-.243 1.35-.98 2.5-2.09 3.26v2.708h3.38c1.97-1.81 3.12-4.48 3.12-7.84z" fill="#4285F4"></path>
                    <path d="M12 22c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 22 12 22z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-[#6b7280]">
                Don’t have an account?{' '}
                <Link href="#" className="font-semibold text-[#0f1720] hover:underline">Sign up</Link>
              </p>
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
