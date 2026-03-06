import { BookOpen, ArrowLeft, Anchor, Compass } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getFaq(slug: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/faq/${slug}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        console.error('Failed to fetch FAQ:', e);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const faq = await getFaq(params.slug);

    if (!faq) {
        return {
            title: 'Artikel ikke fundet | Langturssejlads',
            description: 'Denne artikel findes ikke længere i vores vidensbase.'
        };
    }

    const plainText = faq.content?.replace(/<[^>]+>/g, ' ') || '';
    const description = plainText.substring(0, 160) + '...';

    return {
        title: `${faq.title} | Lær om Langturssejlads`,
        description: description,
        openGraph: {
            title: `${faq.title} | Lær om Langturssejlads`,
            description: description,
            type: 'article',
        }
    };
}

export default async function FaqArticlePage({ params }: { params: { slug: string } }) {
    const faq = await getFaq(params.slug);

    if (!faq) {
        notFound();
    }

    return (
        <div className="flex flex-col bg-background font-inter min-h-screen">
            <main className="flex-1 pb-24">
                {/* Hero Header */}
                <div className="bg-muted py-16 px-4 sm:px-6 lg:px-8 border-b border-border text-center overflow-hidden relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
                        <Anchor className="absolute -top-10 -left-10 w-64 h-64 text-foreground rotate-12" />
                        <Compass className="absolute -bottom-10 -right-10 w-64 h-64 text-foreground -rotate-12" />
                    </div>

                    <div className="max-w-3xl mx-auto relative z-10">
                        <Link
                            href="/laer-om-langturssejlads"
                            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" /> Tilbage til oversigten
                        </Link>

                        <div className="inline-flex justify-center items-center p-4 bg-background/80 backdrop-blur-md border border-border shadow-sm rounded-full mb-6 text-primary">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-merriweather font-black text-foreground mb-4 leading-tight">
                            {faq.title}
                        </h1>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                    <article className="bg-card border border-border mt-[-4rem] shadow-xl rounded-3xl p-8 md:p-12 relative z-20">
                        <div className="prose prose-lg md:prose-xl dark:prose-invert text-foreground leading-relaxed font-medium opacity-90 max-w-none space-y-6">
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
                    </article>

                    <div className="mt-12 text-center">
                        <Link
                            href="/laer-om-langturssejlads"
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
