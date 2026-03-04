import Link from 'next/link';

export default function OmPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-32 text-center border-b-[2px] border-foreground">
            <h1 className="text-4xl md:text-6xl font-merriweather font-bold text-foreground mb-6">Om Langturssejlads</h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
                Siden er under opbygning. Kom snart tilbage for at læse mere om vores vision for uafhængig dækning af danske sejlere på verdenshavene.
            </p>
            <Link href="/" className="mt-12 inline-block bg-foreground text-background font-bold py-3 px-8 rounded-full hover:bg-primary transition-colors">
                Gå tilbage til forsiden
            </Link>
        </div>
    );
}
