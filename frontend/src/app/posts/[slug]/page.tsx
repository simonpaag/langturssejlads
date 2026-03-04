import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import Link from 'next/link';
import { CalendarDays, Navigation, MapPin, UserCircle2, ArrowLeft, ShieldAlert } from 'lucide-react';

interface Post {
    id: number;
    slug: string;
    title: string | null;
    content: string | null;
    postType: string;
    youtubeUrl: string | null;
    imageUrl: string | null;
    status: string;
    createdAt: string;
    author: { id: number; name: string; profileImage?: string | null; };
    boat: { id: number; slug: string; name: string; profileImage?: string | null; };
}

export const revalidate = 60;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams.slug;
    let post: Post | null = null;
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/posts/${slug}`, { next: { revalidate: 60 } });
        if (res.ok) {
            post = await res.json();
        }
    } catch (error) {
        console.error('Failed to fetch individual post:', error);
    }

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-32 text-center border-b-[2px] border-foreground">
                <h1 className="text-3xl font-merriweather font-bold text-muted-foreground">Posten findes ikke.</h1>
                <p className="text-muted-foreground mt-4">Dette indlæg er muligvis fjernet eller findes ikke i denne logbog.</p>
                <Link href="/" className="mt-8 inline-block bg-foreground text-background font-bold py-3 px-8 rounded-full hover:bg-primary transition-colors">
                    Gå tilbage til forsiden
                </Link>
            </div>
        );
    }

    const displayImage = post.imageUrl || 'https://images.unsplash.com/photo-1544331002-c940ce98a8da?q=80&w=2000&auto=format&fit=crop';

    return (
        <article className="min-h-screen bg-background pb-24">

            {/* Hero Image Section (if present) or Typographic Header */}
            <div className="relative w-full h-[60vh] min-h-[500px] mb-12 lg:mb-20 overflow-hidden border-b border-border/40">
                <img
                    src={displayImage}
                    alt="Hero Billede"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 text-center md:text-left">
                        <div className="inline-flex items-center justify-center md:justify-start gap-3 mb-6 text-sm font-bold uppercase tracking-widest text-primary drop-shadow-sm">
                            <Link href={`/boats/${post.boat.slug}`} className="hover:underline underline-offset-4 flex gap-2 items-center">
                                {post.boat.name}
                            </Link>
                            <span className="text-muted-foreground">&bull;</span>
                            <time dateTime={post.createdAt} className="text-muted-foreground/80">
                                {format(new Date(post.createdAt), 'd. MMMM yyyy', { locale: da })}
                            </time>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-merriweather font-black text-foreground drop-shadow-md leading-tight mb-8">
                            {post.title || (post.postType === 'PHOTO' ? 'Billedopdatering' : 'Logbogsopdatering')}
                        </h1>

                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider backdrop-blur-sm p-3 inline-flex rounded-2xl bg-muted/10">
                            <span className="text-foreground">Af {post.author.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reading Container */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Video Lead (if exists) */}
                {post.youtubeUrl && (
                    <div className="mb-16 aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-border/40 bg-black">
                        <iframe
                            className="w-full h-full"
                            src={post.youtubeUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                    </div>
                )}

                {/* Main Content Body */}
                {post.content && (
                    <div className="prose prose-lg md:prose-xl max-w-none font-merriweather text-foreground/90 leading-relaxed dark:prose-invert prose-p:mb-8 prose-h2:text-3xl prose-h2:font-black prose-h2:mb-6">
                        {post.content.split('\n').map((paragraph: string, index: number) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                )}

                <div className="border-t border-border/60 mt-20 pt-10 flex flex-col md:flex-row gap-6 justify-between items-center text-sm font-bold uppercase tracking-widest text-primary">
                    <Link href={`/boats/${post.boat.slug}`} className="hover:text-foreground transition-colors border border-border/50 bg-muted/30 px-6 py-3 rounded-full hover:bg-muted/50">
                        &larr; Flere beretninger fra {post.boat.name}
                    </Link>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Link href="/moderation" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors opacity-60 hover:opacity-100" title="Rapportér anstødeligt indhold">
                            <ShieldAlert className="w-4 h-4" />
                            Rapportér Indhold
                        </Link>
                        <Link href="/" className="hover:text-foreground transition-colors px-6 py-3">
                            Gå til forsiden
                        </Link>
                    </div>
                </div>
            </div>

        </article>
    );
}
