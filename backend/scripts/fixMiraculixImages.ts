import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Retter Miraculix billeder (wsrv.nl migration og double-space class fix)...");
    const posts = await prisma.post.findMany({
        where: { boat: { slug: "sy-miraculix" } }
    });

    let updatedCount = 0;

    for (const post of posts) {
        let changed = false;

        let newContent = post.content || '';
        if (newContent) {
            // Fix double spaces and non-breaking spaces in old alignnone class that the prior regex missed
            newContent = newContent.split('class="alignnone').join('class="rounded-xl shadow-lg my-4 max-h-[80vh] w-auto inline-block object-contain" data-old="');

            // Migrate images.weserv.nl to wsrv.nl inside content
            newContent = newContent.split('images.weserv.nl').join('wsrv.nl');

            // Re-apply width/height stripping JUST IN CASE they were previously missed on the double-space tags
            newContent = newContent.replace(/\s+width="\d+"/g, '');
            newContent = newContent.replace(/\s+height="\d+"/g, '');

            if (newContent !== post.content) {
                changed = true;
            }
        }

        let newImageUrl = post.imageUrl;
        if (newImageUrl && newImageUrl.includes('images.weserv.nl')) {
            newImageUrl = newImageUrl.replace('images.weserv.nl', 'wsrv.nl');
            changed = true;
        }

        if (changed) {
            await prisma.post.update({
                where: { id: post.id },
                data: {
                    content: newContent,
                    imageUrl: newImageUrl
                }
            });
            console.log(`✅ Patchede indlæg: ${post.title}`);
            updatedCount++;
        }
    }

    console.log(`✨ Succes! ${updatedCount} indlæg er patched til wsrv.nl og de knækkede billeder er reddet.`);
}

main()
    .catch(e => {
        console.error("Fejl:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
