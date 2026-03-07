'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Anchor, ArrowRight, Ship, Users } from 'lucide-react';
import { format, isFuture, isPast } from 'date-fns';
import AnimatedLoader from '@/components/AnimatedLoader';
import { da } from 'date-fns/locale';
import { getFallbackImage } from '@/utils/fallbackImage';

interface Boat {
    id: number;
    slug: string;
    name: string;
    profileImage: string | null;
}

interface Voyage {
    id: number;
    slug: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string | null;
    fromLocation: string | null;
    toLocation: string | null;
    imageUrl: string | null;
    availableSeats: number;
    boat: Boat;
}

export default function VoyagesOverviewPage() {
    const [voyages, setVoyages] = useState<Voyage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVoyages = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/voyages`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setVoyages(data);
                }
            } catch (error) {
                console.error('Kunne ikke hente togter', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVoyages();
    }, []);

    const now = new Date();

    const openVoyages = voyages.filter(v => new Date(v.startDate) > now && v.availableSeats > 0);
    const fullVoyages = voyages.filter(v => new Date(v.startDate) > now && v.availableSeats === 0);
    const pastOngoingVoyages = voyages.filter(v => new Date(v.startDate) <= now);

    const VoyageCard = ({ voyage, showSeats = false }: { voyage: Voyage, showSeats?: boolean }) => (
        <Link href={`/boats/${voyage.boat.slug}/voyages/${voyage.slug}`} className="group block h-full">
            <div className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={voyage.imageUrl || getFallbackImage(voyage.id, 'cover')}
                        alt={voyage.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                        {showSeats && voyage.availableSeats > 0 && (
                            <span className="bg-primary/90 text-primary-foreground backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                                <Users className="w-3 h-3" />
                                {voyage.availableSeats} ledige pladser
                            </span>
                        )}
                        {!showSeats && new Date(voyage.startDate) > now && voyage.availableSeats === 0 && (
                            <span className="bg-black/50 text-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                Fuldt booket
                            </span>
                        )}
                        {new Date(voyage.startDate) <= now && (
                            <span className="bg-zinc-800/80 text-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                Historik
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={voyage.boat.profileImage || getFallbackImage(voyage.boat.id, 'avatar')}
                            alt={voyage.boat.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-primary shadow-sm bg-background/50"
                        />
                        <div>
                            <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Båd</p>
                            <p className="text-sm font-semibold">{voyage.boat.name}</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold font-merriweather mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {voyage.title}
                    </h2>

                    <div className="space-y-2 mt-auto text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{voyage.fromLocation || 'Ukendt'} &rarr; {voyage.toLocation || 'Ukendt'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {format(new Date(voyage.startDate), 'd. MMMM yyyy', { locale: da })}
                                {voyage.endDate ? ` - ${format(new Date(voyage.endDate), 'd. MMMM yyyy', { locale: da })}` : ''}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-primary font-bold text-sm uppercase tracking-wider">
                        <span>Læs mere om togtet</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-24 flex justify-center items-center">
                <AnimatedLoader className="scale-125" text="Henter Togter..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="relative py-24 px-4 bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="text-sm font-bold tracking-widest text-primary uppercase mb-4 block">Eventyr Venter</span>
                    <h1 className="text-5xl md:text-6xl font-bold font-merriweather mb-6">Togter til Søs</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Find din næste drømmerejse over de store oceaner, eller dyk ned i sejlerhistorier fra hele verden.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

                {/* Åbne Togter */}
                {openVoyages.length > 0 && (
                    <section>
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold font-merriweather mb-2 text-primary">Ledige Pladser</h2>
                                <p className="text-muted-foreground">Bliv en del af besætningen på disse fremtidige togter.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {openVoyages.map(voyage => (
                                <VoyageCard key={voyage.id} voyage={voyage} showSeats={true} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Fremtidige Togter (Fuldt booket) */}
                {fullVoyages.length > 0 && (
                    <section>
                        <div className="flex items-end justify-between mb-8 pb-4 border-b border-border">
                            <div>
                                <h2 className="text-2xl font-bold font-merriweather mb-2">Planlagte Togter</h2>
                                <p className="text-muted-foreground">Disse togter stævner ud i fremtiden, men mandskabet er allerede sat.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {fullVoyages.map(voyage => (
                                <VoyageCard key={voyage.id} voyage={voyage} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Historik */}
                {pastOngoingVoyages.length > 0 && (
                    <section>
                        <div className="flex items-end justify-between mb-8 pb-4 border-b border-border">
                            <div>
                                <h2 className="text-2xl font-bold font-merriweather mb-2 flex items-center gap-3">
                                    <Anchor className="h-6 w-6 text-muted-foreground/50" />
                                    Tidligere & Igangværende
                                </h2>
                                <p className="text-muted-foreground">Følg med i rejserne, der allerede skriver historie.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pastOngoingVoyages.map(voyage => (
                                <VoyageCard key={voyage.id} voyage={voyage} />
                            ))}
                        </div>
                    </section>
                )}

                {openVoyages.length === 0 && fullVoyages.length === 0 && pastOngoingVoyages.length === 0 && (
                    <div className="text-center py-24 bg-card rounded-3xl border border-border">
                        <Ship className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Ingen togter at vise</h3>
                        <p className="text-muted-foreground">Bådene har ikke planlagt nogle togter endnu.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
