import { Mail, Phone, Anchor, ArrowRightLeft, ShieldCheck, Download } from 'lucide-react';
import Link from 'next/link';
import WpConnectorForm from '@/components/WpConnectorForm';

export const metadata = {
    title: 'Kontakt os - Langturssejlads.dk',
    description: 'Få hjælp til at oprette din sejlbåd, togt eller artikler på Langturssejlads.dk.',
};

export default function KontaktPage() {
    return (
        <div className="min-h-[80vh] bg-muted/30 py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 text-primary shadow-sm border border-primary/20">
                        <Anchor className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-merriweather font-black text-foreground mb-4 drop-shadow-sm">Kontakt Os</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Har du brug for hjælp til at få din båd på platformen, eller har du en god beretning fra havet? Vi sidder klar til at assistere dig personligt.
                    </p>
                </div>

                <div className="bg-background rounded-3xl shadow-xl border border-border/50 p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start relative z-10">
                        <div>
                            <h2 className="text-2xl font-bold mb-6 font-merriweather inline-block border-b-2 border-primary/30 pb-2">Skriv eller ring direkte</h2>
                            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                                Vi brænder for at samle danske langturssejlere her på den nye portal. Tøv ikke med at række ud – lille som stor opgave, vi kan hurtigt få dit indhold formateret og lagt flot op.
                            </p>

                            <div className="flex items-center gap-6 mb-8 bg-muted/30 p-4 rounded-3xl border border-border/50">
                                <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border-4 border-background shadow-md bg-muted">
                                    <img
                                        src="/images/simon_paag_portrait.png"
                                        alt="Simon Paag"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg font-merriweather">Simon Paag</h3>
                                    <p className="text-xs text-primary font-bold uppercase tracking-widest">Platform Ansvarlig</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <a href="tel:+4526712897" className="flex items-center gap-5 group p-4 -ml-4 rounded-2xl hover:bg-muted/50 transition-colors">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm group-hover:scale-105 group-hover:shadow-md">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Telefon / SMS</p>
                                        <p className="text-xl font-bold group-hover:text-primary transition-colors font-merriweather">+45 2671 2897</p>
                                    </div>
                                </a>

                                <a href="mailto:simon@paag.dk" className="flex items-center gap-5 group p-4 -ml-4 rounded-2xl hover:bg-muted/50 transition-colors">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm group-hover:scale-105 group-hover:shadow-md">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Email Direkte</p>
                                        <p className="text-xl font-bold group-hover:text-primary transition-colors font-merriweather">simon@paag.dk</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="bg-muted/50 p-8 rounded-3xl border border-border/80 flex flex-col justify-center h-full shadow-inner">
                            <h3 className="text-xl font-bold mb-3">Vil du hellere prøve selv?</h3>
                            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                                Platformen er bygget til at være nem at bruge. Du kan oprette din sejlbåd, invitere gaster og skrive logbog direkte fra din egen profil.
                            </p>
                            <Link href="/opret-baad" className="flex items-center justify-center w-full bg-foreground text-background py-4 px-6 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-primary hover:shadow-lg transition-all hover:-translate-y-0.5">
                                Gå til Oprettelse
                            </Link>

                            <div className="mt-6 pt-6 border-t border-border/60 text-center">
                                <p className="text-xs text-muted-foreground">
                                    Allerede medlem? <Link href="/login" className="font-bold text-primary hover:underline underline-offset-4">Log ind her</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WordPress Connector Section */}
                <div className="mt-16 pt-16 border-t border-border/40 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 font-bold text-sm tracking-widest uppercase mb-6 border border-blue-500/20">
                                <ArrowRightLeft className="w-4 h-4" />
                                Nyhed: WordPress Connector
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-merriweather text-foreground leading-tight">
                                Forbind din egen turblog automatisk
                            </h2>
                            <div className="space-y-6 text-muted-foreground leading-relaxed">
                                <p>
                                    Har du allerede en populær rejseblog kørende på WordPress? Med vores nye <strong>WordPress Connector</strong> kan indholdet på din blog skydes direkte over på Langturssejlads, helt af sig selv.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span><strong>Fuld kontrol:</strong> Du kan selv tilføje, redigere eller slette det hele direkte fra platformen, præcis når det passer dig.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Download className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span><strong>Dit data er dit:</strong> Ønsker du at forlade os igen? Intet problem. Du kan nemt downloade al dit maritime indhold og tage det med videre hjem til havnen. Læs mere i vores <Link href="/rettigheder" className="text-primary hover:underline font-bold">betingelser og vilkår for indholdsdeling</Link>.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Formular-komponenten */}
                        <div className="relative">
                            {/* Decorative blob behind the form */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl -z-10"></div>
                            <WpConnectorForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
