'use client';

import { Send, Lightbulb, ShieldAlert, Anchor } from 'lucide-react';

export default function OmPage() {
    const handleIdeaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Tak for din idé! \n\nHUSK (Simon): Du skal lige sætte servicen op, der sender denne kontaktformular til simon@paag.dk!');
    };

    const handleModerationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Tak for din henvendelse omkring moderation! \n\nHUSK (Simon): Opsæt servicen til simon@paag.dk senere.');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-inter">
            <main className="flex-1 pb-24">
                {/* Hero Section */}
                <div className="relative w-full h-[50vh] min-h-[400px] mb-16 overflow-hidden border-b border-border/40">
                    <img
                        src="https://images.unsplash.com/photo-1544331002-c940ce98a8da?q=80&w=2000&auto=format&fit=crop"
                        alt="Båd på havet i solnedgang"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 pb-12 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary uppercase tracking-widest text-xs font-bold mb-6">
                            <Anchor className="w-4 h-4" />
                            Historien Bag
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-merriweather font-black text-foreground drop-shadow-lg leading-[1.1]">
                            Om Langturssejlads
                        </h1>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

                    {/* Hovedtekst - Historien */}
                    <section className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-medium">
                        <p className="text-2xl font-merriweather !leading-snug text-foreground mb-8 text-balance">
                            Langturssejlads.dk opstod ud fra en fælles drøm blandt passionerede sejlere: Drømmen om ét samlet, digitalt kompas, der kunne vise vej gennem de uendelige historier, dyrekøbte erfaringer og storslåede eventyr, som danske sejlere oplever ude på verdenshavene.
                        </p>
                        <p>
                            Vi savnede slet og ret en platform, hvor vores fællesskab kunne spejle sig i hinandens rejser — uanset om man slikker sol i Caribien, kæmper sig over et nådesløst Stillehav eller går med drømmene og forbereder skibet hjemme i den lokale, danske havn.
                        </p>
                        <p>
                            Dette projekt er <strong>100% non-profit</strong> og drives frem af ren frivillig arbejdskraft, saltvand i blodet og en urokkelig kærlighed til det frie liv på havet. De midler, vi forsøger at rejse, går ubeskåret til at holde platformen flydende og til løbende at videreudvikle funktionerne for vores brugere.
                        </p>
                        <div className="bg-secondary/10 border-l-4 border-secondary p-6 rounded-r-2xl my-10 shadow-sm">
                            <p className="m-0 text-foreground/90 italic">
                                Selve den tekniske rigning og arkitektur bag sitet er etableret med uvurderlig hjælp fra digitale kompetencer i selskabet <a href="https://spinnakernordic.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-bold transition-colors underline decoration-2 underline-offset-4">Spinnaker Nordic</a>, der deler vores passion for knivskarpe, moderne løsninger.
                            </p>
                        </div>
                    </section>

                    {/* Fremtiden & Idé-formular */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Lightbulb className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-merriweather font-black text-foreground">Hvad er det næste skridt?</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                            <div className="text-foreground/80 leading-relaxed space-y-4">
                                <p>
                                    Vi udvikler hele tiden videre på sitet, og vi har allerede en lang række drømme om, hvad der kunne være fedt at tilføje fremover. For at sikre, at vi bygger det, som fællesskabet faktisk ønsker, samler vi løbende på idéer fra jer sejlere.
                                </p>
                                <p>
                                    Uanset om du har et helt specifikt, individuelt behov, eller om du kommer med det gyldne overblik og en idé, som alle brugere kunne nyde godt af, vil vi elske at høre fra dig.
                                </p>
                                <p className="font-bold text-foreground">
                                    Skriv din idé til os herunder, så tager vi den med til kaptajnsmødet og vores fremtidige overvejelser!
                                </p>
                            </div>

                            <form onSubmit={handleIdeaSubmit} className="bg-card border border-border shadow-xl rounded-3xl p-6 sm:p-8">
                                <h3 className="text-xl font-bold mb-6 font-merriweather">Send en idé til logbogen</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="idea-name" className="block text-sm font-bold text-foreground mb-1.5 uppercase tracking-wide">Dit navn</label>
                                        <input id="idea-name" required type="text" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="F.eks. Jens Hansen" />
                                    </div>
                                    <div>
                                        <label htmlFor="idea-email" className="block text-sm font-bold text-foreground mb-1.5 uppercase tracking-wide">Din E-mail</label>
                                        <input id="idea-email" required type="email" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none" placeholder="jens@havet.dk" />
                                    </div>
                                    <div>
                                        <label htmlFor="idea-text" className="block text-sm font-bold text-foreground mb-1.5 uppercase tracking-wide">Hvad kunne være fedt?</label>
                                        <textarea id="idea-text" required rows={4} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none" placeholder="Jeg drømmer om at sitet også kunne..."></textarea>
                                    </div>
                                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 px-6 rounded-xl transition-all shadow-md mt-2">
                                        <Send className="w-4 h-4" />
                                        Send Idé
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    {/* Moderation Formular */}
                    <section className="bg-secondary/5 border border-border rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="flex items-center gap-3 mb-6 relative">
                            <ShieldAlert className="w-8 h-8 text-primary" />
                            <h2 className="text-3xl font-merriweather font-black text-foreground">Hvordan modererer vi sitet?</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative">
                            <div className="text-foreground/80 leading-relaxed space-y-4">
                                <p>
                                    Lige nu har vi kun begrænsede ressourcer til at læse med overalt, men vi har heldigvis erfaring for, at hvis vi holder sitet udelukkende på dansk, så undgår vi langt den største mængde spam og ondsindede angreb.
                                </p>
                                <p>
                                    Er der alligevel noget, der er sluppet igennem nettet? Vi kan hurtigt fjerne indhold, hvis det måtte være nødvendigt!
                                </p>
                                <p className="font-bold text-foreground">
                                    Hvis du falder over en artikel eller en profil, der overtræder retningslinjerne eller åbenlyst er spam, så udfyld formularen her. Vi forsøger at reagere hurtigst muligt.
                                </p>
                            </div>

                            <form onSubmit={handleModerationSubmit} className="bg-card border border-border shadow-xl rounded-2xl p-6 sm:p-8">
                                <h3 className="text-xl font-bold mb-6 font-merriweather text-primary">Rapportér Indhold</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="mod-name" className="block text-sm font-bold text-foreground mb-1.5 uppercase tracking-wide">Dit navn</label>
                                        <input id="mod-name" required type="text" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-destructive focus:ring-1 focus:ring-destructive transition-all outline-none" placeholder="F.eks. Maja" />
                                    </div>
                                    <div>
                                        <label htmlFor="mod-email" className="block text-sm font-bold text-foreground mb-1.5 uppercase tracking-wide">Din E-mail</label>
                                        <input id="mod-email" required type="email" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-destructive focus:ring-1 focus:ring-destructive transition-all outline-none" placeholder="maja@oceansejleren.dk" />
                                    </div>
                                    <div>
                                        <label htmlFor="mod-text" className="block text-sm font-bold text-foreground mb-1.5 uppercase tracking-wide">Hvor er fejlen, og hvad er det?</label>
                                        <textarea id="mod-text" required rows={3} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-destructive focus:ring-1 focus:ring-destructive transition-all outline-none resize-none" placeholder="Jeg fandt i spam på linket..."></textarea>
                                    </div>
                                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground font-bold py-3.5 px-6 rounded-xl transition-all shadow-md mt-2">
                                        <ShieldAlert className="w-4 h-4" />
                                        Insend Rapport
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
