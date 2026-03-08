import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanContent(content: string) {
    let cleaned = content;

    // 1. Fjern ubrugelige Wordpress "wp:paragraph" comments
    cleaned = cleaned.replace(/<!--\s*\/?wp:[^\s]*\s*-->/g, '');

    // 2. Erstat HTTP wordpress images med sikre HTTPS links via weserv proxy for at omgå "Mixed Content" i browseren
    cleaned = cleaned.replace(/src="http:\/\/symiraculix\.dk([^"]+)"/g, 'src="https://images.weserv.nl/?url=symiraculix.dk$1"');
    cleaned = cleaned.replace(/href="http:\/\/symiraculix\.dk([^"]+)"/g, 'href="https://images.weserv.nl/?url=symiraculix.dk$1"');

    // 3. Fiks Wordpress [caption] shortcodes - omdan til flotte HTML5 <figure> tags
    cleaned = cleaned.replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/g, (match, inner) => {
        const imgMatch = inner.match(/(<a[^>]*>)?(<img[^>]+>)(<\/a>)?([\s\S]*)/);
        if (imgMatch) {
            const aStart = imgMatch[1] || '';
            const img = imgMatch[2];
            const aEnd = imgMatch[3] || '';
            let captionText = imgMatch[4].trim();

            // Fjern en enkelt overskydende linieskift i caption
            captionText = captionText.replace(/^\n/, '');

            return `<figure class="my-8 relative w-full flex flex-col items-center">${aStart}${img}${aEnd}<figcaption class="text-sm font-bold text-center text-muted-foreground/80 mt-3 tracking-wide">${captionText}</figcaption></figure>`;
        }
        return inner; // Fallback
    });

    // NYT: Rens data for overflødig støj
    cleaned = cleaned.replace(/&nbsp;/g, ' '); // Fjern hardkodede mellemrum
    cleaned = cleaned.replace(/<p>\s*<\/p>/g, ''); // Tomme paragraphs
    cleaned = cleaned.replace(/<br\s*\/?>/g, '\n'); // Omdan <br> til newlines midlertidigt
    cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n'); // Saml alt over to linjeskift til præcis to (ét afsnits-break)

    // Fjern styling skrald fra inline billeder, og smid tailwind på i stedet
    cleaned = cleaned.replace(/class="align[a-z]+\s*size-[a-z]+\s*wp-image-\d+"/g, 'class="rounded-xl shadow-lg my-4 max-h-[80vh] w-auto inline-block object-contain"');
    // Align none
    cleaned = cleaned.replace(/class="alignnone wp-image-\d+"/g, 'class="rounded-xl shadow-lg my-4 max-h-[80vh] w-auto inline-block object-contain"');

    // NYT: Slet inline width og height attributter som blokerer w-auto
    cleaned = cleaned.replace(/\s+width="\d+"/g, '');
    cleaned = cleaned.replace(/\s+height="\d+"/g, '');


    // 4. Pak afsnit ind i rigtige <p> tags hvis de mangler (DB bruger pt \n\n)
    const blocks = cleaned.split(/\n\s*\n/);
    const formattedBlocks = blocks.map(block => {
        let b = block.trim();
        if (!b) return '';

        // Spring over hvis det allerede ER et HTML blok tag
        if (b.startsWith('<figure') || b.startsWith('<p') || b.startsWith('<div') || b.startsWith('<h1') || b.startsWith('<h2') || b.startsWith('<h3') || b.startsWith('<blockquote') || b.startsWith('<ul') || b.startsWith('<ol')) {
            return b;
        }

        // Billeder uden caption, skubber vi ind i et div layout
        if (b.startsWith('<img') || (b.startsWith('<a') && b.includes('<img'))) {
            return `<div class="my-6 flex flex-wrap gap-4 items-center justify-center">${b}</div>`;
        }

        // Ellers er det almindelig tekst -> Pak det flot ind
        return `<p>${b}</p>`;
    });

    return formattedBlocks.join('\n\n').replace(/<p><\/p>/g, '').replace(/<div[^>]*>\s*<\/div>/g, '');
}

async function main() {
    console.log("Henter Miraculix poster fra databasen...");
    const posts = await prisma.post.findMany({
        where: { boat: { slug: "miraculix" } }
    });

    for (const post of posts) {
        if (post.content) {
            const cleaned = await cleanContent(post.content);

            await prisma.post.update({
                where: { id: post.id },
                data: { content: cleaned }
            });
            console.log(`✅ Opdateret og HTML-formateret: ${post.title}`);
        }
    }

    console.log("✨ Succes! Databasen er gennemrenset og klar til fremvisning via rich text.");
}

main()
    .catch(e => {
        console.error("Fejl:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
