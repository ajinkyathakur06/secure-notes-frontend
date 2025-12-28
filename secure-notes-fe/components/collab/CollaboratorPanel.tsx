import { useEffect, useState } from 'react';
import { useCollaboratorStore } from '@/store/useCollaboratorStore';
import { CollaboratorList } from './CollaboratorList';
import { InviteCollaboratorForm } from './InviteCollaboratorForm';
import { useAuthStore } from '@/store/useAuthStore';

export const CollaboratorPanel = () => {
    const { isOpen, closePanel, isLoading, error, isCurrentUserOwner } = useCollaboratorStore();
    const user = useAuthStore(state => state.user);
    const [mount, setMount] = useState(false);

    useEffect(() => {
        if (isOpen) setMount(true);
        else setTimeout(() => setMount(false), 200); // delay unmount for animation
    }, [isOpen]);

    if (!mount) return null;

    return (
        <div
            className={`fixed inset-0 z-[60] flex items-center justify-center sm:items-center items-end bg-black/20 backdrop-blur-[1px] transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
            <div
                className={`bg-white w-full sm:w-[500px] sm:rounded-xl rounded-t-2xl shadow-2xl overflow-hidden transition-all duration-200 transform ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 flex justify-between items-start">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold text-gray-800">Collaborators</h2>
                        {user && (
                            <p className="text-xs text-gray-500 mt-1">
                                {user.name} <span className="italic">(Owner)</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4">
                    {/* Owner info can be part of list, but user wants list of shared people. */}
                    {/* Google Keep shows Owner at top of list. */}

                    <div className="flex items-center gap-3 p-2 bg-blue-50/50 rounded-lg mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                            {user?.name?.[0] || 'O'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{user?.name} <span className="text-xs font-normal text-gray-500">(Owner)</span></span>
                            <span className="text-xs text-gray-500">{user?.email}</span>
                        </div>
                    </div>


                    {error && (
                        <div className="mb-3 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100">
                            {error}
                        </div>
                    )}

                    <CollaboratorList />
                    {isCurrentUserOwner && <InviteCollaboratorForm />}
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 p-3 flex justify-end gap-3 border-t border-gray-100">
                    <button onClick={closePanel} className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-bold rounded hover:bg-gray-200/50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={closePanel} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2 text-sm font-bold rounded shadow-sm hover:shadow transition-all">
                        Done
                    </button>
                </div>
            </div>

            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={closePanel} />
        </div>
    );
};
