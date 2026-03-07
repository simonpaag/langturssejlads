'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, LogOut, Bell, Ship, CheckSquare } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function ProfilePage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [wantsNewsletter, setWantsNewsletter] = useState(true);
    const [subscribedBoatIds, setSubscribedBoatIds] = useState<number[]>([]);
    const [allBoats, setAllBoats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

                // Fetch User data including subscriptions
                const res = await fetch(`${apiUrl}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Fetch All Boats for the dropdown/list
                const boatsRes = await fetch(`${apiUrl}/api/boats`);

                if (res.ok && boatsRes.ok) {
                    const data = await res.json();
                    const boatsData = await boatsRes.json();

                    setName(data.user.name || '');
                    setProfileImage(data.user.profileImage || '');
                    setWantsNewsletter(data.user.wantsNewsletter ?? true);
                    setSubscribedBoatIds(data.user.subscriptions?.map((sub: any) => sub.boatId) || []);
                    setAllBoats(boatsData);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Kunne ikke hente profil:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setIsSaving(true);
        const token = localStorage.getItem('user_token');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

            // 1. Gem profilinfo
            const resProfile = await fetch(`${apiUrl}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, profileImage: profileImage || null }),
            });

            // 2. Gem notifikationsindstillinger
            const resNotif = await fetch(`${apiUrl}/api/auth/notifications`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ wantsNewsletter, boatIds: subscribedBoatIds })
            });

            if (resProfile.ok && resNotif.ok) {
                setMessage({ text: 'Profil og indstillinger er succesfuldt opdateret!', type: 'success' });
                // Trig menuen til at opdatere sig
                window.dispatchEvent(new Event('userStateChange'));
            } else {
                setMessage({ text: 'Noget gik galt under gemning. Prøv igen.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Netværksfejl under opdatering.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('admin_token');
        window.dispatchEvent(new Event('auth-change'));
        window.dispatchEvent(new Event('userStateChange'));
        router.push('/');
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Læser skibsruller...</div>;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-muted/20 py-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 pl-4">
                    <h1 className="text-4xl font-merriweather font-black text-foreground mb-2">Din Profil</h1>
                    <p className="text-muted-foreground text-lg">Administrer din fremtoning på platformens operationsstavler.</p>
                </div>

                <div className="bg-card text-card-foreground rounded-3xl shadow-xl border border-border/80 overflow-hidden relative">

                    {/* Hovedindhold form */}
                    <form onSubmit={handleSave} className="p-8 md:p-10 flex flex-col gap-8">
                        {message.text && (
                            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                                <span className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-primary' : 'bg-destructive'} animate-pulse`}></span>
                                {message.text}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                            <div className="flex-1 w-full space-y-2">
                                <ImageUpload
                                    onUploadSuccess={(url) => setProfileImage(url)}
                                    currentImage={profileImage}
                                    label="Dit profilbillede"
                                    aspectRatio="square"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-border/40">
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-foreground/80">
                                Dit Offentlige Navn <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-4 bg-background text-foreground text-lg rounded-xl border border-border/80 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-merriweather"
                                required
                            />
                        </div>

                        {/* Notifikationer Sektion */}
                        <div className="pt-8 border-t border-border/40 space-y-6">
                            <h2 className="text-xl font-merriweather font-bold flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary" />
                                Notifikations-indstillinger
                            </h2>

                            {/* Nyhedsbrev Toggle */}
                            <div className="bg-muted/10 p-5 rounded-2xl border border-border flex items-start gap-4 cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setWantsNewsletter(!wantsNewsletter)}>
                                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${wantsNewsletter ? 'bg-primary text-primary-foreground' : 'border-2 border-muted-foreground/30 text-transparent'}`}>
                                    <CheckSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Modtag Nyhedsbrev</p>
                                    <p className="text-xs text-muted-foreground mt-1">Få en samlet opdatering én gang om ugen med de vigtigste nyheder og spændende historier fra platformen direkte i din indbakke.</p>
                                </div>
                            </div>

                            {/* Båd Følger Select */}
                            <div className="bg-muted/10 p-5 rounded-2xl border border-border">
                                <div className="mb-4">
                                    <p className="font-bold text-sm flex items-center gap-2"><Ship className="w-4 h-4 text-primary" /> Følg Specifikke Både</p>
                                    <p className="text-xs text-muted-foreground mt-1">Vælg hvilke både du ønsker at få besked fra, når de udgiver nye logbøger eller billeder. Du får en notifikation på mail hver gang der er nyt fra det eller de skibe du vælger.</p>
                                </div>

                                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-2 border border-border/50 bg-background rounded-xl p-3">
                                    {allBoats.length === 0 && <p className="text-xs text-muted-foreground p-2">Indlæser både...</p>}
                                    {allBoats.map(boat => {
                                        const isSubscribed = subscribedBoatIds.includes(boat.id);
                                        return (
                                            <div
                                                key={boat.id}
                                                onClick={() => {
                                                    if (isSubscribed) setSubscribedBoatIds(prev => prev.filter(id => id !== boat.id));
                                                    else setSubscribedBoatIds(prev => [...prev, boat.id]);
                                                }}
                                                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors border ${isSubscribed ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' : 'bg-transparent border-transparent hover:bg-muted'}`}
                                            >
                                                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${isSubscribed ? 'bg-primary text-primary-foreground' : 'border-2 border-muted-foreground/30 text-transparent'}`}>
                                                    <CheckSquare className="w-4 h-4" />
                                                </div>
                                                <span className={`text-sm ${isSubscribed ? 'font-bold' : 'font-medium'}`}>{boat.name}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border/40">
                            <button
                                type="submit"
                                disabled={isSaving || !name.trim()}
                                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Gemmer kistebrevet...' : 'Gem Profilindstillinger'}
                            </button>
                        </div>
                    </form>

                    {/* Farlig Zone / Bund */}
                    <div className="bg-muted/30 px-8 py-6 border-t border-border flex justify-between items-center sm:flex-row flex-col gap-4">
                        <p className="text-sm text-muted-foreground font-medium">Brug for at forlade skuden for en stund?</p>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-sm w-full sm:w-auto justify-center"
                        >
                            <LogOut className="w-4 h-4" />
                            Log Ud
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
