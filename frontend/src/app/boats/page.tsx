import Link from 'next/link';
import { Ship } from 'lucide-react';
import Image from 'next/image';
import { getFallbackImage } from '@/utils/fallbackImage';

interface Boat {
    id: number;
    slug: string;
    name: string;
    description: string;
    coverImage: string | null;
    profileImage: string | null;
    crewMemberships: {
        user: { id: number; name: string };
        role: string;
    }[];
}

export const revalidate = 60; // Cachet i 60 sekunder på Vercel

export default async function BoatsPage() {
    let boats: Boat[] = [];
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const res = await fetch(`${apiUrl}/api/boats`, { next: { revalidate: 60 } });
        if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
        }
        boats = await res.json();
    } catch (error) {
        console.error('Failed to fetch boats:', error);
        throw error;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="mb-16 border-b-[2px] border-foreground pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-5xl md:text-6xl font-merriweather font-black mb-4">Mød Bådene</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl font-medium tracking-wide">
                        Opdag de danske både, der lige nu befinder sig på verdenshavene.
                    </p>
                </div>
                <div className="text-sm font-bold uppercase tracking-widest bg-primary text-white px-4 py-2">
                    Registeret: {boats.length} både
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {boats.map((boat) => (
                    <Link href={`/boats/${boat.slug}`} key={boat.id} className="block group">
                        <div className="flex flex-col h-full hover-lift">
                            <div className="relative w-full aspect-[4/3] bg-muted mb-6 overflow-hidden border border-border">
                                {/* Visuel prioritet: Cover -> Profilbillede -> Placeholder */}
                                <Image
                                    src={boat.coverImage || boat.profileImage || getFallbackImage(boat.id, 'cover')}
                                    alt={`Sejlbåden ${boat.name} - Danske Sejlere`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out grayscale-[15%]"
                                />
                            </div>
                            <div className="flex-1 border-t border-border pt-4">
                                <h2 className="text-3xl font-merriweather font-bold mb-3 group-hover:text-primary transition-colors">
                                    {boat.name}
                                </h2>
                                <p className="text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                                    {boat.description || 'Ingen officiel logbogs-beskrivelse endnu.'}
                                </p>

                                <div className="text-xs font-bold uppercase tracking-widest text-primary">
                                    {boat.crewMemberships.length > 0 ? (
                                        <p>Mandskab: <span className="text-foreground">{boat.crewMemberships.map(c => c.user.name).join(', ')}</span></p>
                                    ) : (
                                        <p className="text-muted-foreground">Mangler mandskab</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {boats.length === 0 && (
                    <div className="col-span-full py-32 text-center border-b-[2px] border-foreground">
                        <h2 className="text-3xl font-merriweather font-bold text-muted-foreground">Havnen er tom.</h2>
                        <p className="text-muted-foreground mt-4">Ingen skibe er registreret endnu.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
