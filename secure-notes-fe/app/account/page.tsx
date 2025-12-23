'use client';

import { useState } from 'react';
import NotesHeader from '@/components/NotesHeader';
import MobileNav from '@/components/MobileNav';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  
  // Mock user data - in a real app, this would come from the store or API
  const [formData, setFormData] = useState({
    name: 'Alex Morgan',
    email: 'alex.m@secure.net',
    currentPassword: '',
    newPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleDeleteAccount = () => {
    // Simulate API call
    console.log('Deleting account...');
    logout();
    router.push('/auth/login');
  };

  return (
    <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light">
      {/* Header */}
      <NotesHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 md:px-8 md:pb-8">
        <div className="max-w-2xl mx-auto py-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h1>

          {/* Profile Form */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Profile Details</h2>
              <p className="text-sm text-slate-500">Update your personal information</p>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6 grid gap-6">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Your Name"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div className="border-t border-slate-100 pt-6 mt-2">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Change Password</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="currentPassword">Current Password</label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="newPassword">New Password</label>
                    <input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg shadow-sm transition-colors disabled:opacity-70"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl border border-red-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h2>
              <p className="text-sm text-red-600 mb-6">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm shadow-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
        confirmText="Delete Account"
        isDanger={true}
      />
    </main>
  );
}
