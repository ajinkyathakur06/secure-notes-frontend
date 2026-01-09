import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/securenotes";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Use getState() to access the store outside of a component
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 (token expired) errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear auth state and redirect to login
            const { logout } = useAuthStore.getState();
            logout();

            // Only redirect if we're in the browser
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

// --- Request DTOs ---

import {
    SignupDto,
    LoginDto,
    CreateNoteDto,
    UpdateNoteDto,
    UpdateProfileDto,
    ShareRequestDto,
    RespondShareDto,
    UpdatePermissionDto,
    AuthResponse,
    LoginResponse,
    Note,
    CollaboratorRequest,
    TrashNote,
    DashboardResponse,
    UserProfile,
    SharedNoteRequest
} from './interfaces';

export type {
    SignupDto,
    LoginDto,
    CreateNoteDto,
    UpdateNoteDto,
    UpdateProfileDto,
    ShareRequestDto,
    RespondShareDto,
    UpdatePermissionDto,
    AuthResponse,
    LoginResponse,
    Note,
    CollaboratorRequest,
    TrashNote,
    DashboardResponse,
    UserProfile,
    SharedNoteRequest
};


// --- API Service ---

export const API = {
    auth: {
        signup: (data: SignupDto) => api.post<AuthResponse>('/auth/signup', data),
        login: (data: LoginDto) => api.post<LoginResponse>('/auth/login', data),
    },
    notes: {
        create: (data: CreateNoteDto) => api.post<Note>('/notes', data),
        getOne: (noteId: string) => api.get<Note>(`/notes/${noteId}`),
        update: (noteId: string, data: UpdateNoteDto) => api.patch<Note>(`/notes/${noteId}`, data),
        delete: (noteId: string, scope: 'me' | 'all') => api.delete<void>(`/notes/${noteId}?scope=${scope}`),
        download: (noteId: string) => {
            // For download, we might want to handle it differently to trigger browser download
            window.open(`${API_URL}/notes/${noteId}/download`, '_blank');
        },
        getOwned: () => api.get<Note[]>('/notes/owned'),
        getTrash: () => api.get<TrashNote[]>('/notes/trash'),
        restore: (noteId: string) => api.patch<void>(`/notes/${noteId}/restore`),
        getAll: () => api.get<DashboardResponse>('/notes/all'),
    },
    users: {
        getProfile: () => api.get<UserProfile>('/users/me'),
        updateProfile: (data: UpdateProfileDto) => api.patch<UserProfile>('/users/me', data),
    },
    share: {
        createRequest: (data: ShareRequestDto) => api.post<void>('/share', data),
        getRequests: () => api.get<SharedNoteRequest[]>('/share/requests'),
        respondToRequest: (data: RespondShareDto) => api.post<void>('/share/respond', data),
        updatePermission: (data: UpdatePermissionDto) => api.patch<void>('/share/permission', data),
        revokeAccess: (noteId: string, userId: string) => api.delete<void>(`/share/revoke/${noteId}/${userId}`),
        getSharedNotes: () => api.get<Note[]>('/share/notes'),
    }
};

export default api;
