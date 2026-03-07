'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Ship, Anchor, FileText, BookOpen, Search as SearchIcon } from 'lucide-react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

function SearchResults() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q') || '';
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!q) return;
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const res = await fetch(`${apiUrl}/api/search?q=${encodeURIComponent(q)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [q]);

    const hasResults = results && (
        results.boats?.length > 0 ||
        results.voyages?.length > 0 ||
        results.posts?.length > 0 ||
        results.faqs?.length > 0
    );

    return (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            <div className="mb-12 border-b border-border pb-8">
                <h1 className="text-4xl font-merriweather font-black text-foreground flex items-center gap-4">
                    <SearchIcon className="w-8 h-8 text-primary" /> Søgeresultater
                </h1>
                <p className="text-xl text-muted-foreground mt-4">
                    Viser resultater for: <strong className="text-foreground">"{q}"</strong>
                </p>
            </div>

            {isLoading && (
                <div className="py-20 text-center text-muted-foreground animate-pulse">
                    Indlæser resultater...
                </div>
            )}

            {!isLoading && !hasResults && q && (
                <div className="py-20 text-center bg-card border border-border shadow-sm rounded-3xl">
                    <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <h2 className="text-2xl font-bold font-merriweather text-foreground mb-2">Ingen resultater fundet</h2>
                    <p className="text-muted-foreground">Vi kunne ikke finde noget der matchede din søgning. Prøv andre eller færre søgeord.</p>
                </div>
            )}

            {!isLoading && hasResults && (
                <div className="space-y-16">
                    {/* Både */}
                    {results.boats?.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Ship className="text-primary w-6 h-6" />
                                <h2 className="text-2xl font-black font-merriweather">Både på vandet</h2>
                                <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-bold text-muted-foreground">{results.boats.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.boats.map((boat: any) => (
                                    <Link key={boat.id} href={`/boats/${boat.slug}`} className="group bg-card border border-border shadow-sm hover:shadow-lg transition-all rounded-3xl overflow-hidden flex items-center p-4">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted shrink-0 mr-4">
                                            {boat.profileImage ? (
                                                <img src={boat.profileImage} alt={boat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                                    <Ship className="w-8 h-8 text-primary opacity-50" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{boat.name}</h3>
                                            {boat.boatModel && <p className="text-sm text-muted-foreground">{boat.boatModel}</p>}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Togter */}
                    {results.voyages?.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Anchor className="text-amber-600 w-6 h-6" />
                                <h2 className="text-2xl font-black font-merriweather">Togter & Rejser</h2>
                                <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-bold text-muted-foreground">{results.voyages.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {results.voyages.map((voyage: any) => (
                                    <Link key={voyage.id} href={`/boats/unknown/voyages/${voyage.slug}`} className="bg-card border border-border hover:border-amber-500/50 shadow-sm hover:shadow-md transition-all rounded-3xl p-6 group">
                                        <h3 className="font-bold text-xl mb-2 group-hover:text-amber-600 transition-colors">{voyage.title}</h3>
                                        {(voyage.fromLocation || voyage.toLocation) && (
                                            <p className="text-sm text-muted-foreground mb-4 font-bold uppercase tracking-wider">
                                                {voyage.fromLocation} ⟶ {voyage.toLocation}
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground line-clamp-2">{voyage.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Artikler & Logbøger */}
                    {results.posts?.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="text-blue-600 w-6 h-6" />
                                <h2 className="text-2xl font-black font-merriweather">Logbøger</h2>
                                <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-bold text-muted-foreground">{results.posts.length}</span>
                            </div>
                            <div className="space-y-4">
                                {results.posts.map((post: any) => (
                                    <Link key={post.id} href={`/posts/${post.slug}`} className="block bg-card hover:bg-muted/30 border border-border rounded-2xl p-6 transition-colors group">
                                        <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">{post.title || 'Logbog opdatering'}</h3>
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                                            {format(new Date(post.createdAt), 'd. MMMM yyyy', { locale: da })}
                                        </p>
                                        {post.content && (
                                            <p className="text-sm text-foreground/80 line-clamp-2">
                                                {post.content.replace(/<[^>]+>/g, '')}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* FAQ */}
                    {results.faqs?.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <BookOpen className="text-emerald-600 w-6 h-6" />
                                <h2 className="text-2xl font-black font-merriweather">Lær om langfart</h2>
                                <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-bold text-muted-foreground">{results.faqs.length}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {results.faqs.map((faq: any) => (
                                    <Link key={faq.id} href={`/faq/${faq.slug}`} className="flex items-center gap-4 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 transition-colors group">
                                        <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-700">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-foreground group-hover:text-emerald-700 transition-colors">{faq.title}</h3>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Henter søgning...</div>}>
            <SearchResults />
        </Suspense>
    );
}
