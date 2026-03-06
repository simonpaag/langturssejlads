import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const apiKey = process.env.RESEND_API_KEY;
console.log("Key exists:", !!apiKey);
console.log("Length:", apiKey ? apiKey.length : 0);
