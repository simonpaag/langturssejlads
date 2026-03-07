'use client';

import { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Circle, Navigation2, Ship } from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface InboxProps {
    boatId: number;
}

export default function Inbox({ boatId }: InboxProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('user_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

            try {
                const res = await fetch(`${apiUrl}/api/contact/boat/${boatId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (boatId) {
            fetchMessages();
        }
    }, [boatId]);

    const handleMarkAsRead = async (messageId: number) => {
        const token = localStorage.getItem('user_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

        try {
            const res = await fetch(`${apiUrl}/api/contact/boat/${messageId}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setMessages(prev =>
                    prev.map(msg => msg.id === messageId ? { ...msg, isRead: true } : msg)
                );
            }
        } catch (error) {
            console.error('Failed to mark message as read:', error);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Henter din indbakke...</div>;
    }

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-merriweather flex items-center gap-3">
                        Indbakke <Mail className="w-5 h-5 text-muted-foreground" />
                    </h1>
                    <p className="text-muted-foreground mt-1">Læs og håndter beskeder fra besøgende gæster og sejlere.</p>
                </div>
                {unreadCount > 0 && (
                    <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full font-bold text-sm shadow-sm flex items-center gap-2">
                        <Circle className="w-2.5 h-2.5 fill-primary text-primary" />
                        {unreadCount} {unreadCount === 1 ? 'ny besked' : 'nye beskeder'}
                    </div>
                )}
            </div>

            <div className="divide-y divide-border/60">
                {messages.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <Mail className="w-16 h-16 text-muted-foreground/30 mb-4" />
                        <h3 className="font-bold text-lg text-foreground">Ingen beskeder endnu</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">Når nogen bruger kontaktformularen på profil- eller togtsiden, vil beskederne lande her i jeres indbakke.</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className={`p-6 transition-colors hover:bg-muted/10 ${!message.isRead ? 'bg-primary/5' : ''}`}>
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="font-bold text-lg text-foreground flex items-center gap-2">
                                            {!message.isRead && <span className="flex h-2.5 w-2.5 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                                            </span>}
                                            {message.senderName}
                                        </div>
                                        <a href={`mailto:${message.senderEmail}`} className="text-sm font-semibold text-primary hover:underline">
                                            &lt;{message.senderEmail}&gt;
                                        </a>
                                    </div>
                                    <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4">
                                        Modtaget den {format(new Date(message.createdAt), "d. MMMM yyyy 'kl.' HH:mm", { locale: da })}
                                    </div>

                                    {/* Kontekst Badges */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted text-foreground/80 rounded-lg text-[11px] uppercase tracking-widest font-semibold border border-border">
                                            <Ship className="w-3.5 h-3.5" /> Generel Henvendelse
                                        </div>
                                        {message.voyage && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[11px] uppercase tracking-widest font-bold border border-primary/20">
                                                <Navigation2 className="w-3.5 h-3.5" /> Vedrører Togt: {message.voyage.title}
                                            </div>
                                        )}
                                    </div>

                                    <div className="prose prose-sm dark:prose-invert text-foreground/90 whitespace-pre-wrap bg-background p-5 rounded-2xl border border-border shadow-inner font-medium">
                                        {message.message}
                                    </div>
                                </div>

                                <div className="flex md:flex-col items-center gap-3 self-end md:self-auto shrink-0 mt-4 md:mt-0 border-t border-border/50 md:border-none pt-4 md:pt-0 w-full md:w-auto justify-end">
                                    <a
                                        href={`mailto:${message.senderEmail}?subject=Svar fra Båden: Vedr. din henvendelse`}
                                        onClick={() => { if (!message.isRead) handleMarkAsRead(message.id); }}
                                        className="px-6 py-2 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:bg-primary transition-all text-center min-w-[140px]"
                                    >
                                        Besvar via Email
                                    </a>

                                    {!message.isRead ? (
                                        <button
                                            onClick={() => handleMarkAsRead(message.id)}
                                            className="px-6 py-2 bg-background border-2 border-primary/20 font-bold text-primary text-xs uppercase tracking-widest rounded-full hover:bg-primary/5 transition-all text-center min-w-[140px]"
                                        >
                                            Markér som læst
                                        </button>
                                    ) : (
                                        <div className="px-6 py-2 flex items-center justify-center gap-2 text-muted-foreground text-xs uppercase tracking-widest font-bold min-w-[140px]">
                                            <CheckCircle2 className="w-4 h-4" /> Læst
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
