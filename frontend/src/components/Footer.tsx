import Link from 'next/link';
import { Anchor } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border mt-auto pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
                    <div className="md:col-span-2 pr-4">
                        <Link href="/" className="flex items-center gap-3 group mb-6">
                            <Anchor className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                            <span className="font-merriweather font-black text-2xl tracking-tighter uppercase text-foreground">Langturssejlads</span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed font-medium">
                            Følg de danske sejlere på langfart på de syv verdenshave.
                            Vi samler logbøger, videoer og historier fra uafhængige både og besætninger over hele kloden.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-foreground border-b border-foreground pb-2 mb-6 inline-block">Ombord</h3>
                        <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                            <li><Link href="/boats" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">Både til søs</Link></li>
                            <li><Link href="/togter" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">Kommende togter</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-foreground border-b border-foreground pb-2 mb-6 inline-block">Platformen</h3>
                        <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                            <li><Link href="/om" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">Projektet / Om os</Link></li>
                            <li><Link href="/faq" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">Lær om langfart (FAQ)</Link></li>
                            <li><a href="mailto:kontakt@langturssejlads.dk?subject=Annonc%C3%B8r" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">Bliv annoncør</a></li>
                            <li><a href="mailto:kontakt@langturssejlads.dk?subject=Vilka%C3%A5r" className="hover:text-primary hover:translate-x-1 inline-block transition-transform">Rettigheder & Vilkår</a></li>
                            <li><a href="mailto:kontakt@langturssejlads.dk?subject=Moderation" className="hover:text-primary hover:translate-x-1 inline-block transition-transform text-destructive/80 font-bold">Retningslinjer</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-foreground border-b border-foreground pb-2 mb-6 inline-block">Kontakt</h3>
                        <address className="not-italic text-sm font-medium text-muted-foreground space-y-3">
                            <p>Langturssejlads.dk</p>
                            <p>Overgaden Oven Vandet 8</p>
                            <p>1415 København K.</p>
                            <p>Danmark</p>
                            <p className="pt-2">
                                <a href="mailto:kontakt@langturssejlads.dk" className="hover:text-primary transition-colors border-b border-primary/30 pb-1">kontakt@langturssejlads.dk</a>
                            </p>
                        </address>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-bold text-muted-foreground/70 tracking-widest uppercase text-center md:text-left">
                        &copy; {new Date().getFullYear()} Langturssejlads. Alle rettigheder forbeholdes.
                    </p>
                    <div className="flex items-center gap-4 bg-background px-4 py-2 border border-border rounded-full shadow-sm">
                        <span className="text-xs font-bold text-foreground tracking-widest uppercase">Tema</span>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </footer>
    );
}
