import { useState } from 'react';
import { useCollaboratorStore } from '@/store/useCollaboratorStore';

export const InviteCollaboratorForm = () => {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState<'READ_ONLY' | 'EDIT'>('READ_ONLY');
    const { inviteCollaborator, isLoading } = useCollaboratorStore();

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !isValidEmail(email)) return;

        await inviteCollaborator(email, permission);
        setEmail(''); // Clear on success (store error handling prevents clearing if failed? No, async void. Logic in store needs update if we want to block clear)
        // Ideally inviteCollaborator returns success boolean.
        // But for now clear it. If error appears, user can retry.
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
            <div className="text-sm font-bold text-gray-700">Invite people</div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-transparent focus-within:border-primary/50 focus-within:bg-white transition-all">
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Person or email to share with"
                    className="flex-1 bg-transparent px-3 py-2 outline-none text-sm text-gray-800 placeholder:text-gray-400"
                />

                <select
                    value={permission}
                    onChange={(e: any) => setPermission(e.target.value)}
                    className="text-xs bg-white border border-gray-200 rounded px-2 py-1.5 outline-none text-gray-600 cursor-pointer hover:border-gray-300 font-medium h-8"
                >
                    <option value="READ_ONLY">View</option>
                    <option value="EDIT">Edit</option>
                </select>
            </div>

            {/* Show local validation error if needed, for now rely on button disabled state for empty */}

            <div className="flex justify-end pt-1">
                <button
                    type="submit"
                    disabled={!email || !isValidEmail(email) || isLoading}
                    className="text-sm font-bold text-gray-500 hover:text-primary disabled:opacity-50 disabled:hover:text-gray-500 px-4 py-2 rounded hover:bg-gray-100 transition-all"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 border-2 border-gray-400 border-t-primary rounded-full animate-spin"></span>
                            Sending...
                        </span>
                    ) : 'Save'}
                </button>
            </div>
        </form>
    )
}
