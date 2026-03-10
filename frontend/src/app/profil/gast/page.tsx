'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, UserCircle2, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';

export default function GastProfilePage() {
    const router = useRouter();

    // Core states
    const [description, setDescription] = useState('');
    const [availablePeriod, setAvailablePeriod] = useState('');
    const [experience, setExperience] = useState('');
    const [homePort, setHomePort] = useState('');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(true);

    // UI states
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchCrewProfile = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
                const res = await fetch(`${apiUrl}/api/crew-profiles/me/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setDescription(data.description || '');
                        setAvailablePeriod(data.availablePeriod || '');
                        setExperience(data.experience || '');
                        setHomePort(data.homePort || '');
                        setGalleryImages(data.galleryImages || []);
                        setIsActive(data.isActive ?? true);
                    }
                } else if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Kunne ikke hente gasteprofil:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCrewProfile();
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setIsSaving(true);
        const token = localStorage.getItem('user_token');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

            const payload = {
                description,
                availablePeriod,
                experience,
                homePort,
                galleryImages,
                isActive
            };

            const res = await fetch(`${apiUrl}/api/crew-profiles/me/profile`, {
                method: 'POST', // The backend upserts on POST and PUT
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setMessage({ text: 'Din profil som gast er gemt og opdateret!', type: 'success' });
                // Redirect to profile to encourage filling out general info
                setTimeout(() => {
                    router.push('/profil');
                }, 1000);
            } else {
                const errData = await res.json();
                setMessage({ text: errData.error || 'Noget gik galt.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Netværksfejl under opdatering.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Læser oplysninger...</div>;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-muted/20 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">

                <Link href="/profil" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-6 pl-2">
                    <ArrowLeft className="w-4 h-4" /> Tilbage til oversigten
                </Link>

                <div className="mb-8 pl-4">
                    <h1 className="text-4xl font-merriweather font-black text-foreground mb-3 flex items-center gap-3">
                        <UserCircle2 className="w-8 h-8 text-primary" />
                        Gaste-Profil
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                        Her kan du oprette dig som gast og lægge dig ud på portalen, så bådejere kan finde dig. Fortæl lidt om hvem du er, og hvornår du har tid til eventyr.
                    </p>
                </div>

                <div className="bg-card text-card-foreground rounded-3xl shadow-xl border border-border/80 overflow-hidden relative">
                    <form onSubmit={handleSave} className="p-8 md:p-10 flex flex-col gap-8">
                        {message.text && (
                            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                                <span className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-primary' : 'bg-destructive'} animate-pulse`}></span>
                                {message.text}
                            </div>
                        )}

                        {/* Status Toggle */}
                        <div className="bg-muted/30 p-5 rounded-2xl border border-border flex items-start gap-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setIsActive(!isActive)}>
                            <div className={`w-12 h-6 rounded-full flex items-center p-1 shrink-0 mt-0.5 transition-colors ${isActive ? 'bg-green-500 justify-end' : 'bg-muted-foreground/30 justify-start'}`}>
                                <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${isActive ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                    {isActive ? 'Aktiv: Min profil er synlig for bådejere' : 'Skjult: Jeg søger ikke en stikøje p.t.'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Hvis du har fundet en båd, kan du slå din profil fra her, og så forsvinder du fra den offentlige liste.
                                </p>
                            </div>
                        </div>

                        {/* Obligatoriske Felter */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/80 mb-1">
                                    Lille profiltekst <span className="text-destructive">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Fortæl lidt om hvem du er, hvad du brænder for, og hvilken slags togt du drømmer om..."
                                    className="w-full px-5 py-4 bg-background text-foreground text-base rounded-xl border border-border/80 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-merriweather min-h-[160px] resize-y leading-relaxed"
                                    required
                                />
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                    <Info className="w-3.5 h-3.5" /> Husk at dit fornavn og profilbillede automatisk vises sammen med denne tekst.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-foreground/80 mb-1">
                                    Hvornår ønsker du at sejle afsted? <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={availablePeriod}
                                    onChange={(e) => setAvailablePeriod(e.target.value)}
                                    placeholder="F.eks. 'Efteråret 2026', 'Sommerferien', eller 'Fra marts til august næste år'"
                                    className="w-full px-5 py-4 bg-background text-foreground text-base rounded-xl border border-border/80 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-merriweather"
                                    required
                                />
                            </div>
                        </div>

                        {/* Valgfrie Felter */}
                        <div className="pt-8 border-t border-border/40 space-y-6">
                            <h2 className="text-xl font-merriweather font-bold flex items-center gap-2 mb-2">
                                Ekstra Oplysninger
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full uppercase tracking-wider font-sans font-bold">Ikke obligatorisk</span>
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-foreground/80 mb-1">
                                        Sejlererfaring
                                    </label>
                                    <input
                                        type="text"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="F.eks. 'Duelighedsbevis', 'Letøvet sejler'..."
                                        className="w-full px-5 py-4 bg-background text-foreground text-sm rounded-xl border border-border/80 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold uppercase tracking-widest text-foreground/80 mb-1">
                                        Hjemhavn / Område
                                    </label>
                                    <input
                                        type="text"
                                        value={homePort}
                                        onChange={(e) => setHomePort(e.target.value)}
                                        placeholder="F.eks. 'København' eller 'Århus Ø'"
                                        className="w-full px-5 py-4 bg-background text-foreground text-sm rounded-xl border border-border/80 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Bemærk: Dette er klargjort til upload. MultipleImageUpload integration kan tilføjes efter behov */}
                            <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl mt-4">
                                <p className="text-sm font-bold text-primary mb-1">Flere billeder på vej</p>
                                <p className="text-xs text-muted-foreground">Billedkarrusellen for gaster er under udvikling. Lige nu er det dit primære profilbillede der er dit ansigt udadtil.</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border/40">
                            <button
                                type="submit"
                                disabled={isSaving || !description.trim() || !availablePeriod.trim()}
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Gemmer...' : 'Gem Gaste-Profil'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
