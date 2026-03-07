'use client';

import { useState, useEffect } from 'react';
import { Trash2, Send, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface Message {
    id: number;
    content: string;
    createdAt: string;
    author: {
        id: number;
        name: string;
        profileImage: string | null;
    };
}

interface NoticeboardProps {
    boatId: number;
    boatName?: string;
    isPublic: boolean;
    isAdmin: boolean;
}

export default function Noticeboard({ boatId, boatName, isPublic, isAdmin }: NoticeboardProps) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<{ userId: number; name?: string; profileImage?: string | null } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

    useEffect(() => {
        const storedToken = localStorage.getItem('user_token');
        if (storedToken) {
            setToken(storedToken);
            fetch(`${apiUrl}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${storedToken}` }
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => data ? setUser({ userId: data.user.id, name: data.user.name, profileImage: data.user.profileImage }) : null)
                .catch(() => { });
        }
    }, [apiUrl]);

    useEffect(() => {
        // Hent beskeder når token status er valideret (eller med det samme for gæster)
        fetchMessages(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boatId, token]);

    const fetchMessages = async (currentToken: string | null) => {
        try {
            setIsLoading(true);
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (currentToken) headers['Authorization'] = `Bearer ${currentToken}`;

            const res = await fetch(`${apiUrl}/api/boats/${boatId}/messages`, { headers });

            if (!res.ok) {
                if (res.status === 403) {
                    setError('Lukket forum.');
                } else {
                    setError('Kunne ikke hente beskeder.');
                }
                setIsLoading(false);
                return;
            }

            const data = await res.json();
            setMessages(data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Netværksfejl.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return alert('Du skal logge ind for at skrive på tavlen.');
        if (!newMessage.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`${apiUrl}/api/boats/${boatId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newMessage })
            });

            if (res.ok) {
                const createdMsg = await res.json();
                setMessages(prev => [createdMsg, ...prev]);
                setNewMessage('');
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Kunne ikke oprette besked.');
            }
        } catch (err) {
            alert('Netværksfejl.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (msgId: number) => {
        if (!confirm('Er du sikker på at du vil slette denne besked?')) return;

        try {
            const res = await fetch(`${apiUrl}/api/messages/${msgId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== msgId));
            } else {
                alert('Du har ikke rettigheder til at slette andres beskeder.');
            }
        } catch (err) {
            alert('Netværksfejl.');
        }
    };

    if (!isPublic && !isAdmin) {
        return null; // Skjul fuldstændig for udefrakommende hvis opslagstavlen er lukket
    }

    return (
        <div className="bg-background rounded-[1.5rem] border border-border/50 overflow-hidden shadow-sm mt-16 mt-32 md:mt-40 mb-20 max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-muted/30 px-6 py-5 border-b border-border flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        <h3 className="font-merriweather font-bold text-xl text-foreground tracking-tight">
                            {boatName ? `${boatName}'s opslagstavle` : "Opslagstavle"}
                        </h3>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2 max-w-2xl">
                        Du kan oprette en bruger og skrive en hilsen til båden og dens gaster her.
                    </p>
                </div>
                {!isPublic && isAdmin && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-destructive bg-destructive/10 px-2 py-1 rounded-full shrink-0">
                        Privat
                    </span>
                )}
            </div>

            {/* Besked Formular */}
            {token ? (
                <form onSubmit={handleSubmit} className="p-6 border-b border-border/40 bg-muted/10">
                    <div className="flex gap-4">
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 border border-border/50" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border/50">
                                <MessageCircle className="w-5 h-5 text-muted-foreground opacity-50" />
                            </div>
                        )}
                        <div className="flex-1">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Læg en hilsen til besætningen..."
                                className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24"
                                maxLength={500}
                                required
                            />
                            <div className="flex justify-end mt-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newMessage.trim()}
                                    className="px-5 py-2 bg-foreground text-background font-bold text-sm rounded-full flex items-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    {isSubmitting ? 'Sender...' : 'Send'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="p-6 border-b border-border/40 bg-muted/10 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Du skal være logget ind for at skrive på opslagstavlen.</p>
                </div>
            )}

            {/* Besked Liste */}
            <div className="p-6 space-y-6">
                {isLoading ? (
                    <div className="text-center py-8 text-sm text-muted-foreground animate-pulse">
                        Henter beskeder...
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-sm text-destructive">
                        {error}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground italic text-sm">Opslagstavlen er tom. Vær den første til at sende en hilsen!</p>
                    </div>
                ) : (
                    messages.map(msg => {
                        const author = msg.author || { id: 0, name: 'Slettet Bruger', profileImage: null };
                        const isMsgAuthor = user?.userId === author.id && author.id !== 0;

                        return (
                            <div key={msg.id} className="p-4 flex gap-4 items-start group relative bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/20 transition-all">
                                {/* Profilbillede / Logo */}
                                <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border/50">
                                    {author.profileImage ? (
                                        <img src={author.profileImage} alt={author.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-muted-foreground font-semibold text-sm">
                                            {author.name.substring(0, 2).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                {/* Besked Indhold */}
                                <div className="flex-1 min-w-0">
                                    <div className="bg-muted/30 rounded-2xl rounded-tl-sm px-5 py-3 border border-border/40 relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm text-foreground">{author.name}</span>
                                        </div>
                                        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                            {msg.content}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 px-2">
                                        <time dateTime={msg.createdAt} className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                            {format(new Date(msg.createdAt), 'd. MMM HH:mm', { locale: da })}
                                        </time>
                                        {(isAdmin || isMsgAuthor) && (
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="text-[10px] text-muted-foreground hover:text-destructive transition-colors uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100"
                                            >
                                                Slet
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
