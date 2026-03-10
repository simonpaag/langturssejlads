import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const emails = await prisma.sentEmail.findMany({
    where: { toEmail: 'dase@hansen.tdcadsl.dk' },
    orderBy: { sentAt: 'desc' }
  });
  console.dir(emails, { depth: null });
}

main().catch(console.error).finally(() => prisma.$disconnect());
