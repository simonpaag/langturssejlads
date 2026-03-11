'use client';

import Link from 'next/link';
import { UserCircle, LogOut, Compass, Menu, X, Settings, Ship, PenLine, Mail, Users, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import FifthElement from '@/components/FifthElement';
import { getFallbackImage } from '@/utils/fallbackImage';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<{ id: number; name: string; profileImage?: string | null; isSystemAdmin?: boolean; crewMemberships?: any[] } | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const userToken = localStorage.getItem('user_token');
            const adminToken = localStorage.getItem('admin_token');
            setIsLoggedIn(!!userToken);
            setIsAdmin(!!adminToken);

            // Hent brugerdata hvis logget ind som almindelig bruger
            if (userToken) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
                    const res = await fetch(`${apiUrl}/api/auth/me`, {
                        headers: { 'Authorization': `Bearer ${userToken}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data.user);
                    }
                } catch (e) {
                    console.error('Failed to fetch user data for Navbar');
                }
            } else {
                setUser(null);
            }
        };

        checkAuth();
        window.addEventListener('auth-change', checkAuth);
        window.addEventListener('userStateChange', checkAuth); // Opdateret auto-login lytter
        return () => {
            window.removeEventListener('auth-change', checkAuth);
            window.removeEventListener('userStateChange', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('admin_token');
        setIsLoggedIn(false);
        setIsAdmin(false);
        window.dispatchEvent(new Event('auth-change'));
        router.push('/');
    };

    return (
        <nav className="bg-background relative">
            {/* Top utility bar */}
            <div className="relative z-[60] bg-background">
                <div className="border-b border-border py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center max-w-7xl mx-auto">

                    {/* Mobile Left: Menu Toggle */}
                    <button
                        className="md:hidden p-2 -ml-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Desktop Left: Links */}
                    <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        <Link href="/" className="font-merriweather font-black text-xl text-foreground hover:opacity-80 transition-opacity tracking-tight lowercase">
                            langturssejlads.dk
                        </Link>
                        <span className="text-border">|</span>
                        <Link href="/om" className="hover:text-foreground transition-colors">Om Langturssejlads</Link>
                        <span className="text-border">|</span>
                        <Link href="/annoncor" className="hover:text-foreground transition-colors">Bliv annoncør</Link>
                    </div>

                    {/* Right: Auth */}
                    <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest flex-1 justify-end">
                        <div className="w-[140px] xs:w-[180px] sm:w-auto">
                            <SearchBar />
                        </div>
                        {(isLoggedIn) ? (
                            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                                {user?.isSystemAdmin && (
                                    <Link href="/admin" className="hidden sm:flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors" title="PosseidonAdmin">
                                        <span className="bg-primary/10 p-1.5 rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-alert"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                                        </span>
                                        <span className="hidden lg:inline text-[10px] font-black tracking-widest uppercase">Admin</span>
                                    </Link>
                                )}
                                {(user?.isSystemAdmin || (user && user.crewMemberships && user.crewMemberships.length > 0)) && (
                                    <Link href="/dashboard" className="hidden sm:flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full transition-colors" title="Under Dæk (Dashboard)">
                                        <Settings className="w-4 h-4" />
                                        <span className="font-bold tracking-widest uppercase text-[10px]">Under Dæk</span>
                                    </Link>
                                )}
                                <Link href="/profil" className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <div className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] overflow-hidden rounded-full border-2 border-primary/20 bg-muted flex items-center justify-center shadow-sm relative">
                                        {user?.profileImage ? (
                                            <img src={user.profileImage} alt="Profil" className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={getFallbackImage(user?.id, 'avatar')} alt="Profil" className="w-full h-full object-cover opacity-80" />
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ) : isAdmin ? (
                            <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 bg-muted/50 hover:bg-destructive/10 hover:text-destructive rounded-full transition-all shrink-0">
                                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log ud</span>
                            </button>
                        ) : (
                            <div className="flex gap-2 items-center shrink-0">
                                <Link href="/register" className="hidden sm:flex items-center text-muted-foreground hover:text-foreground transition-colors">
                                    Opret konto
                                </Link>
                                <Link href="/login" className="flex items-center gap-2 bg-primary text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-md">
                                    <UserCircle className="h-[18px] w-[18px]" />
                                    <span className="hidden sm:inline">Log ind</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Dropdown Menu (Overlay) */}
                <div className="relative z-[50]">
                    {isMenuOpen && (
                        <div className="md:hidden absolute top-0 left-0 w-full bg-background border-b border-border p-6 shadow-2xl flex flex-col gap-5 animate-in slide-in-from-top-4 fade-in duration-200">
                            {pathname !== "/" && (
                                <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary flex items-center gap-3">
                                    <Compass className="w-5 h-5 text-primary" /> Forside
                                </Link>
                            )}
                            <Link href="/om" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary flex items-center gap-3">
                                Om Langturssejlads
                            </Link>
                            <Link href="/annoncor" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary flex items-center gap-3">
                                Bliv annoncør
                            </Link>
                            <Link href="/gaster" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary flex items-center gap-3">
                                <UserCircle className="w-5 h-5 text-primary" /> Gaster
                            </Link>
                            {user?.isSystemAdmin && (
                                <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-3 mt-2 border-t border-border pt-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                                    PosseidonAdmin
                                </Link>
                            )}
                            {(user?.isSystemAdmin || (user && user.crewMemberships && user.crewMemberships.length > 0)) && (
                                <div className="flex flex-col gap-3 mt-2 border-t border-border pt-4">
                                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-3">
                                        <Settings className="w-5 h-5 text-primary" />
                                        Under Dæk
                                    </Link>
                                    
                                    {/* Dashboard Submenu i Burgermenu for mobil, når man er på dashboardet */}
                                    {pathname.startsWith('/dashboard') && (
                                        <div className="flex flex-col gap-3 pl-8 mt-2 border-l-2 border-primary/20">
                                            <button onClick={() => { router.push('/dashboard?tab=write'); setIsMenuOpen(false); }} className={`text-sm font-medium flex items-center gap-2 ${searchParams.get('tab') === 'write' || !searchParams.get('tab') ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                                                <PenLine className="w-4 h-4" /> Skriv Logbog
                                            </button>
                                            <button onClick={() => { router.push('/dashboard?tab=voyages'); setIsMenuOpen(false); }} className={`text-sm font-medium flex items-center gap-2 ${searchParams.get('tab') === 'voyages' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                                                <Compass className="w-4 h-4" /> Planlæg Togter
                                            </button>
                                            <button onClick={() => { router.push('/dashboard?tab=profile'); setIsMenuOpen(false); }} className={`text-sm font-medium flex items-center gap-2 ${searchParams.get('tab') === 'profile' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                                                <Ship className="w-4 h-4" /> Bådens Profil
                                            </button>
                                            <button onClick={() => { router.push('/dashboard?tab=inbox'); setIsMenuOpen(false); }} className={`text-sm font-medium flex items-center gap-2 ${searchParams.get('tab') === 'inbox' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                                                <Mail className="w-4 h-4" /> Indbakke
                                            </button>
                                            <button onClick={() => { router.push('/dashboard?tab=crew'); setIsMenuOpen(false); }} className={`text-sm font-medium flex items-center gap-2 ${searchParams.get('tab') === 'crew' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                                                <Users className="w-4 h-4" /> Besætning
                                            </button>
                                            <button onClick={() => { router.push('/dashboard?tab=posts'); setIsMenuOpen(false); }} className={`text-sm font-medium flex items-center gap-2 ${searchParams.get('tab') === 'posts' ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                                                <FileText className="w-4 h-4" /> Administrer Logbøger
                                            </button>
                                            <Link href="/profil/gast" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium flex items-center gap-2 text-foreground hover:text-primary mt-2">
                                                <UserCircle className="w-4 h-4" /> Mit Gasteopslag
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                            {(!isLoggedIn && !isAdmin) && (
                                <div className="pt-4 mt-2 border-t border-border sm:hidden">
                                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="w-full text-center block px-4 py-3 bg-muted rounded-xl text-xs font-bold uppercase tracking-widest text-foreground hover:bg-muted/80 transition-colors">
                                        Opret ny konto
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Links - Hides on Mobile to make room since they are in the hamburger menu */}
            <div className="hidden md:block border-y border-border/60 shadow-sm sticky top-0 bg-background/95 backdrop-blur-xl z-[70] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-12 sm:h-14 justify-start sm:justify-center items-center space-x-6 sm:space-x-12 overflow-x-auto no-scrollbar">
                        {pathname !== "/" && (
                            <Link href="/" className="shrink-0 text-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors whitespace-nowrap">
                                Forside
                            </Link>
                        )}
                        <Link href="/boats" className="shrink-0 text-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors whitespace-nowrap">
                            Både til søs
                        </Link>
                        <Link href="/togter" className="shrink-0 text-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors whitespace-nowrap">
                            Togter
                        </Link>
                        <Link href="/gaster" className="shrink-0 text-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors whitespace-nowrap">
                            Gaster
                        </Link>
                        <Link href="/faq" className="shrink-0 text-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors whitespace-nowrap">
                            <span className="hidden sm:inline">Lær om langfart</span>
                            <span className="sm:hidden">Lær mere</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Masthead - Only show on Home Page (/) */}
            {pathname === "/" && (
                <div className="relative w-full overflow-hidden bg-black mb-0 shadow-2xl">
                    {/* Background Image */}
                    <img
                        src="/images/hero-sunset.jpg"
                        alt="Hero solnedgang"
                        className="absolute inset-0 w-full h-full object-cover object-[80%_75%] md:object-[center_65%] opacity-[0.65]"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background via-background/20 to-transparent"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-32 lg:py-48 mt-[15%] md:mt-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 w-full">
                            <FifthElement className="mb-6 text-white/90 drop-shadow-md" />
                            <Link href="/" className="group drop-shadow-lg">
                                <h1 className="font-merriweather font-black text-5xl md:text-7xl xl:text-8xl tracking-tighter text-white group-hover:text-primary transition-colors">
                                    Langturssejlads
                                </h1>
                            </Link>
                            <p className="mt-6 text-sm md:text-base font-bold uppercase tracking-widest text-zinc-300 max-w-2xl balance drop-shadow-md">
                                Følg de danske sejlere på langfart på de syv verdenshave.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-8">
                                <a
                                    href="https://www.facebook.com/groups/Langturssejlads/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-6 py-2.5 text-sm bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook Gruppe
                                </a>
                                <Link
                                    href="/register"
                                    className="w-full sm:w-auto px-6 py-2.5 text-sm bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all border border-transparent shadow-lg"
                                >
                                    Vær med
                                </Link>
                            </div>
                        </div>

                        {/* Midlertidig Call-To-Action Banner - Post-it style */}
                        <div className="w-full max-w-md lg:w-[450px] shrink-0 bg-yellow-400/95 dark:bg-yellow-500/90 text-yellow-950 backdrop-blur-md shadow-2xl rounded-2xl p-8 transform lg:rotate-3 lg:hover:rotate-0 transition-all duration-300 flex flex-col gap-5 border border-yellow-300">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-950 text-yellow-400 shadow-inner shrink-0">
                                    <Ship className="w-6 h-6" />
                                </span>
                                <h2 className="text-3xl font-bold font-merriweather leading-tight text-blue-500 drop-shadow-sm">
                                    Så er Langturssejlads live! 🎉
                                </h2>
                            </div>
                            <p className="text-base leading-relaxed font-medium">
                                Vi mangler flere både og gaster. Hvis du har en båd eller noget indhold, du gerne vil have hjælp med at publicere, står vi klar til at hjælpe.
                            </p>
                            <div className="mt-2 flex flex-col items-center gap-3">
                                <Link href="/kontakt" className="w-full bg-yellow-950 text-yellow-400 px-6 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-center shadow-lg">
                                    Kontakt Os
                                </Link>
                                <Link href="/register" className="text-sm font-semibold font-merriweather text-yellow-950/70 hover:text-blue-600 transition-colors uppercase tracking-wide">
                                    eller opret dig
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
