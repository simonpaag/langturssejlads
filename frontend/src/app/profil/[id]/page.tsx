import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Anchor, Calendar, ArrowLeft, Anchor as AnchorIcon, Ship } from 'lucide-react';
import { getFallbackImage } from '@/utils/fallbackImage';

interface ProfileProps {
    params: Promise<{
        id: string;
    }>;
}

async function getProfile(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/crew-profiles/${id}`, {
        next: { revalidate: 60 } // Cache in 60 seconds
    });

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Kunne ikke hente gasteprofil');
    }

    return res.json();
}

export async function generateMetadata({ params }: ProfileProps): Promise<Metadata> {
    const resolvedParams = await params;
    const profile = await getProfile(resolvedParams.id);

    if (!profile) {
        return { title: 'Profil ikke fundet' };
    }

    return {
        title: `${profile.user.name} | Gasteprofil`,
        description: profile.description.substring(0, 160) + '...',
    };
}

export default async function ProfilePage({ params }: ProfileProps) {
    const resolvedParams = await params;
    const profile = await getProfile(resolvedParams.id);

    if (!profile) {
        notFound();
    }

    const { user, description, availablePeriod, experience, homePort, galleryImages, isActive } = profile;
    const profileImg = user.profileImage || getFallbackImage(user.id, 'avatar');

    // Murer-style galleri helper
    const getGridClasses = (index: number, total: number) => {
        if (total === 1) return "col-span-2 row-span-2 md:col-span-3 md:row-span-2 aspect-[16/9]";
        if (total === 2) return "col-span-2 md:col-span-3 aspect-[4/3]";
        if (index === 0) return "col-span-2 row-span-2 md:col-span-2 aspect-square md:aspect-auto";
        if (index === 3) return "col-span-2 md:col-span-1 aspect-[4/3] md:aspect-square";
        return "col-span-1 aspect-square";
    };

    const displayRole = (role: string) => {
        switch (role) {
            case 'OWNER': return 'Ejer';
            case 'ADMIN': return 'Admin';
            case 'CONTENT_MANAGER': return 'Medforfatter';
            default: return 'Gast';
        }
    };

    return (
        <main className="min-h-screen bg-background">
            {/* Header Sektion */}
            <div className="relative pt-32 pb-20 overflow-hidden bg-primary/5 border-b border-border">
                {/* Baggrunds-mønster (Blødt havmønster) */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                
                <div className="max-w-5xl mx-auto px-4 sm:px-6 z-10 relative">
                    <Link href="/gaster" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        Tilbage til Gaster
                    </Link>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 text-center md:text-left">
                        {/* Profilbillede med "Søger" Badge */}
                        <div className="relative shrink-0">
                            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-background shadow-2xl bg-muted/30">
                                <img src={profileImg} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            {isActive && (
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest shadow-lg border-2 border-background whitespace-nowrap animate-fade-in-up">
                                    Søger Gast-plads
                                </div>
                            )}
                        </div>

                        {/* Navn & Kort info */}
                        <div className="flex-1 mt-4 md:mt-8">
                            <h1 className="text-4xl md:text-5xl font-black font-merriweather mb-4 text-foreground">{user.name}</h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                                Gasteprofil oprettet hos Danske Langturssejlere. Klar til at tage med på nye eventyr.
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                                <div className="flex items-center gap-2 bg-background border border-border px-4 py-2.5 rounded-xl shadow-sm">
                                    <MapPin className="w-5 h-5 text-primary opacity-70" />
                                    <span className="font-bold text-sm">{homePort || 'Hjemhavn ikke angivet'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-background border border-border px-4 py-2.5 rounded-xl shadow-sm">
                                    <Anchor className="w-5 h-5 text-primary opacity-70" />
                                    <span className="font-bold text-sm">{experience ? 'Erfaren' : 'Letmatros'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    
                    {/* Venstre Søjle (Primært indhold) */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Om Mig */}
                        <section className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-xl">
                            <h2 className="text-2xl font-bold font-merriweather mb-6 flex items-center gap-3">
                                <span className="bg-primary/20 text-primary p-2 rounded-xl"><AnchorIcon className="w-6 h-6" /></span>
                                Om {user.name.split(' ')[0]}
                            </h2>
                            <div className="prose prose-lg dark:prose-invert prose-p:leading-relaxed text-foreground/90 max-w-none whitespace-pre-wrap">
                                {description}
                            </div>
                        </section>

                        {/* Billedgalleri */}
                        {galleryImages && galleryImages.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold font-merriweather mb-6">Galleri</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 auto-rows-[250px]">
                                    {galleryImages.slice(0, 5).map((imgUrl: string, idx: number) => (
                                        <div key={idx} className={`relative rounded-2xl sm:rounded-3xl overflow-hidden group shadow-md ${getGridClasses(idx, galleryImages.length)}`}>
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                                            <img
                                                src={imgUrl}
                                                alt={`Billede ${idx + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Højre Søjle (Specifikationer & Nuværende både) */}
                    <div className="space-y-8">
                        {/* Specifikationsboks */}
                        <div className="bg-muted/30 border border-border rounded-3xl p-8 sticky top-32 shadow-lg">
                            <h3 className="text-xl font-bold font-merriweather mb-6 border-b border-border/50 pb-4">Detaljer</h3>
                            
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <Calendar className="w-6 h-6 text-primary shrink-0 opacity-80" />
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Periode</p>
                                        <p className="font-bold">{availablePeriod || 'Ikke specificeret'}</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <Anchor className="w-6 h-6 text-primary shrink-0 opacity-80" />
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Erfaring</p>
                                        <p className="font-bold">{experience || 'Ingen specifik erfaring angivet'}</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <MapPin className="w-6 h-6 text-primary shrink-0 opacity-80" />
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Hjemhavn</p>
                                        <p className="font-bold">{homePort || 'Ukendt'}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Både Gasten Sejler På */}
                        {user.crewMemberships && user.crewMemberships.length > 0 && (
                            <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 shadow-xl">
                                <h3 className="text-xl font-bold font-merriweather mb-6 flex items-center gap-2">
                                    <Ship className="w-5 h-5 text-primary" />
                                    Mønstret på
                                </h3>
                                <div className="space-y-4">
                                    {user.crewMemberships.map((membership: any) => (
                                        <Link 
                                            key={membership.boat.id} 
                                            href={`/boats/${membership.boat.slug}`}
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted border border-border/50 transition-colors group"
                                        >
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-background shrink-0 border border-border">
                                                <img 
                                                    src={membership.boat.profileImage || getFallbackImage(membership.boat.id, 'cover')} 
                                                    alt={membership.boat.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold truncate text-foreground group-hover:text-primary transition-colors">{membership.boat.name}</p>
                                                </div>
                                                <p className="text-xs font-bold text-muted-foreground uppercase opacity-80 tracking-wider flex items-center gap-1.5 mt-1">
                                                    <span>{displayRole(membership.role)}</span>
                                                    {!membership.boat.isActive && <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 rounded-sm">Inaktiv</span>}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}
