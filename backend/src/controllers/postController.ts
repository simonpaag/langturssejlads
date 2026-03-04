import { Response } from 'express';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';
import slugify from 'slugify';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, content, youtubeUrl, imageUrl, postType, voyageId, boatId } = req.body;
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

        // Generate a slug based on title or fallback to a timestamp string if no title
        const slugStr = title ? `${title}-${Date.now()}` : `post-${Date.now()}`;
        const slug = slugify(slugStr, { lower: true, strict: true });

        const newPost = await prisma.post.create({
            data: {
                slug,
                title,
                content,
                youtubeUrl,
                imageUrl,
                postType: postType || 'QUICK_TEXT',
                voyageId: voyageId ? Number(voyageId) : undefined,
                authorId,
                boatId: Number(boatId),
                status: 'PUBLISHED', // Trust first!
            },
        });

        res.status(201).json({ message: 'Post published successfully', post: newPost });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updatePostStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'APPROVED' or 'REJECTED'
        const isSystemAdmin = req.user?.isSystemAdmin;

        if (!isSystemAdmin) {
            res.status(403).json({ error: 'Forbidden. System Admins only.' });
            return;
        }

        const updatedPost = await prisma.post.update({
            where: { id: Number(id) },
            data: { status },
        });

        res.json({ message: 'Post status updated', post: updatedPost });
    } catch (error) {
        console.error('Update post status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPublicPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const posts = await prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            include: {
                author: { select: { id: true, name: true, profileImage: true } },
                boat: { select: { id: true, slug: true, name: true, profileImage: true } },
                voyage: { select: { id: true, title: true } }
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(posts);
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPostBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const post = await prisma.post.findUnique({
            where: { slug: String(slug) },
            include: {
                author: { select: { id: true, name: true, profileImage: true } },
                boat: { select: { id: true, slug: true, name: true, profileImage: true } },
                voyage: { select: { id: true, title: true } }
            },
        });

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        res.json(post);
    } catch (error) {
        console.error('Get post by id error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllPostsForAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const isSystemAdmin = req.user?.isSystemAdmin;

        if (!isSystemAdmin) {
            res.status(403).json({ error: 'Forbidden. System Admins only.' });
            return;
        }

        const posts = await prisma.post.findMany({
            include: {
                author: { select: { id: true, name: true, profileImage: true } },
                boat: { select: { id: true, slug: true, name: true, profileImage: true } },
                voyage: { select: { id: true, title: true } }
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(posts);
    } catch (error) {
        console.error('Get all posts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPostsByBoatId = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { boatId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const membership = await prisma.crewMember.findUnique({
            where: {
                userId_boatId: {
                    userId,
                    boatId: Number(boatId),
                },
            },
        });

        if (!membership) {
            res.status(403).json({ error: 'Forbidden. You are not a crew member of this boat.' });
            return;
        }

        const posts = await prisma.post.findMany({
            where: { boatId: Number(boatId) },
            include: {
                author: { select: { id: true, name: true, profileImage: true } },
                voyage: { select: { id: true, title: true } }
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(posts);
    } catch (error) {
        console.error('Get posts by boat ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const togglePostStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
        });

        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        const membership = await prisma.crewMember.findUnique({
            where: {
                userId_boatId: {
                    userId,
                    boatId: post.boatId,
                },
            },
        });

        if (!membership) {
            res.status(403).json({ error: 'Forbidden. You are not a crew member of this boat.' });
            return;
        }

        const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';

        const updatedPost = await prisma.post.update({
            where: { id: Number(id) },
            data: { status: newStatus },
        });

        res.json({ message: 'Post status toggled', post: updatedPost });
    } catch (error) {
        console.error('Toggle post status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
