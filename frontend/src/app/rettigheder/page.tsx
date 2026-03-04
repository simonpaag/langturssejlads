'use client';

import { useState } from 'react';
import { ShieldCheck, Mail, Send, Info, UserX, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function RightsPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
            const res = await fetch(`${apiUrl}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            if (res.ok) {
                setSuccess(true);
                setName('');
                setEmail('');
                setMessage('');
            } else {
                const data = await res.json();
                setError(data.error || 'Kunne ikke afsende beskeden. Prøv igen senere.');
            }
        } catch (err) {
            setError('Netværksfejl. Prøv igen senere.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-muted/30 border-b border-border py-16 md:py-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-merriweather font-black text-foreground drop-shadow-sm leading-tight mb-6">
                        Rettigheder & Vilkår
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        På Langturssejlads.dk ejer logbogsforfatterne deres eget materiale. Her er vores aftale om, hvordan vi samarbejder.
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-16 md:py-24 space-y-16">

                {/* Guidelines Content */}
                <section className="prose prose-lg md:prose-xl max-w-none font-merriweather text-foreground/90 leading-relaxed dark:prose-invert">
                    <h2 className="text-3xl font-black mb-6 text-foreground flex items-center gap-3">
                        <span className="text-primary">01.</span> Hvem ejer indholdet?
                    </h2>
                    <p>
                        <strong>Kort og godt: Det gør du selv.</strong> Alt tekst, videoer og logbogsindlæg, du eller din besætning
                        publicerer på the dashboard, forbliver jeres eksklusive ejendom. Vores tjeneste fungerer udelukkende som en publiceringsplatform (et digitalt værft).
                    </p>

                    <div className="bg-muted/30 border border-border rounded-2xl p-6 md:p-8 my-10 not-prose">
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" /> Vores Brugsret
                        </h3>
                        <p className="text-muted-foreground mb-0">
                            Ved at udgive dit indhold overdrager du til <em>Langturssejlads.dk</em> en global, ikke-eksklusiv og royaltyfri licens til at fremvise teksterne, trække statistik, og citere fra dine togt på selve netstedet samt på <strong>Langturssejlads.dk's egne tilknyttede the sociale medier</strong>.
                        </p>
                    </div>

                    <h2 className="text-3xl font-black mb-6 text-foreground flex items-center gap-3 mt-16">
                        <span className="text-primary">02.</span> Sletning & Tilbagetrækning
                    </h2>
                    <p>
                        Vi binder ingen sejlere til masten! Ønsker du at fjerne dele af jeres rejsedagbog, kan al data
                        når som helst fjernes. Du skal blot logge ind i "Kaptajnens Kahyt" (dashboardet), navigere til Logbog, og slette det pågældende indlæg. Det fjernes in-memory fra vores forside-feed øjeblikkeligt. Skal the båd slettes komplet, rækker du blot ud til mandskabet.
                    </p>
                </section>

                <hr className="border-border" />

                {/* Contact Section */}
                <section id="support" className="pt-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-merriweather font-bold mb-4">Har du brug for hjælp?</h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            Hvis dit sletteværktøj driller, eller the logs skal destrueres, så skriv en besked
                            direkte til the Admin Console. Vi sidder klar med redningskransen.
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto bg-card border border-border rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary-light to-accent"></div>

                        {success ? (
                            <div className="text-center py-12 px-4">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold font-merriweather mb-3">Beskeden er afsendt!</h3>
                                <p className="text-muted-foreground mb-8">
                                    Vi vender tilbage til din email ({email}) hurtigst muligt. Tak for at benytte platformen.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="text-sm font-bold uppercase tracking-widest text-primary hover:text-primary-light transition-colors"
                                >
                                    &larr; Skriv en ny besked
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-bold mb-3 uppercase tracking-widest text-muted-foreground">Navn / Båd</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="S/Y Nordstjernen"
                                            className="w-full px-5 py-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold mb-3 uppercase tracking-widest text-muted-foreground">E-mail Adresse</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="kaptajn@skib.dk"
                                            className="w-full px-5 py-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-bold mb-3 uppercase tracking-widest text-muted-foreground">Din Henvendelse</label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Beskriv problemet..."
                                        rows={6}
                                        className="w-full px-5 py-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-y font-medium leading-relaxed"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-foreground text-background hover:bg-primary font-bold px-6 py-5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-3 mt-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    {isSubmitting ? 'Sender ticket til hovedkvarteret...' : 'Send Besked til Admins'}
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
