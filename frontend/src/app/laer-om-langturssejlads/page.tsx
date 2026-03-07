import Link from 'next/link';
import { BookOpen, AlertCircle, TrendingUp, Anchor, Compass, ChevronRight } from 'lucide-react';

export const metadata = {
    title: 'Lær om Langturssejlads | FAQ og Nyttig Viden',
    description: 'Bliv klogere på langtursslivet. Læs om køjepenge, regler, og hvordan du forbereder dig på at stævne ud.'
};

async function getFaqs() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/faq`, { next: { revalidate: 60 } });
        if (!res.ok) {
            throw new Error(`API returned status: ${res.status}`);
        }
        return await res.json();
    } catch (e) {
        console.error('Failed to fetch FAQs:', e);
        throw e;
    }
}

export default async function LearnAboutSailing() {
    const faqs = await getFaqs();

    return (
        <div className="flex flex-col bg-background font-inter">
            <main className="flex-1 pb-24">
                {/* Hero Header */}
                <div className="bg-muted py-20 px-4 sm:px-6 lg:px-8 border-b border-border text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex justify-center items-center p-4 bg-background border border-border rounded-full shadow-sm mb-6 text-primary">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-merriweather font-black text-foreground mb-6">Lær om Langturssejlads</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Din primære kilde til uskrevne regler, faste aftaler og livet ombord på sejlbådene. Udforsk viden før du står til søs eller inviterer ombord.
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                    {/* Oversigts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {faqs.length > 0 ? (
                            faqs.map((faq: any, idx: number) => {
                                // Strip HTML tags to get raw text for snippet
                                const plainText = faq.content?.replace(/<[^>]+>/g, ' ') || '';
                                return (
                                    <Link
                                        href={`/laer-om-langturssejlads/${faq.slug}`}
                                        key={faq.id}
                                        className="group bg-card border border-border shadow-sm rounded-3xl p-8 transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                                                    {idx % 3 === 0 ? <TrendingUp className="w-6 h-6" /> : idx % 3 === 1 ? <Anchor className="w-6 h-6" /> : <Compass className="w-6 h-6" />}
                                                </div>
                                                <h2 className="text-xl font-bold font-merriweather text-foreground group-hover:text-primary transition-colors">{faq.title}</h2>
                                            </div>
                                            <p className="text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                                                {plainText}
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                                            Læs hele artiklen <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="col-span-1 md:col-span-2 bg-card border border-border shadow-sm rounded-3xl p-12 text-center text-muted-foreground">
                                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-bold font-merriweather mb-2 text-foreground">Ingen artikler fundet</h3>
                                <p>Vi er i øjeblikket ved at opdatere vores vidensbase. Kom tilbage senere!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
