import { Response } from 'express';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const boatId = parseInt(req.params.id as string);
        if (isNaN(boatId)) {
            res.status(400).json({ error: 'Ugyldigt Båd ID' });
            return;
        }

        const boat = await prisma.boat.findUnique({
            where: { id: boatId },
            select: { isBoardPublic: true, crewMemberships: { select: { userId: true } } }
        });

        if (!boat) {
            res.status(404).json({ error: 'Båden blev ikke fundet' });
            return;
        }

        // Check if user is a crew member
        const userId = req.user?.userId;
        const isCrew = userId ? boat.crewMemberships.some(membership => membership.userId === userId) : false;

        // If noticeboard is private, only crew members can see it
        if (!boat.isBoardPublic && !isCrew) {
            res.status(403).json({ error: 'Opslagstavlen er privat' });
            return;
        }

        const messages = await prisma.boardMessage.findMany({
            where: { boatId },
            include: {
                author: {
                    select: { id: true, name: true, profileImage: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(messages);
    } catch (error) {
        console.error('getMessages error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const boatId = parseInt(req.params.id as string);
        const userId = req.user?.userId;
        const { content } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Du skal være logget ind for at skrive' });
            return;
        }

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            res.status(400).json({ error: 'Indhold kan ikke være tomt' });
            return;
        }

        const boat = await prisma.boat.findUnique({ where: { id: boatId } });
        if (!boat) {
            res.status(404).json({ error: 'Båden findes ikke' });
            return;
        }

        const message = await prisma.boardMessage.create({
            data: {
                content: content.trim(),
                authorId: userId,
                boatId: boatId
            },
            include: {
                author: {
                    select: { id: true, name: true, profileImage: true }
                }
            }
        });

        res.status(201).json(message);
    } catch (error) {
        console.error('createMessage error:', error);
        res.status(500).json({ error: 'Kunne ikke oprette besked' });
    }
};

export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const messageId = parseInt(req.params.msgId as string);
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Ikke autoriseret' });
            return;
        }

        const message = await prisma.boardMessage.findUnique({
            where: { id: messageId },
            include: {
                boat: {
                    include: {
                        crewMemberships: {
                            where: { userId: userId, role: { in: ['OWNER', 'ADMIN'] } }
                        }
                    }
                }
            }
        });

        if (!message) {
            res.status(404).json({ error: 'Beskeden blev ikke fundet' });
            return;
        }

        const isAdmin = message.boat.crewMemberships.length > 0;
        const isAuthor = message.authorId === userId;

        // Either the author themselves or the OWNER/ADMIN can delete it
        if (!isAdmin && !isAuthor) {
            res.status(403).json({ error: 'Du har ikke rettigheder til at slette dette' });
            return;
        }

        await prisma.boardMessage.delete({
            where: { id: messageId }
        });

        res.json({ success: true, message: 'Besked slettet' });
    } catch (error) {
        console.error('deleteMessage error:', error);
        res.status(500).json({ error: 'Fejl ved sletning af besked' });
    }
};
