import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import { da } from 'date-fns/locale';
import { MapPin, Navigation, CalendarDays, Users, Anchor, CheckCircle2, Navigation2, FileText, UserCircle2, Settings2, ShieldAlert, Ship, Compass, HelpCircle, Coins } from 'lucide-react';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/ContactForm';

export const revalidate = 60; // 60 sek. Cache

async function getVoyage(voyageSlug: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/voyages/${voyageSlug}`, { next: { revalidate: 60 } });
        if (res.headers.get('x-render-routing') === 'no-server' || res.status >= 500) {
            throw new Error(`API Offline eller Server Fejl: ${res.status}`);
        }
        if (!res.ok) {
            notFound();
        }
        return res.json();
    } catch (e: any) {
        if (e.message === 'NEXT_NOT_FOUND') throw e; // Lad Next.js håndtere notFound()
        console.error('Failed to fetch voyage:', e);
        throw e;
    }
}

export default async function VoyagePage({ params }: { params: Promise<{ slug: string; voyageSlug: string }> | { slug: string; voyageSlug: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const voyageSlug = resolvedParams.voyageSlug;

    const voyage = await getVoyage(voyageSlug);

    if (!voyage || voyage.error) {
        return <div className="p-10 font-mono text-red-500">API Error debugging on Vercel: {JSON.stringify(voyage)}</div>;
    }

    const fallbackImage = 'https://images.unsplash.com/photo-1544331002-c940ce98a8da?q=80&w=2000&auto=format&fit=crop';
    const displayImage = voyage.imageUrl || fallbackImage;

    // Kaptajn(er) (BOAT_ADMIN)
    const captains = voyage.boat.crewMemberships.filter((cm: any) => cm.role === 'BOAT_ADMIN');

    return (
        <div className="flex flex-col bg-background">
            <main className="flex-1 pb-24">
                {/* Hero Section */}
                <div className="relative w-full h-[60vh] min-h-[500px] mb-12 overflow-hidden border-b border-border/40">
                    <img
                        src={displayImage}
                        alt="Togts rute eller cover"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 text-center">
                        <div className="max-w-4xl mx-auto flex flex-col items-center">

                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary uppercase tracking-widest text-xs font-bold mb-6">
                                <Compass className="w-4 h-4" />
                                Officielt Togt
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-merriweather font-black text-foreground drop-shadow-md leading-[1.1] mb-6">
                                {voyage.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm md:text-base font-medium text-foreground/90 backdrop-blur-sm bg-background/20 p-4 rounded-2xl border border-border/30 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-primary w-5 h-5" />
                                    <span>{voyage.fromLocation || 'Ikke angivet'}</span>
                                    <span className="text-muted-foreground mx-2">&rarr;</span>
                                    <span>{voyage.toLocation || 'De syv verdenshave'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="text-primary w-5 h-5" />
                                    <span>{format(new Date(voyage.startDate), 'd. MMM yyyy', { locale: da })}</span>
                                    {voyage.endDate && (
                                        <>
                                            <span className="text-muted-foreground mx-1">-</span>
                                            <span>{format(new Date(voyage.endDate), 'd. MMM yyyy', { locale: da })}</span>
                                        </>
                                    )}
                                </div>
                                {voyage.bunkFee && (
                                    <div className="flex items-center gap-2 relative group">
                                        <Coins className="text-primary w-5 h-5" />
                                        <span>Køjepenge: {voyage.bunkFee}</span>
                                        {/* Tooltip trigger */}
                                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />

                                        {/* Hover Tooltip - Hidden by default, absolute positioned */}
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-72 p-4 bg-background text-foreground border border-border shadow-2xl rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-50 transform scale-95 group-hover:scale-100 text-sm text-left font-normal leading-snug">
                                            Køjepenge er det solidariske bidrag til bådens drift og kan ikke betragtes som egentlig betaling for en rejse.
                                            <Link href="/laer-om-langturssejlads" className="text-primary font-bold mt-2 block hover:underline">
                                                Læs mere om reglerne &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Venstre Kolonne: Indhold */}
                        <div className="lg:col-span-8">
                            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-[1.8] font-medium opacity-90 tracking-[0.015em]">
                                <h2 className="font-merriweather text-3xl font-black mb-6">Om rejsen</h2>
                                {voyage.description ? (
                                    <div className="text-lg" dangerouslySetInnerHTML={{ __html: voyage.description }} />
                                ) : (
                                    <p className="whitespace-pre-line text-lg">Der er ingen yderligere beskrivelse af dette togt.</p>
                                )}
                            </div>

                            {/* Togtlogbog / Posts for dette togt (Fremtidigt if der findes opslag) */}
                            {voyage.posts && voyage.posts.length > 0 && (
                                <div className="mt-16 pt-12 border-t border-border/50">
                                    <h3 className="font-merriweather text-2xl font-black mb-8 flex items-center gap-3">
                                        <Anchor className="w-6 h-6 text-primary" />
                                        Logbog fra turen
                                    </h3>
                                    <div className="space-y-6">
                                        {voyage.posts.map((post: any) => (
                                            <Link key={post.id} href={`/posts/${post.slug || post.id}`} className="block group">
                                                <div className="bg-white border flex items-center gap-6 rounded-2xl border-border shadow-sm p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                                    {post.imageUrl && (
                                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 relative">
                                                            <img src={post.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{post.title || 'Logbogsopdatering'}</h4>
                                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.content}</p>
                                                        <time dateTime={post.createdAt} className="text-xs font-bold uppercase tracking-widest text-primary mt-3 block">
                                                            {format(new Date(post.createdAt), 'd. MMM yyyy', { locale: da })}
                                                        </time>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Højre Kolonne: Skibet & Kaptajn */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 flex flex-col gap-6">

                                {/* Båd Kort */}
                                <div className="bg-background rounded-3xl border border-border shadow-xl overflow-hidden">
                                    <div className="h-32 w-full relative">
                                        <img src={voyage.boat.coverImage || fallbackImage} alt="Boat Cover" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-6 relative text-center flex flex-col items-center">
                                        <div className="w-20 h-20 rounded-full bg-white border-4 border-background overflow-hidden relative shadow-lg -mt-16 mb-4">
                                            {voyage.boat.profileImage ? (
                                                <img src={voyage.boat.profileImage} alt={voyage.boat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Ship className="w-10 h-10 m-auto mt-4 text-muted-foreground" />
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold font-merriweather">{voyage.boat.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{voyage.boat.description}</p>

                                        <Link href={`/boats/${voyage.boat.slug}`} className="mt-6 w-full py-3 bg-secondary text-secondary-foreground font-bold text-sm tracking-widest uppercase rounded-full hover:bg-secondary/80 transition-colors">
                                            Gå til Bådprofil
                                        </Link>
                                    </div>
                                </div>

                                {/* Kaptajn Kort */}
                                {captains && captains.length > 0 && (
                                    <div className="bg-background rounded-3xl border border-border shadow-md p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Users className="w-5 h-5 text-primary" />
                                            <h3 className="font-bold uppercase tracking-widest text-sm text-muted-foreground">Bag Roret</h3>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            {captains.map((cm: any) => (
                                                <div key={cm.user.id} className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-full border-2 border-primary/20 overflow-hidden shrink-0 shadow-sm relative shadow-inner">
                                                        <img src={cm.user.profileImage || 'https://images.unsplash.com/photo-1544331002-c940ce98a8da'} alt={cm.user.name} className="absolute inset-0 w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-base">{cm.user.name}</h4>
                                                        <p className="text-xs uppercase font-bold tracking-widest text-primary mt-0.5">Kaptajn</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Kontakt Båden */}
                                <div className="mt-4">
                                    <ContactForm boatId={voyage.boat.id} voyageId={voyage.id} boatName={voyage.boat.name} />
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* Moderation Link for the entire Voyage Page */}
                <div className="mt-16 flex justify-center border-t border-border/40 pt-10">
                    <Link href="/moderation" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors opacity-60 hover:opacity-100" title="Rapportér anstødeligt indhold">
                        <ShieldAlert className="w-4 h-4" />
                        Rapportér Indhold
                    </Link>
                </div>
            </main>
        </div>
    );
}
