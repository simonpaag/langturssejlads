'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Registration failed');

            // Optionally auto-login, or just redirect to login
            alert('Konto oprettet succesfuldt! Log ind nu.');
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-muted/30 p-4">
            <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-xl border border-border w-full max-w-md">
                <h1 className="text-3xl font-merriweather font-bold text-center mb-2 text-foreground">Opret dig</h1>
                <p className="text-center text-muted-foreground mb-6 text-sm leading-relaxed px-2">
                    Opret en bruger for at holde dig opdateret omkring specifikke både, togter og gode historier – eller opret din egen båd her på Langturssejlads.dk
                </p>
                {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm font-medium">{error}</div>}

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-foreground/90">Fulde Navn</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-background text-foreground rounded-xl border border-border/80 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                            placeholder="Dit navn"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-foreground/90">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-background text-foreground rounded-xl border border-border/80 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                            placeholder="din@email.dk"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-foreground/90">Adgangskode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-background text-foreground rounded-xl border border-border/80 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Opretter konto...' : 'Opret Konto'}
                    </button>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Har du allerede en konto? <Link href="/login" className="text-primary hover:underline font-semibold">Log ind her</Link>
                    </p>
                </form>

                <div className="mt-8 pt-6 border-t border-border/60 text-center px-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Langturssejlads.dk er et non-profit projekt, der er 100% drevet af frivillige kræfter, og baseret på en stærk passion for sejlerfællesskabet.
                        <br />
                        <Link href="/om" className="text-primary hover:text-primary/80 transition-colors font-bold mt-1 inline-block">Læs mere om projektet her</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
