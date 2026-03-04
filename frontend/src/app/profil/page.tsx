'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, Camera, Save, LogOut } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [profileImage, setProfileImage] = useState('');
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
                const res = await fetch(`${apiUrl}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setName(data.user.name || '');
                    setProfileImage(data.user.profileImage || '');
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
            const res = await fetch(`${apiUrl}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, profileImage: profileImage || null }),
            });

            if (res.ok) {
                setMessage({ text: 'Profilen er succesfuldt opdateret! Opdater siden hvis billedet for oven driller.', type: 'success' });
                // Trig menuen til at opdatere sig
                window.dispatchEvent(new Event('userStateChange'));
            } else {
                const err = await res.json();
                setMessage({ text: err.error || 'Kunne ikke opdatere profil.', type: 'error' });
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
                            {/* Avatar Preview */}
                            <div className="relative group shrink-0">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg bg-muted flex items-center justify-center relative z-10">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserCircle className="w-16 h-16 text-muted-foreground opacity-50" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            <div className="flex-1 w-full space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-widest text-foreground/80">
                                    Profilbillede URL
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Camera className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="url"
                                        value={profileImage}
                                        onChange={(e) => setProfileImage(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-background text-foreground text-sm rounded-xl border border-border/80 focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/60"
                                        placeholder="https://eksempel.dk/mit-billede.jpg"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground pt-1 px-1">Tip: Find et godt billede, højreklik og vælg "Kopier Billedadresse".</p>
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

                        <div className="pt-6">
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
                            className="flex items-center gap-2 px-6 py-3 bg-white text-destructive border border-destructive/20 hover:bg-destructive hover:text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-sm w-full sm:w-auto justify-center"
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
