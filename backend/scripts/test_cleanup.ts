import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Starter sletning af alt testdata...');

    // Slet alt udover pre-definerede system administratorer.
    // Pga. foreign keys i databasen skal vi slette tingene nedefra og op!

    // 1: Slet kommentarer og reaktioner (Votes)
    await prisma.postVote.deleteMany();
    
    // 2: Slet Opslagstavle beskeder (Noticeboard)
    await prisma.message.deleteMany();

    // 3: Slet Indlæg/Logs (Posts)
    await prisma.post.deleteMany();

    // 4: Slet Tilmeldinger til Togter og Togterne selv
    await prisma.voyageParticipation.deleteMany();
    await prisma.voyage.deleteMany();

    // 5: Slet Båd Invitationer og Anmodninger
    await prisma.boatInvitation.deleteMany();
    await prisma.joinRequest.deleteMany();

    // 6: Slet Crew medlemskaber
    await prisma.crewMember.deleteMany();
    await prisma.boatSubscription.deleteMany();

    // 7: Slet selve Bådene
    await prisma.boat.deleteMany();

    // 8: Slet alle Brugere, UNDERTAGEN dem der er markeret `isSystemAdmin = true`
    const deletedUsers = await prisma.user.deleteMany({
        where: {
            isSystemAdmin: false
        }
    });

    console.log(`\nOprydning fuldført!`);
    console.log(`Slettede ${deletedUsers.count} test-brugere.`);
    console.log(`Alle både, logbøger, togter, beskeder og invitationer er nulstillet.`);
    console.log(`\nDin admin-konto er intakt! Platformen er nu klar til Launch 🚀`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
