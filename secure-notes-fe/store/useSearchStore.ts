import { create } from 'zustand';

type SortBy = 'created' | 'modified' | 'title';
type SortOrder = 'asc' | 'desc';

interface SearchStoreState {
    searchQuery: string;
    sortBy: SortBy;
    sortOrder: SortOrder;
    setSearchQuery: (query: string) => void;
    setSortBy: (sortBy: SortBy) => void;
    setSortOrder: (order: SortOrder) => void;
}

export const useSearchStore = create<SearchStoreState>((set) => ({
    searchQuery: '',
    sortBy: 'modified',
    sortOrder: 'desc',
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (sortOrder) => set({ sortOrder }),
}));
