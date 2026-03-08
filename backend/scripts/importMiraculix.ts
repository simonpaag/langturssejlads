import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const dataPath = '/Users/simonpaag/Desktop/miraculix_data.json';

    console.log("Loading data from", dataPath);
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log("Processing User...");
    // 1. Create or Find User
    const userPassword = await bcrypt.hash('miraculix123', 10);
    let user = await prisma.user.findUnique({ where: { email: data.user.email } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: data.user.name,
                email: data.user.email,
                passwordHash: userPassword,
            }
        });
        console.log(`Created user: ${user.name}`);
    } else {
        console.log(`Found user: ${user.name}`);
    }

    console.log("Processing Boat...");
    // 2. Create or Find Boat
    let boat = await prisma.boat.findUnique({ where: { slug: data.boat.slug } });

    if (!boat) {
        boat = await prisma.boat.create({
            data: {
                name: data.boat.name,
                slug: data.boat.slug,
                description: data.boat.description,
                length: 42, // Standard Længde
            }
        });
        console.log(`Created boat: ${boat.name}`);

        // Add owner to crew
        await prisma.crewMember.create({
            data: {
                userId: user.id,
                boatId: boat.id,
                role: 'OWNER'
            }
        });
        console.log(`Added ${user.name} as OWNER to ${boat.name}`);
    } else {
        console.log(`Found boat: ${boat.name}`);
    }

    console.log("Processing Posts...");
    // 3. Create Posts
    let postsCreated = 0;
    for (const postData of data.posts) {
        let postSlug = postData.slug;

        // Ensure slug is unique if necessary, though it should be already
        let post = await prisma.post.findUnique({ where: { slug: postSlug } });

        if (!post) {
            post = await prisma.post.create({
                data: {
                    title: postData.title,
                    slug: postSlug,
                    content: postData.content,
                    postType: 'ARTICLE',
                    status: 'PUBLISHED',
                    createdAt: new Date(postData.createdAt),
                    updatedAt: new Date(postData.createdAt),
                    authorId: user.id,
                    boatId: boat.id,
                }
            });
            console.log(`Created post: ${post.title} (Slug: ${post.slug})`);
            postsCreated++;
        } else {
            console.log(`Skipped existing post: ${post.title}`);
        }
    }

    console.log(`Successfully completed import! Created ${postsCreated} new posts.`);
}

main()
    .catch(e => {
        console.error("Error during import:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
