'use client';

import Link from 'next/link';
import { UserCircle, LogOut, Compass, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import FifthElement from '@/components/FifthElement';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
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
            <div className="border-b border-border py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center max-w-7xl mx-auto relative z-[60]">

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
                <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    <div className="hidden md:block">
                        <SearchBar />
                    </div>
                    {(isLoggedIn) ? (
                        <div className="flex items-center gap-3 sm:gap-4">
                            {user?.isSystemAdmin && (
                                <Link href="/admin" className="hidden sm:flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors" title="PosseidonAdmin">
                                    <span className="bg-primary/10 p-1.5 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-alert"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                                    </span>
                                    <span className="hidden lg:inline text-[10px] font-black tracking-widest uppercase">Admin</span>
                                </Link>
                            )}
                            <Link href="/profil" className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <div className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] overflow-hidden rounded-full border-2 border-primary/20 bg-muted flex items-center justify-center shadow-sm relative">
                                    {user?.profileImage ? (
                                        <img src={user.profileImage} alt="Profil" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserCircle className="w-6 h-6 text-muted-foreground opacity-60" />
                                    )}
                                </div>
                            </Link>
                        </div>
                    ) : isAdmin ? (
                        <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 bg-muted/50 hover:bg-destructive/10 hover:text-destructive rounded-full transition-all">
                            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log ud</span>
                        </button>
                    ) : (
                        <>
                            <Link href="/register" className="hidden sm:flex items-center text-muted-foreground hover:text-foreground transition-colors">
                                Opret konto
                            </Link>
                            <Link href="/login" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-md">
                                <UserCircle className="h-[18px] w-[18px]" />
                                <span>Log ind</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown Menu (Overlay) */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-6 shadow-2xl z-40 flex flex-col gap-5 animate-in slide-in-from-top-4 fade-in duration-200">
                    <div className="mb-2">
                        <SearchBar />
                    </div>
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
                    {user?.isSystemAdmin && (
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-3 mt-2 border-t border-border pt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                            PosseidonAdmin
                        </Link>
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

            {/* Main Masthead - Only show on Home Page (/) */}
            {pathname === "/" && (
                <div className="relative w-full overflow-hidden bg-black mb-0 shadow-2xl">
                    {/* Background Image */}
                    <img
                        src="/images/hero-sunset.jpg"
                        alt="Hero solnedgang"
                        className="absolute inset-0 w-full h-full object-cover object-[80%_75%] md:object-[center_65%] opacity-[0.65]"
                    />
                    {/* Subtle Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-48 mt-[15%] md:mt-12 flex flex-col items-center justify-center text-center">
                        <FifthElement className="mb-6 text-white/90 drop-shadow-md" />
                        <Link href="/" className="group drop-shadow-lg">
                            <h1 className="font-merriweather font-black text-5xl md:text-7xl xl:text-8xl tracking-tighter text-white group-hover:text-primary transition-colors">
                                Langturssejlads
                            </h1>
                        </Link>
                        <p className="mt-6 text-sm md:text-base font-bold uppercase tracking-widest text-zinc-300 max-w-2xl balance drop-shadow-md">
                            Følg de danske sejlere på langfart på de syv verdenshave.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
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
                </div>
            )}

            {/* Navigation Links */}
            <div className="border-y border-border/60 shadow-sm sticky top-0 bg-background/80 backdrop-blur-xl z-50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 justify-center items-center space-x-8 md:space-x-12 overflow-x-auto no-scrollbar">
                        {pathname !== "/" && (
                            <Link href="/" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                                Forside
                            </Link>
                        )}
                        <Link href="/boats" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Både til søs
                        </Link>
                        <Link href="/togter" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Togter
                        </Link>
                        <Link href="/faq" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Lær om langfart
                        </Link>
                        {(isAdmin || (isLoggedIn && user && user.crewMemberships && user.crewMemberships.length > 0)) && (
                            <Link href="/dashboard" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                                "Under dæk"
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
