import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import slugify from 'slugify';

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
        { name: 'S/Y Nordstjernen', description: 'En solid Hallberg-Rassy 42 klare til verdenshavene.', coverImage: 'https://images.unsplash.com/photo-1544321045-31cece73ccf2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', profileImage: 'https://images.unsplash.com/photo-1582098056263-6c0b9db8d227?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { name: 'S/Y Havanna', description: 'Beason 36 undervejs mod Caribien og måske videre i Stillehavet.', coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', profileImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { name: 'S/Y Penelope', description: 'Beneteau Oceanis på eventyr over det blå Ocean.', coverImage: 'https://images.unsplash.com/photo-1518044738734-93e1fd0ce6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', profileImage: 'https://images.unsplash.com/photo-1560067132-bb525cd57dbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { name: 'S/Y Fregatten', description: 'Bavaria 40 Cruiser med en storvoksen besætning fra Fyn.', coverImage: 'https://images.unsplash.com/photo-1505364407870-ab1df7bd5f73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', profileImage: 'https://images.unsplash.com/photo-1595015354922-26db1da9bdf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { name: 'S/Y Karoline', description: 'Et flydende hjem gennem Europas kanaler mod Middelhavet.', coverImage: 'https://images.unsplash.com/photo-1473042904451-00171c69419d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', profileImage: 'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
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

    const quickTexts = [
        'Vi har lige kastet anker ud for svømme-paradiset. Vandet er fuldstændig krystalklart!',
        'Motoren driller igen. Vi bruger dagen på at rode med impelleren.',
        'Så er der friskbagt brød i ovnen og kaffe på kanden.',
        'Store bølger i nat. Vi krydser fingre for vejrudsigten i morgen.',
        'Netop hejst gæsteflaget. Klar til nye oplevelser på kysten.'
    ];

    for (let i = 0; i < 5; i++) {
        // Check if user exists, else create
        let user = await prisma.user.findUnique({ where: { email: usersData[i].email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: usersData[i].name,
                    email: usersData[i].email,
                    passwordHash: passwordHash,
                    profileImage: `https://i.pravatar.cc/150?u=${usersData[i].email}`
                }
            });
            console.log(`Created user: ${user.name}`);
        }

        // Create a boat
        const boat = await prisma.boat.create({
            data: {
                name: boatsData[i].name,
                slug: slugify(boatsData[i].name, { lower: true, strict: true }),
                description: boatsData[i].description,
                coverImage: boatsData[i].coverImage,
                profileImage: boatsData[i].profileImage
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

        // Create a Voyage for the boat
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - (i * 30 + 10)); // Started between 10 to 160 days ago

        const voyage = await prisma.voyage.create({
            data: {
                title: `Sommertogt ${pastDate.getFullYear()}`,
                description: 'En lang rejse venter forude. Følg med her på ruten.',
                startDate: pastDate,
                boatId: boat.id
            }
        });
        console.log(`Created voyage for ${boat.name}`);

        // Create 5 mixed posts for this boat
        for (let j = 0; j < 5; j++) {
            // distribute some random time in the past
            const postDate = new Date();
            postDate.setDate(postDate.getDate() - (i * 10 + j * 3));

            const articleIndex = (i * 5 + j) % articleTitles.length;
            const contentIndex = j % articleContents.length;
            const videoIndex = (i + j) % youtubeVideos.length;

            const postTypes: any = ['ARTICLE', 'QUICK_TEXT', 'PHOTO', 'YOUTUBE'];
            const type = postTypes[j % 4];

            let postData: any = {
                slug: slugify(`${articleTitles[articleIndex]}-${i}-${j}`, { lower: true, strict: true }),
                postType: type,
                status: 'PUBLISHED',
                authorId: user.id,
                boatId: boat.id,
                voyageId: voyage.id,
                createdAt: postDate,
            };

            if (type === 'ARTICLE') {
                postData.title = articleTitles[articleIndex];
                postData.content = articleContents[contentIndex];
                postData.imageUrl = `https://images.unsplash.com/photo-1544321045-31cece73ccf2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sig=${i * 10 + j}`;
            } else if (type === 'QUICK_TEXT') {
                postData.content = quickTexts[j % quickTexts.length];
            } else if (type === 'PHOTO') {
                postData.imageUrl = `https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sig=${i * 10 + j}`;
                postData.content = 'Sikken udsigt her til morgen!';
            } else if (type === 'YOUTUBE') {
                postData.youtubeUrl = youtubeVideos[videoIndex] || 'https://www.youtube.com/embed/LXb3EKWsInQ';
                postData.content = 'Se vores nyeste video hjemmefra båden.';
            }

            await prisma.post.create({
                data: postData
            });
        }
        console.log(`Pushed 5 mixed posts for ${boat.name}`);
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
