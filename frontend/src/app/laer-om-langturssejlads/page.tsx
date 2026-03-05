import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HelpCircle, Anchor, Ship, Coins, LifeBuoy, BookOpen, ShieldCheck, Users } from 'lucide-react';

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

                        {/* Forsikring Artikel */}
                        <article className="bg-card border border-border shadow-sm rounded-3xl p-8 md:p-10 transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/60">
                                <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold font-merriweather">Forsikring</h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert text-foreground leading-relaxed font-medium opacity-90">
                                <p>
                                    Når du står til søs, er det altafgørende at have styr på forsikringerne. En standard rejseforsikring dækker sjældent under oceansejlads, og slet ikke hvis du opholder dig langt fra kysten.
                                </p>

                                <h3>Gaste- og ansvarsforsikring</h3>
                                <p>
                                    Som gast er det <strong>dit eget ansvar</strong> at have en dækkende rejseforsikring til havs, som typisk skal købes som et specialtillæg. Sørg for at den dækker "ocean sailing" eller "offshore" og tjek hvor mange <em>sømil fra kysten</em> den gælder. Nogle forsikringer stopper ved 12 sømil, mens andre dækker globalt.
                                </p>

                                <h3>Bådens forsikring</h3>
                                <p>
                                    Båden bør have en <strong>kaskoforsikring</strong> og en <strong>ansvarsforsikring</strong>. Som gast er det helt fair at spørge Kaptajnen om indholdet af disse, og især om bådens ansvarsforsikring dækker personskade på besætningen.
                                </p>

                                <div className="p-5 mt-6 bg-muted/50 border border-border/80 rounded-2xl">
                                    <div className="flex gap-3">
                                        <ShieldCheck className="text-foreground shrink-0 w-6 h-6" />
                                        <div>
                                            <strong className="text-foreground block mb-1">Tjek især ulykkesdækningen</strong>
                                            <span className="text-sm">Bliver du syg langt ude på havet, kan en lægehelikopter eller <em>Search and Rescue</em> (SAR) operation løbe op i en enorm regning. Din forsikring <strong>skal</strong> dække transport i land.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Sikkerhed til søs Artikel */}
                        <article className="bg-card border border-border shadow-sm rounded-3xl p-8 md:p-10 transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/60">
                                <div className="p-3 bg-red-500/10 text-red-600 rounded-xl">
                                    <LifeBuoy className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold font-merriweather">Sikkerhed til søs</h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert text-foreground leading-relaxed font-medium opacity-90">
                                <p>
                                    Sikkerhed er <strong>kaptajnens øverste ansvar</strong>, men det er <strong>besætningens fælles opgave</strong>. Før I forlader havn for første gang, skal kaptajnen afholde en <em>Safety Briefing</em>.
                                </p>

                                <h3>Den obligatoriske Safety Briefing</h3>
                                <p>
                                    Du skal vide præcist hvor alle sikkerhedsforanstaltninger findes, og hvordan de fungerer:
                                </p>
                                <ul>
                                    <li><strong>Redningsveste:</strong> Hvor er de, hvordan tilpasses de, og hvornår er de obligatoriske?</li>
                                    <li><strong>Brandslukker & Brandtæppe:</strong> Hvor er de placeret, og hvordan betjenes de? Hvor er brandtæppet i kabyssen (køkkenet)?</li>
                                    <li><strong>Redningsflåde (Liferaft):</strong> Hvor er den placeret, og hvordan udløses den i en nødssituation?</li>
                                    <li><strong>Grab-bag (Nødtaske):</strong> Hvad er i den, hvem har ansvaret for at tage den med, og hvor er den placeret?</li>
                                    <li><strong>VHF Radio, EPIRB og nødblus:</strong> Hvordan sender du et <em>Mayday</em> opkald, og hvordan udløser du nødudstyret ifald Kaptajnen er ukampdygtig?</li>
                                </ul>

                                <h3>Livlinen (Tether) er din bedste ven</h3>
                                <p>
                                    Nattevagter, usigtbart vejr og høj sø kræver altid at man spænder sin livline (Tether) fast - især når man forlader cockpittet. Reglen er nem: <em>En mand i vandet (MOB) om natten findes sjældent igen.</em>
                                </p>
                            </div>
                        </article>

                        {/* Samarbejdet ombord */}
                        <article className="bg-card border border-border shadow-sm rounded-3xl p-8 md:p-10 transition-shadow hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/60">
                                <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold font-merriweather">Samarbejdet ombord</h2>
                            </div>

                            <div className="prose prose-lg dark:prose-invert text-foreground leading-relaxed font-medium opacity-90">
                                <p>
                                    En sejlbåd er et mikrokosmos, hvor man deler alt. Den trange plads kræver mere hensynstagen, overbærenhed og åben kommunikation end noget andet sted på jorden. Pludselig er dine bofæller også dem du stoler yderst på i en storm.
                                </p>

                                <h3>Kaptajnens ord er lov (på vandet)</h3>
                                <p>
                                    Det er ikke et diktatur, men for sikkerhedens skyld er det altid Kaptajnen <strong>der har det sidste ord</strong>. I tilfælde af tvivl eller kritiske manøvrer følger man ordre. Senere nede i kahytten kan man tage snakken, hvis man var uenig i beslutningen.
                                </p>

                                <h3>Vagtplaner og rutiner</h3>
                                <p>
                                    Hav respekt for <strong>vagtplanen</strong>. Skift vagt til det aftalte <em>præcise tidspunkt</em>. Hvis du kommer 10 minutter for sent til nattevagten, betyder det at det trætte besætningsmedlem får 10 minutter mindre søvn.
                                </p>

                                <h3>Deltag aktivt i "the boring stuff"</h3>
                                <p>
                                    At sejle de varme lande er 10% delfiner og cocktails i sandet. 90% er opvask i modvind, madlavning på et skråt komfur og udskiftning af pumper på toilettet i 35 graders varme. Tilbyd din hjælp før du bliver spurgt!
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
