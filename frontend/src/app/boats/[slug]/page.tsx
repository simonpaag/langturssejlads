import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { Anchor, Compass, UserCircle2 } from 'lucide-react';
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
        title: string;
        description: string | null;
        startDate: string;
        endDate: string | null;
    }[];
}

import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function BoatProfile({ params }: { params: { slug: string } }) {
    noStore();
    let boat: Boat | null = null;
    let debugError = '';
    let fetchUrl = '';
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        fetchUrl = `${apiUrl}/api/boats/${params.slug}`;
        const res = await fetch(fetchUrl, { cache: 'no-store' });
        if (res.ok) {
            boat = await res.json();
        } else {
            debugError = `Res not ok: ${res.status} ${res.statusText}`;
        }
    } catch (error: any) {
        console.error('Failed to fetch boat profile:', error);
        debugError = `Fetch catch error: ${error?.message || String(error)}`;
    }

    // Fetch posts specifically for this boat
    let posts: Post[] = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/posts`, { cache: 'no-store' });
        if (res.ok) {
            const allPosts: Post[] = await res.json();
            posts = allPosts.filter((p: any) => p.boat?.slug === params.slug);
        }
    } catch (error) {
        console.error('Failed to fetch boat posts');
    }

    if (!boat) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-32 text-center border-b-[2px] border-foreground">
                <h1 className="text-3xl font-merriweather font-bold text-muted-foreground">Logbogen er tom.</h1>
                <p className="text-muted-foreground mt-4">Denne profil eksisterer ikke eller er blevet slettet.</p>
                <code className="block mt-8 p-4 bg-muted text-xs text-left max-w-lg mx-auto overflow-x-auto text-red-500 rounded">
                    DEBUG: {debugError || 'No error caught, boat simply returned null'}<br />
                    URL ATTEMPTED: {fetchUrl}
                </code>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

            {/* Editorial Header / Cover */}
            <div className="mb-16 border-b-[2px] border-foreground pb-12">
                <div className="relative w-full h-64 md:h-96 bg-muted mb-16 overflow-hidden border border-border">
                    <img
                        src={boat.coverImage || `https://images.unsplash.com/photo-1544331002-c940ce98a8da?q=80&w=2000&auto=format&fit=crop`}
                        alt={`Coverbillede af ${boat.name}`}
                        className="w-full h-full object-cover grayscale-[20%]"
                    />

                    {/* Profile Image overlapping the cover */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-background overflow-hidden bg-muted shadow-xl">
                        {boat.profileImage ? (
                            <img src={boat.profileImage} alt={boat.name} className="w-full h-full object-cover" />
                        ) : (
                            <Anchor className="w-full h-full p-8 text-muted-foreground" />
                        )}
                    </div>
                </div>

                <div className="md:ml-64 text-center md:text-left">
                    <h1 className="text-5xl md:text-6xl font-merriweather font-black text-foreground mb-4 tracking-tight">
                        {boat.name}
                    </h1>
                    <p className="text-xl text-muted-foreground font-merriweather italic leading-relaxed max-w-3xl">
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
                                    <div key={v.id} className="border-l-2 border-primary pl-4 py-1">
                                        <h4 className="font-bold text-lg font-merriweather">{v.title}</h4>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                                            {format(new Date(v.startDate), 'MMMM yyyy', { locale: da })}
                                            {v.endDate ? ` - ${format(new Date(v.endDate), 'MMMM yyyy', { locale: da })}` : ' - Nu'}
                                        </p>
                                        <p className="text-sm text-foreground line-clamp-3">{v.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">Ingen planlagte togter</p>
                        )}
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="lg:col-span-2">
                    <h2 className="text-2xl font-bold uppercase tracking-widest border-b border-foreground pb-4 mb-8">
                        Bådens Logbog ({posts.length})
                    </h2>

                    <div className="space-y-16">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <article key={post.id} className="group border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                                    {/* Post Header */}
                                    <div className="p-6 pb-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                                            {post.author.profileImage ? (
                                                <img src={post.author.profileImage} alt={post.author.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserCircle2 className="w-full h-full p-2 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-wide">{post.author.name}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                                                <time dateTime={post.createdAt}>{format(new Date(post.createdAt), "d. MMM yyyy 'kl.' HH:mm", { locale: da })}</time>
                                                {post.voyage && <span>&bull; {post.voyage.title}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Content based on postType */}
                                    <div className="px-6 pb-6 border-b border-border/50">
                                        {post.postType === 'QUICK_TEXT' && (
                                            <h3 className="text-xl md:text-2xl font-merriweather font-medium leading-relaxed italic text-foreground/90">
                                                "{post.content}"
                                            </h3>
                                        )}

                                        {post.postType === 'PHOTO' && (
                                            <div>
                                                <div className="w-full aspect-[4/3] bg-muted mb-4 border border-border overflow-hidden">
                                                    <img src={post.imageUrl || 'https://via.placeholder.com/800'} alt="Bådbillede" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                                </div>
                                                <p className="text-base text-foreground leading-relaxed">
                                                    {post.content}
                                                </p>
                                            </div>
                                        )}

                                        {post.postType === 'YOUTUBE' && (
                                            <div>
                                                {post.youtubeUrl && (
                                                    <div className="w-full aspect-video bg-black mb-4">
                                                        <iframe
                                                            src={post.youtubeUrl}
                                                            className="w-full h-full"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen>
                                                        </iframe>
                                                    </div>
                                                )}
                                                <p className="text-base text-foreground leading-relaxed">
                                                    {post.content}
                                                </p>
                                            </div>
                                        )}

                                        {post.postType === 'ARTICLE' && (
                                            <div className="border border-border p-6 bg-muted/30 group-hover:bg-muted/50 transition-colors">
                                                <Link href={`/posts/${post.slug}`} className="block">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block">Dybdegående Artikel</span>
                                                    <h3 className="text-3xl font-merriweather font-bold mb-4 leading-snug hover:text-primary transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-muted-foreground text-base leading-relaxed line-clamp-3">
                                                        {post.content}
                                                    </p>
                                                    <span className="inline-block mt-4 text-xs font-bold uppercase tracking-widest hover:underline underline-offset-4 text-primary">Læs hele historien &rarr;</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-6 py-3 bg-muted/10 text-xs font-bold uppercase tracking-widest text-muted-foreground/50 text-right">
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
