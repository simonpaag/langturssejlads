import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const email = 'spa@spinnakernordic.com';
    console.log(`Checking user: ${email}...`);
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            crewMemberships: {
                include: { boat: true }
            }
        }
    });

    if (!user) {
        console.log('User not found in DB!');
    } else {
        console.log('USER ID:', user.id);
        console.log('CREW MEMBERSHIPS LENGTH:', user.crewMemberships.length);
        user.crewMemberships.forEach(member => {
            console.log(`- Boat: ${member.boat.name} (ID: ${member.boatId}), Role: ${member.role}`);
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
