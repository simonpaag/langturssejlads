'use client';

import { ShieldAlert, AlertTriangle, Scale, UserX } from 'lucide-react';
import Link from 'next/link';

export default function ModerationPage() {
    const handleModerationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        alert('Tak for din advarsel! Vi undersøger sagen og skrider ind hurtigst muligt.');
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-inter">
            {/* Hero Section */}
            <div className="relative w-full py-20 lg:py-28 overflow-hidden border-b border-border/40 bg-destructive/5">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/10 text-destructive uppercase tracking-widest text-xs font-bold mb-6">
                        <ShieldAlert className="w-4 h-4" />
                        Retningslinjer og Moderation
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-merriweather font-black text-foreground drop-shadow-sm leading-[1.1]">
                        Vores Fælles Ansvar
                    </h1>
                </div>
            </div>

            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

                {/* Intro */}
                <section className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-medium">
                    <p className="text-2xl font-merriweather !leading-snug text-foreground mb-8 text-balance">
                        Llangturssejlads.dk er bygget af hjertet for at skabe et positivt, lærerigt og eventyrligt digitalt fællesskab for danske sejlere verden over. For at bevare den gode stemning har vi nogle ufravigelige regler for det indhold, der deles.
                    </p>
                    <p>
                        Vi betragter os alle som besætningsmedlemmer på det samme skib, og der er nultolerance over for en rådden tone. Vores administration forbeholder sig – til enhver tid gældende – den fulde, ubestridte og omgående ret til at fjerne alt indhold, enhver profil eller ethvert fartøj, der bevidst eller ubevidst overtræder nedenstående retningslinjer, <strong>uden forudgående varsel</strong>.
                    </p>
                </section>

                {/* Regler */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Tone og adfærd */}
                    <div className="bg-card border border-border shadow-sm rounded-3xl p-8 border-t-4 border-t-amber-500">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-amber-500/10 rounded-xl">
                                <AlertTriangle className="w-8 h-8 text-amber-500" />
                            </div>
                            <h2 className="text-xl font-black font-merriweather m-0">Sprog og Tone</h2>
                        </div>
                        <ul className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                            <li className="flex gap-2">
                                <span className="text-amber-500 mt-1">•</span>
                                <span><strong>Ingen skældsord eller bandeord:</strong> Den grove, stødende havnetone lader vi blive på land. Vær konstruktiv og høflig i alle offentlige tekster.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-amber-500 mt-1">•</span>
                                <span><strong>Ingen vulgære udtryk, hadtale eller chikane:</strong> Diskrimination, personangreb og nedladende kommentarer overfor andre brugere eller tredjepart tolereres under ingen omstændigheder.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Visuelt Indhold */}
                    <div className="bg-card border border-border shadow-sm rounded-3xl p-8 border-t-4 border-t-destructive">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-destructive/10 rounded-xl">
                                <ShieldAlert className="w-8 h-8 text-destructive" />
                            </div>
                            <h2 className="text-xl font-black font-merriweather m-0">Visuelt Indhold</h2>
                        </div>
                        <ul className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                            <li className="flex gap-2">
                                <span className="text-destructive mt-1">•</span>
                                <span><strong>Ingen grader af nøgenhed:</strong> Platformen skal kunne læses af alle aldersgrupper. Selvom livet til søs i troperne er frit, må billeder ikke indholde eksplicit fremvisning af kroppe eller nogen form for pornografisk indhold.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-destructive mt-1">•</span>
                                <span><strong>Gore og voldsomt indhold:</strong> Billeder der skildrer alvorlig fare, ulykker eller blod er ikke tilladt uden en relevant, saglig, lærerig og advarende kontekst (fx søsikkerhed).</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Konsekvenser - Helgardering */}
                <section className="bg-muted p-8 md:p-12 rounded-3xl border border-border">
                    <div className="flex items-center gap-3 mb-6">
                        <Scale className="w-8 h-8 text-foreground" />
                        <h2 className="text-2xl font-merriweather font-black text-foreground m-0">Konsekvenser for Brud og Rettigheder</h2>
                    </div>
                    <div className="prose prose-md dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                        <p>
                            Når du opretter en bruger, en båd eller publicerer en logbog, bekræfter du automatisk vores suveræne ret til at moderere den publicerede data. Vores admin-hold overvåger og håndhæver fællesskabets interesser stringent:
                        </p>
                        <ul>
                            <li>Vi forbeholder os retten til at fjerne, afpublicere (unpublish), nedtone, eller permanent slette <strong>ethvert stykke information, indlæg eller billede</strong> på platformen, som – efter platformens egen ensidige fortolkning – virker anstødeligt, misvisende, skadeligt eller blot ukorrekt ift. formålet med hjemmesiden.</li>
                            <li>Brugere eller fartøjer, der bryder retningslinjerne, medfører <strong>øjeblikkelig suspendering og sletning</strong> af hele kontoen samt al tilhørende data – uden advarsel, begrundelseskrav eller formel høringsret. Vi lytter naturligvis, men platformens beslutninger betragtes som endelige.</li>
                            <li>Llangturssejlads.dk fraskriver sig ethvert objektivt ansvar for krav indsendt på baggrund af tabt kildedata som følge af en modereringssletning. Upload derfor altid indhold hertil ud fra princippet om, at du har gemt dine vigtigste rejsefortællinger i et lokalt backup andetsteds.</li>
                        </ul>
                    </div>
                </section>

                {/* Moderation Formular */}
                <section className="bg-secondary/5 border border-border rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-destructive/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex items-center gap-3 mb-6 relative">
                        <ShieldAlert className="w-8 h-8 text-destructive" />
                        <h2 className="text-3xl font-merriweather font-black text-foreground">Rapportér anstødeligt indhold</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative">
                        <div className="text-foreground/80 leading-relaxed space-y-4">
                            <p>
                                Vi har heldigvis erfaring for, at hvis vi holder sitet udelukkende på dansk og nært knyttet til sejlerfællesskabet, så undgår vi langt den største mængde spam og ondsindede angreb.
                            </p>
                            <p>
                                Er der alligevel noget, der er sluppet igennem nettet? Vi kan lynhurtigt fjerne indhold, hvis det måtte være nødvendigt!
                            </p>
                            <p className="font-bold text-foreground">
                                Hvis du falder over en post, logbog, et billede eller en profil, der overtræder retningslinjerne, så udfyld formularen her. Vi vurderer sagen prompte.
                            </p>
                        </div>

                        <form onSubmit={handleModerationSubmit} className="bg-card border border-border shadow-xl rounded-2xl p-6 sm:p-8">
                            <h3 className="text-xl font-bold mb-6 font-merriweather text-destructive">Indsend Rapport</h3>
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
                                    <label htmlFor="mod-text" className="block text-sm font-bold text-foreground mb-1.5 uppercase tracking-wide">Link / Hvor er fejlen, og hvad er det?</label>
                                    <textarea id="mod-text" required rows={3} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-destructive focus:ring-1 focus:ring-destructive transition-all outline-none resize-none" placeholder="Jeg fandt vulgært spam på thet link i en logbog.."></textarea>
                                </div>
                                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground font-bold py-3.5 px-6 rounded-xl transition-all shadow-md mt-2">
                                    <ShieldAlert className="w-4 h-4" />
                                    Indsend Rapport
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

            </main>
        </div>
    );
}
