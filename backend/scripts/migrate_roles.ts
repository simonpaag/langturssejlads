import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Migrating BOAT_ADMIN to OWNER');
    const updateAdmins = await prisma.crewMember.updateMany({
        where: { role: 'BOAT_ADMIN' },
        data: { role: 'OWNER' }
    });
    console.log(`Updated \${updateAdmins.count} BOAT_ADMINs to OWNER`);

    console.log('Migrating BOAT_AUTHOR to CONTENT_MANAGER');
    const updateAuthors = await prisma.crewMember.updateMany({
        where: { role: 'BOAT_AUTHOR' },
        data: { role: 'CONTENT_MANAGER' }
    });
    console.log(`Updated \${updateAuthors.count} BOAT_AUTHORs to CONTENT_MANAGER`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
