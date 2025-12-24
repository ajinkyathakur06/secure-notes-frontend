// app/requests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRequestsStore } from '@/store/useRequestsStore';
import { RequestList } from '@/components/RequestList';
import { RequestCard } from '@/components/RequestCard';
import NotesHeader from '@/components/NotesHeader';

export default function RequestsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED' | null>(null);
  const [mobileTab, setMobileTab] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED'>('PENDING');

  const { requests, fetchRequests, acceptRequest, rejectRequest, deleteRequest } = useRequestsStore();

  useEffect(() => {
    // Simulate loading for effect
    const load = async () => {
      await fetchRequests();
      setIsLoading(false);
    };
    load();
  }, [fetchRequests]);

  const toggleSection = (id: 'PENDING' | 'ACCEPTED' | 'REJECTED') => {
    if (expandedId === id) {
      setExpandedId(null); // Collapse if already expanded
    } else {
      setExpandedId(id); // Expand the clicked section
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f7f7f6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D0BB95] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium tracking-wide">LOADING REQUESTS...</p>
        </div>
      </div>
    );
  }

  const getSectionClasses = (id: string) => {
    const isExpanded = expandedId === id;
    const isAnyExpanded = expandedId !== null;

    // Base classes
    let classes = "transition-all duration-500 ease-in-out h-[750px] ";

    if (isExpanded) {
      classes += "flex-[3] z-10 scale-100 opacity-100";
    } else if (isAnyExpanded) {
      // If another section is expanded, this one shrinks
      classes += "flex-1 scale-[0.98] opacity-60 hover:opacity-80";
    } else {
      // Default state (none expanded)
      classes += "flex-1 hover:flex-[1.1] scale-100 opacity-100";
    }

    return classes;
  };

  const mobileRequests = requests.filter((req) => req.status === mobileTab);

  const getMobileTabCount = (status: 'PENDING' | 'ACCEPTED' | 'REJECTED') => {
    return requests.filter((req) => req.status === status).length;
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f7f7f6] mx-auto flex flex-col h-screen overflow-hidden">
      <NotesHeader />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 pt-2 flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Access Requests</h1>
          <p className="text-gray-600 font-medium">Manage permissions and access controls.</p>
        </div>

        {/* Desktop Reset Button */}
        <div className="hidden md:block">
          {expandedId && (
            <button
              onClick={() => setExpandedId(null)}
              className="text-sm font-semibold text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              Reset View
            </button>
          )}
        </div>
      </div>

      {/* MOBILE Layout (sm only) */}
      <div className="md:hidden flex flex-col flex-1">
        {/* Segmented Control Tabs */}
        <div className="flex items-center p-1 bg-white border border-gray-200 rounded-xl mb-6 shadow-sm overflow-x-auto">
          {(['PENDING', 'ACCEPTED', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setMobileTab(status)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap
                ${mobileTab === status
                  ? 'bg-[#111418] text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
              <span className={`
                text-[10px] py-0.5 px-1.5 rounded-md font-bold
                ${mobileTab === status ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 border border-gray-200'}
              `}>
                {getMobileTabCount(status)}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile List View */}
        <div className="flex-1 space-y-4">
          {mobileRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center opacity-70">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <span className="material-symbols-outlined text-4xl text-gray-400">inbox</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">No {mobileTab.toLowerCase()} requests</p>
              <p className="text-gray-500 text-sm mt-1">Check back later for updates.</p>
            </div>
          ) : (
            mobileRequests.map((request) => (
              <div key={request.request_id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <RequestCard
                  request={request}
                  onAccept={() => acceptRequest(request.request_id)}
                  onReject={() => rejectRequest(request.request_id)}
                  onDelete={() => deleteRequest(request.request_id)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* DESKTOP Layout (md and up) - Existing Unchanged Layout */}
      <div className="hidden md:flex flex-1 flex-col lg:flex-row gap-4 lg:gap-6 min-h-[500px]">
        {/* PENDING */}
        <div className={getSectionClasses('PENDING')}>
          <RequestList
            requests={requests}
            status="PENDING"
            title="Pending"
            onAccept={acceptRequest}
            onReject={rejectRequest}
            onDelete={deleteRequest}
            isExpanded={expandedId === 'PENDING'}
            onToggle={() => toggleSection('PENDING')}
          />
        </div>

        {/* ACCEPTED */}
        <div className={getSectionClasses('ACCEPTED')}>
          <RequestList
            requests={requests}
            status="ACCEPTED"
            title="Accepted"
            onAccept={acceptRequest}
            onReject={rejectRequest}
            onDelete={deleteRequest}
            isExpanded={expandedId === 'ACCEPTED'}
            onToggle={() => toggleSection('ACCEPTED')}
          />
        </div>

        {/* REJECTED */}
        <div className={getSectionClasses('REJECTED')}>
          <RequestList
            requests={requests}
            status="REJECTED"
            title="Rejected"
            onAccept={acceptRequest}
            onReject={rejectRequest}
            onDelete={deleteRequest}
            isExpanded={expandedId === 'REJECTED'}
            onToggle={() => toggleSection('REJECTED')}
          />
        </div>
      </div>
      </div>
    </main>
  );
}