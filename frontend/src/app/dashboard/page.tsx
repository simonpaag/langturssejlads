'use client';

import { useState } from 'react';
import { Ship, PenLine, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'write' | 'profile'>('write');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // NOTE: In a full app, this connects to the /api/articles React Context or Zustand store
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Publiceret: ${title}\n\n(Dette er en UI-prototype. I produktion sendes dette til backend API'et via JWT.)`);
        setTitle('');
        setContent('');
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-muted/30">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-border flex flex-col">
                <div className="p-6 border-b border-border">
                    <h2 className="font-bold text-lg mb-1">Kaptajnens Kahyt</h2>
                    <p className="text-sm text-muted-foreground">S/Y Havanna</p>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('write')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'write' ? 'bg-primary text-white' : 'hover:bg-muted text-foreground'}`}
                    >
                        <PenLine className="h-5 w-5" />
                        <span className="font-medium">Skriv Artikel</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-muted text-foreground'}`}
                    >
                        <Ship className="h-5 w-5" />
                        <span className="font-medium">Bådens Profil</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-border mt-auto">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors">
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Log ud</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-3xl mx-auto">
                    {activeTab === 'write' ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                            <div className="p-6 border-b border-border bg-slate-50">
                                <h1 className="text-2xl font-bold font-merriweather">Skriv en ny historie</h1>
                                <p className="text-muted-foreground mt-1">Del jeres seneste oplevelser med dem derhjemme.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-semibold mb-2">Overskrift</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="F.eks. Stormvejr i Biscayen..."
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium placeholder:font-normal"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="content" className="block text-sm font-semibold mb-2">Historien</label>
                                    <textarea
                                        id="content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Skriv om jeres oplevelser her..."
                                        rows={12}
                                        className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
                                    <button type="button" className="px-6 py-2.5 rounded-full font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                                        Gem Kladde
                                    </button>
                                    <button type="submit" className="px-6 py-2.5 rounded-full font-medium bg-primary text-white hover:bg-primary-light transition-colors hover-lift shadow-sm shadow-primary/30">
                                        Udgiv Historie
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden p-8 text-center">
                            <Ship className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                            <h2 className="text-xl font-bold mb-2">Båd Profil Indstillinger</h2>
                            <p className="text-muted-foreground">Her kan du redigere bådens profilbillede, beskrivelse og administrere mandskabet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
