'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ship, Anchor, Search, ArrowRight, Clock } from 'lucide-react';
import AnimatedLoader from '@/components/AnimatedLoader';

export default function NoBoatDashboard({ user }: { user: any }) {
    const [boats, setBoats] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRequesting, setIsRequesting] = useState<number | null>(null);
    const [myRequests, setMyRequests] = useState<number[]>([]);

    useEffect(() => {
        const fetchBoatsAndRequests = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('user_token');

                // Fetch public boats
                const boatsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boats`);
                if (boatsRes.ok) {
                    const data = await boatsRes.json();
                    setBoats(data);
                }

                // Fetch current user's requests if logged in
                if (token) {
                    const reqRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/join-request`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (reqRes.ok) {
                        const myReqsData = await reqRes.json();
                        // Assume it returns an array of pending requests { boatId: number }
                        const reqIds = myReqsData.map((r: any) => r.boatId);
                        setMyRequests(reqIds);
                    }
                }
            } catch (error) {
                console.error('Failed to load boats', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBoatsAndRequests();
    }, []);

    const handleJoinRequest = async (boatId: number) => {
        const token = localStorage.getItem('user_token');
        if (!token) return;

        setIsRequesting(boatId);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/join-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ boatId })
            });

            if (res.ok) {
                alert('Ansøgning sendt! Kaptajnen har modtaget en mail.');
                setMyRequests([...myRequests, boatId]);
            } else {
                const err = await res.json();
                alert(err.error || 'Kunne ikke sende ansøgning.');
            }
        } catch (error) {
            alert('Netværksfejl.');
        } finally {
            setIsRequesting(null);
        }
    };

    const filteredBoats = boats.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-muted/20 pb-24">
            <div className="max-w-4xl mx-auto px-4 pt-16">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-merriweather font-black mb-4">Velkommen til Dækket</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Du er endnu ikke tilknyttet en båd. For at oprette logbøger og invitere venner, skal du enten starte din egen sejlads eller anmode om at blive gast hos en anden.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-20 animate-fade-in-up">
                    <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 hover:shadow-xl hover:border-primary/50 transition-all flex flex-col items-center text-center">
                        <div className="bg-primary/10 p-5 rounded-full mb-6 text-primary">
                            <Ship className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold font-merriweather mb-3">Er du Kaptajn?</h2>
                        <p className="text-muted-foreground mb-8">
                            Registrér din båd, udfyld profilen, inviter din besætning og start din digitale logbog her på platformen.
                        </p>
                        <Link href="/opret-baad" className="mt-auto bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl shadow-md hover:bg-primary/90 hover:scale-105 transition-all w-full flex items-center justify-center gap-2">
                            Opret din Båd Nu <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl transition-all flex flex-col items-center text-center">
                        <div className="bg-muted p-5 rounded-full mb-6 text-foreground">
                            <Anchor className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold font-merriweather mb-3">Er du Gast?</h2>
                        <p className="text-muted-foreground mb-8">
                            Søg efter venner eller familie blandt de registrerede både, og send en anmodning for at blive en del af deres besætning.
                        </p>
                        <button onClick={() => document.getElementById('boatSearch')?.focus()} className="mt-auto bg-muted text-foreground font-bold px-8 py-4 rounded-xl hover:bg-muted/80 w-full flex items-center justify-center gap-2">
                            Find eksisterende Båd <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-8 max-w-2xl mx-auto shadow-lg">
                    <h3 className="text-xl font-bold font-merriweather mb-6 flex items-center gap-3">
                        <Search className="text-muted-foreground" />
                        Søg efter en Båd
                    </h3>

                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            id="boatSearch"
                            type="text"
                            placeholder="Søg på bådens navn..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-lg placeholder:font-normal"
                        />
                    </div>

                    {isLoading ? (
                        <div className="py-12 flex justify-center"><AnimatedLoader /></div>
                    ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredBoats.length > 0 ? (
                                filteredBoats.map(boat => {
                                    const hasRequested = myRequests.includes(boat.id);
                                    return (
                                        <div key={boat.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors">
                                            {boat.profileImage ? (
                                                <img src={boat.profileImage} alt={boat.name} className="w-12 h-12 rounded-full object-cover border border-border" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                    <Ship className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-bold text-foreground">{boat.name}</h4>
                                                <Link href={`/boats/${boat.slug}`} target="_blank" className="text-xs text-primary hover:underline">Se Profil</Link>
                                            </div>

                                            {hasRequested ? (
                                                <div className="flex items-center gap-2 text-sm font-bold text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg">
                                                    <Clock className="w-4 h-4" /> Venter på Svar
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleJoinRequest(boat.id)}
                                                    disabled={isRequesting === boat.id}
                                                    className="px-5 py-2 rounded-lg font-bold text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                                                >
                                                    {isRequesting === boat.id ? 'Sender...' : 'Anmod'}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Ingen både fandtes på "{searchQuery}".
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
