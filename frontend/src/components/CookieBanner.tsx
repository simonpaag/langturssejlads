'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Check, Shield } from 'lucide-react';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Tjek om brugeren allerede har truffet et valg
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'granted') {
      setConsentGiven(true);
    } else if (consent === null) {
      // Vis banner hvis der ikke er truffet et valg endnu
      // Lidt forsinkelse så det ikke fremstår aggressivt ved load
      setTimeout(() => setShowBanner(true), 1500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setConsentGiven(true);
    setShowBanner(false);
    
    // Når Consent er givet aktiverer vi et page_view event for the nuværende rute 
    // for at sikre immediate tracking ved opt-in
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
            page_path: window.location.pathname + window.location.search,
        });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setConsentGiven(false);
    setShowBanner(false);
  };

  return (
    <>
      {/* Indlæs KUN Google Analytics hvis brugeren har sagt aktivt ja (consentGiven = true) */}
      {consentGiven && <GoogleAnalytics gaId="G-967E7X94FN" />}

      {/* Selve Cookie Banner UI */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 sm:pb-8 flex justify-center items-end animate-in fade-in slide-in-from-bottom-10 duration-500 pointer-events-none">
          <div className="bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl w-full max-w-4xl p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-center pointer-events-auto">
            
            <div className="flex-1 flex gap-4">
              <div className="hidden sm:flex shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-full items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-foreground font-bold text-lg mb-1 flex items-center gap-2">
                  <span className="sm:hidden text-primary"><Shield className="w-5 h-5"/></span>
                  Vi værner om dit privatliv
                </h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  Vi bruger udelukkende cookies The at indsamle anonym statistik via Google Analytics, så vi kan forbedre platformen the the danske sejlere. Læs mere i the
                  <Link href="/om/cookies" className="text-primary hover:underline ml-1 font-bold whitespace-nowrap">
                    lille cookie-politik
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 w-full md:w-auto gap-3 flex-col sm:flex-row">
              <button 
                onClick={handleDecline}
                className="px-5 py-2.5 rounded-xl font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none border border-border/50"
              >
                <X className="w-4 h-4" /> Kun Nødvendige
              </button>
              <button 
                onClick={handleAccept}
                className="px-5 py-2.5 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 flex-1 sm:flex-none"
              >
                <Check className="w-4 h-4" /> Tillad Statistik
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
