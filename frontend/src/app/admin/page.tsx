'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

interface Article {
    id: number;
    title: string;
    status: string;
    createdAt: string;
    author: { name: string };
    boat: { name: string };
}

export default function AdminPanel() {
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [articles, setArticles] = useState<Article[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('admin_token');
        if (savedToken) {
            setToken(savedToken);
            fetchArticles(savedToken);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');
            if (!data.user.isSystemAdmin) throw new Error('Access denied. System Admins only.');

            localStorage.setItem('admin_token', data.token);
            setToken(data.token);
            fetchArticles(data.token);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchArticles = async (authToken: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/articles/admin`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    handleLogout();
                    throw new Error('Session expired or unauthorized.');
                }
                throw new Error('Failed to fetch articles');
            }
            const data = await res.json();
            setArticles(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateStatus = async (articleId: number, newStatus: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/articles/${articleId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error('Failed to update status');

            // Update local state
            setArticles(articles.map(a => a.id === articleId ? { ...a, status: newStatus } : a));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        setToken(null);
        setArticles([]);
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-border w-full max-w-md">
                    <h1 className="text-3xl font-merriweather font-bold text-center mb-6">Redaktion</h1>

                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Adgangskode</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Log ind...' : 'Log ind som Admin'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-foreground">
                <h1 className="text-4xl font-merriweather font-black">Indholdsmoderering</h1>
                <button onClick={handleLogout} className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-red-600 transition-colors">
                    Log Ud
                </button>
            </div>

            {error && <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>}

            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">ID</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Historie</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Båd / Forfatter</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Dato</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Handling</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {articles.map(article => (
                            <tr key={article.id} className="hover:bg-muted/20 transition-colors">
                                <td className="p-4 text-sm font-medium text-muted-foreground">#{article.id}</td>
                                <td className="p-4 font-bold max-w-xs truncate">{article.title}</td>
                                <td className="p-4 text-sm">
                                    <span className="font-semibold text-primary block">{article.boat.name}</span>
                                    <span className="text-muted-foreground">{article.author.name}</span>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                    {format(new Date(article.createdAt), 'd. MMM yyyy', { locale: da })}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                                        article.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                            article.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {article.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <select
                                        value={article.status}
                                        onChange={(e) => updateStatus(article.id, e.target.value)}
                                        className="text-sm bg-white border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="APPROVED">Approved (Kun Båd-profil)</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                    Ingen historier fundet i databasen.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
