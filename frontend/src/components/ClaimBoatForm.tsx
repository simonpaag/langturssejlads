'use client';

import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

interface ClaimBoatFormProps {
    boatId: number;
    boatName: string;
}

export default function ClaimBoatForm({ boatId, boatName }: ClaimBoatFormProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');
        setErrorMessage('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const response = await fetch(`${apiUrl}/api/boats/${boatId}/claim-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Noget gik galt');
            }

            setStatus('SUCCESS');
        } catch (error: any) {
            setStatus('ERROR');
            setErrorMessage(error.message);
        }
    };

    if (status === 'SUCCESS') {
        return (
            <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 mb-10 shadow-sm animate-fade-in-up">
                <CheckCircle2 className="w-8 h-8 text-green-500 mb-1" />
                <div>
                    <h3 className="font-bold text-lg font-merriweather">Anmodning sendt!</h3>
                    <p className="text-sm mt-1 opacity-90">
                        Vi har modtaget din besked, og en administrator vil kigge på det og sende en invitation til {email}.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border-2 border-primary/20 p-6 rounded-2xl mb-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <Mail className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                        Ejerløs Båd
                    </span>
                    <h3 className="text-xl font-merriweather font-bold text-foreground">Er det din båd?</h3>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6 max-w-xl leading-relaxed">
                    Denne bådprofil har endnu ingen Kaptajn. Er det din båd, <strong>{boatName}</strong>? 
                    Indtast din e-mailadresse herunder, så sender vi dig en invitation, så du kan overtage og redigere profilen.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-md w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="din@email.dk"
                            className="block w-full pl-11 pr-4 py-3 bg-background border-2 border-border/60 rounded-xl text-sm focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/70"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={status === 'LOADING'}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-primary/90 hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {status === 'LOADING' ? (
                            <>
                                <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin"></span>
                                Sender...
                            </>
                        ) : 'Anmod Ejerskab'}
                    </button>
                </form>

                {status === 'ERROR' && (
                    <p className="text-red-500 text-xs font-bold mt-3 animate-fade-in-up flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {errorMessage}
                    </p>
                )}
            </div>
        </div>
    );
}
