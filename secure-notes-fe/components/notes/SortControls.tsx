'use client';

import { useSearchStore } from '@/store/useSearchStore';

export default function SortControls() {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useSearchStore();

  return (
    <div className="w-full flex justify-end items-center mb-6 px-1">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
          Sort by
        </span>
        <div className="relative group">
          <select
            className="appearance-none bg-surface-light border border-slate-200 text-slate-700 text-sm font-medium rounded-lg py-2 pl-3 pr-9 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm hover:border-slate-300 transition-colors cursor-pointer w-40"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="created">Date Created</option>
            <option value="modified">Last Modified</option>
            <option value="title">Title</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <span className="material-symbols-outlined text-[20px]">expand_more</span>
          </div>
        </div>
        <button
          className="flex items-center justify-center h-[38px] w-[38px] bg-surface-light border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-all shadow-sm"
          title="Toggle Order"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <span className="material-symbols-outlined text-[20px]">
            {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
          </span>
        </button>
      </div>
    </div>
  );
}
