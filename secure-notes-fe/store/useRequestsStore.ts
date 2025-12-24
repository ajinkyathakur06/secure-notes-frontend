import { create } from 'zustand';

interface Sender {
  user_id: string;
  name: string;
  email: string;
}

interface Note {
  note_id: string;
  title: string;
}

export interface Request {
  request_id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  permission: 'READ_ONLY' | 'EDIT';
  description?: string;
  createdAt: string;
  sender: Sender;
  note: Note;
}

interface RequestsState {
  requests: Request[];
  fetchRequests: () => Promise<void>;
  acceptRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  deleteRequest: (requestId: string) => void;
}

// Mock data - will be replaced with API calls
const mockRequests: Request[] = [
  // 2 PENDING
  {
    request_id: 'req1',
    status: 'PENDING',
    permission: 'EDIT',
    description: 'Need to add Q4 financial updates.',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    sender: { user_id: 'u1', name: 'Alice Walker', email: 'alice.w@example.com' },
    note: { note_id: 'n1', title: 'Q4 Financial Report' }
  },
  {
    request_id: 'req2',
    status: 'PENDING',
    permission: 'READ_ONLY',
    description: 'Researching for the upcoming blog post.',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    sender: { user_id: 'u2', name: 'David Chen', email: 'david.c@example.com' },
    note: { note_id: 'n2', title: 'Product Roadmap 2025' }
  },

  // 5 ACCEPTED
  {
    request_id: 'req3',
    status: 'ACCEPTED',
    permission: 'EDIT',
    description: 'Fixing typos in the introduction.',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    sender: { user_id: 'u3', name: 'Sarah Miller', email: 'sarah.m@example.com' },
    note: { note_id: 'n3', title: 'Onboarding Guide' }
  },
  {
    request_id: 'req4',
    status: 'ACCEPTED',
    permission: 'READ_ONLY',
    description: 'Reviewing implementation details.',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    sender: { user_id: 'u4', name: 'James Wilson', email: 'james.w@example.com' },
    note: { note_id: 'n4', title: 'API Documentation' }
  },
  {
    request_id: 'req5',
    status: 'ACCEPTED',
    permission: 'EDIT',
    description: 'Updating team contact info.',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    sender: { user_id: 'u5', name: 'Emily Davis', email: 'emily.d@example.com' },
    note: { note_id: 'n5', title: 'Team Directory' }
  },
  {
    request_id: 'req6',
    status: 'ACCEPTED',
    permission: 'READ_ONLY',
    description: 'Need valid references for my report.',
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    sender: { user_id: 'u6', name: 'Michael Brown', email: 'michael.b@example.com' },
    note: { note_id: 'n6', title: 'Market Analysis' }
  },
  {
    request_id: 'req7',
    status: 'ACCEPTED',
    permission: 'EDIT',
    description: 'Collaborating on the final draft.',
    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    sender: { user_id: 'u7', name: 'Jessica Taylor', email: 'jessica.t@example.com' },
    note: { note_id: 'n7', title: 'Project Proposal' }
  },

  // 3 REJECTED
  {
    request_id: 'req8',
    status: 'REJECTED',
    permission: 'EDIT',
    description: 'I need full access to delete old logs.',
    createdAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    sender: { user_id: 'u8', name: 'Robert Anderson', email: 'robert.a@example.com' },
    note: { note_id: 'n8', title: 'System Logs' }
  },
  {
    request_id: 'req9',
    status: 'REJECTED',
    permission: 'READ_ONLY',
    description: '',
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    sender: { user_id: 'u9', name: 'Lisa Thomas', email: 'lisa.t@example.com' },
    note: { note_id: 'n9', title: 'Confidential Client List' }
  },
  {
    request_id: 'req10',
    status: 'REJECTED',
    permission: 'EDIT',
    description: 'Changing the design layout.',
    createdAt: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
    sender: { user_id: 'u10', name: 'Kevin White', email: 'kevin.w@example.com' },
    note: { note_id: 'n10', title: 'Brand Guidelines' }
  }
];

export const useRequestsStore = create<RequestsState>((set) => ({
  requests: [],

  fetchRequests: async () => {
    set({ requests: mockRequests });
  },

  acceptRequest: (requestId) => {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.request_id === requestId
          ? { ...req, status: 'ACCEPTED' as const }
          : req
      ),
    }));
  },

  rejectRequest: (requestId) => {
    set((state) => ({
      requests: state.requests.map((req) =>
        req.request_id === requestId
          ? { ...req, status: 'REJECTED' as const }
          : req
      ),
    }));
  },

  deleteRequest: (requestId) => {
    set((state) => ({
      requests: state.requests.filter((req) => req.request_id !== requestId),
    }));
  },
}));