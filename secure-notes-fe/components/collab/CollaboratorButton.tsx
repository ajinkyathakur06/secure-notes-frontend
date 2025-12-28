import { useCollaboratorStore } from '@/store/useCollaboratorStore';

interface CollaboratorButtonProps {
    noteId: string;
}

export const CollaboratorButton = ({ noteId }: CollaboratorButtonProps) => {
    const openPanel = useCollaboratorStore(state => state.openPanel);

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                openPanel(noteId);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
            title="Add collaborator"
        >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
        </button>
    );
};
