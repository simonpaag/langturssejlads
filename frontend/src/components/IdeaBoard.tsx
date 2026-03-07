'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Cog, Beaker, Rocket, MessageSquareText } from 'lucide-react';

interface Idea {
    id: number;
    name: string;
    message: string;
    status: 'IDEA' | 'IN_PROCESS' | 'IN_TEST' | 'LIVE';
    createdAt: string;
}

export default function IdeaBoard() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
                const res = await fetch(`${apiUrl}/api/ideas`);
                if (res.ok) {
                    const data = await res.json();
                    setIdeas(data);
                }
            } catch (err) {
                console.error('Failed to fetch ideas:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIdeas();
    }, []);

    const columns = [
        { id: 'IDEA', title: 'Ideer', icon: <Lightbulb className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
        { id: 'IN_PROCESS', title: 'I proces', icon: <Cog className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
        { id: 'IN_TEST', title: 'I test', icon: <Beaker className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
        { id: 'LIVE', title: 'Live', icon: <Rocket className="w-5 h-5" />, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' }
    ];

    if (isLoading) {
        return (
            <div className="w-full py-12 flex justify-center mt-16">
                <div className="animate-pulse flex items-center gap-3 text-muted-foreground font-bold uppercase tracking-widest text-sm">
                    <Cog className="w-5 h-5 animate-spin aspect-square" />
                    Henter Logbogs Idéer...
                </div>
            </div>
        );
    }

    return (
        <div className="mt-24 w-full">
            <div className="text-center mb-12">
                <h3 className="text-3xl font-merriweather font-black text-foreground mb-4">Projektets Udviklings-Log</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">Følg med i maskinrummet! Her kan du se hvilke idéer fællesskabet har sendt ind, og hvor langt vi er med at bygge dem ind i platformen.</p>
            </div>

            <div className="flex flex-nowrap overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
                {columns.map(col => {
                    const colIdeas = ideas.filter(idea => idea.status === col.id);
                    return (
                        <div key={col.id} className="min-w-[280px] w-full max-w-[350px] shrink-0 snap-start bg-muted/30 rounded-3xl border border-border/50 p-4 flex flex-col h-[600px]">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className={`flex items-center gap-2 font-bold ${col.color}`}>
                                    <div className={`p-1.5 rounded-lg ${col.bg}`}>
                                        {col.icon}
                                    </div>
                                    <span className="uppercase tracking-widest text-sm">{col.title}</span>
                                </div>
                                <span className={`text-xs font-black min-w-[24px] text-center px-2 py-0.5 rounded-full ${col.bg} ${col.color}`}>
                                    {colIdeas.length}
                                </span>
                            </div>

                            {/* Cards Container */}
                            <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2 scrollbar-thin">
                                {colIdeas.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border/50 rounded-2xl opacity-50">
                                        <MessageSquareText className="w-8 h-8 text-muted-foreground mb-3" />
                                        <p className="text-sm font-semibold text-muted-foreground">Ingen idéer her endnu</p>
                                    </div>
                                ) : (
                                    colIdeas.map(idea => (
                                        <div key={idea.id} className="bg-background border border-border/50 hover:border-border transition-colors rounded-2xl p-5 shadow-sm hover:shadow-md group cursor-default">
                                            <p className="text-sm text-foreground/90 leading-relaxed font-serif break-words">"{idea.message}"</p>

                                            <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                                                        {idea.name.charAt(0)}
                                                    </div>
                                                    <span className="text-xs font-semibold text-muted-foreground capitalize">{idea.name}</span>
                                                </div>
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                                                    {new Date(idea.createdAt).toLocaleDateString('da-DK', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
