import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const templates = [
    { name: 'INVITE_EMAIL', subject: 'Du er blevet anbefalet til Langturssejlads.dk ⛵', bodyHtml: '' },
    { name: 'BOAT_CONTACT_EMAIL', subject: 'Ny besked via profil: Langturssejlads.dk', bodyHtml: '' },
    { name: 'VOYAGE_CONTACT_EMAIL', subject: 'Ny togt-besked: Langturssejlads.dk', bodyHtml: '' },
  ];

  for (const t of templates) {
    await prisma.emailTemplate.upsert({
      where: { name: t.name },
      update: {},
      create: t
    });
  }
  console.log('Templates seeded successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
