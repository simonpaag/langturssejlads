'use client';

import { useState, useEffect } from 'react';
import { Trash, Edit, Plus, X } from 'lucide-react';

interface FaqArticle {
    id: number;
    title: string;
    slug: string;
    content: string;
    order: number;
    createdAt: string;
}

export default function FaqManager({ token }: { token: string }) {
    const [faqs, setFaqs] = useState<FaqArticle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [order, setOrder] = useState<number>(0);

    // Dynamic URL matching existing frontend logic
    // Using simple hardcode for demo purposes relative proxy
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${apiUrl}/api/faq`);
            if (!res.ok) throw new Error('Failed to fetch FAQs');
            const data = await res.json();
            setFaqs(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing && currentId
                ? `${apiUrl}/api/faq/${currentId}`
                : `${apiUrl}/api/faq`;

            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, slug, content, order }),
            });

            if (!res.ok) throw new Error('Failed to save FAQ');

            resetForm();
            fetchFaqs();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Er du sikker på du vil slette denne FAQ artikel?')) return;
        try {
            const res = await fetch(`${apiUrl}/api/faq/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete FAQ');
            fetchFaqs();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const startEdit = (faq: FaqArticle) => {
        setIsEditing(true);
        setCurrentId(faq.id);
        setTitle(faq.title);
        setSlug(faq.slug);
        setContent(faq.content);
        setOrder(faq.order);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setTitle('');
        setSlug('');
        setContent('');
        setOrder(0);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white border border-border shadow-sm rounded-2xl p-6">
                <h2 className="text-2xl font-merriweather font-bold mb-6">
                    {isEditing ? 'Rediger FAQ Artikel' : 'Opret Ny FAQ Artikel'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wide mb-1">Titel</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Hvad er køjepenge?" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wide mb-1">Slug (valgfri)</label>
                            <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none" placeholder="hvad-er-koejepenge" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wide mb-1">Rækkefølge (tal)</label>
                            <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-wide mb-1">Indhold (Markdown eller HTML)</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} required rows={8} className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none resize-y font-mono text-sm" placeholder="Skriv din tekst her..."></textarea>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="flex items-center gap-2 bg-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-primary/90 transition-colors">
                            {isEditing ? <Edit size={18} /> : <Plus size={18} />}
                            {isEditing ? 'Gem Ændringer' : 'Opret Artikel'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={resetForm} className="flex items-center gap-2 bg-muted text-foreground font-bold py-2.5 px-6 rounded-xl hover:bg-muted/80 transition-colors">
                                <X size={18} /> Annuller
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground w-16">Sort</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Titel</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Slug</th>
                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right w-32">Handlinger</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {faqs.map(faq => (
                            <tr key={faq.id} className="hover:bg-muted/20 transition-colors">
                                <td className="p-4 text-sm font-bold text-muted-foreground text-center">{faq.order}</td>
                                <td className="p-4 font-bold">{faq.title}</td>
                                <td className="p-4 text-sm text-muted-foreground font-mono">{faq.slug}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button onClick={() => startEdit(faq)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(faq.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                                        <Trash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {faqs.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                    Ingen FAQ artikler fundet. Opret den første ovenfor!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
