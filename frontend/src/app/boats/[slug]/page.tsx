import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { Anchor, Compass, UserCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export interface Post {
    id: number;
    slug: string;
    title: string | null;
    content: string | null;
    postType: string;
    youtubeUrl: string | null;
    imageUrl: string | null;
    status: string;
    createdAt: string;
    author: { name: string; profileImage: string | null; };
    voyage: { title: string } | null;
}

interface Boat {
    id: number;
    slug: string;
    name: string;
    description: string;
    coverImage: string | null;
    profileImage: string | null;
    crewMemberships: {
        user: { name: string; profileImage: string | null; };
        role: string;
    }[];
    voyages: {
        id: number;
        slug: string;
        title: string;
        description: string | null;
        startDate: string;
        endDate: string | null;
    }[];
}

import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function BoatProfile({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams.slug;
    noStore();
    let boat: Boat | null = null;
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/boats/${slug}`, { cache: 'no-store' });
        if (res.ok) {
            boat = await res.json();
        }
    } catch (error: any) {
        console.error('Failed to fetch boat profile:', error);
    }

    // Fetch posts specifically for this boat
    let posts: Post[] = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/posts`, { cache: 'no-store' });
        if (res.ok) {
            const allPosts: Post[] = await res.json();
            posts = allPosts.filter((p: any) => p.boat?.slug === slug);
        }
    } catch (error) {
        console.error('Failed to fetch boat posts');
    }

    if (!boat) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-32 text-center border-b-[2px] border-foreground">
                <h1 className="text-3xl font-merriweather font-bold text-muted-foreground">Logbogen er tom.</h1>
                <p className="text-muted-foreground mt-4">Denne profil eksisterer ikke eller er blevet slettet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">

            {/* Editorial Header / Cover */}
            <div className="mb-20 pb-12 border-b-[2px] border-border/50">
                <div className="relative w-full h-64 md:h-[500px] bg-muted mb-20 md:mb-24 rounded-[2rem] shadow-2xl overflow-visible border border-border/40">
                    <img
                        src={boat.coverImage || `https://images.unsplash.com/photo-1544331002-c940ce98a8da?q=80&w=2000&auto=format&fit=crop`}
                        alt={`Coverbillede af ${boat.name}`}
                        className="w-full h-full object-cover rounded-[2rem]"
                    />
                    {/* Subtle inner overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/10 rounded-[2rem] pointer-events-none"></div>

                    {/* Profile Image overlapping the cover */}
                    <div className="absolute -bottom-16 md:-bottom-20 left-1/2 -translate-x-1/2 md:left-16 md:translate-x-0 w-32 h-32 md:w-48 md:h-48 rounded-full border-[6px] border-background overflow-hidden bg-muted shadow-2xl z-10 transition-transform hover:scale-105 duration-300">
                        {boat.profileImage ? (
                            <img src={boat.profileImage} alt={boat.name} className="w-full h-full object-cover" />
                        ) : (
                            <Anchor className="w-full h-full p-8 text-muted-foreground" />
                        )}
                    </div>
                </div>

                <div className="md:ml-[17rem] text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-merriweather font-black text-foreground mb-6 tracking-tighter drop-shadow-sm">
                        {boat.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-merriweather italic leading-relaxed max-w-3xl">
                        "{boat.description || 'En fantastisk rejse ud i det ukendte. Følg med i vores eventyr her på siden.'}"
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Sidebar: Crew & Voyages */}
                <aside className="lg:col-span-1 space-y-12">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b border-foreground pb-2 mb-6">
                            Mandskab
                        </h3>
                        <div className="flex flex-col gap-4">
                            {boat.crewMemberships.length > 0 ? boat.crewMemberships.map(c => (
                                <div key={c.user.name} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border">
                                        {c.user.profileImage ? (
                                            <img src={c.user.profileImage} alt={c.user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle2 className="w-full h-full p-2 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground tracking-wide group-hover:text-primary transition-colors">{c.user.name}</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{c.role === 'BOAT_ADMIN' ? 'Kaptajn' : 'Gast'}</p>
                                    </div>
                                </div>
                            )) : <p className="text-muted-foreground italic">Ingen sejlere ombord</p>}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b border-foreground pb-2 mb-6 flex items-center gap-2">
                            <Compass className="w-4 h-4" /> Togter
                        </h3>
                        {boat.voyages && boat.voyages.length > 0 ? (
                            <div className="space-y-6">
                                {boat.voyages.map(v => (
                                    <Link key={v.id} href={`/boats/${boat.slug}/voyages/${v.slug}`} className="block border-l-2 border-primary pl-4 py-1 hover:bg-muted/30 transition-colors rounded-r-lg group cursor-pointer">
                                        <h4 className="font-bold text-lg font-merriweather group-hover:text-primary transition-colors">{v.title}</h4>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                            {format(new Date(v.startDate), 'MMMM yyyy', { locale: da })}
                                            {v.endDate ? ` - ${format(new Date(v.endDate), 'MMMM yyyy', { locale: da })}` : ' - Nu'}
                                        </p>
                                        <p className="text-sm text-foreground line-clamp-3">{v.description}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">Ingen planlagte togter</p>
                        )}
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="lg:col-span-2">
                    <div className="border-b border-foreground pb-4 mb-8 flex flex-col items-start gap-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold uppercase tracking-widest">
                                Logs
                            </h2>
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{posts.length}</span>
                        </div>
                        <p className="text-muted-foreground">Opdateringer fra {boat.name}</p>
                    </div>

                    <div className="space-y-16">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <article key={post.id} className="group bg-background rounded-[1.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-border/50 overflow-hidden mb-12">
                                    {/* Post Header */}
                                    <div className="p-6 pb-4 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border/50">
                                            {post.author.profileImage ? (
                                                <img src={post.author.profileImage} alt={post.author.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserCircle2 className="w-full h-full p-2 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-wide text-foreground">{post.author.name}</p>
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">
                                                <time dateTime={post.createdAt}>{format(new Date(post.createdAt), "d. MMM yyyy 'kl.' HH:mm", { locale: da })}</time>
                                                {post.voyage && <span>&bull; {post.voyage.title}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Content based on postType */}
                                    <div className="px-6 pb-6 pt-2">
                                        {post.postType === 'QUICK_TEXT' && (
                                            <h3 className="text-xl md:text-3xl font-merriweather font-medium leading-relaxed italic text-foreground/90 py-4">
                                                "{post.content}"
                                            </h3>
                                        )}

                                        {post.postType === 'PHOTO' && (
                                            <div>
                                                <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-muted mb-6 border border-border/40 overflow-hidden rounded-2xl relative shadow-inner">
                                                    <img src={post.imageUrl || 'https://via.placeholder.com/800'} alt="Bådbillede" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out" />
                                                </div>
                                                <p className="text-lg text-foreground leading-relaxed px-2">
                                                    {post.content}
                                                </p>
                                            </div>
                                        )}

                                        {post.postType === 'YOUTUBE' && (
                                            <div>
                                                {post.youtubeUrl && (
                                                    <div className="w-full aspect-video bg-black mb-6 rounded-2xl overflow-hidden shadow-lg border border-border/40">
                                                        <iframe
                                                            src={post.youtubeUrl}
                                                            className="w-full h-full"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen>
                                                        </iframe>
                                                    </div>
                                                )}
                                                <p className="text-lg text-foreground leading-relaxed px-2">
                                                    {post.content}
                                                </p>
                                            </div>
                                        )}

                                        {post.postType === 'ARTICLE' && (
                                            <div className="border border-border/50 rounded-2xl p-8 bg-muted/20 group-hover:bg-muted/40 transition-colors">
                                                <Link href={`/posts/${post.slug}`} className="block">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 block">Dybdegående Artikel</span>
                                                    <h3 className="text-3xl md:text-4xl font-merriweather font-bold mb-4 leading-snug group-hover:text-primary transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3 mb-6">
                                                        {post.content}
                                                    </p>
                                                    <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:translate-x-2 transition-transform text-primary">Læs hele historien &rarr;</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Moderation Link */}
                                    <div className="bg-muted/10 px-6 py-3 border-t border-border/30 flex justify-end">
                                        <Link href="/moderation" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors opacity-60 hover:opacity-100">
                                            <ShieldAlert className="w-3.5 h-3.5" />
                                            Rapportér Indhold
                                        </Link>
                                    </div>
                                    <div className="px-6 py-3 bg-muted/30 border-t border-border/50 text-xs font-bold uppercase tracking-widest text-muted-foreground/50 text-right">
                                        {post.postType}
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="py-20 text-center border border-dashed border-border">
                                <h3 className="text-2xl font-merriweather font-bold text-muted-foreground">Der er stille på radioen.</h3>
                                <p className="text-muted-foreground mt-2">Denne båd har endnu ikke publiceret logbogs-optegnelser.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
