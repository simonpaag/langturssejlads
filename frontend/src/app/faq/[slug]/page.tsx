import { BookOpen, ArrowLeft, Anchor, Compass } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

async function getFaq(slug: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/faq/${encodeURIComponent(slug)}`, { next: { revalidate: 5 } });
        if (res.headers.get('x-render-routing') === 'no-server' || res.status >= 500) {
            throw new Error(`API Offline eller Server Fejl: ${res.status}`);
        }
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error('Failed to fetch FAQ:', e);
        throw e;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
    let faq = null;
    try {
        const resolvedParams = await Promise.resolve(params);
        faq = await getFaq(resolvedParams.slug);
    } catch (e) {
        console.error('Metadata fetch fejet:', e);
    }

    if (!faq) {
        return {
            title: 'Artikel ikke fundet | Langturssejlads',
            description: 'Denne artikel findes ikke længere i vores vidensbase.'
        };
    }

    const plainText = faq.content?.replace(/<[^>]+>/g, ' ') || '';
    const description = plainText.substring(0, 160) + '...';

    return {
        title: `${faq.title} | Lær om langfart`,
        description: description,
        openGraph: {
            title: `${faq.title} | Lær om langfart`,
            description: description,
            type: 'article',
        }
    };
}

export default async function FaqArticlePage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
    let faq = null;
    try {
        const resolvedParams = await Promise.resolve(params);
        faq = await getFaq(resolvedParams.slug);
    } catch (e) {
        console.error('Page fetch fejlet:', e);
    }

    if (!faq) {
        notFound();
    }

    const plainText = faq.content?.replace(/<[^>]+>/g, ' ') || '';
    const readTime = Math.ceil(plainText.split(/\s+/).length / 200) || 1;

    return (
        <div className="flex flex-col bg-background font-inter min-h-screen">
            <main className="flex-1 pb-24">
                {/* Hero Header */}
                <div className={`relative w-full ${faq.imageUrl ? 'h-[60vh] min-h-[400px]' : 'py-20 bg-muted border-b border-border'} flex items-center justify-center text-center overflow-hidden`}>

                    {faq.imageUrl ? (
                        <>
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${faq.imageUrl})` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
                        </>
                    ) : (
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                            <Anchor className="absolute -top-10 -left-10 w-64 h-64 text-foreground rotate-12" />
                            <Compass className="absolute -bottom-10 -right-10 w-64 h-64 text-foreground -rotate-12" />
                        </div>
                    )}

                    <div className="max-w-4xl mx-auto px-4 relative z-10 w-full mt-10">
                        <Link
                            href="/faq"
                            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors mb-6 drop-shadow-sm bg-background/50 px-4 py-2 rounded-full backdrop-blur-md"
                        >
                            <ArrowLeft className="w-4 h-4" /> Tilbage til oversigten
                        </Link>

                        <div className="flex justify-center mb-6">
                            <div className="inline-flex justify-center items-center p-3 sm:p-4 bg-background/90 backdrop-blur-md border border-border/50 shadow-xl rounded-full text-primary">
                                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-merriweather font-black text-foreground mb-6 leading-[1.15] drop-shadow-md">
                            {faq.title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-sm font-medium text-foreground/80 drop-shadow-sm bg-background/30 backdrop-blur-sm self-center mx-auto w-fit px-6 py-2 rounded-full border border-border/20">
                            <span className="flex items-center gap-2 relative z-10 text-foreground">
                                <span className="hidden sm:inline">Opdateret </span>{new Date(faq.updatedAt || new Date()).toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 relative z-10"></span>
                            <span className="flex items-center gap-2 relative z-10 text-foreground">
                                {readTime} min læsning
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <article className="mt-8 sm:mt-[-4rem] relative z-20">
                        <div className="bg-card border border-border shadow-2xl rounded-3xl p-6 sm:p-10 md:p-16 mb-16 relative overflow-hidden">
                            {/* Accent line top */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>

                            <div className="prose prose-lg md:prose-xl dark:prose-invert prose-headings:font-merriweather prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-p:text-foreground/90 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-li:text-foreground/90 max-w-none">
                                {/* Simple render of plain text or HTML */}
                                {faq.content.includes('<') ? (
                                    <div dangerouslySetInnerHTML={{ __html: faq.content }} />
                                ) : (
                                    faq.content.split('\n\n').map((paragraph: string, idx: number) => (
                                        <p key={idx}>
                                            {paragraph.split('\n').map((line: string, lineIdx: number) => (
                                                <span key={lineIdx}>
                                                    {line}
                                                    {lineIdx !== paragraph.split('\n').length - 1 && <br />}
                                                </span>
                                            ))}
                                        </p>
                                    ))
                                )}
                            </div>
                        </div>
                    </article>

                    <div className="mt-12 text-center">
                        <Link
                            href="/faq"
                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl shadow-md transition-all uppercase tracking-wider text-sm"
                        >
                            Flere artikler fra vidensbasen
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
