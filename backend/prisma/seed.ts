import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Password for all dummy users
    const passwordHash = await bcrypt.hash('password123', 10);

    const usersData = [
        { name: 'Mads', email: 'mads@example.com' },
        { name: 'Signe', email: 'signe@example.com' },
        { name: 'Christian', email: 'christian@example.com' },
        { name: 'Freja', email: 'freja@example.com' },
        { name: 'Peter', email: 'peter@example.com' },
    ];

    const boatsData = [
        { name: 'S/Y Nordstjernen', description: 'En solid Hallberg-Rassy 42 klare til verdenshavene.', coverImage: 'https://images.unsplash.com/photo-1544321045-31cece73ccf2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { name: 'S/Y Havanna', description: 'Beason 36 undervejs mod Caribien og måske videre i Stillehavet.', coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { name: 'S/Y Penelope', description: 'Beneteau Oceanis på eventyr over det blå Ocean.', coverImage: 'https://images.unsplash.com/photo-1518044738734-93e1fd0ce6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { name: 'S/Y Fregatten', description: 'Bavaria 40 Cruiser med en storvoksen besætning fra Fyn.', coverImage: 'https://images.unsplash.com/photo-1505364407870-ab1df7bd5f73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { name: 'S/Y Karoline', description: 'Et flydende hjem gennem Europas kanaler mod Middelhavet.', coverImage: 'https://images.unsplash.com/photo-1473042904451-00171c69419d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    ];

    const youtubeVideos = [
        'https://www.youtube.com/embed/jfKfPfyJRdk', // dummy lo-fi video or similar
        'https://www.youtube.com/embed/LXb3EKWsInQ',
        null,
        null,
        'https://www.youtube.com/embed/A3PDXmYoF5U'
    ];

    const articleTitles = [
        'Klargøring til atlantkrydset',
        'De første dage på åbent hav',
        'Delfiner i stævnen',
        'Mødet med en hval',
        'Fremme ved paradis',
        'Vindstille og spejlblankt vand',
        'Den store storm i Biscayen',
        'Natsejlads under stjernerne',
        'Vi fangede en Guldmakrel!',
        'Ankerpladsen for os selv',
        'Når autopiloten strejker',
        'Lokale markeder og friske frugter',
        'Et uventet møde med kystvagten',
        'At krydse ækvator for første gang',
        'Sygdom ombord - hvordan klarer vi det?',
        'Sejlads i passatvinden - en drøm',
        'Hvad gør vi når vandmakeren fejler?',
        'At fejre jul under varme himmelstrøg',
        'Besøg af de flyvefisk',
        'Forberedelser før orkansæsonen'
    ];

    const articleContents = [
        'Det har været nogle travle måneder. Listen over opgaver var lang: rigning skulle tjekkes, watermaker renses, og ikke mindst proviantering til over 20 dage til søs. Vi har købt nok dåsetomater og pasta til at brødføde en lille hær. Men nu er vi endelig klar tager afsted i morgen med første lys.',
        'Søsygen har sat ind, og alt gynge frem og tilbage. Men vejret er fantastisk! Vi skyder 6 knob for et spilet forsejl, og motoren har været slukket siden vi passerede havnemolen. Nættervagtterne er magiske, selvom kaffen smager af saltvand.',
        'I dag skete det endelig! En stor flok delfiner valgte at svømme med os i over en time. De surfede i bovvandet og kiggede nysgerrigt op på os. Det er præcis for de her øjeblikke vi valgte at sige farvel til hverdagen derhjemme. Fantastisk natur.',
        'Bølgerne har lagt sig helt ned. Vinden er forsvundet. Vi har motoret de seneste 12 timer for at komme ud af vindhullet. Det er frustrerende, og det mærkes på dieseltanken. Heldigvis melder GRIB-filerne at vinden vender tilbage i nat med lovende 15-20 knob ude fra øst.',
        'Klokken 04:30 råbte Signe nede fra kahytten at noget havde ramt vores blink på fiskestangen. Mænd og kvinder på dæk, og efter 40 minutters intens kamp landede vi en Mahi-mahi (Guldmakrel) på næsten 12 kilo! Det betyder fisk på menuen de næste tre dage. Livet er herligt.'
    ];

    for (let i = 0; i < 5; i++) {
        // Check if user exists, else create
        let user = await prisma.user.findUnique({ where: { email: usersData[i].email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: usersData[i].name,
                    email: usersData[i].email,
                    passwordHash: passwordHash
                }
            });
            console.log(`Created user: ${user.name}`);
        }

        // Create a boat
        const boat = await prisma.boat.create({
            data: {
                name: boatsData[i].name,
                description: boatsData[i].description,
                coverImage: boatsData[i].coverImage
            }
        });
        console.log(`Created boat: ${boat.name}`);

        // Link user to boat
        await prisma.crewMember.create({
            data: {
                userId: user.id,
                boatId: boat.id,
                role: 'BOAT_ADMIN'
            }
        });
        console.log(`Linked ${user.name} to ${boat.name}`);

        // Create 5 articles for this boat
        for (let j = 0; j < 5; j++) {
            // distribute some random time in the past
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - (i * 10 + j * 3));

            const articleIndex = (i * 5 + j) % articleTitles.length;
            const contentIndex = j % articleContents.length;
            const videoIndex = (i + j) % youtubeVideos.length;

            await prisma.article.create({
                data: {
                    title: articleTitles[articleIndex],
                    content: articleContents[contentIndex],
                    youtubeUrl: youtubeVideos[videoIndex],
                    status: 'PUBLISHED',
                    authorId: user.id,
                    boatId: boat.id,
                    createdAt: pastDate,
                }
            });
        }
        console.log(`Pushed 5 articles for ${boat.name}`);
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
