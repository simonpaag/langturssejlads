import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const faqs = await prisma.faqArticle.findMany();
  console.log("FAQ Count:", faqs.length);
  const posts = await prisma.post.findMany({ select: { title: true, categoryId: true } });
  console.log("Posts:");
  console.log(posts.slice(0, 10)); // print first 10
}
main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
