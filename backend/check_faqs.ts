import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const faqs = await prisma.faqArticle.findMany();
  console.log("FAQ Count:", faqs.length);
  const posts = await prisma.post.findMany();
  console.log("Post Count:", posts.length);
}
main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
