import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const slug = "navigation-paa-langfart";
    const title = "Kunsten at finde vej på de store have: En guide til navigation ved langturssejlads";
    const content = `<p>Langturssejlads – eller cruising – er drømmen om frihed, men det er også en disciplin, der kræver dyb respekt for elementerne og en solid værktøjskasse af navigationsfærdigheder. Når landjorden forsvinder i horisonten, og man er overladt til sig selv i ugevis, skifter navigationen karakter fra at være en visuel øvelse til at være en strategisk proces.</p>

<p>Denne artikel gennemgår de vigtigste elementer i moderne og traditionel navigation for langturssejlere.</p>

<h3>1. Den strategiske ruteplanlægning (Passage Planning)</h3>
<p>Før ankeret overhovedet lettes, begynder navigationen ved kortbordet. Ved langturssejlads handler det ikke bare om den korteste vej, men om den sikreste og mest behagelige vej.</p>

<p><strong>Pilot-atlasser og 'Pilot Books':</strong> Erfarne sejlere benytter sig af historiske data om vind og strøm (Pilot Charts), der viser sandsynligheden for vindretninger og styrke i specifikke måneder.</p>

<p><strong>Weather Routing:</strong> I dag bruger de fleste sejlere software (som f.eks. PredictWind eller Squid), der beregner den optimale rute baseret på GRIB-filer (vejrdata). Man sejler ofte en længere distance for at undgå modvind eller ekstreme lavtryk.</p>

<p><strong>Waypoints og nødhavne:</strong> En god plan inkluderer altid "Plan B". Hvor kan vi søge ly, hvis roret knækker, eller vejret bliver for voldsomt?</p>

<h3>2. Det elektroniske setup: Det moderne hjerte</h3>
<p>I dag er kortplotteren bådens nervecenter, men på langtur er redundans (backups) altafgørende.</p>

<p><strong>Kortplotter og AIS:</strong> En moderne plotter integreret med AIS (Automatic Identification System) er uundværlig. AIS gør det muligt at se fragtskibe og andre sejlere på skærmen – og vigtigst af alt: de kan se dig.</p>

<p><strong>Radar:</strong> På de store have er tåge og natsejlads en del af hverdagen. Radaren er din eneste ven, når du skal spotte regnbyger (squalls) eller både uden AIS.</p>

<p><strong>Satellitkommunikation:</strong> Starlink, Iridium GO! eller Garmin inReach gør det muligt at modtage opdaterede vejrudsigter midt på Atlanten, hvilket har revolutioneret måden, vi navigerer på.</p>

<h3>3. Traditionel navigation: Din forsikring mod strømsvigt</h3>
<p>Elektronik og saltvand er en dårlig kombination. En lynudladning eller en kortslutning kan mørklægge båden på et sekund. Derfor skal en langturssejler mestre det klassiske håndværk.</p>

<p><strong>Papirsøkort:</strong> Hav altid oversigtskort over de oceaner og kyststrækninger, du sejler i. De løber aldrig tør for strøm.</p>

<p><strong>Bestiksejlads (Dead Reckoning):</strong> Ved at logge bådens kurs (kompas) og fart (log) hver time, kan man indtegne sin position på et papirkort. Selvom det ikke er lige så præcist som GPS, holder det dig orienteret om din omtrentlige position.</p>

<p><strong>Sekstanten (Astronavigation):</strong> Mange langturssejlere medbringer stadig en sekstant. Ved at måle vinklen mellem himmellegemer (sol, måne, stjerner) og horisonten kan man bestemme sin position med imponerende nøjagtighed.</p>

<h3>4. Navigation i praksis: Vagtrutiner og observation</h3>
<p>Navigation på langtur stopper aldrig. Det er en 24-timers disciplin.</p>

<p><strong>Logbog:</strong> En af de vigtigste navigationsopgaver er at føre logbog. Her noteres position, kurs, vindforhold og barometerstand hver 2. til 4. time. Dette gør det muligt at spore vejrets udvikling og have en frisk position, hvis strømmen går.</p>

<p><strong>Landkending:</strong> Når man nærmer sig land efter uger på havet, skifter navigationen til "Coastal Navigation". Her er udfordringen strøm, tidevand og trafik. Det kræver forberedelse af de lokale forhold, før man overhovedet kan se land.</p>

<h3>5. De tre gyldne regler for navigatøren</h3>
<p><strong>Stol aldrig på kun én kilde:</strong> Sammenlign altid din kortplotter med dine egne observationer og dit papirkort.</p>

<p><strong>Hold øje med barometeret:</strong> På havet er lufttrykket din bedste indikator for kommende vejrskift, som kan tvinge dig til at ændre kurs.</p>

<p><strong>Kend dit tidevand:</strong> Især ved kystnær sejlads og indsejling til fremmede havne kan tidevand og strøm være mere afgørende end vindens retning.</p>

<div class="p-5 mt-6 bg-muted/50 border border-border/80 rounded-2xl">
    <div class="flex gap-3">
        <div>
            <strong class="text-foreground block mb-1">Afsluttende bemærkning</strong>
            <span class="text-sm">Navigation til langturssejlads er en balancegang mellem moderne teknologi og gammelt sømandskab. Den bedste navigatør er ikke ham med den største skærm, men ham der forstår dataene, forudser vejret og altid har et opdateret papirkort liggende klar på bordet.</span>
        </div>
    </div>
</div>`;

    const result = await prisma.faqArticle.upsert({
        where: { slug },
        update: { title, content },
        create: { title, slug, content, order: 10, status: 'PUBLISHED' },
    });

    console.log("Successfully updated FAQ:", result.title);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
