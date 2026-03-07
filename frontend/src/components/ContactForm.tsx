'use client';

import { useState } from 'react';
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface ContactFormProps {
    boatId: number;
    voyageId?: number;
    boatName: string;
}

export default function ContactForm({ boatId, voyageId, boatName }: ContactFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !message) {
            setErrorMessage('Udfyld venligst alle felter.');
            setStatus('ERROR');
            return;
        }

        setStatus('LOADING');
        setErrorMessage('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/contact/boat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderName: name,
                    senderEmail: email,
                    message,
                    boatId,
                    voyageId
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Der opstod en fejl ved afsendelse.');
            }

            setStatus('SUCCESS');
            setName('');
            setEmail('');
            setMessage('');

            // Reset back to idle after a few seconds
            setTimeout(() => setStatus('IDLE'), 5000);

        } catch (error: any) {
            console.error('Submit error:', error);
            setErrorMessage(error.message);
            setStatus('ERROR');
        }
    };

    return (
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm w-full relative overflow-hidden">
            {/* Bagrundseffekt for at få det til at se premium ud */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Send className="w-32 h-32" />
            </div>

            <div className="relative z-10">
                <h3 className="text-xl font-black font-merriweather mb-1 text-foreground">
                    Send Besked til {boatName}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                    {voyageId
                        ? 'Har du spørgsmål til netop denne rejse? Send en direkte besked til kaptajnen.'
                        : 'Vil du i kontakt med besætningen? Skriv til dem her.'}
                </p>

                {status === 'SUCCESS' ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="w-12 h-12 mb-3" />
                        <h4 className="font-bold text-lg mb-1">Beskeden er sendt!</h4>
                        <p className="text-sm opacity-90">Kaptajnen har modtaget din besked i deres indbakke.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cf-name" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Dit Navn</label>
                                <input
                                    id="cf-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="F.eks. Jens Jensen"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    disabled={status === 'LOADING'}
                                />
                            </div>
                            <div>
                                <label htmlFor="cf-email" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Din Email</label>
                                <input
                                    id="cf-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="navn@email.dk"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    disabled={status === 'LOADING'}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="cf-message" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Besked</label>
                            <textarea
                                id="cf-message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Skriv din hilsen eller forespørgsel her..."
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                                disabled={status === 'LOADING'}
                            />
                        </div>

                        {status === 'ERROR' && (
                            <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'LOADING'}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3.5 rounded-xl uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 group w-full sm:w-auto self-end"
                        >
                            {status === 'LOADING' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sender...
                                </>
                            ) : (
                                <>
                                    Send Besked
                                    <Send className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
