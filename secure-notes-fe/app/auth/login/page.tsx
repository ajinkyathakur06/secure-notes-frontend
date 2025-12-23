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
      <Navbar/>
      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="layout-content-container flex flex-col w-full max-w-[480px]">
          {/* Card Container */}
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
      </main>

      {/* Subtle Abstract Background Elements */}
      <div className="pointer-events-none absolute top-0 left-0 -z-10 h-full w-full overflow-hidden opacity-40">
        <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]"></div>
        <div className="absolute top-[40%] -right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[120px]"></div>
      </div>
    </div>
  );
}
