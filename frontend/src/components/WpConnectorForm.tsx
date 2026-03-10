"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function WpConnectorForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulating API call for now since there's no backend route specified yet
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1200);
    };

    if (isSuccess) {
        return (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4 shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-merriweather text-foreground mb-2">Tak for din anmodning!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Vi har modtaget dine oplysninger og sætter din WordPress Connector op hurtigst muligt. Du hører fra os på mail!
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 text-sm font-bold text-primary hover:underline underline-offset-4"
                >
                    Send en ny anmodning
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-background rounded-2xl p-6 md:p-8 space-y-6 shadow-sm border border-border/40">
            <h4 className="text-lg font-bold font-merriweather mb-2">Ansøg om tilslutning</h4>

            <div className="space-y-4">
                <div>
                    <label htmlFor="boatName" className="block text-sm font-bold text-foreground mb-1.5 flex justify-between">
                        <span>Bådens Navn</span>
                    </label>
                    <input
                        type="text"
                        id="boatName"
                        name="boatName"
                        required
                        placeholder="F.eks. S/Y Eventyr"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-50"
                    />
                </div>

                <div>
                    <label htmlFor="blogUrl" className="block text-sm font-bold text-foreground mb-1.5 flex justify-between">
                        <span>Dit WordPress URL</span>
                    </label>
                    <input
                        type="url"
                        id="blogUrl"
                        name="blogUrl"
                        required
                        placeholder="https://minbaad.dk"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-50"
                    />
                </div>

                <div>
                    <label htmlFor="captainEmail" className="block text-sm font-bold text-foreground mb-1.5 flex justify-between">
                        <span>Kaptajnens email</span>
                    </label>
                    <input
                        type="email"
                        id="captainEmail"
                        name="captainEmail"
                        required
                        placeholder="kaptajn@minbaad.dk"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-50"
                    />
                </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Når du tilslutter din WordPress side, accepterer du vores <Link href="/rettigheder" className="text-primary hover:underline font-bold">vilkår for indholdsdeling</Link>.
                Du har altid fuld kontrol over dit eget data og kan fjerne det igen.
            </p>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-70 shadow-md hover:shadow-lg"
            >
                {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin border-solid"></span>
                ) : (
                    <>
                        Anmod om Connector
                        <Send className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    );
}
