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
