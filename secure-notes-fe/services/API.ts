import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

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

// Types
export interface SignupDto {
    name: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface CreateNoteDto {
    title: string;
    content: string;
}

export interface UpdateNoteDto {
    title?: string;
    content?: string;
}

export interface UpdateProfileDto {
    name: string;
}

export interface ShareRequestDto {
    noteId: string;
    receiverId: string;
    permission: 'READ_ONLY' | 'EDIT';
}

export interface RespondShareDto {
    requestId: string;
    action: 'ACCEPT' | 'REJECT';
}

export interface UpdatePermissionDto {
    noteId: string;
    userId: string;
    permission: 'READ_ONLY' | 'EDIT';
}

export const API = {
    auth: {
        signup: (data: SignupDto) => api.post('/auth/signup', data),
        login: (data: LoginDto) => api.post('/auth/login', data),
    },
    notes: {
        create: (data: CreateNoteDto) => api.post('/notes', data),
        getOne: (noteId: string) => api.get(`/notes/${noteId}`),
        update: (noteId: string, data: UpdateNoteDto) => api.patch(`/notes/${noteId}`, data),
        delete: (noteId: string, scope: 'me' | 'all') => api.delete(`/notes/${noteId}?scope=${scope}`),
        download: (noteId: string) => {
            // For download, we might want to handle it differently to trigger browser download
            window.open(`${API_URL}/notes/${noteId}/download`, '_blank');
            // Alternatively, using axios:
            // return api.get(`/notes/${noteId}/download`, { responseType: 'blob' });
        },
        getOwned: () => api.get('/notes/owned'),
        getTrash: () => api.get('/notes/trash'),
        restore: (noteId: string) => api.patch(`/notes/${noteId}/restore`),
    },
    users: {
        getProfile: () => api.get('/users/me'),
        updateProfile: (data: UpdateProfileDto) => api.patch('/users/me', data),
    },
    share: {
        createRequest: (data: ShareRequestDto) => api.post('/share', data),
        getPendingRequests: () => api.get('/share/requests'),
        respondToRequest: (data: RespondShareDto) => api.post('/share/respond', data),
        updatePermission: (data: UpdatePermissionDto) => api.patch('/share/permission', data),
        revokeAccess: (noteId: string, userId: string) => api.delete(`/share/revoke/${noteId}/${userId}`),
        getSharedNotes: () => api.get('/share/notes'),
    }
};

export default api;
