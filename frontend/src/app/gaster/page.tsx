import Link from 'next/link';
import { UserCircle2, ArrowRight, Anchor } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { getFallbackImage } from '@/utils/fallbackImage';
import AdCard from '@/components/AdCard';
import GastLink from '@/components/gaster/GastLink';

interface CrewProfile {
    id: number;
    userId: number;
    description: string;
    availablePeriod: string | null;
    experience: string | null;
    homePort: string | null;
    user: {
        id: number;
        name: string;
        profileImage: string | null;
    };
    updatedAt: string;
}

export const revalidate = 60; // Cachet i 60 sekunder på Vercel

export default async function GasterPage() {
    let gaster: CrewProfile[] = [];
    let activeAds: any[] = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api-103499885172.europe-north1.run.app';
        const [gasterRes, adsRes] = await Promise.all([
            fetch(`${apiUrl}/api/crew-profiles`, { next: { revalidate: 60 } }),
            fetch(`${apiUrl}/api/posts/ads`, { next: { revalidate: 60 } })
        ]);
        if (!gasterRes.ok) {
            throw new Error(`API error: ${gasterRes.status}`);
        }
        gaster = await gasterRes.json();
        if (adsRes.ok) activeAds = await adsRes.json();
    } catch (error) {
        console.error('Failed to fetch crew profiles:', error);
        throw error;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="relative py-16 md:py-20 px-4 bg-muted/40 overflow-hidden flex flex-col justify-center min-h-[20vh] border-b border-border/10 text-center -mx-4 sm:-mx-6 lg:-mx-8 mb-16">
                <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 w-full">
                        <span className="text-sm font-bold tracking-widest text-primary uppercase mb-4 inline-block px-4 py-1 rounded-full border border-primary/20 bg-primary/5">Ledige Køjeblokke</span>
                        <h1 className="text-5xl md:text-7xl font-bold font-merriweather mb-6 text-foreground tracking-tight drop-shadow-sm">Find Gast</h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
                            Står du og mangler et par ekstra hænder ombord? Her kan du browse igennem eventyrlystne gaster, der drømmer om at komme afsted.
                        </p>
                        <div className="mt-8 text-sm font-bold uppercase tracking-widest bg-foreground text-background px-6 py-3 rounded-full shadow-md inline-block">
                            {gaster.length} Aktive Profiler
                        </div>
                    </div>

                    {/* Frivillige Info Boks (Tilpasset Gaster) - Post-it style */}
                    <div className="w-full max-w-md lg:w-[450px] shrink-0 bg-primary/10 backdrop-blur-md border border-primary/30 rounded-3xl p-6 md:p-8 flex flex-col gap-5 text-left shadow-2xl transform lg:-rotate-2 lg:hover:rotate-0 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary shadow-inner shrink-0">
                                <UserCircle2 className="w-6 h-6" />
                            </span>
                            <h3 className="text-xl md:text-2xl font-bold font-merriweather text-foreground drop-shadow-sm leading-tight">Er du selv gast? ⛵️</h3>
                        </div>
                        <p className="text-foreground/90 leading-relaxed font-medium">
                            Platformen er åben for alle vandhunde. Meld dig ind, byg din Gaste-profil og bliv fundet af bådejere, der står og mangler lige netop dig til den næste store krydsning.
                            <br />
                            <GastLink />
                        </p>
                    </div>
                </div>
            </header>

            {gaster.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 border border-border/50 rounded-3xl">
                    <p className="text-xl text-muted-foreground mb-2">P.t. ingen aktive gaster at finde.</p>
                    <Link href="/profil/gast" className="font-bold border-b-2 border-primary/50 text-foreground hover:text-primary transition-colors">Vær den første til at oprette dig!</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {gaster.map((profile, idx) => {
                        const ad = activeAds.find(a => a.placement === idx);
                        return (
                            <div className="contents" key={profile.id}>
                                {ad && (
                                    <AdCard ad={ad} />
                                )}
                                <Link href={`/profil/${profile.userId}`} className="block group">
                                    <div className="flex flex-col h-full bg-card hover:bg-muted/30 hover:-translate-y-1 transition-all duration-300 rounded-3xl border border-border/80 overflow-hidden shadow-sm hover:shadow-lg">
                                        <div className="relative w-full aspect-square bg-muted overflow-hidden">
                                            <ImageWithFallback
                                                src={profile.user.profileImage}
                                                fallbackSrc={getFallbackImage(profile.userId, 'avatar')}
                                                alt={`Gast ${profile.user.name}`}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                            />
                                        </div>
                                        <div className="flex-1 p-6 md:p-8 flex flex-col">
                                            <h2 className="text-2xl font-merriweather font-bold mb-3 group-hover:text-primary transition-colors">
                                                {profile.user.name}
                                            </h2>

                                            <div className="space-y-3 mb-6 flex-1">
                                                {profile.availablePeriod && (
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pt-1 w-20 shrink-0">Periode</span>
                                                        <span className="text-sm font-medium">{profile.availablePeriod}</span>
                                                    </div>
                                                )}
                                                {profile.experience && (
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pt-1 w-20 shrink-0">Erfaring</span>
                                                        <span className="text-sm font-medium text-muted-foreground line-clamp-2">{profile.experience}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="border-t border-border pt-4 flex items-center justify-between text-sm font-bold uppercase tracking-widest text-primary group-hover:text-foreground transition-colors">
                                                Læs mere <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
