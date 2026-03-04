'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Vote {
    type: 'UPVOTE' | 'DOWNVOTE';
    userId: number;
}

interface PostVotesProps {
    postId: number;
    initialVotes: Vote[];
}

export default function PostVotes({ postId, initialVotes }: PostVotesProps) {
    const router = useRouter();
    const [votes, setVotes] = useState<Vote[]>(initialVotes);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const upvotes = votes.filter(v => v.type === 'UPVOTE').length;
    const downvotes = votes.filter(v => v.type === 'DOWNVOTE').length;

    const userVote = currentUserId ? votes.find(v => v.userId === currentUserId)?.type : null;

    useEffect(() => {
        // Find out if the user is logged in
        const fetchMe = async () => {
            const token = localStorage.getItem('user_token');
            if (token) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
                    const res = await fetch(`${apiUrl}/api/auth/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setCurrentUserId(data.user.id);
                    }
                } catch {
                    // Ignore, user just not logged in validly
                }
            }
        };
        fetchMe();
    }, []);

    const handleVote = async (type: 'UPVOTE' | 'DOWNVOTE') => {
        const token = localStorage.getItem('user_token');
        if (!token || !currentUserId) {
            if (confirm('Du skal være logget ind via din profil for at reagere på indholdet. Vil du logge ind nu?')) {
                router.push('/login');
            }
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/posts/${postId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type })
            });

            if (res.ok) {
                const data = await res.json();

                // Optimistic UI update
                const newVotes = [...votes];
                const existingVoteIndex = newVotes.findIndex(v => v.userId === currentUserId);

                if (data.message === 'Vote removed') {
                    // Remove vote
                    if (existingVoteIndex > -1) newVotes.splice(existingVoteIndex, 1);
                } else if (data.message === 'Vote updated') {
                    // Changed from UP to DOWN or vice versa
                    if (existingVoteIndex > -1) newVotes[existingVoteIndex].type = type;
                } else if (data.message === 'Vote added') {
                    // Added new
                    newVotes.push({ type, userId: currentUserId });
                }

                setVotes(newVotes);
            }
        } catch (error) {
            console.error('Failed to vote', error);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={() => handleVote('UPVOTE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-bold uppercase tracking-widest border border-transparent ${userVote === 'UPVOTE' ? 'bg-primary/10 text-primary border-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
                title="Giv indlægget et like"
            >
                <ThumbsUp className={`w-4 h-4 ${userVote === 'UPVOTE' ? 'fill-primary text-primary' : ''}`} />
                <span>{upvotes > 0 ? upvotes : ''}</span>
            </button>
            <button
                onClick={() => handleVote('DOWNVOTE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-bold uppercase tracking-widest border border-transparent ${userVote === 'DOWNVOTE' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'text-muted-foreground hover:bg-muted'}`}
                title="Giv indlægget et dislike"
            >
                <ThumbsDown className={`w-4 h-4 mt-1 ${userVote === 'DOWNVOTE' ? 'fill-destructive text-destructive' : ''}`} />
                <span>{downvotes > 0 ? downvotes : ''}</span>
            </button>
        </div>
    );
}
