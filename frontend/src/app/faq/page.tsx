import Link from 'next/link';
import { BookOpen, AlertCircle, TrendingUp, Anchor, Compass, ChevronRight, PenTool } from 'lucide-react';
import AdCard from '@/components/AdCard';

export const metadata = {
    title: 'Lær om langfart | FAQ og Nyttig Viden',
    description: 'Bliv klogere på langtursslivet. Læs om køjepenge, regler, og hvordan du forbereder dig på at stævne ud.'
};

async function getFaqsAndAds() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const [faqRes, adsRes] = await Promise.all([
            fetch(`${apiUrl}/api/faq`, { next: { revalidate: 5 } }),
            fetch(`${apiUrl}/api/posts/ads`, { next: { revalidate: 60 } })
        ]);
        if (!faqRes.ok) {
            throw new Error(`API returned status: ${faqRes.status}`);
        }
        const faqs = await faqRes.json();
        const ads = adsRes.ok ? await adsRes.json() : [];
        return { faqs, ads };
    } catch (e) {
        console.error('Failed to fetch FAQs or ads:', e);
        throw e;
    }
}

export default async function LearnAboutSailing() {
    const { faqs, ads } = await getFaqsAndAds();

    return (
        <div className="flex flex-col bg-background font-inter">
            <main className="flex-1 pb-24">
                {/* Hero Header */}
                <header className="relative py-32 px-4 bg-black overflow-hidden flex flex-col justify-center min-h-[40vh] border-b border-border/10 text-center">
                    <img
                        src="/images/faq-hero.jpg"
                        alt="Solnedgang over sejlskibet"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent opacity-80"></div>

                    <div className="max-w-3xl mx-auto relative z-10">
                        <div className="inline-flex justify-center items-center p-4 bg-background/80 backdrop-blur-md border border-border/50 rounded-full shadow-lg mb-6 text-primary">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-merriweather font-black text-white drop-shadow-xl tracking-tight mb-6">Lær om langfart</h1>
                        <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium drop-shadow-lg">
                            Din primære kilde til uskrevne regler, faste aftaler og livet ombord på sejlbådene. Udforsk viden før du står til søs eller inviterer ombord.
                        </p>
                    </div>
                </header>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                    {/* Frivillige Skribenter Info Boks */}
                    <div className="mb-12 bg-primary/5 border border-primary/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-left shadow-sm mt-4">
                        <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
                            <PenTool className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold font-merriweather text-foreground mb-2">Vi søger frivillige skribenter! ✍️</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                Langturssejlads.dk er skabt af og for sejlere. Vi arbejder løbende på at udvide denne gratis vidensbase for almen afbenyttelse, så færre nybegyndere skal opfinde den dybe tallerken i Atlanterhavet. Brænder du for et sejlads-relateret emne – stort som småt – og vil du hjælpe fællesskabet ved at skrive en kort artikel, vi kan udgive her? Så tøv ikke med at række ud til os på <a href="mailto:simon@paag.dk" className="text-primary hover:underline font-bold break-all">simon@paag.dk</a> eller smid os en besked i logbogen på Om-siden. Vi tager imod alt med kyshånd!
                            </p>
                        </div>
                    </div>

                    {/* Oversigts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {faqs.length > 0 ? (
                            faqs.map((faq: any, idx: number) => {
                                // Strip HTML tags to get raw text for snippet
                                const plainText = faq.content?.replace(/<[^>]+>/g, ' ') || '';
                                const ad = ads.find((a: any) => a.placement === idx);
                                return (
                                    <div className="contents" key={faq.id}>
                                        {ad && <AdCard ad={ad} />}
                                        <Link
                                            href={`/faq/${faq.slug}`}
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
                                    </div>
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
            </main >
        </div >
    );
}
