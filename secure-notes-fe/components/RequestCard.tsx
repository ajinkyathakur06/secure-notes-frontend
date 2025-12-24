import { Request } from '@/store/useRequestsStore';

// Simple relative time helper
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

interface RequestCardProps {
  request: Request;
  onAccept: () => void;
  onReject: () => void;
  onDelete: () => void;
}

const getStatusBadge = (status: Request['status']) => {
  const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors';
  switch (status) {
    case 'PENDING':
      return (
        <span className={`${baseClasses} bg-yellow-50 text-yellow-800 border border-yellow-300`}>
          <svg className="w-1.5 h-1.5 fill-current" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" /></svg>
          Pending
        </span>
      );
    case 'ACCEPTED':
      return (
        <span className={`${baseClasses} bg-green-50 text-green-800 border border-green-300`}>
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          Accepted
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`${baseClasses} bg-red-50 text-red-800 border border-red-300`}>
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          Rejected
        </span>
      );
  }
};

const getPermissionBadge = (permission: Request['permission']) => {
  const isEdit = permission === 'EDIT';
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${isEdit
      ? 'bg-blue-50 text-blue-800 border-blue-300'
      : 'bg-gray-50 text-gray-700 border-gray-300'
      }`}>
      {isEdit ? 'Can Edit' : 'View Only'}
    </span>
  );
};

export const RequestCard = ({ request, onAccept, onReject, onDelete }: RequestCardProps) => {
  const isPending = request.status === 'PENDING';

  return (
    <div className="group relative bg-white border border-gray-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:translate-y-[-1px]">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center flex-wrap gap-2 text-sm">
            <span className="font-bold text-gray-900 truncate text-base">{request.sender.name}</span>
            <span className="text-gray-400">&bull;</span>
            <span className="text-gray-600 truncate text-sm">{request.sender.email}</span>
            <span className="text-gray-500 text-xs ml-auto sm:ml-0 font-mono font-medium">
              {timeAgo(request.createdAt)}
            </span>
          </div>

          {/* Main Content */}
          <div>
            <p className="text-gray-700 text-base leading-relaxed font-medium">
              Requests access to <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-lg">{request.note.title}</span>
            </p>
            {request.description && (
              <div className="mt-2 text-base text-gray-600 italic border-l-2 border-gray-300 pl-3 py-1">
                "{request.description}"
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-3 pt-1">
            {getStatusBadge(request.status)}
            {getPermissionBadge(request.permission)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 self-end sm:self-center shrink-0">
          {isPending ? (
            <>
              <button
                onClick={onAccept}
                className="flex items-center gap-1.5 px-5 py-2.5 text-base font-semibold text-white bg-[#D0BB95] hover:bg-[#C0AB85] active:bg-[#B09B75] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#D0BB95]/50 shadow-sm"
              >
                Accept
              </button>
              <button
                onClick={onReject}
                className="flex items-center gap-1.5 px-5 py-2.5 text-base font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-red-600 hover:border-red-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={onDelete}
              title="Delete request"
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
