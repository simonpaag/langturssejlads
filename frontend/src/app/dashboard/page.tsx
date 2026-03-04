'use client';

import { useState, useEffect } from 'react';
import { Ship, PenLine, LogOut, Type, Image as ImageIcon, Video, FileText, Compass, MapPin, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PostManager from '@/components/dashboard/PostManager';

export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'write' | 'profile' | 'voyages' | 'posts'>('write');
    const [user, setUser] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // Form states
    const [postType, setPostType] = useState('QUICK_TEXT'); // QUICK_TEXT, PHOTO, YOUTUBE, ARTICLE
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Voyage states
    const [voyages, setVoyages] = useState<any[]>([]);
    const [voyageTitle, setVoyageTitle] = useState('');
    const [voyageDescription, setVoyageDescription] = useState('');
    const [voyageFrom, setVoyageFrom] = useState('');
    const [voyageTo, setVoyageTo] = useState('');
    const [voyageImage, setVoyageImage] = useState('');
    const [voyageStart, setVoyageStart] = useState('');
    const [voyageEnd, setVoyageEnd] = useState('');
    const [voyageSeats, setVoyageSeats] = useState('0');
    const [isSubmittingVoyage, setIsSubmittingVoyage] = useState(false);

    // Boat Profile states
    const [boatName, setBoatName] = useState('');
    const [boatDescription, setBoatDescription] = useState('');
    const [boatCoverImage, setBoatCoverImage] = useState('');
    const [boatProfileImage, setBoatProfileImage] = useState('');
    const [boatWebsiteUrl, setBoatWebsiteUrl] = useState('');
    const [boatSocialLinks, setBoatSocialLinks] = useState<{ platform: string, url: string }[]>([]);
    const [isSubmittingBoat, setIsSubmittingBoat] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
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

                if (!res.ok) throw new Error('Not authenticated');

                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error(err);
                localStorage.removeItem('user_token');
                router.push('/login');
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUser();
    }, [router]);

    // Fetch Voyages when user/boat is loaded
    useEffect(() => {
        const fetchVoyages = async () => {
            if (user && user.crewMemberships.length > 0) {
                const boatId = user.crewMemberships[0].boat.id;
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
                try {
                    const res = await fetch(`${apiUrl}/api/voyages/boat/${boatId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setVoyages(data);
                    }
                } catch (err) {
                    console.error("Failed to fetch voyages", err);
                }
            }
        };
        fetchVoyages();
    }, [user]);

    const currentBoat = user?.crewMemberships[0]?.boat;

    // Load initial boat data into state when boat loads
    useEffect(() => {
        if (currentBoat) {
            setBoatName(currentBoat.name || '');
            setBoatDescription(currentBoat.description || '');
            setBoatCoverImage(currentBoat.coverImage || '');
            setBoatProfileImage(currentBoat.profileImage || '');
            setBoatWebsiteUrl(currentBoat.websiteUrl || '');
            setBoatSocialLinks(Array.isArray(currentBoat.socialLinks) ? currentBoat.socialLinks : []);
        }
    }, [currentBoat]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || user.crewMemberships.length === 0) {
            alert("Du er ikke tilknyttet nogen båd!");
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('user_token');
        const boatId = user.crewMemberships[0].boat.id; // Taking the first boat

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    boatId,
                    postType,
                    title: postType === 'ARTICLE' ? title : undefined,
                    content,
                    imageUrl: (postType === 'PHOTO' || postType === 'ARTICLE') ? imageUrl : undefined,
                    youtubeUrl: postType === 'YOUTUBE' ? youtubeUrl : undefined
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to publish post');
            }

            alert("Historien er publiceret på bådens logbog!");
            setTitle('');
            setContent('');
            setImageUrl('');
            setYoutubeUrl('');
        } catch (error: any) {
            alert(`Fejl: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVoyageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || user.crewMemberships.length === 0) return;

        setIsSubmittingVoyage(true);
        const token = localStorage.getItem('user_token');
        const boatId = user.crewMemberships[0].boat.id;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

        try {
            const res = await fetch(`${apiUrl}/api/voyages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    boatId,
                    title: voyageTitle,
                    description: voyageDescription,
                    fromLocation: voyageFrom,
                    toLocation: voyageTo,
                    imageUrl: voyageImage,
                    startDate: voyageStart,
                    endDate: voyageEnd || undefined,
                    availableSeats: Number(voyageSeats)
                })
            });

            if (!res.ok) throw new Error('Kunne ikke oprette togt');

            const newVoyage = await res.json();
            setVoyages([newVoyage, ...voyages]);

            alert('Togtet er oprettet!');
            setVoyageTitle(''); setVoyageDescription(''); setVoyageFrom(''); setVoyageTo(''); setVoyageImage(''); setVoyageStart(''); setVoyageEnd('');
        } catch (error: any) {
            alert(`Fejl: ${error.message}`);
        } finally {
            setIsSubmittingVoyage(false);
        }
    };

    const handleUpdateBoat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBoat) return;

        setIsSubmittingBoat(true);
        const token = localStorage.getItem('user_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

        try {
            const res = await fetch(`${apiUrl}/api/boats/${currentBoat.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: boatName,
                    description: boatDescription,
                    coverImage: boatCoverImage,
                    profileImage: boatProfileImage,
                    websiteUrl: boatWebsiteUrl,
                    socialLinks: boatSocialLinks
                })
            });

            if (!res.ok) throw new Error('Kunne ikke opdatere båden');

            alert('Bådens profil er opdateret!');

            // Reload user data to get updated boat info
            const meRes = await fetch(`${apiUrl}/api/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (meRes.ok) {
                const data = await meRes.json();
                setUser(data.user);
            }

        } catch (error: any) {
            alert(`Fejl: ${error.message}`);
        } finally {
            setIsSubmittingBoat(false);
        }
    };

    if (isLoadingUser) {
        return <div className="h-screen flex items-center justify-center">Henter Kaptajnens kahyt...</div>;
    }

    if (isLoadingUser) {
        return <div className="h-screen flex items-center justify-center">Henter Kaptajnens kahyt...</div>;
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] bg-muted/30">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
                <div className="p-6 border-b border-border">
                    <h2 className="font-bold text-lg mb-1">Kaptajnens Kahyt</h2>
                    <p className="text-sm font-merriweather text-foreground mb-3">{currentBoat?.name || 'Ingen båd'}</p>
                    {currentBoat && (
                        <Link
                            href={`/boats/${currentBoat.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg w-fit"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Offentlig Profil
                        </Link>
                    )}
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('write')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'write' ? 'bg-primary text-white' : 'hover:bg-muted text-foreground'}`}
                    >
                        <PenLine className="h-5 w-5" />
                        <span className="font-medium">Skriv Logbog</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('voyages')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'voyages' ? 'bg-primary text-white' : 'hover:bg-muted text-foreground'}`}
                    >
                        <Compass className="h-5 w-5" />
                        <span className="font-medium">Planlæg Togter</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-muted text-foreground'}`}
                    >
                        <Ship className="h-5 w-5" />
                        <span className="font-medium">Bådens Profil</span>
                    </button>

                    {currentBoat && (
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'posts' ? 'bg-primary text-white' : 'hover:bg-muted text-foreground'}`}
                        >
                            <FileText className="h-5 w-5" />
                            <span className="font-medium">Administrer Logbøger</span>
                        </button>
                    )}
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <button onClick={() => { localStorage.removeItem('user_token'); router.push('/'); window.dispatchEvent(new Event('auth-change')); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors">
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Log ud</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    {activeTab === 'write' ? (
                        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                            <div className="p-6 border-b border-border bg-muted/30">
                                <h1 className="text-2xl font-bold font-merriweather">Offentliggør på Logbogen</h1>
                                <p className="text-muted-foreground mt-1">Hvad har {currentBoat?.name || 'I'} oplevet for nylig?</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">

                                {/* Post Type Selector */}
                                <div>
                                    <label className="block text-sm font-semibold mb-3">Vælg type opslag</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <button type="button" onClick={() => setPostType('QUICK_TEXT')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${postType === 'QUICK_TEXT' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                                            <Type className="w-6 h-6 mb-2" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Kort Tekst</span>
                                        </button>
                                        <button type="button" onClick={() => setPostType('PHOTO')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${postType === 'PHOTO' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                                            <ImageIcon className="w-6 h-6 mb-2" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Hurtigt Billede</span>
                                        </button>
                                        <button type="button" onClick={() => setPostType('YOUTUBE')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${postType === 'YOUTUBE' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                                            <Video className="w-6 h-6 mb-2" />
                                            <span className="text-xs font-bold uppercase tracking-wider">YouTube VLOG</span>
                                        </button>
                                        <button type="button" onClick={() => setPostType('ARTICLE')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${postType === 'ARTICLE' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                                            <FileText className="w-6 h-6 mb-2" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Avis Artikel</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Fields */}
                                {postType === 'ARTICLE' && (
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-semibold mb-2">Overskrift for Artiklen</label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="F.eks. Stormvejr i Biscayen..."
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium placeholder:font-normal"
                                            required
                                        />
                                    </div>
                                )}

                                {(postType === 'PHOTO' || postType === 'ARTICLE') && (
                                    <div>
                                        <label htmlFor="imageUrl" className="block text-sm font-semibold mb-2">{postType === 'ARTICLE' ? 'Coverbillede URL (Valgfri)' : 'Billede URL'}</label>
                                        <input
                                            type="url"
                                            id="imageUrl"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="Indsæt et link til dit billede..."
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            required={postType === 'PHOTO'}
                                        />
                                    </div>
                                )}

                                {postType === 'YOUTUBE' && (
                                    <div>
                                        <label htmlFor="youtubeUrl" className="block text-sm font-semibold mb-2">YouTube Embed Link</label>
                                        <input
                                            type="url"
                                            id="youtubeUrl"
                                            value={youtubeUrl}
                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                            placeholder="F.eks. https://www.youtube.com/embed/jfKfPfyJRdk"
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="content" className="block text-sm font-semibold mb-2">{postType === 'ARTICLE' ? 'Den fulde artikel' : 'Tekst til opslaget'}</label>
                                    <textarea
                                        id="content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder={postType === 'QUICK_TEXT' ? "Hvad sker der lige nu?" : "Beskriv oplevelsen..."}
                                        rows={postType === 'ARTICLE' ? 14 : 4}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
                                    <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-sm bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
                                        {isSubmitting ? 'Sender til skyen...' : 'Udgiv på Logbogen'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : activeTab === 'voyages' ? (
                        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                            <div className="p-6 border-b border-border bg-muted/30">
                                <h1 className="text-2xl font-bold font-merriweather">Planlæg Nyt Togt</h1>
                                <p className="text-muted-foreground mt-1">Hvor går rejsen hen, og hvem skal med?</p>
                            </div>
                            <form onSubmit={handleVoyageSubmit} className="p-6 flex flex-col gap-6">
                                {/* Title */}
                                <div>
                                    <label htmlFor="voyageTitle" className="block text-sm font-semibold mb-2">Togtets Navn</label>
                                    <input type="text" id="voyageTitle" value={voyageTitle} onChange={(e) => setVoyageTitle(e.target.value)} placeholder="F.eks. Vær med på rejsen fra Sydney til Thailand..." className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium" required />
                                </div>
                                {/* From / To */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="voyageFrom" className="block text-sm font-semibold mb-2">Fra Lokation</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                            <input type="text" id="voyageFrom" value={voyageFrom} onChange={(e) => setVoyageFrom(e.target.value)} placeholder="F.eks. Darling Harbour" className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="voyageTo" className="block text-sm font-semibold mb-2">Til Lokation</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                            <input type="text" id="voyageTo" value={voyageTo} onChange={(e) => setVoyageTo(e.target.value)} placeholder="F.eks. Kings Port Phuket" className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required />
                                        </div>
                                    </div>
                                </div>
                                {/* Dates and Seats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="voyageStart" className="block text-sm font-semibold mb-2">Start Dato</label>
                                        <input type="date" id="voyageStart" value={voyageStart} onChange={(e) => setVoyageStart(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required />
                                    </div>
                                    <div>
                                        <label htmlFor="voyageEnd" className="block text-sm font-semibold mb-2">Slut Dato (Valgfri)</label>
                                        <input type="date" id="voyageEnd" value={voyageEnd} onChange={(e) => setVoyageEnd(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                    </div>
                                    <div>
                                        <label htmlFor="voyageSeats" className="block text-sm font-semibold mb-2">Ledige Pladser</label>
                                        <input type="number" min="0" id="voyageSeats" value={voyageSeats} onChange={(e) => setVoyageSeats(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                    </div>
                                </div>
                                {/* Image */}
                                <div>
                                    <label htmlFor="voyageImage" className="block text-sm font-semibold mb-2">Kort / Coverbillede (URL - Valgfrit)</label>
                                    <input type="url" id="voyageImage" value={voyageImage} onChange={(e) => setVoyageImage(e.target.value)} placeholder="Indsæt link til billede af et kort eller ruten..." className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                </div>
                                {/* Description */}
                                <div>
                                    <label htmlFor="voyageDescription" className="block text-sm font-semibold mb-2">Beskiv ruten (F.eks: Vær med på togtet til Thailand...)</label>
                                    <textarea id="voyageDescription" value={voyageDescription} onChange={(e) => setVoyageDescription(e.target.value)} placeholder="Beskriv turen, og fremhæv hvem der sejler med..." rows={5} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed" required />
                                </div>
                                <div className="flex justify-end pt-4 border-t border-border mt-2">
                                    <button type="submit" disabled={isSubmittingVoyage} className="px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-sm bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
                                        {isSubmittingVoyage ? 'Opretter...' : 'Opret Togt'}
                                    </button>
                                </div>
                            </form>

                            {/* List of active voyages */}
                            <div className="p-6 border-t border-border bg-muted/30">
                                <h3 className="text-lg font-bold mb-4 font-merriweather">Aktuelle & Tidligere Togter</h3>
                                {voyages.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">Der er ingen togter endnu.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {voyages.map((v) => (
                                            <div key={v.id} className="bg-card border md:flex-row flex-col flex border-border rounded-xl p-4 gap-4 items-center justify-between shadow-sm">
                                                <div>
                                                    <h4 className="font-bold">{v.title}</h4>
                                                    <p className="text-sm text-foreground my-1">{v.fromLocation} &rarr; {v.toLocation}</p>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                        <span>{new Date(v.startDate).toLocaleDateString('da-DK')}</span>
                                                        {v.endDate && <span>- {new Date(v.endDate).toLocaleDateString('da-DK')}</span>}
                                                    </div>
                                                </div>
                                                <Link href={`/boats/${currentBoat?.slug}/voyages/${v.slug}`} className="px-4 py-2 border-2 border-primary/20 rounded-lg text-sm font-bold text-primary hover:bg-primary/5 transition-colors whitespace-nowrap">
                                                    Vis Invitation
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'profile' ? (
                        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                            <div className="p-6 border-b border-border bg-muted/30">
                                <h1 className="text-2xl font-bold font-merriweather">Rediger Bådens Profil</h1>
                                <p className="text-muted-foreground mt-1">Opdater hvordan {currentBoat?.name} præsenteres på hjemmesiden.</p>
                            </div>

                            <form onSubmit={handleUpdateBoat} className="p-6 flex flex-col gap-6">
                                <div>
                                    <label htmlFor="boatName" className="block text-sm font-semibold mb-2">Bådens Navn</label>
                                    <input
                                        type="text"
                                        id="boatName"
                                        value={boatName}
                                        onChange={(e) => setBoatName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Ændres navnet, opdateres URL'en automatisk.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="boatCoverImage" className="block text-sm font-semibold mb-2">Coverbillede (URL til topbillede)</label>
                                        <input
                                            type="url"
                                            id="boatCoverImage"
                                            value={boatCoverImage}
                                            onChange={(e) => setBoatCoverImage(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="boatProfileImage" className="block text-sm font-semibold mb-2">Profilbillede (F.eks logo - URL)</label>
                                        <input
                                            type="url"
                                            id="boatProfileImage"
                                            value={boatProfileImage}
                                            onChange={(e) => setBoatProfileImage(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="boatWebsiteUrl" className="block text-sm font-semibold mb-2">Hjemmeside (URL - Valgfrit)</label>
                                    <input
                                        type="url"
                                        id="boatWebsiteUrl"
                                        value={boatWebsiteUrl}
                                        onChange={(e) => setBoatWebsiteUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                <div className="p-5 border border-border rounded-2xl bg-muted/10">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                                        <div>
                                            <h3 className="block text-sm font-semibold">Sociale Medier / Andre Links</h3>
                                            <p className="text-xs text-muted-foreground mt-1">Tilføj op til flere links til blogs, kanaler og netværk.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setBoatSocialLinks([...boatSocialLinks, { platform: '', url: '' }])}
                                            className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest bg-primary/10 hover:bg-primary/20 transition-colors px-4 py-2 rounded-lg w-fit"
                                        >
                                            + Tilføj Link
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {boatSocialLinks.map((link, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row gap-3">
                                                <input
                                                    type="text"
                                                    value={link.platform}
                                                    onChange={(e) => {
                                                        const newLinks = [...boatSocialLinks];
                                                        newLinks[index].platform = e.target.value;
                                                        setBoatSocialLinks(newLinks);
                                                    }}
                                                    placeholder="F.eks. Instagram"
                                                    className="sm:w-1/3 px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                                    required
                                                />
                                                <input
                                                    type="url"
                                                    value={link.url}
                                                    onChange={(e) => {
                                                        const newLinks = [...boatSocialLinks];
                                                        newLinks[index].url = e.target.value;
                                                        setBoatSocialLinks(newLinks);
                                                    }}
                                                    placeholder="https://..."
                                                    className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newLinks = [...boatSocialLinks];
                                                        newLinks.splice(index, 1);
                                                        setBoatSocialLinks(newLinks);
                                                    }}
                                                    className="p-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors border border-transparent hover:border-destructive/20 self-end sm:self-auto"
                                                    title="Slet link"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                        {boatSocialLinks.length === 0 && (
                                            <div className="text-sm text-muted-foreground/70 p-6 border border-dashed rounded-xl border-border/60 text-center bg-transparent">
                                                Tryk på knappen ovenfor for at tilføje et netværk.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="boatDescription" className="block text-sm font-semibold mb-2">Beskrivelse af Båden</label>
                                    <textarea
                                        id="boatDescription"
                                        value={boatDescription}
                                        onChange={(e) => setBoatDescription(e.target.value)}
                                        rows={6}
                                        placeholder="Hvad er det for en båd? Hvor lang er den, hvad er jeres sejladsfilosofi?"
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end pt-4 border-t border-border mt-2">
                                    <button type="submit" disabled={isSubmittingBoat} className="px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-sm bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
                                        {isSubmittingBoat ? 'Gemmer ændringer...' : 'Gem Profil'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : activeTab === 'posts' ? (
                        <PostManager
                            boat={currentBoat}
                            onEditPost={(post) => alert('Redigerings-vinduet åbner snart, i øjeblikket kan du kun udgive og gemme som kladde!')}
                        />
                    ) : null}
                </div>
            </main>
        </div>
    );
}
