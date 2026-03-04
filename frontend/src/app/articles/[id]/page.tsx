import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import Link from 'next/link';

interface Article {
    id: number;
    title: string;
    content: string;
    youtubeUrl: string | null;
    status: string;
    createdAt: string;
    author: { id: number; name: string };
    boat: { id: number; name: string };
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
    let article: Article | null = null;
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/articles/${params.id}`, { cache: 'no-store' });
        if (res.ok) {
            article = await res.json();
        }
    } catch (error) {
        console.error('Failed to fetch individual article:', error);
    }

    if (!article) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-32 text-center border-b-[2px] border-foreground">
                <h1 className="text-3xl font-merriweather font-bold text-muted-foreground">Historien findes ikke.</h1>
                <p className="text-muted-foreground mt-4">Denne artikel er muligvis fjernet eller findes ikke på denne logbog.</p>
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
                    <Link href={`/boats/${article.boat.id}`} className="hover:underline underline-offset-4">
                        {article.boat.name}
                    </Link>
                    <span className="text-muted-foreground">&bull;</span>
                    <time dateTime={article.createdAt} className="text-muted-foreground">
                        {format(new Date(article.createdAt), 'd. MMMM yyyy', { locale: da })}
                    </time>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-merriweather font-black text-foreground leading-[1.1] mb-8">
                    {article.title}
                </h1>

                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>Skrevet af</span>
                    <span className="text-foreground">{article.author.name}</span>
                </div>
            </div>

            <hr className="border-t-[3px] border-foreground mb-12" />

            {/* Video Lead (if exists) */}
            {article.youtubeUrl && (
                <div className="mb-12 aspect-video w-full rounded-xl overflow-hidden shadow-sm bg-muted/20">
                    <iframe
                        className="w-full h-full"
                        src={article.youtubeUrl}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                </div>
            )}

            {/* Main Content Body */}
            <div className="prose prose-lg md:prose-xl max-w-none font-merriweather text-foreground/90 leading-relaxed">
                {article.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-6">{paragraph}</p>
                ))}
            </div>

            <hr className="border-t border-border mt-16 mb-8" />

            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wide">
                <Link href="/" className="text-primary hover:underline underline-offset-4">&larr; Tilbage til forsiden</Link>
                <Link href={`/boats/${article.boat.id}`} className="text-primary hover:underline underline-offset-4">Flere beretninger fra {article.boat.name} &rarr;</Link>
            </div>

        </article>
    );
}
