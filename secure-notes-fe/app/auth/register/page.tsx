'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated, router]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name required';
    if (!lastName.trim()) e.lastName = 'Last name required';
    if (!email.trim()) e.email = 'Email required';
    if (!password) e.password = 'Password required';
    if (password && password.length < 8) e.password = 'Password min 8 chars';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords must match';
    if (!agreeToTerms) e.agreeToTerms = 'You must agree to terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      router.push('/auth/login');
    } catch (err) {
      console.error(err);
      setErrors({ form: 'Registration failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col font-display text-[#111418]">
      <Navbar showAuthLink={true} />

      <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[520px] bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center">
            <h1 className="text-3xl font-black text-[#111418] tracking-[-0.033em] mb-3">Create your account</h1>
            <p className="text-[#617289] text-base font-normal">Join SafeNote — secure, private notes at your fingertips.</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex flex-col flex-1">
                <span className="text-[#111418] text-sm font-medium leading-normal pb-2">First Name</span>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" type="text" className="form-input flex w-full rounded-lg border border-[#dbe0e6] bg-white h-12 px-4 text-base text-[#111418] placeholder-[#617289] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
                {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName}</span>}
              </label>

              <label className="flex flex-col flex-1">
                <span className="text-[#111418] text-sm font-medium leading-normal pb-2">Last Name</span>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" type="text" className="form-input flex w-full rounded-lg border border-[#dbe0e6] bg-white h-12 px-4 text-base text-[#111418] placeholder-[#617289] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
                {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName}</span>}
              </label>
            </div>

            <label className="flex flex-col w-full">
              <span className="text-[#111418] text-sm font-medium leading-normal pb-2">Email Address</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" type="email" className="form-input flex w-full rounded-lg border border-[#dbe0e6] bg-white h-12 px-4 text-base text-[#111418] placeholder-[#617289] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
              {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
            </label>

            <label className="flex flex-col w-full">
              <span className="text-[#111418] text-sm font-medium leading-normal pb-2">Password</span>
              <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" type="password" className="form-input w-full rounded-lg border border-[#dbe0e6] bg-white h-12 px-4 text-base text-[#111418] placeholder-[#617289] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
              {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password}</span>}
            </label>

            <label className="flex flex-col w-full">
              <span className="text-[#111418] text-sm font-medium leading-normal pb-2">Confirm Password</span>
              <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" type="password" className="form-input w-full rounded-lg border border-[#dbe0e6] bg-white h-12 px-4 text-base text-[#111418] placeholder-[#617289] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" />
              {errors.confirmPassword && <span className="text-red-500 text-xs mt-1">{errors.confirmPassword}</span>}
            </label>

            <div className="flex items-start gap-3">
              <input id="terms" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
              <label htmlFor="terms" className="text-sm text-[#617289] leading-snug">I agree to the{' '}<Link className="text-primary hover:underline font-medium" href="#">Terms of Service</Link>{' '}and{' '}<Link className="text-primary hover:underline font-medium" href="#">Privacy Policy</Link>.</label>
            </div>
            {errors.agreeToTerms && <span className="text-red-500 text-xs">{errors.agreeToTerms}</span>}

            {errors.form && <div className="text-red-500 text-sm">{errors.form}</div>}

            <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center rounded-lg bg-primary h-12 px-4 text-white text-base font-bold shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Creating Account...' : 'Create Account'}</button>

            <div className="px-8 pb-8 text-center sm:hidden">
              <span className="text-sm text-[#617289]">Already have an account?</span>
              <Link className="text-primary font-bold text-sm ml-1 hover:underline" href="/auth/login">Log in</Link>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full py-6 flex justify-center gap-8 text-[#617289]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">lock</span>
          <span className="text-xs font-medium">End-to-end Encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span className="text-xs font-medium">SOC2 Compliant</span>
        </div>
      </div>
    </div>
  );
}
