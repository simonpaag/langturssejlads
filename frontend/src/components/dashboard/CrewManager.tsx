import { useState, useEffect } from 'react';
import { Users, UserPlus, ShieldAlert, Trash2, Shield, Mail, CheckCircle2, Copy } from 'lucide-react';
import AnimatedLoader from '@/components/AnimatedLoader';
import { getFallbackImage } from '@/utils/fallbackImage';

export default function CrewManager({ boatId, myRole }: { boatId: number, myRole: string }) {
    const [crew, setCrew] = useState<any[]>([]);
    const [invites, setInvites] = useState<any[]>([]);
    const [joinRequests, setJoinRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('CREW');
    const [isInviting, setIsInviting] = useState(false);

    useEffect(() => {
        if (myRole === 'OWNER' || myRole === 'ADMIN') {
            fetchCrewData();
        } else {
            setIsLoading(false);
        }
    }, [boatId, myRole]);

    const fetchCrewData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('user_token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/boat/${boatId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-store'
            });
            if (res.ok) {
                const data = await res.json();
                setCrew(data.crew);
                setInvites(data.invites);
                setJoinRequests(data.joinRequests || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;
        setIsInviting(true);
        const token = localStorage.getItem('user_token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ boatId, email: inviteEmail, role: inviteRole })
            });
            const text = await res.json();
            if (res.ok) {
                setInviteEmail('');
                fetchCrewData();
                alert(text.message);
            } else {
                alert(text.error || 'Fejl ved invitation');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsInviting(false);
        }
    };

    const handleDeleteInvite = async (inviteId: number) => {
        if (!confirm('Sikker på du vil slette denne invitation?')) return;
        const token = localStorage.getItem('user_token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/invite/${inviteId}/boat/${boatId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchCrewData();
            } else {
                alert('Kunne ikke slette invitationen');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleResendInvite = async (inviteId: number) => {
        const token = localStorage.getItem('user_token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/invite/${inviteId}/resend/boat/${boatId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Invitation gensendt!');
                fetchCrewData();
            } else {
                const err = await res.json();
                alert(err.error || 'Kunne ikke gensende invitation');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAcceptRequest = async (reqId: number) => {
        const token = localStorage.getItem('user_token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/join-request/${reqId}/accept/boat/${boatId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchCrewData();
            } else {
                const err = await res.json();
                alert(err.error || 'Kunne ikke acceptere anmodning');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleRejectRequest = async (reqId: number) => {
        const token = localStorage.getItem('user_token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/join-request/${reqId}/reject/boat/${boatId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchCrewData();
            } else {
                const err = await res.json();
                alert(err.error || 'Kunne ikke afvise anmodning');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleRoleUpdate = async (userId: number, currentRole: string, newRole: string) => {
        if (currentRole === newRole) return;
        const token = localStorage.getItem('user_token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/${userId}/boat/${boatId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ newRole })
            });
            if (res.ok) {
                fetchCrewData();
            } else {
                const txt = await res.json();
                alert(txt.error || 'Kunne ikke opdatere rolle.');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleRemoveCrew = async (userId: number) => {
        if (!confirm('Er du sikker på at du vil fjerne denne gast fra båden?')) return;
        const token = localStorage.getItem('user_token');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/${userId}/boat/${boatId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchCrewData();
            } else {
                const txt = await res.json();
                alert(txt.error || 'Kunne ikke fjerne gasten.');
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (myRole !== 'OWNER' && myRole !== 'ADMIN') {
        return (
            <div className="bg-background border border-border rounded-3xl p-8 shadow-xl text-center">
                <ShieldAlert className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold font-merriweather mb-2">Ingen adgang</h3>
                <p className="text-muted-foreground">Du skal være Ejer eller Admin for at administrere besætningen.</p>
            </div>
        );
    }

    if (isLoading) return <div className="p-8 text-center"><AnimatedLoader className="scale-75" /></div>;

    const translateRole = (r: string) => {
        if (r === 'OWNER') return 'Ejer';
        if (r === 'ADMIN') return 'Admin';
        if (r === 'CONTENT_MANAGER') return 'Content Manager';
        return 'Gast';
    };

    return (
        <div className="space-y-8 animate-fade-in font-inter">
            {/* Opret Invitation Boks */}
            <div className="bg-card border border-border shadow-xl rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-merriweather">Inviter ny Gast besætningsmedlem</h2>
                        <p className="text-muted-foreground text-sm">Send en email invitation til at blive en del af din besætning.</p>
                    </div>
                </div>

                <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full relative">
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">Email adresse</label>
                        <div className="absolute left-4 top-10 text-muted-foreground">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            required
                            placeholder="f.eks. mads@langturssejlads.dk"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="bg-background border border-border rounded-xl px-12 py-3 w-full focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 ml-1">Rolle</label>
                        <select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            className="bg-background border border-border rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary/30 outline-none transition-all font-medium"
                        >
                            <option value="CREW">Gast (Kan kun læse & kommentere)</option>
                            <option value="CONTENT_MANAGER">Content Manager (Udgive logbøger & redigere båd)</option>
                            <option value="ADMIN">Admin (Nærmest alt form for adgang)</option>
                            {/* Kun hvis Ejer, kan man invitere ejere, men her tildeler vi bare Gast som default, 
                                and we assume only Owners should give Owner, handled in backend if needed. */}
                            {myRole === 'OWNER' && <option value="OWNER">Ejer (Overdrag ejerskab)</option>}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isInviting || !inviteEmail}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 rounded-xl transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 h-[50px] w-full md:w-auto"
                    >
                        {isInviting ? <AnimatedLoader className="scale-50" /> : 'Send Invitation'}
                    </button>
                </form>
            </div>

            {/* Anmodninger om påmønstring */}
            {joinRequests.length > 0 && (
                <div className="bg-card border-2 border-primary/20 shadow-xl rounded-3xl overflow-hidden mt-8 animate-fade-in-up">
                    <div className="p-6 border-b border-border bg-primary/5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/20 p-2 rounded-full relative">
                                <UserPlus className="w-5 h-5 text-primary" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{joinRequests.length}</span>
                            </div>
                            <h3 className="font-bold text-lg font-merriweather text-primary">Nye ansøgninger</h3>
                        </div>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Venter på dig</span>
                    </div>
                    <ul className="divide-y divide-border/50">
                        {joinRequests.map(req => (
                            <li key={req.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background hover:bg-muted/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <img src={req.user.profileImage || getFallbackImage(req.user.id, 'avatar')} alt={req.user.name} className="w-12 h-12 rounded-full object-cover border border-border bg-background/50" />
                                    <div>
                                        <p className="font-bold text-lg">{req.user.name}</p>
                                        <p className="text-sm text-muted-foreground mt-0.5">Anmoder om at blive <strong className="text-foreground/80">Gast</strong> på dækket</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <button
                                        onClick={() => handleAcceptRequest(req.id)}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold transition-transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Accepter
                                    </button>
                                    <button
                                        onClick={() => handleRejectRequest(req.id)}
                                        className="text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Afvis
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Oversigt over sendte invites der endnu mangler at blive reageret på */}
            {invites.length > 0 && (
                <div className="bg-card border border-border shadow-xl rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-border/50 bg-muted/20 flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-bold text-lg font-merriweather">Venter på accept</h3>
                    </div>
                    <ul className="divide-y divide-border/50">
                        {invites.map(inv => (
                            <li key={inv.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background hover:bg-muted/10 transition-colors">
                                <div>
                                    <p className="font-bold flex items-center gap-2">
                                        {inv.email}
                                        <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Afventer...</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">Inviteret som <strong className="text-foreground/80">{translateRole(inv.role)}</strong></p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <button
                                        onClick={() => handleResendInvite(inv.id)}
                                        className="text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5"
                                    >
                                        <Mail className="w-4 h-4" /> Gensend
                                    </button>
                                    <button
                                        onClick={() => handleDeleteInvite(inv.id)}
                                        className="text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5"
                                    >
                                        <Trash2 className="w-4 h-4" /> Tilbagekald
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Current Crew */}
            <div className="bg-card border border-border shadow-xl rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-border/50 bg-muted/20 flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg font-merriweather">Den Nuværende Besætning</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/10 border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                            <tr>
                                <th className="p-4">Navn</th>
                                <th className="p-4">Rettigheder / Rolle</th>
                                <th className="p-4 text-right">Handlinger</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {crew.map(member => (
                                <tr key={member.user.id} className="hover:bg-muted/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {member.user.profileImage ? (
                                                <img src={member.user.profileImage} alt={member.user.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                                                    {member.user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold">{member.user.name}</p>
                                                <p className="text-xs text-muted-foreground">{member.user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {(myRole === 'OWNER' || (myRole === 'ADMIN' && member.role !== 'OWNER')) ? (
                                            <select
                                                value={member.role}
                                                onChange={(e) => handleRoleUpdate(member.user.id, member.role, e.target.value)}
                                                className="bg-transparent border border-border rounded-lg px-2 py-1 text-sm font-medium focus:ring-1 focus:ring-primary/50 outline-none w-auto max-w-xs"
                                                disabled={myRole === 'ADMIN' && member.role === 'OWNER'}
                                            >
                                                <option value="CREW">Gast (Kun læs)</option>
                                                <option value="CONTENT_MANAGER">Content Manager</option>
                                                <option value="ADMIN">Admin</option>
                                                {myRole === 'OWNER' && <option value="OWNER">Ejer</option>}
                                            </select>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-xs font-bold tracking-wide uppercase">
                                                {member.role === 'OWNER' && <Shield className="w-3 h-3 text-primary" />}
                                                {translateRole(member.role)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        {/* You can only remove someone if you're Owner, or Admin removing non-owner */}
                                        {(myRole === 'OWNER' || (myRole === 'ADMIN' && member.role !== 'OWNER')) && (
                                            <button
                                                onClick={() => handleRemoveCrew(member.user.id)}
                                                className="text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg transition-colors inline-block"
                                                title="Fjern Gast"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-sm text-foreground/80 flex gap-4 mt-8 shadow-sm">
                <ShieldAlert className="w-8 h-8 text-primary shrink-0" />
                <div>
                    <h4 className="font-bold text-primary mb-1 text-base">Hvad betyder rollerne?</h4>
                    <ul className="list-disc ml-5 space-y-1 mt-2 text-muted-foreground">
                        <li><strong className="text-foreground">Ejer (OWNER):</strong> Alle rettigheder. Kan slette båden og ændre roller frit as you wish.</li>
                        <li><strong className="text-foreground">Admin:</strong> Kan oprette nyheder, redigere bådens data og invitere ny besætning. Kan ikke fjerne en Ejer.</li>
                        <li><strong className="text-foreground">Content Manager:</strong> Kan redigere besked, togter og skrive nyheder, men kan ikke bestemme over invitationer til gastene.</li>
                        <li><strong className="text-foreground">Gast:</strong> Kan kun se data på det private 'Under Dæk' board, men kan ikke oprette indhold. Navnet figurerer på det store verdenskort.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
