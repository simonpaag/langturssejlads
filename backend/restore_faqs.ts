import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const articles = [
        {
            title: "Hvad er køjepenge?",
            slug: "hvad-er-koejepenge",
            order: 1,
            content: `Når man stikker til søs som gast på delemandskab og betaler <strong>"Køjepenge"</strong>, forveksles aftalen oftest med et <em>cruisetogt</em> eller passager-færgerejse. Realiteten er dog en ganske anden, og forståelsen tager oftest form i form af solidarisk skibsdrift.

<h3>Et solidarisk bidrag</h3>
At have en sejlbåd - især én der kan sejle på verdenshavene - koster formuer i slitage, vedligehold, bådforsikringer, slidte sejl og kostbare motorreparationer. Køjepenge betragtes traditionelt som dækning af dette <strong>kollektive slid</strong> på fartøjet per person pr. måned eller uge. Det er et <em>solidarisk skibsbudget</em>, hvor alle bidrager for at skibet holdes flydende og sejlklart under turen.

<h3>Ikke en betalt charterferie</h3>
Som gast med Køjepenge køber man altså ikke en rejseservice. Man er en aktiv medkaptajn (crew) - der bare ikke selv ejer skibet. Der forventes hyppigt vagtplaner (også om natten), og deltagelse i rengøring, madlavning og alt skibsmæssigt vedligehold undervejs over Atlanterhavet eller Middelhavet.

<div class="p-5 mt-6 bg-muted/50 border border-border/80 rounded-2xl">
    <div class="flex gap-3">
        <div>
            <strong class="text-foreground block mb-1">Hold god stil</strong>
            <span class="text-sm">Aftal altid Køjepenge og mad/havne-budget-andele på skrift (Gastekontrakt) før du stikker til søs, så forventningerne er krystalklare ombord og på dæk.</span>
        </div>
    </div>
</div>`
        },
        {
            title: "Samarbejdet ombord",
            slug: "samarbejdet-ombord",
            order: 2,
            content: `En sejlbåd er et mikrokosmos, hvor man deler alt. Den trange plads kræver mere hensynstagen, overbærenhed og åben kommunikation end noget andet sted på jorden. Pludselig er dine bofæller også dem du stoler yderst på i en storm.

<h3>Kaptajnens ord er lov (på vandet)</h3>
Det er ikke et diktatur, men for sikkerhedens skyld er det altid Kaptajnen <strong>der har det sidste ord</strong>. I tilfælde af tvivl eller kritiske manøvrer følger man ordre. Senere nede i kahytten kan man tage snakken, hvis man var uenig i beslutningen.

<h3>Vagtplaner og rutiner</h3>
Hav respekt for <strong>vagtplanen</strong>. Skift vagt til det aftalte <em>præcise tidspunkt</em>. Hvis du kommer 10 minutter for sent til nattevagten, betyder det at det trætte besætningsmedlem får 10 minutter mindre søvn.

<h3>Deltag aktivt i "the boring stuff"</h3>
At sejle de varme lande er 10% delfiner og cocktails i sandet. 90% er opvask i modvind, madlavning på et skråt komfur og udskiftning af pumper på toilettet i 35 graders varme. Tilbyd din hjælp før du bliver spurgt!`
        }
    ];

    for (const article of articles) {
        await prisma.faqArticle.upsert({
            where: { slug: article.slug },
            update: {},
            create: article,
        });
    }
    console.log("Artikler successfully seeded!");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
