import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

// You can change this to your actual backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            isAuthenticated: false,
            login: async (email, password) => {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                        email,
                        password,
                    });

                    // Assuming the response structure matches the requirement: { access_token: "..." }
                    const token = response.data.access_token;

                    set({ token, isAuthenticated: true });
                } catch (error: any) {
                    console.error("Login error:", error);
                    // Extract error message from axios response if available
                    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
                    throw new Error(errorMessage);
                }
            },
            signup: async (name, email, password) => {
                try {
                    await axios.post(`${API_BASE_URL}/auth/signup`, {
                        name,
                        email,
                        password,
                    });
                    // Signup successful, no token returned, so we don't set auth state
                    // User needs to login separately
                } catch (error: any) {
                    console.error("Signup error:", error);
                    const errorMessage = error.response?.data?.message || 'Signup failed';
                    throw new Error(errorMessage);
                }
            },
            logout: () => {
                set({ token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }), // only persist token and auth status
        }
    )
);
