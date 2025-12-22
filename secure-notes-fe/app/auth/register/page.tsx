'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

export default function RegisterPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual registration API call
      console.log('Registration data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert('Account created successfully! (Demo)');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      });
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth signup
    console.log('Google signup clicked');
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col font-display text-[#111418]">
      {/* Top Navigation */}
      <Navbar showAuthLink={true} />

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[520px] bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden">
          {/* Header Section */}
          <div className="px-8 pt-10 pb-6 text-center">
            <h1 className="text-3xl font-black text-[#111418] tracking-[-0.033em] mb-3">
              Get started with SafeNote
            </h1>
            <p className="text-[#617289] text-base font-normal">
              Securely store your thoughts, lists, and ideas.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
            {/* Name Fields Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex flex-col flex-1">
                <span className="text-[#111418] text-sm font-medium leading-normal pb-2">
                  First Name
                </span>
                <input
                  className={`form-input flex w-full rounded-lg border ${
                    errors.firstName ? 'border-red-500' : 'border-[#dbe0e6]'
                  } bg-white h-12 px-4 text-base text-[#111418] placeholder-[#617289] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all`}
                  placeholder="Jane"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-xs mt-1">{errors.firstName}</span>
                )}
              </label>
              <label className="flex flex-col flex-1">
                <span className="text-[#111418] text-sm font-medium leading-normal pb-2">
                  Last Name
                </span>
                <input
                  className={`form-input flex w-full rounded-lg border ${
                    errors.lastName ? 'border-red-500' : 'border-[#dbe0e6]'
                  } bg-white h-12 px-4 text-base text-[#111418] placeholder-[#617289] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all`}
                  placeholder="Doe"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <span className="text-red-500 text-xs mt-1">{errors.lastName}</span>
                )}
              </label>
            </div>

            {/* Email Field */}
            <label className="flex flex-col w-full">
              <span className="text-[#111418] text-sm font-medium leading-normal pb-2">
                Email Address
              </span>
              <div className="relative flex items-center">
                <input
                  className={`form-input flex w-full rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-[#dbe0e6]'
                  } bg-white h-12 px-4 text-base text-[#111418] placeholder-[#617289] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all`}
                  placeholder="jane@example.com"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">{errors.email}</span>
              )}
            </label>

            {/* Password Field */}
            <label className="flex flex-col w-full">
              <span className="text-[#111418] text-sm font-medium leading-normal pb-2">
                Password
              </span>
              <div
                className={`relative flex w-full rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-[#dbe0e6]'
                } bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all`}
              >
                <input
                  className="form-input flex-1 bg-transparent border-none h-12 px-4 text-base text-[#111418] placeholder-[#617289] focus:ring-0 focus:outline-none"
                  placeholder="Create a password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  className="flex items-center justify-center px-4 text-[#617289] hover:text-[#111418] transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">{errors.password}</span>
              )}
            </label>

            {/* Confirm Password Field */}
            <label className="flex flex-col w-full">
              <span className="text-[#111418] text-sm font-medium leading-normal pb-2">
                Confirm Password
              </span>
              <div
                className={`relative flex w-full rounded-lg border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-[#dbe0e6]'
                } bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all`}
              >
                <input
                  className="form-input flex-1 bg-transparent border-none h-12 px-4 text-base text-[#111418] placeholder-[#617289] focus:ring-0 focus:outline-none"
                  placeholder="Confirm your password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  className="flex items-center justify-center px-4 text-[#617289] hover:text-[#111418] transition-colors"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs mt-1">{errors.confirmPassword}</span>
              )}
            </label>

            {/* Terms Checkbox */}
            <div className="flex flex-col gap-1 pt-2">
              <div className="flex items-start gap-3">
                <input
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  id="terms"
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
                <label className="text-sm text-[#617289] leading-snug" htmlFor="terms">
                  I agree to the{' '}
                  <Link className="text-primary hover:underline font-medium" href="#">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link className="text-primary hover:underline font-medium" href="#">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {errors.agreeToTerms && (
                <span className="text-red-500 text-xs ml-7">{errors.agreeToTerms}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              className="w-full flex items-center justify-center rounded-lg bg-primary h-12 px-4 text-white text-base font-bold shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e7eb]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-[#617289]">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <button
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-[#dbe0e6] bg-white h-12 px-4 text-[#111418] text-sm font-bold hover:bg-gray-50 transition-colors"
              type="button"
              onClick={handleGoogleSignup}
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M12.0003 20.45c4.6652 0 8.5912-3.926 8.5912-8.5913 0-4.6652-3.926-8.5912-8.5912-8.5912-4.6652 0-8.5913 3.926-8.5913 8.5912 0 4.6653 3.9261 8.5913 8.5913 8.5913z"
                  fill="#fff"
                ></path>
                <path
                  d="M12.4275 19.3498c3.5575 0 6.6493-2.5298 7.3752-6.0465h-7.3752v-2.3134h10.2312c.1126.6575.1126 1.4875.1126 2.4578 0 4.385-2.9268 8.0199-7.2288 8.0199-4.1725 0-7.5562-3.3838-7.5562-7.5563 0-4.1725 3.3837-7.5562 7.5562-7.5562 2.015 0 3.8213.7225 5.2313 1.905l-1.9288 1.9287c-.8387-.6775-1.9275-1.0775-3.3025-1.0775-2.7337 0-4.9437 2.21-4.9437 4.9438s2.21 4.9437 4.9437 4.9437z"
                  fill="currentColor"
                ></path>
              </svg>
              Sign up with Google
            </button>
          </form>

          {/* Mobile Footer Link */}
          <div className="px-8 pb-8 text-center sm:hidden">
            <span className="text-sm text-[#617289]">Already have an account?</span>
            <Link className="text-primary font-bold text-sm ml-1 hover:underline" href="/auth/login">
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Trust Badges */}
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
