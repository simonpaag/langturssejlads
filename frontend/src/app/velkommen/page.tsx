'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Anchor, Waves, Sailboat } from 'lucide-react';

const INTEREST_CARDS = [
    {
        id: 'baadejer',
        title: 'Jeg har en båd',
        description: 'Tilknyt dit skib, skriv logbog og lad vennerne følge med på de syv verdenshave.',
        icon: Sailboat,
        color: 'from-blue-500 to-cyan-400'
    },
    {
        id: 'gast',
        title: 'Jeg er gast',
        description: 'Søg eventyret, find ledige køjer og spring ombord på dit næste store togt.',
        icon: Anchor,
        color: 'from-amber-400 to-orange-500'
    },
    {
        id: 'droemmer',
        title: 'Drømmer',
        description: 'Hold dig opdateret fra sidelinjen, læs fantastiske historier og find inspiration.',
        icon: Waves,
        color: 'from-indigo-400 to-purple-500'
    }
];

export default function WelcomeWizard() {
    const router = useRouter();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('user_token');
        if (!storedToken) {
            router.push('/login');
        } else {
            setToken(storedToken);
        }
    }, [router]);

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleContinue = async () => {
        if (!token || selectedInterests.length === 0) return;
        setIsSubmitting(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/auth/interests`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ interests: selectedInterests }),
            });

            if (res.ok) {
                // Route baseret på valg
                if (selectedInterests.includes('baadejer')) {
                    router.push('/opret-baad');
                } else {
                    router.push('/');
                }
            } else {
                console.error("Kunne ikke gemme interesser");
                router.push('/'); // Fallback
            }
        } catch (error) {
            console.error(error);
            router.push('/');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) return <div className="min-h-screen flex items-center justify-center">Henter kahytten...</div>;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full">

                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                        <Anchor className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-merriweather font-black text-foreground mb-4">
                        Velkommen ombord!
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Vi er glade for at have dig med. Hvad bringer dig til verdenshavene?
                        <br className="hidden md:block" /> (Du kan sagtens vælge flere)
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-2">
                    {INTEREST_CARDS.map((card, idx) => {
                        const isSelected = selectedInterests.includes(card.id);
                        const Icon = card.icon;

                        return (
                            <button
                                key={card.id}
                                onClick={() => toggleInterest(card.id)}
                                className={`
                                    relative group p-8 rounded-[2rem] text-left transition-all duration-300 ease-out border-2 overflow-hidden
                                    ${isSelected
                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-105'
                                        : 'border-border/60 bg-card hover:border-primary/50 hover:bg-muted/50 hover:shadow-xl hover:-translate-y-1'
                                    }
                                `}
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                {/* Background gradient glow logic */}
                                {isSelected && (
                                    <div className={`absolute -inset-10 bg-gradient-to-br ${card.color} opacity-10 blur-2xl pointer-events-none rounded-full`}></div>
                                )}

                                <div className="relative z-10">
                                    <div className={`
                                        w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300
                                        ${isSelected ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}
                                    `}>
                                        <Icon className="w-7 h-7" />
                                    </div>

                                    <h3 className="text-2xl font-merriweather font-bold text-foreground mb-3">
                                        {card.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>

                                <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-border'}`}>
                                    {isSelected && (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-white stroke-[3]">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleContinue}
                        disabled={selectedInterests.length === 0 || isSubmitting}
                        className="bg-primary text-primary-foreground font-bold px-12 py-4 rounded-full w-full md:w-auto shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:-translate-y-1 text-lg"
                    >
                        {isSubmitting ? 'Pakker køjesækken...' : 'Sæt Sejl →'}
                    </button>
                </div>

            </div>
        </div>
    );
}
