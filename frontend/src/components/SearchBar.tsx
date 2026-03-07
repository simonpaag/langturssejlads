'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Ship, Anchor, FileText, BookOpen, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults(null);
            setIsOpen(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${apiUrl}/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const hasResults = results && (
        results.boats?.length > 0 ||
        results.voyages?.length > 0 ||
        results.posts?.length > 0 ||
        results.faqs?.length > 0
    );

    return (
        <div ref={wrapperRef} className="relative w-full md:w-64 lg:w-80 group">
            <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (query) setIsOpen(true); }}
                    placeholder="Søg på sider eller både..."
                    className="w-full bg-secondary/50 border border-border/80 text-foreground text-sm rounded-full pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-inter placeholder:text-muted-foreground"
                />
                {query && (
                    <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </form>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 w-full min-w-[300px] md:w-[400px] md:-right-12 md:left-auto bg-slate-950 border border-border/50 rounded-xl shadow-2xl overflow-hidden z-[100]">
                    <div className="max-h-[400px] overflow-y-auto overscroll-contain">
                        {isLoading && (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                Søger...
                            </div>
                        )}

                        {!isLoading && !hasResults && query && (
                            <div className="p-6 text-center text-sm text-muted-foreground">
                                Ingen resultater fundet for "{query}"
                            </div>
                        )}

                        {!isLoading && hasResults && (
                            <div className="py-2">
                                {/* Boats */}
                                {results.boats?.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/30">Både</div>
                                        {results.boats.map((boat: any) => (
                                            <Link key={boat.id} href={`/boats/${boat.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                                    <Ship className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-foreground truncate">{boat.name}</p>
                                                    {boat.boatModel && <p className="text-xs text-muted-foreground truncate">{boat.boatModel}</p>}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Voyages */}
                                {results.voyages?.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/30">Togter</div>
                                        {results.voyages.map((voyage: any) => (
                                            <Link key={voyage.id} href={`/boats/unknown/voyages/${voyage.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                                                <div className="bg-amber-500/10 p-2 rounded-lg text-amber-600">
                                                    <Anchor className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-foreground truncate">{voyage.title}</p>
                                                    {(voyage.fromLocation || voyage.toLocation) && <p className="text-xs text-muted-foreground truncate">{voyage.fromLocation} ⟶ {voyage.toLocation}</p>}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Articles */}
                                {results.posts?.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/30">Logbøger</div>
                                        {results.posts.map((post: any) => (
                                            <Link key={post.id} href={`/posts/${post.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                                                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-foreground truncate">{post.title || 'Logbog'}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* FAQs */}
                                {results.faqs?.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/30">Viden & FAQ</div>
                                        {results.faqs.map((faq: any) => (
                                            <Link key={faq.id} href={`/faq/${faq.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                                                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-foreground truncate">{faq.title}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {hasResults && (
                        <button onClick={handleSearchSubmit} className="w-full bg-muted/50 border-t border-border p-3 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2">
                            Se alle resultater <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

