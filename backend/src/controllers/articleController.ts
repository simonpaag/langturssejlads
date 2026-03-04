import { Response } from 'express';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, content, youtubeUrl, boatId } = req.body;
        const authorId = req.user?.userId;

        if (!authorId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verify user is part of the boat crew
        const membership = await prisma.crewMember.findUnique({
            where: {
                userId_boatId: {
                    userId: authorId,
                    boatId: Number(boatId),
                },
            },
        });

        if (!membership) {
            res.status(403).json({ error: 'Forbidden. You are not a crew member of this boat.' });
            return;
        }

        const newArticle = await prisma.article.create({
            data: {
                title,
                content,
                youtubeUrl,
                authorId,
                boatId: Number(boatId),
                status: 'PUBLISHED', // Trust first!
            },
        });

        res.status(201).json({ message: 'Article published successfully', article: newArticle });
    } catch (error) {
        console.error('Create article error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateArticleStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'APPROVED' or 'REJECTED'
        const isSystemAdmin = req.user?.isSystemAdmin;

        if (!isSystemAdmin) {
            res.status(403).json({ error: 'Forbidden. System Admins only.' });
            return;
        }

        const updatedArticle = await prisma.article.update({
            where: { id: Number(id) },
            data: { status },
        });

        res.json({ message: 'Article status updated', article: updatedArticle });
    } catch (error) {
        console.error('Update article status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPublicArticles = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const articles = await prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            include: {
                author: { select: { id: true, name: true } },
                boat: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(articles);
    } catch (error) {
        console.error('Get articles error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getArticleById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const article = await prisma.article.findUnique({
            where: { id: Number(id) },
            include: {
                author: { select: { id: true, name: true } },
                boat: { select: { id: true, name: true } },
            },
        });

        if (!article) {
            res.status(404).json({ error: 'Article not found' });
            return;
        }

        res.json(article);
    } catch (error) {
        console.error('Get article by id error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllArticlesForAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const isSystemAdmin = req.user?.isSystemAdmin;

        if (!isSystemAdmin) {
            res.status(403).json({ error: 'Forbidden. System Admins only.' });
            return;
        }

        const articles = await prisma.article.findMany({
            include: {
                author: { select: { id: true, name: true } },
                boat: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(articles);
    } catch (error) {
        console.error('Get all articles error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
