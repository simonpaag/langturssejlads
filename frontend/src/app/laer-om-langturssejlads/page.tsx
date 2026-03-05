import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HelpCircle, Anchor, Ship, Coins, LifeBuoy, BookOpen } from 'lucide-react';

export const metadata = {
    title: 'Lær om Langturssejlads | FAQ og Nyttig Viden',
    description: 'Bliv klogere på langtursslivet. Læs om køjepenge, regler, og hvordan du forbereder dig på at stævne ud.'
};

export default function LearnAboutSailing() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 pb-24">
                {/* Hero Header */}
                <div className="bg-muted py-20 px-4 sm:px-6 lg:px-8 border-b border-border text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex justify-center items-center p-4 bg-background border border-border rounded-full shadow-sm mb-6 text-primary">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-merriweather font-black text-foreground mb-6">Lær om Langturssejlads</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Din primære kilde til uskrevne regler, faste aftaler og livet ombord på sejlbådene. Udforsk viden før du står til søs eller inviterer ombord.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                    {/* FAQ Grid */}
                    <div className="space-y-12">
                        {/* Køjepenge Artikel */}
                        <article className="bg-card border border-border shadow-sm rounded-3xl p-8 md:p-10 transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/60">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                    <Coins className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold font-merriweather">Hvad er køjepenge?</h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert text-foreground leading-relaxed font-medium opacity-90">
                                <p>
                                    Når man stikker til søs som gast på delemandskab og betaler <strong>"Køjepenge"</strong>, forveksles aftalen oftest med et <em>cruisetogt</em> eller passager-færgerejse. Realiteten er dog en ganske anden, og forståelsen tager oftest form i form af solidarisk skibsdrift.
                                </p>

                                <h3>Et solidarisk bidrag</h3>
                                <p>
                                    At have en sejlbåd - især én der kan sejle på verdenshavene - koster formuer i slitage, vedligehold, bådforsikringer, slidte sejl og kostbare motorreparationer. Køjepenge betragtes traditionelt som dækning af dette <strong>kollektive slid</strong> på fartøjet per person pr. måned eller uge. Det er et <em>solidarisk skibsbudget</em>, hvor alle bidrager for at skibet holdes flydende og sejlklart under turen.
                                </p>

                                <h3>Ikke en betalt charterferie</h3>
                                <p>
                                    Som gast med Køjepenge køber man altså ikke en rejseservice. Man er en aktiv medkaptajn (crew) - der bare ikke selv ejer skibet. Der forventes hyppigt vagtplaner (også om natten), og deltagelse i rengøring, madlavning og alt skibsmæssigt vedligehold undervejs over Atlanterhavet eller Middelhavet.
                                </p>

                                <div className="p-5 mt-6 bg-muted/50 border border-border/80 rounded-2xl">
                                    <div className="flex gap-3">
                                        <Anchor className="text-foreground shrink-0 w-6 h-6" />
                                        <div>
                                            <strong className="text-foreground block mb-1">Hold god stil</strong>
                                            <span className="text-sm">Aftal altid Køjepenge og mad/havne-budget-andele på skrift (Gastekontrakt) før du stikker til søs, så forventningerne er krystalklare ombord og på dæk.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Ekstra placeholder for format */}
                        <div className="bg-transparent border-2 border-dashed border-border/50 rounded-3xl p-8 text-center text-muted-foreground">
                            <LifeBuoy className="w-8 h-8 mx-auto mb-4 opacity-50" />
                            <h3 className="font-bold text-lg text-foreground mb-2 opacity-80">Flere artikler på vej...</h3>
                            <p className="text-sm opacity-80">Vi arbejder hele tiden på at opdatere portalen med gode råd om gastekontrakter, pakkelister og visum.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
