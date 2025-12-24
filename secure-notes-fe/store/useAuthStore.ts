import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    isHydrated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setHydrated: () => void;
}

// You can change this to your actual backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: "dev-token",
            isAuthenticated: true,
            isHydrated: false,
            setHydrated: () => set({ isHydrated: true }),
            login: async (email, password) => {
                try {
                    // Mock login for frontend-only development
                    // const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                    //     email,
                    //     password,
                    // });
                    // const token = response.data.access_token;

                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const token = "mock-jwt-token";
                    set({ token, isAuthenticated: true });
                } catch (error: any) {
                    console.error("Login error:", error);
                    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
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
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
        }
    )
);
