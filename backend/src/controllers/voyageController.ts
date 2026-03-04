import { Request, Response } from 'express';
import { prisma } from '../server';

export const createVoyage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, startDate, endDate, boatId, fromLocation, toLocation, imageUrl } = req.body;

        if (!title || !startDate || !boatId) {
            res.status(400).json({ error: 'Titel, Startdato og Båd-ID er påkrævet.' });
            return;
        }

        const newVoyage = await prisma.voyage.create({
            data: {
                title,
                description,
                fromLocation,
                toLocation,
                imageUrl,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
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
        const voyage = await prisma.voyage.findUnique({
            where: { id: Number(req.params.id) },
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

export const updateVoyage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, startDate, endDate, fromLocation, toLocation, imageUrl } = req.body;
        const updated = await prisma.voyage.update({
            where: { id: Number(req.params.id) },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(fromLocation !== undefined && { fromLocation }),
                ...(toLocation !== undefined && { toLocation }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
            }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Kunne ikke opdatere togt' });
    }
};

export const deleteVoyage = async (req: Request, res: Response): Promise<void> => {
    try {
        await prisma.voyage.delete({ where: { id: Number(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Kunne ikke slette togt' });
    }
};
