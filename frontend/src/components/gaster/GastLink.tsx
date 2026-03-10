'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PencilLine } from 'lucide-react';

export default function GastLink() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const checkAuth = () => {
            const token = localStorage.getItem('user_token');
            setIsLoggedIn(!!token);
        };

        checkAuth();
        window.addEventListener('auth-change', checkAuth);
        window.addEventListener('userStateChange', checkAuth);
        return () => {
            window.removeEventListener('auth-change', checkAuth);
            window.removeEventListener('userStateChange', checkAuth);
        };
    }, []);

    // Undgå hydration mismatch ved kun at vise linket på klienten
    if (!isMounted) {
        return (
            <span className="inline-block opacity-0">Opret gasteprofil gratis nu</span>
        );
    }

    if (isLoggedIn) {
        return (
            <Link href="/profil/gast" className="text-primary hover:underline font-bold ml-2 inline-flex items-center gap-1">
                <PencilLine className="w-4 h-4" /> Rediger mit gasteopslag
            </Link>
        );
    }

    return (
        <Link href="/profil/gast" className="text-primary hover:underline font-bold ml-2">
            Opret gasteprofil gratis nu
        </Link>
    );
}
