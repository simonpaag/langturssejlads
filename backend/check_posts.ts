import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const posts = await prisma.post.findMany({ select: { title: true } });
  console.log("Posts:");
  console.log(posts.map(p => p.title));
}
main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
