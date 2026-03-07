'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Ship, CheckCircle2, ShieldAlert } from 'lucide-react';
import AnimatedLoader from '@/components/AnimatedLoader';

export default function InvitePage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const [inviteData, setInviteData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAccepting, setIsAccepting] = useState(false);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        setHasToken(!!localStorage.getItem('user_token'));
        const fetchInvite = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/invite/${token}`);
                if (res.ok) {
                    const data = await res.json();
                    setInviteData(data);
                } else {
                    const err = await res.json();
                    setError(err.error || 'Ugyldig eller udløbet invitation.');
                }
            } catch (e) {
                setError('Kunne ikke hente invitation. Prøv igen senere.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvite();
    }, [token]);

    const handleAccept = async () => {
        setIsAccepting(true);
        const userToken = localStorage.getItem('user_token');

        if (!userToken) {
            // Store intent and redirect to login/register
            localStorage.setItem('return_url_after_login', `/invite/${token}`);
            router.push('/dashboard'); // /dashboard is also login/register
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crew/invite/${token}/accept`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            const data = await res.json();

            if (res.ok) {
                alert('Success! ' + data.message);
                router.push('/dashboard');
            } else {
                setError(data.error || 'Kunne ikke acceptere invitationen.');
            }
        } catch (e) {
            setError('Netværksfejl.');
        } finally {
            setIsAccepting(false);
        }
    };

    if (isLoading) return <div className="min-h-[70vh] flex items-center justify-center"><AnimatedLoader /></div>;

    if (error) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="bg-card border border-border rounded-3xl p-8 max-w-lg w-full text-center shadow-xl">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold font-merriweather mb-2">Invitation Fejlede</h1>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <button onClick={() => router.push('/')} className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl transition-colors hover:bg-primary/90">
                        Gå til Forsiden
                    </button>
                </div>
            </div>
        );
    }

    const roleName = inviteData.role === 'OWNER' ? 'Ejer' :
        inviteData.role === 'ADMIN' ? 'Admin' :
            inviteData.role === 'CONTENT_MANAGER' ? 'Content Manager' : 'Gast';

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 bg-muted/20">
            <div className="bg-card border border-border shadow-2xl rounded-3xl overflow-hidden max-w-xl w-full">
                {inviteData.boat.coverImage ? (
                    <div className="h-48 w-full relative">
                        <img src={inviteData.boat.coverImage} alt={inviteData.boat.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                            <h2 className="text-white text-3xl font-bold font-merriweather">{inviteData.boat.name}</h2>
                        </div>
                    </div>
                ) : (
                    <div className="h-48 w-full bg-primary/10 flex flex-col items-center justify-center border-b border-border p-6">
                        <Ship className="w-16 h-16 text-primary mb-3" />
                        <h2 className="text-2xl font-bold font-merriweather text-primary">{inviteData.boat.name}</h2>
                    </div>
                )}

                <div className="p-8 text-center animate-fade-in-up">
                    <h1 className="text-2xl font-bold mb-4 font-merriweather">Du er inviteret ombord!</h1>
                    <p className="text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
                        Kaptajnen har inviteret <strong>{inviteData.email}</strong> til at blive en del af besætningen som <strong>{roleName}</strong>.
                        Accepter invitationen for at pakke køjesækken og deltage i fællesskabet.
                    </p>

                    <button
                        onClick={handleAccept}
                        disabled={isAccepting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 w-full sm:w-auto mx-auto h-[60px]"
                    >
                        {isAccepting ? <AnimatedLoader className="scale-75 invert" /> : (
                            <>
                                <CheckCircle2 className="w-6 h-6" />
                                Ja tak, jeg vil gerne med!
                            </>
                        )}
                    </button>

                    {!hasToken && (
                        <p className="mt-6 text-xs text-muted-foreground font-medium">
                            Bemærk: Hvis du ikke har en profil, vil du automatisk blive bedt om at oprette en.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
