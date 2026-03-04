'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { FileText, Eye, EyeOff, FileEdit, Trash2, ShieldAlert } from 'lucide-react';

interface PostManagerProps {
    boat: any;
    onEditPost?: (post: any) => void;
}

export default function PostManager({ boat, onEditPost }: PostManagerProps) {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, [boat.id]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('user_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/api/posts/boat/${boat.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
            setError('Kunne ikke hente logbogsindlæg.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (postId: number) => {
        try {
            const token = localStorage.getItem('user_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/api/posts/${postId}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to toggle status');
            }

            // Refresh the list to reflect new status
            fetchPosts();
        } catch (err) {
            console.error(err);
            alert('Der skete en fejl under ændring af indlæggets status.');
        }
    };

    if (loading) {
        return (
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-3xl p-8">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black font-merriweather flex items-center gap-3">
                        <FileText className="w-6 h-6 text-primary" />
                        Administrer Logbøger
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Oversigt over alle kladder og publicerede logbøger for {boat.name}.
                    </p>
                </div>
                <div className="px-4 py-1.5 bg-muted rounded-full text-sm font-bold tracking-widest uppercase text-muted-foreground">
                    {posts.length} indlæg
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-muted/30 rounded-2xl border border-dashed border-border/60">
                    <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">Båden har ikke skrevet nogen indlæg endnu.</p>
                </div>
            ) : (
                <div className="flex-1 overflow-auto rounded-2xl border border-border/50 bg-background/50">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted uppercase tracking-widest text-[10px] sm:text-xs font-bold text-muted-foreground border-b border-border">
                                <th className="p-4 sm:px-6">Status</th>
                                <th className="p-4 sm:px-6">Dato</th>
                                <th className="p-4 sm:px-6">Titel / Uddrag</th>
                                <th className="p-4 sm:px-6">Type</th>
                                <th className="p-4 sm:px-6 text-right">Handlinger</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                                    <td className="p-4 sm:px-6">
                                        <button
                                            onClick={() => handleToggleStatus(post.id)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors border shadow-sm ${post.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20'}`}
                                            title="Klik for at skifte status"
                                        >
                                            {post.status === 'PUBLISHED' ? (
                                                <><Eye className="w-3 h-3" /> Publiceret</>
                                            ) : (
                                                <><EyeOff className="w-3 h-3" /> Kladde</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4 sm:px-6 text-sm text-muted-foreground whitespace-nowrap">
                                        {format(new Date(post.createdAt), 'dd. MMM yyyy', { locale: da })}
                                    </td>
                                    <td className="p-4 sm:px-6">
                                        <p className="font-bold text-foreground text-sm line-clamp-1">
                                            {post.title || post.content || 'Uden titel'}
                                        </p>
                                    </td>
                                    <td className="p-4 sm:px-6">
                                        <span className="text-xs font-bold text-muted-foreground/70 tracking-widest uppercase">
                                            {post.postType}
                                        </span>
                                    </td>
                                    <td className="p-4 sm:px-6 text-right space-x-2">
                                        <button
                                            onClick={() => onEditPost && onEditPost(post)}
                                            className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted rounded-lg inline-block"
                                            title="Rediger Indlæg (Forbedres senere)"
                                        >
                                            <FileEdit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => alert('Slette-funktion er endnu ikke tilføjet.')}
                                            className="p-2 text-muted-foreground hover:text-destructive transition-colors hover:bg-destructive/10 rounded-lg inline-block opacity-50"
                                            title="Slet Indlæg (Kommer snart)"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
