'use client';

import Link from 'next/link';
import { UserCircle, LogOut, Compass, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const [user, setUser] = useState<{ id: number; name: string; profileImage?: string | null } | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const userToken = localStorage.getItem('user_token');
            const adminToken = localStorage.getItem('admin_token');
            setIsLoggedIn(!!userToken);
            setIsAdmin(!!adminToken);

            // Hent brugerdata hvis logget ind som almindelig bruger
            if (userToken) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
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
            <div className="border-b border-border py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center max-w-7xl mx-auto relative z-50">

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
                    <a href="https://langturssejlads.dk/" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">Langturssejlads.dk</a>
                    <span className="text-border">|</span>
                    <Link href="/om" className="hover:text-foreground transition-colors">Om Langturssejlads</Link>
                    <span className="text-border">|</span>
                    <Link href="/annoncor" className="hover:text-foreground transition-colors">Bliv annoncør</Link>
                </div>

                {/* Right: Auth */}
                <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    {(isLoggedIn) ? (
                        <Link href="/profil" className="group flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] overflow-hidden rounded-full border-2 border-primary/20 bg-muted flex items-center justify-center shadow-sm relative">
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt="Profil" className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircle className="w-6 h-6 text-muted-foreground opacity-60" />
                                )}
                            </div>
                        </Link>
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
                    {pathname !== "/" && (
                        <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary flex items-center gap-3">
                            <Compass className="w-5 h-5 text-primary" /> Forside
                        </Link>
                    )}
                    <Link href="/om" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary flex items-center gap-3">
                        Om Langturssejlads
                    </Link>
                    <Link href="/laer-om-langturssejlads" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary flex items-center gap-3">
                        Lær om Langturssejlads
                    </Link>
                    <Link href="/annoncor" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary flex items-center gap-3">
                        Bliv annoncør
                    </Link>
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
                        <Link href="/" className="group drop-shadow-lg">
                            <h1 className="font-merriweather font-black text-5xl md:text-7xl xl:text-8xl tracking-tighter text-white group-hover:text-primary transition-colors">
                                Langturssejlads
                            </h1>
                        </Link>
                        <p className="mt-6 text-sm md:text-base font-bold uppercase tracking-widest text-zinc-300 max-w-2xl balance drop-shadow-md">
                            Følg de danske sejlere på langfart på de syv verdenshave.
                        </p>
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
                        <Link href="/laer-om-langturssejlads" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Lær om Langturssejlads
                        </Link>
                        {(isLoggedIn || isAdmin) && (
                            <Link href="/dashboard" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                                &quot;Under dæk&quot;
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
