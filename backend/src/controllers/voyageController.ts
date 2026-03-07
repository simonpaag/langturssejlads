import { Request, Response } from 'express';
import { prisma } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';
import { checkBoatAccess } from '../utils/authHelpers';
import slugify from 'slugify';

export const createVoyage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, startDate, endDate, boatId, fromLocation, toLocation, imageUrl, availableSeats, bunkFee } = req.body;
        const userId = req.user?.userId;

        if (!title || !startDate || !boatId) {
            res.status(400).json({ error: 'Titel, Startdato og Båd-ID er påkrævet.' });
            return;
        }

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const access = await checkBoatAccess(userId, Number(boatId), req.user?.isSystemAdmin || false);
        if (!access.hasAccess || (access.role !== 'OWNER' && access.role !== 'ADMIN')) {
            res.status(403).json({ error: 'Du har ikke rettigheder til at oprette togter for denne båd.' });
            return;
        }

        const slug = `${slugify(title, { lower: true, strict: true })}-${boatId}`;

        const newVoyage = await prisma.voyage.create({
            data: {
                title,
                slug,
                description,
                fromLocation,
                toLocation,
                imageUrl,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                availableSeats: availableSeats ? Number(availableSeats) : 0,
                bunkFee,
                boatId: Number(boatId)
            }
        });

        res.status(201).json(newVoyage);
    } catch (error) {
        console.error('Create voyage error:', error);
        res.status(500).json({ error: 'Kunne ikke oprette togt' });
    }
};

export const getVoyage = async (req: Request, res: Response): Promise<void> => {
    try {
        const param = req.params.id as string;
        const parsedId = Number(param);

        const voyage = await prisma.voyage.findFirst({
            where: isNaN(parsedId) ? { slug: param } : { id: parsedId },
            include: {
                boat: {
                    include: {
                        crewMemberships: {
                            include: {
                                user: {
                                    select: { id: true, name: true, profileImage: true }
                                }
                            }
                        }
                    }
                },
                posts: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: { select: { id: true, name: true, profileImage: true } }
                    }
                }
            }
        });

        if (!voyage) {
            res.status(404).json({ error: 'Togt ikke fundet' });
            return;
        }
        res.json(voyage);
    } catch (error) {
        res.status(500).json({ error: 'Fejl ved hentning af togt' });
    }
};

export const getVoyagesForBoat = async (req: Request, res: Response): Promise<void> => {
    try {
        const boatId = Number(req.params.boatId);
        const voyages = await prisma.voyage.findMany({
            where: { boatId },
            orderBy: { startDate: 'desc' }
        });
        res.json(voyages);
    } catch (error) {
        res.status(500).json({ error: 'Fejl ved hentning af togter for båden' });
    }
};

export const getAllVoyages = async (req: Request, res: Response): Promise<void> => {
    try {
        const voyages = await prisma.voyage.findMany({
            orderBy: { startDate: 'asc' },
            include: {
                boat: true
            }
        });
        res.json(voyages);
    } catch (error) {
        res.status(500).json({ error: 'Fejl ved hentning af alle togter' });
    }
};

export const updateVoyage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const voyageId = Number(req.params.id);
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const existingVoyage = await prisma.voyage.findUnique({ where: { id: voyageId } });
        if (!existingVoyage) {
            res.status(404).json({ error: 'Togt ikke fundet' });
            return;
        }

        const access = await checkBoatAccess(userId, existingVoyage.boatId, req.user?.isSystemAdmin || false);
        if (!access.hasAccess || (access.role !== 'OWNER' && access.role !== 'ADMIN')) {
            res.status(403).json({ error: 'Du har ikke rettigheder til at redigere dette togt.' });
            return;
        }

        const { title, description, startDate, endDate, fromLocation, toLocation, imageUrl, availableSeats, bunkFee } = req.body;
        const updated = await prisma.voyage.update({
            where: { id: voyageId },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(fromLocation !== undefined && { fromLocation }),
                ...(toLocation !== undefined && { toLocation }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(availableSeats !== undefined && { availableSeats: Number(availableSeats) }),
                ...(bunkFee !== undefined && { bunkFee }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
            }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Kunne ikke opdatere togt' });
    }
};

export const deleteVoyage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const voyageId = Number(req.params.id);
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const existingVoyage = await prisma.voyage.findUnique({ where: { id: voyageId } });
        if (!existingVoyage) {
            res.status(404).json({ error: 'Togt ikke fundet' });
            return;
        }

        const access = await checkBoatAccess(userId, existingVoyage.boatId, req.user?.isSystemAdmin || false);
        if (!access.hasAccess || (access.role !== 'OWNER' && access.role !== 'ADMIN')) {
            res.status(403).json({ error: 'Du har ikke rettigheder til at slette dette togt.' });
            return;
        }

        await prisma.voyage.delete({ where: { id: voyageId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Kunne ikke slette togt' });
    }
};
