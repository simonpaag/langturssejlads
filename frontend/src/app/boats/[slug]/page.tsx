import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { MapPin, Anchor, Users, Navigation, Compass, Calendar, ArrowRight, UserCircle2, ArrowLeft, Globe, Link as LinkIcon, Info, Image as ImageIcon, Video, Ship, ChevronRight, MessageCircle, MoreVertical, X, Clock, ShieldAlert, Instagram, Youtube, Facebook, Ruler, Anchor as AnchorIcon } from 'lucide-react';
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
    votes?: { type: 'UPVOTE' | 'DOWNVOTE'; userId: number }[];
}

interface Boat {
    id: number;
    slug: string;
    name: string;
    description: string;
    coverImage: string | null;
    profileImage: string | null;
    websiteUrl: string | null;
    boatModel?: string | null;
    length: number;
    width?: number | null;
    tonnage?: number | null;
    bunks?: number | null;
    isBoardPublic: boolean;
    socialLinks: { platform: string; url: string }[] | null;
    crewMemberships: {
        user: { id: number; name: string; email: string; profileImage: string | null; };
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
import PostVotes from '@/components/PostVotes';
import Noticeboard from '@/components/Noticeboard';
import ContactForm from '@/components/ContactForm';
import { getFallbackImage } from '@/utils/fallbackImage';

export const revalidate = 60; // Cache i et minut for superhastighed

export default async function BoatProfile({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams.slug;

    let boat: Boat | null = null;
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/boats/${slug}`, { next: { revalidate: 60 } });
        if (res.headers.get('x-render-routing') === 'no-server' || res.status >= 500) {
            throw new Error(`API Offline eller Server Fejl: ${res.status}`);
        }
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
        if (res.headers.get('x-render-routing') === 'no-server' || res.status >= 500) {
            throw new Error(`API Offline eller Server Fejl: ${res.status}`);
        }
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
                        src={boat.coverImage || getFallbackImage(boat.id, 'cover')}
                        alt={`Coverbillede af ${boat.name}`}
                        className="w-full h-full object-cover rounded-[2rem]"
                    />
                    {/* Subtle inner overlay for depth */}
                    < div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/10 rounded-[2rem] pointer-events-none" ></div >

                    {/* Profile Image overlapping the cover */}
                    < div className="absolute -bottom-16 md:-bottom-20 left-1/2 -translate-x-1/2 md:left-16 md:translate-x-0 w-32 h-32 md:w-48 md:h-48 rounded-full border-[6px] border-background overflow-hidden bg-muted shadow-2xl z-10 transition-transform hover:scale-105 duration-300" >
                        <img src={boat.profileImage || getFallbackImage(boat.id, 'avatar')} alt={boat.name} className="w-full h-full object-cover" />
                    </div >
                </div >

                <div className="md:ml-[17rem] text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-merriweather font-black text-foreground mb-6 tracking-tighter drop-shadow-sm">
                        {boat.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-merriweather italic leading-relaxed max-w-3xl mb-8">
                        "{boat.description || 'En fantastisk rejse ud i det ukendte. Følg med i vores eventyr her på siden.'}"
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        {boat.websiteUrl && (
                            <a href={boat.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:bg-primary transition-all hover:-translate-y-1 duration-200 shadow-md">
                                <Globe className="w-4 h-4" /> Hjemmeside
                            </a>
                        )}
                        {boat.socialLinks && boat.socialLinks.map((link, idx) => {
                            const platformLower = link.platform.toLowerCase();
                            let Icon = LinkIcon;
                            if (platformLower.includes('insta')) Icon = Instagram;
                            else if (platformLower.includes('you') || platformLower.includes('yt')) Icon = Youtube;
                            else if (platformLower.includes('face') || platformLower.includes('fb')) Icon = Facebook;

                            return (
                                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-background shadow-sm border border-border text-foreground font-bold text-xs uppercase tracking-widest rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all hover:-translate-y-1 duration-200">
                                    <Icon className="w-4 h-4" /> {link.platform}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Sidebar: Specs, Crew & Voyages */}
                <aside className="lg:col-span-1 space-y-12">
                    {/* Båd Specifikationer */}
                    {(boat.length > 0 || boat.boatModel || boat.width || boat.tonnage || boat.bunks) && (
                        <div className="bg-muted/30 border border-border/50 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-border/80 pb-3 mb-5 flex items-center gap-2 text-foreground/90">
                                <Ship className="w-4 h-4 text-primary" /> Info om båden
                            </h3>
                            <ul className="space-y-4 text-sm">
                                {boat.boatModel && (
                                    <li className="flex items-center justify-between">
                                        <span className="text-muted-foreground flex items-center gap-2"><Ship className="w-4 h-4" /> Model</span>
                                        <span className="font-semibold text-foreground text-right">{boat.boatModel}</span>
                                    </li>
                                )}
                                {boat.length > 0 && (
                                    <li className="flex items-center justify-between">
                                        <span className="text-muted-foreground flex items-center gap-2"><Ruler className="w-4 h-4" /> Længde</span>
                                        <span className="font-semibold text-foreground">{boat.length} fod</span>
                                    </li>
                                )}
                                {boat.width && (
                                    <li className="flex items-center justify-between">
                                        <span className="text-muted-foreground flex items-center gap-2"><Ruler className="w-4 h-4" /> Bredde</span>
                                        <span className="font-semibold text-foreground">{boat.width} m</span>
                                    </li>
                                )}
                                {boat.tonnage && (
                                    <li className="flex items-center justify-between">
                                        <span className="text-muted-foreground flex items-center gap-2"><AnchorIcon className="w-4 h-4" /> Tonnage</span>
                                        <span className="font-semibold text-foreground">{boat.tonnage.toLocaleString('da-DK')} kg</span>
                                    </li>
                                )}
                                {boat.bunks && (
                                    <li className="flex items-center justify-between">
                                        <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Køjer</span>
                                        <span className="font-semibold text-foreground">{boat.bunks} sovepladser</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b border-foreground pb-2 mb-6 text-foreground/90">
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

                    {/* Kontakt Båden Formular */}
                    <div className="pt-8 border-t border-border/60">
                        <ContactForm boatId={boat.id} boatName={boat.name} />
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
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border/50 bg-background/50 backdrop-blur-sm">
                                                {post.author?.profileImage ? (
                                                    <img src={post.author.profileImage} alt={post.author.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                                                        {(post.author?.name || 'Slettet').substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm tracking-wide text-foreground">{post.author?.name || 'Slettet Bruger'}</p>
                                                <time className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 opacity-80">
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(post.createdAt), 'd. MMM yyyy HH:mm', { locale: da })}
                                                </time>
                                            </div>
                                        </div>
                                        {post.voyage && <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">&bull; {post.voyage.title}</span>}
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

                                    {/* Action Footer (Votes & Moderation) */}
                                    <div className="bg-muted/10 px-6 py-3 border-t border-border/30 flex justify-between items-center">
                                        <PostVotes postId={post.id} initialVotes={post.votes || []} />
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

                    {/* Opslagstavle / Noticeboard */}
                    <div id="opslagstavle">
                        <Noticeboard
                            boatId={boat.id}
                            boatName={boat.name}
                            isPublic={boat.isBoardPublic}
                            isAdmin={false} // isAdmin håndteres internt af komponentet eller passes fra auth context
                        />
                    </div>
                </main>
            </div>
        </div >
    );
}
