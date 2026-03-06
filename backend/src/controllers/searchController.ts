import { Request, Response } from 'express';
import { prisma } from '../server';

export const globalSearch = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        if (!query || query.trim() === '') {
            res.status(200).json({ boats: [], voyages: [], posts: [], faqs: [] });
            return;
        }

        const searchTerm = query.trim();

        const [boats, voyages, posts, faqs] = await Promise.all([
            prisma.boat.findMany({
                where: {
                    OR: [
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } },
                        { boatModel: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                select: { id: true, slug: true, name: true, boatModel: true },
                take: 10
            }),
            prisma.voyage.findMany({
                where: {
                    OR: [
                        { title: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } },
                        { fromLocation: { contains: searchTerm, mode: 'insensitive' } },
                        { toLocation: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                select: { id: true, slug: true, title: true, fromLocation: true, toLocation: true },
                take: 10
            }),
            prisma.post.findMany({
                where: {
                    status: 'PUBLISHED',
                    OR: [
                        { title: { contains: searchTerm, mode: 'insensitive' } },
                        { content: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                select: { id: true, slug: true, title: true },
                take: 10
            }),
            prisma.faqArticle.findMany({
                where: {
                    OR: [
                        { title: { contains: searchTerm, mode: 'insensitive' } },
                        { content: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                select: { id: true, slug: true, title: true },
                take: 10
            })
        ]);

        res.status(200).json({
            boats,
            voyages,
            posts,
            faqs
        });
    } catch (error) {
        console.error('Error during global search:', error);
        res.status(500).json({ error: 'Failed to perform search' });
    }
};
