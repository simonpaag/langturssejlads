'use client';

import Link from 'next/link';
import { Menu, Search, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

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
                <div>Langturssejlads &middot; Historier</div>
                <div className="flex items-center gap-4">
                    <button className="hover:text-foreground transition-colors"><Search className="h-4 w-4" /></button>
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
                                <User className="h-4 w-4" /> Log ind
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Main Masthead */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 border-b-[3px] border-foreground">
                <div className="flex flex-col items-center justify-center text-center">
                    <Link href="/" className="group">
                        <h1 className="font-merriweather font-black text-5xl md:text-7xl xl:text-8xl tracking-tighter text-foreground group-hover:text-primary transition-colors">
                            Langturssejlads
                        </h1>
                    </Link>
                    <p className="mt-4 text-sm md:text-base font-medium text-muted-foreground uppercase tracking-[0.2em]">
                        Følg de danske sejlere på langfart på de syv verdenshave.
                    </p>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="border-b border-border shadow-sm sticky top-0 bg-background/95 backdrop-blur-sm z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 justify-center items-center space-x-8 md:space-x-12 overflow-x-auto no-scrollbar">
                        <Link href="/" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Forside
                        </Link>
                        <Link href="/boats" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Bådene
                        </Link>
                        <Link href="#" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Destinationer
                        </Link>
                        <Link href="#" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Udstyr & Grej
                        </Link>
                        <Link href="/dashboard" className="text-foreground text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors whitespace-nowrap">
                            Kahyt (Dashboard)
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
