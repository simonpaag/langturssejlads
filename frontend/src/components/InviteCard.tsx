'use client';

import { useState } from 'react';
import { Send, Anchor } from 'lucide-react';

export default function InviteCard() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setSuccess(true);
                setEmail('');
            } else {
                const data = await res.json();
                setError(data.error || 'Kunne ikke sende invitationen.');
            }
        } catch (err) {
            setError('Netværksfejl. Prøv igen senere.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-[#0f2c59] text-white rounded-[1.5rem] p-8 border border-white/10 shadow-xl flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                    <Anchor className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="font-merriweather text-2xl font-bold mb-3">Besked i en flaske...</h3>
                <p className="text-blue-100/80 max-w-sm mx-auto leading-relaxed">
                    Invitationen er smidt i vandet og driver i dette øjeblik mod deres indbakke! Tak for tippet.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-8 text-xs font-bold uppercase tracking-widest text-blue-300 hover:text-white transition-colors"
                >
                    &larr; Giv endnu et praj
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-[#0f2c59] to-[#0a1e3f] text-white rounded-[1.5rem] p-8 md:p-10 border border-[#0f2c59]/50 shadow-2xl relative overflow-hidden h-full group">
            {/* Dekorativ baggrunds-effekt */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                <Anchor className="w-64 h-64" />
            </div>

            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-6 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-blue-100">Invitér en ven</span>
                </div>

                <h3 className="text-3xl font-merriweather font-bold mb-3 leading-tight">
                    Mangler en båd du kender?
                </h3>

                <p className="text-blue-100/70 text-base leading-relaxed mb-8 max-w-md">
                    Giv dem et praj. Skriv deres e-mail herunder, så smider vi en venlig besked i flasken med en invitation til at sætte deres logbog i vores havn.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="kaptajn@skib.dk"
                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 pr-12 text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
                            required
                        />
                        <Send className="absolute right-4 top-4 w-5 h-5 text-blue-200/50 pointer-events-none" />
                    </div>

                    {error && (
                        <span className="text-xs text-red-400 font-bold px-1">{error}</span>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || !email}
                        className="w-full bg-white text-[#0f2c59] hover:bg-blue-50 font-bold px-6 py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                    >
                        {isSubmitting ? 'Smider flasken i vandet...' : 'Send Invitation Nu'}
                    </button>
                </form>
            </div>
        </div>
    );
}
