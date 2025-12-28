import { SharedNoteRequest as Request } from '@/services/API';
import { RequestCard } from './RequestCard';

interface RequestListProps {
  requests: Request[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onDelete: (requestId: string) => void;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export const RequestList = ({
  requests,
  onAccept,
  onReject,
  onDelete,
  status,
  title,
  isExpanded,
  onToggle
}: RequestListProps) => {
  const filteredRequests = requests.filter((req) => req.status === status);
  // Show all requests if expanded, otherwise take top 3
  const visibleRequests = isExpanded ? filteredRequests : filteredRequests.slice(0, 3);

  // Status-specific styles
  const statusColorMap = {
    PENDING: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    ACCEPTED: 'bg-green-50 border-green-200 text-green-800',
    REJECTED: 'bg-red-50 border-red-200 text-red-800',
  };

  const statusColor = statusColorMap[status];

  return (
    <section
      onClick={onToggle}
      className={`
        relative flex flex-col h-full bg-white rounded-2xl border transition-all duration-500 ease-in-out cursor-pointer overflow-hidden
        ${isExpanded
          ? 'shadow-lg border-gray-300 ring-1 ring-black/5'
          : 'shadow-sm border-gray-200 hover:shadow-md hover:border-gray-300 hover:bg-gray-50/50'
        }
      `}
    >
      {/* Header */}
      <div className={`
        flex items-center justify-between px-6 py-4 border-b transition-colors duration-300
        ${isExpanded ? 'bg-gray-50/80 border-gray-200' : 'bg-transparent border-transparent'}
      `}>
        <div className="flex items-center gap-3">
          <h2 className={`font-bold tracking-tight transition-all duration-300 ${isExpanded ? 'text-xl text-gray-900' : 'text-lg text-gray-700'}`}>
            {title}
          </h2>
          <span className={`
            px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all duration-300
            ${filteredRequests.length > 0 ? statusColor : 'bg-gray-100 text-gray-400 border-gray-200'}
          `}>
            {filteredRequests.length}
          </span>
        </div>

        {/* Expansion Indicator */}
        <div className={`
            p-1.5 rounded-full transition-all duration-500
            ${isExpanded ? 'bg-gray-200 rotate-180' : 'bg-gray-100 text-gray-400'}
        `}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Content Area */}
      <div className={`
        flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 transition-opacity duration-300
        ${isExpanded ? 'opacity-100' : 'opacity-90 overflow-hidden'}
      `}>
        {visibleRequests.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
            <div className={`p-4 rounded-full bg-gray-50 mb-3 ${!isExpanded && 'scale-75'}`}>
              {status === 'PENDING' && (
                <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {status === 'ACCEPTED' && (
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {status === 'REJECTED' && (
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
            </div>
            <p className="text-sm font-medium text-gray-500">No {status.toLowerCase()} requests</p>
          </div>
        ) : (
          <>
            {visibleRequests.map((request) => (
              <div key={request.request_id} onClick={(e) => e.stopPropagation()}>
                <RequestCard
                  request={request}
                  onAccept={() => onAccept(request.request_id)}
                  onReject={() => onReject(request.request_id)}
                  onDelete={() => onDelete(request.request_id)}
                />
              </div>
            ))}

            {/* Visual cue for more items if collapsed */}
            {!isExpanded && filteredRequests.length > 3 && (
              <div className="text-center pt-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  + {filteredRequests.length - 3} more
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};