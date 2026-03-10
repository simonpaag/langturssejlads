import Link from 'next/link';
import { Ship } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { getFallbackImage } from '@/utils/fallbackImage';
import AdCard from '@/components/AdCard';

interface Boat {
    id: number;
    slug: string;
    name: string;
    description: string;
    coverImage: string | null;
    profileImage: string | null;
    crewMemberships: {
        user: { id: number; name: string };
        role: string;
    }[];
}

export const revalidate = 60; // Cachet i 60 sekunder på Vercel

export default async function BoatsPage() {
    let boats: Boat[] = [];
    let activeAds: any[] = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const [boatsRes, adsRes] = await Promise.all([
            fetch(`${apiUrl}/api/boats`, { next: { revalidate: 60 } }),
            fetch(`${apiUrl}/api/posts/ads`, { next: { revalidate: 60 } })
        ]);
        if (!boatsRes.ok) {
            throw new Error(`API error: ${boatsRes.status}`);
        }
        boats = await boatsRes.json();
        if (adsRes.ok) activeAds = await adsRes.json();
    } catch (error) {
        console.error('Failed to fetch boats:', error);
        throw error;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="relative py-16 md:py-20 px-4 bg-black overflow-hidden flex flex-col justify-center min-h-[25vh] border-b border-border/10 text-center -mx-4 sm:-mx-6 lg:-mx-8 mb-16">
                <img
                    src="/images/boats-hero.jpg"
                    alt="Sejlbåd fra masten"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent opacity-80"></div>

                <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col items-center">
                    <span className="text-sm font-bold tracking-widest text-primary uppercase mb-4 block drop-shadow-md bg-black/30 px-4 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm">Sejlere i verden</span>
                    <h1 className="text-5xl md:text-7xl font-bold font-merriweather mb-6 text-white drop-shadow-xl tracking-tight">Mød Bådene</h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-medium">
                        Opdag de danske både, der lige nu befinder sig på verdenshavene.
                    </p>
                    <div className="mt-8 text-sm font-bold uppercase tracking-widest bg-primary/90 text-white px-6 py-3 rounded-full backdrop-blur shadow-xl border border-white/10">
                        Registeret: {boats.length} både
                    </div>

                    {/* Frivillige Info Boks */}
                    <div className="mt-12 lg:mt-16 w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-left shadow-2xl transition-transform hover:-translate-y-1 duration-300">
                        <div className="bg-primary/20 p-4 rounded-full text-white shrink-0 shadow-inner">
                            <Ship className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold font-merriweather text-white mb-2 drop-shadow-sm">Hjælp os med at få flere både med! ⚓️</h3>
                            <p className="text-white/90 leading-relaxed font-medium">
                                Langturssejlads.dk er drevet af frivillige kræfter og passionen for havet. Vi mangler altid flere både på landkortet og spændende togter at drømme os væk i.
                                Vil du være med til at opbygge fællesskabet? <Link href="/opret-baad" className="text-white hover:text-primary transition-colors underline font-bold underline-offset-4">Opret din båd gratis i dag</Link>, tilføj dine togter, eller skriv forslag til os i logbogen. Sammen skaber vi Danmarks fedeste mødested for langturssejlere!
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {boats.map((boat, idx) => {
                    const ad = activeAds.find(a => a.placement === idx);
                    return (
                        <div className="contents" key={boat.id}>
                            {ad && (
                                <AdCard ad={ad} />
                            )}
                            <Link href={`/boats/${boat.slug}`} className="block group">
                                <div className="flex flex-col h-full hover-lift">
                                    <div className="relative w-full aspect-[4/3] bg-muted mb-6 overflow-hidden border border-border">
                                        <ImageWithFallback
                                            src={boat.profileImage || boat.coverImage}
                                            fallbackSrc={getFallbackImage(boat.id, 'cover')}
                                            alt={`Sejlbåden ${boat.name} - Danske Sejlere`}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out grayscale-[15%]"
                                        />
                                    </div>
                                    <div className="flex-1 border-t border-border pt-4">
                                        <h2 className="text-3xl font-merriweather font-bold mb-3 group-hover:text-primary transition-colors">
                                            {boat.name}
                                        </h2>
                                        <p className="text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                                            {boat.description || 'Ingen officiel logbogs-beskrivelse endnu.'}
                                        </p>

                                        <div className="text-xs font-bold uppercase tracking-widest text-primary">
                                            {boat.crewMemberships.length > 0 ? (
                                                <p>Mandskab: <span className="text-foreground">{boat.crewMemberships.map(c => c.user.name).join(', ')}</span></p>
                                            ) : (
                                                <p className="text-muted-foreground">Mangler mandskab</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}

                {boats.length === 0 && (
                    <div className="col-span-full py-32 text-center border-b-[2px] border-foreground">
                        <h2 className="text-3xl font-merriweather font-bold text-muted-foreground">Havnen er tom.</h2>
                        <p className="text-muted-foreground mt-4">Ingen skibe er registreret endnu.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
