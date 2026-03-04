'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sailboat } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function CreateBoatPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('user_token');
        if (!storedToken) {
            router.push('/login');
        } else {
            setToken(storedToken);
        }
    }, [router]);

    const handleCreateBoat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setError('');
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/boats`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, coverImage, profileImage }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Kunne ikke oprette båden');

            // Båden er nu oprettet, og Kaptajn-rollenn (`BOAT_ADMIN`) er blevet tildelt i backenden
            // Vi sender brugeren direkte i kahytten!
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return <div className="min-h-screen flex items-center justify-center">Finder fortøjninger...</div>;

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 bg-muted/10 relative overflow-hidden">

            {/* Subtle background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-lg relative z-10 animate-fade-in-up">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#0f2c59] text-white mb-6 shadow-xl border-4 border-white/10">
                        <Sailboat className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-merriweather font-black text-foreground mb-3">
                        Registrer dit skib
                    </h1>
                    <p className="text-muted-foreground text-lg px-4">
                        Tilmeld båden, skriv logbog og slip fortøjningerne! Resten kan vi udfylde i kaptajnens kontrolrum bagefter.
                    </p>
                </div>

                <div className="bg-card text-card-foreground p-8 md:p-10 rounded-3xl shadow-xl border border-border/80 ring-1 ring-border/30">
                    {error && (
                        <div className="mb-6 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleCreateBoat} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-foreground/90 uppercase tracking-widest text-[11px]">Bådens Navn<span className="text-red-500 ml-1">*</span></label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-4 bg-background text-foreground text-lg rounded-xl border-2 border-border/50 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground font-merriweather"
                                placeholder="f.eks. S/Y Nordstjernen"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-foreground/90 uppercase tracking-widest text-[11px]">Kort Beskrivelse (Frivillig)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-5 py-4 bg-background text-foreground rounded-xl border-2 border-border/50 focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground min-h-[120px] resize-y"
                                placeholder="Hvor er vi på vej hen? Hvad er båden for en type?"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <ImageUpload
                                    onUploadSuccess={setCoverImage}
                                    currentImage={coverImage}
                                    label="Coverbillede til Båden (Valgfrit)"
                                    aspectRatio="video"
                                />
                            </div>
                            <div className="flex-1">
                                <ImageUpload
                                    onUploadSuccess={setProfileImage}
                                    currentImage={profileImage}
                                    label="Bådens Profilbillede (Logo - Valgfrit)"
                                    aspectRatio="square"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !name}
                            className="w-full bg-[#0f2c59] hover:bg-[#1a4175] text-white font-bold px-8 py-5 rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 text-lg flex justify-center items-center gap-3 mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Klargør dækket...
                                </>
                            ) : (
                                'Opret og gå til Kahytten'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-muted-foreground/60 text-xs mt-8">
                    Du gøres automatisk til Kaptajn for dette skib og får tildelt administratoransvar.
                </p>

            </div>
        </div>
    );
}
