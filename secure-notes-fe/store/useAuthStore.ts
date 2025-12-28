import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API } from '@/services/API';

interface User {
    user_id: string;
    name: string;
    email: string;
    createdAt?: string; // Made optional to match API response
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            login: async (email, password) => {
                try {
                    const response = await API.auth.login({ email, password });
                    const token = response.data.access_token;

                    // Set token first so the API interceptor can pick it up
                    set({ token });

                    // Fetch user profile
                    const profileResponse = await API.users.getProfile();

                    set({
                        token,
                        user: profileResponse.data,
                        isAuthenticated: true
                    });
                } catch (error: any) {
                    console.error("Login error:", error);
                    // Reset token if profile fetch fails
                    set({ token: null });

                    // Extract error message from axios response if available
                    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
                    throw new Error(errorMessage);
                }
            },
            signup: async (name, email, password) => {
                try {
                    await API.auth.signup({ name, email, password });
                    // Signup successful, no token returned, so we don't set auth state
                    // User needs to login separately
                } catch (error: any) {
                    console.error("Signup error:", error);
                    const errorMessage = error.response?.data?.message || 'Signup failed';
                    throw new Error(errorMessage);
                }
            },
            logout: () => {
                set({ token: null, user: null, isAuthenticated: false });
            },
            updateUser: (user: User) => {
                set({ user });
            },
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }), // only persist token, user and auth status
        }
    )
);
