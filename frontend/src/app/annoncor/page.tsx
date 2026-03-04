import Link from 'next/link';
import { Mail, Navigation, Newspaper, Megaphone } from 'lucide-react';

export default function AnnoncorPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-inter">
            {/* Hero Section */}
            <div className="relative w-full py-32 lg:py-48 overflow-hidden bg-muted/30">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/annoncor-hero.jpg')" }}
                >
                    <div className="absolute inset-0 bg-foreground/70 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/20 text-white border border-white/20 uppercase tracking-widest text-xs font-bold mb-6 backdrop-blur-sm shadow-sm">
                        <Megaphone className="w-4 h-4" />
                        Kommercielt Samarbejde
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-merriweather font-black text-white drop-shadow-xl leading-[1.1]">
                        Bliv Annoncør
                    </h1>
                </div>
            </div>

            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

                {/* Motivation Section */}
                <section className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-medium">
                    <p className="text-2xl font-merriweather !leading-snug text-foreground mb-8 text-balance">
                        Langturssejlads.dk afhænger af engagerede, frivillige kræfter og dedikerede bidragydere, der i sin tid finansierede lanceringen af Danmarks største digitale logbog.
                    </p>
                    <p>
                        Der er dog løbende, uomtvistelige udgifter forbundet med at drive, udvikle og skalere moderne web-platforme i denne størrelse. For fortsat at kunne tilbyde vores 100% gratis, non-profit portal til de mange sejlglade danskere, søger vi proaktivt strategiske partnere.
                    </p>
                    <p>
                        Lige nu har du mulighed for at dække dele af disse driftsudgifter og være med til at sikre fremtiden for Langturssejlads.dk. I bytte tilbyder vi unik, knivskarp annonceringsplads målrettet direkte mod Danmarks passionerede sejlersegment.
                    </p>
                </section>

                {/* Ydelser Section */}
                <section>
                    <h2 className="text-3xl font-merriweather font-black text-foreground mb-10 text-center">Her kan vi eksponere dit brand</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Hjemmeside */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
                            <Navigation className="w-10 h-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold font-merriweather mb-3 text-foreground">Reklamer på Hjemmesiden</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Nå ud til alle sidens daglige, aktive gæster direkte gennem bannere på togter, logbøger og informationssider. Træf sejlerne der, hvor de inspireres.
                            </p>
                        </div>

                        {/* Nyhedsbreve */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
                            <Newspaper className="w-10 h-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold font-merriweather mb-3 text-foreground">Sponsorerede Nyhedsbreve</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Modtag en eksklusiv "Plads i logbogen" direkte i inboksen hos vores trofaste nyhedsbrevsmodtagere, inklusiv dedikeret plads til jeres budskab og eventuelle tilbud.
                            </p>
                        </div>

                        {/* Eksterne Medier */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
                            <Megaphone className="w-10 h-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold font-merriweather mb-3 text-foreground">Eksterne Medier</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Vi tager gerne jeres content med os videre ud i det store, digitale havmiljø og sørger for kampagner mod sejlersegmentet.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 bg-primary/5 rounded-2xl p-8 border border-primary/20 text-center">
                        <p className="font-medium text-foreground/90 max-w-2xl mx-auto leading-relaxed">
                            Alle digitale medier er i spil for jeres målretning, uanset om det gælder <span className="font-bold text-foreground">YouTube, Meta Ads (Facebook & Instagram), TikTok</span> eller retargeting direkte gennem online udgaverne af <span className="font-bold text-foreground">TV2, Politiken, Berlingske (B.dk), BT og Ekstra Bladet</span>.
                        </p>
                    </div>
                </section>

                {/* Kontakt CTA */}
                <section className="text-center bg-card border border-border shadow-xl rounded-3xl p-10 md:p-14 mb-16">
                    <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-merriweather font-black text-foreground mb-4">Lad os tage en snak</h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        Skriv direkte til projektledelsen for at høre nærmere om mulighederne for at bygge et stærkt partnerskab mellem jeres virksomhed og Langturssejlads.dk.
                    </p>
                    <a href="mailto:simon@paag.dk" className="inline-block bg-primary text-primary-foreground font-bold font-sans py-4 px-10 rounded-full hover:bg-primary/90 transition-all shadow-md text-lg tracking-wide">
                        Kontakt os i dag
                    </a>
                </section>

            </main>
        </div>
    );
}
