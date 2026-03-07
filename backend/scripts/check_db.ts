import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("DB URL:", process.env.DATABASE_URL ? "Exists" : "MISSING!");
    const invites = await prisma.boatInvitation.findMany();
    console.log("INVITES IN DB:", invites);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
