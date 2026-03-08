import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Ad {
    id: number;
    headline: string;
    content: string;
    imageUrl: string | null;
    linkUrl: string | null;
    placement: number | null;
}

export default function AdCard({ ad }: { ad: Ad }) {
    return (
        <article className="group flex flex-col h-full bg-primary/5 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-primary/20 overflow-hidden relative">
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full z-10 shadow-md">
                Annonce
            </div>
            {ad.imageUrl && (
                <Link href={ad.linkUrl || '#'} className="block relative w-full aspect-[4/3] bg-muted overflow-hidden">
                    <Image
                        src={ad.imageUrl}
                        alt={ad.headline}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                </Link>
            )}
            <div className="flex flex-col flex-grow p-6">
                <Link href={ad.linkUrl || '#'}>
                    <h3 className="text-2xl font-merriweather font-bold mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                        {ad.headline}
                    </h3>
                </Link>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-4">
                    {ad.content}
                </p>
                <div className="mt-auto flex justify-end border-t border-primary/10 pt-4">
                    <Link href={ad.linkUrl || '#'} className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline underline-offset-4">
                        Læs mere <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
