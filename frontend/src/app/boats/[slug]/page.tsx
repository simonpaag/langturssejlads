import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { Anchor } from 'lucide-react';
import Link from 'next/link';

interface Article {
    id: number;
    slug: string;
    title: string;
    content: string;
    youtubeUrl: string | null;
    status: string;
    createdAt: string;
    author: { name: string };
}

interface Boat {
    id: number;
    slug: string;
    name: string;
    description: string;
    crewMemberships: {
        user: { name: string };
        role: string;
    }[];
    articles: Article[];
}

export default async function BoatProfile({ params }: { params: { slug: string } }) {
    let boat: Boat | null = null;
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/boats/${params.slug}`, { cache: 'no-store' });
        if (res.ok) {
            boat = await res.json();
        }
    } catch (error) {
        console.error('Failed to fetch boat profile:', error);
    }

    // Fetch articles specifically for this boat
    let articles: Article[] = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/articles`, { cache: 'no-store' });
        if (res.ok) {
            const allArticles: Article[] = await res.json();
            // Filter to only this boat's articles
            articles = allArticles.filter((a: any) => a.boat?.slug === params.slug);
        }
    } catch (error) {
        console.error('Failed to fetch boat articles');
    }

    if (!boat) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-32 text-center border-b-[2px] border-foreground">
                <h1 className="text-3xl font-merriweather font-bold text-muted-foreground">Logbogen er tom.</h1>
                <p className="text-muted-foreground mt-4">Denne profil eksisterer ikke eller er blevet slettet.</p>
            </div>
        );
    }

    const crewList = boat.crewMemberships.map(c => c.user.name).join(', ');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

            {/* Editorial Header */}
            <div className="mb-16 md:mb-24 border-b-[2px] border-foreground pb-12 overflow-hidden relative">
                <div className="absolute inset-0 z-0">
                    <img
                        src={`https://images.unsplash.com/photo-1544331002-c940ce98a8da?q=80&w=2000&auto=format&fit=crop&sig=${boat.id}`}
                        alt="Background"
                        className="w-full h-full object-cover opacity-[0.03] grayscale pointer-events-none"
                    />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center mb-6">
                        <div className="h-[1px] w-12 bg-primary"></div>
                        <Anchor className="h-4 w-4 text-primary mx-4" />
                        <div className="h-[1px] w-12 bg-primary"></div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-merriweather font-black text-foreground mb-6 tracking-tight">
                        {boat.name}
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground font-merriweather italic leading-relaxed mb-8 max-w-3xl mx-auto">
                        "{boat.description || 'En fantastisk rejse ud i det ukendte. Følg med i vores eventyr her på siden.'}"
                    </p>

                    <div className="text-sm font-bold uppercase tracking-widest text-primary mt-8">
                        Besætning: <span className="text-foreground">{crewList || 'Ingen mønstret'}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 border-b border-foreground pb-4">
                <h2 className="text-2xl font-bold uppercase tracking-widest">
                    Logbog & Fortællinger
                </h2>
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {articles.length} Arkiver
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <article
                            key={article.id}
                            className="group flex flex-col h-full hover-lift cursor-pointer"
                        >
                            <div className="flex items-center gap-2 mb-3 text-[11px] font-bold uppercase tracking-widest text-primary">
                                <time className="text-muted-foreground" dateTime={article.createdAt}>
                                    {format(new Date(article.createdAt), 'd. MMMM yyyy', { locale: da })}
                                </time>
                            </div>

                            <Link href={`/articles/${article.slug}`}>
                                <h3 className="text-3xl font-merriweather font-bold mb-4 leading-snug group-hover:text-primary transition-colors">
                                    {article.title}
                                </h3>
                            </Link>

                            <p className="text-muted-foreground text-base leading-relaxed mb-6 line-clamp-4 flex-grow">
                                {article.content}
                            </p>

                            <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground">Af {article.author.name}</span>
                                <Link href={`/articles/${article.slug}`} className="text-xs font-bold uppercase tracking-widest text-primary group-hover:underline underline-offset-4">Læs Fortælling</Link>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <h3 className="text-2xl font-merriweather font-bold text-muted-foreground">Ingen optegnelser.</h3>
                        <p className="text-muted-foreground mt-2">Denne båd har endnu ikke publiceret nogen historier.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
