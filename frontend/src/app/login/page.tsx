'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');

            // Store the JWT token (for real apps, use proper HTTP-only cookies, but localstorage works for MVP)
            localStorage.setItem('user_token', data.token);

            // Redirect based on role
            if (data.user.isSystemAdmin) {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }

            // Dispatch a custom event so the Navbar can update its UI
            window.dispatchEvent(new Event('auth-change'));

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-muted/30 p-4">
            <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-xl border border-border w-full max-w-md">
                <h1 className="text-3xl font-merriweather font-bold text-center mb-6 text-foreground">Velkommen ombord</h1>

                {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm font-medium">{error}</div>}

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Logger ind...' : 'Log ind'}
                    </button>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Har du ikke en konto endnu? <Link href="/register" className="text-primary hover:underline font-semibold">Opret konto</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
