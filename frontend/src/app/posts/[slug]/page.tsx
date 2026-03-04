import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import Link from 'next/link';

interface Post {
    id: number;
    slug: string;
    title: string | null;
    content: string | null;
    youtubeUrl: string | null;
    imageUrl: string | null;
    status: string;
    createdAt: string;
    author: { id: number; name: string };
    boat: { id: number; slug: string; name: string };
}

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: { params: { slug: string } }) {
    let post: Post | null = null;
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/posts/${params.slug}`, { cache: 'no-store' });
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

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

            {/* Header / Meta */}
            <div className="text-center mb-12 md:mb-16">
                <div className="inline-flex items-center justify-center gap-3 mb-6 text-sm font-bold uppercase tracking-widest text-primary">
                    <Link href={`/boats/${post.boat.slug}`} className="hover:underline underline-offset-4">
                        {post.boat.name}
                    </Link>
                    <span className="text-muted-foreground">&bull;</span>
                    <time dateTime={post.createdAt} className="text-muted-foreground">
                        {format(new Date(post.createdAt), 'd. MMMM yyyy', { locale: da })}
                    </time>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-merriweather font-black text-foreground leading-[1.1] mb-8">
                    {post.title || 'Logbogsopdatering'}
                </h1>

                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>Skrevet af</span>
                    <span className="text-foreground">{post.author.name}</span>
                </div>
            </div>

            <hr className="border-t-[3px] border-foreground mb-12" />

            {/* Image Lead (if exists) */}
            {post.imageUrl && (
                <div className="mb-12 aspect-[16/9] w-full rounded-xl overflow-hidden shadow-sm bg-muted/20">
                    <img
                        src={post.imageUrl}
                        alt="Post Billede"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Video Lead (if exists) */}
            {post.youtubeUrl && (
                <div className="mb-12 aspect-video w-full rounded-xl overflow-hidden shadow-sm bg-muted/20">
                    <iframe
                        className="w-full h-full"
                        src={post.youtubeUrl}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                </div>
            )}

            {/* Main Content Body */}
            {post.content && (
                <div className="prose prose-lg md:prose-xl max-w-none font-merriweather text-foreground/90 leading-relaxed">
                    {post.content.split('\n').map((paragraph: string, index: number) => (
                        <p key={index} className="mb-6">{paragraph}</p>
                    ))}
                </div>
            )}

            <hr className="border-t border-border mt-16 mb-8" />

            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wide">
                <Link href="/" className="text-primary hover:underline underline-offset-4">&larr; Tilbage til forsiden</Link>
                <Link href={`/boats/${post.boat.slug}`} className="text-primary hover:underline underline-offset-4">Flere beretninger fra {post.boat.name} &rarr;</Link>
            </div>

        </article>
    );
}
