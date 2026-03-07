import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const invitations = await prisma.boatInvitation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    console.log('LATEST 10 INVITATIONS:', invitations);

    const testboatInvites = await prisma.boatInvitation.findMany({
        where: { boatId: 7 } // We know testboat has ID 7
    });
    console.log('INVITES FOR TESTBOAT (ID 7):', testboatInvites);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
