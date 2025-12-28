import { useCollaboratorStore } from '@/store/useCollaboratorStore';

export const CollaboratorList = () => {
    const { collaborators, removeCollaborator, updateCollaboratorPermission } = useCollaboratorStore();

    // We assume the current user viewing this panel is the owner or has rights to manage.
    // Ideally we check permissions, but for UI we show the list.

    return (
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar pt-2">
            {collaborators.map(user => (
                <div key={user.userId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center text-sm font-bold uppercase">
                            {user.name?.[0] || user.email?.[0] || '?'}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-gray-900 truncate">{user.name}</span>
                            <span className="text-xs text-gray-500 truncate">{user.email}</span>
                        </div>
                    </div>
                        {/* Permission Badge & Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {user.status === 'PENDING' && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded border border-yellow-200">
                                Pending
                            </span>
                        )}
                        
                        <select
                            value={user.permission}
                            onChange={(e) => updateCollaboratorPermission(user.userId, e.target.value as 'READ_ONLY' | 'EDIT')}
                            className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 font-medium border border-gray-200 outline-none hover:bg-gray-200 cursor-pointer transition-colors"
                        >
                            <option value="READ_ONLY">Can view</option>
                            <option value="EDIT">Can edit</option>
                        </select>
                        
                        <button
                            onClick={() => removeCollaborator(user.userId)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all"
                            title="Remove access"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                </div>
            ))}
            {collaborators.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-sm italic">
                    Not shared with anyone yet.
                </div>
            )}
        </div>
    )
}
