import { BookOpen, AlertCircle } from 'lucide-react';

export const metadata = {
    title: 'Lær om Langturssejlads | FAQ og Nyttig Viden',
    description: 'Bliv klogere på langtursslivet. Læs om køjepenge, regler, og hvordan du forbereder dig på at stævne ud.'
};

async function getFaqs() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/faq`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        console.error('Failed to fetch FAQs:', e);
        return [];
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

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                    {/* FAQ Grid */}
                    <div className="space-y-12">
                        {faqs.length > 0 ? (
                            faqs.map((faq: any) => (
                                <article key={faq.id} id={faq.slug} className="bg-card border border-border shadow-sm rounded-3xl p-8 md:p-10 transition-shadow hover:shadow-md">
                                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/60">
                                        <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold font-merriweather">{faq.title}</h2>
                                    </div>

                                    <div className="prose prose-lg dark:prose-invert text-foreground leading-relaxed font-medium opacity-90 max-w-none space-y-4">
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
                            ))
                        ) : (
                            <div className="bg-card border border-border shadow-sm rounded-3xl p-12 text-center text-muted-foreground">
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
