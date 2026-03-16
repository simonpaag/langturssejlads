import Link from 'next/link';
import { Anchor } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="mb-8 p-6 bg-muted rounded-full inline-flex">
                <Anchor className="w-16 h-16 text-muted-foreground opacity-50" />
            </div>
            <h1 className="text-4xl md:text-5xl font-merriweather font-black text-foreground mb-4">
                Siden blev ikke fundet
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10">
                Vi har gennemsøgt alle logbøger, men den side du leder efter, eksisterer desværre ikke. Måske har vinden blæst den væk, eller båden har skiftet kurs.
            </p>
            <Link 
                href="/" 
                className="inline-flex items-center justify-center gap-2 bg-foreground hover:bg-primary text-background font-bold px-8 py-4 rounded-full shadow-lg transition-all uppercase tracking-wider text-sm"
            >
                Gå tilbage til forsiden
            </Link>
        </div>
    );
}
