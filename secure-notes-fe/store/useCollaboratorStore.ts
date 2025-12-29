import { create } from 'zustand';
import { API } from '@/services/API';
import { useAuthStore } from './useAuthStore';

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
    isCurrentUserOwner: boolean; // Track if current user owns the note

    openPanel: (noteId: string) => void;
    closePanel: () => void;

    fetchCollaborators: (noteId: string) => Promise<void>;
    inviteCollaborator: (email: string, permission: 'READ_ONLY' | 'EDIT') => Promise<void>;
    updateCollaboratorPermission: (userId: string, permission: 'READ_ONLY' | 'EDIT') => Promise<void>;
    removeCollaborator: (userId: string) => Promise<void>;
}

export const useCollaboratorStore = create<CollaboratorStoreState>((set, get) => ({
    isOpen: false,
    currentNoteId: null,
    collaborators: [],
    isLoading: false,
    error: null,
    isCurrentUserOwner: false,

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

            // Determine if current user is the owner
            const currentUserId = useAuthStore.getState().user?.user_id;
            const isCurrentUserOwner = note.user_id === currentUserId;

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

            set({ collaborators, isLoading: false, isCurrentUserOwner });
        } catch (error: any) {
            console.error('Error fetching collaborators:', error);
            // For now, fail silently or show empty list if field missing, regular error if network fail
            set({ isLoading: false }); // Don't set global error to avoid blocking UI unnecessarily
        }
    },

    inviteCollaborator: async (email, permission) => {
        set({ isLoading: true, error: null });
        const { currentNoteId, collaborators } = get();
        if (!currentNoteId) return;

        try {
            // Optimistic update? No, wait for API because we need userId usually.
            // But for invite, we don't have user ID yet until response or just void.
            // Actually API.share.createRequest returns void.
            // We can't easily add to list without knowing user details.
            // So we just call API and then re-fetch.

            // Check if already exists
            if (collaborators.some(c => c.email === email)) {
                throw new Error("User is already a collaborator");
            }

            await API.share.createRequest({
                noteId: currentNoteId,
                receiverEmail: email,
                permission,
            });

            // Re-fetch to show pending state
            await get().fetchCollaborators(currentNoteId);
        } catch (error: any) {
            console.error('Error inviting:', error);
            set({ error: error.message || 'Failed to invite', isLoading: false });
        }
    },

    updateCollaboratorPermission: async (userId, permission) => {
        const { currentNoteId } = get();
        if (!currentNoteId) return;

        // Optimistic update
        set(state => ({
            collaborators: state.collaborators.map(c =>
                c.userId === userId ? { ...c, permission } : c
            )
        }));

        try {
            await API.share.updatePermission({
                noteId: currentNoteId,
                userId,
                permission
            });
        } catch (error: any) {
            console.error("Failed to update permission", error);
            // Revert
            set(state => ({
                error: "Failed to update permission",
                collaborators: state.collaborators.map(c =>
                    // We don't easily know previous state unless we saved it, 
                    // but fetching again is safer.
                    c.userId === userId ? { ...c, permission: permission === 'EDIT' ? 'READ_ONLY' : 'EDIT' } : c
                )
            }));
            await get().fetchCollaborators(currentNoteId);
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
