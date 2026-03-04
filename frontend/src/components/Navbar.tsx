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
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = () => {
            const userToken = localStorage.getItem('user_token');
            const adminToken = localStorage.getItem('admin_token');
            setIsLoggedIn(!!userToken);
            setIsAdmin(!!adminToken);
        };

        checkAuth();
        window.addEventListener('auth-change', checkAuth);
        return () => window.removeEventListener('auth-change', checkAuth);
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
        <nav className="bg-background">
            {/* Top utility bar */}
            <div className="border-b border-border py-2 px-4 sm:px-6 lg:px-8 text-xs font-semibold text-muted-foreground uppercase tracking-widest flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <a href="https://langturssejlads.dk/" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">Langturssejlads.dk</a>
                    <span className="text-border">|</span>
                    <Link href="/om" className="hover:text-foreground transition-colors">Om Langturssejlads</Link>
                    <span className="text-border">|</span>
                    <Link href="/annoncor" className="hover:text-foreground transition-colors">Bliv annoncør</Link>
                </div>
                <div className="flex items-center gap-4">
                    {(isLoggedIn || isAdmin) ? (
                        <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-600 transition-colors">
                            <LogOut className="h-4 w-4" /> Log ud
                        </button>
                    ) : (
                        <>
                            <Link href="/register" className="flex items-center gap-1 hover:text-foreground transition-colors">
                                Opret konto
                            </Link>
                            <Link href="/login" className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <UserCircle className="h-4 w-4" /> Log ind
                            </Link>
                        </>
                    )}
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
                        <Link href="/" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Forside
                        </Link>
                        <Link href="/boats" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Både til søs
                        </Link>
                        <Link href="/togter" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Togter
                        </Link>
                        {(isLoggedIn || isAdmin) && (
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
