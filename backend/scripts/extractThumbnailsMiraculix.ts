import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Henter artikler fra S/Y Miraculix for at udtrække cover-billeder...");

    const posts = await prisma.post.findMany({
        where: {
            boat: { slug: "miraculix" },
            postType: "ARTICLE"
        }
    });

    let updatedCount = 0;

    for (const post of posts) {
        if (post.content && !post.imageUrl) {
            // Find det første <img src="..."> tag vha. regular expression
            const match = post.content.match(/<img[^>]+src="([^">]+)"/);

            if (match && match[1]) {
                const extractedUrl = match[1];

                await prisma.post.update({
                    where: { id: post.id },
                    data: { imageUrl: extractedUrl }
                });

                console.log(`✅ Thumbnail sat for "${post.title}": ${extractedUrl}`);
                updatedCount++;
            } else {
                console.log(`⚠️ Intet billede fundet i indhold for: ${post.title}`);
            }
        } else if (post.imageUrl) {
            console.log(`ℹ️ Allerede et billede sat for: ${post.title}`);
        }
    }

    console.log(`\n✨ Færdig! ${updatedCount} thumbnails blev genkendt og aktiveret til forside/oversigter.`);
}

main()
    .catch(e => {
        console.error("Fejl:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
