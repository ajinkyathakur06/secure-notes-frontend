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

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    console.log('Google login clicked');
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
                className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                <span className="truncate">{isLoading ? 'Logging in...' : 'Log In'}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#e5e7eb]"></div>
              <span className="flex-shrink-0 mx-4 text-[#637588] text-sm">or</span>
              <div className="flex-grow border-t border-[#e5e7eb]"></div>
            </div>

            {/* Social / Secondary Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg h-12 px-4 border border-[#e5e7eb] bg-transparent hover:bg-gray-50 text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
              >
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 20.45c-4.6666 0-8.4502-3.7836-8.4502-8.4502 0-4.6665 3.7836-8.45 8.4502-8.45 4.6665 0 8.45 3.7835 8.45 8.45 0 4.6666-3.7835 8.4502-8.45 8.4502zm0-15.3638c-3.8123 0-6.9138 3.1015-6.9138 6.9138 0 3.8122 3.1015 6.9137 6.9138 6.9137 3.8122 0 6.9137-3.1015 6.9137-6.9137 0-3.8123-3.1015-6.9138-6.9137-6.9138z"
                    fill="currentColor"
                    fillOpacity="0"
                  ></path>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span className="truncate">Continue with Google</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-[#637588] text-sm">
              Don&apos;t have an account?
              <Link className="text-primary font-bold hover:underline ml-1" href="#">
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
