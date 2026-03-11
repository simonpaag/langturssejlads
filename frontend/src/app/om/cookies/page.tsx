export const metadata = {
  title: 'Cookies & Privatliv | Langturssejlads.dk',
  description: 'Hvordan vi håndterer cookies hos Danske Langturssejlere.',
};

import { Shield, Cookie, Database, Mail } from 'lucide-react';
import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-12 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-8 transition-colors uppercase tracking-widest">
          &larr; Tilbage til forsiden
        </Link>
        
        <div className="bg-background rounded-3xl border border-border shadow-sm p-6 sm:p-12 overflow-hidden relative">
          {/* Dekoration */}
          <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none">
            <Shield className="w-64 h-64 rotate-12" />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
              <Cookie className="w-8 h-8" />
            </div>
            
            <h1 className="font-merriweather font-black text-3xl sm:text-5xl tracking-tight mb-6">
              Cookies & Privatliv
            </h1>
            
            <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-10 pb-10 border-b border-border">
              Hos Danske Langturssejlere er formålet at sejle, ikke at spore. Vi ønsker at skabe et sikkert fristed på nettet, hvor vi udelukkende benytter de mest nødvendige data for overhovedet at kunne drive platformen teknisk for dig.
            </p>

            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-primary" />
                  Nødvendige Cookies (Platformens funktion)
                </h2>
                <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                  <p>
                    Vores platform gemmer en teknisk fil i din browser for at huske, at du er logget ind (såkaldte <i>auth tokens</i>). Uden disse ville du hele tiden blive logget ud, hver gang du klikkede dig rundt på en ny side. Denne session slettes det øjeblik du klikker på 'Log ud'. De deles aldrig med nogen andre.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  Statistik & Valgfri Tracking (Google Analytics)
                </h2>
                <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                  <p>
                    For at forstå hvilke funktioner vores sejlere er mest glade for, og hvor vi evt. mister folk, vil vi meget gerne benytte os af simpel, anonymiseret statistik i form af Google Analytics 4 (GA4).
                  </p>
                  <p>
                    Dette værktøj aktiveres **KUN**, hvis du aktivt har klikket på "Tillad Statistik" i vores lille Cookie-banner nede i bunden af sitet. Data indsamles helt anonymt (IP-adresser er sløret). Vi benytter desuden oftest ikke scripts the marketing, men udelukkende til funktionalitet. Afviser du banneret og bruger siden alligevel, tracker vi intet ved siden af. Du kan trygt sige nej tak, hvis du foretrækker det.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                  Sletning af profil
                </h2>
                <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                  <p>
                    Hvis du ønsker at vi permanent sletter din bruger og/eller dit skatteopslag, dine båd-informationer, logbogsindlæg, send endelig en besked i forummet, the admin, eller slet i dit kontrolpanel.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
