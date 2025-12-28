import { create } from 'zustand';
import { API } from '@/services/API';

export interface Collaborator {
    userId: string;
    name: string;
    email: string;
    permission: 'READ_ONLY' | 'EDIT';
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'; // Optional if we show pending
    avatarUrl?: string; // Optional if we have avatars
    isOwner?: boolean;
}

interface CollaboratorStoreState {
    isOpen: boolean;
    currentNoteId: string | null;
    collaborators: Collaborator[];
    isLoading: boolean;
    error: string | null;

    openPanel: (noteId: string) => void;
    closePanel: () => void;

    fetchCollaborators: (noteId: string) => Promise<void>;
    inviteCollaborator: (email: string, permission: 'READ_ONLY' | 'EDIT') => Promise<void>;
    removeCollaborator: (userId: string) => Promise<void>;
}

export const useCollaboratorStore = create<CollaboratorStoreState>((set, get) => ({
    isOpen: false,
    currentNoteId: null,
    collaborators: [],
    isLoading: false,
    error: null,

    openPanel: (noteId) => {
        set({ isOpen: true, currentNoteId: noteId, error: null });
        get().fetchCollaborators(noteId);
    },

    closePanel: () => {
        set({ isOpen: false, currentNoteId: null, collaborators: [], error: null });
    },

    fetchCollaborators: async (noteId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await API.notes.getOne(noteId);
            const note = response.data;

            // Extract collaborators from the note object.
            // Note: `requests` is optional in the interface.
            const collaborators: Collaborator[] = [];

            if (note.requests && Array.isArray(note.requests)) {
                note.requests.forEach((req) => {
                    // We can show Accepted, Pending, and Rejected users
                    if (req.receiver) {
                        collaborators.push({
                            userId: req.receiver.user_id,
                            name: req.receiver.name || req.receiver.email?.split('@')[0] || 'User',
                            email: req.receiver.email,
                            permission: req.permission,
                            status: req.status,
                        });
                    }
                });
            } else if (note.sharedWith && Array.isArray(note.sharedWith)) {
                // Fallback/Alternative field name
                collaborators.push(...note.sharedWith);
            }

            // Also potentially add the owner explicitly if needed, but usually we just show who it's shared TO.
            // If I am the owner, I see others. 

            set({ collaborators, isLoading: false });
        } catch (error: any) {
            console.error('Error fetching collaborators:', error);
            // For now, fail silently or show empty list if field missing, regular error if network fail
            set({ isLoading: false }); // Don't set global error to avoid blocking UI unnecessarily
        }
    },

    inviteCollaborator: async (email, permission) => {
        const { currentNoteId } = get();
        if (!currentNoteId) return;

        set({ isLoading: true, error: null });
        try {
            await API.share.createRequest({
                noteId: currentNoteId,
                receiverId: email,
                permission: permission
            });

            // Refresh list
            await get().fetchCollaborators(currentNoteId);
            set({ isLoading: false });
        } catch (error: any) {
            console.error('Error inviting collaborator:', error);
            set({ error: error.response?.data?.message || 'Failed to invite user', isLoading: false });
        }
    },

    removeCollaborator: async (userId) => {
        const { currentNoteId } = get();
        if (!currentNoteId) return;

        set({ isLoading: true });
        try {
            await API.share.revokeAccess(currentNoteId, userId);
            // Remove locally to be snappy
            set((state) => ({
                collaborators: state.collaborators.filter(c => c.userId !== userId),
                isLoading: false
            }));
        } catch (error: any) {
            console.error('Error removing collaborator:', error);
            set({ error: error.message || 'Failed to remove collaborator', isLoading: false });
            // Re-fetch to sync state if failed/partial
            get().fetchCollaborators(currentNoteId);
        }
    }
}));
