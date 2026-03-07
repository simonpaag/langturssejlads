'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Activity, Mail, FileText, Megaphone, Trash2, Eye, EyeOff, Save, Users, UserPlus, ExternalLink, BookOpen, Edit, Plus, Lightbulb } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';
import AnimatedLoader from '@/components/AnimatedLoader';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'logs' | 'faqs' | 'posts' | 'emails' | 'ads' | 'users' | 'boats' | 'ideas'>('logs');
    const [isLoading, setIsLoading] = useState(true);

    // Data States
    const [logs, setLogs] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const [sentEmails, setSentEmails] = useState<any[]>([]);
    const [ads, setAds] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [boats, setBoats] = useState<any[]>([]);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [ideas, setIdeas] = useState<any[]>([]);

    useEffect(() => {
        if (isLoading) return; // Vent på auth

        const token = localStorage.getItem('user_token');
        if (!token) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        const headers = { 'Authorization': `Bearer ${token}` };

        if (activeTab === 'logs' && logs.length === 0) {
            fetch(`${apiUrl}/api/admin/logs`, { headers }).then(r => r.json()).then(setLogs).catch(() => { });
            fetch(`${apiUrl}/api/admin/emails/sent`, { headers }).then(r => r.json()).then(setSentEmails).catch(() => { });
        } else if (activeTab === 'users' && users.length === 0) {
            fetch(`${apiUrl}/api/admin/users`, { headers }).then(r => r.json()).then(setUsers).catch(() => { });
        } else if (activeTab === 'boats' && boats.length === 0) {
            fetch(`${apiUrl}/api/admin/boats`, { headers }).then(r => r.json()).then(setBoats).catch(() => { });
        } else if (activeTab === 'posts' && posts.length === 0) {
            fetch(`${apiUrl}/api/admin/posts`, { headers }).then(r => r.json()).then(setPosts).catch(() => { });
        } else if (activeTab === 'faqs' && faqs.length === 0) {
            fetch(`${apiUrl}/api/admin/faqs`, { headers }).then(r => r.json()).then(setFaqs).catch(() => { });
        } else if (activeTab === 'emails' && templates.length === 0) {
            fetch(`${apiUrl}/api/admin/emails/templates`, { headers }).then(r => r.json()).then(setTemplates).catch(() => { });
        } else if (activeTab === 'ads' && ads.length === 0) {
            fetch(`${apiUrl}/api/admin/ads`, { headers }).then(r => r.json()).then(setAds).catch(() => { });
        } else if (activeTab === 'ideas' && ideas.length === 0) {
            fetch(`${apiUrl}/api/admin/ideas`, { headers }).then(r => r.json()).then(setIdeas).catch(() => { });
        }
    }, [activeTab, isLoading]);

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
                const res = await fetch(`${apiUrl}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (!data.user.isSystemAdmin) {
                        router.push('/');
                    } else {
                        setIsLoading(false);
                    }
                } else {
                    router.push('/');
                }
            } catch (err) {
                router.push('/');
            }
        };

        verifyAdmin();
    }, [router]);


    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background"><AnimatedLoader className="scale-125" text="Autentificerer..." /></div>;
    }

    return (
        <div className="min-h-screen bg-muted/30 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                    <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-merriweather font-black text-foreground">PosseidonAdmin</h1>
                        <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest mt-1">SuperAdmin Kontrolpanel</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:w-64 shrink-0">
                        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar sticky top-24">
                            <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Activity className="w-5 h-5" />} label="Aktivitetslog" />
                            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users className="w-5 h-5" />} label="Brugere" />
                            <TabButton active={activeTab === 'boats'} onClick={() => setActiveTab('boats')} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17c0-2-1.5-2-1.5-2S19 14 16 14s-3.5 1-3.5 1S11 14 8 14 4.5 15 4.5 15 3 15 3 17" /><path d="M12 14v4" /><path d="M12 2v10" /><path d="M18 10L12 2l-6 8h12z" /></svg>} label="Både" />
                            <TabButton active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} icon={<FileText className="w-5 h-5" />} label="Moderation" />
                            <TabButton active={activeTab === 'faqs'} onClick={() => setActiveTab('faqs')} icon={<BookOpen className="w-5 h-5" />} label="Artikler (FAQ)" />
                            <TabButton active={activeTab === 'emails'} onClick={() => setActiveTab('emails')} icon={<Mail className="w-5 h-5" />} label="Notification Center" />
                            <TabButton active={activeTab === 'ads'} onClick={() => setActiveTab('ads')} icon={<Megaphone className="w-5 h-5" />} label="Native Ads" />
                            <TabButton active={activeTab === 'ideas'} onClick={() => setActiveTab('ideas')} icon={<Lightbulb className="w-5 h-5" />} label="Brugeridéer" />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0 bg-background rounded-3xl p-6 lg:p-10 shadow-xl border border-border/50">
                        {activeTab === 'logs' && <LogsTab logs={logs} sentEmails={sentEmails} />}
                        {activeTab === 'users' && <UsersTab users={users} setUsers={setUsers} />}
                        {activeTab === 'boats' && <BoatsTab boats={boats} setBoats={setBoats} />}
                        {activeTab === 'posts' && <PostsTab posts={posts} setPosts={setPosts} />}
                        {activeTab === 'faqs' && <FaqsTab faqs={faqs} setFaqs={setFaqs} />}
                        {activeTab === 'emails' && <EmailsTab templates={templates} />}
                        {activeTab === 'ads' && <AdsTab ads={ads} setAds={setAds} />}
                        {activeTab === 'ideas' && <IdeasTab ideas={ideas} setIdeas={setIdeas} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${active
                ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
        >
            {icon} {label}
        </button>
    );
}

// ----------------------------------------------------
// TABS COMPONENTS

function BoatsTab({ boats, setBoats }: { boats: any[], setBoats: any }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-merriweather font-bold">Bådkatalog</h2>
                <span className="text-sm text-muted-foreground font-bold">{boats.length} registrerede både</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border/50 shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted uppercase text-[10px] font-black tracking-widest text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Bådnavn</th>
                            <th className="px-6 py-4">Medlemmer</th>
                            <th className="px-6 py-4">Senest Opdateret</th>
                            <th className="px-6 py-4 text-right">Handlinger</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                        {boats.map((b) => (
                            <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-bold text-foreground flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                                        {b.profileImage ? <img src={b.profileImage} className="w-full h-full object-cover" /> : null}
                                    </div>
                                    <div className="flex flex-col">
                                        <span>{b.name}</span>
                                        <span className="text-[10px] text-muted-foreground font-mono">{b.slug}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                                        {b.crewMemberships?.length || 0} besætning
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {new Date(b.updatedAt).toLocaleDateString('da-DK')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a
                                        href={`/dashboard?boatId=${b.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold uppercase tracking-wider rounded-md transition-colors"
                                        title="Låner adgang til båden midlertidigt som SystemAdmin"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" /> Rediger Skib
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
// ----------------------------------------------------

function LogsTab({ logs, sentEmails }: { logs: any[], sentEmails: any[] }) {
    return (
        <div>
            <h2 className="text-2xl font-merriweather font-bold mb-6">Aktivitetslog</h2>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* System Logs */}
                <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">System Hændelser</h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {logs.length === 0 ? <p className="text-muted-foreground text-sm">Ingen system logs fundet.</p> : null}
                        {logs.map(log => (
                            <div key={log.id} className="p-4 border border-border/50 rounded-2xl bg-muted/20 flex gap-4 items-start">
                                <div className="bg-primary/10 p-2 rounded-full mt-1 shrink-0">
                                    <Activity className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="font-bold text-sm">{log.action}</span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(log.createdAt).toLocaleString('da-DK')}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Bruger: {log.user?.email || 'System'}</p>
                                    {log.details && <p className="text-xs bg-muted p-2 rounded-lg mt-2 font-mono break-all">{log.details}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sent Emails Log */}
                <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Afsendte Mails</h3>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {sentEmails.length === 0 ? <p className="text-muted-foreground text-sm">Ingen udsendte mails endnu.</p> : null}
                        {sentEmails.map(mail => (
                            <div key={mail.id} className="flex flex-col p-3 bg-muted/20 rounded-xl border border-border/30 text-sm">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <p className="font-semibold leading-tight">{mail.subject}</p>
                                    <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-1 rounded-full ${mail.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {mail.status}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate" title={mail.toEmail}>Til: {mail.toEmail}</p>
                                <span className="text-[10px] text-muted-foreground mt-2">{new Date(mail.sentAt).toLocaleString('da-DK')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PostsTab({ posts, setPosts }: { posts: any[], setPosts: any }) {
    const handleToggleFrontpage = async (id: number, currentStatus: boolean) => {
        const token = localStorage.getItem('user_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        try {
            const res = await fetch(`${apiUrl}/api/admin/posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ showOnFrontpage: !currentStatus })
            });
            if (res.ok) {
                setPosts(posts.map(p => p.id === id ? { ...p, showOnFrontpage: !currentStatus } : p));
            }
        } catch (e) { }
    };

    const handleReject = async (id: number) => {
        if (!confirm('Er du sikker på at du vil afvise dette indlæg helt?')) return;
        const token = localStorage.getItem('user_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        try {
            const res = await fetch(`${apiUrl}/api/admin/posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: 'REJECTED' })
            });
            if (res.ok) {
                setPosts(posts.map(p => p.id === id ? { ...p, status: 'REJECTED' } : p));
            }
        } catch (e) { }
    };

    return (
        <div className="overflow-x-auto">
            <h2 className="text-2xl font-merriweather font-bold mb-6">Indholds-Moderation</h2>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border/60 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <th className="p-3">Dato</th>
                        <th className="p-3">Titel</th>
                        <th className="p-3">Forfatter</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Handling</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {posts.map(post => {
                        let contentLink = '#';
                        if (post.slug) {
                            if (post.postType === 'VOYAGE') {
                                contentLink = `/boats/${post.boat?.slug || 'unknown'}/voyages/${post.slug}`;
                            } else {
                                contentLink = `/posts/${post.slug}`;
                            }
                        }

                        return (
                            <tr key={post.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                                <td className="p-3 whitespace-nowrap">{new Date(post.createdAt).toLocaleDateString('da-DK')}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold max-w-[200px] truncate">{post.title || `[${post.postType}]`}</span>
                                        {post.slug && (
                                            <a href={contentLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0" title="Se indhold">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="p-3 text-muted-foreground">{post.author?.name}</td>
                                <td className="p-3">
                                    {post.status === 'REJECTED' ? <span className="text-red-500 font-bold">Afvist</span> :
                                        post.showOnFrontpage ? <span className="text-green-600 font-bold">Forside</span> :
                                            <span className="text-orange-500 font-bold">Skjult</span>}
                                </td>
                                <td className="p-3 text-right flex justify-end gap-2">
                                    <button onClick={() => handleToggleFrontpage(post.id, post.showOnFrontpage)} className="p-2 border border-border rounded-lg hover:bg-muted transition-colors opacity-70 hover:opacity-100" title="Skjul/Vis på forside">
                                        {post.showOnFrontpage ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => handleReject(post.id)} className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Afvis helt">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function EmailsTab({ templates }: { templates: any[] }) {

    // User friendly template name mapping
    const TEMPLATE_NAMES: Record<string, string> = {
        'INVITE_EMAIL': 'Mangler en båd du kender?',
        'BOAT_CONTACT_EMAIL': 'Profil-kontakt',
        'VOYAGE_CONTACT_EMAIL': 'Togt-kontakt'
    };

    return (
        <div>
            <h2 className="text-2xl font-merriweather font-bold mb-6">Notification Center</h2>
            <p className="text-muted-foreground mb-8">
                Her kan du redigere de tekster der bliver afsendt fra platformens mail-skabeloner (Tilknyttet kontaktformularer mv).
            </p>

            <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-2xl">
                <h3 className="font-bold text-lg font-merriweather mb-6 text-primary">System Skabeloner</h3>
                {templates.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Ingen skabeloner fundet i databasen endnu.</p>
                ) : (
                    <div className="space-y-8">
                        {templates.map(tmpl => (
                            <EditableTemplate key={tmpl.id} template={tmpl} displayName={TEMPLATE_NAMES[tmpl.name]} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function EditableTemplate({ template, displayName }: { template: any, displayName?: string }) {
    const [subject, setSubject] = useState(template.subject || '');
    const [bodyHtml, setBodyHtml] = useState(template.bodyHtml || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('user_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/admin/emails/templates/${template.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ subject, bodyHtml })
            });
            if (res.ok) {
                alert('Skabelon gemt!');
            } else {
                alert('Fejl ved gemning.');
            }
        } catch (error) {
            console.error(error);
            alert('Netværksfejl.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="border border-border/50 rounded-xl p-5 bg-background shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <h4 className="font-bold">
                    {displayName || template.name}
                </h4>
                <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground ml-auto font-mono">
                    {template.name}
                </span>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Emne / Subject</label>
                <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-2 bg-muted/20 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">HTML Indhold</label>
                <p className="text-[10px] text-muted-foreground -mt-1 mb-2">Du kan redigere den underliggende HTML struktur her for bedst understøttelse i mail-klienter.</p>
                <textarea
                    value={bodyHtml}
                    onChange={e => setBodyHtml(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 bg-muted/20 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
            </div>

            <div className="pt-2 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Gemmer...' : 'Gem Skabelon'}
                </button>
            </div>
        </div>
    );
}

function AdsTab({ ads, setAds }: { ads: any[], setAds: any }) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingAdId, setEditingAdId] = useState<number | null>(null);

    // Form state
    const [headline, setHeadline] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [placement, setPlacement] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const resetForm = () => {
        setHeadline(''); setContent(''); setImageUrl(''); setLinkUrl(''); setPlacement(0); setIsActive(true);
        setIsCreating(false);
        setEditingAdId(null);
    };

    const startEdit = (ad: any) => {
        setEditingAdId(ad.id);
        setHeadline(ad.headline);
        setContent(ad.content);
        setImageUrl(ad.imageUrl || '');
        setLinkUrl(ad.linkUrl || '');
        setPlacement(ad.placement);
        setIsActive(ad.isActive);
        setIsCreating(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('user_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

            const method = editingAdId ? 'PUT' : 'POST';
            const endpoint = editingAdId ? `/api/admin/ads/${editingAdId}` : '/api/admin/ads';

            const res = await fetch(`${apiUrl}${endpoint}`, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ headline, content, imageUrl, linkUrl, placement, isActive })
            });

            if (res.ok) {
                const savedAd = await res.json();
                if (editingAdId) {
                    setAds(ads.map(a => a.id === editingAdId ? savedAd : a).sort((a, b) => a.placement - b.placement));
                } else {
                    setAds([...ads, savedAd].sort((a, b) => a.placement - b.placement));
                }
                resetForm();
            } else {
                alert(`Fejl ved ${editingAdId ? 'opdatering' : 'oprettelse'}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Sikker på du vil slette denne annonce?')) return;
        try {
            const token = localStorage.getItem('user_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/admin/ads/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setAds(ads.filter(a => a.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleActive = async (id: number, current: boolean) => {
        try {
            const token = localStorage.getItem('user_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/admin/ads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ isActive: !current })
            });
            if (res.ok) {
                setAds(ads.map(a => a.id === id ? { ...a, isActive: !current } : a));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-merriweather font-bold">Native Ads</h2>
                <button
                    onClick={() => isCreating ? resetForm() : setIsCreating(true)}
                    className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${isCreating ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                >
                    {isCreating ? 'Afbryd' : '+ Opret Ny'}
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreateSubmit} className="mb-8 p-6 lg:p-8 border border-border shadow-sm bg-background rounded-2xl">
                    <h3 className="text-lg font-merriweather font-bold mb-6 text-primary border-b border-border/50 pb-2">
                        {editingAdId ? 'Rediger Annonce' : 'Opret Ny Annonce'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Overskrift *</label>
                            <input required type="text" value={headline} onChange={e => setHeadline(e.target.value)} className="w-full px-4 py-2 bg-muted/20 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Titel på annoncen" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">URL Link destination</label>
                            <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="w-full px-4 py-2 bg-muted/20 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="https://..." />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Indhold / Tekst *</label>
                            <textarea required value={content} onChange={e => setContent(e.target.value)} rows={3} className="w-full px-4 py-2 bg-muted/20 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Annoncens brødtekst..."></textarea>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <ImageUpload
                                onUploadSuccess={setImageUrl}
                                currentImage={imageUrl}
                                label="Annonce Billede (Bør være 16:9 eller bredere)"
                                aspectRatio="video"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Placering i feedet (Index)</label>
                            <input type="number" min="0" value={placement} onChange={e => setPlacement(parseInt(e.target.value) || 0)} className="w-full px-4 py-2 bg-muted/20 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                            <p className="text-[10px] text-muted-foreground">E.g., 0 = Første post, 2 = Under andet indlæg.</p>
                        </div>
                        <div className="space-y-2 flex flex-col justify-center">
                            <label className="flex items-center gap-3 cursor-pointer mt-4">
                                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer" />
                                <span className="text-sm font-bold">Er Aktiv</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                        <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted transition-colors">Annuller</button>
                        <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-md disabled:opacity-50">
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Gemmer...' : editingAdId ? 'Gem Ændringer' : 'Opret Annonce'}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid gap-4">
                {ads.map(ad => (
                    <div key={ad.id} className={`p-5 lg:p-6 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${ad.isActive ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/10 opacity-70'}`}>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Placering: {ad.placement}</span>
                                {ad.isActive ? (
                                    <span className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1"><Eye className="w-3 h-3" /> Aktiv</span>
                                ) : (
                                    <span className="text-[10px] font-bold text-orange-500 uppercase flex items-center gap-1"><EyeOff className="w-3 h-3" /> Deaktiveret</span>
                                )}
                            </div>
                            <h3 className="font-bold text-lg leading-tight mb-1">{ad.headline}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{ad.content}</p>
                            {ad.linkUrl && <a href={ad.linkUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-2 inline-block">🔗 {ad.linkUrl}</a>}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-border/50 pt-3 md:pt-0">
                            <button
                                onClick={() => startEdit(ad)}
                                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                            >
                                Rediger
                            </button>
                            <button
                                onClick={() => handleToggleActive(ad.id, ad.isActive)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${ad.isActive ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                            >
                                {ad.isActive ? 'Deaktiver' : 'Aktivér'}
                            </button>
                            <button
                                onClick={() => handleDelete(ad.id)}
                                className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Slet annonce"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {ads.length === 0 && !isCreating && (
                    <div className="text-center p-12 border border-dashed border-border rounded-2xl bg-muted/10">
                        <Megaphone className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground font-semibold">Ingen Native Ads er oprettet endnu.</p>
                        <p className="text-xs text-muted-foreground mt-1">Opret en annonce for at fremhæve indhold i det sociale feed.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function UsersTab({ users, setUsers }: { users: any[], setUsers: any }) {
    const handlePromote = async (userId: number, currentStatus: boolean) => {
        if (!confirm(`Er du sikker på at du vil ændre denne brugers admin-status til ${!currentStatus}?`)) return;

        try {
            const token = localStorage.getItem('user_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/admin/users/${userId}/promote`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isSystemAdmin: !currentStatus })
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setUsers(users.map(u => u.id === userId ? { ...u, isSystemAdmin: updatedUser.isSystemAdmin } : u));
            }
        } catch (error) {
            console.error('Failed to promote user:', error);
        }
    };

    const handleBlock = async (userId: number, currentStatus: boolean) => {
        if (!confirm(currentStatus ? 'Vil du fjerne blokeringen for denne bruger?' : 'Vil du blokere denne bruger fra at oprette indhold?')) return;

        try {
            const token = localStorage.getItem('user_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/admin/users/${userId}/block`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isBlocked: !currentStatus })
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setUsers(users.map(u => u.id === userId ? { ...u, isBlocked: updatedUser.isBlocked } : u));
            }
        } catch (error) {
            console.error('Failed to block user:', error);
        }
    };

    const handleDelete = async (userId: number) => {
        if (!confirm('ER DU SIKKER? Dette sletter brugeren permanent, men bevarer deres indhold som "Slettet Bruger" (anonymt). Handlingen kan ikke fortrydes!')) return;

        try {
            const token = localStorage.getItem('user_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== userId));
            } else {
                alert('Kunne ikke slette brugeren.');
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Der opstod en fejl under sletning af brugeren.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-merriweather font-bold mb-6">Brugeradministration</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-border/50 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
                            <th className="pb-3 pr-4">Brugernavn</th>
                            <th className="pb-3 px-4">Email</th>
                            <th className="pb-3 px-4">Oprettet</th>
                            <th className="pb-3 px-4">System Admin</th>
                            <th className="pb-3 px-4">Status</th>
                            <th className="pb-3 pl-4 text-right">Handlinger</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                <td className="py-4 pr-4 font-semibold">{user.name}</td>
                                <td className="py-4 px-4 text-muted-foreground">{user.email}</td>
                                <td className="py-4 px-4 text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString('da-DK')}
                                </td>
                                <td className="py-4 px-4">
                                    <button
                                        onClick={() => handlePromote(user.id, user.isSystemAdmin)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest transition-colors ${user.isSystemAdmin
                                            ? 'bg-primary text-primary-foreground hover:bg-red-500/90'
                                            : 'bg-muted hover:bg-primary/20 hover:text-primary'
                                            }`}
                                    >
                                        {user.isSystemAdmin ? 'Fjern' : 'Gør til admin'}
                                    </button>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {user.isBlocked ? 'Blokeret' : 'Aktiv'}
                                    </span>
                                </td>
                                <td className="py-4 pl-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleBlock(user.id, user.isBlocked)}
                                        className="text-muted-foreground hover:text-primary transition-colors text-xs font-semibold"
                                    >
                                        {user.isBlocked ? 'Fjern blokering' : 'Bloker'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors text-xs font-semibold"
                                    >
                                        Slet
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <p className="text-muted-foreground mt-4 text-sm">Ingen brugere fundet.</p>}
            </div>
        </div>
    );
}

function FaqsTab({ faqs, setFaqs }: { faqs: any[], setFaqs: any }) {
    const [editingFaq, setEditingFaq] = useState<any | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ title: '', slug: '', content: '', imageUrl: '', order: 0, status: 'PUBLISHED' });
    const [isSaving, setIsSaving] = useState(false);

    const handleCreateNew = () => {
        setFormData({ title: '', slug: '', content: '', imageUrl: '', order: faqs.length, status: 'PUBLISHED' });
        setEditingFaq(null);
        setIsCreating(true);
    };

    const handleEdit = (faq: any) => {
        setFormData({
            title: faq.title,
            slug: faq.slug || '',
            content: faq.content,
            imageUrl: faq.imageUrl || '',
            order: faq.order || 0,
            status: faq.status || 'PUBLISHED'
        });
        setEditingFaq(faq);
        setIsCreating(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Er du helt sikker på du vil slette denne artikel?')) return;
        const token = localStorage.getItem('user_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
        try {
            const res = await fetch(`${apiUrl}/api/faq/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setFaqs(faqs.filter(f => f.id !== id));
            } else {
                alert('Kunne ikke slette artiklen.');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.content) {
            alert('Titel og indhold er påkrævet.');
            return;
        }
        setIsSaving(true);
        const token = localStorage.getItem('user_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

        try {
            const url = editingFaq ? `${apiUrl}/api/faq/${editingFaq.id}` : `${apiUrl}/api/faq`;
            const method = editingFaq ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const savedFaq = await res.json();
                if (editingFaq) {
                    setFaqs(faqs.map(f => f.id === savedFaq.id ? savedFaq : f));
                } else {
                    setFaqs([...faqs, savedFaq]);
                }
                setIsCreating(false);
                setEditingFaq(null);
            } else {
                alert('Kunne ikke gemme artiklen.');
            }
        } catch (e) {
            console.error(e);
            alert('Der opstod en fejl under gemning.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isCreating || editingFaq) {
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-merriweather font-bold">{editingFaq ? 'Rediger Artikel' : 'Ny Artikel'}</h2>
                    <button onClick={() => { setIsCreating(false); setEditingFaq(null); }} className="text-sm font-bold text-muted-foreground hover:text-foreground">
                        Annuller
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Titel</label>
                        <input
                            type="text"
                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Slug (URL)</label>
                            <input
                                type="text"
                                placeholder="Auto-genereres hvis tom"
                                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Rækkefølge (0 er først)</label>
                            <input
                                type="number"
                                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3"
                                value={formData.order}
                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Status</label>
                            <select
                                className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="PUBLISHED">Udgivet (Offentlig)</option>
                                <option value="DRAFT">Kladde (Skjult)</option>
                                <option value="HIDDEN">Skjult (Kan kun læses via link)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Cover Billede</label>
                        <ImageUpload
                            currentImage={formData.imageUrl}
                            onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })}
                            label="Upload Hero Billede"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Indhold (Tekst)</label>
                        <div className="prose-editor-wrapper bg-background rounded-xl border border-border overflow-hidden">
                            <RichTextEditor
                                content={formData.content}
                                onChange={(c) => setFormData({ ...formData, content: c })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4 border-t border-border">
                        <button
                            disabled={isSaving}
                            onClick={handleSave}
                            className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full hover:bg-primary/90 flex items-center gap-2"
                        >
                            {isSaving ? <AnimatedLoader className="scale-50 inline" /> : <Save className="w-5 h-5" />} Gem Artikel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-merriweather font-bold">Vidensbase & FAQ</h2>
                <button
                    onClick={handleCreateNew}
                    className="bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                >
                    <Plus className="w-4 h-4" /> Opret Ny Artikel
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-border/50 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
                            <th className="pb-3 px-4 w-12 text-center">Rækkefølge</th>
                            <th className="pb-3 pr-4">Titel</th>
                            <th className="pb-3 px-4">URL Slug</th>
                            <th className="pb-3 px-4">Billede</th>
                            <th className="pb-3 pl-4 text-right">Handlinger</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {faqs.sort((a, b) => a.order - b.order).map(faq => (
                            <tr key={faq.id} className="hover:bg-muted/10 transition-colors">
                                <td className="py-4 px-4 text-center font-mono text-xs font-bold text-muted-foreground">{faq.order}</td>
                                <td className="py-4 pr-4 font-semibold text-foreground">
                                    {faq.title}
                                    {faq.status === 'DRAFT' && <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-600 px-2 py-1 rounded-full uppercase tracking-wider">Kladde</span>}
                                    {faq.status === 'HIDDEN' && <span className="ml-2 text-[10px] bg-muted border border-border text-muted-foreground px-2 py-1 rounded-full uppercase tracking-wider">Skjult</span>}
                                </td>
                                <td className="py-4 px-4 text-muted-foreground">/{faq.slug}</td>
                                <td className="py-4 px-4 text-muted-foreground">
                                    {faq.imageUrl ? <span className="text-green-600 font-bold">Ja</span> : <span className="opacity-50">Nej</span>}
                                </td>
                                <td className="py-4 pl-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(faq)}
                                        className="text-primary hover:underline transition-colors text-xs font-semibold px-2"
                                    >
                                        Rediger
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors text-xs font-semibold px-2"
                                    >
                                        Slet
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {faqs.length === 0 && <p className="text-muted-foreground mt-8 text-center text-sm">Der er ikke oprettet nogen artikler endnu.</p>}
            </div>
        </div>
    );
}

// ----------------------------------------------------
function IdeasTab({ ideas, setIdeas }: { ideas: any[], setIdeas: any }) {
    const [newIdeaText, setNewIdeaText] = useState('');
    const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);

    const handleCreateIdea = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIdeaText.trim()) return;

        setIsSubmittingIdea(true);
        const token = localStorage.getItem('user_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

        try {
            const res = await fetch(`${apiUrl}/api/admin/ideas`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: newIdeaText })
            });

            if (res.ok) {
                const newIdea = await res.json();
                setIdeas([newIdea, ...ideas]);
                setNewIdeaText('');
            } else {
                alert('Fejl ved oprettelse af idé');
            }
        } catch (error) {
            console.error('Create idea error:', error);
        } finally {
            setIsSubmittingIdea(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Er du sikker på du vil slette denne idé?')) return;
        const token = localStorage.getItem('user_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

        try {
            const res = await fetch(`${apiUrl}/api/admin/ideas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setIdeas(ideas.filter(idea => idea.id !== id));
            } else {
                alert('Fejl ved sletning af idé');
            }
        } catch (e) {
            console.error('Delete idea error', e);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        const token = localStorage.getItem('user_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

        try {
            const res = await fetch(`${apiUrl}/api/admin/ideas/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                const updatedIdea = await res.json();
                setIdeas(ideas.map(idea => idea.id === id ? updatedIdea : idea));
            } else {
                alert('Fejl ved opdatering af status');
            }
        } catch (e) {
            console.error('Update idea error', e);
        }
    };

    const statusColors: any = {
        'IDEA': 'bg-blue-100 text-blue-800',
        'IN_PROCESS': 'bg-amber-100 text-amber-800',
        'IN_TEST': 'bg-purple-100 text-purple-800',
        'LIVE': 'bg-green-100 text-green-800'
    };

    const statusLabels: any = {
        'IDEA': 'Ny Idé',
        'IN_PROCESS': 'I Process',
        'IN_TEST': 'I Test',
        'LIVE': 'Live'
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-merriweather font-bold">Brugeridéer</h2>
                    <p className="text-sm text-muted-foreground mt-1">Styr det offentlige Trello-board på Om-siden</p>
                </div>
                <span className="text-sm text-muted-foreground font-bold">{ideas.length} indsendte idéer</span>
            </div>

            {/* Opret intern idé */}
            <form onSubmit={handleCreateIdea} className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    value={newIdeaText}
                    onChange={(e) => setNewIdeaText(e.target.value)}
                    placeholder="Indskriv en idé der mangler udvikling (intern)..."
                    className="flex-1 bg-background border border-border/50 rounded-xl px-4 py-3 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    disabled={isSubmittingIdea}
                />
                <button
                    type="submit"
                    disabled={isSubmittingIdea || !newIdeaText.trim()}
                    className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {isSubmittingIdea ? 'Opretter...' : 'Opret Idé'}
                </button>
            </form>

            <div className="space-y-4">
                {ideas.map((idea) => (
                    <div key={idea.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative overflow-hidden group">
                        {/* Decorative side bar matching status */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusColors[idea.status].split(' ')[0]}`}></div>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-foreground capitalize">{idea.name}</h3>
                                <span className="text-xs text-muted-foreground">&lt;{idea.email}&gt;</span>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest bg-muted px-2 py-0.5 rounded-full">
                                    {new Date(idea.createdAt).toLocaleDateString('da-DK')}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed font-serif bg-muted/20 p-4 rounded-xl border border-border/30">"{idea.message}"</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
                            <select
                                value={idea.status}
                                onChange={(e) => handleStatusChange(idea.id, e.target.value)}
                                className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl outline-none cursor-pointer appearance-none ${statusColors[idea.status]}`}
                                style={{ WebkitAppearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto', paddingRight: '2em' }}
                            >
                                <option value="IDEA">{statusLabels['IDEA']}</option>
                                <option value="IN_PROCESS">{statusLabels['IN_PROCESS']}</option>
                                <option value="IN_TEST">{statusLabels['IN_TEST']}</option>
                                <option value="LIVE">{statusLabels['LIVE']}</option>
                            </select>

                            <button
                                onClick={() => handleDelete(idea.id)}
                                className="w-full sm:w-auto text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors flex items-center justify-center"
                                title="Slet Idé"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
                {ideas.length === 0 && (
                    <p className="text-muted-foreground text-center py-10 bg-muted/10 rounded-xl border border-dashed border-border">Der indkommet nogen idéer til logbogen endnu.</p>
                )}
            </div>
        </div>
    );
}
