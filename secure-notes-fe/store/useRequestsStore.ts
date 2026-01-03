import { create } from 'zustand';
import { API } from '@/services/API';
import { SharedNoteRequest } from '@/services/interfaces';



interface RequestsState {
  requests: SharedNoteRequest[];
  isLoading: boolean;
  error: string | null;
  fetchRequests: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  deleteRequest: (requestId: string) => Promise<void>;
}

export const useRequestsStore = create<RequestsState>((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,

  fetchRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await API.share.getRequests();
      set({ requests: response.data, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      set({ error: error.message || 'Failed to fetch requests', isLoading: false });
    }
  },

  acceptRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      await API.share.respondToRequest({ requestId, action: 'ACCEPT' });
      set((state) => ({
        requests: state.requests.map((req) =>
          req.request_id === requestId ? { ...req, status: 'ACCEPTED' as const } : req
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error accepting request:', error);
      set({ error: error.message || 'Failed to accept request', isLoading: false });
    }
  },

  rejectRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      await API.share.respondToRequest({ requestId, action: 'REJECT' });
      set((state) => ({
        requests: state.requests.map((req) =>
          req.request_id === requestId ? { ...req, status: 'REJECTED' as const } : req
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      set({ error: error.message || 'Failed to reject request', isLoading: false });
    }
  },

  deleteRequest: async (requestId) => {
    // Note: API for deleting a request specifically (instead of revoke) might be needed.
    // Documentation says respondToRequest action REJECT moves it out of pending.
    // If we want to remove it from UI list:
    set((state) => ({
      requests: state.requests.filter((req) => req.request_id !== requestId),
    }));
  },
}));
