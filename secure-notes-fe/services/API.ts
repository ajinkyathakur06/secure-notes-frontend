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

// --- Request DTOs ---

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
    receiverEmail: string;
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

// --- Response Interfaces ---

export interface AuthResponse {
    user_id: string;
    email: string;
}

export interface LoginResponse {
    access_token: string;
}

export interface Note {
    note_id: string;
    user_id?: string;
    title: string;
    content: string;
    createdAt?: string;
    updatedAt: string;
    requests?: CollaboratorRequest[];
    sharedWith?: any[];
}

export interface CollaboratorRequest {
    request_id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    permission: 'READ_ONLY' | 'EDIT';
    receiver: {
        user_id: string;
        name: string;
        email: string;
    };
}

export interface TrashNote {
    note: Pick<Note, 'note_id' | 'title' | 'updatedAt'>;
    deletedAt: string;
}

export interface DashboardResponse {
    owned: Note[];
    other: Note[];
}

export interface UserProfile {
    user_id: string;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SharedNoteRequest {
    request_id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    permission: 'READ_ONLY' | 'EDIT';
    description?: string;
    createdAt: string;
    sender: {
        user_id: string;
        email: string;
        name: string;
    };
    note: {
        note_id: string;
        title: string;
    };
}


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
