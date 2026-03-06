'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Activity, Mail, FileText, Megaphone, Trash2, Eye, EyeOff, Save } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'logs' | 'posts' | 'emails' | 'ads'>('logs');
    const [isLoading, setIsLoading] = useState(true);

    // Data States
    const [logs, setLogs] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const [sentEmails, setSentEmails] = useState<any[]>([]);
    const [ads, setAds] = useState<any[]>([]);

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
                const res = await fetch(`${apiUrl}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (!data.user.isSystemAdmin) {
                        router.push('/');
                    } else {
                        setIsLoading(false);
                        fetchAllData(token);
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

    const fetchAllData = async (token: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            // Logs
            fetch(`${apiUrl}/api/admin/logs`, { headers })
                .then(r => r.json()).then(setLogs).catch(() => { });
            // Posts
            fetch(`${apiUrl}/api/admin/posts`, { headers })
                .then(r => r.json()).then(setPosts).catch(() => { });
            // Emails
            fetch(`${apiUrl}/api/admin/emails/templates`, { headers })
                .then(r => r.json()).then(setTemplates).catch(() => { });
            fetch(`${apiUrl}/api/admin/emails/sent`, { headers })
                .then(r => r.json()).then(setSentEmails).catch(() => { });
            // Ads
            fetch(`${apiUrl}/api/admin/ads`, { headers })
                .then(r => r.json()).then(setAds).catch(() => { });
        } catch (e) {
            console.error("Failed fetching admin data", e);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
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
                            <TabButton active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} icon={<FileText className="w-5 h-5" />} label="Moderation" />
                            <TabButton active={activeTab === 'emails'} onClick={() => setActiveTab('emails')} icon={<Mail className="w-5 h-5" />} label="Notifikationer" />
                            <TabButton active={activeTab === 'ads'} onClick={() => setActiveTab('ads')} icon={<Megaphone className="w-5 h-5" />} label="Native Ads" />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0 bg-background rounded-3xl p-6 lg:p-10 shadow-xl border border-border/50">
                        {activeTab === 'logs' && <LogsTab logs={logs} />}
                        {activeTab === 'posts' && <PostsTab posts={posts} setPosts={setPosts} />}
                        {activeTab === 'emails' && <EmailsTab templates={templates} sentEmails={sentEmails} />}
                        {activeTab === 'ads' && <AdsTab ads={ads} setAds={setAds} />}
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
// ----------------------------------------------------

function LogsTab({ logs }: { logs: any[] }) {
    return (
        <div>
            <h2 className="text-2xl font-merriweather font-bold mb-6">Aktivitetslog</h2>
            <div className="space-y-4">
                {logs.length === 0 ? <p className="text-muted-foreground">Ingen logs fundet.</p> : null}
                {logs.map(log => (
                    <div key={log.id} className="p-4 border border-border/50 rounded-2xl bg-muted/20 flex gap-4 items-start">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                            <Activity className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-bold text-sm">{log.action}</span>
                                <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString('da-DK')}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Bruger: {log.user?.email || 'System'}</p>
                            {log.details && <p className="text-xs bg-muted p-2 rounded-lg mt-2 font-mono">{log.details}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PostsTab({ posts, setPosts }: { posts: any[], setPosts: any }) {
    const handleToggleFrontpage = async (id: number, currentStatus: boolean) => {
        const token = localStorage.getItem('user_token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
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
                    {posts.map(post => (
                        <tr key={post.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                            <td className="p-3 whitespace-nowrap">{new Date(post.createdAt).toLocaleDateString('da-DK')}</td>
                            <td className="p-3 font-semibold max-w-[200px] truncate">{post.title || `[${post.postType}]`}</td>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function EmailsTab({ templates, sentEmails }: { templates: any[], sentEmails: any[] }) {
    // Only handling read-only log feed for now to stay concise, templates soon
    return (
        <div>
            <h2 className="text-2xl font-merriweather font-bold mb-6">Notification Center</h2>

            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Senest Afsendte Mails</h3>
            <div className="space-y-3 mb-10 border border-border/50 rounded-2xl p-4 max-h-[400px] overflow-y-auto">
                {sentEmails.map(mail => (
                    <div key={mail.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-muted/20 rounded-xl border border-border/30 text-sm">
                        <div>
                            <p className="font-semibold">{mail.subject}</p>
                            <p className="text-xs text-muted-foreground">Til: {mail.toEmail}</p>
                        </div>
                        <div className="flex flex-col sm:items-end mt-2 sm:mt-0">
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${mail.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {mail.status}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-1">{new Date(mail.sentAt).toLocaleString('da-DK')}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-2xl">
                <h3 className="font-bold text-sm uppercase tracking-widest text-primary mb-2">Rediger Skabeloner (Kommer snart)</h3>
                <p className="text-sm text-muted-foreground">Systemet er nu klargjort med databasemodeller til skabelon-styring. Editoren tilknyttes i næste iteration.</p>
            </div>
        </div>
    );
}

function AdsTab({ ads, setAds }: { ads: any[], setAds: any }) {
    const [isCreating, setIsCreating] = useState(false);
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-merriweather font-bold">Native Ads</h2>
                <button onClick={() => setIsCreating(!isCreating)} className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
                    {isCreating ? 'Afbryd' : '+ Opret Ny'}
                </button>
            </div>

            {isCreating && (
                <div className="mb-8 p-6 border border-primary/30 bg-primary/5 rounded-2xl">
                    <p className="text-sm font-semibold mb-4">Ad Oprettelsesformular (Placeholder)</p>
                    <p className="text-xs text-muted-foreground">Her indsættes felterne (Headline, Billede, LinkUrl, Placering). API endpoints er klar bagved.</p>
                </div>
            )}

            <div className="grid gap-4">
                {ads.map(ad => (
                    <div key={ad.id} className="p-4 border border-border rounded-xl flex items-center justify-between">
                        <div>
                            <p className="font-bold">{ad.headline}</p>
                            <p className="text-xs text-muted-foreground">Placering: {ad.placement} | Aktiv: {ad.isActive ? 'Ja' : 'Nej'}</p>
                        </div>
                    </div>
                ))}
                {ads.length === 0 && !isCreating && <p className="text-muted-foreground text-sm">Ingen Native Ads oprettet endnu.</p>}
            </div>
        </div>
    );
}
